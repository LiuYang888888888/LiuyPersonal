<template>
  <div style="margin-top: 100px;">
    <van-field
      v-model="formVerifyText"
      rows="5"
      autosize
      label="审核意见"
      type="textarea"
      maxlength="300"
      placeholder="请输入审核意见"
      show-word-limit
    />

    <div style="margin-top: 40px;width: 100%;display: flex;justify-content: space-around;">
      <van-button round  type="danger" style="width: 40%;" @click="dataMagVerifyYes">审核通过</van-button>
      <van-button round  type="warning" style="width: 40%;" @click="dataMagVerifyNo">审核不通过</van-button>
    </div>
  </div>
</template>

<script>

export default{
  data(){
    return {
      formVerifyText:''
    }
  },
  created () {
    this.onLoad()
  },
  methods: {
    onLoad () {
      this.formVerifyText = ''
    },
    dataMagVerifyYes(){
      this.btnLoading = true;
      const params = new URLSearchParams();
      params.append("id",this.dataFormId);
      params.append("processReason",this.formVerifyText);
      auditListData(params).then(() => {
       this.btnLoading = false;
      })
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