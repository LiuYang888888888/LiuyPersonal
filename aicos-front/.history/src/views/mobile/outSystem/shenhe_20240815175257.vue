<template>
  <div>
    <Header />
    <div>

    </div>
  </div>
</template>

<script>
import { Toast } from 'vant';
import {
  auditListData,
  auditNoListData,
} from "@/api/outSystem/agency";

export default{
  data(){
    return {
      id:'',
      formVerifyText:'',
      btnLoading:false,
    }
  },
  created () {
    this.onLoad()
  },
  methods: {
    onLoad () {
      this.id = this.$route.query.id
    },
    dataMagVerifyYes(){
      this.btnLoading = true;
      const params = new URLSearchParams();
      params.append("id",this.id);
      params.append("processReason",this.formVerifyText);
      auditListData(params).then(() => {
        Toast.success('操作成功！');
        this.btnLoading = false;
        this.formVerifyText = ''
        this.$router.go(-1)
      },(error) => {
        window.console.log(error);
      })
    },
    dataMagVerifyNo(){
      this.btnLoading = true;
      const params = new URLSearchParams();
      params.append("id",this.id);
      params.append("processReason",this.formVerifyText);
      auditNoListData(params).then(() => {
        Toast.success('操作成功！');
        this.btnLoading = false;
        this.formVerifyText = ''
        this.$router.go(-1)
      },(error) => {
        window.console.log(error);
      })
    },
    //关闭
    close(){
      this.$router.go(-1)
    }
  }
}
</script>

<style>

html,body,#app{
  height: 100%;
  background-color: #F7F7F7;
}
</style>