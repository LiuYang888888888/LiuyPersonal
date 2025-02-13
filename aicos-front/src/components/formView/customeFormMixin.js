/**
 * 处理自定义表单
 */

export default {
  data() {
    return {
      customFormData: {}
    }
  },
  methods: {
    handleCustomForm(data) {
      const url = data.url.replace('@/views', '')

      import('@/views' + url + '.vue').then(Cmp => {
        // debugger
        this.$options.components.FormCmp = Cmp.default
        this.formType = 'custom'
        this.buildCustomFormData()
        // this.formDialogVisible = true
      })
    },
    buildCustomFormData() {
      const comboData = this.comboFormData(this.formData, this.formDataColumn)

      this.customFormData = this.buildFormData(comboData, this.formTemplateFlatJson)
    }
  }
}
