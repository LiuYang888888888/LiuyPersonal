<template>
  <div>
    <HuilanBasicToolbar style="margin-top: 0">
      <el-button size="small" type="primary" @click="exportBatchs" class="kw-btn-blue">{{ $t('aicosCommon.batchExport') }}
      </el-button>
    </HuilanBasicToolbar>
    <avue-crud :option="option" :table-loading="loading" :data="data" ref="crud" :page.sync="page" v-model="form"
      @selection-change="selectionChange" @current-change="currentChange" @size-change="sizeChange" @on-load="onLoad">
    </avue-crud>
  </div>
</template>
<script>
import {
  taskBatchList,
  exportTaskBatch,
} from "@/api/kwKnowledgeCenter/knowledgeBatchTest/index";
import { mapGetters } from "vuex";
import { getTextWidth } from "@/util/util";
export default {
  props: {
    rowData: {
      type: Object,
      default: () => {
        return {};
      },
    },
  },
  data () {
    return {
      // 表格
      option: {
        addBtn: false,
        editBtn: false,
        delBtn: false,
        columnBtn: false,
        refreshBtn: false,
        selection: true,
        header: false,
        tip: false,
        menu: false,
        emptyText: this.$t('aicosCommon.notData'),
        column: [
          {
            label: this.$t('knowledgeBatchTest.testRound'),
            prop: "taskSeq",
          },
          {
            label: this.$t('knowledgeBatchTest.totalTestAmount'),
            prop: "taskTotal",
            formatter: (val, value, label) => {
              if (this.validatenull(value)) {
                return "--";
              }
              return label;
            },
          },
          {
            label: this.$t('knowledgeBatchTest.knowledgeRate'),
            prop: "perfectMatch",
            formatter: (val, value, label) => {
              if (val.matchNum === null || val.matchRatio === null) {
                return "--";
              }
              return label;
            },
          },
          {
            label: this.$t('knowledgeBatchTest.intentionRate'),
            prop: "intentMatch",
            formatter: (val, value, label) => {
              if (val.intentNum === null || val.intentRatio === null) {
                return "--";
              }
              return label;
            },
          },
          {
            label: this.$t('knowledgeBatchTest.perfectRate'),
            prop: "replyMatch",
            formatter: (val, value, label) => {
              if (val.completeNum === null || val.completeRatio === null) {
                return "--";
              }
              return label;
            },
          },
          {
            label: this.$t('knowledgeBatchTest.annotationQuantity'),
            prop: "labelNum",
          },
          {
            label: this.$t('knowledgeBatchTest.knowledgeVolume'),
            prop: "createNum",
          },
        ],
      },
      loading: false,
      form: {},
      page: {
        current: 1,
        size: 10,
        total: 0,
      },
      selectionList: [],
      data: [],
    };
  },
  computed: {
    // 计算属性
    ...mapGetters(["permission", "language"]),
    permissionList () {
      return {
        exportBtn: this.vaildData(
          this.permission[`robot-knowledgeBatchTest-taskBatchExport`]
        ),
      };
    },
  },
  mounted () { },
  methods: {
    // 批量导出
    exportBatchs () {
      if (this.selectionList.length === 0) {
        this.$message.warning(this.$t('knowledgeBatchTest.selectExportTips'));
        return;
      }
      let obj = {
        taskId: this.rowData.id,
        taskBatchId: this.selectionList.map((item) => item.id).join(","),
      };
      exportTaskBatch(obj)
        .then((res) => {
          this.downFile(
            res.data,
            this.$t('knowledgeBatchTest.testStatisticsExport') + new Date().getTime() + ".xls"
          );
        })
        .catch(() => {
          this.$message.error(this.$t('knowledgeBatchTest.exportFailed'));
        });
    },
    selectionChange (list) {
      this.selectionList = list;
    },
    currentChange (currentPage) {
      this.page.currentPage = currentPage;
    },
    sizeChange (pageSize) {
      this.page.pageSize = pageSize;
    },
    onLoad () {
      this.loading = true;
      let obj = {
        size: this.page.pageSize,
        current: this.page.currentPage,
        taskId: this.rowData.id,
      };
      taskBatchList(obj).then((res) => {
        if (res.data.success) {
          this.page.current = res.data.data.current;
          this.page.total = res.data.data.total;
          this.data = res.data.data.records;
          this.data.map((item) => {
            item.perfectMatch = item.matchNum + " / " + item.matchRatio + "%";
            item.intentMatch = item.intentNum + " / " + item.intentRatio + "%";
            item.replyMatch =
              item.completeNum + " / " + item.completeRatio + "%";
          });
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
          this.loading = false;
        }
      });
    },
    configColumn () {
      this.$refs.crud.$refs.dialogColumn.columnBox = true;
    },
  },
};
</script>
<style lang="scss" scoped></style>
