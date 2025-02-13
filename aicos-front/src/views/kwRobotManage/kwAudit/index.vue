<template>
  <HuilanBasic hasTab>
    <div class="kwAuMian">
      <div class="kwAuType">
        <avue-tabs :option="tabOption" @change="tabChange"></avue-tabs>
      </div>
      <div class="kwAuTable">
        <!-- <HuilanBasicToolbar>
          <el-button type="primary" size="small" @click.stop="batchAudit"
            >批量审核</el-button
          >
        </HuilanBasicToolbar> -->

        <QSGSearchBar
          :formData="searchForm"
          :fields="listOption"
          @search="searchChange"
          @refresh="refreshChange"
          @reset="searchReset"
          ref="searchFormRef"
        >
          <template v-slot:appendTool>
            <el-button type="default" @click="configColumn"
              ><i class="el-icon-s-operation"></i
            ></el-button>
          </template>
        </QSGSearchBar>

        <avue-crud
          :option="listOption"
          :table-loading="loading"
          :data="listData"
          ref="listRef"
          v-model="listForm"
          :page.sync="page"
          :permission="permissionList"
          :before-open="beforeOpen"
          :before-close="beforeClose"
          @row-del="rowDel"
          @row-update="rowUpdate"
          @row-save="rowSave"
          @search-change="searchChange"
          @search-reset="searchReset"
          @selection-change="selectionChange"
          @current-change="currentChange"
          @size-change="sizeChange"
          @refresh-change="refreshChange"
          @on-load="onLoad"
          @tab-click="crudUpdateTabClick"
          :upload-after="uploadAfter"
          :upload-before="uploadBefore"
          :upload-error="uploadError"
          :upload-delete="uploadDelete"
          :upload-preview="uploadPreview"
        >
          <template slot-scope="scope" slot="menu">
            <el-button
              type="text"
              size="small"
              @click.stop="viewDataOpen(scope.row, scope.index)"
              >{{ $t("kwAudit.viewKnowledge") }}
            </el-button>
            <el-button
              type="text"
              size="small"
              v-if="tabActive === 4"
              @click.stop="viewAnswerSetting(scope.row, scope.index)"
              >{{ $t("kwAudit.viewAnswerConfig") }}
            </el-button>
            <el-button
              type="text"
              size="small"
              v-if="permissionList.checkHistoryBtn"
              @click.stop="auditRecordsOpen(scope.row, scope.index)"
              >{{ $t("kwAudit.auditRecords") }}
            </el-button>
            <el-button
              type="text"
              size="small"
              v-if="permissionList.checkBtn"
              @click.stop="auditDataOpen(scope.row, scope.index)"
              >{{ $t("kwAudit.examine") }}
            </el-button>
          </template>
          <template slot-scope="{ row }" slot="passStatus">
            <span v-if="row.passStatus === 'agree'">{{
              $t("kwAudit.agree")
            }}</span>
            <span v-else>{{ $t("kwAudit.audit") }}</span>
          </template>
        </avue-crud>

        <QSGDrawer
          :title="viewDataTitle"
          :fullscreen="false"
          size="50%"
          append-to-body
          :visible.sync="viewDataTag"
          :wrapperClosable="false"
        >
          <div class="viewDataClass">
            <ViewKwFaqData
              v-if="tabActive === 1 && viewDataTag"
              :nodeDeepPath="curNodeDeepPath"
              :curTreeNode="curSelectedTreeNode"
              :curFaqObj="curVesionRecordRow"
              faqType="view"
              @addOrEditEmitEvent="addOrEditEmitEvent"
            />
            <ViewKwTableData
              v-if="tabActive === 4 && viewDataTag"
              :nodeDeepPath="curNodeDeepPath"
              :curTreeNode="curSelectedTreeNode"
              :curFaqObj="curVesionRecordRow"
              faqType="view"
              @addOrEditEmitEvent="addOrEditEmitEvent"
            />
            <ViewKwSmallTalkData
              v-if="tabActive === 3 && viewDataTag"
              :nodeDeepPath="curNodeDeepPath"
              :curTreeNode="curSelectedTreeNode"
              :curFaqObj="curVesionRecordRow"
              faqType="view"
              @addOrEditEmitEvent="addOrEditEmitEvent"
            />
            <template v-if="tabActive === 2 && viewDataTag">
              <el-form v-model="docForm">
                <el-form-item :label="$t('kwAudit.fileName')">
                  {{ docForm.fileName }}
                </el-form-item>
                <el-form-item :label="$t('kwAudit.fileContent')">
                  {{ docForm.fileContent }}
                </el-form-item>
              </el-form>
            </template>
          </div>

          <template v-slot:footer>
            <el-button
              size="small"
              icon="el-icon-circle-close"
              @click.stop="viewDataClose"
              >{{ $t("kwAudit.close") }}</el-button
            >
          </template>
        </QSGDrawer>

        <QSGDrawer
          :title="auditDataTitle"
          :fullscreen="false"
          size="30%"
          append-to-body
          :visible.sync="auditDataTag"
          :wrapperClosable="false"
        >
          <div>
            <avue-form
              class="auditFormClass"
              :option="auditFormOption"
              ref="auditFormRef"
              v-model="auditFormData"
              :key="auditFormKey"
              :loading="loading"
            >
            </avue-form>
          </div>

          <template v-slot:footer>
            <el-button
              size="small"
              icon="el-icon-circle-plus-outline"
              type="primary"
              @click.stop="auditDataSave"
              >{{ $t("aicosCommon.saveBtn") }}</el-button
            >
            <el-button
              size="small"
              icon="el-icon-circle-close"
              @click.stop="auditDataClose"
              >{{ $t("kwAudit.close") }}</el-button
            >
          </template>
        </QSGDrawer>

        <AuditRecordsWithDrawer
          :recordParams="currentData"
          ref="auditRecordsRef"
        />
      </div>
    </div>
    <el-drawer
      :title="$t('kwAudit.viewAnswerConfig')"
      :visible.sync="drawerVisible"
      append-to-body
      show-close
      @close="drawerVisible = false"
      size="65%"
    >
      <avue-crud
        style="padding: 15px"
        :option="answerOption"
        :table-loading="answerLoading"
        :data="answerData"
        :page.sync="answerPage"
        @current-change="answerCurrentChange"
        @size-change="answerSizeChange"
      >
      </avue-crud>
    </el-drawer>
  </HuilanBasic>
