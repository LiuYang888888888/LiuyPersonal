<template>
  <HuilanBasic class="toolBox" style="height: 305px;">
    <div class="sysIndexTitle">
      <div class="title">消息通知</div>
      <div class="more">
        <el-button type="danger" size="mini" class="btn-color" @click="goToMore">更多</el-button>
      </div>
    </div>
    <div class="cont-box">
      <div v-if="dataList.length>0" class="info-li" v-for="(item, index) in dataList" :key="index">
        <div class="icon">
          <img :src="logoUrl" alt="" class="info-logo">
        </div>
        <div class="info">
          <span>{{ item.title }}</span>
        </div>
        <div class="tag">
          <span class="dhs" v-if="item.status == 2">已读</span>
          <span class="hs" v-if="item.status == 1">未读</span>
        </div>
        <div class="time">
          <span>{{ item.updateTime.substring(0,10) }}</span>
        </div>
      </div>
      <div v-if="dataList.length<=0" style="text-align: center;">
        <img style="width: 200px;height: auto;" src="@/assets/outSystem/noMessage.png" alt="暂无消息">
      </div>
    </div>
  </HuilanBasic>
</template>

<script>
const baseUrl = process.env.BASE_URL;
import {getListPageByMessageParam} from "@/api/mywork/myMessage";

export default {
  name: "indexTools",
  data() {
    return {
      dataList: [],
      logoUrl: `${baseUrl}img/bg/img-logo.png`,
    };
  },
  created() {
    this.getMessageList()
  },
  methods:{
    goToMore(){
      this.$router.push('/info/index')
    },
    getMessageList(){
      const param = {
        current: 1,
        size: 5,
      }
      getListPageByMessageParam(param).then(res => {
        const data = res.data.data;
        this.dataList = data.records;
      });
    }
  }
};
</script>

<style scoped lang="scss">
/deep/.basic-main{
  padding: 18px !important;
  margin: 10px !important;
}
.sysIndexTitle {
  display: flex;
  .title {
    flex: 1;
    font-size: 18px;
    font-weight: bold;
    color: #000;
  }
  .btn-color {
    background: #af2c30;
    border: 1px solid #af2c30;
  }
}

.cont-box {
  margin-top: 10px;
  .info-li {
    display: flex;
    padding: 10px 0;
    border-bottom: 1px dashed #ebebeb;
    &:first-child {
      padding-top: 0px;
    }
    .tag {
      flex: 1;
      padding: 0 10px;
      span {
        width: 60px;
        color: #fff;
        font-size: 13px;
        padding: 3px 5px;
        border-radius: 15px;
        margin-right: 6px;
        display: inline-block;
        text-align: center;
      }
      span.js {
        background: #d47824;
      }
      span.hs {
        background: #bebebe;
      }
      span.dhs {
        background: #af2c30;
      }
    }
    .info {
      padding: 0 10px;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      position: relative;
      padding-left: 20px;
      /
    }
    .time {
      display: flex;
      justify-content: center;
      align-items: center;
      span {
        color: #af2c30;
        display: inline-block;
        width: 90px;
      }
    }
  }
}
</style>
