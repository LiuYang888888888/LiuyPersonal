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
      dataList: [],
      data1:[],
      data2:[],
      readyList:[
        {
          title:'民口供应信息'
        },
        {
          title:'军口供应信息'
        },
      ],
      pieTitle:'民口机构类型',
      piedata:[],
      piedata1:[],
      piedata2:[],
    }
  },
  created() {
    this.getWorklist()
  },
  methods:{
    async getWorklist() {
      try {
        const res = await getWorkbench();
        res.data.data.forEach(item => {
          if (item.type_ == '1') {
            if (['num1', 'num2', 'num3'].includes(item.type_value)) {
              this.data1.push(item);
            } else {
              this.data2.push(item);
            }
            this.dataList = [[...this.data1],[...this.data2]]
          }

          if (item.type_ == '21' && item.type_num > 0) {
            this.piedata1.push({ value: item.type_num, name: item.type_value });
          }
          if (item.type_ == '22' && item.type_num > 0) {
            this.piedata2.push({ value: item.type_num, name: item.type_value });
          }
          
        });

        this.piedata = this.piedata1
      } catch (error) {
        console.error('Failed to fetch worklist:', error);
      }
    },
    chooseInfo(data){
      if(data == '民口供应信息'){
        this.pieTitle = "民口机构类型"
        this.piedata = this.piedata1
      }
      if(data == '军口供应信息'){
        this.pieTitle = "军口机构类型"
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