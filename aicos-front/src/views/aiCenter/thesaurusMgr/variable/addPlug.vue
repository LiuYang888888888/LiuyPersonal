<template>
  <HuilanDialog :title="$t('aiCenter.variable.addPlugin')" append-to-body :visible.sync="dialogVisible" width="800px">
    <el-form ref="form" :model="baseForm" size="mini" :label-position="labelPosition" label-width="120px" :rules="rules">
      <el-form-item :label="$t('aiCenter.variable.pluginName')" prop="pluginName">
        <el-input size="small" v-model="baseForm.pluginName"
          :placeholder="$t('aicosCommon.pleaseInput') + $t('aiCenter.variable.pluginName')" :maxlength="50"></el-input>
      </el-form-item>
      <el-form-item :label="$t('aiCenter.variable.callMethod')" label-width="120px" prop="requestType">
        <el-select size="small" v-model="baseForm.requestType"
          :placeholder="$t('aicosCommon.pleaseSelect') + $t('aiCenter.variable.callMethod')" default-first-option="true"
          style="width: 100%" @change="requestTypeChange">
          <el-option :label="item.name" :value="item.code" v-for="item of requestTypeArr" :key="item.id"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item v-if="flagCode === 'http'" label-width="120px" :label="$t('aiCenter.variable.requestMethod')"
        prop="requestMethod">
        <el-select size="small" v-model="baseForm.requestMethod"
          :placeholder="$t('aicosCommon.pleaseSelect') + $t('aiCenter.variable.requestMethod')"
          default-first-option="true" style="width: 100%">
          <el-option :label="item.name" :value="item.code" v-for="item of requestMethodArr" :key="item.id"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item v-if="flagCode === 'http'" label-width="120px" :label="$t('aiCenter.variable.interfaceAddress')"
        prop="pluginUrl">
        <el-input size="small" v-model="baseForm.pluginUrl"
          :placeholder="$t('aicosCommon.pleaseInput') + $t('aiCenter.variable.interfaceAddress')"
          :maxlength="200"></el-input>
      </el-form-item>
      <el-form-item :label="$t('aiCenter.variable.requestParameters')" label-width="120px" v-if="flagCode !== 'http'"
        prop="" class="">
        <el-input size="small" v-model="baseForm.requestContenttype"
          :placeholder="$t('aicosCommon.pleaseInput') + $t('aiCenter.variable.requestParameters')"
          :maxlength="50"></el-input>
      </el-form-item>
      <PlugCrud v-if="flagCode === 'http'" class="plugCrud" :personalityDisplay="false" @chilReData="preGetData"
        :requstData="optionRequstData"></PlugCrud>
      <el-form-item v-if="flagCode === 'http'" label-width="120px" :label="$t('aiCenter.variable.returnParameters')"
        prop="" class="returnParItem">
        <el-input size="small" v-model="baseForm.returnParams"
          :placeholder="$t('aicosCommon.pleaseInput') + $t('aiCenter.variable.returnParameters')"></el-input>
      </el-form-item>
      <el-form-item class="menuR">
        <el-button type="primary" @click="onSubmit">{{ $t('aicosCommon.confirmBtn') }}</el-button>
        <el-button @click="cancel">{{ $t('aicosCommon.cancelBtn') }}</el-button>
      </el-form-item>
    </el-form>
  </HuilanDialog>
</template>

