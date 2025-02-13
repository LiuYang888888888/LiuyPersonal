<template>
<div v-html="content"></div>
</template>

<script>
export default {
  name: 'HtmlField',
  props: {
    content: {
      type: String,
      default: ''
    }
  }
}
</script>

<style scoped>

</style>
