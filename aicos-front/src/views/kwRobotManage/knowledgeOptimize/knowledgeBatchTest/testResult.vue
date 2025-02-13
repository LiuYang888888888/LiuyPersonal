<template>
  <div>
    <HuilanBasicToolbar style="margin-top: 0">
      {{ $t("knowledgeBatchTest.currentTestRound") }}
      <el-select v-model="testRound" size="small" @change="changeRound">
        <el-option
          v-for="item in testRoundList"
          :key="item.id"
          :label="item.taskSeq"
          :value="item.id"
        ></el-option>
      </el-select>
      <!-- <el-button
        size="small"
        type="primary"
        @click="testBatchs"
        class="kw-btn-blue"
        v-if="permissionList.testBtn"
        >立即测试</el-button
      > -->
    </HuilanBasicToolbar>
    <HuilanBasicToolbar style="margin-top: 0">
      <el-button
        size="small"
        type="primary"
        @click="exportBatchs"
        class="kw-btn-blue"
        v-if="permissionList.exportBtn"
        >{{ $t("aicosCommon.batchExport") }}
      </el-button>
      <el-button
        type="primary"
        size="small"
        class="kw-btn-blue"
        @click="markMore"
        v-if="Number(number) === Number(rowData.testRound)"
      >
        {{ $t("knowledgeBatchTest.batchAnnotation") }}
      </el-button>
      <!-- <el-button
        size="small"
        type="primary"
        class="kw-btn-blue"
        @click="deleteBatchs"
        >批量删除</el-button
      > -->
    </HuilanBasicToolbar>
    <HuilanBasicSearchbar
      :model="searchForm"
      :fields="searchFieldList"
      @search="searchChange"
      @reset="searchReset"
    >
      <template v-slot:appendTool>
        <el-button type="default" @click="configColumn">
          <i class="el-icon-s-operation"></i>
        </el-button>
      </template>
    </HuilanBasicSearchbar>
    <avue-crud
      :option="option"
      :table-loading="loading"
      :data="data"
      ref="crud"
      :page.sync="page"
      v-model="form"
      @selection-change="selectionChange"
      @current-change="currentChange"
      @size-change="sizeChange"
      @on-load="onLoad"
    >
      <template slot="menu" slot-scope="{ row }">
        <el-button type="text" size="small" @click.stop="createFun(row)"
          >{{ $t("knowledgeBatchTest.createKnowledge") }}
        </el-button>
        <el-button
          type="text"
          size="small"
          @click.stop="knowledgeMarker(row)"
          v-if="!row.isMark"
          >{{ $t("knowledgeBatchTest.kowledgeAnnotation") }}
        </el-button>
      </template>
      <template slot="intentFlag" slot-scope="{ row }">
        <span v-if="row.intentFlag">{{ $t("knowledgeBatchTest.mate") }} </span>
        <span v-else-if="row.intentFlag === null">--</span>
        <span v-else style="color: red"
          >{{ $t("knowledgeBatchTest.mismatching") }}
        </span>
      </template>
      <template slot="knowledgeFlag" slot-scope="{ row }">
        <span v-if="row.knowledgeFlag"
          >{{ $t("knowledgeBatchTest.mate") }}
        </span>
        <span v-else-if="row.knowledgeFlag === null">--</span>
        <span v-else style="color: red"
          >{{ $t("knowledgeBatchTest.mismatching") }}
        </span>
      </template>
    </avue-crud>
    <HuilanDialog
      :title="$t('knowledgeBatchTest.createKnowledge')"
      :visible.sync="createDialogVisible"
      append-to-body
      width="600px"
    >
      <Createknowledge ref="createknowledge" v-if="createDialogVisible" />
      <template v-slot:footer>
        <el-button size="small" @click="createDialogVisible = false">{{
          $t("aicosCommon.cancelBtn")
        }}</el-button>
        <el-button
          size="small"
          type="primary"
          @click="handlerCreate"
          :disabled="disable"
          >{{ $t("knowledgeBatchTest.goToCreate") }}
        </el-button>
      </template>
    </HuilanDialog>
    <HuilanDialog
      ref="dialog"
      :title="$t('knowledgeBatchTest.kowledgeAnnotation')"
      :visible.sync="dialogVisible"
      append-to-body
      width="55%"
    >
      <Knowledgelabel
        ref="knowledgelabel"
        :rowData="marketData"
        v-if="dialogVisible"
        @refresh="refresh"
        :isOne="!isMore"
      />
      <template v-slot:footer>
        <el-button size="small" @click="dialogVisible = false">{{
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
      :title="$t('knowledgeBatchTest.addKnowledge')"
      :visible.sync="manageDialogVisible"
      append-to-body
      show-close
      @close="manageDialogVisible = false"
      size="60%"
    >
      <template v-if="selectType === 'faq' && manageDialogVisible">
        <AddFaq
          :rowData="selectRow"
          :faqType="'add'"
          @addOrEditEmitEvent="addOrEditEmitEvent"
        />
      </template>
      <template v-if="selectType === 'chat' && manageDialogVisible">
        <AddChat
          :rowData="selectRow"
          :faqType="'add'"
          @addOrEditEmitEvent="addOrEditEmitEvent"
        />
      </template>
      <template v-if="selectType === 'table' && manageDialogVisible">
        <AddTable
          :rowData="selectRow"
          :faqType="'add'"
          @addOrEditEmitEvent="addOrEditEmitEvent"
        />
      </template>
      <template v-if="selectType === 'intention' && manageDialogVisible">
        <Addintention
          @back="addOrEditEmitEvent"
          :botId="botId"
          :rowData="selectRow"
          classifyId="0"
          addType="parent"
        />
      </template>
    </el-drawer>
  </div>
</template>
<script>
import Createknowledge from "../kwRobotStudy/createknowledge";
import Knowledgelabel from "../kwRobotStudy/knowledgeLabel/index";
import AddFaq from "../kwRobotStudy/createknowledge/addfaq/addFaq";
import AddChat from "../kwRobotStudy/createknowledge/addchat/addChat";
import AddTable from "../kwRobotStudy/createknowledge/addtable/addTable";
import Addintention from "../kwRobotStudy/createknowledge/addintention";
import { listData } from "@/api/kwRobot/kwRobotTrain/index";
import {
  taskBatchSeqList,
  getBatchDetailsList,
  createKnowledgeCount,
  labelKnowledgeCount,
  exportTaskDetails,
  deleteTask,
} from "@/api/kwKnowledgeCenter/knowledgeBatchTest/index";
import { mapGetters } from "vuex";
import { deepClone, getTextWidth } from "@/util/util";
export default {
  props: {
    rowData: {
      type: Object,
      default: () => {
        return {};
      },
    },
  },
  components: {
    Createknowledge,
    Knowledgelabel,
    AddFaq,
    AddChat,
    AddTable,
    Addintention,
  },
  data() {
    return {
      // 搜索
      searchForm: {
        intentFlag: "",
        replySource: "",
        knowledgeFlag: "",
      },
      searchFieldList: [
        {
          prop: "intentFlag",
          type: "select",
          dicData: [
            {
              label: this.$t("knowledgeBatchTest.mate"),
              value: true,
            },
            {
              label: this.$t("knowledgeBatchTest.mismatching"),
              value: false,
            },
          ],
          placeholder: this.$t("knowledgeBatchTest.selectIntentionResult"),
        },
        {
          prop: "replySource",
          type: "select",
          dicData: [],
          placeholder: this.$t("knowledgeBatchTest.selectReplySource"),
        },
        {
          prop: "knowledgeFlag",
          type: "select",
          placeholder:
            this.$t("aicosCommon.pleaseSelect") +
            this.$t("knowledgeBatchTest.matchingStatus"),
          dicData: [
            {
              label: this.$t("knowledgeBatchTest.mate"),
              value: true,
            },
            {
              label: this.$t("knowledgeBatchTest.mismatching"),
              value: false,
            },
          ],
        },
      ],
      testRoundList: [],
      testRound: "",
      // 表格
      selectRow: [],
      option: {
        addBtn: false,
        editBtn: false,
        delBtn: false,
        columnBtn: false,
        refreshBtn: false,
        selection: true,
        header: false,
        tip: false,
        menu: true,
        emptyText: this.$t("aicosCommon.notData"),
        column: [
          {
            label: this.$t("knowledgeBatchTest.userQuestions"),
            prop: "question",
            minWidth: 200,
            overHidden: true,
            formatter: (val, value, label) => {
              if (this.validatenull(value)) {
                return "--";
              }
              return label;
            },
          },
          {
            label: this.$t("knowledgeBatchTest.expectedMatchingIntent"),
            prop: "expectIntent",
            formatter: (val, value, label) => {
              if (this.validatenull(value)) {
                return "--";
              }
              return label;
            },
            minWidth: 150,
            overHidden: true,
          },
          {
            label: this.$t("knowledgeBatchTest.actualMatchingIntention"),
            prop: "matchIntent",
            formatter: (val, value, label) => {
              if (this.validatenull(value)) {
                return "--";
              }
              return label;
            },
            minWidth: 150,
            overHidden: true,
          },
          {
            label: this.$t("knowledgeBatchTest.intentionMatchingResults"),
            prop: "intentFlag",
            type: "select",
            dicData: [
              {
                label: this.$t("knowledgeBatchTest.mate"),
                value: true,
              },
              {
                label: this.$t("knowledgeBatchTest.mismatching"),
                value: false,
              },
            ],
            minWidth: 150,
            overHidden: true,
            formatter: (val, value, label) => {
              if (this.validatenull(value)) {
                return "--";
              }
              return label;
            },
          },
          {
            label: this.$t("knowledgeBatchTest.expectationMatchingKnowledge"),
            prop: "expectKnowledge",
            minWidth: 150,
            overHidden: true,
            formatter: (val, value, label) => {
              if (this.validatenull(value)) {
                return "--";
              }
              return label;
            },
          },
          {
            label: this.$t("knowledgeBatchTest.actualMatching"),
            prop: "matchKnowledge",
            minWidth: 150,
            overHidden: true,
            formatter: (val, value, label) => {
              if (this.validatenull(value)) {
                return "--";
              }
              return label;
            },
          },
          {
            label: this.$t("knowledgeBatchTest.replyFrom"),
            prop: "replySource",
            type: "select",
            dicData: [],
            formatter: (val, value, label) => {
              if (this.validatenull(value)) {
                return "--";
              }
              return label;
            },
          },
          {
            label: this.$t("knowledgeBatchTest.matchingScore"),
            prop: "confidence",
            minWidth: 140,
            overHidden: true,
            formatter: (val, value, label) => {
              if (this.validatenull(value)) {
                return "--";
              }
              return label;
            },
          },
          {
            label: this.$t("knowledgeBatchTest.matchingStatus"),
            prop: "knowledgeFlag",
            type: "select",
            dicData: [
              {
                label: this.$t("knowledgeBatchTest.mate"),
                value: true,
              },
              {
                label: this.$t("knowledgeBatchTest.mismatching"),
                value: false,
              },
            ],
            minWidth: 140,
            overHidden: true,
            formatter: (val, value, label) => {
              if (this.validatenull(value)) {
                return "--";
              }
              return label;
            },
          },
        ],
      },
      loading: false,
      form: {},
      page: {
        pageSize: 10,
        currentPage: 1,
        total: 0,
      },
      selectionList: [],
      data: [],
      // 创建知识
      createDialogVisible: false,
      // 知识标注
      dialogVisible: false,
      isMore: false,
      // 知识创建
      manageDialogVisible: false,
      selectType: "",
      marketData: [],
      botId: this.$store.getters.botObj.id,
      number: 0,
    };
  },
  computed: {
    // 计算属性
    ...mapGetters(["permission", "language"]),
    permissionList() {
      return {
        exportBtn: this.vaildData(
          this.permission[`robot-knowledgeBatchTest-taskDetailsExport`]
        ),
      };
    },
  },
  mounted() {
    const postData = {
      current: 1,
      size: 1000,
      botId: this.botId,
    };
    listData(postData).then((res) => {
      const data = res.data.data.records;
      let replySource = this.findObject(this.searchFieldList, "replySource"),
        soutceTable = this.findObject(this.option.column, "replySource"),
        dicData = [];
      dicData = data.map((v) => {
        return {
          label: v.name,
          value: v.name,
        };
      });
      dicData.push({
        label: this.$t("knowledgeBatchTest.intentLibrary"),
        value: "意图库",
      });
      dicData.push({
        label: this.$t("knowledgeBatchTest.chattingKnowledge"),
        value: "闲聊知识",
      });
      dicData.push({
        label: this.$t("knowledgeBatchTest.intentionsModels"),
        value: "意图模型",
      });
      soutceTable.dicData = dicData;
      replySource.dicData = deepClone(dicData);
    });
  },
  methods: {
    // 批量删除
    deleteBatchs() {
      if (this.selectionList.length === 0) {
        this.$message.warning(this.$t("knowledgeBatchTest.selectDeleteTips"));
        return;
      }
      let ids = this.selectionList.map((item) => item.id).join(",");
      deleteTask({ ids }).then((res) => {
        if (res.data.success) {
          this.$message.success(this.$t("aicosCommon.deleteSuccessTip"));
          this.onLoad(false);
        }
      });
    },
    // 批量导出
    exportBatchs() {
      if (this.selectionList.length === 0) {
        this.$message.warning(this.$t("knowledgeBatchTest.selectExportTips"));
        return;
      }
      let obj = {
        taskId: this.rowData.id,
        taskBatchId: this.testRound,
        knowledgeIds: this.selectionList.map((item) => item.id).join(","),
      };
      exportTaskDetails(obj)
        .then((res) => {
          this.downFile(
            res.data,
            this.$t("knowledgeBatchTest.exportTestResults") +
              new Date().getTime() +
              ".xls"
          );
        })
        .catch(() => {
          this.$message.error(this.$t("knowledgeBatchTest.exportFailed"));
        });
    },
    searchReset() {
      this.searchForm = {
        intentFlag: "",
        replySource: "",
        knowledgeFlag: "",
      };
      this.onLoad(false);
    },
    selectionChange(list) {
      this.selectionList = list;
    },
    currentChange(currentPage) {
      this.page.currentPage = currentPage;
    },
    sizeChange(pageSize) {
      this.page.pageSize = pageSize;
    },
    searchChange() {
      this.onLoad(false);
    },
    changeRound() {
      this.onLoad(false);
    },
    async onLoad(flag = true) {
      let num = 0;
      if (flag) {
        await taskBatchSeqList({ taskId: this.rowData.id }).then((res) => {
          if (res.data.success) {
            this.testRoundList = res.data.data;
            if (this.testRoundList.length > 0) {
              this.testRound = this.testRoundList[0].id;
              num = this.testRoundList[0].taskSeq;
            }
          }
        });
      }
      num = this.testRoundList.find(
        (item) => item.id === this.testRound
      ).taskSeq;
      this.number = num;
      if (Number(num) === Number(this.rowData.testRound)) {
        this.option.menu = true;
      } else {
        this.option.menu = false;
      }
      this.loading = true;
      let obj = {
        taskBatchId: this.testRound,
        current: this.page.currentPage,
        size: this.page.pageSize,
        ...this.searchForm,
      };
      getBatchDetailsList(obj)
        .then((res) => {
          if (res.data.success) {
            this.page.currentPage = res.data.data.current;
            this.page.total = res.data.data.total;
            this.data = res.data.data.records;
            this.option.column.forEach((item) => {
              let width = getTextWidth(item.label).nodeWidth + 80;
              if (item.width) {
                if (width < item.width) {
                  return;
                }
                this.$set(item, "width", width);
              } else {
                this.$set(item, "minWidth", width);
              }
            });
            if (this.language != "zh") {
              this.option.menuWidth = 330;
            } else {
              this.option.menuWidth = 180;
            }
            this.loading = false;
          }
        })
        .catch(() => {
          this.loading = false;
          this.data = [];
        });
    },
    configColumn() {
      this.$refs.crud.$refs.dialogColumn.columnBox = true;
    },
    // 创建知识选择分类
    createFun(row) {
      this.createDialogVisible = true;
      this.selectRow = row;
      this.selectRow.question = row.question;
    },
    // 知识标注
    knowledgeMarker(row) {
      this.isMore = false;
      this.marketData = [];
      this.dialogVisible = true;
      row.question = row.question;
      this.marketData.push(row);
    },
    // 创建知识对应弹窗
    handlerCreate() {
      const { createknowledge } = this.$refs;
      if (createknowledge.value === "") {
        this.$message.warning(this.$t("knowledgeBatchTest.knowledgeClass"));
        return;
      }
      this.selectType = createknowledge.value;
      this.createDialogVisible = false;
      this.manageDialogVisible = true;
    },
    // 批量标注
    markMore() {
      if (this.selectionList.length === 0) {
        this.$message.warning(this.$t("knowledgeBatchTest.selectLabel"));
        return;
      }
      this.isMore = true;
      this.marketData = [];
      this.dialogVisible = true;
      this.selectionList.forEach((item) => {
        item.question = item.question;
        this.marketData.push(item);
      });
    },
    // 创建知识成功
    async addOrEditEmitEvent() {
      this.manageDialogVisible = false;
      const result = await createKnowledgeCount({
        knowledgeIds: this.selectRow.id,
        taskBatchId: this.testRound,
      });
      if (result.data.code == 200) {
        this.onLoad(false);
      }
    },
    handlerSave() {
      this.$refs.knowledgelabel.handleSave();
    },
    // 知识标注成功
    async refresh() {
      this.dialogVisible = false;
      let ids = this.marketData.map((item) => item.id).join(",");
      const result = await labelKnowledgeCount({
        knowledgeIds: ids,
        taskBatchId: this.testRound,
      });
      if (result.data.code == 200) {
        this.onLoad(false);
      }
    },
  },
};
</script>
<style lang="scss" scoped></style>
