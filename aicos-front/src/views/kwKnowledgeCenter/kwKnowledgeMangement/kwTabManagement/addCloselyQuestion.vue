<template>
  <div>
    <avue-form ref="faqCloselyFormRef" v-model="faqCloselyFormData" :option="faqCloselyFormOption">
      <template slot="extQuestions">
        <el-button type="text" @click.stop="similarDialogVisible = true">{{ $t('table.addQuestions') }}</el-button>
        <span style="padding-left: 10px">{{ $t('table.added') }}：{{ this.similarQuestionLength }}</span>
      </template>
      <template slot="answer">
        <knowledge-editor v-model="faqCloselyFormData.answer"></knowledge-editor>
      </template>
    </avue-form>

    <!--添加相似问法-->
    <HuilanDialog :title="$t('kwIntentionManage.expandMethod')" append-to-body :close-on-click-modal="closeOnClickModal"
      :visible.sync="similarDialogVisible" width="500px">
      <el-tabs v-model="activeName" @tab-click="handleClick">
        <el-tab-pane :label="`${$t('kwIntentionManage.commonAnswer')}(${this.frequentlyQuestions.length
          })`" name="first">
          <CommonAnswer v-if="similarDialogVisible" ref="commonQuestion" :domainArr="frequentlyQuestions"
            @saveCommonMethod="saveCommonMethod" />
        </el-tab-pane>
        <el-tab-pane :label="`${$t(
          'kwIntentionManage.regular'
        )}${`(${this.regularArr.length})`}`" name="second">
          <Regular v-if="similarDialogVisible" ref="regularQuestion" :regularArr="regularArr"
            @saveRegular="saveRegular" />
        </el-tab-pane>
      </el-tabs>
      <template v-slot:footer>
        <el-button size="small" @click="similarDialogVisible = false">{{
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
import CommonAnswer from "@/components/kwAddInMethod/commonAnswer";
import Regular from "@/components/kwAddInMethod/regular";

export default {
  components: {
    CommonAnswer,
    Regular,
  },
  props: {
    curEditFaqObj: {
      type: Object,
      default: null,
    },
    type: {
      type: String,
      default: "",
    },
  },
  data () {
    return {
      closeOnClickModal: false,
      activeName: "first",
      similarDialogVisible: false, // 添加相似问法
      similarQuestionLength: 0, // 相似问法个数
      frequentlyQuestions: [],
      regularArr: [],
      faqCloselyFormData: {
        // 追问表单数据
        frontId: "",
        question: "",
        frequentlyQuestions: [],
        regularArr: [],
        answer: "",
      },
      faqCloselyFormOption: {
        column: [
          {
            label: this.$t('table.standardIssues'),
            prop: "question",
            span: 24,
            row: true,
            required: true,
            rules: [{ required: true, message: this.$t("aicosCommon.pleaseInput") + this.$t('table.standardIssues') }],
          },
          {
            type: "input",
            label: this.$t('table.similarityQuestion'),
            span: 24,
            row: true,
            display: true,
            prop: "extQuestions",
          },
          {
            label: this.$t('table.answer'),
            row: true,
            display: true,
            span: 24,
            prop: "answer",
            required: true,
            rules: [{ required: true, message: this.$t("aicosCommon.pleaseInput") + this.$t('table.answer'), }],
          },
        ],
        labelPosition: "right",
        labelSuffix: "：",
        labelWidth: 100,
        gutter: 0,
        menuBtn: false,
        submitBtn: false,
        emptyBtn: false,
      },
    };
  },
  computed: {
    // 计算属性
  },
  methods: {
    // 常用问题
    saveCommonMethod (res) {
      if (res.flag) {
        this.frequentlyQuestions = res.data;
      }
    },

    // 正则问题
    saveRegular (res) {
      if (res.flag) {
        this.regularArr = res.data;
      }
    },

    // 保存相似问法库
    saveSimilar () {
      this.$refs.commonQuestion.submitExpand();
      this.$refs.regularQuestion.submitExpand();
      this.similarQuestionLength =
        this.regularArr.length + this.frequentlyQuestions.length;

      this.similarDialogVisible = false;
    },

    // 保存追问
    saveCloselyQuestion () {
      let that = this;
      this.$refs.faqCloselyFormRef.validate((valid) => {
        if (valid) {
          // 校验通过

          if (that.type == "add") {
            that.faqCloselyFormData.frontId = new Date().getTime();
          }

          that.faqCloselyFormData.frequentlyQuestions =
            that.frequentlyQuestions;
          that.faqCloselyFormData.regularArr = that.regularArr;

          that.$emit("saveCloselyEmit", that.faqCloselyFormData);
        }
      });
    },
  },
  created () { },
  mounted () {
    if (Object.keys(this.curEditFaqObj).length > 0) {
      // 编辑
      this.faqCloselyFormData = {
        ...this.curEditFaqObj,
      };

      this.frequentlyQuestions = this.curEditFaqObj.frequentlyQuestions;
      this.regularArr = this.curEditFaqObj.regularArr;

      this.similarQuestionLength =
        this.regularArr.length + this.frequentlyQuestions.length;
    }
  },
  destroyed () { },
};
</script>

<style scoped></style>
