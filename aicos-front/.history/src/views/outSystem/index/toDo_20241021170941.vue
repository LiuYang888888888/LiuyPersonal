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
       
      ],
    };
  },
  created() {
    this.getMessageList()
  },
  methods:{
    getMessageList(){
      getInfoList().then(res=>{
        this.dataList = res.data
      })
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
