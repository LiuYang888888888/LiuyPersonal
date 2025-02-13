<template>
  <avue-form
    ref="headerForm"
    v-model="data"
    :option="headerFormOption"
  />
</template>

<script>
/**
 * 自定义表单要求：
 * 1、属性：
 *        formData 反显时用的表单的数据
 * 2、方法：
 *      buildSubmitData： 返回要提交表单的json字符串
 * 说明： 表单字段和提交字段的格式是不一样的，例如对于的后台字段为string_title，但提交时使用的是stringTitle,
 * 下面四种字段可以重复使用：
 * String: 'columnStringField',
   Integer: 'columnIntegerField',
   Float: 'columnFloatField',
   Datetime: 'columnDatetimeField',
 */
import { getObjType } from '@/util/util'

export default {
  name: "testForm",
  props: {
    formData: {
      type: Object,
      default() {
        return {}
      }
    }
  },
  data() {
    return {
      data: this.formData,
      headerFormOption: {
        menuBtn: false,
        // detail: true,
        column: [
          {
            label: '自定义标题',
            prop: 'string_title'
          },
          {
            label: '自定义描述',
            prop: 'string_summary'
          },
          {
            label: '可以多次使用的字段1',
            prop: 'column_string_field_1632449160002_95502'
          },
          {
            label: '可以多次使用的字段2',
            prop: 'column_string_field_1632449195323_51124'
          }
        ]
      }
    }
  },
  methods: {
    buildSubmitData() {
      let res = []
      for(let [key, val] of Object.entries(this.formData)) {
        if(!key.startsWith('$')) {
          let v = val
          if(Array.isArray(val)) {
            // 处理上传控件，上传多图时的存储
            if(getObjType(val[0]) === 'object') {
              v = JSON.stringify(val)
            }else {
              v = val.join()
            }
          }
          res.push({name: key, value: v})
        }
      }
      return JSON.stringify(res)
    },
    validate(cb) {
      return this.$refs.headerForm.validate(cb)
    }
  }
}
</script>

<style scoped>

</style>
