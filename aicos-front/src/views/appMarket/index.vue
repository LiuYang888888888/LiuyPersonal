<template>
  <div class="app-market">
      <el-scrollbar ref="listScroll">
        <ul class="filter-bar">
          <li
            v-for="item in filterList"
            :key="item.label"
            :class="filter === item.value ? 'active' : ''"
            @click="handleFilter(item.value)"
          >{{ item.label }}</li>
        </ul>
        <ul class="app-list">
          <AppItem v-for="item of list" :key="item.id" :data="item" @detail="handleDetail"/>
        </ul>
      </el-scrollbar>



    <transition name="slide">
      <div
        v-if="showDetail"
        class="app-detail-con"
      >
        <el-scrollbar>
          <AppDetail
            :data="curData"
            @back="handleBack"
          />
        </el-scrollbar>
      </div>
    </transition>

<!--    </basic-container>-->
  </div>
</template>

<script>
// import list from './dataList'
import AppItem from './item'
import AppDetail from './appDetail'
export default {
  name: 'ApplicationMarket',
  components: {
    AppItem,
    AppDetail
  },
  data() {
    return {
      // data: list,
      data: [],
      filterList: [
        {label: '全部', value: 'all'},
        {label: '已开通', value: true},
        {label: '未开通', value: false},
      ],
      filter: 'all',
      showDetail: false,
      curData: {}
    }
  },
  computed: {
    list() {
      if(this.filter === 'all') {
        return this.data
      }else {
        return this.data.filter(item=> item.authorized === this.filter)
      }
    }
  },
  methods: {
    handleFilter(val) {
      this.filter = val
      this.$nextTick(()=> {
        this.$refs.listScroll.update();
      })
    },
    handleDetail(data) {
      this.showDetail = true
      this.curData = data
    },
    handleBack() {
      this.showDetail = false
    }
  }
}
</script>

<style lang="scss" scoped>
.app-market {
  position: relative;
  height: 100%;
  //background: #f8f9fa;

  /deep/.slide-enter-active, /deep/.slide-leave-active {
    transition: transform .5s;
    //transition: opacity 2s;
  }
  /deep/.slide-enter, /deep/.slide-leave-to {
    transform: translateX(100%);
    //opacity: 0;
  }
}
.filter-bar {
  list-style-type: none;
  padding: 10px;
  margin: 0 0 10px;

  li {
    display: inline-block;
    font-size: 16px;
    color: #565863;
    margin-right: 20px;
    cursor: pointer;

    &.active {
      position: relative;
      font-size: 20px;
      color: #070b2d;

      &:after {
        content: '';
        position: absolute;
        left:50%;
        bottom: -5px;
        width: 30%;
        height: 1px;
        background: #070b2d;
        transform: translateX(-50%);
      }
    }
  }
}
.app-list {
  margin: 0;
  padding: 0;
  display: grid;
  grid-template-rows: repeat(auto-fill, 220px);
  //grid-template-columns: repeat(auto-fill, 600px);
  grid-template-columns: repeat(3, 1fr);
  grid-gap: 30px;
}
.app-detail-con {
  position: absolute;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  background: #fff;
}
</style>
