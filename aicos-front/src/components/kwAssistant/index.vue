<template>
  <el-form
    ref="setHealthFrom"
    :model="healthFrom"
    label-width="110px"
    :rules="rules"
    size="mini"
    class="file-addFile"
  >
    <el-form-item label="健康度自动检测">
      <el-switch
        v-model="healthFrom.healthValue"
        @change="healthChange()"
        active-value="1"
        inactive-value="0"
        active-color="#13ce66"
        inactive-color="#ccc"
      >
      </el-switch>
      <p class="desk-assistant-frequency">定义健康度自动检测频率</p>
      <el-radio-group v-model="healthFrom.frequencyRadion">
        <el-radio :label="1" :disabled="disabled">每天一次</el-radio>
        <el-radio :label="2" :disabled="disabled">每半天一次</el-radio>
        <el-radio :label="3" :disabled="disabled">每小时一次</el-radio>
      </el-radio-group>
    </el-form-item>
  </el-form>
</template>
<script>
import { addEditAssistantSet, getAssistantSet } from "@/api/kwAssistant/index";
export default {
  data() {
    return {
      healthFrom: {
        healthValue: "1",
        frequencyRadion: 1,
      },
      disabled: false,
      id: "",
      robotId: "",
    };
  },
  async mounted() {
    this.robotId = this.$store.getters.botObj.id;
    if (this.robotId != "") {
      const resData = await getAssistantSet(this.robotId);
      var setData = resData.data.data;
      if (setData.id != "" && setData.id != null) {
        this.id = setData.id;
        this.healthFrom.healthValue = setData.detectEnable + "";
        this.healthFrom.frequencyRadion = setData.detectFrequency;
      }
      if (setData.detectEnable == 0) {
        this.disabled = true;
      }
    }
  },
  methods: {
    healthChange() {
      if (this.healthFrom.healthValue == "0") {
        this.disabled = true;
      } else if (this.healthFrom.healthValue == "1") {
        this.disabled = false;
      }
    },
    submit() {
      var detectEnable = parseInt(this.healthFrom.healthValue);
      var detectFrequency = this.healthFrom.frequencyRadion;
      // let botObj = {
      //   id: "1234",
      // };
      // this.$store.commit("SET_BOTOBJ", botObj);
      // console.log('botObj',botObj)
      addEditAssistantSet(detectEnable, detectFrequency, this.id, this.robotId).then(
        () => {
          this.$message({
            type: "success",
            message: "保存成功!",
          });
          this.$emit("successSet", false);
        }
      );
    },
  },
};
</script>
<style lang="scss" scoped>
.desk-assistant-frequency {
  font-size: 16px;
  color: #999;
}
</style>
