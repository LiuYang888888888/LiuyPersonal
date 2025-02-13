<template>
  <div class="addForm">
    <HuilanDialog :title="title" append-to-body :visible.sync="dialogVisible" :before-close="closesClear" width="600px">
      <el-form ref="form" :model="form" label-width="150px" size="mini">
        <el-form-item :label="$t('aiCenter.variable.variableWordName')" prop="variableName" :rules="[
          { required: true, message: $t('aiCenter.variable.variableWordEmptyTip'), trigger: 'blur' },
          {
            min: 1,
            max: 50,
            message: $t('aiCenter.variable.fiveLengthTip'),
            trigger: 'blur',
          },
          { pattern: /^[A-Za-z0-9\u4E00-\u9FA5]+$/, message: $t('aiCenter.variable.onlyRuleTip') },
        ]">
          <el-input v-model="form.variableName"
            :disabled="(flagEidtOrAdd == 'edit' || flagEidtOrAdd == 'view' ? 'disabled' : false)"
            :maxlength="50"></el-input>
        </el-form-item>
        <el-form-item :label="$t('aiCenter.variable.dataSources')">
          <el-radio-group v-model="form.dataSources" :disabled="(flagEidtOrAdd == 'view' ? 'disabled' : false)">
            <el-radio label="custom">{{ $t('aiCenter.variable.customValue') }}</el-radio>
            <el-radio label="plugin">{{ $t('aiCenter.variable.pluginLibrary') }}</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item v-if="form.dataSources === 'custom'" :label="$t('aiCenter.variable.customValue')"
          prop="variableValue" :rules="[
            { required: true, message: $t('aiCenter.variable.customValueEmptyTip'), trigger: 'blur' },
            {
              min: 1,
              max: 50,
              message: $t('aiCenter.variable.fiveLengthTip'),
              trigger: 'blur',
            },
            { pattern: /^[A-Za-z0-9\u4E00-\u9FA5]+$/, message: $t('aiCenter.variable.onlyRuleTip') },
          ]">
          <el-input v-model="form.variableValue" :disabled="(flagEidtOrAdd == 'view' ? 'disabled' : false)"
            :maxlength="50"></el-input>
        </el-form-item>
        <el-form-item v-if="form.dataSources === 'plugin'" :label="$t('aiCenter.variable.selectPlugin')" prop="pluginName"
          :rules="[{ required: true, message: $t('aiCenter.variable.pleaseSelectPlugin') }]">
          <el-row>
            <el-col span="18" style="padding-right: 8px">
              <el-input disabled="disabled"  v-model="form.pluginName" ></el-input>
            </el-col>
            <el-col span="6">
              <el-button type="primary" size="mini" @click="selePlug">{{ $t('aiCenter.variable.selectPlugin')
              }}</el-button>
            </el-col>
          </el-row>
        </el-form-item>
      </el-form>
      <el-row class="requstPar" v-if="form.pluginName && form.dataSources === 'plugin'">
        <el-col span="24" class="requstParams" v-if="requestType === 'class'">
          <h4>{{ $t("aiCenter.variable.classNameParameter") }}</h4>
          <el-input size="small" v-model="form.variableValue" :disabled="(flagEidtOrAdd == 'view' ? 'disabled' : false)"
            :placeholder="$t('aicosCommon.pleaseInput') + $t('aiCenter.variable.classNameParameter')"></el-input>
        </el-col>
        <el-col span="24" class="requstParams" v-if="requestType === 'script'">
          <h4>{{ $t("aiCenter.variable.scriptParameters") }}</h4>
          <el-input size="small" v-model="form.variableValue" :disabled="(flagEidtOrAdd == 'view' ? 'disabled' : false)"
            :placeholder="$t('aicosCommon.pleaseInput') + $t('aiCenter.variable.scriptParameters')"></el-input>
        </el-col>
        <PlugCrud v-if="requestType === 'http'" class="plugCrud" :addBtn="false" :delBtn="false" @chilReData="preGetData"
          :requstData="requstData" :personalityData="personalityData"></PlugCrud>
        <el-col span="24" v-if="requestType === 'http'">
          <span class="returnPra">{{ $t('aiCenter.variable.returnParameters') }}</span>
          <el-input v-model="form.returnParams" disabled="disabled" size="mini"></el-input>
        </el-col>
      </el-row>
      <el-row v-if="flagEidtOrAdd != 'view'">
        <el-col span="24" class="btn" style="text-align: right; margin-top: 20px">
          <el-button size="mini" type="primary" @click="onSubmit">{{ $t("aicosCommon.confirmBtn") }}</el-button>
          <el-button size="mini" @click="cancel">{{ $t("aicosCommon.closeBtn") }}</el-button>
        </el-col>
      </el-row>
    </HuilanDialog>
    <Plug ref="childPlug" :applicationId="curAiAppId" @chilGetPlug="prentGetPlug"></Plug>
  </div>
