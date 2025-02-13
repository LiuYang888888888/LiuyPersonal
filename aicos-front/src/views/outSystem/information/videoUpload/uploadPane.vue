<template>
<div>
  <HuilanUploader
    :action="uploadUrl"
    accept="video/*"
    multiple
    :on-progress="handleProgress"
    :on-remove="handleRemove"
    :on-success="handleSuccess"
  >
    <el-button type="primary" size="small">视频上传</el-button>
  </HuilanUploader>
</div>
</template>

<script>
import HuilanUploader from '@/components/uploader';
import {baseURL, getUploadUrl} from "@/api/common";
export default {
  name: "uploadPane",
  components: {
    HuilanUploader
  },
  data() {
    return {
      uploadUrl: getUploadUrl(),
      list: [],
      uploading: false
    }
  },
  methods: {
    handleRemove(file/*, fileList*/) {
      const index = this.list.findIndex(item => item.id === file.id);
      if(index > -1) {
        this.list.splice(index, 1)
      }
    },
    handleSuccess(response, file, fileList) {
      if(response.success) {
        const url = response.data.newFileName
        this.list.push({
          id: file.id,
          name: file.name.substring(0, file.name.lastIndexOf('.')),
          url: `${baseURL}${url}`.replace(/\/\//g, '/')
        })
      }else {
        const index = fileList.indexOf(file)
        fileList.splice(index, 1)
        this.$message.error(response.msg)
      }
      this.handleUploadStatus(fileList)
    },
    handleProgress(event, file, fileList) {
      this.handleUploadStatus(fileList)
    },
    handleUploadStatus(list) {
      const uploaded = list.every(item => item.percentage === 100)
      this.uploading = !uploaded
    },
    getUploadStatus() {
      return this.uploading
    },
    getUploadedList() {
      return this.list
    }
  }
}
</script>

<style scoped lang="scss">
</style>
