import Vue from 'vue'
import Router from 'vue-router'
import HelloWorld from '@/components/HelloWorld'
import Portfolio from '@/components/portfolio/portfolio'
Vue.use(Router)

export default new Router({
  mode: 'history',
  routes: [
    {
      path: '/',
      name: 'HelloWorld',
      component: HelloWorld
    },
    {
      path: '/portfolio',
      name: 'portfolio',
      component: Portfolio
    }
  ]
})
