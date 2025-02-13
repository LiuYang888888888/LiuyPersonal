<template>
  <div class="sysIndex">
    <div class="workbenches">
      <workbench :workbenchList="workbenchList"></workbench>
    </div>
    
    <div class="sysIndexBottom">
      <div class="sysIndexBottomLeft">
        <piekanban :pieTitle="pieTitle1" :piedata="piedata1"></piekanban>
      </div>
      <div class="sysIndexBottomRight">
        <piekanban :pieTitle="pieTitle2" :piedata="piedata2"></piekanban>
      </div>
    </div>
    
  </div>
</template>
<script>
import workbench from '@/components/workCommon/workbench.vue'
import toDo from '@/components/workCommon/toDo.vue'
import piekanban from '@/components/workCommon/piekanban.vue'
import lineshow from '@/components/workCommon/lineshow.vue'

export default {
  components: {
    workbench,
    toDo,
    piekanban,
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
          path: '/outSystem/carManage/carSocial',
          type:'add'
        },
        {
          icon: require('@/assets/outSystem/icon3.png'),
          title: '车辆信息',
          path: '/outSystem/carManage/carInfo',
          type:'add'
        },
        {
          icon: require('@/assets/outSystem/icon4.png'),
          title: '驾驶员管理',
          path: '/outSystem/carManage/driverManage',
          type:'add'
        },
        {
          icon: require('@/assets/outSystem/icon5.png'),
          title: '公务车辆派遣记录',
          path: '/outSystem/carManage/despatchedMs',
          type:'view'
        },
        {
          icon: require('@/assets/outSystem/icon6.png'),
          title: '社会车辆派遣记录',
          path: '/outSystem/carManage/carSocialMs',
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
      pieTitle1:'用车看板',
      pieTitle2:'驾驶员看板',
      piedata1:[
        { value: 10, name:  '已出车' },
        { value: 5, name: '空闲' },
        { value: 274, name: '圆珠笔' },
      ],
      piedata2:[
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