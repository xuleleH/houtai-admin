<template>
  <div>
    <el-dialog :title="info.title" :visible.sync="info.isShow">
      <el-form :model="form">
        <el-form-item label="标题" :label-width="width">
          <el-input v-model="form.title" autocomplete="off"></el-input>
        </el-form-item>
        <!-- 两种方式做图片的上传 -->
        <!-- 第一种 原生js -->
        <el-form-item label="图片" :label-width="width" v-if="form.pid!=0">
          <div class="box">
            <h3>+</h3>
            <!--input上的文件很难消失，那直接让input上的文件直接跟着弹框出现而出现，消失二消失 info.isShow -->
            <input v-if="info.isShow" type="file" @change="changeImg" />
            <img v-if="imgUrl" :src="imgUrl" alt />
          </div>
        </el-form-item>
        <el-form-item label="状态" :label-width="width">
          <el-switch v-model="form.status" :active-value="1" :inactive-value="2"></el-switch>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="cancel">取 消</el-button>
        <el-button type="primary" @click="add" v-if="info.title == '轮播图添加'">添 加</el-button>
        <el-button type="primary" @click="amend" v-else>修 改</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import {mapGetters,mapActions} from "vuex"
import { successAlert, waringAlert } from "../../../util/alert";

import {
  reqAddBanner,
  reqBannerDetail,
  reqChangeBanner
} from "../../../util/request";
export default {
  props: ["info"],
  computed:{
    ...mapGetters({
      list:"banner/list"
    })
  },
  components: {},
  data() {
    return {
      width: "100px",
      // isShow:true,
      form: {
        title: "",
        img: null,
        status: 1,
      },
      //imgUrl img图片地址变量初始值
      imgUrl: "",
    };
  },
  methods: {
    ...mapActions({
       reqList:"banner/reqListAction"
    }),
    //点击取消按钮
    cancel() {
      this.info.isShow = false;
      this.form = {
        title: "",
        img: null,
        status: 1,
      };
      this.imgUrl="";
    },
    //重置数据
    empty() {
      this.form = {
        title: "",
        img: null,
        status: 1,
      };
      //此时图片并未清空，需要单独做操作
      this.imgUrl="";
    },
    //选择上传图片的input
    changeImg(e) {
      //console.log(e);
      //console.log(e.target.files[0])
      let file = e.target.files[0];
      //判断文件的大小
      if (file.size > 2 * 1024 * 1024) {
        waringAlert("图片大小不能超过2M");
        return;
      }
      //判断保证上传的是文件类型  根据后缀名来判断
      let iArr = [
        ".BMP",
        ".JPG",
        ".JPEG",
        ".PNG",
        ".GIF",
        ".jpg",
        ".jpeg",
        ".png",
        ".gif",
      ];
      //file下的文件名字
      let name = file.name;
      let newName = name.slice(name.lastIndexOf("."));
      if (!iArr.includes(newName)) {
        waringAlert("请上传正确的图片格式");
        return;
      }
      //console.log(newName);
      //console.log(file);
      //将file 转为地址 赋值为img地址，前端可以展示出来
      this.imgUrl = URL.createObjectURL(file);
      //  后端的数据需要文件
      this.form.img = file;
      //console.log(url);
    },
    checked(){
      return new Promise((resolve,reject)=>{
        if(this.form.title===""){
            waringAlert("标题不能为空");
            return;
        }
        if(this.form.img===null){
            waringAlert("请上传图片");
            return;
        }
        resolve();
      })
    },
    //点击添加按钮
    add() {
      //console.log(this.form);
      //有图片，需要用formData转
      this.checked().then(()=>{
        let data = new FormData();
      //data.append("catename",this.form.catename)都需要这样写，用遍历、
      for (let i in this.form) {
        data.append(i, this.form[i]);
      }
        //发请求
        reqAddBanner(data).then((res) => {
          if (res.data.code == 200) {
            //弹成功提示
            successAlert("添加成功");
            //弹框消失
            this.cancel();
            //数据清空
            this.empty();
            //刷新列表
            this.reqList()
          }
        });
      })
      

    },
    //获取一条数据
    getOne(id) {
      //form上没有id,有uid
      //发起获取一条的数据请求
      reqBannerDetail(id).then((res) => {
        
        this.form = res.data.list;
        console.log(this.form);
        // 没有id,补id
        this.form.id=id;
        //此时图片没有出来
        this.imgUrl=this.$imgPre+this.form.img
        //因为后端的密码是加密的，此时页面上的密码清空
        //this.form.password = "";
      });
    },
    //点击修改按钮
    amend() {
      //与添加时同理
      this.checked().then(()=>{
        let data = new FormData();
      //data.append("catename",this.form.catename)都需要这样写，用遍历、
      for (let i in this.form) {
        data.append(i, this.form[i]);
      }
      //发请求
      reqChangeBanner(data).then((res) => {
        if (res.data.code == 200) {
          //弹出提示框
          successAlert("修改成功");
          //弹框消失
          this.cancel();
          //内容清空
          this.empty();
          //刷新列表
          this.reqList()
        }
      });
      })
      
    },
  }, 
  mounted() {},
};
</script>

<style scoped>
.box {
  width: 100px;
  height: 100px;
  border: 1px dashed #cccccc;
  border-radius: 2px;
  position: relative;
}
.box h3 {
  width: 100%;
  height: 100%;
  line-height: 100px;
  text-align: center;
  position: absolute;
  top: 0;
  left: 0;
  cursor: pointer;
}
.box input {
  width: 100%;
  height: 100%;
  position: absolute;
  top: 0;
  left: 0;
  opacity: 0;
  cursor: pointer;
}
.box img {
  width: 100%;
  height: 100%;
}
</style>