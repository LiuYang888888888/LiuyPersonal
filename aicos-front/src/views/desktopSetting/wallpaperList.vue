<template>
  <div class="wallpaper-container" v-show="visible">
<!--    <button-->
<!--      v-if="min != 0"-->
<!--      v-show="left != 0"-->
<!--      type="button"-->
<!--      class="el-carousel__arrow el-carousel__arrow&#45;&#45;left"-->
<!--      @click="handleArrowLeft"-->
<!--    >-->
<!--      <i class="el-icon-arrow-left"></i>-->
<!--    </button>-->
<!--    <button-->
<!--      v-if="min != 0"-->
<!--      v-show="left != min"-->
<!--      type="button"-->
<!--      class="el-carousel__arrow el-carousel__arrow&#45;&#45;right"-->
<!--      @click="handleArrowRight"-->
<!--    >-->
<!--      <i class="el-icon-arrow-right"></i>-->
<!--    </button>-->
    <div class="wapper-list-con">
      <ul ref="wapperList" class="wapper-list" :style="listStyle">
        <li
          v-for="item in list"
          :key="item.id"
          :class="select.id == item.id ? 'active' : ''"
          @click="handleItemClick(item)"
        >
          <i
            v-if="item.isUserUpload == '1'&& item.id !== select.id && curBg.id !== item.id"
            class="el-icon-delete"
            title="删除"
            @click.stop="removeWallpaper(item)"
          ></i>
<!--          <i v-if="select.id == item.id" class="el-icon-circle-check"></i>-->
          <img :src="item.thumbUrl" />
        </li>
<!--        <li>-->
<!--          <el-upload-->
<!--            title="上传背景图片"-->
<!--            class="img-uploader"-->
<!--            :action="uploadUrl"-->
<!--            :accept="accept"-->
<!--            :data="data"-->
<!--            :headers="headers"-->
<!--            :show-file-list="false"-->
<!--            :on-success="uploadSuccess"-->
<!--          >-->
<!--            <i class="el-icon-plus"></i>-->
<!--          </el-upload>-->
<!--        </li>-->
        <li>
          <HuilanUploader
            title="上传背景图片"
            class="img-uploader"
            :action="uploadUrl"
            :accept="accept"
            :data="data"
            :show-file-list="false"
            :on-success="uploadSuccess"
          >
            <i class="el-icon-plus"></i>
          </HuilanUploader>
        </li>
      </ul>
    </div>
    <ul
      class="wallpaper-nav"
      v-if="pageCount > 1"
    >
      <li
        v-for="index in pageCount"
        :key="index"
        :class="curPage == index ? 'active': ''"
        @click="changePage(index)"
      >&nbsp;</li>
    </ul>
  </div>
</template>

<script>
import { getImageUploadAndCreateThumbUrl } from '@/api/common'
import { getAllDesktopBackground, add, remove } from '@/api/desktopSetting'
// import website from '@/config/website';
// import {getToken} from '@/util/auth';
import HuilanUploader from '@/components/uploader'
import {baseURL} from '@/api/common';

