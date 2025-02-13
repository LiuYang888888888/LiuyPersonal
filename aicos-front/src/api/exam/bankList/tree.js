import request from '@/router/axios';
import serviceList from '@/config/serviceList';
import {
  baseURL
} from '@/api/common';

const {
  exam
} = serviceList


/*树接口*/
export const getTreeData = (data) => {
  return request({
    url: `${baseURL}api/${exam}/exam/bankSubjectCategory/getFullTree`,
    method: 'post',
    data
  })
}

export const saveTreeData = (data) => {
  return request({
    url: `${baseURL}api/${exam}/exam/bankSubjectCategory/save`,
    method: 'post',
    data
  })
}

export const updateTreeData = (data) => {
  return request({
    url: `${baseURL}api/${exam}/exam/bankSubjectCategory/update`,
    method: 'post',
    data
  })
}

export const deleteTreeData = (data) => {
  return request({
    url: `${baseURL}api/${exam}/exam/bankSubjectCategory/delete`,
    method: 'post',
    data
  })
}