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
      @row-save="rowSave"
      @row-update="rowUpdate"
      @row-del="rowDel"
      @current-change="currentChange"
      @size-change="sizeChange"
      @refresh-change="refreshChange"
      @on-load="onLoad"
    >
      <!-- <template slot-scope="scope" slot="menu">
        <el-button
          v-if="permissionList.send"
          type="text"
          icon="el-icon-s-promotion"
          size="small"
          @click.stop="openSendDialog(scope.row, scope.index)"
          >发送
        </el-button>
        <el-button
          v-if="permissionList.template"
          type="text"
          icon="el-icon-document"
          size="small"
          @click.stop="openTemplateDialog(scope.row)"
          >模板
        </el-button>
        <el-button
          v-if="permissionList.channel"
          type="text"
          icon="el-icon-chat-line-square"
          size="small"
          @click.stop="openChannelDialog(scope.row)"
          >通道
        </el-button>
        <el-button
          v-if="permissionList.enableStatus"
          type="text"
          icon="el-icon-setting"
          size="small"
          @click.stop="enable(scope.row, scope.index)"
          >{{ scope.row.status === "0" ? "启用" : "停用" }}
        </el-button>
      </template> -->
      <template v-slot:menu="scope">
        <HuilanBasicActionTool
          :actions="getRowActions(scope.row)"
          @command="handleCommand($event, scope.row, scope.index)"
        />
      </template>
    </avue-crud>
    <HuilanDialog
      title="模板设置"
      append-to-body
      :visible.sync="templateMgrDialogVisible"
      width="400px"
    >
      <TemplateSelect
        ref="templateSelect"
        v-if="templateMgrDialogVisible"
        :id="curData.id"
      />

      <template #footer>
        <el-button type="primary" size="small" @click.stop="tplOkhandle"
          >确定
        </el-button>
        <el-button
          type="default"
          size="small"
          @click.stop="templateMgrDialogVisible = false"
          >取消
        </el-button>
      </template>
    </HuilanDialog>
    <HuilanDialog
      title="通道设置"
      append-to-body
      :visible.sync="channelMgrDialogVisible"
      width="400px"
    >
      <ChannelSelect
        ref="channelSelect"
        v-if="channelMgrDialogVisible"
        :id="curData.id"
      />

      <template #footer>
        <el-button type="primary" size="small" @click.stop="okhandle"
          >确定
        </el-button>
        <el-button
          type="default"
          size="small"
          @click.stop="channelMgrDialogVisible = false"
          >取消
        </el-button>
      </template>
    </HuilanDialog>
    <HuilanDialog
      title="发送消息"
      append-to-body
      :visible.sync="sendDialogVisible"
      width="900px"
    >
      <SendMessage
        ref="sendMsg"
        v-if="sendDialogVisible"
        :id="curData.id"
        :secret="curData.secret"
        @success="sendDialogVisible = false"
      />

      <template #footer>
        <!--        <el-button-->
        <!--          type="primary"-->
        <!--          size="small"-->
        <!--          @click.stop="okhandle"-->
        <!--        >发送-->
        <!--        </el-button>-->
        <el-button
          type="default"
          size="small"
          @click.stop="sendDialogVisible = false"
          >关闭
        </el-button>
      </template>
    </HuilanDialog>
  </HuilanBasic>
</template>

