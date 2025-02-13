<template>
  <div class="addForm">
    <el-row>
      <el-col span="24">
        <avue-crud ref="form" :data="requstData" :option="option" :page="page" @row-save="requstRowSave"
          @row-del="requstRowDel" @select="selectionChange">
          <template slot="menuLeft" v-if="requstFlag.addBtn">
            <el-button type="primary" icon="el-icon-plus" size="small" @click="add">{{ $t('aicosCommon.addBtn') }}
            </el-button>
          </template>
          <template slot-scope="scope" slot="menu">
            <el-button v-if="requstFlag.editBtn" type="text" icon="el-icon-edit" size="small" @click="edit(scope)">{{
              $t('aicosCommon.editBtn') }}
            </el-button>
            <el-button v-if="requstFlag.delBtn" type="text" icon="el-icon-delete" size="small" :disabled="scope.row.$index < hasInitialization"
              @click="requstRowDel(scope)">{{ $t('aicosCommon.delBtn') }}
            </el-button>
          </template>
          <template slot-scope="scope" slot="type">
            <div>{{ swichType(scope.row.type) }}</div>
          </template>
        </avue-crud>
      </el-col>
      <el-col span="24" v-if="personalityDisplay">
        <avue-crud :data="personalityData" :option="optionIndividualization" :page="page" @row-save="rowSave"
          @row-update="rowUpdateIndividualization">
          <template slot="menuLeft" v-if="responseFlag.addBtn">
            <el-button type="primary" icon="el-icon-plus" size="small" @click="addResponese">{{ $t('aicosCommon.addBtn')
            }}
            </el-button>
          </template>
          <template slot-scope="scope" slot="menu">
            <el-button v-if="responseFlag.editBtn" type="text" icon="el-icon-edit" size="small"
              @click="editResponese(scope)">{{ $t('aicosCommon.editBtn') }}
            </el-button>
            <el-button v-if="responseFlag.delBtn" type="text" icon="el-icon-delete" size="small"
              @click="rowDelResponese(data)">{{ $t('aicosCommon.delBtn') }}
            </el-button>
          </template>
          <template slot-scope="scope" slot="type">
            <div>{{ swichType(scope.row.type) }}</div>
          </template>
        </avue-crud>
      </el-col>
    </el-row>
    <HuilanDialog :title="dynamicValidateForm.title" append-to-body width="30%"
      :visible.sync="dynamicValidateForm.addVisible" :before-close="cansell" class="addApli">
      <el-form :model="dynamicValidateForm" :label-position="labelPosition" ref="dynamicValidateForm" label-width="80px"
        class="demo-dynamic" size="small">
        <el-form-item prop="key" :label="$t('aiCenter.plug.requestParameter')" :rules="[
          { required: true, message: $t('aicosCommon.pleaseInput') + $t('aiCenter.plug.requestParameter'), trigger: 'blur' },
          {
            min: 1,
            max: 100,
            message: $t('aiCenter.plug.oneLengthTip'),
            trigger: 'blur',
          },
          {
            pattern: /^[A-Za-z0-9\u4E00-\u9FA5\,\.\/\[\]\;\'\\\-\=\_\+\{\}\<\>\?\:]+$/,
            message: $t('aiCenter.plug.onlyOneTip'),
          },
        ]">
          <el-input v-model="dynamicValidateForm.key" :disabled="dynamicValidateForm.title == $t('aicosCommon.editBtn') && dynamicValidateForm.editRow.index < hasInitialization"
            :placeholder="$t('aicosCommon.pleaseInput') + $t('aiCenter.plug.requestParameter')"></el-input>
        </el-form-item>
        <el-form-item :label="$t('aiCenter.plug.parameterType')" prop="type" :rules="[
          {
            required: true, message: $t('aicosCommon.pleaseSelect') + $t('aiCenter.plug.parameterType'),
            trigger: 'blur'
          },]">
          <el-select v-model="dynamicValidateForm.type"
            :disabled="dynamicValidateForm.title == $t('aicosCommon.editBtn') && dynamicValidateForm.editRow.index < hasInitialization"
            :placeholder="$t('aicosCommon.pleaseSelect') + $t('aiCenter.plug.parameterType')" style="width: 100%"
            @change="typeChange">
            <el-option :label="v.name" :value="v.code" v-for=" v  of  requstPara.dictCode " :key="v.code"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item v-if="dynamicValidateForm.selectType === 'string'" prop="value" :label="$t('aiCenter.plug.value')"
          :rules="[
            { required: true, message: $t('aicosCommon.pleaseInput') + $t('aiCenter.plug.parameterType'), trigger: 'blur' },
            {
              min: 1,
              max: 100,
              message: $t('aiCenter.plug.oneLengthTip'),
              trigger: 'blur',
            },
          ]">
          <el-input v-model="dynamicValidateForm.value"
            :placeholder="$t('aicosCommon.pleaseInput') + $t('aiCenter.plug.requestParameter')"></el-input>
        </el-form-item>
        <el-form-item v-if="dynamicValidateForm.selectType === 'integer'" prop="value" :label="$t('aiCenter.plug.value')"
          :rules="[
            { required: true, message: $t('aicosCommon.pleaseInput') + $t('aiCenter.plug.integer'), trigger: 'blur' },
            { pattern: /^(0|\+?[1-9][0-9]*)$/, message: $t('aicosCommon.pleaseInput') + $t('aiCenter.plug.integer') },
          ]">
          <el-input-number style="width: 100%" v-model="dynamicValidateForm.value" @change="handleChange" :min="0"
            :max="(dynamicValidateForm.title == $t('aicosCommon.editBtn') && dynamicValidateForm.editRow.index < hasInitialization && dynamicValidateForm.key == 'max_length') ? 4096 : 99999999"></el-input-number>
            <!-- :max="99999999"></el-input-number> -->
        </el-form-item>
        <el-form-item v-if="dynamicValidateForm.selectType === 'decimal'" prop="value" :label="$t('aiCenter.plug.value')"
          :rules="[
            { required: true, message: $t('aicosCommon.pleaseInput') + $t('aiCenter.plug.value'), trigger: 'blur' },
            {
              pattern: /^[1-9]\d*\.\d*|0\.\d*[1-9]\d*$/,
              message: $t('aicosCommon.pleaseInput') + $t('aiCenter.plug.decimal')
            },
          ]">
          <el-input-number style="width: 100%" v-model="dynamicValidateForm.value" @change="handleChange" :min="0"
          :max="(dynamicValidateForm.title == $t('aicosCommon.editBtn') && dynamicValidateForm.editRow.index < hasInitialization && (dynamicValidateForm.key == 'top_p' || dynamicValidateForm.key == 'temperature')) ? 1 : 99999999"
          :step="(dynamicValidateForm.title == $t('aicosCommon.editBtn') && dynamicValidateForm.editRow.index < hasInitialization && (dynamicValidateForm.key == 'top_p' || dynamicValidateForm.key == 'temperature')) ? 0.1 : 1"></el-input-number>
            <!-- :max="99999999"></el-input-number> -->
        </el-form-item>
        <el-form-item v-if="dynamicValidateForm.selectType === 'date'" prop="value" :label="$t('aiCenter.plug.value')"
          :rules="[{ required: true, message: $t('aicosCommon.pleaseSelect') + $t('aiCenter.plug.date'), trigger: 'blur' }]">
          <el-date-picker v-model="dynamicValidateForm.value" type="date" format="yyyy-MM-dd" value-format="yyyy-MM-dd"
            :placeholder="$t('aicosCommon.pleaseSelect') + $t('aiCenter.plug.date')">
          </el-date-picker>
        </el-form-item>
        <el-form-item v-if="dynamicValidateForm.selectType === 'boolean'" prop="value" :label="$t('aiCenter.plug.value')"
          :rules="[{ required: true, message: $t('aicosCommon.pleaseSelect') + $t('aiCenter.plug.boolean'), trigger: 'blur' }]">
          <el-switch v-model="dynamicValidateForm.value" active-color="#13ce66">
          </el-switch>
        </el-form-item>
        <el-form-item v-if="dynamicValidateForm.selectType === 'array'" prop="value" :label="$t('aiCenter.plug.value')"
          :rules="[{ required: true, message: $t('aicosCommon.pleaseInput'), trigger: 'blur' }]">
          <avue-array v-model="dynamicValidateForm.value" :placeholder="$t('aicosCommon.pleaseInput')"></avue-array>
        </el-form-item>
        <el-form-item v-if="dynamicValidateForm.selectType === 'key'" prop="value" :label="$t('aiCenter.plug.value')"
          :rules="[{ required: true, message: $t('aicosCommon.pleaseSelect'), trigger: 'blur' }]">
          <vue-json-editor v-model="dynamicValidateForm.value" :showBtns="false" :mode="'code'" lang="en" />
        </el-form-item>
        <el-form-item :label="$t('aiCenter.plug.remark')" prop="remark" :rules="[
          {
            min: 1,
            max: 200,
            message: $t('aiCenter.plug.twoLengthTip'),
            trigger: 'blur',
          },
        ]">
          <el-input type="textarea" v-model="dynamicValidateForm.remark" :maxlength="200"
            :placeholder="$t('aicosCommon.pleaseInput') + $t('aiCenter.plug.remark')"></el-input>
        </el-form-item>
        <el-form-item style="text-align: right">
          <el-button type="primary" size="small" @click="submitForm('dynamicValidateForm')">{{
            $t('aicosCommon.confirmBtn') }}</el-button>
          <el-button @click="resetForm('dynamicValidateForm')">{{ $t('aicosCommon.resetBtn') }}</el-button>
        </el-form-item>
      </el-form>
    </HuilanDialog>
    <HuilanDialog :title="responseForm.title" append-to-body width="30%" :label-position="labelPosition"
      :visible.sync="responseForm.addVisible" :before-close="cansell" class="addApli">
      <el-form :model="responseForm" ref="responseForm" label-width="80px" class="demo-dynamic" size="small">
        <el-form-item prop="key" :label="$t('aiCenter.plug.requestParameter')" :rules="[
          { required: true, message: $t('aicosCommon.pleaseInput') + $t('aiCenter.plug.requestParameter'), trigger: 'blur' },
          {
            min: 1,
            max: 100,
            message: $t('aiCenter.plug.oneLengthTip'),
            trigger: 'blur',
          },
          {
            pattern: /^[A-Za-z0-9\u4E00-\u9FA5\,\.\/\[\]\;\'\\\-\=\_\+\{\}\<\>\?\:]+$/,
            message: $t('aiCenter.plug.onlyTwoTip'),
          },
        ]">
          <el-input v-model="responseForm.key"></el-input>
        </el-form-item>
        <el-form-item :label="$t('aiCenter.plug.parameterType')" prop="type" :rules="[
          { required: true, message: $t('aicosCommon.pleaseSelect') + $t('aiCenter.plug.parameterType'), trigger: 'blur' },
        ]">
          <el-select v-model="responseForm.type"
            :placeholder="$t('aicosCommon.pleaseSelect') + $t('aiCenter.plug.parameterType')" style="width: 100%"
            @change="typeChange">
            <el-option :label="v.name" :value="v.code" v-for=" v  of  requstPara.dictCode " :key="v.code"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item v-if="responseForm.selectType === 'string'" prop="value" :label="$t('aiCenter.plug.value')" :rules="[{ required: true, message: '请输入值', trigger: 'blur' },
        {
          min: 1,
          max: 100,
          message: $t('aiCenter.plug.oneLengthTip'),
          trigger: 'blur',
        },
        ]">
          <el-input v-model="responseForm.value"></el-input>
        </el-form-item>
        <el-form-item v-if="responseForm.selectType === 'integer'" prop="value" :label="$t('aiCenter.plug.value')" :rules="[
          { required: true, message: $t('aicosCommon.pleaseInput') + $t('aiCenter.plug.value'), trigger: 'blur' },
          { pattern: /^(0|\+?[1-9][0-9]*)$/, message: $t('aicosCommon.pleaseInput') + $t('aiCenter.plug.integer') },
        ]">
          <el-input-number style="width: 100%" v-model="responseForm.value" @change="handleChange" :min="0"
            :max="99999999"></el-input-number>
        </el-form-item>
        <el-form-item v-if="responseForm.selectType === 'decimal'" prop="value" :label="$t('aiCenter.plug.value')" :rules="[
          { required: true, message: $t('aicosCommon.pleaseInput') + $t('aiCenter.plug.value'), trigger: 'blur' },
          {
            pattern: /^[1-9]\d*\.\d*|0\.\d*[1-9]\d*$/,
            message: $t('aicosCommon.pleaseInput') + $t('aiCenter.plug.decimal'),
          },
        ]">
          <el-input-number style="width: 100%" v-model="responseForm.value" @change="handleChange" :min="0"
            :max="99999999"></el-input-number>
        </el-form-item>
        <el-form-item v-if="responseForm.selectType === 'date'" prop="value" :label="$t('aiCenter.plug.value')"
          :rules="[{ required: true, message: $t('aicosCommon.pleaseSelect') + $t('aiCenter.plug.date'), trigger: 'blur' }]">
          <el-date-picker v-model="responseForm.value" type="date" format="yyyy-MM-dd" value-format="yyyy-MM-dd"
            :placeholder="$t('aicosCommon.pleaseSelect') + $t('aiCenter.plug.date')">
          </el-date-picker>
        </el-form-item>
        <el-form-item v-if="responseForm.selectType === 'boolean'" prop="value" :label="$t('aiCenter.plug.value')"
          :rules="[{ required: true, message: $t('aicosCommon.pleaseSelect'), trigger: 'blur' }]">
          <el-switch v-model="responseForm.value" active-color="#13ce66">
          </el-switch>
        </el-form-item>
        <el-form-item v-if="responseForm.selectType === 'array'" prop="value" :label="$t('aiCenter.plug.value')"
          :rules="[{ required: true, message: $t('aicosCommon.pleaseInput'), trigger: 'blur' }]">
          <avue-array v-model="responseForm.value"
            :placeholder="$t('aicosCommon.pleaseInput') + $t('aiCenter.plug.value')"></avue-array>
        </el-form-item>
        <el-form-item v-if="responseForm.selectType === 'key'" prop="value" :label="$t('aiCenter.plug.value')"
          :rules="[{ required: true, message: $t('aicosCommon.pleaseInput'), trigger: 'blur' }]">
          <vue-json-editor v-model="responseForm.value" :showBtns="false" :mode="'code'" lang="en" />
        </el-form-item>
        <el-form-item :label="$t('aiCenter.plug.remark')" :rules="[{
          min: 1,
          max: 200,
          message: $t('aiCenter.plug.twoLengthTip'),
          trigger: 'blur',
        },]">
          <el-input type="textarea" v-model="dynamicValidateForm.remark" :maxlength="200"></el-input>
        </el-form-item>
        <el-form-item style="text-align: right">
          <el-button type="primary" size="small" @click="submitFormResponse('responseForm')">{{
            $t('aicosCommon.confirmBtn') }}</el-button>
          <el-button @click="resetForm('responseForm')">{{ $t('aicosCommon.resetBtn') }}</el-button>
        </el-form-item>
      </el-form>
    </HuilanDialog>
  </div>
