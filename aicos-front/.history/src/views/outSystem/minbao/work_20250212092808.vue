<template>
  <div class="sysIndex">
    <div class="workbenches">
      <workbench :workbenchList="workbenchList"></workbench>
    </div>

    <div class="sysIndexBottom">
      <toDoList :dataList="dataList" :readyList="readyList" @childEvent="chooseInfo"></toDoList>
    </div>
    <div class="sysIndexBottom">
      <div class="sysIndexBottomLeft">
        <pie :pieTitle="pieTitle" :piedata="piedata" ref="pies"></pie>
      </div>
      <div class="sysIndexBottomRight">
        <lineshow :lineTitle="lineTitle" :areaData="areaData" :areaNum="areaNum" ref="lines"></lineshow>
      </div>
    </div>
    
  </div>
</template>
<script>
import workbench from '@/components/workCommon/workbench.vue'
import toDoList from '@/components/workCommon/toDoList.vue'
import pie from '@/components/workCommon/pie.vue'
import lineshow from '@/components/workCommon/lineshow.vue'
import {getWorkbench} from "@/api/outSystem/mbCompany";

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
          title: '监管体系新增',
          path: '/outSystem/minbao/superVision',
          type:'add'
        },
        {
          icon: require('@/assets/outSystem/icon2.png'),
          title: '企业信息新增',
          path: '/outSystem/minbao/company',
          type:'add'
        },
        {
          icon: require('@/assets/outSystem/icon3.png'),
          title: '应急体系新增',
          path: '/outSystem/minbao/emergency',
          type:'add'
        },
        {
          icon: require('@/assets/outSystem/icon4.png'),
          title: '安全管理人员考核新增',
          path: '/outSystem/minbao/safePerson',
          type:'add'
        },
        {
          icon: require('@/assets/outSystem/icon5.png'),
          title: '文件收发管理新增',
          path: '/outSystem/minbao/fileManage',
          type:'add'
        },
        {
          icon: require('@/assets/outSystem/icon6.png'),
          title: '安全管理先进申报新增',
          path: '/outSystem/minbao/safeManage',
          type:'add'
        },
        {
          icon: require('@/assets/outSystem/icon7.png'),
          title: '安全生产许可年检新增',
          path: '/outSystem/minbao/safeShengchan',
          type:'add'
        },
        {
          icon: require('@/assets/outSystem/icon8.png'),
          title: '销售许可年检新增',
          path: '/outSystem/minbao/sallCheck',
          type:'add'
        },
      ],
      dataList: [],
      readyList:[
        {
          title:'监管体系'
        },
        {
          title:'企业信息'
        },
        {
          title:'应急体系'
        },
        {
          title:'安全管理人员考核'
        },
        {
          title:'文件收发管理'
        },
        {
          title:'安全管理先进申报'
        },
        {
          title:'安全生产许可年检'
        },
        {
          title:'销售许可年检'
        },
      ],
      pieTitle:'单位类型',
      piedata:[],
      lineTitle:'监管/应急企业/企业各地市分布',
      areaData:[],
      areaNum:[],
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
            if (['num11', 'num12', 'num13'].includes(item.type_value)) {
              this.data1.push(item);
            } 
            if(['num21', 'num22', 'num23'].includes(item.type_value)){
              this.data2.push(item);
            }
            if(['num31', 'num32', 'num33'].includes(item.type_value)){
              this.data3.push(item);
            }
            if(['num41', 'num42', 'num43'].includes(item.type_value)){
              this.data4.push(item);
            }
            if(['num51', 'num52', 'num53'].includes(item.type_value)){
              this.data5.push(item);
            }
            if(['num61', 'num62', 'num63'].includes(item.type_value)){
              this.data6.push(item);
            }
            if(['num71', 'num72', 'num63'].includes(item.type_value)){
              this.data6.push(item);
            }
            this.dataList = [[...this.data1],[...this.data2]]
          }

          if (item.type_ == '21' && item.type_num > 0) {
            this.piedata1.push({ value: item.type_num, name: item.type_value });
          }
          if (item.type_ == '22' && item.type_num > 0) {
            this.piedata2.push({ value: item.type_num, name: item.type_value });
          }

          if (item.type_ == '31') {
            let typearr = item.type_value.split('/');
            if (typearr.length > 0 && typearr[1] && typearr[0] == '河南省') {
              this.areaData1.push(typearr[1]);
              this.areaNum1.push(item.type_num);
            }
          }
          if (item.type_ == '32') {
            let typearr2 = item.type_value.split('/');
            if (typearr2.length > 0 && typearr2[1] && typearr2[0] == '河南省') {
              this.areaData2.push(typearr2[1]);
              this.areaNum2.push(item.type_num);
            }
          }
        });
        const areaSet = new Set([...this.areaData1, ...this.areaData2]);
        this.areaData = Array.from(areaSet);

        this.seriesList[0].data = this.areaData.map(area => this.areaNum1[this.areaData1.indexOf(area)] || 0);
        this.seriesList[1].data = this.areaData.map(area => this.areaNum2[this.areaData2.indexOf(area)] || 0);

        this.piedata = this.piedata1
      } catch (error) {
        console.error('Failed to fetch worklist:', error);
      }
    },
    chooseInfo(data){
      if(data == '监管体系'){
        this.pieTitle = '单位类型',
        this.piedata = [
          { value: 235, name: '企业单位' },
          { value: 410, name: '政府单位' },
        ]
      }
      if(data == '企业信息'){
        this.pieTitle = '企业类型',
        this.piedata = [
          { value: 235, name: '国有企业' },
          { value: 310, name: '民营企业' },
          { value: 220, name: '事业单位' },
        ]
      }
      if(data == '应急体系'){
        this.pieTitle = '类型',
        this.piedata = [
          { value: 235, name: '政府' },
          { value: 320, name: '企业' },
        ]
      }
      
      if(data == '安全管理人员考核'){
        this.pieTitle = '职称',
        this.piedata = [
          { value: 205, name: '教授' },
          { value: 240, name: '副教授' },
          { value: 302, name: '讲师' },
        ]
      }
      
      if(data == '安全管理先进申报'){
        this.pieTitle = '营收情况',
        this.piedata = [
          { value: 305, name: '上年度' },
          { value: 410, name: '本年度' },
        ]
      }
      
      if(data == '安全生产许可年检'){
        this.pieTitle = '许可证期限',
        this.piedata = [
          { value: 305, name: '正常' },
          { value: 205, name: '即将到期' },
          { value: 100, name: '已过期' },
        ]
      }
      
      if(data == '销售许可年检'){
        this.pieTitle = '注册类型',
        this.piedata = [
          { value: 325, name: '企业用户' },
          { value: 162, name: '科研院所' },
          { value: 182, name: '服务机构' },
          { value: 205, name: '个人游客' },
        ]
      }
      //this.$refs.lines.drawpie();
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