<template>
  <div>
    <div class="setting-container">
      <!-- 基本信息 -->
      <div class="base-info">
        <div class="info-title">
          <span>{{ $t("kwRobotManage.baseInfo") }}</span>
        </div>
        <div class="form-container">
          <el-form
            ref="elForm"
            :model="formData"
            :rules="rules"
            size="medium"
            :label-position="language != 'zh' ? 'top' : 'right'"
            label-width="130px"
          >
            <el-form-item
              :label="$t('kwRobotManage.instanceName')"
              prop="robotName"
            >
              <el-input
                v-model="formData.robotName"
                :placeholder="$t('kwRobotManage.instanceNameTips')"
                clearable
                maxlength="50"
                show-word-limit
                :style="{ width: '100%' }"
              >
              </el-input>
            </el-form-item>
            <el-form-item :label="$t('kwRobotManage.head')" prop="robotImg">
              <div class="avatar-container">
                <el-avatar
                  :class="currentIndex == index ? 'avatar-choosed' : ''"
                  v-for="(img, index) in robotDefaultList"
                  :key="index"
                  size="small"
                  data-type="0"
                  :data-url="img.url"
                  @click.native="chooseImg($event, index, 0, img.url)"
                  :src="img.url"
                ></el-avatar>
                <el-avatar
                  :class="currentIndex == 10 ? 'avatar-choosed' : ''"
                  v-if="imgUrl"
                  size="small"
                  data-type="1"
                  :data-url="imgUrl"
                  @click.native="chooseImg($event, 10, 1, imgUrl)"
                  :src="imgUrl"
                ></el-avatar>
                <el-upload
                  ref="robotImg"
                  :file-list="robotImgfileList"
                  :action="robotImgAction"
                  accept=".png"
                  :data="dataObj"
                  :on-change="handleChange"
                  :before-upload="robotImgBeforeUpload"
                  :on-success="successUpload"
                  list-type="picture-card"
                >
                  <i class="el-icon-plus"></i>
                </el-upload>
              </div>
            </el-form-item>
            <el-form-item :label="$t('kwRobotManage.taskType')" prop="taskType">
              <el-select
                v-model="formData.taskType"
                clearable
                :placeholder="$t('kwRobotManage.taskTypeTips')"
              >
                <el-option
                  v-for="(item, index) in industryData"
                  :key="index"
                  :label="item.name"
                  :value="item.id"
                >
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item
              :label="$t('kwRobotManage.businessType')"
              prop="industry"
            >
              <el-select
                v-model="formData.industry"
                clearable
                :placeholder="$t('kwRobotManage.businessTypeTips')"
              >
                <el-option
                  v-for="item in taskData"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id"
                >
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="TTS:" prop="tts">
              <el-select
                v-model="formData.tts"
                clearable
                :placeholder="$t('aicosCommon.pleaseSelect') + 'TTS'"
                @change="changeTts"
              >
                <el-option
                  v-for="item in ttsData"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id"
                >
                </el-option>
              </el-select>
              <el-button
                icon="el-icon-setting"
                type="text"
                size="small"
                @click="btnClick('TTS')"
                v-if="formData.tts && ttsSelect.company !== 'mrcp'"
              ></el-button>
            </el-form-item>
            <el-form-item label="ASR:" prop="asr">
              <el-select
                v-model="formData.asr"
                clearable
                @change="changeAsr"
                :placeholder="$t('aicosCommon.pleaseSelect') + 'ASR'"
              >
                <el-option
                  v-for="item in asrData"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id"
                >
                </el-option>
              </el-select>
              <el-button
                icon="el-icon-setting"
                type="text"
                size="small"
                @click="btnClick('ASR')"
                v-if="formData.asr && asrSelect.company !== 'mrcp'"
              ></el-button>
            </el-form-item>
            <el-form-item :label="$t('kwRobotManage.desc')" prop="desc">
              <el-input
                v-model="formData.desc"
                type="textarea"
                :placeholder="$t('kwRobotManage.descTips')"
                :maxlength="300"
                show-word-limit
                :autosize="{ minRows: 4, maxRows: 4 }"
                :style="{ width: '100%' }"
              ></el-input>
            </el-form-item>
          </el-form>
        </div>
      </div>
      <!-- 默认回复 -->
      <div class="repeat-info">
        <div class="repeat-title">
          <span>{{ $t("kwRobotManage.defaultReply") }}</span>
        </div>
        <div class="form-container">
          <el-form
            ref="repeatForm"
            :label-position="language != 'zh' ? 'top' : 'right'"
            :model="repeatData"
            size="medium"
            :rules="repeatRules"
            label-width="130px"
          >
            <el-form-item
              :label="$t('kwRobotManage.welcomeInfo')"
              prop="welcomeInfo"
            >
              <el-input
                v-model="repeatData.welcomeInfo"
                :placeholder="$t('kwRobotManage.welcomeInfoTips')"
                :maxlength="500"
                show-word-limit
                clearable
                :style="{ width: '100%' }"
              ></el-input>
            </el-form-item>
            <el-form-item
              :label="$t('kwRobotManage.unknownMsg')"
              prop="unknownMessage"
            >
              <el-input
                v-model="repeatData.unknownMessage"
                :placeholder="$t('kwRobotManage.unknownMsgTips')"
                :maxlength="500"
                show-word-limit
                clearable
                :style="{ width: '100%' }"
              ></el-input>
            </el-form-item>
            <!-- <el-form-item
              :label="$t('kwRobotManage.clarifyMsg')"
              prop="clarifyMsg"
            >
              <el-input
                v-model="repeatData.clarifyMsg"
                :placeholder="$t('kwRobotManage.clarifyMsgTips')"
                :maxlength="50"
                show-word-limit
                clearable
                :style="{ width: '100%' }"
              ></el-input>
            </el-form-item> -->
            <!-- <el-form-item :label="$t('kwRobotManage.cohesion')" prop="cohesion">
              <el-input
                v-model="repeatData.cohesion"
                :placeholder="$t('kwRobotManage.cohesionTips')"
                :maxlength="50"
                show-word-limit
                :style="{ width: '100%' }"
              ></el-input>
            </el-form-item>
            <el-form-item
              :label="$t('kwRobotManage.dialogueMsg')"
              prop="dialogueMsg"
            >
              <el-input
                v-model="repeatData.dialogueMsg"
                :placeholder="$t('kwRobotManage.dialogueMsgTips')"
                :maxlength="50"
                show-word-limit
                :style="{ width: '100%' }"
              ></el-input>
            </el-form-item>
            <el-form-item
              :label="$t('kwRobotManage.artificialMsg')"
              prop="artificialMsg"
            >
              <el-input
                v-model="repeatData.artificialMsg"
                :placeholder="$t('kwRobotManage.artificialMsgTips')"
                :maxlength="50"
                show-word-limit
                clearable
                :style="{ width: '100%' }"
              ></el-input>
            </el-form-item> -->
          </el-form>
        </div>
      </div>
      <!-- 命中无响应意图配置 -->
      <!-- <div class="responseSetting-container">
        <div class="responseSetting-title">
          <span>{{ $t("kwRobotManage.responseSettingName") }}</span>
        </div>
        <div class="form-container">
          <div class="form-tips">
            <span
              >当用户问题命中意图，但由于运营人员未在该意图下关联知识或知识未配置答案，导致的机器人响应为空。</span
            >
          </div>
          <el-form
            size="medium"
            label-width="130px"
            :model="intentionForm"
            :rules="intentionRules"
            ref="intentionForm"
          >
            <el-form-item label="响应话术" prop="responseMsg">
              <el-checkbox v-model="responseChecked">{{
                $t("kwRobotManage.responseMsg")
              }}</el-checkbox>
              <el-input
                v-model="intentionForm.responseMsg"
                :placeholder="$t('kwRobotManage.responseTips')"
                show-word-limit
                :maxlength="50"
                clearable
              ></el-input>
            </el-form-item>

            <el-form-item>
              <el-checkbox v-model="recommendChecked">{{
                $t("kwRobotManage.recommended")
              }}</el-checkbox>
              <el-link
                :underline="false"
                type="primary"
                style="margin-bottom: 2px; margin-right: 6px"
                @click="isShowConnectKnowledgeDialog = true"
                >{{ $t("kwRobotManage.linkName") }}</el-link
              >
              <span
                >{{ $t("kwRobotManage.hasAdd") }}{{ recommendList.length }}
              </span>
            </el-form-item>
          </el-form>
        </div>
      </div> -->
    </div>
    <div class="btn-container" style="text-align: center">
      <el-button class="kw-primary-button kw-btn-blue" @click="handlerSave">{{
        $t("aicosCommon.saveBtn")
      }}</el-button>

      <el-button @click="handlerCancel" class="kw-default-button kw-btn-gray">{{
        $t("aicosCommon.cancelBtn")
      }}</el-button>
    </div>
    <HuilanDialog
      :title="$t('kwRobotManage.recommended')"
      :close-on-click-modal="isCloseOnClickModal"
      :visible.sync="isShowConnectKnowledgeDialog"
      append-to-body
      width="1200px"
      custom-class="customer-choose-knowledge-dialog"
    >
      <KwSimilar
        ref="kwSimilarRef"
        :faqData="recommendList"
        v-if="isShowConnectKnowledgeDialog"
      />
      <template v-slot:footer>
        <el-button size="small" @click="isShowConnectKnowledgeDialog = false">{{
          $t("aicosCommon.cancelBtn")
        }}</el-button>
        <el-button size="small" type="primary" @click="saveCusomerFaq">{{
          $t("aicosCommon.saveBtn")
        }}</el-button>
      </template>
    </HuilanDialog>
    <HuilanDialog
      :title="$t('kwRobotManage.information')"
      append-to-body
      width="40%"
      :visible.sync="infoDialog"
    >
      <template v-if="dialogType === 'ASR'">
        <Asr
          :selectId="formData.asr"
          :company="asrSelect.company"
          :asrContent="formData.asrContent"
          v-if="infoDialog"
          ref="asrContent"
        />
      </template>
      <template v-if="dialogType === 'TTS'">
        <Tts
          :selectId="formData.tts"
          :ttsContent="formData.ttsContent"
          v-if="infoDialog"
          ref="ttsContent"
        />
      </template>
      <template v-slot:footer>
        <el-button
          size="small"
          @click="
            infoDialog = false;
            dialogType = '';
          "
          >{{ $t("aicosCommon.cancelBtn") }}</el-button
        >
        <el-button size="small" type="primary" @click="saveContent">{{
          $t("aicosCommon.saveBtn")
        }}</el-button>
      </template>
    </HuilanDialog>
  </div>
