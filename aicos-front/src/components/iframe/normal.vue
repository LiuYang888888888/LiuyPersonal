<template>
<!--  <basic-container>-->
    <iframe
      :src="src"
      class="iframe"
      ref="iframe"
      @load="hide"
    ></iframe>
<!--  </basic-container>-->
</template>

<script>
// import {mapGetters} from "vuex";
import NProgress from "nprogress"; // progress bar
import "nprogress/nprogress.css"; // progress bar style
export default {
  name: "NormalIframe",
  props: ['src'],
  // inject: ['desktopWindow'],
  data() {
    return {
      // urlPath: ''
    };
  },
  created() {
    NProgress.configure({showSpinner: false});
  },
  mounted() {
    this.load();
    // this.resize();
  },
  methods: {
    // 显示等待框
    show() {
      NProgress.start();
    },
    // 隐藏等待狂
    hide() {
      NProgress.done();
    },
    // 加载浏览器窗口变化自适应
    // resize() {
    //   window.onresize = () => {
    //     this.iframeInit();
    //   };
    // },
    // 加载组件
    load() {
      this.show();

      //超时3s自动隐藏等待狂，加强用户体验
      let time = 3;
      const timeFunc = setInterval(() => {
        time--;
        if (time === 0) {
          this.hide();
          clearInterval(timeFunc);
        }
      }, 1000);
      this.iframeInit();
    },
    //iframe窗口初始化
    iframeInit() {
      // const iframe = this.$refs.iframe;
      // if(!this.desktopWindow) {
      //   debugger
      //   const clientHeight = document.documentElement.clientHeight - (screen > 1 ? 200 : 130);
      //   if (!iframe) return;
      //   iframe.style.height = `${clientHeight}px`;
      // }
      // if (iframe.attachEvent) {
      //   iframe.attachEvent("onload", () => {
      //     this.hide();
      //   });
      // } else {
      //   iframe.onload = () => {
      //     this.hide();
      //   };
      // }
    }
  }
};
</script>

<style lang="scss">
.iframe {
  width: 100%;
  height: 100%;
  border: 0;
  overflow: hidden;
  box-sizing: border-box;
}
</style>
