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
import {getWorkList} from "@/api/outSystem/share";

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
          path: '/outSystem/share/share',
          type:'add'
        },
        {
          icon: require('@/assets/outSystem/icon2.png'),
          title: '导出全部',
          path: '/outSystem/share/share',
          type:'export'
        },
        {
          icon: require('@/assets/outSystem/icon3.png'),
          title: '导入',
          path: '/outSystem/share/share',
          type:'upload'
        },
        {
          icon: require('@/assets/outSystem/icon4.png'),
          title: '下载模板',
          path: '/outSystem/share/share',
          type:'download'
        },
      ],
      dataList: [],
      pieTitle:'专利类型',
      piedata:[],
      lineTitle:'科研成果区域分布',
      areaData:[],
      areaNum:[],
    }
  },
  created() {
    this.getWorklist()
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