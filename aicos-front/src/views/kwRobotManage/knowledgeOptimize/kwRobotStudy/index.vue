<template>
  <HuilanBasic hasTab>
    <el-tabs v-model="activeName" @tab-click="handleClick">
      <el-tab-pane :label="$t('kwRobotStudy.unknownLearning')" name="first">
        <Unknown style="padding: 10px 30px 30px;" />
      </el-tab-pane>
      <el-tab-pane :label="$t('kwRobotStudy.stepQuestion')" name="second">
        <Outquestion style="padding: 10px 30px 30px;" />
      </el-tab-pane>
      <el-tab-pane :label="$t('kwRobotStudy.seatIssues')" name="third">
        <Seat style="padding: 10px 30px 30px;" />
      </el-tab-pane>
      <el-tab-pane :label="$t('kwRobotStudy.newWords')" name="fourth">
        <Newword style="padding: 10px 30px 30px;" />
      </el-tab-pane>
    </el-tabs>
  </HuilanBasic>
</template>
<script>
import Unknown from "./unknown/index";
import Outquestion from "./outquestion/index";
import Seat from "./seat";
import Newword from "./newword";
export default {
  components: {
    Unknown,
    Outquestion,
    Seat,
    Newword,
  },
  provide: {
    isRobotMenu: true,
  },
  data () {
    return {
      activeName: "first",
    };
  },

  mounted () { },

  methods: {},
};
</script>
