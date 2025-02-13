import request from '@/router/axios';
import serviceList from '@/config/serviceList'
import {baseURL} from '@/api/common';

const { ai } = serviceList

// 关键词提取
export const extractKeywordsFromTxt = (data) => {
  return request({
    url: `${baseURL}api/${ai}/ai/run`,
    method: 'post',
    data: {...data}
  })
}
export const asrForUploadFileWithHuilan = (data) => {
  return request({
    url: `${baseURL}api/${ai}/ai/asrForUploadFileWithHuilan`,
    method: 'post',
    responseType:"blob",
    data: {...data}
  })
}
