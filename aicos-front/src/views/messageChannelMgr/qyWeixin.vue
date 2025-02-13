<template>
  <BaseChannel
    ref="channel"
    :extCls="extCls"
    :type="type"
    :labelWidth="labelWidth"
    :testFormOpt="testFormOpt"
  />
</template>

<script>
import BaseChannel from './components/baseChannel'
import { getRules } from '@/util/regx'
import { getWeixinList } from '@/api/messageChannelMgr'
// import serviceList from '@/config/serviceList'
//
// const { mq } = serviceList

export default {
  name: 'qyWeixinChannel',
  components: {
    BaseChannel
  },
  data() {
    return {
      type: 'qyweixin',
      labelWidth: 100,
      extCls: [
        {
          label: '企业微信号',
          prop: 'cloudvendorId',
          hide: true,
          showColumn: false,
          span: 24,
          type: 'select',
          
          dicData: [],
          props: {
            label: "name",
            value: "id",
          },
          change: this.cloudvendorIdChange,
          
          rules: [
            {
              required: true,
              message: '请选择企业微信号',
              trigger: "blur"
            },
          ]
        },
        {
          label: '企业微信名称',
          prop: 'qyweixinName',
          display: false
        },
        {
          label: 'corpId',
          prop: 'corpid',
          hide: true,
          span: 24,
          disabled: true
          
        },
        {
          label: 'corpSecret',
          prop: 'corpsecret',
          hide: true,
          span: 24,
          disabled: true
          
        },
        {
          label: '代理ID',
          prop: 'agentId',
          //hide: true,
          span: 24,
          maxlength: 200,
          showWordLimit: true,
          rules: [
            {
              required: true,
              message: '请输入 代理ID',
              trigger: "blur"
            },
            ...getRules(['charNumHanUnderline'])
          ]
        },
        {
          label: '发送类型',
          prop: 'primarySendType',
          //hide: true,
          span: 24,
          type: 'select',
          dicData: [
            {label: '企业邮箱', value: 'EnterpriseMail'},
            {label: '个人邮箱', value: 'PersonMail'},
            {label: '手机', value: 'Mobile'},
            //{label: '微信', value: 'WeixinAccount'},
          ],
          rules: [
            {
              required: true,
              message: '请选择发送类型',
              trigger: "blur"
            },
          ]
        },
      ]
    }
  },
  methods: {
    async getqyWeixList() {
      const param = {
        type: 'qyweixin'
      }
      const {data:{data}} = await getWeixinList(param);
      const qyweixin = this.findObject(this.extCls, 'cloudvendorId');
      qyweixin.dicData = data;
    },
    cloudvendorIdChange({value, column}) {
      let res = {   
        corpId: '',
        corpsecret: '',
        qyweixinName: '',
      }
      if(value) {
        const obj = column.dicData.find(item=>item.id === value) || {}
        let appParam = {}
        if (obj.appParam) {
          const arr = JSON.parse(obj.appParam)
          arr.forEach(item=> {
            appParam[item.key] = item.value
          })
        }

        res = {
          corpid: obj.appKey,
          corpsecret: obj.appSecret,
          qyweixinName: obj.name,
        }
      }
      const form = this.$refs.channel.form
      Object.assign(form, res)
    }
  },
  mounted() {
    this.getqyWeixList()
  }
}
</script>

<style scoped>

</style>
