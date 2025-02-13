<template>
  <el-form :model="ruleValidateForm" ref="ruleValidateForm" label-width="100px" class="demo-dynamic"
    :label-position="language != 'zh' ? 'top' : 'right'">
    <el-form-item prop="standardPhrase" :label="$t('kwRobotManage.standardValueName')" :rules="[
      { required: true, message: $t('aicosCommon.pleaseInput') + $t('kwRobotManage.standardValueName'), trigger: 'blur' },
    ]">
      <el-input v-model="ruleValidateForm.standardPhrase"></el-input>
    </el-form-item>
    <el-form-item v-for="(rule, index) in ruleValidateForm.originalValue"
      :label="index == 0 ? $t('kwRobotManage.originalValue') : ''" :key="rule.key"
      :prop="'originalValue.' + index + '.value'"
      :rules="[{ required: true, message: $t('kwRobotManage.originalValue'), trigger: 'blur' }]">
      <el-input v-model="rule.value" :placeholder="$t('kwRobotManage.enterKeyTips')"
        @keyup.enter.native="addByEnterKey(rule)" style="width: 80%; margin-right: 20px">
      </el-input>
      <el-button type="primary" v-if="index == '0'" @click="addDomain(rule)">{{ $t('kwRobotManage.increase')
      }}</el-button>
      <el-button v-else class="kwpolicy-del-buttons" @click.prevent="removeDomain(rule)">&nbsp;&nbsp;<i
          class="el-icon-delete"></i>&nbsp;&nbsp;</el-button>
    </el-form-item>
  </el-form>
</template>

<script>
import { mapGetters } from 'vuex'
// import { addOrUpdataIntentionalPolicy } from "@/api/kwRobot/kwRobotInstance/robotInstanceSetting/advaceStrategy/kwIntentionalPolicy";
export default {
  props: {
    strategyId: {
      type: String,
      default: "",
    },
    ruleId: {
      type: String,
      default: "",
    },
    ruleType: {
      type: String,
      default: "add",
    },
    ruleUpdataObj: {
      type: Object,
      default: () => {
        return {};
      },
    },
  },
  data () {
    return {
      ruleValidateForm: {
        originalValue: [
          {
            value: "",
          },
        ],
        standardPhrase: "",
      },
    };
  },
  computed: {
    // 计算属性
    ...mapGetters(['language']),
  },
  mounted () {
    if (this.ruleType == "edit") {
      this.ruleValidateForm.standardPhrase = this.ruleUpdataObj.standardPhrase;
      this.ruleValidateForm.originalValue = [];
      this.ruleUpdataObj.synonymousPhrases.forEach((item, index) => {
        this.ruleValidateForm.originalValue.push({
          value: item,
          index: index,
        });
      });
    }
  },
  methods: {
    removeDomain (item) {
      var index = this.ruleValidateForm.originalValue.indexOf(item);
      if (index !== -1) {
        this.ruleValidateForm.originalValue.splice(index, 1);
      }
    },
    addDomain () {
      var addInputShow = true;
      this.ruleValidateForm.originalValue.forEach((ele) => {
        if (ele.value == "") {
          addInputShow = false;
        }
      });
      if (addInputShow == true) {
        this.ruleValidateForm.originalValue.push({
          value: "",
          key: Date.now(),
        });
      }
    },
    addByEnterKey () {
      var addInputShow = true;
      this.ruleValidateForm.originalValue.forEach((ele) => {
        if (ele.value == "") {
          addInputShow = false;
        }
      });
      if (addInputShow == true) {
        this.ruleValidateForm.originalValue.push({
          value: "",
          key: Date.now(),
        });
      }
    },
    submit () {
      this.$refs.ruleValidateForm.validate(async (valid /*, done, msg*/) => {
        var synonymousPhrases = [];
        this.ruleValidateForm.originalValue.forEach((item) => {
          synonymousPhrases.push(item.value);
        });
        if (valid) {
          let obj = {
            standardPhrase: this.ruleValidateForm.standardPhrase,
            synonymousPhrases: synonymousPhrases,
            // strategyId: this.strategyId,
            id: this.ruleId,
            originalCount: synonymousPhrases.length,
          };
          this.$emit("addOrEditEmitEvent", obj);
          // addOrUpdataIntentionalPolicy(obj).then(() => {
          //   this.$message({
          //     type: "success",
          //     message: "保存成功!",
          //   });
          // });
        }
      });
    },
  },
};
</script>

<style lang="scss" scoped>
/deep/.kwpolicy-del-buttons {
  border: none !important;
  color: red !important;
}
</style>
>
