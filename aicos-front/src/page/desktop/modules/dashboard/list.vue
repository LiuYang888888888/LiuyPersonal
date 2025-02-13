<template>
  <div class="Huilan-dashboard-list">
    <div class="header">
      <h3>{{ title }}</h3>
      <div>
        <el-button v-if="data.length > 4" size="small" type="text" @click="handleMore">更多>></el-button>
      </div>
    </div>
    <div class="dashboard-list-cont">
      <DesktopItem v-for="item of list" :key="item.id" :data="item"/>
    </div>
    <el-dialog
      :title="title"
      append-to-body
      :visible.sync="dialogVisible"
      width="40%"
      class="avue-dialog dashboard-dialog">
      <div class="dashboard-list-cont">
        <DesktopItem v-for="item of data" :key="item.id" :data="item" @click.native="handleItemClick"/>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import DesktopItem from '../../desk/desktopItem'
// import {mapState} from "vuex";
export default {
  name: 'list',
  components: {
    DesktopItem
  },
  props: {
    title: {
      type: String,
      default: ''
    },
    data: {
      type: Array,
      default() {
        return []
      }
    }
  },
  provide() {
    return {
      dataview: this
    }
  },
  data() {
    return {
      dialogVisible: false
    }
  },
  computed: {
    list(){
      return this.data.slice(0, 4)
    }
  },
  methods: {
    handleMore() {
      this.dialogVisible = true
    },
    handleItemClick() {
      this.dialogVisible = false
    }
  }
}
</script>

<style lang="scss" scoped>
.Huilan-dashboard-list {
  .header {
    display: flex;

    h3 {
      flex: 1;
      margin: 0;
      font-size: 14px;
      line-height: 32px;
      color: #070b2d;
    }
  }
}

.dashboard-list-cont {
  display: grid;
  grid-template-rows: repeat(auto-fill, 82px);
  grid-template-columns: repeat(auto-fill, 76px);

  /deep/ .desk-item {
    .desk-item-icon {
      width: 48px;
      height: 48px;
      line-height: 48px;
    }
    i {
      color: #fff;
      font-size: 2em;
    }
    h3 {
      margin: 0;
      color: #303133;
      font-size: 14px;
    }
  }
}

.dashboard-dialog {

  /deep/ .el-dialog {
    background: #d8e0f5;
  }
}
</style>
