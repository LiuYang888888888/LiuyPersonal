import request from '@/router/axios';
import serviceList from '@/config/serviceList';
import {
  baseURL
} from '@/api/common';

const {
  exam
} = serviceList
// 列表
export const getList = (data) => {
  return request({
    url: `${baseURL}api/${exam}/examQuestionnaireAdmin/listPage`,
    method: 'post',
    data
  })
}
/*新增*/
export const addList = (data) => {
  return request({
    url: `${baseURL}api/${exam}/examQuestionnaireAdmin/saveQuestionnaireAll`,
    method: 'post',
    data
  })
}

/*编辑*/
export const updateList = (data) => {
  return request({
    url: `${baseURL}api/${exam}/examQuestionnaireAdmin/saveQuestionnaireAll`,
    method: 'post',
    data
  })
}

/*删除*/
export const delList = (data) => {
  return request({
    url: `${baseURL}api/${exam}/examQuestionnaireAdmin/deleteBydId`,
    method: 'post',
    params: {
      ...data
    }
  })
}

/*详情*/
export const detail = (data) => {
  return request({
    url: `${baseURL}api/${exam}/examQuestionnaireAdmin/detail`,
    method: 'post',
    params: {
      ...data
    }
  })
}
/*复制*/
export const copyExamList = (data) => {
  return request({
    url: `${baseURL}api/${exam}/examQuestionnaireAdmin/copy`,
    method: 'post',
    params: {
      ...data
    }
  })
}
//根据多个树分类id查询不同题型的数量
export const getContTypeByCate = (cateIds) => {
  return request({
    url: `${baseURL}api/${exam}/examBankAdmin/contTypeByCate`,
    method: 'get',
    params: {
      ...cateIds
    }
  })
}
// 根据多个树分类id查询题库数据
export const getListByCateIds = (data) => {
  return request({
    url: `${baseURL}api/${exam}/examBankAdmin/listByCateIds`,
    method: 'post',
    data
  })
}
// 系统抽题
export const getRandomTopic = (data) => {
  return request({
    url: `${baseURL}api/${exam}/examBankAdmin/random`,
    method: 'post',
    data
  })
}