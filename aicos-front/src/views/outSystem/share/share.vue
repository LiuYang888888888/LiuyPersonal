<template>
  <basic-container>
    <el-tabs v-model="tabType" @tab-click="tabChange">
      <el-tab-pane name="ALL">
        <span slot="label"><i class="el-icon-s-order"></i> 我的</span>
      </el-tab-pane>
      <el-tab-pane name="TODO">
        <span slot="label"><i class="el-icon-s-management"></i> 共享</span>
      </el-tab-pane>
    </el-tabs>

    <avue-crud :option="listOption" :table-loading="loading" :data="listData" ref="listRef" v-model="listForm"
      :page.sync="page" :permission="permissionList" :before-open="beforeOpen" :before-close="beforeClose"
      @search-change="searchChange" @search-reset="searchReset" @selection-change="selectionChange"
      @current-change="currentChange" @size-change="sizeChange" @refresh-change="refreshChange" @on-load="onLoad"
      @row-save="rowSave" @row-update="rowUpdate">
      <template slot="chenggmc" slot-scope="scope">
        <div class="chenggmc">
          <img v-if="scope.row.read_status == 0" :src="newImg" alt="未读消息" style="width: 1.4rem;height: auto;" />
          <span>{{scope.row.chenggmc}}</span>
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
        <el-upload v-if="permissionList.uploadBtn && tabType =='ALL'" :auto-upload="false" :show-file-list="false" action="action"
          :on-change="handleChange">
          <el-button type="primary" icon="el-icon-upload2" ref="comp_chose">导入</el-button>
        </el-upload>
        <el-button v-if="permissionList.downloadExcel && tabType =='ALL'" type="primary" @click="downloadExcel">下载导入模版</el-button>
      </template>
      <template v-slot:menu="scope">
        <el-button type="text" size="small" v-if="permissionList.viewBtn" @click="comFormMagView(scope.row)">查看
        </el-button>
        <el-button type="text" size="small"
          v-if="tabType =='ALL' && (scope.row.zhuangt == 1 || scope.row.zhuangt == 3) && scope.row.isPersonalData && permissionList.editBtn"
          @click="comFormMagUpdate(scope.row)">编辑
        </el-button>
        <el-button type="text" size="small"
          v-if="tabType =='ALL' && (scope.row.zhuangt == 1 || scope.row.zhuangt == 3) && scope.row.isPersonalData && permissionList.tijiaoBtn"
          @click="comFormTijiao(scope.row)">提交
        </el-button>
        <el-button type="text" size="small" v-if="tabType =='ALL' && scope.row.zhuangt == 2 && permissionList.shenheBtn"
          @click="comFormShenhe(scope.row)">审核
        </el-button>
        <el-button type="text" size="small" v-if="tabType =='ALL' && scope.row.zhuangt == 4 && permissionList.shareBtn"
          @click="comFormShare(scope.row)">共享
        </el-button>
        <el-button type="text" size="small"
          v-if="tabType =='ALL' && (scope.row.zhuangt == 1 || scope.row.zhuangt == 3) && scope.row.isPersonalData && permissionList.delBtn"
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

    <!--共享单位-->
    <HuilanDialog :title="shareTitle" :fullscreen="false" append-to-body :before-close="shareClose"
      :visible.sync="shareTag" class="dataMagFormClass">
      <avue-form id="dataMagFormView" ref="dataMagFormRef" v-model="form" :option="option" v-if="showform" @submit="handleSubmit">
      </avue-form>
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
  importTemplateFile,
  importExcel,
  exportExcel,
  submitListData,
  auditListData,
  auditNoListData,
  getById,
  getListDataShare,
  getEnterList
} from "@/api/outSystem/share";
import {
  danwei
} from "@/api/outSystem/fileManage";

