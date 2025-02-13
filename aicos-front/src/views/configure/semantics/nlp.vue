<template>
  <!-- <HuilanBasic> -->
  <div>
    <HuilanBasic hasTab v-if="switchPage === '1'">
      <template>
        <el-tabs v-model="activeName" @tab-click="handleClick">
          <el-tab-pane label="自然语言处理" name="second">
            <BaseNpl ref="baseAbility2" category1="nlp" v-if="activeName === 'second'"
              @baseNplTabMachine="baseNplTabMachine">
            </BaseNpl>
          </el-tab-pane>
          <el-tab-pane label="机器学习" name="first">
            <BaseNpl ref="baseAbility" category1="machine" v-if="activeName === 'first'"
              @baseNplTabMachine="baseNplTabMachine"></BaseNpl>
          </el-tab-pane>
          <el-tab-pane label="智能分类模型" name="third">
            <IntelligentClassification ref="intelligentClassification" v-if="activeName === 'third'"></IntelligentClassification>
          </el-tab-pane>
        </el-tabs>
      </template>
    </HuilanBasic>
    <div v-if="switchPage === '2'">
      <NaturalLanguageProcessing :rowData="rowData" @nplHandl="nplHandl" ref="naturalLanguageProcessing">
      </NaturalLanguageProcessing>
    </div>
    <div v-if="switchPage === '3'">
      <InterfaceDescription :rowData="rowData" @nplHandl="nplHandl"></InterfaceDescription>
    </div>
  </div>
  <!-- </HuilanBasic> -->
</template>

<script>
import BaseNpl from "./baseNpl.vue";
import NaturalLanguageProcessing from "@/views/aiCapacityBase/abilityExperience";
import InterfaceDescription from "@/views/interfaceDescription/index";
import IntelligentClassification from "./intelligentClassification.vue";
export default {
  name: "nlp",
  components: {
    BaseNpl,
    NaturalLanguageProcessing,
    InterfaceDescription,
    IntelligentClassification,
  },
  props: {},
  data() {
    return {
      activeName: "second",
      switchPage: "1",
      rowData: {},
    };
  },
  computed: {},
  created() { },
  mounted() { },
  methods: {
    handleClick(tab, event) {
      console.log(tab, event);
    },
    baseNplTabMachine(rowData, switchPage) {
      this.rowData = rowData;
      this.switchPage = switchPage;
      this.$nextTick(() => {
        this.$refs.naturalLanguageProcessing.applicationReset(rowData);
      })
    },
    nplHandl(rowData, switchPage) {
      this.rowData = rowData;
      this.switchPage = switchPage;
      if (switchPage === '2') {
        this.$nextTick(() => {
          this.$refs.naturalLanguageProcessing.switchPageTab(rowData)
        })
      }
    },
  },
};
</script>

<style scoped lang="scss">
/deep/ .el-card {
  // background: #EBEEF4;
}

/deep/ .huilan-basic {
  margin-left: -10px;
  margin-right: -10px;
}
/deep/ .el-drawer__body > div {
  padding-top: 0 !important;
}
/deep/ .el-tabs__header {
  margin-bottom: 0;
}
</style>
