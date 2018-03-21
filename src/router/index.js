import Vue from 'vue'
import Router from 'vue-router'
import device from '@/page/device/index'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '',
      name: 'device',
      component: device
    },
    {
      path: '/device',
      name: 'device',
      component: device
    }
  ]
})
