<template>
<DocumentKnowledge/>
</template>

<script>
import DocumentKnowledge from '@/views/kwKnowledgeCenter/kwKnowledgeMangement/documentknowledge'
export default {
  name: 'RobotDocKnowledge',
  components:{
    DocumentKnowledge
  },
  // 用来区分菜单的code
  provide: {
    isRobotMenu: true
  }
}
</script>

<style scoped>

</style>
