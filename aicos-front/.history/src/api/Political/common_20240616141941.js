import request from '@/router/axios';
import {
  baseURL
} from '@/api/common';


export const getList = (data) => {
  return request({
    url: `${baseURL}api/aicos-second/zzb/zzbForm/listPage`,
    method: 'post',
    data
  })
}

export const add = (row) => {
  return request({
    url: `${baseURL}api/aicos-second/zzb/zzbForm/save`,
    method: 'post',
    data: row
  })
}

export const update = (row) => {
  return request({
    url: `${baseURL}api/aicos-second/zzb/zzbForm/update`,
    method: 'post',
    data: row
  })
}

export const remove = (id) => {
  return request({
    url: `${baseURL}api/aicos-second/zzb/zzbForm/delete`,
    method: 'post',
    data: {
      id,
    }
  })
}

export const tijiao = (row) => {
  return request({
    url: `${baseURL}api/aicos-second/zzb/zzbForm/startProcessInstance`,
    method: 'post',
    data: row
  })
}

export const role = (row) => {
  return request({
    url: `${baseURL}api/aicos-second/member/getCurrentRole`,
    method: 'post',
    data: row
  })
}

export const getprocessId  = (id) => {
  return request({
    url: `${baseURL}api/aicos-second/zzb/zzbForm/getFormFlow`,
    method: 'post',
    data: id
  })
}

//审核通过
export const flowYes = (data) => {
  return request({
    url: `${baseURL}api/aicos-second/zzb/zzbForm/completeTask`,
    method: 'post',
    data
  })
}

//审核不通过
export const flowNo = (data) => {
  return request({
    url: `${baseURL}api/aicos-second/zzb/zzbForm/closeForDisagree`,
    method: 'post',
    data
  })
}

//处长考核查询列表
export const czgetList = (data) => {
  return request({
    url: `${baseURL}api/aicos-second/departmentAssessment/attendance/listByPage`,
    method: 'post',
    data
  })
}
//处长考核人员新增
export const saveOrUpdateListData = (row) => {
  return request({
    url: `${baseURL}api/aicos-second/departmentAssessment/attendance/saveOrUpdateFormData`,
    method: 'post',
    data: row
  })
}

//处长考核人员提交
export const cztijiao = (row) => {
  return request({
    url: `${baseURL}api/aicos-second/departmentAssessment/attendance/completeTask`,
    method: 'post',
    data: row
  })
}

//处长考核审核通过
export const czflowYes = (data) => {
  return request({
    url: `${baseURL}api/aicos-second/departmentAssessment/attendance/updateCompleteTask`,
    method: 'post',
    data
  })
}


//处长考核审核不通过
export const czflowNo = (data) => {
  return request({
    url: `${baseURL}api/aicos-second/departmentAssessment/attendance/closeForDisagree`,
    method: 'post',
    data
  })
}

//处长考核删除
export const czremove = (data) => {
  return request({
    url: `${baseURL}api/aicos-second/departmentAssessment/attendance/delete`,
    method: 'post',
    data: {
      id,
    }
  })
}




