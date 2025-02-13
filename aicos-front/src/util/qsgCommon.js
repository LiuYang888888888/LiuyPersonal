import md5 from 'js-md5';
import {
  getStore
} from '@/util/store'
import { encryptSM3 } from "@/util/cryptosm";
import { baseURL } from '@/api/common';


export const huiLanDev = 'PUBLIC';

//深度合并json
export const deepAssign = (...param) => {
  let result = Object.assign({}, ...param);
  for (let item of param) {
    for (let [idx, val] of Object.entries(item)) {
      if (typeof val === 'object') {
        result[idx] = deepAssign(result[idx], val);
      }
    }
  }
  return result;
}

//深度合并json 排除数组项
export const deepAssignNoArr = (...param) => {
  let result = Object.assign({}, ...param);
  for (let item of param) {
    for (let [idx, val] of Object.entries(item)) {
      if ((typeof val === 'object') && !Array.isArray(val)) {
        result[idx] = deepAssign(result[idx], val);
      }
    }
  }
  return result;
}

const isObject = (obj) => Object.prototype.toString.call(obj) === "[object Object]";
export const deepMerge = (target, source) => {
  if (isObject(target) && isObject(source)) {
    // 遍历源对象，将源对象存在但目标对象不存在的属性赋值给目标对象
    for (const key in source) {
      if (!target.hasOwnProperty(key)) {
        target[key] = source[key];
      }
    }
    // 遍历目标对象
    for (const key in target) {
      if (source.hasOwnProperty(key)) {
        // 判断属性值数据类型，若不是对象类型则赋值给目标对象
        if (!isObject(source[key])) {
          target[key] = source[key];
        } else {
          // 是对象类型则递归调用
          deepMerge(target[key], source[key]);
        }
      }
    }
    return target;
  }
}

// 判断是否为空
export const isNull = (val) => {
  if (typeof val == 'boolean') {
    return false;
  }
  if (typeof val == 'number') {
    return false;
  }
  if (val instanceof Array) {
    if (val.length == 0) return true;
  } else if (val instanceof Object) {
    if (JSON.stringify(val) === '{}') return true;
  } else {
    if (val == 'null' || val == null || val == 'undefined' || val == undefined || val == '') return true;
    return false;
  }
  return false;
}

//深度复制对象
export const cloneObj = (obj) => {
  let newObj = {};
  if (typeof obj === "object") {
    if (obj instanceof Array) {
      newObj = [];
    }
    for (var key in obj) {
      let val = obj[key];
      newObj[key] =
        typeof val === "object" ? this.cloneObj(val) : val;
    }
    return newObj;
  } else {
    return obj;
  }
}

//带查重的深复制（仅适用于单层数组）
export const cloneWithCheck = (Arr) => {
  let newArr = [];
  if (Arr.length > 0) {
    newArr.push(this.cloneObj(Arr[0]));
    for (let i = 1; i < Arr.length; i++) {
      let newFlag = newArr.every(item => {
        return item.id !== Arr[i].id
      });
      if (newFlag) {
        newArr.push(this.cloneObj(Arr[i]));
      }
    }
  }
  return newArr;
}

//流程设计器选择组织架构已存储的数据格式转换为新组件需要的格式
export const defaultDynaData = [
  {
    label: "当前节点负责人",
    prop: "nodeApprover",
    value: false,
    tips: "",
  },
  {
    label: "申请人",
    prop: "applicant",
    value: false,
    tips: "",
  },
  {
    label: "申请人部门领导",
    prop: "applicantLeader",
    value: false,
    tips: "由单据创建人部门领导审批",
  },
  {
    label: "申请人直属领导",
    prop: "applicantDirectLeader",
    value: false,
    tips: "由单据创建人直属领导审批",
  },
  {
    label: "提交人部门领导",
    prop: "submitterLeader",
    value: false,
    tips: "由单据上一节点负责人部门领导审批",
  },
  {
    label: "提交人直属领导",
    prop: "submitDirectLeader",
    value: false,
    tips: "由单据上一节点负责人直属领导审批",
  },
];

export const defaultDynaNameData = {
  nodeApprover: "当前节点负责人",
  applicant: "申请人",
  applicantLeader: "申请人领导",
  applicantDirectLeader: "申请人直属领导",
  submitterLeader: "提交人部门领导",
  submitDirectLeader: "提交人直属领导",
}

