<template>
  <HuilanBasic>
    <HuilanBasicToolbar style="margin-top: 0">
      <el-button
        v-if="permissionList.addBtn"
        type="primary"
        size="small"
        @click="handleAdd"
        >新增</el-button
      >
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
      :page.sync="page"
      :permission="permissionList"
      :before-open="beforeOpen"
      @row-save="rowSave"
      @row-update="rowUpdate"
      @row-del="rowDel"
      @current-change="currentChange"
      @size-change="sizeChange"
      @refresh-change="refreshChange"
      @on-load="onLoad"
    >
      <template slot-scope="scope" slot="menu">
        <!-- <el-button
          v-if="permissionList.enableStatus"
          type="text"
          icon="el-icon-setting"
          size="small"
          @click.stop="enable(scope.row, scope.index)"
          >{{ scope.row.status === "0" ? "启用" : "停用" }}
        </el-button> -->
        <!--        <el-button-->
        <!--          type="text"-->
        <!--          icon="el-icon-document"-->
        <!--          size="small"-->
        <!--          @click.stop="onLoad(scope.row,scope.index)"-->
        <!--        >统计-->
        <!--        </el-button>-->
      </template>
      <template v-slot:menu="scope">
        <HuilanBasicActionTool
          :actions="getRowActions(scope.row)"
          @command="handleCommand($event, scope.row, scope.index)"
        />
      </template>
      <template #menuForm>
        <el-button
          v-if="testFormOpt.column && testFormOpt.column.length > 0"
          type="info"
          icon="el-icon-setting"
          size="small"
          @click.stop="openSendTest"
          >测试
        </el-button>
      </template>
    </avue-crud>
    <HuilanDialog
      title="测试"
      append-to-body
      :visible.sync="sendTestDialogVisible"
      width="400px"
      @closed="closeTestDialog"
    >
      <avue-form
        ref="sendTestForm"
        v-model="sendTestForm"
        :option="sendTestFormOption"
        @submit="submitSendTest"
      />
    </HuilanDialog>
  </HuilanBasic>
</template>

