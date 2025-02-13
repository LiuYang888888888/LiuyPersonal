<template>
  <div>
    <avue-form v-model="form" :option="option">
      <template slot="timbre">
        <div class="timbreCrud">
          <avue-crud :option="timbreOption" :table-loading="timbreLoading" :data="timbreData" v-model="timbreFormCopy"
            ref="timbreCrud">
            <template slot="isDefault" slot-scope="{ row }">
              <el-radio v-model="selectRow" :label="row.id">&nbsp;</el-radio>
            </template>
          </avue-crud>
        </div>
      </template>
      <template slot="volume">
        <div style="
            display: flex;
            align-items: center;
            justify-content: space-between;
          ">
          <div style="width: 30px; text-align: center">{{ volumeMin }}</div>
          <el-slider v-model="form.volume" :min="volumeMin" :max="volumeMax"
            :step="String(volumeMin).indexOf('.') > -1 ? 0.1 : 1" style="width: calc(100% - 100px)"></el-slider>
          <div style="width: 30px; text-align: center">{{ volumeMax }}</div>
        </div>
      </template>
      <template slot="speed">
        <div style="
            display: flex;
            align-items: center;
            justify-content: space-between;
          ">
          <div style="width: 30px; text-align: center">{{ speedMin }}</div>
          <el-slider v-model="form.speed" :min="speedMin" :max="speedMax"
            :step="String(speedMin).indexOf('.') > -1 ? 0.1 : 1" style="width: calc(100% - 100px)"></el-slider>
          <div style="width: 30px; text-align: center">{{ speedMax }}</div>
        </div>
      </template>
      <template slot="pitch">
        <div style="
            display: flex;
            align-items: center;
            justify-content: space-between;
          ">
          <div style="width: 30px; text-align: center">{{ intonationMin }}</div>
          <el-slider v-model="form.pitch" :min="intonationMin" :max="intonationMax"
            style="width: calc(100% - 100px)"></el-slider>
          <div style="width: 30px; text-align: center">{{ intonationMax }}</div>
        </div>
      </template>
      <template slot="playAudio">
        <div style="text-align: center">
          <el-button type="text" @click="playClick">
            <img src="~@/assets/kwRobotTrain/hautParleur.png" alt="" width="120" />
          </el-button>
          <div style="color: #7d7d7d; font-size: 12px">

            {{ $t('kwRobotManage.clickSpeakerTips') }}
          </div>
        </div>
      </template>
    </avue-form>
    <HuilanDialog :title="$t('kwRobotManage.audition')" append-to-body :visible.sync="playAudioDialog"
      width="980px !important" @close="closeWaveDialog" :close-on-click-modal="false">
      <Wavefrom :item="voice" v-if="playAudioDialog" ref="wavedialog" />
    </HuilanDialog>
  </div>
