import request from '@/router/axios';
import serviceList from '@/config/serviceList'
import {baseURL} from '@/api/common';

const { system } = serviceList

export const getLazyList = (parentId, params) => {
  return request({
    url: `${baseURL}api/${system}/baseDept/listPageByParentId`,
    method: 'post',
    data: {
      ...params,
      parentId
    }
  })
}

export const remove = (id) => {
  return request({
    url: `${baseURL}api/${system}/baseDept/delete`,
    method: 'post',
    data: {
      id,
    }
  })
}

export const add = (row) => {
  return request({
    url: `${baseURL}api/${system}/baseDept/save`,
    method: 'post',
    data: row
  })
}

export const update = (row) => {
  return request({
    url: `${baseURL}api/${system}/baseDept/update`,
    method: 'post',
    data: row
  })
}


export const getDeptLazyTree = (parentId) => {
  return request({
    url: `${baseURL}api/${system}/baseDept/listByParentId`,
    method: 'post',
    data: {
      parentId
    }
  })
}

// 获取可以被管理的树
export const getCanBeManagerDeptLazyTree = (parentId,deptName) => {
  return request({
    url: `${baseURL}api/${system}/baseDept/getCanBeManagerDeptlistByParentId`,
    method: 'post',
    data: {
      parentId,
      deptName
    }
  })
}


// 按部门uuid获得部门(不含子部门)下面的所有用户
export const getDeptUserList = (deptId) => {
  return request({
    url: `${baseURL}api/${system}/baseDept/getUserListByDeptUuid`,
    method: 'post',
    data: {
      deptId
    }
  })
}


export const saveDeptUser = (data) => {
  return request({
    url: `${baseURL}api/${system}/baseDept/saveUserInDept`,
    method: 'post',
    data
  })
}

// 获取下拉树的树选中节点的数据
// export const getPartOfDeptTree = (data) => {
//   return request({
//     url: '/api/aiworkorder-system/baseDept/getPartOfDeptTree',
//     method: 'post',
//     data
//   })
// }

// 批量删除
export const deleteBatch = (id) => {
  return request({
    url: `${baseURL}api/${system}/baseDept/deleteBatch`,
    method: 'post',
    data:{
      id
    }
  })
}