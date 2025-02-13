<template>
<SmallTalk/>
</template>

<script>
import SmallTalk from '@/views/kwKnowledgeCenter/kwKnowledgeMangement/smalltalk'
export default {
  name: 'RobotSmallTalk',
  components:{
    SmallTalk
  },
  // 用来区分菜单的code
  provide: {
    isRobotMenu: true
  }
}
</script>

<style scoped>

</style>
