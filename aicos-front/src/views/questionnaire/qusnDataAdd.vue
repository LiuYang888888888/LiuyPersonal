<template>
  <div class="QusnViewMain">
    <div class="qusnDataAdd qsgMain QusnViewBody">
      <div class="QusnView">
        <QusnView
          ref="qusnFormRef"
          :data="qusnFormData"
          :option="qusnFormOption"
          :qusnConfig="qusnConfig"
          :key="qusnFormKey"
          :showTime="true"
          >
        </QusnView>
      </div>
      <div class="cusSet">
        <div v-if="captchaTag">
          <el-form 
            :model="captchaForm"
            class="captchaForm"
            ref="captchaRef"
            >
            <el-form-item
              class="captchaItem"
              prop="captchaValue"
              label="验证码"
              label-width="120px"
              :rules="[{ required: true, message: '请输入验证码', trigger: 'blur' },]"
              >
              <div  class="captchaContent">
                <el-input v-model="captchaForm.captchaValue" class="captchaInput" size="small"></el-input>
                <div class="captchaRight">
                  <img :src="captchaImg" @click.stop="getCaptcha" class="captchaImg">
                  <el-link type="primary" @click.stop="getCaptcha"  :underline="false" class="captchaChange">(换一个)</el-link>
                </div>
              </div>
            </el-form-item>
          </el-form>
        </div>
      </div>
      <div class="QusnViewBtn">
        <el-button
          :loading="loadingBtn" 
          icon="el-icon-check" 
          size="small" 
          type="primary" 
          @click.stop="qusnSave"
          >提交</el-button>

        <el-button
          :loading="loadingBtn" 
          icon="el-icon-close" 
          size="small" 
          @click.stop="qusnReset"
          >重置</el-button>
      </div>

    </div>
  </div>
</template>
<script>
import '@/styles/qsgCommon.scss';

import QusnView from '@/components/QusnView/index';
import { isNull } from '@/util/qsgCommon.js';

import { 
  detailQusn,
  saveQusnData,
  browserCountPlusOne,
  getQusnCaptcha,
} from "@/api/questionnaire/index";


