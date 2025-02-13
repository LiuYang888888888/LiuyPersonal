import request from '@/router/axios';
import serviceList from '@/config/serviceList'
import {baseURL} from '@/api/common';

const { message } = serviceList

//我的已发消息，分页
export const getListPageByMessageArchiveParam = (data) => {
  return request({
    url: `${baseURL}api/${message}/baseMessageArchive/listPageByMessageArchiveParam`,
    method: 'post',
    data
  })
}

//重发，传id
export const reSendMessage = (id) => {
  return request({
    url: `${baseURL}api/${message}/baseMessageArchive/reSendMessage`,
    method: 'post',
    data: {
      id
    }
  })
}
