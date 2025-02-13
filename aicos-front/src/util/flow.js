import { defaultDynaNameData } from "@/util/qsgCommon";
// import {save, publishFlow} from '@/api/system/flow'

/**
 * 简单工作流的数据格式转换
 */
function getId() {
  return `flow-node-${Date.now()}-${Math.random().toString(16).substring(2)}`;
}

const graph = {
  createStartFlowTask() {
    const node = {
      id: getId(),
      label: "开始",
      type: "startFlowTask",
      x: 100,
      y: 100
    };
    return node;
  },
  creatEndTask(data) {
    const endTask = {
      id: getId(),
      label: "结束",
      type: "endTask",
      x: 100,
      y: (data.length + 1) * 80 + 100
    };
    return endTask;
  },
  /**
   * 任务节点
   * @param data {label, type, id, handler}
   * @returns {{nodeSetting: {undoUsers: {applicantLeader: boolean, submitterLeader: boolean, list: *[], applicant: boolean}, hasCustomButton: boolean, handler: {applicantLeader: boolean, submitterLeader: boolean, list: *[], applicant: boolean}, turnUsers: {applicantLeader: boolean, submitterLeader: boolean, list: *[], applicant: boolean}, ifSighFor: boolean, buttons: *[], customButtonList: [{code: string, name: string, label: string},{code: string, name: string, label: string},{code: string, name: string, label: string},{code: string, name: string, label: string},{code: string, name: string, label: string}], urgeUsers: {applicantLeader: boolean, submitterLeader: boolean, list: *[], applicant: boolean}, approvalType: string, sendMessage: boolean, turn: boolean, messageUsers: {applicantLeader: boolean, submitterLeader: boolean, list: *[], applicant: boolean}, fieldSetting: {}, urge: boolean, print: boolean, undo: boolean, exceedSetting: {auto: boolean, warningType: string, exceedType: string, earlyWarning: boolean, exceedTime: number, warningTime: number, setting: boolean}, messageList: *[], reSubmit: boolean, name, ifIce: boolean, ratio: number, remindType: *[]}, label, type: string}}
   */

  crateUserTask(data) {
    const userTask = {
      id: data.id || getId(),
      x: data.x,
      y: data.y,
      label: data.label,
      type: "userTask",
      nodeSetting: {
        name: data.label,
        handler: {
          list: data.handler,
          // includeChildren: false,
          applicant: false,
          applicantLeader: false,
          submitterLeader: false
        },
        approvalType: "orSign",
        ratio: 60,
        print: false,
        turn: false,
        turnUsers: {
          list: [],
          // includeChildren: false,
          applicant: false,
          applicantLeader: false,
          submitterLeader: false
        },
        undo: false,
        undoUsers: {
          list: [],
          // includeChildren: false,
          applicant: false,
          applicantLeader: false,
          submitterLeader: false
        },
        // delay: false,
        // tentativeKnot: false,
        urge: false,
        urgeUsers: {
          list: [],
          // includeChildren: false,
          applicant: false,
          applicantLeader: false,
          submitterLeader: false
        },
        reSubmit: false,
        // close: false,
        buttons: ['pass'],
        sendMessage: data.sendMessage,
        remindType: [],
        messageUsers: {
          list: data.handler,
          applicant: true,
          // includeChildren: false,
          applicantLeader: false,
          submitterLeader: false
        },
        ifSighFor: false,
        ifIce: false,
        hasCustomButton: false,
        customButtonList: [
          { code: "pass", label: "同意", name: "同意" },
          { code: "back", label: "驳回", name: "驳回" },
          { code: "distribute", label: "派发", name: "派发" },
          { code: "tentativeKnot", label: "申请审批", name: "申请审批" },
          { code: "second", label: "二次办理", name: "二次办理" }
        ],
        fieldSetting: {},
        messageList: data.messageList,
        exceedSetting: {
          setting: false,
          exceedTime: 2,
          exceedType: "hour",
          auto: false,
          earlyWarning: false,
          warningTime: 30,
          warningType: "min"
        }
      }
    };
    return userTask;
  },

  createEdges(nodes) {
    const edges = [];
    for(let i = 0; i < nodes.length - 1; i++) {
      const cur = nodes[i];
      const next = nodes[i + 1];
      const edge = {
        id: getId(),
        source: cur.id,
        target: next.id,
        startPoint: {
          x: cur.x + 92,
          y: cur.y + 70
        },
        endPoint: {
          x: next.x + 92,
          y: next.y
        },
        condition: {
          type: 'static',
          staticValue: "${PassStatus=='agree'}"
        }
      }
      edges.push(edge);
    }
    return edges;
  },
  buildGrapData(data) {

    const startTask = this.createStartFlowTask();
    const endTask = this.creatEndTask(data);

    const tasks = data.map((item, index) => {
      const data = {
        ...item,
        x: 100,
        y: (index + 1) * 80 + 100
      }
      return this.crateUserTask(data);
    });
    const nodes = [startTask, ...tasks, endTask];
    const edges = this.createEdges(nodes);
    return {
      nodes,
      edges
    }

  },
}

