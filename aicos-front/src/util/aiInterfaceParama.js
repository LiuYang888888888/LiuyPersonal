import { extractKeywordsFromTxt } from "@/api/configure/aiAbility";
import voice from "@/assets/iconfont/voice.png";
// import distinguish from "@/assets/iconfont/distinguish.png";
import crux from "@/assets/iconfont/crux.png";
// import summary from "@/assets/iconfont/summary.png";
import langrage from "@/assets/iconfont/langrage.png";
import notional from "@/assets/iconfont/notional.png";
import participle from "@/assets/iconfont/participle.png";
import mathCompute from "@/assets/iconfont/mathCompute.png";
import senSim from "@/assets/iconfont/senSim.png";
import splitToSentences from "@/assets/iconfont/splitToSentences.png";
import miningQA from "@/assets/iconfont/miningQA.png";
import findSensitiveWords from "@/assets/iconfont/findSensitiveWords.jpg";
import extractSummary from "@/assets/iconfont/extractSummary.jpg";
import extractYearMonth from "@/assets/iconfont/extractYearMonth.png";
import miningWordCoOccurrences from "@/assets/iconfont/miningWordCoOccurrences.png";
import idcardWithBaidu from "@/assets/iconfont/idcardWithBaidu.png";
import docAnalysisOfficeWithBaidu from "@/assets/iconfont/docAnalysisOfficeWithBaidu.png";
import accurateBasicOcrWithBaidu from "@/assets/iconfont/accurateBasicOcrWithBaidu.png";
import simHashSim from "@/assets/iconfont/simHashSim.png";
import discoverNewWords from "@/assets/iconfont/discoverNewWords.png";
import semanticRoleLabeling from "@/assets/iconfont/semanticRoleLabeling.png";
import componentAnalysis from "@/assets/iconfont/componentAnalysis.png";
import extractTags from "@/assets/iconfont/extractTags.png";
import tagSenSim from "@/assets/iconfont/tagSenSim.jpg";

const RequestBodyTabList = [{
  id: "1",
  name: "aiDomain",
  explain: "aiDomain",
  type: "body",
  flag: "true",
  dataType: "AiDomain",
  schema: "AiDomain",
  children: [
    {
      id: "1-1",
      name: "appKey",
      explain: "appKey",
      type: "",
      flag: "true",
      dataType: "string",
      schema: "",
    },
    {
      id: "1-2",
      name: "appSecret",
      explain: "appSecret",
      type: "",
      flag: "true",
      dataType: "string",
      schema: "",
    },
    {
      id: "1-9",
      name: "serviceCode",
      explain: "服务编码",
      type: "",
      flag: "true",
      dataType: "string",
      schema: "",
    }
  ]
}]
const RequestBodyTabListChils = {
  charDetect: {
    id: "1-3",
    name: "charDetect",
    explain: "语种识别",
    type: "",
    flag: "true",
    dataType: "charDetect",
    schema: "charDetect",
    children: [
      { id: "1-3-1", name: "id	", explain: "句⼦", type: "", flag: "true", dataType: "array", schema: "string" },
      { id: "1-3-2", name: "orderNo", explain: "顺序号", type: "", flag: "true", dataType: "integer", schema: "" },
      { id: "1-3-2", name: "roleType", explain: "1:坐席 2：访客", type: "", flag: "true", dataType: "string", schema: "" },
      { id: "1-3-2", name: "sentence", explain: "句⼦", type: "", flag: "true", dataType: "string", schema: "" },
    ]
  },
  discoverNewWords: {
    id: "1-4",
    name: "discoverNewWords",
    explain: "新词发现",
    type: "",
    flag: "true",
    dataType: "discoverNewWords",
    schema: "discoverNewWords",
    children: [
      { id: "1-4-1", name: "highEntropyRateThreshold", explain: "高要求新词的自由度阈值,必须大于等于2.54,默认2.54", type: "", flag: "true", dataType: "string", schema: "" },
      { id: "1-4-2", name: "highSolidRateThreshold", explain: "高要求新词的凝聚度阈值,必须大于等于50,默认500", type: "", flag: "true", dataType: "string", schema: "" },
      { id: "1-4-3", name: "newWords", explain: "用于发现新词的文本内容", type: "", flag: "true", dataType: "array", schema: "string" },
      { id: "1-4-4", name: "tenantId", explain: "租户id", type: "", flag: "true", dataType: "string", schema: "" },
    ]
  },
  extractEntities: {
    id: "1-5",
    name: "extractEntities",
    explain: "实体提取",
    type: "",
    flag: "true",
    dataType: "extractEntities",
    schema: "extractEntities",
    children: [
      { id: "1-5-1", name: "sentences", explain: "句⼦", type: "", flag: "true", dataType: "array", schema: "string" },
      { id: "1-5-2", name: "tenantId", explain: "租户id", type: "", flag: "true", dataType: "string", schema: "" },
    ]
  },
  extractKeywordsFromTxt: {
    id: "1-6",
    name: "extractKeywordsFromTxt",
    explain: "关键词提取",
    type: "",
    flag: "true",
    dataType: "extractKeywordsFromTxt",
    schema: "extractKeywordsFromTxt",
    children: [
      { id: "1-6-1", name: "filterFlag", explain: "默认'nva'，取值⽰例:'nva','nv','n', 其中n是名词,v是动词,a是形容词", type: "", flag: "true", dataType: "", schema: "string" },
      { id: "1-6-2", name: "maxPerSentence", explain: "默认6，对句⼦压缩时，每句最多保留多少个核⼼词", type: "", flag: "true", dataType: "	integer", schema: "" },
      { id: "1-6-3", name: "sentences", explain: "一组句子", type: "", flag: "true", dataType: "	array", schema: "string" },
      { id: "1-6-4", name: "similarQuestions", explain: "一组相似问", type: "", flag: "true", dataType: "array", schema: "string" },
      { id: "1-6-5", name: "standardQuestion", explain: "标准问", type: "", flag: "true", dataType: "string", schema: "" },
      { id: "1-6-6", name: "tenantId", explain: "租户id", type: "", flag: "true", dataType: "string", schema: "" },
      { id: "1-6-7", name: "text", explain: "⽂本", type: "", flag: "true", dataType: "string", schema: "" },
      { id: "1-6-8", name: "topN", explain: "默认100，返回前多少个关键词", type: "", flag: "true", dataType: "integer", schema: "" },
    ]
  },
  findSensitiveWords: {
    id: "1-7",
    name: "findSensitiveWords",
    explain: "敏感词过滤",
    type: "",
    flag: "true",
    dataType: "findSensitiveWords",
    schema: "findSensitiveWords",
    children: [
      { id: "1-7-1", name: "enableSystemWords", explain: "是否启⽤系统敏感词", type: "", flag: "true", dataType: "string", schema: "" },
      { id: "1-7-2", name: "enableTenantWords", explain: "是否启⽤租户敏感词", type: "", flag: "true", dataType: "string", schema: "" },
      { id: "1-7-3", name: "enableBuiltinWords", explain: "是否启⽤租户敏感词", type: "", flag: "true", dataType: "string", schema: "" },
      { id: "1-7-4", name: "doReplace", explain: "是否启⽤租户敏感词", type: "", flag: "true", dataType: "string", schema: "" },
      { id: "1-7-5", name: "sentences", explain: "⼀批句⼦", type: "", flag: "true", dataType: "array", schema: "" },
      { id: "1-7-6", name: "tenantId", explain: "租户id", type: "", flag: "true", dataType: "string", schema: "" },
    ]
  },
  sentenceCluster: {
    id: "1-10",
    name: "句子聚类",
    explain: "sentenceCluster",
    type: "",
    flag: "true",
    dataType: "sentenceCluster",
    schema: "sentenceCluster",
    children: [
      { id: "1-10-1", name: "sentence", explain: "句⼦", type: "", flag: "true", dataType: "array", schema: "string" },
      { id: "1-10-2", name: "tenantId", explain: "租户id", type: "", flag: "true", dataType: "string", schema: "" },
    ]
  },
  splitSentences: {
    id: "1-11",
    name: "splitSentences",
    explain: "分词",
    type: "",
    flag: "true",
    dataType: "splitSentences",
    schema: "splitSentences",
    children: [
      { id: "1-11-1", name: "sentence", explain: "句⼦", type: "", flag: "true", dataType: "array", schema: "string" },
      { id: "1-11-2", name: "tenantId", explain: "租户id", type: "", flag: "true", dataType: "string", schema: "" },
    ]
  },
  syntacticAnalysis: {
    id: "1-12",
    name: "syntacticAnalysis",
    explain: "句法分析",
    type: "",
    flag: "true",
    dataType: "syntacticAnalysis",
    schema: "syntacticAnalysis",
    children: [
      { id: "1-11-1", name: "sentence", explain: "句⼦", type: "", flag: "true", dataType: "string", schema: "" },
      { id: "1-11-2", name: "tenantId", explain: "租户id", type: "", flag: "true", dataType: "string", schema: "" },
    ]
  },
  extractSummary: {
    id: "1-13",
    name: "extractSummary",
    explain: "摘要提取",
    type: "",
    flag: "true",
    dataType: "extractSummary",
    schema: "extractSummary",
    children: [
      { id: "1-13-1", name: "size", explain: "size", type: "", flag: "true", dataType: "	integer", schema: "" },
      { id: "1-13-2", name: "tenantId", explain: "租户id", type: "", flag: "true", dataType: "string", schema: "" },
      { id: "1-13-3", name: "text", explain: "文字", type: "", flag: "true", dataType: "string", schema: "" },
    ]
  },
  miningQA: {
    id: "1-14",
    name: "miningQA",
    explain: "语种识别",
    type: "",
    flag: "true",
    dataType: "miningQA",
    schema: "miningQA",
    children: [
      { id: "1-14-1", name: "id", explain: "句⼦", type: "", flag: "true", dataType: "	string", schema: "" },
      { id: "1-14-2", name: "orderNo", explain: "顺序号", type: "", flag: "true", dataType: "integer", schema: "" },
      { id: "1-14-3", name: "roleType", explain: "1:坐席 2：访客", type: "", flag: "true", dataType: "string", schema: "" },
      { id: "1-14-4", name: "sentence", explain: "句⼦", type: "", flag: "true", dataType: "string", schema: "" },
    ]
  },
  splitToSentences: {
    id: "1-15",
    name: "splitToSentences",
    explain: "文档切分句子",
    type: "",
    flag: "true",
    dataType: "splitToSentences",
    schema: "splitToSentences",
    children: [
      { id: "1-15-1", name: "normalizeFlag", explain: "繁转简等归一化处理，默认false", type: "", flag: "true", dataType: "boolean", schema: "" },
      { id: "1-15-2", name: "tenantId", explain: "租户id", type: "", flag: "true", dataType: "string", schema: "" },
      { id: "1-15-3", name: "text", explain: "句⼦", type: "", flag: "true", dataType: "string", schema: "" },
    ]
  },
  senSim: {
    id: "1-16",
    name: "senSim",
    explain: "短文本相似度计算",
    type: "",
    flag: "true",
    dataType: "senSim",
    schema: "senSim",
    children: [
      { id: "1-16-1", name: "delWeight", explain: "	删除权重，默认0.6", type: "", flag: "true", dataType: "	number", schema: "" },
      { id: "1-16-2", name: "inWeight", explain: "插入权重，默认0.33", type: "", flag: "true", dataType: "number", schema: "" },
      { id: "1-16-3", name: "sourceSentence", explain: "源句子", type: "", flag: "true", dataType: "string", schema: "" },
      { id: "1-16-4", name: "subWeight", explain: "替换权重，默认1.0", type: "", flag: "true", dataType: "number", schema: "" },
      { id: "1-16-5", name: "targetSentenceList", explain: "目标句子", type: "", flag: "true", dataType: "array", schema: "string" },
      { id: "1-16-6", name: "useSystemSynonyms", explain: "使用系统同义词，默认true", type: "", flag: "true", dataType: "boolean", schema: "" },
      { id: "1-16-7", name: "useTenantSynonyms", explain: "使用租户同义词，默认true", type: "", flag: "true", dataType: "boolean", schema: "" },
    ]
  },
  mathCompute: {
    id: "1-17",
    name: "mathCompute",
    explain: "NLP数学计算器",
    type: "",
    flag: "true",
    dataType: "NLP数学计算器",
    schema: "NLP数学计算器",
    children: [
      { id: "1-17-1", name: "sentence", explain: "句子", type: "", flag: "true", dataType: "string", schema: "" },
      { id: "1-17-2", name: "tenantId", explain: "租户id", type: "", flag: "true", dataType: "string", schema: "" },
    ]
  },
  miningWordCoOccurrences: {
    id: "1-18",
    name: "miningWordCoOccurrences",
    explain: "挖掘词共现(可作为知识点，也可作为标签)",
    type: "",
    flag: "true",
    dataType: "挖掘词共现",
    schema: "挖掘词共现",
    children: [
      { id: "1-18-1", name: "sentence", explain: "句子", type: "", flag: "true", dataType: "array", schema: "" },
      { id: "1-18-2", name: "tenantId", explain: "租户id", type: "", flag: "true", dataType: "string", schema: "" },
    ]
  },
  extractTags: {
    id: "1-19",
    name: "extractTags",
    explain: "标签提取",
    type: "",
    flag: "true",
    dataType: "标签提取",
    schema: "标签提取",
    children: [
      { id: "1-19-1", name: "tenantId", explain: "租户id", type: "", flag: "true", dataType: "string", schema: "" },
      { id: "1-19-2", name: "text", explain: "text", type: "", flag: "true", dataType: "array", schema: "" },
      { id: "1-19-3", name: "topN", explain: "topN", type: "", flag: "true", dataType: "integer", schema: "" },
    ]
  },
  extractYearMonth: {
    id: "1-20",
    name: "extractYearMonth",
    explain: "提取年月日",
    type: "",
    flag: "true",
    dataType: "extractYearMonth",
    schema: "extractYearMonth",
    children: [
      { id: "1-20-1", name: "sentence", explain: "句子", type: "", flag: "true", dataType: "string", schema: "" },
      { id: "1-20-2", name: "tenantId", explain: "租户id", type: "", flag: "true", dataType: "string", schema: "" }
    ]
  },
  simHash: {
    id: "1-21",
    name: "simHash",
    explain: "计算文本的SimHash",
    type: "",
    flag: "true",
    dataType: "simHash",
    schema: "simHash",
    children: [
      { id: "1-21-1", name: "tenantId", explain: "租户id", type: "", flag: "true", dataType: "string", schema: "" },
      { id: "1-21-2", name: "text", explain: "文本", type: "", flag: "true", dataType: "string", schema: "" }
    ]
  },
  simHashSim: {
    id: "1-22",
    name: "simHashSim",
    explain: "计算SimHash的相似度",
    type: "",
    flag: "true",
    dataType: "simHashSim",
    schema: "simHashSim",
    children: [
      { id: "1-22-1", name: "sourceHash", explain: "sourceHash", type: "", flag: "true", dataType: "array", schema: "integer" },
      { id: "1-22-2", name: "targetHashList", explain: "targetHashList", type: "", flag: "true", dataType: "array", schema: "array" },
      { id: "1-22-3", name: "tenantId", explain: "租户id", type: "", flag: "true", dataType: "string", schema: "" }
    ]
  },
  runLuaScript: {
    id: "1-23",
    name: "runLuaScript",
    explain: "执行lua脚本",
    type: "",
    flag: "true",
    dataType: "runLuaScript",
    schema: "runLuaScript",
    children: [
      { id: "1-23-1", name: "contextSession", explain: "contextSession", type: "", flag: "true", dataType: "object", schema: "integer" },
      { id: "1-23-2", name: "exceptionMessage", explain: "exceptionMessage", type: "", flag: "true", dataType: "string", schema: "" },
      { id: "1-23-3", name: "inputs", explain: "inputs", type: "", flag: "true", dataType: "object", schema: "" },
      { id: "1-23-4", name: "luaScript", explain: "luaScript", type: "", flag: "true", dataType: "string", schema: "" },
      { id: "1-23-5", name: "outputs", explain: "outputs", type: "", flag: "true", dataType: "object", schema: "" },
      { id: "1-23-6", name: "status", explain: "status", type: "", flag: "true", dataType: "string", schema: "" },
    ]
  },
  //成分句法分析服务
  componentAnalysis: {
    id: "1-24",
    name: "componentAnalysis",
    explain: "成分句法分析",
    type: "",
    flag: "true",
    dataType: "componentAnalysis",
    schema: "componentAnalysis",
    children: [
      { id: "1-24-1", name: "sentences", explain: "句⼦", type: "", flag: "true", dataType: "array", schema: "array" },
    ]
  },
  //短语句法分析服务List
  componentAnalysisList: {
    id: "1-24",
    name: "componentAnalysisList",
    explain: "成分句法分析List",
    type: "",
    flag: "true",
    dataType: "componentAnalysisList",
    schema: "componentAnalysisList",
    children: [
      { id: "1-24-1", name: "sentences", explain: "句⼦", type: "", flag: "true", dataType: "array", schema: "array" },
    ]
  },
  //语义依存分析服务
  semanticDependencyAnalysis: {
    id: "1-25",
    name: "semanticDependencyAnalysis",
    explain: "语义依存分析服务",
    type: "",
    flag: "true",
    dataType: "semanticDependencyAnalysis",
    schema: "semanticDependencyAnalysis",
    children: [
      { id: "1-24-1", name: "sentences", explain: "句⼦", type: "", flag: "true", dataType: "array", schema: "string" },
    ]
  },
  //语义依存分析服务List
  semanticDependencyAnalysisList: {
    id: "1-25",
    name: "semanticDependencyAnalysisList",
    explain: "语义依存分析服务List",
    type: "",
    flag: "true",
    dataType: "semanticDependencyAnalysisList",
    schema: "semanticDependencyAnalysisList",
    children: [
      { id: "1-25-1", name: "sentences", explain: "句⼦", type: "", flag: "true", dataType: "array", schema: "array" },
    ]
  },
  //语义角色标注服务
  semanticRoleLabeling: {
    id: "1-26",
    name: "semanticRoleLabeling",
    explain: "语义角色标注服务",
    type: "",
    flag: "true",
    dataType: "semanticRoleLabeling",
    schema: "semanticRoleLabeling",
    children: [
      { id: "1-26-1", name: "sentences", explain: "句⼦", type: "", flag: "true", dataType: "array", schema: "string" },
    ]
  },
  //语义角色标注服务List
  semanticRoleLabelingList: {
    id: "1-26",
    name: "semanticRoleLabelingList",
    explain: "语义角色标注服务",
    type: "",
    flag: "true",
    dataType: "semanticRoleLabelingList",
    schema: "semanticRoleLabelingList",
    children: [
      { id: "1-26-1", name: "sentences", explain: "句⼦", type: "", flag: "true", dataType: "array", schema: "array" },
    ]
  },
  //情感分析
  affectiveAnalysis: {
    id: "1-27",
    name: "affectiveAnalysis",
    explain: "情感分析",
    type: "",
    flag: "true",
    dataType: "affectiveAnalysis",
    schema: "affectiveAnalysis",
    children: [
      { id: "1-27-1", name: "tenantId", explain: "租户id", type: "", flag: "true", dataType: "string", schema: "" },
      { id: "1-27-2", name: "text", explain: "text", type: "", flag: "true", dataType: "string", schema: "" },
    ]
  },
  //标签词对句子的打分及排序
  tagSenSim: {
    id: "1-28",
    name: "tagSenSim",
    explain: "标签词对句子的打分及排序",
    type: "",
    flag: "true",
    dataType: "tagSenSim",
    schema: "tagSenSim",
    children: [
      { id: "1-28-1", name: "tagWords", explain: "tagWords", type: "", flag: "true", dataType: "object", schema: "" },
      { id: "1-28-2", name: "targetSentenceList", explain: "targetSentenceList", type: "", flag: "true", dataType: "array", schema: "string" },
      { id: "1-28-2", name: "tenantId", explain: "租户id", type: "", flag: "true", dataType: "string", schema: "" },
    ]
  },
  //	汇联上传文件tts
  ttsWithHuilan: {
    id: "1-29",
    name: "ttsWithHuilan",
    explain: "汇联上传文件tts",
    type: "",
    flag: "true",
    dataType: "ttsWithHuilan",
    schema: "ttsWithHuilan",
    children: [
      { id: "1-29-1", name: "du", explain: "是否计算音素时段，0: 不计算; 1: 计算", type: "", flag: "true", dataType: "string", schema: "" },
      { id: "1-29-2", name: "fmt", explain: "音频格式，mp3; ccitt-alaw8k; alaw8k; mulaw8k; u8-8k; s16le16k; pcm", type: "", flag: "true", dataType: "string", schema: "string" },
      { id: "1-29-3", name: "ph", explain: "text是文本还是音素，0: 文本; 1: 音素序列", type: "", flag: "true", dataType: "string", schema: "" },
      { id: "1-29-4", name: "pitch", explain: "	语调，-20到20之间", type: "", flag: "true", dataType: "number", schema: "" },
      { id: "1-29-5", name: "spd", explain: "语速倍数，0.1到5.0之间", type: "", flag: "true", dataType: "number", schema: "" },
      { id: "1-29-6", name: "spk", explain: "发音人，sn1: 标准男声; sn0: 标准女声", type: "", flag: "true", dataType: "string", schema: "" },
      { id: "1-29-7", name: "text", explain: "用于合成语音的文本", type: "", flag: "true", dataType: "string", schema: "" },
      { id: "1-29-8", name: "vol", explain: "音量倍数，0.1到5.0之间", type: "", flag: "true", dataType: "number", schema: "" },
    ]
  },
  //		通用文字识别，高精度版，百度
  accurateBasicOcrWithBaidu: {
    id: "1-30",
    name: "accurateBasicOcrWithBaidu",
    explain: "通用文字识别，高精度版，百度",
    type: "",
    flag: "true",
    dataType: "accurateBasicOcrWithBaidu",
    schema: "accurateBasicOcrWithBaidu",
    children: [
      { id: "1-30-1", name: "image", explain: "图像数据，base64编码后进行urlencode，要求base64编码和urlencode后大小不超过10M，最短边至少15px，最长边最大8192px，支持jpg/jpeg/png/bmp格式优先级：image > url > pdf_file，当image字段存在时，url、pdf_file字段失效", type: "和 url/pdf_file 三选一", flag: "true", dataType: "string", schema: "" },
      { id: "1-30-2", name: "url", explain: "图片完整url，url长度不超过1024字节，url对应的图片base64编码后大小不超过10M，最短边至少15px，最长边最大8192px，支持jpg/jpeg/png/bmp格式优先级：image > url > pdf_file，当image字段存在时，url字段失效请注意关闭URL防盗链", type: "和 image/pdf_file 三选一", flag: "true", dataType: "string", schema: "" },
      { id: "1-30-3", name: "pdf_file", explain: "PDF文件，base64编码后进行urlencode，要求base64编码和urlencode后大小不超过10M，最短边至少15px，最长边最大8192px优先级：image > url > pdf_file，当image、url字段存在时，pdf_file字段失效", type: "和 image/url 三选一", flag: "true", dataType: "string", schema: "" },
      { id: "1-30-4", name: "pdf_file_num", explain: "需要识别的PDF文件的对应页码，当 pdf_file 参数有效时，识别传入页码的对应页面内容，若不传入，则默认识别第 1 页/false,是否返回每行的四角点坐标。默认为false", type: "否", flag: "true", dataType: "string", schema: "" },
      { id: "1-30-5", name: "language_type", explain: "识别语言类型，默认为CHN_ENG可选值包括： - auto_detect：自动检测语言，并识别- CHN_ENG：中英文混合- ENG：英文- JAP：日语- KOR：韩语 - FRE：法语 - SPA：西班牙语- POR：葡萄牙语 - GER：德语- ITA：意大利语- RUS：俄语- DAN：丹麦语- DUT：荷兰语- MAL：马来语 - SWE：瑞典语- IND：印尼语 - POL：波兰语- ROM：罗马尼亚语- TUR：土耳其语- GRE：希腊语- HUN：匈牙利语- THA：泰语- VIE：越南语- ARA：阿拉伯语- HIN：印地语", type: "否", flag: "true", dataType: "string", schema: "" },
      { id: "1-30-6", name: "detect_direction", explain: "是否检测图像朝向，默认不检测，即：false。朝向是指输入图像是正常方向、逆时针旋转90/180/270度。可选值包括:- true：检测朝向；- false：不检测朝向", type: "true/false", flag: "true", dataType: "string", schema: "" },
      { id: "1-30-7", name: "paragraph", explain: "是否输出段落信息", type: "true/false", flag: "true", dataType: "string", schema: "" },
      { id: "1-30-8", name: "probability", explain: "是否返回识别结果中每一行的置信度", type: "true/false", flag: "true", dataType: "string", schema: "" },
    ]
  },
  //		asr（汇联，上传文件）
  asrForUploadFileWithHuilan: {
    id: "1-30",
    name: "asrForUploadFileWithHuilan",
    explain: "汇联，上传文件",
    type: "",
    flag: "true",
    dataType: "asrForUploadFileWithHuilan",
    schema: "asrForUploadFileWithHuilan",
    children: [
      { id: "1-30-1", name: "file", explain: "form-data格式文件", type: "", flag: "true", dataType: "form-data", schema: "" },
    ]
  },
  //		办公文档识别，百度
  docAnalysisOfficeWithBaidu: {
    id: "1-31",
    name: "docAnalysisOfficeWithBaidu",
    explain: "办公文档识别，百度",
    type: "",
    flag: "true",
    dataType: "docAnalysisOfficeWithBaidu",
    schema: "docAnalysisOfficeWithBaidu",
    children: [
      { id: "1-31-1", name: "appKey", explain: "appKey，内部使用，不需要赋值", type: "", flag: "true", dataType: "string", schema: "" },
      { id: "1-31-2", name: "appSecret", explain: "appSecret，内部使用，不需要赋值", type: "", flag: "true", dataType: "string", schema: "" },
      { id: "1-31-3", name: "detect_direction", explain: "	true/false，是否检测图像朝向，默认不检测，即：false。朝向是指输入图像是正常方向、逆时针旋转90/180/270度。可选值包括:\n- true：检测朝向；\n- false：不检测朝向", type: "", flag: "true", dataType: "string", schema: "" },
      { id: "1-31-4", name: "disp_line_poly", explain: "true/false,是否返回每行的四角点坐标。默认为false", type: "", flag: "true", dataType: "string", schema: "" },
      { id: "1-31-5", name: "erase_seal", explain: "	true/false,是否先擦除水印、印章后再识别文档", type: "", flag: "true", dataType: "string", schema: "" },
      { id: "1-31-6", name: "image", explain: "和 url/pdf_file 三选一：图像数据，base64编码后进行urlencode，要求base64编码和urlencode后大小不超过4M，最短边至少15px，最长边最大4096px，支持jpg/jpeg/png/bmp格式\n优先级：image > url > pdf_file，当image字段存在时，url、pdf_file字段失效", type: "", flag: "true", dataType: "string", schema: "" },
      { id: "1-31-7", name: "language_type", explain: "	CHN_ENG/ ENG,识别语言类型，默认为CHN_ENG\n可选值包括：\n=CHN_ENG：中英文\n=ENG：英文", type: "", flag: "true", dataType: "string", schema: "" },
      { id: "1-31-8", name: "layout_analysis", explain: "	true/false,是否分析文档版面：包括layout（图、表、标题、段落、目录）；attribute（栏、页眉、页脚、页码、脚注）的分析输出", type: "", flag: "true", dataType: "string", schema: "" },
      { id: "1-31-9", name: "line_probability", explain: "true/false,是否返回每行识别结果的置信度。默认为false	", type: "", flag: "true", dataType: "string", schema: "" },
      { id: "1-31-10", name: "pdf_file", explain: "	和 image/url 三选一：PDF文件，base64编码后进行urlencode，要求base64编码和urlencode后大小不超过4M，最短边至少15px，最长边最大4096px\n优先级：image > url > pdf_file，当image、url字段存在时，pdf_file字段失效", type: "", flag: "true", dataType: "string", schema: "" },
      { id: "1-31-11", name: "pdf_file_num", explain: "需要识别的PDF文件的对应页码，当 pdf_file 参数有效时，识别传入页码的对应页面内容，若不传入，则默认识别第 1 页", type: "", flag: "true", dataType: "string", schema: "" },
      { id: "1-31-12", name: "result_type", explain: "big/small,返回识别结果是按单行结果返回，还是按单字结果返回，默认为big。\n=big：返回行识别结果\n=small：返回行识别结果之上还会返回单字结果", type: "", flag: "true", dataType: "string", schema: "" },
      { id: "1-31-13", name: "url", explain: "和 image/pdf_file 三选一：图片完整url，url长度不超过1024字节，url对应的图片base64编码后大小不超过4M，最短边至少15px，最长边最大4096px，支持jpg/jpeg/png/bmp格式\n优先级：image > url > pdf_file，当image字段存在时，url字段失效\n请注意关闭URL防盗链", type: "", flag: "true", dataType: "string", schema: "" },
      { id: "1-31-14", name: "words_type", explain: "	handwring_only/ handprint_mix,文字类型。\n默认：印刷文字识别\n= handwring_only：手写文字识别\n= handprint_mix： 手写印刷混排识别", type: "", flag: "true", dataType: "string", schema: "" },
    ]
  },
  //身份证正面back身份证背面
  idcardWithBaidu: {
    id: "1-31",
    name: "idcardWithBaidu",
    explain: "身份证识别，百度",
    type: "",
    flag: "true",
    dataType: "idcardWithBaidu",
    schema: "idcardWithBaidu",
    children: [
      { id: "1-31-1", name: "appKey", explain: "appKey，内部使用，不需要赋值", type: "", flag: "true", dataType: "string", schema: "" },
      { id: "1-31-2", name: "appSecret", explain: "appSecret，内部使用，不需要赋值", type: "", flag: "true", dataType: "string", schema: "" },
      { id: "1-31-3", name: "detect_card", explain: "是否检测身份证进行裁剪，默认不检测。可选值：true-检测身份证并返回证照的 base64 编码及位置信息", type: "", flag: "true", dataType: "string", schema: "" },
      { id: "1-31-4", name: "detect_photo", explain: "是否检测头像内容，默认不检测。可选值：true-检测头像并返回头像的 base64 编码及位置信息", type: "", flag: "true", dataType: "string", schema: "" },
      { id: "1-31-5", name: "detect_quality", explain: "是否开启身份证质量类型(边框/四角不完整、头像或关键字段被遮挡/马赛克)检测功能，默认不开启，即：false。\n- true：开启，请查看返回参数card_quality；\n- false：不开启", type: "", flag: "true", dataType: "string", schema: "" },
      { id: "1-31-6", name: "detect_risk", explain: "是否开启身份证风险类型(身份证复印件、临时身份证、身份证翻拍、修改过的身份证)检测功能，默认不开启，即：false。\n- true：开启，请查看返回参数risk_type；\n- false：不开启", type: "", flag: "true", dataType: "string", schema: "" },
      { id: "1-31-7", name: "id_card_side", explain: "	-front：身份证含照片的一面\n-back：身份证带国徽的一面\n自动检测身份证正反面，如果传参指定方向与图片相反，支持正常识别，返回参数image_status字段为reversed_side", type: "", flag: "true", dataType: "string", schema: "" },
      { id: "1-31-8", name: "image", explain: "和url二选一：图像数据，base64编码后进行urlencode，要求base64编码和urlencode后大小不超过4M，最短边至少15px，最长边最大4096px,支持jpg/jpeg/png/bmp格式", type: "", flag: "true", dataType: "string", schema: "" },
      { id: "1-31-9", name: "url", explain: "	和image二选一：图片完整URL，URL长度不超过1024字节，URL对应的图片base64编码后大小不超过4M，最短边至少15px，最长边最大4096px,支持jpg/jpeg/png/bmp格式，当image字段存在时url字段失效\n请注意关闭URL防盗链", type: "", flag: "true", dataType: "string", schema: "" },
    ]
  },
  //语音合成restful，阿里云
  speechSynthesizerRestfulWithAliyun: {
    id: "1-32",
    name: "speechSynthesizerRestfulWithAliyun",
    explain: "语音合成restful，阿里云",
    type: "",
    flag: "true",
    dataType: "语音合成，阿里云 https://help.aliyun.com/document_detail/84435.html",
    schema: "语音合成，阿里云 https://help.aliyun.com/document_detail/84435.html",
    children: [
      { id: "1-32-1", name: "appKey", explain: "appKey", type: "", flag: "true", dataType: "string", schema: "" },
      { id: "1-32-2", name: "appParam", explain: "appParam", type: "", flag: "true", dataType: "string", schema: "" },
      { id: "1-32-3", name: "appSecret", explain: "appSecret", type: "", flag: "true", dataType: "string", schema: "" },
      { id: "1-32-4", name: "format", explain: "音频编码格式，默认值：PCM。支持PCM/WAV/MP3格式。", type: "", flag: "true", dataType: "string", schema: "" },
      { id: "1-32-5", name: "pitch_rate", explain: "语调，取值范围：-500～500，默认值：0。", type: "", flag: "true", dataType: "integer", schema: "" },
      { id: "1-32-6", name: "sample_rate", explain: "音频采样率，默认值：16000 Hz。", type: "", flag: "true", dataType: "integer", schema: "" },
      { id: "1-32-7", name: "speech_rate", explain: "语速，取值范围：-500～500，默认值：0。\n\n[-500, 0, 500] 对应的语速倍速区间为 [0.5, 1.0, 2.0]。\n\n-500表示默认语速的0.5倍速。\n\n0表示默认语速的1倍速。1倍速是指模型默认输出的合成语速，语速会依据每一个发音人略有不同，大概每秒钟4个字左右。\n\n500表示默认语速的2倍速。\n\n计算方法如下：\n\n0.8倍速（1-1/0.8)/0.002 = -125\n\n1.2倍速（1-1/1.2)/0.001 = 166\n\n说明 \n小于1倍速时，使用0.002系数。\n\n大于1倍速时，使用0.001系数。\n\n实际算法结果取近似值。	", type: "", flag: "true", dataType: "integer", schema: "" },
      { id: "1-32-8", name: "text", explain: "	待合成文本，文本内容必须采用UTF-8编码，长度不超过300个字符（英文字母之间需要添加空格）", type: "", flag: "true", dataType: "string", schema: "" },
      { id: "1-32-9", name: "voice", explain: "	发音人，默认是xiaoyun。	", type: "", flag: "true", dataType: "string", schema: "" },
      { id: "1-32-10", name: "volume", explain: "音量，取值范围：0～100。默认值：50。", type: "", flag: "true", dataType: "integer", schema: "" },
    ]
  },
  //录音文件识别，阿里云本地
  recordingFileAsrWithAliyun: {
    id: "1-33",
    name: "recordingFileAsrWithAliyun",
    explain: "录音文件识别，阿里云本地",
    type: "",
    flag: "true",
    dataType: "录音文件识别，阿里云 https://help.aliyun.com/document_detail/90727.html",
    schema: "录音文件识别，阿里云 https://help.aliyun.com/document_detail/90727.html",
    children: [
      { id: "1-33-1", name: "begin_time", explain: "有效时间段的起始点时间偏移，单位为毫秒", type: "", flag: "true", dataType: "	integer(int32)", schema: "" },
      { id: "1-33-2", name: "channel_id", explain: "有效时间段的作用音轨序号（从0开始）。", type: "", flag: "true", dataType: "	integer(int32)", schema: "" },
      { id: "1-33-3", name: "end_time", explain: "有效时间段的结束点时间偏移，单位为毫秒。", type: "", flag: "true", dataType: "	integer(int32)", schema: "" },
    ]
  },
  //		chatgpt接口
  chatgptForOpenAi: {
    id: "1-34",
    name: "chatgptForOpenAi",
    explain: "chatgpt接口",
    type: "",
    flag: "true",
    dataType: "",
    schema: "",
    children: [
      { id: "1-34-1", name: "input_text", explain: "用户输入的文本", type: "", flag: "true", dataType: "string", schema: "" },
      { id: "1-34-2", name: "top_p", explain: "代表 nucleus sampling，另外一种采样算法，模型考虑只取前top_p概率的token，如0.1取值，意味取概率值在前10%的那些token才会输出。Defaults to 1", type: "", flag: "false", dataType: "	integer(int32)", schema: "" },
      { id: "1-34-3", name: "temperature", explain: "即Temperature sampling，0-2之间取值. 较大的值如 0.8 will 会使输出更加随机, 而较小的值如0.2，会使输出更加聚焦和确定。Defaults to 1", type: "", flag: "false", dataType: "	integer(int32)", schema: "" },
      { id: "1-34-4", name: "history", explain: "可选，之前的聊天历史列表，每轮对话按照用户-回答这样的顺序依次输出", type: "", flag: "false", dataType: "	array", schema: "" },
    ]
  },
  //		文生图接口
  txtToImgForHuilan: {
    id: "1-35",
    name: "txtToImgForHuilan",
    explain: "文生图接口",
    type: "",
    flag: "true",
    dataType: "",
    schema: "",
    children: [
      { id: "1-35-1", name: "input_text", explain: "用户输入的文本", type: "", flag: "true", dataType: "string", schema: "" },
      { id: "1-35-2", name: "batch_size", explain: "根据用户输入的文本生成的图片的数量", type: "", flag: "true", dataType: "	integer(int32)", schema: "" },
      { id: "1-35-3", name: "width", explain: "图片的宽度", type: "", flag: "true", dataType: "	integer(int32)", schema: "" },
      { id: "1-35-4", name: "height", explain: "图片的高度", type: "", flag: "true", dataType: "	integer(int32)", schema: "" },
    ]
  },
  // 汇联对话
  chatgptForHuilan: {
    id: "1-36",
    name: "chatgptForHuilan",
    explain: "汇联对话接口",
    type: "",
    flag: "true",
    dataType: "",
    schema: "",
    children: [
      { id: "1-36-1", name: "input_text", explain: "用户输入的文本", type: "", flag: "true", dataType: "	string", schema: "" },
    ]
  },
}

