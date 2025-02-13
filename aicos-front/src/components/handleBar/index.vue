<template>
  <div style="text-align: right">
    <el-input
      v-if="needInput"
      type="textarea"
      v-model="handleComments"
      placeholder="请输入处理意见"
      rows="4"
      style="margin-bottom: 10px"
    />
    <el-button
      v-if="handleButtons.includes('submit')"
      size="small" style="margin: 0 10px"
      @click="handleSubmitClick"
    >{{ handleButtonText.submit }}</el-button>

    <el-button
      v-if="handleButtons.includes('close')"
      size="small"
      @click="handleCloseTask"
    >{{ handleButtonText.close }}</el-button>

    <el-button
      v-if="handleButtons.includes('agree')"
      size="small"
      @click="submitHandlingComments('agree')"
    >{{ handleButtonText.agree }}</el-button>
    <el-button
      v-if="handleButtons.includes('reject')"
      size="small"
      @click="submitHandlingComments('reject')"
    >{{ handleButtonText.reject }}</el-button>
    <el-button
      v-if="handleButtons.includes('satisfy')"
      size="small"
      @click="submitHandlingComments('satisfy')"
    >{{ handleButtonText.satisfy }}</el-button>
    <el-button
      v-if="handleButtons.includes('unsatisfy')"
      size="small"
      @click="submitHandlingComments('unsatisfy')"
    >{{ handleButtonText.unsatisfy }}</el-button>
<!--    <el-button-->
<!--      v-if="handleButtons.includes('distribute')"-->
<!--      size="small"-->
<!--      style="margin: 0 10px"-->
<!--      @click="handleFlowDistribute"-->
<!--    >{{ handleButtonText.distribute }}</el-button>-->
    <el-popover
      v-if="handleButtons.includes('distribute')"
      placement="top"
      width="260"
      trigger="manual"
      v-model="distributePopvisible">
      <p>请选择派发人</p>
      <OptOrgDialog
        :tabs="['user']"
        v-model="distributeUser"
      />

      <div style="text-align: right; margin: 0">
        <el-button size="mini" type="text" @click="distributePopvisible = false">取消</el-button>
        <el-button type="primary" size="mini" @click="handleFlowDistribute">确定</el-button>
      </div>
      <el-button slot="reference" size="small" style="margin: 0 10px" @click="distributePopvisible=!distributePopvisible">{{ handleButtonText.distribute }}</el-button>
    </el-popover>
    <el-popover
      v-if="handleButtons.includes('transfer')"
      placement="top"
      width="260"
      trigger="manual"
      v-model="transferPopvisible">
      <p>请选择代办人</p>
      <OptOrgDialog
        v-model="transferUser"
        :tabs="['user']"
      />

      <div style="text-align: right; margin: 0">
        <el-button size="mini" type="text" @click="transferPopvisible = false">取消</el-button>
        <el-button type="primary" size="mini" @click="handleTransfer">确定</el-button>
      </div>
      <el-button slot="reference" size="small" style="margin: 0 10px" @click="transferPopvisible = !transferPopvisible">{{ handleButtonText.transfer }}</el-button>
    </el-popover>

    <el-button
      v-if="handleButtons.includes('resubmit')"
      size="small"
      style="margin: 0 10px"
      @click="handleFlowResubmit"
    >{{ handleButtonText.resubmit }}</el-button>
    <el-popover
      v-if="handleButtons.includes('delayApply')"
      placement="top"
      width="260"
      v-model="requestDelayPopvisible"
      @show="delayPropShow">
      <p>延期时间</p>
      <el-date-picker
        v-model="requestDelayDateTime"
        type="datetime"
        placeholder="选择日期时间"
        value-format="yyyy-MM-dd HH:mm:ss"
      >
      </el-date-picker>
      <div style="text-align: right; margin: 0">
        <el-button size="mini" type="text" @click="requestDelayPopvisible = false">取消</el-button>
        <el-button type="primary" size="mini" @click="requestDelay">确定</el-button>
      </div>
      <el-button slot="reference" size="small" style="margin: 0 10px">{{ handleButtonText.delayApply }}</el-button>
    </el-popover>

    <el-button
      v-if="handleButtons.includes('agreeDelayApply')"
      size="small" style="margin: 0 10px"
      @click="handleDelay('agreeDelayApply')"
    >{{ handleButtonText.agreeDelayApply }}</el-button>
    <el-button
      v-if="handleButtons.includes('rejectDelayApply')"
      size="small" style="margin: 0 10px"
      @click="handleDelay('rejectDelayApply')"
    >{{ handleButtonText.rejectDelayApply }}</el-button>

    <el-button
      v-if="handleButtons.includes('tempfinish')"
      size="small" style="margin: 0 10px"
      @click="handleTempfinish"
    >{{ handleButtonText.tempfinish }}</el-button>
    <el-button
      v-if="handleButtons.includes('urge')"
      size="small" style="margin: 0 10px"
      @click="handleUrge"
    >{{ handleButtonText.urge }}</el-button>
    <el-button
      v-if="handleButtons.includes('tel')"
      size="small"
      style="margin: 0 10px"
      @click="handleDial"
    >{{ handleButtonText.tel }}</el-button>
    <el-button
      v-if="handleButtons.includes('print')"
      size="small"
      style="margin: 0 10px"
      @click="handlePrint"
    >{{ handleButtonText.print }}</el-button>
    <el-button
      v-if="handleButtons.includes('revoke')"
      size="small"
      style="margin: 0 10px"
      @click="submitRevokeComments"
    >{{ handleButtonText.revoke }}</el-button>
    <el-popover
      v-if="handleButtons.includes('active')"
      placement="top"
      width="270"
      v-model="activePopvisible">
      <el-table :data="activeNodeList" size="mini">
        <el-table-column width="160" property="name" label="节点名称"></el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button type="text" size="small" @click="activeNode(scope.row)">选择</el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-button slot="reference" size="small" style="margin: 0 10px" @click="getActiveNodeList">{{ handleButtonText.active }}</el-button>
    </el-popover>

    <el-button
      v-if="handleButtons.includes('doFinish')"
      size="small"
      @click="handleDoFinish"
    >{{ handleButtonText.doFinish }}</el-button>
    <!--督办-->
