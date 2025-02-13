import request from '@/router/axios';
import serviceList from '@/config/serviceList'
import {baseURL} from '@/api/common';

const { log } = serviceList

export const getList = (data) => {
  return request({
    url: `${baseURL}api/${log}/baseOperationLog/listPageByOperationLogParam`,
    method: 'post',
    data
  })
}


//日志导出
export const exportExcel = (data) => {
  return request({
    url: `${baseURL}api/${log}/baseOperationLog/exportExcel`,
    method: 'post',
    data,
    //responseType:"blob",
  })
}
