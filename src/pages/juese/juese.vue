<template>
  <div>
    <!-- 添加按钮 -->
    <el-button type="primary" @click="willAdd">添加</el-button>
    <!-- 列表页 -->
    <!-- @edit="edit"收到父组件的自定义事件 -->
    <v-list @edit="edit"></v-list>
    <!-- 弹框页 -->
    <v-add :info="info" ref="add"></v-add>
  </div>
</template>

<script>
import vList from "./components/list";
import vAdd from "./components/add";
export default {
  components: {
    vList,
    vAdd,
  },
  data() {
    return {
      //控制弹框状态
      info: {
        isShow: false,
        title: "添加角色",
        isAdd: true,
      },
    };
  },
  methods: {
    //点击添加按钮
    willAdd() {
      //弹框出现
      this.info = {
        isShow: true,
        title: "添加角色",
        isAdd: true,
      };
    },
    //编辑
    edit(id) {
      //弹框出现
      this.info = {
        isShow: true,
        title: "修改角色",
        isAdd: false,
      }
      this.$refs.add.look(id)
    },
  },
  mounted() {},
};
</script>

<style scoped>
</style>