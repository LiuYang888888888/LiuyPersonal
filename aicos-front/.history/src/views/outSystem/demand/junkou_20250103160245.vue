<template>
  <HuilanBasic>
    <div class="armyList">
      <avue-crud :option="option" :table-loading="loading" :data="data" :page="page" :permission="permissionList"
                 :before-open="beforeOpen" v-model="form" ref="crud" @row-update="rowUpdate" @row-save="rowSave"
                 @row-del="rowDel" @refresh-change="refreshChange"
                 @search-change="searchChange" @search-reset="searchReset" @selection-change="selectionChange"
                 @current-change="currentChange" @size-change="sizeChange" @on-load="onLoad">

        <template slot="xuqmc" slot-scope="scope">
          <div class="xuqmcName">
            <img v-if="scope.row.read_status == 0" :src="newImg" alt="未读消息" style="width: 1.4rem;height: auto;" />
            <span>{{scope.row.xuqmc}}</span>
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
          <el-button v-if="permissionList.addBtn" size="small" icon="el-icon-plus" type="primary" @click="handleAdd">
            新增
          </el-button>
        </template>
        <template v-slot:menu="scope">
          <el-button type="text" size="small" v-if="permissionList.viewBtn"
                     @click="handleView(scope.row,scope.index)">查看
          </el-button>
          <el-button type="text" size="small" v-if="permissionList.updateBtn && scope.row.zhuangt !=='4'"
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


    </div>

    <!--审核弹窗-->
    <HuilanDialog :title="dataMagFormTitle" :fullscreen="false" append-to-body :before-close="dataMagFormClose"
      :visible.sync="dataMagFormTag" class="dataMagFormClass">
        <div class="dataMagFormFooter">
          <div class="formVerifyClass">
            <el-input type="textarea" v-model="processReason" placeholder="请输入审核意见" rows="4" />
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
    
  </HuilanBasic>

</template>

<script>
import {baseURL} from "@/api/common";
import {dateFormat} from "@/util/date";

