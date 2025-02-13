<template>
  <el-scrollbar ref="scroll">
    <div class="checkToken" v-if="checkToken">

      <div class="checkToken_subtilte">
        <span>{{checkTokenText}}</span>
      </div>
      <div class="checkToken_form">
        <comFormDataCheck
          ref="formCheckRef"
          :formSetData = "formSetData"
          >
        </comFormDataCheck>
      </div>
      <div class="checkToken_btn">
        <el-button
          type="primary"
          size="medium"
          icon="el-icon-circle-check"
          @click.stop="checkTokenFun"
          >提 交
        </el-button>
      </div>
    </div>
    <div class="MyList" v-else>
      <div class="MyList_tilte">
        <span>{{formName}}</span>
      </div>
      <div class="MyList_total">
        <span>共 {{page.total}} 条记录</span>
      </div>
      <ul class="MyList_ul">
        <li>
          <div>

          </div>
          <div>

          </div>
          <div>
            提交时间
          </div>
          <div>
            {{showFieldName}}
          </div>
        </li>
        <li v-for="(item, key) in listData" :key="key" @click.stop="viewMyData(item)">
          <div>
            <i class="el-icon-arrow-right"></i>
          </div>
          <div>
            {{( (page.currentPage-1) * page.pageSize + key + 1 )}}
          </div>
          <div>
            {{item.create_time}}
          </div>
          <div>
            {{item[showField]}}
          </div>

        </li>
      </ul>
      <div class="avue-crud__pagination">
        <el-pagination
          background
          layout="total, prev, pager, next"
          :page-size = "page.pageSize"
          :current-page = "page.currentPage"
          :total="page.total"
          :page-sizes = "page.pageSizes"
          @size-change = "pageSizeChange"
          @current-change = "pageChange"
          >
        </el-pagination>
        <!-- :hide-on-single-page="true" -->
      </div>


      <QSGDrawer :title="dataMagFormTitle"
        size="100%"
        :withHeader="false"
        :showFull="false"
        menuPosition="center"
        :visible.sync="dataMagFormTag"
        class="dataMagFormClass"
        >
        <div class="CMF_MAIN">
          <div class="CMF_HEAD">
            <span>{{formName}}</span>
          </div>
          <div class="CMF_BODY">
            <FormPreview
              id="dataMagFormView"
              ref="dataMagFormRef"
              :option="dataMagFormOption"
              :class="dataMagFormClass"
              :formTemplateFlatJson="dataMagFormFlatJson"
              :handleFormSubmit="handleFormSubmit"
              :data.sync="dataFormData"
              :key="dataMagFormKey"
            />
          </div>
          <div class="CMF_FOOT"></div>
          <div class="CMF_CUST" id="CMF_CUST">
            <div
              id="cmfCustDataRef"
              ref="cmfCustDataRef"
              v-html="cmfCustData"
              >{{cmfCustData}}
            </div>
          </div>
        </div>

        <template v-slot:footer>
          <el-button size="small" icon="el-icon-edit" v-if="(!dataMagFormSubBtnTag && !formVerify)" type="primary" @click.stop="comFormMagUpdate">修 改</el-button>
          <el-button size="small" icon="el-icon-circle-check" v-if="(dataMagFormSubBtnTag && !formVerify)" type="primary" @click.stop="dataMagFormSave">确 定</el-button>
          <el-button size="small" icon="el-icon-circle-close" v-if="!formVerify" @click.stop="dataMagFormClose">取 消</el-button>
          <el-button size="small" icon="el-icon-circle-close" v-if="formVerify"  type="warning" plain @click.stop="dataMagFormClose">关 闭</el-button>
        </template>
      </QSGDrawer>

    </div>
  </el-scrollbar>
</template>

<script>
//import { getRules } from "@/util/regx";
import { baseURL } from '@/api/common';
import FormPreview from '@/components/formPreview';
import comFormDataCheck from './comFormDataCheck';
import QSGDrawer from "@/components/QSGDrawer";
import {validatenull} from '@/util/validate'
import {
  getFromTemplate,
  //getFromCaptcha,
  //submitFrom,
  //sendPhoneCode,
  sGetListData,
  //getListData,
  //viewListData,
  //saveOrUpdateListData,
  sViewListData,
  sUpdateListData
} from "@/api/system/commonFormData";

