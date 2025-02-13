<template>
  <div>
    <HuilanBasicToolbar style="margin-top: 0">
      <el-dropdown @command="handleCommand">
        <el-button type="primary" size="small" class="kw-btn-blue">
          {{ $t("aicosCommon.batchOperate") }}
          <i class="el-icon-arrow-down el-icon--right"></i>
        </el-button>
        <el-dropdown-menu slot="dropdown">
          <el-dropdown-item command="del" v-if="permissionList.delBtn">{{
            $t("aicosCommon.batchIgnore")
          }}</el-dropdown-item>
          <el-dropdown-item command="export">
            {{ $t("aicosCommon.batchExport") }}</el-dropdown-item>
          <el-dropdown-item command="all">
            {{ $t("aicosCommon.exportAll") }}</el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
    </HuilanBasicToolbar>
    <HuilanBasicSearchbar :model="searchForm" :fields="searchFieldList" @reset="searchReset" @search="searchChange">
    </HuilanBasicSearchbar>
    <avue-crud :option="option" :search.sync="query" :table-loading="loading" :data="data" ref="crud" v-model="form"
      :page.sync="page" @selection-change="selectionChange" @current-change="currentChange" @size-change="sizeChange"
      @refresh-change="refreshChange" @on-load="onLoad">
      <template slot="menu" slot-scope="{ row, size, type }">
        <el-button :type="type" :size="size" @click.stop="createFun(row)">{{ $t('kwRobotStudy.createKnowledge')
        }}</el-button>
        <el-button :type="type" :size="size" @click.stop="knowledgeMarker(row)">{{ $t('kwRobotStudy.kowledgeAnnotation')
        }}</el-button>
        <el-button :type="type" :size="size" @click.stop="del(row)" v-if="permissionList.delBtn">{{
          $t('kwRobotStudy.ignore') }}</el-button>
      </template>
    </avue-crud>
    <HuilanDialog ref="dialog" :title="$t('kwRobotStudy.createKnowledge')" :visible.sync="createDialogVisible"
      append-to-body width="600px">
      <Createknowledge ref="createknowledge" v-if="createDialogVisible" />
      <template v-slot:footer>
        <el-button size="small" @click="createDialogVisible = false">{{
          $t("aicosCommon.cancelBtn")
        }}</el-button>
        <el-button size="small" type="primary" @click="handlerCreate" :disabled="disable">{{ $t('kwRobotStudy.goToCreate')
        }}</el-button>
      </template>
    </HuilanDialog>
    <HuilanDialog ref="dialog" :title="$t('kwRobotStudy.kowledgeAnnotation')" :visible.sync="dialogVisible" append-to-body
      width="55%">
      <Knowledgelabel ref="knowledgelabel" :rowData="marketData" @refresh="refresh" v-if="dialogVisible" />
      <template v-slot:footer>
        <el-button size="small" @click="dialogVisible = false">{{
          $t("aicosCommon.cancelBtn")
        }}</el-button>
        <el-button size="small" type="primary" @click="handlerSave" :disabled="disable">{{ $t("aicosCommon.saveBtn")
        }}</el-button>
      </template>
    </HuilanDialog>
    <el-drawer :title="$t('kwRobotStudy.addKnowledge')" :visible.sync="manageDialogVisible" append-to-body show-close
      @close="manageDialogVisible = false" size="60%">
      <template v-if="selectType === 'faq' && manageDialogVisible">
        <AddFaq :rowData="selectRow" :faqType="'add'" @addOrEditEmitEvent="addOrEditEmitEvent" />
      </template>
      <template v-if="selectType === 'chat' && manageDialogVisible">
        <AddChat :rowData="selectRow" :faqType="'add'" @addOrEditEmitEvent="addOrEditEmitEvent" />
      </template>
      <template v-if="selectType === 'table' && manageDialogVisible">
        <AddTable :rowData="selectRow" :faqType="'add'" @addOrEditEmitEvent="addOrEditEmitEvent" />
      </template>
      <template v-if="selectType === 'intention' && manageDialogVisible">
        <Addintention @back="addOrEditEmitEvent" :botId="botId" :rowData="selectRow" classifyId="0" addType="parent" />
      </template>
    </el-drawer>
  </div>
