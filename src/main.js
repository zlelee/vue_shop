import Vue from 'vue'
import App from './App.vue'
//引入路由文件
import router from './router'
//引入elementUi的包
import './plugins/element.js'
//引入全局的css文件
import './assets/css/globle.css'
//引入字体图标
import './assets/fonts/iconfont.css'
Vue.config.productionTip = false
import axios from 'axios'
axios.defaults.baseURL = `http://127.0.0.1:8888/api/private/v1/`
axios.interceptors.request.use((config) => {
  config.headers.Authorization = window.sessionStorage.getItem('token')
  return config
})
Vue.prototype.$http = axios

new Vue({
  router,
  render: (h) => h(App)
}).$mount('#app')
