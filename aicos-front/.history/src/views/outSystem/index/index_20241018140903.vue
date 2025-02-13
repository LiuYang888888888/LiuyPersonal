<template>
  <div class="sysIndex">
    <div class="workbenches">
      <workbench></workbench>
    </div>
    <div class="sysIndexBottom">
      <div class="sysIndexBottomLeft">
        <toDo></toDo>
      </div>
    </div>
  </div>
</template>

<script>
import workbench from './workbench.vue'
import toDo from './toDo.vue'

export default {
  components: {
    workbench,
    toDo
  },
  data() {
    return {
     
    }
  },
  mounted() {
    this.open1()
  },
  methods: {
    open1() {
      const h = this.$createElement;

      this.$notify({
        title: '警告',
        message: h('i', { style: 'color: #af2c30;font-size:28px;line-height:28px;'}, '外网系统禁止处理涉密数据!'),
        type: 'warning',
      });
    },
    
  },
  created() {
    
  }
}

</script>

<style scoped lang="scss">

.sysIndexBottom {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
}

.sysIndexBottom .sysIndexBottomLeft {
  width: 60%;
}

.sysIndexBottom .sysIndexBottomRight {
  width: 30%;
}


</style>
