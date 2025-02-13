<template>
  <div>
    <HuilanBasicToolbar style="margin-top: 0">
      <el-button
        type="primary"
        size="small"
        class="kw-btn-blue"
        @click="dialogVisible = true"
        v-if="permissionList.originalBtn"
      >
        {{ $t("kwRobotStudy.problemExport") }}</el-button
      >
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
          <el-dropdown-item command="del" v-if="permissionList.delBtn"
            >{{ $t("aicosCommon.batchIgnore") }}
          </el-dropdown-item>
          <el-dropdown-item command="export" v-if="permissionList.exportBtn"
            >{{ $t("aicosCommon.batchExport") }}
          </el-dropdown-item>
          <el-dropdown-item command="all" v-if="permissionList.exportBtn"
            >{{ $t("aicosCommon.exportAll") }}
          </el-dropdown-item>
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
      <template slot="menu" slot-scope="{ row, size, type }">
        <el-button
          :type="type"
          :size="size"
          @click.stop="viewDetail(row)"
          v-if="permissionList.viewBtn"
          >{{ $t("kwRobotStudy.detail") }}</el-button
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
        :type="1"
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
      :title="$t('kwRobotStudy.detailsAsked')"
      :visible.sync="drawerVisible"
      append-to-body
      show-close
      @close="(drawerVisible = false), onLoad()"
      size="75%"
    >
      <Detailpage :rowData="selectRow" v-if="drawerVisible" />
    </el-drawer>
    <HuilanDialog
      :title="$t('kwRobotStudy.problemExport')"
      append-to-body
      :visible.sync="dialogVisible"
      width="600px"
    >
      <!-- :picker-options="pickerOptions" -->
      <el-date-picker
        v-model="searchTime"
        type="datetimerange"
        size="small"
        value-format="yyyy-MM-dd HH:mm:ss"
        format="yyyy-MM-dd HH:mm:ss"
        :default-time="['00:00:00', '23:59:59']"
        style="width: 370px !important"
        class="kw-form-type"
        :start-placeholder="$t('kwRobotStudy.startDate')"
        :end-placeholder="$t('kwRobotStudy.endDate')"
      ></el-date-picker>
      <template v-slot:footer>
        <el-button size="small" type="primary" @click="exportData">{{
          $t("aicosCommon.confirmBtn")
        }}</el-button>
        <el-button size="small" @click="dialogVisible = false">{{
          $t("aicosCommon.cancelBtn")
        }}</el-button>
      </template>
    </HuilanDialog>
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
  exportUnknown,
  exportOriginal,
} from "@/api/kwRobot/kwRobotStudy/unknown";
import { dateFormat } from "@/util/date";
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
      // pickerOptions: {
      //   disabledDate(time) {
      //     return time.getTime() > new Date().getTime();
      //   },
      // },
      dialogVisible: false,
      searchTime: [
        dateFormat(new Date(new Date().getTime() - 30 * 24 * 60 * 60 * 1000)),
        dateFormat(new Date()),
      ],
      // 预警阈值
      warningDialogVisible: false,
      // 被踩详情
      drawerVisible: false,
      // 搜索
      searchForm: {
        time: [],
        unknownQuestion: "",
        askNum: "",
      },
      searchFieldList: [
        // {
        //   prop: "time",
        //   type: "datetimerange",
        //   format: "yyyy-MM-dd HH:mm:ss",
        //   valueFormat: "yyyy-MM-dd HH:mm:ss",
        //   startPlaceholder: this.$t('kwRobotStudy.startDate'),
        //   endPlaceholder: this.$t('kwRobotStudy.endDate')

        // },
        {
          prop: "unknownQuestion",
          placeholder:
            this.$t("aicosCommon.pleaseInput") +
            this.$t("kwRobotStudy.unknowIssue"),
        },
        {
          prop: "askNum",
          placeholder:
            this.$t("aicosCommon.pleaseInput") +
            this.$t("kwRobotStudy.timesAsked"),
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
        menuWidth: 150,
        dialogClickModal: false,
        dialogWidth: "30%",
        emptyText: this.$t("aicosCommon.notData"),
        column: [
          {
            label: this.$t("kwRobotStudy.unknowIssue"),
            prop: "unknownQuestion",
            overHidden: true,
            minWidth: 300,
            formatter: (val, value, label) => {
              if (this.validatenull(value)) {
                return "--";
              }
              return label;
            },
          },
          {
            label: this.$t("kwRobotStudy.timesAsked"),
            prop: "askNum",
            span: 24,
            overHidden: true,
            width: 200,
            formatter: (val, value, label) => {
              if (this.validatenull(value)) {
                return "--";
              }
              return label;
            },
          },
          {
            width: 180,
            label: this.$t("kwRobotStudy.executionTime"),
            prop: "createTime",
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
    ...mapGetters(["permission"]),
    permissionList() {
      return {
        viewBtn: this.vaildData(
          this.permission[`${this.prefix}unknown-detail-list`],
          false
        ),
        delBtn: this.vaildData(
          this.permission[`${this.prefix}unknow-del`],
          false
        ),
        exportBtn: this.vaildData(
          this.permission[`${this.prefix}unknow-export`],
          false
        ),
        originalBtn: this.vaildData(
          this.permission[`${this.prefix}unknow-originalexport`],
          false
        ),
      };
    },
  },
  methods: {
    exportData() {
      if (this.validatenull(this.searchTime)) {
        this.$message.warning(this.$t("kwRobotStudy.selectTips"));
        return;
      }
      let startTime = this.searchTime[0],
        endTime = this.searchTime[1],
        day = 30 * 24 * 60 * 60 * 1000;
      if (new Date(endTime).getTime() - new Date(startTime).getTime() > day) {
        this.$message.warning(this.$t("kwRobotStudy.cannotExceed"));
        return;
      }
      let obj = {
        startTime: this.searchTime[0],
        endTime: this.searchTime[1],
      };
      exportOriginal(obj)
        .then((res) => {
          this.downFile(
            res.data,
            this.$t("kwRobotStudy.problemExport") +
              new Date().getTime() +
              ".xls"
          );
          this.dialogVisible = false;
          this.searchTime = [];
        })
        .catch(() => {
          this.$message.error(this.$t("kwRobotStudy.exportFailed"));
        });
    },
    searchChange() {
      this.onLoad();
    },
    searchReset() {
      this.searchForm = {
        time: [],
        unknownQuestion: "",
        askNum: "",
      };
      this.onLoad();
    },
    onLoad() {
      this.loading = true;
      let obj = {
        size: this.page.pageSize,
        current: this.page.currentPage,
        unknownQuestion: this.searchForm.unknownQuestion,
        askNum: this.searchForm.askNum,
        startTime:
          this.searchForm.time && this.searchForm.time.length > 0
            ? this.searchForm.time[0]
            : "",
        endTime:
          this.searchForm.time && this.searchForm.time.length > 0
            ? this.searchForm.time[1]
            : "",
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
        let ids = this.selectionList.map((item) => item.id).join(",");
        const result = await deleteByIds({ ids });
        if (result.data.code == 200) {
          this.$message.success(this.$t("aicosCommon.batchOperate"));
          this.onLoad();
        }
      }
      if (command === "export") {
        if (this.selectionList.length === 0) {
          this.$message.warning(this.$t("kwRobotStudy.selectExportTips"));
          return;
        }
        let ids = this.selectionList.map((item) => item.id).join(",");
        let obj = {
          ids,
        };
        exportUnknown(obj)
          .then((res) => {
            this.downFile(
              res.data,
              this.$t("kwRobotStudy.unknownExportTips") +
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
          ids: "",
          unknownQuestion: this.searchForm.unknownQuestion,
          askNum: this.searchForm.askNum,
          startTime:
            this.searchForm.time && this.searchForm.time.length > 0
              ? this.searchForm.time[0]
              : "",
          endTime:
            this.searchForm.time && this.searchForm.time.length > 0
              ? this.searchForm.time[1]
              : "",
        };
        exportUnknown(obj)
          .then((res) => {
            this.downFile(
              res.data,
              this.$t("kwRobotStudy.unknownExportTips") +
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
          const ids = {
            ids: row.id,
          };
          const result = await deleteByIds(ids);
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
<style lang="scss" scoped></style>