export const formatOrgDataToNew = (oldData) => {
  // console.log('formatOrgDataToNew',oldData)
  let res = {
    user: [],
    dept: [],
    role: [],
    rank: [],
    dyna: [],
  }
  oldData.list.map((item) => {
    if (item.type == 'user') {
      res.user.push({
        id: item.id,
        account: item.id,
        realName: item.name,
        name: item.name,
      })
    } else if (item.type == 'dept') {
      res.dept.push({
        id: item.id,
        deptName: item.name,
        name: item.name,
      })
    } else if (item.type == 'role') {
      res.role.push({
        id: item.id,
        roleName: item.name,
        name: item.name,
      })
    }
  });
  /*const defaultLabel = {
    applicant: "申请人",
    applicantLeader: "申请人领导",
    submitterLeader: "提交人领导",
  }
  const defaultTips = {
    applicant: "",
    applicantLeader: "由单据创建人直属领导审批",
    submitterLeader: "由单据上一节点负责人直属领导审批",
  }

  for( let key in oldData){
    if( key !='list'){
      let tempAr = {
        label: defaultLabel[key],
        prop: key,
        value: oldData[key],
        tips: defaultTips[key],
      }
      res.dyna.push(tempAr);
    }
  }*/

  defaultDynaData.map((item) => {
    item.value = oldData[item.prop];
    res.dyna.push(item);
  })

  // console.log('formatOrgDataToNew',res)

  return res
}

//流程设计器选择组织架构 新组件的数据格式转换为存储需要的格式
export const formatOrgDataToOld = (newData) => {
  // console.log('formatOrgDataToOld',newData)
  let res = {
    list: [],
    // dynaName: {},
  };
  newData.user.map((item) => {
    res.list.push({
      type: 'user',
      id: item.account,
      name: item.realName,
    });
  });
  newData.dept.map((item) => {
    res.list.push({
      type: 'dept',
      id: item.id,
      name: item.deptName,
    });
  });
  newData.role.map((item) => {
    res.list.push({
      type: 'role',
      id: item.id,
      name: item.roleName,
    });
  });

  newData.dyna.map((item) => {
    res[item.prop] = item.value;
    // res.dynaName[item.prop] = item.label;
  })

  // console.log('formatOrgDataToOld',res)
  return res
}

//为from添加前后 内外 tips
/*
form.option.column[
  {
    className:'aaaaaa',
    tipShow: "Inner", //Inner Outer
    preTip: "preTip-Html",
    endTip: "endTip-Html",
  }
]
<style lang="scss" scoped>
/deep/.cumTip_info {
  font-size: 12px;
  color: #999;
  line-height: 32px;
}
/deep/.cumTip_Inner {
  .el-form-item__content {
    /deep/.el-switch {
      display: block;
      height: auto;
      padding-top: 6px;
    }
  }
  /deep/.cumTip_Inner_pre {
    padding-bottom: 10px;
  }
  /deep/.cumTip_Inner_end {
    padding-top: 10px;
  }
}
/deep/.cumTip_Outer {
  .el-form-item {
    display: inline-block;
    justify-content: flex-start;
    align-items: center;
    &>div{
      display: inline-block;
    }
    .el-form-item__label {
      display: none ;
    }
    .el-input__inner {
      width: 120px;
      padding: 0 12px;
    }
  }

  /deep/.cumTip_Outer_pre {
    padding-right: 10px;
  }
  /deep/.cumTip_Outer_end {
    padding-left: 10px;
  }
}

/deep/.cusInput {
  /deep/.el-input__inner {
    max-width: 560px;
  }
}

/deep/.cusTextarea {
  /deep/.el-textarea__inner {
    max-width: 560px;
  }
}

/deep/.cumTip_Outer.userQueueOverName {
  /deep/.el-input__inner {
    width: 240px;
  }
}
/deep/.cusTextarea.notShowlabel {

  /deep/.avue-form__item--right {
    /deep/.el-form-item__label {
      text-indent: -999px;
      text-align: left;
    }
  }
  /deep/.avue-form__item--top {
    /deep/.el-form-item__label {
      display: none;
    }
  }
}
</style>

*/
export const cusFormDomByTip = (formRef) => {

  //console.log(formRef);

  const formOption = { ...formRef.option };

  formOption.column.map((item) => {

    item.className = (item.className ? item.className : '') + ' ' + (item.tipShow ? ('cumTip_' + item.tipShow) : ' ');
    let preHtml = document.createElement('div');
    preHtml.setAttribute('class', 'cumTip_info cumTip_' + item.tipShow + '_pre');
    preHtml.innerHTML = item.preTip;
    let endHtml = document.createElement('div');
    endHtml.setAttribute('class', 'cumTip_info cumTip_' + item.tipShow + '_end');
    endHtml.innerHTML = item.endTip;

    if (item.tipShow == 'Inner') {
      const toRef = formRef.getPropRef(item.prop).$el;
      if (item.preTip) { toRef.prepend(preHtml); }
      if (item.endTip) { toRef.append(endHtml); }

    } else if (item.tipShow == 'Outer') {
      if (formOption.labelPosition != "top") {
        preHtml.setAttribute('style', 'margin-left:' + (item.labelWidth ? item.labelWidth : (formOption.labelWidth ? formOption.labelWidth : '80')) + 'px;');
      } else {
        preHtml.setAttribute('style', 'margin-left: 0px;');
      }

      item.labelWidth = 0;
      const toRef = formRef.getPropRef(item.prop).$parent.$el;
      if (item.preTip) { toRef.prepend(preHtml); }
      if (item.endTip) { toRef.append(endHtml); }
    }
  });

  return
}