</template>
<script>
import { mapGetters } from "vuex"
import { getDetail, testTts } from "@/api/system/asrAndtts/tts";
import Wavefrom from "@/views/system/asrAndtts/wavefrom";
import { getTextWidth } from "@/util/util"
export default {
  props: {
    ttsContent: {
      type: Object,
      default () {
        return {};
      },
    },
    selectId: {
      type: String,
      default: "",
    },
  },
  components: {
    Wavefrom,
  },
  data () {
    return {
      volumeMin: 0,
      volumeMax: 100,
      speedMin: -500,
      speedMax: 500,
      intonationMin: -500,
      intonationMax: 500,
      selectRow: "",
      timbreOption: {
        // height: "auto",
        header: false,
        calcHeight: 30,
        tip: false,
        searchShow: false,
        searchMenuSpan: 6,
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
        menu: false,
        dialogClickModal: false,
        dialogWidth: 750,
        emptyText: this.$t("aicosCommon.notData"),
        column: [
          {
            label: this.$t('kwRobotManage.patchName'),
            prop: "name",
          },
          {
            label: this.$t('kwRobotManage.sex'),
            prop: "sex",
          },
          {
            label: this.$t('kwRobotManage.applicableScenarios'),
            prop: "scene",
          },
          {
            label: this.$t('kwRobotManage.languages'),
            prop: "lang",
          },
          {
            label: this.$t('kwRobotManage.defaultOrNot'),
            prop: "isDefault",
          },
        ],
      },
      timbreData: [],
      form: {
        pitch: 0,
      },
      option: {
        submitBtn: false,
        emptyBtn: false,
        column: [
          {
            label: this.$t('kwRobotManage.timbre'),
            prop: "timbre",
            span: 24,
          },
          {
            label: this.$t('kwRobotManage.playbackMode'),
            prop: "model",
            type: "select",
            span: 24,
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
            value: "async",
            // change: this.changePlayType,
          },
          {
            label: this.$t('kwRobotManage.volume'),
            prop: "volume",
            span: 24,
            type: "slider",
            value: 50,
            hide: true,
          },
          {
            label: this.$t('kwRobotManage.speechSpeed'),
            prop: "speed",
            span: 24,
            type: "slider",
            value: 50,
            hide: true,
          },
          {
            label: this.$t('kwRobotManage.intonation'),
            prop: "pitch",
            span: 24,
            type: "slider",
            value: 50,
            hide: true,
          },
          {
            label: this.$t('kwRobotManage.test'),
            prop: "text",
            span: 24,
            type: "textarea",
            maxlength: 300,
            showWordLimit: true,
            clearable: true,
            hide: true,
            display: true,
          },
          {
            label: "",
            labelWidth: 0,
            prop: "playAudio",
            hide: true,
            span: 24,
            display: true,
          },
        ],
      },
      playAudioDialog: false,
      voice: "",
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
    selectRow (newVal) {
      const handleList = (array) => {
        array.forEach(item => {
          if (item.id === newVal) {
            item.isDefault = item.id;
            this.form.voice = item.param;
            this.form.spk = item.param;
          } else {
            item.isDefault = "";
          }
        })
      }
      handleList(this.timbreData);
      // avue中会复制form数据，this.timbreData和this.form.timbreList 不相同
      handleList(this.form.timbreList);
    }
  },

  mounted () {
    if (this.ttsContent !== "") {
      this.form = JSON.parse(this.ttsContent);
      this.timbreData = this.form.timbreList;
      if (this.timbreData) {
        if (this.language != 'zh') {
          this.timbreOption.column.forEach((item) => {
            let width = getTextWidth(item.label).nodeWidth + 40;
            if (item.width) {
              if (width < item.width) {
                return;
              }
              this.$set(item, "width", width);
            } else {
              this.$set(item, "minWidth", width);
            }
          });
        }
        this.timbreData.map((item) => {
          if (item.isDefault !== "") {
            this.selectRow = item.isDefault;
          }
        });
      }
      // 中科汇联
      if (this.form.company === "huilan") {
        this.volumeMin = 0.1;
        this.volumeMax = 5;
        this.speedMin = 0.1;
        this.speedMax = 5;
        this.intonationMin = -10;
        this.intonationMax = 10;
      }
      // 阿里
      if (this.form.company === "ali") {
        this.volumeMin = 0;
        this.volumeMax = 100;
        this.speedMin = -500;
        this.speedMax = 500;
        this.intonationMin = -500;
        this.intonationMax = 500;
      }
    } else {
      getDetail(this.selectId).then((res) => {
        if (res.data.success) {
          this.form = res.data.data;
          this.timbreData = res.data.data.timbreList;
          if (this.timbreData) {
            this.timbreData.map((item) => {
              if (item.isDefault !== "") {
                this.selectRow = item.isDefault;
              }
            });
          }
          // 中科汇联
          if (this.form.company === "huilan") {
            this.volumeMin = 0.1;
            this.volumeMax = 5;
            this.speedMin = 0.1;
            this.speedMax = 5;
            this.intonationMin = -10;
            this.intonationMax = 10;
            this.form.volume = 1;
            this.form.speed = 1;
          }
          // 阿里
          if (this.form.company === "ali") {
            this.volumeMin = 0;
            this.volumeMax = 100;
            this.speedMin = -500;
            this.speedMax = 500;
            this.intonationMin = -500;
            this.intonationMax = 500;
            this.form.volume = 50;
            this.form.speed = 0;
          }
        }
      });
    }
    this.form.text = "";
  },

  methods: {
    // 点击扬声器
    playClick () {
      if (this.form.text === "") {
        this.$message.warning(this.$t('kwRobotManage.testContentTips'));
        return false;
      }
      const obj = {
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
          secret: this.form.secret,
          speed: this.form.speed,
          volume: this.form.volume,
          pitch: this.form.pitch,
        },
        engineType: this.form.engineType,
        model: this.form.model,
      };
      // 厂商阿里
      if (this.form.company === "ali") {
        obj.inner.appkey = this.form.appkey;
        obj.inner.accessKeySecret = this.form.accessKeySecret;
        obj.inner.accessKeyId = this.form.accessKeyId;
      }
      obj.timbre = this.timbreData;
      testTts(obj)
        .then((res) => {
          this.voice = res.data.data;
          // this.$refs.crud.$refs.dialogForm.$refs.tableForm.allDisabled = false;
          this.playAudioDialog = true;
        })
        .catch(() => {
          // this.$refs.crud.$refs.dialogForm.$refs.tableForm.allDisabled = false;
        });
    },
    closeWaveDialog () {
      this.$refs.wavedialog.pause();
    },
    // changePlayType({value}) {
    //   if(this.form) {
    //     this.form.model = value === "0" ? "sync" : "async"
    //   }
    // }
  },
};
</script>
