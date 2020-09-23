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
        :focus="initialPosition"
        :placeholder="`Search ${stats.totalIndexed} links in open directories...`"
        @search="search(searchQuery)"
      />

      <div
        v-if="!initialPosition"
        class="w-1/4 flex-grow-0 flex-shrink-0 h-12 ml-2 text-sm font-bold flex flex-row"
      >
      
        <div
          class="h-full flex flex-col justify-center pr-2"
        >
          <span>TIP:</span>
        </div>

        <div
          class="h-full flex flex-row overflow-hidden"
        >
          <transition
            name="slideTips"
            enter-active-class="transform transition-all duration-1000"
            enter-class="translate-x-64 opacity-0"
            enter-to-class="translate-x-0 opacity-100"
            leave-active-class="transform transition-all duration-700 whitespace-no-wrap"
            leave-class="translate-x-0 opacity-100"
            leave-to-class="-translate-x-64 opacity-0 w-0"
          >
          <div
            v-if="index == activeTipIndex"
            class="h-auto flex flex-col justify-center break-words leading-4"
            v-for="(tip, index) of tips"
            :key="index"
          >
            <span>{{ tip }}</span>
          </div>
          </transition>
        </div>

      </div>

      <p
        v-if="initialPosition"
        class="w-3/4 lg:w-192 mx-auto px-10 text-center text-xs italic text-gray-600 dark:text-gray-600"
      >
        Links are automatically aggregated from all over the Internet. Illegal Content may be linked, but is in no way promoted or endorsed. If you have a problem with a link, please contact the owner of the hosting website.
      </p>

    </div>

    <ResultList
      v-if="!initialPosition"
      class="w-full h-auto flex flex-row justify-start pb-32"
      :results="results"
      :pageSize="pageSize"
      :bottomText="resultListBottomText"
      @end-of-list="loadNextPage"
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
      resultListBottomText: ``,
      activeTipIndex: 0,
      tips: [
        `You can click on subpaths to jump to the corresponing folder!`,
        `Striked-through links are most likely dead!`,
        `You can see the amount of pages on the left side of the links!`
      ],
      tipTimer: undefined,
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
    pageSize: function() {
      return this.$store.getters.pageSize;
    },
  },
  // watch: {
  //   currentTip: {
  //     handler: function() {
  //       console.log(`TEEEEST`)
  //       setTimeout(() => {
  //         let currentIndex = this.tips.indexOf(this.currentTip);
  //         console.log(`currentIndex:`, currentIndex);
  //         console.log(`this.currentTip:`, this.currentTip);
  //         this.currentTip = currentIndex < this.tips.length-1 ? this.tips[currentIndex+1] : this.tips[0];
  //       }, 7000);
  //     }
  //   }
  // },
  methods: {
    async search(query) {

      try {

        await this.$store.dispatch(`search`, { query });
        this.initialPosition = false;

      } catch (err) {

        console.error(err);
        alert(`Couldn't load search results :/`);
        
      }
      
    },
    async loadNextPage() {

      this.resultListBottomText = `Loading the next Page...`

      try {

        await this.$store.dispatch(`loadNextPage`);
        this.resultListBottomText = ``;

      } catch (err) {
        this.resultListBottomText = `Error while loading more links :/`
      }

    },
  },
  mounted() {

    // this.$store.dispatch(`loadStats`);
    this.currentTip = this.tips[0];

    // cycle through active tips
    this.tipTimer = setInterval(() => {

      this.activeTipIndex = this.activeTipIndex < this.tips.length-1 ? this.activeTipIndex+1 : 0;

    }, 7000)

  },
  beforeMount() {

    this.$store.dispatch(`loadStats`);
    
  },
  beforeDestroy() {

    clearInterval(this.tipTimer);
    
  }
}
</script>
