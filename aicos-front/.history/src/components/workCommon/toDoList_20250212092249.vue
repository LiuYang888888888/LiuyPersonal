<template>
  <HuilanBasic class="toolBox">
    <div class="sysIndexTitle">
      <div class="title">待办事项</div>
    </div>
    <div class="tabs">
      <el-tabs v-model="activeName" type="card" @tab-click="handleClick">
        <!-- <el-tab-pane label="全部" name="all"></el-tab-pane> -->
        <el-tab-pane :label="item.title" :name="item.title" v-for="(item, index) in readyList" :key="index"></el-tab-pane>
      </el-tabs>
    </div>
    <div class="cont-box">
      <div class="infoLi" v-for="(item, index) in infoList" :key="index">
        <p class="infoText">{{ getTaskStatus(item.type_value) }}</p>
        <p class="infoNum">{{ item.type_num }}</p>
      </div>
    </div>
  </HuilanBasic>
</template>

<script>
export default {
  name: "indexTools",
  data() {
    return {
      activeName: this.getDefaultActiveName(),
      infoList: this.getDefaultInfoList(),
    };
  },
  props: {
    dataList: Array,
    readyList: Array,
  },
  created() {
  },
  methods: {
    handleClick(tab) {
      this.readyList.forEach((item,i)=>{
        if(item.title == tab.label){
          this.infoList = this.dataList[i]
        }
      })
      this.$emit('childEvent', tab.label)
    },
    getDefaultActiveName() {
      return this.readyList.length > 0 ? this.readyList[0].title : '';
    },
    getDefaultInfoList() {
      return this.dataList.length > 0 ? this.dataList[0] : [];
    }
  },
  computed: {
    tabMap() {
      return this.readyList.reduce((acc, item, index) => {
        acc[item.title] = this.dataList[index];
        return acc;
      }, {});
    },
    getTaskStatus() {
      return function(typeValue) {
        switch (typeValue) {
          case 'num1':
          case 'num4':
          case 'num11':
          case 'num21':
          case 'num31':
            return '待审核';
          case 'num2':
          case 'num5':
          case 'num12':
          case 'num22':
            return '已驳回';
          case 'num3':
          case 'num6':
          case 'num13':
          case 'num23':
            return '已通过';
          default:
            return '';
        }
      };
    }
  }
};
</script>

<style scoped lang="scss">
::v-deep .basic-main {
  padding: 18px !important;
  margin: 10px !important;
}
.tabs {
  margin: 20px 0;
}
.toolBox {
  width: 100%;
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
    p.infoText {
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