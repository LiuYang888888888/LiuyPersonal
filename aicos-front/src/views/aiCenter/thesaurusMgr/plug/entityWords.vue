<template>
  <div>
    <HuilanBasicToolbar style="margin-top: 0">
      <el-button v-if="permissionList.addBtn" type="primary" size="small" @click="handleAdd">{{ $t("aicosCommon.addBtn")
      }}</el-button>
    </HuilanBasicToolbar>
    <avue-crud :option="option" :search.sync="query" :table-loading="loading" :data="data" ref="crud" v-model="form"
      :page.sync="page" :permission="permissionList" :row-style="rowStyle" @row-del="rowDel" @row-update="rowUpdate"
      @row-save="rowSave" :before-open="beforeOpen" @current-change="currentChange" @size-change="sizeChange"
      @refresh-change="refreshChange" @row-click="handleRowClick" @on-load="onLoad">
      <template v-slot:menu="scope">
        <HuilanBasicActionTool :actions="getRowActions(scope.row)"
          @command="handleCommand($event, scope.row, scope.index)" />
      </template>
    </avue-crud>
  </div>
</template>

<script>
import { getList, add, remove, update } from "@/api/aiCenter/thesaurusMgr/plug";
import { mapGetters } from "vuex";
//import serviceList from '@/config/serviceList'
import { getDictItemListByDictCodeURL } from "@/api/common";
//const { system } = serviceList;

export default {
  name: "entityWords",
  props: {
    applicationId: {
      type: String
    },
    rowClick: {
      type: Function,
      default () {
        return () => { };
      }
    }
  },
  data () {
    return {
      form: {},
      query: {},
      loading: false,
      data: [],
      page: {
        pageSize: 10,
        currentPage: 1,
        total: 0,
        pagerCount: 5,
        layout: "->,total, prev, pager, next"
      },
      option: {
        tip: false,
        header: false,
        searchShow: false,
        searchMenuSpan: 6,
        border: true,
        index: false,
        // selection: true,
        editBtn: false,
        delBtn: false,
        addBtn: false,
        viewBtn: true,
        refreshBtn: false,
        columnBtn: false,
        searchShowBtn: false,
        menuWidth: 160,
        dialogClickModal: false,
        dialogWidth: "40%",
        dialogType: "drawer",
        dialogCustomClass: "huilan-drawer-form",
        column: [
          {
            label: this.$t("aiCenter.plug.pluginGroupName"),
            prop: "pluginGroupName",
            span: 24,
            // search: true,
            // editDisabled: true,
            maxlength: 50,
            showWordLimit: true,
            rules: [
              {
                required: true,
                message:
                  this.$t("aicosCommon.pleaseInput") +
                  this.$t("aiCenter.plug.pluginGroupName"),
                trigger: "blur"
              }
            ]
          },
          {
            label: this.$t("aiCenter.plug.pluginGroupType"),
            prop: "pluginGroupType",
            hide: true,
            span: 24,
            type: "select",
            search: true,
            searchSpan: 6,
            // cascaderItem: ["abilityId"],
            dicUrl: getDictItemListByDictCodeURL,
            dicMethod: "post",
            dicQuery: {
              code: "ai-thesaurusMgr-plug-type"
            },
            props: {
              label: "name",
              value: "code"
            },
            rules: [
              {
                required: true,
                message:
                  this.$t("aicosCommon.pleaseInput") +
                  this.$t("aiCenter.plug.pluginGroupType"),
                trigger: "blur"
              }
            ]
          }
        ]
      },
      curRow: {}
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
        viewBtn: false,
        delBtn: this.vaildData(
          this.permission["sys-plug-basePluginGroup-delete"],
          false
        ),
        editBtn: this.vaildData(
          this.permission["sys-plug-basePluginGroup-update"],
          false
        )
      };
    }
  },
  watch: {
    applicationId () {
      this.searchReset();
    }
  },
  methods: {
    // 新增
    handleAdd () {
      this.$refs.crud.rowAdd();
    },
    getRowActions () {
      const map = {
        delBtn: {
          name: this.$t("aicosCommon.delBtn"),
          command: "rowDel"
        },
        editBtn: {
          name: this.$t("aicosCommon.editBtn"),
          command: "rowEdit"
        }
      };
      const list = ["editBtn", "delBtn"];
      const actions = [];

      list.forEach(item => {
        if (this.permissionList[item]) {
          actions.push(map[item]);
        }
      });
      return actions;
    },
    handleCommand (command, row, index) {
      const crud = this.$refs.crud;
      const cruddActions = ["rowEdit", "rowDel"];
      if (cruddActions.includes(command)) {
        crud[command](row, index);
      } else {
        this[command](row, index);
      }
    },
    rowStyle ({ row }) {
      if (row.id === this.curRow.id) {
        return {
          background: "#ecf5ff"
        };
      }
    },
    rowSave (row, done, loading) {
      add(row).then(
        () => {
          // 获取新增数据的相关字段
          // const data = res.data.data;
          // row.id = data.id;
          this.$message({
            type: "success",
            message: this.$t("aicosCommon.successOperate")
          });
          // 数据回调进行刷新
          this.onLoad(this.page);
          done();
        },
        error => {
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
            message: this.$t("aicosCommon.successOperate")
          });
          // 数据回调进行刷新
          this.onLoad(this.page);
          done();
        },
        error => {
          window.console.log(error);
          loading();
        }
      );
    },
    rowDel (row, index, done) {
      this.$confirm(this.$t("aicosCommon.mutiDeleteConfirmTip"), {
        confirmButtonText: this.$t("aicosCommon.confirmBtn"),
        cancelButtonText: this.$t("aicosCommon.cancelBtn"),
        type: "warning"
      })
        .then(() => {
          return remove(row.id);
        })
        .then(() => {
          this.$message({
            type: "success",
            message: this.$t("aicosCommon.successOperate")
          });
          // 数据回调进行刷新
          this.onLoad(this.page);
          done();
        });
    },
    beforeOpen (done, type) {
      this.option.labelPosition = this.language != "zh" && type != 'view' ? "right" : "top";

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
      const scope = this;
      if (scope.applicationId === "") {
        return;
      }
      const pageConf = {
        applicationId: scope.applicationId,
        current: page.currentPage,
        size: page.pageSize
      };
      scope.loading = true;
      getList(Object.assign(params, scope.query, pageConf)).then(res => {
        const data = res.data.data;
        scope.loading = false;
        scope.data = data.records;
        scope.page.total = data.total;
        if (data.records.length > 0) {
          scope.handleRowClick(data.records[0]);
        }
      });
    },
    handleRowClick (row) {
      this.curRow = row;
      this.rowClick(row);
    }
  }
};
</script>

<style scoped></style>
