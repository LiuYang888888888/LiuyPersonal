<template>
  <div class="sysIndex">
    <div class="workbenches">
      <workbench :workbenchList="workbenchList"></workbench>
    </div>

    <div class="sysIndexBottom">
      <toDo :dataList="dataList"></toDo>
    </div>
    <div class="sysIndexBottom">
      <div class="sysIndexBottomLeft">
        <pie :pieTitle="pieTitle" :piedata="piedata"></pie>
      </div>
      <div class="sysIndexBottomRight">
        <lineshow :lineTitle="lineTitle" :areaData="areaData" :areaNum="areaNum"></lineshow>
      </div>
    </div>
    
  </div>
</template>
<script>
import workbench from '@/components/workCommon/workbench.vue'
import toDo from '@/components/workCommon/toDo.vue'
import pie from '@/components/workCommon/pie.vue'
import lineshow from '@/components/workCommon/lineshow.vue'
import {getWorkbench} from "@/api/outSystem/zhiku";

export default {
  components: {
    workbench,
    toDo,
    pie,
    lineshow,
  },
  data() {
    return {
      workbenchList:[
        {
          icon: require('@/assets/outSystem/icon1.png'),
          title: '融合智库新增',
          path: '/outSystem/zhiku/zhiku',
          type:'add'
        },
        {
          icon: require('@/assets/outSystem/icon2.png'),
          title: '专家智库导出全部',
          path: '/outSystem/zhiku/expert',
          type:'export'
        },
      ],
      dataList: [
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
        // {
        //   test1: "设备类型",
        //   test2: "5",
        // },
      ],
      pieTitle:'职称',
      piedata:[
        { value: 350, name: '教授' },
        { value: 280, name: '副教授' },
        { value: 450, name: '讲师' },
      ],
      lineTitle:'设备资源区域分布',
      areaData:['郑州', '洛阳', '开封', '南阳', '安阳', '新乡', '鹤壁', '许昌', '三门峡', '驻马店', '平顶山', '濮阳'],
      areaNum:[280, 178, 200, 132, 55, 68, 50 , 78, 32, 50, 66, 21],
    }
  },
  mounted() {
    this.getWorkbench()
  },
  methods: {
    async getWorkbench(){
      getWorkbench().then(res=>{
        if(res.code==200){
          this.dataList = res.data
        }
      })
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