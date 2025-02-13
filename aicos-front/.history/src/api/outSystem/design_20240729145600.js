import request from '@/router/axios';
import {
  baseURL
} from '@/api/common';
//问卷设计模板列表查询
export const shejiList = (current, size, params) => {
  return request({
    url: `${baseURL}api/aicos-second/questionnaire/list`,
    method: 'get',
    params: {
      ...params,
      current,
      size,
    }
  })
}
//修改问卷状态
export const editStatus = (row) => {
  return request({
    url: `${baseURL}api/aicos-second/questionnaire/update`,
    method: 'post',
    data: row
  })
}
//复制问卷
export const copyQuestion = (id) => {
  return request({
    url: `${baseURL}api/aicos-second/questionnaire/copyAllQuestions`,
    method: 'post',
    params: {
      id
    }
  })
}
//问卷统计
export const getQuestionStatistics = (id) => {
  return request({
    url: `${baseURL}api/aicos-second/userQuestion/dataCount`,
    method: 'get',
    params: {
      id
    }
  })
}
//问答结果导出
export const exportQuestion = (qid) => {
  return request({
    url: `${baseURL}api/aicos-second/userQuestion/answerDataCount`,
    method: 'get',
    responseType: 'blob',
    params: {
      qid
    }
  })
}
//问卷设计模板新增
export const questionList = (projectManage) => {
  return request({
    url: `${baseURL}api/aicos-second/questionnaire/saveAllQuestions`,
    method: 'post',
    data: projectManage
  })
}

//查看问卷设计
export const getQuestion = (id) => {
  return request({
    url: `${baseURL}api/aicos-second/questionnaire/queryAllQuestions`,
    method: 'post',
    params: {
      id
    }
  })
}


//调查问卷问题删除
export const delQuestion = (ids) => {
  return request({
    url: `${baseURL}api/aicos-second/questions/delete`,
    method: 'post',
    params: {
      ids
    }
  })
}
//问卷设计删除问题选项
export const delOption = (ids) => {
  return request({
    url: `${baseURL}api/aicos-second/questionOption/delete`,
    method: 'post',
    params: {
      id
    }
  })
}