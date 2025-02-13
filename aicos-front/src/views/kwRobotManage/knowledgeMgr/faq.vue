<template>
<kwFaqManagement/>
</template>

<script>
import kwFaqManagement from '@/views/kwKnowledgeCenter/kwKnowledgeMangement/kwFaqManagement'
export default {
  name: 'RobotKnowledgeFaq',
  components:{
    kwFaqManagement
  },
  // 用来区分菜单的code
  provide: {
    isRobotMenu: true
  }
}
</script>

<style scoped>

</style>
