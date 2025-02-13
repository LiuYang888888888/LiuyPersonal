<template>
  <div class="register">
    <div class="regLogo">
      <img src="~@/assets/reg/regLogo.png" alt="logo">
    </div>
    <div class="zhuce">
      <el-form :model="regForm" :rules="rules" ref="regForm" class="regForm ">
        <el-form-item prop="realName">
          <el-input v-model="regForm.realName" clearable placeholder="请输入姓名"></el-input>
        </el-form-item>
        <el-form-item prop="account">
          <el-input v-model="regForm.account" clearable placeholder="请输入账号，推荐公司名称简写/邮箱号"></el-input>
        </el-form-item>
        <el-form-item prop="password">
          <el-input type="password" show-password v-model="regForm.password"
                    placeholder="请输入密码，包含大小字母、数字、特殊字符两种" clearable></el-input>
        </el-form-item>
        <el-form-item prop="checkPass">
          <el-input type="password" show-password v-model="regForm.checkPass" placeholder="请输入确认密码"
                    clearable></el-input>
        </el-form-item>

        <el-form-item prop="memberType" class="formTab">
          <el-radio-group v-model="regForm.memberType" v-for="(item,index) of userTypeList" :key="index">
            <el-radio :label="item.name"
                      :value="item.index"
                      :class="{active: isUserActive === index}"
                      @click.stop.native="getUserType(index)"></el-radio>
          </el-radio-group>
        </el-form-item>
        <div class="userTypeBox" v-if="userTypeFlagList[0]===1">
          <el-form-item prop="enterpriseCreditCode" class="comCode">
            <el-input class="configInput" v-model="regForm.enterpriseCreditCode" clearable
                      placeholder="请输入统一社会信用代码"></el-input>
            <el-button class="checkCode configRight" @click="checkCode()">点击获取企业信息</el-button>
          </el-form-item>
        </div>
        <div class="userTypeBox enterPos" v-if="userTypeFlagList[3]!==1">
          <el-form-item prop="enterpriseName">
            <el-input v-model="regForm.enterpriseName" clearable placeholder="请输入单位名称" @input="handleChange"></el-input>
          </el-form-item>
          <div class="searchFlex" v-if="searchList.length>0 && regForm.enterpriseName && searchListFlag">
            <ul>
              <li v-for="(item,index) in searchList" :key="index" @click="getEnterpriseName(item.enterprise_name)">{{item.enterprise_name}}</li>
            </ul>
          </div>
        </div>

        <el-form-item prop="contacts">
          <el-input v-model="regForm.contacts" clearable placeholder="请输入联系人姓名"></el-input>
        </el-form-item>
        <el-form-item prop="mobile">
          <el-input v-model="regForm.mobile" clearable placeholder="请输入手机号"></el-input>
        </el-form-item>
        <el-form-item prop="validateValue">
          <el-row :span="24">
            <el-col :span="16">
              <el-input
                v-model="regForm.validateValue"
                auto-complete="off"
                :placeholder="$t('login.code')"
                class="">
              </el-input>
            </el-col>
            <el-col :span="8">
              <div class="reg-code">
                <img
                  :src="regForm.image"
                  class="reg-code-img"
                  @click="refreshCode"
                />
              </div>
            </el-col>
          </el-row>
        </el-form-item>
        <el-form-item prop="mobileCode" class="phoneCode">
          <el-input class="configInput" v-model="regForm.mobileCode" clearable
                    placeholder="请输入手机验证码"></el-input>
          <el-button class="getPhoneCode configRight" @click="getPhoneCode()">获取手机验证码</el-button>
        </el-form-item>

        <div v-if="userTypeFlagList[0]===1">
          <el-form-item class="uploadImg" prop="businessLicensePhoto">
            <el-input class="imgUrl configInput" disabled :value="regForm.businessLicensePhoto"
                      placeholder="请选择营业执照图片"></el-input>
            <el-upload
              class="avatar-uploader configRight"
              action="/aicos/api/aicos-file/miniofile/upload"
              :show-file-list="false"
              :data="uploadData"
              :on-success="handleAvatarSuccess"
              :on-error="handleAvatarError"
              :before-upload="beforeAvatarUpload"
              :limit="1">
              <el-button class="chooseImgBtn configRight">选择图片</el-button>
            </el-upload>
          </el-form-item>
        </div>

        <el-form-item class="regFormBtnItem">
          <el-button class="regFormBtn" type="primary" @click="submitForm('regForm')">注册</el-button>
          <div class="SignContainer-tip SignContainer-tipRes">
            <el-checkbox v-model="tipR" label=""></el-checkbox>
            点击立即注册，表示您同意遵守注册流程相关承诺
          </div>
          <!--          <el-button @click="returnForm">取消</el-button>-->
        </el-form-item>
      </el-form>
    </div>
    <regFooter></regFooter>

  </div>
