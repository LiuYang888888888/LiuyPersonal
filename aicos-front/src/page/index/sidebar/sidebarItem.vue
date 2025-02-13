<template>
  <div class="menu-wrapper">
    <template v-for="item in menu">
      <el-menu-item
        v-if="( (validatenull(item[childrenKey]) && vaildRoles(item) ) || isURL(item.linkUrl) ) "
        :index="item[pathKey]"
        @click="checkLicenseOpen(item)"
        :key="item[labelKey]"
        :class="{'is-active':vaildActive(item)}"
        @mouseover.native="handleMouseover"
      >
        <i v-if="first" class="item-icon" :class="item[iconKey]"></i>
        <span slot="title" alt="item[pathKey]">{{generateTitle(item)}}</span>
      </el-menu-item>
      <el-submenu v-else-if="!validatenull(item[childrenKey])&&vaildRoles(item)"
                  :index="item[pathKey]"
                  :key="item[labelKey]">
        <template slot="title">
          <i v-if="first" class="item-icon" :class="item[iconKey]"></i>
          <span slot="title"
                :class="{'el-menu--display':collapse && first}">{{generateTitle(item)}}</span>
        </template>
        <template v-for="(child,cindex) in item[childrenKey]">
          <el-menu-item :index="child[pathKey],cindex"
                        @click="checkLicenseOpen(child)"
                        :class="{'is-active':vaildActive(child)}"
                        v-if="validatenull(child[childrenKey])"
                        :key="child[labelKey]">
<!--            <i :class="child[iconKey]" v-if="item.moduleLevel<=1"></i>-->
            <span slot="title">{{generateTitle(child)}}</span>
          </el-menu-item>
          <sidebar-item v-else
                        :menu="[child]"
                        :key="cindex"
                        :props="props"
                        :screen="screen"
                        :collapse="collapse"></sidebar-item>
        </template>
      </el-submenu>
    </template>

    <LicenseModel
      :title="LicenseTitle"
      :isShow.sync="isShow"
      :paramData="lsData"
      @successFun="lsSuccessFun"
    ></LicenseModel>
  </div>
</template>
<script>
import {mapGetters} from "vuex";
import {isURL, validatenull} from "@/util/validate";
import config from "./config.js";
import { addTicket } from '@/api/user'

import LicenseModel from '@/views/license/index';
import { checkLicenseApp } from "@/api/license/license";
import { calcDate } from '@/util/date.js';
import { getStore } from '@/util/store'


