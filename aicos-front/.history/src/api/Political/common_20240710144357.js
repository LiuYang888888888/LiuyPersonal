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
    url: `${baseURL}api/aicos-second/departmentAssessment/attendance/startProcessInstanceById`,
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
export const czremove = (id) => {
  return request({
    url: `${baseURL}api/aicos-second/departmentAssessment/attendance/delete`,
    method: 'post',
    headers:{'Content-Type':'application/x-www-form-urlencoded'},
    data: id
  })
}

//查看
export const viewListData = (id) => {
  return request({
    url: `${baseURL}api/aicos-second/departmentAssessment/attendance/getById`,
    method: 'post',
    headers:{'Content-Type':'application/x-www-form-urlencoded'},
    data: id
  })
}
//获取当前用户信息
export const userInfo = () => {
  return request({
    url: `${baseURL}api/aicos-second/zzb/util/getCurrentUser`,
    method: 'post',
  })
}
//查询当前用户部门
export const getDepartment = () => {
  return request({
    url: `${baseURL}api/aicos-second/zzb/util/getCurrentDept`,
    method: 'post',
  })
}

/* 各处室下发通知*/
//查询列表
export const getNotice = (data) => {
  return request({
    url: `${baseURL}api/aicos-second/zzb/zzbkhxfzb/listPage`,
    method: 'post',
    data: data
  })
}
//新增
export const saveNotice = (row) => {
  return request({
    url: `${baseURL}api/aicos-second/zzb/zzbkhxfzb/save`,
    method: 'post',
    data: row
  })
}
//更新
export const updateNotice = (row) => {
  return request({
    url: `${baseURL}api/aicos-second/zzb/zzbkhxfzb/update`,
    method: 'post',
    data: row
  })
}
//删除
export const removeNotice = (id) => {
  return request({
    url: `${baseURL}api/aicos-second/zzb/zzbkhxfzb/delete`,
    method: 'post',
    data: id
  })
}

//明细表生成
export const saveNoticeDetail = (id) => {
  return request({
    url: `${baseURL}api/aicos-second/zzb/zzbkhxftz/save`,
    method: 'post',
    data: id
  })
}

//明细表详情
export const getNoticeDetail = (id) => {
  return request({
    url: `${baseURL}api/aicos-second/departmentAssessment/attendance/queryNoticeDetailsByParam`,
    method: 'post',
    data: id
  })
}
//明细表保存
export const saveNoticeDetailList = (data) => {
  return request({
    url: `${baseURL}api/aicos-second/zzb/zzbkhxftz/saveBatch`,
    method: 'post',
    data: data
  })
}
//下发
export const sendNotice = (data) => {
  return request({
    url: `${baseURL}api/aicos-second/zzb/zzbkhxfzb/xiafa`,
    method: 'post',
    data: data
  })
}
export const getInfo = () => {
  return request({
    url: `${baseURL}api/aicos-second/member/get`,
    method: 'post',
  })
}
//


