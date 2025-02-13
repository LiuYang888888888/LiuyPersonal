<template>
  <div style="padding: 0 20px">
    <HuilanBasicToolbar style="margin-top: 0">
      <el-button
        type="primary"
        size="small"
        @click="moreDel"
        class="kw-btn-blue"
      >
        {{ $t("aicosCommon.batchIgnore") }}</el-button
      >
    </HuilanBasicToolbar>
    <avue-crud
      :option="option"
      :search.sync="query"
      :table-loading="loading"
      :data="data"
      ref="crud"
      v-model="form"
      :page.sync="page"
      @selection-change="selectionChange"
      @current-change="currentChange"
      @size-change="sizeChange"
      @refresh-change="refreshChange"
      @on-load="onLoad"
    >
      <template slot-scope="{ row }" slot="robotAnswer">
        <div v-html="row.robotAnswer" class="answer-table-contaner"></div>
      </template>
      <template slot="menu" slot-scope="{ row, size, type }">
        <!-- <el-button :type="type" :size="size" @click.stop="createFun(row)">{{
          $t("kwRobotStudy.createKnowledge")
        }}</el-button> -->
        <el-button
          :type="type"
          :size="size"
          @click.stop="editKnowledge(row)"
          v-if="!validatenull(row.poorType)"
        >
          {{ $t("kwRobotStudy.editKnowledge") }}
        </el-button>
        <el-button
          :type="type"
          :size="size"
          @click.stop="knowledgeMarker(row)"
          >{{ $t("kwRobotStudy.kowledgeAnnotation") }}</el-button
        >
        <el-button :type="type" :size="size" @click.stop="del(row)">{{
          $t("kwRobotStudy.ignore")
        }}</el-button>
      </template>
    </avue-crud>
    <el-drawer
      :title="$t('kwRobotStudy.editKnowledge')"
      :visible.sync="createDialogVisible"
      append-to-body
      show-close
      @close="createDialogVisible = false"
      size="60%"
    >
      <!-- <Createknowledge ref="createknowledge" v-if="createDialogVisible" />
      <template v-slot:footer>
        <el-button size="small" @click="createDialogVisible = false">{{
          $t("aicosCommon.cancelBtn")
        }}</el-button>
        <el-button
          size="small"
          type="primary"
          @click="handlerCreate"
          :disabled="disable"
          >{{ $t("kwRobotStudy.goToCreate") }}</el-button
        >
      </template> -->
      <template v-if="selectRow.poorType === '1' && createDialogVisible">
        <Editfaq
          :curFaqObj="selectRow"
          :faqType="'edit'"
          @addOrEditEmitEvent="closeEditDialog"
        />
      </template>
      <template v-if="selectRow.poorType === '3' && createDialogVisible">
        <Editsmalltalk
          nodeDeepPath="['0']"
          :curFaqObj="selectRow"
          :faqType="'edit'"
          @addOrEditEmitEvent="closeEditDialog"
        />
      </template>
      <template v-if="selectRow.poorType === '2' && createDialogVisible">
        <Edittable
          :curFaqObj="selectRow"
          :faqType="'edit'"
          @addOrEditEmitEvent="closeEditDialog"
        />
      </template>
      <template v-if="selectRow.poorType === '4' && createDialogVisible">
        <Editintention
          @back="closeEditDialog"
          :isEdit="true"
          :botId="botId"
          :cur="selectRow"
        />
      </template>
    </el-drawer>
    <HuilanDialog
      ref="dialog"
      :title="$t('kwRobotStudy.kowledgeAnnotation')"
      :visible.sync="dialogVisible"
      append-to-body
      width="55%"
    >
      <Knowledgelabel
        ref="knowledgelabel"
        :rowData="marketData"
        v-if="dialogVisible"
        @refresh="refresh"
      />
      <template v-slot:footer>
        <el-button size="small" @click="dialogVisible = false">{{
          $t("aicosCommon.cancelBtn")
        }}</el-button>
        <el-button
          size="small"
          type="primary"
          @click="handlerSave"
          :disabled="disable"
          >{{ $t("aicosCommon.saveBtn") }}</el-button
        >
      </template>
    </HuilanDialog>
    <el-drawer
      :title="$t('kwRobotStudy.addKnowledge')"
      :visible.sync="manageDialogVisible"
      append-to-body
      show-close
      @close="manageDialogVisible = false"
      size="60%"
    >
      <template v-if="selectType === 'faq' && manageDialogVisible">
        <AddFaq
          :rowData="selectRow"
          :faqType="'add'"
          @addOrEditEmitEvent="addOrEditEmitEvent"
        />
      </template>
      <template v-if="selectType === 'chat' && manageDialogVisible">
        <AddChat
          :rowData="selectRow"
          :faqType="'add'"
          @addOrEditEmitEvent="addOrEditEmitEvent"
        />
      </template>
      <template v-if="selectType === 'table' && manageDialogVisible">
        <AddTable
          :rowData="selectRow"
          :faqType="'add'"
          @addOrEditEmitEvent="addOrEditEmitEvent"
        />
      </template>
      <template v-if="selectType === 'intention' && manageDialogVisible">
        <Addintention
          @back="addOrEditEmitEvent"
          :botId="botId"
          :rowData="selectRow"
          classifyId="0"
          addType="parent"
        />
      </template>
    </el-drawer>
  </div>
