<template>
  <HuilanBasic>
    <HuilanBasicSearchbar :model="searchForm" :fields="searchFieldList" @search="searchChange" @reset="searchReset">
      <template v-slot:appendTool>
        <el-button type="default" @click="configColumn"><i class="el-icon-s-operation"></i></el-button>
      </template>
    </HuilanBasicSearchbar>
    <avue-crud :option="option" :table-loading="loading" :data="data" ref="crud" v-model="form" :page.sync="page"
      :permission="permissionList" :before-open="beforeOpen" @selection-change="selectionChange"
      @current-change="currentChange" @size-change="sizeChange" @refresh-change="refreshChange" @on-load="onLoad">
      <template slot-scope="{ row }" slot="toAccount">
        {{ row.toAccount.split(";").length }}
      </template>
      <template slot-scope="scope" slot="toAccountForm">
        {{ scope.value && scope.value.split(";").length }}
      </template>
      <template v-slot:menu="scope">
        <HuilanBasicActionTool :actions="getRowActions(scope.row)"
          @command="handleCommand($event, scope.row, scope.index)" />
      </template>
      <!-- <template slot-scope="scope" slot="menu">
        <el-button
          type="text"
          icon="el-icon-setting"
          size="small"
          v-if="permissionList.reSend"
          @click.stop="reSend(scope.row, scope.index)"
          >重发
        </el-button>
      </template> -->
    </avue-crud>
  </HuilanBasic>
</template>

<script>
import {
  getListPageByMessageArchiveParam,
  reSendMessage,
} from "@/api/mywork/sendMessageList";
import { mapGetters } from "vuex";
export default {
  name: "MessageList",
  props: {
    type: {
      type: String,
    },
  },
  data () {
    return {
      form: {},
      selectionList: [],
      query: {},
      loading: true,
      page: {
        pageSize: 10,
        currentPage: 1,
        total: 0,
      },
      option: {
        // height: "auto",
        header: false,
        calcHeight: 120,
        tip: false,
        searchShow: true,
        searchMenuSpan: 6,
        border: false,
        index: true,
        // selection: true,
        viewBtn: false,
        menuWidth: 150,
        dialogClickModal: false,
        dialogWidth: "40%",
        dialogType: "drawer",
        dialogCustomClass: "huilan-drawer-form",
        emptyText: this.$t('aicosCommon.notData'),
        column: [
          {
            label: this.$t('mywork.sentMessageList.title'),
            prop: "title",
            width: 180,
            // search: true,
            // addDisplay: false,
            // editDisplay: false,
            // editDisabled: true,
            // span: 24,
            rules: [
              {
                required: true,
                message: this.$t('aicosCommon.pleaseInput') + this.$t('mywork.sentMessageList.title'),
                trigger: "blur",
              },
            ],
          },
          {
            label: this.$t('mywork.sentMessageList.template'),
            prop: "templateName",
            // width: 180,
            // span: 24,
            // minRows: 3,
            // type: "textarea",
            rules: [
              {
                required: true,
                message: this.$t('aicosCommon.pleaseInput') + this.$t('mywork.sentMessageList.template'),
                trigger: "blur",
              },
            ],
          },
          {
            label: this.$t('mywork.sentMessageList.sends'),
            prop: "toAccount",
            minWidth: 100,
            slot: true,
            formslot: true,
          },
          {
            label: this.$t('mywork.sentMessageList.status'),
            prop: "status",
            width: 120,
            // search: true,
            addDisplay: false,
            editDisplay: false,
            type: "select",
            dicData: [
              {
                label: this.$t('mywork.sentMessageList.sendSuccessful'),
                value: "1",
              },
              {
                label: this.$t('mywork.sentMessageList.failInSend'),
                value: "2",
              },
            ],
            // value: '1'
          },
          {
            label: this.$t('mywork.sentMessageList.sender'),
            prop: "fromAccount",
            width: 150,
          },
          {
            label: this.$t('mywork.sentMessageList.createTime'),
            prop: "createTime",
            width: 170,
            // search: true,
            addDisplay: false,
            editDisplay: false,
            type: "date",
            format: "yyyy-MM-dd HH:mm:ss",
            valueFormat: "yyyy-MM-dd HH:mm:ss",
          },
          // {
          //   label: "备注",
          //   prop: "remark",
          //   span: 24,
          //   minRows: 2,
          //   type: "textarea",
          //   hide: true,
          // }
        ],
      },
      searchForm: {
        title: "",
        status: "",
      },
      searchFieldList: [
        {
          prop: "title",
          placeholder: this.$t('aicosCommon.pleaseInput') + this.$t('mywork.sentMessageList.title'),
        },
        {
          prop: "status",
          placeholder: this.$t('aicosCommon.pleaseSelect') + this.$t('mywork.sentMessageList.status'),
          type: "select",
          dicData: [
            {
              label: this.$t('mywork.sentMessageList.sendSuccessful'),
              value: "1",
            },
            {
              label: this.$t('mywork.sentMessageList.failInSend'),
              value: "2",
            },
          ],
        },
      ],
      data: [],
    };
  },
  computed: {
    ...mapGetters(["permission", 'language']),
    permissionList () {
      return {
        addBtn: false,
        viewBtn: this.vaildData(
          this.permission["mymessage-archive-view"],
          false
        ),
        delBtn: false,
        editBtn: false,
        reSend: this.vaildData(
          this.permission["mymessage-archive-resend"],
          false
        ),
        // addBtn: true,
        // viewBtn: true,
        // delBtn: true,
        // editBtn: true
      };
    },
  },
  methods: {
    getRowActions () {
      const map = {
        viewBtn: {
          name: this.$t('aicosCommon.viewBtn'),
          command: 'rowView'
        },
        reSend: {
          name: this.$t('mywork.sentMessageList.retry'),
          command: "reSend",
        },
      };
      const list = ['viewBtn', "reSend"];
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
    // 列显隐
    configColumn () {
      this.$refs.crud.$refs.dialogColumn.columnBox = true;
    },
    beforeOpen (done) {
      this.option.labelPosition = this.language == "en" ? "top" : "right";

      done();
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
      const param = {
        current: page.currentPage,
        size: page.pageSize,
        type: this.type,
        ...params,
        ...this.query,
      };
      this.loading = true;
      getListPageByMessageArchiveParam(param).then((res) => {
        const data = res.data.data;
        this.page.total = data.total;
        this.data = data.records;
        this.loading = false;
        this.selectionClear();
      });
    },
    async reSend (row) {
      const { data } = await reSendMessage(row.id);
      if (data.success) {
        this.$message.success(this.$t("aicosCommon.successOperate"));
        this.onLoad(this.page);
      }
    },
  },
};
</script>

<style scoped></style>
