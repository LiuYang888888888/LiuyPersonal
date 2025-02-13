<template>
  <div>
    <van-search v-model="value" placeholder="请输入机构名称" />
    <van-search v-model="value" placeholder="请选择行政区划" />
    <van-search v-model="value" placeholder="请选择审核状态" />
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
