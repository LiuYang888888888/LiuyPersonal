<template>
  <HuilanBasic hasTab>

    <avue-tabs :option="tabOption" @change="tabChange"></avue-tabs>
    <div class="inTab">
      <div v-if="(this.tabActive == 'ExamList')">
        <ExamList />
      </div>
      <div v-if="(this.tabActive == 'BankList')">
        <BankList />
      </div>
    </div>
 
  </HuilanBasic>
</template>
<script>
import ExamList from './examList';
import BankList from './bankList';

export default {
  name: 'qusnIndex',
  components: {
    ExamList,
    BankList,
  },
  data() {
    return {
      tabActive: 'ExamList',
      tabOption:{
        column: [
          {
            label: '问卷管理',
            value: 'ExamList',
          },
          {
            label: '题库管理',
            value: 'BankList',
          },
        ]
      },
    }
  },
  methods: {
    tabChange(data){
      this.tabActive = data.value;
    },
  },

}
</script>
<style lang="scss" scoped>

</style>
