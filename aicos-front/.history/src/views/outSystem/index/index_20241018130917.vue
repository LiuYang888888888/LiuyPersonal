<template>
  <div class="sysIndex">
    
  </div>
</template>
<script>
import {getRoutes} from "@/api/system/menu";
import indexSearch from "./indexSearch.vue"
import indexMenu from "./indexMenu.vue";
import indexDownload from './indexDownload.vue'
import indexTools from './indexTools.vue'

export default {
  components: {
    indexSearch,
    indexMenu,
    indexDownload,
    indexTools
  },
  data() {
    return {
      menuListAll: [],
      menuList: []
    }
  },
  mounted() {
    this.open1()
  },
  methods: {
    open1() {
      const h = this.$createElement;

      this.$notify({
        title: '警告',
        message: h('i', { style: 'color: #af2c30;font-size:28px;line-height:28px;'}, '外网系统禁止处理涉密数据!'),
        type: 'warning',
      });
    },
    //获取menu
    getMenuList() {
      this.menuListAll = this.$store.state.user.menuAll
      // console.log("获取store中的menu菜单",this.menuListAll)
      // console.log("获取menulist",this.menuListAll)
      for (var i = 0; i < this.menuListAll.length; i++) {
        if (this.menuListAll[i].menuName === '外网管理系统') {
          this.menuList = this.menuListAll[i].menuList
        }
      }

    }
  },
  created() {
    this.getMenuList()
  }
}

</script>

<style scoped lang="scss">

.sysIndex {
  padding: 1rem;
  box-sizing: border-box;

  .sysIndexTop {
    width: 100%;
    height: 14rem;
    background: url("~@/assets/outSystem/banner.jpg") top no-repeat;
    display: flex;
    justify-content: space-around;
    align-items: center;
    border-radius: 5px;
    background-size:cover ;

    img.logo {
      width: 42%;
    }


  }


}


.sysIndexBottom {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  background: #fff;
  padding: 1rem 1rem 1rem 2rem;
  box-sizing: border-box;
  border-radius: 10px;
}

.sysIndexBottom .sysIndexBottomLeft {
  width: 47%;
}

.sysIndexBottom .sysIndexBottomRight {
  width: 49%;
}


</style>
