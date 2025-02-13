import request from '@/router/axios';
import serviceList from '@/config/serviceList'
import {
  baseURL
} from '@/api/common';

const {
  form,system,flow
} = serviceList

//通用通过数据id获取流程id
export const getProcess = (data) => {
  return request({
    url: `${baseURL}api/aicos-second/zzb/util/getCurrentProcess`,
    method: 'post',
    data:id
  })
}

//表单模板接口
export const getFromTemplate = (data) => {
  return request({
    url: `${baseURL}api/${form}/baseFormSubmission/getTemplateVersion`,
    method: 'post',
    data
  })
}
//表单最新的模板接口
export const getFromTemplateNewest = (data) => {
  return request({
    url: `${baseURL}api/${form}/baseFormTemplateVersion/getLatestTemplateVersion`,
    method: 'post',
    data
  })
}

//手机短信验证
export const sendPhoneCode = (data) => {
  return request({
    url: `${baseURL}api/${system}/phoneVerify/sendCode`,
    method: 'post',
    data
  })
}

//手机短信校检
export const verifyPhoneCode = (data) => {
  return request({
    url: `${baseURL}api/${system}/phoneVerify/verifyCode`,
    method: 'post',
    data
  })
}



//匿名二维码
export const getFromCaptcha = (params) => {
  return request({
    url: `${baseURL}api/${form}/baseFormSubmission/captcha`,
    method: 'get',
    params: {
      ...params
    }
  })
}

//匿名提交接口
export const submitFrom = (data) => {
  return request({
    url: `${baseURL}api/${form}/baseFormSubmission/submit`,
    method: 'post',
    data
  })
}

//匿名已提交的列表
export const sGetListData = (data) => {
  return request({
    url: `${baseURL}api/${form}/baseFormSubmission/listByPage`,
    method: 'post',
    data
  })
}

//匿名查看单条数据
export const sViewListData = (data) => {
  return request({
    url: `${baseURL}api/${form}/baseFormSubmission/getById`,
    method: 'post',
    data
  })
}

//匿名修改单条数据
export const sUpdateListData = (data) => {
  return request({
    url: `${baseURL}api/${form}/baseFormSubmission/update`,
    method: 'post',
    data
  })
}

//匿名微信验证code取token
export const sWxVerify = (data) => {
  return request({
    url: `${baseURL}api/${system}/wxVerify/mpLogin`,
    method: 'post',
    data
  })
}



//匿名获取自定义表单URL配置
export const sGetCustomeUrl = (data) => {
  return request({
    url: `${baseURL}api/${form}/baseFormSubmission/getCustomUrl`,
    method: 'post',
    data
  })
}


//匿名获取二维码
export const sGetQr = (data) => {
  return request({
    url: `${baseURL}api/${form}/baseFormSubmission/getQr`,
    method: 'post',
    data
  })
}




//字段配置接口
export const getFieldListData = (data) => {
  return request({
    url: `${baseURL}api/${form}/baseMetaField/list`,
    method: 'post',
    data
  })
}


//数据接口
export const getListData = (data) => {
  return request({
    url: `${baseURL}api/${form}/baseMetaCommon/listByPage`,
    method: 'post',
    data
  })
}

//待审核列表
export const getToDoListData = (data) => {
  return request({
    url: `${baseURL}api/${flow}/formFlow/toDoList`,
    method: 'post',
    data
  })
}
//已审核列表
export const getFinishListData = (data) => {
  return request({
    url: `${baseURL}api/${flow}/formFlow/finishList`,
    method: 'post',
    data
  })
}

//当前数据在此节点是否允许修改
export const getNodeEditStatus = (data) => {
  return request({
    url: `${baseURL}api/${flow}/formFlowConfig/getNodeEditStatus`,
    method: 'post',
    data
  })
}

//审核通过
export const flowYes = (data) => {
  return request({
    url: `${baseURL}api/${flow}/flownode2/completeTask`,
    method: 'post',
    data
  })
}

//审核不通过
export const flowNo = (data) => {
  return request({
    url: `${baseURL}api/${flow}/flownode2/closeForDisagree`,
    method: 'post',
    data
  })
}





//保存更新数据
export const saveOrUpdateListData = (data) => {
  return request({
    url: `${baseURL}api/${form}/baseForm/saveOrUpdateFormData`,
    method: 'post',
    data
  })
}

//删除数据
export const delListData = (data) => {
  return request({
    url: `${baseURL}api/${form}/baseMetaCommon/delete`,
    method: 'post',
    data
  })
}

//查看数据
export const viewListData = (data) => {
  return request({
    url: `${baseURL}api/${form}/baseMetaCommon/getById`,
    method: 'post',
    data
  })
}

//导出数据
export const outListData = (data) => {
  return request({
    url: `${baseURL}api/${form}/baseMetaCommon/exportExcel`,
    method: 'post',
    data
  })
}

//导入数据
export const inListData = (data) => {
  return request({
    url: `${baseURL}api/${form}/baseMetaCommon/importExcel`,
    method: 'post',
    data
  })
}

//获取导入模板
export const inTemplateFile = (data) => {
  return request({
    url: `${baseURL}api/${form}/baseMetaCommon/importTemplateFile`,
    method: 'post',
    responseType:"blob",
    data
  })
}

//获取表单页设置
export const customFormList = (data) => {
  return request({
    url: `${baseURL}api/${form}/baseFormCustom/list`,
    method: 'post',
    data
  })
}




