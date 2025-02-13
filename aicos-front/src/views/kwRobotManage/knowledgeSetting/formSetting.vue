<template>
<FormSetting/>
</template>

<script>
import FormSetting from '@/views/kwKnowledgeCenter/kwSettings/formsetting'
export default {
  name: 'RobotFormSetting',
  components:{
    FormSetting
  },
  // 用来区分菜单的code
  provide: {
    isRobotMenu: true
  }
}
</script>

<style scoped>

</style>
