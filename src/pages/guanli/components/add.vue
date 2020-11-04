<template>
  <div>
    <el-dialog :title="info.title" :visible.sync="info.isShow" @opened="opened">
      <el-form :model="form">
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
          <el-select v-model="form.second_cateid">
            <el-option label="--请选择--" value disabled></el-option>
            <el-option
              v-for="item in secondSortList"
              :key="item.id"
              :label="item.catename"
              :value="item.id"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="商品名称" :label-width="width">
          <el-input v-model="form.goodsname" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="价格" :label-width="width">
          <el-input v-model="form.price" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="市场价格" :label-width="width">
          <el-input v-model="form.market_price" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="图片" :label-width="width">
          <div class="box">
            <h3>+</h3>
            <!--input上的文件很难消失，那直接让input上的文件直接跟着弹框出现而出现，消失二消失 info.isShow  @change="changeImg"-->
            <input v-if="info.isShow" type="file" @change="changeImg" />
            <img v-if="imgUrl" :src="imgUrl" alt />
          </div>
        </el-form-item>
        <el-form-item label="商品规格" :label-width="width">
          <el-select v-model="form.specsid" @change="changeSpec">
            <el-option label="--请选择--" value disabled></el-option>
            <el-option
              v-for="item in specList"
              :key="item.id"
              :label="item.specsname"
              :value="item.id"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="规格属性" :label-width="width">
          <el-select v-model="form.specsattr" multiple>
            <el-option label="--请选择--" value disabled></el-option>
            <el-option v-for="item in specAttrs" :key="item" :label="item" :value="item"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="是否新品" :label-width="width">
          <el-radio :label="1" v-model="form.isnew">是</el-radio>
          <el-radio :label="2" v-model="form.isnew">否</el-radio>
        </el-form-item>
        <el-form-item label="是否热卖" :label-width="width">
          <el-radio :label="1" v-model="form.ishot">是</el-radio>
          <el-radio :label="2" v-model="form.ishot">否</el-radio>
        </el-form-item>
        <el-form-item label="状态" :label-width="width">
          <el-switch v-model="form.status" :active-value="1" :inactive-value="2"></el-switch>
        </el-form-item>
        <el-form-item label="商品描述" :label-width="width">
         <div v-if="info.isShow" id="editor"></div>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="cancel">取 消</el-button>
        <el-button type="primary" @click="add" v-if="info.title == '商品添加'">添 加</el-button>
        <el-button type="primary" @click="amend" v-else>修 改</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import E from 'wangeditor'
import { mapGetters, mapActions } from "vuex";
import { successAlert, waringAlert } from "../../../util/alert";

