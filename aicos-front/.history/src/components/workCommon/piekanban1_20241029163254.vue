<template>
  <HuilanBasic class="toolBox" style="height: 500px;">
    <div>
      <div class="toolBoxTitle">{{pieTitle}}</div>
      <div class="toolBoxRadio">
        <el-radio-group v-model="tabPosition">
          <el-radio-button label="公车">公车</el-radio-button>
          <el-radio-button label="社会用车">社会用车</el-radio-button>
        </el-radio-group>
      </div>
    </div>
    <div class="sysIndexTitle" id="tongji"></div>
  </HuilanBasic>
</template>

<script>
import * as echarts from "echarts";
export default {
  name: "indexTools",
  data() {
    return {
      tabPosition:'公车'
    }
  },
  props:{
    pieTitle:String,
    piedata:Array,
  },
  watch:{
    pieTitle:{
      handler(newValue, oldValue) {
        if(newValue !== oldValue){
          this.$nextTick(() => {
            this.drawpie()
          })
        }
      },
      deep:true,
      immediate:false,
    },
  },
  mounted() {
    this.$nextTick(() => {
      this.drawpie()
    })
  },
  methods: {
    drawpie(){
      let chartDom = document.getElementById('tongji');
      let myChart = echarts.init(chartDom);
      let option;

      option = {
        legend: {
          top: 'bottom'
        },
        series: [
          {
            name: this.pieTitle,
            type: 'pie',
            radius: [50, 150],
            center: ['50%', '50%'],
            roseType: 'area',
            itemStyle: {
              borderRadius: 8
            },
            data: this.piedata
          }
        ]
      };
      myChart.setOption(option, true)
    }
  }
}
</script>
<style scoped lang="scss">

/deep/.basic-main{
  padding: 18px !important;
  margin: 10px !important;
}
.sysIndexTitle{
  width: 100%;
  height: 95%;
}

</style>