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
      <!--      <template slot-scope="scope" slot="menu">-->
      <!--        <el-button-->
      <!--          type="text"-->
      <!--          icon="el-icon-edit-outline"-->
      <!--          size="small"-->
      <!--          v-if="permissionList.design"-->
      <!--          @click.stop="designForm(scope.row,scope.index)"-->
      <!--        >表单设计-->
      <!--        </el-button>-->
      <!--        <el-button-->
      <!--          type="text"-->
      <!--          icon="el-icon-position"-->
      <!--          size="small"-->
      <!--          v-if="permissionList.design"-->
      <!--          @click.stop="publishForm(scope.row,scope.index)"-->
      <!--        >发布表单-->
      <!--        </el-button>-->
      <!--      </template>-->
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
import { getSendList /*getSendLogDetail*/ } from "@/api/messageMgr/msgLog";

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
        channelType: "",
        titleContent: "",
        accepter: "",
      },
      searchFieldList: [
        {
          label: "通道类型",
          prop: "channelType",
          placeholder: "请选择通道类型",
          type: "select",
          dicData: [
            {
              label: "邮件通道",
              value: "mail",
            },
            {
              label: "短信通道",
              value: "shortmessage",
            },
            {
              label: "微信通道",
              value: "weixin",
            },
            {
              label: "电话通道",
              value: "telephone",
            },
            {
              label: "业务系统",
              value: "third",
            },
            {
              label: "其它通道",
              value: "others",
            },
          ],
        },
        {
          label: "消息标题",
          prop: "titleContent",
          placeholder: "请输入消息标题",
        },
        {
          label: "目标用户",
          prop: "accepter",
          placeholder: "请输入目标用户",
        },
      ],
      option: {
        header: false,
        tip: false,
        searchShow: true,
        searchMenuSpan: 4,
        border: true,
        index: true,
        labelWidth: 100,
        // selection: true,
        viewBtn: false,
        menuWidth: 80,
        dialogClickModal: false,
        dialogWidth: "40%",
        dialogType: "drawer",
        dialogCustomClass: "huilan-drawer-form",
        column: [
          {
            label: "通道名称",
            prop: "channelName",
            span: 24,
            // search: true,
            // searchSpan: 8,
            // searchLabelWidth: 100
          },
          {
            label: "通道类型",
            prop: "channelType",
            span: 24,
            hide: true,
            // search: true,
            // searchSpan: 8,
            // searchLabelWidth: 100
            type: "select",
            dicData: [
              {
                label: "邮件通道",
                value: "mail",
              },
              {
                label: "短信通道",
                value: "shortmessage",
              },
              {
                label: "微信通道",
                value: "weixin",
              },
              {
                label: "电话通道",
                value: "telephone",
              },
              {
                label: "业务系统",
                value: "third",
              },
              {
                label: "其它通道",
                value: "others",
              },
            ],
          },
          {
            label: "消息标题",
            prop: "titleContent",
            span: 24,
            // search: true,
            searchSpan: 8,
          },
          {
            label: "目标用户",
            prop: "accepter",
            span: 24,
            // search: true,
          },
          {
            label: "平台下发时间",
            prop: "createTime",
            span: 24,
            width: 170,
          },
          {
            label: "下发状态",
            prop: "status",
            span: 24,
            type: "select",
            width: 120,
            dicData: [
              {
                label: "失败",
                value: "0",
              },
              {
                label: "成功",
                value: "1",
              },
              {
                label: "已触达",
                value: "2",
              },
            ],
          },
          {
            label: "发送内容",
            prop: "bodyContent",
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
    configColumn() {
      this.$refs.crud.$refs.dialogColumn.columnBox = true;
    },
    beforeOpen(done /*, type*/) {
      // if (['view'].includes(type)) {
      //   // this.form.formJson = ''
      //   const {data: {data:[res]}} = await getSendLogDetail(this.form.id)
      //   const json = JSON.parse(res.channelConfig)
      //   this.form.content = JSON.stringify(json, null, 4)
      // }
      // if (["edit", "view"].includes(type)) {
      //   // getDept(this.form.id).then(res => {
      //   //   this.form = res.data.data;
      //   // });
      // }
      // getHuilanBaseMqLog(this.form.id)
      done();
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
      getSendList(Object.assign(params, this.query, pageConf)).then((res) => {
        const data = res.data.data;
        this.loading = false;
        this.data = data.records;
        this.page.total = data.total;
      });
    },
  },
};
</script>

<style scoped></style>
