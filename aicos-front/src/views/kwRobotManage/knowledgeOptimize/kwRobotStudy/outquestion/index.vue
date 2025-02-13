<template>
  <div>
    <HuilanBasicToolbar style="margin-top: 0">
      <el-button
        type="primary"
        size="small"
        @click="warningClick"
        class="kw-btn-blue"
      >
        {{ $t("kwRobotStudy.warningThreshold") }}</el-button
      >
      <el-dropdown @command="handleCommand">
        <el-button
          type="primary"
          size="small"
          style="margin-left: 10px"
          class="kw-btn-blue"
        >
          {{ $t("aicosCommon.batchOperate") }}
          <i class="el-icon-arrow-down el-icon--right"></i>
        </el-button>
        <el-dropdown-menu slot="dropdown">
          <el-dropdown-item command="del" v-if="permissionList.delBtn">{{
            $t("aicosCommon.batchIgnore")
          }}</el-dropdown-item>
          <el-dropdown-item command="export">{{
            $t("aicosCommon.batchExport")
          }}</el-dropdown-item>
          <el-dropdown-item command="all">{{
            $t("aicosCommon.exportAll")
          }}</el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
    </HuilanBasicToolbar>
    <HuilanBasicSearchbar
      :model="searchForm"
      :fields="searchFieldList"
      @reset="searchReset"
      @search="searchChange"
    >
    </HuilanBasicSearchbar>
    <avue-crud
      :option="option"
      :search.sync="query"
      :table-loading="loading"
      :data="data"
      ref="crud"
      v-model="form"
      :page.sync="page"
      @selection-change="selectionChange"
      @current-change="currentChange"
      @size-change="sizeChange"
      @refresh-change="refreshChange"
      @on-load="onLoad"
    >
      <template slot-scope="{ row }" slot="robotAnswer">
        <div v-html="row.robotAnswer" class="answer-table-contaner"></div>
      </template>
      <template slot="menu" slot-scope="{ row, size, type }">
        <el-button
          :type="type"
          :size="size"
          @click.stop="viewDetail(row)"
          v-if="permissionList.viewBtn"
        >
          {{ $t("kwRobotStudy.detail") }}</el-button
        >
        <el-button
          :type="type"
          :size="size"
          @click.stop="del(row)"
          v-if="permissionList.delBtn"
          >{{ $t("kwRobotStudy.ignore") }}</el-button
        >
      </template>
    </avue-crud>
    <HuilanDialog
      ref="dialog"
      :title="$t('kwRobotStudy.warningThreshold')"
      :visible.sync="warningDialogVisible"
      append-to-body
      width="55%"
    >
      <Warning
        ref="warning"
        :type="2"
        v-if="warningDialogVisible"
        @refresh="refresh"
      />
      <template v-slot:footer>
        <el-button size="small" @click="warningDialogVisible = false">{{
          $t("aicosCommon.cancelBtn")
        }}</el-button>
        <el-button
          size="small"
          type="primary"
          @click="handlerSave"
          :disabled="disable"
          >{{ $t("aicosCommon.saveBtn") }}</el-button
        >
      </template>
    </HuilanDialog>
    <el-drawer
      :title="$t('kwRobotStudy.steppedDetails')"
      :visible.sync="drawerVisible"
      append-to-body
      show-close
      @close="(drawerVisible = false), onLoad()"
      size="75%"
    >
      <Detailpage :rowData="selectRow" v-if="drawerVisible" />
    </el-drawer>
  </div>
