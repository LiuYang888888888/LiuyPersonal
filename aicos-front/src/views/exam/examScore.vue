<template>
  <div class="examForm examScore">
    <el-form
      :loading="loading"
      label-position="top"
      :model="formData"
      ref="formRef"
      size="small"
      class="examForm"
      :key="formKey"
      :class="viewDetail ? 'examViewDetail' : ''"
    >
      <el-form-item
        v-for="(column, index) in formOption.column"
        :key="'column' + index"
        class="examItem"
        :id="column.prop"
        v-if="
          showFun(column.prop, column.changeJson) &&
          !hideJumpSub(column.prop, jumpSubjctArr) &&
          !column.subHide &&
          column.typeExam != 'htmlExam'
        "
      >
        <div class="examItemLabel" slot="label" style="display: block">
          <div
            class="examItemLabelIndex"
            style="width: 100%; font-weight: 700; color: #070b2d"
            v-if="
              formOption.examShowLabelIndex && column.typeExam != 'htmlExam'
            "
            v-html="resetIndexFun(column.prop, formOption.column)"
          ></div>
          <div class="examItemLabelVal">
            <template v-if="column.typeExam === 'inputExam'">
              <div>{{ inputLabelChange(column.label) }}</div>
            </template>
            <template v-else>
              <div v-if="column.labelPlus" v-html="column.label"></div>
              <div v-else>{{ column.label }}</div>
            </template>
          </div>
          <div class="score">
            <!-- <div v-if="column.typeExam !== 'textareaExam'">
              判断：<el-button
                icon="el-icon-check"
                size="mini"
                :disabled="objectiveItemObj[column.prop].answerScoreType === 1"
                style="color: #66cd75"
              ></el-button
              ><el-button
                icon="el-icon-close"
                size="mini"
                style="color: #f4596b"
                :disabled="objectiveItemObj[column.prop].answerScoreType === 2"
              ></el-button>
            </div> -->
            <div>
              得分：
              <template
                v-if="
                  column.typeExam === 'checkboxExam' ||
                  column.typeExam === 'radioExam' ||
                  column.typeExam === 'estimateExam' ||
                  column.typeExam === 'inputExam' ||
                  (column.typeExam === 'textareaExam' && viewDetail)
                "
              >
                {{ objectiveItemObj[column.prop].myScore }}
              </template>
              <template
                v-if="column.typeExam === 'textareaExam' && !viewDetail"
              >
                <el-input-number
                  size="mini"
                  v-model="getScore[column.prop]"
                  :precision="0"
                  :controls="false"
                  :min="0"
                  :max="column.score"
                  :disabled="viewDetail"
                ></el-input-number>
              </template>
            </div>
            <div>满分：{{ column.score }}</div>
          </div>
        </div>

        <div
          v-if="column.typeExam == 'checkboxExam'"
          class="checkboxExamFormItem"
        >
          <el-checkbox-group
            v-model="formData[column.prop]"
            class="checkboxGroupExamForm"
            :disabled="true"
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
              }"
            >
              <el-checkbox :label="info.value">
                <span
                  class="checkboxLabel"
                  v-if="info.labelPlus"
                  v-html="info.label"
                ></span>
                <span class="checkboxLabel" v-else>
                  {{ info.label }}
                </span>
                <div class="canInputCont">
                  <el-input
                    v-model="formData[info.value]"
                    v-if="info.canInput"
                    size="mini"
                    class="canInput"
                    clearable
                    :disabled="viewDetail"
                    @input="
                      (e) => {
                        rulesInput(e, info.value);
                      }
                    "
                    maxlength="200"
                    show-word-limit="true"
                  ></el-input>
                  <div
                    class="canInputError el-form-item__error"
                    v-if="info.canInput"
                    :id="'canInputError_' + info.value"
                  >
                    不允许英文特殊字符
                  </div>
                  <div
                    class="canInputError el-form-item__error"
                    v-if="info.canInput"
                    :id="'hasInputError_' + info.value"
                  >
                    选中的可填项不能为空
                  </div>
                </div>
              </el-checkbox>
            </div>
          </el-checkbox-group>
        </div>

        <div
          v-else-if="
            column.typeExam == 'radioExam' || column.typeExam === 'estimateExam'
          "
          class="radioExamFormItem"
        >
          <el-radio-group :disabled="true" v-model="formData[column.prop]">
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
              <el-radio :label="info.value">
                <span
                  class="checkboxLabel"
                  v-if="info.labelPlus"
                  v-html="info.label"
                ></span>
                <span class="checkboxLabel" v-else>
                  {{ info.label }}
                </span>
                <div class="canInputCont">
                  <el-input
                    v-model="formData[info.value]"
                    v-if="info.canInput"
                    size="mini"
                    class="canInput"
                    clearable
                    :disabled="viewDetail"
                    @input="
                      (e) => {
                        rulesInput(e, info.value);
                      }
                    "
                    maxlength="200"
                    show-word-limit="true"
                  ></el-input>
                  <div
                    class="canInputError el-form-item__error"
                    v-if="info.canInput"
                    :id="'canInputError_' + info.value"
                  >
                    不允许英文特殊字符
                  </div>
                  <div
                    class="canInputError el-form-item__error"
                    v-if="info.canInput"
                    :id="'hasInputError_' + info.value"
                  >
                    选中的可填项不能为空
                  </div>
                </div>
              </el-radio>
            </div>
          </el-radio-group>
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
            <el-input clearable v-model="formData[info.value]" :disabled="true">
              <template slot="prepend">填空{{ i + 1 }}</template>
            </el-input>
          </div>
        </div>
        <div
          v-else-if="['textareaExam'].includes(column.typeExam)"
          class="inputExamFormItem"
        >
          <el-input
            v-model="formData[column.prop]"
            :type="column.type == 'input' ? 'text' : column.type"
            :placeholder="column.placeholder || getPlaceholder(column)"
            :minlength="column.minlength"
            :maxlength="column.maxlength"
            :showWordLimit="column.showWordLimit"
            :rows="column.inputRow || 5"
            clearable
            :disabled="true"
            :style="{
              width: column.inputWidth + column.inputWidthUnit,
            }"
          >
            <template slot="append" v-if="column.prop == 'income'">{{
              column.append
            }}</template>
          </el-input>
        </div>

        <div v-else-if="column.typeExam == 'htmlExam'" class="htmlExamFormItem">
          <div></div>
        </div>

        <div v-else class="compExamFormItem">
          <div
            class="compExamFormItemMain"
            :style="{
              width: column.inputWidth + column.inputWidthUnit,
            }"
          >
            <component
              :is="getComponent(column.type, column.component)"
              v-bind="vBind(column)"
              :multiple="false"
              :placeholder="column.placeholder || getPlaceholder(column)"
              v-model="formData[column.prop]"
              :disabled="viewDetail"
            >
              <span v-if="params.html" v-html="params.html"></span>
            </component>
          </div>
        </div>
        <div class="analysisScore">
          <div style="align-items: baseline">
            <div class="circleStyle"></div>
            <div style="display: flex; width: calc(100% - 10px)">
              <div style="width: 72px">学员答案：</div>
              <div style="width: calc(100% - 75px)">
                <span v-if="column.typeExam === 'textareaExam'">
                  {{ formData[column.prop] }}
                </span>
                <span
                  v-if="
                    column.typeExam === 'radioExam' ||
                    column.typeExam === 'estimateExam'
                  "
                >
                  {{ findIndex(formData[column.prop], column.dicData) }}
                </span>
                <span v-if="column.typeExam === 'checkboxExam'">
                  {{
                    findMoreIndex(false, formData[column.prop], column.dicData)
                  }}
                </span>
                <span v-if="column.typeExam === 'inputExam'">
                  <span v-for="(val, i) in column.dicData" :key="i">
                    <template v-if="!validatenull(formData[val.value])">
                      {{ formData[val.value] }}、
                    </template>
                  </span>
                </span>
              </div>
            </div>
          </div>
          <div style="align-items: baseline">
            <div class="circleStyle"></div>
            <div style="display: flex; width: calc(100% - 10px)">
              <div style="width: 72px">正确答案：</div>
              <div style="width: calc(100% - 75px)">
                <span v-if="column.typeExam === 'textareaExam'">
                  {{ column.referenceAnswer }}
                </span>
                <span
                  v-if="
                    column.typeExam === 'radioExam' ||
                    column.typeExam === 'estimateExam'
                  "
                >
                  {{ findIndex(column.disChecked, column.dicData) }}
                </span>
                <span v-if="column.typeExam === 'checkboxExam'">
                  {{ findMoreIndex(true, column.disChecked, column.dicData) }}
                </span>
                <span v-if="column.typeExam === 'inputExam'">
                  <span v-for="(val, i) in column.dicData" :key="i">
                    {{ val.label }}、
                  </span>
                </span>
              </div>
            </div>
          </div>
          <div style="align-items: baseline">
            <div class="circleStyle"></div>
            <div style="display: flex; width: calc(100% - 10px)">
              <div style="width: 72px">题目解析：</div>
              <div style="width: calc(100% - 75px)">
                {{ column.problemAnalysis ? column.problemAnalysis : "无" }}
              </div>
            </div>
          </div>
        </div>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import { baseURL } from "@/api/common";

