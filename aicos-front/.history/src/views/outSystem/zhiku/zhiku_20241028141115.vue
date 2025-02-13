<template>
  <basic-container>
    <!-- <HuilanBasicToolbar style="margin-top: 0;text-align: left;">
      <el-button type="primary" size="small" @click="comFormMagAdd">新增</el-button>
      <el-button
        type="primary"
        size="small"
        icon="el-icon-upload2"
        @click.stop="comFormMagIn()"
        >导入数据
      </el-button>
      <el-button
        type="primary"
        size="small"
        icon="el-icon-download"
        @click.stop="comFormMagBatchOut()"
        >导出数据
      </el-button>
    </HuilanBasicToolbar> -->
    <avue-crud :option="listOption" :table-loading="loading" :data="listData" ref="listRef" v-model="listForm"
      :page.sync="page" :permission="permissionList" :before-open="beforeOpen" :before-close="beforeClose"
      @search-change="searchChange" @search-reset="searchReset" @selection-change="selectionChange"
      @current-change="currentChange" @size-change="sizeChange" @refresh-change="refreshChange" @on-load="onLoad"
      @row-save="rowSave" @row-update="rowUpdate" :upload-preview="uploadPreview">
      <template v-slot:menu="scope">
        <el-button type="text" size="small" v-if="permissionList.viewBtn" @click="comFormMagView(scope.row)">查看
        </el-button>
        <el-button type="text" size="small" v-if="permissionList.editBtn" @click="comFormMagUpdate(scope.row)">编辑
        </el-button>
        <el-button type="text" size="small" v-if="permissionList.downloadBtn" @click="comFormDownload(scope.row)">下载
        </el-button>
        <el-button type="text" size="small" v-if="permissionList.delBtn" @click="comFormMagDel(scope.row)">删除
        </el-button>
      </template>
    </avue-crud>
  </basic-container>
</template>

<script>

export const downloadFile = (url) => {
  const iframe = document.createElement("iframe");
  iframe.style.display = "none";  // 防止影响页面
  iframe.style.height = 0;  // 防止影响页面
  iframe.src = url;
  document.body.appendChild(iframe);  // 这一行必须，iframe挂在到dom树上才会发请求
  // 5分钟之后删除（onload方法对于下载链接不起作用，就先抠脚一下吧）
  setTimeout(()=>{
    iframe.remove();
  }, 5 * 60 * 1000);
}

