<template>
  <div class="asrDialog">
    <avue-form v-model="form" :option="option">
      <template slot="upLoad">
        <div style="text-align: center">
          <el-upload style="padding-bottom: 10px" ref="upload" drag :action="action" accept=".mp3,.wav,.MP3,.WAV"
            limit="1" :on-remove="onRemove" :on-success="successUpload">
            <i class="el-icon-upload"></i>
            <div class="el-upload__text">
              <div>{{ $t('kwRobotManage.clickUploadTips') }}</div>
              <div>{{ $t('kwRobotManage.fileFormatTips') }}</div>
            </div>
          </el-upload>
          <el-button size="small" @click="recognitionBtn" type="primary" v-if="uploadUrl !== ''">
            {{ $t('kwRobotManage.identify') }}
          </el-button>
        </div>
      </template>
    </avue-form>
  </div>
</template>
<script>
import { getDetail, testAsr } from "@/api/system/asrAndtts/asrconfigure";
import { baseURL } from "@/api/common";
import serviceList from "@/config/serviceList";
import { mapGetters } from "vuex"
export default {
  props: {
    asrContent: {
      type: Object,
      default: () => ({}),
    },
    selectId: {
      type: String,
      default: "",
    },
    company: {
      type: String,
      default: "",
    }
  },
  data () {
    return {
      uploadUrl: "",
      action: `${baseURL}api/${serviceList.file}/miniofile/upload?fromSystemName=base`,
      form: {},
      option: {
        submitBtn: false,
        emptyBtn: false,
        labelWidth: 120,
        column: [
          {
            label: this.$t('kwRobotManage.maxSentenceLength'),
            prop: "maxSecondsPerSentence",
            append: this.$t('kwRobotManage.second'),
            span: 24,
            value: 30,
            display: this.company === 'huilan',
            rules: [
              {
                required: true,
                message: this.$t('aicosCommon.pleaseInput') + this.$t('kwRobotManage.maxSentenceLength'),
                trigger: "blur",
              },
              { pattern: /^[0-9]*$/, message: this.$t('kwRobotManage.numberTips') },
            ],
          },
          {
            label: this.$t('kwRobotManage.samplingRate'),
            prop: "sampleRate",
            span: 24,
            value: 16000,
            display: this.company === 'huilan',
            rules: [
              {
                required: true,
                message: this.$t('aicosCommon.pleaseInput') + this.$t('kwRobotManage.samplingRate'),
                trigger: "blur",
              },
              { pattern: /^[0-9]*$/, message: this.$t('kwRobotManage.numberTips') },
            ],
          },
          {
            label: this.$t('kwRobotManage.mode'),
            prop: "model",
            type: 'select',
            clearable: false,
            span: 24,
            display: false,
            dicData: [
              {
                label: this.$t('kwRobotManage.syncMode'),
                value: "sync",
              },
              {
                label: this.$t('kwRobotManage.asyncMode'),
                value: "async",
              },
            ],
            value: 'sync',
            rules: [
              {
                required: true,
                message: this.$t('aicosCommon.pleaseInput') + this.$t('kwRobotManage.mode'),
                trigger: "blur",
              }
            ],
            change: ({ value }) => {
              let interrupt = this.findObject(this.option.column, "interrupt"),
                interruptPattern = this.findObject(this.option.column, "interruptPattern"),
                userTimeoutMs = this.findObject(this.option.column, "userTimeoutMs");
              if (value === "sync") {
                interrupt.display = true;
                interruptPattern.display = true;
                userTimeoutMs.display = true;
              } else {
                interrupt.display = false;
                interruptPattern.display = false;
                userTimeoutMs.display = false;
              }
            }
          },
          {
            label: this.$t('kwRobotManage.breakMode'),
            prop: "interrupt",
            type: 'select',
            span: 24,
            display: true,
            dicData: [
              {
                label: this.$t('kwRobotManage.notBreaking'),
                value: 0,
              },
              {
                label: this.$t('kwRobotManage.interruptWithVoice'),
                value: 1,
              },
              {
                label: this.$t('kwRobotManage.resultInterruption'),
                value: 2,
              },
              {
                label: this.$t('kwRobotManage.finalResultInterrupt'),
                value: 3,
              },
            ],
            value: 0,
            rules: [
              {
                required: true,
                message: this.$t('aicosCommon.pleaseSelect') + this.$t('kwRobotManage.breakMode'),
                trigger: "blur",
              }
            ],
          },
          {
            label: this.$t('kwRobotManage.breakTemplate'),
            prop: "interruptPattern",
            span: 24,
            display: true,
            value: "^(((你好|嗯啊|嗯|对|啊|哦|诶|诶诶|哎|爱|好).{0,3})|(.{0,3}))$",
            rules: [
              {
                required: true,
                message: this.$t('aicosCommon.pleaseInput') + this.$t('kwRobotManage.breakTemplate'),
                trigger: "blur",
              }
            ],
          },
          {
            label: this.$t('kwRobotManage.interruptThreshold'),
            prop: "maxSentenceSilenceMs",
            min: 200,
            max: 2000,
            append: this.$t('kwRobotManage.millisecond'),
            span: 24,
            value: 500,
            rules: [
              {
                required: true,
                message: this.$t('aicosCommon.pleaseInput') + this.$t('kwRobotManage.interruptThreshold'),
                trigger: "blur",
              },
              { pattern: /^[0-9]*$/, message: this.$t('kwRobotManage.') },
            ],
          },
          {
            label: this.$t('kwRobotManage.timeout'),
            prop: "userTimeoutMs",
            append: this.$t('kwRobotManage.millisecond'),
            span: 24,
            display: true,
            value: 5000,
            rules: [
              {
                required: true,
                message: this.$t('kwRobotManage.timeoutTime'),
                trigger: "blur",
              },
              { pattern: /^[0-9]*$/, message: this.$t('kwRobotManage.') },
            ],
          },
          {
            label: this.$t('kwRobotManage.testResult'),
            prop: "test",
            type: "textarea",
            span: 24,
          },
          {
            label: this.$t('kwRobotManage.testFiles'),
            prop: "upLoad",
            type: "upload",
            span: 24,
          },
        ],
      },
      curCompany: this.company
    };
  },
  computed: {
    ...mapGetters(['language']),
  },
  watch: {
    language: {
      handler (newVal) {
        // && this.faqType != "view"

        this.option.labelPosition = newVal != 'zh' ? 'top' : 'right'
      },
      immediate: true,
    },
    curCompany (newVal) {
      const isHuilan = newVal === 'huilan';
      const maxSecondsPerSentence = this.findObject(this.option.column, 'maxSecondsPerSentence');
      const sampleRate = this.findObject(this.option.column, 'sampleRate');

      maxSecondsPerSentence.display = isHuilan;
      sampleRate.display = isHuilan;
    }
  },

  mounted () {
    if (this.asrContent !== '') {
      this.form = JSON.parse(this.asrContent);
    } else {
      getDetail(this.selectId).then((res) => {
        if (res.data.success) {
          const resData = res.data.data;
          this.form = resData;
          this.curCompany = resData.company;
        }
      });
    }
    this.form.test = "";
  },

  methods: {
    // 删除
    onRemove () {
      this.uploadUrl = "";
    },
    // 上传音频文件成功
    successUpload (response) {
      if (response.success) {
        this.uploadUrl = response.data.newFileName;
      } else {
        this.$refs.upload.uploadFiles.splice(
          this.$refs.upload.uploadFiles.indexOf(response),
          1
        );
        this.$message.warning(response.msg);
        this.uploadUrl = "";
      }
    },
    // 点击扬声器
    recognitionBtn () {
      if (this.uploadUrl === "") {
        this.$message.warning(this.$t('kwRobotManage.uploadFileTips'));
        return false;
      }
      const obj = {
        offLineAddr: this.uploadUrl,
        name: this.form.name,
        type: "ASR",
        company: this.form.company,
        deployMethod: this.form.deployMethod,
        interfaceAddress: this.form.interfaceAddress,
        callbackAddress: this.form.callbackAddress,
        timeOut: this.form.userTimeoutMs,
        inner: {},
      };
      // 中科汇联
      if (this.form.company === "huilan") {
        obj.inner = {
          sinonaoToken: this.form.sinonaoToken,
          sinonaoUser: this.form.sinonaoUser,
          socketAddress: this.form.socketAddress,
        };
      }
      // 阿里+私有云
      if (this.form.company === "ali" && this.form.deployMethod === "private") {
        obj.inner = {
          token: this.form.token,
          appkey: this.form.appKey,
        };
      }
      // 阿里+公有云
      if (this.form.company === "ali" && this.form.deployMethod === "public") {
        obj.inner = {
          accessKeyId: this.form.accessKeyId,
          appkey: this.form.appKey,
          accessKeySecret: this.form.accessKeySecret,
        };
      }
      this.form.test = "";
      testAsr(obj)
        .then((res) => {
          if (res.data.success) {
            this.form.test = res.data.data;
          }
        })
        .catch(() => { });
    },
  },
};
</script>
<style lang="scss" scoped>
.asrDialog {
  /deep/.el-upload-list__item {
    width: 100%;
    display: block;
  }
}
</style>
