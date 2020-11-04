<template>
  <div>
    <el-table
      :data="list"
      style="width: 100%; margin-bottom: 20px; margin-top: 20px"
      row-key="id"
      border
      default-expand-all>
      <el-table-column prop="id" label="角色编号" width="180">
      </el-table-column>
      <el-table-column prop="rolename" label="角色名称" width="180">
      </el-table-column>
      <el-table-column label="状态">
        <template slot-scope="scope">
          <el-button type="primary" v-if="scope.row.status==1">启用</el-button>
          <el-button type="info" v-else>禁用</el-button>
        </template>
      </el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button type="primary" @click="edit(scope.row.id)">编辑</el-button>
          <el-button type="danger" @click="del(scope.row.id)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
//取数据
import { mapActions, mapGetters } from "vuex";
import {reqDelRole} from "../../../util/request"
import {successAlert,waringAlert} from "../../../util/alert"
export default {
  computed: {
    ...mapGetters({
      list:"role/list"
    }),
  },
  components: {
   
  },
  data() {
    return {
      
    };
  },
  methods: {
    ...mapActions({
      "reqList":"role/reqListAction"
    }),
    //点击编辑
    edit(id){
      //和add组件没有关系，但有一个共同的父组件,就告诉父组件
      this.$emit("edit",id)
    },
    //删除
    del(id){
      this.$confirm("你确定要删除吗?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          //点击确定，发起删除请求
          reqDelRole({ id: id }).then((res) => {
            if(res.data.code==200){
              successAlert("删除成功");
              //请求重新刷新页面
              this.reqList();

            }else{
              waringAlert(res.data.msg)
            }
          });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除",
          });
        });
    }
  },
  mounted() {
    //一进页面角色列表请求
    this.reqList();
  },
};
</script>

<style scoped>
</style> 