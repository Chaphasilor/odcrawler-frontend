<template>
  <div
    class="w-full h-auto flex flex-row"
  >

    <div
      class="w-14 mr-1 text-right flex-shrink-0"
    >{{ formattedSize }}</div>

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
          rel="noopener noreferrer"
          target="_blank"
          :href="sublink.link"
        ><text-highlight
          :queries="highlights"
          :caseSensitive="false"
          highlightClass="bg-yellow-500 dark:bg-yellow-900"
          highlightComponent="span"
        >{{sublink.name}}</text-highlight></a><span v-if="index != sublinks.length-1" class="text-blue-600 dark:text-blue-400">/</span></span>
    
    </div>

    <div
      class="w-28 ml-4 text-center flex-shrink-0 border-l border-black dark:border-gray-700 flex flex-col justify-center"
    >
      
      <button
        class="mx-1 px-2 rounded-full font-bold hover:bg-gray-400 dark:hover:bg-gray-700 focus:outline-none"
        @click="copyLinkToClipboard"
      >
        <transition
          mode="out-in"
          name="fade"
          enter-active-class="transition-opacity duration-150"
          enter-class="opacity-0"
          enter-to-class="opacity-100"
          leave-active-class="transition-opacity duration-150"
          leave-class="opacity-100"
          leave-to-class="opacity-0"
        >
          <span v-if="!copied" key="0">Copy Link</span>
          <span v-if="copied" key="1" class="text-green-500">Copied!</span>
        </transition>
      </button>
    </div>

    <div
      class="w-24 lg:w-auto text-center flex-shrink-0 border-l border-black dark:border-gray-700 flex flex-col justify-center"
    >
      <button
        class="mx-1 px-2 rounded-full font-bold hover:bg-gray-400 dark:hover:bg-gray-700 focus:outline-none"
        @click="openNewTab(`https://www.virustotal.com/gui/search/${doubleEncodedUrl}`)"
      >
        Scan for Viruses
      </button>
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
    },
    doubleEncodedUrl: function() {
      return encodeURIComponent(encodeURIComponent(this.link));
    },
    formattedSize: function() {
      return this.size >= 0 ? this.formatBytes(this.size) : `N/A`;
    }
  },
  watch: {
    copied: {
      handler: function(newValue) {

        if (newValue) {
          setTimeout(() => {
            this.copied = false;
          }, 1000)
        }

      }
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

      navigator.clipboard.writeText(encodeURI(this.link));
      this.copied = true;
      
    },
    openNewTab(url) {
      window.open(url);
    },
    async checkLink() {

      // reduce number of lambda calls
      if (Math.random(1) > 0.15) {
        return;
      } 

      let schroedingersLink = this.link;
      let res;

      try {
        res = await fetch(`/.netlify/functions/checkLinkAlive`, {
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

      if ([502, 504].includes(res.status)) {
        return false;
      }

      let body;
      try {
        body = await res.json();
      } catch (err) {
        console.warn(`Couldn't parse JSON from response body!`);
        return res.ok;
      }

      if (body.sizeInBytes > 0) {
        this.size = body.sizeInBytes;
      }
      return body.isAlive;
      
    }
  },
  mounted() {

    this.checkLink().then(alive => this.alive = alive);

    this.generateSublinks(this.link);

    console.log(`this.highlights:`, this.highlights);
    
  }
}
</script>
