import request from '@/router/axios';
import serviceList from '@/config/serviceList'
import {baseURL} from '@/api/common';
const { ai, system } = serviceList

export const getList = (current, size, params) => {
  return request({
    url: `${baseURL}api/${ai}/asr/asrconfigure/list`,
    method: 'get',
    params: {
      ...params,
      current,
      size,
    }
  })
}

export const getDetail = (id) => {
  return request({
    url: `${baseURL}api/${ai}/asr/asrconfigure/detail`,
    method: 'get',
    params: {
      id
    }
  })
}

export const remove = (ids) => {
  return request({
    url: `${baseURL}api/${ai}/asr/asrconfigure/remove`,
    method: 'post',
    params: {
      ids,
    }
  })
}

export const add = (row) => {
  return request({
    url: `${baseURL}api/${ai}/asr/asrconfigure/add`,
    method: 'post',
    data: row
  })
}

export const update = (row) => {
  return request({
    url: `${baseURL}api/${ai}/asr/asrconfigure/updateAsr`,
    method: 'post',
    data: row
  })
}
//更新默认状态接口
export const arsStatus = (row)=>{
  return request({
    url: `${baseURL}api/${ai}/asr/asrconfigure/update/asr`,
    method: 'post',
    data: row
  })
}
// 测试asr接口
export const testAsr = (row)=>{
  return request({
    url: `${baseURL}api/${ai}/asr/asrconfigure/test/asr`,
    timeout: 600000,
    method: 'post',
    data: row
  })
}
// 获取厂商接口
export const getCompany = (row)=>{
  return request({
    url: `${baseURL}api/${system}/baseDict/getDictItemListByDictCode`,
    method: 'post',
    data: row
  })
}

