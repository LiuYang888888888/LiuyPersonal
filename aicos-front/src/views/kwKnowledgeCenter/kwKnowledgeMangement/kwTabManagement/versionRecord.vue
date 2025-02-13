<template>
  <div>
    <avue-crud
      :option="recordOption"
      :table-loading="recordLoading"
      :data="recordData"
      ref="auditRecordCrud"
      v-model="recordForm"
      :page.sync="page"
      @search-change="searchChange"
      @search-reset="searchReset"
      @selection-change="selectionChange"
      @current-change="currentChange"
      @size-change="sizeChange"
      @refresh-change="refreshChange"
      @on-load="recordOnLoad"
    >
      <template slot="menu" slot-scope="{ type, size, row }">
        <el-button
          :type="type"
          :size="size"
          @click.stop="viewFaqVersion(row)"
          >{{ $t("table.viewKnowledgeSubject") }}</el-button
        >
        <!-- <el-button
          v-if="
            curAuditRow.versionNum != row.version &&
            permission['faq-colophon-back']
          "
          :type="type"
          :size="size"
          @click.stop="callbackVersion(row)"
          >{{ $t("faq.fallbackVersion") }}</el-button
        > -->

        <el-button
          :type="type"
          :size="size"
          @click.stop="viewAuditRecords(row)"
          >{{ $t("faq.auditRecords") }}</el-button
        >
        <el-button
          :type="type"
          :size="size"
          @click.stop="viewVersionAnswer(row)"
          >{{ $t("table.viewAnswerSetting") }}</el-button
        >
      </template>
    </avue-crud>

    <!--查看-->
    <el-drawer
      :title="$t('table.viewKnowledge')"
      :visible.sync="faqRecordVersionIsShow"
      :custom-class="addDrawerClass"
      append-to-body
      size="40%"
    >
      <AddFaq
        :curTreeNode="curSelectedTreeNode"
        :curFaqObj="curRecordVersionData"
        :faqType="'version'"
        v-if="faqRecordVersionIsShow"
      />
    </el-drawer>

    <AuditRecordsWithDrawer
      :recordParams="recordParams"
      ref="auditRecordsRef"
      :auditRecordsTitle="$t('faq.auditRecords')"
    />
    <el-drawer
      :title='$t("table.answerConfiguration")'
      :visible.sync="drawerVisible"
      append-to-body
      show-close
      @close="(drawerVisible = false)"
      size="80%"
    >
      <Answerhistorysetting
        v-if="drawerVisible"
        :rowData="selectRow"
        :nodeDeepPath="curNodeDeepPath"
        type="version"
        @addOrEditEmitEvent="addOrEditEmitEvent"
      />
    </el-drawer>
  </div>
</template>

<script>
import AddFaq from "./addFaq";
import Answerhistorysetting from "./answerHistorySetting";
import AuditRecordsWithDrawer from "@/views/kwRobotManage/kwAudit/auditRecordsWithDrawer";
import { getAuditSetting } from "@/views/kwRobotManage/kwAudit/kwAuditCommon";
import {
  versionListUrl,
  callbackVersionUrl,
} from "@/api/kwKnowledgeCenter/kwKnowledgeMangement/kwTabManagement/index";
export default {
  data() {
    return {
      selectRow:{},
      drawerVisible:false,
      recordParams: {},
      curSelectedTreeNode: {
        data: {
          id: "0",
          dname: this.$t("aicosCommon.generalClass"),
        },
      },
      curRecordVersionData: {}, // 当前版本下的数据
      query: {},
      recordLoading: false,
      selectionList: [],
      parentId: "0",
      faqRecordVersionIsShow: false,
      sourceType: "auditList",
      page: {
        pageSize: 10,
        currentPage: 1,
        total: 0,
      },
      recordOption: {
        refreshBtn: false,
        tip: false,
        border: true,
        header: false,
        index: false,
        menu: true,
        selection: false,
        labelWidth: 120,
        editBtn: false,
        viewBtn: false,
        delBtn: false,
        menuWidth: 300,
        emptyText: this.$t("aicosCommon.notData"),

        column: [
          {
            label: this.$t("table.version"),
            prop: "version",
          },
          {
            label: this.$t("table.createTime"),
            prop: "createTime",
          },
        ],
      },
      recordData: [],
      recordForm: {},
      curRecord: {},
    };
  },
  props: {
    curAuditRow: {
      type: Object,
      default: () => {
        return {};
      },
    },
  },
  components: {
    AddFaq,
    AuditRecordsWithDrawer,
    Answerhistorysetting,
  },
  computed: {
    // 计算属性
  },
  mounted() {
    this.getAuditConfig();
  },
  methods: {
    viewVersionAnswer(row){
      this.selectRow = row
      this.drawerVisible = true
    },
    viewFaqVersion(row) {
      this.curRecord = row;
      this.curRecordVersionData = {
        id: row.id,
        version: row.version,
      };
      this.faqRecordVersionIsShow = true;
    },
    // 回退到该版本
    callbackVersion(row) {
      callbackVersionUrl(row.questionid, row.version).then((resData) => {
        resData = resData.data;
        if (resData.code == 200) {
          this.$message({
            type: "success",
            message: this.$t("table.fallbackSuccessful"),
          });
        }
      });
    },
    searchReset() {
      this.query = {};
      this.recordOnLoad(this.page);
    },
    // 搜索
    searchChange(params, done) {
      this.query = params;
      // this.parentId = '';
      this.page.currentPage = 1;
      this.recordOnLoad(this.page, params);
      done();
    },
    selectionChange(list) {
      this.selectionList = list;
    },
    selectionClear() {
      this.selectionList = [];
      this.$refs.auditRecordCrud.toggleSelection();
    },
    currentChange(currentPage) {
      this.page.currentPage = currentPage;
    },
    sizeChange(pageSize) {
      this.page.pageSize = pageSize;
    },
    refreshChange() {
      this.recordOnLoad(this.page, this.query);
    },
    recordOnLoad(page) {
      let me = this;
      let queryParam = {
        id: this.curAuditRow.id,
        current: page.currentPage,
        size: page.pageSize,
      };

      this.recordLoading = true;

      versionListUrl(queryParam).then((res) => {
        if (res.data.success) {
          me.recordData = res.data.data ? res.data.data.records : [];
          me.page.total = parseInt(res.data.data.total);
          me.recordLoading = false;
          me.selectionClear();
        }
      });
    },
    async getAuditConfig() {
      const dataParam = {
        kmType: 4,
        tenantId: this.$store.state.user.currentTenantId,
      };
      this.auditSetting = await getAuditSetting(dataParam);
      this.isAudit = this.auditSetting.approvalProcessStatus;
    },
    viewAuditRecords(row) {
      this.recordParams = {
        kmDataId: row.tableqaId,
        kmVersion: row.version,
        kmType: 4,
      };
      this.$refs.auditRecordsRef.auditRecordsOpen();
    },
  },
};
</script>

<style scoped></style>
