import request from '@/router/axios';
import serviceList from '@/config/serviceList'
import {baseURL} from '@/api/common';

const { log } = serviceList

// 访问桌面图标时提交
export const saveVisitRecentDesktopMenu = (id) => {
  return request({
    url: `${baseURL}api/${log}/baseVisitLog/saveVisitRecentDesktopMenu`,
    method: 'post',
    data: {
      id
    }
  })
}

