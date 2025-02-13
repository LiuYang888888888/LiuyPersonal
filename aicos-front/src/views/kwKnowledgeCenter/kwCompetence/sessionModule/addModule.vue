<template>
  <div>
    <el-form
      ref="elForm"
      :model="formData"
      :rules="rules"
      size="medium"
      label-width="109px"
      :label-position="labelPosition"
    >
      <!-- 模块名称 -->
      <el-form-item :label="$t('kwCompetence.moduleName')" prop="moduleName">
        <el-input
          v-model="formData.moduleName"
          :placeholder="$t('kwCompetence.modelNameTips')"
          :maxlength="50"
          clearable
          :style="{ width: '100%' }"
        ></el-input>
      </el-form-item>
      <el-form-item :label="$t('kwCompetence.moduleUrl')" prop="moduleURL">
        <!-- 模块地址 -->
        <el-input
          v-model="formData.moduleURL"
          :placeholder="$t('kwCompetence.moduleUrlTips')"
          clearable
          :style="{ width: '100%' }"
        >
        </el-input>
      </el-form-item>
      <!-- 模块类型 -->
      <el-form-item :label="$t('kwCompetence.type')">
        <el-radio-group v-model="formData.moduleType" @input="changeRadioValue">
          <el-radio :label="1">{{ $t("kwCompetence.model") }}</el-radio>
          <el-radio :label="2">{{ $t("kwCompetence.SE") }}</el-radio>
          <el-radio :label="3">{{ $t("kwCompetence.other") }}</el-radio>
        </el-radio-group>
      </el-form-item>
      <!-- 模块来源 -->
      <el-form-item
        :label="$t('kwCompetence.moduleSource')"
        prop="moduleSource"
        v-if="formData.moduleType === 1 || formData.moduleType === 2"
      >
        <el-select v-model="formData.moduleSource">
          <el-option
            v-for="item in selectOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          >
          </el-option>
        </el-select>
      </el-form-item>
      <!-- 能力参数 -->
      <div class="capability_parameters" v-if="formData.moduleType === 1">
        <PlugCrud
          :personalityDisplay="false"
          title="能力参数"
          :requstData="requstData"
          @chilReData="preGetData"
          :hasInitialization="hasInitialization"
        ></PlugCrud>
      </div>
    </el-form>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import { saveOrUpdate } from "@/api/kwRobot/kwRobotTrain/index";
