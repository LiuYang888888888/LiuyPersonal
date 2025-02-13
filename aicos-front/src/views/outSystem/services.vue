<template>
  <basic-container>
    <!-- <HuilanBasicToolbar style="margin-top: 0;text-align: left;">
      <el-button type="primary" size="small" @click="comFormMagAdd">新增</el-button>
    </HuilanBasicToolbar> -->
    <avue-crud :option="listOption" :table-loading="loading" :data="listData" ref="listRef" v-model="listForm"
      :page.sync="page" :permission="permissionList" :before-open="beforeOpen" :before-close="beforeClose"
      @search-change="searchChange" @search-reset="searchReset" @selection-change="selectionChange"
      @current-change="currentChange" @size-change="sizeChange" @refresh-change="refreshChange" @on-load="onLoad"
      @row-save="rowSave" @row-update="rowUpdate">
      <template slot="fuwmc" slot-scope="scope">
        <div class="fuwmc">
          <img v-if="scope.row.read_status == 0" :src="newImg" alt="未读消息" style="width: 1.4rem;height: auto;" />
          <span>{{scope.row.fuwmc}}</span>
        </div>
      </template>
      <template slot-scope="scope" slot="menuLeft">
        <el-button v-if="permissionList.exportExcel" size="small" icon="el-icon-download" type="primary" @click="exportExcel">
          导出
        </el-button>
      </template>
      <template v-slot:menu="scope">
        <el-button type="text" size="small" v-if="permissionList.viewBtn" @click="comFormMagView(scope.row)">查看
        </el-button>
        <el-button type="text" size="small"  v-if="(scope.row.zhuangt == 1 || scope.row.zhuangt == 3) && permissionList.editBtn" @click="comFormMagUpdate(scope.row)">编辑
        </el-button>
        <el-button type="text" size="small" v-if="(scope.row.zhuangt == 1 || scope.row.zhuangt == 3) && permissionList.tijiaoBtn" @click="comFormTijiao(scope.row)">提交
        </el-button>
        <el-button type="text" size="small" v-if="scope.row.zhuangt == 2 && permissionList.shenheBtn" @click="comFormShenhe(scope.row)">审核
        </el-button>
        <el-button type="text" size="small"  v-if="(scope.row.zhuangt == 1 || scope.row.zhuangt == 3) && permissionList.delBtn" @click="comFormMagDel(scope.row)">删除
        </el-button>
      </template>
    </avue-crud>
    <!--审核弹窗-->
    <HuilanDialog :title="dataMagFormTitle" :fullscreen="false" append-to-body :before-close="dataMagFormClose"
      :visible.sync="dataMagFormTag" class="dataMagFormClass">
        <div class="dataMagFormFooter">
          <div class="formVerifyClass">
            <el-input type="textarea" v-model="formVerifyText" placeholder="请输入审核意见" rows="4" />
          </div>
          <div class="dataMagFormBtns">
            <el-button size="small" icon="el-icon-check" type="success" @click.stop="dataMagVerifyYes" :loading="btnLoading">审核通过
            </el-button>
            <el-button size="small" icon="el-icon-close" type="warning"
              @click.stop="dataMagVerifyNo" :loading="btnLoading">审核不通过
            </el-button>
            <el-button size="small" icon="el-icon-circle-close" @click="dataMagFormClose">取 消</el-button>
          </div>
        </div>
    </HuilanDialog>
  </basic-container>
</template>

<script>
import { mapGetters } from "vuex";
import {baseURL} from "@/api/common";
import {
  getListDataPro,
  saveOrUpdateListDataPro,
  delListDataPro,
  submitListDataPro,
  auditListDataPro,
  auditNoListDataPro,
  getInfo,
  exportExcelxm,
  viewListDataPro
} from "@/api/outSystem/agency";

