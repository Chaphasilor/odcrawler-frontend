import Vue from 'vue'
import Vuex from 'vuex'
import API from '../assets/js/api'
import analyticsModule from './modules/analytics';
// import API from '@/assets/js/api.js';

Vue.use(Vuex)

const api = new API(process.env.VUE_APP_ES_ENDPOINT, `https://discovery.odcrawler.xyz`);

export default new Vuex.Store({
  modules: {
    analytics: analyticsModule,
  },
  state: {
    results: {
      query: ``,
      hits: [],
      totalHits: 0,
    },
    stats: {
      totalIndexed: 0,
      isIndexing: false,
      types: {},
    },
    dumpInfo: {
      url: `https://discovery.odcrawler.xyz/dump.zip`,
      numberOfLinks: 0,
      size: `Unknown`,
      created: new Date(),
    },
    pageSize: 40,
    lowestPage: 0,
    advancedOptions: {
      filenameOnly: false,
    }
  },
  mutations: {
    UPDATE_RESULTS(state, newResuls) {
      state.results = newResuls;
    },
    UPDATE_STATS(state, newStats) {
      state.stats = newStats;
    },
    UPDATE_LOWEST_PAGE(state, newLowestPage) {
      state.lowestPage = newLowestPage;
    },
    SET_ADVANCED_OPTIONS(state, advancedOptions) {
      state.advancedOptions = advancedOptions;
    },
    UPDATE_DUMP_INFO(state, newDumpInfo) {
      state.dumpInfo = newDumpInfo;
    },
  },
  actions: {
    async search(context, { query, page }) {

      let result;
      try {

        if (page) {

          if (page * context.getters.pageSize > 1000) {

            result = await api.search(query, (page-1) * context.getters.pageSize, context.getters.pageSize);
            context.commit(`UPDATE_LOWEST_PAGE`, page);
            
          } else {

            result = await api.search(query, 0, page * context.getters.pageSize);
            context.commit(`UPDATE_LOWEST_PAGE`, 1);
            
          }
          
        } else {

          result = await api.search(query, 0, context.getters.pageSize);
          context.commit(`UPDATE_LOWEST_PAGE`, 1);

        }

      } catch (err) {
        console.warn(err);
        throw new Error(`Couldn't load results!`);
      }

      if (result.query != query) {
        console.warn(`Query got corrupted on the way!`);
      }

      context.commit('UPDATE_RESULTS', result);
      
    },
    async loadNextPage(context) {

      let result;
      try {
        result = await api.search(context.getters.results.query, (context.getters.lowestPage-1)*context.getters.pageSize + context.getters.results.hits.length, context.getters.pageSize);
      } catch (err) {
        console.warn(err);
        throw new Error(`Couldn't load additional results!`);
      }

      if (result.query != context.getters.results.query) {
        console.warn(`Query got corrupted on the way!`);
      }

      result.hits = [...context.getters.results.hits, ...result.hits];
      
      context.commit('UPDATE_RESULTS', result);
      
    },
    async loadStats(context) {

      let stats;
      try {
        stats = await api.retrieveStats();
      } catch (err) {
        console.warn(err);
        throw new Error(`Couldn't load stats!`);
      }

      context.commit('UPDATE_STATS', stats);
      
    },
    changeAdvancedOptions(context, advancedOptions) {
      context.commit(`SET_ADVANCED_OPTIONs`, advancedOptions);
    },
    async loadDumpInfo(context) {

      let dumpInfo;
      try {
        dumpInfo = await api.retrieveDumpInfo();
      } catch (err) {
        console.warn(err);
        throw new Error(`Couldn't load dump info!`);
      }

      context.commit('UPDATE_DUMP_INFO', dumpInfo);
      
    },
  },
  getters: {
    results: state => state.results,
    stats: state => state.stats,
    pageSize: state => state.pageSize,
    lowestPage: state => state.lowestPage,
    advancedOptions: state => state.advancedOptions,
    dumpInfo: state => state.dumpInfo,
  }
})