const baseUrl = process.env.BASE_URL;
export default {
  data () {
    return {
      newImg:`${baseUrl}img/new.png`,
      // 上传数据
      fileList: [],
      tabType: "ALL",

      shareTitle:'共享',
      shareTag:false,
      showform:false,
      form:{},
      option:{
        emptyBtn: false,
        column: [
          {
            type: 'input',
            label: '成果名称',
            span: 16,
            display: true,
            hideLabel: false,
            prop: 'chenggmc',
            isListDisplay: true,
            width:150,
            search:true,
            readonly:true,
            
          },
          {
            type: 'textarea',
            label: '成果简介',
            span: 16,
            display: true,
            overHidden:true,
            hideLabel: false,
            prop: 'chenggjj',
            isListDisplay: true,
            width:150,
            readonly:true,
          },
          {
            type: 'select',
            label: '共享单位',
            span: 16,
            display: true,
            dicData: [],
            props: {
              label: 'enterprise_name',
              value: 'enterprise_name',
            },
            hideLabel: false,
            prop: 'xiafdw',
            isListDisplay: true,
            multiple: true,
            filterable: true,
          },
        ]
      },

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
        labelWidth: 120,
        gutter: 0,
        menuAlign: 'center',
        menuPosition: 'center',
        isCustom: false,
        column: [
          {
            type: 'input',
            label: '成果名称',
            span: 16,
            display: true,
            hideLabel: false,
            prop: 'chenggmc',
            isListDisplay: true,
            width:150,
            search:true,
            required: true,
            rules: [
              {
                required: true,
                message: '成果名称必须填写'
              }
            ],
          },
          {
            type: 'textarea',
            label: '成果简介',
            span: 16,
            display: true,
            overHidden:true,
            hideLabel: false,
            prop: 'chenggjj',
            isListDisplay: true,
            width:150,
            required: true,
            rules: [
              {
                required: true,
                message: '成果简介必须填写'
              }
            ],
          },
          {
            type: 'input',
            label: '所属项目',
            span: 16,
            display: true,
            hideLabel: false,
            prop: 'suosxm',
            isListDisplay: true,
            width:150,
            search:true,
            required: true,
            rules: [
              {
                required: true,
                message: '所属项目必须填写'
              }
            ],
          },
          {
            type: 'cascader',
            label: '行政区划',
            span: 16,
            isRegionTree: true,
            display: true,
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
                  }
                  ))
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
            dicQuery: {},
            width:150,
            search:true,
            required: true,
            rules: [
              {
                required: true,
                message: '行政区划必须选择'
              }
            ],
          },
          {
            type: 'input',
            label: '所属行业',
            span: 16,
            display: true,
            hideLabel: false,
            prop: 'suosxy',
            isListDisplay: true,
            width:150,
            required: true,
            rules: [
              {
                required: true,
                message: '所属行业必须填写'
              }
            ],
          },
          {
            type: 'select',
            label: '应用领域',
            cascaderItem: [],
            span: 16,
            display: true,
            props: {
              label: 'name',
              value: 'name'
            },
            hideLabel: false,
            prop: 'yingyly',
            isListDisplay: true,
            dicUrl: '/aicos/api/aicos-system/baseDict/getDictItemListByDictCode',
            dicMethod: 'post',
            multiple: true,
            dicQuery: {
              code: 'jscpyyly'
            },
            width:150,
            search:false,
            required: true,
            rules: [
              {
                required: true,
                message: '应用领域必须选择'
              }
            ],
          },
          {
            type: 'input',
            label: '专利人',
            span: 16,
            display: true,
            hideLabel: false,
            prop: 'zhuanlr',
            isListDisplay: true,
            width:150,
            required: true,
            rules: [
              {
                required: true,
                message: '专利人必须填写'
              }
            ],
          },
          {
            type: 'select',
            label: '专利类型',
            cascaderItem: [],
            span: 16,
            display: true,
            props: {
              label: 'name',
              value: 'name'
            },
            hideLabel: false,
            prop: 'zhuanllx',
            isListDisplay: true,
            dicQuery: {
              code: 'zhuanlilx'
            },
            dicUrl: '/aicos/api/aicos-system/baseDict/getDictItemListByDictCode',
            dicMethod: 'post',
            width:150,
            search:true,
            required: true,
            rules: [
              {
                required: true,
                message: '专利类型必须选择'
              }
            ],
          },
          {
            type: 'input',
            label: '专利号',
            span: 16,
            display: true,
            hideLabel: false,
            prop: 'zhuanlh',
            isListDisplay: true,
            width:200,
            required: true,
            rules: [
              {
                required: true,
                message: '专利号必须填写'
              }
            ],
          },
          {
            type: 'input',
            label: '发明人',
            span: 16,
            display: true,
            hideLabel: false,
            prop: 'famr',
            isListDisplay: true,
            width:150,
            required: true,
            rules: [
              {
                required: true,
                message: '发明人必须填写'
              }
            ],
          },
          {
            type: 'textarea',
            label: '创新要点',
            span: 16,
            display: true,
            overHidden: true,
            hideLabel: false,
            prop: 'chuangxyd',
            isListDisplay: true,
            width:150,
            required: true,
            rules: [
              {
                required: true,
                message: '创新要点必须填写'
              }
            ],
          },
          {
            type: 'upload',
            label: '成果LOGO',
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
            prop: 'chengglogo',
            isListDisplay: true,
            listType: 'picture-img',
            data: {
              fromSystemName: 'base'
            },
            width:150,
            required: true,
            rules: [
              {
                required: true,
                message: '成果LOGO必须上传'
              }
            ],
          },
          {
            type: 'select',
            label: '密级',
            cascaderItem: [],
            span: 16,
            display: true,
            props: {
              label: 'name',
              value: 'name'
            },
            hideLabel: false,
            prop: 'mij',
            isListDisplay: true,
            dicQuery: {
              code: 'mj'
            },
            dicUrl: '/aicos/api/aicos-system/baseDict/getDictItemListByDictCode',
            dicMethod: 'post',
            required: true,
            rules: [
              {
                required: true,
                message: '密级必须选择'
              }
            ],
          },
          {
            type: 'date',
            label: '开始时间',
            span: 16,
            display: true,
            format: 'yyyy-MM-dd',
            valueFormat: 'yyyy-MM-dd',
            hideLabel: false,
            dataType: 'datetime',
            prop: 'kaissj',
            isListDisplay: true,
            width:150,
            required: true,
            rules: [
              {
                required: true,
                message: '开始时间必须选择'
              }
            ],
          },
          {
            type: 'date',
            label: '完成时间',
            span: 16,
            display: true,
            format: 'yyyy-MM-dd',
            valueFormat: 'yyyy-MM-dd',
            hideLabel: false,
            dataType: 'datetime',
            prop: 'jiessj',
            isListDisplay: true,
            width:150,
            required: true,
            rules: [
              {
                required: true,
                message: '完成时间必须选择'
              }
            ],
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
            width: 100,
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
            type: 'select',
            label: '是否共享',
            cascaderItem: [],
            span: 16,
            props: {
              label: 'name',
              value: 'value'
            },
            display: false,
            hideLabel: false,
            prop: 'xiafzt',
            isListDisplay: true,
            dicUrl: '/aicos/api/aicos-system/baseDict/getDictItemListByDictCode',
            dicMethod: 'post',
            dicQuery: {
              code: 'sharezhuangt'
            },
            width:120,
          },
          {
            type: 'input',
            label: '共享单位',
            span: 16,
            display: false,
            hideLabel: false,
            prop: 'xiafdw',
            isListDisplay: true,
            width:150,
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
          this.permission[`outsys-share-add`],
          false
        ),
        viewBtn: this.vaildData(
          this.permission[`outsys-share-view`],
          false
        ),
        editBtn: this.vaildData(
          this.permission[`outsys-share-edit`],
          false
        ),
        delBtn: this.vaildData(
          this.permission[`outsys-share-del`],
          false
        ),
        tijiaoBtn: this.vaildData(
          this.permission[`outsys-share-tijiao`],
          false
        ),
        shenheBtn: this.vaildData(
          this.permission[`outsys-share-shenhe`],
          false
        ),
        //导入
        uploadBtn: this.vaildData(
          this.permission[`outsys-share-armyUploadBtn`],
          false
        ),
        // 模版下载
        downloadExcel: this.vaildData(
          this.permission["outsys-share-download"],
          false
        ),
        // 导出
        exportExcel: this.vaildData(
          this.permission["sys-share-export"],
          false
        ),
        //共享
        shareBtn: this.vaildData(
          this.permission["sys-share-share"],
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
        this.option.column[2].dicData.push(...res.data.data)
      })
    },
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

    tabChange () {
      this.query = {};
      this.page.currentPage = 1;
      this.onLoad(this.page);
    },

    initData (/*type*/) { },
    refreshChange () {
      this.onLoad(this.page, this.query);
    },
    beforeOpen (done, type) {
      if (["add", "edit", "view"].includes(type)) {
        if (type == 'edit' || type == 'view') {
          this.listForm.xingzqh = this.listForm.xingzqh.split("/")
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
      if(this.$route.query.type){
        if(this.$route.query.type == 'add' && this.permissionList.addBtn){
          this.$refs.listRef.rowAdd()
          delete this.$route.query.type
        }
        if(this.$route.query.type == 'export' && this.permissionList.exportExcel){
          this.exportExcel()
          delete this.$route.query.type
        }
        if(this.$route.query.type == 'upload' && this.permissionList.uploadBtn){
          this.$refs.comp_chose.$el.click();
          delete this.$route.query.type
        }
        if(this.$route.query.type == 'download' && this.permissionList.downloadExcel){
          this.downloadExcel()
          delete this.$route.query.type
        }
      }
      this.selectionList = [];
      this.$refs.listRef.toggleSelection();
    },
    onLoad (page /*, params = {}*/) {
      this.loading = true;

      if (this.query.xingzqh && Array.isArray(this.query.xingzqh)) {
        this.query.xingzqh = this.query.xingzqh.join("/")
      }
      if (this.tabType == "ALL"){
        this.permissionList.addBtn = true
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
          this.listData.forEach(e => {
            e.xingzqh = e.xingzqh.replace(/,/g, "/")
          })
          this.loading = false;
          this.selectionClear();
        });
      }else{
        this.permissionList.addBtn = false
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

        getListDataShare(dataParam).then((res) => {
          const dataRes = res.data.data;
          this.page.total = dataRes.rspPage.totalItems;
          this.page.pageSize = dataRes.rspPage.size;
          this.page.currentPage = dataRes.rspPage.current;
          this.listData = dataRes.fieldList;
          this.listData.forEach(e => {
            e.xingzqh = e.xingzqh.replace(/,/g, "/")
          })
          this.loading = false;
          this.selectionClear();
        });
      }
    },
    //共享
    comFormShare(row){
      this.shareTag = true
      this.showform = true
      this.form = row
    },
    handleSubmit (form, done) {
      if(form.xiafdw instanceof Array){
        form.xiafdw = form.xiafdw.join(',')
      }
      getEnterList(form).then(() =>{
        done();
        this.shareClose()
        this.onLoad(this.page);
        this.$message({
          type: "success",
          message: "操作成功!"
        });
      }, error => {
        window.console.log(error);
      })
    },
    shareClose(){
      this.shareTag = false
      this.showform = false
      this.form = {}
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
      row.yingyly = row.yingyly.join(',')
      row.xingzqh = row.xingzqh.join("/")

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
      if (Array.isArray(row.xingzqh)) {
        row.xingzqh = row.xingzqh.join("/")
      }
      if(Array.isArray(row.yingyly)){
        row.yingyly = row.yingyly.join(',')
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
