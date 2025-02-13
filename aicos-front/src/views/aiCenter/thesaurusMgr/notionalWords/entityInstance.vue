<template>
  <div :style="tabclenHei">
    <HuilanBasicToolbar style="margin-top: 0">
      <el-button v-if="permissionList.addBtn && entityId && isSubapplicationId" type="primary" size="small"
        @click="handleAdd">{{
          $t("aicosCommon.addBtn") }}</el-button>
      <el-button type="danger" size="small" v-if="permissionList.delBatchBtn && isSubapplicationId"
        @click.stop="batchDel">{{
          $t("aicosCommon.batchDeleteBtn") }}
      </el-button>
    </HuilanBasicToolbar>
    <HuilanBasicSearchbar :model="searchForm" :fields="searchFieldList" @reset="searchReset" @search="searchChange">
      <template v-slot:appendTool>
        <el-button type="default" @click="configColumn"><i class="el-icon-s-operation"></i></el-button>
      </template>
    </HuilanBasicSearchbar>
    <avue-crud :option="option" :search.sync="query" :table-loading="loading" :data="data" ref="crud" v-model="form"
      :permission="permissionList" @row-del="rowDel" @row-update="rowUpdate" @row-save="rowSave" :before-open="beforeOpen"
      :page.sync="page" @selection-change="selectionChange" @current-change="currentChange" @size-change="sizeChange"
      @refresh-change="refreshChange" @on-load="onLoad">
      <template v-slot:menu="scope">
        <HuilanBasicActionTool :actions="getRowActions(scope.row)"
          @command="handleCommand($event, scope.row, scope.index)" />
      </template>
    </avue-crud>
  </div>
</template>

<script>
// import { getRules } from "@/util/regx";
import { getTextWidth } from "@/util/util";
import {
  getEntityInstanceList,
  addEntityInstance,
  removeEntityInstance,
  updateEntityInstance,
  removeEntityInstanceBatch,
} from "@/api/aiCenter/thesaurusMgr/notionalWords";
import { baseURL } from "@/api/common";

