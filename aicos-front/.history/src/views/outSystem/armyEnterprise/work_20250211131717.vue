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
        <pie v-if="piedata.length > 0" :pieTitle="pieTitle" :piedata="piedata"></pie>
      </div>
      <div class="sysIndexBottomRight">
        <lineshow v-if="areaNum.length > 0" :lineTitle="lineTitle" :areaData="areaData" :areaNum="areaNum"></lineshow>
      </div>
    </div>
  </div>
</template>

<script>
import workbench from '@/components/workCommon/workbench.vue';
import toDo from '@/components/workCommon/toDo.vue';
import pie from '@/components/workCommon/pie.vue';
import lineshow from '@/components/workCommon/lineshow.vue';
import { getWorklist } from "@/api/armyEnterPrise/common";
import { mapGetters } from 'vuex';

export default {
  components: {
    workbench,
    toDo,
    pie,
    lineshow,
  },
  data() {
    return {
      workbenchList: [
        {
          icon: require('@/assets/outSystem/icon1.png'),
          title: '新增',
          path: '/outSystem/armyEnterprise/index',
          type: 'add'
        },
        {
          icon: require('@/assets/outSystem/icon2.png'),
          title: '导出全部',
          path: '/outSystem/armyEnterprise/index',
          type: 'export'
        },
        {
          icon: require('@/assets/outSystem/icon3.png'),
          title: '导入',
          path: '/outSystem/armyEnterprise/index',
          type: 'upload'
        },
        {
          icon: require('@/assets/outSystem/icon4.png'),
          title: '下载模板',
          path: '/outSystem/armyEnterprise/index',
          type: 'download'
        },
      ],
      dataList: [],
      piedata: [],
      areaData: [],
      areaNum: [],
    }
  },
  computed: {
    ...mapGetters(['$t'])
  },
  created() {
    this.getWorklist();
  },
  methods: {
    async getWorklist() {
      try {
        const res = await getWorklist();
        if (res.data.code !== 200) {
          throw new Error('API request failed with status code ' + res.status);
        }

        res.data.data.forEach(item => {
          if (item.type_ === '1') {
            this.dataList.push(item);
          }
          if (item.type_ === '2' && item.type_num > 0) {
            let pieobj = {
              value: item.type_num,
              name: item.type_value,
            };
            this.piedata.push(pieobj);
          }
          if (item.type_ === '3') {
            let typearr = item.type_value.split('/');
            if (typearr.length > 0 && typearr[1]) {
              this.areaData.push(typearr[1]);
              this.areaNum.push(item.type_num);
            }
          }
        });
      } catch (error) {
        console.error('Failed to fetch worklist:', error.message);
      }
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