<template>
  <div>
    <van-search v-model="value" placeholder="请输入搜索关键词" />
  </div>
</template>

<script>
import { Search } from 'vant';

export default {
  data () {
    return {
      value: '',
    }
  }
}
</script>
