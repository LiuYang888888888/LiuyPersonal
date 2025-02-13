/**
 * 将G6生成的图形数据转换为flowable所需要的数据格式
 */

import { randomLenNum,deepClone } from '@/util/util'

import { defaultDynaNameData } from "@/util/qsgCommon.js"

export default {
  methods: {
    toFlowableData(data) {
      const map = {
        startFlowTask: 'transformStartFlowTask',
        endTask: 'transformEndTask',
        startTask: 'transformStartTask',
        userTask: 'transformUserTask',
        exclusiveGateway: 'transformExclusiveGateway',
        subProcess: 'transformSubProcess',
        visitTask: 'transformVisitTask',
        pluginTask: 'transformPluginTask'
      }
      this.allEdges = data.edges
      // 收集分支节点所是的表单字段
      this.gatewayUsedFields = []
      let extNodesList = []
      const res = data.nodes.map(item => {
        const { extNodes, ...other } = this[map[item.type]](item)
        if (extNodes) {
          extNodesList.push(...extNodes)
        }
        return other
      })
      const edges = data.edges.map(item => this.transformTasklinkline(item))
      return {
        bounds: {
          lowerRight: {
            x: this.graph.getWidth(),
            y: this.graph.getHeight()
          },
          upperLeft: {
            x: 0,
            y: 0
          }
        },
        childShapes: [
          ...res,
          ...edges,
          ...extNodesList
        ],
        stencil: {
          id: 'BPMNDiagram'
        },
        stencilset: {
          namespace: 'http://b3mn.org/stencilset/bpmn2.0#',
          url: '../editor/stencilsets/bpmn2.0/bpmn2.0.json'
        }
      }
    },
    getNodeOutgoing(node) {
      const edges = this.allEdges.filter(item => item.source === node.id)
      return edges.map(item => {
        return {
          resourceId: item.id
        }
      })
    },
    handleSelectUser(userSetting) {
      const messageNoticeAuth = {
        candidateDynamicUsers: [],
        candidateUsers: [],
        candidateGroups: []
      }
      if (userSetting.nodeApprover) {
        messageNoticeAuth.candidateDynamicUsers.push({ value: '${huilan_nodeApprover}', name: defaultDynaNameData.nodeApprover })
      }
      if (userSetting.applicant) {
        messageNoticeAuth.candidateDynamicUsers.push({ value: '${huilan_apply}', name: defaultDynaNameData.applicant })
      }
      if (userSetting.applicantLeader) {
        messageNoticeAuth.candidateDynamicUsers.push({ value: '${huilan_applyLeader}', name: defaultDynaNameData.applicantLeader })
      }
      if (userSetting.applicantDirectLeader) {
        messageNoticeAuth.candidateDynamicUsers.push({ value: '${huilan_applyDirectLeader}', name: defaultDynaNameData.applicantDirectLeader })
      }
      if (userSetting.submitterLeader) {
        messageNoticeAuth.candidateDynamicUsers.push({ value: '${huilan_submitLeader}', name: defaultDynaNameData.submitterLeader })
      }
      if (userSetting.submitDirectLeader) {
        messageNoticeAuth.candidateDynamicUsers.push({ value: '${huilan_submitDirectLeader}', name: defaultDynaNameData.submitDirectLeader })
      }
      userSetting.list.forEach(item => {
        // console.log('handleSelectUser',item)
        if (item.type === 'user') {
          messageNoticeAuth.candidateUsers.push({ value: item.id, name: item.name || '' })
        } else {
          messageNoticeAuth.candidateGroups.push({ value: item.id, name: item.name || '', type: item.type })
        }
      })
      return messageNoticeAuth
    },
    transformStartFlowTask(node) {
      const res = {
        resourceId: node.id,
        properties: {
          overrideid: '',
          name: node.label,
          documentation: '',
          executionlisteners: '',
          initiator: '',
          formkeydefinition: '',
          formreference: '',
          formproperties: '',
          custom_node_extend_configuration: '{}'
        },
        stencil: {
          id: 'StartNoneEvent'
        },
        childShapes: [],
        outgoing: this.getNodeOutgoing(node),
        bounds: {
          lowerRight: {
            x: node.x + 30,
            y: node.y + 30
          },
          upperLeft: {
            x: node.x,
            y: node.y
          }
        },
        dockers: []
      }
      return res
    },
    transformEndTask(node) {
      const nodeSetting = node.nodeSetting || {
        sendMessage: false,
        messageList: [],
        messageUsers: {
          list: [],
          applicant: true,
          applicantLeader: false,
          submitterLeader: false
        }
      };
      const extCfg = {
        type: 'endTask',
        messageNotice: nodeSetting.sendMessage,
      };

      // 消息列表
      extCfg.messageNoticeConfig = nodeSetting.messageList.map(item => {
        return {
          messageType: item.name,
          messageTypeCode: item.type,
          shortMessageTemplate: item.message,
          mailTemplate: item.email,
          messageTemplate: item.internal,
          robotTemplate: item.smart,
          qyWeixinTemplate: item.qyWeixin,
          customTemplate: item.custom
        }
      })
      // 消息人员
      extCfg.messageNoticeAuth = this.handleSelectUser(nodeSetting.messageUsers)

      const res = {
        resourceId: node.id,
        properties: {
          overrideid: '',
          name: node.label,
          documentation: '',
          executionlisteners: {
            executionListeners: [{
              event: 'start',
              implementation: 'com.huilan.cloud.flow.listener.EndEventCallListener',
              className: 'com.huilan.cloud.flow.listener.EndEventCallListener',
              expression: '',
              delegateExpression: '',
              '$$hashKey': 'uiGrid-000H',
              fields: []
            }]
          },
          initiator: '',
          formkeydefinition: '',
          formreference: '',
          formproperties: '',
          custom_node_extend_configuration: JSON.stringify(extCfg)
        },
        stencil: {
          id: 'EndNoneEvent'
        },
        childShapes: [],
        outgoing: [],
        bounds: {
          lowerRight: {
            x: node.x + 30,
            y: node.y + 30
          },
          upperLeft: {
            x: node.x,
            y: node.y
          }
        },
        dockers: []
      }
      return res
    },
    transformStartTask(node) {
      const nodeSetting = node.nodeSetting
      const extCfg = {
        type: 'startUserTask',
        isCanPrint: nodeSetting.print,
        ifActive: nodeSetting.specify,
        // buttons:[],
        messageNotice: nodeSetting.sendMessage,
        // messageNoticeConfig: [
        //   {
        //     messageType:'驳回',
        //     shortMessageTemplate:'1',
        //     mailTemplate:'1',
        //     messageTemplate:'1',
        //     robotTemplate:'1'
        //   }
        // ],
        messageNoticeAuth: {
          candidateUsers: [],
          candidateDynamicUsers: [],
          candidateGroups: []
        },
        fieldAuth: nodeSetting.fieldSetting
      }
      // 按钮
      extCfg.buttons = nodeSetting.buttons.map(item => {
        const map = {
          submit: { value: 'submit', name: '提交' },
          distribute: { value: 'distribute', name: '派发' }
          // specify: {value:'active',name:'指定审批'}
        }
        return map[item]
      })
      // 消息列表
      extCfg.messageNoticeConfig = nodeSetting.messageList.map(item => {
        return {
          messageType: item.name,
          messageTypeCode: item.type,
          shortMessageTemplate: item.message,
          mailTemplate: item.email,
          messageTemplate: item.internal,
          robotTemplate: item.smart,
          qyWeixinTemplate: item.qyWeixin,
          customTemplate: item.custom
        }
      })
      // 消息人员
      extCfg.messageNoticeAuth = this.handleSelectUser(nodeSetting.messageUsers)

      const res = {
        resourceId: node.id,
        properties: {
          overrideid: '',
          name: node.label,
          documentation: '',
          executionlisteners: '',
          initiator: '',
          formkeydefinition: '',
          formreference: '',
          formproperties: '',
          usertaskassignment: {
            assignment: {
              type: 'static',
              initiatorCanCompleteTask: true,
              candidateUsers: [{
                value: '${huilan_INITIATOR}',
                '$$hashKey': 'object:43012'
              }]
            }
          },
          tasklisteners: {
            taskListeners: [{
              event: 'create',
              implementation: 'com.huilan.cloud.flow.listener.UserTaskBusinessCallListener',
              className: 'com.huilan.cloud.flow.listener.UserTaskBusinessCallListener',
              expression: '',
              delegateExpression: '',
              '$$hashKey': 'uiGrid-001J',
              fields: []
            }, {
              event: 'complete',
              implementation: 'com.huilan.cloud.flow.listener.UserTaskBusinessEndListener',
              className: 'com.huilan.cloud.flow.listener.UserTaskBusinessEndListener',
              expression: '',
              delegateExpression: '',
              $$hashKey: 'uiGrid-001P',
              fields: []
            }]
          },
          custom_node_extend_configuration: JSON.stringify(extCfg)
        },
        stencil: {
          id: 'UserTask'
        },
        childShapes: [],
        outgoing: this.getNodeOutgoing(node),
        bounds: {
          lowerRight: {
            x: node.x + 185,
            y: node.y + 70
          },
          upperLeft: {
            x: node.x,
            y: node.y
          }
        },
        dockers: []
      }
      return res
    },
    transformUserTask(node) {
      const nodeSetting = node.nodeSetting
      const approveTypeMap = {
        orSign: 'orJoinSign',
        countersign: 'andJoinSign'
      }
      let urgeUsers = deepClone(nodeSetting.urgeUsers),undoUsers = deepClone(nodeSetting.undoUsers);
      if (nodeSetting.urgeCopyHandler) {
        nodeSetting.handler.list.forEach(item => {
          let index = urgeUsers.list.findIndex(urgeItem => urgeItem.id === item.id);
          if (index === -1) {
            urgeUsers.list.push(item);
          }
        })
      }
      if(nodeSetting.undoCopyHandler) {
        nodeSetting.handler.list.forEach(item => {
          let index = undoUsers.list.findIndex(undoItem => undoItem.id === item.id);
          if (index === -1) {
            undoUsers.list.push(item);
          }
        })
      }
      const extCfg = {
        type: 'commonUserTask',
        approveType: approveTypeMap[nodeSetting.approvalType],
        approveTypeAuth: this.handleSelectUser(nodeSetting.handler),
        isCanPrint: nodeSetting.print,
        ifTransfer: nodeSetting.turn,
        transferAuth: this.handleSelectUser(nodeSetting.turnUsers),
        ifUrge: nodeSetting.urge,
        urgeAuth: this.handleSelectUser(urgeUsers),
        ifRevoke: nodeSetting.undo,
        revokeAuth: this.handleSelectUser(undoUsers),
        ifActive: nodeSetting.specify,
        ifClose: nodeSetting.close,
        ifResubmit: nodeSetting.reSubmit,
        // buttons:[],
        messageNotice: nodeSetting.sendMessage,
        // messageNoticeConfig: [
        //   {
        //     messageType:'驳回',
        //     shortMessageTemplate:'1',
        //     mailTemplate:'1',
        //     messageTemplate:'1',
        //     robotTemplate:'1'
        //   }
        // ],
        messageNoticeAuth: this.handleSelectUser(nodeSetting.messageUsers),
        expiredNotice: nodeSetting.exceedSetting.setting,
        expiredNoticeConfig: {
          number: nodeSetting.exceedSetting.exceedTime,
          unit: nodeSetting.exceedSetting.exceedType,
          autoCommit: nodeSetting.exceedSetting.auto
        },
        expiredWarning: nodeSetting.exceedSetting.earlyWarning,
        expiredWarningConfig: {
          number: nodeSetting.exceedSetting.warningTime,
          unit: nodeSetting.exceedSetting.warningType,
        },
        fieldAuth: nodeSetting.fieldSetting,
        ifSighFor: nodeSetting.ifSighFor,
        ifIce: nodeSetting.ifIce,
        hasCustomButton: nodeSetting.hasCustomButton,
        rejectType: nodeSetting.rejectType
      }

      let customButton = {}
      if (nodeSetting.hasCustomButton) {
        nodeSetting.customButtonList.forEach(item => {
          customButton[item.code] = item.name
        })
      }
      // 按钮
      extCfg.buttons = nodeSetting.buttons.map(item => {
        const map = {
          pass: { value: 'agree', name: '同意' },
          back: { value: 'reject', name: '驳回' },
          distribute: { value: 'distribute', name: '派发' },
          // reSubmit: {value:'resubmit',name:'重新提交'},
          delay: { value: 'delayApply', name: '申请延期' },
          agreeDelay: { value: 'agreeDelayApply', name: '同意延期' },
          rejectDelay: { value: 'rejectDelayApply', name: '拒绝延期' },
          tentativeKnot: { value: 'tempfinish', name: '申请审批' },
          doFinish: { value: 'doFinish', name: '办结' },
          second: { value: 'second', name: '二次办理' }
        }
        const temp = map[item];
        if (customButton[item]) {
          temp.name = customButton[item]
        }
        return temp
      })
      // 消息列表
      extCfg.messageNoticeConfig = nodeSetting.messageList.map(item => {
        return {
          messageType: item.name,
          messageTypeCode: item.type,
          shortMessageTemplate: item.message,
          mailTemplate: item.email,
          messageTemplate: item.internal,
          robotTemplate: item.smart,
          qyWeixinTemplate: item.qyWeixin,
          customTemplate: item.custom
        }
      })

      // 会签的的时候添加比例设置
      if (nodeSetting.approvalType === 'countersign') {
        extCfg.andJoinSignPercent = nodeSetting.ratio;
      }

      const res = {
        resourceId: node.id,
        properties: {
          overrideid: '',
          name: node.label,
          documentation: '',
          asynchronousdefinition: false,
          exclusivedefinition: true,
          executionlisteners:
          {
            executionListeners: [
              {
                "event": "start",
                "implementation": "com.huilan.cloud.flow.listener.UserExecutionBusinessCallListener",
                "className": "com.huilan.cloud.flow.listener.UserExecutionBusinessCallListener",
                "expression": "",
                "delegateExpression": "",
                "$$hashKey": "uiGrid-003V",
                "fields": []
              },
              {
                "event": "end",
                "implementation": "com.huilan.cloud.flow.listener.UserExecutionBusinessEndListener",
                "className": "com.huilan.cloud.flow.listener.UserExecutionBusinessEndListener",
                "expression": "",
                "delegateExpression": "",
                "$$hashKey": "uiGrid-0041",
                "fields": []
              }]
          },
          initiator: '',
          formkeydefinition: '',
          formreference: '',
          formproperties: '',
          tasklisteners: {
            taskListeners: [{
              event: 'create',
              implementation: 'com.huilan.cloud.flow.listener.UserTaskBusinessCallListener',
              className: 'com.huilan.cloud.flow.listener.UserTaskBusinessCallListener',
              expression: '',
              delegateExpression: '',
              '$$hashKey': 'uiGrid-001J',
              fields: []
            }, {
              event: 'complete',
              implementation: 'com.huilan.cloud.flow.listener.UserTaskBusinessEndListener',
              className: 'com.huilan.cloud.flow.listener.UserTaskBusinessEndListener',
              expression: '',
              delegateExpression: '',
              $$hashKey: 'uiGrid-001P',
              fields: []
            }, {
              "event": "assignment",
              "implementation": "com.huilan.cloud.flow.listener.UserTaskBusinessAssignmentListener",
              "className": "com.huilan.cloud.flow.listener.UserTaskBusinessAssignmentListener",
              "expression": "",
              "delegateExpression": "",
              "$$hashKey": "uiGrid-001V",
              "fields": []
            }]
          },
          custom_node_extend_configuration: JSON.stringify(extCfg)
        },
        stencil: {
          id: 'UserTask'
        },
        childShapes: [],
        outgoing: this.getNodeOutgoing(node),
        bounds: {
          lowerRight: {
            x: node.x + 185,
            y: node.y + 70
          },
          upperLeft: {
            x: node.x,
            y: node.y
          }
        },
        dockers: []
      }
      // 会签
      if (nodeSetting.approvalType === 'countersign') {
        const props = {
          exclusivedefinition: true,
          multiinstance_type: 'Parallel',
          multiinstance_collection: 'assigneeList',
          multiinstance_variable: 'assignee',
          // multiinstance_condition: `\${nrOfCompletedInstances/nrOfInstances >= ${nodeSetting.ratio/100}}`,
          multiinstance_condition: `\${MultiInstanceCompleteTask.accessCondition(execution)}`,
          multiinstance_cardinality: extCfg.approveTypeAuth.candidateUsers.length,
          usertaskassignment: {
            assignment: {
              type: 'static',
              assignee: '${assignee}'
              // candidateUsers: extCfg.approveTypeAuth.candidateUsers.map((item,index) => {
              //   return {
              //     ...item,
              //     '$$hashKey': `object:${2000 + index}`
              //   }
              // })
            }
          }
        }
        Object.assign(res.properties, props)
      } else if (nodeSetting.approvalType === 'orSign') {
        //  或签
        const users = [...extCfg.approveTypeAuth.candidateUsers, ...extCfg.approveTypeAuth.candidateDynamicUsers]
        const props = {
          usertaskassignment: {
            assignment: {
              type: 'static',
              candidateUsers: users.map((item, index) => {
                return {
                  ...item,
                  '$$hashKey': `object:${2000 + index}`
                }
              }),
              candidateGroups: extCfg.approveTypeAuth.candidateGroups.map((item, index) => {
                return {
                  ...item,
                  '$$hashKey': `object:${3000 + index}`
                }
              })
            }
          }
        }

        Object.assign(res.properties, props)
      }

      res.extNodes = []
      // 超时
      const exceedSetting = this.exceedSetting(nodeSetting.exceedSetting)
      res.extNodes.push(...exceedSetting.nodes)
      res.outgoing.push(...exceedSetting.timers)
      // 申请延期
      if (nodeSetting.buttons.includes('delay')) {
        let delayNodes = this.handleDelayApply()
        res.extNodes.push(...delayNodes)
        //  将边界节点的id添加到outgong中
        res.outgoing.push({
          resourceId: delayNodes[0].resourceId
        })
      }

      return res
    },
    createBoundaryTimerEvent(cfg) {
      let exp = ''
      switch (cfg.type) {
        case 'day':
          exp = `P0Y0M${cfg.time}DT0H0M0S`
          break
        case 'hour':
          exp = `P0Y0M0DT${cfg.time}H0M0S`
          break
        case 'min':
          exp = `P0Y0M0DT0H${cfg.time}M0S`
          break
        case 'sec':
          exp = `P0Y0M0DT0H0M${cfg.time}S`
          break
      }
      const res = {
        resourceId: cfg.id,
        properties: {
          overrideid: '',
          name: cfg.name,
          documentation: '',
          timercycledefinition: '',
          timerdatedefinition: '',
          timerdurationdefinition: exp,
          timerenddatedefinition: '',
          cancelactivity: false
        },
        stencil: {
          id: 'BoundaryTimerEvent'
        },
        childShapes: [],
        outgoing: [{
          resourceId: cfg.outgoingId
        }],
        bounds: {
          lowerRight: {
            x: 174.81229504500587,
            y: 646.9449453560713
          },
          upperLeft: {
            x: 143.81229504500587,
            y: 615.9449453560713
          }
        },
        dockers: [{
          x: 18,
          y: 21
        }]
      }
      return res
    },
    createSequenceFlow(cfg) {
      const res = {
        resourceId: cfg.id,
        properties: {
          overrideid: '',
          name: '',
          documentation: '',
          conditionsequenceflow: '',
          executionlisteners: '',
          defaultflow: 'false',
          skipexpression: ''
        },
        stencil: {
          id: 'SequenceFlow'
        },
        childShapes: [],
        outgoing: [{
          resourceId: cfg.outgoingId
        }],
        bounds: {
          lowerRight: {
            x: 145.89778982407267,
            y: 674.8024125087215
          },
          upperLeft: {
            x: 84.15518784691089,
            y: 639.8270924872076
          }
        },
        dockers: [{
          x: 16,
          y: 16
        }, {
          x: 48.5,
          y: 20
        }],
        target: {
          resourceId: cfg.outgoingId
        }
      }
      return res
    },
    createServiceTask(cfg) {
      const res = {
        resourceId: cfg.id,
        properties: {
          overrideid: '',
          name: cfg.name,
          documentation: '',
          asynchronousdefinition: 'false',
          exclusivedefinition: 'false',
          servicetasktriggerable: 'false',
          executionlisteners: '',
          multiinstance_type: 'None',
          multiinstance_cardinality: '',
          multiinstance_collection: '',
          multiinstance_variable: '',
          multiinstance_condition: '',
          isforcompensation: 'false',
          servicetaskclass: cfg.servicetaskclass,
          servicetaskexpression: '',
          servicetaskdelegateexpression: '',
          servicetaskfields: '',
          servicetaskuselocalscopeforresultvariable: 'false',
          skipexpression: '',
          custom_node_extend_configuration: ''
        },
        stencil: {
          id: 'ServiceTask'
        },
        childShapes: [],
        outgoing: [],
        bounds: {
          lowerRight: {
            x: 97,
            y: 715
          },
          upperLeft: {
            x: 0,
            y: 675
          }
        },
        dockers: []
      }
      return res
    },
    handleDelayApply() {
      const eventId = `boundaryTimerEvent-${randomLenNum(6)}`
      const lineId = `sequenceFlow-${randomLenNum(6)}`
      const serviceTaskId = `serviceTask-${randomLenNum(6)}`

      const BoundaryTimerEvent = this.createBoundaryTimerEvent({
        id: eventId,
        name: 'com.huilan.cloud.flow.listener.PublicAccessNoticeListener',
        type: 'sec',
        time: 10,
        outgoingId: lineId
      })
      const SequenceFlow = this.createSequenceFlow({
        id: lineId,
        outgoingId: serviceTaskId
      })

      const ServiceTask = this.createServiceTask({
        id: serviceTaskId,
        name: 'PublicAccessNoticeListener',
        servicetaskclass: 'com.huilan.cloud.flow.listener.PublicAccessNoticeListener'
      })

      const res = [BoundaryTimerEvent, SequenceFlow, ServiceTask]
      return res
    },
    getWaringTime(data) {
      const { exceedType, exceedTime, warningType, warningTime } = data
      const map = {
        day: 24 * 60,
        hour: 60,
        min: 1
      }
      const excTime = exceedTime * map[exceedType]
      const warTime = warningTime * map[warningType]

      return {
        time: excTime - warTime,
        type: 'min'
      }
    },
    exceedSetting(data) {
      const res = []
      const timers = []
      if (data.setting) {
        const eventId = `boundaryTimerEvent-${randomLenNum(6)}`
        const lineId = `sequenceFlow-${randomLenNum(6)}`
        const serviceTaskId = `serviceTask-${randomLenNum(6)}`

        const BoundaryTimerEvent = this.createBoundaryTimerEvent({
          id: eventId,
          name: 'com.huilan.cloud.flow.listener.ExpiredNoticeMessageListener',
          type: data.exceedType,
          time: data.exceedTime,
          outgoingId: lineId
        })
        const SequenceFlow = this.createSequenceFlow({
          id: lineId,
          outgoingId: serviceTaskId
        })

        const ServiceTask = this.createServiceTask({
          id: serviceTaskId,
          name: 'ExpiredNoticeMessageListener',
          servicetaskclass: 'com.huilan.cloud.flow.listener.ExpiredNoticeMessageListener'
        })
        res.push(BoundaryTimerEvent, SequenceFlow, ServiceTask)
        timers.push({ resourceId: eventId })
      }


      if (data.earlyWarning) {
        const warningEventId = `warningboundaryTimerEvent-${randomLenNum(6)}`
        const warningLineId = `warningsequenceFlow-${randomLenNum(6)}`
        const warningServiceTaskId = `warningserviceTask-${randomLenNum(6)}`
        const time = this.getWaringTime(data)
        const WarningBoundaryTimerEvent = this.createBoundaryTimerEvent({
          id: warningEventId,
          name: 'com.huilan.cloud.flow.listener.ExpiredWarningMessageListener',
          type: time.type,
          time: time.time,
          outgoingId: warningLineId
        })
        const WarningSequenceFlow = this.createSequenceFlow({
          id: warningLineId,
          outgoingId: warningServiceTaskId
        })
        const WarningServiceTask = this.createServiceTask({
          id: warningServiceTaskId,
          name: 'ExpiredWarningMessageListener',
          servicetaskclass: 'com.huilan.cloud.flow.listener.ExpiredWarningMessageListener'
        })
        res.push(WarningBoundaryTimerEvent, WarningSequenceFlow, WarningServiceTask)
        timers.push({ resourceId: warningEventId })
      }
      return {
        nodes: res,
        timers
      }
    },
    handleGatewayFields(node) {
      const { nodeSetting: { conditionList } } = node
      conditionList.forEach(item => {
        // if(!this.gatewayUsedFields.includes(item.field)) {
        //   this.gatewayUsedFields.push(item.field)
        // }
        if (item.id === 'other') {
          return
        }
        const list = [item, ...item.andCondationList, ...item.orCondationList]
        list.forEach(con => {
          if (!this.gatewayUsedFields.includes(con.field)) {
            this.gatewayUsedFields.push(con.field)
          }
        })
      })
    },
    transformExclusiveGateway(node) {
      this.handleGatewayFields(node)
      const res = {
        resourceId: node.id,
        properties: {
          overrideid: '',
          name: node.label,
          documentation: '',
          executionlisteners: '',
          initiator: '',
          formkeydefinition: '',
          formreference: '',
          formproperties: '',
          custom_node_extend_configuration: ''
        },
        stencil: {
          id: 'ExclusiveGateway'
        },
        childShapes: [],
        outgoing: this.getNodeOutgoing(node),
        bounds: {
          lowerRight: {
            x: node.x + 185,
            y: node.y + 70
          },
          upperLeft: {
            x: node.x,
            y: node.y
          }
        },
        dockers: []
      }
      return res
    },
    transformSubProcess(node) {
      const nodeSetting = node.nodeSetting
      const extCfg = {
        mainProcessLookSubProcessHistory: nodeSetting.viewSub,
        formTemplateVersionId: nodeSetting.subProcessFormId,
        dataInputFields: []
      }
      nodeSetting.FieldRelationship.forEach(item => {
        const temp = {
          fromField: item.mainField,
          toField: item.subField
        }
        extCfg.dataInputFields.push(temp)
      })
      const res = {
        resourceId: node.id,
        properties: {
          overrideid: '',
          name: node.label,
          documentation: '',
          exclusivedefinition: true,
          executionlisteners: {
            executionListeners: [{
              event: 'start',
              className: 'com.huilan.cloud.flow.listener.CallActivityStartListener'
            }, {
              event: 'end',
              className: 'com.huilan.cloud.flow.listener.CallActivityEndListener'
            }]
          },
          callactivitycalledelement: node.nodeSetting.subProcessKey,
          callactivityinheritvariables: true,
          callactivityinheritbusinesskey: true,
          initiator: '',
          formkeydefinition: '',
          formreference: '',
          formproperties: '',
          custom_node_extend_configuration: JSON.stringify(extCfg)
        },
        stencil: {
          id: 'CallActivity'
        },
        childShapes: [],
        outgoing: this.getNodeOutgoing(node),
        bounds: {
          lowerRight: {
            x: node.x + 185,
            y: node.y + 70
          },
          upperLeft: {
            x: node.x,
            y: node.y
          }
        },
        dockers: []
      }
      return res
    },
    transformVisitTask(node) {
      const nodeSetting = node.nodeSetting
      const extCfg = {
        type: 'revisitUserTask',
        revisitType: nodeSetting.visitType === 'robot' ? 'robot' : 'manul',
        isCanPrint: nodeSetting.print,
        pluginName: nodeSetting.plugin,
        // buttons:[],
        fieldAuth: nodeSetting.fieldSetting,
        revisitAuth: this.handleSelectUser(nodeSetting.handler)
      }
      let customButton = {}
      if (nodeSetting.hasCustomButton) {
        nodeSetting.customButtonList.forEach(item => {
          customButton[item.code] = item.name
        })
      }
      const map = {
        satisfy: {
          name: '满意',
          value: 'satisfy'
        },
        dissatisfied: {
          name: '不满意',
          value: 'unsatisfy'
        },
        other: {
          name: '其它',
          value: 'other'
        },
        second: {
          name: '二次办理',
          value: 'second'
        }
      }
      extCfg.buttons = nodeSetting.intention.map(item => {
        const temp = map[item];
        if (customButton[item]) {
          temp.name = customButton[item]
        }
        return temp
      })
      const res = {
        resourceId: node.id,
        properties: {
          overrideid: '',
          name: node.label,
          documentation: '',
          executionlisteners: '',
          initiator: '',
          formkeydefinition: '',
          formreference: '',
          formproperties: '',
          tasklisteners: {
            taskListeners: [{
              event: 'create',
              implementation: 'com.huilan.cloud.flow.listener.UserTaskBusinessCallListener',
              className: 'com.huilan.cloud.flow.listener.UserTaskBusinessCallListener',
              expression: '',
              delegateExpression: '',
              '$$hashKey': 'uiGrid-001J',
              fields: []
            }, {
              event: 'complete',
              implementation: 'com.huilan.cloud.flow.listener.UserTaskBusinessEndListener',
              className: 'com.huilan.cloud.flow.listener.UserTaskBusinessEndListener',
              expression: '',
              delegateExpression: '',
              $$hashKey: 'uiGrid-001P',
              fields: []
            }]
          },
          custom_node_extend_configuration: JSON.stringify(extCfg)
        },
        stencil: {
          id: 'UserTask'
        },
        childShapes: [],
        outgoing: this.getNodeOutgoing(node),
        bounds: {
          lowerRight: {
            x: node.x + 185,
            y: node.y + 70
          },
          upperLeft: {
            x: node.x,
            y: node.y
          }
        },
        dockers: []
      }

      if (nodeSetting.visitType === 'manual') {
        const handCfg = this.handleSelectUser(nodeSetting.handler)
        const users = [...handCfg.candidateUsers, ...handCfg.candidateDynamicUsers]
        const props = {
          usertaskassignment: {
            assignment: {
              type: 'static',
              candidateUsers: users.map((item, index) => {
                return {
                  ...item,
                  '$$hashKey': `object:${4000 + index}`
                }
              }),
              candidateGroups: handCfg.candidateGroups.map((item, index) => {
                return {
                  ...item,
                  '$$hashKey': `object:${5000 + index}`
                }
              })
            }
          }
        }

        Object.assign(res.properties, props)
      } else if (nodeSetting.visitType === 'robot') {
        // res.extNodes.push(...this.handleRobotVisit())
      }
      return res
    },
    transformPluginTask(node) {
      const nodeSetting = node.nodeSetting
      const extCfg = {
        type: 'pluginServiceTask',
        pluginName: nodeSetting.plugin
      }

      const res = {
        resourceId: node.id,
        properties: {
          overrideid: '',
          name: node.label,
          documentation: '',
          asynchronousdefinition: 'false',
          exclusivedefinition: 'false',
          servicetasktriggerable: 'false',
          executionlisteners: '',
          multiinstance_type: 'None',
          multiinstance_cardinality: '',
          multiinstance_collection: '',
          multiinstance_variable: '',
          multiinstance_condition: '',
          isforcompensation: 'false',
          servicetaskclass: nodeSetting.plugin,
          servicetaskexpression: '',
          servicetaskdelegateexpression: '',
          servicetaskfields: '',
          servicetaskuselocalscopeforresultvariable: 'false',
          skipexpression: '',
          custom_node_extend_configuration: JSON.stringify(extCfg)
        },
        stencil: {
          id: 'ServiceTask'
        },
        childShapes: [],
        outgoing: this.getNodeOutgoing(node),
        bounds: {
          lowerRight: {
            x: node.x + 185,
            y: node.y + 70
          },
          upperLeft: {
            x: node.x,
            y: node.y
          }
        },
        dockers: []
      }
      return res
    },
    transformTasklinkline(edge) {
      let condition = ''
      if (edge.condition) {
        condition = {
          expression: {
            type: 'static',
            staticValue: edge.condition
          }
        }
      }
      const res = {
        resourceId: edge.id,
        properties: {
          overrideid: '',
          name: '',
          documentation: '',
          conditionsequenceflow: condition,
          executionlisteners: '',
          defaultflow: 'false',
          skipexpression: ''
        },
        stencil: {
          id: 'SequenceFlow'
        },
        childShapes: [],
        outgoing: [{
          resourceId: edge.source
        }],
        bounds: {
          lowerRight: {
            x: Math.max(edge.endPoint.x, edge.startPoint.x),
            y: Math.max(edge.endPoint.y, edge.startPoint.y)
          },
          upperLeft: {
            x: Math.min(edge.endPoint.x, edge.startPoint.x),
            y: Math.min(edge.endPoint.y, edge.startPoint.y)
          }
        },
        dockers: [{
          x: edge.startPoint.x,
          y: edge.startPoint.y
        }, {
          x: edge.endPoint.x,
          y: edge.endPoint.y
        }],
        target: {
          resourceId: edge.target
        }
      }
      return res
    }
  }
}
