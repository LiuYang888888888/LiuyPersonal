//机器人训练相关代码
import request from '@/router/axios';
import serviceList from '@/config/serviceList';
import {
  baseURL,
} from '@/api/common';

const {
  kwRobot,
  knowledge,
  system
} = serviceList;
//开始进行训练
// /aicos-robot/robot-training/start
export const robotTrainStart = (data) => {
  return request({
    url: `${baseURL}api/${kwRobot}/robot-training/start`,
    method: 'post',
    data
  })
}

//获取训练进度
// /aicos-robot/robot-training/progress
export const progress = (data) => {
  return request({
    url: `${baseURL}api/${kwRobot}/robot-training/progress`,
    method: 'post',
    data
  })
}

//判断现在是否在训练
// /aicos-robot/robot-training/isGoing
export const isGoing = (data) => {
  return request({
    url: `${baseURL}api/${kwRobot}/robot-training/isGoing`,
    method: 'post',
    data
  })
}

//获取训练模型列表
///aicos-robot/robot-training/list
export const modelList = (data) => {
  return request({
    url: `${baseURL}api/${kwRobot}/robot-training/list`,
    method: 'post',
    data
  })
}

//删除训练模型
// /aicos-robot/robot-training/delete
export const deleteList = (data) => {
  return request({
    url: `${baseURL}api/${kwRobot}/robot-training/delete`,
    method: 'post',
    data
  })
}

//会话模块列表
// /aicos-robot/huilan-robot-chat/listData
export const listData = (data) => {
  return request({
    url: `${baseURL}api/${kwRobot}/huilan-robot-chat/listData`,
    method: 'post',
    // data
    data: {
      ...data,
      enabled: 1
    }
  })
}
export const listDataModule = (data) => {
  return request({
    url: `${baseURL}api/${kwRobot}/huilan-robot-chat/listData`,
    method: 'post',
    data
  })
}

export const getById = (id) => {
  return request({
    url: `${baseURL}api/${kwRobot}/huilan-robot-chat/getById`,
    method: 'post',
    data:{
      id
    }
  })
}

//保存或编辑会话相关内容
///aicos-robot/huilan-robot-chat/saveOrUpdate
export const saveOrUpdate = (data) => {
  return request({
    url: `${baseURL}api/${kwRobot}/huilan-robot-chat/saveOrUpdate`,
    method: 'post',
    data
  })
}

//修改状态 启用,停用
// /aicos-robot/huilan-robot-chat/updateEnabled
export const updateEnabled = (data) => {
  return request({
    url: `${baseURL}api/${kwRobot}/huilan-robot-chat/updateEnabled`,
    method: 'post',
    params: {
      ids: data.ids,
      type: data.type
    }
  })
}

//删除
// /aicos-robot/huilan-robot-chat/delete
export const moduleDelete = (data) => {
  return request({
    url: `${baseURL}api/${kwRobot}/huilan-robot-chat/delete`,
    method: 'post',
    params: {
      ids: data.ids,
    }
  })
}


//新增或编辑机器人数据
// /aicos-knowledge/huilan-robot/saveOrUpdate knowledge
export const saveOrUpdateRobot = (data) => {
  return request({
    url: `${baseURL}api/${kwRobot}/huilan-robot/saveOrUpdate`,
    method: 'post',
    data
  })
}

//机器人管理列表
// /aicos-robot/huilan-robot/listData
export const robotListData = (data) => {
  return request({
    url: `${baseURL}api/${kwRobot}/huilan-robot/listData`,
    method: 'post',
    data
  })
}

//删除机器人
// /aicos-robot/huilan-robot/delete
export const deleteRobot = (data) => {
  return request({
    url: `${baseURL}api/${kwRobot}/huilan-robot/delete`,
    method: 'post',
    params: {
      id: data.id
    }
  })
}

//默认设置
// /aicos-robot/huilan-robot/settingDefault
export const settingDefault = (data) => {
  return request({
    url: `${baseURL}api/${kwRobot}/huilan-robot/settingDefault`,
    method: 'post',
    params: {
      id: data.id,
      type: data.type
    }
  })
}


