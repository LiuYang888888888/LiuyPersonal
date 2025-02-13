<template>
  <HuilanBasic class="toolBox">
    <div class="sysIndexTitle">
      <div class="title">留言回复</div>
    </div>
    <div class="cont-box">
      <div class="info-li" v-for="(item, index) in dataList" :key="index">
        <el-card class="box-card" shadow="always">
          <div class="infoTop">
            <p class="infoTitle">
              {{ item.title }}
              <span class="hs" v-if="item.status == 1">已办理</span>
              <span class="dhs" v-if="item.status == 0">未办理</span>
            </p>
          </div>
          <div class="infoMid">
            <p class="infoMidName infotext">
              用户：{{ item.userName }}
            </p>
            <p class="infoMidId infotext">
              留言ID：{{ item.id }}
            </p>
            <p class="infoTime infotext">
              {{ item.time }}
            </p>
          </div>
          <div class="infoBottom">
            <p class="content">
              {{ item.content }}
              <span>[查看全文]</span>
            </p>
          </div>
        </el-card>
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
          id: 1926584125,
          title: "积极创造好营商环境（希望开设临时停车位）",
          userName: "王**",
          time: "2024-07-23",
          content:"尊敬的领导您好，我是咱们贾汪区老矿街道的一家商铺，在这个地方已经开店两年了，希望增加临时停车位。",
          status:1,
        },
        {
          id: 192658455,
          title:"科小政策",
          userName: "李四",
          time: "2024-05-17",
          content:"河北省科技型中小企业申请的具体流程以及申办企业后是否有政府补贴的相关政策。",
          status:0,
        },
        {
          id: 1926584785,
          title:"国际科技合作基地认定",
          userName: "张三",
          time: "2024-05-17",
          content:"2024年河北省国际科技合作示范企业名单是什么时间认定下来的？求具体认定名单下发时间。",
          status:0,
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
  .info-li{
    border-bottom: 1px dashed #ebebeb;
    padding-bottom: 12px;
    .infoTop {
      display: flex;
      justify-content: space-between;
      align-items: center;
      .infoTitle {
        font-size: 20px;
        font-weight: bold;
        color: #333;
        margin: 0;
        .hs {
          font-weight: normal;
          background: #af2c30;
          color: #fff;
          font-size: 13px;
          padding: 3px 12px;
          border-radius: 15px;
          margin-left: 12px;
          display: inline-block;
          text-align: center;
        }

        .dhs {
          font-weight: normal;
          background: #bebebe;
          color: #fff;
          font-size: 13px;
          padding: 3px 12px;
          border-radius: 15px;
          margin-left: 12px;
          display: inline-block;
          text-align: center;
        }
      }
      .infoTime {
        .time {
          color: #af2c30;
        }
      }
    }
    .infoMid{
      display: flex;
      .infotext{
        height: 30px;
        line-height: 30px;
      }
      .infoMidName{
        font-size: 16px;
        font-weight: 600;
      }
      .infoMidId{
        margin-left: 20px;
      }
      .infoTime{
        margin-left: 20px;
        color: #af2c30;
      }
    }
    .infoBottom {
      .content{
        margin: 0;
        span{
          color: #af2c30;
        }
      }
    }
  }
}
.box-card{
  margin-top: 20px;
}
</style>
