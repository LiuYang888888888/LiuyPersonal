<template>
  <div class="examForm">
    <el-form
      v-loading="loading"
      label-position="top"
      :model="formData"
      ref="formRef"
      size="small"
      class="objectiveItem"
      :key="formKey"
      v-if="flag"
    >
      <el-form-item
        v-for="(column, index) in formOption.column"
        :key="'column' + index"
        class="examItem"
        :id="column.prop"
        v-if="
          !column.subHide &&
          column.typeExam != 'htmlExam' &&
          column.typeExam != 'textareaExam'
        "
      >
        <!-- showFun(column.prop, column.changeJson) && -->
        <div class="examItemLabel" slot="label" style="display: block">
          <div>
            <div
              class="examItemLabelIndex"
              style="width: 100%; font-weight: 700; color: #000"
              v-if="formOption.examShowLabelIndex"
              v-html="resetIndexFun(column.prop, formOption.column)"
            ></div>
            <div class="examItemLabelVal">
              <div style="display: flex; width: calc(100% - 225px)">
                <span>{{ topicType(column.typeExam) }}</span>
                <template v-if="column.typeExam === 'inputExam'">
                  <span>{{ inputLabelChange(column.label) }}</span>
                </template>
                <template v-else>
                  <div v-if="column.labelPlus">
                    <span v-html="column.label"></span>
                  </div>
                  <div v-else>
                    {{ column.label }}
                  </div>
                </template>
              </div>
              <div class="progressBar">
                <el-tooltip
                  class="item"
                  effect="light"
                  content="正确率 = 当前题目全部答对人数/当前考试提交人数"
                  placement="top"
                >
                  <el-button
                    type="text"
                    icon="el-icon-warning-outline"
                    size="small"
                    style="color: #c4c4c4"
                  ></el-button>
                </el-tooltip>
                <span>正确率</span>
                <template v-if="examSubjectCorrectRateVos.length > 0">
                  <template v-for="(item, i) in examSubjectCorrectRateVos">
                    <el-progress
                      :key="i"
                      v-if="item.subjectId === column.prop"
                      style="width: 150px"
                      :stroke-width="8"
                      :percentage="
                        validatenull(item.accuracy)
                          ? 0
                          : Number(item.accuracy * 100).toFixed(0)
                      "
                      color="#67c23a"
                      text-color="#67c23a"
                    ></el-progress>
                  </template>
                </template>
                <el-progress
                  :key="i"
                  v-else
                  style="width: 150px"
                  :stroke-width="8"
                  :percentage="0"
                  color="#67c23a"
                  text-color="#67c23a"
                ></el-progress>
              </div>
            </div>
          </div>
        </div>
        <div
          v-if="column.typeExam == 'checkboxExam'"
          class="checkboxExamFormItem"
        >
          <el-checkbox-group
            v-model="formData[column.prop]"
            class="checkboxGroupExamForm"
            :disabled="viewDetail"
            style="font-size: 12px"
          >
            <div
              v-for="(info, i) in column.dicData"
              :key="'dicData_checkbox_' + index + '_' + i"
              class="checkboxItem"
              :style="{
                width:
                  column.rowSet == 'rowAuto'
                    ? 'auto'
                    : parseInt(100 / parseInt(column.rowSet)) + '%',
                'margin-right': column.rowSet == 'rowAuto' ? '30px' : '0',
                'font-size': '14px',
              }"
              v-html="info.label"
            ></div>
          </el-checkbox-group>
        </div>
        <div
          v-else-if="
            column.typeExam == 'radioExam' || column.typeExam === 'estimateExam'
          "
          class="radioExamFormItem"
        >
          <div
            v-for="(info, i) in column.dicData"
            :key="'dicData_radio_' + index + '_' + i"
            class="radioItem"
            :style="{
              width:
                column.rowSet == 'rowAuto'
                  ? 'auto'
                  : parseInt(100 / parseInt(column.rowSet)) + '%',
              'margin-right': column.rowSet == 'rowAuto' ? '30px' : '0',
            }"
          >
            {{ info.label }}
          </div>
        </div>
        <div
          v-else-if="column.typeExam === 'inputExam'"
          class="inputExamFormItem"
        >
          <div
            v-for="(info, i) in column.dicData"
            :key="'dicData_input_' + i"
            class="inputItem"
          >
            <el-input clearable v-model="formData[info.value]" disabled>
              <template slot="prepend">填空{{ i + 1 }}</template>
            </el-input>
          </div>
        </div>
        <div>
          解析：<span>
            {{
              validatenull(column.problemAnalysis)
                ? "暂无解析"
                : column.problemAnalysis
            }}
          </span>
        </div>
      </el-form-item>
    </el-form>
    <div class="employe" v-else>
      <img class="employeImg" src="@/assets/iconfont/employe.png" alt="" />
      <div>暂无数据</div>
    </div>
  </div>
</template>

<script>
import { subjectStatistic } from "@/api/exam/examManage";
import { isNull, getArrEqual } from "@/util/qsgCommon";
// import { mapGetters } from "vuex";

