<template>
  <avue-form
    ref="form"
    :option="formOption"
    v-model="formData"
    @submit="handleFormSubmit"
    :class="formCls"
    :style="formStyle"
    :upload-error="handleUploadError"
    :upload-exceed="handleuploadExceed"
  />
</template>

<script>
import buildFormOption from './mixins/buildFormOption'
import buildFormData from './mixins/buildFormData'
import { getObjType } from '@/util/util'
export default {
  name: 'index',
  mixins: [buildFormOption, buildFormData],
  props: {
    option: {
      type: Object,
      default() {
        return {}
      }
    },
    data: {
      type: Object,
      default() {
        return {}
      }
    },
    fieldAuth: {
      type: Object,
      default() {
        return {}
      }
    },
    // 表单列存储方式字段存储的数据
    formDataColumn: {
      type: Array,
      default() {
        return []
      }
    },
    formTemplateFlatJson: {
      type: Array,
      default() {
        return []
      }
    },
    // 子表单的数据的flatJson
    formTemplateOnetomanyFlatJson: {
      type: Object,
      default() {
        return {}
      }
    },
    handleFormSubmit: {
      type: Function,
      default() {
        return () => {}
      }
    }
  },
  data() {
    return {
      formOption: {},
      formData: {},
      // needEmit: false
    }
  },
  computed: {
    formCls() {
      return {
        'form-hasbg': !!this.option.bgURL
      }
    },
    formStyle() {
      if(this.option.bgURL) {
        return {
          background:`url(${this.option.bgURL}) left top no-repeat`,
          backgroundSize: '100%'
        }
      }else {
        return ''
      }
    }
  },
  watch: {
    option: {
      handler(val) {
        // debugger
        this.formOption = this.handleFormFieds(val, this.fieldAuth)
        // this.formOption.menuBtn = true
      },
      immediate: true
    },
    data: {
      handler(val) {
        // debugger
        const comboData = this.comboFormData(val||{}, this.formDataColumn)

        this.formData = this.buildFormData(comboData, this.formTemplateFlatJson, this.formTemplateOnetomanyFlatJson)
        // this.needEmit = false
      },
      immediate: true
    },
    // formData(val) {
    //   if(this.needEmit) {
    //     this.$emit('update:data', val)
    //   }else {
    //     this.needEmit = true
    //   }
    // }
  },
  methods: {
    submit() {
      this.$refs.form.submit()
    },
    handleDynamicData(list) {
      const data = list.map(item=>{
        const res = []
        for(let [key,val] of Object.entries(item)) {
          if(!key.startsWith('$') && key !== '_index') {
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
        return res
      })
      return JSON.stringify(data);
    },
    // 将表单的数据转换为提交时需要的数据格式
    buildSubmitData() {
      let res = []
      // console.log(this.formData)
      for(let [key, val] of Object.entries(this.formData)) {
        if(!key.startsWith('$')) {
          let v = val
          if(Array.isArray(val)) {
            //处理子表单
            if(key.startsWith('AiCOSFormOneToMany')) {
              v = this.handleDynamicData(val);
            }else {
              // 处理上传控件，上传多图时的存储
              if(getObjType(val[0]) === 'object') {
                v = JSON.stringify(val)
              }else {
                v = val.join()
              }
            }
          }
          res.push({name: key, value: v})
        }
      }
      return JSON.stringify(res)
    },
    getSubmitData() {
      return this.formData
    },
    reset() {
      this.$refs.form.resetForm()
    },
    validate(callback) {
      this.$refs.form.validate(callback)
    },
    handleUploadError(err) {
      this.$message.error(err)
    },
    handleuploadExceed(limit) {
      this.$message.error(`最多上传${limit}个文件`)
    }
    // handleFormSubmit() {
    //
    // }
  }
}
</script>

<style lang="scss" scoped>
.form-hasbg {
  /deep/.el-collapse-item__wrap {
    background: none;
  }
}
</style>
