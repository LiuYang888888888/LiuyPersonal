<template>
  <ThesaurusBasic v-model="curAiAppId">
    <HuilanBasicToolbar style="margin-top: 0">
      <el-button v-if="permissionList.addBtn" type="primary" size="small" @click="add">{{ $t('aicosCommon.addBtn')
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
    <avue-crud :option="option" class="participle" :search.sync="query" :table-loading="loading" :data="data" ref="crud"
      v-model="form" :permission="permissionList" :before-open="beforeOpen" :page.sync="page"
      @search-change="searchChange" @search-reset="searchReset" @selection-change="selectionChange"
      @current-change="currentChange" @size-change="sizeChange" @refresh-change="refreshChange" @on-load="onLoad">
      <template slot-scope="props" slot="disambiguationWord">
        <div>{{ props.row.disambiguationWord.replace("\n", ",") }}</div>
      </template>
      <template v-slot:menu="scope">
        <HuilanBasicActionTool :actions="getRowActions(scope.row)"
          @command="handleCommand($event, scope.row, scope.index)" />
      </template>
      <!-- <template scope="data" slot="menu">
        <el-button
          v-if="permissionList.editBtn"
          type="text"
          icon="el-icon-delete"
          size="small"
          @click="edit(data)"
          >编辑
        </el-button>
        <el-button
          v-if="permissionList.delBtn"
          type="text"
          icon="el-icon-delete"
          size="small"
          @click="rowDel(data)"
          >删除
        </el-button>
      </template> -->
    </avue-crud>
    <HuilanDialog :title="$t('aiCenter.participle.importSegmentation')" append-to-body :visible.sync="importDialogVisible"
      width="35%">
      <avue-form ref="form" v-model="importForm" :option="importFormOption" :upload-after="uploadAfter"
        :upload-before="uploadBefore">
      </avue-form>
      <div>
        {{ $t("aiCenter.participle.click") }}<a :href="downUrl" download><span style="color: #409eff">{{
          $t("aicosCommon.downloadTemplate") }}</span></a>
        {{ $t('aiCenter.participle.formatTip') }}
      </div>
      <template v-slot:footer>
        <el-button size="small" type="primary" @click="importDialogVisible = false">{{ $t("aicosCommon.closeBtn")
        }}</el-button>
      </template>
    </HuilanDialog>
    <div v-if="dialog.dialogVisible">
      <HuilanDialog :title="dialog.title" append-to-body :visible.sync="dialog.dialogVisible" width="30%"
        :before-close="closesClear">
        <avue-form :option="optionForm" v-model="avueForm" ref="responseForm"></avue-form>
        <template slot="footer" v-if='dialog.title != $t("aicosCommon.viewBtn")'>
          <el-button type="primary" size="small" @click="submitFormResponse">{{ $t("aicosCommon.saveBtn") }}</el-button>
          <el-button size="small" @click="resetFormCanl">{{ $t("aicosCommon.cancelBtn") }}</el-button>
        </template>
        <!-- <el-form
        :model="dialog"
        ref="dialog"
        label-width="120px"
        class="demo-ruleForm"
        size="mini"
      >
        <el-form-item
          label="分词消歧名称"
          v-if="dialog.title === '新增'"
          prop="disambiguationWord"
          :rules="[
            { required: true, message: '词不能为空' },
            {
              min: 1,
              max: 50,
              message: '长度在 1 到 50 个字符',
              trigger: 'blur',
            },
            {
              pattern: /^[A-Za-z0-9\u4E00-\u9FA5\r\n\s]+$/,
              message: '只允许输入字母，数字，汉字,回车,空格',
            },
          ]"
        >
          <el-input
            placeholder="请输入分词消歧名称，批量添加多个分词消歧名称请按回车"
            type="textarea"
            :autosize="{ minRows: 4 }"
            v-model="dialog.disambiguationWord"
            autocomplete="off"
          ></el-input>
        </el-form-item>
        <el-form-item
          v-else
          label="分词消歧名称"
          prop="disambiguationWord"
          :rules="[
            { required: true, message: '词不能为空' },
            {
              min: 1,
              max: 50,
              message: '长度在 1 到 50 个字符',
              trigger: 'blur',
            },
          ]"
        >
          <el-input
            type="input"
            v-model="dialog.disambiguationWord"
            autocomplete="off"
          ></el-input>
        </el-form-item>
        <el-form-item style="text-align: right">
          <el-button type="primary" sizi="small" @click="submitForm('dialog')"
            >保存</el-button
          >
          <el-button sizi="small" @click="resetForm('dialog')">取消</el-button>
        </el-form-item>
      </el-form> -->
      </HuilanDialog>
    </div>

  </ThesaurusBasic>