</template>
<script>
// 中间tab切换
import regFooter from './regFooter.vue'
import {sendMessage, getMember, reg} from "@/api/user";
import {getEnterpriseNameListByQuery} from "@/api/system/user";
import { isvalidatemobile } from "@/util/validate";


export default {
  components: {
    regFooter
  },
  data() {
    var realName = (rule, value, callback) => {
      const regUser = /^[\u4E00-\u9FA5]{2,10}(·[\u4E00-\u9FA5]{2,10}){0,2}$/
      if (regUser.test(value)) {
        return callback()
      }
      callback(new Error('姓名不能为空'))
    }
    var account = (rule, value, callback) => {
      const regUser = /^[a-zA-Z0-9_-]{3,16}$/
      if (regUser.test(value)) {
        return callback()
      }
      callback(new Error('用户名不能为空'))
    }
    var checkMobile = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请输入手机号'))
      } else if (isvalidatemobile(value)[0]) {
        callback(new Error(isvalidatemobile(value)[1]));
      } else {
        callback()
      }
    }
    var password = (rule, value, callback) => {
      const passValidate = /^(?![a-zA-Z]+$)(?!\d+$)(?![^\da-zA-Z\s]+$).{6,16}$/
      if (value === '') {
        callback(new Error('请输入密码'))
      } else if (!passValidate.test(value)) {
        callback(new Error('密码必须包含大小字母、数字、特殊字符两种'))
      } else {
        callback()
      }
    }
    var validatePass2 = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请再次输入密码'))
      } else if (value !== this.regForm.password) {
        callback(new Error('两次输入密码不一致!'))
      } else {
        callback()
      }
    }
    var enterpriseCreditCode = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请输入统一社会信用代码'));
      } else {
        callback()
      }
    }
    var enterpriseName = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请输入单位名称'));
      } else {
        callback()
      }
    }
    var contacts = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请输入联系人姓名'));
      } else {
        callback()
      }
    }
    var validateValue = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请输入图形验证码'));
      } else {
        callback()
      }
    }
    var mobileCode = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请输入手机验证码'));
      } else {
        callback()
      }
    }
    var businessLicensePhoto = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请选择营业执照图片'));
      } else {
        callback()
      }
    }

    var institute = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请选择营业执照图片'));
      } else {
        callback()
      }
    }

    var memberType = (rule, value, callback) => {
      // console.log(value, "用户类型")
      if (value === '') {
        callback(new Error('请选择用户类型'));
      } else {
        callback()
      }
    }

    return {
      // 上传图片
      uploadData:{
        fromSystemName: 'base'
      },

      //
      searchList:[],
      searchListFlag:false,

      // 用户类型
      userTypeList: [{index: 1, name: '企业用户'}, {index: 2, name: '科研院所'}, {
        index: 3,
        name: '服务机构'
      }, {index: 4, name: '个人游客'}],
      userTypeFlagList: [1, 0, 0, 0],
      isActive: 0,
      isUserActive: 0,
      currentTab: "prince",
      tipR: false,//阅读
      refreshCodeTimer: "",//定时去后台获取新的验证码
      regForm: {
        // 账号
        account: '',
        // 姓名
        realName: '',
        // 手机号
        mobile: '',
        // 密码
        password: '',
        // 确认密码
        checkPass: '',
        // 用户类型-tab切换
        memberType: '',
        // 统一社会信用代码
        enterpriseCreditCode: '',
        // 联系人
        contacts: '',
        //验证码的值
        validateValue: '',
        //验证码的索引
        validateKey: "",
        //预加载白色背景
        image:
          "data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7",
        //手机验证码
        mobileCode: '',
        //营业执照图片
        businessLicensePhoto: '',
        // 单位名称
        enterpriseName: '',
      },
      rules: {
        realName: [{validator: realName, trigger: 'blur'}],
        account: [{validator: account, trigger: 'blur'}],
        mobile: [{validator: checkMobile, trigger: 'blur'}],
        // email: [{ validator: checkEmail, trigger: 'blur' }],
        password: [{validator: password, trigger: 'blur'}],
        checkPass: [{validator: validatePass2, trigger: 'blur'}],
        memberType: [{validator: memberType, trigger: 'blur'}],
        // userType: [{ required: true, message: '请选择用户类型', trigger: 'change' }],
        enterpriseCreditCode: [{validator: enterpriseCreditCode, trigger: 'blur'}],
        enterpriseName: [{validator: enterpriseName, trigger: 'blur'}],
        contacts: [{validator: contacts, trigger: 'blur'}],
        mobileCode: [{validator: mobileCode, trigger: 'blur'}],
        businessLicensePhoto: [{validator: businessLicensePhoto, trigger: 'blur'}],
        institute: [{validator: institute, trigger: 'blur'}],
        validateValue: [{validator: validateValue, trigger: 'blur'}],
      }
    }
  },
  created() {
    // this.getTenant();
    this.refreshCode();
  },
  methods: {
    getEnterpriseName(name){
      this.regForm.enterpriseName = name
      this.searchListFlag = false
    },
    handleChange(){
      let param = new URLSearchParams()
      param.append("name",this.regForm.enterpriseName)
      getEnterpriseNameListByQuery(param).then((res)=>{
        // console.log("结果",res.data.data)
        this.searchList = res.data.data
        if (res.data.data.length>0){
          this.searchListFlag = true;
        }
      })
    },

    // 用户类型切换
    getUserType(index) {
      this.isUserActive = index;  // 把当前点击元素的index，赋值给activeClass
      this.memberType = index + 1;
      // console.log("用户类型",this.memberType)
      for (var i = 0; i < this.userTypeFlagList.length; i++) {
        this.userTypeFlagList[i] = 0;
      }
      this.$set(this.userTypeFlagList, index, 1)
      // 切换之后清空form清空所有内容和验证规则
      // this.$refs.regForm.resetFields();

      // this.$refs.regForm.clearValidate("enterpriseCreditCode");
      // this.$refs.regForm.resetField("enterpriseName");
      // this.$refs.regForm.resetField("enterpriseCreditCode")

    },
    // 上传失败
    handleAvatarError(res){
      this.$message({
        message: res.error,
        type: 'error'
      });
    },

      // 上传图片
    handleAvatarSuccess(res, file) {
      this.regForm.businessLicensePhoto = file.name;
      // this.regForm.businessLicensePhoto = res.data.newFileName;
      this.$message({
        message: '上传成功！',
        type: 'success'
      });
      // this.regForm.businessLicensePhoto = window.URL.createObjectURL(file.raw);
    },

    // 上传限制
    beforeAvatarUpload(file) {
      const isJPG = file.type === 'image/jpeg' || 'image/png';
      const isLt2M = file.size / 1024 / 1024 < 2;

      if (!isJPG) {
        this.$message.error('上传图片只能是 JPG 格式或 PNG 格式!');
      }
      if (!isLt2M) {
        this.$message.error('上传图片大小不能超过 2MB!');
      }
      return isJPG && isLt2M;
    },
    // 获取手机验证码
    getPhoneCode() {

      this.$refs.regForm.validateField("mobile")
      this.$refs.regForm.validateField("validateValue")
      if (this.regForm.validateKey && this.regForm.mobile && this.regForm.validateValue) {
        const data = {
          mobileCode: this.regForm.validateKey,
          outDate: this.regForm.validateValue,
          mobile: this.regForm.mobile
        }
        sendMessage(data).then((res) => {
          console.log(res, "短信验证码")
          if (res.data.code === 200) {
            this.$message({
              type: "success",
              message: "短信验证码已发送到 " + this.regForm.mobile + "，请注意查收！"
            });
          } else {
            this.$message({
              type: "error",
              message: res.msg
            });
          }
        })

      }

    },

    // 获取图形验证码
    refreshCode() {
      getMember().then((res) => {
        const data = res.data.data;
        this.regForm.validateKey = data.key;
        this.regForm.image = data.image;

        if (this.refreshCodeTimer) {
          clearTimeout(this.refreshCodeTimer);
        }
        // 定时去后台获取新的验证码
        this.refreshCodeTimer = setTimeout(() => {
          this.refreshCode();
        }, 50000);
      });
    },
    returnForm() {
      // 返回login界面
      this.$router.push('/login')
    },
    // 检查统一社会信用代码
    checkCode() {
      this.$message({
        message: '检查统一社会信用代码',
        type: 'warning'
      });
    },
    submitForm(formName) {

      if (!this.tipR){
        this.$message.info("请同意遵守注册流程")
        return false;
      }

      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.showLoading = this.$loading({
            lock: true,
            text: "注册中,请稍后...",
            spinner: "el-icon-loading",
          });
          this.regForm.password = window.btoa(this.regForm.password)
          this.regForm.memberType = this.memberType;
          // console.log("上传图片", this.regForm.businessLicensePhoto)
          //调用注册接口
          reg(this.regForm).then((res) => {
            if (res.data.code === 200) {
              this.showLoading.close();
              this.refreshCode();
              this.$message({
                message: '注册成功，请前去登录',
                type: 'success'
              });
              this.$refs.regForm.resetFields();

            }
          })
            .catch(() => {
              this.showLoading.close();
              this.refreshCode();
            })
        } else {
          this.refreshCode();
          return false;
        }
      });
    },
    resetForm(formName) {
      this.$refs[formName].resetFields();
    }
  }
}
</script>
<style lang="scss" scoped>
.enterPos{
  position: relative;
}
.searchFlex{
  position: absolute;
  z-index: 100;
  background: #fff;
  width: 100%;
  top: 40px;
  box-shadow: 0px 4px 8px 0 rgba(0, 0, 0, 0.2);
  border-radius: 10px;
  padding: 22px;
}
.searchFlex ul {
  padding: 0px;
  margin: 0;
}

