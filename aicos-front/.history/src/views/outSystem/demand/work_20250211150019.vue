<template>
  <div class="sysIndex">
    <div class="workbenches">
      <workbench :workbenchList="workbenchList"></workbench>
    </div>

    <div class="sysIndexBottom">
      <toDoList :dataList="dataList" :readyList="readyList" @childEvent="chooseInfo"></toDoList>
    </div>
    <div class="sysIndexBottom">
      <div class="sysIndexBottomLeft">
        <pie :pieTitle="pieTitle" :piedata="piedata" ref="pies"></pie>
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
import {getWorkbenchList} from "@/api/outSystem/demand";
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
          title: '民口需求信息',
          path: '/outSystem/demand/index',
          type:'add'
        },
        {
          icon: require('@/assets/outSystem/icon2.png'),
          title: '军口需求信息',
          path: '/outSystem/demand/junkou',
          type:'add'
        },
      ],
      dataList: [],
      data1:[],
      data2:[],
      readyList:[
        {
          title:'民口需求信息'
        },
        {
          title:'军口需求信息'
        },
      ],
      pieTitle:'民口需求类型',
      piedata:[],
      lineTitle:'需求机构区域分布',
      areaData:[],
      areaNum:[],
      seriesList:[
        {
          name: '民口',
          type: 'bar',
          data: [],
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
          data: [],
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
  created() {
    this.getWorklist()
  },
  methods:{
    async getWorklist() {
      try {
        const res = await getWorkbenchList();
        res.data.data.forEach(item => {
          if (item.type_ == '1') {
            if(item.type_value == 'num1' || item.type_value == 'num2' || item.type_value == 'num3'){
              this.data1.push(item)
            }else{
              this.data2.push(item)
            }
            this.dataList = [[...this.data1],[...this.data2]]
          }

          if (item.type_ == '21' && item.type_num > 0) {
            let pieobj = {
              value: item.type_num,
              name: item.type_value,
            };
            this.piedata1.push(pieobj);
            
          }
          if (item.type_ == '22' && item.type_num > 0){
          let pieobj = {
              value: item.type_num,
              name: item.type_value,
            };
            this.piedata2.push(pieobj);
          }

          if (item.type_ == '31') {
            let typearr = item.type_value.split('/');
            if (typearr.length > 0 && typearr[1] && typearr[0] == '河南省') {
              this.areaData.push(typearr[1]);
              this.seriesList[0].data.push(item.type_num);
            }
          }
          if (item.type_ == '32') {
            let typearr2 = item.type_value.split('/');
            if (typearr2.length > 0 && typearr2[1] && typearr2[0] == '河南省') {
              if (this.areaData.includes(typearr2[1])) {
                this.seriesList[1].data.push(item.type_num);
              } else {
                this.areaData.push(typearr2[1]);
                this.seriesList[0].data.push(0);
                this.seriesList[1].data.push(item.type_num);
              }
            }
          }
        });
        this.piedata = this.piedata1
      } catch (error) {
        console.error('Failed to fetch worklist:', error);
      }
    },
    chooseInfo(data){
      if(data == '民口需求信息'){
        this.pieTitle = "民口需求类型"
        this.piedata = this.piedata1
      }
      if(data == '军口需求信息'){
        this.pieTitle = "军口需求类型"
        this.piedata = this.piedata2
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