<template>
  <el-tabs v-model="activeName">
    <el-tab-pane label="详情" name="first">
      <FormInfo
        :data="data"
        :getInfo="getInfo"
        class="flow-view"
        :handleComplete="handleComplete"
      />
    </el-tab-pane>
    <el-tab-pane label="流转历史" name="second" lazy>
      <CirculationHistory
        :processInstanceId="data.processInstanceId"
      />
    </el-tab-pane>
    <el-tab-pane label="流程图" name="third" lazy>
      <DiagramView
        v-if="activeName === 'third'"
        :cur="data"
        class="flow-view"
      />
    </el-tab-pane>
  </el-tabs>
</template>

<script>
import FormInfo from './formInfo'
import CirculationHistory from './circulationHistory'
import DiagramView from './diagramView'
export default {
  name: 'workInfo',
  components: {
    CirculationHistory,
    DiagramView,
    FormInfo
  },
  props: {
    data: {
      type: Object,
      default() {
        return {}
      }
    },
    // 获取当前数据的信息
    getInfo: {
      type: Function,
      default() {
        return () => {}
      }
    },
    handleComplete: {
      type: Function,
      default() {
        return () => {}
      }
    }
  },
  data() {
    return {
      activeName: 'first'
    }
  }
}
</script>

<style lang="scss" scoped>
.flow-view {
  height: calc(100vh - 175px);
}
</style>
