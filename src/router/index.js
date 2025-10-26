import { createRouter, createWebHistory } from "vue-router";
import historyInfo from '../pages/historyInfo.vue'
import realTimeInfo from '../pages/realTimeInfo.vue'
import homePage from '../pages/homePage.vue'
const routes = [
    {path:'/',redirect:'/home'},
    {path:'/realtime-info',component:realTimeInfo,name:'realTimeInfo'},
    {path:'/home',component:homePage,name:'home'},
    {path:'/history-info',component:historyInfo,name:'historyInfo'}
]

const router=createRouter({
    history:createWebHistory(),
    routes
})
export default router