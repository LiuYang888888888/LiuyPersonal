<template>
  <div>
    <el-container>
      <el-aside width="20%" class="kwpolicy-scene-aside">
        <el-card
          class="kwpolicy-scene-cardContainer"
          style="border: 1px solid #999"
          :class="{ isPause: sceneType == 'AskRobotRepeat' }"
          @click.native="clickCard('AskRobotRepeat')"
        >
          <p class="kwpolicy-scene-cardName" style="font-weight: 700">
            {{ $t("kwRobotManage.robotRestate") }}
          </p>
          <span class="kwpolicy-scene-cardIntroduce">{{
            $t("kwRobotManage.broadcast")
          }}</span>
        </el-card>
        <!-- <el-card
        class="kwpolicy-scene-cardContainer"
        :class="{ isPause: sceneType == '2' }"
        @click.native="clickCard(2)"
      >
        <p class="kwpolicy-scene-cardName" style="font-weight: 700">
          语音误识过滤
        </p>
        <span class="kwpolicy-scene-cardIntroduce"
          >TTS可能将某些异响声音识为“嗯”“啊”等文字，通过过滤干预，提高理解准确率</span
        >
      </el-card> -->
        <el-card
          class="kwpolicy-scene-cardContainer"
          :class="{ isPause: sceneType == 'IgnoreUserTalkInRobotSpeaking' }"
          @click.native="clickCard('IgnoreUserTalkInRobotSpeaking')"
        >
          <p class="kwpolicy-scene-cardName" style="font-weight: 700">
            {{ $t("kwRobotManage.ASRresult") }}
          </p>
          <!-- <span class="kwpolicy-scene-cardIntroduce">定义转人工方式</span> -->
        </el-card>
        <!-- <el-card
        class="kwpolicy-scene-cardContainer"
        :class="{ isPause: sceneType == '4' }"
        @click.native="clickCard(4)"
      >
        <p class="kwpolicy-scene-cardName" style="font-weight: 700">
          打断机器人播报
        </p>
        <span class="kwpolicy-scene-cardIntroduce"
          >定义访客需要打断机器人播报时的相关问法</span
        >
      </el-card>
      <el-card
        class="kwpolicy-scene-cardContainer"
        :class="{ isPause: sceneType == '5' }"
        @click.native="clickCard(5)"
      >
        <p class="kwpolicy-scene-cardName" style="font-weight: 700">退出场景</p>
        <span class="kwpolicy-scene-cardIntroduce"
          >定义用户退出场景问答话术，以辅助机器人结束场景对话</span
        >
      </el-card> -->
      </el-aside>
      <el-main>
        <el-collapse v-model="activeNames" class="setting-collapse">
          <el-collapse-item :title="$t('kwRobotManage.threshold')" name="1">
            <p class="tip">{{ $t("kwRobotManage.scenario") }}</p>
            <el-slider
              class="recall-slider"
              :min="0"
              :max="1"
              :step="0.01"
              :marks="marks"
              :format-tooltip="formatTooltip"
              v-model="config.threshold"
            />
            <p class="recall-slider-tip">
              <i>●</i>{{ $t("kwRobotManage.unIdentifyTips") }}
            </p>
            <p class="recall-slider-tip">
              <i class="recall-color">●</i
              >{{ $t("kwRobotManage.identifyTips") }}
            </p>
          </el-collapse-item>
          <el-collapse-item
            :title="$t('kwRobotManage.scenarioQuestion')"
            name="2"
          >
            <p class="tip">{{ $t("kwRobotManage.configQuestions") }}</p>
            <el-menu
              :default-active="activeIndex"
              class="el-menu-demo"
              mode="horizontal"
              @select="handleSelect"
            >
              <el-menu-item index="1" v-show="userShow">{{
                $t("kwRobotManage.userQuestions")
              }}</el-menu-item>
              <!-- <el-menu-item index="3" v-show="filterShow">过滤问法</el-menu-item> -->
              <el-menu-item index="2">{{
                $t("kwRobotManage.exclusionQuestion")
              }}</el-menu-item>
              <!-- <el-menu-item index="4" v-show="autoPolicyShow">自动策略</el-menu-item> -->
            </el-menu>
            <div :key="key">
              <!-- 用户问法 -->
              <UserQuestioning
                :strategyId="strategyId"
                :questionType="questionType"
                :sceneType="sceneType"
                v-show="activeIndex == '1'"
                ref="userQuestion"
                :userData="userData"
              />
              <!-- 排除问法 -->
              <ExclusionMethod
                :strategyId="strategyId"
                :questionType="questionType"
                :sceneType="sceneType"
                v-show="activeIndex == '2'"
                ref="exclusion"
                :exclusionData="exclusionData"
              />
              <!-- <FilterQuestion
              :strategyId="strategyId"
              v-show="activeIndex == '3'"
            />
            <AutomaticPolicy
              :strategyId="strategyId"
              v-show="activeIndex == '4'"
            /> -->
            </div>
          </el-collapse-item>
        </el-collapse>
      </el-main>
    </el-container>
    <div style="text-align: center">
      <el-button size="small" type="primary" @click="savepolicy">{{
        $t("aicosCommon.saveBtn")
      }}</el-button>
    </div>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import UserQuestioning from "./userQuestioning";
