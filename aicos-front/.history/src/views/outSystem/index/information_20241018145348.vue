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
          text: '统计',
          left: 'center',
          top: .5,
          textStyle: {
            color: '#000'
          }
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
            name: 'Access From',
            type: 'pie',
            radius: '80%',
            center: ['50%', '50%'],
            data: [
              { value: 335, name: 'Direct' },
              { value: 310, name: 'Email' },
              { value: 274, name: 'Union Ads' },
              { value: 235, name: 'Video Ads' },
              { value: 400, name: 'Search Engine' }
            ].sort(function (a, b) {
              return a.value - b.value;
            }),
            roseType: 'radius',
            label: {
              color: 'rgba(255, 255, 255, 0.3)'
            },
            labelLine: {
              lineStyle: {
                color: 'rgba(255, 255, 255, 0.3)'
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