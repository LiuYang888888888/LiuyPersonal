<template>
  <div>
    <el-container class="kwpolicy-recall-contant">
      <el-aside width="180px" style="border-right: 1px solid #f3f5f8">
        <h5 class="aside-title">{{ $t("kwRobotManage.selectModule") }}</h5>
        <List
          :data="moduleList"
          clickSelect
          :removeAble="false"
          class="module-list"
          :defaultActive="defaultActive"
          @itemClick="handleModuleItemClick"
        />
      </el-aside>
      <el-main>
        <component :is="curCmp" :settings="settingData"></component>
      </el-main>
    </el-container>
    <div style="text-align: center">
      <el-button type="primary" size="small" @click="handleSubmit">{{
        $t("aicosCommon.saveBtn")
      }}</el-button>
    </div>
  </div>
</template>

<script>
import List from "@/components/list";
import FaqRecallStrategy from "./faqRecallStrategy";
import TableRecallStrategy from "./tableRecallStrategy";
import DocRecallStrategy from "./docRecallStrategy";
import IntentionRecallStrategy from "./intentionRecallStrategy";
import { listData } from "@/api/kwRobot/kwRobotTrain/index";
import { deepClone } from "@/util/util";

// import { getById } from "@/api/kwRobot/kwRobotTrain/index";

export default {
  name: "RecallStrategy",
  components: {
    List,
    FaqRecallStrategy,
    TableRecallStrategy,
    DocRecallStrategy,
    IntentionRecallStrategy,
  },
  props: {
    fatherData: {
      type: Object,
      default() {
        return {};
      },
    },
  },
  data() {
    const {
      faqRecallSetting,
      tableRecallSetting,
      docRecallSetting,
      intentRecallSetting,
    } = deepClone(this.fatherData);
    const settingData = {
      faqRecallSetting,
      tableRecallSetting,
      docRecallSetting,
      intentRecallSetting: this.validatenull(intentRecallSetting)
        ? {
          topIntentIds: ["-1"],
          intentList: [],
        }
        : intentRecallSetting,
    };
    return {
      settingData,
      moduleList: [
        { id: "faq", label: this.$t("kwRobotManage.FAQKnowledge"), refId: 1 },
        {
          id: "table",
          label: this.$t("kwRobotManage.tableKnowledge"),
          refId: 2,
        },
        {
          id: "doc",
          label: this.$t("kwRobotManage.documentKnowledge"),
          refId: 3,
        },
        {
          id: "intention",
          label: this.$t("kwRobotManage.intentCall"),
          refId: 4,
        },
      ],
      curModule: {},
      defaultActive: "faq",
      curCmp: "FaqRecallStrategy",
    };
  },
  created() {
    this.getModuleStatus();
  },
  methods: {
    handleModuleItemClick(item) {
      const map = {
        faq: "FaqRecallStrategy",
        table: "TableRecallStrategy",
        doc: "DocRecallStrategy",
        intention: "IntentionRecallStrategy",
      };
      this.curModule = item;
      this.curCmp = map[item.id];
    },
    getModuleStatus() {
      const postData = {
        current: 1,
        size: 1000,
        botId: this.$store.getters.botObj.id,
      };
      listData(postData).then((res) => {
        const data = res.data.data.records;
        data.forEach((item) => {
          this.moduleList.forEach((module) => {
            if (module.refId === item.type) {
              module.label +=
                item.isUse === 0
                  ? this.$t("kwRobotManage.deactivated")
                  : this.$t("kwRobotManage.enabled");
            }
          });
        });
      });
    },
    handleSubmit() {
      // if (
      //   this.settingData.faqRecallSetting.categoryIds.length === 0 ||
      //   this.settingData.tableRecallSetting.tableCategoryIds.length === 0 ||
      //   this.settingData.docRecallSetting.docIds.length === 0
      // ) {
      //   this.$alert("请选择知识召回分类", "", {
      //     confirmButtonText: "知道了",
      //   });
      //   return false;
      // }
      this.$emit("fatherEvent", this.settingData);
    },
  },
};
</script>

<style lang="scss" scoped>
.aside-title {
  line-height: 48px;
  margin: 20px 0 0;
  font-size: 16px;
  font-weight: 400;
  color: #070b2d;
}

.module-list {
  /deep/li {
    line-height: 36px;
  }
}
</style>
