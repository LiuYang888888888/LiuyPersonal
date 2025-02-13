<template>
  <el-drawer
    v-bind="$attrs"
    v-on="$listeners"
    :append-to-body="appendToBody"
    :before-close="beforeClose"
    :close-on-press-escap="closeOnPressEscap"
    :custom-class="customClass"
    :destroy-on-close="destroyOnClose"
    :modal="modal"
    :modal-append-to-body="modalAppendToBody"
    :direction="direction"
    :show-close="showClose"
    :showFull="showFull"
    :size="size"
    :wrapperClosable="wrapperClosable"
    :withHeader="withHeader"
    :menuPosition="menuPosition"
    :title="title"
    @open="open"
    @opened="opened"
    @close="close"
    @closed="closed"
    class="qsg_drawer"
  >
    <div slot="title" class="avue-crud__dialog__header">
      <span class="el-dialog__title">{{title}}</span>
      <div class="avue-crud__dialog__menu">
        <i v-if="showFull" @click="handleFullScreen" class="el-dialog__close el-icon-full-screen"></i>
      </div>
    </div>

    <el-scrollbar class="qsg_body">
      <slot></slot>
    </el-scrollbar>

    <div :class="footerClass">
      <slot name="footer"></slot>
    </div>
  </el-drawer>
</template>
<script>
export default {
  name: 'QSGDrawer',
  inheritAttrs: false,
  props: {
    title: {
      type: String,
      default: ''
    },
    fullscreen: {
      type: Boolean,
      default: false
    },
    size: {
      default: ''
    },
    showFull: {
      type: Boolean,
      default: true
    },
    wrapperClosable: {
      type: Boolean,
      default: false
    },
    appendToBody: {
      type: Boolean,
      default: true
    },
    beforeClose: {
      default: ''
    },
    closeOnPressEscap: {
      type: Boolean,
      default: true
    },
    customClass: {
      type: String,
      default: 'avue-dialog'
    },
    destroyOnClose: {
      type: Boolean,
      default: true
    },
    modal: {
      type: Boolean,
      default: true
    },
    modalAppendToBody: {
      type: Boolean,
      default: false
    },
    direction: {
      type: String,
      default: 'rtl'
    },
    showClose: {
      type: Boolean,
      default: true
    },
    withHeader: {
      type: Boolean,
      default: true
    },
    menuPosition: {
      type: String,
      default: 'right'
    },

  },
  data() {
    return {
      isFullscreen: false,
      sizeTemp: '30%',
      footerClass: "el-dialog__footer"
    }
  },
  watch: {},
  methods: {
    handleFullScreen() {
      if (this.isFullscreen) {
        this.size = this.sizeTemp;
      } else {
        this.size = '100%';
      }
      this.isFullscreen = !this.isFullscreen;
    },
    open() {
      //console.log('open')
    },
    opened() {
      //console.log('opened')
    },
    close() {
      //console.log('close')
    },
    closed() {
      //console.log('closed')
    },
    menuPositionFun() {
      switch (this.menuPosition) {
        case 'left':
          this.footerClass = 'el-dialog__footer qsg_footer_left';
          break;
        case 'center':
          this.footerClass = 'el-dialog__footer qsg_footer_center';
          break;
        case 'right':
          this.footerClass = 'el-dialog__footer qsg_footer_right';
          break;
        default:
          this.footerClass = 'el-dialog__footer qsg_footer_right';
      }
    }


  },
  mounted() {
    this.sizeTemp = this.size;
    this.menuPositionFun();
  },
}

</script>
<style lang="scss" scoped>
.qsg_drawer {
  /deep/.el-drawer__body {
    padding-bottom: 52px;
  }
  /deep/.el-scrollbar {
    //height: calc(100% - 100px);
    border-bottom: 1px solid #f0f0f0;
  }
  /deep/.el-dialog__footer {
   position: fixed;
   right: 14px;
   bottom : 0px;
   border-top: none;
   padding: 10px 0;
  }
  /deep/.qsg_footer_left {
    text-align: left;
    justify-content: flex-start;
  }

  /deep/.qsg_footer_center {
    text-align: center;
    justify-content: space-around;
  }

  /deep/.qsg_footer_right {
    text-align: right;
    justify-content: flex-end;
  }
  /deep/.el-card__body {
    position: relative;
  }
}


</style>