const baseUrl = process.env.BASE_URL;
export default {
  data () {
    return {
      newImg:`${baseUrl}img/new.png`,
      dataMagFormTag:false,
      btnLoading:false,
      dataMagFormTitle:'审核',
      formVerifyText:'',
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
        height: 'auto',
        align: 'center',
        searchShow: true,
        tip: false,
        border: true,
        editBtn: false,
        delBtn: false,
        index: true,
        indexLabel: '序号',
        indexWidth: 100,
        viewBtn: false,
        selection: true,
        labelPosition: 'right',
        labelSuffix: '',
        labelWidth: 120,
        gutter: 0,
        menuPosition: 'center',
        isCustom: false,
        excelBtn:false,
        column: [
          {
            type: 'input',
            label: '服务名称',
            span: 16,
            display: true,
            hideLabel: false,
            prop: 'fuwmc',
            isListDisplay: true,
            searchSpan:5,
            search: true,
            order:1,
          },
          {
            type: 'input',
            label: '发布者',
            span: 16,
            display: true,
            hideLabel: false,
            prop: 'fabz',
            isListDisplay: true,
            order:7,
          },
          {
            type: 'input',
            label: '联系人',
            span: 16,
            display: true,
            hideLabel: false,
            prop: 'lianxr',
            isListDisplay: true,
            order:5,
          },
          {
            type: 'input',
            label: '联系电话',
            span: 16,
            display: true,
            hideLabel: false,
            prop: 'lianxdh',
            isListDisplay: true,
            order:6,
          },
          {
            type: 'input',
            label: '电子邮箱',
            span: 16,
            display: true,
            hideLabel: false,
            prop: 'dianzyx',
            isListDisplay: true,
            order:8,
          },
          {
            type: 'select',
            label: '服务领域',
            dicUrl: '/aicos/api/aicos-system/baseDict/getDictItemListByDictCode',
            dicMethod: 'post',
            dicQuery: {
              code: 'fuwulingyu'
            },
            cascaderItem: [],
            span: 16,
            display: true,
            props: {
              label: 'name',
              value: 'name'
            },
            hideLabel: false,
            prop: 'fuwly',
            isListDisplay: true,
            search: true,
            searchSpan:4,
            order:2,
          },
          {
            type: 'textarea',
            label: '服务范围',
            span: 16,
            display: true,
            hideLabel: false,
            overHidden:true,
            prop: 'fuwfw',
            isListDisplay: true,
            order:3,
          },
          {
            type: 'input',
            label: '服务对象',
            span: 16,
            display: true,
            hideLabel: false,
            prop: 'fuwdx',
            isListDisplay: true,
            hide: true,
            order:4,
          },
          {
            type: 'input',
            label: '服务方式',
            span: 16,
            display: true,
            hideLabel: false,
            prop: 'fuwfs',
            isListDisplay: true,
            hide: true,
            order:4,
          },
          {
            type: 'input',
            label: '服务流程',
            span: 16,
            display: true,
            hideLabel: false,
            prop: 'fuwlc',
            isListDisplay: true,
            hide: true,
            order:4,
          },
          {
            type: 'select',
            label: '收费模式',
            cascaderItem: [],
            span: 16,
            display: true,
            props: {
              label: 'name',
              value: 'name'
            },
            hideLabel: false,
            prop: 'shoufms',
            isListDisplay: true,
            hide: true,
            dicUrl: '/aicos/api/aicos-system/baseDict/getDictItemListByDictCode',
            dicMethod: 'post',
            dicQuery: {
              code: 'shoufeims'
            },
            order:4,
          },
          {
            type: 'input',
            label: '服务价格',
            span: 16,
            display: true,
            hideLabel: false,
            prop: 'jiag',
            isListDisplay: true,
            order:4,
          },
          {
            type: 'select',
            label: '审核状态',
            dicUrl: '/aicos/api/aicos-system/baseDict/getDictItemListByDictCode',
            dicMethod: 'post',
            dicQuery: {
              code: 'shenhezt'
            },
            cascaderItem: [],
            span: 16,
            display: false,
            props: {
              label: 'name',
              value: 'value'
            },
            hideLabel: false,
            prop: 'zhuangt',
            isListDisplay: true,
            search: true,
            searchSpan:4,
          },
          {
            type: 'textarea',
            label: '审核理由',
            span: 16,
            display: false,
            hideLabel: false,
            prop: 'shenhly',
            isListDisplay: true,
          },
          {
            type: 'cascader',
            label: '行政区划',
            span: 16,
            isRegionTree: true,
            display: false,
            hide:true,
            cascaderIndex: 1,
            showAllLevels: true,
            separator: '/',
            dicUrl: '/aicos/api/aicos-form/baseForm/getFullRegionTree',
            dicMethod: 'post',
            dicFormatter: function(e) {
              var t = e.data,
                i = function e(t) {
                  t.forEach((function(t) {
                    t.children && 0 === t.children.length ? Reflect.deleteProperty(t, "children") : e(t.children)
                  }))
                };
              return i(t),
              t
            },
            props: {
              label: 'name',
              value: 'name',
              res: 'data'
            },
            hideLabel: false,
            prop: 'xingzqh',
            isListDisplay: true,
            search: true,
            searchSpan:6,
            dicQuery: {}
          },
          {
            type: 'select',
            label: '信息排序',
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
            span: 16,
            display: false,
            hide:true,
            props: {
              label: 'label',
              value: 'value'
            },
            hideLabel: false,
            prop: 'xinxpx',
            isListDisplay: true,
            search: false,
            searchSpan:4,
          },
          {
            type: 'date',
            label: '新增时间段',
            span: 16,
            display: false,
            hide:true,
            format: 'yyyy-MM-dd',
            valueFormat: 'yyyy-MM-dd',
            hideLabel: false,
            dataType: 'datetime',
            prop: 'shijd',
            isListDisplay: true,
            search: true,
            searchSpan:10,
            searchRange: true,
            searchLabelWidth:100
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
          this.permission[`outsys-services-add`],
          false
        ),
        viewBtn: this.vaildData(
          this.permission[`outsys-services-view`],
          false
        ),
        editBtn: this.vaildData(
          this.permission[`outsys-services-edit`],
          false
        ),
        delBtn: this.vaildData(
          this.permission[`outsys-services-del`],
          false
        ),
        tijiaoBtn: this.vaildData(
          this.permission[`outsys-services-tijiao`],
          false
        ),
        shenheBtn: this.vaildData(
          this.permission[`outsys-services-shenhe`],
          false
        ),
        // 导出
        exportExcel: this.vaildData(
          this.permission["sys-services-export"],
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
    $route: "getActiveForm",
    "desktopWindow.data": {
      handler (/*newVal*/) {
        this.getActiveForm();
      },
      deep: true,
    },
    magParamsData: {
      handler (/*newVal*/) {
        //console.log(newVal)
        this.getActiveForm();
      },
      deep: true,
    },
  },
  created () {
    this.Info();
  },
  methods: {
    // 导出
    exportExcel(){
      const data = {}
      exportExcelxm(data).then((res)=>{
        const urlRes = `${baseURL}` + res.data.data.substring(1);
        //console.log(urlRes);
        this.downFile(urlRes /*, fileName*/);
        this.refreshChange();
        this.$message({
          type: "success",
          message: "操作成功!",
        });
      }),
      (error) => {
        window.console.log(error);
      }
    },
    Info(){
      getInfo().then( res => {
        const info = res.data.data
        this.listForm.fabz = info.realName
        this.listForm.lianxr = info.contacts
        this.listForm.lianxdh = info.mobile
      })
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
        reqPage: {
          current: page.currentPage,
          size: page.pageSize,
        },
        searchParam: {
          ...this.query,
        },
      };
      getListDataPro(dataParam).then((res) => {
        const dataRes = res.data.data;
        this.page.total = dataRes.rspPage.totalItems;
        this.page.pageSize = dataRes.rspPage.size;
        this.page.currentPage = dataRes.rspPage.current;
        dataRes.fieldList.forEach( e =>{
          if(e.xingzqh){
            e.xingzqh = e.xingzqh.replace(/,/g,"/")
          }
        })
        this.listData = dataRes.fieldList;
        this.loading = false;
        this.selectionClear();
      });
    },
    //查看
    async comFormMagView (row , index) {
      let param = new URLSearchParams()
      param.append("id", row.id)
      viewListDataPro(param).then((res) => {
        // this.onLoad(this.page);
      }, error => {
        window.console.log(error);
        this.onLoad(this.page);
      });
      this.$refs.listRef.rowView(row, index);
      this.refreshChange()
    },

    //新增
    rowSave (row, done, loading) {
      row.xingzqh = row.xingzqh.join(",")
      saveOrUpdateListDataPro(row).then(() => {0
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
    async comFormMagUpdate (row , index) {
      this.$refs.listRef.rowEdit(row, index);
    },

    rowUpdate (row, index, done, loading) {
      saveOrUpdateListDataPro(row).then(() => {
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
    comFormMagDel(row) {
      this.$confirm("确定将选择数据删除?", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          const params = new URLSearchParams();
          params.append("id",row.id);
          return delListDataPro(params);
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
    comFormTijiao(row){
      this.$confirm("确定提交?", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          const params = new URLSearchParams();
          params.append("id",row.id);
          return submitListDataPro(params);
        })
        .then(() => {
          this.$message({
            type: "success",
            message: "操作成功!",
          });
          this.refreshChange();
        });
    },
    //审核
    comFormShenhe(row){
      this.dataMagFormTag = true;
      this.dataFormId = row.id;
    },
    //审核通过
    dataMagVerifyYes(){
      this.btnLoading = true;
      const params = new URLSearchParams();
      params.append("id",this.dataFormId);
      params.append("processReason",this.formVerifyText);
      auditListDataPro(params).then(() => {
        this.btnLoading = false;
        this.refreshChange();
        this.dataMagFormClose();
        this.$message({
          type: "success",
          message: "操作成功!",
        });
      },(error) => {
        window.console.log(error);
      })
    },
    //审核不通过
    dataMagVerifyNo(){
      this.btnLoading = true;
      const params = new URLSearchParams();
      params.append("id",this.dataFormId);
      params.append("processReason",this.formVerifyText);
      auditNoListDataPro(params).then(() => {
        this.btnLoading = false;
        this.refreshChange();
        this.dataMagFormClose();
        this.$message({
          type: "success",
          message: "操作成功!",
        });
      },(error) => {
        window.console.log(error);
      })
    },
    dataMagFormClose () {
      this.formVerifyText = ''
      this.dataMagFormTag = false;
    },
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

<style lang="scss" scoped>
</style>
