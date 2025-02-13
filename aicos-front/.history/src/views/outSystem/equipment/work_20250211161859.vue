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
import toDo from '@/components/workCommon/toDo.vue'
import pie from '@/components/workCommon/pie.vue'
import lineshow from '@/components/workCommon/lineshow.vue'
import {getWorkBench} from "@/api/outSystem/equipment";

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
          title: '新增',
          path: '/outSystem/equipment/index',
          type:'add'
        },
        {
          icon: require('@/assets/outSystem/icon2.png'),
          title: '导出全部',
          path: '/outSystem/equipment/index',
          type:'export'
        },
        {
          icon: require('@/assets/outSystem/icon3.png'),
          title: '导入',
          path: '/outSystem/equipment/index',
          type:'upload'
        },
        {
          icon: require('@/assets/outSystem/icon4.png'),
          title: '下载模板',
          path: '/outSystem/equipment/index',
          type:'download'
        },
      ],
      dataList: [],
      pieTitle:'设备类型',
      piedata:[],
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