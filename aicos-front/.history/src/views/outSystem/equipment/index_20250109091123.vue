<template>
  <HuilanBasic>
    <el-tabs v-model="tabType" @tab-click="tabChange">
      <el-tab-pane name="ALL">
        <span slot="label"><i class="el-icon-s-order"></i> 我的</span>
      </el-tab-pane>
      <el-tab-pane name="TODO">
        <span slot="label"><i class="el-icon-s-management"></i> 共享</span>
      </el-tab-pane>
    </el-tabs>
    <div class="armyList">
      <avue-crud :option="option" :table-loading="loading" :data="data" :page="page" :permission="permissionList"
                 :before-open="beforeOpen" v-model="form" ref="crud" @row-update="rowUpdate" @row-save="rowSave" @row-del="rowDel"
                 @refresh-change="refreshChange"
                 @search-change="searchChange" @search-reset="searchReset" @selection-change="selectionChange"
                 @current-change="currentChange" @size-change="sizeChange" @on-load="onLoad">
        <template slot="shebmc" slot-scope="scope">
          <div class="shebmc">
            <img v-if="scope.row.read_status == 0" :src="newImg" alt="未读消息" style="width: 1.4rem;height: auto;" />
            <span>{{scope.row.shebmc}}</span>
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
          <el-upload v-if="permissionList.uploadBtn && tabType =='ALL'" :auto-upload="false" :show-file-list="false"
                     :on-change="handleChange" style="display: inline-block;">
            <el-button size="small" icon="el-icon-upload2" type="primary" ref="comp_chose">导入</el-button>
          </el-upload>
          <el-button v-if="permissionList.downloadExcel && tabType =='ALL'" size="small" icon="el-icon-download" type="primary"
                     @click="downloadExcel">
            下载模版
          </el-button>
          <el-button v-if="permissionList.addBtn && tabType =='ALL'" size="small" icon="el-icon-plus" type="primary" @click="handleAdd">新增</el-button>
        </template>
        <template v-slot:menu="scope">
          <el-button type="text" size="small" v-if="permissionList.viewBtn"
                     @click="handleView(scope.row,scope.index)">查看
          </el-button>
          <el-button type="text" size="small" v-if="tabType =='ALL' && permissionList.updateBtn && (scope.row.zhuangt == 1 || scope.row.zhuangt == 3)"
                     @click="handleUpdate(scope.row,scope.index)">编辑
          </el-button>
          <el-button type="text" size="small" v-if="tabType =='ALL' && scope.row.zhuangt == 4 && permissionList.shareBtn && scope.row.xiafzt != 1"
            @click="comFormShare(scope.row)">共享
          </el-button>

          <el-button type="text" size="small" v-if="tabType =='ALL' && permissionList.delBtn && (scope.row.zhuangt == 1 || scope.row.zhuangt == 3)"
                     @click="handelDel(scope.row)">删除
          </el-button>
          <el-button type="text" size="small" v-if="tabType =='ALL' && permissionList.examineBtn && scope.row.zhuangt === '2'"
                     @click="handelExamine(scope.row)">审核
          </el-button>
          <el-button type="text" size="small" v-if="tabType =='ALL' && permissionList.submit && (scope.row.zhuangt == 1 || scope.row.zhuangt == 3)"
                     @click="handelSubmit(scope.row)">提交
          </el-button>
        </template>
      </avue-crud>


    </div>
    <!--共享单位-->
    <HuilanDialog :title="shareTitle" :fullscreen="false" append-to-body :before-close="shareClose" :visible.sync="shareTag" class="dataMagFormClass">
      <avue-form id="dataMagFormView" ref="dataMagFormRef" v-model="formshare" :option="optionshare" v-if="showform" @submit="handleSubmit">
      </avue-form>
    </HuilanDialog>
  </HuilanBasic>

</template>

