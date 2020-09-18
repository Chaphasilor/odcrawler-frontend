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
    ><a class="text-blue-600 dark:text-blue-400" :href="link">{{ link }}</a></div>
    
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
  methods: {
    formatBytes(bytes, decimals = 2) {

      if (bytes === 0) return `0 B`;
    
      const k = 1024;
      const dm = decimals < 0 ? 0 : decimals;
      const sizes = [`B`, `KB`, `MB`, `GB`, `TB`, `PB`, `EB`, `ZB`, `YB`];
    
      const i = Math.floor(Math.log(bytes) / Math.log(k));
    
      return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ` ` + sizes[i];

    }
  }
}
</script>
