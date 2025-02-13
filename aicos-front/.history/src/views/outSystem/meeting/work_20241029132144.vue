<template>
  <div class="sysIndex">
    <div class="workbenches">
      <workbench :workbenchList="workbenchList"></workbench>
    </div>

    <div class="sysIndexBottom">
      
      <toDo :dataList="dataList"></toDo>
      
    </div>
    <div class="sysIndexBottom">
      <pie :pieTitle="pieTitle" :piedata="piedata"></pie>
      <!-- <div class="sysIndexBottomLeft">
        <pie :pieTitle="pieTitle" :piedata="piedata"></pie>
      </div> -->
      <!-- <div class="sysIndexBottomRight">
        <lineshow :lineTitle="lineTitle" :areaData="areaData" :areaNum="areaNum"></lineshow>
      </div> -->
    </div>
    
  </div>
</template>
<script>
import workbench from '@/components/workCommon/workbench.vue'
import toDo from '@/components/workCommon/toDo.vue'
import pie from '@/components/workCommon/pie.vue'
import lineshow from '@/components/workCommon/lineshow.vue'

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
          title: '会议室新增',
          path: '/outSystem/agency/agency',
          type:'add'
        },
        {
          icon: require('@/assets/outSystem/icon2.png'),
          title: '会议室申请',
          path: '/outSystem/agency/agency',
          type:'export'
        },
      ],
      dataList: [
        {
          test1: "申请数量",
          test2: "20",
        },
      ],
      pieTitle:'会议室',
      piedata:[
        { value: 335, name: '第一会议室' },
        { value: 201, name: '第二会议室' },
      ],
      // lineTitle:'服务机构区域分布',
      // areaData:['郑州', '洛阳', '开封', '南阳', '安阳', '新乡', '鹤壁', '许昌', '三门峡', '驻马店', '平顶山', '濮阳'],
      // areaNum:[280, 78, 100, 32, 45, 67, 50 , 88, 32, 20, 56, 23],
    }
  },
}


</script>
<style scoped lang="scss">

.sysIndexBottom {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  width: 100%;
}
.sysIndexBottom .sysIndexBottomLeft {
  width: 50%;
}

.sysIndexBottom .sysIndexBottomRight {
  width: 50%;
}
</style>