
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
  /*system,*/ qusn
} = serviceList


/*问卷列表*/
export const getQusnList = (data) => {
  return request({
    url: `${baseURL}api/${qusn}/questionAdmin/questionnaire/listByPage`,
    method: 'post',
    data
  })
}

/*问卷列表新增*/
export const addQusnList = (data) => {
  return request({
    url: `${baseURL}api/${qusn}/questionAdmin/questionnaire/save`,
    method: 'post',
    data
  })
}

/*问卷列表编辑*/
export const updateQusnList = (data) => {
  return request({
    url: `${baseURL}api/${qusn}/questionAdmin/questionnaire/update`,
    method: 'post',
    data
  })
}

/*问卷列表发布*/
export const publishQusnList = (data) => {
  return request({
    url: `${baseURL}api/${qusn}/questionAdmin/questionnaire/enablePublishStatus`,
    method: 'post',
    data
  })
}

/*问卷列表启停*/
export const enableQusnList = (data) => {
  return request({
    url: `${baseURL}api/${qusn}/questionAdmin/questionnaire/enableStatus`,
    method: 'post',
    data
  })
}

/*问卷列表复制*/
export const copyQusnList = (data) => {
  return request({
    url: `${baseURL}api/${qusn}/questionAdmin/questionnaire/copy`,
    method: 'post',
    data
  })
}



/*问卷列表删除*/
export const delQusnList = (data) => {
  return request({
    url: `${baseURL}api/${qusn}/questionAdmin/questionnaire/delete`,
    method: 'post',
    data
  })
}

/*获取问卷设置*/
export const detailQusn = (data) => {
  return request({
    url: `${baseURL}api/${qusn}/questionUser/questionnaire/getAllByQuestionnaireId`,
    method: 'post',
    data
  })
}

/*问卷数据保存*/
export const saveQusnData = (data) => {
  return request({
    url: `${baseURL}api/${qusn}/questionUser/saveQuestionnaire`,
    method: 'post',
    data
  })
}

/*问卷浏览次数增加*/
export const browserCountPlusOne = (data) => {
  return request({
    url: `${baseURL}api/${qusn}/questionUser/browserCountPlusOne`,
    method: 'get',
    params: {
      ...data
    }
  })
}

/*问卷使用验证码*/
export const getQusnCaptcha = (data) => {
  return request({
    url: `${baseURL}api/${qusn}/questionUser/captcha`,
    method: 'get',
    params: {
      ...data
    }
  })
}


/*问卷数据统计分析选项*/
export const statisticsItem = (data) => {
  return request({
    url: `${baseURL}api/${qusn}/questionStatistics/statisticsOverview`,
    method: 'post',
    data
  })
}

/*问卷数据统计分析整个问题*/
export const statisticsSubject = (data) => {
  return request({
    url: `${baseURL}api/${qusn}/questionStatistics/statisticsOverview2`,
    method: 'post',
    data
  })
}

/*问卷数据统计获取可填类的答案*/
export const getAnswerTextByPage = (data) => {
  return request({
    url: `${baseURL}api/${qusn}/questionStatistics/getAnswerTextByPage`,
    method: 'post',
    data
  })
}

/*题库列表*/
export const getBankList = (data) => {
  return request({
    url: `${baseURL}api/${qusn}/questionBank/listByPage`,
    method: 'post',
    data
  })
}

/*题库列表新增*/
export const addBankList = (data) => {
  return request({
    url: `${baseURL}api/${qusn}/questionBank/bankSubject/save`,
    method: 'post',
    data
  })
}

/*题库列表批量新增*/
export const addBthBankList = (data) => {
  return request({
    url: `${baseURL}api/${qusn}/questionBank/bankSubject/saveBatch`,
    method: 'post',
    data
  })
}

/*题库列表编辑*/
export const updateBankList = (data) => {
  return request({
    url: `${baseURL}api/${qusn}/questionBank/bankSubject/update`,
    method: 'post',
    data
  })
}

/*题库删除*/
export const delBankList = (data) => {
  return request({
    url: `${baseURL}api/${qusn}/questionBank/bankSubject/deleteBatch`,
    method: 'post',
    data
  })
}

/*题库导出*/
export const outBankList = (data) => {
  return request({
    url: `${baseURL}api/${qusn}/questionBank/exportExcelForBankSubjectByBankSubjectType`,
    method: 'post',
    data
  })
}

/*题库导入分析*/
export const inBankList = (data) => {
  return request({
    url: `${baseURL}api/${qusn}/questionBank/importExcel`,
    method: 'post',
    data
  })
}

/*题库导入*/
export const inFinalBankList = (bankType,data) => {
  return request({
    url: `${baseURL}api/${qusn}/questionBank/finalImportExcel?bankSubjectType=`+bankType,
    method: 'post',
    data
  })
}

/*问卷参与列表*/
export const getStatisticsList = (data) => {
  return request({
    url: `${baseURL}api/${qusn}/questionStatistics/listByPage`,
    method: 'post',
    data
  })
}

/*问卷参与标记无效*/
export const invalidStatisticsList = (data) => {
  return request({
    url: `${baseURL}api/${qusn}/questionStatistics/enableInvalidStatus`,
    method: 'post',
    data
  })
}

/*问卷参与根据设置查找无效样本*/
export const rejectStatisticsList = (data) => {
  return request({
    url: `${baseURL}api/${qusn}/questionStatistics/pickInvalidAnswer`,
    method: 'post',
    data
  })
}

/*问卷参与删除*/
export const delStatisticsList = (data) => {
  return request({
    url: `${baseURL}api/${qusn}/questionStatistics/delete`,
    method: 'post',
    data
  })
}

/*问卷参与导出*/
export const outStatisticsList = (data) => {
  return request({
    url: `${baseURL}api/${qusn}/questionStatistics/exportExcelForAnswerQuestionnaire`,
    method: 'post',
    data
  })
}

/*问卷参与问答类审核*/
export const answerTextStatus = (data) => {
  return request({
    url: `${baseURL}api/${qusn}/questionStatistics/enableAuditStatus2`,
    method: 'post',
    data
  })
}

/*问卷参与问答类删除*/
export const answerTextDel = (data) => {
  return request({
    url: `${baseURL}api/${qusn}/questionStatistics/auditStatusDelete2`,
    method: 'post',
    data
  })
}

/*问卷参与问答类导出*/
export const answerTextOut = (data) => {
  return request({
    url: `${baseURL}api/${qusn}/questionStatistics/exportExcelForAnswerText`,
    method: 'post',
    data
  })
}


