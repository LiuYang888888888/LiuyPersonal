<template>
  <basic-container>
    <avue-crud :option="option" :table-loading="loading" :data="data" :page="page" :permission="permissionList"
      :before-open="beforeOpen" v-model="form" ref="crud" @row-update="rowUpdate" @row-save="rowSave" @row-del="rowDel"
      @search-change="searchChange" @search-reset="searchReset" @selection-change="selectionChange"
      @current-change="currentChange" @size-change="sizeChange" @on-load="onLoad">
      <template slot="menuLeft">
        <!-- <el-button type="danger" size="small" icon="el-icon-delete" plain v-if="permission.projectreport_delete"
          @click="handleDelete">删 除
        </el-button> -->
      </template>
      <template v-slot:menu="scope">
        <el-button type="text" size="small" v-if="permissionList.viewBtn"
          @click="comFormMagView(scope.row)">查看
        </el-button>
        <el-button type="text" size="small" v-if="permissionList.peixunBtn"
          @click="comFormMagDetail(scope.row)">完成培训
        </el-button>
      </template>
    </avue-crud>
  </basic-container>
</template>

<script>
import { mapGetters } from "vuex";
import {
  getList,
  xiafa,
  getJieshouDetail
} from "@/api/Political/peixun";
export default {
  data () {
    return {
      form: {},
      query: {},
      loading: true,
      page: {
        pageSize: 10,
        currentPage: 1,
        total: 0
      },
      selectionList: [],
      option: {
        height: 'auto',
        align: 'center',
        calcHeight: 210,
        searchShow: true,
        searchMenuSpan: 6,
        tip: false,
        border: true,
        index: true,
        indexLabel: '序号',
        indexWidth: 100,
        viewBtn: false,
        addBtn: false,
        delBtn: false,
        editBtn: false,
        selection: false,
        labelPosition: 'left',
        labelSuffix: '：',
        labelWidth: 120,
        gutter: 0,
        menu: true,
        submitBtn: true,
        submitText: '提交',
        emptyBtn: true,
        emptyText: '清空',
        menuPosition: 'center',
        column: [
          {
            type: 'input',
            label: '培训标题',
            span: 24,
            display: false,
            hideLabel: false,
            dataType: 'string',
            prop: 'string_peixbt',
            isListDisplay: true,
          },
          {
            type: 'date',
            label: '发布日期',
            span: 24,
            display: false,
            format: 'yyyy-MM-dd',
            valueFormat: 'yyyy-MM-dd',
            hideLabel: false,
            dataType: 'datetime',
            prop: 'datetime_fabsj',
            isListDisplay: true,
          },
          {
            type: 'input',
            label: '发布部门',
            span: 24,
            display: false,
            hideLabel: false,
            dataType: 'string',
            prop: 'string_fabbm',
            isListDisplay: true,
          },
          {
            type: 'input',
            label: '发布状态',
            span: 24,
            display: false,
            hideLabel: false,
            dataType: 'string',
            prop: 'string_fabzt',
            isListDisplay: true,
          },
          {
            type: 'input',
            label: '发布人',
            span: 24,
            display: false,
            hideLabel: false,
            dataType: 'string',
            prop: 'string_fabr',
            isListDisplay: true,
          },
          {
            type: 'input',
            label: '会议名称',
            span: 24,
            display: true,
            hideLabel: false,
            dataType: 'string',
            prop: 'string_peixbt',
            isListDisplay: true,
            hide: true
          },
          {
            type: 'input',
            label: '会议地点',
            span: 24,
            display: true,
            hideLabel: false,
            dataType: 'string',
            prop: 'string_huiydd',
            isListDisplay: true,
            hide: true
          },
          {
            type: 'select',
            label: '参会培训人员',
            dicData: [
              {
                label: '张三',
                value: '0'
              },
              {
                label: '李四',
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
            prop: 'string_canhpxry',
            isListDisplay: true,
            hide: true,
            multiple: true
          },
          {
            type: 'input',
            label: '学时',
            span: 24,
            display: true,
            hideLabel: false,
            dataType: 'string',
            prop: 'string_xues',
            isListDisplay: true,
            hide: true
          },
          {
            type: 'textarea',
            label: '会议详情',
            span: 24,
            display: true,
            hideLabel: false,
            dataType: 'string',
            prop: 'string_huiyxq',
            isListDisplay: true,
            hide: true
          },
          {
            type: 'upload',
            label: '上传',
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
            hide: true,
            data: {
              fromSystemName: 'base'
            }
          }
        ],
      },
      data: []
    };
  },
  computed: {
    ...mapGetters(["permission"]),
    permissionList () {
      return {
        viewBtn: this.vaildData(
          this.permission[`sys-commonForm-dataMag-pxck-view`],
          false
        ),
        peixunBtn: this.vaildData(
          this.permission[`sys-commonForm-dataMag-pxck-px`],
          false
        ),
      };
    },
    ids () {
      let ids = [];
      this.selectionList.forEach(ele => {
        ids.push(ele.id);
      });
      return ids.join(",");
    }
  },
  methods: {
    comFormMagDetail () {
      this.$confirm("确定完成此次培训会议?", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(() => {

      })
    },
    
    
    beforeOpen (done, type) {
      if (["edit", "view"].includes(type)) {
        // getDetail(this.form.id).then(res => {
        //   this.form = res.data.data;
        // });
      }
      done();
    },
    searchReset () {
      this.query = {};
      this.onLoad(this.page);
    },
    searchChange (params, done) {
      this.query = params;
      this.page.currentPage = 1;
      this.onLoad(this.page, params);
      done();
    },
    selectionChange (list) {
      this.selectionList = list;
    },
    selectionClear () {
      this.selectionList = [];
      this.$refs.crud.toggleSelection();
    },
    currentChange (currentPage) {
      this.page.currentPage = currentPage;
    },
    sizeChange (pageSize) {
      this.page.pageSize = pageSize;
    },
    onLoad (page) {
      this.loading = false;
      const dataParam = {
        current: page.currentPage,
        size: page.pageSize,
        ...this.query
      };
      getList(dataParam).then(res => {
        const data = res.data.data;
        this.page.total = data.total;
        this.data = data.records;
        this.loading = false;
        this.selectionClear();
      });
    }
  }
};
</script>

<style></style>
