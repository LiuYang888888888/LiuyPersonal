<template>
  <div class="app-detail">
    <div class="detail-back" @click="handleBack" title="返回">
      <i class="el-icon-arrow-left"></i>
    </div>
    <div class="detail-header">
      <div class="detail-header-icon">
        <DesktopIcon :data="data"/>
      </div>
      <div class="detail-header-info">
        <h1>{{data.name}}</h1>
        <p>{{data.description}}</p>
        <div class="detail-header-tool">
<!--          <el-popover-->
<!--            placement="bottom-start"-->
<!--            width="250"-->
<!--            trigger="hover"-->
<!--            content="【试用版】2021-12-31 到期">-->
<!--            <el-button-->
<!--              slot="reference"-->
<!--              size="mini"-->
<!--            >已开通</el-button>-->
<!--          </el-popover>-->
          <el-button
            v-if="data.authorized"
            size="mini"
            disabled
          >已开通</el-button>
          <el-button
            v-else
            type="primary"
            size="mini"
          >立即开通</el-button>
          <el-button
            type="primary"
            size="mini"
            plain
          >资料下载</el-button>
          <el-button
            type="primary"
            size="mini"
            plain
          >联系服务商</el-button>
        </div>
      </div>
    </div>
    <div>
      <p class="detail-content">{{data.content}}</p>
      <el-carousel
        height="240px"
        direction="vertical"
        class="detail-screenshots"
      >
        <el-carousel-item v-for="item in count" :key="item">
          <div class="detail-screenshots-list">
            <template
              v-for="i in size"
            >
              <img
                v-if="data.screenshots[(item-1) * size + (i - 1)]"
                :key="i"
                :src="data.screenshots[(item-1) * size + (i - 1)]"
              />
            </template>

          </div>
        </el-carousel-item>
      </el-carousel>

    </div>
  </div>
</template>

<script>
import DesktopIcon from "@/page/desktop/components/desktopIcon";
export default {
  name: 'AppDetail',
  components: {
    DesktopIcon
  },
  props: {
    data: {
      type: Object,
      default() {
        return {}
      }
    }
  },
  data() {
    return {
      size: 4
    }
  },
  computed: {
    count() {
      return Math.ceil(this.data.screenshots.length / this.size)
    }
  },
  methods: {
    handleBack() {
      this.$emit('back')
    }
  }
}
</script>

<style lang="scss" scoped>
.app-detail {
  padding: 40px 60px;
}
.detail-back {
  display: inline-block;
  padding: 5px;
  cursor: pointer;
  margin-bottom: 30px;

  &:hover {
    color: #409EFF;
  }
}
.detail-header {
  display: flex;
  border-bottom: 1px solid #eeeeee;
}
.detail-header-icon {
  padding-right: 40px;
  font-size: 80px;
}
.detail-header-info {
  flex: 1;
  padding-bottom: 20px;

  h1 {
    margin: 0;
    font-size: 42px;
    color: #070b2d;

    &+p {
      font-size: 24px;
      color: #565863;
    }
  }
}
.detail-content {
  font-size: 18px;
  color: #9597a0;
  line-height: 2em;
}
.detail-screenshots {
  padding-right: 60px;

  /deep/.el-carousel__indicator--vertical {
    .el-carousel__button {
      width: 12px;
      height: 12px;
      border-radius: 50%;
      border: 1px solid #070b2d;
    }

    &.is-active {
      button {
        background: #070b2d;
      }
    }
  }

}
.detail-screenshots-list {
  display: flex;
  height: 100%;
  //justify-content: space-between;

  img {
    width: 21%;
    height: 100%;
    margin: 0 2%;
    object-fit: contain;
  }
}
</style>
