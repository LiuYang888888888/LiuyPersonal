<template>
  <HuilanBasic class="toolBox" style="height: 500px;">
    <div class="sysIndexTitle" id="tongji"></div>
  </HuilanBasic>
</template>

<script>
import * as echarts from "echarts";

export default {
  name: "indexTools",
  data() {
    return {
      myChart: null, // 存储图表实例
    };
  },
  props: {
    pieTitle: String,
    piedata: Array,
  },
  watch: {
    pieTitle: {
      handler() {
        this.updateChart();
      },
      immediate: true,
    },
    piedata: {
      handler() {
        this.updateChart();
      },
      immediate: true,
    },
  },
  mounted() {
    this.$nextTick(() => {
      this.initializeChart();
    });
  },
  methods: {
    initializeChart() {
      const chartDom = document.getElementById('tongji');
      if (!chartDom) {
        console.warn('Chart container is not ready');
        return;
      }
      try {
        this.myChart = echarts.init(chartDom);
        this.updateChart();
      } catch (error) {
        console.error('Failed to initialize chart:', error);
      }
    },
    updateChart() {
      if (!this.myChart || !this.piedata || this.piedata.length === 0) {
        if (this.myChart) {
          this.myChart.setOption({
            series: [{ data: [] }]
          }, true);
        }
        console.warn('Chart data is not ready');
        return;
      }

      const option = {
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
            data: this.piedata.sort((a, b) => a.value - b.value),
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
            animationDelay: (idx) => Math.random() * 200,
          }
        ]
      };

      this.myChart.setOption(option, true);
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