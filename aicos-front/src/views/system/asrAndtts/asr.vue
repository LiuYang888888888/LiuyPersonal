<template>
  <div style="padding: 5px 30px 0">
    <HuilanBasicToolbar style="margin-top: 0">
      <el-button
        v-if="permissionList.addBtn"
        type="primary"
        size="small"
        @click="handleAdd"
        >{{ $t("aicosCommon.addBtn") }}</el-button
      >
    </HuilanBasicToolbar>
    <HuilanBasicSearchbar
      :model="searchForm"
      :fields="searchFieldList"
      @reset="searchReset"
      @search="searchChange"
    >
      <!-- <template v-slot:appendTool>
        <el-button type="default" @click="configColumn"
          ><i class="el-icon-s-operation"></i
        ></el-button>
      </template> -->
    </HuilanBasicSearchbar>
    <avue-crud
      :option="option"
      :table-loading="loading"
      :data="data"
      :page.sync="page"
      :before-open="beforeOpen"
      v-model="form"
      ref="crud"
      @row-update="rowUpdate"
      @row-save="rowSave"
      @row-del="rowDel"
      @selection-change="selectionChange"
      @current-change="currentChange"
      @size-change="sizeChange"
      @refresh-change="refreshChange"
      @on-load="onLoad"
    >
      <!--      <template slot="status" slot-scope="{ row }">-->
      <!--        <el-switch-->
      <!--          :active-value="0"-->
      <!--          :inactive-value="1"-->
      <!--          v-model="row.status"-->
      <!--          @change="changeStatus(row)"-->
      <!--        ></el-switch>-->
      <!--      </template>-->
      <template slot="testForm">
        <el-input v-model="test" type="textarea"></el-input>
      </template>
      <template slot="recordingTestForm">
        <div style="text-align: center">
          <el-button
            type="text"
            class="iconfont iconicon_im_voice"
            style="font-size: 120px"
          ></el-button>
          <div style="color: #7d7d7d; font-size: 12px">
            <div>{{ $t("system.asrAndTts.soundRecordingTip") }}</div>
            <div>{{ $t("system.asrAndTts.browserAuthTip") }}</div>
          </div>
        </div>
      </template>
      <template slot="upLoadForm">
        <div style="text-align: center">
          <el-upload
            style="padding-bottom: 10px"
            ref="upload"
            drag
            :action="action"
            accept=".mp3,.wav"
            :limit="1"
            :on-remove="onRemove"
            :on-change="handleChange"
            :before-upload="beforeUpload"
            :on-success="successUpload"
          >
            <i class="el-icon-upload"></i>
            <div class="el-upload__text">
              <div>{{ $t("system.asrAndTts.uploadFileTip") }}</div>
              <div>{{ $t("system.asrAndTts.fileFormatTip") }}</div>
            </div>
          </el-upload>
          <el-button
            size="small"
            @click="recognitionBtn"
            type="primary"
            v-if="uploadUrl !== ''"
          >
            {{ discernText }}
          </el-button>
        </div>
      </template>
      <template v-slot:menu="scope">
        <HuilanBasicActionTool
          :actions="getRowActions(scope.row)"
          @command="handleCommand($event, scope.row, scope.index)"
        />
      </template>
    </avue-crud>
  </div>
</template>

<script>
import {
  getList,
  getDetail,
  add,
  update,
  remove,
  // arsStatus,
  testAsr,
  getCompany
} from "@/api/system/asrAndtts/asrconfigure";
import { baseURL, getDictItemListByDictCodeURL } from "@/api/common";
import serviceList from "@/config/serviceList";
// import { deepClone } from "@/util/util";
import { getRules } from "@/util/regx";
import { mapGetters } from "vuex";

