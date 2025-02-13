import request from '@/router/axios';
import {
  baseURL
} from '@/api/common';
//查询待审信息
export const getInfoList = () => {
  return request({
    url: `${baseURL}api/aicos-second/zzb/util/getInfo`,
    method: 'post',
  })
}
//获取本人选择的菜单
export const  getPersonMenu = () => {
  return request({
    url: `${baseURL}api/aicos-second/zzb/util/getPageMenuList`,
    method: 'post',
  })
}
//设置本人选择的菜单
export const  setPersonMenu = (ids) => {
  return request({
    url: `${baseURL}api/aicos-second/zzb/util/setPersonMenu`,
    method: 'post',
    headers:{'Content-Type':'application/x-www-form-urlencoded'},
    data:ids
  })
}
//获取本人选择的菜单展示
export const  getPersonMenuInfo = () => {
  return request({
    url: `${baseURL}api/aicos-second/zzb/util/getPersonMenuInfo`,
    method: 'post',
  })
}
//询本人的回复留言列表
export const  consultancylistByPage = () => {
  return request({
    url: `${baseURL}api/aicos-second/zzb/util/queryConsultancylistByPage`,
    method: 'post',
  })
}
