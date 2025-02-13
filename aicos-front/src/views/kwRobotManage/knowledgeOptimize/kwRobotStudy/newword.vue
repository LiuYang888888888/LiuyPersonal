<template>
  <div>
    <HuilanBasicToolbar style="margin-top: 0">
      <el-button v-if="permissionList.delMoreBtn" type="primary" size="small" @click="handleDel" class="kw-btn-blue">{{
        $t("aicosCommon.batchIgnore") }}
      </el-button>
    </HuilanBasicToolbar>
    <HuilanBasicSearchbar :model="searchForm" :fields="searchFieldList" @reset="searchReset" @search="searchChange">
    </HuilanBasicSearchbar>
    <avue-crud :option="option" :search.sync="query" :table-loading="loading" :data="data" ref="crud" v-model="form"
      :page.sync="page" @selection-change="selectionChange" @current-change="currentChange" @size-change="sizeChange"
      @refresh-change="refreshChange" @on-load="onLoad">
      <template v-slot:menu="scope">
        <HuilanBasicActionTool :actions="getRowActions(scope.row)"
          @command="handleCommand($event, scope.row, scope.index)" />
      </template>
    </avue-crud>
    <HuilanDialog ref="dialog" :title="$t('kwRobotStudy.addProprietaryWords')" :visible.sync="dialogVisible"
      append-to-body width="600px">
      <el-form size="small" :model="ruleForm" :rules="rules" ref="ruleForm" label-width="110px"
        :label-position="labelPosition">
        <el-form-item :label="$t('kwRobotStudy.properWordName')" prop="properWord">
          <el-input v-model="ruleForm.properWord" :placeholder="$t('aicosCommon.pleaseInput')" maxlength="50"
            showWordLimit></el-input></el-form-item>
        <el-form-item :label="$t('kwRobotStudy.partSpeech')" prop="properType">
          <el-select v-model="ruleForm.properType" :placeholder="$t('aicosCommon.pleaseSelect')">
            <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <template v-slot:footer>
        <el-button size="small" @click="dialogVisible = false">{{
          $t("aicosCommon.cancelBtn")
        }}</el-button>
        <el-button size="small" type="primary" @click="handlerSaveGlossary" :disabled="disable">{{
          $t("aicosCommon.saveBtn") }}</el-button>
      </template>
    </HuilanDialog>
  </div>
