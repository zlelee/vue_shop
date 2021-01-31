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
import TreeTable from 'vue-table-with-tree-grid'
Vue.component('tree-table', TreeTable)
Vue.config.productionTip = false
import axios from 'axios'
axios.defaults.baseURL = `http://127.0.0.1:8888/api/private/v1/`
axios.interceptors.request.use((config) => {
  config.headers.Authorization = window.sessionStorage.getItem('token')
  return config
})
axios.interceptors.response.use((response) => {
  if (response.data.meta.msg == '无效token' && response.data.meta.status == 400) {
    window.location.href = '#/login'
  }
  return response
})
Vue.prototype.$http = axios
new Vue({
  router,
  render: (h) => h(App)
}).$mount('#app')
