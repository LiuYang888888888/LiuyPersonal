<template>
  <HuilanBasic>
    <div class="armyList">
      <avue-crud :option="option" :table-loading="loading" :data="data" :page="page" :permission="permissionList"
                 :before-open="beforeOpen" v-model="form" ref="crud" @row-update="rowUpdate" @row-save="rowSave"
                 @row-del="rowDel" @refresh-change="refreshChange"
                 @search-change="searchChange" @search-reset="searchReset" @selection-change="selectionChange"
                 @current-change="currentChange" @size-change="sizeChange" @on-load="onLoad">
        <template slot="qiymc" slot-scope="scope">
          <div class="qiymc">
            <img v-if="scope.row.read_status == 0" :src="newImg" alt="未读消息"  style="width: 1.4rem;height: auto;" />
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
          <el-button v-if="permissionList.addBtn" size="small" icon="el-icon-plus" type="primary" @click="handleAdd">
            新增
          </el-button>
          <el-button v-if="permissionList.exportExcel" size="small" icon="el-icon-download" type="primary" @click="exportExcel">
            导出
          </el-button>
          <el-upload v-if="permissionList.uploadBtn" :auto-upload="false" :show-file-list="false"
                     :on-change="handleChange" style="display: inline-block;">
            <el-button size="small" icon="el-icon-upload2" type="primary">导入</el-button>
          </el-upload>
          <el-button v-if="permissionList.downloadExcel" size="small" icon="el-icon-download" type="primary"
                     @click="downloadExcel">
            下载模版
          </el-button>
        </template>
        <template v-slot:menu="scope">
          <el-button type="text" size="small" v-if="permissionList.viewBtn"
                     @click="handleView(scope.row,scope.index)">查看
          </el-button>
          <el-button type="text" size="small" v-if="(scope.row.zhuangt == 1 || scope.row.zhuangt == 3) && permissionList.updateBtn"
                     @click="handleUpdate(scope.row,scope.index)">编辑
          </el-button>
          <el-button type="text" size="small" v-if="(scope.row.zhuangt == 1 || scope.row.zhuangt == 3) && permissionList.delBtn"
                     @click="handelDel(scope.row)">删除
          </el-button>
          <el-button type="text" size="small" v-if="permissionList.examineBtn && scope.row.zhuangt==='2'"
                     @click="handelExamine(scope.row)">审核
          </el-button>
          <el-button type="text" size="small" v-if="permissionList.submit && scope.row.zhuangt==='1'"
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
import {dateFormat} from "@/util/date";

import {mapGetters} from "vuex";
import {getUserInfoPost} from "@/api/system/user";
import {add, update, remove, getList, submit, disagree, complete, importExcel ,importTemplateFile, exportExcel, getById} from "@/api/outSystem/mbCompany";

