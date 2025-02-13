<template>
  <div>
    <avue-crud :option="option" :table-loading="loading" :data="data" v-model="form" ref="crud" @on-load="onLoad">
      <template slot="menu" slot-scope="{ row }">
        <el-button @click="view(row)" type="text">{{ $t('aicosCommon.viewBtn') }}</el-button>
        <el-button @click="move(row)" type="text">{{ $t('aicosCommon.move') }}</el-button>
      </template>
    </avue-crud>
    <HuilanDialog :title="$t('aicosCommon.move')" append-to-body :visible.sync="moveDialog" width="50%">
      <avue-crud v-if="moveDialog" :option="moveOption" :table-loading="moveLoading" :data="moveData" v-model="moveForm"
        ref="crud" @on-load="moveOnLoad">
        <template slot="radio" slot-scope="{ row }">
          <el-radio v-model="selectDataId" :label="row.id">&nbsp;</el-radio>
        </template>
      </avue-crud>
      <template v-slot:footer>
        <div v-if="isView">
          <el-button size="small" @click="(moveDialog = false), (moveSelectData = {})">{{ $t("aicosCommon.cancelBtn")
          }}</el-button>
          <el-button size="small" type="primary" @click="handlerSave" :disabled="disable">{{ $t('aicosCommon.confirmBtn')
            + " " + $t('aicosCommon.move') }}</el-button>
        </div>
      </template>
    </HuilanDialog>
  </div>
</template>
<script>
import {
  knowledgeSwitchingIntent,
  knowledgeCorrelation,
} from "@/api/kwKnowledgeCenter/kwIntention/index";
import { intentList } from "@/api/kwKnowledgeCenter/kwIntention/index";
export default {
  props: ["item"],
  data () {
    return {
      // 移动
      isView: false,
      disable: false,
      moveDialog: false,
      moveForm: {},
      moveLoading: true,
      selectionList: [],
      moveOption: {
        // height: "auto",
        calcHeight: 30,
        tip: false,
        searchShow: false,
        searchMenuSpan: 6,
        border: true,
        index: false,
        viewBtn: false,
        selection: false,
        delBtn: false,
        addBtn: false,
        editBtn: false,
        dialogClickModal: false,
        dialogWidth: 700,
        labelWidth: 100,
        columnBtn: false,
        refreshBtn: false,
        menu: false,
        column: [
          {
            label: "",
            prop: "radio",
            hide: false,
            width: 200,
          },
          {
            label: this.$t('kwIntentionManage.intentionName'),
            prop: "intentName",
            span: 24,
          },
          {
            label: this.$t('kwIntentionManage.intentionType'),
            prop: "intentType",
            type: "select",
            dicData: [
              {
                label: this.$t('kwIntentionManage.answerType'),
                value: 1,
              },
              {
                label: this.$t('kwIntentionManage.taskType'),
                value: 2,
              },
            ],
          },
        ],
      },
      moveData: [],
      moveSelectData: {},
      selectDataId: "",
      page: {
        total: 0,
        currentPage: 1,
        pageSize: 10,
      },
      // 绑定知识
      form: {},
      loading: true,
      option: {
        // height: "auto",
        calcHeight: 30,
        tip: false,
        searchShow: false,
        searchMenuSpan: 6,
        border: true,
        index: false,
        viewBtn: false,
        selection: false,
        delBtn: false,
        addBtn: false,
        editBtn: false,
        dialogClickModal: false,
        dialogWidth: 700,
        labelWidth: 100,
        columnBtn: false,
        refreshBtn: false,
        column: [
          {
            label: this.$t('kwIntentionManage.issueNames'),
            prop: "question",
            span: 24,
          },
          {
            label: this.$t('kwIntentionManage.type'),
            prop: "type",
            type: "select",
            dicData: [
              {
                label: this.$t('kwIntentionManage.faqName'),
                value: "faq",
              },
              {
                label: this.$t('kwIntentionManage.tableName'),
                value: "tab",
              },
              {
                label: this.$t('kwIntentionManage.chattingKnowledge'),
                value: "gossip",
              }
            ],
          },
        ],
      },
      data: [],
    };
  },
  methods: {
    move (row) {
      this.isView = true;
      this.moveSelectData = row;
      this.moveDialog = true;
      const obj = {
        id: this.moveSelectData.id,
        type: this.moveSelectData.type,
      };
      knowledgeCorrelation(obj).then((res) => {
        if (res.data.success && res.data.data !== "") {
          this.selectDataId = res.data.data;
        }
      });
    },
    view (row) {
      this.isView = false;
      this.moveSelectData = row;
      this.moveDialog = true;
      const obj = {
        id: this.moveSelectData.id,
        type: this.moveSelectData.type,
      };
      knowledgeCorrelation(obj).then((res) => {
        if (res.data.success && res.data.data !== "") {
          this.selectDataId = res.data.data;
        }
      });
    },
    // 保存移动数据
    handlerSave () {
      if (this.selectDataId === "") {
        this.$message.warning(this.$t('kwIntentionManage.selectMovedTip'));
        return false;
      }
      this.disable = true;
      const obj = {
        id: this.moveSelectData.id,
        intentId: this.selectDataId,
        type: this.moveSelectData.type,
      };
      knowledgeSwitchingIntent(obj)
        .then((res) => {
          if (res.data.success) {
            this.disable = false;
            this.moveDialog = false;
            this.$message.success(this.$t('aicosCommon.successOperate'));
          }
        })
        .catch(() => {
          this.disable = false;
        });
    },
    onLoad () {
      this.loading = false;
      this.data = this.item;
    },
    async moveOnLoad () {
      this.moveLoading = true;
      const info = {
        botId: this.$store.getters.botObj.id,
        classifyId: "0",
        current: this.page.currentPage,
        size: this.page.pageSize,
      };
      const result = await intentList(info);
      if (result.data.code == 200) {
        // console.log(result.data);
        this.moveData = result.data.data.records;
        this.moveLoading = false;
      }
    },
  },
};
</script>
<style lang="scss" scoped></style>