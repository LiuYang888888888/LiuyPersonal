<template>
  <div>
    <avue-form ref="form" v-model="form" :option="option" @submit="saveForm">
    </avue-form>
  </div>
</template>
<script>
import { mapGetters } from "vuex";
import { getRules } from "@/util/regx";
import { settingView } from "@/api/kwKnowledgeCenter/kwSettings/formsetting/index";
export default {
  props: {
    row: {
      type: Object,
      default: () => {
        return {};
      },
    },
  },
  computed: {
    ...mapGetters(["language"]),
  },
  data() {
    return {
      form: {},
      option: {
        column: [
          {
            type: "input",
            label: this.$t("formsetting.EnglishName"),
            span: 24,
            display: true,
            prop: "nameEn",
            readonly: false,
            disabled: false,
            detail: true,
          },
          {
            type: "input",
            label: this.$t("formsetting.ChineseName"),
            span: 24,
            display: true,
            prop: "nameZh",
            required: true,
            maxlength: 30,
            showWordLimit: true,
            rules: [
              {
                required: true,
                message:
                  this.$t("aicosCommon.pleaseInput") +
                  this.$t("formsetting.ChineseName"),
              },
              ...getRules(["charNumHan"]),
            ],
          },
          {
            type: "textarea",
            label: this.$t("formsetting.alias"),
            span: 24,
            display: true,
            prop: "alias",
            tip: '多个别名间，请用"||"隔开',
          },
          {
            type: "select",
            label: this.$t("formsetting.displayType"),
            dicData: [
              {
                label: this.$t("formsetting.text"),
                value: 0,
              },
              {
                label: this.$t("formsetting.textBox"),
                value: 1,
              },
              {
                label: this.$t("formsetting.textField"),
                value: 2,
              },
              {
                label: this.$t("formsetting.textTieldAnnex"),
                value: 3,
              },
              {
                label: this.$t("formsetting.select"),
                value: 4,
              },
              {
                label: this.$t("formsetting.radio"),
                value: 5,
              },
              {
                label: this.$t("formsetting.check"),
                value: 6,
              },
              {
                label: this.$t("formsetting.dateControl"),
                value: 7,
              },
              {
                label: this.$t("formsetting.attachmentControl"),
                value: 8,
              },
              {
                label: this.$t("formsetting.imageUpload"),
                value: 9,
              },
              {
                label: this.$t("formsetting.editor"),
                value: 10,
              },
            ],
            span: 24,
            display: true,
            props: {
              label: "label",
              value: "value",
            },
            change: ({ value }) => {
              const dateType = this.findObject(this.option.column, "dateType");
              const content = this.findObject(this.option.column, "content");
              if (value === 1) {
                if (
                  this.form.dateType === undefined ||
                  this.form.dateType === null
                ) {
                  this.form.dateType = 0;
                }
                dateType.display = true;
              } else {
                this.form.dateType = undefined;
                dateType.display = false;
              }
              if (value === 4 || value === 5 || value === 6) {
                content.display = true;
              } else {
                content.display = false;
              }
            },
            prop: "displayType",
          },
          {
            type: "textarea",
            label: this.$t("formsetting.selections"),
            span: 24,
            display: false,
            prop: "content",
            rules: [
              {
                required: true,
                message:
                  this.$t("aicosCommon.pleaseInput") +
                  this.$t("formsetting.selections"),
              },
            ],
            tip: this.$t("formsetting.multipleDataTips"),
          },
          {
            type: "radio",
            label: this.$t("formsetting.dataType"),
            // value: 0,
            dicData: [
              {
                label: this.$t("formsetting.text"),
                value: 0,
              },
              {
                label: this.$t("formsetting.integer"),
                value: 1,
              },
              {
                label: this.$t("formsetting.decimal"),
                value: 2,
              },
            ],
            span: 24,
            display: false,
            prop: "dateType",
          },
          {
            type: "radio",
            label: this.$t("formsetting.isItMandatory"),
            dicData: [
              {
                label: this.$t("aicosCommon.yes"),
                value: 1,
              },
              {
                label: this.$t("aicosCommon.no"),
                value: 0,
              },
            ],
            span: 24,
            display: true,
            props: {
              label: "label",
              value: "value",
            },
            prop: "ifRequired",
          },
          {
            type: "radio",
            label: this.$t("formsetting.answerDisplayEle"),
            dicData: [
              {
                label: this.$t("aicosCommon.yes"),
                value: 1,
              },
              {
                label: this.$t("aicosCommon.no"),
                value: 0,
              },
            ],
            span: 24,
            display: true,
            props: {
              label: "label",
              value: "value",
            },
            prop: "ifAnswerDisplay",
          },
          {
            label: this.$t("formsetting.minimumCharacters"),
            prop: "minimumCharacters",
            type: "number",
            span: 24,
            rules: [
              {
                pattern: /(^[0-9]\d*$)/,
                message: this.$t("positiveNumberTips"),
              },
            ],
          },
          {
            type: "select",
            label: this.$t("formsetting.detectionType"),
            dicData: [
              {
                label: this.$t("formsetting.noParity"),
                value: 0,
              },
              {
                label: this.$t("formsetting.phoneNumber"),
                value: 1,
              },
              {
                label: this.$t("formsetting.landlineNumber"),
                value: 2,
              },
              {
                label: this.$t("formsetting.IDCard"),
                value: 3,
              },
              {
                label: this.$t("formsetting.mailbox"),
                value: 4,
              },
              {
                label: this.$t("formsetting.digit"),
                value: 5,
              },
              {
                label: this.$t("formsetting.letter"),
                value: 6,
              },
              {
                label: this.$t("formsetting.string"),
                value: 7,
              },
              {
                label: this.$t("formsetting.integer"),
                value: 8,
              },
              {
                label: this.$t("formsetting.decimal"),
                value: 9,
              },
              {
                label: this.$t("formsetting.date"),
                value: 10,
              },
            ],
            span: 24,
            display: true,
            props: {
              label: "label",
              value: "value",
            },
            value: 0,
            prop: "checkType",
          },
        ],
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
  mounted() {
    this.option.labelPosition = this.language !== "zh" ? "top" : "right";
    if (Object.keys(this.row).length > 0) {
      settingView(this.row.id).then((res) => {
        if (res.data.success) {
          this.form = res.data.data;
          if (this.form.tableSettingContentJson !== null) {
            this.form.dateType = this.form.tableSettingContentJson.dateType;
            this.form.content = this.form.tableSettingContentJson.content;
          }
        }
      });
    }
  },
  methods: {
    saveForm() {
      this.form.tableSettingContentJson = {
        dateType: this.form.dateType,
        content: this.form.content,
      };
      if (
        Number(this.form.minimumCharacters) >
        Number(this.form.maximumCharacters)
      ) {
        this.$message.warning("formsetting.charactersTips");
        return false;
      }
      return this.form;
    },
  },
};
</script>
<style lang="scss" scoped></style>
