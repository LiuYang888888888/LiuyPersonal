<template>
  <el-container>
    <el-header class="kwpolicy-header" clearfix>
      <div class="operateBtn-container">
        <!-- 左侧 -->
        <div
          class="left-container"
          :style="language && { 'overflow-x': 'scroll' }"
        >
          <div class="btn-container">
            <el-button size="small" @click="back">{{
              $t("aicosCommon.return")
            }}</el-button>
          </div>
          <div
            class="btn-container"
            @click="jumpStrategy('KwIntentionalPolicy')"
          >
            <div :class="currentNumFlag == 1 ? 'selectOrder' : 'order'">1</div>
            <div :class="currentNumFlag == 1 ? 'selectContent' : 'content'">
              {{ $t("kwRobotManage.intentPolicy") }}
            </div>
          </div>
          <div class="btn-container" @click="jumpStrategy('RecallStrategy')">
            <div :class="currentNumFlag == 2 ? 'selectOrder' : 'order'">2</div>
            <div :class="currentNumFlag == 2 ? 'selectContent' : 'content'">
              {{ $t("kwRobotManage.recallPolicy") }}
            </div>
          </div>
          <div class="btn-container" @click="jumpStrategy('ScenarioStrategy')">
            <div :class="currentNumFlag == 3 ? 'selectOrder' : 'order'">3</div>
            <div :class="currentNumFlag == 3 ? 'selectContent' : 'content'">
              {{ $t("kwRobotManage.scenarioStrategy") }}
            </div>
          </div>
          <div class="btn-container" @click="jumpStrategy('AnswerStrategy')">
            <div :class="currentNumFlag == 4 ? 'selectOrder' : 'order'">4</div>
            <div :class="currentNumFlag == 4 ? 'selectContent' : 'content'">
              {{ $t("kwRobotManage.responsePolicy") }}
            </div>
          </div>
          <div
            class="btn-container"
            @click="jumpStrategy('RecomdMuduleNumberSetting')"
          >
            <div
              class="order"
              :class="currentNumFlag == 5 ? 'selectOrder' : 'order'"
            >
              5
            </div>
            <div :class="currentNumFlag == 5 ? 'selectContent' : 'content'">
              {{ $t("kwRobotManage.recommendedPolicy") }}
            </div>
          </div>
        </div>
        <!-- 右侧 -->
        <div class="right-container" @click="viewFlowChart">
          <i class="aicosicon aicos-icon-hangzhengguanli"></i>
          <div class="content">{{ $t("kwRobotManage.dialogueProces") }}</div>
        </div>
      </div>
    </el-header>
    <el-main class="kwpolicy-main" style="overflow: hidden">
      <div v-if="changeStrategyType == 'index'" class="img-container">
        <img class="image" :src="imgUrl" alt="" />
        <div
          class="choseFirst"
          @mouseenter="enterImage('first')"
          @mouseleave="leaveImage"
          @click="jumpStrategy('KwIntentionalPolicy')"
        ></div>
        <div
          class="choseSecond"
          @mouseenter="enterImage('second')"
          @mouseleave="leaveImage"
          @click="jumpStrategy('RecallStrategy')"
        ></div>
        <div
          class="choseThird"
          @mouseenter="enterImage('third')"
          @mouseleave="leaveImage"
          @click="jumpStrategy('ScenarioStrategy')"
        ></div>
        <div
          class="choseFourth"
          @mouseenter="enterImage('fourth')"
          @mouseleave="leaveImage"
          @click="jumpStrategy('AnswerStrategy')"
        ></div>
        <div
          class="choseFifth"
          @mouseenter="enterImage('fifth')"
          @mouseleave="leaveImage"
          @click="jumpStrategy('RecomdMuduleNumberSetting')"
        ></div>
      </div>
      <div
        class="strategy-container"
        v-else-if="changeStrategyType == 'otherStrategy'"
      >
        <component
          :is="comp"
          @fatherEvent="btnclick"
          :fatherData="allComponentsData"
        />
      </div>
    </el-main>
  </el-container>
</template>

