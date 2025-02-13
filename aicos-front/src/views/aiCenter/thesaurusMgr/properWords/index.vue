<template>
  <ThesaurusBasic v-model="curAiAppId" class="properWords">
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
        v-if="permissionList.importBtn"
        type="primary"
        size="small"
        @click="importDialogVisible = true"
        >{{ $t("aicosCommon.import") }}</el-button
      >
      <el-button
        v-if="permissionList.exportBtn"
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
      :table-loading="loading"
      :data="data"
      :option="option"
      :page.sync="page"
      ref="crud"
      :permission="permissionList"
      :before-open="beforeOpen"
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
      :title="$t('aicosCommon.import') + $t('aiCenter.properWords.properWord')"
      append-to-body
      :visible.sync="importDialogVisible"
      width="30%"
    >
      <avue-form
        ref="form"
        v-model="importForm"
        :option="importFormOption"
        :upload-before="uploadBefore"
        :upload-after="uploadAfter"
      >
      </avue-form>
      <div>
        {{ $t("aiCenter.properWords.click")
        }}<a :href="downUrl" download
          ><span style="color: #409eff">{{
            $t("aicosCommon.downloadTemplate")
          }}</span></a
        >
        {{ $t("aiCenter.properWords.formatTip") }}
      </div>
      <template v-slot:footer>
        <el-button
          size="small"
          type="primary"
          @click="importDialogVisible = false"
          >{{ $t("aicosCommon.closeBtn") }}</el-button
        >
      </template>
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
  properExportExcel
} from "@/api/aiCenter/thesaurusMgr/properWords";
import ThesaurusBasic from "../components/thesaurusBasic";
import { mapGetters } from "vuex";
import { getRules } from "@/util/regx";
import { getDictItemListByDictCodeURL } from "@/api/common";
import { getDictItemListByDictCode } from "@/api/configure/application";
export default {
  name: "properWords",
  components: {
    ThesaurusBasic
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
          this.downUrl = `${baseURL}/template/aiNlpProper.xls`;
        } else if (newVal == "en") {
          this.downUrl = `${baseURL}/template/aiNlpProper_en.xls`;
        }
      },
      immediate: true
    }
  },
  computed: {
    ...mapGetters(["permission", "language"]),
    permissionList() {
      return {
        addBtn: this.vaildData(
          this.permission["ai-entity-properWords-add"],
          false
        ),
        viewBtn: true,
        delBtn: this.vaildData(
          this.permission["ai-entity-properWords-del"],
          false
        ),
        delBatchBtn: this.vaildData(
          this.permission["ai-entity-properWords-batch"],
          false
        ),
        editBtn: this.vaildData(
          this.permission["ai-entity-properWords-edit"],
          false
        ),
        importBtn: this.vaildData(
          this.permission["ai-entity-properWords-import"],
          false
        ),
        exportBtn: this.vaildData(
          this.permission["ai-entity-properWords-export"],
          false
        )
      };
    }
  },
  data() {
    const self = this;
    return {
      downUrl: `${baseURL}/template/aiNlpProper.xls`,
      importForm: {},
      importDialogVisible: false,
      selectionList: [],
      loading: true,
      curAiAppId: "",
      page: {
        size: 10,
        pageSizes: [10, 30, 50, 100, 200],
        current: 1,
        total: 0
      },
      query: {},
      data: [],
      option: {
        // title: "专有词列表",
        tip: false,
        align: "left",
        header: false,
        index: true,
        menuAlign: "center",
        addBtn: false,
        border: true,
        addBtnText: this.$t("aicosCommon.addBtn"),
        excelBtn: false,
        excelBtnText: this.$t("aicosCommon.exportAll"),
        menuWidth: 150,
        delBtn: false,
        editBtn: false,
        selection: true,
        searchSpan: 8,
        searchMenuSpan: 4,
        rowKey: "id",
        searchMenuPosition: "left",
        // labelWidth: 120,
        dialogWidth: "40%",
        dialogType: "drawer",
        emptyText: this.$t("aicosCommon.notData"),
        dialogCustomClass: "huilan-drawer-form",
        column: [
          {
            label: this.$t("aiCenter.properWords.properWord"),
            prop: "properWord",
            // search: true,
            type: "input",
            span: 24,
            searchLabelWidth: 60,
            labelWidth: 120,
            rules: [
              {
                required: true,
                message:
                  this.$t("aicosCommon.pleaseInput") +
                  this.$t("aiCenter.properWords.properWord"),
                trigger: "blur"
              },
              {
                min: 1,
                max: 50,
                message: this.$t("aiCenter.properWords.fiveLengthTip"),
                trigger: "blur"
              },
              ...getRules(["charNumHan"])
            ]
          },
          {
            label: this.$t("aiCenter.properWords.partOfSpeech"),
            prop: "properType",
            // search: true,
            span: 24,
            type: "select",
            dicUrl: getDictItemListByDictCodeURL,
            dicMethod: "post",
            width: 140,
            searchLabelWidth: 60,
            labelWidth: 120,
            dicQuery: {
              code: "ai-thesaurusMgr-properWords-speech"
            },
            props: {
              label: "name",
              value: "value"
            },
            rules: [
              {
                required: true,
                message:
                  this.$t("aicosCommon.pleaseSelect") +
                  this.$t("aiCenter.properWords.partOfSpeech"),
                trigger: "blur"
              }
            ]
          }
        ]
      },
      searchForm: {
        properWord: "",
        properType: ""
      },
      searchFieldList: [
        {
          prop: "properWord",
          placeholder:
            this.$t("aicosCommon.pleaseInput") +
            this.$t("aiCenter.properWords.properWord")
        },
        {
          prop: "properType",
          placeholder:
            this.$t("aicosCommon.pleaseSelect") +
            this.$t("aiCenter.properWords.partOfSpeech"),
          type: "select",
          dicData: []
        }
      ],
      importFormOption: {
        menuBtn: false,
        dialogWidth: "30%",
        column: [
          {
            label: this.$t("aicosCommon.uploadFiles"),
            prop: "file",
            type: "upload",
            loadText: this.$t("aiCenter.properWords.waitTip"),
            span: 24,
            accept: ".xls",
            labelWidth: 100,
            propsHttp: {
              url: "url",
              name: "name",
              res: "data"
            },
            action: `${baseURL}api/${ai}/aiNlpProper/importExcel`,
            data: {
              applicationId: self.curAiAppId,
              subapplicationId: ""
            }
          }
        ]
      }
    };
  },
  mounted() {
    getDictItemListByDictCode({
      code: "ai-thesaurusMgr-properWords-speech"
    }).then(res => {
      const data = res.data;
      if (data.success) {
        this.searchFieldList[1].dicData = data.data;
      }
    });
  },
  methods: {
    // onLoad() {
    // if (this.curAiAppId) {
    //   const params = { ...this.page, applicationId: this.curAiAppId };
    //   listByPage(params).then((res) => {
    //     const data = res.data;
    //     if (data.success) {
    //       this.data = data.data.records;
    //       this.loading = false;
    //     } else {
    //       this.$message.error(data.msg);
    //     }
    //   });
    // }
    // },
    getRowActions(row) {
      const map = {
        viewBtn: {
          name: this.$t("aicosCommon.viewBtn"),
          command: "rowView"
        },
        editBtn: {
          name: this.$t("aicosCommon.editBtn"),
          command: "rowEdit"
        },
        delBtn: {
          name: this.$t("aicosCommon.delBtn"),
          command: "rowDel"
        }
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

      list.forEach(item => {
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
        this.$message.error(this.$t("aiCenter.properWords.appSelectTip"));
        return;
      }
      const parameter = {
        ...this.page,
        ...this.query,
        ...params,
        applicationId: this.curAiAppId
      };
      listByPage(parameter).then(res => {
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
      save(row).then(
        res => {
          // this.onLoad(this.page);
          if (res.data.success) {
            this.$message({
              type: "success",
              message: this.$t("aicosCommon.successOperate")
            });
            this.pageList({ applicationId: this.curAiAppId });
            done();
          } else {
            this.$message({
              type: "error",
              message: res.data.msg
            });
            loading();
          }
        },
        error => {
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
      this.pageList(this.query);
    },
    currentChange(currentPage) {
      this.page.current = currentPage;
      this.pageList({ current: currentPage, ...this.query });
    },
    sizeChange(pageSize) {
      this.page.size = pageSize;
      this.page.current = 1;
      this.pageList({ size: pageSize, ...this.query, current: 1 });
    },
    rowDel(row, index, done) {
      if (!this.curAiAppId) {
        this.$message.warning(this.$t("aiCenter.properWords.appEmptyTip"));
        return;
      }
      this.$confirm(this.$t("aicosCommon.mutiDeleteConfirmTip"), {
        confirmButtonText: this.$t("aicosCommon.confirmBtn"),
        cancelButtonText: this.$t("aicosCommon.cancelBtn"),
        type: "warning"
      }).then(() => {
        properDelete({ id: row.id, applicationId: this.curAiAppId }).then(
          () => {
            this.pageList();
            this.$message({
              type: "success",
              message: this.$t("aicosCommon.successOperate")
            });
            done();
          }
        );
      });
    },
    rowUpdate(row, index, done, loading) {
      row = { ...row, applicationId: this.curAiAppId };
      properUpdate(row).then(
        () => {
          this.$message({
            type: "success",
            message: this.$t("aicosCommon.successOperate")
          });
          this.pageList();
          done();
        },
        error => {
          window.console.log(error);
          loading();
        }
      );
    },
    selectionChange(list) {
      this.selectionList = list.map(v => {
        return v.id;
      });
    },
    async beforeOpen(done, type) {
      this.option.labelPosition =
        this.language != "zh" && type != "view" ? "top" : "right";

      done();
    },
    deleteBatchs() {
      if (this.selectionList.length <= 0) {
        this.$message.warning(this.$t("aicosCommon.chooseDataTip"));
        return;
      }

      this.$confirm(this.$t("aicosCommon.mutiDeleteConfirmTip"), {
        confirmButtonText: this.$t("aicosCommon.confirmBtn"),
        cancelButtonText: this.$t("aicosCommon.cancelBtn"),
        type: "warning"
      }).then(() => {
        this.loading = true;
        deleteBatch({
          id: this.selectionList.join(","),
          applicationId: this.curAiAppId
        }).then(res => {
          this.$message.success(this.$t("aicosCommon.successOperate"));
          const data = res.data;
          if (data.success) {
            this.pageList(this.query);
            this.loading = false;
          } else {
            this.$message.error(data.msg);
          }
        });
      });
    },
    exportExcel() {
      properExportExcel({ applicationId: this.curAiAppId }).then(res => {
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
    importExcel(file, done, loading) {
      console.log(file);
      console.log(done);
      console.log(loading);
      //   properImportExcel(this.curAiAppId).then((res) => {
      //     const data = res.data;
      //     if (data.success) {
      //       this.pageList(this.query);
      //       this.loading = false;
      //     } else {
      //       this.$message.error(data.msg);
      //     }
      //   });
    },
    saveImportData(file, fileLis) {
      console.log(file);
      console.log(fileLis);
    },
    uploadBefore(file, done, loading) {
      const self = this;
      const fileNameAft = file.name.split(".").pop();
      new Promise((resolve, reject) => {
        self.importFormOption.column[0].data.applicationId = self.curAiAppId;
        if (fileNameAft === "xls") {
          setTimeout(() => {
            done();
            resolve();
          });
        } else {
          self.$message.error(this.$t("aiCenter.properWords.fileFormatTip"));
          loading();
          reject(false);
        }
      });
    },
    uploadAfter(res, done) {
      this.$message.success(res);
      this.importDialogVisible = false;
      this.pageList(this.query);
      if (this.$refs.form) {
        this.$refs.form.clearFiles();
      }
      done();
    }
  }
};
</script>

<style scoped lang="scss">
.properWords {
}
</style>
