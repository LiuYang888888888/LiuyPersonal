<template>
  <div class="faqmark">
    <div class="result">
      <template v-if="listData.length > 0">
        <div v-for="(obj, i) in listData" :key="i">
          <el-checkbox-group v-model="checkedCities" @change="handleCheckedCitiesChange">
            <Resultcommon :item="obj" @handle="handleResult" :question="obj.question" :answer="obj.answer" />
          </el-checkbox-group>
        </div>
      </template>
      <template v-else>
        <div class="empty">{{ $t("doc.noResultsTips") }}</div>
      </template>
    </div>
    <div class="tool">
      <el-checkbox :indeterminate="isIndeterminate" v-model="checkAll" @change="handleCheckAllChange">{{ $t("doc.all")
      }}</el-checkbox>
      <el-button type="text" @click="handelDel">
        {{ $t("aicosCommon.batchDeleteBtn") }}</el-button>
    </div>
    <HuilanDialog :title="$t('doc.editFAQknowledge')" append-to-body :visible.sync="qaDialog" width="40%">
      <Faqadd :markForm="editObj" :key="new Date().getTime()" tool="edit" ref="faqadd" />
      <template v-slot:footer>
        <el-button size="small" @click="qaDialog = false">{{
          $t("aicosCommon.cancelBtn")
        }}</el-button>
        <el-button size="small" type="primary" @click="handlerSave(0)" :disabled="disable">{{ $t("aicosCommon.saveBtn")
        }}</el-button>
        <el-button size="small" type="primary" v-if="!isAudit" @click="handlerSave(1)" :disabled="disable">
          {{ $t("doc.saveAndPublish") }}
        </el-button>
        <el-button v-if="isAudit" size="small" type="primary" :disabled="disable" @click="handlerSave(0, true)">{{
          $t("faq.saveAndPublish") }}
        </el-button>
      </template>
    </HuilanDialog>
  </div>
