<template>
  <div class="kw-tabs-base-container">
    <el-tabs
      v-model="activeName"
      :style="{
        height: allWindowTopBodyHeight - 40 - 32 + 'px',
        overflowY: 'auto',
      }"
    >
      <el-tab-pane :label="$t('smalltalk.basicSettings')" name="basic">
        <Basic
          :curTreeNode="curTreeNode"
          :basicDataObj="faqDataObj"
          :faqType="faqType"
          ref="basic"
        />
      </el-tab-pane>
      <el-tab-pane :label="$t('smalltalk.moreSettings')" name="more">
        <More :faqType="faqType" ref="more" />
      </el-tab-pane>
    </el-tabs>
    <div class="add-faq-footer">
      <el-button
        v-if="faqType === 'add' || faqType === 'edit'"
        size="small"
        :disabled="disable"
        type="primary"
        @click="saveFaq"
      >
        {{ $t("aicosCommon.saveBtn") }}
      </el-button>
      <el-button
        v-if="(faqType == 'add' || faqType == 'edit') && isAudit"
        size="small"
        type="primary"
        :disabled="disable"
        @click="auditKmData"
        >{{ $t("smalltalk.saveAndPublish") }}
      </el-button>
      <el-button
        v-if="(faqType == 'add' || faqType == 'edit') && !isAudit"
        size="small"
        type="primary"
        :disabled="disable"
        @click.stop="saveAndDeplay"
      >
        {{ $t("smalltalk.saveAndPublish") }}
      </el-button>
      <!--<el-button size="small" @click.stop="">纠错</el-button>-->
      <!-- <el-button
        size="small"
        v-if="faqType !== 'version'"
        @click="closeFaqAdd"
        >{{ $t("aicosCommon.cancelBtn") }}</el-button
      > -->
    </div>
  </div>
</template>
<script>
import Basic from "./basic";
import More from "./more";
import {
  savefaqUrl,
  getChatDataUrl,
  updateChatUrl,
} from "@/api/kwKnowledgeCenter/kwKnowledgeMangement/smalltalk/index";
import {
  getAuditSetting,
  kmAuditStart,
} from "@/views/kwRobotManage/kwAudit/kwAuditCommon";
import { mapGetters } from "vuex";
export default {
  inject: ["desktopWindow", "desktop"],
  components: {
    Basic,
    More,
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
      default: "",
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
      if (this.faqType === "edit" || this.faqType === "view") {
        type = "0";
      } else if (this.faqType === "version") {
        type = "1";
        version = this.curFaqObj.version;
      }
      getChatDataUrl(this.curFaqObj.id, type, version).then((resData) => {
        resData = resData.data;
        if (resData.code === 200) {
          this.$refs.basic.setFaqBasicData(resData.data);
          this.$refs.more.setFaqMoreData(resData.data);
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
    saveFaqMore(res) {
      let faqMoreForm = this.$refs.more.$refs.faqMoreFormRef;

      faqMoreForm.validate((flag) => {
        if (flag) {
          console.log(res);
        }
      });
    },

    // 提交数据保存faq
    submitFaq(isDeplay, startAudit = false) {
      let that = this;
      let submitData = {};
      let faqBasicForm = this.$refs.basic.$refs.faqBasicFormRef;
      let faqMoreForm = this.$refs.more.$refs.faqMoreFormRef;
      let submitRecommendList = [],
        basicPromiseDone,
        morePromiseDone;
      const basicPromise = new Promise((resolve) => {
        faqBasicForm.validate((valid, done) => {
          if (valid) {
            basicPromiseDone = done();
            resolve();
          }
        });
      });
      const morePromise = new Promise((resolve) => {
        faqMoreForm.validate((valid, done) => {
          if (valid) {
            morePromiseDone = done();
            resolve();
          }
        });
      });

      Promise.all([basicPromise, morePromise]).then(async () => {
        // 基础设置保存
        that.basicData = that.$refs.basic.saveFaqBasic();
        if (!that.basicData) {
          return;
        }
        // 更多设置保存
        that.faqMoreData = that.$refs.more.saveFaqMore();

        that.faqMoreData.recommendList.forEach((item) => {
          submitRecommendList.push({
            reContent: item.id,
          });
        });

        submitData = {
          submitApprovalStatus: startAudit,
          gossipQuestion: {
            finalVerifyStatus: isDeplay,
            botId: that.botId,
            ...that.basicData.faqquestion,
            ...that.faqMoreData.faqquestion,
          },
          gossipAnswer: that.basicData.faqanswer,
          extquestion: that.basicData.extquestion,
          regquestion: that.basicData.regquestion,
          inteList: that.faqMoreData.inteList,
          gossipFollowAsk: that.faqMoreData.faqFollowAsk,
          recommendList: submitRecommendList,
        };
        // console.log(submitData);
        this.disable = true;
        this.disable = true;
        if (that.faqType == "edit") {
          updateChatUrl(submitData)
            .then(async (res) => {
              //开启审核流程
              if (startAudit) {
                await kmAuditStart(
                  res.data.data,
                  3,
                  this.auditSetting.processDefineId
                );
              }
            })
            .then(() => {
              if (!startAudit) {
                this.$message({
                  type: "success",
                  message: this.$t("aicosCommon.saveSuccessTip"),
                });
              }
              that.$emit("addOrEditEmitEvent", {
                type: "mangelist",
                nodeDeepPath: this.nodeDeepPath,
              });
              this.disable = false;
            })
            .catch(() => {
              this.disable = false;
              basicPromiseDone;
              morePromiseDone;
            });
        } else {
          savefaqUrl(submitData)
            .then(async (res) => {
              //开启审核流程
              if (startAudit) {
                await kmAuditStart(
                  res.data.data,
                  3,
                  this.auditSetting.processDefineId
                );
              }
            })
            .then(() => {
              if (!startAudit) {
                this.$message({
                  type: "success",
                  message: this.$t("aicosCommon.saveSuccessTip"),
                });
              }
              that.$emit("addOrEditEmitEvent", {
                type: "mangelist",
                nodeDeepPath: this.nodeDeepPath,
              });
              this.disable = false;
            })
            .catch(() => {
              this.disable = false;
              basicPromiseDone;
              morePromiseDone;
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
    // 关闭faq
    closeFaqAdd() {
      this.$emit("addOrEditEmitEvent", {
        type: "mangelist",
        nodeDeepPath: this.nodeDeepPath,
      });
    },
    auditKmData() {
      this.submitFaq(0, true);
    },
    async getAuditConfig() {
      const dataParam = {
        kmType: 3,
        tenantId: this.$store.state.user.currentTenantId,
      };
      this.auditSetting = await getAuditSetting(dataParam);
      this.isAudit = this.auditSetting.approvalProcessStatus;
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

    if (this.faqType !== "add") {
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
