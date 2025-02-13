<template>
  <HuilanBasic hasTab>
    <el-tabs v-model="bankType">
      <el-tab-pane label="我的题库" name="private"></el-tab-pane>
      <el-tab-pane label="共享题库" name="shared"></el-tab-pane>
    </el-tabs>
    <div class="inTab">
      <div class="bankList qsgMain">
        <HuilanBasicToolbar>
          <el-button
            type="primary"
            size="small"
            @click.stop="addRow"
            v-if="permissionList.addBtn"
            >新增题目</el-button
          >

          <el-button
            type="primary"
            size="small"
            @click.stop="batchAdd"
            v-if="permissionList.addBthBtn"
            >批量新增</el-button
          >

          <el-button
            type="success"
            size="small"
            @click.stop="batchIn"
            v-if="permissionList.inBtn"
            >导入题库</el-button
          >
          <el-button
            type="primary"
            size="small"
            @click.stop="batchOut"
            v-if="permissionList.outBtn"
            >导出题库</el-button
          >
          <el-button
            type="danger"
            size="small"
            @click.stop="batchDelete"
            v-if="permissionList.deleteBtn && bankType == 'private'"
            >批量删除</el-button
          >
        </HuilanBasicToolbar>

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
              v-if="
                permissionList.viewBtn &&
                bankType == 'shared' &&
                userInfo.account !== scope.row.bankSubjectOwnerAccount &&
                userInfo.isAdmin != 1
              "
              @click.stop="viewRow(scope.row, scope.index)"
              >查看
            </el-button>

            <el-button
              type="text"
              size="small"
              v-if="
                permissionList.updateBtn &&
                (userInfo.account === scope.row.bankSubjectOwnerAccount ||
                  userInfo.isAdmin == 1)
              "
              @click.stop="updateRow(scope.row, scope.index)"
              >编辑
            </el-button>
            <el-button
              type="text"
              size="small"
              v-if="
                permissionList.shareBtn &&
                (userInfo.account === scope.row.bankSubjectOwnerAccount ||
                  userInfo.isAdmin == 1) &&
                bankType == 'private'
              "
              @click.stop="shareRow(scope.row, scope.index)"
              >{{ scope.row.bankSubjectType == "shared" ? "取消共享" : "共享" }}
            </el-button>

            <el-button
              type="text"
              size="small"
              v-if="
                permissionList.deleteBtn &&
                (bankType == 'private' || userInfo.isAdmin == 1)
              "
              @click.stop="deleteRow(scope.row, scope.index)"
              >删除
            </el-button>
          </template>
        </avue-crud>
      </div>
    </div>

    <QSGDrawer
      :title="dataInTitle"
      :fullscreen="false"
      :size="600"
      append-to-body
      :visible.sync="dataInTag"
      :wrapperClosable="false"
    >
      <avue-form
        :class="inFormClass"
        :option="inFormOption"
        ref="inFormRef"
        v-model="inFormData"
        :key="inFormKey"
      >
        <template slot-scope="scope" slot="templateFile">
          <el-button
            type="primary"
            size="small"
            icon="el-icon-download"
            @click.stop="templateFileDown"
            >数据模板下载</el-button
          >
        </template>
        <template slot-scope="scope" slot="excelFile">
          <HuilanUploader
            class="upload-demo"
            v-model="inFormData.excelFile"
            :data="scope.column.data"
            :action="scope.column.action"
            :accept="scope.column.accept"
            :multiple="scope.column.multiple"
            :limit="scope.column.limit"
            :drag="scope.column.dragFile"
            :on-success="inFormUploadAfter"
            :on-error="inFormUploadError"
            :before-upload="inFormUploadBefore"
            :on-remove="inFormUploadRemove"
            :on-exceed="inFormUploadExceed"
          >
            <i class="el-icon-upload"></i>
            <div class="el-upload__text">
              将文件拖到此处，或<em>点击上传</em>
            </div>
            <div class="el-upload__tip" slot="tip">{{ scope.column.tip }}</div>
          </HuilanUploader>
        </template>

        <template slot-scope="scope" slot="analyseFile">
          <div>
            <div v-html="analyseFileRes"></div>
          </div>
        </template>
      </avue-form>

      <template v-slot:footer>
        <el-button
          size="small"
          icon="el-icon-circle-plus-outline"
          type="primary"
          @click.stop="dataInSave"
          >保 存</el-button
        >
        <el-button
          size="small"
          icon="el-icon-circle-close"
          @click.stop="dataInClose"
          >取 消</el-button
        >
      </template>
    </QSGDrawer>

    <QSGDrawer
      :title="addBthTitle"
      :fullscreen="false"
      :size="600"
      append-to-body
      :visible.sync="addBthTag"
      :wrapperClosable="false">
      <div
        v-for="(addForm, index) in addBthFormData"
        :key="'addBthForm_' + addBthFormKey + '_' + index"
        class="addBthFormMain"
      >
        <div class="addBthFormDel" v-if="addBthFormData.length > 1">
          <el-button
            size="small"
            icon="el-icon-delete-solid"
            type="danger"
            circle
            plain
            @click.stop="addBthDelForm(index)"
          ></el-button>
        </div>
        <avue-form
          class="addBthForm"
          :option="listOption"
          ref="addBthFormRef"
          v-model="addBthFormData[index]"
        ></avue-form>
      </div>

      <div class="addBthFormBtn">
        <el-button
          size="small"
          icon="el-icon-circle-plus-outline"
          type="success"
          @click.stop="addBthAddForm"
          >添加题目</el-button
        >
      </div>

      <template v-slot:footer>
        <el-button
          size="small"
          icon="el-icon-circle-plus-outline"
          type="primary"
          @click.stop="addBthSave"
          >保 存</el-button
        >
        <el-button
          size="small"
          icon="el-icon-circle-close"
          @click.stop="addBthClose"
          >取 消</el-button
        >
      </template>
    </QSGDrawer>
  </HuilanBasic>
