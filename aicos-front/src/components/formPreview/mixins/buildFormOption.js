/**
 * 根据条件生成展示时使用的表单的配置
 */
export default {
  methods: {
    getProp(col) {
      if(col.prop.startsWith('column_')) {
        return col.columnId
      }else {
        return col.prop
      }
    },
    handleFieldVisible(col, fieldAuth) {
      const auth = fieldAuth[col.prop]
      switch (auth) {
        case 'edit':
          col.disabled = false
          break
        case 'visible':
          col.disabled = true
          break
        case 'hidden':
          col.display = false
          break
      }
      // 只能查看和隐藏的字段删除必填校验
      if(auth && auth != 'edit' && col.rules) {
        col.rules.forEach(item => {
          if(item.required) {
            item.required = false
          }
        })
      }
    },
    // 处理校验规则
    handleRule(col) {
      if(!col.rules) {
        return
      }
      // 处理正则和函数校验
      col.rules.forEach(item=>{
        if(item.pattern) {
          item.pattern = new RegExp(item.pattern);
        }
        if(item.validator) {
          item.validator = eval(`(${item.validator})`);
        }
      })
    },
    // 处理事件函数
    handleEvent(col) {
      if (col.change){
        col.change = eval(`(${col.change})`);
      }

      if (col.click) {
        col.click = eval(`(${col.click})`);
      }

      if (col.focus) {
        col.focus = eval(`(${col.focus})`);
      }

      if (col.blur) {
        col.blur = eval(`(${col.blur})`);
      }
    },
    handleTableField(tableConfig, fieldAuth) {
      tableConfig.data.forEach(row=>{
        row.forEach(col=>{
          this.handleFormFieds(col.children, fieldAuth);
        })
      })
    },
    handleFormFieds(data, fieldAuth){
      let list = [];
      if(Array.isArray(data)) {
        list = data
      }else {
        list = data.column;
      }
      for(let i = 0,l = list.length; i<l; i++) {
        const col = list[i]

        // dataType属性和 cascader的属性重复，造成需要选择两次才会显示级联的数据
        if(col.dataType) {
          delete col.dataType
        }
        if(col.type == 'dynamic' && col.children && col.children.column && col.children.column.length >0) {
          this.handleFormFieds(col.children, fieldAuth);
        }else if(col.type == 'table') {
          this.handleTableField(col, fieldAuth);
        }else {
          col.prop = this.getProp(col)
          this.handleRule(col)
          this.handleEvent(col)
          this.handleFieldVisible(col, fieldAuth)
          // 省市县的时候需要
          if(col.type === 'cascader' && col.dicFormatter && typeof col.dicFormatter === 'string') {
            col.dicFormatter = eval(`(${col.dicFormatter})`);
          }
        }
      }
      // 处理group
      if(data.group) {
        data.group.forEach(group => {
          if(group.prop) {
            group.prop = this.getProp(group)
          }
          this.handleFieldVisible(group, fieldAuth)
          this.handleFormFieds(group, fieldAuth)
        })
      }
      return data
    }
  }
}
