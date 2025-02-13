<template>
  <div class="avue-sidebar">
    <logo></logo>
    <el-scrollbar ref="scrollbar" style="height:100%">
      <div v-if="validatenull(menu)"
           class="avue-sidebar--tip">{{$t('menuTip')}}
      </div>
      <el-menu
        unique-opened
        :default-active="nowTagValue"
        mode="vertical"
        :show-timeout="200"
        :collapse="keyCollapse"
        @open="updateeMenuScrollbar"
        @close="updateeMenuScrollbar"
      >
        <sidebar-item :menu="menu"
                      :screen="screen"
                      first
                      :props="website.menu.props"
                      :collapse="keyCollapse"></sidebar-item>
      </el-menu>
    </el-scrollbar>
  </div>
</template>

<script>
import {mapGetters} from "vuex";
import logo from "../logo";
import sidebarItem from "./sidebarItem";

export default {
  name: "sidebar",
  components: {sidebarItem, logo},
  inject: ["index"],
  data() {
    return {};
  },
  created() {
    // this.index.openMenu(this.menuId);
  },
  computed: {
    ...mapGetters(["website", "menu", "tag", "keyCollapse", "screen", "menuId"]),
    nowTagValue: function () {
      return this.$router.$avueRouter.getValue(this.$route);
    }
  },
  watch: {
    keyCollapse: {
      handler: function () {
        this.updateeMenuScrollbar();
      },
      // immediate: true
    }
  },
  mounted() {
  },
  methods: {
    updateeMenuScrollbar() {
      setTimeout(() => {
        this.$refs.scrollbar.update();
      }, 500);
    }
  }
};
</script>
<style lang="scss" scoped>
/deep/ .avue-sidebar .el-menu-item i, .avue-sidebar .el-menu-item span, .avue-sidebar .el-submenu__title i, .avue-sidebar .el-submenu__title span {
  color: #000;
}

/deep/ .el-submenu.is-active .el-submenu__title
</style>