/*必填数字范围验证*/
export const mustNumRange = (min, max) => {
  const validator = (rule, value, callback) => {
    const reg = /^([0-9]+)$/
    if (value && value.length != 0) {
      if (reg.test(value)) {
        const temp = Number.parseInt(value)
        if (temp >= min && temp <= max) {
          callback()
        } else {
          callback(new Error(`数字范围为${min}-${max}`))
        }
      } else {
        callback(new Error(`只能输入整数，范围${min}-${max}`))
      }
    } else {
      callback(new Error(`请输入大于0的正整数`))
    }
  }
  return {
    validator,
    trigger: 'blur'
  }
}


/*Object深度排序*/
export const sortObject = (objData) => {
  let resObj = {};
  if (!isNull(objData)) {
    Object.keys(objData).sort().map(key => {
      if (typeof objData[key] === 'object' && !Array.isArray(objData[key])) {
        resObj[key] = sortObject(objData[key]);
      } else {
        resObj[key] = objData[key];
      }

    })
  }
  return resObj
}

/*校检所有ajax参数，md5加密后添加至header供后台拦截*/
export const checkAjaxHead = (config) => {

  //console.log(config);
  let params = getStore({ name: 'frontParam' }) || '';

  let OsNow = new Date().getTime();

  const url = config.url;
  const uriParam = config.params || {};
  const dataParam = config.data;

  let tempUrlSort = url.replace(`${baseURL}api`, '').split('?');
  let urlSort = tempUrlSort[0];

  if (!isNull(tempUrlSort[1])) {
    let urlQuery = tempUrlSort[1].split('&');
    for (let key in urlQuery) {
      let urlQueryRes = urlQuery[key].split('=');
      uriParam[urlQueryRes[0]] = urlQueryRes[1];
    }
  }


  let resObj = {};
  if (!isNull(uriParam)) {
    Object.keys(uriParam).sort().map(key => {
      if (typeof uriParam[key] === 'object') {
        if (Array.isArray(uriParam[key])) {
          resObj[key + '[]'] = JSON.stringify(uriParam[key]);
        } else {
          resObj[key] = [JSON.stringify(uriParam[key])];
        }

      } else {

        if (!isNull(key)) {
          resObj[key] = (isNull(uriParam[key]) ? [""] : [uriParam[key].toString()]);
        }

      }

    })
  }

  let uriParamSort = resObj;
  //let dataParamSort = sortObject(dataParam);
  //body 里的data 不再排序
  let dataParamSort = dataParam;

  let textSign = '';
  if (config.method == 'get') {
    textSign = "Timestamp" + OsNow + "Uri" + urlSort + 'QueryParam' + JSON.stringify(uriParamSort);
  } else if (config.method == 'post') {
    textSign = "Timestamp" + OsNow + "Uri" + urlSort + 'QueryParam' + JSON.stringify(uriParamSort) + 'Data' + JSON.stringify(dataParamSort);
  } else {
    textSign = "Timestamp" + OsNow + "Uri" + urlSort + 'QueryParam' + JSON.stringify(uriParamSort) + 'Data' + JSON.stringify(dataParamSort);
  }

  //console.log( textSign );
  // 判断是否国密加密
  let sign = params.userPasswordType === 'nsm' ? md5(textSign) : encryptSM3(textSign)
  const headParam = {
    "Timestamp": OsNow,
    "Sign": sign,
    'encryptType': params.userPasswordType
  }
  return headParam;
}


