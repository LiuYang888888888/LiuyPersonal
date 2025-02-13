<template>
  <div class="login-wrapper">
    <div class="login-container">
      <div class="left-view">&nbsp;</div>
      <div class="right-view">
        <div class="form-container">
          <h1 class="title">统一消息平台</h1>
          <div class="welcome">
            <p>欢迎登录</p>
            <p>Welcome to login</p>
          </div>
          <LoginForm/>
        </div>
      </div>
    </div>
<!--    <footer class="footer">Copyright © 2020 北京中科汇联科技股份有限公司</footer>-->
  </div>
</template>

<script>
import LoginForm from './login'
export default {
  name: 'index',
  components: {
    LoginForm
  }
}
</script>

<style lang="scss" scoped>
.login-wrapper {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  background: url('~@/assets/loginForMsg/bg.jpg') left top no-repeat;
  background-size: cover;
}
.login-container {
  flex: 1;
  display: flex;
  padding: 0 5%;
  align-items: center;
  justify-content: center;
  background: none;
}
.left-view {
  flex: 1;
  //width: 60%;
  height: 80%;
  background: url('~@/assets/loginForMsg/viewImg.png') center no-repeat;
  background-size: contain;
}
.right-view {
  min-width: 30%;
}
.form-container {
  width: 360px;
  padding-left: 40px;

  .title {
    text-align: center;
    color: #303132;
  }
  .welcome {
    margin: 20px 0;
    text-align: center;
    color: #fff;

    p{
      margin: 0;

      &:first-child {
        font-size: 1.5em;
        font-weight: 700;
      }
    }
  }
}
.footer {
  height: 32px;
  text-align: center;
  color: #fff;
  font-size: 14px;
}
</style>
