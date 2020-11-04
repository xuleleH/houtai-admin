<template>
  <div>
    <!-- 添加按钮 -->
    <el-button type="primary" @click="willAdd">添加</el-button>
    <!-- 添加弹框 -->
    <v-add :info="info" @hide="hide" ref="add"></v-add>
    <!-- 添加列表 -->
    <v-list @emit="emit($event)"></v-list>
  </div>
</template>

<script>
import vAdd from "./components/add";
import vList from "./components/list";
export default {
  components: {
    vAdd,
    vList,
  },
  data() {
    return {
      //传递给子组件的信息，以对象的方式传递，会实现父变子变，子变父变
      info: {
        //添加弹框出现状态
        isShow: false,
        title: "添加菜单",
      },
    };
  },
  methods: {
    //点击了添加按钮
    willAdd() {
      this.info = {
        isShow: true,
        title:"添加菜单",
        isAdd:true
      };
    },
    //点击取消通知父组件，弹框关闭
    hide() {
      this.info.isShow = false;
    },
    //触发编辑
    emit(id) {
      this.info = {
        isShow: true,
        title:"修改菜单",
         isAdd:false
      };
      //父组件调用子组件的方法
      this.$refs.add.look(id);
    },
  },
  mounted() {},
};
</script>

<style scoped>
</style>