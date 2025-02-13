<template>
<KwIntentionManage/>
</template>

<script>
import KwIntentionManage from '@/views/kwKnowledgeCenter/kwIntentionManage'
export default {
  name: 'RobotIntentiionMgr',
  components:{
    KwIntentionManage
  },
  // 用来区分菜单的code
  provide: {
    isRobotMenu: true
  }
}
</script>

<style scoped>

</style>
