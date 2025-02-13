<template>
  <el-form
    ref="form"
    :model="form"
    :rules="rules"
    size="small"
    label-width="80px"
    class="flow-node-prop-form"
  >
    <el-form-item label="节点名称" prop="name">
      <el-input v-model="form.name"></el-input>
    </el-form-item>
    <div class="user-task-user">
      <div>
        <el-form-item label="审批类型">
          <el-select v-model="form.approvalType">
            <el-option
              value="orSign"
              label="或签（一名负责人通过或拒绝即可）"
            />
            <el-option
              value="countersign"
              label="会签（需要所选负责人通过率达到会签比例）"
            />
          </el-select>
        </el-form-item>
        <el-form-item
          label-width="100px"
          v-if="form.approvalType === 'countersign'"
          label="会签比例(>=)"
        >
          <el-input-number
            v-model="form.ratio"
            controls-position="right"
            :min="1"
            :max="100"
          ></el-input-number>
          %
        </el-form-item>
      </div>
      <div v-if="$store.getters.dialogVisible">
        <el-form-item label="负责人" prop="handler">
          <!-- <SelectUser
            ref="selectUserRef"
            :personCharge="personCharge"
            v-model="form.handler"
            :disabledTabs="disabledHandlerTabs"
          /> -->

          <OptOrgDialog
            v-model="form.handler"
            :tabs="form.approvalType === 'countersign' ? ['user'] : []"
            title="选择负责人"
          >
          </OptOrgDialog>
        </el-form-item>
      </div>
    </div>
    <el-tabs v-model="activeTab">
      <el-tab-pane label="基础设置" name="second">
        <template v-if="desinger.type !== 'noForm'">
          <el-form-item label="签收">
            <el-switch
              :disabled="form.approvalType === 'countersign'"
              v-model="form.ifSighFor"
            >
            </el-switch>
            <p class="base-setting-tip">允许对当前节点进行签收</p>
            <!--          <SelectUser v-if="form.urge" v-model="form.urgeUsers"/>-->
          </el-form-item>
          <el-form-item label="催办">
            <el-switch v-model="form.urge"> </el-switch>
            <p class="base-setting-tip">
              开启后支持对处理节点负责人进行手动催办提醒
            </p>
            <template v-if="form.urge">
              <div>
                <!-- <SelectUser v-if="form.urge" v-model="form.urgeUsers" /> -->
                <OptOrgDialog
                  v-model="form.urgeUsers"
                  hasNodeApprover
                  title="选择负责人"
                ></OptOrgDialog>
              </div>
            </template>
          </el-form-item>
          <el-form-item label="允许撤回">
            <el-switch v-model="form.undo"> </el-switch>
            <p class="base-setting-tip">允许对提交的流程进行强制撤回</p>
            <!-- <SelectUser v-if="form.undo" v-model="form.undoUsers" /> -->
            <template v-if="form.undo">
              <div>
                <OptOrgDialog
                  v-model="form.undoUsers"
                  hasNodeApprover
                  title="选择负责人"
                ></OptOrgDialog>
              </div>
            </template>
          </el-form-item>
          <el-form-item label="挂起">
            <el-switch v-model="form.ifIce"> </el-switch>
            <p class="base-setting-tip">开启后支持暂办结（挂起）</p>
            <!--          <SelectUser v-if="form.urge" v-model="form.urgeUsers"/>-->
          </el-form-item>
          <el-form-item label="代办">
            <el-switch v-model="form.turn"> </el-switch>
            <p class="base-setting-tip">
              节点负责人可将待办事项转交给其他成员处理
            </p>
            <!--          <SelectUser v-if="form.turn" v-model="form.turnUsers"/>-->
          </el-form-item>
          <!--        <el-form-item label="延期申请">-->
          <!--          <el-switch v-model="form.delay">-->
          <!--          </el-switch>-->
          <!--          <p class="base-setting-tip">允许对当前节点时限提出延期</p>-->
          <!--        </el-form-item>-->
          <!--        <el-form-item label="暂办结">-->
          <!--          <el-switch v-model="form.tentativeKnot">-->
          <!--          </el-switch>-->
          <!--          <p class="base-setting-tip">允许对当前节点申请暂办结</p>-->
          <!--        </el-form-item>-->
          <el-form-item
            v-if="form.approvalType !== 'countersign'"
            label="指定审批"
          >
            <el-switch v-model="form.specify"> </el-switch>
            <p class="base-setting-tip">可以直接指定下一审批节点</p>
          </el-form-item>
          <el-form-item label="直接关闭">
            <el-switch v-model="form.close"> </el-switch>
            <p class="base-setting-tip">允许对当前节点直接关闭当前单据</p>
          </el-form-item>
          <el-form-item
            v-if="form.approvalType !== 'countersign'"
            label="重新提交"
          >
            <el-switch v-model="form.reSubmit"> </el-switch>
            <p class="base-setting-tip">允许对当前节点重新提交当前单据</p>
          </el-form-item>
          <el-form-item label="打印">
            <el-switch v-model="form.print"> </el-switch>
            <p class="base-setting-tip">支持该节点进行打印</p>
          </el-form-item>
          <el-form-item label="驳回时到">
            <el-radio-group v-model="form.rejectType">
              <el-radio label="originNode">处理节点</el-radio>
              <el-radio label="submitter">处理人</el-radio>
            </el-radio-group>
          </el-form-item>
        </template>
        <!--        <el-form-item label="委派">-->
        <!--          <el-switch v-model="form.undo">-->
        <!--          </el-switch>-->
        <!--          <p class="base-setting-tip">可手动选择选择承办方</p>-->
        <!--          <SelectUser/>-->
        <!--        </el-form-item>-->
        <el-form-item label="操作按钮">
          <el-checkbox-group v-model="form.buttons">
            <template v-if="desinger.type === 'noForm'">
              <el-checkbox label="pass">同意</el-checkbox>
              <el-checkbox label="back">驳回</el-checkbox>
            </template>
            <template v-else>
              <el-checkbox
                label="pass"
                :disabled="form.approvalType === 'countersign'"
                >同意</el-checkbox
              >
              <el-checkbox
                label="back"
                :disabled="form.approvalType === 'countersign'"
                >驳回</el-checkbox
              >
