<template>
<!--  <transition appear>-->
    <div class="start-menu" @click.stop>
      <el-scrollbar>
        <el-menu
          background-color="#d8e0f5"
          text-color="#2c3e50"
          active-text-color="#2c3e50"
          @select="handleSelet"
        >
          <template
            v-for="(menu,menuIndex) in menuAll"
          >
            <el-submenu
              v-if="menu.isLeaf === '0'"
              :key="menu.id"
              :index="menuIndex+''"
            >
              <template slot="title">
                <i class="menu-icon" :class="menu.imageUrl"></i>
                <span>{{ menu.menuName }}</span>
              </template>
              <el-menu-item
                v-for="(item, itemIndex) in menu.menuList"
                :key="item.id"
                :index="itemIndex+''"
              >
                <i class="menu-icon" :class="item.imageUrl"></i>
                <span slot="title">{{ item.menuName }}</span>
              </el-menu-item>
            </el-submenu>
            <el-menu-item
              v-else
              :key="menu.id"
              :index="menuIndex"
            >
              <i class="menu-icon" :class="menu.imageUrl"></i>
              <span slot="title">{{ menu.menuName }}</span>
            </el-menu-item>

          </template>
        </el-menu>
      </el-scrollbar>
    </div>
<!--  </transition>-->
</template>

<script>
import {mapState} from "vuex";

export default {
  name: 'startMenu',
  computed: mapState({
    menuAll: state => state.user.menuAll,
  }),
  methods: {
    handleSelet(index, indexPath) {
      let res = null
      indexPath.forEach(item => {
        if(res) {
          res = res.menuList[item]
        }else {
          res = this.menuAll[item]
        }
      })
      this.$emit('itemclick', res)
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
.start-menu {
  position: absolute;
  left: 0;
  bottom: 0;
  height: 61.8%;
  width: 20%;
  background: #d8e0f5;
  user-select: none;
  z-index: 1000;
  border-radius: 8px 8px 0 0;
  overflow: hidden;

  /deep/ .el-menu i {
    color: inherit;
  }
  .menu-icon {
    margin-right: 5px;
  }
}
</style>
