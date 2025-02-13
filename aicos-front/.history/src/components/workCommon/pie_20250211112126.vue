<template>
  <HuilanBasic class="toolBox" style="height: 500px;">
    <div class="sysIndexTitle" id="tongji"></div>
  </HuilanBasic>
</template>
<script>
import * as echarts from "echarts";
export default {
  name: "indexTools",
  data () {
    return {
      myChart:null,
      colors: ['#FF5733', '#3399FF', '#FF8C69', '#3366CC', '#FFA07A', '#334DFF', '#FFB399', '#3333FF', '#FFCCB3', '#00008B', '#8B0000']
    }
  },
  props: {
    pieTitle: String,
    piedata: Array,
  },
  watch: {
    pieTitle: {
      handler (newValue, oldValue) {
        if (newValue !== oldValue) {
          this.$nextTick(() => {
            this.drawpie()
          })
        }
      },
      immediate: false,
    },
    piedata: {
      handler (newValue, oldValue) {
        if (newValue !== oldValue) {
          this.$nextTick(() => {
            this.drawpie()
          })
        }
      },
      immediate: false,
    },
  },
  mounted () {
    this.$nextTick(() => {
      this.drawpie()
    })
  },
  methods: {
    drawpie () {
      let chartDom = document.getElementById('tongji');
      if (!chartDom || !this.piedata || this.piedata.length === 0) {
        console.warn('Chart container or data is not ready');
        return;
      }
      this.myChart = echarts.init(chartDom);
      let option;

      option = {
        title: {
          text: this.pieTitle,
          left: 'center',
          top: .5,
          textStyle: {
            color: '#000'
          }
        },
        tooltip: {
          trigger: 'item'
        },
        legend: {
          orient: 'vertical',
          left: 'left'
        },
        visualMap: {
          show: false,
          min: 100,
          max: 200,
          inRange: {
            colorLightness: [0, 1]
          }
        },
        series: [
          {
            name: '统计',
            type: 'pie',
            radius: '75%',
            center: ['50%', '55%'],
            data: this.piedata.sort(function (a, b) {
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
              color: (params) => this.colors[params.dataIndex % this.colors.length], // 使用自定义颜色数组
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
      this.myChart.setOption(option, true)
    }
  }
}
</script>
<style scoped lang="scss">
/deep/.basic-main {
  padding: 18px !important;
  margin: 10px !important;
}

.sysIndexTitle {
  width: 100%;
  height: 100%;
}
</style>