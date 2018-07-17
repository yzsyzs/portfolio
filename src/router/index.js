import Vue from 'vue'
import Router from 'vue-router'
import HelloWorld from '@/components/HelloWorld'
// import Portfolio from '@/components/portfolio/portfolio'
Vue.use(Router)
// 按需加载
const Portfolio = (resolve) => {
  import('@/components/portfolio/portfolio').then((module) => {
    resolve(module)
  })
}
let routes = [
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
const router = new Router({
  mode: 'history',
  base: __dirname,
  routes: routes
})
export default router
