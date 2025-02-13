<template>
  <div class="kw-tabs-base-container">
    <div
      :style="{
        height: allWindowTopBodyHeight - 40 - 32 + 'px',
        overflowY: 'auto',
      }"
    >
      <Basic
        :curTreeNode="curTreeNode"
        :basicDataObj="faqDataObj"
        :faqType="faqType"
        ref="basic"
      />
    </div>
    <div class="add-faq-footer">
      <el-button
        v-if="faqType == 'add' || faqType == 'edit'"
        size="small"
        :disabled="disable"
        type="primary"
        @click="saveFaq"
      >
        {{ $t("aicosCommon.saveBtn") }}
      </el-button>
      <el-button
        v-if="(faqType == 'add' || faqType == 'edit') && !isAudit"
        size="small"
        type="primary"
        :disabled="disable"
        @click="saveAndDeplay"
      >
        {{ $t("table.saveAndPublish") }}
      </el-button>
      <el-button
        v-if="(faqType == 'add' || faqType == 'edit') && isAudit"
        size="small"
        type="primary"
        :disabled="disable"
        @click="auditKmData"
        >{{ $t("table.saveAndPublish") }}
      </el-button>
      <!--<el-button size="small" @click.stop="">纠错</el-button>-->
      <!-- <el-button
        size="small"
        v-if="faqType != 'version'"
        @click="closeFaqAdd"
        >{{ $t("aicosCommon.cancelBtn") }}</el-button
      > -->
    </div>
  </div>
</template>
<script>
import Basic from "./basic";
// import AddFaqMore from "./addFaqMore";
import {
  tableQaSave,
  getTableDataUrl,
  tableQaUpdate,
} from "@/api/kwKnowledgeCenter/kwKnowledgeMangement/kwTabManagement/index";
import {
  getAuditSetting,
  kmAuditStart,
} from "@/views/kwRobotManage/kwAudit/kwAuditCommon";
import { mapGetters } from "vuex";
export default {
  inject: ["desktopWindow", "desktop"],
  components: {
    Basic,
    // AddFaqMore,
  },
  props: {
    rowData: {
      type: Object,
      default: () => {
        return {};
      },
    },
    curTreeNode: {
      type: Object,
      default: () => {
        return {};
      },
    },
    faqType: {
      type: String,
      default: () => {
        return "";
      },
    },
    curFaqObj: {
      type: Object,
      default: () => {
        return {};
      },
    },
    nodeDeepPath: {
      type: Array,
      default: () => {
        return [];
      },
    },
  },
  data() {
    return {
      disable: false,
      allWindowTopBodyHeight: 0,
      faqDataObj: this.rowData, // 编辑，查看的时候获取的数据
      activeName: "basic",
      basicData: {}, // 基础设置的数据
      basicValidateFlag: true, // 基础设置表单验证是否通过
      faqMoreData: {}, // 更多设置的数据
      faqMoreValidateFlag: true, // 更多设置表单验证是否通过
      botId: "", // 机器人id
      auditSetting: {}, // 审核设置
      isAudit: false, // 是否审核
    };
  },
  computed: {
    ...mapGetters(["botObj"]),
  },
  methods: {
    // 窗口改变，动态改变高度
    desktopWindowResize() {
      this.allWindowTopBodyHeight =
        this.desktopWindow.$el.getElementsByClassName(
          "desk-window-inner"
        )[0].offsetHeight;
    },

    // 获取知识
    getFaqData() {
      let type = "";
      let version = "";
      if (this.faqType == "edit" || this.faqType == "view") {
        type = "0";
      } else if (this.faqType == "version") {
        type = "1";
        version = this.curFaqObj.version;
      }
      getTableDataUrl(this.curFaqObj.id, type, version).then((resData) => {
        resData = resData.data;
        if (resData.code == 200) {
          this.$refs.basic.setFaqBasicData(resData.data);
          // this.$refs.addFaqMore.setFaqMoreData(resData.data);
        }
      });
    },

    // 基础设置faq保存
    saveFaqBasic(res) {
      let faqBasicForm = this.$refs.basic.$refs.faqBasicFormRef;

      faqBasicForm.validate((flag) => {
        if (flag) {
          console.log(res);
        }
      });
    },

    // 提交数据保存faq
    submitFaq(isDeplay, startAudit = false) {
      let that = this;
      let faqBasicForm = this.$refs.basic.$refs.faqBasicFormRef;
      const basicPromise = new Promise((resolve) => {
        faqBasicForm.validate((valid) => {
          if (valid) resolve();
        });
      });

      Promise.all([basicPromise]).then(async () => {
        // 基础设置保存
        that.basicData = that.$refs.basic.saveFaqBasic();
        that.basicData.knowledgeStatus = isDeplay;
        that.basicData.submitApprovalStatus = startAudit;
        this.disable = true;
        if (that.faqType == "edit") {
          tableQaUpdate(that.basicData)
            .then(async (res) => {
              //开启审核流程
              if (startAudit) {
                await kmAuditStart(
                  res.data.data,
                  4,
                  this.auditSetting.processDefineId
                );
              }
            })
            .then(() => {
              if (!startAudit) {
                this.$message.success(this.$t("aicosCommon.saveSuccessTip"));
              }
              that.$emit("addOrEditEmitEvent", {
                type: "mangelist",
                nodeDeepPath: this.nodeDeepPath,
              });
              this.disable = false;
            })
            .catch(() => {
              this.disable = false;
            });
        } else {
          tableQaSave(that.basicData)
            .then(async (res) => {
              if (startAudit) {
                await kmAuditStart(
                  res.data.data,
                  4,
                  this.auditSetting.processDefineId
                );
              }
            })
            .then(() => {
              if (!startAudit) {
                this.$message.success(this.$t("aicosCommon.saveSuccessTip"));
              }
              that.$emit("addOrEditEmitEvent", {
                type: "mangelist",
                nodeDeepPath: this.nodeDeepPath,
              });
              this.disable = false;
            })
            .catch(() => {
              this.disable = false;
            });
        }
      });
    },

    // 保存faq
    saveFaq() {
      this.submitFaq(0);
    },
    saveAndDeplay() {
      this.submitFaq(1);
    },
    auditKmData() {
      this.submitFaq(0, true);
    },

    async getAuditConfig() {
      const dataParam = {
        kmType: 4,
        tenantId: this.$store.state.user.currentTenantId,
      };
      this.auditSetting = await getAuditSetting(dataParam);
      this.isAudit = this.auditSetting.approvalProcessStatus;
    },
    // 关闭faq
    closeFaqAdd() {
      this.$emit("addOrEditEmitEvent", {
        type: "mangelist",
        nodeDeepPath: this.nodeDeepPath,
      });
    },
  },
  created() {
    this.botId = this.botObj.id;
    this.getAuditConfig();

    /*if (this.desktopWindow) {
      query = this.desktopWindow.data.query;

      this.botId = query.id; // 机器人id
    }*/
  },
  mounted() {
    if (this.desktopWindow) {
      // query = this.desktopWindow.data.query;

      this.allWindowTopBodyHeight =
        this.desktopWindow.$el.getElementsByClassName(
          "desk-window-inner"
        )[0].offsetHeight;

      this.desktopWindow.$on("resize", this.desktopWindowResize);
    }

    if (this.faqType != "add") {
      this.getFaqData();
    }
  },
  beforeDestroy() {
    if (this.desktopWindow) {
      this.desktopWindow.$off("resize", this.desktopWindowResize);
    }
  },
};
</script>
<style lang="scss" scoped>
.add-faq-footer {
  text-align: center;
}
</style>