const transform = {
  allEdges: [],
  toFlowableData(data) {
    const map = {
      startFlowTask: "transformStartFlowTask",
      endTask: "transformEndTask",
      // startTask: 'transformStartTask',
      userTask: "transformUserTask"
      // exclusiveGateway: 'transformExclusiveGateway',
      // subProcess: 'transformSubProcess',
      // visitTask: 'transformVisitTask',
      // pluginTask: 'transformPluginTask'
    };
    const grapData = graph.buildGrapData(data);
    this.allEdges = grapData.edges
    // 收集分支节点所是的表单字段
    // this.gatewayUsedFields = []
    let extNodesList = [];
    const res = grapData.nodes.map(item => {
      const { extNodes, ...other } = this[map[item.type]](item);
      if (extNodes) {
        extNodesList.push(...extNodes);
      }
      return other;
    });
    const edges = this.allEdges.map(item => this.transformTasklinkline(item));
    return {
      bounds: {
        lowerRight: {
          x: 1000,
          y: res.length * 85 + 100
        },
        upperLeft: {
          x: 0,
          y: 0
        }
      },
      childShapes: [...res, ...edges, ...extNodesList],
      stencil: {
        id: "BPMNDiagram"
      },
      stencilset: {
        namespace: "http://b3mn.org/stencilset/bpmn2.0#",
        url: "../editor/stencilsets/bpmn2.0/bpmn2.0.json"
      }
    };
  },

  transformStartFlowTask(node) {

    const res = {
      resourceId: node.id,
      properties: {
        overrideid: "",
        name: node.label,
        documentation: "",
        executionlisteners: "",
        initiator: "",
        formkeydefinition: "",
        formreference: "",
        formproperties: "",
        custom_node_extend_configuration: "{}"
      },
      stencil: {
        id: "StartNoneEvent"
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
    };
    return res;
  },
  transformEndTask(node) {
    const extCfg = {
      type:'endTask',
      messageNotice: false,
    };

    const res = {
      resourceId: node.id,
      properties: {
        overrideid: "",
        name: node.label,
        documentation: "",
        executionlisteners: {
          executionListeners: [
            {
              event: "start",
              implementation:
                "com.huilan.cloud.flow.listener.EndEventCallListener",
              className: "com.huilan.cloud.flow.listener.EndEventCallListener",
              expression: "",
              delegateExpression: "",
              $$hashKey: "uiGrid-000H",
              fields: []
            }
          ]
        },
        initiator: "",
        formkeydefinition: "",
        formreference: "",
        formproperties: "",
        custom_node_extend_configuration: JSON.stringify(extCfg)
      },
      stencil: {
        id: "EndNoneEvent"
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
    };
    return res;
  },
  transformUserTask(node) {
    const nodeSetting = node.nodeSetting;
    const approveTypeMap = {
      orSign: "orJoinSign",
      countersign: "andJoinSign"
    };
    const extCfg = {
      type: "commonUserTask",
      approveType: approveTypeMap[nodeSetting.approvalType],
      approveTypeAuth: this.handleSelectUser(nodeSetting.handler),
      isCanPrint: nodeSetting.print,
      ifTransfer: nodeSetting.turn,
      transferAuth: this.handleSelectUser(nodeSetting.turnUsers),
      ifUrge: nodeSetting.urge,
      urgeAuth: this.handleSelectUser(nodeSetting.urgeUsers),
      ifRevoke: nodeSetting.undo,
      revokeAuth: this.handleSelectUser(nodeSetting.undoUsers),
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
        unit: nodeSetting.exceedSetting.warningType
      },
      fieldAuth: nodeSetting.fieldSetting,
      ifSighFor: nodeSetting.ifSighFor,
      ifIce: nodeSetting.ifIce,
      hasCustomButton: nodeSetting.hasCustomButton
    };

    let customButton = {};
    if (nodeSetting.hasCustomButton) {
      nodeSetting.customButtonList.forEach(item => {
        customButton[item.code] = item.name;
      });
    }
    // 按钮
    extCfg.buttons = nodeSetting.buttons.map(item => {
      const map = {
        pass: { value: "agree", name: "同意" },
        back: { value: "reject", name: "驳回" },
        distribute: { value: "distribute", name: "派发" },
        // reSubmit: {value:'resubmit',name:'重新提交'},
        delay: { value: "delayApply", name: "申请延期" },
        agreeDelay: { value: "agreeDelayApply", name: "同意延期" },
        rejectDelay: { value: "rejectDelayApply", name: "拒绝延期" },
        tentativeKnot: { value: "tempfinish", name: "申请审批" },
        doFinish: { value: "doFinish", name: "办结" },
        second: { value: "second", name: "二次办理" }
      };
      const temp = map[item];
      if (customButton[item]) {
        temp.name = customButton[item];
      }
      return temp;
    });
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
      };
    });

    // 会签的的时候添加比例设置
    if (nodeSetting.approvalType === "countersign") {
      extCfg.andJoinSignPercent = nodeSetting.ratio;
    }

    const res = {
      resourceId: node.id,
      properties: {
        overrideid: "",
        name: node.label,
        documentation: "",
        asynchronousdefinition: false,
        exclusivedefinition: true,
        executionlisteners: {
          executionListeners: [
            {
              event: "start",
              implementation:
                "com.huilan.cloud.flow.listener.UserExecutionBusinessCallListener",
              className:
                "com.huilan.cloud.flow.listener.UserExecutionBusinessCallListener",
              expression: "",
              delegateExpression: "",
              $$hashKey: "uiGrid-003V",
              fields: []
            },
            {
              event: "end",
              implementation:
                "com.huilan.cloud.flow.listener.UserExecutionBusinessEndListener",
              className:
                "com.huilan.cloud.flow.listener.UserExecutionBusinessEndListener",
              expression: "",
              delegateExpression: "",
              $$hashKey: "uiGrid-0041",
              fields: []
            }
          ]
        },
        initiator: "",
        formkeydefinition: "",
        formreference: "",
        formproperties: "",
        tasklisteners: {
          taskListeners: [
            {
              event: "create",
              implementation:
                "com.huilan.cloud.flow.listener.UserTaskBusinessCallListener",
              className:
                "com.huilan.cloud.flow.listener.UserTaskBusinessCallListener",
              expression: "",
              delegateExpression: "",
              $$hashKey: "uiGrid-001J",
              fields: []
            },
            {
              event: "complete",
              implementation:
                "com.huilan.cloud.flow.listener.UserTaskBusinessEndListener",
              className:
                "com.huilan.cloud.flow.listener.UserTaskBusinessEndListener",
              expression: "",
              delegateExpression: "",
              $$hashKey: "uiGrid-001P",
              fields: []
            },
            {
              event: "assignment",
              implementation:
                "com.huilan.cloud.flow.listener.UserTaskBusinessAssignmentListener",
              className:
                "com.huilan.cloud.flow.listener.UserTaskBusinessAssignmentListener",
              expression: "",
              delegateExpression: "",
              $$hashKey: "uiGrid-001V",
              fields: []
            }
          ]
        },
        custom_node_extend_configuration: JSON.stringify(extCfg)
      },
      stencil: {
        id: "UserTask"
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
    };
    // 会签
    if (nodeSetting.approvalType === "countersign") {
      const props = {
        exclusivedefinition: true,
        multiinstance_type: "Parallel",
        multiinstance_collection: "assigneeList",
        multiinstance_variable: "assignee",
        // multiinstance_condition: `\${nrOfCompletedInstances/nrOfInstances >= ${nodeSetting.ratio/100}}`,
        multiinstance_condition: `\${MultiInstanceCompleteTask.accessCondition(execution)}`,
        multiinstance_cardinality: extCfg.approveTypeAuth.candidateUsers.length,
        usertaskassignment: {
          assignment: {
            type: "static",
            assignee: "${assignee}"
            // candidateUsers: extCfg.approveTypeAuth.candidateUsers.map((item,index) => {
            //   return {
            //     ...item,
            //     '$$hashKey': `object:${2000 + index}`
            //   }
            // })
          }
        }
      };
      Object.assign(res.properties, props);
    } else if (nodeSetting.approvalType === "orSign") {
      //  或签
      const users = [
        ...extCfg.approveTypeAuth.candidateUsers,
        ...extCfg.approveTypeAuth.candidateDynamicUsers
      ];
      const props = {
        usertaskassignment: {
          assignment: {
            type: "static",
            candidateUsers: users.map((item, index) => {
              return {
                ...item,
                $$hashKey: `object:${2000 + index}`
              };
            }),
            candidateGroups: extCfg.approveTypeAuth.candidateGroups.map(
              (item, index) => {
                return {
                  ...item,
                  $$hashKey: `object:${3000 + index}`
                };
              }
            )
          }
        }
      };

      Object.assign(res.properties, props);
    }

    res.extNodes = [];
    // 超时
    // const exceedSetting = this.exceedSetting(nodeSetting.exceedSetting)
    // res.extNodes.push(...exceedSetting.nodes)
    // res.outgoing.push(...exceedSetting.timers)
    // 申请延期
    // if(nodeSetting.buttons.includes('delay')) {
    //   let delayNodes = this.handleDelayApply()
    //   res.extNodes.push(...delayNodes)
    //   //  将边界节点的id添加到outgong中
    //   res.outgoing.push({
    //     resourceId: delayNodes[0].resourceId
    //   })
    // }

    return res;
  },
  handleSelectUser(userSetting) {
    const messageNoticeAuth = {
      candidateDynamicUsers: [],
      candidateUsers: [],
      candidateGroups: []
    };
    if (userSetting.applicant) {
      messageNoticeAuth.candidateDynamicUsers.push({
        value: "${huilan_apply}",
        name: defaultDynaNameData.applicant
      });
    }
    if (userSetting.applicantLeader) {
      messageNoticeAuth.candidateDynamicUsers.push({
        value: "${huilan_applyLeader}",
        name: defaultDynaNameData.applicantLeader
      });
    }
    if (userSetting.submitterLeader) {
      messageNoticeAuth.candidateDynamicUsers.push({
        value: "${huilan_submitLeader}",
        name: defaultDynaNameData.submitterLeader
      });
    }
    if (userSetting.submitDirectLeader) {
      messageNoticeAuth.candidateDynamicUsers.push({
        value: "${huilan_submitDirectLeader}",
        name: defaultDynaNameData.submitDirectLeader
      });
    }
    userSetting.list.forEach(item => {
      // console.log('handleSelectUser',item)
      if (item.type === "user") {
        messageNoticeAuth.candidateUsers.push({
          value: item.id,
          name: item.name || ""
        });
      } else {
        messageNoticeAuth.candidateGroups.push({
          value: item.id,
          name: item.name || "",
          type: item.type
        });
      }
    });
    return messageNoticeAuth;
  },
  getNodeOutgoing(node) {
    const edges = this.allEdges.filter(item => item.source === node.id);
    return edges.map(item => {
      return {
        resourceId: item.id
      };
    });
  },
  transformTasklinkline(edge) {
    let condition = "";
    if (edge.condition) {
      condition = {
        expression: {
          type: "static",
          staticValue: edge.condition
        }
      };
    }
    const res = {
      resourceId: edge.id,
      properties: {
        overrideid: "",
        name: "",
        documentation: "",
        conditionsequenceflow: condition,
        executionlisteners: "",
        defaultflow: "false",
        skipexpression: ""
      },
      stencil: {
        id: "SequenceFlow"
      },
      childShapes: [],
      outgoing: [
        {
          resourceId: edge.source
        }
      ],
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
      dockers: [
        {
          x: edge.startPoint.x,
          y: edge.startPoint.y
        },
        {
          x: edge.endPoint.x,
          y: edge.endPoint.y
        }
      ],
      target: {
        resourceId: edge.target
      }
    };
    return res;
  }
};

