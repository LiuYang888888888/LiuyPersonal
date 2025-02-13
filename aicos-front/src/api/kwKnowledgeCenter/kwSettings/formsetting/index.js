import request from '@/router/axios';
import serviceList from '@/config/serviceList';
import {
  baseURL
} from '@/api/common';

const {
  knowledge
} = serviceList;
//表单名称列表
export const formList = (robotId) => {
  return request({
    url: `${baseURL}api/${knowledge}/huilan-km-teble-setting/getList`,
    method: 'get',
    params:{
      robotId
    }
  })
}

//新增表单名称or编辑表单名称
export const saveOrUpdate = (data) => {
  return request({
    url: `${baseURL}api/${knowledge}/huilan-km-teble-setting/saveOrUpdate`,
    method: 'post',
    data
  })
}

// 查询表单是否被引用
export const isNotReference = (id) => {
  return request({
    url: `${baseURL}api/${knowledge}/huilan-km-teble-setting/isNotReference`,
    method: 'get',
    params: {
      id
    }
  })
}

//删除表单
export const settingDel = (id) => {
  return request({
    url: `${baseURL}api/${knowledge}/huilan-km-teble-setting/delete`,
    method: 'get',
    params: {
      id
    }
  })
}


//表单列表
export const settingList = (id) => {
  return request({
    url: `${baseURL}api/${knowledge}/huilan-km-teble-setting/detail`,
    method: 'get',
    params: {
      id
    }
  })
}

//表单列表上移,下移
export const changeOrder = (id, sortFlag) => {
  return request({
    url: `${baseURL}api/${knowledge}/huilan-km-teble-setting/sort`,
    method: 'get',
    params: {
      id,
      sortFlag
    }
  })
}
//表单设置内容查看
export const settingView = (id) => {
  return request({
    url: `${baseURL}api/${knowledge}/huilan-km-teble-setting/getContentSetting`,
    method: 'get',
    params: {
      id
    }
  })
}
// 表单设置保存
export const settingSave = (data) => {
  return request({
    url: `${baseURL}api/${knowledge}/huilan-km-teble-setting/contentSetting`,
    method: 'post',
    data
  })
}
// 表单内容勾选保存
export const saveChoiceIds = (contentIdList,id) => {
  return request({
    url: `${baseURL}api/${knowledge}/huilan-km-teble-setting/saveChoiceIds`,
    method: 'get',
    params: {
      contentIdList,
      id
    }
  })
}