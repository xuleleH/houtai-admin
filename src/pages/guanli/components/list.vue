<template>
  <div>
    <el-table
      :data="list"
      style="width: 100%; margin-bottom: 20px; margin-top: 20px"
      row-key="id"
      border
    >
      <el-table-column prop="id" label="商品编号" width="100"></el-table-column>
      <el-table-column prop="goodsname" label="商品名称" width="100"></el-table-column>
      <el-table-column label="商品价格" width="100">
        <template slot-scope="scope">
          <span>{{scope.row.price}}</span> 
        </template>
      </el-table-column>
      <el-table-column  label="市场价格" width="100">
        <template slot-scope="scope">
          <span>{{scope.row.market_price}}</span>
        </template>
      </el-table-column>
      <el-table-column label="图片" width="180">
        <template slot-scope="scope">
           <img :src="$imgPre+scope.row.img" alt="" class="img" >
           <!-- v-if="scope.row.img!=='null'" -->
        </template> 
      </el-table-column>
      <el-table-column prop="specsname" label="是否新品" width="180">
         <template slot-scope="scope">
          <el-button type="primary" v-if="scope.row.isnew == 1">是</el-button>
          <el-button type="danger" v-else>否</el-button>
        </template>
      </el-table-column>
      <el-table-column prop="specsname" label="是否热卖" width="180">
         <template slot-scope="scope">
          <el-button type="primary" v-if="scope.row.ishot == 1">是</el-button>
          <el-button type="danger" v-else>否</el-button>
        </template>
      </el-table-column>
      <el-table-column label="状态">
        <template slot-scope="scope">
          <el-button type="primary" v-if="scope.row.status == 1">启用</el-button>
          <el-button type="info" v-else>禁用</el-button>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="180">
        <template slot-scope="scope">
          <el-button type="primary" @click="edit(scope.row.id)">编辑</el-button>
          <el-button type="danger" @click="del(scope.row.id)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页按钮 -->
    <el-pagination
      layout="prev, pager, next"
      :total="total"
      :page-size="size"
      @current-change="change"
    ></el-pagination>

    <!-- @current-change="change" 当前页码发生时做出的改变事件 -->

  </div>
</template>

<script>
import{mapActions,mapGetters} from "vuex"
import { successAlert, waringAlert } from '../../../util/alert';
import {reqGoodsDel} from "../../../util/request";
export default {
computed:{
...mapGetters({
  list:"goods/list",
  total:"goods/total",
  size:"goods/size", 
  
})
},
  components: {},
  data() {
    return {};
  },
  methods: {
    ...mapActions({
       reqList:"goods/reqListAction",
       reqCountAction:"goods/reqCountAction",
       changePageAction:"goods/changePageAction"
    }),
    //修改页码
    change(page){
      //修改页码
      this.changePageAction(page);
      
    },
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
          reqGoodsDel(id).then(res=>{
            if(res.data.code==200){
              //刷新列表
              this.reqList();
              //弹出提示框
              successAlert("删除成功");
              //删除后重新请求总数
              this.reqCountAction();
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
    //一进页面就请求总数
    this.reqCountAction();
  },
};
</script>

<style scoped>
.img{
  width: 100px;
  height: 100px;
}
</style>