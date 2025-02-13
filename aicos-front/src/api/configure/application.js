import request from '@/router/axios';
import serviceList from '@/config/serviceList'
import { baseURL } from '@/api/common';

const { ai, system } = serviceList

// 热词查询
export const getHotWordList = (data) => {
  return request({
    url: `${baseURL}api/${ai}/aiAbility/select/hotWord`,
    method: 'get',
    params: { ...data }
  })
}
// 热词保存
export const saveHotWord = (data) => {
  return request({
    url: `${baseURL}api/${ai}/aiAbility/update/hotWord`,
    method: 'post',
    data
  })
}
// 热词导入

// 获取参数配置默认数据
export const getAiAbilityConfig = (data) => {
  return request({
    url: `${baseURL}api/${ai}/aiAbility/select/constant`,
    method: 'get',
    params:{...data}
  })
}
// 保存参数配置
export const saveAiAbilityConfig = (data) => {
  return request({
    url: `${baseURL}api/${ai}/aiAbility/update/constant`,
    method: 'post',
    data
  })
}
// 参数配置恢复默认值
export const resetAiAbilityConfig = (data) => {
  return request({
    url: `${baseURL}api/${ai}/aiAbility/reset/constant`,
    method: 'post',
    data
  })
}
// export const getList = (current, size, params) => {
//   return request({
//     url: '/api/blade-system/region/list',
//     method: 'get',
//     params: {
//       ...params,
//       current,
//       size,
//     }
//   })
// }
//
// export const getLazyTree = (parentCode, params) => {
//   return request({
//     url: '/api/blade-system/region/lazy-tree',
//     method: 'get',
//     params: {
//       ...params,
//       parentCode
//     }
//   })
// }

// export const getDetail = (code) => {
//   return request({
//     url: '/api/blade-system/region/detail',
//     method: 'get',
//     params: {
//       code
//     }
//   })
// }
//
// export const remove = (id) => {
//   return request({
//     url: '/api/blade-system/region/remove',
//     method: 'post',
//     params: {
//       id,
//     }
//   })
// }
// 应用管理左侧树结构数据
export const applicationGetAiApplicationBusinesstypeListByParentId = (data) => {
  return request({
    url: `${baseURL}api/${ai}/aiApplicationBusinesstype/getAiApplicationBusinesstypeListByParentId`,
    method: 'post',
    data: { ...data }
  })
}
// 应用管理左侧树新增
export const applicationsaveTreeSave = (data) => {
  return request({
    url: `${baseURL}api/${ai}/aiApplicationBusinesstype/save`,
    method: 'post',
    data: { ...data }
  })
}
// 应用管理左侧树编辑
export const applicationsaveTreeUpdate = (data) => {
  return request({
    url: `${baseURL}api/${ai}/aiApplicationBusinesstype/update`,
    method: 'post',
    data: { ...data }
  })
}
// 应用管理左侧树删除
export const applicationsaveTreeDelete = (data) => {
  return request({
    url: `${baseURL}api/${ai}/aiApplicationBusinesstype/delete`,
    method: 'post',
    data: { ...data }
  })
}
// 应用管理分页列表（组件专有）
export const applicationListByPage = (data) => {
  return request({
    url: `${baseURL}api/${ai}/aiApplication/listByPageForChooseApplication`,
    method: 'post',
    data: { ...data }
  })
}
// 应用管理分页列表
export const applicationByPage = (data) => {
  return request({
    url: `${baseURL}api/${ai}/aiApplication/listByPage`,
    method: 'post',
    data: { ...data }
  })
}
// 应用管理新增
export const applicationSave = (data) => {
  return request({
    url: `${baseURL}api/${ai}/aiApplication/save`,
    method: 'post',
    data: { ...data }
  })
}
// 应用管理编辑
export const applicationUpdate = (data) => {
  return request({
    url: `${baseURL}api/${ai}/aiApplication/update`,
    method: 'post',
    data: { ...data }
  })
}
// 应用管理删除
export const applicationDelete = (id) => {
  return request({
    url: `${baseURL}api/${ai}/aiApplication/delete`,
    method: 'post',
    data: { ...id }
  })
}
// 应用管理-查询当前应用下服务列表
export const applicationGetApplicationServiceRelationListByApplicationId = (data) => {
  return request({
    url: `${baseURL}api/${ai}/aiApplicationServiceRelation/getApplicationServiceRelationListByApplicationId`,
    method: 'post',
    data: { ...data }
  })
}
// 应用管理-向应用添加服务
export const saveHuilanAiApplicationServiceRelationByApplicationId = (data) => {
  return request({
    url: `${baseURL}api/${ai}/aiApplicationServiceRelation/saveHuilanAiApplicationServiceRelationByApplicationId`,
    method: 'post',
    data: { ...data }
  })
}
// 应用管理-应用分类
export const getDictItemListByDictCode = (data) => {
  return request({
    url: `${baseURL}api/${system}/baseDict/getDictItemListByDictCode`,
    method: 'post',
    data: { ...data }
  })
}
// 应用管理-根据应用id查详情
export const getAiApplicationById = (data) => {
  return request({
    url: `${baseURL}api/${ai}/aiApplication/getAiApplicationById`,
    method: 'post',
    data: { ...data }
  })
}
// 应用管理-根据应用的id查询当前应用下的所有能力
export const getHuilanAiApplicationAbilityRelationByApplicationId = (data) => {
  return request({
    url: `${baseURL}api/${ai}/aiApplication/getHuilanAiApplicationAbilityRelationByApplicationId`,
    method: 'post',
    data: { ...data }
  })
}

