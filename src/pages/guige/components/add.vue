<template>
  <div>
    <el-dialog :title="info.title" :visible.sync="info.isShow">
      <el-form :model="form">
        <el-form-item label="规格名称" :label-width="width">
          <el-input v-model="form.specsname" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="规格属性" :label-width="width" v-for="(item,index) in arr" :key="index">
          <div class="box">
            <div class="ipt">
              <el-input v-model="item.val" autocomplete="off"></el-input>
            </div>
            <el-button type="primary" v-if="index==0" @click="addArr">新增规格属性</el-button>
            <el-button type="danger" v-else @click="delArr(index)">删除</el-button>
          </div>
        </el-form-item>
        <el-form-item label="状态" :label-width="width">
          <el-switch v-model="form.status" :active-value="1" :inactive-value="2"></el-switch>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="cancel">取 消</el-button>
        <el-button type="primary" @click="add" v-if="info.title == '规格添加'">添 加</el-button>
        <el-button type="primary" @click="amend" v-else>修 改</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { mapGetters, mapActions } from "vuex";
import { successAlert, waringAlert } from "../../../util/alert";

import {
  reqAddSpec,reqSpecDetail,reqChangeSpec
} from "../../../util/request";
export default {
  props: ["info"],
  computed: {
    ...mapGetters({
      list: "spec/list",
      total:"spec/total"
    }),
  },
  components: {},
  data() {
    return {
      width: "100px",
      // isShow:true,
      form: {
        specsname: "",
        attrs: "[]",
        status: 1,
      },
      //规格属性初始值
      arr: [{ val: "" }],
    };
  },
  methods: {
    ...mapActions({
      reqList: "spec/reqListAction",
      reqCountAction:"spec/reqCountAction",
    }),
    //点击新增属性
    addArr() {
      //直接往数组里加
      this.arr.push({ val: "" });
    },
    //点击删除属性
    delArr(index) {
      this.arr.splice(index, 1);
    },
    //点击取消按钮
    cancel() {
      this.info.isShow = false;
      this.form = {
        specsname: "",
        attrs: "[]",
        status: 1,
      };
      //规格属性初始值
      this.arr=[{ val: "" }];
    },
    //重置数据
    empty() {
      this.form = {
        specsname: "",
        attrs: "[]",
        status: 1,
      };
      //规格属性初始值
      this.arr=[{ val: "" }];
    },
    //验证
    checked(){
      return new Promise((resolve,reject)=>{
        if(this.form.specsname===""){
            waringAlert("规格名称不能为空");
            return;
          }
          // if((this.attrs.every(item=>item.val==="")).length>0){
          //   waringAlert("规格属性不能为空");
          //   return;
          // }
          resolve();
      })
    },
    //点击添加按钮
    add() {
      this.checked().then(()=>{
        //console.log(this.arr);
      //attrs: "[]",没有，补
      this.form.attrs=JSON.stringify(this.arr.map(item=>item.val));
      console.log(this.form);
      //往后端发请求
      reqAddSpec(this.form).then(res=>{
        if(res.data.code==200){
          successAlert("添加成功");
          this.cancel();
          this.empty();
          //刷新列表
          this.reqList();
          //刷新总数
          this.reqCountAction()
        }
      })
      })
      
    },
    //获取一条数据
    getOne(id) {
      //form上没有id,有uid
      // //发起获取一条的数据请求
      reqSpecDetail(id).then((res) => {
        
        //有id
        this.form = res.data.list[0 ];
        //规格属性是在arr数组里的 this.form.attrs是["",""]而arr是[{val:""}]
        this.arr=JSON.parse(this.form.attrs).map(item=>({val:item}));
        
      });
    },
    //点击修改按钮
    amend() {
      //与添加同理
      this.checked().then(()=>{
        this.form.attrs=JSON.stringify(this.arr.map(item=>item.val));
      //发请求
      reqChangeSpec(this.form).then((res) => {
        //console.log(res);
        if (res.data.code == 200) {
          //弹出提示框
          successAlert("修改成功");
          //弹框消失 
          this.cancel();
          //内容清空
          this.empty();
          //刷新列表
          this.reqList()
        }
      });
      })
      
    },
  },
  mounted() {},
};
</script>

<style scoped>
.box {
  display: flex;
}
.ipt {
  flex: 1;
}
</style>