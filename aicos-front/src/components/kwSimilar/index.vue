<template>
  <div class="kw-similar-container">
    <el-tabs v-model="activeName" @tab-click="handleClick">
      <el-tab-pane :label="$t('kwIntentionManage.faqName')" name="first">
        <Container ref="similarContainerRef" :faqData="faqData.faq"/>
      </el-tab-pane>
     <el-tab-pane :label="$t('kwIntentionManage.tableName')" name="second" v-if="isTab">
        <Tabcontainer ref="similarTabcontainerRef" :faqData="faqData.tab"/>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import Container from "./container";
import Tabcontainer from "./tabContainer";
export default {
  props: {
    faqData: {
      type: Array,
      default: () => {
        return [];
      }
    },
    isTab:{
      type:Boolean,
      default:false
    }
  },
  data() {
    return {
      activeName: "first",
    };
  },
  components: {
    Container,
    Tabcontainer
  },
  created() {
  },
};
</script>

<style scoped lang="scss">
  /deep/ .el-tabs__header {
    margin: 0;
    padding: 0 10px;
  }

</style>
