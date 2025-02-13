<template>
  <div class="kw-tabs-base-container">
    <el-tabs v-model="activeName" :style="{
      height: tabHeight,
      overflowY: 'auto',
    }">
      <el-tab-pane :label="$t('faq.basicSettings')" name="basic">
        <AddFaqBasic :curTreeNode="curTreeNode" :basicDataObj="faqDataObj" :faqType="faqType" ref="addFaqBasic" />
      </el-tab-pane>
      <el-tab-pane :label="$t('faq.moreSettings')" name="more">
        <AddFaqMore :faqType="faqType" ref="addFaqMore" />
      </el-tab-pane>
    </el-tabs>
    <div class="add-faq-footer">
      <el-button v-if="faqType == 'add' || faqType == 'edit'" size="small" type="primary" :disabled="disable"
        @click="saveFaq">
        {{ $t("aicosCommon.saveBtn") }}
      </el-button>

      <el-button v-if="(faqType == 'add' || faqType == 'edit') && isAudit" size="small" type="primary" :disabled="disable"
        @click="auditKmData">{{ $t("faq.saveAndPublish") }}
      </el-button>

      <el-button v-if="(faqType == 'add' || faqType == 'edit') && !isAudit" size="small" type="primary"
        :disabled="disable" @click.stop="saveAndDeplay">
        {{ $t("faq.saveAndPublish") }}
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
import AddFaqBasic from "./addFaqBasic";
import AddFaqMore from "./addFaqMore";
import {
  savefaqUrl,
  getFaqDataUrl,
  updatefaqUrl,
} from "@/api/kwKnowledgeCenter/kwKnowledgeMangement/kwFaqManagement/index";
import { mapGetters } from "vuex";

import {
  getAuditSetting,
  kmAuditStart,
} from "@/views/kwRobotManage/kwAudit/kwAuditCommon";

export default {
  inject: ["desktopWindow", "desktop"],
  components: {
    AddFaqBasic,
    AddFaqMore,
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
  data () {
    return {
      disable: false,
      allWindowTopBodyHeight: 0,
      tabHeight: "", // 高度样式
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
    desktopWindowResize () {
      this.allWindowTopBodyHeight =
        this.desktopWindow.$el.getElementsByClassName(
          "desk-window-inner"
        )[0].offsetHeight;

      this.tabHeight = this.allWindowTopBodyHeight - 100 + "px";
    },

    // 获取知识
    getFaqData () {
      var type = "";
      var version = "";
      if (this.faqType == "edit" || this.faqType == "view") {
        type = "0";
      } else if (this.faqType == "version") {
        type = "1";
        version = this.curFaqObj.version;
      }
      getFaqDataUrl(this.curFaqObj.id, type, version).then((resData) => {
        resData = resData.data;
        if (resData.code == 200) {
          this.$refs.addFaqBasic.setFaqBasicData(resData.data);
          this.$refs.addFaqMore.setFaqMoreData(resData.data);
        }
      });
    },

    // 基础设置faq保存
    saveFaqBasic (res) {
      var faqBasicForm = this.$refs.addFaqBasic.$refs.faqBasicFormRef;

      faqBasicForm.validate((flag) => {
        if (flag) {
          console.log(res);
        }
      });
    },
    saveFaqMore (res) {
      var faqMoreForm = this.$refs.addFaqMore.$refs.faqMoreFormRef;

      faqMoreForm.validate((flag) => {
        if (flag) {
          console.log(res);
        }
      });
    },

    // 提交数据保存faq
    submitFaq (isDeplay, startAudit = false) {
      var that = this;
      var submitData = {};
      var faqBasicForm = this.$refs.addFaqBasic.$refs.faqBasicFormRef;
      var faqMoreForm = this.$refs.addFaqMore.$refs.faqMoreFormRef;
      var submitRecommendList = [];
      let basicPromiseDone, morePromiseDone;
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
        that.basicData = that.$refs.addFaqBasic.saveFaqBasic();
        if (!that.basicData) {
          return;
        }
        // 更多设置保存
        that.faqMoreData = that.$refs.addFaqMore.saveFaqMore();

        that.faqMoreData.recommendList.forEach((item) => {
          submitRecommendList.push({
            reContent: item.id,
          });
        });

        submitData = {
          submitApprovalStatus: startAudit,
          faqquestion: {
            finalVeriyfStatus: isDeplay,
            botId: that.botId,
            ...that.basicData.faqquestion,
            ...that.faqMoreData.faqquestion,
          },
          faqanswer: that.basicData.faqanswer,
          extquestion: that.basicData.extquestion,
          regquestion: that.basicData.regquestion,
          inteList: that.faqMoreData.inteList,
          faqFollowAsk: that.faqMoreData.faqFollowAsk,
          recommendList: submitRecommendList,
        };
        this.disable = true;
        // debugger
        if (that.faqType == "edit") {
          updatefaqUrl(submitData)
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
                  1,
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
    saveFaq () {
      this.submitFaq(0);
    },
    saveAndDeplay () {
      this.submitFaq(1);
    },
    // 关闭faq
    closeFaqAdd () {
      this.$emit("addOrEditEmitEvent", {
        type: "mangelist",
        nodeDeepPath: this.nodeDeepPath,
      });
    },

    auditKmData () {
      this.submitFaq(0, true);
    },

    async getAuditConfig () {
      const dataParam = {
        kmType: 1,
        tenantId: this.$store.state.user.currentTenantId,
      };
      this.auditSetting = await getAuditSetting(dataParam);
      this.isAudit = this.auditSetting.approvalProcessStatus;
    },
  },
  created () {
    this.botId = this.botObj.id;

    this.getAuditConfig();

    /*if (this.desktopWindow) {
      query = this.desktopWindow.data.query;

      this.botId = query.id; // 机器人id
    }*/
  },
  mounted () {
    if (this.desktopWindow) {
      // query = this.desktopWindow.data.query;

      this.allWindowTopBodyHeight =
        this.desktopWindow.$el.getElementsByClassName(
          "desk-window-inner"
        )[0].offsetHeight;
      this.tabHeight = this.allWindowTopBodyHeight - 100 + "px";

      this.desktopWindow.$on("resize", this.desktopWindowResize);
    } else {
      this.tabHeight = "calc(100% - 32px)";
    }

    if (this.faqType != "add") {
      this.getFaqData();
    }
  },
  beforeDestroy () {
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
