<template>
  <div class="container">
    <div class="left-shape"></div>
    <div class="right-shape"></div>
    <div class="kw-base-container" style="background: none">
      <div class="kw-header header" style="margin-right: 10px">
        <!-- 新建机器人 -->
        <!-- <el-button
          type="success"
          round
          size="small"
          class="kw-batch-button kw-btn-green"
          @click="handlerAddRobot"
          style="margin-right: 10px"
        >
          {{ $t("kwRobotManage.buildRobot") }}
        </el-button> -->
        <!-- <el-button
          round
          size="small"
          class="kw-batch-button kw-btn-blue"
          style="margin-right: 10px"
        >
          {{ $t("kwRobotManage.importRobot") }}
        </el-button> -->
        <div
          class="search-container"
          style="display: flex; align-items: center"
          @mouseenter="changeIsShow(true)"
          @mouseleave="changeIsShow(false)"
        >
          <!-- v-if="isShowSearch" -->
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
        </div>
        <!-- <img
          src="./image/chooseThree.png"
          alt=""
          title="轴线模式"
          style="margin: 0 10px; cursor: pointer;width: 28px;height: 28px;"
        /> -->
        <img
          src="./image/juzhen.png"
          @click="changeView"
          alt=""
          title="列表模式"
          style="cursor: pointer; margin: 0 10px; width: 18px"
        />
      </div>
      <div class="robot-container">
        <div class="noData" v-if="data.length == 0 && isHasTips">
          <span>暂无数据</span>
        </div>
        <el-row
          style="background: none"
          :gutter="80"
          class="row-container"
          v-if="data.length > 0 && !isHasTips"
        >
          <el-col
            :span="8"
            v-for="(item, index) in data"
            :key="index"
            class="col-container"
          >
            <div
              @mouseenter="enter($event, index)"
              @mouseleave="leave($event, index)"
              @click="toNewWindow(item)"
            >
              <div
                class="robot-card"
                :class="currentIndex == index ? 'enterBg' : 'normalBg'"
              >
                <!-- 收藏标识 -->
                <div class="collect-flag" v-if="item.isDescribe == 1">
                  <img src="./image/shoucang.png" alt="" />
                </div>
                <!-- 头像区域在卡片外面 -->
                <div class="avatar-outContainer" v-if="currentIndex == index">
                  <el-avatar
                    :size="80"
                    :src="item.headImgUrl"
                    class="avatar"
                  ></el-avatar>
                </div>
                <!-- 头像区域在卡片里面-->
                <div class="avatar-container" v-if="currentIndex != index">
                  <img src="./image/left-white-line.png" alt="" />
                  <el-avatar
                    size="larger"
                    :src="item.headImgUrl"
                    class="avatar"
                  ></el-avatar>
                  <img src="./image/right-white-line.png" alt="" />
                </div>
                <!-- 机器人名称存放区域 -->
                <div class="robot-name" :title="item.robotName">
                  <span>{{ item.robotName }}</span>
                </div>
                <!-- 机器人知识量展示区域 -->
                <div class="robot-knowledgeNum">
                  <span class="knowledge-title">知识量：</span>
                  <span class="knowledge-num">{{
                    item.knowledgeCount === null ? 0 : item.knowledgeCount
                  }}</span>
                </div>
                <!-- 简介 -->
                <!-- <div class="abstract">
                  <span class="abstract-title">{{ item.description }}</span>
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
                    {{ $t("kwRobotManage.viewRobot") }}
                  </el-button>
                </div>
              </div>
              <!-- 功能按钮 -->
              <div
                class="function-btn"
                :class="
                  currentIndex == index
                    ? 'showBtn-container'
                    : 'hidden-container'
                "
              >
                <el-row style="background: none" :gutter="20">
                  <el-col
                    :span="8"
                    class="btnContainer"
                    v-if="item.isDescribe == 0"
                    @click.native.stop="changeStatus(item, true)"
                  >
                    <img src="./image/default.png" alt="" />
                    <span class="function-title">设为默认</span>
                  </el-col>
                  <el-col
                    :span="8"
                    class="btnContainer"
                    v-if="item.isDescribe == 1"
                    @click.native.stop="changeStatus(item, false)"
                  >
                    <img src="./image/default.png" alt="" />
                    <span class="function-title">取消默认</span>
                  </el-col>
                  <!-- <el-col :span="6" class="btnContainer">
                    <img src="./image/daochu.png" alt="" />
                    <span class="function-title">导出</span>
                  </el-col> -->
                  <el-col
                    :span="8"
                    class="btnContainer"
                    @click.native.stop="editRobot(item)"
                  >
                    <img src="./image/edit.png" alt="" />
                    <span class="function-title">编辑</span>
                  </el-col>
                  <el-col
                    :span="8"
                    class="btnContainer"
                    @click.native.stop="deleteRobot(item)"
                  >
                    <img src="./image/del.png" alt="" />
                    <span class="function-title">删除</span>
                  </el-col>
                </el-row>
              </div>
            </div>
          </el-col>
        </el-row>
      </div>
      <div class="page-container">
        <el-pagination
          :total="total"
          page-size="3"
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
      :title="
        isEdit ? $t('kwRobotManage.editRobot') : $t('kwRobotManage.buildRobot')
      "
      append-to-body
      :visible.sync="addFlag"
      width="600px"
    >
      <Add
        ref="addRobot"
        @successSave="successSave"
        :cur="cur"
        v-if="addFlag"
      />
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
  components: {
    Add,
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
      loading: false,
      robotName: this.robotInfo,
      isShowSearch: false,
      cur: {},
      currentIndex: "-1",
      total: "0",
      data: [],
      isEdit: false,
      addFlag: false,
      enterOrLeave: true,
      type: "",
      name: "",
      typeList: [
        // {
        //   label: "1",
        //   value: "测试",
        // },
      ],
      page: {
        pageSize: 3,
        current: 1,
      },
    };
  },
  mounted() {
    this.getRobotList();
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
    //编辑
    editRobot(item) {
      this.cur = item;
      this.isEdit = true;
      this.addFlag = true;
    },
    //删除机器人
    deleteRobot(item) {
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
    },
    //改变状态
    changeStatus(item, type) {
      if (type == true) {
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
      } else {
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
      }
    },
    enter(e, index) {
      this.currentIndex = index;
      // this.enterOrLeave = !this.enterOrLeave;
    },
    leave() {
      this.currentIndex = -1;
      // this.enterOrLeave = !this.enterOrLeave;
    },
    //新建机器人
    handlerAddRobot() {
      this.cur = {};
      this.isEdit = false;
      this.addFlag = true;
    },
    //移入移出展示搜索栏
    changeIsShow(flag) {
      this.isShowSearch = flag;
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
      this.$emit("handlerChange", {
        fromFlag: "view",
        robotName: this.robotName,
      });
    },
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
.container {
  height: 100%;
  background: url("./image/bg1.png") no-repeat center;
  background-size: 100% 100%;
}
.left-shape {
  border-radius: 20px;
  background: linear-gradient(to bottom, rgb(84, 98, 131), rgb(30, 42, 68));
  position: absolute;
  left: -100px;
  top: 50%;
  transform: translateY(-140px);
  width: 200px;
  height: 280px;
  z-index: 427;
}
.right-shape {
  border-radius: 20px;
  background: linear-gradient(to bottom, rgb(84, 98, 131), rgb(30, 42, 68));
  position: absolute;
  right: -100px;
  top: 60%;
  transform: translateY(-140px);
  width: 200px;
  height: 280px;
  z-index: 427;
}
.row-container {
  position: relative;

  .col-container {
    cursor: pointer;
    &:first-child {
      transform: translateY(-40px);
    }
    &:nth-child(2) {
      transform: translateY(40px);
    }
    &:nth-child(3) {
      transform: translateY(120px);
    }
  }
}
.robot-container {
  height: calc(100% - 100px);
  width: calc(100% - 200px);
  // margin-left: 100px;
  position: relative;
  padding: 0 80px;
  margin: 0 auto;
  .noData {
    font-size: 50px;
    font-weight: 700;
    position: absolute;
    left: 50%;
    top: 50%;
    margin-left: -100px;
    margin-top: -28px;
  }
  .row-container {
    //position: absolute;
    left: 0;
    top: 50%;
    right: 0;
    transform: translateY(-50%);
  }

  .normalBg {
    background: linear-gradient(to bottom, rgb(84, 98, 131), rgb(30, 42, 68));
  }
  .enterBg {
    background: rgba(42, 53, 76, 0.5);
  }
  .robot-card {
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
      margin-bottom: 35px;
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
  .showBtn-container {
    visibility: visible;
  }
  .hidden-container {
    visibility: hidden;
  }
  .function-btn {
    //position: absolute;
    //top: 290px;
    //<!-- transform: translateY(10px); -->
    display: flex;
    align-items: center;
    justify-content: space-around;
    margin-top: 10px;
    //width: 100%;
    .el-row {
      width: 100%;
    }
    .btnContainer {
      display: flex;
      align-items: center;
      cursor: pointer;
      //margin-left: 20px;
    }
    img {
      width: 16px;
    }
    .function-title {
      font-size: 12px;
      color: rgb(254, 255, 255);
      margin-left: 10px;
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
</style>
