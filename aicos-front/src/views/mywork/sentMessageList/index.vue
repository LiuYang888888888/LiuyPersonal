<template>
<!--  <el-tabs type="border-card" v-model="activeName">-->
<!--    <el-tab-pane label="短信" name="first">-->
<!--      <MessageList type="shortmessage"/>-->
<!--    </el-tab-pane>-->
<!--    <el-tab-pane label="邮件" name="second" lazy>-->
<!--      <MessageList type="mail"/>-->
<!--    </el-tab-pane>-->
<!--    <el-tab-pane label="系统消息" name="third" lazy>-->
      <MessageList type="system"/>
<!--    </el-tab-pane>-->
<!--  </el-tabs>-->
</template>
<script>
import MessageList from './messageList'
export default {
  name: 'Index',
  components: {
    MessageList
  },
  data() {
    return {
      activeName: 'first'
    }
  }

}
</script>
