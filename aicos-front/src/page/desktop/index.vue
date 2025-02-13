<template>
  <div
    class="huilan-desktop"
    :style="bgStyle"
    @contextmenu="handleContextMenu"
    @click="handleClick"
  >
    <Desk class="desk" :winList.sync="winList"/>
    <Taskbar
      :winList="winList"
      :handleItemClick="handleItemClick"
    />

    <LicenseModel
      :title="LicenseTitle"
      :isShow.sync="isShow"
      :paramData="lsData"
      @successFun="lsSuccessFun"
    ></LicenseModel>
  </div>
</template>

<script>
import Desk from './desk'
import Taskbar from './taskbar'
import {isURL} from '@/util/validate'
import { saveVisitRecentDesktopMenu } from '@/api/logs'
import { mapState, mapGetters} from 'vuex';
import { addTicket } from '@/api/user';

import LicenseModel from '@/views/license/index';
import { checkLicenseApp } from "@/api/license/license";
import { calcDate } from '@/util/date.js';
import { getStore } from '@/util/store'


export default {
  name: 'index',
  components: {
    Desk,
    Taskbar,
    LicenseModel,
  },
  provide() {
    return {
      desktop: this
    }
  },
  data() {
    return {
      baseZindex: 100,
      winList: [],
      curWin: {},
      visibleStartMenu: false,
      // 控制dashboard
      visibleDashboard: false,
      // 控制搜索
      visibleSearch: false,
      // 存放我的、搜索等按钮距离左边的位置信息
      staticPos: {
        dashboard: 0,
        search: 0
      },
      // 存放弹出的组件，点击其它图标是，隐藏弹出框
      // popoverList: []

      isShow: false,
      lsData:{
        handleType: '',
        isApp: false,
        needLast: false,
        params:{},
      },

      LicenseTitle:'更新授权',

    }
  },
  computed: {
    ...mapState({
      bgStyle(state) {
        const bgSetting = state.common.desktopBgSetting;
        const style = {
          backgroundImage:`url(${bgSetting.url})`,
          backgroundSize: bgSetting.stretch === '1' ? 'cover' : ''
        }
        return style
      }
    }),
    ...mapGetters([
      "userInfo",
    ])
  },
  methods: {
    handleClick() {
      this.hiddenExcept()
      // this.visibleStartMenu = false
      // this.visibleDashboard = false
      // this.visibleSearch = false
    },
    hiddenExcept(key) {
      const keys = [
        'visibleStartMenu',
        'visibleDashboard',
        'visibleSearch'
      ]
      keys.forEach(item => {
        let flag = false
        if(item === key) {
          flag = true
        }
        this[item] = flag
      })
    },
    // 判断是否为最上层
    isTop(data) {
      const list = this.winList.filter(item=> item !== data && item.visible)
      return list.length === 0 ? true : !list.some(item=> {
        return data.zIndex < item.zIndex
      })
    },
    setTop(data) {
      data.zIndex = this.winList.length - 1 + this.baseZindex
      let i = 0
      this.winList.forEach(item => {
        if(item.data.id !==data.data.id) {
          item.zIndex = i + this.baseZindex
          i++;
        }
      })
    },
    sortWin(data, topHide) {
      if(data.visible) {
        if(this.isTop(data)) {
          if(topHide) {
            data.visible = false
          }
        }else {
          this.setTop(data)
        }
      }else {
        if(!this.isTop(data)) {
          this.setTop(data)
        }
        data.visible = true
      }
    },
    /**
     * 桌面图标 任务栏图标 等地方都会调用
     * @param data 当前操作的窗口的数据
     * @param topHide 如果当前窗户在最上层,是否最小化
     */

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
    appLicense(data,topHide,isAiCOS){
      //更新app授权
      this.LicenseTitle = (isAiCOS?'系统授权':'应用系统授权' );
      this.lsData.handleType = (isAiCOS?'AiCOSLicenseFromMenu':'appLicenseFromMenu' );
      this.lsData.isApp = !isAiCOS;
      this.lsData.needLast = true;
      this.lsData.params = {
        ...data,
        topHide:topHide,
      }
      this.isShow = true ;
    },
    lsSuccessFun(data){
      if(data.handleType == 'appLicenseFromMenu'){
        //console.log('授权更新成功，继续去打开应用');
        setTimeout(()=>{
          this.open(data.params, data.params.topHide);
        },1000)

      }else if(data.handleType == 'AiCOSLicenseFromMenu'){
        //console.log('AiCOS系统授权更新成功，继续去打开模块');
        setTimeout(()=>{
          this.open(data.params, data.params.topHide);
        },1000)
      }
    },
    async handleItemClick(item,topHide = true){

      let OsFrontParam = getStore({name: 'frontParam'}) || '';
      //console.log(OsFrontParam);
      if(OsFrontParam){
        if (OsFrontParam.AiCOSLicenseEnable =='true' && isURL(item.linkUrl)){

          //判断是否已经打开过
          let hasOpened = false;
          if( item.data != undefined && item.visible != undefined ){
            // 数据格式变化 说明点击是任务栏 已经打开过了
            hasOpened = true;
          }else{
            let hasOpenedRes = this.winList.find(info => info.data.id === item.id);
            if(hasOpenedRes){
              hasOpened = true;
            }
          }

          //console.log(hasOpened)

          if( hasOpened ){
            // 已经打开过
            this.open(item,topHide);

          }else{
            //窗口未打开，先验证授权
            //console.log(item)
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
                this.open(item,topHide);

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
                  this.appLicense(item,topHide,isAiCOS);

                }).catch((action) => {
                  //console.log(action)
                  if( action === 'cancel' ){
                    this.open(item,topHide);
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
                    this.appLicense(item,topHide,isAiCOS);

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
              //this.$message.error('获取已授权信息失败！');
              return false
            })
          }

        }else{
          this.open(item,topHide);
        }
      }else{
        this.open(item,topHide);
      }



    },

    open(data,topHide = true) {
      let res = data;
      if(res.visible == undefined) {
        // 如果是链接打开链接地址
        if (isURL(data.linkUrl)) {
          if (data.desktopType === 'out') {
            if(data.isSso === 1) {
              addTicket(data.linkUrl).then(newURL=>{
                window.open(newURL)
              })
            }else {
              window.open(data.linkUrl)
            }
            return
          }
        }
        res = this.winList.find(item => item.data.id === data.id)
      }
      this.hiddenExcept()
      // 窗口已经打开
      if(res) {
        // res.visible
        this.sortWin(res, topHide)
      }else {
        res = {
          visible: true,
          zIndex:this.winList.length + this.baseZindex,
          data: data
        }
        this.winList.push(res)

        // 对于后端的模块添加id
        if(data.id && !data.id.startsWith('inner-')) {
          saveVisitRecentDesktopMenu(data.id)
        }
      }

    },
    hiddenAllWin() {
      this.winList.forEach(item=> item.visible = false)
    },
    handleContextMenu(event) {
      event.preventDefault()
    },
    // hiddenPopoverExcept(obj) {
    //   this.popoverList.forEach(item=> {
    //     if(item !== obj) {
    //       item.closePopover()
    //     }
    //   })
    // }
  },
  mounted() {
    const query = this.$route.query
    if(query.tab === 'userinfo') {
      const data = {
        menuName: '用户信息',
        imageUrl: 'iconfont iconicon_principal',
        linkUrl: '/system/userinfo'
      }
      this.handleItemClick(data)
    }
  }
}
</script>

<style lang="scss" scoped>
.huilan-desktop {
  display: flex;
  flex-direction: column;
  height: 100%;

  .desk {
    flex: 1;
  }
}
</style>
