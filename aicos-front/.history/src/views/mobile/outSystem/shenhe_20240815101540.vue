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

    <div style="margin-top: 40px;width: 100%;display: flex;justify-content: space-around;">
      <van-button type="danger" >审核通过</van-button>
      <van-button type="warning">审核不通过</van-button>
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