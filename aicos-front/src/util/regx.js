import { cardid } from './validate'
import i18n from '@/lang';


// 正向校验允许的字符
const regx = {
  // 仅字母
  onlyChar: {
    regx: /^([a-zA-Z]+)$/,
    key: 'onlyChar',
    msg: '只能输入字母'
  },
  onlyNumber: {
    regx: /^([0-9]+)$/,
    key: 'onlyNumber',
    msg: '只能输入数字'
  },
  // 只允许字母和下划线
  charUnderline: {
    regx: /^[a-zA-Z_]+$/,
    key: 'charUnderline',
    msg: '只允许字母和下划线'
  },
  // 只允许输入字母，数字，汉字，下划线
  charNumHanUnderline: {
    regx: /^[A-Za-z0-9_\u4E00-\u9FA5]+$/,
    key: 'charNumHanUnderline',
    msg: '只允许输入字母，数字，汉字，下划线'
  },
  // 只允许输入字母，数字，汉字
  charNumHan: {
    regx: /^[A-Za-z0-9\u4E00-\u9FA5]+$/,
    key: 'charNumHan',
    msg: '只允许输入字母，数字，汉字'
  },
  //只允许输入字母，数字，汉字，逗号，句号，问号，空格，中文顿号，中文分号，中文叹号
  charNumHanCommaStop: {
    //eslint-disable-next-line
    regx: /^[A-Za-z0-9\u4E00-\u9FA5\,\.\?\u3002\uff1f\uff0c\s\u3001\uff1b\uff01]+$/,
    key: 'charNumHanCommaStop',
    msg: '只允许输入字母，数字，汉字，逗号，句号，问号，空格，中文顿号，中文分号，中文叹号'
  },
  // 只允许输入字母，数字，汉字，逗号，句号，问号，空格，中文顿号，中文分号，中文叹号，||
  charNumHanCommaStopTable: {
    //eslint-disable-next-line
    regx: /^[A-Za-z0-9|\u4E00-\u9FA5\,\.\?\u3002\uff1f\uff0c\s\u3001\uff1b\uff01]+$/,
    key: 'charNumHanCommaStop',
    msg: '只允许输入字母，数字，汉字，逗号，句号，问号，空格，中文顿号，中文分号，中文叹号，||'
  },
  // 只允许输入字母，数字，汉字,||,空格
  charNumHanSeparator: {
    regx: /^[A-Za-z0-9|\u4E00-\u9FA5\s]+$/,
    key: 'charNumHanSeparator',
    msg: '只允许输入字母，数字，汉字，||，空格'
  },
  // 只允许输入字母，数字，汉字，空格
  charNumHanS: {
    regx: /^[A-Za-z0-9\u4E00-\u9FA5\s]+$/,
    key: 'charNumHanS',
    msg: '只允许输入字母，数字，汉字，空格'
  },
  // 只允许输入字母，数字，汉字，空格
  charNumHanSEnter: {
    regx: /^[A-Za-z0-9\u4E00-\u9FA5\r\n\s]+$/,
    key: 'charNumHanSEnter',
    msg: '只允许输入字母，数字，汉字，回车，空格'
  },
  // 只允许输入字母，数字，汉字，空格,>
  charNumHanSEnterGt: {
    // eslint-disable-next-line no-useless-escape
    regx: /^[A-Za-z0-9\u4E00-\u9FA5\r\n\s\&gt>]+$/,
    key: 'charNumHanSEnterGt',
    msg: '只允许输入字母，数字，汉字，回车，空格，>'
  },
  // 只允许数字和字母
  charNum: {
    regx: /^[A-Za-z0-9]+$/,
    key: 'charNum',
    msg: '只允许数字和字母'
  },
  // 只允许数字和字母中横线或下划线
  charNumLine: {
    regx: /^[A-Za-z0-9_-]+$/,
    key: 'charNumLine',
    msg: '只允许字母、数字、下划线和中横线'
  },
  // 只允许数字和字母
  charNumLineStartWidthChar: {
    regx: /^[A-z][A-z0-9_-]+$/,
    key: 'charNumLineStartWidthChar',
    // msg: '只允许字母、数字、下划线和中横线,字母开头'
    msg: '只允许字母、下划线开头，输入内容只能包含字母、数字、下划线和中横线'
  },
  // 只允许输入字母，汉字
  charHan: {
    regx: /^[A-Za-z\u4E00-\u9FA5]+$/,
    key: 'charHan',
    msg: '只允许输入字母，汉字'
  },
  // 只允许数字和下划线
  numUnderline: {
    regx: /^[0-9_]+$/,
    key: 'numUnderline',
    msg: '只允许数字和下划线'
  },
  // 数字、字母（区分大小写）、特殊字符
  numCharSpecial: {
    regx: /[A-z\d!@#$%^&*~\-_=+]+$/,
    key: 'numCharSpecial',
    msg: '只允许数字、字母、英文特殊字符'
  },
  // 必须同时包含数字、字母（区分大小写）、特殊字符
  mustNumCharSpecial: {
    regx: /^(?=.*[A-z])(?=.*\d)(?=.*[!@#$%^&*~\-_=+])[A-z\d!@#$%^&*~\-_=+]+$/,
    key: 'mustNumCharSpecial',
    msg: '必须同时包含数字、字母、特殊字符'
  },
  // 不能输入<>
  expectSpecials: {
    regx: /[^<>]*/,
    key: 'expectSpecials',
    msg: '不能输入特殊字符'
  },
  phone: {
    regx: /^([0-9]{3,4}-)?[0-9]{7,8}$/,
    key: 'phone',
    msg: '请输入正确的电话号码'
  },
  mobile: {
    regx: /^1[0-9]{10}$/,
    key: 'mobile',
    msg: '请输入正确的手机号码'
  },
  // 同时校验手机和电话
  tel: {
    regx: /^(1[3|4|5|6|7|8|9])\d{9}$|^0\d{2,3}-?\d{7,8}$|^400[016789]\d{6}$|^400-[016789]\d{2}-\d{4}$/,
    key: 'tel',
    msg: '请输入正确的电话号码'
  },
  size: {
    regx: /^\d+(?=(px|%)$)/,
    key: 'size',
    msg: '值为数字加px或%'
  },
  ipv4: {
    regx: /^(?:25[0-5]|2[0-4]\d|[0-1]?\d{1,2})(?:\.(?:25[0-5]|2[0-4]\d|[0-1]?\d{1,2})){3}$/,
    key: 'ipv4',
    msg: '请输入正确的ipv4地址'
  },
  ipv6: {
    regx: /^([[:xdigit:]]{1,4}(?::[[:xdigit:]]{1,4}){7}|::|:(?::[[:xdigit:]]{1,4}){1,6}|[[:xdigit:]]{1,4}:(?::[[:xdigit:]]{1,4}){1,5}|(?:[[:xdigit:]]{1,4}:){2}(?::[[:xdigit:]]{1,4}){1,4}|(?:[[:xdigit:]]{1,4}:){3}(?::[[:xdigit:]]{1,4}){1,3}|(?:[[:xdigit:]]{1,4}:){4}(?::[[:xdigit:]]{1,4}){1,2}|(?:[[:xdigit:]]{1,4}:){5}:[[:xdigit:]]{1,4}|(?:[[:xdigit:]]{1,4}:){1,6}:)$/,
    key: 'ipv6',
    msg: '请输入正确的ipv6地址'
  },
  ip: {
    regx: /^((([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5])\.){3}([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5])$|^(([a-fA-F]|[a-fA-F][a-fA-F0-9-]*[a-fA-F0-9])\.)*([A-Fa-f]|[A-Fa-f][A-Fa-f0-9-]*[A-Fa-f0-9])$|^(?:(?:(?:(?:(?:(?:(?:[0-9a-fA-F]{1,4})):){6})(?:(?:(?:(?:(?:[0-9a-fA-F]{1,4})):(?:(?:[0-9a-fA-F]{1,4})))|(?:(?:(?:(?:(?:25[0-5]|(?:[1-9]|1[0-9]|2[0-4])?[0-9]))\.){3}(?:(?:25[0-5]|(?:[1-9]|1[0-9]|2[0-4])?[0-9])))))))|(?:(?:::(?:(?:(?:[0-9a-fA-F]{1,4})):){5})(?:(?:(?:(?:(?:[0-9a-fA-F]{1,4})):(?:(?:[0-9a-fA-F]{1,4})))|(?:(?:(?:(?:(?:25[0-5]|(?:[1-9]|1[0-9]|2[0-4])?[0-9]))\.){3}(?:(?:25[0-5]|(?:[1-9]|1[0-9]|2[0-4])?[0-9])))))))|(?:(?:(?:(?:(?:[0-9a-fA-F]{1,4})))?::(?:(?:(?:[0-9a-fA-F]{1,4})):){4})(?:(?:(?:(?:(?:[0-9a-fA-F]{1,4})):(?:(?:[0-9a-fA-F]{1,4})))|(?:(?:(?:(?:(?:25[0-5]|(?:[1-9]|1[0-9]|2[0-4])?[0-9]))\.){3}(?:(?:25[0-5]|(?:[1-9]|1[0-9]|2[0-4])?[0-9])))))))|(?:(?:(?:(?:(?:(?:[0-9a-fA-F]{1,4})):){0,1}(?:(?:[0-9a-fA-F]{1,4})))?::(?:(?:(?:[0-9a-fA-F]{1,4})):){3})(?:(?:(?:(?:(?:[0-9a-fA-F]{1,4})):(?:(?:[0-9a-fA-F]{1,4})))|(?:(?:(?:(?:(?:25[0-5]|(?:[1-9]|1[0-9]|2[0-4])?[0-9]))\.){3}(?:(?:25[0-5]|(?:[1-9]|1[0-9]|2[0-4])?[0-9])))))))|(?:(?:(?:(?:(?:(?:[0-9a-fA-F]{1,4})):){0,2}(?:(?:[0-9a-fA-F]{1,4})))?::(?:(?:(?:[0-9a-fA-F]{1,4})):){2})(?:(?:(?:(?:(?:[0-9a-fA-F]{1,4})):(?:(?:[0-9a-fA-F]{1,4})))|(?:(?:(?:(?:(?:25[0-5]|(?:[1-9]|1[0-9]|2[0-4])?[0-9]))\.){3}(?:(?:25[0-5]|(?:[1-9]|1[0-9]|2[0-4])?[0-9])))))))|(?:(?:(?:(?:(?:(?:[0-9a-fA-F]{1,4})):){0,3}(?:(?:[0-9a-fA-F]{1,4})))?::(?:(?:[0-9a-fA-F]{1,4})):)(?:(?:(?:(?:(?:[0-9a-fA-F]{1,4})):(?:(?:[0-9a-fA-F]{1,4})))|(?:(?:(?:(?:(?:25[0-5]|(?:[1-9]|1[0-9]|2[0-4])?[0-9]))\.){3}(?:(?:25[0-5]|(?:[1-9]|1[0-9]|2[0-4])?[0-9])))))))|(?:(?:(?:(?:(?:(?:[0-9a-fA-F]{1,4})):){0,4}(?:(?:[0-9a-fA-F]{1,4})))?::)(?:(?:(?:(?:(?:[0-9a-fA-F]{1,4})):(?:(?:[0-9a-fA-F]{1,4})))|(?:(?:(?:(?:(?:25[0-5]|(?:[1-9]|1[0-9]|2[0-4])?[0-9]))\.){3}(?:(?:25[0-5]|(?:[1-9]|1[0-9]|2[0-4])?[0-9])))))))|(?:(?:(?:(?:(?:(?:[0-9a-fA-F]{1,4})):){0,5}(?:(?:[0-9a-fA-F]{1,4})))?::)(?:(?:[0-9a-fA-F]{1,4})))|(?:(?:(?:(?:(?:(?:[0-9a-fA-F]{1,4})):){0,6}(?:(?:[0-9a-fA-F]{1,4})))?::)))))$/,
    key: 'ip',
    msg: '请输入正确的ip地址'
  },
  oneHundred: {
    regx: /^(100|(([1-9]){1}[0-9]?|0{1})((\.)([0-9]){1,2})?)$/,
    key: 'oneHundred',
    msg: '请输入0-100的数字'
  },
  oneHundredInteger: {
    regx: /^(100|(([1-9]){1}[0-9]?|0{1})?)$/,
    key: 'oneHundredInteger',
    msg: '请输入0-100的整数'
  },
  // 正整数
  positiveInteger: {
    regx: /^(0|\+?[1-9][0-9]*)$/,
    key: 'positiveInteger',
    msg: '请输入整数'
  },
  // 正小数
  positiveDecimal: {
    regx: /^[1-9]\d*\.\d*|0\.\d*[1-9]\d*$/,
    key: 'positiveDecimal',
    msg: '请输入小数'
  },
  // 0到1的两位小数
  positiveDecimalTow: {
    regx: /^(0\.(0[1-9]|[1-9]{1,2}|[1-9]0)$)|^1$/,
    key: 'positiveDecimalTow',
    msg: '请输入 0.01 到 1.0 之间的小数'
  },
  // 不超过50字符
  lenghMax: {
    regx: /\S{1,50}/,
    key: 'lenghMax',
    msg: '长度不能超过50字符'
  },
  lenghHundredMax: {
    regx: /\S{1,100}/,
    key: 'lenghHundredMax',
    msg: '长度不能超过100字符'
  },
  charNumHanEnter: {
    //eslint-disable-next-line
    regx: /^[A-Za-z0-9\u4E00-\u9FA5\r\n\/]+$/,
    key: 'charNumHanEnter',
    msg: '只允许输入字母，数字，汉字,回车，斜杠'
  },
  charNumHanEnt: {
    regx: /^[A-Za-z0-9\u4E00-\u9FA5\r\n]+$/,
    key: 'charNumHanEnt',
    msg: '只允许输入字母，数字，汉字,回车'
  },
  charNumHanEnterComma: {
    //eslint-disable-next-line
    regx: /^[A-Za-z0-9\u4E00-\u9FA5\r\n\,]+$/,
    key: 'charNumHanEnterComma',
    msg: '只允许输入字母，数字，汉字，回车，逗号'
  },
  charNumHanEnterCommaStop: {
    //eslint-disable-next-line
    regx: /^[A-Za-z0-9\u4E00-\u9FA5\r\n\,\.]+$/,
    key: 'charNumHanEnterCommaStop',
    msg: '只允许输入字母，数字，汉字,回车，逗号，句号'
  },
  notchar: {
    regx: /^[A-Za-z0-9\u4E00-\u9FA5]+$/,
    key: 'notchar',
    msg: '只允许输入字母，数字，汉字'
  },
  zeroToOneDecimal: {

    regx: /^(0\.(0[1-9]|[1-9]{1,2}|[1-9]0)$)|^1$/,
    key: 'zeroToOneDecimal',
    msg: '请输入0到1之间的小数或整数'
  },
  // 只允许数字和字母
  // 只允许字母和下划线
  // charUnderline:/^[a-zA-Z_]+$/,
  // // 只允许字母和下划线
  // charUnderline:/^[a-zA-Z_]+$/,
  // // 只允许字母和下划线
  // charUnderline:/^[a-zA-Z_]+$/,

  notEnSpecials: {
    regx: /^[A-Za-z0-9\u3002|\uff1f|\uff01|\uff0c|\u3001|\uff1b|\uff1a|\u201c|\u201d|\u2018|\u2019|\uff08|\uff09|\u300a|\u300b|\u3010|\u3011|\u007e|\u4E00-\u9FA5\r\n,._%@-]+$/,
    key: 'notEnSpecials',
    msg: '不允许英文特殊字符'
  },

  isHttpUrl: {
    regx: /(http|https):\/\/([\w.]+\/?)\S*/,
    key: 'isHttpUrl',
    msg: '不是标准的浏览器url地址'
  },

  isEmail: {
    regx: /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+((.[a-zA-Z0-9_-]{2,3}){1,2})$/,
    key: 'isEmail',
    msg: '请输入正确的电子邮箱'
  },

  isQQ: {
    regx: /^(?!0)\d{6,13}$/,
    key: 'isQQ',
    msg: '请输入正确的QQ号码'
  },

  isFax: {
    regx: /^(1[3|4|5|6|7|8|9])\d{9}$|^0\d{2,3}-?\d{7,8}$|^400[016789]\d{6}$|^400-[016789]\d{2}-\d{4}$/,
    key: 'isFax',
    msg: '请输入正确的传真'
  },


}

// 校验不允许的字符
const expect = {
  expectSpecials: {
    regx: /[<>]/,
    key: "expectSpecials",
    msg: '不能输入特殊字符'
  }
}

const validator = {
  // 验证身份证
  idCard(rule, value, callback) {
    if (!value) {
      callback()
    }
    const [flag, msg] = cardid(value)
    if (flag) {
      callback(new Error(msg))
    } else {
      callback()
    }
  }
}

/**
 * 创建通过正则验证的验证
 * @param reg 正则表达式
 * @param msg 错误信息
 * @param reverse 为 true时匹配到时显示错误
 * @returns {Function} 用于表单校验的验证方法
 */
export function createRegExpValidate(reg, msg = '验证失败', reverse) {
  return function (rule, value, callback) {
    // 当要要校验的内容为空时，直接通过
    if (value === '') {
      callback()
    }
    if (reg.test(value)) {
      if (reverse) {
        callback(new Error(msg))
      } else {
        callback()
      }
    } else {
      if (reverse) {
        callback()
      } else {
        callback(new Error(msg))
      }
    }
  }
}

/**
 * 获取校验规则
 * 先从regx中获取，如果没有再从expect中获取，最后从validator中获取
 * @param rules Array 规则列表
 * @returns {*} element-ui中使用的校验规则数组
 */
function getRules(rules) {
  return rules.map(rule => {
    let reg = regx[rule]

    let res
    if (reg) {
      res = {
        pattern: reg.regx,
        message: i18n.t(`regx.${reg.key}`),
        trigger: "blur"
      }
    } else {
      const expectReg = expect[rule]
      if (expectReg) {
        reg = createRegExpValidate(expectReg.regx, expectReg.msg, true)
      } else {
        reg = validator[rule]
      }

      if (reg) {
        res = {
          validator: reg,
          trigger: 'blur'
        }
      }
    }
    return res
  })
}

function getVal(obj, key) {
  const keys = key.split('.')
  let temp = obj
  for (let i = 0, l = keys.length; i < l; i++) {
    temp = temp[keys[i]]
    if (temp === undefined) {
      break
    }
  }
  return temp
}

/**
 * 创建表单值一致性校验，比如密码
 * @param obj
 * @param key
 * @param errMsg
 * @returns {{validator: validator, trigger: string}}
 */
function createEqual(obj, key, errMsg = '两次值不一致!') {
  const validator = (rule, value, callback) => {
    if (value !== getVal(obj, key)) {
      callback(new Error(errMsg));
    } else {
      callback();
    }
  }
  return {
    validator,
    trigger: 'blur'
  }
}

/**
 * 创建唯一性校验，例如联系人的名字
 * @param obj
 * @param listKey
 * @param key
 * @param errMsg
 * @returns {{validator: validator, trigger: string}}
 */
function createUnique(obj, listKey, key, errMsg = '已存在相同值!') {

  const validator = (rule, value, callback) => {
    const list = getVal(obj, listKey) || []

    const filter = list.filter(item => value === getVal(item, key))
    const flag = filter.length > 1

    if (flag) {
      callback(new Error(errMsg));
    } else {
      callback();
    }
  }
  return {
    validator,
    trigger: 'blur'
  }
}

function createNumber(min, max) {
  const validator = (rule, value, callback) => {
    const reg = /^([0-9]+)$/
    if (value.length != 0) {
      if (reg.test(value)) {
        const temp = Number.parseInt(value)
        if (temp > min && temp < max) {
          callback()
        } else {
          callback(new Error(`数字范围为${min}-${max}`))
        }
      } else {
        callback(new Error(`只能输入整数，范围${min}-${max}`))
      }
    } else {
      callback()
    }
  }
  return {
    validator,
    trigger: 'blur'
  }
}

export {
  regx,
  getRules,
  createEqual,
  createUnique,
  createNumber
}
