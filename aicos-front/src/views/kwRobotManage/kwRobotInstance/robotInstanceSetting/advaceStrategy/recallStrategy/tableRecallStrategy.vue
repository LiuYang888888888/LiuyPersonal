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
        {{ $t('kwRobotManage.associatedCategories') }}:
        <el-link type="primary" :underline="false" @click="showSettingDialog">{{
          categoryLength
        }}</el-link>
      </p>
    </el-card>
    <HuilanDialog :title="$t('kwRobotManage.associativeClass')" :visible.sync="dialogVisible" append-to-body width="400px">
      <TableRecallAssociationCategory v-if="dialogVisible" ref="table"
        :extend="formData.tableRecallSetting.lookupCategoryDescendants"
        :selectedIds="formData.tableRecallSetting.tableCategoryIds" />
      <template v-slot:footer>
        <el-button size="small" type="primary" @click="handleOk">{{ $t('aicosCommon.confirmBtn') }}</el-button>
        <el-button size="small" @click="closeSettingDialog">{{ $t('aicosCommon.cancelBtn') }}</el-button>
      </template>
    </HuilanDialog>
  </el-form>
</template>
<script>
import TableRecallAssociationCategory from "./tableRecallAssociationCategory";
export default {
  name: "tableRecallStrategy",
  components: {
    TableRecallAssociationCategory,
  },
  props: {
    settings: {
      type: Object,
      default: () => {
        return {
          tableRecallSetting: {
            tableCategoryIds: [],
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
      //   tableRecallSetting: {
      //     tableCategoryIds: ['ec84dfe70a6576ee879477eb17050f99'],
      //   }
      // },
      dialogVisible: false,
      serverSideTableIds: [],
    };
  },
  computed: {
    categoryLength () {
      return this.formData.tableRecallSetting.tableCategoryIds.length;
    },
  },
  watch: {
    recallScope (newVal) {
      const map = {
        all: ["-1"],
        part: this.serverSideTableIds,
        no: [],
      };
      this.formData.tableRecallSetting.tableCategoryIds = map[newVal];
    },
  },
  mounted () {
    this.initRecallScope();
  },
  methods: {
    initRecallScope () {
      const list = this.formData.tableRecallSetting.tableCategoryIds;
      if (list.length === 0) {
        this.recallScope = "no";
      } else if (list.length === 1 && list[0] === "-1") {
        this.recallScope = "all";
      } else {
        this.recallScope = "part";
        this.serverSideTableIds = [
          ...this.formData.tableRecallSetting.tableCategoryIds,
        ];
      }
    },
    showSettingDialog () {
      this.dialogVisible = true;
    },
    closeSettingDialog () {
      this.dialogVisible = false;
    },
    handleOk () {
      // const data = this.$refs.table.getSelectedIds();

      // this.closeSettingDialog();
      const data = this.$refs.table.getSelectedInfo();
      Object.assign(this.formData.tableRecallSetting, data);
      // this.formData.tableRecallSetting.tableCategoryIds = data;
      console.log(data);
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
