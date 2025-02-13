<template>
  <div class="icon-list">
    <div v-for="item in menu" :key="item.id" class="list-item">
      <DesktopIcon :data="item"/>
      <el-checkbox
        v-model="item.iconStatus"
        true-label="1"
        false-label="0"
      >{{item.menuName}}</el-checkbox>
    </div>
  </div>
</template>

<script>
import DesktopIcon from "@/page/desktop/components/desktopIcon";
// import {mapGetters} from "vuex";
export default {
  name: 'iconList',
  components: {
    DesktopIcon
  },
  data() {
    return {
      menu: this.getMenu()
    }
  },
  computed: {
    // ...mapGetters([
    //   'menu'
    // ]),
    // menu() {
    //   return this.$store.getters.menu.map(item=> {
    //     return this.deepClone(item)
    //   })
    // }
  },
  methods: {
    getMenu() {
      return this.$store.getters.menu.map(item=> {
        return this.deepClone(item)
      })
    },
    getData() {
      return this.menu
    }
  }
}
</script>

<style lang="scss" scoped>
.icon-list {
  display: grid;
  grid-template-rows: repeat(auto-fill, 120px);
  grid-template-columns: repeat(auto-fill, 120px);

  .list-item {
    text-align: center;
  }

  /deep/ .desktop-icon {
    display: block;
    width: 2em;
    height: 2em;
    margin: 20px auto 10px;
    font-size: 31px;

    i {
      color: #21a8ef;
      font-size: 2em;
    }
  }
  /deep/.el-checkbox{
    color: #fff;
  }
}
</style>