<script>
import KwIntentionalPolicy from "./kwIntentionalPolicy/index";
import RecallStrategy from "./recallStrategy/index";
import ScenarioStrategy from "./scenarioStrategy/index";
import AnswerStrategy from "./answerStrategy/index";
import RecomdMuduleNumberSetting from "./recomdMuduleNumberSetting/index";
import { deepMerge } from "@/util/qsgCommon";
import { deepClone } from "@/util/util";
import { addStrategy } from "@/api/kwRobot/kwRobotTrain/index";
import { mapGetters } from "vuex";
export default {
  name: "",
  data() {
    return {
      currentNumFlag: -1,
      changeStrategyType: "index",
      comp: "KwIntentionalPolicy",
      defaultImg: require("./image/default.png"),
      imgUrl: require("./image/default.png"),
      firstImg: require("./image/first.png"),
      secondImg: require("./image/second.png"),
      thirdImg: require("./image/third.png"),
      fourthImg: require("./image/fourth.png"),
      fifthImg: require("./image/fifth.png"),
      allComponentsData: {},
    };
  },
  components: {
    KwIntentionalPolicy,
    AnswerStrategy,
    RecallStrategy,
    RecomdMuduleNumberSetting,
    ScenarioStrategy,
  },
  computed: {
    // 计算属性
    ...mapGetters([
      "botObj",
      "instanceObj",
      "unknownQuestionReplies",
      "language",
    ]),
  },
  methods: {
    viewFlowChart() {
      this.changeStrategyType = "index";
      this.currentNumFlag = -1;
    },
    jumpStrategy(type) {
      this.changeStrategyType = "otherStrategy";
      this.comp = type;
      // 意图策略配置
      if (type == "KwIntentionalPolicy") {
        this.currentNumFlag = 1;
      } else if (type == "RecallStrategy") {
        // 召回策略配置
        this.currentNumFlag = 2;
      } else if (type == "ScenarioStrategy") {
        // 场景策略配置
        this.currentNumFlag = 3;
      } else if (type == "AnswerStrategy") {
        // 应答策略配置
        this.currentNumFlag = 4;
      } else if (type == "RecomdMuduleNumberSetting") {
        // 推荐策略配置
        this.currentNumFlag = 5;
      }
    },
    btnclick(params) {
      let resultData = deepMerge(this.allComponentsData, params);
      this.allComponentsData = resultData;
      let obj = {
        ...this.instanceObj,
        robotInstanceStrategyBO: {
          ...resultData,
        },
      };
      addStrategy(obj).then((res) => {
        // console.log(res);
        if (res.data.success) {
          this.$message.success(this.$t('aicosCommon.saveSuccessTip'));
        }
      });
    },
    back() {
      this.$emit("backSetting");
    },
    enterImage(flag) {
      if (flag == "first") {
        this.imgUrl = this.firstImg;
      } else if (flag == "second") {
        this.imgUrl = this.secondImg;
      } else if (flag == "third") {
        this.imgUrl = this.thirdImg;
      } else if (flag == "fourth") {
        this.imgUrl = this.fourthImg;
      } else if (flag == "fifth") {
        this.imgUrl = this.fifthImg;
      }
    },
    leaveImage() {
      this.imgUrl = this.defaultImg;
    },
  },
  created() {},
  mounted() {
    let obj = JSON.parse(deepClone(this.instanceObj.configData));
    obj.unknownQuestionReplies = [];
    obj.unknownQuestionReplies.push(this.unknownQuestionReplies);
    obj.transfigurationName =
      this.instanceObj.strategyName + this.instanceObj.robotInstanceId;
    this.allComponentsData = obj;
    if (this.validatenull(this.allComponentsData.intentRecallSetting)) {
      this.allComponentsData.intentRecallSetting = {
        topIntentIds: ["-1"],
        intentList: [],
      };
    }
  },
  destroyed() {},
};
</script>

<style lang="scss" scoped>
.img-container {
  width: 100%;
  height: 100%;
  position: relative;

  .image {
    width: 100%;
    height: 100%;
    margin-top: 10px;
  }

  .choseFirst {
    cursor: pointer;
    width: 190px;
    height: 190px;
    //background: red;
    position: absolute;
    top: 15%;
    left: 35%;
  }

  .choseSecond {
    cursor: pointer;
    width: 190px;
    height: 190px;
    position: absolute;
    top: 15%;
    left: 57%;
  }

  .choseThird {
    cursor: pointer;
    width: 190px;
    height: 190px;
    position: absolute;
    top: 30%;
    left: 83%;
  }

  .choseFourth {
    cursor: pointer;
    width: 190px;
    height: 190px;
    position: absolute;

    top: 60%;
    left: 68%;
  }

  .choseFifth {
    cursor: pointer;
    width: 190px;
    height: 190px;
    position: absolute;
    //background: red;
    top: 60%;
    left: 45%;
  }
}

.operateBtn-container {
  display: flex;
  justify-content: space-between;

  .left-container {
    display: flex;
    align-items: center;

    .btn-container {
      display: flex;
      cursor: pointer;
      align-items: center;
      margin-right: 40px;

      .order {
        width: 22px;
        height: 22px;
        border: 1px solid rgb(149, 151, 160);
        border-radius: 50%;
        text-align: center;
        line-height: 22px;
        color: rgb(149, 151, 160);
        font-size: 14px;
        margin-right: 15px;
      }

      .selectOrder {
        width: 22px;
        height: 22px;
        border: 1px solid rgb(149, 151, 160);
        border-radius: 50%;
        text-align: center;
        line-height: 22px;
        font-size: 14px;
        margin-right: 15px;
        background-color: rgb(0, 69, 200);
        color: #fff;
      }

      .content {
        font-weight: 700;
        color: rgb(149, 151, 160);
        font-size: 14px;
      }

      .selectContent {
        font-weight: 700;
        color: rgb(86, 88, 99);
        font-size: 14px;
      }
    }
  }

  .right-container {
    cursor: pointer;
    display: flex;
    font-size: 14px;
    align-items: center;

    .aicosicon {
      margin-right: 10px;
    }

    .content {
      color: rgb(0, 69, 200);
      font-weight: 700;
    }
  }
}

.kwpolicy-header {
  border-bottom: 1px solid rgb(238, 238, 238);
  background-color: #fff;
  height: 40px !important;
  line-height: 40px;
  padding: 0;

  .kwpolicy-header-back {
    float: left;
  }

  .el-steps--simple {
    background: #fff;
  }
}

/deep/.kwpolicy-header-introduce {
  width: 110px;
  color: #333;
  font-size: 14px;
  float: right;
  margin-top: 10px;
}
</style>
