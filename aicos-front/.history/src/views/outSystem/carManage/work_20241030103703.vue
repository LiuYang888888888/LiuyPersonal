<template>
  <div class="sysIndex">
    <div class="workbenches">
      <workbench :workbenchList="workbenchList"></workbench>
    </div>
    
    <div class="sysIndexBottom">
      <div class="sysIndexBottomLeft">
        <piekanban1 :pieTitle="pieTitle1" :piedata="piedata1" :pieInfo="pieInfo" @change="change"></piekanban1>
      </div>
      <div class="sysIndexBottomRight">
        <piekanban2 :pieTitle="pieTitle2" :piedata="piedata2" :pieInfo="pieInfo1"></piekanban2>
      </div>
    </div>

    <div class="sysIndexBottom">
      <template v-slot="header">
      </template>
      <div class="sysIndexBottomCon">
        <HuilanBasic class="toolBox">
          <div class="toolBoxTitle">{{lineTitle}}</div>
          <div class="soltBody">
            <div class="soltBodyContent" v-for="(item,index) in lineInfo" :key="index">
              <div class="soltBoxChart">{{ item.name }}</div>
              <div class="soltBoxFooter">{{ item.value }}</div>
            </div>
          </div>
        </HuilanBasic>
        <lineslot :areaData="areaData" :areaNum="areaNum"></lineslot>
      </div>
    </div>
    
  </div>
</template>
<script>
import workbench from '@/components/workCommon/workbench.vue'
import toDo from '@/components/workCommon/toDo.vue'
import piekanban1 from '@/components/workCommon/piekanban1.vue'
import piekanban2 from '@/components/workCommon/piekanban2.vue'
import lineslot from '@/components/workCommon/lineslot.vue'

export default {
  components: {
    workbench,
    toDo,
    piekanban1,
    piekanban2,
    lineslot,
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
        { value: 2, name: '不可用' },
      ],
      piedata2:[
        { value: 10, name: '已出车' },
        { value: 6, name: '空闲' },
      ],
      pieInfo:[
        { value: 17, name:  '车辆数' },
        { value: 10, name:  '已出车' },
        { value: 5, name:  '空闲' },
        { value: 2, name:  '不可用' },
      ],
      pieInfo1:[
        { value: 16, name:  '驾驶员数' },
        { value: 10, name:  '已出车' },
        { value: 6, name:  '空闲' },
      ],
      lineTitle:'用车统计',
      areaData:['已申请', '审核中' , '已审批', '已派车', '已出车', '已回车'],
      areaNum:[20, 12, 50 , 12, 6, 5],
      lineInfo:[
        { value: 16, name:  '待审批' },
        { value: 10, name:  '审批中' },
        { value: 20, name:  '已审批' },
        { value: 12, name:  '待派车' },
        { value: 8, name:  '已出车' },
        { value: 11, name:  '已还车' },
      ]
    }
  },
  methods:{
    change(name){
      if(name == '公车'){
        this.piedata1 = [
          { value: 10, name:  '已出车' },
          { value: 5, name: '空闲' },
          { value: 2, name: '不可用' },
        ]
        this.pieInfo = [
          { value: 17, name:  '车辆数' },
          { value: 10, name:  '已出车' },
          { value: 5, name:  '空闲' },
          { value: 2, name:  '不可用' },
        ]
      }else{
        this.piedata1 = [
          { value: 20, name:  '已出车' },
          { value: 3, name: '空闲' },
        ],
        this.pieInfo = [
          { value: 23, name:  '车辆数' },
          { value: 20, name:  '已出车' },
          { value: 3, name:  '空闲' },
        ]
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
.sysIndexBottom .sysIndexBottomCon{
  width: 100%;
}
.toolBoxTitle{
  font-size: 18px;
  color: #000;
  font-weight: bold;
}
.soltBody{
  width: 90%;
  margin: 20px auto 0;
  display: flex;
  justify-content: space-between;
  align-content: center;
}
.soltBodyContent{
  text-align: center;
}

.soltBoxChart{
  font-size: 16px;
  font-weight: 600;
  color: #333;
  margin-bottom: 10px;
}
.soltBoxFooter{
  font-size: 16px;
  font-weight: 600;
  color: #af2c30;
}
</style>