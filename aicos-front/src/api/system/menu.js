import request from '@/router/axios';
import serviceList from '@/config/serviceList'
import {baseURL} from '@/api/common';

const { system, auth } = serviceList

// export const getList = (current, size, params) => {
//   return request({
//     url: '/api/blade-system/menu/list',
//     method: 'get',
//     params: {
//       ...params,
//       current,
//       size,
//     }
//   })
// }

export const getLazyList = (parentId, params) => {
  return request({
    url: `${baseURL}api/${system}/baseMenu/listByParentId`,
    method: 'post',
    data: {
      ...params,
      parentId
    }
  })
}

// export const getLazyMenuList = (parentId, params) => {
//   return request({
//     url: '/api/huilan-auth/baseMenu/listByParentIdAndAuth',
//     method: 'post',
//     data: {
//       ...params,
//       parentId
//     }
//   })
// }

// export const getMenuList = (current, size, params) => {
//   return request({
//     url: '/api/blade-system/menu/menu-list',
//     method: 'get',
//     params: {
//       ...params,
//       current,
//       size,
//     }
//   })
// }

// export const getMenuTree = (tenantId) => {
//   return request({
//     url: '/api/blade-system/menu/tree',
//     method: 'get',
//     params: {
//       tenantId,
//     }
//   })
// }

// export const getMenuLazyTree = (tenantId) => {
//   return request({
//     // url: '/api/huilan-auth/baseMenu/listByParentIdAndAuth',
//     url: '/api/huilan-auth/baseMenu/listByParentId',
//     method: 'post',
//     data: {
//       tenantId,
//     }
//   })
// }

export const remove = (id) => {
  return request({
    url: `${baseURL}api/${system}/baseMenu/delete`,
    method: 'post',
    data: {
      id,
    }
  })
}

export const add = (row) => {
  return request({
    url: `${baseURL}api/${system}/baseMenu/save`,
    method: 'post',
    data: row
  })
}

export const update = (row) => {
  return request({
    url: `${baseURL}api/${system}/baseMenu/update`,
    method: 'post',
    data: row
  })
}

export const getMenu = (id) => {
  return request({
    url: `${baseURL}api/${system}/baseMenu/getBaseMenuByUuid`,
    method: 'post',
    data: {
      id,
    }
  })
}

// export const getTopMenu = () => request({
//   url: '/api/blade-system/menu/top-menu',
//   method: 'get'
// });

// 登录后获取左侧菜单
export const getRoutes = (topMenuId) => request({
  url: `${baseURL}api/${auth}/auth/getMenuTreeByUserAuth`,
  method: 'get',
  params: {
    topMenuId,
  }
});

// 两个菜单交换顺序
export const changeOrder = (fromId, toId) => request({
  url: `${baseURL}api/${system}/baseMenu/changeOrder`,
  method: 'get',
  params: {
    fromId,
    toId
  }
});

// sso跳转时候，需要调的获取各种权限信息的接口
export const legalizeSSOToken = (token) => request({
  url: `${baseURL}api/${auth}/auth/loadMenuTreeByToken`,
  method: 'post',
  params: {
    token
  }
});
