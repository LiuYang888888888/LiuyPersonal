import request from '@/router/axios';
import {
  baseURL
} from '@/api/common';
/* */
export const getList = (data) => {
  return request({
    url: `${baseURL}api/aicos-second/zzb/taskManageNotice/listPage`,
    method: 'post',
    data
  })
}