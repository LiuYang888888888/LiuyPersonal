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

      <template #zhuangt="scope">
        <el-tag v-if="scope.row.zhuangt == 1" effect="dark" type="info">草稿</el-tag>
        <el-tag v-if="scope.row.zhuangt == 2" type="danger">已提交</el-tag>
        <el-tag v-if="scope.row.zhuangt == 3" effect="dark" type="danger">审核不通过</el-tag>
        <el-tag v-if="scope.row.zhuangt == 4" effect="dark" type="success">审核通过</el-tag>
      </template>

        
      <template slot-scope="scope" slot="menuLeft">
        <el-button v-if="permissionList.exportExcel" size="small" icon="el-icon-download" type="primary" @click="exportExcel">
          导出
        </el-button>
      </template>

      <template #benndysqk="{row}">
        <el-button type="text" size="small" @click="benndysqk(row)">详情</el-button>
      </template>
      <template #shangndysqk="{row}">
        <el-button type="text" size="small" @click="shangndysqk(row)">详情</el-button>
      </template>

      <template v-slot:menu="scope">
        <el-button type="text" size="small" v-if="permissionList.viewBtn" @click="comFormMagView(scope.row)">查看
        </el-button>
        <el-button type="text" size="small" v-if="(scope.row.zhuangt == 1 || scope.row.zhuangt == 3) && permissionList.editBtn"
          @click="comFormMagUpdate(scope.row)">编辑
        </el-button>
        <el-button type="text" size="small" v-if="(scope.row.zhuangt == 1 || scope.row.zhuangt == 3) && permissionList.tijiaoBtn"
          @click="comFormTijiao(scope.row)">提交
        </el-button>
        <el-button type="text" size="small" v-if="scope.row.zhuangt == 2 && permissionList.shenheBtn"
          @click="comFormShenhe(scope.row)">审核
        </el-button>
        <el-button type="text" size="small" v-if="(scope.row.zhuangt == 1 || scope.row.zhuangt == 3) && permissionList.delBtn"
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

    <!--本年度营收详情-->
    <HuilanDialog :title="benndTitle" :fullscreen="false" append-to-body :before-close="benndlose"
      :visible.sync="benndTag">
      <el-table
        :data="bentabledata"
        border
        style="width: 80%;margin: 0 auto;">
        <el-table-column
          align="center"
          label="销售收入（万元）"
        >
          <template slot-scope="{ row }">
            <span>{{ row.benndxssr }}</span>
          </template>
        </el-table-column>

        <el-table-column
          align="center"
          label="人均年收入（万元）"
        >
          <template slot-scope="{ row }">
            <span>{{ row.benndrjsr }}</span>
          </template>
        </el-table-column>

        <el-table-column
          align="center"
          label="安全投入（万元）"
        >
          <template slot-scope="{ row }">
            <span>{{ row.benndaqtr }}</span>
          </template>
        </el-table-column>

        <el-table-column
          align="center"
          label="奖励加分事项"
        >
          <template slot-scope="{ row }">
            <span>{{ row.benndjljfx }}</span>
          </template>
        </el-table-column>

        <el-table-column
          align="center"
          label="否决项"
        >
          <template slot-scope="{ row }">
            <span>{{ row.benndfjx }}</span>
          </template>
        </el-table-column>
      </el-table>
    </HuilanDialog>

     <!--上年度营收详情-->
     <HuilanDialog :title="shangndTitle" :fullscreen="false" append-to-body :before-close="shangndlose"
      :visible.sync="shangndTag">
      <el-table
        :data="shangtabledata"
        border
        style="width: 80%;margin: 0 auto;">
        <el-table-column
          align="center"
          label="销售收入（万元）"
        >
          <template slot-scope="{ row }">
            <span>{{ row.shangndxssr }}</span>
          </template>
        </el-table-column>

        <el-table-column
          align="center"
          label="人均年收入（万元）"
        >
          <template slot-scope="{ row }">
            <span>{{ row.shangndrjsr }}</span>
          </template>
        </el-table-column>

        <el-table-column
          align="center"
          label="安全投入（万元）"
        >
          <template slot-scope="{ row }">
            <span>{{ row.shangndaqtr }}</span>
          </template>
        </el-table-column>

        <el-table-column
          align="center"
          label="奖励加分事项"
        >
          <template slot-scope="{ row }">
            <span>{{ row.shangndjljf }}</span>
          </template>
        </el-table-column>

        <el-table-column
          align="center"
          label="否决项"
        >
          <template slot-scope="{ row }">
            <span>{{ row.shangndfjx }}</span>
          </template>
        </el-table-column>
      </el-table>
    </HuilanDialog>
  </basic-container>
</template>

<script>
import {baseURL} from "@/api/common";
import { mapGetters } from "vuex";
import {
  getListData,
  saveOrUpdateListData,
  delListData,
  submitListData,
  auditListData,
  auditNoListData,
  exportExcel,
  getById
} from "@/api/outSystem/safeManage";


const baseUrl = process.env.BASE_URL;

