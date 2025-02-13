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
      
    }
  },
  props:{
    pieTitle:String,
    piedata:Array,
  },
  watch:{
    pieTitle:{
      handler(newValue, oldValue) {
        if(newValue !== oldValue){
          this.$nextTick(() => {
            this.drawpie()
          })
        }
      },
      deep:true,
      immediate:false,
    },
  },
  mounted() {
    this.$nextTick(() => {
      this.drawpie()
    })
  },
  methods: {
    drawpie(){
      console.log('pieTitle:', this.pieTitle);
      console.log('piedata:', this.piedata);
      let chartDom = document.getElementById('tongji');
      let myChart = echarts.init(chartDom);
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