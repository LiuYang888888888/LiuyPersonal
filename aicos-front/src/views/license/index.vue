<template>
  <div class="LsDialog">
    <HuilanDialog
      v-bind="$attrs"
      v-on="$listeners"
      :title="title"
      :fullscreen="false"
      width="660px"
      append-to-body
      :visible.sync="isShow"
      :destroy-on-close="true"
      @close="lsClose"
      >
      <avue-form
        ref="lsFormRef"
        v-model= "lsFormData"
        :option="lsFormOption"
        v-loading="loading"
      >
        <template slot-scope="scope" slot="LatestExpiredate">
          <div>{{LatestExpiredate}}</div>
        </template>
        <template slot-scope="scope" slot="LatestLicenseMsg">
          <div class="LatestLicenseMsgHtml"  v-html="LatestLicenseMsgHtml"></div>
        </template>
      </avue-form>
      <template v-slot:footer>
        <el-button

          size="small"
          @click.stop="lsClose"
        >取 消</el-button>

        <el-button

          size="small"
          type="primary"
          @click.stop="lsSave"
          v-if="btnShow"
          :loading="loading"
        >保 存</el-button>

      </template>
    </HuilanDialog>
  </div>
</template>
<script>
import { mapGetters, mapState } from "vuex";
//import { getRules } from "@/util/regx";
import { isNull } from '@/util/qsgCommon.js';
import { calcDate } from '@/util/date.js';

import {
  getLatestLicenseFromRemote,
  updateLicenseToRemote,
  getLatestLicenseFromRemoteFromMenu,
  updateLicenseToRemoteFromMenu,
  getLatestLicenseFromAiCOS,
  updateLicenseToAiCOS,
  updateLicenseToAiCOSForLogin
} from "@/api/license/license";