</template>
<script>
import Createknowledge from "../createknowledge";
import Knowledgelabel from "../knowledgeLabel/index";
import Editfaq from "@/views/kwKnowledgeCenter/kwKnowledgeMangement/kwFaqManagement/addFaq";
import Editsmalltalk from "@/views/kwKnowledgeCenter/kwKnowledgeMangement/smalltalk/addFaq";
import Edittable from "@/views/kwKnowledgeCenter/kwKnowledgeMangement/kwTabManagement/addFaq";
import Editintention from "@/views/kwKnowledgeCenter/kwIntentionManage/add";
import AddFaq from "../createknowledge/addfaq/addFaq";
import AddChat from "../createknowledge/addchat/addChat";
import AddTable from "../createknowledge/addtable/addTable";
import Addintention from "../createknowledge/addintention";
import { getTextWidth, deepClone } from "@/util/util";
import { mapGetters } from "vuex";
import {
  detailList,
  detailDeleteByIds,
} from "@/api/kwRobot/kwRobotStudy/outquestion";
export default {
  components: {
    Createknowledge,
    Knowledgelabel,
    AddFaq,
    AddChat,
    Editfaq,
    Editsmalltalk,
    Editintention,
    AddTable,
    Addintention,
    Edittable,
  },
  props: {
    rowData: {
      type: Object,
      default: () => ({}),
    },
  },
  computed: {
    ...mapGetters(["language"]),
  },
  data() {
    return {
      // 表格
      selectRow: {},
      form: {},
      loading: false,
      data: [],
      page: {
        pageSize: 10,
        currentPage: 1,
        total: 0,
      },
      selectionList: [],
      option: {
        tip: false,
        header: false,
        border: true,
        // index: true,
        menuWidth: 200,
        selection: true,
        addBtn: false,
        editBtn: false,
        delBtn: false,
        viewBtn: false,
        dialogClickModal: false,
        dialogWidth: "30%",
        emptyText: this.$t("aicosCommon.notData"),
        column: [
          {
            label: this.$t("kwRobotStudy.userQuestion"),
            prop: "userQuestion",
            span: 24,
            overHidden: true,
            minWidth: 200,
            formatter: (val, value, label) => {
              if (this.validatenull(value)) {
                return "--";
              }
              return label;
            },
          },
          {
            label: this.$t("kwRobotStudy.userSource"),
            prop: "userSource",
            minWidth: 120,
            width: 120,
            align: "center",
            overHidden: true,
            formatter: (val, value, label) => {
              if (this.validatenull(value)) {
                return "--";
              }
              return label;
            },
          },
          {
            label: this.$t("kwRobotStudy.robotAnswer"),
            prop: "robotAnswer",
            minWidth: 200,
            width: 200,
            align: "center",
            overHidden: true,
            span: 24,
            formatter: (val, value, label) => {
              if (this.validatenull(value)) {
                return "--";
              }
              return label;
            },
          },
          {
            label: this.$t("kwRobotStudy.sourceInstance"),
            prop: "sourceInstance",
            align: "center",
            overHidden: true,
            minWidth: 120,
            width: 160,
            formatter: (val, value, label) => {
              if (this.validatenull(value)) {
                return "--";
              }
              return label;
            },
          },
          {
            label: this.$t("kwRobotStudy.time"),
            prop: "createTime",
            width: 180,
            align: "center",
            overHidden: true,
          },
        ],
      },
      botId: this.$store.getters.botObj.id,
      // 创建知识
      createDialogVisible: false,
      // 知识标注
      dialogVisible: false,
      // 知识创建
      manageDialogVisible: false,
      selectType: "",
      marketData: [],
    };
  },

  mounted() {},

  methods: {
    onLoad() {
      this.loading = true;
      let obj = {
        size: this.page.pageSize,
        current: this.page.currentPage,
        robotAnswer: this.rowData.robotAnswer,
      };
      detailList(obj)
        .then((res) => {
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
              this.option.menuWidth = 220;
            }
            this.loading = false;
          }
        })
        .catch(() => {
          this.loading = false;
        });
    },
    selectionChange(list) {
      this.selectionList = list;
    },
    async moreDel() {
      if (this.selectionList.length === 0) {
        this.$message.warning(this.$t("kwRobotStudy.selectIgnoreTips"));
        return;
      }
      let ids = this.selectionList.map((item) => item.id).join(",");
      const result = await detailDeleteByIds({ ids });
      if (result.data.code == 200) {
        this.$message.success(this.$t("aicosCommon.successOperate"));
        this.onLoad();
      }
    },
    // 单个忽略
    del(row) {
      this.$confirm(this.$t("kwRobotStudy.ignoreSelectedTips"), {
        cancelButtonText: this.$t("aicosCommon.cancelBtn"),
        confirmButtonText: this.$t("aicosCommon.confirmBtn"),
        type: "warning",
      })
        .then(async () => {
          const delInfo = {
            ids: row.id,
          };
          const result = await detailDeleteByIds(delInfo);
          if (result.data.code == 200) {
            this.$message.success(this.$t("kwRobotStudy.ignoreSuccess"));
            this.onLoad();
          }
        })
        .catch(() => {});
    },
    createFun(row) {
      this.createDialogVisible = true;
      this.selectRow = row;
      this.selectRow.question = row.userQuestion;
    },
    editKnowledge(row) {
      this.createDialogVisible = true;
      this.selectRow = deepClone(row);
      this.selectRow.id = this.selectRow.poorKnowledgeId;
    },
    knowledgeMarker(row) {
      this.marketData = [];
      this.dialogVisible = true;
      row.question = row.userQuestion;
      this.marketData.push(row);
    },
    handlerCreate() {
      const { createknowledge } = this.$refs;
      if (createknowledge.value === "") {
        this.$message.warning(this.$t("kwRobotStudy.knowledgeClass"));
        return;
      }
      this.selectType = createknowledge.value;
      this.createDialogVisible = false;
      this.manageDialogVisible = true;
    },
    closeEditDialog() {
      this.createDialogVisible = false;
    },
    async addOrEditEmitEvent() {
      this.manageDialogVisible = false;
      const result = await detailDeleteByIds({ ids: this.selectRow.id });
      if (result.data.code == 200) {
        this.onLoad();
      }
    },
    handlerSave() {
      this.$refs.knowledgelabel.handleSave();
    },
    async refresh() {
      this.dialogVisible = false;
      let ids = this.marketData.map((item) => item.id).join(",");
      const result = await detailDeleteByIds({ ids });
      if (result.data.code == 200) {
        this.onLoad();
      }
    },
  },
};
</script>
