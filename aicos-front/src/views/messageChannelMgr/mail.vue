<template>
  <BaseChannel
    :extCls="extCls"
    :type="type"
    :labelWidth="labelWidth"
    :testFormOpt="testFormOpt"
  />
</template>

<script>
import BaseChannel from './components/baseChannel'
import { getRules } from '@/util/regx'
export default {
  name: 'MailChannel',
  components: {
    BaseChannel
  },
  data() {
    return {
      type: 'mail',
      labelWidth: 130,
      extCls: [
        {
          label: '账号',
          prop: 'username',
          hide: true,
          span: 24,
          maxlength: 50,
          showWordLimit: true,
          rules: [
            {
              required: true,
              message: '请输入账号',
              trigger: "blur"
            },
            ...getRules(['expectSpecials'])
          ]
        },
        {
          label: '密码',
          prop: 'password',
          hide: true,
          span: 24,
          type: 'password',
          maxlength: 50,
          showWordLimit: true,
          rules: [
            {
              required: true,
              message: '请输入密码',
              trigger: "blur"
            },
            ...getRules(['numCharSpecial'])
          ]
        },
        {
          label: '发件人地址',
          prop: 'from',
          hide: true,
          span: 24,
          maxlength: 50,
          showWordLimit: true,
          rules: [
            {
              required: true,
              message: '请输入发件人地址',
              trigger: "blur"
            },
            {
              type: 'email',
              message: '请输入正确的邮箱地址',
              trigger: "blur"
            }
          ]
        },
        {
          label: '发信服务器地址',
          prop: 'host',
          hide: true,
          span: 24,
          maxlength: 50,
          showWordLimit: true,
          rules: [
            {
              required: true,
              message: '请输入发信服务器地址',
              trigger: "blur"
            }
          ]
        },
        {
          label: '发送端口',
          prop: 'port',
          hide: true,
          span: 24,
          type: 'number',
          rules: [
            {
              required: true,
              message: '请输入发送端口',
              trigger: "blur"
            }
          ]
        },
        {
          label: '是否加密',
          prop: 'sslEnable',
          hide: true,
          type: "switch",
          dicData: [
            {
              label: "否",
              value: '0'
            },
            {
              label: "是",
              value: '1'
            }
          ],
          value: '1'
        }
      ],
      testFormOpt: {
        labelWidth: 100,
        column: [
          {
            label: '接收邮箱',
            prop: 'accepter',
            span: 24,
            rules: [
              {
                required: true,
                message: "请输入邮箱地址",
                trigger: "blur"
              },
              {
                type: 'email',
                message: '请输入正确的邮箱地址',
                trigger: "blur"
              }
            ]
          },
          {
            label: '测试标题',
            prop: 'title',
            span: 24,
            rules: [
              {
                required: true,
                message: "请输入测试标题",
                trigger: "blur"
              },
              ...getRules(['expectSpecials'])
            ]
          },
          {
            label: '测试内容',
            prop: 'body',
            span: 24,
            type: 'textarea',
            rules: [
              {
                required: true,
                message: "请输入测试内容",
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
