<template>
  <el-container>
      <el-main>
        <Formview
          ref="form"
          :data="data"
          :getInfo="getInfo"
        />
      </el-main>
    <el-footer height="auto">
      <HandleBar
        :data="data"
        :getForm="getForm"
        @complete="handleComplete"
      />
    </el-footer>
  </el-container>
</template>

<script>

import Formview from '@/components/formView'
import HandleBar from '@/components/handleBar'

export default {
  name: 'formInfo',
  components: {
    HandleBar,
    Formview
  },
  props: {
    data: {
      type: Object,
      default() {
        return {}
      }
    },
    getInfo: {
      type: Function,
      default() {
        return () => {}
      }
    },
    handleComplete: {
      type: Function,
      default() {
        return () => {}
      }
    }
  },
  data() {
    return {}
  },
  methods: {
    getForm() {
      return this.$refs.form.getForm()
    }
  }
}
</script>

<style scoped>

</style>
