<template>
  <HuilanBasic class="toolBox">
    <div class="sysIndexTitle">
      <div class="title">待办事项</div>
    </div>
    <div class="cont-box">
      <div class="infoLi" v-for="(item, index) in dataList" :key="index">
        <p class="infoText" v-if="itemtype_value">{{item.test1}}</p>
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
      
    };
  },
  props:{
    dataList: Array,
  },
  created() {
    
  },
  methods:{

  }
};
</script>

<style scoped lang="scss">
/deep/.basic-main{
  padding: 18px !important;
  margin: 10px !important;
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