</template>
<script>
import Createknowledge from "../createknowledge";
import Knowledgelabel from "../knowledgeLabel/index";
import Detailpage from "./view";
import Warning from "../warning";
import {
  selectList,
  deleteByIds,
  exportExcel,
} from "@/api/kwRobot/kwRobotStudy/outquestion";
import { mapGetters } from "vuex";
export default {
  components: {
    Createknowledge,
    Knowledgelabel,
    Detailpage,
    Warning,
  },
  inject: ["desktop", "isRobotMenu"],
  data() {
    return {
      // 预警阈值
      warningDialogVisible: false,
      // 被踩详情
      drawerVisible: false,
      // 搜索
      searchForm: {
        robotAnswer: "",
        num: "",
      },
      searchFieldList: [
        {
          prop: "robotAnswer",
          placeholder:
            this.$t("aicosCommon.pleaseInput") +
            this.$t("kwRobotStudy.robotAnswer"),
        },
        {
          prop: "num",
          placeholder:
            this.$t("aicosCommon.pleaseInput") +
            this.$t("kwRobotStudy.stepsTaken"),
        },
      ],
      // 表格
      selectRow: {},
      form: {},
      loading: false,
      data: [],
      page: {
        pageSize: 10,
        currentPage: 1,
        total: 0,
      },
      selectionList: [],
      option: {
        tip: false,
        header: false,
        border: true,
        // index: true,
        selection: true,
        addBtn: false,
        editBtn: false,
        delBtn: false,
        viewBtn: false,
        menuWidth: 120,
        dialogClickModal: false,
        dialogWidth: "30%",
        emptyText: this.$t("aicosCommon.notData"),
        column: [
          {
            label: this.$t("kwRobotStudy.robotAnswer"),
            prop: "robotAnswer",
            overHidden: true,
            // minWidth: 300,
            formatter: (val, value, label) => {
              if (this.validatenull(value)) {
                return "--";
              }
              return label;
            },
          },
          {
            label: this.$t("kwRobotStudy.stepsTaken"),
            prop: "num",
            span: 24,
            width: 160,
            align: "center",
            formatter: (val, value, label) => {
              if (this.validatenull(value)) {
                return "--";
              }
              return label;
            },
          },
        ],
      },
    };
  },
  computed: {
    prefix() {
      const prefix = this.isRobotMenu ? "robot-" : "";
      return prefix;
    },
    ...mapGetters(["permission", "userInfo"]),
    permissionList() {
      return {
        viewBtn: this.vaildData(
          this.permission[`${this.prefix}outquestion-detail-list`],
          false
        ),
        delBtn: this.vaildData(
          this.permission[`${this.prefix}outquestion-del`],
          false
        ),
      };
    },
  },
  methods: {
    searchChange() {
      this.onLoad();
    },
    searchReset() {
      this.searchForm = {
        robotAnswer: "",
        num: "",
      };
      this.onLoad();
    },
    onLoad() {
      this.loading = true;
      let obj = {
        size: this.page.pageSize,
        current: this.page.currentPage,
        robotAnswer: this.searchForm.robotAnswer,
        num: this.searchForm.num,
      };
      selectList(obj).then((res) => {
        if (res.data.code === 200) {
          this.data = res.data.data.records;
          this.page.total = res.data.data.total;

          this.loading = false;
        }
      });
    },
    selectionChange(list) {
      this.selectionList = list;
    },
    warningClick() {
      this.warningDialogVisible = true;
    },
    async handleCommand(command) {
      if (command === "del") {
        if (this.selectionList.length === 0) {
          this.$message.warning(this.$t("kwRobotStudy.selectIgnoreTips"));
          return;
        }
        let robotAnswer = this.selectionList
          .map((item) => item.robotAnswer)
          .join(",");
        const result = await deleteByIds({ robotAnswer });
        if (result.data.code == 200) {
          this.$message.success(this.$t("aicosCommon.successOperate"));
          this.onLoad();
        }
      }
      if (command === "export") {
        if (this.selectionList.length === 0) {
          this.$message.warning(this.$t("kwRobotStudy.selectExportTips"));
          return;
        }
        let robotAnswer = this.selectionList
          .map((item) => item.robotAnswer)
          .join(",");
        let obj = {
          robotAnswers: robotAnswer,
        };
        exportExcel(obj)
          .then((res) => {
            this.downFile(
              res.data,
              this.$t("kwRobotStudy.exportStepOnProblem") +
                new Date().getTime() +
                ".xls"
            );
          })
          .catch(() => {
            this.$message.error(this.$t("kwRobotStudy.exportFailed"));
          });
      }
      if (command === "all") {
        let obj = {
          robotAnswer: this.searchForm.robotAnswer,
          num: this.searchForm.num,
        };
        exportExcel(obj)
          .then((res) => {
            this.downFile(
              res.data,
              this.$t("kwRobotStudy.exportStepOnProblem") +
                new Date().getTime() +
                ".xls"
            );
          })
          .catch(() => {
            this.$message.error(this.$t("kwRobotStudy.exportFailed"));
          });
      }
    },
    viewDetail(row) {
      this.drawerVisible = true;
      this.selectRow = row;
    },
    handlerSave() {
      this.$refs.warning.submit();
    },
    del(row) {
      this.$confirm(this.$t("answerViewManage.delViewTypeTips"), {
        cancelButtonText: this.$t("aicosCommon.cancelBtn"),
        confirmButtonText: this.$t("aicosCommon.confirmBtn"),
        type: "warning",
      })
        .then(async () => {
          const delInfo = {
            robotAnswer: row.robotAnswer,
          };
          const result = await deleteByIds(delInfo);
          if (result.data.code == 200) {
            this.$message.success(this.$t("kwRobotStudy.ignoreSuccess"));
            this.onLoad();
          }
        })
        .catch(() => {});
    },
    refresh() {
      this.warningDialogVisible = false;
    },
  },
};
</script>
<style lang="scss" scoped>
::v-deep .el-table__row {
  p {
    margin: 0;
    padding: 0;
  }

  .answer-table-contaner {
    height: 32px;
    overflow: hidden;

    p {
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      width: 100%;

      img {
        width: 20px !important;
        height: 20px !important;
      }
    }
  }
}
</style>
