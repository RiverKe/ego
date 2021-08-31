import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import './plugins/element.js'
import './assets/css/base.css'
// import './assets/css/iconfont.css'
import './utils/reset' //刷新获取本地的存储
import i18n from './language/Language' // vue 国际化插件引入
import api from './api';
Vue.prototype.$api = api;


Vue.config.productionTip = false

new Vue({
  router,
  store,
  i18n, // Vue I18n是Vue.js的国际化插件
  render: h => h(App)
}).$mount('#app')