<!--              <el-radio-group-->
<!--                v-if="form.buttons.includes('back')"-->
<!--                v-model="form.rejectType"-->
<!--                class="reject-type"-->
<!--              >-->
<!--                <el-radio label="submitter">提交人</el-radio>-->
<!--                <el-radio label="originNode">处理节点</el-radio>-->
<!--              </el-radio-group>-->
              <!--            <el-checkbox label="tempfinish">指定审批</el-checkbox>-->
              <template v-if="form.approvalType !== 'countersign'">
                <el-checkbox label="distribute">派发</el-checkbox>
                <!--              <el-checkbox label="specify">指定审批</el-checkbox>-->
                <!--              <el-checkbox label="turn">转办</el-checkbox>-->
                <!--              <el-checkbox label="reSubmit">重新提交</el-checkbox>-->
                <el-checkbox label="delay">申请延期</el-checkbox>
                <el-checkbox label="agreeDelay">同意延期</el-checkbox>
                <el-checkbox label="rejectDelay">拒绝延期</el-checkbox>
                <el-checkbox label="tentativeKnot">申请审批</el-checkbox>
                <el-checkbox label="doFinish">办结</el-checkbox>
                <el-checkbox label="second">二次办理</el-checkbox>
              </template>
            </template>
            <!--            <el-checkbox label="close">直接关闭</el-checkbox>-->
          </el-checkbox-group>
        </el-form-item>
      </el-tab-pane>
      <el-tab-pane label="高级设置" name="third">
        <h3 class="legend">流程超时</h3>
        <p class="base-setting-tip" style="margin-bottom: 10px">
          节点负责人可将待办事项转交给其他成员处理
        </p>
        <div class="exceed-setting">
          <div class="exceed-setting-cont">
            <span class="title">超时时间</span>
            {{
              exceedSetting.setting
                ? `到达该节点${exceedSetting.exceedTime}${
                    types[exceedSetting.exceedType]
                  }后`
                : "未设置"
            }}<br /><br />
            <span class="title">超时预警</span>
            {{
              exceedSetting.earlyWarning
                ? `超时前${exceedSetting.warningTime}${
                    types[exceedSetting.warningType]
                  }`
                : "未设置"
            }}
          </div>
          <div>
            <el-button
              icon="el-icon-edit"
              size="mini"
              @click="settingExceed"
            ></el-button>
          </div>
        </div>
        <el-form-item label="消息提醒">
          <el-switch v-model="form.sendMessage"> </el-switch>
        </el-form-item>
        <template v-if="form.sendMessage">
          <el-form-item label="提醒人员">
            <!--            <el-checkbox-group v-model="form.remindType">-->
            <!--              <el-checkbox label="submitter">提交人</el-checkbox>-->
            <!--              <el-checkbox label="other">其他</el-checkbox>-->
            <!--            </el-checkbox-group>-->
            <!-- <SelectUser v-model="form.messageUsers" /> -->
            <OptOrgDialog
              v-model="form.messageUsers"
              hasNodeApprover
              title="选择提醒人员"
            ></OptOrgDialog>
          </el-form-item>
          <MessageList
            v-if="desinger.type !== 'noForm'"
            style="margin-bottom: 18px"
            :messageTypeList="messageTypeList"
            :selectedList="selectedList"
            :curSelectedList.sync="curSelectedList"
          />
        </template>
        <div v-if="desinger.type !== 'noForm'" class="button-names">
          <div class="head">
            <div>自定义按钮名称</div>
            <div><el-switch v-model="form.hasCustomButton" /></div>
          </div>
          <div v-if="form.hasCustomButton" class="body">
            <!--            <el-button size="small">同意</el-button>-->
            <el-form-item
              v-for="item in form.customButtonList"
              :key="item.code"
              :label="item.label"
            >
              <EditButton v-model="item.name" />
            </el-form-item>
            <!--            <EditButton v-model="form.name"/>-->
            <!--            <el-button size="small">驳回</el-button>-->
            <!--            <el-button size="small">派发</el-button>-->
            <!--            <el-button size="small">申请审批</el-button>-->
          </div>
        </div>
        <el-dialog
          title="流程超时"
          :visible.sync="exceedSettingVisible"
          append-to-body
          width="450px"
        >
          <h3 style="margin-top: 0">超时触发时间</h3>
          <p style="margin-bottom: 5px">
            超时设置 <el-switch v-model="exceedSetting.setting" />
          </p>
          <template v-if="exceedSetting.setting">
            <p>
              流程到达该节点
              <el-input
                placeholder="请输入内容"
                v-model="exceedSetting.exceedTime"
                size="small"
                style="width: 200px"
              >
                <template slot="append">
                  <el-select
                    v-model="exceedSetting.exceedType"
                    size="small"
                    style="width: 80px"
                  >
                    <el-option label="天" value="day" />
                    <el-option label="时" value="hour" />
                    <el-option label="分" value="min" />
                  </el-select>
                </template>
              </el-input>
              后
            </p>
            <!--            <h3>超时处理</h3>-->
            <!--            <p style="margin-bottom: 5px;">自动提交 <el-switch v-model="exceedSetting.auto"/></p>-->
            <!--            <p class="exceed-setting-tip">设置为自动提交后，该节点会忽略任何提交限制，自动提交到下一个节点</p>-->
          </template>
          <template v-if="exceedSetting.setting">
            <h3>超时预警</h3>
            <p style="margin-bottom: 5px">
              超时预警 <el-switch v-model="exceedSetting.earlyWarning" />
            </p>
            <p class="exceed-setting-tip">
              停留该时间间隔后对指定人进行即将超时提醒
            </p>
            <p v-if="exceedSetting.earlyWarning">
              超时前
              <el-input
                placeholder="请输入内容"
                v-model="exceedSetting.warningTime"
                size="small"
                style="width: 200px"
              >
                <template slot="append">
                  <el-select
                    v-model="exceedSetting.warningType"
                    size="small"
                    style="width: 80px"
                  >
                    <el-option label="天" value="day" />
                    <el-option label="时" value="hour" />
                    <el-option label="分" value="min" />
                  </el-select>
                </template>
              </el-input>
            </p>
          </template>
          <template v-slot:footer>
            <el-button size="small" type="primary" @click="submitExceedSetting"
              >确 定</el-button
            >
            <el-button size="small" @click="exceedSettingVisible = false"
              >取 消</el-button
            >
          </template>
        </el-dialog>
      </el-tab-pane>
      <el-tab-pane
        v-if="desinger.type !== 'noForm'"
        label="字段权限"
        name="first"
      >
        <FieldSetting :allFields="groupedFields" :fieldSetting="fieldSetting" />
      </el-tab-pane>
    </el-tabs>
    <el-form-item class="submit-bar">
      <el-button type="primary" @click="onSubmit">确定</el-button>
      <el-button @click="onCancel">取消</el-button>
    </el-form-item>
  </el-form>
