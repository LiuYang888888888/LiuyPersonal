<template>
  <div style="margin-top: 40px;">
    <van-field
      v-model="formVerifyText"
      rows="5"
      autosize
      label="审核意见"
      type="textarea"
      maxlength="300"
      placeholder="请输入审核意见"
      show-word-limit
    />
  </div>
</template>

<script lang="ts">
export default{
  data(){
    return {
      formVerifyText:''
    }
  }
}
</script>

<style scoped>

html,body,#app{
  height: 100%;
  background-color: #F7F7FA;
}
</style>