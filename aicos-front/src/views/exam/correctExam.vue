<template>
  <div class="ExamViewMain">
    <div class="examDataAdd qsgMain ExamViewBody">
      <div class="examTop">
        <div style="display: flex; align-items: center">
          <img :src="titleImg" alt="" style="width: 30px; margin-right: 10px" />
          <template v-if="examConfig.testName.length > 30">
            <el-tooltip
              class="item"
              effect="light"
              :content="examConfig.testName"
              placement="top-start"
            >
              <span>{{ examConfig.testName.substring(0, 30) }}...</span>
            </el-tooltip>
          </template>
          <template v-else>
            {{ examConfig.testName }}
          </template>
        </div>
        <div class="ExamViewBtn">
          <div class="blockStyle">用户名称：{{ examConfig.realName }}</div>
          <div class="blockStyle">考试成绩：{{ examConfig.examScore }}分</div>
          <div class="blockStyle">
            考试通过：{{
              examConfig.examScore >= examConfig.passScore ? "通过" : "未通过"
            }}
          </div>
          <div class="examUseTime blockStyle">
            答题时长：{{ mistiming(examConfig.doTime) }}
          </div>
          <el-button
            :loading="loadingBtn"
            style="background-color: #1db6a0"
            size="small"
            type="primary"
            v-if="type === 'add'"
            @click.stop="examSave(false)"
            >提交评分</el-button
          >
        </div>
      </div>
      <el-row :gutter="30">
        <el-col :span="6">
          <div class="answerSheet">
            <div style="line-height: 45px; font-weight: 700; color: black">
              答题卡
            </div>
            <div class="sheetContent" v-if="type === 'view'">
              <template v-for="(column, index) in examFormOption.column">
                <div
                  :key="index"
                  class="indexStyle"
                  :style="
                    column.typeExam === 'textareaExam'
                      ? objectiveItemObj[column.prop].reviewScore ==
                        objectiveItemObj[column.prop].totalScore
                        ? 'background-color: #66cd75;color:#fff'
                        : 'background-color: #f4596b;color:#fff'
                      : objectiveItemObj[column.prop].answerScoreType === 1
                      ? 'background-color: #f4596b;color:#fff;'
                      : 'background-color: #66cd75;color:#fff'
                  "
                  v-if="column.typeExam !== 'htmlExam'"
                  v-html="resetIndexFun(column.prop, examFormOption.column)"
                  @click.stop="sheetClick(column.prop)"
                ></div>
              </template>
            </div>
            <div class="sheetContent" v-else>
              <template v-for="(column, index) in examFormOption.column">
                <div
                  :key="index"
                  class="indexStyle"
                  :style="
                    column.typeExam === 'textareaExam'
                      ? column.isActive
                        ? 'background-color: #ffbc7d;color:#fff'
                        : 'background-color: #f4f5f7;color:#c7cad3'
                      : 'background-color: #66cd75;color:#fff'
                  "
                  v-if="column.typeExam !== 'htmlExam'"
                  v-html="resetIndexFun(column.prop, examFormOption.column)"
                  @click.stop="sheetClick(column.prop)"
                ></div>
              </template>
            </div>
            <hr v-if="type !== 'view'" />
            <!-- <div class="colorContent" v-if="type === 'view'">
              <div>
                <div class="colorBlock" style="background-color: #66cd75"></div>
              </div>
              <div>
                <div class="colorBlock" style="background-color: #f4596b"></div>
              </div>
            </div> -->
            <div class="colorContent" v-if="type !== 'view'">
              <div>
                <div class="colorBlock" style="background-color: #66cd75"></div>
                <span>客观题</span>
              </div>
              <div>
                <div class="colorBlock" style="background-color: #ffbc7d"></div>
                <span>主观题</span>
              </div>
              <div v-if="type !== 'view'">
                <div class="colorBlock" style="background-color: #f4f5f7"></div>
                <span>未阅</span>
              </div>
            </div>
          </div>
        </el-col>
        <el-col :span="18">
          <div class="ExamView" id="ExamViewRightMain">
            <Examscore
              ref="examFormRef"
              :data="examFormData"
              :option="examFormOption"
              :examConfig="examConfig"
              :key="examFormKey"
              :showTime="true"
              :objectiveItemObj="objectiveItemObj"
              :viewDetail="type === 'view'"
              @formChange="formChange"
            >
            </Examscore>
          </div>
        </el-col>
      </el-row>
    </div>
  </div>
</template>
<script>
import "@/styles/qsgCommon.scss";

import Examscore from "./examScore";
import { isNull } from "@/util/qsgCommon";
// import { dateFormat } from "@/util/date";

import { getExamDetail, saveOrUpdate } from "@/api/exam/markExamPapers";

