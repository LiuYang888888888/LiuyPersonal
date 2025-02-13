export default {
  data() {
    return {
      itemList: [
        {
          name: '开始节点',
          type: 'startFlowTask',
          hidden: false,
          icon: "aicos-icon-startFlowTask",
        },
        {
          name: '创建节点',
          type: 'startTask',
          hidden: this.type === 'noForm',
          icon: "aicos-icon-startTask",
        },
        {
          name: '任务节点',
          type: 'userTask',
          hidden: false,
          icon: "aicos-icon-userTask",
        },
        {
          name: '分支节点',
          type: 'exclusiveGateway',
          hidden: false,
          icon: "aicos-icon-exclusiveGateway",
        },
        {
          name: '子流程',
          type: 'subProcess',
          hidden: this.type === 'noForm',
          icon: "aicos-icon-subProcess",
        },
        {
          name: '回访',
          type: 'visitTask',
          hidden: this.type === 'noForm',
          icon: "aicos-icon-visitTask",
        },
        // {
        //     name: '插件',
        //     type: 'pluginTask'
        // },
        {
          name: '结束节点',
          type: 'endTask',
          hidden: false,
          icon: "aicos-icon-endTask",
        }
      ],
      taskNodeConfig: {
        startFlowTask: {
          label: '开始',
          type: 'startFlowTask'
        },
        startTask: {
          label: '创建节点',
          type: 'startTask',
          extAnchors:[
            [0.5, 1, '提交', 'submit']
          ],
          nodeSetting:{
            name: '创建节点',
            print: false,
            close: false,
            // urge: false,
            buttons: ['submit'],
            sendMessage: false,
            // remindType: [],
            messageUsers: {
              list: [],
              applicant: true,
              applicantLeader: false,
              applicantDirectLeader: false,
              submitterLeader: false,
              submitDirectLeader: false
            },
            fieldSetting: {},
            messageList: []
          }
        },
        userTask: {
          label: '任务节点',
          type: 'userTask',
          nodeSetting:{
            name: '任务节点',
            handler: {
              list: [],
              // includeChildren: false,
              applicant: false,
              applicantLeader: false,
              applicantDirectLeader: false,
              submitterLeader: false,
              submitDirectLeader: false
            },
            approvalType: 'orSign',
            ratio:60,
            print: false,
            turn: false,
            turnUsers: {
              list: [],
              // includeChildren: false,
              applicant: false,
              applicantLeader: false,
              applicantDirectLeader: false,
              submitterLeader: false,
              submitDirectLeader: false
            },
            undo: false,
            undoCopyHandler:false,
            undoUsers: {
              list: [],
              nodeApprover: false,
              applicant: false,
              applicantLeader: false,
              applicantDirectLeader: false,
              submitterLeader: false,
              submitDirectLeader: false
            },
            // delay: false,
            // tentativeKnot: false,
            urge: false,
            urgeCopyHandler:false,
            urgeUsers: {
              list: [],
              nodeApprover: false,
              applicant: false,
              applicantLeader: false,
              applicantDirectLeader: false,
              submitterLeader: false,
              submitDirectLeader: false
            },
            reSubmit: false,
            // close: false,
            buttons: [],
            rejectType: 'originNode',
            sendMessage: true,
            remindType: [],
            messageUsers: {
              list: [],
              nodeApprover: true,
              applicant: true,
              applicantLeader: false,
              applicantDirectLeader: false,
              submitterLeader: false,
              submitDirectLeader: false
            },
            ifSighFor: false,
            ifIce: false,
            hasCustomButton: false,
            customButtonList: [
              {code: 'pass', label: '同意', name: '同意'},
              {code: 'back', label: '驳回', name: '驳回'},
              {code: 'distribute', label: '派发', name: '派发'},
              {code: 'tentativeKnot', label: '申请审批', name: '申请审批'},
              {code: 'second', label: '二次办理', name: '二次办理'},
            ],
            fieldSetting: {},
            messageList: [],
            exceedSetting: {
              setting: false,
              exceedTime: 2,
              exceedType: 'hour',
              auto: false,
              earlyWarning: false,
              warningTime: 30,
              warningType: 'min'
            }
          }
        },
        exclusiveGateway: {
          label: '分支节点',
          type: 'exclusiveGateway',
          extAnchors:[
            [0.5, 1, '其它', 'other']
          ],
          nodeSetting: {
            name: '分支节点',
            conditionList: [
              {name: '其他', id: 'other'}
            ]
          }
        },
        // serviceTask: {
        //     label: '服务节点',
        //     type: 'serviceTask'
        // },
        subProcess: {
          label: '子流程',
          type: 'subProcess',
          nodeSetting: {
            name: '子流程',
            subProcessName: '',
            viewSub: false,
            FieldRelationship: []
          }
        },
        // collapsedSubProcess: {
        //     id: 'ss1',
        //     label: '可折叠子流程',
        //     type: 'rect'
        // },
        visitTask: {
          label: '回访',
          type: 'visitTask',
          nodeSetting: {
            name: '回访',
            visitType: 'robot',
            handler: {
              list: [],
              // includeChildren: false,
              applicant: false,
              applicantLeader: false,
              applicantDirectLeader: false,
              submitterLeader: false,
              submitDirectLeader: false
            },
            print: false,
            hasCustomButton: false,
            customButtonList: [
              {code: 'satisfy', label: '满意', name: '满意'},
              {code: 'dissatisfied', label: '不满意', name: '不满意'},
              {code: 'other', label: '其它', name: '其它'},
              {code: 'second', label: '二次办理', name: '二次办理'},
            ],
            plugin: '',
            intention: [],
            fieldSetting: {}
          }
        },
        pluginTask: {
          label: '插件',
          type: 'pluginTask',
          nodeSetting: {
            name: '插件',
            plugin: ''
          }
        },
        endTask: {
          label: '结束',
          type: 'endTask',
          nodeSetting:{
            name: '结束',
            // print: false,
            // delay: false,
            // tentativeKnot: false,
            // reSubmit: false,
            // close: false,
            // buttons: [],
            sendMessage: false,
            // remindType: [],
            messageUsers: {
              list: [],
              applicant: true,
              applicantLeader: false,
              applicantDirectLeader: false,
              submitterLeader: false,
              submitDirectLeader: false
            },
            // fieldSetting: {},
            messageList: [],
            // exceedSetting: {
            //   setting: false,
            //   exceedTime: 2,
            //   exceedType: 'hour',
            //   auto: false,
            //   earlyWarning: false,
            //   warningTime: 30,
            //   warningType: 'min'
            // }
          }
        }
      }
    }
  },
  methods: {
    dragItem(event) {
      const type = event.target.type
      event.dataTransfer.setData('type', type)
    },
    dropToolbarItem(event) {
      const type = event.dataTransfer.getData('type')
      const point = this.graph.getPointByClient(event.pageX, event.pageY)

      const conf = {
        ...this.taskNodeConfig[type],
        x: point.x,
        y: point.y
      }
      if(type === 'userTask' && this.type === 'noForm') {
        conf.nodeSetting.buttons = ['pass'];
        conf.extAnchors = [
          [0.5, 1, "同意", "pass"]
        ];
      }

      let nodeType = 'node'
      // if(['subProcess', 'collapsedSubProcess'].includes(type)) {
      //     nodeType = 'combo'
      // }
      this.graph.addItem(nodeType, conf);
    }
  }
}