</template>

<script>
import ThesaurusBasic from "../components/thesaurusBasic";
import { baseURL } from "@/api/common";
import { getRules } from "@/util/regx";

import {
  getList,
  remove,
  add,
  update,
  removeBatch,
  exportExcel,
} from "@/api/aiCenter/thesaurusMgr/participle";
import serviceList from "@/config/serviceList";
const { ai } = serviceList;
import { mapGetters } from "vuex";
export default {
  name: "participle",
  components: {
    ThesaurusBasic
  },
  computed: {
    ...mapGetters(["permission", "language"]),
    permissionList () {
      return {
        addBtn: this.vaildData(this.permission["ai-participle-add"], false),
        viewBtn: true,
        delBtn: this.vaildData(this.permission["ai-participle-del"], false),
        delBatchBtn: this.vaildData(
          this.permission["ai-participle-delBatch"],
          false
        ),
        editBtn: this.vaildData(this.permission["ai-participle-edit"], false),
        importData: this.vaildData(
          this.permission["ai-participle-import"],
          false
        ),
        exportData: this.vaildData(
          this.permission["ai-participle-export"],
          false
        ),
      };
    },
  },
  data () {
    return {
      downUrl: `${baseURL}/template/aiNlpDisambiguation.xls`,
      avueForm: {
        disambiguationWord: '',
      },
      dialog: {
        title: this.$t("aicosCommon.addBtn"),
        dialogVisible: false,
        disambiguationWord: '',
        row: '',
      },
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
      optionForm: {
        labelWidth: 110,
        submitBtn: false,
        emptyBtn: false,
        column: [
          {
            label: this.$t('aiCenter.participle.disambiguationWord'),
            prop: 'disambiguationWord',
            type: 'input',
            span: 24,
            minlength: 1,
            maxlength: 50,
            display: false,

            showWordLimit: true,
            rules: [{
              required: true,
              message: this.$t('aiCenter.participle.wordsEmptyTip'),
              trigger: "blur"
            },
            ]
          },
          {
            label: this.$t('aiCenter.participle.disambiguationWord'),
            prop: 'disambiguationWord',
            type: 'textarea',
            span: 24,
            minRows: 4,
            display: true,
            minlength: 1,
            maxlength: 50,
            showWordLimit: true,
            rules: [{
              required: true,
              message: this.$t('aiCenter.participle.wordsEmptyTip'),
              trigger: "blur"
            },
            ...getRules(['charNumHanSEnter'])
            ]
          }
        ]
      },
      option: {
        tip: false,
        searchShow: true,
        searchMenuSpan: 6,
        border: true,
        index: true,
        selection: true,
        viewBtn: false,
        refreshBtn: false,
        columnBtn: false,
        menuWidth: 150,
        dialogClickModal: false,
        dialogWidth: "30%",
        labelWidth: 120,
        addBtn: false,
        delBtn: false,
        editBtn: false,
        header: false,
        searchMenuPosition: "left",
        emptyText :this.$t('aicosCommon.notData'),
        column: [
          {
            label: this.$t('aiCenter.participle.disambiguationWord'),
            prop: "disambiguationWord",
            type: "textarea",
            span: 24,
            // search: true,
            searchLabelWidth: 100,
            // editDisabled: true,
            showWordLimit: true,
            formslot: true,
            placeholder: this.$t('aiCenter.participle.disambiguationWordTip'),
            searchSpan: 6,
            rules: [
              {
                required: true,
                message: this.$t('aicosCommon.pleaseInput') + this.$t('aiCenter.participle.disambiguationWord'),
                trigger: "blur",
              },

            ],
          },
          {
            label: this.$t('aiCenter.participle.disambiguationWord'),
            prop: "disambiguationWord",
            type: "textarea",
            span: 24,
            // search: true,
            searchLabelWidth: 100,
            // editDisabled: true,
            showWordLimit: true,
            formslot: true,
            hide: true,
            placeholder: this.$t('aiCenter.participle.disambiguationWordTip'),
            searchSpan: 6,
            rules: [
              {
                required: true,
                message: this.$t('aicosCommon.pleaseInput') + this.$t('aiCenter.participle.disambiguationWord'),
                trigger: "blur",
              },
              ...getRules(["charNumHanSEnter"]),
            ],
          },
        ],
      },
      searchForm: {
        disambiguationWord: "",
      },
      searchFieldList: [
        {
          prop: "disambiguationWord",
          placeholder: this.$t('aicosCommon.pleaseInput') + this.$t('aiCenter.participle.disambiguationWord'),
        },
      ],
      importDialogVisible: false,
      importForm: {},
      importFormOption: {
        menuBtn: false,
        column: [
          {
            label: this.$t('aicosCommon.uploadFiles'),
            prop: "file",
            type: "upload",
            loadText: this.$t('aiCenter.participle.waitTip'),
            span: 24,
            labelWidth: 100,
            accept: ".xls",
            propsHttp: {
              url: "url",
              name: "name",
              res: "data",
            },
            action: `${baseURL}api/${ai}/aiNlpDisambiguation/importExcel`,
            showFileList: false,
            data: {
              applicationId: "",
              subapplicationId: "",
            },
          },
        ],
      },
    };
  },
  watch: {
    curAiAppId () {
      this.searchReset();
      this.syncImportFormAppId();
    },
    language: {
      handler: function(newVal) {
        if (newVal == "zh") {
          this.downUrl = `${baseURL}/template/aiNlpDisambiguation.xls`;
        } else if (newVal == "en") {
          this.downUrl = `${baseURL}/template/aiNlpDisambiguation_en.xls`;
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
          command: "view",
        },
        delBtn: {
          name: this.$t('aicosCommon.delBtn'),
          command: "rowDel",
        },
        editBtn: {
          name: this.$t("aicosCommon.editBtn"),
          command: "edit",
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

      this[command](row, index);

    },
    configColumn () {
      this.$refs.crud.$refs.dialogColumn.columnBox = true;
    },
    rowDel (data) {
      this.$confirm(this.$t("aicosCommon.mutiDeleteConfirmTip"), {
        confirmButtonText: this.$t("aicosCommon.confirmBtn"),
        cancelButtonText: this.$t("aicosCommon.cancelBtn"),
        type: "warning"
      })
        .then(() => {
          return remove(data.id);
        })
        .then(() => {
          this.$message({
            type: "success",
            message: this.$t('aicosCommon.successOperate'),
          });
          // 数据回调进行刷新
          this.onLoad(this.page);
          // done();
        });
    },
    batchDel () {
      if (this.selectionList.length === 0) {
        this.$message.warning(this.$t("aicosCommon.chooseDataTip"));
        return;
      }
      this.$confirm(this.$t("aicosCommon.mutiDeleteConfirmTip"), {
        confirmButtonText: this.$t("aicosCommon.confirmBtn"),
        cancelButtonText: this.$t("aicosCommon.cancelBtn"),
        type: "warning"
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
      this.query = { ...this.searchForm };
      this.page.currentPage = 1;
      this.onLoad(this.page);
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
      this.$message.success(res);
      this.importDialogVisible = false;
      this.refreshChange();
      //console.log(done)
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
    add () {
      this.optionForm.labelWidth = this.language !== 'zh' ? 180 : 120
      this.dialog.dialogVisible = true;
      this.dialog.title = this.$t('aicosCommon.addBtn');
      if (this.$refs["responseForm"]) {
        this.$refs["responseForm"].resetFields();
      }
      this.avueForm.disambiguationWord = '';
      this.optionForm.column[1].display = true;
      this.optionForm.column[0].display = false;
    },
    submitForm (formName) {
      const self = this;
      self.$refs[formName].validate((valid) => {
        if (valid) {
          let params = {
            disambiguationWord: self.dialog.disambiguationWord,
            applicationId: this.curAiAppId,
          };
          if (self.dialog.title === this.$t('aicosCommon.addBtn')) {
            add(params).then(
              (res) => {
                if (res.data.success) {
                  self.$message({
                    type: "success",
                    message: this.$t('aicosCommon.successOperate'),
                  });
                  self.onLoad(self.page);
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
            update(params).then(
              () => {
                self.$message({
                  type: "success",
                  message: this.$t('aicosCommon.successOperate'),
                });
                self.onLoad(self.page);
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
    resetForm (formName) {
      this.$refs[formName].resetFields();
      this.dialog.dialogVisible = false;
    },
    closesClear () {
      // this.resetForm("dialog");
      this.dialog.dialogVisible = false;
    },

    view (data) {
      this.optionForm.labelWidth = this.language !== 'zh' ? 180 : 120
      this.dialog.dialogVisible = true;
      this.dialog.disambiguationWord = data.disambiguationWord;
      this.dialog.title = this.$t('aicosCommon.viewBtn');
      this.dialog.row = data;
      this.avueForm.disambiguationWord = data.disambiguationWord
      this.optionForm.column[0].display = true;
      this.optionForm.column[0].disabled = true;
      this.optionForm.column[1].display = false;
    },
    edit (data) {
      this.optionForm.labelWidth = this.language !== 'zh' ? 180 : 120
      this.dialog.dialogVisible = true;
      this.dialog.disambiguationWord = data.disambiguationWord;
      this.dialog.title = this.$t('aicosCommon.editBtn');
      this.dialog.row = data;
      this.avueForm.disambiguationWord = data.disambiguationWord
      this.optionForm.column[0].display = true;
      this.optionForm.column[0].disabled = false;
      this.optionForm.column[1].display = false;
    },
    submitFormResponse () {
      const self = this;
      self.$refs["responseForm"].validate((valid) => {
        if (valid) {
          let params = {
            ...this.avueForm,
            applicationId: this.curAiAppId,
          };
          if (self.dialog.title === this.$t('aicosCommon.addBtn')) {
            add(params).then(
              (res) => {
                if (res.data.success) {
                  self.$message({
                    type: "success",
                    message: this.$t('aicosCommon.successOperate'),
                  });
                  self.dialog.dialogVisible = false;
                  self.onLoad(self.page);
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
            update(params).then(
              () => {
                self.$message({
                  type: "success",
                  message: this.$t('aicosCommon.successOperate'),
                });
                self.onLoad(self.page);
                self.dialog.dialogVisible = false;
              },
              (error) => {
                window.console.log(error);
              }
            );
          }

          self.responseDialog.dialogVisible = false;
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    resetFormCanl () {
      this.dialog.dialogVisible = false;
    },
    uploadBefore (file, done, loading) {
      const self = this
      const fileNameAft = file.name.split('.').pop()
      new Promise((resolve, reject) => {
        if (fileNameAft === 'xls') {
          done()
          resolve()
        } else {
          self.$message.error(this.$t("aiCenter.participle.fileFormatTip"))
          loading()
          reject(false)
        }
      });
    },
  },
};
</script>

<style scoped lang="scss">
.participle {}

/deep/ .avue-form__menu--center {
  display: none;
}
</style>
