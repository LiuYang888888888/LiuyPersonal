<template>
  <ThesaurusBasic v-model="curAiAppId">
    <HuilanBasicToolbar style="margin-top: 0">
      <el-button v-if="permissionList.addBtn" type="primary" size="small" @click="handleAdd">{{ $t("aicosCommon.addBtn")
      }}</el-button>
      <el-button v-if="permissionList.delBatchBtn" type="danger" size="small" @click="deleteBatchs">{{
        $t("aicosCommon.batchDeleteBtn") }}</el-button>
    </HuilanBasicToolbar>
    <HuilanBasicSearchbar :model="searchForm" :fields="searchFieldList" @reset="searchReset" @search="searchChange">
      <template v-slot:appendTool>
        <el-button type="default" @click="configColumn"><i class="el-icon-s-operation"></i></el-button>
      </template>
    </HuilanBasicSearchbar>
    <avue-crud class="occurrence" :table-loading="loading" :data="data" ref="crud" :option="option" :page.sync="page"
      :permission="permissionList" :before-open="beforeOpen" @row-save="rowSave" @search-change="searchChange"
      @search-reset="searchReset" @refresh-change="refreshChange" @current-change="currentChange"
      @size-change="sizeChange" @row-del="rowDel" @row-update="rowUpdate" @selection-change="selectionChange">
      <!-- <template slot="menuLeft">
          <el-button
            type="primary"
            size="small"
            @click="importDialogVisible = true"
            >自动生成</el-button
          >
        </template> -->
      <!-- <template slot="menuLeft">
          <el-button
            type="primary"
            size="small"
            @click="importDialogVisible = true"
            >手动刷新</el-button
          >
        </template> -->
      <template v-slot:menu="scope">
        <HuilanBasicActionTool :actions="getRowActions(scope.row)"
          @command="handleCommand($event, scope.row, scope.index)" />
      </template>
    </avue-crud>
  </ThesaurusBasic>
</template>

<script>
import { baseURL, getDictItemListByDictCodeURL } from "@/api/common";

