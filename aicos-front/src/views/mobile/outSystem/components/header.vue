<template>
  <van-sticky>
    <div class="top">
      <div class="header">河南省军民融合公共服务平台</div>
      <div class="out" @click="logout">退出</div>
    </div>
  </van-sticky>
</template>

<script>
import {resetRouter} from '@/router/router'
import { Dialog } from 'vant';
export default{
  data(){
    return {}
  },
  methods:{
    logout(){
      Dialog.confirm({
        title: '退出',
        message: '确认退出？',
      })
        .then(() => {
          this.$store.dispatch("LogOut").then(() => {
            resetRouter();
            window.location.href = '/aisite/#/mobile/login'
          });
        })
        .catch(() => {
          // on cancel
        });
    }
  }
}
</script>
<style scoped>
.top{
  display: flex;
}
.header{
  width: calc(100% - 50px);
  font-size: 16px;
  text-align: center;
  height: 50px;
  line-height: 50px;
  background-color: #972030;
  color: #fff;
  font-weight: 600;
  margin: 0;
  padding: 0;
}
.out{
  width: 50px;
  font-size: 14px;
  text-align: center;
  background-color: #972030;
  color: #fff;
  line-height: 50px;
}
</style>