<!--    v-if="handleButtons.includes('supervise')"-->
<!--    <el-button-->
<!--      size="small"-->
<!--      @click="handleSupervise"-->
<!--    >{{ handleButtonText.supervise }}</el-button>-->
<!--    v-if="handleButtons.includes('supervise')"-->
    <el-popover
      v-if="handleButtons.includes('supervise')"
      placement="top"
      width="260"
      trigger="manual"
      v-model="supervisePopvisible">
      <p>请选择督办人员</p>
      <OptOrgDialog
        v-model="superviseUser"
        :tabs="['user','dyna']"
        has-node-approver
      />

      <div style="text-align: right; margin: 0">
        <el-button size="mini" type="text" @click="supervisePopvisible = false">取消</el-button>
        <el-button type="primary" size="mini" @click="handleSupervise">确定</el-button>
      </div>
      <el-button slot="reference" size="small" style="margin: 0 10px" @click="supervisePopvisible = !supervisePopvisible">{{ handleButtonText.supervise }}</el-button>
    </el-popover>
    <!--取消督办-->
    <el-button
      v-if="handleButtons.includes('cancelSupervise')"
      size="small"
      @click="handleCancelSupervise"
    >{{ handleButtonText.cancelSupervise }}</el-button>
    <el-button
      v-if="handleButtons.includes('ice')"
      size="small"
      @click="handleIce"
    >{{ handleButtonText.ice }}</el-button>
    <el-button
      v-if="handleButtons.includes('cancelIce')"
      size="small"
      @click="handleCancelIce"
    >{{ handleButtonText.cancelIce }}</el-button>
    <el-button
      v-if="handleButtons.includes('signFor')"
      size="small"
      @click="handleSignFor"
    >{{ handleButtonText.signFor }}</el-button>

    <el-popover
      v-if="handleButtons.includes('second')"
      placement="top"
      width="260"
      v-model="secondPopvisible">
      <p>二次办理时限</p>
      <el-input placeholder="请输入内容" v-model="secondTimeLimit.number" size="small" style="width: 200px;">
        <template slot="append">
          <el-select v-model="secondTimeLimit.unit" size="small" style="width: 80px">
            <el-option label="天" value="day"/>
            <el-option label="时" value="hour"/>
