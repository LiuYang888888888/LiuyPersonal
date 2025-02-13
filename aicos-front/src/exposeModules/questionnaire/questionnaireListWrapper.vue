<template>
<ExposeWrapper>
  <QusnList/>
</ExposeWrapper>
</template>

<script>
import ExposeWrapper from '../components/exposeWrapper'
import QusnList from '@/views/questionnaire/qusnList';

export default {
  name: 'questionnaireListWrapper',
  components: {
    ExposeWrapper,
    QusnList
  }
}
</script>

<style scoped lang="scss">

</style>
