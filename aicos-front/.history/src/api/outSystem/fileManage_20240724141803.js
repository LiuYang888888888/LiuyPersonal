import request from '@/router/axios';
import {
  baseURL
} from '@/api/common';
//查询
export const getListData = (data) => {
  return request({
    url: `${baseURL}api/aicos-second/mbj/documentDistribution/listByPage`,
    method: 'post',
    data
  })
}
//新增
