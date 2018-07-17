/**
 * http配置
 */
import axios from 'axios'
import router from '../router/index'

// axios 配置
axios.defaults.timeout = 5000

// http request 拦截器
axios.interceptors.request.use(
  config => {
    // if (/* store.state.token */localStorage.mmaAdminToken) {
    //   config.headers.Authorization = localStorage.mmaAdminToken // `token ${store.state.token}`
    // }
    return config
  },
  err => {
    return Promise.reject(err)
  })

// http response 拦截器
axios.interceptors.response.use(
  response => {
    // console.log(response)
    return response
  },
  error => {
    console.error(error)
    if (error.response) {
      switch (error.response.status) {
        case 401:
        case 403:
          router.replace({
            path: '/',
            query: {redirect: router.currentRoute.fullPath}
          })
          // sessionStorage.removeItem('token')
          break
      }
    }
    // console.log(JSON.stringify(error));//console : Error: Request failed with status code 402
    return Promise.reject(error.response.data)
  })

export default axios
