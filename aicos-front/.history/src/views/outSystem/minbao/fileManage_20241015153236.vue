<template>
  <basic-container>
    <avue-crud :option="listOption" :table-loading="loading" :data="listData" ref="listRef" v-model="listForm"
      :page.sync="page" :permission="permissionList" :before-open="beforeOpen" :before-close="beforeClose"
      @search-change="searchChange" @search-reset="searchReset" @selection-change="selectionChange"
      @current-change="currentChange" @size-change="sizeChange" @refresh-change="refreshChange" @on-load="onLoad"
      @row-save="rowSave" @row-update="rowUpdate" :upload-preview="uploadPreview">
      <template slot="biaot" slot-scope="scope">
        <div class="biaot">
          <img v-if="scope.row.read_status == 0" :src="newImg" alt="未读消息" style="width: 1.4rem;height: auto;" />
          <span>{{scope.row.biaot}}</span>
        </div>
      </template>
      <template v-slot:menu="scope">
        <el-button type="text" size="small" v-if="permissionList.viewBtn" @click="comFormMagView(scope.row)">查看
        </el-button>
        <el-button type="text" size="small"
          v-if="scope.row.zhuangt == 1 && permissionList.editBtn"
          @click="comFormMagUpdate(scope.row)">编辑
        </el-button>
        <el-button type="text" size="small"
          v-if="scope.row.zhuangt == 1 && permissionList.tijiaoBtn"
          @click="comFormTijiao(scope.row)">下发
        </el-button>
        <el-button type="text" size="small"
          v-if="scope.row.zhuangt == 1 && permissionList.delBtn"
          @click="comFormMagDel(scope.row)">删除
        </el-button>
      </template>
    </avue-crud>
  </basic-container>
</template>

<script>
import { mapGetters } from "vuex";
import {
  getListData,
  saveOrUpdateListData,
  delListData,
  submitListData,
  danwei,
  getById
} from "@/api/outSystem/fileManage";

