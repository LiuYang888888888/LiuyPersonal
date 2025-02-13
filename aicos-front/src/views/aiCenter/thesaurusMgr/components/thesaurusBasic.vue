<template>
  <HuilanBasic>
    <!-- <v-if="userInfo.isAdmin !== '1'" -->
    <el-form v-if="appSelectTag" label-width="80px">
      <el-form-item :label="$t('aiCenter.notionalWords.applyFilter')" style="margin-bottom: 0;">
        <el-select v-model="curAiAppId"
          :placeholder="$t('aicosCommon.pleaseSelect') + $t('aiCenter.notionalWords.application')" size="small">
          <el-option v-for="item in aiAppList" :key="item.id" :label="item.name" :value="item.id">
          </el-option>
        </el-select>
      </el-form-item>
    </el-form>
    <slot v-if="canShow"></slot>
  </HuilanBasic>
</template>

<script>
import { applicationListByPage } from '@/api/configure/application'
import { mapGetters } from "vuex";

import { baseURL } from '@/api/common';

export default {
  name: 'thesaurusBasic',
  props: {
    value: String
  },
  data () {
    return {
      aiAppList: [],
      curAiAppId: '',
      appSelectTag: false,
      canShow: true,
    }
  },
  computed: {
    ...mapGetters(["userInfo"])
  },
  watch: {
    curAiAppId (newVal) {
      this.$emit('input', newVal)
    }
  },
  methods: {
    async getAiAppList () {
      const postData = {
        current: 1,
        size: 10000
      }
      const { data: { data } } = await applicationListByPage(postData)
      let arr = []
      if (data.records.length > 0) {
        data.records.map(v => {
          if (v) {
            arr.push(v)
          }
        })
        this.aiAppList = arr
        // this.curAiAppId = data.records[0].id;
        this.curAiAppId = arr[0].id;

      } else {
        this.$message({
          type: 'error',
          message: '暂无已授权应用，请先去角色设置授权应用',
        });
        this.canShow = false;
      }


    },

    // showAppSelect () {

    //   let sysCode = this.$route.query.sysCode || baseURL || 'aicos';
    //   sysCode = sysCode.replace(/\//g, '');

    //   if (
    //     (
    //       this.userInfo.isAdmin == 0
    //       || this.userInfo.isAdmin == 3
    //     )
    //     && sysCode.includes('aicos')
    //   ) {
    //     this.appSelectTag = true
    //   }

    // },

    async handleAiAppid(){
      if (this.userInfo.isAdmin == 1) {
        // 无论什么系统, 超管都不能选应用 切设置为0000000

        this.aiAppList = [{id: '000000', name: '默认应用',}];
        this.curAiAppId = '000000';
        this.appSelectTag = false;
        // console.log('无论什么系统, 超管 this.curAiAppId', this.curAiAppId)

      } else if( this.userInfo.isAdmin == 0 || this.userInfo.isAdmin == 3 ){

        let sysCode = this.$route.query.sysCode || baseURL || 'aicos';
        sysCode = sysCode.replace(/\//g, '');
        // console.log('sysCode', sysCode)

        if (sysCode.includes('aicos')) {

          // AiCOS系统 的普通用户和租户管理员 需要选择被授权的应用
          await this.getAiAppList();
          this.appSelectTag = true;

          // console.log(' AiCOS系统 的普通用户或租户管理员 this.curAiAppId', this.curAiAppId)

        }else{

          //不是AiCOS系统的普通用户和租户管理员 不能选择应用( 下拉框可现实 也可以不显示), 设置为用户所在的租户id
          this.aiAppList = [{ id: this.$store.state.user.currentTenantId,  name: '当前租户创建的应用名称', }];
          this.curAiAppId = this.$store.state.user.currentTenantId;
          this.appSelectTag = false;

          // console.log('不是AiCOS系统的普通用户或租户管理员 this.curAiAppId', this.curAiAppId)
        }

      }else{
        this.$message({
          type: 'error',
          message: '用户类型及已授权应用，获取失败，请联系管理员！',
        });
        this.appSelectTag = false;
        this.canShow = false;
      }
    }

  },
  mounted () {
    // if (this.userInfo.isAdmin == '0') {
    //   this.getAiAppList()
    // } else {
    //   this.curAiAppId = '000000'
    // }
    // console.log('this.userInfo', this.userInfo)
    this.handleAiAppid();


    // this.showAppSelect();

  }
}
</script>

<style scoped></style>
