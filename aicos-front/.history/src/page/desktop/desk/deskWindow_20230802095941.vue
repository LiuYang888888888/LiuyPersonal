<template>
  <transition appear>
    <div class="desk-window" :style="style" v-show="visible">
      <el-container style="height: 100%">
        <el-aside v-if="hasLeft" width="200px" class="sub-menu">
          <slot name="left">
            <template v-if="data.leftComponent">
              <component ref="leftCmp" :is="leftCmp"></component>
            </template>
            <template v-else>
              <div class="left-menu-header">
                <DesktopIcon class="header-icon" :data="data" />
                <h3>{{ data.menuName }}</h3>
              </div>
              <el-menu
                :default-active="firstMenu.code"
                background-color="#205ac8"
                text-color="#fff"
                active-text-color="#070b2d"
                class="desk-left-menu"
                @select="handleSlect"
              >
                <SubMenu
                  v-for="menu in data.menuList"
                  :key="menu.id"
                  :data="menu"
                />
              </el-menu>
            </template>
          </slot>
        </el-aside>
        <el-main>
          <div
            class="desk-window-head"
            :style="hasLeft ? 'justify-content: flex-end;' : ''"
            draggable="true"
            @dragstart="handleDragStart"
            @dragend="handleDragEnd"
          >
            <template v-if="!hasLeft">
              <DesktopIcon class="header-icon" :data="data" />
              <h3>{{ data.menuName }}</h3>
            </template>
            <div ref="topSapce" class="header-space">
              <template v-if="data.topComponent">
                <compnent ref="topCmp" :is="topCmp"></compnent>
              </template>
              <KwRobotTrain
                v-if="KwRobotTrainTag"
                @state='changeStatus'
                style="display: flex; justify-content: flex-end"
              />
            </div>
            <ul class="tool-bar">
              <li title="最小化" @click="mini">
                <i class="el-icon-minus"></i>
              </li>
              <li :title="isMax ? '还原' : '最大化'" @click="maxOrrestore">
                <i class="el-icon-copy-document"></i>
              </li>
              <li class="tool-close-btn" title="关闭" @click="close">
                <i class="el-icon-close"></i>
              </li>
            </ul>
          </div>
          <div
            class="desk-window-body"
            :class="data.noPadding ? 'desk-window-body-nopadding' : ''"
          >
            <div class="desk-window-inner">
              <!--              <el-scrollbar :wrapStyle="scrollWrapStyle">-->
              <slot>
                <template v-if="data.rightComponent">
                  <compnent ref="rightCmp" :is="rightCmp"></compnent>
                </template>
                <template v-else>
                  <NormalIframe v-if="isIframe" :src="iframeUrl" />
                  <compnent v-else :is="cmp"></compnent>
                </template>
              </slot>
              <!--              </el-scrollbar>-->
            </div>
          </div>
        </el-main>
      </el-container>
    </div>
  </transition>
</template>

<script>
import DesktopIcon from "../components/desktopIcon";
import NormalIframe from "@/components/iframe/normal";
import scrollbarWidth from "element-ui/lib/utils/scrollbar-width";
import SubMenu from "./SubMenu";
//机器人训练Demo组件
import KwRobotTrain from "@/components/kwRobotTrain/index";
import draggable from "../mixins/draggable";
import { isURL } from "@/util/validate";
import { createRemoteComponent } from "@/util/util";
import { addTicket } from "@/api/user";

