<template>
  <ThesaurusBasic v-model="curAiAppId">
    <HuilanBasicToolbar style="margin-top: 0">
      <el-button v-if="permissionList.addBtn" type="primary" size="small" @click="addChangeWord">{{
        $t('aicosCommon.addBtn') }}</el-button>
      <el-button v-if="permissionList.delBatchBtn" type="danger" size="small" @click="deleteBatchs">{{
        $t('aicosCommon.batchDeleteBtn') }}</el-button>
    </HuilanBasicToolbar>
    <HuilanBasicSearchbar :model="searchForm" :fields="searchFieldList" @reset="searchReset" @search="searchChange">
      <template v-slot:appendTool>
        <el-button type="default" @click="configColumn"><i class="el-icon-s-operation"></i></el-button>
      </template>
    </HuilanBasicSearchbar>
    <avue-crud class="variable" :table-loading="loading" :data="data" :option="option" :page.sync="page" ref="crud"
      @search-change="searchChange" @search-reset="searchReset" @refresh-change="refreshChange"
      @current-change="currentChange" @size-change="sizeChange" @selection-change="selectionChange">
      <!-- <template slot-scope="scope" slot="menu">
        <el-button
          v-if="permissionList.editBtn"
          type="text"
          icon="el-icon-edit-outline"
          size="small"
          @click.stop="rowUpdate(scope.row)"
          >编辑</el-button
        >
        <el-button
          v-if="permissionList.delBtn"
          type="text"
          icon="el-icon-delete"
          size="small"
          @click.stop="rowDel(scope.row)"
          >删除</el-button
        >
      </template> -->
      <template v-slot:menu="scope">
        <HuilanBasicActionTool :actions="getRowActions(scope.row)"
          @command="handleCommand($event, scope.row, scope.index)" />
      </template>
    </avue-crud>
    <AddForm ref="child" :curAiAppId="curAiAppId" @chilForm="prentForm"></AddForm>
  </ThesaurusBasic>
</template>

