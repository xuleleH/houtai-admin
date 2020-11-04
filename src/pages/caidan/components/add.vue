<template>
  <div>
    <el-dialog :title="info.title" :visible.sync="info.isShow" @closed="close">
      <el-form :model="form">
        <el-form-item label="菜单名称" :label-width="width">
          <el-input v-model="form.title" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="上级菜单" :label-width="width">
          <el-select
            v-model="form.pid"
            placeholder="请选择活动区域"
            @change="changePid"
          >
            <el-option label="顶级菜单" :value="0"></el-option>
            <!-- 动态数据 -->
            <el-option
              v-for="item in list"
              :key="item.id"
              :label="item.title"
              :value="item.id"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="菜单类型" :label-width="width">
          <el-radio v-model="form.type" :label="1">目录</el-radio>
          <el-radio v-model="form.type" :label="2">菜单</el-radio>
        </el-form-item>
        <el-form-item
          label="菜单图标"
          :label-width="width"
          v-if="form.type == 1"
        >
          <el-select v-model="form.icon" placeholder="请选择目录图标">
            <el-option value="el-icon-user-solid">
              <i class="el-icon-user-solid"></i>
            </el-option>
            <el-option value="el-icon-phone-outline">
              <i class="el-icon-phone-outline"></i>
            </el-option>
            <el-option value="el-icon-s-goods">
              <i class="el-icon-s-goods"></i>
            </el-option>
            <el-option value="el-icon-help">
              <i class="el-icon-help"></i>
            </el-option>
            <el-option value="el-icon-s-home">
              <i class="el-icon-s-home"></i>
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="菜单地址" :label-width="width" v-else>
          <el-select v-model="form.url">
            <el-option value="" label="---请选择---" disabled></el-option>
            <el-option
              v-for="item in indexRouters"
              :key="item.path"
              :label="item.name"
              :value="'/' + item.path"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="状态" :label-width="width">
          <el-switch
            v-model="form.status"
            :active-value="1"
            :inactive-value="2"
          ></el-switch>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="cancel">取 消</el-button>
        <el-button type="primary" @click="add" v-if="info.isAdd"
          >添 加</el-button
        >
        <el-button type="primary" @click="updata" v-else>修 改</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { indexRouters } from "../../../router/index";
import {
  reqAddMenu,
  reqCaidanDetail,
  reqChangeMenu,
} from "../../../util/request";
import { successAlert, waringAlert } from "../../../util/alert";
import { mapGetters, mapActions } from "vuex";
export default {
  props: ["info"],
  components: {},
  computed: {
    ...mapGetters({
      list: "caidan/list",
    }),
  },
  data() {
    return {
      //渲染必须是data里的数据
      indexRouters: indexRouters,
      //label距框左边的宽度
      width: "120px",
      //弹框出现状态
      //isShow: true,
      //表单数据
      form: {
        pid: 0,
        title: "",
        icon: "",
        type: 1,
        url: "",
        status: 1,
      },
    };
  },
  methods: {
    ...mapActions({
      reqList: "caidan/reqListAction",
    }),
    //弹窗关闭后添加里的内容清空
    close(){
      //如果是编辑，取消了，就要把没添加成功的弹筐里的内容清空掉
      if(!this.info.isAdd){
        this.empty();
      }
    },
    //子组件修改父组件的数据，自定义事件
    cancel() {
      this.$emit("hide");
    },
    //修改了pid
    changePid() {
      this.form.type = this.form.pid == 0 ? 1 : 2;
    },
    //重置弹框里的内容
    empty() {
      this.form = {
        pid: 0,
        title: "",
        icon: "",
        type: 1,
        url: "",
        status: 1,
      };
    },
    //验证数据不为空
    checked(){
      return new Promise((resolve,reject)=>{
        if(this.form.pid===""){
          waringAlert("上级菜单不能为空");
          return;
        }
        if(this.form.title===""){
          waringAlert("菜单名称不能为空");
          return;
        }
        resolve();
      })
    },
    //点击添加按钮==>发请求
    add() {
      this.checked().then(()=>{
          reqAddMenu(this.form).then((res) => {
        if (res.data.code == 200) {
          //添加成功
          successAlert(res.data.msg);
          //同时弹框消失
          this.$emit("hide");
          //弹框里的信息重置
          this.empty();
          //添加成功后渲染到页面上
          this.reqList();
        }
      });
      })
    
    },
    //查看一条数据
    look(id) {
      // console.log("查看数据");
      //获取一条数据
      reqCaidanDetail({ id: id }).then((res) => {
        this.form = res.data.list;
        this.form.id = id;
      });
    },
    //点击修改
    updata() {
      this.checked().then(()=>{
        reqChangeMenu(this.form).then((res) => {
        if(res.data.code==200){
          successAlert("修改成功");
          //通知父组件  弹框消失
          this.$emit("hide");
          //弹框里的数据清空
           this.empty();
           //页面重新更新
           this.reqList();

        }
      });
      })
      
    },
  },
  mounted() {},
};
</script>

<style scoped>
</style>