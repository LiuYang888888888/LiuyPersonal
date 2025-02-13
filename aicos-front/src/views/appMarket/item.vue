<template>
  <li
    class="app-item"
    :title="data.name"
    :class="[data.isNew ? 'isNew' : '', data.isHot ? 'isHot' : '']"
  >
    <div class="app-item-icon">
      <DesktopIcon :data="data"/>
    </div>
    <div class="app-item-info">
      <h2>{{data.name}}</h2>
      <p>{{data.description}}</p>
      <div class="app-item-toolbar">
        <div>
          <el-button
            type="text"
            size="mini"
            @click="showDetail"
          >查看介绍<i class="el-icon-arrow-right"></i></el-button>
        </div>
        <div>
          <el-button
            v-if="data.authorized"
            size="mini"
            disabled
          >已开通</el-button>
          <el-button
            v-else
            type="primary"
            size="mini"
            @click="activateNow"
          >立即开通</el-button>
          <el-button
            type="primary"
            size="mini"
            plain
            @click="handleDownLoad"
          >资料下载</el-button>
        </div>
      </div>
    </div>
<!--    <el-popover-->
<!--      placement="bottom-start"-->
<!--      :title="data.name"-->
<!--      width="800"-->
<!--      trigger="hover"-->
<!--    >-->
<!--      <div class="app-cont-header">-->
<!--        <div>-->
<!--          <div class="app-item">-->
<!--            <div class="app-item-icon" :style="style">-->
<!--              <i v-if="!isPath" :class="data.icon"></i>-->
<!--            </div>-->
<!--            <h3>{{ data.name }}</h3>-->
<!--          </div>-->
<!--        </div>-->
<!--        <div>-->
<!--          <el-button size="small" type="primary">立即开通</el-button>-->
<!--          <el-button size="small">资料下载</el-button>-->
<!--        </div>-->
<!--      </div>-->
<!--      <p>{{data.description}}</p>-->
<!--      <div slot="reference">-->
<!--        <div class="app-item-icon" :style="style">-->
<!--          <i v-if="!isPath" :class="data.icon"></i>-->
<!--        </div>-->
<!--        <h3>{{ data.name }}</h3>-->
<!--      </div>-->
<!--    </el-popover>-->

  </li>
</template>

<script>
import DesktopIcon from "@/page/desktop/components/desktopIcon";
export default {
  name: 'item',
  components: {
    DesktopIcon
  },
  props: {
    data: {
      type: Object,
      default() {
        return{}
      }
    }
  },
  computed: {
    isPath() {
      const reg = /\//
      return reg.test(this.data.icon)
    },
    style() {
      let res = {}
      if(this.isPath) {
        res = {
          backgroundImage: `url('${this.data.icon}')`
        }
      }

      return res
    }
  },
  data() {
    return {}
  },
  methods: {
    showDetail() {
      this.$emit('detail', this.data)
    },
    activateNow() {
      alert(`开通【${this.data.name}】`)
    },
    handleDownLoad() {
      this.downFile(this.data.downLoadUrl)
    }
  }
}
</script>

<style lang="scss" scoped>
.app-item {
  display: flex;
  padding: 50px 30px 30px;
  //cursor: pointer;
  //border: 1px solid transparent;
  list-style-type: none;
  border-radius: 10px;
  background-color: #fff;
  background-position: left 10px;
  background-repeat: no-repeat;

  &.isNew {
    background-image: url('~@/assets/desk/new.png');
  }
  &.isHot{
    background-image: url('~@/assets/desk/hot.png');
  }

  .app-item-icon {
    margin-right: 34px;
    font-size: 45px;
  }

  .app-item-info {
    flex: 1;
    width: 1px;

    h2 {
      margin:0;
      font-size: 32px;
      color: #070b2d;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;

      &+p {
        height: 70px;
        margin: 0;
        padding: 10px 0;
        font-size: 16px;
        color: #565863;
        line-height: 1.5em;
        overflow: hidden;
      }
    }
  }
  .app-item-toolbar {
    display: flex;
    justify-content: space-between;
  }

  //&:hover {
  //  background: rgba(255,255,255, 0.4);
  //  border: 1px solid rgba(255,255,255, 0.6);
  //  border-radius: 3px;
  //}

  //.app-item-icon {
  //  width: 48px;
  //  height: 48px;
  //  margin: 0 auto;
  //  text-align: center;
  //  line-height: 48px;
  //  background-position: center;
  //  background-repeat: no-repeat;
  //
  //  i {
  //    color: #21a8ef;
  //    font-size: 2em;
  //  }
  //}
  //h3 {
  //  margin: 5px 0 0;
  //  font-size: 14px;
  //  font-weight: 400;
  //  color: #03080b;
  //  text-align: center;
  //  overflow: hidden;
  //  white-space: nowrap;
  //  text-overflow: ellipsis;
  //}
}
//.app-cont-header {
//  display: flex;
//
//  >div:first-child {
//    flex: 1;
//    .app-item {
//      display: flex;
//      align-items: center;
//      cursor: default;
//
//      h3 {
//        flex: 1;
//        margin-top: 0;
//        text-align: left;
//        font-size: 16px;
//      }
//    }
//  }
//  >div:last-child {
//    width: 200px;
//  }
//}
</style>
