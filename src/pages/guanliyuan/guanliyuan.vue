<template>
  <div>
    <!-- 添加按钮 -->
    <el-button type="primary" @click="willAdd">添加</el-button>
    <!-- 列表页 -->
    <v-list :list="list" @init="getInit" @edit="update($event)"></v-list>
    <!-- 添加弹框页 -->
    <v-add :info="info" :list="list" @init="getInit" ref="add"></v-add>
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
import vList from "./components/list.vue";
import vAdd from "./components/add.vue";
import { reqListAdmin, reqSumAdmin } from "../../util/request.js";
export default {
  components: {
    vList,
    vAdd,
  },
  data() {
    return {
      info: {
        isShow: false,
        title: "用户添加",
      },
      //列表数据
      list: [],
      //分页的初始数据
      //总数，后台数据库决定总条数
      total: 0,
      //page-size 设置分页一页有几条数据，默认是10条
      size: 2,
      //页码
      page: 1,
    };
  },
  methods: {
    //点击添加按钮
    willAdd() {
      //父传子，自定义一个事件，传给子组件
      this.info = {
        isShow: true,
        title: "用户添加",
      };
    },
    //一进页面就发请求
    getInit() {
      //做分页先发起获取总数据的请求
      reqSumAdmin().then((res) => {
        if (res.data.code == 200) {
          this.total = res.data.list[0].total;
        }
      });
      //调一下获取列表请求的方法
      this.getList();
    },
    getList() {
      //获取列表的请求
      reqListAdmin({ size: this.size, page: this.page }).then((res) => {
        if ((res.data.code = 200)) {
          //this.list = res.data.list;
          //当删除的时候，页码要和列表数据显示的个数相符，而不是删完了，出现null,报错
          //取到数据为null,那么应该把null变为空数组,解决出现null报错问题
          let list=res.data.list?res.data.list:[];
          
          //如果list是空数组，这个时候应该看一下，当前页是不是第一页，如果是第一页，就赋值
          //如果不是第一页，假设在第三页，那么，删除完数据，应该到第二页
          if(list.length===0&&this.page>1){
            //页数自减
            this.page--;
            //请求数据，
            this.getList();
            //请求了新的数据，就不用再赋值
            return;
          }
           //如果list是空数组，这个时候应该看一下，当前页是不是第一页，如果是第一页，就赋值
          this.list=list;
        }
        // console.log(res);
      });
    },
    //页面变化
    change(page) {
      //未传参，默认参数是event
      //console.log(e); e 显示的就是页码
      //把当前页码改变一下
      this.page = page;
      //列表重新刷一下
      this.getList();

      //当删除的时候，页码要和列表数据显示的个数相符，而不是删完了，出现null,报错
    },
    //子组件中点击编辑，弹出弹框
    update(uid) {
      this.info = {
        isShow: true,
        title: "用户修改",
      };
      //根据uid发起一条数据请求
      //父组件要调用子组件的方法或属性用ref
      this.$refs.add.getOne(uid);
    },
  },
  mounted() {
    //一进页面获取列表数据渲染出来
    this.getInit();
  },
};
</script>

<style scoped>
</style>