import { mapGetters } from "vuex";
const tabclenHei = document.body.clientHeight - 182;
export default {
  name: "entityInstance",
  props: {
    entityId: String,
    subapplicationId: String
  },
  data () {
    return {
      tabclenHei: `height:${tabclenHei}px`,
      form: {
        // type: 'system'
      },
      query: {},
      loading: false,
      data: [],
      selectionList: [],
      searchForm: {
        wordType: "",
        excluded: "",
      },
      searchFieldList: [
        {
          prop: "wordType",
          placeholder: this.$t("aicosCommon.pleaseInput") + this.$t("aiCenter.notionalWords.instanceType"),
          type: "select",
          dicData: [
            { label: this.$t("aiCenter.notionalWords.commonWords"), value: "common" },
            { label: this.$t("aiCenter.notionalWords.regularExpression"), value: "regular" },
          ],
        },
        {
          label: this.$t("aiCenter.notionalWords.excludedOrNot"),
          prop: "excluded",
          type: "select",
          dicData: [
            { label: this.$t("aicosCommon.yes"), value: "1" },
            { label: this.$t("aicosCommon.no"), value: "0" },
          ],
          placeholder: this.$t("aicosCommon.pleaseSelect") + this.$t("aiCenter.notionalWords.excludedOrNot"),
        },
      ],
      page: {
        pageSize: 10,
        currentPage: 1,
        total: 0,
      },
      option: {
        tip: false,
        header: false,
        searchShow: true,
        searchMenuSpan: 6,
        border: true,
        index: true,
        addBtn: false,
        editBtn: false,
        delBtn: false,
        selection: true,
        viewBtn: true,
        refreshBtn: false,
        columnBtn: false,
        menuWidth: 120,
        // menu: false,
        dialogClickModal: false,
        dialogWidth: "40%",
        dialogType: "drawer",
        dialogCustomClass: "huilan-drawer-form",
        emptyText: this.$t('aicosCommon.notData'),
        column: [
          {
            label: this.$t("aiCenter.notionalWords.instanceType"),
            prop: "wordType",
            type: "select",
            // search: true,
            span: 24,
            // width: 150,
            dicData: [
              { label: this.$t("aiCenter.notionalWords.commonWords"), value: "common" },
              { label: this.$t("aiCenter.notionalWords.regularExpression"), value: "regular" },
            ],
            control: (value) => {
              if (value === "common") {
                return {
                  entityWord: {
                    placeholder:
                      this.$t('aiCenter.notionalWords.instanceTip'),
                  },
                };
              } else {
                return {
                  entityWord: {
                    placeholder: this.$t("aicosCommon.pleaseInput") + this.$t("aiCenter.notionalWords.regularExpression"),
                  },
                };
              }
            },
            value: "common",
          },
          {
            label: this.$t("aiCenter.notionalWords.instanceName"),
            prop: "entityWord",
            type: "textarea",
            span: 24,
            overHidden: true,
            // search: true,
            // editDisabled: true,
            showWordLimit: true,
            maxlength: 100,
            // placeholder: '请输入实例,添加多实例请按回车；相同实例同义词以“/”分隔。例：北京大学/北大 清华大学/清华',
            rules: [
              {
                required: true,
                message: this.$t("aicosCommon.pleaseInput") + this.$t("aiCenter.notionalWords.instanceName"),
                trigger: "blur",
              },
              // ...getRules(["charNumHanEnter"]),
            ],
          },
          {
            label: this.$t("aiCenter.notionalWords.excludedOrNot"),
            prop: "excluded",
            type: "radio",
            // search: true,
            span: 24,
            // width: 200,
            dicData: [
              { label: this.$t("aicosCommon.yes"), value: "1" },
              { label: this.$t("aicosCommon.no"), value: "0" },
            ],
            value: "0",
          },
        ],
      },
    };
  },
  computed: {
    ...mapGetters(["permission", 'language']),
    permissionList () {
      return {
        addBtn: this.vaildData(
          this.permission["sys-plug-basePlugin-save"],
          false
        ),
        viewBtn: false,
        delBtn: this.vaildData(
          this.permission["sys-plug-basePlugin-delete"],
          false
        ),
        delBatchBtn: this.vaildData(
          this.permission["sys-plug-basePlugin-deleteBatch"],
          false
        ),
        editBtn: this.vaildData(
          this.permission["sys-plug-basePlugin-update"],
          false
        ),
      }
    },

    isSubapplicationId () {
      if (baseURL.replace(/^\/+|\/+$/g, '').toLowerCase() == 'aicos') {
        if (this.subapplicationId == null || this.subapplicationId.toLowerCase() == baseURL.replace(/^\/+|\/+$/g, '').toLowerCase() || this.subapplicationId == '') {
          return true
        } else {
          return false
        }
      } else if (this.subapplicationId) {
        if (this.subapplicationId.toLowerCase() == baseURL.replace(/^\/+|\/+$/g, '').toLowerCase()) {
          return true
        } else {
          return false
        }
      } else {
        return false
      }


    }
  },
  watch: {
    entityId () {
      this.searchReset();
    },
  },
  methods: {
    getRowActions () {

      // if (baseURL.replace(/^\/+|\/+$/g, '').toLowerCase() == 'aicos') {
      //   if (row.subapplicationId == null || row.subapplicationId.toLowerCase() == baseURL.replace(/^\/+|\/+$/g, '').toLowerCase() || row.subapplicationId == '') {
      //     list.push("editBtn", "delBtn")
      //   }
      // } else if (row.subapplicationId) {
      //   if (row.subapplicationId.toLowerCase() == baseURL.replace(/^\/+|\/+$/g, '').toLowerCase()) {
      //     list.push("editBtn", "delBtn")
      //   }
      // }
      const map = {
        delBtn: {
          name: this.$t("aicosCommon.delBtn"),
          command: "rowDel",
        },
        editBtn: {
          name: this.$t("aicosCommon.editBtn"),
          command: "rowEdit",
        },
      };
      const list = [
        "editBtn",
        "delBtn",
      ];

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
      addEntityInstance(row).then(
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
    },
    rowUpdate (row, index, done, loading) {
      updateEntityInstance(row).then(
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
          return removeEntityInstance(row.id);
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
    batchDel () {
      if (this.selectionList.length === 0) {
        this.$message.warning(this.$t("aicosCommon.chooseDataTip"));
        return;
      }
      this.$confirm(this.$t("aicosCommon.mutiDeleteConfirmTip"), {
        confirmButtonText: this.$t("aicosCommon.confirmBtn"),
        cancelButtonText: this.$t("aicosCommon.cancelBtn"),
        type: "warning",
      })
        .then(() => {
          const ids = this.selectionList.map((item) => item.id);
          return removeEntityInstanceBatch(ids.join());
        })
        .then(() => {
          this.onLoad(this.page);
          this.$message({
            type: "success",
            message: this.$t("aicosCommon.successOperate"),
          });
          this.$refs.crud.toggleSelection();
        });
    },
    beforeOpen (done, type) {
      this.option.labelPosition = this.language != 'zh' ? 'top' : 'right'
      if (["add"].includes(type)) {
        this.form.entityId = this.entityId;
      }
      done();
    },
    searchReset () {
      this.query = {};
      // this.parentId = 0;
      this.onLoad(this.page);
    },
    searchChange () {
      this.query = {
        ...this.searchForm,
      };
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
      if (this.entityId === "") {
        return;
      }
      const pageConf = {
        entityId: this.entityId,
        current: page.currentPage,
        size: page.pageSize,
      };
      this.loading = true;
      getEntityInstanceList(Object.assign(params, this.query, pageConf)).then(
        (res) => {
          const data = res.data.data;
          this.loading = false;
          this.data = data.records;
          if (!this.isSubapplicationId) {
            this.option.menu = false
          } else {
            this.option.menu = true
          }
          if (this.language != 'zh') {
            this.option.column.forEach(item => {
              if (!this.isSubapplicationId) {
                let width = getTextWidth(item.label).nodeWidth + 145;
                if (item.width) {
                  if (width < item.width) {
                    return;
                  }
                  this.$set(item, "width", width)
                } else {
                  this.$set(item, "minWidth", width)
                }
              } else {
                let width = getTextWidth(item.label).nodeWidth + 130;
                if (item.width) {
                  if (width < item.width) {
                    return;
                  }
                  this.$set(item, "width", width)
                } else {
                  this.$set(item, "minWidth", width)
                }
              }

            })
          }

          this.page.total = data.total;
          this.selectionClear();
        }
      );
    },
  },
};
</script>

<style scoped></style>
