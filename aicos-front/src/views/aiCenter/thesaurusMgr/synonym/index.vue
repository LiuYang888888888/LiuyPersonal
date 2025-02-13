<template>
  <ThesaurusBasic v-model="curAiAppId">
    <HuilanBasicToolbar style="margin-top: 0">
      <el-button v-if="permissionList.addBtn" type="primary" size="small" @click="handleAdd">{{ $t('aicosCommon.addBtn')
      }}</el-button>
      <el-button v-if="permissionList.delBatchBtn" type="danger" size="small" @click="batchDel">{{
        $t('aicosCommon.batchDeleteBtn') }}</el-button>
      <el-button type="primary" size="small" v-if="permissionList.importData" @click="importData">{{
        $t('aicosCommon.import') }}
      </el-button>
      <el-button type="primary" size="small" v-if="permissionList.exportData" @click="exportAll">{{
        $t('aicosCommon.exportAll') }}
      </el-button>
    </HuilanBasicToolbar>
    <HuilanBasicSearchbar :model="searchForm" :fields="searchFieldList" @reset="searchReset" @search="searchChange">
      <template v-slot:appendTool>
        <el-button type="default" @click="configColumn"><i class="el-icon-s-operation"></i></el-button>
      </template>
    </HuilanBasicSearchbar>
    <avue-crud class="npl" :option="option" :search.sync="query" :table-loading="loading" :data="data" ref="crud"
      v-model="form" :permission="permissionList" @row-del="rowDel" @row-update="rowUpdate" @row-save="rowSave"
      :before-open="beforeOpen" :page.sync="page" @selection-change="selectionChange" @current-change="currentChange"
      @size-change="sizeChange" @refresh-change="refreshChange" @on-load="onLoad">
      <template slot-scope="props" slot="synonymWord">
        <!-- <div>{{ props.row.synonymWord.replace("\n", ",") }}</div> -->
        <div>{{ synonymWordEach(props.row.synonymWord) }}</div>
      </template>
      <template v-slot:menu="scope">
        <HuilanBasicActionTool :actions="getRowActions(scope.row)"
          @command="handleCommand($event, scope.row, scope.index)" />
      </template>
    </avue-crud>
    <HuilanDialog :title="$t('aiCenter.synonym.importSynonyms')" append-to-body :visible.sync="importDialogVisible"
      width="600px">
      <avue-form ref="form" v-model="importForm" :option="importFormOption" :upload-after="uploadAfter"
        :upload-before="uploadBefore">
      </avue-form>
      <div>
        {{ $t("aiCenter.synonym.click") }}<a :href="downUrl" download><span style="color: #409eff">{{
          $t("aicosCommon.downloadTemplate") }}</span></a>
        {{ $t('aiCenter.synonym.formatTip') }}
      </div>
      <template v-slot:footer>
        <el-button size="small" type="primary" @click="importDialogVisible = false">{{
          $t('aicosCommon.closeBtn') }}</el-button>
      </template>
    </HuilanDialog>
  </ThesaurusBasic>
</template>

<script>
import ThesaurusBasic from "../components/thesaurusBasic";
import { baseURL } from "@/api/common";

import { getRules } from "@/util/regx";
import { mapGetters } from "vuex";
import {
  getList,
  remove,
  add,
  update,
  removeBatch,
  exportExcel,
} from "@/api/aiCenter/thesaurusMgr/synonym";
import serviceList from "@/config/serviceList";

const { ai } = serviceList;

