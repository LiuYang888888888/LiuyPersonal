<template>
  <div>
    <div class="kw-header">
      <div class="kw-button-container">
        <el-button size="small" style="margin-right: 10px" @click="handlerBack">{{ $t("aicosCommon.return") }}</el-button>
        <!-- 新建策略 -->
        <el-dropdown @command="addStrategy($event, item)">
          <el-button class="kw-build-button kw-btn-green" v-if="permission['robot-strategy-add']">
            {{ $t("kwRobotManage.addPolicy")
            }}<i class="el-icon-arrow-down el-icon--right"></i>
          </el-button>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item v-if="permission['robot-strategy-add']" command="new">{{ $t("kwRobotManage.createDirectly")
            }}</el-dropdown-item>
            <el-dropdown-item command="copy">{{
              $t("kwRobotManage.copyCreation")
            }}</el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
      </div>
      <div id="kw-form-container">
        <div class="kw-form-form">
          <el-input :placeholder="$t('kwRobotManage.strategyName')" v-model="strategyName" size="small" clearable
            class="kw-form-type">
          </el-input>
        </div>
        <div class="kw-form-btn">
          <el-button type="primary" icon="el-icon-search" size="small" class="kw-search-btn"
            @click="handlerSearch"></el-button>
          <el-button size="small" class="kw-reset-btn" @click="handlerReset"><i
              class="aicosicon aicos-icon-clear"></i></el-button>
        </div>
      </div>
    </div>
    <div class="default-strategy">
      <div class="strategy-title">
        <span>{{ $t("kwRobotManage.bottomUpStrategy") }}</span>
      </div>
      <div class="card-container">
        <el-row :gutter="15">
          <el-col :span="6" v-for="(item, index) in basicData" :key="index" @click.native="gotoStrategy(item)">
            <div class="card">
              <div class="card-title">
                <span class="title">{{ item.strategyName }}</span>
                <el-dropdown @command="menuCommand($event, item)">
                  <span class="el-dropdown-link">
                    <i class="aicosicon aicos-icon-gengduo-shuxiang el-icon--right" style="color: #000"></i>
                  </span>
                  <el-dropdown-menu slot="dropdown">
                    <!-- <el-dropdown-item command="export">导出</el-dropdown-item> -->
                    <el-dropdown-item command="back">{{
                      $t("kwRobotManage.restoreSettings")
                    }}</el-dropdown-item>
                  </el-dropdown-menu>
                </el-dropdown>
                <!-- <i class="el-icon-arrow-right"></i> -->
              </div>
              <div class="card-content">
                <div class="time">
                  <span>{{ $t("kwRobotManage.timeEffect") }}:{{
                    `${item.strategyStartTime} - ${item.strategyEndTime}`
                  }}</span>
                </div>
                <div class="btn-container"></div>
              </div>
            </div>
          </el-col>
        </el-row>
      </div>
    </div>
    <div class="build-strategy">
      <div class="strategy-title">
        <span>{{ $t("kwRobotManage.highQuality") }}</span>
      </div>
      <div class="card-container">
        <el-row :gutter="15">
          <el-col :span="6" v-for="(item, index) in data" :key="index" @click.native="gotoStrategy(item)">
            <div class="card">
              <div class="card-title">
                <span class="title">{{ item.strategyName }}</span>
                <el-dropdown v-if="permission['robot-strategy-edit'] ||
                  permission['robot-strategy-start'] ||
                  permission['robot-strategy-stop'] ||
                  permission['robot-strategy-delete']
                  " @command="menuCommand($event, item)">
                  <span class="el-dropdown-link">
                    <i class="aicosicon aicos-icon-gengduo-shuxiang el-icon--right" style="color: #000"></i>
                  </span>
                  <el-dropdown-menu slot="dropdown">
                    <el-dropdown-item v-if="permission['robot-strategy-edit']" command="edit">{{ $t("aicosCommon.editBtn")
                    }}</el-dropdown-item>
                    <el-dropdown-item v-if="item.status == 0 && permission['robot-strategy-start']
                      " command="start">{{ $t("aicosCommon.start") }}</el-dropdown-item>
                    <el-dropdown-item v-if="item.status == 1 && permission['robot-strategy-stop']
                      " command="stop">{{ $t("aicosCommon.pause") }}</el-dropdown-item>
                    <!-- <el-dropdown-item command="export">导出</el-dropdown-item> -->
                    <el-dropdown-item v-if="permission['robot-strategy-delete']" command="delete">{{
                      $t("aicosCommon.delBtn") }}</el-dropdown-item>
                  </el-dropdown-menu>
                </el-dropdown>
              </div>
              <div class="card-content">
                <div class="status">
                  {{ $t("kwRobotManage.state") }}：{{
                    item.status
                    ? $t("aicosCommon.start")
                    : $t("aicosCommon.pause")
                  }}
                </div>
                <div class="time">
                  <span>{{ $t("kwRobotManage.timeEffect") }}:{{
                    `${item.strategyStartTime} - ${item.strategyEndTime}`
                  }}</span>
                </div>
              </div>
            </div>
          </el-col>
        </el-row>
      </div>
    </div>
    <HuilanDialog :title="isEdit
      ? $t('kwRobotManage.editStrategy')
      : $t('kwRobotManage.buildStrategy')
      " append-to-body :visible.sync="addFlag" width="600px">
      <el-form ref="elForm" :model="formData" :rules="rules" size="medium" v-if="addFlag" label-width="130px"
        :label-position="language != 'zh' ? 'top' : 'right'">
        <el-form-item :label="$t('kwRobotManage.policyName')" prop="name">
          <el-input v-model="formData.name" :placeholder="$t('aicosCommon.pleaseInput') + $t('kwRobotManage.policyName')
            " clearable maxlength="50" show-word-limit :style="{ width: '100%' }"></el-input>
        </el-form-item>
        <el-form-item :label="$t('kwRobotManage.replicationPolicy')" prop="copyStrategyId"
          v-if="addStrategyType === 'copy'">
          <el-select v-model="formData.copyStrategyId" :placeholder="$t('aicosCommon.pleaseSelect') +
            $t('kwRobotManage.replicationPolicy')
            ">
            <el-option v-for="item in strategyData" :key="item.id" :label="item.strategyName"
              :value="item.id"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item :label="$t('kwRobotManage.effectivePeriod')" prop="timeRang">
          <el-time-picker v-model="formData.timeRang" is-range format="HH:mm:ss" value-format="HH:mm:ss"
            :style="{ width: '100%' }" :start-placeholder="$t('kwRobotManage.startTime')"
            :end-placeholder="$t('kwRobotManage.endTime')" :range-separator="$t('kwRobotManage.to')" clearable>
          </el-time-picker>
          <div style="font-size: 12px; color: #727272">
            {{ $t("kwRobotManage.executeTips") }}
          </div>
        </el-form-item>
        <el-form-item :label="$t('kwRobotManage.policyStatus')" prop="status">
          <el-select v-model="formData.status">
            <el-option :label="$t('aicosCommon.start')" :value="1"></el-option>
            <el-option :label="$t('aicosCommon.pause')" :value="0"></el-option>
          </el-select>
        </el-form-item>
      </el-form>
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
import { mapGetters } from "vuex";
import {
  strategyList,
  addStrategy,
  updateStatus,
  deleteStrategy,
  restoreFactory,
  strategyDisabled,
  strategyEnable,
  copyStrategy
} from "@/api/kwRobot/kwRobotTrain/index";
export default {
  props: {
    cur: {
      type: Object,
      default: () => {
        return {};
      }
    }
  },
  data () {
    return {
      addStrategyType: "",
      isEdit: false,
      addFlag: false,
      strategyName: "", //策略名称
      data: [],
      basicData: [],
      formData: {
        name: "",
        timeRang: "",
        id: "",
        status: 1
      },
      rules: {
        name: [
          {
            required: true,
            message: this.$t("aicosCommon.pleaseInput") + this.$t("kwRobotManage.policyName"),
            trigger: "blur"
          }
        ],
        timeRang: [
          {
            required: true,
            type: "array",
            message: this.$t('kwRobotManage.selectPeriod'),
            trigger: "change"
          }
        ],
        copyStrategyId: [
          {
            required: true,
            message: this.$t("aicosCommon.pleaseSelect") + this.$t("kwRobotManage.replicationPolicy"),
            trigger: "blur"
          }
        ],
        status: [
          {
            required: true,
            message: this.$t("aicosCommon.pleaseSelect") + this.$t("kwRobotManage.policyStatus"),
            trigger: "blur"
          }
        ]
      },
      strategyData: []
    };
  },
  components: {},
  computed: {
    // 计算属性
    ...mapGetters(["botObj", "permission", "language"])
  },
  mounted () {
    this.getStrategyList();
  },
  methods: {
    menuCommand (type, item) {
      if (type == "edit") {
        this.handlerEdit(item);
      }
      if (type == "delete") {
        this.handlerDel(item);
      }
      if (type == "start") {
        // this.changeStatus(item, true);
        this.handlerStart(item);
      }
      if (type == "stop") {
        // this.changeStatus(item, false);
        this.handlerStop(item);
      }
      if (type === "export") {
        console.log("导出");
      }
      if (type === "back") {
        this.reset(item);
      }
    },
    // 恢复出厂设置
    async reset (item) {
      const result = await restoreFactory(item.id);
      if (result.data.code == 200) {
        this.$message.success(this.$t('kwRobotManage.factorySettingsTips'));
      }
    },
    //获取策略列表
    async getStrategyList () {
      this.data = [];
      this.basicData = [];
      const info = {
        robotInstanceId: this.cur.id,
        size: "1000",
        current: "1",
        strategyName: this.strategyName
      };
      const result = await strategyList(info);
      if (result.data.code == 200) {
        let item = result.data.data.records;
        this.strategyData = item;
        item.forEach(val => {
          if (val.strategyType === 1) {
            this.basicData.push(val);
          } else {
            this.data.push(val);
          }
        });
      }
    },
    handlerStop (item) {
      strategyDisabled(item.id).then(res => {
        if (res.data.success) {
          this.$message.success(this.$t('aicosCommon.stopSuccessTip'));
          this.getStrategyList();
        }
      });
    },
    handlerStart (item) {
      strategyEnable(item.id).then(res => {
        if (res.data.success) {
          this.$message.success(this.$t('aicosCommon.enableSuccessTip'));
          this.getStrategyList();
        }
      });
    },
    //修改状态
    async changeStatus (item, flag) {
      if (flag) {
        //启用
        const info = {
          status: 1,
          id: item.id
        };
        const result = await updateStatus(info);
        if (result.data.code == 200) {
          this.$message({
            type: "success",
            message: this.$t('aicosCommon.enableSuccessTip')
          });
          this.getStrategyList();
        }
      } else {
        const info = {
          status: 0,
          id: item.id
        };
        const result = await updateStatus(info);
        if (result.data.code == 200) {
          this.$message({
            type: "success",
            message: this.$t('aicosCommon.stopSuccessTip')
          });
          this.getStrategyList();
        }
      }
    },
    gotoStrategy (item) {
      // gotoStrategy
      this.$store.commit("SET_InstanceOBJ", item);
      this.$emit("gotoStrategy", "onlySetting");
    },
    //新增
    addStrategy (type) {
      this.addStrategyType = type;
      this.addFlag = true;
      this.isEdit = false;
      this.formData.name = "";
      this.formData.timeRang = "";
      this.formData.id = "";
    },
    //编辑
    handlerEdit (item) {
      this.addStrategyType = "";
      const arr = [];
      this.addFlag = true;
      this.isEdit = true;
      this.formData.name = item.strategyName;
      arr.push(item.strategyStartTime);
      arr.push(item.strategyEndTime);
      this.formData.timeRang = arr;
      this.formData.id = item.id;
      this.formData.status = item.status;
    },
    //删除
    handlerDel (item) {
      this.$confirm(this.$t("kwRobotManage.replicationPolicy"), {
        cancelButtonText: this.$t("aicosCommon.cancelBtn"),
        confirmButtonText: this.$t("aicosCommon.confirmBtn"),
        type: "warning"
      })
        .then(async () => {
          // const info = {
          //   id: item.id,
          // };
          const result = await deleteStrategy({ ids: item.id });
          if (result.data.code == 200) {
            this.$message.success(this.$t('aicosCommon.deleteSuccessTip'));
            this.getStrategyList();
          }
        })
        .catch(() => { });
    },
    //搜索
    handlerSearch () {
      this.getStrategyList();
    },
    //重置
    handlerReset () {
      this.strategyName = "";
      this.getStrategyList();
    },
    //点击取消返回实例列表
    handlerBack () {
      this.$emit("backInstance");
    },
    handlerSave () {
      this.$refs.elForm.validate(async valid => {
        if (!valid) {
          return;
        } else {
          const info = {
            botId: this.botObj.id, //机器人id
            robotInstanceId: this.cur.id, //实例id
            strategyName: this.formData.name, //策略名称
            strategyStartTime: this.formData.timeRang[0], //开始时间
            strategyEndTime: this.formData.timeRang[1], //结束时间\
            status: this.formData.status, //状态
            strategyType: 2,
            id: this.formData.id
          };
          let result = {};
          if (this.addStrategyType === "copy") {
            info.copyStrategyId = this.formData.copyStrategyId;
            result = await copyStrategy(info);
          } else {
            result = await addStrategy(info);
          }
          this.$nextTick(() => {
            if (result.data.code == 200) {
              this.$message({
                type: "success",
                message: this.$t("aicosCommon.saveSuccessTip")
              });
              this.addFlag = false;
              this.getStrategyList();
            }
          });
        }
      });
    }
  },
  created () { },

  destroyed () { }
};
</script>

