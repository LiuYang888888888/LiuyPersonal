<template>
  <el-form ref="form" :model="form" :rules="rules" size="small" label-width="80px" class="flow-node-prop-form">
    <el-form-item label="节点名称" prop="name">
      <el-input v-model="form.name"></el-input>
    </el-form-item>
    <el-form-item label="回访类型" prop="visitType">
      <el-radio-group v-model="form.visitType">
        <el-radio label="manual">人工</el-radio>
        <el-radio label="robot">机器人</el-radio>
      </el-radio-group>
    </el-form-item>
    <el-form-item v-if="form.visitType === 'manual'" key="handler" label="负责人" prop="handler">
      <OptOrgDialog v-model="form.handler"/>
    </el-form-item>
    <template  v-if="form.visitType === 'robot'">
      <el-form-item label="回访插件" prop="plugin" key="plugin">
        <el-select v-model="form.plugin">
          <el-option
            v-for="plugin in pluginList"
            :key="plugin.value"
            :value="plugin.value"
            :label="plugin.name"
          />
        </el-select>
      </el-form-item>
    </template>

    <el-tabs v-model="activeTab">
      <el-tab-pane label="基础设置" name="first">
        <el-form-item label="打印">
          <el-switch v-model="form.print">
          </el-switch>
          <p class="base-setting-tip">支持该节点进行打印</p>
        </el-form-item>
        <el-form-item label="意图">
          <el-checkbox-group v-model="form.intention">
            <el-checkbox label="satisfy">满意</el-checkbox>
            <el-checkbox label="dissatisfied">不满意</el-checkbox>
            <el-checkbox v-if="form.visitType === 'robot'" label="other">其它</el-checkbox>
<!--            <el-checkbox v-if="form.visitType === 'manual'" label="second">二次办理</el-checkbox>-->
          </el-checkbox-group>
        </el-form-item>
      </el-tab-pane>
      <el-tab-pane label="高级设置" name="second">
        <div class="button-names">
          <div class="head">
            <div>自定义按钮名称</div>
            <div><el-switch v-model="form.hasCustomButton"/></div>
          </div>
          <div v-if="form.hasCustomButton" class="body">
            <el-form-item
              v-for="item in form.customButtonList"
              :key="item.code"
              :label="item.label"
            >
              <EditButton
                v-model="item.name"
              />
            </el-form-item>
          </div>
        </div>
      </el-tab-pane>
      <el-tab-pane label="字段权限" name="third">
        <FieldSetting :allFields="groupedFields" :fieldSetting="fieldSetting"/>
      </el-tab-pane>


    </el-tabs>
    <el-form-item class="submit-bar">
      <el-button type="primary" @click="onSubmit">确定</el-button>
      <el-button @click="onCancel">取消</el-button>
    </el-form-item>
  </el-form>
</template>

<script>
import FieldSetting from './common/fieldSetting'
// import SelectUser from './common/selectUser'
import EditButton from "./common/editButton"
import OptOrgDialog from "@/views/optOrg/OptOrgDialog";
import {getDictionary} from '@/api/system/dict'
import groupFields from './mixin/groupFormFields'

export default {
  name: 'VisitTaskProp',
  components: {
    FieldSetting,
    // SelectUser,
    EditButton,
    OptOrgDialog
  },
  mixins:[groupFields],
  inject: ['desinger'],
  data() {
    return {
      form: {
        name: '',
        visitType: 'robot',
        handler: {
          list: [],
          // includeChildren: false,
          applicant: false,
          applicantLeader: false,
          applicantDirectLeader: false,
          submitterLeader: false,
          submitDirectLeader: false
        },
        print: false,
        hasCustomButton: false,
        customButtonList: [
          {code: 'satisfy', label: '满意', name: '满意'},
          {code: 'dissatisfied', label: '不满意', name: '不满意'},
          {code: 'other', label: '其它', name: '其它'},
          {code: 'second', label: '二次办理', name: '二次办理'},
        ],
        plugin: '',
        intention: []
      },
      rules: {
        name: [
          {required: true, message: '请输入节点名称'}
        ],
        handler: [
          { validator: this.validateHandler, trigger: 'blur' }
        ],
        plugin: [
          {required: true, message: '请选择回访插件'}
        ]
      },
      activeTab: 'first',
      pluginList: [],
      fieldSetting: {}
    }
  },
  watch: {
    'desinger.curNodeSetting': {
      handler(newVal) {
        this.form = newVal
        this.fieldSetting = newVal.fieldSetting
      },
      immediate: true
    },
    'form.visitType'(newVal) {
      if(newVal === 'manual') {
        const index = this.form.intention.indexOf('other')
        if(index > -1) {
          this.form.intention.splice(index, 1)
        }
      }
    }
    // 'desinger.formFields': {
    //   handler(newVal) {
    //     let res = {}
    //     newVal.forEach(item => {
    //       res[item.name] = 'edit'
    //     })
    //
    //     this.fieldSetting = Object.assign(this.fieldSetting, res)
    //   },
    //   immediate: true
    // }
  },
  methods: {
    validateHandler(rule, value, callback) {
      if(this.form.visitType === 'manual' && value.list.length === 0 && !value.applicant && !value.applicantLeader && !value.applicantDirectLeader && !value.submitterLeader && !value.submitDirectLeader) {
        callback(new Error('请选择负责人'))
      }else {
        callback()
      }
    },
    async getPluginList() {
      const {data:{data}} = await getDictionary({code: 'visitTaskPlugins'})
      this.pluginList = data
    },
    onSubmit() {
      const me = this
      this.$refs.form.validate(function(valid) {
        if(valid) {
          const data = {
            ...me.form,
            fieldSetting: me.fieldSetting
          }
          me.$emit('close', data)
        }
      })

    },
    onCancel() {
      this.$emit('close',)
    }
  },
  mounted() {
    this.getPluginList()
  }
}
</script>

<style lang="scss" scoped>
.flow-node-prop-form {
  padding: 0 10px 60px;
}
.base-setting-tip {
  display: inline-block;
  margin: 5px 5px 0;
  color: #8a979e;
  font-size: 12px;
  line-height: 16px;
}
.button-names {

  .head {
    display: flex;
    padding-bottom:18px;

    >div:first-child{
      font-size: 14px;
      flex: 1;
      color: #606266;
    }
  }
}
.submit-bar {
  position: absolute;
  left: 10px;
  bottom: 0;
  margin-bottom: 0;
  padding: 10px 0;
  width: calc(100% - 20px);
  text-align: right;
  background: #fff;
  z-index: 2;
}


</style>