</template>

<script>
import { baseURL } from "@/api/common";
import serviceList from "@/config/serviceList";
// const { kwRobot } = serviceList;
import KwSimilar from "@/components/kwSimilar/index";
import Asr from "./asr";
import Tts from "./tts";
import { mapGetters } from "vuex";
import {
  saveOrUpdateRobot,
  getRobotDictItemListByDictCode,
  getRobotSetting,
  getAsrList,
} from "@/api/kwRobot/kwRobotTrain/index";
import { getDetail } from "@/api/system/asrAndtts/asrconfigure";
export default {
  components: {
    KwSimilar,
    Tts,
    Asr,
  },
  props: {
    cur: {
      type: Object,
      default: () => {
        return {};
      },
    },
  },

  data() {
    return {
      dialogType: "",
      infoDialog: false,
      isShowConnectKnowledgeDialog: false,
      botId: "",
      asrData: [],
      ttsData: [],
      taskData: [], //行业类型
      industryData: [], //业务类型
      currentIndex: 0,
      dataObj: {
        fromSystemName: "robot",
        filelibrary: "robotManage",
      },
      responseChecked: false, //响应话术复选框
      responseMsg: "", //相应话术内容
      recommendChecked: false, //相关推荐复选框
      recommendList: [], //推荐数组
      headType: "0",
      repeatData: {
        welcomeInfo: "", //欢迎语
        unknownMessage: "", //未知问题
        // clarifyMsg: "", //意图澄清话术
        // cohesion: "", //多意图衔接话术
        // dialogueMsg: "", //对话流程衔接话术
        // artificialMsg: "", //转人工提示话术
      },
      intentionForm: {
        responseMsg: "诶？我竟然忘记了这个问题怎么回答",
      },
      formData: {
        robotName: "",
        robotImg: `${baseURL}robotImg/robotHead1.png`,
        desc: "",
        id: "",
        tts: "",
        asr: "",
        taskType: "", //业务类型
        industry: "", //所属行业
        asrContent: "",
        ttsContent: "",
      },
      rules: {
        robotName: [
          {
            required: true,
            message: this.$t("kwRobotManage.instanceNameTips"),
            trigger: "blur",
          },
        ],
        taskType: [
          {
            required: true,
            message: this.$t("kwRobotManage.taskTypeTips"),
            trigger: "change",
          },
        ],
        industry: [
          {
            required: true,
            message: this.$t("kwRobotManage.businessTypeTips"),
            trigger: "change",
          },
        ],
        desc: [],
      },
      repeatRules: {
        welcomeInfo: {
          required: true,
          message: this.$t("kwRobotManage.welcomeInfoTips"),
          trigger: "blur",
        },
        unknownMessage: {
          required: true,
          message: this.$t("kwRobotManage.unknownMsgTips"),
          trigger: "blur",
        },
      },
      intentionRules: {
        responseMsg: [
          {
            required: true,
            message: this.$t("kwRobotManage.responseTips"),
            trigger: "blur",
          },
        ],
      },
      robotImgAction: `${baseURL}api/${serviceList.file}/miniofile/upload`,
      robotImgfileList: [],
      robotDefaultList: [
        { url: `${baseURL}robotImg/robotHead1.png` },
        { url: `${baseURL}robotImg/robotHead2.png` },
        { url: `${baseURL}robotImg/robotHead3.png` },
        { url: `${baseURL}robotImg/headHead4.png` },
        { url: `${baseURL}robotImg/robotHead5.png` },
      ],
      imgUrl: "",
      // asrSelect: {},
      ttsSelect: {},
      // asrContent:'',
      // ttsContent:'',
      asr: "",
      tts: "",
      // 存放初始化时从服务器获取到的tts和asr配置
      serverSideAsrContent: "",
      serverSideTtsContent: "",
    };
  },
  computed: {
    ...mapGetters(["language"]),
    asrSelect() {
      const item = this.asrData.find((item) => item.id === this.formData.asr);
      return item || {};
    },
  },
  watch: {},
  created() {},
  async mounted() {
    this.botId = this.$store.getters.botObj.id;
    const taskType = {
      code: "industry_type",
    };
    const taskResult = await getRobotDictItemListByDictCode(taskType);
    if (taskResult.data.code == 200) {
      this.taskData = taskResult.data.data;
    }
    const industry = {
      code: "business_type",
    };
    const industryResult = await getRobotDictItemListByDictCode(industry);
    if (industryResult.data.code == 200) {
      this.industryData = industryResult.data.data;
    }
    this.getRobotInstanceSetting();
    const asrData = await getAsrList("ASR");
    if (asrData.data.success) {
      const list = asrData.data.data;
      this.asrData = list;
    }
    const ttsData = await getAsrList("TTS");
    if (ttsData.data.success) {
      this.ttsData = ttsData.data.data;
    }
  },
  methods: {
    async changeAsr(val) {
      // this.asrData.filter((item) => {
      //   if (val === item.id) {
      //     this.asrSelect = item;
      //   }
      // });
      if (val === this.asr) {
        this.formData.asrContent = this.serverSideAsrContent;
      } else {
        if (val === "") {
          this.formData.asrContent = "";
        } else {
          const { data } = await getDetail(val);
          if (data.success) {
            this.formData.asrContent = JSON.stringify(data.data);
          }
        }
      }
    },
    async changeTts(val) {
      this.ttsData.filter((item) => {
        if (val === item.id) {
          this.ttsSelect = item;
        }
      });

      if (val === this.tts) {
        this.formData.ttsContent = this.serverSideTtsContent;
      } else {
        if (val === "") {
          this.formData.ttsContent = "";
        } else {
          const { data } = await getDetail(val);
          if (data.success) {
            this.formData.ttsContent = JSON.stringify(data.data);
          }
        }
      }
    },
    saveContent() {
      if (this.dialogType === "ASR") {
        const asrContent = JSON.stringify(this.$refs.asrContent.form);
        this.formData.asrContent = asrContent;
      }
      if (this.dialogType === "TTS") {
        const ttsContent = JSON.stringify(this.$refs.ttsContent.form);
        this.formData.ttsContent = ttsContent;
      }
      this.infoDialog = false;
    },
    btnClick(type) {
      this.dialogType = type;
      this.infoDialog = true;
    },
    //获取机器人实例配置
    async getRobotInstanceSetting() {
      const info = {
        id: this.cur.id,
      };
      const result = await getRobotSetting(info);
      if (result.data.code == 200) {
        const Data = result.data.data;
        this.formData.id = Data.id;
        this.formData.robotName = Data.robotName;
        this.formData.desc = Data.description;
        this.formData.industry = Data.industryType;
        this.formData.taskType = Data.businessType;
        this.formData.asr = Data.asr;
        this.formData.tts = Data.tts;
        this.asr = Data.asr;
        this.tts = Data.tts;
        this.formData.asrContent = Data.asrContent;
        this.formData.ttsContent = Data.ttsContent;
        // this.asrContent = Data.asrContent;
        // this.ttsContent = Data.ttsContent;
        this.serverSideAsrContent = Data.asrContent;
        this.serverSideTtsContent = Data.ttsContent;
        this.responseChecked = Data.repWordsOpen ? true : false;
        // this.intentionForm.responseMsg = Data.repWords
        //   ? Data.repWords
        //   : "诶？我竟然忘记了这个问题怎么回答";
        this.recommendChecked = Data.recommendOpen ? true : false;
        if (Data.recommendQuestion !== null) {
          this.recommendList = JSON.parse(Data.recommendQuestion);
          this.recommendList.forEach((item) => {
            item.question = item.content;
          });
        }
        this.repeatData.welcomeInfo = Data.welcomeMessage
          ? Data.welcomeMessage
          : "您好，请问有什么可以帮您？";
        this.repeatData.unknownMessage = Data.unknownMessage
          ? Data.unknownMessage
          : "对不起，这个问题我还不会";
        this.repeatData.clarifyMsg = Data.inteClarify;
        this.repeatData.cohesion = Data.inteArticulate;
        this.repeatData.dialogueMsg = Data.dialogueArticulate;
        this.repeatData.artificialMsg = Data.turnAgentMessage;
        if (Data.headType == 0) {
          this.robotDefaultList.forEach((item, index) => {
            if (item.url == Data.headImgUrl) {
              this.currentIndex = index;
              this.headType = 0;
              this.formData.robotImg = Data.headImgUrl;
            }
          });
        }
        if (Data.headType == 1) {
          this.currentIndex = 10;
          this.imgUrl = Data.headImgUrl;
          this.formData.robotImg = Data.headImgUrl;
          this.robotImgfileList.push({ url: Data.headImgUrl });
        }
        this.$store.commit(
          "SET_UNKNOWNQUESTIONREPLIES",
          this.repeatData.unknownMessage
        );
      }
    },
    //上传之前
    robotImgBeforeUpload(file) {
      let isRightSize = file.size / 1024 / 1024 / 1024 < 80;
      if (!isRightSize) {
        this.$message.error(this.$t("kwRobotManage.fileSizeTips"));
      }
      return isRightSize;
    },
    //上传成功
    successUpload(file /*, fileList*/) {
      this.currentIndex = 10;
      this.headType = 1;
      this.formData.robotImg = this.imgUrl =
        baseURL.replace(/\/$/, "") + file.data.newFileName;
    },
    //控制文件上传数量的
    handleChange(file, fileList) {
      this.robotImgfileList = fileList.slice(-1);
    },
    //保存
    handlerSave() {
      let info = {};
      const elFormPromise = new Promise((resolve) => {
        this.$refs.elForm.validate((valid) => {
          if (valid) resolve();
        });
      });
      const repeatFormPromise = new Promise((resolve) => {
        this.$refs.repeatForm.validate((valid) => {
          if (valid) resolve();
        });
      });
      // const intentionFormPromise = new Promise((resolve) => {
      //   this.$refs.intentionForm.validate((valid) => {
      //     if (valid) resolve();
      //   });
      // });
      Promise.all([
        elFormPromise,
        repeatFormPromise,
        // intentionFormPromise,
      ]).then(async () => {
        // 保存时清空缓存的tts和asr的数据
        this.serverSideTtsContent = "";
        this.serverSideAsrContent = "";
        this.asr = "";
        this.tts = "";
        info = {
          botId: this.botId,
          robotName: this.formData.robotName, //机器人名字
          type: "1", //区别机器人管理和实例的标识
          headType: this.headType, //上传头像的类型 0系统 1自定义
          description: this.formData.desc, //描述
          headImgUrl: this.formData.robotImg, //头像地址
          businessType: this.formData.taskType, //业务类型
          industryType: this.formData.industry, //行业类型
          id: this.formData.id,
          dialogueArticulate: this.repeatData.dialogueMsg, //对话流程衔接话术
          inteArticulate: this.repeatData.cohesion, //意图衔接话术
          inteClarify: this.repeatData.clarifyMsg, //澄清话术
          recommendOpen: this.recommendChecked ? 1 : 0, //相关推荐开关
          recommendQuestion: JSON.stringify(this.recommendList), //相关推荐的数据
          repWordsOpen: this.responseChecked ? 1 : 0, //响应话术开关
          // repWords: this.intentionForm.responseMsg, //相应话术内容
          unknownMessage: this.repeatData.unknownMessage, //未知话术
          welcomeMessage: this.repeatData.welcomeInfo, //欢迎语
          turnAgentMessage: this.repeatData.artificialMsg, //转人工
          asr: this.formData.asr,
          tts: this.formData.tts,
          asrContent: this.formData.asrContent,
          ttsContent: this.formData.ttsContent,
        };
        this.$store.commit(
          "SET_UNKNOWNQUESTIONREPLIES",
          this.repeatData.unknownMessage
        );
        const result = await saveOrUpdateRobot(info);
        if (result.data.code == 200) {
          this.$message({
            type: "success",
            message: this.$t("aicosCommon.successOperate"),
          });
          this.$emit("backInstance");
          this.cur = {};
        }
      });
    },
    chooseImg(e, index, type, url) {
      this.currentIndex = index;
      this.headType = type;
      this.formData.robotImg = url;
    },
    // 保存自定义推荐问题
    saveCusomerFaq() {
      this.recommendList =
        this.$refs.kwSimilarRef.$refs.similarContainerRef.saveSimilarQuesion();
      this.recommendList.forEach((item) => {
        item.content = item.question;
        item.type = 1;
      });
      this.isShowConnectKnowledgeDialog = false;
    },
    //点击取消返回实例列表
    handlerCancel() {
      this.$emit("backInstance");
    },
  },
};
</script>

<style scoped lang="scss">
.setting-container {
  height: calc(100% - 32px);
}

/deep/ .el-upload-list__item {
  width: 30px;
  height: 30px;
  display: none;
}

/deep/ .el-upload--picture-card {
  width: 30px;
  height: 30px;
  line-height: 30px;
}

.avatar-container {
  display: flex;

  .el-avatar {
    margin-right: 10px;
    cursor: pointer;
  }

  .avatar-choosed {
    border: 2px solid green;
  }
}

.info-title {
  font-size: 16px;
  font-weight: 700;
  border-bottom: 1px solid #f1f1f2;
  margin-bottom: 10px;
}

.repeat-title {
  font-size: 16px;
  font-weight: 700;
  border-bottom: 1px solid #f1f1f2;
  margin-bottom: 10px;
}

.responseSetting-title {
  font-size: 16px;
  font-weight: 700;
  border-bottom: 1px solid #f1f1f2;
  margin-bottom: 10px;
}

.form-tips {
  margin-bottom: 10px;
  font-size: 12px;
  color: #999999;
}
</style>
