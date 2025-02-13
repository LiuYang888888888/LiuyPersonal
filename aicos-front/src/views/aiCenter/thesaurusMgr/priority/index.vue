<template>
  <ThesaurusBasic v-model="curAiAppId">
    <HuilanBasicToolbar style="margin-top: 0">
      <el-button v-if="permissionList.addBtn" type="primary" size="small" @click="add">{{ $t('aicosCommon.addBtn') }}
      </el-button>
      <el-button v-if="permissionList.delBatchBtn" type="danger" size="small" @click="deleteBatchs">{{
        $t('aicosCommon.batchDeleteBtn') }}</el-button>
      <el-button v-if="permissionList.importData" type="primary" size="small" @click="importDialogVisible = true">{{
        $t('aicosCommon.import') }}</el-button>
      <el-button v-if="permissionList.exportData" type="primary" size="small" @click="exportExcel">{{
        $t('aicosCommon.exportAll') }}</el-button>
    </HuilanBasicToolbar>
    <HuilanBasicSearchbar :model="searchForm" :fields="searchFieldList" @reset="searchReset" @search="searchChange">
      <template v-slot:appendTool>
        <el-button type="default" @click="configColumn"><i class="el-icon-s-operation"></i></el-button>
      </template>
    </HuilanBasicSearchbar>
    <avue-crud class="priority" :table-loading="loading" :data="data" :option="option" :page.sync="page" ref="crud"
      @search-change="searchChange" @search-reset="searchReset" @refresh-change="refreshChange"
      @current-change="currentChange" @size-change="sizeChange" @selection-change="selectionChange">
      <template v-slot:menu="scope">
        <HuilanBasicActionTool :actions="getRowActions(scope.row)"
          @command="handleCommand($event, scope.row, scope.index)" />
      </template>
    </avue-crud>
    <HuilanDialog v-if="importDialogVisible" :title="$t('aiCenter.priority.importPriority')" append-to-body
      :visible.sync="importDialogVisible" width="30%">
      <avue-form ref="form" v-model="importForm" :option="importFormOption" :upload-after="uploadAfter"
        :upload-before="uploadBefore">
      </avue-form>
      <div>
        {{ $t("aiCenter.priority.click") }}<a :href="downUrl" download><span style="color: #409eff">{{
          $t("aicosCommon.downloadTemplate") }}</span></a>
        {{ $t('aiCenter.priority.formatTip') }}

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
        <!-- <el-form
        :model="dialog"
        ref="dialog"
        label-width="40px"
        class="demo-ruleForm"
        size="mini"
      >
        <el-form-item
          label="词"
          v-if="dialog.title === '新增'"
          prop="businessWord"
          :rules="[
            { required: true, message: '词不能为空' },
            {
              min: 1,
              max: 50,
              message: '长度在 1 到 50 个字符',
              trigger: 'blur',
            },
            {
              pattern: /^[A-Za-z0-9\u4E00-\u9FA5\r\n\>\s]+$/,
              message: '只允许输入字母，数字，汉字,回车,>,空格',
            },
            {
              validator: checkSameArrVal,
              trigger: 'blur'
            },
          ]"
        >
          <el-row>
            <el-tooltip class="item" effect="dark" placement="top">
              <div slot="content">
                1、同义词直接可用'回车'进行分隔，每行一个。<br />2、需要进行优先级可通过>进行实现。<br />例如：公司>办理
              </div>
              <el-col span="1"><i class="el-icon-info"></i></el-col>
            </el-tooltip>
            <el-col span="23">
              <el-input
                placeholder="请输入词，批量添加多个词请按回车"
                type="textarea"
                :autosize="{ minRows: 4 }"
                v-model="dialog.businessWord"
                autocomplete="off"
              ></el-input>
            </el-col>
          </el-row>
        </el-form-item>
        <el-form-item
          v-else
          label="词"
          prop="businessWord"
          :rules="[
            { required: true, message: '词不能为空' },
            {
              min: 1,
              max: 50,
              message: '长度在 1 到 50 个字符',
              trigger: 'blur',
            },
            {
              pattern: /^[A-Za-z0-9\u4E00-\u9FA5\>\s]+$/,
              message: '只允许输入字母，数字，汉字,回车,空格',
            },
            {
              validator: checkSameArrVal,
              trigger: 'blur'
            },
          ]"
        >
          <el-row>
            <el-tooltip class="item" effect="dark" placement="top">
              <div slot="content">
                1、需要进行优先级可通过>进行实现。<br />例如：公司>办理
              </div>
              <el-col span="1"><i class="el-icon-info"></i></el-col>
            </el-tooltip>
            <el-col span="23">
              <el-input
                type="input"
                v-model="dialog.businessWord"
                autocomplete="off"
              ></el-input>
            </el-col>
          </el-row>
        </el-form-item>
      </el-form> -->
        <div slot="footer" v-if='dialog.title != $t("aicosCommon.viewBtn")'>
          <el-button size="small" type="primary" :loading="lodingBtn" @click="submitForm('responseForm')">{{
            $t("aicosCommon.saveBtn") }}</el-button>
          <el-button @click="resetForm('responseForm')" size="small">{{ $t("aicosCommon.cancelBtn") }}</el-button>
        </div>
      </HuilanDialog>
    </div>

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
  aiNlpBusinessExportExcel,
} from "@/api/aiCenter/thesaurusMgr/priority";
import ThesaurusBasic from "../components/thesaurusBasic";
import { mapGetters } from "vuex";