import {
  isNull,
  getArrEqual,
  getHtmlPlainText,
  findNodeByVal,
} from "@/util/qsgCommon";
import { getRules } from "@/util/regx";

const rulesReg = getRules(["notEnSpecials"])[0].pattern;
import { mapGetters } from "vuex";

export default {
  name: "examView",
  components: {},
  props: {
    data: {
      type: Object,
      default() {
        return {};
      },
    },

    option: {
      type: Object,
      default() {
        return {
          column: [],
        };
      },
    },
    examConfig: {
      type: Object,
      default() {
        return {};
      },
    },
    showTime: {
      type: Boolean,
      default: true,
    },

    viewDetail: {
      type: Boolean,
      default: false,
    },
    objectiveItemObj: {
      type: Object,
      default() {
        return {};
      },
    },
  },
  computed: {
    ...mapGetters(["userInfo"]),
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

      params: {},
      initFormData: {},
      initFormValue: {},

      valiRes: {},

      jumpSubjctArr: [],

      dialogImageUrl: "",
      dialogVisible: false,

      ExamUploadKey: 0,

      fileListTemp: [],

      AllowUploadFileType: "",
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
      getScore: {},
    };
  },
  methods: {
    inputLabelChange(val) {
      let abc = this.deepClone(val).replace(/{{/g, "(");
      return abc.replace(/}}/g, ")");
    },
    findIndex(val, arr) {
      let index = null;
      arr.forEach((item, i) => {
        if (item.value === val) {
          index = i;
        }
      });
      return this.arr[index];
    },
    findMoreIndex(flag = false, val, arr) {
      let str = "",
        value = val;
      if (!this.validatenull(val)) {
        if (flag) {
          arr.map((obj, i) => {
            if (obj.canChecked) {
              str += this.arr[i];
            }
          });
        } else {
          value.map((item) => {
            arr.map((obj, i) => {
              if (item === obj.value) {
                str += this.arr[i];
              }
            });
          });
        }
        return str;
      }
    },
    vBind(column) {
      const vBind = Object.assign(this.deepClone(column), column.params, {
        size: column.size || "small",
        dic: column.dicData
          ? column.dicData.map((d) => {
            if (!column.props) return d;
            const { label, value, desc } = column.props;
            if (!label || !value) return d;
            return {
              [label]: d.label,
              [value]: d.value,
              [desc]: d.desc,
            };
          })
          : undefined,
        rules: column.pattern
          ? column.rules.map((r) => {
            if (r.pattern) r.pattern = new RegExp(column.pattern);
            return r;
          })
          : column.rules,
      });
      let event = ["change", "blur", "click", "focus"];
      event.forEach((e) => delete vBind[e]);
      if (vBind.event) delete vBind.event;

      return vBind;
    },

    onSubmit() {
      const done = () => {
        this.$refs.formRef.hide();
      };
      const res = {
        ...this.formData,
      };

      this.$emit("submit", res, done);
    },

    onReset() {
      /*重置表单*/

      this.examUploadKey++;

      this.$refs.formRef.resetFields();
      this.formData = this.deepClone(this.initFormValue);
    },

    getSelectOption(val, data) {
      let res = {
        optionName: "",
        optionSort: 0,
        optionType: 1,
        answerText: "",
      };
      if (
        (data.typeExam == "radioExam" ||
          data.typeExam == "checkboxExam" ||
          data.typeExam == "selectExam") &&
        !isNull(data.dicData)
      ) {
        data.dicData.map((item, key) => {
          if (item.value == val) {
            res.optionName = getHtmlPlainText(item.label).substring(0, 200);
            res.optionSort = key + 1;
            res.optionType = item.canInput ? 3 : 1;
            res.answerText = item.canInput ? this.formData[val] : item.label;
          }
        });
      }

      return res;
    },

    getData() {
      /*标准接口数据Json格式*/
      let examConfig = this.deepClone(this.examConfig),
        sum = 0,
        flag = false;
      for (let key in this.getScore) {
        if (!this.validatenull(this.getScore[key])) {
          sum += this.getScore[key];
        }
        if (this.validatenull(this.getScore[key])) {
          flag = true;
        }
        examConfig.answerTestSubjects.map((item) => {
          if (item.subjectId === key) {
            item.reviewScore = this.getScore[key];
          }
        });
      }
      examConfig.reviewTotalScore = sum;
      examConfig.reviewStatus = 1;
      if (flag) {
        return false;
      } else {
        return examConfig;
      }
    },

    initForm() {
      this.loading = true;
      this.formOption = this.deepClone(this.option);
      this.formOption.column.map((item, key) => {
        item.labelIndex = key + 1;
        if (
          item.typeExam === "radioExam" ||
          item.typeExam === "checkboxExam" ||
          item.typeExam === "estimateExam"
        ) {
          item.dicData.map((obj, index) => {
            let str = this.deepClone(obj.label);
            obj.label = this.arr[index] + ". " + str;
          });
        }
      });
      this.loading = false;
      this.$nextTick(() => {
        this.examConfig.answerTestSubjects.map((item) => {
          if (item.subjectType === 5) {
            if (this.examConfig.reviewStatus === 0) {
              this.getScore[item.subjectId] = undefined;
            } else {
              this.getScore[item.subjectId] = item.reviewScore;
            }
          }
        });
        this.formData = JSON.parse(this.examConfig.frontAnswerJson);
      });
      this.formDataDefault = this.deepClone(this.formData);
    },
    getComponent(type, component) {
      let KEY_COMPONENT_NAME = "avue-";
      let result = "input";
      if (component) return component;
      else if (["array", "img", "url"].includes(type)) result = "array";
      else if (type === "select") result = "select";
      else if (type === "radio") result = "radio";
      else if (type === "checkbox") result = "checkbox";
      else if (["time", "timerange"].includes(type)) result = "time";
      else if (
        [
          "dates",
          "date",
          "datetime",
          "datetimerange",
          "daterange",
          "week",
          "month",
          "year",
        ].includes(type)
      )
        result = "date";
      else if (type === "cascader") result = "cascader";
      else if (type === "number") result = "input-number";
      else if (type === "password") result = "input";
      else if (type === "switch") result = "switch";
      else if (type === "rate") result = "rate";
      else if (type === "upload") result = "upload";
      else if (type === "slider") result = "slider";
      else if (type === "dynamic") result = "dynamic";
      else if (type === "icon") result = "input-icon";
      else if (type === "color") result = "input-color";
      else if (type === "map") result = "input-map";

      //if (type === 'upload') KEY_COMPONENT_NAME = 'el-';

      return KEY_COMPONENT_NAME + result;
    },
    getPlaceholder(item) {
      //const label = item.label;
      const label = " ";
      if (
        [
          "select",
          "checkbox",
          "radio",
          "tree",
          "color",
          "dates",
          "date",
          "datetime",
          "datetimerange",
          "daterange",
          "week",
          "month",
          "year",
          "map",
          "icon",
        ].includes(item.type)
      )
        return `请选择 ${label}`;
      else return `请输入 ${label}`;
    },
    valChange(/*e*/) {
      this.$forceUpdate();
    },
    valInit() {
      if (!this.viewDetail) {
        //动态绑定数据 以使用v-model
        this.option.column.map((item /*,key*/) => {
          //console.log(item.prop)
          //this.formData[item.prop] = item.value || null;
          //this.formData.push(item.value || '');
          if (item.typeExam == "checkboxExam") {
            this.$set(this.formData, item.prop, item.value || []);
          } else {
            this.$set(this.formData, item.prop, item.value || "");
          }
        });
        this.initFormValue = this.deepClone(this.formData);
      }
    },

    showFun(prop, changeJson) {
      //console.log(prop)
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
        //console.log(propColumn)
        //console.log(propColumn.display)
        res = propColumn.display;
      }

      return res;
    },

    initRules() {
      //解决渲染后自定义题目的验证 不起作用
      this.$nextTick(() => {
        if (!this.viewDetail) {
          this.$refs.formRef.resetFields();
        }
      });
    },
    showDetail() {
      if (this.viewDetail) {
        //console.log(this.data)
        this.formData = this.deepClone(this.data);
      }
    },

    resetRules(column) {
      let res = [];
      if (["input", "textarea"].includes(column.type)) {
        if (!isNull(column.minlength)) {
          res.push({
            min: column.minlength,
            message: "最少 " + column.minlength + " 个字符",
            trigger: "blur",
          });
        }

        if (!isNull(column.maxlength)) {
          res.push({
            max: column.maxlength,
            message: "最多 " + column.maxlength + " 个字符",
            trigger: "blur",
          });
        }

        res.push(...getRules(["notEnSpecials"]));
      } else if (["checkbox"].includes(column.type)) {
        if (!isNull(column.checkboxMin) && column.checkboxMin != 0) {
          res.push({
            type: "array",
            min: column.checkboxMin,
            message: "至少选择 " + column.checkboxMin + " 项",
            trigger: "change",
          });
        }
        if (!isNull(column.checkboxMax) && column.checkboxMax != 0) {
          res.push({
            type: "array",
            max: column.checkboxMax,
            message: "至多选择 " + column.checkboxMax + " 项",
            trigger: "change",
          });
        }
      }
      if (column.required && isNull(column.rules)) {
        res.push({
          required: true,
          message: "此题必须填写",
          trigger: "change",
        });
      }

      if (column.prop == "mobile") {
        res.push(...getRules(["mobile"]));
      }
      if (column.prop == "mail") {
        res.push(...getRules(["isEmail"]));
      }
      if (column.prop == "idCard") {
        res.push(...getRules(["idCard"]));
      }

      if (!isNull(column.rules)) {
        res.push(...column.rules);
      }

      return res;
    },

    rulesInput(value, eroId) {
      let eroDom = document.getElementById("canInputError_" + eroId);
      let nullEroDom = document.getElementById("hasInputError_" + eroId);
      //const rulesReg =  getRules(['notEnSpecials'])[0].pattern
      if (!isNull(value)) {
        nullEroDom.setAttribute("style", "display: none");

        let testRes = rulesReg.test(value);

        if (!testRes) {
          eroDom.setAttribute("style", "display: block;");
        } else {
          eroDom.setAttribute("style", "display: none");
        }

        this.valiRes[eroId] = testRes;
      } else {
        if (this.getHasSelectOption(eroId)) {
          //当前项是否被选中
          nullEroDom.setAttribute("style", "display: block");
        } else {
          nullEroDom.setAttribute("style", "display: none");
        }

        eroDom.setAttribute("style", "display: none");
        delete this.valiRes[eroId];
      }
    },

    canInputValiRes() {
      let res = true;

      for (let key in this.valiRes) {
        res = res && this.valiRes[key];
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

    hasInputValiRes() {
      //选中可填就必填验证
      let res = true;

      const resFormData = this.deepClone(this.formData);
      //console.log(resFormData)
      for (let key in resFormData) {
        if (Array.isArray(resFormData[key])) {
          //填写的是数组
          resFormData[key].map((item) => {
            if (
              isNull(resFormData[item]) &&
              this.getCanInputByProp(key, item)
            ) {
              //console.log('11 空');
              let eroDom = document.getElementById("hasInputError_" + item);
              eroDom.setAttribute("style", "display: block;");
              res = res && false;
            } else {
              //console.log('11 过')

              res = res && true;
            }
          });
        } else {
          //填写的不是数组
          if (resFormData[key].toString().includes("_Rm_")) {
            //是rm项
            if (
              isNull(resFormData[resFormData[key]]) &&
              this.getCanInputByProp(key, resFormData[key])
            ) {
              //console.log('22 空')
              let eroDom = document.getElementById(
                "hasInputError_" + resFormData[key]
              );
              eroDom.setAttribute("style", "display: block;");
              res = res && false;
            } else {
              //console.log('22 过')
              res = res && true;
            }
          } else {
            //console.log('不是rm项')
          }
        }
      }
      //console.log(res)

      return res;
    },

    getCanInputByProp(subProp, opnProp) {
      //要验证可填，必然是单选或多选

      let res = false;
      const tempOption = this.deepClone(this.formOption).column;

      let subData = findNodeByVal(tempOption, "prop", subProp);

      //console.log(subData);
      if (!isNull(subData)) {
        if (["radioExam", "checkboxExam"].includes(subData.typeExam)) {
          let subDic = subData.dicData;

          let opnData = findNodeByVal(subDic, "value", opnProp);
          //console.log(opnData);
          res = isNull(opnData) ? false : opnData.canInput;
        }
      }
      return res;
    },

    getHasSelectOption(opnProp) {
      let res = false;
      const resFormData = this.deepClone(this.formData);

      if (opnProp.includes("_Rm_")) {
        const subKey = opnProp.split("_Rm_")[0];
        if (resFormData[subKey].includes(opnProp)) {
          //console.log('这个项被选中啦')
          res = true;
        }
      }

      return res;
    },
    compJump(fromProp, toProp) {
      let fromIndex = this.formOption.column.findIndex(
        (c) => c.prop == fromProp
      );
      let toIndex = this.formOption.column.findIndex((c) => c.prop == toProp);
      if (toProp == "lastOne") {
        toIndex = this.formOption.column.length;
      }
      //console.log(fromIndex,toIndex);
      this.formOption.column.map((item, key) => {
        //console.log(item,key)
        if (key > fromIndex && key < toIndex) {
          this.jumpSubjctArr.push(item.prop);
        }
      });

      if (this.jumpSubjctArr.length > 0) {
        this.jumpSubjctArr.map((item) => {
          //console.log('重置数据项')
          this.formData[item] = this.formDataDefault[item];
        });
      }
    },
    hideJumpSub(prop, jumpArr) {
      let res = false;
      //console.log(prop,jumpArr)
      if (jumpArr.includes(prop)) {
        res = true;
      }
      return res;
    },
    handlerJumpArr(val) {
      //console.log(val,this.formDataDefault)

      this.jumpSubjctArr = [];

      for (let key in val) {
        //console.log('val[key]',val[key]+'')
        //console.log('this.formDataDefault[key]',this.formDataDefault[key]+'')
        if (val[key] + "" != this.formDataDefault[key] + "") {
          //console.log('认为值改变了');
          let tIndex = this.formOption.column.findIndex((c) => c.prop == key);
          if (tIndex != -1) {
            let tColumn = this.formOption.column[tIndex];
            //console.log(key,tIndex,tColumn)
            if (tColumn.jumpJson) {
              if (!isNull(tColumn.jumpJson)) {
                if (tColumn.jumpJson.optinJump) {
                  //根据选项跳

                  let toSubPropTemp = tColumn.jumpJson.jumpVal.filter(
                    (item) => item.jumpCtrlOption == val[key]
                  );
                  if (toSubPropTemp.length > 0) {
                    let toSubProp = toSubPropTemp[0].jumpTo;
                    //console.log('根据选项跳',key,toSubProp)
                    if (toSubProp != "noSet") {
                      this.compJump(key, toSubProp);
                    }
                  }
                }

                if (tColumn.jumpJson.allJump) {
                  //无条件跳
                  let toSubProp = tColumn.jumpJson.jumpVal[0].jumpTo;
                  //console.log('无条件跳',key,toSubProp)
                  if (toSubProp != "noSet") {
                    this.compJump(key, toSubProp);
                  }
                }
              }
            }
          }
        }
      }
    },

    ExamUploadPreview(file, listType) {
      if (listType == "picture-card") {
        this.dialogImageUrl = file.url;
        this.dialogVisible = true;
      }
    },
    openFileView(fileUrl) {
      window.open(fileUrl);
    },

    changeFormDataByUploadFileList(fileList, prop) {
      //if( fileList.length > 0 ){

      let tempArr = [];

      fileList.map((item) => {
        if (item.response) {
          if (item.response.code == 200) {
            let fileUrl =
              `${baseURL}` + item.response.data.newFileName.substring(1);
            let fileName = item.response.data.objectName;
            let fileType = item.response.data.oldFileName;
            tempArr.push({
              fileUrl: fileUrl,
              fileName: fileName,
              fileType: fileType,
            });
          } else {
            this.$message.error("上传遇到错误");
            this.$refs.uploadExamRef.map((refobj) => {
              if (refobj.$parent.prop == prop) {
                //console.log(refobj.$children[0].uploadFiles)

                refobj.$children[0].uploadFiles =
                  refobj.$children[0].uploadFiles.filter(
                    (info) => info.uid != item.uid
                  );
              }
            });
          }
        }
      });

      this.formData[prop] = tempArr;
      //}
    },
    initAllowUploadFileType() {
      const systemParamFileType =
        this.$store.state.common.systemParam.AllowUploadFileType;
      let fileTypeArr = [];
      if (!isNull(systemParamFileType)) {
        let fileArr = systemParamFileType.split(",");

        fileArr.map((item) => {
          fileTypeArr.push("." + item);
        });
      }

      this.AllowUploadFileType = fileTypeArr.join();
    },
  },
  mounted() {
    this.initForm();

    this.initRules();
  },
  created() {
    this.valInit();

    this.initAllowUploadFileType();
  },
  watch: {
    viewDetail: {
      handler(/*val*/) {
        this.showDetail();
      },
      immediate: true,
    },
    getScore: {
      handler(val) {
        this.$emit("formChange", val);
        // this.handlerJumpArr(val);
      },
      deep: true,
    },
    // formData: {
    //   handler(val) {
    //     this.$emit("formChange", val);
    //     this.handlerJumpArr(val);
    //   },
    //   deep: true,
    // },
  },
};
</script>
<style lang="scss" scoped>
.examForm {
  position: relative;
  .examUseTime {
    position: absolute;
    top: 5px;
    right: 5px;
    z-index: 100;
  }
  /deep/.el-form-item__content {
    width: calc(100% - 220px);
  }
  /deep/.el-form-item__label {
    .examItemLabelVal {
      display: flex;
      align-items: baseline;
      justify-content: space-between;
      width: calc(100% - 220px) !important;
    }
  }

  .analysisScore {
    padding: 15px;
    background-color: #f5f7f9;
    border-radius: 10px;
    margin-top: 25px;
    width: 100%;
    > div {
      display: flex;
      align-items: center;
      justify-content: flex-start;
    }
    .circleStyle {
      width: 8px;
      height: 8px;
      border-radius: 50%;
      background-color: #36aafd;
      margin-right: 10px;
    }
  }
  .examItem {
    position: relative;
    .score {
      position: absolute;
      top: 30px;
      right: 0px;
      padding: 15px;
      background-color: #f5f7f9;
      border-radius: 10px;
      > div {
        height: 37px;
        line-height: 37px;
      }
      /deep/.el-button {
        padding: 5px;
        cursor: auto;
        pointer-events: none;
        i {
          font-weight: bold;
          font-size: 16px;
        }
      }
      /deep/.el-button:hover {
        border-color: #dcdfe6;
        background-color: #fff;
      }
      /deep/.el-button.is-disabled {
        background-color: #eef1f3;
        color: #c7cccf !important;
      }
    }
  }
}
.examViewDetail {
  .is-checked {
    .checkboxLabel {
      color: #0045c8;
    }
    /deep/.el-checkbox__inner,
    /deep/.el-radio__inner {
      background-color: #0045c8;
      border-color: #0045c8;
    }
    /deep/.el-checkbox__inner::after,
    /deep/.el-radio__inner::after {
      color: #0045c8;
    }
  }
  /deep/.el-input__inner,
  /deep/.el-textarea__inner {
    color: #000;
  }
}
.compExamFormItem {
  width: 100%;
  .compExamFormItemMain {
    & > div:first-child {
      width: 100%;
    }
    /deep/.el-date-editor.el-input,
    /deep/.el-date-editor.el-input__inner,
    /deep/.el-date-editor--daterange.el-input,
    /deep/.el-date-editor--daterange.el-input__inner,
    /deep/.el-date-editor--timerange.el-input,
    /deep/.el-date-editor--timerange.el-input__inner {
      width: 100%;
    }
  }
}
.inputExamFormItem {
  .inputItem {
    margin-bottom: 10px;
  }
}
.examScore {
  /deep/.el-radio__input.is-disabled + span.el-radio__label {
    color: #565863;
  }
  /deep/.el-checkbox__input.is-disabled + span.el-checkbox__label {
    color: #565863;
  }
  /deep/.el-checkbox__input.is-disabled.is-checked .el-checkbox__inner {
    background-color: #2375f1;
  }
  /deep/.el-radio__input.is-disabled.is-checked .el-radio__inner {
    background-color: #2375f1;
  }
  /deep/.el-input.is-disabled .el-input__inner {
    color: #565863;
  }
  /deep/.el-textarea.is-disabled .el-textarea__inner {
    color: #565863;
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