import { getDictionary } from "@/api/system/dict";
import PlugCrud from "@/components/plugCrud";
export default {
  components: { PlugCrud },
  props: {
    botId: {
      type: String,
      default: () => {
        return "";
      }
    },
    cur: {
      type: Object,
      default: () => {
        return {};
      }
    },
    isEdit: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      hasInitialization: 0,
      requstData: [],
      initialData: [
        {
          key: "enable_multi",
          type: "boolean",
          value: true,
          remark: "enable_multi",
          $index: 0
        },
        {
          key: "top_p",
          type: "decimal",
          value: 0.1,
          remark: "top_p",
          $index: 1
        },
        {
          key: "temperature",
          type: "decimal",
          value: 0.2,
          remark: "temperature",
          $index: 2
        },
        {
          key: "max_length",
          type: "integer",
          value: 2048,
          remark: "max_length",
          $index: 3
        }
      ],
      formData: {
        moduleName: "", //名称
        moduleURL: "", //模块地址
        isDetail: 0,
        moduleSource: "",
        moduleType: 3
      },
      editId: "",
      rules: {
        moduleName: [
          {
            required: true,
            message: this.$t("kwCompetence.modelNameTips"),
            trigger: "blur"
          }
        ],
        moduleURL: [
          {
            required: true,
            message: this.$t("kwCompetence.moduleUrlTips"),
            trigger: "blur"
          }
        ],
        // type: [
        //   {
        //     required: true,
        //     message: this.$t("kwCompetence.typePlaceHolder"),
        //     trigger: "blur",
        //   },
        // ],
        moduleSource: [
          {
            required: true,
            message: this.$t("kwCompetence.moduleSourcePlaceholder"),
            trigger: "blur"
          }
        ]
      },
      selectOptions: [],
      seData: [],
      gptData: []
    };
  },
  computed: {
    // 计算属性
    ...mapGetters(["language"]),
    labelPosition() {
      return this.language != "zh" ? "top" : "right";
    }
  },
  async mounted() {
    const data = this.cur;
    if (this.isEdit) {
      this.formData.moduleName = data.name;
      this.formData.moduleURL = data.address;
      this.formData.moduleType = data.moduleType;
      this.formData.moduleSource = data.moduleSource;
      this.formData.jsonValue = data.jsonValue;
      this.editId = data.id;
      if (
        this.formData.jsonValue != null &&
        this.formData.jsonValue != undefined
      ) {
        this.requstData = JSON.parse(this.formData.jsonValue);
      } else {
        this.requstData = [];
      }
    } else {
      this.formData = {
        moduleName: "", //名称
        moduleURL: "", //模块地址
        isDetail: 0,
        moduleSource: "",
        moduleType: 3
      };
    }
    await getDictionary({ code: "session_module_model" }).then(res => {
      if (res.data.code == 200) {
        this.gptData = res.data.data;
      }
    });
    await getDictionary({ code: "session_module_SE" }).then(res => {
      if (res.data.code == 200) {
        this.seData = res.data.data;
      }
    });
    if (this.formData.moduleType === 1) {
      this.selectOptions = this.gptData;
    } else if (this.formData.moduleType === 2) {
      this.selectOptions = this.seData;
    } else {
      this.selectOptions = [];
    }
  },
  watch: {
    "formData.moduleSource": {
      handler: function(newV) {
        let jsonValue;
        if (
          this.formData.jsonValue != null &&
          this.formData.jsonValue != undefined
        ) {
          jsonValue = JSON.parse(this.formData.jsonValue);
        } else {
          jsonValue = [];
        }
        if (newV) {
          if (this.isEdit) {
            if (newV == "HuilanGPT") {
              this.hasInitialization = 4;
              if (jsonValue.length == 0) {
                this.requstData = this.initialData;
              } else {
                this.requstData = jsonValue;
              }
            }
          } else {
            if (newV == "HuilanGPT") {
              this.requstData = this.initialData;
              this.hasInitialization = 4;
            }
          }
        }
      },
      immediate: true
    }
  },
  methods: {
    changeRadioValue(val) {
      this.formData.moduleSource = "";
      if (val === 1) {
        this.selectOptions = this.gptData;
      } else if (val === 2) {
        this.selectOptions = this.seData;
        this.requstData = [];
        this.hasInitialization = 0;
      } else {
        this.selectOptions = [];
        this.requstData = [];
        this.hasInitialization = 0;
      }
    },
    saveOrUpdate() {
      this.$refs.elForm.validate(async valid => {
        if (!valid) {
          return;
        } else {
          let jsonValue = {};
          if (this.requstData.length > 0) {
            jsonValue = { jsonValue: JSON.stringify(this.requstData) };
          } else {
            jsonValue = { jsonValue: "[]" };
          }
          const info = {
            botId: this.botId,
            address: this.formData.moduleURL, //模块地址
            name: this.formData.moduleName,
            moduleType: this.formData.moduleType,
            moduleSource: this.formData.moduleSource,
            ...jsonValue
          };
          if (this.cur.id) {
            info.id = this.editId;
          }
          const result = await saveOrUpdate(info);
          if (result.data.code == 200) {
            this.$message({
              type: "success",
              message: this.$t("aicosCommon.successOperate")
            });
            this.$emit("successSave");
          }
        }
      });
    },
    preGetData(data) {
      this.requstData = data.requstData;
    }
  }
};
</script>
<style scoped lang="scss">
.capability_parameters {
  /deep/ .avue-crud__menu {
    display: flex;
  }
}
</style>
