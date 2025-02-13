<template>
  <basic-container>
    <avue-form ref="form" v-model="formData" :option="option" @submit="submit" style="width: 50%">
    </avue-form>
  </basic-container>
</template>

<script>
import {save, getInfo/*, sendMail*/} from '@/api/system/emailProxy'
import {mapGetters} from "vuex";
import { getRules } from '@/util/regx'

export default {
  name: 'EmailProxy',
  data() {
    return {
      formData: {
        host: '',
        username: '',
        password: '',
        fromWho: '',
        ssl_enable: '0',
        port: 21
      },
      option: {
        labelWidth: 150,
        menuBtn: false,
        disabled: true,
        submitText: '保存',
        column: [
          // {
          //   label: "邮件服务器名称",
          //   prop: "host",
          //   span: 24,
          //   rules: [{
          //     required: true,
          //     message: "请输入邮件服务器名称",
          //     trigger: "blur"
          //   }]
          // },
          {
            label: "邮件服务器地址",
            prop: "host",
            span: 24,
            rules: [{
              required: true,
              message: "请输入邮件服务器地址",
              trigger: "blur"
            },
            ...getRules(['expectSpecials'])
            ]
          },
          {
            label: "账号",
            prop: "username",
            span: 24,
            rules: [{
              required: true,
              message: "请输入账号",
              trigger: "blur"
            },
            ...getRules(['expectSpecials'])
            ]
          },
          {
            label: "密码",
            prop: "password",
            span: 24,
            type: 'password',
            rules: [{
              required: true,
              message: "请输入用密码",
              trigger: "blur"
            },
            ...getRules(['expectSpecials'])
            ]
          },
          {
            label: "邮件发送人",
            prop: "fromWho",
            span: 24,
            rules: [{
              required: true,
              message: "请输入邮件发送人",
              trigger: "blur"
            },
            ...getRules(['expectSpecials'])
            ]
          },
          {
            label: "邮件服务器启用SSL",
            prop: "sslEnable",
            span: 24,
            type: 'switch',
            dicData: [
              {
                label: '停用',
                value: '0'
              }, {
                label: '启用',
                value: '1'
              }
            ]
          },
          {
            label: "SSL端口",
            prop: "port",
            span: 24,
            type: 'number',
            rules: [{
              required: false,
              message: "请输入SSL端口",
              trigger: "blur"
            }]
          }
        ]
      }
    }
  },
  computed: {
    ...mapGetters(["permission"]),
    permissionList() {
      return {
        submit: this.vaildData(this.permission['system-mail-proxy-manage'], false),
      };
    },
  },
  methods: {
    async getSetting() {
      const {data:{data}} = await getInfo()

      this.formData = data
      this.$nextTick(()=>{
        this.$refs.form.clearValidate()
      })
    },
    async submit(data, done) {
      await save(data)
      this.$message.success('保存成功！')
      done()
    }
  },
  mounted() {
    this.getSetting()
    if(this.vaildData(this.permission['system-mail-proxy-manage'], false)) {
      this.option.disabled = false
      this.option.menuBtn = true
      // this.$refs.form.hide()
    }
  }
}
</script>

<style scoped>

</style>
