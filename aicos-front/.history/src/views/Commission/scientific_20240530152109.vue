<template>
  <HuilanBasic>
    <avue-crud :option="option" :search.sync="search" :table-loading="loading" :permission="permissionList" :data="data"
      ref="crud" v-model="form" @row-del="rowDel" @row-update="rowUpdate" @row-save="rowSave" :before-open="beforeOpen"
      :page.sync="page" @selection-change="selectionChange" @search-change="searchChange"
      @current-change="currentChange" @size-change="sizeChange" @refresh-change="refreshChange" @on-load="onLoad">

      <template slot-scope="scope" slot="menu">
        <el-button type="text" size="small" @click.stop="dictItemMgr(scope.row, scope.index)">形式审查
        </el-button>
      </template>
    </avue-crud>

  </HuilanBasic>
</template>

<script>
import { mapGetters } from "vuex";
let action = 'https://api.avuejs.com/imgupload'
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
        delBtn: false,
        editBtn: false,
        searchMenuSpan: 4,
        menuWidth: 300,
        column: [
          {
            type: 'input',
            label: '项目编号',
            span: 24,
            display: true,
            hideLabel: false,
            dataType: 'string',
            prop: 'string_xiangmbh',
            isListDisplay: true,
          },
          {
            type: 'input',
            label: '项目名称',
            span: 24,
            display: true,
            hideLabel: false,
            dataType: 'string',
            prop: 'string_xiangmmc',
            isListDisplay: true,
            search: true
          },
          {
            type: 'textarea',
            label: '项目概要',
            span: 24,
            display: true,
            hideLabel: false,
            dataType: 'string',
            prop: 'string_gaiyjs',
            isListDisplay: true,
          },
          {
            type: 'select',
            label: '主管部门',
            dicData: [
              {
                label: '选项一',
                value: '0'
              },
              {
                label: '选项二',
                value: '1'
              },
              {
                label: '选项三',
                value: '2'
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
            prop: 'string_zhugbm',
            isListDisplay: true,
          },
          {
            type: 'input',
            label: '申报单位',
            span: 24,
            display: true,
            hideLabel: false,
            dataType: 'string',
            prop: 'string_shenbdw',
            isListDisplay: true,
            search: true
          },
          {
            type: 'input',
            label: '联合申报单位',
            span: 24,
            display: true,
            hideLabel: false,
            dataType: 'string',
            prop: 'string_lianhsbdw',
            isListDisplay: true,
            
          },
          {
            type: 'select',
            label: '保密等级',
            dicData: [
              {
                label: '选项一',
                value: '0'
              },
              {
                label: '选项二',
                value: '1'
              },
              {
                label: '选项三',
                value: '2'
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
            prop: 'string_baomdj',
            isListDisplay: true,
            
          },
          {
            type: 'input',
            label: '申报单位保密证有效期',
            span: 24,
            display: true,
            hideLabel: false,
            dataType: 'string',
            prop: 'string_shenbdwbmzyxq',
            isListDisplay: true,
            
          },
          {
            type: 'input',
            label: '联合申报单位保密证有效期',
            span: 24,
            display: true,
            hideLabel: false,
            dataType: 'string',
            prop: 'string_lianhsbdwbmzyxq',
            isListDisplay: true,
           
          },
          {
            type: 'date',
            label: '联合申报项目合作协议签订时间',
            span: 24,
            display: true,
            format: 'yyyy-MM-dd',
            valueFormat: 'yyyy-MM-dd',
            hideLabel: false,
            dataType: 'datetime',
            prop: 'datetime_lianhsbxmhzxyqdsj',
            isListDisplay: true,
            
          },
          {
            type: 'input',
            label: '项目起止年限',
            span: 24,
            display: true,
            hideLabel: false,
            dataType: 'string',
            prop: 'string_xiangmqznx',
            isListDisplay: true,
            
          },
          {
            type: 'input',
            label: '总经费（万）',
            span: 24,
            display: true,
            hideLabel: false,
            dataType: 'string',
            prop: 'string_zongjf',
            isListDisplay: true,
           
          },
          {
            type: 'input',
            label: '国拨经费（万）',
            span: 24,
            display: true,
            hideLabel: false,
            dataType: 'string',
            prop: 'string_guobjf',
            isListDisplay: true,
            
          },
          {
            type: 'input',
            label: '项目负责人',
            span: 24,
            display: true,
            hideLabel: false,
            dataType: 'string',
            prop: 'string_xiangmfzr',
            isListDisplay: true,
            
          },
          {
            type: 'input',
            label: '联系电话',
            span: 24,
            display: true,
            hideLabel: false,
            dataType: 'string',
            prop: 'string_lianxdh',
            isListDisplay: true,
            
          },
          {
            type: 'upload',
            label: '附件上传',
            span: 24,
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
            prop: 'string_fuj',
            isListDisplay: true,
            hide:
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
    initData () {},
    dictItemMgr () {
      this.shencha = !this.shencha
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
        this.initData(type);
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
