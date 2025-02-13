<template>
  <div class="response-confidence-wrap">
    <div class="confidence-slider">
      <el-slider
        class="customer-slider"
        v-model="value"
        :marks="marks">
      </el-slider>
    </div>
    <ul class="confidence-tips">
      <li>
        <i class="circle default">●</i>
        <p>置信度在此范围内，系统将判定为【未知问题】</p>
      </li>
      <li>
        <i class="circle blue">●</i>
        <p>知识任务的确定范围。系统将判定为【高置信度问题】。系统将匹配到的知识直接呈现给用户</p>
      </li>
    </ul>
    <div class="save-confidence">
      <el-button size="small" type="primary" @click="save">保存</el-button>
    </div>
  </div>
</template>

<script>
import {mapGetters} from 'vuex';
import {saveBasicAndAnswerUrl} from '@/api/kwRobot/kwRobotInstance/robotInstanceSetting/advaceStrategy/answerStrategy.js';
export default {
  props: {
    editData: {
      type: Number,
      default: 30
    }
  },
  data() {
    var value = this.editData;
    return {
      strategyId: '',
      value: value,
      marks: {
        0: '0%',
        100: '100%'
      }
    }
  },
  components: {
    //someComponent
  },
  computed: {
    // 计算属性
    ...mapGetters(['botObj', 'instanceObj'])
  },
  methods: {
    save () {
      var postData = {
        trusted: this.value,
        strategyId: this.strategyId
      }
      saveBasicAndAnswerUrl(postData).then((res) => {
        res = res.data;
        if (res.code == 200) {
          this.$message({
            type: "success",
            message: '保存成功'
          });
        }
      });
    }
  },
  created() {
    this.strategyId = this.instanceObj.id;
  },
  mounted() {

  },
  destroyed() {

  }
}
</script>

<style scoped lang="scss">
  /deep/ .customer-slider {
    .el-slider__runway {
      background-color: #409EFF;
    }

    .el-slider__bar {
      background-color: #E4E7ED;
    }
  }

  .response-confidence-wrap {
    width: 600px;
    ul, li, p {
      margin: 0;
      padding: 0;
    }

    .confidence-tips {
      margin-top: 25px;
      list-style: none;

      li {
        padding-left: 20px;
        position: relative;
        color: #CCCCCC;

        .circle {
          font-size: 18px;
          position: absolute;
          left: 0;
          top: 0;
          line-height: 20px;
        }
        .circle.default {
          color: #E4E7ED;
        }
        .circle.blue {
          color: #409EFF;
        }
      }
    }

    .save-confidence {
      margin-top: 20px;
      text-align: center;
    }
  }
</style>
