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
// import { getRules } from '@/util/regx'
import { getWeixinList } from '@/api/messageChannelMgr'
// import serviceList from '@/config/serviceList'
//
// const { mq } = serviceList

export default {
  name: 'WeixinChannel',
  components: {
    BaseChannel
  },
  data() {
    return {
      type: 'weixin',
      labelWidth: 100,
      extCls: [
        {
          label: '公众号名称',
          prop: 'cloudvendorId',
          hide: true,
          showColumn: false,
          span: 24,
          type: 'select',
          // dicUrl: `/api/${mq}/mqChannel/getAllBaseCloudvendor`,
          // dicMethod: 'post',
          dicData: [],
          props: {
            label: "name",
            value: "id",
          },
          change: this.cloudvendorIdChange,
          // maxlength: 50,
          // showWordLimit: true,
          rules: [
            {
              required: true,
              message: '请选择公众号',
              trigger: "blur"
            },
            // ...getRules(['expectSpecials'])
          ]
        },
        {
          label: '公众号名称',
          prop: 'weixinName',
          display: false
        },
        {
          label: '登录邮箱',
          prop: 'weixinMail',
          // hide: true,
          span: 24,
          disabled: true
          // maxlength: 50,
          // showWordLimit: true,
          // rules: [
          //   {
          //     required: true,
          //     message: '请输入登录邮箱',
          //     trigger: "blur"
          //   },
          //   {
          //     type: 'email',
          //     message: '请输入正确的邮箱地址',
          //     trigger: "blur"
          //   }
          // ]
        },
        {
          label: '原始ID',
          prop: 'weixinId',
          hide: true,
          span: 24,
          disabled: true
          // maxlength: 50,
          // showWordLimit: true,
          // rules: [
          //   {
          //     required: true,
          //     message: '请输入原始ID',
          //     trigger: "blur"
          //   },
          //   ...getRules(['expectSpecials'])
          // ]
        },
        {
          label: 'APP ID',
          prop: 'appId',
          hide: true,
          span: 24,
          disabled: true
          // maxlength: 50,
          // showWordLimit: true,
          // rules: [
          //   {
          //     required: true,
          //     message: '请输入APP ID',
          //     trigger: "blur"
          //   },
          //   ...getRules(['expectSpecials'])
          // ]
        },
        {
          label: 'APP Secret',
          prop: 'appSecret',
          hide: true,
          span: 24,
          disabled: true
          // maxlength: 50,
          // showWordLimit: true,
          // rules: [
          //   {
          //     required: true,
          //     message: '请输入APP Secret',
          //     trigger: "blur"
          //   },
          //   ...getRules(['expectSpecials'])
          // ]
        },
        {
          label: '公众号类型',
          prop: 'weixinType',
          // hide: true,
          span: 24,
          width: 120,
          disabled: true
          // type: 'select',
          // dicData: [
          //   {
          //     label: "订阅号",
          //     value: '0'
          //   },
          //   {
          //     label: "服务号",
          //     value: '1'
          //   }
          // ],
          // value: '1',
          // rules: [
          //   {
          //     required: true,
          //     message: '请选择公众号类型',
          //     trigger: "blur"
          //   }
          // ]
        }
      ]
    }
  },
  methods: {
    async getWeixList() {
      const param = {
        type: 'weixin'
      }
      const {data:{data}} = await getWeixinList(param)
      const weixin = this.findObject(this.extCls, 'cloudvendorId')
      weixin.dicData = data.map(item=> {
        const appParam = JSON.parse(item.appParam)
        const name = appParam.find(param=> param.key === 'name')
        return {
          ...item,
          name: `${item.name}(${name.value})`
        }
      })
    },
    cloudvendorIdChange({value, column}) {
      let res = {
        weixinName: '',
        weixinMail: '',
        weixinId: '',
        appId: '',
        appSecret: '',
        weixinType: ''
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
          weixinName: appParam.name,
          weixinMail: appParam.mail,
          weixinId: appParam.orignId,
          appId: obj.appKey,
          appSecret: obj.appSecret,
          weixinType: appParam.type
        }
      }
      const form = this.$refs.channel.form
      Object.assign(form, res)
    }
  },
  mounted() {
    this.getWeixList()
  }
}
</script>

<style scoped>

</style>