import { checkSameTextareaSplit } from '@/util/qsgCommon.js';
import { getRules } from "@/util/regx";
const checkSameArrVal = (rule, value, callback) => {

  let res = checkSameTextareaSplit(value, '>');

  if (!res) {
    callback(new Error(this.$t("aiCenter.priority.duplicateValuesTip")));
  } else {
    callback();
  }

}

export default {
  name: "priority",
  components: {
    ThesaurusBasic,
  },
  watch: {
    curAiAppId (newVal) {
      if (newVal) {
        this.pageList({ applicationId: newVal });
      }
    },
    language: {
      handler: function(newVal) {
        if (newVal == "zh") {
          this.downUrl = `${baseURL}/template/aiNlpBusiness.xls`;
        } else if (newVal == "en") {
          this.downUrl = `${baseURL}/template/aiNlpBusiness_en.xls`;
        }
      },
      immediate: true
    }
  },
  computed: {
    ...mapGetters(["permission", "language"]),
    permissionList () {
      return {
        addBtn: this.vaildData(this.permission["ai-priority-add"], false),
        viewBtn: true,
        delBtn: this.vaildData(this.permission["ai-priority-del"], false),
        delBatchBtn: this.vaildData(
          this.permission["ai-priority-delBatch"],
          false
        ),
        editBtn: this.vaildData(this.permission["ai-priority-edit"], false),
        importData: this.vaildData(
          this.permission["ai-priority-import"],
          false
        ),
        exportData: this.vaildData(
          this.permission["ai-priority-export"],
          false
        ),
      };
    },
  },
  data () {
    return {
      checkSameArrVal: checkSameArrVal,
      downUrl: `${baseURL}/template/aiNlpBusiness.xls`,
      dialog: {
        title: this.$t("aicosCommon.addBtn"),
        dialogVisible: false,
        businessWord: null,
        row: null,
      },
      avueForm: {
      },
      lodingBtn: false,
      importForm: {},
      importDialogVisible: false,
      selectionList: [],
      loading: false,
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
        businessWord: "",
      },
      searchFieldList: [
        {
          prop: "businessWord",
          placeholder: this.$t("aicosCommon.pleaseInput") + this.$t("aiCenter.priority.word"),
        },
      ],
      option: {
        // title: "词优先级列表",
        tip: false,
        header: false,
        align: "left",
        border: true,
        index: true,
        menuAlign: "center",
        addBtn: false,
        addBtnText: this.$t('aicosCommon.addBtn'),
        excelBtn: false,
        delBtn: false,
        editBtn: false,
        selection: true,
        searchSpan: 8,
        searchMenuSpan: 6,
        menuWidth: 150,
        rowKey: "id",
        searchMenuPosition: "left",
        emptyText: this.$t('aicosCommon.notData'),
        column: [
          {
            label: this.$t("aiCenter.priority.word"),
            prop: "businessWord",
            // search: true,
            type: "textarea",
            searchLabelWidth: 30,
            searchSpan: 5,
            rules: [
              {
                required: true,
                message: this.$t("aicosCommon.pleaseInput") + this.$t("aiCenter.priority.word"),
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
            label: this.$t('aicosCommon.uploadFiles'),
            prop: "file",
            type: "upload",
            loadText: this.$t('aiCenter.priority.waitTip'),
            span: 24,
            accept: ".xls",
            propsHttp: {
              url: "url",
              name: "name",
              res: "data",
            },
            action: `${baseURL}api/${ai}/aiNlpBusiness/importExcel`,
            data: {
              applicationId: "",
              subapplicationId: "",
            },
          },
        ],
      },
      optionForm: {
        labelWidth: 100,
        submitBtn: false,
        emptyBtn: false,
        column: [
          {
            label: this.$t("aiCenter.priority.word"),
            prop: 'businessWord',
            type: 'textarea',
            span: 24,
            minlength: 1,
            maxlength: 50,
            display: true,
            showWordLimit: true,
            labelTip: this.$t("aiCenter.priority.oneBusinessWordTip"),
            rules: [{
              required: true,
              message: this.$t("aiCenter.priority.wordsEmptyTip"),
              trigger: "blur"
            },
            ...getRules(['charNumHanSEnterGt'])
            ]
          },
          {
            label: this.$t("aiCenter.priority.word"),
            prop: 'businessWord',
            span: 24,
            display: false,
            minlength: 1,
            maxlength: 50,
            showWordLimit: true,
            labelTip: this.$t("aiCenter.priority.twoBusinessWordTip"),
            rules: [{
              required: true,
              message: this.$t("aiCenter.priority.wordsEmptyTip"),
              trigger: "blur"
            },
            ...getRules(['charNumHanSEnterGt']),
            { validator: checkSameArrVal, trigger: 'blur' }
            ]
          }
        ]
      },
    };
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
    pageList (params) {
      const self = this;
      if (!this.curAiAppId) {
        this.$message.error(this.$t(""));
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
          self.data = data.data.records;
          self.loading = false;
          self.$nextTick(() => {
            self.page.total = data.data.total;
          })
        } else {
          self.$message.error(data.msg);
        }
      });
    },
    add () {
      this.dialog.dialogVisible = true;
      this.dialog.title = this.$t("aicosCommon.addBtn");
      // this.$refs["dialog"].resetFields();
      // this.dialog.businessWord = null;
      this.optionForm.column[1].display = false;
      this.optionForm.column[0].display = true;
      this.avueForm.businessWord = '';
    },
    searchChange () {
      this.query = { ...this.searchForm };
      const serch = { ...this.query, current: 1 };
      this.pageList(serch);
    },
    searchReset () {
      this.query = {};
      this.page.current = 1;
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
      this.pageList({ size: pageSize, current: 1, ...this.query });
    },

    rowDel (data) {
      if (!this.curAiAppId) {
        this.$message.warning(this.$t("aicCenter.priority.appEmptyTip"));
        return;
      }
      this.$confirm(this.$t("aicosCommon.mutiDeleteConfirmTip"), {
        confirmButtonText: this.$t("aicosCommon.confirmBtn"),
        cancelButtonText: this.$t("aicosCommon.cancelBtn"),
        type: "warning"
      }).then(() => {
        properDelete({ id: data.id, applicationId: this.curAiAppId }).then(
          () => {
            this.pageList();
            this.$message({
              type: "success",
              message: this.$t("aicosCommon.deleteSuccessTip"),
            });
          }
        );
      });
    },
    selectionChange (list) {
      this.selectionList = list.map((v) => {
        return v.id;
      });
    },
    deleteBatchs () {
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
          applicationId: this.curAiAppId,
        }).then((res) => {
          const data = res.data;
          if (data.success) {
            this.pageList(this.query);
            this.loading = false;
          } else {
            this.$message.error(data.msg);
          }
        });
      })

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
    uploadAfter (res, done) {
      this.$message.success(res);
      this.importDialogVisible = false;
      this.pageList(this.query);
      this.$refs.form.clearFiles();
      done();
    },
    submitForm (formName) {
      const self = this;
      this.lodingBtn = true;
      self.$refs[formName].validate((valid) => {
        if (valid) {
          let params = {
            businessWord: self.avueForm.businessWord,
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
                  self.pageList({ applicationId: self.curAiAppId });
                  self.lodingBtn = false;
                } else {
                  self.$message({
                    type: "error",
                    message: res.data.msg,
                  });
                  self.lodingBtn = false;
                }
              },
              (error) => {
                window.console.log(error);
                self.lodingBtn = false;
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
                self.pageList();
                self.lodingBtn = false;
              },
              (error) => {
                window.console.log(error);
                self.lodingBtn = false;
              }
            );
          }

          self.dialog.dialogVisible = false;
        } else {
          this.lodingBtn = false;
          console.log("error submit!!");
          return false;
        }
      });
    },
    resetForm (formName) {
      this.$refs[formName].resetFields();
      this.dialog.dialogVisible = false;
      this.lodingBtn = false;
    },
    closesClear () {
      this.resetForm("responseForm");
    },

    view (data) {

      this.dialog.dialogVisible = true;
      this.dialog.businessWord = data.businessWord.replace("&gt;", ">");
      this.dialog.title = this.$t('aicosCommon.viewBtn');
      this.dialog.row = data;
      this.avueForm.businessWord = data.businessWord.replace("&gt;", ">");
      this.optionForm.column[1].display = true;
      this.optionForm.column[1].disabled = true;
      this.optionForm.column[0].display = false;

    },
    edit (data) {
      this.dialog.dialogVisible = true;
      this.dialog.businessWord = data.businessWord.replace("&gt;", ">");
      this.dialog.title = this.$t("aicosCommon.editBtn");
      this.dialog.row = data;
      this.avueForm.businessWord = data.businessWord.replace("&gt;", ">");
      this.optionForm.column[1].display = true;
      this.optionForm.column[1].disabled = false;
      this.optionForm.column[0].display = false;
    },
    exportExcel () {
      aiNlpBusinessExportExcel({ applicationId: this.curAiAppId }).then(
        (res) => {
          const data = res.data;
          if (data.success) {
            const exportEx =
              baseURL.substr(0, baseURL.length - 1) +
              data.data.data.newFileName;
            this.downFile(exportEx);
            this.pageList(this.query);
            this.loading = false;
          } else {
            this.$message.error(data.msg);
          }
        }
      );
    },
    uploadBefore (file, done, loading) {
      const self = this
      const fileNameAft = file.name.split('.').pop()
      self.importFormOption.column[0].data.applicationId = self.curAiAppId
      new Promise((resolve, reject) => {
        if (fileNameAft === 'xls') {
          setTimeout(() => {
            done()
            resolve()
          })
        } else {
          self.$message.error(this.$t("aiCenter.priority.fileFormatTip"))
          loading()
          reject(false)
        }
      });
    },
  },
};
</script>

<style scoped lang="scss">
.el-icon-info {
  position: relative;
  left: -4px;
}

/deep/ .el-form-item__error {
  left: 20px;
}

/deep/ .avue-form__menu--center {
  display: none;
}
</style>
