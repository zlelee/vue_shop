import Vue from 'vue'
import VueRouter from 'vue-router'
import login from '../components/login.vue'
import home from '../components/home.vue'
import welcome from '../components/welcome.vue'
//注册路由组件
Vue.use(VueRouter)

const routes = [
  { path: '/', component: login },
  { path: '/login', component: login },
  { path: '/home', component: home, redirect: '/welcome', children: [{ path: '/welcome', component: welcome }] }
]

const router = new VueRouter({
  routes
})
router.beforeEach((to, from, next) => {
  if (to.path == '/login') return next()
  const tokenStr = window.sessionStorage.getItem('token')
  if (!tokenStr) return next('/login')
  next()
})
export default router