/**
 * 构建提交给flowable的数据
 *
 * @param data Array 节点数组，节点的格式为:
 * {
 *     id: 1,
 *     type: 'userTask',
 *     // 名称
 *     label: 'ssss',
 *     // 人员设置
 *     handler: [
 *       {id: 'id', type: 'user', name: '系统管理员'},
 *     ],
 *     // 是否有消息通知
 *     sendMessage: false,
 *     // 消息列表
 *     messageList: [
 *       {
 *         "name": "待办",
 *         "type": "todo",
 *         "message": "1610837667063861250",
 *         "email": "1547849249763487746",
 *         "internal": "1593200034917646338",
 *         "smart": "",
 *         "qyWeixin": "1607242647582404609",
 *         "custom": "1636660496797519873"
 *       }
 *     ],
 *   }
 * @param processInfo Object
 * @param processInfo.id string 流程id
 * @param processInfo.modelKey string 流程的code
 * @param processInfo.name sting 流程名称
 * @returns Object
 */
function buildFlowableProcessData(data,processInfo) {
  const flowableData = transform.toFlowableData(data);
  const processExtCfg = {
    formTemplateVersionId: '',
    ifSyncCancelIce: false,
    ifOvertime: false,
    overtime: {
      number: '',
      unit: 'day'
    },
    overtimeNoticeLoopConfig: {
      ifNotice: false,
      ifLoop: false,
      number: '1',
      unit: 'day'
    },
    ifSupervise: false,
    superviseAuth: {
      candidateDynamicUsers: [],
      candidateUsers: [],
      candidateGroups: []
    },
    adminAuth: {
      candidateDynamicUsers: [],
      candidateUsers: [],
      candidateGroups: []
    },
    afterRejectRecommitToStart: 'orderByProcess',
    overtimeNoticeConfig: [
      {
        messageType: '超时提醒',
        messageTypeCode: 'overtime',
        shortMessageTemplate: '',
        mailTemplate: '',
        messageTemplate: '',
        robotTemplate: '',
        customTemplate: ''
      }],
    superviseNoticeConfig: [],
    formVariables: [],
    // 知识审核
    flowWithForm: '3'
  }
  const modelEditorJson = {
    modelId: processInfo.id,
    properties: {
      "process_id": processInfo.modelKey,
      "name": processInfo.name,
      "documentation": "",
      "process_author": "",
      "process_version": "",
      "process_namespace": "http://www.flowable.org/processdef",
      "process_historylevel": "",
      "isexecutable": true,
      "dataproperties": "",
      "executionlisteners": "",
      "eventlisteners": "",
      "signaldefinitions": "",
      "messagedefinitions": "",
      "process_potentialstarteruser": "",
      "process_potentialstartergroup": "",
      "iseagerexecutionfetch": "false",
      "custom_node_extend_configuration": JSON.stringify(processExtCfg)
    },
    ...flowableData
  }
  return modelEditorJson
}

