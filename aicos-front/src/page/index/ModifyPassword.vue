<template>
  <el-dialog
    title="修改密码"
    append-to-body
    :close-on-click-modal="false"
    :visible.sync="dialogVisible"
    width="480px"
    @close="hide"
  >
    <avue-form
      ref="form"
      :option="option"
      v-model="form"
      @submit="handleSubmit"
    >
      <template slot-scope="{ disabled, size }" slot="newPassword">
        <div>
          <el-input
            :disabled="disabled"
            :size="size"
            v-model="form.newPassword"
            placeholder="请输入 高强度密码"
            @input="checkPWStrong"
            :type="newPsdtype"
          >
            <span slot="suffix" class="show_pwd" @click="showPwd">
              <icon
                class="el-icon-view"
                v-if="newPsdtype == 'password'"
                @click.stop="showPwd"
              />
              <icon class="el-icon-view" v-else />
            </span>
          </el-input>
          <div class="pwStrongW">
            <span
              class="line"
              :class="[strongLevel.includes('low') ? 'low' : '']"
            ></span>
            <span
              class="line"
              :class="[strongLevel.includes('middle') ? 'middle' : '']"
            ></span>
            <span
              class="line"
              :class="[strongLevel.includes('high') ? 'high' : '']"
            ></span>
            <span class="strongLevel" :class="'level_' + pwStrong">{{
              strongLevelText
            }}</span>
            <div class="warningtext">
              密码须由<span> 8-18位 </span> 数字、大写、小写、英文特殊符号<span>
                4种 </span
              >组成
            </div>
          </div>
        </div>
      </template>
      <template slot-scope="{ error }" slot="newPasswordError">
        <div class="el-form-item__error">{{ error }}</div>
      </template>
    </avue-form>
    <template #footer>
      <el-button
        size="small"
        type="primary"
        :loading="submitting"
        @click="handleOk"
        >确定</el-button
      >
      <el-button size="small" @click="handleCancel">取消</el-button>
    </template>
  </el-dialog>
</template>

<script>
import { getRules } from "@/util/regx";
import { createEqual } from "@/util/regx";
import { updatePassword } from "@/api/system/user";
import crypto from "@/util/crypto";
import { encryptSM2 } from "@/util/cryptosm";
import { mapGetters, mapState } from "vuex";

import { getStore } from "@/util/store";
// import { JSEncrypt } from 'jsencrypt';
//import { Base64 } from 'js-base64';

