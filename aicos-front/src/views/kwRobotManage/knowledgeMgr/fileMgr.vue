<template>
<kwFileManagement/>
</template>

<script>
import kwFileManagement from '@/views/kwKnowledgeCenter/kwKnowledgeMangement/kwFileManagement'
export default {
  name: 'RobotFileKnowledge',
  components:{
    kwFileManagement
  },
  // 用来区分菜单的code
  provide: {
    isRobotMenu: true
  }
}
</script>

<style scoped>

</style>
