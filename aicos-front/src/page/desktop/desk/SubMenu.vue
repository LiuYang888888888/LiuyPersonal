<template>
<!--  <el-container style="height: 100%">-->
<!--    <el-aside width="150px" style="background: #f1f3f4;">-->
  <component :is="cmp" :index="data.code">
    <template v-if="hasSubMenu(data)">

      <template slot="title">
        <!-- <i class="el-icon-" :class="data.imageUrl"></i> -->
        {{data.menuName}}
      </template>
      <SubMenu
        v-for="menu in data.menuList"
        :key="menu.id"
        :data="menu"
      >
      </SubMenu>
    </template>
    <template v-else>
      <!-- <i class="el-icon-" :class="data.imageUrl"></i> -->
      <span slot="title" :title="data.menuName">{{data.menuName}}</span>
    </template>

  </component>
<!--    </el-aside>-->
<!--    <el-main>-->
<!--      <NormalIframe v-if="isIframe" :src="iframeUrl"/>-->
<!--      <compnent v-else :is="cmp"></compnent>-->
<!--    </el-main>-->
<!--  </el-container>-->
</template>

<script>
// import NormalIframe from '@/components/iframe/normal'
// import {isURL} from "@/util/validate";
export default {
  name: 'SubMenu',
  // components: {
  //   NormalIframe
  // },
  props: {
    data: {
      type: Object,
      default() {
        return {}
      }
    }
  },
  data() {
    return {}
  },
  computed: {
    cmp() {
      return this.hasSubMenu(this.data) ? 'el-submenu' : 'el-menu-item'
    }
  },
  methods: {
    hasSubMenu(menu) {
      return menu.menuList.length > 0;
    }
    // handleSlect() {
    //
    // }
  }
}
</script>

<style scoped>

</style>
