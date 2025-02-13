<template>
  <div style="margin-top: 100px;">
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

    <div>
      <van-button type="warning">审核通过</van-button>
      <van-button type="danger">危险按钮</van-button>
    </div>
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

<style>

html,body,#app{
  height: 100%;
  background-color: #F7F7F7;
}
</style>