/**
 * 应用市场中的数据
 */

import Mock from 'mockjs'

const data = Mock.mock({
  'data|11':[{
    id: '@id',
    // name: '@ctitle(4, 20)',
    'name|+1': [
      '呼叫中心',
      '会议系统',
      '广播系统',
      '监控系统',
      '日程管理',
      '工单系统',
      '在线服务',
      '知识图谱',
      '知识库',
      '质检系统',
      '调度中心',
    ],
    'desktopIcon|1': [
      'iconfont iconicon_work',
      "iconfont icon-cuowu",
      "iconfont icon-wxbgongju",
      "iconfont icon-tuichu",
      "iconfont icon-daohanglanmoshi02",
      "iconfont icon-changyonglogo27",
      "iconfont icon-biaoge",
      "iconfont icon-baidu1",
      "iconfont icon-tubiao",
      "iconfont icon-souhu",
      "iconfont icon-msnui-360",
      "iconfont icon-iframe",
      "iconfont icon-huanyingye",
      "menu-icon-img help-center",
      "menu-icon-img app-market",
      "menu-icon-img authorization-center",
      "menu-icon-img desplay-setting",
      "menu-icon-img flow-design",
      "menu-icon-img form-design",
      "menu-icon-img knowledge-graph",
      "menu-icon-img log-mgr",
      "menu-icon-img message-center",
      "menu-icon-img resource-center",
      "menu-icon-img system-setting",
      "menu-icon-img user-center",
      "menu-icon-img user-mgr",
    ],
    'authorized|1-3': true,
    'isNew|1-5': false,
    'isHot|1-4': true,
    downLoadUrl: '@url',
    // description:'@csentence(25, 50)',
    'description|+1':[
      '通过预拨号功能，自动识别出空号、错号、忙音和关机等状况，将有效的电话号码转接至坐席人员',
      '开会过程中，将发言人录音转成文字，并形成会议纪要',
      '通信和广播相融合的新概念多媒体移动广播服务',
      '支持从智能手机/ 平板电脑等移动终端查看视频画面，支持将监控画面调入视频会议，实现应急指挥、远程调度。',
      '将每天的工作和事务安排在日期中，并做一个有效的记录，能够管理日常的工作和事务，支持对员工日常工作进行指导、监督',
      '提供系统化、标准化的工作处理流程。用于企业间和企业内部的工作协作',
      '对系统用户提供信息、通信、服务和专项组',
      '将关系数据的知识库构建成知识结构网络',
      '对问答库、技能库、多轮对护额、渠道个性化答案设置等多种知识库加工和设计',
      '对工单、话术、服务等进行实时或离线的质量检测',
      '对系统内各项资源、数据进行统一调度',
    ],
    content:'@cparagraph',
    'screenshots|10': ['@dataImage(\'360x240\')']
  }]
})
console.log(data)

export default data.data
// [
//   {
//     key: 'app1',
//     name: '呼叫中心',
//     icon: 'iconfont iconicon_work',
//     authorized: true,
//     isNew: false,
//     isHot: true,
//     downLoadUrl: '',
//     description: '呼叫中心系统是一个功能强大的用于构建呼叫中心系统的产品解决方案，系统支持大容量的电话呼入/呼出处理、电话转接、来电弹屏、智能IVR、智能ACD、通话记录、呼叫坐席管理、工单管理、数据报表和绩效统计等专业呼叫中心系统功能。支持部署版、云SaaS版呼叫中心，通话稳定、音质清晰，多级IVR语音、VIP专线等功能优势，领略一呼百应的呼叫体验。'
//   },
//   {
//     key: 'app2',
//     name: '会议系统',
//     icon: 'iconfont iconicon_work',
//     description: '呼叫中心系统是一个功能强大的用于构建呼叫中心系统的产品解决方案，系统支持大容量的电话呼入/呼出处理、电话转接、来电弹屏、智能IVR、智能ACD、通话记录、呼叫坐席管理、工单管理、数据报表和绩效统计等专业呼叫中心系统功能。支持部署版、云SaaS版呼叫中心，通话稳定、音质清晰，多级IVR语音、VIP专线等功能优势，领略一呼百应的呼叫体验。'
//   },
//   {
//     key: 'app3',
//     name: '广播系统',
//     icon: 'iconfont iconicon_work',
//     description: '呼叫中心系统是一个功能强大的用于构建呼叫中心系统的产品解决方案，系统支持大容量的电话呼入/呼出处理、电话转接、来电弹屏、智能IVR、智能ACD、通话记录、呼叫坐席管理、工单管理、数据报表和绩效统计等专业呼叫中心系统功能。支持部署版、云SaaS版呼叫中心，通话稳定、音质清晰，多级IVR语音、VIP专线等功能优势，领略一呼百应的呼叫体验。'
//   },
//   {
//     key: 'app4',
//     name: '监控系统',
//     icon: 'iconfont iconicon_work',
//     description: '呼叫中心系统是一个功能强大的用于构建呼叫中心系统的产品解决方案，系统支持大容量的电话呼入/呼出处理、电话转接、来电弹屏、智能IVR、智能ACD、通话记录、呼叫坐席管理、工单管理、数据报表和绩效统计等专业呼叫中心系统功能。支持部署版、云SaaS版呼叫中心，通话稳定、音质清晰，多级IVR语音、VIP专线等功能优势，领略一呼百应的呼叫体验。'
//   },
//   {
//     key: 'app5',
//     name: '日程管理',
//     icon: 'iconfont iconicon_work',
//     description: '呼叫中心系统是一个功能强大的用于构建呼叫中心系统的产品解决方案，系统支持大容量的电话呼入/呼出处理、电话转接、来电弹屏、智能IVR、智能ACD、通话记录、呼叫坐席管理、工单管理、数据报表和绩效统计等专业呼叫中心系统功能。支持部署版、云SaaS版呼叫中心，通话稳定、音质清晰，多级IVR语音、VIP专线等功能优势，领略一呼百应的呼叫体验。'
//   },
//   {
//     key: 'app6',
//     name: '工单系统',
//     icon: 'iconfont iconicon_work',
//     description: '呼叫中心系统是一个功能强大的用于构建呼叫中心系统的产品解决方案，系统支持大容量的电话呼入/呼出处理、电话转接、来电弹屏、智能IVR、智能ACD、通话记录、呼叫坐席管理、工单管理、数据报表和绩效统计等专业呼叫中心系统功能。支持部署版、云SaaS版呼叫中心，通话稳定、音质清晰，多级IVR语音、VIP专线等功能优势，领略一呼百应的呼叫体验。'
//   }
// ]
