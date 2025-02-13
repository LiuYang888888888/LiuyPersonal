<template>
  <basic-container>
    <el-tabs
      v-model="activeTab"
    >
      <el-tab-pane label="通知消息" name="first">
        <MyMessage/>
      </el-tab-pane>
      <el-tab-pane label="个人信息" name="second">
        <avue-form
          ref="infoForm"
          :option="option"
          v-model="form"
          @submit="handleSubmit"
        />
        <el-button
          ref="changePwdBtn"
          type="text"
          size="small"
          @click="handleChangeBtn"
        >修改密码</el-button>
      </el-tab-pane>
    </el-tabs>
  </basic-container>
</template>

<script>
import option from "@/option/user/info";
import option1 from "@/option/user/infoType1";
import option2 from "@/option/user/infoType2";
import option3 from "@/option/user/infoType3";
import {getUserInfo, update, getUserInfoPost} from "@/api/system/user";

// import md5 from 'js-md5';
// import func from "@/util/func";
// import {createEqual} from '@/util/regx'
import MyMessage from '../mywork/myMessage'


export default {
  components: {
    MyMessage
  },
  data() {
    // const cloneOpt = this.deepClone(option)
    return {
      activeTab: 'first',
      index: 0,
      option: option,
      form: {},
      memberType:'',
    };
  },
  created() {
    this.handleParam()
  },
  watch: {
    activeTab(newVal) {
      if(newVal === 'second') {
        this.getUserInfo()
      }
    }
  },
  methods: {
    // 判断用户类型

    handleParam() {
      const query = this.$route.query
      if(query.tab === 'userinfo') {
        this.activeTab = 'second'
        // this.getUserInfo()
      }
    },
    handleSubmit(form, done) {
      update(form).then(res => {
        if (res.data.success) {
          this.$message({
            type: "success",
            message: "修改信息成功!"
          });

          this.$store.dispatch("GetUserInfo");

        } else {
          this.$message({
            type: "error",
            message: res.data.msg
          });
        }
        done();
      }, error => {
        window.console.log(error);
        done();
      })
    },
    getUserInfo() {
      getUserInfoPost().then(res => {
        const user = res.data.data;
        
        this.memberType = user.memberType;
        this.form = {
          account: user.account,
          id: user.id,
          avatar: user.avatar,
          memberType:user.memberType,
          enterpriseName:user.enterpriseName,
          // name: user.name,
          realName: user.realName,
          mobile: user.mobile,
          email: user.email,
          newPassword: '',
          newPassword1: '',
          isAdmin:0,
          contacts:user.contacts,
        }
        // 企业用户
        if (this.memberType === '1'){
          this.option = option1
        }else if(this.memberType === '2'){
          this.option = option2
        }else if(this.memberType === '3'){
          this.option = option3
        }else if (this.memberType === '4'){
          this.option = option
        }
      });

    },
    handleChangeBtn() {
      this.$store.commit('SET_MODIFYPWD', true)
    },
    moveBtn() {
      const pwd = this.$refs.infoForm.getPropRef('pwd')
      const btn = this.$refs.changePwdBtn
      let elCol = pwd.$el
      while(!elCol.classList.contains('el-col')) {
        elCol = elCol.parentElement
      }
      const colNext = elCol.nextElementSibling
      colNext.append(btn.$el)
      // debugger
    }
  },
  mounted() {
    this.moveBtn()
  }
};
</script>

<style>
</style>
