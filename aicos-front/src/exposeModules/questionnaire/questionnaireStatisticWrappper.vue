<template>
  <ExposeWrapper>
    <Statistic/>
  </ExposeWrapper>
</template>

<script>
import ExposeWrapper from '../components/exposeWrapper'
import Statistic from '@/views/questionnaire/statistic';

export default {
  name: 'questionnaireStatisticWrappper',
  components: {
    ExposeWrapper,
    Statistic
  }
}
</script>

<style scoped lang="scss">

</style>
