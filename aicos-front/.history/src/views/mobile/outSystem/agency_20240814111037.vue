<template>
  <div>
    <van-search v-model="options.jigmc" placeholder="请输入机构名称" />
    <van-search v-model="options.xingzqhdm" placeholder="请选择行政区划" />
    <van-search v-model="options.zhuangt" placeholder="请选择审核状态" />
    <div style="width: 100%;text-align: center;">
      <van-button color="#af2c30">搜索</van-button>
      <van-button plain>清空</van-button>
    </div>

    <van-list
      v-model="loading"
      :finished="finished"
      finished-text="没有更多了"
      @load="onLoad"
    >
      <van-cell v-for="item in list" :key="item" :title="item" />
    </van-list>
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