</template>

<script>
import { save, update } from "@/api/aiCenter/thesaurusMgr/variable";
import Plug from "./plug.vue";
import ThesaurusBasic from "../components/thesaurusBasic";
import PlugCrud from "@/components/plugCrud";
export default {
  name: "variable",
  components: {
    ThesaurusBasic,
    Plug,
    PlugCrud,
  },
  props: {
    curAiAppId: {
      type: String,
    },
  },
  watch: {},
  data () {
    return {
      title: this.$t('aiCenter.variable.addVariableWords'),
      dialogVisible: false,
      dialogVisiblePlug: false,
      flagEidtOrAdd: "add",
      requstData: [],
      personalityData: [],
      form: {
        variableName: null,
        dataSources: "custom",
        variableValue: null,
        pluginName: null,
        returnParams: null,
        pluginId: null,
      },
      requestType: null,
    };
  },
  methods: {
    selePlug () {
      // console.log(this.$store.getters.dialogVisiblePlug)
      // this.$store.commit('SET_DIALOGVISBLEPLUG',true)
      this.$refs.childPlug.dialogVisiblePlug = true;
    },
    prentGetPlug (data) {
      this.requestType = data[0].requestType;
      this.form.pluginName = data[0].pluginName;
      this.form.returnParams = data[0].returnParams;
      this.form.pluginId = data[0].id;
      if (data[0].requestType === "class") {
        this.form.variableValue = data[0].pluginClass;
        this.requstData = [];
        this.personalityData = [];
      }
      if (data[0].requestType === "script") {
        this.form.variableValue = data[0].script;
        this.requstData = [];
        this.personalityData = [];
      }
      if (data[0].pluginParams && data[0].requestType === "http") {
        const pluginParamsJon = JSON.parse(data[0].pluginParams);
        this.requstData = pluginParamsJon;
      }
    },
    onSubmit () {
      const scope = this;
      scope.$refs["form"].validate((valid) => {
        if (valid && this.curAiAppId) {
          let pluginParams = {};
          if (scope.form.dataSources === "plugin") {
            if (scope.requestType === "http") {
              pluginParams = {
                requestParams: JSON.stringify(scope.requstData),
                specialParameters: JSON.stringify(scope.personalityData),
              };
            } else {
              pluginParams = {
                specialParameters: JSON.stringify(scope.personalityData),
              };
            }
          }
          const params = {
            ...scope.form,
            applicationId: this.curAiAppId,
            ...pluginParams,
          };
          if (scope.flagEidtOrAdd === "add") {
            save(params).then((res) => {
              const data = res.data;
              if (data.success) {
                scope.$message.success(data.msg);
                scope.dialogVisible = false;
                scope.$emit("chilForm");
              } else {
                scope.$message.error(data.msg);
              }
            });
          } else {
            update(params).then((res) => {
              const data = res.data;
              if (data.success) {
                scope.$message.success(data.msg);
                scope.dialogVisible = false;
                scope.$emit("chilForm");
              } else {
                scope.$message.error(data.msg);
              }
            });
          }
        }
      });
    },
    cancel () {
      this.dialogVisible = false;
      this.form = {};
      this.requstData = [];
      this.personalityData = [];
    },
    closesClear () {
      this.cancel();
    },
    prentParentCtrView (data) {
      this.flagEidtOrAdd = "view";
      this.title = this.$t("aiCenter.variable.viewVariableWords")
      let arrFlug = [];
      if (data.requestParams) {
        arrFlug = JSON.parse(data.requestParams);
      }
      let personalityData = [];
      if (data.specialParameters && data.specialParameters !== "null") {
        personalityData = JSON.parse(data.specialParameters);
      }
      this.requstData = arrFlug;
      this.requestType = data.requestType;
      this.personalityData = personalityData;
      this.form = { ...this.form, ...data };
    },
    prentParentCtr (data) {
      this.flagEidtOrAdd = "edit";
      this.title = this.$t("aiCenter.variable.editVariableWords")
      let arrFlug = [];
      if (data.requestParams) {
        arrFlug = JSON.parse(data.requestParams);
      }
      let personalityData = [];
      if (data.specialParameters && data.specialParameters !== "null") {
        personalityData = JSON.parse(data.specialParameters);
      }
      this.requstData = arrFlug;
      this.requestType = data.requestType;
      this.personalityData = personalityData;
      this.form = { ...this.form, ...data };
    },
    preGetData (data) {
      this.requstData = data.requstData;
      this.personalityData = data.personalityData;
    },
    clearForm () {
      this.$refs["form"].resetFields();
    },
  },
};
</script>

<style scoped lang="scss">
.plugCrud {
  /deep/ .avue-crud__menu {
    min-height: 0;
  }
}

.returnPra {
  display: inline-block;
  margin-top: 20px;
  margin-bottom: 8px;
}
</style>
