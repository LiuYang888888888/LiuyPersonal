<template>
  <div>
    <div ref="chart_bar" class="chart_bar"></div>
  </div>
</template>
<script>
export default {
  computed: {},
  props: {
    qusnConfig: {
      type: Object,
      default() {
        return {};
      },
    },
  },
  data() {
    return {};
  },
  methods: {
    getChart() {
      let chartColor = [
        "#0045c8",
        "#91cc75",
        "#fac858",
        "#ee6666",
        "#73c0de",
        "#3ba272",
        "#fc8452",
        "#9a60b4",
        "#ea7ccc",
        "#5470c6",
      ];
      let chartOption = {
        colro: chartColor,
        tooltip: {
          trigger: "item",
          formatter: "{b}:{c}",
        },
        grid:{
          left:'3%',
          right:'5%',
          bottom:'8%'
        },
        xAxis: {
          type: "category",
          data: [
            "0-20.0分",
            "20.1-40.0分",
            "40.1-60.0分",
            "60.1-80.0分",
            "80.1-100.0分",
          ],
          name: "分数",
          axisLabel: {
            // formatter: (value) => {
            //   return value.length > 7 ? value.substring(0, 7) + "..." : value;
            // },
            interval: 0,
          },
        },
        yAxis: {
          type: "value",
          name: "人数",
        },
        series: [
          {
            data: [2, 5, 9, 56, 10],
            type: "bar",
            barMaxWidth: 50,
            // showBackground: true,
            backgroundstyle: {
              color: "#ebeef5",
            },
          },
        ],
      };
      let chartRef = this.$refs.chart_bar;
      import("echarts").then((echarts) => {
        echarts.dispose(chartRef);
        const chartInit = echarts.init(chartRef);
        chartInit.setOption(chartOption);
      });
    },
  },
  mounted() {
    this.getChart();
  },
  watch: {},
};
</script>

<style lang="scss" scoped>
.chart_bar {
  width: 100%;
  min-width: 650px;
  height: 400px;
  margin: 0 auto;
}
</style>
