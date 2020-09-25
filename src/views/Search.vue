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
      :bottomText="resultListBottomText"
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
  methods: {
    async search(query) {

      try {

        await this.$store.dispatch(`search`, { query });

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
  created() {

    this.searchQuery = this.query;
    
  },
  mounted() {

    this.searchQuery = this.$route.params.query

    if (this.searchQuery !== ``) {
      this.search(this.searchQuery);
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