</template>
<script>
import { newWordList, deleteByIds } from "@/api/kwRobot/kwRobotStudy/newword";
import { saveProper } from "@/api/kwKnowledgeCenter/kwKnowledgeMangement/documentknowledge/index";
import { mapGetters } from "vuex";
export default {
  inject: ["desktop", "isRobotMenu"],
  data () {
    return {
      // 搜索
      searchForm: {
        time: [],
        newWordName: ""
      },
      searchFieldList: [
        {
          prop: "time",
          type: "datetimerange",
          format: "yyyy-MM-dd HH:mm:ss",
          valueFormat: "yyyy-MM-dd HH:mm:ss",
          startPlaceholder: this.$t("kwRobotStudy.startTime"),
          endPlaceholder: this.$t("kwRobotStudy.endTime")
        },
        {
          prop: "newWordName",
          placeholder: this.$t("kwRobotStudy.inputKeywords")
        }
      ],
      // 表格
      form: {},
      loading: false,
      data: [],
      page: {
        pageSize: 10,
        currentPage: 1,
        total: 0
      },
      selectionList: [],
      option: {
        tip: false,
        header: false,
        border: true,
        // index: true,
        selection: true,
        addBtn: false,
        editBtn: false,
        delBtn: false,
        viewBtn: false,
        menuWidth: 260,
        dialogClickModal: false,
        dialogWidth: "30%",
        emptyText: this.$t("aicosCommon.notData"),
        column: [
          {
            label: this.$t("kwRobotStudy.newWord"),
            prop: "newWordName",
            span: 24,
            formatter: (val, value, label) => {
              if (this.validatenull(value)) {
                return "--";
              }
              return label;
            }
          },
          {
            label: this.$t("kwRobotStudy.executionTime"),
            prop: "createTime",
            span: 24
          }
        ]
      },
      // 新增专有词
      dialogVisible: false,
      ruleForm: {
        properWord: "",
        properType: this.$t("kwRobotStudy.noun")
      },
      rules: {
        properWord: [
          {
            required: true,
            message: this.$t("kwRobotStudy.inputProper"),
            trigger: "blur"
          }
        ],
        properType: [
          {
            required: true,
            message:
              this.$t("aicosCommon.pleaseInput") +
              this.$t("kwRobotStudy.partSpeech"),
            trigger: "change"
          }
        ]
      },
      options: [
        {
          label: this.$t("kwRobotStudy.noun"),
          value: "名词"
        },
        {
          label: this.$t("kwRobotStudy.verb"),
          value: "动词"
        },
        {
          label: this.$t("kwRobotStudy.adjective"),
          value: "形容词"
        },
        {
          label: this.$t("kwRobotStudy.adverb"),
          value: "副词"
        }
      ]
    };
  },
  computed: {
    prefix () {
      const prefix = this.isRobotMenu ? "robot-" : "";
      return prefix;
    },
    ...mapGetters(["permission", "userInfo", "language"]),
    permissionList () {
      return {
        delMoreBtn: this.vaildData(
          this.permission[`${this.prefix}newword-delMore`],
          false
        ),
        addGlossaryBtn: this.vaildData(
          this.permission[`${this.prefix}newword-addGlossary`],
          false
        ),
        overLookBtn: this.vaildData(
          this.permission[`${this.prefix}newword-overLook`],
          false
        )
      };
    },
    labelPosition () {
      return this.language != "zh" ? "top" : "right";
    },
  },

  watch: {
    language: {
      handler () {
        this.option.menuWidth = this.language != "zh" ? 260 : 200;
      },
      immediate: true
    }
  },
  mounted () { },

  methods: {
    selectionChange (list) {
      this.selectionList = list;
    },
    searchChange () {
      this.onLoad();
    },
    searchReset () {
      this.searchForm = {
        time: [],
        newWordName: ""
      };
      this.onLoad();
    },
    getRowActions () {
      const map = {
        addGlossaryBtn: {
          name: this.$t("kwRobotStudy.addProprietaryWords"),
          command: "addGlossaryClick"
        },
        overLookBtn: {
          name: this.$t("kwRobotStudy.ignore"),
          command: "overLookClick"
        }
      };
      const list = ["addGlossaryBtn", "overLookBtn"];
      const actions = [];
      list.forEach(item => {
        if (this.permissionList[item]) {
          actions.push(map[item]);
        }
      });
      return actions;
    },
    handleCommand (command, row, index) {
      this[command](row, index);
    },
    handleDel () {
      if (this.selectionList.length === 0) {
        this.$message.warning(this.$t("kwRobotStudy.selectIgnore"));
        return;
      }
      let ids = this.selectionList.map(item => item.id).join(",");
      deleteByIds({ ids }).then(res => {
        if (res.data.code === 200) {
          this.$message.success(this.$t("kwRobotStudy.batchIgnoredSuccess"));
          this.onLoad();
        }
      });
    },
    addGlossaryClick (row) {
      this.dialogVisible = true;
      this.ruleForm = {
        properWord: row.newWordName,
        properType: this.$t("kwRobotStudy.noun")
      };
    },
    handlerSaveGlossary () {
      this.$refs.ruleForm.validate(valid => {
        if (valid) {
          let obj = { ...this.ruleForm };
          obj.applicationId = this.$store.state.user.currentTenantId;
          saveProper(obj).then(res => {
            if (res.data.success) {
              this.$message.success(this.$t("kwRobotStudy.addedWordSuccess"));
              this.dialogVisible = false;
              this.onLoad();
            }
          });
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    overLookClick (row) {
      this.$confirm(this.$t("kwRobotStudy.confirmIgnore"), {
        cancelButtonText: this.$t("aicosCommon.cancelBtn"),
        confirmButtonText: this.$t("aicosCommon.confirmBtn"),
        type: "warning"
      })
        .then(async () => {
          const delInfo = {
            ids: row.id
          };
          const result = await deleteByIds(delInfo);
          if (result.data.code == 200) {
            this.$message.success(this.$t("kwRobotStudy.ignoreSuccess"));
            this.onLoad();
          }
        })
        .catch(() => { });
    },
    onLoad () {
      this.loading = true;
      let obj = {
        size: this.page.pageSize,
        current: this.page.currentPage,
        newWordName: this.searchForm.newWordName,
        startTime:
          this.searchForm.time && this.searchForm.time.length > 0
            ? this.searchForm.time[0]
            : "",
        endTime:
          this.searchForm.time && this.searchForm.time.length > 0
            ? this.searchForm.time[1]
            : ""
      };
      newWordList(obj).then(res => {
        if (res.data.code === 200) {
          this.data = res.data.data.records;
          this.page.total = res.data.data.total;
          this.loading = false;
        }
      });
    }
  }
};
</script>