export default {
  name: "deskWindow",
  components: {
    DesktopIcon,
    NormalIframe,
    SubMenu,
    KwRobotTrain,
  },
  mixins: [draggable],
  provide() {
    return {
      desktopWindow: this,
    };
  },
  props: {
    visible: {
      type: Boolean,
      default: false,
    },
    /**
     * width： 宽度
     * height： 高度
     * noPadding: 是否有padding
     * maximized: 最大化
     * leftComponent: component 放在左侧的组件
     * rightComponent: component 放在右侧的组件
     * topComponent: component 放在标题栏的组件
     *
     * 。。。
     */
    data: {
      type: Object,
      default() {
        return {};
      },
    },
  },
  data() {
    this.moduleRemoteCache = {};
    return {
      KwRobotTrainTag: false,
      // showFlag: true
      isMax: this.data.maximized || false,
      isIframe: false,
      iframeUrl: "",
      cmp: "",
      scrollWrapStyle: [
        {
          height: `calc(100% + ${scrollbarWidth()}px)`,
        },
      ],
      socketStatus:null,
    };
  },
  computed: {
    hasLeft() {
      let res = false;
      if (this.data.leftComponent) {
        res = true;
      }
      if (this.data.menuList && this.data.menuList.length > 0) {
        res = true;
      }
      return res;
    },
    width() {
      return this.data.width || "60%";
    },
    height() {
      return this.data.height || "60%";
    },
    dataMap() {
      const map = {};
      const list = [...this.data.menuList];
      let index = 0;
      let next = list[index];
      while (next) {
        if (next.menuList && next.menuList.length > 0) {
          list.push(...next.menuList);
        } else {
          // 只用将没有自己的菜单放入map即可
          map[next.code] = next;
        }
        index++;
        next = list[index];
      }

      return map;
    },
    firstMenu() {
      const menuList = this.data.menuList;
      let res = {};
      if (menuList && menuList.length > 0) {
        let first = menuList[0];
        while (first) {
          const childrenMenus = first.menuList;
          if (childrenMenus && childrenMenus.length > 0) {
            first = childrenMenus[0];
          } else {
            break;
          }
        }
        res = first;
      }
      return res;
    },
    leftCmp() {
      let res = this.data.leftComponent;
      if (!res) {
        res = "div";
      }
      return res;
    },
    rightCmp() {
      let res = this.data.rightComponent;
      if (!res) {
        res = "div";
      }
      return res;
    },
    topCmp() {
      let res = this.data.topComponent;
      if (!res) {
        res = "div";
      }
      return res;
    },
  },
  mounted() {
    // 单独处理知识中心
    if (this.data.code == "knowledgeCenter") {
      this.KwRobotTrainTag = true;
    } else {
      this.KwRobotTrainTag = false;
    }

    if (this.hasLeft) {
      if (!this.data.leftComponent) {
        this.handleSlect(this.firstMenu.code);
      }
    } else {
      this.buildContent(this.data);
    }
  },
  methods: {
    getCmp(data) {
      let cmp = {
        default: "div",
      };
      // if (isURL(data.linkUrl)) {
      //   cmp = require('@/components/iframe/normal')
      // }
      try {
        cmp = require(`@/views${data.linkUrl}.vue`);
      } catch (e) {
        try {
          cmp = require(`@/views${data.linkUrl.replace("/index", "")}.vue`);
        } catch (err) {
          this.$message.error(`未找到模块:${data.menuName}`);
          // 将未找到的模块的窗口删除
          this.$nextTick(() => {
            this.close();
          });
        }
      }
      return cmp.default;
    },
    buildContent(data) {
      if (isURL(data.linkUrl)) {
        if (data.desktopType === "out") {
          this.isIframe = false;
          if (data.isSso === 1) {
            addTicket(data.linkUrl).then((newURL) => {
              window.open(newURL);
            });
          } else {
            window.open(data.linkUrl);
          }
          // window.open(data.linkUrl)
        } else {
          this.isIframe = true;
          if (data.isSso === 1) {
            addTicket(data.linkUrl).then((newURL) => {
              this.iframeUrl = newURL;
            });
          } else {
            // window.open(data.linkUrl)
            this.iframeUrl = data.linkUrl;
          }
        }
      } else if (data.moduleRemote === 1) {
        this.isIframe = false;
        let cmp = this.moduleRemoteCache[data.linkUrl];
        if (!cmp) {
          cmp = createRemoteComponent(data);
          this.moduleRemoteCache[data.linkUrl] = cmp;
        }
        this.cmp = cmp;
      } else {
        this.isIframe = false;
        this.cmp = this.getCmp(data);
      }
    },
    handleSlect(key /*, keyPath*/) {
      const data = this.dataMap[key];
      this.buildContent(data);
    },
    mini() {
      this.$emit("update:visible", false);
      this.$emit("mini");
    },
    maxOrrestore() {
      this.isMax = !this.isMax;
      const event = this.isMax ? "max" : "restore";
      // this.getstyle()
      this.$emit(event);
      this.$nextTick(() => {
        this.$emit("resize");
      });
    },
    changeStatus(params){
      this.socketStatus = params
    },
    close() {
      // if(this.socketStatus !==null){
      //   this.$socket.disconnect()
      // }
      this.$emit("close", this.data);
    },
  },
};
</script>

