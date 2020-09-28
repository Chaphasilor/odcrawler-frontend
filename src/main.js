import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import "@/assets/css/tailwind.css";
import infiniteScroll from 'vue-infinite-scroll';
import TextHighlight from 'vue-text-highlight/dist/component';
import vueHeadful from 'vue-headful';

Vue.config.productionTip = false

Vue.use(infiniteScroll);
Vue.component('vue-headful', vueHeadful);
Vue.component('text-highlight', TextHighlight);

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
