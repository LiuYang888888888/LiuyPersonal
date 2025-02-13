<template>
  <div class="version">
    <div class="license">
      <el-button
        type="primary"
        size="mini"
        icon="el-icon-s-operation"
        @click.stop="AiCOSLicense"
        v-if="showLicenseModel"
        >系统授权
      </el-button>

      <LicenseModel
        :title="LicenseTitle"
        :isShow.sync="isShow"
        :paramData="lsData"
        @successFun="lsSuccessFun"
      ></LicenseModel>
    </div>
    <div class="update-log" :style="(showLicenseModel?'':'border-top: none;')">
      <template v-for="versionInfo in list">
        <h2 class="log-header" :key="versionInfo.version">
          <i class="el-icon-warning-outline"></i>
          {{versionInfo.version}}&#12288;&#12288;&#12288;&#12288;&#12288;&#12288;{{versionInfo.date}}
        </h2>
        <dl class="log-info" :key="versionInfo.version">
          <template
            v-for="(updateItem, itemIndex) in versionInfo.data"
          >
            <dt :key="itemIndex" :index="itemIndex + 1">{{updateItem.name}}</dt>
            <dd
              v-for="(updateItemDetail, index) of updateItem.data"
              :key="index"
              :index="index + 1"
            > {{updateItemDetail}}</dd>
          </template>
        </dl>
      </template>
    </div>
  </div>
</template>

<script>
import dataList from './dataList';

import LicenseModel from '@/views/license/index';

import { loadScript } from '@/util/util';
import { isNull } from '@/util/qsgCommon.js';

export default {
  name: 'index',
  components: {
    LicenseModel,
  },
  props: {
    showLicense: {
      type: Boolean,
      default: true
    },
  },
  data() {
    dataList[0].type= 'primary'
    dataList[0].size= 'large'
    return {
      list: dataList,

      isShow: false,
      lsData:{
        handleType: '',
        isApp: false,
        needLast: false,
        params:{},
      },

      LicenseTitle:'更新授权',
      showLicenseModel: true,
    }
  },
  methods: {

    AiCOSLicense(){
      //更新AiCOS
      this.LicenseTitle = '系统授权';
      this.lsData.handleType = 'AiCOSLicense';
      this.lsData.isApp = false;
      this.lsData.needLast = true;
      this.lsData.params = {
      }
      this.isShow = true ;
    },

    loadUpdateLogJsData(){
      // console.log( this.$store.state.common.frontParam.updateLogJsUrl)
      const updateLogJsUrl = this.$store.state.common.frontParam.updateLogJsUrl;
      if(!isNull(updateLogJsUrl)) {
        loadScript(updateLogJsUrl).then(() => {

          this.list = [...UpdateLogData ];

        }).catch(() => {
          window.console.log('loadScript error');
        });
      }

    },
  },
  mounted(){
    this.loadUpdateLogJsData();
    this.showLicenseModel = this.showLicense;
  },
}
</script>

<style lang="scss" scoped>
.version {
  position: relative;
  .license {
    position: absolute;
    top: -32px;
    right: 5px;
  }
}
.update-log {
  padding: 10px;
  height: 100%;
  overflow: auto;
  border-top: 1px solid #c7cad3;
}
.log-header {
  margin: 15px 0 0;
  font-size: 16px;
  color: #070b2d;
}
.log-info {
  margin: 0;

  dt {
    margin: 0;
    padding: 10px 0 5px 20px;
    font-size: 14px;
    color: #070b2d;
    font-weight: 700;

    &:before {
      content: attr(index) ". ";
      margin-left: -15px;
    }
  }
  dd {
    margin: 0;
    padding: 5px 0 5px 25px;
    line-height: 1.5em;
    color: #565863;
    font-size: 14px;

    &:before {
      content: "(" attr(index) ")";
      margin-left: -20px;
    }
  }
}
</style>
