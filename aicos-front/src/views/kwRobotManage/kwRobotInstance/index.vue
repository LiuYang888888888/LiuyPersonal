<template>
  <div v-if="robotInstanceType == 'manageList'" style="height: 100%">
    <!-- <el-button type="primary" @click="gotoSetting">一个机器人实例</el-button> -->
    <!-- <el-empty description="描述文字"></el-empty> -->
    <div class="kw-base-container" style="background: #f8f9fa">
      <div class="kw-header">
        <!-- 新建机器人 -->
        <div class="kw-button-container">
          <el-button
            class="kw-build-button kw-btn-green"
            @click="addInstance"
            v-if="permission['robot-add']"
            >{{ $t("kwRobotManage.buildInstance") }}</el-button
          >
        </div>
        <div id="kw-form-container">
          <div class="kw-form-form">
            <el-select
              v-model="businessType"
              filterable
              clearable
              :placeholder="$t('kwRobotManage.taskType')"
              size="small"
            >
              <el-option
                v-for="(item, index) in businessData"
                :key="index"
                :label="item.name"
                :value="item.id"
              >
              </el-option>
            </el-select>
          </div>
          <div class="kw-form-form" style="margin-left: 10px">
            <el-input
              :placeholder="$t('kwRobotManage.robotNameTips')"
              v-model="robotName"
              size="small"
              clearable
              class="kw-form-type"
            >
            </el-input>
          </div>
          <div class="kw-form-btn">
            <el-button
              type="primary"
              icon="el-icon-search"
              class="kw-search-btn"
              @click="handlerSearch"
              size="small"
            ></el-button>
            <el-button class="kw-reset-btn" @click="handlerReset" size="small">
              <i class="aicosicon aicos-icon-clear"></i>
            </el-button>
          </div>
        </div>
      </div>
      <div class="robot-container">
        <el-row
          :gutter="20"
          style="background: none"
          v-show="data.length > 0 && !isShow"
        >
          <el-col
            :span="6"
            v-for="(item, index) in data"
            :key="index"
            style="margin-bottom: 70px"
            @click.native="gotoSetting(item)"
          >
            <div class="card-container">
              <div class="card-left">
                <el-avatar :size="60" :src="item.headImgUrl"></el-avatar>
              </div>
              <div class="card-right">
                <div class="operate-btn">
                  <el-dropdown
                    @command="handleCommand"
                    v-if="
                      permission['robot-edit'] || permission['robot-delete']
                    "
                  >
                    <span class="el-dropdown-link" @click.stop> ... </span>
                    <el-dropdown-menu slot="dropdown">
                      <!-- <el-dropdown-item :command="beforeHandleCommand(item,  $t('aicosCommon.export'))">{{
                        $t("aicosCommon.export")
                      }}</el-dropdown-item> -->
                      <el-dropdown-item
                        v-if="permission['robot-edit']"
                        :command="
                          beforeHandleCommand(item, $t('aicosCommon.editBtn'))
                        "
                        >{{ $t("aicosCommon.editBtn") }}</el-dropdown-item
                      >
                      <el-dropdown-item
                        v-if="permission['robot-delete']"
                        :command="
                          beforeHandleCommand(item, $t('aicosCommon.delBtn'))
                        "
                        >{{ $t("aicosCommon.delBtn") }}</el-dropdown-item
                      >
                    </el-dropdown-menu>
                  </el-dropdown>
                </div>
                <div class="introduce-container">
                  <div class="robot-name" :title="item.robotName">
                    <span>{{ item.robotName }}</span>
                  </div>
                  <div class="robotTag-container">
                    <el-tag
                      size="small"
                      style="margin-right: 10px"
                      v-if="!validatenull(item.industryName)"
                      >{{ item.industryName }}</el-tag
                    >
                    <el-tag
                      type="success"
                      size="small"
                      v-if="!validatenull(item.busnessName)"
                    >
                      {{ item.busnessName }}
                    </el-tag>
                  </div>
                  <div
                    class="desc-container"
                    :title="
                      item.description == ''
                        ? $t('kwRobotManage.notData')
                        : item.description
                    "
                  >
                    <span>{{
                      item.description == ""
                        ? $t("kwRobotManage.notData")
                        : item.description
                    }}</span>
                  </div>
                </div>
              </div>
            </div>
          </el-col>
        </el-row>
        <div class="noData" v-show="data.length == 0 && isShow">
          <img src="./image/empty.png" alt="" />
          <!-- <span>暂无数据</span> -->
          <!-- <el-empty
            description="描述"
            image="./image/empty.png"
            style="z-index: 999"
          ></el-empty> -->
        </div>
      </div>
      <div class="page-container" v-if="data.length > 0">
        <el-pagination
          background
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          @prev-click="prev"
          @next-click="next"
          page-size="8"
          layout="total,prev, pager, next,jumper"
          :current-page.sync="currentPage"
          :total="page.total"
        >
        </el-pagination>
      </div>
      <HuilanDialog
        :title="
          isEdit
            ? $t('kwRobotManage.editInstance')
            : $t('kwRobotManage.buildInstance')
        "
        append-to-body
        :visible.sync="addFlag"
        width="600px"
      >
        <Add
          ref="addRobot"
          @successSave="successSave"
          :botId="botId"
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
  </div>
  <div v-else-if="robotInstanceType == 'setting'">
    <robotInstanceSetting
      :cur="cur"
      @backInstanceList="backInstanceList"
      v-if="robotInstanceType == 'setting'"
    />
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import robotInstanceSetting from "./robotInstanceSetting/index";
import Add from "./add";
import {
  robotListData,
  getRobotDictItemListByDictCode,
  deleteRobot,
} from "@/api/kwRobot/kwRobotTrain/index";
export default {
  data() {
    return {
      isShow: false,
      businessData: [],
      data: [],
      businessType: "",
      robotName: "",
      robotInstanceType: "manageList",
      addFlag: false,
      isEdit: false,
      botId: "",
      page: {
        current: 1,
        size: 8,
        total: 0,
      },
      currentPage: 1,
    };
  },
  components: {
    robotInstanceSetting,
    Add,
  },
  computed: {
    // 计算属性
    ...mapGetters(["botObj", "permission"]),
  },
  methods: {
    //获取列表信息
    async getRobotInstanceList() {
      const info = {
        botId: this.botId,
        type: "1",
        businessType: this.businessType, //业务类型
        current: this.page.current, //第几页开始
        size: this.page.size, //每页几条
        robotName: this.robotName, //名字
      };
      const result = await robotListData(info);
      if (result.data.code == 200) {
        const Data = result.data.data;
        this.data = Data.records;
        this.page.total = Data.total;
        if (Data.total > 0) {
          this.isShow = false;
        } else {
          this.isShow = true;
        }
        if (this.data.length == 0 && this.page.current != 1) {
          this.page.current = this.page.current - 1;
          this.getRobotInstanceList();
        }
      }
    },
    handlerSearch() {
      this.getRobotInstanceList();
    },
    handlerReset() {
      this.businessType = "";
      this.robotName = "";
      this.getRobotInstanceList();
    },
    //分页相关
    handleSizeChange(size) {
      this.page.size = size;
      this.getRobotInstanceList();
    },
    handleCurrentChange(current) {
      this.page.current = current;
      this.currentPage = current;
      this.getRobotInstanceList();
    },
    prev(current) {
      this.page.current = current;
      this.getRobotInstanceList();
    },
    next(current) {
      this.page.current = current;
      this.getRobotInstanceList();
    },
    handleCommand(command) {
      switch (command.command) {
        case this.$t("aicosCommon.export"):
          this.handleDelete(command.scope);
          break;
        case this.$t("aicosCommon.editBtn"):
          this.handlerEdit(command.scope);
          break;
        case this.$t("aicosCommon.delBtn"):
          this.handlerDel(command.scope);
          break;
        default:
          this.handlePasswd(command.scope);
          break;
      }
    },
    beforeHandleCommand(scope, command) {
      return {
        scope: scope,
        command: command,
      };
    },
    //编辑
    handlerEdit(item) {
      this.addFlag = true;
      this.isEdit = true;
      this.cur = item;
    },
    //删除机器人
    handlerDel(item) {
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
            this.getRobotInstanceList();
          }
        })
        .catch(() => {});
    },
    //新建实例
    addInstance() {
      this.addFlag = true;
      this.isEdit = false;
      this.cur = {};
    },
    //保存实例
    handlerSave() {
      this.$refs.addRobot.save();
    },
    successSave() {
      this.addFlag = false;
      this.getRobotInstanceList();
    },
    gotoSetting(item) {
      this.cur = item;
      this.robotInstanceType = "setting";
    },
    backInstanceList() {
      this.robotInstanceType = "manageList";
      this.getRobotInstanceList();
    },
  },
  created() {},
  async mounted() {
    const info = {
      code: "business_type",
    };
    const result = await getRobotDictItemListByDictCode(info);
    if (result.data.code == 200) {
      this.businessData = result.data.data;
    }
    this.botId = this.botObj.id;
    this.getRobotInstanceList();
  },
  destroyed() {},
};
</script>

