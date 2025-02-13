<template>
  <el-form
    ref="form"
    :model="form"
    :rules="rules"
    label-width="100px"
    size="small"
  >
    <el-form-item :label="$t('auditSetting.nodeName') + '：'" prop="label">
      <el-input
        v-model="form.label"
        :placeholder="
          $t('aicosCommon.pleaseInput') + $t('auditSetting.nodeName')
        "
        maxlength="50"
        show-word-limit
      ></el-input>
    </el-form-item>
    <el-form-item :label="$t('auditSetting.reviewedBy') + ':'" prop="handler">
      <OptOrgCommon
        v-model="form.handler"
        :title="$t('aicosCommon.pleaseSelect') + $t('auditSetting.reviewedBy')"
        :tabs="['user']"
      ></OptOrgCommon>
    </el-form-item>
    <el-form-item :label="$t('auditSetting.messageReminder') + ':'">
      <el-switch v-model="form.sendMessage" @change="change"></el-switch>
    </el-form-item>
    <el-form-item
      :label="$t('auditSetting.reminderMethod') + ':'"
      v-if="form.sendMessage"
      prop="messageList"
    >
      <MessageList
        style="margin-bottom: 18px"
        :messageTypeList="messageTypeList"
        :selectedList="curSelectedList"
        :curSelectedList.sync="form.messageList"
      />
    </el-form-item>
  </el-form>
</template>
<script>
import OptOrgCommon from "@/views/optOrg/OptOrgCommon";
import { deepClone } from "@/util/util";
import MessageList from "@/views/system/flow/desinger/components/common/messageList";
export default {
  components: {
    OptOrgCommon,
    MessageList,
  },
  props: {
    rowData: {
      type: Object,
      default: () => {},
    },
  },
  data() {
    return {
      messageTypeList: [
        {
          name: this.$t("auditSetting.toDoList"),
          type: "todo",
          disabled: true,
          message: "",
          email: "",
          internal: "",
          qyWeixin: "",
          smart: "",
          custom: "",
        },
      ],
      curSelectedList: [
        {
          name: this.$t("auditSetting.toDoList"),
          type: "todo",
          disabled: true,
          message: "",
          email: "",
          internal: "",
          qyWeixin: "",
          smart: "",
        },
      ],
      form: deepClone(this.rowData),
      rules: {
        label: [
          {
            required: true,
            message:
              this.$t("aicosCommon.pleaseInput") +
              this.$t("auditSetting.nodeName"),
            trigger: "blur",
          },
        ],
        handler: [
          {
            required: true,
            message:
              this.$t("aicosCommon.pleaseSelect") +
              this.$t("auditSetting.reviewedBy"),
            trigger: "blur",
          },
        ],
        messageList: [
          {
            required: true,
            message:
              this.$t("aicosCommon.pleaseSelect") +
              this.$t("auditSetting.reminderMethod"),
            trigger: "blur",
          },
        ],
      },
    };
  },

  mounted() {
    if (!this.validatenull(this.rowData.messageList)) {
      this.curSelectedList = deepClone(this.rowData.messageList);
    }
  },

  methods: {
    onSubmit() {
      let flag = false;
      this.$refs.form.validate((valid) => {
        if (valid) {
          flag = true;
        }
      });
      if (
        !this.validatenull(this.form.handler) &&
        this.form.handler.user.length === 0
      ) {
        if (document.getElementsByClassName("el-message").length === 0) {
          this.$message.warning(
            this.$t("aicosCommon.pleaseSelect") +
              this.$t("auditSetting.reviewedBy")
          );
        }
        return false;
      }
      const item = this.form.messageList[0];
      if (
        this.form.sendMessage &&
        this.validatenull(item.custom) &&
        this.validatenull(item.email) &&
        this.validatenull(item.internal) &&
        this.validatenull(item.message) &&
        this.validatenull(item.qyWeixin)
      ) {
        if (document.getElementsByClassName("el-message").length === 0) {
          this.$message.warning(this.$t("auditSetting.messageRule"));
        }
        return false;
      }
      if (flag) {
        return this.form;
      } else {
        return false;
      }
    },
  },
};
</script>
