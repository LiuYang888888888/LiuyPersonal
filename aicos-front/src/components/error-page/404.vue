<template>
  <div class="error-page">
    <div class="img"
         :style="style"></div>
    <div class="content">
      <h1>404</h1>
      <div class="desc">抱歉，你访问的页面不存在</div>
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
  name: "error-404",
  data() {
    return {
      style: `background-image: url('${baseUrl}img/bg/404.svg');`
    }
  }
};
</script>
<style lang="scss" scoped>
@import "./style.scss";
</style>
