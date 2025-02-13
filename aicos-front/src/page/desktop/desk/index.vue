<template>
  <div class="Huilan-desk">
    <DataViewWrapper @itemclick="handleIconClick"/>
<!--    <DataView @itemclick="handleIconClick"/>-->
    <transition appear>
        <StartMenu
          v-show="desktop.visibleStartMenu"
          @itemclick="handleIconClick"
        />
    </transition>
    <transition appear>
        <Dashboard
          v-show="desktop.visibleDashboard"
          :style="`left:${desktop.staticPos.dashboard - 180}px`"
        />
    </transition>
    <transition appear  v-on:after-enter="afterSearchEnterHook">
        <Search
          ref="search"
          v-show="desktop.visibleSearch"
          :style="`left:${desktop.staticPos.search - 180}px`"
        />
    </transition>
    <DeskWindow
      v-for="item in winList"
      :key="item.data.id"
      :visible.sync="item.visible"
      :style="{zIndex: item.zIndex}"
      :data="item.data"
      @close="handleWinClose"
    >
<!--      <template-->
<!--        v-if="item.data.menuList && item.data.menuList.length > 0"-->
<!--        #left-->
<!--      >-->
<!--        <SubMenu :data="item"/>-->
<!--      </template>-->
<!--      <template v-else>-->
<!--        <NormalIframe v-if="isURL(item.data.linkUrl)" :src="item.data.linkUrl"/>-->
<!--        <compnent v-else :is="getCmp(item.data)"></compnent>-->
<!--      </template>-->
    </DeskWindow>
  </div>
</template>

<script>
import DataView from './dataView'
import DeskWindow from './deskWindow'
import StartMenu from './startMenu'
// import SubMenu from './SubMenu'
import Dashboard from '../modules/dashboard'
import Search from '../modules/search'
// import NormalIframe from '@/components/iframe/normal'
import DataViewWrapper from './dataViewWrapper'
// import {isURL} from '@/util/validate'
export default {
  name: 'index',
  components: {
    DataViewWrapper,
    DataView,
    DeskWindow,
    StartMenu,
    // SubMenu,
    Dashboard,
    Search,
    // NormalIframe
  },
  inject: ['desktop'],
  props: {
    winList: {
      type: Array,
      default() {
        return []
      }
    }
  },
  data() {
    return {
      data: [],
      // winList: []
    }
  },
  methods: {
    // 解决第一次打开搜索的时候，当前tab下没有横线的问题
    afterSearchEnterHook() {
      if(this.$refs.search.searchType === '0') {
        this.$refs.search.searchType = 'app'
      }
    },
    handleIconClick(data) {
      this.desktop.handleItemClick(data, false)
    },
    handleWinClose(data) {
      const winList = this.winList.filter(item => item.data.id !== data.id)
      this.$emit('update:winList', winList)
    }
  }
}
</script>

<style lang="scss" scoped>
.v-enter-active,.v-leave-active{
  transition: transform .3s;
}
.v-enter,.v-leave-to{
  transform: translate(0, 100%);
}
.Huilan-desk {
  position: relative;
  overflow: hidden;
}
</style>
