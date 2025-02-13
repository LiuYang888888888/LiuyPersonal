<template>
  <HuilanBasic class="toolBox">
    <slot name="header"></slot>
    <div class="sysIndex">
      <div class="sysIndexTitle" id="fenbu"></div>
    </div>
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
    lineTitle:String,
    areaData:Array,
    areaNum:Array,
    seriesList:Array,
    legendList:Array,
    colorList:Array,
    areaTitle:Array,
  },
  mounted() {
    this.$nextTick(() => {
      this.drawpie()
    })
  },
  methods: {
    drawpie(){
      let chartDom = document.getElementById('fenbu');
      let myChart = echarts.init(chartDom);
      let option;
      
      option = {
        grid: {
          top: '5%',
          left: '5%',
          right: '5%',
          containLabel: true
        },
        toolbox: {
          show: false,
          feature: {
            magicType: { show: true, type: ['line', 'bar'] },
            restore: { show: true },
          }
        },
        tooltip: {
          trigger: 'axis'
        },
        calculable: true,
        color: ['#af2c30'],
        xAxis: [
          {
            type: 'category',
            data: this.areaData
          }
        ],
        yAxis: [
          {
            type: 'value'
          }
        ],
        series: [
          {
            name: '地市',
            type: 'bar',
            data: this.areaNum,
            markPoint: {
              data: [
                { type: 'max', name: 'Max' },
                { type: 'min', name: 'Min' }
              ]
            },
            markLine: {
              data: [{ type: 'average', name: '平均值' }]
            }
          }
        ],
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
.sysIndex{
  width: 80%;
  margin: 20px auto;
  height: 250px;
}
.sysIndexTitle{
  width: 100%;
  height: 100%;
}

</style>