<style scoped lang="scss">
.build-strategy {
  .card-container {
    padding: 0 20px;
  }

  .strategy-title {
    font-size: 16px;
    font-weight: 700;
    margin-bottom: 20px;
  }

  .card-container {
    .card {
      height: 150px;
      background: linear-gradient(to right,
          rgb(166, 241, 255),
          rgb(120, 188, 255),
          rgb(74, 134, 255));
      border-radius: 10px;
      cursor: pointer;
      overflow: hidden;
      box-shadow: rgba(0, 0, 0, 0.24) 0px 3px 8px;

      .card-title {
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 0 20px;
        margin: 10px 0;

        .title {
          font-size: 18px;
          font-weight: 700;
          color: #2a2a2a;
        }
      }

      .card-content {
        height: calc(100% - 34px);
        background: #fff;
        border-radius: 10px;
      }
    }

    .card-content {
      padding: 0 30px;
      overflow: hidden;

      .status {
        margin-top: 15px;
        color: rgb(86, 88, 99);
      }

      .time {
        margin-top: 15px;
      }

      .line {
        height: 2px;
        background: #eee;
        margin-top: 20px;
        margin-bottom: 10px;
      }
    }
  }
}

.default-strategy {
  margin-bottom: 20px;

  .card-container {
    padding: 0 20px;
  }

  .strategy-title {
    font-size: 16px;
    font-weight: 700;
    margin-bottom: 20px;
  }

  .card-container {
    .card {
      height: 150px;
      background-color: rgb(240, 240, 240);
      border-radius: 10px;
      cursor: pointer;
      overflow: hidden;
      box-shadow: rgba(0, 0, 0, 0.24) 0px 3px 8px;

      .card-title {
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 0 20px;
        margin: 10px 0;

        .title {
          font-size: 18px;
          font-weight: 700;
        }
      }

      .card-content {
        height: calc(100% - 34px);
        background: #fff;
        border-radius: 10px;
      }
    }

    .card-content {
      padding: 0 30px;
      overflow: hidden;

      .time {
        margin-top: 30px;
      }

      .line {
        height: 2px;
        background: #eee;
        margin-top: 20px;
        margin-bottom: 10px;
      }
    }
  }
}
</style>
