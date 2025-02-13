<template>
  <el-form :model="questioningForm" ref="questioningForm" :label-position="language != 'zh' ? 'top' : 'right'"
    label-width="100px" class="demo-dynamic">
    <el-form-item prop="content" :label="$t('kwRobotManage.questionName')" :rules="[
      {
        required: true,
        message:
          $t('aicosCommon.pleaseInput') + $t('kwRobotManage.questionName'),
        trigger: 'blur'
      }
    ]">
      <el-input v-model="questioningForm.content"></el-input>
    </el-form-item>
  </el-form>
</template>

<script>
import { mapGetters } from "vuex";
// import {saveOrUpdateScene} from  '@/api/kwRobot/kwRobotInstance/robotInstanceSetting/advaceStrategy/scenarioStrategy'
export default {
  props: {
    strategyId: {
      type: String,
      default: ""
    },
    questioningId: {
      type: String,
      default: ""
    },
    questioningType: {
      type: String,
      default: "add"
    },
    questionType: {
      type: String,
      default: ""
    },
    sceneType: {
      type: String,
      default: ""
    },
    questioningObj: {
      type: Object,
      default: () => {
        return {};
      }
    }
  },
  data () {
    return {
      questioningForm: {
        content: ""
      }
    };
  },
  computed: {
    // 计算属性
    ...mapGetters(["language"]),
  },
  mounted () {
    // console.log("this.questioningType", this.questioningType);
    if (this.questioningType == "edit") {
      this.questioningForm.content = this.questioningObj.content;
    }
  },
  methods: {
    submit () {
      this.$refs.questioningForm.validate(async (valid /*, done, msg*/) => {
        if (valid) {
          var obj = {
            content: this.questioningForm.content,
            id: this.questioningId
          };
          this.$emit("addOrEditEmitEvent", obj);
          // saveOrUpdateScene(obj).then(() => {
          //   this.$message({
          //     type: "success",
          //     message: "保存成功!",
          //   });
          //   this.$emit("addOrEditEmitEvent", false);
          // });
        }
      });
    }
  }
};
</script>

<style lang="scss" scoped>
/deep/.kwpolicy-del-buttons {
  border: none !important;
  color: red !important;
}
</style>

