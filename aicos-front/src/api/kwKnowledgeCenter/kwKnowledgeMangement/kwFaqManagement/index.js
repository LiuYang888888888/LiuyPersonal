import request from '@/router/axios';
import serviceList from '@/config/serviceList';
import {
  baseURL,
} from '@/api/common';

const {
  knowledge,
  file
} = serviceList;

export const savefaqUrl = (data) => {
  return request({
    url: `${baseURL}api/${knowledge}/faqQuestion/save`,
    method: 'post',
    data
  })
}

export const updatefaqUrl = (data) => {
  return request({
    url: `${baseURL}api/${knowledge}/faqQuestion/update`,
    method: 'post',
    data
  })
}

export const loadListUrl = (data) => {
  return request({
    url: `${baseURL}api/${knowledge}/faqQuestion/listdata`,
    method: 'post',
    data
  })
}

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
    url: `${baseURL}api/${knowledge}/faqQuestion/delete`,
    method: 'post',
    params: {
      ids
    }
  })
}

// 启用停用知识
export const enableOrStopFaqUrl = (ids, type) => {
  return request({
    url: `${baseURL}api/${knowledge}/faqQuestion/setEnableOrDisable`,
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
    url: `${baseURL}api/${knowledge}/faqQuestion/updateTopStatus`,
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
    url: `${baseURL}api/${knowledge}/faqQuestion/updateFaqStatus`,
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
    url: `${baseURL}api/${knowledge}/faqQuestion/versionListdata`,
    method: 'post',
    data
  })
}

// 获取faq的数据
export const getFaqDataUrl = (id, type, version) => {
  return request({
    url: `${baseURL}api/${knowledge}/faqQuestion/getById`,
    method: 'post',
    params: {
      id,
      type,
      version
    }
  })
}

// 回退到该版本
export const callbackVersionUrl = (id, version) => {
  return request({
    url: `${baseURL}api/${knowledge}/faqQuestion/back`,
    method: 'post',
    params: {
      id,
      version
    }
  })
}

//导入
// /aicos-knowledge/faqQuestion/import
export const faqImport = (data) => {
  return request({
    url: `${baseURL}api/${knowledge}/faqQuestion/import`,
    method: 'post',
    timeout: 6000000,
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
// 同步知识
export const oneKeySync = (cateId) => {
  return request({
    url: `${baseURL}api/${knowledge}/faqQuestion/oneKeySync`,
    method: 'get',
    params: {
      cateId
    }
  })
}

//相似问扩写
export const kWFaqExtendApi = (data) => {
  return request({
    url: `${baseURL}api/${knowledge}/faqQuestion/extendedSimilar`,
    method: 'post',
    data
  })
}
