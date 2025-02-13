<template>
  <el-scrollbar ref="scroll">
    <div class="CMF_MAIN">
      <div class="CMF_HEAD">
        <span>{{formName}}</span>
      </div>
      <div class="CMF_BODY">
        <div class="comFormData" v-if="showForm">
          <FormPreview
            ref="dataFormRef"
            :option="dataFormOption"
            :formTemplateFlatJson="dataFormFlatJson"
            :handleFormSubmit="handleFormSubmit"
          />

          <template>
            <comFormDataCheck
              ref="formCheckRef"
              :formSetData = "formSetData"
              >
            </comFormDataCheck>

            <template>
              <el-row>
                <el-col :span="24" class="ADD_sub">
                  <el-button
                    v-if="canShow"
                    type="primary"
                    size="small"
                    plain
                    icon="el-icon-date"
                    @click.stop="dataFormPast"
                    >查看历史
                  </el-button>
                  <el-button
                    type="primary"
                    size="small"
                    icon="el-icon-circle-plus-outline"
                    @click.stop="dataFormSub"
                    >提 交
                  </el-button>
                  <el-button
                    v-if="!canShow"
                    icon="el-icon-circle-close"
                    size="small"
                    @click.stop="dataFormCancel"
                  >重 置
                  </el-button>
                </el-col>
              </el-row>
            </template>
          </template>
        </div>
        <div v-if="!showForm" class="RES_w">
          <el-row >
            <el-col :span="24" class="RES_qr">
              <img v-if="canShow" :src="qrImg">
              <i v-if="!canShow" class="RES_qr_i el-icon-finished"></i>
              <span>
                <el-button v-if="canShow"
                  type="primary"
                  size="mini"
                  icon="el-icon-check"
                  circle>
                </el-button>
                提交成功
              </span>
              <span v-if="canShow" >您已经提交成功，扫描二维码关注进度</span>
            </el-col>
          </el-row>
          <el-row v-if="canShow">
            <el-col :span="24" class="RES_bt">
              <el-button
                type="primary"
                size="medium"
                icon="el-icon-date"
                @click.stop="dataFormPast"
                >查看历史
              </el-button>
            </el-col>
          </el-row>
          <el-row v-if="canShow">
            <el-col :span="24" class="RES_bt">
              <el-button
                type="primary"
                size="medium"
                icon="el-icon-edit"
                @click.stop="dataFormEdit"
                >修改表单
              </el-button>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="24" class="RES_bt">
              <el-button
                type="primary"
                size="medium"
                plain
                icon="el-icon-refresh-left"
                @click.stop="resGoBack"
                >再填一次
              </el-button>
            </el-col>
          </el-row>
        </div>
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


  </el-scrollbar>
</template>

<script>
//import { getRules } from "@/util/regx";
import { baseURL } from '@/api/common';
import {validatenull} from '@/util/validate'
import FormPreview from '@/components/formPreview';
import comFormDataCheck from './comFormDataCheck';

import {
  getFromTemplate,
  //getFromCaptcha,
  submitFrom,
  //sendPhoneCode,
  sGetQr,
  sGetCustomeUrl,
} from "@/api/system/commonFormData";

