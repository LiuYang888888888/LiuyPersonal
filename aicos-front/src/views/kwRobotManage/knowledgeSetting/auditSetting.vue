<template>
  <HuilanBasic hasTab>
    <div class="kwAuMian">
      <div class="kwAuType">
        <avue-tabs :option="tabOption" @change="tabChange"></avue-tabs>
      </div>
      <div class="kwAuSet">
        <div class="verifyFormClass">
          <avue-form
            :option="verifyFormOption"
            ref="verifyFormRef"
            v-model="verifyFormData"
            @submit="verifyFormSave"
            :loading="loading"
          >
            <template slot-scope="{ size }" slot="menuForm">
              <el-button
                type="primary"
                :size="size"
                icon="el-icon-check"
                :loading="loading"
                @click.stop="verifyFormSave"
                >{{ $t("auditSetting.saveConfiguration") }}</el-button
              >
            </template>
            <template slot="isAudit">
              <el-radio-group
                v-model="verifyFormData.isAudit"
                @input="changeIsAudit"
              >
                <el-radio :label="1">{{ $t("auditSetting.open") }}</el-radio>
                <el-radio :label="0">{{
                  $t("auditSetting.notTurnedOn")
                }}</el-radio>
              </el-radio-group>
            </template>
            <template slot="dynamic">
              <div>
                <el-button size="small" type="primary" @click="addNode">{{
                  $t("auditSetting.addNode")
                }}</el-button>
                <span style="color: #ccc; margin-left: 5px">{{
                  $t("auditSetting.maximumNodesTips")
                }}</span>
              </div>
              <div style="margin-top: 10px">
                <div
                  v-for="(item, i) in nodeList"
                  :key="i"
                  style="position: relative"
                >
                  <div>{{ i + 1 }}</div>
                  <Addnode class="addnode" :rowData="item" ref="addNode" />
                  <el-button
                    type="text"
                    class="el-icon-delete"
                    @click="delNode(i)"
                    style="
                      position: absolute;
                      top: 0px;
                      right: 10px;
                      color: #f56c6c;
                    "
                  ></el-button>
                </div>
              </div>
            </template>
          </avue-form>
        </div>
      </div>
    </div>
  </HuilanBasic>
</template>

<script>
import { mapGetters } from "vuex";

// import { isNull, } from '@/util/qsgCommon.js';
import Addnode from "./addnode";
import { getAuditSetting } from "@/views/kwRobotManage/kwAudit/kwAuditCommon";
import {
  // getKwAuditSetting,
  saveKwAuditSetting,
  // getKmProcessVersionFlow,
  save,
  publishFlow
} from "@/api/kwKnowledgeCenter/kwAudit/index";
import { deepClone } from "@/util/util";
import { buildFlowableProcessData } from "@/util/flow";
// import { save, publishFlow } from "@/api/system/flow";

