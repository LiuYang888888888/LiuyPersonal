<template>
  <div>
    <van-search v-model="value" placeholder="请输入机构名称" />
  </div>
</template>

<script>

export default {
  data () {
    return {
      value: '',
    }
  }
}
</script>
