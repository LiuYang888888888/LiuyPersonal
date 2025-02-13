<template>
  <HuilanBasic>
    <div class="armyEnter" v-if="armyFlag">
      <h1>{{this.shuomingTitle}}</h1>
      <div class="armyEnterBox">
        <p v-html="shuoming"></p>
      </div>
      <div class="armyEnterBtn">
        <!--        <router-link to="/outSystem/armyEnterprise/armyEnter2">符合以上要求</router-link>-->
        <el-button @click="showList()">符合以上要求</el-button>
      </div>
    </div>
    <div class="armyList" v-if="this.armyListFlag">
      <avue-crud :option="option" :table-loading="loading" :data="data" :page="page" :permission="permissionList"
                 :before-open="beforeOpen" v-model="form" ref="crud" @row-update="rowUpdate" @row-save="rowSave"
                 @row-del="rowDel"  @refresh-change="refreshChange"
                 @search-change="searchChange" @search-reset="searchReset" @selection-change="selectionChange"
                 @current-change="currentChange" @size-change="sizeChange" @on-load="onLoad">
        <template slot="danwmc" slot-scope="scope">
          <div class="danwmcName">
            <img v-if="scope.row.read_status == 0" :src="newImg" alt="未读消息" style="width: 1.4rem;height: auto;" />
            <span>{{scope.row.danwmc}}</span>
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
          <el-upload v-if="permissionList.uploadBtn" :auto-upload="false" :show-file-list="false"
                     :on-change="handleChange" style="display: inline-block;">
            <el-button size="small" icon="el-icon-upload2" type="primary" ref="comp_chose">导入</el-button>
          </el-upload>
          <el-button v-if="permissionList.downloadExcel" size="small" icon="el-icon-download" type="primary"
                     @click="downloadExcel">
            下载模版
          </el-button>
          <el-button v-if="permissionList.addBtn" size="small" icon="el-icon-plus" type="primary" @click="handleAdd">
            新增
          </el-button>
<!--          <el-button v-if="permissionList.downloadExcel" size="small" icon="el-icon-download" type="primary" @click="downloadExcel">-->
<!--            下载模版-->
<!--          </el-button>-->

        </template>
        <template v-slot:menu="scope">
          <el-button type="text" size="small" v-if="permissionList.viewBtn"
                     @click="handleView(scope.row,scope.index)">查看
          </el-button>
          <el-button type="text" size="small" v-if="permissionList.updateBtn && (scope.row.zhuangt == 1 || scope.row.zhuangt == 3)"
                     @click="handleUpdate(scope.row,scope.index)">编辑
          </el-button>
          <el-button type="text" size="small" v-if="permissionList.delBtn && (scope.row.zhuangt == 1 || scope.row.zhuangt == 3)"
                     @click="handelDel(scope.row)">删除
          </el-button>
          <el-button type="text" size="small" v-if="permissionList.examineBtn && scope.row.zhuangt === '2'"
                     @click="handelExamine(scope.row)">审核
          </el-button>
          <el-button type="text" size="small" v-if="permissionList.submit && (scope.row.zhuangt == 1 || scope.row.zhuangt == 3)"
                     @click="handelSubmit(scope.row)">提交
          </el-button>
        </template>
      </avue-crud>

    </div>
  </HuilanBasic>

</template>

<script>
import {baseURL} from "@/api/common";
const baseUrl = process.env.BASE_URL;
import {mapGetters} from "vuex";
import {getUserInfoPost} from "@/api/system/user";
import FormPreview from "@/components/formPreview";
import {
  add,
  update,
  remove,
  getEnterList,
  submit,
  disagree,
  complete,
  importExcel,
  getById,
  exportExcel
} from "@/api/armyEnterPrise/common";
import {
  getList,
} from "@/api/system/messageTemplate";
import {dateFormat} from "@/util/date";
import {inTemplateFile} from "@/api/system/commonFormData";

