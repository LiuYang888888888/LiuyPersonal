<template>
  <div class="desktop-icon" :style="style">
    <i v-if="!isPath" :class="icon"></i>
  </div>
</template>

<script>
export default {
  name: "desktopIcon",
  props: {
    data: Object
  },
  computed: {
    icon() {
      return this.data.desktopIcon || this.data.imageUrl
    },
    isPath() {
      const reg = /\//
      return reg.test(this.icon)
    },
    style() {
      let res = {}
      if(this.isPath) {
        res = {
          backgroundImage: `url('${this.icon}')`
        }
      }
      return res
    }
  }
}
</script>

<style lang="scss" scoped>
.desktop-icon {
  width: 2em;
  height: 2em;
  display: inline-block;
  background-position: center;
  background-repeat: no-repeat;
  background-size: cover;

  i {
    font-size: 2em;
  }
}
</style>
