<template>
  <el-form :model="formData" size="small">
    <el-collapse v-model="activeNames" class="setting-collapse">
      <el-collapse-item :title="$t('kwRobotManage.knowledgeRecall')" name="1">
        <el-form-item :label="$t('kwRobotManage.selectionRange')" style="margin-top: 20px">
          <el-select v-model="recallScope">
            <el-option :label="$t('kwRobotManage.generalRecall')" value="all"></el-option>
            <el-option :label="$t('kwRobotManage.noRecallAtAll')" value="no"></el-option>
            <el-option :label="$t('kwRobotManage.partialRecall')" value="part"></el-option>
          </el-select>
        </el-form-item>
        <p v-if="recallScope === 'part'" class="associated-info">
          {{ $t('kwRobotManage.associatedCategories') }}:
          <el-link type="primary" :underline="false" @click="showSettingDialog">{{ categoryLength }}</el-link>
        </p>
      </el-collapse-item>
      <el-collapse-item :title="$t('kwRobotManage.recallMethods')" name="2">
        <table class="table-form">
          <thead>
            <tr>
              <th>{{ $t('kwRobotManage.recallMethod') }}</th>
              <th>{{ $t('kwRobotManage.enableStatus') }}</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>{{ $t('kwRobotManage.historical') }}</td>
              <td>
                <el-form-item prop="faqRecallSetting.byContextWords">
                  <el-switch v-model="formData.faqRecallSetting.byContextWords" />
                </el-form-item>
              </td>
            </tr>
            <tr>
              <td>{{ $t('kwRobotManage.verification') }}</td>
              <td>
                <el-form-item prop="faqRecallSetting.byCoreWord">
                  <el-switch v-model="formData.faqRecallSetting.byCoreWord" />
                </el-form-item>
              </td>
            </tr>
            <tr>
              <td>{{ $t('kwRobotManage.synonym') }}</td>
              <td>
                <el-form-item prop="faqRecallSetting.byExtSynonymWord">
                  <el-switch v-model="formData.faqRecallSetting.byExtSynonymWord" />
                </el-form-item>
              </td>
            </tr>
            <tr>
              <td>{{ $t('kwRobotManage.keyword') }}</td>
              <td>
                <el-form-item prop="faqRecallSetting.byKeywords">
                  <el-switch v-model="formData.faqRecallSetting.byKeywords" />
                </el-form-item>
              </td>
            </tr>
            <tr>
              <td>{{ $t('kwRobotManage.pinyin') }}</td>
              <td>
                <el-form-item prop="faqRecallSetting.byPinyin">
                  <el-switch v-model="formData.faqRecallSetting.byPinyin" />
                </el-form-item>
              </td>
            </tr>
          </tbody>
        </table>
      </el-collapse-item>
      <el-collapse-item :title="$t('kwRobotManage.recognition')" name="3">
        <p class="tip">
          {{ $t('kwRobotManage.intention') }}
        </p>
        <el-slider class="recall-slider" :min="0" :max="1" :step="0.01" :marks="marks" :format-tooltip="formatTooltip"
          v-model="formData.faqRecallSetting.searchRatioInIntent" />
        <p class="recall-slider-tip">
          <i class="recall-color">●</i>{{ $t('kwRobotManage.recognitionIntention') }}
        </p>
        <p class="recall-slider-tip">
          <i>●</i>{{ $t('kwRobotManage.allRecognitionIntention') }}
        </p>
      </el-collapse-item>
    </el-collapse>
    <HuilanDialog :title="$t('kwRobotManage.associativeClass')" :visible.sync="dialogVisible" append-to-body
      width="400px">
      <FaqRecallAssociationCategory v-if="dialogVisible" ref="tree"
        :extend="formData.faqRecallSetting.lookupCategoryDescendants" :selectedIds="formData.faqRecallSetting.categoryIds"
        :ids="formData.faqRecallSetting.faqRecallData" />
      <template v-slot:footer>
        <el-button size="small" type="primary" @click="handleOk">{{ $t('aicosCommon.confirmBtn') }}</el-button>
        <el-button size="small" @click="closeSettingDialog">{{ $t('aicosCommon.cancelBtn') }}</el-button>
      </template>
    </HuilanDialog>
  </el-form>
</template>
<script>
import FaqRecallAssociationCategory from "./faqRecallAssociationCategory";

