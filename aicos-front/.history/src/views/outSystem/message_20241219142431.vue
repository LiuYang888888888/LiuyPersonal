<template>
  <basic-container>
    <avue-crud :option="listOption" :table-loading="loading" :data="listData" ref="listRef" v-model="listForm" :search="query"
      :page.sync="page" :permission="permissionList" :before-open="beforeOpen" :before-close="beforeClose"
      @search-change="searchChange" @search-reset="searchReset" @selection-change="selectionChange"
      @current-change="currentChange" @size-change="sizeChange" @refresh-change="refreshChange" @on-load="onLoad"
      @row-save="rowSave" @row-update="rowUpdate">
      <template v-slot:menu="scope">
        <el-button type="text" size="small" v-if="permissionList.viewBtn" @click="comFormMagView(scope.row)">查看
        </el-button>
        <!-- <el-button type="text" size="small"
          v-if="permissionList.editBtn"
          @click="comFormMagUpdate(scope.row)">编辑
        </el-button> -->
        <el-button type="text" size="small"
          v-if="permissionList.huifuBtn && !scope.row.huifyh && !scope.row.huifnr"
          @click="comFormHuifu(scope.row)">回复
        </el-button>
        <!-- <el-button type="text" size="small"
          v-if="permissionList.delBtn"
          @click="comFormMagDel(scope.row)">删除
        </el-button> -->
      </template>
    </avue-crud>

    <!--审核弹窗-->
    <HuilanDialog :title="dataMagFormTitle" :fullscreen="false" append-to-body :before-close="dataMagFormClose"
      :visible.sync="dataMagFormTag" class="dataMagFormClass">
      <avue-form :option="option" v-model="form" v-if="dataMagFormTag" @submit="handleSubmit" @reset-change="handleReset"></avue-form>
    </HuilanDialog>

  </basic-container>
</template>

