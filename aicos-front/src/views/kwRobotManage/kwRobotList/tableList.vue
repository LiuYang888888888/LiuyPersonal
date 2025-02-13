<template>
  <div class="container">
    <div class="kw-base-container" style="background: none">
      <div class="kw-header header" style="margin-right: 10px">
        <el-button
          type="success"
          round
          size="small"
          class="kw-batch-button kw-btn-green"
          @click="handlerAddRobot"
          style="margin-right: 10px"
        >
          <!-- 新建机器人 -->
          {{ $t("kwRobotManage.buildRobot") }}
        </el-button>
        <!-- <el-button
          round
          size="small"
          class="kw-batch-button kw-btn-blue"
          style="margin-right: 10px"
        >
          {{ $t("kwRobotManage.importRobot") }}
        </el-button> -->
        <div class="search-container" style="display: flex; align-items: center">
          <el-input
            placeholder="请输入机器人名称"
            v-model="robotName"
            clearable
            class="input-container"
            size="small"
          >
          </el-input>
          <i
            class="el-icon-search"
            style="color: #fff; margin-left: 10px; cursor: pointer"
            title="搜索"
            @click="handlerSearch"
          ></i>
          <!-- @click="handlerSearch" -->
        </div>
        <img
          src="./image/view.png"
          alt=""
          title="轴线模式"
          @click="changeView"
          style="margin: 0 10px; cursor: pointer; width: 18px"
        />
        <!-- <img src="./image/table.png" alt="" title="列表模式" style="cursor: pointer;width: 28px;height: 28px;" /> -->
      </div>
      <div class="card-container">
        <div class="noData" v-if="data.length == 0 && isHasTips">
          <span>暂无数据</span>
        </div>
        <el-row
          style="background: none"
          :gutter="25"
          class="row-container"
          v-if="data.length > 0 && !isHasTips"
        >
          <el-col
            :span="6"
            :key="index"
            class="col-container"
            v-for="(item, index) in data"
            style="cursor: pointer"
          >
            <!-- @mouseenter="enter($event, index)" @mouseleave="leave($event, index)" -->
            <div
              @mouseenter="enter($event, index)"
              @mouseleave="leave($event, index)"
              @click="toNewWindow(item)"
            >
              <div
                class="robot-card"
                :class="currentIndex == index ? 'enterBg' : 'normalBg'"
              >
                <!-- :class="currentIndex == index ? 'enterBg' : 'normalBg'" -->
                <!-- 收藏标识 -->
                <div class="collect-flag" v-if="item.isDescribe == 1">
                  <img src="./image/shoucang.png" alt="" />
                </div>
                <!-- 更多操作 -->
                <div class="more-operate">
                  <!--  v-show="currentIndex == index" -->
                  <div
                    class="more-container"
                    @mouseenter="enterOperate"
                    @mouseleave="leaveOperate"
                    v-show="currentIndex == index"
                    style="width: 70px; text-align: right"
                  >
                    <span @click.stop>...</span>
                    <el-collapse-transition>
                      <ul class="operate-list" v-show="currentIndex == index && isShow">
                        <!-- v-show="currentIndex == index && isShow" -->
                        <li
                          class="operate-item"
                          @click.stop="handlerOperate(item, 'default')"
                          v-if="item.isDescribe == 0"
                        >
                          默 认
                        </li>
                        <li
                          class="operate-item"
                          @click.stop="handlerOperate(item, 'cancelDefault')"
                          v-if="item.isDescribe == 1"
                        >
                          取 消 默 认
                        </li>
                        <!-- <li class="operate-item">导 出</li> -->
                        <li
                          class="operate-item"
                          @click.stop="handlerOperate(item, 'edit')"
                        >
                          编 辑
                        </li>
                        <li
                          class="operate-item"
                          @click.stop="handlerOperate(item, 'del')"
                        >
                          删 除
                        </li>
                      </ul>
                    </el-collapse-transition>
                  </div>
                </div>
                <!-- 头像区域在卡片里面-->
                <div class="avatar-container">
                  <el-avatar
                    :size="currentIndex == index ? 80 : 60"
                    :src="item.headImgUrl"
                    class="avatar"
                  ></el-avatar>
                </div>
                <!-- 机器人名称存放区域 -->
                <div class="robot-name" :title="item.robotName">
                  <span>{{ item.robotName }}</span>
                </div>
                <!-- 机器人知识量展示区域 -->
                <div class="robot-knowledgeNum">
                  <span class="knowledge-title">知识量:</span
                  ><span class="knowledge-num">{{
                    item.knowledgeCount === null ? 0 : item.knowledgeCount
                  }}</span>
                </div>
                <!-- 简介 -->
                <!-- <div class="abstract" v-if="currentIndex != index">
                  <span class="abstract-title">{{
                    item.description != "" ? item.description : "- - - -"
                  }}</span>
                </div> -->
                <!-- 查看按钮 -->
                <!-- v-if="!enterOrLeave" -->
                <div class="operate-btn" v-if="currentIndex == index">
                  <el-button
                    type="success"
                    style="width: 180px"
                    round
                    size="small"
                    class="kw-batch-button kw-btn-robot"
                  >
                    <!-- @click="toNewWindow" -->
                    {{ $t("kwRobotManage.viewRobot") }}
                  </el-button>
                </div>
              </div>
            </div>
          </el-col>
        </el-row>
      </div>
      <div class="page-container">
        <el-pagination
          :total="total"
          page-size="8"
          pager-count="5"
          @current-change="currentChange"
          @prev-click="prevClick"
          @next-click="nextClick"
          layout="prev, pager, next"
        >
        </el-pagination>
      </div>
    </div>
    <HuilanDialog
      :title="isEdit ? $t('kwRobotManage.editRobot') : $t('kwRobotManage.buildRobot')"
      append-to-body
      :visible.sync="addFlag"
      width="600px"
    >
      <Add ref="addRobot" @successSave="successSave" :cur="cur" v-if="addFlag" />
      <template v-slot:footer>
        <el-button size="small" @click="addFlag = false">{{
          $t("aicosCommon.cancelBtn")
        }}</el-button>
        <el-button size="small" type="primary" @click="handlerSave">{{
          $t("aicosCommon.saveBtn")
        }}</el-button>
      </template>
    </HuilanDialog>
  </div>
