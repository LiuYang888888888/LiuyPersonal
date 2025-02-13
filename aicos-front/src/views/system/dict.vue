<template>
  <HuilanBasic>
    <!-- <el-card class="box-card"> -->
    <!-- <div slot="header" class="clearfix">
        <span>字典列表</span>
      </div> -->
    <HuilanBasicToolbar style="margin-top: 0">
      <el-button
        v-if="permissionList.addBtn"
        type="primary"
        size="small"
        @click="handleAdd"
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
    <div class="clearfix">
      <avue-crud
        :option="optionParent"
        :table-loading="loading"
        :data="dataParent"
        :page.sync="pageParent"
        ref="crud"
        v-model="formParent"
        :permission="permissionList"
        :before-open="beforeOpen"
        @row-del="rowDel"
        @row-update="rowUpdate"
        @row-save="rowSave"
        @selection-change="selectionChange"
        @current-change="currentChange"
        @size-change="sizeChange"
        @refresh-change="refreshChange"
        @on-load="onLoadParent"
      >
        <template v-slot:menu="scope">
          <HuilanBasicActionTool
            :actions="getRowActions(scope.row)"
            @command="handleCommand($event, scope.row, scope.index)"
          />
        </template>
        <!-- <template slot-scope="scope" slot="menu">
            <el-button
              type="text"
              icon="el-icon-setting"
              size="small"
              v-if="permissionList.dictItemMgr"
              @click.stop="dictItemMgr(scope.row, scope.index)"
              >字典项管理
            </el-button>
          </template> -->
      </avue-crud>
    </div>
    <!-- </el-card> -->
    <HuilanDialog
      :title="`[${dictName}]${this.$t('system.dict.dict')}`"
      append-to-body
      :visible.sync="dictItemDialogVisible"
      width="900px"
      @opened="handleDicItemDialogOpened"
    >
      <avue-crud
        :option="optionChild"
        :table-loading="loadingChild"
        :data="dataChild"
        :page.sync="pageChild"
        ref="crudChild"
        v-model="formChild"
        :permission="childPermissionList"
        :before-open="beforeOpenChild"
        @row-del="rowDelChild"
        @row-update="rowUpdateChild"
        @row-save="rowSaveChild"
        @search-change="searchChangeChild"
        @search-reset="searchResetChild"
        @selection-change="selectionChangeChild"
        @current-change="currentChangeChild"
        @size-change="sizeChangeChild"
        @refresh-change="refreshChangeChild"
        @on-load="onLoadChild"
      >
      </avue-crud>
    </HuilanDialog>
  </HuilanBasic>
</template>

<script>
import {
  getParentList,
  getChildList,
  remove,
  update,
  add,
  addDictItem,
  updateDictItem,
  removeDictItem,
  // getDict,
  // getDictTree
} from "@/api/system/dict";
import { getRules } from "@/util/regx";

import { mapGetters } from "vuex";

