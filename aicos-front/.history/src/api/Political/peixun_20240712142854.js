import request from '@/router/axios';
import {
  baseURL
} from '@/api/common';
/*培训通知*/
//列表查询
export const getList = (data) => {
  return request({
    url: `${baseURL}api//aicos-second/zzb/trainNotice/listPage`,
    method: 'post',
    data
  })
}