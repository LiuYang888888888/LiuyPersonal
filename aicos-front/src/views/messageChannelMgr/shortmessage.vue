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
  name: 'Shortmessage',
  components: {
    BaseChannel
  },
  data() {
    return {
      type: 'shortmessage',
      extCls: [
        {
          label: '签名',
          prop: 'sign_id',
          span: 24,
          hide: true,
          maxlength: 50,
          showWordLimit: true,
          showColumn:false,
          rules: [
            {
              required: true,
              message: "请输入签名",
              trigger: "blur"
            },
            ...getRules(['charNumLine'])
          ]
        },
        {
          label: '密钥',
          prop: 'secret',
          span: 24,
          hide: true,
          maxlength: 50,
          showWordLimit: true,
          showColumn:false,
          rules: [
            {
              required: true,
              message: "请输入密钥",
              trigger: "blur"
            },
            ...getRules(['expectSpecials'])
          ]
        },
        {
          label: '接口Key',
          prop: 'apikey',
          span: 24,
          hide: true,
          maxlength: 50,
          showWordLimit: true,
          showColumn:false,
          rules: [
            {
              required: true,
              message: "请输入接口Key",
              trigger: "blur"
            },
            ...getRules(['expectSpecials'])
          ]
        },
        {
          label: '内容类型',
          prop: 'content_type',
          span: 24,
          hide: true,
          maxlength: 50,
          showWordLimit: true,
          showColumn:false,
          rules: [
            {
              required: true,
              message: "请输入内容类型",
              trigger: "blur"
            },
            ...getRules(['expectSpecials'])
          ]
        },
        {
          label: '发送地址',
          prop: 'url',
          span: 24,
          hide: true,
          maxlength: 50,
          showWordLimit: true,
          showColumn:false,
          rules: [
            {
              required: true,
              message: "请输入队列名称",
              trigger: "blur"
            },
            ...getRules(['expectSpecials'])
          ]
        },
        {
          label: '模板ID',
          prop: 'template_id',
          span: 24,
          hide: true,
          maxlength: 50,
          showWordLimit: true,
          showColumn:false,
          rules: [
            {
              required: true,
              message: "请输入模板ID",
              trigger: "blur"
            },
            ...getRules(['charNumLine'])
          ]
        }
      ],
      testFormOpt: {
        labelWidth: 100,
        column: [
          {
            label: '接收手机号',
            prop: 'accepter',
            span: 24,
            rules: [
              {
                required: true,
                message: "请输入手机号",
                trigger: "blur"
              },
              ...getRules(['mobile'])
            ]
          },
          {
            label: '测试内容',
            prop: 'title',
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