import {
  reqAddGoods,
  reqGoodsDetail,
  reqChangeGoods,
  reqListSort,
  reqChangeSpec
} from "../../../util/request";
export default {
  props: ["info"],
  computed: { 
    ...mapGetters({
      sortList: "sort/list", //分类
      specList: "spec/list", //规格
      goodsList: "goods/list", //商品管理
    }),
  },
  components: {},
  data() {
    return {
      width: "100px",
      // isShow:true,
      form: {
        first_cateid: "",
        second_cateid: "",
        goodsname: "",
        price: "",
        market_price: "",
        img: null,
        description: "",
        specsid: "",
        specsattr: [], //发请求前JSON.stringfy转一下
        isnew: 1,
        ishot: 1,
        status: 1,
      },
      //二级分类list,根据一级的变化而变化
      secondSortList: [],
      //规格属性
      specAttrs: [],
      //imgUrl img图片地址变量初始值
      imgUrl: "",
    };
  },
  methods: {
    ...mapActions({
      //请求分类的列表
      reqSortList: "sort/reqListAction",
      //请求规格的列表
      reqSpecList: "spec/reqListAction",
      //请求商品管理的列表
      reqGoodsList: "goods/reqListAction",
      //请求总数
      reqCountAction: "goods/reqCountAction",
    }),
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
    //图片发生修改
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
      console.log(newName);
      //console.log(file);
      //将file 转为地址 赋值为img地址，前端可以展示出来
      this.imgUrl = URL.createObjectURL(file);
      //  后端的数据需要文件
      this.form.img = file;
      //console.log(url);
    },
    //弹框出现，开始创建富文本
    opened(){
      this.editor = new E('#editor');
      this.editor.create();
      this.editor.txt.html(this.form.description)
    },
    //规格属性的获取
    changeSpec() {
      //规格变化，属性置空
      this.form.specsattr = [];
      //根据选中的商品规格，来展示相应的属性
      this.getAttrList();
    },
    //封装规格属性函数
    getAttrList(){
        //找出this.specList里面的id是form.specsid 的那条数据
      let obj = this.specList.find(item => item.id === this.form.specsid);
      this.specAttrs = obj.attrs;
    },
    //点击取消按钮
    cancel() {
      this.info.isShow = false;
      this.form = {
        first_cateid: "",
        second_cateid: "",
        goodsname: "",
        price: "",
        market_price: "",
        img: null,
        description: "",
        specsid: "",
        specsattr: [], //发请求前JSON.stringfy转一下
        isnew: 1,
        ishot: 1,
        status: 1,
      };
      //imgUrl img图片地址变量初始值
      this.imgUrl = "";
    },
    //重置数据
    empty() {
      this.form = {
        first_cateid: "",
        second_cateid: "",
        goodsname: "",
        price: "",
        market_price: "",
        img: null,
        description: "",
        specsid: "",
        specsattr: [], //发请求前JSON.stringfy转一下
        isnew: 1,
        ishot: 1,
        status: 1,
      };
      //imgUrl img图片地址变量初始值
      this.imgUrl = "";
    },
      //验证
      checked(){
        return new Promise((resolve,reject)=>{
            //验证数据是否均不为空
          if(this.form.first_cateid===""){
            waringAlert("一级分类不能为空");
            return;
          }
          if(this.form.second_cateid===""){
            waringAlert("二级分类不能为空");
            return;
          }
          if(this.form.goodsname===""){
            waringAlert("商品名称不能为空");
            return;
          }
          if(this.form.price===""){
            waringAlert("价格不能为空");
            return;
          }
          if(this.form.market_price===""){
            waringAlert("市场价格不能为空");
            return;
          }
          if(!this.form.img){
            waringAlert("图片不能为空");
            return;
          }
          if(this.form.specsid===""){
            waringAlert("规格不能为空");
            return;
          }
          if(this.form.specsattr.length===0){
            waringAlert("请选择商品属性");
            return;
          }
          if(this.form.description===""){
            waringAlert("描述不能为空");
            return;
          }
          resolve();
        })
      },
    //点击添加按钮
    add() {
      this.form.description=this.editor.txt.html();
      //console.log(this.form);
      this.checked().then(()=>{
          //拷贝
          let obj = {
            ...this.form,
          };
          //specsattr转为字符串数组
          obj.specsattr = JSON.stringify(obj.specsattr);

          //有图片，需要用formData转
          let data = new FormData();
          //data.append("catename",this.form.catename)都需要这样写，用遍历、
          for (let i in this.form) {
            data.append(i, this.form[i]);
          }
          // //往后端发请求
          reqAddGoods(data).then((res) => {
            if (res.data.code == 200) {
              successAlert("添加成功");
              this.cancel();
              this.empty();
              //刷新列表
              this.reqGoodsList();
              //刷新总数
              this.reqCountAction();
            }
          });
      })
      
    },
    //获取一条数据
    getOne(id) {
      //form上没有id,有uid
      // //发起获取一条的数据请求
      reqGoodsDetail(id).then((res) => {
        this.form = res.data.list;
        //没有id
        this.form.id = id;
        //处理二级分类 根据一级分类的id,获取二级分类的数据
        this.getSecondList();
        //展示图片
        this.imgUrl=this.$imgPre+this.form.img;
        //规格属性
        this.getAttrList();
        //出现bug  
         this.form.specsattr=JSON.parse(this.form.specsattr)
        //将form的富文本编辑器赋值，设置内容
        if(this.editor){
          this.editor.txt.html(this.form.description); 
        }
        
      });
    },
    //点击修改按钮
    amend() {
      //与添加同理
      this.form.description=this.editor.txt.html(); 
      this.checked().then(()=>{
        //拷贝
          let obj = {
            ...this.form,
          };
          //specsattr转为字符串数组
          obj.specsattr = JSON.stringify(obj.specsattr);

          //有图片，需要用formData转
          let data = new FormData();
          //data.append("catename",this.form.catename)都需要这样写，用遍历、
          for (let i in this.form) {
            data.append(i, this.form[i]);
          }
       //发请求
        reqChangeSpec(data).then((res) => {
        //console.log(res);
        if (res.data.code == 200) {
          //弹出提示框
          successAlert("修改成功");
          //弹框消失
          this.cancel();
          //内容清空
          this.empty();
          //刷新列表
          this.reqGoodsList();
        }
      });
      })
      
    },
  },
  mounted() {
    //一进来就发起获取分类列表的请求
    this.reqSortList();
    //一进来就发起获取规格列表的请求,修改了spec里的页码
    this.reqSpecList(true);
  },
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