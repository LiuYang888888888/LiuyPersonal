import request from '@/router/axios';
import {
  baseURL
} from '@/api/common';


export const getMenuList = () => {
  return request({
    url: `${baseURL}api/aicos-second/member/getEnterpriseNameList`,
    method: 'post',
  })
}

export const getUserListPageByParam = (data) => {
  return request({
    url: `${baseURL}api/aicos-second/member/getUserListPageByParam`,
    method: 'post',
    data
  })
}
