<template>
  <div>
    <el-container>
      <el-aside width="200px">
        <!-- router 启用路由模式 index直接对应path -->
        <el-menu
          router
          default-active="/index/home"
          class="el-menu-vertical-demo"
          background-color="#20222a"
          text-color="#fff"
          active-text-color="#ffd04b"
        >
          <el-menu-item index="/index/home">
            <i class="el-icon-menu"></i>
            <span slot="title">首页</span>
          </el-menu-item>
          <!-- 有顶级菜单 -->
          <div v-for="item in userInfo.menus" :key="item.id">
            <el-submenu  :index="item.id+''" v-if="item.children">
              <template slot="title">
                <i :class="item.icon"></i>
                <span>{{item.title}}</span>
              </template>
              <el-menu-item v-for="i in item.children" :key="i.id" :index="'/index'+i.url">{{i.title}}</el-menu-item>
            </el-submenu>
               <!-- 没有顶级菜单的 -->
            <el-menu-item :index="'/index'+item.url" v-else>
            <span slot="title">{{item.title}}</span>
          </el-menu-item>
          </div>
        </el-menu>
      </el-aside>
      <el-container>
        <el-header>
          <span>{{userInfo.username}}</span>
          <el-button type="primary" @click="logOut">退出</el-button>
        </el-header>
        <el-main>
          <!-- 面包屑 -->
          <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>{{$route.name}}</el-breadcrumb-item>
          </el-breadcrumb>
          <div class="box">
            <!-- 二级路由出口 -->
            <router-view></router-view>
          </div>
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>

<script>
import { mapGetters, mapActions } from "vuex";
export default {
  computed: {
    ...mapGetters({
      userInfo: "userInfo",
    }),
  },
  components: {},
  data() {
    return {};
  },
  methods: {
    ...mapActions(["changeUserInfoAction"]),

    logOut() {
      this.changeUserInfoAction({});
      this.$router.push("/");
    },
  },
  mounted() {},
};
</script>

<style scoped>
.el-header {
  background-color: rgb(179, 192, 209);
  color: #333;

  line-height: 60px;
  font-size: 20px;
}

.el-aside {
  background-color: rgb(32, 34, 42);
  color: #ffffff;
  text-align: center;
  line-height: 200px;
  height: 100vh;
}

.el-main {
  background-color: #ffffff;
  color: #333;
  /* text-align: center; */
  /* line-height: 160px; */
}
.box {
  margin-top: 20px;
}
</style>