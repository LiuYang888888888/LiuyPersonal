<template>
  <div>
    <HuilanBasicToolbar style="margin-top: 0">
      <el-button v-if="permissionList.addBtn" type="primary" size="small" @click="handleAdd">{{ $t('aicosCommon.addBtn')
      }}</el-button>
    </HuilanBasicToolbar>
    <HuilanBasicSearchbar :model="searchForm" :fields="searchFieldList" @search="searchChange" @reset="searchReset">
      <template v-slot:appendTool>
        <el-button type="default" @click="configColumn"><i class="el-icon-s-operation"></i></el-button>
      </template>
    </HuilanBasicSearchbar>
    <avue-crud :option="option" :table-loading="loading" :data="data" :page.sync="page" ref="crud" v-model="form"
      :permission="permissionList" :before-open="beforeOpen" @row-del="rowDel" @row-update="rowUpdate" @row-save="rowSave"
      @selection-change="selectionChange" @current-change="currentChange" @size-change="sizeChange"
      @refresh-change="refreshChange" @on-load="onLoad">
      <template v-slot:menu="scope">
        <HuilanBasicActionTool :actions="getRowActions(scope.row)"
          @command="handleCommand($event, scope.row, scope.index)" />
      </template>
    </avue-crud>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import {
  getParamItemList,
  addItem,
  updateItem,
  removeItem,
} from "@/api/system/param";
import { getRules } from "@/util/regx";
import { getTextWidth } from "@/util/util";

