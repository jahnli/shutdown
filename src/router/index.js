import Vue from 'vue'
import VueRouter from 'vue-router'
Vue.use(VueRouter)

const router = new VueRouter({
  mode: process.env.IS_ELECTRON ? 'hash' : 'history'
})

export default router
