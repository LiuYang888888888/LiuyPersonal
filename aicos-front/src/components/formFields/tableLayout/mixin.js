
function createdDic (option) {
  let column = option.column || [];
  let ajaxdic = [];
  let locationdic = {};
  let flagdic = [];
  column.forEach(ele => {
    let dicData = ele.dicData;
    let dicUrl = ele.dicUrl;
    let prop = ele.prop;
    let parentProp = ele.parentProp;
    flagdic = flagdic.concat(ele.cascaderItem || []);
    if (Array.isArray(dicData)) {
      locationdic[prop] = dicData;
    }
    let result = ele.dicFlag === false || ele.remote === true || ele.lazy === true || flagdic.includes(prop)
    if (result) return;
    if (dicUrl && !parentProp) {
      ajaxdic.push({
        url: dicUrl,
        name: prop,
        method: ele.dicMethod,
        formatter: ele.dicFormatter,
        props: ele.props,
        dataType: ele.dataType,
        resKey: (ele.props || {}).res,
        query: ele.dicQuery
      });
    }
  });
  return {
    ajaxdic,
    locationdic
  };
}

let detailDic
// 循环处理字典
function handleDic (list) {
  let networkdic = {};
  let result = [];
  return new Promise(resolve => {
    list.forEach(ele => {
      result.push(
        new Promise(resolve => {
          sendDic(Object.assign(ele, {
            url: `${ele.url.replace('{{key}}', '')}`
          })).then(res => {
            res = detailDic(res, ele.props, ele.dataType);
            resolve(res);
          }).catch(() => {
            resolve([]);
          });
        })
      );
    });
    Promise.all(result).then(data => {
      list.forEach((ele, index) => {
        networkdic[ele.name] = data[index];
      });
      resolve(networkdic);
    });
  });
}

const getDeepData = (res) => {
  return (Array.isArray(res) ? res : res.data) || [];
};

const getObjValue = (data, params = '', type) => {
  const list = params.split('.');
  let result = data;
  if (list[0] === '' && type !== 'object') {
    return getDeepData(data);
  } else if (list[0] !== '') {
    list.forEach(ele => {
      result = result[ele];
    });
  }
  return result;
};

const sendDic = (params) => {
  let { url, query, method, resKey, props, formatter, value = '', column, form = {} } = params;
  if (column) {
    url = column.dicUrl;
    method = column.dicMethod;
    query = column.dicQuery || {};
    formatter = column.dicFormatter;
    props = column.props;
  }
  let key = "key"
  url = url || '';
  let list = [];
  let data = {};
  list = url.match(/[^{}]+(?=\})/g) || [];
  list.forEach(ele => {
    let eleKey = `{{${ele}}}`;
    let eleValue = form[ele];
    if (ele === key) url = url.replace(eleKey, value);
    else url = url.replace(eleKey, eleValue);
  })
  if (method === 'post') {
    list = Object.keys(query);
    list.forEach(ele => {
      let eleKey = query[ele] + '';
      let eleValue = form[eleKey.replace(/\{{|}}/g, '')];
      if (eleKey.match(/\{{|}}/g)) {
        data[ele] = eleKey.replace(eleKey, eleKey.indexOf(key) !== -1 ? value : eleValue);
      } else {
        data[ele] = eleKey;
      }
    });
  }

  if (props) resKey = (props || {}).res || resKey;
  return new Promise(resolve => {
    const callback = (res) => {
      let list = [];
      if (typeof formatter === 'function') {
        list = formatter(res.data);
      } else {
        list = getObjValue(res.data, resKey);
      }
      resolve(list);
    };
    if (!window.axios) {
      // packages.logs('axios');
      resolve([]);
    }
    if (method === 'post') {
      window.axios.post(url, data).then(function (res) {
        callback(res);
      }).catch(() => [
        resolve([])
      ]);
    } else {
      window.axios.get(url, {
        params: query
      }).then(function (res) {
        callback(res);
      }).catch(() => [
        resolve([])
      ]);
    }
  });
};

export default {
  created() {
    detailDic = this.detailDic
  },
  methods: {
    loadLocalDic(){
      let locationdic = {};
      let alldic = /*option.dicData ||*/ {};
      this.allFields.forEach(ele => {
        if (ele.dicData) locationdic[ele.prop] = this.detailDic(ele.dicData, ele.props, ele.dataType);
      });
      return Object.assign(alldic, locationdic);
    },
    detailDataType(value, type){
      if (this.validatenull(value)) return value
      if (type === 'number') {
        return Number(value);
      } else if (type === 'string') {
        return value + '';
      } else {
        return value;
      }
    },
    /**
     * 数组的数据类型转化
     */
    detailDic(list = [], props = {}, type){
      let valueKey = props.value || 'value';
      let childrenKey = props.children || 'children';
      list.forEach(ele => {
        ele[valueKey] = this.detailDataType(ele[valueKey], type);
        if (ele[childrenKey]) this.detailDic(ele[childrenKey], props, type);
      });
      return list;
    },
    loadDic(option){
      let ajaxdic = []; // 发送ajax的字典
      return new Promise((resolve, reject) => {
        const params = createdDic(option);
        ajaxdic = params.ajaxdic;
        if (!window.axios && !this.validatenull(ajaxdic)) {
          // packages.logs('axios');
          resolve();
        }
        handleDic(ajaxdic)
          .then((res) => {
            resolve(res);
          })
          .catch(err => {
            reject(err);
          });
      });
    },
  }
}
