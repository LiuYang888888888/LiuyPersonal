<template>
  <div>
    <BaseTemplate
      :extCls="columns"
      type="shortmessage"
    />
  </div>
</template>

<script>
import BaseTemplate from './baseTemplate'
import { getRules } from '@/util/regx'
export default {
  name: 'ShortmessageTemplate',
  components: {
    BaseTemplate
  },
  data() {
    return {
      columns: [
        // {
        //   label: '短信签名',
        //   prop: 'title',
        //   span: 24,
        //   hide: true
        // },
        {
          label: '短信内容',
          prop: 'title',
          type: 'textarea',
          span: 24,
          hide: true,
          rules: [{
            required: true,
            message: "请输入短信内容",
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
