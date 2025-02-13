/**
 * 获取ajax请求函数
 */

import {getRuntime} from "@/util/runtime";

export function request(option) {
  const request = getRuntime('request');
  return request(option)
}
