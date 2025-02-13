<template>
  <div class="data-view-wrapper">
    <el-carousel
      height="calc(100vh - 50px)"
      :autoplay="false"
      trigger="click"
      arrow="never"
      :indicator-position="carouselLen > 1 ? '': 'none'"
    >
      <el-carousel-item v-for="item in carouselLen" :key="item">
        <DataView
          :data="list.slice((item - 1) * num, item * num)"
          @itemclick="handleItemClick"
        />
      </el-carousel-item>
    </el-carousel>
  </div>
</template>

<script>
import DataView from './dataView'
import {mapState} from "vuex";
import { getDesktopBackground } from '@/api/desktopSetting'

// import StartMenu from './startMenu'
// import FlowMgr from '@/views/system/flow'
// import KwRobotTrain from "@/components/kwRobotTrain/index";

export default {
  name: 'dataViewWrapper',
  components: {
    DataView
  },
  computed: {
    ...mapState({
      // menuAll: state => state.user.menuAll,
      list(state){
        const menu = state.user.menu.filter(item=> {
          return item.iconStatus === '1'
        })
        // menu.unshift({
        //   menuName: '左侧测试',
        //   id: 'tttttt',
        //   imageUrl: 'menu-icon-img user-mgr',
        //   leftComponent: StartMenu,
        //   rightComponent: FlowMgr,
        //   topComponent: KwRobotTrain
        // })
        return menu
      }
    }),
    carouselLen() {
      return Math.ceil(this.list.length / this.num)
    }
  },
  data() {
    return {
      num: 18
    }
  },
  created() {
    this.getDesktop()
  },
  methods: {
    handleItemClick() {
      this.$emit('itemclick', ...arguments)
    },
    async getDesktop() {
      const {data: {data}} = await getDesktopBackground()
      // debugger
      if(data.DesktopBackground) {
        this.$store.commit('SET_DESKTOPBG_SETTING', data.DesktopBackground)
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.data-view-wrapper {
  height: 100%;
  background-position: left top;
  background-repeat: no-repeat;

  /deep/.desk-data-view {
    width: 1100px;
    margin: 0 auto;
    padding: 10% 0;
  }

  /deep/ .el-carousel__indicator--horizontal {
    padding-bottom: 40px;

    .el-carousel__button {
      width: 16px;
      height: 16px;
      border-radius: 50%;
    }
  }
}
</style>