import ExclusionMethod from "./exclusionMethod";
import FilterQuestion from "./filterQuestion";
import AutomaticPolicy from "./automaticPolicy";
import { deepClone } from "@/util/util";
export default {
  props: {
    fatherData: {
      type: Object,
      default: () => {},
    },
  },
  data() {
    const { systemIntentSetting } = deepClone(this.fatherData);
    const settingData = {
      systemIntentSetting,
    };
    return {
      activeNames: ["1", "2"],
      botId: "",
      strategyId: "", //策略id
      activeIndex: "1",
      userShow: true, //用户问法
      filterShow: false, //过滤问法
      autoPolicyShow: false, //自动策略
      sceneType: "AskRobotRepeat", //当前卡片场景
      questionType: "1", //问题类型
      config: {
        threshold: 0.8,
      },
      settingData,
      userData: [],
      exclusionData: [],
      key: 0,
    };
  },
  components: {
    UserQuestioning,
    ExclusionMethod,
    FilterQuestion,
    AutomaticPolicy,
  },
  computed: {
    // 计算属性
    ...mapGetters(["botObj", "instanceObj"]),
    marks() {
      const val = this.config.threshold;
      const map = {
        0: "0%",
        [val]: `${Math.floor(val * 100)}%`,
        1: "100%",
      };
      return map;
    },
  },
  created() {
    this.botId = this.botObj.id;
    this.strategyId = this.instanceObj.id;
  },
  mounted() {
    this.settingData.systemIntentSetting.pipeline.map((item) => {
      if (item.name === this.sceneType) {
        this.config.threshold = item.config.threshold;
        item.positiveSentences.forEach((item, index) => {
          this.userData.push({
            id: new Date().getTime() + index,
            content: item,
          });
        });
        item.negativeSentences.forEach((item, index) => {
          this.exclusionData.push({
            id: new Date().getTime() + index,
            content: item,
          });
        });
      }
    });
    if (this.settingData.systemIntentSetting.pipeline.length === 1) {
      this.settingData.systemIntentSetting.pipeline.push({
        config: {
          threshold: 0.8,
        },
        name: "IgnoreUserTalkInRobotSpeaking",
        nameCh: this.$t("kwRobotManage.ASRresult"),
        remark: "",
        positiveSentences: [],
        negativeSentences: [],
      });
    }
  },
  methods: {
    formatTooltip(val) {
      return `${Math.floor(val * 100)}%`;
    },
    //头部tab切换
    handleSelect(key) {
      this.activeIndex = key;
      this.questionType = key;
    },
    //左侧卡片切换
    clickCard(type) {
      this.activeIndex = "1";
      this.sceneType = type;
      let positiveSentences = [],
        negativeSentences = [];
      this.$refs.userQuestion.copyuserQuestionTableData.forEach((item) => {
        positiveSentences.push(item.content);
      });
      this.$refs.exclusion.copyuserQuestionTableData.forEach((item) => {
        negativeSentences.push(item.content);
      });
      this.settingData.systemIntentSetting.pipeline.map((item) => {
        if (item.name !== type) {
          item.config.threshold = deepClone(this.config.threshold);
          item.positiveSentences = deepClone(positiveSentences);
          item.negativeSentences = deepClone(negativeSentences);
        }
        if (item.name === "AskRobotRepeat") {
          item.nameCh = this.$t("kwRobotManage.robotRestate");
          item.remark = this.$t("kwRobotManage.broadcast");
        } else {
          item.nameCh = this.$t("kwRobotManage.ASRresult");
          item.remark = "";
        }
      });
      this.userData = [];
      this.exclusionData = [];
      this.settingData.systemIntentSetting.pipeline.map((item) => {
        if (item.name === type) {
          this.config.threshold = deepClone(item.config.threshold);
          deepClone(item.positiveSentences).forEach((item, index) => {
            this.userData.push({
              id: new Date().getTime() + index,
              content: item,
            });
          });
          deepClone(item.negativeSentences).forEach((item, index) => {
            this.exclusionData.push({
              id: new Date().getTime() + index,
              content: item,
            });
          });
        }
      });
      this.key++;
    },
    savepolicy() {
      let positiveSentences = [],
        negativeSentences = [];
      this.$refs.userQuestion.copyuserQuestionTableData.forEach((item) => {
        positiveSentences.push(item.content);
      });
      this.$refs.exclusion.copyuserQuestionTableData.forEach((item) => {
        negativeSentences.push(item.content);
      });
      this.settingData.systemIntentSetting.pipeline.map((item) => {
        if (item.name === this.sceneType) {
          item.config.threshold = deepClone(this.config.threshold);
          item.positiveSentences = positiveSentences;
          item.negativeSentences = negativeSentences;
        }
      });
      // console.log(this.settingData.systemIntentSetting);
      this.$emit("fatherEvent", deepClone(this.settingData));
    },
  },
};
</script>

