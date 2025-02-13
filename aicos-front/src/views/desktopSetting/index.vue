<template>
  <div class="desk-setting" :style="bgStyle">
    <div class="bg-select-container">
      <el-container style="background: #ededf4cc;">
        <el-aside width="170px">
          <h2
            class="setting-header"
            @click="handleExpand"
          >背景选择&emsp;<i :class="expand ? 'el-icon-arrow-down' : 'el-icon-arrow-up'"></i></h2>
          <div v-show="expand" style="padding: 70px 0 0 70px">
            <el-checkbox
              v-model="stretch"
              true-label="1"
              false-label="0"
            >拉伸</el-checkbox>
          </div>
        </el-aside>
        <el-main>
          <WallpaperList :visible="expand" ref="wallpaper"/>
        </el-main>
      </el-container>
    </div>
    <IconList ref="iconList"/>
    <div class="desk-setting-footer">
      <el-button size="small" type="primary" @click="saveSetting">保存设置</el-button>
      <el-button size="small" @click="cancel">&#12288;取消&#12288;</el-button>
    </div>
  </div>
</template>

<script>
import WallpaperList from './wallpaperList'
import IconList from './iconList'
import { setDesktopBackground, updateIconStatus } from '@/api/desktopSetting'
import {mapState} from "vuex";
export default {
  name: 'index',
  components: {
    WallpaperList,
    IconList
  },
  inject: ['desktopWindow'],
  data() {
    return {
      stretch: this.$store.state.common.desktopBgSetting.stretch,
      expand: false
    }
  },
  computed: mapState({
    bgStyle(state) {
      const bgSetting = state.common.desktopBgSetting;
      const style = {
        backgroundImage:`url(${bgSetting.url})`,
        backgroundSize: bgSetting.stretch === '1' ? 'cover' : ''
      }
      return style
    }
  }),
  methods: {
    handleExpand() {
      this.expand = !this.expand
    },
    closeWindow() {
      if(this.desktopWindow) {
        this.desktopWindow.close()
      }
    },
    async saveBgSetting() {
      const { wallpaper } = this.$refs
      // 保存背景设置
      const bgSetting = {
        id: wallpaper.select.id,
        stretch: this.stretch
      }
      await setDesktopBackground(bgSetting)
      const data = {
        ...wallpaper.select,
        stretch: this.stretch
      }
      this.$store.commit('SET_DESKTOPBG_SETTING', data)
    },
    async saveIconSetting() {
      const { iconList } = this.$refs
      const data = iconList.getData()
      await updateIconStatus(data)
      this.$store.commit('SET_MENU', data)
    },
    saveSetting() {
      const promise1 = this.saveBgSetting()
      const promise2 = this.saveIconSetting()
      Promise.all([promise1,promise2]).then(()=> {
        this.$message.success('保存成功！')
        this.closeWindow()
      })
    },
    cancel() {
      this.closeWindow()
    }
  }
}
</script>

<style lang="scss" scoped>
.desk-setting {
  //position: relative;
  min-height: 100%;
  padding-bottom: 70px;

  .bg-select-container {
    position: relative;
    height: 48px;
    z-index: 2;
  }

  .setting-header {
    margin:0;
    padding: 0 0 0 70px;
    font-size: 16px;
    color: #070b2d;
    font-weight: 400;
    line-height: 3em;
    cursor: pointer;
    user-select: none;

     i {
       color: #9597a0;
     }
  }
}
.desk-setting-footer {
  position: absolute;
  left: 50%;
  bottom: 0;
  //width: 100%;
  padding: 20px;
  transform: translateX(-50%);
  //text-align: center;
  //background: #fff;
  z-index: 1;

  .el-button {
    box-shadow: 0 2px 16px 3px rgba(23, 23, 23, 0.3);
  }

  .el-button--primary {
    margin-right: 40px;
    background: #205ac8;
    border-color: #205ac8;

    &:focus,&:hover {
      background: #3c6fce;
      border-color: #3c6fce;
      color: #FFF
    }
  }
}
</style>
