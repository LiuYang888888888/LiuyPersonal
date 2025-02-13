import request from '@/router/axios';
import serviceList from '@/config/serviceList';
import {
  baseURL
} from '@/api/common';

const {
  knowledge
} = serviceList;
//模板列表
export const showTemplateList = (current,size,templateName,templateType) => {
  return request({
    url: `${baseURL}api/${knowledge}/showTemplate/page`,
    method: 'get',
    params:{
      current,
      size,
      templateName,
      templateType
    }
  })
}

//模板详情
export const showTemplateDetail = (id) => {
  return request({
    url: `${baseURL}api/${knowledge}/showTemplate/detail`,
    method: 'get',
    params:{
      id,
    }
  })
}

//新增模板
export const saveTemplate = (data) => {
  return request({
    url: `${baseURL}api/${knowledge}/showTemplate/save`,
    method: 'post',
    data
  })
}

//编辑模板
export const updateTemplate = (data) => {
  return request({
    url: `${baseURL}api/${knowledge}/showTemplate/update`,
    method: 'post',
    data
  })
}

//删除模板
export const deleteTemplate = (id) => {
  return request({
    url: `${baseURL}api/${knowledge}/showTemplate/delete`,
    method: 'get',
    params: {
      id
    }
  })
}
