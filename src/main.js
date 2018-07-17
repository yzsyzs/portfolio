// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import '@/assets/scss/style.scss'
import Vue from 'vue'
import App from './App'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import router from './router'
// 引入全局过滤器
import filters from './filters/index'
Vue.use(ElementUI)
// 设置给Vue
Object.keys(filters).forEach(function (key) {
  Vue.filter(key, filters[key])
})
Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  components: {
    App
  },
  template: '<App/>'
})
