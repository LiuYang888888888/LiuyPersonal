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
            label: '设备编号',
            span: 16,
            display: true,
            hideLabel: false,
            dataType: 'string',
            prop: 'string_shebbh',
            isListDisplay: true,
            width:200,
          },
          {
            type: 'input',
            label: '设备名称',
            span: 16,
            display: true,
            hideLabel: false,
            dataType: 'string',
            prop: 'string_shebmc',
            isListDisplay: true,
            width:200,
          },
          {
            type: 'input',
            label: '所属组别',
            span: 16,
            display: true,
            hideLabel: false,
            dataType: 'string',
            prop: 'string_suoszb',
            isListDisplay: true,
            width:100,
          },
          {
            type: 'input',
            label: '型号',
            span: 16,
            display: true,
            hideLabel: false,
            dataType: 'string',
            prop: 'string_xingh',
            isListDisplay: true,
          },
          {
            type: 'input',
            label: '制造厂家',
            span: 16,
            display: true,
            hideLabel: false,
            dataType: 'string',
            prop: 'string_zhizcj',
            isListDisplay: true,
            width:100,
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
            label: '联系电话',
            span: 16,
            display: true,
            hideLabel: false,
            dataType: 'string',
            prop: 'string_lianxdh',
            isListDisplay: true,
            width:100,
          },
          {
            type: 'input',
            label: '专业',
            span: 16,
            display: true,
            hideLabel: false,
            dataType: 'string',
            prop: 'string_zhuany',
            isListDisplay: true,
            
          },
          {
            type: 'input',
            label: '先进程度',
            span: 16,
            display: true,
            hideLabel: false,
            dataType: 'string',
            prop: 'string_xianjcd',
            isListDisplay: true,
            width:100,
          },
          {
            type: 'input',
            label: '物资类型',
            span: 16,
            display: true,
            hideLabel: false,
            dataType: 'string',
            prop: 'string_wuzlx',
            isListDisplay: true,
            
          },
          {
            type: 'textarea',
            label: '功能描述',
            span: 16,
            display: true,
            hideLabel: false,
            dataType: 'string',
            prop: 'string_gongnms',
            isListDisplay: true,
            
          },
          {
            type: 'input',
            label: '主要技术参数及指标',
            span: 16,
            display: true,
            hideLabel: false,
            dataType: 'string',
            prop: 'string_zhuyjscsjzb',
            isListDisplay: true,
            width:200,
          },
          {
            type: 'input',
            label: '采购价格',
            span: 16,
            display: true,
            hideLabel: false,
            dataType: 'string',
            prop: 'string_caigjg',
            isListDisplay: true,
           
          },
          {
            type: 'date',
            label: '采购时间',
            span: 16,
            display: true,
            format: 'yyyy-MM-dd',
            valueFormat: 'yyyy-MM-dd',
            hideLabel: false,
            dataType: 'datetime',
            prop: 'datetime_caigsj',
            isListDisplay: true,
           
          },
          {
            type: 'date',
            label: '过保时间',
            span: 16,
            display: true,
            format: 'yyyy-MM-dd',
            valueFormat: 'yyyy-MM-dd',
            hideLabel: false,
            dataType: 'datetime',
            prop: 'datetime_guobsj',
            isListDisplay: true,
            
          },
          {
            type: 'input',
            label: '物资状态',
            span: 16,
            display: true,
            hideLabel: false,
            dataType: 'string',
            prop: 'string_wuzzt',
            isListDisplay: true,
           
          },
          {
            type: 'input',
            label: '应用领域',
            span: 16,
            display: true,
            hideLabel: false,
            dataType: 'string',
            prop: 'string_yingyly',
            isListDisplay: true,
            
          },
          {
            type: 'input',
            label: '产地',
            span: 16,
            display: true,
            hideLabel: false,
            dataType: 'string',
            prop: 'string_chand',
            isListDisplay: true,
            
          },
          {
            type: 'date',
            label: '使用时间',
            span: 16,
            display: true,
            format: 'yyyy-MM-dd',
            valueFormat: 'yyyy-MM-dd',
            hideLabel: false,
            dataType: 'datetime',
            prop: 'datetime_shiysj1',
            isListDisplay: true,
            
          },
          {
            type: 'input',
            label: '使用范围',
            span: 16,
            display: true,
            hideLabel: false,
            dataType: 'string',
            prop: 'string_shiyfw',
            isListDisplay: true,
            
          },
          {
            type: 'upload',
            label: '图片',
            span: 16,
            display: true,
            showFileList: true,
            multiple: true,
            limit: 10,
            action: '/aicos/api/aicos-file/miniofile/upload',
            propsHttp: {
              home: '/aicos',
              url: 'newFileName',
              name: 'oldFileName',
              res: 'data',
              fileName: 'file'
            },
            canvasOption: {},
            hideLabel: false,
            dataType: 'string',
            prop: 'string_tup',
            isListDisplay: true,
            listType: 'picture-card',
            data: {
              fromSystemName: 'base'
            }
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
