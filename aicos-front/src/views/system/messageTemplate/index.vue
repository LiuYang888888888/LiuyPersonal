<template>
  <el-tabs v-model="activeName">
    <el-tab-pane label="系统消息模版" name="first" lazy="true">
      <MessageTpListl type="system"/>
    </el-tab-pane>
    <el-tab-pane label="邮件模版" name="second" lazy="true">
      <MessageTpListl type="mail"/>
    </el-tab-pane>
    <el-tab-pane label="短信模版" name="third" lazy="true">
      <MessageTpListl type="shortmessage"/>
    </el-tab-pane>
    <el-tab-pane label="企业微信" name="fourth" lazy="true">
      <MessageTpListl type="qyWeixin"/>
    </el-tab-pane>
    <el-tab-pane label="自定义模板" name="fifth" lazy="true">
      <MessageTpListl type="custom"/>
    </el-tab-pane>
<!--    <el-tab-pane label="定时任务补偿">定时任务补偿</el-tab-pane>-->
  </el-tabs>
</template>

<script>
import MessageTpListl from './messageTpListl'
export default {
  name: 'index',
  components: {
    MessageTpListl
  },
  data() {
    return {
      activeName: 'first'
    }
  }
}
</script>

<style scoped>

</style>
