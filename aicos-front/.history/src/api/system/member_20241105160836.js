import request from "@/router/axios";
import {baseURL} from "@/api/common";

export const getList = (params, current, size) => {
  return request({
    url: `${baseURL}api/aicos-second/member/getMemberListPageByParam`,
    method: 'post',
    data: {
      ...params,
      current,
      size,
    }
  })
}

export const addMemberInfo = (row) => {
  return request({
    url: `${baseURL}api/aicos-second/member/add`,
    method: 'post',
    data: row
  })
}

export const updateMemberInfo = (row) => {
  return request({
    url: `${baseURL}api/aicos-second/member/updateMemberInfo`,
    method: 'post',
    data: row
  })
}

export const complete = (data) => {
  return request({
    url: `${baseURL}api/aicos-second/member/memberComplete`,
    method: 'post',
    data: data
  })
}


export const disagree = (data) => {
  return request({
    url: `${baseURL}api/aicos-second/member/memberComplete`,
    method: 'post',
    data: data
  })
}
