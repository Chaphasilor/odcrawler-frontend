import Vue from 'vue'
import VueRouter from 'vue-router'

import Home from '../views/Home.vue'
import Search from '../views/Search.vue'
import Download from '../views/Download.vue'
import FourOhFour from '../views/FourOhFour.vue'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home
  },
  {
    path: '/search',
    redirect: {
      name: 'Home',
    }
  },
  {
    path: '/search/:query',
    name: 'Search',
    component: Search,
  },
  {
    path: '/download',
    name: 'Download',
    component: Download,
  },
  // 404, leave this as last route!!!
  {
    path: '/*',
    component: FourOhFour
  },
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