const baseUrl = process.env.BASE_URL;
export default {
  data () {
    return {
      newImg:`${baseUrl}img/new.png`,
      metaObjName: 'my_survey',
      systemCode: 'AiCOS',

      fileList:[],
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
        stripe: true,
        height: 'auto',
        align: 'center',
        searchShow: true,
        tip: false,
        excelBtn: false,
        border: false,
        editBtn: false,
        delBtn: false,
        index: true,
        indexLabel: '序号',
        indexWidth: 100,
        viewBtn: false,
        selection: false,
        labelPosition: 'right',
        labelSuffix: '',
        labelWidth: 120,
        gutter: 0,
        menuAlign: 'center',
        menuPosition: 'center',
        isCustom: false,
        column: [
          {
            type: 'input',
            label: '标题',
            span: 16,
            display: true,
            hideLabel: false,
            prop: 'biaot',
            isListDisplay: true,
            search:true,
          },
          {
            type: 'textarea',
            label: '简介',
            span: 16,
            display: true,
            overHidden:true,
            hideLabel: false,
            prop: 'jianj',
            isListDisplay: true,
          },
          {
            type: 'input',
            label: '发文时间',
            span: 16,
            display: false,
            hideLabel: false,
            prop: 'fawsj',
            isListDisplay: true,
          },
          // {
          //   type: 'select',
          //   label: '收文单位',
          //   span: 16,
          //   display: true,
          //   dicData: [],
          //   props: {
          //     label: 'enterprise_name',
          //     value: 'enterprise_name',
          //   },
          //   hideLabel: false,
          //   prop: 'shoujdw',
          //   isListDisplay: true,
          //   multiple: true,
          //   filterable: true,
          //   search:true,
          // },
          {
            type: 'tree',
            label: '收文单位',
            span: 16,
            display: true,
            dicData: [],
            parent: true,
            props: {
              label: 'enterprise_name',
              value: 'enterprise_name',
            },
            hideLabel: false,
            prop: 'shoujdw',
            isListDisplay: true,
            hide: true,
            multiple: true,
            collapseTags: true,
            maxCollapseTags: 3,
            collapseTagsTooltip: true,
            defaultValue: [],
            search:true,
            required: true,
            rules: [
              {
                required: true,
                message: '必须选择',
              }
            ],
            change: ({column,value})=>{
              if(value[0] == '全部'){
                
              }
            }
          },
          {
            type: 'input',
            label: '附件',
            span: 16,
            display: false,
            hideLabel: false,
            prop: 'fujian',
            isListDisplay: true,
          },
          {
            type: 'upload',
            label: '附件',
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
    };
  },
  computed: {
    ...mapGetters(["permission"]),
    permissionList () {
      return {
        addBtn: this.vaildData(
          this.permission[`outsys-file-add`],
          false
        ),
        viewBtn: this.vaildData(
          this.permission[`outsys-file-view`],
          false
        ),
        editBtn: this.vaildData(
          this.permission[`outsys-file-edit`],
          false
        ),
        delBtn: this.vaildData(
          this.permission[`outsys-file-del`],
          false
        ),
        tijiaoBtn: this.vaildData(
          this.permission[`outsys-file-tijiao`],
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
    this.danweiList()
  },
  watch: {

  },
  methods: {
    danweiList(){
      const params = new URLSearchParams();
      params.append("name", '');
      danwei(params).then(res=>{
        let fileArr = [{"enterprise_name":"全部","enterprise_id":"all",children:[]}]
        fileArr[0].children = res.data.data
        this.listOption.column[3].dicData = fileArr
        this.fileList = res.data.data
      })
    },
    uploadPreview(file){
      var http = window.location.protocol + "//"
      var url = window.location.host
      var url2 = http + url + file.url
      window.open(url2,'_self')
    },
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
      this.selectionList = [];
      this.$refs.listRef.toggleSelection();
    },
    onLoad (page /*, params = {}*/) {
      this.loading = true;
      const dataParam = {
        metaObjName: this.metaObjName,
        systemCode: this.systemCode,
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
        this.listData = dataRes.fieldList;
        this.listData.forEach((item) => {
          if(item.fuj){
            let fujarr = item.fuj.split(",")
            let fujarr2 = []
            fujarr.forEach((item) => {
              let itemarr = []
              itemarr = item.split("/")
              fujarr2.push(itemarr.slice(-1))
            })
            item.fujian = fujarr2.join(",")
          }
        })
        this.loading = false;
        this.selectionClear();
      });
    },

    //查看
    async comFormMagView (row, index) {
      let param = new URLSearchParams()
      param.append("id", row.id)
      getById(param).then((res) => {
        // this.onLoad(this.page);
      }, error => {
        window.console.log(error);
        this.onLoad(this.page);
      });
      this.$refs.listRef.rowView(row, index);
      this.refreshChange();
    },

    //新增
    rowSave (row, done, loading) {
      let fujarr = []
      row.fuj.forEach((item) => {
        fujarr.push(item.value)
      })
      row.fuj = fujarr.join(',')
      if( row.shoujdw[0] == '全部'){
        row.shoujdw.splice(0,1)
      }
      row.shoujdw = row.shoujdw.join(',')
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
      console.log(row.shoujdw)
      if(Array.isArray(row.shoujdw)){
        if( row.shoujdw[0] == '全部'){
          row.shoujdw.splice(0,1)
        }
        console.log(row.shoujdw)
        row.shoujdw = row.shoujdw.join(',')
      }
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

    //提交
    comFormTijiao (row) {
      this.$confirm("确定下发?", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          const params = new URLSearchParams();
          params.append("id", row.id);
          return submitListData(params);
        })
        .then(() => {
          this.$message({
            type: "success",
            message: "操作成功!",
          });
          this.refreshChange();
        });
    },

  }
};
</script>

<style>
.el-button--primary {
  background-color: #af2c30 !important;
  border-color: #af2c30 !important;
}

.el-button--primary:focus,
.el-button--primary:hover {
  background-color: #af2c30 !important;
  border-color: #af2c30 !important;
}

.el-button--text {
  color: #af2c30 !important;
}

.avue-crud .el-table--small th {
  background-color: #af2c30 !important;
  color: #fff !important;
  border: none;
}

.el-pagination.is-background .el-pager li:not(.disabled).active {
  background-color: #af2c30;
  border: 1px solid #af2c30;
}

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
