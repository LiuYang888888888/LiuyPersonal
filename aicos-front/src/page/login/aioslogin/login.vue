<template>
  <el-form
    class="login-form"
    :rules="loginRules"
    ref="loginForm"
    :model="loginForm"
    label-width="0"
  >
    <!-- <el-form-item v-if="tenantMode" prop="tenantId">
      <el-input size="small"
                @keyup.enter.native="handleLogin"
                v-model="loginForm.tenantId"
                auto-complete="off"
                :placeholder="$t('login.tenantId')">
        <i slot="prefix" class="icon-quanxian"/>
      </el-input>
    </el-form-item> -->
    <el-form-item prop="username">
      <el-input
        @keyup.enter.native="handleLogin"
        v-model.trim="loginForm.username"
        auto-complete="off"
        :placeholder="$t('login.username')"
      >
<!--        <i slot="prefix" class="icon-yonghu" />-->
      </el-input>
    </el-form-item>
    <el-form-item prop="password">
      <el-input
        size="small"
        @keyup.enter.native="handleLogin"
        :type="passwordType"
        v-model="loginForm.password"
        auto-complete="off"
        :placeholder="$t('login.password')"
      >
        <i
          class="el-icon-view el-input__icon"
          slot="suffix"
          @click="showPassword"
        />
<!--        <i slot="prefix" class="icon-mima" />-->
      </el-input>
    </el-form-item>
    <el-form-item v-if="frontParam.captcha !== 'no'" prop="validateValue">
      <el-row :span="24">
        <el-col :span="16">
          <el-input
            size="small"
            @keyup.enter.native="handleLogin"
            v-model="loginForm.validateValue"
            auto-complete="off"
            :placeholder="$t('login.code')"
          >
<!--            <i slot="prefix" class="icon-yanzhengma" />-->
          </el-input>
        </el-col>
        <el-col :span="8">
          <div class="login-code">
            <img
              :src="loginForm.image"
              class="login-code-img"
              @click="refreshCode"
            />
          </div>
        </el-col>
      </el-row>
    </el-form-item>
    <el-form-item style="margin-top: 30px;">
      <el-button
        type="primary"
        round
        @click.native.prevent="handleLogin"
        class="login-submit"
        >{{ $t("login.submit") }}
      </el-button>
    </el-form-item>

    <div class="loginBottom">
      <a href="">忘记密码？</a>
      <router-link to="/reg">注册</router-link>
    </div>
    <div class="formBottom">
      <p>建设单位：中共河南省委军民融合发展委员会办公室</p>
      <p>技术支持：河南XXXXX有限公司</p>
    </div>

    <LicenseModel
      :title="LicenseTitle"
      :isShow.sync="isShow"
      :paramData="lsData"
      @successFun="lsSuccessFun"
      @cancelFun="refreshCode"
    ></LicenseModel>
  </el-form>
</template>

<script>
import { mapGetters, mapState } from "vuex";
// import {info} from "@/api/system/tenant";
import { getCaptcha, ifNeedModifyPassword } from "@/api/user";
// import {getTopUrl} from "@/util/util";

import LicenseModel from "@/views/license/index";
import { isNull, findNodeByVal } from "@/util/qsgCommon.js";
import { calcDate } from "@/util/date.js";

