<template>
  <div>
    <el-form :model="form">
      <el-form-item label="通道选择">
        <el-radio-group
          v-model="form.channel"
          @change="channelChange"
        >
          <el-radio
            v-for="channel in channels"
            :key="channel.id"
            :label="channel.id"
          >{{ channel.name }}</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="模板选择">
        <el-radio-group
          v-model="form.template"
          @change="templateChange"
        >
          <el-radio
            v-for="tpl in tplList"
            :key="tpl.id"
            :label="tpl.id"
          >{{ tpl.name }}</el-radio>
        </el-radio-group>
      </el-form-item>
    </el-form>
    <el-card
      v-if="form.template != ''"
      header="消息内容"
    >
      <avue-form
        ref="sendForm"
        v-model="sendFormData"
        :option="sendFormOption"
        @submit="submit"
      />
    </el-card>
  </div>
</template>

<script>
import { getChannelByProducerId, getTemplateByProducerId, sendMessage } from '@/api/messageSourceMgr'
import { detail as getTplById } from '@/api/messageTemplateMgr'
import { sendTest } from '@/api/messageChannelMgr'
import { getRules } from '@/util/regx'
import serviceList from '@/config/serviceList'
import {baseURL} from '@/api/common';
export default {
  name: 'sendMessage',
  props: {
    id: String,
    secret: String
  },
  data() {
    return {
      form: {
        channel: '',
        template: ''
      },
      channelType: '',
      channelConfigStr: '',
      channels: [],
      templates: [],
      formOptions: {
        shortmessage: {
          labelWidth: 120,
          column: [
            {
              label: '接收手机号',
              prop: "accepter",
              rules: [
                {
                  required: true,
                  message: "请输入手机号",
                  trigger: "blur"
                },
                ...getRules(['mobile'])
              ]
            },
            // {
            //   label: '短信标题',
            //   prop: "title",
            //   span: 24,
            //   display: false
            // },
            {
              label: '短信内容',
              prop: "title",
              type: 'textarea',
              span: 24,
              rules: [
                {
                  required: true,
                  message: "请输入短信内容",
                  trigger: "blur"
                },
                ...getRules(['expectSpecials'])
              ],
              // control(val,form) {
              //   form.title = val
              //   // 必须返回一个对象
              //   return {}
              // }
            }
          ]
        },
        mail: {
          labelWidth: 120,
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
              label: '邮件标题',
              prop: 'title',
              span: 24,
              rules: [
                {
                  required: true,
                  message: "请输入邮件标题",
                  trigger: "blur"
                },
                ...getRules(['expectSpecials'])
              ]
            },
            {
              label: '邮件内容',
              prop: 'body',
              span: 24,
              component: 'AvueUeditor',
              params: {
                options: {
                  action: `${baseURL}api/${serviceList.file}/miniofile/upload?fromSystemName=base`,
                  props: {
                    url: 'newFileName',
                    res: 'data'
                  }
                }
              },
              rules: [
                {
                  required: true,
                  message: "请输入邮件内容",
                  trigger: "blur"
                }
              ]
            }
          ]
        },
        weixin: {
          labelWidth: 120,
          column: [
            {
              label: '接收者',
              prop: 'accepter',
              span: 24,
              rules: [
                {
                  required: true,
                  message: "请输入接收者",
                  trigger: "blur"
                },
                ...getRules(['expectSpecials'])
              ]
            },
            {
              label: '标题',
              prop: 'title',
              span: 24,
              rules: [
                {
                  required: true,
                  message: "请输入标题",
                  trigger: "blur"
                },
                ...getRules(['expectSpecials'])
              ]
            },
            {
              label: '内容',
              prop: 'body',
              span: 24,
              type: 'textarea',
              rules: [
                {
                  required: true,
                  message: "请输入内容",
                  trigger: "blur"
                },
                ...getRules(['expectSpecials'])
              ]
            }
          ]
        },
        telephone: {
          labelWidth: 120,
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
              ]
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
            },
          ]
        },
        third: {
          labelWidth: 120,
          column: [
            // {
            //   label: '接收者',
            //   prop: 'accepter',
            //   span: 24,
            //   rules: [
            //     {
            //       required: true,
            //       message: "请输入接收者",
            //       trigger: "blur"
            //     },
            //     ...getRules(['expectSpecials'])
            //   ]
            // },
            // {
            //   label: '标题',
            //   prop: 'title',
            //   span: 24,
            //   display:false
            // },
            {
              label: '内容',
              prop: 'title',
              span: 24,
              type: 'textarea',
              rules: [
                {
                  required: true,
                  message: "请输入内容",
                  trigger: "blur"
                },
                ...getRules(['expectSpecials'])
              ]
            }
          ]
        }
      },
      // tplConfig: {},
      sendFormOption: {
        emptyBtn: false,
        submitBtn: false
      },
      sendFormData: {}
    }
  },
  computed: {
    tplList() {
      if(this.channelType) {
        const array = [this.channelType]
        // 电话通道不能使用模板
        if(this.channelType !== 'telephone') {
          array.push('universal')
        }
        const res = this.templates.filter(item=> array.includes(item.channelType) )
        res.unshift({name: '不使用模板', id: '-1'})
        return res
      }else {
        return []
      }
    }
  },
  methods: {
    async getChannels() {
      const {data:{data}} = await getChannelByProducerId(this.id)

      this.channels = data.filter(item=> (!!item) && !['weixin','qyweixin'].includes(item.type))
    },
    async getTemplates() {
      const {data:{data}} = await getTemplateByProducerId(this.id)

      this.templates = data.filter(item=> !!item)
    },
    channelChange(val) {
      const obj = this.channels.find(item=> item.id === val)
      if(obj) {
        this.channelConfigStr = obj.config
        this.channelType = obj.type
      }
      this.form.template = ''
      this.tplkeys = []
      this.sendFormData = {}

    },
    buildSendData(formOpt, data) {
      const res = data.config ? JSON.parse(data.config) : {}
      // 处理一般列
      formOpt.column.forEach(item=> {
        let prop = item.prop;
        if(prop === 'body') {
          prop = 'content'
        }
        res[item.prop] = data[prop] || item.value || ''
      })
      // 处理模板参数
      if(this.tplkeys) {
        this.tplkeys.forEach(item=> {
          res[item] = data[item] || ''
        })
      }
      // 处理扩展参数
      // data.ext.forEach(item=> {
      //   res[item.key] = item.value
      // })
      return res
    },
    buildTemplateVars({title, content}) {
      const tpl = `${title}${content}`
      const reg = /【([A-z\d]+)】/g
      let res
      const array = []
      const varKeys = []

      res = reg.exec(tpl)
      while (res) {
        let temp = res[1]
        const prop = `tpl${temp}`
        varKeys.push(prop)
        array.push({
          label: `变量【${temp}】`,
          prop,
          span: 24,
        })
        res = reg.exec(tpl)
      }
      this.tplkeys = varKeys
      return array
    },
    unUseTpl(){
      const sendFormOption = {
        emptyBtn: false,
        submitText: '发送',
        labelWidth: 100,
        ...this.formOptions[this.channelType]
      }
      this.sendFormOption = sendFormOption
      this.sendFormData = {}
      this.$nextTick(()=> {
        // 处理默认值不显示的问题
        this.sendFormData = this.buildSendData(sendFormOption, {})
        this.$nextTick(()=> {
          this.$refs.sendForm.clearValidate()
        })
      })
    },
    async templateChange(tplId) {
      if(!tplId) {
        return
      }
      if(tplId == '-1') {
        this.unUseTpl()
        return
      }
      // 根据tpl去获取模板内容
      const {data:{data}} = await getTplById(tplId)
      const tplConfig = JSON.parse(data.config)
      const extCols = Object.keys(tplConfig).map(key=> {
        return {
          label:`参数【${key}】`,
          prop: key,
          span: 24,
          disabled: true
        }
      })

      const formOpt = this.deepClone(this.formOptions[this.channelType])
      // 除了接收者其它都disabled
      formOpt.column.forEach(item=> {
        if(item.prop !== 'accepter') {
          item.disabled = true
        }
      })

      const arr = ['mail', 'shortmessage', 'weixin']
      const tplVarCols = this.buildTemplateVars(data)
      const sendFormOption = {
        emptyBtn: false,
        submitText: '发送',
        labelWidth: 100,
        // column: this.formOptions[this.channelType],
        ...formOpt,
        group: [
          {
            // icon:'el-icon-info',
            label: '模板变量',
            collapse:true,
            arrow: false,
            prop: 'group2',
            display: tplVarCols.length !==0,
            column: tplVarCols
          },
          {
            // icon:'el-icon-info',
            label: '扩展参数',
            collapse:true,
            arrow: false,
            prop: 'group1',
            display: !arr.includes(this.channelType),
            column: extCols
          }
        ]
      }
      this.sendFormOption = sendFormOption
      this.sendFormData = this.buildSendData(sendFormOption, data)
      this.$nextTick(()=> {
        this.$refs.sendForm.clearValidate()
      })
    },
    sendUnuseTpl() {
      const params = {
        channelType: this.channelType,
        channelConfig: this.channelConfigStr,
        // accepter: '',
        // title: ''
        ...this.sendFormData
      }
      return sendTest(params)
    },
    buildTplVarValues() {
      const res = {}
      this.tplkeys.forEach(item=> {
        const key = item.replace(/tpl/, '')
        res[key] = this.sendFormData[item]
      })

      return res
    },
    sendUseTpl() {
      const { accepter } = this.sendFormData
      let act = accepter
      // if(this.channelType === 'third') {
      //   const channelCfg = JSON.parse(this.channelConfigStr)
      //   act = channelCfg.routingKey
      // }
      const params = {
        producerId: this.id,
        secret: this.secret,
        messages: [
          {
            channelId: this.form.channel,
            templateId:  this.form.template,
            accepter: act,
            body: this.buildTplVarValues()
          }
        ]
      }
      return sendMessage(params)
    },
    async submit(vals, done) {
      let handle = this.sendUnuseTpl
      if(this.form.template != '-1') {
        handle = this.sendUseTpl
      }
      try {
        await handle()
        this.$message.success('发送成功！')
        this.$emit('success')
      }catch (e){
        console.log(e)
      }
      done();
    }
  },
  mounted() {
    this.getChannels()
    this.getTemplates()
  }
}
</script>

<style scoped>

</style>
