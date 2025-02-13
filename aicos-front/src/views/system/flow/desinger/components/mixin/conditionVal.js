import request from '@/router/axios';
export default {
  methods: {
    // 获取指定字段的dicData或远程数据
    getFildData(fieldName) {
      const formTemplateJson = this.desinger.processInfo.formTemplateJson
      let field = this.findObject(formTemplateJson.column, fieldName)
      // 如果column中没有，从分组中获取
      if(field === -1 && formTemplateJson.group) {
        field = this.findObject(formTemplateJson.group, fieldName)
      }
      if(field !== -1) {
        // 本地数据
        if(field.dicData) {
          return this.flatNestData(field.dicData)
        }else {
          // 异步数据
          return this.getRemotData({
            url: field.dicUrl,
            method: field.dicMethod,
            query: field.dicQuery,
            props: field.props
          })
        }
      }else {
        return []
      }
    },
    // 将嵌套的数据解析出来
    flatNestData(data) {
      const result = data.reduce((result, item)=> {
        result.push(item)
        if(item.children) {
          return result.concat(this.flatNestData(item.children))
        }else {
          return result
        }
      },[])
      return result
    },
    async getRemotData({query, props,...rest}) {
      const req = {...rest}
      if(req.method && req.method.toLowerCase() === 'post') {
        req.data = query
      }else {
        req.query = query
      }
      const {data} = await request(req)
      // debugger
      // 省市县、部门一次把所有的数据都返回回来了
      const flatData = this.flatNestData(data[props.res || 'data'])
      const res = flatData.map(item=> {
        return {
          label: item[props.label],
          value: item[props.value]
        }
      })
      return res
    }
  }
}
