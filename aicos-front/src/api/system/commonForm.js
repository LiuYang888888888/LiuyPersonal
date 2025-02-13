import request from '@/router/axios';
import serviceList from '@/config/serviceList'
import {
  baseURL
} from '@/api/common';

const {
  /*system,*/form,flow,message
} = serviceList



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




//通用表单接口

export const getListData = (data) => {
  return request({
    url: `${baseURL}api/${form}/baseFormTemplate/listPageByFormTemplateParam`,
    method: 'post',
    data
  })
}

export const addListData = (data) => {
  return request({
    url: `${baseURL}api/${form}/baseMetaObj/save`,
    method: 'post',
    data
  })
}

export const updateListData = (data) => {
  return request({
    url: `${baseURL}api/${form}/baseMetaObj/update`,
    method: 'post',
    data
  })
}

/*export const delListData = (data) => {
  return request({
    url: `${baseURL}api/${form}/baseMetaObj/disable`,
    method: 'post',
    data
  })
}*/

export const delListData = (data) => {
  return request({
    url: `${baseURL}api/${form}/baseFormTemplate/delete`,
    method: 'post',
    data
  })
}


export const viewListData = (data) => {
  return request({
    url: `${baseURL}api/${form}/baseMetaObj/view`,
    method: 'post',
    data
  })
}

export const previewListData = (data) => {
  return request({
    url: `${baseURL}api/${form}/baseMetaObj/preview`,
    method: 'post',
    data
  })
}

//表单最新的模板接口
export const getFromTemplateNewest = (data) => {
  return request({
    url: `${baseURL}api/${form}/baseFormTemplateVersion/getLatestTemplateVersion`,
    method: 'post',
    data
  })
}

//获取模板列表
export const getObjListData = (data) => {
  return request({
    url: `${baseURL}api/${form}/dynForm/listProto`,
    method: 'post',
    data
  })
}

//选择使用模板
export const cloneTemplate = (data) => {
  return request({
    url: `${baseURL}api/${form}/baseFormTemplate/cloneTemplate`,
    method: 'post',
    data
  })
}

//复制表单
export const cloneForm = (data) => {
  return request({
    url: `${baseURL}api/${form}/baseFormTemplate/clone`,
    method: 'post',
    data
  })
}

//获取流程下拉列表
export const getFlowList = (data) => {
  return request({
    url: `${baseURL}api/${flow}/formFlowConfig/listFormFlow`,
    method: 'post',
    data
  })
}

//获取流程配置
export const getFlowConfig = (data) => {
  return request({
    url: `${baseURL}api/${flow}/formFlowConfig/listFormFlowNode`,
    method: 'post',
    data
  })
}

//更新表单的流程配置
export const updateFlowConfig = (data) => {
  return request({
    url: `${baseURL}api/${flow}/formFlowConfig/update`,
    method: 'post',
    data
  })
}





