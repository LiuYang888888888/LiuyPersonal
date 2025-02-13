<template>
  <div>
    <avue-form ref="faqBasicFormRef" v-model="faqBasicFormData" :option="faqBasicFormOption">
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
        properType: "名词",
        properWord: "",
      },
      faqBasicFormOption: {
        column: [
          {
            label: this.$t('doc.properWordName'),
            prop: "properWord",
            display: true,
            span: 24,
            rules: [{ required: true, message: this.$t('aicosCommon.pleaseInput') + this.$t('doc.properWordName') }],
          },
          {
            label: "fileKnowledgeId",
            prop: "fileKnowledgeId",
            display: false,
          },
          {
            type: "select",
            label: this.$t('doc.partOfSpeech'),
            display: true,
            span: 24,
            dicData: [
              {
                label: this.$t('doc.noun'),
                value: "名词",
              },
              {
                label: this.$t('doc.verb'),
                value: "动词",
              },
              {
                label: this.$t('doc.adjective'),
                value: "形容词",
              },
              {
                label: this.$t('doc.adverb'),
                value: "副词",
              },
            ],
            // dicUrl: `/api/${aiworkorder}/kgcc-label/tree`,
            // props: { label: "title", value: "id" },
            prop: "properType",
            rules: [{ required: true, message: this.$t('doc.selectPartOfSpeech') }],
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
      if (this.tool === "add") {
        this.faqBasicFormData.properWord = this.markForm.text;
        this.faqBasicFormData.fileKnowledgeId = this.markForm.rowId;
        this.faqBasicFormData.applicationId = this.botObj.id;
      }
      if (this.tool === "edit") {
        this.faqBasicFormData = this.markForm;
      }
    },
    // 保存专有词新增
    saveFaqBasic () {
      let basicData = { ...this.faqBasicFormData };
      return basicData;
    },
  },
};
</script>

<style scoped lang="scss"></style>