export default {
  name: "ModifyPassword",
  data() {
    const validatePass2 = createEqual(
      this,
      "form.newPassword",
      "两次输入密码不一致!"
    );

    const checkNewPW = (rule, value, callback) => {
      if (this.pwStrong < 4) {
        callback(new Error("密码强度太低"));
      } else {
        callback();
      }
    };
    return {
      strongLevel: [],
      newPsdtype: "password",
      //newPsdtype:'',
      pwStrong: 0,
      strongLevelText: " ",

      form: {},
      dialogVisible: false,
      option: {
        menuBtn: false,
        column: [
          {
            label: "原密码",
            span: 24,
            row: true,
            type: "password",
            prop: "oldPassword",
            disabled: false,
            rules: [
              {
                required: true,
                message: "请输入原密码",
                trigger: "blur",
              },
            ],
          },
          {
            label: "新密码",
            span: 24,
            row: true,
            type: "password",
            prop: "newPassword",
            disabled: false,
            special: true,
            rules: [
              {
                required: true,
                message: "请输入新密码",
                trigger: "blur",
              },
              {
                min: 8,
                message: "密码至少8位",
                trigger: "blur",
              },
              {
                max: 18,
                message: "密码最多18位",
                trigger: "blur",
              },
              ...getRules(["numCharSpecial"]),
              {
                validator: checkNewPW,
                trigger: "blur",
              },
            ],
          },
          {
            label: "确认密码",
            span: 24,
            row: true,
            type: "password",
            prop: "newPassword1",
            disabled: false,
            rules: [
              {
                required: true,
                message: "请确认密码",
                trigger: "blur",
              },
              validatePass2
            ],
          },
        ],
      },
      submitting: false,
    };
  },
  computed: {
    ...mapGetters(["userInfo"]),
    ...mapState({
      modifyPwd: (state) => state.user.modifyPwd,
    }),
  },
  watch: {
    modifyPwd: {
      handler(newVal) {
        if (newVal) {
          this.show();
        } else {
          if (this.dialogVisible) {
            this.hide();
          }
        }
      },
      immediate: true,
    },
  },
  methods: {
    show() {
      this.dialogVisible = true;
    },
    hide() {
      this.dialogVisible = false;
      if (this.modifyPwd) {
        this.$store.commit("SET_MODIFYPWD", false);
      }
      this.strongLevel = [];
      this.newPsdtype = "password";
      this.pwStrong = 0;
      this.strongLevelText = "";

      this.$refs.form.resetForm();
    },
    handleSubmit(form, done) {
      this.submitting = true;
      // 获取用户安全配置参数
      let configurationParams = getStore({ name: "frontParam" }) || "";
      let isEncryption = false,
        encryptionType = "";
      if (configurationParams) {
        // 是否开启加密 on 开启 off 不开启
        if (configurationParams.enableUserPasswordEncryption === "on") {
          isEncryption = true;
        }
        // 加密方式
        encryptionType = configurationParams.userPasswordType;
      }
      let oldPW = this.form.oldPassword,
        newPW = this.form.newPassword;
      // 判断是否开启加密
      if (isEncryption) {
        // 非国密
        if (encryptionType === "nsm") {
          oldPW = crypto.RSAEncrypted(this.form.oldPassword);
          newPW = crypto.RSAEncrypted(this.form.newPassword);
        }
        // sm2加密
        if (encryptionType === "sm") {
          oldPW = encryptSM2(this.form.oldPassword);
          newPW = encryptSM2(this.form.newPassword);
        }
      }
      updatePassword(this.userInfo.account, oldPW, newPW).then(
        (res) => {
          if (res.data.success) {
            this.$message({
              type: "success",
              message: "修改密码成功!",
            });
            this.hide();
          } else {
            this.$message({
              type: "error",
              message: res.data.msg,
            });
          }
          done();
          this.submitting = false;
        },
        (error) => {
          window.console.log(error);
          done();
          this.submitting = false;
        }
      );
    },
    handleOk() {
      this.$refs.form.submit();
    },
    handleCancel() {
      this.hide();
    },
    // 校验密码
    checkPassword(value) {
      this.strongLevelText = "";
      this.$refs.form.validateField("newPassword");

      this.strongLevel = [];

      const REG_NUMBER = /\d/;
      const REG_UPPERCASE = /[A-Z]/;
      const REG_LOWERCASE = /[a-z]/;
      // eslint-disable-next-line no-useless-escape
      const REG_SYMBOL = /[~!@#$%^&*()_+|<>,.?:"{}|,.\/;'\\[\]·~！@#￥%]/;

      let hasNum = 0;
      let hasUpp = 0;
      let hasLow = 0;
      let hasBol = 0;
      let pwStrong = 0;

      if (REG_NUMBER.test(value)) {
        hasNum = 1;
      }
      if (REG_UPPERCASE.test(value)) {
        hasUpp = 1;
      }
      if (REG_LOWERCASE.test(value)) {
        hasLow = 1;
      }
      if (REG_SYMBOL.test(value)) {
        hasBol = 1;
      }
      pwStrong = hasNum + hasUpp + hasLow + hasBol;
      this.pwStrong = pwStrong;
      //console.log(pwStrong);

      if (pwStrong < 3) {
        this.strongLevelText = "弱";
        this.strongLevel.push("low");
      } else if (pwStrong == 3) {
        this.strongLevelText = "中";
        this.strongLevel.push("low");
        this.strongLevel.push("middle");
      } else if (pwStrong > 3) {
        this.strongLevelText = "强";
        this.strongLevel.push("low");
        this.strongLevel.push("middle");
        this.strongLevel.push("high");
      }
    },
    checkPWStrong(val) {
      //console.log(val);
      this.checkPassword(val);
    },
    showPwd() {
      if (this.newPsdtype === "password") {
        this.newPsdtype = "";
      } else {
        this.newPsdtype = "password";
      }
    },

    // /*RSA加密*/
    // RSAEncrypted(data) {
    //   const publicKey = 'MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQCYeEL/rpGmbQNmG/+QDpsr231PPYS7ZqUTtIax/tNKI7DhSG9OFbU7tPamXDooNC58uJ3jQbusV/9kSkuKoas9U9sN6UXc71uaC8T+PRzhMGkU0m9UWi+nsOQoKZjrFIla9wDeJPFW0Lq8OAPUHNMBVqjuOZ2fi3kNpMx5LxwfJQIDAQAB';

    //   let encryptor = new JSEncrypt();

    //   encryptor.setPublicKey(publicKey);

    //   return encryptor.encrypt(data);
    // },
  },
};
</script>

<style scoped lang="scss">
.pwStrongW {
  .psdText {
    font-size: 14px;
    margin-right: 10px;
    display: none;
  }
  .line {
    display: inline-block;
    width: 48px;
    height: 4px;
    background-color: #c0c4cc;
    border-radius: 3px;
    margin-right: 8px;
    &.low {
      background-color: #f56c6c;
    }
    &.middle {
      background-color: #e6a23c;
    }
    &.high {
      background-color: #67c23a;
    }
  }
  .strongLevel {
    margin: 0 16px 0 8px;
    font-size: 12px;
    &.level_0,
    &.level_1,
    &.level_2 {
      color: #f56c6c;
    }
    &.level_3 {
      color: #e6a23c;
    }
    &.level_4 {
      color: #67c23a;
    }
  }
  .warningtext {
    color: #5a5a5a;
    font-size: 12px;
    margin-top: 5px;
    margin-bottom: 5px;
    line-height: 1;
    span {
      color: #f56c6c;
      font-weight: 700;
    }
  }
}
</style>
