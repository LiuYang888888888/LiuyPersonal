<template>
  <div ref="container" style="width: 100%;height: 400px;"></div>
</template>

<script>
// import * as echarts from 'echarts';
export default {
  name: 'LineChar',
  inject: ['desktopWindow'],
  props: {
    options: {
      type: Object,
      default() {
        return {}
      }
    }
  },
  watch: {
    options(newVal) {
      this.chart.setOption(newVal)
    }
  },
  methods: {
    initChar() {
      const container = this.$refs.container
      import('echarts').then((echarts)=>{
        // 基于准备好的dom，初始化echarts实例
        const myChart = echarts.init(container);
        this.chart = myChart
      })

    },
    resize() {
      this.chart.resize()
    }
    // updateChar(opt) {
    //   this.chart.setOption(opt)
    // }
  },
  mounted() {
    this.initChar()
    // 在桌面环境中处理窗口的变化
    if(this.desktopWindow) {
      this.desktopWindow.$on('resize', this.resize)
    }
  },
  beforeDestroy() {
    if(this.desktopWindow) {
      this.desktopWindow.$off('resize', this.resize)
    }
  }
}
</script>

<style scoped>

</style>
