<template>
  <HuilanBasic>
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
      :page.sync="page"
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
      <!-- <template slot-scope="scope" slot="menu">
        <el-button
          type="text"
          icon="el-icon-edit-outline"
          size="small"
          v-if="permissionList.handle"
          @click.stop="handleWork(scope.row, scope.index)"
          >处理
        </el-button>
      </template> -->
    </avue-crud>
    <HuilanDialog
      title="处理"
      :fullscreen="true"
      append-to-body
      :visible.sync="formDialogVisible"
    >
      <WorkInfo
        v-if="formDialogVisible"
        :data="cur"
        :getInfo="getItemInfo"
        :handleComplete="handleComplete"
      />
    </HuilanDialog>
  </HuilanBasic>
</template>

<script>
import { mapGetters } from "vuex";
import { getList, getItemInfo } from "@/api/mywork/worklist";

import { dateFormat } from "@/util/date";

import WorkInfo from "./components/workInfo";

export default {
  name: "WorkList",
  components: {
    WorkInfo,
  },
  data() {
    return {
      form: {},
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
        header: false,
        searchShow: true,
        searchMenuSpan: 6,
        border: true,
        index: true,
        // selection: true,
        // 操作按钮
        addBtn: false,
        editBtn: false,
        delBtn: false,
        viewBtn: false,
        menuWidth: 80,
        dialogClickModal: false,
        dialogWidth: "30%",
        column: [
          {
            label: "流程名称",
            prop: "processDefinitionName",
            span: 24,
          },
          {
            label: "节点名称",
            prop: "taskName",
            span: 24,
            // search: true,
          },
          {
            label: "创建时间",
            prop: "createTime",
            span: 24,
            // search: true,
            type: "date",
            format: "yyyy-MM-dd",
            valueFormat: "yyyy-MM-dd",
            width: 180,
            align: "center",
            formatter: (val /*,value,label*/) => {
              return dateFormat(new Date(val.createTime));
            },
          },
        ],
      },
      searchForm: {
        taskName: "",
        date: "",
      },
      searchFieldList: [
        {
          prop: "taskName",
          placeholder: "请输入节点名称",
        },
        {
          prop: "createTime",
          type: "date",
          format: "yyyy-MM-dd",
          valueFormat: "yyyy-MM-dd",
          placeholder: "请选择创建时间",
        },
      ],
      formDialogVisible: false,
      cur: {},
    };
  },
  computed: {
    ...mapGetters(["permission"]),
    permissionList() {
      return {
        // addBtn: false,
        // viewBtn: false,
        // delBtn: false,
        // editBtn: false,
        handle: this.vaildData(this.permission["mywork-work-handle"], false),
      };
    },
  },
  methods: {
    getRowActions() {
      const map = {
        handle: {
          name: "处理",
          command: "handleWork",
        }
      };
      const list = [
        "handle",
      ];
      const actions = [];

      list.forEach((item) => {
        if (this.permissionList[item]) {
          actions.push(map[item]);
        }
      });
      return actions;
    },
    handleCommand(command, row, index) {
      this[command](row, index);
    },
    configColumn() {
      this.$refs.crud.$refs.dialogColumn.columnBox = true;
    },
    getItemInfo,
    searchReset() {
      this.query = {};
      this.onLoad(this.page);
    },
    searchChange() {
      this.query = {
        ...this.searchForm,
      };
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
    handleWork(row) {
      this.cur = row;
      this.formDialogVisible = true;
    },
    handleComplete() {
      this.formDialogVisible = false;
      this.refreshChange();
    },
  },
};
</script>

<style scoped lang="scss"></style>