export default {
  name: "kwAuditSetting",
  components: {
    Addnode,
  },
  computed: {
    ...mapGetters(["userInfo", "permission", "language"]),
    permissionList() {
      return {
        // addBtn: this.vaildData(this.permission[`qusn-bank-add`], false),
      };
    },
  },
  data() {
    return {
      tabActive: 1,
      tabOption: {
        column: [
          {
            label: this.$t("auditSetting.fqaKnowledge"),
            value: 1,
          },
          {
            label: this.$t("auditSetting.tableKnowledge"),
            value: 4,
          },
          {
            label: this.$t("auditSetting.documentKnowledge"),
            value: 2,
          },
          // {
          //   label: '对话流程',
          //   value: 5,
          // },
          {
            label: this.$t("auditSetting.chattingKnowledge"),
            value: 3,
          },
        ],
      },

      loading: false,

      verifyFormKey: 0,
      saveForm: {},
      verifyFormData: {
        isAudit: 0,
        processDefineId: "",
        flowModelId: "",
        flowModelJson: "",
      },
      verifyFormReload: 1,
      verifyFormOption: {
        submitBtn: false,
        //submitText:"保存审核配置",
        emptyBtn: false,
        //menuPosition:'right',
        labelWidth: 120,
        column: [
          {
            label: "ID",
            prop: "id",
            span: 24,
            display: false,
          },
          {
            label: this.$t("auditSetting.enableAudit"),
            prop: "isAudit",
            // span: 24,
            // row: true,
            // type: "radio",
            // dicData: [
            //   { label: "开启", value: 1 },
            //   { label: "不开启", value: 0 },
            // ],
            value: 0,
            // change: ({ value }) => {
            //   const processDefineIdColumn = this.findObject(
            //     this.verifyFormOption.column,
            //     "processDefineId"
            //   );
            //   if (value != 1) {
            //     this.$set(processDefineIdColumn, "display", false);
            //     this.loading = false;
            //   } else if (value == 1) {
            //     this.loading = true;
            //     const dataParam = {
            //       botId: this.$store.state.user.currentTenantId,
            //     };
            //     getKmProcessVersionFlow(dataParam).then((res) => {
            //       processDefineIdColumn.dicData = res.data.data.map((item) => {
            //         if (item.processId == this.verifyFormData.processDefineId) {
            //           item.usedByFormText = "[ 已选配置 ]  ";
            //         } else {
            //           item.usedByFormText = "";
            //         }
            //         item.showLabel = item.name + "  (" + item.version + ")";
            //         return item;
            //       });
            //       this.$set(processDefineIdColumn, "display", true);
            //       this.loading = false;
            //     });
            //   }
            // },
          },
          {
            label: this.$t("auditSetting.reviewProcessNode"),
            prop: "dynamic",
            display: false,
            // type: "dynamic",
            span: 24,
            // children: {
            //   column: [
            //     {
            //       label: "节点名称",
            //       prop: "nideName",
            //       span: 8,
            //       width: 200,
            //       maxLength: 50,
            //       rules: [
            //         {
            //           required: true,
            //           message: "请输入节点名称",
            //           trigger: "blur",
            //         },
            //       ],
            //     },
            //     {
            //       label: "审核人员",
            //       prop: "remindPeopleData",
            //       width:270,
            //       rules: [
            //         {
            //           required: true,
            //           message: "请选择提醒人员",
            //           trigger: "blur",
            //         },
            //       ],
            //     },
            //     {
            //       label: "消息提醒",
            //       prop: "sendMessage",
            //       type: "switch",
            //       width: 100,
            //       change: ({ value }) => {
            //         const dynamic = this.findObject(
            //           this.verifyFormOption.column,
            //           "dynamic"
            //         );
            //         const reminderMethodData = this.findObject(
            //           dynamic.children.column,
            //           "reminderMethodData"
            //         );
            //         if (value) {
            //           reminderMethodData.hide = false;
            //         } else {
            //           reminderMethodData.hide = true;
            //         }
            //       },
            //       value: false,
            //     },
            //     {
            //       label: "提醒方式",
            //       display: false,
            //       hide: true,
            //       prop: "reminderMethodData",
            //       span: 24,
            //     },
            //   ],
            // },
          },

          // {
          //   label:'工作流',
          //   prop: 'processDefineId',
          //   span: 24,
          //   row:true,
          //   display:false,
          //   type: 'select',
          //   value:'',
          //   dicData:[],
          //   props: {
          //     label: 'name',
          //     value: 'processId',
          //     desc: 'usedByFormText'
          //   },
          //   rules: [
          //     {
          //       required: true,
          //       message: "请选择工作流",
          //       trigger: "blur"
          //     }
          //   ],
          //   // change: ({ value }) => {
          //   //   console.log(value);
          //   // },
          // },
        ],
      },
      nodeList: [],
    };
  },
  created() {},
  mounted() {
    this.verifyFormOption.labelPosition =
      this.language !== "zh" ? "top" : "right";
    this.getSetting();
  },
  methods: {
    changeIsAudit() {
      const dynamic = this.findObject(this.verifyFormOption.column, "dynamic");
      if (this.verifyFormData.isAudit == 1) {
        if (this.validatenull(this.verifyFormData.processDefineId)) {
          let modelKey = "",
            name = "";
          // faq
          if (this.tabActive === 1) {
            modelKey = "faq" + new Date().getTime();
            name = "FAQ审核流程" + new Date().getTime();
          }
          // 闲聊
          if (this.tabActive === 2) {
            modelKey = "chat" + new Date().getTime();
            name = "闲聊知识审核流程" + new Date().getTime();
          }
          if (this.tabActive === 3) {
            modelKey = "doc" + new Date().getTime();
            name = "文档知识审核流程" + new Date().getTime();
          }
          if (this.tabActive === 4) {
            modelKey = "table" + new Date().getTime();
            name = "表格知识审核流程" + new Date().getTime();
          }
          if (this.tabActive === 5) {
            modelKey = "flow" + new Date().getTime();
            name = "对话流程审核流程" + new Date().getTime();
          }
          const form = {
            description: "",
            flowWithForm: "3",
            lastUpdated: "",
            modelEditorJsonExtend: "",
            modelKey,
            modelType: 0,
            name,
            status: "",
          };
          save(form).then(
            (res) => {
              if (res.data.success) {
                this.verifyFormData.flowModelId = res.data.data.id;
                this.saveForm = res.data.data;
              }
            },
            (error) => {
              window.console.log(error);
            }
          );
        }
        dynamic.display = true;
      } else {
        dynamic.display = false;
      }
    },
    addNode() {
      if (this.nodeList.length >= 5) {
        this.$message({
          message: this.$t("auditSetting.maximumNodesTips"),
          type: "warning",
        });
        return;
      }
      this.nodeList.push({
        id: "a" + new Date().getTime(),
        label: "",
        handler: [],
        sendMessage: false,
        messageList: [],
      });
    },
    delNode(i) {
      this.nodeList.splice(i, 1);
    },
    tabChange(data) {
      this.tabActive = data.value;
      this.getSetting();
    },

    getSetting() {
      const dataParam = {
        kmType: this.tabActive || 1,
        tenantId: this.$store.state.user.currentTenantId,
      };

      this.nodeList = [];
      getAuditSetting(dataParam).then((res) => {
        const resData = res;
        this.verifyFormKey++;
        const dynamic = this.findObject(
          this.verifyFormOption.column,
          "dynamic"
        );
        dynamic.display = false;
        if (!this.validatenull(resData)) {
          if (!this.validatenull(resData.flowModelJson)) {
            let flowModelJson = JSON.parse(resData.flowModelJson);
            this.nodeList = deepClone(flowModelJson.nodeList);
            this.saveForm = flowModelJson.saveForm;
          }
          this.verifyFormData.isAudit = resData.approvalProcessStatus ? 1 : 0;
          this.verifyFormData.processDefineId = resData.processDefineId;
          this.verifyFormData.flowModelId = resData.flowModelId;
          if (this.verifyFormData.isAudit == 1) {
            dynamic.display = true;
          }
        } else {
          this.verifyFormData.isAudit = 0;
        }
      });
    },
    // 流程发布
    getProcessDefineId(row) {
      const param = {
        modelKey: row.modelKey,
        modelId: row.id,
        category: "",
      };
      if (row.modelEditorJsonExtend) {
        const ext = JSON.parse(row.modelEditorJsonExtend);
        param.formId = ext.processData.formId;
      }
      return param;
    },
    // 流程设计保存
    saveDesign(list) {
      const listCopy = deepClone(list);
      const processInfo = {
        id: this.saveForm.id,
        modelKey: this.saveForm.modelKey,
        name: this.saveForm.name,
      };
      const param = listCopy.map((item) => {
        const abc = deepClone(item.handler.user);
        item.handler = [];
        abc.map((t) => {
          let obj = {
            id: t.account,
            name: t.realName,
            type: "user",
          };
          item.handler.push(obj);
        });
        return item;
      });
      const data = buildFlowableProcessData(param, processInfo);
      this.saveForm.modelEditorJson = JSON.stringify(data);
      return this.saveForm;
    },
    // 保存审核配置
    verifyFormSave() {
      this.loading = true;
      this.$refs.verifyFormRef.validate(async (valid) => {
        if (valid) {
          let nodeList = this.nodeList,
            approvalUsers = [];
          if (this.verifyFormData.isAudit == 1) {
            if (
              this.$refs.addNode !== undefined &&
              this.$refs.addNode.length > 0
            ) {
              let node = this.$refs.addNode.map((item) => item.onSubmit());
              if (this.validatenull(node[0])) {
                this.loading = false;
                return false;
              }
              if (node.includes(false)) {
                this.loading = false;
                return false;
              }
              nodeList = [...node];
            } else {
              this.$message.warning(this.$t("auditSetting.auditNode"));
              this.loading = false;
              return false;
            }
          }
          this.loading = false;
          let item = await this.saveDesign(deepClone(nodeList));
          nodeList.map((item) => {
            const abc = deepClone(item.handler.user);
            abc.map((t) => {
              let obj = {
                approvalUser: t.realName,
                approvalUserId: t.account,
                flowNodeId: item.id,
              };
              approvalUsers.push(obj);
            });
          });
          if (!this.verifyFormData.isAudit) {
            this.$confirm(this.$t("auditSetting.closePrompt"), {
              confirmButtonText: this.$t("aicosCommon.confirmBtn"),
              cancelButtonText: this.$t("aicosCommon.cancelBtn"),
              type: "warning",
            })
              .then(async () => {
                const dataParam = {
                  approvalProcessStatus: this.verifyFormData.isAudit == 1,
                  approvalUsers,
                  processDefineId: this.verifyFormData.processDefineId,
                  kmType: this.tabActive || 1,
                  tenantId: this.$store.state.user.currentTenantId,
                  flowModelJson: JSON.stringify({
                    nodeList: deepClone(nodeList),
                    saveForm: deepClone(this.saveForm),
                  }),
                  flowModelId: this.verifyFormData.flowModelId,
                };
                saveKwAuditSetting(dataParam).then(
                  (/* res */) => {
                    this.$message({
                      message: this.$t("aicosCommon.saveSuccessTip"),
                      type: "success",
                    });
                    this.verifyFormKey++;
                    this.loading = false;
                  },
                  (error) => {
                    window.console.log(error);
                    this.loading = false;
                  }
                );
              })
              // .catch(() => {
              //   this.$message({
              //     type: "info",
              //     message: "已取消关闭",
              //   });
              // });
          } else {
            save(item).then(async (res) => {
              if (res.data.success) {
                let param = await this.getProcessDefineId(
                  deepClone(this.saveForm)
                );
                await publishFlow(param).then(
                  (res) => {
                    if (res.data.success) {
                      let processDefineId = res.data.data.processId;
                      const dataParam = {
                        approvalProcessStatus: this.verifyFormData.isAudit == 1,
                        approvalUsers,
                        processDefineId,
                        kmType: this.tabActive || 1,
                        tenantId: this.$store.state.user.currentTenantId,
                        flowModelJson: JSON.stringify({
                          nodeList: deepClone(nodeList),
                          saveForm: deepClone(this.saveForm),
                        }),
                        flowModelId: this.verifyFormData.flowModelId,
                      };
                      saveKwAuditSetting(dataParam).then(
                        (/* res */) => {
                          this.$message({
                            message: this.$t("aicosCommon.saveSuccessTip"),
                            type: "success",
                          });
                          this.verifyFormKey++;
                          this.loading = false;
                        },
                        (error) => {
                          window.console.log(error);
                          this.loading = false;
                        }
                      );
                    }
                  },
                  (error) => {
                    window.console.log(error);
                  }
                );
              }
            });
          }
        } else {
          this.loading = false;
          console.log("error submit!!!");
        }
      });
    },
  },
};
</script>

<style lang="scss" scoped>
.kwAuSet {
  padding: 10px 30px 30px;
  background-color: #fff;
  margin: 0px;

  .verifyFormClass {
    // width: 560px;
    .addnode {
      padding: 20px 30px 5px 10px;
      background-color: #f6f6f6;
      border-radius: 10px;
      margin-bottom: 10px;
    }
  }
}
</style>
