<template>
  <div class="avue-top">
    <div class="top-bar__left">
      <div class="avue-breadcrumb"
           :class="[{ 'avue-breadcrumb--active': isCollapse }]"
           v-if="showCollapse">
        <i class="icon-navicon"
           @click="setCollapse"></i>
      </div>
    </div>
    <div class="top-bar__title">
      <div style="color: #fff;font-size: 18px;margin-left: 20px;">河南军民融合公共服务平台（外网）</div>
      <div class="top-bar__item top-bar__item--show"
           v-if="showMenu">
        <top-menu ref="topMenu"></top-menu>
      </div>
      <!-- <span class="top-bar__item"
            v-if="showSearch">
        <top-search></top-search>
      </span> -->
    </div>
    <div class="top-bar__right">
<!--      <el-tooltip v-if="showColor"-->
<!--                  effect="dark"-->
<!--                  :content="$t('navbar.color')"-->
<!--                  placement="bottom">-->
<!--        <div class="top-bar__item">-->
<!--          <top-color></top-color>-->
<!--        </div>-->
<!--      </el-tooltip>-->
        <!-- <el-tooltip v-if="showColor"
                    effect="dark"
                    content="机器人小助手"
                    placement="bottom">
          <div class="top-bar__item">
            <KwRobotTrain :hasTrainBtn="false" class="robot-train"/>
          </div>
        </el-tooltip> -->
      <!-- <el-tooltip v-if="showDebug"
                  effect="dark"
                  :content="logsFlag?$t('navbar.bug'):logsLen+$t('navbar.bugs')"
                  placement="bottom">
        <div class="top-bar__item">
          <top-logs></top-logs>
        </div>
      </el-tooltip> -->
      <!-- <el-tooltip v-if="showLock"
                  effect="dark"
                  :content="$t('navbar.lock')"
                  placement="bottom">
        <div class="top-bar__item">
          <top-lock></top-lock>
        </div>
      </el-tooltip>
      <el-tooltip v-if="showTheme"
                  effect="dark"
                  :content="$t('navbar.theme')"
                  placement="bottom">
        <div class="top-bar__item top-bar__item--show">
          <top-theme></top-theme>
        </div>
      </el-tooltip> -->

      <!--调查问卷-->
      <el-tooltip 
        effect="dark"
        content="调查问卷"
        placement="bottom"
        v-if="tj == 'true'"
      >
        <div class="top-bar__item">
          <i class="el-icon-edit-outline" @click="handleQuest"></i>
        </div>
      </el-tooltip>

      <el-dialog :title="ptitle" :visible.sync="dialogQuest" :modal="true" :modal-append-to-body="false" width="60%" :lock-scroll="true">
        <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="100px" class="demo-ruleForm" style="height: 100%;">
          <el-form-item v-for="(item, index) in ruleForm" :key="index">
            <div>
              <span style="color: #f00;" v-if="item.ismust == 1">*</span>
              {{ index + 1 }}. {{ item.qcontent }}
              <span style="color: #af2c30;" v-if="item.qtype == 'checkbox'">（多选）</span>
              <span style="color: #af2c30;" v-if="item.qtype == 'radio'">（单选）</span>
            </div>
            <div v-if="item.qtype == 'radio'" class="newradio">
              <el-radio-group v-model="item.answers">
                <el-radio :label="item.id" v-for="(item, index) in item.questionOptionVOList" :key="index">
                  <span style="display: inline-block;margin-left: 10px;">{{ item.name }}</span>
                  <span style="display: inline-block;margin-left: 10px;">{{ item.optionContent }}</span>
                </el-radio>
              </el-radio-group>
            </div>

            <div v-if="item.qtype == 'checkbox'" class="newradio">
              <el-checkbox-group v-model="item.checkList" :key="index">
                <el-checkbox :label="item.id" v-for="(item, index) in item.questionOptionVOList" :key="index">
                  <span style="display: inline-block;margin-left: 10px;">{{ item.name }}</span>
                  <span style="display: inline-block;margin-left: 10px;">{{ item.optionContent }}</span>
                </el-checkbox>
              </el-checkbox-group>
            </div>

            <div v-if="item.qtype == 'input'">
              <el-input v-model="item.answers" type="textarea" autosize placeholder="请输入内容" style="width:60%"></el-input>
            </div>
          </el-form-item>
        </el-form>
        <div class="operation" v-if="tj == 'true'">
          <el-button type="primary" :loading="true" v-if="!pictLoading">提交中</el-button>
          <el-button @click="save" type="primary" v-if="pictLoading">提交</el-button>
          <el-button @click="cancle" type="info">取消</el-button>
        </div>
      </el-dialog>


      <el-tooltip effect="dark"
                  :content="$t('navbar.notice')"
                  placement="bottom">
        <div class="top-bar__item top-bar__item--show">
          <top-notice></top-notice>
        </div>
      </el-tooltip>
      <!-- <el-tooltip effect="dark"

                  :content="$t('navbar.language')"
                  placement="bottom">
        <div class="top-bar__item top-bar__item--show">
          <top-lang></top-lang>
        </div>
      </el-tooltip> -->
      <!-- <el-tooltip v-if="showFullScren"
                  effect="dark"
                  :content="isFullScren?$t('navbar.screenfullF'):$t('navbar.screenfull')"
                  placement="bottom">
        <div class="top-bar__item">
          <i :class="isFullScren?'icon-tuichuquanping':'icon-quanping'"
             @click="handleScreen"></i>
        </div>
      </el-tooltip> -->
      <img class="top-bar__img"
           :src="userInfo.avatar">
      <el-dropdown>
        <span class="el-dropdown-link top-bar-userInfo">
          <span class="top-bar-userAccount">{{userInfo.account}}</span>
          <!-- <span class="top-bar-tenantName" :alt="currentTenantAll.tenantName" :title="currentTenantAll.tenantName">({{currentTenantAll.tenantName}})</span> -->
          <i class="el-icon-arrow-down el-icon--right"></i>
        </span>
        <el-dropdown-menu slot="dropdown">
          <!-- <el-dropdown-item>
            <router-link to="/">{{$t('navbar.dashboard')}}</router-link>
          </el-dropdown-item> -->
          <el-dropdown-item>
            <router-link to="/info/index?tab=userinfo">{{$t('navbar.userinfo')}}</router-link>
          </el-dropdown-item>
          <!-- <el-dropdown-item v-if="userInfo.isAdmin === '1'" @click.native="switchTenant">
            {{$t('navbar.switchTenant')}}
          </el-dropdown-item> -->

          <!-- <el-dropdown-item  @click.native="AiCOSLicense">
            系统授权
          </el-dropdown-item>
          <el-dropdown-item  @click.native="showUpdateLog">
            升级日志
          </el-dropdown-item> -->

          <el-dropdown-item @click.native="logout"
                            divided>{{$t('navbar.logOut')}}
          </el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
    </div>
    <LicenseModel
      :title="LicenseTitle"
      :isShow.sync="isShow"
      :paramData="lsData"
      @successFun="lsSuccessFun"
    ></LicenseModel>
    <topTenant ref="topTenant"/>

    <HuilanDialog title="升级日志"
      :fullscreen="false"
      width="660px"
      append-to-body
      :visible.sync="updateLogTag"
      >
      <UpdateLog :showLicense="false" style="height: 70vh" />
    </HuilanDialog>


  </div>
