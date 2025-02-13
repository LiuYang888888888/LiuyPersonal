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
    
  },
  methods: {
    drawpie(){
      let chartDom = document.getElementById('fuwuall');
      let myChart = echarts.init(chartDom);
      let option;
    }
  }
}
</script>
<style scoped lang="scss">

/deep/.basic-main{
  padding: 18px !important;
  margin: 10px !important;
}

</style>