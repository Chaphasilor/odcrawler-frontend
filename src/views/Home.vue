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

        <!-- <object type="image/svg+xml"
          :data="require(`@/assets/icons/cog.svg`)"
          v-if="initialPosition"
          class="w-16 h-16 m-auto text-black dark:text-gray-200 animate-spin-slow"
          src="@/assets/icons/cog.svg"
        /> -->

        <svg
          v-if="initialPosition"
          class="w-20 h-20 m-auto text-black dark:text-gray-200 animate-spin-slow"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <title>{{ isIndexing ? `Currently indexing new links!` : `Not indexing right now...` }}</title>

          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
      
        <h1
          class="text-3xl font-semibold cursor-pointer"
          @click="initialPosition = true; searchQuery = ``"
        >
          {{ initialPosition ? `ODCrawler` : `ODC` }}
        </h1>
        <h2
          v-if="initialPosition"
          class="text-base"
        >

          Powered by 
          <a
            class="text-blue-600 dark:text-blue-400 underline"
            href="https://github.com/KoalaBear84/OpenDirectoryDownloader/"
          >OpenDirectoryDownloader</a>
          and 
          <a
            class="text-blue-600 dark:text-blue-400 underline"
            href="https://www.meilisearch.com/"
          >MeiliSearch</a>

        </h2>
      </div>

      <SearchField
        :class="`${initialPosition ? `mx-auto my-16` : `ml-0`} w-3/4 lg:w-192 h-12`"
        v-model="searchQuery"
        :placeholder="`Search ${stats.totalIndexed} links in open directories...`"
        @search="search(searchQuery)"
      />

      <p
        v-if="initialPosition"
        class="w-3/4 lg:w-192 mx-auto px-10 text-center text-xs italic text-gray-600 dark:text-gray-600"
      >
        Links are automatically aggregated from all over the Internet. Illegal Content may be linked, but is in no way promoted or endorsed. If you have a problem with a link, please contact the owner of the hosting website.
      </p>

    </div>

    <ResultList
      v-if="!initialPosition"
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
    },
    isIndexing: function() {
      return this.stats.isIndexing;
    },
  },
  methods: {
    async search(query) {

      try {

        await this.$store.dispatch(`search`, { query });
        this.initialPosition = false;

      } catch (err) {

        console.error(err);
        alert(`Couldn't load search results :/`);
        
      }
      
    }
  },
  mounted() {

    // this.$store.dispatch(`loadStats`);

  },
  beforeMount() {

    this.$store.dispatch(`loadStats`);
    
  }
}
</script>
