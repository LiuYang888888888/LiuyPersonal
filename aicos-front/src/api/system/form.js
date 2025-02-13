import request from '@/router/axios';
import serviceList from '@/config/serviceList'
import {baseURL} from '@/api/common';

const { flow ,form,message} = serviceList

export const getList = (data) => {
  return request({
    url: `${baseURL}api/${form}/baseFormTemplate/listPageByFormTemplateParam`,
    method: 'post',
    data
  })
}

export const remove = (id) => {
  return request({
    url: `${baseURL}api/${form}/baseFormTemplate/delete`,
    method: 'post',
    data: {
      id,
    }
  })
}

export const add = (row) => {
  return request({
    url: `${baseURL}api/${form}/baseFormTemplate/save`,
    method: 'post',
    data: row
  })
}

export const update = (row) => {
  return request({
    url: `${baseURL}api/${form}/baseFormTemplate/update`,
    method: 'post',
    data: row
  })
}

export const publish = (id) => {
  return request({
    url: `${baseURL}api/${form}/baseFormTemplate/deploy`,
    method: 'post',
    data: {
      id
    }
  })
}

export const getUseableFieldsList = (data={}) => {
  return request({
    url: `${baseURL}api/${form}/baseForm/getFieldList`,
    method: 'post',
    data
  })
}

//已发布表单模板列表，分页
export const getPublishedFormList = (data) => {
  return request({
    url: `${baseURL}api/${form}/baseFormTemplateVersion/listPageByFormTemplateVersionParam`,
    method: 'post',
    data
  })
}

//已发布表单模板删除
export const deletePublishedForm = (id) => {
  return request({
    url: `${baseURL}api/${form}/baseFormTemplateVersion/delete`,
    method: 'post',
    data: {
      id,
    }
  })
}


// 新增或修改表单数据
export const saveOrUpdateFormData = (row) => {
  return request({
    url: `${baseURL}api/${form}/baseForm/saveOrUpdateFormData`,
    method: 'post',
    data: row
  })
}

// 提交到新增节点
export const runToStartUserTask = (data) => {
  return request({
    url: `${baseURL}api/${flow}/flow/runToStartUserTask`,
    method: 'post',
    data
  })
}

// 按uuid查看BaseFormTemplateVersion
export const getBaseFormTemplateVersionById = (id) => {
  return request({
    url: `${baseURL}api/${form}/baseFormTemplateVersion/getBaseFormTemplateVersionById`,
    method: 'post',
    data: {
      id
    }
  })
}

//流程配置的时候，选择可关联的表单
export const getCanUseFormTemplateVersion = (data) => {
  return request({
    url: `${baseURL}api/${form}/baseFormTemplateVersion/getCanUseFormTemplateVersion`,
    method: 'post',
    data
  })
}

//分页，按已发布表单模板id取所有消息模板变量,包括标准变量和自定义变量，只有自定义变量才能修改
export const getListtBaseMessageTemplateParamByFormTemplateVersionId = (data) => {
  return request({
    url: `${baseURL}api/${message}/baseMessageTemplateParam/listBaseMessageTemplateParamByFormTemplateVersionId`,
    method: 'post',
    data
  })
}

// 新增参数
export const saveParam = (data) => {
  return request({
    url: `${baseURL}api/${message}/baseMessageTemplateParam/save`,
    method: 'post',
    data
  })
}

// 修改参数
export const updateParam = (data) => {
  return request({
    url: `${baseURL}api/${message}/baseMessageTemplateParam/update`,
    method: 'post',
    data
  })
}
// 删除参数
export const removeParam = (id) => {
  return request({
    url: `${baseURL}api/${message}/baseMessageTemplateParam/delete`,
    method: 'post',
    data: {
      id
    }
  })
}
// 启用-停用,传id，status
export const enableParam = (data) => {
  return request({
    url: `${baseURL}api/${message}/baseMessageTemplateParam/enable`,
    method: 'post',
    data
  })
}

// 已发布表单模板列表，不分页，最高版本
export const getByMaxFormTemplateVersion = (data) => {
  return request({
    url: `${baseURL}api/${form}/baseFormTemplateVersion/getByMaxFormTemplateVersion`,
    method: 'post',
    data
  })
}

// 已发布表单模板列表ByKey，分页，传code
export const getPublishedVersionList = (data) => {
  return request({
    url: `${baseURL}api/${form}/baseFormTemplateVersion/listPageByFormTemplateVersionParamByKey`,
    method: 'post',
    data
  })
}

// 启动流程
export const startProcessById = (data) => {
  return request({
    url: `${baseURL}api/${flow}/flow/startProcessInstanceById`,
    method: 'post',
    data
  })
}

// 获取表单的字典的地址
export const getFormDictUrl = (params) => {
  return request({
    url: `${baseURL}api/${form}/baseForm/getBaseAppstoreProductBySystemCodeAndKey`,
    method: 'post',
    params
  })
}

export const createDicRequest = (url) => {
  return (data) => {
    return request({
      url: url,
      method: 'post',
      data
    })
  }
}
