<template>
  <div class="bigBox">
    <div class="box">
      <h3>登录</h3>
      <input type="text" v-model="form.username" placeholder="请输入用户名" class="ipt"/>
      <input type="password" v-model="form.password" placeholder="请输入密码" class="ipt"/>
      <div>
         <input type="button" value="登录" class="btn" @click="login"/>
      </div>
    </div>
  </div>
</template>

<script>
import {reqLogin} from "../../util/request";
import {successAlert,waringAlert}from "../../util/alert";
import {mapActions} from "vuex"
export default {
  components: {},
  data() {
    return {
      form: {
        username: "",
        password: "",
      },
    };
  },
  methods: {
    ...mapActions(["changeUserInfoAction"]),
    login(){
      reqLogin(this.form).then(res=>{
        if(res.data.code==200){
          //存用户信息 结合vuex
          //本地存储 优：刷新以后数据还在，缺：取值不好取
          //vuex 优：取值好取，缺：刷新数据没有，回到最初值
          this.changeUserInfoAction(res.data.list)
          //跳转页面
          this.$router.push("/index/home");
        }
      })
    }
  },
  mounted() {},
};
</script>

<style scoped>
.bigBox{
  width: 100vw;
  height: 100vh;
 background: linear-gradient(to right,rgb(104, 90, 13),rgb(122, 18, 18));
 position: relative;
}
.box{
  width: 560px;
  height: 300px;
  background: #ffffff;
  border-radius: 10px;
  position: absolute;
  left: 0;
  top: 0;
  right: 0;
  bottom: 0;
  margin: auto;
  text-align: center;
  
}
.ipt{
  width: 360px;
  height: 40px;
  margin:20px;
  padding-left: 10px;
  border-radius: 4px;
  border: 1px solid #b9b7b7;
}
.btn{
  width: 374px;
  height: 44px;
  color: #ffffff;
  border: none;
  font-size: 20px;
  border-radius: 4px;
  background: rgb(64, 158, 255);
}
h3{
  font-size: 30px;
  margin: 10px;
}
</style>