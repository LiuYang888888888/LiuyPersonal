<template>
  <div class="debuger">
    <div class="post">
      <span class="le">POST</span>
      <span class="ri">/aicos-ai/ai/run</span>
      <el-button
        class="btnSend"
        :disabled="disabled"
        type="primary"
        @click="send"
        size="small"
        >测试</el-button
      >
    </div>
    <div class="parms">
      <div class="tit">请求参数</div>
      <div class="txt">JSON(application/json)</div>
      <vue-json-editor
        v-model="RequestBody"
        :showBtns="false"
        :mode="'text'"
        lang="zh"
        @json-change="onJsonChange"
        @json-save="onJsonSave"
      />
    </div>
    <div v-if="flag" class="parms">
      <div class="tit">响应内容</div>
      <vue-json-editor
        v-model="Response"
        :showBtns="false"
        :mode="'text'"
        lang="zh"
        @json-change="onJsonChange"
        @json-save="onJsonSave"
      />
      <div class="audio" v-if="ttsWithHuilanFlag">
        <audio id="audio" controls="controls" autoplay :src="audioSrc" />
      </div>
    </div>
    <div class="audio" v-if="upload">
      <el-row>
        <el-col span="12">
          <el-upload
            ref="upload"
            class="upload-demo"
            drag
            :action="action"
            multiple="false"
            :accept="uploadDown.accept"
            :on-success="handleAvatarSuccess"
            :before-upload="beforeAvatarUpload"
            :data="requstUpload"
            :http-request="httpRequest"
            :limit="1"
          >
            <i class="el-icon-upload"></i>
            <div class="el-upload__text">
              将文件拖到此处，或<em>点击上传</em>
            </div>
            <div class="el-upload__tip" slot="tip">上传文件不超过500kb;{{uploadDown.title}}</div>
          </el-upload>
        </el-col>
      </el-row>
    </div>
    <div class="audio" v-if="uploadFile">
      <el-row>
        <el-col span="12">
          <el-upload
            ref="uploadFile"
            class="upload-demo"
            drag
            :action="action"
            :accept="uploadDown.actionAccept"
            multiple="false"
            :on-success="handleAvatarSuccess"
            :before-upload="beforeAvatarUpload"
            :data="requstUpload"
            :limit="1"
          >
            <i class="el-icon-upload"></i>
            <div class="el-upload__text">
              将文件拖到此处，或<em>点击上传</em>
            </div>
            <div class="el-upload__tip" slot="tip">上传文件不超过500kb;{{uploadDown.title}}</div>
          </el-upload>
        </el-col>
      </el-row>
    </div>
    <div class="analysis" v-if="analysis">
      <el-button size="small" type="primary" @click="analysisReslft"
        >录音文件识别</el-button
      >
    </div>
    <div class="parms" v-if="analysis">
      <div class="tit">识别请求参数</div>
      <div class="txt">JSON(application/json)</div>
      <vue-json-editor
        v-model="requestAnalysis"
        :showBtns="false"
        :mode="'text'"
        lang="zh"
        @json-change="onJsonChange"
        @json-save="onJsonSave"
      />
    </div>
    <div v-if="analysisFlug" class="analysisReslft">
      <div class="tit">录音文件识别结果</div>
      <vue-json-editor
        v-model="responseAnalysis"
        :showBtns="false"
        :mode="'text'"
        lang="zh"
        @json-change="onJsonChange"
        @json-save="onJsonSave"
      />
    </div>
  </div>
</template>

