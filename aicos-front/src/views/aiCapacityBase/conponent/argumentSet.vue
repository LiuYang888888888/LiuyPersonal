<template>
  <div class="setbox">
    <div class="set">参数设置</div>
    <ArgumentSetTable v-if="type === 'table' || type === 'tableAndform'" ref="argumentSetTable"></ArgumentSetTable>
    <avue-form v-if="type === 'form' || type === 'tableAndform'" ref="form" v-model="form" :option="option"
      @submit="submit">
      <template slot="image">
        <HuilanUploader :auto-upload="autoUpload" ref="huilanUploader" title="上传背景图片" :limit="1" action=""
          :list-type="listType" :accept="accept" :data="dataImg" :on-change="uploadBefore">
          <i v-if="listType === 'picture-card'" class="el-icon-plus" @click="submitUpload"></i>
          <el-button v-if="!listType" size="small" type="primary">点击上传</el-button>
        </HuilanUploader>
      </template>
      <template slot="video">
        <HuilanUploader :auto-upload="autoUpload" ref="huilanUploaderVideo" title="上传背景图片" :limit="2" :action="uploadUrl"
          :list-type="listType" :accept="accept" :data="dataVideo" :before-upload="uploadBeforeVideo"
          :on-success="uploadSuccessVideo" :file-list="fileList">
          <el-button size="small" type="primary">点击上传</el-button>
        </HuilanUploader>
      </template>
    </avue-form>
    <div style="margin: 20px 10px;">
      <vue-json-editor v-if="type === 'json'" v-model="json" :showBtns="false" :mode="'text'" lang="zh" />
    </div>
    <div class="btn-list">
      <el-button size="small" style="margin-right: 10px;" type="" @click="handleEmpty" :loading="btnLoading"
        :disabled="disabled">还原</el-button>
      <el-button size="small" type="primary" @click="handleSubmit" :loading="btnLoading"
        :disabled="disabled">开始分析</el-button>
    </div>
  </div>
