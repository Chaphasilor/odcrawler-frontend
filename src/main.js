import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import "@/assets/css/tailwind.css";
import infiniteScroll from 'vue-infinite-scroll';
import TextHighlight from 'vue-text-highlight/dist/component';

Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')

Vue.use(infiniteScroll);
Vue.component('text-highlight', TextHighlight);
