<template>
  <HuilanBasic class="toolBox" style="height: 500px;">
    <slot name="header"></slot>
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
  props:{
    lineTitle:String,
    areaData:Array,
    areaNum:Array,
    seriesList:Array,
    legendList:Array,
    colorList:Array,
    areaTitle:Array,
  },
  watch: {
    lineTitle: {
      handler(newValue, oldValue) {
        if (newValue !== oldValue) {
          this.$nextTick(() => {
            this.drawpie();
          });
        }
      },
      immediate: false,
    },
    areaData: {
      handler(newValue, oldValue) {
        if (newValue !== oldValue) {
          this.$nextTick(() => {
            this.drawpie();
          });
        }
      },
      immediate: false,
    },
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

      if(this.areaNum.length  >  0){
        if(this.lineTitle == '办公用品消耗'){
          this.seriesList = [
            {
              name: '办公用品',
              type: 'bar',
              data: this.areaNum,
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
          ],
          this.legendList = ['办公用品']
          this.colorList = ['#af2c30']
        }else{
          this.seriesList = [
            {
              name: '地市',
              type: 'bar',
              data: this.areaNum,
              barMaxWidth: 30,
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
          ],
          this.legendList = ['地市']
          this.colorList = ['#af2c30']
        }
      }
      option = {
        title: {
          text: this.lineTitle,
        },
        grid: {
          top: '16%',
          left: '3%',
          right: '4%',
          bottom: '1%',
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
          data: this.legendList
        },
        calculable: true,
        color: this.colorList,
        xAxis: [
          {
            type: 'category',
            data: this.areaData
          }
        ],
        yAxis: [
          {
            type: 'value'
          }
        ],
        series: this.seriesList
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