</template>
<script>
import { mapGetters } from "vuex";
import QSGSearchBar from "@/components/QSGSearchBar/index";
import QSGDrawer from "@/components/QSGDrawer/index";
import HuilanUploader from "@/components/uploader";

import { baseURL } from "@/api/common";
import serviceList from "@/config/serviceList";
import { getRules } from "@/util/regx";

import {
  getBankList,
  addBankList,
  updateBankList,
  delBankList,
  outBankList,
  //inBankList,
  addBthBankList,
  inFinalBankList,
} from "@/api/questionnaire/index";

import { isNull /*checkArrayType*/ } from "@/util/qsgCommon.js";

import { makeApiJsonByDomitem, makeFrontJsonByBackJson } from "./qusnPublic.js";

export default {
  name: "BankList",
  components: {
    QSGSearchBar,
    QSGDrawer,
    HuilanUploader,
  },
  computed: {
    ...mapGetters(["userInfo", "permission"]),
    permissionList() {
      return {
        addBtn: this.vaildData(this.permission[`qusn-bank-add`], false),
        viewBtn: this.vaildData(this.permission[`qusn-bank-view`], false),
        updateBtn: this.vaildData(this.permission[`qusn-bank-update`], false),
        shareBtn: this.vaildData(this.permission[`qusn-bank-share`], false),
        deleteBtn: this.vaildData(this.permission[`qusn-bank-delete`], false),
        inBtn: this.vaildData(this.permission[`qusn-bank-in`], false),
        outBtn: this.vaildData(this.permission[`qusn-bank-out`], false),
        addBthBtn: this.vaildData(this.permission[`qusn-bank-addBatch`], false),
      };
    },
  },
  data() {
    return {
      addBthFormKey: 0,
      addBthTitle: "批量新增",
      addBthTag: false,
      addBthFormData: [],

      bankType: "private",

      optionsValid: true,

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

        dialogClickModal: false,
        dialogWidth: "30%",
        dialogType: "drawer",
        dialogCustomClass: "huilan-drawer-form",
        span: 24,
        labelWidth: 90,

        column: [
          {
            label: "ID",
            prop: "id",
            hide: true,
            disabled: true,
            display: false,
          },
          {
            label: "题目",
            prop: "bankSubjectName",
            overHidden: true,
            search: true,
            type: "textarea",
            minRows: 5,
            maxlength: 500,
            showWordLimit: true,
            rules: [
              {
                required: true,
                message: "请输入题目",
                trigger: "blur",
              },
              ...getRules(["notEnSpecials"]),
            ],
          },
          {
            label: "题目类型",
            prop: "subjectType",
            align: "center",
            width: 160,
            type: "select",
            search: true,
            searchType: "select",
            dicData: [
              { label: "单选题", value: 1 },
              { label: "多选题", value: 2 },
              { label: "下拉选择题", value: 3 },
              { label: "单行文本", value: 4 },
              { label: "多行文本", value: 5 },
              { label: "自定义", value: 6 },
            ],
            value: 1,
            rules: [
              {
                required: true,
                message: "请输入选择题目类型",
                trigger: "blur",
              },
            ],
            /*change:({value,column}) => {
              //console.log(value,column)
              const optionItemColumn = this.findObject(this.listOption.column, "optionItem");

              if( value == 1 || value == 2 || value == 3){
                this.$set(optionItemColumn,'display', true);
              }else{
                this.$set(optionItemColumn,'display', false);
              }

            },*/
            control: (val, form) => {
              //console.log(111,val,222,form)
              if (val && form.optionItem) {
                if (
                  ["add", "edit", "batchAdd"].includes(this.handlerType) &&
                  !isNull(val) &&
                  !isNull(form)
                ) {
                  if (val == 1 || val == 2 || val == 3) {
                    return {
                      optionItem: { display: true },
                    };
                  } else if (val == 4 || val == 5 || val == 6) {
                    return {
                      optionItem: { display: false },
                    };
                  } else {
                    return {};
                  }
                }
              } else {
                return {};
              }
            },
          },
          {
            label: "选项",
            prop: "optionItem",
            type: "array",
            hide: true,
            value: ["选项一"],
            /*rules: [
              {
                validator: (rule, value, callback)=>{
                  checkArrayType(rule, value, callback, 10, 200);
                },
                trigger: 'blur'
              },
            ],
            change:({value,column}) => {

            },*/
          },
          {
            label: "作者",
            prop: "createrRealName",
            overHidden: true,
            //hide: true,
            display: false,
            align: "center",
            width: 160,
            maxlength: 500,
            showWordLimit: true,
          },
          {
            label: "选项个数",
            prop: "optionNum",
            //hide: true,
            display: false,
            align: "center",
            width: 120,
          },

          {
            label: "共享类型",
            prop: "bankSubjectType",
            hide: true,
            display: false,
            width: 160,
            type: "select",
            dicData: [
              { label: "私有", value: "private" },
              { label: "共享", value: "shared" },
            ],
          },
          {
            label: "创建时间",
            prop: "createTime",
            display: false,
            align: "center",
            width: 160,
          },
        ],
      },

      dataInTitle: "导入数据",
      dataInTag: false,
      inFormClass: "",
      inFormKey: 0,
      inFormData: {},
      inFormOption: {
        submitBtn: false,
        emptyBtn: false,
        labelWidth: 120,
        labelPosition: "right",
        column: [
          {
            label: "下载数据模板",
            prop: "templateFile",
            span: 24,
            formslot: true,
          },
          {
            label: "选择文件",
            prop: "excelFile",
            span: 24,
            formslot: true,
            multiple: false,
            type: "upload",
            dragFile: true,
            data: {
              bankSubjectType: "private",
            },
            propsHttp: {
              url: "url",
              name: "name",
              res: "data",
            },
            accept: ".xls",
            //fileSize: 512,
            limit: 1,
            tip: "只能上传格式为xls的EXECL文件",
            action: `${baseURL}api/${serviceList.qusn}/questionBank/importExcel`,
            rules: [
              {
                required: true,
                message: "请上传数据文件",
                trigger: "blur",
              },
            ],
          },
          {
            label: "题目概况",
            prop: "analyseFile",
            span: 24,
            display: false,
            formslot: true,
          },
        ],
      },

      analyseFileData: [],
      analyseFileRes: "",
    };
  },
  methods: {
    configColumn() {
      this.$refs.listRef.$refs.dialogColumn.columnBox = true;
    },
    viewRow(row, index) {
      this.$refs.listRef.rowView(row, index);
    },
    addRow(/*row, index*/) {
      this.$refs.listRef.rowAdd();
    },
    updateRow(row, index) {
      this.$refs.listRef.rowEdit(row, index);
    },
    deleteRow(row /*, index*/) {
      this.$confirm("确定将选择数据删除?", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          return delBankList({ id: row.id });
        })
        .then(() => {
          this.$message({
            type: "success",
            message: "操作成功",
          });
          this.refreshChange();
        });
    },
    batchDelete() {
      if (this.selectionList.length == 0) {
        this.$message({
          type: "warning",
          message: "请选择需要处理的数据",
        });
      } else {
        this.$confirm(
          "确认是否删除 " + this.selectionList.length + " 条数据？",
          "提示",
          {
            confirmButtonText: "确定",
            cancelButtonText: "取消",
            type: "warning",
          }
        ).then(() => {
          const selectIds = this.selectionList.map((item) => item.id);

          delBankList({ id: selectIds.join() }).then(
            (/*res*/) => {
              this.refreshChange();
              this.$message({
                type: "success",
                message: "操作成功",
              });
            },
            (error) => {
              window.console.log(error);
            }
          );
        });
      }
    },
    /*updateStatusRow(row, index){

    },*/
    rowSave(row, done, loading) {
      //console.log( this.optionsValid )
      if (!this.optionsValid) {
        return false;
      }

      const itemJson = makeApiJsonByDomitem(row);

      const dataParam = {
        ...row,
        optionNum: itemJson.optionNum,
        bankSubjectType: this.bankType,
        editorFrontJson: JSON.stringify(itemJson.frontJson),
        editorBackJson: JSON.stringify(itemJson.backJson),
      };
      addBankList(dataParam).then(
        () => {
          //this.refreshChange();
          this.$message({
            type: "success",
            message: "操作成功",
          });
          done();
        },
        (error) => {
          window.console.log(error);
          loading();
        }
      );
    },
    async rowUpdate(row, index, done, loading) {
      const itemJson = makeApiJsonByDomitem(row);

      const dataParam = {
        ...row,
        optionNum: itemJson.optionNum,
        editorFrontJson: JSON.stringify(itemJson.frontJson),
        editorBackJson: JSON.stringify(itemJson.backJson),
      };

      await updateBankList(dataParam).then(
        () => {
          //this.refreshChange();
          this.$message({
            type: "success",
            message: "操作成功",
          });
          done();
        },
        (error) => {
          window.console.log(error);
          loading();
        }
      );
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
        bankSubjectType: this.bankType || "private",
      };

      getBankList(dataParam).then((res) => {
        const dataRes = res.data.data;
        this.page.total = dataRes.total;
        this.page.pageSize = dataRes.size;
        this.page.currentPage = dataRes.current;
        //this.listData = dataRes.records;

        this.listData = dataRes.records.map((item) => {
          //导入的数据 editorFrontJson 可能为空 需要先转换一下
          if (isNull(item.editorFrontJson)) {
            item.editorFrontJson = makeFrontJsonByBackJson(item.editorBackJson);
          }

          if (
            item.subjectType == 1 ||
            item.subjectType == 2 ||
            item.subjectType == 3
          ) {
            item.optionItem = this.makeOptionItem(item.editorFrontJson);
            //item.optionNum = item.optionItem.length;
          } else {
            item.optionNum = "-";
          }

          return item;
        });

        this.loading = false;
        this.selectionClear();
      });
    },
    shareRow(row) {
      const dataParam = {
        id: row.id,
        bankSubjectType:
          row.bankSubjectType == "private" ? "shared" : "private",
      };
      updateBankList(dataParam).then(
        () => {
          this.refreshChange();
          this.$message({
            type: "success",
            message: "操作成功",
          });
        },
        (error) => {
          window.console.log(error);
        }
      );
    },

    makeOptionItem(data) {
      //console.log(data);
      let res = [];
      let tempJson = JSON.parse(data);

      if (!isNull(tempJson)) {
        if (!isNull(tempJson.dicData)) {
          tempJson.dicData.map((item) => {
            res.push(item.label);
          });
        }
      }
      //console.log(res)
      return res;
    },

    batchIn() {
      //console.log("导入");

      this.dataInReset();

      this.inFormKey++;
      this.dataInTag = true;
    },
    dataInReset() {
      const excelFileColumn = this.findObject(
        this.inFormOption.column,
        "excelFile"
      );
      this.$set(excelFileColumn, "data", { bankSubjectType: this.bankType });

      const analyseFileColumn = this.findObject(
        this.inFormOption.column,
        "analyseFile"
      );
      this.$set(analyseFileColumn, "display", false);

      this.analyseFileData = [];
      this.analyseFileRes = "";
    },

    dataInSave() {
      if (isNull(this.analyseFileData)) {
        this.$message.error("文件分析结果内无有效题目，请检查后重新上传！");
        return false;
      }
      /*const dataParam = {
        'huilanQuestionBankSubjectList':  ,
      };*/
      inFinalBankList(this.bankType, this.analyseFileData).then(
        () => {
          this.dataInReset();
          this.dataInClose();
          this.refreshChange();
          this.$message({
            type: "success",
            message: "操作成功",
          });
        },
        (error) => {
          window.console.log(error);
        }
      );
    },
    dataInClose() {
      this.dataInTag = false;
    },
    analyseFileFun() {
      this.analyseFileData.map((item) => {
        if (isNull(item.editorFrontJson)) {
          item.editorFrontJson = makeFrontJsonByBackJson(item.editorBackJson);
        }
        return item;
      });

      let analyseResCount = {
        subjectType_1: {
          label: "单选题",
          value: 0,
        },
        subjectType_2: {
          label: "多选题",
          value: 0,
        },
        subjectType_3: {
          label: "下拉选择题",
          value: 0,
        },
        subjectType_4: {
          label: "单行文本",
          value: 0,
        },
        subjectType_5: {
          label: "多行文本",
          value: 0,
        },
        subjectType_6: {
          label: "自定义",
          value: 0,
        },
      };

      this.analyseFileRes = '<div class="analyseFileRes">';

      for (let key = 1; key < 7; key++) {
        let tempArr = this.analyseFileData.filter(
          (item) => item.subjectType == key
        );
        analyseResCount["subjectType_" + key].value = tempArr.length;
        if (tempArr.length > 0) {
          this.analyseFileRes +=
            "<div>" +
            analyseResCount["subjectType_" + key].label +
            " ( <span>" +
            tempArr.length +
            "</span> )</div>";
        }
      }

      this.analyseFileRes += "</div>";
    },

    inFormUploadAfter(response /*, file, fileList*/) {
      const analyseFileColumn = this.findObject(
        this.inFormOption.column,
        "analyseFile"
      );

      //console.log(response);
      if (response.success) {
        this.$message({
          type: "success",
          message: "成功分析出 " + response.data.length + "条 有效数据!",
        });

        this.$set(analyseFileColumn, "display", true);

        let analyseRes = response.data.map((item) => {
          let backJson = JSON.parse(item.editorBackJson);
          if (!isNull(backJson.dicData)) {
            backJson.dicData = backJson.dicData.filter(
              (info) => !isNull(info.label)
            );
          }

          return {
            ...item,
            optionNum: backJson.dicData.length,
            editorBackJson: JSON.stringify(backJson),
          };
        });

        //console.log(analyseRes);

        this.analyseFileData = analyseRes;

        this.analyseFileFun();

        //this.analyseFileRes = "附件分析结果";
      } else {
        this.$set(analyseFileColumn, "display", false);

        this.dataInReset();

        this.inFormKey++;

        this.$message({
          type: "error",
          message: "数据导入有误，请修正文件！",
        });
      }
    },

    inFormUploadRemove() {
      this.dataInReset();
    },
    inFormUploadExceed() {
      this.$message.error("最多同时上传分析一个文件！");
    },
    /*inFormUploadBefore(file){
      //console.log(file);
    },*/
    inFormUploadError(/*err, file, fileList*/) {
      //console.log(err, file, fileList);
      this.$message({
        type: "error",
        message: "上传过程中遇到错误！",
      });
    },
    templateFileDown() {
      this.downFile(`${baseURL}/template/AiCOS_Questionnaire_Bank.xls`);
    },

    batchOut() {
      const dataParam = {
        ...this.query,
        ...this.$refs.searchFormRef.getData(),
        bankSubjectType: this.bankType || "private",
      };
      //let fileName = this.formName+'_' + dateFormat(new Date(), 'ss_mm_hh_dd_MM_yyyy').toString() + '.xlsx';
      outBankList(dataParam).then(
        (res) => {
          const urlRes = `${baseURL}` + res.data.data.newFileName.substring(1);
          this.downFile(urlRes /*, fileName*/);

          this.refreshChange();
          this.$message({
            type: "success",
            message: "操作成功!",
          });
        },
        (error) => {
          window.console.log(error);
        }
      );
    },

    optionItemRulesDom(val, arrColumn) {
      //console.log(arrColumn);
      this.optionsValid = true;

      //const arrColumn =this.$refs.listRef.getPropRef('optionItem').$refs.temp.$children;

      arrColumn.map((item, index) => {
        //console.log(item,index)

        if (index % 3 == 1 && val.length == 10) {
          item.$el.className =
            " el-button el-button--primary el-button--small is-circle is-disabled";
          item.$el.disabled = true;
        } else if (index % 3 == 1) {
          item.$el.className =
            " el-button el-button--primary el-button--small is-circle ";
          item.$el.disabled = false;
        } else if (index % 3 == 0) {
          //console.log( item,index );

          /*三句重要*/
          /*item.$children[0].showWordLimit = true;
          item.$children[0].$slots.suffix  = true;
          item.$children[0].$attrs.maxlength = 29;*/

          /*item.$children[0].showWordLimit  = true;
          item.$children[0].$attrs.maxlength = 31;
          item.$children[0].type = 'text' ;
          item.$children[0].inputDisabled = false;
          item.$children[0].readonly  = false;
          item.$children[0].showPassword = false;*/
          if (item.$children.length == 0) {
            return false;
          }
          item.$children[0].value = item.$children[0].value.substring(0, 200);

          let textLength = item.$children[0].value.length;

          if (textLength > 200) {
            item.$el.className =
              "el-tooltip el-input el-input--small textLengthEro ";
            this.optionsValid = this.optionsValid && false;
          } else {
            item.$el.className = "el-tooltip el-input el-input--small";
            this.optionsValid = this.optionsValid && true;
          }

          let preHtml = document.createElement("span");
          preHtml.setAttribute("class", "el-input__suffix");

          let inHtml =
            '<span class="el-input__suffix-inner"><span class="el-input__count"><span class="el-input__count-inner">' +
            textLength +
            "/200</span></span></span>";
          preHtml.innerHTML = inHtml;

          let className = item.$children[0].className + " ";
          if (className.includes("hasSuffix")) {
            item.$el.lastChild.innerHTML = inHtml;
          } else {
            item.$children[0].className =
              "el-tooltip el-input el-input--small hasSuffix";
            item.$el.append(preHtml);
          }
        }
        return item;
      });
    },

    batchAdd() {
      this.addBthFormData = [];
      this.addBthAddForm();
      this.$set(this.listOption, "menuBtn", false);
      this.handlerType = "batchAdd";
      this.addBthTag = true;
      this.addBthFormKey++;
    },
    addBthSave() {
      //console.log(this.addBthFormData);

      if (!this.optionsValid) {
        return false;
      }

      // 表单校验
      const validateForm = (refName) => {
        return new Promise((resolve, reject) => {
          refName.validate((valid) => {
            if (valid) {
              resolve();
            } else {
              reject(new Error("表单验证错误"));
            }
          });
        });
      };

      const promiseList = this.$refs.addBthFormRef.map((item) => {
        return validateForm(item);
      });

      Promise.all(promiseList)
        .then(() => {
          let dataParam = [];
          this.addBthFormData.map((item) => {
            const itemJson = makeApiJsonByDomitem(item);

            dataParam.push({
              ...item,
              optionNum: itemJson.optionNum,
              bankSubjectType: this.bankType,
              editorFrontJson: JSON.stringify(itemJson.frontJson),
              editorBackJson: JSON.stringify(itemJson.backJson),
            });
          });

          addBthBankList(dataParam).then(
            () => {
              this.refreshChange();
              this.addBthClose();
              this.$message({
                type: "success",
                message: "操作成功",
              });
            },
            (error) => {
              window.console.log(error);
            }
          );
        })
        .catch(() => {
          this.$message.warning("表单验证未通过！");

          this.$refs.addBthFormRef.map((item) => {
            item.allDisabled = false;
          });
        });
    },
    addBthClose() {
      this.$set(this.listOption, "menuBtn", true);
      this.handlerType = "";
      this.addBthTag = false;
      this.addBthFormData = [];
      this.addBthFormKey++;
    },

    addBthAddForm() {
      this.addBthFormData.push({
        bankSubjectName: "",
        subjectType: 1,
        optionItem: ["选项一"],
      });
    },
    addBthDelForm(index) {
      this.addBthFormData.splice(index, 1);
    },
  },
  watch: {
    bankType: {
      handler() {
        this.page.currentPage = 1;
        this.refreshChange();
      },
      immediate: true,
    },

    "listForm.optionItem": {
      handler(val) {
        if (
          ["add", "edit", "batchAdd"].includes(this.handlerType) &&
          !isNull(val) &&
          (this.listForm.subjectType == 1 ||
            this.listForm.subjectType == 2 ||
            this.listForm.subjectType == 3)
        ) {
          if (val.length > 10) {
            val.splice(val.length - 1, 1);
          }

          this.$nextTick(() => {
            //console.log(this.$refs.listRef)
            const arrColumn =
              this.$refs.listRef.getPropRef("optionItem").$refs.temp.$children;
            this.optionItemRulesDom(val, arrColumn);
          });
        }
      },
      immediate: true,
    },

    addBthFormData: {
      handler(val) {
        if (val.length > 0) {
          val.map((item, index) => {
            //console.log(this.$refs.addBthFormRef[index])

            if (
              ["add", "edit", "batchAdd"].includes(this.handlerType) &&
              !isNull(item.optionItem) &&
              (item.subjectType == 1 ||
                item.subjectType == 2 ||
                item.subjectType == 3)
            ) {
              if (item.optionItem.length > 10) {
                item.optionItem.splice(item.optionItem.length - 1, 1);
              }
              this.$nextTick(() => {
                //console.log(this.$refs.addBthFormRef[index])
                const arrColumn =
                  this.$refs.addBthFormRef[index].getPropRef("optionItem").$refs
                    .temp.$children;
                this.optionItemRulesDom(val, arrColumn);
              });
            }

            return item;
          });
        }

        /*this.$nextTick(()=>{
          const arrColumn =this.$refs.listRef.getPropRef('optionItem').$refs.temp.$children;
          this.optionItemRulesDom(val,arrColumn);
        })*/
      },
      deep: true,
    },
  },
};
</script>

<style>
.textLengthEro .el-input__inner,
.textLengthEro.el-input__inner:focus {
  border: 1px solid #f05050;
}
.analyseFileRes {
  padding: 0 10px;
}
.analyseFileRes div {
  font-size: 14px;
  color: #565863;
}
.analyseFileRes div span {
  font-weight: 500;
  color: #f05050;
}

.addBthFormMain {
  position: relative;
  border-top: 2px solid #e4e7ed;
  padding-top: 15px;
}
.addBthFormDel {
  position: absolute;
  top: 15px;
  left: 10px;
  z-index: 9999;
}
.addBthFormBtn {
  text-align: center;
  padding: 18px;
  border-top: 2px solid #e4e7ed;
}
</style>
