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
      :permission="permissionList"
      :before-open="beforeOpen"
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
    </avue-crud>
  </HuilanBasic>
</template>

<script>
// import {mapGetters} from "vuex";
import { getReceiveList, getReceiveLogDetail } from "@/api/messageMgr/msgLog";

export default {
  name: "MessageLog",
  data() {
    return {
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
      },
      searchForm: {
        producerName: "",
      },
      searchFieldList: [
        {
          label: "请求渠道",
          prop: "producerName",
          placeholder: "请输入请求渠道",
        },
      ],
      option: {
        tip: false,
        searchShow: true,
        searchMenuSpan: 4,
        border: true,
        index: true,
        header: false,
        // selection: true,
        viewBtn: false,
        menuWidth: 80,
        dialogClickModal: false,
        dialogWidth: "40%",
        dialogType: "drawer",
        dialogCustomClass: "huilan-drawer-form",
        column: [
          {
            label: "请求渠道",
            prop: "producerName",
            span: 24,
            // search: true,
            searchSpan: 8,
            searchLabelWidth: 100,
          },
          {
            label: "下发通道",
            prop: "channelName",
            span: 24,
            searchSpan: 8,
          },
          {
            label: "消息数量",
            prop: "id",
            span: 24,
            width: 100,
            // display: false,
          },
          {
            label: "请求时间",
            prop: "tenantId",
            span: 24,
            width: 160,
          },
          {
            label: "接收状态",
            prop: "status",
            span: 24,
            type: "select",
            width: 100,
            dicData: [
              {
                label: "失败",
                value: "0",
              },
              {
                label: "成功",
                value: "1",
              },
            ],
          },
          {
            label: "请求消息体",
            prop: "content",
            type: "textarea",
            minRows: 10,
            maxRows: 20,
            hide: true,
            span: 24,
          },
        ],
      },
      designDialogVisible: false,
      curForm: {},
      useableFields: [],
      curFormJson: {},
    };
  },
  computed: {
    // ...mapGetters(["permission"]),
    permissionList() {
      return {
        addBtn: false,
        viewBtn: true,
        delBtn: false,
        editBtn: false,
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
    async beforeOpen(done, type) {
      if (["view"].includes(type)) {
        // this.form.formJson = ''
        const {
          data: {
            data: [res],
          },
        } = await getReceiveLogDetail(this.form.parentMessageId);
        const json = JSON.parse(res.content);
        this.form.content = JSON.stringify(json, null, 4);
      }
      // if (["edit", "view"].includes(type)) {
      //   // getDept(this.form.id).then(res => {
      //   //   this.form = res.data.data;
      //   // });
      // }
      // getHuilanBaseMqLog(this.form.id)
      done();
    },
    configColumn() {
      this.$refs.crud.$refs.dialogColumn.columnBox = true;
    },
    searchReset() {
      this.query = {};
      // this.parentId = 0;
      this.page.currentPage = 1;
      this.onLoad(this.page);
    },
    searchChange() {
      this.query = {
        ...this.searchForm,
      };
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
      getReceiveList(Object.assign(params, this.query, pageConf)).then(
        (res) => {
          const data = res.data.data;
          this.loading = false;
          this.data = data.records;
          this.page.total = data.total;
        }
      );
    },
  },
};
</script>

<style scoped></style>
