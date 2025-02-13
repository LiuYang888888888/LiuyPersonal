<template>
  <div>
    <BaseTemplate
      :extCls="columns"
      type="universal"
    />
  </div>
</template>

<script>
import BaseTemplate from './baseTemplate'
import { getRules } from '@/util/regx'
export default {
  name: 'UniversalTemplate',
  components: {
    BaseTemplate
  },
  data() {
    return {
      columns: [
        {
          label: '标题',
          prop: 'title',
          span: 24,
          hide: true,
          rules: [{
            required: true,
            message: "请输入标题",
            trigger: "blur"
          },
          ...getRules(['expectSpecials'])
          ]
        },
        {
          label: '内容',
          prop: 'content',
          type: 'textarea',
          span: 24,
          hide: true,
          rules: [{
            required: true,
            message: "请输入内容",
            trigger: "blur"
          },
          ...getRules(['expectSpecials'])
          ]
        },
      ]
    }
  }
}
</script>

<style scoped>

</style>
