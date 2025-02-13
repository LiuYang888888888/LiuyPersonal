<template>
  <div id="chartOuterContainer">
    <div class="aicc-chart-dialog-container" id="aiccChartDialogContainer">
      <div class="aicc-chart-dialog-wrap">
        <div class="aicc-chart-header clearfix" id="aiccSysHeader">
          <div class="aicc-company-info">
            <div>
              <!-- <img :src="robotIcon" alt="" /> -->
              <div class="selectTitle">{{ $t("kwRobotAnswer.robot") }}：</div>
              <!-- 机器人： -->
              <el-select
                class="selectRobot"
                v-model="form.selectRobot"
                :placeholder="
                  $t('aicosCommon.pleaseSelect') + $t('kwRobotAnswer.robot')
                "
                size="small"
                filterable
                @change="changeRobot"
              >
                <el-option
                  v-for="item in robotList"
                  :key="item.id"
                  :label="item.robotName"
                  :value="item.id"
                >
                </el-option>
              </el-select>
            </div>
            <div>
              <span class="selectTitle"
                >{{ $t("kwRobotAnswer.associatedParent") }}：</span
              >
              <el-switch v-model="form.flag" size="small"> </el-switch>
            </div>
            <div>
              <!-- <img :src="angleIcon" alt="" /> -->
              <span class="selectTitle"
                >{{ $t("kwRobotAnswer.angleOfView") }}：</span
              >
              <el-select
                class="selectRobot"
                v-model="form.channelAngle"
                :placeholder="
                  $t('aicosCommon.pleaseSelect') +
                    $t('kwRobotAnswer.channelPerspective')
                "
                size="small"
                @change="changeAngleValue"
              >
                <el-option
                  v-for="item in channelAngleData"
                  :key="item.code"
                  :label="item.name"
                  :value="item.code"
                >
                </el-option>
              </el-select>
              <div class="answer-perspective-item">
                <div class="perspect-list-container">
                  <!-- <el-button
                    size="mini"
                    type="primary"
                    class="choose-perspect-btn"
                    @click="choosePerspectDialog"
                    >
                    选择视角
                  </el-button> -->
                  <div class="perspect-list-wrap">
                    <ul class="perspect-list-ul" @click="choosePerspectDialog">
                      <li
                        class="perspect-item"
                        :key="perspectIndex"
                        v-for="(onlyPerspectvie, perspectIndex) in angleData"
                      >
                        <span
                          class="perspect-tag-text"
                          :title="
                            onlyPerspectvie.cateName +
                              '：' +
                              onlyPerspectvie.name
                          "
                          >{{ onlyPerspectvie.cateName }}：{{
                            onlyPerspectvie.name
                          }}</span
                        >
                        <i
                          class="perspect-tag-close el-icon-close"
                          @click.stop="
                            deletePersItem(onlyPerspectvie, perspectIndex)
                          "
                        ></i>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
            <!-- <div>
              <span>{{ $t("kwRobotAnswer.largeModel") }}：</span>
              <el-switch v-model="form.unknownShow" size="small"> </el-switch>
            </div> -->
          </div>
        </div>
        <div class="aicc-chart-dialog">
          <div class="aicc-chart-left-wrap" id="aiccSysChartContent">
            <div class="aicc-chart-outer-scroll">
              <div
                class="aicc-chart-scroll"
                id="aiccSysScroll"
                ref="mianscroll"
              >
                <p class="aicc-chart-history-wrap" id="aiccHistoryChartWrap">
                  <span
                    class="aicc-history-chart-icon aiccZw aicc-zw-lishi"
                  ></span>
                  <span
                    class="aicc-history-chart-text"
                    id="aiccHistoryChartButton"
                    >{{ $t("kwRobotAnswer.viewHistory") }}</span
                  >
                </p>
                <p class="aicc-welcome">
                  <span id="aiccSysWelcomeText">
                    {{ $t("kwRobotAnswer.welcomeConnect") }}
                    <span class="charting-name">{{ selectRobotName }}</span>
                    {{ $t("kwRobotAnswer.intelligentRobot") }}
                  </span>
                </p>
                <div class="aicc-chart-item">
                  <div class="aicc-robot-left">
                    <img
                      :src="kefuImg"
                      :dAvatarUrl="kefuImg"
                      class="aicc-avatar-img"
                      id="aiccSysRobotAvatar"
                    />
                    <div class="aicc-charting-container clearfix">
                      <div class="aicc-charting-wrap">
                        <!-- <p class="charting-message">
                          <span id="aiccSysRobotName" class="charting-name">{{
                            selectRobotName
                          }}</span>
                          <span class="charting-time" id="startTime"></span>
                        </p> -->
                        <div
                          class="charting-content-wrap"
                          id="aiccSysRobotWelcomeWrap"
                        >
                          <div class="charting-content">
                            <div
                              class="aicc-welcome-text"
                              id="aiccSysRobotWelcomeText"
                            >
                              <!-- {{ $t("kwRobotAnswer.iAm") }}
                              <span class="charting-name">{{
                                selectRobotName
                              }}</span
                              >{{ $t("kwRobotAnswer.serveYou") }} -->
                              {{ welcomeText }}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <Content
                  :message="messageData"
                  :key="messageData.length"
                  :selectRobotName="selectRobotName"
                  :selectRobotId="form.selectRobot"
                  @debug="debugInfo"
                  :form="form"
                  :customerAngles="customerAngles"
                  :knowledgeAngle="knowledgeAngle"
                />
              </div>
            </div>

            <!--热门主题-->
            <div
              class="fj-im-recommend-label-wrapper fj-no-button"
              id="aiccSysHotTheme"
            >
              <div class="left-btn">
                <span class="iconfont iconleft_8"></span>
              </div>
              <div class="right-btn">
                <span class="iconfont iconright_8"></span>
              </div>
              <!-- <div class="center-con">
                <ul class="fj-im-recommend-label" id="aiccTemplateHotUl">
                  <li rel="vmClickSendText" hotitem="hotItem">业务范围</li>
                  <li rel="vmClickSendText" hotitem="hotItem">业务范围</li>
                </ul>
              </div> -->
            </div>

            <div class="chat-bottom-box" id="chatBottomBox">
              <div class="chat-bottom-enter-wrap clearfix">
                <div class="associated-words-wrap">
                  <div class="ai-suggest-scroll" id="aiccSysAssociat">
                    <ul class="ai-suggest-list" id="aiccSysAssociatList"></ul>
                  </div>
                </div>
                <div class="chat-bottom-enterInput">
                  <!-- <ckeditor
                    ref="ckeditor"
                    v-model="editorData"
                    :type="type"
                    :read-only="disabled"
                    :editor-url="`${baseURL}cdn/ckeditor/ckeditor.js`"
                    :config="editorConfig"
                    @input="onEditorInput"
                    @keyup.enter.native="sendMessage"
                  >
                  </ckeditor> -->
                  <el-input
                    id="aicosSysMessage"
                    class="aicosSysMessage"
                    v-model="form.message"
                    style="width: 100%; height: 135px"
                    type="textarea"
                    :placeholder="$t('kwRobotAnswer.questionAsk')"
                    :rows="6"
                    maxlength="200"
                    @keyup.enter.native="sendMessage"
                  >
                  </el-input>
                </div>
              </div>
              <div class="send-button-wrap">
                <!--<span class="surplus-text" id="aiccSysSurplus">0/200</span>-->
                <el-button
                  type="button"
                  class="send-button"
                  id="aiccSysSendButton"
                  @click.native.prevent="sendMessage"
                >
                  {{ $t("kwRobotAnswer.send") }}
                </el-button>
              </div>
            </div>
          </div>

          <div class="aicc-chart-right-wrap" id="aiccSysAdvise">
            <!-- <div class="debugBtn">
              <el-button
                :class="activeIndex === 1 ? 'activeBtn' : ''"
                @click="activeIndex = 1"
                >基础调试</el-button
              >
              <el-button
                :class="activeIndex === 2 ? 'activeBtn' : ''"
                @click="activeIndex = 2"
                >高级调试</el-button
              >
            </div> -->
            <div class="activeContent">
              <div v-if="activeIndex === 1">
                <el-card>
                  <div slot="header" class="clearfix">
                    <span>{{ $t("kwRobotAnswer.matchingMethod") }}</span>
                  </div>
                  <div>
                    <div class="diamond"></div>
                    {{ $t("kwRobotAnswer.participleResult") }}：
                    <template v-if="basicsType.debugInfo.title">
                      <avue-text-ellipsis
                        :key="basicsType.debugInfo.title"
                        :text="basicsType.debugInfo.title"
                        :height="40"
                        width="70%"
                        use-tooltip
                        placement="top"
                      >
                        <template #more>
                          <small>...</small>
                        </template>
                      </avue-text-ellipsis>
                    </template>
                    <template v-else>--</template>

                  </div>
                  <div
                    v-if="
                      !basicsType.unknown &&
                        !validatenull(basicsType.debugInfo.knowledgeType) &&
                        (basicsType.debugInfo.knowledgeType === 'FAQ' ||
                          basicsType.debugInfo.knowledgeType === 'TABLE' ||
                          basicsType.debugInfo.knowledgeType === 'INTENT')
                    "
                  >
                    <div class="diamond"></div>
                    {{ $t("kwRobotAnswer.intentionRecognition") }}：
                    <template v-if="basicsType.debugInfo.intentName">
                      <avue-text-ellipsis
                        :key="basicsType.debugInfo.intentName"
                        :text="basicsType.debugInfo.intentName"
                        :height="40"
                        width="70%"
                        use-tooltip
                        placement="top"
                      >
                        <template #more>
                          <small>...</small>
                        </template>
                      </avue-text-ellipsis>
                  </template>
                  <template v-else>--</template>
                  </div>
                  <div>
                    <div class="diamond"></div>
                    {{ $t("kwRobotAnswer.policyName") }}：<span>{{
                      basicsType.debugInfo.strategyName ? basicsType.debugInfo.strategyName : "--"
                    }}</span>
                  </div>
                  <div>
                    <div class="diamond"></div>
                    {{ $t("kwRobotAnswer.answer") }}：<span>{{
                      basicsType.debugInfo.answerType ? basicsType.debugInfo.answerType : "--"
                    }}</span>
                  </div>
                  <div
                    v-if="
                      !basicsType.unknown &&
                        (basicsType.debugInfo.knowledgeType === 'FAQ' ||
                          basicsType.debugInfo.knowledgeType === 'TABLE')
                    "
                  >
                    <div class="diamond"></div>
                    {{ $t("kwRobotAnswer.matchingPerspective") }}：<span>{{
                      basicsType.debugInfo.matchAngle ? basicsType.debugInfo.matchAngle : "--"
                    }}</span>
                  </div>
                  <div
                    v-else-if="
                      !basicsType.unknown &&
                        basicsType.debugInfo.knowledgeType === 'FLOW'
                    "
                  >
                    <div class="diamond"></div>
                    {{ $t("kwRobotAnswer.nodePath") }}：
                    <template v-if="basicsType.debugInfo.flowPath">
                      <avue-text-ellipsis
                        :key="basicsType.debugInfo.flowPath"
                        :text="basicsType.debugInfo.flowPath"
                        :height="40"
                        width="70%"
                        use-tooltip
                        placement="top"
                        ><template #more>
                          <small>...</small>
                        </template></avue-text-ellipsis
                      >
                    </template>
                    <template v-else>--</template>
                  </div>
                  <div>
                    <div class="diamond"></div>
                    {{ $t("kwRobotAnswer.matchingScore") }}：<span>{{
                      basicsType.confidence ? basicsType.confidence: "--"
                    }}</span>
                  </div>
                  <div>
                    <div class="diamond"></div>
                    {{ $t("kwRobotAnswer.answerSource") }}：<span>{{
                      basicsType.unknown && basicsType.unknownShow
                        ? $t("kwRobotAnswer.largeModel")
                        : basicsType.debugInfo.knowledgeType === "FLOW"
                        ? $t("kwRobotAnswer.dialogueProcess")
                        : basicsType.debugInfo.knowledgeSource
                        ? basicsType.debugInfo.knowledgeSource
                        : "--"
                    }}</span>
                  </div>
                </el-card>
                <el-card>
                  <div slot="header" class="clearfix">
                    <span>{{ $t("kwRobotAnswer.knowledgeOptimization") }}</span>
                  </div>
                  <avue-crud
                    :data="basicsResult"
                    :option="resultOption"
                    class="sortCrud"
                  >
                    <template slot="nameHeader">
                      <div style="display: flex; align-items: center">
                        <div class="diamond"></div>
                        {{ $t("kwRobotAnswer.matchingKnowledge") }}
                      </div>
                    </template>
                    <template slot="typeHeader">
                      <div style="display: flex; align-items: center">
                        <div class="diamond"></div>
                        {{ $t("kwRobotAnswer.sessionModule") }}
                      </div>
                    </template>
                    <template slot="confidenceHeader">
                      <div style="display: flex; align-items: center">
                        <div class="diamond"></div>
                        {{ $t("kwRobotAnswer.matchingScore") }}
                      </div>
                    </template>
                    <template slot="name" slot-scope="{ row }">
                      <el-button
                        type="text"
                        size="small"
                        style="color: #fff"
                        @click.stop="rowClick(row)"
                        >{{ row.name }}</el-button
                      >
                    </template>
                  </avue-crud>
                </el-card>
              </div>
              <div v-if="activeIndex === 2">
                <!-- <el-card> -->
                <vue-json-editor
                  style="height: 520px"
                  v-model="responseData"
                  :showBtns="false"
                  :mode="'code'"
                  lang="zh"
                  :disabled="true"
                  @json-change="onJsonChange"
                  @json-save="onJsonSave"
                />
                <!-- </el-card> -->
              </div>
            </div>
          </div>
          <!-- <div
            v-else
            class="aicc-chart-right-wrap"
            id="aiccSysAdvise"
            style="text-align: center; padding-top: 200px; color: #fff"
          >
            暂无数据
          </div> -->
        </div>
      </div>
    </div>
    <HuilanDialog
      :title="$t('kwRobotAnswer.imageUpload')"
      append-to-body
      ref="dialog"
      :visible.sync="similarDialogVisible"
      width="600px"
    >
      <CustomUpload
        ref="custom"
        :isImage="true"
        @getCustomList="getCustomList"
        v-if="similarDialogVisible"
      />
      <template v-slot:footer>
        <el-button size="small" @click="similarDialogVisible = false">{{
          $t("aicosCommon.cancelBtn")
        }}</el-button>
        <el-button size="small" type="primary" @click="saveSimilar">{{
          $t("aicosCommon.saveBtn")
        }}</el-button>
      </template>
    </HuilanDialog>
    <!--选择答案视角-->
    <HuilanDialog
      :title="$t('kwRobotAnswer.choosePerspective')"
      :close-on-click-modal="isCloseOnClickModal"
      append-to-body
      :visible.sync="choosePerspectVisible"
      width="60%"
      custom-class="choose-perspective-dialog"
    >
      <el-tabs v-model="activeName" @tab-click="handleClick">
        <el-tab-pane
          :label="$t('kwRobotAnswer.customPerspective')"
          name="first"
        >
          <ChoosePerspect
            v-if="choosePerspectVisible"
            ref="choosePerspectRef"
            :choosedPerspects="choosedPerspectDatas"
          />
        </el-tab-pane>
        <el-tab-pane
          :label="$t('kwRobotAnswer.customerPerspective')"
          name="second"
        >
          <ChooseClient
            v-if="choosePerspectVisible"
            ref="chooseClientRef"
            :choosedPerspects="chooseClientDatas"
          />
        </el-tab-pane>
      </el-tabs>
      <template v-slot:footer>
        <el-button size="small" @click="choosePerspectVisible = false">{{
          $t("aicosCommon.cancelBtn")
        }}</el-button>
        <el-button
          size="small"
          type="primary"
          @click="saveChoosePerspectDialog"
          >{{ $t("aicosCommon.saveBtn") }}</el-button
        >
      </template>
    </HuilanDialog>
    <!-- 匹配结果编辑 -->
    <el-drawer
      :title="$t('kwRobotAnswer.resultEditing')"
      :visible.sync="abnormalDialogVisible"
      append-to-body
      :show-close="selectRow.type !== '文档知识'"
      @close="addOrEditEmitEvent"
      size="75%"
    >
      <template v-if="selectRow.type === 'FAQ知识' && abnormalDialogVisible">
        <!-- faq知识 -->
        <AddFaq
          nodeDeepPath="['0']"
          :curFaqObj="selectRow"
          :faqType="'edit'"
          @addOrEditEmitEvent="addOrEditEmitEvent"
        />
      </template>
      <!-- 闲聊知识 -->
      <template v-if="selectRow.type === '闲聊知识' && abnormalDialogVisible">
        <Addsmalltalk
          nodeDeepPath="['0']"
          :curFaqObj="selectRow"
          :faqType="'edit'"
          @addOrEditEmitEvent="addOrEditEmitEvent"
        />
      </template>
      <!-- 文档知识：知识标注 -->
      <template v-if="selectRow.type === '文档知识' && abnormalDialogVisible">
        <Filemark :rowData="selectRow" @close="addOrEditEmitEvent" />
      </template>
      <!-- 表格知识 -->
      <template v-if="selectRow.type === '表格知识' && abnormalDialogVisible">
        <AnswerSetting
          :rowData="selectRow"
          nodeDeepPath="['0']"
          @addOrEditEmitEvent="addOrEditEmitEvent"
        />
      </template>
      <!-- 意图 -->
      <template v-if="selectRow.type === '意图库' && abnormalDialogVisible">
        <Addintent
          style="padding: 20px"
          @back="addOrEditEmitEvent"
          :isEdit="true"
          :botId="botObj.id"
          :cur="selectRow"
        />
      </template>
    </el-drawer>
  </div>
