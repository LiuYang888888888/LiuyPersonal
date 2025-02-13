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
        <div class="ExamViewBtn" v-if="!isThank">
          <div class="examUseTime blockStyle">
            {{ time }}
            <!-- <DoTime ref="doTimeRef"></DoTime> -->
          </div>
          <!-- 空白试卷提交时接口返回错误，暂时不能提交空白试卷 -->
          <el-button
            :loading="loadingBtn"
            style="background-color: #1db6a0"
            size="small"
            type="primary"
            v-if="type === 'add'"
            :disabled="examConfig.subjectNum == 0"
            @click.stop="examSave(false)"
            >提交试卷</el-button
          >

          <!-- <el-button
            :loading="loadingBtn"
            icon="el-icon-close"
            size="small"
            @click.stop="examReset"
            >重置</el-button
          > -->
        </div>
      </div>
      <el-row :gutter="30" v-if="!isThank">
        <el-col :span="6">
          <div class="answerSheet">
            <div style="line-height: 45px; font-weight: 700; color: black">
              答题卡
            </div>
            <div class="sheetContent">
              <template v-for="(column, index) in examFormOption.column">
                <div
                  :key="index"
                  class="indexStyle"
                  :style="
                    column.isActive
                      ? 'background-color: #3ad3bd;color:#fff;'
                      : 'background-color: #f4f5f7;color:#c7cad3'
                  "
                  v-if="column.typeExam !== 'htmlExam'"
                  v-html="resetIndexFun(column.prop, examFormOption.column)"
                  @click.stop="sheetClick(column.prop)"
                ></div>
              </template>
            </div>
            <hr />
            <div class="colorContent">
              <div>
                <div class="colorBlock" style="background-color: #3ad3bd"></div>
                <span>已做</span>
              </div>
              <!-- <div>
                <div class="colorBlock" style="background-color: #ffbc7d"></div>
                <span>当前</span>
              </div> -->
              <div>
                <div class="colorBlock" style="background-color: #f4f5f7"></div>
                <span>未做</span>
              </div>
            </div>
          </div>
        </el-col>
        <el-col :span="18">
          <div class="ExamView" id="ExamViewRightMain" v-if="examConfig.subjectNum > 0">
            <ExamView
              ref="examFormRef"
              :data="examFormData"
              :option="examFormOption"
              :examConfig="examConfig"
              :key="examFormKey"
              :showTime="true"
              :isDetail="isDetail"
              @formChange="formChange"
            >
            </ExamView>
          </div>
          <div class="employe" v-else>
            <img
              class="employeImg"
              src="@/assets/iconfont/employe.png"
              alt=""
            />
            <div>暂无数据</div>
          </div>
        </el-col>
      </el-row>
      <div class="thankModule" v-else>
        <div style="margin-bottom: 25px">{{ examConfig.thankWord }}</div>
        <div>
          <el-button
            size="small"
            plain
            v-if="examConfig.limitNum === 0"
            @click="againClick"
            >再答一次</el-button
          >
          <el-button size="small" type="primary" @click="viewExam"
            >查看试卷</el-button
          >
        </div>
      </div>
      <div class="cusSet">
        <div v-if="captchaTag">
          <el-form :model="captchaForm" class="captchaForm" ref="captchaRef">
            <el-form-item
              class="captchaItem"
              prop="captchaValue"
              label="验证码"
              label-width="120px"
              :rules="[
                { required: true, message: '请输入验证码', trigger: 'blur' },
              ]"
            >
              <div class="captchaContent">
                <el-input
                  v-model="captchaForm.captchaValue"
                  class="captchaInput"
                  size="small"
                ></el-input>
                <div class="captchaRight">
                  <img
                    :src="captchaImg"
                    @click.stop="getCaptcha"
                    class="captchaImg"
                  />
                  <el-link
                    type="primary"
                    @click.stop="getCaptcha"
                    :underline="false"
                    class="captchaChange"
                    >(换一个)</el-link
                  >
                </div>
              </div>
            </el-form-item>
          </el-form>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import "@/styles/qsgCommon.scss";

import ExamView from "@/components/ExamView/index";
import { isNull } from "@/util/qsgCommon";
import { dateFormat } from "@/util/date";

import {
  getTestById,
  saveTest,
  // getExamCaptcha,
} from "@/api/exam/examDataAdd";
import { baseURL } from "@/api/common";

