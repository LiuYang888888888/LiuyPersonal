<template>
  <div class="container">
    <div class="trainContainer">
      <!-- <div class="choose-Container">
        <el-select size="small" v-model="chooseValue" filterable placeholder="请选择">
          <el-option
            v-for="item in options"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          >
          </el-option>
        </el-select>
      </div> -->
      <div v-if="hasTrainBtn" class="btnContainer">
        <el-button
          type="primary"
          size="small"
          class="kw-search-btn"
          @click="beginTrain"
          >{{
            isGoingFlag
              ? $t("kwRobotManage.goingTrain")
              : $t("kwRobotManage.trainName")
          }}
          <i @click.stop="goToSetting" class="el-icon-arrow-right"></i>
        </el-button>
      </div>
      <div
        v-if="hasAssistant"
        class="header-assistant-icon"
        @click="assistantBtn"
      >
        <img
          class="desk-window-warnIcon"
          src="~@/assets/kwRobotTrain/warn.png"
          alt=""
        />
        <img src="~@/assets/kwRobotTrain/assistant.png" alt="" />
      </div>
    </div>
    <!-- <div class="progressContainer" v-if="isGoingFlag">
      <el-progress
        :text-inside="true"
        :stroke-width="22"
        :percentage="progressNum"
        show-text="true"
        status="warning"
      ></el-progress>
    </div> -->
    <!-- 助手 -->
    <el-dialog
      append-to-body
      :visible.sync="isShowAssistant"
      width="400px"
      trigger="click"
      title=""
      custom-class="desk-assistant-dialogHeader"
    >
      <div v-if="isShowAssistant">
        <div style="margin-bottom: 20px">
          <span style="font-weight: 700; color: #333333">{{
            $t("kwRobotManage.robotAssistant")
          }}</span>
          <img
            class="desk-window-setIcon"
            src="~@/assets/kwRobotTrain/setIcon.png"
            alt=""
            @click="openSet"
          />
        </div>
        <div>
          <span class="desk-window-check"
            >{{ $t("kwRobotManage.detected")
            }}<font style="color: #ff1d1d">{{ problemNum }} </font
            >{{ $t("kwRobotManage.robotHealth") }}</span
          >
          <el-button
            type="text"
            @click="toView"
            style="margin-left: 90px; color: #0099ff"
            >{{ $t("kwRobotManage.immediateProcessing") }}></el-button
          >
        </div>
      </div>
    </el-dialog>
    <!-- 健康助手设置 -->
    <HuilanDialog
      append-to-body
      :visible.sync="isShowSetAssistant"
      width="600px"
      trigger="click"
      :title="$t('kwRobotManage.setup')"
      :close-on-click-modal="false"
    >
      <KwAssistant
        v-if="isShowSetAssistant"
        ref="saveSet"
        @successSet="successSet"
      />
      <template v-slot:footer>
        <el-button size="small" @click="isShowSetAssistant = false">{{
          $t("aicosCommon.cancelBtn")
        }}</el-button>
        <el-button size="small" type="primary" @click="saveAssistantSet">{{
          $t("aicosCommon.saveBtn")
        }}</el-button>
      </template>
    </HuilanDialog>
    <!-- 查看处理结果 -->
    <HuilanDialog
      append-to-body
      :visible.sync="viewFlag"
      width="800px"
      trigger="click"
      :title="$t('kwRobotManage.setup')"
      :close-on-click-modal="false"
    >
      <ProblemList v-if="viewFlag" />
      <template v-slot:footer>
        <el-button size="small" @click="viewFlag = false">{{
          $t("aicosCommon.cancelBtn")
        }}</el-button>
        <!-- <el-button size="small" type="primary" @click="saveAssistantSet">{{
          $t("aicosCommon.saveBtn")
        }}</el-button> -->
      </template>
    </HuilanDialog>
  </div>
</template>

