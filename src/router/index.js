import Vue from 'vue'
import VueRouter from 'vue-router'
import login from '../components/login.vue'
//注册路由组件
Vue.use(VueRouter)

const routes = [
  { path: '/', component: login },
  { path: '/login', component: login }
]

const router = new VueRouter({
  routes
})

export default router
