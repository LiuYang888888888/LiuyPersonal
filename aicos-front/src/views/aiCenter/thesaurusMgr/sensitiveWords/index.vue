<template>
  <ThesaurusBasic v-model="curAiAppId">
    <HuilanBasicToolbar style="margin-top: 0">
      <el-button
        v-if="permissionList.addBtn"
        type="primary"
        size="small"
        @click="handleAdd"
        >{{ $t("aicosCommon.addBtn") }}</el-button
      >
      <el-button
        v-if="permissionList.delBatchBtn"
        type="danger"
        size="small"
        @click="deleteBatchs"
        >{{ $t("aicosCommon.batchDeleteBtn") }}</el-button
      >
      <el-button
        v-if="permissionList.importData"
        type="primary"
        size="small"
        @click="importDialogVisible = true"
        >{{ $t("aicosCommon.import") }}</el-button
      >
      <el-button
        v-if="permissionList.exportData"
        type="primary"
        size="small"
        @click="exportExcel"
        >{{ $t("aicosCommon.exportAll") }}</el-button
      >
    </HuilanBasicToolbar>
    <HuilanBasicSearchbar
      :model="searchForm"
      :fields="searchFieldList"
      @reset="searchReset"
      @search="searchChange"
    >
      <template v-slot:appendTool>
        <el-button type="default" @click="configColumn"
          ><i class="el-icon-s-operation"></i
        ></el-button>
      </template>
    </HuilanBasicSearchbar>
    <avue-crud
      class="sensitiveWords"
      :table-loading="loading"
      :data="data"
      :option="option"
      :page.sync="page"
      :before-open="beforeOpen"
      ref="crud"
      @row-save="rowSave"
      @search-change="searchChange"
      @search-reset="searchReset"
      @refresh-change="refreshChange"
      @current-change="currentChange"
      @size-change="sizeChange"
      @row-del="rowDel"
      @row-update="rowUpdate"
      @selection-change="selectionChange"
    >
      <template v-slot:menu="scope">
        <HuilanBasicActionTool
          :actions="getRowActions(scope.row)"
          @command="handleCommand($event, scope.row, scope.index)"
        />
      </template>
    </avue-crud>
    <HuilanDialog
      v-if="importDialogVisible"
      :title="$t('aiCenter.sensitiveWords.importSensitiveWords')"
      append-to-body
      :visible.sync="importDialogVisible"
      width="600px"
    >
      <avue-form
        ref="form"
        v-model="importForm"
        :option="importFormOption"
        :upload-after="uploadAfter"
        :upload-before="uploadBefore"
      >
      </avue-form>
      <div>
        {{ $t("aiCenter.sensitiveWords.click")
        }}<a :href="downUrl" download
          ><span style="color: #409eff">{{
            $t("aicosCommon.downloadTemplate")
          }}</span></a
        >
        {{ $t("aiCenter.sensitiveWords.formatTip") }}
      </div>
      <template v-slot:footer>
        <el-button
          size="small"
          type="primary"
          @click="importDialogVisible = false"
          >{{ $t("aicosCommon.closeBtn") }}
        </el-button>
      </template>
    </HuilanDialog>
    <HuilanDialog
      :title="dialog.title"
      append-to-body
      :visible.sync="dialog.dialogVisible"
      width="30%"
      :before-close="closesClear"
    >
      <el-form
        :model="dialog"
        ref="dialog"
        label-width="120px"
        class="demo-ruleForm"
        size="mini"
      >
        <el-form-item
          :label="$t('aiCenter.sensitiveWordssensitiveName')"
          v-if="dialog.title === $t('aicosCommon.addBtn')"
          prop="sensitiveWord"
          :rules="[
            {
              required: true,
              message: $t('aiCenter.sensitiveWords.sensitiveEmptyTip'),
            },
            {
              min: 1,
              max: 50,
              message: $t('aiCenter.sensitiveWords.fiveLengthTip'),
              trigger: 'blur',
            },
            {
              pattern: /^[A-Za-z0-9\u4E00-\u9FA5\r\n]+$/,
              message: $t('aiCenter.sensitiveWords.onlyRuleTip'),
            },
          ]"
        >
          <el-input
            :placeholder="$t('aiCenter.sensitiveWords.batchAddTip')"
            type="textarea"
            :autosize="{ minRows: 4 }"
            v-model="dialog.sensitiveWord"
            autocomplete="off"
          ></el-input>
        </el-form-item>
        <el-form-item
          v-else
          :label="$t('aiCenter.sensitiveWords.sensitiveName')"
          prop="sensitiveWord"
          :rules="[
            {
              required: true,
              message: $t('aiCenter.sensitiveWords.sensitiveEmptyTip'),
            },
            {
              min: 1,
              max: 50,
              message: $t('aiCenter.sensitiveWords.fiveLengthTip'),
              trigger: 'blur',
            },
            {
              pattern: /^[A-Za-z0-9\u4E00-\u9FA5]+$/,
              message: $t('aiCenter.sensitiveWords.onlyRuleTip'),
            },
          ]"
        >
          <el-input
            type="input"
            v-model="dialog.sensitiveWord"
            autocomplete="off"
          ></el-input>
        </el-form-item>
        <el-form-item
          :label="$t('aiCenter.sensitiveWords.excludedOrNot')"
          prop="excluded"
        >
          <el-radio-group v-model="dialog.excluded">
            <el-radio label="1">{{ $t("aicosCommon.yes") }}</el-radio>
            <el-radio label="0">{{ $t("aicosCommon.no") }}</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item style="text-align: right">
          <el-button
            size="small"
            type="primary"
            @click="submitForm('dialog')"
            >{{ $t("aicosCommon.saveBtn") }}</el-button
          >
          <el-button size="small" @click="resetForm('dialog')">{{
            $t("aicosCommon.cancelBtn")
          }}</el-button>
        </el-form-item>
      </el-form>
    </HuilanDialog>
  </ThesaurusBasic>
