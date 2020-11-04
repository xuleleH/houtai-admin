<template>
  <div>
    <el-dialog :title="info.title" :visible.sync="info.isShow">
      <el-form :model="form">
        <el-form-item label="所属角色" :label-width="width">
          <el-select v-model="form.roleid">
            <el-option label="--请选择--" value disabled></el-option>
            <el-option
              v-for="item in roleList"
              :key="item.id"
              :label="item.rolename"
              :value="item.id"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="用户名" :label-width="width">
          <el-input v-model="form.username" autocomplete="off"></el-input>
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
        <el-button type="primary" @click="add" v-if="info.title == '用户添加'">添 加</el-button>
        <el-button type="primary" @click="amend" v-else>修 改</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { successAlert, waringAlert } from "../../../util/alert";

import {
  reqRoleList,
  reqAddAdmin,
  reqAdminDetail,
  reqChangeAdmin,
} from "../../../util/request";
export default {
  props: ["info"],
  components: {},
  data() {
    return {
      width: "100px",
      // isShow:true,
      form: {
        roleid: "",
        username: "",
        password: "",
        status: 1,
      },
      //角色的列表
      roleList: [],
    };
  },
  methods: {
    //点击取消按钮
    cancel() {
      this.info.isShow = false;
      this.form = { roleid: "", username: "", password: "", status: 1 };
    },
    //重置数据
    empty() {
      this.form = {
        roleid: "",
        username: "",
        password: "",
        status: 1,
      };
    },
    //验证
    checked() {
      return new Promise((resolve, reject) => {
        if (this.form.roleid === "") {
          waringAlert("所属角色不能为空");
          return;
        }
        if (this.form.username === "") {
          waringAlert("用户名不能为空");
          return;
        }
        if (this.form.password === "") {
          waringAlert("密码不能为空");
          return;
        }
        resolve();
      });
    },
    //点击添加按钮
    add() {
      //console.log(this.form);
      this.checked().then(() => {
        reqAddAdmin(this.form).then((res) => {
          console.log(res);
          if ((res.data.code = 200)) {
            //弹出提示框
            successAlert("添加成功");
            //数据重置
            this.empty();
            //弹框消失
            this.cancel();
            //刷新列表
            this.$emit("init");
          }
        });
      });
    },
    //获取一条数据
    getOne(uid) {
      //form上没有id,有uid
      //发起获取一条的数据请求
      reqAdminDetail(uid).then((res) => {
        this.form = res.data.list;
        //因为后端的密码是加密的，此时页面上的密码清空
        this.form.password = "";
      });
    },
    //点击修改按钮
    amend() {
      this.checked().then(() => {
        //发请求
        reqChangeAdmin(this.form).then((res) => {
          if (res.data.code == 200) {
            //弹出提示框
            successAlert("修改成功");
            //弹框消失
            this.cancel();
            //内容清空
            this.empty();
            //刷新列表
            this.$emit("init");
          }
        });
      });
    },
  },
  mounted() {
    //一进来就请求角色管理的列表
    reqRoleList().then((res) => {
      //console.log(res);
      if (res.data.code == 200) {
        this.roleList = res.data.list;
      }
    });
  },
};
</script>

<style scoped>
</style>