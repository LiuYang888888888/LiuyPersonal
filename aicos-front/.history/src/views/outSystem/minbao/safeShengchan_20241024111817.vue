<template>
  <basic-container>
    <avue-crud :option="listOption" :table-loading="loading" :data="listData" ref="listRef" v-model="listForm"
      :page.sync="page" :permission="permissionList" :before-open="beforeOpen" :before-close="beforeClose"
      @search-change="searchChange" @search-reset="searchReset" @selection-change="selectionChange"
      @current-change="currentChange" @size-change="sizeChange" @refresh-change="refreshChange" @on-load="onLoad"
      @row-save="rowSave" @row-update="rowUpdate" :upload-preview="uploadPreview">
      <template slot="qiymc" slot-scope="scope">
        <div class="qiymc">
          <img v-if="scope.row.read_status == 0" :src="newImg" alt="未读消息" style="width: 1.4rem;height: auto;" />
          <span>{{scope.row.qiymc}}</span>
        </div>
      </template>

      <template #zhuangt="scope">
        <el-tag v-if="scope.row.zhuangt == 1" effect="dark" type="info">草稿</el-tag>
        <el-tag v-if="scope.row.zhuangt == 2" type="danger">已提交</el-tag>
        <el-tag v-if="scope.row.zhuangt == 3" effect="dark" type="danger">审核不通过</el-tag>
        <el-tag v-if="scope.row.zhuangt == 4" effect="dark" type="success">审核通过</el-tag>
      </template>

        
      <template v-slot:menu="scope">
        <el-button type="text" size="small" v-if="permissionList.viewBtn" @click="comFormMagView(scope.row)">查看
        </el-button>
        <el-button type="text" size="small"
          v-if="(scope.row.zhuangt == 1 || scope.row.zhuangt == 3) && permissionList.editBtn"
          @click="comFormMagUpdate(scope.row)">编辑
        </el-button>
        <el-button type="text" size="small"
          v-if="(scope.row.zhuangt == 1 || scope.row.zhuangt == 3) && permissionList.tijiaoBtn"
          @click="comFormTijiao(scope.row)">提交
        </el-button>
        <el-button type="text" size="small" v-if="scope.row.zhuangt == 2 && permissionList.shenheBtn"
          @click="comFormShenhe(scope.row)">审核
        </el-button>
        <el-button type="text" size="small"
          v-if="(scope.row.zhuangt == 1 || scope.row.zhuangt == 3) && permissionList.delBtn"
          @click="comFormMagDel(scope.row)">删除
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
          <el-button size="small" icon="el-icon-check" type="success" @click.stop="dataMagVerifyYes"
            :loading="btnLoading">审核通过
          </el-button>
          <el-button size="small" icon="el-icon-close" type="warning" @click.stop="dataMagVerifyNo"
            :loading="btnLoading">审核不通过
          </el-button>
          <el-button size="small" icon="el-icon-circle-close" @click="dataMagFormClose">取 消</el-button>
        </div>
      </div>
    </HuilanDialog>

  </basic-container>
</template>

<script>
import { mapGetters } from "vuex";
import {
  getListData,
  saveOrUpdateListData,
  delListData,
  submitListData,
  auditListData,
  auditNoListData,
  getById
} from "@/api/outSystem/safeShengchan";

const baseUrl = process.env.BASE_URL;

