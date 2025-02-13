<template>
  <HuilanBasic class="toolBox" style="height: 305px;">
    <div class="sysIndexTitle">
      <div class="title">待办事项</div>
<!--      <div class="more">-->
<!--        <el-button type="danger" size="mini" class="btn-color">更多</el-button>-->
<!--      </div>-->
    </div>
    <div class="cont-box">
      <div class="infoLi" v-for="(item, index) in dataList" :key="index">
        <p class="infoText">{{item.test1}}</p>
        <p class="infoNum">{{item.test2}}</p>
      </div>
    </div>
  </HuilanBasic>
</template>

<script>
import {getInfoList} from "@/api/outSystem/index";
export default {
  name: "indexTools",
  data() {
    return {
      dataList: [
        {
          test1: "公车申请",
          test2: "66",
          test3: "08-20",
        },
        {
          test1: "会议室申请",
          test2: "127",
          test3: "08-20",
        },
        {
          test1: "办公用品申请",
          test2: "11",
          test3: "08-20",
        },
        {
          test1: "留言回复",
          test2: "9",
          test3: "08-20",
        },
        {
          test1: "待审批",
          test2: "87",
          test3: "08-20",
        },
        {
          test1: "已审批",
          test2: "7",
          test3: "08-20",
        },{
          test1: "发布需求",
          test2: "8",
          test3: "08-20",
        },{
          test1: "供应信息",
          test2: "32",
          test3: "08-20",
        },
      ],
    };
  },
  created() {
    this.getMessageList()
  },
  methods:{
    getMessageList
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
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  flex-wrap: wrap;
  .infoLi {
    width: 25%;

    p.infoNum {
      font-size: 20px;
      font-weight: bold;
      color: #333;
    }
  }
}
</style>