<script>
import { mapGetters } from "vuex"
import PlugCrud from "@/components/plugCrud";
import {
  addEntityInstance,
  /*updateEntityInstance,*/
  requestTypeList,
} from "@/api/aiCenter/thesaurusMgr/plug";
export default {
  name: "addPlug",
  components: { PlugCrud },
  props: {
    applicationId: {
      type: String,
    },
  },
  computed: {
    ...mapGetters(["permission", 'language']),
    labelPosition () {
      console.log('this.language', this.language)
      return this.language != 'zh' ? 'top' : 'right'
    }
  },

  watch: {
  },
  data () {
    return {
      baseForm: {
        pluginName: null,
        requestType: null,
        requestMethod: null,
        pluginUrl: null,
        script: undefined,
        pluginParams: undefined,
        pluginClass: undefined,
        returnParams: "",
        requestContenttype: undefined,
        pluginGroupId: null,
      },
      requestTypeArr: [],
      requestMethodArr: [],
      dialogVisible: false,
      optionRequstData: [],
      rules: {
        pluginName: [
          { required: true, message: this.$t("aicosCommon.pleaseInput") + this.$t('aiCenter.variable.pluginName'), trigger: 'blur' },
          {
            min: 1,
            max: 50,
            message: this.$t("aiCenter.variable.fiveLengthTip"),
            trigger: 'blur',
          },
          // eslint-disable-next-line
          { pattern: /^[A-Za-z0-9\u4E00-\u9FA5]+$/, message: this.$t('aiCenter.variable.onlyRuleTip') },
        ],
        requestType: [
          { required: true, message: this.$t("aicosCommon.pleaseInput") + this.$t('aiCenter.variable.callMethod'), trigger: 'blur' },
        ],
        requestMethod: [
          { required: true, message: this.$t("aicosCommon.pleaseSelect") + this.$t('aiCenter.variable.requestMethod'), trigger: 'blur' }
        ],
        pluginUrl: [
          { required: true, message: this.$t("aicosCommon.pleaseInput") + this.$t('aiCenter.variable.interfaceAddress'), trigger: 'blur' },
          {
            min: 1,
            max: 200,
            message: this.$t('aiCenter.variable.twoLengthTip'),
            trigger: 'blur',
          },
          // eslint-disable-next-line
          { pattern: /^[A-Za-z0-9\u4E00-\u9FA5\,\.\/\[\]\;\'\\\-\=\_\+\{\}\<\>\?\:]+$/, message: this.$t('aiCenter.variable.onlyRuleTip') },
        ],
      }
    };
  },
  mounted () {
    const scope = this;
    requestTypeList({ code: "system-plug-requestMethod" }).then((res) => {
      const data = res.data;
      if (data.success) {
        this.requestMethodArr = data.data;
        setTimeout(() => {
          scope.baseForm.requestMethod = data.data[0].code;
        }, 500);
      }
    });
    requestTypeList({ code: "system-plug-requestType" }).then((res) => {
      const data = res.data;
      if (data.success) {
        this.requestTypeArr = data.data;
        scope.baseForm.requestType = data.data[0].code;
      }
    });
  },
  methods: {
    requestTypeChange (data) {
      if (data === "http") {
        this.flagCode = "http";
      } else {
        this.flagCode = "script";
      }
    },
    onSubmit () {
      const scope = this;
      scope.$refs["form"].validate((valid) => {
        if (valid) {
          if (!scope.baseForm.pluginGroupId) {
            return;
          }
          const params = {
            ...scope.baseForm,
            pluginParams: JSON.stringify(this.optionRequstData)
          }
          addEntityInstance(params).then((res) => {
            const data = res.data;
            if (data.success) {
              scope.$message.success(this.$t("aicosCommon.saveSuccessTip"));
              scope.closes();
              scope.$emit("chilPlug");
              this.dialogVisible = false;
            }
          });
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    closes () {
      this.baseForm = {};
      this.optionRequstData = [];
      this.optionRebonseData = [];
    },
    cancel () {
      this.closes();
      this.dialogVisible = false;
    },
    preGetData (data) {
      this.optionRequstData = data.requstData;
    },
  },
};
</script>

<style lang="scss" scoped>
.entityInstance {
  /deep/ .avue-crud__menu {
    min-height: 0;
  }

  .menuR {
    /deep/ .el-form-item__content {
      text-align: right;
      margin-top: 40px;
    }
  }
}

.menuR {
  text-align: right;
  margin-top: 40px;
}

.returnParItem {
  margin-top: 20px;
}
</style>
