// 按分组显示表单字段

export default {
  computed: {
    groupedFields() {
      const fields = this.desinger.formFields;
      const tplJson = this.desinger.processInfo.formTemplateJson;

      const flatJson = this.flatTplJson(tplJson)
      const res = flatJson.map(item=> {
        if(item.isGroup) {
          return item
        }
        const field = fields.find(it=> {
          let name = it.name;
          let prop = item.prop;

          if(prop.startsWith('column_')) {
            name = it.columnId
            prop = item.columnId
          }
          return name === prop
        })

        return field
      })
      return res
    }
  },
  methods: {
    flatTplJson(data) {
      let temp = [...data.column]
      const group = []

      if(data.group) {
        data.group.forEach(item=>{
          if(item.hasOwnProperty('label')) {
            // 添加name属性，否则在fieldSetting中报错
            group.push({displayName: item.label, isGroup: true, name: item.prop})
            group.push(...item.column)
          }else {
            temp.push(...item.column)
          }
        })
      }
      temp = temp.concat(group);
      // 处理table类型的表单项
      const res = []
      temp.forEach(item=> {
        if(item.type === 'table') {
          const tableFields = this.getTableFields(item.data)
          res.push(...tableFields)
        }else {
          res.push(item)
        }
      })
      return res
    },
    getTableFields(data) {
      const res = [];
      data.forEach(row=> {
        row.forEach(cell=>{
          res.push(...cell.children)
        })
      })
      return res
    }
  }
}
