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
      data1:[],
      data2:[],
      data3:[],
      data4:[],
      data5:[],
      data6:[],
      data7:[],
      data8:[],
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
      piedata1:[],
      piedata2:[],
      piedata3:[],
      piedata4:[],
      piedata5:[],
      piedata6:[],
      piedata7:[],
      piedata8:[],
      lineTitle:'监管/应急企业/企业各地市分布',
      areaData:[],
      areaData1:[],
      areaData2:[],
      areaData3:[],
      areaData4:[],
      areaData5:[],
      areaData6:[],
      areaData7:[],
      areaData8:[],
      areaNum:[],
      areaNum1:[],
      areaNum2:[],
      areaNum3:[],
      areaNum4:[],
      areaNum5:[],
      areaNum6:[],
      areaNum7:[],
      areaNum8:[],
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
            if(['num71', 'num72', 'num73'].includes(item.type_value)){
              this.data7.push(item);
            }
            if(['num81', 'num82', 'num83'].includes(item.type_value)){
              this.data8.push(item);
            }
            this.dataList = [[...this.data1],[...this.data2],[...this.data3],[...this.data4],[...this.data5],[...this.data6],[...this.data7],[...this.data8]]
          }

          if (item.type_ == '21' && item.type_num > 0) {
            this.piedata1.push({ value: item.type_num, name: item.type_value });
          }
          if (item.type_ == '22' && item.type_num > 0) {
            this.piedata2.push({ value: item.type_num, name: item.type_value });
          }
          if (item.type_ == '23' && item.type_num > 0) {
            this.piedata3.push({ value: item.type_num, name: item.type_value });
          }
          if (item.type_ == '24' && item.type_num > 0) {
            this.piedata4.push({ value: item.type_num, name: item.type_value });
          }
          if (item.type_ == '25' && item.type_num > 0) {
            this.piedata5.push({ value: item.type_num, name: item.type_value });
          }
          if (item.type_ == '26' && item.type_num > 0) {
            this.piedata6.push({ value: item.type_num, name: item.type_value });
          }
          if (item.type_ == '27' && item.type_num > 0) {
            this.piedata7.push({ value: item.type_num, name: item.type_value });
          }
          if (item.type_ == '28' && item.type_num > 0) {
            this.piedata8.push({ value: item.type_num, name: item.type_value });
          }

          if (item.type_ == '31') {
            let typearr = item.type_value.split('/');
            if (typearr.length > 0 && typearr[1] && typearr[0] == '河南省') {
              this.areaData1.push(typearr[1]);
              this.areaNum1.push(item.type_num);
            }
          }

          if (item.type_ == '32') {
            let typearr = item.type_value.split('/');
            if (typearr.length > 0 && typearr[1] && typearr[0] == '河南省') {
              this.areaData2.push(typearr[1]);
              this.areaNum2.push(item.type_num);
            }
          }

          if (item.type_ == '33') {
            let typearr = item.type_value.split('/');
            if (typearr.length > 0 && typearr[1] && typearr[0] == '河南省') {
              this.areaData3.push(typearr[1]);
              this.areaNum3.push(item.type_num);
            }
          }

          if (item.type_ == '34') {
            let typearr = item.type_value.split('/');
            if (typearr.length > 0 && typearr[1] && typearr[0] == '河南省') {
              this.areaData4.push(typearr[1]);
              this.areaNum4.push(item.type_num);
            }
          }

          if (item.type_ == '35') {
            let typearr = item.type_value.split('/');
            if (typearr.length > 0 && typearr[1] && typearr[0] == '河南省') {
              this.areaData5.push(typearr[1]);
              this.areaNum5.push(item.type_num);
            }
          }

          if (item.type_ == '36') {
            let typearr = item.type_value.split('/');
            if (typearr.length > 0 && typearr[1] && typearr[0] == '河南省') {
              this.areaData6.push(typearr[1]);
              this.areaNum6.push(item.type_num);
            }
          }

          if (item.type_ == '37') {
            let typearr = item.type_value.split('/');
            if (typearr.length > 0 && typearr[1] && typearr[0] == '河南省') {
              this.areaData7.push(typearr[1]);
              this.areaNum7.push(item.type_num);
            }
          }

          if (item.type_ == '38') {
            let typearr = item.type_value.split('/');
            if (typearr.length > 0 && typearr[1] && typearr[0] == '河南省') {
              this.areaData8.push(typearr[1]);
              this.areaNum8.push(item.type_num);
            }
          }
        });
      
        this.piedata = this.piedata1
        this.areaData = this.areaData1
        this.piedata = this.piedata1
      } catch (error) {
        console.error('Failed to fetch worklist:', error);
      }
    },
    chooseInfo(data){
      if(data == '监管体系'){
        this.pieTitle = '单位类型',
        this.piedata = this.piedata1
      }
      if(data == '企业信息'){
        this.pieTitle = '企业类型',
        this.piedata = this.piedata2
      }
      if(data == '应急体系'){
        this.pieTitle = '类型',
        this.piedata = this.piedata3
      }
      
      if(data == '安全管理人员考核'){
        this.pieTitle = '职称',
        this.piedata = this.piedata4
      }
      if(data == '文件收发管理'){
        this.pieTitle = '单位类型',
        this.piedata = this.piedata5
      }
      
      if(data == '安全管理先进申报'){
        this.pieTitle = '营收情况',
        this.piedata = this.piedata6
      }
      
      if(data == '安全生产许可年检'){
        this.pieTitle = '许可证期限',
        this.piedata = this.piedata7
      }
      
      if(data == '销售许可年检'){
        this.pieTitle = '注册类型',
        this.piedata = this.piedata8
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