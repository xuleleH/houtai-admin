// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'

Vue.config.productionTip = false

//1 引入静态资源 reset.css
import "./assets/css/reset.css";
//import "./assets/js/rem.js";
//2 处理公共组件
import Common from "./common"
for(let i in Common){
  Vue.common(i,Common[i])
}

//3 处理过滤器
import Filter from "./filter"
for(let i in Filter){
  Vue.filter(i,Filter[i])
}
//4 处理仓库
import store from "./store"

//5 处理数据请求

//6 引入第三方组件element-ui
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';

Vue.use(ElementUI);

new Vue({
  el: '#app',
  router,
  store,//挂载
  components: { App },
  template: '<App/>'
})
