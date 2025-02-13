<template>
  <el-row gutter="4">
    <el-col span="4" class="leftMenu">
      <div :style="tabclenHei">
        <el-scrollbar>
          <basic-container>
            <el-menu class="el-menu-vertical-demo" background-color="#ffffff" @open="handleOpen" @close="handleClose"
              @select="menuSelect" :default-active="menuId">
              <el-submenu index="1">
                <template slot="title">
                  <!-- <i class="el-icon-microphone"></i> -->
                  <span>AI能力</span>
                </template>
                <template v-for="(v, i) of menuList">
                  <el-tooltip v-if="v.name.length > commonVariable.labelLength" class="item" :key="i" effect="dark"
                    :content="v.name" placement="right">
                    <el-menu-item style="
                        overflow: hidden;
                        white-space: nowrap;
                        text-overflow: ellipsis;
                      " :index="v.id">{{ v.name }}</el-menu-item>
                  </el-tooltip>
                  <template v-else>
                    <el-menu-item :key="i" style="
                        overflow: hidden;
                        white-space: nowrap;
                        text-overflow: ellipsis;
                      " :index="v.id">{{ v.name }}</el-menu-item>
                  </template>
                </template>
              </el-submenu>
            </el-menu>
          </basic-container>
        </el-scrollbar>
      </div>
    </el-col>
    <el-col :span="20">
      <div class="grid-content-top">
        <basic-container class="basic-container">
          <div>
            <span class="tit">{{ conParms.name }}</span>
            <el-button size="small" type="" class="btnRi" @click="closedFirst">关闭</el-button>
            <el-button size="small" type="primary" class="btnRi doc" @click="inter">接口说明</el-button>
          </div>
          <div class="txt">
            {{ conParms.text }}
          </div>
        </basic-container>
      </div>
      <div :style="tabclenHeiRi">
        <el-scrollbar>
          <div class="grid-content-cen">
            <basic-container>
              <el-row>
                <el-col :span="24">
                  <div>
                    <span class="tit">能力体验</span>
                    <el-row v-if="flags.tagSenSim">
                      <el-col span="12">
                        <DynamicTab :addBtn="tagSenSim.addBtn" :editBtn="tagSenSim.editBtn"
                          :requstData="tagSenSim.requstData" :column="tagSenSim.option.column"
                          :title="tagSenSim.option.title" @chilReData="chilReData"></DynamicTab>
                      </el-col>
                    </el-row>
                    <el-row v-if="flags.miningQA">
                      <el-col span="12">
                        <DynamicTab :addBtn="miningQA.option.addBtn" :editBtn="miningQA.option.editBtn"
                          :requstData="miningQA.option.requstData" :column="miningQA.option.column"
                          :title="miningQA.option.title" @chilReData="chilReData"></DynamicTab>
                      </el-col>
                    </el-row>
                    <el-row gutter="20">
                      <el-col span="6" v-if="flags.maxPerSentence">
                        <div class="tit-top">
                          {{ labelTals.maxPerSentence }}：
                        </div>
                        <el-input-number style="width: 100%" v-model="form.maxPerSentence" size="mini">
                        </el-input-number>
                      </el-col>
                      <el-col span="6" v-if="flags.topN">
                        <div class="tit-top">{{ labelTals.topN }}：</div>
                        <el-input-number style="width: 100%" v-model="form.topN" size="mini">
                        </el-input-number>
                      </el-col>
                      <el-col span="6" v-if="flags.pitch">
                        <div class="tit-top">{{ labelTals.pitch }}：</div>
                        <el-input-number style="width: 100%" v-model="form.pitch" size="mini">
                        </el-input-number>
                      </el-col>
                      <el-col span="24">
                        <el-row>
                          <el-col span="6" v-if="flags.enableTenantWords">
                            <el-switch v-model="form.enableTenantWords" active-color="#13ce66" size="mini"
                              :inactive-text="labelTals.enableTenantWords">
                            </el-switch>
                          </el-col>
                          <el-col span="6" v-if="flags.enableSystemWords">
                            <el-switch v-model="form.enableSystemWords" active-color="#13ce66" size="mini"
                              :inactive-text="labelTals.enableSystemWords"></el-switch>
                          </el-col>
                        </el-row>
                      </el-col>
                      <el-col span="12" v-if="flags.sentences">
                        <div class="tit-top">{{ labelTals.text }}：</div>
                        <el-input type="textarea" maxlength="150" show-word-limit autosize placeholder="请输入内容"
                          v-model="form.text">
                        </el-input>
                      </el-col>
                      <el-col span="12" v-if="flags.id">
                        <div class="tit-top">{{ labelTals.id }}：</div>
                        <el-input :disabled="labelTals.id === '音频格式'" type="textarea" autosize placeholder="请输入内容"
                          v-model="form.id">
                        </el-input>
                      </el-col>
                      <el-col span="12" v-if="flags.ph">
                        <div class="tit-top">{{ labelTals.ph }}：</div>
                        <el-input type="textarea" autosize placeholder="请输入内容" v-model="form.ph">
                        </el-input>
                      </el-col>
                      <el-col span="12" v-if="flags.roleType">
                        <div class="tit-top">{{ labelTals.roleType }}：</div>
                        <el-input type="textarea" autosize placeholder="请输入内容" v-model="form.roleType">
                        </el-input>
                      </el-col>
                      <el-col span="12" v-if="flags.ttsText">
                        <div class="tit-top">{{ labelTals.ttsText }}：</div>
                        <el-input type="textarea" maxlength="50" show-word-limit autosize placeholder="请输入内容"
                          v-model="form.ttsText">
                        </el-input>
                      </el-col>
                      <el-col span="12" v-if="flags.targetSentenceList">
                        <div class="tit-top">
                          {{ labelTals.targetSentenceList }}：
                        </div>
                        <avue-array v-model="form.targetSentenceList" placeholder="请输入内容" size="mini"></avue-array>
                      </el-col>
                      <template v-if="flags.targetHashList">
                        <el-col span="12">
                          <div class="tit-top">{{ labelTals.targetHashList }}</div>
                          <avue-array v-model="form.targetHashList[0]" placeholder="请输入内容" size="mini"></avue-array>
                        </el-col>
                        <el-col span="12" v-if="form.targetHashList[1]">
                          <div class="tit-top">{{ labelTals.targetHashList }}2</div>
                          <avue-array v-model="form.targetHashList[1]" placeholder="请输入内容" size="mini"></avue-array>
                        </el-col>
                        <el-col span="12" v-if="form.targetHashList[2]">
                          <div class="tit-top">{{ labelTals.targetHashList }}3</div>
                          <avue-array v-model="form.targetHashList[2]" placeholder="请输入内容" size="mini"></avue-array>
                        </el-col>
                      </template>
                      <el-col span="12" v-if="flags.id_card_side">
                        <div class="tit-top">
                          {{ labelTals.id_card_side }}：
                        </div>
                        <template>
                          <el-radio v-model="form.id_card_side" label="front">身份证含照片的一面</el-radio>
                          <el-radio v-model="form.id_card_side" label="back">身份证带国徽的一面</el-radio>
                        </template>
                      </el-col>
                      <el-col span="6" v-if="flags.ttsSn">
                        <div class="tit-top">{{ labelTals.ttsSn }}：</div>
                        <template>
                          <el-radio v-model="form.ttsSn" :label="elRadio.elRadioVal.ttsSn">{{
                            elRadio.elRadioLab.ttsSn
                          }}</el-radio>
                          <el-radio v-model="form.ttsSn" :label="elRadio.elRadioVal.ttsSn2">{{
                            elRadio.elRadioLab.ttsSn2
                          }}</el-radio>
                        </template>
                      </el-col>
                      <el-col span="6" v-if="flags.ttsPh">
                        <div class="tit-top">{{ labelTals.ttsPh }}：</div>
                        <template>
                          <el-radio v-model="form.ttsPh" :label="elRadio.elRadioVal.ttsPh"
                            disabled="elRadio.elRadioVal.ttsPh==='文本'">{{ elRadio.elRadioLab.ttsPh }}</el-radio>
                          <el-radio v-model="form.ttsPh" :label="elRadio.elRadioVal.ttsPh2"
                            disabled="elRadio.elRadioVal.ttsPh2==='音素序列'">{{ elRadio.elRadioLab.ttsPh2 }}</el-radio>
                        </template>
                      </el-col>
                      <el-col span="6" v-if="flags.ttsDu">
                        <div class="tit-top">{{ labelTals.ttsDu }}：</div>
                        <template>
                          <el-radio v-model="form.ttsDu" :label="elRadio.elRadioVal.ttsDu"
                            disabled="elRadio.elRadioVal.ttsDu==='不计算'">{{ elRadio.elRadioLab.ttsDu }}</el-radio>
                          <el-radio v-model="form.ttsDu" :label="elRadio.elRadioVal.ttsDu2"
                            disabled="elRadio.elRadioVal.ttsDu2==='计算'">{{ elRadio.elRadioLab.ttsDu2 }}</el-radio>
                        </template>
                      </el-col>
                      <el-col span="12" v-if="flags.vueJson">
                        <div class="tit-top">{{ labelTals.vueJson }}：</div>
                        <vue-json-editor v-model="form.vueJson" :showBtns="false" :mode="'text'" lang="zh" />
                      </el-col>

                    </el-row>
                    <el-row>
                      <el-col span="24">
                        <VueChat ref="vueChat" v-if="textSentence" />
                      </el-col>
                    </el-row>
                  </div>
                  <div class="audio" style="margin-top: 20px" v-if="upload">
                    <el-upload ref="upload" class="upload-demo" drag :accept="uploadDown.accept" :action="action"
                      multiple="false" :on-success="handleAvatarSuccess" :before-upload="beforeAvatarUpload"
                      :data="requstUpload" :http-request="httpRequest" :limit="1">
                      <i class="el-icon-upload" style="font-size: 26px; margin: 0; margin-top: -4px"></i>
                      <div class="el-upload__text">
                        <em>点击上传</em>
                      </div>
                      <div class="el-upload__tip" slot="tip">
                        {{ uploadDown.title }}
                      </div>
                    </el-upload>
                  </div>
                  <div class="audio" style="margin-top: 20px" v-if="uploadFile">
                    <el-upload ref="uploadFile" class="upload-demo" drag :action="action"
                      :accept="uploadDown.actionAccept" multiple="false" :on-success="handleAvatarSuccess"
                      :before-upload="beforeAvatarUpload" :data="requstUpload" :limit="1">
                      <i class="el-icon-upload" style="font-size: 26px; margin: 0; margin-top: -4px"></i>
                      <div class="el-upload__text">
                        <em>点击上传</em>
                      </div>
                      <div class="el-upload__tip" slot="tip">
                        {{ uploadDown.title }}
                      </div>
                    </el-upload>
                  </div>
                  <div class="btn">
                    <el-button size="small" type="primary" class="btnRi-bei" :disabled="disabled" @click="analysisFun">
                      开始执行</el-button>
                  </div>
                  <hr class="hr" />
                  <div class="tag">
                    <div class="txts">分析结果</div>
                    <div>
                      <img width="200px;" style="margin-right:20px" v-for="(d, index) of imgDatas" :key="index"
                        :src="d.thumbUrl" @click="openPreview(index)" />
                    </div>
                    <div>
                      <el-tag class="el-tags" v-for="(v, i) of txtsList" :key="i">{{ v }}</el-tag>
                    </div>
                    <div v-for="(v, i) of txtsListLinge" :key="i">
                      <el-tag class="el-tags" v-for="t of v" :key="t">{{ t }}</el-tag>
                    </div>
                    <div v-for="item of txtsListAbout" :key="item">
                      <template v-if="item.sentence && item.score">
                        <el-tag class="el-tags">{{ item.sentence }}</el-tag>
                        <el-tag class="el-tags">{{ item.score }}</el-tag>
                      </template>
                    </div>
                    <div v-if="vueJsonRsoult">
                      <vue-json-editor v-model="vueJsonRsoult" :showBtns="false" :mode="'text'" lang="zh" />
                    </div>
                  </div>
                  <div class="audio" v-if="ttsWithHuilanFlag">
                    <audio id="audio" controls="controls" autoplay :src="audioSrc" />
                  </div>
                  <div class="analysisBtn" v-if="analysis">
                    <el-button size="small" type="primary" @click="analysiSsoundFun">录音文件识别</el-button>
                  </div>
                  <hr class="hr" v-if="txtsListAnalysisFlag" />
                  <div class="tag" v-if="txtsListAnalysisFlag">
                    <div class="txts">录音文件分析结果</div>
                    <div>
                      <el-tag class="el-tags" v-for="(v, i) of txtsListAnalysis" :key="i">{{ v }}</el-tag>
                    </div>
                  </div>
                </el-col>
              </el-row>
            </basic-container>
          </div>
          <div class="grid-content-botto">
            <basic-container>
              <div class="title">使用场景</div>
              <template>
                <el-tabs v-model="editableTabsValue" @tab-click="handleClick">
                  <el-tab-pane :key="item.name" v-for="item in editableTabs" :label="item.title" :name="item.name">
                    <el-row gutter="32">
                      <el-col span="9">
                        {{ item.content }}
                      </el-col>
                      <el-col span="15" v-if="editableTabsUrl">
                        <img style="width: 230px; height: 130px" :src="editableTabsUrl" />
                      </el-col>
                    </el-row>
                  </el-tab-pane>
                </el-tabs>
              </template>
            </basic-container>
          </div>
        </el-scrollbar>
      </div>
    </el-col>
  </el-row>