import { mapGetters } from "vuex";
import {baseURL} from '@/api/common';
import {
  getListData,
  saveOrUpdateListData,
  delListData,
} from "@/api/outSystem/zhiku";
export default {
  data () {
    return {
      loading: false,
      page: {
        pageSize: 10,
        currentPage: 1,
        total: 0,
        pageSizes: [10, 20, 30, 40, 50, 100],
      },
      listForm: {},
      selectionList: [],
      query: {},
      listData: [],
      listOption: {
        menuTitle: '资料下载',
        height: 'auto',
        calcHeight:'auto',
        align: 'center',
        searchShow: true,
        tip: false,
        border: true,
        editBtn: false,
        delBtn: false,
        index: true,
        indexLabel: '编号',
        indexWidth: 100,
        viewBtn: false,
        selection: true,
        labelPosition: 'right',
        labelSuffix: '',
        labelWidth: 120,
        gutter: 0,
        menuPosition: 'center',
        isCustom: false,

        column: [
          {
            type: 'input',
            label: '智库名称',
            span: 16,
            display: true,
            hideLabel: false,
            prop: 'zhikmc',
            isListDisplay: true,
            search: true,
            required: true,
            rules: [
              {
                required: true,
                message: '智库名称必须填写'
              }
            ],
          },
          {
            type: 'select',
            label: '智库分类',
            cascaderItem: [],
            span: 16,
            display: true,
            props: {
              label: 'name',
              value: 'name'
            },
            hideLabel: false,
            prop: 'zhikfl',
            isListDisplay: true,
            search: true,
            dicUrl: '/aicos/api/aicos-system/baseDict/getDictItemListByDictCode',
            dicMethod: 'post',
            dicQuery: {
              code: 'zhikufl'
            },
            required: true,
            rules: [
              {
                required: true,
                message: '智库分类必须选择'
              }
            ],
          },
          {
            type: 'textarea',
            label: '内容简介',
            span: 16,
            display: true,
            overHidden:true,
            hideLabel: false,
            prop: 'narjj',
            isListDisplay: true,
            required: true,
            rules: [
              {
                required: true,
                message: '内容简介必须填写'
              }
            ],
          },
          {
            type: 'upload',
            label: '上传资料',
            span: 16,
            display: true,
            showFileList: true,
            multiple: true,
            limit: 10,
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
            prop: 'shangczl',
            isListDisplay: true,
            hide: true,
            listType: 'text',
            data: {
              fromSystemName: 'base'
            },
            required: true,
            rules: [
              {
                required: true,
                message: '资料必须填写'
              }
            ],
          }
        ],
      },
    };
  },
  computed: {
    ...mapGetters(["permission"]),
    permissionList () {
      return {
        addBtn: this.vaildData(
          this.permission[`outsys-zhiku-add`],
          false
        ),
        viewBtn: this.vaildData(
          this.permission[`outsys-zhiku-view`],
          false
        ),
        editBtn: this.vaildData(
          this.permission[`outsys-zhiku-edit`],
          false
        ),
        delBtn: this.vaildData(
          this.permission[`outsys-zhiku-del`],
          false
        ),
        downloadBtn: this.vaildData(
          this.permission[`outsys-zhiku-download`],
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
  async mounted () {

  },
  watch: {

  },
  methods: {
    initData (/*type*/) { },
    refreshChange () {
      this.onLoad(this.page, this.query);
    },
    beforeOpen (done, type) {
      if (["add", "edit", "view"].includes(type)) {
        this.initData(type);
      }
      done();
    },
    beforeClose (done /*type*/) {
      this.refreshChange();
      done();
    },
    currentChange (currentPage) {
      this.page.currentPage = currentPage;
    },

    sizeChange (pageSize) {
      this.page.pageSize = pageSize;
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
      if(this.$route.query.type){
        if(this.$route.query.type == 'add' && this.permissionList.addBtn){
          this.$refs.listRef.rowAdd()
          delete this.$route.query.type
        }
      }
      this.selectionList = [];
      this.$refs.listRef.toggleSelection();
    },
    onLoad (page /*, params = {}*/) {
      this.loading = true;
      const dataParam = {
        reqPage: {
          current: page.currentPage,
          size: page.pageSize,
        },
        searchParam: {
          ...this.query,
        },
      };
      getListData(dataParam).then((res) => {
        const dataRes = res.data.data;
        this.page.total = dataRes.rspPage.totalItems;
        this.page.pageSize = dataRes.rspPage.size;
        this.page.currentPage = dataRes.rspPage.current;
        this.formName = dataRes.formName;
        this.listData = dataRes.fieldList;
        this.loading = false;
        this.selectionClear();
      });
    },
    //查看
    async comFormMagView (row, index) {
      this.$refs.listRef.rowView(row, index);
    },

    //新增
    rowSave (row, done, loading) {
      let fujarr = []
      row.shangczl.forEach((item) => {
        fujarr.push(item.value)
      })
      row.shangczl = fujarr.join(',')
      saveOrUpdateListData(row).then(() => {
        done();
        this.onLoad(this.page);
        this.$message({
          type: "success",
          message: "操作成功!"
        });
      }, error => {
        window.console.log(error);
        loading();
      });
    },

    //编辑
    async comFormMagUpdate (row, index) {
      this.$refs.listRef.rowEdit(row, index);
    },
    rowUpdate (row, index, done, loading) {
      saveOrUpdateListData(row).then(() => {
        done();
        this.onLoad(this.page);
        this.$message({
          type: "success",
          message: "操作成功!"
        });
      }, error => {
        window.console.log(error);
        loading();
      });
    },

    //删除
    comFormMagDel (row) {
      this.$confirm("确定将选择数据删除?", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          const params = new URLSearchParams();
          params.append("id", row.id);
          return delListData(params);
        })
        .then(() => {
          this.$message({
            type: "success",
            message: "操作成功!",
          });
          this.refreshChange();
        });
    },
    uploadPreview(file){
      var http = window.location.protocol + "//"
      var url = window.location.host
      var url2 = http + url + file.url
      window.open(url2,'_self')
    },
    //文件下载
    comFormDownload(row){
      var fujarr = row.shangczl.split(",")
      var http = window.location.protocol + "//"
      var url = window.location.host
      fujarr.forEach((item) =>{
        var s1 = item
        var s2 = s1.substring(1);
        var url2 = http + url + `${baseURL}` + s2
        downloadFile(url2);
      })
    }
  }
};
</script>

<style>
.CMF_MAIN {
  max-width: 1000px;
  margin: 0 auto;
  background-color: #fff;
  border-left: 1px solid #ebeef5;
  border-right: 1px solid #ebeef5;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
}

.CMF_HEAD {
  text-align: center;
  background-color: #409eff;
}

.CMF_HEAD span {
  font-size: 18px;
  line-height: 50px;
  color: #fff;
}

.CMF_BODY {
  padding: 20px 10px 0;
}

.CMF_FOOT {}

.CMF_CUST {}

.dataMagFormClass .dataMagFormBody {
  background-color: #f5f5f5;
  padding: 20px 0 0;
}

.dataMagFormClass .dataMagFormFooter {
  background-color: #fff;
  margin-top: 20px;
}

.formVerifyClass {
  padding: 30px 10px 10px;
  max-width: 1000px;
  margin: 0 auto;
}

.dataMagFormBtns {
  text-align: center;
  padding: 30px 10px 60px;
}

@media print {
  .el-popup-parent--hidden {
    overflow: auto;
  }

  .dataMagFormClass {
    position: static;
  }

  .dataMagFormClass .el-dialog {
    height: auto;
  }
}
</style>
