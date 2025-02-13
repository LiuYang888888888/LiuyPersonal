<template>
<KwAnswerPerspectManage/>
</template>

<script>
import KwAnswerPerspectManage from '@/views/kwKnowledgeCenter/kwSettings/kwAnswerPerspectManage'
export default {
  name: 'RobotAnswerPerspectMgr',
  components:{
    KwAnswerPerspectManage
  },
  // 用来区分菜单的code
  provide: {
    isRobotMenu: true
  }
}
</script>

<style scoped>

</style>
