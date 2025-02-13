<template>
  <div class="examForm">
    <!-- <avue-form 
      ref="viewFormRef"
      :option="formOption"
      v-model="formData"
    >
    </avue-form> -->

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
      <!-- :rules="resetRules(column)"
        :prop="column.prop" -->
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
        </div>

        <div
          v-if="column.typeExam == 'checkboxExam'"
          class="checkboxExamFormItem"
        >
          <el-checkbox-group
            v-model="formData[column.prop]"
            class="checkboxGroupExamForm"
            :disabled="viewDetail"
          >
            <!-- @input="(e)=>{ valChangeForJump(e,column) }" -->
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
                <!-- :checked="(info.checked)" -->
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
          <el-radio-group
            v-model="formData[column.prop]"
            :disabled="viewDetail"
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
            <el-input clearable v-model="formData[info.value]">
              <template slot="prepend">填空{{ i + 1 }}</template>
            </el-input>
          </div>
        </div>
        <!-- <div v-else-if="column.typeExam == 'selectExam'" class="selectExamFormItem">
          <el-select v-model="formData[column.prop]" clearable placeholder="请选择" :disabled="viewDetail" @input="(e)=>{ valChangeForJump(e,column) }">
            <el-option
              v-for="(info, i) in column.dicData"
              :key="'dicData_select_' + index +'_'+ i"
              :label="info.label"
              :value="info.value">
            </el-option>
          </el-select>
        </div> -->
        <div
          v-else-if="['upload'].includes(column.type)"
          class="uploadExamFormItem"
        >
          <div class="uploadExamMain" v-if="!viewDetail">
            <HuilanUploader
              class="uploadExam"
              ref="uploadExamRef"
              :list-type="column.listType"
              :data="column.data"
              :action="column.action"
              :accept="
                column.listType == 'picture-card'
                  ? column.accept
                  : AllowUploadFileType
              "
              :multiple="column.multiple"
              :limit="column.limit"
              :drag="column.dragFile"
              :key="examUploadKey"
              :fileSize="column.fileSize"
              :on-change="
                (file, fileList) =>
                  ExamUploadChange(file, fileList, column.prop)
              "
              :on-success="examUploadSuccess"
              :on-error="examUploadError"
              :before-upload="
                (file) =>
                  ExamUploadBefore(
                    file,
                    column.accept,
                    column.fileSize,
                    column.listType
                  )
              "
              :on-remove="
                (file, fileList) =>
                  ExamUploadRemove(file, fileList, column.prop)
              "
              :on-exceed="(file, fileList) => ExamUploadExceed(column.limit)"
              :on-preview="(file) => ExamUploadPreview(file, column.listType)"
            >
              <el-button
                size="small"
                icon="el-icon-upload"
                type="primary"
                v-if="column.listType == 'text' && !column.dragFile"
                >点击上传</el-button
              >
              <i
                v-if="column.listType == 'picture-card'"
                class="el-icon-plus"
              ></i>
              <div v-if="column.drag">
                <i class="el-icon-upload"></i>
                <div class="el-upload__text">
                  将文件拖到此处，或<em>点击上传</em>
                </div>
                <div class="el-upload__tip" slot="tip">{{ column.tip }}</div>
              </div>
            </HuilanUploader>
            <el-dialog
              :visible.sync="dialogVisible"
              append-to-body
              class="dialogImage"
            >
              <div class="dialogImageMain">
                <img :src="dialogImageUrl" class="dialogImageImg" />
              </div>
            </el-dialog>
          </div>
          <div v-if="viewDetail">
            <div v-if="column.listType == 'text'">
              <div
                v-for="(file, m) in formData[column.prop]"
                :key="'file_' + column.prop + '_' + m"
              >
                <el-link
                  :underline="false"
                  @click.stop="openFileView(file.fileUrl)"
                  ><i class="el-icon-view"></i> {{ file.fileName }}</el-link
                >
              </div>
            </div>
            <div v-if="column.listType == 'picture-card'">
              <ul class="el-upload-list el-upload-list--picture-card">
                <li
                  class="el-upload-list__item"
                  v-for="(file, m) in formData[column.prop]"
                  :key="'file_' + column.prop + '_' + m"
                  @click.stop="openFileView(file.fileUrl)"
                  style="cursor: pointer"
                >
                  <img
                    :src="file.fileUrl"
                    :alt="file.fileName"
                    class="el-upload-list__item-thumbnail"
                  />
                </li>
              </ul>
            </div>
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
            :disabled="viewDetail"
            :style="{
              width: column.inputWidth + column.inputWidthUnit,
            }"
          >
            <template slot="append" v-if="column.prop == 'income'">{{
              column.append
            }}</template>
          </el-input>
          <!-- @input="valChange($event)" -->
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
              <!-- @input="({value,column })=>{ valChangeForJump(value,column) }" -->
              <!-- :value="
                ['time', 'timerange', 'checkbox'].includes(column.type) 
                ? column.dicData
                :(['radio'].includes(column.type)
                  ?column.disChecked
                  :undefined
                )" -->

              <span v-if="params.html" v-html="params.html"></span>
            </component>
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
  formateFileSize,
  findNodeByVal,
} from "@/util/qsgCommon";
import { getRules } from "@/util/regx";

