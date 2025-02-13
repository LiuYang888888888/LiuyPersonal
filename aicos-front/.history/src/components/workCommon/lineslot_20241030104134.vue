<template>
  <HuilanBasic class="toolBox" style="height: 500px;">
    <slot name="header"></slot>
    <div class="sysIndexTitle" id="fenbu"></div>
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
          left: '15%',
          right: '15%',
          bottom: '2%',
          containLabel: true
        },
        toolbox: {
          show: true,
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
.sysIndexTitle{
  width: 70%;
  height: 65%;
}

</style>