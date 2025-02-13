/**
 * 提供一些运行时使用的对象，比如说store、router、axios等
 * 这里默认使用baseUrl作为key，来存储不同系统的运行时对象
 * store的key为store，router的key为router，axios的key为request
 */

const baseURL = process.env.BASE_URL
const defaultKey = baseURL.replace(/\//g,'');

const runtimeKey = 'HuilanAicosRuntime'

if(!window[runtimeKey]) {
  window[runtimeKey] = {}
}

const runtimeObj = window[runtimeKey]

/**
 * 根据系统获取运行时对象
 * @param {string} key 需要获取的对象key，比如store、router、axios等
 * @param {string} systemKey 存储数据所在的系统key，默认从baseUrl中获取
 * @returns object
 */
export function getRuntime(key, systemKey=defaultKey) {
  const systemObj = runtimeObj[systemKey]
  if(systemObj) {
    return systemObj[key]
  }
  console.warn(`getRuntime: 不存在系统${systemKey} 的数据`)
}

/**
 * 设置需要设置为全角缓存对象的属性
 * @param {object} data 需要缓存的对象
 * @param {string} systemKey 缓存使用的key，默认从baseUrl中获取
 */
export function setRuntime(data, systemKey=defaultKey) {
  if(!runtimeObj[systemKey]) {
    runtimeObj[systemKey] = {}
  }
  Object.assign(runtimeObj[systemKey], data)
}