//获取字典级别信息
// /aicos-system/baseDict/getDictItemListByDictCode
export const getRobotDictItemListByDictCode = (data) => {
  return request({
    url: `${baseURL}api/${system}/baseDict/getDictItemListByDictCode`,
    method: 'post',
    data

  })
}

//获取机器人实例的配置信息
///aicos-knowledge/huilan-robot/getRobotSetting
export const getRobotSetting = (data) => {
  return request({
    url: `${baseURL}api/${kwRobot}/huilan-robot/getRobotSetting`,
    method: 'post',
    params: {
      id: data.id,
    }
  })
}

//新增机器人策略
// /aicos-robot/robotStrategy/addStrategy
export const addStrategy = (data) => {
  return request({
    url: `${baseURL}api/${kwRobot}/advancedRobotStrategy/saveOrUpdate`,
    method: 'post',
    data
  })
}
// 复制机器人策略
export const copyStrategy = (data) => {
  return request({
    url: `${baseURL}api/${kwRobot}/advancedRobotStrategy/copyStrategy`,
    method: 'post',
    data
  })
}

//获取策略列表
///aicos-robot/robotStrategy/list
export const strategyList = (data) => {
  return request({
    url: `${baseURL}api/${kwRobot}/advancedRobotStrategy/selectList`,
    method: 'post',
    data
  })
}
//修改策略状态
// /aicos-robot/robotStrategy/updateStatus
export const updateStatus = (data) => {
  return request({
    url: `${baseURL}api/${kwRobot}/robotStrategy/updateStatus`,
    method: 'post',
    data
  })
}
//删除策略
// /aicos-robot/robotStrategy/addStrategy/{id}
export const deleteStrategy = (data) => {
  return request({
    url: `${baseURL}api/${kwRobot}/advancedRobotStrategy/deleteByIds`,
    method: 'post',
    data
  })
}
//默认策略恢复出厂设置
export const restoreFactory = (id) => {
  return request({
    url: `${baseURL}api/${kwRobot}/advancedRobotStrategy/restoreFactory`,
    method: 'get',
    params:{
      id
    }
  })
}
// 策略停用
export const strategyDisabled = (id) => {
  return request({
    url: `${baseURL}api/${kwRobot}/advancedRobotStrategy/disabled`,
    method: 'get',
    params:{
      id
    }
  })
}

// 策略启用
export const strategyEnable = (id) => {
  return request({
    url: `${baseURL}api/${kwRobot}/advancedRobotStrategy/enable`,
    method: 'get',
    params:{
      id
    }
  })
}

//助手的问题数量
// /aicos-knowledge/healthDetection/helper
export const healthDetection = (data) => {
  return request({
    url: `${baseURL}api/${knowledge}/healthDetection/helper`,
    method: 'get',
    params: {
      robotId: data.id
    }
  })
}
//检测结果详情
// /aicos-knowledge/healthDetection/checkResult
export const checkResult = (data) => {
  return request({
    url: `${baseURL}api/${knowledge}/healthDetection/checkResult`,
    method: 'get',
    params: {
      robotId: data.id
    }
  })
}
//使用该模型
export const upgradeModel = (modelName) => {
  return request({
    url: `${baseURL}api/${kwRobot}/robot-training/upgradeModel`,
    method: 'get',
    params: {
      modelName
    }
  })
}
//开始训练
export const start = (data) => {
  return request({
    url: `${baseURL}api/${knowledge}/robot-training/start`,
    method: 'get',
    params: {
      robotId: data.id
    }
  })
}
// 查看训练内容
export const modelTrainView = (id) => {
  return request({
    url: `${baseURL}api/${kwRobot}/robot-training/modelTrainView`,
    method: 'get',
    params: {
      id
    }
  })
}
// 获取asr或tts下拉框数据
export const getAsrList = (type) => {
  return request({
    url: `${baseURL}api/${kwRobot}/huilan-robot/getAsrList`,
    method: 'post',
    params:{
      type
    }
  })
}
// 获取机器人列表（区分租户）
export const getRobotList = (tenantId,type) => {
  return request({
    url: `${baseURL}api/${kwRobot}/huilan-robot/get/robotInstanceList`,
    method: 'get',
    params:{
      tenantId,
      type
    }
  })
}
