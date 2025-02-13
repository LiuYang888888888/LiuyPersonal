<template>
  <div style="padding: 0 20px">
    <HuilanBasicToolbar style="margin-top: 0">
      <el-dropdown @command="handleCommand">
        <el-button type="primary" size="small" style="margin-left: 10px" class="kw-btn-blue">
          {{ $t("aicosCommon.batchOperate") }}
          <i class="el-icon-arrow-down el-icon--right"></i>
        </el-button>
        <el-dropdown-menu slot="dropdown">
          <el-dropdown-item command="del" v-if="permissionList.delBtn">{{
            $t("aicosCommon.batchDeleteBtn")
          }}</el-dropdown-item>
          <el-dropdown-item command="label">{{
            $t("kwRobotStudy.batchAnnotation")
          }}</el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
    </HuilanBasicToolbar>
    <avue-crud :option="option" :search.sync="query" :table-loading="loading" :data="data" ref="crud" v-model="form"
      :page.sync="page" @selection-change="selectionChange" @current-change="currentChange" @size-change="sizeChange"
      @refresh-change="refreshChange" @on-load="onLoad">
      <template slot="unknownQuestion" slot-scope="{ row }">
        <span><span v-if="row.isGather === 0" style="color: red; margin-right: 3px">*</span>{{ row.unknownQuestion
        }}</span>
      </template>
      <template slot="menu" slot-scope="{ row, size, type }">
        <el-button :type="type" :size="size" @click.stop="createFun(row)">{{
          $t("kwRobotStudy.createKnowledge")
        }}</el-button>
        <el-button :type="type" :size="size" @click.stop="knowledgeMarker(row)">{{ $t("kwRobotStudy.kowledgeAnnotation")
        }}</el-button>
        <el-button :type="type" :size="size" @click.stop="del(row)" v-if="permissionList.delBtn">{{
          $t("aicosCommon.delBtn") }}</el-button>
      </template>
    </avue-crud>
    <HuilanDialog ref="dialog" :title="$t('kwRobotStudy.createKnowledge')" :visible.sync="createDialogVisible"
      append-to-body width="600px">
      <Createknowledge ref="createknowledge" v-if="createDialogVisible" />
      <template v-slot:footer>
        <el-button size="small" @click="createDialogVisible = false">{{
          $t("aicosCommon.cancelBtn")
        }}</el-button>
        <el-button size="small" type="primary" @click="handlerCreate" :disabled="disable">{{ $t("kwRobotStudy.goToCreate")
        }}</el-button>
      </template>
    </HuilanDialog>
    <HuilanDialog ref="dialog" :title="$t('kwRobotStudy.kowledgeAnnotation')" :visible.sync="dialogVisible" append-to-body
      width="55%">
      <Knowledgelabel ref="knowledgelabel" :rowData="marketData" v-if="dialogVisible" @refresh="refresh"
        :isOne="!isMore" />
      <template v-slot:footer>
        <el-button size="small" @click="dialogVisible = false">{{
          $t("aicosCommon.cancelBtn")
        }}</el-button>
        <el-button size="small" type="primary" @click="handlerSave" :disabled="disable">{{ $t("aicosCommon.saveBtn")
        }}</el-button>
      </template>
    </HuilanDialog>
    <el-drawer :title="$t('kwRobotStudy.addKnowledge')" :visible.sync="manageDialogVisible" append-to-body show-close
      @close="manageDialogVisible = false" size="60%">
      <template v-if="selectType === 'faq' && manageDialogVisible">
        <AddFaq :rowData="selectRow" :faqType="'add'" @addOrEditEmitEvent="addOrEditEmitEvent" />
      </template>
      <template v-if="selectType === 'chat' && manageDialogVisible">
        <AddChat :rowData="selectRow" :faqType="'add'" @addOrEditEmitEvent="addOrEditEmitEvent" />
      </template>
      <template v-if="selectType === 'table' && manageDialogVisible">
        <AddTable :rowData="selectRow" :faqType="'add'" @addOrEditEmitEvent="addOrEditEmitEvent" />
      </template>
      <template v-if="selectType === 'intention' && manageDialogVisible">
        <Addintention @back="addOrEditEmitEvent" :botId="botId" :rowData="selectRow" classifyId="0" addType="parent" />
      </template>
    </el-drawer>
  </div>