export default {
  name: "paramItemList",
  props: {
    parentId: {
      type: String,
      default: "",
    },
  },
  watch: {
    parentId (val) {
      this.parentId = val;
      this.page.currentPage = 1;
      this.onLoad(this.page);
    },
  },
  data () {
    return {
      form: {},
      page: {
        pageSize: 10,
        pageSizes: [10, 30, 50, 100, 200],
        currentPage: 1,
        total: 0,
      },
      loading: true,
      data: [],
      searchForm: {
        name: "",
      },
      searchFieldList: [
        {
          prop: "name",
          placeholder: this.$t('aicosCommon.pleaseInput') + this.$t('system.param.name'),
        },
      ],
      option: {
        height: "auto",
        calcHeight: 95,
        tip: false,
        header: false,
        searchShow: true,
        searchSpan: 8,
        searchMenuSpan: 6,
        // tree: true,
        border: false,
        index: true,
        addBtn: false,
        editBtn: false,
        delBtn: false,
        // selection: true,
        // viewBtn: false,
        menuAlign: "center",
        menuWidth: 220,
        labelWidth: 100,
        searchLabelWidth: 100,
        dialogClickModal: false,
        dialogWidth: "40%",
        dialogType: "drawer",
        dialogCustomClass: "huilan-drawer-form",
        emptyText: this.$t('aicosCommon.notData'),
        column: [
          {
            label: this.$t('system.param.encoded'),
            prop: "code",
            editDisabled: true,
            // search: true,
            span: 24,
            rules: [
              {
                required: true,
                message: this.$t('aicosCommon.pleaseInput') + this.$t('system.param.encoded'),
                trigger: "blur",
              },
              ...getRules(["charNumLine"]),
            ],
          },
          {
            label: this.$t('system.param.name'),
            prop: "name",
            // search: true,
            align: "center",
            span: 24,
            rules: [
              {
                required: true,
                message: this.$t('aicosCommon.pleaseInput') + this.$t('system.param.name'),
                trigger: "blur",
              },
              ...getRules(["charNumHanUnderline"]),
            ],
          },
          {
            label: this.$t('system.param.dictLevel'),
            prop: "paramLevel",
            search: false,
            align: "center",
            type: "select",
            span: 24,
            value: "user",
            clearable: false,
            editDisabled: true,
            width: 100,
            dicData: [
              {
                label: this.$t('system.param.systemLevel'),
                value: "system",
              },
              {
                label: this.$t('system.param.userLevel'),
                value: "user",
              },
            ],
            rules: [
              {
                required: true,
                message: this.$t('aicosCommon.pleaseSelect') + this.$t('system.param.dictLevel'),
                trigger: "blur",
              },
            ],
          },
          {
            label: this.$t('system.param.type'),
            prop: "paramType",
            search: false,
            align: "center",
            type: "select",
            span: 24,
            value: "back",
            clearable: false,
            editDisabled: true,
            width: 170,
            dicData: [
              {
                label: this.$t('system.param.back'),
                value: "back",
              },
              {
                label: this.$t('system.param.front'),
                value: "js",
              },
              // {
              //   label: "前台js参数",
              //   value: 'js'
              // }
            ],
            rules: [
              {
                required: true,
                message: this.$t('aicosCommon.pleaseSelect') + this.$t('system.param.type'),
                trigger: "blur",
              },
            ],
          },
          {
            label: this.$t('system.param.value'),
            prop: "value",
            // width: 80,
            span: 24,
            rules: [
              {
                required: true,
                message: this.$t('aicosCommon.pleaseInput') + this.$t('system.param.value'),
                trigger: "blur",
              },
              ...getRules(["expectSpecials"]),
            ],
          },
          {
            label: this.$t('system.param.remark'),
            prop: "remark",
            type: "textarea",
            span: 24,
            rules: getRules(["expectSpecials"]),
            hide: true,
          },
        ],
      },
    };
  },
  computed: {
    ...mapGetters(["userInfo", "permission", 'language']),
    permissionList () {
      return {
        viewBtn: true,
        addBtn: this.vaildData(
          this.permission["system-param-table-add"],
          false
        ),
        delBtn: this.vaildData(
          this.permission["system-param-table-delete"],
          false
        ),
        editBtn: this.vaildData(
          this.permission["system-param-table-update"],
          false
        ),
      };
      // return function (key, row /*, index*/) {
      //   const map = {
      //     menu: true,
      //     addBtn: this.permission["system-param-table-add"],
      //     editBtn: this.permission["system-param-table-update"],
      //     viewBtn: false,
      //     // delBtn: true,
      //   };
      //   if (key === "delBtn") {
      //     return (
      //       row.paramLevel !== "system" &&
      //       this.permission["system-param-table-delete"]
      //     );
      //   }
      //   return map[key];
      // };
    },
  },
  created () {
    this.option.column.map((v) => {
      if (v.prop === "paramLevel" && this.userInfo.isAdmin != "1") {
        v.disabled = true;
      }
    });
  },
  methods: {
    // 新增
    handleAdd () {
      this.$refs.crud.rowAdd();
    },
    // 列显隐
    configColumn () {
      this.$refs.crud.$refs.dialogColumn.columnBox = true;
    },
    getRowActions (row) {
      const map = {
        editBtn: {
          name: this.$t('aicosCommon.editBtn'),
          command: "rowEdit",
        },
      };
      const list = ["editBtn"];
      const actions = [];
      if (row.paramLevel !== "system") {
        map.delBtn = {
          name: this.$t('aicosCommon.delBtn'),
          command: "rowDel",
        };
        list.push("delBtn");
      }
      if (row.paramLevel == "system" && this.userInfo.isAdmin != "1") {
        map.viewBtn = {
          name: this.$t('aicosCommon.viewBtn'),
          command: "rowView",
        };
        //往list里面添加viewBtn到第一个
        list.unshift("viewBtn");
        //从list中删除editBtn
        list.splice(list.indexOf("editBtn"), 1);
      }

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
    rowSave (row, done, loading) {
      addItem(row).then(
        () => {
          this.onLoad(this.page);
          this.$message({
            type: "success",
            message: this.$t('aicosCommon.successOperate'),
          });
          done();
        },
        (error) => {
          window.console.log(error);
          loading();
        }
      );
    },
    rowUpdate (row, index, done, loading) {
      updateItem(row).then(
        () => {
          this.onLoad(this.page);
          this.$message({
            type: "success",
            message: this.$t('aicosCommon.successOperate'),
          });
          done();
        },
        (error) => {
          window.console.log(error);
          loading();
        }
      );
    },
    rowDel (row) {
      this.$confirm(this.$t('aicosCommon.mutiDeleteConfirmTip'), {
        confirmButtonText: this.$t('aicosCommon.confirmBtn'),
        cancelButtonText: this.$t('aicosCommon.cancelBtn'),
        type: "warning",
      })
        .then(() => {
          return removeItem(row.id);
        })
        .then(() => {
          this.onLoad(this.page);
          this.$message({
            type: "success",
            message: this.$t('aicosCommon.successOperate'),
          });
        });
    },
    searchReset () {
      this.query = {};
      this.onLoad(this.page);
    },
    searchChange () {
      this.query = {
        ...this.searchForm,
      };
      this.page.currentPage = 1;
      this.onLoad(this.page);
    },
    selectionChange (list) {
      this.selectionList = list;
    },
    selectionClear () {
      this.selectionList = [];
      this.$refs.crud.toggleSelection();
    },
    beforeOpen (done) {

      this.option.labelPosition = this.language != "zh" ? "top" : "right";

      this.form.systemparamId = this.parentId;
      done();
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
    onLoad (page, params = {}) {
      this.loading = true;
      getParamItemList(
        page.currentPage,
        page.pageSize,
        Object.assign({ systemparamId: this.parentId }, params, this.query)
      ).then((res) => {
        const data = res.data.data;
        // console.log(data)
        this.data = data.records;
        if (this.language != 'zh') {
          this.option.column.forEach(item => {
            let width = getTextWidth(item.label).nodeWidth + 80;
            this.$set(item, "width", width)
          })
        }
        this.page.total = data.total;
        this.loading = false;
        // this.selectionClear();
      });
    },
    doLayout () {
      this.$refs.crud && this.$refs.crud.doLayout();
    },
  },
};
</script>

<style scoped></style>
