<template>
  <div>

    {{ results }}
    
  </div>
</template>

<script>
export default {
  name: `ResultList`,
  components: {

  },
  props: {
    results: {
      type: Array,
      default: function() {
        return [];
      }
    },
  }
}
</script>
