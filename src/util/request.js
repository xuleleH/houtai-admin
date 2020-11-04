import axios from "axios"
import qs from "qs"
import {waringAlert} from "./alert";
import Vue from "vue";
import store from "../store/index"

//开发环境中使用

let baseUrl = "/api";
Vue.prototype.$imgPre="http://localhost:3000"

//生产环境，打包
//let baseUrl = "";
//ue.prototype.$imgPre="";
//请求拦截
axios.interceptors.request.use(req=>{
    console.log("请求拦截：---");
    console.log(req);
    //请求的地址不是登录，就配置请求头
    if(req.url!==baseUrl+"/api/userlogin"){
      req.headers.authorization=store.state.userInfo.token;  
    }
    
    return req;
})
//响应拦截
axios.interceptors.response.use(res => {
    console.group("====本次请求的地址是:" + res.config.url + "====");
    console.log(res);
    if(res.data.code!==200){
        waringAlert(res.data.msg)
    }
    //判断是否被登录过期
    if(res.data.msg==="登录已过期或访问权限受限"){
        router.push("/");
        //用户信息置空
        store.dispatch("changeUserInfoAction",{})
    }
    return res;
})
//1 菜单添加
export const reqAddMenu = (form) => {
    return axios({
        url: baseUrl + "/api/menuadd",
        method: "post",
        data:qs.stringify(form)
    })
}

//2 菜单列表params{}
export const reqCaidanList=(params)=>{
    return axios({
        url: baseUrl + "/api/menulist",
        method: "get",
        params:params,//params传一个对象
    })
}

//3 菜单获取 一条params{}
export const reqCaidanDetail=(params)=>{
    return axios({
        url: baseUrl + "/api/menuinfo",
        method: "get",
        params:params,//params传一个对象
    })
}

//4 菜单修改
export const reqChangeMenu = (form) => {
    return axios({
        url: baseUrl + "/api/menuedit",
        method: "post",
        data:qs.stringify(form)
    })
}

//5 菜单删除params{id:1}
export const reqDelMenu = (params) => {
    return axios({
        url: baseUrl + "/api/menudelete",
        method: "post",
        data:qs.stringify(params)
    })
}

//1 角色添加
export const reqAddRole = (form) => {
    return axios({
        url: baseUrl + "/api/roleadd",
        method: "post",
        data:qs.stringify(form)
    })
}

//2 角色列表params{}
export const reqRoleList=()=>{
    return axios({
        url: baseUrl + "/api/rolelist",
        method: "get",
    })
}

//3 角色获取 一条params{}
export const reqRoleDetail=(params)=>{
    return axios({
        url: baseUrl + "/api/roleinfo",
        method: "get",
        params:params,//params传一个对象
    })
}

//4 角色修改
export const reqChangeRole = (form) => {
    return axios({
        url: baseUrl + "/api/roleedit",
        method: "post",
        data:qs.stringify(form)
    })
}

//5 角色删除params{id:1}
export const reqDelRole = (params) => {
    return axios({
        url: baseUrl + "/api/roledelete",
        method: "post",
        data:qs.stringify(params)
    })
}

//1 管理员添加
export const reqAddAdmin = (form) => {
    return axios({
        url: baseUrl + "/api/useradd",
        method: "post",
        data:qs.stringify(form)
    })
}

//2 管理员总数（用于计算分页）
export const reqSumAdmin=()=>{
    return axios({
        url: baseUrl + "/api/usercount",
        method: "get",
    })
}

//3 管理员列表（分页）
export const reqListAdmin=(params)=>{
    return axios({
        url: baseUrl + "/api/userlist",
        method: "get",
        params:params,
    })
}

//4 管理员获取（一条）
export const reqAdminDetail=(uid)=>{
    return axios({
        url: baseUrl + "/api/userinfo",
        method: "get",
        params:{uid:uid},
    })
}

//5 管理员修改
export const reqChangeAdmin = (form) => {
    return axios({
        url: baseUrl + "/api/useredit",
        method: "post",
        data:qs.stringify(form)
    })
}

//6 管理员删除
export const reqDelAdmin = (uid) => {
    return axios({
        url: baseUrl + "/api/userdelete",
        method: "post",
        data:qs.stringify({uid:uid})
    })
}

//7 管理员登录
export const reqLoginAdmin = (params) => {
    return axios({
        url: baseUrl + "/api/userlogin",
        method: "post",
        data:qs.stringify(params)
    })
}

//1 商品分类添加
export const reqAddSort = (form) => {
    return axios({
        url: baseUrl + "/api/cateadd",
        method: "post",
        data:form,//有图片，用formData转换
    })
}

//2 商品分类列表
export const reqListSort=(params)=>{
    return axios({
        url: baseUrl + "/api/catelist",
        method: "get",
        params:params,
    })
}

//3 商品分类获取（一条）
export const reqSortDetail=(id)=>{
    return axios({
        url: baseUrl + "/api/cateinfo",
        method: "get",
        params:{id:id},
    })
}

//4 商品分类修改
export const reqChangeSort = (data) => {
    return axios({
        url: baseUrl + "/api/cateedit",
        method: "post",
        data:data,//有图片，用formData转换
    })
}

