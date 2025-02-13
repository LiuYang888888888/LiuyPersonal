<template>
  <el-form ref="form" :model="form" :rules="rules" size="small" label-width="80px" class="flow-node-prop-form">
    <el-form-item label="节点名称" prop="name">
      <el-input v-model="form.name"></el-input>
    </el-form-item>
    <el-tabs v-model="activeTab">
      <el-tab-pane label="基础设置" name="second">
        <el-form-item label="打印">
          <el-switch v-model="form.print">
          </el-switch>
          <p class="base-setting-tip">支持该节点进行打印</p>
        </el-form-item>
        <el-form-item label="直接关闭">
          <el-switch v-model="form.close">
          </el-switch>
          <p class="base-setting-tip">允许对当前节点直接关闭当前单据</p>
        </el-form-item>
        <el-form-item label="指定审批">
          <el-switch v-model="form.specify">
          </el-switch>
          <p class="base-setting-tip">可以直接指定下一审批节点</p>
        </el-form-item>
        <!--        <el-form-item label="催办">-->
        <!--          <el-switch v-model="form.urge">-->
        <!--          </el-switch>-->
        <!--          <p class="base-setting-tip">开启后支持对处理节点负责人进行手动催办提醒</p>-->
        <!--        </el-form-item>-->
        <!--        <el-form-item label="允许撤回">-->
        <!--          <el-switch v-model="form.undo">-->
        <!--          </el-switch>-->
        <!--          <p class="base-setting-tip">允许对提交的流程进行强制撤回</p>-->
        <!--        </el-form-item>-->
        <el-form-item label="操作按钮">
          <el-checkbox-group v-model="form.buttons">
            <el-checkbox label="submit" disabled>提交</el-checkbox>
            <el-checkbox label="distribute">派发</el-checkbox>
<!--            <el-checkbox label="specify">指定审批</el-checkbox>-->
          </el-checkbox-group>
        </el-form-item>
      </el-tab-pane>
      <el-tab-pane label="高级设置" name="third">
        <el-form-item label="消息提醒">
          <el-switch v-model="form.sendMessage">
          </el-switch>
        </el-form-item>
        <template v-if="form.sendMessage">
          <el-form-item label="提醒人员">
            <!--            <el-checkbox-group v-model="form.remindType">-->
            <!--              <el-checkbox label="submitter">提交人</el-checkbox>-->
            <!--              <el-checkbox label="other">其他</el-checkbox>-->
            <!--            </el-checkbox-group>-->
            <OptOrgDialog v-model="form.messageUsers"/>
          </el-form-item>
          <MessageList
            :messageTypeList="messageTypeList"
            :selectedList="desinger.curNodeSetting.messageList"
            :curSelectedList.sync="curSelectedList"
          />
        </template>
      </el-tab-pane>
      <el-tab-pane label="字段权限" name="first">
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
import OptOrgDialog from "@/views/optOrg/OptOrgDialog";
import MessageList from './common/messageList'
import {getDictionary} from '@/api/system/dict'
import groupFields from './mixin/groupFormFields'
export default {
  name: 'startTaskProp',
  components: {
    FieldSetting,
    // SelectUser,
    MessageList,
    OptOrgDialog
  },
  inject: ['desinger'],
  mixins: [groupFields],
  data() {
    return {
      form: {
        name: '',
        print: false,
        close: false,
        // urge: false,
        buttons: ['submit'],
        sendMessage: false,
        // remindType: [],
        messageUsers: {
          list: [],
          applicant: true,
          // includeChildren: false,
          applicantLeader: false,
          submitterLeader: false,
          submitDirectLeader: false
        }
      },
      rules: {
        name: [
          {required: true, message: '请输入节点名称'}
        ]
      },
      activeTab: 'second',
      // tableData: [],
      messageTypeList: [],
      curSelectedList: [],
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
  },
  methods: {
    async getMessageList() {
      const {data:{data}} = await getDictionary({code: 'createTaskMessageType'})

      const tableData = data.map(item => {
        return {
          name: item.name,
          type: item.value,
          message: '',
          email: '',
          internal: '',
          smart: '',
          custom: ''
        }
      })
      this.messageTypeList = tableData
    },
    onSubmit() {
      const me = this
      this.$refs.form.validate(function(valid) {
        if(valid) {
          const data = {
            ...me.form,
            fieldSetting: me.fieldSetting,
            messageList: me.curSelectedList
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
    this.getMessageList()
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
