import request from '@/router/axios';
import serviceList from '@/config/serviceList'
import {baseURL} from '@/api/common';

const { ai } = serviceList

export const getList = (data) => {
  return request({
    url: `${baseURL}api/${ai}/aiNlpEntity/getAllNlpEntityList`,
    method: 'post',
    data
  })
}

export const remove = (id) => {
  return request({
    url: `${baseURL}api/${ai}/aiNlpEntity/delete`,
    method: 'post',
    data: {
      id,
    }
  })
}

export const add = (row) => {
  return request({
    url: `${baseURL}api/${ai}/aiNlpEntity/save`,
    method: 'post',
    data: row
  })
}

export const update = (row) => {
  return request({
    url: `${baseURL}api/${ai}/aiNlpEntity/update`,
    method: 'post',
    data: row
  })
}

// 按entityId获得所有词,分页,可传excluded,wordType
export const getEntityInstanceList = (data) => {
  return request({
    url: `${baseURL}api/${ai}/aiNlpEntity/getAiNlpEntityWordListByEntityId`,
    method: 'post',
    data
  })
}

export const removeEntityInstance = (id) => {
  return request({
    url: `${baseURL}api/${ai}/aiNlpEntityWord/delete`,
    method: 'post',
    data: {
      id,
    }
  })
}
export const removeEntityInstanceBatch = (id) => {
  return request({
    url: `${baseURL}api/${ai}/aiNlpEntityWord/deleteBatch`,
    method: 'post',
    data: {
      id,
    }
  })
}

export const addEntityInstance = (row) => {
  return request({
    url: `${baseURL}api/${ai}/aiNlpEntityWord/save`,
    method: 'post',
    data: row
  })
}

export const updateEntityInstance = (row) => {
  return request({
    url: `${baseURL}api/${ai}/aiNlpEntityWord/update`,
    method: 'post',
    data: row
  })
}