<style lang="scss" scoped>
/deep/ .el-scrollbar__bar.is-horizontal {
  display: none;
}
.v-enter-active,
.v-leave-active {
  transition-property: transform, opacity;
  transition-duration: 0.5s;
}
.v-enter,
.v-leave-to {
  transform: scale(0.1);
  opacity: 0;
}
.desk-window {
  position: absolute;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  background: #f8f9fa;
  border-radius: 5px;
  overflow: hidden;
}
.desk-window-head {
  display: flex;
  padding: 10px 20px;
  border-bottom: 1px solid #eeeeee;
  background: #fff;

  .header-icon {
    font-size: 15px;
  }

  h3 {
    //flex: 1;
    margin: 0;
    padding: 0 10px;
    font-size: 18px;
    font-weight: 400;
    line-height: 32px;
    color: #070b2d;
  }
  .header-space {
    flex: 1;
    cursor: move;
  }
  .tool-bar {
    margin: 0;
    padding: 0;
    list-style-type: none;

    li {
      display: inline-block;
      padding: 6px 8px;
      font-size: 18px;
      color: #070b2d;

      &:hover {
        background: #eef0f6;

        &.tool-close-btn {
          background: red;
          color: #fff;
        }
      }
    }
  }
}
.sub-menu {
  overflow-y: scroll;
  overflow-x: hidden;
  background: #205ac8;
  scrollbar-width: thin;
}
.desk-window-body {
  height: calc(100% - 54px);
  //padding: 20px;

  &.desk-window-body-nopadding {
    padding: 0;
  }
}
.desk-window-inner {
  height: 100%;
  //background: #fff;
  border-radius: 5px;
  box-shadow: 0 6px 20px 20px rgba(4, 7, 46, 0.05);
  overflow: auto;

  /deep/.el-scrollbar {
    height: 100%;
  }

  /deep/.el-row:first-child,
  .basic-container:first-child {
    margin: 20px 14px;
  }
}

.left-menu-header {
  padding: 20px 0;
  text-align: center;
  color: #fff;

  .header-icon {
    font-size: 20px;
  }

  h3 {
    margin: 10px 0 0;
    font-size: 18px;
    font-weight: 400;
  }
}
.desk-left-menu {
  height: calc(100% - 233px);

  /deep/.el-menu-item {
    height: 48px;
    line-height: 48px;
    padding-left: 30px !important;
    font-size: 16px;

    i {
      color: #fff;
    }
    &.is-active {
      background: #fff !important;

      &:before {
        content: "";
        position: absolute;
        left: 15px;
        top: 50%;
        width: 6px;
        height: 20px;
        margin-top: -10px;
        background: #225cc2;
        border-radius: 3px;
      }

      i {
        color: #070b2d;
      }
    }
  }

  /deep/.el-submenu {
    .el-submenu__title {
      height: 48px;
      line-height: 48px;
      padding-left: 30px !important;
      font-size: 16px;

      i {
        color: #fff;
      }
    }
    .el-menu {
      padding-left: 30px;
    }
  }
}
</style>
