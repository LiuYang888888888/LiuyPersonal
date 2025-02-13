<template>
  <BaseChannel
    :extCls="extCls"
    :type="type"
    :testFormOpt="testFormOpt"
  />
</template>

<script>
import BaseChannel from './components/baseChannel'
import { getRules } from '@/util/regx'
export default {
  name: 'TelephoneChannel',
  components: {
    BaseChannel
  },
  data() {
    return {
      type: 'telephone',
      extCls: [
        {
          label: '地址',
          prop: 'prefixUrl',
          span: 24,
          hide: true,
          maxlength: 50,
          showWordLimit: true,
          rules: [
            {
              required: true,
              message: "请输入地址",
              trigger: "blur"
            },
            {
              type: 'url',
              message: "请输入正确的url",
              trigger: "blur"
            },
            // ...getRules(['charNumLine'])
          ]
        },
        {
          label: '用户名',
          prop: 'username',
          span: 24,
          hide: true,
          maxlength: 50,
          showWordLimit: true,
          rules: [
            {
              required: true,
              message: "请输入用户名",
              trigger: "blur"
            },
            ...getRules(['expectSpecials'])
          ]
        },
        {
          label: '密码',
          prop: 'password',
          span: 24,
          hide: true,
          maxlength: 50,
          showWordLimit: true,
          type: 'password',
          rules: [
            {
              required: true,
              message: "请输入密码",
              trigger: "blur"
            },
            ...getRules(['numCharSpecial'])
          ]
        }
      ],
      testFormOpt: {
        labelWidth: 100,
        column: [
          {
            label: '接收者电话',
            prop: 'accepter',
            span: 24,
            hide: true,
            rules: [
              {
                required: true,
                message: "请输入接收者电话",
                trigger: "blur"
              },
              ...getRules(['tel'])
            ]
          },
          {
            label: '姓名',
            prop: 'name',
            span: 24,
            hide: true,
            rules: [
              {
                required: true,
                message: "请输入姓名",
                trigger: "blur"
              },
              ...getRules(['expectSpecials'])
            ],
            value: '测试人员'
          },
          {
            label: '性别',
            prop: 'sex',
            type: "radio",
            dicData: [
              {
                label: "男",
                value: '男'
              },
              {
                label: "女",
                value: '女'
              }
            ],
            value: '男',
            span: 24,
            hide: true,
            // rules: [
            //   {
            //     required: true,
            //     message: "请输入消息标题",
            //     trigger: "blur"
            //   },
            //   ...getRules(['expectSpecials'])
            // ]
          },
          {
            label: '任务Id',
            prop: 'taskId',
            span: 24,
            hide: true,
            rules: [
              {
                required: true,
                message: "请输入任务Id",
                trigger: "blur"
              },
              ...getRules(['expectSpecials'])
            ]
          }
        ]
      }
    }
  }
}
</script>

<style scoped>

</style>