</template>

<script>
import {
  robotListData,
  deleteRobot,
  settingDefault,
} from "@/api/kwRobot/kwRobotTrain/index";
import Add from "./add.vue";
export default {
  inject: ["desktopWindow", "desktop"],
  mounted() {
    this.getRobotList();
  },
  props: {
    robotInfo: {
      type: String,
      default: () => {
        return "";
      },
    },
  },
  data() {
    return {
      isHasTips: false,
      isShow: false,
      isEdit: false, //是否是编辑
      addFlag: false,
      cur: {},
      currentIndex: -1,
      robotName: this.robotInfo,
      data: [],
      page: {
        pageSize: 8,
        current: 1,
      },
    };
  },
  components: {
    Add,
  },
  methods: {
    //获取机器人列表
    async getRobotList() {
      this.loading = true;
      const info = {
        type: 0, //机器人列表
        robotName: this.robotName, //机器人名称
        size: this.page.pageSize, //每页三条
        current: this.page.current, //第几页开始
      };
      const result = await robotListData(info);
      if (result.data.code == 200) {
        const Data = result.data.data;
        this.total = Data.total;
        this.data = Data.records;
        if (Data.total > 0) {
          this.isHasTips = false;
        } else {
          this.isHasTips = true;
        }
        if (this.data.length == 0 && this.page.current != 1) {
          this.page.current = this.page.current - 1;
          this.getRobotList();
        }
        this.loading = false;
      }
    },
    currentChange(current) {
      this.page.current = current;
      this.getRobotList();
    },
    prevClick(current) {
      this.page.current = current;
      this.getRobotList();
    },
    nextClick(current) {
      this.page.current = current;
      this.getRobotList();
    },
    //移入
    enter(e, index) {
      this.currentIndex = index;
    },
    leave() {
      this.currentIndex = -1;
    },
    enterOperate() {
      this.isShow = true;
    },
    leaveOperate() {
      this.isShow = false;
    },
    //新建机器人
    handlerAddRobot() {
      this.addFlag = true;
      this.isEdit = false;
      this.cur = {};
    },
    //搜索
    handlerSearch() {
      this.getRobotList();
    },
    //保存成功
    successSave() {
      this.addFlag = false;
      this.getRobotList();
    },
    handlerSave() {
      this.$refs.addRobot.save();
    },
    //切换视图
    changeView() {
      this.$emit("handlerChange", { fromFlag: "table", robotName: this.robotName });
    },
    //操作按钮
    handlerOperate(item, type) {
      if (type == "default") {
        //设为默认
        this.$confirm(this.$t("kwRobotManage.isSetDefault"), {
          cancelButtonText: this.$t("aicosCommon.cancelBtn"),
          confirmButtonText: this.$t("aicosCommon.confirmBtn"),
          type: "warning",
        })
          .then(async () => {
            const info = {
              id: item.id,
              type: 1,
            };
            const result = await settingDefault(info);
            if (result.data.code == 200) {
              this.$message({
                type: "success",
                message: this.$t("aicosCommon.successOperate"),
              });
              this.getRobotList();
            }
          })
          .catch(() => {});
      } else if (type == "cancelDefault") {
        this.$confirm(this.$t("kwRobotManage.isCancelDefault"), {
          cancelButtonText: this.$t("aicosCommon.cancelBtn"),
          confirmButtonText: this.$t("aicosCommon.confirmBtn"),
          type: "warning",
        })
          .then(async () => {
            const info = {
              id: item.id,
              type: 0,
            };
            const result = await settingDefault(info);
            if (result.data.code == 200) {
              this.$message({
                type: "success",
                message: this.$t("aicosCommon.successOperate"),
              });
              this.getRobotList();
            }
          })
          .catch(() => {});
      } else if (type == "edit") {
        this.addFlag = true;
        this.isEdit = true;
        this.cur = item;
      } else if (type == "del") {
        this.$confirm(this.$t("answerViewManage.delViewTypeTips"), {
          cancelButtonText: this.$t("aicosCommon.cancelBtn"),
          confirmButtonText: this.$t("aicosCommon.confirmBtn"),
          type: "warning",
        })
          .then(async () => {
            const info = {
              id: item.id,
            };
            const result = await deleteRobot(info);
            if (result.data.code == 200) {
              this.$message({
                type: "success",
                message: this.$t("aicosCommon.deleteSuccessTip"),
              });
              this.getRobotList();
            }
          })
          .catch(() => {});
      }
    },
    // 获取知识中心菜单
    // 获取知识中心菜单
    getKnowledgeCenterMenu(code) {
      let menus = this.$store.getters.menu;
      let curCodeMenu = {};

      menus.every((item) => {
        if (item.code == code) {
          curCodeMenu = item;
          return false;
        }
        return true;
      });

      return curCodeMenu;
    },

    toNewWindow(item) {
      let linkObj = {
        ...this.getKnowledgeCenterMenu("knowledgeCenter"),
      };
      this.$store.commit("SET_BOTOBJ", item);
      if (this.desktop) {
        this.desktop.handleItemClick(linkObj);
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.container {
  height: 100%;
  background: url("./image/bg.png") no-repeat center;
  background-size: 100% 100%;
  .card-container {
    height: calc(100% - 90px);
    position: relative;
    .noData {
      font-size: 50px;
      font-weight: 700;
      position: absolute;
      left: 50%;
      top: 50%;
      margin-left: -100px;
      margin-top: -28px;
    }
  }
  .header {
    display: flex;
    align-items: center;
    justify-content: flex-end;
  }
  .input-container {
    width: 200px;

    /deep/ .el-input__inner {
      background: none;
      border-radius: 30px;
      color: #fff;
    }
  }
  .normalBg {
    background: linear-gradient(to bottom, rgb(84, 98, 131), rgb(30, 42, 68));
  }
  .enterBg {
    background: rgba(42, 53, 76, 0.5);
  }
  .robot-card {
    margin: 20px 0;
    border: 1px solid;
    position: relative;
    border-radius: 20px;
    height: 280px;
    text-align: center;
    .collect-flag {
      position: absolute;
      top: 20px;
      left: 20px;
    }
    .more-operate {
      position: absolute;
      right: 20px;
      top: 15px;
      color: #fff;
      font-size: 18px;
      cursor: pointer;
      .operate-list {
        text-align: center;
        list-style: none;
        font-size: 14px;
        padding: 0;
        margin-top: 0;
        border-radius: 10px;
        background-color: rgba(0, 0, 0, 0.2);
        width: 80px;
        height: 90px;
        .operate-item {
          height: 30px;
          line-height: 30px;
          &:hover {
            background: rgb(84, 98, 131);
          }
        }
      }
    }
    .avatar-outContainer {
      position: relative;
      top: -40px;
    }
    .avatar-container {
      display: flex;
      align-items: center;
      justify-content: center;
      margin: 30px 0;
      .avatar {
        margin: 0 20px;
      }
    }
    .robot-name {
      padding: 0 20px;
      width: 100%;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      font-size: 18px;
      color: rgb(245, 247, 249);
      margin-bottom: 25px;
    }
    .robot-knowledgeNum {
      margin-bottom: 20px;
      .knowledge-title {
        font-size: 14px;
        color: rgb(245, 247, 249);
      }
      .knowledge-num {
        font-size: 24px;
        color: rgb(42, 132, 255);
      }
    }
    .abstract {
      margin-bottom: 10px;
      padding: 0 20px;
      white-space: nowrap;
      text-overflow: ellipsis;
      overflow: hidden;
      .abstract-title {
        font-size: 12px;
        color: rgb(255, 255, 255);
        width: 250px;
        white-space: nowrap;
        text-overflow: ellipsis;
        overflow: hidden;
      }
    }
    .operate-btn {
      .kw-btn-robot {
        background: linear-gradient(
          to right,
          rgb(255, 174, 0),
          rgb(255, 202, 43),
          rgb(255, 229, 85)
        );
        border-color: rgb(255, 202, 43);
        color: #fff;
        &:hover {
          background: linear-gradient(
            to right,
            rgb(255, 174, 0),
            rgb(255, 202, 43),
            rgb(255, 229, 85)
          );
          color: #fff;
        }
        &:focus {
          background: linear-gradient(
            to right,
            rgb(255, 174, 0),
            rgb(255, 202, 43),
            rgb(255, 229, 85)
          );
          color: #fff;
        }
      }
    }
  }
  .page-container {
    text-align: center;
    /deep/ .el-pagination {
      .btn-prev {
        width: 50px;
        height: 50px;
        background: rgba(0, 0, 24, 0.5);
        border-radius: 30px 0 0 30px;
        .el-icon-arrow-left {
          font-size: 22px;
          color: #fff;
        }
      }
      .el-pager {
        li.btn-quicknext {
          height: 50px;
          line-height: 50px;
          background: rgba(0, 0, 24, 0.5);
        }
        li.btn-quickprev {
          height: 50px;
          line-height: 50px;
          background: rgba(0, 0, 24, 0.5);
        }
        .number {
          height: 50px;
          line-height: 50px;
          background: rgba(0, 0, 24, 0.5);
        }
      }

      .btn-next {
        width: 50px;
        height: 50px;
        background: rgba(0, 0, 24, 0.5);
        border-radius: 0 30px 30px 0;
        .el-icon-arrow-right {
          font-size: 22px;
          color: #fff;
        }
      }
    }
  }
}
</style>