</template>

<script>
import { mapGetters } from "vuex";
import QSGSearchBar from "@/components/QSGSearchBar/index";
import QSGDrawer from "@/components/QSGDrawer/index";

import AuditRecordsWithDrawer from "./auditRecordsWithDrawer";

import ViewKwFaqData from "@/views/kwKnowledgeCenter/kwKnowledgeMangement/kwFaqManagement/addFaq.vue";
import ViewKwTableData from "@/views/kwKnowledgeCenter/kwKnowledgeMangement/kwTabManagement/addFaq.vue";
import ViewKwSmallTalkData from "@/views/kwKnowledgeCenter/kwKnowledgeMangement/smalltalk/addFaq.vue";

// import { isNull, } from '@/util/qsgCommon.js';
import { detail } from "@/api/kwKnowledgeCenter/kwKnowledgeMangement/documentknowledge/index";
import { getRules } from "@/util/regx";

import { tabOption, getAuditSetting } from "./kwAuditCommon.js";
import {
  getKwAuditList,
  auditKmData,
} from "@/api/kwKnowledgeCenter/kwAudit/index.js";
import { listData } from "@/api/kwKnowledgeCenter/kwKnowledgeMangement/kwTabManagement/answersetting";

export default {
  name: "kwAuditIndex",
  components: {
    QSGSearchBar,
    QSGDrawer,
    AuditRecordsWithDrawer,
    ViewKwFaqData,
    ViewKwTableData,
    ViewKwSmallTalkData,
  },
  computed: {
    ...mapGetters(["userInfo", "permission"]),
    permissionList() {
      return {
        checkBtn: this.vaildData(
          this.permission["robot-kwAudit-completeTask"],
          false
        ),
        checkHistoryBtn: this.vaildData(
          this.permission["robot-kwAudit-listHistory"],
          false
        ),
      };
    },
  },
  data() {
    return {
      isAudit: false,
      tabActive: 1,
      tabOption: tabOption,

      currentData: {
        id: "",
        version: "",
      },

      searchForm: {},
      loading: true,
      page: {
        pageSize: 10,
        currentPage: 1,
        total: 0,
        pageSizes: [10, 20, 30, 40, 50, 100],
      },

      handlerType: "",

      listForm: {},
      selectionList: [],
      query: {},
      listData: [],
      listOption: {
        menuBtn: true,
        header: false,
        tip: false,
        searchShow: false,
        border: false,
        index: true,
        selection: true,
        viewBtn: false,
        delBtn: false,
        editBtn: false,
        columnBtn: true,
        menuWidth: 200,
        dialogClickModal: false,
        dialogWidth: "30%",
        dialogType: "drawer",
        dialogCustomClass: "huilan-drawer-form",
        span: 24,
        labelWidth: 90,
        emptyText: this.$t("aicosCommon.notData"),

        column: [
          {
            label: "ID",
            prop: "id",
            hide: true,
            disabled: true,
            display: false,
          },
          {
            label: this.$t("kwAudit.standardIssues"),
            prop: "kmDataQuestion",
            overHidden: true,
            search: false,
          },
          {
            label: this.$t("kwAudit.approvalStatus"),
            prop: "passStatus",
            type: "select",
            dicData: [
              { label: this.$t("kwAudit.agree"), value: "agree" },
              {
                label: this.$t("kwAudit.audit"),
                value: "submit",
              },
            ],
            overHidden: true,
            search: false,
          },

          // {
          //   label: "审批状态",
          //   prop: "approvalStatus",
          //   search: true,
          //   hide: true,
          //   type: "select",
          //   searchType: "select",
          //   dicData: [
          //     {
          //       label: "全部",
          //       value: 0,
          //     },
          //     {
          //       label: "待审核",
          //       value: 1,
          //     },
          //     {
          //       label: "退回",
          //       value: 1,
          //     },
          //   ],
          // },
          {
            label: "",
            prop: "keyWords",
            search: true,
            hide: true,
          },
        ],
      },

      viewDataTag: false,
      viewDataTitle: this.$t("kwAudit.viewKnowledge"),
      docForm: {
        fileName: "",
        fileContent: "",
      },

      curVesionRecordRow: {},
      curNodeDeepPath: ["0"],

      auditDataTag: false,
      auditDataTitle: this.$t("kwAudit.examine"),

      auditFormKey: 0,
      auditFormData: {},
      auditFormOption: {
        submitBtn: false,
        emptyBtn: false,
        labelWidth: 90,
        labelPosition: "right",
        span: 24,

        column: [
          {
            label: "ID",
            prop: "id",
            hide: true,
            disabled: true,
            display: false,
          },
          {
            label: this.$t("kwAudit.auditFeedback"),
            prop: "passStatus",
            type: "radio",
            dicData: [
              {
                label: this.$t("kwAudit.passThrough"),
                value: "completeTask",
              },
              {
                label: this.$t("kwAudit.disagree"),
                value: "closeForDisagree",
              },
              {
                label: this.$t("kwAudit.reject"),
                value: "revoke",
              },
            ],
            value: "completeTask",
          },
          {
            label: this.$t("kwAudit.approvalOpinions"),
            prop: "comment",
            type: "textarea",
            maxlength: 300,
            showWordLimit: true,
            row: 3,
            rules: [
              {
                required: true,
                message:
                  this.$t("aicosCommon.pleaseInput") +
                  this.$t("kwAudit.approvalOpinions"),
                trigger: "blur",
              },
              ...getRules(["notEnSpecials"]),
            ],
          },
        ],
      },
      // 答案配置
      selectRow: {},
      drawerVisible: false,
      answerLoading: false,
      answerData: [],
      answerPage: {
        total: 0,
        currentPage: 1,
        pageSize: 10,
      },
      answerOption: {
        header: false,
        menu: false,
        tip: false,
        addBtn: false,
        columnBtn: false,
        refreshBtn: false,
        column: [
          {
            label: this.$t("kwAudit.standardIssues"),
            prop: "tableQaQuestion",
            minWidth: 150,
            overHidden: true,
          },
          {
            label: this.$t("kwAudit.answerPerspective"),
            prop: "answerVisualAngle",
            display: false,
            minWidth: 150,
            overHidden: true,
          },
          {
            label: this.$t("kwAudit.updateTime"),
            prop: "updateTime",
            minWidth: 120,
            overHidden: true,
          },
          {
            label: this.$t("kwAudit.answerStatus"),
            prop: "answerStatus",
            minWidth: 100,
            type: "select",
            display: false,
            dicData: [
              {
                label: this.$t("kwAudit.published"),
                value: 3,
              },
              {
                label: this.$t("kwAudit.reviewNotReleased"),
                value: 2,
              },
              {
                label: this.$t("kwAudit.auditing"),
                value: 1,
              },
              {
                label: this.$t("kwAudit.draft"),
                value: 0,
              },
            ],
            overHidden: true,
          },
          {
            label: this.$t("kwAudit.startStopStatus"),
            prop: "enabledState",
            minWidth: 100,
            type: "select",
            display: false,
            dicData: [
              {
                label: this.$t("kwAudit.deactivate"),
                value: 0,
              },
              {
                label: this.$t("kwAudit.enable"),
                value: 1,
              },
            ],
            overHidden: true,
          },
        ],
      },
    };
  },
  created() {},
  mounted() {
    // this.getAuditConfig(1);
  },
  methods: {
    async getAuditConfig(kmType) {
      const dataParam = {
        kmType,
        tenantId: this.$store.state.user.currentTenantId,
      };
      this.auditSetting = await getAuditSetting(dataParam);
      this.isAudit = this.auditSetting.approvalProcessStatus;
    },
    viewAnswerSetting(row) {
      this.selectRow = {
        id: row.kmDataId,
      };
      this.drawerVisible = true;
      this.getAnswerList();
    },
    async getAnswerList() {
      this.answerLoading = true;
      const info = {
        tableQaId: this.selectRow.id,
        current: this.answerPage.currentPage,
        size: this.answerPage.pageSize,
      };
      const result = await listData(info);
      if (result.data.code == 200) {
        const Data = result.data.data;
        this.answerLoading = false;
        this.answerPage.total = Data.total;
        this.answerData = Data.records;
        this.answerData.map((item) => {
          item.answerVisualAngle = item.angleList.join(" | ");
        });
      }
    },
    answerCurrentChange() {
      this.getAnswerList();
    },
    answerSizeChange() {
      this.getAnswerList();
    },
    async tabChange(data) {
      if (data.value === 4) {
        this.listOption.menuWidth = 300;
      } else {
        this.listOption.menuWidth = 200;
      }
      this.query = {};  
      this.searchForm = {};
      this.$refs.searchFormRef.$refs.formRef.resetFields();
      this.tabActive = data.value;
      // await this.getAuditConfig(this.tabActive);
      const kmDataQuestionColumn = this.findObject(
        this.listOption.column,
        "kmDataQuestion"
      );
      if (this.tabActive == 4) {
        this.$set(
          kmDataQuestionColumn,
          "label",
          this.$t("kwAudit.knowledgeSubject")
        );
      } else if (this.tabActive == 2) {
        this.$set(kmDataQuestionColumn, "label", this.$t("kwAudit.fileName"));
      } else if (this.tabActive == 5) {
        this.$set(
          kmDataQuestionColumn,
          "label",
          this.$t("kwAudit.processName")
        );
      } else {
        this.$set(kmDataQuestionColumn, "label", this.$t("kwAudit.standardIssues"));
      }
      this.refreshChange();
    },

    configColumn() {
      this.$refs.listRef.$refs.dialogColumn.columnBox = true;
    },

    searchReset() {
      this.query = {};
      this.searchForm = {};
      this.onLoad(this.page);
    },
    searchChange(params, done) {
      this.query = {
        ...params,
      };
      this.searchForm = this.query;
      this.page.currentPage = 1;
      this.onLoad(this.page, params);
      done();
    },

    selectionChange(list) {
      this.selectionList = list;
    },

    selectionClear() {
      this.selectionList = [];
      this.$refs.listRef.toggleSelection();
    },

    beforeOpen(done, type) {
      if (["add", "edit", "view"].includes(type)) {
        this.$set(this.listOption, "menuBtn", true);

        this.initData(type);

        this.handlerType = type;
      }
      done();
    },
    beforeClose(done /*, type*/) {
      this.refreshChange();
      done();
    },

    currentChange(currentPage) {
      this.page.currentPage = currentPage;
    },

    sizeChange(pageSize) {
      this.page.pageSize = pageSize;
    },

    refreshChange() {
      this.onLoad(this.page, this.query);
    },

    initData(type) {
      if (type == "view" || type == "edit") {
        this.type = type;
      }
    },

    onLoad(page, params = {}) {
      this.loading = true;

      const dataParam = {
        ...params,
        ...this.query,
        current: page.currentPage,
        size: page.pageSize,
        kmType: this.tabActive || 1,
      };

      getKwAuditList(dataParam).then((res) => {
        const dataRes = res.data.data;
        this.page.total = dataRes.total;
        this.page.pageSize = dataRes.size;
        this.page.currentPage = dataRes.current;
        this.listData = dataRes.records || [];

        this.loading = false;
        this.selectionClear();
      });
    },

    viewDataOpen(row) {
      if (this.tabActive === 2) {
        detail(row.kmDataId).then((res) => {
          const dataRes = res.data.data;
          this.docForm.fileName = dataRes.fileName;
          this.docForm.fileContent = dataRes.fileContent;
        });
      } else {
        this.docForm = {
          fileName: "",
          fileContent: "",
        };
      }
      this.curVesionRecordRow = {
        id: row.kmDataId,
        version: row.kmDataVersion || "",
      };
      this.viewDataTag = true;
    },
    viewDataClose() {
      this.viewDataTag = false;
    },
    auditDataOpen(row) {
      this.auditFormData = {};
      this.auditFormKey++;
      this.currentData = row;
      this.auditDataTag = true;
    },
    auditDataClose() {
      this.auditDataTag = false;
    },
    auditDataSave() {
      this.$refs.auditFormRef.validate((valid) => {
        if (valid) {
          const dataParam = {
            passStatus:
              this.auditFormData.passStatus == "completeTask"
                ? "agree"
                : this.auditFormData.passStatus,
            comment: this.auditFormData.comment,
            businessId: this.currentData.id,
            kmType: this.tabActive || 1,
            processInstanceId: this.currentData.processInstanceId,
            processDefinitionId: this.currentData.processDefinitionId,
            taskDefinitionKey: this.currentData.taskDefinitionKey,
            taskId: this.currentData.taskId,
          };
          auditKmData(dataParam, this.auditFormData.passStatus).then(
            () => {
              this.$message({
                message: this.$t("kwAudit.auditSuccess"),
                type: "success",
              });

              this.refreshChange();
              this.auditDataClose();
            },
            (error) => {
              window.console.log(error);
            }
          );
        }
      });
    },

    auditRecordsOpen(row) {
      this.currentData = {
        ...row,
        kmType: this.tabActive || 1,
      };
      this.$refs.auditRecordsRef.auditRecordsOpen();
    },
  },
};
</script>

<style lang="scss" scoped>
.kwAuTable {
  padding: 10px 30px 30px;
  background-color: #fff;
  margin: 0px;
}

.viewDataClass {
  .kw-tabs-base-container {
    padding: 0px 10px 20px;
  }
}
</style>