<style scoped lang="scss">
/deep/.kwpolicy-scene-aside {
  // border: 1px solid #cdd0d4;
  border-right: 1px solid rgb(243, 245, 248);
  border-left: 0px;
}

.setting-collapse {
  margin-top: 20px;
  margin-left: 20px;
  border-top-color: transparent;

  .tip {
    color: #666666;
  }

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

.recall-slider {
  max-width: 600px;
  margin-bottom: 30px;

  /deep/.el-slider__bar {
    background: #e4e7ed;
  }

  /deep/.el-slider__button {
    border-color: #e4e7ed;
  }

  /deep/.el-slider__runway {
    background-color: rgba(236, 125, 1, 1);
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

.kwpolicy-scene-aside {
  .kwpolicy-scene-cardContainer {
    width: 95% !important;
    margin: 10px 0 10px 0;
    cursor: pointer;
    // border: 1px solid #48a4ff !important;
    box-shadow: rgb(169, 169, 169) 0px 1px 3px !important;

    .kwpolicy-scene-cardName {
      font-weight: 700 !important;
    }

    // /deep/ .el-card__body {
    // 	background-color: #FAFAFA;
    // 	margin: 10px !important;
    // 	box-shadow: rgb(169,169,169) 0px 1px 5px !important;
    // }
    .kwpolicy-scene-cardIntroduce {
      color: #999;
      font-size: 14px;
    }
  }

  .isPause {
    margin: 10px 0 10px 0 !important;
    border: 1px solid #48a4ff !important;
    box-shadow: rgb(28, 116, 227) 0px 3px 5px !important;
  }
}
</style>
