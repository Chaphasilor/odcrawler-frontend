<template>
  <div
    class="w-full h-full p-4"
  >

    <div
      class="flex flex-row justify-start mb-4"
    >

      <div
        class="w-20 text-left flex-shrink-0"
      >
        <router-link
          :to="{
            name: `Home`
          }"
        >
          <h1
            class="text-3xl font-semibold cursor-pointer"
          >
            ODC
          </h1>
        </router-link>
        
      </div>

      <SearchField
        class="ml-0 w-3/4 lg:w-192 h-12"
        v-model="searchQuery"
        :focus="false"
        :placeholder="`Search ${stats.totalIndexed} links in open directories...`"
        @search="search(searchQuery)"
      />

      <div
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

    </div>

    <ResultList
      class="w-full h-auto flex flex-row justify-start pb-32"
      :results="results"
      :pageSize="pageSize"
      :lowestPage="lowestPage"
      :scrollToInitialPage="highestPage"
      :bottomText="resultListBottomText"
      :disableInfiniteScroll="infiniteScrollDisabled"
      @end-of-list="loadNextPage"
    />
    
  </div>
</template>

<script>

import SearchField from '@/components/SearchField';
import ResultList from '@/components/ResultList';

export default {
  name: `Search`,
  components: {
    SearchField,
    ResultList,
  },
  data: function() {
    return {
      searchQuery: ``,
      resultListBottomText: ``,
      activeTipIndex: 0,
      tips: [
        `You can click on subpaths to jump to the corresponing folder!`,
        `Striked-through links are most likely dead!`,
        `You can see the amount of pages on the left side of the links!`
      ],
      tipTimer: undefined,
      lowestPage: 0,
      highestPage: 0,
      loadingResults: false,
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
    infiniteScrollDisabled: function() {
      return this.loadingResults || this.highestPage === 0;
    }
  },
  methods: {
    async search(query, page = 1) {

      try {

        this.loadingResults = true;
        await this.$store.dispatch(`search`, { query, page });
        this.lowestPage = page;
        console.log(`this.lowestPage:`, this.lowestPage);
        this.highestPage = page;
        return true;

      } catch (err) {

        console.error(err);
        alert(`Couldn't load search results :/`);
        return false;
        
      } finally {
        this.loadingResults = false;
      }
      
    },
    async loadNextPage() {

      if (this.lowestPage == 0) {
        return;
      }

      this.resultListBottomText = `Loading the next Page...`

      try {

        this.loadingResults = true;
        await this.$store.dispatch(`loadNextPage`);
        this.highestPage = this.highestPage + 1;

        this.$router.push({
          path: this.$router.path,
          query: {
            p: this.highestPage,
          }
        })
        
        this.resultListBottomText = ``;

      } catch (err) {
        this.resultListBottomText = `Error while loading more links :/`
      } finally {
        this.loadingResults = false;
      }

    },
  },
  created() {

    this.searchQuery = this.query;
    
  },
  mounted() {

    this.searchQuery = this.$route.params.query
    this.lowestPage = Number(this.$route.query.p) || 0;

    if (this.searchQuery !== ``) {
      
      if (this.lowestPage > 1) {
        this.search(this.searchQuery, this.lowestPage).then(success => {
          console.log(`success:`, success);
          //TODO smooth-scroll to requested page
        })
      } else {
        this.search(this.searchQuery);
      }
    }

    this.currentTip = this.tips[0];

    // cycle through active tips
    this.tipTimer = setInterval(() => {

      this.activeTipIndex = this.activeTipIndex < this.tips.length-1 ? this.activeTipIndex+1 : 0;

    }, 7000)

  },
  beforeDestroy() {

    clearInterval(this.tipTimer);
    
  }
}
</script>
