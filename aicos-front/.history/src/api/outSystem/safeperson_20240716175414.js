import request from '@/router/axios';
import {
  baseURL
} from '@/api/common';
/*安全管理人员考核*/
//查询列表
export const getListData = (data) => {
  return request({
    url: `${baseURL}api/aicos-second/member/serviceOrganization/listByPage`,
    method: 'post',
    data
  })
}