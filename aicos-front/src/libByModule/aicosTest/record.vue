<template>
  <div class="page-view-main">
    <HuilanBasic>
      <HuilanBasicToolbar style="margin-top: 0">
        <el-button type="primary" size="small" v-if="true" @click.stop="addRow"
          >新增</el-button
        >
      </HuilanBasicToolbar>

      <QSGSearchBar
        :formData="searchForm"
        :fields="listOption"
        @search="searchChange"
        @refresh="refreshChange"
        @reset="searchReset"
        ref="searchFormRef"
        :key="searchBarkey"
      >
        <template v-slot:appendTool>
          <el-button type="default" @click="configColumn"
            ><i class="el-icon-s-operation"></i
          ></el-button>
        </template>
      </QSGSearchBar>

      <avue-crud
        :option="listOption"
        :table-loading="loading"
        :data="listData"
        ref="listRef"
        key="listkey"
        v-model="listForm"
        :page.sync="page"
        :permission="permissionList"
        :before-open="beforeOpen"
        :before-close="beforeClose"
        @row-del="rowDel"
        @row-update="rowUpdate"
        @row-save="rowSave"
        @search-change="searchChange"
        @search-reset="searchReset"
        @selection-change="selectionChange"
        @current-change="currentChange"
        @size-change="sizeChange"
        @refresh-change="refreshChange"
        @on-load="onLoad"
        @tab-click="crudUpdateTabClick"
        :upload-after="uploadAfter"
        :upload-before="uploadBefore"
        :upload-error="uploadError"
        :upload-delete="uploadDelete"
        :upload-preview="uploadPreview"
      >
        <template slot-scope="scope" slot="menu">
          <el-button
            type="text"
            size="small"
            @click.stop="viewRow(scope.row, scope.index)"
            v-if="true"
            >查看
          </el-button>
          <el-button
            type="text"
            size="small"
            @click.stop="updateRow(scope.row, scope.index)"
            v-if="true"
            >编辑
          </el-button>
          <el-button
            type="text"
            size="small"
            @click.stop="deleteRow(scope.row, scope.index)"
            v-if="true"
            >删除
          </el-button>
        </template>
      </avue-crud>
    </HuilanBasic>
    <el-drawer
      title="升级"
      :visible.sync="upgradeShow"
      direction="rtl"
      :size="600"
      :before-close="handleClose"
    >
      <div class="upgrade_box">
        <p>当前版本：数据50W+</p>
        <p>最新版本：数据80W+</p>
        <div>
          <el-button
            type="primary"
            size="small"
            style="margin-top: 20px"
            v-if="true"
            @click.stop="upgradeSave"
            icon="el-icon-upload2"
            >升 级</el-button
          >
        </div>
      </div>
    </el-drawer>
  </div>
</template>

<script>
import { listData2 } from "./data";
import { cloneDeep } from "lodash";
import QSGSearchBar from "@/components/QSGSearchBar/index";
import { isNull } from "@/util/qsgCommon.js";

