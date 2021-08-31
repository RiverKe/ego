import Vue from 'vue';
import VueRouter from 'vue-router';
import Layout from '../views/Layout';
import Goods from '../views/Goods';
import Login from '../views/Login';
import store from '../store';

Vue.use(VueRouter)
//编程式导航：重复点击一个路由 报错
//解决方式：1.降低路由版本 3.0.7  2.重写路由的js文件
const originalPush = VueRouter.prototype.push
VueRouter.prototype.push = function push(location) {
  return originalPush.call(this, location).catch(err => err)
}

// 按需加载组件
const Advert = () => import('../views/Advert');
const User = () => import('../views/User');
const Params = () => import('../views/Params');

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'Layout',
    component: Layout,
    meta: {
      isLogin: true,
    },
    children: [
      {
        path: '/',
        name: 'Goods',
        component: Goods
      },
      {
        path: '/params',
        name: 'Params',
        component: Params
      },
      {
        path: '/advert',
        name: 'Advert',
        component: Advert
      },
      {
        path: '/user',
        name: 'User',
        component: User
      },
    ]
  },
  {
    path: '/login',
    name: 'Login',
    component: Login
  },
]

const router = new VueRouter({
  routes
})

// 路由全局守卫
router.beforeEach((to,from, next)=>{
  if(to.matched.some(ele=>ele.meta.isLogin)){//需要登录
    //判断当前是否登录
    let token=store.state.loginModule.userinfo.token;
    // let token = false;
    if(token){
      next();
    }else{
      next('/login');
    }
  }else{
    next()
  }
})

export default router