<style scoped lang="scss">
.robot-container {
  height: calc(100% - 140px);
  //overflow-y: scroll;
  overflow-x: hidden;
  position: relative;

  .noData {
    font-size: 42px;
    font-weight: 700;
    position: absolute;
    left: 50%;
    top: 50%;
    margin-top: -50px;
    transform: translateX(-84px);
  }

  .card-container {
    cursor: pointer;
    height: 220px;
    background: rgb(246, 248, 252);
    border-radius: 10px;
    border-width: 1px;
    border-color: rgb(241, 244, 250);
    border-style: solid;
    //display: flex;
    //box-shadow: 0px 6px 13.44px 2.56px rgba(241, 241, 244, 0.004);
    box-shadow: rgba(0, 0, 0, 0.24) 0px 3px 8px;
    margin-bottom: 10px;
  }

  .card-left {
    float: left;
    position: relative;
    height: 220px;

    .el-avatar {
      position: absolute;
      top: 50%;
      transform: translateY(-45px);
      left: 50%;
      margin-left: 45px;
    }
  }

  .card-right {
    background: #fff;
    height: 220px;
    border-radius: 10px;
    width: calc(100% - 75px);
    float: right;

    .operate-btn {
      margin-top: 10px;
      padding: 0 15px;
      text-align: right;

      .el-dropdown-link {
        cursor: pointer;
        font-size: 14px;
        font-weight: 700;
        color: #9597a0;
      }
    }

    .introduce-container {
      margin-top: 20px;
      box-sizing: border-box;
      padding-left: 90px;

      .robot-name {
        font-size: 18px;
        color: rgb(7, 11, 45);
        font-weight: 700;
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
      }

      .robotTag-container {
        margin: 20px 0;
      }

      .desc-container {
        width: 100%;
        font-size: 12px;
        display: -webkit-box;
        color: rgb(86, 88, 99);
        overflow: hidden;
        text-overflow: ellipsis;
        -webkit-line-clamp: 3;
        -webkit-box-orient: vertical;
      }
    }
  }
}

.page-container {
  text-align: end;
}
</style>