export default {
  name: "userlogin",
  components: {
    LicenseModel,
  },
  data() {
    return {
      isShow: false,
      lsData: {
        handleType: "",
        isApp: false,
        needLast: false,
        params: {},
      },

      LicenseTitle: "更新AiCOS授权",

      // tenantMode: this.website.tenantMode,
      loginForm: {
        //租户ID
        // tenantId: "000000",
        //用户名
        username: "",
        //密码
        password: "",
        //账号类型
        type: "account",
        //验证码的值
        validateValue: "",
        //验证码的索引
        validateKey: "",
        //预加载白色背景
        image:
          "data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7",
      },
      loginRules: {
        // tenantId: [
        //   {required: false, message: "请输入租户ID", trigger: "blur"}
        // ],
        username: [
          { required: true, message: "请输入用户名", trigger: "blur" },
        ],
        password: [
          { required: true, message: "请输入密码", trigger: "blur" },
          { min: 1, message: "密码长度最少为6位", trigger: "blur" },
        ],
      },
      passwordType: "password",
      refreshCodeTimer: "",

      showLoading: null,

      flag: false, //系统参数设置的首页 是否在有权限菜单里面 false 不在  true 在
    };
  },
  created() {
    // this.getTenant();
    // this.refreshCode();
  },
  mounted() {},
  beforeDestroy() {
    clearTimeout(this.refreshCodeTimer);
  },
  computed: {
    ...mapGetters(["tagWel", "website", "menuAll"]),
    ...mapState({
      frontParam: (state) => state.common.frontParam,
      checkAicosLicense: (state) => state.common.checkAicosLicense,
    }),
    tenantMode() {
      return this.website.tenantMode;
    },
  },
  props: [],
  watch: {
    "frontParam.captcha": {
      handler(val) {
        if (val !== "no") {
          this.refreshCode();
        } else {
          clearTimeout(this.refreshCodeTimer);
        }
      },
      immediate: true,
    },
    /*checkAicosLicense:{
      handler(val) {
        console.log(val)
      },
      immediate: true
    },*/
  },
  methods: {
    refreshCode() {
      getCaptcha().then((res) => {
        const data = res.data.data;
        this.loginForm.validateKey = data.key;
        this.loginForm.image = data.image;

        if (this.refreshCodeTimer) {
          clearTimeout(this.refreshCodeTimer);
        }
        // 定时去后台获取新的验证码
        this.refreshCodeTimer = setTimeout(() => {
          this.refreshCode();
        }, 50000);
      });
    },
    showPassword() {
      this.passwordType === ""
        ? (this.passwordType = "password")
        : (this.passwordType = "");
    },
    calcDate(date) {
      let res = "";
      if (date != "0000-00-00") {
        let theDate = date + " 23:59:59";
        let date1 = new Date(theDate).getTime();
        let date2 = new Date().getTime();

        const calcday = calcDate(date2, date1);
        res = calcday.days;
      } else {
        res = 99999;
      }

      return res;
    },
    aicosLicense(data) {
      //更新app授权
      this.LicenseTitle = "系统授权";
      this.lsData.handleType = "AiCOSLicenseFromLogin";
      this.lsData.isApp = false;
      this.lsData.needLast = true;
      this.lsData.params = {
        ...data,
      };
      this.isShow = true;
      this.refreshCode();
    },
    lsSuccessFun(data) {
      if (data.handleType == "AiCOSLicenseFromLogin") {
        //console.log('AiCOS系统授权更新成功，刷新页面');
        //this.$message.success("请重新登录！");

        setTimeout(() => {
          this.isShow = false;
          //window.location.reload();
        }, 5000);
      }
    },

    async checkLicenseRes(res) {
      let dataRes = res.lsErro;

      let checkRes = false;
      //console.log(checkRes)

      if (isNull(dataRes)) {
        checkRes = true;
        return checkRes;
      } else {
        let canOpen = "no";
        //no 完全阻止 给管理员弹提示
        //yes 放行
        //tip 所有人弹提示，选择继续/更新授权

        let openTips = "授权验证未通过！";
        let isLicenseAdmin = false;
        //let isAiCOS = true;
        // 返回格式
        // licenseAdminExpired:AiCOS 授权过期，管理员登录
        // licenseCommonExpired:AiCOS  授权过期，普通登录
        // licenseAdmin:系统编码:xxxx-xx-xx
        // licenseCommon:系统编码:xxxx-xx-xx

        //if (dataRes == "licenseAdminExpired:AiCOS") {
        if (dataRes.includes("licenseAdminExpired")) {
          openTips = "您的license授权已过期，请重新授权！";
          isLicenseAdmin = true;
        } else if (dataRes.includes("licenseCommonExpired")) {
          openTips = "AiCOS授权已过期，请联系系统管理员进行重新授权！";
          isLicenseAdmin = false;
        } else if (dataRes == "invalidIpAddressAdmin") {
          openTips = "IP受限，请重新授权！";
          isLicenseAdmin = true;
        } else if (dataRes == "invalidIpAddressCommon") {
          openTips = "IP受限，请联系系统管理员进行重新授权！";
          isLicenseAdmin = false;
        } else {
          if (dataRes.split(":")[0] == "licenseAdmin") {
            isLicenseAdmin = true;
          } else if (dataRes.split(":")[0] == "licenseCommon") {
            isLicenseAdmin = false;
          }

          let tipDate = this.calcDate(dataRes.split(":")[2]);
          canOpen = "tips";
          openTips =
            'AiCOS授权<span style=" color:#F56C6C; font-weight:500; padding:0 8px;">' +
            tipDate +
            "天</span>后到期，为了不影响正常使用，请联系管理员及时更新授权！";
        }

        if (canOpen == "tips") {
          this.$confirm(openTips, "系统授权", {
            dangerouslyUseHTMLString: true,
            showConfirmButton: isLicenseAdmin,
            showCancelButton: true,
            confirmButtonText: "立即更新",
            cancelButtonText: "继续使用",
            confirmButtonClass: "",
            cancelButtonClass: isLicenseAdmin ? "" : "noAdminCancelButton",
            closeOnClickModal: false,
            distinguishCancelAndClose: true,
            type: "warning",
          })
            .then(() => {
              //console.log('去更新授权');
              this.aicosLicense();
            })
            .catch((action) => {
              //console.log(action)
              this.refreshCode();
              if (action === "cancel") {
                this.loginCanGo();
              } else {
                return false;
              }
            });
        } else if (canOpen == "no") {
          this.$confirm(openTips, "系统授权", {
            dangerouslyUseHTMLString: true,
            showConfirmButton: true,
            showCancelButton: false,
            confirmButtonText: isLicenseAdmin ? "立即更新" : "确定",
            closeOnClickModal: false,
            distinguishCancelAndClose: true,
            type: "error",
          })
            .then(() => {
              if (isLicenseAdmin) {
                //console.log('是管理员去更新授权');
                this.aicosLicense();
              } else {
                //console.log('不是管理员，不能去更新授权');
                window.location.reload();
                return false;
              }
            })
            .catch(() => {
              return false;
            });
        } else {
          return false;
        }

        //console.log(checkRes)

        return checkRes;
      }
    },
    getTreeItem(data, linkUrl) {
      data.map((item) => {
        if (item.linkUrl == linkUrl) {
          this.flag = true;
        } else {
          if (!this.validatenull(item.menuList)) {
            this.getTreeItem(item.menuList, linkUrl);
          }
        }
      });
    },
    async loginCanGo() {
      //成功获取token后的路由跳转
      this.$router.$avueRouter.formatRoutes(
        this.$store.state.user.menuAll,
        true
      );

      // 设置登录来源
      this.$store.dispatch("SET_LOGIN_FROM", "");
      await this.getTreeItem(this.menuAll, this.tagWel.value);

      let currentRouter = this.$router.currentRoute;
      // console.log('当前路由的参数',currentRouter.query);
      let redirectUrl = null;
      let redirectPath = null;
      let hasInMenu =  false;
      if( currentRouter.query && currentRouter.query.redirect && !isNull(currentRouter.query.redirect) ){

        redirectPath = currentRouter.query.redirect.split('?')[0];
        redirectUrl = currentRouter.query.redirect;
        // console.log('当前路由的参数redirect 回跳地址', redirectUrl , redirectPath);
        // console.log('当前菜单', this.menuAll);
        hasInMenu =  isNull(findNodeByVal(this.menuAll,'linkUrl', redirectPath ,'menuList'))?false:true;

      }

      // console.log('回跳地址是否在菜单里面',hasInMenu);

      ifNeedModifyPassword({ account: this.loginForm.username }).then(
        ({ data }) => {

          if ( hasInMenu) {

            this.$router.push({ path: redirectUrl }, () => {
              if (data.data === "yes") {
                this.$store.commit("SET_MODIFYPWD", true);
              }
            });

          }else {

            if (!this.flag && this.tagWel.value !== '/desktop') {
              if (!this.validatenull(this.menuAll[0].menuList)) {
                this.$router.push(
                  { path: this.menuAll[0].menuList[0].linkUrl },
                  () => {
                    if (data.data === "yes") {
                      this.$store.commit("SET_MODIFYPWD", true);
                    }
                  }
                );
              } else {
                this.$router.push({ path: this.menuAll[0].linkUrl }, () => {
                  if (data.data === "yes") {
                    this.$store.commit("SET_MODIFYPWD", true);
                  }
                });
              }
            } else {
              this.$router.push({ path: this.tagWel.value }, () => {
                if (data.data === "yes") {
                  this.$store.commit("SET_MODIFYPWD", true);
                }
              });
            }

          }
        }
      );

      this.showLoading.close();
    },

    handleLogin() {
      this.$refs.loginForm.validate((valid) => {
        if (valid) {
          /*const loading = this.$loading({
            lock: true,
            text: '登录中,请稍后。。。',
            spinner: "el-icon-loading"
          });*/
          this.showLoading = this.$loading({
            lock: true,
            text: "登录中,请稍后...",
            spinner: "el-icon-loading",
          });

          this.$store
            .dispatch("LoginByUsername", this.loginForm)
            .then((res) => {

              // this.$store.dispatch('getSystemParam').then(()=> {
              //
              //   const systemParam = this.$store.state.common.systemParam
              // })
              //console.log(res)

              this.checkLicenseRes(res).then((checkRes) => {
                if (!checkRes) {
                  this.showLoading.close();
                } else {
                  this.loginCanGo();
                  //this.showLoading.close();
                }
              });
            })
            .catch(() => {
              this.showLoading.close();
              this.refreshCode();
            });
        }
      });
    },
    // getTenant() {
    //   let domain = getTopUrl();
    //   // 临时指定域名，方便测试
    //   //domain = "https://bladex.vip";
    //   info(domain).then(res => {
    //     const data = res.data;
    //     if (data.success && data.data.tenantId) {
    //       this.tenantMode = false;
    //       this.loginForm.tenantId = data.data.tenantId;
    //       this.$parent.$refs.login.style.backgroundImage = `url(${data.data.backgroundUrl})`;
    //     }
    //   })
    // }
  },
};
</script>