<script>
// import serviceList from "@/config/serviceList";
import AddForm from "./addForm.vue";
import { baseURL } from "@/api/common";
// const { system, ai } = serviceList;
import {
  listPage,
  aiNlpVariableDelete,
  getBasePluginById,
  deleteBatch,
} from "@/api/aiCenter/thesaurusMgr/variable";
import ThesaurusBasic from "../components/thesaurusBasic";
import { mapGetters } from "vuex";
import { getRules } from "@/util/regx";
export default {
  name: "variable",
  components: {
    ThesaurusBasic,
    AddForm,
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
        addBtn: this.vaildData(this.permission["ai-variable-add"], false),
        viewBtn: true,
        delBtn: this.vaildData(this.permission["ai-variable-del"], false),
        delBatchBtn: this.vaildData(
          this.permission["ai-variable-delBatch"],
          false
        ),
        editBtn: this.vaildData(this.permission["ai-variable-edit"], false),
      };
    },
  },
  data () {
    return {
      importForm: {},
      dialogVisible: false,
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
      searchForm: {
        variableName: "",
        variableValue: "",
      },
      searchFieldList: [
        {
          prop: "variableName",
          placeholder: this.$t('aicosCommon.pleaseInput') + this.$t("aiCenter.variable.variableWordName"),
        },
        {
          prop: "variableValue",
          placeholder: this.$t('aicosCommon.pleaseInput') + this.$t("aiCenter.variable.variableValue"),
        },
      ],
      option: {
        // title: "敏感词列表",
        tip: false,
        header: false,
        align: "left",
        border: true,
        index: true,
        menuAlign: "center",
        addBtn: false,
        addBtnText: this.$t('aicosCommon.addBtn'),
        excelBtn: false,
        excelBtnText: this.$t('aicosCommon.exportAll'),
        delBtn: false,
        editBtn: false,
        selection: true,
        searchSpan: 8,
        searchMenuSpan: 8,
        searchShow: true,
        searchLabelWidth: 100,
        menuWidth: 150,
        rowKey: "id",
        emptyText: this.$t('aicosCommon.notData'),
        searchMenuPosition: "left",
        column: [
          {
            label: this.$t("aiCenter.variable.variableWordName"),
            prop: "variableName",
            // search: true,
            type: "input",
            searchLabelWidth: 90,
            rules: [
              {
                required: true,
                message: this.$t('aicosCommon.pleaseInput') + this.$t("aiCenter.variable.variableWordName"),
                trigger: "blur",
              },
              {
                min: 1,
                max: 50,
                message: this.$t("aiCenter.variable.fiveLengthTip"),
                trigger: "blur",
              },
              ...getRules(["notchar"]),
            ],
          },
          {
            label: this.$t("aiCenter.variable.dataSources"),
            prop: "dataSources",
            search: false,
            type: "radio",
            value: "custom",
            width: 130,
            dicData: [
              {
                label: this.$t("aiCenter.variable.customValue"),
                value: "custom",
              },
              {
                label: this.$t("aiCenter.variable.pluginLibrary"),
                value: "plugin",
              },
            ],
          },
          {
            label: this.$t("aiCenter.variable.variableValue"),
            prop: "variableValue",
            // search: true,
            type: "input",
            searchLabelWidth: 90,
            rules: [
              {
                required: true,
                message: this.$t('aicosCommon.pleaseInput') + this.$t("aiCenter.variable.variableValue"),
                trigger: "blur",
              },
            ],
          },
        ],
      },
    };
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
          command: "rowUpdate",
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

      this[command](row, index);

    },
    configColumn () {
      this.$refs.crud.$refs.dialogColumn.columnBox = true;
    },
    pageList (params) {
      const self = this
      if (!this.curAiAppId) {
        this.$message.warning(this.$t("aiCenter.variable.appSelectTip"));
        return;
      }
      const parameter = {
        ...this.page,
        ...this.query,
        ...params,
        applicationId: this.curAiAppId,
      };
      listPage(parameter).then((res) => {
        const data = res.data;
        if (data.success) {
          self.data = data.data.records;
          self.page.total = data.data.total;
          self.loading = false;
        } else {
          self.$message.error(data.msg);
        }
      });
    },
    searchChange () {
      this.query = { ...this.searchForm };
      const serch = { ...this.query, current: 1 };
      this.pageList(serch);
    },
    searchReset () {
      this.query = {};
      this.pageList({ current: 1 });
    },
    refreshChange () {
      this.pageList(this.query);
    },
    currentChange (currentPage) {
      this.page.current = currentPage;
      this.pageList({ current: currentPage, ...this.query });
    },
    sizeChange (pageSize) {
      this.page.size = pageSize;
      this.page.current = 1;
      this.pageList({ size: pageSize, current: 1, ...this.query });
    },
    rowDel (row) {
      if (!this.curAiAppId) {
        this.$message.error(this.$t("aiCenter.variable.appEmptyTip"));
        return;
      }
      this.$confirm(this.$t("aicosCommon.mutiDeleteConfirmTip"), {
        confirmButtonText: this.$t("aicosCommon.confirmBtn"),
        cancelButtonText: this.$t("aicosCommon.cancelBtn"),
        type: "warning"
      }).then(() => {
        aiNlpVariableDelete({
          id: row.id,
          applicationId: this.curAiAppId,
        }).then(() => {
          this.pageList();
          this.$message({
            type: "success",
            message: this.$t("aicosCommon.deleteSuccessTip"),
          });
        });
      });
    },
    rowView (row) {
      const scope = this;
      this.$refs.child.dialogVisible = true;
      let parmas = null;
      if (row.pluginId) {
        getBasePluginById({ id: row.pluginId }).then((res) => {
          parmas = {
            ...row,
            requestType: res.data.data.requestType,
            pluginName: res.data.data.pluginName,
          };
          scope.$refs.child.prentParentCtrView(parmas);
        });
      } else {
        parmas = row;
        scope.$refs.child.prentParentCtrView(parmas);
      }
    },
    rowUpdate (row) {
      const scope = this;
      this.$refs.child.dialogVisible = true;
      let parmas = null;
      if (row.pluginId) {
        getBasePluginById({ id: row.pluginId }).then((res) => {
          parmas = {
            ...row,
            requestType: res.data.data.requestType,
            pluginName: res.data.data.pluginName,
          };
          scope.$refs.child.prentParentCtr(parmas);
        });
      } else {
        parmas = row;
        scope.$refs.child.prentParentCtr(parmas);
      }
    },
    selectionChange (list) {
      this.selectionList = list.map((v) => {
        return v.id;
      });
    },
    addChangeWord () {
      this.$refs.child.dialogVisible = true;
      this.$refs.child.flagEidtOrAdd = "add";
      this.$refs.child.title = this.$t("aiCenter.variable.addVariableWords");
      this.$refs.child.form = {
        variableName: null,
        dataSources: "custom",
        variableValue: null,
        pluginName: null,
        returnParams: null,
        requestContenttype: null,
        pluginId: null,
      };
      // if (this.$refs.child.clearForm) {
      //   this.$refs.child.clearForm();
      // }
    },
    prentForm () {
      this.pageList();
    },
    deleteBatchs () {
      if (this.selectionList.length <= 0) {
        this.$message.error(this.$t("aicosCommon.chooseDataTip"));
        return;
      }

      this.$confirm(this.$t("aicosCommon.mutiDeleteConfirmTip"), {
        confirmButtonText: this.$t("aicosCommon.confirmBtn"),
        cancelButtonText: this.$t("aicosCommon.cancelBtn"),
        type: "warning"
      }).then(() => {
        this.loading = true;
        deleteBatch({
          id: this.selectionList.join(","),
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
.variable {
  // height: 77vh;
}
</style>
