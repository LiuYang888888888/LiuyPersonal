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
      <template slot="timbreForm">
        <div class="timbreCrud">
          <el-button
            type="text"
            @click="settingDialog = true"
            v-if="type !== 'view'"
            >{{ $t("system.asrAndTts.setUp") }}</el-button
          >
          <avue-crud
            :option="timbreOption"
            :table-loading="timbreLoading"
            :data="timbreData"
            v-model="timbreFormCopy"
            ref="timbreCrud"
          >
            <template slot="isDefault" slot-scope="{ row }">
              <el-radio v-model="selectRow" :label="row.id">&nbsp;</el-radio>
            </template>
            <template slot="menu" slot-scope="{ index }">
              <el-button type="text" @click="removeTimbre(index)">{{
                $t("system.asrAndTts.remove")
              }}</el-button>
            </template>
          </avue-crud>
        </div>
      </template>
      <template slot="volumeForm">
        <div
          style="
            display: flex;
            align-items: center;
            justify-content: space-between;
          "
        >
          <div style="width: 30px; text-align: center">{{ volumeMin }}</div>
          <el-slider
            v-model="form.volume"
            :min="volumeMin"
            :max="volumeMax"
            :step="String(volumeMin).indexOf('.') > -1 ? 0.1 : 1"
            style="width: calc(100% - 100px)"
          ></el-slider>
          <div style="width: 30px; text-align: center">{{ volumeMax }}</div>
        </div>
      </template>
      <template slot="speedForm">
        <div
          style="
            display: flex;
            align-items: center;
            justify-content: space-between;
          "
        >
          <div style="width: 30px; text-align: center">{{ speedMin }}</div>
          <el-slider
            v-model="form.speed"
            :min="speedMin"
            :max="speedMax"
            :step="String(speedMin).indexOf('.') > -1 ? 0.1 : 1"
            style="width: calc(100% - 100px)"
          ></el-slider>
          <div style="width: 30px; text-align: center">{{ speedMax }}</div>
        </div>
      </template>
      <template slot="pitchForm">
        <div
          style="
            display: flex;
            align-items: center;
            justify-content: space-between;
          "
        >
          <div style="width: 30px; text-align: center">{{ pitchMin }}</div>
          <el-slider
            v-model="form.pitch"
            :min="pitchMin"
            :max="pitchMax"
            style="width: calc(100% - 100px)"
          ></el-slider>
          <div style="width: 30px; text-align: center">{{ pitchMax }}</div>
        </div>
      </template>
      <!-- <template slot="menu">
        <el-button type="text" class="el-icon-edit">修改到期时间</el-button>
      </template> -->
      <template slot="playAudioForm">
        <div style="text-align: center">
          <el-button type="text" @click="playClick">
            <img
              src="~@/assets/kwRobotTrain/hautParleur.png"
              alt=""
              width="120"
            />
          </el-button>
          <div style="color: #7d7d7d; font-size: 12px">
            {{ $t("system.asrAndTts.speakerTip") }}
          </div>
        </div>
      </template>
      <template v-slot:menu="scope">
        <HuilanBasicActionTool
          :actions="getRowActions(scope.row)"
          @command="handleCommand($event, scope.row, scope.index)"
        />
      </template>
    </avue-crud>
    <HuilanDialog
      :title="$t('system.asrAndTts.setTimbre')"
      append-to-body
      :visible.sync="settingDialog"
      width="55%"
    >
      <Timbresetting
        ref="timbresetting"
        :deployMethod="form.deployMethod"
        :company="form.company"
        v-if="settingDialog"
        :faqData="timbreData"
      />
      <template v-slot:footer>
        <el-button size="small" @click="settingDialog = false">{{
          $t("aicosCommon.cancelBtn")
        }}</el-button>
        <el-button size="small" type="primary" @click="saveCusomerFaq">{{
          $t("aicosCommon.saveBtn")
        }}</el-button>
      </template>
    </HuilanDialog>
    <HuilanDialog
      :title="$t('system.asrAndTts.audition')"
      append-to-body
      :visible.sync="playAudioDialog"
      width="980px !important"
      @close="closeWaveDialog"
      :close-on-click-modal="false"
    >
      <Wavefrom :item="voice" v-if="playAudioDialog" ref="wavedialog" />
    </HuilanDialog>
  </div>
</template>