//5 商品分类删除
export const reqDelSort = (id) => {
    return axios({
        url: baseUrl + "/api/catedelete",
        method: "post",
        data:qs.stringify({id:id})
    })
}

//1 商品规格添加
export const reqAddSpec = (form) => {
    return axios({
        url: baseUrl + "/api/specsadd",
        method: "post",
        data:qs.stringify(form),
    })
}

//2 商品规格列表
export const reqListSpec=(params)=>{
    return axios({
        url: baseUrl + "/api/specslist",
        method: "get",
        params:params,
    })
}

//3 商品规格删除
export const reqSpecDel=(id)=>{
    return axios({
        url: baseUrl + "/api/specsdelete",
        method: "post",
        data:qs.stringify({id:id}),
    })
}

//4 商品规格获取（一条）
export const reqSpecDetail=(id)=>{
    return axios({
        url: baseUrl + "/api/specsinfo",
        method: "get",
        params:{id:id},
    })
}

//5 商品规格总数（用于计算分页）
export const reqSpecCount = () => {
    return axios({
        url: baseUrl + "/api/specscount",
        method: "get",
        
    })
}

//6 商品规格修改
export const reqChangeSpec = (data) => {
    return axios({
        url: baseUrl + "/api/specsedit",
        method: "post",
        data:qs.stringify(data),
    })
}


//1 商品添加
export const reqAddGoods = (form) => {
    return axios({
        url: baseUrl + "/api/goodsadd",
        method: "post",
        data:form, //有文件FormData转换
    })
}

//2 商品列表
export const reqListGoods=(params)=>{
    return axios({
        url: baseUrl + "/api/goodslist",
        method: "get",
        params:params,
    })
}

//3 商品删除
export const reqGoodsDel=(id)=>{
    return axios({
        url: baseUrl + "/api/goodsdelete",
        method: "post",
        data:qs.stringify({id:id}),
    })
}

//4 商品获取（一条）
export const reqGoodsDetail=(id)=>{
    return axios({
        url: baseUrl + "/api/goodsinfo",
        method: "get",
        params:{id:id},
    })
}

//5 商品总数（用于计算分页）
export const reqGoodsCount = () => {
    return axios({
        url: baseUrl + "/api/goodscount",
        method: "get",
        
    })
}

//6 商品修改
export const reqChangeGoods = (data) => {
    return axios({
        url: baseUrl + "/api/goodsedit",
        method: "post",
        data:data,//有文件FormData转换
    })
}

//会员列表
export const reqListVip=()=>{
    return axios({
        url:baseUrl+"/api/memberlist",
        method:"get",
    })
}

//2 会员获取一条数据
export const reqVipDetail=(uid)=>{
    return axios({
        url: baseUrl + "/api/memberinfo",
        method: "get",
        params:{uid:uid},
    })
}

//5 会员修改
export const reqChangeVip = (form) => {
    return axios({
        url: baseUrl + "/api/memberedit",
        method: "post",
        data:qs.stringify(form)
    })
}


//1 轮播图添加
export const reqAddBanner = (form) => {
    return axios({
        url: baseUrl + "/api/banneradd",
        method: "post",
        data:form,//有图片，用formData转换
    })
}

//2 轮播图列表
export const reqListBanner=()=>{
    return axios({
        url: baseUrl + "/api/bannerlist",
        method: "get",
    })
}

//3 轮播图获取（一条）
export const reqBannerDetail=(id)=>{
    return axios({
        url: baseUrl + "/api/bannerinfo",
        method: "get",
        params:{id:id},
    })
}

//4 轮播图修改
export const reqChangeBanner = (data) => {
    return axios({
        url: baseUrl + "/api/banneredit",
        method: "post",
        data:data,//有图片，用formData转换
    })
}

//5 轮播图删除
export const reqDelBanner = (id) => {
    return axios({
        url: baseUrl + "/api/bannerdelete",
        method: "post",
        data:qs.stringify({id:id})
    })
}


//1 限时秒杀添加
export const reqAddSeck = (form) => {
    return axios({
        url: baseUrl + "/api/seckadd",
        method: "post",
        data:qs.stringify(form)
    })
}

//2 限时秒杀列表
export const reqListSeck=()=>{
    return axios({
        url: baseUrl + "/api/secklist",
        method: "get",
    })
}

//3 限时秒杀获取（一条）
export const reqSeckDetail=(id)=>{
    return axios({
        url: baseUrl + "/api/seckinfo",
        method: "get",
        params:{id:id},
    })
}

//4 限时秒杀修改
export const reqChangeSeck = (data) => {
    return axios({
        url: baseUrl + "/api/seckedit",
        method: "post",
        data:qs.stringify(data),
    })
}

//5 限时秒杀删除
export const reqDelSeck = (id) => {
    return axios({
        url: baseUrl + "/api/seckdelete",
        method: "post",
        data:qs.stringify({id:id})
    })
}

//登录
export const reqLogin= (form) => {
    return axios({
        url: baseUrl + "/api/userlogin",
        method: "post",
        data:qs.stringify(form)
    })
}