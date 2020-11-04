<template>
  <div>
    <el-dialog :title="info.title" :visible.sync="info.isShow" @closed="close">
      <el-form :model="form">
        <el-form-item label="角色名称" :label-width="width">
          <el-input v-model="form.rolename" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="角色权限" :label-width="width">
          <el-tree
            :data="menuList"
            show-checkbox
            node-key="id"
            ref="tree"
            :props="{ children: 'children', label: 'title' }"
          ></el-tree>
        </el-form-item>
        <el-form-item label="状态" :label-width="width">
          <el-switch v-model="form.status" :active-value="1" :inactive-value="2"></el-switch>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="cancel">取 消</el-button>
        <el-button type="primary" @click="add" v-if="info.isAdd">添 加</el-button>
        <el-button type="primary" @click="update" v-else>修 改</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { mapGetters, mapActions } from "vuex";
import {
  reqAddRole,
  reqRoleDetail,
  reqChangeRole,
} from "../../../util/request";
import { successAlert, waringAlert } from "../../../util/alert";
export default {
  props: ["info"],
  computed: {
    ...mapGetters({
      menuList: "caidan/list",
    }),
  },
  components: {},
  data() {
    return {
      width: "100px",

      form: {
        rolename: "",
        menus: [],
        status: 1,
      },
    };
  },
  methods: {
    ...mapActions({
      reqMenuList: "caidan/reqListAction",
      reqRoleList: "role/reqListAction",
    }),
    cancel() {
      //点击取消按钮
      this.info.isShow = false;
    },
    //重置数据
    empty() {
      this.form = {
        rolename: "",
        menus: [],
        status: 1,
      };
      //树和form没有关系，所以需要把树重新设置一下，给一个空数组
      this.$refs.tree.setCheckedKeys([]);
    },
    //验证
    checked() {
      return new Promise((resolve, reject) => {
        if (this.form.rolename === "") {
          waringAlert("角色名称不能为空");
          return;
        }
        if (this.form.menus === "") {
          waringAlert("角色权限不能为空");
          return;
        }
        resolve();
      });
    },
    //点击添加按钮
    add() {
      this.checked().then(()=>{
        //console.log(this.$refs.tree.getCheckedKeys());//nodes得到的是整个数据
      this.form.menus = JSON.stringify(this.$refs.tree.getCheckedKeys()); //转化成字符串的数组
      //发请求
      reqAddRole(this.form).then((res) => {
        if (res.data.code == 200) {
          successAlert("添加成功");
          //弹框消失
          this.cancel();
          //数据重置
          this.empty();
          //刷新角色列表
          this.reqRoleList();
        } else {
          waringAlert(res.data.msg);
        }
      });
      })
      
    },
    //查看某一条的详情
    look(id) {
      reqRoleDetail({ id: id }).then((res) => {
        this.form = res.data.list;
        this.form.id = id;
        this.$refs.tree.setCheckedKeys(JSON.parse(res.data.list.menus));
      });
    },
    //修改弹框数据
    update() {
      this.checked().then(()=>{
        //console.log(this.$refs.tree.getCheckedKeys());//nodes得到的是整个数据
      this.form.menus = JSON.stringify(this.$refs.tree.getCheckedKeys()); //转化成字符串的数组
      reqChangeRole(this.form).then((res) => {
        if (res.data.code == 200) {
          successAlert("修改成功");
          //弹框消失
          this.cancel();
          //数据重置
          this.empty();
          //刷新角色列表
          this.reqRoleList();
        } else {
          waringAlert(res.data.msg);
        }
      });
      })
      
    },
    //判断是编辑出的弹框点取消，还是添加的弹框点取消
    close() {
      if (!this.info.isAdd) {
        this.empty();
      }
      //第二中方式 !this.info.isAdd&&this.empty()  与或非的短路
    },
  },
  mounted() {
    // console.log(this.menuList);
    //如果menuList数组是空的，要发起请求得到
    if (this.menuList.length == 0) {
      this.reqMenuList();
    }
  },
};
</script>

<style scoped>
</style>