import Vue from 'vue'
import App from './App.vue'
import router from './router'
//引入elementUi的包
import './plugins/element.js'
//引入全局的css文件
import './assets/css/globle.css'
//引入字体图标
import './assets/fonts/iconfont.css'
Vue.config.productionTip = false

new Vue({
  router,
  render: (h) => h(App)
}).$mount('#app')
