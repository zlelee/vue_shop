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
//富文本编辑器
import VueQuillEditor from 'vue-quill-editor'
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'
import 'quill/dist/quill.core.css' // import styles
import 'quill/dist/quill.snow.css' // for snow theme
import 'quill/dist/quill.bubble.css' // for bubble theme
Vue.use(VueQuillEditor /* { default global options } */)
Vue.component('tree-table', TreeTable)
Vue.config.productionTip = false
import axios from 'axios'
axios.defaults.baseURL = `http://127.0.0.1:8888/api/private/v1/`
axios.interceptors.request.use((config) => {
  config.headers.Authorization = window.sessionStorage.getItem('token')
  NProgress.start()
  return config
})
axios.interceptors.response.use((response) => {
  NProgress.done()
  if (response.data.meta.msg == '无效token' && response.data.meta.status == 400) {
    window.location.href = '#/login'
  }
  return response
})
Vue.filter('dateFormat', function(originVal) {
  const dt = new Date(originVal)
  const y = dt.getFullYear()
  const m = (dt.getMonth() + 1 + '').padStart(2, '0')
  const d = (dt.getDate() + '').padStart(2, '0')

  const hh = (dt.getHours() + '').padStart(2, '0')
  const mm = (dt.getMinutes() + '').padStart(2, '0')
  const ss = (dt.getSeconds() + '').padStart(2, '0')

  return `${y}-${m}-${d} ${hh}:${mm}:${ss}`
})
Vue.prototype.$http = axios
new Vue({
  router,
  render: (h) => h(App)
}).$mount('#app')
