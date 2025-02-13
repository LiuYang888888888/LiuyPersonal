<template>
  <div :style="tabclenHei">
    <HuilanBasicToolbar style="margin-top: 0">
      <el-button v-if="permissionList.addBtn" type="primary" size="small" @click="handleAdd">{{ $t("aicosCommon.addBtn")
      }}</el-button>
    </HuilanBasicToolbar>
    <el-scrollbar>
      <avue-crud :option="option" :search.sync="query" :table-loading="loading" :data="data" ref="crud" v-model="form"
        :permission="permissionList" :row-style="rowStyle" @row-del="rowDel" @row-update="rowUpdate" @row-save="rowSave"
        :before-open="beforeOpen" :page.sync="page" @search-change="searchChange" @search-reset="searchReset"
        @current-change="currentChange" @size-change="sizeChange" @refresh-change="refreshChange"
        @row-click="handleRowClick" @on-load="onLoad">
        <!--      <template v-slot:menu="scope">-->
        <!--        <el-button-->
        <!--          type="text"-->
        <!--          icon="el-icon-edit-outline"-->
        <!--          size="small"-->
        <!--          v-if="permissionList.design"-->
        <!--          @click.stop="designForm(scope.row,scope.index)"-->
        <!--        >表单设计-->
        <!--        </el-button>-->
        <!--      </template>-->
        <template v-slot:menu="scope">
          <HuilanBasicActionTool :actions="getRowActions(scope.row)"
            @command="handleCommand($event, scope.row, scope.index)" />
        </template>
      </avue-crud>
    </el-scrollbar>
  </div>
</template>

<script>
import { getRules } from "@/util/regx";
import { getTextWidth } from "@/util/util";
import { baseURL } from "@/api/common";

import {
  getList,
  add,
  remove,
  update,
} from "@/api/aiCenter/thesaurusMgr/notionalWords";
import { mapGetters } from "vuex";

