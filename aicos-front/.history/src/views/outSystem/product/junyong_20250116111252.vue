<template>
  <HuilanBasic>
    <div class="armyList">
      <avue-crud :option="option" :table-loading="loading" :data="data" :page="page" :permission="permissionList"
                 :before-open="beforeOpen" v-model="form" ref="crud" @row-update="rowUpdate" @row-save="rowSave"
                 @row-del="rowDel"  @refresh-change="refreshChange"
                 @search-change="searchChange" @search-reset="searchReset" @selection-change="selectionChange"
                 @current-change="currentChange" @size-change="sizeChange" @on-load="onLoad">
        <template slot="fabz" slot-scope="scope">
          <div class="fabz">
            <img v-if="scope.row.read_status == 0" :src="newImg" alt="未读消息" style="width: 1.4rem;height: auto;" />
            <span>{{scope.row.fabz}}</span>
          </div>
        </template>

        <template #zhuangt="scope">
          <el-tag v-if="scope.row.zhuangt == 1" effect="dark" type="info">草稿</el-tag>
          <el-tag v-if="scope.row.zhuangt == 2" type="danger">已提交</el-tag>
          <el-tag v-if="scope.row.zhuangt == 3" effect="dark" type="danger">审核不通过</el-tag>
          <el-tag v-if="scope.row.zhuangt == 4" effect="dark" type="success">审核通过</el-tag>
        </template>
        
        <template slot="menuLeft">
          <el-button v-if="permissionList.exportExcel" size="small" icon="el-icon-download" type="primary" @click="exportExcel">
            导出
          </el-button>
          <el-button v-if="permissionList.addBtn" size="small" icon="el-icon-plus" type="primary" @click="handleAdd">
            新增
          </el-button>
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
      <HuilanDialog
        :title="shenheTitle"
        :fullscreen="false"
        width="50%"
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
          <el-button size="small" icon="el-icon-circle-close" @click="dataMagFormClose">取 消</el-button>
        </div>
      </HuilanDialog>

    </div>
  </HuilanBasic>

</template>

<script>
import {baseURL} from "@/api/common";
const baseUrl = process.env.BASE_URL;
import {dateFormat} from "@/util/date";

import {mapGetters} from "vuex";
import {getUserInfoPost} from "@/api/system/user";
import {add, update, remove, getList, submit, disagree, complete, getById, exportExcel} from "@/api/outSystemProduct/commonjunyong";

