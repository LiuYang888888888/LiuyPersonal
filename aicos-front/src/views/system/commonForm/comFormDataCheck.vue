<template>

  <div class="checkFrom">
   
    <avue-form
      class="ADD_w"
      :option="checkOption"
      ref="checkRef"
      v-model="checkData"
      :key="checkKey"
    >
      <template slot-scope="scope" slot="checkPhoneCapt">
        <el-input v-model="checkData.checkPhoneCapt" prefix-icon="el-icon-c-scale-to-original" >
          <template slot="append" >
            <span @click.stop="sendPhoneCapt">{{checkPhoneCaptText}}</span>
          </template>
        </el-input>
      </template>

      <template slot-scope="scope" slot="checkWechat">
        <div class="ADD_item_wxInfo">
          <div>
            <img :src="wxData.headimgurl">
          </div>
          <div>
              <span>{{wxData.nickName}}</span>
          </div>
        </div>
      </template>


      <template slot-scope="scope" slot="checkCaptcha">
        <div  class="ADD_item_captcha">
          <el-input v-model="checkData.checkCaptcha"></el-input>
          <div>
            <img :src="captchaImg" @click.stop="getCaptcha">
            <span  @click.stop="getCaptcha">(换一个)</span>
          </div>
        </div>
      </template>
    </avue-form>
    
  </div>

</template>

<script>
import { getRules } from "@/util/regx";
import FormPreview from '@/components/formPreview'
import {validatenull} from '@/util/validate'
import { 
  //getFromTemplate,
  getFromCaptcha,
  sendPhoneCode,
  verifyPhoneCode,
  sWxVerify
} from "@/api/system/commonFormData";