<script>
import ChannelSelect from "./channelSelect";
import TemplateSelect from "./templateSelect";
import SendMessage from "./sendMessage";
import {
  getList,
  add,
  update,
  remove,
  getChannelByProducerId,
  saveProducerChannel,
  saveProducerTemplate,
} from "@/api/messageSourceMgr";
import { getRules } from "@/util/regx";
import { mapGetters } from "vuex";
export default {
  name: "index",
  components: {
    TemplateSelect,
    ChannelSelect,
    SendMessage,
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
        searchShow: true,
        searchMenuSpan: 6,
        border: true,
        index: true,
        addBtn: false,
        header: false,
        editBtn:false,
        delBtn:false,
        // selection: true,
        // 操作按钮
        // addBtn: false,
        // editBtn: false,
        // delBtn: false,
        // viewBtn: false,
        menuWidth: 250,
        dialogWidth: "40%",
        dialogType: "drawer",
        dialogCustomClass: "huilan-drawer-form",
        column: [
          {
            label: "渠道编码",
            prop: "id",
            span: 24,
            addDisplay: false,
            editDetail: true,
            width: 240,
          },
          {
            label: "渠道Secret",
            prop: "secret",
            span: 24,
            addDisplay: false,
            editDetail: true,
            hide: true,
          },
          {
            label: "渠道名称",
            prop: "name",
            span: 24,
            // search: true,
            maxlength: 50,
            showWordLimit: true,
            rules: [
              {
                required: true,
                message: "请输入渠道名称",
                trigger: "blur",
              },
              ...getRules(["charNumHan"]),
            ],
          },
          {
            label: "ip",
            prop: "ip",
            span: 24,
            width: 110,
            rules: getRules(["ip"]),
          },
          {
            label: "绑定通道",
            prop: "channelNames",
            span: 24,
            addDisplay: false,
            editDisplay: false,
          },
          {
            label: "状态",
            prop: "status",
            span: 24,
            type: "switch",
            width: 60,
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
      searchForm: {
        name: "",
      },
      searchFieldList: [
        {
          prop: "name",
          placeholder: "请输入渠道名称",
        },
      ],
      templateMgrDialogVisible: false,
      channelMgrDialogVisible: false,
      curData: {},
      sendDialogVisible: false,
    };
  },
  computed: {
    ...mapGetters(["permission"]),
    permissionList() {
      return {
        addBtn: this.vaildData(this.permission["message-source-add"], false),
        // viewBtn: this.vaildData(this.permission['system-user-view'], false),
        delBtn: this.vaildData(this.permission["message-source-delete"], false),
        editBtn: this.vaildData(
          this.permission["message-source-update"],
          false
        ),
        enableStatus: this.vaildData(
          this.permission["message-source-enableStatus"],
          false
        ),
        send: this.vaildData(this.permission["message-source-send"], false),
        template: this.vaildData(
          this.permission["message-source-template"],
          false
        ),
        channel: this.vaildData(
          this.permission["message-source-channel"],
          false
        ),
      };
    },
  },
  methods: {
    getRowActions(row) {
      const map = {
        editBtn: {
          name: "编辑",
          command: "rowEdit",
        },
        delBtn: {
          name: "删除",
          command: "rowDel",
        },
        send: {
          name: "发送",
          command: "openSendDialog",
        },
        template: {
          name: "模板",
          command: "openTemplateDialog",
        },
        channel: {
          name: "通道",
          command: "openChannelDialog",
        },
        enableStatus: {
          name: row.status === "0" ? "启用" : "停用",
          command: "enable",
        },
      };
      const list = ["editBtn",'delBtn','send','template','channel','enableStatus'];
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
        current: page.currentPage,
        size: page.pageSize,
      };
      this.loading = true;
      getList(Object.assign(params, this.query, pageConf)).then((res) => {
        const data = res.data.data;
        // 获取每条数据绑定的通道信息
        const reqs = data.records.map((item) => {
          return getChannelByProducerId(item.id);
        });

        const tableData = [];
        Promise.all(reqs).then((resData) => {
          resData.forEach(({ data: { data: item } }, index) => {
            tableData.push({
              ...data.records[index],
              channelNames: item.map((item) => item && item.name).join(),
              channels: item,
            });
          });
        });

        this.loading = false;
        this.data = tableData;
        // this.data = data.records;
        this.page.total = data.total;
      });
    },
    rowSave(row, done, loading) {
      // row.account = row.account.trim()
      add(row).then(
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
      // row.deptId = row.deptId.join(",");
      // row.roleId = row.roleId.join(",");
      // row.postId = row.postId.join(",");
      update(row).then(
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
    openTemplateDialog(row) {
      this.curData = row;
      this.templateMgrDialogVisible = true;
    },
    async tplOkhandle() {
      const params = {
        producerId: this.curData.id,
        templateId: this.$refs.templateSelect.getVal(),
      };
      await saveProducerTemplate(params);

      this.refreshChange();
      this.templateMgrDialogVisible = false;
    },
    openChannelDialog(row) {
      this.curData = row;
      this.channelMgrDialogVisible = true;
    },
    async okhandle() {
      const params = {
        producerId: this.curData.id,
        channelId: this.$refs.channelSelect.getVal(),
      };
      await saveProducerChannel(params);

      this.refreshChange();
      this.channelMgrDialogVisible = false;
    },
    openSendDialog(row) {
      this.curData = row;
      this.sendDialogVisible = true;
    },
  },
};
</script>

<style scoped></style>
