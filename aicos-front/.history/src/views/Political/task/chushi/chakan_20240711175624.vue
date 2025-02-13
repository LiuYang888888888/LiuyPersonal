<template>
  <basic-container>
    <avue-crud :option="option" :table-loading="loading" :data="data" :page="page" :permission="permissionList"
      :before-open="beforeOpen" v-model="form" ref="crud" @row-update="rowUpdate" @row-save="rowSave" @row-del="rowDel"
      @search-change="searchChange" @search-reset="searchReset" @selection-change="selectionChange"
      @current-change="currentChange" @size-change="sizeChange" @on-load="onLoad" :upload-preview="uploadPreview" :upload-after="uploadAfter">
      <template slot="menuLeft">
        <!-- <el-button type="danger" size="small" icon="el-icon-delete" plain v-if="permission.projectreport_delete"
          @click="handleDelete">删 除
        </el-button> -->
      </template>
      <template v-slot:menu="scope">
        <el-button type="text" size="small" v-if="permissionList.viewBtn"
          @click="comFormMagview(scope.row,scope.index)">查看
        </el-button>
      </template>
    </avue-crud>
  </basic-container>
</template>

<script>
import { mapGetters } from "vuex";
import {
  getList
} from "@/api/Political/taskcom";
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
        indexLabel:'序号',
        indexWidth:100,
        viewBtn: false,
        delBtn:false,
        editBtn:false,
        selection: true,
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
            label: '标题',
            span: 24,
            display: true,
            hideLabel: false,
            prop: 'biaot',
            isListDisplay: true,
          },
          {
            label: '发布部门',
            span: 24,
            display: false,
            prop: 'fabbm',
          },
          {
            type: 'select',
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
            label: '发布时间',
            span: 24,
            display: false,
            prop: 'fabsj',
          },
          {
            type: 'select',
            label: '接收单位',
            cascaderItem: [],
            span: 24,
            display: true,
            props: {
              label: 'name',
              value: 'value'
            },
            dicUrl: '/aicos/api/aicos-system/baseDict/getDictItemListByDictCode',
            dicMethod: 'post',
            dicQuery: {
              code: 'jieshoudw'
            },
            hideLabel: false,
            prop: 'jiesdw',
            isListDisplay: true,
            multiple: true,
            hide:true,
          },
          {
            type: 'textarea',
            label: '内容',
            span: 24,
            display: true,
            hideLabel: false,
            prop: 'nar',
            isListDisplay: true,
            hide:true,
          },
          {
            type: 'upload',
            label: '附件',
            span: 24,
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
            listType: 'text',
            data: {
              fromSystemName: 'base'
            },
            hide:true,
          }
        ],
      },
      data: [],
      type:''
    };
  },
  computed: {
    ...mapGetters(["permission"]),
    permissionList () {
      return {
        addBtn: this.vaildData(
          this.permission[`sys-commonForm-dataMag-tzxf-add`],
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
    uploadPreview(file){
      if(this.type == "view"){
        const http = window.location.protocol + "//"
        const url = window.location.host
        const url2 = http + url + file.url
        window.open(url2,'_self')
      }
    },
    comFormMagview(row,index){
      this.$refs.crud.rowView(row, index)
    },

    // handleDelete () {
    //   if (this.selectionList.length === 0) {
    //     this.$message.warning("请选择至少一条数据");
    //     return;
    //   }
    //   this.$confirm("确定将选择数据删除?", {
    //     confirmButtonText: "确定",
    //     cancelButtonText: "取消",
    //     type: "warning"
    //   })
    //     .then(() => {
    //       return remove(this.ids);
    //     })
    //     .then(() => {
    //       this.onLoad(this.page);
    //       this.$message({
    //         type: "success",
    //         message: "操作成功!"
    //       });
    //       this.$refs.crud.toggleSelection();
    //     });
    // },

    beforeOpen (done, type) {
      this.type = type
      if (["add","edit", "view"].includes(type)) {
        if(type == "edit"){
          this.form.jiesdw = this.form.jiesdw.split(",")
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