.searchFlex ul li {
  list-style: none;
  margin-bottom: 10px;
  padding-bottom: 10px;
  border-bottom: 1px solid #eee;
}

.searchFlex ul li:last-child {
  border: 0;
  margin: 0;
  padding: 0;
}

.el-radio-group {
  margin-right: 30px;
}

.avatar-uploader {
  height: 0px;
}

.el-upload {
  width: 100% !important;
}

.uploadImg {
  position: relative;
}

.chooseImgBtn {
  position: absolute;
  right: 0;
  top: 0;
}

.comCode, .phoneCode {
  position: relative;
}

.comCode .checkCode, .getPhoneCode {
  position: absolute;
  right: 0;
  top: 0;
}

.register {
  background: url("~@/assets/reg/regBack.jpg") top no-repeat;
  background-size: cover;

}

.regLogo {
  padding: 60px 0;
  text-align: center;
}

.regLogo img {
  width: 600px;
}

.zhuce {
  width: 60%;
  margin: 0 auto;
  padding: 60px;
  background: #fff;
  box-sizing: border-box;
  border-top: 9px solid #ad2d33;
  margin-bottom: 40px;
}

.formTop {
  color: #333;
  font-size: 18px;
  text-align: center;
  border-bottom: 1px solid #e0e0e0;
  margin-bottom: 30px;
}