//百分比转换
export const percentage = (val1, val2) => {
  if (val1 == 0 || val2 == 0) {
    return 0
  }
  return (Math.round(val1 / val2 * 10000) / 100.00)
}

//数组对象去重
export const filterListByKey = (arr, key) => {

  key = key || 'id';

  let res = [];
  let obj = {};
  for (let i = 0; i < arr.length; i++) {
    if (!obj[arr[i][key]]) {
      res.push(arr[i]);
      obj[arr[i][key]] = true;
    }
  }

  return res
}

//获取两个数组中 相同的值
export const getArrEqual = (arr1, arr2) => {
  let newArr = [];
  for (let i = 0; i < arr2.length; i++) {
    for (let j = 0; j < arr1.length; j++) {
      if (arr1[j] === arr2[i]) {
        newArr.push(arr1[j]);
      }
    }
  }
  return newArr;
}

//数字补零
export const initNum = (num) => {
  return num < 10 ? `0${num}` : num
}

//日期格式化
export const initDate = (oldDate, format = 'yyyy-MM-dd HH:mm:ss') => {
  const date = new Date(oldDate)
  const config = {
    yyyy: date.getFullYear(),
    M: date.getMonth() + 1,
    MM: initNum(date.getMonth() + 1),
    W: date.getDay(),
    WW: initNum(date.getDay()),
    d: date.getDate(),
    dd: initNum(date.getDate()),
    H: date.getHours(),
    HH: initNum(date.getHours()),
    h: date.getHours() > 12 ? (date.getHours() - 12) : date.getHours(),
    hh: initNum(date.getHours()) > 12 ? (initNum(date.getHours()) - 12) : initNum(date.getHours()),
    m: date.getMinutes(),
    mm: initNum(date.getMinutes()),
    s: date.getSeconds(),
    ss: initNum(date.getSeconds()),
    A: date.getHours() < 12 ? 'AM' : 'PM',
    a: date.getHours() < 12 ? 'am' : 'pm'
  }
  const formatConfigs = format.match(/[a-zA-Z]+/g)
  formatConfigs.forEach(item => {
    format = format.replace(item, config[item])
  })
  return format
}

//秒数转为00:00格式
export const initSecond = (second, format = 'en') => {
  let res = '';
  if (format == 'cn') {
    res = '0分0秒';
    let resM = (parseInt(parseInt(second) / 60));
    let resS = (parseInt(second) % 60);
    res = ((resM > 0) ? resM + '分' : '') + resS + '秒';
  } else {
    res = '00:00';
    let resM = initNum(parseInt(parseInt(second) / 60));
    let resS = initNum(parseInt(second) % 60);
    res = resM + ':' + resS;
  }

  return res
}

export const getHtmlPlainText = (html_str) => {
  //提取字符串中的文字
  let text = '';
  if (html_str) {
    let regrule = new RegExp('<[^<>]+>', 'g')
    text = html_str.replace(regrule, '')
    //或
    //var text = html_str.replace(/<[^<>]+>/g, "");
    text = text.replace(/(\n)/g, "");
    text = text.replace(/(\t)/g, "");
    text = text.replace(/(\r)/g, "");
  }

  return text
}


export const checkSameVal = (rule, value, callback) => {
  if (!isNull(value)) {
    if (value[0] == value[1]) {
      callback(new Error('设置的值不能相同'));
    } else {
      callback();
    }
  } else {
    callback();
  }
}

//验证数组 不能存在重复值
export const checkSameArrItem = (rule, value, callback) => {

  if (!isNull(value)) {
    if (Array.from(new Set(value)).length < value.length) {
      callback(new Error('存在重复的值'));
    } else {
      callback();
    }
  } else {
    callback();
  }
}

