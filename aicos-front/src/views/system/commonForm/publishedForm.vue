<template>
  <div>
    <avue-crud :option="option"
      :search.sync="query"
      :table-loading="loading"
      :data="data"
      ref="crud"
      v-model="form"
      :permission="permissionList"
      @row-del="rowDel"
      :page.sync="page"
      @search-change="searchChange"
      @search-reset="searchReset"
      @current-change="currentChange"
      @size-change="sizeChange"
      @refresh-change="refreshChange"
      @on-load="onLoad">
       <template slot-scope="scope" slot="menu">
            <!-- <el-button
              type="text"
              icon="el-icon-circle-plus-outline"
              size="small"
              @click.stop="addFormData(scope.row,scope.index)"
            >新增表单数据
            </el-button> -->
            <!-- <el-button
              type="text"
              size="small"
              icon="el-icon-edit"
              @click.stop="comFormPreviewAdd(scope.row,scope.index)"
            >数据录入
            </el-button>
            <el-button
              type="text"
              size="small"
              icon="el-icon-edit-outline"
              @click.stop="comFormPreviewMag(scope.row,scope.index)"
            >数据管理
            </el-button>
            <el-button
              type="text"
              size="small"
              icon="el-icon-camera"
              @click.stop="comFormPreview(scope.row,scope.index)"
            >扫码
            </el-button> -->

         <!-- <el-button
           type="text"
           icon="el-icon-document"
           size="small"
           @click.stop="messageTplParams(scope.row,scope.index)"
         >消息模板变量
         </el-button> -->
         </template>
    </avue-crud>

      <!-- <HuilanDialog
        title="新增表单数据"
        :fullscreen="true"
        append-to-body
        :visible.sync="formDialogVisible"
      >
        选择流程：<el-select
          placeholder="请选择流程"
          size="small"
          v-model="flow"
        >
          <el-option v-for="item in flowList" :key="item.id" :value="item.id" :label="`${item.name}(${item.version})`"></el-option>
        </el-select>
        <el-divider></el-divider>
        <template
          v-if="formDialogVisible"
        >
          <FormPreview
            v-if="curForm.type !=='custom'"
            ref="form"
            :option="formOption"
            :formTemplateFlatJson="formTemplateFlatJson"
            :data.sync="formData"

            :handleFormSubmit="handleFormSubmit"
          />
          <component v-else :is="FormCmp"/>
        </template>
        <template v-slot:footer>
          <el-popover
            placement="top"
            width="260"
            trigger="click"
            style="margin:0 10px;"
          >
            <p>businessId:</p>
            <el-input size="mini" v-model="businessId"/>
            <div style="text-align: right; margin: 10px 0 0">
              <el-button size="mini" type="text">取消</el-button>
              <el-button type="primary" size="mini" @click="startProcess">确定</el-button>
            </div>
            <el-button slot="reference">启动流程1</el-button>
          </el-popover>
          <el-button @click="startProcess2">启动流程2</el-button>
          <el-button @click="submitToCreate">提交到创建节点</el-button>
        </template>
      </HuilanDialog> -->

<!--       <HuilanDialog
        title="消息模板变量"
        append-to-body
        :visible.sync="paramDialogVisible"
      >
        <MessageTemplateParam
          :tplId="curForm.id"
          :fieldList="formFields"
        /> -->
<!--        <template v-slot:footer>-->
<!--          <el-button @click="submitToCreate">提交到创建节点</el-button>-->
<!--        </template>-->
<!--      </HuilanDialog> -->


      <!-- <HuilanDialog :title="previewTitle"
        :fullscreen="false"
        width="330px"
        append-to-body
        :visible.sync="previewTag"
      >
        <div class="prv_w">
          <div class="prv_img">
            <div class="prv_img_border">
              <span></span>
              <span></span>
              <span></span>
              <span></span>
            </div>
            <img :src="previewUrlImg">
          </div>
          <div class="prv_btn">
            <span>数据录入</span>
            <el-button type="primary" size="mini" icon="el-icon-link" @click="previewGoto('add')">前 往</el-button>
            <el-button type="primary" size="mini" icon="el-icon-document-copy" @click="previewCopy('add')">复制</el-button>
          </div>
          <div class="prv_btn">
            <span>数据管理</span>
            <el-button type="primary" size="mini" icon="el-icon-link" @click="previewGoto('mag')">前 往</el-button>
            <el-button type="primary" size="mini" icon="el-icon-document-copy" @click="previewCopy('mag')">复制</el-button>
          </div>
        </div>

        <template v-slot:footer>
          <el-button size="small" @click="previewClose">取 消</el-button>
        </template>
      </HuilanDialog> -->

    </div>
  </template>

