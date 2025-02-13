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
          title: '公务用车申请',
          path: '/outSystem/carManage/dispatched',
          type:'add'
        },
        {
          icon: require('@/assets/outSystem/icon2.png'),
          title: '社会用车申请',
          path: '/outSystem/officeManage/inventory',
          type:'view'
        },
        {
          icon: require('@/assets/outSystem/icon3.png'),
          title: '车辆信息',
          path: '/outSystem/officeManage/storage',
          type:'add'
        },
        {
          icon: require('@/assets/outSystem/icon4.png'),
          title: '驾驶员管理',
          path: '/outSystem/officeManage/outbound',
          type:'add'
        },
        {
          icon: require('@/assets/outSystem/icon5.png'),
          title: '公务车辆派遣记录',
          path: '/outSystem/officeManage/outbound',
          type:'view'
        },
        {
          icon: require('@/assets/outSystem/icon6.png'),
          title: '社会车辆派遣记录',
          path: '/outSystem/officeManage/outbound',
          type:'view'
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
      ],
      pieTitle:'办公用品库存',
      piedata:[
        { value: 335, name: '记事本' },
        { value: 310, name: '打印机' },
        { value: 274, name: '圆珠笔' },
      ],
      lineTitle:'办公用品消耗',
      areaData:['圆珠笔', '记事本', '钢笔', '打印机', '记号笔', '铅笔', '便签本', '软抄本', 'A4纸'],
      areaNum:[180, 78, 100, 32, 45, 67, 50 , 88, 320],
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