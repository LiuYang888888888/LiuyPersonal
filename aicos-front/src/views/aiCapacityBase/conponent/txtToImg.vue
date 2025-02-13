<template>
  <div class="txtToImg">
    <el-carousel :interval="5000" arrow="always" height="500px">
      <el-carousel-item v-for="(item, index) in datas" :key="item" style="overflow-y: auto;">
        <img :src="item.thumbUrl" @click="openPreview(index)" style="">
      </el-carousel-item>
    </el-carousel>
    <div style="display: flex; margin-top: 20px;overflow-x: auto;height: 162px;">
      <img class="selfImg" v-for="(d, index) of datas" :src="d.thumbUrl" :key="index" @click="openPreview(index)">
    </div>
  </div>
</template>
<script>
export default {
  name: "txtToImg",
  components: {
  },
  props: {
  },
  data() {
    // const self = this
    return {
      datas: [
        // { thumbUrl: `https://img.alicdn.com/tfs/TB1uevcCrj1gK0jSZFuXXcrHpXa-1880-640.jpg`, url: `https://img.alicdn.com/tfs/TB1uevcCrj1gK0jSZFuXXcrHpXa-1880-640.jpg` },
        // { thumbUrl: `https://img.alicdn.com/tfs/TB1v28TC8v0gK0jSZKbXXbK2FXa-1880-640.jpg`, url: `https://www.w3school.com.cn/i/movie.ogg` },
        // { thumbUrl: `https://img.alicdn.com/tfs/TB1v28TC8v0gK0jSZKbXXbK2FXa-1880-640.jpg`, url: `https://www.w3school.com.cn/i/movie.ogg` },
        // { thumbUrl: `https://img.alicdn.com/tfs/TB1v28TC8v0gK0jSZKbXXbK2FXa-1880-640.jpg`, url: `https://www.w3school.com.cn/i/movie.ogg` },
        // { thumbUrl: `https://img.alicdn.com/tfs/TB1v28TC8v0gK0jSZKbXXbK2FXa-1880-640.jpg`, url: `https://www.w3school.com.cn/i/movie.ogg` },
        // { thumbUrl: `https://img.alicdn.com/tfs/TB1v28TC8v0gK0jSZKbXXbK2FXa-1880-640.jpg`, url: `https://www.w3school.com.cn/i/movie.ogg` },
      ]
    };
  },
  computed: {},
  created() {

  },
  methods: {
    init(data) {
      if (data.length > 0) {
        const arr = []
        data.map(v => {
          let str = "data:audio/wav;base64," + v
          let obj = { thumbUrl: str, url: str }
          arr.push(obj)
        })
        this.datas = arr
      }
    },
    openPreview(index = 0) {
      this.$ImagePreview(this.datas, index, {
        closeOnClickModal: true,
        // click: (data, index) => {
        //   this.$message.success('点击事件' + index)
        // },
        // beforeClose: () => {
        //   this.$message.success('关闭回调')
        // }
      });
    }
  },
};
</script>

<style lang="scss" scoped>
.el-carousel__item h3 {
  color: #475669;
  font-size: 18px;
  opacity: 0.75;
  line-height: 300px;
  margin: 0;
}

.el-carousel__item {
  // background-color: #99a9bf;
  border: 1px solid #99a9bf;
  overflow-x: auto;
}

.el-carousel__item:nth-child(2n) {
  // background-color: #99a9bf;
}

.el-carousel__item:nth-child(2n+1) {
  // background-color: #d3dce6;
}

.selfImg {
  border: 0;
  margin-right: 4px;
  width: 200px;
  height: 150px;
  object-fit: cover;
  /* 填充整个元素 */
}
</style>
