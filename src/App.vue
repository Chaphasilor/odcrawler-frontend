<template>
  <div
    id="app"
    class="absolute w-full h-full text-gray-900 dark:text-gray-100 font-quicksand"
  >

    <router-view />
    
  </div>
</template>

<script>

export default {
  name: 'App',
  components: {
  },
  created() {

    this.$store.dispatch(`loadStats`);
    
  }
}
</script>