</template>
<script>
import { extractKeywordsFromTxt } from "@/api/configure/aiAbility";
import ArgumentSetTable from "./argumentSetTable.vue";
import HuilanUploader from "@/components/uploader";
import serviceList from "@/config/serviceList";
const { ai } = serviceList
import { baseURL } from '@/api/common';
const action = `${baseURL}api/${ai}/ai/asrForUploadFileWithHuilan`
const vueJsonEditor = () => import('vue-json-editor');
export default {
  name: "argumentSet",
  components: {
    ArgumentSetTable,
    HuilanUploader,
    vueJsonEditor,
  },
  props: {
  },
  data() {
    // const self = this
    return {
      form: {},
      para: {},
      type: 'form',
      abilityCode: '',
      uploadUrl: action,
      accept: 'image/*',
      dataImg: {},
      autoUpload: false,
      listType: '',
      disabled: false,
      dataVideo: {},
      json: {},
      loverCase: ['一', '二', '三', '四', '五', '六', '七', '八', '九', '十'],
      fileList: [],
      option: {
        emptyBtn: false,
        submitBtn: false,
        column: []
      },
      RequestSourceData: {},
      btnLoading: false,
    };
  },
  computed: {},
  created() {
  },
  methods: {
    handleSubmit() {
      if (this.abilityCode === 'miningQA') {
        const sentences = this.$refs.argumentSetTable.currentList
        if (sentences.length > 0) {
          this.tabSubmit({ sentences })
        } else {
          this.$message.error('请添加待挖掘内容')
        }
      } else if (this.abilityCode === 'tagSenSim') {
        const sentences = this.$refs.argumentSetTable.currentList
        if (sentences.length > 0) {
          this.tabSubmit(sentences)
        } else {
          this.$message.error('请添加待挖掘内容')
        }
      } else if (this.abilityCode === 'rankQueryResult' || this.abilityCode === "dependencyParser" || this.abilityCode === 'runLuaScript') {
        this.tabSubmit(this.para)
      } else {
        this.$refs.form.submit()
      }
    },
    submit(form, done) {
      const self = this
      this.btnLoading = true
      const abilityCode = this.para['abilityCode']
      let para = {}
      if (abilityCode === 'runLuaScript') {
        // para = {
        //   abilityCode,
        //   ifTest: "true",
        //   [abilityCode]: {
        //     ...this.RequestBody[abilityCode],
        //     inputs: { ...this.RequestBody[abilityCode]['inputs'], ...form },
        //   }
        // }
      }
      else if (abilityCode === 'simHashSim') {
        let paraSim = {
          sourceHash: form.sourceHash,
          targetHashList: [form.targetHashList1, form.targetHashList2, form.targetHashList3],
        }
        para = {
          abilityCode,
          ifTest: "true",
          [abilityCode]: {
            ...this.para[abilityCode],
            ...paraSim,
          }
        }
      } else {
        para = {
          abilityCode,
          ifTest: "true",
          [abilityCode]: {
            ...this.para[abilityCode],
            ...form,
          }
        }
        if (this.para.callbackKey) {
          para = { ...para, 'callbackKey': this.para.callbackKey }
        }
      }
      extractKeywordsFromTxt({ ...para }).then((res) => {
        const status = res.data;
        const data = res.data.data;
        if (status.success) {
          let splitArr = []
          let arr = [];
          let json = {};
          let arrSuc = [];
          let str = '';
          let strDate = '';
          let params = {
            key: 'common',
            type: 'tageList',
            data: arr,
          }
          switch (self.para['abilityCode']) {
            case 'splitSentences':
              // splitArr = data.splitSentences[0].split(" ");
              splitArr = data.splitSentences;
              splitArr.map((v) => {
                if (v) {
                  arr.push(v)
                }
              });
              params = {
                key: 'common',
                type: 'tageList',
                data: arr,
              }
              this.$emit('resultData', params)
              break;
            case 'discoverNewWords':
              arr = data.newWords
              params = {
                key: 'common',
                type: 'tageList',
                data: arr,
              }
              this.$emit('resultData', params)
              break;
            case 'extractKeywordsFromTxt':
              arr = Object.keys(data[0])
              params = {
                key: 'common',
                type: 'tageList',
                data: arr,
              }
              this.$emit('resultData', params)
              break;
            case 'extractEntities':
              //实体提取word,nao
              splitArr = [];
              data.entityWords.map((v) => {
                let entityNames = null;
                v.entityNames.map((t) => {
                  entityNames = t + ':' + v.word
                  splitArr.push(entityNames);
                });
              });
              arr = []
              arrSuc = []
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
              params = {
                key: 'common',
                type: 'tageList',
                data: arrSuc,
              }
              this.$emit('resultData', params)
              break;
            case 'charDetect':
              arr = [data.zhName]
              params = {
                key: 'common',
                type: 'tageList',
                data: arr,
              }
              this.$emit('resultData', params)
              break;
            case 'findSensitiveWords':
              arr = [];
              data.sensitiveWordsResult.map((v) => {
                if (v.length > 0) {
                  v.map(t => {
                    arr.push(t.text);
                  })
                }
              });
              params = {
                key: 'common',
                type: 'tageList',
                data: arr,
              }
              this.$emit('resultData', params)
              break;
            case 'syntacticAnalysis':
              json = data
              params = {
                key: 'common',
                type: 'json',
                data: json,
              }
              this.$emit('resultData', params)
              break;
            case 'sentenceCluster':
              str = ''
              arr = []
              data.groups.map((v) => {
                if (v.groupId) {
                  if (v.groupId) {
                    str = self.loverCase[v.groupId - 1];
                    arr.push("第" + str + "组");
                  }
                }
                v.sentences.map((t) => {
                  arr.push(t.text);
                });
              });
              params = {
                key: 'common',
                type: 'tageList',
                data: arr,
              }
              this.$emit('resultData', params)
              break;
            case 'extractSummary':
              arr = [data.summary];
              params = {
                key: 'common',
                type: 'tageList',
                data: arr,
              }
              this.$emit('resultData', params)
              break;
            case 'splitToSentences':
              arr = data.sentences;
              params = {
                key: 'common',
                type: 'tageList',
                data: arr,
              }
              this.$emit('resultData', params)
              break;
            case 'senSim':
              arr = []
              data.sentenceScores.map((v) => {
                arr.push(v.sentence, v.score.toFixed(4));
              });
              params = {
                key: 'common',
                type: 'tageList',
                data: arr,
              }
              this.$emit('resultData', params)
              break;
            case 'mathCompute':
              arr = [data.equation];
              params = {
                key: 'common',
                type: 'tageList',
                data: arr,
              }
              this.$emit('resultData', params)
              break;
            case 'miningWordCoOccurrences':
              arr = []
              data.wordCoOccurrences.map((v) => {
                arr.push(v.words.join('-'))
              });
              params = {
                key: 'common',
                type: 'tageList',
                data: arr,
              }
              this.$emit('resultData', params)
              break;
            case 'extractTags':
              arr = data
              params = {
                key: 'common',
                type: 'tageList',
                data: arr,
              }
              this.$emit('resultData', params)
              break;
            case 'extractYearMonth':
              str = ''
              strDate = ''
              arr = [];
              if (data.fromYearVal) {
                str += data.fromYearVal + '年-'
              }
              if (data.fromMonthVal) {
                str += data.fromMonthVal + '月-'
              }
              if (data.fromDateVal) {
                str += data.fromDateVal + '日'
              }
              if (data.toYearVal) {
                strDate += data.toYearVal + '年-'
              }
              if (data.toMonthVal) {
                strDate += data.toMonthVal + '月-'
              }
              if (data.toDateVal) {
                strDate += data.toDateVal + '日'
              }
              if (str) {
                arr.push(str)
              }
              if (strDate) {
                arr.push(strDate)
              }
              params = {
                key: 'common',
                type: 'tageList',
                data: arr,
              }
              this.$emit('resultData', params)
              break;
            case 'simHash':
              params = {
                key: 'common',
                type: 'json',
                data,
              }
              this.$emit('resultData', params)
              break;
            case 'runLuaScript':
              params = {
                key: 'common',
                type: 'json',
                data,
              }
              this.$emit('resultData', params)
              break;
            case 'affectiveAnalysis':
              params = {
                key: 'common',
                type: 'json',
                data,
              }
              this.$emit('resultData', params)
              break;
            case 'ttsWithHuilan':
              str = "data:audio/wav;base64," + data.audio;
              params = {
                key: 'common',
                type: 'audio',
                data: str,
              }
              this.$emit('resultData', params)
              break;
            case 'recordingFileAsrWithAliyun':
              params = {
                abilityCode: "recordingFileAsrWithAliyun",
                ifTest: "true",
                recordingFileAsrCallbackWithAliyun: { taskId: data.taskId }
              }
              if (data.taskId) {
                this.invoke(params)
              }
              break;
            case 'speechSynthesizerRestfulWithAliyun':
              str = "data:audio/wav;base64," + data.audio;
              params = {
                key: 'common',
                type: 'audio',
                data: str,
              }
              this.$emit('resultData', params)
              break;
            case 'recordingFileAsrWithAliyunLocal':
              params = {
                abilityCode: "recordingFileAsrWithAliyunLocal",
                ifTest: "true",
                recordingFileAsrCallbackWithAliyunLocal: { taskId: data.taskId }
              }
              if (data.taskId) {
                this.invoke(params)
              }
              break;
            case 'accurateBasicOcrWithBaidu':
              arr = []
              if (data.words_result.length > 0) {
                data.words_result.map(v => {
                  arr.push(v.words)
                })
              }
              params = {
                key: 'common',
                type: 'tageList',
                data: arr,
              }
              this.$emit('resultData', params)
              break;
            case 'docAnalysisOfficeWithBaidu':
              arr = []
              if (data.words_result.length > 0) {
                data.words_result.map(v => {
                  arr.push(v.words)
                })
              }
              params = {
                key: 'common',
                type: 'tageList',
                data: arr,
              }
              break
            case 'idcardWithBaidu':
              arr = [
                data.words_result["失效日期"].words,
                data.words_result["签发日期"].words,
                data.words_result["签发机关"].words,
              ];
              params = {
                key: 'common',
                type: 'tageList',
                data: arr,
              }
              this.$emit('resultData', params)
              break
            case 'simHashSim':
              arr = [];
              data.simHashSimilarityList.map((v) => {
                let obj = `目标SimHash${v.index + 1}:${v.similar ? '相似' : '不相似'}-距离${v.distance}`
                arr.push(obj)
              });
              params = {
                key: 'common',
                type: 'tageList',
                data: arr,
              }
              this.$emit('resultData', params)
              break
            case 'txtToImgForHuilan':
              arr = data.images;
              params = {
                key: 'common',
                type: 'text',
                data: arr,
              }
              this.$emit('resultData', params)
              break
          }
        }
        this.btnLoading = false
      }).catch(() => {
        this.btnLoading = false
      })
      done()
    },
    init(data) {
      this.disabled = false
      this.option.column = data.column
      this.para = data.para
      this.RequestBody = data.RequestBody
      this.RequestSourceData = data
      this.abilityCode = data.para['abilityCode']
      this.$nextTick(() => {
        this.defaultValue()
      })
      if (data.type === 'table') {
        this.type = data.type
        this.$nextTick(() => {
          this.$refs.argumentSetTable.init(data.RequestBody)
        })
      } else if (data.type === 'tableAndform') {
        this.type = 'tableAndform'
        this.$nextTick(() => {
          this.$refs.argumentSetTable.init(data.RequestBody)
        })
      } else if (data.type === 'json') {
        this.type = 'json'
        this.json = data.para
      } else {
        this.type = 'form'
      }
      if (data.para['abilityCode'] === 'accurateBasicOcrWithBaidu') {
        this.listType = 'picture-card'
        this.accept = 'image/*'
      }
      if (data.para['abilityCode'] === 'docAnalysisOfficeWithBaidu') {
        this.listType = ''
        this.accept = 'image/*,.pdf'
      }
      if (data.para['abilityCode'] === 'idcardWithBaidu') {
        this.listType = 'picture-card'
        this.accept = 'image/*,.pdf'
      }
      if (data.para['abilityCode'] === 'asrForUploadFileWithHuilan') {
        this.listType = ''
        this.accept = '.mp3,.wav,.flac,.aac,.ogg,.aiff'
        this.disabled = true
        this.autoUpload = true
        this.dataVideo = {
          ifTest: true,
          abilityCode: this.para['abilityCode'],
          appid: this.RequestSourceData.primitiveData['appid'],
        }
      }
    },
    emptyInit() {
      this.option.column = []
      this.disabled = true
    },
    handleEmpty() {
      if (this.abilityCode === 'miningQA' || this.abilityCode === 'tagSenSim') {
        this.$refs.argumentSetTable.init(this.RequestBody)
        if (this.abilityCode === 'tagSenSim') {
          this.form = {
            ...this.RequestSourceData.primitiveData,
            targetSentenceList: ["公积金怎么提取", "在异地怎么提取公积金", "外地换证怎么办理", "我想异地提取"]
          }
        }
      } else if (this.abilityCode === 'rankQueryResult' || this.abilityCode === 'dependencyParser' || this.abilityCode === 'runLuaScript') {
        this.json = { ...this.para }
        this.$emit('jsonResultClear')
      } else if (this.abilityCode === 'simHashSim') {
        this.form = {
          ...this.RequestSourceData.primitiveData,
          sourceHash: [13332, 57472, 30372, 55960],
          targetHashList1: [13332, 57472, 30372, 55960],
          targetHashList2: [13332, 57472, 30374, 55960],
          targetHashList3: [13332, 57472, 30436, 55450],
        }
      } else if (this.abilityCode === 'sentenceCluster') {
        this.form = {
          ...this.RequestSourceData.primitiveData,
          "sentences": ["北京的天气", "武汉明天的天气怎么样", "呵呵"]
        }
      } else if (this.abilityCode === 'findSensitiveWords') {
        this.form = {
          "sentences": ["⽼赵，你他娘的混蛋", "法〜轮功", "呵呵"]
        }
      } else if (this.abilityCode === 'splitSentences') {
        this.form = {
          sentences: ["人工智能是计算机科学的一个分支，它企图了解智能的实质，并生产出一种新的能以人类智能相似的方式做出反应的智能机器。"]
        }
      } else if (this.abilityCode === 'miningWordCoOccurrences') {
        this.form = {
          "sentences": ["如何办理身份证", "我想办身份证", "身份证如何办理", "北京的天气", "武汉明天的天气怎么样", "呵呵"]
        }
      }
      else {
        this.form = {
          ...this.RequestSourceData.primitiveData
        }
      }
    },
    defaultValue() {
      const self = this
      if (this.abilityCode === 'tagSenSim') {
        this.form = {
          ...this.RequestSourceData.primitiveData,
          targetSentenceList: ["公积金怎么提取", "在异地怎么提取公积金", "外地换证怎么办理", "我想异地提取"]
        }
      } else if (this.abilityCode === 'simHashSim') {
        setTimeout(() => {
          self.form = {
            ...self.RequestSourceData.primitiveData,
            targetHashList1: self.RequestSourceData.RequestBody[self.abilityCode].targetHashList[0],
            targetHashList2: self.RequestSourceData.RequestBody[self.abilityCode].targetHashList[1],
            targetHashList3: self.RequestSourceData.RequestBody[self.abilityCode].targetHashList[2],
          }
        }, 100)
      } else {
        this.form = {
          ...this.RequestSourceData.primitiveData
        }
      }
    },
    tabSubmit(sentences) {
      let flug = true
      const abilityCode = this.para['abilityCode']
      this.btnLoading = true
      console.log(this.json)
      let params = {
        abilityCode,
        ifTest: "true",
        [abilityCode]: {
          ...this.para[abilityCode],
          ...sentences,
        }
      }
      if (abilityCode === 'tagSenSim') {
        let tagWords = {}
        sentences.map(v => {
          tagWords[v.roleType] = v.sentence
        })
        this.form.targetSentenceList.map(v => {
          if (!v) {
            flug = false
            this.btnLoading = false
          }
        })
        params = {
          abilityCode,
          ifTest: "true",
          [abilityCode]: {
            ...this.para[abilityCode],
            ...this.form,
            tagWords,
          }
        }
      }
      if (abilityCode === 'dependencyParser' || abilityCode === 'rankQueryResult' || abilityCode === 'runLuaScript') {
        params = this.json
      }
      if (flug) {
        extractKeywordsFromTxt({ ...params }).then((res) => {
          const abilityCode = this.para['abilityCode']
          const status = res.data;
          const data = res.data.data;
          if (status.success) {
            let arr = []
            let arrList = []
            let paramsDada = {}
            if (abilityCode === 'miningQA') {
              data.qaList.map(v => {
                let answer = ''
                if (v.answer) {
                  answer = v.answer
                } else {
                  answer = ''
                }
                arr.push(v.question + '：' + answer)
              })
              arr.map(v => {
                if (v) {
                  arrList.push(v)
                }
              })
              paramsDada = {
                key: 'common',
                type: 'tageList',
                data: arrList,
              }
              this.$emit('resultData', paramsDada)
            }
            if (abilityCode === 'tagSenSim') {
              arr = []
              let str = ''
              if (data.sentenceScores && data.sentenceScores.length > 0) {
                data.sentenceScores.map((v) => {
                  str = v.sentence + '：' + v.score.toFixed(4)
                  arr.push(str)
                });
              }
              paramsDada = {
                key: 'common',
                type: 'tageList',
                data: arr.sort(),
              }
              this.$emit('resultData', paramsDada)
            }
            if (abilityCode === 'rankQueryResult' || this.abilityCode === "dependencyParser" || this.abilityCode === "runLuaScript") {
              paramsDada = {
                key: 'json',
                type: 'json',
                data,
              }
              this.$emit('resultData', paramsDada)
            }
          }
          this.btnLoading = false
        }).catch(() => {
          this.btnLoading = false
        })
      }
    },
    invoke(params) {
      this.btnLoading = true
      extractKeywordsFromTxt({ ...params }).then((res) => {
        const status = res.data;
        const data = res.data.data;
        if (status.success) {
          let arr = [data.sentences[0].text]
          const params = {
            key: 'common',
            type: 'tageList',
            data: arr,
          }
          this.$emit('resultData', params)
          this.btnLoading = false
        }
      }).catch(() => {
        this.btnLoading = false
      })
    },
    submitUpload() {
      this.$refs.huilanUploader.submit();
    },
    async uploadBefore(file) {
      const self = this
      const abilityCode = this.para['abilityCode']
      let flugImg = false
      const fileType = file.name.split('.').pop()
      if (abilityCode === 'accurateBasicOcrWithBaidu') {
        flugImg = this.isAssetTypeAnImage(fileType, 'img')
      }
      if (abilityCode === 'docAnalysisOfficeWithBaidu' || abilityCode === 'idcardWithBaidu') {
        flugImg = this.isAssetTypeAnImage(fileType, 'doc')
      }
      let params = {}
      const image = await self.setValRequstUpload(file.raw)
      if (flugImg) {
        params = {
          abilityCode,
          ifTest: "true",
          [abilityCode]: {
            ...this.para[abilityCode],
            ...this.form,
            image,
          },
        }
        this.requstImg(params)
      } else {
        return this.$message.error('图片格式错误')
      }
    },
    // uploadBeforeVideo(file) {
    //   debugger
    //   this.fileList = [{
    //     name: file.name,
    //     url: '',
    //   }]
    // },
    uploadSuccessVideo(response) {
      if (response.success) {
        const data = response.data.asr_msg;
        const arr = [JSON.parse(data).alternatives[0].transcript];
        const params = {
          key: 'common',
          type: 'tageList',
          data: arr,
        }
        this.$emit('resultData', params)
      }
    },
    requstImg(params) {
      const abilityCode = this.para['abilityCode']
      this.btnLoading = true
      extractKeywordsFromTxt({ ...params }).then((res) => {
        const status = res.data;
        const data = res.data.data;
        let arr = []
        if (status.success) {
          if (abilityCode === 'accurateBasicOcrWithBaidu' || abilityCode === 'docAnalysisOfficeWithBaidu') {
            if (data.words_result.length > 0) {
              data.words_result.map(v => {
                arr.push(v.words)
              })
            }
            params = {
              key: 'common',
              type: 'tageList',
              data: arr,
            }
            this.$emit('resultData', params)
          }
          if (abilityCode === 'idcardWithBaidu') {
            arr = [
              data.words_result["失效日期"].words,
              data.words_result["签发日期"].words,
              data.words_result["签发机关"].words,
            ];
            params = {
              key: 'common',
              type: 'tageList',
              data: arr,
            }
            this.$emit('resultData', params)
          }
        }
        this.btnLoading = false
      }).catch(() => {
        this.btnLoading = false
      })
    },
    isAssetTypeAnImage(ext, key) {
      let arr = []
      if (key === 'img') {
        arr = ['png', 'jpg', 'jpeg', 'bmp', 'gif', 'webp', 'psd', 'svg', 'tiff']
      }
      if (key === 'doc') {
        arr = ['png', 'jpg', 'jpeg', 'bmp', 'gif', 'webp', 'psd', 'svg', 'tiff', 'pdf']
      }
      if (key === 'video') {
        arr = ['mp3', 'wav', 'flac', 'aac', 'ogg', 'aiff']
      }
      return arr.indexOf(ext.toLowerCase()) !== -1;
    },
    setValRequstUpload(file) {
      // const self = this;
      return new Promise((resolve) => {
        let fileReader = new FileReader();
        //读取本地文件图片并转换为Base64编码
        fileReader.readAsDataURL(file);
        // self.RequestBody.url = file.name;
        //读取完毕后自动调用
        fileReader.onload = function (e) {
          //获取文件内容结果
          resolve(e.target.result.split(",")[1]);
        };
      });
    },
    fileToBinary(file) {
      return new Promise((resolve, reject) => {
        const reader = new FileReader();

        reader.onload = function () {
          const arrayBuffer = reader.result;
          const binaryData = new Uint8Array(arrayBuffer);
          resolve(binaryData);
        };

        reader.onerror = function (error) {
          reject(error);
        };

        reader.readAsArrayBuffer(file);
      });
    }
  },
};
</script>

<style lang="scss" scoped>
.btn-list {
  text-align: center;
}

.setbox {
  padding: 20px 0;
  background-color: #f1f6ff;
  border-radius: 6px;
  // min-width: 450px;
  flex-direction: column;
  width: 100%;

  .set {
    margin-left: 20px;
  }

  /deep/ .el-collapse-item__wrap {
    background: #f1f6ff;
    border-bottom: 0px;
  }

  /deep/ .el-collapse {
    border-top: 0px;
    border-bottom: 0px;
  }

  /deep/ .el-upload {
    background: white;
  }

  /deep/ .el-row:first-child,
  .avue-view-class {
    margin: 20px 0;
  }
}

/deep/ .img-uploader {
  width: 108px;
  height: 108px;
  flex-shrink: 0;
  list-style-type: none;
  //overflow: hidden;
  cursor: pointer;
  display: inline-block;
  border: 1px dashed #d9d9d9;
  text-align: center;

  .el-icon-plus {
    line-height: 7;
    width: 100px;
  }
}

/deep/ .jsoneditor-outer {
  height: 500px;
}

/deep/ .textarea.jsoneditor-text,
.ace-jsoneditor {
  height: 500px;
}
</style>
