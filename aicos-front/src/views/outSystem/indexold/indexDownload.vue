<template>
  <div class="boxDownload">
    <div class="sysIndexTitle">
      <p>
        <span>文件下载</span>
      </p>
    </div>
    <div class="downloadList">
      <div class="downloadLi" v-for="(item,index) in downloadList">
        <span>{{item.zizmc}}</span>
        <span @click="downloadBtn(item)">文件下载</span>
      </div>
    </div>
  </div>
</template>

<script>
import {getListDataMl} from "@/api/outSystem/agency"
import {baseURL} from '@/api/common';
export default {
  data () {
    return{
      downloadList:[]
    }
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
      reqPage: {current: 1, size: 6}, searchParam: {}
      };
      getListDataMl(dataParam).then((res)=>{
        //console.log("res",res.data.data.fieldList)
        this.downloadList = res.data.data.fieldList
      })
        .catch((res)=>{
          this.$message({
            type:'error',
            message:res.msg
          })
        })
    }
  },
  created(){
    //获取文件下载列表
    this.getDownloadList()
  }
}
</script>

<style scoped lang="scss">
.sysIndexTitle {
  border-bottom: 1px solid #e0e0e0;
}

.sysIndexTitle p {
  margin: 0;
  height: 2rem;
  line-height: 2rem;
}

.sysIndexTitle p span {
  border-bottom: 4px solid #af2c30;
  display: inline-block;
  font-weight: bold;
}

.downloadList {
  margin-top: 1rem;
}

.downloadList .downloadLi {
  height: 3rem;
  line-height: 3rem;
  border-bottom: 1px #e5e5e5 dashed;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.downloadList .downloadLi span:last-child {
  cursor: pointer;
}

.downloadList .downloadLi span:last-child:hover {
  color: #af2c30;
}
</style>
