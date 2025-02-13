<template>
  <div>
    <el-form
      ref="form"
      :model="form"
      label-width="120px"
      class="paramClass"
      size="small"
      :rules="rules"
    >
      <el-form-item label="平均声压级" prop="SPL_MEAN_THRESHOLD">
        <el-input-number
          v-model="form.SPL_MEAN_THRESHOLD"
          :min="0"
          :max="184.9"
          :precision="1"
          :step="0.1"
        ></el-input-number>
        <span style="margin-left: 20px; color: #7e7e7e"
          >(可调整范围0.0~184.9)</span
        >
      </el-form-item>
      <el-form-item label="最大声压级" prop="SPL_MAX_THRESHOLD">
        <el-input-number
          v-model="form.SPL_MAX_THRESHOLD"
          :min="0"
          :max="184.9"
          :precision="1"
          :step="0.1"
        ></el-input-number>
        <span style="margin-left: 20px; color: #7e7e7e"
          >(可调整范围0.0~184.9)</span
        >
      </el-form-item>
      <el-form-item label="语速" prop="SPEECH_SPEED_MIN">
        <el-input-number
          v-model="form.SPEECH_SPEED_MIN"
          :min="0"
          :max="9.9"
          :precision="1"
          :step="0.1"
        ></el-input-number>
        <span style="margin: 0 15px">--</span>
        <el-input-number
          v-model="form.SPEECH_SPEED_MAX"
          :min="0"
          :max="10"
          :precision="1"
          :step="0.1"
        ></el-input-number>
        <span style="margin-left: 20px; color: #7e7e7e"
          >(可调整范围0.0~10.0)</span
        >
      </el-form-item>
      <el-form-item label="最小长句值" prop="LONG_SENTENCE_LEN_MIN">
        <el-input-number
          v-model="form.LONG_SENTENCE_LEN_MIN"
          :min="1"
          :max="20"
          :precision="0"
          :step="1"
        ></el-input-number>
        <span style="margin-left: 20px; color: #7e7e7e">(可调整范围1~20)</span>
      </el-form-item>
      <el-form-item label="最小长句语速" prop="LONG_SENTENCE_SPEECH_SPEED_MIN">
        <el-input-number
          v-model="form.LONG_SENTENCE_SPEECH_SPEED_MIN"
          :min="0"
          :max="9.9"
          :precision="1"
          :step="0.1"
        ></el-input-number>
        <span style="margin-left: 20px; color: #7e7e7e"
          >(可调整范围0.0~9.9)</span
        >
      </el-form-item>
      <el-form-item style="text-align: center">
        <el-button
          type="primary"
          @click="defaultClick"
          size="small"
          style="background-color: #a3cf52; border-color: #a3cf52"
          >恢复默认值</el-button
        >
      </el-form-item>
      <el-form-item style="text-align: right">
        <el-button size="small" @click="cancel">取消</el-button>
        <el-button type="primary" @click="save" size="small">确认</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>
<script>
import {
  getAiAbilityConfig,
  saveAiAbilityConfig,
  resetAiAbilityConfig,
} from "@/api/configure/application";
import { mapGetters } from "vuex";
export default {
  name: "AicosFrontParamconfig",

  data() {
    return {
      form: {},
      rules: {
        SPL_MEAN_THRESHOLD: [
          { required: true, message: "请输入平均声压级", trigger: "blur" },
        ],
        SPL_MAX_THRESHOLD: [
          { required: true, message: "请输入最大声压级", trigger: "blur" },
        ],
        SPEECH_SPEED_MIN: [
          { required: true, message: "请输入语速最小值", trigger: "blur" },
        ],
        SPEECH_SPEED_MAX: [
          { required: true, message: "请输入语速最大值", trigger: "blur" },
        ],
        LONG_SENTENCE_LEN_MIN: [
          { required: true, message: "请输入最小长句值", trigger: "blur" },
        ],
        LONG_SENTENCE_SPEECH_SPEED_MIN: [
          { required: true, message: "请输入最小长句语速", trigger: "blur" },
        ],
      },
    };
  },
  computed: {
    ...mapGetters(["userInfo"]),
  },
  mounted() {
    getAiAbilityConfig({ appId: this.$store.state.user.currentTenantId }).then((res) => {
      this.form = { ...res.data.data.asrConstant };
    });
  },

  methods: {
    save() {
      if (
        this.form.SPEECH_SPEED_MAX === "" ||
        this.form.SPEECH_SPEED_MAX === null ||
        this.form.SPEECH_SPEED_MAX === undefined
      ) {
        this.$message.error("语速最大值不能为空");
        return;
      }
      if (this.form.SPEECH_SPEED_MIN >= this.form.SPEECH_SPEED_MAX) {
        this.$message.error("最小语速值需小于最大语速值");
        return;
      }
      saveAiAbilityConfig({
        asrConstant: this.form,
        appId: this.$store.state.user.currentTenantId,
      }).then((res) => {
        if (res.data.code == 200) {
          this.$message.success("保存成功");
          this.$emit("cancel");
        }
      });
    },
    defaultClick() {
      resetAiAbilityConfig({ appId: this.$store.state.user.currentTenantId }).then((res) => {
        if (res.data.code == 200) {
          this.$message.success("恢复默认值成功");
          getAiAbilityConfig({ appId: this.$store.state.user.currentTenantId }).then((res) => {
            this.form = { ...res.data.data.asrConstant };
          });
        }
      });
    },
    cancel() {
      this.$emit("cancel");
    },
  },
};
</script>
<style lang="scss" scoped>
.paramClass {
  .sliderModule {
    display: flex;
    align-items: center;
    .el-slider {
      width: 80%;
      margin: 0 10px;
    }
  }
}
</style>
