<template>
  <HuilanBasic>
    <div class="topContent">
      <div class="left">
        <div>
          考试名称：
          <template v-if="examConfig.examName.length > 30">
            <el-tooltip
              class="item"
              effect="light"
              :content="examConfig.examName"
              placement="top-start"
            >
              <span>{{ examConfig.examName.substring(0, 30) }}...</span>
            </el-tooltip>
          </template>
          <template v-else>
            {{ examConfig.examName }}
          </template>
        </div>
        <div class="content">
          <div>
            <div>总分：{{ examConfig.totalScore }}分</div>
            <div>
              时长：{{
                examConfig.answerDuration > 0
                  ? examConfig.answerDuration
                  : "不限"
              }}
            </div>
            <div>
              次数：{{ examConfig.limitNum > 0 ? examConfig.limitNum : "不限" }}
            </div>
          </div>
          <div>
            <!-- <div>课程学员：{{ examConfig.submitted }}人</div> -->
            <div>
              平均分：{{
                validatenull(examConfig.avgScore)
                  ? 0
                  : examConfig.avgScore.toFixed(2)
              }}
            </div>
            <div>最高分：{{ examConfig.maxScore }}</div>
            <div>最低分：{{ examConfig.minScore }}</div>
          </div>
        </div>
      </div>
      <div class="right content">
        <!-- <div>
          <div style="color: #f56c6c"><span class="title">17</span>人</div>
          <div>未提交</div>
        </div> -->
        <div>
          <div style="color: #67c23a">
            <span class="title">{{
              !validatenull(examConfig.submitted) ? examConfig.submitted : 0
            }}</span
            >人
          </div>
          <div>已提交</div>
        </div>
        <div>
          <div>
            <span class="title">{{
              !validatenull(examConfig.notReview) ? examConfig.notReview : 0
            }}</span
            >份
          </div>
          <div>未批改</div>
        </div>
        <div>
          <div>
            <span class="title">{{
              !validatenull(examConfig.reviewed) ? examConfig.reviewed : 0
            }}</span
            >份
          </div>
          <div>已批改</div>
        </div>
      </div>
    </div>
    <avue-tabs :option="tabOption" @change="tabChange"></avue-tabs>
    <div class="inTab">
      <!-- <template v-if="tabActive == 'Score'">
        <Score :examConfig="examConfig" />
      </template> -->
      <template v-if="tabActive == 'Objectiveitem'">
        <Objectiveitem :examId="examId" />
      </template>
      <template v-if="tabActive == 'Scoreranking'">
        <Scoreranking :examId="examId" />
      </template>
    </div>
  </HuilanBasic>
</template>
<script>
import Score from "./score";
import Objectiveitem from "./objectiveitem";
import Scoreranking from "./scoreranking";

import { isNull } from "@/util/qsgCommon";

import { getStatistic } from "@/api/exam/examManage";

export default {
  inject: ["desktopWindow", "desktop"],

  name: "Statistic",
  components: {
    Score,
    Objectiveitem,
    Scoreranking,
  },
  props: {
    propParams: {
      type: Object,
      default() {
        return {};
      },
    },
  },
  data() {
    return {
      tabActive: "Objectiveitem",
      tabOption: {
        type: "card",
        column: [
          // {
          //   label: "分数段统计",
          //   value: "Score",
          // },
          {
            label: "客观题统计",
            value: "Objectiveitem",
          },
          {
            label: "成绩排名",
            value: "Scoreranking",
          },
        ],
      },

      examConfig: {
        examName:''
      },
      examId: "",
    };
  },
  methods: {
    tabChange(data) {
      this.tabActive = data.value;
      this.getActiveExam();
    },

    async getActiveExam() {
      if (this.propParams.examId) {
        this.examId = this.propParams.examId;
      } else if (this.desktop) {
        this.examId = this.desktopWindow.data.query.examId;
      } else {
        this.examId = this.$route.query.examId;
      }

      if (isNull(this.examId)) {
        this.$message.error("试卷参数设置错误。");
        return false;
      }
      getStatistic({ examId: this.examId }).then((res) => {
        const dataRes = res.data.data;
        // this.examConfig = dataRes;
        this.examConfig = dataRes;
      });
    },
  },

  created() {
    this.getActiveExam();
  },
  watch: {
    $route: "getActiveExam",
    "desktopWindow.data": {
      handler() {
        this.getActiveExam();
      },
      deep: true,
    },
    propParams: {
      handler() {
        this.getActiveExam();
      },
      deep: true,
    },
  },
};
</script>
<style lang="scss" scoped>
.topContent {
  border-radius: 5px;
  display: flex;
  -webkit-box-align: end;
  align-items: flex-end;
  -webkit-box-pack: justify;
  justify-content: space-between;
  padding: 15px;
  background-color: aliceblue;
  margin-bottom: 20px;

  .content {
    display: flex;
    align-items: center;
    font-size: 14px;
  }
  .left {
    // align-items: flex-end;
    .content > div:first-child {
      margin-right: 70px;
    }
    .content > div {
      > div {
        margin-top: 15px;
      }
    }
  }
  .right {
    text-align: center;
    width: 400px;
    justify-content: space-between;
    .title {
      font-size: 38px;
      font-weight: 600;
    }
  }
}
</style>
