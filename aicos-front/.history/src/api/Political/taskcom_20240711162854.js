import request from '@/router/axios';
import {
  baseURL
} from '@/api/common';
/*通知下发*/
export const getList = (data) => {
  return request({
    url: `${baseURL}api/aicos-second/zzb/taskManageNotice/listPage`,
    method: 'post',
    data
  })
}