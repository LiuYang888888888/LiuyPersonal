<template>
  <div>
    <avue-form
      :option="option"
      ref="form"
      v-model="form"
      :upload-preview="uploadPreview"
      @submit="submit"
    >
      <template slot="remindPeopleData">
        <OptOrgCommon
          v-model="form.remindPeopleData"
          :title="$t('kwRobotStudy.reminderPersonnel')"
          :tabs="['user']"
        >
        </OptOrgCommon>
      </template>
      <template slot="reminderMethodData">
        <MessageList
          style="margin-bottom: 18px"
          :messageTypeList="messageTypeList"
          :selectedList="curSelectedList"
          :curSelectedList.sync="form.reminderMethodData"
        />
      </template>
    </avue-form>
  </div>
</template>
<script>
import OptOrgCommon from "@/views/optOrg/OptOrgCommon";
import MessageList from "@/views/system/flow/desinger/components/common/messageList";
import { saveOrUpdate, detail } from "@/api/kwRobot/kwRobotStudy/outquestion";
import { mapGetters } from "vuex";

export default {
  components: {
    OptOrgCommon,
    MessageList,
  },
  props: {
    type: {
      type: String,
      default: "",
    },
  },
  data() {
    return {
      messageTypeList: [
        {
          name: this.$t("kwRobotStudy.reminderMethod"),
          type: "overtime",
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
          name: this.$t("kwRobotStudy.reminderMethod"),
          type: "overtime",
          disabled: true,
          message: "",
          email: "",
          internal: "",
          qyWeixin: "",
          smart: "",
        },
      ],
      form: {
        status: 0,
        threshold: "",
        remindPeople: "",
        reminderMethod: "",
        remindPeopleData: "",
        reminderMethodData: [],
      },
      option: {
        submitBtn: false,
        emptyBtn: false,
        labelWidth: 120,
        column: [
          {
            label: this.$t("kwRobotStudy.isItEnabled"),
            prop: "status",
            type: "switch",
            span: 24,
            dicData: [
              {
                label: this.$t("kwRobotStudy.close"),
                value: 0,
              },
              {
                label: this.$t("kwRobotStudy.open"),
                value: 1,
              },
            ],
            change: ({ value }) => {
              let threshold = this.findObject(this.option.column, "threshold"),
                remindPeopleData = this.findObject(
                  this.option.column,
                  "remindPeopleData"
                ),
                reminderMethodData = this.findObject(
                  this.option.column,
                  "reminderMethodData"
                );
              if (value === 0) {
                threshold.display = false;
                remindPeopleData.display = false;
                reminderMethodData.display = false;
                // this.form.threshold = "";
                // this.form.remindPeople = "";
                // this.form.reminderMethod = "";
                // this.form.remindPeopleData = "";
                // this.form.reminderMethodData = "";
              } else {
                threshold.display = true;
                remindPeopleData.display = true;
                reminderMethodData.display = true;
              }
            },
          },
          {
            label: this.$t("kwRobotStudy.setThreshold"),
            prop: "threshold",
            span: 24,
            display: false,
            rules: [
              {
                required: true,
                message: this.$t("kwRobotStudy.inputThreshold"),
                trigger: "blur",
              },
              {
                pattern: /^((?!0)\d{1,2}|100)$/,
                message: this.$t("kwRobotStudy.inputInteger"),
              },
            ],
          },
          {
            label: this.$t("kwRobotStudy.reminderPersonnel"),
            prop: "remindPeopleData",
            span: 24,
            display: false,
            rules: [
              {
                required: true,
                message: this.$t("kwRobotStudy.selectPerson"),
                trigger: "blur",
              },
            ],
          },
          {
            label: this.$t("kwRobotStudy.reminderMethod"),
            display: false,
            prop: "reminderMethodData",
            type: "select",
            span: 24,
            rules: [
              {
                required: true,
                message:
                  this.$t("aicosCommon.pleaseSelect") +
                  this.$t("kwRobotStudy.reminderMethod"),
                trigger: "blur",
              },
            ],
          },
        ],
      },
    };
  },

  computed: {
    ...mapGetters(["language"]),
  },

  watch: {
    language: {
      handler() {
        this.option.labelPosition = this.language != "zh" ? "top" : "right";
      },
      immediate: true,
    },
  },

  mounted() {
    detail(this.type).then((res) => {
      if (res.data.success) {
        let data = res.data.data;
        this.form = { ...this.form, ...data };
        if (data.status === null) {
          this.form.status = 0;
        }
        if (this.validatenull(this.form.reminderMethodData)) {
          this.form.reminderMethodData = [];
        } else {
          this.form.reminderMethodData = JSON.parse(
            this.form.reminderMethodData
          );
          if (!this.validatenull(this.form.reminderMethodData)) {
            this.curSelectedList = this.form.reminderMethodData;
          }
        }
        if (this.validatenull(this.form.remindPeopleData)) {
          this.form.remindPeopleData = { user: [] };
        } else {
          this.form.remindPeopleData = JSON.parse(this.form.remindPeopleData);
        }
      }
    });
  },

  methods: {
    submit() {
      this.$refs.form.validate((valid, done, msg) => {
        if (valid) {
          if (
            this.form.status === 1 &&
            this.form.remindPeopleData.user.length === 0
          ) {
            this.$message.error(this.$t("kwRobotStudy.selectPerson"));
            done();
            return;
          }
          const params = { ...this.form },
            item = this.form.reminderMethodData[0];
          if (
            this.form.status === 1 &&
            this.validatenull(item.custom) &&
            this.validatenull(item.email) &&
            this.validatenull(item.internal) &&
            this.validatenull(item.message) &&
            this.validatenull(item.qyWeixin)
          ) {
            if (document.getElementsByClassName("el-message").length === 0) {
              this.$message.warning(this.$t("auditSetting.messageRule"));
            }
            done();
            return;
          }
          let reminderMethod = "";
          if (!this.validatenull(this.form.reminderMethodData)) {
            reminderMethod = {
              shortMessageTemplate: this.form.reminderMethodData[0].message,
              mailTemplate: this.form.reminderMethodData[0].email,
              messageTemplate: this.form.reminderMethodData[0].internal,
              qyWeixinTemplate: this.form.reminderMethodData[0].qyWeixin,
              customTemplate: this.form.reminderMethodData[0].custom,
            };
          }

          params.type = this.type;
          params.status = this.form.status;
          params.threshold = Number(this.form.threshold);
          params.remindPeople = this.form.remindPeopleData.user
            .map((item) => item.account)
            .join(",");
          params.remindPeopleData = JSON.stringify(this.form.remindPeopleData);
          params.reminderMethod = !this.validatenull(reminderMethod)
            ? JSON.stringify(reminderMethod)
            : "";
          params.reminderMethodData = JSON.stringify(
            this.form.reminderMethodData
          );
          done();
          saveOrUpdate(params).then((res) => {
            if (res.data.success) {
              this.$message.success(this.$t("aicosCommon.saveSuccessTip"));
              this.$emit("refresh");
            }
          });
        } else {
          console.log(this.form);
          console.log(msg);
        }
      });
    },
  },
};
</script>
