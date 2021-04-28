import Vue from 'vue'
import Vuex from 'vuex'
import API from '../assets/js/api'
import analyticsModule from './modules/analytics';
// import API from '@/assets/js/api.js';

Vue.use(Vuex)

const api = new API(process.env.VUE_APP_ES_ENDPOINT, `https://discovery.odcrawler.xyz`, process.env.VUE_APP_LAMBDA_ENDPOINT);

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
      filenameOnly: {
        text: `Filename-only Search`,
        type: `toggle`,
        value: false,
      },
      matchPhrase: {
        text: `Use Phrase-Matching`,
        type: `toggle`,
        value: true,
      },
      extensions: {
        text: `Filter Extensions`,
        type: `keywords`,
        value: true,
        options: [
          {
            text: `Included`,
            value: `include`,
          },
          {
            text: `Excluded`,
            value: `exclude`,
          },
        ],
        selectedOption: `exclude`,
        keywords: [`html`],
      }
    },
    loadingLinkInfo: false,
  },
  mutations: {
    UPDATE_RESULTS(state, newResults) {
      state.results = newResults;
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
    SET_LOADING_LINK_INFO(state, loading) {
      state.loadingLinkInfo = loading;
    },
  },
  actions: {
    async search(context, { query, page }) {

      context.commit(`UPDATE_RESULTS`, {
        hits: [],
        totalHits: 0,
        query,
      })
      
      let result;
      try {

        if (page) {

          if (page * context.getters.pageSize > 1000) {

            result = await api.search(query, (page-1) * context.getters.pageSize, context.getters.pageSize, context.getters.searchOptions);
            context.commit(`UPDATE_LOWEST_PAGE`, page);
            
          } else {

            result = await api.search(query, 0, page * context.getters.pageSize, context.getters.searchOptions);
            context.commit(`UPDATE_LOWEST_PAGE`, 1);
            
          }
          
        } else {

          result = await api.search(query, 0, context.getters.pageSize, context.getters.searchOptions);
          context.commit(`UPDATE_LOWEST_PAGE`, 1);

        }

      } catch (err) {
        console.warn(err);
        throw new Error(`Couldn't load results!`);
      }

      if (result.query != query) {
        console.warn(`Query got corrupted on the way!`);
        context.dispatch(`analytics/trackEvent`, `corruptedQuery`);
      }

      context.commit('UPDATE_RESULTS', result);
      
      context.dispatch(`loadLinkInfo`, result.hits);
      
    },
    async loadNextPage(context) {

      let result;
      try {

        result = await api.search(context.getters.results.query, (context.getters.lowestPage-1)*context.getters.pageSize + context.getters.results.hits.length, context.getters.pageSize, context.getters.searchOptions);

      } catch (err) {
        console.warn(err);
        throw new Error(`Couldn't load additional results!`);
      }

      if (result.query != context.getters.results.query) {
        console.warn(`Query got corrupted on the way!`);
      }

      context.dispatch(`loadLinkInfo`, result.hits);
      
      // combine the new results with the existing ones
      result.hits = [...context.getters.results.hits, ...result.hits];

      context.commit('UPDATE_RESULTS', result);
      
    },
    async loadLinkInfo(context, hitsToCheck) {

      // enable link info loading indicator and request link info from the lambda function
      context.commit(`SET_LOADING_LINK_INFO`, true);
      api.checkLinks(hitsToCheck.map(hit => hit.url))
      .then(linkInfo => {

        // add the info to the corresponding hit object
        linkInfo.forEach(info => {
          
          const foundLink = context.getters.results.hits.find(hit => hit.url === info.url)
          if (foundLink) {
            foundLink.meta = info 
          }

        })

        // disable the link info loading indicator (causes info to be shown)
        context.commit(`SET_LOADING_LINK_INFO`, false);

      })
      .catch(err => {
        
        // if info failed to load, also disable the loading indicator and show the fallback
        context.commit(`SET_LOADING_LINK_INFO`, false);
        console.warn(err)

      })
      .finally(() => {

        hitsToCheck.map(hit => hit.url).forEach(url => {

          const foundLink = context.getters.results.hits.find(hit => hit.url === url)
          if (foundLink) {
            foundLink.meta.checked = true;
          }

        })
        
      })
      
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
    // updateAdvancedOptions(context, advancedOptions) {
    //   context.commit(`SET_ADVANCED_OPTIONs`, advancedOptions);
    // },
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
    searchOptions: state => {
      return {
        filenameOnly: state.advancedOptions.filenameOnly.value,
        matchPhrase: state.advancedOptions.matchPhrase.value,
        extensions: state.advancedOptions.extensions.value ? {
          mode: state.advancedOptions.extensions.selectedOption,
          list: state.advancedOptions.extensions.keywords,
        } : undefined,
      };
    },
    dumpInfo: state => state.dumpInfo,
    loadingLinkInfo: state => state.loadingLinkInfo,
  }
})
