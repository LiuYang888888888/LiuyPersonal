import request from '@/router/axios';
import serviceList from '@/config/serviceList';
import {
  baseURL
} from '@/api/common';

const {
  exam
} = serviceList
export const getList = (data) => {
  return request({
    url: `${baseURL}api/${exam}/examBankAdmin/listPage`,
    method: 'post',
    data
  })
}
/*新增*/
export const addList = (data) => {
  return request({
    url: `${baseURL}api/${exam}/examBankAdmin/add`,
    method: 'post',
    data
  })
}

/*编辑*/
export const updateList = (data) => {
  return request({
    url: `${baseURL}api/${exam}/examBankAdmin/add`,
    method: 'post',
    data
  })
}

/*删除*/
export const delList = (data) => {
  return request({
    url: `${baseURL}api/${exam}/examBankAdmin/delete`,
    method: 'post',
    params:{
      ...data
    }
  })
}

/*批量删除*/
export const batchDelList = (data) => {
  return request({
    url: `${baseURL}api/${exam}/examBankAdmin/batchDelete`,
    method: 'post',
    params:{
      ...data
    }
  })
}
// 导出题库
export const outBankList = (data) => {
  return request({
    url: `${baseURL}api/${exam}/examBankAdmin/export`,
    method: 'get',
    data
  })
}
// 导入题库
export const importFile = (data) => {
  return request({
    url: `${baseURL}api/${exam}/examBankAdmin/import`,
    method: 'post',
    data
  })
}