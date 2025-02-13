<template>
  <HuilanBasic>
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
      @search="searchChange"
      @reset="searchReset"
    >
      <template v-slot:appendTool>
        <el-button type="default" @click="configColumn"
          ><i class="el-icon-s-operation"></i
        ></el-button>
      </template>
    </HuilanBasicSearchbar>
    <avue-crud
      :option="option"
      :table-loading="loading"
      :data="data"
      ref="crud"
      v-model="form"
      :page.sync="page"
      :permission="permissionList"
      :before-open="beforeOpen"
      @row-del="rowDel"
      @row-update="rowUpdate"
      @row-save="rowSave"
      @selection-change="selectionChange"
      @current-change="currentChange"
      @size-change="sizeChange"
      @refresh-change="refreshChange"
      @on-load="onLoad"
    >
      <template v-slot:menu="scope">
        <HuilanBasicActionTool
          :actions="getRowActions(scope.row)"
          @command="handleCommand($event, scope.row, scope.index)"
        />
      </template>
    </avue-crud>
  </HuilanBasic>
</template>

<script>
import {
  getList,
  /*getDetail, */ remove,
  update,
  add,
  getCurrentLanguage
} from "@/api/system/tenant";
import { mapGetters } from "vuex";
import { getRules } from "@/util/regx";
import { getStore } from "@/util/store";
import { getDictItemListByDictCodeURL } from "@/api/common";
import { getDictItemListByDictCode } from "@/api/configure/application";
import { dateFormat } from '@/util/date.js';

