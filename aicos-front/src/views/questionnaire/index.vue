<template>
  <HuilanBasic hasTab>

    <avue-tabs :option="tabOption" @change="tabChange"></avue-tabs>
    <div class="inTab">
      <div v-if="(this.tabActive == 'QusnList')">
        <QusnList />
      </div>
      <div v-if="(this.tabActive == 'BankList')">
        <BankList />
      </div>
    </div>
 
  </HuilanBasic>
</template>
<script>
import QusnList from './qusnList';
import BankList from './bankList';

export default {
  name: 'qusnIndex',
  components: {
    QusnList,
    BankList,
  },
  data() {
    return {
      tabActive: 'QusnList',
      tabOption:{
        column: [
          {
            label: '问卷管理',
            value: 'QusnList',
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
