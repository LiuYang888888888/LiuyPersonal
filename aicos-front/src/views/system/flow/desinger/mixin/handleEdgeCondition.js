/**
 * 处理连线的条件
 */
const conditionMap = {
  startTask: {
    submit: '${PassStatus==\'submit\'}',
    distribute: '${PassStatus==\'distribute\'}',
  },
  userTask: {
    pass: '${PassStatus==\'agree\'}',
    back: '${PassStatus==\'reject\'}',
    distribute: '${PassStatus==\'distribute\'}',
    // reSubmit: '${PassStatus==\'agree\'}',
    delay: '${PassStatus==\'delayApply\'}',
    agreeDelay: '${PassStatus==\'agreeDelayApply\'}',
    rejectDelay: '${PassStatus==\'rejectDelayApply\'}',
    tentativeKnot: '${PassStatus==\'tempfinish\'}',
    doFinish: '${PassStatus==\'doFinish\'}',
    second: '${PassStatus==\'second\'}',
  },
  visitTask: {
    satisfy: '${PassStatus==\'satisfy\'}',
    dissatisfied: '${PassStatus==\'unsatisfy\'}',
    other: '${PassStatus==\'other\'}',
    second: '${PassStatus==\'second\'}',
  }
}
export default {
  methods: {
    getEdgeCondition(node, AnchorIdx) {
      const model = node.get('model')
      const currentShape = node.get('currentShape')
      // 创建节点特殊处理，因为创建节点只有一个节点
      // if(currentShape == 'startTask') {
      //   return conditionMap[currentShape].submit
      // }
      const extAnchors = model.extAnchors
      if(!extAnchors) {
        return
      }
      const anchorLen = node.getAnchorPoints().length
      const startIdx = anchorLen - extAnchors.length
      const cfgIdx = AnchorIdx - startIdx
      const curAnchor = extAnchors[cfgIdx]

      if(cfgIdx < 0) {
        return
      }
      let condition = ''
      if(conditionMap[currentShape]) {
        condition = conditionMap[currentShape][curAnchor[3]]
      }
      if(currentShape === 'exclusiveGateway') {
        condition = this.buildExclusiveGatewayCondition(model.nodeSetting, cfgIdx)
      }
      return condition
    },
    buildExclusiveGatewayCondition(nodeSetting, index) {
      const conditionList = nodeSetting.conditionList
      const curItem = conditionList[index]

      let str = ''
      if(curItem.id === 'other') {
        let temp = []
        conditionList.forEach(item => {
          if(item.id !== 'other') {
            temp.push(`(${this.buildConditonItem(item)})`)
          }
        })
        str = temp.join('||')
        if(str) {
          str = `!(${str})`
        }
      }else {
        str = this.buildConditonItem(curItem)
      }
      if(str) {
        str = `\${${str}}`
      }
      return str
    },
    buildConditonItem(item) {
      let str = this.buildCondition(item)
      const and = item.andCondationList.map(con => this.buildCondition(con)).join('&&')
      const or = item.orCondationList.map(con => this.buildCondition(con)).join('||')
      if(and) {
        str += '&&' + and
      }
      if(or) {
        str += '||' + or
      }
      return str
    },
    buildCondition(item) {
      const map = {
        eq: '==',
        uneq: '!=',
        gt: '>',
        gteq: '>=',
        lt: '<',
        lteq: '<='
      }
      let str = `${item.field}${map[item.operator]}`
      if(item.field.startsWith('integer_') || item.field.startsWith('float_')) {
        str += item.value
      }else {
        str += `'${item.value}'`
      }
      return str
    }
  }
}
