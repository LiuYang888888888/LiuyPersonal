import request from '@/router/axios';
import serviceList from '@/config/serviceList'
import {
  baseURL
} from '@/api/common';

const {
  sync, system
} = serviceList

/*export const syncListPage = (data) => {
	return request({
		url: `${baseURL}api/${sync}/baseSyncConfig/listPage`,
		method: 'post',
		data
	})
}*/

export const syncListPage = (data) => {
  return request({
    url: `${baseURL}api/${system}/baseAppstore/product/list`,
    method: 'post',
    data
  })
}

export const getSyncSet = (data) => {
  return request({
    url: `${baseURL}api/${sync}/baseSyncConfig/getHuilanBaseSyncConfigBySystemCode`,
    method: 'post',
    data
  })
}

export const syncSetUpdate = (type,sdata) => {
  return request({
    url: `${baseURL}api/${sync}/baseSyncConfig/update`,
    method: 'post',
    params:{
      "systemCode":type
    },
    data:sdata
  })
}

export const getSyncDic = (data) => {
  return request({
    url: `${baseURL}api/${system}/baseDict/getDictItemListByDictCode`,
    method: 'post',
    data
  })
}

export const syncFullFun = (params) => {
  return request({
    url: `${baseURL}api/${sync}/baseSync2/syncFull`,
    method: 'post',
    params:{
      ...params
    }
  })
}
