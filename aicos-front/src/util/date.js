export const calcDate = (date1, date2) => {
  let date3 = date2 - date1;

  let days = Math.floor(date3 / (24 * 3600 * 1000))

  let leave1 = date3 % (24 * 3600 * 1000) //计算天数后剩余的毫秒数
  let hours = Math.floor(leave1 / (3600 * 1000))

  let leave2 = leave1 % (3600 * 1000) //计算小时数后剩余的毫秒数
  let minutes = Math.floor(leave2 / (60 * 1000))

  let leave3 = leave2 % (60 * 1000) //计算分钟数后剩余的毫秒数
  let seconds = Math.round(date3 / 1000)
  return {
    leave1,
    leave2,
    leave3,
    days: days,
    hours: hours,
    minutes: minutes,
    seconds: seconds,
  }
}

/**
 * 日期格式化
 */
export function dateFormat(date, format) {
  format = format || 'yyyy-MM-dd hh:mm:ss';
  if (date !== 'Invalid Date') {
    if (typeof date === 'number') {
      date = new Date(date)
    }
    let o = {
      "M+": date.getMonth() + 1, //month
      "d+": date.getDate(), //day
      "h+": date.getHours(), //hour
      "m+": date.getMinutes(), //minute
      "s+": date.getSeconds(), //second
      "q+": Math.floor((date.getMonth() + 3) / 3), //quarter
      "S": date.getMilliseconds() //millisecond
    }
    if (/(y+)/.test(format)) format = format.replace(RegExp.$1,
      (date.getFullYear() + "").substr(4 - RegExp.$1.length));
    for (let k in o)
      if (new RegExp("(" + k + ")").test(format))
        format = format.replace(RegExp.$1,
          RegExp.$1.length === 1 ? o[k] :
            ("00" + o[k]).substr(("" + o[k]).length));
    return format;
  }
  return '';

}

/**
 * 
 * @param {*} mss 时间戳
 * @param {*} isMsec 是否毫秒
 * @returns 
 * 毫秒转化为时分秒
 */
export function formatSeconds(mss, isMsec) {
  // 是否为毫秒isMsec
  mss = isMsec ? mss : parseInt(mss) * 1000;// 
  var hours = parseInt((mss % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  var minutes = parseInt((mss % (1000 * 60 * 60)) / (1000 * 60));
  var seconds = parseInt((mss % (1000 * 60)) / 1000);
  if (hours < 10) {
    hours = "0" + hours;
  }
  if (minutes < 10) {
    minutes = "0" + minutes;
  }
  if (seconds < 10) {
    seconds = "0" + seconds;
  }
  return hours + ":" + minutes + ":" + seconds;
}
