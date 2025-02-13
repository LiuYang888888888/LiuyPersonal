import request from '@/router/axios';
import {
  baseURL
} from '@/api/common';
/*培训通知*/
//列表查询
export const getList = (data) => {
  return request({
    url: `${baseURL}api/aicos-second/zzb/trainNotice/listPage`,
    method: 'post',
    data
  })
}
//新增
export const add = (row) => {
  return request({
    url: `${baseURL}api/aicos-second/zzb/trainNotice/save`,
    method: 'post',
    data: row
  })
}
//编辑
export const update = (row) => {
  return request({
    url: `${baseURL}api/aicos-second/zzb/trainNotice/update`,
    method: 'post',
    data: row
  })
}
//删除
export const remove = (id) => {
  return request({
    url: `${baseURL}api/aicos-second/zzb/trainNotice/delete`,
    method: 'post',
    data: {
      id,
    }
  })
}
//下发
export const xiafa = (id) => {
  return request({
    url: `${baseURL}api/aicos-second/zzb/trainNotice/xiafa`,
    method: 'post',
    data: {
      id,
    }
  })
}
//接收人员列表
export const getJieshouDetail = () => {
  return request({
    url: `${baseURL}api/aicos-second/zzb/taskManageNotice/getAcceptUserList`,
    method: 'post',
  })
}
//培训通知查看
export const gettzList = (data) => {
  return request({
    url: `${baseURL}api/aicos-second/zzb/trainPerson/listPage`,
    method: 'post',
    data: data
  })
}
//完成培训
export const completeTrain = (id) => {
  return request({
    url: `${baseURL}api/aicos-second/zzb/trainPerson/done`,
    method: 'post',
    data: {
      id,
    }
  })
}
//各处室培训通知详情
export const getDetail = (id) => {
  return request({
    url: `${baseURL}api/aicos-second/zzb/trainNotice/getById`,
    method: 'post',
    data: {
      id,
    }
  })
}