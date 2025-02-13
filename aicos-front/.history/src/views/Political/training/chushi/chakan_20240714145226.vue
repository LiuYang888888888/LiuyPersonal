<template>
  <basic-container>
    <avue-crud :option="option" :table-loading="loading" :data="data" :page="page" :permission="permissionList"
      :before-open="beforeOpen" v-model="form" ref="crud" @row-update="rowUpdate" @row-save="rowSave" @row-del="rowDel"
      @search-change="searchChange" @search-reset="searchReset" @selection-change="selectionChange"
      @current-change="currentChange" @size-change="sizeChange" @on-load="onLoad" :upload-preview="uploadPreview">
     
      <template v-slot:menu="scope">
        <el-button type="text" size="small" v-if="permissionList.viewBtn"
          @click="comFormMagView(scope.row)">查看
        </el-button>
        <el-button type="text" size="small" v-if="permissionList.peixunBtn && scope.row.shifcj == 0"
          @click="comFormMagDetail(scope.row)">完成培训
        </el-button>
      </template>
    </avue-crud>
  </basic-container>
</template>

<script>
import { mapGetters } from "vuex";
import {
  gettzList,
  completeTrain,
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
        addBtn:false,
        delBtn: false,
        editBtn: false,
        selection: false,
        labelPosition: 'left',
        labelSuffix: '：',
        labelWidth: 120,
        gutter: 0,
        submitBtn: true,
        submitText: '提交',
        emptyBtn: true,
        emptyText: '清空',
        menuPosition: 'center',
        column: [
          {
            type: 'input',
            label: '培训标题',
            span: 16,
            display: true,
            hideLabel: false,
            prop: 'huiymc',
            isListDisplay: true,
            search:true,
          },
          {
            label: '发布时间',
            span: 24,
            display: false,
            prop: 'fabsj',
          },
          {
            label: '发布部门',
            span: 24,
            display: false,
            prop: 'fabbm',
          },
          {
            label: '发布状态',
            span: 24,
            display: false,
            prop: 'fabzt',
            props: {
              label: 'name',
              value: 'value'
            },
            dicUrl: '/aicos/api/aicos-system/baseDict/getDictItemListByDictCode',
            dicMethod: 'post',
            dicQuery: {
              code: 'fabuzt'
            },
            cascaderItem: [],
          },
          {
            label: '发布人',
            span: 24,
            display: false,
            prop: 'fabr',
          },
          {
            type: 'input',
            label: '培训标题',
            span: 16,
            display: true,
            hideLabel: false,
            prop: 'huiymc',
            isListDisplay: true,
            hide: true,
          },
          {
            type: 'input',
            label: '培训地点',
            span: 16,
            display: true,
            hideLabel: false,
            prop: 'huiydd',
            isListDisplay: true,
            hide: true,
          },
          {
            type: 'tree',
            label: '参会培训人员',
            span: 16,
            display: true,
            dicData: [],
            parent: true,
            props: {
              label: 'name',
              value: 'id'
            },
            hideLabel: false,
            prop: 'canhpxryid',
            isListDisplay: true,
            hide: true,
            multiple: true,
            defaultValue: []
          },
          {
            type: 'input',
            label: '学时',
            span: 16,
            display: true,
            hideLabel: false,
            prop: 'xues',
            isListDisplay: true,
            hide: true,
          },
          {
            type: 'textarea',
            label: '会议详情',
            span: 16,
            display: true,
            hideLabel: false,
            prop: 'huiyxq',
            isListDisplay: true,
            hide: true,
          },
          {
            type: 'upload',
            label: '附件',
            span: 16,
            display: true,
            showFileList: true,
            multiple: false,
            limit: 1,
            action: '/aicos/api/aicos-file/miniofile/upload',
            propsHttp: {
              home: '/aicos',
              url: 'newFileName',
              name: 'objectName',
              res: 'data',
              fileName: 'file'
            },
            canvasOption: {},
            hideLabel: false,
            prop: 'fuj',
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
  created () {
    this.peopleList()
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
    //接收人员列表
    peopleList() {
      getJieshouDetail().then(res =>{
        this.option.column[7].dicData = res.data.data
      })
    },
    uploadPreview(file){
      const http = window.location.protocol + "//"
      const url = window.location.host
      const url2 = http + url + file.url
      window.open(url2,'_self')
      
    },
    comFormMagView(row,index){
      this.$refs.crud.rowView(row, index);
    },
    comFormMagDetail (row) {
      this.$confirm("确定完成此次培训会议?", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(() => {
        return completeTrain(row.trainNoticeId)
      })
        .then(() => {
          this.onLoad(this.page)
          this.$message({
            type: "success",
            message: "操作成功!"
          });
        })
    },
    
    beforeOpen (done, type) {
      if (["edit", "view"].includes(type)) {
        if(type == "edit"){
          this.form.canhpxryid = this.form.canhpxryid.split(",")
        }
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
      gettzList(dataParam).then(res => {
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
