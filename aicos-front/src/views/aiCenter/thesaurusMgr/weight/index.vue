<template>
  <ThesaurusBasic v-model="curAiAppId">
    <HuilanBasicToolbar style="margin-top: 0">
      <el-button v-if="permissionList.addBtn" type="primary" size="small" @click="handleAdd">{{ $t("aicosCommon.addBtn")
      }}</el-button>
      <el-button v-if="permissionList.delBatchBtn" type="danger" size="small" @click="deleteBatchs">{{
        $t("aicosCommon.batchDeleteBtn") }}</el-button>
    </HuilanBasicToolbar>
    <HuilanBasicSearchbar :model="searchForm" :fields="searchFieldList" @reset="searchReset" @search="searchChange">
      <template v-slot:appendTool>
        <el-button type="default" @click="configColumn"><i class="el-icon-s-operation"></i></el-button>
      </template>
    </HuilanBasicSearchbar>
    <avue-crud class="weight" :table-loading="loading" :data="data" :option="option" :page.sync="page" ref="crud"
      :permission="permissionList" :before-open="beforeOpen" @row-save="rowSave" @search-change="searchChange"
      @search-reset="searchReset" @refresh-change="refreshChange" @current-change="currentChange"
      @size-change="sizeChange" @row-del="rowDel" @row-update="rowUpdate" @selection-change="selectionChange">
      <template v-slot:menu="scope">
        <HuilanBasicActionTool :actions="getRowActions(scope.row)"
          @command="handleCommand($event, scope.row, scope.index)" />
      </template>
    </avue-crud>
    <HuilanDialog title="导入敏感词" append-to-body :visible.sync="importDialogVisible" width="30%">
      <avue-form ref="form" v-model="importForm" :option="importFormOption" :upload-after="uploadAfter"
        :upload-before="uploadBefore">
      </avue-form>
      <div>
        {{ $t("aiCenter.weight.click") }}<a :href="downUrl" download><span style="color: #409eff">{{
          $t("aicosCommon.downloadTemplate") }}</span></a>
        {{ $t('aiCenter.weight.formatTip') }}

      </div>
      <!-- <template v-slot:footer>
        <el-button size="small" type="primary" @click="saveImportData"
          >确 定</el-button
        >
        <el-button size="small" @click="importDialogVisible = false"
          >取 消</el-button
        >
      </template> -->
    </HuilanDialog>
  </ThesaurusBasic>
</template>

