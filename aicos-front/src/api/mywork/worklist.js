import request from '@/router/axios';
import serviceList from '@/config/serviceList'
import {baseURL} from '@/api/common';

const { flow } = serviceList

export const getList = (data) => {
  return request({
    url: `${baseURL}api/${flow}/flow/todoList`,
    method: 'post',
    data
  })
}

// 获取当选要处理的表单及数据
export const getItemInfo = (data) => {
  return request({
    url: `${baseURL}api/${flow}/flow/getAnyTask`,
    method: 'post',
    data
  })
}


// 直接关闭，传入processInstanceId,processDefinitionId,comment
export const closeTask = (data) => {
  return request({
    url: `${baseURL}api/${flow}/flownode/close`,
    method: 'post',
    data
  })
}

// 提交处理
export const completeTask = (data) => {
  return request({
    url: `${baseURL}api/${flow}/flownode/completeTask`,
    method: 'post',
    data
  })
}

// 延期申请，传入taskId,processInstanceId,comment
export const requestFLowDelay = (data) => {
  return request({
    url: `${baseURL}api/${flow}/flownode/delayApply`,
    method: 'post',
    data
  })
}

// 延期申请处理，传入taskId,processInstanceId,passStatus(agreeDelayApply-rejectDelayApply)，comment
export const handleFLowDelay = (data) => {
  return request({
    url: `${baseURL}api/${flow}/flownode/delay`,
    method: 'post',
    data
  })
}

// 派发，传入taskId,processInstanceId,processDefinitionId,taskDefinitionKey，passStatus=distribute
export const flowDistribute = (data) => {
  return request({
    url: `${baseURL}api/${flow}/flownode/distribute`,
    method: 'post',
    data
  })
}

// 重新提交，传入taskId,processInstanceId,processDefinitionId,taskDefinitionKey,comment
export const flowResubmit = (data) => {
  return request({
    url: `${baseURL}api/${flow}/flownode/resubmit`,
    method: 'post',
    data
  })
}

//获取流程节点进程图，传入processInstanceId,processDefinitionId

export const diagramView = (data) => {
  return `${baseURL}api/${flow}/flow/diagramView?processInstanceId=${data.processInstanceId}&processDefinitionId=${data.processDefinitionId}`
  // return request({
  //   url: '/api/aiworkorder-flow/flow/diagramView',
  //   method: 'get',
  //   params: data
  // })
}
//流程图展示，传入processInstanceId,processDefinitionId,例如：processDefinitionId=test:5:290699f7-ce3c-11eb-a72e-fc349769963a
export const resourceView = (data) => {
  return `${baseURL}api/${flow}/flow/resourceView?processInstanceId=${data.processInstanceId}&processDefinitionId=${data.processDefinitionId}`
  // return request({
  //   url: '/api/aiworkorder-flow/flow/resourceView',
  //   method: 'get',
  //   params: data
  // })
}
export const getDiagramData = (data) => {
  // return `${baseURL}api/${flow}/flow/resourceView?processInstanceId=${data.processInstanceId}&processDefinitionId=${data.processDefinitionId}`
  return request({
    url: `${baseURL}api/${flow}/flow/getDiagramData`,
    method: 'post',
    data
  })
}

// 撤回，传入taskId,processInstanceId,processDefinitionId,comment
export const revoke = (data) => {
  return request({
    url: `${baseURL}api/${flow}/flownode/revoke`,
    method: 'post',
    data
  })
}

// 暂办结，传入taskId,processInstanceId,processDefinitionId,taskDefinitionKey,comment
export const tempfinish = (data) => {
  return request({
    url: `${baseURL}api/${flow}/flownode/tempfinish`,
    method: 'post',
    data
  })
}

// 转办，传入acceptUserAccount(只能选人),taskId,processInstanceId,processDefinitionId,taskDefinitionKey
export const transfer = (data) => {
  return request({
    url: `${baseURL}api/${flow}/flownode/transfer`,
    method: 'post',
    data
  })
}

// 催办，传入taskId,processInstanceId,processDefinitionId,taskDefinitionKey
export const urge = (data) => {
  return request({
    url: `${baseURL}api/${flow}/flownode/urge`,
    method: 'post',
    data
  })
}

// 激活功能，所有节点列表，传入processDefinitionId
export const getActiveNodeList = (processDefinitionId) => {
  return request({
    url: `${baseURL}api/${flow}/flownode/listActiveNode`,
    method: 'post',
    data: {
      processDefinitionId
    }
  })
}

//激活指定节点，传入processInstanceId,taskId,processDefinitionId,taskDefinitionKey,toActivityId,toActivityName
export const activeTask = (data) => {
  return request({
    url: `${baseURL}api/${flow}/flownode/active`,
    method: 'post',
    data
  })
}
// 获取流转历史列表，传入processInstanceId，processDefinitionId
export const historyFlowList = (data) => {
  return request({
    url: `${baseURL}api/${flow}/flow/historyFlowList`,
    method: 'post',
    data
  })
}


// 办结，传入formDataId,taskId,processInstanceId,processDefinitionId,taskDefinitionKey,comment
export const doFinish = (data) => {
  return request({
    url: `${baseURL}api/${flow}/flownode/doFinish`,
    method: 'post',
    data
  })
}

// 督办，传入formDataId,taskId,processInstanceId,processDefinitionId,taskDefinitionKey
export const supervise = (data) => {
  return request({
    url: `${baseURL}api/${flow}/flownode/supervise`,
    method: 'post',
    data
  })
}

// 督办，传入formDataId,taskId,processInstanceId,processDefinitionId,taskDefinitionKey
export const cancelSupervise = (data) => {
  return request({
    url: `${baseURL}api/${flow}/flownode/cancelSupervise`,
    method: 'post',
    data
  })
}

// 挂起，传入formDataId,taskId,processInstanceId,processDefinitionId,taskDefinitionKey,comment
export const ice = (data) => {
  return request({
    url: `${baseURL}api/${flow}/flownode/ice`,
    method: 'post',
    data
  })
}

// 取消挂起，传入formDataId,taskId,processInstanceId,processDefinitionId,taskDefinitionKey,comment
export const cancelIce = (data) => {
  return request({
    url: `${baseURL}api/${flow}/flownode/cancelIce`,
    method: 'post',
    data
  })
}

// 签收，传入formDataId,taskId,processInstanceId,processDefinitionId,taskDefinitionKey,comment
export const signFor = (data) => {
  return request({
    url: `${baseURL}api/${flow}/flownode/signFor`,
    method: 'post',
    data
  })
}

// 二次办理，传入formDataId,taskId,processInstanceId,processDefinitionId,taskDefinitionKey,passStatus(second),comment
export const second = (data) => {
  return request({
    url: `${baseURL}api/${flow}//flownode/second`,
    method: 'post',
    data
  })
}
