<template>
  <div>
    <el-form
      ref="elForm"
      :model="formData"
      :rules="rules"
      size="medium"
      label-width="100px"
      :label-position="labelPosition"
    >
      <!-- 意图类型 -->
      <el-form-item
        :label="this.$t('kwIntentionManage.intentionType') + ':'"
        prop="intentionType"
      >
        <el-select
          v-model="formData.intentionType"
          @change="changeStatus"
          :placeholder="this.$t('kwIntentionManage.intentionTypeTip')"
          clearable
          :disabled="isEdit"
          :style="{ width: '100%' }"
        >
          <el-option
            v-for="(item, index) in intentionTypeOptions"
            :key="index"
            :label="item.label"
            :value="item.value"
            :disabled="item.disabled"
          ></el-option>
        </el-select>
      </el-form-item>
      <!-- 意图名称 -->
      <el-form-item
        :label="this.$t('kwIntentionManage.intentionName') + ':'"
        prop="intentionName"
      >
        <el-input
          v-model="formData.intentionName"
          :placeholder="this.$t('kwIntentionManage.intentionNameTip')"
          @blur="checkSameName"
          clearable
          :style="{ width: '100%' }"
        >
        </el-input>
      </el-form-item>
      <!-- 对外展示名称 -->
      <!-- <el-form-item
        v-if="addType === 'son' || flag || formData.intentionType === 1"
        :label="this.$t('kwIntentionManage.outShowName') + ':'"
        prop="showName"
      >
        <el-input
          v-model="formData.showName"
          :placeholder="this.$t('kwIntentionManage.outShowNameTip')"
          clearable
          :style="{ width: '100%' }"
        >
        </el-input>
      </el-form-item> -->
      <!-- 意图主题 -->
      <el-form-item
        v-if="addType === 'son' || flag || formData.intentionType === 1"
        :label="this.$t('kwIntentionManage.intentionTitle') + ':'"
        prop="intentionTitle"
      >
        <el-input
          v-model="formData.intentionTitle"
          type="textarea"
          :placeholder="this.$t('kwIntentionManage.intentionTitleTip')"
          :autosize="{ minRows: 4, maxRows: 4 }"
          :style="{ width: '100%' }"
        ></el-input>
        <span style="color: #bcbcbc">{{ $t("kwIntentionManage.tips") }}</span>
      </el-form-item>
      <!-- 意图问法 -->
      <el-form-item :label="this.$t('kwIntentionManage.intentionAns') + ':'">
        <el-link
          :underline="false"
          type="primary"
          @click="handlerAddIntention"
          >{{ $t("kwIntentionManage.addIntentionAns") }}</el-link
        >
        <!--添加/管理意图问法-->
        <span
          >{{ $t("kwIntentionManage.hasAdd") }}:{{
            this.methodsArr.length + this.regularArr.length
          }}</span
        >
      </el-form-item>
      <!-- 关联知识 -->
      <el-form-item
        :label="this.$t('kwIntentionManage.similarKnowledge') + ':'"
        v-if="outAndtTitleFlag"
      >
        <el-link :underline="false" type="primary" @click="openSimilar">{{
          $t("kwIntentionManage.addSimilarKnowledge")
        }}</el-link>
        <!--添加/管理关联知识-->
        <span
          >{{ $t("kwIntentionManage.hasAdd") }}:{{
            this.recommendList.faq.length + this.recommendList.tab.length
          }}</span
        >
      </el-form-item>
      <el-form-item
        :label="$t('kwIntentionManage.jumpDialogueProcess')"
        v-if="formData.intentionType === 2 && isShow"
        prop="dialogueTypeId"
      >
        <div>{{ $t("kwIntentionManage.jumpDialogueProcessTip") }}</div>
        <div>
          <div>
            <p>
              <strong>{{ $t("kwIntentionManage.IMType") }}：</strong
              >{{ $t("kwIntentionManage.IMTypeTip") }}
            </p>
            <div style="padding-left: 20px">
              <div>
                <p v-if="formData.IMSelectValue">
                  {{ formData.IMSelectValue }}
                </p>
                <div>
                  <span>{{ $t("kwIntentionManage.IMServices") }}：</span>
                  <el-select
                    v-model="formData.dialogueTypeIdIM"
                    @change="changeDialogue($event, 'IM')"
                    :placeholder="$t('aicosCommon.pleaseSelect')"
                    style="margin-right: 10px"
                  >
                    <el-option
                      v-for="(item, index) in dialogueOptions"
                      :key="index"
                      :label="item.categoryName"
                      :value="item.id"
                    ></el-option>
                  </el-select>
                  <el-select
                    v-model="formData.dialogueSpeechIdIM"
                    @change="changeDialogueFlow($event, 'IM')"
                    :placeholder="$t('aicosCommon.pleaseSelect')"
                    style="margin-right: 10px"
                  >
                    <el-option
                      v-for="(item, index) in dialogueFlowOptionsIM"
                      :key="index"
                      :label="item.speechName"
                      :value="item.id"
                    ></el-option>
                  </el-select>
                  <el-select
                    v-model="formData.dialogueProcessIdIM"
                    @change="changeFlow($event, 'IM')"
                    :placeholder="$t('aicosCommon.pleaseSelect')"
                    style="margin-right: 10px"
                  >
                    <el-option
                      v-for="(item, index) in flowOptionsIM"
                      :key="index"
                      :label="item.processName"
                      :value="item.id"
                    ></el-option>
                  </el-select>
                  <el-select
                    v-model="formData.dialogueProcessNodeIdIM"
                    :placeholder="$t('aicosCommon.pleaseSelect')"
                    clearable
                  >
                    <el-option
                      v-for="(item, index) in nodeOptionsIM"
                      :key="index"
                      :label="item.nodeName"
                      :value="item.id"
                    ></el-option>
                  </el-select>
                </div>
              </div>
              <div style="margin-top: 10px">
                <p v-if="formData.IMSelectValueAssist">
                  {{ formData.IMSelectValueAssist }}
                </p>
                <div>
                  <span>{{ $t("kwIntentionManage.IMAssistance") }}：</span>
                  <el-select
                    v-model="formData.dialogueTypeIdIMAssist"
                    @change="changeDialogue($event, 'IM', 'assist')"
                    :placeholder="$t('aicosCommon.pleaseSelect')"
                    style="margin-right: 10px"
                  >
                    <el-option
                      v-for="(item, index) in dialogueOptions"
                      :key="index"
                      :label="item.categoryName"
                      :value="item.id"
                    ></el-option>
                  </el-select>
                  <el-select
                    v-model="formData.dialogueSpeechIdIMAssist"
                    @change="changeDialogueFlow($event, 'IM', 'assist')"
                    :placeholder="$t('aicosCommon.pleaseSelect')"
                    style="margin-right: 10px"
                  >
                    <el-option
                      v-for="(item, index) in dialogueFlowOptionsIMAssist"
                      :key="index"
                      :label="item.speechName"
                      :value="item.id"
                    ></el-option>
                  </el-select>
                  <el-select
                    v-model="formData.dialogueProcessIdIMAssist"
                    @change="changeFlow($event, 'IM', 'assist')"
                    :placeholder="$t('aicosCommon.pleaseSelect')"
                    style="margin-right: 10px"
                  >
                    <el-option
                      v-for="(item, index) in flowOptionsIMAssist"
                      :key="index"
                      :label="item.processName"
                      :value="item.id"
                    ></el-option>
                  </el-select>
                  <el-select
                    v-model="formData.dialogueProcessNodeIdIMAssist"
                    :placeholder="$t('aicosCommon.pleaseSelect')"
                    clearable
                  >
                    <el-option
                      v-for="(item, index) in nodeOptionsIMAssist"
                      :key="index"
                      :label="item.nodeName"
                      :value="item.id"
                    ></el-option>
                  </el-select>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div>
          <div>
            <p>
              <strong>{{ $t("kwIntentionManage.phoneType") }}：</strong
              >{{ $t("kwIntentionManage.phoneTypeTip") }}
            </p>
            <div style="padding-left: 20px">
              <div>
                <div>
                  <p v-if="formData.callSelectValue">
                    {{ formData.callSelectValue }}
                  </p>
                  <div style="display: flex">
                    <span>{{ $t("kwIntentionManage.phoneServices") }}：</span>
                    <el-select
                      v-model="formData.dialogueTypeIdCall"
                      @change="changeDialogue($event, 'call')"
                      :placeholder="$t('aicosCommon.pleaseSelect')"
                      style="margin-right: 10px"
                    >
                      <el-option
                        v-for="(item, index) in dialogueOptions"
                        :key="index"
                        :label="item.categoryName"
                        :value="item.id"
                      ></el-option>
                    </el-select>
                    <el-select
                      v-model="formData.dialogueSpeechIdCall"
                      @change="changeDialogueFlow($event, 'call')"
                      :placeholder="$t('aicosCommon.pleaseSelect')"
                      style="margin-right: 10px"
                    >
                      <el-option
                        v-for="(item, index) in dialogueFlowOptions"
                        :key="index"
                        :label="item.speechName"
                        :value="item.id"
                      ></el-option>
                    </el-select>
                    <el-select
                      v-model="formData.dialogueProcessIdCall"
                      @change="changeFlow($event, 'call')"
                      :placeholder="$t('aicosCommon.pleaseSelect')"
                      style="margin-right: 10px"
                    >
                      <el-option
                        v-for="(item, index) in flowOptions"
                        :key="index"
                        :label="item.processName"
                        :value="item.id"
                      ></el-option>
                    </el-select>
                    <el-select
                      v-model="formData.dialogueProcessNodeIdCall"
                      :placeholder="$t('aicosCommon.pleaseSelect')"
                      clearable
                    >
                      <el-option
                        v-for="(item, index) in nodeOptions"
                        :key="index"
                        :label="item.nodeName"
                        :value="item.id"
                      ></el-option>
                    </el-select>
                  </div>
                </div>
                <div style="margin-top: 10px">
                  <p v-if="formData.callSelectValueAssist">
                    {{ formData.callSelectValueAssist }}
                  </p>
                  <div style="display: flex">
                    <span>{{ $t("kwIntentionManage.phoneAssistance") }}：</span>
                    <el-select
                      v-model="formData.dialogueTypeIdCallAssist"
                      @change="changeDialogue($event, 'call', 'assist')"
                      :placeholder="$t('aicosCommon.pleaseSelect')"
                      style="margin-right: 10px"
                    >
                      <el-option
                        v-for="(item, index) in dialogueOptions"
                        :key="index"
                        :label="item.categoryName"
                        :value="item.id"
                      ></el-option>
                    </el-select>
                    <el-select
                      v-model="formData.dialogueSpeechIdCallAssist"
                      @change="changeDialogueFlow($event, 'call', 'assist')"
                      :placeholder="$t('aicosCommon.pleaseSelect')"
                      style="margin-right: 10px"
                    >
                      <el-option
                        v-for="(item, index) in dialogueFlowOptionsAssist"
                        :key="index"
                        :label="item.speechName"
                        :value="item.id"
                      ></el-option>
                    </el-select>
                    <el-select
                      v-model="formData.dialogueProcessIdCallAssist"
                      @change="changeFlow($event, 'call', 'assist')"
                      :placeholder="$t('aicosCommon.pleaseSelect')"
                      style="margin-right: 10px"
                    >
                      <el-option
                        v-for="(item, index) in flowOptionsAssist"
                        :key="index"
                        :label="item.processName"
                        :value="item.id"
                      ></el-option>
                    </el-select>
                    <el-select
                      v-model="formData.dialogueProcessNodeIdCallAssist"
                      :placeholder="$t('aicosCommon.pleaseSelect')"
                      clearable
                    >
                      <el-option
                        v-for="(item, index) in nodeOptionsAssist"
                        :key="index"
                        :label="item.nodeName"
                        :value="item.id"
                      ></el-option>
                    </el-select>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </el-form-item>
      <!-- 跳转类型 -->
      <!-- <el-form-item label="跳转类型" prop="skipType">
        <el-radio-group v-model="formData.skipType" size="medium">
          <el-radio v-for="(item, index) in skipTypeOptions" :key="index" :label="item.value"
            :disabled="item.disabled">{{item.label}}</el-radio>
        </el-radio-group>
      </el-form-item> -->
      <el-form-item size="large" class="btnContainer" v-if="!this.editNode.id">
        <el-button
          type="primary"
          size="small"
          @click="submitForm"
          :disabled="disable"
          >{{ $t("aicosCommon.saveBtn") }}</el-button
        >
        <!--保存-->
        <el-button @click="goBack" size="small">{{
          $t("aicosCommon.cancelBtn")
        }}</el-button>
        <!--取消-->
      </el-form-item>
    </el-form>
    <!-- 添加管理意图问法 -->
    <HuilanDialog
      :title="$t('kwIntentionManage.expandMethod')"
      append-to-body
      :visible.sync="expandFlag"
      width="600px"
    >
      <el-tabs v-model="activeName" @tab-click="handleClick">
        <el-tab-pane
          :label="`${$t(
            'kwIntentionManage.commonAnswer'
          )}${`(${this.methodsArr.length})`}`"
          name="first"
        >
          <CommonAnswer
            v-if="expandFlag"
            ref="commonAnswer"
            :domainArr="methodsArr"
            @saveCommonMethod="saveCommonMethod"
          />
        </el-tab-pane>
        <el-tab-pane
          :label="`${$t(
            'kwIntentionManage.regular'
          )}${`(${this.regularArr.length})`}`"
          name="second"
        >
          <Regular
            v-if="expandFlag"
            ref="regular"
            :regularArr="regularArr"
            @saveRegular="saveRegular"
          />
        </el-tab-pane>
      </el-tabs>
      <template v-slot:footer>
        <el-button size="small" @click="handlerCancel">{{
          $t("aicosCommon.cancelBtn")
        }}</el-button>
        <el-button size="small" type="primary" @click="saveExpand">{{
          $t("aicosCommon.saveBtn")
        }}</el-button>
      </template>
    </HuilanDialog>

    <!-- 添加/管理相关制度 -->
    <HuilanDialog
      :title="$t('kwIntentionManage.similarKnowledge')"
      :visible.sync="systemDialogVisible"
      append-to-body
      width="1200px"
    >
      <KwSimilar
        v-if="systemDialogVisible"
        :faqData="recommendList"
        ref="kwSimilarRef"
        :isTab="true"
      />
      <template v-slot:footer>
        <el-button size="small" @click="systemDialogVisible = false">{{
          $t("aicosCommon.cancelBtn")
        }}</el-button>
        <el-button size="small" type="primary" @click="saveSimilarExpand">{{
          $t("aicosCommon.saveBtn")
        }}</el-button>
      </template>
    </HuilanDialog>
  </div>
</template>

<script>
import CommonAnswer from "@/components/kwAddInMethod/commonAnswer";
import Regular from "@/components/kwAddInMethod/regular";
import KwSimilar from "@/components/kwSimilar/index";
import { findNodeByVal } from "@/util/qsgCommon";
import {
  saveOrUpdate,
  detail,
  isSameName,
  allAiccCategory,
  aiccSpeechListByCategory,
  aiccFlowBySpeechId,
  aiccNodeByFlowId,
  connectAiccEnable,
} from "@/api/kwKnowledgeCenter/kwIntention/index";
import { deepClone } from "@/util/util";
import { mapGetters } from "vuex";
import { getRules } from "@/util/regx";
// import { itemIntersectByLine } from "@antv/g6-core/lib/util/math";
export default {
  props: {
    botId: {
      type: String,
      default: () => {
        return "";
      },
    },
    addType: {
      type: String,
      default: () => {
        return "";
      },
    },
    classifyId: {
      type: String,
      default: () => {
        return "";
      },
    },
    cur: {
      type: Object,
      default: () => {
        return {};
      },
    },
    itemNode: {
      type: Object,
      default: () => {
        return {};
      },
    },
    isEdit: {
      type: Boolean,
      default: () => {
        return false;
      },
    },
    sonCur: {
      type: Object,
      default: () => {
        return {};
      },
    },
    addSonIntentFlag: {
      type: Boolean,
      default: () => {
        return false;
      },
    },
    editNode: {
      type: Object,
      default: () => {
        return {};
      },
    },
  },
  components: {
    CommonAnswer,
    Regular,
    KwSimilar,
  },

  computed: {
    ...mapGetters(["language"]),
    labelPosition() {
      return this.language != "zh" ? "top" : "right";
    },
  },
  data() {
    return {
      dialogueProcessList: [],
      isShow: false,
      dialogueOptions: [],
      dialogueFlowOptions: [],
      flowOptions: [],
      nodeOptions: [],
      dialogueFlowOptionsAssist: [],
      flowOptionsAssist: [],
      nodeOptionsAssist: [],
      dialogueFlowOptionsIM: [],
      flowOptionsIM: [],
      nodeOptionsIM: [],
      dialogueFlowOptionsIMAssist: [],
      flowOptionsIMAssist: [],
      nodeOptionsIMAssist: [],
      disable: false,
      recommendList: { faq: [], tab: [] },
      flag: false,
      isHaveSameNameFlag: false, //是否存在相同的意图名称
      saveId: "", //主键id
      outAndtTitleFlag: true, //是否展示对外展示名称和意图主题
      activeName: "first",
      expandFlag: false, //拓展问法标识
      closeFlag: false,
      systemDialogVisible: false,
      closeRegularFlag: false,
      recommendFlag: false, //推荐问法flag
      methodsArr: [], //常用问法
      regularArr: [], //正则表达式
      formData: {
        intentionType: 1,
        intentionName: "",
        showName: "",
        intentionTitle: "",
        dialogueTypeId: "",
        dialogueTypeIdIM: "",
        dialogueSpeechIdIM: "",
        dialogueProcessIdIM: "",
        dialogueProcessNodeIdIM: "",
        dialogueTypeIdIMAssist: "",
        dialogueSpeechIdIMAssist: "",
        dialogueProcessIdIMAssist: "",
        dialogueProcessNodeIdIMAssist: "",
        dialogueTypeIdCall: "",
        dialogueSpeechIdCall: "",
        dialogueProcessIdCall: "",
        dialogueProcessNodeIdCall: "",
        dialogueTypeIdCallAssist: "",
        dialogueSpeechIdCallAssist: "",
        dialogueProcessIdCallAssist: "",
        dialogueProcessNodeIdCallAssist: "",
        IMSelectValue: "",
        callSelectValue: "",
        IMSelectValueAssist: "",
        callSelectValueAssist: "",
      },
      rules: {
        intentionType: [],
        intentionName: [
          {
            required: true,
            message: this.$t("kwIntentionManage.intentionNameTip"), //请输入意图名称
            trigger: "blur",
          },
          ...getRules(["charNumHan"]),
        ],
        showName: [
          {
            required: true,
            message: this.$t("kwIntentionManage.outShowNameTip"), //对外展示名称
            trigger: "blur",
          },
        ],
        intentionTitle: [
          {
            required: true,
            message: this.$t("kwIntentionManage.intentionTitleTip"), //意图主题
            trigger: "blur",
          },
          ...getRules(["charNumHanSeparator"]),
        ],
        // dialogueTypeId: [
        //   {
        //     required: true,
        //     message: this.$t("kwIntentionManage.selectDialogueProcess"), //请选择对话流程
        //     trigger: "change",
        //   },
        // ],
      },
      intentionTypeOptions: [
        {
          label: this.$t("kwIntentionManage.answerType"),
          value: 1,
        },
        {
          label: this.$t("kwIntentionManage.taskType"),
          value: 2,
        },
      ],
    };
  },
  watch: {},
  async mounted() {
    // if (this.sonCur.id) {
    //   this.flag = true;
    // } else {
    //   this.flag = false;
    // }
    allAiccCategory().then((res) => {
      if (res.data.code == 200) {
        this.dialogueOptions = res.data.data;
      }
    });
    const show = await connectAiccEnable();

    if (show.data.code == 200) {
      this.isShow = show.data.data;
    }
    if (
      this.cur.id ||
      (this.editNode.id !== undefined && this.editNode.id.indexOf("node") == -1)
    ) {
      const info = {
        id: this.cur.id ? this.cur.id : this.editNode.id,
      };
      const result = await detail(info);
      if (result.data.code == 200) {
        const Data = result.data.data;
        this.formData.intentionType = Data.intentType ? Data.intentType : 1; //问答类型
        this.formData.intentionName = Data.intentName; //意图名称
        // this.formData.showName = Data.showName; //对外展示名称
        this.formData.intentionTitle = Data.intentTheme; //意图主题
        this.methodsArr = Data.normalSimilar; //常用问法
        this.regularArr = Data.regularSimilar; //正则表达式
        if (this.formData.intentionType === 2) {
          this.dialogueProcessList = Data.dialogueProcessList;
          Data.dialogueProcessList.forEach((item) => {
            // IM服务
            if (item.speechType === 1 || item.speechType === 3) {
              // this.formData.dialogueProcessIdIM = item.dialogueProcessId;
              // this.formData.dialogueProcessNodeIdIM =
              //   item.dialogueProcessNodeId;
              // this.formData.dialogueSpeechIdIM = item.dialogueSpeechId;
              // this.formData.dialogueTypeIdIM = item.dialogueTypeId;
              this.formData.IMSelectValue = `${item.dialogueType}_${item.dialogueSpeech}_${item.dialogueProcessName}_${item.dialogueProcessNodeName}`;
              // this.changeDialogue(item.dialogueTypeId, "IM");
              // this.changeDialogueFlow(item.dialogueSpeechId, "IM");
              // this.changeFlow(item.dialogueProcessId, "IM");
            }
            // IM辅助
            if (item.speechType === 5) {
              // this.formData.dialogueProcessIdIMAssist = item.dialogueProcessId;
              // this.formData.dialogueProcessNodeIdIMAssist =
              //   item.dialogueProcessNodeId;
              // this.formData.dialogueSpeechIdIMAssist = item.dialogueSpeechId;
              // this.formData.dialogueTypeIdIMAssist = item.dialogueTypeId;
              this.formData.IMSelectValueAssist = `${item.dialogueType}_${item.dialogueSpeech}_${item.dialogueProcessName}_${item.dialogueProcessNodeName}`;
              // this.changeDialogue(item.dialogueTypeId, "IM", "assist");
              // this.changeDialogueFlow(item.dialogueSpeechId, "IM", "assist");
              // this.changeFlow(item.dialogueProcessId, "IM", "assist");
            }
            // 电话服务
            if (item.speechType === 2 || item.speechType === 4) {
              // this.formData.dialogueProcessIdCall = item.dialogueProcessId;
              // this.formData.dialogueProcessNodeIdCall =
              //   item.dialogueProcessNodeId;
              // this.formData.dialogueSpeechIdCall = item.dialogueSpeechId;
              // this.formData.dialogueTypeIdCall = item.dialogueTypeId;
              this.formData.callSelectValue = `${item.dialogueType}_${item.dialogueSpeech}_${item.dialogueProcessName}_${item.dialogueProcessNodeName}`;
              // this.changeDialogue(item.dialogueTypeId, "call");
              // this.changeDialogueFlow(item.dialogueSpeechId, "call");
              // this.changeFlow(item.dialogueProcessId, "call");
            }
            // 电话辅助
            if (item.speechType === 6) {
              // this.formData.dialogueProcessIdCallAssist =
              //   item.dialogueProcessId;
              // this.formData.dialogueProcessNodeIdCallAssist =
              //   item.dialogueProcessNodeId;
              // this.formData.dialogueSpeechIdCallAssist = item.dialogueSpeechId;
              // this.formData.dialogueTypeIdCallAssist = item.dialogueTypeId;
              this.formData.callSelectValueAssist = `${item.dialogueType}_${item.dialogueSpeech}_${item.dialogueProcessName}_${item.dialogueProcessNodeName}`;
              // this.changeDialogue(item.dialogueTypeId, "call", "assist");
              // this.changeDialogueFlow(item.dialogueSpeechId, "call", "assist");
              // this.changeFlow(item.dialogueProcessId, "call", "assist");
            }
          });
        }
        Data.faqKnowledgeList.forEach((item) => {
          item.id = item.knowledgeId;
          item.question = item.content;
        });
        Data.qaKnowledgeList.forEach((item) => {
          item.id = item.knowledgeId;
          item.question = item.content;
        });
        this.recommendList.faq = Data.faqKnowledgeList;
        this.recommendList.tab = Data.qaKnowledgeList;
        this.saveId = Data.id; //主键id
        // console.log(this.editNode);
        // console.log(this.addType);
        if (Data.intentType == 2) {
          if (
            !this.validatenull(this.cur.ancestors) ||
            !this.validatenull(this.editNode.ancestors)
          ) {
            this.flag = true;
          } else {
            this.flag = false;
          }
          this.outAndtTitleFlag = false;
        } else {
          this.flag = true;
          this.outAndtTitleFlag = true;
        }
      }
    }
  },
  methods: {
    // 1：IM类型 2：电话类型 3：IM填单 4：电话填单 5：IM辅助 6：电话辅助
    changeDialogue(val, type, flag) {
      this.formData.dialogueTypeId = val;
      this.$refs.elForm.clearValidate("dialogueTypeId");
      aiccSpeechListByCategory({ id: val }).then((res) => {
        if (res.data.code == 200) {
          let data = res.data.data;
          if (data.length > 0) {
            if (type === "call") {
              if (this.validatenull(flag)) {
                this.dialogueFlowOptions = data.filter(
                  (item) => item.type === 2 || item.type === 4
                );
              } else {
                this.dialogueFlowOptionsAssist = data.filter(
                  (item) => item.type === 6
                );
              }
            }
            if (type === "IM") {
              if (this.validatenull(flag)) {
                this.dialogueFlowOptionsIM = data.filter(
                  (item) => item.type === 1 || item.type === 3
                );
              } else {
                this.dialogueFlowOptionsIMAssist = data.filter(
                  (item) => item.type === 5
                );
              }
            }
          }
        }
      });
    },
    changeDialogueFlow(val, type, flag) {
      aiccFlowBySpeechId({ id: val }).then((res) => {
        if (res.data.code == 200) {
          if (type === "IM") {
            if (this.validatenull(flag)) {
              this.flowOptionsIM = res.data.data;
            } else {
              this.flowOptionsIMAssist = res.data.data;
            }
          } else {
            if (this.validatenull(flag)) {
              this.flowOptions = res.data.data;
            } else {
              this.flowOptionsAssist = res.data.data;
            }
          }
        }
      });
    },
    changeFlow(val, type, flag) {
      aiccNodeByFlowId({ id: val }).then((res) => {
        if (res.data.code == 200) {
          if (type === "IM") {
            if (this.validatenull(flag)) {
              this.nodeOptionsIM = res.data.data;
            } else {
              this.nodeOptionsIMAssist = res.data.data;
            }
          } else {
            if (this.validatenull(flag)) {
              this.nodeOptions = res.data.data;
            } else {
              this.nodeOptionsAssist = res.data.data;
            }
          }
        }
      });
    },
    goBack() {
      this.$emit("back");
    },

    //添加/管理意图问法
    handlerAddIntention() {
      this.expandFlag = true;
      this.activeName = "first";
    },
    //保存意图问法
    saveExpand() {
      this.$refs.commonAnswer.submitExpand();
      this.$refs.regular.submitExpand();
      if (this.closeFlag && this.closeRegularFlag) {
        this.expandFlag = false;
      }
    },

    //切换问答类型
    changeStatus(value) {
      if (value == 1) {
        this.methodsArr = [];
        this.regularArr = [];
        this.flag = true;
        this.outAndtTitleFlag = true;
      } else {
        this.outAndtTitleFlag = false;
        this.flag = false;
      }
    },
    //失去焦点判断是否有相同的意图名称
    async checkSameName() {
      if (this.formData.intentionName != "") {
        const checkInfo = {
          botId: this.botId,
          intentName: this.formData.intentionName,
          id: this.saveId,
        };
        const result = await isSameName(checkInfo);
        if (result.data.code == 200) {
          this.isHaveSameNameFlag = result.data.data.isSameName;
          if (this.isHaveSameNameFlag) {
            this.$message({
              type: "warning",
              message: this.$t("kwIntentionManage.hasSameName"),
            });
          }
        }
      }
    },
    //保存
    submitForm() {
      this.$refs.elForm.validate((valid) => {
        if (!valid) {
          return;
        } else {
          if (
            this.formData.dialogueProcessNodeIdIMAssist === "" &&
            this.formData.dialogueProcessNodeIdCallAssist === "" &&
            this.formData.dialogueProcessNodeIdIM === "" &&
            this.formData.dialogueProcessNodeIdCall === "" &&
            this.validatenull(this.dialogueProcessList) &&
            this.formData.intentionType === 2 &&
            this.isShow
          ) {
            this.$message.warning(
              this.$t("kwIntentionManage.selectDialogueProcess")
            );
            return;
          }
          const newInfo = {
            ancestors: this.sonCur.id,
            botId: this.botId,
            classifyId: this.classifyId,
            intentType: this.formData.intentionType, //类型
            intentName: this.formData.intentionName, //意图名称
            // showName: this.formData.showName, //对外展示名称
            intentTheme: this.formData.intentionTitle, //意图主题
            knowledgeList: [], //关联知识
            tableQAKnowledgeList: [],
            similarList: [], //意图问法
            id: this.saveId,
            topNode: this.sonCur.topNode ? this.sonCur.topNode : this.sonCur.id,
            dialogueProcessList: [],
          };
          if (
            !this.validatenull(this.formData.dialogueProcessNodeIdIM) ||
            !this.validatenull(this.formData.dialogueProcessNodeIdIMAssist) ||
            !this.validatenull(this.formData.dialogueProcessNodeIdCall) ||
            !this.validatenull(this.formData.dialogueProcessNodeIdCallAssist)
          ) {
            if (!this.validatenull(this.formData.dialogueProcessNodeIdIM)) {
              let dialogueType = this.dialogueOptions.find(
                  (item) => item.id === this.formData.dialogueTypeIdIM
                ).categoryName,
                dialogueSpeech = this.dialogueFlowOptionsIM.find(
                  (item) => item.id === this.formData.dialogueSpeechIdIM
                ).speechName,
                dialogueProcessName = this.flowOptionsIM.find(
                  (item) => item.id === this.formData.dialogueProcessIdIM
                ).processName,
                dialogueProcessNodeName = this.nodeOptionsIM.find(
                  (item) => item.id === this.formData.dialogueProcessNodeIdIM
                ).nodeName;
              // speechType = this.dialogueFlowOptionsIM.find(
              //   (item) => item.id === this.formData.dialogueSpeechIdIM
              // ).type;
              newInfo.dialogueProcessList.push({
                dialogueProcessId: this.formData.dialogueProcessIdIM,
                dialogueProcessNodeId: this.formData.dialogueProcessNodeIdIM,
                dialogueSpeechId: this.formData.dialogueSpeechIdIM,
                dialogueTypeId: this.formData.dialogueTypeIdIM,
                dialogueType,
                dialogueSpeech,
                dialogueProcessName,
                dialogueProcessNodeName,
                speechType: 1,
              });
              this.formData.IMSelectValue = `${dialogueType}_${dialogueSpeech}_${dialogueProcessName}_${dialogueProcessNodeName}`;
            } else {
              const item = findNodeByVal(
                this.dialogueProcessList,
                "speechType",
                1
              );
              if (!this.validatenull(item)) {
                newInfo.dialogueProcessList.push(item);
              }
            }
            if (
              !this.validatenull(this.formData.dialogueProcessNodeIdIMAssist)
            ) {
              let dialogueType = this.dialogueOptions.find(
                  (item) => item.id === this.formData.dialogueTypeIdIMAssist
                ).categoryName,
                dialogueSpeech = this.dialogueFlowOptionsIMAssist.find(
                  (item) => item.id === this.formData.dialogueSpeechIdIMAssist
                ).speechName,
                dialogueProcessName = this.flowOptionsIMAssist.find(
                  (item) => item.id === this.formData.dialogueProcessIdIMAssist
                ).processName,
                dialogueProcessNodeName = this.nodeOptionsIMAssist.find(
                  (item) =>
                    item.id === this.formData.dialogueProcessNodeIdIMAssist
                ).nodeName;
              newInfo.dialogueProcessList.push({
                dialogueProcessId: this.formData.dialogueProcessIdIMAssist,
                dialogueProcessNodeId:
                  this.formData.dialogueProcessNodeIdIMAssist,
                dialogueSpeechId: this.formData.dialogueSpeechIdIMAssist,
                dialogueTypeId: this.formData.dialogueTypeIdIMAssist,
                dialogueType,
                dialogueSpeech,
                dialogueProcessName,
                dialogueProcessNodeName,
                speechType: 5,
              });
              this.formData.IMSelectValueAssist = `${dialogueType}_${dialogueSpeech}_${dialogueProcessName}_${dialogueProcessNodeName}`;
            } else {
              const item = findNodeByVal(
                this.dialogueProcessList,
                "speechType",
                5
              );
              if (!this.validatenull(item)) {
                newInfo.dialogueProcessList.push(item);
              }
            }
            if (!this.validatenull(this.formData.dialogueProcessNodeIdCall)) {
              let dialogueType = this.dialogueOptions.find(
                  (item) => item.id === this.formData.dialogueTypeIdCall
                ).categoryName,
                dialogueSpeech = this.dialogueFlowOptions.find(
                  (item) => item.id === this.formData.dialogueSpeechIdCall
                ).speechName,
                dialogueProcessName = this.flowOptions.find(
                  (item) => item.id === this.formData.dialogueProcessIdCall
                ).processName,
                dialogueProcessNodeName = this.nodeOptions.find(
                  (item) => item.id === this.formData.dialogueProcessNodeIdCall
                ).nodeName;
              // speechType = this.dialogueFlowOptions.find(
              //   (item) => item.id === this.formData.dialogueSpeechIdCall
              // ).type;
              newInfo.dialogueProcessList.push({
                dialogueProcessId: this.formData.dialogueProcessIdCall,
                dialogueProcessNodeId: this.formData.dialogueProcessNodeIdCall,
                dialogueSpeechId: this.formData.dialogueSpeechIdCall,
                dialogueTypeId: this.formData.dialogueTypeIdCall,
                dialogueType,
                dialogueSpeech,
                dialogueProcessName,
                dialogueProcessNodeName,
                speechType: 2,
              });
              this.formData.callSelectValue = `${dialogueType}_${dialogueSpeech}_${dialogueProcessName}_${dialogueProcessNodeName}`;
            } else {
              const item = findNodeByVal(
                this.dialogueProcessList,
                "speechType",
                2
              );
              if (!this.validatenull(item)) {
                newInfo.dialogueProcessList.push(item);
              }
            }
            if (
              !this.validatenull(this.formData.dialogueProcessNodeIdCallAssist)
            ) {
              let dialogueType = this.dialogueOptions.find(
                  (item) => item.id === this.formData.dialogueTypeIdCallAssist
                ).categoryName,
                dialogueSpeech = this.dialogueFlowOptionsAssist.find(
                  (item) => item.id === this.formData.dialogueSpeechIdCallAssist
                ).speechName,
                dialogueProcessName = this.flowOptionsAssist.find(
                  (item) =>
                    item.id === this.formData.dialogueProcessIdCallAssist
                ).processName,
                dialogueProcessNodeName = this.nodeOptionsAssist.find(
                  (item) =>
                    item.id === this.formData.dialogueProcessNodeIdCallAssist
                ).nodeName;
              newInfo.dialogueProcessList.push({
                dialogueProcessId: this.formData.dialogueProcessIdCallAssist,
                dialogueProcessNodeId: this.formData.dialogueProcessNodeIdCall,
                dialogueSpeechId: this.formData.dialogueSpeechIdCall,
                dialogueTypeId: this.formData.dialogueTypeIdCall,
                dialogueType,
                dialogueSpeech,
                dialogueProcessName,
                dialogueProcessNodeName,
                speechType: 6,
              });
              this.formData.callSelectValueAssist = `${dialogueType}_${dialogueSpeech}_${dialogueProcessName}_${dialogueProcessNodeName}`;
            } else {
              const item = findNodeByVal(
                this.dialogueProcessList,
                "speechType",
                6
              );
              if (!this.validatenull(item)) {
                newInfo.dialogueProcessList.push(item);
              }
            }
          } else {
            newInfo.dialogueProcessList = deepClone(this.dialogueProcessList);
          }

          //常用问法
          if (this.methodsArr.length > 0) {
            this.methodsArr.forEach((item) => {
              item.questionType = 1;
              newInfo.similarList.push(item);
            });
          }
          //正则表达式
          if (this.regularArr.length > 0) {
            this.regularArr.forEach((item) => {
              item.questionType = 2;
              newInfo.similarList.push(item);
            });
          }
          //添加管理相关制度
          if (this.recommendList.faq.length > 0) {
            this.recommendList.faq.forEach((item) => {
              item.knowledgeId = item.id;
              item.content = item.question;
              item.knowledgeType = "1";
              newInfo.knowledgeList.push(item);
            });
          }
          if (this.recommendList.tab.length > 0) {
            this.recommendList.tab.forEach((item) => {
              item.knowledgeId = item.id;
              item.content = item.question;
              item.knowledgeType = "2";
              newInfo.tableQAKnowledgeList.push(item);
            });
          }
          // console.log(newInfo);
          //判断是否有相同的意图名称
          if (!this.isHaveSameNameFlag) {
            this.disable = true;
            saveOrUpdate(newInfo).then((result) => {
              if (result.data.code == 200) {
                this.$message({
                  type: "success",
                  message: this.$t("aicosCommon.saveSuccessTip"),
                });
                this.goBack();
                this.disable = false;
                this.$emit("saveAnt", newInfo);
              } else {
                this.disable = false;
              }
            });
          }
        }
      });
    },

    //取消
    handlerCancel() {
      this.expandFlag = false;
    },
    saveCommonMethod(data) {
      this.methodsArr = data.data;
      const hasEmpty = this.methodsArr.some((item) => {
        return item.intentQuestion == "";
      });
      if (hasEmpty) {
        return;
      } else {
        this.closeFlag = data.flag;
      }
    },
    saveRegular(data) {
      this.regularArr = data.data;
      const hasEmpty = this.regularArr.some((item) => {
        return item.intentQuestion == "";
      });
      if (hasEmpty) {
        return;
      } else {
        this.closeRegularFlag = data.flag;
      }
    },
    openSimilar() {
      this.systemDialogVisible = true;
    },
    saveSimilarExpand() {
      this.recommendList.faq =
        this.$refs.kwSimilarRef.$refs.similarContainerRef.saveSimilarQuesion();
      this.recommendList.tab =
        this.$refs.kwSimilarRef.$refs.similarTabcontainerRef.saveSimilarQuesion();
      this.systemDialogVisible = false;
    },
  },
};
</script>

<style lang="scss" scoped>
.el-link.el-link--primary {
  margin-right: 20px;
}

.btnContainer {
  /deep/ .el-form-item__content {
    margin-left: 0 !important;
    text-align: center;
  }
}
</style>
