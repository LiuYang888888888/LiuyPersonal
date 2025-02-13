<template>
  <el-tree
    :data="data"
    show-checkbox
    node-key="id"
    default-expand-all
    :expand-on-click-node="false">
  </el-tree>
</template>

<script>
export default {
  name: 'HuilanTree'
}
</script>

<style scoped>

</style>
