import Vue from 'vue'
import VueRouter from 'vue-router'
import home from "@/views/home"
import part1 from '@/views/part1'
import part2 from '@/views/part2'
import part3 from '@/views/part3'
import part4 from '@/views/part4'
import part5 from '@/views/part5'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    redirect: '/home'
  },
  {
    path: '/home',
    name: '首页',
    component: home
  },
  {
    path: '/part1',
    name: '醉技千秋',
    meta: { dataForm: "《传统白酒酿造技术》、《白酒酿造与技术创新》、《白酒生产技术全书》等" },
    component: part1
  },
  {
    path: '/part2',
    name: '佳酿美学',
    meta: { dataForm: "《中国白酒品评宝典》、《微生物及其酿酒应用研究》" },
    component: part2
  },
  {
    path: '/part3',
    name: '酒色逸香',
    meta :{dataForm: "《中国白酒品评宝典》、白酒质量等级国家标准等"},
    component: part3
  },
  {
    path: '/part4',
    name: '酿酒名家',
    meta :{dataForm: "酒志网、中国酒文化网站等"},
    component: part4
  },
  {
    path: '/part5',
    name: '酒厂厂志',
    meta :{dataForm: "酒志网、《白酒生产技术全书》等"},
    component: part5
  }
]

const router = new VueRouter({
  routes
})

export default router