const responseStatus = [
  { code: "200", message: "OK", schema: "R" },
  { code: "201", message: "Created", schema: "" },
  { code: "401", message: "Unauthorized", schema: "" },
  { code: "403", message: "Forbidden", schema: "" },
  { code: "404", message: "Not Found", schema: "" },
]
const responseParameterHead = {
  name: "code",
  message: "",
  type: "integer",
  schema: "integer",
}
const responseParameterCen = { name: "msg", message: "", type: "string	", schema: "" }
const responseParameterBot = { name: "success", message: "", type: "boolean	", schema: "" }
const responseParameter = {
  //关键词提取
  extractKeywordsFromTxt: [
    responseParameterHead,
    {
      id: '1', name: "extractKeywordsFromTxtResponse", message: "关键词提取返回值", type: "array	", schema: "string"
    },
    responseParameterCen,
    responseParameterBot
  ],
  //新词发现
  discoverNewWords: [
    responseParameterHead,
    {
      id: '1', name: "discoverNewWordsResponse", message: "发现新词返回值", type: "新词发现返回值	", schema: "新词发现返回值", children: [
        { id: '1-1', name: "highEntropyRateThreshold", message: "高要求新词的自由度阈值,必须大于等于2.54,默认2.54", type: "string	", schema: "" },
        { id: '1-2', name: "highSolidRateThreshold", message: "高要求新词的凝聚度阈值,必须大于等于50,默认500", type: "string	", schema: "" },
        {
          id: '1-3', name: "newWords", message: "用于发现新词的文本内容", type: "array	", schema: "新词发现返回值NewWordResult", children: [
            { id: '1-3-1', name: "entropyRate", message: "自由度", type: "number	", schema: "" },
            { id: '1-3-2', name: "highLevel", message: "是否高等级新词", type: "boolean	", schema: "" },
            { id: '1-3-3', name: "solidRate", message: "凝聚度", type: "number", schema: "" },
            { id: '1-3-4', name: "word", message: "新词", type: "string", schema: "" }
          ]
        },
        { id: '1-4', name: "tenantId", message: "租户id", type: "string	", schema: "" }
      ]
    },
    responseParameterCen,
    responseParameterBot
  ],
  //分词
  splitSentences: [
    responseParameterHead,
    {
      id: '1', name: "splitSentencesResponse", message: "分词返回值", type: "分词返回值	", schema: "分词返回值", children: [
        { id: '1-1', name: "splitSentences", message: "返回的句⼦", type: "array", schema: "string" },
        { id: '1-2', name: "tenantId", message: "租户id", type: "string", schema: "" },
      ]
    },
    responseParameterCen,
    responseParameterBot
  ],
  //语种识别
  charDetect: [
    responseParameterHead,
    {
      id: '1', name: "charDetectResponse", message: "语言检测返回值", type: "语言检测返回值	", schema: "语言检测返回值", children: [
        { id: '1-1', name: "confidence", message: "confidence", type: "string", schema: "" },
        { id: '1-2', name: "encoding", message: "编码", type: "string", schema: "" },
        { id: '1-3', name: "language", message: "语言（英文）", type: "string", schema: "" },
        { id: '1-4', name: "language", message: "语言（中文）", type: "string", schema: "" },
      ]
    },
    responseParameterCen,
    responseParameterBot
  ],
  //实体提取
  extractEntities: [
    responseParameterHead,
    {
      id: '1', name: "extractEntitiesResponse", message: "实体提取返回值", type: "实体提取返回值	", schema: "实体提取返回值", children: [
        {
          id: '1-1', name: "entityWords", message: "confidence", type: "array", schema: "", children: [
            { id: '1-2-1', name: "begin", message: "", type: "integer", schema: "" },
            { id: '1-2-2', name: "end", message: "", type: "integer", schema: "" },
            { id: '1-2-3', name: "entityNames", message: "返回的", type: "array", schema: "string" },
            { id: '1-2-4', name: "word", message: "", type: "string", schema: "" },
          ]
        },
        { id: '1-2', name: "sentence", message: "句⼦", type: "string", schema: "" },
        { id: '1-3', name: "tenantId", message: "租户id", type: "string", schema: "" },
      ]
    },
    responseParameterCen,
    responseParameterBot
  ],
  //摘要提取
  extractSummary: [
    responseParameterHead,
    {
      id: '1', name: "extractSummaryResponse", message: "摘要提取返回值", type: "摘要提取返回值	", schema: "摘要提取返回值", children: [
        { id: '1-1', name: "summary", message: "摘要", type: "string", schema: "" }
      ]
    },
    responseParameterCen,
    responseParameterBot
  ],
  //敏感词过滤
  findSensitiveWords: [
    responseParameterHead,
    {
      id: '1', name: "findSensitiveWordsResponse", message: "敏感词提取返回值", type: "敏感词过滤	", schema: "敏感词过滤", children: [
        { id: '1-1', name: "enableSystemWords", message: "是否启⽤系统敏感词", type: "string", schema: "" },
        { id: '1-2', name: "enableTenantWords", message: "是否启⽤租户敏感词", type: "string", schema: "" },
        {
          id: '1-3', name: "sensitiveWordsResult", message: "⼀批句⼦", type: "array", schema: "	敏感词过滤Response &gt; WordsResult", children: [
            { id: '1-3-1', name: "begin", message: "", type: "integer", schema: "" },
            { id: '1-3-2', name: "end	", message: "", type: "integer", schema: "" },
            { id: '1-3-3', name: "text", message: "", type: "string", schema: "" },
            { id: '1-3-4', name: "wordTable", message: "", type: "string", schema: "" },
          ]
        },
        { id: '1-4', name: "tenantId", message: "租户id", type: "string", schema: "" },
      ]
    },
    responseParameterCen,
    responseParameterBot
  ],
  //从聊天记录或文档挖掘QA
  miningQA: [
    responseParameterHead,
    {
      id: '1', name: "miningQAResponse", message: "从聊天记录或文档挖掘QA返回值", type: "从聊天记录或文档挖掘QA返回值	", schema: "从聊天记录或文档挖掘QA返回值", children: [
        { id: '1-1', name: "err", message: "用出错信息", type: "string", schema: "" },
        {
          id: '1-2', name: "qaList", message: "提取出的QA⼦", type: "array", schema: "从聊天记录或文档挖掘QA返回值MuddyQA", children: [
            { id: '1-2-1', name: "answer", message: "答案", type: "string", schema: "" },
            { id: '1-2-2', name: "id	", message: "id", type: "string", schema: "" },
            {
              id: '1-2-3', name: "knowledgePoint", message: "提取出的QA⼦", type: "array", schema: "从聊天记录或文档挖掘QA返回值MuddyKnowledgePoint", children: [
                { id: '1-2-3-1', name: "existedKnowledgePointId	", message: "知识库中已存在的知识点ID", type: "string", schema: "" },
                { id: '1-2-3-2', name: "id	", message: "id", type: "string", schema: "" },
                { id: '1-2-3-3', name: "words", message: "标签词", type: "array", schema: "string" },
              ]
            },
            { id: '1-2-4', name: "orderNo", message: "顺序号", type: "integer", schema: "" },
            { id: '1-2-5', name: "question", message: "问题", type: "string", schema: "" },
          ]
        },
        {
          id: '1-3', name: "sentence", message: "句⼦", type: "array", schema: ""
        },
        { id: '1-4', name: "tenantId", message: "租户id", type: "string", schema: "" },
      ]
    },
    responseParameterCen,
    responseParameterBot
  ],
  //句子聚类
  sentenceCluster: [
    responseParameterHead,
    {
      id: '1', name: "sentenceClusterResponse", message: "句子聚类返回值", type: "句子聚类返回值	", schema: "句子聚类返回值", children: [
        {
          id: '1-1', name: "groups", message: "句⼦", type: "array", schema: "句子聚类返回值Group", children: [
            { id: '1-1-1', name: "groupId", message: "groupId", type: "integer", schema: "" },
            {
              id: '1-1-2', name: "sentences	", message: "	句⼦", type: "array", schema: "句子聚类返回值Sentence", children: [
                { id: '1-2-1', name: "groupId", message: "groupId", type: "integer", schema: "" },
                { id: '1-2-2', name: "index", message: "index", type: "integer", schema: "" },
                { id: '1-2-3', name: "text", message: "text", type: "string", schema: "" },
              ]
            },
          ]
        },
        { id: '1-2', name: "tenantId", message: "	租户id", type: "string", schema: "" },
        { id: '1-3', name: "serviceCode", message: "服务编码", type: "string", schema: "" },
      ]
    },
    responseParameterCen,
    responseParameterBot
  ],
  //句法分析
  syntacticAnalysis: [
    responseParameterHead,
    {
      id: '1', name: "syntacticAnalysisResponse", message: "句法分析返回值", type: "string	", schema: ""
    },
    responseParameterCen,
    responseParameterBot
  ],
  //文档切分句子
  splitToSentences: [
    responseParameterHead,
    {
      id: '1', name: "splitToSentencesResponse", message: "文档切分句子返回值", type: "文档切分句子返回值", schema: "文档切分句子返回值", children: [
        { id: '1-1', name: "sentences", message: "句⼦", type: "array", schema: "	string" },
        { id: '1-2', name: "tenantId", message: "租户id", type: "string", schema: "" }
      ]
    },
    responseParameterCen,
    responseParameterBot
  ],
  //短文本相似度计算
  senSim: [
    responseParameterHead,
    {
      id: '1', name: "senSimResponse", message: "短文本相似度计算返回值", type: "短文本相似度计算返回值	", schema: "短文本相似度计算返回值", children: [
        {
          id: '1-1', name: "句⼦", message: "句⼦", type: "array", schema: "	短文本相似度计算返回值SentenceScores", children: [
            { id: '1-1-1', name: "originalIndex", message: "originalIndex", type: "integer", schema: "	string" },
            { id: '1-1-2', name: "score", message: "score", type: "number", schema: "	string" },
            { id: '1-1-3', name: "sentence", message: "sentence", type: "string", schema: "	string" }
          ]
        },
        { id: '1-2', name: "租户id", message: "句⼦", type: "string", schema: "" }
      ]
    },
    responseParameterCen,
    responseParameterBot
  ],
  //NLP数学计算器
  mathCompute: [
    responseParameterHead,
    {
      id: '1', name: "mathComputeResponse", message: "NLP数学计算器返回值", type: "mathComputeResponse	", schema: "mathComputeResponse", children: [
        { id: '1-1', name: "certain", message: "certain", type: "boolean", schema: "" },
        { id: '1-2', name: "equation", message: "	数学等式", type: "string", schema: "" },
        { id: '1-3', name: "sentence", message: "句子", type: "string", schema: "" },
        { id: '1-4', name: "tenantId", message: "租户id", type: "string", schema: "" },
        { id: '1-5', name: "value", message: "值", type: "string", schema: "" },
      ]
    },
    responseParameterCen,
    responseParameterBot
  ],
  // 挖掘词共现(可作为知识点，也可作为标签)
  miningWordCoOccurrences: [
    responseParameterHead,
    {
      id: '1', name: "miningWordCoOccurrencesResponse", message: "挖掘词共现(可作为知识点，也可作为标签)返回值", type: "挖掘词共现返回值", schema: "挖掘词共现返回值", children: [
        {
          id: '1-1', name: "tenantId", message: "租户id", type: "string", schema: ""
        },
        {
          id: '1-2', name: "wordCoOccurrences", message: "wordCoOccurrences", type: "array", schema: "", children: [
            { id: '1-2-1', name: "sentences", message: "句子", type: "array", schema: "string" },
            { id: '1-2-2', name: "words", message: "词", type: "array", schema: "string" }
          ]
        }
      ]
    },
    responseParameterCen,
    responseParameterBot
  ],
  // 标签提取
  extractTags: [
    responseParameterHead,
    {
      id: '1', name: "extractTagsResponse", message: "标签提取返回值", type: "array	", schema: "string"
    },
    responseParameterCen,
    responseParameterBot
  ],
  // 提取年月日返回值
  extractYearMonth: [
    responseParameterHead,
    {
      id: '1', name: "extractYearMonthResponse", message: "提取年月日返回值", type: "array	", schema: "extractYearMonthResponse", children: [
        { id: '1-1', name: "dateStr", message: "dateStr", type: "string	", schema: "" },
        { id: '1-2', name: "fromDateVal", message: "fromDateVal", type: "string	", schema: "" },
        { id: '1-3', name: "fromMonthVal", message: "fromMonthVal", type: "string	", schema: "" },
        { id: '1-4', name: "fromYearVal", message: "fromYearVal", type: "string	", schema: "" },
        { id: '1-5', name: "mask", message: "mask", type: "string	", schema: "" },
        { id: '1-6', name: "monthStr", message: "monthStr", type: "string	", schema: "" },
        { id: '1-7', name: "	sentence", message: "sentence", type: "string	", schema: "" },
        { id: '1-8', name: "租户id", message: "租户id", type: "string	", schema: "" },
        { id: '1-9', name: "toDateVal", message: "toDateVal", type: "string	", schema: "" },
        { id: '1-10', name: "toMonthVal", message: "toMonthVal", type: "string	", schema: "" },
        { id: '1-11', name: "toYearVal", message: "toYearVal", type: "string	", schema: "" },
        { id: '1-12', name: "yearStr", message: "yearStr", type: "string	", schema: "" },
      ]
    },
    responseParameterCen,
    responseParameterBot
  ],
  // 计算文本的SimHash
  simHash: [
    responseParameterHead,
    {
      id: '1', name: "simHashResponse", message: "计算文本的SimHash返回值", type: "array	", schema: "simHashResponse", children: [
        { id: '1-1', name: "hash", message: "", type: "array	", schema: "integer" },
        { id: '1-2', name: "tenantId", message: "租户id", type: "string	", schema: "" },
        { id: '1-3', name: "text", message: "文本", type: "string	", schema: "" },
      ]
    },
    responseParameterCen,
    responseParameterBot
  ],
  // 计算SimHash的相似度
  simHashSim: [
    responseParameterHead,
    {
      id: '1', name: "simHashSimResponse", message: "计算SimHash的相似度返回值", type: "array	", schema: "simHashSimResponse", children: [
        {
          id: '1-1', name: "simHashSimilarityList", message: "simHashSimilarityList", type: "array	", schema: "计算SimHash的相似度返回值&gt;SimHashSimResponseSimHashSimilarity", children: [
            { id: '1-1-1', name: "distance", message: "distance", type: "integer	", schema: "" },
            { id: '1-1-2', name: "index", message: "index", type: "integer	", schema: "" },
            { id: '1-1-3', name: "similar", message: "sourceHash", type: "boolean	", schema: "" },
          ]
        },
        { id: '1-2', name: "tenantId", message: "租户id", type: "string	", schema: "" },
      ]
    },
    responseParameterCen,
    responseParameterBot
  ],
  // 执行lua脚本
  runLuaScript: [
    responseParameterHead,
    {
      id: '1', name: "runLuaScriptResponse", message: "执行lua脚本返回值", type: "runLuaScriptResponse", schema: "runLuaScriptResponse", children: [
        {
          id: '1-1', name: "contextSession", message: "simHashSimilarityList", type: "object	", schema: "计算SimHash的相似度返回值&gt;SimHashSimResponseSimHashSimilarity"
        },
        { id: '1-2', name: "exceptionMessage", message: "exceptionMessage", type: "string	", schema: "" },
        { id: '1-3', name: "inputs", message: "inputs", type: "object	", schema: "" },
        { id: '1-4', name: "luaScript", message: "luaScript", type: "string	", schema: "" },
        { id: '1-5', name: "outputs", message: "outputs", type: "object	", schema: "" },
        { id: '1-6', name: "status", message: "status", type: "string	", schema: "" },
      ]
    },
    responseParameterCen,
    responseParameterBot
  ],
  // 成分句法分析服务
  componentAnalysis: [
    responseParameterHead,
    {
      id: '1', name: "componentAnalysisResponse", message: "成分句法分析返回值", type: "object", schema: ""
    },
    responseParameterCen,
    responseParameterBot
  ],
  // 短语句法分析服务List
  componentAnalysisList: [
    responseParameterHead,
    {
      id: '1', name: "componentAnalysisListResponse", message: "成分句法分析List返回值", type: "object", schema: ""
    },
    responseParameterCen,
    responseParameterBot
  ],
  // 语义依存分析服务
  semanticDependencyAnalysis: [
    responseParameterHead,
    {
      id: '1', name: "semanticDependencyAnalysisResponse", message: "语义依存分析服务返回值", type: "object", schema: ""
    },
    responseParameterCen,
    responseParameterBot
  ],
  // 语义依存分析服务List
  semanticDependencyAnalysisList: [
    responseParameterHead,
    {
      id: '1', name: "semanticDependencyAnalysisListResponse", message: "语义依存分析服务List返回值", type: "object", schema: ""
    },
    responseParameterCen,
    responseParameterBot
  ],
  // 语义角色标注服务
  semanticRoleLabeling: [
    responseParameterHead,
    {
      id: '1', name: "semanticRoleLabelingResponse", message: "语义角色标注服务返回值", type: "object", schema: ""
    },
    responseParameterCen,
    responseParameterBot
  ],
  // 语义角色标注服务List返回值
  semanticRoleLabelingList: [
    responseParameterHead,
    {
      id: '1', name: "semanticRoleLabelingListResponse", message: "语义角色标注服务List返回值", type: "object", schema: ""
    },
    responseParameterCen,
    responseParameterBot
  ],
  // 	情感分析
  affectiveAnalysis: [
    responseParameterHead,
    {
      id: '1', name: "affectiveAnalysisResponse", message: "情感分析返回值", type: "affectiveAnalysisResponse", schema: "affectiveAnalysisResponse", children: [
        { id: '1-1', name: "probability", message: "probability", type: "number", schema: "" },
        { id: '1-2', name: "sentiment", message: "sentiment(positive/negative/neutral，积极/消极/中性)", type: "string", schema: "" },
        { id: '1-3', name: "text", message: "租户id", type: "string", schema: "" }
      ]
    },
    responseParameterCen,
    responseParameterBot
  ],
  // 	标签词对句子的打分及排序返回值
  tagSenSim: [
    responseParameterHead,
    {
      id: '1', name: "tagSenSimResponse", message: "originalIndex", type: "tagSenSimResponse", schema: "tagSenSimResponse", children: [
        { id: '1-1', name: "originalIndex", message: "originalIndex", type: "integer", schema: "" },
        { id: '1-2', name: "score", message: "score", type: "number", schema: "" },
        { id: '1-3', name: "sentence", message: "sentence", type: "string", schema: "" }
      ]
    },
    responseParameterCen,
    responseParameterBot
  ],
  // 	汇联上传文件tts返回值
  ttsWithHuilan: [
    responseParameterHead,
    {
      id: '1', name: "ttsWithHuilanResponse", message: "汇联上传文件tts返回值", type: "ttsWithHuilanResponse", schema: "ttsWithHuilanResponse", children: [
        {
          id: '1-1', name: "act_durations", message: "	act_durations", type: "array", schema: "TtsWithHuilan返回值TtsResponseActDuration", children: [
            { id: '1-1-1', name: "act", message: "act", type: "string", schema: "" },
            { id: '1-1-2', name: "begin", message: "begin", type: "number", schema: "" },
            { id: '1-1-3', name: "duration", message: "duration", type: "number", schema: "" },
            { id: '1-1-4', name: "ph", message: "ph", type: "string", schema: "" },
          ]
        },
        { id: '1-2', name: "audio", message: "音频base64", type: "string", schema: "" },
        { id: '1-3', name: "errorMsg", message: "错误信息", type: "string", schema: "" },
        { id: '1-4', name: "format", message: "句⼦", type: "string", schema: "" },
        {
          id: '1-5', name: "ph_durations", message: "ph_durations", type: "array", schema: "", children: [
            { id: '1-5-1', name: "begin", message: "begin", type: "number", schema: "" },
            { id: '1-5-2', name: "duration", message: "duration", type: "number", schema: "" },
            { id: '1-5-3', name: "ph", message: "	ph", type: "string", schema: "" },
          ]
        },
      ]
    },
    responseParameterCen,
    responseParameterBot
  ],
  // 		通用文字识别，高精度版，百度,返回值
  accurateBasicOcrWithBaidu: [
    responseParameterHead,
    {
      id: '1', name: "accurateBasicOcrWithBaiduResponse", message: "通用文字识别，高精度版，百度,返回值", type: "accurateBasicOcrWithBaiduResponse", schema: "accurateBasicOcrWithBaiduResponse", children: [
        { id: '1-1', name: "direction", message: "	图像方向，当 detect_direction=true 时返回该字段。\n- - 1：未定义，\n- 0：正向，\n- 1：逆时针90度，\n- 2：逆时针180度，\n- 3：逆时针270度", type: "string", schema: "" },
        { id: '1-2', name: "errorMsg", message: "	错误信息", type: "string", schema: "" },
        { id: '1-3', name: "log_id", message: "唯一的log id，用于问题定位", type: "object", schema: "" },
        { id: '1-4', name: "paragraphs_result", message: "段落检测结果，当 paragraph=true 时返回该字段", type: "string", schema: "" },
        { id: '1-5', name: "pdf_file_size", message: "传入PDF文件的总页数，当 pdf_file 参数有效时返回该字段", type: "string", schema: "" },
        { id: '1-6', name: "words_result", message: "识别结果数组", type: "object", schema: "" },
        { id: '1-7', name: "words_result_num", message: "识别结果数，表示words_result的元素个数", type: "integer", schema: "" },
      ]
    },
    responseParameterCen,
    responseParameterBot
  ],
  // 		办公文档识别，百度,返回值
  docAnalysisOfficeWithBaidu: [
    responseParameterHead,
    {
      id: '1', name: "docAnalysisOfficeWithBaiduResponse", message: "错误信息", type: "（通用文字识别，高精度版，百度）返回值 https://ai.baidu.com/ai-doc/OCR/ykg9c09ji", schema: "（通用文字识别，高精度版，百度）返回值 https://ai.baidu.com/ai-doc/OCR/ykg9c09ji", children: [
        { id: '1-1', name: "errorMsg", message: "	错误信息", type: "string", schema: "" },
        { id: '1-2', name: "img_direction", message: "detect_direction=true 时返回该字段。检测到的图像朝向，0 ：正向； 1：逆时针旋转90度；2：逆时针旋转180度；3：逆时针旋转270度", type: "integer", schema: "" },
        { id: '1-3', name: "layouts", message: "每个「栏：section」里面的文档版面模块数组，包含表格、图、段落文本、标题、目录等5个模块；每个模块的坐标位置；段落文本和表格内文本内容对应的行序号id。", type: "object", schema: "" },
        { id: '1-4', name: "layouts_num", message: "	版面分析结果数，表示layout的元素个数", type: "integer", schema: "" },
        { id: '1-5', name: "log_id", message: "	唯一的log id，用于问题定位", type: "string", schema: "" },
        { id: '1-6', name: "pdf_file_size", message: "	传入PDF文件的总页数，当 pdf_file 参数有效时返回该字段", type: "string", schema: "" },
        { id: '1-7', name: "results", message: "识别结果数组", type: "object", schema: "" },
        { id: '1-8', name: "results_num", message: "	识别结果数，表示results的元素个数", type: "integer", schema: "" },
        { id: '1-9', name: "sec_cols", message: "	将所有的版面中的「分栏」内容表示成 M x N 的网格，sec_cols = N", type: "integer", schema: "" },
        { id: '1-10', name: "sec_rows", message: "	将所有的版面中的「栏:section」内容表示成 M x N 的网格，sec_rows = M", type: "integer", schema: "" },
        { id: '1-11', name: "sections", message: "一张图片中包含的5大版面属性，包含：栏，页眉，页脚，页码，脚注，该数组里有属性的标签、属性的位置、属性所包含文本内容的id序号。\n其中，栏（section）里面包含5个模块内容，有：表格、图、段落文本、标题、目录（在返回参数layouts里输出）。", type: "object", schema: "" },
      ]
    },
    responseParameterCen,
    responseParameterBot
  ],
  // 		asr接口,汇联，上传文件返回值
  asrForUploadFileWithHuilan: [
    responseParameterHead,
    {
      id: '1', name: "asrForUploadFileWithHuilan", message: "asr接口,汇联，上传文件", type: "asrForUploadFileWithHuilan", schema: "asrForUploadFileWithHuilan", children: [
        { id: '1-1', name: "errorMsg", message: "	错误信息", type: "string", schema: "" },
        { id: '1-2', name: "receiveTime", message: "接受时间", type: "string", schema: "" },
        { id: '1-3', name: "errorCode", message: "错误代码", type: "string", schema: "" },
        { id: '1-4', name: "label", message: "标签", type: "string", schema: "" },
        { id: '1-5', name: "prob", message: "prob", type: "integer", schema: "" },
        { id: '1-6', name: "asr_msg", message: "asr_msg", type: "string", schema: "" },
        { id: '1-7', name: "srt", message: "srt", type: "string", schema: "" },
        { id: '1-8', name: "vtt", message: "vtt", type: "string", schema: "" },
        { id: '1-9', name: "sendTime", message: "发送时间", type: "string", schema: "" },


      ]
    },
    responseParameterCen,
    responseParameterBot
  ],
  // 		身份证识别，百度返回值
  idcardWithBaidu: [
    responseParameterHead,
    {
      id: '1', name: "idcardWithBaiduResponse", message: "appKey，内部使用，不需要赋值", type: "（身份证识别，百度）返回值 https://ai.baidu.com/ai-doc/OCR/rk3h7xzck", schema: "（身份证识别，百度）返回值 https://ai.baidu.com/ai-doc/OCR/rk3h7xzck", children: [
        { id: '1-1', name: "card_image", message: "", type: "string", schema: "" },
        { id: '1-2', name: "card_location", message: "", type: "object", schema: "" },
        { id: '1-3', name: "card_quality", message: "", type: "object", schema: "" },
        { id: '1-4', name: "direction", message: "", type: "integer", schema: "" },
        { id: '1-5', name: "edit_tool", message: "", type: "string", schema: "" },
        { id: '1-6', name: "errorMsg", message: "", type: "string", schema: "" },
        { id: '1-7', name: "idcard_number_type", message: "", type: "integer", schema: "" },
        { id: '1-8', name: "image_status", message: "", type: "string", schema: "" },
        { id: '1-9', name: "log_id", message: "", type: "string", schema: "" },
        { id: '1-10', name: "photo", message: "", type: "string", schema: "" },
        { id: '1-11', name: "photo_location", message: "", type: "object", schema: "" },
        { id: '1-12', name: "risk_type", message: "", type: "string", schema: "" },
        { id: '1-13', name: "words_result", message: "", type: "string", schema: "" },
        { id: '1-14', name: "words_result_num", message: "", type: "string", schema: "" },
      ]
    },
    responseParameterCen,
    responseParameterBot
  ],
  // 			语音合成restful，阿里云,返回值
  speechSynthesizerRestfulWithAliyun: [
    responseParameterHead,
    {
      id: '1', name: "speechSynthesizerRestfulWithAliyunResponse", message: "语音合成restful，阿里云,返回值", type: "speechSynthesizerRestfulWithAliyunResponse", schema: "speechSynthesizerRestfulWithAliyunResponse", children: [
        { id: '1-1', name: "audio", message: "audio", type: "string", schema: "" },
        { id: '1-2', name: "errorMsg", message: "错误信息", type: "string", schema: "" },
        { id: '1-3', name: "message", message: "message", type: "string", schema: "" },
        { id: '1-4', name: "result", message: "result", type: "string", schema: "" },
        { id: '1-5', name: "status", message: "status", type: "integer", schema: "" },
        { id: '1-6', name: "task_id", message: "task_id", type: "string", schema: "" },
      ]
    },
    responseParameterCen,
    responseParameterBot
  ],
  // 录音文件识别，阿里云本地,返回值
  recordingFileAsrWithAliyun: [
    responseParameterHead,
    {
      id: '1', name: "recordingFileAsrWithAliyunResponse", message: "录音文件识别Callback", type: "录音文件识别Callback，阿里云 https://help.aliyun.com/document_detail/90729.html", schema: "录音文件识别Callback，阿里云 https://help.aliyun.com/document_detail/90729.html", children: [
        { id: '1-1', name: "bizDuration", message: "", type: "integer(int32)", schema: "" },
        { id: '1-2', name: "errorMsg", message: "", type: "string", schema: "" },
        { id: '1-3', name: "requestId", message: "", type: "string", schema: "" },
        {
          id: '1-4', name: "result", message: "", type: "	array", schema: "	录音文件识别，阿里云，返回值Sentences", children: [
            { id: '1-4-1', name: "beginTime", message: "", type: "	integer", schema: "" },
            { id: '1-4-2', name: "channelId", message: "", type: "	integer", schema: "" },
            { id: '1-4-3', name: "emotionValue", message: "", type: "	integer", schema: "" },
            { id: '1-4-4', name: "endTime", message: "", type: "	integer", schema: "" },
            { id: '1-4-5', name: "silenceDuration", message: "", type: "	integer", schema: "" },
            { id: '1-4-6', name: "speechRate", message: "", type: "integer", schema: "" },
            { id: '1-4-7', name: "text", message: "", type: "string", schema: "" },
          ]
        },
        {
          id: '1-5', name: "sentences", message: "	sentences", type: "array", schema: "	录音文件识别，阿里云，返回值Sentences", children: [
            { id: '1-5-1', name: "beginTime", message: "", type: "	integer", schema: "" },
            { id: '1-5-2', name: "channelId", message: "", type: "	integer", schema: "" },
            { id: '1-5-3', name: "emotionValue", message: "", type: "	integer", schema: "" },
            { id: '1-5-4', name: "endTime", message: "", type: "	integer", schema: "" },
            { id: '1-5-5', name: "silenceDuration", message: "", type: "	integer", schema: "" },
            { id: '1-5-6', name: "speechRate", message: "", type: "integer", schema: "" },
            { id: '1-5-7', name: "text", message: "", type: "string", schema: "" },
          ]
        },
        { id: '1-6', name: "solveTime", message: "", type: "integer(int64)", schema: "" },
        { id: '1-7', name: "statusCode", message: "", type: "integer(int32)", schema: "" },
        { id: '1-8', name: "statusText", message: "", type: "string", schema: "" },
        { id: '1-9', name: "taskId", message: "", type: "string", schema: "" },
      ]
    },
    responseParameterCen,
    responseParameterBot
  ],
  //		chatgpt接口
  chatgptForOpenAi: [
    responseParameterHead,
    {
      id: '1', name: "reply", message: "机器回答", type: "", schema: ""
    },
    responseParameterCen,
    responseParameterBot
  ],
  //		文生图接口
  txtToImgForHuilan: [
    responseParameterHead,
    {
      id: '1', name: "images", message: "返回的图片结果的数组，数组大小由batch_size决定，每个图片是base64编码的文本", type: "array", schema: ""
    },
    {
      id: '3', name: "images", message: "", type: "json", schema: ""
    },
    {
      id: '3', name: "info", message: "返回消息", type: "string", schema: ""
    },
    responseParameterCen,
    responseParameterBot
  ],
  //		汇联对话接口
  chatgptForHuilan: [
    responseParameterHead,
    {
      id: '1', name: "speak_json", message: "返回的结果集", type: "json", schema: "", children: [
        {
          id: '1-1', name: "message", message: "返回消息", type: "string", schema: ""
        },
        {
          id: '1-2', name: "messageType", message: "返回结果类型", type: "string", schema: ""
        },
      ]
    },
    responseParameterCen,
    responseParameterBot
  ],
}
const example = {
  // 分词
  splitSentences: {
    "code": 200,
    "success": true,
    "data": {
      "errorMsg": null,
      "tenantId": "000000",
      "splitSentences": [
        "黄河/ns 尚有/v 澄清/v 之日/r aa/en 33/m ,/w ddf@dsf.com/ne_email"
      ]
    },
    "msg": "操作成功"
  },
  //关键词提取
  extractKeywordsFromTxt: {
    "code": 200,
    "success": true,
    "data": [
      {
        "科技": 0.21653686,
        "构成": 0.11897911,
        "株式会社": 0.3666139,
        "投资": 0.44950375,
        "宏图": 0.37905285,
        "资": 0.3730706,
        "公司": 0.35208938,
        "商": 0.25775144,
        "年头": 0.26205364,
        "富": 0.5335309,
        "集团": 0.4332323,
        "总额": 0.2890091,
        "华": 0.2890091,
        "成": 0.05519282,
        "股份有限公司": 0.37905285,
        "设备": 0.5251155,
        "通": 0.53353083,
        "江苏": 0.44162813,
        "技术": 0.3135511,
        "打印机": 0.25972462,
        "有限公司": 1,
        "中外合资": 0.30991617,
        "主导": 0.25972462,
        "注册": 0.36939207,
        "截": 0.05519282,
        "紫": 0.26901817,
        "港": 0.35208938,
        "是": 0.31642184,
        "产品": 0.58279955,
        "电": 0.26901817,
        "服务": 0.26135662,
        "中国": 0.26205364,
        "销售": 0.3135511,
        "计算机": 0.46921167,
        "南京": 0.47032636
      }
    ],
    "msg": "操作成功"
  },
  // 新词发现
  discoverNewWords: {
    "code": 200,
    "success": true,
    "data": {
      "errorMsg": null,
      "tenantId": "000000",
      "newWords": [],
      "highSolidRateThreshold": "500",
      "highEntropyRateThreshold": "2.54"
    },
    "msg": "操作成功"
  },
  // 语种识别
  charDetect: {
    "code": 200,
    "success": true,
    "data": {
      "errorMsg": null,
      "encoding": "utf-8",
      "confidence": "0.6553711295127869",
      "language": "Chinese",
      "zhName": "汉语"
    },
    "msg": "操作成功"
  },
  // 实体提取
  extractEntities: {
    "code": 200,
    "success": true,
    "data": {
      "errorMsg": null,
      "tenantId": "000000",
      "sentence": "黄河尚有澄清之日aa33,ddf@dsf.com",
      "entityWords": [
        {
          "word": "黄河",
          "begin": 0,
          "end": 1,
          "entityNames": [
            "nao.地点",
            "nao.城市"
          ]
        },
        {
          "word": "33",
          "begin": 10,
          "end": 11,
          "entityNames": [
            "nao.数字"
          ]
        },
        {
          "word": "ddf@dsf.com",
          "begin": 13,
          "end": 23,
          "entityNames": [
            "nao.邮箱"
          ]
        }
      ]
    },
    "msg": "操作成功"
  },
  // 摘要提取
  extractSummary: {
    "code": 200,
    "success": true,
    "data": {
      "errorMsg": null,
      "summary": "某某设备有限公司中外合资商。"
    },
    "msg": "操作成功"
  },
  // 敏感词过滤
  findSensitiveWords: {
    "code": 200,
    "success": true,
    "data": {
      "errorMsg": null,
      "tenantId": "000000",
      "enableTenantWords": "true",
      "enableSystemWords": "true",
      "enableBuiltinWords": "true",
      "doReplace": "true",
      "sensitiveWordsResult": [
        [
          {
            "wordTable": null,
            "begin": 4,
            "end": 6,
            "text": "他娘的"
          }
        ],
        [
          {
            "wordTable": null,
            "begin": 0,
            "end": 3,
            "text": "法轮功"
          }
        ],
        []
      ],
      "replacedResult": null
    },
    "msg": "操作成功"
  },
  // 从聊天记录或文档挖掘QA
  miningQA: {
    "code": 200,
    "success": true,
    "data": {
      "errorMsg": null,
      "tenantId": "000000",
      "err": null,
      "sentence": null,
      "qaList": null
    },
    "msg": "操作成功"
  },
  // 句子聚类
  sentenceCluster: {
    "code": 200,
    "success": true,
    "data": {
      "errorMsg": null,
      "tenantId": "000000",
      "groups": [
        {
          "groupId": 1,
          "sentences": [
            {
              "groupId": 1,
              "index": 0,
              "text": "北京的天气"
            },
            {
              "groupId": 1,
              "index": 1,
              "text": "武汉明天的天气怎么样"
            }
          ]
        },
        {
          "groupId": 2,
          "sentences": [
            {
              "groupId": 2,
              "index": 2,
              "text": "呵呵"
            }
          ]
        }
      ]
    },
    "msg": "操作成功"
  },
  // 句法分析
  syntacticAnalysis: {
    "code": 200,
    "success": true,
    "data": [
      {
        "HEAD": {
          "POSTAG": "n",
          "LEMMA": "⽓",
          "CPOSTAG": "n",
          "NAME": "⽓",
          "ID": 5
        },
        "POSTAG": "ns",
        "LEMMA": "武汉",
        "CPOSTAG": "ns",
        "NAME": "未##地",
        "DEPREL": "定中关系",
        "ID": 1
      },
      {
        "HEAD": {
          "POSTAG": "q",
          "LEMMA": "天",
          "CPOSTAG": "q",
          "NAME": "天",
          "ID": 4
        },
        "POSTAG": "t",
        "LEMMA": "明天",
        "CPOSTAG": "nt",
        "NAME": "未##时",
        "DEPREL": "定中关系",
        "ID": 2
      },
      {
        "HEAD": {
          "POSTAG": "t",
          "LEMMA": "明天",
          "CPOSTAG": "nt",
          "NAME": "未##时",
          "ID": 2
        },
        "POSTAG": "u",
        "LEMMA": "的",
        "CPOSTAG": "u",
        "NAME": "的",
        "DEPREL": "右附加关系",
        "ID": 3
      },
      {
        "HEAD": {
          "POSTAG": "n",
          "LEMMA": "⽓",
          "CPOSTAG": "n",
          "NAME": "⽓",
          "ID": 5
        },
        "POSTAG": "q",
        "LEMMA": "天",
        "CPOSTAG": "q",
        "NAME": "天",
        "DEPREL": "定中关系",
        "ID": 4
      },
      {
        "HEAD": {
          "POSTAG": "r",
          "LEMMA": "怎么样",
          "CPOSTAG": "r",
          "NAME": "怎么样",
          "ID": 6
        },
        "POSTAG": "n",
        "LEMMA": "⽓",
        "CPOSTAG": "n",
        "NAME": "⽓",
        "DEPREL": "主谓关系",
        "ID": 5
      },
      {
        "HEAD": {
          "POSTAG": "root",
          "LEMMA": "##核心##",
          "CPOSTAG": "ROOT",
          "NAME": "##核心##",
          "ID": 0
        },
        "POSTAG": "r",
        "LEMMA": "怎么样",
        "CPOSTAG": "r",
        "NAME": "怎么样",
        "DEPREL": "核心关系",
        "ID": 6
      }
    ],
    "msg": "操作成功"
  },
  // 文档切分句子
  splitToSentences: {
    "code": 200,
    "success": true,
    "data": {
      "errorMsg": null,
      "tenantId": "000000",
      "sentences": [
        "你好。",
        "再见！",
        "一轮圆月挂半空............"
      ]
    },
    "msg": "操作成功"
  },
  // 短文本相似度计算
  senSim: {
    "code": 200,
    "success": true,
    "data": {
      "errorMsg": null,
      "tenantId": "000000",
      "sentenceScores": [
        {
          "originalIndex": 1,
          "sentence": "身份证如何办理",
          "score": 0.9380000000000001
        },
        {
          "originalIndex": 0,
          "sentence": "我想办身份证",
          "score": 0.7978000000000001
        },
        {
          "originalIndex": 2,
          "sentence": "你好，办事情",
          "score": 0.3753333333333334
        }
      ]
    },
    "msg": "操作成功"
  },
  // NLP数学计算器
  mathCompute: {
    "code": 200,
    "success": true,
    "data": {
      "errorMsg": null,
      "tenantId": "000000",
      "sentence": "四百的平方根加上13的平方减去九十是多少",
      "value": "99",
      "equation": "400^(1/2)+13^2-90 = 99",
      "certain": true
    },
    "msg": "操作成功"
  },
  // 挖掘词共现(可作为知识点，也可作为标签)
  miningWordCoOccurrences: {
    "code": 200,
    "success": true,
    "data": {
      "errorMsg": null,
      "tenantId": "000000",
      "wordCoOccurrences": [
        {
          "sentences": [
            "如何办理身份证",
            "身份证如何办理"
          ],
          "words": [
            "办理",
            "身份证"
          ]
        },
        {
          "sentences": [
            "北京的天气"
          ],
          "words": [
            "天气",
            "北京"
          ]
        },
        {
          "sentences": [
            "武汉明天的天气怎么样"
          ],
          "words": [
            "天气",
            "武汉"
          ]
        },
        {
          "sentences": [
            "如何办理身份证",
            "我想办身份证",
            "身份证如何办理"
          ],
          "words": [
            "身份证"
          ]
        },
        {
          "sentences": [
            "北京的天气",
            "武汉明天的天气怎么样"
          ],
          "words": [
            "天气"
          ]
        }
      ]
    },
    "msg": "操作成功"
  },
  // 标签提取
  extractTags: {
    "code": 200,
    "success": true,
    "data": [
      "某某",
      "有限公司",
      "1994年5月18日"
    ],
    "msg": "操作成功"
  },
  // 提取年月日
  extractYearMonth: {
    "code": 200,
    "success": true,
    "data": {
      "errorMsg": null,
      "tenantId": null,
      "sentence": "下个月1号的天气怎么样",
      "yearStr": null,
      "monthStr": "下个月",
      "dateStr": "1号",
      "fromYearVal": null,
      "fromMonthVal": "7",
      "fromDateVal": "1",
      "toYearVal": null,
      "toMonthVal": "7",
      "toDateVal": "1",
      "mask": [
        1,
        1,
        1,
        1,
        1,
        0,
        0,
        0,
        0,
        0,
        0
      ]
    },
    "msg": "操作成功"
  },
  //计算文本的SimHash
  simHash: {
    "code": 200,
    "success": true,
    "data": {
      "errorMsg": null,
      "tenantId": "000000",
      "text": "某某计算机设备有限公司",
      "hash": [
        13332,
        57728,
        30372,
        55448
      ]
    },
    "msg": "操作成功"
  },
  //计算SimHash的相似度
  simHashSim: {
    "code": 200,
    "success": true,
    "data": {
      "errorMsg": null,
      "tenantId": "000000",
      "simHashSimilarityList": [
        {
          "index": 0,
          "similar": true,
          "distance": 0
        },
        {
          "index": 1,
          "similar": true,
          "distance": 1
        },
        {
          "index": 2,
          "similar": true,
          "distance": 3
        }
      ]
    },
    "msg": "操作成功"
  },
  //	执行lua脚本
  runLuaScript: {
    "code": 200,
    "success": true,
    "data": {
      "errorMsg": null,
      "luaScript": "require('com.huilan.se.lua.jlib.JsonLib') \nrequire('com.huilan.se.lua.jlib.RequestsLib') \ny = math.sqrt(x)url = cs_robotUrl..'nlp/split' \nsplitParams = {tenantId = cs_tenantId, sentences = {text}} \nsplit = requests.post(url, splitParams) \nc = a + b \nd = {a = a, b = b, c = c} \nd = json.toJsonString(d) \ndd = json.parse(d) \nt = {} \ns = \"from=world, to=Lua\" \nfor k, v in string.gmatch(s, \"(%w+)=(%w+)\") do \n t[k]=v \nend \ncs_u_flag = not flag",
      "inputs": {
        "a": 1653966909774,
        "q": "胡萝卜",
        "b": 3.14,
        "flag": true,
        "x": 25,
        "text": "黄河尚有澄清之日"
      },
      "outputs": {
        "dd": {
          "a": 1653966909774,
          "b": 3.14,
          "c": 1653966909777.14
        },
        "c": 1653966909777.14,
        "split": {
          "splitSentences": [
            "黄河/ns 尚有/v 澄清/v 之日/r"
          ],
          "tenantId": "0"
        },
        "d": "{\"a\":1.653966909774E12,\"b\":3.14,\"c\":1.65396690977714E12}",
        "t": {
          "from": "world",
          "to": "Lua"
        },
        "y": 5,
        "cs_u_flag": false
      },
      "contextSession": {
        "agentId": "0",
        "robotUrl": "http://api.sinonao.com/aikf-robot/",
        "u_flag": false,
        "tenantId": "0",
        "sessionID": "0"
      },
      "status": "SUCCESS",
      "exceptionMessage": null
    },
    "msg": "操作成功"
  },
  //	成分句法分析服务
  componentAnalysis: {
    "code": 200,
    "success": true,
    "data": {
      "con": [
        [
          "TOP",
          [
            [
              "IP",
              [
                [
                  "NP",
                  [
                    [
                      "ADJP",
                      [
                        [
                          "_",
                          [
                            "最新"
                          ]
                        ]
                      ]
                    ],
                    [
                      "NP",
                      [
                        [
                          "_",
                          [
                            "疫情"
                          ]
                        ],
                        [
                          "_",
                          [
                            "政策"
                          ]
                        ]
                      ]
                    ]
                  ]
                ],
                [
                  "VP",
                  [
                    [
                      "_",
                      [
                        "是"
                      ]
                    ],
                    [
                      "IP",
                      [
                        [
                          "VP",
                          [
                            [
                              "VSB",
                              [
                                [
                                  "NP",
                                  [
                                    [
                                      "_",
                                      [
                                        "居家"
                                      ]
                                    ]
                                  ]
                                ],
                                [
                                  "VP",
                                  [
                                    [
                                      "_",
                                      [
                                        "办公"
                                      ]
                                    ]
                                  ]
                                ]
                              ]
                            ]
                          ]
                        ]
                      ]
                    ]
                  ]
                ]
              ]
            ]
          ]
        ]
      ],
      "statusDetail": {
        "run_time": 33.10537338256836,
        "message": "success"
      },
      "tok": [
        [
          "最新",
          "疫情",
          "政策",
          "是",
          "居家",
          "办公"
        ]
      ],
      "statusCode": "SUCCESS"
    },
    "msg": "操作成功"
  },
  //	短语句法分析服务List
  componentAnalysisList: {
    "code": 200,
    "success": true,
    "data": {
      "con": [
        [
          "TOP",
          [
            [
              "IP",
              [
                [
                  "NP",
                  [
                    [
                      "ADJP",
                      [
                        [
                          "_",
                          [
                            "最新"
                          ]
                        ]
                      ]
                    ],
                    [
                      "NP",
                      [
                        [
                          "_",
                          [
                            "疫情"
                          ]
                        ],
                        [
                          "_",
                          [
                            "政策"
                          ]
                        ]
                      ]
                    ]
                  ]
                ],
                [
                  "VP",
                  [
                    [
                      "_",
                      [
                        "是"
                      ]
                    ],
                    [
                      "IP",
                      [
                        [
                          "VP",
                          [
                            [
                              "NP",
                              [
                                [
                                  "_",
                                  [
                                    "居家"
                                  ]
                                ]
                              ]
                            ],
                            [
                              "VP",
                              [
                                [
                                  "_",
                                  [
                                    "办公"
                                  ]
                                ]
                              ]
                            ]
                          ]
                        ]
                      ]
                    ]
                  ]
                ]
              ]
            ]
          ]
        ]
      ],
      "statusDetail": {
        "run_time": 48.08783531188965,
        "message": "success"
      },
      "tok": [
        [
          "最新",
          "疫情",
          "政策",
          "是",
          "居家",
          "办公"
        ]
      ],
      "statusCode": "SUCCESS"
    },
    "msg": "操作成功"
  },
  //	语义依存分析服务
  semanticDependencyAnalysis: {
    "code": 200,
    "success": true,
    "data": {
      "statusDetail": {
        "run_time": 48.493385314941406,
        "message": "success"
      },
      "tok": [
        [
          "最新",
          "疫情",
          "政策",
          "是",
          "居家",
          "办公"
        ]
      ],
      "sdp": [
        [
          [
            [
              3,
              "Desc"
            ]
          ],
          [
            [
              3,
              "Desc"
            ]
          ],
          [
            [
              4,
              "Exp"
            ]
          ],
          [
            [
              0,
              "Root"
            ]
          ],
          [
            [
              4,
              "dClas"
            ],
            [
              6,
              "Mann"
            ]
          ],
          [
            [
              4,
              "dClas"
            ]
          ]
        ]
      ],
      "statusCode": "SUCCESS"
    },
    "msg": "操作成功"
  },
  //	语义依存分析服务List
  semanticDependencyAnalysisList: {
    "code": 200,
    "success": true,
    "data": {
      "statusDetail": {
        "run_time": 48.50912094116211,
        "message": "success"
      },
      "tok": [
        [
          "最新",
          "疫情",
          "政策",
          "是",
          "居家",
          "办公"
        ]
      ],
      "sdp": [
        [
          [
            [
              3,
              "Desc"
            ]
          ],
          [
            [
              3,
              "Desc"
            ]
          ],
          [
            [
              4,
              "Exp"
            ]
          ],
          [
            [
              0,
              "Root"
            ]
          ],
          [
            [
              4,
              "dClas"
            ],
            [
              6,
              "Mann"
            ]
          ],
          [
            [
              4,
              "dClas"
            ]
          ]
        ]
      ],
      "statusCode": "SUCCESS"
    },
    "msg": "操作成功"
  },
  //	语义角色标注服务
  semanticRoleLabeling: {
    "code": 200,
    "success": true,
    "data": {
      "statusDetail": {
        "run_time": 53.270578384399414,
        "message": "success"
      },
      "srl": [
        [
          [
            [
              "最新疫情政策",
              "ARG0",
              0,
              3
            ],
            [
              "是",
              "PRED",
              3,
              4
            ],
            [
              "居家办公",
              "ARG1",
              4,
              6
            ]
          ],
          [
            [
              "居家",
              "ARG0",
              4,
              5
            ],
            [
              "办公",
              "PRED",
              5,
              6
            ]
          ]
        ]
      ],
      "tok": [
        [
          "最新",
          "疫情",
          "政策",
          "是",
          "居家",
          "办公"
        ]
      ],
      "statusCode": "SUCCESS"
    },
    "msg": "操作成功"
  },
  //	语义角色标注服务List
  semanticRoleLabelingList: {
    "code": 200,
    "success": true,
    "data": {
      "statusDetail": {
        "run_time": 33.88094902038574,
        "message": "success"
      },
      "srl": [
        [
          [
            [
              "最新疫情政策",
              "ARG0",
              0,
              3
            ],
            [
              "是",
              "PRED",
              3,
              4
            ],
            [
              "居家办公",
              "ARG1",
              4,
              6
            ]
          ],
          [
            [
              "居家",
              "ARG0",
              4,
              5
            ],
            [
              "办公",
              "PRED",
              5,
              6
            ]
          ]
        ]
      ],
      "tok": [
        [
          "最新",
          "疫情",
          "政策",
          "是",
          "居家",
          "办公"
        ]
      ],
      "statusCode": "SUCCESS"
    },
    "msg": "操作成功"
  },
  // 情感分析
  affectiveAnalysis: {
    "code": 200,
    "success": true,
    "data": {
      "errorMsg": null,
      "text": "今天天气不错",
      "sentiment": "positive",
      "probability": 0.710625171661377
    },
    "msg": "操作成功"
  },
  // 标签词对句子的打分及排序
  tagSenSim: {
    "code": 200,
    "success": true,
    "data": {
      "errorMsg": null,
      "tenantId": "000000",
      "tagWords": {
        "异地,外地": 1,
        "公积金": 0.95
      },
      "sentenceScores": [
        {
          "originalIndex": 1,
          "sentence": "在异地怎么提取公积金",
          "score": 0.846625
        },
        {
          "originalIndex": 3,
          "sentence": "我想异地提取",
          "score": 0.3112820512820513
        },
        {
          "originalIndex": 0,
          "sentence": "公积金怎么提取",
          "score": 0.2641025641025641
        },
        {
          "originalIndex": 2,
          "sentence": "外地换证怎么办理",
          "score": 0.2567765567765568
        }
      ]
    },
    "msg": "操作成功"
  },
  // 	汇联上传文件tts
  ttsWithHuilan: {
    "code": 200,
    "success": true,
    "data": {
      "errorMsg": null,
      "audio": "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qqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqq//OoxAAAAANIAAAAAExBTUUzLjEwMKqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqTEFNRTMuMTAwqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqq//OoxAAAAANIAAAAAExBTUUzLjEwMKqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqTEFNRTMuMTAwqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqq//OoxAAAAANIAAAAAExBTUUzLjEwMKqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqTEFNRTMuMTAwqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqq//OoxAAAAANIAAAAAExBTUUzLjEwMKqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqTEFNRTMuMTAwqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqq//OoxAAAAANIAAAAAExBTUUzLjEwMKqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqTEFNRTMuMTAwqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqq//OoxAAAAANIAAAAAExBTUUzLjEwMKqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqTEFNRTMuMTAwqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqq//OoxAAAAANIAAAAAExBTUUzLjEwMKqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqTEFNRTMuMTAwqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqq//OoxAAAAANIAAAAAExBTUUzLjEwMKqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqTEFNRTMuMTAwqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqq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Fij9ZyOkmZfclKCwNBUsAkYYAKYXAyYvhIYIiSTByY2AOkqrUVgGAAYEIKhAgCwhBQBhCDVdKmggot0XOTqWNHAcBRkwI5gYLI0EoFE8KgOEBbUga3awMEgrHQ1BQJmCoVBcKi1IKAHKGpp/5OkUvGooKtCSSree6teIvdAMoc21KXXikvoJ+HIdrPpfuwVArquWzh9s4GpYpbqW6e0/FFGpa7MFsulLDYvPyiXS6epMZ2v9uniTdH+oIjLoLv2aadlU9HqWrcqU1LD8rjlWdrTlm1zudSlpLdLrVu9Y5c5TNTHtNDb2HjmGijp2mjn+Sjf9nDSkqDBcVzKA4zMM6jP1GDTVRjUNJDPEqBIpzE4gzKIsTLIvTIUjjIMfDH8gjIMfDG8XDEcK//OoxEdrVBXwAd3oAAAgaYbCqYwCuYKgGYlD+ZPFaZUEiYvAKYpl8aSsIbtwscVxsa7KSZlC6VgcFgXMNhRMYBjMXBLMMgZL8rSYsFAHMEATMEANAQEqWwYpku1hqmJcEwAAMwEAUwEAMBACWVLvIPLGd6my/LcqjV+ItZZy12Hea2+q5UJJckuSg6qV3rbsrCpCoSUHUiVAVAkVkVkVkVlBmXT1W1WfZTIu8WmLlJFKmYau1dqwqxXVbsXCMAQELkpgsRfmYXMX+AIAGAIAIOtNvVo1DUPS7OmjUNP85TlQ9Lq0pdlyWcs5Zyu1drqvCX9LSl4VcyhcyQyEpMVMVUqxWIrtRNAgAmAABoPPcwEtSYAAGYBACXFabEVKgKABgGABcZp0dZy11/Yadphy7l3Ned5/o1S8yyy7VlL+w1Go1Goaf6NU3dVqbKtKmVKBISkxVis5Yau1UqpV2rtZ0zpyn+h6mzpYZjUajUajUahp/n+VTEFNRTMuMTAwVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVV//OoxAAAAANIAAAAAExBTUUzLjEwMFVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVTEFNRTMuMTAwVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVV",
      "format": "mp3",
      "ph_durations": [
        {
          "duration": 0.075,
          "ph": "ch",
          "begin": 0.025
        },
        {
          "duration": 0.075,
          "ph": "ix1",
          "begin": 0.1
        },
        {
          "duration": 0.075,
          "ph": "f",
          "begin": 0.2
        },
        {
          "duration": 0.075,
          "ph": "an4",
          "begin": 0.275
        },
        {
          "duration": 0.075,
          "ph": "l",
          "begin": 0.375
        },
        {
          "duration": 0.05,
          "ph": "e5",
          "begin": 0.45
        },
        {
          "duration": 0.025,
          "ph": "m",
          "begin": 1.075
        },
        {
          "duration": 0.1,
          "ph": "a5",
          "begin": 1.1
        }
      ],
      "act_durations": [
        {
          "duration": 0.5,
          "act": "点头",
          "ph": "sil",
          "begin": 0.525
        }
      ]
    },
    "msg": "操作成功"
  },
  // 	通用文字识别，高精度版，百度
  accurateBasicOcrWithBaidu: {
    "code": 200,
    "success": true,
    "data": {
      "errorMsg": null,
      "log_id": "1538806526327199418",
      "direction": null,
      "words_result": [
        {
          "probability": {
            "average": 0.9999879599,
            "min": 0.9999879599,
            "variance": 0
          },
          "words": "福"
        }
      ],
      "paragraphs_result": [
        {
          "words_result_idx": [
            0
          ]
        }
      ],
      "words_result_num": 1,
      "pdf_file_size": null
    },
    "msg": "操作成功"
  },
  //	办公文档识别，百度
  docAnalysisOfficeWithBaidu: {
    "code": 200,
    "success": true,
    "data": {
      "errorMsg": null,
      "log_id": "1539171448288698187",
      "img_direction": null,
      "results_num": 30,
      "results": [
        {
          "words_type": "print",
          "words": {
            "words_location": {
              "top": 31,
              "left": 74,
              "width": 251,
              "height": 42
            },
            "word": "文件拍照转pdf"
          }
        },
        {
          "words_type": "print",
          "words": {
            "words_location": {
              "top": 86,
              "left": 54,
              "width": 292,
              "height": 35
            },
            "word": "快速将文件制作为pdf"
          }
        },
        {
          "words_type": "print",
          "words": {
            "words_location": {
              "top": 146,
              "left": 64,
              "width": 10,
              "height": 19
            },
            "word": "〈"
          }
        },
        {
          "words_type": "print",
          "words": {
            "words_location": {
              "top": 149,
              "left": 146,
              "width": 102,
              "height": 13
            },
            "word": "202003041501"
          }
        },
        {
          "words_type": "print",
          "words": {
            "words_location": {
              "top": 182,
              "left": 103,
              "width": 89,
              "height": 8
            },
            "word": "域代开人，（以下院移乙方"
          }
        },
        {
          "words_type": "print",
          "words": {
            "words_location": {
              "top": 213,
              "left": 103,
              "width": 211,
              "height": 9
            },
            "word": "经权方友好协商，我乙方在甲方许可区域内作为甲方的民域代理海一事达成"
          }
        },
        {
          "words_type": "print",
          "words": {
            "words_location": {
              "top": 228,
              "left": 94,
              "width": 14,
              "height": 7
            },
            "word": "一"
          }
        },
        {
          "words_type": "print",
          "words": {
            "words_location": {
              "top": 243,
              "left": 104,
              "width": 41,
              "height": 8
            },
            "word": "第一总"
          }
        },
        {
          "words_type": "print",
          "words": {
            "words_location": {
              "top": 258,
              "left": 104,
              "width": 167,
              "height": 8
            },
            "word": "第一条宗旨签著本合同，自在使乙方联得甲方的许间，在"
          }
        },
        {
          "words_type": "print",
          "words": {
            "words_location": {
              "top": 259,
              "left": 288,
              "width": 22,
              "height": 7
            },
            "word": "区域内"
          }
        },
        {
          "words_type": "print",
          "words": {
            "words_location": {
              "top": 274,
              "left": 93,
              "width": 221,
              "height": 8
            },
            "word": "以下院称本区域》作为甲方的独家代青海开园特许经青业务，发展由甲方独剧"
          }
        },
        {
          "words_type": "print",
          "words": {
            "words_location": {
              "top": 289,
              "left": 90,
              "width": 223,
              "height": 8
            },
            "word": "拥有的一某餐饮公司“中式餐饮特连经权的使用权，共同拓展场，注达双高目"
          }
        },
        {
          "words_type": "print",
          "words": {
            "words_location": {
              "top": 304,
              "left": 90,
              "width": 13,
              "height": 8
            },
            "word": "的"
          }
        },
        {
          "words_type": "print",
          "words": {
            "words_location": {
              "top": 319,
              "left": 102,
              "width": 207,
              "height": 8
            },
            "word": "第二条特许经青项日甲方根据其自主开发身经音一某餐饮公司”中式餐饮"
          }
        },
        {
          "words_type": "print",
          "words": {
            "words_location": {
              "top": 335,
              "left": 91,
              "width": 221,
              "height": 8
            },
            "word": "连顿价成功经验，建立起以“某餐饮会司“高标（品牌）为代表的特许经音系统，"
          }
        },
        {
          "words_type": "print",
          "words": {
            "words_location": {
              "top": 349,
              "left": 91,
              "width": 106,
              "height": 9
            },
            "word": "无系统许可乙方在本环域内长用"
          }
        },
        {
          "words_type": "print",
          "words": {
            "words_location": {
              "top": 365,
              "left": 102,
              "width": 207,
              "height": 8
            },
            "word": "第三条特许经告关系甲方与乙方基于本合同产生的法律关系是一种合作"
          }
        },
        {
          "words_type": "print",
          "words": {
            "words_location": {
              "top": 380,
              "left": 91,
              "width": 223,
              "height": 8
            },
            "word": "关系，乙方作为独立的民事主体对外并展经营业务，执行本合问，乙方应当遵守"
          }
        },
        {
          "words_type": "print",
          "words": {
            "words_location": {
              "top": 396,
              "left": 91,
              "width": 223,
              "height": 8
            },
            "word": "法律的要求。独立对外承相民事责任。除法律粗本合网另有规定外，乙方不是甲"
          }
        },
        {
          "words_type": "print",
          "words": {
            "words_location": {
              "top": 411,
              "left": 91,
              "width": 223,
              "height": 8
            },
            "word": "方的代理人线业务代表，乙方不得以甲方名义绳结合问，或约定其他业各，或"
          }
        },
        {
          "words_type": "print",
          "words": {
            "words_location": {
              "top": 426,
              "left": 90,
              "width": 133,
              "height": 8
            },
            "word": "二任何承诺与保证，把甲方对第三人乐责任"
          }
        },
        {
          "words_type": "print",
          "words": {
            "words_location": {
              "top": 442,
              "left": 103,
              "width": 211,
              "height": 8
            },
            "word": "第四条基本原割公平和诚实信用是订立和执行本合同价车则，在"
          }
        },
        {
          "words_type": "print",
          "words": {
            "words_location": {
              "top": 457,
              "left": 90,
              "width": 225,
              "height": 8
            },
            "word": "签订本合同和执行本合同的过程中，甲乙红方应当口觉守公平和域实口用原"
          }
        },
        {
          "words_type": "print",
          "words": {
            "words_location": {
              "top": 472,
              "left": 90,
              "width": 224,
              "height": 8
            },
            "word": "以害意的方式理解本合网及合问履行过程中的分线与矛后，尽量通过协商解决争"
          }
        },
        {
          "words_type": "print",
          "words": {
            "words_location": {
              "top": 487,
              "left": 90,
              "width": 164,
              "height": 8
            },
            "word": "议，是实现本合同日的的根本途径，第二卓许经权"
          }
        },
        {
          "words_type": "print",
          "words": {
            "words_location": {
              "top": 601,
              "left": 66,
              "width": 50,
              "height": 13
            },
            "word": "选中图片："
          }
        },
        {
          "words_type": "print",
          "words": {
            "words_location": {
              "top": 601,
              "left": 234,
              "width": 51,
              "height": 12
            },
            "word": "整套图片："
          }
        },
        {
          "words_type": "print",
          "words": {
            "words_location": {
              "top": 632,
              "left": 84,
              "width": 59,
              "height": 13
            },
            "word": "保存至相册"
          }
        },
        {
          "words_type": "print",
          "words": {
            "words_location": {
              "top": 632,
              "left": 254,
              "width": 56,
              "height": 12
            },
            "word": "导出为pdf"
          }
        },
        {
          "words_type": "print",
          "words": {
            "words_location": {
              "top": 676,
              "left": 72,
              "width": 81,
              "height": 13
            },
            "word": "发送至其他应用"
          }
        }
      ],
      "layouts_num": null,
      "layouts": null,
      "sec_rows": null,
      "sec_cols": null,
      "sections": null,
      "pdf_file_size": null
    },
    "msg": "操作成功"
  },
  //asr接口,汇联，上传文件
  asrForUploadFileWithHuilan: {
    "errorMsg": null,
    "receiveTime": "2022-06-21 17:29:30:128804",
    "errorCode": "0",
    "label": "未知说话人",
    "prob": 0,
    "data": {
      "errorMsg": null,
      "sentences": [
        {
          "endTime": 3080,
          "text": "北京的天气。",
          "speechRate": 130,
          "emotionValue": 6.6,
          "beginTime": 780,
          "channelId": 0,
          "silenceDuration": 0
        }
      ],
      "result": null,
      "statusCode": null,
      "taskId": null,
      "statusText": null,
      "requestId": null,
      "solveTime": 1655878555388,
      "bizDuration": null
    }
  },
  //身份证识别，百度
  idcardWithBaidu: {
    "code": 200,
    "success": true,
    "data": {
      "errorMsg": null,
      "log_id": "1539191868697475160",
      "words_result_num": 3,
      "words_result": {
        "失效日期": {
          "words": "20251008",
          "location": {
            "top": 369,
            "left": 465,
            "width": 85,
            "height": 22
          }
        },
        "签发机关": {
          "words": "上海市公安局徐汇分局",
          "location": {
            "top": 333,
            "left": 373,
            "width": 167,
            "height": 22
          }
        },
        "签发日期": {
          "words": "20051008",
          "location": {
            "top": 370,
            "left": 372,
            "width": 78,
            "height": 21
          }
        }
      },
      "direction": null,
      "image_status": "normal",
      "risk_type": null,
      "edit_tool": null,
      "card_quality": null,
      "photo": null,
      "photo_location": null,
      "card_image": null,
      "card_location": null,
      "idcard_number_type": null
    },
    "msg": "操作成功"
  },
  //语音合成restful，阿里云
  speechSynthesizerRestfulWithAliyun: {
    "code": 200,
    "success": true,
    "data": {
      "errorMsg": null,
      "task_id": null,
      "result": null,
      "status": null,
      "message": null,
      "audio": "UklGRiRSAwBXQVZFZm10IBAAAAABAAEAgD4AAAB9AAACABAAZGF0YQBSAwAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA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GAARABYAEgAPAA8ADwAPAAAAAAAHAAUAAAD7//v/+/8AAAAA+P/2//7/AAD8//z/+/8AAAIABAAKAAoACgAMAAwADwAMAA8AFAAYABQAFAAbAB0AIwAiACIAIwAmACgAIwAoACEAJAAiACMAIQAeABsAGwAbABkAFAAVABUAGAAXABQAEgAUAB8AGAAYAA8AFAAUABIAEAAIAAUABQAEAAAAAAD8//v//P/7//j/8//2//v//P/8//z//v///wAAAgAAAAUABwANABQAEAAQABMAGAASABQAEgAUABQADQAQAA8AEwAQAAwACAAKAA0ADwAMAA0AEQASABYAFAAbAB0AHQAkACkAKQArACsAMAA0ADMALgAsACwALAAoACEAHQAfABwAFAAMAAcACAACAP3//P/2//X/9P/4//L/8//1//T/9v/6//v/+f/7//z///8AAP7/AAD+/wAAAAAAAAAAAAAAAP3/AAAAAAAAAAAAAAAAAAAEAAUAAAAFAAUABAAIAAoACAAKAAoABQAIAAgACgAIAAcACAAFAAUABQAEAAAAAAAAAAAAAAD+////AAAAAAAA//8AAAAA/////wAABAACAAQAAAACAAUAAgACAAIAAgAEAAcABAAEAAcACgAKAAgADAAIAA0ADQAPAA8ADwAPAA8ADwATABQADQAPABMAEAAPAAwABwAIAAcABQACAAAAAAD+//z//P/2//T/9f/2//L/7v/s/+z/7P/r/+j/6P/o/+j/6f/o/+b/6f/r/+n/6//r//D/8P/v//D/9P/y//n//f8AAAAAAAAAAAAABAAEAAQABwAMAAgACgAHAAgABwANAAoABwAKAAcACAAHAAUABQAFAAgACAAIAAUABAAIAAgACgAKAAgADQARABAAEAAPABUAEwAQABEAFAATAA8AEAAPABIADwAMAAoADQAKAAoACgAHAAgACAAKAAcACAAEAAgACAAIAAgACAAHAAgACAAKAAwACgAMAA8ACgAIAAwADAANAA0ACAAKAAoADAAHAAgACgAFAAcABQAFAAUAAgACAAAAAAD///7///8AAP//AAD8//z/AAAAAAAA//8AAAAAAAAAAP//AAAAAAAAAAACAAIAAAAAAAAAAgAAAAAAAAAAAAAAAAAAAAIAAgAAAAQABAAEAAUABwAEAAQABAAEAAQABwAIAAcABQAHAAoACgANAAwADQAPABAAEAAPABQADwAQAA8ADwARAA8ADwAPAA0ADQAKAA0ADwAPAA0ADQAKAA0AEAANAA0ACAAIAAgACAAIAAUABAAEAAAABAACAAIAAAACAAAAAAD8//z/+//2//b/9v/0//P/8f/x//H/7//w/+7/8P/w//D/6//u//D/7v/w//D/8f/z//T/9P/0//j/9f/5//f/+f/4//j/9v/4//n/+P/4//z//f/+//z///8AAAAAAgAAAAQABQAHAAUABAAFAAQABwAHAAcABwAEAAQABQAFAAUABAACAAIABAAEAAQABAAEAAUAAgAFAAcABQAHAAcACAAEAAwACAAIAAcACAAIAAUABwAFAAcABAAFAAQABQAFAAIAAgAAAAAAAAAAAAAAAAAAAAAA//8AAP//AAD9//3//f8AAP3////+/////f//////AAAAAP7////+//7/+//8//z//v/+//j/+P/7//v/+P/7//n/+v/4//r/+//7//r//P/7//3//v8AAP//AAD/////AAAAAAAAAAAAAAIABAAEAAQABwACAAUABQAFAAcABQAIAAcABwAHAAUACgAMAAwADAAKAAgACgANAAwADAAHAAgACAAIAAgABwAFAAUABAAEAAQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAIAAAAAAAIAAAAAAAAABAAFAAIAAgACAAQAAAAAAAAAAAACAAAAAAAAAAIAAAAAAAAAAAAAAAIAAgAEAAcABQAIAAcACgAKAAoADQAPAA8ADwANABAAEAAPAA0ADwAMAA0ADAAKAAwACgAMAAoABwAFAAcABAACAAIAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA//8AAP//AAD+/////P/+/////P///wAA/v/8//z//v/8//7//f8AAP3/AAD+/wAA//8AAAAAAAAAAP//AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAgAAAAAAAAAAAAIAAgAEAAAAAgAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAD//wAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABwAEAAQABwAFAAUABQAHAAQABQAHAAcABwAHAAQABAAEAAcABwAAAAIABAACAAIAAgAAAAAAAAAAAAAAAAD//wAAAAAAAPz//P/8//7/+v/4//j/+P/1//T/8v/0//P/8v/0//D/8P/z//D/8f/x//L/8//0//P/9P/2//T/+f/7//v/+v/8//z//P/+//7///8AAAAAAAAAAAAAAAAAAAQAAgACAAQAAAACAAIAAgACAAQABQAFAAcABQAFAAcABwAHAAcABQAEAAQABwACAAIAAgACAAAAAAAAAAAAAAAAAAAAAAAAAAAA/f/+/////P/+//3/AAD//wAAAAAAAAAAAAAAAAAAAAAAAAAABAAEAAIAAgACAAUAAAACAAIAAgAEAAIABQAEAAUABAAEAAIAAgAEAAUABQAFAAgABwAHAAUACAAIAAcACAAMAAoADAAMAA0ADQAMAAoADAAIAAoACAAKAAgACgAKAAoABQAHAAgABQAFAAUABAAEAAIABAAEAAIAAgAAAAAAAAAAAAAAAAAAAAAAAAD//wAA/v8AAP///v///wAA/P/8//3//v/8//7//P/9//z//f/6//7//P/8//3//f/9//z////9/////v/+//////8AAAAAAAAAAAAAAAAAAAAAAgACAAAABAAFAAQABAAEAAIABQAFAAUABAAFAAIAAgAEAAUAAgACAAIABAACAAIAAAAAAAAAAAAAAAAA///+/wAAAAD+/wAA//8AAAAAAAAAAAIAAgACAAQABAAEAAQABAAEAAUABAAEAAcABwAIAAgABwAIAAgABQAHAAUABQAFAAcACAAFAAcABwAFAAUABwAHAAQABAACAAIAAAAAAAAAAAAAAAAAAAD9/wAA///9/wAA/P/8//7//P/7//r//P/5//v/+f/4//j/9v/2//b/9f/0//P/8//y//P/9P/z//L/8//y//L/8v/0//L/9P/y//T/9P/2//X/9v/4//T/9//2//j/9//4//X/9//3//b/+P/7//r/+//6//z//////wAAAAAAAAAAAAAAAAAAAAAAAAIABAAEAAQAAAACAAIABAAEAAUABAACAAQAAgAEAAUABQAFAAIABQAIAAcABQAFAAUABAAIAAcABAAEAAUABQAEAAcABQAEAAQABAAFAAIAAgACAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAD+//3/AAD9/wAAAAAAAAAA/f8AAAAAAAAAAAAAAAAAAAQABAACAAIABAACAAIAAgACAAIAAgAEAAIAAgAEAAIAAgACAAAAAAAAAAIAAgAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA//8AAAAAAAAAAAAAAAAAAAAA/v8AAP//AAAAAP3//f/9//7//v8AAP7/AAD8//3//f/8//3//v/8//7//v8AAP///v/9/wAA//8AAAAAAAAAAAAAAAAAAAAAAgAAAAAAAgACAAQABAAEAAIAAgACAAAAAgACAAIAAgAAAAAAAAAAAAQAAgACAAQABAACAAIABAACAAIAAgACAAQABAACAAIAAgAEAAUAAgACAAQAAgACAAIAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAP//AAD///7//P/7//v/+//4//f/+f/4//j/+f/2//T/9f/0//T/9P/0//T/9v/0//X/9f/0//j/+P/5//n/+f/4//n/+f/6//v//P8AAP7////9//3///8AAP//AAAAAAAAAAAAAAAAAAAAAAIAAgAEAAIAAgAEAAQABAAEAAQAAgACAAUAAgACAAIAAgAAAAAAAgACAAIAAgAAAAAAAAAAAAIAAgAEAAQAAgAFAAQABAAFAAQABwAHAAcABwAIAAgACAAIAAgACAAIAAgACAAIAAgACgAHAAUABwAHAAIAAgAEAAQAAAACAAIAAgACAAAAAgACAAIAAgAEAAAAAgAEAAAAAgAAAAAAAAAAAAIAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAIAAAACAAQAAgACAAIABQAFAAQABAAEAAQAAAACAAIAAgACAAAABAACAAQAAgACAAAAAgACAAQABAAFAAcABQAHAAUACAAIAAcACgAKAAoADAAKAA0ADQAMAAwADAAKAAwACgAKAAoADAAMAAoABwAHAAgABwAHAAgABwAHAAUABwAFAAUABQAEAAQABQAEAAIAAgAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAD+//7//v/+//7//v/+//z//v/8//7//P/+//7//f/+//z/AAD9/wAA/v/+////AAAAAAAAAAD//wAAAAAAAAAAAAAAAAAAAgACAAIAAgACAAAAAAACAAIABAAEAAIAAgAEAAUABAACAAUABQAEAAcABwAFAAcABwAFAAcABwAFAAUABAAEAAIABQAHAAQAAgACAAQAAgACAAIABAACAAAAAAAAAAIAAAAAAAAAAAACAAIAAAAAAAAAAAAAAAAAAAAAAAAAAgAAAAAAAgAAAAAAAAAAAAAAAAAAAAIAAgACAAAAAAAAAAIABAAAAAAAAgAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAP3//v///wAA/P/7//v/+v/4//j/9//5//f/+P/4//b/9f/4//b/9v/2//b/9f/4//T/9//3//X/+//7//r/+v/7//r/+//7//z//P/+/wAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABAACAAUAAgACAAUABAAEAAQABAACAAIABQAEAAIAAgACAAUABQACAAIAAgAAAAIAAgAAAAAAAAAAAAAAAAAAAAAAAAAAAP3//P/9//3/+v/4//j/+P/3//j/9f/5//f/9f/4//f/9v/4//j/+P/3//f/+P/5//j/+//7//j//f/9/wAA//8AAP3//v8AAP////8AAAAAAAAAAAAAAAD//wAAAAAAAAAAAAAAAP//AAAAAAIABAACAAUABAACAAUABQAFAAUABAACAAIABAAAAAIAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAP//AAAAAAIAAgACAAUAAgAEAAQAAgAFAAcABwAFAAcABwAHAAcABwAHAAcABwAFAAUABQAHAAQAAAACAAQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAIAAgAAAAAAAAACAAAAAAAAAAAAAAAAAAIABAAEAAQABAAEAAIAAgACAAIABAACAAIAAgAFAAUAAAACAAAABAAAAAIAAgAAAAAAAAACAAQAAgACAAQAAgAEAAUABQACAAAAAAAAAAAAAgAFAAcABAAEAAUABwAIAAcACAAHAAgABwAFAAoABAAFAAUABQAHAAUABQAFAAQABQAEAAcACAAKAAgACAAFAAcADAAIAAgABAAEAAQABAAFAAQAAgACAAAAAAACAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAIABAAAAAAAAAACAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAACAAIABAAHAAUABwAFAAgACAAHAAoACgAMAAwACgANAA0ACgAIAAoABwAHAAUABAAFAAcABwAFAAIAAgACAAAAAAAAAAAAAAAAAAAAAgAAAAIAAAAAAAAABAAAAAIAAgAAAAAAAAAAAAAAAAAFAAIABQAAAAAABAAEAAQABAACAAAAAAACAAAAAAAAAAAA////////AAAAAAAAAAAAAAAA/v8AAAAABAAEAAIABQAEAAQABQAEAAcACAAIAAcABwAIAAcABwAHAAcABwAHAAUABQAEAAcAAgAAAAAAAgAAAAAAAAAAAP7/AAAAAAAAAAAAAAAAAgAEAAIABQAEAAUABAAEAAQABAAEAAQABQAIAAoABwAFAAUABQAEAAIAAAAAAAIABAAEAAAABAACAAAAAAACAAQAAAAAAP7//f/+//3//v/8//z//P/8//j//P/8//z//f/7//v//v/9//z/+//+//v//P/5//j/+P/1//j/9//4//f/9P/0//X/9f/4//f/+P/4//j/9//4//j/+f/4//v//P/5//r//P/+/wAA/f8AAAQAAgAEAAQABwAFAAQABQAEAAQAAgAHAAgABQAEAAcABQAAAAIAAAACAAQAAAACAAAABQAEAAIAAAAAAAIABQAHAAgADAAIAAoABwAKAAwACAAMAA0ADQAPAA0ADwAPAAwACAAIAAUABQAEAAIABAAFAAUABQAAAAAAAAAAAAAAAAAAAAAA//8AAAAAAAAAAAAAAAAAAP//AAAAAAAA///9//3/AAD+//3////8///////8//v/+v/8//r//P/+/wAA/P/9//v/AAD9/wAA/////////f8AAAAA/////wAAAAD//wAAAgAAAAAAAAACAAAAAAAEAAQAAAAFAAcABQAFAAQAAAAFAAUABAACAAAAAAAAAAAAAgAAAAAAAAAAAAAAAAAAAAAABAAFAAIABQAKAAUAAAAAAPz//P/7//j//P8AAAQABAD///z/AAD9//z/AAAAAAAA/P8AAAIABQAFAAIAAAACAAAAAAAAAAAAAAD9//z/AAD+/wAAAAD8/wAAAAD9//z//P/+//z//v///wAAAAAAAPz/AAAAAAAAAAAAAAIA//8AAAAAAAAAAAAAAAAAAAQABwAFAAAAAAAEAAQAAAAFAAcABAAIAA0ACgAKAAgAAAAFAAUABQACAAAA/f/6//r/AAAAAAAA/P8AAAAAAAD+/wAAAAAAAP//AAAAAP3//P8AAAAABwAIAAQA///9/wAAAAD///3//f8AAAgADAAMAA8ADAAFAAAABAAAAAAABAAEAAQABQAAAAAAAAAFAAwABAAAAAAAAAAAAAIA/P/7//n/+P/5//7//v/8//z/+f///wAAAAAFAAIA+//6//v//P/9/wAA/v8AAP7//v8CAAAACgAUABUADwAKAAAA/P/8//3///8AAAgACAAHAAAA/v/8/wcACAAEAAIA/P/4//j/+f8AAAwAEgAUABQADAAEAAgADQAMAAcAAAD3//D//P/8//z/+v/3//L/8P/1////AgAIAAQA//////j/AAAPABgAHAAVABQAEgASABcAEgAVABoAGgAUABQAFQAVABUADQAKAAoACAAEAAIAAAAFAAAA8P/v//n/9P/r/+//9P/x//P/+P8AAAgADAAHAA0AFQAVABUAFQAXABIABwAFAAUACAAHAAwAFAAaABgAEAAKAAcAAAAAAP7/+P/7/wAACAAKAAwADAACAAAAAAAIAAAA+//s/+b/5//s//H/8f/x//L/8P/s//L//P/4//P/+f/+/wAABwAHAAUAAAAAAAgAEAANAAoABwAFAAUADQANAA0AEAANABAAFAAaAB8AFwAMAAcABQAKABQAEAAKAAgADQAIAA8AHAAYABIAAgD8/wAABQAIAAIAAAAAAAAAAAAIAAwAFAAEAPv/AAAKABUAEgAIAAAA+//4//7/AAAAAAAA+P/8/wQABAAEAAAABQACAAAABQAEAAAAAAAAAAUADwAQABQAFQAVABoAHwAVAAgA/f/4//j//v8PABwAFQAKAAwAFAAiACUAIgAaABAACgAAAA8ADQAHAAAA/f8AAAUACAAMAAgABQD//wAAFAAiACQAHAAIAAAAEAAaAB8AEAD9//D/7f/8/wQABQAAAPP/7P/2/wAAAgAKAAUAAAD4/wIAEgAaAB8AFwAPAAgABQAKAA0ADwAFAPj/8f/8////AAAEAAAA9v/w//f//P8AAAAABAD8//3/9/8AAAcACAAFAAAAAAD8////AAACAAAA+//8/wAABwAQAA0ABwACAAcABwACAAwADwAIAAwAFwAVABUAFAAFAAgADQAKAAIAAAD2/+z/7P/+/wUAAAD5//z/AAAEAAIABQAHAAUAAAD7/wIAAAD6/wAAAgAPABcADQAAAPr/AAAAAP7/AAAAAAQAFAAaABgAIgAiABUABwACAP7//P8CAAQABAAFAP7/+P/5/wgAFQAKAP7/AAD7/wAABAD9//n/9P/w//D/+P/9//3//P/4/+r/6P/y//7/+P/n/9r/1P/Y/+D/5P/r//D/7P/w//D/8P/3//r/9//z//T/+P8AAP//AAAEAAAACAAXABwAGgAVAAcA/P/8/wAAAAAFABAAFAANAAQABAAHAAgABAAAAAAAAAAAAAAACgANAAoAAAACAAcABwACAAAAAAD///v/+v////3//P////r//f8AAP7/+P/6/wAA+v/7//z/AAAAAAAA/P8AAAIABQAIAAgADAAFAAQAAAACAAAA/v///wAABQAMAAgABAACAAgACgAEAAgADQAIAAwAFQAQAA8ADAAAAAIABQAHAAIA///5//D/7P/6/wAA+v/y//L/9P/0//b/+P/9//7/+f/5//3/+v/5//7/AAAIAA8ACAAAAPr/AAAAAP7//f///wIAEAAYABUAGgAXAA0ABQAFAAQABAAFAAUABwAIAAIA/f8AAAcAEAAHAP7/AAAAAAAAAAD7//T/8f/x//D/+P/7//j/+P/2//D/7P/z//j/9v/o/97/2P/e/+T/4//o/+z/6P/o//D/+/////7/+v8AAP//AAAEAAgABQAMAA8ADAAPAA0ACAANAA0ACgAFAAcAAgAAAAAABwACAAAAAAACAAQAAAD+////AAAAAAAA//8AAPj/+P///wAABQAFAAAA/f/7///////8//z/+v/9/wgADAAMABAADwAMAAgACAACAAQABQAHAAcACAAFAAIABAAPABIADAAEAAcAAAACAAQA///7//n/+P/6//z//P/7//z//P/0//H/9P/5//T/6v/l/+P/4f/i/+H/6P/p/+b/6f/p/+b/6P/p/+z/6//p/+j/7f/r//D/8v/z//z/AAACAAIABAAAAAAAAAAAAAAABAAIAAgABwAEAAIAAgANAAwABwAIAAAAAAAAAAAAAAAHAAwADQAQAAoACAANAA8ADAAIAAUAAAD9/wIAAAAAAP3//P/3//j/+//+//z//P/4//f/9//8//3/+P/4//3/+//8/////P/6//v/+v/4//v/+//8//7//P/4//j/+//+//z/9v/2//L/8//x//D/8v/x/+7/8f/v//D/8f/w//D/7//s/+7/8P/w//H/7//s//L/9P/0//T/+P/1//T/9f/1//X/+P/8//z//P/6//j//P/8//7/AAD//wAA//8AAP//AAACAAUABQAIAAUABAAIAAgACAAHAAUABAAEAAgAAgAFAAIAAgAAAAAAAAACAAIABQAEAAIAAgAAAAUABAAHAAUABQAIAAcABwAIAAcACgAKAAwADAANAA0ADQAMAAwADAANAA0ACgAKAAwADAAIAAcABQAHAAAAAAACAAIAAAAAAAAAAAAAAAAAAgAFAAQABAAEAAQABAACAAIABAAFAAcACAAKAAoACgAIAAwADQAMAA8AEAAQABAADwAQABQAFAAQABIADwAPAA8ADAANAA8ADwANAAoACAAIAAcABwAIAAcABwAFAAcABwAHAAUABQAFAAUABAAFAAIAAAACAAIAAAACAAAAAAAAAAAAAAAAAAAA/v/+//7//P/+//3////9//7//P/9//z//f/9//7/AAD+/wAAAAD//wAA/////wAAAAACAAIAAAACAAIAAgACAAQAAgAAAAQABwAEAAQABQAEAAUABAAEAAQABAACAAAAAgAEAAAAAAAAAAIAAAAAAAAAAgAAAAAAAgACAAAAAAACAAIABAACAAQAAgAAAAIABQAEAAQAAgAEAAQACAAFAAcABwAHAAUABQAFAAQABQAFAAUABQAFAAQABAAEAAUABwACAAQABQAFAAIABAAEAAUABQAEAAUABwAFAAQABQACAAQAAgACAAAAAgACAAIAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA//8AAAAA//8AAAAA///+////AAAAAAAAAAD+/wAAAAAAAAAA//8AAP//AAD//wAA/////wAAAAAAAAAAAAAAAAAAAAAAAAAAAAACAAAABAAEAAQABQAEAAQABwAFAAUABQAFAAQAAgAEAAUAAgACAAIAAgAAAAIAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAIAAgAAAAAAAAAAAAAAAAAAAAAAAAAEAAIAAgAEAAIAAgACAAIAAAAAAAIAAgACAAQAAAAAAAIABAAFAAAAAAAEAAAAAgACAAAAAAAAAAAAAAAAAAAAAAAAAAIAAgAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA//8AAAAAAAAAAAAAAgAAAAAAAgAAAAAA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JwAyADUANQAyADgAQwBJAEQARABKAEwASgBGAEQAPAA5ADgANAAsACgAIAAcABwAHwAfABUAEwAYABoAIAAfABgAIAAgACYAJAAiACIAIwAlACQAHAAWABMADgALAAAA///4/+7/8//z/+7/6v/o/+H/5//i/+T/5v/o/+f/6P/s//T/9P/0//r/AAADAAQACAAQABgAHwAfACAAKAAmACYAKwApADAAMAAuACgAJgAkACAAHgAbABQAEAAYABQADgAUAA8AEAAMAAwACAAIAA0ADgAQABMADgAOABAAGAAcABQAFAAYABgAHAAYAA8ADQANAAwABQAAAPz/+//4//P/7f/q/+r/6v/h/9r/1f/Q/8//yv/A/8T/v//A/8X/xP/E/8j/yv/Q/9D/2P/a/+D/4//p//H/8/8AAAcADQASABcAFAAUABgAGAAbABsAIAAcACAAGwAbABsAIQAcABkAGgAQABMADwANAA0ADQAQABQAFQAQABAAFAAXABgAFgAXAB4AGAAbABEAGgAWABMAGQASABQABwANAAcADAAEAAAAAgACAAcABwAEAAAAAAAFAAUAAgAIAAgABAAPABQAEAAYABIACAAUABAAEwAKAAcAAAD7/wAACAAAAPj/9v/8/wAAAAD6//r/AAD+//z/+v8AAPT/9P/6//z/BwAFAAAA9P/w//r/+P/y//D/7P/w/wcACAAIABAACgAMAAgADQAEAAQABwAIAAwAEAAFAAAAAAAPABcABAAAAAQAAAAIAAgA+v/6//L/9//4//r/9//w//L/9P/s/+v/8P/4/+7/5P/c/97/4f/h/97/5v/m/+T/7v/s/+v/8P/w//L/8//2//v/AAD3/wAABAAAABQAFgAcABkAFwARAA8AEAAPAA8ADQAUAA8AEAAIAAcABwAWABAABwAIAP3/AAD8/zAAQgClAMj/of8/AGQANABi/+P/Ov/H/yv/tP6w/iD+kf5x/hr//P4O/vz9rf4c//T/ff9B//7+KP+u/1MABwE0AOD/Of8qAAwBpAEmAdz/z/8a/5sAZAB9ALz/RP4K/sL+gP9I/zz/wP8AADcA4v+sAMIBDAJSAmAAAAHYAIQBKAEmAFsAof6M/wYA9ADwAAH/MP6U/ncAAwF+AOD+0P0d/17/6ACKAXUAFgAH/kgAHAJ1AmEBK/8Z/2X/QQI9ArsB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tP+4/8f/4/8AABQAIAAmACIAEAAFAP3//P/4//T/8f/m/+D/1P/Q/9T/1f/d/+D/4f/c/8v/vf+6/7r/w//P/9z/5P/o/+T/5P/r//P/9//7//z/+P/1/+7/6v/p/+j/6v/k/9//3f/U/83/0P/Q/8z/3P/q//r/CAAQACIAKgAsADQAKAAlACIAFAAGAPv/8f/l/+X/7P/4/wYADQARABEAEwAMAAgABQAAAAQAAAAAAAoAEAAXABoAIAAqACgAJgAhABkADAAQAAwACgAOABQAEAAMAAwACwAMAA4AFQAUABQAFAAGAP//8v/p/+D/4P/u//z/AwAJAAcABQAAAPv/9v/8/wEAAQD+/wAA/P/0/+//6f/w//f/9P/0//D/7f/o/9z/2P/c/+D/4P/n//D/9f/1//P/9f8AAAYACAAGAAkABAAAAPv/9//6//n/9//6//n/+v/z/+//8v/2//j//P8BAAQABQABAAYADAAQABQAEAAPABIADAAFAAAAAAD+/wMACAAMAA4ADAAHAAEABAABAAMAAAAEAAQAAwADAAEAAwAGAAwADAANAA0ADAAKAAQA/v8CAAAAAAAAAAMAAQACAAAAAgACAAcABwAHAAUABwAEAAAAAAD9//n/8//0//T/+f/+//n/+//8//j/+f/5//v/AAD///3////6//j/9P/0//n/+//8//z/+//5//j/9P/4//j/+P8AAAAAAAACAAUABQAEAAUABwAIAAgACAAJAAYABQD///z//P/8//3//f8AAP3/AAD8//7///8AAP//AAACAAUAAgACAAIAAgAEAAQABAAAAAAAAAD6//n/+v/8//3/AAD///7//P/7//n/+f/8//z//v////7//f/7/////P/+//3//P/7//n/9v/2//b/9v/0//b/9v/0//b/9v/5//n/+f/4//b/+P/2//b/9v/0//T/+P/4//T/+f/2//j/9v/4//T/9P/0//b/9v/0//b/+//8//z//P/+////AAAAAAAAAgAAAAAAAAD//wAAAAAAAAAAAgAEAAIAAgAAAAIAAgAFAAUABQAHAAQABAAFAAUABwAEAAYACAAGAAUABQAFAAQACAAIAAgACAAIAAUABwAHAAcABQAEAAUABAAFAAQAAgACAAIAAAAAAAAAAgACAAAAAAAAAAAAAAAAAAAAAAAAAAAA/////wAAAAAAAP////8AAAAAAAAAAAAAAAD//wAAAAAAAP//AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA//8AAAAAAAAAAAAAAAD//wAAAAAAAAAAAAAAAAIAAgACAAQAAgAAAAAAAAAAAAAAAgAEAAQAAgACAAQABAAFAAQABQAEAAUABQAEAAYAAgAFAAQABQAFAAUABwAFAAYABwAFAAYABgAHAAcACAAGAAgACQAIAAcABAAFAAUABQAFAAUABAAFAAQABAAFAAQABAAEAAQABAACAAUABAAEAAQABAAEAAIAAgAEAAIAAgACAAQABQACAAIAAgACAAAAAAAAAAAAAgAAAAIAAAACAAAAAAAAAAAAAAACAAIAAgAEAAIABAACAAQABAACAAQABQAFAAUABAAFAAUABAAEAAQAAgAEAAIAAgAEAAUAAAAAAAIABAAAAAAAAgAAAAAAAAAAAAAAAgAAAAAAAgACAAIAAgAAAAAAAAAAAAIAAAAAAAAAAgACAAIAAAAAAAAAAAAAAAAAAAAAAAIAAgAAAAAAAgACAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAP//AAD//wAA//8AAAAA/////wAA/f/9//3//f////7//f/+//7//v/+/wAA/v/+//3//v/+//7//v/+//7//P/+//z//f/8//z//P/8//z//P/8/////f/+//z//f8AAAAA///+/wAAAAAAAP3//f////3/AAD//wAAAAD+/wAAAAAAAP//AAAAAAAAAAD//wAAAAAAAAAA//8AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAgAAAAAAAAACAAAAAgAAAAIAAAAAAAAAAAAEAAAAAgAAAAIAAgAAAAIAAgAAAAIAAAAEAAQABAACAAIAAAACAAUAAgAEAAAAAgAAAAIAAgACAAIAAgAAAAIAAgAAAAAAAgAAAAIAAAAEAAIAAgACAAIAAgAAAAAAAgAAAAAAAAAEAAQAAAAAAAIAAgAAAAAAAAAAAAIAAAACAAAAAgAAAAAAAAAAAAAAAgACAAIAAgACAAIAAAACAAIAAAAEAAQABAAEAAIABAAEAAIAAAAEAAQAAgACAAQAAgAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAP////8AAAAAAAAAAAAAAAD//wAAAAAAAAAAAAAAAAAAAAAAAAAA/v/9//7/AAD9//7//v/8/wAA/P/9//3//v/8//7//P/8//7/AAD//wAA/v8AAP//AAD//wAAAAD//wAAAAD9/wAA/f///wAAAAAAAP7///8AAAAAAAAAAP//AAAAAAAAAAAAAAAAAAD//wAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA//8AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA//8AAP//AAAAAAAAAAD9////AAAAAAAAAAD//wAAAAD9////AAD+/wAA/v/+/wAA//8AAP7/AAD+/////f////3//f/8//7//f/8//7/AAD//////v8AAP//AAAAAAAAAAD//wAA//8AAP///v///wAAAAAAAAAA//8AAAAAAAAAAP////8AAP//AAAAAAAAAAD//wAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAgAAAAAAAAAAAAAAAgAAAAIAAAAAAAAAAAACAAAAAgAAAAIAAgAAAAIAAgAAAAIAAAAEAAQABAACAAIAAAACAAQAAgACAAAAAgAAAAIAAgACAAAAAgAAAAIAAgAAAAAAAgAAAAIAAAAEAAIAAgACAAIAAgAAAAAAAgAAAAAAAAAEAAQAAAAAAAIAAgAAAAAAAAAAAAAAAAACAAAAAgAAAAAAAAAAAAAAAgACAAIAAgACAAIAAAACAAIAAAAEAAQAAgAEAAIABAAEAAIAAgACAAAAAgACAAIAAgACAAAAAgACAAIABAAAAAIAAgAEAAAAAgACAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAACAAAAAAACAAAAAAACAAIAAgAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAgAAAAAAAAAAAAAAAAAAAAIAAgAAAAAAAgACAAIAAAACAAAAAgACAAAABAAAAAIAAAACAAIAAgA="
    },
    "msg": "操作成功"
  },
  // 录音文件识别，阿里云本地
  recordingFileAsrWithAliyun: {
    "code": 200,
    "success": true,
    "data": {
      "errorMsg": null,
      "status_message": "SUCCESS",
      "namespace": "SpeechFileTranscriber",
      "appkey": "default",
      "task_id": "c59998a4f1f211ecb909e9f6fd14d6fc",
      "message_id": "serverd113b358739e4aea981934c786",
      "gw_task_id": "c2b8869995b64e71844cc838ef5b7dfc",
      "status": "21050000",
      "result": null,
      "statusCode": null,
      "taskId": "c59998a4f1f211ecb909e9f6fd14d6fc",
      "statusText": null,
      "requestId": null,
      "solveTime": null,
      "bizDuration": null
    },
    "msg": "操作成功"
  },
  //		录音文件识别结果轮询，阿里云本地(录音文件识别，阿里云本地第二个接口)
  recordingFileAsrCallbackWithAliyunLocal: {
    "code": 200,
    "success": true,
    "data": {
      "errorMsg": null,
      "sentences": [
        {
          "endTime": 3080,
          "text": "北京的天气。",
          "speechRate": 130,
          "emotionValue": 6.6,
          "beginTime": 780,
          "channelId": 0,
          "silenceDuration": 0
        }
      ],
      "result": null,
      "statusCode": null,
      "taskId": null,
      "statusText": null,
      "requestId": null,
      "solveTime": 1655878555388,
      "bizDuration": null
    },
    "msg": "操作成功"
  },
  //		chatgpt接口
  chatgptForOpenAi: {
    "code": 200,
    "success": true,
    "data": {
      "errorMsg": null,
      "reply": "Thank you, how can I assist you today?",
      "timestamp": "1683602303.391981",
      "timestampString": "2023-05-09 11:18:23.391"
    },
    "msg": "操作成功"
  },
  //		文生图接口
  txtToImgForHuilan: {
    "code": 200,
    "success": true,
    "data": {
      "errorMsg": null,
      "images": [],
      "parameters": {},
      "info": "succ"
    },
    "msg": "操作成功"
  },
  //		汇联对话
  chatgptForHuilan: {
    "code": 200,
    "success": true,
    "data": {
      "errorMsg": null,
      "speak_text": "中华人民共和国首都是北京市",
      "speak_json": {
        "data": {
          "channelMessage": {
            "resultMap": {
              "type": "E"
            }
          },
          "message": "中华人民共和国首都是北京市",
          "messageType": "text"
        },
        "status": "OK"
      }
    },
    "msg": "操作成功"
  },
}
const appkey = {
  ifTest: "true",
}
// 分词
const RequestBody = {
  splitSentences: {
    ...appkey,
    result: {
      splitSentences: true,
      url: participle,
    },
    abilityCode: "splitSentences",
    splitSentences: {
      sentences: ["人工智能是计算机科学的一个分支，它企图了解智能的实质，并生产出一种新的能以人类智能相似的方式做出反应的智能机器。"],
      tenantId: "000000"
    },
  },
  //关键词提取
  extractKeywordsFromTxt: {
    ...appkey,
    abilityCode: "extractKeywordsFromTxt",
    result: {
      split: true,   //关键词处理逻辑，取值冒号后面
      url: crux,
    },
    extractKeywordsFromTxt: {
      filterFlag: "nva",
      maxPerSentence: 2,
      sentences: [],
      similarQuestions: [],
      standardQuestion: "",
      tenantId: "000000",
      text: "北京中科汇联科技股份有限公司1999年成立于北京中关村，是一家致力于数字内容管理、人工智能交互和商业智能决策系统和行业解决方案的人工智能企业。是国家专精特新重点培育小巨人企业、连续5年中国人工智能百强企业、工信部人工智能揭榜挂帅企业、人工智能产学研一体化企业。致力于人工智能赋能产业化进程和各行业数字化转型升级，为全国各级党政机关、大中型企业、金融、教育等行业提供互联网内容管理平台、智能客服与机器人平台、智能指挥调度与虚拟智人平台的建设、运维和服务。",
      topN: 10
    }
  },
  // 新词发现
  discoverNewWords: {
    ...appkey,
    result: {
      discoverNewWords: true,   //关键词处理逻辑，取值冒号后面
      url: discoverNewWords,
    },
    abilityCode: 'discoverNewWords',
    discoverNewWords: {
      "highEntropyRateThreshold": 2.54,
      "highSolidRateThreshold": 500,
      "txt": "视听表征学习已经催生了很多有趣的任务,比如视听通信（AVC）,视听事件定位（AVEL）,视频解析（AVVP）,声源定位（SSL）",
      "tenantId": "000000"
    }
  },
  //语种识别
  charDetect: {
    ...appkey,
    result: {
      charDetect: true,   //语种识别，取zhName
      url: langrage,
    },
    abilityCode: 'charDetect',
    charDetect: {
      "text": "大家早上好"
    }
  },
  //实体提取
  extractEntities: {
    ...appkey,
    result: {
      extractEntities: true,   //摘要提取处理逻辑，取值summary
      url: notional,
    },
    abilityCode: 'extractEntities',
    extractEntities: {
      sentence: "黄河尚有澄清之日aa33,ddf@dsf.com",
      tenantId: "000000"
    }
  },
  //摘要提取
  extractSummary: {
    ...appkey,
    result: {
      extractSummary: true,   //摘要提取处理逻辑，取值summary
      url: extractSummary,
    },
    abilityCode: 'extractSummary',
    extractSummary: {
      "size": 5,
      "tenantId": "000000",
      "text": "人工智能是一门极富挑战性的科学，从事这项工作的人必须懂得计算机知识，心理学和哲学。人工智能是包括十分广泛的科学，它由不同的领域组成，如机器学习，计算机视觉等等，总的说来，人工智能研究的一个主要目标是使机器能够胜任一些通常需要人类智能才能完成的复杂工作"
    }
  },
  //敏感词过滤
  findSensitiveWords: {
    ...appkey,
    result: {
      findSensitiveWords: true,   //摘要提取处理逻辑，取值summary
      url: findSensitiveWords,
    },
    abilityCode: 'findSensitiveWords',
    findSensitiveWords: {
      "enableTenantWords": true,
      "enableSystemWords": true,
      "enableBuiltinWords": true,
      "doReplace": true,
      "sentences": ["⽼赵，你他娘的混蛋", "法〜轮功", "呵呵"],
      "tenantId": "000000"
    }
  },
  //从聊天记录或文档挖掘QA
  miningQA: {
    ...appkey,
    result: {
      miningQA: true,
      url: miningQA,
    },
    abilityCode: 'miningQA',
    miningQA: {
      "tenantId": "000000",
      "type": "1",
      "sentences":
        [{ "id": "1", "orderNo": 1, "roleType": "2", "sentence": "你好" }, { "id": "2", "orderNo": 2, "roleType": "2", "sentence": "今天天气怎么样" }, { "id": "3", "orderNo": 3, "roleType": "2", "sentence": "你叫什么名字" }, { "id": "4", "orderNo": 4, "roleType": "1", "sentence": "张三" }, { "id": "5", "orderNo": 5, "roleType": "2", "sentence": "你的名字是什么" }]
    }
  },
  //句子聚类
  sentenceCluster: {
    ...appkey,
    result: {
      sentenceCluster: true,
      url: semanticRoleLabeling
    },
    abilityCode: 'sentenceCluster',
    sentenceCluster: {
      "sentences": ["北京的天气", "武汉明天的天气怎么样", "呵呵"],
      "tenantId": "000000"
    }
  },
  //句法分析
  syntacticAnalysis: {
    ...appkey,
    result: {
      syntacticAnalysis: true,
      url: componentAnalysis
    },
    abilityCode: 'syntacticAnalysis',
    syntacticAnalysis: {
      "sentence": "武汉明天的天⽓怎么样",
      "tenantId": "000000"
    }
  },
  //文档切分句子
  splitToSentences: {
    ...appkey,
    result: {
      splitToSentences: true,
      url: splitToSentences,
    },
    abilityCode: 'splitToSentences',
    splitToSentences: {
      "tenantId": "000000", "text": "北京中科汇联科技股份有限公司1999年成立于北京中关村，是一家致力于数字内容管理、人工智能交互和商业智能决策系统和行业解决方案的人工智能企业。是国家专精特新重点培育小巨人企业、连续5年中国人工智能百强企业、工信部人工智能揭榜挂帅企业、人工智能产学研一体化企业。致力于人工智能赋能产业化进程和各行业数字化转型升级，为全国各级党政机关、大中型企业、金融、教育等行业提供互联网内容管理平台、智能客服与机器人平台、智能指挥调度与虚拟智人平台的建设、运维和服务。", "normalizeFlag": false
    }
  },
  //短文本相似度计算
  senSim: {
    ...appkey,
    result: {
      senSim: true,
      url: senSim,
    },
    abilityCode: 'senSim',
    senSim: {
      "tenantId": "000000",
      "sourceSentence": "如何办理身份证",
      "targetSentenceList": [
        "我想办身份证",
        "身份证如何办理",
        "你好，办事情"
      ]
    }
  },
  //NLP数学计算器
  mathCompute: {
    ...appkey,
    result: {
      mathCompute: true,
      url: mathCompute,
    },
    abilityCode: 'mathCompute',
    mathCompute: {
      "tenantId": "000000", "sentence": "四百的平方根加上13的平方减去九十是多少"
    }
  },
  //挖掘词共现(可作为知识点，也可作为标签)
  miningWordCoOccurrences: {
    ...appkey,
    result: {
      miningWordCoOccurrences: true,
      url: miningWordCoOccurrences,
    },
    abilityCode: 'miningWordCoOccurrences',
    miningWordCoOccurrences: {
      tenantId: "000000", "sentences": ["如何办理身份证", "我想办身份证", "身份证如何办理", "北京的天气", "武汉明天的天气怎么样", "呵呵"]
    }
  },
  //标签提取
  extractTags: {
    ...appkey,
    result: {
      extractTags: true,
      url: extractTags,
    },
    abilityCode: 'extractTags',
    extractTags: {
      "tenantId": "000000",
      "text": "北京中科汇联科技股份有限公司1999年成立于北京中关村，是一家致力于数字内容管理、人工智能交互和商业智能决策系统和行业解决方案的人工智能企业。是国家专精特新重点培育小巨人企业、连续5年中国人工智能百强企业、工信部人工智能揭榜挂帅企业、人工智能产学研一体化企业。致力于人工智能赋能产业化进程和各行业数字化转型升级，为全国各级党政机关、大中型企业、金融、教育等行业提供互联网内容管理平台、智能客服与机器人平台、智能指挥调度与虚拟智人平台的建设、运维和服务。",
      "topN": 3
    }
  },
  //提取年月日返回值
  extractYearMonth: {
    ...appkey,
    result: {
      extractYearMonth: true,
      url: extractYearMonth,
    },
    abilityCode: "extractYearMonth",
    "extractYearMonth": {
      "sentence": "下个月1号的天气怎么样"
    }
  },
  //计算文本的SimHash
  simHash: {
    ...appkey,
    result: {
      simHash: true,
    },
    abilityCode: "simHash",
    "simHash": {
      "tenantId": "000000",
      "text": "某某计算机设备有限公司"
    }
  },
  //	计算SimHash的相似度
  simHashSim: {
    ...appkey,
    result: {
      simHashSim: true,
      url: simHashSim,
    },
    abilityCode: "simHashSim",
    "simHashSim": {
      "tenantId": "000000",
      "sourceHash": [13332, 57472, 30372, 55960],
      // "sourceHash": [13332],
      "targetHashList": [[13332, 57472, 30372, 55960], [13332, 57472, 30374, 55960], [13332, 57472, 30436, 55450]]
      // "targetHashList": [[13332]]
    }
  },
  //	执行lua脚本
  runLuaScript: {
    ...appkey,
    result: {
      runLuaScript: true,
      url: simHashSim,
    },
    ifTest: 'true',
    abilityCode: "runLuaScript",
    "runLuaScript":
    {
      "luaScript": "require('com.huilan.se.lua.jlib.JsonLib') \nrequire('com.huilan.se.lua.jlib.RequestsLib') \ny = math.sqrt(x)url = cs_robotUrl..'nlp/split' \nsplitParams = {tenantId = cs_tenantId, sentences = {text}} \nsplit = requests.post(url, splitParams) \nc = a + b \nd = {a = a, b = b, c = c} \nd = json.toJsonString(d) \ndd = json.parse(d) \nt = {} \ns = \"from=world, to=Lua\" \nfor k, v in string.gmatch(s, \"(%w+)=(%w+)\") do \n t[k]=v \nend \ncs_u_flag = not flag",
      "inputs": {
        "text": "黄河尚有澄清之日",
        "q": "胡萝卜",
        "a": 1653966909774,
        "b": 3.14,
        "flag": true,
        "x": 25
      },
      "outputs": {
        "split": null,
        "c": null,
        "d": null,
        "dd": null,
        "t": null,
        "y": null,
        "cs_u_flag": null
      },
      "contextSession": {
        "tenantId": "0",
        "agentId": "0",
        "sessionID": "0",
        "robotUrl": "http://api.sinonao.com/aikf-robot/"
      }
    }
  },
  //	成分句法分析服务
  componentAnalysis: {
    ...appkey,
    result: {
      componentAnalysis: true,
      url: componentAnalysis,
    },
    abilityCode: "componentAnalysis",
    "componentAnalysis": {
      "tenantId": "000000",
      "sentences": ["最新疫情政策是居家办公"]
    }
  },
  //	短语句法分析服务List
  componentAnalysisList: {
    ...appkey,
    abilityCode: "componentAnalysisList",
    "componentAnalysisList": {
      "tenantId": "000000",
      "sentences": [["最新", "疫情", "政策", "是", "居家", "办公"]]
    }
  },
  //	语义依存分析服务
  semanticDependencyAnalysis: {
    ...appkey,
    result: {
      semanticDependencyAnalysis: true,
      url: tagSenSim,
    },
    abilityCode: "semanticDependencyAnalysis",
    "semanticDependencyAnalysis": {
      "tenantId": "000000",
      "sentences": ["最新疫情政策是居家办公"]
    }
  },
  //	语义依存分析服务List
  semanticDependencyAnalysisList: {
    ...appkey,
    abilityCode: "semanticDependencyAnalysisList",
    "semanticDependencyAnalysisList": {
      "tenantId": "000000",
      "sentences": [["最新", "疫情", "政策", "是", "居家", "办公"]]
    }
  },
  //	语义角色标注服务
  semanticRoleLabeling: {
    ...appkey,
    result: {
      semanticRoleLabeling: true,
      url: semanticRoleLabeling,
    },
    abilityCode: "semanticRoleLabeling",
    "semanticRoleLabeling": {
      "tenantId": "000000",
      "sentences": ["最新疫情政策是居家办公"]
    }
  },
  //	语义角色标注服务List
  semanticRoleLabelingList: {
    ...appkey,
    abilityCode: "semanticRoleLabelingList",
    "semanticRoleLabelingList": {
      "tenantId": "000000",
      "sentences": [["最新", "疫情", "政策", "是", "居家", "办公"]]
    }
  },
  //	情感分析
  affectiveAnalysis: {
    ...appkey,
    abilityCode: "affectiveAnalysis",
    "affectiveAnalysis": {
      "tenantId": "000000",
      "text": "今天天气不错"
    }
  },
  //	标签与短文本相似度计算
  tagSenSim: {
    ...appkey,
    result: {
      tagSenSim: true,
      url: tagSenSim,
    },
    abilityCode: "tagSenSim",
    "tagSenSim": {
      "tenantId": "000000",
      "tagWords": { "公积金": 0.95, "提取,提,取出,取": 0.8, "异地,外地": 1.0 },
      "targetSentenceList": ["公积金怎么提取", "在异地怎么提取公积金", "外地换证怎么办理", "我想异地提取"]
    }
  },
  //	tts（汇联）
  ttsWithHuilan: {
    ...appkey,
    result: {
      content: 'false',
      url: voice,
    },
    abilityCode: "ttsWithHuilan",
    "ttsWithHuilan": {
      // "spk": "sn1", "spd": 1, "vol": 1, "pitch": 0, "fmt": "mp3", "ph": "0", "du": "1", "text": "吃饭了#{动作: 点头[0.5]}吗"
      "text": "北京天安门广场", "spk": "zhitian_emo", "emo": "happy", "vol": 1.0, "spd": 1.0, "pitch": 0.0, "fmt": 0.0, "cache": 1
    }
  },
  //	通用文字识别，高精度版，百度
  accurateBasicOcrWithBaidu: {
    ...appkey,
    result: {
      accurateBasicOcrWithBaidu: true,
      url: accurateBasicOcrWithBaidu,
    },
    abilityCode: "accurateBasicOcrWithBaidu",
    "accurateBasicOcrWithBaidu": {
      "paragraph": true, "probability": true, "url": "https://i.xingming.com/img/zidian2/1720.jpg"
    }
  },
  //	asr接口,汇联，上传文件
  asrForUploadFileWithHuilan: {
    ...appkey,
    // result: {
    //   url: distinguish,
    // },
    abilityCode: "asrForUploadFileWithHuilan",
    "file": '',
    appid: '000000',
  },
  //	办公文档识别，百度
  docAnalysisOfficeWithBaidu: {
    ...appkey,
    result: {
      docAnalysisOfficeWithBaidu: true,
      url: docAnalysisOfficeWithBaidu,
    },
    abilityCode: "docAnalysisOfficeWithBaidu",
    "docAnalysisOfficeWithBaidu": { "url": "https://gimg2.baidu.com/image_search/src=http%3A%2F%2Fi-1.cncrk.com%2F2020%2F4%2F9%2Fa402c807-1589-4066-aa60-6a1e236e1cb2.jpg&refer=http%3A%2F%2Fi-1.cncrk.com&app=2002&size=f9999,10000&q=a80&n=0&g=0n&fmt=auto?sec=1657683168&t=73bc7fa7c05e81a52c639cf413020c23" }
  },
  //	身份证识别，百度
  idcardWithBaidu: {
    ...appkey,
    result: {
      idcardWithBaidu: true,
      url: idcardWithBaidu,
    },
    abilityCode: "idcardWithBaidu",
    "idcardWithBaidu": { "id_card_side": "back", "url": "https://pic.quanjing.com/t8/ce/QJ6524050487.jpg?x-oss-process=style/show_794s" }
  },
  //		语音合成restful，阿里云
  speechSynthesizerRestfulWithAliyun: {
    ...appkey,
    result: {
      content: 'false',
      url: voice,
    },
    abilityCode: "speechSynthesizerRestfulWithAliyun",
    "speechSynthesizerRestfulWithAliyun": { "text": "今天是周一，天气挺好的。", "format": "wav" }
  },
  //		录音文件识别，阿里云本地
  recordingFileAsrWithAliyunLocal: {
    ...appkey,
    abilityCode: "recordingFileAsrWithAliyunLocal",
    callbackKey: 'recordingFileAsrCallbackWithAliyunLocal',
    "recordingFileAsrWithAliyunLocal": { "file_link": "https://gw.alipayobjects.com/os/bmw-prod/0574ee2e-f494-45a5-820f-63aee583045a.wav" }
  },
  //		录音文件识别结果轮询，阿里云本地(录音文件识别，阿里云本地第二个接口)
  recordingFileAsrCallbackWithAliyunLocal: {
    ...appkey,
    abilityCode: "recordingFileAsrWithAliyunLocal",
    "recordingFileAsrCallbackWithAliyunLocal": { "taskId": "" }
  },

  //		录音文件识别，阿里云
  recordingFileAsrWithAliyun: {
    ...appkey,
    abilityCode: "recordingFileAsrWithAliyun",
    callbackKey: 'recordingFileAsrCallbackWithAliyun',
    "recordingFileAsrWithAliyun": { "file_link": "https://gw.alipayobjects.com/os/bmw-prod/0574ee2e-f494-45a5-820f-63aee583045a.wav" }
  },
  //		录音文件识别结果轮询，阿里云(录音文件识别，阿里云本地第二个接口)
  recordingFileAsrCallbackWithAliyun: {
    ...appkey,
    abilityCode: "recordingFileAsrWithAliyun",
    "recordingFileAsrCallbackWithAliyun": { "taskId": "" }
  },
  //	搜索结果词优先排名
  rankQueryResult: {
    ...appkey,
    abilityCode: "rankQueryResult",
    "rankQueryResult": { "tenantId": "000000", "query": "⾝份证办理", "queryCandidates": [{ "sentence": "怎么办理⾝份证", "queryScore": 0.9 }, { "sentence": "如何办理户⼝", "standardSentence": "户⼝的办理⽅法", "queryScore": 0.6 }, { "sentence": "⾝份证补办" }] }
  },
  //	依存句法分析服务
  // dependencyParser: {
  //   ...appkey,
  //   result: {
  //     content: 'false',
  //     url: discoverNewWords,
  //   },
  //   abilityCode: "dependencyParser",
  //   "dependencyParser": { "tenantId": "000000", "query": "⾝份证办理", "queryCandidates": [{ "sentence": "怎么办理⾝份证", "queryScore": 0.9 }, { "sentence": "如何办理户⼝", "standardSentence": "户⼝的办理⽅法", "queryScore": 0.6 }, { "sentence": "⾝份证补办" }] }
  // },
  dependencyParser: {
    ...appkey,
    result: {
      dependencyParser: true,
      url: discoverNewWords,
    },
    abilityCode: "dependencyParser",
    "dependencyParser": { "sentences": [["最新", "疫情", "政策", "是", "居家", "办公"]] }
  },
  //		chatgpt接口
  chatgptForOpenAi: {
    ...appkey,
    result: {
      chatgptForOpenAi: true,
      url: '',
    },
    abilityCode: "chatgptForOpenAi",
    "chatgptForOpenAi": {
      "input_text": '他改成她',
      "top_p": 1,
      "temperature": 0.6,
      history: []
      // history: ["写个小故事，20字", "他在雨中等她，她没来，他悄然离去。"] 
    }
  },
  //		文生图接口
  txtToImgForHuilan: {
    ...appkey,
    result: {
      txtToImgForHuilan: true,
      url: '',
    },
    abilityCode: "txtToImgForHuilan",
    "txtToImgForHuilan": {
      "prompt": "举头望明月，低头思故乡",
      "batch_size": 1,
      "width": 640,
      "height": 768
    }
  },
  // 汇联对话
  chatgptForHuilan: {
    ...appkey,
    result: {
      chatgptForHuilan: true,
      url: '',
    },
    abilityCode: "chatgptForHuilan",
    "chatgptForHuilan": {
      "input_text": "中国的首都",
    }
  },
}
const params = {
  RequestBodyTabListChils,   //请求参数数据每个接口不同字段
  dataJson: [
    //关键词提取
    {
      extractKeywordsFromTxt: {
        RequestBody: RequestBody.extractKeywordsFromTxt,
        testUrl: "",
        RequestUrl: extractKeywordsFromTxt,
        RequestBodyTabList,
        responseStatus,
        responseParameter: responseParameter.extractKeywordsFromTxt,
        example: example.extractKeywordsFromTxt
      }
    },
    // 新词发现
    {
      discoverNewWords: {
        RequestBody: RequestBody.discoverNewWords,
        testUrl: "",
        RequestUrl: extractKeywordsFromTxt,
        RequestBodyTabList,
        responseStatus,
        responseParameter: responseParameter.discoverNewWords,
        example: example.discoverNewWords
      },
    },
    //分词
    {
      splitSentences: {
        RequestBody: RequestBody.splitSentences,
        testUrl: "",
        RequestUrl: extractKeywordsFromTxt,
        RequestBodyTabList,
        responseStatus,
        responseParameter: responseParameter.splitSentences,
        example: example.splitSentences
      },
    },
    //语种识别
    {
      charDetect: {
        RequestBody: RequestBody.charDetect,
        RequestUrl: extractKeywordsFromTxt,
        RequestBodyTabList,
        responseStatus,
        responseParameter: responseParameter.charDetect,
        example: example.charDetect
      },
    },
    //实体提取
    {
      extractEntities: {
        RequestBody: RequestBody.extractEntities,
        RequestUrl: extractKeywordsFromTxt,
        RequestBodyTabList,
        responseStatus,
        responseParameter: responseParameter.extractEntities,
        example: example.extractEntities
      },
    },
    //摘要提取
    {
      extractSummary: {
        RequestBody: RequestBody.extractSummary,
        RequestUrl: extractKeywordsFromTxt,
        RequestBodyTabList,
        responseStatus,
        responseParameter: responseParameter.extractSummary,
        example: example.extractSummary
      },
    },
    //敏感词过滤
    {
      findSensitiveWords: {
        RequestBody: RequestBody.findSensitiveWords,
        RequestUrl: extractKeywordsFromTxt,
        RequestBodyTabList,
        responseStatus,
        responseParameter: responseParameter.findSensitiveWords,
        example: example.findSensitiveWords
      },
    },
    //从聊天记录或文档挖掘QA
    {
      miningQA: {
        RequestBody: RequestBody.miningQA,
        RequestUrl: extractKeywordsFromTxt,
        RequestBodyTabList,
        responseStatus,
        responseParameter: responseParameter.miningQA,
        example: example.miningQA
      },
    },
    //句子聚类
    {
      sentenceCluster: {
        RequestBody: RequestBody.sentenceCluster,
        RequestUrl: extractKeywordsFromTxt,
        RequestBodyTabList,
        responseStatus,
        responseParameter: responseParameter.sentenceCluster,
        example: example.sentenceCluster
      },
    },
    //句法分析
    {
      syntacticAnalysis: {
        RequestBody: RequestBody.syntacticAnalysis,
        RequestUrl: extractKeywordsFromTxt,
        RequestBodyTabList,
        responseStatus,
        responseParameter: responseParameter.syntacticAnalysis,
        example: example.syntacticAnalysis
      }
    },
    //文档切分句子
    {
      splitToSentences: {
        RequestBody: RequestBody.splitToSentences,
        RequestUrl: extractKeywordsFromTxt,
        RequestBodyTabList,
        responseStatus,
        responseParameter: responseParameter.splitToSentences,
        example: example.splitToSentences
      }
    },
    //短文本相似度计算
    {
      senSim: {
        RequestBody: RequestBody.senSim,
        RequestUrl: extractKeywordsFromTxt,
        RequestBodyTabList,
        responseStatus,
        responseParameter: responseParameter.senSim,
        example: example.senSim
      }
    },
    //NLP数学计算器
    {
      mathCompute: {
        RequestBody: RequestBody.mathCompute,
        RequestUrl: extractKeywordsFromTxt,
        RequestBodyTabList,
        responseStatus,
        responseParameter: responseParameter.mathCompute,
        example: example.mathCompute
      }
    },
    //挖掘词共现(可作为知识点，也可作为标签)
    {
      miningWordCoOccurrences: {
        RequestBody: RequestBody.miningWordCoOccurrences,
        RequestUrl: extractKeywordsFromTxt,
        RequestBodyTabList,
        responseStatus,
        responseParameter: responseParameter.miningWordCoOccurrences,
        example: example.miningWordCoOccurrences
      }
    },
    //挖掘词共现(可作为知识点，也可作为标签)
    {
      extractTags: {
        RequestBody: RequestBody.extractTags,
        RequestUrl: extractKeywordsFromTxt,
        RequestBodyTabList,
        responseStatus,
        responseParameter: responseParameter.extractTags,
        example: example.extractTags
      }
    },
    //提取年月日
    {
      extractYearMonth: {
        RequestBody: RequestBody.extractYearMonth,
        RequestUrl: extractKeywordsFromTxt,
        RequestBodyTabList,
        responseStatus,
        responseParameter: responseParameter.extractYearMonth,
        example: example.extractYearMonth
      }
    },
    //计算文本的SimHash
    {
      simHash: {
        RequestBody: RequestBody.simHash,
        RequestUrl: extractKeywordsFromTxt,
        RequestBodyTabList,
        responseStatus,
        responseParameter: responseParameter.simHash,
        example: example.simHash
      }
    },
    //计算SimHash的相似度
    {
      simHashSim: {
        RequestBody: RequestBody.simHashSim,
        RequestUrl: extractKeywordsFromTxt,
        RequestBodyTabList,
        responseStatus,
        responseParameter: responseParameter.simHashSim,
        example: example.simHashSim
      }
    },
    //执行lua脚本
    {
      runLuaScript: {
        RequestBody: RequestBody.runLuaScript,
        RequestUrl: extractKeywordsFromTxt,
        RequestBodyTabList,
        responseStatus,
        responseParameter: responseParameter.runLuaScript,
        example: example.runLuaScript
      }
    },
    //成分句法分析服务
    {
      componentAnalysis: {
        RequestBody: RequestBody.componentAnalysis,
        RequestUrl: extractKeywordsFromTxt,
        RequestBodyTabList,
        responseStatus,
        responseParameter: responseParameter.componentAnalysis,
        example: example.componentAnalysis
      }
    },
    //短语句法分析服务List
    {
      componentAnalysisList: {
        RequestBody: RequestBody.componentAnalysisList,
        RequestUrl: extractKeywordsFromTxt,
        RequestBodyTabList,
        responseStatus,
        responseParameter: responseParameter.componentAnalysisList,
        example: example.componentAnalysisList
      }
    },
    //语义依存分析服务
    {
      semanticDependencyAnalysis: {
        RequestBody: RequestBody.semanticDependencyAnalysis,
        RequestUrl: extractKeywordsFromTxt,
        RequestBodyTabList,
        responseStatus,
        responseParameter: responseParameter.semanticDependencyAnalysis,
        example: example.semanticDependencyAnalysis
      }
    },
    //语义依存分析服务List
    {
      semanticDependencyAnalysisList: {
        RequestBody: RequestBody.semanticDependencyAnalysisList,
        RequestUrl: extractKeywordsFromTxt,
        RequestBodyTabList,
        responseStatus,
        responseParameter: responseParameter.semanticDependencyAnalysisList,
        example: example.semanticDependencyAnalysisList
      }
    },
    //语义角色标注服务
    {
      semanticRoleLabeling: {
        RequestBody: RequestBody.semanticRoleLabeling,
        RequestUrl: extractKeywordsFromTxt,
        RequestBodyTabList,
        responseStatus,
        responseParameter: responseParameter.semanticRoleLabeling,
        example: example.semanticRoleLabeling
      }
    },
    //语义角色标注服务List
    {
      semanticRoleLabelingList: {
        RequestBody: RequestBody.semanticRoleLabelingList,
        RequestUrl: extractKeywordsFromTxt,
        RequestBodyTabList,
        responseStatus,
        responseParameter: responseParameter.semanticRoleLabelingList,
        example: example.semanticRoleLabelingList
      }
    },
    //情感分析
    {
      affectiveAnalysis: {
        RequestBody: RequestBody.affectiveAnalysis,
        RequestUrl: extractKeywordsFromTxt,
        RequestBodyTabList,
        responseStatus,
        responseParameter: responseParameter.affectiveAnalysis,
        example: example.affectiveAnalysis
      }
    },
    //标签词对句子的打分及排序
    {
      tagSenSim: {
        RequestBody: RequestBody.tagSenSim,
        RequestUrl: extractKeywordsFromTxt,
        RequestBodyTabList,
        responseStatus,
        responseParameter: responseParameter.tagSenSim,
        example: example.tagSenSim
      }
    },
    //tts（汇联）
    {
      ttsWithHuilan: {
        RequestBody: RequestBody.ttsWithHuilan,
        RequestUrl: extractKeywordsFromTxt,
        RequestBodyTabList,
        responseStatus,
        responseParameter: responseParameter.ttsWithHuilan,
        example: example.ttsWithHuilan
      }
    },
    //通用文字识别，高精度版，百度
    {
      accurateBasicOcrWithBaidu: {
        RequestBody: RequestBody.accurateBasicOcrWithBaidu,
        RequestUrl: extractKeywordsFromTxt,
        RequestBodyTabList,
        responseStatus,
        responseParameter: responseParameter.accurateBasicOcrWithBaidu,
        example: example.accurateBasicOcrWithBaidu
      }
    },
    //asr接口,汇联，上传文件
    {
      asrForUploadFileWithHuilan: {
        RequestBody: RequestBody.asrForUploadFileWithHuilan,
        RequestUrl: extractKeywordsFromTxt,
        RequestBodyTabList,
        responseStatus,
        responseParameter: responseParameter.asrForUploadFileWithHuilan,
        example: example.asrForUploadFileWithHuilan
      }
    },
    //	办公文档识别，百度
    {
      docAnalysisOfficeWithBaidu: {
        RequestBody: RequestBody.docAnalysisOfficeWithBaidu,
        RequestUrl: extractKeywordsFromTxt,
        RequestBodyTabList,
        responseStatus,
        responseParameter: responseParameter.docAnalysisOfficeWithBaidu,
        example: example.docAnalysisOfficeWithBaidu
      }
    },
    //	身份证识别，百度
    {
      idcardWithBaidu: {
        RequestBody: RequestBody.idcardWithBaidu,
        RequestUrl: extractKeywordsFromTxt,
        RequestBodyTabList,
        responseStatus,
        responseParameter: responseParameter.idcardWithBaidu,
        example: example.idcardWithBaidu
      }
    },
    //		语音合成restful，阿里云
    {
      speechSynthesizerRestfulWithAliyun: {
        RequestBody: RequestBody.speechSynthesizerRestfulWithAliyun,
        RequestUrl: extractKeywordsFromTxt,
        RequestBodyTabList,
        responseStatus,
        responseParameter: responseParameter.speechSynthesizerRestfulWithAliyun,
        example: example.speechSynthesizerRestfulWithAliyun
      }
    },
    //		录音文件识别，阿里云
    {
      recordingFileAsrWithAliyun: {
        RequestBody: RequestBody.recordingFileAsrWithAliyun,
        RequestUrl: extractKeywordsFromTxt,
        RequestBodyTabList,
        responseStatus,
        responseParameter: responseParameter.recordingFileAsrWithAliyun,
        example: example.recordingFileAsrWithAliyun
      }
    },
    //录音文件识别，阿里云远程
    {
      recordingFileAsrCallbackWithAliyun: {
        RequestBody: RequestBody.recordingFileAsrCallbackWithAliyun,
        RequestUrl: extractKeywordsFromTxt,
        RequestBodyTabList,
        responseStatus,
        responseParameter: responseParameter.recordingFileAsrCallbackWithAliyun,
        example: example.recordingFileAsrCallbackWithAliyun
      }
    },
    //		录音文件识别，阿里云本地
    {
      recordingFileAsrWithAliyunLocal: {
        RequestBody: RequestBody.recordingFileAsrWithAliyunLocal,
        RequestUrl: extractKeywordsFromTxt,
        RequestBodyTabList,
        responseStatus,
        responseParameter: responseParameter.recordingFileAsrWithAliyun,
        example: example.recordingFileAsrWithAliyun
      }
    },
    //		录音文件识别结果轮询，阿里云本地(录音文件识别，阿里云本地第二个接口)
    {
      recordingFileAsrCallbackWithAliyunLocal: {
        RequestBody: RequestBody.recordingFileAsrCallbackWithAliyunLocal,
        RequestUrl: extractKeywordsFromTxt,
        RequestBodyTabList,
        responseStatus,
        responseParameter: responseParameter.recordingFileAsrCallbackWithAliyunLocal,
        example: example.recordingFileAsrCallbackWithAliyunLocal
      }
    },
    //	搜索结果词优先排名
    {
      rankQueryResult: {
        RequestBody: RequestBody.rankQueryResult,
        RequestUrl: extractKeywordsFromTxt,
        RequestBodyTabList,
        responseStatus,
        responseParameter: responseParameter.recordingFileAsrCallbackWithAliyunLocal,
        example: example.recordingFileAsrCallbackWithAliyunLocal
      }
    },
    //	依存句法分析服务
    {
      dependencyParser: {
        RequestBody: RequestBody.dependencyParser,
        RequestUrl: extractKeywordsFromTxt,
        RequestBodyTabList,
        responseStatus,
        responseParameter: responseParameter.recordingFileAsrCallbackWithAliyunLocal,
        example: example.recordingFileAsrCallbackWithAliyunLocal
      }
    },
    //	chatgpt接口
    {
      chatgptForOpenAi: {
        RequestBody: RequestBody.chatgptForOpenAi,
        RequestUrl: extractKeywordsFromTxt,
        RequestBodyTabList,
        responseStatus,
        responseParameter: responseParameter.chatgptForOpenAi,
        example: example.chatgptForOpenAi
      }
    },
    //		文生图接口
    {
      txtToImgForHuilan: {
        RequestBody: RequestBody.txtToImgForHuilan,
        RequestUrl: extractKeywordsFromTxt,
        RequestBodyTabList,
        responseStatus,
        responseParameter: responseParameter.txtToImgForHuilan,
        example: example.txtToImgForHuilan
      }
    },
    //		汇联对话
    {
      chatgptForHuilan: {
        RequestBody: RequestBody.chatgptForHuilan,
        RequestUrl: extractKeywordsFromTxt,
        RequestBodyTabList,
        responseStatus,
        responseParameter: responseParameter.chatgptForHuilan,
        example: example.chatgptForHuilan
      }
    },
  ],
}
export default {
  params
}
