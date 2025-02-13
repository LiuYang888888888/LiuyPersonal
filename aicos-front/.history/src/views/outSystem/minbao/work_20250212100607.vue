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
import { getWorkbench } from "@/api/outSystem/mbCompany";

const PROVINCE = '河南省';
const TYPE_MAP = {
  '监管体系': { title: '单位类型', index: 0 },
  '企业信息': { title: '企业类型', index: 1 },
  '应急体系': { title: '类型', index: 2 },
  '安全管理人员考核': { title: '职称', index: 3 },
  '文件收发管理': { title: '单位类型', index: 4 },
  '安全管理先进申报': { title: '营收情况', index: 5 },
  '安全生产许可年检': { title: '许可证期限', index: 6 },
  '销售许可年检': { title: '注册类型', index: 7 }
};

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
      readyList: Object.keys(TYPE_MAP).map(title => ({ title })),
      pieTitle: '单位类型',
      piedata: [],
      lineTitle: '监管/应急企业/企业各地市分布',
      areaData: [],
      areaNum: [],
      allData: Array(8).fill([]),
      allPiedata: Array(8).fill([]),
      allAreaData: Array(8).fill([]),
      allAreaNum: Array(8).fill([])
    }
  },
  created() {
    this.getWorklist()
  },
  methods: {
    async getWorklist() {
      try {
        const res = await getWorkbench();
        if (!res || !res.data || !Array.isArray(res.data.data)) {
          console.error('Invalid response data');
          return;
        }

        res.data.data.forEach(item => {
          if (item.type_ == "1") {
            const typeValueMap = {
              'num11': 0, 'num12': 0, 'num13': 0,
              'num21': 1, 'num22': 1, 'num23': 1,
              'num31': 2, 'num32': 2, 'num33': 2,
              'num41': 3, 'num42': 3, 'num43': 3,
              'num51': 4, 'num52': 4, 'num53': 4,
              'num61': 5, 'num62': 5, 'num63': 5,
              'num71': 6, 'num72': 6, 'num73': 6,
              'num81': 7, 'num82': 7, 'num83': 7
            };
            const index = typeValueMap[item.type_value];
            if (index !== undefined) {
              
              this.allData[index].push(item);
            }
          }

          if (this.isStringAndStartsWith(item.type_, '2')) {
            const index = parseInt(item.type_.slice(-1)) - 1;
            if (item.type_num > 0) {
              this.allPiedata[index].push({ value: item.type_num, name: item.type_value });
            }
          }

          if (this.isStringAndStartsWith(item.type_, '3')) {
            const index = parseInt(item.type_.slice(-1)) - 1;
            let typearr = item.type_value.split('/');
            if (typearr.length > 1 && typearr[0] === PROVINCE) {
              this.allAreaData[index].push(typearr[1]);
              this.allAreaNum[index].push(item.type_num);
            }
          }
        });
        this.updateCurrentData(0);
      } catch (error) {
        console.error('Failed to fetch worklist:', error);
      }
    },
    isStringAndStartsWith(value, prefix) {
      return typeof value === 'string' && value.startsWith(prefix);
    },
    chooseInfo(data) {
      const config = TYPE_MAP[data];
      if (config) {
        this.pieTitle = config.title;
        this.updateCurrentData(config.index);
      }
    },
    updateCurrentData(index) {
      this.dataList = this.allData[index];
      this.piedata = this.allPiedata[index];
      this.areaData = this.allAreaData[index];
      this.areaNum = this.allAreaNum[index];
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