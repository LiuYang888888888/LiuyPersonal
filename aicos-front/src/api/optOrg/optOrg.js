//单独打包时使用
// import Vue from 'vue';
// const request = Vue.axios;
// import request from '@/utils/request.js'; //根据需要目标工程的设置 引入axios request
// const baseURL = process.env.BASE_URL;
//单独打包时使用END

// 调试或整体打包时使用
import request from '@/router/axios';
import {
  baseURL
} from '@/api/common';
// 调试或整体打包时使用END

import serviceList from '@/config/serviceList';

const {
  system
} = serviceList

/*角色列表*/
export const getRolesList = (data) => {
  return request({
    url: `${baseURL}api/${system}/baseRole/listByPage`,
    method: 'post',
    data
  })
}

/*用户列表*/
export const getUserList = (data) => {
  return request({
    url: `${baseURL}api/${system}/baseUser/getUserListPageByParam`,
    method: 'post',
    data
  })
}

/*部门树*/
export const getDeptTree = (data) => {
  return request({
    url: `${baseURL}api/${system}/baseDept/getCanBeManagerDeptlistByParentId`,
    method: 'post',
    data
  })
}

/*部门信息*/
export const getDeptInfo = (data) => {
  return request({
    url: `${baseURL}api/${system}/baseDept/getBaseDeptByUuid`,
    method: 'post',
    data
  })
}


//测试发送AjAX
export const testList = (params,data/*,headData*/) => {
  return request({
    url: `${baseURL}api/${system}/baseAppstore/product/list`,
    method: 'post',
    params: {
      ...params,
    },
    data,
    /*headers: headData,*/
  })
}



