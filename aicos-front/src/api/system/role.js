import request from '@/router/axios';
import serviceList from '@/config/serviceList'
import {baseURL} from '@/api/common';

const { system, ai } = serviceList

export const getList = (current, size, params) => {
  return request({
    url: `${baseURL}api/${system}/baseRole/listByPage`,
    method: 'post',
    data: {
      ...params,
      current,
      size,
    }
  })
}
// 获得能设置权限的菜单和功能项
export const grantTree = () => {
  return request({
    url: `${baseURL}api/${system}/baseRole/getCanBeSettingMenuTreeAndResource`,
    method: 'get',
  })
}

// 保存设置的权限，roleId为单值，menuIds和resourceIds为多值，逗号分隔
export const grant = (data) => {
  return request({
    url: `${baseURL}api/${system}/baseRole/saveAuth`,
    method: 'post',
    data
  })
}

// 获得当前已有的权限(功能项)
export const getSelectedResource = (roleId) => {
  return request({
    url: `${baseURL}api/${system}/baseRole/getResourceListByRoleId`,
    method: 'get',
    params: {
      roleId
    }
  })
}
// 获得当前已有的权限(菜单)
export const getSelectedMenu = (roleId) => {
  return request({
    url: `${baseURL}api/${system}/baseRole/getMenuListByRoleId`,
    method: 'get',
    params: {
      roleId
    }
  })
}

// 按角色uuid获得角色下面的所有用户
export const getSelectedUser = (roleId) => {
  return request({
    url: `${baseURL}api/${system}/baseRole/getUserListByRoleUuid`,
    method: 'get',
    params: {
      roleId
    }
  })
}



export const remove = (id) => {
  return request({
    url: `${baseURL}api/${system}/baseRole/delete`,
    method: 'post',
    data: {
      id,
    }
  })
}

export const add = (row) => {
  return request({
    url: `${baseURL}api/${system}/baseRole/save`,
    method: 'post',
    data: row
  })
}

export const update = (row) => {
  return request({
    url: `${baseURL}api/${system}/baseRole/update`,
    method: 'post',
    data: row
  })
}


// export const getRole = (roleIds) => {
//   return request({
//     url: '/api/blade-system/menu/role-tree-keys',
//     method: 'get',
//     params: {
//       roleIds,
//     }
//   })
// }
//
// export const getRoleTree = (tenantId) => {
//   return request({
//     url: '/api/blade-system/role/tree',
//     method: 'get',
//     params: {
//       tenantId,
//     }
//   })
// }
//
// export const getRoleTreeById = (roleId) => {
//   return request({
//     url: '/api/blade-system/role/tree-by-id',
//     method: 'get',
//     params: {
//       roleId,
//     }
//   })
// }

// 保存角色里面的user，roleId为单值，userIds为多值，逗号分隔
export const saveRoleUser = (data) => {
  return request({
    url: `${baseURL}api/${system}/baseRole/saveUserInRole`,
    method: 'post',
    data
  })
}

// 根据roleId获取所有部门，传id
export const getDeptByRoleId = (id) => {
  return request({
    url: `${baseURL}api/${system}/baseRoleDeptRelation/getDeptByRoleId`,
    method: 'post',
    data:{
      id
    }
  })
}

// 保存关系，roleId，List&lt;id&gt;
export const saveRoleDeptRelation = ({roleId, list}) => {
  return request({
    url: `${baseURL}api/${system}/baseRoleDeptRelation/saveRoleDeptRelation?roleId=${roleId}`,
    method: 'post',
    data: list
  })
}

export const getUserListPageByAuth = ({roleId, ...data}) => {
  return request({
    url: `${baseURL}api/${system}/baseRoleDeptRelation/getUserListPageByAuth?roleId=${roleId}`,
    method: 'post',
    data
  })
}

export const getUserListPageByAuthSecond = ({roleId, ...data}) => {
  return request({
    url: `${baseURL}api/aicos-second/member/getUserListPageByAuth?roleId=${roleId}`,
    method: 'post',
    data
  })
}

// 保存关系，roleId，List&lt;id&gt;
export const saveAiApplicationInRole = (data) => {
  return request({
    url: `${baseURL}api/${system}/baseRole/saveApplicationInRole`,
    method: 'post',
    data
  })
}
// 授权功能：获得已经设置的应用,在角色设置里，传roleId
export const getSelectedAiApplication = (roleId) => {
  return request({
    url: `${baseURL}api/${ai}/aiApplication/getApplicationInRoleByRoleId`,
    method: 'post',
    data:{
      roleId
    }
  })
}

// 获取需要集成进来的角色授权组件
export const getOtherRoleAuthComponent = (data) => {
  return request({
    url: `${baseURL}api/${system}/baseAppstore/product/listAll`,
    method: 'post',
    data
  })
}

// 数据大屏可管理数据
export const categoryList = (roleId) => {
  return request({
    url: `${baseURL}api/${system}/baseRole/categoryList`,
    method: 'get',
    params:{
      roleId
    }
  })
}
// 保存数据大屏可管理数据
export const saveCategory = (data) => {
  return request({
    url: `${baseURL}api/${system}/baseRole/category/role`,
    method: 'post',
    data
  })
}
