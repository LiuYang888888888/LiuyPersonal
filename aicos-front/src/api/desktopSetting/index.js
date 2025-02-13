import request from '@/router/axios';
// import website from "@/config/website";
import serviceList from '@/config/serviceList'
import {baseURL} from '@/api/common';

const { system } = serviceList

// 取所有背景
export function getAllDesktopBackground() {
  return request({
    url: `${baseURL}api/${system}/desktopBackground/getAllDesktopBackground`,
    method: 'post',
    data: {}
  })
}

// 保存背景图片
export function add(data) {
  return request({
    url: `${baseURL}api/${system}/desktopBackground/saveDesktopBackground`,
    method: 'post',
    data
  })
}

// 更新背景图片，所有值都传
export function update(data) {
  return request({
    url: `${baseURL}api/${system}/desktopBackground/updateDesktopBackground`,
    method: 'post',
    data
  })
}

// 删除背景图片，传id
export function remove(id) {
  return request({
    url: `${baseURL}api/${system}/desktopBackground/deleteDesktopBackground`,
    method: 'post',
    data: {
      id
    }
  })
}

// 设置背景图片,传id,stretch,程序直接设置status=1
export function setDesktopBackground(data) {
  return request({
    url: `${baseURL}api/${system}/desktopBackground/updateDesktopBackgroundStatus`,
    method: 'post',
    data
  })
}

// 设置背景图片,传id,程序直接设置status=1
export function getDesktopBackground() {
  return request({
    url: `${baseURL}api/${system}/desktopBackground/getDefaultDesktop`,
    method: 'post',
    data: {}
  })
}

// 取当前可供设置的桌面图标
export function getAllDesktopIcon() {
  return request({
    url: `${baseURL}api/${system}/desktopBackground/getAllDesktopIcon`,
    method: 'post',
    data: {}
  })
}

// 更新桌面图标设置，传list(id+iconStatus)
export function updateIconStatus(data) {
  return request({
    url: `${baseURL}api/${system}/desktopBackground/updateIconStatus`,
    method: 'post',
    data
  })
}
