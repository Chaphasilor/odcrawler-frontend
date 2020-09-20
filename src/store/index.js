import Vue from 'vue'
import Vuex from 'vuex'
import API from '../assets/js/api'
// import API from '@/assets/js/api.js';

Vue.use(Vuex)

var baseUrl = `https://odcrawler.xyz`;
var api = new API(baseUrl);

export default new Vuex.Store({
  state: {
    results: [],
    stats: {},
    pageSize: 20,
  },
  mutations: {
    UPDATE_RESULTS(state, newResuls) {
      state.results = newResuls;
    },
    UPDATE_STATS(state, newStats) {
      state.stats = newStats;
    },
  },
  actions: {
    async search(context, { query }) {

      let result;
      try {
        result = await api.search(query, 0, context.getters.pageSize);
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
        result = await api.search(context.getters.results.query, context.getters.results.hits.length, context.getters.pageSize);
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
  },
  getters: {
    results: state => state.results,
    stats: state => state.stats,
    pageSize: state => state.pageSize,
  }
})