<script>
/*import {mapGetters} from "vuex";*/

import {
  getPublishedVersionList,
  // deletePublishedForm,
  // saveOrUpdateFormData,
  // runToStartUserTask,
  // startProcessById
} from '@/api/system/form'
// import {getPublishedList, startProcessInstanceById} from '@/api/system/flow'

// import FormPreview from '@/components/formPreview'
// import MessageTemplateParam from './messageTemplateParam'


//import { previewListData } from "@/api/system/commonForm";

export default {
  name: 'PublishedFormMgr',
  inject: ["desktopWindow", "desktop"],
  components: {
    // FormPreview,
    // MessageTemplateParam
  },
  props: {
    code: {
      type: String,
      default: ''
    }
  },
  data() {
    return{
      form: {},
      query: {},
      loading: false,
      data: [],
      page: {
        pageSize: 10,
        currentPage: 1,
        total: 0
      },
      option: {
        tip: false,
        searchShow: true,
        searchSpan: 8,
        searchMenuSpan: 6,
        border: true,
        index: true,
        // selection: true,
        //refreshBtn:false,
        //columnBtn:false,
        menu: false,
        menuWidth: 240,
        addBtn:false,
        editBtn:false,
        viewBtn:false,
        delBtn:false,
        dialogClickModal: false,
        dialogWidth: '30%',
        column: [
          {
            label: "数据库表",
            prop: "code",
            span: 24,
            editDisabled: true,
            //headerAlign: 'center',
            rules: [{
              required: true,
              message: "请输入数据库表",
              trigger: "blur"
            }]
          },
          {
            label: "表单名称",
            prop: "name",
            //headerAlign: 'center',
            span: 24,
            //search: true,
            rules: [{
              required: true,
              message: "请输入表单名称",
              trigger: "blur"
            }]
          },
          {
            label: "版本",
            prop: "version",

            align:"center"
          },
          {
            label: "更新时间",
            prop: "updateTime",
            align:"center",
            width:160,

          },
        ]
      },

      formDialogVisible: false,
      formOption: {},
      formData: {},
      flowList: [],
      formTemplateFlatJson: [],
      flow: '',
      curForm: {},
      paramDialogVisible: false,
      formFields: [],
      FormCmp: 'FormCmp',
      businessId: '',

      previewTitle:'预览',
      previewTag:false,
      previewFormObj:'',
      previewUrlImg:'',
      previewUrlAdd:'',
      previewUrlMag:'',

    }
  },
  computed: {
    /*...mapGetters(["permission"]),
    permissionList() {
      return {
        addBtn: false,
        viewBtn: false,
        delBtn: false,
        editBtn: false
      };
    },*/
  },
  methods: {
    /*rowDel(row, index, done) {
      this.$confirm("确定将选择数据删除?", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          return deletePublishedForm(row.id);
        })
        .then(() => {
          this.$message({
            type: "success",
            message: "操作成功!"
          });
          // 数据回调进行刷新
          this.onLoad(this.page)
          done();
        });
    },*/
    searchReset() {
      this.query = {};
      // this.parentId = 0;
      this.onLoad(this.page);
    },
    searchChange(params, done) {
      this.query = params;
      // this.parentId = '';
      this.page.currentPage = 1;
      this.onLoad(this.page, params);
      done();
    },
    currentChange(currentPage) {
      this.page.currentPage = currentPage;
    },
    sizeChange(pageSize) {
      this.page.pageSize = pageSize;
    },
    refreshChange() {
      this.onLoad(this.page, this.query);
    },
    onLoad(page, params = {}) {
      const pageConf = {
        type: 'dynamic',
        code: this.code,
        current: page.currentPage,
        size: page.pageSize
      };
      this.loading = true;
      getPublishedVersionList(Object.assign(params, this.query, pageConf)).then(res => {
        const data = res.data.data;
        this.loading = false;
        this.data = data.records;
        this.page.total = data.total;
      });
    },
    /*addFormData(row) {
      this.curForm = row
      if(row.type === 'custom') {
        const url = row.url.replace('@/views', '')

          import('@/views' + url + '.vue').then(Cmp => {
            this.$options.components.FormCmp = Cmp.default
            this.formDialogVisible = true
          })
          return
      }
      if(row.formTemplateJson) {
        this.formOption = JSON.parse(row.formTemplateJson)
        // this.formTemplateFlatJson = JSON.parse(row.formTemplateFlatJson)
      }else {
        this.formOption = {}
        this.formTemplateFlatJson = []
      }
      this.formData = {}
      this.flow = ''


      this.formDialogVisible = true
    },*/
    // buildSubmitData() {
    //   let res = []
    //   for(let [key, val] of Object.entries(this.formData)) {
    //     if(!key.startsWith('$')) {
    //       let v = val
    //       if(Array.isArray(val)) {
    //         v = val.join()
    //       }
    //       res.push({name: key, value: v})
    //     }
    //   }
    //   return JSON.stringify(res)
    // },
    /*async handleFormSubmit(form,done) {
      const params = {
        formTemplateVersionId: this.curForm.id,
        formDataJson: this.$refs.form.buildSubmitData()
      }
      const {data:{data}} = await saveOrUpdateFormData(params)

      const startp = {
        processDefinitionId: this.flow,
        businessId: `${this.curForm.id};${data.id}`
      }
      if(!this.flow) {
        this.$alert('请选择流程！')
        done()
        return
      }
      await startProcessInstanceById(startp)
      done()
      this.formDialogVisible = false
    },
    async getFlow() {
      const params = {
        current: 1,
        size: 1000
      }
      const {data:{data:{records}}} = await getPublishedList(params)

      this.flowList = records
    },
    async submitToCreate() {
      const params = {
        processId: this.flow,
        formTemplateVersionId: this.curForm.id
      }
      await runToStartUserTask(params);

      this.$message({
        type: "success",
        message: "操作成功!"
      });
    },
    messageTplParams(row) {
      this.curForm = row
      this.formFields = JSON.parse(row.formTemplateFlatJson)

      this.paramDialogVisible = true
    },
    async startProcess() {
      const params= {
        processDefinitionId: this.flow,
        businessId: this.businessId,
      }
      await startProcessById(params);

      this.$message({
        type: "success",
        message: "操作成功!"
      });
    },
    startProcess2() {
      this.$refs.form.submit()
    },*/

    /*async comFormPreviewAdd(row){
      //console.log('录入');
      await this.comFormPreviewInit(row,false);
      this.previewGoto("add");

    },
    async comFormPreviewMag(row){
      //console.log('管理');
      await this.comFormPreviewInit(row,false);
      this.previewGoto("mag");
      this.$emit("versionClose");
    },

    async comFormPreview(row){
      //console.log('扫码');
      await this.comFormPreviewInit(row,true);
      this.previewTag = true;
    },

    async comFormPreviewInit(row,canImg){

      this.previewFormObj = {};
      this.previewUrlImg = '';
      this.previewUrlAdd = '';
      this.previewUrlMag = '';

      const dataParam = {
        "id":row.id,
        "imageInlcuded": canImg
      };
      await previewListData(dataParam).then((res) => {
        //console.log(res);
        const dataRes = res.data.data;
        this.previewTitle = row.name+'_V'+row.version;
        this.previewFormObj = row;
        this.previewUrlImg = dataRes.submissionQrImage;
        this.previewUrlAdd = dataRes.submissionUrl;
        this.previewUrlMag = dataRes.managementUrl;

      }, error => {
        window.console.log(error);
      });

    },

    previewClose(){
      this.previewFormObj = {};
      this.previewUrlImg = '';
      this.previewUrlAdd = '';
      this.previewUrlMag = '';
      this.previewTag = false;
    },
    previewCopy(copyType){
      let goUrl = "";
      if(copyType == 'add'){
        goUrl = this.previewUrlAdd
      }else if(copyType == 'mag'){
        goUrl = this.previewUrlMag;
      }

      this.$Clipboard({
        text: goUrl
      }).then(() => {
        this.$message.success('复制成功')
      }).catch(() => {
        this.$message.error('复制失败')
      });


    },
    previewGoto(goToType){
      //console.log("前往");
      //console.log(goToType);

      if(goToType == 'mag'){

        if (this.desktop) {
          const formWinParm ={
            menuName: '数据管理 ['+this.previewFormObj.name+']',
            imageUrl: 'iconfont iconicon_principal',
            linkUrl:'/system/commonForm/comFormDataMag',
            query:{
              templateId:this.previewFormObj.id,
              metObjName:this.previewFormObj.code,
              systemCode:this.previewFormObj.systemCode
            },
            height:'100%',
            width:'100%',
          };

          const formWin = {
            visible: true,
            zIndex: this.desktop.winList.length + this.desktop.baseZindex,
            data: formWinParm,
            commonParm:"comFormWin"

          }

          //删除已打开的comFormWin窗口
          if( this.desktop.winList.filter((item)=>item.commonParm =="comFormWin").length > 0 ){
            this.desktop.winList = this.desktop.winList.filter((item)=>item.commonParm !="comFormWin")
          }

          this.desktop.winList.push(formWin);

          this.previewTag = false;


        }else{

          this.$router.push({
            path:'./comFormDataMag',
            query:{
              templateId:this.previewFormObj.id,
              metObjName:this.previewFormObj.code,
              systemCode:this.previewFormObj.systemCode
            },
          })
          this.previewTag = false;
        }

        this.$emit("versionClose");

      }else if(goToType == 'add'){
        window.open(this.previewUrlAdd);
      }
    },*/


  },
  mounted() {
    /*this.getFlow()*/
    // let url = '/cdn/test/TestResource.umd.min.js';
    // require([url], function (){
    //
    // })
    // this.$axios.get(url, {responseType: 'text'}).then(({data})=> {
    //   // let a = require(data)
    //   let exports = {}
    //   let require = require
    //   // console.log(a)
    //   let b = eval(data)
    //
    //   // new Function(`return ${data}`)()
    //   // this.$options.components.TestResource = TestResource
    //   // this.cmp = 'TestResource'
    //
    // })

  }
}
</script>

<style scoped lang="scss">
/*.prv_w { }
.prv_img { position:relative; width: 260px; height:220px; margin:0 auto   }
.prv_img_border {}

.prv_img_border span { position: absolute; width: 33px;  height: 33px; border-width: 4px; color: #0073eb; border-style: solid; border-radius:3px;}
.prv_img_border span:first-child { left: 0;  top: 0; border-right: 0;  border-bottom: 0 }
.prv_img_border span:nth-child(2) { right: 0;  top: 0; border-left: 0;  border-bottom: 0 }
.prv_img_border span:nth-child(3) {  bottom: 0; left: 0; border-right: 0; border-top: 0}
.prv_img_border span:nth-child(4) {  bottom: 0; right: 0; border-left: 0; border-top: 0 }

.prv_img img {  width: 160px; height:160px;position: absolute; left: 50%;  top: 50%;  transform: translate(-50%,-50%);object-fit: contain;
    background-color: #f5f5f5; }

.prv_btn { margin-top:30px; padding-left: 20px;  }
.prv_btn>span { margin-right:15px; }
*/
</style>
