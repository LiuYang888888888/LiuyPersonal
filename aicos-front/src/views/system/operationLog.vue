<template>
  <HuilanBasic>
    <HuilanBasicToolbar style="margin-top: 0">
      <el-button
        type="primary"
        size="small"
        v-if="permissionList.bthOutBtn"
        @click.stop="bthOut()"
        >导出
      </el-button>
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
      :option="option"
      :search.sync="query"
      :table-loading="loading"
      :data="data"
      ref="crud"
      v-model="form"
      :permission="permissionList"
      :before-open="beforeOpen"
      :page.sync="page"
      @current-change="currentChange"
      @size-change="sizeChange"
      @refresh-change="refreshChange"
      @on-load="onLoad"
    >
      <!-- <template slot-scope="scope" slot="menuLeft">
        <el-button
          type="primary"
          size="small"
          icon="el-icon-download"
          v-if="( permissionList.bthOutBtn )"
          @click.stop="bthOut()"
        >导出
        </el-button>
      </template> -->
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
import { mapGetters } from "vuex";
import { getList, exportExcel } from "@/api/system/operationLog";
import { baseURL } from "@/api/common";

export default {
  name: "OperationLog",
  data() {
    return {
      form: {
        modelType: 0,
      },
      query: {},
      loading: false,
      data: [],
      page: {
        pageSize: 10,
        currentPage: 1,
        total: 0,
      },
      option: {
        tip: false,
        searchShow: true,
        searchMenuSpan: 6,
        border: true,
        // index: true,
        header:false,
        // selection: true,
        viewBtn: false,
        menuWidth: 100,
        dialogClickModal: false,
        dialogWidth: "40%",
        dialogType: "drawer",
        dialogCustomClass: "huilan-drawer-form",
        labelWidth: 100,
        column: [
          {
            label: "系统",
            prop: "systemName",
            // search: true,
          },
          {
            label: "模块",
            prop: "module",
            // search: true,
          },
          {
            label: "操作者地址",
            prop: "ipAddress",
            hide: true,
          },
          {
            label: "请求路径",
            prop: "uri",
            hide: true,
          },
          {
            label: "请求方式",
            prop: "httpMethod",
            hide: true,
          },
          {
            label: "开始时间",
            prop: "startTime",
            // type: 'date',
            // format: "yyyy-MM-dd hh:mm:ss",
            hide: true,
          },
          {
            label: "请求参数",
            prop: "requestParams",
            span: 24,
            type: "textarea",
            hide: true,
          },
          {
            label: "结果",
            prop: "result",
            type: "textarea",
            span: 24,
            hide: true,
          },
          {
            label: "花费时间(ms)",
            prop: "timeCost",
            hide: true,
          },
          {
            label: "描述",
            prop: "description",
          },
          {
            label: "操作者",
            prop: "createUser",
          },
          {
            label: "操作时间",
            prop: "createTime",
          },
        ],
      },
      searchForm: {
        systemName: "",
        module: "",
      },
      searchFieldList: [
        {
          prop: "systemName",
          placeholder: "请输入系统",
        },
        {
          prop: "module",
          placeholder: "请输入模块",
        },
      ],
    };
  },
  computed: {
    ...mapGetters(["permission"]),
    permissionList() {
      return {
        addBtn: false,
        viewBtn: true,
        delBtn: false,
        editBtn: false,
        bthOutBtn: true,
      };
    },
  },
  methods: {
    getRowActions() {
      const map = {
        viewBtn: {
          name: "查看",
          command: "rowView",
        },
      };
      const list = ["viewBtn"];
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
    configColumn() {
      this.$refs.crud.$refs.dialogColumn.columnBox = true;
    },
    beforeOpen(done /*, type*/) {
      // if (["add"].includes(type)) {
      //   this.form.formJson = ''
      // }
      // if (["edit", "view"].includes(type)) {
      //   // getDept(this.form.id).then(res => {
      //   //   this.form = res.data.data;
      //   // });
      // }
      done();
    },
    searchReset() {
      this.query = {};
      // this.parentId = 0;
      this.onLoad(this.page);
    },
    searchChange() {
      this.query = {...this.searchForm};
      // this.parentId = '';
      this.page.currentPage = 1;
      this.onLoad(this.page);
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
      const pageConf = {
        current: page.currentPage,
        size: page.pageSize,
      };
      this.loading = true;
      getList(Object.assign(params, this.query, pageConf)).then((res) => {
        const data = res.data.data;
        this.loading = false;
        this.data = data.records;
        this.page.total = data.total;
      });
    },
    bthOut() {
      const dataParam = {
        ...this.query,
      };
      exportExcel(dataParam).then(
        (res) => {
          //console.log(res.datadata)
          const dataRes = res.data.data;
          const urlRes = `${baseURL}` + dataRes.newFileName.substring(1);
          this.downFile(urlRes);
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
  },
};
</script>

<style scoped></style>