</template>

<script>
import serviceList from "@/config/serviceList";
import { baseURL } from "@/api/common";
const { ai } = serviceList;
import {
  save,
  listByPage,
  properDelete,
  properUpdate,
  deleteBatch,
  properExportExcel,
} from "@/api/aiCenter/thesaurusMgr/sensitiveWords";
import ThesaurusBasic from "../components/thesaurusBasic";
import { mapGetters } from "vuex";
export default {
  name: "sensitiveWords",
  components: {
    ThesaurusBasic,
  },
  watch: {
    curAiAppId(newVal) {
      if (newVal) {
        this.pageList({ applicationId: newVal });
      }
    },
    language: {
      handler: function(newVal) {
        if (newVal == "zh") {
          this.downUrl = `${baseURL}/template/aiNlpSensitive.xls`;
        } else if (newVal == "en") {
          this.downUrl = `${baseURL}/template/aiNlpSensitive_en.xls`;
        }
      },
      immediate: true
    }
  },
  computed: {
    ...mapGetters(["permission", "language"]),
    permissionList() {
      return {
        addBtn: this.vaildData(this.permission["ai-sensitiveWords-add"], false),
        viewBtn: true,
        delBtn: this.vaildData(this.permission["ai-sensitiveWords-del"], false),
        delBatchBtn: this.vaildData(
          this.permission["ai-sensitiveWords-batchDel"],
          false
        ),
        editBtn: this.vaildData(
          this.permission["ai-sensitiveWords-edit"],
          false
        ),
        importData: this.vaildData(
          this.permission["ai-sensitiveWords-import"],
          false
        ),
        exportData: this.vaildData(
          this.permission["ai-sensitiveWords-export"],
          false
        ),
      };
    },
  },
  data() {
    const self = this;
    return {
      downUrl: `${baseURL}/template/aiNlpSensitive.xls`,
      dialog: {
        title: this.$t("aicosCommin.addBtn"),
        dialogVisible: false,
        sensitiveWord: null,
        row: null,
        excluded: "0",
      },
      importForm: {},
      importDialogVisible: false,
      selectionList: [],
      loading: true,
      curAiAppId: "",
      page: {
        size: 10,
        pageSizes: [10, 30, 50, 100, 200],
        current: 1,
        total: 0,
      },
      query: {},
      data: [],
      searchForm: {
        sensitiveWord: "",
      },
      searchFieldList: [
        {
          prop: "sensitiveWord",
          placeholder:
            this.$t("aicosCommon.pleaseInput") +
            this.$t("aiCenter.sensitiveWords.sensitiveWord"),
        },
      ],
      option: {
        // title: "敏感词列表",
        tip: false,
        header: false,
        align: "left",
        // index: true,
        border: true,
        menuAlign: "center",
        addBtnText:
          this.$t("aicosCommon.add") +
          this.$t("aiCenter.sensitiveWords.sensitiveWord"),
        excelBtn: false,
        excelBtnText: this.$t("aicosCommon.exportAll"),
        selection: true,
        searchSpan: 8,
        searchMenuSpan: 4,
        menuWidth: 150,
        rowKey: "id",
        addBtn: false,
        delBtn: false,
        editBtn: false,
        searchMenuPosition: "left",
        dialogWidth: "40%",
        dialogType: "drawer",
        dialogCustomClass: "huilan-drawer-form",
        emptyText: this.$t("aicosCommon.notData"),
        column: [
          {
            label: this.$t("aiCenter.sensitiveWords.sensitiveWord"),
            prop: "sensitiveWord",
            // search: true,
            searchSpan: 6,
            type: "textarea",
            searchLabelWidth: 60,
            span: 24,
            minlength: 1,
            maxlength: 200,
            labelWidth: 100,
            showWordLimit: true,
            rules: [
              {
                required: true,
                message:
                  this.$t("aicosCommon.pleaseInput") +
                  this.$t("aiCenter.sensitiveWords.sensitiveWord"),
                trigger: "blur",
              },
            ],
          },
          {
            label: this.$t("aiCenter.sensitiveWords.excludedOrNot"),
            prop: "excluded",
            type: "radio",
            span: 24,
            width: 150,
            dicData: [
              {
                label: this.$t("aicosCommon.noFiltration"),
                value: "1",
              },
              {
                label: this.$t("aicosCommon.filtration"),
                value: "0",
              },
            ],
            value: "0",
            rules: [
              {
                required: true,
                message:
                  this.$t("aicosCommon.pleaseSelect") +
                  this.$t("aiCenter.sensitiveWords.excludedOrNot"),
                trigger: "blur",
              },
            ],
          },
        ],
      },
      importFormOption: {
        menuBtn: false,
        column: [
          {
            label: this.$t("aicosCommon.uploadFiles"),
            prop: "file",
            type: "upload",
            loadText: this.$t("aiCenter.sensitiveWords.waitTip"),
            span: 24,
            accept: ".xls",
            labelWidth: 100,
            propsHttp: {
              url: "url",
              name: "name",
              res: "data",
            },
            action: `${baseURL}api/${ai}/aiNlpSensitive/importExcel`,
            data: {
              applicationId: self.curAiAppId,
              subapplicationId: "",
            },
          },
        ],
      },
    };
  },
  methods: {
    getRowActions(row) {
      const map = {
        viewBtn: {
          name: this.$t("aicosCommon.viewBtn"),
          command: "rowView",
        },
        editBtn: {
          name: this.$t("aicosCommon.editBtn"),
          command: "rowEdit",
        },
        delBtn: {
          name: this.$t("aicosCommon.delBtn"),
          command: "rowDel",
        },
      };
      const list = ["viewBtn"];
      if (baseURL.replace(/^\/+|\/+$/g, "").toLowerCase() == "aicos") {
        if (
          row.subapplicationId == null ||
          row.subapplicationId.toLowerCase() ==
            baseURL.replace(/^\/+|\/+$/g, "").toLowerCase() ||
          row.subapplicationId == ""
        ) {
          list.push("editBtn", "delBtn");
        }
      } else if (row.subapplicationId) {
        if (
          row.subapplicationId.toLowerCase() ==
          baseURL.replace(/^\/+|\/+$/g, "").toLowerCase()
        ) {
          list.push("editBtn", "delBtn");
        }
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
      const crud = this.$refs.crud;
      const cruddActions = ["rowView", "rowEdit", "rowDel"];
      if (cruddActions.includes(command)) {
        crud[command](row, index);
      } else {
        this[command](row, index);
      }
    },

    handleAdd() {
      this.$refs.crud.rowAdd();
    },
    configColumn() {
      this.$refs.crud.$refs.dialogColumn.columnBox = true;
    },
    pageList(params) {
      if (!this.curAiAppId) {
        this.$message.error(this.$t("aiCenter.sensitiveWords.appSelectTip"));
        return;
      }
      const parameter = {
        ...this.page,
        ...this.query,
        ...params,
        applicationId: this.curAiAppId,
      };
      listByPage(parameter).then((res) => {
        const data = res.data;
        if (data.success) {
          this.data = data.data.records;
          this.page.total = data.data.total;
          this.loading = false;
        } else {
          this.$message.error(data.msg);
        }
      });
    },
    rowSave(row, done, loading) {
      row = { ...row, applicationId: this.curAiAppId };
      // row = { ...row, applicationId: this.curAiAppId, subapplicationId: "" };
      save(row).then(
        (res) => {
          // this.onLoad(this.page);
          if (res.data.success) {
            this.$message({
              type: "success",
              message: this.$t("aicosCommon.successOperate"),
            });
            this.pageList({ applicationId: this.curAiAppId });
            done();
          } else {
            this.$message({
              type: "error",
              message: res.data.msg,
            });
            loading();
          }
        },
        (error) => {
          window.console.log(error);
          loading();
        }
      );
    },
    searchChange() {
      this.query = { ...this.searchForm };
      const serch = { ...this.query, current: 1 };
      this.pageList(serch);
    },
    searchReset() {
      this.query = {};
      this.page.current = 1;
      this.pageList({ current: 1 });
    },
    refreshChange() {
      this.query = {};
      this.pageList(this.query);
    },
    currentChange(currentPage) {
      this.page.current = currentPage;
      this.pageList({ current: currentPage, ...this.query });
    },
    sizeChange(pageSize) {
      this.page.size = pageSize;
      this.page.current = 1;
      this.pageList({ size: pageSize, ...this.query });
    },
    beforeOpen(done, type) {
      this.option.labelPosition =
        this.language != "zh" && type != "view" ? "top" : "right";

      done();
    },
    rowDel(data) {
      if (!this.curAiAppId) {
        this.$message.warning(this.$t("aiCenter.sensitiveWords.appEmptyTip"));
        return;
      }
      this.$confirm(this.$t("aicosCommon.mutiDeleteConfirmTip"), {
        confirmButtonText: this.$t("aicosCommon.confirmBtn"),
        cancelButtonText: this.$t("aicosCommon.cancelBtn"),
        type: "warning",
      }).then(() => {
        properDelete({ id: data.id, applicationId: this.curAiAppId }).then(
          () => {
            this.pageList();
            this.$message({
              type: "success",
              message: this.$t("aicosCommon.successOperate"),
            });
          }
        );
      });
    },
    rowUpdate(row, index, done, loading) {
      // eslint-disable-line
      row = { ...row, applicationId: this.curAiAppId };
      properUpdate(row).then(
        () => {
          this.$message({
            type: "success",
            message: this.$t("aicosCommon.successOperate"),
          });
          this.pageList();
          done();
        },
        (error) => {
          window.console.log(error);
          loading();
        }
      );
    },
    selectionChange(list) {
      this.selectionList = list.map((v) => {
        return v.id;
      });
    },
    deleteBatchs() {
      if (this.selectionList.length <= 0) {
        this.$message.warning(this.$t("aicosCommon.chooseDataTip"));
        return;
      }
      this.$confirm(this.$t("aicosCommon.mutiDeleteConfirmTip"), {
        confirmButtonText: this.$t("aicosCommon.confirmBtn"),
        cancelButtonText: this.$t("aicosCommon.cancelBtn"),
        type: "warning",
      }).then(() => {
        this.loading = true;
        deleteBatch({
          id: this.selectionList.join(","),
          applicationId: this.curAiAppId,
        }).then((res) => {
          const data = res.data;
          if (data.success) {
            this.pageList(this.query);
            this.$message.success(this.$t("aicosCommon.deleteSuccessTip"));
            this.loading = false;
          } else {
            this.$message.error(data.msg);
          }
        });
      });
    },
    exportExcel() {
      properExportExcel({ applicationId: this.curAiAppId }).then((res) => {
        const data = res.data;
        if (data.success) {
          const exportEx =
            baseURL.substr(0, baseURL.length - 1) + data.data.data.newFileName;
          this.downFile(exportEx);
          this.pageList(this.query);

          this.loading = false;
        } else {
          this.$message.error(data.msg);
        }
      });
    },
    saveImportData(file, fileLis) {
      console.log(file);
      console.log(fileLis);
    },
    uploadAfter(res, done) {
      this.$message.success(res);
      this.importDialogVisible = false;
      this.pageList(this.query);
      this.$refs.form.clearFiles();
      done();
    },
    add() {
      this.dialog.dialogVisible = true;
      this.dialog.title = this.$t("aicosCommon.addBtn");
      if (this.$refs["dialog"]) {
        this.$refs["dialog"].resetFields();
      }
      this.dialog.sensitiveWord = "";
    },
    submitForm(formName) {
      console.log("");
      const self = this;
      self.$refs[formName].validate((valid) => {
        if (valid) {
          let params = {
            sensitiveWord: self.dialog.sensitiveWord,
            excluded: self.dialog.excluded,
            applicationId: this.curAiAppId,
          };
          if (self.dialog.title === this.$t("aicosCommon.addBtn")) {
            save(params).then(
              (res) => {
                if (res.data.success) {
                  self.$message({
                    type: "success",
                    message: this.$t("aicosCommon.successOperate"),
                  });
                  self.pageList();
                } else {
                  self.$message({
                    type: "error",
                    message: res.data.msg,
                  });
                }
              },
              (error) => {
                window.console.log(error);
              }
            );
          } else {
            params = { ...self.dialog.row, ...params };
            properUpdate(params).then(
              () => {
                self.$message({
                  type: "success",
                  message: this.$t("aicosCommon.successOperate"),
                });
                self.pageList(self.page);
              },
              (error) => {
                window.console.log(error);
              }
            );
          }

          self.dialog.dialogVisible = false;
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    resetForm(formName) {
      this.$refs[formName].resetFields();
      this.dialog.dialogVisible = false;
    },
    closesClear() {
      this.resetForm("dialog");
    },
    edit(data) {
      this.dialog.dialogVisible = true;
      this.dialog.sensitiveWord = data.row.sensitiveWord;
      this.dialog.excluded = data.row.excluded;
      this.dialog.title = this.$t("aicosCommon.editBtn");
      this.dialog.row = data.row;
    },
    uploadBefore(file, done, loading) {
      const self = this;
      const fileNameAft = file.name.split(".").pop();
      self.importFormOption.column[0].data.applicationId = self.curAiAppId;
      new Promise((resolve, reject) => {
        if (fileNameAft === "xls") {
          setTimeout(() => {
            done();
            resolve();
          });
        } else {
          self.$message.error(this.$t("aiCenter.sensitiveWords.fileFormatTip"));
          loading();
          reject(false);
        }
      });
    },
  },
};
</script>

<style scoped lang="scss">
.sensitiveWords {
}
</style>
