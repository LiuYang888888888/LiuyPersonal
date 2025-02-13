<template>
  <ul class="app-result-list">
    <li v-for="item in result" :key="item.id" @click="handClick(item)">
      <div>
        <DesktopIcon :data="item"/>
      </div>
      <h2>{{item.menuName}}</h2>
    </li>
  </ul>
</template>

<script>
import {mapGetters} from "vuex";
import DesktopIcon from '../../components/desktopIcon'

export default {
  name: 'appSearch',
  components: {
    DesktopIcon
  },
  props: {
    searchText: {
      type: String,
      default: ''
    }
  },
  inject: ['desktop'],
  computed: {
    ...mapGetters([
      'menu'
    ]),
    flatMenu() {
      const list = this.getChild(this.menu)
      return list
    },
    result() {
      let list = []
      if(this.searchText.length > 0) {
        list = this.flatMenu.filter(item=> {
          return item.menuName.includes(this.searchText)
        })
      }
      return list
    }
  },
  methods: {
    getChild(data) {
      let list = []
      data.forEach(item=> {
        list.push(item)
        if(item.menuList.length > 0) {
          const res = this.getChild(item.menuList)
          list.push(...res)
        }
      })

      return list
    },
    handClick(item) {
      this.desktop.handleItemClick(item)
    }
  }
}
</script>

<style lang="scss" scoped>
.app-result-list {
  margin: 0;
  padding: 0;

  li {
    display: flex;
    padding: 5px 10px;
    list-style-type: none;
    cursor: pointer;

    &:hover {
      background: rgba(255,255,255, 0.4);
    }

    h2 {
      flex: 1;
      margin: 0;
      padding-left: 10px;
      font-size: 16px;
      line-height: 2em;
    }
  }
}
</style>
