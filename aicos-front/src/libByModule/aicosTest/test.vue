<template>
  <div>
    <template v-if="progress === 'start'">
      <div class="knowledgeText">
        <div class="left">
          <video
            src="./video/testing.mp4"
            autoplay
            loop
            muted
            type="video/mp4"
          ></video>
          <!-- <div class="line"></div>
          <img :src="robotImg" alt="" /> -->
        </div>
        <div class="right">
          <H5>坚持健康检测，保持机器人良好工作状态</H5>
          <p>上次检测日期{{ date }}</p>
          <!-- <p>上次检测日期{{ date }}，建议每日进行一次体检</p> -->
          <div class="settingBtn">
            <el-button
              type="primary"
              size="small"
              round
              class="kw-btn-blue"
              @click.stop="startTest"
            >
              开始检测
            </el-button>
          </div>
          <!-- <div class="test">
            <div>自定义检测范围</div>
            <hr />
            <div class="selectBtn">
              <el-checkbox-group v-model="checkboxGroup" size="small">
                <el-checkbox border :label="1">意图库</el-checkbox>
                <el-checkbox border :label="2">知识库</el-checkbox>
                <el-checkbox border :label="3">语义模型</el-checkbox>
              </el-checkbox-group>
            </div>
          </div> -->
        </div>
      </div>
    </template>
    <template v-if="progress === 'test'">
      <div class="knowledgeText">
        <div class="left">
          <video
            src="./video/testbefore.mp4"
            autoplay
            loop
            muted
            type="video/mp4"
          ></video>
        </div>
        <div class="right">
          <div>
            <h5>检测内容</h5>
            <p>
              <i class="el-icon-search" style="margin-right: 10px"></i>
              {{ test }}
            </p>
          </div>
          <div>
            <h5>数据指标</h5>
            <div class="targetContent">
              <div class="targetCard">
                <p><i class="el-icon-s-operation"></i>共检测知识</p>
                <div>{{ allNum }}</div>
              </div>
              <div class="targetCard">
                <p><i class="el-icon-warning-outline"></i>共检出项</p>
                <div style="color: red">{{ warningNum }}</div>
              </div>
              <div class="targetCard">
                <p><i class="el-icon-time"></i>已用时间</p>
                <div>{{ time }}</div>
              </div>
            </div>
          </div>
          <div>
            <h5>检测项目</h5>
            <div class="projectContent">
              <!-- value = "检测状态 1正在检测/2正常/3待检测/4异常" -->
              <template
                v-if="checkboxGroup.length === 0 || checkboxGroup.includes(1)"
              >
                <div
                  :class="[
                    'projectCard',
                    intentionType == 3 ? 'gray' : '',
                    intentionType == 1 ? 'blue' : '',
                    intentionType == 4 ? 'red' : '',
                    intentionType == 2 ? 'green' : ''
                  ]"
                >
                  <div class="imgAndStatus">
                    <div class="topImg">
                      <img :src="intentionImg" alt="" />
                    </div>
                    <div class="status">
                      <template v-if="intentionType !== 3">
                        <i
                          :class="[
                            intentionType === 1 ? 'el-icon-loading' : '',
                            intentionType === 4
                              ? 'el-icon-warning-outline'
                              : '',
                            intentionType === 2 ? 'el-icon-check' : ''
                          ]"
                        ></i>
                      </template>
                      <template v-else>
                        <i
                          class="el-icon-setting"
                          style="visibility: hidden"
                        ></i>
                      </template>
                      <div style="font-size: 13px">
                        <template v-if="intentionType === 3">待检测</template>
                        <template v-else-if="intentionType === 1"
                          >正在检测</template
                        >
                        <template v-else-if="intentionType === 4"
                          >发现异常</template
                        >
                        <template v-else-if="intentionType === 2"
                          >检测完成</template
                        >
                      </div>
                    </div>
                  </div>
                  <div>意图库</div>
                </div>
              </template>
              <template
                v-if="checkboxGroup.length === 0 || checkboxGroup.includes(2)"
              >
                <div
                  :class="[
                    'projectCard',
                    knowledgeType == 3 ? 'gray' : '',
                    knowledgeType == 1 ? 'blue' : '',
                    knowledgeType == 4 ? 'red' : '',
                    knowledgeType == 2 ? 'green' : ''
                  ]"
                >
                  <div class="imgAndStatus">
                    <div class="topImg">
                      <img :src="knowledgeImg" alt="" />
                    </div>
                    <div class="status">
                      <template v-if="knowledgeType !== 3">
                        <i
                          :class="[
                            knowledgeType === 1 ? 'el-icon-loading' : '',
                            knowledgeType === 4
                              ? 'el-icon-warning-outline'
                              : '',
                            knowledgeType === 2 ? 'el-icon-check' : ''
                          ]"
                        ></i>
                      </template>
                      <template v-else>
                        <i
                          class="el-icon-setting"
                          style="visibility: hidden"
                        ></i>
                      </template>
                      <div style="font-size: 13px">
                        <template v-if="knowledgeType === 3">待检测</template>
                        <template v-else-if="knowledgeType === 1"
                          >正在检测</template
                        >
                        <template v-else-if="knowledgeType === 4"
                          >发现异常</template
                        >
                        <template v-else-if="knowledgeType === 2"
                          >检测完成</template
                        >
                      </div>
                    </div>
                  </div>
                  <div>知识库</div>
                </div>
              </template>
              <template
                v-if="checkboxGroup.length === 0 || checkboxGroup.includes(3)"
              >
                <div
                  :class="[
                    'projectCard',
                    semanticType == 3 ? 'gray' : '',
                    semanticType == 1 ? 'blue' : '',
                    semanticType == 4 ? 'red' : '',
                    semanticType == 2 ? 'green' : ''
                  ]"
                >
                  <div class="imgAndStatus">
                    <div class="topImg">
                      <img :src="knowledgeImg" alt="" />
                    </div>
                    <div class="status">
                      <template v-if="semanticType !== 3">
                        <i
                          :class="[
                            semanticType == 1 ? 'el-icon-loading' : '',
                            semanticType == 4 ? 'el-icon-warning-outline' : '',
                            semanticType == 2 ? 'el-icon-check' : ''
                          ]"
                        ></i>
                      </template>
                      <template v-else>
                        <i
                          class="el-icon-setting"
                          style="visibility: hidden"
                        ></i>
                      </template>
                      <div style="font-size: 13px">
                        <template v-if="semanticType === 3">待检测</template>
                        <template v-else-if="semanticType === 1"
                          >正在检测</template
                        >
                        <template v-else-if="semanticType === 4"
                          >发现异常</template
                        >
                        <template v-else-if="semanticType === 2"
                          >检测完成</template
                        >
                      </div>
                    </div>
                  </div>
                  <div>语义模型</div>
                </div>
              </template>
            </div>
          </div>
        </div>
      </div>
    </template>
    <template v-if="progress === 'result'">
      <Result @finsh="onFinsh" :warningNum="warningNum" :ids="resultIds" />
      <!-- <div class="knowledgeResult">
        <img :src="resultImg" alt="" />
        <div>本次扫描共发现{{ warningNum }}个待处理项！</div>
        <div class="resultNum">
          <div>
            <div>{{ allNum }}</div>
            <p>共扫描对象</p>
          </div>
          <div>
            <div class="red">{{ warningNum }}</div>
            <p>待处理项</p>
          </div>
          <div>
            <div>{{ time }}</div>
            <p>已用时间</p>
          </div>
        </div>
        <div>
          <el-button
            type="primary"
            round
            class="kw-btn-blue"
            @click="resultClick"
            style="margin-right: 70px"
            >去处理</el-button
          >
          <el-button @click="onFinsh" round>放弃处理</el-button>
        </div>
      </div> -->
    </template>
  </div>
