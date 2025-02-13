// avue 的upload组件添加上传标识，当在调用ajax的时候把超时时间改为0
export default {
  install(Vue) {
    Vue.mixin({
      created() {
        if(this.$options.name == 'avue-upload') {
          const oldHttpRequest = this.httpRequest;
          this.httpRequest = (config)=>{
            this.headers.HuilanAvueUploadFlag = true
            oldHttpRequest.call(this, config);
          }
        }
      }
    })
  }
}