<script>
import {baseURL} from "@/api/common";
const baseUrl = process.env.BASE_URL;
import {dateFormat} from "@/util/date";
import { mapGetters } from "vuex";
import {getUserInfoPost} from "@/api/system/user";
import {add, update, remove, getList, submit,disagree,complete, exportExcel, importExcel, importTemplateFile, getById,getListDataShare,getEnterList} from "@/api/outSystem/equipment";
import {
  danwei
} from "@/api/outSystem/fileManage";
export default {
  data () {
    var lianxfs = (rule, value, callback) => {
      const regMobile = /^1(3|4|5|6|7|8|9)\d{9}$/
      if(!regMobile.test(value)){
        callback(new Error('请输入正确的手机号'))
      }else{
        callback()
      }
    }
    return {
      newImg:`${baseUrl}img/new.png`,
      // 上传数据
      tabType: "ALL",
      shareTitle:'共享',
      shareTag:false,
      showform:false,

      formshare:{},
      optionshare:{
        emptyBtn: false,
        column: [
          {
            type: 'input',
            label: '设备名称',
            span: 16,
            display: true,
            hideLabel: false,
            prop: 'chenggmc',
            isListDisplay: true,
            width:150,
          },
          {
            type: 'textarea',
            label: '功能描述',
            span: 16,
            display: true,
            overHidden:true,
            hideLabel: false,
            prop: 'chenggjj',
            isListDisplay: true,
            width:150,
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

      fileList: [],
      userInfo:{},
      addressData:[],
      dataJson:{},
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
        addBtn:false,
        editBtn:false,
        delBtn:false,
        index: true,
        indexLabel:'设备编号',
        indexWidth:100,
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
            label: '设备名称',
            width:100,
            span: 24,
            display: true,
            hideLabel: false,
            dataType: '',
            prop: 'shebmc',
            isListDisplay: true,
            search: true,
            required: true,
            rules: [
              {
                required: true,
                message: '设备名称必须填写'
              }
            ]
          },
          {
            type: 'select',
            label: '设备类型',
            width:100,
            cascaderItem: [],
            span: 24,
            display: true,
            props: {
              label: 'name',
              value: 'name'
            },
            hideLabel: false,
            dataType: '',
            prop: 'sheblx',
            isListDisplay: true,
            search: true,
            dicUrl: '/aicos/api/aicos-system/baseDict/getDictItemListByDictCode',
            dicMethod: 'post',
            required: true,
            rules: [
              {
                required: true,
                message: '设备类型必须填写'
              }
            ],
            dicQuery: {
              code: 'sbzy_sblx'
            }
          },
          {
            type: 'textarea',
            label: '功能描述',
            span: 24,
            display: true,
            hide:true,
            overHidden:true,
            hideLabel: false,
            dataType: '',
            prop: 'gongnms',
            isListDisplay: true,
            search: false,
            rules: [
              {
                required: true,
                message: '功能描述必须填写'
              }
            ],
          },
          {
            type: 'input',
            label: '规格型号',
            span: 24,
            display: true,
            hide:true,
            hideLabel: false,
            dataType: '',
            prop: 'guigxh',
            isListDisplay: true,
            search: false,
            rules: [
              {
                required: true,
                message: '规格型号必须填写'
              }
            ],
          },
          {
            type: 'input',
            label: '技术指标',
            span: 24,
            display: true,
            hide:true,
            hideLabel: false,
            dataType: '',
            prop: 'jiszb',
            isListDisplay: true,
            search: false,
            rules: [
              {
                required: true,
                message: '技术指标必须填写'
              }
            ],
          },
          {
            type: 'upload',
            label: '设备logo',
            span: 24,
            display: true,
            hide:true,
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
            listType: 'picture',
            prop: 'sheblogo',
            isListDisplay: true,
            search: false,
            accept: 'image/png, image/jpeg',
            fileSize: 10000,
            tip: '只能上传jpg/png，且不超过10M',
            data: {
              fromSystemName: 'base'
            },
            rules: [
              {
                required: true,
                message: '设备logo必须填写'
              }
            ],
          },
          {
            type: 'input',
            label: '制造厂家',
            span: 24,
            hide:true,
            display: true,
            hideLabel: false,
            dataType: '',
            prop: 'zhizcj',
            isListDisplay: true,
            search: false,
            required: false,
            rules: [
              {
                required: true,
                message: '制造厂家必须填写'
              }
            ]
          },
          {
            type: 'select',
            label: '先进程度',
            cascaderItem: [],
            span: 24,
            display: true,
            hide:true,
            props: {
              label: 'name',
              value: 'name'
            },
            rules: [
              {
                required: true,
                message: '先进程度必须填写'
              }
            ],
            hideLabel: false,
            dataType: '',
            prop: 'xianjcd',
            isListDisplay: true,
            search: true,
            dicUrl: '/aicos/api/aicos-system/baseDict/getDictItemListByDictCode',
            dicMethod: 'post',
            dicQuery: {
              code: 'xjcd'
            }
          },
          {
            type: 'date',
            label: '采购日期',
            span: 24,
            display: true,
            hide:true,
            format: 'yyyy-MM-dd',
            valueFormat: 'yyyy-MM-dd',
            hideLabel: false,
            dataType: '',
            prop: 'caigsj',
            isListDisplay: true,
            search: false,
            rules: [
              {
                required: true,
                message: '采购日期必须填写'
              }
            ]
          },
          {
            type: 'date',
            label: '过保时间',
            span: 24,
            display: true,
            hide:true,
            format: 'yyyy-MM-dd',
            valueFormat: 'yyyy-MM-dd',
            hideLabel: false,
            dataType: '',
            prop: 'guobsj',
            isListDisplay: true,
            search: false,
            rules: [
              {
                required: true,
                message: '过保时间必须填写'
              }
            ]
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
            ]
          },
          {
            type: 'input',
            label: '联系电话',
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
              }
            ],
            width:100,
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
            type: 'input',
            label: '安装地点',
            span: 24,
            display: true,
            hideLabel: false,
            dataType: '',
            prop: 'anzdd',
            isListDisplay: true,
            search: false,
            required: true,
            rules: [
              {
                required: true,
                message: '安装地点必须填写'
              }
            ],
            width:120,
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
            search: false
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
                label: '审核不通过',
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
            hideLabel: false,
            dataType: '',
            prop: 'zhuangt',
            isListDisplay: true,
            search: true,
            width:100,
          },
          {
            type: 'datetime',
            label: '时间',
            span: 24,
            display: false,
            hide:true,
            format: 'yyyy-MM-dd HH:mm:ss',
            valueFormat: 'yyyy-MM-dd HH:mm:ss',
            searchDefaultTime: ["00:00:00", "23:59:59"],//搜索框的默认时分秒设置
            hideLabel: false,
            dataType: '',
            prop: 'shijfw',
            isListDisplay: true,
            search: true,
            searchRange: true,
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
    permissionList () {
      return {
        addBtn: this.vaildData(
          this.permission["system-equipment-add"],
          false
        ),
        viewBtn: this.vaildData(
          this.permission["system-equipment-view"],
          false
        ),
        updateBtn: this.vaildData(
          this.permission[`system-equipment-update`],
          false
        ),
        delBtn: this.vaildData(
          this.permission[`system-equipment-delete`],
          false
        ),
        // 提交
        submit: this.vaildData(
          this.permission[`system-equipment-submit`],
          false
        ),
        //   审核
        examineBtn: this.vaildData(
          this.permission[`system-equipment-examineBtn`],
          false
        ),
        //导入
        uploadBtn: this.vaildData(
          this.permission[`system-equipment-uploadBtn`],
          false
        ),
        // 下载模版
        downloadExcel: this.vaildData(
          this.permission["system-equipment-download"],
          false
        ),
        // 导出
        exportExcel: this.vaildData(
          this.permission["system-equipment-export"],
          false
        ),
        //共享
        shareBtn: this.vaildData(
          this.permission["system-equipment-share"],
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
  mounted(){
    this.danweiList()
  },
  created(){
    // this.getAddress()
    //   获取用户信息
    this.getUserInfoPost()
  },
  methods: {
    danweiList(){
      const params = new URLSearchParams();
      params.append("name", '');
      danwei(params).then(res=>{
        this.optionshare.column[2].dicData.push(...res.data.data)
      })
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

    // 获取用户信息
    getUserInfoPost(){
      getUserInfoPost().then((res)=>{
        this.userInfo = res.data.data;
      })
    },
    // 审核
    handelExamine(row){
      let param = new URLSearchParams()
      param.append("id",row.id)
      param.append("processReason",'')
      this.$confirm('确定将选择数据审核通过',  {
        confirmButtonText: '通过',
        cancelButtonText: '拒绝',
        type: 'warning',
        distinguishCancelAndClose: true,
      }).then(() => {
        complete(param).then(()=>{
        }).then(()=>{
          this.onLoad(this.page)
          this.$message({
            type: 'success',
            message: '审核通过!'
          });
        })
      }).catch(action => {
        if (action === 'cancel'){
          disagree(param).then(()=>{
          }).then(()=>{
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
    handelSubmit(row){
      this.$confirm("确定将选择数据提交?", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(()=>{
        let param = new URLSearchParams()
        param.append("id",row.id)
        submit(param).then(()=>{
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
    handleAdd(){
      this.$refs.crud.rowAdd();
    },
    // 导入信息
    // handleChange (file, fileLis) {
    //   // console.log("fileLis",fileLis)
    //   this.$Export.xlsx(file.raw)
    //     .then(data => {
    //       this.form = data.results;
    //     })
    // },

    rowSave (row, done, loading) {
      row.yingyly = row.yingyly.join(',')
      if (row.sheblogo.constructor === Array){
        row.sheblogo = row.sheblogo[0].value;
      }

      add(row).then(()=>{
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
    rowUpdate (row, index, done, loading) {
      if(Array.isArray(row.yingyly)){
        row.yingyly = row.yingyly.join(',')
      }
      if (row.sheblogo.constructor === Array){
        row.sheblogo = row.sheblogo[0].value;
      }
      update(row).then(()=>{
        done();
        this.onLoad(this.page);
        this.$message({
          type: "success",
          message: "修改成功！"
        });
      }, error => {
        window.console.log(error);
        loading();
      });

    },
    handleView(row, index){
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
    handleUpdate(row, index){
      this.$refs.crud.rowEdit(row, index);
    },
    refreshChange() {
      this.onLoad(this.page, this.query);
    },
    handelDel(row){
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

    beforeOpen (done, type) {
      if (["add", "edit", "view"].includes(type)) {
        this.initData(type);
      }
      if(type == 'add'){
        this.form.fabz = this.userInfo.account
      }
      done();
    },

    initData(/*type*/) {},

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
    currentChange (currentPage) {
      this.page.currentPage = currentPage;
    },
    sizeChange (pageSize) {
      this.page.pageSize = pageSize;
    },
    onLoad (page, params = {}) {
      this.loading = false;
      if (this.tabType == "ALL"){
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
      }else{
        const dataParam = {
          reqPage: {
            current: page.currentPage,
            size: page.pageSize
          },
          searchParam: this.query,
        };
        getListDataShare(dataParam).then(res => {
          const data = res.data.data;

          this.page.total = data.rspPage.totalItems;
          this.page.pageSize = data.rspPage.size;
          this.page.currentPage = data.rspPage.current;
          this.data = data.fieldList;


          this.loading = false;
          this.selectionClear();
        });
      }
    },
    tabChange () {
      this.query = {};
      this.page.currentPage = 1;
      this.onLoad(this.page);
    },
    //共享
    comFormShare(row){
      this.shareTag = true
      this.showform = true
      this.formshare = row
      this.    chenggmc
    },
    handleSubmit (form, done) {
      form.xiafdw = form.xiafdw.join(',')
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
      this.formshare = {}
    },
  }
};
</script>

<style>

</style>