</template>

<script>
import FieldSetting from "./common/fieldSetting";
// import SelectUser from "./common/selectUser";
import MessageList from "./common/messageList";
import EditButton from "./common/editButton";
import { getDictionary } from "@/api/system/dict";
import groupFields from "./mixin/groupFormFields";

import OptOrgDialog from "@/views/optOrg/OptOrgDialog";
import { deepClone } from "@/util/util";

export default {
  name: "UserTaskProp",
  components: {
    FieldSetting,
    // SelectUser,
    MessageList,
    EditButton,
    OptOrgDialog,
  },
  inject: ["desinger"],
  mixins: [groupFields],
  data() {
    return {
      optTag: false,
      optTitle: "选择负责人",
      ajaxCheckedData: [],

      form: {
        name: "",
        handler: {
          list: [],
          // includeChildren: false,
          applicant: false,
          applicantLeader: false,
          applicantDirectLeader: false,
          submitterLeader: false,
          submitDirectLeader: false
        },
        approvalType: "orSign",
        ratio: 60,
        ifSighFor: false,
        ifIce: false,
        print: false,
        turn: false,
        turnUsers: {
          list: [],
          // includeChildren: false,
          applicant: false,
          applicantLeader: false,
          submitterLeader: false,
          submitDirectLeader: false,
        },
        undo: false,
        // undoCopyHandler:false,
        undoUsers: {
          list: [],
          // includeChildren: false,
          nodeApprover: false,
          applicant: false,
          applicantLeader: false,
          applicantDirectLeader: false,
          submitterLeader: false,
          submitDirectLeader: false
        },
        specify: false,
        close: false,
        // delay: false,
        // tentativeKnot: false,
        urge: false,
        // urgeCopyHandler: false,
        urgeUsers: {
          list: [],
          // includeChildren: false,
          nodeApprover: false,
          applicant: false,
          applicantLeader: false,
          applicantDirectLeader: false,
          submitterLeader: false,
          submitDirectLeader: false
        },
        reSubmit: false,
        // close: false,
        rejectType: 'originNode',
        buttons: [],
        sendMessage: true,
        // remindType: [],
        messageUsers: {
          list: [],
          nodeApprover: true,
          applicant: true,
          // includeChildren: false,
          applicantLeader: false,
          applicantDirectLeader: false,
          submitterLeader: false,
          submitDirectLeader: false,
        },
        hasCustomButton: false,
        customButtonList: [
          { code: "pass", label: "同意", name: "同意" },
          { code: "back", label: "驳回", name: "驳回" },
          { code: "distribute", label: "派发", name: "派发" },
          { code: "tentativeKnot", label: "申请审批", name: "申请审批" },
          { code: "second", label: "二次办理", name: "二次办理" },
        ],
      },
      rules: {
        name: [{ required: true, message: "请输入节点名称" }],
        handler: [{ validator: this.validateHandler, trigger: "blur" }],
      },
      activeTab: "second",
      // tableData: [],
      messageTypeList: [],
      // 结合超时设置后应该出现的值
      // selectedList: [],
      curSelectedList: [],
      fieldSetting: {},
      exceedSettingVisible: false,
      exceedSetting: {
        setting: false,
        exceedTime: 2,
        exceedType: "hour",
        auto: false,
        earlyWarning: false,
        warningTime: 30,
        warningType: "min",
      },
      types: {
        day: "天",
        hour: "时",
        min: "分",
      },
      callback: null, //解决负责人选中提示不消失问题
    };
  },
  computed: {
    disabledHandlerTabs() {
      let tab = [];
      if (this.form.approvalType === "countersign") {
        tab = ["sec", "third", "fourth"];
      }
      return tab;
    },
    selectedList() {
      return this.desinger.curNodeSetting.messageList.filter(item=>{
        let flag =  true;
        if(!this.exceedSetting.setting) {
          if(item.type === 'timeoutReminder' || item.type === 'overtimeWarning') {
            flag = false
          }
        }else {
          if(!this.exceedSetting.earlyWarning && item.type === 'overtimeWarning') {
            flag = false
          }
        }


        return flag
      })
    }
  },
  watch: {
    // 'desinger.formFields': {
    //   handler(newVal) {
    //     let res = {}
    //     newVal.forEach(item => {
    //       res[item.name] = 'edit'
    //     })
    //     this.fieldSetting = res
    //   },
    //   immediate: true
    // },
    "desinger.curNodeSetting": {
      handler(newVal) {
        this.form = newVal;
        this.fieldSetting = newVal.fieldSetting;
        // this.tableData = newVal.messageList
        // this.mergeMessageList(newVal.messageList, true)
        this.exceedSetting = newVal.exceedSetting;
      },
      immediate: true,
    },
    "form.approvalType"(newVal) {
      if (this.desinger.type === "noForm") {
        return;
      }
      if (newVal === "countersign") {
        this.form.handler.nodeApprover = false;
        this.form.handler.applicant = false;
        this.form.handler.applicantLeader = false;
        this.form.handler.applicantDirectLeader = false;
        this.form.handler.submitterLeader = false;
        this.form.handler.submitDirectLeader = false;
        this.form.handler.list = this.form.handler.list.filter(
          (item) => item.type === "user"
        );
        // const arr = [
        //   "distribute",
        //   "delay",
        //   "agreeDelay",
        //   "rejectDelay",
        //   "tentativeKnot",
        //   "doFinish",
        //   "second",
        // ];
        // this.form.buttons = this.form.buttons.filter(
        //   (item) => !arr.includes(item)
        // );
        this.form.buttons = ["pass", "back"];
        this.form.specify = false;
        this.form.reSubmit = false;
        // 签收
        this.form.ifSighFor = false;
      }
    },
    'exceedSetting.setting'(newVal) {
      // debugger
      this.messageTypeList = this.messageTypeList.map(item=>{
        const newItem = {...item}
        if(item.type === 'timeoutReminder' || item.type === 'overtimeWarning') {
          newItem.disabled = !newVal
        }
        return newItem
      })
      // this.desinger.curNodeSetting.messageList
    },
    'exceedSetting.earlyWarning'(newVal) {
      this.messageTypeList = this.messageTypeList.map(item=>{
        const newItem = {...item}
        if(item.type === 'overtimeWarning') {
          newItem.disabled = !newVal
        }
        return newItem
      })
    }
  },
  methods: {
    validateHandler(rule, value, callback) {
      if (
        value.list.length === 0 &&
        !value.applicant &&
        !value.applicantLeader &&
        !value.applicantDirectLeader &&
        !value.submitterLeader &&
        !value.submitDirectLeader
      ) {
        callback(new Error("请选择负责人"));
      } else {
        callback();
      }
    },
    // mergeMessageList(data, flag) {
    //   let list = data
    //   if(flag) {
    //     list = this.tableData
    //   }
    //   list.forEach(item => {
    //     const res = this.tableData.find(row => row.type === item.type)
    //     if(res) {
    //       if(flag) {
    //         Object.assign(res, item)
    //       }
    //     }else {
    //       if(!flag) {
    //         this.tableData.push(item)
    //       }
    //     }
    //   })
    // },
    async getMessageList() {
      const {
        data: { data },
      } = await getDictionary({ code: "userTaskMessageType" });

      const tableData = data.map((item) => {
        let disabled = false;
        if(!this.exceedSetting.setting) {
          if(item.value === 'timeoutReminder' || item.value === 'overtimeWarning') {
            disabled = true
          }
        }else {
          if(!this.exceedSetting.earlyWarning && item.value === 'overtimeWarning') {
            disabled = true
          }
        }

        return {
          disabled,
          name: item.name,
          type: item.value,
          message: "",
          email: "",
          internal: "",
          smart: "",
          qyWeixin: "",
          custom: "",
        };
      });
      this.messageTypeList = tableData;
    },
    settingExceed() {
      this.exceedSettingVisible = true;
    },
    submitExceedSetting() {
      if (this.time()) {
        this.exceedSettingVisible = false;
      }
    },
    onSubmit() {
      const me = this;
      this.$refs.form.validate(function (valid) {
        if (valid) {
          if (me.time() && me.validateUrge()) {
            // console.log(me.form);
            const data = {
              ...me.form,
              fieldSetting: me.fieldSetting,
              messageList: me.curSelectedList,
              exceedSetting: me.exceedSetting,
            };
            me.$emit("close", data);
          }
        }
      });
    },
    personCharge() {
      this.$refs.form.validate(function (/*valid*/) {
        //console.log(valid)
      });
    },
    onCancel() {
      this.$store.commit("SET_DIALOGVISIBLE", false);
      this.$emit("close");
    },
    time() {
      let obj = deepClone(this.exceedSetting),
        warningTime = obj.warningTime,
        exceedTime = obj.exceedTime;
      if (obj.warningType === "hour") {
        warningTime = Number(obj.warningTime) * 60;
      }
      if (obj.warningType === "day") {
        warningTime = Number(obj.warningTime) * 60 * 24;
      }
      if (obj.exceedType === "hour") {
        exceedTime = Number(obj.exceedTime) * 60;
      }
      if (obj.exceedType === "day") {
        exceedTime = Number(obj.exceedTime) * 60 * 24;
      }
      // 开启超时预警后，才比较两个时间
      if(obj.earlyWarning) {
        if (Number(warningTime) > Number(exceedTime)) {
          this.$message.warning("超时预警时间不能大于超时触发时间");
          return false;
        }
      }
      return true;
    },
    validateUrge() {
      const urge = this.form.urge;
      if (!urge) {
        return true;
      }
      // 判断是否选中有催办的消息提醒
      const urgeMsg = this.curSelectedList.find((item) => item.type === "urge");
      // debugger
      if (!urgeMsg) {
        this.$message.warning("请配置催办消息提醒");
        return false;
      } else {
        /**
         * 催办消息的数据格式：
         * {
         *   name: "催办",
         *   type: "urge",
         *   message: "1610837667063861250",
         *   email: "",
         *   internal: "",
         *   smart: "",
         *   qyWeixin: ""
         * }
         */
        const keys = [
          "message",
          "email",
          "internal",
          /*'smart',*/ "qyWeixin",
          "custom",
        ];
        const allisEmpty = keys.every((key) => !urgeMsg[key]);
        if (allisEmpty) {
          this.$message.warning("请配置催办消息提醒");
        } else {
          return true;
        }
      }
    },
  },
  mounted() {
    if (this.desinger.type !== "noForm") {
      this.getMessageList();
    }
  },
};
</script>

