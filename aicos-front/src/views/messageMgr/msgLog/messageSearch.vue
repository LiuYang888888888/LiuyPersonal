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
import {
  getCombinLogList /*, getCombinLogDetail*/,
} from "@/api/messageMgr/msgLog";

export default {
  name: "MessageSearch",
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
        accepter: "",
        titleContent: "",
      },
      searchFieldList: [
        {
          label: "通道类型",
          prop: "channelType",
          span: 24,
          type: "select",
          placeholder: "请选择通道类型",
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
          label: "目标用户",
          prop: "accepter",
          span: 24,
          placeholder: "请输入目标用户",
        },
        {
          label: "消息标题",
          prop: "titleContent",
          placeholder: "请输入消息标题",
          // display: false,
        },
      ],
      option: {
        tip: false,
        searchShow: true,
        searchMenuSpan: 4,
        border: true,
        index: true,
        labelWidth: 120,
        header: false,
        // selection: true,
        searchSpan: 6,
        viewBtn: false,
        menuWidth: 80,
        dialogClickModal: false,
        dialogWidth: "40%",
        dialogType: "drawer",
        dialogCustomClass: "huilan-drawer-form",
        column: [
          {
            label: "渠道名称",
            prop: "producerName",
            span: 24,
            // search: true,
            // searchSpan: 8,
            // searchLabelWidth: 100
          },
          {
            label: "下发通道",
            prop: "channelName",
            span: 24,
            // search: true,
            // searchSpan: 8
          },
          {
            label: "通道类型",
            prop: "channelType",
            span: 24,
            hide: true,
            // search: true,
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
            label: "目标用户",
            prop: "accepter",
            span: 24,
            // search: true,
          },
          {
            label: "消息标题",
            prop: "titleContent",
            span: 24,
            // search: true,
            minWidth: 200,
            overHidden: true,
            // display: false,
          },
          {
            label: "平台接收时间",
            prop: "receiveTime",
            span: 24,
            minWidth: 200,
            // overHidden:true
            // formatter(row, val) {
            //   return val.split(',')[0]
            // }
          },
          // {
          //   label: "平台下发时间",
          //   prop: "dispatchTime",
          //   span: 24,
          //   search: true,
          //   type: "datetime",
          //   searchLabelWidth: 100,
          //   searchRange: true,
          //   searchSpan: 8,
          //   format: "yyyy-MM-dd HH:mm:ss",
          //   valueFormat: "yyyy-MM-dd HH:mm:ss",
          //   startPlaceholder: "开始日期",
          //   endPlaceholder: "结束日期",
          //   width: 140,
          //   defaultTime: ["00:00:00", "23:59:59"],
          //   // formatter(row, val) {
          //   //   return val.split(',')[1]
          //   // }
          // },
          {
            label: "下发状态",
            prop: "dispatchStatus",
            span: 24,
            width: 120,
            // formatter(row, val) {
            //   const flag = ['1,1', '1'].includes(val)
            //   return flag ? '成功' : '失败'
            // }
          },
          {
            label: "消息内容",
            prop: "bodyContent",
            span: 24,
            type: "textarea",
            hide: true,
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
    beforeOpen(done /*, type*/) {
      // if (['view'].includes(type)) {
      //   // this.form.formJson = ''
      //   getCombinLogDetail(this.form.sameId).then(res=> {
      //     debugger
      //   })
      // }
      // if (["edit", "view"].includes(type)) {
      //   // getDept(this.form.id).then(res => {
      //   //   this.form = res.data.data;
      //   // });
      // }
      // getHuilanBaseMqLog(this.form.id)
      done();
    },
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
      this.page.currentPage = 1;
      this.onLoad(this.page);
    },
    // searchChange({ dispatchTime = [], ...others }, done) {
    //   const [beginDate, endDate] = dispatchTime;
    //   const params = {
    //     beginDate,
    //     endDate,
    //     ...others,
    //   };
    //   this.query = params;
    //   // this.parentId = '';
    //   this.page.currentPage = 1;
    //   if (dispatchTime.length === 0) {
    //     delete params.beginDate;
    //     delete params.endDate;
    //   }
    //   this.onLoad(this.page, params);
    //   done();
    // },
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
      const temp = Object.assign(params, this.query, pageConf);
      const searchParams = {};
      // 清楚空值，否者查询不到数据
      Object.keys(temp).forEach((item) => {
        if (item === "dispatchTime") {
          const [beginDate, endDate] = temp.dispatchTime;
          searchParams.beginDate = beginDate;
          searchParams.endDate = endDate;
        } else {
          const val = temp[item];
          if (val) {
            searchParams[item] = val;
          }
        }
      });
      getCombinLogList(searchParams).then((res) => {
        const data = res.data.data;
        this.loading = false;
        this.data = data.records.map((item) => {
          const [receiveTime, dispatchTime = receiveTime] =
            item.tenantId.split(",");
          const [receiveFlag, dispatchFlag = receiveFlag] =
            item.statusList.split(",");
          // const dispatchStatus = dispatchFlag == "1" ? "成功" : "失败";
          const dispatchStatus = dispatchFlag == "1" ? '成功' : (dispatchFlag == "2" ? '已触达' : '失败');
          return {
            ...item,
            receiveTime,
            dispatchTime,
            dispatchStatus,
          };
        });
        this.page.total = data.total;
      });
    },
  },
};
</script>

<style scoped lang="scss">
/deep/ .el-date-editor .el-range-input {
  width: 100%;
}
</style>
