<template>
  <div>
    <SelectPublishedForm @change="handleFormChange"/>
    <FormPreview
      ref="form"
      :option="formOption"
      :data="formData"
      :fieldAuth="fieldAuth"
      :formDataColumn="formDataColumn"
      :formTemplateFlatJson="formTemplateFlatJson"
    />
<!--    <el-button @click="submitToCreate">提交</el-button>-->
  </div>
</template>

<script>
import FormPreview from '@/components/formPreview'
import SelectPublishedForm from './selectPublishedForm'

// import {getItemInfo} from '@/api/mywork/worklist'
import { getBaseFormTemplateVersionById } from '@/api/system/form'
import { runToStartUserTask } from '@/api/system/form'
import { getProcessFormRelationByFormTemplateVersionId } from '@/api/system/flow'

export default {
  name: "index",
  components: {
    FormPreview,
    SelectPublishedForm
  },
  data() {
    return {
      formOption: {
        menuBtn: false,
        column: []
      },
      formId: '',
      formData: {},
      fieldAuth: [],
      formDataColumn: [],
      formTemplateFlatJson: [],
      processId: 'qyc1:66:012c33f4-1835-11ec-a6e6-003676252cc5'
    }
  },
  methods: {
    async getData(formId) {
      // const row = this.cur
      // const param = {
      //   processInstanceId: row.processInstanceId,
      //   taskId: row.taskId,
      //   processDefinitionId: row.processDefinitionId,
      //   taskDefinitionKey: row.taskDefinitionKey
      // }
      // const formId = '35a173c43ca166676c95032bda9894e7'
      const {data:{data:{formTemplateJson, formTemplateFlatJson}}} = await getBaseFormTemplateVersionById(formId)

      this.formOption = JSON.parse(formTemplateJson)
      this.formTemplateFlatJson = JSON.parse(formTemplateFlatJson)
      // const params = {
      //   taskId: row.taskId,
      //   processDefinitionId: row.processDefinitionId,
      //   taskDefinitionKey: row.taskDefinitionKey,
      //   processInstanceId: row.processInstanceId
      // }
      // const {data:{data: buttons}} = await getInitButtonByCurrentTaskId(params)
      // // console.log(buttons)
      // const btnArr = buttons.map(item => item.value)
      // this.handleButtons = btnArr
      // console.log(formData)
      // console.log(formTemplateVersion)



      // this.formTemplateVersionId = formTemplateVersion.id
      // this.formDataId = formData && formData.id || ''
      // this.fieldAuth = JSON.parse(extendConfigration.fieldAuth)
      // this.formData = formData
      // this.formDataColumn = formDataColumn
      // this.formTemplateFlatJson = JSON.parse(formTemplateVersion.formTemplateFlatJson)
      //
      // if(formTemplateVersion.type === 'custom') {
      //   this.handleCustomForm(formTemplateVersion)
      // }else {
      //   this.formType = 'system'
      //   if(formTemplateVersion.formTemplateJson) {
      //     let formOption = JSON.parse(formTemplateVersion.formTemplateJson)
      //
      //     // this.handleFormFieds(formOption, JSON.parse(extendConfigration.fieldAuth))
      //     // if(!btnArr.includes('submit')) {
      //     // formOption.menuBtn = false
      //     // }
      //     this.formOption = formOption
      //
      //
      //
      //     // const comboData = this.comboFormData(formData, formDataColumn)
      //     // this.formData = this.buildFormData(comboData, JSON.parse(formTemplateVersion.formTemplateFlatJson))
      //
      //
      //     // this.formDialogVisible = true
      //     // this.detailDialogVisible = true
      //   }
      // }

    },
    async handleFormChange(data) {
      const {data:res} = await getProcessFormRelationByFormTemplateVersionId(data.formId)
      console.log(res)

      this.formId = data.formId
      this.formOption = data.formTemplateJson
      this.formTemplateFlatJson = data.formTemplateFlatJson
    },
    getFormData() {
      return this.$refs.form.getSubmitData()
    },
    submitToCreate(callback) {
      this.$refs.form.validate((valid, done/*, msg*/)=> {
        if(!valid) {
          return
        }
        const params = {
          processId: this.processId,
          formTemplateVersionId: this.formId,
          formDataJson: this.$refs.form.buildSubmitData()
        }
        runToStartUserTask(params).then(() => {
          if(callback) {
            callback()
          }
          done()
          this.$message({
            type: "success",
            message: "操作成功!"
          });
        })
      })

    }
  },
  mounted() {
    // this.getData()
    window.formProviewTools.getFormData = this.getFormData
    window.formProviewTools.submitData = this.submitToCreate
  }
}
</script>

<style scoped>

</style>
