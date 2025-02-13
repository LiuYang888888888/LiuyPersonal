<template>
  <div class="error-page">
    <div class="img"
         :style="style"></div>
    <div class="content">
      <h1>403</h1>
      <div class="desc">抱歉，你无权访问该页面</div>
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
  name: "error-403",
  data() {
    return {
      style:`background-image: url('${baseUrl}img/bg/403.svg')`
    }
  }
};
</script>
<style lang="scss" scoped>
@import "./style.scss";
</style>
