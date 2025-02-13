<template>
  <div>
    <van-search v-model="options.jigmc" placeholder="请输入机构名称" />
    <van-search v-model="options.xingzqhdm" placeholder="请选择行政区划" />
    <van-search v-model="options.zhuangt" placeholder="请选择审核状态" />

    <van-button color="#af2c30 ">搜索</van-button>
    <van-button color="#7232dd" plain>清空</van-button>
  </div>
</template>

<script>

export default {
  data () {
    return {
      options:{
        
      }
    }
  }
}
</script>
