<template>
  <HuilanBasic class="toolBox">
    <div class="sysIndexTitle">
      <div class="title">待办事项</div>
    </div>
    <div class="tabs">
      <el-tabs v-model="activeName" type="card" @tab-click="handleClick">
        <!-- <el-tab-pane label="全部" name="all"></el-tab-pane> -->
        <el-tab-pane :label="item.title" :name="item.title" v-for="(item,index) in readyList" :key="index"></el-tab-pane>
      </el-tabs>
    </div>
    <div class="cont-box">
      <div class="infoLi" v-for="(item, index) in infoList" :key="index">
        <p class="infoText" v-if="item.type_value == 'num1' || item.type_value == 'num4'">待审核</p>
        <p class="infoText" v-if="item.type_value == 'num2' || item.type_value == 'num5'">已驳回</p>
        <p class="infoText" v-if="item.type_value == 'num3' || item.type_value == 'nu'">已通过</p>
        <p class="infoNum">{{item.type_num}}</p>
      </div>
    </div>
  </HuilanBasic>
  
</template>
<script>
export default {
  name: "indexTools",
  data() {
    return {
      activeName:this.readyList[0].title,
      infoList:this.dataList[0],
    };
  },
  props:{
    dataList: Array,
    readyList:Array,
  },
  created() {
  },
  methods:{
    handleClick(tab) {
      this.readyList.forEach((item,i)=>{
        if(item.title == tab.label){
          this.infoList = this.dataList[i]
        }
      })
      this.$emit('childEvent', tab.label)
    }
  }
};
</script>

<style scoped lang="scss">
/deep/.basic-main{
  padding: 18px !important;
  margin: 10px !important;
}
.tabs{
  margin: 20px 0;
}
.toolBox{
  width:100%;
  height: auto;
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
    width: 20%;
    p.infoText{
      text-align: center;
    }
    p.infoNum {
      font-size: 20px;
      font-weight: bold;
      color: #af2c30;
      text-align: center;
    }
  }
}
</style>