<style lang="scss" scoped>
.login-form {
  margin: 10px 0;

  i {
    color: #000;
  }

  /deep/.el-form-item__content {
    width: 100%;
  }

  /deep/.el-form-item {
    margin-bottom: 20px;
  }

  /deep/.el-input {
    //font-size: 16px;

    input {
      text-indent: 5px;
      border: none;
      border-radius: 0;
      color: #000;
      background: #f0f0f0;
      height: 40px;
      line-height: 40px;

      //&::placeholder {
      //  color: #605453;
      //}
    }
    input:-webkit-autofill {
      transition: background-color 5000s ease-in-out 0s;
    }

    .el-input__prefix {
      i {
        padding: 0 5px;
        //font-size: 16px !important;
      }
    }
  }
}
.login-code {
  margin: 0 0 0 10px;
}

.login-code-img {
  margin-top: 2px;
  width: 100px;
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

.login-submit {
  width: 100%;
  background: #af2c30;
  border-color: #af2c30;
  color: #fff;
  font-size: 16px;
  border-radius: 5px;
  //padding-top: 25px;
  //padding-bottom: 25px;

  &:hover {
    //background: #e1706b;
  }
}

.loginBottom {
  margin-top: 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}
 .loginBottom a {
  font-size: 14px;
  color: #a9a9a9;
}

.loginBottom a:hover {
  color: #af2c30;
}
.login-container{
  position: relative;
}
.formBottom {
  position: absolute;
  bottom: 0.7rem;
  right: 0;
  text-align: center;
  font-size: 0.8rem;
  line-height: 1.4rem;
  color: #888888;
  margin: 0px;
  width: 100%;
}
.formBottom p {
  margin: 0px;
}
</style>