//文本域按行切分后 每行 按splitText>切分 查重
//以此方式扩展为el avue验证
/*
rules="[{
  validator: checkSameArrVal,
  trigger: 'blur'
},]"
const checkSameArrVal = (rule, value, callback) => {

  let res = checkSameTextareaSplit(value,'>');

  if(!res){
    callback(new Error('存在重复的值'));
  }else{
    callback();
  }

}*/

export const checkSameTextareaSplit = (value = '', splitText = '>') => {
  let res = true;

  const itemArr = value.split('\n');

  for (let item of itemArr) {
    if (!isNull(item)) {
      const valArr = item.split(splitText);
      if (Array.from(new Set(valArr)).length < valArr.length) {
        res = res && false;
      }
    }
  }
  return res
}


export const checkArrayType = (rule, value, callback, optionNum = 3, textNum = 200) => {
  if (isNull(value)) {
    callback();
  } else if (value.length > optionNum) {
    callback(new Error('设置的值个数不能超过 ' + optionNum));
  } else if (value.filter(item => item.length > textNum).length > 0) {
    callback(new Error('设置的值长度不能超过 ' + textNum));
  } else {
    callback();
  }
}


export function formateFileSize(size, pointLength, units) {
  var unit;

  units = units || ['B', 'K', 'M', 'G', 'TB'];

  while ((unit = units.shift()) && size > 1024) {
    size = size / 1024;
  }

  return (unit === 'B' ? size : (Number.isInteger(size) ? size : size.toFixed(pointLength || 2))) +
    unit;
}

export const findNodeByVal = (list = [], prop, value, children = 'children') => {
  let valueKey = prop;
  let childrenKey = children;
  for (let i = 0; i < list.length; i++) {
    const ele = list[i]
    if (ele[valueKey] == value) {
      return ele
    } else if (ele[childrenKey] && Array.isArray(ele[childrenKey])) {
      let node = findNodeByVal(ele[childrenKey], prop, value, childrenKey)
      if (node) return node
    }
  }
}

//加载js或css文件
export const loadJsCssFile = (url, type = 'js', dom = "body") => {
  console.log('load-', url);
  let flag = false;
  return new Promise((resolve) => {
    const head = dom == 'head' ? document.getElementsByTagName('head')[0] : document.body;
    for (let i = 0; i < head.children.length; i++) {
      let ele = head.children[i]
      if ((ele.src || '').indexOf(url) !== -1) {
        flag = true;
        resolve();
      }
    }
    if (flag) return;
    let script;
    if (type === 'js') {
      script = document.createElement('script');
      script.type = 'text/javascript';
      script.src = url;
    } else if (type === 'css') {
      script = document.createElement('link');
      script.rel = 'stylesheet';
      script.type = 'text/css';
      script.href = url;
    }
    head.appendChild(script);
    script.onload = function () {
      resolve();
    };
  });
};


//获取用多级变量获取json值 data.aa.bb.cc,data[aa][bb][cc]

/*export const getPropertyValue = (obj, prop, splitText = '.')=> {
  var props = prop.split(splitText);
  for (var i = 0; i < props.length; i++) {
    obj = obj[props[i]];
    if (obj === undefined) {
      return undefined;
    }
  }
  return obj;
}*/

//es6遍历写法
export const getPropertyValue = (obj, prop, splitText = '.') => {
  const [first, ...rest] = prop.split(splitText);
  return rest.length > 0 ? getPropertyValue(obj[first], rest.join(splitText)) : obj[first];
};

// 获取音频长度
export const getAudioDuration= (audioUrl)=> {
  return new Promise((resolve) => {
    const audio = new Audio(audioUrl);
    audio.addEventListener("loadedmetadata", () => {
      // console.log('1 - audio.duration', audio.duration);
      resolve(audio.duration);
    });
  });
}


// 检查二维数组区间是否重复
export const checkOverlap = (intervals)=> {
  // 先按区间的起点进行排序
  intervals.sort((a, b) => a[0] - b[0]);
  // 遍历区间，检查是否有重叠
  for (let i = 1; i < intervals.length; i++) {
    if (intervals[i][0] < intervals[i - 1][1]) {
      // 如果当前区间的起点小于前一个区间的终点，说明存在重叠
      return true;
    }
  }
  // 如果没有发现重叠的情况，返回 false
  return false;
}