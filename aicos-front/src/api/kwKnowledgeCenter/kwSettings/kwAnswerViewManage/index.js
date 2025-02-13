import request from '@/router/axios';
import serviceList from '@/config/serviceList';
import {
  baseURL
} from '@/api/common';

const {
  knowledge
} = serviceList;
//视角类型列表
///aicos-knowledge/huilan-km-answer-angle/angleTypeList
export const angleTypeList = (data) => {
  return request({
    url: `${baseURL}api/${knowledge}/huilan-km-answer-angle/angleTypeList`,
    method: 'post',
    data
  })
}

//新增视角类型
// /aicos-knowledge/huilan-km-answer-angle/saveOrUpdate
export const saveOrUpdate = (data) => {
  return request({
    url: `${baseURL}api/${knowledge}/huilan-km-answer-angle/saveOrUpdate`,
    method: 'post',
    data
  })
}

//删除
// /aicos-knowledge/huilan-km-answer-angle/delete

export const viewDelete = (data) => {
  return request({
    url: `${baseURL}api/${knowledge}/huilan-km-answer-angle/delete`,
    method: 'post',
    data
  })
}


//视角列表
// /aicos-knowledge/huilan-km-answer-angle/angleList
export const angleList = (data) => {
  return request({
    url: `${baseURL}api/${knowledge}/huilan-km-answer-angle/angleList`,
    method: 'post',
    data
  })
}

//视角列表新增,编辑
// /aicos-knowledge/huilan-km-answer-angle/angelSaveOrUpdate
export const angelSaveOrUpdate = (data) => {
  return request({
    url: `${baseURL}api/${knowledge}/huilan-km-answer-angle/angelSaveOrUpdate`,
    method: 'post',
    data
  })
}

//视角列表上移,下移
// /aicos-knowledge/huilan-km-answer-angle/changeOrder
export const changeOrder = (data) => {
  return request({
    url: `${baseURL}api/${knowledge}/huilan-km-answer-angle/changeOrder`,
    method: 'post',
    data
  })
}

// 客户视角数据
export const customerAngleView = (codeType) => {
  return request({
    url: `${baseURL}api/${knowledge}/faqQuestion/customerAngleView`,
    method: 'get',
    params:{
      codeType
    }
  })
}
export const customerDetailAngleView = (id) => {
  return request({
    url: `${baseURL}api/${knowledge}/faqQuestion/customerDetailAngleView`,
    method: 'get',
    params:{
      id
    }
  })
}