export default {
  name: "synonym",
  components: {
    ThesaurusBasic,
  },
  data () {
    return {
      downUrl: `${baseURL}/template/aiNlpSynonym.xls`,
      entityId: "",
      curAiAppId: "",
      form: {
        // type: 'system'
      },
      query: {},
      loading: false,
      data: [],
      selectionList: [],
      page: {
        pageSize: 10,
        currentPage: 1,
        total: 0,
      },
      option: {
        header: false,
        tip: false,
        searchShow: true,
        searchMenuSpan: 6,
        addBtn: false,
        border: true,
        index: true,
        selection: true,
        viewBtn: false,
        editBtn: false,
        delBtn: false,
        refreshBtn: false,
        columnBtn: false,
        menuWidth: 150,
        dialogClickModal: false,
        labelWidth: 120,
        searchMenuPosition: "left",
        dialogWidth: "40%",
        dialogType: "drawer",
        dialogCustomClass: "huilan-drawer-form",
        emptyText: this.$t('aicosCommon.notData'),
        column: [
          {
            label: this.$t("aiCenter.synonym.synonym"),
            prop: "synonymWord",
            type: "textarea",
            span: 24,
            // search: true,
            showWordLimit: true,
            maxlength: 100,
            searchLabelWidth: 90,
            formslot: true,
            placeholder: this.$t("aiCenter.synonym.synonymsTip"),
            rules: [
              {
                required: true,
                message: this.$t("aicosCommon.pleaseInput") + this.$t("aiCenter.synonym.synonymName"),
                trigger: "blur",
              },
              ...getRules(["charNumHanEnterComma"]),
            ],
          },
        ],
      },
      searchForm: {
        synonymWord: "",
      },
      searchFieldList: [
        {
          prop: "synonymWord",
          placeholder: this.$t("aicosCommon.pleaseInput") + this.$t("aiCenter.synonym.synonymName"),
        },
      ],
      importDialogVisible: false,
      importForm: {},
      importFormOption: {
        menuBtn: false,
        column: [
          {
            label: this.$t("aicosCommon.uploadFiles"),
            prop: "file",
            type: "upload",
            loadText: this.$t("aiCenter.synonym.waitTip"),
            span: 24,
            labelWidth: 100,
            accept: ".xls",
            propsHttp: {
              url: "url",
              name: "name",
              res: "data",
            },
            action: `${baseURL}api/${ai}/aiNlpSynonym/importExcel`,
            showFileList: false,
            fileList: [],
            data: {
              applicationId: "",
              subapplicationId: "",
            },
          },
        ],
      },
    };
  },
  computed: {
    ...mapGetters(["permission", "language"]),
    permissionList () {
      return {
        addBtn: this.vaildData(this.permission["ai-synonym-save"], false),
        viewBtn: true,
        delBtn: this.vaildData(this.permission["ai-synonym-delete"], false),
        delBatchBtn: this.vaildData(
          this.permission["ai-synonym-delete-batch"],
          false
        ),
        editBtn: this.vaildData(this.permission["ai-synonym-update"], false),
        importData: this.vaildData(this.permission["ai-synonym-import"], false),
        exportData: this.vaildData(
          this.permission["ai-synonym-export-all"],
          false
        ),
      };
    },
  },
  watch: {
    curAiAppId () {
      this.searchReset();
      this.syncImportFormAppId();
    },
    language: {
      handler: function(newVal) {
        if (newVal == "zh") {
          this.downUrl = `${baseURL}/template/aiNlpSynonym.xls`;
        } else if (newVal == "en") {
          this.downUrl = `${baseURL}/template/aiNlpSynonym_en.xls`;
        }
      },
      immediate: true
    }
  },
  methods: {
    getRowActions (row) {
      const map = {
        viewBtn: {
          name: this.$t("aicosCommon.viewBtn"),
          command: "rowView",
        },
        editBtn: {
          name: this.$t('aicosCommon.editBtn'),
          command: "rowEdit",
        },
        delBtn: {
          name: this.$t('aicosCommon.delBtn'),
          command: "rowDel",
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
    rowSave (row, done, loading) {
      add(row).then(
        () => {
          // 获取新增数据的相关字段
          // const data = res.data.data;
          // row.id = data.id;
          this.$message({
            type: "success",
            message: this.$t('aicosCommon.successOperate'),
          });
          // 数据回调进行刷新
          this.onLoad(this.page);
          done();
        },
        (error) => {
          window.console.log(error);
          loading();
        }
      );
    },
    rowUpdate (row, index, done, loading) {
      update(row).then(
        () => {
          this.$message({
            type: "success",
            message: this.$t('aicosCommon.successOperate'),
          });
          // 数据回调进行刷新
          this.onLoad(this.page);
          done();
        },
        (error) => {
          window.console.log(error);
          loading();
        }
      );
    },
    rowDel (row, index, done) {
      this.$confirm(this.$t('aicosCommon.mutiDeleteConfirmTip'), {
        confirmButtonText: this.$t('aicosCommon.confirmBtn'),
        cancelButtonText: this.$t('aicosCommon.cancelBtn'),
        type: "warning",
      })
        .then(() => {
          return remove(row.id);
        })
        .then(() => {
          this.$message({
            type: "success",
            message: this.$t('aicosCommon.successOperate'),
          });
          // 数据回调进行刷新
          this.onLoad(this.page);
          done();
        });
    },
    batchDel () {
      if (this.selectionList.length === 0) {
        this.$message.warning(this.$t('aicosCommon.chooseDataTip'));
        return;
      }
      this.$confirm(this.$t('aicosCommon.mutiDeleteConfirmTip'), {
        confirmButtonText: this.$t('aicosCommon.confirmBtn'),
        cancelButtonText: this.$t('aicosCommon.cancelBtn'),
        type: "warning",
      })
        .then(() => {
          const ids = this.selectionList.map((item) => item.id);
          return removeBatch(ids.join());
        })
        .then(() => {
          this.onLoad(this.page);
          this.$message({
            type: "success",
            message: this.$t('aicosCommon.successOperate'),
          });
          this.$refs.crud.toggleSelection();
        });
    },


    beforeOpen (done, type) {
      this.option.labelPosition = this.language !== "zh" && type != 'view' ? "right" : "top";

      if (["add"].includes(type)) {
        this.form.applicationId = this.curAiAppId;
      }
      done();
    },
    searchReset () {
      this.query = {};
      // this.parentId = 0;
      this.onLoad(this.page);
    },
    searchChange () {
      this.query = this.searchForm;
      // this.parentId = '';
      this.page.currentPage = 1;
      this.onLoad(this.page, this.searchForm);
    },
    currentChange (currentPage) {
      this.page.currentPage = currentPage;
    },
    sizeChange (pageSize) {
      this.page.pageSize = pageSize;
    },
    refreshChange () {
      this.onLoad(this.page, this.query);
    },
    selectionChange (list) {
      this.selectionList = list;
    },
    selectionClear () {
      this.selectionList = [];
      this.$refs.crud.toggleSelection();
    },
    onLoad (page, params = {}) {
      if (this.curAiAppId === "") {
        return;
      }
      const pageConf = {
        applicationId: this.curAiAppId,
        current: page.currentPage,
        size: page.pageSize,
      };
      this.loading = true;
      getList(Object.assign(params, this.query, pageConf)).then((res) => {
        const data = res.data.data;
        this.loading = false;
        this.data = data.records;
        this.page.total = data.total;
        this.selectionClear();
      });
    },
    importData () {
      this.importDialogVisible = true;
    },
    syncImportFormAppId () {
      const uploadCol = this.importFormOption.column[0];
      uploadCol.data.applicationId = this.curAiAppId;
    },
    uploadAfter (res, done, loading /*,column*/) {
      loading();
      this.onLoad(this.page, this.query);
      this.importDialogVisible = false;
      this.$message.success(res);
      //console.log(done)
      this.refreshChange();
    },
    async exportAll () {
      const param = {
        applicationId: this.curAiAppId,
      };
      const {
        data: {
          data: {
            data: { newFileName: fileSrc },
          },
        },
      } = await exportExcel(param);
      // avue 提供的全局方法
      const exportEx = baseURL.substr(0, baseURL.length - 1) + fileSrc;
      this.downFile(exportEx);
    },
    synonymWordEach (data) {
      // for (let i = 0; i < data.length; i++) {
      //   console.log(data[i]);
      //   console.log(typeof data[i]);
      //   data[i].replace("\n", ",")
      // }
      const arr = data.split("\n");
      let str = "";
      let len = arr.length - 1;
      arr.map((v, i) => {
        if (len === i) {
          str += v;
        } else {
          str += v + "，";
        }
      });
      return str;
    },
    uploadBefore (file, done, loading) {
      const self = this
      const fileNameAft = file.name.split('.').pop()
      new Promise((resolve, reject) => {
        if (fileNameAft === 'xls') {
          done()
          resolve()
        } else {
          self.$message.error(this.$t("aiCenter.synonym.fileFormatTip"))
          loading()
          reject(false)
        }
      });
    },
  },
};
</script>

<style scoped lang="scss">
.synonym {}
</style>
