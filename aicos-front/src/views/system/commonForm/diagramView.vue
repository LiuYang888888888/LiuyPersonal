<template>
    <HuilanFlowDesinger
      ref="desinger"
      mode="view"
      :flowData="desingerData"
      style="border: none"
    />
</template>

<script>
import { getDiagramData } from '@/api/mywork/worklist'
import HuilanFlowDesinger from '@/views/system/flow/desinger'
export default {
  name: 'DiagramView',
  components: {
    HuilanFlowDesinger
  },
  props: {
    cur: {
      type: Object,
      default() {
        return {}
      }
    }
  },
  data() {
    return {
      desingerData: {}
    }
  },
  watch: {
    cur:{
      handler() {
        this.getDiagramView()
      },
      immediate: true
    }
  },
  methods: {
    getDiagramView() {
      const params = {
        processInstanceId: this.cur.processInstanceId,
        processDefinitionId: this.cur.processDefinitionId
      }
      // this.viewSrc = diagramView(params)
      getDiagramData(params).then(({data: {data}})=> {
        //  highLightedActivities highLightedSequenceFlow
        this.buildViewData(data)
      })
    },
    buildViewData(data) {
      const flow = JSON.parse(data.HuilanBaseProcessTemplateVersion)

      flow.desingerData.nodes.forEach(node => {
        if(data.highLightedActivities.includes(node.id)) {
          node.color='#ff0000'
          if(!['startFlowTask', 'endTask'].includes(node.type)) {
            // 更新的时候边框颜色不对
            node.style.stroke = '#ff0000'
            node.preRect = {
              fill: '#ff0000'
            }
          }
        }
      })
      flow.desingerData.edges.forEach(node => {
        if(data.highLightedSequenceFlow.includes(node.id)) {
          node.color='#ff0000'
        }
      })
      // console.log(JSON.stringify(flow.desingerData))
      this.desingerData = flow.desingerData
    }
  }
}
</script>

<style scoped>

</style>
