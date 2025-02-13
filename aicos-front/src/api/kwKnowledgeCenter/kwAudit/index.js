import request from '@/router/axios';
import serviceList from '@/config/serviceList';
import {
  baseURL
} from '@/api/common';

const {
  knowledge
} = serviceList;

/*审核列表*/
export const getKwAuditList = (data) => {
  return request({
    url: `${baseURL}api/${knowledge}/kmApprovalProcess/listCurrent`,
    method: 'post',
    data
  })
}


/*获取审核设置*/
export const getKwAuditSetting = (data) => {
  return request({
    url: `${baseURL}api/${knowledge}/kmApprovalProcess/kmConfig`,
    method: 'get',
    params: {
      ...data
    }
  })
}

/*保存更新审核设置*/
export const saveKwAuditSetting = (data) => {
  return request({
    url: `${baseURL}api/${knowledge}/kmApprovalProcess/kmConfig`,
    method: 'post',
    data
  })
}

/*审核历史列表*/
export const getKwAuditHistoryList = (data) => {
  return request({
    url: `${baseURL}api/${knowledge}/kmApprovalProcess/listHistory`,
    method: 'post',
    data
  })
}

/*审核操作*/
export const auditKmData = (data, passStatus ) => {
  return request({
    url: `${baseURL}api/${knowledge}/flownode2/${passStatus}`,
    method: 'post',
    data
  })
}

/*某条知识的审核流程详情*/
export const kmProcessDetail = (data ) => {
  return request({
    url: `${baseURL}api/${knowledge}/kmApprovalProcess/currentDetail`,
    method: 'post',
    data
  })
}


/*审核设置可用流程版本*/
export const getKmProcessVersionFlow = (data) => {
  return request({
    url: `${baseURL}api/${knowledge}/flow/getKmProcessVersionFlow`,
    method: 'get',
    params: {
      ...data
    }
  })
}

/*保存编辑开启审核流程*/
export const startKmProcess = (data) => {
  return request({
    url: `${baseURL}api/${knowledge}/flow/startProcessInstanceById`,
    method: 'post',
    data
  })
}


// 创建流程
export const save = (row) => {
  return request({
    url: `${baseURL}api/${knowledge}/flow-deployment/saveFlowTemplate`,
    method: 'post',
    data: row
  })
}

// 部署发布流程
export const publishFlow = (data) => {
  return request({
    url: `${baseURL}api/${knowledge}/flow-deployment/deploy`,
    method: 'post',
    data
  })
}