import {
  save,
  listByPage,
  properDelete,
  properUpdate,
  deleteBatch,
} from "@/api/aiCenter/thesaurusMgr/occurrence";
import ThesaurusBasic from "../components/thesaurusBasic";
import { mapGetters } from "vuex";
import { getRules } from "@/util/regx";
import { getDictItemListByDictCode } from "@/api/configure/application";
export default {
  name: "occurrence",
  components: {
    ThesaurusBasic,
  },
  watch: {
    curAiAppId (newVal) {
      if (newVal) {
        this.pageList({ applicationId: newVal });
      }
    },
  },
  computed: {
    ...mapGetters(["permission", 'language']),
    permissionList () {
      return {
        addBtn: this.vaildData(this.permission["ai-occurrence-add"], false),
        viewBtn: true,
        delBtn: this.vaildData(this.permission["ai-occurrence-del"], false),
        delBatchBtn: this.vaildData(
          this.permission["ai-occurrence-delBatch"],
          false
        ),
        editBtn: this.vaildData(this.permission["ai-occurrence-edit"], false),
      };
    },
  },
  data () {
    return {
      selectionList: [],
      loading: true,
      curAiAppId: "",
      page: {
        size: 10,
        pageSizes: [10, 30, 50, 100, 200],
        current: 1,
        total: 0,
      },
      query: {},
      data: [],
      option: {
        // title: "敏感词列表",
        tip: false,
        align: "left",
        header: false,
        border: true,
        index: true,
        menuAlign: "center",
        addBtn: false,
        addBtnText: this.$t("aicosCommon.addBtn"),
        excelBtn: false,
        excelBtnText: this.$t("aicosCommon.exportAll"),
        delBtn: false,
        editBtn: false,
        selection: true,
        menuWidth: 150,
        searchMenuPosition: "left",
        searchSpan: 6,
        searchMenuSpan: 6,
        rowKey: "id",
        dialogWidth: "40%",
        dialogType: "drawer",
        dialogCustomClass: "huilan-drawer-form",
        emptyText: this.$t('aicosCommon.notData'),
        column: [
          {
            label: this.$t('aiCenter.occurrence.word'),
            prop: "word",
            // search: true,
            type: "input",
            searchLabelWidth: 30,
            span: 24,
            rules: [
              {
                required: true,
                message: this.$t("aicosCommon.pleaseInput") + this.$t('aiCenter.occurrence.word'),
                trigger: "blur",
              },
              {
                min: 1,
                max: 50,
                message: this.$t('aiCenter.occurrence.fiveLengthTips'),
                trigger: "blur",
              },
              ...getRules(["charNumHanEnterComma"]),
            ],
          },
          {
            label: this.$t('aiCenter.occurrence.type'),
            prop: "wordType",
            // search: true,
            display: true,
            // hide: true,
            type: "select",
            align: "center",
            searchLabelWidth: 60,
            span: 24,
            dicUrl: getDictItemListByDictCodeURL,
            dicMethod: "post",
            dicQuery: {
              code: "ai-aiCenter-thesaurusMgr-pinyin-type",
            },
            value: "人工编辑",
            width: "120",
            props: {
              label: "name",
              value: "value",
            },
          },
          {
            label: this.$t('aiCenter.occurrence.createTime'),
            prop: "createTime",
            search: false,
            display: false,
            align: "center",
            //type: "daterange",
            //format: "yyyy-MM-dd HH:MM:ss",
            //valueFormat: "yyyy-MM-dd HH:MM:ss",
            width: "220",
            span: 24,
          },
          {
            label: this.$t('aiCenter.occurrence.remark'),
            prop: "remark",
            search: false,
            display: true,
            hide: true,
            type: "input",
            span: 24,
            rules: [
              {
                min: 1,
                max: 50,
                message: this.$t('aiCenter.occurrence.fiveLengthTips'),
                trigger: "blur",
              },
              ...getRules(["charNumHanEnterComma"]),
            ],
          },
        ],
      },
      searchForm: {
        word: "",
        wordType: "",
      },
      searchFieldList: [
        {
          prop: "word",
          placeholder: this.$t("aicosCommon.pleaseInput") + this.$t('aiCenter.occurrence.word'),
        },
        {
          prop: "wordType",
          type: "select",
          placeholder: this.$t("aicosCommon.pleaseSelect") + this.$t('aiCenter.occurrence.type'),
          dicData: [],
        },
      ],
    };
  },
  mounted () {
    getDictItemListByDictCode({
      code: "ai-aiCenter-thesaurusMgr-pinyin-type",
    }).then((res) => {
      const data = res.data;
      if (data.success) {
        this.searchFieldList[1].dicData = data.data;
        this.searchFieldList[1].dicData.map((item) => {
          item.label = item.name;
        });
      }
    });
  },
  methods: {
    getRowActions (row) {
      const map = {
        viewBtn: {
          name: this.$t("aicosCommon.viewBtn"),
          command: "rowView",
        },
        delBtn: {
          name: this.$t('aicosCommon.delBtn'),
          command: "rowDel",
        },
        editBtn: {
          name: this.$t("aicosCommon.editBtn"),
          command: "rowEdit",
        },
      };
      const list = ["viewBtn"];
      if (baseURL.replace(/^\/+|\/+$/g, '').toLowerCase() == 'aicos') {
        if (row.subapplicationId == null || row.subapplicationId.toLowerCase() == baseURL.replace(/^\/+|\/+$/g, '').toLowerCase() || row.subapplicationId == '') {
          list.push("editBtn", "delBtn")
        }
      } else if (row.subapplicationId) {
        if (row.subapplicationId.toLowerCase() == baseURL.replace(/^\/+|\/+$/g, '').toLowerCase()) {
          list.push("editBtn", "delBtn")
        }
      }
      const actions = [];
      list.forEach((item) => {
        if (this.permissionList[item]) {
          actions.push(map[item]);
        }
      });
      return actions;
    },
    handleCommand (command, row, index) {
      console.log('row', row)
      const crud = this.$refs.crud;
      const cruddActions = ["rowView", "rowEdit", "rowDel"];
      if (cruddActions.includes(command)) {
        crud[command](row, index);
      } else {
        this[command](row, index);
      }
    },
    handleAdd () {
      this.$refs.crud.rowAdd();
    },
    configColumn () {
      this.$refs.crud.$refs.dialogColumn.columnBox = true;
    },
    pageList (params) {
      if (!this.curAiAppId) {
        this.$message.error(this.$t('aiCenter.occurrence.appSelectTip'));
        return;
      }
      const parameter = {
        ...this.page,
        ...this.query,
        ...params,
        applicationId: this.curAiAppId,
        ...this.searchForm,
      };
      listByPage(parameter).then((res) => {
        const data = res.data;
        if (data.success) {
          this.data = data.data.records;
          this.page.total = data.data.total;
          this.page.pageSize = data.data.size;
          this.page.currentPage = data.data.current;
          this.loading = false;
        } else {
          this.$message.error(data.msg);
        }
      });
    },
    rowSave (row, done, loading) {
      delete row.createTime;
      row = { ...row, applicationId: this.curAiAppId };
      save(row).then(
        (res) => {
          // this.onLoad(this.page);
          if (res.data.success) {
            this.$message({
              type: "success",
              message: this.$t("aicosCommon.successOperate"),
            });
            this.pageList({ applicationId: this.curAiAppId });
            done();
          } else {
            this.$message({
              type: "error",
              message: res.data.msg,
            });
            loading();
          }
        },
        (error) => {
          window.console.log(error);
          loading();
        }
      );
    },
    searchChange (params,) {
      this.query = params;
      const serch = { ...params, current: 1 };
      this.pageList(serch);
      // done();
    },
    searchReset () {
      this.query = {};
      this.page.current = 1;
      this.pageList({ current: 1 });
    },
    refreshChange () {
      this.pageList(this.query);
    },
    currentChange (currentPage) {
      this.page.current = currentPage;
      this.pageList({ current: currentPage });
    },
    sizeChange (pageSize) {
      this.page.size = pageSize;
      this.page.current = 1;
      this.pageList({ size: pageSize, current: 1 });
    },
    beforeOpen (done, type) {
      this.option.labelPosition = this.language != "zh" && type != 'view' ? "top" : "right";
      done();
    },
    rowDel (row, index, done) {
      if (!this.curAiAppId) {
        this.$message.error(this.$t('aiCenter.occurrence.appEmptyTip'));
        return;
      }
      this.$confirm(this.$t("aicosCommon.mutiDeleteConfirmTip"), {
        confirmButtonText: this.$t("aicosCommon.confirmBtn"),
        cancelButtonText: this.$t("aicosCommon.cancelBtn"),
        type: "warning",
      }).then(() => {
        properDelete({ pointId: row.id, applicationId: this.curAiAppId }).then(
          () => {
            this.pageList();
            this.$message({
              type: "success",
              message: this.$t("aicosCommon.successOperate"),
            });
            done();
          }
        );
      });
    },
    rowUpdate (row, index, done, loading) {

      const params = {
        // HuilanAiNlpKnowledgePointWordVO: {
        ...row,
        applicationId: this.curAiAppId,
        pointId: row.id,
        // }
      };
      properUpdate(params).then(
        () => {
          this.$message({
            type: "success",
            message: this.$t("aicosCommon.successOperate"),
          });
          this.pageList();
          done();
        },
        (error) => {
          window.console.log(error);
          loading();
        }
      );
    },
    selectionChange (list) {
      this.selectionList = list.map((v) => {
        return v.id;
      });
    },
    deleteBatchs () {
      if (this.selectionList.length <= 0) {
        this.$message.warning(this.$t("aicosCommon.chooseDataTip"));
        return;
      }

      this.$confirm(this.$t("aicosCommon.mutiDeleteConfirmTip"), {
        confirmButtonText: this.$t("aicosCommon.confirmBtn"),
        cancelButtonText: this.$t("aicosCommon.cancelBtn"),
        type: "warning",
      }).then(() => {
        this.loading = true;
        deleteBatch({
          pointId: this.selectionList.join(","),
          applicationId: this.curAiAppId,
        }).then((res) => {
          const data = res.data;
          if (data.success) {
            this.pageList(this.query);
            this.$message.success(this.$t("aicosCommon.deleteSuccessTip"));
            this.loading = false;
          } else {
            this.$message.error(data.msg);
          }
        });
      })

    },
  },
};
</script>

<style scoped lang="scss">
.occurrence {}
</style>
