<template>
  <div>
    <!-- 添加按钮 -->
    <el-button type="primary" @click="willAdd">添加</el-button>
    <!-- 列表页 -->
    <v-list   @edit="update($event)"></v-list>
    <!-- 添加弹框页 -->
    <v-add :info="info"   ref="add"></v-add>
    
  </div>
</template>

<script>
import vList from "./components/list.vue";
import vAdd from "./components/add.vue";

export default {
  components: {
    vList,
    vAdd,
  },
  data() {
    return {
      info: {
        isShow: false,
        title: "规格添加",
      },
      
    };
  },
  methods: {
    //点击添加按钮
    willAdd() {
      //父传子，自定义一个事件，传给子组件
      this.info = {
        isShow: true,
        title: "规格添加",
      };
    },
   
    //子组件中点击编辑，弹出弹框
    update(id) {
      this.info = {
        isShow: true,
        title: "规格修改",
      };
      //根据uid发起一条数据请求
      //父组件要调用子组件的方法或属性用ref
      this.$refs.add.getOne(id);
    },
  },
  mounted() {
    //一进页面获取列表数据渲染出来
   
  },
};
</script>

<style scoped>
</style>