export default {
  inject: ["desktopWindow", "desktop"],

  name: 'qusnDataAdd',
  components: {
    QusnView
  },
  props: {
    propParams: {
      type: Object,
      default() {
        return {}
      }
    }
  },

  data() {
    return {
      qusnFormKey: 1,
      qusnId: '',

      loadingBtn: false,

      qusnFormOption: {
        column: [],
        submitBtn: false,
        emptyBtn: false,
      },
      qusnFormData: {},
      qusnConfig:{},

      captchaTag: false,
      captchaImg: '',
      captchaKey: '',
      
      captchaForm: {
        captchaValue: '',
      }
    }
  },
  methods: {
    async getActiveQusn(){

      this.loadingBtn = true;

      if( this.propParams.qusnId ){
        this.qusnId = this.propParams.qusnId;
      }else if (this.desktop) {
        this.qusnId = this.desktopWindow.data.query.qusnId;
      }else{
        this.qusnId = this.$route.query.qusnId;
      }

      if( isNull(this.qusnId) ){
        this.$message.error("调查问卷参数设置错误。");
        return false
      }
      await detailQusn({id:this.qusnId}).then((res)=>{
        const dataRes = res.data.data;
        this.qusnConfig = dataRes ;
        this.loadingBtn = false;

        //是否开启验证码
        this.captchaTag = (dataRes.isCaptcha == 1? true : false);

        this.getCaptcha();
        
        if( isNull( dataRes.editorFrontJson) ){
          this.$message.error("调查问卷问题设置错误。");
          this.loadingBtn = true;
        }else{
          this.qusnFormOption = JSON.parse(dataRes.editorFrontJson);
        }

        if(dataRes.publishStatus !=1 ){
          this.$message.error("该调查问卷未发布，不能填写。");
          this.loadingBtn = true;
        }

        this.qusnFormKey++;
        

      }).then(()=>{
        browserCountPlusOne({questionnaireId:this.qusnId}).then(()=>{},error=>{
          window.console.log(error);
        })
      })

    },

    async qusnSave(){
      this.loadingBtn = true;
      
      let valiRes = true;
      
      if(this.captchaTag){
        this.$refs.captchaRef.validate((boolean)=>{
          valiRes = valiRes && boolean ;
        })
        //console.log(valiRes)
      }
      let inputValiRes = this.$refs.qusnFormRef.canInputValiRes();
      valiRes = valiRes && inputValiRes ;

      let hasInputValiRes = this.$refs.qusnFormRef.hasInputValiRes();
      valiRes = valiRes && hasInputValiRes ;

      
      this.$refs.qusnFormRef.$refs.formRef.validate((boolean)=>{
        valiRes = valiRes && boolean ;
      })
      //console.log(valiRes)

      if(!valiRes){
        this.$message.error("问卷填写验证未通过，请检查！");
        this.loadingBtn = false;
        this.getCaptcha();
        return false
      }

      const formData = this.$refs.qusnFormRef.getData();
      const dataParam = {
        ...formData.saveJson,
        validateKey: this.captchaKey,
        validateValue: this.captchaForm.captchaValue,
      };
      saveQusnData(dataParam).then((res)=>{
        const dataRes = res.data.success;
        if( dataRes ) {

          if(this.qusnConfig.isDirectAfterFinish == 0){

            //this.$message.success( this.qusnConfig.thankWord );
            this.$alert(this.qusnConfig.thankWord, '', {
              confirmButtonText: '确定',
              type: 'success',
              callback: (/*action*/) => {
                /*this.$message({
                  type: 'info',
                  message: `action: ${ action }`
                });*/
                this.loadingBtn = false;
                this.getCaptcha();
                this.qusnReset();
              }
            });


          }else{
            window.location.href = this.qusnConfig.directUrlAfterFinish;

            this.loadingBtn = false;
            this.getCaptcha();
            this.qusnReset();
          }  
        }
        
      }, error => {
        window.console.log(error);
        this.$refs.qusnFormRef.onRefill();
        this.loadingBtn = false;
        this.getCaptcha();
      })

      
    },
    qusnReset(){
      this.$refs.qusnFormRef.onReset();
    },

    getCaptcha(){

      this.captchaValue ='';

      if(this.captchaTag){
        getQusnCaptcha().then((res) => {
          const dataRes = res.data.data;
          this.captchaImg = dataRes.image;
          this.captchaKey = dataRes.key;

        }, error => {
          window.console.log(error);
        });
      }
      
      
    },


  },
  mounted() {
    
  },
  created(){
    this.getActiveQusn();
  },
  watch:{
    '$route': 'getActiveQusn',
    'desktopWindow.data': {
      handler() {
        this.getActiveQusn()
      },
      deep: true
    },
    'propParams':{
      handler(){
        this.getActiveQusn();
      },
      deep: true 
    }
    
  },
}
</script>

<style lang="scss" scoped>
.QusnViewMain {
  width: 100%;
  height: 100%;
  background-color: #f5f5f5;
  overflow-y: auto;
}
.QusnViewBody {
  max-width: 1000px;
  min-height: 100%;
  margin: 0 auto;
  background-color: #fff;
  border-left: 1px solid #ebeef5;
  border-right: 1px solid #ebeef5;
  box-shadow: 0 2px 12px 0 rgba(0,0,0,.1);
}
.QusnViewBtn {
  text-align: center;
}
.cusSet {

  .captchaForm {
    border-top: 2px solid #e4e7ed;
    padding-top: 15px; 
    .captchaItem {
      .captchaContent {
        display: flex;

        .captchaInput {
          width: 180px;
          max-width: 300px;
        }
        .captchaRight {
          display: flex;
          .captchaImg {
            height: 40px;
            margin-left: 10px;
            margin-right: 10px;
          }
          .captchaChange {

          }
        }
      }
    }
  }
}
</style>