export default {
  data () {
    return {
      newImg:`${baseUrl}img/new.png`,
      dataMagFormTag: false,
      btnLoading: false,
      dataMagFormTitle: '审核',
      formVerifyText: '',
      metaObjName: 'my_survey',
      systemCode: 'AiCOS',

      benndTitle:'本年度营收情况',
      benndTag:false,
      bentabledata:[],

      shangndTitle:'上年度营收情况',
      shangndTag:false,
      shangtabledata:[],

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
            label: '企业名称',
            span: 16,
            display: true,
            hideLabel: false,
            prop: 'biaot',
            isListDisplay: true,
            search: true,
            required: true,
            rules: [
              {
                required: true,
                message: '企业名称必须填写'
              }
            ],
          },
          {
            type: 'textarea',
            label: '企业简介',
            span: 16,
            display: true,
            overHidden:true,
            hideLabel: false,
            prop: 'jianj',
            isListDisplay: true,
            required: true,
            rules: [
              {
                required: true,
                message: '企业简介必须填写'
              }
            ],
          },
          {
            type: 'input',
            label: '本年度营收情况',
            span: 16,
            display: false,
            prop: 'benndysqk',
            isListDisplay: true,
            value: '详情'
          },
          {
            type: 'input',
            label: '上年度营收情况',
            span: 16,
            display: false,
            hideLabel: false,
            prop: 'shangndysqk',
            isListDisplay: true,
            value: '详情'
          },
          {
            type: 'select',
            label: '状态',
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
            dicUrl: '/aicos/api/aicos-system/baseDict/getDictItemListByDictCode',
            dicMethod: 'post',
            dicQuery: {
              code: 'shenhezt'
            },
          },
          {
            type: 'input',
            label: '审核理由',
            span: 16,
            display: false,
            hideLabel: false,
            prop: 'shenhly',
            isListDisplay: true,
            width: 100,
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
        group: [
          {
            label: '上年度营收情况',
            prop: 'benndfjx',
            arrow: true,
            collapse: true,
            display: true,
            column: [
              {
                type: 'input',
                label: '销售收入',
                span: 16,
                display: true,
                hideLabel: false,
                prop: 'shangndxssr',
                isListDisplay: true,
                hide:true,
                append: '万元',
                required: true,
            rules: [
              {
                required: true,
                message: '企业简介必须填写'
              }
            ],
              },
              {
                type: 'input',
                label: '人均年收入',
                span: 16,
                display: true,
                hideLabel: false,
                prop: 'shangndrjsr',
                hide:true,
                append: '万元'
              },
              {
                type: 'input',
                label: '安全投入',
                span: 16,
                display: true,
                hideLabel: false,
                prop: 'shangndaqtr',
                isListDisplay: true,
                hide:true,
                append: '万元'
              },
              {
                type: 'input',
                label: '奖励加分事项',
                span: 16,
                display: true,
                hideLabel: false,
                prop: 'shangndjljf',
                isListDisplay: true,
                hide:true,
              },
              {
                type: 'input',
                label: '否决项',
                span: 16,
                display: true,
                hideLabel: false,
                prop: 'shangndfjx',
                isListDisplay: true,
                hide:true,
                value: '无'
              }
            ]
          },
          {
            label: '本年度营收情况',
            prop: 'benndjljfx',
            arrow: true,
            collapse: true,
            display: true,
            column: [
              {
                type: 'input',
                label: '销售收入',
                span: 16,
                display: true,
                hideLabel: false,

                prop: 'benndxssr',
                isListDisplay: true,
                append: '万元',
                hide:true,
              },
              {
                type: 'input',
                label: '人均年收入',
                span: 16,
                display: true,
                hideLabel: false,
                prop: 'benndrjsr',
                isListDisplay: true,
                hide:true,
                append: '万元'
              },
              {
                type: 'input',
                label: '安全投入',
                span: 16,
                display: true,
                hideLabel: false,
                prop: 'benndaqtr',
                isListDisplay: true,
                hide:true,
                append: '万元'
              },
              {
                type: 'input',
                label: '奖励加分事项',
                span: 16,
                display: true,
                hideLabel: false,
                prop: 'benndjljfx',
                isListDisplay: true,
                hide:true,
              },
              {
                type: 'input',
                label: '否决项',
                span: 16,
                display: true,
                hideLabel: false,
                prop: 'benndfjx',
                isListDisplay: true,
                hide:true,
                value: '无'
              }
            ]
          },
          
        ]
      },
      
    };
  },
  computed: {
    ...mapGetters(["permission"]),
    permissionList () {
      return {
        addBtn: this.vaildData(
          this.permission[`outsys-safeman-add`],
          false
        ),
        viewBtn: this.vaildData(
          this.permission[`outsys-safeman-view`],
          false
        ),
        editBtn: this.vaildData(
          this.permission[`outsys-safeman-edit`],
          false
        ),
        delBtn: this.vaildData(
          this.permission[`outsys-safeman-del`],
          false
        ),
        tijiaoBtn: this.vaildData(
          this.permission[`outsys-safeman-tijiao`],
          false
        ),
        shenheBtn: this.vaildData(
          this.permission[`outsys-safeman-shenhe`],
          false
        ),
        // 导出
        exportExcel: this.vaildData(
          this.permission["outsys-safeman-export"],
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
    //本年度详情
    benndysqk(row){
      this.bentabledata = []
      this.bentabledata.push(row)
      this.benndTag = true
    },
    //上年度详情
    shangndysqk(row){
      this.shangtabledata = []
      this.shangtabledata.push(row)
      this.shangndTag = true
    },
    // 导出
    exportExcel(){
      const data = {}
      exportExcel(data).then((res)=>{
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
