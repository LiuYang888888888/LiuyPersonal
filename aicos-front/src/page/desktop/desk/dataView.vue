<template>
  <div class="desk-data-view">
    <DesktopItem v-for="item of data" :key="item.id" :data="item"/>
  </div>

</template>

<script>
// import { mapState } from 'vuex'
import DesktopItem from './desktopItem'
export default {
  name: 'DataView',
  components: {
    DesktopItem
  },
  props: {
    data: {
      type: Array,
      default() {
        return []
      }
    }
  },
  data() {
    // setTimeout(()=>{
    //   console.log(this.menuAll)
    // }, 5000)
    return {
      // data: []
    }
  },
  // computed: mapState({
  //   // menuAll: state => state.user.menuAll,
  //   list(state){
  //     const menu = state.user.menu
  //
  //     // const list = menuAll.filter(item=> {
  //     //   return item.displayStatus === '1'
  //     // })
  //
  //     return menu
  //   }
  // }),
  provide() {
    return {
      dataview: this
    }
  },
  methods: {
    // handleContextMenu(event) {
    //   event.preventDefault()
    // }
  }
}
</script>

<style lang="scss" scoped>
.desk-data-view {
  height: 100%;
  padding: 10%;
  display: grid;
  grid-template-rows: repeat(auto-fill, 110px);
  grid-template-columns: repeat(6, 100px);
  grid-column-gap: 100px;
  grid-row-gap: 20px;
  justify-content: center;
  //grid-auto-flow: column;
  //background: url('/img/bg/default.jpg') left top no-repeat;
  //background-size: cover;

}
</style>
