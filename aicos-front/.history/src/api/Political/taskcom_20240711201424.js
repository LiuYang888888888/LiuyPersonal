import request from '@/router/axios';
import {
  baseURL
} from '@/api/common';
/*通知下发*/
//下发列表查询
export const getList = (data) => {
  return request({
    url: `${baseURL}api/aicos-second/zzb/taskManageNotice/listPage`,
    method: 'post',
    data
  })
}
//下发新增
export const add = (row) => {
  return request({
    url: `${baseURL}api/aicos-second/zzb/taskManageNotice/save`,
    method: 'post',
    data: row
  })
}
//下发编辑
export const update = (row) => {
  return request({
    url: `${baseURL}api/aicos-second/zzb/taskManageNotice/update`,
    method: 'post',
    data: row
  })
}
//下发删除
export const remove = (id) => {
  return request({
    url: `${baseURL}api/aicos-second/zzb/taskManageNotice/delete`,
    method: 'post',
    data: {
      id,
    }
  })
}
//下发
export const tijiao = (row) => {
  return request({
    url: `${baseURL}api/aicos-second/zzb/taskManageNotice/xiafa`,
    method: 'post',
    data: row
  })
}
//接收单位
export const danwei = () => {
  return request({
    url: `${baseURL}api/aicos-second/zzb/taskManageNotice/getAcceptDeptList`,
    method: 'post',
  })
}

/*上报*/
//上报列表查询
export const getListSb = (data) => {
  return request({
    url: `${baseURL}api/aicos-second/zzb/taskManageNotice/listPage`,
    method: 'post',
    data
  })
}
//下发新增
export const add = (row) => {
  return request({
    url: `${baseURL}api/aicos-second/zzb/taskManageNotice/save`,
    method: 'post',
    data: row
  })
}
//下发编辑
export const update = (row) => {
  return request({
    url: `${baseURL}api/aicos-second/zzb/taskManageNotice/update`,
    method: 'post',
    data: row
  })
}
//下发删除
export const remove = (id) => {
  return request({
    url: `${baseURL}api/aicos-second/zzb/taskManageNotice/delete`,
    method: 'post',
    data: {
      id,
    }
  })
}
//下发
export const tijiao = (row) => {
  return request({
    url: `${baseURL}api/aicos-second/zzb/taskManageNotice/xiafa`,
    method: 'post',
    data: row
  })
}