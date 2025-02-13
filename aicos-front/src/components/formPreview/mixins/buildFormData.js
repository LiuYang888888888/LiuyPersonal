/**
 * 将后台存储的数据格式转换为表单的数据格式
 */

export default {
  methods: {
    comboFormData(data, formDataColumn) {
      const res = this.deepClone(data)
      const map = {
        String: 'columnStringField',
        Integer: 'columnIntegerField',
        Float: 'columnFloatField',
        Datetime: 'columnDatetimeField',
      }
      formDataColumn.forEach(col=> {
        res[col.columnId] = col[map[col.columnType]]
      })
      return res
    },
    // 将存储的数据转换为表单需要的数据格式
    buildFormData(data, fields, subFields) {
      const res = {};
      fields.forEach(({name, columnId, formType}) => {
        let fieldName = name.replace(/_(\S)/g, function(v, v1) {
          return v1.toUpperCase()
        })
        if(name.startsWith('column_')) {
          res[columnId] = data[columnId]
        }else {
          res[name] = data[fieldName]
        }
        // if(type == 'account') {
        //   res[name] = '${currentUser}'
        // }else if (type == 'dept') {
        //   res[name] = '${currentUserDept}'
        // }
        if(['cascader','checkbox'].includes(formType)) {
          if(data[fieldName]){
            res[name] = data[fieldName].split(',')
          }else {
            res[name] = []
          }
        }
        if(formType === 'upload' && data[fieldName]) {
          if(data[fieldName].startsWith('[{')) {
            res[name] = JSON.parse(data[fieldName])
          }
        }
      })
      // 处理子表单数据
      for(let [key, val] of Object.entries(subFields)) {
        const subList = data[key] || [];
        const subData = subList.map(row=>{
          return this.buildFormData(row, val, {})
        })
        res[key] = subData
      }
      return res
    }
  }
}
