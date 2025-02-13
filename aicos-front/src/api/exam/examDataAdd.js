import request from '@/router/axios';
import {
  baseURL
} from '@/api/common';
//调试或整体打包时使用END

import serviceList from '@/config/serviceList';

const {
  exam
} = serviceList

/*根据id获得考试*/
export const getTestById = (data) => {
  return request({
    url: `${baseURL}api/${exam}/examUser/getTestById`,
    method: 'post',
    data
  })
}
// 保存考试
export const saveTest = (data) => {
  return request({
    url: `${baseURL}api/${exam}/examUser/saveTest`,
    method: 'post',
    data
  })
}