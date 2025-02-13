<template>
  <div>
    <BaseTemplate
      :extCls="columns"
      type="mail"
    />
  </div>
</template>

<script>
import BaseTemplate from './baseTemplate'
import { getRules } from '@/util/regx'
import serviceList from '@/config/serviceList'
import {baseURL} from '@/api/common';

export default {
  name: 'EmailTemplate',
  components: {
    BaseTemplate
  },
  data() {
    return {
      columns: [
        {
          label: '邮件标题',
          prop: 'title',
          span: 24,
          hide: true,
          rules: [{
            required: true,
            message: "请输入邮件标题",
            trigger: "blur"
          },
          ...getRules(['expectSpecials'])
          ]
        },
        {
          label: '邮件正文',
          prop: 'content',
          component: 'AvueUeditor',
          params: {
            options: {
              action: `${baseURL}api/${serviceList.file}/miniofile/upload?fromSystemName=base`,
              props: {
                url: 'newFileName',
                res: 'data',
                home: '/aicos'
              }
            }
          },
          span: 24,
          hide: true,
          rules: [{
            required: true,
            message: "请输入邮件正文",
            trigger: "blur"
          },
            // ...getRules(['expectSpecials'])
          ]
        },
      ]
    }
  }
}
</script>

<style scoped>

</style>
