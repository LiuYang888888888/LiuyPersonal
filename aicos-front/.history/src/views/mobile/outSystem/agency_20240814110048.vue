<template>
  <div>
    <van-search v-model="options.jigmc" placeholder="请输入机构名称" />
    <van-search v-model="options.xingzqhdm" placeholder="请选择行政区划" />
    <van-search v-model="options.zhuangt" placeholder="请选择审核状态" />
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
