<template>
  <div style="margin-top: ;">
    <van-field
      v-model="formVerifyText"
      rows="2"
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
