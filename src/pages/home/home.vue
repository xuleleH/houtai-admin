<template>
  <div>
    <div id="box" class="box1"></div>
  </div>
</template>

<script>
import echarts from "echarts";
import { mapGetters, mapActions } from "vuex";
export default {
  computed: {
    ...mapGetters({
      list: "sort/list",
    }),
  },
  components: {},
  data() {
    return {};
  },
  methods: {
    ...mapActions({
      reqList: "sort/reqListAction",
    }),
  },
  //监听
  watch: {
    list: {
      //深度监听
      handler() {
        if (this.list.length > 0) {
          //有数据才显示图表
          let myChart = echarts.init(document.getElementById("box"));
          var option = {
            title: {
              text: "商品分类详情",
            },
            tooltip: {},
            legend: {
              data: ["子分类数量"],
            },
            xAxis: {
              data: this.list.map(item=>item.catename)
            },
            yAxis: {},
            series: [
              {
                name: "子分类数量",
                type: "line",
                //看children有没有
                data:this.list.map(item=>item.children?item.children.length:0)
              },
            ],
          };
          myChart.setOption(option);
        }
      },
      deep: true,
    },
  },
  mounted() {
    //一进页面发请求
    this.reqList();
  },
};
</script>

<style scoped>
.box1 {
  width: 80%;
  height: 400px;
  margin: 0 auto;
}
</style>