// const data = [
//   {
//     id: 1,
//     type: 'userTask',
//     // 名称
//     label: 'ssss',
//     // 人员设置
//     handler: [
//       {id: 'id', type: 'user', name: '系统管理员'},
//     ],
//     // 是否有消息通知
//     sendMessage: false,
//     // 消息列表
//     messageList: [
//       {
//         "name": "待办",
//         "type": "todo",
//         "message": "1610837667063861250",
//         "email": "1547849249763487746",
//         "internal": "1593200034917646338",
//         "smart": "",
//         "qyWeixin": "1607242647582404609",
//         "custom": "1636660496797519873"
//       }
//     ],
//   }
// ]
//
// const processInfo = {
//   id: 'sss',
//   modelKey: 'faq-knowledgereview',
//   name: 'faq知识审核'
// }
//
// const res = buildFlowableProcessData(data, processInfo)
// console.log('res',res)

// const data = [
//   {
//     "id": "a1692093836837",
//     "label": "痘痘",
//     "handler": [
//       {
//         "id": "asdadasdsadsa",
//         "name": "ASaas",
//         "type": "user"
//       },
//       {
//         "id": "2aicosUser719b",
//         "name": "2aicosUser719b姓名",
//         "type": "user"
//       }
//     ],
//     "sendMessage": true,
//     "messageList": [
//       {
//         "name": "待办",
//         "type": "todo",
//         "disabled": true,
//         "message": "1658021481906860034",
//         "email": "",
//         "internal": "",
//         "qyWeixin": "",
//         "smart": "",
//         "custom": ""
//       }
//     ]
//   }
// ];
// const processInfo = {
//   "id": "1691390262281826306",
//   "modelKey": "faq1692093836012",
//   "name": "FAQ审核流程1692093836012"
// }
// const res = buildFlowableProcessData(data, processInfo)
// debugger
// save({
//   ...processInfo,
//   modelEditorJson: JSON.stringify(res)
// }).then(()=>{
//   const param = {
//     modelKey: processInfo.modelKey,
//     modelId: processInfo.id,
//     category: "",
//   };
//   publishFlow(param).then(() => {
//     this.$message.success("发布成功");
//   })
// })

export {
  buildFlowableProcessData
};
