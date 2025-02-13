<template>
  <div>
    <avue-form ref="faqBasicFormRef" v-model="faqBasicFormData" :option="faqBasicFormOption" @submit="saveFaqBasic">
      <template slot="entityId">
        <div style="display: flex">
          <el-select v-model="faqBasicFormData.entityId"
            :placeholder="$t('aicosCommon.pleaseSelect') + $t('doc.notionalWords')">
            <el-option v-for="item in options" :key="item.id" :label="item.entityName" :value="item.id">
            </el-option>
          </el-select>
          <el-button type="text" class="el-icon-plus" style="margin-left: 8px" @click="
            addDialog = true;
          addForm = { minLength: 0, maxLength: 0 };
          "></el-button>
        </div>
      </template>
    </avue-form>
    <HuilanDialog :title="$t('doc.addEntityWords')" append-to-body :visible.sync="addDialog" width="40%">
      <avue-form ref="form" v-model="addForm" :option="addOption"> </avue-form>
      <template v-slot:footer>
        <el-button size="small" @click="addDialog = false">{{
          $t("aicosCommon.cancelBtn")
        }}</el-button>
        <el-button size="small" type="primary" @click="handlerAdd" :disabled="isSave">{{ $t("aicosCommon.saveBtn")
        }}</el-button>
      </template>
    </HuilanDialog>
  </div>
</template>

<script>
import {
  saveEntity,
  selectEntityByKnId,
} from "@/api/kwKnowledgeCenter/kwKnowledgeMangement/documentknowledge/index";
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
      faqBasicFormData: { entityWord: "", entityId: "" },
      faqBasicFormOption: {
        column: [
          {
            label: this.$t('doc.instanceName'),
            prop: "entityWord",
            display: true,
            span: 24,
            rules: [{ required: true, message: this.$t('aicosCommon.pleaseInput') + this.$t('doc.instanceName') }],
          },
          {
            label: this.$t('doc.notionalWords'),
            prop: "entityId",
            display: true,
            span: 24,
            type: "select",
            rules: [{ required: true, message: this.$t('aicosCommon.pleaseSelect') + this.$t('doc.notionalWords') }],
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
      // 新增实体词
      isSave: false,
      addDialog: false,
      addForm: {},
      addOption: {
        column: [
          {
            label: this.$t('doc.notionalWords'),
            prop: "entityName",
            display: true,
            span: 24,
            rules: [{ required: true, message: this.$t('aicosCommon.pleaseInput') + this.$t('doc.notionalWords') }],
          },
          {
            label: this.$t('doc.minLength'),
            prop: "minLength",
            type: "number",
            display: true,
            span: 24,
            min: 0,
            precision: 0,
            value: 0,
            rules: [
              { required: true, message: this.$t('aicosCommon.pleaseInput') + this.$t('doc.minLength') },
              // {
              //   pattern: /(^[1-9]\d*$)/,
              //   message: "请输入正整数",
              // },
            ],
          },
          {
            label: this.$t('doc.maxLength'),
            prop: "maxLength",
            display: true,
            span: 24,
            min: 0,
            precision: 0,
            type: "number",
            value: 0,
            rules: [
              { required: true, message: this.$t('aicosCommon.pleaseInput') + this.$t('doc.maxLength') },
              // {
              //   pattern: /(^[1-9]\d*$)/,
              //   message: "请输入正整数",
              // },
            ],
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
      options: {},
    };
  },
  computed: {
    ...mapGetters(["botObj", 'language']),
  },
  watch: {
    language: {
      handler (newVal) {
        // && this.faqType != "view"
        this.faqBasicFormOption.labelPosition = newVal != 'zh' ? 'top' : 'right'
        this.addOption.labelPosition = newVal != 'zh' ? 'top' : 'right'
      },
      immediate: true,
    }
  },
  mounted () {
    this.setFaqBasicData();
    this.getList();
  },
  methods: {
    // 获取实体词
    getList () {
      selectEntityByKnId({ fileKnowledgeId: this.markForm.rowId }).then(
        (res) => {
          if (res.data.success) {
            this.options = res.data.data;
          }
        }
      );
    },
    // 设置数据
    setFaqBasicData () {
      if (this.tool === "add") {
        this.faqBasicFormData.entityWord = this.markForm.text;
        this.faqBasicFormData.fileKnowledgeId = this.markForm.rowId;
        this.faqBasicFormData.applicationId = this.botObj.id;
      }
      if (this.tool === "edit") {
        this.faqBasicFormData = this.markForm;
      }
    },
    // 新增实体词
    handlerAdd () {
      this.$refs.form.validate((valid, done) => {
        if (valid) {
          let basicData = { ...this.addForm };
          basicData.applicationId = this.botObj.id;
          if (basicData.minLength > basicData.maxLength) {
            this.$message.warning(this.$t('doc.lengthWarningTips'));
            return false;
          }
          this.isSave = true;
          saveEntity(basicData)
            .then((res) => {
              if (res.data.success) {
                this.isSave = false;
                this.$refs.form.resetForm();
                this.addDialog = false;
                this.getList();
                done()
              }
            })
            .catch(() => {
              done()
              this.isSave = false;
            });
        }
      });
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
