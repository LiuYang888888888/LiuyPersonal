<template>
  <el-dialog
    class="avue-dialog"
    v-bind="$attrs"
    :fullscreen="isFullscreen"
    v-on="$listeners"
    :close-on-click-modal="closeOnClickModal"
  >
    <div slot="title" class="avue-crud__dialog__header">
      <span class="el-dialog__title">{{title}}</span>
      <div class="avue-crud__dialog__menu">
        <i @click="handleFullScreen" class="el-dialog__close el-icon-full-screen"></i>
      </div>
    </div>
    <slot></slot>
    <template v-slot:footer>
      <slot name="footer"></slot>
    </template>
  </el-dialog>
</template>

<script>
export default {
  name: 'HuilanDialog',
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
    closeOnClickModal: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return{
      isFullscreen: false
    }
  },
  watch: {
    fullscreen: {
      handler(newVal) {
        this.isFullscreen = newVal
      },
      immediate: true
    }
  },
  methods: {
    handleFullScreen() {
      this.isFullscreen = !this.isFullscreen;
    }
  }
}
</script>

<style scoped>

</style>
