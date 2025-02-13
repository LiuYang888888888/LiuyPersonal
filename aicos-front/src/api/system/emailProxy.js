import request from '@/router/axios';
import serviceList from '@/config/serviceList'
import {baseURL} from '@/api/common';

const { message } = serviceList

// 获取消息模板列表
// export const getList = (data) => {
//   return request({
//     url: `${baseURL}api/${message}/baseMessageTemplate/listPageByMessageTemplateParam`,
//     method: 'post',
//     data
//   })
// }

// 保存-更新，更新时候需要id
export const save = (row) => {
  return request({
    url: `${baseURL}api/${message}/mail/saveOrUpdateBaseMailConfig`,
    method: 'post',
    data: row
  })
}

// 获取邮件配置
export const getInfo = () => {
  return request({
    url: `${baseURL}api/${message}/mail/getMailConfig`,
    method: 'post',
    data: {}
  })
}

// 发送邮件,toId可以分号间隔同时发多个人,分号间隔
export const sendMail = (toId) => {
  return request({
    url: `${baseURL}api/${message}/mail/sendMail`,
    method: 'post',
    data: {
      toId
    }
  })
}
// export const update = (row) => {
//   return request({
//     url: `${baseURL}api/${message}/baseMessageTemplate/update`,
//     method: 'post',
//     data: row
//   })
// }

// export const remove = (id) => {
//   return request({
//     url: `${baseURL}api/${message}/baseMessageTemplate/delete`,
//     method: 'post',
//     data: {
//       id,
//     }
//   })
// }