<style lang="scss" scoped>
.flow-node-prop-form {
  padding: 0 10px 60px;
}
.user-task-user {
  display: flex;
  flex-flow: wrap;
  & > div:first-child {
    width: 100%;
    //padding-right: 10px;
    //border-right: 1px solid #e4e7ed;
  }
  & > div:last-child {
    width: 100%;
  }
}
.reject-type {
  margin: 0 30px 6px -15px;

  .el-radio {
    margin-right: 10px;

    &:last-child {
      margin-right: 0;
    }
  }
}
.exceed-setting {
  display: flex;
  margin-bottom: 15px;
}
.exceed-setting-cont {
  flex: 1;
  margin-right: 5px;
  padding: 5px;
  border: 1px solid #dcdfe6;
  border-radius: 5px;
  border-left-width: 5px;
  border-left-color: #f56c6c;
  font-size: 14px;

  .title {
    color: #8a979e;
    margin-right: 5px;
  }
}
.exceed-setting-tip {
  margin: 5px 0 10px;
  color: #8a979e;
  font-size: 12px;
}
.button-names {
  .head {
    display: flex;
    padding-bottom: 18px;

    > div:first-child {
      font-size: 14px;
      flex: 1;
      color: #606266;
    }
  }
}
.legend {
  margin: 0 0 5px;
  font-size: 14px;
  color: #606266;
  font-weight: 400;
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
