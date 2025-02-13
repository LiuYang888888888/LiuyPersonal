<template>
  <el-row style="margin: 0; padding: 0;position: relative;left: -10px">
    <el-col span="4" class="leftMenu">
      <LeftMenuTree ref="leftMenuTree" :category1="category1" :category2="abilityRowData.category2" @nodeTreetab="nodeTreetab">
      </LeftMenuTree>
    </el-col>
    <el-col span="20" class="rightCrud">
      <basic-container style="margin: 20px 10px;padding: 0;">
        <div class="topText">
          <div class="tit">
            <span>{{ experienceJson.title }}</span>
            <span>
              <el-button size="small" type="primary" @click="interDoc" v-if="emptyBtn">接口文档</el-button>
              <el-button size="small" type="warning" @click="sence" v-if="emptyBtn">使用场景</el-button>
              <el-button size="small" type="" @click="superior">返回上一级</el-button>
            </span>
          </div>
          <div class="tex">{{ experienceJson.description }}</div>
        </div>
        <div class="argumentSet">
          <ArgumentSet ref="argumentSet" @resultData="resultData" @jsonResultClear="jsonResultClear" />
          <VueChat ref="vueChat" v-if="category === 'gpt' && abilityCode !== 'txtToImgForHuilan'" />
          <AnalysisResult ref="analysisResult" v-else />
          <UsageScenarioDiolog :senceList="experienceJson.editableTabs" ref="usageScenarioDiolog" />
        </div>
      </basic-container>
    </el-col>
  </el-row>
</template>

