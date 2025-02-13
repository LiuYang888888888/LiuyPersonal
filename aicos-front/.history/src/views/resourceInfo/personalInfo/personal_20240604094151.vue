<template>
  <HuilanBasic>
    <HuilanBasicToolbar style="margin-top: 0;text-align: left;display: flex;">
      <el-button type="primary" size="small" @click="handleAdd" style="width: 69px;">新增</el-button>
      <el-upload :auto-upload="false" :show-file-list="false" action="action" :on-change="handleChange"
        style="margin-left: 20px;">
        <el-button type="primary">导入</el-button>
      </el-upload>
    </HuilanBasicToolbar>
    <avue-crud :option="option" :search.sync="search" :table-loading="loading" :permission="permissionList" :data="data"
      ref="crud" v-model="form" @row-del="rowDel" @row-update="rowUpdate" @row-save="rowSave" :before-open="beforeOpen"
      :page.sync="page" @selection-change="selectionChange" @search-change="searchChange"
      @current-change="currentChange" @size-change="sizeChange" @refresh-change="refreshChange" @on-load="onLoad">
    </avue-crud>

  </HuilanBasic>
</template>

<script>
import {
  getList,
  remove,
  update,
  getUserAllInfo,
  enableStatus,
  lockStatus,
  resetPassword,
  getBaseUserByAccount,
} from "@/api/system/user";
import { mapGetters } from "vuex";
import departmentAuthorityTree from "@/components/TreeSelect/departmentAuthorityTree";
import TreeSelect from "@/components/TreeSelect";
import { isNull } from "@/util/qsgCommon.js";
import OptOrgCommon from "@/views/optOrg/OptOrgCommon";

