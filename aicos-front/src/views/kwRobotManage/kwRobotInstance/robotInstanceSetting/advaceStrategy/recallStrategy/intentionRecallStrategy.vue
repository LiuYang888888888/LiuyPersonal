<template>
  <el-form :model="formData" size="small">
    <el-card :header="$t('kwRobotManage.knowledgeRecall')" class="setting-card">
      <el-form-item :label="$t('kwRobotManage.selectionRange')">
        <el-select v-model="recallScope">
          <el-option
            :label="$t('kwRobotManage.generalRecall')"
            value="all"
          ></el-option>
          <el-option
            :label="$t('kwRobotManage.noRecallAtAll')"
            value="no"
          ></el-option>
          <el-option
            :label="$t('kwRobotManage.partialRecall')"
            value="part"
          ></el-option>
        </el-select>
      </el-form-item>
      <p v-if="recallScope === 'part'" class="associated-info">
        {{ $t("kwRobotManage.intentionNumber") }}:
        <el-link type="primary" :underline="false" @click="showSettingDialog">{{
          categoryLength
        }}</el-link>
      </p>
    </el-card>
    <HuilanDialog
      :title="$t('kwRobotManage.associatedDoc')"
      :visible.sync="dialogVisible"
      append-to-body
      width="860px"
    >
      <IntentionRecallAssociationList
        v-if="dialogVisible"
        ref="table"
        :selectedList="formData.intentRecallSetting.intentList"
      />
      <template v-slot:footer>
        <el-button size="small" type="primary" @click="handleOk">{{
          $t("aicosCommon.confirmBtn")
        }}</el-button>
        <el-button size="small" @click="closeSettingDialog">{{
          $t("aicosCommon.cancelBtn")
        }}</el-button>
      </template>
    </HuilanDialog>
  </el-form>
</template>
<script>
import IntentionRecallAssociationList from "./intentionRecallAssociationList";
// import { deepClone } from "@/util/util";
export default {
  name: "intentionRecallStrategy",
  components: {
    IntentionRecallAssociationList,
  },
  props: {
    settings: {
      type: Object,
      default() {
        return {
          intentRecallSetting: {
            topIntentIds: ["-1"],
            intentList: [],
          },
        };
      },
    },
  },
  data() {
    return {
      recallScope: "all",
      formData: this.settings,
      // formData: {
      //   intentRecallSetting: {
      //     topIntentIds: [],
      //     intentList: []
      //   }
      // },
      dialogVisible: false,
      serverSideDocInfo: {
        topIntentIds: [],
        intentList: [],
      },
    };
  },
  computed: {
    categoryLength() {
      return this.formData.intentRecallSetting.topIntentIds.length;
    },
  },
  watch: {
    recallScope(newVal) {
      const map = {
        all: {
          topIntentIds: ["-1"],
          intentList: [],
        },
        part: this.serverSideDocInfo,
        no: {
          topIntentIds: [],
          intentList: [],
        },
      };
      // this.formData.intentRecallSetting.topIntentIds = map[newVal]
      console.log("before", this.formData.intentRecallSetting);
      Object.assign(this.formData.intentRecallSetting, map[newVal]);
      console.log("after", this.formData.intentRecallSetting);
    },
  },
  mounted() {
    this.initRecallScope();
  },
  methods: {
    initRecallScope() {
      const list = this.formData.intentRecallSetting.topIntentIds;
      if (list.length === 0) {
        this.recallScope = "no";
      } else if (list.length === 1 && list[0] === "-1") {
        this.recallScope = "all";
      } else {
        this.recallScope = "part";
        const intentRecallSetting = this.formData.intentRecallSetting;
        this.serverSideDocInfo = {
          topIntentIds: intentRecallSetting.topIntentIds,
          intentList: intentRecallSetting.intentList,
        };
      }
    },
    showSettingDialog() {
      this.dialogVisible = true;
    },
    closeSettingDialog() {
      this.dialogVisible = false;
    },
    handleOk() {
      const data = this.$refs.table.getSelectedInfo();
      // this.formData.intentRecallSetting.topIntentIds = data;
      Object.assign(this.formData.intentRecallSetting, data);
      // Object.assign(this.serverSideDocInfo, data);
      this.closeSettingDialog();
    },
  },
};
</script>

<style scoped lang="scss">
.setting-card {
  margin-top: 20px;
  padding-left: 20px;

  /deep/.el-card__header {
    padding-top: 13px !important;
    padding-bottom: 13px !important;
  }

  /deep/.el-card__body {
    padding-left: 50px;
  }
}

.associated-info {
  padding-left: 70px;
  font-size: 14px;
  color: #565863;

  /deep/.el-link {
    margin-left: 5px;
    padding: 0 5px;
    font-weight: 800;
  }
}
</style>