<script>
import serviceList from "@/config/serviceList";
import { baseURL, getDictItemListByDictCodeURL } from "@/api/common";
const { ai } = serviceList;
import {
  save,
  listByPage,
  properDelete,
  properUpdate,
  deleteBatch
} from "@/api/aiCenter/thesaurusMgr/weight";
import ThesaurusBasic from "../components/thesaurusBasic";
import { getRules } from "@/util/regx";
import { mapGetters } from "vuex";
export default {
  name: "weight",
  components: {
    ThesaurusBasic
  },
  watch: {
    curAiAppId (newVal) {
      if (newVal) {
        this.pageList({ applicationId: newVal });
      }
    }
  },
  computed: {
    ...mapGetters(["permission", 'language']),
    permissionList () {
      return {
        addBtn: this.vaildData(this.permission["ai-weight-add"], false),
        viewBtn: true,
        delBtn: this.vaildData(this.permission["ai-weight-del"], false),
        delBatchBtn: this.vaildData(
          this.permission["ai-weight-delBatch"],
          false
        ),
        editBtn: this.vaildData(this.permission["ai-weight-edit"], false)
      };
    }
  },
  data () {
    return {
      downUrl: `${baseURL}/template/ai_thesaurusMgr_sensitive.xlsx`,
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
        // title: "敏感词列表",
        tip: false,
        header: false,
        align: "left",
        border: true,
        index: true,
        menuAlign: "center",
        addBtn: false,
        addBtnText: this.$t("aicosCommon.addBtn"),
        excelBtn: false,
        excelBtnText: this.$t("aicosCommon.exportAll"),
        delBtn: false,
        editBtn: false,
        menuWidth: 150,
        selection: true,
        searchMenuPosition: "left",
        searchSpan: 6,
        searchMenuSpan: 8,
        searchShow: true,
        rowKey: "id",
        dialogWidth: "40%",
        dialogType: "drawer",
        dialogCustomClass: "huilan-drawer-form",
        emptyText: this.$t('aicosCommon.notData'),
        column: [
          {
            label: this.$t('aiCenter.weight.word'),
            prop: "word",
            // search: true,
            searchLabelWidth: 30,
            type: "input",
            span: 24,
            editDisabled: true,
            rules: [
              {
                required: true,
                message: this.$t('aicosCommon.pleaseInput') + this.$t('aiCenter.weight.word'),
                trigger: "blur"
              },
              {
                min: 1,
                max: 50,
                message: this.$t('aiCenter.weight.fiveLengthTips'),
                trigger: "blur"
              },
              ...getRules(["charNumHan"])
            ]
          },
          {
            label: this.$t('aiCenter.weight.weight'),
            prop: "weight",
            search: false,
            type: "number",
            span: 24,
            width: 100,
            value: 0.01,
            maxRows: 1.0,
            minRows: 0.01,
            step: 0.01,
            precision: 2,
            rules: [
              {
                required: true,
                message: this.$t('aicosCommon.pleaseInput') + this.$t('aiCenter.weight.weight'),
                trigger: "blur"
              },
              ...getRules(["positiveDecimalTow"])
            ]
          },
          {
            label: this.$t('aiCenter.weight.type'),
            prop: "wordType",
            search: false,
            display: true,
            span: 24,
            width: 100,
            // hide: true,
            type: "select",
            dicUrl: getDictItemListByDictCodeURL,
            dicMethod: "post",
            dicQuery: {
              code: "ai-aiCenter-thesaurusMgr-pinyin-type"
            },
            value: "ManualEdit",
            props: {
              label: "name",
              value: "code"
            }
          }
          // {
          //   label: "创建时间",
          //   prop: "createTime",
          //   search: true,
          //   display: false,
          //   type: "daterange",
          //   format: "yyyy-MM-dd HH:MM:ss",
          //   valueFormat: "yyyy-MM-dd HH:MM:ss",
          // },
        ]
      },
      searchForm: {
        word: ""
      },
      searchFieldList: [
        {
          prop: "word",
          placeholder: this.$t('aicosCommon.pleaseInput') + this.$t('aiCenter.weight.word'),
        }
      ],
      importFormOption: {
        menuBtn: false,
        column: [
          {
            label: this.$t('aicosCommon.uploadFiles'),
            prop: "file",
            type: "upload",
            loadText: this.$t('aiCenter.weight.waitTip'),
            span: 24,
            labelWidth: 100,
            propsHttp: {
              url: "url",
              name: "name",
              res: "data"
            },
            action: `${baseURL}api/${ai}/aiNlpSynonym/importExcel`,
            data: {
              applicationId: "000000"
            }
          }
        ]
      }
    };
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
    getRowActions (row) {
      const map = {
        viewBtn: {
          name: this.$t("aicosCommon.viewBtn"),
          command: "rowView",
        },
        delBtn: {
          name: this.$t('aicosCommon.delBtn'),
          command: "rowDel",
        },
        editBtn: {
          name: this.$t("aicosCommon.editBtn"),
          command: "rowEdit",
        },
      };
      const list = ["viewBtn"];
      if (baseURL.replace(/^\/+|\/+$/g, '').toLowerCase() == 'aicos') {
        if (row.subapplicationId == null || row.subapplicationId.toLowerCase() == baseURL.replace(/^\/+|\/+$/g, '').toLowerCase() || row.subapplicationId == '') {
          list.push("editBtn", "delBtn")
        }
      } else if (row.subapplicationId) {
        if (row.subapplicationId.toLowerCase() == baseURL.replace(/^\/+|\/+$/g, '').toLowerCase()) {
          list.push("editBtn", "delBtn")
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
    handleCommand (command, row, index) {
      const crud = this.$refs.crud;
      const cruddActions = ["rowView", "rowEdit", "rowDel"];
      if (cruddActions.includes(command)) {
        crud[command](row, index);
      } else {
        this[command](row, index);
      }
    },
    handleAdd () {
      this.$refs.crud.rowAdd();
    },
    configColumn () {
      this.$refs.crud.$refs.dialogColumn.columnBox = true;
    },
    pageList (params) {
      if (!this.curAiAppId) {
        this.$message.error(this.$t("aicCenter.weight.appSelectTip"));
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
    rowSave (row, done, loading) {
      delete row.createTime;
      row = { ...row, applicationId: this.curAiAppId };
      save(row).then(
        res => {
          // this.onLoad(this.page);
          if (res.data.success) {
            this.$message({
              type: "success",
              message: this.$t("aicosCommon.deleteSuccessTip")
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
    searchChange () {
      this.query = { ...this.searchForm };
      const serch = { ...this.query, current: 1 };
      this.pageList(serch);
    },
    searchReset () {
      this.query = {};
      this.pageList({ current: 1 });
    },
    refreshChange () {
      this.pageList(this.query);
    },
    currentChange (currentPage) {
      this.page.current = currentPage;
      this.pageList({ current: currentPage, ...this.query });
    },
    sizeChange (pageSize) {
      this.page.size = pageSize;
      this.page.current = 1;
      this.pageList({ size: pageSize, ...this.query });
    },
    beforeOpen (done, type) {
      this.option.labelPosition = this.language != 'zh' && type != 'view' ? 'top' : 'right'

      done();
    },
    rowDel (row, index, done) {
      if (!this.curAiAppId) {
        this.$message.warning(this.$t("aicCenter.weight.appEmptyTip"));
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
              message: this.$t("aicosCommon.deleteSuccessTip")
            });
            done();
          }
        );
      });
    },
    rowUpdate (row, index, done, loading) {
      row = { ...row, applicationId: this.curAiAppId };
      properUpdate(row).then(
        () => {
          this.$message({
            type: "success",
            message: this.$t("aicosCommon.deleteSuccessTip")
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
    selectionChange (list) {
      this.selectionList = list.map(v => {
        return v.id;
      });
    },
    importExcel (file, done, loading) {
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
    saveImportData (file, fileLis) {
      console.log(file);
      console.log(fileLis);
    },
    uploadBefore (file, done, loading) {
      const self = this;
      const fileNameAft = file.name.split(".").pop();
      new Promise((resolve, reject) => {
        if (fileNameAft === "xls") {
          done();
          resolve();
        } else {
          self.$message.error(this.$t("aiCenter.weight.fileFormatTip"));
          loading();
          reject(false);
        }
      });
    },
    uploadAfter (res, done) {
      this.$message.success(res);
      this.importDialogVisible = false;
      done();
    },
    deleteBatchs () {
      if (this.selectionList.length <= 0) {
        this.$message.warning(this.$t('aicosCommon.chooseDataTip'));
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
          const data = res.data;
          if (data.success) {
            this.pageList(this.query);
            this.$message.success(this.$t('aicosCommon.deleteSuccessTip'));
            this.loading = false;
          } else {
            this.$message.error(data.msg);
          }
        });
      })

    }
  }
};
</script>

<style scoped lang="scss">
.weight {}
</style>