export default {
  name: "wallpaperList",
  components: {
    HuilanUploader
  },
  inject: ['desktopWindow'],
  props: {
    visible: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      list: [
        // 'img/bg/default.png',
        // 'img/bg/bg1.png',
        // 'img/bg/bg2.png',
        // 'img/bg/bg3.jpg',
        // 'img/bg/bg4.jpg',
        // 'img/bg/cloud.jpg',
        // 'img/bg/star-squashed.jpg'
      ],
      // left: 0,
      // min: 0,
      baseHeight: 134,
      //页数
      pageCount: 1,
      curPage: 1,
      select: this.$store.state.common.desktopBgSetting,
      uploadUrl: getImageUploadAndCreateThumbUrl(),
      accept: 'image/*',
      // headers: {
      //   [website.tokenHeader]: getToken()
      // },
      data: {
        width: 120,
        quality: 1,
      },
      isFirst: true
    }
  },
  computed: {
    curBg() {
      return this.$store.state.common.desktopBgSetting
    },
    listStyle() {
      return {
        transform: `translateY(-${(this.curPage - 1) * this.baseHeight}px)`
      }
    }
  },
  watch: {
    visible(val) {
      if(val && this.isFirst) {
        this.$nextTick(()=> {
          this.getCount()
        })
        this.isFirst = false
      }
    }
  },
  methods: {
    changePage(index) {
      this.curPage = index
    },
    // handleArrowClick(dir) {
    //   let res = this.left + dir * 400
    //   if(res > 0) {
    //     res = 0
    //   }
    //   if(res < this.min) {
    //     res = this.min
    //   }
    //   this.left = res
    // },
    // handleArrowLeft() {
    //   this.handleArrowClick(1)
    // },
    // handleArrowRight() {
    //   this.handleArrowClick(-1)
    // },
    handleItemClick(item) {
      if(item.id !== this.select.id) {
        this.select = item
      }
    },
    async uploadSuccess(response/*, file, fileList*/) {
      const {data, success, msg} = response
      if(!success) {
        this.$message.error(msg)
        return
      }
      const postData = {
        url: `${baseURL}${data.newFileName.replace(/^\//, '')}`,
        thumbUrl: `${baseURL}${data.thumbPath.replace(/^\//, '')}`
      }
      await add(postData)
      // this.list.push(data.thumbPath)
      this.getImgList()

    },
    getCount() {
      const wapperList = this.$refs.wapperList

      this.pageCount = Math.ceil(wapperList.scrollHeight / this.baseHeight)
    },
    async getImgList() {
      const {data: {data}} = await getAllDesktopBackground()
      this.list = data
      this.$nextTick(()=> {
        this.getCount()
      })
    },
    async removeWallpaper(item) {
      await remove(item.id)
      this.$message.success('删除成功！')
      this.getImgList()
    },
    handleResize() {
      this.getCount()
      this.curPage = 1
    }
  },
  mounted() {
    this.getImgList()
    if(this.desktopWindow) {
      this.desktopWindow.$on('resize', this.handleResize)
    }
  },
  beforeDestroy() {
    if(this.desktopWindow) {
      this.desktopWindow.$off('resize', this.handleResize)
    }
  }
}
</script>

<style lang="scss" scoped>
.wallpaper-container {
  position: relative;
  padding: 13px 20px;
  //margin: 10px 0;
  //background: #f1f3f4;
}
.wapper-list-con {
  height: 134px;
  overflow: hidden;
}
.wapper-list {
  padding:0;
  margin: 0;
  display: flex;
  flex-wrap: wrap;
  transition: transform 0.5s;

  li {
    position: relative;
    width: 192px;
    height: 108px;
    margin: 13px 8px;
    flex-shrink: 0;
    list-style-type: none;
    //overflow: hidden;
    cursor: pointer;

    &.active {

      &:after {
        content: '';
        position: absolute;
        left: 50%;
        bottom: -10px;
        width: 20px;
        height: 2px;
        margin-left: -10px;
        background: #2159c3;
      }
    }

    img {
      width: 100%;
      height: 100%;
      display: block;
      object-fit: contain;
    }

    i {
      position: absolute;
      left: 50%;
      top: 50%;
      font-size: 2em;
      color: #fff;
      transform: translate(-50%, -50%);

      &.el-icon-delete {
        left: 88%;
        top: 15%;
        font-size: 1em;
        color: #606266;

        &:hover {
          opacity: 0.6;
        }
      }

    }
  }
  .img-uploader {
    height: 100%;
    border: 1px dashed #fff;
    border-radius: 5px;

    /deep/.el-upload {
      width: 100%;
      height: 100%;
    }

    &:hover {
      opacity: 0.6;
    }
  }
}
.wallpaper-nav {
  position: absolute;
  right: 30px;
  top: 50%;
  transform: translateY(-50%);
  margin:0;
  padding: 0;
  list-style-type: none;
  user-select: none;

  li{
    width: 12px;
    height: 12px;
    margin: 8px 0;
    border-radius: 50%;
    border: 1px solid #fff;
    cursor: pointer;
    overflow: hidden;

    &.active {
      background: #fff;
    }
  }
}
</style>
