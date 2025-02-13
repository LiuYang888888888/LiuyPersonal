<template>
  <el-drawer
    :title="title"
    append-to-body
    :visible.sync="dialogVisible"
    custom-class="huilan-drawer-form"
    size="800px"
  >
    <el-form
      ref="form"
      style="padding: 30px"
      :model="form"
      label-width="150px"
      size="mini"
      :rules="rules">
      <el-form-item
        label="厂商来源："
        prop="cloudvendorId"
        :rules="[{ required: true, message: '请选择厂商来源' }]"
      >
        <el-select
          v-model="form.cloudvendorId"
          placeholder="请选择厂商来源"
          style="width: 100%"
          :disabled="title === '编辑能力'"
        >
          <el-option
            :label="v.name"
            :value="v.id"
            v-for="v of dictArr"
            :key="v.id"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item
        label="能力名称："
        prop="name"
        :rules="[
          { required: true, message: '请输入能力名称' },
          {
            min: 1,
            max: 50,
            trigger: 'blur',
            message: '请输入1至50区间字符长度',
          },
        ]"
      >
        <el-input v-model="form.name"></el-input>
      </el-form-item>
      <el-form-item
        label="能力标识："
        prop="code"
        :rules="[
          { required: true, message: '请输入能力标识' },
          {
            min: 1,
            max: 50,
            trigger: 'blur',
            message: '请输入1至50区间字符长度',
          },
          { pattern: /^[A-Za-z0-9]+$/, message: '只能输入英文和数字' },
        ]"
      >
        <el-input
          v-model="form.code"
          :disabled="title === '编辑能力'"
        ></el-input>
      </el-form-item>
      <!-- <el-form-item label="调用地址：" prop="runUrl">
        <el-input v-model="form.runUrl"></el-input>
      </el-form-item> -->
      <el-form-item
        label="接口说明："
        prop="docUrl"
        :rules="[
          {
            min: 1,
            max: 100,
            trigger: 'blur',
            message: '请输入1至100区间字符长度',
          },
        ]"
      >
        <el-input v-model="form.docUrl"></el-input>
      </el-form-item>
      <el-form-item
        label="体验参数："
        prop="testUrl"
        :rules="[
          {
            min: 1,
            max: 100,
            trigger: 'blur',
            message: '请输入1至100区间字符长度',
          },
        ]"
      >
        <el-input v-model="form.testUrl"></el-input>
      </el-form-item>
      <PlugCrud
        :personalityDisplay="false"
        title="能力参数"
        :requstData="requstData"
        @chilReData="preGetData"
      ></PlugCrud>

      <el-form-item label="是否支持模型训练：" prop="isTrain">
        <el-radio-group v-model="form.isTrain">
          <el-radio label="1">是</el-radio>
          <el-radio label="0">否</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="描述：" prop="description">
        <el-tag
          :key="tag"
          style="margin-bottom: 10px; margin-right: 10px; margin-left: 0"
          v-for="tag in dynamicTags"
          closable
          :disable-transitions="false"
          @close="handleClose(tag)"
        >
          {{ tag }}
        </el-tag>
        <el-input
          class="input-new-tag"
          v-if="inputVisible"
          v-model="inputValue"
          ref="saveTagInput"
          size="small"
          @keyup.enter.native="handleInputConfirm"
          @blur="handleInputConfirm"
        >
        </el-input>
        <el-button v-else class="button-new-tag" size="small" @click="showInput"
          >+ 新增</el-button
        >
      </el-form-item>
      <el-form-item style="text-align: right; margin-top: 40px">
        <el-button type="primary" @click="submitForm('form')">保存</el-button>
        <el-button @click="resetForm('form')">取消</el-button>
      </el-form-item>
    </el-form>
  </el-drawer>
</template>

<script>
// import {mapGetters} from "vuex";
import { aiAbilitySave, abilityUpdate } from "@/api/configure/application";
import { getAllCloudvendorList } from "@/api/system/vendor";
import PlugCrud from "@/components/plugCrud";
export default {
  name: "addForm",
  components: {
    PlugCrud,
  },
  props: {
    category1: {
      type: String,
      default: "",
    },
  },
  data() {
    return {
      requstData: [],
      title: "添加能力",
      dictArr: [],
      form: {
        category1: null,
        name: null,
        runUrl: null,
        docUrl: null,
        testUrl: null,
        jsonValue: null,
        code: null,
        isTrain: "0",
        description: null,
      },
      dialogVisible: false,
      dynamicTags: [],
      inputVisible: false,
      inputValue: "",
    };
  },
  computed: {},
  created() {
    getAllCloudvendorList({}).then((res) => {
      const data = res.data;
      if (data.success) {
        this.dictArr = data.data;
      }
    });
  },
  methods: {
    submitForm(form) {
      const scope = this;
      scope.$refs[form].validate((valid) => {
        if (valid) {
          let jsonValue = {};
          if (scope.requstData.length > 0) {
            jsonValue = { jsonValue: JSON.stringify(scope.requstData) };
          }
          const params = {
            ...scope.form,
            ...jsonValue,
            description: scope.dynamicTags.join(),
            category1: scope.category1,
          };
          if (scope.title === "添加能力") {
            aiAbilitySave(params).then((res) => {
              console.log(res);
              scope.$message({
                type: "success",
                message: "操作成功!",
              });
              scope.dialogVisible = false;
              scope.chilPageList();
            });
          } else {
            abilityUpdate(params).then(
              () => {
                scope.$message({
                  type: "success",
                  message: "操作成功!",
                });
                scope.dialogVisible = false;
                scope.chilPageList();
              },
              (error) => {
                window.console.log(error);
              }
            );
          }
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    resetForm(form) {
      this.$refs[form].resetFields();
      this.requstData = [];
      this.dynamicTags = [];
      this.dialogVisible = false;
    },
    prentResetForm(form) {
      this.form = {
        category1: null,
        name: null,
        runUrl: null,
        docUrl: null,
        testUrl: null,
        jsonValue: null,
        code: null,
        isTrain: "0",
      };
      this.$refs[form].resetFields();
      this.requstData = [];
      this.dynamicTags = [];
    },
    preGetData(data) {
      this.requstData = data.requstData;
    },
    chilPageList() {
      this.$emit("prePageList");
    },
    handleClose(tag) {
      this.dynamicTags.splice(this.dynamicTags.indexOf(tag), 1);
    },

    showInput() {
      this.inputVisible = true;
      this.$nextTick(() => {
        this.$refs.saveTagInput.$refs.input.focus();
      });
    },
    handleInputConfirm() {
      let inputValue = this.inputValue;
      if (inputValue) {
        this.dynamicTags.push(inputValue);
      }
      this.inputVisible = false;
      this.inputValue = "";
    },
  },
};
</script>

<style scoped lang="scss">
/deep/ .el-dialog {
  margin-top: 6vh !important;
}
.el-tag + .el-tag {
  margin-left: 10px;
}
.button-new-tag {
  margin-left: 10px;
  height: 32px;
  line-height: 30px;
  padding-top: 0;
  padding-bottom: 0;
}
.input-new-tag {
  width: 90px;
  margin-left: 10px;
  // vertical-align: bottom;
}
</style>
