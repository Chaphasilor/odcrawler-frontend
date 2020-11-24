<template>
  <div
    class="w-full h-full p-4"
  >

    <vue-headful
      :title="pageTitle"
    />

    <!-- <div
      v-if="!isLandscape"
      class="p-2 mb-4 text-center bg-orange-500 rounded-lg dark:bg-orange-800"
    >
      This page isn't optimized for mobile yet.
      <br>
      Please use landscape mode for now!
    </div> -->

    <div
      class="flex-row justify-start md:flex md:mb-4"
    >

      <div
        class="flex-shrink-0 text-center md:w-20 md:text-left"
      >
        <router-link
          :to="{
            name: `Home`
          }"
        >
          <h1
            class="text-3xl font-semibold cursor-pointer"
          >
            <span class="hidden md:inline">ODC</span>
            <span class="inline md:hidden">ODCrawler</span>
          </h1>
        </router-link>
        
      </div>

      <SearchField
        class="h-auto ml-0 md:w-3/5 lg:w-192"
        v-model="searchQuery"
        :focus="false"
        :placeholder="`Search ${stats.totalIndexed} links...`"
        @search="search(searchQuery)"
      />

      <div
        class="flex flex-row flex-grow-0 flex-shrink-0 h-12 mt-1 ml-4 text-base md:w-2/5"
      >
      
        <div
          class="flex flex-col justify-center h-full pr-2 text-lg font-bold tracking-wider"
        >
          <span>TIP:</span>
        </div>

        <div
          class="flex flex-row h-full overflow-hidden"
        >
          <transition
            name="slideTips"
            enter-active-class="transition-all duration-1000 transform"
            enter-class="translate-x-64 opacity-0"
            enter-to-class="translate-x-0 opacity-100"
            leave-active-class="whitespace-no-wrap transition-all duration-700 transform"
            leave-class="translate-x-0 opacity-100"
            leave-to-class="w-0 -translate-x-64 opacity-0"
          >
          <div
            :key="activeTipIndex"
            class="flex flex-col justify-center h-auto leading-4 break-words"
          >
            <span>{{ activeTip }}</span>
          </div>
          </transition>
        </div>

      </div>

    </div>

    <ResultList
      class="flex flex-row justify-start w-full h-auto pb-16"
      :results="results"
      :pageSize="pageSize"
      :lowestPage="lowestPage"
      :scrollToInitialPage="highestPage"
      :message="message"
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
      message: {
        text: ``,
        level: `normal`,
      },
      activeTipIndex: 0,
      tips: [
        `You can click on subpaths to jump to the corresponding folder!`,
        `Strike-through'd links are most likely dead!`,
        `You can see the amount of pages on the left side of the links!`,
        `All links will open in a new tab!`,
        `If you want to go back to the first page, just press 'Search' again!`
      ],
      tipTimer: undefined,
      highestPage: 0,
      loadingResults: false,
      orientation: window.screen.orientation ? window.screen.orientation.type : `landscape-primary`,
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
    lowestPage: function() {
      return this.$store.getters.lowestPage;
    },
    infiniteScrollDisabled: function() {
      
      return this.results.hits.length === 0 || (this.results.hits.length % this.pageSize) != 0 || this.loadingResults || this.highestPage === 0;
    },
    pageTitle: function() {
      return this.searchQuery === `` ? `ODCrawler - Search` : `ODCrawler - ${this.searchQuery}${this.highestPage > 1 ? ` (${this.highestPage})` : ``}`;
    },
    isLandscape: function() {
      return this.orientation === 'landscape-primary';
    },
    activeTip: function() {
      return this.tips[this.activeTipIndex];
    }
  },
  methods: {
    async search(query, page = 1) {

      try {

        this.loadingResults = true;
        await this.$store.dispatch(`search`, { query, page });
        this.highestPage = page;

        // if (location.pathname != `/search/${query}`) {
        //   this.$router.push({
        //     path: `/search/${query}`,
        //   })
        // }

        if (this.$route.query.p && Number(this.$route.query.p) != this.highestPage) {
          this.$router.push({
            path: location.pathname,
            query: {
              p: this.highestPage,
            }
          })
        }

        if (this.results.hits.length == 0) {
          this.message = {
            text: `No links found!`,
            level: `warning`,
          }
        }

        return true;

      } catch (err) {

        this.message = {
          text: `Couldn't load search results :/`,
          level: `error`,
        }
        console.error(err);
        return false;
        
      } finally {
        this.loadingResults = false;
      }
      
    },
    async loadNextPage() {

      if (this.lowestPage == 0) {
        return;
      }

      console.log(`this.$store.getters.results.hits:`, this.$store.getters.results.hits);

      if (!(this.$store.getters.results.hits.length > 0)) {
        return;
      }

      // if (this.infiniteScrollDisabled) {

      //   this.message = {
      //     text: `No more links to load!`,
      //     level: `normal`,
      //   };
      //   return;
        
      // }

      this.message = {
        text: `Loading the next Page...`,
        level: `normal`,
      }

      this.$store.dispatch(`analytics/trackEvent`, `loadNextPage`);

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

        if (this.results.hits.length == 0) {
          this.message = {
            text: `No more links to load!`,
            level: `normal`,
          };
        } else {
          this.message.text = ``;
        }
        
      } catch (err) {
        this.message = {
          text: `Error while loading more links :/`,
          level: `error`,
        }
      } finally {
        this.loadingResults = false;
      }

    },
    handleOrientationChange() {
      this.orientation = window.screen.orientation ? window.screen.orientation.type : `landscape-primary`;
    }
  },
  created() {

    this.searchQuery = this.query;
    
  },
  mounted() {

    this.searchQuery = this.$route.params.query;
    let currentPage = Number(this.$route.query.p) || 0;

    if (this.searchQuery !== ``) {
      
      if (currentPage > 1) {
        this.search(this.searchQuery, currentPage).then(() => {

        })
      } else {
        this.search(this.searchQuery);
      }
    }

    this.currentTip = this.tips[0];

    // cycle through active tips
    this.tipTimer = setInterval(() => {

      this.activeTipIndex = this.activeTipIndex < this.tips.length-1 ? this.activeTipIndex+1 : 0;

    }, 7000);

    window.addEventListener(`orientationchange`, this.handleOrientationChange);

    this.$store.dispatch(`analytics/trackView`, `/search`);

  },
  beforeDestroy() {

    clearInterval(this.tipTimer);
    
  }
}
</script>