</template>
<script>
import { cloneDeep } from "lodash";
import { testList } from "./data";
import {
  getRobot,
  doDetection,
  detectionDetail
} from "@/api/kwRobot/knowledgeTest/index";
import Result from "./result";
export default {
  components: {
    Result
  },
  data() {
    return {
      robotImg: require("@/assets/kwRobotAnswer/robotText.png"),
      testImg: require("@/assets/kwRobotAnswer/robotText.png"),
      resultImg: require("@/assets/kwRobotAnswer/resultmain.png"),
      date: "2023-09-10 10:24:37",
      checkboxGroup: [],
      progress: "start",
      test: "意图库",
      // 检测项目
      allNum: 0,
      warningNum: 0,
      time: "00:00:00",
      hour: 0,
      minute: 0,
      second: 0,
      timer: null,
      taskInterval: null,
      intentionImg: require("@/assets/kwRobotAnswer/4-white.png"),
      knowledgeImg: require("@/assets/kwRobotAnswer/3-white.png"),
      semanticImg: require("@/assets/kwRobotAnswer/3-white.png"),
      intentionType: 3,
      intentionText: "待检测",
      knowledgeType: 3,
      knowledgeText: "待检测",
      semanticType: 3,
      semanticText: "待检测",
      // 检测结果
      resultIds: []
    };
  },

  mounted() {
    // this.progress = "start";
    // this.getTime();
  },

  methods: {
    // 获取上次检测时间
    getTime() {
      getRobot().then(res => {
        if (res.data.success) {
          if (!this.validatenull(res.data.data)) {
            this.date = res.data.data.createTime;
          }
        }
      });
    },
    // 计时开始
    getTimeInterval() {
      clearInterval(this.timer);
      this.timer = setInterval(() => {
        this.second += 1;
        if (this.second >= 60) {
          this.minute += 1;
          this.second = 0;
        }
        if (this.minute >= 60 && this.second >= 60) {
          this.minute += 0;
          this.hour += 1;
        }
        this.time =
          this.showNum(this.hour) +
          ":" +
          this.showNum(this.minute) +
          ":" +
          this.showNum(this.second);
      }, 1000);
    },
    showNum(num) {
      if (num < 10) {
        return "0" + num;
      }
      return num;
    },
    // 开始检测
    startTest() {
      let type = "1,2,3";
      if (this.checkboxGroup.length !== 0) {
        type = this.checkboxGroup.join(",");
      }
      this.progress = "test";
      this.getTimeInterval();
      this.getDetectionDetail();
    },
    getDetectionDetail(taskId) {
      clearInterval(this.taskInterval);
      this.warningNum = 0;
      this.allNum = 0;
      this.time = "00:00:00";
      this.hour = 0;
      this.minute = 0;
      this.second = 0;
      let warningNum = 0,
        allNum = 0,
        index = 0;
      const list = cloneDeep(testList);
      // const list = res.data.data;
      list.forEach(item => {
        this.resultIds.push(item.id);
        if (item.detectionType === 1) {
          this.intentionType = item.detectionStatus;
          if (item.detectionStatus === 1) {
            this.test = "意图库";
          }
        }
        if (item.detectionType === 2) {
          this.knowledgeType = item.detectionStatus;
          if (item.detectionStatus === 1) {
            this.test = "知识库";
          }
        }
        if (item.detectionType === 3) {
          this.semanticType = item.detectionStatus;
          if (item.detectionStatus === 1) {
            this.test = "语义模型";
          }
        }
        //检测数量
        if (!this.validatenull(item.detectionNum)) {
          allNum += Number(item.detectionNum);
        }
        // 异常数量
        if (!this.validatenull(item.abnormalNum)) {
          warningNum += Number(item.abnormalNum);
        }
        if (item.detectionStatus === 2 || item.detectionStatus === 4) {
          index++;
        }
      });
      this.warningNum = warningNum;
      this.allNum = allNum;
      setTimeout(() => {
        if (index === list.length) {
          clearInterval(this.timer);
          this.progress = "result";
        }
      }, 3000);
    },
    onFinsh() {
      this.progress = "start";
    }
  },
  berForeDestroy() {
    clearInterval(this.timer);
    clearInterval(this.taskInterval);
  }
};
</script>
<style lang="scss" scoped>
.knowledgeText {
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  .left {
    width: 50%;
    // height: 170px;
    text-align: center;

    @keyframes ball {
      0% {
        top: 0px;
      }
      50% {
        top: 170px;
      }
      100% {
        top: 0px;
      }
    }
    .line {
      width: 240px;
      height: 6px;
      background: linear-gradient(
        180deg,
        rgba(255, 255, 255, 1) 0%,
        rgba(255, 255, 255, 1) 0%,
        rgba(141, 196, 249, 1) 100%,
        rgba(141, 196, 249, 1) 100%
      );
      position: relative;
      animation: ball 3s infinite;
    }
    img {
      width: 200px;
      height: 100%;
    }
    video {
      width: 100%;
    }
  }
  .right {
    padding-left: 60px;
    h5 {
      font-size: 20px;
      font-weight: 600;
      color: #333;
      margin: 0px;
    }
    p {
      font-size: 14px;
      color: #999;
    }
    .settingBtn {
      margin-top: 35px;
      .el-button {
        margin-right: 10px;
        width: 140px;
      }
    }
    .test {
      margin-top: 45px;
      .selectBtn {
        .el-checkbox.is-bordered.el-checkbox--small {
          width: 160px;
          height: 40px;
          padding: 0px;
          line-height: 40px;
          text-align: center;
          /deep/.el-checkbox__label {
            font-size: 14px;
          }
          /deep/.el-checkbox__inner {
            width: 14px;
            height: 14px;
          }
        }
      }
    }
    .targetContent {
      margin: 20px 0px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      .targetCard {
        width: 210px;
        height: 140px;
        border: 1px solid #e6e6e6;
        border-radius: 5px;
        margin-right: 30px;
        padding: 15px;
        i {
          margin-right: 8px;
        }
        p {
          margin: 0px;
          font-size: 16px;
          color: #484848;
        }
        div {
          font-size: 32px;
          text-align: center;
          /* margin-top: 10px; */
          line-height: 100px;
        }
      }
    }
    .projectContent {
      display: flex;
      justify-content: space-around;
      align-items: center;
      padding: 20px;
      .projectCard {
        text-align: center;
        margin-right: 40px;
        width: 115px;
        .topImg {
          margin: 0px auto;
          padding: 10px 5px;
          border-top-left-radius: 10px;
          border-top-right-radius: 10px;
          img {
            width: 70px;
            height: 56px;
          }
        }
        .imgAndStatus {
          border-radius: 10px;
          margin-bottom: 10px;
          .status {
            margin: 10px 0px 5px 0px;
            font-size: 20px;
          }
        }
      }
      .gray {
        .topImg {
          background-color: #c5c5c5;
        }
        .imgAndStatus {
          border: 1px solid #c5c5c5;

          .status {
            i {
              color: #c5c5c5;
            }
          }
        }
      }
      .blue {
        .topImg {
          background-color: #409eff;
        }
        .imgAndStatus {
          border: 1px solid #409eff;

          .status {
            i {
              color: #409eff;
            }
          }
        }
      }
      .red {
        .topImg {
          background-color: #ff2f2f;
        }
        .imgAndStatus {
          border: 1px solid #ff2f2f;

          .status {
            i {
              color: #ff2f2f;
            }
          }
        }
      }
      .green {
        .topImg {
          background-color: #67c23a;
        }
        .imgAndStatus {
          border: 1px solid #67c23a;
          .status {
            i {
              color: #67c23a;
            }
          }
        }
      }
    }
  }
}
.knowledgeResult {
  text-align: center;
  width: 400px;
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  .red {
    color: red;
  }
  div {
    font-weight: bolder;
    font-size: 20px;
  }
  p {
    margin: 0px;
    font-size: 14px;
    font-weight: normal;
  }
  .resultNum {
    display: flex;
    justify-content: space-around;
    align-items: center;
    margin: 20px 0px 60px 0px;
    > div {
      text-align: center;
    }
  }
}
</style>
