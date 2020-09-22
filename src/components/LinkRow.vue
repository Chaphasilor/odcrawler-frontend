<template>
  <div
    class="w-full h-auto flex flex-row"
  >

    <div
      class="w-14 mr-1 text-right flex-shrink-0"
    >{{ formatBytes(size) }}</div>

    <div
      class="w-full h-auto pl-1 whitespace-pre-wrap break-all"
    >

      <span
        v-for="(sublink, index) of sublinks"
        :key="index"
        class=""
      ><a
          :class="`${(index == sublinks.length-1 && alive === false) ? `line-through text-red-500` : `text-blue-600 dark:text-blue-400 hover:underline`} `"
          :title="(index == sublinks.length-1 && alive === false) ? `This link appears to be dead...` : ``"
          :href="sublink.link"
        ><text-highlight
          :queries="highlights"
          :caseSensitive="false"
          highlightClass="text-red-500"
          highlightComponent="span"
        >{{sublink.name}}</text-highlight></a><span v-if="index != sublinks.length-1"> / </span></span>
    
    </div>

    <div
      class="w-20 ml-1 pl-1 text-center flex-shrink-0 border-l border-black dark:border-gray-700 flex flex-col justify-center"
    >
      <button
        class="focus:outline-none"
        @click="copyLinkToClipboard"
      >Copy Link</button>
    </div>
    
  </div>
</template>

<script>
export default {
  name: `LinkRow`,
  props: {
    link: {
      type: String,
      required: true,
    },
    size: {
      type: Number,
      default: function() {
        return 0;
      }
    },
    highlights: {
      type: Array,
      default: function() {
        return ``;
      }
    },
  },
  data: function() {
    return {
      copied: false,
      alive: undefined,
    }
  },
  computed: {
    sublinks: function() {
      return this.generateSublinks(this.link);
    }
  },
  methods: {
    formatBytes(bytes, decimals = 0) {

      if (bytes === 0) return `0 B`;
    
      const k = 1024;
      const dm = decimals < 0 ? 0 : decimals;
      const sizes = [`B`, `KB`, `MB`, `GB`, `TB`, `PB`, `EB`, `ZB`, `YB`];
    
      const i = Math.floor(Math.log(bytes) / Math.log(k));
    
      return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ` ` + sizes[i];

    },
    generateSublinks(link) {

      let parts = link.split(`/`);
      parts.unshift(parts.splice(0, 3).join(`/`));

      parts = parts.map((part, index, arr) => {
        return {
          name: part,
          link: arr.reduce((sum, curr, innerIndex) => {
            if (innerIndex <= index) {
              return innerIndex == 0 ? curr : `${sum}/${curr}`; 
            } else {
              return sum;
            }
          }, ``),
        }
      })

      return parts;

    },
    copyLinkToClipboard() {

      navigator.clipboard.writeText(this.link)
      
    },
    async checkLinkAlive() {

      let schroedingersLink = this.link;
      let res;

      try {
        // res = await fetch(schroedingersLink, {
        //   method: `HEAD`,
        //   mode: `no-cors`,
        // })
        res = await fetch(`.netlify/functions/checkLinkAlive`, {
          method: `POST`,
          body: JSON.stringify({
            url: schroedingersLink,
          })
        })
      } catch (err) {

        console.warn(`Couldn't check if link is alive:`, err);
        return false;

      }

      console.log(`res:`, res);

      if (res.ok) {
        return true;
      } else {
        return false;
      }
      
    }
  },
  mounted() {

    this.checkLinkAlive().then(alive => this.alive = alive);

    this.generateSublinks(this.link);

    console.log(`this.highlights:`, this.highlights);
    
  }
}
</script>