export default {
  components: {
    departmentAuthorityTree,
    OptOrgCommon,
    TreeSelect,
  },
  data () {
    return {
      shencha: false,
      form: {},
      isManager: false,
      search: {},
      selectionList: [],
      query: {},
      loading: true,
      page: {
        pageSize: 10,
        currentPage: 1,
        total: 0,
      },
      init: {
        roleTree: [],
        deptTree: [],
      },
      treeDeptId: "0",
      treeDeptName: "部门目录",
      option: {
        header: false,
        tip: false,
        searchShow: false,
        border: true,
        align: 'center',
        menuAlign: 'center',
        index: true,
        indexLabel: '编号',
        indexWidth: 100,
        selection: false,
        addBtn: false,
        viewBtn: true,
        delBtn: true,
        searchMenuSpan: 4,
        menu: false,
        menuWidth: 300,
        column: [
          {
            type: 'input',
            label: '姓名',
            span: 16,
            display: true,
            hideLabel: false,
            dataType: 'string',
            prop: 'string_xingm',
            isListDisplay: true,
            width: 200,
            labelWidth: 80,
          },
          {
            type: 'select',
            label: '性别',
            dicData: [
              {
                label: '男',
                value: '0'
              },
              {
                label: '女',
                value: '1'
              }
            ],
            cascaderItem: [],
            span: 24,
            display: true,
            props: {
              label: 'label',
              value: 'value'
            },
            hideLabel: false,
            dataType: 'string',
            prop: 'string_xingb',
            isListDisplay: true,
            search: true
          },
          {
            label: "身份证号",
            prop: "roles",
            width: 200,
            row: true,
            labelWidth: 80,
            labelPosition: 'left',
          },
          {
            label: "民族",
            prop: "mobile",
            search: true,
            width: 200,
            row: true,
            labelWidth: 80,
            labelPosition: 'left',
          },
          {
            label: "出生年月",
            prop: "status",
            width: 200,
            row: true,
            labelWidth: 80,
            labelPosition: 'left',
          },
          {
            label: "籍贯",
            prop: "isLock",
            type: "select",
            width: 100,
            row: true,
            labelWidth: 80,
            labelPosition: 'left',
          },
          {
            label: "学历",
            prop: "realName",
            width: 200,
            row: true,
            labelWidth: 80,
            labelPosition: 'left',
          },
          {
            label: "学位",
            prop: "realName",
            width: 200,
            row: true,
            labelWidth: 80,
            labelPosition: 'left',
          },
          {
            label: "专业",
            prop: "realName",
            slot: true,
            width: 200,
            row: true,
            labelWidth: 80,
            labelPosition: 'left',
          },
          {
            label: "毕业院校",
            prop: "",
            width: 200,
            row: true,
            labelWidth: 80,
            labelPosition: 'left',
          },
          {
            label: "职称",
            prop: "",
            width: 150,
            row: true,
            labelWidth: 80,
            labelPosition: 'left',
          },
          {
            label: "手机",
            prop: "",
            width: 150,
            row: true,
            labelWidth: 80,
            labelPosition: 'left',
          },
          {
            label: "单位类型",
            prop: "",
            width: 100,
            row: true,
            labelWidth: 80,
            labelPosition: 'left',
          },
          {
            label: "工作单位",
            prop: "",
            width: 100,
            row: true,
            labelWidth: 80,
            labelPosition: 'left',
          },
          {
            label: "职务",
            prop: "",
            slot: true,
            width: 100,
            row: true,
            labelWidth: 80,
            labelPosition: 'left',
          },
          {
            label: "是否涉密人员",
            prop: "",
            slot: true,
            width: 180,
            row: true,
            labelWidth: 120,
            labelPosition: 'left',
          },
        ],

      },
      data: [],
      treeItemId: "0",
    };
  },
  watch: {},
  computed: {
    ...mapGetters(["permission"]),
    permissionList () {
      return {

      };
    },
  },
  mounted () { },
  methods: {
    initData () {
      this.form.deptId = this.treeDeptId;
      this.form.deptName = this.treeDeptName;
    },
    /*导入*/
    handleChange (file, fileLis) {
      this.$Export.xlsx(file.raw)
        .then(data => {
          this.form = data.results;
        })
    },

    rowSave (row, done, loading) {
      add(row).then(
        () => {
          // this.initFlag = false;
          this.onLoad(this.page);
          this.$message({
            type: "success",
            message: "操作成功!",
          });
          done();
        },
        (error) => {
          window.console.log(error);
          loading();
        }
      );
    },
    rowUpdate (row, index, done, loading) {
      update(row).then(
        () => {
          // this.initFlag = false;
          this.onLoad(this.page);
          this.$message({
            type: "success",
            message: "操作成功!",
          });
          done();
        },
        (error) => {
          window.console.log(error);
          loading();
        }
      );
    },
    rowDel (row) {
      this.$confirm("确定将选择数据删除?", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          return remove(row.id);
        })
        .then(() => {
          this.onLoad(this.page);
          this.$message({
            type: "success",
            message: "操作成功!",
          });
        });
    },



    searchChange (params, done) {
      this.query = params
      this.page.currentPage = 1;
      this.onLoad(this.page, params);
      done();
    },
    selectionChange (list) {
      this.selectionList = list;
    },
    async beforeOpen (done, type) {
      if (["add", "edit", "view"].includes(type)) {
        this.initData();
      }
      done();
    },
    currentChange (currentPage) {
      this.page.currentPage = currentPage;
    },
    sizeChange (pageSize) {
      this.page.pageSize = pageSize;
    },
    refreshChange () {
      this.onLoad(this.page, this.query);
    },
    onLoad (page, params, treeItemId) {
      if (!treeItemId) {
        treeItemId = this.treeDeptId;
      }
      var obj = {
        ...this.query,
      };
      this.loading = false;
      // getList(this.page.currentPage, this.page.pageSize, obj, treeItemId).then(
      //   (res) => {
      //     const data = res.data.data;
      //     this.page.total = data.total;
      //     this.data = data.records;
      //     this.loading = false;
      //   }
      // );
    },
    handleAdd () {
      this.$refs.crud.rowAdd();
    },
  },
};
</script>

<style lang="scss">
.box {
  height: 800px;
}

.box .el-scrollbar {
  height: 100%;
}

.box .el-scrollbar__wrap {
  overflow: scroll;
}
</style>
