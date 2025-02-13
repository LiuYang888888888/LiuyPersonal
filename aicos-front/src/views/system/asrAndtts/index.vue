<template>
  <HuilanBasic>
    <!-- <HuilanBasic hasTab> -->
    <el-tabs v-model="activeName" @tab-click="handleClick">
      <el-tab-pane label="ASR" name="first">
        <Asr v-if="activeName === 'first'" />
      </el-tab-pane>
      <el-tab-pane label="TTS" name="second">
        <Tts v-if="activeName === 'second'" />
      </el-tab-pane>
    </el-tabs>
    <!-- </HuilanBasic> -->
  </HuilanBasic>
</template>
<script>
import Asr from "./asr";
import Tts from "./tts";
export default {
  components: {
    Asr,
    Tts,
  },
  data () {
    return {
      activeName: "first",
    };
  },
  methods:{
    init(key){
      if(key ==='asr'){
        this.activeName = 'first'
      } else {
        this.activeName = 'second'
      }
    }
  }
};
</script>
<style scoped></style>