<script>
// import vueJsonEditor from "vue-json-editor";
import serviceList from "@/config/serviceList";
import aiInterfaceParama from "@/util/aiInterfaceParama";
const vueJsonEditor = ()=>import('vue-json-editor');
const { ai } = serviceList;
export default {
  name: "debugging",
  props: {
    debuggingDataJson: {
      type: Object,
    },
  },
  components: {
    vueJsonEditor,
  },
  data() {
    return {
      uploadDown: {
        actionAccept: null,
        accept: null,
        title:''
      },
      audioSrc: null,
      upload: false,
      uploadFile: false,
      requstUpload: {},
      action: null,
      disabled: false,
      Response: null,
      RequestBody: null,
      analysis: false,
      analysisFlug: false,
      responseAnalysis: null,
      requestAnalysis: null,
      debugDataJosn: {
        RequestUrl: function () {},
        RequestBody: {},
        Response: {},
      },
      flag: false,
      ttsWithHuilanFlag: false,
    };
  },
  computed: {},
  watch: {
    debuggingDataJson(newName) {
      this.debugDataJosn = { ...newName };
      this.RequestBody = newName.RequestBody;
      if (
        newName.RequestBody.abilityCode === "asrForUploadFileWithHuilan" ||
        newName.RequestBody.applicationCode === "asrForUploadFileWithHuilan"
      ) {
        this.uploadFile = true;
        this.upload = false;
        this.action = `api/${ai}/ai/asrForUploadFileWithHuilan`;
        this.requstUpload = newName.RequestBody;
        this.uploadDown.actionAccept = ".wav,.mp3";
        this.uploadDown.title = "请上传wav,mp3格式音频文件";
        this.disabled = true;
        this.$refs.upload.clearFiles();
      } else if (
        newName.RequestBody.abilityCode === "accurateBasicOcrWithBaidu" ||
        newName.RequestBody.abilityCode === "docAnalysisOfficeWithBaidu" ||
        newName.RequestBody.abilityCode === "idcardWithBaidu" ||
        newName.RequestBody.applicationCode === "accurateBasicOcrWithBaidu" ||
        newName.RequestBody.applicationCode === "docAnalysisOfficeWithBaidu" ||
        newName.RequestBody.applicationCode === "idcardWithBaidu"
      ) {
        this.uploadDown.accept = ".image,.jpeg,.png,.pdf,.jpg";
        this.uploadDown.title = "请上传image,jpeg,png,pdf,jpg格式图片或文件";
        this.upload = true;
        this.uploadFile = false;
        this.action = undefined;
        this.requstUpload = { ...newName.RequestBody };
        this.disabled = false;
        if(this.$refs.upload){
          this.$refs.upload.clearFiles();
        }
      } else {
        this.upload = false;
        this.uploadFile = false;
        this.disabled = false;
      }
      if (
        newName.RequestBody.abilityCode !== "recordingFileAsrWithAliyunLocal"
      ) {
        this.analysis = false;
        this.analysisFlug = false;
      }
      this.flag = false;
    },
  },
  mounted() {
    const scope = this;
    setTimeout(() => {
      scope.debugDataJosn = scope.debuggingDataJson;
    }, 500);
  },
  methods: {
    onJsonChange(value) {
      console.log("value:", value);
    },
    onJsonSave(value) {
      console.log("value:", value);
    },
    send(data) {
      const scope = this;
      let params = {};
      if (data.abilityCode) {
        params = data;
        delete params[params.abilityCode].url;
        this.RequestBody = {
          ...this.RequestBody,
          image: this.RequestBody.url,
        };
        delete this.RequestBody.url;
      } else {
        params = this.RequestBody;
      }
      this.debugDataJosn.RequestUrl(params).then((res) => {
        if (res.data.success) {
          // scope.$message.success("请求成功");
          if (
            scope.RequestBody.abilityCode === "ttsWithHuilan" ||
            scope.RequestBody.abilityCode ===
              "speechSynthesizerRestfulWithAliyun"
          ) {
            scope.ttsWithHuilanFlag = true;
            scope.audioSrc = "data:audio/wav;base64," + res.data.data.audio;
          }
          if (
            scope.RequestBody.abilityCode === "recordingFileAsrWithAliyunLocal"
          ) {
            this.analysis = true;
            this.requestAnalysis = this.returnSelft(
              "recordingFileAsrCallbackWithAliyunLocal"
            );
            this.requestAnalysis["recordingFileAsrCallbackWithAliyun"].taskId =
              res.data.data.taskId;
          } else {
            this.analysis = false;
          }
        } else {
          scope.$message.error(res.msg);
        }
        scope.Response = res.data;
        scope.flag = true;
      });
    },
    handleAvatarSuccess(res) {
      if (res.success) {
        // this.$message.success(res.msg);
        this.Response = res.data;
        this.flag = true;
      }
    },
    beforeAvatarUpload(file) {
      const abilityCode = this.RequestBody.abilityCode;
      if (abilityCode === "asrForUploadFileWithHuilan") {
        delete this.requstUpload.file;
        this.RequestBody = {
          ...this.RequestBody,
          name: file.name,
        };
      } else if (
        abilityCode === "accurateBasicOcrWithBaidu" ||
        abilityCode === "docAnalysisOfficeWithBaidu" ||
        abilityCode === "idcardWithBaidu"
      ) {
        const self = this;
        let fileReader = new FileReader();
        //读取本地文件图片并转换为Base64编码
        fileReader.readAsDataURL(file);
        // self.RequestBody.url = file.name;
        //读取完毕后自动调用
        fileReader.onload = function (e) {
          //获取文件内容结果
          self.requstUpload[abilityCode].image = e.target.result.split(",")[1];
          // this.RequestBody = {};
        };
      }
    },
    httpRequest() {
      const self = this;
      const params = this.requstUpload;
      delete params[params.abilityCode].url;
      setTimeout(() => {
        self.send(params);
      }, 500);
    },
    analysisReslft() {
      const self = this;
      const params = this.returnSelft(
        "recordingFileAsrCallbackWithAliyunLocal"
      );
      this.debugDataJosn.RequestUrl(params).then((res) => {
        if (res.data.success) {
          self.responseAnalysis = res.data;
          self.analysisFlug = true;
        } else {
          self.$message.error(res.msg);
        }
      });
    },
    returnSelft(key) {
      //返回请求参数
      let data = null;
      aiInterfaceParama.params.dataJson.map((v) => {
        if (Object.keys(v)[0] === key) {
          console.log(v[key].RequestBody);
          data = v[key].RequestBody;
        }
      });
      return data;
    },
  },
};
</script>

