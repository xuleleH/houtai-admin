<template>
  <div>
    <v-edit :info="info" @init="getInit" ref="edit"></v-edit>
    <el-table
      :data="list"
      style="width: 100%; margin-bottom: 20px; margin-top: 20px"
      row-key="id"
      border
    >
      <el-table-column prop="id" label="用户编号" width="180"></el-table-column>
      <el-table-column prop="nickname" label="昵称" width="180"></el-table-column>
      <el-table-column prop="phone" label="手机号" width="180"></el-table-column>
      <el-table-column label="状态">
        <template slot-scope="scope">
          <el-button type="primary" v-if="scope.row.status == 1">启用</el-button>
          <el-button type="info" v-else>禁用</el-button>
        </template>
      </el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button type="primary" @click="edit(scope.row.uid)">编辑</el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
import vEdit from "./components/edit";
import { successAlert, waringAlert } from "../../util/alert";
import { reqListVip } from "../../util/request";
export default {
  components: {
    vEdit,
  },
  data() {
    return {
      list: [],
      info: {
        isShow: false,
        title: "会员修改",
      },
    };
  },
  methods: {
    //获取列表
    getList() {
      reqListVip().then((res) => {
        if (res.data.code == 200) {
          this.list = res.data.list;
        }
      });
    },
    //点击编辑
    edit(uid) {
      this.info = {
        isShow: true,
      };
      //根据uid发起一条数据请求
      //父组件要调用子组件的方法或属性用ref
      this.$refs.edit.getOne(uid);
    
    },
    getInit(){
        //刷新列表
        this.getList()
    }
  },
  mounted() {
    this.getList();
  },
};
</script>

<style scoped>
</style>