export default {
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
      // 上传数据
      fileList: [],
      userInfo: {},
      addressData: [],
      dataJson: {},
      form: {},
      query: {},
      loading: true,
      page: {
        pageSize: 10,
        currentPage: 1,
        total: 0,
        pageSizes: [10, 20, 30, 40, 50, 100],
      },
      selectionList: [],
      option: {
        // height: 'auto',
        align: 'center',
        // calcHeight: 1000,
        indexWidth:60,
        searchShow: true,
        searchMenuSpan: 6,
        tip: false,
        excelBtn: false,
        border: true,
        addBtn: false,
        editBtn: false,
        delBtn: false,
        index: true,
        indexLabel: '序号',
        viewBtn: false,
        selection: true,
        labelPosition: 'right',
        labelSuffix: '',
        labelWidth: 140,
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
            label: '企业名称',
            width:100,
            span: 16,
            display: true,
            hideLabel: false,
            dataType: '',
            prop: 'qiymc',
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
            type: 'cascader',
            label: '所属区域',
            width:100,
            span: 16,
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
            prop: 'suosqy',
            isListDisplay: true,
            search: true,
            dicQuery: {},
            required: true,
            rules: [
              {
                required: true,
                message: '所属区域必须选择'
              }
            ],
          },
          {
            type: 'textarea',
            label: '企业简介',
            width:100,
            span: 16,
            display: true,
            overHidden:true,
            hideLabel: false,
            dataType: 'false',
            prop: 'qiyjj',
            isListDisplay: true,
            search: false,
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
            label: '领导班子',
            width:100,
            span: 16,
            display: true,
            hideLabel: false,
            dataType: '',
            prop: 'lingdbz',
            isListDisplay: true,
            search: false,
            required: true,
            rules: [
              {
                required: true,
                message: '领导班子必须填写'
              }
            ],
          },
          {
            type: 'select',
            label: '企业类型',
            width:100,
            cascaderItem: [],
            span: 16,
            display: true,
            props: {
              label: 'name',
              value: 'name'
            },
            hideLabel: false,
            dataType: '',
            prop: 'qiylx',
            isListDisplay: true,
            search: true,
            dicQuery: {
              code: 'dwxz'
            },
            dicUrl: '/aicos/api/aicos-system/baseDict/getDictItemListByDictCode',
            dicMethod: 'post',
            required: true,
            rules: [
              {
                required: true,
                message: '企业类型必须选择'
              }
            ],
          },
          {
            type: 'select',
            label: '销售区域',
            width:100,
            cascaderItem: [],
            span: 16,
            display: true,
            props: {
              label: 'name',
              value: 'name'
            },
            hideLabel: false,
            dataType: '',
            prop: 'xiaosqy',
            isListDisplay: true,
            search: true,
            dicQuery: {
              code: 'dwxz'
            },
            dicUrl: '/aicos/api/aicos-system/baseDict/getDictItemListByDictCode',
            dicMethod: 'post',
            required: true,
            rules: [
              {
                required: true,
                message: '企业类型必须选择'
              }
            ],
          },
          // {
          //   type: 'cascader',
          //   label: '销售区域',
          //   width:100,
          //   span: 16,
          //   isRegionTree: true,
          //   display: true,
          //   cascaderIndex: 1,
          //   showAllLevels: true,
          //   separator: '/',
          //   dicUrl: '/aicos/api/aicos-form/baseForm/getFullRegionTree',
          //   dicMethod: 'post',
          //   dicFormatter: function (e) {
          //     var t = e.data, i = function e(t) {
          //       t.forEach((function (t) {
          //         t.children && 0 === t.children.length ? Reflect.deleteProperty(t, "children") : e(t.children)
          //       }))
          //     };
          //     return i(t), t
          //   },
          //   props: {
          //     label: 'name',
          //     value: 'name',
          //     res: 'data'
          //   },
          //   hideLabel: false,
          //   dataType: '',
          //   prop: 'xiaosqy',
          //   isListDisplay: true,
          //   search: true,
          //   dicQuery: {},
          //   required: true,
          //   rules: [
          //     {
          //       required: true,
          //       message: '销售区域必须选择'
          //     }
          //   ],
          // },
          {
            type: 'input',
            label: '企业资质',
            width:100,
            span: 16,
            display: true,
            hideLabel: false,
            dataType: '',
            prop: 'qiyzz',
            isListDisplay: true,
            search: true,
            required: true,
            rules: [
              {
                required: true,
                message: '企业资质必须填写'
              }
            ],
          },
          {
            type: 'input',
            label: '产能',
            span: 16,
            display: true,
            hideLabel: false,
            dataType: '',
            prop: 'chann',
            isListDisplay: true,
            search: false,
            append: '吨',
            required: true,
            rules: [
              {
                required: true,
                message: '产能必须填写'
              }
            ],
          },
          {
            type: 'input',
            label: '安全管理负责人',
            width:160,
            span: 16,
            display: true,
            hideLabel: false,
            dataType: '',
            prop: 'anqglfzr',
            isListDisplay: true,
            search: false,
            required: true,
            rules: [
              {
                required: true,
                message: '安全管理负责人必须填写'
              }
            ],
          },
          {
            type: 'input',
            label: '联系电话',
            width:100,
            span: 16,
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
      data: [],

    };
  },
  computed: {
    ...mapGetters(["permission"]),
    permissionList() {
      return {
        addBtn: this.vaildData(
          this.permission["sys-mbCompany-add"],
          false
        ),
        viewBtn: this.vaildData(
          this.permission["sys-mbCompany-viewBtn"],
          false
        ),
        updateBtn: this.vaildData(
          this.permission[`sys-mbCompany-update`],
          false
        ),
        delBtn: this.vaildData(
          this.permission[`sys-mbCompany-delete`],
          false
        ),
        // 提交
        submit: this.vaildData(
          this.permission[`sys-mbCompany-submit`],
          false
        ),
        //   上传
        uploadBtn: this.vaildData(
          this.permission[`sys-mbCompany-uploadBtn`],
          false
        ),
        //   模版下载
        downloadExcel: this.vaildData(
          this.permission[`sys-mbCompany-download`],
          false
        ),
        //   导出
        export: this.vaildData(
          this.permission[`sys-mbCompany-export`],
          false
        ),
        // 审核
        examineBtn: this.vaildData(
          this.permission[`sys-mbCompany-examineBtn`],
          false
        ),
        // 导出
        exportExcel: this.vaildData(
          this.permission["sys-mbCompany-export"],
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
    this.getUserInfo()
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
          this.$message({
            message: "上传成功！",
              type: 'success'
          })
          this.onLoad(this.page);

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
    downloadExcel() {
      const dataParam = {};
      let fileName =
        "数据模板_" +
        dateFormat(new Date(), "hh_mm_ss").toString() +
        ".xlsx";
      importTemplateFile(dataParam).then(
        (res) => {
          // console.log("获取模版",res.data.data.substring(1))
          const urlRes = `${baseURL}`+res.data.data.substring(1) ;
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
    // 获取用户信息
    getUserInfo() {
      getUserInfoPost().then((res) => {
        this.userInfo = res.data.data;
      })
    },
    // 审核
    handelExamine(row) {
      let param = new URLSearchParams()
      param.append("id", row.id)
      param.append("processReason", '')
      this.$confirm('确定将选择数据审核通过', {
        confirmButtonText: '通过',
        cancelButtonText: '拒绝',
        type: 'warning',
        distinguishCancelAndClose: true,
      }).then(() => {
        complete(param).then(() => {
        }).then(() => {
          this.onLoad(this.page)
          this.$message({
            type: 'success',
            message: '审核通过!'
          });
        })
      }).catch(action => {
        if (action === 'cancel') {
          disagree(param).then(() => {
          }).then(() => {
            this.onLoad(this.page)
            this.$message({
              type: 'info',
              message: '审核拒绝'
            });
          })
        }

      });
    },
    // 提交
    handelSubmit(row) {
      this.$confirm("确定将选择数据提交?", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(() => {
        let param = new URLSearchParams()
        param.append("id", row.id)
        submit(param).then(() => {
          this.onLoad(this.page);
          this.$message({
            type: "success",
            message: "信息提交成功！"
          });
        }, error => {
          window.console.log(error);
          this.onLoad(this.page);
        });
      })

    },
    // 新增row
    handleAdd() {
      this.$refs.crud.rowAdd();
    },

    rowSave(row, done, loading) {
      row.xiaosqy = row.xiaosqy.join("/")
      row.suosqy = row.suosqy.join("/")
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
    rowUpdate(row, index, done, loading) {
      row.xiaosqy = row.xiaosqy.join("/")
      row.suosqy = row.suosqy.join("/")
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
    handelDel(row) {
      this.$confirm("确定将选择数据删除?", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          const params = new URLSearchParams();
          params.append("id", row.id);
          return remove(params);
        })
        .then(() => {
          this.$message({
            type: "success",
            message: "删除成功!",
          });
          this.onLoad(this.page);
        });

    },

    beforeOpen(done, type) {
      if (["add", "edit", "view"].includes(type)) {
        if (type == 'edit' || type == 'view') {
          this.form.xiaosqy = this.form.xiaosqy.split("/")
          this.form.suosqy = this.form.suosqy.split("/")
        }
        // if (type == 'add') {
        //   this.form.fabz = this.userInfo.account
        // }
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

    refreshChange() {
      this.onLoad(this.page, this.query);
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
          this.handleAdd();
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
      this.loading = false;
      if (this.query.xiaosqy) {
        this.query.xiaosqy = this.query.xiaosqy.join("/")
      }
      if (this.query.suosqy) {
        this.query.suosqy = this.query.suosqy.join("/")
      }
      const dataParam = {
        reqPage: {
          current: page.currentPage,
          size: page.pageSize
        },
        searchParam: this.query,
      };

      getList(dataParam).then(res => {
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

</style>
