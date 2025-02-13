<template>
  <div class="error-page">
    <div class="img"
         :style="style"></div>
    <div class="content">
      <h1>500</h1>
      <div class="desc">抱歉，服务器出错了</div>
      <div class="actions">
        <router-link :to="{path:'/'}">
          <el-button type="primary">返回首页</el-button>
        </router-link>
      </div>
    </div>
  </div>
</template>

<script>
const baseUrl = process.env.BASE_URL;
export default {
  name: "error-500",
  data() {
    return {
      style: `background-image: url('${baseUrl}img/bg/500.svg');`
    }
  }
};
</script>
<style lang="scss" scoped>
@import "./style.scss";
</style>
