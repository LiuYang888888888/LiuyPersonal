import request from '@/router/axios';
import serviceList from '@/config/serviceList'
import { baseURL } from '@/api/common';

const { ai } = serviceList

// // 热词查询
// export const getHotWordList = (data) => {
//   return request({
//     url: `${baseURL}api/${ai}/aiAbility/select/hotWord`,
//     method: 'get',
//     params: { ...data }
//   })
// }
// // 智能分类-新增分类
export const save = (data) => {
  return request({
    url: `${baseURL}api/${ai}/aiClassify/save`,
    method: 'post',
    data
  })
}
// // 智能分类-分类列表
export const list = (data) => {
  return request({
    url: `${baseURL}api/${ai}/aiClassify/list`,
    method: 'post',
    data
  })
}