export default {
  data () {
    return {
      newImg:`${baseUrl}img/new.png`,
      // 上传数据
      fileList: [],

      dataMagFormTag: false,
      btnLoading: false,
      dataMagFormTitle: '审核',
      formVerifyText: '',
      metaObjName: 'my_survey',
      systemCode: 'AiCOS',

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
        stripe: false,
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
            label: '企业名称',
            span: 16,
            display: true,
            hideLabel: false,
            prop: 'qiymc',
            isListDisplay: true,
            search: true,
            width:120
          },
          {
            type: 'input',
            label: '企业法人',
            span: 16,
            display: true,
            hideLabel: false,
            prop: 'qiyfr',
            isListDisplay: true,
            width:120,
            search:true,
          },
          {
            type: 'input',
            label: '许可证编号',
            span: 16,
            display: true,
            hideLabel: false,
            prop: 'xukzbh',
            isListDisplay: true,
            width:150,
            search:true,
            searchLabelWidth: 100,
          },
          {
            type: 'date',
            label: '许可证有效期',
            span: 16,
            display: true,
            format: 'yyyy-MM-dd',
            valueFormat: 'yyyy-MM-dd',
            hideLabel: false,
            dataType: 'datetime',
            prop: 'xukzyxq',
            isListDisplay: true,
            width:160,
            search:true,
            searchLabelWidth: 110,
          },
          {
            type: 'textarea',
            label: '费用提取和使用情况',
            span: 16,
            display: true,
            hideLabel: false,
            overHidden:true,
            prop: 'feiytqhsyqk',
            isListDisplay: true,
            width:200
          },
          {
            type: 'textarea',
            label: '条件变化情况',
            span: 16,
            display: true,
            hideLabel: false,
            overHidden: true,
            prop: 'tiaojbhqk',
            isListDisplay: true,
            width:180
          },
          {
            type: 'textarea',
            label: '发生一般及以上生产安全事故情况',
            span: 16,
            display: true,
            overHidden: true,
            hideLabel: false,
            prop: 'fasybjysscaqsgqk',
            isListDisplay: true,
            width:200
          },
          {
            type: 'textarea',
            label: '违反安全生产法律法规或行业有头规定情况',
            span: 16,
            display: true,
            overHidden: true,
            hideLabel: false,
            prop: 'weifaqscflfghxyytgdqk',
            isListDisplay: true,
            width:200
          },
          {
            type: 'upload',
            label: '上传附件',
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
            prop: 'shangcfj',
            isListDisplay: true,
            listType: 'text',
            data: {
              fromSystemName: 'base'
            },
            hide:true,
          },
          {
            type: 'select',
            label: '状态',
            cascaderItem: [],
            span: 24,
            display: false,
            props: {
              label: 'name',
              value: 'value'
            },
            hideLabel: false,
            dataType: '',
            prop: 'zhuangt',
            isListDisplay: true,
            search: false,
            dicUrl: '/aicos/api/aicos-system/baseDict/getDictItemListByDictCode',
            dicMethod: 'post',
            dicQuery: {
              code: 'shenhezt'
            },
            width:100,
          },
          {
            type: 'input',
            label: '审核理由',
            span: 16,
            display: false,
            hideLabel: false,
            prop: 'shenhly',
            isListDisplay: true,
            width:100,
          },
          {
            type: 'datetime',
            label: '创建时间',
            span: 16,
            display: false,
            format: 'yyyy-MM-dd HH:mm:ss',
            valueFormat: 'yyyy-MM-dd HH:mm:ss',
            hideLabel: false,
            dataType: 'datetime',
            prop: 'create_time',
            isListDisplay: true,
            width:100,
          },
          {
            type: 'datetime',
            label: '提交时间',
            span: 16,
            display: false,
            format: 'yyyy-MM-dd HH:mm:ss',
            valueFormat: 'yyyy-MM-dd HH:mm:ss',
            hideLabel: false,
            dataType: 'datetime',
            prop: 'submit_time',
            isListDisplay: true,
            width:100,
          },
          {
            type: 'datetime',
            label: '审核时间',
            span: 16,
            display: false,
            format: 'yyyy-MM-dd HH:mm:ss',
            valueFormat: 'yyyy-MM-dd HH:mm:ss',
            hideLabel: false,
            dataType: 'datetime',
            prop: 'audit_time',
            isListDisplay: true,
            width:100,
          },
        ],
      },
    };
  },
  computed: {
    ...mapGetters(["permission"]),
    permissionList () {
      return {
        addBtn: this.vaildData(
          this.permission[`outsys-shengchan-add`],
          false
        ),
        viewBtn: this.vaildData(
          this.permission[`outsys-shengchan-view`],
          false
        ),
        editBtn: this.vaildData(
          this.permission[`outsys-shengchan-edit`],
          false
        ),
        delBtn: this.vaildData(
          this.permission[`outsys-shengchan-del`],
          false
        ),
        tijiaoBtn: this.vaildData(
          this.permission[`outsys-shengchan-tijiao`],
          false
        ),
        shenheBtn: this.vaildData(
          this.permission[`outsys-shengchan-shenhe`],
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
      this.refreshChange()
    },

    //新增
    rowSave (row, done, loading) {
      let fujarr = []
      row.shangcfj.forEach((item) => {
        fujarr.push(item.value)
      })
      row.shangcfj = fujarr.join(',')
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
      if (Array.isArray(row.xingzqy)) {
        row.xingzqy = row.xingzqy.join("/")
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
      this.$confirm("确定提交?", {
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
    //审核
    comFormShenhe (row) {
      this.dataMagFormTag = true;
      this.dataFormId = row.id;
    },
    //审核通过
    dataMagVerifyYes () {
      this.btnLoading = true;
      const params = new URLSearchParams();
      params.append("id", this.dataFormId);
      params.append("processReason", this.formVerifyText);
      auditListData(params).then(() => {
        this.btnLoading = false;
        this.refreshChange();
        this.dataMagFormClose();
        this.$message({
          type: "success",
          message: "操作成功!",
        });
      }, (error) => {
        window.console.log(error);
      })
    },
    //审核不通过
    dataMagVerifyNo () {
      this.btnLoading = true;
      const params = new URLSearchParams();
      params.append("id", this.dataFormId);
      params.append("processReason", this.formVerifyText);
      auditNoListData(params).then(() => {
        this.btnLoading = false;
        this.refreshChange();
        this.dataMagFormClose();
        this.$message({
          type: "success",
          message: "操作成功!",
        });
      }, (error) => {
        window.console.log(error);
      })
    },
    dataMagFormClose () {
      this.formVerifyText = ''
      this.dataMagFormTag = false;
    },
    uploadPreview(file){
      var http = window.location.protocol + "//"
      var url = window.location.host
      var url2 = http + url + file.url
      window.open(url2,'_self')
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
.warning-row {
  background-color: #DE2525 !important;
  color: #fff;
}
.warning-row.hover-row td,
.success-row.hover-row td {
  background-color: initial !important;
}
.warning-row .el-button--text{
  color: #fff !important;
}
</style>