<style lang="scss" scoped>
.debuger {
  /deep/ .jsoneditor-poweredBy {
    display: none;
  }

  /deep/ .jsoneditor-outer {
    height: 250px;
  }
  margin-bottom: 50px;

  /deep/ div.jsoneditor {
    min-height: 250px;
  }

  .post {
    border-color: #49cc90;
    background: rgba(73, 204, 144, 0.1);
    margin-right: 20px;
    .le {
      display: inline-block;
      background: #49cc90;
      font-size: 14px;
      font-weight: 700;
      min-width: 80px;
      padding: 6px 15px;
      text-align: center;
      border-radius: 3px;
      // text-shadow: 0 1px 0 rgb(0 0 0 / 10%);
      font-family: Titillium Web, sans-serif;
      color: #fff;
    }

    .ri {
      display: inline-block;
      margin-left: 20px;
    }

    .btnSend {
      float: right;
    }
  }

  .parms {
    .tit {
      margin-top: 20px;
      margin-bottom: 5px;
      font-size: 16px;
      font-weight: 600;
      height: 30px;
      line-height: 30px;
      border-left: 4px solid #00ab6d;
      text-indent: 8px;
    }

    .txt {
      display: block;
      color: #444;
      font-size: 14px;
      overflow: hidden;
      white-space: nowrap;
      text-overflow: ellipsis;
      font-weight: 400;
      margin: 8px 0;
    }
  }
  .audio {
    margin-top: 20px;
  }
  .analysis {
    margin-top: 20px;
  }
  .analysisReslft {
    margin: 20px 0;
    .tit {
      margin-bottom: 10px;
    }
  }
}
/deep/ .el-upload-list__item-name [class^="el-icon"] {
  display: none;
}
</style>
