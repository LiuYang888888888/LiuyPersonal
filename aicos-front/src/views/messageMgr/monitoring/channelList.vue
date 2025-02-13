<template>
  <div>
    <div style="margin-bottom: 20px;text-align: right;">
      <el-button
        style="padding: 8px"
        type="default"
        @click="configColumn"
        ><i class="el-icon-s-operation"></i
      ></el-button>
    </div>
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
      @search-change="searchChange"
      @search-reset="searchReset"
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
    </avue-crud>
  </div>
</template>

<script>
import { getChannels } from "@/api/messageMgr/monitoring";
export default {
  name: "ChannelList",
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
      option: {
        header: false,
        tip: false,
        searchShow: true,
        searchMenuSpan: 4,
        border: true,
        index: true,
        // selection: true,
        viewBtn: true,
        menu: false,
        menuWidth: 380,
        dialogClickModal: false,
        dialogWidth: "30%",
        column: [
          {
            label: "任务通道",
            prop: "name",
            span: 24,
            formatter(row, column, cellValue /*, index*/) {
              return cellValue.replace(/->.*(\(\d+\))/, "$1");
            },
          },
          // {
          //   label: "用户名",
          //   prop: "user",
          //   span: 24
          // },
          {
            label: "模式",
            prop: "transactional",
            span: 24,
            formatter(row /*, column, cellValue, index*/) {
              let res = "";
              if (row.transactional) {
                res = "T";
              } else if (row.confirm) {
                res = "C";
              }
              return res;
            },
          },
          {
            label: "状态",
            prop: "state",
            span: 24,
            width: 70,
            // display: false,
          },
          {
            label: "未确认",
            prop: "messages_unconfirmed",
            span: 24,
            width: 70,
          },
          {
            label: "预取数",
            prop: "prefetch_count",
            span: 24,
            width: 70,
          },
          {
            label: "收到未确认",
            prop: "messages_unacknowledged",
            span: 24,
            width: 120,
          },
          {
            label: "发布",
            prop: "message_stats.publish_details.rate",
            bind: "message_stats.publish_details.rate",
            span: 24,
            formatter: this.formatRate,
          },
          {
            label: "消息确认",
            prop: "message_stats.confirm_details.rate",
            bind: "message_stats.confirm_details.rate",
            span: 24,
            formatter: this.formatRate,
          },
          {
            label: "不可路由 (丢弃)",
            prop: "message_stats.drop_unroutable_details.rate",
            bind: "message_stats.drop_unroutable_details.rate",
            span: 24,
            formatter: this.formatRate,
          },
          {
            label: "发送/接收",
            prop: "message_stats.deliver_get_details.rate",
            bind: "message_stats.deliver_get_details.rate",
            span: 24,
            formatter: this.formatRate,
          },
          {
            label: "收到后确认",
            prop: "message_stats.ack_details.rate",
            bind: "message_stats.ack_details.rate",
            span: 24,
            formatter: this.formatRate,
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
    configColumn() {
      this.$refs.crud.$refs.dialogColumn.columnBox = true;
    },
    formatRate(row, column, cellValue /*, index*/) {
      return cellValue !== "" ? `${cellValue}/s` : cellValue;
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
      // getHuilanBaseMqLog(this.form.id)
      done();
    },
    searchReset() {
      this.query = {};
      // this.parentId = 0;
      this.page.currentPage = 1;
      this.onLoad(this.page);
    },
    searchChange(params, done) {
      this.query = params;
      // this.parentId = '';
      this.page.currentPage = 1;
      this.onLoad(this.page, params);
      done();
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
      getChannels(Object.assign(params, this.query, pageConf)).then((res) => {
        const data = res.data.data;
        const json = JSON.parse(data);
        this.loading = false;
        this.data = json.items;
        this.page.total = json.total_count;
      });
    },
  },
  mounted() {
    this.timer = setInterval(() => {
      this.refreshChange();
    }, 5000);
  },
  beforeDestroy() {
    clearInterval(this.timer);
  },
};
</script>

<style scoped></style>
