import request from '@/router/axios';
import serviceList from '@/config/serviceList'
import {baseURL} from '@/api/common';

const { system, auth } = serviceList

export const getUserInfoPost = (data) => request({
  url: `${baseURL}api/aicos-second/member/get`,
  method: 'post',
  data:data
});

export const getList = (current, size, params, deptId) => {
  return request({
    url: `${baseURL}api/${system}/baseUser/getUserListPageByParam`,
    method: 'post',
    data: {
      ...params,
      current,
      size,
      deptId,
    }
  })
}

export const remove = (id) => {
  return request({
    url: `${baseURL}api/aicos-second/member/delete`,
    method: 'post',
    data: {
      id,
    }
  })
}

export const add = (row) => {
  return request({
    url: `${baseURL}api/${system}/baseUser/save`,
    method: 'post',
    data: row
  })
}

export const update = (row) => {
  return request({
    url: `${baseURL}api/${system}/baseUser/update`,
    method: 'post',
    data: row
  })
}

// export const updatePlatform = (userId, userType, userExt) => {
//   return request({
//     url: '/api/blade-user/update-platform',
//     method: 'post',
//     params: {
//       userId,
//       userType,
//       userExt,
//     }
//   })
// }

export const getUser = (id) => {
  return request({
    url: `${baseURL}api/${system}/baseUser/getBaseUserByUuid`,
    method: 'post',
    data: {
      id,
    }
  })
}
// 获取用户所有信息
export const getUserAllInfo = (id) => {
  return request({
    url: `${baseURL}api/${system}/baseUser/getBaseUserFullByUuid`,
    method: 'post',
    data: {
      id,
    }
  })
}

// export const getUserPlatform = (id) => {
//   return request({
//     url: '/api/blade-user/platform-detail',
//     method: 'get',
//     params: {
//       id,
//     }
//   })
// }

export const getUserInfo = () => {
  return request({
    url: `${baseURL}api/${auth}/auth/getUserInfo`,
    method: 'get',
  })
}

// export const resetPassword = (userIds) => {
//   return request({
//     url: '/api/blade-user/reset-password',
//     method: 'post',
//     params: {
//       userIds,
//     }
//   })
// }

export const updatePassword = (account, oldPassword, newPassword) => {
  return request({
    url: `${baseURL}api/${system}/baseUser/updatePassword`,
    method: 'post',
    data: {
      account,
      oldPassword,
      newPassword
    }
  })
}

// export const updateInfo = (row) => {
//   return request({
//     url: '/api/blade-user/update-info',
//     method: 'post',
//     data: row
//   })
// }

// export const grant = (userIds, roleIds) => {
//   return request({
//     url: '/api/blade-user/grant',
//     method: 'post',
//     params: {
//       userIds,
//       roleIds,
//     }
//   })
// }

// 通用的选择用户界面的筛选数据的接口
export const getUserList = (data) => {
  return request({
    url: `${baseURL}api/${system}/baseUser/getUserListPageByParam`,
    method: 'post',
    data
  })
}


// 停用|启用用户
export const enableStatus = (data) => {
  return request({
    url: `${baseURL}api/${system}/baseUser/enableStatus`,
    method: 'post',
    data
  })
}

// 锁定|解锁用户
export const lockStatus = (data) => {
  return request({
    url: `${baseURL}api/${system}/baseUser/enableLock`,
    method: 'post',
    data
  })
}
// 重置密码,newpassword传明文,传account
export const resetPassword = (data) => {
  return request({
    url: `${baseURL}api/${system}/baseUser/resetPassword`,
    method: 'post',
    data
  })
}

//按account查看用户
export const getBaseUserByAccount = (data) => {
  return request({
    url: `${baseURL}api/${system}/baseUser/getBaseUserByAccount`,
    method: 'post',
    data
  })
}
// 批量删除
export const deleteBatch = (id) => {
  return request({
    url: `${baseURL}api/${system}/baseUser/deleteBatch`,
    method: 'post',
    data:{
      id
    }
  })
}

export const getEnterpriseNameListByQuery = (param) => {
  return request({
    url: `${baseURL}api/aicos-second/member/getEnterpriseNameListByQuery`,
    method: 'post',
    headers:{'Content-Type':'application/x-www-form-urlencoded'},
    data:param,
  })
}