export default {
  name: '通用表单数据录入',
  inject: ["desktopWindow", "desktop"],

  components: {
    FormPreview,
    comFormDataCheck
  },
  data() {
    return {
      cmfCustData:'',
      showForm:true,
      formSetData:{},
      templateId:'',
      metObjName:'',
      systemCode:'',
      vid:'',
      verifyType:0,
      canShow:false,
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
      dataFormData:{},
      vertoken:'',

      customViewUrl:'',
      customUpdateUrl:'',
      qrImg:'',

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
      }else{

        if(this.$route.query.templateId && this.$route.query.metObjName) {
          this.templateId = this.$route.query.templateId;
          this.metObjName = this.$route.query.metObjName;
          this.systemCode = this.$route.query.systemCode;
        }
      }

      const dataParam = {
        id:this.templateId
      };
      await getFromTemplate(dataParam).then((res) => {

        const dataRes = res.data.data;
        this.dataFormOption = this.cutProps(JSON.parse(dataRes.formTemplateJson));
        //console.log(this.dataFormOption);
        this.dataFormFlatJson = JSON.parse(dataRes.formTemplateFlatJson);
        this.formName = dataRes.displayName;
        document.title = this.formName;
        this.cmfCustData = this.htmlDecodeByRegExp(dataRes.desc);

        this.verifyType = dataRes.verifyType;

        this.formSetData = {
          templateId: this.templateId,
          metObjName: this.metObjName,
          systemCode: this.systemCode,
          verifyType: dataRes.verifyType,
          formOption: this.dataFormOption,
          //verifyType:0,
        };
        //console.log(this.formSetData)

        if(this.verifyType == 0 ){
          this.canShow = false ;
        }else{
          this.canShow = true ;
        }
      }, error => {
        window.console.log(error);
      });


      const customParam = {
        metObjName:this.metObjName,
        systemCode:this.systemCode,
      }
      await sGetCustomeUrl(customParam).then(res => {
        const dataRes = res.data.data;
        //console.log(dataRes);
        dataRes.map(item=>{
          if(item.type == 4 ) {this.customUpdateUrl =  item.value ;}
          if(item.type == 5 ) {this.customViewUrl =  item.value ;}
        })
      });


    },
    cutProps(opt){
      //console.log(opt);
      opt.column.map((item)=>{
        if( !validatenull(item.props)){
          //console.log(item);
          item.props.value = item.props.label;
        }
      })

      if( !validatenull(opt.group) ){
        opt.group.map((item)=>{
          if( !validatenull(item.column)){
            item.column.map((tobj)=>{
              if( !validatenull(tobj.props)){
                //console.log(tobj);
                tobj.props.value = tobj.props.label;
              }
            })
          }
        })
      }

      return opt
    },
    async getCheckRes(){
      return await this.$refs.formCheckRef.checkRes();
    },
    async dataFormSub(){

      this.$refs.dataFormRef.validate((valid,done) => {
        if(valid){
          //console.log("验证成功");

          this.getCheckRes().then((res)=>{
            //console.log(res);
            if(res.success){
              const dataFormDataJson = this.$refs.dataFormRef.buildSubmitData();
              //console.log(dataFormDataJson);

              this.vertoken = res.data.vertoken;
              //alert("addtoken==="+this.vertoken)
              const dataParam = {
                ...res.data,
                templateVersionId:this.templateId,
                metObjName:this.metObjName,
                systemCode:this.systemCode,
                formDataJson:dataFormDataJson,
              }
              submitFrom(dataParam).then( async (res) => {
                /*this.$message({
                  type: "success",
                  message: "操作成功!",
                  showClose: true,
                });*/
                this.vid = res.data.data.id;

                this.scrollToTop();
                this.showForm = false;
                if( this.canShow ){
                  const qrUrl =  this.dataFormView();
                  const dataParam = {
                    metObjName:this.metObjName,
                    systemCode:this.systemCode,
                    frontUrl:qrUrl,
                    vertoken:this.vertoken,
                  }
                  await sGetQr(dataParam).then((res)=>{
                    this.qrImg = res.data.data.image;
                  })
                }
                this.dataFormCancel();
                this.$refs.formCheckRef.restCheckForm();
                done();

              }, error => {
                window.console.log(error);
                this.$refs.formCheckRef.restCheckForm();
                done();
              });
            }else{
              done();
              //this.$message.error("验证异常");
            }

          })
        }
      });

    },

    dataFormCancel(){
      this.$refs.dataFormRef.reset();
    },
    scrollToTop(){
      this.$refs['scroll'].wrap.scrollTop = 0;
    },

    devUrl(){
      const defaultUrl = {
        "allUrl":window.location.origin+`${baseURL}`+'#/comFormDataPast?templateId='+this.templateId+'&metObjName='+this.metObjName+'&systemCode='+this.systemCode+'&vertoken='+this.vertoken,
        "parUrl":'&templateVersionId='+this.templateId+'&metObjName='+this.metObjName+'&systemCode='+this.systemCode+'&vertoken='+this.vertoken,
      }

      return defaultUrl
    },
    dataFormView(){
      const urlRes =  this.devUrl();
      let openUrl ='';
      if(!validatenull(this.customViewUrl)){
        let zUrl = urlRes.parUrl+'&vid='+this.vid;
        openUrl = ((this.customViewUrl.includes('?'))? this.customViewUrl+zUrl :this.customViewUrl+'?'+zUrl) ;
      }else{
        openUrl = urlRes.allUrl+'&vid='+this.vid;

      }
      return openUrl
    },
    dataFormEdit(){

      const urlRes =  this.devUrl();
      if(!validatenull(this.customUpdateUrl)){
        let zUrl = urlRes.parUrl+'&vid='+this.vid+'&vidType=edit';
        let openUrl = ((this.customUpdateUrl.includes('?'))? this.customUpdateUrl+zUrl :this.customUpdateUrl+'?'+zUrl) ;

        window.open(openUrl);
      }else{
        let openUrl = urlRes.allUrl+'&vid='+this.vid+'&vidType=edit';
        window.open(openUrl);
      }


    },
    async dataFormPast(){
      if(this.verifyType == 3 && this.showForm) {
        //alert('模拟微信验证')
        const checkRes = await this.getCheckRes();
        if( checkRes.success ){
          this.vertoken = checkRes.data.vertoken;
        }
      }
      const urlRes =  this.devUrl();
      if(!validatenull(this.customViewUrl)){
        let zUrl = urlRes.parUrl;
        let openUrl = ((this.customViewUrl.includes('?'))? this.customViewUrl+zUrl :this.customViewUrl+'?'+zUrl) ;

        window.open(openUrl);
      }else{
        let openUrl = urlRes.allUrl;
        window.open(openUrl);
      }
    },
    resGoBack(){
      this.showForm = true;
      this.scrollToTop();
    }

  },
  async mounted() {
    await this.getActiveForm();

    await this.$nextTick();
    //console.log(this.$refs.dataFormRef.$refs.form)
    this.$refs.dataFormRef.$refs.form.dataFormat();
    await this.$nextTick();
    this.$refs.dataFormRef.$refs.form.clearValidate();

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
body{ background-color: #f5f5f5; margin:0 auto !important;  }
.CMF_MAIN { max-width: 1000px; min-height: 100%; margin: 0 auto ;  background-color: #fff; border-left:1px solid #ebeef5; border-right:1px solid #ebeef5; box-shadow: 0 2px 12px 0 rgba(0,0,0,.1); }
.CMF_HEAD { text-align: center;  background-color: #409EFF;  }
.CMF_HEAD span { font-size: 18px; line-height: 50px; color: #FFF;}
.CMF_BODY { padding: 20px 10px 0; }
.CMF_FOOT {}
.CMF_CUST {}

</style>
<style lang="scss" scoped>

.comFormData {

  /deep/.ADD_sub { display: flex; justify-content: space-around; align-items: center; padding: 20px 0px; border-top: 1px solid #f0f0f0; }
}
.RES_w {
  width:300px;
  margin:30px auto;
  /deep/.RES_qr { display: flex; justify-content: center; flex-direction: column; align-items: center;}
  /deep/.RES_qr .RES_qr_i { font-size:160px; color:#67C23A;}
  /deep/.RES_qr>img { display:block; width: 160px; height:160px; object-fit: contain; background-color: #f5f5f5;}
  /deep/.RES_qr>span:nth-child(2) { margin-top:15px;}
  /deep/.RES_qr>span:nth-child(2) .el-button { margin-right:10px; }
  /deep/.RES_qr>span:nth-child(2) { font-size:20px; color:#303133;}
  /deep/.RES_qr>span:nth-child(3) { font-size:12px; color:#909399; margin-top:15px;}
  /deep/.RES_bt { display: flex; justify-content: center; }
  /deep/.RES_bt>.el-button { width:90%; margin:15px auto 0; }
}
</style>