export default {
  name: '通用表单数据历史',
  inject: ["desktopWindow", "desktop"],
  components: {
    FormPreview,
    comFormDataCheck,
    QSGDrawer
  },
  data() {
    return {
      formVerify:false,

      isCustomTable:0,
      cmfCustData:'',
      checkToken:false,
      checkTokenText:'校检',
      vertoken:'',
      formSetData:{},
      templateId:'',
      metObjName:'',
      systemCode:'',
      vid:'',
      formName:'',
      dataFormOption:{
        submitBtn:false,
        emptyBtn:false,
        column:[],
      },
      captchaImg:'',
      captchaKey:'',
      captchaValue:'',
      dataFormFlatJson:[],
      formData: {},

      loading: true,
      page: {
        "pageSize": 10,
        "currentPage": 1,
        "total": 0,
        "pageSizes": [ 10, 20, 30, 40, 50, 100 ]
      },

      query: {},
      listData:[],

      dataMagFormTitle:'通用表单',
      dataMagFormTag:false,
      dataMagFormSubBtnTag:true,
      dataMagFormSubType:'add',

      dataMagFormOption:{
        submitBtn:false,
        emptyBtn:false,
        column:[],
      },
      dataMagFormFlatJson:[],

      dataFormData:{},

      formField:{},

      //dataMagFormClass:"avue--view avue--detail",
      dataMagFormClass:"",
      dataMagFormKey:0,
      dataInitId:null,
      dataInitTemplateId:'',
      showField:'',
      showFieldName:''

    }
  },
  methods: {
    htmlDecodeByRegExp(str){
      let temp = "";
      if(validatenull(str)) return "";
      temp = str.replace(/&amp;/g,"&");
      temp = temp.replace(/&lt;/g,"<");
      temp = temp.replace(/&gt;/g,">");
      temp = temp.replace(/&nbsp;/g," ");
      // eslint-disable-next-line
      temp = temp.replace(/&#39;/g,"\'");
      // eslint-disable-next-line
      temp = temp.replace(/&quot;/g,"\"");
      return temp;
    },
    async getActiveForm(){
      //console.log(this.$route)
      if (this.desktop) {
        this.templateId = this.desktopWindow.data.query.templateId;
        this.metObjName = this.desktopWindow.data.query.metObjName;
        this.systemCode = this.desktopWindow.data.query.systemCode;
        this.vertoken = this.desktopWindow.data.query.vertoken;
        this.vid = this.desktopWindow.data.query.vid;
        this.vidType = this.desktopWindow.data.query.vidType;
      }else{

        if(this.$route.query.templateId && this.$route.query.metObjName) {
          this.templateId = this.$route.query.templateId;
          this.metObjName = this.$route.query.metObjName;
          this.systemCode = this.$route.query.systemCode;
          this.vertoken = this.$route.query.vertoken;
          this.vid = this.$route.query.vid;
          this.vidType = this.$route.query.vidType;
        }
      }

      this.refreshChange();

      if( !validatenull(this.vid) && !validatenull(this.templateId)){
        const viewDataParam = {
          "id":this.vid,
        }
        if (this.isCustomTable == 0 ){
          viewDataParam.form_template_version_id = this.templateId;
        }else{
          viewDataParam.template_version_id = this.templateId;
        }
        //console.log(viewDataParam);
        this.viewMyData(viewDataParam).then(()=>{
          if(this.vidType == 'edit' && !this.formVerify){
            this.comFormMagUpdate();
          }
        });

      }
    },

    async showCheckForm(){
      const dataParam = {
        id:this.templateId
      };
      await getFromTemplate(dataParam).then((res) => {
        const dataRes = res.data.data;
        this.dataFormOption = JSON.parse(dataRes.formTemplateJson);
        this.dataFormFlatJson = JSON.parse(dataRes.formTemplateFlatJson);
        this.cmfCustData = this.htmlDecodeByRegExp(dataRes.desc);

        this.formSetData = {
          templateId: this.templateId,
          metObjName: this.metObjName,
          systemCode: this.systemCode,
          verifyType: dataRes.verifyType,
          vertoken: this.vertoken,
          formOption: this.dataFormOption,
        };
        if(dataRes.verifyType == 1 ){
          this.checkTokenText = '手机号校检';
        }

      }, error => {
        window.console.log(error);
      });

      this.checkToken = true;
    },

    pageChange(current){
      //console.log(current);
      this.page.currentPage = current;
      this.refreshChange();
    },
    pageSizeChange(size){
      //console.log(size);
      this.page.currentPage = 1;
      this.page.pageSize = size;
      this.refreshChange();
    },

    refreshChange() {
      this.onLoad(this.page, this.query);
    },
    onLoad(page/*, params = {}*/) {
      if(this.metObjName &&  this.templateId && this.systemCode && this.vertoken){
        this.loading = true;
        const dataParam =  {
          "reqPage": {
            "current": page.currentPage,
            "size": page.pageSize
          },
          "metaObjName": this.metObjName,
          "systemCode": this.systemCode,
          "templateVersionId": this.templateId,
          "vertoken": this.vertoken
        }

        sGetListData(dataParam).then(res => {
          const dataRes = res.data.data;
          this.page.total = dataRes.rspPage.totalItems;
          this.page.pageSize = dataRes.rspPage.size;
          this.page.currentPage = dataRes.rspPage.current;
          this.formName = dataRes.formName;
          document.title = this.formName;
          this.listData = dataRes.fieldList;
          this.formVerify = ((dataRes.isAudit == 1)? true:false);
          this.isCustomTable = dataRes.isCustomTable;
          if(this.page.total == 1 ){
            this.viewMyData(this.listData[0]);
          }

          for(let key in dataRes.headerList[0]){
            //console.log(key)
            //console.log(dataRes.headerList[0][key])
            this.showField = key;
            this.showFieldName = dataRes.headerList[0][key];
          }

          this.loading = false;
        }, error => {
          window.console.log(error);
          this.showCheckForm();
        });
      }else{
        this.showCheckForm();
      }
    },

    async getTemplateVersion(id){
      const TemplateParam = {
        id:(id?id:this.templateId)
      };
      await getFromTemplate(TemplateParam).then((res) => {
        const dataRes = res.data.data;
        this.dataMagFormOption = JSON.parse(dataRes.formTemplateJson);
        this.dataMagFormFlatJson = JSON.parse(dataRes.formTemplateFlatJson);
        this.cmfCustData = this.htmlDecodeByRegExp(dataRes.desc);
      }, error => {
        window.console.log(error);
      });
    },

    async viewMyData(row/*, index*/){
      //console.log(row);
      this.dataMagFormTitle = "数据查看";
      this.dataMagFormClass = "avue--view avue--detail";
      this.dataInitTemplateId = ( (this.isCustomTable == 0 ) ? row.form_template_version_id : row.template_version_id);
      this.dataInitId = row.id;
      await this.getTemplateVersion(this.dataInitTemplateId);
      this.dataMagFormKey++;
      this.comFormMagItem("view");
      this.dataFormData = await this.comFormMagDataInit(row);
      this.dataMagFormSubBtnTag = false;
      this.dataMagFormSubType="view";
      this.dataMagFormTag = true;

    },

    async comFormMagUpdate(){
      if(this.formVerify){
        this.$message.error('当前数据正在审核，不允许修改！');
      }else{
        this.dataMagFormTitle = "数据编辑";
        this.dataMagFormClass = "";
        this.dataMagFormKey++;
        this.comFormMagItem("update");
        this.dataMagFormSubBtnTag = true;
        this.dataMagFormSubType="update";
        this.dataMagFormTag = true;
      }


    },
    async comFormMagDataInit(row){
      this.dataFormData = {};

      const dataResFun = await sViewListData({
        id:row.id ,
        metObjName:this.metObjName,
        systemCode: this.systemCode,
        vertoken:this.vertoken
      })

      const dataRes = dataResFun.data.data;
      return dataRes;
    },
    comFormMagItem(actionType){
      const formItems = this.dataMagFormOption.column;
      formItems.map((item)=>{
        if( actionType == "view"){
          item.disabled = true;
        }else{
          item.disabled = false;
        }
      })
    },

    dataMagFormClose(){
      this.cmfCustData = "";
      this.dataMagFormClass = "";
      this.dataInitTemplateId = "";
      this.dataInitId = null;
      this.dataMagFormTag = false;
    },

    dataMagFormSave(){
      this.$refs.dataMagFormRef.validate((valid, /*msg*/) => {
        if (valid) {

          const dataMagFormDataJson = this.$refs.dataMagFormRef.buildSubmitData();
          const dataParam = {
            id:this.dataInitId,
            templateVersionId:this.dataInitTemplateId,
            metObjName:this.metObjName,
            systemCode:this.systemCode,
            formDataJson:dataMagFormDataJson,
            vertoken:this.vertoken
          }
          //console.log(dataParam);
          sUpdateListData(dataParam).then((/*res*/) => {
            this.refreshChange();
            this.dataMagFormTag = false;
            this.$message({
              type: "success",
              message: "操作成功!"
            });
            this.dataMagFormClose();
          }, error => {
            window.console.log(error);
          });

        }else{
          window.console.log('error submit!!');
          return false;
        }
      })
    },
    async getCheckRes(){
      return await this.$refs.formCheckRef.checkRes();
    },
    checkTokenFun(){
      //console.log('checkTokenFun');
      this.getCheckRes().then((res)=>{
        //console.log(res);
        if(res.success){
          this.vertoken = res.data.vertoken;

          const defaultPastUrl = window.location.origin+`${baseURL}`+'#/comFormDataPast?templateId='+this.templateId+'&metObjName='+this.metObjName+'&systemCode='+this.systemCode+'&vertoken='+this.vertoken;

          window.location.href = defaultPastUrl;
          this.checkToken = false;
        }
      })
    },

  },
  mounted() {
    this.getActiveForm();
  },
  created:function(){
    //this.getActiveForm();
  },
  watch: {
    '$route': 'getActiveForm',
    'desktopWindow.data': {
      handler(/*newVal*/) {
        this.getActiveForm()
      },
      deep: true
    },

  },
}
</script>

<style>

.CMF_MAIN { max-width: 1000px; margin: 0 auto ;  background-color: #fff; border-left:1px solid #ebeef5; border-right:1px solid #ebeef5; box-shadow: 0 2px 12px 0 rgba(0,0,0,.1); }
.CMF_HEAD { text-align: center;  background-color: #409EFF;  }
.CMF_HEAD span { font-size: 18px; line-height: 50px; color: #FFF;}
.CMF_BODY { padding: 0 10px; }
.CMF_FOOT {}
.CMF_CUST {}

</style>

<style lang="scss" scoped>
.checkToken {
  min-width:320px;
  max-width:640px;
  margin:0 auto;
  padding:20px 10px;

  .checkToken_tilte {}
  .checkToken_subtilte { font-size:20px; color:#303133; padding:10px 0px;}
  .checkToken_form {}
  .checkToken_btn { text-align:center;}
  .checkToken_btn>.el-button { width:90%; max-width:270px; margin:15px auto 0; }
}
.comFormData {
  /deep/.ADD_w { padding-top: 20px; padding-left:10px;  border-top: 1px solid #f0f0f0;}
  /deep/.ADD_w .el-input { max-width:300px;}
  /deep/.ADD_item_captcha>img { float:left; height:30px; margin-right:10px;}
  /deep/.ADD_item_captcha>span { float:left;display:block; width:100px; font-size:12px; cursor:pointer; }
  /deep/.ADD_item_captcha>.el-input { float:left;width:160px; margin-right:10px;}

  /deep/.ADD_sub {   text-align: center; padding: 20px 0px; border-top: 1px solid #f0f0f0;}
  /deep/.ADD_sub { }
}
.MyList {
  min-width:320px;
  max-width:640px;
  margin:0 auto;
  padding:20px 10px;

  border-left:1px solid #ebeef5;
  border-right:1px solid #ebeef5;
  .MyList_tilte { text-align:center; font-size:22px; color:#303133; padding:10px 0px;}
  .MyList_total { font-size:12px; color:#606266; padding:10px 0px;}
  .MyList_ul {
    margin:0 auto;
    padding:10px 0px;
    /deep/>li {
      border-radius: 4px;
      border: 1px solid #ebeef5;
      background-color: #F2F6FC;
      overflow: hidden;
      transition: .3s;
      box-shadow: 0 2px 12px 0 rgba(0,0,0,.1);
      margin:0px auto 20px;
      list-style:none;
      display: flex;
      justify-content: flex-start;
      align-items: center;
      position:relative;
      padding:15px 30px 15px 15px ;
      cursor: pointer;
    }
    /deep/>li:nth-child(1) div { font-weight:700;}
    /deep/>li>div { font-size:14px; }
    /deep/>li>div:nth-child(1) { position:absolute; right:10px; top:50%; transform: translate(0, -50%); font-size:22px; }
    /deep/>li>div:nth-child(2) { min-width:20px; font-size:14px; color:#409EFF; margin-right:10px;}
    /deep/>li>div:nth-child(3) { flex-basis: 160px; width:160px; flex-shrink: 0; overflow:hidden; font-size:14px; color:#303133; line-height:20px; margin-right:10px;}
    /deep/>li>div:nth-child(4){
      overflow: hidden; -webkit-box-orient: vertical; -webkit-line-clamp: 1; display: -webkit-box;
    }


  }
  /deep/.dataMagFormClass .el-dialog__body { background-color: #f5f5f5;  }
  /deep/.dataMagFormClass .el-dialog__footer { padding:30px 10px 60px; border-top:none;}
}

</style>
