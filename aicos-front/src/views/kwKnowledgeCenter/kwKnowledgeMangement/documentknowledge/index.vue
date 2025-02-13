<template>
  <HuilanBasic style="padding: 0">
    <el-row v-if="!isMark">
      <avue-crud
        :option="option"
        :data="data"
        ref="crud"
        :page.sync="page"
        :table-loading="loading"
        @row-update="rowUpdate"
        @on-load="onLoad"
        @select="select"
        @select-all="selectAll"
        @selection-change="selectionChange"
      >
        <template slot="header">
          <div class="kw-header">
            <div class="kw-button-container">
              <el-button
                @click="addFlag = true"
                v-if="permissionList.addBtn"
                class="kw-build-button kw-btn-green"
                >{{ $t("doc.addDocKnowledge") }}</el-button
              >
              <el-button
                @click="handleDelete"
                v-if="permissionList.delMoreBtn"
                class="kw-build-button kw-btn-blue"
                >{{ $t("aicosCommon.batchDeleteBtn") }}</el-button
              >
            </div>
            <div id="kw-form-container">
              <div
                class="kw-form-form"
                style="display: flex; align-items: center"
              >
                <el-date-picker
                  v-model="searchTime"
                  type="daterange"
                  size="small"
                  value-format="yyyy-MM-dd HH:mm:ss"
                  format="yyyy-MM-dd HH:mm:ss"
                  :default-time="['00:00:00', '23:59:59']"
                  style="width: 370px !important"
                  class="kw-form-type"
                  :start-placeholder="$t('doc.startDate')"
                  :end-placeholder="$t('doc.endDate')"
                >
                </el-date-picker>
                <!-- 搜索内容 -->
                <el-input
                  :placeholder="$t('doc.documentName')"
                  v-model="searchContent"
                  clearable
                  size="small"
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
                  ><i class="aicosicon aicos-icon-clear"></i
                ></el-button>
              </div>
            </div>
          </div>
        </template>
        <!-- 操作栏 -->
        <template v-slot:menu="scope">
          <HuilanBasicActionTool
            :actions="getRowActions(scope.row)"
            :limt="4"
            @command="handleCommand($event, scope.row, scope.index)"
          />
        </template>
      </avue-crud>
    </el-row>
    <div v-if="isMark">
      <Filemark :rowData="selectRow" @close="closeMark" />
    </div>
    <el-drawer
      :title="isEdit ? $t('doc.editDocKnowledge') : $t('doc.addDocKnowledge')"
      append-to-body
      :visible.sync="addFlag"
      size="40%"
      show-close
      @close="handlerCancel"
    >
      <el-form
        style="padding: 20px"
        :model="addForm"
        :label-position="labelPosition"
        label-width="100px"
        :rules="rules"
        ref="addForm"
      >
        <el-form-item :label="$t('doc.documentName') + '：'" prop="fileName">
          <el-input
            v-model="addForm.fileName"
            maxlength="50"
            show-word-limit
          ></el-input>
        </el-form-item>
        <el-form-item :label="$t('doc.uploadAttachments')" prop="upload">
          <el-upload
            class="upload-demo"
            action=""
            ref="uploadFile"
            accept=".txt"
            :with-credentials="true"
            :auto-upload="false"
            :on-change="handleChange"
            limit="1"
          >
            <el-button size="small" type="primary">{{
              $t("doc.uploadAttachments")
            }}</el-button>
            <div slot="tip" class="el-upload__tip">
              {{ $t("doc.uploadTxtTips") }}
            </div>
          </el-upload>
        </el-form-item>
        <el-form-item style="text-align: right">
          <el-button
            size="small"
            type="primary"
            @click="handlerSave(0)"
            :disabled="disable"
            >{{ $t("aicosCommon.saveBtn") }}</el-button
          >
          <el-button
            size="small"
            type="primary"
            v-if="!isAudit"
            @click="handlerSave(1)"
            :disabled="disable"
            >{{ $t("doc.saveAndPublish") }}</el-button
          >
          <el-button
            v-if="isAudit"
            size="small"
            type="primary"
            :disabled="disable"
            @click="handlerSave(0, true)"
            >{{ $t("doc.saveAndPublish") }}</el-button
          >
        </el-form-item>
      </el-form>
      <template v-slot:footer>
        <!-- <el-button size="small" @click="handlerCancel">{{
          $t("aicosCommon.cancelBtn")
        }}</el-button> -->
      </template>
    </el-drawer>

    <AuditRecordsWithDrawer
      :recordParams="recordParams"
      ref="auditRecordsRef"
    />
  </HuilanBasic>