.formTop span {
  display: inline-block;
  height: 40px;
  line-height: 30px;
  cursor: pointer;
  color: #999999;
}

.formTop span.on {
  border-bottom: 4px solid #ad2d33;
  color: #333;
}

.formTop span:first-child {
  margin-right: 60px;
}

.zhuce form.el-form {
  width: 70%;
  margin: 0 auto;
}

.el-form-item > div {
  margin-left: 0px !important;
}

.el-col {
  margin-bottom: 0px !important;
}

.reg-code {
  margin-left: 15px;
  height: 40px;
}

.reg-code-img {
  margin-top: 2px;
  width: 100%;
  height: 38px;
  background-color: #fdfdfd;
  border: 1px solid #f0f0f0;
  color: #333;
  font-size: 14px;
  font-weight: bold;
  letter-spacing: 5px;
  line-height: 38px;
  text-indent: 5px;
  text-align: center;
  cursor: pointer !important;
}

.el-form {
  .el-form-item.formTab {
    .el-form-item__content {
      margin-left: 0px !important;
    }
  }
}

//
.configInput {
  width: 67%;
}

.configRight {
  width: 30%;
}

.regFormBtnItem {
  text-align: center;
  margin-top: 60px;
}

.regFormBtn {
  width: 70%;
  height: 40px;
  text-align: center;
  border: 0;
  background: #af2c30;
  color: #fff;
  border-radius: 5px;
}

.SignContainer-tip {
  font-size: 12px;
  color: #b5b5b5;
}


</style>

