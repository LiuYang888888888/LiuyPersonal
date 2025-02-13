<template>
  <div class="huilan-taskbar" :style="taskbarPadding">
    <!--    <div>-->
    <!--      <TaskbarItem-->
    <!--        :data="start"-->
    <!--        :active="desktop.visibleStartMenu"-->
    <!--        @itemclick="handleStartClick"-->
    <!--      />-->
    <!--    </div>-->
    <div class="taskbar-center">
      <TaskbarItem
        v-for="item in staticList"
        ref="static"
        :key="item.cmd"
        :data="item"
        :active="isStaticActive(item)"
        @itemclick="handleStaticItemClick(item)"
      />
      <TaskbarItem
        v-for="item in winList"
        :key="item.data.id"
        :data="item.data"
        :active="isActive(item)"
        @itemclick="handleTaskItemClick(item)"
      />
    </div>
    <div ref="status">
      <TaskbarItem
        :data="setting"
        @itemclick="handleSettingClick"
      />
      <TaskbarItem
        :data="message"
      >
        <TopNotice ref="message">
          <div class="item-icon" @click="popoverClick('message')">
            <i :class="message.imageUrl"></i>
          </div>
        </TopNotice>
      </TaskbarItem>
      <TaskbarItem
        :data="versionInfo"
        class="version-item"
      >
        <el-popover
          ref="updateLog"
          popper-class="update-log-popover"
          placement="top"
          title="升级日志"
          width="600"
          trigger="click"
        >
          <UpdateLog style="height: 80vh"/>
          <div slot="reference" @click="popoverClick('updateLog')">v1.1.2</div>
        </el-popover>

      </TaskbarItem>

    </div>
  </div>
</template>

<script>
import TaskbarItem from './taskbarItem'
import TopNotice from '../../index/top/top-notice'
import UpdateLog from "@/views/updateLog";

export default {
  name: 'index',
  components: {
    TaskbarItem,
    TopNotice,
    UpdateLog
  },
  props: {
    winList: {
      type: Array,
      default() {
        return []
      }
    },
    handleItemClick: {
      type: Function,
      default() {
        return () => {
        }
      }
    }
  },
  inject: ['desktop'],
  data() {
    return {
      // start: {
      //   menuName: '开始菜单',
      //   imageUrl: '/img/desk/default-start.gif'
      // },
      message: {
        menuName: '消息提醒',
        imageUrl: 'aicosicon aicos-icon-info-02'
      },
      staticList: [
        {
          menuName: '我的',
          cmd: 'dashboard',
          imageUrl: 'aicosicon aicos-icon-application'
        },
        {
          menuName: '搜索',
          cmd: 'search',
          imageUrl: 'aicosicon aicos-icon-search'
        },
        {
          menuName: '返回桌面',
          cmd: 'showDesk',
          imageUrl: 'aicosicon aicos-icon-home'
        }
      ],
      setting: {
        id: 'inner-desktopSetting',
        menuName: '显示设置',
        imageUrl: 'menu-icon-img desplay-setting',
        linkUrl: '/desktopSetting/index',
        noPadding: true,
        maximized: true
      },
      versionInfo: {
        id: 'inner-updateLog',
        menuName: '升级日志',
        imageUrl: 'el-icon-document',
        linkUrl: '/updateLog/index'
      },
      popoverList: [
        'message',
        'updateLog'
      ],
      statusWidth: 0
    }
  },
  computed: {
    taskbarPadding() {
      return {
        paddingLeft: `${this.statusWidth}px`
      }
    }
  },
  methods: {
    isActive(item) {
      const list = this.winList.filter(item => item.visible)
      return item.visible && list.every(cur => {
        return item.zIndex >= cur.zIndex
      })
    },
    handleStartClick() {
      // this.desktop.visibleStartMenu = !this.desktop.visibleStartMenu
      this.desktop.hiddenExcept('visibleStartMenu')
    },
    isStaticActive(item) {
      const map = {
        dashboard: 'visibleDashboard',
        search: 'visibleSearch'
      }
      return this.desktop[map[item.cmd]]
    },
    handleStaticItemClick(item) {
      const map = {
        dashboard: 'visibleDashboard',
        search: 'visibleSearch'
      }
      this.desktop.hiddenExcept(map[item.cmd])
      this.hiddenPopoverExcept()
      if (item.cmd === 'showDesk') {
        this.desktop.hiddenAllWin()
      }
    },
    getStaticItemsPos() {
      const list = this.$refs.static
      let temp = {}
      list.forEach(item => {
        const key = item.data.cmd
        temp[key] = item.$el.offsetLeft
      })
      this.desktop.staticPos = temp
    },
    handleSettingClick() {
      this.desktop.handleItemClick(this.setting)
      this.hiddenPopoverExcept()
    },
    handleVersionClick() {
      this.desktop.handleItemClick(this.versionInfo)
      this.hiddenPopoverExcept()
    },
    handleTaskItemClick(item) {
      this.hiddenPopoverExcept()
      this.handleItemClick(item)
    },
    popoverClick(cur) {
      this.desktop.hiddenExcept()
      this.hiddenPopoverExcept(cur)
    },
    hiddenPopoverExcept(obj) {
      this.popoverList.forEach(item=> {
        if(item !== obj) {
          const ref = this.$refs[item]
          if(ref.doClose) {
            ref.doClose()
          }else {
            ref.closePopover()
          }
        }
      })
    },
    getStatusBarWidth() {
      const statusEl = this.$refs.status
      this.statusWidth = statusEl.offsetWidth
    }
  },
  mounted() {
    this.getStaticItemsPos()
    this.getStatusBarWidth()
  }
}
</script>

<style lang="scss" scoped>
.huilan-taskbar {
  display: flex;
  height: 50px;
  background: rgba(255,255,255,0.6);
  user-select: none;
  backdrop-filter: blur(10px);
  // 设置backdrop-filter后需要设置z-index
  z-index: 1000;

  .taskbar-center {
    flex: 1;
    text-align: center;

    .Huilan-taskbar-item:nth-child(1),.Huilan-taskbar-item:nth-child(2) {
      &.active {
        padding-top: 5px;
        transform: scale(1.1);
      }
    }
    .Huilan-taskbar-item:nth-child(3) {
      &:after {
        display: none;
      }
    }
  }

  .version-item {
    margin-top: 15px;
    font-size: 18px;
  }

  /deep/ .item-icon {
    width: 32px;
    height: 32px;
    text-align: center;
    line-height: 32px;
    background-position: center;
    background-repeat: no-repeat;
    background-size: contain;

    i {
      color: #03080b;
      font-size: 32px;
    }
  }
}
</style>
<style lang="scss">
.update-log-popover {
  background: rgba(255,255,255, 0.8);
  backdrop-filter: blur(10px);

  .el-popover__title {
    font-weight: 700;
    color: #070b2d;
  }
}
</style>
