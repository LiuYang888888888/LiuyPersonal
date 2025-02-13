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
    data:ids
  })
}
