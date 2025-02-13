<template>
  <HuilanBasic class="examList" :left-width="250">
    <template v-slot:left>
      <div class="page-view-left">
        <avue-tree
          class="left-tree-main"
          ref="treeRef"
          :key="treeKey"
          :option="treeOption"
          :data="treeData"
          @node-click="treeNodeClick"
          v-model="treeform"
        >
          <template v-slot="{ node, data }">
            <div class="left-tree-node">
              <div class="left-tree-node-label" :title="node.label">
                {{ node.label }}
              </div>
              <div v-if="treeCanHandle">
                <el-button-group class="left-tree-btns">
                  <el-button
                    class="btn"
                    type="primary"
                    size="mini"
                    icon="el-icon-plus"
                    title="新增"
                    v-if="permissionList.treeAddBtn"
                    @click.stop="addTreeNode(node, data)"
                  ></el-button>
                  <el-button
                    class="btn"
                    v-if="data.id !== '0' && permissionList.treeEditBtn"
                    type="primary"
                    size="mini"
                    icon="el-icon-edit"
                    title="编辑"
                    @click.stop="updateTreeNode(node, data)"
                  ></el-button>
                  <el-button
                    class="btn"
                    v-if="
                      data.id !== '0' &&
                      data.isLeaf != '0' &&
                      permissionList.treeDelBtn
                    "
                    type="primary"
                    size="mini"
                    icon="el-icon-delete"
                    title="删除"
                    @click.stop="delTreeNode(node, data)"
                  >
                  </el-button>
                </el-button-group>
              </div>
            </div>
          </template>
        </avue-tree>

        <QSGDrawer
          :title="treeFormTitle"
          :fullscreen="false"
          :size="640"
          append-to-body
          :visible.sync="treeFormTag"
          :wrapperClosable="false"
        >
          <avue-form
            ref="treeFormRef"
            :key="treeFormKey"
            :option="treeFormOption"
            v-model="treeFormData"
          ></avue-form>

          <template v-slot:footer>
            <el-button
              size="small"
              icon="el-icon-circle-check"
              type="primary"
              @click.stop="treeFormSave"
              >确 定</el-button
            >
            <el-button
              size="small"
              icon="el-icon-circle-close"
              @click.stop="treeFormClose"
              >取 消</el-button
            >
          </template>
        </QSGDrawer>
      </div>
    </template>
    <HuilanBasicToolbar style="margin-top: 0">
      <el-button
        type="primary"
        size="small"
        @click.stop="addRow"
        v-if="permissionList.addBtn"
        >{{ $t("aicosCommon.addBtn") }}</el-button
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
          v-if="permissionList.updateBtn"
          @click.stop="updateRow(scope.row, scope.index)"
          >编辑
        </el-button>
        <el-button
          type="text"
          size="small"
          :disabled="scope.row.quotedExamPublishStatus"
          @click.stop="designRow(scope.row, scope.index)"
          >设计
        </el-button>
        <el-button
          type="text"
          size="small"
          v-if="permissionList.copyBtn"
          @click.stop="copyRow(scope.row)"
          >复制
        </el-button>
        <el-button
          size="small"
          type="text"
          v-if="permissionList.deleteBtn"
          @click.stop="deleteRow(scope.row)"
          :disabled="scope.row.quotedExamPublishStatus"
          >删除</el-button
        >
      </template>
      <template slot-scope="{ row }" slot="randomQuestionnaire">
        <span v-if="row.randomQuestionnaire">开启</span>
        <span v-else>关闭</span>
      </template>
    </avue-crud>

    <HuilanDialog
      title="设计"
      :fullscreen="true"
      width="960px"
      append-to-body
      :visible.sync="examDesignTag"
      class="examDesign-dialog"
    >
      <avue-exam-design
        ref="examDesignRef"
        :key="examDesignKey"
        :options="examDesignOption"
        :treeList="treeList"
        @getBankList="getBankList"
        @getQuestionBankList="getQuestionBankList"
        @addtobank="addTobankFromDesign"
        @randomTopic="randomTopic"
        :bankData="bankData"
        :questionBankData="questionBankData"
        :contTypeByNumberData="contTypeByNumberData"
        :randomData="randomData"
      >
      </avue-exam-design>

      <template v-slot:footer>
        <!-- 
            v-if="
            (examDesignRow.isAutoPublic == 1 &&
              examDesignRow.publishStatus == 0) ||
            (examDesignRow.isAutoPublic == 0 &&
              examDesignRow.publishStatus == 0)
          "
         -->
        <el-button
          icon="el-icon-check"
          size="small"
          type="primary"
          :disabled="saveBtn"
          @click.stop="examDesignSave('design')"
          >保存设计
        </el-button>
        <!-- <el-button
          v-if="
            !(
              examDesignRow.isAutoPublic == 1 &&
              examDesignRow.publishStatus == 0
            )
          "
          icon="el-icon-check"
          size="small"
          type="primary"
          @click.stop="examDesignSave('publish')"
          >立即发布</el-button
        > -->
        <el-button icon="el-icon-close" size="small" @click="examDesignClose"
          >关闭</el-button
        >
      </template>
    </HuilanDialog>
  </HuilanBasic>
