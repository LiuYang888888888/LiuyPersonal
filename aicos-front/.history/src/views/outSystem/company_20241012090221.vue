<template>
  <HuilanBasic>
    <div class="armyList">
      <avue-crud :option="option" :table-loading="loading" :data="data" :page="page" :permission="permissionList"
                 :before-open="beforeOpen" v-model="form" ref="crud" @row-update="rowUpdate" @row-save="rowSave"
                 @row-del="rowDel"  @refresh-change="refreshChange"
                 @search-change="searchChange" @search-reset="searchReset" @selection-change="selectionChange"
                 @current-change="currentChange" @size-change="sizeChange" @on-load="onLoad">
        <template slot="denglzh" slot-scope="scope">
          <div class="denglzh">
            <img v-if="scope.row.read_status == 0" :src="newImg" alt="未读消息" style="width: 1.4rem;height: auto;" />
            <span>{{scope.row.denglzh}}</span>
          </div>
        </template>
        <template slot-scope="scope" slot="menuLeft">
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
          <el-button v-if="permissionList.addBtn" size="small" icon="el-icon-plus" type="primary" @click="handleAdd">
            新增
          </el-button>
        </template>
        <template v-slot:menu="scope">
          <el-button type="text" size="small" v-if="permissionList.viewBtn"
                     @click="handleView(scope.row,scope.index)">查看
          </el-button>
          <el-button type="text" size="small" v-if="permissionList.updateBtn"
                     @click="handleUpdate(scope.row,scope.index)">编辑
          </el-button>
          <el-button type="text" size="small" v-if="permissionList.delBtn"
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
      <HuilanDialog
        :title="shenheTitle"
        :fullscreen="false"
        width="80%"
        append-to-body
        :visible.sync="shenheShow"
      >
        <div class="shCon">
          <el-input
            type="textarea"
            :rows="5"
            placeholder="请输入审核理由"
            v-model="textarea">
          </el-input>
        </div>
        <div class="shfooter">
          <el-button type="success" plain @click="complete()">审核通过</el-button>
          <el-button type="warning" plain @click="disagree()">审核不通过</el-button>
        </div>
      </HuilanDialog>

    </div>
  </HuilanBasic>

</template>

