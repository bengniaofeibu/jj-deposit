import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

const login = r => require.ensure([], () => r(require('@/components/login')), 'login')
const operation = r => require.ensure([], () => r(require('@/components/operation')), 'operation')
const userReturn = r => require.ensure([], () => r(require('@/components/userReturn')), 'userReturn')

export default new Router({
  routes: [
    {
      path: '/',
      name: 'login',
      component: login
    },
    {
      path: '/operation',
      name: 'operation',
      component: operation
    },
    {
      path: '/userReturn',
      name: 'userReturn',
      component: userReturn
    }
  ]
})