<script>
import LeftMenuTree from "./conponent/leftMenuTree.vue";
import ArgumentSet from "./conponent/argumentSet.vue";
import AnalysisResult from "./conponent/analysisResult.vue";
import UsageScenarioDiolog from "./conponent/usageScenarioDiolog.vue";
import VueChat from "./vueChat.vue";
import {
  getHuilanAiApplicationAbilityRelationByApplicationId,
} from "@/api/configure/application";
import aiInterfaceParama from "@/util/aiInterfaceParama"
import { mapState } from 'vuex'
var extractSummary_size = (rule, value, callback) => {  // eslint-disable-line
  if (value <= 0) {
    callback(new Error('请输入大于0的整数'));
  } else {
    callback();
  }
};
var tagSenSim_targetSentenceList = (rule, value, callback) => {  // eslint-disable-line
  let flug = true
  value.map(v => {
    if (!v) {
      flug = false
    }
  })
  if (!flug) {
    callback(new Error('请检查是否有空数据'));
  } else {
    callback();
  }
};
export default {
  name: "abilityExperience",
  components: {
    LeftMenuTree,
    ArgumentSet,
    AnalysisResult,
    UsageScenarioDiolog,
    VueChat,
  },
  props: {
    rowDataPage: {
      type: Object,
      default: () => {
        return {}
      }
    }
  },
  data() {
    // const self = this;

    return {
      abilityRowData: {},
      applyRowData: {},
      headerTitle: '',
      category1: '',  //能力管理体验跳转判左侧tree类型
      category: '',   //左侧树点击事件判断当前点击的能力类型
      abilityCode: '',
      emptyBtn: true,
      rowData: {},
      menuList: [],
      experienceJson: {
        title: '',
        description: '',
        editableTabs: [],
      },
    };
  },
  mounted() {
  },
  computed: {
    ...mapState({
      curentRouterPage(state) {
        return state.aiMagement.curentRouterPage
      },
    }),
  },
  methods: {
    applicationReset(data) {
      // const self = this
      switch (data.headerTitle) {
        case 'ability':
          this.headerTitle = 'ability'
          this.category1 = data.category1
          this.category = data.category1
          this.$refs.leftMenuTree.setCurrentKey(data.id)
          this.abilityRowData = data
          break
        case 'apply':
          this.headerTitle = 'apply'
          this.category1 = data.category1
          this.category = data.category1
          this.$refs.leftMenuTree.setCurrentKey(data.id)
          this.applyRowData = data
          this.appwichAbility(data.id)
          break
      }
      this.rowData = { ...this.rowData, headerTitle: this.headerTitle }
    },
    sence() {
      this.$refs.usageScenarioDiolog.init()
    },
    nodeTreetab(row) {
      this.category = row.category1
      this.abilityCode = row.code
      this.setVal(row)
      this.rowData = { ...this.rowData, ...row }
      if (this.$refs.analysisResult) {
        this.$refs.analysisResult.clearResolt()
      }
    },
    superior() {
      console.log(this.curentRouterPage)
      if (this.headerTitle === 'ability' || this.rowData.headerTitle === 'ability' || this.curentRouterPage === 'ability') {
        this.$emit('nplHandl', this.abilityRowData, '1')
      }
      if (this.headerTitle === 'apply' || this.rowData.headerTitle === 'apply' || this.curentRouterPage === 'apply') {
        this.$emit('naturalLanguageProcessing', this.applyRowData, '1')
      }
    },
    setVal(row) {
      // const self = this;
      const abilityCode = row.code
      let RequestBody = {};
      aiInterfaceParama.params.dataJson.map((v) => {
        if (Object.keys(v)[0] === abilityCode) {
          RequestBody = v[abilityCode].RequestBody;
        }
      });
      const imgList = []
      let column = []
      let para = {}
      let data = {}
      switch (abilityCode) {
        case "splitSentences":
          // 分词
          this.experienceJson.title = row.name
          this.experienceJson.description = '将句子中的词语进行拆分'

          if (RequestBody.result && RequestBody.result.url) {
            imgList.push(RequestBody.result.url)
          }
          this.experienceJson.editableTabs = [
            {
              title: "语音指令解析",
              name: "1",
              content:
                "以分词词性标注为基础，分析语音命令中的关键名称、动词、数量、时间等，准确理解命令的含义，提高用户体验",
              imgList,

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
          column = [
            {
              label: "描述说明",
              prop: "sentences",
              span: 24,
              type: 'array',
              labelPosition: 'top',
              value: RequestBody[abilityCode].sentences,
              rules: [{
                required: true,
                message: "请输入描述说明",
                trigger: "blur"
              }
              ]
            }
          ]
          para = {
            abilityCode: RequestBody['abilityCode'],
            [abilityCode]: {
              tenantId: "000000"
            }
          }
          data = {
            column,
            para,
            RequestBody,
            primitiveData: {
              sentences: RequestBody[abilityCode].sentences,
            }
          }
          this.$refs.argumentSet.init(data)
          break;
        case "discoverNewWords":
          // 新词发现
          this.experienceJson.title = row.name
          this.experienceJson.description = '对已有语料进行挖掘，从中识别出新词'
          if (RequestBody.result && RequestBody.result.url) {
            imgList.push(RequestBody.result.url)
          }
          this.experienceJson.editableTabs = [
            {
              title: "语音指令解析",
              name: "1",
              content:
                "以分词词性标注为基础，分析语音命令中的关键名称、动词、数量、时间等，准确理解命令的含义，提高用户体验",
              imgList,
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
          ]
          column = [
            {
              label: "高要求新词的凝聚度阈值,必须大于等于50,默认500",
              prop: "highSolidRateThreshold",
              span: 24,
              min: 50,
              type: 'number',
              precision: 0,
              labelPosition: 'top',
              value: RequestBody[abilityCode].highSolidRateThreshold,
              rules: [{
                required: true,
                message: "请输入大于50整数",
                trigger: "blur"
              }
              ]
            },
            {
              label: "高要求新词的自由度阈值,必须大于等于2.54,默认2.54",
              prop: "highEntropyRateThreshold",
              span: 24,
              type: 'number',
              value: RequestBody[abilityCode].highEntropyRateThreshold,
              min: 2.54,
              labelPosition: 'top',
              step: 0.01,
              precision: 2,
              rules: [{
                required: true,
                message: "请输入大于等于2.54小数",
                trigger: "blur"
              }
              ]
            },
            {
              label: "新词发现的文本内容",
              prop: "txt",
              span: 24,
              type: 'textarea',
              minRows: 3,
              value: RequestBody[abilityCode].txt,
              labelPosition: 'top',
              rules: [{
                required: true,
                message: "请输入文本内容",
                trigger: "blur"
              }
              ]
            },
          ]
          para = {
            abilityCode: RequestBody['abilityCode'],
            [abilityCode]: {
              tenantId: "000000"
            }
          }
          data = {
            column,
            para,
            RequestBody,
            primitiveData: {
              highSolidRateThreshold: RequestBody[abilityCode].highSolidRateThreshold,
              highEntropyRateThreshold: RequestBody[abilityCode].highEntropyRateThreshold,
              txt: RequestBody[abilityCode].txt,
            }
          }
          this.$refs.argumentSet.init(data)
          break
        case "extractKeywordsFromTxt":
          //关键词提取
          this.experienceJson.title = row.name
          this.experienceJson.description = '从文本中自动提取出关键词'
          if (RequestBody.result && RequestBody.result.url) {
            imgList.push(RequestBody.result.url)
          }
          this.experienceJson.editableTabs = [
            {
              title: "个性化推荐",
              name: "1",
              content:
                "通过对文章的关键词计算，结合用户画像，精准的对用户进行个性化推荐",
              imgList,
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
          ]
          column = [
            {
              label: "每句提取多少个关键词",
              prop: "maxPerSentence",
              span: 24,
              min: 1,
              type: 'number',
              precision: 0,
              labelPosition: 'top',
              value: RequestBody[abilityCode].maxPerSentence,
              rules: [{
                required: true,
                message: "请输入每句提取多少个关键词",
                trigger: "blur"
              }
              ]
            },
            {
              label: "最多显示关键词次数",
              prop: "topN",
              span: 24,
              type: 'number',
              value: RequestBody[abilityCode].topN,
              min: 1,
              labelPosition: 'top',
              precision: 0,
              rules: [{
                required: true,
                message: "请输入最多显示关键词次数",
                trigger: "blur"
              }
              ]
            },
            {
              label: "关键词提取文本内容",
              prop: "text",
              span: 24,
              type: 'textarea',
              minRows: 3,
              value: RequestBody[abilityCode].text,
              labelPosition: 'top',
              rules: [{
                required: true,
                message: "请输入文本内容",
                trigger: "blur"
              }
              ]
            },
          ]
          para = {
            abilityCode: RequestBody['abilityCode'],
            [abilityCode]: {
              tenantId: "000000"
            }
          }
          data = {
            column,
            para,
            RequestBody,
            primitiveData: {
              maxPerSentence: RequestBody[abilityCode].maxPerSentence,
              topN: RequestBody[abilityCode].topN,
              text: RequestBody[abilityCode].text,
            }
          }
          this.$refs.argumentSet.init(data)
          break
        case "extractEntities":
          //实体提取
          this.experienceJson.title = row.name
          this.experienceJson.description = '识别文本中的实体，进而挖掘各实体间的关系'
          if (RequestBody.result && RequestBody.result.url) {
            imgList.push(RequestBody.result.url)
          }
          this.experienceJson.editableTabs = [
            {
              title: "文本搜索",
              name: "1",
              content:
                "帮助用户快速查找到期望检索相关内容",
              imgList,
            },
            {
              title: "舆情分析",
              name: "2",
              content:
                "挖掘用户评论的核心问题，跟踪产品口碑",
            },
            {
              title: "知识库构建",
              name: "3",
              content:
                "根据实体之间、实体与关键词之间的关联，构建相关的知识库",
            },
          ]
          column = [
            {
              label: "实体词提取文本内容",
              prop: "sentence",
              span: 24,
              type: 'textarea',
              minRows: 3,
              value: RequestBody[abilityCode].sentence,
              labelPosition: 'top',
              rules: [{
                required: true,
                message: "请输入提取内容",
                trigger: "blur"
              }
              ]
            },
          ]
          para = {
            abilityCode: RequestBody['abilityCode'],
            [abilityCode]: {
              tenantId: "000000"
            }
          }
          data = {
            column,
            para,
            RequestBody,
            primitiveData: {
              sentence: RequestBody[abilityCode].sentence,
            }
          }
          this.$refs.argumentSet.init(data)
          break
        case "charDetect":
          //语种识别
          this.experienceJson.title = row.name
          this.experienceJson.description = '识别文本所属语种'
          if (RequestBody.result && RequestBody.result.url) {
            imgList.push(RequestBody.result.url)
          }
          this.experienceJson.editableTabs = [
            {
              title: "文本检测",
              name: "1",
              content:
                "检测文本语种，用于文本处理",
              imgList,
            },
          ]
          column = [
            {
              label: "语言检测文本内容",
              prop: "text",
              span: 24,
              // type: 'text',
              value: RequestBody[abilityCode].text,
              labelPosition: 'top',
              rules: [{
                required: true,
                message: "请输入内容",
                trigger: "blur"
              }
              ]
            },
          ]
          para = {
            abilityCode: RequestBody['abilityCode'],
            [abilityCode]: {
              tenantId: "000000"
            }
          }
          data = {
            column,
            para,
            RequestBody,
            primitiveData: {
              text: RequestBody[abilityCode].text,
            }
          }
          this.$refs.argumentSet.init(data)
          break
        case "findSensitiveWords":
          //敏感词过滤
          this.experienceJson.title = row.name
          this.experienceJson.description = '识别文本中的敏感词'
          if (RequestBody.result && RequestBody.result.url) {
            imgList.push(RequestBody.result.url)
          }
          this.experienceJson.editableTabs = [
            {
              title: "用户评论过滤",
              name: "1",
              content:
                "适用于直播弹幕、社区论坛留言等，对用户评论信息进行检测，一旦发现用户提交违规内容，进行自动审核与实时过滤，保证产品良好用户体验",
              imgList,
            },
            {
              title: "用户评论过滤",
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
          ]
          column = [
            {
              label: "文本内容",
              prop: "sentences",
              span: 24,
              type: 'array',
              value: RequestBody[abilityCode].sentences,
              labelPosition: 'top',
              rules: [{
                required: true,
                message: "请输入内容",
                trigger: "blur"
              }
              ]
            },
          ]
          para = {
            abilityCode: RequestBody['abilityCode'],
            [abilityCode]: {
              ...RequestBody[abilityCode]
            }
          }
          data = {
            column,
            para,
            RequestBody,
            primitiveData: {
              sentences: RequestBody[abilityCode].sentences,
            }
          }
          this.$refs.argumentSet.init(data)
          break
        case "syntacticAnalysis":
          //句法分析
          this.experienceJson.title = row.name
          this.experienceJson.description = '自动分析文本中的依存句法结构信息，实现对自然语言的精准理解'
          if (RequestBody.result && RequestBody.result.url) {
            imgList.push(RequestBody.result.url)
          }
          this.experienceJson.editableTabs = [
            {
              title: "智能问答系统",
              name: "1",
              content:
                "通过中文分词、短文本相似度、命名实体识别等自然语言处理相关技术，计算两个问题对的相似度，可解决问答、对话、语料挖掘、知识库构建等问题",
              imgList,
            },
            {
              title: "舆情分析",
              name: "2",
              content:
                "通过关键词提取、文本聚类、主题挖掘等算法模型，挖掘突发事件、舆论导向，进行话题发现、趋势发现、舆情分析等。多维度分析情绪、热点、趋势、传播途径等，及时全面的掌握舆情动态",
            },
          ]
          column = [
            {
              label: "句⼦文本内容",
              prop: "sentence",
              span: 24,
              // type: 'text',
              value: RequestBody[abilityCode].sentence,
              labelPosition: 'top',
              rules: [{
                required: true,
                message: "请输入内容",
                trigger: "blur"
              }
              ]
            },
          ]
          para = {
            abilityCode: RequestBody['abilityCode'],
            [abilityCode]: {
              tenantId: "000000"
            }
          }
          data = {
            column,
            para,
            RequestBody,
            primitiveData: {
              sentence: RequestBody[abilityCode].sentence,
            }
          }
          this.$refs.argumentSet.init(data)
          break
        case "sentenceCluster":
          //句子聚类
          this.experienceJson.title = row.name
          this.experienceJson.description = '对一批句子进行聚类分析，把多个句子按照语义划分到不同类别'
          if (RequestBody.result && RequestBody.result.url) {
            imgList.push(RequestBody.result.url)
          }
          this.experienceJson.editableTabs = [
            {
              title: "自主对话系统",
              name: "1",
              content:
                "对用户问题句子进行聚类，分析出用户总体的意图分布，并提炼出相对应的标准问题句子和答案句子用于线上应答",
              imgList,
            },
          ]
          column = [
            {
              label: "短文本相似句子",
              prop: "sentences",
              span: 24,
              type: 'array',
              value: RequestBody[abilityCode].sentences,
              labelPosition: 'top',
              rules: [{
                required: true,
                message: "请输入内容",
                trigger: "blur"
              }
              ]
            },
          ]
          para = {
            abilityCode: RequestBody['abilityCode'],
            [abilityCode]: {
              tenantId: "000000"
            }
          }
          data = {
            column,
            para,
            RequestBody,
            primitiveData: {
              sentences: RequestBody[abilityCode].sentences,
            }
          }
          this.$refs.argumentSet.init(data)
          break
        case "extractSummary":
          //摘要提取
          this.experienceJson.title = row.name
          this.experienceJson.description = '提取文章的摘要内容'
          if (RequestBody.result && RequestBody.result.url) {
            imgList.push(RequestBody.result.url)
          }
          this.experienceJson.editableTabs = [
            {
              title: "新闻摘要",
              name: "1",
              content:
                "自动提取文本中的核心内容，形成摘要信息并展示或推送给用户，吸引用户点击并提升用户阅读效率",
              imgList,
            },
            {
              title: "智能写作",
              name: "2",
              content:
                "通过对大量的新闻文本进行语义分析和快速摘要，可以快速形成热点汇总类、新闻聚合类、事件盘点类的新闻稿件，进行自动写作和辅助写作，提升新闻生产效率",
            },
          ]
          column = [
            {
              label: "摘要句数",
              prop: "size",
              span: 24,
              min: 1,
              type: 'number',
              precision: 0,
              labelPosition: 'top',
              value: RequestBody[abilityCode].size,
              rules: [{
                required: true,
                message: "请输入大于0整数",
                trigger: "blur"
              },
              { validator: extractSummary_size, trigger: 'blur' }
              ]
            },
            {
              label: "摘要文本内容",
              prop: "text",
              span: 24,
              type: 'textarea',
              minRows: 3,
              value: RequestBody[abilityCode].text,
              labelPosition: 'top',
              rules: [{
                required: true,
                message: "请输入内容",
                trigger: "blur"
              },
              ]
            },
          ]
          para = {
            abilityCode: RequestBody['abilityCode'],
            [abilityCode]: {
              tenantId: "000000"
            }
          }
          data = {
            column,
            para,
            RequestBody,
            primitiveData: {
              size: RequestBody[abilityCode].size,
              text: RequestBody[abilityCode].text,
            }
          }
          this.$refs.argumentSet.init(data)
          break
        case "miningQA":
          //摘要提取
          this.experienceJson.title = row.name
          this.experienceJson.description = '从聊天记录或文档中挖掘出问题和答案'
          if (RequestBody.result && RequestBody.result.url) {
            imgList.push(RequestBody.result.url)
          }
          this.experienceJson.editableTabs = [
            {
              title: "知识提取",
              name: "1",
              content:
                "自动挖掘整理文中的新的知识点，提高知识加工的工作效率",
              imgList,
            },
            {
              title: "智能客服",
              name: "2",
              content:
                "用户输入一个问题时，自动为用户寻找相似的问题和答案",
            },
          ]
          column = [
          ]
          para = {
            abilityCode: RequestBody['abilityCode'],
            [abilityCode]: {
              tenantId: "000000",
              "type": "1",
            }
          }
          data = {
            type: 'table',
            column,
            para,
            RequestBody,
            primitiveData: {
            }
          }
          this.$refs.argumentSet.init(data)
          break
        case "splitToSentences":
          //分句
          this.experienceJson.title = row.name
          this.experienceJson.description = '将文档切分为句子'
          if (RequestBody.result && RequestBody.result.url) {
            imgList.push(RequestBody.result.url)
          }
          this.experienceJson.editableTabs = [
            {
              title: "个性化推荐",
              name: "1",
              content:
                "通过对文章的标签计算，结合用户画像，精准的对用户进行个性化推荐",
              imgList,
            },
            {
              title: "话题集合",
              name: "2",
              content:
                "根据文章计算的标签，聚合相同标签的文章，便于用户对同一话题的文章进行全方位的信息阅读",
            },
          ]
          column = [
            {
              label: "请输入文本内容",
              prop: "text",
              span: 24,
              type: 'textarea',
              minRows: 3,
              value: RequestBody[abilityCode].text,
              labelPosition: 'top',
              rules: [{
                required: true,
                message: "请输入内容",
                trigger: "blur"
              }
              ]
            },
          ]
          para = {
            abilityCode: RequestBody['abilityCode'],
            [abilityCode]: {
              tenantId: "000000",
              "normalizeFlag": false,
            }
          }
          data = {
            column,
            para,
            RequestBody,
            primitiveData: {
              text: RequestBody[abilityCode].text,
            }
          }
          this.$refs.argumentSet.init(data)
          break
        case "senSim":
          //短文本相似度计算
          this.experienceJson.title = row.name
          this.experienceJson.description = '计算文本和文本之间的相似度'
          if (RequestBody.result && RequestBody.result.url) {
            imgList.push(RequestBody.result.url)
          }
          this.experienceJson.editableTabs = [
            {
              title: "信息检索",
              name: "1",
              content:
                "在很多应用中都需要根据文本来检索其相似文本，需求场景非常普遍。不仅适用于纯文本检索，还可以利用标签等来检索图片、视频",
              imgList,
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
              content:
                "用户输入一个问题时，自动为用户寻找相似的问题和答案",
            },
          ]
          column = [
            {
              label: "短文单个句子文本内容",
              prop: "sourceSentence",
              span: 24,
              type: 'textarea',
              minRows: 3,
              value: RequestBody[abilityCode].sourceSentence,
              labelPosition: 'top',
              rules: [{
                required: true,
                message: "请输入内容",
                trigger: "blur"
              }
              ]
            },
            {
              label: "短文多句文本内容",
              prop: "targetSentenceList",
              span: 24,
              type: 'array',
              value: RequestBody[abilityCode].targetSentenceList,
              labelPosition: 'top',
              rules: [{
                required: true,
                message: "请输入内容",
                trigger: "blur"
              }
              ]
            },
          ]
          para = {
            abilityCode: RequestBody['abilityCode'],
            [abilityCode]: {
              tenantId: "000000",
            }
          }
          data = {
            column,
            para,
            RequestBody,
            primitiveData: {
              sourceSentence: RequestBody[abilityCode].sourceSentence,
              targetSentenceList: RequestBody[abilityCode].targetSentenceList,
            }
          }
          this.$refs.argumentSet.init(data)
          break
        case "mathCompute":
          //NLP数学计算器
          this.experienceJson.title = row.name
          this.experienceJson.description = '对文本内容中的数学公式进行理解并得出对应答案'
          if (RequestBody.result && RequestBody.result.url) {
            imgList.push(RequestBody.result.url)
          }
          this.experienceJson.editableTabs = [
            {
              title: "作业批改",
              name: "1",
              content:
                "检查作业中的数学公式，并得出计算结论和实际结果进行比较",
              imgList,
            },
            {
              title: "辅助学习",
              name: "2",
              content:
                "可以将口语表达的数学公式，转化为符号形式，并得出答案，进行辅助教学和指导",
            },
          ]
          column = [
            {
              label: "NLP数学计算器文本内容",
              prop: "sentence",
              span: 24,
              type: 'textarea',
              minRows: 3,
              value: RequestBody[abilityCode].sentence,
              labelPosition: 'top',
              rules: [{
                required: true,
                message: "请输入内容",
                trigger: "blur"
              }
              ]
            },
          ]
          para = {
            abilityCode: RequestBody['abilityCode'],
            [abilityCode]: {
              tenantId: "000000",
            }
          }
          data = {
            column,
            para,
            RequestBody,
            primitiveData: {
              sentence: RequestBody[abilityCode].sentence,
            }
          }
          this.$refs.argumentSet.init(data)
          break
        case "miningWordCoOccurrences":
          //挖掘词共现(可作为知识点，也可作为标签)
          this.experienceJson.title = row.name
          this.experienceJson.description = '在一组句子中，分析挖掘出共现词'
          if (RequestBody.result && RequestBody.result.url) {
            imgList.push(RequestBody.result.url)
          }
          this.experienceJson.editableTabs = [
            {
              title: "新闻人物信息提取",
              name: "1",
              content:
                "以定制词表为基础，提取新闻源中涉及到的参会代表的人名和机构名、职务等，进行精准匹配，为所有参会代表提供专属的新闻档案",
              imgList,
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
          ]
          column = [
            {
              label: "挖掘词共现文本内容",
              prop: "sentences",
              span: 24,
              type: 'array',
              minRows: 3,
              value: RequestBody[abilityCode].sentences,
              labelPosition: 'top',
              rules: [{
                required: true,
                message: "请输入内容",
                trigger: "blur"
              }
              ]
            },
          ]
          para = {
            abilityCode: RequestBody['abilityCode'],
            [abilityCode]: {
              tenantId: "000000",
            }
          }
          data = {
            column,
            para,
            RequestBody,
            primitiveData: {
              sentences: RequestBody[abilityCode].sentences,
            }
          }
          this.$refs.argumentSet.init(data)
          break
        case "extractTags":
          //标签提取
          this.experienceJson.title = row.name
          this.experienceJson.description = '从文本中提取标签，对文章进行核心关键词分析'
          if (RequestBody.result && RequestBody.result.url) {
            imgList.push(RequestBody.result.url)
          }
          this.experienceJson.editableTabs = [
            {
              title: "个性化推荐",
              name: "1",
              content:
                "通过对文章的关键词计算，结合用户画像，精准的对用户进行个性化推荐话题聚合：根据文章计算的关键词，聚合相同关键词的文章，便于用户对同一话题的文章进行全方位的信息阅读",
              imgList,
            },
            {
              title: "文章搜索",
              name: "2",
              content:
                "通过对文章关键词提取，完成搜索关键词与文章内容的精准匹配",
            },
          ]
          column = [
            {
              label: "标签提取个数(标签个数为大于0整数)",
              prop: "topN",
              span: 24,
              type: 'number',
              min: 1,
              precision: 0,
              value: RequestBody[abilityCode].topN,
              labelPosition: 'top',
              rules: [{
                required: true,
                message: "请输入标签提取个数",
                trigger: "blur"
              }
              ]
            },
            {
              label: "标签提取文本内容",
              prop: "text",
              span: 24,
              type: 'textarea',
              minRows: 3,
              value: RequestBody[abilityCode].text,
              labelPosition: 'top',
              rules: [{
                required: true,
                message: "请输入内容",
                trigger: "blur"
              }
              ]
            },
          ]
          para = {
            abilityCode: RequestBody['abilityCode'],
            [abilityCode]: {
              tenantId: "000000",
            }
          }
          data = {
            column,
            para,
            RequestBody,
            primitiveData: {
              topN: RequestBody[abilityCode].topN,
              text: RequestBody[abilityCode].text,
            }
          }
          this.$refs.argumentSet.init(data)
          break
        case "extractYearMonth":
          //提取年月日
          this.experienceJson.title = row.name
          this.experienceJson.description = '提取文本内容中提到的关于日期的信息'
          if (RequestBody.result && RequestBody.result.url) {
            imgList.push(RequestBody.result.url)
          }
          this.experienceJson.editableTabs = [
            {
              title: "信息检索",
              name: "1",
              content:
                "对通篇文章进行检索，找到日期相关的关键信息",
              imgList,
            },
            {
              title: "报表处理",
              name: "2",
              content:
                "结构化处理报表等带有时间属性的文件",
            },
          ]
          column = [
            {
              label: "提取年月日文本内容",
              prop: "sentence",
              span: 24,
              // type: 'number',
              value: RequestBody[abilityCode].sentence,
              labelPosition: 'top',
              rules: [{
                required: true,
                message: "请输入文本内容",
                trigger: "blur"
              }
              ]
            },
          ]
          para = {
            abilityCode: RequestBody['abilityCode'],
            [abilityCode]: {
              tenantId: "000000",
            }
          }
          data = {
            column,
            para,
            RequestBody,
            primitiveData: {
              sentence: RequestBody[abilityCode].sentence,
            }
          }
          this.$refs.argumentSet.init(data)
          break
        case "simHash":
          //计算文本的SimHash
          this.experienceJson.title = row.name
          this.experienceJson.description = '计算文本的SimHash'
          if (RequestBody.result && RequestBody.result.url) {
            imgList.push(RequestBody.result.url)
          }
          this.experienceJson.editableTabs = [
            {
              title: "文章去重",
              name: "1",
              content:
                "定位文章中的相似内容，用于相似内容去重",
              imgList,
            },
            {
              title: "文本相似度计算",
              name: "2",
              content:
                "用户输入一个问题时，自动为用户寻找相似的问题和答案",
            },
          ]
          column = [
            {
              label: "计算文本的SimHash文本内容",
              prop: "text",
              span: 24,
              type: 'textarea',
              minRows: 3,
              value: RequestBody[abilityCode].text,
              labelPosition: 'top',
              rules: [{
                required: true,
                message: "请输入文本内容",
                trigger: "blur"
              }
              ]
            },
          ]
          para = {
            abilityCode: RequestBody['abilityCode'],
            [abilityCode]: {
              tenantId: "000000",
            }
          }
          data = {
            column,
            para,
            RequestBody,
            primitiveData: {
              text: RequestBody[abilityCode].text,
            }
          }
          this.$refs.argumentSet.init(data)
          break
        case "runLuaScript":
          //执行lua脚本
          this.experienceJson.title = row.name
          this.experienceJson.description = '成分句法分析就是找到一个句子的组成成分'
          if (RequestBody.result && RequestBody.result.url) {
            imgList.push(RequestBody.result.url)
          }
          this.experienceJson.editableTabs = [
            {
              title: "语义理解",
              name: "1",
              content:
                "通过分析一段话的句法结构，提取其主干信息，帮助更好的理解用户意图。",
              imgList,
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
          ]
          column = [
            {
              label: "脚本",
              prop: "text",
              span: 24,
              type: 'textarea',
              minRows: 3,
              value: RequestBody[abilityCode].inputs.text,
              labelPosition: 'top',
              rules: [{
                required: true,
                message: "请输入文本内容",
                trigger: "blur"
              }
              ]
            },
            {
              label: "脚本传参",
              prop: "q",
              span: 24,
              type: 'textarea',
              minRows: 3,
              value: RequestBody[abilityCode].inputs.q,
              labelPosition: 'top',
              rules: [{
                required: true,
                message: "请输入文本内容",
                trigger: "blur"
              }
              ]
            },
          ]
          // para = {
          //   abilityCode: RequestBody['abilityCode'],
          //   [abilityCode]: {
          //     tenantId: "000000",
          //   }
          // }
          para = {
            abilityCode: RequestBody['abilityCode'],
            ifTest: "true",
            [abilityCode]: {
              ...RequestBody[RequestBody['abilityCode']],
            }
          }
          data = {
            column,
            para,
            RequestBody,
            type: 'json',
            primitiveData: {
              text: RequestBody[abilityCode].inputs.text,
              q: RequestBody[abilityCode].inputs.q,
            }
          }
          this.$refs.argumentSet.init(data)
          break
        case "affectiveAnalysis":
          //情感分析
          this.experienceJson.title = row.name
          this.experienceJson.description = '又称意见挖掘、倾向性分析等'
          if (RequestBody.result && RequestBody.result.url) {
            imgList.push(RequestBody.result.url)
          }
          this.experienceJson.editableTabs = [
            {
              title: "语义理解",
              name: "1",
              content:
                "简单而言,是对带有情感色彩的主观性文本进行分析、处理、归纳和推理的过程。互联网(如博客和论坛以及社会服务网络如大众点评)上产生了大量的用户参与的、对于诸如人物、事件、产品等有价值的评论信息。",
              imgList,
            },
          ]
          column = [
            {
              label: "情感分析文本内容",
              prop: "text",
              span: 24,
              type: 'textarea',
              minRows: 3,
              value: RequestBody[abilityCode].text,
              labelPosition: 'top',
              rules: [{
                required: true,
                message: "请输入文本内容",
                trigger: "blur"
              }
              ]
            },
          ]
          para = {
            abilityCode: RequestBody['abilityCode'],
            [abilityCode]: {
              tenantId: "000000",
            }
          }
          data = {
            column,
            para,
            RequestBody,
            primitiveData: {
              text: RequestBody[abilityCode].text,
            }
          }
          this.$refs.argumentSet.init(data)
          break
        case "ttsWithHuilan":
          //语音合成
          this.experienceJson.title = row.name
          this.experienceJson.description = '在客服机器人、服务机器人等场景中，与语音识别、自然语言处理等模块联动'
          if (RequestBody.result && RequestBody.result.url) {
            imgList.push(RequestBody.result.url)
          }
          this.experienceJson.editableTabs = [
            {
              title: "机器人发声",
              name: "1",
              content:
                "在客服机器人、服务机器人等场景中，与语音识别、自然语言处理等模块联动，打通人机交互的闭环。实现高品质的机器人发声，使得人机交互更流畅自然",
              imgList,
            },
            {
              title: "有声读物",
              name: "2",
              content:
                "将电子教材、小说等文本材料，以文本文件的形式导入离线语音合成引擎，产生完整的可重复阅读的有声教材或者有声小说，方便用户随时取用。",
            },
            {
              title: "语音播报",
              name: "3",
              content:
                "在语音导航应用、新闻类 App 中，语音合成可以快速生成高质量的播报音频，实现在开车、走路等不方便阅读消息的情况下，音频消息的即时传达。",
            },
          ]
          column = [
            {
              label: "输入合成语音的文本",
              prop: "text",
              span: 24,
              type: 'textarea',
              minRows: 3,
              value: RequestBody[abilityCode].text,
              labelPosition: 'top',
              rules: [{
                required: true,
                message: "请输入文本内容",
                trigger: "blur"
              }
              ]
            },
            {
              label: "发音人",
              prop: "spk",
              span: 24,
              type: 'radio',
              value: RequestBody[abilityCode].spk,
              labelPosition: 'top',
              dicData: [
                {
                  label: '柔和⼥声',
                  value: 'zhitian_emo'
                }, {
                  label: '活泼⼥声',
                  value: 'zhiyan_emo'
                },
                {
                  label: '普通⼥声',
                  value: 'zhibei_emo'
                },
                {
                  label: '标准男声',
                  value: 'zhizhe_emo'
                },
              ],
              rules: [{
                required: true,
                message: "请输入文本内容",
                trigger: "blur"
              }
              ]
            },
          ]
          para = {
            abilityCode: RequestBody['abilityCode'],
            [abilityCode]: {
              ...RequestBody[RequestBody['abilityCode']],
            }
          }
          data = {
            column,
            para,
            RequestBody,
            primitiveData: {
              text: RequestBody[abilityCode].text,
              spk: RequestBody[abilityCode].spk,
            }
          }
          this.$refs.argumentSet.init(data)
          break
        case "recordingFileAsrWithAliyun":
          //阿里云ASR
          this.experienceJson.title = row.name
          this.experienceJson.description = '在客服机器人、服务机器人等场景中，与语音识别、自然语言处理等模块联动'
          if (RequestBody.result && RequestBody.result.url) {
            imgList.push(RequestBody.result.url)
          }
          this.experienceJson.editableTabs = [
          ]
          column = [
            {
              label: "录音文件远程地址",
              prop: "file_link",
              span: 24,
              // type: 'textarea',
              minRows: 3,
              value: RequestBody[abilityCode].file_link,
              labelPosition: 'top',
              rules: [{
                required: true,
                message: "请输入文本内容",
                trigger: "blur"
              }
              ]
            },
          ]
          para = {
            abilityCode: RequestBody['abilityCode'],
            callbackKey: "recordingFileAsrCallbackWithAliyun",
            [abilityCode]: {
              ...RequestBody[RequestBody['abilityCode']],
            }
          }
          data = {
            column,
            para,
            RequestBody,
            primitiveData: {
              file_link: RequestBody[abilityCode].file_link,
            }
          }
          this.$refs.argumentSet.init(data)
          break
        case "speechSynthesizerRestfulWithAliyun":
          //阿里云TTS
          this.experienceJson.title = row.name
          this.experienceJson.description = '在客服机器人、服务机器人等场景中，与语音识别、自然语言处理等模块联动'
          if (RequestBody.result && RequestBody.result.url) {
            imgList.push(RequestBody.result.url)
          }
          this.experienceJson.editableTabs = [
            {
              title: "机器人发声",
              name: "1",
              content:
                "在客服机器人、服务机器人等场景中，与语音识别、自然语言处理等模块联动，打通人机交互的闭环。实现高品质的机器人发声，使得人机交互更流畅自然",
              imgList,
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
          ]
          column = [
            {
              label: "语音合成文本内容",
              prop: "text",
              span: 24,
              type: 'textarea',
              minRows: 3,
              value: RequestBody[abilityCode].text,
              labelPosition: 'top',
              rules: [{
                required: true,
                message: "请输入文本内容",
                trigger: "blur"
              }
              ]
            },
            {
              label: "文件格式",
              prop: "format",
              span: 24,
              // type: 'textarea',
              value: RequestBody[abilityCode].format,
              labelPosition: 'top',
              rules: [{
                required: true,
                message: "请输入文本内容",
                trigger: "blur"
              }
              ]
            },
          ]
          para = {
            abilityCode: RequestBody['abilityCode'],
            [abilityCode]: {
              ...RequestBody[RequestBody['abilityCode']],
            }
          }
          data = {
            column,
            para,
            RequestBody,
            primitiveData: {
              text: RequestBody[abilityCode].text,
              format: RequestBody[abilityCode].format,
            }
          }
          this.$refs.argumentSet.init(data)
          break
        case "recordingFileAsrWithAliyunLocal":
          //录音识别(阿里云本地)
          this.experienceJson.title = row.name
          this.experienceJson.description = ''
          if (RequestBody.result && RequestBody.result.url) {
            imgList.push(RequestBody.result.url)
          }
          this.experienceJson.editableTabs = [

          ]
          column = [
            {
              label: "录音文件远程地址",
              prop: "file_link",
              span: 24,
              type: 'textarea',
              minRows: 3,
              value: RequestBody[abilityCode].file_link,
              labelPosition: 'top',
              rules: [{
                required: true,
                message: "请输入文本内容",
                trigger: "blur"
              }
              ]
            },
          ]
          para = {
            abilityCode: RequestBody['abilityCode'],
            callbackKey: "recordingFileAsrCallbackWithAliyunLocal",
            [abilityCode]: {
              ...RequestBody[RequestBody['abilityCode']],
            }
          }
          data = {
            column,
            para,
            RequestBody,
            primitiveData: {
              file_link: RequestBody[abilityCode].file_link,
            }
          }
          this.$refs.argumentSet.init(data)
          break
        case "accurateBasicOcrWithBaidu":
          //文字识别
          this.experienceJson.title = row.name
          this.experienceJson.description = '使用通用文字识别技术，实现拍照文字识别'
          if (RequestBody.result && RequestBody.result.url) {
            imgList.push(RequestBody.result.url)
          }
          this.experienceJson.editableTabs = [
            {
              title: "拍照/截图识别",
              name: "1",
              content:
                "使用通用文字识别技术，实现拍照文字识别、相册图片文字识别和截图文字识别，可应用于搜索、书摘、笔记、翻译等移动应用中",
              imgList
            },
            {
              title: "内容审核",
              name: "2",
              content:
                "对各类文档进行结构化识别，如企业年报、论文、行业报告等",
            },
          ]
          column = [
            {
              label: "是否输出段落信息",
              prop: "paragraph",
              span: 24,
              type: 'switch',
              value: RequestBody[abilityCode].paragraph,
              labelPosition: 'top',
              dicData: [{
                label: '否',
                value: false
              }, {
                label: '是',
                value: true
              }],
              rules: [{
                required: true,
                message: "请输入文本内容",
                trigger: "blur"
              }
              ]
            },
            {
              label: "是否返回识别结果中每一行的置信度",
              prop: "probability",
              span: 24,
              type: 'switch',
              value: RequestBody[abilityCode].probability,
              labelPosition: 'top',
              dicData: [{
                label: '否',
                value: false
              }, {
                label: '是',
                value: true
              }],
              rules: [{
                required: true,
                message: "请输入文本内容",
                trigger: "blur"
              }
              ]
            },
            {
              label: "图片远程地址",
              prop: "url",
              span: 24,
              type: 'textarea',
              minRows: 3,
              value: RequestBody[abilityCode].url,
              labelPosition: 'top',
              rules: [{
                required: true,
                message: "请输入文本内容",
                trigger: "blur"
              }
              ]
            },
            {
              label: "上传图片",
              prop: "image",
              span: 24,
              type: 'upload',
              listType: 'picture-img',
              accept: 'image/*',
              labelPosition: 'top',
              limit: 1,
              autoUpload: false,
              propsHttp: {
                res: 'data'
              },
              // action: '',
            },
          ]
          para = {
            abilityCode: RequestBody['abilityCode'],
            [abilityCode]: {
              ...RequestBody[RequestBody['abilityCode']],
            }
          }
          data = {
            column,
            para,
            RequestBody,
            primitiveData: {
              paragraph: RequestBody[abilityCode].paragraph,
              probability: RequestBody[abilityCode].probability,
              url: RequestBody[abilityCode].url,
            }
          }
          this.$refs.argumentSet.init(data)
          break
        case "docAnalysisOfficeWithBaidu":
          //文档识别
          this.experienceJson.title = row.name
          this.experienceJson.description = '识别提取各类医疗单据、金融财税票据、法律卷宗等纸质文档中的文字信息'
          if (RequestBody.result && RequestBody.result.url) {
            imgList.push(RequestBody.result.url)
          }
          this.experienceJson.editableTabs = [
            {
              title: "纸质文档电子化",
              name: "1",
              content:
                "识别提取各类医疗单据、金融财税票据、法律卷宗等纸质文档中的文字信息，并可基于位置信息进行比对、结构化处理，提高信息录入效率",
              imgList
            },
            {
              title: "对办公场景文档识别",
              name: "2",
              content:
                "对各类文档进行结构化识别，如企业年报、论文、行业报告等",
            },
          ]
          column = [
            {
              label: "文档远程地址",
              prop: "url",
              span: 24,
              type: 'textarea',
              minRows: 3,
              value: RequestBody[abilityCode].url,
              labelPosition: 'top',
              rules: [{
                required: true,
                message: "请输入文本内容",
                trigger: "blur"
              }
              ]
            },
            {
              label: "上传文档",
              prop: "image",
              span: 24,
              type: 'upload',
              listType: 'picture-img',
              accept: 'image/*',
              labelPosition: 'top',
              limit: 1,
              autoUpload: false,
              propsHttp: {
                res: 'data'
              },
              // action: '',
            },
          ]
          para = {
            abilityCode: RequestBody['abilityCode'],
            [abilityCode]: {
              ...RequestBody[RequestBody['abilityCode']],
            }
          }
          data = {
            column,
            para,
            RequestBody,
            primitiveData: {
              url: RequestBody[abilityCode].url,
            }
          }
          this.$refs.argumentSet.init(data)
          break
        case "idcardWithBaidu":
          //文档识别
          this.experienceJson.title = row.name
          this.experienceJson.description = '结合OCR和人脸识别技术，实现对用户身份证件信息的自动识别和录入'
          if (RequestBody.result && RequestBody.result.url) {
            imgList.push(RequestBody.result.url)
          }
          this.experienceJson.editableTabs = [
            {
              title: "远程身份认证",
              name: "1",
              content:
                "结合OCR和人脸识别技术，实现对用户身份证件信息的自动识别和录入，同时通过人脸核身解决方案进行人脸识别和活体检测，完成用户身份验证",
              imgList
            },
            {
              title: "金融服务",
              name: "2",
              content:
                "结合多种卡证识别技术，实现对银行卡、个人信息及企业信息的自动识别和录入，有效降低用户输入成本，大幅度提升用户使用体验。",
            },
          ]
          column = [
            {
              label: "身份证远程地址",
              prop: "url",
              span: 24,
              type: 'textarea',
              minRows: 3,
              value: RequestBody[abilityCode].url,
              labelPosition: 'top',
              rules: [{
                required: true,
                message: "请输入文本内容",
                trigger: "blur"
              }
              ]
            },
            {
              label: "动检测身份证正反面，如果传参指定方向与图片相反，支持正常识别",
              prop: "id_card_side",
              span: 24,
              type: 'radio',
              minRows: 3,
              value: RequestBody[abilityCode].id_card_side,
              labelPosition: 'top',
              dicData: [{
                label: '身份证含照片的一面',
                value: 'front'
              }, {
                label: '身份证带国徽的一面',
                value: 'back'
              }],
              rules: [{
                required: true,
                message: "请输入文本内容",
                trigger: "blur"
              }
              ]
            },
            {
              label: "上传文档",
              prop: "image",
              span: 24,
              type: 'upload',
              listType: 'picture-img',
              accept: 'image/*',
              labelPosition: 'top',
              limit: 1,
              autoUpload: false,
              propsHttp: {
                res: 'data'
              },
              // action: '',
            },
          ]
          para = {
            abilityCode: RequestBody['abilityCode'],
            [abilityCode]: {
              ...RequestBody[RequestBody['abilityCode']],
            }
          }
          data = {
            column,
            para,
            RequestBody,
            primitiveData: {
              url: RequestBody[abilityCode].url,
              id_card_side: RequestBody[abilityCode].id_card_side,
            }
          }
          this.$refs.argumentSet.init(data)
          break
        case "asrForUploadFileWithHuilan":
          //语音识别
          this.experienceJson.title = row.name
          this.experienceJson.description = '将会议、访谈的长时间录音批量识别为文字，通过静音识别自动将有语音部分进行切分'
          if (RequestBody.result && RequestBody.result.url) {
            imgList.push(RequestBody.result.url)
          }
          this.experienceJson.editableTabs = [
            {
              title: "会议访谈转写",
              name: "1",
              content:
                "将会议、访谈的长时间录音批量识别为文字，通过静音识别自动将有语音部分进行切分，提升识别效率，便于进行内容记录、总结，提升音频内容记录效率",
              imgList
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
          ]
          column = [
            {
              label: "上传文档",
              prop: "video",
              span: 24,
            },
          ]
          para = {
            abilityCode: RequestBody['abilityCode'],
            [abilityCode]: {
              ...RequestBody[RequestBody['abilityCode']],
            }
          }
          data = {
            column,
            para,
            RequestBody,
            primitiveData: {
              file: RequestBody.file,
              appid: RequestBody.appid,
            }
          }
          this.$refs.argumentSet.init(data)
          break
        case "tagSenSim":
          //标签与短文本相似度计算
          this.experienceJson.title = row.name
          this.experienceJson.description = '计算源标签与目标短文本的相似度，并按相似度从高到低排序'
          if (RequestBody.result && RequestBody.result.url) {
            imgList.push(RequestBody.result.url)
          }
          this.experienceJson.editableTabs = [
            {
              title: "信息检索",
              name: "1",
              content:
                "在很多应用中都需要根据文本来检索其相似文本，需求场景非常普遍。不仅适用于纯文本检索，还可以利用标签等来检索图片、视频",
              imgList
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
          ]
          column = [
            {
              label: "描述说明",
              prop: "targetSentenceList",
              span: 24,
              type: 'array',
              labelPosition: 'top',
              rules: [{
                required: true,
                message: "请输入",
                trigger: "blur"
              },
              {
                validator: tagSenSim_targetSentenceList, trigger: 'blur'
              }
              ]
            },
          ]
          para = {
            abilityCode: RequestBody['abilityCode'],
            [abilityCode]: {
              ...RequestBody[RequestBody['abilityCode']],
            }
          }
          data = {
            column,
            para,
            RequestBody,
            type: 'tableAndform',
            primitiveData: {
              targetSentenceList: RequestBody[abilityCode].targetSentenceList,
            }
          }
          this.$refs.argumentSet.init(data)
          break
        case "rankQueryResult":
          //搜索结果词优先排名
          this.experienceJson.title = row.name
          this.experienceJson.description = ''
          if (RequestBody.result && RequestBody.result.url) {
            imgList.push(RequestBody.result.url)
          }
          this.experienceJson.editableTabs = [
          ]
          column = [
          ]
          para = {
            abilityCode: RequestBody['abilityCode'],
            [abilityCode]: {
              ...RequestBody[RequestBody['abilityCode']],
            }
          }
          data = {
            column,
            para: {
              ...RequestBody,
            },
            RequestBody,
            type: 'json',
            primitiveData: {
            }
          }
          this.$refs.argumentSet.init(data)
          break
        case "dependencyParser":
          //依存句法分析服务
          this.experienceJson.title = row.name
          this.experienceJson.description = ''
          if (RequestBody.result && RequestBody.result.url) {
            imgList.push(RequestBody.result.url)
          }
          this.experienceJson.editableTabs = [
            {
              title: "语言理解",
              name: "1",
              content:
                "通过分析用户Query的依存句法结构信息，抽取其中的语义主干及相关语义成分，帮助智能产品实现对用户意图的精准理解",
              imgList,
            },
            {
              title: "知识发掘",
              name: "2",
              content:
                "对大规模非结构化文本数据进行句法结构分析，从中抽取实体、概念、语义关系等信息，帮助构建领域知识或世界知识",
            },
            {
              title: "语言结构匹配",
              name: "3",
              content:
                "基于语言对(Query-WebTitle)之间的句法结构信息进行语言的匹配计算，帮助提升语义匹配计算的准确率",
            },
          ]
          column = [
          ]
          para = {
            abilityCode: RequestBody['abilityCode'],
            [abilityCode]: {
              ...RequestBody[RequestBody['abilityCode']],
            }
          }
          data = {
            column,
            para: {
              ...RequestBody,
            },
            RequestBody,
            type: 'json',
            primitiveData: {
            }
          }
          this.$refs.argumentSet.init(data)
          break
        case "simHashSim":
          //文本simHash相似度
          this.experienceJson.title = row.name
          this.experienceJson.description = '计算文本之间SimHash的相似度'
          if (RequestBody.result && RequestBody.result.url) {
            imgList.push(RequestBody.result.url)
          }
          this.experienceJson.editableTabs = [
            {
              title: "文章去重",
              name: "1",
              content:
                "定位文章中的相似内容，用于相似内容去重",
              imgList,
            },
            {
              title: "文本相似度计算",
              name: "2",
              content:
                "用户输入一个问题时，自动为用户寻找相似的问题和答案",
            },
          ]
          column = [
            {
              label: "源哈希",
              prop: "sourceHash",
              span: 24,
              type: 'array',
              value: RequestBody[abilityCode].sourceHash,
              labelPosition: 'top',
              rules: [{
                required: true,
                message: "请输入",
                trigger: "blur"
              }
              ]
            },
            {
              label: "目标哈希",
              prop: "targetHashList1",
              span: 24,
              type: 'array',
              value: RequestBody[abilityCode].targetHashList1,
              labelPosition: 'top',
              rules: [{
                required: true,
                message: "请输入",
                trigger: "blur"
              }
              ]
            },
            {
              label: "目标哈希2",
              prop: "targetHashList2",
              span: 24,
              type: 'array',
              value: RequestBody[abilityCode].targetHashList2,
              labelPosition: 'top',
              rules: [{
                required: true,
                message: "请输入",
                trigger: "blur"
              }
              ]
            },
            {
              label: "目标哈希3",
              prop: "targetHashList3",
              span: 24,
              type: 'array',
              value: RequestBody[abilityCode].targetHashList3,
              labelPosition: 'top',
              rules: [{
                required: true,
                message: "请输入",
                trigger: "blur"
              }
              ]
            },
          ]
          para = {
            abilityCode: RequestBody['abilityCode'],
            [abilityCode]: {
              ...RequestBody[RequestBody['abilityCode']],
            }
          }
          data = {
            column,
            para,
            RequestBody,
            type: 'form',
            primitiveData: {
              sourceHash: RequestBody[abilityCode].sourceHash,
              targetHashList1: [13332, 57472, 30372, 55960],
              targetHashList2: [13332, 57472, 30374, 55960],
              targetHashList3: [13332, 57472, 30436, 55450],
            }
          }
          this.$refs.argumentSet.init(data)
          break
        case "chatgptForHuilan":
          //汇联对话
          this.experienceJson.title = row.name
          this.experienceJson.description = '中科汇联AIGC对话模型，具备超强语言理解以及对话生成能力'
          if (RequestBody.result && RequestBody.result.url) {
            imgList.push(RequestBody.result.url)
          }
          this.experienceJson.editableTabs = [
            {
              title: "客户服务",
              name: "1",
              content:
                "可以作为智能客服机器人，通过自动回复用户的问题，提高客户服务效率。",
              imgList,
            },
            {
              title: "内容生成",
              name: "2",
              content:
                "可以用于生成文章、博客、新闻稿等文本内容，提高创作效率。",
            },
            {
              title: "对话系统",
              name: "3",
              content:
                "可以为聊天应用、社交媒体平台、虚拟助手等提供智能对话功能。",
            },
          ]
          column = [
          ]
          para = {
            abilityCode: RequestBody['abilityCode'],
            [abilityCode]: {
              ...RequestBody[RequestBody['abilityCode']],
            }
          }
          data = {
            column,
            para,
            RequestBody,
            type: 'form',
            primitiveData: {
              input_text: RequestBody[abilityCode].input_text,
            }
          }
          this.$nextTick(() => {
            this.$refs.vueChat.init(data)
            this.$refs.argumentSet.emptyInit()
          })
          break
        case "chatgptForOpenAi":
          //汇联对话
          this.experienceJson.title = row.name
          this.experienceJson.description = '基于gpt-3.5-turbo模型，具备超强语言理解以及对话生成能力'
          if (RequestBody.result && RequestBody.result.url) {
            imgList.push(RequestBody.result.url)
          }
          this.experienceJson.editableTabs = [
            {
              title: "客户服务",
              name: "1",
              content:
                "可以作为智能客服机器人，通过自动回复用户的问题，提高客户服务效率。",
              imgList,
            },
            {
              title: "内容生成",
              name: "2",
              content:
                "可以用于生成文章、博客、新闻稿等文本内容，提高创作效率。",
            },
            {
              title: "对话系统",
              name: "3",
              content:
                "可以为聊天应用、社交媒体平台、虚拟助手等提供智能对话功能",
            },
          ]
          column = [
          ]
          para = {
            abilityCode: RequestBody['abilityCode'],
            [abilityCode]: {
              ...RequestBody[RequestBody['abilityCode']],
            }
          }
          data = {
            column,
            para,
            RequestBody,
            type: 'form',
            primitiveData: {
              input_text: RequestBody[abilityCode].input_text,
              "top_p": RequestBody[abilityCode].top_p,
              "temperature": RequestBody[abilityCode].temperature,
              history: []
            }
          }
          this.$nextTick(() => {
            this.$refs.vueChat.init(data)
            this.$refs.argumentSet.emptyInit()
          })
          break
        case "txtToImgForHuilan":
          //汇联文生图
          this.experienceJson.title = row.name
          this.experienceJson.description = '中科汇联AIGC模型生成或处理图像'
          if (RequestBody.result && RequestBody.result.url) {
            imgList.push(RequestBody.result.url)
          }
          this.experienceJson.editableTabs = [
            {
              title: "艺术创作",
              name: "1",
              content:
                "可以生成独特的艺术设计、素描和绘画，帮助艺术家更好地发挥自己的创造力和想象力。",
              imgList,
            },
            {
              title: "包装设计",
              name: "2",
              content:
                "可以生成独特的包装设计，帮助用户提高产品的吸引力和知名度。",
            },
            {
              title: "IP形象",
              name: "3",
              content:
                "可以根据用户提供的关键字和需求生成独特的IP形象，例如卡通人物、动物、机器人等，帮助用户打造自己的IP形象，提高品牌形象和知名度。",
            },
          ]
          column = [
            {
              label: "图片主题",
              prop: "prompt",
              span: 24,
              type: 'textarea',
              minRows: 3,
              value: RequestBody[abilityCode].prompt,
              labelPosition: 'top',
              rules: [{
                required: true,
                message: "请输入文本内容",
                trigger: "blur"
              }
              ]
            },
            {
              label: "图片宽度",
              prop: "width",
              span: 24,
              min: 1,
              max: 2400,
              type: 'number',
              precision: 0,
              labelPosition: 'top',
              value: RequestBody[abilityCode].width,
              rules: [{
                required: true,
                message: "请输入大于0小于2400正整数",
                trigger: "blur"
              }
              ]
            },
            {
              label: "图片高度",
              prop: "height",
              span: 24,
              min: 1,
              max: 2400,
              type: 'number',
              precision: 0,
              labelPosition: 'top',
              value: RequestBody[abilityCode].height,
              rules: [{
                required: true,
                message: "请输入大于0小于2400正整数",
                trigger: "blur"
              }
              ]
            },
            {
              label: "生成图片数量",
              prop: "batch_size",
              span: 24,
              type: 'select',
              precision: 0,
              labelPosition: 'top',
              value: RequestBody[abilityCode].batch_size,
              dicData: [
                { label: '1张', value: 1 },
                { label: '2张', value: 2 },
                { label: '3张', value: 3 },
                { label: '4张', value: 4 },
                { label: '5张', value: 5 },
                { label: '6张', value: 6 },
                { label: '7张', value: 7 },
                { label: '8张', value: 8 },
              ],
              rules: [{
                required: true,
                message: "请选择",
                trigger: "blur"
              }
              ]
            },
          ]
          para = {
            abilityCode: RequestBody['abilityCode'],
            [abilityCode]: {
              ...RequestBody[RequestBody['abilityCode']],
            }
          }
          data = {
            column,
            para,
            RequestBody,
            type: 'form',
            primitiveData: {
              prompt: RequestBody[abilityCode].prompt,
              "batch_size": RequestBody[abilityCode].batch_size,
              "width": RequestBody[abilityCode].width,
              "height": RequestBody[abilityCode].height,
            }
          }
          this.$refs.argumentSet.init(data)
          break
      }
      if (column.length === 0 && !data.RequestBody) {
        this.emptyBtn = false
        this.$refs.argumentSet.emptyInit()
        this.setResoultEmpty(row)
      } else {
        this.emptyBtn = true
      }
    },
    resultData(data) {
      const self = this
      switch (data.key) {
        case 'common':
          self.$refs.analysisResult.init(data)
          break
        case 'json':
          self.$refs.analysisResult.init(data)
          break
        case 'text':
          self.$refs.analysisResult.init(data)
          break
      }
    },
    setResoultEmpty(row) {
      this.$nextTick(() => {
        this.$refs.argumentSet.emptyInit()
        this.experienceJson.title = row.name
        this.experienceJson.description = ''
      })
    },
    jsonResultClear() {
      this.$refs.analysisResult.clearResolt()
    },
    interDoc() {
      const self = this
      const category1 = this.category
      if (
        (category1 === "machine" ||
          category1 === "nlp" || category1 === 'gpt' || category1 === 'voice' || category1 === 'image' || category1 === 'emotion') && (this.headerTitle === 'ability' || this.rowData.headerTitle === 'ability' || this.curentRouterPage === 'ability')
      ) {
        const rowData = { ...this.rowData, testUrl: this.abilityCode, headerTitle: this.headerTitle };
        this.$emit("nplHandl", rowData, "3");
      } else if (this.headerTitle === 'apply' || this.rowData.headerTitle === 'apply') {
        const rowData = {
          ...this.applyRowData, cunrentLeftTreeRow: this.rowData
        }
        self.$emit("naturalLanguageProcessing", { ...rowData, menuList: this.menuList }, "3");
        // this.$parent.switchPage = "3";
        // if (this.$parent.rowData) {
        //   this.$parent.rowData.testUrl = this.abilityCode;
        // } else {
        //   let rowDataSource = { ...this.rowData, testUrl: this.abilityCode };
        //   self.$emit("naturalLanguageProcessing", rowDataSource, "3");
        // }
      }
    },
    switchPageTab(row) {
      this.$refs.leftMenuTree.setCurrentKey(row.id)
      this.nodeTreetab(row)
      this.category1 = row.category1
    },
    appwichAbility(applicationId) {
      const self = this
      getHuilanAiApplicationAbilityRelationByApplicationId({
        applicationId,
      }).then((res) => {
        const data = res.data;
        if (data.success) {
          const arr = [];
          const menuList = [];
          data.data.map((v) => {
            if (
              v.code !== "recordingFileAsrCallbackWithAliyun" &&
              v.code !== "recordingFileAsrCallbackWithAliyunLocal" &&
              v.code !== "recordingFileAsrCallbackWithAliyun"
            ) {
              arr.push(v.id);
              menuList.push(v)
            }
          });
          self.menuList = menuList
          self.$refs.leftMenuTree.setTreeAplly(arr, this.headerTitle)
        }
      });
    }
  },
};
</script>

<style lang="scss" scoped>
.topText {
  .tit {
    font-family: SourceHanSansCN-Bold;
    font-size: 20px;
    font-weight: normal;
    font-stretch: normal;
    line-height: 24px;
    letter-spacing: 0px;
    color: #080b2b;
    display: flex;
    justify-content: space-between;
  }

  .tex {
    font-family: SourceHanSansCN-Normal;
    font-size: 14px;
    font-weight: normal;
    font-stretch: normal;
    line-height: 36px;
    letter-spacing: 0px;
    color: #565863;
  }
}

.argumentSet {
  display: flex;
  margin-top: 20px;
}

/deep/ .avue-form__menu {
  display: none;
}
</style>
