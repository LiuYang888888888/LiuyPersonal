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

<script>
export default {
  name: "indexTools",
  data() {
    return {
      dataList: [
        {
          test1: 1,
          test2: "河南省人民政府办公厅关于2024年中秋节放假安排的通知",
          test3: "2024-07-23",
        },
        {
          test1: 0,
          test2:
            "关于2024年上半年省重点民生实事进展情况的通报 关于开展涉及不平等对",
          test3: "2024-05-17",
        },
        {
          test1: 0,
          test2: "关于开展涉及不平等对待企业法律法规政策清理工作的公告",
          test3: "2024-05-17",
        },
        {
          test1: 0,
          test2: "河南省人民政府办公厅关于2024年端午节放假安排的通知",
          test3: "2024-04-30",
        },
        {
          test1: 0,
          test2: "河南省人民政府办公厅关于2024年度公开遵选公务员考察公告",
          test3: "2024-04-13",
        },
      ],
    };
  },
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
    border-bottom: 1px dashed #ebebeb;
    &:first-child {
      padding-top: 0px;
    }
    .tag {
      width: 73px;
      span {
        color: #fff;
        font-size: 13px;
        padding: 3px 5px;
        border-radius: 5px;
        margin-right: 6px;
        display: inline-block;
        width: 100%;
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
      flex: 1;
      padding: 7px 0  12px 0;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      position: relative;
      padding-left: 20px;
      &::before {
        content: "";
        display: inline-block;
        width: 5px;
        height: 5px;
        background: #000;
        border-radius: 50%;
        position: absolute;
        left: 0;
        top: 50%;
        margin-top: -3px;
      }
    }
    .dl {
      display: flex;
      justify-content: center;
      align-items: center;
      span {
        color: #af2c30;
        cursor: pointer;
      }
    }
  }
}
</style>
