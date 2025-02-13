<template>
  <div class="sysIndex">
    <div class="workbenches">
      <workbench :workbenchList="workbenchList"></workbench>
    </div>

    <div class="sysIndexBottom">
      <toDoList v-if="dataList.length > 0" :dataList="dataList" :readyList="readyList" @childEvent="chooseInfo"></toDoList>
    </div>
    <div class="sysIndexBottom">
      <div :class="['sysIndexBottomLeft', {'hasData': piedata.length > 0}]">
        <pie v-if="piedata.length > 0" :pieTitle="pieTitle" :piedata="piedata" ref="pies"></pie>
      </div>
      <div class="['sysIndexBottomRight', {'hasData': areaData.length > 0}]">
        <lineshow v-if="areaData.length > 0" :lineTitle="lineTitle" :areaData="areaData" :areaNum="areaNum" ref="lines"></lineshow>
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
      dataGroups: Array.from({ length: 8 }, () => []),
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
      pieDataGroups: Array.from({ length: 8 }, () => []),
      lineTitle:'监管/应急企业/企业各地市分布',
      areaDataGroups: Array.from({ length: 8 }, () => []),
      areaNumGroups: Array.from({ length: 8 }, () => []),
      currentIndex: 0
    }
  },
  created() {
    this.getWorklist()
  },
  computed: {
    piedata() {
      return this.pieDataGroups[this.currentIndex];
    },
    areaData() {
      return this.areaDataGroups[this.currentIndex];
    },
    areaNum() {
      return this.areaNumGroups[this.currentIndex];
    }
  },
  methods:{
    async getWorklist() {
      try {
        const res = await getWorkbench();
        res.data.data.forEach(item => {
          if (item.type_ == '1') {
            const index = parseInt(item.type_value[3]) - 1;
            if (index >= 0 && index < 8) {
              this.dataGroups[index].push(item);
            }
          }

          // 将 item.type_ 转换为字符串类型
          const typeStr = String(item.type_);
          if (typeStr.startsWith('2')) {
            const index = parseInt(typeStr[1]) - 1;
            if (index >= 0 && index < 8 && item.type_num > 0) {
              this.pieDataGroups[index].push({ value: item.type_num, name: item.type_value });
            }
          }
          if (typeStr.startsWith('3')) {
            const index = parseInt(typeStr[1]) - 1;
            if (index >= 0 && index < 8) {
              const typearr = item.type_value.split('/');
              if (typearr.length > 0 && typearr[1] && typearr[0] === '河南省') {
                this.areaDataGroups[index].push(typearr[1]);
                this.areaNumGroups[index].push(item.type_num);
              }
            }
          }
        });
        this.dataList = this.dataGroups;
      } catch (error) {
        console.error('Failed to fetch worklist:', error);
      }
    },
    chooseInfo(data) {
      const index = this.readyList.findIndex(item => item.title === data);
      if (index !== -1) {
        this.currentIndex = index;
        switch (index) {
          case 0:
            this.pieTitle = '单位类型';
            break;
          case 1:
            this.pieTitle = '企业类型';
            break;
          case 2:
            this.pieTitle = '类型';
            break;
          case 3:
            this.pieTitle = '职称';
            break;
          case 4:
            this.pieTitle = '单位类型';
            break;
          case 5:
            this.pieTitle = '营收情况';
            break;
          case 6:
            this.pieTitle = '许可证期限';
            break;
          case 7:
            this.pieTitle = '注册类型';
            break;
        }
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
  width: 100%;
}

.sysIndexBottom .sysIndexBottomRight {
  width: 100%;
}

/* 新增样式，当有数据时的样式 */
.sysIndexBottomLeft.hasData {
  width: 100%;
}

.sysIndexBottomRight.hasData {
  background-color: lightblue;
}
</style>
