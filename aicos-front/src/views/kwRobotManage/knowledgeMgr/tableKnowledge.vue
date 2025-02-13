<template>
<KwTabManagement/>
</template>

<script>
import KwTabManagement from '@/views/kwKnowledgeCenter/kwKnowledgeMangement/kwTabManagement'
export default {
  name: 'RobotTableKnowledge',
  components:{
    KwTabManagement
  },
  // 用来区分菜单的code
  provide: {
    isRobotMenu: true
  }
}
</script>

<style scoped>

</style>