</template>
<script>
import { extractKeywordsFromTxt } from "@/api/configure/aiAbility";
import {
  getAllAiAbilityList,
  getHuilanAiApplicationAbilityRelationByApplicationId,
} from "@/api/configure/application";
import aiInterfaceParama from "@/util/aiInterfaceParama";
//import aiInterfaceParamaInit from "@/util/aiInterfaceParama";
import serviceList from "@/config/serviceList";
const { ai } = serviceList;
import commonVariable from "@/util/commonVariable";
import DynamicTab from "@/components/plugCrud/dynamicTab.vue";
import VueChat from "./vueChat.vue";
const tabclenHei = document.body.clientHeight - 127;
const tabclenHeiRi = document.body.clientHeight - 245;
import { getRules } from "@/util/regx";
// import vueJsonEditor from "vue-json-editor";
const vueJsonEditor = () => import('vue-json-editor');
export default {
  name: "paramItemList",
  components: {
    DynamicTab,
    vueJsonEditor,
    VueChat,
  },
  props: {
    rowData: {
      type: Object,
    },
  },
  data() {
    return {
      selectCallbackKey: '',
      imgDatas: [],
      loverCase: ['一', '二', '三', '四', '五', '六', '七', '八', '九', '十'],
      avueChatParams: {
        RequestBody: {},
        abilityCode: '',
      },
      wichFlagAbility: {
        voice: true,
        nlp: true,
        machine: true,
        image: true,
        emotion: true,
      },
      vueJsonRsoult: null,
      editableTabsUrl: null,
      uploadDown: {
        actionAccept: null,
        accept: null,
        title: null,
      },
      tabclenHei: `height:${tabclenHei}px`,
      tabclenHeiRi: `height:${tabclenHeiRi}px`,
      commonVariable,
      abilityCode: null,
      menuId: null,
      menuList: [],
      txtsList: [],
      txtsListLinge: [],
      txtsListAbout: [],
      txtsListAnalysis: [],
      ttsWithHuilanFlag: false,
      disabled: false,
      uploadFile: false,
      analysis: false,
      textSentence: false,
      requstUpload: null, //上传文件参数
      taskId: null, //录音文件识别（阿里云本地）第二个接口传入的id
      txtsListAnalysisFlag: false, //录音文件识别（阿里云本地）第二个接口显示分析结果
      labelTals: {
        text: "分词文本内容",
        maxPerSentence: "高要求新词的凝聚度阈值,必须大于等于50,默认500",
        topN: "高要求新词的自由度阈值,必须大于等于2.54,默认2.54",
        id: "id",
        roleType: "roleType",
        enableTenantWords: "",
        targetSentenceList: "短文本相似句子",
        targetHashList: "targetHashList",
        pitch: "",
        ph: "",
        ttsText: "",
        id_card_side: "",
        ttsSn: "",
        ttsPh: "",
        ttsDu: "",
      },
      flags: {
        sentences: false,
        maxPerSentence: false,
        topN: false,
        enableTenantWords: false,
        enableSystemWords: false,
        id: false,
        roleType: false,
        targetSentenceList: false,
        targetHashList: false,
        pitch: false,
        ph: false,
        ttsText: false,
        id_card_side: false,
        ttsSn: false,
        ttsPh: false,
        ttsDu: false,
        tagSenSim: false,
        vueJson: false,
        miningQA: false,
      },
      conParms: {
        id: null,
        name: "",
        testUrl: null,
        text: "",
        tit: "",
      },
      form: {
        maxPerSentence: '',
        text: '',
        topN: '',
        sentences: '',
        enableTenantWords: true,
        enableSystemWords: true,
        id: '',
        roleType: '',
        tenantId: "000000",
        targetSentenceList: [],
        targetHashList: [[], [], []],
        pitch: null,
        ph: null,
        ttsText: null,
        id_card_side: "front",
        ttsSn: null,
        ttsPh: null,
        ttsDu: null,
        vueJson: null,
      },
      elRadio: {
        elRadioLab: {
          ttsSn: "标准男生",
          ttsSn2: "标准女生",
          ttsPh: "文本",
          ttsPh2: "音素序列",
          ttsDu: "不计算",
          ttsDu2: "计算",
        },
        elRadioVal: {
          ttsSn: "sn1",
          ttsSn2: "sn0",
          ttsPh: "0",
          ttsPh2: "1",
          ttsDu: "0",
          ttsDu2: "1",
        },
      },

      filterFlagList: [
        {
          value: "nva",
          label: "名词/动词/形容词",
        },
        {
          value: "nv",
          label: "名词/动词",
        },
        {
          value: "n",
          label: "名词",
        },
      ],
      editableTabsValue: "1",
      editableTabs: [
        {
          title: "语言指令解析",
          name: "1",
          content:
            "以分词词性标注为基础，分析语音命令中的关键名称、动词、数量、时间等，准确理解命令的含义，提高用户体验",
        },
        {
          title: "法律术语",
          name: "2",
          content: "",
        },
        {
          title: "舆情信息提取",
          name: "3",
          content: "",
        },
      ],
      tagSenSim: {
        //标签与短文本相似度计算请求值特殊处理
        params: {},
        option: {
          addBtn: true,
          editBtn: true,
          delBtn: true,
          title: "标签词及其权重",
          requstData: [],
          column: [
            {
              label: "标签",
              prop: "tag",
              span: 24,
              type: "input",
              rules: [
                {
                  required: true,
                  message: "请输入标签",
                  trigger: "blur",
                },
                {
                  min: 1,
                  max: 100,
                  message: "长度在 1 到 100 个字符",
                  trigger: "blur",
                },
                ...getRules(["charNumHanEnterCommaStop"]),
              ],
            },
            {
              label: "权重",
              prop: "words",
              span: 24,
              type: "number",
              props: {
                step: 0.1,
              },
              rules: [
                {
                  required: true,
                  message: "请输入权重",
                  trigger: "blur",
                },
                ...getRules(["zeroToOneDecimal"]),
              ],
            },
          ],
        },
      },
      miningQA: {
        params: {},
        option: {
          addBtn: true,
          editBtn: true,
          delBtn: true,
          title: "待挖掘内容",
          requstData: [],
          responseData: [],
          column: [
            {
              label: "ID",
              prop: "id",
              span: 24,
              type: "input",
              hide: true,
              display: false
            },
            {
              label: "顺序号",
              prop: "orderNo",
              span: 24,
              type: "input",
              hide: true,
              display: false
            },
            {
              label: "内容",
              prop: "sentence",
              span: 24,
              type: "input",
              rules: [
                {
                  required: true,
                  message: "请输入内容",
                  trigger: "blur",
                },
                {
                  min: 1,
                  max: 500,
                  message: "长度在 1 到 500 个字符",
                  trigger: "blur",
                }
              ],
            },
            {
              label: "角色",
              prop: "roleType",
              span: 24,
              type: "select",
              dicData: [
                { label: "坐席", value: "1" },
                { label: "访客", value: "2" },
              ],
              rules: [
                {
                  required: true,
                  message: "请选择",
                  trigger: "blur",
                },
              ],
            },

          ]
        }
      }
    };
  },
  computed: {},
  created() {
    const scope = this;
    let abilityCode = scope.rowData.testUrl;
    scope.conParms.name = scope.rowData.name;
    let category1 = null;
    if (scope.rowData.headerTitle === "应用管理") {
      scope.appwichAbility(); // 应用管理跳转体验根据应用id查询能力逻辑（只显示当前应用下的能力）
    } else {
      if (scope.rowData.headerTitle === "能力管理") {
        // 特殊处理树形结构
        category1 = scope.rowData.category1;
        // abilityCode = scope.rowData.code
      }
      getAllAiAbilityList({}).then((res) => {
        if (res.status === 200) {
          const data = res.data.data;
          const arr = [];
          data.map((v) => {
            if (
              v.code !== "recordingFileAsrCallbackWithAliyun" &&
              v.code !== "recordingFileAsrCallbackWithAliyunLocal" &&
              v.code !== "recordingFileAsrCallbackWithAliyun"
            ) {
              if (category1 === v.category1) {
                arr.push(v);
              }
            }
          });
          scope.menuList = arr;
          scope.conParms.testUrl = scope.rowData.testUrl;
          data.map((v) => {
            if (v.testUrl === abilityCode) {
              scope.menuId = v.id;
            }
          });
        } else {
          scope.$message.error(res.msg);
        }
      });
      scope.setVal(abilityCode);
      // 处理图片逻辑
      aiInterfaceParama.params.dataJson.map((v) => {
        if (Object.keys(v)[0] === abilityCode) {
          const RequestBody = v[abilityCode].RequestBody;
          if (RequestBody.result) {
            scope.editableTabsUrl = RequestBody.result.url;
          }
        }
      });
    }
    scope.abilityCode = abilityCode;
    scope.ttsWithHuilanFlag = false;
    if (abilityCode === "asrForUploadFileWithHuilan") {
      scope.uploadFile = true;
      scope.action = `api/${ai}/ai/asrForUploadFileWithHuilan`;
      scope.disabled = true;
      scope.uploadDown.actionAccept = ".wav,.mp3";
      scope.uploadDown.title = "请上传wav,mp3格式音频文件";
      scope.setValRequstUpload(abilityCode, null);
      if (scope.$refs.uploadFile) {
        scope.$refs.uploadFile.clearFiles();
      }
    }
    if (
      abilityCode === "docAnalysisOfficeWithBaidu" ||
      abilityCode === "idcardWithBaidu" ||
      abilityCode === "accurateBasicOcrWithBaidu"
    ) {
      scope.upload = true;
      scope.uploadDown.accept = ".image,.jpeg,.png,.pdf,.jpg";
      scope.uploadDown.title = "请上传image,jpeg,png,pdf,jpg格式图片或文件";
    } else {
      scope.upload = false;
    }
    scope.analysis = false;
    scope.txtsListAnalysisFlag = false;
  },
  methods: {
    appwichAbility() {
      const self = this;
      const applicationId = this.rowData.id;
      let abilityCode = null;
      if (applicationId) {
        getHuilanAiApplicationAbilityRelationByApplicationId({
          applicationId,
        }).then((res) => {
          const data = res.data;
          if (data.success) {
            const arr = [];
            data.data.map((v) => {
              if (
                v.code !== "recordingFileAsrCallbackWithAliyun" &&
                v.code !== "recordingFileAsrCallbackWithAliyunLocal" &&
                v.code !== "recordingFileAsrCallbackWithAliyun"
              ) {
                arr.push(v);
              }
            });
            self.menuList = arr;
            let newData = { ...self.rowData, menuList: arr };
            self.$emit("naturalLanguageProcessing", newData);
            const rowData = data.data[0];
            self.menuId = rowData.id;
            abilityCode = rowData.code;
            self.conParms = rowData;
            self.setVal(abilityCode);
            self.abilityCode = rowData.code;
          }
        });
      } else {
        abilityCode = self.rowData.testUrl;
        getAllAiAbilityList({}).then((res) => {
          if (res.status === 200) {
            const data = res.data.data;
            const arr = [];
            data.map((v) => {
              if (
                v.code !== "recordingFileAsrCallbackWithAliyun" &&
                v.code !== "recordingFileAsrCallbackWithAliyunLocal" &&
                v.code !== "recordingFileAsrCallbackWithAliyun"
              ) {
                if (self.rowData.testUrl === v.testUrl) {
                  arr.push(v);
                  self.conParms = v;
                }
              }
            });
            self.menuList = arr;
            let newData = { ...self.rowData, menuList: arr };
            self.$emit("naturalLanguageProcessing", newData);
            data.map((v) => {
              if (v.testUrl === self.rowData.testUrl) {
                self.menuId = v.id;
              }
            });
            self.setVal(abilityCode);
          } else {
            self.$message.error(res.msg);
          }
        });
      }
      // 处理图片逻辑
      aiInterfaceParama.params.dataJson.map((v) => {
        if (Object.keys(v)[0] === abilityCode) {
          const RequestBody = v[abilityCode].RequestBody;
          if (RequestBody.result) {
            //eslint-disable-next-line
            scope.editableTabsUrl = RequestBody.result.url;
          }
        }
      });
    },
    //eslint-disable-next-line
    handleClick(tab, event) {
      // console.log(tab, event);
    },
    inter() {
      const self = this
      if (
        this.rowData.category1 === "machine" ||
        this.rowData.category1 === "nlp" || this.rowData.category1 === 'gpt' || this.rowData.category1 === 'voice' || this.rowData.category1 === 'image' || this.rowData.category1 === 'emotion'
      ) {
        const rowData = { ...this.rowData, testUrl: this.abilityCode };
        this.$emit("nplHandl", rowData, "3");
      } else {
        this.$parent.switchPage = "3";
        if (this.$parent.rowData) {
          this.$parent.rowData.testUrl = this.abilityCode;
        } else {
          let rowDataSource = { ...this.rowData, testUrl: this.abilityCode };
          self.$emit("naturalLanguageProcessing", rowDataSource, "3");
        }
      }
    },
    analysisFun() {
      const scope = this;
      let RequestBody = null;
      aiInterfaceParama.params.dataJson.map((v) => {
        if (Object.keys(v)[0] === scope.abilityCode) {
          RequestBody = v[scope.abilityCode].RequestBody;
        }
      });
      this.selectCallbackKey = RequestBody.callbackKey;
      let parmsWs = {};
      let targetSentenceListFlug = true
      switch (scope.conParms.testUrl) {
        /* eslint-disable*/
        case "splitSentences":
          // 分词
          const splitSentences = {
            splitSentences: {
              sentences: scope.form.targetSentenceList,
              tenantId: scope.form.tenantId,
            },
          };
          parmsWs = splitSentences;
          if (scope.form.targetSentenceList.length <= 0) {
            targetSentenceListFlug = false
          }
          break;
        /* eslint-disable*/
        case "discoverNewWords":
          const discoverNewWords = {
            discoverNewWords: {
              sentences: scope.form.text,
              tenantId: scope.form.tenantId,
            },
          };
          parmsWs = discoverNewWords;
          break;
        // 关键词提取
        /* eslint-disable*/
        case "extractKeywordsFromTxt":
          const extractKeywordsFromTxt = {
            extractKeywordsFromTxt: {
              maxPerSentence: scope.form.maxPerSentence,
              text: scope.form.text,
              topN: scope.form.topN,
              tenantId: scope.form.tenantId,
            },
          };
          parmsWs = extractKeywordsFromTxt;
          break;
        // 语种识别
        /* eslint-disable*/
        case "charDetect":
          const charDetect = {
            charDetect: {
              text: scope.form.text,
              tenantId: scope.form.tenantId,
            },
          };
          parmsWs = charDetect;
          break;
        // 实体词提取
        /* eslint-disable*/
        case "extractEntities":
          const extractEntities = {
            extractEntities: {
              sentence: scope.form.text,
              tenantId: scope.form.tenantId,
            },
          };
          parmsWs = extractEntities;
          break;
        // 敏感词过滤
        /* eslint-disable*/
        case "findSensitiveWords":
          const findSensitiveWords = {
            findSensitiveWords: {
              // enableSystemWords: scope.form.enableSystemWords,
              // enableTenantWords: scope.form.enableTenantWords,
              enableSystemWords:
                RequestBody.findSensitiveWords.enableSystemWords,
              enableTenantWords:
                RequestBody.findSensitiveWords.enableTenantWords,
              sentences: scope.form.targetSentenceList,
              tenantId: scope.form.tenantId,
              doReplace: RequestBody.findSensitiveWords.doReplace,
              replaceChar: RequestBody.findSensitiveWords.replaceChar,
              enableBuiltinWords: RequestBody.findSensitiveWords.enableBuiltinWords,
            },
          };
          parmsWs = findSensitiveWords;
          if (scope.form.targetSentenceList.length <= 0) {
            targetSentenceListFlug = false
          }
          break;
        // 句法分析
        /* eslint-disable*/
        case "syntacticAnalysis":
          const syntacticAnalysis = {
            syntacticAnalysis: {
              sentence: scope.form.text,
              tenantId: scope.form.tenantId,
            },
          };
          parmsWs = syntacticAnalysis;
          break;
        // 句子聚类
        /* eslint-disable*/
        case "sentenceCluster":
          const sentenceCluster = {
            sentenceCluster: {
              sentences: scope.form.targetSentenceList,
              tenantId: scope.form.tenantId,
            },
          };
          parmsWs = sentenceCluster;
          if (scope.form.targetSentenceList.length <= 0) {
            targetSentenceListFlug = false
          }
          break;
        // 摘要提取
        /* eslint-disable*/
        case "extractSummary":
          const extractSummary = {
            extractSummary: {
              size: scope.form.maxPerSentence,
              text: scope.form.text,
              tenantId: scope.form.tenantId,
            },
          };
          parmsWs = extractSummary;
          break;
        // 从聊天记录或文档挖掘QA
        /* eslint-disable*/
        case "miningQA":
          const miningQA = {
            miningQA: {
              sentences: scope.miningQA.option.responseData,
            },
          };
          parmsWs = miningQA;
          if (scope.miningQA.option.responseData.length <= 0) {
            targetSentenceListFlug = false
          }
          break;
        // 文档切分句子
        /* eslint-disable*/
        case "splitToSentences":
          let splitToSentences = {
            splitToSentences: {
              // normalizeFlag: scope.form.enableTenantWords,
              text: scope.form.text,
              tenantId: scope.form.tenantId,
            },
          };
          parmsWs = splitToSentences;
          break;
        /* eslint-disable*/
        case "senSim":
          // 短文本相似度计算
          const senSim = {
            senSim: {
              sourceSentence: scope.form.text,
              targetSentenceList: scope.form.targetSentenceList,
              tenantId: scope.form.tenantId,
            },
          };
          parmsWs = senSim;
          if (scope.form.targetSentenceList.length <= 0) {
            targetSentenceListFlug = false
          }
          break;
        // NLP数学计算器
        /* eslint-disable */
        case "mathCompute":
          const mathCompute = {
            mathCompute: {
              sentence: scope.form.text,
              tenantId: scope.form.tenantId,
            },
          };
          parmsWs = mathCompute;
          break;
        // 挖掘词共现(可作为知识点，也可作为标签)
        case "miningWordCoOccurrences":
          const miningWordCoOccurrences = {
            miningWordCoOccurrences: {
              sentences: scope.form.targetSentenceList,
              tenantId: scope.form.tenantId,
            },
          };
          parmsWs = miningWordCoOccurrences;
          if (scope.form.targetSentenceList.length <= 0) {
            targetSentenceListFlug = false
          }
          break;
        // 标签提取
        case "extractTags":
          const extractTags = {
            extractTags: {
              text: scope.form.text,
              topN: scope.form.topN,
              tenantId: scope.form.tenantId,
            },
          };
          parmsWs = extractTags;
          break;
        // 提取年月日
        case "extractYearMonth":
          const extractYearMonth = {
            extractYearMonth: {
              sentence: scope.form.text,
              tenantId: scope.form.tenantId,
            },
          };
          parmsWs = extractYearMonth;
          break;
        // 计算文本的SimHash
        case "simHash":
          const simHash = {
            simHash: {
              sentence: scope.form.text,
              tenantId: scope.form.tenantId,
            },
          };
          parmsWs = simHash;
          break;
        // 计算SimHash的相似度
        case "simHashSim":
          const simHashSim = {
            simHashSim: {
              sourceHash: scope.form.targetSentenceList,
              targetHashList: scope.form.targetHashList.filter((v) => {
                return v !== null;
              }),
            },
          };
          parmsWs = simHashSim;
          if (scope.form.targetSentenceList.length <= 0) {
            targetSentenceListFlug = false
          }
          break;
        //执行lua脚本
        case "runLuaScript":
          const runLuaScript = RequestBody;
          runLuaScript.runLuaScript.inputs.text = scope.form.text;
          runLuaScript.runLuaScript.inputs.q = scope.form.id;
          parmsWs = runLuaScript;
          break;
        //短语句法分析服务
        case "componentAnalysis":
          const componentAnalysis = RequestBody;
          componentAnalysis.componentAnalysis.sentences = scope.form.text instanceof Array ? scope.form.text : [scope.form.text];
          parmsWs = componentAnalysis;
          break;
        //短语句法分析服务List
        case "componentAnalysisList":
          const componentAnalysisList = RequestBody;
          componentAnalysisList.componentAnalysisList.sentences[0] =
            scope.form.targetSentenceList;
          parmsWs = componentAnalysisList;
          if (scope.form.targetSentenceList.length <= 0) {
            targetSentenceListFlug = false
          }
          break;
        //语义依存分析服务
        case "semanticDependencyAnalysis":
          const semanticDependencyAnalysis = RequestBody;
          semanticDependencyAnalysis.semanticDependencyAnalysis.sentences =
            scope.form.text instanceof Array ? scope.form.text : [scope.form.text];
          parmsWs = semanticDependencyAnalysis;
          break;
        //语义依存分析服务List
        case "semanticDependencyAnalysisList":
          const semanticDependencyAnalysisList = RequestBody;
          semanticDependencyAnalysisList.semanticDependencyAnalysisList.sentences[0] =
            scope.form.targetSentenceList;
          parmsWs = semanticDependencyAnalysisList;
          if (scope.form.targetSentenceList.length <= 0) {
            targetSentenceListFlug = false
          }
          break;
        //语义角色标注服务
        case "semanticRoleLabeling":
          const semanticRoleLabeling = RequestBody;
          semanticRoleLabeling.semanticRoleLabeling.sentences = scope.form.text instanceof Array ? scope.form.text : [scope.form.text];
          parmsWs = semanticRoleLabeling;
          break;
        //语义角色标注服务List
        case "semanticRoleLabelingList":
          const semanticRoleLabelingList = RequestBody;
          semanticRoleLabelingList.semanticRoleLabelingList.sentences[0] =
            scope.form.targetSentenceList;
          parmsWs = semanticRoleLabelingList;
          if (scope.form.targetSentenceList.length <= 0) {
            targetSentenceListFlug = false
          }
          break;
        //情感分析
        case "affectiveAnalysis":
          const affectiveAnalysis = RequestBody;
          affectiveAnalysis.affectiveAnalysis.text = scope.form.text;
          parmsWs = affectiveAnalysis;
          break;
        //tts（汇联）
        case "ttsWithHuilan":
          const ttsWithHuilan = RequestBody;
          ttsWithHuilan.ttsWithHuilan.spk = scope.form.ttsSn;
          // ttsWithHuilan.ttsWithHuilan.spd = scope.form.maxPerSentence;
          // ttsWithHuilan.ttsWithHuilan.vol = scope.form.topN;
          // ttsWithHuilan.ttsWithHuilan.pitch = scope.form.pitch;
          // ttsWithHuilan.ttsWithHuilan.fmt = scope.form.id;
          // ttsWithHuilan.ttsWithHuilan.ph = scope.form.ttsPh;
          // ttsWithHuilan.ttsWithHuilan.du = scope.form.ttsDu;
          // ttsWithHuilan.ttsWithHuilan.text = scope.form.ttsText;
          ttsWithHuilan.ttsWithHuilan.text = scope.form.ttsText;
          parmsWs = ttsWithHuilan;
          break;
        //	录音文件识别，阿里云本地
        case "recordingFileAsrWithAliyun":
          const recordingFileAsrWithAliyun = RequestBody;
          recordingFileAsrWithAliyun.recordingFileAsrWithAliyun.file_link =
            scope.form.text;
          parmsWs = recordingFileAsrWithAliyun;
          break;
        //	语音合成（阿里云）
        case "speechSynthesizerRestfulWithAliyun":
          const speechSynthesizerRestfulWithAliyun = RequestBody;
          speechSynthesizerRestfulWithAliyun.speechSynthesizerRestfulWithAliyun.text =
            scope.form.text;
          speechSynthesizerRestfulWithAliyun.speechSynthesizerRestfulWithAliyun.format =
            scope.form.id;
          parmsWs = speechSynthesizerRestfulWithAliyun;
          break;
        //	录音文件识别，阿里云本地
        case "recordingFileAsrWithAliyunLocal":
          const recordingFileAsrWithAliyunLocal = RequestBody;
          recordingFileAsrWithAliyunLocal.recordingFileAsrWithAliyunLocal.file_link =
            scope.form.text;
          parmsWs = recordingFileAsrWithAliyunLocal;
          break;
        //	录音文件识别结果轮询，阿里云本地(录音文件识别，阿里云本地第二个接口)
        case "recordingFileAsrCallbackWithAliyun":
          const recordingFileAsrCallbackWithAliyun = RequestBody;
          recordingFileAsrCallbackWithAliyun.recordingFileAsrCallbackWithAliyun.taskId =
            scope.form.text;
          parmsWs = recordingFileAsrCallbackWithAliyun;
          break;
        //	通用文字识别，高精度版，百度
        case "accurateBasicOcrWithBaidu":
          const accurateBasicOcrWithBaidu = RequestBody;
          accurateBasicOcrWithBaidu.accurateBasicOcrWithBaidu.url =
            scope.form.text;
          accurateBasicOcrWithBaidu.accurateBasicOcrWithBaidu.paragraph =
            scope.form.enableTenantWords;
          accurateBasicOcrWithBaidu.accurateBasicOcrWithBaidu.probability =
            scope.form.enableSystemWords;
          delete accurateBasicOcrWithBaidu.accurateBasicOcrWithBaidu.image;
          parmsWs = recordingFileAsrCallbackWithAliyunLocal;
          break;
        //	办公文档识别，百度
        case "docAnalysisOfficeWithBaidu":
          const docAnalysisOfficeWithBaidu = RequestBody;
          docAnalysisOfficeWithBaidu.docAnalysisOfficeWithBaidu.url =
            scope.form.text;
          delete docAnalysisOfficeWithBaidu.docAnalysisOfficeWithBaidu.image;
          parmsWs = docAnalysisOfficeWithBaidu;
          break;
        //	身份证识别（百度）
        case "idcardWithBaidu":
          const idcardWithBaidu = RequestBody;
          idcardWithBaidu.idcardWithBaidu.url = scope.form.text;
          idcardWithBaidu.idcardWithBaidu.id_card_side =
            scope.form.id_card_side;
          delete idcardWithBaidu.idcardWithBaidu.image;
          parmsWs = idcardWithBaidu;
          break;
        //	标签与短文本相似度计算
        case "tagSenSim":
          const tagSenSim = RequestBody;
          // const tagWords = scope.tagSenSim.requstData;
          const tagWords = scope.tagSenSim.params;
          // let json = {};
          // tagWords.map((v) => {
          //   json[v.tag] = v.words;
          // });
          // tagSenSim.tagSenSim.tagWords = json;
          tagSenSim.tagSenSim.tagWords = tagWords.tagWords;
          tagSenSim.tagSenSim.targetSentenceList =
            scope.form.targetSentenceList;
          parmsWs = tagSenSim;
          if (scope.form.targetSentenceList.length <= 0 || Object.keys(scope.tagSenSim.params.tagWords).length <= 0) {
            targetSentenceListFlug = false
          }
          break;
        //	搜索结果词优先排名
        case "rankQueryResult":
          const rankQueryResult = scope.form.vueJson;
          parmsWs = {};
          RequestBody.rankQueryResult = rankQueryResult
          break;
        //	chatgpt接口
        case "chatgptForOpenAi":
          const chatgptForOpenAi = RequestBody;

          // chatgptForOpenAi.chatgptForOpenAi.input_text = scope.form.text;
          // chatgptForOpenAi.chatgptForOpenAi.history = scope.form.targetSentenceList;
          // parmsWs = chatgptForOpenAi;
          break;
        //		文生图接口
        case "txtToImgForHuilan":
          const txtToImgForHuilan = RequestBody;
          txtToImgForHuilan.txtToImgForHuilan.prompt = scope.form.text;
          txtToImgForHuilan.txtToImgForHuilan.batch_size = scope.form.maxPerSentence;
          txtToImgForHuilan.txtToImgForHuilan.width = scope.form.topN;
          txtToImgForHuilan.txtToImgForHuilan.height = scope.form.pitch;
          parmsWs = txtToImgForHuilan;
          break;
        //		汇联对话
        case "chatgptForHuilan":
          const chatgptForHuilan = RequestBody;
          chatgptForHuilan.chatgptForHuilan.input_text = scope.form.text;
          parmsWs = chatgptForHuilan;
          break;
        //		依存句法分析服务
        // case "dependencyParser":
        //   const dependencyParser = RequestBody;
        //   dependencyParser.dependencyParser.sentences[0] = scope.form.vueJson
        //   break;
      }
      let parms = { ...RequestBody, ...parmsWs };
      if (this.rowData.appKey) {
        let abilityCode = parms.abilityCode;
        delete parms.abilityCode;
        delete parms.ifTest;
        parms = {
          ...parms,
          appKey: this.rowData.appKey,
          appSecret: this.rowData.appSecret,
          abilityCode,
        };
      }
      if (targetSentenceListFlug) {
        this.responeseBase(parms)
      } else {
        this.$message.error('请把数据补充完整')
      }
    },
    responeseBase(parms) {
      const scope = this
      extractKeywordsFromTxt(parms).then((res) => {
        const status = res.data;
        // const data = JSON.parse(res.data.data);
        const data = res.data.data;
        if (status.success) {
          if (parms.result) {
            if (parms.result.content === "false") {

              this.txtsList = [];
            }
            if (parms.result.split) {
              //关键词处理逻辑，取值冒号后面
              const splitArr = Object.keys(data[0]);
              this.txtsList = splitArr;
            }
            if (parms.result.summary) {
              //摘要提取处理逻辑，取值summary
              const splitArr = data.summary;
              this.txtsList = [splitArr];
            }
            if (parms.result.charDetect) {
              //语种识别，取zhName
              const splitArr = data.zhName;
              this.txtsList = [splitArr];
            }
            if (parms.result.extractEntities) {
              //实体提取word,nao
              const splitArr = [];
              data.entityWords.map((v) => {
                let entityNames = null;
                v.entityNames.map((t) => {
                  entityNames = t + ':' + v.word
                  splitArr.push(entityNames);
                });
              });
              const arr = []
              const arrSuc = []
              splitArr.map(v => {
                let key = v.split(':')[0]
                let val = v.split(':')[1]
                if (arr.includes(key)) {
                  v = v + ',' + key
                  arrSuc.map((u, i) => {
                    if (u.split(':')[0] === key) {
                      arrSuc[i] = u + ',' + val
                    }
                  })
                } else {
                  arrSuc.push(v)
                }
                arr.push(key)
              })
              this.txtsList = arrSuc;
            }
            if (parms.result.splitSentences) {
              // 分词 拆分
              const splitArr = data.splitSentences[0].split(" ");
              // const splitArr = data.splitSentences[0];
              const arr = [];
              splitArr.map((v) => {
                arr.push(v)
                // if (v.split(" ")[1] && v !== "m ,") {
                //   arr.push(v.split(" ")[1]);
                // } else if (v !== "m ," && v !== ", " && v !== "。" && v !== "w") {
                //   arr.push(v);
                // }
              });
              this.txtsList = arr;
            }
            if (parms.result.mathCompute) {
              // 计算器
              const splitArr = [data.equation, data.value];
              this.txtsList = splitArr;
            }
            if (parms.result.senSim) {
              // 相似度计算
              const splitArr = [];
              data.sentenceScores.map((v) => {
                splitArr.push(v.sentence, v.score.toFixed(4));
              });
              this.txtsList = splitArr;
            }
            if (parms.result.splitToSentences) {
              // 文档切分句子
              const splitArr = data.sentences;
              this.txtsList = splitArr;
            }
            if (parms.result.miningQA) {
              //从聊天记录或文档挖掘QA
              const splitArr = [];
              data.qaList.map(v => {
                let obj = {
                  sentence: v.question,
                  score: v.answer,
                }
                splitArr.push(obj)
              })
              scope.txtsListAbout = splitArr;
            }
            if (parms.result.extractSummary) {
              //摘要提取
              const splitArr = [data.summary];
              scope.txtsList = splitArr;
            }
            if (parms.result.findSensitiveWords) {
              //敏感词
              const splitArr = [];
              data.sensitiveWordsResult.map((v) => {
                if (v.length > 0) {
                  v.map(t => {
                    splitArr.push(t.text);
                  })
                }
              });
              scope.txtsList = splitArr;
            }
            if (parms.result.extractYearMonth) {
              //提取日期
              const splitArr = [
                data.dateStr,
                data.fromDateVal,
                data.fromMonthVal,
                data.monthStr,
                data.toDateVal,
                data.toMonthVal,
              ];
              const arr = [];
              splitArr.map((v) => {
                if (v) {
                  arr.push(v);
                }
              });
              scope.txtsList = arr;
            }
            if (parms.result.miningWordCoOccurrences) {
              //挖掘词共现
              const arr = [];
              data.wordCoOccurrences.map((v) => {
                // v.words.map((t) => {
                //   arr.push(t);
                // });
                arr.push(v.words);
              });
              scope.txtsListLinge = arr;
            }
            if (parms.result.docAnalysisOfficeWithBaidu) {
              //办公文档识别
              const arr = [];
              data.results.map((v) => {
                arr.push(v.words.word);
              });
              scope.txtsList = arr;
            }
            if (parms.result.accurateBasicOcrWithBaidu) {
              //通用文字识别，高精度版，百度
              const arr = [];
              data.words_result.map((v) => {
                arr.push(v.words);
              });
              scope.txtsList = arr;
            }
            if (parms.result.idcardWithBaidu) {
              //身份证识别
              const arr = [];
              const splitArr = [
                data.words_result["失效日期"].words,
                data.words_result["签发日期"].words,
                data.words_result["签发机关"].words,
              ];
              // data.words_result.map((v) => {
              //   arr.push(v.words);
              // });
              scope.txtsList = splitArr;
            }
            if (parms.result.sentenceCluster) {
              //句子聚类
              const arr = [];
              data.groups.map((v) => {
                if (v.groupId) {
                  let str = null;
                  if (v.groupId) {
                    str = scope.loverCase[v.groupId - 1];
                    arr.push("第" + str + "组");
                  }
                }
                v.sentences.map((t) => {
                  arr.push(t.text);
                });
              });
              // data.words_result.map((v) => {
              //   arr.push(v.words);
              // });
              scope.txtsList = arr;
            }
            if (parms.result.tagSenSim) {
              //标签与短文本相似度计算
              const arr = [];
              data.sentenceScores.map((v, i) => {
                data.sentenceScores.map((t) => {
                  if (i === t.originalIndex) {
                    v.score = v.score.toFixed(2);
                    arr.push(v);
                  }
                });
              });
              scope.txtsListAbout = arr;
            }
            if (parms.result.simHashSim) {
              //文本simHash相似度
              const arr = [];
              data.simHashSimilarityList.map((v, i) => {
                let obj = `目标SimHash${v.index + 1}:${v.similar ? '相似' : '不相似'}-距离${v.distance}`
                arr.push(obj)
              });
              this.txtsList = arr
            }
            if (parms.result.discoverNewWords) {
              //新词发现
              this.txtsList = data.newWords
            }
            if (parms.result.syntacticAnalysis) {
              //句法分析
              this.vueJsonRsoult = data
            }
            if (parms.result.extractTags) {
              //标签提取
              this.txtsList = scope.discoverArr(data, []);
            }
            if (parms.result.semanticRoleLabeling) {
              //语义角色标注服务
              this.vueJsonRsoult = data
            }
            if (parms.result.semanticDependencyAnalysis) {
              //语义角色标注服务
              this.vueJsonRsoult = data
            }
            if (parms.result.componentAnalysis) {
              //短语句法分析服务
              this.vueJsonRsoult = data
            }
            if (parms.result.simHash) {
              //计算文本的SimHash
              this.vueJsonRsoult = data
            }
            if (parms.result.runLuaScript) {
              //执行lua脚本
              this.vueJsonRsoult = data
            }
            if (parms.result.dependencyParser) {
              //执行lua脚本
              this.vueJsonRsoult = data
            }
            if (parms.result.chatgptForOpenAi) {
              //	chatgpt接口
              // this.textSentence = data.reply
            }
            if (parms.result.txtToImgForHuilan) {
              //		文生图接口
              const arrIms = [];
              data.images.map((v) => {
                let obj = {
                  thumbUrl: 'data:image/jpeg;base64,' + v,
                  url: 'data:image/jpeg;base64,' + v,
                  type: 'img',
                }
                arrIms.push(obj)
              })
              this.imgDatas = arrIms
            }
            if (parms.result.chatgptForHuilan) {
              //		汇联对话
              // this.textSentence = data.speak_text
            }
          } else {
            if (parms.abilityCode === "rankQueryResult") {
              this.vueJsonRsoult = data
            } else if (parms.abilityCode === "recordingFileAsrWithAliyun") {
              this.vueJsonRsoult = data
            } else {
              this.vueJsonRsoult = data
            }
          }
          this.$message.success("分析成功");

          if (
            scope.conParms.testUrl === "ttsWithHuilan" ||
            scope.conParms.testUrl === "speechSynthesizerRestfulWithAliyun"
          ) {
            scope.ttsWithHuilanFlag = true;
            scope.audioSrc = "data:audio/wav;base64," + res.data.data.audio;
          }
          if (
            scope.conParms.testUrl === "recordingFileAsrWithAliyun" ||
            scope.conParms.testUrl === "recordingFileAsrWithAliyunLocal"
          ) {
            scope.taskId = data.taskId;
            scope.analysis = true;
          }
        } else {
          this.$message.error(res.msg);
        }
      });
    },
    discoverArr(data, childArr) {
      const scop = this;
      let arr = childArr;
      if (Array.isArray(data)) {
        data.map((v) => {
          if (typeof v === "string" || typeof v === "number") {
            arr.push(v);
          } else {
            scop.discoverArr(v, arr);
          }
        });
      } else {
        for (let key in data) {
          if (
            typeof data[key] === "string" ||
            typeof data[key] === "number" ||
            data[key] === null
          ) {
            arr.push(key + ":" + data[key]);
          } else {
            scop.discoverArr(data[key], arr);
          }
        }
      }
      return arr;
    },
    menuSelect(row) {
      const scope = this;
      this.menuId = row;
      this.vueJsonRsoult = null
      this.menuList.map((v) => {
        if (v.id === row) {
          this.conParms = v;
          // 显示和隐藏dom元素
          scope.setVal(v.testUrl);
          scope.abilityCode = v.testUrl;
          if (
            v.testUrl === "docAnalysisOfficeWithBaidu" ||
            v.testUrl === "accurateBasicOcrWithBaidu" ||
            v.testUrl === "idcardWithBaidu"
          ) {
            scope.upload = true;
            if (scope.$refs.uploadFile) {
              scope.$refs.uploadFile.clearFiles();
            }
            scope.uploadFile = false;
            this.uploadDown.accept = ".image,.jpeg,.png,.pdf,.jpg";
            this.uploadDown.title =
              "请上传image,jpeg,png,pdf,jpg格式图片或文件";
          } else {
            scope.upload = false;
          }
          if (v.testUrl === "asrForUploadFileWithHuilan") {
            scope.uploadFile = true;
            scope.action = `api/${ai}/ai/asrForUploadFileWithHuilan`;
            scope.disabled = true;
            scope.setValRequstUpload(v.testUrl, null);
            this.uploadDown.actionAccept = ".wav,.mp3";
            this.uploadDown.title = "请上传wav,mp3格式音频文件";
            if (scope.$refs.upload) {
              scope.$refs.upload.clearFiles();
            }
            scope.upload = false;
          } else {
            scope.uploadFile = false;
            scope.disabled = false;
          }
        }
      });
      this.txtsList = [];
      this.txtsListAbout = [];
      this.txtsListAnalysis = [];
      this.txtsListLinge = [];
      scope.ttsWithHuilanFlag = false;
      scope.txtsListAnalysisFlag = false;
      scope.vueJsonRsoult = null;
      scope.analysis = false;
      if (scope.abilityCode !== 'chatgptForOpenAi' && scope.abilityCode !== 'chatgptForHuilan') {
        this.textSentence = false;
        this.disabled = false;
      } else {
        this.disabled = true;
      }
      this.imgDatas = [];
      // 切换菜单处理图片改变
      aiInterfaceParama.params.dataJson.map((v) => {
        if (Object.keys(v)[0] === scope.abilityCode) {
          const RequestBody = v[this.abilityCode].RequestBody;
          if (scope.abilityCode === 'miningQA') {
            const arr = [{ "id": "1", "orderNo": 1, "roleType": "2", "sentence": "你好" }, { "id": "2", "orderNo": 2, "roleType": "2", "sentence": "今天天气怎么样" }, { "id": "3", "orderNo": 3, "roleType": "2", "sentence": "你叫什么名字" }, { "id": "4", "orderNo": 4, "roleType": "1", "sentence": "张三" }, { "id": "5", "orderNo": 5, "roleType": "2", "sentence": "你的名字是什么" }];
            this.miningQA.option.requstData = arr
            scope.chilReData(arr)
          }
          if (RequestBody.result) {
            scope.editableTabsUrl = RequestBody.result.url;
          }
        }
      });
    },
    setVal(key) {
      const scope = this;
      let RequestBody = null;
      aiInterfaceParama.params.dataJson.map((v) => {
        if (Object.keys(v)[0] === key) {
          RequestBody = v[key].RequestBody;
        }
      });
      let parmsWs = {};
      switch (key) {
        case "splitSentences":
          let splitSentencesArr = ["人工智能是计算机科学的一个分支，它企图了解智能的实质，并生产出一种新的能以人类智能相似的方式做出反应的智能机器。"]
          scope.form.targetSentenceList = splitSentencesArr;
          scope.setListFlag(["targetSentenceList"]);
          scope.labelTals.targetSentenceList = "描述说明";
          scope.conParms.text =
            "将句子中的词语进行拆分";
          scope.editableTabs = [
            {
              title: "语音指令解析",
              name: "1",
              content:
                "以分词词性标注为基础，分析语音命令中的关键名称、动词、数量、时间等，准确理解命令的含义，提高用户体验",
            },
            {
              title: "法律术语",
              name: "2",
              content:
                "分析处理法律案由与案例信息，提取法律行业专业术语做信息结构化",
            },
            {
              title: "舆情信息提取",
              name: "3",
              content:
                "准确定位网络文章中的品牌舆情关键词，并通过词性判断提炼出与品牌词强关联的话题，助力品牌舆情监测及社交推广参考",
            },
          ];
          break;
        case "discoverNewWords":
          scope.form.text = RequestBody.discoverNewWords.txt;
          scope.form.maxPerSentence =
            RequestBody.discoverNewWords.highSolidRateThreshold;
          scope.form.topN =
            RequestBody.discoverNewWords.highEntropyRateThreshold;
          scope.setListFlag(["sentences", "maxPerSentence", "topN"]);
          scope.labelTals.text = "新词发现的文本内容";
          scope.labelTals.maxPerSentence =
            "高要求新词的凝聚度阈值,必须大于等于50,默认500";
          scope.labelTals.topN =
            "高要求新词的自由度阈值,必须大于等于2.54,默认2.54";
          scope.conParms.text = "对已有语料进行挖掘，从中识别出新词";
          scope.editableTabs = [
            {
              title: "商业智能",
              name: "1",
              content:
                "使得数据分析师面对庞大的内部和开源数据时，能快速地得到答案",
            },
            {
              title: "知识管理",
              name: "2",
              content: "新词发现提高知识管理水平，通过新词发现，提高知识梳理效率",
            },
            {
              title: "网络舆情",
              name: "3",
              content: "即时发现网络热词、新词，提高监控力度，优化监控手段",
            },
          ];
          break;
        case "extractKeywordsFromTxt":
          this.form.maxPerSentence =
            RequestBody.extractKeywordsFromTxt.maxPerSentence;
          this.form.text = RequestBody.extractKeywordsFromTxt.text;
          this.form.topN = RequestBody.extractKeywordsFromTxt.topN;
          scope.setListFlag(["sentences", "maxPerSentence", "topN"]);
          scope.labelTals.text = "关键词提取文本内容";
          scope.labelTals.maxPerSentence = "每句提取多少个关键词";
          scope.labelTals.topN = "最多显示关键词次数";
          scope.conParms.text =
            "从文本中自动提取出关键词";
          scope.editableTabs = [
            {
              title: "个性化推荐",
              name: "1",
              content:
                "通过对文章的关键词计算，结合用户画像，精准的对用户进行个性化推荐",
            },
            {
              title: "话题聚合",
              name: "2",
              content:
                "根据文章计算的关键词，聚合相同关键词的文章，便于用户对同一话题的文章进行全方位的信息阅读",
            },
            {
              title: "文章搜索",
              name: "3",
              content:
                "通过对文章关键词提取，完成搜索关键词与文章内容的精准匹配",
            },
          ];
          break;
        //实体提取
        case "extractEntities":
          this.form.text = RequestBody.extractEntities.sentence;
          scope.setListFlag(["sentences"]);
          scope.labelTals.text = "实体词提取文本内容";
          scope.conParms.text = "识别文本中的实体，进而挖掘各实体间的关系";
          scope.editableTabs = [
            {
              title: "文本搜索",
              name: "1",
              content: "帮助用户快速查找到期望检索相关内容",
            },
            {
              title: "舆情分析",
              name: "2",
              content: "挖掘用户评论的核心问题，跟踪产品口碑",
            },
            {
              title: "知识库构建",
              name: "3",
              content: "根据实体之间、实体与关键词之间的关联，构建相关的知识库",
            },
          ];
          break;
        //语种识别
        case "charDetect":
          this.form.text = RequestBody.charDetect.text;
          scope.setListFlag(["sentences"]);
          scope.labelTals.text = "语言检测文本内容";
          scope.conParms.text = "识别文本所属语种";
          scope.editableTabs = [
            {
              title: "文本检测",
              name: "1",
              content: "检测文本语种，用于文本处理",
            },
          ];
          break;
        //敏感词过滤
        case "findSensitiveWords":
          let sentencesData = ["⽼赵，你他娘的混蛋", "法〜轮功", "呵呵"]
          this.form.targetSentenceList = sentencesData
          // this.form.enableSystemWords =
          //   RequestBody.findSensitiveWords.enableSystemWords;
          // this.form.enableTenantWords =
          //   RequestBody.findSensitiveWords.enableTenantWords;
          scope.setListFlag([
            "targetSentenceList",
            // "enableTenantWords",
            // "enableSystemWords",
          ]);
          scope.labelTals.targetSentenceList = "文本内容";
          // scope.labelTals.enableTenantWords = "是否启⽤租户敏感词";
          // scope.labelTals.enableSystemWords = "是否启⽤系统敏感词";
          scope.conParms.text =
            "识别文本中的敏感词";
          scope.editableTabs = [
            {
              title: "用户评论过滤",
              name: "1",
              content:
                "适用于直播弹幕、社区论坛留言等，对用户评论信息进行检测，一旦发现用户提交违规内容，进行自动审核与实时过滤，保证产品良好用户体验",
            },
            {
              title: "注册信息筛查",
              name: "2",
              content:
                "对用户注册信息进行检测，筛查过滤用户提交注册的用户名或网名昵称，避免违规昵称及黑产通过注册用户名的方式推广违规信息",
            },
            {
              title: "文章内容审核",
              name: "3",
              content:
                "适用于各种内容生产和分发平台，能够准确识别出文本中的色情、低俗、违禁等内容，避免用户上传违规内容到平台，降低业务风险",
            },
          ];
          break;
        //句法分析
        case "syntacticAnalysis":
          this.form.text = RequestBody.syntacticAnalysis.sentence;
          scope.setListFlag(["sentences"]);
          scope.labelTals.text = "句⼦文本内容";
          scope.conParms.text =
            "自动分析文本中的依存句法结构信息，实现对自然语言的精准理解";
          scope.editableTabs = [
            {
              title: "智能问答系统",
              name: "1",
              content:
                "通过中文分词、短文本相似度、命名实体识别等自然语言处理相关技术，计算两个问题对的相似度，可解决问答、对话、语料挖掘、知识库构建等问题",
            },
            {
              title: "舆情分析",
              name: "2",
              content: "通过关键词提取、文本聚类、主题挖掘等算法模型，挖掘突发事件、舆论导向，进行话题发现、趋势发现、舆情分析等。多维度分析情绪、热点、趋势、传播途径等，及时全面的掌握舆情动态",
            },
          ];
          break;
        //句子聚类
        case "sentenceCluster":
          let sentencesArr = ["北京的天气", "武汉明天的天气怎么样", "呵呵"]
          this.form.targetSentenceList = sentencesArr;
          scope.setListFlag(["targetSentenceList"]);
          scope.labelTals.text = "一批句⼦文本内容";
          scope.conParms.text = "对一批句子进行聚类分析，把多个句子按照语义划分到不同类别";
          scope.editableTabs = [
            {
              title: "自主对话系统",
              name: "1",
              content:
                "对用户问题句子进行聚类，分析出用户总体的意图分布，并提炼出相对应的标准问题句子和答案句子用于线上应答",
            },
          ];
          break;
        //摘要提取
        case "extractSummary":
          this.form.text = RequestBody.extractSummary.text;
          this.form.maxPerSentence = RequestBody.extractSummary.size;
          scope.setListFlag(["sentences", "maxPerSentence"]);
          scope.labelTals.text = "摘要文本内容";
          scope.labelTals.maxPerSentence = "摘要句数";
          scope.conParms.text =
            "提取文章的摘要内容";
          scope.editableTabs = [
            {
              title: "新闻摘要",
              name: "1",
              content:
                "自动提取文本中的核心内容，形成摘要信息并展示或推送给用户，吸引用户点击并提升用户阅读效率",
            },
            {
              title: "智能写作",
              name: "2",
              content:
                "通过对大量的新闻文本进行语义分析和快速摘要，可以快速形成热点汇总类、新闻聚合类、事件盘点类的新闻稿件，进行自动写作和辅助写作，提升新闻生产效率",
            },
          ];
          break;
        //从聊天记录或文档挖掘QA
        case "miningQA":
          this.miningQA.option.requstData = RequestBody.miningQA.sentences;
          scope.setListFlag(["miningQA"]);
          scope.labelTals.text = "QA挖掘文本内容";
          scope.labelTals.maxPerSentence = "挖掘序号";
          scope.conParms.text = "从聊天记录或文档中挖掘出问题和答案";
          scope.editableTabs = [
            {
              title: "知识提取",
              name: "1",
              content: "自动挖掘整理文中的新的知识点，提高知识加工的工作效率",
            },
            {
              title: "智能客服",
              name: "2",
              content: "用户输入一个问题时，自动为用户寻找相似的问题和答案",
            },
          ];
          break;
        //文档切分句子
        case "splitToSentences":
          this.form.text = RequestBody.splitToSentences.text;
          this.form.enableTenantWords =
            RequestBody.splitToSentences.normalizeFlag;
          scope.setListFlag(["sentences"]);
          scope.labelTals.text = "请输入文本内容";
          // scope.labelTals.enableTenantWords = "normalizeFlag";
          scope.conParms.text = "将文档切分为句子";
          scope.editableTabs = [
            {
              title: "个性化推荐",
              name: "1",
              content:
                "通过对文章的标签计算，结合用户画像，精准的对用户进行个性化推荐",
            },
            {
              title: "话题集合",
              name: "2",
              content:
                "根据文章计算的标签，聚合相同标签的文章，便于用户对同一话题的文章进行全方位的信息阅读",
            },
          ];
          break;
        //短文本相似度计算
        case "senSim":
          this.form.text = RequestBody.senSim.sourceSentence;
          let targetSentenceList = [
            "我想办身份证",
            "身份证如何办理",
            "你好，办事情"
          ]
          this.form.targetSentenceList = targetSentenceList;
          scope.setListFlag(["sentences", "targetSentenceList"]);
          scope.labelTals.text = "短文单个句子文本内容";
          scope.labelTals.targetSentenceList = "短文多句文本内容";
          scope.conParms.text =
            "计算文本和文本之间的相似度";
          scope.editableTabs = [
            {
              title: "信息检索",
              name: "1",
              content:
                "在很多应用中都需要根据文本来检索其相似文本，需求场景非常普遍。不仅适用于纯文本检索，还可以利用标签等来检索图片、视频",
            },
            {
              title: "新闻推荐",
              name: "2",
              content:
                "通过用户刚刚浏览的新闻标题，检索出其他的相似新闻推荐给用户",
            },
            {
              title: "智能客服",
              name: "3",
              content: "用户输入一个问题时，自动为用户寻找相似的问题和答案",
            },
          ];
          break;
        //NLP数学计算器
        case "mathCompute":
          this.form.text = RequestBody.mathCompute.sentence;
          scope.setListFlag(["sentences"]);
          scope.labelTals.text = "NLP数学计算器文本内容";
          scope.conParms.text = '对文本内容中的数学公式进行理解并得出对应答案'
          scope.editableTabs = [
            {
              title: "作业批改",
              name: "1",
              content: "检查作业中的数学公式，并得出计算结论和实际结果进行比较",
            },
            {
              title: "辅助学习",
              name: "2",
              content: " 可以将口语表达的数学公式，转化为符号形式，并得出答案，进行辅助教学和指导",
            },
          ];
          break;
        //挖掘词共现(可作为知识点，也可作为标签)
        case "miningWordCoOccurrences":
          let sentences = ["如何办理身份证", "我想办身份证", "身份证如何办理", "北京的天气", "武汉明天的天气怎么样", "呵呵"]
          this.form.targetSentenceList = sentences;
          scope.setListFlag(["targetSentenceList"]);
          scope.labelTals.targetSentenceList = "挖掘词共现文本内容";
          scope.conParms.text = '在一组句子中，分析挖掘出共现词'
          scope.editableTabs = [
            {
              title: "新闻人物信息提取",
              name: "1",
              content:
                "以定制词表为基础，提取新闻源中涉及到的参会代表的人名和机构名、职务等，进行精准匹配，为所有参会代表提供专属的新闻档案",
            },
            {
              title: "法律术语识别",
              name: "2",
              content:
                "分析处理法律案由与案例信息，提取法律行业专业术语做信息结构化",
            },
            {
              title: "信息检索",
              name: "3",
              content:
                "在很多应用中都需要根据文本来检索其相似文本，需求场景非常普遍。不仅适用于纯文本检索，还可以利用标签等来检索图片、视频",
            },
          ];
          break;
        //标签提取
        case "extractTags":
          this.form.text = RequestBody.extractTags.text;
          this.form.topN = RequestBody.extractTags.topN;
          scope.setListFlag(["sentences", "topN"]);
          scope.labelTals.text = "标签提取文本内容";
          scope.labelTals.topN = "标签提取个数(标签个数为大于0整数)";
          scope.conParms.text = '从文本中提取标签，对文章进行核心关键词分析'
          scope.editableTabs = [
            {
              title: "个性化推荐",
              name: "1",
              content:
                "通过对文章的关键词计算，结合用户画像，精准的对用户进行个性化推荐话题聚合：根据文章计算的关键词，聚合相同关键词的文章，便于用户对同一话题的文章进行全方位的信息阅读",
            },
            {
              title: "文章搜索",
              name: "2",
              content:
                "通过对文章关键词提取，完成搜索关键词与文章内容的精准匹配",
            }
          ];
          break;
        //提取年月日
        case "extractYearMonth":
          this.form.text = RequestBody.extractYearMonth.sentence;
          scope.setListFlag(["sentences"]);
          scope.labelTals.text = "提取年月日文本内容";
          scope.conParms.text = '提取文本内容中提到的关于日期的信息'
          scope.editableTabs = [
            {
              title: "信息检索",
              name: "1",
              content: "对通篇文章进行检索，找到日期相关的关键信息",
            },
            {
              title: "报表处理",
              name: "2",
              content: "结构化处理报表等带有时间属性的文件",
            },
          ];
          break;
        //计算文本的SimHash
        case "simHash":
          this.form.text = RequestBody.simHash.text;
          scope.setListFlag(["sentences"]);
          scope.labelTals.text = "计算文本的SimHash文本内容";
          break;
        //计算SimHash的相似度
        case "simHashSim":
          let sourceHash = [13332, 57472, 30372, 55960]
          let targetHashList = [[13332, 57472, 30372, 55960], [13332, 57472, 30374, 55960], [13332, 57472, 30436, 55450]]
          this.form.targetSentenceList = sourceHash;
          this.form.targetHashList = targetHashList;
          scope.setListFlag(["targetSentenceList", "targetHashList"]);
          scope.labelTals.targetSentenceList = "源哈希";
          scope.labelTals.targetHashList = "目标哈希";
          scope.conParms.text = "计算文本之间SimHash的相似度";
          scope.editableTabs = [
            {
              title: "文章去重",
              name: "1",
              content: "定位文章中的相似内容，用于相似内容去重",
            },
            {
              title: "文本相似度计算",
              name: "2",
              content: "用户输入一个问题时，自动为用户寻找相似的问题和答案",
            },
          ];
          break;
        //执行lua脚本
        case "runLuaScript":
          this.form.text = RequestBody.runLuaScript.inputs.text;
          this.form.id = RequestBody.runLuaScript.inputs.q;
          scope.setListFlag(["sentences", "id"]);
          scope.labelTals.text = "脚本";
          scope.labelTals.id = "脚本传参";
          break;
        //短语句法分析服务
        case "componentAnalysis":
          this.form.text = RequestBody.componentAnalysis.sentences;
          scope.setListFlag(["sentences"]);
          scope.labelTals.text = "短语句法分析服务文本内容";
          scope.conParms.text =
            "成分句法分析就是找到一个句子的组成成分,把句子组织成短语的形式";
          scope.editableTabs = [
            {
              title: "语义理解",
              name: "1",
              content:
                "通过分析一段话的句法结构，提取其主干信息，帮助更好的理解用户意图。",
            },
            {
              title: "智能客服",
              name: "2",
              content:
                "以分词和词性标注为基础，分析语音命令中的分词，可以更加准确理解文字的含义，更好的进行客服服务。",
            },
            {
              title: "问答系统",
              name: "3",
              content:
                "对提出的问题进行句法分析，从而理解意图，找到匹配的答案。",
            },
          ];
          break;
        //短语句法分析服务List
        case "componentAnalysisList":
          let componentAnalysisListArr = ["最新", "疫情", "政策", "是", "居家", "办公"]
          this.form.targetSentenceList = componentAnalysisListArr
          scope.setListFlag(["targetSentenceList"]);
          scope.labelTals.text = "短语句法分析服务List文本内容";
          break;
        //语义依存分析服务
        case "semanticDependencyAnalysis":
          this.form.text = RequestBody.semanticDependencyAnalysis.sentences;
          scope.setListFlag(["sentences"]);
          scope.labelTals.text = "语义依存分析服务文本内容";
          scope.conParms.text = "分析句子各个语言单位之间的语义关联，并将语义关联以依存结构呈现，能够跨越句子表层句法结构快速回复，直接获取深层的语义信息";
          scope.editableTabs = [
            {
              title: "语义理解",
              name: "1",
              content:
                "通过分析一段话的句法结构，提取其主干信息，帮助更好的理解用户意图。",
            },
            {
              title: "智能客服",
              name: "2",
              content:
                "以分词和词性标注为基础，分析语音命令中的分词，可以更加准确理解文字的含义，更好的进行客服服务。",
            },
            {
              title: "问答系统",
              name: "3",
              content:
                "对提出的问题进行句法分析，从而理解意图，找到匹配的答案。",
            },
          ];
          break;
        //语义依存分析服务List
        case "semanticDependencyAnalysisList":
          let semanticDependencyAnalysisListArr = ["最新", "疫情", "政策", "是", "居家", "办公"]
          this.form.targetSentenceList = semanticDependencyAnalysisListArr
          scope.setListFlag(["targetSentenceList"]);
          scope.labelTals.text = "语义依存分析服务List文本内容";
          scope.conParms.text =
            "自动分析文本中的依存句法结构信息，实现对自然语言的精准理解";
          break;
        //语义角色标注服务
        case "semanticRoleLabeling":
          this.form.text = RequestBody.semanticRoleLabeling.sentences;
          scope.setListFlag(["sentences"]);
          scope.labelTals.text = "语义角色标注服务文本内容";
          scope.conParms.text =
            "以句子的谓词为中心，研究句子中各成分与谓词之间的关系，并且用语义角色来描述他们之间的关系";
          scope.editableTabs = [
            {
              title: "问答对话",
              name: "1",
              content:
                "通过语义角色标注，理解句子中各成文与谓词之间的关系，提高语义理解能力，可解决问答、对话、语料挖掘、知识库构建等问题信息抽取：从自然语言文档中找到特定的信息，对文档中包含的相关信息的部分进行分析",
            },
            {
              title: "机器翻译",
              name: "2",
              content:
                "计算机将一种语言，自动转换成另一种自然语言，提高翻译效果和准确率",
            },
          ];
          break;
        //语义角色标注服务List
        case "semanticRoleLabelingList":
          let semanticRoleLabelingListArr = ["最新", "疫情", "政策", "是", "居家", "办公"]
          this.form.targetSentenceList = semanticRoleLabelingListArr
          scope.setListFlag(["targetSentenceList"]);
          scope.labelTals.text = "语义角色标注服务List文本内容";
          break;
        //情感分析
        case "affectiveAnalysis":
          this.form.text = RequestBody.affectiveAnalysis.text;
          scope.setListFlag(["sentences"]);
          scope.labelTals.text = "情感分析文本内容";
          break;
        //	tts（汇联）
        case "ttsWithHuilan":
          this.form.ttsSn = RequestBody.ttsWithHuilan.spk;
          // this.form.maxPerSentence = RequestBody.ttsWithHuilan.spd;
          // this.form.topN = RequestBody.ttsWithHuilan.vol;
          // this.form.pitch = RequestBody.ttsWithHuilan.pitch;
          // this.form.id = RequestBody.ttsWithHuilan.fmt;
          // this.form.ttsPh = RequestBody.ttsWithHuilan.ph;
          // this.form.ttsDu = RequestBody.ttsWithHuilan.du;
          this.form.ttsText = RequestBody.ttsWithHuilan.text;
          scope.setListFlag([
            "ttsSn",
            // "ttsPh",
            // "maxPerSentence",
            // "topN",
            // "pitch",
            // "id",
            // "ttsDu",
            "ttsText",
          ]);
          // scope.labelTals.ttsSn = "发音人（sn1:标准男生；sn0:标准女生）";
          scope.labelTals.ttsSn = "发音人";
          // scope.labelTals.maxPerSentence = "语速倍数0.1到5.0之间";
          // scope.labelTals.topN = "音量倍数0.1到5.0之间";
          // scope.labelTals.pitch = "语调（-20到20之间）";
          // scope.labelTals.id = "音频格式";
          // scope.labelTals.ttsPh = "text是文本还是音素(0: 文本; 1: 音素序列)";
          // scope.labelTals.ttsDu = "是否计算音素时段(0: 不计算; 1: 计算)";
          scope.labelTals.ttsText = "输入合成语音的文本";
          scope.editableTabs = [
            {
              title: "机器人发声",
              name: "1",
              content:
                "在客服机器人、服务机器人等场景中，与语音识别、自然语言处理等模块联动，打通人机交互的闭环。实现高品质的机器人发声，使得人机交互更流畅自然",
            },
            {
              title: "有声读物",
              name: "2",
              content:
                " 将电子教材、小说等文本材料，以文本文件的形式导入离线语音合成引擎，产生完整的可重复阅读的有声教材或者有声小说，方便用户随时取用。",
            },
            {
              title: "语音播报",
              name: "3",
              content:
                "在语音导航应用、新闻类 App 中，语音合成可以快速生成高质量的播报音频，实现在开车、走路等不方便阅读消息的情况下，音频消息的即时传达。",
            },
          ];
          break;
        //	录音文件识别，阿里云本地
        case "recordingFileAsrWithAliyun":
          this.form.text = RequestBody.recordingFileAsrWithAliyun.file_link;
          scope.setListFlag(["sentences"]);
          scope.labelTals.text = "录音文件远程地址";
          break;
        //	语音合成（阿里云）
        case "speechSynthesizerRestfulWithAliyun":
          this.form.text = RequestBody.speechSynthesizerRestfulWithAliyun.text;
          this.form.id = RequestBody.speechSynthesizerRestfulWithAliyun.format;
          scope.setListFlag(["sentences", "id"]);
          scope.labelTals.text = "语音合成文本内容";
          scope.labelTals.id = "文件格式";
          scope.editableTabs = [
            {
              title: "机器人发声",
              name: "1",
              content:
                "在客服机器人、服务机器人等场景中，与语音识别、自然语言处理等模块联动，打通人机交互的闭环。实现高品质的机器人发声，使得人机交互更流畅自然",
            },
            {
              title: "有声读物",
              name: "2",
              content:
                " 将电子教材、小说等文本材料，以文本文件的形式导入离线语音合成引擎，产生完整的可重复阅读的有声教材或者有声小说，方便用户随时取用。",
            },
            {
              title: "语音播报",
              name: "3",
              content:
                "在语音导航应用、新闻类 App 中，语音合成可以快速生成高质量的播报音频，实现在开车、走路等不方便阅读消息的情况下，音频消息的即时传达。",
            },
          ];
          break;
        //	录音文件识别结果轮询，阿里云本地(录音文件识别，阿里云本地第二个接口)
        case "recordingFileAsrCallbackWithAliyunLocal":
          this.form.text =
            RequestBody.recordingFileAsrCallbackWithAliyun.taskId;
          scope.setListFlag(["sentences"]);
          scope.labelTals.text = "taskId";
          break;
        //	录音文件识别，阿里云本地
        case "recordingFileAsrWithAliyunLocal":
          this.form.text =
            RequestBody.recordingFileAsrWithAliyunLocal.file_link;
          scope.setListFlag(["sentences"]);
          scope.labelTals.text = "录音文件远程地址";
          break;
        //		通用文字识别，高精度版，百度
        case "accurateBasicOcrWithBaidu":
          this.form.text = RequestBody.accurateBasicOcrWithBaidu.url;
          this.form.enableTenantWords = JSON.parse(
            RequestBody.accurateBasicOcrWithBaidu.paragraph
          );
          this.form.enableSystemWords = JSON.parse(
            RequestBody.accurateBasicOcrWithBaidu.probability
          );
          scope.setListFlag([
            "sentences",
            "enableTenantWords",
            "enableSystemWords",
          ]);
          scope.labelTals.text = "图片远程地址";
          scope.labelTals.enableTenantWords = "是否输出段落信息";
          scope.labelTals.enableSystemWords =
            "是否返回识别结果中每一行的置信度";
          scope.editableTabs = [
            {
              title: "拍照/截图识别",
              name: "1",
              content:
                "使用通用文字识别技术，实现拍照文字识别、相册图片文字识别和截图文字识别，可应用于搜索、书摘、笔记、翻译等移动应用中",
            },
            {
              title: "内容审核",
              name: "2",
              content:
                " 对各类文档进行结构化识别，如企业年报、论文、行业报告等",
            },
          ];
          break;
        //	办公文档识别，百度
        case "docAnalysisOfficeWithBaidu":
          this.form.text = RequestBody.docAnalysisOfficeWithBaidu.url;
          scope.setListFlag(["sentences"]);
          scope.labelTals.text = "文档远程地址";
          scope.editableTabs = [
            {
              title: "纸质文档电子化",
              name: "1",
              content:
                "识别提取各类医疗单据、金融财税票据、法律卷宗等纸质文档中的文字信息，并可基于位置信息进行比对、结构化处理，提高信息录入效率",
            },
            {
              title: "对办公场景文档识别",
              name: "2",
              content:
                " 对各类文档进行结构化识别，如企业年报、论文、行业报告等",
            },
          ];
          break;
        //	身份证识别（百度）
        case "idcardWithBaidu":
          this.form.text = RequestBody.idcardWithBaidu.url;
          this.form.id_card_side = RequestBody.idcardWithBaidu.id_card_side;
          scope.setListFlag(["sentences", "id_card_side"]);
          scope.labelTals.text = "身份证远程地址";
          scope.labelTals.id_card_side =
            "自动检测身份证正反面，如果传参指定方向与图片相反，支持正常识别";
          scope.editableTabs = [
            {
              title: "远程身份认证",
              name: "1",
              content:
                "结合OCR和人脸识别技术，实现对用户身份证件信息的自动识别和录入，同时通过人脸核身解决方案进行人脸识别和活体检测，完成用户身份验证",
            },
            {
              title: "金融服务",
              name: "2",
              content:
                " 结合多种卡证识别技术，实现对银行卡、个人信息及企业信息的自动识别和录入，有效降低用户输入成本，大幅度提升用户使用体验。",
            },
          ];
          break;
        //	语音识别
        case "asrForUploadFileWithHuilan":
          scope.setListFlag([]);
          scope.editableTabs = [
            {
              title: "会议访谈转写",
              name: "1",
              content:
                "将会议、访谈的长时间录音批量识别为文字，通过静音识别自动将有语音部分进行切分，提升识别效率，便于进行内容记录、总结，提升音频内容记录效率",
            },
            {
              title: "音频内容分析",
              name: "2",
              content:
                "将大量对话录音识别为文字，并对内容进行持续分析与监控，及时发现风险、违规内容，发掘潜在营销机会",
            },
            {
              title: "视频字幕",
              name: "3",
              content:
                "将视频中的音频进行语音识别，自动切分无语音部分，对每句话标记时间戳，通过时间戳生成对应字幕，提升配置字幕效率",
            },
          ];
          break;
        //	标签与短文本相似度计算
        case "tagSenSim":
          const arr = [];
          // const tagWords = RequestBody.tagSenSim.tagWords;
          const tagWords = { "公积金": 0.95, "提取,提,取出,取": null, "异地,外地": 1.0 };
          Object.keys(tagWords).map((v) => {
            let json = {
              tag: v,
              words: tagWords[v],
            };
            arr.push(json);
          });
          scope.tagSenSim.requstData = arr;
          let tagSenSimArr = ["公积金怎么提取", "在异地怎么提取公积金", "外地换证怎么办理", "我想异地提取"]
          this.form.targetSentenceList = tagSenSimArr
          scope.setListFlag(["targetSentenceList"]);
          scope.labelTals.text = "描述说明";
          scope.conParms.text = "计算源标签与目标短文本的相似度，并按相似度从高到低排序";
          scope.flags.tagSenSim = true;
          let jsonTagWords = { tagWords: {} };
          if (arr) {
            arr.map((v) => {
              jsonTagWords.tagWords[v.tag] = v.words;
            });
          }
          this.tagSenSim.params = jsonTagWords;
          scope.editableTabs = [
            {
              title: "信息检索",
              name: "1",
              content:
                "在很多应用中都需要根据文本来检索其相似文本，需求场景非常普遍。不仅适用于纯文本检索，还可以利用标签等来检索图片、视频",
            },
            {
              title: "新闻推荐",
              name: "2",
              content:
                "通过用户刚刚浏览的新闻标题，检索出其他的相似新闻推荐给用户。",
            },
            {
              title: "智能客服",
              name: "3",
              content:
                "用户输入一个问题时，自动为用户寻找相似的问题和答案。",
            },
          ];
          break;
        //	搜索结果词优先排名
        case "rankQueryResult":
          this.form.vueJson = RequestBody.rankQueryResult;
          scope.setListFlag(["vueJson"]);
          scope.labelTals.vueJson = "关键词优先级对搜索结果重新打分重新排名";
          break;
        //	依存句法分析服务
        case "dependencyParser":
          this.form.vueJson = RequestBody.dependencyParser;
          scope.setListFlag(["vueJson"]);
          scope.labelTals.vueJson = "关键词优先级对搜索结果重新打分重新排名";
          scope.conParms.text = "自动分析文本中的依存句法结构信息，实现对自然语言的精准理解";
          scope.editableTabs = [
            {
              title: "语言理解",
              name: "1",
              content: "通过分析用户Query的依存句法结构信息，抽取其中的语义主干及相关语义成分，帮助智能产品实现对用户意图的精准理解。",
            },
            {
              title: "知识发掘",
              name: "2",
              content: "对大规模非结构化文本数据进行句法结构分析，从中抽取实体、概念、语义关系等信息，帮助构建领域知识或世界知识。",
            },
            {
              title: "语言结构匹配",
              name: "3",
              content: "基于语言对(Query-WebTitle)之间的句法结构信息进行语言的匹配计算，帮助提升语义匹配计算的准确率",
            },
          ];
          break;

        //	chatgpt接口
        case "chatgptForOpenAi":
          // this.form.text = RequestBody.chatgptForOpenAi.input_text;
          // this.form.targetSentenceList = RequestBody.chatgptForOpenAi.history;
          // this.labelTals.text = "输入文本";
          // this.labelTals.targetSentenceList = "聊天历史句子";
          scope.setListFlag([]);
          scope.avueChatParams.RequestBody = RequestBody;
          scope.avueChatParams.label = scope.conParms.name
          scope.avueChatParams.message = '他改成她'
          scope.labelTals.vueJson = "关键词优先级对搜索结果重新打分重新排名";
          scope.conParms.text = "基于gpt-3.5-turbo模型，具备超强语言理解以及对话生成能力";
          scope.textSentence = true
          setTimeout(() => {
            scope.$refs.vueChat.init(this.avueChatParams);
          }, 500)
          scope.editableTabs = [
            {
              title: "客户服务",
              name: "1",
              content: "可以作为智能客服机器人，通过自动回复用户的问题，提高客户服务效率。",
            },
            {
              title: "内容生成",
              name: "2",
              content: "可以用于生成文章、博客、新闻稿等文本内容，提高创作效率。",
            },
            {
              title: "对话系统",
              name: "3",
              content: "可以为聊天应用、社交媒体平台、虚拟助手等提供智能对话功能",
            },
          ];
          break;
        //		文生图接口
        case "txtToImgForHuilan":
          this.form.text = RequestBody.txtToImgForHuilan.prompt;
          this.form.maxPerSentence = RequestBody.txtToImgForHuilan.batch_size;
          this.form.topN = RequestBody.txtToImgForHuilan.width;
          this.form.pitch = RequestBody.txtToImgForHuilan.height;
          this.labelTals.text = "输入文本";
          this.labelTals.maxPerSentence = "文本生成的图片的数量";
          this.labelTals.topN = "图片的宽度";
          this.labelTals.pitch = "图片的高度";
          scope.setListFlag(["sentences", "maxPerSentence", 'topN', 'pitch']);
          scope.labelTals.vueJson = "关键词优先级对搜索结果重新打分重新排名";
          scope.conParms.text = "中科汇联AIGC模型生成或处理图像";
          scope.editableTabs = [
            {
              title: "艺术创作",
              name: "1",
              content: "可以生成独特的艺术设计、素描和绘画，帮助艺术家更好地发挥自己的创造力和想象力。",
            },
            {
              title: "包装设计",
              name: "2",
              content: "可以生成独特的包装设计，帮助用户提高产品的吸引力和知名度。",
            },
            {
              title: "IP形象",
              name: "3",
              content: "可以根据用户提供的关键字和需求生成独特的IP形象，例如卡通人物、动物、机器人等，帮助用户打造自己的IP形象，提高品牌形象和知名度。",
            },
          ];
          break;
        //		汇联对话
        case "chatgptForHuilan":
          // this.form.text = RequestBody.chatgptForHuilan.input_text;
          // this.labelTals.text = "输入文本";
          scope.avueChatParams.RequestBody = RequestBody;
          scope.avueChatParams.label = scope.conParms.name
          scope.avueChatParams.message = '中国的首都'
          scope.textSentence = true
          scope.$nextTick(() => {
            scope.$refs.vueChat.init(this.avueChatParams);
          })
          scope.setListFlag([]);
          scope.conParms.text = "中科汇联AIGC对话模型，具备超强语言理解以及对话生成能力";
          scope.editableTabs = [
            {
              title: "客户服务",
              name: "1",
              content: "可以作为智能客服机器人，通过自动回复用户的问题，提高客户服务效率。",
            },
            {
              title: "内容生成",
              name: "2",
              content: "可以用于生成文章、博客、新闻稿等文本内容，提高创作效率。",
            },
            {
              title: "对话系统",
              name: "3",
              content: "可以为聊天应用、社交媒体平台、虚拟助手等提供智能对话功能。",
            },
          ];
          break;
      }
    },
    setListFlag(arr) {
      const scope = this;
      const flags = scope.flags;
      for (let key in flags) {
        scope.flags[key] = false;
      }
      arr.map((v) => {
        scope.flags[v] = true;
      });
    },
    closedFirst() {
      if (
        this.rowData.category1 === "machine" ||
        this.rowData.category1 === "nlp" || this.rowData.category1 === "gpt" || this.rowData.category1 === "voice" || this.rowData.category1 === 'image' || this.rowData.category1 === 'emotion'
      ) {
        this.$emit("nplHandl", this.rowData, "1");
      } else {
        this.$emit("naturalLanguageProcessing", this.rowData, "1");
      }
    },
    handleAvatarSuccess(res) {
      if (res.success) {
        this.$message.success("分析成功");
        const data = res.data.asr_msg;
        const source = JSON.parse(data).alternatives[0].transcript;
        this.txtsList = [source];
      }
    },
    beforeAvatarUpload(file) {
      this.setValRequstUpload(this.abilityCode, file);
    },
    setValRequstUpload(abilityCode, file) {
      const self = this;
      if (abilityCode === "asrForUploadFileWithHuilan") {
        let requstUpload = null;
        aiInterfaceParama.params.dataJson.map((v) => {
          if (Object.keys(v)[0] === abilityCode) {
            v[abilityCode].RequestBody.file = file;
            requstUpload = v[abilityCode].RequestBody;
          }
        });
        this.requstUpload = requstUpload;
      }
      if (
        abilityCode === "docAnalysisOfficeWithBaidu" ||
        abilityCode === "idcardWithBaidu" ||
        abilityCode === "accurateBasicOcrWithBaidu"
      ) {
        let requstUpload = null;
        aiInterfaceParama.params.dataJson.map((v) => {
          if (Object.keys(v)[0] === abilityCode) {
            const self = this;
            let fileReader = new FileReader();
            //读取本地文件图片并转换为Base64编码
            fileReader.readAsDataURL(file);
            // self.RequestBody.url = file.name;
            //读取完毕后自动调用
            fileReader.onload = function (e) {
              //获取文件内容结果
              v[abilityCode].RequestBody[abilityCode].image =
                e.target.result.split(",")[1];
              // this.RequestBody = {};
              self.sendRequst(v[abilityCode].RequestBody);
            };
            requstUpload = v[abilityCode].RequestBody;
          }
        });
        self.requstUpload = requstUpload;
      }
    },
    analysiSsoundFun() {
      //console.log(aiInterfaceParamaInit)
      const params = this.returnSelft(
        //"recordingFileAsrCallbackWithAliyun"
        this.selectCallbackKey
      );


      //params.recordingFileAsrCallbackWithAliyun.taskId = this.taskId;
      params[this.selectCallbackKey].taskId = this.taskId;
      this.sendRequst(params);
    },
    returnSelft(key) {
      //返回请求参数
      let data = {};

      aiInterfaceParama.params.dataJson.map((v) => {

        //console.log( key, Object.keys(v)[0]  )

        if (Object.keys(v)[0] == key) {

          data = v[key].RequestBody;
        }
      });

      return data;
    },
    httpRequest() {
      // const params = this.requstUpload;
      // this.sendRequst(params)
    },
    sendRequst(params) {
      const self = this;
      extractKeywordsFromTxt(params).then((res) => {
        const data = res.data;
        if (data.success) {
          self.$message.success("分析成功");
          if (
            self.abilityCode === "recordingFileAsrCallbackWithAliyunLocal" ||
            self.abilityCode === "recordingFileAsrWithAliyun"
          ) {
            self.txtsListAnalysisFlag = true;
            self.txtsListAnalysis = self.discoverArr(data.data, []);
          } else if (self.abilityCode === "idcardWithBaidu") {
            //身份证识别
            // self.txtsList = self.discoverArr(data.data, []);
            const splitArr = [
              data.data.words_result["失效日期"].words,
              data.data.words_result["签发日期"].words,
              data.data.words_result["签发机关"].words,
            ];

            self.txtsList = splitArr;
          } else if (self.abilityCode === "recordingFileAsrWithAliyunLocal") {
            const arr = data.data.sentences;
            self.txtsList = [arr[0].text];
          } else {
            //通用文字识别，高精度版，百度accurateBasicOcrWithBaidu
            // self.txtsList = self.discoverArr(data.data, []);
            const arr = [];
            data.data.words_result.map((v) => {
              arr.push(v.words);
            });
            self.txtsList = arr;
          }
        } else {
          self.$message.error(data.msg);
        }
      });
    },
    chilReData(data) {
      if (this.abilityCode === 'miningQA') {
        const arr = []
        data.map((v, i) => {
          let obj = {
            id: i + 1 + '',
            orderNo: i + 1,
            roleType: v.roleType,
            sentence: v.sentence,
          }
          arr.push(obj)
        })
        this.miningQA.option.responseData = arr
      } else {
        let json = { tagWords: {} };
        if (data) {
          data.map((v) => {
            json.tagWords[v.tag] = v.words;
          });
        }
        this.tagSenSim.params = json;
      }
    },
    openPreview(index = 0) {
      this.$ImagePreview(this.imgDatas, index, {
        closeOnClickModal: true,
        // click:(data,index)=>{
        //   this.$message.success('点击事件'+index)
        // },
        // beforeClose:()=>{
        //   this.$message.success('关闭回调')
        // }
      });
    },
    applicationReset(data) {
      this.rowData = data
    },
  },
};
</script>