<!--            <el-option label="分" value="min"/>-->
          </el-select>
        </template>
      </el-input>

      <div style="text-align: right; margin-top: 10px">
        <el-button size="mini" type="text" @click="secondPopvisible = false">取消</el-button>
        <el-button type="primary" size="mini" @click="handleSecond">确定</el-button>
      </div>
      <el-button slot="reference" size="small" style="margin: 0 10px">{{ handleButtonText.second }}</el-button>
    </el-popover>
  </div>
</template>

<script>
import {closeTask, completeTask, /*diagramView,*/ /*resourceView,*/ revoke,
  getActiveNodeList, activeTask, /*historyFlowList,*/ requestFLowDelay, handleFLowDelay, flowDistribute,
  flowResubmit, tempfinish, transfer, urge, doFinish, supervise, cancelSupervise, ice, cancelIce, signFor, second
} from '@/api/mywork/worklist'

// import SelectUser from '@/views/system/flow/desinger/components/common/selectUser'
import OptOrgDialog from "@/views/optOrg/OptOrgDialog";
import {dateFormat} from '@/util/date'
import initMixin from "./initMixin";

import { defaultDynaNameData } from "@/util/qsgCommon.js"

export default {
  name: 'HandleBar',
  components: {
    // SelectUser,
    OptOrgDialog
  },
  mixins: [initMixin],
  props: {
    data: {
      type: Object,
      default() {
        return {};
      }
    },
    handleDial: {
      type: Function,
      default() {
        return ()=>{}
      }
    },
    getForm: {
      type: Function,
      default() {
        return ()=>{}
      }
    }
  },
  data() {
    return {
      handleComments: '',
      activePopvisible: false,
      activeNodeList: [],
      requestDelayPopvisible: false,
      requestDelayDateTime: '',
      tempfinishPopvisible: false,
      tempfinishComments: '',
      distributePopvisible: false,
      distributeUser: {
        list: [],
        // includeChildren: false,
        applicant: false,
        applicantLeader: false,
        submitterLeader: false
      },
      transferPopvisible: false,
      transferUser: {
        list: [],
        // includeChildren: false,
        applicant: false,
        applicantLeader: false,
        submitterLeader: false
      },
      desingerData: {},
      secondPopvisible: false,
      secondTimeLimit: {
        number: 1,
        unit: 'hour'
      },
      supervisePopvisible: false,
      superviseUser: {
        list: [],
        nodeApprover: false,
        applicant: false,
        applicantLeader: false,
        applicantDirectLeader: false,
        submitterLeader: false,
        submitDirectLeader: false
      },
    }
  },
  methods: {
    handleSubmitClick() {
      // this.handlingType = 'agree'
      this.handleComments = ''
      this.submitHandlingComments('submit')
    },
    async handleCloseTask() {
      const passStatus = 'close'
      const res = await this.handleFormSubmit(passStatus)
      if(!res.success){
        return
      }
      const data = {
        formDataId: res.data.id,
        processInstanceId: this.data.processInstanceId,
        processDefinitionId: this.data.processDefinitionId,
        taskId: this.data.taskId,
        taskDefinitionKey: this.data.taskDefinitionKey,
        comment: this.handleComments,
        passStatus,
        frontButtonText: this.handleButtonText.close
      }
      await closeTask(data)

      this.$message.success('关闭成功！')
      this.$emit('complete')
    },
    async submitHandlingComments(type) {
      const passStatus = type
      const res = await this.handleFormSubmit(passStatus)
      if(!res.success){
        return
      }
      // debugger
      // taskId,processInstanceId,passStatus(agree-reject-satisfy-unsatisfy-joinsign),comment，joinsignAccounts
      const params = {
        formDataId: res.data.id,
        taskId: this.data.taskId,
        processInstanceId: this.data.processInstanceId,
        processDefinitionId: this.data.processDefinitionId,
        taskDefinitionKey: this.data.taskDefinitionKey,
        passStatus: passStatus,
        comment: this.handleComments,
        frontButtonText: this.handleButtonText[passStatus]
      }
      await completeTask(params)

      this.$message.success('提交处理成功！')
      this.$emit('complete')
    },
    async submitRevokeComments() {
      // const res = await this.handleFormSubmit()
      // if(!res.success){
      //   return
      // }
      const params = {
        formDataId: this.data.formDataId,
        taskId: this.data.taskId,
        processInstanceId: this.data.processInstanceId,
        processDefinitionId: this.data.processDefinitionId,
        taskDefinitionKey: this.data.taskDefinitionKey,
        comment: this.handleComments,
        passStatus:'revoke',
        frontButtonText: this.handleButtonText.revoke
      }
      await revoke(params)
      this.$message.success('撤回成功！')
      this.$emit('complete')
    },
    async getActiveNodeList() {
      const {data: {data}} = await getActiveNodeList(this.data.processDefinitionId)

      this.activeNodeList = data
    },
    async activeNode(row) {
      // processInstanceId,taskId,processDefinitionId,taskDefinitionKey,toActivityId,toActivityName
      const params = {
        processInstanceId: this.data.processInstanceId,
        taskId: this.data.taskId,
        processDefinitionId: this.data.processDefinitionId,
        taskDefinitionKey: this.data.taskDefinitionKey,
        toActivityId: row.id,
        toActivityName: row.name,
        passStatus:'active',
        frontButtonText: this.handleButtonText.active
      }
      await activeTask(params)

      this.$message.success('提交成功！')
      this.activePopvisible = false
    },
    async requestDelay() {
      const time = new Date(this.requestDelayDateTime)
      if(time.getTime() < Date.now()) {
        this.$message.error('申请延期必须晚于当前时间！')
        return
      }
      // 添加延期时间
      const data = this.getForm().getSubmitData()
      data.datetime_delay_apply_date = this.requestDelayDateTime

      const passStatus = 'delayApply'
      const res = await this.handleFormSubmit(passStatus)
      if(!res.success){
        return
      }
      const params = {
        formDataId: res.data.id,
        taskId: this.data.taskId,
        processInstanceId: this.data.processInstanceId,
        processDefinitionId: this.data.processDefinitionId,
        taskDefinitionKey: this.data.taskDefinitionKey,
        comment: this.handleComments,
        passStatus,
        frontButtonText: this.handleButtonText.delayApply
      }
      await requestFLowDelay(params)
      this.requestDelayPopvisible = false
      this.$message.success('申请延期成功！')
      this.$emit('complete')
    },
    async handleDelay(type) {
      const res = await this.handleFormSubmit(type)
      if(!res.success){
        return
      }
      const params = {
        formDataId: res.data.id,
        taskId: this.data.taskId,
        processInstanceId: this.data.processInstanceId,
        processDefinitionId: this.data.processDefinitionId,
        taskDefinitionKey: this.data.taskDefinitionKey,
        passStatus: type,
        comment: this.handleComments,
        frontButtonText: this.handleButtonText[type]
      }
      await handleFLowDelay(params)
      this.$message.success('提交成功！')
      this.$emit('complete')
    },
    handleSelectUser(userSetting) {
      const messageNoticeAuth = {
        candidateDynamicUsers: [],
        candidateUsers: [],
        candidateGroups: []
      }
      if (userSetting.nodeApprover) {
        messageNoticeAuth.candidateDynamicUsers.push({ value: '${huilan_nodeApprover}', name: defaultDynaNameData.nodeApprover })
      }
      if(userSetting.applicant) {
        messageNoticeAuth.candidateDynamicUsers.push({value: '${huilan_apply}', name: defaultDynaNameData.applicant})
      }
      if(userSetting.applicantLeader) {
        messageNoticeAuth.candidateDynamicUsers.push({value: '${huilan_applyLeader}', name: defaultDynaNameData.applicantLeader})
      }
      if (userSetting.applicantDirectLeader) {
        messageNoticeAuth.candidateDynamicUsers.push({ value: '${huilan_applyDirectLeader}', name: defaultDynaNameData.applicantDirectLeader })
      }
      if(userSetting.submitterLeader) {
        messageNoticeAuth.candidateDynamicUsers.push({value: '${huilan_submitLeader}', name: defaultDynaNameData.submitterLeader})
      }
      if(userSetting.submitDirectLeader) {
        messageNoticeAuth.candidateDynamicUsers.push({value: '${huilan_submitDirectLeader}', name: defaultDynaNameData.submitDirectLeader})
      }
      userSetting.list.forEach(item => {
        // console.log('handleSelectUser', item)
        if(item.type === 'user') {
          messageNoticeAuth.candidateUsers.push({value: item.id, name: item.name ||''})
        }else {
          messageNoticeAuth.candidateGroups.push({value: item.id, name: item.name ||'', type: item.type})
        }
      })
      return messageNoticeAuth
    },
    async handleFlowDistribute() {

      const passStatus = 'distribute'
      const res = await this.handleFormSubmit(passStatus)
      if(!res.success){
        return
      }

      const distributeUser = this.handleSelectUser(this.distributeUser)
      const params = {
        formDataId: res.data.id,
        taskId: this.data.taskId,
        processInstanceId: this.data.processInstanceId,
        processDefinitionId: this.data.processDefinitionId,
        taskDefinitionKey: this.data.taskDefinitionKey,
        passStatus,
        distributerAuth: distributeUser,
        frontButtonText: this.handleButtonText.distribute
      }
      await flowDistribute(params)
      this.$message.success('派发成功！')
      this.distributePopvisible = false
      this.$emit('complete')
    },
    async handleFlowResubmit() {
      const passStatus = 'resubmit'
      const res = await this.handleFormSubmit(passStatus)
      if(!res.success){
        return
      }
      const params = {
        formDataId: res.data.id,
        taskId: this.data.taskId,
        processInstanceId: this.data.processInstanceId,
        processDefinitionId: this.data.processDefinitionId,
        taskDefinitionKey: this.data.taskDefinitionKey,
        comment: this.handleComments,
        passStatus,
        frontButtonText: this.handleButtonText.resubmit
      }
      await flowResubmit(params)
      this.$message.success('重新提交成功！')
      this.$emit('complete')
    },
    async handleTempfinish() {
      const passStatus = 'tempfinish'
      const res = await this.handleFormSubmit(passStatus)
      if(!res.success){
        return
      }
      const params = {
        formDataId: res.data.id,
        taskId: this.data.taskId,
        processInstanceId: this.data.processInstanceId,
        processDefinitionId: this.data.processDefinitionId,
        taskDefinitionKey: this.data.taskDefinitionKey,
        comment: this.handleComments,
        passStatus,
        frontButtonText: this.handleButtonText.tempfinish
      }
      await tempfinish(params)
      this.$message.success('提交成功！')
      this.$emit('complete')
    },
    async handleTransfer() {
      if(this.transferUser.list.length > 1) {
        this.$message.error('只能选择一个代办人员!')
        return
      }
      const passStatus = 'transfer'
      const res = await this.handleFormSubmit(passStatus)
      if(!res.success){
        return
      }
      const params = {
        formDataId: res.data.id,
        taskId: this.data.taskId,
        processInstanceId: this.data.processInstanceId,
        processDefinitionId: this.data.processDefinitionId,
        taskDefinitionKey: this.data.taskDefinitionKey,
        acceptUserAccount: this.transferUser.list.map(item=>item.id).join(),
        passStatus,
        frontButtonText: this.handleButtonText.transfer
      }
      await transfer(params)
      this.transferPopvisible =false
      this.$message.success('提交代办成功！')
      this.$emit('complete')
    },
    async handleUrge() {
      // const res = await this.handleFormSubmit()
      // if(!res.success){
      //   return
      // }
      const params = {
        formDataId: this.data.formDataId,
        taskId: this.data.taskId,
        processInstanceId: this.data.processInstanceId,
        processDefinitionId: this.data.processDefinitionId,
        taskDefinitionKey: this.data.taskDefinitionKey,
        passStatus: 'urge',
        frontButtonText: this.handleButtonText.urge
      }
      await urge(params)
      this.$message.success('提交成功！')
      this.$emit('complete')
    },
    delayPropShow() {
      const date = new Date(Date.now() + 60000)
      const str = dateFormat(date)
      this.requestDelayDateTime = str
    },
    async handleDoFinish() {
      const passStatus = 'doFinish'
      const res = await this.handleFormSubmit(passStatus)
      if(!res.success){
        return
      }
      const params = {
        formDataId: res.data.id,
        taskId: this.data.taskId,
        processInstanceId: this.data.processInstanceId,
        processDefinitionId: this.data.processDefinitionId,
        taskDefinitionKey: this.data.taskDefinitionKey,
        comment: this.handleComments,
        passStatus,
        frontButtonText: this.handleButtonText.doFinish
      }
      await doFinish(params)
      this.$message.success('提交成功！')
      this.$emit('complete')
    },
    async handleSupervise() {
      // const res = await this.handleFormSubmit()
      // if(!res.success){
      //   return
      // }
      const superviseUser = this.handleSelectUser(this.superviseUser)
      const params = {
        formDataId: this.data.formDataId,
        taskId: this.data.taskId,
        processInstanceId: this.data.processInstanceId,
        processDefinitionId: this.data.processDefinitionId,
        taskDefinitionKey: this.data.taskDefinitionKey,
        comment: this.handleComments,
        passStatus: 'supervise',
        frontButtonText: this.handleButtonText.supervise,
        superviseAuth: superviseUser
      }
      await supervise(params)
      this.$message.success('提交成功！')
      this.$emit('complete')
    },
    async handleCancelSupervise() {
      // const res = await this.handleFormSubmit()
      // if(!res.success){
      //   return
      // }
      const params = {
        formDataId: this.data.formDataId,
        taskId: this.data.taskId,
        processInstanceId: this.data.processInstanceId,
        processDefinitionId: this.data.processDefinitionId,
        taskDefinitionKey: this.data.taskDefinitionKey,
        comment: this.handleComments,
        passStatus: 'cancelSupervise',
        frontButtonText: this.handleButtonText.cancelSupervise
      }
      await cancelSupervise(params)
      this.$message.success('提交成功！')
      this.$emit('complete')
    },
    async handleIce() {
      // const res = await this.handleFormSubmit()
      // if(!res.success){
      //   return
      // }
      const params = {
        formDataId: this.data.formDataId,
        taskId: this.data.taskId,
        processInstanceId: this.data.processInstanceId,
        processDefinitionId: this.data.processDefinitionId,
        taskDefinitionKey: this.data.taskDefinitionKey,
        comment: this.handleComments,
        passStatus: 'ice',
        frontButtonText: this.handleButtonText.ice
      }
      await ice(params)
      this.$message.success('提交成功！')
      this.$emit('complete')
    },
    async handleCancelIce() {
      // const res = await this.handleFormSubmit()
      // if(!res.success){
      //   return
      // }
      const params = {
        formDataId: this.data.formDataId,
        taskId: this.data.taskId,
        processInstanceId: this.data.processInstanceId,
        processDefinitionId: this.data.processDefinitionId,
        taskDefinitionKey: this.data.taskDefinitionKey,
        comment: this.handleComments,
        passStatus: 'cancelIce',
        frontButtonText: this.handleButtonText.cancelIce
      }
      await cancelIce(params)
      this.$message.success('提交成功！')
      this.$emit('complete')
    },
    async handleSignFor() {
      // const res = await this.handleFormSubmit()
      // if(!res.success){
      //   return
      // }
      const params = {
        formDataId: this.data.formDataId,
        taskId: this.data.taskId,
        processInstanceId: this.data.processInstanceId,
        processDefinitionId: this.data.processDefinitionId,
        taskDefinitionKey: this.data.taskDefinitionKey,
        comment: this.handleComments,
        passStatus: 'signFor',
        frontButtonText: this.handleButtonText.signFor
      }
      await signFor(params)
      this.$message.success('提交成功！')
      this.$emit('complete')
    },
    validsecondTimeLimitNumber() {
      const value = this.secondTimeLimit.number
      const reg = /^([0-9]+)$/
      let flag = true
      let msg = ''
      if(value.length !==0) {
        if(reg.test(value)) {
          const temp = Number.parseInt(value)
          if(temp > 0 && temp < 300) {
            flag = true
            msg = '';
          }else {
            flag = false
            msg = '数字范围为0-300';
          }
        }else {
          flag = false
          msg = '只能输入数字，范围0-300';
        }
      }else {
        flag = false
        msg='请输入内容'
      }
      if(msg) {
        this.$message.error(msg)
      }
      return flag
    },
    async handleSecond() {
      if(!this.validsecondTimeLimitNumber()) {
        return;
      }
      const passStatus = 'second'
      const res = await this.handleFormSubmit(passStatus)
      if(!res.success){
        return
      }
      const params = {
        formDataId: this.data.formDataId,
        taskId: this.data.taskId,
        processInstanceId: this.data.processInstanceId,
        processDefinitionId: this.data.processDefinitionId,
        taskDefinitionKey: this.data.taskDefinitionKey,
        passStatus: 'second',
        comment: this.handleComments,
        secondExpiredConfig: this.secondTimeLimit,
        frontButtonText: this.handleButtonText.second
      }
      await second(params)
      this.$message.success('提交成功！')
      this.secondPopvisible = false
      this.$emit('complete')
    }
  }
}
</script>

<style scoped>

</style>
