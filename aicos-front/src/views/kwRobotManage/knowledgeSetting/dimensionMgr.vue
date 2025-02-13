<template>
<KwDimensionManage/>
</template>

<script>
import KwDimensionManage from '@/views/kwKnowledgeCenter/kwSettings/kwDimensionManage'
export default {
  name: 'RobotDimensionMgr',
  components:{
    KwDimensionManage
  },
  // 用来区分菜单的code
  provide: {
    isRobotMenu: true
  }
}
</script>

<style scoped>

</style>