<script>
import {mapGetters} from "vuex";
import {getUserInfoPost} from "@/api/system/user";
import {getById, add, update, remove, getList, submit, disagree, complete, exportExcel, importExcel, importTemplateFile} from "@/api/outSystem/company";
import {dateFormat} from "@/util/date";
import {baseURL} from "@/api/common";
const baseUrl = process.env.BASE_URL;
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
      shenheTitle:'信息审核',
      shenheShow: false,
      textarea:'',
      formDetail:{},
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
            label: '登录账号',
            span: 16,
            display: true,
            hideLabel: false,
            dataType: '',
            prop: 'denglzh',
            isListDisplay: true,
            search: false
          },
          {
            type: 'select',
            label: '用户类型',
            cascaderItem: [],
            span: 16,
            display: true,
            props: {
              label: 'name',
              value: 'name'
            },
            hideLabel: false,
            dataType: '',
            prop: 'yonghlx',
            isListDisplay: true,
            search: true,
            dicUrl: '/aicos/api/aicos-system/baseDict/getDictItemListByDictCode',
            dicMethod: 'post',
            dicQuery: {
              code: 'yhlx'
            }
          },
          {
            type: 'input',
            label: '单位名称',
            span: 16,
            display: true,
            hideLabel: false,
            dataType: '',
            prop: 'qiymc',
            isListDisplay: true,
            search: true
          },
          {
            type: 'textarea',
            label: '单位概况',
            span: 16,
            display: true,
            hideLabel: false,
            overHidden:true,
            dataType: '',
            prop: 'danwgk',
            isListDisplay: true,
            search: false
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
            prop: 'xingzqh',
            isListDisplay: true,
            search: true,
            dicQuery: {}
          },
          {
            type: 'input',
            label: '法定代表人',
            span: 16,
            display: true,
            hideLabel: false,
            dataType: '',
            prop: 'faddbr',
            isListDisplay: true,
            search: true,
            se
          },
          {
            type: 'input',
            label: '联系人',
            span: 16,
            display: true,
            hideLabel: false,
            dataType: '',
            prop: 'lianxr',
            isListDisplay: true,
            search: false
          },
          {
            type: 'input',
            label: '电话',
            span: 16,
            display: true,
            hideLabel: false,
            dataType: '',
            prop: 'dianh',
            isListDisplay: true,
            search: false
          },
          {
            type: 'input',
            label: '邮箱',
            span: 16,
            display: true,
            hideLabel: false,
            dataType: '',
            prop: 'youx',
            isListDisplay: true,
            search: false
          },
          {
            type: 'input',
            label: '统一信用代码',
            span: 16,
            display: true,
            hideLabel: false,
            dataType: '',
            prop: 'tongyshxydm',
            isListDisplay: true,
            search: false
          },
          {
            type: 'select',
            label: '单位性质',
            cascaderItem: [],
            span: 16,
            display: true,
            props: {
              label: 'name',
              value: 'name'
            },
            hideLabel: false,
            dataType: '',
            prop: 'danwxz',
            isListDisplay: true,
            search: true,
            dicUrl: '/aicos/api/aicos-system/baseDict/getDictItemListByDictCode',
            dicMethod: 'post',
            dicQuery: {
              code: 'dwxz'
            }
          },
          {
            type: 'input',
            label: '成立时间',
            span: 16,
            display: true,
            hideLabel: false,
            dataType: '',
            prop: 'chenglshij',
            isListDisplay: true,
            search: false,
            append: '年'
          },
          {
            type: 'input',
            label: '注册资本',
            span: 16,
            display: true,
            hideLabel: false,
            dataType: '',
            prop: 'zhuczb',
            isListDisplay: true,
            search: false,
            append: '万元'
          },
          {
            type: 'input',
            label: '人员规模',
            span: 16,
            display: true,
            hideLabel: false,
            dataType: '',
            prop: 'renygm',
            isListDisplay: true,
            search: false
          },
          {
            type: 'select',
            label: '军工资质',
            cascaderItem: [],
            span: 16,
            display: true,
            props: {
              label: 'name',
              value: 'name'
            },
            hideLabel: false,
            dataType: '',
            prop: 'jungzz',
            isListDisplay: true,
            search: true,
            dicUrl: '/aicos/api/aicos-system/baseDict/getDictItemListByDictCode',
            dicMethod: 'post',
            dicQuery: {
              code: 'qyxx_jgzz'
            }
          },
          {
            type: 'select',
            label: '涉密情况',
            cascaderItem: [],
            span: 16,
            display: true,
            props: {
              label: 'name',
              value: 'name'
            },
            hideLabel: false,
            dataType: '',
            prop: 'baomdj',
            isListDisplay: true,
            search: false,
            dicUrl: '/aicos/api/aicos-system/baseDict/getDictItemListByDictCode',
            dicMethod: 'post',
            dicQuery: {
              code: 'qyxx_bmdj'
            }
          },
          {
            type: 'input',
            label: '所在地',
            span: 16,
            display: true,
            hideLabel: false,
            dataType: '',
            prop: 'suozd',
            isListDisplay: true,
            search: false
          },
          {
            type: 'select',
            label: '企业类型',
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
            dicUrl: '/aicos/api/aicos-system/baseDict/getDictItemListByDictCode',
            dicMethod: 'post',
            dicQuery: {
              code: 'qylx'
            }
          },
          {
            type: 'select',
            label: '所属领域',
            cascaderItem: [],
            span: 16,
            display: true,
            props: {
              label: 'name',
              value: 'name'
            },
            hideLabel: false,
            dataType: '',
            prop: 'suosly',
            isListDisplay: true,
            search: false,
            dicUrl: '/aicos/api/aicos-system/baseDict/getDictItemListByDictCode',
            dicMethod: 'post',
            dicQuery: {
              code: 'qyxx_ssly'
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
            type: 'textarea',
            label: '审核理由',
            span: 24,
            display: false,
            hideLabel: false,
            dataType: '',
            width: 140,
            prop: 'shenhly',
            isListDisplay: true,
            search: false
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
          this.permission["system-company-add"],
          false
        ),
        viewBtn: this.vaildData(
          this.permission["system-company-view"],
          false
        ),
        updateBtn: this.vaildData(
          this.permission[`system-company-update`],
          false
        ),
        delBtn: this.vaildData(
          this.permission[`system-company-delete`],
          false
        ),
        // 提交
        submit: this.vaildData(
          this.permission[`system-company-submit`],
          false
        ),
        // 审核
        examineBtn: this.vaildData(
          this.permission[`system-company-examineBtn`],
          false
        ),
        // 下载模版
        downloadExcel: this.vaildData(
          this.permission["system-company-download"],
          false
        ),
        //导入
        uploadBtn: this.vaildData(
          this.permission[`system-company-armyUploadBtn`],
          false
        ),
        // 导出
        exportExcel: this.vaildData(
          this.permission["system-company-export"],
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
    this.getUserInfoPost()
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
    getUserInfoPost() {
      getUserInfoPost().then((res) => {
        this.userInfo = res.data.data;
      })
    },
    // 审核
    handelExamine(row){
      this.textarea = '';
      let param = new URLSearchParams()
      param.append("id",row.id)
      this.shenheShow = true;
      this.formDetail = row;
    },
    // 审核通过
    complete(){
      const param = new URLSearchParams();
      param.append("id", this.formDetail.id);
      param.append("processReason", this.textarea);
      complete(param).then(()=>{
        this.shenheShow = false;
        this.onLoad(this.page)

        this.$message({
          type: 'success',
          message: '审核通过!'
        });
      })
    },
    // 审核拒绝
    disagree(){
      const param = new URLSearchParams();
      param.append("id", this.formDetail.id);
      param.append("processReason", this.textarea);
      disagree(param).then(()=>{
        this.shenheShow = false;
        this.onLoad(this.page)
        this.$message({
          type: 'info',
          message: '审核拒绝!'
        });
      })
    },
    // 提交
    handelSubmit(row) {
      this.$confirm("确定将选择数据提交?", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(()=>{
        let param = new URLSearchParams()
        param.append("id",row.id)
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
      row.xingzqh = row.xingzqh.join("/")
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
      row.xingzqh = row.xingzqh.join("/")
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
    refreshChange() {
      this.onLoad(this.page, this.query);
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
          params.append("id",row.id);
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
        if(type == 'edit' || type == 'view'){
          this.form.xingzqh = this.form.xingzqh.split("/")
        }
        if(type == 'add'){
          this.form.denglzh = this.userInfo.account
          this.form.yonghlx = this.userInfo.memberType
          this.form.lianxr = this.userInfo.contacts
          this.form.dianh = this.userInfo.mobile

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
      if(this.query.xingzqh){
        this.query.xingzqh = this.query.xingzqh.join("/")
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

        data.fieldList.forEach( e =>{
          e.xingzqh = e.xingzqh.replace(/,/g,"/")
        })

        this.loading = false;
        this.selectionClear();
      });
    }
  }
};
</script>

<style>
.shfooter {
  width: 100%;
  margin: 50px 0 30px;
  text-align: center;
}
</style>