</template>
<script>
import {resetRouter} from '@/router/router'
import {mapGetters, mapState} from "vuex";
import {fullscreenToggel, listenfullscreen} from "@/util/util";
import topLock from "./top-lock";
import topMenu from "./top-menu";
import topSearch from "./top-search";
import topTheme from "./top-theme";
import topLogs from "./top-logs";
// import topColor from "./top-color";
import topNotice from './top-notice'
import topLang from "./top-lang";
import topTenant from './top-tenant';
//机器人训练Demo组件
import KwRobotTrain from "@/components/kwRobotTrain/index";

import LicenseModel from '@/views/license/index';
import UpdateLog from "@/views/updateLog";
//调查问卷
import { getUser, getQuestionDetail, getQuestion, submitQuestion } from "@/api/outSystem/design";

export default {
  components: {
    topLock,
    topMenu,
    topSearch,
    topTheme,
    topLogs,
    // topColor,
    topNotice,
    topLang,
    topTenant,
    LicenseModel,
    UpdateLog,
    KwRobotTrain
  },
  name: "top",
  data() {
    return {
      isShow: false,
      lsData:{
        handleType: '',
        isApp: false,
        needLast: false,
        params:{},
      },

      LicenseTitle:'更新授权',
      updateLogTag: false,

      //调查问卷
      dialogTableVisible:false,
      dialogQuest:false,
      tj:'',
      ruleForm:[],
      checkList:[],
      Eng:['A','B','C','D','E','F','G','H','I','J','K','L','M','N','O','P','Q','R','S','T','U','V','W','X','Y','Z'],
      savezt:true,
      saveArr:[],
      pictLoading:true,
      ptitle:'',

    };
  },
  filters: {},
  created() {
  },
  mounted() {
    listenfullscreen(this.setScreen);

    this.getUser()
  },
  computed: {
    ...mapState({
      showDebug: state => state.common.showDebug,
      showTheme: state => state.common.showTheme,
      showLock: state => state.common.showLock,
      showFullScren: state => state.common.showFullScren,
      showCollapse: state => state.common.showCollapse,
      showSearch: state => state.common.showSearch,
      showMenu: state => state.common.showMenu,
      showColor: state => state.common.showColor,
      currentTenantAll: state => state.user.currentTenantAll,
    }),
    ...mapGetters([
      "userInfo",
      "isFullScren",
      "tagWel",
      "tagList",
      "isCollapse",
      "tag",
      "logsLen",
      "logsFlag"
    ])
  },
  methods: {
    open1() {      
      const h = this.$createElement;

      this.$notify({
        title: '消息通知',
        message: h('i', { style: 'color: #af2c30'}, '您有新的服务评价，请点击右上角调查问卷进行评价！')
      });
    },
    handleScreen() {
      fullscreenToggel();
    },
    setCollapse() {
      this.$store.commit("SET_COLLAPSE");
    },
    setScreen() {
      this.$store.commit("SET_FULLSCREN");
    },
    switchTenant() {
      this.$refs.topTenant.show();
    },
    logout() {
      this.$confirm(this.$t("logoutTip"), this.$t("tip"), {
        confirmButtonText: this.$t("submitText"),
        cancelButtonText: this.$t("cancelText"),
        type: "warning"
      }).then(() => {
        this.$store.dispatch("LogOut").then(() => {
          resetRouter();
          this.$router.push({path: "/login"});
          window.location.reload();
        });
      });
    },
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
    showUpdateLog(){
      this.updateLogTag = true;
    },

    //获取是否提交
    async getUser () {
      let res = await getUser()
      if (res.data.code === 200) {
        this.tj = res.data.data
        if (res.data.data == 'true') {
          this.open1()
          getQuestionDetail(1).then(result => {
            if (result.data.code == 200) {
              getQuestion(result.data.data.id).then(question => {
                this.ptitle = question.data.data.pname
                question.data.data.questionsVOList.forEach(e => {
                  e.checkList = []
                  e.answers = ''
                  if (e.questionOptionVOList.length > 0) {
                    e.questionOptionVOList.forEach((e1, i) => {
                      e1.name = this.Eng[i]
                    });
                  }
                });
                this.ruleForm = question.data.data.questionsVOList
                this.dialogQuest = true
              })
            }
          })
        }
      }
    },
    //提交调查问卷
    save () {
      this.saveArr = []
      try {
        this.ruleForm.forEach(e => {
          if (e.ismust == 1) {
            if (e.qtype == 'checkbox') {
              if (e.checkList.length == 0) {
                this.savezt = false
                this.$message({
                  message: '缺少必填项',
                  type: 'warning',
                });
                throw new Error('End Loop')
              } else {
                this.savezt = true
                e.answers = e.checkList.join(',')
              }
            } else {
              if (!e.answers) {
                this.savezt = false
                this.$message({
                  message: '缺少必填项',
                  type: 'warning',
                });
                throw new Error('End Loop')
              } else {
                this.savezt = true
              }
            }
          } else {
            if (e.qtype == 'checkbox') {
              if (e.checkList.length > 0) {
                e.answers = e.checkList.join(',')
              }
            }
          }

          let obj = {
            answers: e.answers,
            pid: e.pid,
            qid: e.id,
            qtype: e.qtype,
          }
          this.saveArr.push(obj)
        })
      } catch (e) {
        if (e.message === 'End Loop') throw e
      }

      if (this.savezt) {
        this.pictLoading = false
        submitQuestion({ userQuestionList: this.saveArr }).then(res => {
          if (res.data.code == 200) {
            this.$message({
              message: '提交成功',
              type: 'success'
            });
            this.pictLoading = true
            this.dialogQuest = false
            this.getUser()
          } else {
            this.$message({
              message: '提交失败',
              type: 'warning'
            });
            this.pictLoading = true
          }
        })
      } else {
        this.$message({
          message: '缺少必填项',
          type: 'warning',
        });
      }
    },
    //调查问卷
    handleQuest () {
      this.dialogQuest = true
    },
    cancle () {
      this.dialogQuest = false
    }
  }
};
</script>

<style lang="scss" scoped>
/deep/ .el-badge i {
  color: #fff !important;
}
/deep/ .top-bar-userAccount{
  color: #fff !important;
}
/deep/ .el-dropdown i{
  color: #fff !important;
}
.robot-train {
  /deep/ .header-assistant-icon {
    line-height: 0;
    margin-top: 16px;

    img {
      width: 26px;
      margin: 0;
    }
    .desk-window-warnIcon {
      width: 16px;
      top: -5px;
      margin: 0;
      right: -10px;
    }

  }
}
.top-bar-userInfo {
  display: flex;
  align-items: center;
  .top-bar-userAccount {
    display: inline-block;
  }
  .top-bar-tenantName {
    display: inline-block;
    max-width: 200px;
    overflow: hidden;
    white-space:nowrap;
    text-overflow:ellipsis;
    margin: 0 8px;
  }
}
.operation{
  width: 100%;
  text-align: center;
  /deep/ .el-icon-loading{
    line-height: 0px !important;
  }
}
.top-bar__left i, .top-bar__right i{
  color: #fff;
}
</style>
