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
        <pie v-if="piedata.length > 0" :pieTitle="pieTitle" :piedata="piedata"></pie>
      </div>
      <div class="sysIndexBottomRight">
        <lineshow v-if="areaNum.length > 0" :lineTitle="lineTitle" :areaData="areaData" :areaNum="areaNum"></lineshow>
      </div>
    </div>
    
  </div>
</template>
<script>
import workbench from '@/components/workCommon/workbench.vue'
import toDoList from '@/components/workCommon/toDoList.vue'
import pie from '@/components/workCommon/pie.vue'
import lineshow from '@/components/workCommon/lineshow.vue'
import {getWorkbenchList} from "@/api/outSystemProduct/common";

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
          icon: require('@/assets/outSystem/icon2.png'),
          title: '新增',
          path: '/outSystem/product/index',
          type:'add'
        },
        {
          icon: require('@/assets/outSystem/icon3.png'),
          title: '导出全部',
          path: '/outSystem/product/index',
          type:'export'
        },
      ],
      dataList: [],
      data1:[],
      data2:[],
      readyList:[
        {
          title:'民参军技术产品'
        },
        {
          title:'军转民技术产品'
        },
      ],
      pieTitle:'技术产品类型',
      piedata:[],
      piedata1:[],
      piedata2:[],
      lineTitle:'技术产品区域分布',
      areaData:[],
      areaNum:[],
    }
  },
  created() {
    this.getWorklist()
  },
  methods: {
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

          if (item.type_ == '2' && item.type_num > 0) {
            if
            let pieobj = {
              value: item.type_num,
              name: item.type_value,
            };
            this.piedata.push(pieobj);
          }
          if (item.type_ == '3') {
            let typearr = item.type_value.split('/');
            if (typearr.length > 0 && typearr[1]) {
              this.areaData.push(typearr[1]);
              this.areaNum.push(item.type_num);
            }
          }
        });
      } catch (error) {
        console.error('Failed to fetch worklist:', error);
      }
    },
    chooseInfo(data){
      if(data == '民参军技术产品'){
        //this.pieTitle = "民参军技术产品类型"
        this.piedata = [
          { value: 335, name: '技术需求' },
          { value: 310, name: '产品需求' },
          { value: 274, name: '融资需求' },
        ]
      }
      if(data == '军转民技术产品'){
        //this.pieTitle = "军转民技术产品类型"
        this.piedata = [
          { value: 235, name: '技术需求' },
          { value: 310, name: '产品需求' },
          { value: 194, name: '融资需求' },
          { value: 374, name: '军工配套需求' },
        ]
      }
    }
  },
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