export default {
  data() {
    var lianxdh = (rule, value, callback) => {
      const regMobile = /^1(3|4|5|6|7|8|9)\d{9}$/
      if (!regMobile.test(value)) {
        callback(new Error('请输入正确的手机号'))
      } else {
        callback()
      }
    }
    return {
      newImg:`${baseUrl}img/new.png`,
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
            label: '发布者',
            span: 24,
            display: false,
            width: 140,
            hideLabel: false,
            dataType: '',
            prop: 'fabz',
            isListDisplay: true,
            search: false
          },

          {
            type: 'input',
            label: '产品名称',
            span: 24,
            display: true,
            hideLabel: false,
            dataType: '',
            width: 140,
            prop: 'chanpmc',
            isListDisplay: true,
            search: true,
            required: true,
            rules: [
              {
                required: true,
                message: '技术产品名称必须填写'
              }
            ]
          },
          {
            type: 'select',
            label: '类型',
            cascaderItem: [],
            span: 24,
            display: true,
            props: {
              label: 'name',
              value: 'name'
            },
            hideLabel: false,
            dataType: '',
            prop: 'leix',
            isListDisplay: true,
            search: true,
            required: false,
            rules: [
              {
                required: true,
                message: '类型必须填写'
              }
            ],
            filterable: false,
            dicUrl: '/aicos/api/aicos-system/baseDict/getDictItemListByDictCode',
            dicMethod: 'post',
            dicQuery: {
              code: 'jscpLx'
            }
          },
          {
            type: 'select',
            label: '应用领域',
            cascaderItem: [],
            span: 24,
            width:240,
            display: true,
            props: {
              label: 'name',
              value: 'name'
            },
            hideLabel: false,
            dataType: '',
            prop: 'yingyly',
            isListDisplay: true,
            search: false,
            required: true,
            rules: [
              {
                required: true,
                message: '应用领域必须填写'
              }
            ],
            filterable: false,
            dicUrl: '/aicos/api/aicos-system/baseDict/getDictItemListByDictCode',
            dicMethod: 'post',
            dicQuery: {
              code: 'jscpyyly'
            },
            multiple: true,
            clearable: false
          },
          {
            type: 'select',
            label: '先进程度',
            cascaderItem: [],
            span: 24,
            width:140,
            display: true,
            props: {
              label: 'name',
              value: 'name'
            },
            hideLabel: false,
            dataType: '',
            prop: 'xianjcd',
            isListDisplay: true,
            search: true,
            required: true,
            rules: [
              {
                required: true,
                message: '先进程度必须填写'
              }
            ],
            dicUrl: '/aicos/api/aicos-system/baseDict/getDictItemListByDictCode',
            dicMethod: 'post',
            dicQuery: {
              code: 'xjcd'
            }
          },
          {
            type: 'cascader',
            label: '行政区划',
            span: 24,
            isRegionTree: true,
            display: true,
            overHidden: true,
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
            width: 140,
            dataType: '',
            prop: 'xingzqh',
            isListDisplay: true,
            search: true,
            dicQuery: {},
            rules: [
              {
                required: true,
                message: '行政区划必须填写'
              }
            ]
          },
          {
            type: 'datetime',
            label: '日期',
            span: 24,
            hide:true,
            display: false,
            format: 'yyyy-MM-dd HH:mm:ss',
            valueFormat: 'yyyy-MM-dd HH:mm:ss',
            hideLabel: false,
            searchDefaultTime: ["00:00:00", "23:59:59"],//搜索框的默认时分秒设置
            dataType: 'datetime',
            width: 140,
            prop: 'shijss',
            isListDisplay: true,
            search: true,
            searchRange: true,
          },
          {
            type: 'textarea',
            label: '产品概述',
            span: 24,
            display: true,
            hideLabel: false,
            overHidden: true,
            dataType: '',
            width: 140,
            prop: 'chanpgs',
            isListDisplay: true,
            search: false,
            required: true,
            rules: [
              {
                required: true,
                message: '产品概述必须填写'
              }
            ]
          },
          {
            type: 'textarea',
            label: '产品详情',
            width: 120,
            span: 24,
            display: true,
            hideLabel: false,
            dataType: '',
            overHidden: true,
            prop: 'chanpxq',
            isListDisplay: true,
            search: false,
            required: true,
            rules: [
              {
                required: true,
                message: '产品详情必须填写'
              }
            ]
          },
          {
            type: 'upload',
            label: '产品详情logo',
            width: 140,
            span: 24,
            display: true,
            showFileList: true,
            multiple: true,
            limit: 1,
            action: '/aicos/api/aicos-file/miniofile/upload',
            propsHttp: {
              home: '/aicos',
              url: 'newFileName',
              name: 'oldFileName',
              res: 'data',
              fileName: 'file'
            },
            canvasOption: {},
            hideLabel: false,
            dataType: '',
            prop: 'chanpxqlogo',
            isListDisplay: true,
            search: false,
            listType: 'picture',
            accept: 'image/png, image/jpeg',
            fileSize: 10000,
            tip: '只能上传jpg/png，且不超过10M',
            required: true,
            rules: [
              {
                required: true,
                message: '产品详情logo必须填写'
              }
            ],
            data: {
              fromSystemName: 'base'
            }
          },
          {
            type: 'input',
            label: '联系人',
            span: 24,
            display: true,
            hideLabel: false,
            dataType: '',
            width: 140,
            prop: 'lianxr',
            isListDisplay: true,
            disabled: false,
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
            span: 24,
            display: true,
            hideLabel: false,
            dataType: '',
            width: 140,
            prop: 'lianxdh',
            isListDisplay: true,
            search: false,
            required: true,
            rules: [
              {
                required: true,
                message: '联系电话必须填写'
              },
              {validator: lianxdh, message: '请输入正确的手机号'}
            ],
            pattern: '/^1(3|4|5|6|7|8|9)\\d{9}$/'
          },
          {
            type: 'select',
            label: '审核状态',
            dicData: [
              {
                label: '草稿',
                value: '1'
              },
              {
                label: '已提交',
                value: '2'
              },
              {
                label: '已拒绝',
                value: '3'
              },
              {
                label: '审核通过',
                value: '4'
              }
            ],
            cascaderItem: [],
            span: 24,
            display: false,
            props: {
              label: 'label',
              value: 'value'
            },
            width: 140,
            hideLabel: false,
            dataType: '',
            prop: 'zhuangt',
            isListDisplay: true,
            search: true,
            required: true,
            rules: [
              {
                required: true,
                message: '审核状态必须填写'
              }
            ]
          },
          {
            type: 'textarea',
            label: '审核理由',
            span: 24,
            display: false,
            hideLabel: false,
            dataType: '',
            width: 140,
            overHidden: true,
            prop: 'shenhly',
            isListDisplay: true,
            search: false
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
          this.permission["sys-porduct-add"],
          false
        ),
        viewBtn: this.vaildData(
          this.permission["sys-porduct-view"],
          false
        ),
        updateBtn: this.vaildData(
          this.permission[`sys-porduct-update`],
          false
        ),
        delBtn: this.vaildData(
          this.permission[`sys-porduct-delete`],
          false
        ),
        // 提交
        submit: this.vaildData(
          this.permission[`sys-porduct-submit`],
          false
        ),
        // 审核
        examineBtn: this.vaildData(
          this.permission[`sys-porduct-examineBtn`],
          false
        ),
        // 导出
        exportExcel: this.vaildData(
          this.permission["sys-porduct-export"],
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
    //   获取用户信息
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
    // 弹窗关闭
    dataMagFormClose () {
      this.processReason = ''
      this.shenheShow = false;
    },
    // 获取用户信息
    getUserInfo() {
      getUserInfoPost().then((res) => {
        this.userInfo = res.data.data;
      })
    },
    // 提交
    handelSubmit(row) {
      this.$confirm("确定将选择数据提交?", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(()=>{
        const param = new URLSearchParams()
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
    // 导入
    handleChange(file, fileLis) {
      this.$Export.xlsx(file.raw)
        .then(data => {
          this.form = data.results;
        })
    },

    rowSave(row, done, loading) {
      row.xingzqh = row.xingzqh.join("/")
      row.yingyly = row.yingyly.join(',')
      if (row.chanpxqlogo.constructor === Array){
        row.chanpxqlogo = row.chanpxqlogo[0].value;
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
    rowUpdate(row, index, done, loading) {
      if(Array.isArray(row.yingyly)){
        row.yingyly = row.yingyly.join(',')
      }
      row.xingzqh = row.xingzqh.join("/")
      if (row.chanpxqlogo.constructor === Array){
        row.chanpxqlogo = row.chanpxqlogo[0].value;
      }
      update(row).then(() => {
        done();
        this.onLoad(this.page,this.query);
        this.$message({
          type: "success",
          message: "修改成功!"
        });
      },error => {
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
      // console.log("update1")
      this.$refs.crud.rowEdit(row, index);
    },
    handelDel(row) {
      this.$confirm("确定将选择数据删除?", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(() => {
        const params = new URLSearchParams();
        params.append("id", row.id)
        remove(params).then((res) => {
          if (res.data.code === 200) {
            this.onLoad(this.page);
            this.$message({
              type: "success",
              message: "数据删除成功!"
            });
          } else {
            this.$message({
              type: "error",
              message: res.msg
            });
          }
        }).catch((res) => {
          this.$message({
            type: "error",
            message: res.msg
          });
        })

      })
    },

    beforeOpen(done, type) {
      if (["add", "edit", "view"].includes(type)) {
        if(type == 'edit' || type == 'view'){
          this.form.xingzqh = this.form.xingzqh.split("/")
        }
        if(type == 'add'){
          this.form.fabz = this.userInfo.account
          this.form.lianxr = this.userInfo.contacts
          this.form.lianxdh = this.userInfo.mobile
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