export default {
  name: '通用表单数据验证',
  components: {
    FormPreview
  },
  props: {
    formSetData: {
      type: Object,
      default() {
        return {}
      }
    }
  },
  data() {
    return {
      templateId:'',
      metObjName:'',
      systemCode:'',
      verifyType:0,

      captchaImg:'',
      captchaKey:'',
      captchaValue:'',
      wxData:{},

      checkKey:0,
      checkData:{},
      checkOption:{
        submitBtn:false,
        emptyBtn:false,
        labelWidth:120,
        labelPosition:'top',
        column: [
          {
            label: '手机号',
            prop: 'checkPhone',
            //type:'number',
            controls:false,
            span:24,
            row:true,
            display:false,
            prefixIcon:'el-icon-mobile-phone',
            rules: [
              {
                required: true,
                message: "请输入手机号",
                trigger: "blur"
              },
              ...getRules(['mobile'])
            ],
          },
          {
            label: '验证码',
            prop: 'checkPhoneCapt',
            span:24,
            row:true,
            display:false,
            prefixIcon:'el-icon-c-scale-to-original',
            rules: [
              {
                required: true,
                message: "请输入验证码",
                trigger: "blur"
              },
              ...getRules(['onlyNumber'])
            ],
          },
          {
            label: '微信',
            prop: 'checkWechat',
            span:24,
            row:true,
            display:false,
            showWordLimit: true,
            maxlength: 100,
            rules: [
              {
                required: true,
                message: "请输入微信",
                trigger: "blur"
              },
              ...getRules(['charNum'])
            ],
          },
          {
            label: '验证码',
            prop: 'checkCaptcha',
            span:24,
            row:true,
            display:false,
            rules: [
              {
                required: true,
                message: "请输入验证码",
                trigger: "blur"
              },
            ],
          },
          {
            label: '邮箱',
            prop: 'checkMail',
            span:24,
            row:true,
            display:false,
            showWordLimit: true,
            maxlength: 100,
            rules: [
              {
                required: true,
                message: "请输入邮箱",
                trigger: "blur"
              },
              ...getRules(['positiveInteger'])
            ],
          },
        ],
      },
      checkPhoneCaptText:'发送验证码',
      canSend:true,
      sendCountDown:60,
      canCheck:false,
      
    }
  },
  methods: {
    getQueryVariable(variable) {
      var query = window.location.search.substring(1);
      var vars = query.split("&");
      for (var i = 0; i < vars.length; i++) {
        var pair = vars[i].split("=");
        if (pair[0] == variable) {
          return pair[1];
        }
      }
      return (false);
    },
    async getActiveForm(){
      //console.log(this.formSetData);

      if( this.formSetData.templateId && this.formSetData.metObjName && this.formSetData.systemCode  ){
        //console.log('Data传参');
        this.templateId = this.formSetData.templateId;
        this.metObjName = this.formSetData.metObjName;
        this.systemCode = this.formSetData.systemCode; 
        this.verifyType = this.formSetData.verifyType;
        this.formOption = this.formSetData.formOption;

        this.checkOption.labelPosition = (this.formOption.labelPosition?this.formOption.labelPosition:'top');
        this.checkOption.labelWidth = (this.formOption.labelWidth?this.formOption.labelWidth:'120');

        //this.verifyType = 1;
        if( this.verifyType == 1 ) {
          this.findObject(this.checkOption.column, "checkPhone").display = true;
          this.findObject(this.checkOption.column, "checkPhoneCapt").display = true;
        }else if( this.verifyType == 2 ){
          this.findObject(this.checkOption.column, "checkMail").display = true;
          this.findObject(this.checkOption.column, "checkCaptcha").display = true;
          this.getCaptcha();
        }else if( this.verifyType == 3 ){
          this.findObject(this.checkOption.column, "checkWechat").display = true;
          //this.findObject(this.checkOption.column, "checkCaptcha").display = true;
          //this.getCaptcha();
          
          if(window.location.href.indexOf("code=") < 0) {
            let redirect_url = "http://aicos.huilan.com"+window.location.pathname+"#"+this.$route.fullPath;
            //console.log(window.location.pathname)
            //console.log(this.$route.fullPath)
            //console.log(redirect_url)

            let turl = 'https://open.weixin.qq.com/connect/oauth2/authorize?appid=wxc3dcba4edd61a536&redirect_uri='+encodeURIComponent(redirect_url)+'&response_type=code&scope=snsapi_userinfo&state=STATE#wechat_redirect'
            window.location.href = turl;

          }else{

            const dataParam = {
              "code": this.getQueryVariable('code'),
            }
            sWxVerify(dataParam).then((res)=>{
              this.wxData = res.data.data;
            }, error => {
              window.console.log(error);
            });
          }
          
        }else{
          this.findObject(this.checkOption.column, "checkCaptcha").display = true;
          this.getCaptcha();
        }

      }else{
        //this.$message.error("表单设置获取异常");
        return false
      }
    },

    getCaptcha(){
      this.captchaValue ='';
      getFromCaptcha().then((res) => {
        const dataRes = res.data.data;
        this.captchaImg = dataRes.image;
        this.captchaKey = dataRes.key;

      }, error => {
        window.console.log(error);
      });
    },

    async sendPhoneCapt(){
      
      this.$refs.checkRef.$refs.form.validateField('checkPhone',(errorMsg)=>{
        if(errorMsg){
          window.console.log(errorMsg);
          this.canSend = false;
          return false;
        }else{
          this.canSend = true;
        }
      });
      
      if(this.canSend){
        this.checkPhoneCaptText = "发送验证码...";
        const dataParam = {
          "phoneNumber": this.checkData.checkPhone,
        }
        await sendPhoneCode(dataParam).then((res)=>{
          const  dataRes = res.data;
          if(dataRes.code == 200 ){
            this.checkData.checkPhone = dataRes.data.phoneNumber;
            this.sendCountDown = 60;
            this.checkPhoneCaptText = this.sendCountDown+"s后重发";
            const auth_time = setInterval(() => {
              this.sendCountDown--;
              if (this.sendCountDown > 0) {
                this.checkPhoneCaptText = this.sendCountDown+"s后重发";
                this.canSend = false;
              }
              if (this.sendCountDown <= 0) {
                this.checkPhoneCaptText = "发送验证码";
                this.canSend = true;
                clearInterval(auth_time);
              }
            }, 1000);
          }
        }, error => {
          window.console.log(error);
        });
      }
    },
    async checkRes(){

      const checkParam = {};
      let successTag = false ;
      if( this.verifyType == 1 ) {

        this.$refs.checkRef.$refs.form.validateField('checkPhone',(errorMsg)=>{
          if(errorMsg){
            //console.log(errorMsg);
            this.canCheck = false;
            return false;
          }else{
            this.canCheck = true;
          }
        });
        this.$refs.checkRef.$refs.form.validateField('checkPhoneCapt',(errorMsg)=>{
          if(errorMsg){
            //console.log(errorMsg);
            this.canCheck = false;
            return false;
          }else{
            this.canCheck = true;
          }
        });


        if(this.canCheck){
          await verifyPhoneCode({
            "phoneNumber":this.checkData.checkPhone,
            "vercode": this.checkData.checkPhoneCapt
          }).then(res=>{
            const phoneRes = res.data.data.token;
            checkParam.vertoken = phoneRes;
            successTag = true;
            //console.log(phoneRes);
          },error => {
            window.console.log(error);
            //this.$message.error("短信验证异常");
          })
          
        }else{
          successTag = false;
          return false
        }
        
        
      }else if( this.verifyType == 2 ){
        checkParam.checkMail =  this.checkData.checkMail;
        checkParam.captchaKey = this.captchaKey;
        checkParam.captchaValue = this.checkData.checkCaptcha;
        successTag = true;
      }else if( this.verifyType == 3 ){
        //checkParam.checkWechat = this.checkData.checkWechat;
        //checkParam.captchaKey = this.captchaKey;
        //checkParam.captchaValue = this.checkData.checkCaptcha;

        if(!validatenull(this.wxData.token)){
          checkParam.vertoken = this.wxData.token;
          successTag = true;
          //alert("cktoken==="+this.wxData.token)
        }else{
          successTag = false;
          return false
        }

      }else{
        checkParam.captchaKey = this.captchaKey;
        checkParam.captchaValue = this.checkData.checkCaptcha;
        successTag = true;
      }

      const res = {
        success:successTag,
        data:{
          ...checkParam
        },

      }

      return res
    },
    restCheckForm(){
      this.$refs.checkRef.resetForm();
      if( this.verifyType != 1){
        this.getCaptcha();
      }
    }


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
    'formSetData':{
      handler(/*newVal*/){
        //console.log(newVal)
        this.getActiveForm();
      },
      deep: true 
    }

  },
}
</script>

