<template>
  <HuilanBasic class="toolBox" style="height: 500px;">
    <div>
      <div class="toolBoxTitle">{{pieTitle}}</div>
      <div>
        <el-row>
          <el-button plain>朴素按钮</el-button>
          <el-button type="primary" plain>主要按钮</el-button>
          <el-button type="success" plain>成功按钮</el-button>
          <el-button type="info" plain>信息按钮</el-button>
          <el-button type="warning" plain>警告按钮</el-button>
          <el-button type="danger" plain>危险按钮</el-button>
        </el-row>
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