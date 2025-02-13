<template>
  <HuilanBasic>
    <!-- <el-row> -->
      <!-- <el-col
        :span="12"
        style="height: 100%; border-right: 5px solid #edeef1; background: #fff"
      >
        <div class="kw-base-container">
          <div class="title">{{ $t("kwRobotManage.moduleName") }}</div>
          <div class="choose-languag">
            <el-dropdown @command="handleCommand">
              <span class="el-dropdown-link">
                {{ language }}<i class="el-icon-arrow-down el-icon--right"></i>
              </span>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item command="Chinese">中文</el-dropdown-item>
                <el-dropdown-item command="English">英文</el-dropdown-item>
                <el-dropdown-item command="Japanese">日文</el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
          </div>
          <div class="imgContainer">
            <img :src="imgUrl" alt="" />
          </div>
        </div>
      </el-col> -->
      <!-- <el-col
        :span="24"
        style="height: 100%; background: #fff"
      > -->
        <div class="kw-base-container">
          <ModelTable></ModelTable>
        </div>
      <!-- </el-col> -->
    <!-- </el-row> -->
  </HuilanBasic>
  <!-- <div class="kw-base-container">
    <div class="imgContainer">这会是一张图片</div>
    <div class="operateBtn">
      <el-button size="small" type="success" round @click="drawer = true">{{
        $t("kwCompetence.modelManage")
      }}</el-button>
    </div>
    <el-drawer
      :title="$t('kwCompetence.modelManage')"
      append-to-body
      size="50%"
      :visible.sync="drawer"
      direction="rtl"
      :before-close="handleClose"
    >
      <ModelTable v-if="drawer" />
    </el-drawer>
  </div> -->
</template>

<script>
import ModelTable from "./modelTable";
var firstImg = require("./image/first.png");
var secondImg = require("./image/second.png");
var thirdImg = require("./image/third.png");
var fourthImg = require("./image/fourth.png");
var imgArr = [firstImg, secondImg, thirdImg, fourthImg];
export default {
  inject: ["desktopWindow", "desktop"],
  data() {
    return {
      allWindowTopBodyHeight: 0, //窗口的高度
      drawer: false,
      language: "中文",
      imgUrl: imgArr[0],
      timer: "",
      num: 0,
    };
  },
  components: {
    ModelTable,
  },
  methods: {
    //动态获取窗口大小
    desktopWindowResize() {
      this.allWindowTopBodyHeight = this.desktopWindow.$el.getElementsByClassName(
        "desk-window-inner"
      )[0].offsetHeight;
    },
    handleCommand(command) {
      if (command == "Chinese") {
        this.language = "中文";
      } else if (command == "English") {
        this.language = "英文";
      } else {
        this.language = "日文";
      }
    },
  },
  mounted() {
    if(this.desktopWindow) {

      this.allWindowTopBodyHeight = this.desktopWindow.$el.getElementsByClassName(
        "desk-window-inner"
      )[0].offsetHeight;
      //监听窗口变化,重新获取新的窗口大小
      this.desktopWindow.$on("resize", this.desktopWindowResize);
    }
    this.timer = setInterval(() => {
      this.num++;
      if (this.num >= imgArr.length) {
        this.num = 0;
      }
      this.imgUrl = imgArr[this.num];
    }, 5000);
  },
  beforeDestroy() {
    //组件销毁取消监听
    if (this.desktopWindow) {
      this.desktopWindow.$off("resize", this.desktopWindowResize);
    }
    clearInterval(this.timer);
  },
};
</script>

<style lang="scss" scoped>
.imgContainer {
  width: 100%;
  height: calc(100% - 80px);
  display: flex;
  align-items: center;
  justify-content: center;
}
.operateBtn {
  text-align: center;
}
.title {
  font-size: 24px;
  font-weight: 700;
  color: rgb(7, 11, 45);
  text-align: center;
}
.choose-languag {
  text-align: center;
  cursor: pointer;
}
</style>