</template>
<script>
import Createknowledge from "./createknowledge";
import Knowledgelabel from "./knowledgeLabel/index";
import AddFaq from "./createknowledge/addfaq/addFaq";
import AddChat from "./createknowledge/addchat/addChat";
import AddTable from "./createknowledge/addtable/addTable";
import Addintention from "./createknowledge/addintention";
import {
  selectList,
  deleteByIds,
  exportExcel
} from "@/api/kwRobot/kwRobotStudy/seat";

import { mapGetters } from "vuex";
export default {
  components: {
    Createknowledge,
    Knowledgelabel,
    AddFaq,
    AddChat,
    AddTable,
    Addintention
  },
  inject: ["desktop", "isRobotMenu"],
  data () {
    return {
      botId: this.$store.getters.botObj.id,
      // 创建知识
      createDialogVisible: false,
      // 知识标注
      dialogVisible: false,
      // 搜索
      searchForm: {
        time: [],
        registrationQuestion: ""
      },
      searchFieldList: [
        {
          prop: "time",
          type: "datetimerange",
          format: "yyyy-MM-dd HH:mm:ss",
          valueFormat: "yyyy-MM-dd HH:mm:ss",
          startPlaceholder: this.$t('kwRobotStudy.startTime'),
          endPlaceholder: this.$t('kwRobotStudy.endTime')
        },
        {
          prop: "registrationQuestion",
          placeholder: this.$t('kwRobotStudy.inputContent')
        }
      ],
      // 表格
      selectRow: {},
      form: {},
      loading: false,
      data: [
        {
          question: "新词",
          number: 34,
          name: "李乐乐",
          time: "2020-12-12 12:12:12"
        }
      ],
      page: {
        pageSize: 10,
        currentPage: 1,
        total: 0
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
        menuWidth: 230,
        dialogClickModal: false,
        dialogWidth: "30%",
        emptyText: this.$t('aicosCommon.notData'),
        column: [
          {
            label: this.$t('kwRobotStudy.seatRegistrationIssues'),
            prop: "registrationQuestion",
            span: 24,
            overHidden: true,
            minWidth: 300,
            formatter: (val, value, label) => {
              if (this.validatenull(value)) {
                return "--";
              }
              return label;
            }
          },
          {
            label: this.$t('kwRobotStudy.registrant'),
            prop: "createUser",
            span: 24,
            formatter: (val, value, label) => {
              if (this.validatenull(value)) {
                return "--";
              }
              return label;
            }
          },
          {
            label: this.$t('kwRobotStudy.time'),
            prop: "createTime"
          }
        ]
      },
      // 知识创建
      manageDialogVisible: false,
      selectType: "",
      marketData: []
    };
  },
  computed: {
    prefix () {
      const prefix = this.isRobotMenu ? "robot-" : "";
      return prefix;
    },
    ...mapGetters(["permission", 'language']),
    permissionList () {
      return {
        delBtn: this.vaildData(this.permission[`${this.prefix}seat-del`], false)
      };
    }
  },
  watch: {
    language: {
      handler () {
        this.option.menuWidth = this.language != "zh" ? 400 : 230;
      },
      immediate: true,
    },
  },
  mounted () { },

  methods: {
    selectionChange (list) {
      this.selectionList = list;
    },
    onLoad () {
      this.loading = true;
      let obj = {
        size: this.page.pageSize,
        current: this.page.currentPage,
        registrationQuestion: this.searchForm.registrationQuestion,
        startTime:
          this.searchForm.time && this.searchForm.time.length > 0
            ? this.searchForm.time[0]
            : "",
        endTime:
          this.searchForm.time && this.searchForm.time.length > 0
            ? this.searchForm.time[1]
            : ""
      };
      selectList(obj).then(res => {
        if (res.data.code === 200) {
          this.data = res.data.data.records;
          this.page.total = res.data.data.total;
          this.loading = false;
        }
      });
    },
    searchChange () {
      this.onLoad();
    },
    searchReset () {
      this.searchForm = {
        time: [],
        registrationQuestion: ""
      };
      this.onLoad();
    },
    async handleCommand (command) {
      if (command === "del") {
        if (this.selectionList.length === 0) {
          this.$message.warning(this.$t('kwRobotStudy.selectIgnoreTips'));
          return;
        }
        let ids = this.selectionList.map(item => item.id).join(",");
        const result = await deleteByIds({ ids });
        if (result.data.code == 200) {
          this.$message({
            type: "success",
            message: this.$t("aicosCommon.deleteSuccessTip")
          });
          this.onLoad();
        }
      }
      if (command === "export") {
        if (this.selectionList.length === 0) {
          this.$message.warning(this.$t('kwRobotStudy.selectExportTips'));
          return;
        }
        let ids = this.selectionList.map(item => item.id).join(",");
        exportExcel({ ids })
          .then(res => {
            this.downFile(
              res.data,
              this.$t('kwRobotStudy.seatRegistrationIssues') + new Date().getTime() + ".xls"
            );
          })
          .catch(() => {
            this.$message.error(this.$t('kwRobotStudy.exportFailed'));
          });
      }
      if (command === "all") {
        let obj = {
          ids: "",
          registrationQuestion: this.searchForm.registrationQuestion,
          startTime:
            this.searchForm.time && this.searchForm.time.length > 0
              ? this.searchForm.time[0]
              : "",
          endTime:
            this.searchForm.time && this.searchForm.time.length > 0
              ? this.searchForm.time[1]
              : ""
        };
        exportExcel(obj)
          .then(res => {
            this.downFile(
              res.data,
              this.$t('kwRobotStudy.seatRegistrationIssues') + new Date().getTime() + ".xls"
            );
          })
          .catch(() => {
            this.$message.error(this.$t('kwRobotStudy.exportFailed'));
          });
      }
    },
    // 单个忽略
    del (row) {
      this.$confirm(this.$t("kwRobotStudy.ignoreSelectedTips"), {
        cancelButtonText: this.$t("aicosCommon.cancelBtn"),
        confirmButtonText: this.$t("aicosCommon.confirmBtn"),
        type: "warning"
      })
        .then(async () => {
          const delInfo = {
            ids: row.id
          };
          const result = await deleteByIds(delInfo);
          if (result.data.code == 200) {
            this.$message({
              type: "success",
              message: this.$t("aicosCommon.deleteSuccessTip")
            });
            this.onLoad();
          }
        })
        .catch(() => { });
    },
    createFun (row) {
      this.createDialogVisible = true;
      this.selectRow = row;
      this.selectRow.question = row.registrationQuestion;
    },
    knowledgeMarker (row) {
      this.marketData = [];
      this.dialogVisible = true;
      row.question = row.registrationQuestion;
      this.marketData.push(row);
    },
    handlerCreate () {
      const { createknowledge } = this.$refs;
      if (createknowledge.value === "") {
        this.$message.warning(this.$t('kwRobotStudy.knowledgeClass'));
        return;
      }
      this.selectType = createknowledge.value;
      this.createDialogVisible = false;
      this.manageDialogVisible = true;
    },
    async addOrEditEmitEvent () {
      this.manageDialogVisible = false;
      const result = await deleteByIds({ ids: this.selectRow.id });
      if (result.data.code == 200) {
        this.onLoad();
      }
    },
    handlerSave () {
      this.$refs.knowledgelabel.handleSave();
    },
    async refresh () {
      this.dialogVisible = false;
      let ids = this.marketData.map(item => item.id).join(",");
      const result = await deleteByIds({ ids });
      if (result.data.code == 200) {
        this.onLoad();
      }
    }
  }
};
</script>
<style lang="scss" scoped></style>
