<template>
  <div class="sysIndex">
    <div class="workbenches">
      <workbench :workbenchList="workbenchList"></workbench>
    </div>

    <div class="sysIndexBottom">
      <toDoList v-if="dataList.length > 0" :dataList="dataList" :readyList="readyList" @childEvent="chooseInfo">
      </toDoList>
    </div>
    <div class="sysIndexBottom">
      <div class="sysIndexBottomLeft">
        <pie v-if="piedata.length > 0" :pieTitle="pieTitle" :piedata="piedata" ref="pies"></pie>
      </div>
      <div class="sysIndexBottomRight">
        <lineshow v-if="areaData.length > 0" :lineTitle="lineTitle" :areaData="areaData" :areaNum="areaNum" ref="lines">
        </lineshow>
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
  data () {
    return {
      workbenchList: [
        // ... (保持不变)
      ],
      dataList: [],
      readyList: Object.keys(TYPE_MAP).map(title => ({ title })),
      pieTitle: '单位类型',
      piedata: [],
      lineTitle: '监管/应急企业/企业各地市分布',
      areaData: [],
      areaNum: [],
      allData: null,
      allPiedata: null,
      allAreaData: null,
      allAreaNum: null
    }
  },
  created () {
    this.initializeData();
    this.getWorklist();
  },
  methods: {
    async getWorklist () {
      try {
        const res = await getWorkbench();
        if (!res || !res.data || !Array.isArray(res.data.data)) {
          console.error('Invalid response data');
          return;
        }

        res.data.data.forEach(item => {
          if (item.type_ === '1') {
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
              const uniqueItems = new Set(this.allData[index].map(JSON.stringify));
              uniqueItems.add(JSON.stringify(item));
              this.allData[index] = Array.from(uniqueItems).map(JSON.parse);
            }
          }

          if (this.isStringAndStartsWith(item.type_, '2')) {
            const index = parseInt(item.type_.slice(-1)) - 1;
            if (item.type_num > 0) {
              const uniqueItems = new Set(this.allPiedata[index].map(JSON.stringify));
              uniqueItems.add(JSON.stringify({ value: item.type_num, name: item.type_value }));
              this.allPiedata[index] = Array.from(uniqueItems).map(JSON.parse);
            }
          }

          if (this.isStringAndStartsWith(item.type_, '3')) {
            const index = parseInt(item.type_.slice(-1)) - 1;
            let typearr = item.type_value.split('/');
            if (typearr.length > 1 && typearr[0] === PROVINCE) {
              const uniqueItems = new Set(this.allAreaData[index].map(JSON.stringify));
              uniqueItems.add(JSON.stringify(typearr[1]));
              this.allAreaData[index] = Array.from(uniqueItems).map(JSON.parse);

              const uniqueNums = new Set(this.allAreaNum[index].map(String));
              uniqueNums.add(String(item.type_num));
              this.allAreaNum[index] = Array.from(uniqueNums).map(Number);
            }
          }
        });

        this.updateCurrentData(0);
      } catch (error) {
        console.error('Failed to fetch worklist:', error);
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
</style>