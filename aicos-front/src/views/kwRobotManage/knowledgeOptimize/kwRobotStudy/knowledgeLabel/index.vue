<template>
  <div>
    <div v-if="isOne">
      {{ $t('kwRobotAnswer.knowledgeToAnnotated') }}：
      <el-input size="small" v-model="question" style="width: 70%"></el-input>
    </div>
    <el-tabs v-model="activeName" @tab-click="handleClick">
      <el-tab-pane :label="$t('kwAudit.fqaKnowledge')" name="first">
        <Faq ref="faq" v-if="activeName === 'first'" />
      </el-tab-pane>
      <el-tab-pane :label="$t('kwAudit.tableKnowledge')" name="second">
        <Table ref="table" v-if="activeName === 'second'" />
      </el-tab-pane>
      <el-tab-pane :label="$t('kwAudit.userIntent')" name="third">
        <Intention ref="intention" v-if="activeName === 'third'" />
      </el-tab-pane>
      <el-tab-pane :label="$t('kwAudit.chattingKnowledge')" name="fourth">
        <Smalltalk ref="smalltalk" v-if="activeName === 'fourth'" />
      </el-tab-pane>
    </el-tabs>
  </div>
</template>
<script>
import Faq from "./faq";
import Table from "./table";
import Smalltalk from "./smalltalk";
import Intention from "./intention";
import {
  getFaqDataUrl,
  updatefaqUrl,
} from "@/api/kwKnowledgeCenter/kwKnowledgeMangement/kwFaqManagement/index";
import {
  getTableDataUrl,
  tableQaUpdate,
} from "@/api/kwKnowledgeCenter/kwKnowledgeMangement/kwTabManagement/index";
import {
  saveOrUpdate,
  detail,
} from "@/api/kwKnowledgeCenter/kwIntention/index";
import {
  getChatDataUrl,
  updateChatUrl,
} from "@/api/kwKnowledgeCenter/kwKnowledgeMangement/smalltalk/index";
import { deepClone } from "@/util/util";
export default {
  components: {
    Faq,
    Table,
    Smalltalk,
    Intention,
  },
  props: {
    isOne: {
      type: Boolean,
      default: true,
    },
    rowData: {
      type: Array,
      default: () => [],
    },
  },
  data () {
    return {
      activeName: "first",
      question: "",
    };
  },
  mounted () {
    if (this.isOne) {
      this.question = this.rowData[0].question;
    }
  },
  methods: {
    refName (val) {
      if (val === "first") {
        return "faq";
      }
      if (val === "second") {
        return "table";
      }
      if (val === "third") {
        return "intention";
      }
      if (val === "fourth") {
        return "smalltalk";
      }
    },
    handleSave () {
      let name = this.refName(this.activeName),
        selectId = this.$refs[name].selectId,
        submitData = [];
      if (selectId === "") {
        this.$message.error(this.$t('kwRobotAnswer.selectPieceData'));
        return;
      }
      // faq知识标注
      if (this.activeName === "first") {
        getFaqDataUrl(selectId, "0", "").then((res) => {
          let data = res.data.data;
          if (data.extquestion === null) {
            data.extquestion = [];
          }
          if (this.isOne) {
            if (data.extquestion.indexOf(this.question) === -1) {
              data.extquestion.push(this.question);
              submitData = deepClone(this.rowData);
            } else {
              this.$message.warning(this.$t('kwRobotAnswer.beenAnnotated'));
            }
          } else {
            this.rowData.forEach((item) => {
              if (data.extquestion.indexOf(item.question) === -1) {
                data.extquestion.push(item.question);
                submitData.push(item);
              } else {
                this.$message.warning(this.$t('kwRobotAnswer.beenAnnotated'));
              }
            });
          }
          if (!this.validatenull(submitData)) {
            updatefaqUrl(data).then(() => {
              this.$message.success(this.$t('kwRobotAnswer.annotatedSuccess'));
            });
          }
        });
      }
      // 表格知识标注
      if (this.activeName === "second") {
        getTableDataUrl(selectId, "0", "").then((res) => {
          let data = res.data.data;
          if (data.similarText === null) {
            data.similarText = [];
          }
          if (this.isOne) {
            if (data.similarText.indexOf(this.question) === -1) {
              data.similarText.push(this.question);
              submitData = deepClone(this.rowData);
            } else {
              this.$message.warning(this.$t('kwRobotAnswer.beenAnnotated'));
            }
          } else {
            this.rowData.forEach((item) => {
              if (data.similarText.indexOf(item.question) === -1) {
                data.similarText.push(item.question);
                submitData.push(item);
              } else {
                this.$message.warning(this.$t('kwRobotAnswer.beenAnnotated'));
              }
            });
          }
          if (!this.validatenull(submitData)) {
            tableQaUpdate(data).then(() => {
              this.$message.success(this.$t('kwRobotAnswer.annotatedSuccess'));
            });
          }
        });
      }
      // 意图标注
      if (this.activeName === "third") {
        detail({ id: selectId }).then((res) => {
          let data = res.data.data;
          data.similarList = [];
          data.similarList = [...data.normalSimilar, ...data.regularSimilar];
          if (this.isOne) {
            let flag = data.similarList.filter(
              (a) => a.intentQuestion === this.question
            );
            if (flag.length === 0) {
              data.similarList.push({
                intentQuestion: this.question,
                questionType: 1,
              });
              submitData = deepClone(this.rowData);
            } else {
              this.$message.warning(this.$t('kwRobotAnswer.beenAnnotated'));
            }
          } else {
            this.rowData.forEach((item) => {
              let flag = data.similarList.filter(
                (a) => a.intentQuestion === this.question
              );
              if (flag.length === 0) {
                data.similarList.push({
                  intentQuestion: item.question,
                  questionType: 1,
                });
                submitData.push(item);
              } else {
                this.$message.warning(this.$t('kwRobotAnswer.beenAnnotated'));
              }
            });
          }
          if (!this.validatenull(submitData)) {
            saveOrUpdate(data).then(() => {
              this.$message.success(this.$t('kwRobotAnswer.annotatedSuccess'));
            });
          }
        });
      }
      // 闲聊知识标注
      if (this.activeName === "fourth") {
        getChatDataUrl(selectId, "0", "").then((res) => {
          let data = res.data.data;
          if (data.extquestion === null) {
            data.extquestion = [];
          }
          if (this.isOne) {
            if (data.extquestion.indexOf(this.question) === -1) {
              data.extquestion.push(this.question);
              submitData = deepClone(this.rowData);
            } else {
              this.$message.warning(this.$t('kwRobotAnswer.beenAnnotated'));
            }
          } else {
            this.rowData.forEach((item) => {
              if (data.extquestion.indexOf(item.question) === -1) {
                data.extquestion.push(item.question);
                submitData.push(item);
              } else {
                this.$message.warning(this.$t('kwRobotAnswer.beenAnnotated'));
              }
            });
          }
          if (!this.validatenull(submitData)) {
            updateChatUrl(data).then(() => {
              this.$message.success(this.$t('kwRobotAnswer.annotatedSuccess'));
            });
          }
        });
      }
      this.$nextTick(() => {
        this.$emit("refresh");
      });
    },
  },
};
</script>
