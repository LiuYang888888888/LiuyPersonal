<template>
  <el-tabs v-model="activeTab" class="flow-setting">
    <el-tab-pane label="流程编辑" name="first" lazy :disabled="designerDisable">
      <HuilanFlowDesinger
        ref="desinger"
        :formId="processData.formId"
        :formFields="processData.formFieldList"
        :flowData="desingerData"
        :processInfo="processData"
        :type="type"
        class="design-flow HuilanFlowDesinger"
      />
    </el-tab-pane>
    <el-tab-pane label="流程设置" name="sec">
      <div class="design-flow processProp">
        <el-scrollbar>
          <ProcessProp ref="processProp" :type="type" :form="processData" />
        </el-scrollbar>
      </div>
    </el-tab-pane>
    <el-tab-pane
      v-if="type !== 'noForm'"
      label="流程表单"
      name="third"
      lazy
      :disabled="processData.formName === ''"
    >
      <div class="design-flow flowForm">
        <el-scrollbar>
          <avue-form
            v-model="flowFormData"
            :option="processData.formTemplateJson"
          />
        </el-scrollbar>
      </div>
    </el-tab-pane>
  </el-tabs>
</template>

<script>
import HuilanFlowDesinger from "./desinger";
import ProcessProp from "./desinger/components/processProp";
export default {
  name: "FlowSetting",
  components: {
    HuilanFlowDesinger,
    ProcessProp,
  },
  props: {
    flowData: {
      type: Object,
      default() {
        return {};
      },
    },
    type: {
      type: String,
      // noForm、normal、simple
      default: "normal",
    },
  },
  data() {
    return {
      activeTab: "first",
      processData: {
        formName: "",
        formId: "",
        formFieldList: [],
        formTemplateJson: {},
        reSubmitType: "restart",
        ifSyncCancelIce: false,
        ifOvertime: false,
        overtime: {
          number: "",
          unit: "day",
        },
        overtimeNoticeLoopConfig: {
          ifNotice: false,
          ifLoop: true,
          number: 24,
          unit: "day",
        },
        overtimeNoticeConfig: [
          {
            name: "超时提醒",
            type: "overtime",
            disabled: true,
            message: "",
            email: "",
            internal: "",
            qyWeixin: '',
            smart: "",
          },
        ],
        // 修改后的数据
        curSelectedList: [],
        ifSupervise: false,
        superviseAuth: {
          list: [],
          // includeChildren: false,
          applicant: false,
          applicantLeader: false,
          submitterLeader: false,
          submitDirectLeader: false
        },
        superviseNoticeConfig: [
          {
            name: '督办提醒',
            type: 'supervise',
            disabled: true,
            message: '',
            email: '',
            internal: '',
            qyWeixin: '',
            smart: ''
          },
        ],
        superviseCurSelectedList: [],
        adminAuth: {
          list: [],
          // includeChildren: false,
          applicant: false,
          applicantLeader: false,
          submitterLeader: false,
          submitDirectLeader: false
        },
      },
      desingerData: {},
      flowFormData: {},
    };
  },
  computed: {
    designerDisable() {
      let res = false;
      if (this.type !== "noForm") {
        if (this.processData.formName === "") {
          res = true;
        }
      }
      return res;
    },
  },
  watch: {
    flowData: {
      handler(newVal) {
        if (newVal.processData) {
          const defaultData = this.getDefaultProcessData();
          const processData = {
            // 对老数据进行兼容
            ...defaultData,
            ...newVal.processData,
          };
          if (newVal.processData.curSelectedList) {
            processData.overtimeNoticeConfig = newVal.processData.curSelectedList;
          }
          // newVal.processData中可能含有overtimeNoticeConfig属性
          if(processData.overtimeNoticeConfig.length === 0) {
            processData.overtimeNoticeConfig = defaultData.overtimeNoticeConfig
          }
          if (newVal.processData.superviseCurSelectedList && newVal.processData.superviseCurSelectedList.length > 0) {
            processData.superviseNoticeConfig = newVal.processData.superviseCurSelectedList;
          }
          // newVal.processData中可能含有superviseNoticeConfig属性
          if(processData.superviseNoticeConfig.length === 0) {
            processData.superviseNoticeConfig = defaultData.superviseNoticeConfig
          }
          this.processData = processData;
        } else {
          this.processData = this.getDefaultProcessData();
        }
        if (newVal.desingerData) {
          this.desingerData = newVal.desingerData;
        } else {
          this.desingerData = {
            combos: [],
            edges: [],
            nodes: [],
          };
        }
        if (this.type !== "noForm") {
          // 没有设置表单时，跳转到设置表单的tab
          if (this.processData.formName === "") {
            this.activeTab = "sec";
          }
        }
      },
      immediate: true,
    },
  },
  methods: {
    getDefaultProcessData() {
      return {
        formName: "",
        formId: "",
        formFieldList: [],
        formTemplateJson: {},
        reSubmitType: "restart",
        ifSyncCancelIce: false,
        ifOvertime: false,
        overtime: {
          number: "",
          unit: "day",
        },
        overtimeNoticeLoopConfig: {
          ifNotice: false,
          ifLoop: false,
          number: "1",
          unit: "day",
        },
        overtimeNoticeConfig: [
          {
            name: "超时提醒",
            type: "overtime",
            disabled: true,
            message: "",
            email: "",
            internal: "",
            smart: "",
            custom: ''
          },
        ],
        // 修改后的数据
        curSelectedList: [
          {
            name: "超时提醒",
            type: "overtime",
            disabled: true,
            message: "",
            email: "",
            internal: "",
            smart: "",
            custom: ''
          },
        ],
        ifSupervise: false,
        superviseAuth: {
          list: [],
          // includeChildren: false,
          applicant: false,
          applicantLeader: false,
          submitterLeader: false,
          submitDirectLeader: false
        },
        superviseNoticeConfig: [
          {
            name: '督办提醒',
            type: 'supervise',
            disabled: true,
            message: '',
            email: '',
            internal: '',
            qyWeixin: '',
            smart: ''
          },
        ],
        superviseCurSelectedList: [],
        adminAuth: {
          list: [],
          // includeChildren: false,
          applicant: false,
          applicantLeader: false,
          submitterLeader: false,
          submitDirectLeader: false
        },
      };
    },
    validate(callback) {
      return this.$refs.processProp.validate(callback);
    },
    getData() {
      let desingerData = {
        editorData: {},
        flowableData: {},
        gatewayUsedFields: [],
      };
      if (this.$refs.desinger) {
        desingerData = this.$refs.desinger.getData();
      }
      // desingerData.gatewayUsedFields
      return {
        processData: this.processData,
        desingerData: desingerData.editorData,
        flowableData: desingerData.flowableData,
        gatewayUsedFields: desingerData.gatewayUsedFields,
      };
    },
  },
};
</script>

<style lang="scss" scoped>
.flow-setting {
  /deep/.el-tabs__header {
    margin: 0;

    .el-tabs__nav-wrap {
      padding: 0 40px;
    }
    .el-tabs__item {
      padding: 15px 15px 5px;
      height: 60px;
    }
    .el-tabs__active-bar {
      padding: 0 15px;
      box-sizing: content-box;
      margin-left: -15px;
    }
    .el-tabs__nav-wrap::after {
      height: 1px;
    }
  }
  .design-flow {
    height: calc(100vh - 120px);
  }
  .HuilanFlowDesinger {
    background-color: #f8f9fa;
    padding: 20px;
  }
  .processProp {
    padding: 20px;
  }
  .flowForm {
    padding: 20px;
  }
}
</style>
