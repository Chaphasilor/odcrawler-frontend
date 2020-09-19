<template>
  <div
    class="w-full h-auto flex flex-row"
  >

    <div
      class="w-14 mr-1 text-right flex-shrink-0"
    >{{ formatBytes(size) }}</div>

    |

    <div
      class="w-full h-auto pl-1 whitespace-pre-wrap"
    >

      <span
        v-for="(sublink, index) of sublinks"
        :key="index"
        class=""
      ><a
          class="text-blue-600 dark:text-blue-400"
          :href="sublink.link"
        >{{sublink.name}}</a><span v-if="index != sublinks.length-1"> / </span></span>
    
      <!-- <a class="text-blue-600 dark:text-blue-400" :href="link">{{ link }}</a> -->
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
  },
  computed: {
    sublinks: function() {
      return this.generateSublinks(this.link);
    }
  },
  methods: {
    formatBytes(bytes, decimals = 2) {

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

      console.log(`parts:`, parts);
      
      return parts;

    },
    
  },
  mounted() {

    this.generateSublinks(this.link);
    
  }
}
</script>