export default {
  name: "sidebarItem",
  components: {
    LicenseModel,
  },
  data() {
    return {
      config: config,

      isShow: false,
      lsData:{
        handleType: '',
        isApp: false,
        needLast: false,
        params:{},
      },

      LicenseTitle:'更新授权',

    };
  },
  props: {
    menu: {
      type: Array
    },
    screen: {
      type: Number
    },
    first: {
      type: Boolean,
      default: false
    },
    props: {
      type: Object,
      default: () => {
        return {};
      }
    },
    collapse: {
      type: Boolean
    }
  },
  created() {
  },
  mounted() {
  },
  computed: {
    ...mapGetters(["roles","userInfo",]),

    labelKey() {
      return this.props.label || this.config.propsDefault.label;
    },
    pathKey() {
      return this.props.path || this.config.propsDefault.path;
    },
    iconKey() {
      return this.props.icon || this.config.propsDefault.icon;
    },
    childrenKey() {
      return this.props.children || this.config.propsDefault.children;
    },
    isOpenKey() {
      return this.props.isOpen || this.config.propsDefault.isOpen;
    },
    nowTagValue() {
      return this.$router.$avueRouter.getValue(this.$route);
    }
  },
  methods: {
    generateTitle(item) {
      return this.$router.$avueRouter.generateTitle(
        item[this.labelKey],
        (item.meta || {}).i18n || item.code
      );
    },
    vaildActive(item) {
      if (this.validIsOpen(item)) {
        return false;
      }
      const groupFlag = (item["group"] || []).some(ele =>
        this.$route.path.includes(ele)
      );
      return this.nowTagValue === item[this.pathKey] || groupFlag;
    },
    vaildRoles(item) {
      item.meta = item.meta || {};
      return item.meta.roles ? item.meta.roles.includes(this.roles) : true;
    },
    validatenull(val) {
      return validatenull(val);
    },
    isURL(val) {
      return isURL(val);
    },
    validIsOpen(item) {
      if (item[this.isOpenKey] === 'out' && isURL(item[this.pathKey])) {
        return true;
      }
    },

    calcDate(date){
      let res = '';
      if(date !="0000-00-00"){
        let theDate = date+" 23:59:59";
        let date1 = new Date(theDate).getTime();
        let date2 = new Date().getTime();

        const calcday = calcDate(date2,date1);
        res = calcday.days;
      }else{
        res = 99999;
      }

      return res
    },
    appLicense(data,isAiCOS){
      //更新app授权
      this.LicenseTitle = (isAiCOS?'AiCOS系统授权':'应用系统授权' );
      this.lsData.handleType = (isAiCOS?'AiCOSLicenseFromMenu':'appLicenseFromMenu' );
      this.lsData.isApp = !isAiCOS;
      this.lsData.needLast = true;
      this.lsData.params = {
        ...data
      }
      this.isShow = true ;
    },
    lsSuccessFun(data){
      if(data.handleType == 'appLicenseFromMenu'){
        //console.log('授权更新成功，继续去打开应用');
        setTimeout(()=>{
          this.open(data.params);
        },1000)
      }else if(data.handleType == 'AiCOSLicenseFromMenu'){
        //console.log('AiCOS系统授权更新成功，继续去打开模块');
        setTimeout(()=>{
          this.open(data.params);
        },1000)
      }

    },
    async checkLicenseOpen(item){
      //console.log(item);
      let OsFrontParam = getStore({name: 'frontParam'}) || '';

      if(OsFrontParam){
        if (OsFrontParam.AiCOSLicenseEnable =='true' && isURL(item.linkUrl) ){
          //console.log(item);
          await checkLicenseApp({id:item.id,code:item.code}).then((res)=>{

            let dataRes = res.data;
            let canOpen = 'no';
            //no 完全阻止 给管理员弹提示
            //yes 放行
            //tip 所有人弹提示，选择继续/更新授权

            let openTips = '授权验证未通过！';
            let isLicenseAdmin = false;
            let isAiCOS = false;
            // 返回格式
            // true 验证通过
            // noneed 应用商城中无需验证的app
            // expired:AiCOS  AiCOS过期
            // black:模块名 AiCOS限制模块
            // licenseAdmin:系统编码:xxxx-xx-xx
            // licenseCommon:系统编码:xxxx-xx-xx

            if(dataRes.success){

              if(dataRes.data == 'noneed' || dataRes.data == 'true'){
                canOpen = 'yes';
                openTips = '验证通过！';
              }else if( dataRes.data.split(":")[0] == 'expired'){
                canOpen = 'no';
                openTips = '授权过期！';
                isAiCOS = true;
              }else if( dataRes.data.split(":")[0] == 'black'){
                canOpen = 'no';
                openTips = '授权模块受限！';
                isAiCOS = true;
              }else{

                if( dataRes.data.split(":")[1] == 'AiCOS'){
                  isAiCOS = true;
                }else{
                  isAiCOS = false;
                }

                if( dataRes.data.split(":")[0] == 'licenseAdmin'){
                  isLicenseAdmin = true;
                }else if( dataRes.data.split(":")[0] == 'licenseCommon'){
                  isLicenseAdmin = false;
                }

                //app和aicos 验证日期
                let tipDate =  this.calcDate(dataRes.data.split(":")[2]);
                //tipDate = -1;
                //console.log(tipDate);
                if( tipDate > 30){
                  canOpen = 'yes';
                  openTips = 'app和aicos 授权大于30天 , 正常打开';
                }else if( tipDate <= 30 && tipDate >= 0 ){
                  canOpen = 'tips';
                  openTips = '该服务<span style=" color:#F56C6C; font-weight:500; padding:0 8px;">'+tipDate+'天</span>后到期，为了不影响正常使用，请联系管理员及时更新授权！';
                }else if( tipDate < 0){
                  canOpen = 'no';
                  openTips = '您的license授权已过期，请联系系统管理员进行重新授权！';
                }
              }

            }else{
              canOpen = 'no';
              openTips = '验证授权未通过!';
            }

            if(canOpen == 'yes'){
              //console.log(openTips);
              this.open(item);

            }else if(canOpen == 'tips'){

              this.$confirm(openTips, '系统授权', {
                dangerouslyUseHTMLString: true,
                showConfirmButton: isLicenseAdmin,
                showCancelButton: true,
                confirmButtonText: '立即更新',
                cancelButtonText: '继续使用',
                confirmButtonClass: '',
                cancelButtonClass: ((isLicenseAdmin)?'':'noAdminCancelButton'),
                closeOnClickModal: false,
                distinguishCancelAndClose: true,
                type: 'warning'
              }).then(() => {

                //console.log('去更新授权');
                this.appLicense(item,isAiCOS);

              }).catch((action) => {
                //console.log(action)
                if( action === 'cancel' ){
                  this.open(item);
                }else{
                  return false
                }
              });

            }else if(canOpen == 'no'){

              this.$confirm(openTips, '系统授权', {
                dangerouslyUseHTMLString: true,
                showConfirmButton: true,
                showCancelButton: false,
                confirmButtonText: ((isLicenseAdmin)?'立即更新':'确定'),
                closeOnClickModal: false,
                distinguishCancelAndClose: true,
                type: 'error'
              }).then(() => {
                if(isLicenseAdmin){

                  //console.log('是管理员去更新授权');
                  this.appLicense(item,isAiCOS);

                }else{
                  //console.log('不是管理员，不能去更新授权');
                  return false
                }

              }).catch(() => {
                return false
              });
            }else{
              //console.log('验证返回的格式判断有问题');
              this.$message.error('验证授权未通过！');
              return false
            }





          }, error => {
            window.console.log(error);
            //this.$message.error('获取已授权信息失败');
            return false
          })

        }else{
          this.open(item);
        }
      }else{
        this.open(item);
      }


    },

    open(item) {
      if (this.screen <= 1) this.$store.commit("SET_COLLAPSE");
      const url = item[this.pathKey];
      if (this.validIsOpen(item)) {
        // window.open(item[this.pathKey]);
        if(item.isSso === 1) {
          addTicket(url).then(newURL=>{
            window.open(newURL)
          })
        }else {
          window.open(url)
        }
      } else {
        let promise
        if(isURL(url) && item.isSso === 1) {
          promise =  addTicket(url)
        }else {
          promise = Promise.resolve(url)
        }
        promise.then(openURL=> {
          this.$router.$avueRouter.group = item.group;
          this.$router.$avueRouter.meta = item.meta;
          this.$router.push({
            path: this.$router.$avueRouter.getPath({
              name: item[this.labelKey],
              src: openURL
            }, item.meta),
            query: item.query
          });
        })

      }
    },
    handleMouseover(event) {
      const target = event.target;
      if(target.className.includes('el-tooltip')) {
        const ins = target.__vue__;
        // ins.$on('mounted', ()=> {
        //
        // })
        const popper = ins.$refs.popper;
        popper.classList.add('Huilan-menu-tip')
      }
      // debugger
    }
  }
};
</script>
<style type="text/css">
.noAdminCancelButton {
  color: #fff;
  background-color: #0045c8;
  border-color: #0045c8;
}
</style>

