<template>
  <HuilanBasic class="toolBox" style="height: 305px;">
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
        title: {
          text: '业务统计',
        },
        grid: {
          left: '3%',
          right: '4%',
          bottom: '3%',
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
        legend: {
          data: ['业务']
        },
        calculable: true,
        color: ['#af2c30'],
        xAxis: [
          {
            type: 'category',
            data: ['军保企业', '需求信息', '技术产品', '供应信息', '企业信息', '设备资源', '民爆', '科研成果', '', '驻马店', '平顶山', '濮阳']
          }
        ],
        yAxis: [
          {
            type: 'value'
          }
        ],
        series: [
          {
            name: '业务',
            type: 'bar',
            data: [
              110, 205, 326, 231, 423, 558, 135, 213, 32.6, 20.0, 6.4, 3.3
            ],
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
  height: 100%;
}

</style>