// 服务管理分页列表
export const serviceListByPage = (data) => {
  return request({
    url: `${baseURL}api/${ai}/aiService/listByPage`,
    method: 'post',
    data: { ...data }
  })
}
// 服务管理添加服务
export const serviceSave = (data) => {
  return request({
    url: `${baseURL}api/${ai}/aiService/save`,
    method: 'post',
    data: { ...data }
  })
}
// 服务管理编辑服务
export const serviceUpdate = (data) => {
  return request({
    url: `${baseURL}api/${ai}/aiService/update`,
    method: 'post',
    data: { ...data }
  })
}
// 服务管理删除
export const serviceDelete = (id) => {
  return request({
    url: `${baseURL}api/${ai}/aiService/delete`,
    method: 'post',
    data: { ...id }
  })
}
// 根据服务id获取能力详情
export const getAiServiceById = (id) => {
  return request({
    url: `${baseURL}api/${ai}/aiService/getAiServiceById`,
    method: 'post',
    data: { ...id }
  })
}
// 能力维护列表
export const aiAbilityListByPage = (data) => {
  return request({
    url: `${baseURL}api/${ai}/aiAbility/listByPage`,
    method: 'post',
    data: { ...data }
  })
}
// 能力维护新增
export const aiAbilitySave = (data) => {
  return request({
    url: `${baseURL}api/${ai}/aiAbility/save`,
    method: 'post',
    data: { ...data }
  })
}
// 能力维护编辑
export const abilityUpdate = (data) => {
  return request({
    url: `${baseURL}api/${ai}/aiAbility/update`,
    method: 'post',
    data: { ...data }
  })
}
// 能力维护删除
export const abilityDelete = (id) => {
  return request({
    url: `${baseURL}api/${ai}/aiAbility/delete`,
    method: 'post',
    data: { ...id }
  })
}
// 能力列表（非分页）
export const getAllAiAbilityList = (id) => {
  return request({
    url: `${baseURL}api/${ai}/aiAbility/getAllAiAbilityList`,
    method: 'post',
    data: { ...id }
  })
}
// 服务状态启停
export const serviceEnableStatus = (data) => {
  return request({
    url: `${baseURL}api/${ai}/aiService/enableStatus`,
    method: 'post',
    data: { ...data }
  })
}
// 根据应用id查询服务数量
export const getServiceNumberByApplicationId = (id) => {
  return request({
    url: `${baseURL}api/${ai}/aiApplication/getServiceNumberByApplicationId`,
    method: 'post',
    data: { ...id }
  })
}
// 根据能力id查询服务的场景
export const getHuilanAiServiceByAbilityId = (id) => {
  return request({
    url: `${baseURL}api/${ai}/aiAbility/getHuilanAiServiceByAbilityId`,
    method: 'post',
    data: { ...id }
  })
}
// 根据能力分类查询能力列表
export const getHuilanAiServiceByCategory = (id) => {
  return request({
    url: `${baseURL}api/${ai}/aiAbility/getHuilanAiServiceByCategory`,
    method: 'post',
    data: { ...id }
  })
}
// 根据能力id获得服务场景数量
export const getServiceNumberByAbilityId = (id) => {
  return request({
    url: `${baseURL}api/${ai}/aiAbility/getServiceNumberByAbilityId`,
    method: 'post',
    data: { ...id }
  })
}
// 根据能力id获取详情
export const getAiAbilityById = (id) => {
  return request({
    url: `${baseURL}api/${ai}/aiAbility/getAiAbilityById`,
    method: 'post',
    data: { ...id }
  })
}
