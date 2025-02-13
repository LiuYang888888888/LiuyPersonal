<template>
  <div class="analysisResult">
    <div v-if="type === 'tageList'">
      <el-tag v-for="v of dataSource.tagList" :key="v" style="margin-bottom: 10px;margin-right: 10px;height: auto;word-wrap: break-word;white-space: normal;">{{ v }}</el-tag>
    </div>
    <vue-json-editor v-if="type === 'json'" v-model="dataSource.vueJsonRsoult" :showBtns="false" :mode="'text'"
      lang="zh" />
    <audio v-if="type === 'audio'" id="audio" controls="controls" autoplay :src="dataSource.audioSrc" />
    <TxtToImg ref="txtToImg" v-if="type === 'text'" />
    <!-- <TxtToImg /> -->
  </div>
</template>
<script>
const vueJsonEditor = () => import('vue-json-editor');
import TxtToImg from './txtToImg.vue'
export default {
  name: "analysisResult",
  components: {
    vueJsonEditor,
    TxtToImg,
  },
  props: {
  },
  data() {
    // const self = this
    return {
      type: '',
      dataSource: {
        tagList: [],
        vueJsonRsoult: {},
        audioSrc: '',
      }
    };
  },
  computed: {},
  created() {

  },
  methods: {
    handleSubmit() {
      this.$refs.form.submit()
    },
    init(data) {
      this.type = data.type
      switch (data.type) {
        case 'tageList':
          this.dataSource.tagList = data.data
          break;
        case 'json':
          this.dataSource.tagList = []
          this.dataSource.vueJsonRsoult = data.data
          break;
        case 'audio':
          this.dataSource.tagList = []
          this.dataSource.audioSrc = data.data
          break;
        case 'text':
          this.dataSource.tagList = []
          this.dataSource.audioSrc = ''
          this.$nextTick(() => {
            this.$refs.txtToImg.init(data.data)
          })
          break;
      }
    },
    emptyData() {
      this.dataSource.tagList = []
    },
    clearResolt() {
      this.type = ''
    },
  },
};
</script>

<style lang="scss" scoped>
.analysisResult {
  width: 100%;
  margin-left: 30px;
  margin-right: 0px;
  background-color: #ffffff;
  border-radius: 6px;
  border: solid 1px #d7dfee;
  padding: 20px;
  overflow-x: auto;
}

/deep/ .jsoneditor-outer {
  height: 500px;
}

/deep/ .textarea.jsoneditor-text,
.ace-jsoneditor {
  height: 500px;
}
</style>
