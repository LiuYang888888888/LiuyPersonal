<template>
  <div class="sysIndex">
    <div class="workbenches">
      <workbench></workbench>
    </div>
    <div class="sysIndexBottom">
      <div class="sysIndexBottomLeft">
        <toDo></toDo>
      </div>
      <div class="sysIndexBottomRight">
        <information></information>
      </div>
    </div>
    <div class="sysIndexBottom">
      <div class="sysIndexBottomLeft">
        <message></message>
      </div>
      <div class="sysIndexBottomRight">
        <download></download>
      </div>
    </div>
    <div class="word">
      <word></word>
    </div>
  </div>
</template>

<script>
import workbench from './workbench.vue'
import toDo from './toDo.vue'
import information from './information.vue';
import download from './download.vue'
import message from './message.vue'
import word from './word.vue'
export default {
  components: {
    workbench,
    toDo,
    information,
    download,
    message,
    word
  },
}
</script>

<style scoped lang="scss">
.sysIndexBottom {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
}

.sysIndexBottom .sysIndexBottomLeft {
  width: 70%;
}

.sysIndexBottom .sysIndexBottomRight {
  width: 30%;
}
</style>
