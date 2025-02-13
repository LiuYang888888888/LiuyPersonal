import request from '@/router/axios';
import serviceList from '@/config/serviceList'
import {baseURL} from '@/api/common';

const { flow } = serviceList

export const getList = (data) => {
  return request({
    url: `${baseURL}api/${flow}/flow-deployment/list`,
    method: 'post',
    data
  })
}

export const remove = (data) => {
  return request({
    url: `${baseURL}api/${flow}/flow-deployment/deleteFlowTemplate`,
    method: 'post',
    data
  })
}

export const save = (row) => {
  return request({
    url: `${baseURL}api/${flow}/flow-deployment/saveFlowTemplate`,
    method: 'post',
    data: row
  })
}

// export const update = (row) => {
//   return request({
//     url: '/api/aiworkorder-system/baseForm/update',
//     method: 'post',
//     data: row
//   })
// }

// 部署流程
export const publishFlow = (data) => {
  return request({
    url: `${baseURL}api/${flow}/flow-deployment/deploy`,
    method: 'post',
    data
  })
}

// 获取已发布的流程列表
export const getPublishedList = (data) => {
  return request({
    url: `${baseURL}api/${flow}/flow/startList`,
    method: 'post',
    data
  })
}
// 获取表单的最大版本
// export const getSubProcessMaxFormTemplateVersion = (data) => {
//   return request({
//     url: `${baseURL}api/${flow}/baseFormTemplateVersion/getSubProcessMaxFormTemplateVersionByGroupKey`,
//     method: 'post',
//     data
//   })
// }
// 删除部署流程
export const removePublishedFlow = (deploymentId) => {
  return request({
    url: `${baseURL}api/${flow}/flow-deployment/delete`,
    method: 'post',
    data: {
      deploymentId
    }
  })
}


// 启动流程
export const startProcessInstanceById = (data) => {
  return request({
    url: `${baseURL}api/${flow}/flow/startProcessInstanceById`,
    method: 'post',
    data
  })
}

//根据deploymentId获得流程的配置
export const getProcessConfigByDeploymentId = (deploymentId) => {
  return request({
    url: `${baseURL}api/${flow}/flow/getProcessConfigByDeploymentId`,
    method: 'post',
    data: {
      deploymentId
    }
  })
}

// 当前用户在当前节点具有哪些按钮,传taskId,processDefinitionId,taskDefinitionKey,processInstanceId

export const getInitButtonByCurrentTaskId = (data) => {
  return request({
    url: `${baseURL}api/${flow}/flow/getInitButtonByCurrentTaskId`,
    method: 'post',
    data
  })
}

// // 根据processDefinitionId获得流程的配置
// export const getProcessConfigByProcessDefinitionId = (data) => {
//   return request({
//     url: `${baseURL}api/${flow}/flow/getProcessConfigByProcessDefinitionId`,
//     method: 'post',
//     data
//   })
// }

//根据选择的FormTemplateVersionId获得对应的processId
export const getProcessFormRelationByFormTemplateVersionId = (formTemplateVersionId) => {
  return request({
    url: `${baseURL}api/${flow}/flow-deployment/getProcessFormRelationByFormTemplateVersionId`,
    method: 'post',
    data: {
      formTemplateVersionId
    }
  })
}

export const getPublishedVersionList = (data) => {
  return request({
    url: `${baseURL}api/${flow}/flow/startListByKey`,
    method: 'post',
    data
  })
}

// 获取表单数据前先获取SystemCode
export const getProductCode = (data={}) => {
  return request({
    url: `${baseURL}api/${flow}/flow/getProductCode`,
    method: 'post',
    data
  })
}