</template>

<script>
import { mapGetters } from "vuex";
import {
  listData,
  save,
  remove,
  update,
  updateEnabled,
} from "@/api/kwKnowledgeCenter/kwKnowledgeMangement/documentknowledge/index";
import { getTextWidth } from "@/util/util";
import AuditRecordsWithDrawer from "@/views/kwRobotManage/kwAudit/auditRecordsWithDrawer";
import {
  getAuditSetting,
  kmAuditColse,
  kmAuditStart,
} from "@/views/kwRobotManage/kwAudit/kwAuditCommon";

import Filemark from "./filemark";
import { deepClone } from "@/util/util";
export default {
  components: {
    Filemark,
    AuditRecordsWithDrawer,
  },
  inject: ["isRobotMenu"],
  data() {
    return {
      // 审核相关
      recordParams: {},
      auditSetting: {}, // 审核设置
      isAudit: false, // 是否审核

      disable: false,
      isMark: false,
      idsArr: [],
      idsArrAll:[],
      cur: {},
      isEdit: false,
      selectRow: {},
      // botId: "",
      searchTime: [],
      // moduleStatus: "", //状态
      searchContent: "", //搜索内容
      addFlag: false,
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
        // height: 515,
        menuWidth: 300,
        addBtn: false,
        editBtn: false,
        viewBtn: false,
        delBtn: false,
        searchBtn: false,
        columnBtn: false,
        refreshBtn: false,
        stripe: true,
        emptyText: this.$t("aicosCommon.notData"),
        dialogClickModal: false,
        dialogWidth: "40%",
        dialogType: "drawer",
        dialogCustomClass: "huilan-drawer-form",
        labelPosition: "left",
        updateBtnText: "修改",
        column: [
          {
            label: this.$t("doc.documentName"),
            prop: "fileName",
            type: "input",
            maxlength: 50,
            minWidth: 150,
            overHidden: true,
            span: 24,
            showWordLimit: true,
            rules: [
              {
                required: true,
                message:
                  this.$t("aicosCommon.pleaseInput") +
                  this.$t("doc.documentName"),
              },
            ],
          },
          {
            label: this.$t("doc.documentWordCount"),
            prop: "fileWordCount",
            display: false,
          },
          {
            label: this.$t("doc.knowledgeState"),
            prop: "knowledgeStatus",
            minWidth: 100,
            type: "select",
            display: false,
            dicData: [
              {
                label: this.$t("doc.draft"),
                value: 0,
              },
              {
                label: this.$t("doc.published"),
                value: 1,
              },
            ],
            overHidden: true,
            formatter: (val, value, label) => {
              if (this.validatenull(value)) {
                return "--";
              }
              return label;
            },
          },
          {
            label: this.$t("doc.auditStatus"),
            prop: "auditStatus",
            span: 12,
            minWidth: 100,
            showWordLimit: true,
            overHidden: true,
            align: "center",
            display: false,
            hide: true,
            dicData: [
              {
                label: this.$t("doc.auditing"),
                value: "auditing",
              },
              {
                label: this.$t("doc.reject"),
                value: "reject",
              },
              {
                label: this.$t("doc.disagree"),
                value: "disagree",
              },
              {
                label: this.$t("doc.finish"),
                value: "finish",
              },
              {
                label: this.$t("doc.withdraw"),
                value: "withdraw",
              },
              {
                label: this.$t("doc.passThrough"),
                value: "agree",
              },
            ],
            formatter: (val, value, label) => {
              if (this.validatenull(value)) {
                return "--";
              }
              return label;
            },
          },
          {
            label: this.$t("doc.startStopStatus"),
            prop: "status",
            minWidth: 100,
            type: "select",
            display: false,
            dicData: [
              {
                label: this.$t("doc.deactivate"),
                value: 0,
              },
              {
                label: this.$t("doc.enable"),
                value: 1,
              },
            ],
            showWordLimit: true,
            overHidden: true,
          },
          {
            label: this.$t("faq.createTime"),
            prop: "createTime",
            minWidth: 100,
            showWordLimit: true,
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
      addForm: { knowledgeStatus: 0, fileName: "" },
      rules: {
        fileName: [
          {
            required: true,
            message:
              this.$t("aicosCommon.pleaseInput") + this.$t("doc.documentName"),
            trigger: "blur",
          },
        ],
        upload: [
          {
            required: true,
            message: this.$t("doc.uploadFileTips"),
            trigger: "blur",
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
    ...mapGetters(["botObj", "permission", "language"]),
    permissionList() {
      return {
        addBtn: this.vaildData(
          this.permission[`${this.prefix}document-add`],
          false
        ),
        delMoreBtn: this.vaildData(
          this.permission[`${this.prefix}document-deleteMore`],
          false
        ),
        editBtn: this.vaildData(
          this.permission[`${this.prefix}document-edit`],
          false
        ),
        delBtn: this.vaildData(
          this.permission[`${this.prefix}document-delete`],
          false
        ),
        publishBtn: this.vaildData(
          this.permission[`${this.prefix}document-publish`],
          false
        ),
        stopBtn: this.vaildData(
          this.permission[`${this.prefix}document-stop`],
          false
        ),
        startBtn: this.vaildData(
          this.permission[`${this.prefix}document-start`],
          false
        ),
        markBtn: this.vaildData(
          this.permission[`${this.prefix}document-mark`],
          false
        ),
        viewRecodeBtn: true,
        closeAuditBtn: true,
      };
    },
    labelPosition() {
      return this.language != "zh" ? "top" : "right";
    },
  },
  mounted() {
    this.getAuditConfig();
  },
  methods: {
    async getAuditConfig() {
      const dataParam = {
        kmType: 2,
        tenantId: this.$store.state.user.currentTenantId,
      };
      this.auditSetting = await getAuditSetting(dataParam);
      this.isAudit = this.auditSetting.approvalProcessStatus;
      let auditStatus = this.findObject(this.option.column, "auditStatus");
      if (this.isAudit) {
        auditStatus.hide = false;
        this.option.updateBtnText = this.$t("doc.saveAndPublish");
      } else {
        auditStatus.hide = true;
        this.option.updateBtnText = "修改";
      }
    },
    getRowActions(row) {
      const map = {
        // editBtn: {
        //   name: "编辑",
        //   command: "rowEdit",
        // },
        // delBtn: {
        //   name: "删除",
        //   command: "handlerDel",
        // },
        markBtn: {
          name: this.$t("doc.knowledgeAnnotation"),
          command: "handleMark",
        },
      };
      const list = ["markBtn"];
      if (
        row.auditStatus !== "auditing"
        // || 1 ==1
      ) {
        map.editBtn = {
          name: this.$t("aicosCommon.editBtn"),
          command: "rowEdit",
        };
        list.push("editBtn");
      }

      if (
        row.auditStatus !== "auditing"
        // || 1 ==1
      ) {
        map.delBtn = {
          name: this.$t("aicosCommon.delBtn"),
          command: "handlerDel",
        };
        list.push("delBtn");
      }
      if (row.auditStatus == "auditing" && this.isAudit) {
        map.closeAuditBtn = {
          name: this.$t("doc.withdraw"),
          command: "closeAudit",
        };
        list.push("closeAuditBtn");
      }
      if (
        row.knowledgeStatus === 0 &&
        row.auditStatus !== "auditing"
        // !this.isAudit
      ) {
        map.publishBtn = {
          name: this.$t("doc.release"),
          command: "publishFaq",
        };
        list.push("publishBtn");
      }
      if (row.status === 1) {
        map.stopBtn = {
          name: this.$t("doc.deactivate"),
          command: "changeStatus",
        };
        list.push("stopBtn");
      }
      if (row.status === 0) {
        map.startBtn = {
          name: this.$t("doc.enable"),
          command: "changeStatus",
        };
        list.push("startBtn");
      }
      if (
        this.isAudit
        // row.auditStatus == "auditing" ||
        // row.auditStatus == "disagree" ||
        // row.auditStatus == "finish" ||
        // row.auditStatus == "reject"
        // || 1 ==1
      ) {
        map.viewRecodeBtn = {
          name: this.$t("doc.auditRecords"),
          command: "viewAuditRecords",
        };
        list.push("viewRecodeBtn");
      }
      const actions = [];

      list.forEach((item) => {
        if (this.permissionList[item]) {
          actions.push(map[item]);
        }
      });
      return actions;
    },
    handleCommand(command, row, index) {
      if (command === "publishFaq") {
        this.publishFaq(row, 1);
      } else if (command === "changeStatus") {
        this.changeStatus(row, row.status == 0 ? 1 : 0);
      } else {
        this[command](row, index);
      }
    },
    async onLoad() {
      const info = {
        fileName: this.searchContent,
      };
      if (this.searchTime !== null && this.searchTime.length > 0) {
        info.beginTime = this.searchTime[0];
        info.endTime = this.searchTime[1];
      } else {
        info.beginTime = "";
        info.endTime = "";
      }
      this.loading = true;
      const result = await listData(
        this.page.currentPage,
        this.page.pageSize,
        info
      );
      if (result.data.code == 200) {
        const Data = result.data.data;
        if (this.language != "zh") {
          this.option.menuWidth = 350;
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
        } else {
          this.option.menuWidth = 300;
        }
        this.loading = false;
        this.page.total = Data.total;
        this.data = Data.records;
      }
    },
    // 知识标注
    handleMark(row) {
      this.selectRow = row;
      this.isMark = true;
    },
    // 发布
    async publishFaq(row, status) {
      let obj = { ...deepClone(row) };
      obj.knowledgeStatus = status;
      if (this.isAudit) {
        await kmAuditStart(row, 2, this.auditSetting.processDefineId);
        this.onLoad();
      } else {
        update(obj).then((res) => {
          if (res.data.success) {
            this.$message.success(this.$t("doc.publishedTips"));
            this.onLoad();
          }
        });
      }
    },
    closeMark(val) {
      if (val) {
        this.isMark = false;
      }
    },
    //更改状态
    async changeStatus(row, status) {
      const startInfo = {
        id: row.id,
        status,
      };
      const startResult = await updateEnabled(startInfo);
      if (startResult.data.code == 200) {
        this.$message({
          type: "success",
          message: this.$t("aicosCommon.successOperate"),
        });
        this.onLoad();
      }
    },
    //删除
    handlerDel(row) {
      this.$confirm(this.$t("doc.deleteDocumentTips"), {
        cancelButtonText: this.$t("aicosCommon.cancelBtn"),
        confirmButtonText: this.$t("aicosCommon.confirmBtn"),
        type: "warning",
      })
        .then(async () => {
          // const delInfo = {
          //   ids: row.id,
          // };
          const result = await remove(row.id);
          if (result.data.code == 200) {
            this.$message.success(this.$t("aicosCommon.successOperate"));
            this.onLoad();
          }
        })
        .catch(() => {});
    },
    handleDelete() {
      if (this.idsArr.length === 0) {
        this.$message.warning(this.$t("doc.selectKnowledgeTips"));
        return false;
      }

      if (this.idsArrAll.length > 0 && this.isAudit ) {
        // console.log(this.isAudit);
        // console.log('this.idsArrAll', this.idsArrAll);

        let canDel = true;
        this.idsArrAll.forEach((item) => {
          if( item.auditStatus == "auditing") {
            canDel = canDel &&  false
          }
        });

        // console.log('canDel', canDel);
        if( !canDel ){
          this.$message({
            type: "warning",
            message: this.$t("doc.selectKnowledgeHasAudit"),
          });
          return false;
        }
      }


      this.$confirm(this.$t("doc.deleteKnowledgeTips"), {
        confirmButtonText: this.$t("aicosCommon.confirmBtn"),
        cancelButtonText: this.$t("aicosCommon.cancelBtn"),
        type: "warning",
      })
        .then(() => {
          return remove(deepClone(this.idsArr).join(","));
        })
        .then(() => {
          this.$message.success(this.$t("aicosCommon.successOperate"));
          this.onLoad();
        });
    },
    //点击复选框
    selectionChange(val) {
      const newArr = [];
      this.idsArrAll = [...val];
      val.forEach((item) => {
        newArr.push(item.id);
      });
      this.idsArr = [...new Set(newArr)];
    },
    //搜索
    handlerSearch() {
      this.onLoad();
    },
    //搜索重置
    handlerReset() {
      this.searchTime = [];
      this.searchContent = "";
      this.onLoad();
    },
    // 编辑
    rowEdit(row, index) {
      this.$refs.crud.rowEdit(row, index);
    },
    //编辑保存
    rowUpdate(row, index, done, loading) {
      if (this.isAudit) {
        row.knowledgeStatus = 0;
      }
      update(row)
        .then(async (res) => {
          if (this.isAudit) {
            await kmAuditStart(
              res.data.data,
              2,
              this.auditSetting.processDefineId
            );
          }
        })
        .then(
          () => {
            this.onLoad();
            if (!this.isAudit) {
              this.$message.success(this.$t("doc.modifiedTips"));
            }
            done();
          },
          (error) => {
            console.log(error);
            loading();
          }
        );
    },
    handleChange(file, fileList) {
      if (fileList > 0) {
        this.$refs.addForm.clearValidate("upload");
      }
    },
    //新增
    handlerSave(status, startAudit = false) {
      this.$refs["addForm"].validateField(["fileName"], (valid) => {
        if (!valid) {
          let obj = { ...this.addForm };
          if (this.$refs.uploadFile.uploadFiles.length === 0) {
            this.$message.error(this.$t("doc.uploadAttachment"));
            return;
          }
          let fileObj = this.$refs.uploadFile.uploadFiles[0].raw;
          let fd = new FormData(); // FormData 对象
          let size = Number(fileObj.size / 1024 / 1024);
          fd.append("file", fileObj);
          if (size > 1) {
            this.$message({
              type: "warning",
              message: this.$t("doc.documentSizeTips"),
            });
            return;
          }
          fd.append("fileName", obj.fileName);
          fd.append("knowledgeStatus", status);
          fd.append("submitApprovalStatus", startAudit);
          this.disable = true;
          save(fd)
            .then(async (res) => {
              if (startAudit) {
                await kmAuditStart(
                  res.data.data,
                  2,
                  this.auditSetting.processDefineId
                );
              }
            })
            .then(() => {
              if (!startAudit) {
                this.$message({
                  type: "success",
                  message: this.$t("aicosCommon.saveSuccessTip"),
                });
              }
              this.$refs["addForm"].resetFields();
              this.$refs.uploadFile.uploadFiles = [];
              this.addFlag = false;
              this.disable = false;
              this.onLoad();
            })
            .catch(() => {
              this.disable = false;
            });
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    // 取消新增
    handlerCancel() {
      this.$refs["addForm"].resetFields();
      this.$refs.uploadFile.uploadFiles = [];
      this.addFlag = false;
    },
    viewAuditRecords(row) {
      this.recordParams = {
        kmDataId: row.id,
        kmVersion: 0,
        kmType: 2,
      };

      this.$refs.auditRecordsRef.auditRecordsOpen();
    },

    async closeAudit(row) {
      const dataParam = {
        kmDataId: row.id,
        kmType: 2,
        kmVersion: 0,
      };
      await kmAuditColse(dataParam)
        .then(async (res) => {
          console.log(res);
          this.onLoad();
        })
        .catch((error) => {
          window.console.error(error);
        });
    },
  },
};
</script>

<style lang="scss" scoped>
/deep/ .avue-crud__menu {
  display: none;
}
</style>
