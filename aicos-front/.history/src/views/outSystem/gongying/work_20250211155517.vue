<template>
  <div class="sysIndex">
    <div class="workbenches">
      <workbench :workbenchList="workbenchList"></workbench>
    </div>

    <div class="sysIndexBottom">
      <toDoList v-if="dataList.length > 0" :dataList="dataList" :readyList="readyList" @childEvent="chooseInfo"></toDoList>
    </div>
    <div class="sysIndexBottom">
      <div class="sysIndexBottomLeft">
        <pie v-if="piedata.length > 0" :pieTitle="pieTitle" :piedata="piedata" ref="pies"></pie>
      </div>
      <div class="sysIndexBottomRight">
        <lineshow :lineTitle="lineTitle" :areaData="areaData" :areaNum="areaNum" :seriesList="seriesList" :legendList="legendList" :colorList="colorList"></lineshow>
      </div>
    </div>
    
  </div>
</template>
<script>
import workbench from '@/components/workCommon/workbench.vue'
import toDoList from '@/components/workCommon/toDoList.vue'
import pie from '@/components/workCommon/pie.vue'
import lineshow from '@/components/workCommon/lineshow.vue'
import {getWorkbench} from "@/api/outSystem/junkouservices";

export default {
  components: {
    workbench,
    toDoList,
    pie,
    lineshow,
  },
  data() {
    return {
      workbenchList:[
        {
          icon: require('@/assets/outSystem/icon1.png'),
          title: '民口供应信息',
          path: '/outSystem/gongying/services',
          type:'add'
        },
        {
          icon: require('@/assets/outSystem/icon2.png'),
          title: '军口供应信息',
          path: '/outSystem/gongying/junkou',
          type:'add'
        },
      ],
      dataList: [
        [
          {
            test1: "待审核",
            test2: "10",
          },
          {
            test1: "已驳回",
            test2: "5",
          },
          {
            test1: "已通过",
            test2: "30",
          },
        ],
        [
          {
            test1: "待审核",
            test2: "15",
          },
          {
            test1: "已驳回",
            test2: "10",
          },
          {
            test1: "已通过",
            test2: "40",
          },
        ],
      ],
      readyList:[
        {
          title:'民口供应信息'
        },
        {
          title:'军口供应信息'
        },
      ],
      pieTitle:'民口机构类型',
      piedata:[
        { value: 335, name: '信息对接与交流' },
        { value: 310, name: '创业孵化' },
        { value: 274, name: '管理咨询服务' },
      ],
      lineTitle:'服务机构区域分布',
      areaData:['郑州', '洛阳', '开封', '南阳', '安阳', '新乡', '鹤壁', '许昌', '三门峡', '驻马店', '平顶山', '濮阳'],
      areaNum:[],
      seriesList:[
        {
          name: '民口',
          type: 'bar',
          data: [280, 78, 100, 32, 45, 67, 50 , 88, 32, 20, 56, 23],
          markPoint: {
            data: [
              { type: 'max', name: 'Max' },
              { type: 'min', name: 'Min' }
            ]
          },
          markLine: {
            data: [{ type: 'average', name: '平均值' }]
          }
        },
        {
          name: '军口',
          type: 'bar',
          data: [180, 88, 120, 62, 25, 37, 80 , 118, 52, 60, 126, 13],
          markPoint: {
            data: [
              { type: 'max', name: 'Max' },
              { type: 'min', name: 'Min' }
            ]
          },
          markLine: {
            data: [{ type: 'average', name: '平均值' }]
          }
        },
      ],
      legendList:['民口','军口'],
      colorList:['#af2c30','#ee6666']
    }
  },
  methods:{
    // 指定范围内，指定个数，无重复的随机整数
    getRandomNumber(n,min,max){
      let arr=[];
      for(let i = 0; i < n; i ++){
        arr[i] = parseInt(Math.random() * (max - min + 1) + min);
      }
      for(let i = 0; i < n; i++){
        for(let j = i + 1; j < n; j ++){
          if(arr[i] === arr[j]){
            this.getRandomNumber(n,min,max);
            return false;
          }
        }
      }
      return arr
    },
    chooseInfo(data){
      if(data == '民口供应信息'){
        this.pieTitle = "民口机构类型"
        this.piedata = [
          { value: 335, name: '信息对接与交流' },
          { value: 310, name: '创业孵化' },
          { value: 274, name: '管理咨询服务' },
        ]
      }
      if(data == '军口供应信息'){
        this.pieTitle = "军口机构类型"
        this.piedata = [
          { value: 335, name: '信息对接与交流' },
          { value: 310, name: '创业孵化' },
          { value: 235, name: '科技投融资' },
          { value: 110, name: '技术评估与转化' },
        ]
      }
    }
  }
}


</script>
<style scoped lang="scss">

.sysIndexBottom {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
}
.sysIndexBottom .sysIndexBottomLeft {
  width: 50%;
}

.sysIndexBottom .sysIndexBottomRight {
  width: 50%;
}
</style>