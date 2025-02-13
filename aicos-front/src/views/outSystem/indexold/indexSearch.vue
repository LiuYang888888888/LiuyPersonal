<template>
  <div class="sysIndexTop">
    <img class="logo" src="~@/assets/outSystem/logo.png" alt="logo">
    <div class="searchBox">
      <input type="text" placeholder="请输入搜索关键词...">
      <button>搜索</button>
    </div>
  </div>
</template>

<script>

</script>

<style scoped lang="scss">
.searchBox {
  display: flex;
  align-items: center;
  input {
    width: 280px;
    height: 40px;
    line-height: 40px;
    margin: 0;
    border: 0;
    border-radius: 5px 0 0 5px;
    padding-left: 15px;
    box-sizing: border-box;
  }
  button {
    width: 80px;
    display: inline-block;
    height: 40px;
    line-height: 40px;
    border: 0;
    margin: 0;
    border-radius: 0 5px 5px 0;
    background: #ad2e34;
    color: #fff;
  }
}
</style>