export default {
  components: {FormPreview},
  data() {
    var lianxfs = (rule, value, callback) => {
      const regMobile = /^1(3|4|5|6|7|8|9)\d{9}$/
      if (!regMobile.test(value)) {
        callback(new Error('请输入正确的手机号'))
      } else {
        callback()
      }
    }
    return {
      newImg:`${baseUrl}img/new.png`,
      // 军民融合
      // 用户信息
      userInfo: {},
      // 上传数据
      fileList: [],
      // 文件名称
      formName:'军保企业模版',
      // 表单样式
      labelPosition: 'right',
      // 是否展示list
      armyListFlag: true,
      armyFlag: false,
      metObjName: 'dyf_aicos_junbyzqydj',
      systemCode: "AiCOS",
      addressData: [],
      dataJson: {},
      form: {},
      query: {},
      loading: true,
      shuoming:'',
      shuomingTitle:'',
      page: {
        pageSize: 10,
        currentPage: 1,
        total: 0,
        pageSizes: [10, 20, 30, 40, 50, 100],
      },
      templateId: '1801454001746198529',
      selectionList: [],
      option: {
        // height: 'auto',
        align: 'center',
        // calcHeight: 1000,
        searchShow: true,
        searchMenuSpan: 6,
        excelBtn: false,
        tip: false,
        border: true,
        addBtn: false,
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
        submitBtn: true,
        submitText: '提交',
        emptyBtn: true,
        emptyText: '清空',
        menuAlign: 'center',
        menuPosition: 'center',
        isCustom: false,
        column: [
          {
            type: 'input',
            label: '单位名称',
            span: 24,
            display: true,
            hideLabel: false,
            dataType: '',
            width: 120,
            overHidden: true,
            prop: 'danwmc',
            isListDisplay: true,
            search: true,
            required: true,
            rules: [
              {
                required: true,
                message: '单位名称必须填写'
              }
            ],
            showWordLimit: true,
            clearable: false
          },
          {
            type: 'select',
            label: '行业类别',
            cascaderItem: [],
            width: 120,
            span: 24,
            display: true,
            props: {
              label: 'name',
              value: 'value'
            },
            hideLabel: false,
            dataType: '',
            prop: 'qiylx',
            isListDisplay: true,
            search: true,
            dicUrl: '/aicos/api/aicos-system/baseDict/getDictItemListByDictCode',
            dicMethod: 'post',
            dicQuery: {
              code: 'jbqyhylx'
            },
            rules: [
              {
                required: true,
                message: '行业类别必须填写'
              }
            ],
          },
          {
            type: 'input',
            label: '统一信用代码',
            width: 120,
            span: 24,
            display: true,
            hideLabel: false,
            dataType: '',
            prop: 'qiyxydm',
            isListDisplay: true,
            search: false,
            required: true,
            rules: [
              {
                required: true,
                message: '企业信用代码必须填写'
              }
            ]
          },
          {
            type: 'textarea',
            label: '单位简介',
            width: 120,
            span: 24,
            overHidden: true,
            display: true,
            hideLabel: false,
            dataType: '',
            prop: 'danwjj',
            isListDisplay: true,
            search: false,
            required: true,
            rules: [
              {
                required: true,
                message: '单位简介必须填写'
              }
            ]
          },
          {
            type: 'textarea',
            label: '经营范围',
            width: 120,
            span: 24,
            display: true,
            hideLabel: false,
            overHidden: true,
            dataType: '',
            prop: 'jingyfw',
            isListDisplay: true,
            search: false,
            required: true,
            rules: [
              {
                required: true,
                message: '经营范围必须填写'
              }
            ]
          },
          {
            type: 'select',
            label: '单位性质',
            cascaderItem: [],
            span: 24,
            width: 120,
            display: true,
            props: {
              label: 'name',
              value: 'value'
            },
            hideLabel: false,
            dataType: '',
            prop: 'xingylb',
            isListDisplay: true,
            search: true,
            dicQuery: {
              code: 'dwxz'
            },
            dicUrl: '/aicos/api/aicos-system/baseDict/getDictItemListByDictCode',
            dicMethod: 'post',
            rules: [
              {
                required: true,
                message: '单位性质必须填写'
              }
            ]
          },
          {
            type: 'cascader',
            label: '所在地市',
            span: 24,
            isRegionTree: true,
            display: true,
            cascaderIndex: 1,
            showAllLevels: true,
            separator: '/',
            dicUrl: '/aicos/api/aicos-form/baseForm/getFullRegionTree',
            dicMethod: 'post',
            dicFormatter: function (e) {
              var t = e.data, i = function e(t) {
                t.forEach((function (t) {
                  t.children && 0 === t.children.length ? Reflect.deleteProperty(t, "children") : e(t.children)
                }))
              };
              return i(t), t
            },
            props: {
              label: 'name',
              value: 'name',
              res: 'data'
            },
            hideLabel: false,
            dataType: '',
            prop: 'suozds',
            width: 120,
            isListDisplay: true,
            search: true,
            required: true,
            rules: [
              {
                required: true,
                message: '所在地市必须填写'
              }
            ],
            dicQuery: {}
          },
          {
            type: 'input',
            label: '通信地址',
            width: 120,
            span: 24,
            display: true,
            hideLabel: false,
            dataType: '',
            prop: 'tongxdz',
            isListDisplay: true,
            search: false,
            required: true,
            rules: [
              {
                required: true,
                message: '通讯地址必须填写'
              }
            ]
          },
          {
            type: 'input',
            label: '联系人',
            width: 120,
            span: 24,
            display: true,
            hideLabel: false,
            dataType: '',
            prop: 'lianxr',
            isListDisplay: true,
            search: false,
            required: true,
            rules: [
              {
                required: true,
                message: '联系人必须填写'
              }
            ]
          },
          {
            type: 'input',
            label: '联系电话',
            width: 120,
            span: 24,
            display: true,
            hideLabel: false,
            dataType: '',
            prop: 'lianxfs',
            isListDisplay: true,
            search: false,
            required: true,
            rules: [
              {
                required: true,
                message: '联系电话必须填写'
              },
              {validator: lianxfs, message: '请输入正确的手机号'}
            ],
            pattern: '/^1(3|4|5|6|7|8|9)\\d{9}$/'
          },
          {
            type: 'upload',
            label: '营业执照图片',
            width: 120,
            span: 24,
            display: true,
            showFileList: true,
            multiple: false,
            limit: 1,
            action: '/aicos/api/aicos-file/miniofile/upload',
            propsHttp: {
              home: '/aicos',
              url: 'newFileName',
              name: 'oldFileName',
              res: 'data',
              fileName: 'file'
            },
            accept: 'image/png, image/jpeg',
            fileSize: 10000,
            tip: '只能上传jpg/png，且不超过10M',
            canvasOption: {},
            hideLabel: false,
            dataType: '',
            prop: 'yingyzzdz',
            isListDisplay: true,
            search: false,
            listType: 'picture',
            required: true,
            rules: [
              {
                required: true,
                message: '营业执照图片必须填写'
              }
            ],
            data: {
              fromSystemName: 'base'
            }
          },
          {
            type: 'select',
            label: '审核状态',
            cascaderItem: [],
            span: 24,
            width: 140,
            display: false,
            props: {
              label: 'name',
              value: 'value'
            },
            hideLabel: false,
            dataType: '',
            prop: 'zhuangt',
            isListDisplay: true,
            search: true,
            dicUrl: '/aicos/api/aicos-system/baseDict/getDictItemListByDictCode',
            dicMethod: 'post',
            dicQuery: {
              code: 'shenhezt'
            }
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
      data: []
    };
  },
  computed: {
    ...mapGetters(["permission"]),
    permissionList() {
      return {
        addBtn: this.vaildData(
          this.permission["sys-user-armyAdd"],
          false
        ),
        viewBtn: this.vaildData(
          this.permission["sys-user-armyView"],
          false
        ),
        updateBtn: this.vaildData(
          this.permission[`sys-user-armyUpdate`],
          false
        ),
        delBtn: this.vaildData(
          this.permission[`sys-user-armyDel`],
          false
        ),
        //审核
        examineBtn: this.vaildData(
          this.permission[`sys-user-armyExamine`],
          false
        ),
        //导入
        uploadBtn: this.vaildData(
          this.permission[`sys-user-armyUploadBtn`],
          false
        ),
        // 导出
        exportExcel: this.vaildData(
          this.permission["sys-user-armyExport"],
          false
        ),
        // 模版下载
        downloadExcel: this.vaildData(
          this.permission["sys-user-download"],
          false
        ),
        // 提交
        submit: this.vaildData(
          this.permission[`sys-user-armySubmit`],
          false
        ),
      };
    },
    ids() {
      let ids = [];
      this.selectionList.forEach(ele => {
        ids.push(ele.id);
      });
      return ids.join(",");
    }
  },
  mounted() {

  },
  created() {
    // this.getAddress()
    this.getUserInfoPost()
    this.getEnterPrise()

  },
  methods: {
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
    // 下载模板
    downloadExcel() {
      let a = document.createElement("a");
      a.href = `${baseUrl}template/军保企业数据模版.xlsx`;
      // a.href = "/assets/outSystem/军保企业数据模版.xlsx";
      a.download = "军保企业数据模版.xls";
      a.style.display = "none";
      document.body.appendChild(a);
      a.click();
      a.remove();
    },

    // 获取军保企业说明
    getEnterPrise(){
      let paramsEn = {"current":1,"size":10,"type":"system","name":"","status":""}
      getList(paramsEn).then((res)=>{
        this.shuomingTitle = res.data.data.records[0].title
        this.shuoming = res.data.data.records[0].content.replace(/\n/g, '<br>')
      })
    },
    // 获取用户信息
    getUserInfoPost(){
      getUserInfoPost().then((res)=>{
        this.userInfo = res.data.data;
        if (this.userInfo.applyStatus != '2'){
          this.armyFlag = true;
          this.armyListFlag = false;
        }
      })
    },
    // 提交
    handelSubmit(row) {
      this.$confirm("确定将选择数据提交?", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(() => {
        const param = new URLSearchParams();
        param.append("id", row.id)
        submit(param).then(() => {
          this.onLoad(this.page);
          this.$message({
            type: "success",
            message: "军保企业信息提交成功！"
          });
        }, error => {
          window.console.log(error);
          this.onLoad(this.page);
        });
      })

    },
    // 审核
    handelExamine(row) {
      this.dataMagFormTag = true;
      this.dataFormId = row.id;
      // let param = new URLSearchParams()
      // param.append("id", row.id)
      // param.append("processReason", '')
      // this.$confirm('确定将选择数据审核通过', {
      //   confirmButtonText: '通过',
      //   cancelButtonText: '拒绝',
      //   type: 'warning',
      //   distinguishCancelAndClose: true,
      // }).then(() => {
      //   complete(param).then(() => {
      //   }).then(() => {
      //     this.onLoad(this.page)
      //     this.$message({
      //       type: 'success',
      //       message: '审核通过!'
      //     });
      //   })
      // }).catch(action => {
      //   if (action === 'cancel') {
      //     disagree(param).then(() => {
      //     }).then(() => {
      //       this.onLoad(this.page)
      //       this.$message({
      //         type: 'info',
      //         message: '审核拒绝'
      //       });
      //     })
      //   }

      // });
    },

    // 新增row
    handleAdd() {
      this.$refs.crud.rowAdd();
    },
    // 验证表格格式
    beforeAvatarUpload(file) {
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
    handleChange(file, fileLis) {
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
    // 说明取消--展示list
    showList() {
      this.armyListFlag = true;
      this.armyFlag = false;
    },
    // 新增
    rowSave(row, done, loading) {
      row.suozds = row.suozds.join("/")
      // console.log("营业执照", row.yingyzzdz)
      if (row.yingyzzdz.constructor === Array){
        row.yingyzzdz = row.yingyzzdz[0].value;
      }
      add(row).then(() => {
        done();
        this.onLoad(this.page);
        this.$message({
          type: "success",
          message: "信息添加成功！"
        });
      }, error => {
        window.console.log(error);
        loading();
      });

    },
    // 修改
    rowUpdate(row, index, done, loading) {
      row.suozds = row.suozds.join("/")
      // console.log("修改图片",row.yingyzzdz)
      if (row.yingyzzdz.constructor === Array){
        row.yingyzzdz = row.yingyzzdz[0].value;
      }
      update(row).then(() => {
        done();
        this.onLoad(this.page);
        this.$message({
          type: "success",
          message: "修改成功!"
        });
      }, error => {
        window.console.log(error);
        loading();
      });
    },
    handleView(row, index) {
      let param = new URLSearchParams()
      param.append("id", row.id)
      getById(param).then((res) => {
        // this.onLoad(this.page);
      }, error => {
        window.console.log(error);
        this.onLoad(this.page);
      });
      this.$refs.crud.rowView(row, index);
      this.refreshChange();
    },

    handleUpdate(row, index) {
      this.$refs.crud.rowEdit(row, index);
    },
    refreshChange() {
      this.onLoad(this.page, this.query);
    },
    handelDel(row) {
      this.$confirm("确定将选择数据删除?", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          const param = new URLSearchParams()
          param.append("id", row.id)
          remove(param).then((res) => {
            this.$message({
              type: "success",
              message: "数据删除成功!"
            });
            this.onLoad(this.page);
          }).catch((res) => {
            this.$message({
              type: "error",
              message: res.error
            });
          })

        })

    },

    beforeOpen(done, type) {
      if (["add", "edit", "view"].includes(type)) {
        if (type == 'edit' || type == 'view') {
          this.form.suozds = this.form.suozds.split("/")
        }
        if (type == 'add') {
          this.form.danwmc = this.userInfo.enterpriseName
          this.form.lianxr = this.userInfo.contacts
          this.form.lianxfs = this.userInfo.mobile
          this.form.yingyzzdz = this.userInfo.businessLicensePhoto
          this.form.qiyxydm = this.userInfo.enterpriseCreditCode
        }
        this.initData(type);
      }
      done();
    },

    initData(/*type*/) {
    },

    searchReset() {
      this.query = {};
      this.onLoad(this.page);
    },

    searchChange(params, done) {
      this.query = params;
      this.page.currentPage = 1;
      this.onLoad(this.page, params);
      done();
    },
    selectionChange(list) {
      this.selectionList = list;
    },
    selectionClear() {
      if(this.$route.query.type){
        if(this.$route.query.type == 'add' && this.permissionList.addBtn){
          this.handleAdd()
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
      this.$refs.crud.toggleSelection();
    },
    currentChange(currentPage) {
      this.page.currentPage = currentPage;
    },
    sizeChange(pageSize) {
      this.page.pageSize = pageSize;
    },
    onLoad(page, params = {}) {
      this.loading = true;
      if (this.query.suozds) {
        this.query.suozds = this.query.suozds.join("/")
      }
      const dataParam = {
        reqPage: {
          current: page.currentPage,
          size: page.pageSize
        },
        searchParam: this.query,
      };
      getEnterList(dataParam).then(res => {
        const data = res.data.data;
        this.page.total = data.rspPage.totalItems;
        this.page.pageSize = data.rspPage.size;
        this.page.currentPage = data.rspPage.current;
        this.data = data.fieldList;
        this.loading = false;
        this.selectionClear();
      });
    }
  }
};
</script>

<style>
.menuLeft > div {
  display: flex;
}

.avue-crud__left {
  display: flex;
}

.armyEnter {
  background: #fff;
  padding: 50px !important;
  box-sizing: border-box;
}

.armyEnter h1 {
  text-align: center;
  margin: 0px;
  margin-bottom: 30px;
}

.armyEnter .armyEnterBox p{
  font-size: 16px;
  line-height: 34px;
}

.armyEnter .armyEnterBtn {
  text-align: center;
  margin-top: 50px;
}
</style>

