<template>
  <el-form class="login-form"
           status-icon
           :rules="loginRules"
           ref="loginForm"
           :model="loginForm"
           label-width="0">
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
      <el-input size="small"
                @keyup.enter.native="handleLogin"
                v-model="loginForm.username"
                auto-complete="off"
                :placeholder="$t('login.username')">
        <i slot="prefix" class="icon-yonghu"/>
      </el-input>
    </el-form-item>
    <el-form-item prop="password">
      <el-input size="small"
                @keyup.enter.native="handleLogin"
                :type="passwordType"
                v-model="loginForm.password"
                auto-complete="off"
                :placeholder="$t('login.password')">
        <i class="el-icon-view el-input__icon" slot="suffix" @click="showPassword"/>
        <i slot="prefix" class="icon-mima"/>
      </el-input>
    </el-form-item>
    <el-form-item v-if="this.website.captchaMode" prop="validateValue">
      <el-row :span="24">
        <el-col :span="16">
          <el-input size="small"
                    @keyup.enter.native="handleLogin"
                    v-model="loginForm.validateValue"
                    auto-complete="off"
                    :placeholder="$t('login.code')">
            <i slot="prefix" class="icon-yanzhengma"/>
          </el-input>
        </el-col>
        <el-col :span="8">
          <div class="login-code">
            <img :src="loginForm.image" class="login-code-img" @click="refreshCode"
            />
          </div>
        </el-col>
      </el-row>
    </el-form-item>
    <el-form-item>
      <el-button type="primary"
                 size="small"
                 @click.native.prevent="handleLogin"
                 class="login-submit">{{$t('login.submit')}}
      </el-button>
    </el-form-item>
  </el-form>
</template>

<script>
import {mapGetters} from "vuex";
// import {info} from "@/api/system/tenant";
import {getCaptcha} from "@/api/user";
// import {getTopUrl} from "@/util/util";

export default {
  name: "userlogin",
  data() {
    return {
      tenantMode: this.website.tenantMode,
      loginForm: {
        //租户ID
        // tenantId: "000000",
        //用户名
        username: "admin",
        //密码
        password: "123456",
        //账号类型
        type: "account",
        //验证码的值
        validateValue: "",
        //验证码的索引
        validateKey: "",
        //预加载白色背景
        image: "data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7",
      },
      loginRules: {
        // tenantId: [
        //   {required: false, message: "请输入租户ID", trigger: "blur"}
        // ],
        username: [
          {required: true, message: "请输入用户名", trigger: "blur"}
        ],
        password: [
          {required: true, message: "请输入密码", trigger: "blur"},
          {min: 1, message: "密码长度最少为6位", trigger: "blur"}
        ]
      },
      passwordType: "password",
      refreshCodeTimer: ''
    };
  },
  created() {
    // this.getTenant();
    this.refreshCode();
  },
  mounted() {
  },
  beforeDestroy() {
    clearTimeout(this.refreshCodeTimer)
  },
  computed: {
    ...mapGetters(["tagWel"])
  },
  props: [],
  methods: {
    refreshCode() {
      getCaptcha().then(res => {
        const data = res.data.data;
        this.loginForm.validateKey = data.key;
        this.loginForm.image = data.image;

        // 定时去后台获取新的验证码
        this.refreshCodeTimer = setTimeout(()=> {
          this.refreshCode();
        }, 50000)
      })
    },
    showPassword() {
      this.passwordType === ""
        ? (this.passwordType = "password")
        : (this.passwordType = "");
    },
    handleLogin() {
      this.$refs.loginForm.validate(valid => {
        if (valid) {
          const loading = this.$loading({
            lock: true,
            text: '登录中,请稍后。。。',
            spinner: "el-icon-loading"
          });
          this.$store.dispatch("LoginByUsername", this.loginForm).then(() => {
            // this.$store.dispatch('getSystemParam').then(()=> {
            //
            //   const systemParam = this.$store.state.common.systemParam
            // })
            this.$router.$avueRouter.formatRoutes(this.$store.state.user.menuAll, true);
            this.$router.push({path: this.tagWel.value});
            loading.close();
          }).catch(() => {
            loading.close();
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
  }
};
</script>

<style>
</style>