export default {
  inject: ["desktopWindow", "desktop"],

  name: "examDataAdd",
  components: {
    ExamView,
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
      resultData: {},
      isThank: false,
      isDetail: false,
      type: "add", // 是否预览试卷
      time: "00:00:00",
      titleImg: require("@/assets/exam/exam-book.png"),
      examFormKey: 1,
      examId: "",

      loadingBtn: false,

      examFormOption: {
        column: [],
        submitBtn: false,
        emptyBtn: false,
      },
      examFormData: {},
      examConfig: {
        examConfig: 0,
        testName: "",
      },

      captchaTag: false,
      captchaImg: "",
      captchaKey: "",

      captchaForm: {
        captchaValue: "",
      },
      currentTime: new Date().getTime(),
      timeDown: null,
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
      // console.log(this.examFormOption);
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
      this.loadingBtn = true;

      if (this.propParams.examId) {
        this.examId = this.propParams.examId;
      } else if (this.desktop) {
        this.examId = this.desktopWindow.data.query.examId;
        if (!this.validatenull(this.desktopWindow.data.query.type)) {
          this.type = this.desktopWindow.data.query.type;
        }
      } else {
        this.examId = this.$route.query.examId;
        if (!this.validatenull(this.$route.query.type)) {
          this.type = this.$route.query.type;
        }
      }

      if (isNull(this.examId)) {
        this.$message.error("试卷参数设置错误。");
        return false;
      }

      await getTestById({
        operationType: this.type === "add" ? 1 : 2,
        id: this.examId,
      }).then((res) => {
        const dataRes = res.data.data;
        this.examConfig = dataRes;
        this.loadingBtn = false;

        //是否开启验证码
        // this.captchaTag = dataRes.isCaptcha == 1 ? true : false;

        // this.getCaptcha();

        if (isNull(dataRes.editorFrontJson)) {
          this.$message.error("试卷问题设置错误。");
          this.loadingBtn = true;
        } else {
          this.examFormOption = JSON.parse(dataRes.editorFrontJson);
          this.examFormOption.column.map((item) => {
            if (item.typeExam !== "htmlExam") {
              item.isActive = false;
            }
          });
        }

        if (dataRes.publishStatus != 1) {
          // this.$message.error("该试卷未发布，不能填写。");
          this.loadingBtn = true;
        } else {
          this.timeFun(dataRes);
        }

        this.examFormKey++;
      });

      // .then(()=>{
      //   browserCountPlusOne({questionnaireId:this.examId}).then(()=>{},error=>{
      //     window.console.log(error);
      //   })
      // })
    },
    timeFun(data) {
      let endTime = new Date(data.endTime).getTime(),
        nowTime = new Date().getTime(),
        timeDiff = endTime - nowTime;
      if (timeDiff < 0) {
        this.type = "";
        this.$message.error("考试时间已结束，不能进行考试！");
        return false;
      } else {
        if (
          data.answerDuration === 0 ||
          timeDiff < data.answerDuration * 60 * 1000
        ) {
          this.mistiming(timeDiff / 1000);
        } else {
          this.mistiming(data.answerDuration * 60);
        }
      }
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
      const _this = this;
      this.timeDown = setInterval(() => {
        if (timeStamp > 0) {
          timeStamp--;
          const newTime = this.formateTimeStamp(timeStamp);
          const str =
            "剩余时间：" +
            newTime.hour +
            ":" +
            newTime.min +
            ":" +
            newTime.seconds;
          _this.time = str;
        } else {
          clearInterval(this.timeDown);
          this.examSave(true);
        }
      }, 1000);
    },

    formateTimeStamp(timeStamp) {
      // var day;
      let hour, min, seconds;

      // day = parseInt(timeStamp / (24 * 60 * 60)); // 计算整数天数
      // var afterDay = timeStamp - day * 24 * 60 * 60; // 取得算出天数后剩余的秒数
      hour = parseInt(timeStamp / (60 * 60)); // 计算整数小时数
      let afterHour = timeStamp - hour * 60 * 60; // 取得算出小时数后剩余的秒数
      min = parseInt(afterHour / 60); // 计算整数分
      seconds = parseInt(timeStamp - hour * 60 * 60 - min * 60); // 取得算出分后剩余的秒数

      // if (day < 10) {
      //   day = "0" + day;
      // }

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
        // day: day,
        hour: hour,
        min: min,
        seconds: seconds,
      };
      return restStamp;
    },
    async examSave(flag) {
      let time = new Date().getTime();
      let timeDiff = time - this.currentTime;
      if (!flag && this.examConfig.minAnswerDuration !== 0) {
        if (timeDiff < this.examConfig.minAnswerDuration * 60 * 1000) {
          this.$message.error(
            "答题时间不得少于" + this.examConfig.minAnswerDuration + "分钟"
          );
          return false;
        }
      }
      this.loadingBtn = true;

      let valiRes = true;

      if (this.captchaTag) {
        this.$refs.captchaRef.validate((boolean) => {
          valiRes = valiRes && boolean;
        });
        //console.log(valiRes)
      }
      if (this.examConfig.subjectNum > 0) {
        let inputValiRes = this.$refs.examFormRef.canInputValiRes();
        valiRes = valiRes && inputValiRes;

        let hasInputValiRes = this.$refs.examFormRef.hasInputValiRes();
        valiRes = valiRes && hasInputValiRes;

        this.$refs.examFormRef.$refs.formRef.validate((boolean) => {
          valiRes = valiRes && boolean;
        });
      }

      //console.log(valiRes)

      if (!valiRes) {
        this.$message.error("试卷填写验证未通过，请检查！");
        this.loadingBtn = false;
        // this.getCaptcha();
        return false;
      }
      let formData = { saveJson: {} };
      if (this.examConfig.subjectNum > 0) {
        formData = this.$refs.examFormRef.getData();
      }
      const dataParam = {
        ...formData.saveJson,
        doTime: Number((timeDiff / 1000).toFixed(0)),
        startTime: dateFormat(this.currentTime),
        endTime: dateFormat(time),
        // validateKey: this.captchaKey,
        // validateValue: this.captchaForm.captchaValue,
      };
      clearInterval(this.timeDown);
      // console.log(dataParam)
      saveTest(dataParam).then(
        (res) => {
          const dataRes = res.data.success;
          this.resultData = res.data.data;
          if (dataRes) {
            if (this.examConfig.isDirectAfterFinish == 0) {
              // this.$alert(this.examConfig.thankWord, "", {
              //   confirmButtonText: "确定",
              //   type: "success",
              //   callback: (/*action*/) => {
              //     this.loadingBtn = false;
              //     this.examReset();
              //   },
              // });
              this.examReset();
              this.isThank = true;
            } else if (this.examConfig.isDirectAfterFinish == 1) {
              window.location.href = this.examConfig.directUrlAfterFinish;
              this.loadingBtn = false;
              this.examReset();
            }
          }
          this.type = "view";
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
    // 再答一次
    againClick() {
      this.$router.go(0);
    },
    // 查看试卷
    viewExam() {
      window.open(
        `${baseURL}#/exam/correctExam?id=` + this.resultData.id + "&type=view",
        "_self"
      );
    },

    // getCaptcha(){

    //   this.captchaValue ='';

    //   if(this.captchaTag){
    //     getExamCaptcha().then((res) => {
    //       const dataRes = res.data.data;
    //       this.captchaImg = dataRes.image;
    //       this.captchaKey = dataRes.key;

    //     }, error => {
    //       window.console.log(error);
    //     });
    //   }

    // },
  },
  mounted() {
    // const _this = this;
    // this.$refs.doTimeRef.useTimeStop();
    // this.$refs.doTimeRef.useTimeStart(true);
    // this.$nextTick(() => {
    //   // 打开右键
    //   document.oncontextmenu = new Function("event.returnValue=false");
    //   // 打开选择
    //   document.onselectstart = new Function("event.returnValue=false");
    //   //   // 打开F12
    //   document.onkeydown = () => {
    //     if (window.event && window.event.keyCode == 123) {
    //       return false;
    //     }
    //     if (window.event.shiftKey && window.event.keyCode == 121) {
    //       return false;
    //     }
    //     if (
    //       window.event.ctrlKey &&
    //       window.event.shiftKey &&
    //       window.event.keyCode == 73
    //     ) {
    //       return false;
    //     }
    //   };
    // });
  },
  created() {
    this.getActiveExam();
  },
  destroyed() {
    document.onkeydown = () => {
      if (window.event && window.event.keyCode == 123) {
        return true;
      }
      if (window.event.shiftKey && window.event.keyCode == 121) {
        return true;
      }
      if (
        window.event.ctrlKey &&
        window.event.shiftKey &&
        window.event.keyCode == 73
      ) {
        return true;
      }
    };
    document.onselectstart = new Function("event.returnValue=true");
    document.oncontextmenu = new Function("event.returnValue=true");
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
  // background-color: #f5f5f5;
  // overflow-y: auto;
}
.ExamViewBody {
  // max-width: 1000px;
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
    .examUseTime {
      margin-right: 15px;
    }
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
  .employe {
    padding: 40px 0;
    text-align: center;
    background-color: #ffffff;
    border-radius: 10px;
    color: #c7cad3;
    font-size: 14px;
    height: calc(100vh - 100px);
    display: flex;
    flex-direction: column;
    align-content: center;
    justify-content: center;
    align-items: center;

    .employeImg {
      width: 150px;
      width: 150px;
    }
  }
  .thankModule {
    background-color: #fff;
    width: 100%;
    height: 100vh;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
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
