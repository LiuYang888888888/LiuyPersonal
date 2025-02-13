<template>
  <div>
    <avue-form
      ref="faqBasicFormRef"
      v-model="faqBasicFormData"
      :option="faqBasicFormOption"
    >
      <template slot="question">
        <el-input
          type="input"
          :placeholder="
            $t('aicosCommon.pleaseInput') + $t('doc.standardIssues')
          "
          v-model="faqBasicFormData.question"
          @blur="onBlurQuestion"
          :disabled="faqType === 'view' || faqType === 'version'"
        ></el-input>
      </template>
      <template slot="extQuestions">
        <el-button type="text" @click.stop="similarDialogVisible = true">{{
          $t("doc.addQuestions")
        }}</el-button>
        <span style="padding-left: 10px"
          >{{ $t("doc.added") }}：{{ this.similarQuestionLength }}</span
        >
      </template>
      <template slot="intentGroup">
        <el-autocomplete
          class="el-input-border-radius shadowStyle"
          v-model="faqBasicFormData.intentGroup"
          clearable
          style="width: 100%"
          maxlength="200"
          show-word-limit
          :fetch-suggestions="querySearchAsync"
          :placeholder="$t('doc.intentionTips')"
        ></el-autocomplete>
      </template>
    </avue-form>
    <!--添加相似问法-->
    <HuilanDialog
      :title="$t('kwIntentionManage.expandMethod')"
      append-to-body
      :close-on-click-modal="isCloseOnClickModal"
      :visible.sync="similarDialogVisible"
      width="500px"
    >
      <el-tabs v-model="activeName" @tab-click="handleClick">
        <el-tab-pane
          :label="`${$t(
            'kwIntentionManage.commonAnswer'
          )}${`(${this.frequentlyQuestions.length})`}`"
          name="first"
        >
          <CommonAnswer
            v-if="similarDialogVisible"
            ref="commonQuestion"
            :domainArr="frequentlyQuestions"
            @saveCommonMethod="saveCommonMethod"
          />
        </el-tab-pane>
        <el-tab-pane
          :label="`${$t(
            'kwIntentionManage.regular'
          )}${`(${this.regularArr.length})`}`"
          name="second"
        >
          <Regular
            v-if="similarDialogVisible"
            ref="regularQuestion"
            :regularArr="regularArr"
            @saveRegular="saveRegular"
          />
        </el-tab-pane>
      </el-tabs>
      <template v-slot:footer>
        <el-button size="small" @click="cancelSimilarDialog">{{
          $t("aicosCommon.cancelBtn")
        }}</el-button>
        <el-button size="small" type="primary" @click="saveSimilar">{{
          $t("aicosCommon.saveBtn")
        }}</el-button>
      </template>
    </HuilanDialog>
  </div>
</template>

<script>
import {
  selectList,
  selectIntentListWithRobot,
  recommendIntent,
} from "@/api/kwKnowledgeCenter/kwKnowledgeMangement/documentknowledge/index";
import CommonAnswer from "@/components/kwAddInMethod/commonAnswer";
import Regular from "@/components/kwAddInMethod/regular";
import { getRules } from "@/util/regx";
import { mapGetters } from "vuex";
export default {
  components: {
    CommonAnswer,
    Regular,
  },
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
  data() {
    return {
      disable: false,
      isCloseOnClickModal: false,
      activeName: "first",
      similarDialogVisible: false, // 相似问法弹框
      frequentlyQuestions: [], // 常用问题
      regularArr: [], // 正则问题
      similarQuestionLength: 0, // 相似问题长度
      faqBasicFormData: {
        caName: "",
        caId: "",
        question: "",
        answer: "",
      },
      faqBasicFormOption: {
        column: [
          {
            label: this.$t("doc.category"),
            prop: "cateId",
            display: true,
            span: 24,
            type: "tree",
            props: {
              label: "dname",
              value: "id",
            },
            filterText:this.$t('doc.filterText'),
            dicData: [],
            rules: [
              {
                required: true,
                message:
                  this.$t("aicosCommon.pleaseSelect") + this.$t("doc.category"),
              },
            ],
          },
          {
            type: "input",
            label: this.$t("doc.intention"),
            display: true,
            span: 24,
            // dicUrl: `/api/${aiworkorder}/kgcc-label/tree`,
            // props: { label: "title", value: "id" },
            prop: "intentGroup",
            rules: [
              {
                required: true,
                message:
                  this.$t("aicosCommon.pleaseSelect") +
                  this.$t("doc.intention"),
              },
              ...getRules(["charNumHan"]),
            ],
          },
          {
            label: this.$t("doc.standardIssues"),
            prop: "question",
            maxlength: 100,
            showWordLimit: true,
            span: 24,
            required: true,
            rules: [
              {
                required: true,
                message:
                  this.$t("aicosCommon.pleaseInput") +
                  this.$t("doc.standardIssues"),
              },
              ...getRules(["charNumHan"]),
            ],
          },
          {
            label: this.$t("doc.answer"),
            prop: "answer",
            span: 24,
            type: "textarea",
            maxlength: 2000,
            showWordLimit: true,
            rules: [
              {
                required: true,
                message:
                  this.$t("aicosCommon.pleaseInput") + this.$t("doc.answer"),
              },
            ],
          },
          {
            type: "input",
            label: this.$t("doc.similarityQuestion"),
            display: true,
            prop: "extQuestions",
          },
        ],
        span: 16,
        labelPosition: "right",
        labelSuffix: "：",
        labelWidth: 100,
        gutter: 0,
        menuBtn: false,
        submitBtn: false,
        emptyBtn: false,
      },
      keywordsArr: [],
    };
  },
  watch: {
    language: {
      handler(newVal) {
        // && this.faqType != "view"

        this.faqBasicFormOption.labelPosition =
          newVal != "zh" ? "top" : "right";
      },
      immediate: true,
    },
  },
  computed: {
    ...mapGetters(["botObj", "userInfo", "language"]),
  },
  // watch: {
  //   markForm: {
  //     handler(val) {
  //       console.log(val);
  //       if (this.tool === "add") {
  //         this.faqBasicFormData.question = val.question;
  //         this.faqBasicFormData.answer = val.answer;
  //       }
  //     },
  //     immediate: true,
  //   },
  // },
  mounted() {
    this.setFaqBasicData();
    // 所属分类
    selectList({ classType: "faq" }).then((res) => {
      if (res.data.success) {
        const treeData = this.findObject(
          this.faqBasicFormOption.column,
          "cateId"
        );
        treeData.dicData = res.data.data;
      }
    });
    // 意图
    selectIntentListWithRobot(this.botObj.id).then((res) => {
      if (res.data.success) {
        res.data.data.map((item) => {
          this.keywordsArr.push({ value: item });
        });
      }
    });
  },
  methods: {
    // 意图识别
    onBlurQuestion() {
      let obj = {
        tenantId: this.$store.state.user.currentTenantId,
        robotId: this.botObj.id,
        question: this.faqBasicFormData.question,
        maxHitSize: 50,
        published: true,
      };
      if (this.faqBasicFormData.question !== "") {
        recommendIntent(obj).then((res) => {
          if (res.data.success) {
            if (res.data.data.items.length > 0) {
              this.faqBasicFormData.intentGroup =
                res.data.data.items[0].displayTag;
            }
          }
        });
      }
    },
    // 设置数据
    setFaqBasicData() {
      let extquestion = this.markForm.extquestion; // 相似问法
      let regquestion = this.markForm.regquestion; // 正则
      // let inteList = this.markForm.inteList; // 意图
      // let formAnswers = [];
      // 设置问题和答案
      //   console.log(this.markForm);
      this.faqBasicFormData.cid = this.markForm.rowId;

      // 答案
      if (this.tool === "add") {
        this.faqBasicFormData.question = this.markForm.question;
        this.faqBasicFormData.answer = this.markForm.answer;
      }
      if (this.tool === "edit") {
        this.faqBasicFormData.cateId = this.markForm.faqquestion.cateId;
        this.faqBasicFormData.question = this.markForm.faqquestion.content;
        this.faqBasicFormData.answer = this.markForm.faqanswer[0].content;
        this.faqBasicFormData.intentGroup =
          this.markForm.faqquestion.intentGroup;
      }
      if (!this.validatenull(this.faqBasicFormData.question)) {
        this.onBlurQuestion();
      }
      // 设置相似问法
      if (extquestion) {
        extquestion.forEach((item) => {
          this.frequentlyQuestions.push({
            intentQuestion: item,
          });
        });
      }

      // 设置正则表达式
      if (regquestion) {
        regquestion.forEach((item) => {
          this.regularArr.push({
            intentQuestion: item,
          });
        });
      }
      this.similarQuestionLength =
        this.regularArr.length + this.frequentlyQuestions.length;
    },
    querySearchAsync(queryString, cb) {
      var restaurants = this.keywordsArr;
      var results = queryString
        ? restaurants.filter(this.createStateFilter(queryString))
        : restaurants;
      cb(results);
    },
    createStateFilter(queryString) {
      return (state) => {
        return (
          state.value.toLowerCase().indexOf(queryString.toLowerCase()) === 0
        );
      };
    },
    // 常用问题
    saveCommonMethod(res) {
      if (res.flag) {
        this.frequentlyQuestions = res.data;
      }
    },

    // 正则问题
    saveRegular(res) {
      if (res.flag) {
        this.regularArr = res.data;
      }
    },

    // 关闭相似问法弹框
    cancelSimilarDialog() {
      this.similarDialogVisible = false;
    },

    // 保存相似问法库
    saveSimilar() {
      this.$refs.commonQuestion.submitExpand();
      this.$refs.regularQuestion.submitExpand();
      this.similarQuestionLength =
        this.regularArr.length + this.frequentlyQuestions.length;
      this.similarDialogVisible = false;
    },
    // 保存faq基础设置
    saveFaqBasic() {
      let basicData = {
        faqquestion: {},
        fileKnowledgeId: this.markForm.rowId,
        extquestion: [],
        regquestion: [],
        faqanswer: [],
      };

      // 相似问法
      this.frequentlyQuestions.forEach((item) => {
        basicData.extquestion.push(item.intentQuestion);
      });

      // 相似正则
      this.regularArr.forEach((item) => {
        basicData.regquestion.push(item.intentQuestion);
      });
      basicData.faqanswer.push({
        content: this.faqBasicFormData.answer,
        id: this.tool === "edit" ? this.markForm.faqanswer[0].id : "",
      });
      // 问题内容
      basicData.faqquestion = {
        content: this.faqBasicFormData.question,
        cateId: this.faqBasicFormData.cateId,
        intentGroup: this.faqBasicFormData.intentGroup,
        botId: this.botObj.id,
        id: this.tool === "edit" ? this.markForm.faqquestion.id : "",
        avaliableStatus: 0,
      };
      return basicData;
    },
  },
};
</script>

<style scoped lang="scss">
/deep/ .choose-perspective-dialog .el-dialog__body {
  padding: 0px 0px 0 20px;
}

/deep/ .add-answer-spective-btn {
  text-align: center;
}

/deep/ .add-answer-spective-wrap {
  .el-form-item--mini.el-form-item,
  .el-form-item--small.el-form-item {
    margin-bottom: 8px;
  }
}

.answer-perspective-item {
  position: relative;
  margin-bottom: 15px;

  .perspect-list-container {
    position: relative;
    padding-right: 90px;

    .choose-perspect-btn {
      position: absolute;
      right: 0;
      top: 3px;
    }
  }

  .perspect-list-wrap {
    background-color: #fff;
    background-image: none;
    border-radius: 4px;
    border: 1px solid #dcdfe6;
    box-sizing: border-box;
    color: #606266;
    /* height: 32px;*/
    padding-right: 10px;

    .perspect-list-ul {
      padding: 0;
      margin: 0;
      list-style: none;
      /* line-height: 32px;*/
      min-height: 32px;

      .perspect-item {
        display: inline-block;
        vertical-align: top;
        background-color: #f4f4f5;
        color: #909399;
        margin: 3px 0 2px 6px;
        max-width: 100%;
        align-items: center;
        height: 24px;
        padding: 0 8px;
        line-height: 22px;
        border: 1px solid #e9e9eb;
        border-radius: 4px;
        white-space: nowrap;
        font-size: 12px;

        .perspect-tag-text {
          overflow: hidden;
          text-overflow: ellipsis;
          color: #909399;
          line-height: 22px;
          font-size: 12px;
          white-space: nowrap;
          max-width: 130px;
          display: inline-block;
        }

        .perspect-tag-close {
          color: #909399;
          background-color: #c0c4cc;
          border-radius: 50%;
          text-align: center;
          cursor: pointer;
          font-size: 12px;
          height: 16px;
          width: 16px;
          line-height: 16px;
          transform: scale(0.8);
          display: inline-block;
          vertical-align: top;
          margin-top: 3px;
        }
      }

      .perspect-tip {
        color: #c0c4cc;
        font-size: 13px;
        padding-left: 15px;
      }
    }
  }

  .delete-answer-btn {
    position: absolute;
    right: -24px;
    top: 0;
  }
}
</style>
