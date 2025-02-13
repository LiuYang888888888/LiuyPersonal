<template>
  <QSGDrawer :title="dataInTitle" :fullscreen="false" :size="600" append-to-body
    :visible.sync="usageScenarioDiologVisible" :wrapperClosable="false">
    <el-tabs v-model="activeName" @tab-click="handleClick">
      <el-tab-pane v-for="v of senceList" :label="v.title" :value="v.name" :key="v.title">
        <div>
          <div class="articol">{{ v.content }}</div>
          <el-row :gutter="20" style="margin-left: 10px;margin-right: 10px;margin-top: 20px;">
            <el-col :span="12" v-for="item of v.imgList" :key="item" style="margin-bottom: 10px;">
              <div class="senceImg-box"><img class="senceImg" :src="item" /></div>
            </el-col>
          </el-row>
        </div>
      </el-tab-pane>
    </el-tabs>
  </QSGDrawer>
</template>
<script>
import QSGDrawer from "@/components/QSGDrawer/index";
export default {
  name: "usageScenarioDiolog",
  components: {
    QSGDrawer,
  },
  props: {
    senceList: {
      type: Array,
      default: () => {
        return []
      }
    }
  },
  // watch: {
  //   senceList(list) {
  //     debugger
  //     console.log(list)
  //   }
  // },
  data() {
    // const self = this
    return {
      dataInTitle: '使用场景',
      usageScenarioDiologVisible: false,
    };
  },
  computed: {},
  created() {

  },
  methods: {
    handleSubmit() {
      this.$refs.form.submit()
    },
    init() {
      this.usageScenarioDiologVisible = true
      console.log(this.senceList)
    }
  },
};
</script>

<style lang="scss" scoped>
/deep/.avue-dialog .el-drawer__body {
  padding-top: 0px;
}

.articol {
  margin: 0 20px;
  margin-top: 10px;
  font-family: SourceHanSansCN-Regular;
  font-size: 14px;
  font-weight: normal;
  font-stretch: normal;
  line-height: 28px;
  letter-spacing: 0px;
  color: #565863;
}

.senceImg-box {
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 10px;

  .senceImg {
    height: 160px;
    max-width: 100%;
    border-radius: 10px;
  }
}
</style>