export default {
  data() {
    return {
      action: `${baseURL}api/${serviceList.file}/miniofile/upload?fromSystemName=base`,
      test: "",
      form: { test: "" },
      // query: {},
      loading: true,
      page: {
        pageSize: 10,
        currentPage: 1,
        total: 0
      },
      selectionList: [],
      discernText: this.$t("system.asrAndTts.identify"),
      option: {
        header: false,
        // calcHeight: 30,
        tip: false,
        searchShow: true,
        searchMenuSpan: 6,
        searchSpan: 8,
        border: true,
        index: true,
        viewBtn: false,
        delBtn: false,
        editBtn: false,
        selection: false,
        labelWidth: 130,
        dialogClickModal: false,
        dialogWidth: "40%",
        dialogType: "drawer",
        dialogCustomClass: "huilan-drawer-form",
        labelPosition: "right",
        emptyText: this.$t("aicosCommon.notData"),
        column: [
          {
            label: this.$t("system.asrAndTts.name"),
            prop: "name",
            maxlength: 50,
            showWordLimit: true,
            span: 24,
            rules: [
              {
                required: true,
                message:
                  this.$t("aicosCommon.pleaseInput") +
                  this.$t("system.asrAndTts.name"),
                trigger: "blur"
              },
              ...getRules(["charNumHanUnderline"])
            ],
            type: "input"
          },
          {
            label: this.$t("system.asrAndTts.company"),
            prop: "company",
            type: "select",
            dicUrl: getDictItemListByDictCodeURL,
            dicMethod: "post",
            dicQuery: {
              code: "company"
            },
            props: {
              label: "name",
              value: "value"
            },
            span: 24,
            value: "ali",
            change: ({ value }) => {
              let sinonaoUser = this.findObject(
                  this.option.column,
                  "sinonaoUser"
                ),
                sinonaoToken = this.findObject(
                  this.option.column,
                  "sinonaoToken"
                ),
                // socketAddress = this.findObject(
                //   this.option.column,
                //   "socketAddress"
                // ),
                maxSecondsPerSentence = this.findObject(
                  this.option.column,
                  "maxSecondsPerSentence"
                ),
                sampleRate = this.findObject(this.option.column, "sampleRate");
              let accessKeyId = this.findObject(
                  this.option.column,
                  "accessKeyId"
                ),
                secret = this.findObject(this.option.column, "secret"),
                token = this.findObject(this.option.column, "token"),
                appkey = this.findObject(this.option.column, "appkey");
              let deployMethod = this.findObject(
                  this.option.column,
                  "deployMethod"
                ),
                expireDate = this.findObject(this.option.column, "expireDate"),
                interfaceAddress = this.findObject(
                  this.option.column,
                  "interfaceAddress"
                ),
                // callbackAddress = this.findObject(
                //   this.option.column,
                //   "callbackAddress"
                // ),
                // model = this.findObject(this.option.column, "model"),
                maxSentenceSilenceMs = this.findObject(
                  this.option.column,
                  "maxSentenceSilenceMs"
                ),
                userTimeoutMs = this.findObject(
                  this.option.column,
                  "userTimeoutMs"
                ),
                test = this.findObject(this.option.column, "test"),
                upLoad = this.findObject(this.option.column, "upLoad"),
                interrupt = this.findObject(this.option.column, "interrupt"),
                interruptPattern = this.findObject(
                  this.option.column,
                  "interruptPattern"
                );
              // 中科汇联
              if (value === "huilan") {
                sinonaoToken.display = true;
                sinonaoUser.display = true;
                // socketAddress.display = true;
                maxSecondsPerSentence.display = true;
                sampleRate.display = true;
                token.display = false;
                appkey.display = false;
                secret.display = false;
                accessKeyId.display = false;
              } else {
                maxSecondsPerSentence.display = false;
                sampleRate.display = false;
              }
              // 阿里+私有云
              if (value === "ali" && this.form.deployMethod === "private") {
                sinonaoToken.display = false;
                sinonaoUser.display = false;
                // socketAddress.display = false;
                token.display = true;
                appkey.display = true;
                secret.display = false;
                accessKeyId.display = false;
              }
              // 阿里+公有云
              if (value === "ali" && this.form.deployMethod === "public") {
                sinonaoToken.display = false;
                sinonaoUser.display = false;
                // socketAddress.display = false;
                token.display = false;
                appkey.display = true;
                secret.display = true;
                accessKeyId.display = true;
              }
              if (value === "mrcp") {
                sinonaoToken.display = false;
                sinonaoUser.display = false;
                // socketAddress.display = false;
                maxSecondsPerSentence.display = false;
                sampleRate.display = false;
                token.display = false;
                appkey.display = false;
                secret.display = false;
                accessKeyId.display = false;
                if (this.form.model === "sync") {
                  interrupt.display = true;
                  interruptPattern.display = true;
                } else {
                  interrupt.display = false;
                  interruptPattern.display = false;
                }

                //
                deployMethod.display = false;
                expireDate.display = false;
                interfaceAddress.display = false;
                // callbackAddress.display = false;
                maxSentenceSilenceMs.display = false;
                userTimeoutMs.display = false;
                test.display = false;
                upLoad.display = false;
              } else {
                deployMethod.display = true;
                expireDate.display = true;
                interfaceAddress.display = true;
                // callbackAddress.display = true;
                maxSentenceSilenceMs.display = true;
                // userTimeoutMs.display = true;
                test.display = true;
                upLoad.display = true;
              }
            },
            rules: [
              {
                required: true,
                message:
                  this.$t("aicosCommon.pleaseSelect") +
                  this.$t("system.asrAndTts.company"),
                trigger: "blur"
              }
            ]
          },
          {
            label: this.$t("system.asrAndTts.deploymentMethod"),
            prop: "deployMethod",
            type: "select",
            dicUrl: getDictItemListByDictCodeURL,
            dicMethod: "post",
            dicQuery: {
              code: "deployment_method"
            },
            display: true,
            props: {
              label: "name",
              value: "value"
            },
            // 1私有云  2公有云
            change: ({ value }) => {
              let sinonaoUser = this.findObject(
                  this.option.column,
                  "sinonaoUser"
                ),
                sinonaoToken = this.findObject(
                  this.option.column,
                  "sinonaoToken"
                );
              // socketAddress = this.findObject(
              //   this.option.column,
              //   "socketAddress"
              // );
              let accessKeyId = this.findObject(
                  this.option.column,
                  "accessKeyId"
                ),
                secret = this.findObject(this.option.column, "secret"),
                interfaceAddress = this.findObject(
                  this.option.column,
                  "interfaceAddress"
                ),
                token = this.findObject(this.option.column, "token"),
                appkey = this.findObject(this.option.column, "appkey");
              // 私有云/公有云+中科
              if (this.form.company === "huilan") {
                sinonaoToken.display = true;
                sinonaoUser.display = true;
                // socketAddress.display = true;
                token.display = false;
                appkey.display = false;
                secret.display = false;
                accessKeyId.display = false;
                interfaceAddress.rules = [
                  {
                    required: true,
                    message:
                      this.$t("aicosCommon.pleaseInput") +
                      this.$t("system.asrAndTts.interfaceAddress"),
                    trigger: "blur"
                  }
                ];
              }
              // 私有云+阿里
              if (value === "private" && this.form.company === "ali") {
                sinonaoToken.display = false;
                sinonaoUser.display = false;
                // socketAddress.display = false;
                token.display = true;
                appkey.display = true;
                secret.display = false;
                accessKeyId.display = false;
                interfaceAddress.rules = [
                  {
                    required: true,
                    message:
                      this.$t("aicosCommon.pleaseInput") +
                      this.$t("system.asrAndTts.interfaceAddress"),
                    trigger: "blur"
                  }
                ];
              }
              // 公有云+阿里
              if (value === "public" && this.form.company === "ali") {
                sinonaoToken.display = false;
                sinonaoUser.display = false;
                // socketAddress.display = false;
                token.display = false;
                appkey.display = true;
                secret.display = true;
                accessKeyId.display = true;
                interfaceAddress.rules = [];
              }
            },
            span: 24,
            value: "private",
            rules: [
              {
                required: true,
                message:
                  this.$t("aicosCommon.pleaseSelect") +
                  this.$t("system.asrAndTts.company"),
                trigger: "blur"
              }
            ]
          },
          // {
          //   label:'到期时间',
          //   prop:'expirationTimeType',
          //   type:'select',
          //   span:12,
          //   dicData:[
          //     {
          //       label:'永久有效',
          //       value:'0'
          //     },
          //     {
          //       label:'临时有效',
          //       value:'1'
          //     }
          //   ],
          //   change:({value})=>{
          //     const expirationTime = this.findObject(this.option.column,'expirationTime');
          //     if(value === '1'){
          //       expirationTime.display = true
          //     }else{
          //       expirationTime.display = false
          //     }
          //   },
          //   value:'0',
          //   rules:[
          //     {
          //       required:true,
          //       message:'请选择到期类型',
          //       trigger:'blur'
          //     }
          //   ]
          // },
          {
            label: this.$t("system.asrAndTts.expirationTime"),
            prop: "expireDate",
            hide: true,
            type: "date",
            span: 24,
            // labelWidth:0,
            display: true,
            format: "yyyy-MM-dd",
            valueFormat: "yyyy-MM-dd",
            rules: [
              {
                required: true,
                message:
                  this.$t("aicosCommon.pleaseSelect") +
                  this.$t("system.asrAndTts.expirationTime"),
                trigger: "blur"
              }
            ]
          },
          // {
          //   label: "引擎类型",
          //   prop: "engineType",
          //   hide: true,
          //   detail: true,
          //   value: "ali",
          // },
          {
            label: this.$t("system.asrAndTts.interfaceAddress"),
            prop: "interfaceAddress",
            hide: true,
            display: true,
            span: 24,
            rules: []
          },
          // {
          //   label: "回调地址",
          //   prop: "callbackAddress",
          //   hide: true,
          //   display: true,
          //   span: 24,
          //   // rules: [
          //   //   {
          //   //     required: true,
          //   //     message: "请输入回调地址",
          //   //     trigger: "blur",
          //   //   },
          //   // ],
          // },
          {
            label: this.$t("system.asrAndTts.accessKeyId"),
            prop: "accessKeyId",
            hide: true,
            display: false,
            span: 24,
            rules: [
              {
                required: true,
                message:
                  this.$t("aicosCommon.pleaseInput") +
                  this.$t("system.asrAndTts.accessKeyId"),
                trigger: "blur"
              }
            ]
          },
          {
            label: this.$t("system.asrAndTts.secret"),
            prop: "secret",
            hide: true,
            display: false,
            span: 24,
            rules: [
              {
                required: true,
                message:
                  this.$t("aicosCommon.pleaseInput") +
                  this.$t("system.asrAndTts.secret"),
                trigger: "blur"
              }
            ]
          },
          {
            label: this.$t("system.asrAndTts.token"),
            prop: "token",
            span: 24,
            hide: true,
            display: true
          },
          {
            label: this.$t("system.asrAndTts.appKey"),
            prop: "appkey",
            span: 24,
            hide: true,
            display: true,
            rules: [
              {
                required: true,
                message:
                  this.$t("aicosCommon.pleaseInput") +
                  this.$t("system.asrAndTts.appKey"),
                trigger: "blur"
              }
            ]
          },
          {
            label: this.$t("system.asrAndTts.sinonaoUser"),
            prop: "sinonaoUser",
            span: 24,
            hide: true,
            display: false
          },
          {
            label: this.$t("system.asrAndTts.sinonaoToken"),
            prop: "sinonaoToken",
            hide: true,
            span: 24,
            display: false
          },
          // {
          //   label: "socketAddress",
          //   prop: "socketAddress",
          //   hide: true,
          //   span: 24,
          //   display: false,
          // },
          {
            label: this.$t("system.asrAndTts.sentenceLength"),
            prop: "maxSecondsPerSentence",
            append: this.$t("system.asrAndTts.s"),
            span: 24,
            hide: true,
            display: false,
            value: 30,
            rules: [
              {
                required: true,
                message:
                  this.$t("aicosCommon.pleaseInput") +
                  this.$t("system.asrAndTts.sentenceLength"),
                trigger: "blur"
              },
              {
                pattern: /^((?!0)\d{1,2}|100)$/,
                message: this.$t("system.asrAndTts.oneWarningTip")
              }
            ]
          },
          {
            label: this.$t("system.asrAndTts.samplingRate"),
            prop: "sampleRate",
            // append: this.$t("system.asrAndTts.ms"),
            span: 24,
            hide: true,
            display: false,
            value: 16000,
            rules: [
              {
                required: true,
                message:
                  this.$t("aicosCommon.pleaseInput") +
                  this.$t("system.asrAndTts.samplingRate"),
                trigger: "blur"
              },
              {
                pattern: /^[0-9]*$/,
                message:
                  this.$t("aicosCommon.pleaseInput") +
                  this.$t("system.asrAndTts.number")
              }
            ]
          },
          // {
          //   label: "是否默认",
          //   prop: "status",
          //   type: "switch",
          //   span: 24,
          //   sort: true,
          //   dicData: [
          //     {
          //       label: "否",
          //       value: 1,
          //     },
          //     {
          //       label: "是",
          //       value: 0,
          //     },
          //   ],
          //   value: 0,
          //   rules: [
          //     {
          //       required: true,
          //       message: "请选择是否默认",
          //       trigger: "blur",
          //     },
          //   ],
          // },
          {
            label: this.$t("system.asrAndTts.mode"),
            prop: "model",
            type: "select",
            span: 24,
            hide: false,
            display: true,
            dicData: [
              {
                label: this.$t("system.asrAndTts.syncMode"),
                value: "sync"
              },
              {
                label: this.$t("system.asrAndTts.asyncMode"),
                value: "async"
              }
            ],
            value: "sync",
            change: ({ value }) => {
              let interrupt = this.findObject(this.option.column, "interrupt"),
                interruptPattern = this.findObject(
                  this.option.column,
                  "interruptPattern"
                ),
                // maxSentenceSilenceMs = this.findObject(
                //   this.option.column,
                //   "maxSentenceSilenceMs"
                // ),
                userTimeoutMs = this.findObject(
                  this.option.column,
                  "userTimeoutMs"
                );
              if (value === "sync") {
                interrupt.display = true;
                interruptPattern.display = true;
                // maxSentenceSilenceMs.display = true;
                if (this.form.company !== "mrcp") {
                  userTimeoutMs.display = true;
                }
              } else {
                interrupt.display = false;
                interruptPattern.display = false;
                // maxSentenceSilenceMs.display = false;
                userTimeoutMs.display = false;
              }
            }
          },
          {
            label: this.$t("system.asrAndTts.breakMode"),
            prop: "interrupt",
            dicData: [
              {
                label: this.$t("system.asrAndTts.notBreaking"),
                value: 0
              },
              {
                label: this.$t("system.asrAndTts.voiceBreaking"),
                value: 1
              },
              {
                label: this.$t("system.asrAndTts.resultBreaking"),
                value: 2
              },
              {
                label: this.$t("system.asrAndTts.finalResultBreaking"),
                value: 3
              }
            ],
            type: "select",
            span: 24,
            hide: true,
            display: true,
            value: 0,
            rules: [
              {
                required: true,
                message:
                  this.$t("aicosCommon.pleaseInput") +
                  this.$t("system.asrAndTts.breakMode"),
                trigger: "blur"
              }
            ]
          },
          {
            label: this.$t("system.asrAndTts.breakTemplate"),
            prop: "interruptPattern",
            value: `^(((${this.$t(
              "system.asrAndTts.breakTemplateValue"
            )}).{0,3})|(.{0,3}))$`,
            span: 24,
            hide: true,
            display: true,
            rules: [
              {
                required: true,
                message:
                  this.$t("aicosCommon.pleaseInput") +
                  this.$t("system.asrAndTts.breakTemplate"),
                trigger: "blur"
              }
            ]
          },
          {
            label: this.$t("system.asrAndTts.vadThreshold"),
            prop: "maxSentenceSilenceMs",
            min: 200,
            max: 2000,
            append: this.$t("system.asrAndTts.ms"),
            controls: false,
            value: 500,
            span: 24,
            hide: true,
            display: true,
            rules: [
              {
                required: true,
                message:
                  this.$t("aicosCommon.pleaseInput") +
                  this.$t("system.asrAndTts.vadThreshold"),
                trigger: "blur"
              },
              {
                pattern: /^[0-9]*$/,
                message:
                  this.$t("aicosCommon.pleaseInput") +
                  this.$t("system.asrAndTts.number")
              }
            ]
          },
          {
            label: this.$t("system.asrAndTts.timeout"),
            prop: "userTimeoutMs",
            append: this.$t("system.asrAndTts.ms"),
            span: 24,
            hide: true,
            display: true,
            value: 5000,
            rules: [
              {
                required: true,
                message:
                  this.$t("aicosCommon.pleaseInput") +
                  +this.$t("system.asrAndTts.timeout"),
                trigger: "blur"
              },
              {
                pattern: /^[0-9]*$/,
                message:
                  this.$t("aicosCommon.pleaseInput") +
                  this.$t("system.asrAndTts.number")
              }
            ]
          },
          {
            label: this.$t("system.asrAndTts.testResult"),
            prop: "test",
            type: "textarea",
            span: 24,
            hide: true,
            display: true
          },
          // {
          //   label: "测试方式",
          //   prop: "testType",
          //   span: 24,
          //   type: "radio",
          //   hide: true,
          //   dicData: [
          //     {
          //       label: "麦克风",
          //       value: "0",
          //     },
          //     {
          //       label: "音频上传",
          //       prop: "1",
          //     },
          //   ],
          //   change: ({ value }) => {
          //     const recordingTest = this.findObject(
          //         this.option.column,
          //         "recordingTest"
          //       ),
          //       upLoad = this.findObject(this.option.column, "upLoad");
          //     if (value === "0") {
          //       recordingTest.display = true;
          //       upLoad.display = false;
          //     } else {
          //       recordingTest.display = false;
          //       upLoad.display = true;
          //     }
          //   },
          //   value: "1",
          // },
          // {
          //   label: "",
          //   prop: "recordingTest",
          //   span: 24,
          //   labelWidth: 0,
          //   hide: true,
          //   display: false,
          // },
          {
            label: this.$t("system.asrAndTts.testFiles"),
            prop: "upLoad",
            span: 24,
            // labelWidth: 0,
            hide: true,
            display: true
          },
          {
            label: this.$t("system.asrAndTts.updateTime"),
            prop: "updateTime",
            display: false
            // formatter: (val, value) => {
            //   return dateFormat(value);
            // },
          }
        ]
      },
      data: [],
      uploadUrl: "",
      mrcpForm: {},
      searchForm: {
        name: "",
        company: "",
      },
      searchFieldList: [
        {
          prop: "name",
          placeholder: "请输入名称"
        },
        {
          prop: "company",
          placeholder: "请选择厂商",
          type: "select",
          dicData: []
        },
      ]
    };
  },
  computed: {
    ...mapGetters(["permission", "language"]),
    permissionList() {
      return {
        addBtn: this.vaildData(this.permission["asr-add"], false),
        viewBtn: this.vaildData(this.permission["asr-view"], false),
        delBtn: this.vaildData(this.permission["asr-remove"], false),
        editBtn: this.vaildData(this.permission["asr-edit"], false)
      };
    },
    ids() {
      let ids = [];
      this.selectionList.forEach(ele => {
        ids.push(ele.id);
      });
      return ids.join(",");
    }
  },
  mounted() {
    getCompany({ code: "company" }).then(res => {
      if (res.data.success) {
        this.searchFieldList[1].dicData = res.data.data;
        this.searchFieldList[1].dicData.map(item => {
          item.label = item.name;
        });
      }
    });
  },
  methods: {
    // 删除上传文件
    onRemove() {
      this.uploadUrl = "";
    },
    beforeUpload(file) {
      const types = file.name.split(".")[1];
      const fileType = ["mp3", "wav", "MP3", "WAV"].some(
        item => item === types
      );
      if (!fileType) {
        this.$message.error(this.$t("system.asrAndTts.formatErrorTip"));
        return false;
      }
    },

    // 上传音频文件成功
    successUpload(response) {
      if (response.success) {
        this.$message.success(this.$t("aicosCommon.successUploadTip"));
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
    // 识别上传音频文件
    recognitionBtn() {
      if (this.uploadUrl === "") {
        this.$message.warning(this.$t("system.asrAndTts.uploadWarningTip"));
        return false;
      }
      this.$refs.crud.validate(valid => {
        if (valid) {
          this.discernText = this.$t("system.asrAndTts.identifying");
          const obj = {
            offLineAddr: this.uploadUrl,
            name: this.form.name,
            type: "ASR",
            company: this.form.company,
            deployMethod: this.form.deployMethod,
            interfaceAddress: this.form.interfaceAddress,
            // callbackAddress: this.form.callbackAddress,
            timeOut: this.form.userTimeoutMs,
            inner: {}
          };
          // 中科汇联
          if (this.form.company === "huilan") {
            obj.inner = {
              sinonaoToken: this.form.sinonaoToken,
              sinonaoUser: this.form.sinonaoUser,
              // socketAddress: this.form.socketAddress,
              maxSecondsPerSentence: this.form.maxSecondsPerSentence,
              sampleRate: this.form.sampleRate
            };
          }
          // 阿里+私有云
          if (
            this.form.company === "ali" &&
            this.form.deployMethod === "private"
          ) {
            obj.inner = {
              token: this.form.token,
              appkey: this.form.appkey
              // appkey: this.form.appKey,
            };
          }
          // 阿里+公有云
          if (
            this.form.company === "ali" &&
            this.form.deployMethod === "public"
          ) {
            obj.inner = {
              accessKeyId: this.form.accessKeyId,
              appkey: this.form.appkey,
              // appkey: this.form.appKey,
              secret: this.form.secret
            };
          }
          this.test = "";
          this.$refs.crud.$refs.dialogForm.$refs.tableForm.allDisabled = false;
          testAsr(obj)
            .then(res => {
              if (res.data.success) {
                // console.log(res.data.data);
                // this.$refs.crud.$refs.dialogForm.$refs.tableForm.allDisabled = false;
                this.form.test = res.data.data;
                this.test = res.data.data;
                this.discernText = this.$t("system.asrAndTts.identify");
                // console.log(this.form);
              }
            })
            .catch(() => {
              this.discernText = this.$t("system.asrAndTts.identify");
              // this.$refs.crud.$refs.dialogForm.$refs.tableForm.allDisabled = false;
            });
        } else {
          console.log("error!");
        }
      });
    },
    // 更新开启状态
    // async changeStatus(row) {
    //   const copyRow = deepClone(row);
    //   await arsStatus(copyRow);
    //   this.$message.success("操作成功");
    //   this.onLoad(this.page);
    // },
    getRowActions() {
      const map = {
        viewBtn: {
          name: this.$t("aicosCommon.viewBtn"),
          command: "rowView"
        },
        delBtn: {
          name: this.$t("aicosCommon.delBtn"),
          command: "rowDel"
        },
        editBtn: {
          name: this.$t("aicosCommon.editBtn"),
          command: "rowEdit"
        }
      };
      const list = ["viewBtn", "editBtn", "delBtn"];
      const actions = [];

      list.forEach(item => {
        if (this.permissionList[item]) {
          actions.push(map[item]);
        }
      });
      return actions;
    },
    handleCommand(command, row, index) {
      const crud = this.$refs.crud;
      const cruddActions = ["rowView", "rowEdit", "rowDel"];
      if (cruddActions.includes(command)) {
        crud[command](row, index);
      } else {
        this[command](row, index);
      }
    },
    handleAdd() {
      this.$refs.crud.rowAdd();
    },
    rowSave(row, done, loading) {
      let obj = {};
      if (row.company === "mrcp") {
        obj.name = row.name;
        obj.company = row.company;
        obj.model = row.model;
        if (row.model === "sync") {
          obj.inner = {
            interrupt: row.interrupt ? null : row.interrupt,
            interruptPattern:
              row.interruptPattern == "" ? null : row.interruptPattern
          };
        }
      } else {
        row.inner = {
          token: row.token == "" ? null : row.token,
          appkey: row.appkey == "" ? null : row.appkey,
          sinonaoUser: row.sinonaoUser == "" ? null : row.sinonaoUser,
          sinonaoToken: row.sinonaoToken == "" ? null : row.sinonaoToken,
          // socketAddress: row.socketAddress == "" ? null : row.socketAddress,
          accessKeyId: row.accessKeyId == "" ? null : row.accessKeyId,
          secret: row.secret == "" ? null : row.secret,
          model: row.model == "" ? null : row.model,
          interruptPattern:
            row.interruptPattern == "" ? null : row.interruptPattern,
          maxSentenceSilenceMs:
            row.maxSentenceSilenceMs == "" ? null : row.maxSentenceSilenceMs,
          userTimeoutMs: row.userTimeoutMs === "" ? null : row.userTimeoutMs,
          maxSecondsPerSentence:
            row.maxSecondsPerSentence == "" ? null : row.maxSecondsPerSentence,
          sampleRate: row.sampleRate == "" ? null : row.sampleRate
        };
        if (row.model !== "async") {
          row.inner.interrupt = row.interrupt;
        }
        // row.callbackAddress =
        //   row.callbackAddress == "" ? null : row.callbackAddress;
        row.appkey = row.appkey == "" ? null : row.appkey;
        row.accessKeyId = row.accessKeyId == "" ? null : row.accessKeyId;
        row.secret = row.secret == "" ? null : row.secret;
        row.sinonaoToken = row.sinonaoToken == "" ? null : row.sinonaoToken;
        row.sinonaoUser = row.sinonaoUser == "" ? null : row.sinonaoUser;
        // row.socketAddress = row.socketAddress == "" ? null : row.socketAddress;
        row.test = row.test == "" ? null : row.test;
        row.token = row.token == "" ? null : row.token;
        row.upLoad = row.upLoad == "" ? null : row.upLoad;
        row.updateTime = row.updateTime == "" ? null : row.updateTime;
        row.userTimeoutMs = row.userTimeoutMs == "" ? null : row.userTimeoutMs;
        obj = row;
      }

      // console.log("roe", row);
      add(obj).then(
        () => {
          this.onLoad(this.page);
          this.$message({
            type: "success",
            message: this.$t("aicosCommon.successOperate")
          });
          done();
        },
        error => {
          loading();
          window.console.log(error);
        }
      );
    },
    rowUpdate(row, index, done, loading) {
      let obj = {};
      if (row.company !== "mrcp") {
        row = { ...row, ...this.form };
        row.inner = {
          token: row.token == "" ? null : row.token,
          appkey: row.appkey == "" ? null : row.appkey,
          sinonaoUser: row.sinonaoUser == "" ? null : row.sinonaoUser,
          sinonaoToken: row.sinonaoToken == "" ? null : row.sinonaoToken,
          // socketAddress: row.socketAddress == "" ? null : row.socketAddress,
          accessKeyId: row.accessKeyId == "" ? null : row.accessKeyId,
          secret: row.secret == "" ? null : row.secret,
          model: row.model == "" ? null : row.model,
          interruptPattern:
            row.interruptPattern == "" ? null : row.interruptPattern,
          maxSentenceSilenceMs:
            row.maxSentenceSilenceMs == "" ? null : row.maxSentenceSilenceMs,
          userTimeoutMs: row.userTimeoutMs === "" ? null : row.userTimeoutMs,
          maxSecondsPerSentence:
            row.maxSecondsPerSentence == "" ? null : row.maxSecondsPerSentence,
          sampleRate: row.sampleRate == "" ? null : row.sampleRate
        };
        if (row.model !== "async") {
          row.inner.interrupt = row.interrupt;
        }
        // row.callbackAddress =
        //   row.callbackAddress == "" ? null : row.callbackAddress;
        row.appkey = row.appkey == "" ? null : row.appkey;
        row.accessKeyId = row.accessKeyId == "" ? null : row.accessKeyId;
        row.secret = row.secret == "" ? null : row.secret;
        row.sinonaoToken = row.sinonaoToken == "" ? null : row.sinonaoToken;
        row.sinonaoUser = row.sinonaoUser == "" ? null : row.sinonaoUser;
        // row.socketAddress = row.socketAddress == "" ? null : row.socketAddress;
        row.test = row.test == "" ? null : row.test;
        row.token = row.token == "" ? null : row.token;
        row.upLoad = row.upLoad == "" ? null : row.upLoad;
        row.updateTime = row.updateTime == "" ? null : row.updateTime;
        row.userTimeoutMs = row.userTimeoutMs == "" ? null : row.userTimeoutMs;
        obj = row;
      } else {
        obj = { ...this.mrcpForm };
        obj.name = row.name;
        obj.model = row.model;
        if (row.model === "sync") {
          obj.inner = {
            interrupt: row.interrupt,
            interruptPattern:
              row.interruptPattern == "" ? null : row.interruptPattern
          };
        }
      }
      update(obj).then(
        () => {
          this.onLoad(this.page);
          this.$message({
            type: "success",
            message: this.$t("aicosCommon.successOperate")
          });
          done();
        },
        error => {
          loading();
          console.log(error);
        }
      );
    },
    rowDel(row) {
      this.$confirm(this.$t("system.asrAndTts.deleteAsrTip"), {
        confirmButtonText: this.$t("aicosCommon.confirmBtn"),
        cancelButtonText: this.$t("aicosCommon.cancelBtn"),
        type: "warning"
      })
        .then(() => {
          return remove(row.id);
        })
        .then(() => {
          this.onLoad(this.page);
          this.$message({
            type: "success",
            message: this.$t("aicosCommon.successOperate")
          });
        });
    },
    handleDelete() {
      if (this.selectionList.length === 0) {
        this.$message.warning(this.$t("aicosCommon.chooseDataTip"));
        return;
      }
      this.$confirm(this.$t("aicosCommon.mutiDeleteConfirmTip"), {
        confirmButtonText: this.$t("aicosCommon.confirmBtn"),
        cancelButtonText: this.$t("aicosCommon.cancelBtn"),
        type: "warning"
      })
        .then(() => {
          return remove(this.ids);
        })
        .then(() => {
          this.onLoad(this.page);
          this.$message({
            type: "success",
            message: this.$t("aicosCommon.successOperate")
          });
          this.$refs.crud.toggleSelection();
        });
    },
    beforeOpen(done, type) {
      if (type !== "view") {
        this.option.labelPosition = this.language == "en" ? "top" : "right";
      }
      this.test = "";
      this.discernText = this.$t("system.asrAndTts.identify");
      let test = this.findObject(this.option.column, "test"),
        upLoad = this.findObject(this.option.column, "upLoad");
      if (type === "view") {
        test.display = false;
        upLoad.display = false;
      } else {
        test.display = true;
        upLoad.display = true;
      }
      if (["edit", "view"].includes(type)) {
        this.uploadUrl = "";
        getDetail(this.form.id).then(res => {
          this.form = res.data.data;
          this.mrcpForm = res.data.data;
        });
      }
      done();
    },
    searchReset() {
      this.query = {};
      this.onLoad(this.page);
    },
    searchChange() {
      // this.query = params;
      this.query = { ...this.searchForm };
      this.page.currentPage = 1;
      // this.onLoad(this.page, params);
      this.onLoad(this.page, this.query);
      // done();
    },
    selectionChange(list) {
      this.selectionList = list;
    },
    selectionClear() {
      this.selectionList = [];
      this.$refs.crud.toggleSelection();
    },
    currentChange(currentPage) {
      this.page.currentPage = currentPage;
    },
    sizeChange(pageSize) {
      this.page.pageSize = pageSize;
    },
    refreshChange() {
      this.onLoad(this.page, this.query);
    },
    onLoad(page, query) {
      this.loading = true;
      // const params = { type: "ASR" };
      const params = { type: "ASR", ...query };
      // debugger
      getList(page.currentPage, page.pageSize, params).then(res => {
        const data = res.data.data;
        this.page.total = data.total;
        this.data = data.records;

        this.loading = false;
      });
    }
  }
};
</script>

<style></style>
