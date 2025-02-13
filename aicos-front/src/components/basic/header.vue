<template>
  <div class="Hilan-basic-header">
    <h2 class="basic-header-text">{{title}}</h2>
    <div class="basic-header-tool">
      <slot></slot>
    </div>
  </div>
</template>

<script>
export default {
  name: 'HuilanBasicHeader',
  props: {
    title: {
      type: String,
      default: ''
    }
  }
}
</script>

<style lang="scss" scoped>
.Hilan-basic-header {
  display: flex;

  .basic-header-text {
    flex: 1;
    margin: 0;
    font-size: 24px;
    color: #070b2d;
    line-height: 32px;
    font-weight: 400;
  }
  .basic-header-tool {
  }
}
</style>
