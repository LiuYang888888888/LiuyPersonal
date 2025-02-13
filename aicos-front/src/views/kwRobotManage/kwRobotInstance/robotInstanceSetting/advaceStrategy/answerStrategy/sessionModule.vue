<template>
  <div>
    <avue-crud :option="tableOption" :data="tableData" ref="tableRef">
      <template slot="menuRight">
        <el-button class="el-icon-plus" type="text" @click="addConfig">{{ $t('kwRobotManage.addConfiguration')
        }}</el-button>
      </template>
      <template slot-scope="scope" slot="menu">
        <el-button type="text" size="small" @click.stop="editSession(scope.row, scope.index)">{{ $t("aicosCommon.editBtn")
        }}</el-button>
      </template>
    </avue-crud>

    <!--编辑会话拒识话术-->
    <HuilanDialog :title="$t('aicosCommon.editBtn')" append-to-body :close-on-click-modal="isCloseOnClickModal"
      :visible.sync="isShowEdit" width="500px" custom-class="choose-dismension-dialog">
      <EditSessionReject v-if="isShowEdit" ref="edtSessionRejectRef" :domainArr="editDatas"
        @saveCommonMethod="saveCommonMethod" />
      <template v-slot:footer>
        <el-button size="small" @click="isShowEdit = false">{{
          $t("aicosCommon.cancelBtn")
        }}</el-button>
        <el-button size="small" type="primary" @click="saveRejectWords">{{
          $t("aicosCommon.saveBtn")
        }}</el-button>
      </template>
    </HuilanDialog>
    <HuilanDialog :title="$t('kwRobotManage.addConfiguration')" :fullscreen="false" width="960px" append-to-body
      :visible.sync="optTag">
      <Addconfig ref="addconfig" :checkedData="checkedData" v-if="optTag" />
      <template v-slot:footer>
        <el-button size="small" @click="optTag = false">{{ $t("aicosCommon.cancelBtn") }}</el-button>
        <el-button size="small" type="primary" @click="saveSelectConfig">{{ $t("aicosCommon.saveBtn") }}</el-button>
      </template>
    </HuilanDialog>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import EditSessionReject from "./editSessionReject";
import Addconfig from "../addconfig";
import { deepClone } from "@/util/util";
export default {
  props: {
    moduleData: {
      type: Array,
      default () {
        return [];
      },
    },
  },
  data () {
    return {
      optTag: false,
      isCloseOnClickModal: false,
      botId: "",
      strategyId: "",
      isShowEdit: false,
      curEditRow: {},
      rejectWords: [],
      editDatas: {
        negativeSentences: [], // 拒识话术
        negativeRegexps: [],
      },
      tableOption: {
        header: true,
        border: false,
        addBtn: false,
        editBtn: false,
        delBtn: false,
        viewBtn: false,
        columnBtn: false,
        refreshBtn: false,
        align: "center",
        column: [
          {
            label: this.$t('kwRobotManage.sessionModuleName'),
            prop: "name",
            showWordLimit: true,
            overHidden: true,
            width: 150,
          },
          {
            label: this.$t('kwRobotManage.state'),
            prop: "isUse",
            type: "select",
            dicData: [
              {
                label: this.$t('aicosCommon.start'), //启用
                value: 1,
              },
              {
                label: this.$t('aicosCommon.pause'), //禁用
                value: 0,
              },
            ],
          },
          {
            label: this.$t('kwRobotManage.filterQuestion'),
            prop: "count",
            showWordLimit: true,
            overHidden: true,
          },
          {
            label: this.$t('kwRobotManage.filterRegular'),
            prop: "regExp",
            showWordLimit: true,
            overHidden: true,
          },
        ],
        menuAlign: "center",
      },
      tableData: this.moduleData,
      checkedData: [],
      isRepeatRejectWordsFlag: false, // 是否有重复的拒识话术
    };
  },
  components: {
    EditSessionReject,
    Addconfig,
  },
  computed: {
    // 计算属性
    ...mapGetters(["instanceObj", "botObj"]),
  },
  methods: {
    // 添加配置
    addConfig () {
      this.optTag = true;
      this.checkedData = deepClone(this.tableData);
    },
    // 保存配置
    saveSelectConfig () {
      let data = this.$refs.addconfig.selectData, arr = [];
      data.forEach((item) => {
        let index = this.tableData.findIndex((e) => e.id == item.id);
        if (index == -1) {
          item = {
            ...item,
            count: 0,
            regExp: 0,
            negativeSentences: [],
            negativeRegexps: [],
          };
          item.count = 0;
          item.regExp = 0;
          item.negativeSentences = [];
          item.negativeRegexps = [];
        } else {
          item = {
            ...this.tableData[index],
          };
        }
        arr.push(item);
      });
      this.tableData = arr
      this.optTag = false;
    },
    // 编辑数据回调
    saveCommonMethod (res) {
      this.isRepeatRejectWordsFlag = res.flag;
      if (res.flag) {
        this.rejectWords = res.data;
      }
    },
    // 编辑时数据回显
    editSession (row) {
      this.isShowEdit = true;
      this.curEditRow = row;
      this.editDatas = {
        negativeSentences: [], // 拒识话术
        negativeRegexps: [],
      };
      if (row.negativeSentences.length > 0) {
        row.negativeSentences.forEach((val) => {
          this.editDatas.negativeSentences.push({
            intentQuestion: val,
          });
        });
      }
      if (row.negativeRegexps.length > 0) {
        row.negativeRegexps.forEach((val) => {
          this.editDatas.negativeRegexps.push({
            intentQuestion: val,
          });
        });
      }
    },
    // 编辑保存
    saveRejectWords () {
      this.$refs.edtSessionRejectRef.submitExpand();
      if (this.isRepeatRejectWordsFlag) {
        this.tableData.forEach((item) => {
          if (item.id === this.curEditRow.id) {
            this.$set(
              item,
              "negativeSentences",
              this.rejectWords.negativeSentences
            );
            this.$set(
              item,
              "negativeRegexps",
              this.rejectWords.negativeRegexps
            );
            this.$set(item, "count", this.rejectWords.negativeSentences.length);
            this.$set(item, "regExp", this.rejectWords.negativeRegexps.length);
          }
        });
        this.isShowEdit = false;
        this.$forceUpdate();
      }
    },
    saveModule () { },
    // load列表
    loadTable () {
      this.tableData = deepClone(this.moduleData);
    },
  },
  created () {
    this.botId = this.botObj.id;
    this.strategyId = this.instanceObj.id;
  },
  mounted () { },
};
</script>

<style scoped lang="scss"></style>
