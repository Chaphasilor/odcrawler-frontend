<template>
  <div
    class="w-full h-full p-4"
  >

    <div
      class="w-full h-full flex-col justify-center flex"
    >

      <div
        class="w-full text-center flex-shrink-0"
      >

        <svg
          class="w-20 h-20 m-auto text-black dark:text-gray-200"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <title>{{ isIndexing ? `Currently indexing new links!` : `Not indexing right now...` }}</title>

          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
      
        <router-link
          :to="{
            name: `Home`,
          }"
        >
          <h1
            class="text-3xl font-semibold cursor-pointer"
          >
            ODCrawler
          </h1>
        </router-link>
        
        <h2
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

        <iframe
          class="m-auto mt-4"
          src="https://github.com/sponsors/MCOfficer/button"
          title="Sponsor MCOfficer"
          height="35"
          width="116"
        ></iframe>
        
      </div>

      <SearchField
        class="mx-auto my-12 w-3/4 lg:w-192 h-12"
        v-model="searchQuery"
        :focus="true"
        :placeholder="`Search ${stats.totalIndexed} links in open directories...`"
        @search="$router.push({
          name: `Search`,
          params: {
            query: searchQuery,
          }
        })"
      />

      <p
        class="w-3/4 lg:w-192 mx-auto px-10 text-center text-xs italic text-gray-600 dark:text-gray-600"
      >
        Links are automatically aggregated from all over the Internet. Illegal Content may be linked, but is in no way promoted or endorsed. If you have a problem with a link, please contact the owner of the hosting website.
      </p>

    </div>

  </div>
</template>

<script>

import SearchField from '@/components/SearchField';

export default {
  name: `Home`,
  components: {
    SearchField,
  },
  data: function() {
    return {
      searchQuery: ``,
      resultListBottomText: ``,
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
  methods: {

  },
  mounted() {

  },
}
</script>
