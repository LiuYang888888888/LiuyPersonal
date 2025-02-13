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
        searchShow: true,
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
        menuWidth: 200,
        column: [
          {
            type: 'input',
            label: '单位名称',
            span: 16,
            width:200,
            display: true,
            hideLabel: false,
            dataType: 'string',
            prop: 'string_danwmc',
            isListDisplay: true,
          },
          {
            type: 'textarea',
            label: '单位概况',
            span: 16,
            width:200,
            display: true,
            hideLabel: false,
            dataType: 'string',
            prop: 'string_danwgk',
            isListDisplay: true,
          },
          {
            type: 'input',
            label: '法人',
            span: 16,
            width:80,
            display: true,
            hideLabel: false,
            dataType: 'string',
            prop: 'string_far',
            isListDisplay: true,
          },
          {
            type: 'input',
            label: '联系人',
            span: 16,
            display: true,
            hideLabel: false,
            dataType: 'string',
            prop: 'string_lianxr',
            isListDisplay: true,
          },
          {
            type: 'input',
            label: '联系方式',
            span: 16,
            width:120,
            display: true,
            hideLabel: false,
            dataType: 'string',
            prop: 'string_lianxfs',
            isListDisplay: true,
          },
          {
            type: 'input',
            label: '邮箱',
            span: 16,
            width:120,
            display: true,
            hideLabel: false,
            dataType: 'string',
            prop: 'string_youx',
            isListDisplay: true,
          },
          {
            type: 'input',
            label: '统一社会信用代码',
            span: 16,
            width:200,
            display: true,
            hideLabel: false,
            dataType: 'string',
            prop: 'string_tongyshxydm',
            isListDisplay: true,
            labelWidth: 160
          },
          {
            type: 'input',
            label: '单位性质',
            span: 16,
            width:120,
            display: true,
            hideLabel: false,
            dataType: 'string',
            prop: 'string_danwxz',
            isListDisplay: true,
          },
          {
            type: 'date',
            label: '成立时间',
            span: 16,
            width:120,
            display: true,
            format: 'yyyy-MM-dd',
            valueFormat: 'yyyy-MM-dd',
            hideLabel: false,
            dataType: 'datetime',
            prop: 'datetime_chenglsj',
            isListDisplay: true,
          },
          {
            type: 'input',
            label: '注册资本',
            span: 16,
            width:120,
            display: true,
            hideLabel: false,
            dataType: 'string',
            prop: 'string_zhuczb',
            isListDisplay: true,
          },
          {
            type: 'input',
            label: '人员规模',
            span: 16,
            width:120,
            display: true,
            hideLabel: false,
            dataType: 'string',
            prop: 'string_renygm',
            isListDisplay: true,
          },
          {
            type: 'input',
            label: '军工资质',
            span: 16,
            width:120,
            display: true,
            hideLabel: false,
            dataType: 'string',
            prop: 'string_jungzz',
            isListDisplay: true,
          },
          {
            type: 'select',
            label: '保密等级',
            dicData: [
              {
                label: '一般',
                value: '0'
              },
              {
                label: '秘密',
                value: '1'
              },
            ],
            cascaderItem: [],
            span: 16,
            width:120,
            display: true,
            props: {
              label: 'label',
              value: 'value'
            },
            hideLabel: false,
            dataType: 'string',
            prop: 'string_baomdj',
            isListDisplay: true,
          },
          {
            type: 'input',
            label: '所在地',
            span: 16,
            width:120,
            display: true,
            hideLabel: false,
            dataType: 'string',
            prop: 'string_suozd',
            isListDisplay: true,
          },
          {
            type: 'input',
            label: '企业类型',
            span: 16,
            display: true,
            hideLabel: false,
            dataType: 'string',
            prop: 'string_qiylx',
            isListDisplay: true,
          },
          {
            type: 'select',
            label: '所属领域',
            cascaderItem:[],
            span: 16,
            display: true,
            props: {
              label: 'name',
              value: 'value'
            },
            hideLabel: false,
            dataType: 'string',
            prop: 'string_suosly',
            isListDisplay: true,
            multiple: true,
            dicQuery: {
              code: 'lingyu'
            },
            dicUrl: '/aicos/api/aicos-system/baseDict/getDictItemListByDictCode',
            dicMethod: 'post'
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
    initData () {},
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
      if (["add","edit", "view"].includes(type)) {
        this.initData()
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