<style lang="scss" scoped>
.leftMenu {
  /deep/ .el-menu-item-group__title {
    background: white;
  }
}

// .basic-container {
//   background-color: #ffffff;
//   box-shadow: 0px 6px 16px 4px rgba(6, 7, 46, 0.05);
//   border-radius: 10px;
//   border: solid 1px #eeeeee;
//   margin-bottom: 20px;
//   padding: 30px 40px;
//   padding-bottom: 0;
// }

.grid-content-top {
  .tit {
    font-family: SourceHanSansCN-Medium;
    font-size: 20px;
    font-weight: normal;
    font-stretch: normal;
    letter-spacing: 0px;
    color: #070b2d;
  }

  .txt {
    font-family: SourceHanSansCN-Normal;
    font-size: 16px;
    font-weight: normal;
    font-stretch: normal;
    letter-spacing: 0px;
    color: #565863;
    margin-top: 30px;
    margin-bottom: 10px;
  }

  .btnRi {
    float: right;
    // margin-right: 40px;
  }

  /deep/ .el-button {
    position: relative;
    right: 20px;
    width: 80px;
    margin-left: 20px;
  }
}

.grid-content-cen {
  .tit {
    display: block;
    font-family: SourceHanSansCN-Medium;
    font-size: 16px;
    font-weight: normal;
    font-stretch: normal;
    letter-spacing: 0px;
    color: #070b2d;
    margin-bottom: 10px;

    &-top {
      margin-bottom: 20px;
      margin-top: 20px;
      font-family: SourceHanSansCN-Normal;
      font-size: 16px;
      font-weight: normal;
      font-stretch: normal;
      letter-spacing: 0px;
      color: #070b2d;
    }
  }

  .txt {
    display: inline-block;
    font-family: SourceHanSansCN-Normal;
    font-size: 16px;
    font-weight: normal;
    font-stretch: normal;
    letter-spacing: 0px;
    color: #565863;
    float: right;

    >span {
      display: inline-block;
      margin-right: 8px;
    }
  }

  .area {
    margin-top: 20px;
  }

  .sele {
    margin-top: 20px;

    .le {
      font-family: SourceHanSansCN-Normal;
      font-size: 16px;
      font-weight: normal;
      font-stretch: normal;
      letter-spacing: 0px;
      color: #565863;
      display: inline-block;
      margin-right: 20px;
    }
  }

  .btn {
    margin-top: 20px;
  }

  .hr {
    border: none;
    height: 1px;
    background: #eee;
    margin-top: 30px;
  }

  .tag {
    margin-top: 20px;

    .txts {
      margin-bottom: 20px;
      font-family: SourceHanSansCN-Medium;
      font-size: 20px;
      font-weight: normal;
      font-stretch: normal;
      letter-spacing: 0px;
      color: #070b2d;
    }

    .el-tags {
      margin-right: 8px;
      margin-bottom: 12px;
    }
  }

  .el-tag {
    font-family: SourceHanSansCN-Normal;
    font-size: 14px;
    font-weight: normal;
    font-stretch: normal;
    letter-spacing: 0px;
    color: #205ac8;
    border-radius: 16px;
    background-color: #ecf3ff;
    border-radius: 16px;
    height: auto;
    max-width: 49.5%;
    word-wrap: break-word;
    word-break: normal;
    white-space: normal;
  }

  .btnRi-bei {}

  .audio {
    margin-top: 10px;
  }
}

