<template>
  <div class="waveFrom">
    <el-row>
      <el-col :span="1" style="text-align: center">
        <el-button type="text" @click="playMusic">
          <i :class="isPlay ? 'el-icon-video-pause' : 'el-icon-video-play'" style="font-size: 35px"></i>
        </el-button>
      </el-col>
      <el-col :span="14">
        <div class="cardWaveform">
          <el-card :body-style="{ padding: '10px' }">
            <div id="waveform" ref="waveform"></div>
          </el-card>
          <div>
            <i>{{ currentTime }}&nbsp;/&nbsp;{{ allTime }}</i>
          </div>
        </div>
      </el-col>
      <el-col :span="4">
        <el-dropdown size="small" @command="changeSpeed">
          <span class="audio-speed">{{ $t("system.asrAndTts.doubleSpeed") + ':' }}{{ speed }}X<i
              class="el-icon-arrow-down el-icon--right"></i></span>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item v-for="(item, index) in multipleArray" :key="index" :command="item">
              {{ item }}X
            </el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
      </el-col>
      <el-col :span="5">
        <div class="block">
          <img src="~@/assets/kwRobotTrain/hautParleur.png" alt="" width="35" />
          <el-slider v-model="volume" @change="changeVolume" style="margin-left: 10px; width: 150px"></el-slider>
        </div>
      </el-col>
    </el-row>
  </div>
</template>
<script>
import { formatSeconds } from "@/util/date";
import WaveSurfer from "wavesurfer.js";
// import Timeline from "wavesurfer.js/dist/plugin/wavesurfer.timeline.js";
import serviceList from "@/config/serviceList";
import { baseURL } from "@/api/common";
const { ai } = serviceList;
export default {
  props: {
    item: {
      type: String,
      default: "",
    },
  },
  data () {
    return {
      currentTime: "00:00:00",
      allTime: "00:00:00",
      // 录音
      volume: 0,
      isPlay: false, // 是否正在播放
      multipleArray: [0.75, 1, 1.5, 2], // 倍速设置
      speed: 1,
      wavesurfer: null,
    };
  },
  mounted () {
    const _this = this;
    this.$nextTick(() => {
      this.wavesurfer = WaveSurfer.create({
        container: this.$refs.waveform,
        forceDecode: true,
        barHeight: 1, // 波形条的高度
        // audioRate: $('#speedChange select').val(), //播放速率
        cursorColor: "#ff0000", //指示播放头位置的光标填充颜色
        progressColor: "#0000ff", //已播放进度条颜色
        scrollParent: true, //要使波形滚动
        height: 40, //波形高度
        // maxCanvasWidth: '300px',
        cursorWidth: 2, //指示宽度
        autoCenter: false, //
        fillParent: true,
        minPxPerSec: "0.5", // 每秒音频的最小像素数
        hideScrollbar: false, // 是否在正常显示时隐藏水平滚动条
        // 插件
        // plugins: [
        //   // 使用时间轴插件
        //   Timeline.create({
        //     container: "#wave-timeline",
        //   }),
        // ],
      });
      // 特别提醒：此处需要使用require(相对路径)，否则会报错
      this.wavesurfer.load(
        `${baseURL}api/${ai}/asr/asrconfigure/test/tts?dataId=${_this.item}`
      );
      _this.wavesurfer.on("ready", function () {
        //获取音频总时长
        let totalTime = formatSeconds(
          _this.wavesurfer.getDuration() * 1000,
          true
        );
        _this.allTime = totalTime;
      });
      _this.wavesurfer.on("audioprocess", function () {
        let duringTime = formatSeconds(
          _this.wavesurfer.getCurrentTime() * 1000,
          true
        );
        _this.currentTime = duringTime;
      });
      // 获取默认音量
      this.volume = this.wavesurfer.getVolume() * 100;
      this.wavesurfer.on("pause", function () {
        _this.isPlay = false;
        _this.$forceUpdate();
      });
      //鼠标点击时触发
      this.wavesurfer.on("seek", function () { });
    });
  },
  methods: {
    pause () {
      this.wavesurfer.pause();
    },
    // 改变音量
    changeVolume () {
      this.wavesurfer.setVolume(this.volume / 100);
    },
    /** 设置倍速播放 */
    changeSpeed (command) {
      this.wavesurfer.setPlaybackRate(command);
      this.speed = command;
    },
    // 播放声纹
    playMusic () {
      this.isPlay = !this.isPlay;
      // "播放/暂停"按钮的单击触发事件，暂停的话单击则播放，正在播放的话单击则暂停播放
      if (this.isPlay) {
        this.wavesurfer.play();
      } else {
        this.wavesurfer.pause();
      }
    },
  },
};
</script>
<style lang="scss" scoped>
.waveFrom {
  .el-row {
    display: flex;
    align-items: center;
  }

  .block {
    display: flex;
    align-items: center;
  }

  .cardWaveform {
    display: flex;
    align-items: center;

    .el-card {
      width: calc(100% - 155px);
    }
  }
}
</style>
