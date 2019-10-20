import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/Home.vue'
import Canvas from '../views/Canvas.vue'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'home',
    component: Home
  },
  {
    path: '/gltf',
    name: 'gltf',
    component: Canvas
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