.analysisBtn {
  margin-top: 10px;
}

.grid-content-botto {
  margin-bottom: 50px;

  .title {
    margin-bottom: 20px;
  }

  .colu-cen-tit {
    font-family: SourceHanSansCN-Medium;
    font-size: 20px;
    font-weight: normal;
    font-stretch: normal;
    letter-spacing: 0px;
    color: #070b2d;
  }

  .colu-cen-txt {
    display: inline-block;
    font-family: SourceHanSansCN-Normal;
    font-size: 16px;
    font-weight: normal;
    font-stretch: normal;
    letter-spacing: 0px;
    color: #565863;
    margin-top: 30px;
  }
}

.grid-content-botto {
  .title {
    font-family: SourceHanSansCN-Medium;
    font-size: 20px;
    font-weight: normal;
    font-stretch: normal;
    letter-spacing: 0px;
    color: #070b2d;
  }

  .grid-content-txt {
    font-family: SourceHanSansCN-Normal;
    font-size: 16px;
    font-weight: normal;
    font-stretch: normal;
    line-height: 32px;
    letter-spacing: 0px;
    color: #565863;
  }

  /deep/ .el-tabs__item:hover {
    font-size: 16px;
    font-weight: normal;
    color: #070b2d;
    font-family: SourceHanSansCN-Normal;
  }

  /deep/ .el-tabs__item.is-active {
    font-size: 16px;
    font-weight: normal;
    color: #070b2d;
    font-family: SourceHanSansCN-Normal;
  }

  /deep/ .el-tabs__item {
    font-size: 16px;
    font-weight: normal;
    color: #95979f;
    font-family: SourceHanSansCN-Normal;
  }

  /deep/ .el-tabs__active-bar {
    background-color: #003394;
  }
}

/deep/ .el-submenu .el-menu-item {
  padding-right: 0;
}

/deep/ .el-switch__label.is-active {
  color: #303133;
}

/deep/ .el-upload-dragger {
  width: 140px;
  height: 60px;
}

/deep/ .el-upload-dragger .el-upload__text {
  font-size: 12px;
  position: relative;
  top: -12px;
}

.upload-demo {
  width: 50%;
}

/deep/ .jsoneditor-poweredBy {
  display: none;
}

/deep/ .jsoneditor-outer {
  height: 250px;
}

/deep/ .el-upload-list__item-name [class^="el-icon"] {
  display: none;
}
</style>
