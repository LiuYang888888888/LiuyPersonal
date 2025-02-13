<template>
  <div class="aiosLogin">
    <div class="loginTop">
      <a href=""><img :src="companyLogo" alt="logo" /></a>
      <div class="loginTopRight">
        <a href=""><img :src="backIndex" alt="返回首页">返回首页</a>
      </div>
    </div>
    <div class="login-wrapper">
      <div class="companyLogo">
        <div class="logoTop">

        </div>
        <div class="logoBottom">
          <p class="welcome1">您好，欢迎登录</p>
          <p class="welcome2">军民融合后台管理系统!</p>
        </div>
      </div>
      <div class="login-container">
        <div class="form-container">
          <h1 class="title">
            军民融合后台管理系统
          </h1>
          <p class="loginTitle"><span>用户登录</span></p>
          <!--        <div class="welcome">-->
          <!--          <p>欢迎登录</p>-->
          <!--          <p>Welcome to login</p>-->
          <!--        </div>-->
          <LoginForm />
        </div>
      </div>
    </div>
<!--    <div class="loginFooter">-->
<!--      <p>豫公网安备 43010202001356号 豫ICP备19010878号-1</p>-->
<!--    </div>-->
  </div>

  <!--  <footer class="footer">Copyright © 2020 - 2023 Huilan Technology.All Rights Reserved</footer>-->
</template>

<script>
import LoginForm from "./login";
const baseUrl = process.env.BASE_URL;
export default {
  name: "index",
  components: {
    LoginForm,
  },
  data() {
    return {
      logoUrl: `${baseUrl}img/newLogo.png`,
      companyLogo: `${baseUrl}img/JMLogo.png`,
      backIndex:`${baseUrl}img/home.png`
    };
  },
};
</script>

<style lang="scss" scoped>
.aiosLogin{
  height:100%;
}
.loginTop {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.loginTop {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 2rem;
  height: 5rem;
}

.loginTop .loginTopRight {
}


.loginTop .loginTopRight>a>img {
  width: 1rem;
  height: 1rem;
}

.loginTop .loginTopRight>a {
  font-size: 0.9rem;
  display: flex;
  align-items: center;
}

.loginTop>a>img {
  width: 32rem;
}

.loginTop .loginTopRight>a:hover {
  color: #af2c30;
}
.loginFooter p {
  margin: 0;
  padding: 0;
  text-align: center;
  font-size: 0.9rem;
  height: 30px;
  line-height: 30px;
  color: #666;
}
.login-wrapper {
  display: flex;
  width: 100%;
  height: calc(100% - 5rem);
}
.login-container {
  width: 500px;
  height: 100%;
  padding:40px 60px ;
  box-sizing: border-box;
  position: relative;
}
.logoTop {
  padding: 80px 0 140px 80px;
  display: flex;
  align-items: center;
}

.logoBottom {
  padding-left: 80px;
}

.logoBottom p.welcome1 {
  font-size: 30px;
  color: #fff;
  margin: 0;
  margin-bottom: 10px;
}

.logoBottom p.welcome2 {
  font-size: 40px;
  font-weight: bold;
  color: #fff;
  margin: 0;
}
p.loginTitle {
  border-bottom: 1px solid #eee;
  text-align: center;
  height: 40px;
  line-height: 40px;
  margin: 0px;
  margin-bottom: 30px;
}
p.loginTitle span {
  display: inline-block;
  font-size: 1rem;
  border-bottom: 4px solid #af2c30;
  line-height: 39px;
  color: #af2c30;
}
.companyLogo {
  width: calc(100% - 500px);
  box-sizing: border-box;
  background: url("~@/assets/aioslogin/loginBack.jpg") center no-repeat;
  background-size: cover;
}
.companyLogo img {
  width: 50px;
  margin-right: 15px;
}
.companyLogo span{
  font-size: 34px;
  font-weight: bold;
  color: #fff;
}
//.left-view {
//  flex: 1;
//  //width: 60%;
//  height: 80%;
//  background: url('/img/aioslogin/viewImg.png') center no-repeat;
//  background-size: contain;
//}
//.right-view {
//  min-width: 30%;
//}
.form-container {
  .title {
    text-align: center;
    color: #303132;
    margin: 0 0 1rem 0;
    font-size: 1.6rem;
    img {

    }
  }
  .welcome {
    margin: 20px 0;
    text-align: center;
    color: #fff;

    p {
      margin: 0;

      &:first-child {
        font-size: 1.5em;
        font-weight: 700;
      }
    }
  }
}
.footer {
  height: 50px;
  text-align: center;
  color: #b7b7b7;
  font-size: 12px;
}
</style>
