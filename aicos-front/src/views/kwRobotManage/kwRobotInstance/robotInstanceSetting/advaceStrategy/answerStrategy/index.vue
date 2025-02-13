<template>
  <div>
    <el-tabs v-model="activeName" @tab-click="handleClick">
      <el-tab-pane :label="$t('kwRobotManage.basicRules')" name="first">
        <Basics :fatherData="fatherData" @fatherEvent="btnclick" />
      </el-tab-pane>
      <el-tab-pane :label="$t('kwRobotManage.highRules')" name="second">
        <Advanced :fatherData="fatherData" @fatherEvent="btnclick" />
      </el-tab-pane>
    </el-tabs>
  </div>
</template>
<script>
import Basics from "./basics";
import Advanced from "./advanced";
export default {
  props: {
    fatherData: {
      type: Object,
      default: () => { },
    },
  },
  components: {
    Basics,
    Advanced,
  },
  data () {
    return {
      activeName: "first",
    };
  },

  mounted () { },

  methods: {
    btnclick (data) {
      this.$emit("fatherEvent", data);
    },
  },
};
</script>
<style lang="scss" scoped></style>
