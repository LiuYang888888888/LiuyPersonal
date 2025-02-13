<template>
  <div v-loading="loading">
    <template v-if="loaded">
      <FormPreview
        v-if="formType !=='custom'"
        ref="form"
        :option="formOption"
        :data="formData"
        :fieldAuth="fieldAuth"
        :formDataColumn="formDataColumn"
        :formTemplateFlatJson="formTemplateFlatJson"
        :handleFormSubmit="handleFormSubmit"
        style="padding-left: 10px;"
      />
      <component
        v-else
        ref="form"
        :is="customCmp"
        :formData="customFormData"
        :fieldAuth="fieldAuth"
      />
    </template>
  </div>
</template>

<script>
import FormPreview from '../formPreview'
import customeFormMixin from './customeFormMixin'
import buildFormData from '../formPreview/mixins/buildFormData'
import { saveOrUpdateFormData } from '@/api/system/form'

export default {
  name: 'index',
  components: {
    FormPreview
  },
  mixins: [customeFormMixin, buildFormData],
  props: {
    /**
     * 节点信息或者表单的配置信息
     */
    data: {
      type: Object,
      default() {
        return {}
      }
    },
    /**
     * 通过流程节点来获取表单信息，需要传入获取方法
     *
     * 已办结和未办结的接口不一致
     */
    getInfo: {
      type: Function,
      default() {
        return () => {}
      }
    }
  },
  data() {
    return {
      formType: 'system',
      customCmp: 'FormCmp',
      formOption: {
        menuBtn: false,
        column: []
      },
      formData: {},
      fieldAuth: {},
      formDataColumn: [],
      formTemplateFlatJson: [],
      formTemplateOnetomanyFlatJson: {},
      formTemplateVersionId: '',
      formDataId: '',
      loading: false,
      loaded: false,
    }
  },
  watch: {
    data:{
      handler() {
        this.getData()
      },
      immediate: true
    }
  },
  methods: {
    /**
     * 通过后台返回的表单的信息来拼装表单格式和数据格式
     */
    buildCfg(cfg) {
      const {extendConfigration, formData={}, formDataColumn, formTemplateVersion} = cfg

      this.formTemplateVersionId = formTemplateVersion.id;
      this.formDataId = formData && formData.id || '';
      if(extendConfigration) {
        this.fieldAuth = JSON.parse(extendConfigration.fieldAuth);
      }
      this.formData = formData;
      this.formDataColumn = formDataColumn || [];
      this.formTemplateFlatJson = JSON.parse(formTemplateVersion.formTemplateFlatJson);

      // dynamicList 处理子表单
      // this.formTemplateOnetomanyFlatJson = JSON.parse()

      if(formTemplateVersion.type === 'custom') {
        this.handleCustomForm(formTemplateVersion)
      }else {
        this.formType = 'system'
        if(formTemplateVersion.formTemplateJson) {
          let formOption = JSON.parse(formTemplateVersion.formTemplateJson)

          this.formOption = formOption
        }
      }
    },
    // 通过流程节点来获取表单的数据和配置
    async getData() {
      const row = this.data
      let cfg = row;

      // 如果含taskId认为它是通过接口调用表单的配置
      if(row.taskId) {
        const param = {
          processInstanceId: row.processInstanceId,
          taskId: row.taskId,
          processDefinitionId: row.processDefinitionId,
          taskDefinitionKey: row.taskDefinitionKey
        }
        this.loading = true
        const {data:{data}} = await this.getInfo(param)
        cfg = data
        this.loading = false
      }

      this.buildCfg(cfg)
      this.loaded = true

    },
    async handleFormSubmit(ext={}) {
      let isValid
      await this.$refs.form.validate(valid=>{
        isValid = valid
      })
      if(!isValid) {
        return {
          success: false
        }
      }
      const params = {
        id: this.formDataId,
        status: '1',
        formTemplateVersionId: this.formTemplateVersionId,
        formDataJson: this.$refs.form.buildSubmitData()
      }
      if(arguments.length == 1) {
        Object.assign(params, ext)
      }
      const {data} = await saveOrUpdateFormData(params)

      if(!data.success) {
        this.$message.error('保存表单数据失败！')
      }
      return data
    },
    getForm() {
      return this.$refs.form
    },
    printForm() {
      const dom = this.$refs.form.$el

      this.$Print(dom)
    }
  }
}
</script>

<style scoped>

</style>
