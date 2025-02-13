<template>
  <ExposeWrapper>
    <BankList/>
  </ExposeWrapper>
</template>

<script>
import ExposeWrapper from '../components/exposeWrapper'
import BankList from '@/views/questionnaire/bankList';

export default {
  name: 'questionBankWrapper',
  components: {
    ExposeWrapper,
    BankList
  }
}
</script>

<style scoped lang="scss">

</style>
