export default {
  namespaced: true,
  state: {
    umami: window.umami,
  },
  mutations: {
    SET_UMAMI(state) {
      state.umami = window.umami;
    },
  },
  actions: {
    umamiLoaded(context, loaded) {

      if (loaded) {
        context.commit('SET_UMAMI');
      }

    },
    trackView(context, page) {

      if (process.env.NODE_ENV !== `production`) {
        return;
      }

      console.log(`page:`, page);

      let ref = document.referrer;

      ref = ref.replace(/(odcrawler\.xyz\/search\/)(.*)/, `$1`) // remove any search queries on odcrawler from the referrer
      
      if (!context.getters.umami) {

        let id = setInterval(() => {

          if (context.getters.umami) {
            context.getters.umami.trackView(page, ref);
            clearInterval(id);
          }
          
        }, 1000);
        
      } else {

        context.getters.umami.trackView(page, ref);
        
      }
      
    },
    trackEvent(context, event) {

      if (process.env.NODE_ENV !== `production`) {
        return;
      }

      // console.log(`event:`, event);

      if (!context.getters.umami) {

        let id = setInterval(() => {

          if (context.getters.umami) {
            context.getters.umami(event);
            clearInterval(id);
          }
          
        }, 1000);
        
      } else {

        context.getters.umami(event);
        
      }
      
    },
  },
  getters: {
    umami: state => state.umami,
  }
}
