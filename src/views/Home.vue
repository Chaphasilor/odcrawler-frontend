<template>
  <div
    class="w-full h-full p-4"
  >

    <div
      :class="`${initialPosition ? `w-full h-full flex-col justify-center` : `flex-row justify-start mb-4`} flex`"
    >

      <div
        :class="`${initialPosition ? `w-full text-center` : `w-20 text-left` } flex-shrink-0`"
      >
        <h1
          class="text-3xl font-semibold"
        >
          {{ initialPosition ? `ODCrawler` : `ODC` }}
        </h1>
        <h2
          v-if="initialPosition"
          class="text-base"
        >

          Powered by 
          <a
            class="text-blue-600 underline"
            href="https://github.com/KoalaBear84/OpenDirectoryDownloader/"
          >OpenDirectoryDownloader</a>
          and 
          <a
            class="text-blue-600 underline"
            href="https://www.meilisearch.com/"
          >MeiliSearch</a>

        </h2>
      </div>

      <SearchField
        :class="`${initialPosition ? `mx-auto my-20` : `ml-0`} w-3/4 lg:w-192 h-12`"
        v-model="searchQuery"
        @keydown.enter.native="search(searchQuery)"
      />

    </div>

    <ResultList
      class="w-full h-auto flex flex-row justify-start"
      :results="results.hits"
    />
    
  </div>
</template>

<script>

import SearchField from '@/components/SearchField';
import ResultList from '@/components/ResultList';

export default {
  name: `Home`,
  components: {
    SearchField,
    ResultList,
  },
  data: function() {
    return {
      initialPosition: true,
      searchQuery: ``,
    };
  },
  computed: {
    results: function() {
      return this.$store.getters.results;
    },
    stats: function() {
      return this.$store.getters.stats;
    }
  },
  methods: {
    search(query) {

      this.$store.dispatch(`search`, { query });
      this.initialPosition = false;
      
    }
  },
  mounted() {

    this.$store.dispatch(`loadStats`);

  }
}
</script>
