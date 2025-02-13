
import StartTaskProp from "../components/startTaskProp";
import UserTaskProp from "../components/userTaskProp";
import ExclusiveGatewayProp from "../components/exclusiveGatewayProp";
import SubProcessProp from "../components/subProcessProp";
import VisitTaskProp from "../components/visitTaskProp";
import PluginTaskProp from "../components/pluginTaskProp";
import EndTaskProp from "../components/endTaskProp";
export default {
  components: {
    StartTaskProp,
    UserTaskProp,
    ExclusiveGatewayProp,
    SubProcessProp,
    VisitTaskProp,
    PluginTaskProp,
    EndTaskProp
  },
  data() {
    return {
      nodeKey: '',
      currentShape: '',
      curNode: null,
      curNodeSetting: {}
    }
  },
  computed: {
    curNodePropCmp() {
      const map = {
        startTask: 'StartTaskProp',
        userTask: 'UserTaskProp',
        exclusiveGateway: 'ExclusiveGatewayProp',
        subProcess: 'SubProcessProp',
        visitTask: 'VisitTaskProp',
        pluginTask: 'PluginTaskProp',
        endTask: 'EndTaskProp'
      }
      return map[this.currentShape]
    }
  },
  methods: {
    nodeSetting(node) {
      const currentShape = node.get('currentShape')
      const model = node.getModel()
      this.currentShape = currentShape;
      this.curNode = node
      this.nodeKey = model.id
      // 兼容老数据，主要是节点属性修改时，自当添加新属性默认值
      const settings = {
        ...this.taskNodeConfig[currentShape].nodeSetting,
        ...model.nodeSetting
      }
      this.curNodeSetting = this.deepClone(settings)
      // this.graph.on('nodesetting')
    },
    handlePropsClose(data) {
      if(data) {
        this.updateNode(data)
      }
      this.drawer = false
    },
    updateNode(data) {
      const model = this.curNode.getModel()
      const currentShape = this.curNode.get('currentShape')
      const map = {
        startTask: 'getStartTaskExtAnchors',
        userTask: 'getUserTaskExtAnchors',
        exclusiveGateway: 'getExclusiveGatewayExtAnchors',
        visitTask: 'getVisitTaskExtAnchors',
      }
      let cfg = {}
      let flag = false
      if(model.label !== data.name) {
        cfg.label = data.name
        flag = true
      }

      const method = map[currentShape]
      let needUpdateEdge = false
      if(method) {
        Object.assign(cfg, this[method](data))
        flag = true
        needUpdateEdge = true
      }
      // if(needUpdateEdge) {
      //   this.curNode.getOutEdges().forEach(item => {
      //     item.refresh();
      //   })
      // }
      if(flag) {
        this.curNode.update(cfg)
      }
      if(needUpdateEdge) {
        this.curNode.getOutEdges().forEach(item => {
          // 删除替换锚点的线
          if(item.needRemove) {
            this.graph.removeItem(item)
          }else {
            // 获取节点数据时，节点数据还未更新
            setTimeout(()=> {
              const edgeModel = item.getModel()
              const condition = this.getEdgeCondition(item.get('sourceNode'), edgeModel.sourceAnchor)
              edgeModel.condition = condition
            }, 10)
            item.refresh();
          }
        })
      }
      // 更新节点model,保存的时候使用
      model.nodeSetting = data
    },
    computedAnchor(arr) {
      const text = arr.map(item => item[0]).join('')
      const needWidth = text.length * 18 + 40 ;
      let size
      let width = 300
      if(needWidth > width) {
        size = [needWidth , 120]
      }
      if(size) {
        width = size[0]
      }
      let str = (width - needWidth)/ 2
      return {
        size,
        extAnchors: arr.map(([item, id]) => {
          const cur = (str + item.length * 8 + 20 ) / (width + 20)
          str += (item.length / text.length) * needWidth
          return [ cur , 1, item, id]
        })
      }
    },
    getStartTaskExtAnchors(data) {
      const map = {
        submit: '提交',
        distribute: '派发'
      }
      const buttons = data.buttons
      const textArr = buttons.map(item => [map[item], item])

      return this.computedAnchor(textArr)
    },
    getUserTaskExtAnchors(data) {
      const customerBtn = {};
      if(data.customButtonList) {
        data.customButtonList.forEach(item=>{
          customerBtn[item.code] = item.name
        })
      }
      const map = {
        pass: '同意',
        back: '驳回',
        distribute: '派发',
        reSubmit: '重新提交',
        delay: '申请延期',
        agreeDelay: '同意延期',
        rejectDelay: '拒绝延期',
        tentativeKnot: '暂办结',
        doFinish: '办结',
        second: '二次办理',
        ...customerBtn
      }
      const buttons = data.buttons
      const textArr = buttons.map(item => [map[item], item])

      return this.computedAnchor(textArr)
    },
    getExclusiveGatewayExtAnchors(data) {
      const textArr = data.conditionList.map(item => [item.name, item.id])
      return this.computedAnchor(textArr)
    },
    getVisitTaskExtAnchors(data) {
      const customerBtn = {};
      if(data.customButtonList) {
        data.customButtonList.forEach(item=>{
          customerBtn[item.code] = item.name
        })
      }
      const map = {
        satisfy: '满意',
        dissatisfied: '不满意',
        other: '其它',
        second: '二次办理',
        ...customerBtn
      }
      const buttons = data.intention
      const textArr = buttons.map(item => [map[item], item])

      return this.computedAnchor(textArr)
      // let str = (1 - (0.18 * (data.intention.length -1) ) )/2
      // return {
      //   extAnchors: data.intention.map((item, index) => {
      //     return [ str + 0.18 * index, 1, map[item], item]
      //   })
      // }
    }
  }
}