<script>
import Timbresetting from "./timbresetting";
import Wavefrom from "./wavefrom";
import {
  getList,
  getDetail,
  add,
  update,
  remove,
  // arsStatus,
  testTts,
  getCompany
} from "@/api/system/asrAndtts/tts";
import { getDictItemListByDictCodeURL } from "@/api/common";
import { deepClone } from "@/util/util";
import { getRules } from "@/util/regx";
import { mapGetters } from "vuex";
export default {
  components: {
    Timbresetting,
    Wavefrom
  },
  data() {
    return {
      isClose: false,
      playAudioDialog: false,
      settingDialog: false,
      volumeMin: 0,
      volumeMax: 100,
      speedMin: -500,
      speedMax: 500,
      pitchMin: -500,
      pitchMax: 500,
      form: {
        volume: 50,
        speed: 0,
        pitch: 0,
        company: "ali",
        deployMethod: "public"
      },
      query: {},
      loading: true,
      page: {
        pageSize: 10,
        currentPage: 1,
        total: 0
      },
      selectionList: [],
      option: {
        // height: "auto",
        // calcHeight: 30,
        header: false,
        tip: false,
        searchShow: true,
        searchMenuSpan: 6,
        searchSpan: 8,
        border: true,
        index: true,
        viewBtn: false,
        delBtn: false,
        editBtn: false,
        selection: true,
        dialogClickModal: false,
        labelWidth: 120,
        dialogWidth: "40%",
        dialogType: "drawer",
        emptyText: this.$t("aicosCommon.notData"),
        dialogCustomClass: "huilan-drawer-form",
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
              const ID = this.findObject(this.option.column, "accessKeyId"),
                secret = this.findObject(this.option.column, "secret"),
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
                timbre = this.findObject(this.option.column, "timbre"),
                model = this.findObject(this.option.column, "model"),
                volume = this.findObject(this.option.column, "volume"),
                speed = this.findObject(this.option.column, "speed"),
                pitch = this.findObject(this.option.column, "pitch"),
                text = this.findObject(this.option.column, "text"),
                playAudio = this.findObject(this.option.column, "playAudio");

              let emo = this.findObject(this.option.column, "emo");
              let fmt = this.findObject(this.option.column, "fmt");
              let cache = this.findObject(this.option.column, "cache");

              this.timbreData = [];

              // 中科汇联
              if (value === "huilan") {
                ID.display = false;
                secret.display = false;
                appkey.display = false;

                emo.display = true;
                fmt.display = true;
                cache.display = true;

                this.volumeMin = 0.1;
                this.volumeMax = 5;
                this.speedMin = 0.5;
                this.speedMax = 3;
                this.pitchMin = -50;
                this.pitchMax = 50;
                this.form.volume = 1;
                this.form.speed = 1;
                this.form.engineType = "huilan";
              } else {
                emo.display = false;
                fmt.display = false;
                cache.display = false;
              }
              // 阿里
              if (value === "ali") {
                ID.display = true;
                secret.display = true;
                appkey.display = true;
                this.volumeMin = 0;
                this.volumeMax = 100;
                this.speedMin = -500;
                this.speedMax = 500;
                this.pitchMin = -500;
                this.pitchMax = 500;
                this.form.volume = 50;
                this.form.speed = 0;
                this.form.engineType = "ali";
              }
              if (value === "ali" && this.form.deployMethod === "public") {
                interfaceAddress.rules = [];
              } else {
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
              if (value === "mrcp") {
                ID.display = false;
                secret.display = false;
                appkey.display = false;
                //
                deployMethod.display = false;
                expireDate.display = false;
                interfaceAddress.display = false;
                timbre.display = false;
                model.display = false;
                volume.display = false;
                speed.display = false;
                pitch.display = false;
                text.display = false;
                playAudio.display = false;
              } else {
                deployMethod.display = true;
                expireDate.display = true;
                interfaceAddress.display = true;
                timbre.display = true;
                model.display = true;
                volume.display = true;
                speed.display = true;
                pitch.display = true;
                text.display = true;
                playAudio.display = true;
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
            value: "public",
            span: 24,
            change: ({ value }) => {
              let interfaceAddress = this.findObject(
                this.option.column,
                "interfaceAddress"
              );
              if (this.form.company === "ali" && value === "public") {
                interfaceAddress.rules = [];
              } else {
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
            },
            rules: [
              {
                required: true,
                message:
                  this.$t("aicosCommon.pleaseSelect") +
                  this.$t("system.asrAndTts.deploymentMethod"),
                trigger: "blur"
              }
            ]
          },
          // {
          //   label: "到期时间",
          //   prop: "expirationTimeType",
          //   type:'select',
          //   span:12,
          //   dicData:[
          //     {
          //       label:'永久有效',
          //       value:'0'
          //     },
          //     {
          //       label:'临时有效',
          //       valeu:'1',
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
          //   value:'0'
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
          {
            label: this.$t("system.asrAndTts.accessKeyId"),
            prop: "accessKeyId",
            hide: true,
            span: 24,
            display: true
          },
          {
            label: this.$t("system.asrAndTts.secret"),
            prop: "secret",
            span: 24,
            hide: true,
            display: true
          },
          {
            label: this.$t("system.asrAndTts.appKey"),
            prop: "appkey",
            span: 24,
            hide: true,
            display: true
          },
          // {
          //   label: "超时",
          //   prop: "timeOut",
          //   append: "毫秒",
          //   span: 24,
          //   hide: true,
          //   rules: [{ pattern: /^[0-9]*$/, message: "请输入数字" }],
          // },
          {
            label: this.$t("system.asrAndTts.timbre"),
            prop: "timbre",
            span: 24,
            hide: true,
            display: true
          },
          {
            label: this.$t("system.asrAndTts.playbackMode"),
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
            value: "sync"
          },
          {
            label: this.$t("system.asrAndTts.emo"),
            prop: "emo",
            span: 24,
            type: "select",
            value: "neutral",
            hide: true,
            display: true,
            dicUrl: getDictItemListByDictCodeURL,
            dicMethod: "post",
            dicQuery: {
              code: "emotion"
            },
            props: {
              label: "name",
              value: "value"
            }
          },
          {
            label: this.$t("system.asrAndTts.fmt"),
            prop: "fmt",
            span: 24,
            type: "select",
            value: "mp3",
            hide: true,
            display: true,
            dicUrl: getDictItemListByDictCodeURL,
            dicMethod: "post",
            dicQuery: {
              code: "fmt"
            },
            props: {
              label: "name",
              value: "value"
            }
          },
          {
            label: this.$t("system.asrAndTts.cache"),
            prop: "cache",
            span: 24,
            type: "select",
            value: 1,
            hide: true,
            display: true,

            dicData: [
              {
                label: this.$t("system.asrAndTts.useCache"),
                value: 1
              },
              {
                label: this.$t("system.asrAndTts.notCache"),
                value: 0
              }
            ]
          },
          {
            label: this.$t("system.asrAndTts.emo"),
            prop: "emo",
            span: 24,
            type: "select",
            value: "neutral",
            hide: true,
            display: false,
            dicUrl: getDictItemListByDictCodeURL,
            dicMethod: "post",
            dicQuery: {
              code: "emotion"
            },
            props: {
              label: "name",
              value: "value"
            }
          },
          {
            label: this.$t("system.asrAndTts.fmt"),
            prop: "fmt",
            span: 24,
            type: "select",
            value: "mp3",
            hide: true,
            display: false,
            dicUrl: getDictItemListByDictCodeURL,
            dicMethod: "post",
            dicQuery: {
              code: "fmt"
            },
            props: {
              label: "name",
              value: "value"
            }
          },
          {
            label: this.$t("system.asrAndTts.cache"),
            prop: "cache",
            span: 24,
            type: "select",
            value: 1,
            hide: true,
            display: false,

            dicData: [
              {
                label: this.$t("system.asrAndTts.useCache"),
                value: 1
              },
              {
                label: this.$t("system.asrAndTts.notCache"),
                value: 0
              }
            ]
          },
          {
            label: this.$t("system.asrAndTts.volume"),
            prop: "volume",
            span: 24,
            type: "slider",
            value: 50,
            hide: true,
            display: true
          },
          {
            label: this.$t("system.asrAndTts.speechSpeed"),
            prop: "speed",
            span: 24,
            type: "slider",
            value: 50,
            hide: true,
            display: true
          },
          {
            label: this.$t("system.asrAndTts.intonation"),
            prop: "pitch",
            span: 24,
            type: "slider",
            value: 50,
            hide: true,
            display: true
          },
          {
            label: this.$t("system.asrAndTts.test"),
            prop: "text",
            span: 24,
            type: "textarea",
            maxlength: 300,
            showWordLimit: true,
            clearable: true,
            hide: true,
            display: true
          },
          {
            label: "",
            labelWidth: 0,
            prop: "playAudio",
            hide: true,
            span: 24,
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
      selectRow: "",
      timbreOption: {
        // height: "auto",
        calcHeight: 30,
        tip: false,
        align: "center",
        searchShow: false,
        searchMenuSpan: 6,
        menu: true,
        border: true,
        index: false,
        viewBtn: false,
        selection: false,
        editBtn: false,
        addBtn: false,
        delBtn: false,
        columnBtn: false,
        refreshBtn: false,
        menuWidth: 100,
        dialogClickModal: false,
        dialogWidth: 750,
        emptyText: this.$t("aicosCommon.notData"),
        column: [
          {
            label: this.$t("system.asrAndTts.timbreName"),
            prop: "name"
          },
          {
            label: this.$t("system.asrAndTts.sex"),
            prop: "sex"
          },
          {
            label: this.$t("system.asrAndTts.scene"),
            prop: "scene"
          },
          {
            label: this.$t("system.asrAndTts.languages"),
            prop: "lang"
          },
          {
            label: this.$t("system.asrAndTts.defaultOrNot"),
            prop: "isDefault"
          }
        ]
      },
      timbreData: [],
      voice: "",
      mrcpForm: {},
      type: "",
      searchForm: {
        name: "",
        company: ""
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
        }
      ]
    };
  },
  computed: {
    ...mapGetters(["permission"]),
    permissionList() {
      return {
        addBtn: this.vaildData(this.permission["tts-add"], false),
        viewBtn: this.vaildData(this.permission["tts-view"], false),
        delBtn: this.vaildData(this.permission["tts-remove"], false),
        editBtn: this.vaildData(this.permission["tts-edit"], false)
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
    saveCusomerFaq() {
      this.timbreData = this.$refs.timbresetting.curSelectedPerspects;
      this.settingDialog = false;
      this.selectRow = this.timbreData[0].id;
    },
    removeTimbre(index) {
      this.timbreData.splice(index, 1);
    },
    // 点击扬声器
    playClick() {
      if (this.form.text === "") {
        this.$message.warning(
          this.$t("aicosCommon.pleaseInput") +
            this.$t("system.asrAndTts.testContentTip")
        );
        return false;
      }
      this.$refs.crud.validate(valid => {
        if (valid) {
          let obj = {
            name: this.form.name,
            company: this.form.company,
            deployMethod: this.form.deployMethod,
            interfaceAddress: this.form.interfaceAddress,
            speed: this.form.speed,
            pitch: this.form.pitch,
            volume: this.form.volume,
            text: this.form.text,
            timbre: [],
            inner: {
              speed: this.form.speed,
              volume: this.form.volume,
              pitch: this.form.pitch,
              emo: this.form.emo,
              fmt: this.form.fmt,
              cache: this.form.cache
            },
            engineType: this.form.engineType,
            model: this.form.model
          };
          // 厂商阿里
          if (this.form.company === "ali") {
            obj.inner.appkey = this.form.appkey;
            obj.inner.secret = this.form.secret;
            obj.inner.accessKeyId = this.form.accessKeyId;
          }
          if (this.timbreData.length === 0) {
            this.$message.warning(
              this.$t("aicosCommon.pleaseSelect") +
                this.$t("system.asrAndTts.timbre")
            );
            return false;
          } else {
            this.timbreData.map(item => {
              if (item.id === this.selectRow) {
                item.isDefault = this.selectRow;
              } else {
                item.isDefault = "";
              }
            });
          }
          obj.timbre = this.timbreData;
          testTts(obj)
            .then(res => {
              this.voice = res.data.data;
              this.$refs.crud.$refs.dialogForm.$refs.tableForm.allDisabled = false;
              this.playAudioDialog = true;
            })
            .catch(() => {
              this.$refs.crud.$refs.dialogForm.$refs.tableForm.allDisabled = false;
            });
        }
      });
    },
    // // 更新开启状态
    // async changeStatus(row) {
    //   const copyRow = deepClone(row);
    //   const data = await arsStatus(copyRow);
    //   if (data.success) {
    //     this.$message.success("操作成功");
    //     this.onLoad(this.page);
    //   }
    // },
    closeWaveDialog() {
      this.$refs.wavedialog.pause();
    },
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
    // 新增按钮调用crud保存方法
    handleAdd() {
      this.$refs.crud.rowAdd();
    },
    rowSave(row, done, loading) {
      let obj = {};
      if (row.company !== "mrcp") {
        row.inner = {
          speed: row.speed,
          volume: row.volume,
          pitch: row.pitch,
          emo: row.emo,
          fmt: row.fmt,
          cache: row.cache
        };
        if (row.company === "ali") {
          row.inner.appkey = row.appkey == "" ? null : row.appkey;
          row.inner.secret = row.secret == "" ? null : row.secret;
          row.inner.accessKeyId =
            row.accessKeyId == "" ? null : row.accessKeyId;
        }
        if (this.timbreData.length === 0) {
          this.$message.warning(
            this.$t("aicosCommon.pleaseSelect") +
              this.$t("system.asrAndTts.timbre")
          );
          loading();
          return false;
        } else {
          this.timbreData.map(item => {
            if (item.id === this.selectRow) {
              item.isDefault = this.selectRow;
            } else {
              item.isDefault = "";
            }
          });
        }
        row.timbre = deepClone(this.timbreData);
        row.appkey = row.appkey == "" ? null : row.appkey;
        row.accessKeyId = row.accessKeyId == "" ? null : row.accessKeyId;
        row.playAudio = row.playAudio == "" ? null : row.playAudio;
        row.secret = row.secret == "" ? null : row.secret;
        row.text = row.text == "" ? null : row.text;
        obj = row;
      } else {
        obj.name = row.name;
        obj.company = row.company;
      }

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
        row.inner = {
          speed: row.speed,
          volume: row.volume,
          pitch: row.pitch,
          model: row.model == "" ? null : row.model,
          emo: row.emo,
          fmt: row.fmt,
          cache: row.cache
        };
        if (row.company === "ali") {
          row.inner.appkey = row.appkey == "" ? null : row.appkey;
          row.inner.secret = row.secret == "" ? null : row.secret;
          row.inner.accessKeyId =
            row.accessKeyId == "" ? null : row.accessKeyId;
        }
        if (this.timbreData.length === 0) {
          this.$message.warning(
            this.$t("aicosCommon.pleaseSelect") +
              this.$t("system.asrAndTts.timbre")
          );
          loading();
          return false;
        } else {
          this.timbreData.map(item => {
            if (item.id === this.selectRow) {
              item.isDefault = this.selectRow;
            } else {
              item.isDefault = "";
            }
          });
        }
        row.timbre = deepClone(this.timbreData);
        row.timbre = deepClone(this.timbreData);
        row.appkey = row.appkey == "" ? null : row.appkey;
        row.accessKeyId = row.accessKeyId == "" ? null : row.accessKeyId;
        row.playAudio = row.playAudio == "" ? null : row.playAudio;
        row.secret = row.secret == "" ? null : row.secret;
        row.text = row.text == "" ? null : row.text;
        obj = row;
      } else {
        obj = { ...this.mrcpForm };
        obj.name = row.name;
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
      this.$confirm(this.$t("system.asrAndTts.deleteTtsTip"), {
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
      this.type = type;
      let text = this.findObject(this.option.column, "text"),
        playAudio = this.findObject(this.option.column, "playAudio");
      if (type === "view") {
        this.timbreOption.menu = false;
        text.display = false;
        playAudio.display = false;
      } else {
        text.display = true;
        playAudio.display = true;
      }
      if (["edit", "view"].includes(type)) {
        getDetail(this.form.id).then(res => {
          this.timbreData = res.data.data.timbreList;
          this.form = res.data.data;
          this.mrcpForm = res.data.data;
          if (this.timbreData)
            this.timbreData.map(item => {
              if (item.isDefault !== "") {
                this.selectRow = item.isDefault;
              }
            });
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
    currentChange(currentPage) {
      this.page.currentPage = currentPage;
    },
    sizeChange(pageSize) {
      this.page.pageSize = pageSize;
    },
    refreshChange() {
      this.onLoad(this.page, this.query);
    },
    onLoad(page, params = {}) {
      this.loading = true;
      params.type = "TTS";
      getList(
        page.currentPage,
        page.pageSize,
        Object.assign(params, this.query)
      ).then(res => {
        const data = res.data.data;
        this.page.total = data.total;

        this.data = data.records;
        this.loading = false;
      });
    }
  }
};
</script>
<style lang="scss" scoped>
.timbreCrud {
  /deep/ {
    .avue-crud__menu {
      display: none;
    }
  }

  /deep/.el-radio__inner {
    display: inline-block;
  }
}
</style>
