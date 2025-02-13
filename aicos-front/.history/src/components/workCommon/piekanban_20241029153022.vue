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
      let chartDom = document.getElementById('tongji');
      let myChart = echarts.init(chartDom);
      let option;

      option = {
        legend: {
          top: 'bottom'
        },
        series: [
          {
            name: this.pieTitle,
            type: 'pie',
            radius: [50, 250],
            center: ['50%', '50%'],
            roseType: 'area',
            itemStyle: {
              borderRadius: 8
            },
            data: [
              { value: 40, name: 'rose 1' },
              { value: 38, name: 'rose 2' },
              { value: 32, name: 'rose 3' },
              { value: 30, name: 'rose 4' },
              { value: 28, name: 'rose 5' },
              { value: 26, name: 'rose 6' },
              { value: 22, name: 'rose 7' },
              { value: 18, name: 'rose 8' }
            ]
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