<style lang="scss" scoped>
.checkFrom {
  /deep/.ADD_w { padding-top: 20px; /*padding-left:10px;*/  border-top: 1px solid #f0f0f0;}
  /deep/.ADD_w .el-input { max-width:300px;}
  /deep/.ADD_item_captcha { display: flex; justify-content: flex-start; flex-wrap: wrap; align-items: center; }
  /deep/.ADD_item_captcha>div>img { float:left; height:30px; margin-right:10px;}
  /deep/.ADD_item_captcha>div>span { float:left;display:block; width:100px; font-size:12px; cursor:pointer; }
  /deep/.ADD_item_captcha>.el-input { float:left;width:160px; margin-right:10px;}

  /deep/.ADD_item_wxInfo { display:flex; justify-content: flex-start; align-items: center; }
  /deep/.ADD_item_wxInfo>div:first-child { width:60px; height:60px; overflow:hidden; border-radius:10px; background-color:#ccc; flex-shrink: 0;}
  /deep/.ADD_item_wxInfo>div img { width:60px; height:60px;}
  /deep/.ADD_item_wxInfo>div span { display: block; font-size:16px; color:#000; margin-left:15px;}


  /deep/.ADD_sub {   text-align: center; padding: 20px 0px; border-top: 1px solid #f0f0f0;}
  /deep/.ADD_sub { }

  /deep/.el-form .no-print { display:none;}
}
</style>
