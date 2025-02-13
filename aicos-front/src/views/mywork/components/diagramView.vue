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
      const highLightedActivities = data.highLightedActivities;

      const lastNodeid= highLightedActivities[highLightedActivities.length-1];
      // 判断前面是否还含有相同id的节点,解决流程回退时，节点颜色不对的问题
      const index = highLightedActivities.indexOf(lastNodeid);
      let deletedNodes = [];
      if(index !== highLightedActivities.length-1) {
        // 有相同id的节点
        deletedNodes = highLightedActivities.splice(index + 1, highLightedActivities.length - index - 1)
        deletedNodes.pop()
      }

      flow.desingerData.nodes.forEach(node => {
        if(highLightedActivities.includes(node.id)) {
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
        if(data.highLightedSequenceFlow.includes(node.id) && !deletedNodes.includes(node.target) && !deletedNodes.includes(node.source)) {
          node.color='#ff0000'
          // style 中的 stroke 为边框颜色，优先级比color 高
          if(node.style && node.style.stroke) {
            node.style.stroke = '#ff0000'
          }
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
