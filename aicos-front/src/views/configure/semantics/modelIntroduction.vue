<template>
  <div>
    <el-row>
      <el-col :span="24">
        <div class="version">
          <div class="layout-flex">
            <div class="title">工单分类模型</div>
            <div class="text">版本：2023-12-19</div>
          </div>
          <div class="layout-flex">
            <el-button size="small" type="success" @click.stop="formSave">更新模型</el-button>
            <el-button size="small" type="primary" @click.stop="formClose">接口文档</el-button>
          </div>
        </div>
      </el-col>
      <el-col :span="24">
        <p class="describe">
          文本分类是一种利用人工指的技术将文本内容自动分为不类别的功，它司以帮用产快道准确地对大量文本进行分，处理败率，文本分美功能通第包居先进的分类其法、大成模致服处理能力。自义分类体系、情愿分析和语义理解等功，它可以应用于新闻媒休、电子商务、金融、医疗等各个行业，帮助用户更好地理解和处理文本内容，提高工作效率。
        </p>
      </el-col>
      <el-col :span="12">
        <div class="setbox">
          <div class="set">参数设置</div>
          <!-- <div class="avue-form-bor">
            <avue-form :option="option">
              <template slot="threshold">
                <el-input-number v-model="form.threshold" :min="0" :max="100" :step="1"></el-input-number>
              </template>
            </avue-form>
          </div> -->
          <el-form ref="form" :model="form" label-width="100px" style="margin: 20px;">
            <el-form-item label="阈值设置：">
              <div style="display: flex;">
                <el-input-number v-model="form.threshold" :precision="0" :step="0.1" :max="1"
                  size="small" style="flex-grow: 1;"></el-input-number><span style="margin-left: 20px;">以上</span><span>输入1与0.01之间，值越高，准确率越高</span>
              </div>
            </el-form-item>
            <el-form-item label="末级分类：">
              <el-select v-model="value" placeholder="请选择" size="small" style="width: 100%;">
                <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value">
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="onSubmit">立即创建</el-button>
              <el-button>取消</el-button>
            </el-form-item>
          </el-form>
        </div>
      </el-col>
      <el-col :span="12">

      </el-col>
    </el-row>
  </div>
</template>

<script>
export default {
  name: "modelIntroduction",
  components: {
  },
  data() {
    return {
      form: {},
      option: {
        submitBtn: false,
        emptyBtn: false,

        column: [
          {
            label: '阈值设置',
            prop: 'threshold',
            span: 24,
          },

        ]
      },
      options: [{
        value: '选项1',
        label: '黄金糕'
      }, {
        value: '选项2',
        label: '双皮奶'
      }, {
        value: '选项3',
        label: '蚵仔煎'
      }, {
        value: '选项4',
        label: '龙须面'
      }, {
        value: '选项5',
        label: '北京烤鸭'
      }],
    };
  },

  watch: {

  },
  computed: {

  },
  methods: {

  },
  mounted() {
  }
};
</script>

<style scope lang="scss">
.version {
  display: flex;
  flex-wrap: nowrap;
  justify-content: space-between;
  // align-content: space-between;
}

.layout-flex {
  display: flex;
  align-items: flex-end
}

.title {
  font-size: 18px;
  color: #303133;
  margin-right: 20px;
}

.text {
  margin-left: 20px;
  font-size: 14px;
  color: #909399;
}

.describe {
  font-size: 14px;
  color: #606266;
  line-height: 24px;
}

.setbox {
  padding: 20px 0;
  background-color: #f1f6ff;
  border-radius: 6px;
  // min-width: 450px;
  flex-direction: column;
  width: 100%;

  .set {
    margin-left: 20px;
  }
}

.avue-form-bor {
  padding: 20px 0;
  background: white;
}
</style>
