<template>
  <HuilanBasic class="toolBox" style="height: 305px;">
    <div class="sysIndexTitle">
      <div class="title">文件下载</div>
    </div>
    <div class="cont-box">
      <div class="info-li" v-for="(item, index) in dataList" :key="index">
        <div class="info">
          <span>{{ item.zizmc }}</span>
        </div>
        <div class="dl">
          <span @click="downloadBtn(item)">下载</span>
        </div>
      </div>
    </div>
  </HuilanBasic>
</template>

<script>
import {getListDataMl} from "@/api/outSystem/agency";
import {baseURL} from "@/api/common";

export default {
  name: "indexTools",
  data() {
    return {
      dataList: [],
    };
  },
  created() {
    this.getDownloadList()
  },
  methods:{
    downloadBtn(row){
      var s1 = row.fuj
      var s2 = s1.substring(1);
      const http = window.location.protocol + "//"
      const url = window.location.host
      const url2 = http + url + `${baseURL}` + s2
      window.open(url2,'_self')
    },
    getDownloadList(){
      const dataParam = {
        reqPage: {current: 1, size: 5}, searchParam: {}
      };
      getListDataMl(dataParam).then((res)=>{
        this.dataList = res.data.data.fieldList
      })
        .catch((res)=>{
          this.$message({
            type:'error',
            message:res.msg
          })
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
      padding: 10px 0  12px 0;
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
