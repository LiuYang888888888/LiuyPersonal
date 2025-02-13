<template>
  <HuilanBasic class="toolBox" style="height: 305px;">
    <div class="sysIndexTitle" id="tongji">
     
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
        title: {
          text: '军保优质企业行业类别统计',
          left: 'center',
          top: .5,
          textStyle: {
            color: '#000'
          }
        },
        legend: {
          top: 'right'
        },
        visualMap: {
          show: false,
          min: 80,
          max: 600,
          inRange: {
            colorLightness: [0, 1]
          }
        },
        series: [
          {
            name: '统计',
            type: 'pie',
            radius: '80%',
            center: ['50%', '55%'],
            data: [
              { value: 335, name: '野战食品' },
              { value: 310, name: '副食品' },
              { value: 274, name: '劳保用品' },
            ].sort(function (a, b) {
              return a.value - b.value;
            }),
            roseType: 'radius',
            label: {
              color: '#af2c30'
            },
            labelLine: {
              lineStyle: {
                color: '#af2c30'
              },
              smooth: 0.2,
              length: 10,
              length2: 20
            },
            itemStyle: {
              color: '#c23531',
              shadowBlur: 200,
              shadowColor: 'rgba(0, 0, 0, 0.1)'
            },
            animationType: 'scale',
            animationEasing: 'elasticOut',
            animationDelay: function (idx) {
              return Math.random() * 200;
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