<template>
  <div
    class="w-full h-full px-6"
  >

    <vue-headful
      title="Page not Found!"
    />

    <nav
      class="absolute top-0 left-0 p-6 text-lg"
    >
      <router-link
        class="hover:font-bold"
        :to="{
          name: `Home`,
        }"
      >
        Start Page
      </router-link>
    </nav>

    <div
      class="flex flex-col w-full h-full"
    >

      <div
        class="flex flex-col justify-center flex-shrink-0 w-full md:h-full"
      >

        <svg
          class="w-32 h-32 mx-auto mt-12 md:mt-0 stroke-current stroke-1.5"
          viewBox="0 0 24 24"
          fill="none"
          stroke-linecap="round"
          stroke-linejoin="round"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
          <circle cx="12" cy="12" r="9" />
          <line x1="9" y1="10" x2="9.01" y2="10" />
          <line x1="15" y1="10" x2="15.01" y2="10" />
          <path d="M9.5 16a10 10 0 0 1 6 -1.5" />
        </svg>

        <div
          class="flex-shrink-0 w-full mx-auto mt-4 mb-6 text-center md:w-1/2"
        >

          <h1
            class="block mb-6 text-3xl font-semibold cursor-pointer"
          >
            We haven't indexed this link yet...
          </h1>

          <h2
            class="block w-full text-lg font-semibold cursor-pointer"
          >
            We couldn't find the page you were looking for.
            How about you try a search instead? :D
          </h2>
          
        </div>

        <SearchField
          class="w-full h-12 mx-auto mt-10 mb-4 md:my-4 md:w-192"
          v-model="searchQuery"
          :focus="true"
          :placeholder="`Search ${stats.totalIndexed} links...`"
          @search="$router.push({
            name: `Search`,
            params: {
              query: searchQuery,
            }
          }).catch(console.warn)"
        />

      </div>

    </div>

  </div>
</template>

<script>

import SearchField from '@/components/SearchField';

export default {
  name: `FourOhFour`,
  components: {
    SearchField,
  },
  data: function() {
    return {
      searchQuery: ``,
    };
  },
  computed: {
    stats: function() {
      return this.$store.getters.stats;
    },
    isIndexing: function() {
      return this.stats.isIndexing;
    },
  },
  mounted() {

    this.$store.dispatch(`analytics/trackEvent`, `404`);

  },
}
</script>
