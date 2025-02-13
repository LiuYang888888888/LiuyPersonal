import request from '@/router/axios';
import serviceList from '@/config/serviceList';
import {
  baseURL,
} from '@/api/common';

const {kwRobot} = serviceList;

// 获取问法列表
export const getSceneList = (data) => {
  return request({
    url: `${baseURL}api/${kwRobot}/sceneStrategy/sceneList`,
    method: 'post',
    data 
  })
}

// 新增编辑问法
export const saveOrUpdateScene = (data) => {
  return request({
    url: `${baseURL}api/${kwRobot}/sceneStrategy/saveOrUpdateScene`,
    method: 'post',
    data
  })
}

// 删除问法
export const delScene = (data) => {
  return request({
    url: `${baseURL}api/${kwRobot}/sceneStrategy/delete`,
    method: 'post',
    data
  })
}

// 获取自动方法数据
export const getAutoStrategy = (data) => {
  return request({
    url: `${baseURL}api/${kwRobot}/sceneStrategy/getAutoStrategy`,
    method: 'post',
    data
  })
}
