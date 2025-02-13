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

        
      <template slot-scope="scope" slot="menuLeft">
        <el-button v-if="permissionList.exportExcel" size="small" icon="el-icon-download" type="primary"
          @click="exportExcel">
          导出
        </el-button>
        <el-upload v-if="permissionList.uploadBtn" :auto-upload="false" :show-file-list="false" action="action"
          :on-change="handleChange">
          <el-button type="primary" icon="el-icon-upload2">导入</el-button>
        </el-upload>
        <el-button v-if="permissionList.downloadExcel" type="primary" @click="downloadExcel">下载导入模版</el-button>
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
import { baseURL } from "@/api/common";
import { dateFormat } from "@/util/date";
import { mapGetters } from "vuex";
import {
  getListData,
  saveOrUpdateListData,
  delListData,
  submitListData,
  auditListData,
  auditNoListData,
  importTemplateFile,
  importExcel,
  exportExcel,
  getById
} from "@/api/outSystem/sallCheck";
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
        labelWidth: 140,
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
            width:120,
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
            type: 'select',
            label: '注册类型',
            cascaderItem: [],
            span: 16,
            display: true,
            props: {
              label: 'name',
              value: 'name'
            },
            hideLabel: false,
            prop: 'zhuclx',
            isListDisplay: true,
            dicUrl: '/aicos/api/aicos-system/baseDict/getDictItemListByDictCode',
            dicMethod: 'post',
            dicQuery: {
              code: 'yhlx'
            },
            width:120,
            search:true,
          },
          {
            type: 'input',
            label: '营业执照编号',
            span: 16,
            display: true,
            hideLabel: false,
            prop: 'gongsyyzzbh',
            isListDisplay: true,
            width:180,
          },
          {
            type: 'input',
            label: '注册资金',
            span: 16,
            display: true,
            hideLabel: false,
            prop: 'zhuczj',
            isListDisplay: true,
            width:120,
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
            width:180,
          },
          {
            type: 'input',
            label: '安全评价机构',
            span: 16,
            display: true,
            hideLabel: false,
            prop: 'anqpjjg',
            isListDisplay: true,
            width:180,
          },
          {
            type: 'textarea',
            label: '评价结论',
            span: 16,
            display: true,
            overHidden:true,
            hideLabel: false,
            prop: 'pingjjl',
            isListDisplay: true,
            width:180,
          },
          {
            type: 'textarea',
            label: '发生违规行为',
            span: 16,
            display: true,
            overHidden: true,
            hideLabel: false,
            prop: 'faswgxw',
            isListDisplay: true,
            width:180,
          },
          {
            type: 'date',
            label: '发生违规行为时间',
            span: 16,
            display: true,
            format: 'yyyy-MM-dd',
            valueFormat: 'yyyy-MM-dd',
            hideLabel: false,
            dataType: 'datetime',
            prop: 'faswgxwsj',
            isListDisplay: true,
            width:200,
          },
          {
            type: 'textarea',
            label: '发生死亡安全生产事故情况',
            span: 16,
            display: true,
            hideLabel: false,
            overHidden: true,
            prop: 'fasswaqscsgqk',
            isListDisplay: true,
            width:180,
          },
          {
            type: 'input',
            label: '联系人',
            span: 16,
            display: true,
            hideLabel: false,
            prop: 'lianxr',
            isListDisplay: true,
            width:120,
          },
          {
            type: 'input',
            label: '联系方式',
            span: 16,
            display: true,
            hideLabel: false,
            prop: 'lianxfs',
            isListDisplay: true,
            width:120,
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
            hide:true
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
          this.permission[`outsys-sall-add`],
          false
        ),
        viewBtn: this.vaildData(
          this.permission[`outsys-sall-view`],
          false
        ),
        editBtn: this.vaildData(
          this.permission[`outsys-sall-edit`],
          false
        ),
        delBtn: this.vaildData(
          this.permission[`outsys-sall-del`],
          false
        ),
        tijiaoBtn: this.vaildData(
          this.permission[`outsys-sall-tijiao`],
          false
        ),
        shenheBtn: this.vaildData(
          this.permission[`outsys-sall-shenhe`],
          false
        ),
        //导入
        uploadBtn: this.vaildData(
          this.permission[`outsys-sall-armyUploadBtn`],
          false
        ),
        // 模版下载
        downloadExcel: this.vaildData(
          this.permission["outsys-sall-download"],
          false
        ),
        // 导出
        exportExcel: this.vaildData(
          this.permission["sys-sall-export"],
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
    // 导出
    exportExcel () {
      const data = {}
      exportExcel(data).then((res) => {
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
    // 验证表格格式
    beforeAvatarUpload (file) {
      // 通过split方法和fileArr方法获取到文件的后缀名
      let fileArr = file.name.split('.')
      let suffix = fileArr[fileArr.length - 1]
      if (!/(xls|xlsx)/i.test(suffix)) {
        this.$message({
          message: "文件格式错误！",
          type: 'error'
        })
        return false
      }
      // if (file.size > 2 * 1024 * 1024) {
      //   this.$message('文件过大，请上传小于2MB的文件〜')
      //   return false
      // }
      return true
    },
    // 导入
    handleChange (file, fileLis) {
      //判断是否符合beforeAvatarUpload方法中的条件
      if (this.beforeAvatarUpload(file)) {
        this.fileList.name = file.name
        this.fileList.url = ''
        var formdata = new FormData()
        formdata.append('file', file.raw)
        importExcel(formdata).then((res) => {
          if (res.status === 200) {
            this.$message({
              message: "上传成功！",
              type: 'success'
            })
            this.onLoad(this.page);
          } else {
            this.$message({
              message: res.msg,
              type: 'error'
            })
          }
        }).catch((res) => {
          this.$message({
            message: res.msg,
            type: 'success'
          })
          this.onLoad(this.page);
        })
      }
    },
    // 下载模板
    downloadExcel () {
      const dataParam = {};
      let fileName =
        "数据模板_" +
        dateFormat(new Date(), "hh_mm_ss").toString() +
        ".xlsx";
      importTemplateFile(dataParam).then(
        (res) => {
          // console.log("获取模版",res.data.data.substring(1))
          const urlRes = `${baseURL}` + res.data.data.substring(1);
          this.downFile(urlRes, fileName);

          this.$message({
            type: "success",
            message: "操作成功!",
          });
        },
        (error) => {
          window.console.log(error);
        }
      );
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
      let fujarr = []
      row.fuj.forEach((item) => {
        fujarr.push(item.value)
      })
      row.fuj = fujarr.join(',')
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
</style>