<script>
import { randomLenNum } from "@/util/util";
import { mapGetters } from "vuex";
import {
  robotTrainStart,
  // progress,
  // isGoing,
  healthDetection,
} from "@/api/kwRobot/kwRobotTrain/index";
var curCodeMenu = {};
import KwAssistant from "@/components/kwAssistant/index";
import ProblemList from "./problemList";
export default {
  inject: ["desktopWindow", "desktop"],
  props: {
    hasTrainBtn: {
      type: Boolean,
      default: true,
    },
    hasAssistant: {
      type: Boolean,
      default: true,
    },
  },
  data() {
    return {
      viewFlag: false,
      timer: "", //存储定时器实例
      isGoingFlag: false, //是否处于训练中的标识
      chooseValue: "", //选择了哪个机器人
      botId: "",
      progressNum: 0, //进度数值
      problemNum: 0,
      options: [
        {
          value: "1",
          label: "1",
        },
        {
          value: "2",
          label: "2",
        },
      ],
      isShowAssistant: false, //助手弹框
      isShowSetAssistant: false, //助手设置弹框
      socket: null,
    };
  },
  components: {
    KwAssistant,
    ProblemList,
  },
  mounted() {
    const _this = this;
    this.botId = this.botObj.id;
    if (this.botId) {
      // const result = await isGoing(info);
      // if (result.data.code == 200) {
      //   this.isGoingFlag = result.data.data;
      //   if (this.isGoingFlag) {
      //     //正在训练
      //     this.isGoingFlag = true;
      //     this.$store.commit('SET_ROBOTSTATE', true);
      //     // this.timer = setInterval(async () => {
      //     //   const progressInfo = {
      //     //     botId: this.botId,
      //     //   };
      //     //   const result = await progress(progressInfo);
      //     //   if (result.data.code == 200) {
      //     //     const progressNum = result.data.data;
      //     //     this.progressNum = progressNum.split("%")[0];
      //     //     if (progressNum == "100%") {
      //     //       clearInterval(this.timer);
      //     //       this.$message({
      //     //         type: "success",
      //     //         message: this.$t("kwRobotManage.finishTrained"),
      //     //       });
      //     //       this.isGoingFlag = false;
      //     //       this.progressNum = 0;
      //     //       this.timer = "";
      //     //     }
      //     //   }
      //     // }, 1000);
      //   }
      // }
      if (!this.hasTrainBtn) {
        return;
      }
      this.num = randomLenNum(12);
      this.$socket.register(window.location.origin + "/modelServer", {
        tenantId: _this.$store.state.user.currentTenantId,
        userId: _this.userInfo.id,
        roomId: _this.botId,
        socketUuid: _this.num,
      });
      this.$socket.connect(_this.output);
      this.$socket.chatEvent(_this.output);
    }
  },
  computed: {
    ...mapGetters(["botObj", "userInfo"]),
  },
  methods: {
    async beginTrain() {
      // const _this = this;
      if (this.isGoingFlag) {
        this.$message({
          type: "warning",
          message: this.$t("kwRobotManage.trainingMessage"), //正在训练中,请稍等
        });
        return;
      } else {
        this.$confirm(this.$t("kwRobotManage.isReadyTraining"), {
          cancelButtonText: this.$t("aicosCommon.cancelBtn"),
          confirmButtonText: this.$t("aicosCommon.confirmBtn"),
          type: "warning",
        })
          .then(async () => {
            const info = {
              botId: this.botId,
            };
            const result = await robotTrainStart(info);
            if (result.data.code == 200) {
              this.isGoingFlag = true;
              this.$store.commit("SET_ROBOTSTATE", true);
              // this.timer = setInterval(async () => {
              //   const progressInfo = {
              //     botId: this.botId,
              //   };
              //   const result = await progress(progressInfo);
              //   if (result.data.code == 200) {
              //     const progressNum = result.data.data;
              //     this.progressNum = progressNum.split("%")[0];
              //     if (progressNum == "100%") {
              //       clearInterval(this.timer);
              //       this.$message({
              //         type: "success",
              //         message: this.$t("kwRobotManage.finishTrained"),
              //       });
              //       this.isGoingFlag = false;
              //       this.progressNum = 0;
              //       this.timer = "";
              //     }
              //   }
              // }, 1000);
              // this.socket = this.$socket.connect(
              //   "http://172.16.20.204:9081/modelServer",
              //   _this.$store.state.user.currentTenantId,
              //   _this.userInfo.id,
              //   _this.botId,
              //   randomLenNum(5),
              //   _this.output
              // );
              // let jsonObject = {
              //   tenantId: this.$store.state.user.currentTenantId,
              //   roomId: this.botId,
              // };
              // this.socket.emit("JOIN_ROOM", jsonObject);
              // this.$socket.joinRoom(jsonObject, _this.output);
              // this.$socket.chatEvent(_this.output);
            }
          })
          .catch(() => {});
      }
      //alert("我点的是按钮");
    },
    output(message) {
      console.log(message);
      this.$emit("state", { socket: this.$socket, num: this.num });
      if (message.type === "chatevent") {
        if (message.message === "success" || message.message === "failure") {
          let text =
            message.message === "success"
              ? this.$t("kwRobotManage.trainingSuccessfulTips")
              : this.$t("kwRobotManage.trainingFailedfulTips");

          if (message.message === "failure") {
            this.$message.error(text);
          } else {
            this.$message.success(text);
          }
          this.isGoingFlag = false;
          this.$store.commit("SET_ROBOTSTATE", false);
        }
        if (message.message === "in_progress") {
          this.isGoingFlag = true;
          this.$store.commit("SET_ROBOTSTATE", true);
        }
        if (message.message === "leisure") {
          this.isGoingFlag = false;
        }
      }
    },
    getKnowledgeCenterMenu(code) {
      let menus = this.$store.getters.menu;
      menus.every((item) => {
        if (item.code == code) {
          curCodeMenu = item;
          return;
        } else {
          this.getMenuList(item.menuList, code);
        }
      });
    },
    getMenuList(arr, code) {
      arr.every((item) => {
        if (item.code == code) {
          curCodeMenu = item;
          return;
        } else {
          this.getMenuList(item.menuList, code);
        }
      });
      return curCodeMenu;
    },

    // goToSetting() {
    //   const linkObj = {
    //     ...this.getKnowledgeCenterMenu("model"),
    //   };
    //   if (this.desktop) {
    //     this.desktop.handleItemClick(linkObj);
    //   }
    // },
    //小助手
    // async assistantBtn() {
    //   const info = {
    //     id: this.botId,
    //   };
    //   const result = await healthDetection(info);
    //   if (result.data.code == 200) {
    //     this.problemNum = result.data.data;
    //   }
    // },
    //小助手
    async assistantBtn() {
      const info = {
        id: this.botId,
      };
      const result = await healthDetection(info);
      if (result.data.code == 200) {
        this.problemNum = result.data.data;
      }
      this.isShowAssistant = true;
    },
    openSet() {
      this.isShowAssistant = false;
      this.isShowSetAssistant = true;
    },
    //保存助手设置
    saveAssistantSet() {
      this.$refs.saveSet.submit();
    },
    successSet(flag) {
      this.isShowSetAssistant = flag;
    },
    toView() {
      this.isShowAssistant = false;
      this.viewFlag = true;
    },
  },
  // beforeDestroy() {
  //   clearInterval(this.timer);
  // },
};
</script>

<style lang="scss" scoped>
.container {
  position: relative;

  .trainContainer {
    display: flex;

    .btnContainer {
      margin-left: 10px;
    }
  }

  .progressContainer {
    position: absolute;
    left: 10px;
    width: 100px;
  }
}

/deep/.header-assistant-icon {
  cursor: pointer;
  position: relative;

  img {
    width: 29px;
    margin: 0 20px;
  }

  .desk-window-warnIcon {
    position: absolute;
    width: 19px;
    top: -5px;
    right: -13px;
  }
}

/deep/.avue-crud__dialog__menu {
  display: none !important;
}

/deep/.desk-assistant-dialogHeader {
  margin-right: 10vh !important;
  margin-top: 10vh !important;

  .el-dialog__header {
    display: none !important;
    border-bottom: none !important;
  }

  .el-dialog__body {
    padding: 20px !important;
  }
}

/deep/.desk-window-setIcon {
  width: 25px !important;
  float: right;
  cursor: pointer;
}

.desk-window-check {
  color: #1e1e1e;
}
</style>