export default {
  data() {
    return {
      dictName: "",
      parentId: "",
      formParent: {},
      formChild: {},
      selectionList: [],
      query: {},
      loading: true,
      loadingChild: true,
      pageParent: {
        pageSize: 10,
        pageSizes: [10, 30, 50, 100, 200],
        currentPage: 1,
        total: 0,
      },
      pageChild: {
        pageSize: 10,
        pageSizes: [10, 30, 50, 100, 200],
        currentPage: 1,
        total: 0,
      },
      dataParent: [],
      dataChild: [],
      optionParent: {
        // height: 'auto',
        // calcHeight: 95,
        header: false,
        tip: false,
        searchShow: true,
        searchMenuSpan: 6,
        border: false,
        index: true,
        editBtn: false,
        viewBtn: false,
        delBtn: false,
        menuWidth: 280,
        dialogClickModal: false,
        dialogWidth: "40%",
        dialogType: "drawer",
        dialogCustomClass: "huilan-drawer-form",
        emptyText: this.$t("aicosCommon.notData"),
        column: [
          {
            label: this.$t("system.dict.dictCode"),
            prop: "code",
            // search: true,
            editDisabled: true,
            span: 24,
            maxlength: 50,
            showWordLimit: true,
            rules: [
              {
                required: true,
                message:
                  this.$t("aicosCommon.pleaseInput") +
                  this.$t("system.dict.dictCode"),
                trigger: "blur",
              },
              ...getRules(["charNumLine"]),
            ],
          },
          {
            label: this.$t("system.dict.dictName"),
            prop: "name",
            // search: true,
            align: "center",
            span: 24,
            maxlength: 50,
            showWordLimit: true,
            rules: [
              {
                required: true,
                message:
                  this.$t("aicosCommon.pleaseInput") +
                  this.$t("system.dict.dictName"),
                trigger: "blur",
              },
              ...getRules(["charNumHanUnderline"]),
            ],
          },
          {
            label: this.$t("system.dict.dictLevel"),
            prop: "type",
            // search: true,
            align: "center",
            type: "select",
            span: 24,
            value: "user",
            width: 120,
            dicData: [
              {
                label: this.$t("system.dict.systemLevel"),
                value: "system",
              },
              {
                label: this.$t("system.dict.userLevel"),
                value: "user",
              },
            ],
            rules: [
              {
                required: true,
                message:
                  this.$t("aicosCommon.pleaseSelect") +
                  this.$t("system.dict.dictLevel"),
                trigger: "blur",
              },
            ],
          },
          {
            label: this.$t("system.dict.dictRemarks"),
            prop: "remark",
            type: "textarea",
            maxlength: 100,
            showWordLimit: true,
            rules: getRules(["expectSpecials"]),
            span: 24,
            hide: true,
          },
        ],
      },
      optionChild: {
        height: "auto",
        calcHeight: 95,
        tip: false,
        searchShow: true,
        searchSpan: 8,
        searchMenuSpan: 6,
        // tree: true,
        border: true,
        index: true,
        // selection: true,
        viewBtn: false,
        menuWidth: 220,
        labelWidth: 100,
        searchLabelWidth: 120,
        dialogWidth: 480,
        dialogClickModal: false,
        emptyText: this.$t("aicosCommon.notData"),
        column: [
          {
            label: this.$t("system.dict.dictiItemCode"),
            prop: "code",
            editDisabled: true,
            search: true,
            span: 24,
            maxlength: 50,
            showWordLimit: true,
            rules: [
              {
                required: true,
                message:
                  this.$t("aicosCommon.pleaseInput") +
                  this.$t("system.dict.dictiItemCode"),
                trigger: "blur",
              },
              ...getRules(["charNumLine"]),
            ],
          },
          {
            label: this.$t("system.dict.dictiItemName"),
            prop: "name",
            search: true,
            align: "center",
            span: 24,
            maxlength: 50,
            showWordLimit: true,
            rules: [
              {
                required: true,
                message:
                  this.$t("aicosCommon.pleaseInput") +
                  this.$t("system.dict.dictiItemName"),
                trigger: "blur",
              },
              ...getRules(["charNumHanUnderline"]),
            ],
          },
          {
            label: this.$t("system.dict.dictiItemValue"),
            prop: "value",
            // width: 80,
            span: 24,
            maxlength: 200,
            showWordLimit: true,
            rules: [
              {
                required: true,
                message:
                  this.$t("aicosCommon.pleaseInput") +
                  this.$t("system.dict.dictiItemValue"),
                trigger: "blur",
              },
              ...getRules(["expectSpecials"]),
            ],
          },
          {
            label: this.$t("system.dict.dictItemSort"),
            prop: "sort",
            span: 24,
            // rules:[
            //   {
            //     pattern: /(^[1-9]\d*$)/,
            //     message: "请输入正整数",
            //     trigger: "blur"
            //   },
            // ],
            type: "number",
            minRows: 0,
            maxRows: 99999,
            precision: 0,
            hide: true,
          },
          {
            label: this.$t("system.dict.dictItemRemarks"),
            prop: "remark",
            type: "textarea",
            maxlength: 200,
            showWordLimit: true,
            span: 24,
            rules: getRules(["expectSpecials"]),
            hide: true,
          },
        ],
      },
      dictItemDialogVisible: false,
      queryChild: {},
      searchForm: {
        code: "",
        name: "",
        type: "",
      },
      searchFieldList: [
        {
          prop: "code",
          placeholder:
            this.$t("aicosCommon.pleaseInput") +
            this.$t("system.dict.dictCode"),
        },
        {
          prop: "name",
          placeholder:
            this.$t("aicosCommon.pleaseInput") +
            this.$t("system.dict.dictName"),
        },
        {
          type: "select",
          prop: "type",
          placeholder:
            this.$t("aicosCommon.pleaseSelect") +
            this.$t("system.dict.dictLevel"),
          dicData: [
            {
              label: this.$t("system.dict.systemLevel"),
              value: "system",
            },
            {
              label: this.$t("system.dict.userLevel"),
              value: "user",
            },
          ],
        },
      ],
    };
  },
  computed: {
    ...mapGetters(["userInfo", "permission", "language"]),
    permissionList() {
      return {
        addBtn: this.vaildData(this.permission["system-dict-saveDict"], false),
        editBtn: this.vaildData(
          this.permission["system-dict-updateDict"],
          false
        ),
        delBtn: this.vaildData(
          this.permission["system-dict-deleteDict"],
          false
        ),
        dictItemMgr: this.vaildData(
          this.permission["system-dict-mgrDicItem"],
          false
        ),
        viewBtn: false,
      };
    },
    childPermissionList() {
      return {
        addBtn: this.vaildData(
          this.permission["system-dict-saveDictItem"],
          false
        ),
        editBtn: this.vaildData(
          this.permission["system-dict-updateDictItem"],
          false
        ),
        delBtn: this.vaildData(
          this.permission["system-dict-deleteDictItem"],
          false
        ),
        viewBtn: false,
      };
    },
    ids() {
      let ids = [];
      this.selectionList.forEach((ele) => {
        ids.push(ele.id);
      });
      return ids.join(",");
    },
  },
  methods: {
    handleAdd() {
      this.$refs.crud.rowAdd();
    },
    getRowActions() {
      const map = {
        delBtn: {
          name: this.$t("aicosCommon.delBtn"),
          command: "rowDel",
        },
        editBtn: {
          name: this.$t("aicosCommon.editBtn"),
          command: "rowEdit",
        },
        dictItemMgr: {
          name: this.$t("system.dict.dict"),
          command: "dictItemMgr",
        },
      };
      const list = ["editBtn", "delBtn", "dictItemMgr"];
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
    rowSave(row, done, loading) {
      const form = {
        ...row,
      };
      add(form).then(
        () => {
          this.onLoadParent(this.pageParent);
          this.$message({
            type: "success",
            message: this.$t("aicosCommon.successOperate"),
          });
          done();
        },
        (error) => {
          window.console.log(error);
          loading();
        }
      );
    },
    rowUpdate(row, index, done, loading) {
      update(row).then(
        () => {
          this.onLoadParent(this.pageParent);
          this.$message({
            type: "success",
            message: this.$t("aicosCommon.successOperate"),
          });
          done();
        },
        (error) => {
          window.console.log(error);
          loading();
        }
      );
    },
    rowDel(row) {
      this.$confirm(this.$t("aicosCommon.mutiDeleteConfirmTip"), {
        confirmButtonText: this.$t("aicosCommon.confirmBtn"),
        cancelButtonText: this.$t("aicosCommon.cancelBtn"),
        type: "warning",
      })
        .then(() => {
          return remove(row.id);
        })
        .then(() => {
          this.onLoadParent(this.pageParent);
          this.$message({
            type: "success",
            message: this.$t("aicosCommon.successOperate"),
          });
        });
    },
    searchReset() {
      this.query = {};
      this.onLoadParent(this.pageParent);
    },
    searchChange() {
      console.log("this.searchForm", this.searchForm);
      this.query = {
        ...this.searchForm,
      };
      this.pageParent.currentPage = 1;
      this.onLoadParent(this.pageParent);
    },
    selectionChange(list) {
      this.selectionList = list;
    },
    selectionClear() {
      this.selectionList = [];
      this.$refs.crud.toggleSelection();
    },
    beforeOpen(done, type) {
      if (["edit", "view"].includes(type)) {
        // getDict(this.formParent.id).then(res => {
        //   this.formParent = res.data.data;
        // });
      }
      done();
    },
    currentChange(currentPage) {
      this.pageParent.currentPage = currentPage;
    },
    sizeChange(pageSize) {
      this.pageParent.pageSize = pageSize;
    },
    refreshChange() {
      this.onLoadParent(this.pageParent, this.query);
    },
    dictItemMgr(row) {
      this.pageChild.currentPage = 1;
      this.parentId = row.id;
      this.dictName = row.name;
      this.dictItemDialogVisible = true;

      if (this.$refs.crudChild) {
        this.$refs.crudChild.searchReset();
      }
    },
    handleDicItemDialogOpened() {
      if (this.$refs.crudChild) {
        // 解决操作列和序号列不对齐的问题
        this.$refs.crudChild.doLayout();
      }
    },
    rowSaveChild(row, done, loading) {
      addDictItem(row).then(
        () => {
          this.onLoadChild(this.pageChild);
          this.$message({
            type: "success",
            message: this.$t("aicosCommon.successOperate"),
          });
          done();
        },
        (error) => {
          window.console.log(error);
          loading();
        }
      );
    },
    rowUpdateChild(row, index, done, loading) {
      updateDictItem(row).then(
        () => {
          this.onLoadChild(this.pageChild);
          this.$message({
            type: "success",
            message: this.$t("aicosCommon.successOperate"),
          });
          done();
        },
        (error) => {
          window.console.log(error);
          loading();
        }
      );
    },
    rowDelChild(row) {
      this.$confirm(this.$t("aicosCommon.mutiDeleteConfirmTip"), {
        confirmButtonText: this.$t("aicosCommon.confirmBtn"),
        cancelButtonText: this.$t("aicosCommon.cancelBtn"),
        type: "warning",
      })
        .then(() => {
          return removeDictItem(row.id);
        })
        .then(() => {
          this.onLoadChild(this.pageChild);
          this.$message({
            type: "success",
            message: this.$t("aicosCommon.successOperate"),
          });
        });
    },
    searchResetChild() {
      this.queryChild = {};
      this.onLoadChild(this.pageChild);
    },
    searchChangeChild(params, done) {
      this.queryChild = params;
      this.pageChild.currentPage = 1;
      this.onLoadChild(this.pageChild, params);
      done();
    },
    selectionChangeChild(list) {
      this.selectionList = list;
    },
    selectionClearChild() {
      this.selectionList = [];
      this.$refs.crudChild.toggleSelection();
    },
    beforeOpenChild(done, type) {
      if (type !== "view") {
        this.optionChild.labelPosition = this.language == "en" ? "top" : "right";
      }
      this.formChild.dictId = this.parentId;
      done();
    },
    currentChangeChild(currentPage) {
      this.pageChild.currentPage = currentPage;
    },
    sizeChangeChild(pageSize) {
      this.pageChild.pageSize = pageSize;
    },
    refreshChangeChild() {
      this.onLoadChild(this.pageChild, this.queryChild);
    },
    onLoadParent(page, params = {}) {
      this.loading = true;
      getParentList(
        page.currentPage,
        page.pageSize,
        Object.assign(params, this.query)
      ).then((res) => {
        const data = res.data.data;
        this.pageParent.total = data.total;
        this.dataParent = data.records;
        this.loading = false;

        this.selectionClear();
      });
    },
    onLoadChild(page, params = {}) {
      this.loadingChild = true;
      getChildList(
        page.currentPage,
        page.pageSize,
        this.parentId,
        Object.assign(params, this.queryChild)
      ).then((res) => {
        const data = res.data.data;
        this.dataChild = data.records;
        this.pageChild.total = data.total;

        this.loadingChild = false;
        this.selectionClear();
      });
    },
    configColumn() {
      this.$refs.crud.$refs.dialogColumn.columnBox = true;
    },
  },
  created() {
    const typeColumn = this.findObject(this.optionParent.column, "type");
    if (this.userInfo.isAdmin != "1") {
      this.$set(typeColumn, "dicData", [
        {
          label: this.$t("system.dict.userLevel"),
          value: "user",
        },
      ]);
      this.searchFieldList = [
        {
          prop: "code",
          placeholder:
            this.$t("aicosCommon.pleaseInput") +
            this.$t("system.dict.dictCode"),
        },
        {
          prop: "name",
          placeholder:
            this.$t("aicosCommon.pleaseInput") +
            this.$t("system.dict.dictName"),
        },
      ];
    } else {
      this.$set(typeColumn, "dicData", [
        {
          label: this.$t("system.dict.systemLevel"),
          value: "system",
        },
        {
          label: this.$t("system.dict.userLevel"),
          value: "user",
        },
      ]);
      this.searchFieldList = [
        {
          prop: "code",
          placeholder:
            this.$t("aicosCommon.pleaseInput") +
            this.$t("system.dict.dictCode"),
        },
        {
          prop: "name",
          placeholder:
            this.$t("aicosCommon.pleaseInput") +
            this.$t("system.dict.dictName"),
        },
        {
          type: "select",
          prop: "type",
          placeholder:
            this.$t("aicosCommon.pleaseSelect") +
            this.$t("system.dict.dictLevel"),
          dicData: [
            {
              label: this.$t("system.dict.systemLevel"),
              value: "system",
            },
            {
              label: this.$t("system.dict.userLevel"),
              value: "user",
            },
          ],
        },
      ];
    }
  },
};
</script>
