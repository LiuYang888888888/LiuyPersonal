<template>
  <HuilanBasic class="toolBox" style="height: 305px;">
    <div class="sysIndexTitle">
      <div class="title">信息发布</div>
      <div class="more">
        <el-button type="danger" size="mini" class="btn-color">更多</el-button>
      </div>
    </div>
    <div class="cont-box">
      <div class="info-li" v-for="(item, index) in dataList" :key="index">
        <div class="info">
          <span>{{ item.test2 }}</span>
        </div>
<!--        <div class="dl">-->
<!--          <span>下载</span>-->
<!--        </div>-->
      </div>
    </div>
  </HuilanBasic>
</template>