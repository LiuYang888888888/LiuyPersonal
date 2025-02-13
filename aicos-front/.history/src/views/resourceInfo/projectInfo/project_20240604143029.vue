<template>
  <HuilanBasic>
    <!-- <HuilanBasicToolbar style="margin-top: 0;text-align: left;display: flex;">
      <el-button type="primary" size="small" @click="handleAdd" style="width: 69px;">新增</el-button>
      <el-upload :auto-upload="false" :show-file-list="false" action="action" :on-change="handleChange"
        style="margin-left: 20px;">
        <el-button type="primary">导入</el-button>
      </el-upload>
    </HuilanBasicToolbar> -->
    <avue-crud :option="option" :search.sync="search" :table-loading="loading" :permission="permissionList" :data="data"
      ref="crud" v-model="form" @row-del="rowDel" @row-update="rowUpdate" @row-save="rowSave" :before-open="beforeOpen"
      :page.sync="page" @selection-change="selectionChange" @search-change="searchChange"
      @current-change="currentChange" @size-change="sizeChange" @refresh-change="refreshChange" @on-load="onLoad">
    </avue-crud>

  </HuilanBasic>
</template>

<script>
import { mapGetters } from "vuex";

export default {
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
        indexLabel: '序号',
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
            label: '编号',
            span: 16,
            display: true,
            hideLabel: false,
            dataType: 'string',
            prop: 'string_bianh',
            isListDisplay: true,
            width:120,
          },
          {
            type: 'input',
            label: '项目编号',
            span: 16,
            display: true,
            hideLabel: false,
            dataType: 'string',
            prop: 'string_xiangmbh',
            isListDisplay: true,
            width:120,
          },
          {
            type: 'input',
            label: '项目名称',
            span: 16,
            display: true,
            hideLabel: false,
            dataType: 'string',
            prop: 'string_xiangmmc',
            isListDisplay: true,
            width:120,
          },
          {
            type: 'input',
            label: '项目类型',
            span: 16,
            display: true,
            hideLabel: false,
            dataType: 'string',
            prop: 'string_xiangmlx',
            isListDisplay: true,
            width:120,
          },
          {
            type: 'input',
            label: '项目阶段',
            span: 16,
            display: true,
            hideLabel: false,
            dataType: 'string',
            prop: 'string_xiangmjd',
            isListDisplay: true,
            width:120,
          },
          {
            type: 'input',
            label: '项目规模',
            span: 16,
            display: true,
            hideLabel: false,
            dataType: 'string',
            prop: 'string_xiangmgm',
            isListDisplay: true,
            width:120,
          },
          {
            type: 'input',
            label: '申报单位',
            span: 16,
            display: true,
            hideLabel: false,
            dataType: 'string',
            prop: 'string_shenbdw',
            isListDisplay: true,
            width:120,
          },
          {
            type: 'input',
            label: '所属领域',
            span: 16,
            display: true,
            hideLabel: false,
            dataType: 'string',
            prop: 'string_suosly',
            isListDisplay: true,
            width:120,
          },
          {
            type: 'input',
            label: '项目负责人',
            span: 16,
            display: true,
            hideLabel: false,
            dataType: 'string',
            prop: 'string_xiangmfzr',
            isListDisplay: true,
            width:120,
          },
          {
            type: 'input',
            label: '联合单位',
            span: 16,
            display: true,
            hideLabel: false,
            dataType: 'string',
            prop: 'string_lianhdw',
            isListDisplay: true,
            width:120,
          },
          {
            type: 'input',
            label: '主管部门',
            span: 16,
            display: true,
            hideLabel: false,
            dataType: 'string',
            prop: 'string_zhugbm',
            isListDisplay: true,
            width:120,
          },
          {
            type: 'input',
            label: '项目周期',
            span: 16,
            display: true,
            hideLabel: false,
            dataType: 'string',
            prop: 'string_xiangmzq',
            isListDisplay: true,
            width:120,
          },
          {
            type: 'date',
            label: '开始时间',
            span: 16,
            display: true,
            format: 'yyyy-MM-dd',
            valueFormat: 'yyyy-MM-dd',
            hideLabel: false,
            dataType: 'datetime',
            prop: 'datetime_kaissj',
            isListDisplay: true,
            width:120,
          },
          {
            type: 'date',
            label: '截止时间',
            span: 16,
            display: true,
            format: 'yyyy-MM-dd',
            valueFormat: 'yyyy-MM-dd',
            hideLabel: false,
            dataType: 'datetime',
            prop: 'datetime_jiezsj',
            isListDisplay: true,
            width:120,
          }
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
      if (["edit", "view"].includes(type)) {
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
