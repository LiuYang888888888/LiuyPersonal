import request from '@/router/axios';
import serviceList from '@/config/serviceList';
import {
  baseURL,
} from '@/api/common';

const {
  knowledge,
  file
} = serviceList;
// 新增知识接口
export const tableQaSave = (data) => {
  return request({
    url: `${baseURL}api/${knowledge}/tableQa/save`,
    method: 'post',
    data
  })
}
// 查询相似知识
export const similarQa = (data) => {
  return request({
    url: `${baseURL}api/${knowledge}/tableQa/similarQa`,
    method: 'post',
    data
  })
}

// 编辑知识接口
export const tableQaUpdate = (data) => {
  return request({
    url: `${baseURL}api/${knowledge}/tableQa/update`,
    method: 'post',
    data
  })
}

// 右侧列表接口
export const loadListUrl = (data) => {
  return request({
    url: `${baseURL}api/${knowledge}/tableQa/selectList`,
    method: 'get',
    params:{
      ...data
    }
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
    url: `${baseURL}api/${knowledge}/tableQa/delete`,
    method: 'post',
    params: {
      ids
    }
  })
}

// 启用停用知识
export const enableOrStopFaqUrl = (ids, type) => {
  return request({
    url: `${baseURL}api/${knowledge}/tableQa/setEnableOrDisable`,
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
    url: `${baseURL}api/${knowledge}/tableQa/updateTopStatus`,
    method: 'post',
    params: {
      id,
      type
    }
  })
}

// 发布知识
export const publishFaqUrl = (id, type) => {
  return request({
    url: `${baseURL}api/${knowledge}/tableQa/updateStatus`,
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
    url: `${baseURL}api/${knowledge}/tableQa/versionListData`,
    method: 'get',
    params: {
      ...data
    }
  })
}

// 获取table的数据
export const getTableDataUrl = (id, type, version) => {
  return request({
    url: `${baseURL}api/${knowledge}/tableQa/selectOne`,
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
    url: `${baseURL}api/${knowledge}/tableQa/back`,
    method: 'post',
    params: {
      id,
      version
    }
  })
}

//导入
export const tableImport = (data) => {
  return request({
    url: `${baseURL}api/${knowledge}/tableQa/import`,
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

// 批量导出
export const tableBatchExport = (data) => {
  return request({
    url: `${baseURL}api/${knowledge}/tableQa/export`,
    method: 'post',
    responseType: 'blob',
    data
  })
}
// 批量导入
export const tableBatchImport = (data) => {
  return request({
    url: `${baseURL}api/${knowledge}/tableQa/import`,
    method: 'post',
    timeout: 6000000,
    data
  })
}
