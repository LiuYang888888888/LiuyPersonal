import request from '@/router/axios';
import {
  baseURL
} from '@/api/common';
/*服务机构*/
//查询列表
export const getListData = (data) => {
  return request({
    url: `${baseURL}api/aicos-second/member/serviceOrganization/listByPage`,
    method: 'post',
    data
  })
}