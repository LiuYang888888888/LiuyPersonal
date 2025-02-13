<template>
  <basic-container style="padding: 0; background: #fff">
    <div v-if="isAllSettingType == 'allSetting'">
      <el-tabs v-model="activeName" @tab-click="handleClick">
        <el-tab-pane :label="$t('kwRobotManage.basicConfiguration')" name="first">
          <RobotBasicSetting @backInstance="backInstance" :cur="cur" />
        </el-tab-pane>
        <el-tab-pane :label="$t('kwRobotManage.advanced')" name="second">
          <AdvanceSetting @gotoStrategy="gotoStrategy" @backInstance="backInstance" :cur="cur" />
        </el-tab-pane>
      </el-tabs>
    </div>
    <div v-else-if="isAllSettingType == 'onlySetting'">
      <AdvaceStrategy @backSetting="backSetting" />
    </div>
  </basic-container>
</template>

<script>
import RobotBasicSetting from "./basicSetting";
import AdvanceSetting from "./advanceSetting";
import AdvaceStrategy from "./advaceStrategy/index";
export default {
  name: "",
  props: {
    cur: {
      type: Object,
      default: () => {
        return "";
      },
    },
  },
  data () {
    return {
      isAllSettingType: "allSetting",
      activeName: "first",
    };
  },
  components: {
    RobotBasicSetting,
    AdvanceSetting,
    AdvaceStrategy,
  },
  computed: {
    // 计算属性
  },
  methods: {
    gotoStrategy (res) {
      this.isAllSettingType = res;
    },
    //返回实例列表使用
    backInstance () {
      this.$emit("backInstanceList");
    },
    backSetting () {
      this.isAllSettingType = "allSetting";
      this.activeName = "second";
    },
  },
  created () { },
  mounted () { },
  destroyed () { },
};
</script>

<style scoped lang="scss">
/deep/ .el-scrollbar__view {
  background: #fff;
}
</style>
