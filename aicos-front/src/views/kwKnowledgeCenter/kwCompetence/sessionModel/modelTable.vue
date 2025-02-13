<template>
  <div>
    <avue-crud
      :option="option"
      :data="data"
      :permission="permissionList"
      ref="crud"
      :page.sync="page"
      :table-loading="loading"
      :row-style="rowStyle"
      @on-load="onLoad"
      @select="select"
      @select-all="selectAll"
      @selection-change="selectionChange"
    >
      <template slot="header">
        <div class="kw-header" style="margin-bottom: 20px">
          <div class="kw-button-container">
            <!-- 模型训练 -->
            <!-- <el-button @click="addIntention" class="kw-build-button kw-btn-green">{{
              $t("kwCompetence.modelTrain")
            }}</el-button> -->
            <!-- 模型训练 -->
            <KwRobotTrain
              v-if="!isDeskTopMode"
              :hasAssistant="false"
              style="display: inline-block"
            />
            <!-- 批量操作 -->
            <el-dropdown
              class="kw-batch-button"
              @command="handleCommand"
              v-if="permission['model-deleteMore']"
            >
              <el-button type="primary">
                {{ $t("aicosCommon.batchOperate")
                }}<i class="el-icon-arrow-down el-icon--right"></i>
              </el-button>
              <el-dropdown-menu slot="dropdown">
                <!-- 批量删除 -->
                <el-dropdown-item command="banthDel">{{
                  $t("aicosCommon.batchDeleteBtn")
                }}</el-dropdown-item>
                <!-- 批量导入 -->
                <!-- <el-dropdown-item command="banthImport">{{
                  $t("aicosCommon.batchImport")
                }}</el-dropdown-item> -->
              </el-dropdown-menu>
            </el-dropdown>
            <!-- 导入模型 -->
            <!-- <el-button @click="addIntention" class="kw-warning-button">{{
              $t("kwCompetence.importModel")
            }}</el-button> -->
          </div>
          <!-- <div id="kw-form-container">
            <div class="kw-form-form">
              <el-input
                :placeholder="$t('kwCompetence.searchModelName')"
                v-model="searchModelName"
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
                size="small"
                class="kw-search-btn"
                @click="handlerSearch"
              ></el-button>
              <el-button
                size="small"
                class="kw-reset-btn"
                @click="handlerReset"
              ><i class="aicosicon aicos-icon-clear"></i></el-button>
            </div>
          </div> -->
        </div>
      </template>
      <!-- 训练状态 -->
      <template slot-scope="scope" slot="trainingStatus">
        <!-- 训练中 -->
        <div v-if="scope.row.trainingStatus == 1">
          {{ $t("kwCompetence.training") }}
        </div>
        <!-- 训练完成 -->
        <div v-if="scope.row.trainingStatus == 2">
          {{ $t("kwCompetence.finishTraining") }}
        </div>
        <!-- 训练失败 -->
        <div v-if="scope.row.trainingStatus == 3">
          {{ $t("kwCompetence.fallTraining") }}
        </div>
      </template>
      <!-- 生效状态 -->
      <template slot-scope="scope" slot="effectStatus">
        <!-- 生效中 -->
        <div v-if="scope.row.effectStatus == 1">
          {{ $t("kwCompetence.hasEffect") }}
        </div>
        <!-- 未生效 -->
        <div v-if="scope.row.effectStatus == 2">
          {{ $t("kwCompetence.noEffect") }}
        </div>
      </template>
      <!-- 菜单 -->
      <template slot-scope="{ row }" slot="menu">
        <!-- 查看 -->
        <el-button
          type="text"
          size="small"
          v-if="row.trainingStatus == 3 && permission['model-view']"
          @click.stop="viewContent(row)"
          >{{ $t("aicosCommon.viewLogBtn") }}</el-button
        >
        <!-- 使用该模型 -->
        <el-button
          type="text"
          v-if="
            row.trainingStatus == 2 &&
            row.effectStatus == 2 &&
            permission['model-employ']
          "
          size="small"
          @click.stop="handlerEmploy(row)"
          >{{ $t("kwCompetence.useModel") }}</el-button
        >
        <!-- 导出 -->
        <el-button
          type="text"
          size="small"
          v-if="row.trainingStatus == 2 && permission['model-export']"
          @click.stop="handlerExport(row)"
          >{{ $t("aicosCommon.export") }}</el-button
        >
        <!-- 删除 -->
        <el-button
          v-if="row.trainingStatus !== 1 && permission['model-delete']"
          type="text"
          size="small"
          class="kw-del-btn"
          @click.stop="handlerDel(row)"
          >{{ $t("aicosCommon.delBtn") }}</el-button
        >
      </template>
    </avue-crud>
    <HuilanDialog
      append-to-body
      :visible.sync="viewFlag"
      width="800px"
      trigger="click"
      title="查看"
    >
      <div>{{ text }}</div>
      <template v-slot:footer>
        <el-button size="small" @click="viewFlag = false">{{
          $t("aicosCommon.cancelBtn")
        }}</el-button>
      </template>
    </HuilanDialog>
  </div>
</template>