export default {
  name: "pageView",
  components: {
    QSGSearchBar,
  },
  props: {},
  data() {
    return {
      upgradeShow: false, // 升级弹窗
      page: {
        pageSize: 10,
        currentPage: 1,
        total: 0,
        pageSizes: [10, 20, 30, 40, 50, 100],
      },
      listkey: 0,
      searchForm: {},
      loading: true,
      selectionList: [],
      query: {},
      listData: [],
      listOption: {
        header: false,
        tip: false,
        searchShow: false,
        border: false,
        index: true,
        selection: true,
        viewBtn: false,
        delBtn: false,
        editBtn: false,
        columnBtn: true,
        menuWidth: 150,
        menuAlign: "center",
        menuFixed: "right",
        dialogWidth: "600px",
        dialogType: "drawer",
        dialogClickModal: false,
        dialogCustomClass: "huilan-drawer-form",
        span: 24,
        labelWidth: 100,
        column: [
          {
            label: "问题",
            prop: "question",
            overHidden: true,
            hide: false,
            search: true,
            searchType: "input",
            fieldType: "string",
          },
          {
            label: "答案",
            prop: "answer",
            overHidden: true,
            hide: false,
            search: true,
            searchType: "input",
            fieldType: "string",
          },
          {
            label: "知识状态",
            prop: "status",
            overHidden: true,
            hide: false,
            search: true,
            searchType: "select",
            fieldType: "string",
            type: "radio",
            dicData: [
              { label: '未发布', value: '1'},
              { label: '已发布', value: '2' },
            ],
            addDisplay: false,
            editDisplay: false
          },
          {
            label: "审核状态",
            prop: "audit",
            overHidden: true,
            hide: false,
            search: true,
            searchType: "select",
            fieldType: "string",
            type: "radio",
            dicData: [
              { label: '审核中', value: '1'},
              { label: '审核完成', value: '2' },
              { label: '驳回', value: '3' },
            ],
            addDisplay: false,
            editDisplay: false
          },
          {
            label: "启用状态",
            prop: "enable",
            overHidden: true,
            hide: false,
            search: true,
            searchType: "select",
            fieldType: "string",
            type: "radio",
            dicData: [
              { label: '启用', value: '1'},
              { label: '停用', value: '2' },
            ],
            addDisplay: false,
            editDisplay: false
          },
          {
            label: "创建时间",
            prop: "createTime",
            overHidden: true,
            hide: false,
            search: false,
            searchType: "input",
            fieldType: "string",
            addDisplay: false,
            editDisplay: false,
          },
        ],
      },
    };
  },
  watch: {},
  created() {},
  methods: {
    successFun() {
      this.$message({
        type: "success",
        message: "操作成功",
      });
    },

    configColumn() {
      this.$refs.listRef.$refs.dialogColumn.columnBox = true;
    },
    // 查看
    viewRow(row, index) {
      this.$refs.listRef.rowView(row, index);
    },
    // 新增
    addRow() {
      this.$refs.listRef.rowAdd();
    },
    // 编辑
    updateRow(row, index) {
      this.$refs.listRef.rowEdit(row, index);
    },
    // 删除
    deleteRow(row, index) {
      this.$confirm("确定将选择数据删除?", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          this.listData = this.listData.filter((item, idx) => idx !== index);
          this.successFun();
          this.refreshChange();
        })
        .catch(() => {
          window.console.log("操作已取消");
        });
    },
    // 升级
    upgradeRow(row, index) {
      this.upgradeShow = true;
    },
    // 关闭升级抽屉
    handleClose() {
      this.upgradeShow = false;
    },
    // 抽屉内升级按钮
    upgradeSave() {
      setTimeout(() => {
        this.successFun();
      }, 500);
    },
    // 测试
    goTest() {
      this.$router.push({
        path: "/test",
        // query: {
        //   projectId: id
        // }
      });
    },
    batchDeleteRows() {
      if (this.selectionList.length == 0) {
        this.$message({
          type: "warning",
          message: "请选择需要处理的数据",
        });
      } else {
        this.$confirm(
          "确认是否删除 " + this.selectionList.length + " 条数据？",
          "提示",
          {
            confirmButtonText: "确定",
            cancelButtonText: "取消",
            type: "warning",
          }
        ).then(() => {
          const selectIds = this.selectionList.map((item) => item.id);

          batchDelList({ ids: selectIds.join() }).then(
            (/*res*/) => {
              this.refreshChange();
              this.successFun();
            },
            (error) => {
              window.console.log(error);
            }
          );
        });
      }
    },
    // 新增 --- 接口
    rowSave(row, done, loading) {
      const dataParam = {
        ...row,
      };
      setTimeout(() => {
        this.listData.unshift(dataParam);
        this.successFun();
        done();
      }, 500);
    },
    // 编辑 --- 接口
    rowUpdate(row, index, done, loading) {
      const dataParam = {
        ...row,
      };
      setTimeout(() => {
        this.listData = this.listData.map((item, idx) => {
          if (idx == index) {
            item = dataParam;
          }
          return item;
        });
        this.successFun();
        done();
      }, 500);
    },
    searchReset() {
      this.query = {};
      this.searchForm = {};
      this.onLoad(this.page);
    },
    searchChange(params, done) {
      this.query = {
        ...params,
      };
      this.searchForm = this.query;
      this.page.currentPage = 1;
      this.onLoad(this.page, params);
      done();
    },
    selectionChange(list) {
      this.selectionList = list;
    },
    selectionClear() {
      this.selectionList = [];
    },

    cutProps(opt) {
      opt.column.map((item) => {
        if (!isNull(item.props)) {
          item.props.value = item.props.label;
        }
      });

      if (!isNull(opt.group)) {
        opt.group.map((item) => {
          if (!isNull(item.column)) {
            item.column.map((tobj) => {
              if (!isNull(tobj.props)) {
                tobj.props.value = tobj.props.label;
              }
            });
          }
        });
      }

      return opt;
    },

    beforeOpen(done, type) {
      this.handleType = type;

      this.initData(type);
      done();
    },
    beforeClose(done) {
      this.refreshChange();
      done();
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

    initData(/*type*/) {
      // console.log('initData',type);
      // console.log('this.listForm',this.listForm);
    },

    onLoad(page, params = {}) {
      this.loading = true;
      setTimeout(() => {
        this.page.total = this.listData.length;
        this.loading = false;
      }, 500);
    },
  },
  mounted() {
    this.listData = cloneDeep(listData2);
    this.page = {
      pageSize: 10,
      currentPage: 1,
      total: 0,
      pageSizes: [10, 20, 30, 40, 50, 100],
    };
  },
};
</script>

<style lang="scss" scoped>
::v-deep .el-drawer__header {
  border-bottom: 1px solid #f0f0f0;
  font-size: 18px;
  font-weight: 500;
  padding: 16px 10px 16px 24px;
}
.upgrade_box{
  display: flex;
  flex-direction: column;
  align-items: center;
  font-size: 14px;
  color: #565863;
  line-height: 40px;
}
.page-view-main {
  height: 100vh;
  overflow: hidden;
}
</style>
