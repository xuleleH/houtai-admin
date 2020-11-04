<template>
  <div>
    <el-dialog :title="info.title" :visible.sync="info.isShow">
      <el-form :model="form">
        <el-form-item label="手机号" :label-width="width">
          <el-input v-model="form.phone" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="用户名" :label-width="width">
          <el-input v-model="form.nickname" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="密码" :label-width="width">
          <el-input v-model="form.password" autocomplete="off" show-password></el-input>
        </el-form-item>
        <el-form-item label="状态" :label-width="width">
          <el-switch v-model="form.status" :active-value="1" :inactive-value="2"></el-switch>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="cancel">取 消</el-button>
        <el-button type="primary" @click="amend">修 改</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { successAlert, waringAlert } from "../../../util/alert";

import {
  reqVipDetail,
  reqChangeVip
} from "../../../util/request";
export default {
  props: ["info"],
  components: {},
  data() {
    return {
      width: "100px",
      // isShow:true,
      form: {
          uid:"",
        nickname: "",
        phone: "",
        password: "",
        status: 1,
      },
    };
  },
  methods: {
    //点击取消按钮
    cancel() {
      this.info.isShow = false;
      this.form={
           uid:"",
        nickname: "",
        phone: "",
        password: "",
        status: 1,
      }
    },
    //重置数据
    empty() {
      this.form = {
         uid:"",
        nickname: "",
        phone: "",
        password: "",
        status: 1,
      };
    },
    
    //获取一条数据
    getOne(uid) {
      //form上没有id,有uid
      //发起获取一条的数据请求
      reqVipDetail(uid).then(res=> {
        this.form = res.data.list;
        //因为后端的密码是加密的，此时页面上的密码清空
        this.form.password="";
      });
    },
    //点击修改按钮
    amend(){
      if(this.form.nickname===""){
            waringAlert("用户名不能为空");
            return;
          }
          if(this.form.phone===""){
            waringAlert("手机号不能为空");
            return;
          }
          if(this.form.password===""){
            waringAlert("密码不能为空");
            return;
          }
      //发请求
      reqChangeVip(this.form).then(res=>{
            if(res.data.code==200){
              //弹出提示框
              successAlert("修改成功");
              //弹框消失
              this.cancel();
              //内容清空
              this.empty();
              //刷新列表
              this.$emit("init")
            }
      })
    }
  },
  mounted() {
    
  },
};
</script>

<style scoped>
</style>