import request from '@/router/axios';
import {
  baseURL
} from '@/api/common';
/*安全管理人员考核*/
//查询列表
export const getListData = (data) => {
  return request({
    url: `${baseURL}api/aicos-second/mbj/safetyExamination/listByPage`,
    method: 'post',
    data
  })
}
//新增
export const saveOrUpdateListData = (row) => {
  return request({
    url: `${baseURL}api/aicos-second/mbj/safetyExamination/saveOrUpdateFormData`,
    method: 'post',
    data: row
  })
}
//