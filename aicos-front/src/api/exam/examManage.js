
//单独打包时使用
// import Vue from 'vue';
// const request = Vue.axios;
// import request from '@/utils/request.js'; //根据需要目标工程的设置 引入axios request
// const baseURL = process.env.BASE_URL;
//单独打包时使用END

//调试或整体打包时使用
import request from '@/router/axios';
import {
  baseURL
} from '@/api/common';
//调试或整体打包时使用END

import serviceList from '@/config/serviceList';

const {
  /*system,*/ exam
} = serviceList


/*考试管理列表*/
export const getExamList = (data) => {
  return request({
    url: `${baseURL}api/${exam}/examTestAdmin/listPage`,
    method: 'post',
    data
  })
}

/*考试管理列表新增*/
export const addExamList = (data) => {
  return request({
    url: `${baseURL}api/${exam}/examTestAdmin/addOrUpdate`,
    method: 'post',
    data
  })
}

/*考试管理列表编辑*/
export const updateExamList = (data) => {
  return request({
    url: `${baseURL}api/${exam}/examTestAdmin/addOrUpdate`,
    method: 'post',
    data
  })
}

/*考试管理列表发布*/
export const publishExamList = (data) => {
  return request({
    url: `${baseURL}api/${exam}/examTestAdmin/publishStatus`,
    method: 'post',
    data
  })
}

/*考试管理列表删除*/
export const delExamList = (data) => {
  return request({
    url: `${baseURL}api/${exam}/examTestAdmin/delete`,
    method: 'post',
    params: {
      ...data
    }
  })
}
// 考试详情接口
export const detailExam = (data) => {
  return request({
    url: `${baseURL}api/${exam}/examTestAdmin/detail`,
    method: 'get',
    params: {
      ...data
    }
  })
}
// 统计分析
export const getStatistic = (data) => {
  return request({
    url: `${baseURL}api/${exam}/examStatistics/score`,
    method: 'get',
    params: {
      ...data
    }
  })
}
// 客观题分析
export const subjectStatistic = (data) => {
  return request({
    url: `${baseURL}api/${exam}/examStatistics/subject`,
    method: 'get',
    params: {
      ...data
    }
  })
}
// 题目分析
export const rankByScoreStatistic = (data) => {
  return request({
    url: `${baseURL}api/${exam}/examStatistics/rankByScore`,
    method: 'get',
    params: {
      ...data
    }
  })
}
// 选择试卷
export const listBoundPage = (data) => {
  return request({
    url: `${baseURL}api/${exam}/examQuestionnaireAdmin/listBoundPage`,
    method: 'post',
    data
  })
}