export default {
  name: "faqRecallStrategy",
  components: {
    FaqRecallAssociationCategory,
  },
  props: {
    settings: {
      type: Object,
      default () {
        return {};
      },
    },
  },
  data () {
    return {
      activeNames: ["1", "2", "3"],
      recallScope: "all",
      formData: this.settings,
      // formData: {
      //   faqRecallSetting:{
      //     categoryIds: ['b685a75aab91fcf48865f5ab573b46ae', '0bd8c5c62a680d98e75b14efc607c216'],
      //     lookupCategoryDescendants: false,
      //     byContextWords: true,
      //     byCoreWords: true,
      //     byExtSynonymWords: true,
      //     byKeywords: true,
      //     byPinyin: true,
      //     searchRatioInIntent: 0.8
      //   }
      // },
      dialogVisible: false,
      serverSideCategoryInfo: {
        categoryIds: [],
        lookupCategoryDescendants: false,
        faqRecallData: "",
      },
    };
  },
  computed: {
    marks () {
      const val = this.formData.faqRecallSetting.searchRatioInIntent;
      const map = {
        0: "0%",
        [val]: `${Math.floor(val * 100)}%`,
        1: "100%",
      };
      return map;
    },
    categoryLength () {
      return this.formData.faqRecallSetting.categoryIds.length;
    },
  },
  watch: {
    recallScope (newVal) {
      const map = {
        all: {
          categoryIds: ["-1"],
          lookupCategoryDescendants: true,
          faqRecallData: "",
        },
        part: this.serverSideCategoryInfo,
        no: {
          categoryIds: [],
          lookupCategoryDescendants: false,
          faqRecallData: "",
        },
      };
      const data = map[newVal];
      Object.assign(this.formData.faqRecallSetting, data);
    },
  },
  mounted () {
    this.initRecallScope();
  },
  methods: {
    formatTooltip (val) {
      return `${Math.floor(val * 100)}%`;
    },
    initRecallScope () {
      const list = this.formData.faqRecallSetting.categoryIds;
      if (list.length === 0) {
        this.recallScope = "no";
      } else if (list.length === 1 && list[0] === "-1") {
        this.recallScope = "all";
      } else {
        this.recallScope = "part";
        const faqRecallSetting = this.formData.faqRecallSetting;
        this.serverSideCategoryInfo = {
          categoryIds: [...faqRecallSetting.categoryIds],
          lookupCategoryDescendants: faqRecallSetting.lookupCategoryDescendants,
          faqRecallData: faqRecallSetting.faqRecallData,
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
      const data = this.$refs.tree.getSelectedInfo();
      // this.formData.faqRecallSetting.lookupCategoryDescendants = data.lookupCategoryDescendants;
      // this.formData.faqRecallSetting.categoryIds = data.categoryIds;
      Object.assign(this.formData.faqRecallSetting, data);
      this.closeSettingDialog();
    },
  },
};
</script>

<style scoped lang="scss">
.setting-collapse {
  margin-top: 20px;
  margin-left: 20px;
  border-top-color: transparent;

  /deep/.el-collapse-item__wrap {
    border-bottom-color: transparent;
  }

  /deep/.el-collapse-item__header {
    font-size: 16px;
    padding-left: 18px;

    &.is-active {
      border-bottom-color: #ebeef5;
    }
  }

  /deep/.el-collapse-item__content {
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

.tip {
  color: #666666;
}

.table-form {
  width: 630px;
  table-layout: fixed;
  border-collapse: collapse;

  /deep/.el-form-item {
    margin-bottom: 0;
  }
}

.table-form th {
  line-height: 48px;
  font-size: 14px;
  border-top: 1px solid #f3f5f8;
  border-bottom: 1px solid #f3f5f8;
}

.table-form th:first-child {
  width: 200px;
}

.table-form td {
  padding: 8px 0;
  line-height: 32px;
  font-size: 14px;
  text-align: center;
  vertical-align: top;
}

.table-form tbody tr:hover {
  background-color: #f7f9fb;
}

.recall-slider {
  max-width: 600px;
  margin-bottom: 30px;

  /deep/.el-slider__bar {
    background: rgba(236, 125, 1, 1);
  }

  /deep/.el-slider__button {
    border-color: rgba(236, 125, 1, 1);
  }
}

.recall-slider-tip {
  position: relative;
  color: #a1a1a1;
  padding-left: 22px;

  i {
    font-size: 30px;
    line-height: 1;
    vertical-align: top;
    position: absolute;
    left: 0;
    top: -5px;
    color: #e4e7ed;

    &.recall-color {
      color: rgba(236, 125, 1, 1);
    }
  }
}
</style>