// import { deepClone } from "@/util/util";
import HuilanUploader from "@/components/uploader";

const rulesReg = getRules(["notEnSpecials"])[0].pattern;

// import DoTime from "./doTime";
import { mapGetters } from "vuex";

export default {
  name: "examView",
  components: {
    // DoTime,
    HuilanUploader,
  },
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

      /*useTimeToMS: 0,
      useStartTime: 0,
      useTime: 0,
      useEndTime: 0,
      useTimer: null,*/

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
    };
  },
  methods: {
    inputLabelChange(val){
      let abc = this.deepClone(val).replace(/{{/g, "(");
      return abc.replace(/}}/g, ")")
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

      /*vBind.change = ({value})=>{
        //console.log(value,column)
        this.valChangeForJump(value,column);
      };*/

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

      //console.log(this.$refs.formRef)
      //this.$refs.formRef.resetForm();

      this.examUploadKey++;

      this.$refs.formRef.resetFields();
      this.formData = this.deepClone(this.initFormValue);
      //this.$refs.formRef.hide();
      // this.$refs.doTimeRef.useTimeStart(true);
    },
    // onRefill() {
    //   /*激活表单，使其可用*/
    //   //this.$refs.formRef.hide();
    //   this.$refs.doTimeRef.useTimeStart(false);
    // },

    getSelectOption(val, data) {
      let res = {
        optionName: "",
        optionSort: 0,
        optionType: 1,
        answersText: "",
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
            res.answersText = item.canInput ? this.formData[val] : item.label;
          }
        });
      }

      return res;
    },

    getData() {
      /*标准接口数据Json格式*/
      // this.$refs.doTimeRef.useTimeStop();
      // let editorFrontJson = JSON.parse(deepClone(this.examConfig.editorFrontJson))
      let VOArr = [];
      let onlyOneJson = {};
      this.formOption.column.map((item /*,key*/) => {
        //console.log(this.formData[item.prop]);
        //处理身份验证类字段
        if (item.onlyOne) {
          onlyOneJson[item.prop] = this.formData[item.prop];
        }
        let cumItem = {
          questionnaireId: this.examConfig.questionnaireId,
          questionnaireName: this.examConfig.questionnaireName,
          subjectId: item.prop,
          subjectName: item.label,
          scoreType: item.scoringRule,
          testId: this.examConfig.id,
          testName: this.examConfig.testName,
          totalScore: item.score,
        };
        let extItem = {};

        switch (item.typeExam) {
          case "radioExam":
            extItem = {
              subjectType: 1,
              answersText: JSON.stringify([
                { answer: this.formData[item.prop] },
              ]),
              // this.getSelectOption(this.formData[item.prop], item)
              //   .answersText + "",
            };

            VOArr.push({ ...cumItem, ...extItem });
            break;

          case "rateExam":
            /*评分题 按照单选题 做数据存储，可以做数据统计*/
            extItem = {
              subjectType: 1,
              optionId:
                item.prop + "_Rm_rateOption_" + this.formData[item.prop],
              optionName: this.formData[item.prop],
              answersText: this.formData[item.prop] + "",
              optionSort: this.formData[item.prop],
              optionType: 1,
            };

            VOArr.push({ ...cumItem, ...extItem });
            break;

          case "checkboxExam":
            if (this.formData[item.prop]) {
              let arr = [];
              extItem = {
                subjectType: 2,
              };
              this.formData[item.prop].map((info /*,ind*/) => {
                arr.push({ answer: info });
              });
              extItem.answersText = JSON.stringify(arr);
              VOArr.push({ ...cumItem, ...extItem });
            }
            break;

          case "estimateExam":
            extItem = {
              subjectType: 3,
              answersText: JSON.stringify([
                { answer: this.formData[item.prop] },
              ]),
              // this.getSelectOption(this.formData[item.prop], item)
              //   .optionName + "",
            };

            VOArr.push({ ...cumItem, ...extItem });
            break;

          case "inputExam":
            if (!isNull(item.dicData)) {
              let arr = [];
              extItem = {
                subjectType: 4,
              };
              item.dicData.map((obj) => {
                if (!this.validatenull(this.formData[obj.value])) {
                  arr.push({
                    answer: this.formData[obj.value].replace(/\s/g, ""),
                  });
                }
              });
              extItem.answersText = JSON.stringify(arr);
              VOArr.push({ ...cumItem, ...extItem });
            }

            break;
          case "textareaExam":
            extItem = {
              subjectType: 5,
              optionType: 3,
              //answerQuestionnaireId: item.prop,
              answersText: JSON.stringify([
                { answer: this.formData[item.prop] },
              ]),
            };
            VOArr.push({ ...cumItem, ...extItem });
            break;

          case "uploadExam":
            extItem = {
              subjectType: 6,
              optionType: 3,
              answersText: JSON.stringify(this.formData[item.prop]) + "",
            };
            VOArr.push({ ...cumItem, ...extItem });
            break;
          default:
            extItem = {
              subjectType: 6,
              optionType: 3,
              answersText: this.formData[item.prop] + "",
            };
            VOArr.push({ ...cumItem, ...extItem });
        }
      });
      //将未选中的可填项的值 剔除
      const resFormData = this.deepClone(this.formData);
      for (let key in resFormData) {
        if (key.includes("_Rm_")) {
          const subKey = key.split("_Rm_")[0];
          if (!resFormData[subKey].includes(key)) {
            delete resFormData[key];
          }
        }
      }
      //console.log(resFormData)
      // console.log(editorFrontJson);
      const saveJson = {
        frontAnswerJson: JSON.stringify({ ...resFormData }),
        editorFrontJson: this.examConfig.editorFrontJson,
        questionnaireId: this.examConfig.questionnaireId,
        questionnaireName: this.examConfig.questionnaireName,
        answerTestSubjects: VOArr,
        testId: this.examConfig.id,
        testName: this.examConfig.testName,
        totalScore: this.examConfig.totalScore,
        realName: this.userInfo.realName,
        subjectNum: this.examConfig.subjectNum,
        ...onlyOneJson,
      };
      //console.log(saveJson);

      const res = {
        ExamData: { ...resFormData },
        ExamOption: { ...this.option },
        saveJson: { ...saveJson },
      };

      return res;
    },

    initForm() {
      this.loading = true;

      // this.$refs.doTimeRef.useTimeStop();
      //this.formData = this.data;
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

      this.formDataDefault = this.deepClone(this.formData);
    },

    /*examShowLabelIndex(){
      //处理是否显示问题序号
      this.$nextTick(()=>{
        this.formOption.column.map((item,key)=>{

          item.labelIndex = (key +1);

          const toRef = this.$refs.formRef.getPropRef(item.prop).$parent.$el.firstChild;
          let indexHtml = document.createElement('span');
          indexHtml.setAttribute('class', 'formIndex');
          indexHtml.innerHTML = (key+1)+'、';
          toRef.prepend(indexHtml);
        })
      })
    },
    selectLayout(){
      //处理选项显示的布局问题
      this.$nextTick(()=>{
        if( !isNull(this.formOption.column) ){
          this.formOption.column.map((item,key)=>{

            const toRef = this.$refs.formRef.getPropRef(item.prop).$el;
            if ( item.typeExam == 'radioExam') {

              //toRef.setAttribute('id', 'ID'+item.prop);
              //let toRefDom = document.querySelector("#ID"+item.prop+">.el-radio-group")  ;
              toRef.setAttribute('class', 'radioExamFormItem');
              let toRefDom = toRef.querySelectorAll(".el-radio");
              for (let itemlabel of toRefDom) {
                //itemlabel.setAttribute('style', 'width: 100%;');
                itemlabel.setAttribute('class', 'el-radio selectLabel radioItem');
              }

            }else if (item.typeExam == 'checkboxExam'){
              let toRefDom = toRef.querySelectorAll(".el-checkbox");
              for (let itemlabel of toRefDom) {
                itemlabel.setAttribute('style', 'width: 100%;');
                itemlabel.setAttribute('class', 'el-checkbox selectLabel');
              }
            }

          })
        }

      })
    },*/

    /*useTimeStart(reset){
      const that = this;
      if(reset){
        window.clearInterval(that.useTimer);
        that.useTime = 0;
        that.useStartTime = Date.now();
      }

      that.useTimer = window.setInterval(()=>{
        that.useTime++;
      },1000)

    },
    useTimeStop(){
      this.useEndTime = Date.now();
      window.clearInterval(this.useTimer);
    },*/

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
            this.$set(this.formData, item.prop, "" || []);
          } else {
            this.$set(this.formData, item.prop, "" || "");
          }
        });
        this.initFormValue = this.deepClone(this.formData);
      }
    },

    /*supplyZero(i){
      return (i<10?'0'+i:i)
    },
    secondToMS(second){
      let resM = this.supplyZero(parseInt(second/60));
      let resS = this.supplyZero(second % 60);
      this.useTimeToMS = resM+':'+resS;
    },*/

    /*checkboxIsChange(val){
      console.log(val)
      console.log(this)
      console.log(this.$refs.formRef)
    },*/

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

      /*let subObj = tempOption.filter(item=>item.prop==subProp);
      if(subObj.length> 0){
        let subDic = subObj[0].dicData;
        if( ['radioExam', 'checkboxExam'].includes( subObj[0].typeExam) ) {
          let opnObj = subDic.filter(item=>item.value==opnProp);
          res = opnObj[0].canInput;
        }

      }*/
      //console.log(res)
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
    /*valChangeForJump(e,column){

      //console.log(e,column);

      if(isNull(e) || ( column.typeExam == "rateExam" && e==0)){
        this.$nextTick(()=>{
          this.jumpSubjctArr = [];
        })
      }

      if( column.jumpJson ){
        if( !isNull( column.jumpJson ) ){
          if(column.jumpJson.optinJump){
            //根据选项跳
            //console.log('根据选项跳column.jumpJson',column.jumpJson)
            let toSubPropTemp = column.jumpJson.jumpVal.filter(item=>item.jumpCtrlOption == e);
            if(toSubPropTemp.length > 0){
              let toSubProp = toSubPropTemp[0].jumpTo;
              //console.log('根据选项跳',toSubProp)
              if( toSubProp !="noSet"){
                this.compJump(column.prop,toSubProp);
              }else{
                this.jumpSubjctArr = [];
              }
            }
          }
          if(column.jumpJson.allJump){
            //无条件跳
            let toSubProp = column.jumpJson.jumpVal[0].jumpTo;
            //console.log('无条件跳',toSubProp)
            if( toSubProp !="noSet"){
              this.compJump(column.prop,toSubProp);
            }else{
              this.jumpSubjctArr = [];
            }
          }
        }
      }
    },*/
    compJump(fromProp, toProp) {
      //console.log(fromProp,toProp)
      //this.jumpSubjctArr = [];

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

    ExamUploadChange(file, fileList, prop) {
      //console.log(file, fileList, prop);

      this.changeFormDataByUploadFileList(fileList, prop);
    },

    ExamUploadRemove(file, fileList, prop) {
      //console.log(file, fileList, prop)
      this.changeFormDataByUploadFileList(fileList, prop);
    },

    // ExamUploadSuccess( response, file, fileList){
    //   console.log(response, file, fileList)
    // },
    ExamUploadExceed(limit) {
      this.$message.error("最多上传 " + limit + " 个文件！");
    },
    ExamUploadBefore(file, canType, canSize, listType) {
      //console.log(file, canType, canSize)
      if (listType == "picture-card") {
        let fileType = file.type.replace("image/", "");
        if (!canType.includes(fileType)) {
          this.$message.error("不允许的文件格式！");
          return false;
        }
      } else {
        let fileTypeArr = file.name.split(".");
        let fileType = fileTypeArr[fileTypeArr.length - 1];

        if (!this.AllowUploadFileType.includes(fileType)) {
          this.$message.error("不允许的文件格式！");
          return false;
        }
      }

      if (file.size > canSize * 1024) {
        this.$message.error(
          "文件大小不能超过 " + formateFileSize(canSize * 1024) + " ！"
        );
        return false;
      }
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
    /*'useTime': {
      handler(val) {
        this.secondToMS(val);
      },
      immediate: true,
    },*/
    viewDetail: {
      handler(/*val*/) {
        this.showDetail();
      },
      immediate: true,
    },
    formData: {
      handler(val) {
        this.$emit("formChange", val);
        this.handlerJumpArr(val);
      },
      deep: true,
    },
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