</template>
<script>
import "@/styles/qsgCommon.scss";

import {
  getTreeData,
  saveTreeData,
  updateTreeData,
  deleteTreeData,
} from "@/api/exam/exam/tree";
import {
  getList,
  delList,
  addList,
  updateList,
  getContTypeByCate,
  getListByCateIds,
  getRandomTopic,
} from "@/api/exam/exam/table";
import { mapGetters } from "vuex";
import { baseURL } from "@/api/common";

import QSGSearchBar from "@/components/QSGSearchBar/index";
import QSGDrawer from "@/components/QSGDrawer/index";
import ExamView from "@/components/ExamView/index";

import { isNull, getHtmlPlainText, findNodeByVal } from "@/util/qsgCommon";

import { makeFrontJsonByBackJson } from "./examPublic";

import OptOrgCommon from "@/views/optOrg/OptOrgCommon";

import { getList as getBankList } from "@/api/exam/bankList/table";
import { getTreeData as getTreeList } from "@/api/exam/bankList/tree";
import { deepClone } from "@/util/util";
import { getRules } from "@/util/regx";

export default {
  inject: ["desktopWindow", "desktop"],

  name: "ExamList",
  components: {
    QSGSearchBar,
    ExamView,
    OptOrgCommon,
    QSGDrawer,
  },
  computed: {
    ...mapGetters(["permission", "userInfo"]),
    permissionList() {
      return {
        treeAddBtn: this.vaildData(
          this.permission["exam-exam-treeSave"],
          false
        ),
        treeEditBtn: this.vaildData(
          this.permission["exam-exam-treeUpdate"],
          false
        ),
        treeDelBtn: this.vaildData(
          this.permission["exam-exam-treeDelete"],
          false
        ),
        addBtn: this.vaildData(this.permission[`exam-exam-save`], false),
        updateBtn: this.vaildData(this.permission[`exam-exam-update`], false),
        deleteBtn: this.vaildData(this.permission[`exam-exam-delete`], false),
        copyBtn: this.vaildData(this.permission[`exam-exam-copy`], false),
      };
    },
  },
  data() {
    return {
      saveBtn: false,
      // 树
      treeNodeIsLeaf: false,
      treeCanHandle: true,
      treeKey: 0,
      treeData: [
        {
          name: "试卷分类",
          id: "0",
          active: false,
          children: [],
        },
      ],
      treeOption: {
        filter: true,
        menu: false,
        addBtn: false,
        nodeKey: "id",
        props: {
          label: "name",
          children: "children",
          // 设置了value后getNode才能通过key获取节点
          value: "id",
        },
        defaultExpandedKeys: ["0"],
      },
      treeFormHandleType: "add",
      treeCurrentNode: {
        name: "试题分类",
        id: "0",
        active: false,
        children: [],
      },

      treeFormTag: false,
      treeFormTitle: "树表单",
      treeFormKey: 0,
      treeFormData: {},
      treeFormOption: {
        span: 24,
        menuBtn: false,
        column: [
          {
            label: "id",
            prop: "id",
            display: false,
          },
          {
            label: "父级Id",
            prop: "parentId",
            display: false,
          },
          {
            label: "节点名称",
            prop: "name",
            showWordLimit: true,
            maxlength: 50,
            rules: [
              {
                required: true,
                message: "请输入节点名称",
                trigger: "blur",
              },
              ...getRules(["charNumHan"]),
            ],
          },
        ],
      },
      //
      OptOrgDataView: false,

      winUrl: window.origin,
      dropdownTag: false,

      editTempData: {},
      searchFieldList: [
        {
          prop: "keyWords",
          placeholder: "请输入试卷名称",
        },
      ],
      searchForm: {},
      loading: true,
      page: {
        pageSize: 10,
        currentPage: 1,
        total: 0,
        pageSizes: [10, 20, 30, 40, 50, 100],
      },

      listForm: {},
      selectionList: [],
      query: {},
      listData: [],
      listOption: {
        header: false,
        tip: false,
        searchShow: false,
        border: false,
        // index: true,
        // selection: true,
        viewBtn: false,
        delBtn: false,
        editBtn: false,
        columnBtn: true,
        menuWidth: 200,
        dialogWidth: "40%",
        dialogType: "drawer",
        dialogClickModal: false,
        dialogCustomClass: "huilan-drawer-form",

        span: 24,
        labelWidth: 100,
        column: [
          {
            label: "ID",
            prop: "id",
            hide: true,
            disabled: true,
            display: false,
          },
          {
            label: "试卷名称",
            prop: "name",
            overHidden: true,
            showWordLimit: true,
            maxlength: 100,
            rules: [
              {
                required: true,
                message: "请输入试卷名称",
              },
              ...getRules(["notEnSpecials"]),
            ],
          },
          {
            label: "试卷分类",
            prop: "categoryId",
            type: "tree",
            span: 24,
            props: {
              label: "name",
              value: "id",
            },
            dicData: [],
            display: true,
            hide: true,
            rules: [
              {
                required: true,
                message: "请选择试卷分类",
              },
            ],
          },
          {
            label: "题目",
            prop: "subjectNum",
            display: false,
          },
          {
            label: "总分",
            prop: "totalScore",
            display: false,
          },
          {
            label: "随机选题",
            prop: "randomQuestionnaire",
            type: "radio",
            dicData: [
              {
                label: "开启",
                value: true,
              },
              {
                label: "关闭",
                value: false,
              },
            ],
            display: false,
          },
          {
            label: "创建人",
            prop: "createUser",
            display: false,
          },
          {
            label: "创建时间",
            prop: "createTime",
            display: false,
          },
        ],
      },

      examDesignRow: {},
      examDesignOption: {},
      examDesignTag: false,
      examDesignKey: 0,

      bankData: [],
      treeList: [
        {
          name: "试题分类",
          id: "0",
          children: [],
          disabled: true,
        },
      ],
      /*bankPage: {
        "pageSize": 10,
        "currentPage": 1,
        "total": 0,
        "pageSizes": [ 10, 20, 30, 40, 50, 100 ]
      },*/
      questionBankData: {
        records: [],
        size: 10,
        current: 1,
        total: 0,
      },
      contTypeByNumberData: [],
      randomData: [],
    };
  },
  methods: {
    successFun() {
      this.$message({
        type: "success",
        message: "操作成功",
      });
    },

    initTreeData() {
      let categoryId = this.findObject(this.listOption.column, "categoryId");
      getTreeData().then((res) => {
        const dataRes = res.data.data;
        this.treeData[0].children = dataRes || [];
        this.treeNodeCurrent();
        categoryId.dicData = dataRes || [];
        // this.treeKey++;
      });
    },
    treeNodeCurrent() {
      if (!isNull(this.treeCurrentNode)) {
        const ancestors = this.treeCurrentNode.ancestors || "0";
        this.treeOption.defaultExpandedKeys = ancestors.split(",");
        this.$nextTick(() => {
          this.$refs.treeRef.setCurrentKey(this.treeCurrentNode.id);
        });
      }
    },

    treeNodeClick(data) {
      // console.log("treeNodeClick", data, node, e);
      this.treeCurrentNode = { ...data };
      // console.log("treeNodeClick", this.treeCurrentNode);
      this.onLoad(this.page);
    },
    addTreeNode(node, data) {
      this.treeFormTitle = "新增";
      this.treeFormHandleType = "add";
      this.treeFormKey++;
      this.treeFormTag = true;
      this.treeFormData = {
        parentId: data.id,
        name: "",
        weight: "",
      };
    },
    updateTreeNode(node, data) {
      this.treeFormTitle = "树编辑";
      this.treeFormHandleType = "edit";
      this.treeFormKey++;
      this.treeFormTag = true;
      this.treeFormData = {
        id: data.id,
        parentId: data.parentId,
        name: data.name,
        weight: data.weight,
      };
    },
    delTreeNode(node, data) {
      this.$confirm("确定将选择的节点删除吗?", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          deleteTreeData({ ...data }).then(() => {
            this.treeCurrentNode = {
              id: data.parentId,
              ancestors: data.ancestors,
            };
            this.successFun();
            this.initTreeData();
          });
        })
        .catch(() => {
          window.console.log("操作已取消");
        });
    },

    treeFormSave() {
      this.$refs.treeFormRef.validate((valid, done) => {
        if (valid) {
          const dataParam = {
            ...this.treeFormData,
          };

          const componentFun = (param) => {
            return this.treeFormHandleType == "add"
              ? saveTreeData(param)
              : updateTreeData(param);
          };

          componentFun(dataParam).then((res) => {
            const dataRes = res.data.data;
            this.successFun();
            this.treeCurrentNode = dataRes;
            this.initTreeData();
            this.treeFormClose();
          });
          done();
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    treeFormClose() {
      this.treeFormTag = false;
    },
    domIsNull(data) {
      return isNull(data);
    },
    configColumn() {
      this.$refs.listRef.$refs.dialogColumn.columnBox = true;
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
          return delList({ id: row.id });
        })
        .then(() => {
          this.$message({
            type: "success",
            message: "操作成功",
          });
          this.refreshChange();
        });
    },

    rowSave(row, done, loading) {
      const defaultFrontJson = {
        column: [
          {
            type: "",
            typeExam: "htmlExam",
            onlyOne: true,
            label:
              "<p style=' text-align: center; font-size: 22px; font-weight: bold; color: #000;'>" +
              row.name +
              "</p>",
            labelPlus: true,
            prop: "examTitle",
            icon: "icon-richtext",
            span: 24,
            display: true,
            dataType: "string",
          },
          {
            type: "",
            typeExam: "htmlExam",
            onlyOne: true,
            label: "试卷描述<hr>",
            labelPlus: true,
            prop: "examRemark",
            icon: "icon-richtext",
            span: 24,
            display: true,
            dataType: "string",
          },
        ],
        score: 0,
        radioNum: 0,
        selectRadioNum: 0,
        radioScore: 0,
        estimateNum: 0,
        selectEstimateNum: 0,
        estimateScore: 0,
        checkboxNum: 0,
        selectCheckboxNum: 0,
        selectScore: 0,
        gapNum: 0,
        selectGapNum: 0,
        gapScore: 0,
        questionNum: 0,
        selectQuestionNum: 0,
        questionScore: 0,
        span: 24,
        labelPosition: "top",
        labelSuffix: " ",
        labelWidth: 120,
        gutter: 0,
        detail: false,
        menuBtn: false,
        submitBtn: false,
        submitText: "提交",
        emptyBtn: false,
        emptyText: "清空",
        menuPosition: "center",
        readonly: false,
        disabled: false,
        topicOutOfOrder: false,
        optionsOutOfOrder: false,
        examShowLabelIndex: true,
        examRandomStatus: false,
      };
      if (!this.validatenull(row.joinUserJson)) {
        let tempUserArr = row.joinUserJson.user || [];
        let tempUser = [];
        tempUserArr.map((item) => {
          tempUser.push(item.account);
        });

        // console.log(tempUser.join(','));
        row.accountIds = tempUser.join(",");

        let tempDeptArr = row.joinUserJson.dept || [];
        let tempDept = [];
        tempDeptArr.map((item) => {
          tempDept.push(item.id);
        });

        // console.log(tempDept.join(','));
        row.deptIds = tempDept.join(",");

        row.deptJson = JSON.stringify(row.joinUserJson);
      }
      delete row.createUser;
      delete row.createTime;
      const dataParam = {
        ...row,
        editorFrontJson: JSON.stringify(defaultFrontJson),
        editorBackJson: "",
      };
      addList(dataParam).then(
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
      //console.log( this.editTempData );
      if (row.name != this.editTempData.name) {
        //console.log('改标题啦');

        const titleColumn = {
          typeExam: "htmlExam",
          onlyOne: true,
          label:
            "<p style=' text-align: center; font-size: 22px; font-weight: bold; color: #000;'>" +
            row.name +
            "</p>",
          labelPlus: true,
          span: 24,
          display: true,
          dataType: "string",
          prop: "examTitle",
          showWordLimit: true,
        };

        let tempJson = JSON.parse(row.editorFrontJson);
        //console.log(tempJson);
        tempJson.column = tempJson.column.map((item) => {
          if (item.prop == "examTitle") {
            item = titleColumn;
          }
          return item;
        });

        //console.log(tempJson);

        row.editorFrontJson = JSON.stringify(tempJson);
      }
      if (!this.validatenull(row.joinUserJson)) {
        let tempUserArr = row.joinUserJson.user || [];
        let tempUser = [];
        tempUserArr.map((item) => {
          tempUser.push(item.account);
        });

        // console.log(tempUser.join(','));
        row.accountIds = tempUser.join(",");

        let tempDeptArr = row.joinUserJson.dept || [];
        let tempDept = [];
        tempDeptArr.map((item) => {
          tempDept.push(item.id);
        });

        // console.log(tempDept.join(','));
        row.deptIds = tempDept.join(",");

        row.deptJson = JSON.stringify(row.joinUserJson);
      }
      const dataParam = {
        ...row,
      };
      await updateList(dataParam).then(
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
    searchChange() {
      this.page.currentPage = 1;
      this.onLoad(this.page);
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
        this.initData(type);
        this.editTempData = this.deepClone(this.listForm);
        if (this.treeCurrentNode.id !== "0") {
          this.listForm.categoryId = this.treeCurrentNode.id;
        }
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

    onLoad(page) {
      this.loading = true;

      const dataParam = {
        ...this.searchForm,
        current: page.currentPage,
        size: page.pageSize,
        categoryId: this.validatenull(this.treeCurrentNode.id)
          ? "0"
          : this.treeCurrentNode.id,
      };

      getList(dataParam).then((res) => {
        const dataRes = res.data.data;
        this.page.total = dataRes.total;
        this.page.pageSize = dataRes.size;
        this.page.currentPage = dataRes.current;
        this.listData = dataRes.records;
        this.loading = false;
        // this.selectionClear();
      });
    },

    // pubulicRow(row, toStatus) {
    //   if (row.subjectNum < 1) {
    //     this.$message.error("请使用“设计”功能，为此问卷添加题目。");
    //     return false;
    //   }

    //   //const nowTime = dateFormat(Date.now());

    //   const dataParam = {
    //     id: row.id,
    //     publishStatus: toStatus,
    //     isAutoPublic: 0,
    //     //startTime: ( (row.isAutoPublic == 1 && toStatus == 1)? nowTime : row.startTime ),
    //     //endTime: ( (row.isAutoPublic == 1 && toStatus == 0)? nowTime : row.endTime ),
    //   };
    //   publishExamList(dataParam).then(
    //     () => {
    //       this.$message({
    //         type: "success",
    //         message: "操作成功",
    //       });
    //       this.refreshChange();
    //     },
    //     (error) => {
    //       window.console.log(error);
    //     }
    //   );
    // },
    // enableRow(row, toStatus) {
    //   const dataParam = {
    //     id: row.id,
    //     status: toStatus,
    //   };
    //   enableExamList(dataParam).then(
    //     () => {
    //       this.$message({
    //         type: "success",
    //         message: "操作成功",
    //       });
    //       this.refreshChange();
    //     },
    //     (error) => {
    //       window.console.log(error);
    //     }
    //   );
    // },

    copyRow(value) {
      let row = deepClone(value);
      row.id = "";
      row.name = row.name + "_复制";
      let editorFrontJson = deepClone(JSON.parse(row.editorFrontJson));
      editorFrontJson.column[0].label =
        '<p style=" text-align: center; font-size: 22px; font-weight: bold; color: #000;">' +
        row.name +
        "</p>";
      row.editorFrontJson = JSON.stringify(editorFrontJson);
      addList(row).then(
        () => {
          this.$message({
            type: "success",
            message: "操作成功",
          });
          this.onLoad(this.page);
        },
        (error) => {
          window.console.log(error);
        }
      );
    },

    designRow(row /*,index*/) {
      if (row.publishStatus == 1) {
        this.$confirm(
          "当前的问卷可能正在使用中，修改题目可能会导致正在提交的数据和已经提交的数据发生错误，确定要进入问卷设计界面？",
          {
            confirmButtonText: "确定",
            cancelButtonText: "取消",
            type: "warning",
          }
        ).then(() => {
          this.examDesignKey++;
          this.examDesignRow = row;
          this.examDesignOption = row.editorFrontJson;
          this.examDesignTag = true;
        });
      } else {
        this.examDesignKey++;
        this.examDesignRow = row;
        this.examDesignOption = isNull(row.editorFrontJson)
          ? "{column:[]}"
          : row.editorFrontJson;
        this.examDesignTag = true;
      }
      this.$nextTick(() => {
        this.getQuestionBankList({ current: 1, size: 10, categoryId: "0" });
      });
    },

    examDesignClose() {
      this.examDesignKey++;
      this.examDesignRow = {};
      this.examDesignOption = {};
      this.examDesignTag = false;
    },
    async examDesignSave(saveType) {
      const designData = await this.$refs.examDesignRef.getData();
      const columnNum = designData.column.length;
      let subjectNum = 0,
        totalScore = 0,
        radioScore = 0,
        checkboxScore = 0,
        estimateScore = 0,
        gapScore = 0,
        questionScore = 0,
        flag = false;

      if (columnNum < 3) {
        this.$message.error("题目设计不能为空。");
        return false;
      }
      designData.column.map((item) => {
        if (item.subjectType === 1) {
          radioScore = item.score;
        }
        if (item.subjectType === 2) {
          checkboxScore = item.score;
        }
        if (item.subjectType === 3) {
          estimateScore = item.score;
        }
        if (item.subjectType === 4) {
          gapScore = item.score;
        }
        if (item.subjectType === 5) {
          questionScore = item.score;
        }
        if (item.typeExam !== "htmlExam") {
          if (item.score === 0) {
            flag = true;
          }
        }
      });
      if (flag) {
        this.$message.error("试卷设置不完整，没有设置分值，请完善设计！");
        return false;
      }
      const newNameColumn = this.findObject(designData.column, "examTitle");
      let newName = "";
      if (!isNull(newNameColumn) && newNameColumn != -1) {
        newName = getHtmlPlainText(newNameColumn.label).substring(0, 100);
      }
      let arr = [],
        questionnaireSubjectAnswers = [];
      if (designData.examRandomStatus) {
        if (!this.validatenull(designData.selectRadioNum)) {
          arr.push({
            type: 1,
            total: designData.radioNum,
            random: designData.selectRadioNum,
          });
          subjectNum += designData.selectRadioNum;
          totalScore += Number(radioScore) * Number(designData.selectRadioNum);
        }
        if (!this.validatenull(designData.selectCheckboxNum)) {
          arr.push({
            type: 2,
            total: designData.checkboxNum,
            random: designData.selectCheckboxNum,
          });
          subjectNum += designData.selectCheckboxNum;
          totalScore +=
            Number(checkboxScore) * Number(designData.selectCheckboxNum);
        }
        if (!this.validatenull(designData.selectEstimateNum)) {
          arr.push({
            type: 3,
            total: designData.estimateNum,
            random: designData.selectEstimateNum,
          });
          subjectNum += designData.selectEstimateNum;
          totalScore +=
            Number(estimateScore) * Number(designData.selectEstimateNum);
        }
        if (!this.validatenull(designData.selectGapNum)) {
          arr.push({
            type: 4,
            total: designData.gapNum,
            random: designData.selectGapNum,
          });
          subjectNum += designData.selectGapNum;
          totalScore += Number(gapScore) * Number(designData.selectGapNum);
        }
        if (!this.validatenull(designData.selectQuestionNum)) {
          arr.push({
            type: 5,
            total: designData.questionNum,
            random: designData.selectQuestionNum,
          });
          subjectNum += designData.selectQuestionNum;
          totalScore +=
            Number(questionScore) * Number(designData.selectQuestionNum);
        }
      }
      designData.column.map((item) => {
        let obj = {
          answersText: [],
          questionnaireId: this.examDesignRow.id,
          scoreType: item.scoringRule,
          totalScore: item.score,
          subjectName: item.label,
          questionnaireName: this.examDesignRow.name,
          subjectId: item.prop,
        };
        if (item.typeExam === "radioExam" || item.typeExam === "estimateExam") {
          obj.answersText.push({
            answer: item.disChecked,
            score: item.score,
            label: item.label,
          });
          if (item.typeExam === "radioExam") {
            obj.subjectType = 1;
          } else {
            obj.subjectType = 3;
          }
        }
        if (item.typeExam === "checkboxExam") {
          obj.subjectType = 2;
          item.dicData.map((val) => {
            if (val.canChecked) {
              obj.answersText.push({
                answer: val.value,
                score: val.score,
                label: item.label,
              });
            }
          });
        }
        if (item.typeExam === "inputExam") {
          obj.subjectType = 4;
          // 是否大小写 1 按大小写，0 不按大小写
          obj.ifSensitive = item.ignoreCase ? 1 : 0;
          // 顺序是否一致 0 不按答案顺序，1 是按答案顺序
          obj.ifSort = item.orderStatus ? 1 : 0;
          item.dicData.map((val) => {
            obj.answersText.push({
              answer: val.label.replace(/\s/g, ""),
              score: val.score,
            });
          });
        }
        if (
          item.typeExam === "radioExam" ||
          item.typeExam === "estimateExam" ||
          item.typeExam === "checkboxExam" ||
          item.typeExam === "inputExam"
        ) {
          obj.answersText = JSON.stringify(deepClone(obj.answersText));
          questionnaireSubjectAnswers.push(obj);
        }
      });
      const dataParam = {
        id: this.examDesignRow.id,
        categoryId: this.examDesignRow.categoryId,
        editorFrontJson: JSON.stringify(designData),
        subjectNum: designData.examRandomStatus ? subjectNum : columnNum - 2,
        questionnaireSubjectAnswers,
        totalScore: designData.examRandomStatus ? totalScore : designData.score,
        randomBySubjectType: arr.length > 0 ? JSON.stringify(arr) : "",
        ifOptionRandomType: designData.optionsOutOfOrder ? 1 : 0,
        ifSubjectRandomType: designData.topicOutOfOrder ? 1 : 0,
        randomQuestionnaire: designData.examRandomStatus,
      };
      if (!isNull(newName)) {
        dataParam.name = newName;
      }

      if (saveType == "publish") {
        dataParam.publishStatus = 1;
      }
      this.saveBtn = true;

      await updateList(dataParam).then(
        (res) => {
          this.$message({
            message: res.data.msg,
          });
          this.examDesignTag = false;
          this.saveBtn = false;
          this.refreshChange();
        },
        (error) => {
          this.saveBtn = false;
          window.console.log(error);
        }
      );
    },

    openWinDowByRow(row, winUrl, menuPath) {
      if (this.desktop) {
        const menuAll = this.$store.state.user.menuAll;

        let menuData = {};

        let winCode = "ExamWin";
        if (winUrl == "/questionnaire/examDataAdd") {
          winCode = "ExamWinDataAdd";
          menuData = findNodeByVal(
            menuAll,
            "code",
            "questionnaire-dataAdd",
            "menuList"
          );
        } else if (winUrl == "/questionnaire/statistic") {
          winCode = "ExamWinStatistic";
          menuData = findNodeByVal(
            menuAll,
            "code",
            "questionnaire-statistic",
            "menuList"
          );
        }

        //console.log(menuData)

        const formWinParm = {
          ...menuData,
          menuName: "在线调查 【 " + row.questionnaireName + " 】",
          //imageUrl: 'menu-icon-img resource-center',
          //linkUrl: winUrl,
          query: {
            examId: row.id,
          },
          height: "100%",
          width: "100%",
        };

        const formWin = {
          visible: true,
          zIndex: this.desktop.winList.length + this.desktop.baseZindex,
          data: formWinParm,
          commonParm: winCode,
        };

        //删除已打开的comFormWin窗口
        if (
          this.desktop.winList.filter((item) => item.commonParm == winCode)
            .length > 0
        ) {
          this.desktop.winList = this.desktop.winList.filter(
            (item) => item.commonParm != winCode
          );
        }

        this.desktop.winList.push(formWin);
      } else {
        this.$router.push({
          path: menuPath,
          query: {
            examId: row.id,
          },
        });
      }
    },

    viewRow(row /*,index*/) {
      window.open(`${baseURL}#/exam/examDataAdd?examId=` + row.id);
    },
    // 题库试题
    getBankList(params) {
      this.$refs.examDesignRef.tagBankLoading(true);
      const dataParam = {
        ...params,
        keyWords: params.bankSubjectName,
      };
      getBankList(dataParam).then((res) => {
        const dataRes = res.data.data;

        const tempRes = dataRes.records.map((item) => {
          //导入的数据 editorFrontJson 可能为空 需要先转换一下
          if (isNull(item.editorFrontJson)) {
            item.editorFrontJson = makeFrontJsonByBackJson(item.editorBackJson);
          }
          return item;
        });
        this.bankData = {
          ...dataRes,
          records: tempRes,
        };

        this.$refs.examDesignRef.tagBankLoading(false);
      });
    },
    // 选题
    getQuestionBankList(obj) {
      let params = obj.params;
      if (obj.topicType === "1") {
        this.$refs.examDesignRef.getManualOperationLoading(true);
        getListByCateIds(params).then((res) => {
          const dataRes = res.data.data;

          const tempRes = dataRes.records.map((item) => {
            //导入的数据 editorFrontJson 可能为空 需要先转换一下
            if (isNull(item.editorFrontJson)) {
              item.editorFrontJson = makeFrontJsonByBackJson(
                item.editorBackJson
              );
            }
            return item;
          });
          this.questionBankData = {
            ...dataRes,
            records: tempRes,
          };

          this.$refs.examDesignRef.getManualOperationLoading(false);
        });
      }
      if (obj.topicType === "2") {
        getContTypeByCate(params).then((res) => {
          this.contTypeByNumberData = res.data.data;
        });
      }
    },
    // 系统抽题
    randomTopic(arr) {
      getRandomTopic(arr).then((res) => {
        this.randomData = res.data.data;
      });
    },

    initFormItemBySystem() {
      const siteIdColumn = this.findObject(this.listOption.group, "siteId");
      const examTypeColumn = this.findObject(
        this.listOption.group,
        "questionnaireType"
      );
      const joinUserTypeColumn = this.findObject(
        this.listOption.group,
        "joinUserType"
      );
      const isShowResultColumn = this.findObject(
        this.listOption.group,
        "isShowResult"
      );
      if (baseURL.includes("aicos")) {
        this.$set(siteIdColumn, "display", true);
        this.$set(examTypeColumn, "display", true);
        this.$set(joinUserTypeColumn, "display", true);
        this.$set(isShowResultColumn, "display", true);
      } else {
        this.$set(siteIdColumn, "display", false);
        this.$set(examTypeColumn, "display", false);
        this.$set(joinUserTypeColumn, "display", false);
        this.$set(isShowResultColumn, "display", false);
      }
    },

    // addTobankFromDesign(bankType, dataParam) {
    //   //console.log(bankType,dataParam)

    //   let optionItem = [];
    //   if (dataParam.dicData) {
    //     dataParam.dicData.map((item) => {
    //       optionItem.push(getHtmlPlainText(item.label).substring(0, 200));
    //     });
    //   }
    //   let subjectType = 6;

    //   switch (dataParam.typeExam) {
    //     case "radioExam":
    //       subjectType = 1;
    //       break;
    //     case "checkboxExam":
    //       subjectType = 2;
    //       break;
    //     case "selectExam":
    //       subjectType = 3;
    //       break;
    //     case "inputExam":
    //       subjectType = 4;
    //       break;
    //     case "textareaExam":
    //       subjectType = 5;
    //       break;
    //     case "htmlExam":
    //       subjectType = 6;
    //       break;
    //     default:
    //   }

    //   let row = {
    //     bankSubjectName: getHtmlPlainText(dataParam.label).substring(0, 100),
    //     optionItem: optionItem,
    //     subjectType: subjectType,
    //   };

    //   const itemJson = makeApiJsonByDomitem(row);

    //   const params = {
    //     ...row,
    //     optionNum: itemJson.optionNum,
    //     bankSubjectType: bankType,
    //     editorFrontJson: JSON.stringify(itemJson.frontJson),
    //     editorBackJson: JSON.stringify(itemJson.backJson),
    //   };
    //   //console.log(params)

    //   addBankList(params).then(
    //     () => {
    //       this.$message({
    //         type: "success",
    //         message: "操作成功",
    //       });
    //     },
    //     (error) => {
    //       window.console.log(error);
    //     }
    //   );
    // },

    dropdownVisibleChange(e) {
      this.dropdownTag = e;
    },
    dropdownHide() {
      //console.log('this.dropdownHide();');
      this.dropdownTag = false;
    },
  },
  watch: {
    "listForm.startEndTime": {
      handler(val) {
        if (!isNull(val)) {
          this.listForm.startTime = val[0];
          this.listForm.endTime = val[1];
        }
      },
      immediate: true,
    },
    "listForm.repeateStartEndTime": {
      handler(val) {
        if (!isNull(val)) {
          this.listForm.repeateStartTime = val[0];
          this.listForm.repeateEndTime = val[1];
        }
      },
      immediate: true,
    },
  },

  mounted() {
    this.initTreeData();
    // 收起左侧菜单
    if (!this.$store.getters.isCollapse) {
      this.$store.commit("SET_COLLAPSE");
    }
    getTreeList().then((res) => {
      const dataRes = res.data.data;
      this.treeList[0].children = dataRes || [];
    });
    //this.initFormItemBySystem();
  },
};
</script>
<style lang="scss" scoped>
.repeatePeriod {
  width: 150px;
}
.repeatePeriodTips {
  margin-left: 10px;
  .link {
    margin-left: 10px;
  }
}

.pitchIn {
  display: flex;
  align-items: center;
  justify-self: start;
  width: 100%;
  .copyUrl {
    display: inline-block;
    width: 100%;
    overflow: hidden;
    text-overflow: ellipsis;
    cursor: pointer;
  }
  .copyBtn {
    width: 16px;
    margin-left: 8px;
    flex-shrink: 0;
  }
}
</style>

<style scoped lang="scss">
.left-tree-main {
  padding-bottom: 30px;
  ::v-deep .avue-tree__filter {
    padding: 20px 20px 0;
  }

  .left-tree-node {
    flex: 1;
    display: flex;
    width: 0;
    height: 100%;
    justify-content: space-between;
    align-items: center;
    > div:first-child {
      flex: 1;
      font-size: 14px;
      overflow: hidden;
      text-overflow: ellipsis;
      padding-right: 5px;
    }

    .left-tree-btns {
      display: none;
      padding-right: 5px;
      .btn {
        padding: 3px;
      }
    }
    &:hover {
      .left-tree-btns {
        display: flex;
      }
    }
  }
}
.examDesign-dialog {
  /deep/.el-dialog {
    position: relative;
  }
  /deep/ .el-dialog__body {
    height: calc(100% - 60px);
    padding: 0;
  }
  /deep/ .el-dialog__footer {
    position: absolute;
    top: 0px;
    right: 10px;
    background-color: #fff;
    padding: 12px 30px 10px;
  }
  /deep/ .el-dialog__footer .el-button {
  }
}
</style>