export default {
  name: "examView",
  props: {
    examId: {
      type: String,
      default: "",
    },
  },

  data() {
    return {
      loading: true,

      formDataDefault: {},

      formData: {},
      formOption: {
        column: [],
        submitBtn: false,
        emptyBtn: false,
      },
      formKey: 0,
      arr: [
        "A",
        "B",
        "C",
        "D",
        "E",
        "F",
        "G",
        "H",
        "I",
        "J",
        "K",
        "L",
        "M",
        "N",
        "O",
        "P",
        "Q",
        "R",
        "S",
        "T",
        "U",
        "V",
        "W",
        "X",
        "Y",
        "Z",
      ],
      flag: false,
      examSubjectCorrectRateVos: [],
    };
  },
  methods: {
    inputLabelChange(val) {
      let abc = this.deepClone(val).replace(/{{/g, "(");
      return abc.replace(/}}/g, ")");
    },
    topicType(type) {
      if (type === "radioExam") {
        return "(单选题)";
      }
      if (type === "checkboxExam") {
        return "(多选题)";
      }
      if (type === "estimateExam") {
        return "(判断题)";
      }
      if (type === "inputExam") {
        return "(填空题)";
      }
    },
    initForm() {
      this.loading = true;

      subjectStatistic({ examId: this.examId }).then((res) => {
        this.formOption = this.deepClone(
          JSON.parse(res.data.data.editorFrontJson)
        );
        this.formOption.column.map((item, key) => {
          item.labelIndex = key + 1;
          if (
            item.typeExam === "radioExam" ||
            item.typeExam === "checkboxExam" ||
            item.typeExam === "estimateExam" ||
            item.typeExam === "inputExam"
          ) {
            this.flag = true;
            item.dicData.map((obj, index) => {
              let str = this.deepClone(obj.label);
              obj.label = this.arr[index] + ". " + str;
            });
          }
        });
        this.examSubjectCorrectRateVos = this.deepClone(
          res.data.data.examSubjectCorrectRateVos
        );
        this.loading = false;
      });
    },
    showFun(prop, changeJson) {
      let res = true;

      if (
        typeof changeJson === "object" &&
        Array.isArray(changeJson) &&
        !isNull(changeJson)
      ) {
        changeJson.map((item) => {
          if (prop == item.ctrledProp) {
            if (Array.isArray(this.formData[item.ctrlProp])) {
              let hasInArr = getArrEqual(
                this.formData[item.ctrlProp],
                item.ctrlVal
              );

              res = !isNull(hasInArr);
            } else {
              if (!item.ctrlVal.includes(this.formData[item.ctrlProp])) {
                res = false && res;
              }
            }
          }
        });
      } else {
        const propColumn = this.findObject(this.formOption.column, prop);
        res = propColumn.display;
      }

      return res;
    },
    resetIndexFun(prop, allColumn) {
      let res = '<i class="el-icon-warning" style="color: #f05050;"></i>';
      let tempColumn = allColumn.filter((item) => item.typeExam != "htmlExam");
      if (tempColumn.length > 0) {
        tempColumn.map((item, key) => {
          if (item.prop == prop) {
            res = "第" + (key + 1) + "题";
          }
        });
      }
      return res;
    },
  },
  mounted() {
    this.initForm();
  },
  created() {},
};
</script>
<style lang="scss" scoped>
.examForm {
  position: relative;
  height: calc(100vh - 450px);
  overflow-y: auto;
  .objectiveItem {
    height: 100%;
    .examItem {
      background-color: #f5f7f9;
      border-radius: 5px;
      padding: 10px;
      /deep/.el-form-item__label {
        width: 100%;
        a {
          text-decoration: underline;
          color: #409eff;
        }
      }
      /deep/.el-form-item__content {
        width: calc(100% - 225px);
        a {
          text-decoration: underline;
          color: #409eff;
        }
      }
    }
    .examItemLabelVal {
      display: flex;
      align-items: flex-start;
      justify-content: space-between;
      .progressBar {
        display: flex;
        color: #67c23a;
        align-items: center;
        width: 210px;
        justify-content: space-between;
        font-weight: 600;
        /deep/.el-progress__text {
          color: #67c23a;
          font-weight: 600;
        }
      }
    }

    .examItem:last-child {
      margin-bottom: 0px !important;
    }
  }
  .employe {
    padding: 40px 0;
    text-align: center;
    background-color: #ffffff;
    border-radius: 10px;
    color: #c7cad3;
    font-size: 14px;

    .employeImg {
      width: 150px;
      width: 150px;
    }
  }
}
.inputExamFormItem {
  .inputItem {
    margin-bottom: 10px;
  }
}

.uploadExamFormItem {
  padding: 10px 0;
  .uploadExamMain {
    min-width: 300px;
    /*max-width: 640px;*/
  }
}
</style>

<style>
.dialogImageMain {
  text-align: center;
}
.dialogImageImg {
  max-width: 900px;
  max-height: 600px;
}
</style>
