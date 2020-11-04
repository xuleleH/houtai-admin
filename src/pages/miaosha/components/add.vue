<template>
  <div>
    <el-dialog :title="info.title" :visible.sync="info.isShow">
      <el-form :model="form">
        <el-form-item label="活动名称" :label-width="width">
          <el-input v-model="form.title" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="活动期限" :label-width="width">
          <el-date-picker
            v-model="value1"
            type="datetimerange"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            @change="changeTime"
          ></el-date-picker>
        </el-form-item>
        <el-form-item label="一级分类" :label-width="width">
          <el-select v-model="form.first_cateid" @change="changeFirstList">
            <el-option label="--请选择--" value disabled></el-option>
            <el-option
              v-for="item in sortList"
              :key="item.id"
              :label="item.catename"
              :value="item.id"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="二级分类" :label-width="width">
          <el-select v-model="form.second_cateid" @change="changeSecondList">
            <el-option label="--请选择--" value disabled></el-option>
            <el-option
              v-for="item in secondSortList"
              :key="item.id"
              :label="item.catename"
              :value="item.id"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="商品" :label-width="width">
          <el-select v-model="form.goodsid">
            <el-option label="--请选择--" value disabled></el-option>
            <el-option
              v-for="item in goodsList"
              :key="item.id"
              :label="item.goodsname"
              :value="item.id"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="状态" :label-width="width">
          <el-switch v-model="form.status" :active-value="1" :inactive-value="2"></el-switch>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="cancel">取 消</el-button>
        <el-button type="primary" @click="add" v-if="info.title == '活动添加'">添 加</el-button>
        <el-button type="primary" @click="amend" v-else>修 改</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { mapGetters, mapActions } from "vuex";
import { successAlert, waringAlert } from "../../../util/alert";

import {
  reqListSort,
  reqAddSeck,
  reqSeckDetail,
  reqChangeSeck,
  reqListGoods,
} from "../../../util/request";
export default {
  props: ["info"],
  computed: {
    ...mapGetters({
      sortList: "sort/list", //分类
      sepcList: "spec/list", //规格
      list: "seck/list", //秒杀
    }),
  },
  components: {},
  data() {
    return {
      width: "100px",
      // isShow:true,
      form: {
        title: "",
        begintime: "",
        endtime: "",
        first_cateid: "",
        second_cateid: "",
        goodsid: "",
        status: 1,
      },
      //二级分类list,根据一级的变化而变化
      secondSortList: [],
      //商品，是根据二级变化而变化
      goodsList: [],
       value1: [],
    };
  },
  methods: {
    ...mapActions({
      //请求分类的列表
      reqSortList: "sort/reqListAction",
      //请求规格的列表
      reqSpecList: "spec/reqListAction",
      //请求秒杀列表
      reqList: "seck/reqListAction",
    }),
    //改变时间
    changeTime() {
      this.form.begintime = this.value1[0].getTime();
      this.form.endtime = this.value1[1].getTime();
    },
    //改变一级分类
    changeFirstList() {
      //二级分类的id要清空
      this.form.second_cateid = "";
      //商品分类发起请求
      this.getSecondList();
    },
    //封装获取二级分类的函数
    getSecondList() {
      reqListSort({ pid: this.form.first_cateid }).then((res) => {
        if (res.data.code == 200) {
          this.secondSortList = res.data.list;
        }
      });
    },
    //改变二级分类
    changeSecondList() {
      //商品分类清空
      this.form.goodsid = "";
      this.getGoodsList();
    },
    //封装获取商品的函数
    getGoodsList() {
      reqListGoods({
        fid: this.form.first_cateid,
        sid: this.form.second_cateid,
      }).then((res) => {
        if (res.data.code == 200) {
          this.goodsList = res.data.list;
        }
      });
    },
    //点击取消按钮
    cancel() {
      this.info.isShow = false;
      this.form = {
        title: "",
        begintime: "",
        endtime: "",
        first_cateid: "",
        second_cateid: "",
        goodsid: "",
        status: 1,
      };
      //二级分类list,根据一级的变化而变化
      this.secondSortList = [];
      //商品，是根据二级变化而变化
      this.goodsList = [];
      this.value1 = [];
    },
    //重置数据
    empty() {
      this.form = {
        title: "",
        begintime: "",
        endtime: "",
        first_cateid: "",
        second_cateid: "",
        goodsid: "",
        status: 1,
      };
      //二级分类list,根据一级的变化而变化
      this.secondSortList = [];
      //商品，是根据二级变化而变化
      this.goodsList = [];
      this.value1 = [];
    },
    checked() {
      return new Promise((resolve, reject) => {
        if (this.form.title === "") {
          waringAlert("活动名称不能为空");
          return;
        }
        if (this.form.begintime === "" && this.form.endtime === "") {
          waringAlert("活动期限不能为空");
          return;
        }
        if (this.form.first_cateid === "") {
          waringAlert("一级分类不能为空");
          return;
        }
        if (this.form.second_cateid === "") {
          waringAlert("二级分类不能为空");
          return;
        }
        if (this.form.goodsid === "") {
          waringAlert("商品不能为空");
          return;
        }
        resolve();
      });
    },
    //点击添加按钮
    add() {
      console.log(this.form);
      this.checked().then(() => {
        //发请求
        reqAddSeck(this.form).then((res) => {
          console.log(this.form);
          if (res.data.code == 200) {
            //弹成功提示
            successAlert("添加成功");
            //弹框消失
            this.cancel();
            //数据清空
            this.empty();
            //刷新列表
            this.reqList();
          }
        });
      });
    },
    //获取一条数据
    getOne(id) {
      //form上没有id,有uid
      //发起获取一条的数据请求
      reqSeckDetail(id).then((res) => {
        let data1 = new Date(res.data.list.begintime * 1);
        let data2 = new Date(res.data.list.endtime * 1);
        //console.log(data1,data2);
        this.value1 = [data1, data2];
        //console.log(this.form);
        this.form = res.data.list;
        // 没有id,补id
        this.form.id = id;
        //商品分类发起请求
        this.getSecondList();
        //商品分类
        this.getGoodsList();
      });
    },
    //点击修改按钮
    amend() {
      this.checked().then(() => {
        //发请求
        reqChangeSeck(this.form).then((res) => {
          if (res.data.code == 200) {
            //弹出提示框
            successAlert("修改成功");
            //弹框消失
            this.cancel();
            //内容清空
            this.empty();
            //刷新列表
            this.reqList();
          }
        });
      });
    },
  },
  mounted() {
    //一进页面先获取分类列表,规格列表
    this.reqSortList();
    this.reqSpecList();
  },
};
</script>

<style scoped>
</style>