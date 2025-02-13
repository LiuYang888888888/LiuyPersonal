<template>
  <basic-container>
    <avue-form
    class="kwpolicy-recall-formCard"
    :option="option"
    v-model="form">
    </avue-form>
    <div class="kwpolicy-recall-foot">
      <el-button size="small" @click="editTrafficRateDialog = false">{{$t("aicosCommon.cancelBtn")}}</el-button>
      <el-button size="small" type="primary" @click="saveAutoPolicy">{{$t("aicosCommon.saveBtn") }}</el-button>
    </div>
  </basic-container>
</template>

<script>
import {saveOrUpdateScene,getAutoStrategy} from  '@/api/kwRobot/kwRobotInstance/robotInstanceSetting/advaceStrategy/scenarioStrategy'
export default {
  props: {
    questionType: {
      type: String,
      default: '4'
    },
    sceneType: {
      type: String,
      default: '4'
    },
    strategyId: {
      type: String,
    },
  },
  data() {
    return {
      //全部
      form: {
        dynamic: [
          {
            scene: '连续发送相同问题',
            value: '',
            status: true,
          },
          {
            scene: '连续未知问题',
            value: '',
            status: true,
          },
          {
            scene: '访客连续负面情绪',
            value: '',
            status: true,
          },
          {
            scene: '评价答案为“踩”',
            value: '',
            status: true,
          },
        ]
      },
      option: {
        emptyBtn: false,
        saveBtn: false,
        column: [
          {
            label: '',
            prop: 'dynamic',
            type: 'dynamic',
            span:24,
            children: {
              align: 'left',
              headerAlign: 'left',
              rowAdd: false,
              border: false,
              index: false,
              column: [
                {
                  // width: 200,
                  label: '',
                  prop: "scene"
                },
                {
                  // width: 200,
                  label: '场景',
                  prop: "scene",
                  disabled: true
                },
                {
                  label: '值',
                  prop: "value",
                },
                {
                  width: 200,
                  label: '状态',
                  prop: "status",
                  type: 'switch',
                },
              ]
            }
          },
        ]
      },
      autoStrategyId: ''
    }
  },
  async mounted() {
    var obj = {
      questionType: this.questionType,
      sceneType: this.sceneType,
      strategyId: this.strategyId,
    }
    const autoStrategyData = await getAutoStrategy(obj);
    var autoStrategy = autoStrategyData.data.data.autoStrategyDtos;
    this.autoStrategyId = autoStrategyData.data.data.id;
    if(autoStrategy != '' && autoStrategy != null) {
      this.form.dynamic = [];
      var autoStatus;
      autoStrategy.forEach((item)=> {
        if(item.status == '1') {
          autoStatus = true;
        } else if(item.status == '2') {
          autoStatus = false;
        }
        this.form.dynamic.push({
          scene: item.scene,
          value: item.value,
          status: autoStatus,
        })
      })
    }
  },
  methods: {
    saveAutoPolicy() {
      var autoStrategyDtos = [];
      var status
      this.form.dynamic.forEach((item)=>{
        if(item.status == true) {
          status = 1
        } else if (item.status == false) {
          status = 2
        }
        autoStrategyDtos.push({
          scene: item.scene,
          value: item.value,
          status: status,
        })
      })
      var obj = {
        autoStrategyDtos: autoStrategyDtos,
        questionType: this.questionType,
        sceneType: this.sceneType,
        strategyId: this.strategyId,
        id: this.autoStrategyId
      }
      saveOrUpdateScene(obj).then(() => {
        this.$message({
          type: "success",
          message: "保存成功!",
        });
        this.$emit('addOrEditEmitEvent', false)
      });
    }
  }
}
</script>

<style lang="scss" scoped>
/deep/.avue-crud__menu {
  display: none;
}
/deep/tr>th:first-child {
  display: none !important;
}
/deep/.el-table__row>td:first-child {
  display: none !important;
}
/deep/.avue-form__menu--center {
  display: none !important;
}
.kwpolicy-recall-foot {
  width: 130px;
  margin: auto;
}
</style>
