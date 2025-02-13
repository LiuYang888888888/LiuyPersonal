import request from '@/router/axios';
import {
  baseURL
} from '@/api/common';
//查询待审信息
export const getInfoList = () => {
  return request({
    url: `${baseURL}api/aicos-second/zzb/util/getInfo`,
    method: 'post',
  })
}