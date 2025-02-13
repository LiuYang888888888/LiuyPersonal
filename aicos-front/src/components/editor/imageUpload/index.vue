<template>
<HuilanDialog
  title="图片上传"
  :visible.sync="visible"
  append-to-body
  width="675px"
  custom-class="upload-image-dialog"
>
  <Uploadpane v-if="visible" ref="uploadPane"/>
  <template v-slot:footer>
    <el-button type="primary" size="small" @click="handleOk">确 定</el-button>
    <el-button type="default" size="small" @click="visible = false">取 消</el-button>
  </template>
</HuilanDialog>
</template>

<script>
import Uploadpane from './uploadPane'
export default {
  name: 'imageUpload',
  components: {
    Uploadpane
  },
  data() {
    return{
      visible: false,
      editor: null
    }
  },
  methods: {
    showDialog(editor) {
      this.editor = editor
      this.visible = true
    },
    handleOk() {
      const uploadPane = this.$refs.uploadPane;
      const isUploading = uploadPane.getUploadStatus();
      if(isUploading) {
        this.$message.warning('图片正在上传中，请稍后')
        return
      }
      const list = uploadPane.getUploadedList();
      if(list.length > 0) {
        const htmlArr = list.map(item => {
          return `<figure class="image"><img src="${item.url}" alt="${item.name}"><figcaption>${item.name}</figcaption></figure>`
        })
        this.editor.insertHtml(htmlArr.join(''))
      }
      this.visible = false
    }
  }
}
</script>



<style lang="scss">
.upload-image-dialog {
  .el-dialog__body {
    height: 400px;
    overflow: auto;
  }

  &.is-fullscreen {
    .el-dialog__body {
      height: calc(100% - 110px);
    }
  }
}
</style>
