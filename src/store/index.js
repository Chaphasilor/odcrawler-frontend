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
        result = await api.search(query);
      } catch (err) {
        console.warn(err);
        throw new Error(`Couldn't load results!`);
      }

      if (result.query != query) {
        console.warn(`Query got corrupted on the way!`);
      }

      context.commit('UPDATE_RESULTS', result);
      
    },
    async loadStats(context) {

      let stats;
      try {
        stats = await api.retrieveStats();
      } catch (err) {
        console.warn(err);
        throw new Error(`Couldn't load results!`);
      }

      context.commit('UPDATE_STATS', stats);
      
    },
  },
  getters: {
    results: state => state.results,
    stats: state => state.stats,
  }
})