</template>
<script>
import Resultcommon from "./resultcommon";
import Faqadd from "./faqadd";
import { selectFaqByKnId } from "@/api/kwKnowledgeCenter/kwKnowledgeMangement/documentknowledge/index";
import {
  delFaqUrl,
  updatefaqUrl,
  getFaqDataUrl,
} from "@/api/kwKnowledgeCenter/kwKnowledgeMangement/kwFaqManagement/index";
import {
  getAuditSetting,
  kmAuditStart,
} from "@/views/kwRobotManage/kwAudit/kwAuditCommon";
export default {
  components: {
    Resultcommon,
    Faqadd,
  },
  props: {
    markForm: {
      type: Object,
      default: () => {
        return {};
      },
    },
    text: {
      type: String,
      default: "",
    },
  },
  data () {
    return {
      disable: false,
      checkAll: false,
      isIndeterminate: false,
      listData: [],
      checkedCities: [],
      qaDialog: false,
      markObj: {},

      auditSetting: {}, // 审核设置
      isAudit: false, // 是否审核
    };
  },
  mounted () {
    this.getList();
    this.getAuditConfig();
  },
  methods: {
    async getAuditConfig () {
      const dataParam = {
        kmType: 1,
        tenantId: this.$store.state.user.currentTenantId,
      };
      this.auditSetting = await getAuditSetting(dataParam);
      this.isAudit = this.auditSetting.approvalProcessStatus;
    },
    // 获取faq所有数据
    getList () {
      selectFaqByKnId(this.markForm.id).then((res) => {
        if (res.data.success) {
          if (res.data.data !== null) {
            this.listData = res.data.data;
          } else {
            this.listData = [];
          }
        }
        this.$emit("handelReslut", this.listData);
      });
    },
    handleCheckedCitiesChange(value) {
      let checkedCount = value.length;
      this.checkAll = checkedCount === this.listData.length;
      this.isIndeterminate = checkedCount > 0 && checkedCount < this.listData.length;
    },
    // 全选逻辑
    handleCheckAllChange (val) {
      if (val) {
        this.listData.map((item) => {
          this.checkedCities.push(item.id);
        });
      } else {
        this.checkedCities = [];
      }
      this.isIndeterminate = false;
    },
    // 编辑or删除
    handleResult (val) {
      if (val.type === "del") {
        this.$confirm(this.$t("doc.deleteDataTips"), {
          confirmButtonText: this.$t("aicosCommon.confirmBtn"),
          cancelButtonText: this.$t("aicosCommon.cancelBtn"),
          type: "warning",
        }).then(() => {
          delFaqUrl(val.id).then((res) => {
            if (res.data.success) {
              this.$message.success(this.$t("aicosCommon.successOperate"));
              this.getList();
            }
          });
        });
      }
      if (val.type === "edit") {
        getFaqDataUrl(val.id, "0", "").then((res) => {
          if (res.data.success) {
            this.editObj = res.data.data;
            this.qaDialog = true;
          }
        });
      }
    },
    // 批量删除
    handelDel () {
      if (this.checkedCities.length === 0) {
        this.$message.warning(this.$t("doc.selectAnnotationTips"));
        return;
      }
      this.$confirm(this.$t("aicosCommon.mutiDeleteConfirmTip"), {
        confirmButtonText: this.$t("aicosCommon.confirmBtn"),
        cancelButtonText: this.$t("aicosCommon.cancelBtn"),
        type: "warning",
      }).then(() => {
        delFaqUrl(this.checkedCities.join(",")).then((res) => {
          if (res.data.success) {
            this.$message.success(this.$t("aicosCommon.successOperate"));
            this.getList();
          }
        });
      });
    },
    // faq编辑
    handlerSave (status, startAudit = false) {
      const faqBasicForm = this.$refs.faqadd.$refs.faqBasicFormRef;
      new Promise((resolve) => {
        faqBasicForm.validate((validate) => {
          if (validate) {
            const data = this.$refs.faqadd.saveFaqBasic();
            if (this.editObj.faqquestion.content !== data.faqquestion.content) {
              if (this.text.indexOf(data.faqquestion.content) === -1) {
                data.questionDetail = {
                  questionStart: "0",
                  questionEnd: "0",
                  tag: "1",
                };
              } else {
                data.questionDetail = {
                  questionStart: this.text.indexOf(data.faqquestion.content),
                  questionEnd:
                    Number(this.text.indexOf(data.faqquestion.content)) +
                    Number(data.faqquestion.content.length),
                  tag: "1",
                };
              }
            } else {
              data.questionDetail = this.editObj.questionDetail;
            }
            if (
              this.editObj.faqanswer[0].content !== data.faqanswer[0].content
            ) {
              if (this.text.indexOf(data.faqanswer[0].content) === -1) {
                data.answerDetail = {
                  answerStart: "0",
                  answerEnd: "0",
                  tag: "2",
                };
              } else {
                data.answerDetail = {
                  answerStart: this.text.indexOf(data.faqanswer[0].content),
                  answerEnd:
                    Number(this.text.indexOf(data.faqanswer[0].content)) +
                    Number(data.faqanswer[0].content.length),
                  tag: "2",
                };
              }
            } else {
              data.answerDetail = this.editObj.answerDetail;
            }
            data.faqquestion.finalVeriyfStatus = status;
            data.submitApprovalStatus = startAudit;
            this.disable = true;
            updatefaqUrl(data)
              .then(async (res) => {
                //开启审核流程
                if (startAudit) {
                  await kmAuditStart(
                    res.data.data,
                    1,
                    this.auditSetting.processDefineId
                  );
                }
              })
              .then(() => {
                if (!startAudit) {
                  this.$message.success(this.$t("doc.addedSuccessTips"));
                }
                this.qaDialog = false;
                this.disable = false;
                this.getList();
              })
              .catch(() => {
                this.disable = false;
              });
            resolve();
          }
        });
      });
    },
  },
};
</script>
<style lang="scss" scoped>
.faqmark {
  .result {
    height: 500px;
    overflow: auto;
    padding: 10px;
    padding-bottom: 0px;

    .el-checkbox-group {
      font-size: 16px;
      margin-bottom: 10px;
    }
  }

  .tool {
    border-top: 1px solid #c4c4c4;
    display: flex;
    align-items: center;
    justify-content: space-between;
  }

  .empty {
    text-align: center;
    margin-top: 200px;
  }
}
</style>
