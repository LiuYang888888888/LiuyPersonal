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