const tabclenHei = document.body.clientHeight - 182;
export default {
  name: "entityWords",
  props: {
    applicationId: {
      type: String,
    },
    rowClick: {
      type: Function,
      default () {
        return () => { };
      },
    },
  },
  data () {
    return {
      // rules: {
      //   min: {},
      //   max: {},
      // },
      tabclenHei: `height:${tabclenHei}px`,
      form: {
        // type: 'system'
      },
      query: {},
      loading: false,
      data: [],
      page: {
        pageSize: 10,
        currentPage: 1,
        total: 0,
        layout: "total, prev, pager, next",
      },
      option: {
        tip: false,
        searchShow: false,
        searchMenuSpan: 6,
        border: true,
        index: false,
        addBtn: false,
        header: false,
        editBtn: false,
        delBtn: false,
        // selection: true,
        viewBtn: false,
        refreshBtn: false,
        columnBtn: false,
        menuWidth: 150,
        dialogClickModal: false,
        dialogWidth: "40%",
        dialogType: "drawer",
        dialogCustomClass: "huilan-drawer-form",
        emptyText: this.$t('aicosCommon.notData'),
        column: [
          {
            label: this.$t("aiCenter.notionalWords.entityName"),
            prop: "entityName",
            span: 24,
            // search: true,
            // editDisabled: true,
            minlength: 1,
            maxlength: 100,
            showWordLimit: true,
            rules: [
              {
                required: true,
                message: this.$t("aicosCommon.pleaseInput") + this.$t("aiCenter.notionalWords.entityName"),
                trigger: "blur",
              },
              ...getRules(["charNumHan"]),
            ],
          },
          {
            label: this.$t("aiCenter.notionalWords.minimumLength"),
            prop: "minLength",
            type: "number",
            hide: true,
            span: 24,
            value: 0,
            rules: [
              {
                required: true,
                message: this.$t("aicosCommon.pleaseInput") + this.$t("aiCenter.notionalWords.minimumLength"),
                trigger: "blur",
              },
              ...getRules(["oneHundredInteger"]),
            ],
          },
          {
            label: this.$t("aiCenter.notionalWords.maximumLength"),
            prop: "maxLength",
            type: "number",
            hide: true,
            span: 24,
            value: 0,
            rules: [
              {
                required: true,
                message: this.$t("aicosCommon.pleaseInput") + this.$t("aiCenter.notionalWords.maximumLength"),
                trigger: "blur",
              },
              ...getRules(["oneHundredInteger"]),
            ],
          },
        ],
      },
      curRow: {},
    };
  },
  computed: {
    ...mapGetters(["permission", 'language']),
    permissionList () {
      return {
        addBtn: this.vaildData(
          this.permission["sys-plug-basePluginGroup-save"],
          false
        ),
        viewBtn: true,
        delBtn: this.vaildData(
          this.permission["sys-plug-basePluginGroup-delete"],
          false
        ),
        editBtn: this.vaildData(
          this.permission["sys-plug-basePluginGroup-update"],
          false
        ),
      };
    },
  },
  watch: {
    applicationId () {
      this.searchReset();
    },
  },
  methods: {
    rowStyle ({ row }) {
      if (row.id === this.curRow.id) {
        return {
          background: "#ecf5ff",
        };
      }
    },
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
    rowSave (row, done, loading) {
      if (row.minLength > row.maxLength) {
        this.$message.error(this.$t('aiCenter.notionalWords.maxAndMinLengthTip'));
        loading();
      } else {
        add(row).then(
          () => {
            // 获取新增数据的相关字段
            // const data = res.data.data;
            // row.id = data.id;
            this.$message({
              type: "success",
              message: this.$t("aicosCommon.successOperate"),
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
      }
    },
    rowUpdate (row, index, done, loading) {
      update(row).then(
        () => {
          this.$message({
            type: "success",
            message: this.$t("aicosCommon.successOperate"),
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
      this.$confirm(this.$t("aicosCommon.mutiDeleteConfirmTip"), {
        confirmButtonText: this.$t("aicosCommon.confirmBtn"),
        cancelButtonText: this.$t("aicosCommon.cancelBtn"),
        type: "warning",
      })
        .then(() => {
          return remove(row.id);
        })
        .then(() => {
          this.$message({
            type: "success",
            message: this.$t("aicosCommon.successOperate"),
          });
          // 数据回调进行刷新
          this.onLoad(this.page);
          done();
        });
    },
    beforeOpen (done, type) {
      this.option.labelPosition = this.language != 'zh' && type != 'view' ? 'top' : 'right'
      if (["add"].includes(type)) {
        this.form.applicationId = this.applicationId;
      }
      done();
    },
    searchReset () {
      this.query = {};
      // this.parentId = 0;
      this.onLoad(this.page);
    },
    searchChange (params, done) {
      this.query = params;
      // this.parentId = '';
      this.page.currentPage = 1;
      this.onLoad(this.page, params);
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
      if (this.applicationId === "") {
        return;
      }
      const pageConf = {
        applicationId: this.applicationId,
        current: page.currentPage,
        size: page.pageSize,
      };
      this.loading = true;
      getList(Object.assign(params, this.query, pageConf)).then((res) => {
        const data = res.data.data;
        this.loading = false;
        this.data = data.records;
        if (this.language != 'zh') {
          this.option.column.forEach(item => {
            let width = getTextWidth(item.label).nodeWidth + 55;
            this.$set(item, "width", width)
          })
        }
        this.page.total = data.total;
        if (data.total > 0) {
          this.handleRowClick(data.records[0]);
        } else {
          this.$emit("setEntityId");
        }
      });
    },
    handleRowClick (row) {
      this.curRow = row;
      this.rowClick(row);
    },
  },
};
</script>

<style scoped>
.avue-crud {
  min-height: 300px;
}
</style>
