<template>
  <div>
    <van-field
      v-model="message"
      rows="2"
      autosize
      label="审核意见"
      type="textarea"
      maxlength="50"
      placeholder="请输入审核意见"
      show-word-limit
    />
  </div>
</template>

<script lang="ts">
export default{
  data(){
    return {

    }
  }
}
</script>