</template>

<script>
// import serviceList from "@/config/serviceList";
// const { system } = serviceList;
// import { getRules } from "@/util/regx";
import { getDictItemListByDictCode } from "@/api/aiCenter/thesaurusMgr/variable";
// import vueJsonEditor from "vue-json-editor";
import { mapGetters } from "vuex";
const vueJsonEditor = () => import('vue-json-editor');
export default {
  name: "variable",
  components: {
    vueJsonEditor,
  },
  props: {
    hasInitialization: {
      type: Number,
      default: 0
    },
    requstData: {
      type: Array,
      default () {
        return [];
      },
    },
    personalityData: {
      type: Array,
      default () {
        return [];
      },
    },
    personalityDisplay: {
      //是否隐藏个性化参数
      type: Boolean,
      default: true,
    },
    title: {
      //请求参数的标题
      type: String,
      default: "",
    },
    addBtn: {
      type: Boolean,
      default: true,
    },
    inAddBtn: {
      type: Boolean,
      default: true,
    },
    editBtn: {
      type: Boolean,
      default: true,
    },
    inEditBtn: {
      type: Boolean,
      default: true,
    },
    delBtn: {
      type: Boolean,
      default: true,
    },
    inDelBtn: {
      type: Boolean,
      default: true,
    },
  },
  computed: {
    ...mapGetters(['language']),
  },
  watch: {},
  data () {
    // const self = this;
    return {
      labelPosition: 'right',
      dynamicValidateForm: {
        key: null,
        type: null,
        value: [""],
        title: null,
        addVisible: false,
        selectType: "string",
        editRow: null,
        remark: "",
      },
      requstFlag: {
        addBtn: true,
        editBtn: true,
        delBtn: true,
      },
      responseFlag: {
        addBtn: true,
        editBtn: true,
        delBtn: true,
      },
      responseForm: {
        key: null,
        type: null,
        value: [""],
        title: null,
        addVisible: false,
        selectType: "string",
        editRow: null,
      },
      requstPara: {
        dictCode: [],
      },
      page: {
        size: 10,
        pageSizes: [10, 30, 50, 100, 200],
        current: 1,
        total: 0,
      },
      option: {
        title: this.$t("aiCenter.plug.requestTitle"),

        tip: false,
        border: true,
        index: false,
        viewBtn: false,
        columnBtn: false,
        menuWidth: 150,
        menuFixed: false,
        dialogClickModal: false,
        dialogWidth: "30%",
        addBtn: false,
        refreshBtn: false,
        searchShow: false,
        editBtn: false,
        delBtn: false,
        emptyText: this.$t('aicosCommon.notData'),
        column: [
          {
            label: this.$t("aiCenter.plug.requestParameter"),
            prop: "key",
            span: 24,
            editDisabled: true,
          },
          {
            label: this.$t("aiCenter.plug.parameterType"),
            prop: "type",
            solt: true,
          },
          {
            label: this.$t("aiCenter.plug.value"),
            prop: "value",
            // width: 100
          },
          {
            label: this.$t("aiCenter.plug.remark"),
            prop: "remark",
            // width: 100
          },
        ],
      },
      optionIndividualization: {
        title: this.$t('aiCenter.plug.personalizedTitle'),
        tip: false,
        border: true,
        index: false,
        viewBtn: false,
        columnBtn: false,
        menuWidth: 150,
        dialogClickModal: false,
        dialogWidth: "35%",
        addBtn: false,
        editBtn: false,
        refreshBtn: false,
        searchShow: false,
        delBtn: false,
        column: [
          {
            label: this.$t("aiCenter.plug.requestParameter"),
            prop: "key",
          },
          {
            label: this.$t("aiCenter.plug.parameterType"),
            prop: "type",
            solt: true,
          },
          {
            label: this.$t("aiCenter.plug.value"),
            prop: "value",
            // width: 100
          },
          {
            label: this.$t("aiCenter.plug.remark"),
            prop: "remark",
            // width: 100
          },
        ],
      },
    };
  },
  mounted () {
    if (!this.addBtn) {
      this.requstFlag.addBtn = this.addBtn;
    }
    if (!this.inAddBtn) {
      this.responseFlag.addBtn = this.inAddBtn;
    }
    if (!this.editBtn) {
      this.requstFlag.editBtn = this.editBtn;
    }
    if (!this.inEditBtn) {
      this.responseFlag.editBtn = this.inEditBtn;
    }
    if (!this.delBtn) {
      this.requstFlag.delBtn = this.delBtn;
    }
    if (!this.inDelBtn) {
      this.responseFlag.delBtn = this.inDelBtn;
    }
    if (this.title) {
      this.option.title = this.title;
    }
    getDictItemListByDictCode({
      //code: "ai-aiCenter-thesaurusMgr-variable-type",
      code: "aicos-components-plugcrud",
    }).then((res) => {
      const data = res.data;
      if (data.success) {
        this.requstPara.dictCode = data.data;
      }
    });
  },
  methods: {
    requstRowDel (row) {
      const self = this;
      const len = self.requstData.length;
      let arr = [];
      for (let i = 0; i < len; i++) {
        if (row.index !== i) {
          arr.push(self.requstData[i]);
        }
      }
      self.requstData = arr;
      const paramsData = {
        requstData: arr,
        personalityData: self.personalityData,
      };
      self.$emit("chilReData", paramsData);
    },
    rowDelResponese (row) {
      debugger
      const self = this;
      const len = self.personalityData.length;
      let arr = [];
      for (let i = 0; i < len; i++) {
        if (row.index !== i) {
          arr.push(self.personalityData[i]);
        }
      }
      self.personalityData = arr;
      const paramsData = {
        requstData: self.requstData,
        personalityData: arr,
      };
      self.$emit("chilReData", paramsData);
    },
    getCurentDate () {
      let d = new Date();
      const Y = d.getFullYear() + "-";
      const M =
        (d.getMonth() + 1 < 10 ? "0" + (d.getMonth() + 1) : d.getMonth() + 1) +
        "-";
      const D = d.getDate() + 1 < 10 ? "0" + d.getDate() : d.getDate();
      const dateTime = Y + M + D;
      return dateTime;
    },
    add () {
      this.dynamicValidateForm.title = this.$t('aicosCommon.addBtn');
      this.labelPosition = this.language == 'en' ? 'top' : "right"
      this.dynamicValidateForm.addVisible = true;
      this.dynamicValidateForm.key = null;
      this.dynamicValidateForm.type = null;
      this.dynamicValidateForm.value = null;
      this.dynamicValidateForm.remark = "";
      this.dynamicValidateForm.selectType = "string";
    },
    addResponese () {

      this.labelPosition = this.language == 'en' ? 'top' : "right"
      this.responseForm.title = this.$t('aicosCommon.addBtn');
      this.responseForm.addVisible = true;
      this.responseForm.key = null;
      this.responseForm.type = null;
      this.responseForm.value = null;
      this.responseForm.remark = null;
      this.responseForm.selectType = "string";
    },
    edit (data) {
      console.log('data', data)
      this.labelPosition = this.language == 'en' ? 'top' : "right"
      const row = data.row;
      this.dynamicValidateForm.editRow = data;
      this.dynamicValidateForm.title = this.$t('aicosCommon.editBtn');
      this.dynamicValidateForm.addVisible = true;
      this.dynamicValidateForm.key = row.key;
      this.dynamicValidateForm.type = row.type;
      this.dynamicValidateForm.value = row.value;
      this.dynamicValidateForm.remark = row.remark
      this.dynamicValidateForm.selectType = row.type;
      console.log('dynamicValidateForm', this.dynamicValidateForm)
    },
    editResponese (data) {
      this.labelPosition = this.language == 'en' ? 'top' : "right"
      const row = data.row;
      this.responseForm.editRow = data;
      this.responseForm.title = this.$t('aicosCommon.editBtn');
      this.responseForm.addVisible = true;
      this.responseForm.key = row.key;
      this.responseForm.type = row.type;
      this.responseForm.value = row.value;
      this.responseForm.selectType = row.type;
      this.responseForm.remark = row.remark
    },
    resetForm (formName) {
      this.$refs[formName].resetFields();
    },
    submitForm (formName) {
      const self = this;
      this.$refs[formName].validate((valid) => {
        if (valid) {
          let flag = true;
          if (self.dynamicValidateForm.selectType === "array") {
            self.dynamicValidateForm.value.map((v) => {
              if (!v) {
                flag = false;
                self.$message.error(this.$t('aiCenter.plug.checkDataTip'));
              }
            });
          }
          if (!flag) {
            return;
          } else {
            const data = self.dynamicValidateForm;
            if (this.dynamicValidateForm.title === this.$t('aicosCommon.addBtn')) {
              self.requstData.push({
                key: data.key,
                type: data.type,
                value: data.value,
                remark: data.remark,
              });
            } else {
              const len = self.requstData.length;
              const arr = [];
              for (let i = 0; i < len; i++) {
                if (self.dynamicValidateForm.editRow.index !== i) {
                  arr.push(self.requstData[i]);
                } else {
                  arr.push({
                    key: data.key,
                    type: data.type,
                    value: data.value,
                    remark: data.remark,
                  });
                }
              }
              self.requstData = arr;
            }
            const paramsData = {
              requstData: self.requstData,
              personalityData: self.personalityData,
            };
            self.dynamicValidateForm.addVisible = false;
            self.$emit("chilReData", paramsData);
          }
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    submitFormResponse (formName) {
      const self = this;
      this.$refs[formName].validate((valid) => {
        if (valid) {
          let flag = true;
          if (self.responseForm.selectType === "array") {
            self.responseForm.value.map((v) => {
              if (!v) {
                flag = false;
                self.$message.error(this.$t('aiCenter.plug.checkDataTip'));
              }
            });
          }
          if (!flag) {
            return;
          } else {
            const data = self.responseForm;
            if (this.responseForm.title === this.$t('aicosCommon.addBtn')) {
              self.personalityData.push({
                key: data.key,
                type: data.type,
                value: data.value,
                remark: data.remark,
              });
            } else {
              const len = self.personalityData.length;
              const arr = [];
              for (let i = 0; i < len; i++) {
                if (self.responseForm.editRow.index !== i) {
                  arr.push(self.personalityData[i]);
                } else {
                  arr.push({
                    key: data.key,
                    type: data.type,
                    value: data.value,
                    remark: data.remark,
                  });
                }
              }
              self.personalityData = arr;
            }
            const paramsData = {
              requstData: self.requstData,
              personalityData: self.personalityData,
            };
            self.responseForm.addVisible = false;
            self.$emit("chilReData", paramsData);
          }
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    typeChange (val) {
      const self = this;
      switch (val) {
        case "string":
          self.dynamicValidateForm.value = null;
          self.dynamicValidateForm.selectType = "string";
          self.responseForm.value = null;
          self.responseForm.selectType = "string";
          break;
        case "integer":
          self.dynamicValidateForm.value = 0;
          self.dynamicValidateForm.selectType = "integer";
          self.responseForm.value = 0;
          self.responseForm.selectType = "integer";
          break;
        case "decimal":
          self.dynamicValidateForm.value = 0.1;
          self.dynamicValidateForm.selectType = "decimal";
          self.responseForm.value = 0.1;
          self.responseForm.selectType = "decimal";
          break;
        case "date":
          self.dynamicValidateForm.value = self.getCurentDate();
          self.dynamicValidateForm.selectType = "date";
          self.responseForm.value = self.getCurentDate();
          self.responseForm.selectType = "date";
          break;
        case "boolean":
          self.dynamicValidateForm.value = false;
          self.dynamicValidateForm.selectType = "boolean";
          self.responseForm.value = false;
          self.responseForm.selectType = "boolean";
          break;
        case "array":
          self.dynamicValidateForm.value = [""];
          self.dynamicValidateForm.selectType = "array";
          self.responseForm.value = [""];
          self.responseForm.selectType = "array";
          break;
        case "key":
          self.dynamicValidateForm.value = {};
          self.dynamicValidateForm.selectType = "key";
          self.responseForm.value = {};
          self.responseForm.selectType = "key";
          break;
      }
    },
    swichType (val) {
      let newVal = null;
      switch (val) {
        case "string":
          newVal = this.$t('aiCenter.plug.string');
          break;
        case "integer":
          newVal = this.$t('aiCenter.plug.integer');
          break;
        case "decimal":
          newVal = this.$t('aiCenter.plug.decimal');
          break;
        case "date":
          newVal = this.$t('aiCenter.plug.date');
          break;
        case "boolean":
          newVal = this.$t('aiCenter.plug.boolean');
          break;
        case "array":
          newVal = this.$t('aiCenter.plug.array');
          break;
        case "key":
          newVal = this.$t('aiCenter.plug.key');
          break;
      }
      return newVal;
    },
  },
};
</script>

<style scoped lang="scss">
.addForm {
  margin-left: 4px;

  /deep/ h2 {
    font-size: 16px;
    font-weight: 400;
  }
}

/deep/ .jsoneditor-poweredBy {
  display: none !important;
}

/deep/ .jsoneditor-modes {
  display: none !important;
}
</style>