</template>
<script>
import Createknowledge from "../createknowledge";
import Knowledgelabel from "../knowledgeLabel/index";
import AddFaq from "../createknowledge/addfaq/addFaq";
import AddChat from "../createknowledge/addchat/addChat";
import AddTable from "../createknowledge/addtable/addTable";
import Addintention from "../createknowledge/addintention";
import {
  detailList,
  detailDeleteByIds
} from "@/api/kwRobot/kwRobotStudy/unknown";
import { getTextWidth } from "@/util/util"
import { mapGetters } from "vuex";
export default {
  components: {
    Createknowledge,
    Knowledgelabel,
    AddFaq,
    AddChat,
    AddTable,
    Addintention
  },
  props: {
    rowData: {
      type: Object,
      default: () => ({})
    }
  },
  inject: ["isRobotMenu"],
  data () {
    return {
      // 表格
      selectRow: {},
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
        dialogClickModal: false,
        dialogWidth: "30%",
        emptyText: this.$t('aicosCommon.notData'),
        column: [
          {
            label: this.$t('kwRobotStudy.userQuestion'),
            prop: "unknownQuestion",
            span: 24,
            overHidden: true,
            minWidth: 200
          },
          {
            label: this.$t('kwRobotStudy.recognitionResults'),
            prop: "intentRecognitionResults",
            overHidden: true,
            minWidth: 150,
            span: 24,
            formatter: (val, value, label) => {
              if (this.validatenull(value)) {
                return "--";
              }
              return label;
            }
          },
          {
            label: this.$t('kwRobotStudy.matchingScore'),
            prop: "highestMatchScore",
            minWidth: 150,
            formatter: (val, value, label) => {
              if (this.validatenull(value)) {
                return "--";
              }
              return label;
            }
          },
          {
            label: this.$t('kwRobotStudy.sourceInstance'),
            prop: "sourceInstance",
            overHidden: true,
            minWidth: 100,
            formatter: (val, value, label) => {
              if (this.validatenull(value)) {
                return "--";
              }
              return label;
            }
          },
          {
            label: this.$t('kwRobotStudy.time'),
            prop: "createTime",
            overHidden: true,
            minWidth: 100
          }
        ]
      },
      botId: this.$store.getters.botObj.id,
      // 创建知识
      createDialogVisible: false,
      // 知识标注
      dialogVisible: false,
      isMore: false,
      // 知识创建
      manageDialogVisible: false,
      selectType: "",
      marketData: []
    };
  },
  computed: {
    prefix () {
      const prefix = this.isRobotMenu ? "robot-" : "";
      return prefix;
    },
    ...mapGetters(["permission", 'language']),
    permissionList () {
      return {
        delBtn: this.vaildData(
          this.permission[`${this.prefix}unknown-detail-del`]
        )
      };
    }
  },
  mounted () { },

  methods: {
    selectionChange (list) {
      this.selectionList = list;
    },
    async handleCommand (command) {
      if (command === "del") {
        this.moreDel();
      }
      if (command === "label") {
        if (this.selectionList.length === 0) {
          this.$message.warning(this.$t('kwRobotStudy.selectLabel'));
          return;
        }
        this.isMore = true;
        this.marketData = [];
        this.dialogVisible = true;
        this.selectionList.forEach(item => {
          item.question = item.unknownQuestion;
          this.marketData.push(item);
        });
      }
    },
    onLoad () {
      this.loading = true;
      let obj = {
        size: this.page.pageSize,
        current: this.page.currentPage,
        unknownQuestionId: this.rowData.id
      };
      detailList(obj).then(res => {
        if (res.data.code === 200) {

          this.data = res.data.data.records;
          this.page.total = res.data.data.total;

          if (this.language != "zh") {
            this.option.menuWidth = 350;
            this.option.column.forEach((item) => {
              let width = getTextWidth(item.label).nodeWidth + 80;
              if (item.width) {
                if (width < item.width) {
                  return;
                }
                this.$set(item, "width", width);
              } else {
                this.$set(item, "minWidth", width);
              }
            });
          } else {
            this.option.menuWidth = 180;
          }
          this.loading = false;
        }
      });
    },
    async moreDel () {
      if (this.selectionList.length === 0) {
        this.$message.warning(this.$t('kwRobotStudy.selectDelete'));
        return;
      }
      let ids = this.selectionList.map(item => item.id).join(",");
      const result = await detailDeleteByIds({ ids });
      if (result.data.code == 200) {
        this.$message.success(this.$t("aicosCommon.successOperate"));
        this.onLoad();
      }
    },
    // 单个忽略
    del (row) {
      this.$confirm(this.$t('kwRobotStudy.confirmData'), {
        cancelButtonText: this.$t("aicosCommon.cancelBtn"),
        confirmButtonText: this.$t("aicosCommon.confirmBtn"),
        type: "warning"
      })
        .then(async () => {
          const delInfo = {
            ids: row.id
          };
          const result = await detailDeleteByIds(delInfo);
          if (result.data.code == 200) {
            this.$message.success(this.$t("kwRobotStudy.deletedSuccess"));
            this.onLoad();
          }
        })
        .catch(() => { });
    },
    createFun (row) {
      this.createDialogVisible = true;
      this.selectRow = row;
      this.selectRow.question = row.unknownQuestion;
    },
    knowledgeMarker (row) {
      this.isMore = false;
      this.marketData = [];
      this.dialogVisible = true;
      row.question = row.unknownQuestion;
      this.marketData.push(row);
    },
    handlerCreate () {
      const { createknowledge } = this.$refs;
      if (createknowledge.value === "") {
        this.$message.warning(this.$t('kwRobotStudy.knowledgeClass'));
        return;
      }
      this.selectType = createknowledge.value;
      this.createDialogVisible = false;
      this.manageDialogVisible = true;
    },
    async addOrEditEmitEvent () {
      this.manageDialogVisible = false;
      const result = await detailDeleteByIds({ ids: this.selectRow.id });
      if (result.data.code == 200) {
        this.onLoad();
      }
    },
    handlerSave () {
      this.$refs.knowledgelabel.handleSave();
    },
    async refresh () {
      this.dialogVisible = false;
      // if (!this.validatenull(data)) {
      let ids = this.marketData.map(item => item.id).join(",");
      const result = await detailDeleteByIds({ ids });
      if (result.data.code == 200) {
        this.onLoad();
      }
      // }
    }
  }
};
</script>
