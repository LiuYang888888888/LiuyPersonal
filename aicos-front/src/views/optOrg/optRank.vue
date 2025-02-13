<template>
  <div style="margin: 50px;">
   选职级
   <!-- <div>{{checkedData.rank}}</div>
   <div>{{checkedData.num.rank}}</div> -->
  </div>
</template>
<script>
export default {
  name: 'optRank',
  props: {
    checkedData: {
      type: Object,
      default() {
        return {}
      }
    }
  },
  data() {
    return {
      selectData:[],
    }
  },
  methods: {
    getResData(){
      return this.selectData
    },
  },

}
</script>
<style lang="scss" scoped>

</style>