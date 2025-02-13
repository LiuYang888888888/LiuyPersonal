<template>
  <div>
    <avue-form ref="faqBasicFormRef" v-model="faqBasicFormData" :option="faqBasicFormOption" @submit="saveFaqBasic">
    </avue-form>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
export default {
  props: {
    markForm: {
      type: Object,
      default: () => {
        return {};
      },
    },
    tool: {
      type: String,
      default: "",
    },
  },
  data () {
    return {
      faqBasicFormData: {
        sensitiveWord: "",
      },
      faqBasicFormOption: {
        column: [
          {
            label: this.$t('doc.sensitive'),
            prop: "sensitiveWord",
            display: true,
            span: 24,
            rules: [{ required: true, message: this.$t('aicosCommon.pleaseInput') + this.$t('doc.sensitive') }],
          },
        ],
        span: 16,
        labelPosition: "right",
        labelSuffix: "：",
        labelWidth: 120,
        gutter: 0,
        menuBtn: false,
        submitBtn: false,
        emptyBtn: false,
      },
    };
  },
  mounted () {
    this.setFaqBasicData();
  },
  computed: {
    ...mapGetters(["botObj", 'language']),
  },
  watch: {
    language: {
      handler (newVal) {
        // && this.faqType != "view"
        this.faqBasicFormOption.labelPosition = newVal != 'zh' ? 'top' : 'right'
      },
      immediate: true,
    }
  },
  methods: {
    // 设置数据
    setFaqBasicData () {
      if (this.tool === 'add') {
        this.faqBasicFormData.sensitiveWord = this.markForm.text
        this.faqBasicFormData.fileKnowledgeId = this.markForm.rowId;
        this.faqBasicFormData.applicationId = this.botObj.id;
      }
      if (this.tool === 'edit') {
        this.faqBasicFormData = this.markForm;
      }
    },
    // 保存faq基础设置
    saveFaqBasic () {
      let basicData = { ...this.faqBasicFormData };
      return basicData;
    },
  },
};
</script>

<style scoped lang="scss"></style>