<script>
import {
  getList,
  add,
  update,
  remove,
  sendTest,
} from "@/api/messageChannelMgr";
// import { getDictionary } from '@/api/system/dict'
import { getRules } from "@/util/regx";
import { mapGetters } from "vuex";
export default {
  name: "BaseChannel",
  props: {
    extCls: {
      type: Array,
      default() {
        return [];
      },
    },
    type: String,
    labelWidth: Number,
    testFormOpt: {
      type: Object,
      default() {
        return {};
      },
    },
    // permissionList: {
    //   type: Object,
    //   default() {
    //     return {}
    //   }
    // }
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
      searchForm: {
        name: "",
      },
      searchFieldList: [
        {
          prop: "name",
          placeholder: "请输入通道名称",
        },
      ],
      option: {
        tip: false,
        searchShow: true,
        searchMenuSpan: 6,
        border: true,
        index: true,
        labelWidth: this.labelWidth,
        header: false,
        // selection: true,
        // 操作按钮
        addBtn: false,
        editBtn: false,
        delBtn: false,
        viewBtn: false,
        menuWidth: 180,
        dialogClickModal: false,
        dialogWidth: "40%",
        dialogType: "drawer",
        dialogCustomClass: "huilan-drawer-form",
        column: [
          {
            label: "通道编码",
            prop: "id",
            span: 24,
            addDisplay: false,
            width: 300,
            overHidden: true,
            editDetail: true,
          },
          {
            label: "通道名称",
            prop: "name",
            span: 24,
            // search: true,
            maxlength: 50,
            showWordLimit: true,
            rules: [
              {
                required: true,
                message: "请输入通道名称",
                trigger: "blur",
              },
              {
                max: 50,
                message: "超出最大长度",
                trigger: "blur",
              },
              ...getRules(["charNumHan"]),
            ],
          },
          {
            label: "状态",
            prop: "status",
            span: 24,
            type: "switch",
            width: 70,
            dicData: [
              {
                label: "停用",
                value: "0",
              },
              {
                label: "启用",
                value: "1",
              },
            ],
            value: "1",
          },
          {
            label: "备注",
            prop: "remark",
            type: "textarea",
            maxlength: 100,
            showWordLimit: true,
            rules: getRules(["expectSpecials"]),
            span: 24,
            hide: true,
          },
        ],
      },
      dynicCols: [],
      sendTestDialogVisible: false,
      sendTestForm: {},
    };
  },
  computed: {
    ...mapGetters(["permission"]),
    permissionList() {
      return {
        addBtn: this.vaildData(
          this.permission[`message-channel-${this.type}-add`],
          false
        ),
        // viewBtn: this.vaildData(this.permission['system-user-view'], false),
        delBtn: this.vaildData(
          this.permission[`message-channel-${this.type}-delete`],
          false
        ),
        editBtn: this.vaildData(
          this.permission[`message-channel-${this.type}-update`],
          false
        ),
        enableStatus: this.vaildData(
          this.permission[`message-channel-${this.type}-enableStatus`],
          false
        ),
      };
    },
    sendTestFormOption() {
      const option = this.testFormOpt;

      return option;
    },
  },
  // watch: {
  //   testFormOpt() {
  //     sendTestForm
  //   }
  // },
  methods: {
    getRowActions(row) {
      let map = {};

      map = {
        editBtn: {
          name: "编辑",
          command: "rowEdit",
        },
        delBtn: {
          name: "删除",
          command: "rowDel",
        },
        enableStatus: {
          name: row.status === "0" ? "启用" : "停用",
          command: "enable",
        },
      };

      const list = ["viewBtn", "editBtn", "delBtn", "enableStatus"];
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
    handleAdd() {
      this.$refs.crud.rowAdd();
    },
    configColumn() {
      this.$refs.crud.$refs.dialogColumn.columnBox = true;
    },
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
        type: this.type,
        current: page.currentPage,
        size: page.pageSize,
      };
      this.loading = true;
      getList(Object.assign(params, this.query, pageConf)).then((res) => {
        const data = res.data.data;
        this.loading = false;
        //企业微信列表特殊处理
        if (this.type === "qyweixin") {
          const tempData = [];
          data.records.map((item) => {
            tempData.push({
              ...item,
              ...JSON.parse(item.config),
            });
          });
          this.data = tempData;
        } else {
          this.data = data.records;
        }

        this.page.total = data.total;
      });
    },
    beforeOpen(done, type) {
      if (type === "edit") {
        let cfg = JSON.parse(this.form.config);
        if (this.type === "custom") {
          const ext = [];
          for (const [key, value] of Object.entries(cfg)) {
            ext.push({ key, value });
          }
          cfg = { ext };
        }
        this.form = {
          ...this.form,
          ...cfg,
        };
      }
      done();
    },
    buidSubmitData({ id, name, status, remark, ...others }) {
      const temp = {};
      // custom时只有ext字段
      if (this.type === "custom") {
        const extList = others.ext;
        extList.forEach((item) => {
          temp[item.key] = item.value;
        });
      } else {
        this.dynicCols.forEach((key) => {
          if (this.type === "weixin") {
            // 微信只需要cloudvendorId
            if (key === "cloudvendorId") {
              temp[key] = others[key];
            }
          } else {
            temp[key] = others[key];
          }
        });
      }
      let extData = {};
      if (this.type === "weixin") {
        const props = ["weixinId", "weixinMail", "weixinName", "weixinType"];
        props.forEach((item) => {
          extData[item] = others[item];
        });
      }
      const data = {
        id,
        name,
        status,
        remark,
        type: this.type,
        config: JSON.stringify(temp),
        ...extData,
      };
      return data;
    },
    rowSave(row, done, loading) {
      const data = this.buidSubmitData(row);
      add(data).then(
        () => {
          // this.initFlag = false;
          this.onLoad(this.page);
          this.$message({
            type: "success",
            message: "操作成功!",
          });
          done();
        },
        (error) => {
          window.console.log(error);
          loading();
        }
      );
    },
    rowUpdate(row, index, done, loading) {
      const data = this.buidSubmitData(row);
      update(data).then(
        () => {
          this.onLoad(this.page);
          this.$message({
            type: "success",
            message: "操作成功!",
          });
          done();
        },
        (error) => {
          window.console.log(error);
          loading();
        }
      );
    },
    rowDel(row) {
      this.$confirm("确定将选择数据删除?", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          return remove(row.id);
        })
        .then(() => {
          this.onLoad(this.page);
          this.$message({
            type: "success",
            message: "操作成功!",
          });
        });
    },
    enable(row) {
      const data = { ...row };
      if (data.status === "0") {
        data.status = "1";
      } else {
        data.status = "0";
      }
      update(data).then(
        () => {
          // this.initFlag = false;
          this.onLoad(this.page);
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
    openSendTest() {
      this.sendTestDialogVisible = true;
    },
    async submitSendTest(data, done) {
      const curFormData = this.buidSubmitData(this.form);
      const params = {
        channelType: curFormData.type,
        channelConfig: curFormData.config,
        // accepter: '',
        // title: ''
        ...this.sendTestForm,
      };
      try {
        await sendTest(params);

        done();
        this.$message.success("发送成功！");
        // this.sendTestForm = {}
        // this.$refs.sendTestForm.resetForm()
        this.sendTestDialogVisible = false;
      } catch (e) {
        done();
      }
    },
    closeTestDialog() {
      // 恢复默认值
      const sendTestForm = this.$refs.sendTestForm;
      sendTestForm.dataFormat();
      sendTestForm.setVal();
      sendTestForm.clearValidate();
    },
    extOption() {
      const keys = this.extCls.map((item) => item.prop);
      // keys.push('ext')
      this.dynicCols = keys;
      const columns = this.option.column;
      columns.splice(2, 0, ...this.extCls);
    },
  },
  mounted() {
    // this.getConfig()
    this.extOption();
  },
};
</script>

<style scoped></style>
