<template>
  <div>
    <el-table
      :data="list"
      style="width: 100%; margin-bottom: 20px; margin-top: 20px"
      row-key="id"
      border
    >
      <el-table-column prop="id" label="编号" width="180"></el-table-column>
      <el-table-column prop="title" label="轮播图标题" width="180"></el-table-column>
      <el-table-column label="图片" width="180">
        <template slot-scope="scope">
           <img :src="$imgPre+scope.row.img" alt="" class="img" v-if="scope.row.img!=='null'">
        </template> 
      </el-table-column>
      <el-table-column label="状态">
        <template slot-scope="scope">
          <el-button type="primary" v-if="scope.row.status == 1">启用</el-button>
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
import{mapActions,mapGetters} from "vuex"
import { successAlert, waringAlert } from '../../../util/alert';
import {reqDelBanner} from "../../../util/request";
export default {
computed:{
...mapGetters({
  list:"banner/list"
})
},
  components: {},
  data() {
    return {};
  },
  methods: {
    ...mapActions({
       reqList:"banner/reqListAction"
    }),
    //点击编辑
    edit(id) {    
          this.$emit("edit",id) 
    },
    //点击删除
     del(id) {
      this.$confirm("你确定要删除吗?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          //发起请求删除数据
          reqDelBanner(id).then(res=>{
            if(res.data.code==200){
              //刷新列表
              this.reqList();
              //弹出提示框
              successAlert("删除成功");
            }else{
              waringAlert(res.data.msg)
            }
          })
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除"
          });
        });
    }
  },
  mounted() {
    //一进页面就刷新列表
    this.reqList();
  },
};
</script>

<style scoped>
.img{
  width: 100px;
  height: 100px;
}
</style>