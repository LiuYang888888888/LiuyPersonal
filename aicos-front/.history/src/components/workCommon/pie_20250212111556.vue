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
      myChart: null,
      colors: ['#FF5733', '#3399FF', '#FF8C69', '#3366CC', '#FFA07A', '#334DFF', '#FFB399', '#3333FF', '#FFCCB3', '#00008B', '#8B0000']
    };
  },
  props: {
    pieTitle: String,
    piedata: Array,
  },
  watch: {
    pieTitle: {
      handler(newValue, oldValue) {
        if (newValue !== oldValue) {
          this.$nextTick(() => {
            this.drawPie();
          });
        }
      },
      immediate: false,
    },
    piedata: {
      handler(newValue, oldValue) {
        if (newValue !== oldValue) {
          this.$nextTick(() => {
            this.drawPie();
          });
        }
      },
      immediate: false,
    },
  },
  mounted() {
    this.$nextTick(() => {
      this.drawPie();
      window.addEventListener('resize', this.resize);
    });
  },
  beforeDestroy() {
    window.removeEventListener('resize', this.resize);
    if (this.myChart) {
      this.myChart.dispose();
    }
  },
  methods: {
    drawPie() {
      let chartDom = document.getElementById('tongji');
      if (!chartDom || !this.piedata || this.piedata.length === 0) {
        console.warn('Chart container or data is not ready');
        return;
      }
      if (this.myChart) {
        this.myChart.dispose();
      }
      this.myChart = echarts.init(chartDom, null, { renderer: 'canvas' });
      let option = {
        title: {
          text: this.pieTitle,
          left: 'center',
          top: 0.5,
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
        series: [
          {
            name: '统计',
            type: 'pie',
            radius: '75%',
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
              color: (params) => this.colors[params.dataIndex % this.colors.length],
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
      this.myChart.setOption(option, true);
      this.myChart.resize(); // 确保初始化时调整尺寸
    },
    resize() {
      if (this.myChart) {
        this.myChart.resize();
      }
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
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>