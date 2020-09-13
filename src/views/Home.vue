<template>
  <div>

    {{ stats }}

    <SearchField
      class="w-1/2 h-12 m-auto my-20"
      v-model="searchQuery"
      @keydown.enter.native="search(searchQuery)"
    />

    <ResultList
      class="w-5/6 m-auto h-full bg-red-500"
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
      
    }
  },
  mounted() {

    this.$store.dispatch(`loadStats`);

  }
}
</script>
