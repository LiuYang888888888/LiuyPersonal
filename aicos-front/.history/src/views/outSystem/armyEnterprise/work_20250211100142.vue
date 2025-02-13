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
import {getWorklist} from "@/api/armyEnterPrise/common";
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
          path: '/outSystem/armyEnterprise/index',
          type:'add'
        },
        {
          icon: require('@/assets/outSystem/icon2.png'),
          title: '导出全部',
          path: '/outSystem/armyEnterprise/index',
          type:'export'
        },
        {
          icon: require('@/assets/outSystem/icon3.png'),
          title: '导入',
          path: '/outSystem/armyEnterprise/index',
          type:'upload'
        },
        {
          icon: require('@/assets/outSystem/icon4.png'),
          title: '下载模板',
          path: '/outSystem/armyEnterprise/index',
          type:'download'
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
        //   test1: "行业类别",
        //   test2: "15",
        // },
        // {
        //   test1: "单位性质",
        //   test2: "12",
        // },
      ],
      pieTitle:'军保优质企业行业类别统计',
      piedata:[
        { value: 335, name: '野战食品' },
        { value: 310, name: '副食品' },
        { value: 274, name: '劳保用品' },
      ],
      lineTitle:'企业地区分布',
      areaData:['郑州', '洛阳', '开封', '南阳', '安阳', '新乡', '鹤壁', '许昌', '三门峡', '驻马店', '平顶山', '濮阳'],
      areaNum:[280, 78, 100, 32, 45, 67, 50 , 88, 32, 20, 56, 23],
    }
  },
  created() {
    this.getWorklist()
  },
  methods: {
    getWorklist() {
      getWorklist().then(res => {
        res.data.data.forEach(item => {
          this.dataList.push({
            test1:item.typeName,
            test2:item.num,
            
      })
    },
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