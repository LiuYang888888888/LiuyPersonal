<template>
  <div class="huilan-basic" :class="hasTab ? 'hasTab' : ''">
    <div v-if="leftWidth" class="basic-left">
      <div ref="left" class="basic-left-content" :style="leftStyle">
        <slot name="left"></slot>
      </div>
      <div
        class="resize-bar"
        @mousedown="handleMousedown"
      ></div>
    </div>
    <div class="basic-main">
      <slot></slot>
    </div>
  </div>
</template>

<script>
// import HuilanBasicHeader from './header'
export default {
  name: 'HuilanBasic',
  // components: {
  //   HuilanBasicHeader
  // }
  props: {
    leftWidth: {
      type: Number
    },
    hasTab: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      width: this.leftWidth,
      startX: 0,
      startWidth: 0
    }
  },
  computed: {
    leftStyle() {
      let style = {}
      if(this.width) {
        style.width = `${this.width}px`
      }
      return style
    }
  },
  // mounted() {
  //   // this.width = this.$
  // },
  methods: {
    handleMousedown(e) {
      // debugger
      this.startX = e.pageX;
      this.startWidth = this.width;
      this.resizeStart = true;
      document.body.style.userSelect = 'none';
      document.addEventListener('mousemove', this.handleMouseMove.bind(this));
      document.addEventListener('mouseup', this.handleMouseUp.bind(this));
    },
    handleMouseMove(e) {
      if(!this.resizeStart) {
        return
      }
      // debugger
      const dis = e.pageX - this.startX
      let res = this.startWidth + dis;
      if(res < this.leftWidth) {
        res = this.leftWidth
      }

      this.width = res;
    },
    handleMouseUp() {
      this.resizeStart = false;
      document.body.style.userSelect = '';
      document.removeEventListener('mousemove', this.handleMouseMove);
      document.removeEventListener('mouseup', this.handleMouseUp);
    }
  }
}
</script>

<style lang="scss" scoped>
.huilan-basic {
  display: flex;
  height: 100%;

  .basic-left {
    background: #fff;
    border-right: 1px solid #eeeeee;
    position: relative;

    .basic-left-content {
      height: 100%;
      overflow: auto;
    }

    .resize-bar {
      position: absolute;
      right: -3px;
      top: 0;
      bottom: 0;
      width: 5px;
      cursor: ew-resize;
      //background: red;
    }
  }
  .basic-main{
    flex: 1;
    margin: 20px;
    padding: 30px;
    background: #fff;
    overflow: auto;
    border-radius: 10px;
    box-shadow: 0 6px 13px 3px #f1f1f4;
  }

  &.hasTab {
    /deep/.el-tabs__nav-wrap {
      padding-left: 30px;
    }

    .basic-main {
      padding: 0;
    }
  }
}
</style>
