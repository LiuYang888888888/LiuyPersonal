<template>
  <HuilanBasic class="toolBox" style="height: 500px;">
    <div class="toolBoxHeader">
      <div class="toolBoxTitle">{{pieTitle}}</div>
      <div class="toolBoxRadio">
        <el-radio-group v-model="tabPosition" @input="change">
          <el-radio-button label="公车">公车</el-radio-button>
          <el-radio-button label="社会用车">社会用车</el-radio-button>
        </el-radio-group>
      </div>
    </div>
    <div class="toolBoxBody">
      <div class="toolBoxContent" v-for="(item,index) in pieInfo" :key="index">
        <div class="toolBoxChart">{{ item.name }}</div>
        <div class="toolBoxFooter">{{ item.value }}</div>
      </div>
    </div>
    <div class="sysIndexTitle" id="tongji"></div>
  </HuilanBasic>
</template>

<script>
import * as echarts from "echarts";
export default {
  name: "indexTools",
  data() {
    return {
      tabPosition:'公车'
    }
  },
  props:{
    pieTitle:String,
    piedata:Array,
    pieInfo:Array,
  },
  watch:{
    piedata:{
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
    change(){
      this.$emit('change',this.tabPosition)
    },
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
            radius: [50, 120],
            center: ['50%', '50%'],
            roseType: 'area',
            itemStyle: {
              borderRadius: 8
            },
            data: this.piedata
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
  height: 80%;
}
.toolBoxHeader{
  display: flex;
  justify-content: space-between;
}
.toolBoxTitle{
  font-size: 18px;
  color: #000;
  font-weight: bold;
}
.toolBoxBody{
  width: 90%;
  margin: 10px auto 0;
  display: flex;
  justify-content: space-between;
  align-content: ;
}
.toolBoxChart{
  
}

</style>