import {mapGetters} from "vuex";
import {getUserInfoPost} from "@/api/system/user";
import {add, update, remove, getList, submit, disagree, complete, exportExcel, getById} from "@/api/outSystem/demandjunkou";
const baseUrl = process.env.BASE_URL;

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
      dataMagFormTag:false,
      btnLoading:false,
      dataMagFormTitle:'审核',
      processReason:'',
      
      newImg:`${baseUrl}img/new.png`,
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
        viewBtn: false,
        selection: true,
        labelPosition: 'right',
        labelSuffix: '',
        labelWidth: 120,
        indexWidth:60,
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
            label: "阅读状态",
            prop: "read_status",
            display: false,
            slot:true,
            hide:true,
            hideLabel: false,
          },
          {
            type: 'input',
            label: '需求名称',
            span: 24,
            display: true,
            width: 120,
            overHidden: true,
            hideLabel: false,
            dataType: '',
            prop: 'xuqmc',
            isListDisplay: true,
            search: true,
            required: true,
            rules: [
              {
                required: true,
                message: '需求名称必须填写'
              }
            ],
          },
          {
            type: 'select',
            label: '需求类型',
            width: 100,
            cascaderItem: [],
            span: 24,
            display: true,
            props: {
              label: 'name',
              value: 'name'
            },
            hideLabel: false,
            dataType: '',
            prop: 'xuqlx',
            isListDisplay: true,
            search: true,
            dicUrl: '/aicos/api/aicos-system/baseDict/getDictItemListByDictCode',
            dicMethod: 'post',
            dicQuery: {
              code: 'xqxx_xqlx'
            },
            required: true,
            rules: [
              {
                required: true,
                message: '需求类型必须选择'
              }
            ],
          },
          {
            type: 'cascader',
            label: '行政区划',
            width: 100,
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
            prop: 'xingzqhdm',
            isListDisplay: true,
            search: true,
            dicQuery: {},
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
            label: '需求关键字',
            hide: true,
            span: 24,
            display: true,
            hideLabel: false,
            dataType: '',
            prop: 'xuqgjz',
            isListDisplay: true,
            search: false,
            required: true,
            rules: [
              {
                required: true,
                message: '需求关键字必须填写'
              }
            ],
          },
          {
            type: 'textarea',
            label: '需求内容',
            hide: true,
            span: 24,
            display: true,
            overHidden: true,
            hideLabel: false,
            dataType: '',
            prop: 'xuqnr',
            isListDisplay: true,
            search: false,
            required: true,
            rules: [
              {
                required: true,
                message: '需求内容必须填写'
              }
            ],
          },
          {
            type: 'upload',
            label: '需求logo',
            hide: true,
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
            prop: 'xuqlogo',
            isListDisplay: true,
            search: false,
            listType: 'picture',
            accept: 'image/png, image/jpeg',
            fileSize: 10000,
            tip: '只能上传jpg/png，且不超过10M',
            data: {
              fromSystemName: 'base'
            },
            required: true,
            rules: [
              {
                required: true,
                message: '需求logo必须上传'
              }
            ],
          },
          {
            type: 'input',
            label: '发布者',
            span: 24,
            display: true,
            hideLabel: false,
            dataType: '',
            prop: 'fabz',
            isListDisplay: true,
            search: false,
            required: true,
            rules: [
              {
                required: true,
                message: '发布者必须填写'
              }
            ],
          },
          {
            type: 'input',
            label: '联系人',
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
            ],
          },
          {
            type: 'input',
            label: '联系电话',
            width: 100,
            span: 24,
            display: true,
            hideLabel: false,
            dataType: '',
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
            },
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
            span: 16,
            display: false,
            hideLabel: false,
            prop: 'shenhly',
            isListDisplay: true,
            width:100,
          },
          // {
          //   type: 'datetime',
          //   label: '日期',
          //   span: 24,
          //   display: false,
          //   format: 'yyyy-MM-dd HH:mm:ss',
          //   valueFormat: 'yyyy-MM-dd HH:mm:ss',
          //   searchDefaultTime: ["00:00:00", "23:59:59"],//搜索框的默认时分秒设置
          //   hideLabel: false,
          //   hide: true,
          //   dataType: 'datetime',
          //   prop: 'shijfw',
          //   isListDisplay: false,
          //   search: true,
          //   searchRange: true,
          // },
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
            search: true,
            searchSpan:8,
            searchRange: true,
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
          this.permission["demand-junkou-add"],
          false
        ),
        viewBtn: this.vaildData(
          this.permission["demand-junkou-view"],
          false
        ),
        updateBtn: this.vaildData(
          this.permission[`demand-junkou-update`],
          false
        ),
        delBtn: this.vaildData(
          this.permission[`demand-junkou-delete`],
          false
        ),
        // 提交
        submit: this.vaildData(
          this.permission[`demand-junkou-submit`],
          false
        ),
        //   上传
        uploadBtn: this.vaildData(
          this.permission[`demand-junkou-uploadBtn`],
          false
        ),
        // 审核
        examineBtn: this.vaildData(
          this.permission[`demand-junkou-examineBtn`],
          false
        ),
        // 导出
        exportExcel: this.vaildData(
          this.permission["demand-junkou-export"],
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
    // 获取用户信息
    getUserInfo() {
      getUserInfoPost().then((res) => {

        this.userInfo = res.data.data;
      })
    },
    // 审核
    handelExamine(row) {
      this.dataMagFormTag = true;
      this.dataFormId = row.id;
    },
    //审核通过
    dataMagVerifyYes(){
      this.btnLoading = true;
      const params = new URLSearchParams();
      params.append("id",this.dataFormId);
      params.append("processReason",this.processReason);
      complete(params).then(() => {
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
      params.append("processReason",this.processReason);
      disagree(params).then(() => {
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
    // 弹窗关闭
    dataMagFormClose () {
      this.processReason = ''
      this.dataMagFormTag = false;
    },
    // handelExamine(row) {
    //   let param = new URLSearchParams()
    //   param.append("id", row.id)
    //   param.append("processReason", '')
    //   this.$confirm('确定将选择数据审核通过', {
    //     confirmButtonText: '通过',
    //     cancelButtonText: '拒绝',
    //     type: 'warning',
    //     distinguishCancelAndClose: true,
    //   }).then(() => {
    //     complete(param).then(() => {
    //     }).then(() => {
    //       this.onLoad(this.page)
    //       this.$message({
    //         type: 'success',
    //         message: '审核通过!'
    //       });
    //     })
    //   }).catch(action => {
    //     if (action === 'cancel') {
    //       disagree(param).then(() => {
    //       }).then(() => {
    //         this.onLoad(this.page)
    //         this.$message({
    //           type: 'info',
    //           message: '审核拒绝'
    //         });
    //       })
    //     }

    //   });
    // },
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
      if(row.xingzqhdm.constructor === Array){
        if(row.xingzqhdm.length > 0){
          row.xingzqhdm = row.xingzqhdm.join("/")
        }else{
          row.xingzqhdm = ''
        }
      }
      if (row.xuqlogo.constructor === Array){
        if(row.xuqlogo.length > 0){
          row.xuqlogo = row.xuqlogo[0].value;
        }else{
          row.xuqlogo = ''
        }
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
      if(row.xingzqhdm.constructor === Array){
        if(row.xingzqhdm.length > 0){
          row.xingzqhdm = row.xingzqhdm.join("/")
        }else{
          row.xingzqhdm = ''
        }
      }
      if (row.xuqlogo.constructor === Array){
        if(row.xuqlogo.length > 0){
          row.xuqlogo = row.xuqlogo[0].value;
        }else{
          row.xuqlogo = ''
        }
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
    refreshChange() {
      this.onLoad(this.page, this.query);
    },
    beforeOpen(done, type) {
      if (["add", "edit", "view"].includes(type)) {
        if (type == 'edit' || type == 'view') {
          this.form.xingzqhdm = this.form.xingzqhdm.split("/")
        }
        if (type == 'add') {
          this.form.fabz = this.userInfo.account
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
      if (this.query.xingzqhdm) {
        this.query.xingzqhdm = this.query.xingzqhdm.join("/")
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
        // console.log("getList数据",data.fieldList)
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
