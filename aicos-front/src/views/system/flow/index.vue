<template>
  <HuilanBasic>
    <HuilanBasicHeader title="流程管理">
      <el-button
        v-if="permissionList.addBtn"
        type="primary"
        size="small"
        @click="handleAdd"
        >新增</el-button
      >
      <el-button size="small" @click="handleFlowMsgConfig"
        >流程消息配置</el-button
      >
    </HuilanBasicHeader>
    <HuilanBasicSearchbar
      :model="searchForm"
      :fields="searchFieldList"
      @search="searchChange"
    >
    </HuilanBasicSearchbar>
    <avue-crud
      :option="option"
      :search.sync="query"
      :table-loading="loading"
      :data="data"
      ref="crud"
      v-model="form"
      @row-del="rowDel"
      @row-update="rowUpdate"
      @row-save="rowSave"
      :before-open="beforeOpen"
      :page.sync="page"
      @current-change="currentChange"
      @size-change="sizeChange"
      @refresh-change="refreshChange"
      @on-load="onLoad"
    >
      <!--      <template slot="menuLeft">-->
      <!--        <el-button-->
      <!--          icon="el-icon-edit-outline"-->
      <!--          size="small"-->
      <!--          @click.stop="designFlow()"-->
      <!--        >流程设计-->
      <!--        </el-button>-->
      <!--      </template>-->
      <!--      <template v-slot:searchMenu="{row,size}">-->
      <!--        <el-button :size="size" @click="handleFlowMsgConfig(row)">流程消息配置</el-button>-->
      <!--      </template>-->
      <template v-slot:menu="scope">
        <!--        <el-button-->
        <!--          type="text"-->
        <!--          icon="el-icon-edit-outline"-->
        <!--          size="small"-->
        <!--          v-if="permissionList.design"-->
        <!--          @click.stop="designFlow(scope.row,scope.index)"-->
        <!--        >流程设计-->
        <!--        </el-button>-->
        <!--        <el-button-->
        <!--          type="text"-->
        <!--          icon="el-icon-tickets"-->
        <!--          size="small"-->
        <!--          v-if="permissionList.version"-->
        <!--          @click.stop="showVersionList(scope.row,scope.index)"-->
        <!--        >版本查看-->
        <!--        </el-button>-->
        <!--        <el-button-->
        <!--          type="text"-->
        <!--          icon="el-icon-position"-->
        <!--          size="small"-->
        <!--          v-if="permissionList.publish"-->
        <!--          :disabled="scope.row.status === '1'"-->
        <!--          @click.stop="publishFLow(scope.row,scope.index)"-->
        <!--        >发布流程-->
        <!--        </el-button>-->
        <HuilanBasicActionTool
          :actions="getRowActions(scope.row)"
          @command="handleCommand($event, scope.row, scope.index)"
        />
        <!--        <el-button-->
        <!--          type="text"-->
        <!--          icon="el-icon-position"-->
        <!--          size="small"-->
        <!--          v-if="permissionList.design"-->
        <!--          @click.stop="$refs.crud.rowDel(scope.row,scope.index)"-->
        <!--        >删除-->
        <!--        </el-button>-->
        <!--        <el-button-->
        <!--          type="text"-->
        <!--          icon="el-icon-circle-plus-outline"-->
        <!--          size="small"-->
        <!--          v-if="permissionList.enableLock"-->
        <!--          @click.stop="lock(scope.row,scope.index)"-->
        <!--        >{{scope.row.is_lock === '0' ? '锁定' : '解锁'}}-->
        <!--        </el-button>-->
      </template>
      <template slot="flowWithForm" slot-scope="{ row }">
        <span v-if="row.flowWithForm === '1'">工单处理</span>
        <span v-if="row.flowWithForm === '0'">文章审核</span>
        <span v-if="row.flowWithForm === '2'">信息收录</span>
        <span v-if="row.flowWithForm === '3'">知识审核</span>
      </template>
    </avue-crud>
    <HuilanDialog
      title="流程设计"
      append-to-body
      :fullscreen="true"
      :visible.sync="designVisible"
      class="flow-design-dialog"
    >
      <FlowSetting
        v-if="designVisible"
        ref="flowSetting"
        :type="flowType"
        :flowData="flowSettingData"
      />
      <template v-slot:footer>
        <el-button size="small" @click="cancelDesign">取消</el-button>
        <el-button type="primary" size="small" @click="saveDesign"
          >确定</el-button
        >
      </template>
    </HuilanDialog>

    <HuilanDialog
      title="版本查看"
      append-to-body
      :visible.sync="versionDialogVisible"
    >
      <PublishedFlowMgr
        v-if="versionDialogVisible"
        :modelKey="curRow.modelKey"
      />
      <template v-slot:footer>
        <!--        <el-button size="small" type="primary" @click="saveFormDesign">关闭</el-button>-->
        <el-button size="small" @click="versionDialogVisible = false"
          >关闭</el-button
        >
      </template>
    </HuilanDialog>

    <el-drawer
      title="流程消息配置"
      append-to-body
      :visible.sync="msgTplDialogVisible"
      class="flow-msg-tpl-dialog"
      size="70%"
    >
      <basic-container>
        <MessageTemplate />
      </basic-container>
      <template v-slot:footer>
        <!--        <el-button size="small" type="primary" @click="saveFormDesign">关闭</el-button>-->
        <el-button size="small" @click="msgTplDialogVisible = false"
          >关闭</el-button
        >
      </template>
    </el-drawer>
  </HuilanBasic>