export default {
  data() {
    return {
      form: { 
        language: "zh_CN",
      },
      selectionList: [],
      query: {},
      loading: true,
      page: {
        pageSize: 10,
        currentPage: 1,
        total: 0
      },
      option: {
        // height: 'auto',
        calcHeight: 30,
        header: false,
        tip: false,
        searchShow: true,
        searchMenuSpan: 6,
        border: false,
        index: true,
        selection: true,
        editBtn: false,
        delBtn: false,
        viewBtn: false,
        menuWidth: 200,
        menuAlign: "center",
        dialogClickModal: false,
        // labelWidth: 160,
        dialogWidth: "40%",
        dialogType: "drawer",
        labelPosition: "left",
        emptyText: this.$t("aicosCommon.notData"),
        dialogCustomClass: "huilan-drawer-form",
        column: [
          {
            label: this.$t("system.tenant.tenantId"),
            prop: "tenantId",
            maxlength: 63,
            showWordLimit: true,
            overHidden: true,
            // search: true,
            // addDisplay: false,
            // editDisplay: false,
            editDisabled: true,
            span: 24,
            rules: [
              {
                required: true,
                message:
                  this.$t("aicosCommon.pleaseInput") +
                  this.$t("system.tenant.tenantId"),
                trigger: "blur"
              },
              {
                min: 3,
                message: this.$t("system.tenant.threeLengthTips"),
                trigger: "blur"
              },
              ...getRules(["charNum"]),
              {
                pattern: /^[a-z0-9_-]+$/,
                message: this.$t("system.tenant.rulesTips"),
                trigger: "blur"
              }
            ]
          },
          {
            label: this.$t("system.tenant.tenantName"),
            prop: "tenantName",
            maxlength: 50,
            overHidden: true,
            showWordLimit: true,
            // search: true,
            // width: 180,
            span: 24,
            rules: [
              {
                required: true,
                message:
                  this.$t("aicosCommon.pleaseInput") +
                  this.$t("system.tenant.tenantName"),
                trigger: "blur"
              },
              ...getRules(["charNumHanUnderline"])
            ]
          },
          {
            label: this.$t("system.tenant.tenantType"),
            prop: "tenantType",
            align: "center",
            type: "select",
            overHidden: true,
            span: 24,
            dicUrl: getDictItemListByDictCodeURL,
            dicMethod: "post",
            dicQuery: {
              code: "tenantType"
            },
            props: {
              label: "name",
              value: "code"
            },
            value: "正式租户",
            rules: [
              {
                required: true,
                message:
                  this.$t("aicosCommon.pleaseSelect") +
                  this.$t("system.tenant.tenantType"),
                trigger: "blur"
              }
            ]
          },
          {
            label: this.$t("system.tenant.openTime"),
            prop: "openTime",
            // width: 170,
            // search: true,
            // addDisplay: false,
            // editDisplay: false,
            type: "date",
            hide: true,
            span: 24,
            format: "yyyy-MM-dd HH:mm:ss",
            valueFormat: "yyyy-MM-dd HH:mm:ss",
            value: dateFormat(Date.now()),
            rules: [
              {
                required: true,
                message:
                  this.$t("aicosCommon.pleaseSelect") +
                  this.$t("system.tenant.openTime"),
                trigger: "blur"
              }
            ]
          },
          {
            label: this.$t("system.tenant.expireTime"),
            prop: "expireTime",
            // width: 170,
            // search: true,
            // addDisplay: false,
            // editDisplay: false,
            type: "date",
            hide: true,
            span: 24,
            format: "yyyy-MM-dd HH:mm:ss",
            valueFormat: "yyyy-MM-dd HH:mm:ss"
          },
          {
            label: this.$t("system.tenant.linkman"),
            prop: "linkman",
            align: "center",
            maxlength: 20,
            overHidden: true,
            width: 150,
            showWordLimit: true,
            // width: 100,
            // search: true,
            rules: getRules(["expectSpecials"])
          },
          {
            label: this.$t("system.tenant.contactNumber"),
            prop: "contactNumber",
            align: "center",
            width: 150,
            rules: getRules(["tel"])
          },
          {
            label: this.$t("system.tenant.address"),
            prop: "address",
            maxlength: 100,
            overHidden: true,
            showWordLimit: true,
            span: 24,
            minRows: 2,
            type: "textarea",
            rules: getRules(["expectSpecials"]),
            hide: true
          },
          
          {
            label: this.$t("system.tenant.status"),
            prop: "status",
            type: "switch",
            align: "center",
            span: 24,
            overHidden: true,
            hide: true,
            display: false,
            dicData: [
              {
                label: this.$t("system.tenant.close"),
                value: 0
              },
              {
                label: this.$t("system.tenant.open"),
                value: 1
              }
            ],
            value: 1
          },
          {
            label: this.$t("system.tenant.enableRobot"),
            prop: "enableRobot",
            type: "switch",
            align: "center",
            overHidden: true,
            dicData: [
              {
                label: this.$t("system.tenant.close"),
                value: 0
              },
              {
                label: this.$t("system.tenant.open"),
                value: 1
              }
            ],
            value: 0,
            change: ({ value }) => {
              const robotAnswerUrl = this.findObject(
                  this.option.column,
                  "robotAnswerUrl"
                ),
                robotUrl = this.findObject(this.option.column, "robotUrl"),
                modeRobotBaseUrl = this.findObject(
                  this.option.column,
                  "modeRobotBaseUrl"
                ),
                apiToken = this.findObject(this.option.column, "apiToken"),
                exportNum = this.findObject(this.option.column, "exportNum");
              const  language = this.findObject(this.option.column, "language");
              if (value === 0) {
                robotAnswerUrl.display = false;
                robotUrl.display = false;
                modeRobotBaseUrl.display = false;
                apiToken.display = false;
                exportNum.display = false;
                language.display = false;
              }
              if (value === 1) {
                robotAnswerUrl.display = true;
                robotUrl.display = true;
                apiToken.display = true;
                modeRobotBaseUrl.display = true;
                exportNum.display = true;
                language.display = true;
              }
            }
            // hide: true,
          },
          {
            label: this.$t("system.tenant.language"),
            prop: "language",
            type: "select",
            align: "center",
            overHidden: true,
            span: 24,
            dicUrl: getDictItemListByDictCodeURL,
            dicMethod: "post",
            dicQuery: {
              code: "language"
            },
            props: {
              label: "name",
              value: "code"
            },
            display: false,
            rules: [
              {
                required: true,
                message:
                  this.$t("aicosCommon.pleaseSelect") +
                  this.$t("system.tenant.language"),
                trigger: "blur"
              }
            ]
          },
          {
            label: this.$t("system.tenant.robotAnswerUrl"),
            prop: "robotAnswerUrl",
            overHidden: true,
            span: 24,
            type: "input",
            display: false,
            hide: true,
            rules: [
              {
                required: true,
                message:
                  this.$t("aicosCommon.pleaseInput") +
                  this.$t("system.tenant.robotAnswerUrl"),
                trigger: "blur"
              }
            ]
          },
          {
            label: this.$t("system.tenant.algorithmRobotUrl"),
            prop: "robotUrl",
            span: 24,
            type: "input",
            overHidden: true,
            display: false,
            hide: true,
            rules: [
              {
                required: true,
                message:
                  this.$t("aicosCommon.pleaseInput") +
                  this.$t("system.tenant.algorithmRobotUrl"),
                trigger: "blur"
              }
            ]
          },
          {
            label: this.$t("system.tenant.robotAlgorithmModelAddress"),
            prop: "modeRobotBaseUrl",
            overHidden: true,
            span: 24,
            type: "input",
            display: false,
            hide: true,
            rules: [
              {
                required: true,
                message:
                  this.$t("aicosCommon.pleaseInput") +
                  this.$t("system.tenant.robotAlgorithmModelAddress"),
                trigger: "blur"
              }
            ]
          },
          {
            label: this.$t("system.tenant.robotApiToken"),
            prop: "apiToken",
            overHidden: true,
            span: 24,
            type: "input",
            display: false,
            hide: true,
            rules: [
              {
                required: true,
                message:
                  this.$t("aicosCommon.pleaseInput") +
                  this.$t("system.tenant.robotApiToken"),
                trigger: "blur"
              }
            ]
          },
          {
            label: this.$t("system.tenant.exportNum"),
            prop: "exportNum",
            overHidden: true,
            span: 24,
            type: "input",
            display: false,
            hide: true,
            value: 0
          }
        ]
      },
      searchForm: {
        tenantId: "",
        tenantName: ""
      },
      searchFieldList: [
        {
          prop: "tenantId",
          placeholder:
            this.$t("aicosCommon.pleaseInput") +
            this.$t("system.tenant.tenantId")
        },
        {
          prop: "tenantName",
          placeholder:
            this.$t("aicosCommon.pleaseInput") +
            this.$t("system.tenant.tenantName")
        }
      ],
      data: [],
      languageList: []
    };
  },
  computed: {
    ...mapGetters(["permission", "language"]),
    permissionList() {
      return {
        addBtn: this.vaildData(this.permission["system-tenant-save"], false),
        viewBtn: this.vaildData(this.permission["system-tenant-view"], false),
        delBtn: this.vaildData(this.permission["system-tenant-delete"], false),
        editBtn: this.vaildData(this.permission["system-tenant-update"], false)
      };
      // return function (key, row /*, index*/) {
      //   const map = {
      //     menu: true,
      //     addBtn: this.permission["system-tenant-save"],
      //     viewBtn: this.permission["system-tenant-view"],
      //     editBtn: this.permission["system-tenant-update"],
      //   };
      //   if (key === "delBtn") {
      //     let currentTenantId = getStore({ name: "currentTenantId" });
      //     if (row.tenantId == "000000") {
      //       return false;
      //     } else {
      //       return (
      //         row.tenantId !== currentTenantId &&
      //         this.permission["system-tenant-delete"]
      //       );
      //     }
      //   }
      //   return map[key];
      // };
    }
    // ids() {
    //   let ids = [];
    //   this.selectionList.forEach(ele => {
    //     ids.push(ele.id);
    //   });
    //   return ids.join(",");
    // },
    // tenantId() {
    //   return this.selectionList[0].tenantId;
    // }
  },
  mounted() {
    getDictItemListByDictCode({
      code: "language"
    }).then(res => {
      const data = res.data;
      if (data.success) {
        this.languageList = data.data;
        getCurrentLanguage().then(res => {
          if (res.data.success) {
            this.form.language = res.data.data;
            let index = this.languageList.findIndex(
              item => item.code === this.form.language
            );
            if (index === -1) {
              this.form.language = "zh_CN";
            }
          }
        });
      }
    });
  },
  methods: {
    // 新增
    handleAdd() {
      this.$refs.crud.rowAdd();
    },
    // 列显隐
    configColumn() {
      this.$refs.crud.$refs.dialogColumn.columnBox = true;
    },
    getRowActions(row) {
      let currentTenantId = getStore({ name: "currentTenantId" });
      const map = {
        viewBtn: {
          name: this.$t("aicosCommon.viewBtn"),
          command: "rowView"
        },

        editBtn: {
          name: this.$t("aicosCommon.editBtn"),
          command: "rowEdit"
        }
      };
      const list = ["viewBtn", "editBtn"];
      if (row.tenantId !== currentTenantId && row.tenantId !== "000000") {
        map.delBtn = {
          name: this.$t("aicosCommon.delBtn"),
          command: "rowDel"
        };
        list.push("delBtn");
      }
      const actions = [];

      list.forEach(item => {
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
      add(row).then(
        () => {
          this.onLoad(this.page);
          this.$message({
            type: "success",
            message: this.$t("aicosCommon.successOperate")
          });
          done();
        },
        error => {
          window.console.log(error);
          loading();
        }
      );
    },
    rowUpdate(row, index, done, loading) {
      update(row).then(
        () => {
          this.onLoad(this.page);
          this.$message({
            type: "success",
            message: this.$t("aicosCommon.successOperate")
          });
          done();
        },
        error => {
          window.console.log(error);
          loading();
        }
      );
    },
    rowDel(row) {
      this.$confirm(this.$t("system.tenant.delTips"), {
        confirmButtonText: this.$t("aicosCommon.confirmBtn"),
        cancelButtonText: this.$t("aicosCommon.cancelBtn"),
        type: "warning"
      })
        .then(() => {
          return remove(row.id);
        })
        .then(() => {
          this.onLoad(this.page);
          this.$message({
            type: "success",
            message: this.$t("aicosCommon.successOperate")
          });
        });
    },
    beforeOpen(done, type) {
      if (type !== "view") {
        this.option.labelPosition = this.language != "zh" ? "top" : "right";
      }
      // if (["view"].includes(type)) {
      //   getDetail(this.form.id).then(res => {
      //     const data = res.data.data;
      //     if (!(data.accountNumber > 0)) {
      //       data.accountNumber = "不限制";
      //     }
      //     if (!data.expireTime) {
      //       data.expireTime = "不限制";
      //     }
      //     this.form = data;
      //   });
      // }
      // if(type === 'edit') {
      //   const opt = this.findObject(this.option.column, 'tenantId');
      //   opt.disabled = true;
      // }
      done();
    },
    searchReset() {
      this.query = {};
      this.onLoad(this.page);
    },
    searchChange() {
      this.query = {
        ...this.searchForm
      };
      this.page.currentPage = 1;
      this.onLoad(this.page);
    },
    selectionChange(list) {
      this.selectionList = list;
    },
    selectionClear() {
      this.selectionList = [];
      this.$refs.crud.toggleSelection();
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
    onLoad(page, params = {}) {
      this.loading = true;
      getList(
        page.currentPage,
        page.pageSize,
        Object.assign(params, this.query)
      ).then(res => {
        const data = res.data.data;

        this.page.total = data.total;
        this.data = data.records;
        this.data.map(item=>{
          if(this.validatenull(item.enableRobot)){
            item.language = ''
          }
        })
        this.loading = false;
        this.selectionClear();
      });
    }
  }
};
</script>

<style></style>
