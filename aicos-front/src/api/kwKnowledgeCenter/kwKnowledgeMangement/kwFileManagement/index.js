import request from '@/router/axios';
import serviceList from '@/config/serviceList';
import {
  baseURL
} from '@/api/common';

const {knowledge} = serviceList;

//获取文件列表
export const loadFileListUrl = (categyId,current,size,fileType,fileName,robotId) => {
  return request({
    url: `${baseURL}api/${knowledge}/file/querypage`,
    method: 'get',
    params: {
      categyId,
      current,
      size,
      fileType,
      fileName,
      robotId,
      // marks,
      // fileAddress
    }
  })
}
//上传文件
export function getUploadUrl() {
  return `${baseURL}api/${serviceList.file}/miniofile/upload?fromSystemName=base`
}
//下载文件
export function getDownloadUrl() {
  return `${baseURL}api/${serviceList.file}/miniofile/download`
}
//文件校验
export const checkFileType = (data) => {
  return request({
    url: `${baseURL}api/${knowledge}/file/check`,
    method: 'post',
    data,
    headers: {
      "Content-Type": "multipart/form-data"
    },
  })
}
//文件保存
export const addFile = (data) => {
  return request({
    url: `${baseURL}api/${knowledge}/file/save`,
    method: 'post',
    data,
    headers: {
      "Content-Type": "multipart/form-data"
    },
  })
}
//文件修改
export const updataFile = (data) => {
  return request({
    url: `${baseURL}api/${knowledge}/file/update`,
    method: 'post',
    data,
    headers: {
      "Content-Type": "multipart/form-data"
    },
  })
}
//文件删除
export const delFileUrl = (data) => {
  return request({
    url: `${baseURL}api/${knowledge}/file/delBatch`,
    method: 'post',
    data,
    headers:{
      "Content-Type":"application/json"
    },
  })
}