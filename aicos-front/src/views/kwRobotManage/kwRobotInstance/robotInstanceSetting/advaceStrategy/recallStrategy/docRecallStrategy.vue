<template>
  <el-form :model="formData" size="small">
    <el-card :header="$t('kwRobotManage.knowledgeRecall')" class="setting-card">
      <el-form-item :label="$t('kwRobotManage.selectionRange')">
        <el-select v-model="recallScope">
          <el-option :label="$t('kwRobotManage.generalRecall')" value="all"></el-option>
          <el-option :label="$t('kwRobotManage.noRecallAtAll')" value="no"></el-option>
          <el-option :label="$t('kwRobotManage.partialRecall')" value="part"></el-option>
        </el-select>
      </el-form-item>
      <p v-if="recallScope === 'part'" class="associated-info">
        {{ $t('kwRobotManage.associatedDocuments') }}:
        <el-link type="primary" :underline="false" @click="showSettingDialog">{{
          categoryLength
        }}</el-link>
      </p>
    </el-card>
    <HuilanDialog :title="$t('kwRobotManage.associatedDoc')" :visible.sync="dialogVisible" append-to-body width="860px">
      <DocRecallAssociationList v-if="dialogVisible" ref="table" :selectedList="formData.docRecallSetting.docList" />
      <template v-slot:footer>
        <el-button size="small" type="primary" @click="handleOk">{{ $t('aicosCommon.confirmBtn') }}</el-button>
        <el-button size="small" @click="closeSettingDialog">{{ $t('aicosCommon.cancelBtn') }}</el-button>
      </template>
    </HuilanDialog>
  </el-form>
</template>
<script>
import DocRecallAssociationList from "./docRecallAssociationList";
export default {
  name: "docRecallStrategy",
  components: {
    DocRecallAssociationList,
  },
  props: {
    settings: {
      type: Object,
      default () {
        return {
          docRecallSetting: {
            docIds: [],
          },
        };
      },
    },
  },
  data () {
    return {
      recallScope: "all",
      formData: this.settings,
      // formData: {
      //   docRecallSetting: {
      //     docIds: [],
      //     docList: []
      //   }
      // },
      dialogVisible: false,
      serverSideDocInfo: {
        docIds: [],
        docList: [],
      },
    };
  },
  computed: {
    categoryLength () {
      return this.formData.docRecallSetting.docIds.length;
    },
  },
  watch: {
    recallScope (newVal) {
      const map = {
        all: {
          docIds: ["-1"],
          docList: [],
        },
        part: this.serverSideDocInfo,
        no: {
          docIds: [],
          docList: [],
        },
      };
      // this.formData.docRecallSetting.docIds = map[newVal]
      console.log("before", this.formData.docRecallSetting);
      Object.assign(this.formData.docRecallSetting, map[newVal]);
      console.log("after", this.formData.docRecallSetting);
    },
  },
  mounted () {
    this.initRecallScope();
  },
  methods: {
    initRecallScope () {
      const list = this.formData.docRecallSetting.docIds;
      if (list.length === 0) {
        this.recallScope = "no";
      } else if (list.length === 1 && list[0] === "-1") {
        this.recallScope = "all";
      } else {
        this.recallScope = "part";
        const docRecallSetting = this.formData.docRecallSetting;
        this.serverSideDocInfo = {
          docIds: docRecallSetting.docIds,
          docList: docRecallSetting.docList,
        };
      }
    },
    showSettingDialog () {
      this.dialogVisible = true;
    },
    closeSettingDialog () {
      this.dialogVisible = false;
    },
    handleOk () {
      const data = this.$refs.table.getSelectedInfo();
      // this.formData.docRecallSetting.docIds = data;
      Object.assign(this.formData.docRecallSetting, data);
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