<script>
import { mapGetters } from "vuex";
import { getInfo } from "@/api/outSystem/agency";
import {
  getListData,
  saveOrUpdateListData,
  viewListData,
  submitListData,
} from "@/api/outSystem/message";
export default {
  data () {
    return {
      // 上传数据
      fileList: [],

      dataMagFormTag:false,
      btnLoading:false,
      dataMagFormTitle:'回复',
      formVerifyText:'',
      metaObjName:'my_survey',
      systemCode:'AiCOS',

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
        excelBtn:false,
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
            label: '问题标题',
            span: 16,
            display: true,
            hideLabel: false,
            prop: 'liuybt',
            isListDisplay: true,
            search:true,
          },
          {
            type: 'select',
            label: '问题分类',
            cascaderItem: [],
            span: 16,
            display: true,
            props: {
              label: 'name',
              value: 'value'
            },
            hideLabel: false,
            prop: 'liuyfl',
            isListDisplay: true,
            dicUrl: '/aicos/api/aicos-system/baseDict/getDictItemListByDictCode',
            dicMethod: 'post',
            dicQuery: {
              code: 'liuyanfl'
            },
            search:true,
          },
          {
            type: 'textarea',
            label: '问题内容',
            span: 16,
            display: true,
            overHidden:true,
            hideLabel: false,
            prop: 'liuynr',
            isListDisplay: true,
            search:true,
          },
          {
            type: 'input',
            label: '留言用户',
            span: 16,
            display: true,
            hideLabel: false,
            prop: 'liuyyh',
            isListDisplay: true,
          },
          {
            type: 'input',
            label: '联系电话',
            span: 16,
            display: true,
            hideLabel: false,
            prop: 'dianh',
            isListDisplay: true,
          }
        ],
      },

      form:{},
      option:{},
      option1:{
        emptyText: '取消',
        group:[
          {
            label: '留言信息',
            prop: 'lyxx',
            icon: 'el-icon-edit-outline',
            column: [
              {
                type: 'input',
                label: '问题标题',
                span: 16,
                display: true,
                hideLabel: false,
                prop: 'liuybt',
                isListDisplay: true,
                readonly:true,
              },
              {
                type: 'input',
                label: '留言分类',
                span: 16,
                display: true,
                hideLabel: false,
                prop: 'liuyfl',
                isListDisplay: true,
                readonly:true,
              },
              {
                type: 'textarea',
                label: '留言内容',
                span: 16,
                display: true,
                hideLabel: false,
                prop: 'liuynr',
                isListDisplay: true,
                readonly:true,
              },
              {
                type: 'input',
                label: '留言用户',
                span: 16,
                display: true,
                hideLabel: false,
                prop: 'liuyyh',
                isListDisplay: true,
                readonly:true,
              },
              {
                type: 'input',
                label: '联系电话',
                span: 16,
                display: true,
                hideLabel: false,
                prop: 'dianh',
                isListDisplay: true,
                readonly:true,
              }
            ],
          },
          {
            label: '留言回复',
            prop: 'lyhf',
            icon: 'el-icon-edit-outline',
            column:[
              {
                type: 'textarea',
                label: '回复内容',
                span: 16,
                display: true,
                hideLabel: false,
                prop: 'huifnr',
                isListDisplay: true,
                labelWidth: ''
              },
              {
                type: 'input',
                label: '回复用户',
                span: 16,
                display: true,
                hideLabel: false,
                prop: 'huifyh',
                isListDisplay: true,
              }
            ]
          }
        ]
      },
      option2:{
        submitBtn: false,
        emptyBtn: false,
        group:[
          {
            label: '留言信息',
            prop: 'lyxx',
            icon: 'el-icon-edit-outline',
            column: [
              {
                type: 'input',
                label: '留言标题',
                span: 16,
                display: true,
                hideLabel: false,
                prop: 'liuybt',
                isListDisplay: true,
                readonly:true,
              },
              {
                type: 'input',
                label: '留言分类',
                span: 16,
                display: true,
                hideLabel: false,
                prop: 'liuyfl',
                isListDisplay: true,
                readonly:true,
              },
              {
                type: 'textarea',
                label: '留言内容',
                span: 16,
                display: true,
                hideLabel: false,
                prop: 'liuynr',
                isListDisplay: true,
                readonly:true,
              },
              {
                type: 'input',
                label: '留言用户',
                span: 16,
                display: true,
                hideLabel: false,
                prop: 'liuyyh',
                isListDisplay: true,
                readonly:true,
              },
              {
                type: 'input',
                label: '联系电话',
                span: 16,
                display: true,
                hideLabel: false,
                prop: 'dianh',
                isListDisplay: true,
                readonly:true,
              }
            ],
          },
          {
            label: '留言回复',
            prop: 'lyhf',
            icon: 'el-icon-edit-outline',
            column:[
              {
                type: 'textarea',
                label: '回复内容',
                span: 16,
                display: true,
                hideLabel: false,
                prop: 'huifnr',
                isListDisplay: true,
                labelWidth: '',
                readonly:true,
                rules: [{
                  required: true,
                  message: "请输入回复内容",
                  trigger: "blur"
                }]
              },
              {
                type: 'input',
                label: '回复用户',
                span: 16,
                display: true,
                hideLabel: false,
                prop: 'huifyh',
                isListDisplay: true,
                readonly:true,
              }
            ]
          }
        ]
      }
    };
  },
  computed: {
    ...mapGetters(["permission"]),
    permissionList () {
      return {
        addBtn: this.vaildData(
          this.permission[`outsys-zxly-add`],
          false
        ),
        viewBtn: this.vaildData(
          this.permission[`outsys-zxly-view`],
          false
        ),
        editBtn: this.vaildData(
          this.permission[`outsys-zxly-edit`],
          false
        ),
        delBtn: this.vaildData(
          this.permission[`outsys-zxly-del`],
          false
        ),
        huifuBtn: this.vaildData(
          this.permission[`outsys-zxly-tijiao`],
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
  watch: {

  },
  methods: {
    initData (/*type*/) { },
    refreshChange () {
      this.onLoad(this.page, this.query);
    },
    beforeOpen (done, type) {
      if (["add", "edit", "view"].includes(type)) {
        if(type == "add"){
          getInfo().then(res => {
            const info = res.data.data
            this.listForm.liuyyh = info.realName
            this.listForm.dianh = info.mobile
          })
        }
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
      if(this.$route.query.liuybt){
        this.query = {liuybt :this.$route.query.liuybt}
        delete this.$route.query.liuybt
      }
      const dataParam = {
        metaObjName:this.metaObjName,
        systemCode:this.systemCode,
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
        this.loading = false;
        this.selectionClear();
      });
    },

    //查看
    async comFormMagView (row, index) {
      const params = new URLSearchParams();
      params.append("id", row.id);
      viewListData(params).then((res) => {
        if(res.data.data.huifyh && res.data.data.huifnr){
          this.form = res.data.data
          this.option = this.option2
          this.dataMagFormTag = true
        }else{
          this.$refs.listRef.rowView(row, index);
        }
      })
    },

    //新增
    rowSave (row, done, loading) {

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
    // async comFormMagUpdate (row, index) {
    //   this.$refs.listRef.rowEdit(row, index);
    // },

    // rowUpdate (row, index, done, loading) {
    //   saveOrUpdateListData(row).then(() => {
    //     done();
    //     this.onLoad(this.page);
    //     this.$message({
    //       type: "success",
    //       message: "操作成功!"
    //     });
    //   }, error => {
    //     window.console.log(error);
    //     loading();
    //   });
    // },

    //删除
    // comFormMagDel (row) {
    //   this.$confirm("确定将选择数据删除?", {
    //     confirmButtonText: "确定",
    //     cancelButtonText: "取消",
    //     type: "warning",
    //   })
    //     .then(() => {
    //       const params = new URLSearchParams();
    //       params.append("id", row.id);
    //       return deleteListData(params);
    //     })
    //     .then(() => {
    //       this.$message({
    //         type: "success",
    //         message: "操作成功!",
    //       });
    //       this.refreshChange();
    //     });
    // },

    //提交
    comFormHuifu (row) {
      const params = new URLSearchParams();
      params.append("id", row.id);
      viewListData(params).then((res) => {
        this.form = res.data.data
        this.option = this.option1
        this.dataMagFormTag = true
      })
      getInfo().then(res => {
        const info = res.data.data
        this.form.huifyh = info.realName
      })
    },
    handleSubmit (form, done) {
      const params = {
        id:form.id,
        huifnr:form.huifnr,
        huifyh:form.huifyh
      }
      submitListData(params).then(() => {
        this.$message({
          type: "success",
          message: "操作成功!",
        });
        this.dataMagFormTag = false
        this.form = {}
        this.refreshChange();
        done()
      })
    },
    handleReset () {
      this.dataMagFormTag = false
      this.form = {}
    }
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

