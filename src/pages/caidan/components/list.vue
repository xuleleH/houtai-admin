<template>
  <div>
    <el-table
      :data="list"
      style="width: 100%; margin-bottom: 20px; margin-top: 20px"
      row-key="id"
      border
      :tree-props="{ children: 'children', hasChildren: 'hasChildren' }"
    >
      <el-table-column prop="id" label="菜单编号" width="150">
      </el-table-column>
      <el-table-column prop="title" label="菜单名称" width="180">
      </el-table-column>
      <el-table-column label="菜单图标" width="150">
        <template slot-scope="scope">
          <i :class="scope.row.icon"></i>
        </template>
      </el-table-column>
      <el-table-column prop="url" label="菜单地址" width="180"> </el-table-column>
      <el-table-column label="状态">
        <template slot-scope="scope" width="50">
          <el-button type="primary" v-if="scope.row.status == 1"
            >启用</el-button
          >
          <el-button type="info" v-else>禁用</el-button>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="260">
        <template slot-scope="scope">
          <el-button type="primary" @click="edit(scope.row.id)">编辑</el-button>
          <el-button type="danger" @click="del(scope.row.id)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
import { mapGetters, mapActions } from "vuex";
import { reqDelMenu } from "../../../util/request";
import { successAlert, waringAlert } from "../../../util/alert";
export default {
  components: {},
  computed: {
    ...mapGetters({
      list: "caidan/list",
    }),
  },
  data() {
    return {};
  },
  methods: {
    ...mapActions({
      reqList: "caidan/reqListAction",
    }),
    //点击编辑按钮
    edit(id) {
      this.$emit("emit", id);
    },
    //删除
    del(id) {
      this.$confirm("你确定要删除吗?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          //点击确定，发起删除请求
          reqDelMenu({ id: id }).then((res) => {
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
    },
  },
  mounted() {
    //一进页面就发请求
    this.reqList();
  },
};
</script>

<style scoped>