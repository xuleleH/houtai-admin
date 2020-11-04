import Vue from 'vue'
import Router from 'vue-router'
//引入仓库
import store from "../store/index"


Vue.use(Router)

const login = () => import("../pages/login/login");
const index = () => import("../pages/index/index");
const caidan = () => import("../pages/caidan/caidan");
const fenlei = () => import("../pages/fenlei/fenlei");
const guanli = () => import("../pages/guanli/guanli");
const guanliyuan = () => import("../pages/guanliyuan/guanliyuan");
const guige = () => import("../pages/guige/guige");
const home = () => import("../pages/home/home");
const juese = () => import("../pages/juese/juese");
const lunbo = () => import("../pages/lunbo/lunbo");
const miaosha = () => import("../pages/miaosha/miaosha");
const vip = () => import("../pages/vip/vip");

function checkedRoute(path,next){
  let userInfo = store.state.userInfo;
  if(userInfo.menus_url.includes(path)){
    next()
  }else{
    next("/index/home")
  }
}
//首页下面的二级路由
export const indexRouters = [
  {
    path: "caidan",
    component: caidan,
    name: "菜单列表",
    beforeEnter(to,from,next){
      //如果该用户menu_url中有就next,没有去首页
      checkedRoute("/caidan",next)
    }
  },
  {
    path: "fenlei",
    component: fenlei,
    name: "商品分类列表",
    beforeEnter(to,from,next){
      //如果该用户menu_url中有就next,没有去首页
      checkedRoute("/fenlei",next)
    }
  },
  {
    path: "guanli",
    component: guanli,
    name: "商品列表",
    beforeEnter(to,from,next){
      //如果该用户menu_url中有就next,没有去首页
      checkedRoute("/guanli",next)
    }
  },
  {
    path: "guanliyuan",
    component: guanliyuan,
    name: "管理员列表",
    beforeEnter(to,from,next){
      //如果该用户menu_url中有就next,没有去首页
      checkedRoute("/guanliyuan",next)
    }
  },
  {
    path: "guige",
    component: guige,
    name: "规格列表",
    beforeEnter(to,from,next){
      //如果该用户menu_url中有就next,没有去首页
      checkedRoute("/guige",next)
    }
  },
  {
    path: "home",
    component: home,
    name: "首页",
    
  },
  {
    path: "juese",
    component: juese,
    name: "角色列表",
    beforeEnter(to,from,next){
      //如果该用户menu_url中有就next,没有去首页
      checkedRoute("/juese",next)
    }
  },
  {
    path: "lunbo",
    component: lunbo,
    name: "轮播图列表",
    beforeEnter(to,from,next){
      //如果该用户menu_url中有就next,没有去首页
      checkedRoute("/lunbo",next)
    }
  },
  {
    path: "miaosha",
    component: miaosha,
    name: "活动列表",
    beforeEnter(to,from,next){
      //如果该用户menu_url中有就next,没有去首页
      checkedRoute("/miaosha",next)
    }
  },
  {
    path: "vip",
    component: vip,
    name: "会员列表",
    beforeEnter(to,from,next){
      //如果该用户menu_url中有就next,没有去首页
      checkedRoute("/vip",next)
    }
  },
]

let router = new Router({
  routes: [
    {
      //一级路由
      path: '/',
      component: login,
    },
    {
      path: "/index",
      component: index,
      //二级路由
      children: [
        {
          path: "",
          redirect: "home",
        },
        ...indexRouters

      ]
    }
  ]
})
//登录拦截
router.beforeEach((to, from, next) => {
  //去的是登录页，直接进入
  if (to.path === "/") {
    next();
    return;
  }
  //如果去的不是登录页，要先判断是否登录过了，从vuex/sessionstorage里面取，登录过了，就next,
  let userInfo = store.state.userInfo;
  if (userInfo.username) {
    next()
    return;
  }
    // //如果没有登录，就去登录
   next("/")

})
export default router;