<script>
//机器人训练Demo组件
import KwRobotTrain from "@/components/kwRobotTrain/index";
import { mapGetters } from "vuex";
import {
  modelList,
  deleteList,
  upgradeModel,
  modelTrainView,
} from "@/api/kwRobot/kwRobotTrain/index";
import { getToken } from "@/util/auth";
import { baseURL } from "@/api/common";
import serviceList from "@/config/serviceList";
const { kwRobot } = serviceList;
export default {
  components: {
    KwRobotTrain,
  },
  inject: ["desktopWindow"],
  data() {
    return {
      // 弹窗查看内容
      text: "",
      viewFlag: false,
      //
      rowData: {},
      ids: [],
      botId: "",
      searchModelName: "",
      loading: false,
      data: [],
      page: {
        total: 0,
        currentPage: 1,
        pageSize: 10,
      },
      option: {
        tip: false,
        selection: true,
        height: 640,
        addBtn: false,
        editBtn: false,
        viewBtn: false,
        delBtn: false,
        searchBtn: false,
        columnBtn: false,
        refreshBtn: false,
        menuWidth: 240,
        emptyText: this.$t("aicosCommon.notData"),
        column: [
          {
            label: this.$t("kwCompetence.modelNo"), //模型编号
            prop: "modelNo",
            // width: 180,
          },
          {
            label: this.$t("aicosCommon.createTime"), //创建时间
            prop: "createTime",
            // width: 160,
          },
          {
            label: this.$t("kwCompetence.trainStatus"), //训练状态
            prop: "trainingStatus",
          },
          {
            label: this.$t("kwCompetence.operantStatus"), //生效状态
            prop: "effectStatus",
          },
        ],
      },
      // 判断是否在桌面模式下
      isDeskTopMode: false,
    };
  },
  mounted() {
    this.botId = this.botObj.id;

    if (this.desktopWindow) {
      this.isDeskTopMode = true;
    }
  },
  computed: {
    ...mapGetters(["botObj", "robotState", "permission"]),
  },
  watch: {
    robotState() {
      // if(newVal){
      this.onLoad();
      // }
    },
  },
  methods: {
    rowStyle({ row }) {
      if (row.effectStatus === 1) {
        return {
          backgroundColor: "#a9dda9",
        };
      }
    },
    async onLoad() {
      const info = {
        botId: this.botObj.id,
        size: this.page.pageSize,
        current: this.page.currentPage,
      };
      this.loading = true;
      const result = await modelList(info);
      if (result.data.code == 200) {
        const Data = result.data.data;
        this.page.total = Data.total;
        this.data = Data.records;
        this.loading = false;
      }
    },
    // 查看
    viewContent(row) {
      this.rowData = row;
      modelTrainView(row.id).then((res) => {
        if (res.data.success) {
          if (res.data.data === null) {
            this.$message.warning(this.$t("kwCompetence.noTrainingTips"));
          } else {
            this.viewFlag = true;
            this.text = res.data.data;
          }
        }
      });
    },
    //删除
    handlerDel(row) {
      this.$confirm(this.$t("answerViewManage.delViewTypeTips"), {
        cancelButtonText: this.$t("aicosCommon.cancelBtn"),
        confirmButtonText: this.$t("aicosCommon.confirmBtn"),
        type: "warning",
      })
        .then(async () => {
          const info = {
            ids: [],
          };
          info.ids.push(row.id);
          const result = await deleteList(info);
          if (result.data.code == 200) {
            this.$message({
              type: "success",
              message: this.$t("aicosCommon.deleteSuccessTip"),
            });
            this.onLoad();
          }
        })
        .catch(() => {});
    },
    // 使用该模型
    handlerEmploy(row) {
      upgradeModel(row.modelName).then((res) => {
        if (res.data.success) {
          this.$message.success(this.$t("kwCompetence.useModelTips"));
          this.onLoad();
        }
      });
    },
    // 导出
    handlerExport(row) {
      // console.log(row);
      window.open(
        `${baseURL}api/${kwRobot}/robot-training/downloadNewestModel?token=${getToken()}&modelName=${
          row.modelName
        }`
      );
    },
    //复选框变化事件
    selectionChange(val) {
      const idArr = [];
      val.forEach((item) => {
        idArr.push(item.id);
      });
      this.ids = [...new Set(idArr)];
    },
    //批量操作
    handleCommand(command) {
      // 批量删除
      if (command == "banthDel") {
        if (this.ids.length == 0) {
          this.$message({
            type: "warning",
            message: this.$t("aicosCommon.chooseDataTip"),
          });
          return;
        } else {
          this.$confirm(this.$t("answerViewManage.delViewTypeTips"), {
            cancelButtonText: this.$t("aicosCommon.cancelBtn"),
            confirmButtonText: this.$t("aicosCommon.confirmBtn"),
            type: "warning",
          })
            .then(async () => {
              const delInfo = {
                ids: this.ids,
              };
              const result = await deleteList(delInfo);
              if (result.data.code == 200) {
                this.$message({
                  type: "success",
                  message: this.$t("aicosCommon.deleteSuccessTip"),
                });
                this.onLoad();
              }
            })
            .catch(() => {});
        }
      }
    },
  },
};
</script>

<style lang="scss" scoped>
/deep/ .avue-crud__menu {
  display: none;
}
</style>
