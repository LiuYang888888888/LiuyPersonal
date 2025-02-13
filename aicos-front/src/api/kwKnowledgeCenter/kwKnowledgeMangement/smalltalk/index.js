import request from '@/router/axios';
import serviceList from '@/config/serviceList';
import {
  baseURL
} from '@/api/common';

const {
  knowledge,
  file
} = serviceList;

// 新增闲聊知识列表
export const savefaqUrl = (data) => {
  return request({
    url: `${baseURL}api/${knowledge}/gossip/save`,
    method: 'post',
    data
  })
}
// 更新闲聊知识列表
export const updateChatUrl = (data) => {
  return request({
    url: `${baseURL}api/${knowledge}/gossip/update`,
    method: 'post',
    data
  })
}
// 闲聊知识列表
export const loadListUrl = (data) => {
  return request({
    url: `${baseURL}api/${knowledge}/gossip/listdata`,
    method: 'post',
    data
  })
}
// 获取维度列表搜索
export const getSearchDismensionUrl = (botId) => {
  return request({
    url: `${baseURL}api/${knowledge}/dimension/getSearchList`,
    method: 'get',
    params: {
      botId
    }
  })
}

// 获取维度
export const getDismension = (pid, botId) => {
  return request({
    url: `${baseURL}api/${knowledge}/dimension/findByPid`,
    method: 'get',
    params: {
      pid,
      botId
    }
  })
}

// 删除知识
export const delFaqUrl = (ids) => {
  return request({
    url: `${baseURL}api/${knowledge}/gossip/delete`,
    method: 'post',
    params: {
      ids
    }
  })
}

// 启用停用知识
export const enableOrStopFaqUrl = (ids, type) => {
  return request({
    url: `${baseURL}api/${knowledge}/gossip/setEnableOrDisable`,
    method: 'post',
    params: {
      ids,
      type
    }
  })
}

// 置顶知识
export const updateTopStatusUrl = (id, type) => {
  return request({
    url: `${baseURL}api/${knowledge}/gossip/updateTopStatus`,
    method: 'post',
    params: {
      id,
      type
    }
  })
}

// 发布知识  publishFaqUrl
export const publishFaqUrl = (id, type) => {
  return request({
    url: `${baseURL}api/${knowledge}/gossip/updateGossipStatus`,
    method: 'post',
    params: {
      id,
      type
    }
  })
}

// 版本记录
export const versionListUrl = (data) => {
  return request({
    url: `${baseURL}api/${knowledge}/gossip/versionListdata`,
    method: 'post',
    data
  })
}

// 获取faq的数据
export const getChatDataUrl = (id, type, version) => {
  return request({
    url: `${baseURL}api/${knowledge}/gossip/getById`,
    method: 'post',
    params: {
      id,
      type,
      version
    }
  })
}

// 回退版本接口
export const callbackVersionUrl = (id, version) => {
  return request({
    url: `${baseURL}api/${knowledge}/gossip/back`,
    method: 'post',
    params: {
      id,
      version
    }
  })
}

//导入
export const faqImport = (data) => {
  return request({
    url: `${baseURL}api/${knowledge}/gossip/import`,
    method: 'post',
    data
  })
}

//自定义上传使用aicos之前的上传接口
// api/aicos-file/kmMiniofile/ckeditorUpload?fromSystemName=knowledge&filelibrary=ckeditor&uploadType=ckeditor
export const ckeditorUpload = (data) => {
  return request({
    url: `${baseURL}api/${file}/kmMiniofile/ckeditorUpload?fromSystemName=knowledge&filelibrary=ckeditor&uploadType=ckeditor`,
    method: 'post',
    data
  })
}

// 生成式对话接口保存
export const updateChart = (id,  status) => {
  return request({
    url: `${baseURL}api/${knowledge}/km-classify/updateChart`,
    method: 'get',
    params: {
      id,
      status
    }
  })
}
// 生成式对话查询状态  
export const getById = (id) => {
  return request({
    url: `${baseURL}api/${knowledge}/km-classify/getById`,
    method: 'get',
    params: {
      id
    }
  })
}
// 同步知识
export const oneKeySync = (cateId) => {
  return request({
    url: `${baseURL}api/${knowledge}/gossip/oneKeySync`,
    method: 'get',
    params: {
      cateId
    }
  })
}