</template>

<script>
import { mapGetters } from "vuex";
import { getList, save, remove, publishFlow } from "@/api/system/flow";
import FlowSetting from "./flowSetting";
import PublishedFlowMgr from "./publishedFlow";
import MessageTemplate from "../messageTemplate";
import { getRules } from "@/util/regx";
import { deepClone } from "@/util/util";

import { defaultDynaNameData } from "@/util/qsgCommon.js";

import { baseURL } from "@/api/common";

export default {
  name: "FlowMgr",
  components: {
    // HuilanFlowDesinger
    FlowSetting,
    PublishedFlowMgr,
    MessageTemplate,
  },
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
        header: false,
        tip: false,
        searchShow: true,
        searchMenuSpan: 7,
        border: false,
        index: true,
        selection: false,
        viewBtn: false,
        editBtn: false,
        delBtn: false,
        menuWidth: 300,
        dialogClickModal: false,
        dialogWidth: "30%",
        dialogType: "drawer",
        dialogCustomClass: "huilan-drawer-form",
        column: [
          {
            label: "编码",
            prop: "modelKey",
            // search: true,
            span: 24,
            editDisabled: true,
            maxlength: 100,
            rules: [
              {
                required: true,
                message: "请输入编码",
                trigger: "blur",
              },
              {
                pattern: /^[a-zA-Z]/,
                message: "首字母必须为字母",
                trigger: "blur",
              },
              ...getRules(["charNum"]),
            ],
          },
          {
            label: "名称",
            prop: "name",
            span: 24,
            maxlength: 50,
            showWordLimit: true,
            // search: true,
            rules: [
              {
                required: true,
                message: "请输入表单名称",
                trigger: "blur",
              },
              ...getRules(["charNumHanUnderline"]),
            ],
          },
          {
            label: "类型",
            prop: "flowWithForm",
            type: "select",
            editDisabled: true,
            clearable: false,
            // flowWithForm=0：无表单+简化流程 1：有表单+复杂流程 2：有表单+简单流程
            dicData: [
              { label: "工单处理", value: "1" },
              { label: "文章审核", value: "0" },
              { label: "信息收录", value: "2" },
              { label: "知识审核", value: "3", disabled: true },
            ],
            value: "1",
          },
          {
            label: "关联表单",
            prop: "modelEditorJsonExtend",
            addDisplay: false,
            editDisplay: false,
            // display: false,
            span: 24,
            formatter: function (row, value) {
              let text = "";
              if (value) {
                const json = JSON.parse(value);
                text = json.processData.formName;
              }
              return text || "--";
            },
          },
          {
            label: "发布状态",
            prop: "status",
            type: "radio",
            addDisplay: false,
            editDisplay: false,
            // search: true,
            // searchSpan:5,
            span: 24,
            width: 120,
            dicData: [
              {
                label: "草稿",
                value: "0",
              },
              {
                label: "已发布",
                value: "1",
              },
            ],
          },
          {
            label: "更新时间",
            prop: "lastUpdated",
            addDisplay: false,
            editDisplay: false,
            span: 24,
            type: "datetime",
            format: "yyyy-MM-dd HH:mm:ss",
            valueFormat: "yyyy-MM-dd HH:mm:ss",
          },
          {
            label: "描述",
            prop: "description",
            span: 24,
            type: "textarea",
            align: "right",
            maxlength: 100,
            showWordLimit: true,
            width: 80,
            hide: true,
            rules: getRules(["expectSpecials"]),
          },
        ],
      },
      designVisible: false,
      curRow: {
        modelEditorJsonExtend: "",
      },
      versionDialogVisible: false,
      msgTplDialogVisible: false,
      searchForm: {
        modelKey: "",
        name: "",
        status: "",
      },
      searchFieldList: [
        {
          // type: 'input',
          prop: "modelKey",
          placeholder: "请输入编码",
        },
        {
          type: "input",
          prop: "name",
          placeholder: "请输入名称",
        },
        {
          type: "select",
          prop: "status",
          placeholder: "请选择发布状态",
          dicData: [
            {
              label: "草稿",
              value: "0",
            },
            {
              label: "已发布",
              value: "1",
            },
          ],
        },
      ],
      rowActions: [],
    };
  },
  computed: {
    ...mapGetters(["permission"]),
    permissionList() {
      return {
        addBtn: this.vaildData(this.permission["system-flow-save"], false),
        viewBtn: this.vaildData(this.permission["system-flow-view"], false),
        delBtn: this.vaildData(this.permission["system-flow-delete"], false),
        editBtn: this.vaildData(this.permission["system-flow-edit"], false),
        design: this.vaildData(this.permission["system-flow-design"], false),
        publish: this.vaildData(this.permission["system-flow-publish"], false),
        version: this.vaildData(this.permission["system-flow-version"], false),
      };
    },
    flowSettingData() {
      if (this.curRow.modelEditorJsonExtend) {
        return JSON.parse(this.curRow.modelEditorJsonExtend);
      } else {
        return {};
      }
    },
    flowType() {
      const map = {
        0: "noForm",
        1: "normal",
        2: "noForm",
        3: "noForm",
      };
      return map[this.curRow.flowWithForm];
    },
  },
  mounted() {
    // 收起左侧菜单
    if (this.$store.getters.isCollapse) {
      this.$store.commit("SET_COLLAPSE");
    }

    // 根据url参数，路由参数，baseurl参数，sysCode 设置 flowWithForm
    this.setSysCodeByParam();
  },
  methods: {
    setSysCodeByParam() {
      // console.log('setSysCodeByParam');

      const flowWithFormColumn = this.findObject(
        this.option.column,
        "flowWithForm"
      );

      let defaultDicData = [
        { label: "工单处理", value: "1" },
        { label: "文章审核", value: "0" },
        { label: "信息收录", value: "2" },
        { label: "知识审核", value: "3", disabled: true },
      ];

      // this.$route.query.sysCode ?sysCode=aicos,workOrder,aisite,aicc
      // baseURL /aicos/
      let sysCode = this.$route.query.sysCode || baseURL || "aicos";
      sysCode = sysCode.replace(/\//g, "");

      // console.log('sysCode', sysCode);

      let resDic = [];

      if (sysCode.includes("aicc")) {
        resDic.push({ label: "知识审核", value: "3", disabled: true });
      }
      if (sysCode.includes("workOrder")) {
        resDic.push({ label: "工单处理", value: "1" });
      }

      if (sysCode.includes("aisite")) {
        resDic.push({ label: "文章审核", value: "0" });
      }

      if (resDic.length === 0 || sysCode.includes("aicos")) {
        resDic = defaultDicData;
      }

      let resDicValue = resDic[0].value;

      this.$set(flowWithFormColumn, "dicData", resDic);
      this.$set(flowWithFormColumn, "value", resDicValue);

      // this.$set(flowWithFormColumn, 'disabled', true);
    },
    rowSave(data, done, loading) {
      // const data = {
      //   ...rest,
      //   modelKey
      // }
      save(data).then(
        () => {
          // 获取新增数据的相关字段
          this.$message({
            type: "success",
            message: "操作成功!",
          });
          // 数据回调进行刷新
          this.onLoad(this.page);
          done();
        },
        (error) => {
          window.console.log(error);
          loading();
        }
      );
    },
    rowUpdate(row, index, done, loading) {
      this.rowSave(row, done, loading);
      // update(row).then(() => {
      //   this.$message({
      //     type: "success",
      //     message: "操作成功!"
      //   });
      //   // 数据回调进行刷新
      //   this.onLoad(this.page)
      //   done();
      // }, error => {
      //   window.console.log(error);
      //   loading();
      // });
    },
    rowDel(row, index, done) {
      let formId = "";
      if (row.modelEditorJsonExtend) {
        const ext = JSON.parse(row.modelEditorJsonExtend);
        formId = ext.processData.formId;
      }
      this.$confirm("确定将选择数据删除?", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          return remove({
            id: row.id,
            formId,
            modelKey: row.modelKey,
          });
        })
        .then(() => {
          this.$message({
            type: "success",
            message: "操作成功!",
          });
          // 数据回调进行刷新
          this.onLoad(this.page);
          done();
        });
    },
    beforeOpen(done, type) {
      // if (["add"].includes(type)) {
      //   this.form.formJson = ''
      // }
      if (["view"].includes(type)) {
        let text = this.form.modelEditorJsonExtend;
        if (text) {
          const json = JSON.parse(text);
          text = json.processData.formName;
        }
        this.form.modelEditorJsonExtend = text;
      }
      done();
    },
    searchChange() {
      this.query = {
        ...this.searchForm,
      };
      // this.parentId = '';
      this.page.currentPage = 1;
      this.onLoad();
    },
    currentChange(currentPage) {
      this.page.currentPage = currentPage;
    },
    sizeChange(pageSize) {
      this.page.pageSize = pageSize;
    },
    refreshChange() {
      this.onLoad();
    },
    onLoad() {
      const params = {
        current: this.page.currentPage,
        size: this.page.pageSize,
        ...this.query,
      };
      this.loading = true;
      getList(params).then((res) => {
        const data = res.data.data;
        this.loading = false;
        this.data = data.records;
        this.page.total = data.total;
      });
    },
    designFlow(row) {
      this.curRow = row;
      this.designVisible = true;
    },
    // 将selectuser组件的数据格式转换为需要提交的数据格式
    formatSelectUserToSubmit(userSetting) {
      const messageNoticeAuth = {
        candidateDynamicUsers: [],
        candidateUsers: [],
        candidateGroups: [],
      };
      if (userSetting.applicant) {
        messageNoticeAuth.candidateDynamicUsers.push({
          value: "${huilan_apply}",
          name: defaultDynaNameData.applicant,
        });
      }
      if (userSetting.applicantLeader) {
        messageNoticeAuth.candidateDynamicUsers.push({
          value: "${huilan_applyLeader}",
          name: defaultDynaNameData.applicantLeader,
        });
      }
      if (userSetting.submitterLeader) {
        messageNoticeAuth.candidateDynamicUsers.push({
          value: "${huilan_submitLeader}",
          name: defaultDynaNameData.submitterLeader,
        });
      }
      if (userSetting.submitDirectLeader) {
        messageNoticeAuth.candidateDynamicUsers.push({
          value: "${huilan_submitDirectLeader}",
          name: defaultDynaNameData.submitDirectLeader,
        });
      }
      userSetting.list.forEach((item) => {
        // console.log('formatSelectUserToSubmit', item)
        if (item.type === "user") {
          messageNoticeAuth.candidateUsers.push({
            value: item.id,
            name: item.name || "",
          });
        } else {
          messageNoticeAuth.candidateGroups.push({
            value: item.id,
            name: item.name || "",
            type: item.type,
          });
        }
      });
      return messageNoticeAuth;
    },
    //将本地的流程属性的数据格式转换为提交时需要的数据格式
    formatProcessDataToSubmit(processData) {
      let processExtCfg = {
        formTemplateVersionId: processData.formId,
        ifSyncCancelIce: processData.ifSyncCancelIce,
        ifOvertime: processData.ifOvertime,
        overtime: processData.overtime,
        overtimeNoticeLoopConfig: processData.overtimeNoticeLoopConfig,
        // overtimeNoticeConfig: processData.curSelectedList,
        ifSupervise: processData.ifSupervise,
        superviseAuth: this.formatSelectUserToSubmit(processData.superviseAuth),
        adminAuth: this.formatSelectUserToSubmit(processData.adminAuth),
      };
      if (processData.reSubmitType === "restart") {
        processExtCfg.afterRejectRecommitToStart = "orderByProcess";
      } else if (processData.reSubmitType === "direct") {
        processExtCfg.afterRejectRecommitToStart = "directToLastNode";
      }
      // processExtCfg.formVariables = gatewayUsedFields.map(item=> {
      //   return {value: item}
      // })

      processExtCfg.overtimeNoticeConfig = processData.curSelectedList.map(
        (item) => {
          return {
            messageType: item.name,
            messageTypeCode: item.type,
            shortMessageTemplate: item.message,
            mailTemplate: item.email,
            messageTemplate: item.internal,
            robotTemplate: item.smart,
            qyWeixinTemplate: item.qyWeixin,
            customTemplate: item.custom,
          };
        }
      );
      // 督办消息提醒
      processExtCfg.superviseNoticeConfig =
        processData.superviseCurSelectedList.map((item) => {
          return {
            messageType: item.name,
            messageTypeCode: item.type,
            shortMessageTemplate: item.message,
            mailTemplate: item.email,
            messageTemplate: item.internal,
            robotTemplate: item.smart,
            qyWeixinTemplate: item.qyWeixin,
            customTemplate: item.custom,
          };
        });

      return processExtCfg;
    },
    saveDesign() {
      const flowSetting = this.$refs.flowSetting;
      const { id, modelKey, name, flowWithForm /*, modelTye, description*/ } =
        this.curRow;
      flowSetting.validate((flag) => {
        if (flag) {
          const { flowableData, gatewayUsedFields, ...editorData } =
            this.$refs.flowSetting.getData();
          const processData = deepClone(editorData.processData);

          if (
            !editorData.desingerData.nodes ||
            !editorData.desingerData.nodes.some(
              (node) => node.type === "startFlowTask"
            )
          ) {
            this.$message.error("流程必须含有开始节点！");
            return;
          }
          if (flowWithForm === "1") {
            if (
              !editorData.desingerData.nodes ||
              !editorData.desingerData.nodes.some(
                (node) => node.type === "startTask"
              )
            ) {
              this.$message.error("工单流程必须含有创建节点！");
              return;
            }
          }
          let processExtCfg = this.formatProcessDataToSubmit(processData);
          // let processExtCfg = {
          //   formTemplateVersionId: processData.formId,
          //   overtime: processData.overtime,
          //   overtimeNoticeLoopConfig: processData.overtimeNoticeLoopConfig,
          //   overtimeNoticeConfig: processData.curSelectedList,
          //   ifSupervise: processData.ifSupervise,
          //   superviseAuth: processData.superviseAuth,
          //   adminAuth: processData.adminAuth,
          // }
          // if(processData.reSubmitType === 'restart') {
          //   processExtCfg.afterRejectRecommitToStart = 'orderByProcess'
          // }else if(processData.reSubmitType === 'direct') {
          //   processExtCfg.afterRejectRecommitToStart = 'directToLastNode'
          // }
          processExtCfg.formVariables = gatewayUsedFields.map((item) => {
            return { value: item };
          });

          processExtCfg.flowWithForm = flowWithForm;

          const modelEditorJson = {
            modelId: id,
            properties: {
              process_id: modelKey,
              name: name,
              documentation: "",
              process_author: "",
              process_version: "",
              process_namespace: "http://www.flowable.org/processdef",
              process_historylevel: "",
              isexecutable: true,
              dataproperties: "",
              executionlisteners: "",
              eventlisteners: "",
              signaldefinitions: "",
              messagedefinitions: "",
              process_potentialstarteruser: "",
              process_potentialstartergroup: "",
              iseagerexecutionfetch: "false",
              custom_node_extend_configuration: JSON.stringify(processExtCfg),
            },
            ...flowableData,
          };
          const submData = {
            ...this.curRow,
            // 前端使用数据
            modelEditorJsonExtend: JSON.stringify(editorData),
            // 后端使用数据
            modelEditorJson: JSON.stringify(modelEditorJson),
          };
          save(submData).then(() => {
            // 数据回调进行刷新
            this.onLoad(this.page);
            this.designVisible = false;
          });
        }
      });
    },
    cancelDesign() {
      this.designVisible = false;
    },
    publishFLow(row) {
      const param = {
        modelKey: row.modelKey,
        modelId: row.id,
        category: "",
      };
      if (row.modelEditorJsonExtend) {
        const ext = JSON.parse(row.modelEditorJsonExtend);
        param.formId = ext.processData.formId;
      }
      this.$confirm("确定将发布流程?", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          return publishFlow(param);
        })
        .then(() => {
          this.$message({
            type: "success",
            message: "发布成功!",
          });
          // 数据回调进行刷新
          this.onLoad(this.page);
        });
    },
    showVersionList(row) {
      this.curRow = row;
      this.versionDialogVisible = true;
    },
    handleFlowMsgConfig() {
      // debugger
      this.msgTplDialogVisible = true;
    },
    handleAdd() {
      this.$refs.crud.rowAdd();
    },
    // rowStyle({row}) {
    //   return {
    //     background: '#e3f3ff'
    //   }
    // }
    getRowActions(row) {
      const map = {
        viewBtn: {
          name: "查看",
          command: "rowView",
        },
        delBtn: {
          name: "删除",
          command: "rowDel",
        },
        editBtn: {
          name: "编辑",
          command: "rowEdit",
        },
        design: {
          name: "流程设计",
          command: "designFlow",
        },
        version: {
          name: "版本查看",
          command: "showVersionList",
        },
        publish: {
          name: "流程发布",
          command: "publishFLow",
        },
      };
      const kwList = ["viewBtn", "editBtn"];
      const otherList = [
        "viewBtn",
        "editBtn",
        "design",
        "version",
        "publish",
        "delBtn",
      ];
      const list = row.flowWithForm !== "3" ? otherList : kwList;

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
  },
};
</script>

<style scoped lang="scss">
.flow-design-dialog {
  /deep/.el-dialog {
    position: relative;
  }
  /deep/ .el-dialog__body {
    height: calc(100% - 60px);
    padding: 0;
  }
  /deep/ .el-dialog__footer {
    position: absolute;
    top: 56px;
    right: 20px;
  }
  /deep/ .el-dialog__footer .el-button {
    width: 70px;
  }
}
.flow-msg-tpl-dialog {
  /deep/ .el-dialog__body {
    //height: calc(100% - 120px);
    padding: 0;
  }
}
</style>