</template>
<script>
import ChoosePerspect from "@/components/kwAddInMethod/choosePerspect";
import ChooseChannel from "@/components/kwAddInMethod/chooseChannel";
import ChooseClient from "@/components/kwAddInMethod/chooseClient";
import CKEditor from "ckeditor4-vue";
import CustomUpload from "@/views/kwKnowledgeCenter/kwKnowledgeMangement/kwFaqManagement/customUpload";
import AddFaq from "@/views/kwKnowledgeCenter/kwKnowledgeMangement/kwFaqManagement/addFaq";
import Addsmalltalk from "@/views/kwKnowledgeCenter/kwKnowledgeMangement/smalltalk/addFaq";
import Filemark from "@/views/kwKnowledgeCenter/kwKnowledgeMangement/documentknowledge/filemark";
import AnswerSetting from "@/views/kwKnowledgeCenter/kwKnowledgeMangement/kwTabManagement/answerSetting";
import Addintent from "@/views/kwKnowledgeCenter/kwIntentionManage/add";
import { getRobotList } from "@/api/kwRobot/kwRobotTrain/index";
// import { listData } from "@/api/kwRobot/kwRobotTrain/index";
import { setStore, getStore, removeStore } from "@/util/store";
import { deepClone } from "@/util/util";
import { getDictionary } from "@/api/system/dict";
import socket from "./common";
import { baseURL } from "@/api/common";
import { mapGetters } from "vuex";
import Content from "./content";
import serviceList from "@/config/serviceList";
import { detail } from "@/api/kwKnowledgeCenter/kwKnowledgeMangement/documentknowledge/index";
import "./template.scss";
const vueJsonEditor = () => import("vue-json-editor");
export default {
  components: {
    Content,
    ckeditor: CKEditor.component,
    CustomUpload,
    ChoosePerspect,
    ChooseChannel,
    ChooseClient,
    vueJsonEditor,
    AddFaq,
    Addsmalltalk,
    Filemark,
    AnswerSetting,
    Addintent
  },
  data() {
    return {
      // 答案视角
      activeName: "first",
      choosePerspectVisible: false, // 选择视角弹框
      angleData: [], // 选中的视角的数据
      choosedPerspectDatas: [], // 自定义视角
      chooseChannelDatas: [], // 渠道视角
      chooseClientDatas: [], // 客户视角
      curEditPerspectAnserIndex: 0, // 当前选择的视角的答案
      angleParam: {},
      customerAngles: [],
      knowledgeAngle: {},
      // 编辑器
      baseURL,
      editorData: "",
      content: "",
      editorConfig: {
        editorplaceholder: this.$t("kwRobotAnswer.questionAsk"),
        language: "zh-cn",
        // extraPlugins: "colorbutton,colordialog,accessory",
        accessoryHandle: this.show,
        removeButtons:
          "Source,Save,Templates,NewPage,ExportPdf,Preview,Print,Cut,Undo,Find,SelectAll,Scayt,Form,Copy,Redo,Replace,Paste,PasteText,PasteFromWord,About,Maximize,ShowBlocks,BGColor,TextColor,Styles,Format,Font,FontSize,Iframe,PageBreak,SpecialChar,BidiLtr,BidiRtl,Language,JustifyRight,JustifyBlock,JustifyCenter,JustifyLeft,Blockquote,Outdent,NumberedList,CopyFormatting,Bold,Italic,RemoveFormat,BulletedList,Indent,CreateDiv,Checkbox,Radio,Underline,Strike,TextField,Textarea,Subscript,Superscript,Select,Button,ImageButton,HiddenField,Link,Unlink,Image,Table,HorizontalRule,Anchor"
      },
      similarDialogVisible: false,
      //
      channelAngleData: [],
      activeIndex: 1,
      robotList: [],
      form: {
        selectRobot: "",
        channelAngle: "",
        flag: false,
        unknownShow: false
      },
      messageData: [],
      selectRobotName: "",
      kefuImg: require("@/assets/kwRobotAnswer/robotAvater.png"),
      kehuImg: require("@/assets/kwRobotAnswer/visitorAvater.png"),
      robotIcon: require("@/assets/kwRobotAnswer/robotIcon.png"),
      angleIcon: require("@/assets/kwRobotAnswer/angleIcon.png"),
      // 调试
      isShow: false,
      basicsType: {
        debugInfo: {}
      },
      basicsResult: [],
      resultOption: {
        menu: false,
        header: false,
        tip: false,
        border: false,
        emptyText: this.$t("aicosCommon.notData"),
        column: [
          {
            label: this.$t("kwRobotAnswer.matchingKnowledge"),
            prop: "name",
            minWidth: 220,
            overHidden: true
          },
          {
            label: this.$t("kwRobotAnswer.sessionModule"),
            prop: "type",
            // type: "select",
            // dicData: [],
            minWidth: 140,
            overHidden: true
          },
          {
            label: this.$t("kwRobotAnswer.matchingScore"),
            prop: "confidence",
            minWidth: 130,
            overHidden: true
          }
        ]
      },
      responseData: {},
      // 匹配结果编辑
      abnormalDialogVisible: false,
      selectRow: {},
      url: "",
      historyData: [],
      TPS: 0,
      messageCopy: "",
      welcomeText: ""
    };
  },

  computed: {
    // 计算属性
    ...mapGetters(["userInfo", "botObj"])
  },
  async mounted() {
    // const postData = {
    //   current: 1,
    //   size: 1000,
    //   botId: this.$store.getters.botObj.id,
    // };
    // listData(postData).then((res) => {
    //   const data = res.data.data.records;
    //   let type = this.findObject(this.resultOption.column, "type");
    //   type.dicData = data.map((v) => {
    //     if (v.isSystem === 0) {
    //       return {
    //         label: v.name,
    //         value: v.id,
    //       };
    //     } else {
    //       if (v.type === 2) {
    //         return {
    //           label: v.name,
    //           value: "table",
    //         };
    //       }
    //       if (v.type === 3) {
    //         return {
    //           label: v.name,
    //           value: "doc",
    //         };
    //       }
    //       if (v.type === 1) {
    //         return {
    //           label: v.name,
    //           value: "faq",
    //         };
    //       }
    //       if (v.type === 4) {
    //         return {
    //           label: v.name,
    //           value: "flow",
    //         };
    //       }
    //     }
    //   });
    //   type.dicData.push({
    //     label: "闲聊知识",
    //     value: "chat",
    //   });
    //   type.dicData.push({
    //     label: "意图",
    //     value: "topic",
    //   });
    //   type.dicData.push({
    //     label: "意图",
    //     value: "intent",
    //   });
    // });
    let robotId = getStore({
        name: "huilan-robotId",
        type: "session"
      }),
      channelAngle = getStore({
        name: "huilan-channelAngle",
        type: "session"
      }),
      robotAngleData = getStore({
        name: "huilan-robotAngleData",
        type: "session"
      }),
      _this = this,
      customerAngles = [],
      knowledgeAngle = {};

    await getRobotList(this.$store.state.user.currentTenantId, 1).then(res => {
      if (res.data.success) {
        this.robotList = res.data.data;
        if (!this.validatenull(robotId)) {
          this.form.selectRobot = robotId;
          this.selectRobotName = res.data.data.filter(
            item => item.id === robotId
          )[0].robotName;
          this.welcomeText = this.robotList.filter(
            item => item.id === robotId
          )[0].welcomeMessage;
        } else {
          if (!this.validatenull(res.data.data)) {
            this.form.selectRobot = this.robotList[0].id;
            this.selectRobotName = this.robotList[0].robotName;
            this.welcomeText = this.robotList[0].welcomeMessage;
          } else {
            this.$message.warning(this.$t("kwRobotAnswer.createRobotTip"));
          }
        }
      }
    });
    await getDictionary({ code: "angle_view_channel" }).then(res => {
      if (res.data.success) {
        this.channelAngleData = res.data.data;
        if (!this.validatenull(channelAngle)) {
          this.form.channelAngle = channelAngle;
        } else {
          this.form.channelAngle = this.channelAngleData[0].code;
        }
      }
    });
    if (!this.validatenull(robotAngleData)) {
      this.angleData = robotAngleData.angleData;
      // 自定义视角
      if (!this.validatenull(robotAngleData.choosedPerspectDatas)) {
        this.choosedPerspectDatas = robotAngleData.choosedPerspectDatas;
        let deepPath = deepClone(
          robotAngleData.choosedPerspectDatas[0].deepPath
        ).split(",");
        deepPath.shift();
        deepPath.push(robotAngleData.choosedPerspectDatas[0].id);
        knowledgeAngle = {
          categoryId: robotAngleData.choosedPerspectDatas[0].cateid,
          optionId: deepPath.join(",")
        };
      }
      if (!this.validatenull(robotAngleData.chooseClientDatas)) {
        this.chooseClientDatas = robotAngleData.chooseClientDatas;
        robotAngleData.chooseClientDatas.forEach(item => {
          // let deepPath = deepClone(item.deepPath).split(",");
          // deepPath.shift();
          // deepPath.push(item.id);
          customerAngles.push({
            categoryId: item.cateid,
            optionId: item.id
          });
        });
      }
    }
    this.customerAngles = customerAngles;
    this.knowledgeAngle = knowledgeAngle;
    this.angleParam = {
      channelAngle: _this.form.channelAngle,
      flag: this.form.flag,
      customerAngles,
      knowledgeAngle
    };
    // 初始化socket
    this.url = window.location.origin + "/user";
    socket.register(_this.url, {
      tenantId: _this.$store.state.user.currentTenantId,
      userId: _this.userInfo.id,
      debug: true
    });
    socket.socketEvent(_this.output);
  },
  beforeDestroy() {
    removeStore({
      name: "huilan-robotId",
      type: "session"
    });
    removeStore({
      name: "huilan-channelAngle",
      type: "session"
    });
    removeStore({
      name: "huilan-robotAngleData",
      type: "session"
    });
    // socket.socketReconnect()
  },
  methods: {
    // 调试
    debugInfo(data) {
      console.log(data);
      this.responseData = deepClone(data);
      if (!this.validatenull(data.debugInfo)) {
        if (data.debugInfo.knowledgeRanking.length > 5) {
          this.basicsResult = deepClone(
            data.debugInfo.knowledgeRanking.slice(0, 5)
          );
        } else {
          this.basicsResult = deepClone(data.debugInfo.knowledgeRanking);
        }
        data.debugInfo.title = "";
        if (!this.validatenull(data.debugInfo.participleResult)) {
          let arr = data.debugInfo.participleResult.split("》");
          data.debugInfo.title = arr[arr.length - 1];
        }
        this.basicsType = deepClone(data);
        this.basicsResult.forEach(item => {
          item.confidence = Math.floor(item.confidence * 100) / 100;
          // item.type = item.type.toLowerCase();
        });
      }
      this.isShow = true;
    },
    async rowClick(row) {
      if (row.type !== "对话流程") {
        this.selectRow = row;
        if (row.type === "文档知识") {
          await detail(row.id).then(res => {
            this.selectRow = { ...res.data.data, type: "文档知识" };
          });
        }
        this.abnormalDialogVisible = true;
      }
    },
    addOrEditEmitEvent() {
      this.abnormalDialogVisible = false;
    },
    onJsonChange(value) {
      console.log("value:", value);
    },
    onJsonSave(value) {
      console.log("value:", value);
    },
    // 打开视角
    choosePerspectDialog() {
      this.choosePerspectVisible = true;
      this.activeName = "first";
    },
    // 保存视角
    saveChoosePerspectDialog() {
      var perspects = [],
        customer = [];

      // 自定义视角
      perspects = this.$refs.choosePerspectRef.savePerspects();
      // 客户端视角
      customer = this.$refs.chooseClientRef.savePerspects();
      this.customerAngles = [];
      this.knowledgeAngle = {};
      this.angleData = [];
      console.log(perspects);
      if (perspects.length > 0) {
        perspects.forEach(item => {
          item.angleType = 2;
          item.angleId = item.id;
          this.angleData.push(item);
        });
        let deepPath = deepClone(perspects[0].deepPath).split(",");
        deepPath.shift();
        deepPath.push(perspects[0].id);
        this.knowledgeAngle = {
          categoryId: perspects[0].cateid,
          optionId: deepClone(deepPath).join(",")
        };
      }
      if (customer.length > 0) {
        customer.forEach(item => {
          item.angleType = 3;
          this.angleData.push(item);
          // console.log(item);
          // let deepPath = deepClone(item.deepPath).split(",");
          // deepPath.shift();
          // deepPath.push(item.id);
          this.customerAngles.push({
            categoryId: item.cateid,
            optionId: item.id
          });
        });
      }
      this.choosedPerspectDatas = perspects;
      this.chooseClientDatas = customer;
      this.choosePerspectVisible = false;
      setStore({
        name: "huilan-robotAngleData",
        content: {
          choosedPerspectDatas: this.choosedPerspectDatas,
          chooseClientDatas: this.chooseClientDatas,
          angleData: this.angleData
        },
        type: "session"
      });
      // socket.socketDisconnect();
      // this.angleParam = {
      //   channelAngle: this.form.channelAngle,
      //   flag: this.form.flag,
      //   customerAngles: this.customerAngles,
      //   knowledgeAngle: this.knowledgeAngle,
      // };
    },
    // 删除视角
    deletePersItem(onlyPerspectvie, index) {
      console.log(onlyPerspectvie);
      let type = onlyPerspectvie.angleType,
        id = onlyPerspectvie.angleId;
      this.customerAngles = [];
      this.knowledgeAngle = {};
      this.angleData.splice(index, 1);
      // 删除自定义视角
      if (type === 2) {
        this.choosedPerspectDatas.every((item, index) => {
          if (item.angleId == id) {
            this.choosedPerspectDatas.splice(index, 1);
            return false;
          } else {
            return true;
          }
        });
      }
      // 删除客户视角
      if (type === 3) {
        this.chooseClientDatas.every((item, index) => {
          if (item.angleId == id) {
            this.chooseClientDatas.splice(index, 1);
            return false;
          } else {
            return true;
          }
        });
      }
      if (this.choosedPerspectDatas.length > 0) {
        let deepPath = deepClone(this.choosedPerspectDatas[0].deepPath).split(
          ","
        );
        deepPath.shift();
        deepPath.push(this.choosedPerspectDatas[0].id);
        this.knowledgeAngle = {
          categoryId: this.choosedPerspectDatas[0].cateid,
          optionId: deepPath.join(",")
        };
      }
      if (this.chooseClientDatas.length > 0) {
        this.chooseClientDatas.forEach(item => {
          this.customerAngles.push({
            categoryId: item.cateid,
            optionId: item.id
          });
        });
      }
      setStore({
        name: "huilan-robotAngleData",
        content: {
          choosedPerspectDatas: this.choosedPerspectDatas,
          chooseClientDatas: this.chooseClientDatas,
          angleData: this.angleData
        },
        type: "session"
      });
      // socket.socketDisconnect();
    },
    // 打开上传图片组件
    show(editor) {
      this.similarDialogVisible = true;
      this.editor = editor;
      this.activeName = "first";
    },
    async saveSimilar() {
      this.$refs.custom.saveImport();
      const flag = this.$refs.custom.flag;
      if (flag === 0) {
        this.$message.warning(this.$t("kwRobotAnswer.pleaseUpload"));
        return;
      }
    },
    getCustomList(data) {
      // 判断附件是否上传成功
      const fileName = data.fileName;
      if (fileName) {
        const suffix = fileName
          .substring(fileName.lastIndexOf(".") + 1)
          .toLowerCase();
        // const fileSuffix = [
        //   "txt",
        //   "doc",
        //   "docx",
        //   "xls",
        //   "xlsx",
        //   "pdf",
        //   "rar",
        //   "zip",
        //   "mp4",
        //   "mav",
        //   "mp3",
        // ];
        const imgSuffix = ["jpg", "png", "jpeg"];

        let fileBase = `${baseURL}api/${serviceList.file}/miniofile/download`;

        if (`${baseURL}` == "/aicc/") {
          fileBase = `/${serviceList.file}/miniofile/download`;
        }

        // if (fileSuffix.includes(suffix)) {

        //   this.editor.insertHtml(`<a target="_blank"  href=${fileBase}${data.url}>${fileName}</a>`);
        // } else
        if (imgSuffix.includes(suffix)) {
          this.editor.insertHtml(`<img src=${fileBase}${data.url} alt='' />`);
        }
        this.similarDialogVisible = false;
      } else {
        this.$message.error(this.$t("kwRobotAnswer.uploadFailed"));
      }
    },
    // 切换机器人
    changeRobot(val) {
      this.selectRobotName = this.robotList.filter(
        item => item.id === val
      )[0].robotName;
      this.welcomeText = this.robotList.filter(
        item => item.id === val
      )[0].welcomeMessage;
      setStore({
        name: "huilan-robotId",
        content: val,
        type: "session"
      });
      this.messageData = [];
    },
    // 切换渠道视角
    changeAngleValue() {
      setStore({
        name: "huilan-channelAngle",
        content: this.form.channelAngle,
        type: "session"
      });
    },
    output(data) {
      let item = "",
        _this = this;
      if (data.calltype === "out") {
        item = deepClone(JSON.parse(data.message));
        item.show = false;
        // let flag = false;
        // 是否为大模型
        if (item.response.unknown) {
          if (this.form.unknownShow) {
            let id = new Date().getTime();
            item.response.unknownShow = true;
            this.send_raw(
              _this.messageCopy,
              _this.messageCopy,
              _this.historyData,
              async message => {
                item.response.str = message;
                let flag = _this.messageData.findIndex(item => item.id === id);
                if (flag === -1) {
                  _this.messageData.push(
                    deepClone({
                      id,
                      ...item
                    })
                  );
                } else {
                  this.$set(
                    _this.messageData,
                    flag,
                    deepClone({
                      id,
                      ...item
                    })
                  );
                }
                this.bottomScrollClick();
              }
            );
          } else {
            item.response.str =
              item.response.responses[1].multiModalTracks[0].text;
            item.response.unknownShow = false;
            this.messageData.push({
              id: new Date().getTime(),
              ...item
            });
          }
        } else {
          item.faqShow = false;
          item.faqAnswerShow = false;
          item.tableShow = false;
          item.faqRecommendQuestions = [];
          item.tableRecommendQuestions = [];
          if (
            item.selectorName === "topic" &&
            item.response.isRelatedKnowledge
          ) {
            item.response.recommendQuestions.map(a => {
              if (a.type === "FAQ") {
                item.faqRecommendQuestions.push(a);
              }
              if (a.type === "TABLE") {
                item.tableRecommendQuestions.push(a);
              }
            });
          }
          item.response.unknownShow = false;

          if (item.selectorName == "AiSearch") {
            if (
              this.type(item.response.responses[1].multiModalTracks[0].text)
            ) {
              item.response.responses[1].multiModalTracks[0].text = JSON.parse(
                item.response.responses[1].multiModalTracks[0].text
              );
            }
          }
          this.messageData.push({
            id: new Date().getTime(),
            ...item
          });
          if (
            this.historyData.length < 10 &&
            (item.selectorName === "faq" || item.selectorName === "doc")
          ) {
            this.historyData.push({ role: "user", content: this.form.message });
            this.historyData.push({
              role: "AI",
              content: item.response.responses[1].multiModalTracks[0].text
            });
          }
        }
        console.log(item);
        this.debugInfo(item.response);
      }
      if (data.calltype === "in") {
        let message = deepClone(data);
        let arr = message.message.split("》");
        message.message = arr[arr.length - 1];
        // if (
        //   !this.validatenull(this.messageData) &&
        //   this.messageData[this.messageData.length - 1].selectorName ===
        //     "topic" &&
        //   !this.validatenull(
        //     this.messageData[this.messageData.length - 1].response.followTags
        //   )
        // ) {
        //   let obj =
        //     this.messageData[this.messageData.length - 1].response.followTags;
        //   obj.forEach((val) => {
        //     if (val.displayTag === data.message) {
        //       message.message = val.followIntentName;
        //     }
        //   });
        // }
        console.log(message);
        this.messageData.push({ id: new Date().getTime(), ...message });
      }
      this.bottomScrollClick();
    },
    // 判断json
    type(str) {
      if (typeof str == "string") {
        try {
          var obj = JSON.parse(str);
          if (typeof obj == "object" && obj) {
            return true;
          } else {
            return false;
          }
        } catch (e) {
          return false;
        }
      }
      return false;
    },

    // 大模型输出
    modelOutput(data) {
      // console.log('大模型输出', data);
      let item = [];
      item.push(data);
      return item;
    },
    bottomScrollClick() {
      this.$nextTick(() => {
        let scrollEl = this.$refs.mianscroll;
        scrollEl.scrollTo({ top: scrollEl.scrollHeight, behavior: "smooth" });
      });
    },
    socketEvent(message) {
      console.log(this.knowledgeAngle);
      socket.sendSocketEvent(
        { message },
        {
          tenantId: this.$store.state.user.currentTenantId,
          userId: this.userInfo.id,
          robotId: this.form.selectRobot,
          angleParam: {
            channelAngle: this.form.channelAngle,
            flag: this.form.flag,
            customerAngles: this.customerAngles,
            knowledgeAngle: this.knowledgeAngle
          },
          debug: true
        }
      );
    },
    onEditorInput(val) {
      this.form.message = val;
      // console.log(this.$refs.ckeditor);
    },
    sendMessage() {
      if (
        this.validatenull(this.form.message) ||
        this.validatenull(this.form.message.replace(/\s*/g, ""))
      ) {
        this.$message.error(this.$t("kwRobotAnswer.questionAsk"));
        return;
      }
      this.socketEvent(this.form.message);
      this.messageCopy = deepClone(this.form.message);
      this.$nextTick(() => {
        this.form.message = "";
        this.editorData = "";
      });
    },
    async send_raw(prompt, keyword, history, onmessage = alert) {
      let configurationParams = getStore({ name: "frontParam" }),
        ws = undefined,
        protocol = window.location.protocol,
        llm_server = configurationParams.modelSocketUrl,
        global_onmessage = undefined,
        result = "",
        wsurl =
          protocol === "http:"
            ? "ws://" + llm_server + "/ws_nao"
            : "wss://" + llm_server + "/ws_nao";
      await new Promise(resolve => {
        ws = new WebSocket(wsurl);
        ws.onmessage = function(event) {
          result = event.data;
          onmessage(result);
          global_onmessage && global_onmessage(result);
        };
        ws.onopen = function() {
          ws.send(
            JSON.stringify({
              prompt: prompt,
              keyword: keyword,
              temperature: 0.9,
              top_p: 0.7,
              max_length: 4096,
              history
            })
          );
        };
        ws.onclose = function() {
          resolve();
        };
      });
      return result;
    }
  }
};
</script>
<style lang="scss" scoped>
.answer-perspective-item {
  position: relative;
  margin-left: 5px;

  .perspect-list-container {
    position: relative;

    .choose-perspect-btn {
      position: absolute;
      right: 0;
      top: 3px;
    }
  }

  .perspect-list-wrap {
    background-color: #fff;
    background-image: none;
    border-radius: 4px;
    border: 1px solid #dcdfe6;
    box-sizing: border-box;
    color: #606266;
    /* height: 32px;*/
    padding-right: 10px;
    width: 350px;

    .perspect-list-ul {
      padding: 0;
      margin: 0;
      display: flex;
      align-items: center;
      list-style: none;
      line-height: 32px;
      min-height: 32px;

      .perspect-item {
        display: inline-block;
        vertical-align: top;
        background-color: #f4f4f5;
        color: #909399;
        margin: 3px 0 2px 6px;
        max-width: 100%;
        align-items: center;
        height: 24px;
        padding: 0 8px;
        line-height: 22px;
        border: 1px solid #e9e9eb;
        border-radius: 4px;
        white-space: nowrap;
        font-size: 12px;

        .perspect-tag-text {
          overflow: hidden;
          text-overflow: ellipsis;
          color: #909399;
          line-height: 22px;
          font-size: 12px;
          white-space: nowrap;
          max-width: 130px;
          display: inline-block;
        }

        .perspect-tag-close {
          color: #909399;
          background-color: #c0c4cc;
          border-radius: 50%;
          text-align: center;
          cursor: pointer;
          font-size: 12px;
          height: 16px;
          width: 16px;
          line-height: 16px;
          transform: scale(0.8);
          display: inline-block;
          vertical-align: top;
          margin-top: 3px;
        }
      }

      .perspect-tip {
        color: #c0c4cc;
        font-size: 13px;
        padding-left: 15px;
      }
    }
  }

  .delete-answer-btn {
    position: absolute;
    right: -24px;
    top: 0;
  }
}
</style>
