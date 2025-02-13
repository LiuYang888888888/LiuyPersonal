<template>
  <basic-container>
    <avue-crud :option="option" :table-loading="loading" :data="data" :page="page" :permission="permissionList"
      :before-open="beforeOpen" v-model="form" ref="crud" @row-update="rowUpdate" @row-save="rowSave" @row-del="rowDel"
      @search-change="searchChange" @search-reset="searchReset" @selection-change="selectionChange"
      @current-change="currentChange" @size-change="sizeChange" @on-load="onLoad">
    </avue-crud>
  </basic-container>
</template>

<script>
import { mapGetters } from "vuex";
import {
  getDetailList
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
        menu: false,
        submitBtn: true,
        submitText: '提交',
        emptyBtn: true,
        emptyText: '清空',
        menuPosition: 'center',
        column: [
          {
            type: 'select',
            label: '所属部门',
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
            prop: 'string_suosbm',
            isListDisplay: true,
            search: true,
            searchLabelWidth: 100,
            searchSpan: 6,
          },
          {
            type: 'input',
            label: '人员',
            span: 24,
            display: false,
            hideLabel: false,
            dataType: 'string',
            prop: 'string_xingm',
            isListDisplay: true,
          },
          {
            type: 'input',
            label: '姓名',
            span: 8,
            display: true,
            hideLabel: false,
            dataType: 'string',
            prop: 'string_xingm',
            isListDisplay: true,
            search: true,
            searchLabelWidth: 60,
            searchSpan: 4,
            hide:true
          },
          {
            type: 'select',
            label: '职务',
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
            span: 12,
            display: true,
            props: {
              label: 'label',
              value: 'value'
            },
            hideLabel: false,
            dataType: 'string',
            prop: 'string_zhiw',
            isListDisplay: true,
          },
          {
            type: 'input',
            label: '培训会议名称',
            span: 24,
            display: false,
            hideLabel: false,
            dataType: 'string',
            prop: 'string_xingm',
            isListDisplay: true,
          },
          {
            type: 'date',
            label: '培训日期',
            span: 24,
            display: true,
            format: 'yyyy-MM-dd',
            valueFormat: 'yyyy-MM-dd',
            hideLabel: false,
            dataType: 'datetime',
            prop: 'datetime_peixrq',
            isListDisplay: true,
            search: true,
            searchRange: true,
            searchLabelWidth: 120,
            searchSpan: 8,
          },
          {
            type: 'input',
            label: '培训时长',
            span: 24,
            display: false,
            hideLabel: false,
            dataType: 'string',
            prop: 'string_xingm',
            isListDisplay: true,
          },
        ],
      },
      data: []
    };
  },
  computed: {
    ...mapGetters(["permission"]),
  },
  methods: {
    beforeOpen (done, type) {
      if (["edit", "view"].includes(type)) {
        getDetail(this.form.id).then(res => {
          this.form = res.data.data;
        });
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
      getDetailList(dataParam).then(res => {
        const data = res.data.data;
        this.page.total = data.total;
        this.data = data
        this.loading = false;
        this.selectionClear();
      });
    }
  }
};
</script>

<style></style>
