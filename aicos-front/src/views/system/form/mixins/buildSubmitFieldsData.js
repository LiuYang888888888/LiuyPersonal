import {getObjType} from "@/util/util";

export default {
  methods: {
    buildTableFieldData(data) {
      let res = [];
      data.data.forEach(row=>{
        row.forEach(cell=>{
          cell.children.forEach(item=>{
            if(item.type !== 'html') {
              res.push(item)
            }
          })
        })
      })
      return res;
    },
    buildSubFormFieldData(data) {
      const fields = this.buildFieldListData(data.children.column);

      // return JSON.stringify(fields)
      return fields
    },
    buildFieldListData(listData) {
      const listClone = this.deepClone(listData);
      const list = listClone.filter(item=>{
        // 过滤掉类型为html的元素
        return item.type !== 'html'
      });
      // this.useableFields为空时需要处理prop
      if(this.useableFields.length === 0) {
        list.forEach(item=> {
          item.prop = `${item.dataType}_${item.prop}`
        })
      }
      const fields = list.map(item => {
        let type = ''
        if(getObjType(item.value) === 'string') {
          let match = item.value.match(/\${(\S+)}/)
          if(match && match[1]) {
            type = match[1]
          }
        }
        // if(item.value == '${currentUser}') {
        //   type = 'account'
        // }else if(item.value == '${currentUserDept}') {
        //   type = 'dept'
        // }
        // 含有给定默认值的字段，为只读字段
        // if(type) {
        //   item.readonly = true
        // }
        const res = {
          name: item.prop,
          dataType: item.dataType,
          // dataType: dataTypeMap[item.type],
          type,
          displayName: item.label,
          // group 中的字段没有search、isListDisplay
          isListSearch: !!item.search,
          isListDisplay: !!item.isListDisplay,
          formType: item.type
        }
        if(item.columnId) {
          res.columnId = item.columnId
        }
        return res
      })
      return fields
    },
    buidSubmitData(data) {
      let list = data.column
      if(data.group) {
        list = data.group.reduce((sum, item) => {
          return sum.concat(item.column)
        }, list)
      }
      const listClone = this.deepClone(list);
      listClone.forEach((item, index)=> {
        if(item.type === 'table') {
          const items = this.buildTableFieldData(item);
          listClone.splice(index, 1, ...items)
        }
      })
      // 过滤出子表单
      const dynamicList = listClone.filter(item=>{
        return item.type === 'dynamic'
      })
      let dynamicFlat = {}
      dynamicList.forEach(item=>{
        const res = this.buildSubFormFieldData(item)
        dynamicFlat[item.prop] = res;
      })

      list = listClone.filter(item=>{
        // 过滤掉类型为html的元素和子表单
        return item.type !== 'html' && item.type != 'dynamic'
      });
      const fields = this.buildFieldListData(list)
      // 如果为自定义字段时，提交时需要在字段前添加类型
      if(this.useableFields.length === 0) {
        this.buildFieldsProp(data)
      }
      return {
        formTemplateFlatJson: JSON.stringify(fields),
        formTemplateOnetomanyFlatJson: JSON.stringify(dynamicFlat),
        formTemplateJson: JSON.stringify(data)
      }
    },
    /**
     * 自定义字段，添加数据类型前缀
     * 自定义类型中没有子表单，这里没有处理dynamic
     * @param data
     */
    buildFieldsProp(data) {
      data.column.forEach(item=>{
        if(item.type=== 'table') {
          item.data.forEach(row=>{
            row.forEach(cell=>{
              cell.children.forEach(field=>{
                if(field.type != 'html') {
                  field.prop = `${field.dataType}_${field.prop}`
                }
              })
            })
          })
        }else {
          if(item.type != 'html') {
            item.prop = `${item.dataType}_${item.prop}`
          }
        }
      })
      if(data.group) {
        data.group.forEach((group) => {
          this.buildFieldsProp(group)
        })
      }
    }
  }
}
