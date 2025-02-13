<template>
  <HuilanBasic style="padding: 0">
    <el-tabs v-model="activeName" @tab-click="handleClick">
      <el-tab-pane :label="$t('kwIntentionManage.inference')" name="first">
        <RelationShipBetween
          v-if="botId != '' && activeName == 'first'"
          :botId="botId"
        />
      </el-tab-pane>
      <el-tab-pane :label="$t('kwIntentionManage.intentionList')" name="second">
        <IntentionsList
          v-if="botId != '' && activeName == 'second'"
          :botId="botId"
        />
      </el-tab-pane>
    </el-tabs>
  </HuilanBasic>
</template>

<script>
import RelationShipBetween from "./relationShipBetween"; //关系推理
import IntentionsList from "./intentionsList"; //意图列表
export default {
  inject: ["desktopWindow", "desktop"],
  data() {
    return {
      activeName: "first",
      botId: "",
    };
  },
  components: {
    RelationShipBetween,
    IntentionsList,
  },
  mounted() {
    // 获取机器人id
    // var query = {};
    // if (this.desktopWindow) {
    //   query = this.desktopWindow.data.query;
    //   this.botId = query.id;
    // }
    this.botId = this.$store.getters.botObj.id;
  },
};
</script>

<style></style>
