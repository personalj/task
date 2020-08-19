import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

  const routes = [
  {
    path: '/',
    name: 'Home',
    meta: {layout: 'main'},
    props: true,
    component: () => import('../views/Home.vue')
  },
  {
    path: '/statistics',
    name: 'Statistics',
    meta: {layout: 'statistics'},
    props: {t: true},
    component: () => import('../views/Statistics.vue')
  },
  
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