export default {
  inject: ["desktopWindow", "desktop"],

  name: "correctExam",
  components: {
    Examscore,
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
      type: "add", // 是否预览试卷
      time: "00:00:00",
      titleImg: require("@/assets/exam/exam-book.png"),
      examFormKey: 1,

      loadingBtn: false,

      examFormOption: {
        column: [],
        submitBtn: false,
        emptyBtn: false,
      },
      examFormData: {},
      examConfig: {
        answerTestSubjects: [],
        frontAnswerJson: "{}",
        testName:''
      },

      captchaTag: false,
      captchaImg: "",
      captchaKey: "",

      captchaForm: {
        captchaValue: "",
      },
      currentTime: new Date().getTime(),
      // timeDown: null,
      examUserId: "",
      objectiveItemObj: {},
    };
  },
  computed: {},
  methods: {
    // 答题form修改时
    formChange(val) {
      let itemOption = val;
      this.examFormOption.column.map((item) => {
        item.isActive = false;
        if (item.typeExam !== "htmlExam") {
          if (
            item.typeExam !== "inputExam" &&
            !this.validatenull(itemOption[item.prop])
          ) {
            item.isActive = true;
          }
          if (item.typeExam === "inputExam") {
            item.dicData.map((obj) => {
              if (!this.validatenull(itemOption[obj.value])) {
                item.isActive = true;
              }
            });
          }
        }
      });
      this.$forceUpdate();
    },
    // 答题卡序号
    resetIndexFun(prop, allColumn) {
      let res = '<i class="el-icon-warning" style="color: #f05050;"></i>';
      let tempColumn = allColumn.filter((item) => item.typeExam != "htmlExam");
      if (tempColumn.length > 0) {
        tempColumn.map((item, key) => {
          if (item.prop == prop) {
            res = key + 1;
          }
        });
      }
      return res;
    },
    async getActiveExam() {
      this.loadingBtn = false;
      if (isNull(this.examUserId)) {
        this.$message.error("试卷参数设置错误。");
        return false;
      }

      await getExamDetail({ id: this.examUserId }).then((res) => {
        const dataRes = res.data.data;
        this.examConfig = dataRes;
        this.examConfig.examScore =
          Number(dataRes.myTotalScore) + Number(dataRes.reviewTotalScore);
        this.loadingBtn = false;
        this.examFormOption = JSON.parse(this.examConfig.editorFrontJson);
        this.examConfig.answerTestSubjects.map((item) => {
          if (!this.objectiveItemObj.hasOwnProperty(item.subjectId)) {
            this.objectiveItemObj[item.subjectId] = {
              answerScoreType: item.answerScoreType,
              myScore: item.subjectType === 5 ? item.reviewScore : item.myScore,
              totalScore: item.totalScore,
            };
          }
        });
        this.examFormOption.column.map((item) => {
          item.isActive = true;
        });
        this.examFormKey++;
      });
      this.examFormKey++;
    },
    sheetClick(id) {
      // document.getElementById(id).scrollIntoView();
      const mainElement = document.getElementById('ExamViewRightMain');  
      const itemElement = document.getElementById(id);  
      if (mainElement && itemElement) {  
        // mainElement.scrollTop = itemElement.offsetTop; // 设置滚动位置到目标元素的顶部  
        // 如果需要平滑滚动
        mainElement.scroll({ top: itemElement.offsetTop, behavior: 'smooth' });  
      } else {  
        window.console.log(`未找到元素：#ExamViewRightMain 或 ${id}`);  
      }
    },
    mistiming(timeStamp) {
      const newTime = this.formateTimeStamp(timeStamp);
      const str = newTime.hour + ":" + newTime.min + ":" + newTime.seconds;
      return str;
    },

    formateTimeStamp(timeStamp) {
      let hour, min, seconds;
      hour = parseInt(timeStamp / (60 * 60)); // 计算整数小时数
      let afterHour = timeStamp - hour * 60 * 60; // 取得算出小时数后剩余的秒数
      min = parseInt(afterHour / 60); // 计算整数分
      seconds = parseInt(timeStamp - hour * 60 * 60 - min * 60); // 取得算出分后剩余的秒数

      if (hour < 10) {
        hour = "0" + hour;
      }

      if (min < 10) {
        min = "0" + min;
      }

      if (seconds < 10) {
        seconds = "0" + seconds;
      }

      const restStamp = {
        hour: hour,
        min: min,
        seconds: seconds,
      };
      return restStamp;
    },
    async examSave() {
      // this.loadingBtn = true;

      let valiRes = true;

      if (this.captchaTag) {
        this.$refs.captchaRef.validate((boolean) => {
          valiRes = valiRes && boolean;
        });
      }
      let inputValiRes = this.$refs.examFormRef.canInputValiRes();
      valiRes = valiRes && inputValiRes;

      let hasInputValiRes = this.$refs.examFormRef.hasInputValiRes();
      valiRes = valiRes && hasInputValiRes;

      this.$refs.examFormRef.$refs.formRef.validate((boolean) => {
        valiRes = valiRes && boolean;
      });

      if (!valiRes) {
        this.$message.error("试卷填写验证未通过，请检查！");
        this.loadingBtn = false;
        return false;
      }

      const formData = this.$refs.examFormRef.getData();
      if (!formData) {
        this.$message.warning("请完成阅卷");
        return false;
      }
      const dataParam = {
        ...formData,
      };
      this.loadingBtn = true;
      saveOrUpdate(dataParam).then(
        (res) => {
          const dataRes = res.data.success;
          if (dataRes) {
            this.examConfig = this.deepClone(dataParam);
            this.examConfig.examScore =
              Number(dataParam.myTotalScore) +
              Number(dataParam.reviewTotalScore);

            this.$message.success("阅卷完成");
            this.loadingBtn = false;
            this.examConfig.answerTestSubjects.map((item) => {
              this.objectiveItemObj[item.subjectId] = {
                answerScoreType: item.answerScoreType,
                myScore:
                  item.subjectType === 5 ? item.reviewScore : item.myScore,
              };
            });
            this.examFormData = JSON.parse(this.examConfig.frontAnswerJson);
            this.type = "view";
          }
        },
        (error) => {
          window.console.log(error);
          this.loadingBtn = false;
        }
      );
    },
    examReset() {
      this.$refs.examFormRef.onReset();
    },
  },
  mounted() {
    this.getActiveExam();
  },
  created() {
    if (this.propParams.id) {
      this.examUserId = this.propParams.id;
    } else if (this.desktop) {
      this.examUserId = this.desktopWindow.data.query.id;
      if (!this.validatenull(this.desktopWindow.data.query.type)) {
        this.type = this.desktopWindow.data.query.type;
      }
    } else {
      this.examUserId = this.$route.query.id;
      if (!this.validatenull(this.$route.query.type)) {
        this.type = this.$route.query.type;
      }
    }
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
.ExamViewMain {
  width: 100%;
  height: 100%;
}
.ExamViewBody {
  min-height: 100%;
  margin: 0 auto;
  padding: 0px !important;
  background-color: #e9ebee;
  border-left: 1px solid #ebeef5;
  border-right: 1px solid #ebeef5;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
  .examTop {
    display: flex;
    align-items: center;
    justify-content: space-between;
    background-color: #2b3643;
    line-height: 50px;
    color: #fff;
    padding: 0 15px;
    margin-bottom: 20px;
    .blockStyle {
      margin-right: 15px;
      background-color: #364150;
      color: #fff;
      height: 35px;
      font-size: 14px;
      line-height: 35px;
      padding: 0 15px;
      border-radius: 5px;
    }
    .examUseTime {
      margin-right: 30px;
    }
  }
  .answerSheet {
    text-align: center;
    height: calc(100vh - 80px);
    overflow-y: auto;
    .sheetContent {
      display: flex;
      flex-wrap: wrap;
      justify-content: flex-start;
      align-items: center;
      color: #c7cad3;
      .indexStyle {
        width: 53px;
        height: 53px;
        line-height: 60px;
        background-color: #f4f5f7;
        margin: 0px 9px 9px 0;
        border-radius: 5px;
        cursor: pointer;
      }
    }
    .colorContent {
      display: flex;
      justify-content: space-around;
      align-items: center;
      > div {
        display: flex;
        justify-content: space-around;
        align-items: center;
      }
      .colorBlock {
        width: 18px;
        height: 18px;
        border-radius: 2px;
        margin-right: 10px;
      }
    }
  }
  .el-row {
    padding: 0 20px;
  }
  .el-col {
    > div {
      background-color: #fff;
      border-radius: 10px;
      padding: 20px;
    }
  }
  .ExamView {
    height: calc(100vh - 100px);
    overflow-y: auto;
    a {
      text-decoration: underline;
      color: #0045c8;
    }
  }
}
.ExamViewBtn {
  text-align: center;
  display: flex;
  align-items: center;
}
.cusSet {
  .captchaForm {
    border-top: 2px solid #e4e7ed;
    padding-top: 15px;
    .captchaItem {
      .captchaContent {
        display: flex;

        .captchaInput {
          width: 180px;
          max-width: 300px;
        }
        .captchaRight {
          display: flex;
          .captchaImg {
            height: 40px;
            margin-left: 10px;
            margin-right: 10px;
          }
        }
      }
    }
  }
}
</style>