export default {
  name: 'LicenseModel',
  components: {
  },
  computed: {
    ...mapGetters([
      "userInfo",
    ]),
    ...mapState({
      checkAicosLicense: state => state.common.checkAicosLicense
    })
  },

  props: {
    title: {
      type: String,
      default: '更新授权码'
    },
    isShow: {
      type: Boolean,
      default: false
    },
    paramData: {
      type: Object,
      default() {
        return {
          handleType: '',
          isApp: true,
          needLast: false,
          params:{},
        }
      }
    },
    successFun: {
      type: Function,
      default: null
    },
    cancelFun: {
      type: Function,
      default: null
    },

  },
  data() {
    return {
      loading: false,
      btnShow: true,
      hasSaveSuccess: false,

      LatestExpiredate: '0000-00-00',
      LatestAsrExpiredate: '0000-00-00',
      LatestTtsExpiredate: '0000-00-00',

      LatestLicenseMsgHtml: '',

      lsFormData:{},
      lsFormOption:{
        submitBtn:false,
        emptyBtn:false,
        span: 24,
        labelWidth: 120,
        column: [
          {
            label: '服务授权码',
            prop: 'licenseContent',
            type: 'textarea',
            display: true,
            minRows: 5,
            maxlength: 9999,
            showWordLimit: true,
            rules: [
              {
                required: true,
                message: "请输入服务授权码",
                trigger: "blur"
              }
            ],
            value:'',
          },
          {
            label: '已授权到期时间',
            prop: 'LatestExpiredate',
            formslot:true,
            display: false,
            disabled: true,
          },
          {
            label: '已授权信息',
            prop: 'LatestLicenseMsg',

            formslot:true,
            display: false,
            disabled: true,
          },


        ],
      },

    }
  },
  methods: {
    async initForm(newVal){
      this.loading = true;
      this.hasSaveSuccess = false;
      this.lsFormData.licenseContent = '';
      this.LatestExpiredate = '';
      this.LatestLicenseMsgHtml = '';

      if( this.userInfo.isAdmin === '1' || newVal.handleType == "AiCOSLicenseFromLogin"){
        this.btnShow = true ;
        this.findObject(this.lsFormOption.column, "licenseContent").display = true;
      }else{
        this.btnShow = false ;
        this.findObject(this.lsFormOption.column, "licenseContent").display = false;
      }


      this.findObject(this.lsFormOption.column, "LatestExpiredate").display = newVal.needLast;
      this.findObject(this.lsFormOption.column, "LatestLicenseMsg").display = newVal.needLast;

      if(newVal.needLast){
        this.getLatest();
      }else{
        this.loading = false;
      }
    },
    arrToHtml(arr){
      let res = '';
      if(arr.length > 0 ){
        arr.map((item)=>{
          if( !isNull(item)){
            res +='<span class="el-tag el-tag--small el-tag--info el-tag--plain ">'+item+'</span>';
          }
        })
      }else{
        res = '无限制';
      }
      return res
    },
    arrJsonToHtml(arrJson){
      let res = '';
      if(arrJson.length > 0 ){
        arrJson.map((item)=>{
          if( !isNull(item)){
            res +='<span class="el-tag el-tag--small el-tag--info el-tag--plain ">'+JSON.parse(item).label+'</span>';
          }
        })
      }else{
        res = '无限制';
      }
      return res
    },
    mapJsonToHtml(mapJson){

      let res = '';
      if( !isNull(mapJson) ){
        for (let key in mapJson ){
          res +='<span class="el-tag el-tag--small el-tag--info el-tag--plain ">'+mapJson[key]+'</span>';
        }
      }else{
        res = '无';
      }
      return res
    },

    calcDate(date){
      let res = '';
      let calcday = {};
      if(date !="0000-00-00"){
        let theDate = date+" 23:59:59";
        let date1 = new Date(theDate).getTime();
        let date2 = new Date().getTime();

        calcday = calcDate(date2,date1);
        res = '<span style="'+( ( calcday.days < 31 )?' color:red ':'' )+' ">'+calcday.days+'天</span>'
      }else{
        res = '无限制';
      }

      return {
        res: res,
        days: calcday.days || 0
      }
    },
    versionCode(code){
      let res = '';
      switch(code){
        case '01':
          res = '试用版';
          break;
        case '02':
          res = '标准版';
          break;
        case '03':
          res = '政府版';
          break;
        case '04':
          res = '企业版';
          break;
        default:
          res = code;
      }
      return res
    },

    async getLatest(){

      if( !this.paramData.isApp ) {
        //不是app 即按照AiCOS

        getLatestLicenseFromAiCOS({}).then((res)=>{
          const dataRes = JSON.parse( res.data.data.licenseContent) ;

          //console.log(dataRes);
          this.findObject(this.lsFormOption.column, "LatestExpiredate").display = true;
          this.findObject(this.lsFormOption.column, "LatestLicenseMsg").display = true;

          this.LatestExpiredate = ( dataRes.expiredDate == '0000-00-00'? '无限制': dataRes.expiredDate );
          this.LatestAsrExpiredate = ( dataRes.asrExpiredDate == '0000-00-00'? '无限制': dataRes.asrExpiredDate );
          this.LatestTtsExpiredate = ( dataRes.ttsExpiredDate == '0000-00-00'? '无限制': dataRes.ttsExpiredDate );
          let calcDateRes = this.calcDate( dataRes.expiredDate );
          let msgHtml = '<ul class="LatestLicenseMsg">';
          msgHtml += '<li><div>授权有效期至：</div><div>'+ this.LatestExpiredate+'</div></li>';
          msgHtml += '<li><div>到期时间剩余：</div><div>'+ calcDateRes.res +'</div></li>';
          msgHtml += '<li><div>产品版本：</div><div>'+ this.versionCode( dataRes.versionCode ) +'</div></div>';
          msgHtml += '<li><div>最大用户数：</div><div>'+ ( dataRes.userMaxNumber == 0 ? '无限制': dataRes.userMaxNumber)+'</div></li>';
          msgHtml += '<li><div>允许的ip/域名：</div><div>'+ this.arrToHtml( dataRes.allowIpAddress )+'</div></li>';
          msgHtml += '<li><div>ASR有效期至：</div><div>'+ this.LatestAsrExpiredate+'</div></li>';
          msgHtml += '<li><div>TTS有效期至：</div><div>'+ this.LatestTtsExpiredate+'</div></li>';
          //msgHtml += '<li><div>允许的mac：</div><div>'+ this.arrToHtml(dataRes.allowMacAddress )+'</div></li>';
          //msgHtml += '<li><div>主板序列号：</div><div>'+ this.arrToHtml(dataRes.mainBoardSerial )+'</div></li>';
          //msgHtml += '<li><div>cpu序列号：</div><div>'+ this.arrToHtml(dataRes.cpuSerial )+'</div></li>';
          msgHtml += '<li><div>授权模块：</div><div>'+ this.mapJsonToHtml( dataRes.blackModule )+'</div></li>';
          msgHtml+= '</ul>';
          this.LatestLicenseMsgHtml = msgHtml;
          this.loading = false;
          if(this.hasSaveSuccess){

            if(calcDateRes.days < 0 ){
              //退出登录状态
              this.$store.dispatch("LogOut").then(() => {
                this.$router.push({path: "/login"});
                window.location.reload();
              });
            }

            this.lsSaveSuccess();
          }

        }, error => {
          window.console.log(error);
          //this.$message.error('获取已授权信息失败');
          this.loading = false;
        })

      }else if( this.paramData.handleType == 'appLicenseFromMenu' ){
        //是app  在菜单上点击的
        const dataParam = {
          id: this.paramData.params.id,
        };
        await getLatestLicenseFromRemoteFromMenu(dataParam).then((res)=>{
          const dataRes = res.data.data;

          this.findObject(this.lsFormOption.column, "LatestExpiredate").display = true;
          this.findObject(this.lsFormOption.column, "LatestLicenseMsg").display = true;

          let msgHtml = '<ul class="LatestLicenseMsg">';
          for (let key in dataRes.msg ){
            msgHtml += '<li><div>'+ key +'</div><div>'+dataRes.msg[key]+'</div></li>';
          }
          msgHtml+= '</ul>';
          this.LatestExpiredate = ( dataRes.expiredate == '0000-00-00'? '无限制': dataRes.expiredate );
          this.LatestLicenseMsgHtml = msgHtml;
          this.loading = false;
          if(this.hasSaveSuccess){
            this.lsSaveSuccess();
          }
        }, error => {
          window.console.log(error);
          //this.$message.error('获取已授权信息失败');
          this.loading = false;
        })


      }else{
        //是app 在应用商城点击的
        const dataParam = {
          id: this.paramData.params.id,
          systemCode: this.paramData.params.systemCode,
        };
        /*const dataParam = {
          id: '1',
          systemCode: 'aisite',
        };*/

        await getLatestLicenseFromRemote(dataParam).then((res)=>{
          const dataRes = res.data.data;

          this.findObject(this.lsFormOption.column, "LatestExpiredate").display = true;
          this.findObject(this.lsFormOption.column, "LatestLicenseMsg").display = true;

          let msgHtml = '<ul class="LatestLicenseMsg">';
          for (let key in dataRes.msg ){
            msgHtml += '<li><div>'+ key +'</div><div>'+dataRes.msg[key]+'</div></li>';
          }
          msgHtml+= '</ul>';
          this.LatestExpiredate = ( dataRes.expiredate == '0000-00-00'? '无限制': dataRes.expiredate );
          this.LatestLicenseMsgHtml = msgHtml;
          this.loading = false;
          if(this.hasSaveSuccess){
            this.lsSaveSuccess();
          }
        }, error => {
          window.console.log(error);
          //this.$message.error('获取已授权信息失败');
          this.loading = false;
        })
      }

    },
    lsSaveSuccess(){
      this.btnShow = false ;
      if(this.paramData.handleType == 'AiCOSLicenseFromLogin'){
        this.$message.success('授权成功！请重新登录。');
      }else{
        this.$message.success('授权成功！');
      }
      //this.$message.success('授权成功!');
      this.lsFormData.licenseContent = '';
      this.findObject(this.lsFormOption.column, "licenseContent").display = false;
      this.$emit("successFun",this.paramData);
    },
    async lsSave(){

      this.$refs.lsFormRef.validate(async (valid, done/*, msg*/) => {
        if (valid) {
          this.loading = true;
          if( !this.paramData.isApp ) {
            //不是app 即按照AiCOS


            const dataParam = {
              licenseContent: this.lsFormData.licenseContent,
            };
            if(this.paramData.handleType == 'AiCOSLicenseFromLogin'){
              updateLicenseToAiCOSForLogin(dataParam).then((/*res*/)=>{
                //const dataRes = res.data.data;
                this.hasSaveSuccess = true;
                this.getLatest();
                done();
              }, error => {
                window.console.log(error);
                //this.$message.error('授权更新失败!');
                this.loading = false;
                done();
              })
            }else{
              await updateLicenseToAiCOS(dataParam).then((/*res*/)=>{
                //const dataRes = res.data.data;
                this.hasSaveSuccess = true;
                this.getLatest();
                done();
              }, error => {
                window.console.log(error);
                //this.$message.error('授权更新失败!');
                this.loading = false;
                done();
              })
            }




          }else if( this.paramData.handleType == 'appLicenseFromMenu' ){
            //是app  在菜单上点击的
            const dataParam = {
              id: this.paramData.params.id,
              licenseContent: this.lsFormData.licenseContent,
            };

            await updateLicenseToRemoteFromMenu(dataParam).then((/*res*/)=>{
              //const dataRes = res.data.data;
              this.hasSaveSuccess = true;
              this.getLatest();

              done();
            }, error => {
              window.console.log(error);
              //this.$message.error('授权更新失败!');
              this.loading = false;
              done();
            })

          }else{
            //是app  在应用商城点击的
            const dataParam = {
              id: this.paramData.params.id,
              licenseContent: this.lsFormData.licenseContent,
            };

            await updateLicenseToRemote(this.paramData.params.systemCode,dataParam).then((/*res*/)=>{
              //const dataRes = res.data.data;
              this.hasSaveSuccess = true;
              this.getLatest();
              /*setTimeout(()=>{
                this.lsClose();
              },5000);*/
              done();
            }, error => {
              window.console.log(error);
              //this.$message.error('授权更新失败!');
              this.loading = false;
              done();
            })
          }



        } else {
          return false;
        }
      })


    },
    lsClose(){
      this.isShow = false;
      this.$emit('update:isShow',false);
      this.$emit('cancelFun');
    }
  },
  mounted(){

  },
  created(){

  },
  watch: {
    "paramData":{
      handler(newVal) {
        this.initForm(newVal);
      },
      deep: true
    },
    checkAicosLicense: {
      handler(newVal) {
        if(newVal) {
          this.isShow = newVal;
        }else {
          if(this.isShow) {
            this.isShow = false;
          }
        }
      },
      immediate:true
    }
  },
}
</script>
<style lang="scss" scoped>
.LsDialog {
}

.LatestLicenseMsgHtml {
  width: auto;
  /deep/.LatestLicenseMsg {

    padding: 0;
    margin: 0;
    list-style: none;

    li {
      display: flex;
      justify-content: flex-start;
      align-items: flex-start;

      padding: 0;
      margin: 0;
      list-style: none;

      div:first-child {
        //color: #909399;
        width: 140px;
        flex-shrink: 0;
        text-align: right;
        padding-right: 12px;
      }
      div:nth-child(2){
        span {
          margin-right: 8px;
        }
      }
    }

  }

}
</style>
