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

      console.log(`page:`, page);

      if (!context.getters.umami) {

        let id = setInterval(() => {

          if (context.getters.umami) {
            context.getters.umami.trackView(page);
            clearInterval(id);
          }
          
        }, 1000);
        
      } else {

        context.getters.umami.trackView(page);
        
      }
      
    },
    trackEvent(context, event) {

      console.log(`event:`, event);

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
