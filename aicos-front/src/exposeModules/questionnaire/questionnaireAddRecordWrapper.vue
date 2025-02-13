<template>
  <ExposeWrapper>
    <QusnDataAdd/>
  </ExposeWrapper>
</template>

<script>
import ExposeWrapper from '../components/exposeWrapper'
import QusnDataAdd from '@/views/questionnaire/qusnDataAdd';

export default {
  name: 'questionnaireAddRecordWrapper',
  components: {
    ExposeWrapper,
    QusnDataAdd
  }
}
</script>

<style scoped lang="scss">

</style>
