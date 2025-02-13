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
          text: '企业地区分布',
        },
        tooltip: {
          trigger: 'axis'
        },
        legend: {
          data: ['Rainfall', 'Evaporation']
        },
        calculable: true,
        xAxis: [
          {
            type: 'category',
            // prettier-ignore
            data: ['郑州', '洛阳', '开封', '南阳', '安阳', '新乡', '鹤壁', '许昌', '三门峡', '驻马店', '平顶山', '濮阳']
          }
        ],
        yAxis: [
          {
            type: 'value'
          }
        ],
        series: [
          {
            name: 'Rainfall',
            type: 'bar',
            data: [
              2.0, 4.9, 7.0, 23.2, 25.6, 76.7, 135.6, 162.2, 32.6, 20.0, 6.4, 3.3
            ],
            markPoint: {
              data: [
                { type: 'max', name: 'Max' },
                { type: 'min', name: 'Min' }
              ]
            },
            markLine: {
              data: [{ type: 'average', name: 'Avg' }]
            }
          },
          {
            name: 'Evaporation',
            type: 'bar',
            data: [
              2.6, 5.9, 9.0, 26.4, 28.7, 70.7, 175.6, 182.2, 48.7, 18.8, 6.0, 2.3
            ],
            markPoint: {
              data: [
                { name: 'Max', value: 182.2, xAxis: 7, yAxis: 183 },
                { name: 'Min', value: 2.3, xAxis: 11, yAxis: 3 }
              ]
            },
            markLine: {
              data: [{ type: 'average', name: 'Avg' }]
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