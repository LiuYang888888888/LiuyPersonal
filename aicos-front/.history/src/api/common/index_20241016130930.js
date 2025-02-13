import request from '@/router/axios';
// import website from "@/config/website";
import serviceList from '@/config/serviceList'

const { file, system } = serviceList
export const baseURL = process.env.BASE_URL

export function getUploadUrl(systemName = 'base') {
  return `${baseURL}api/${file}/miniofile/upload?fromSystemName=${systemName}`
}

export function getImageUploadAndCreateThumbUrl(systemName = 'base') {
  return `${baseURL}api/${file}/miniofile/uploadImageAndCreateThumbWithoutAsync?fromSystemName=${systemName}`
}

// 通用的获取数据字典的地址
export const getDictItemListByDictCodeURL = `${baseURL}api/${system}/baseDict/getDictItemListByDictCode`

//通用通过数据id获取流程id
export const importExcel = (data) => {
  return request({
    url: `${baseURL}api/aicos-second/zzb/util/getCurrentProcess`,
    method: 'post',
    data:data
  })
}
