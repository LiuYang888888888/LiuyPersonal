<template>
  <div>
    <el-tabs v-model="activeName" @tab-click="handleClick">
      <el-tab-pane label="过滤问法" name="first">
        <el-form
          :model="dynamicValidateForm"
          ref="dynamicValidateForm"
          class="demo-dynamic"
        >
          <el-form-item class="item">
            <el-input
              type="text"
              size="small"
              @keyup.enter.native="handlerKeyUp"
              v-model="dynamicValidateForm.text"
              :placeholder="'请输入过滤问法'"
              :style="{ width: '55%' }"
            ></el-input>
            <!-- 添加 -->
            <el-button
              class="kw-primary-button kw-btn-blue"
              @click="addDomain"
              >{{ $t("kwIntentionManage.addBtnName") }}</el-button
            >
          </el-form-item>
          <div class="itemContainer">
            <el-form-item
              v-for="(domain, index) in dynamicValidateForm.negativeSentences"
              :key="index"
            >
              <div class="input-wrap">
                <el-input
                  size="small"
                  v-model="domain.intentQuestion"
                  :style="{ width: '100%' }"
                ></el-input>
              </div>
              <i
                class="el-icon-delete deleteFlag"
                @click="removeDomain(domain)"
              ></i>
            </el-form-item>
          </div>
        </el-form>
      </el-tab-pane>
      <el-tab-pane label="过滤正则表达式" name="second">
        <el-form
          :model="regexpsForm"
          ref="dynamicValidateForm"
          class="demo-dynamic"
        >
          <el-form-item class="item">
            <el-input
              type="text"
              size="small"
              @keyup.enter.native="handlerKeyUp"
              v-model="regexpsForm.text"
              :placeholder="'请输入过滤正则表达式'"
              :style="{ width: '55%' }"
            ></el-input>
            <!-- 添加 -->
            <el-button
              class="kw-primary-button kw-btn-blue"
              @click="addDomain"
              >{{ $t("kwIntentionManage.addBtnName") }}</el-button
            >
          </el-form-item>
          <div class="itemContainer">
            <el-form-item
              v-for="(domain, index) in regexpsForm.negativeRegexps"
              :key="index"
            >
              <div class="input-wrap">
                <el-input
                  size="small"
                  v-model="domain.intentQuestion"
                  :style="{ width: '100%' }"
                ></el-input>
              </div>
              <i
                class="el-icon-delete deleteFlag"
                @click="removeDomain(domain)"
              ></i>
            </el-form-item>
          </div>
        </el-form>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
export default {
  props: {
    domainArr: {
      type: Array,
      default() {
        return [];
      },
    },
  },
  components: {
    // RecommendMethod,
  },
  mounted() {
    // console.log(this.domainArr);
    this.dynamicValidateForm.negativeSentences = this.domainArr.negativeSentences
    this.regexpsForm.negativeRegexps = this.domainArr.negativeRegexps
  },
  data() {
    return {
      activeName: "first",
      recommendFlag: false,
      copyScreenList: "",
      tipsFlag: false,
      dynamicValidateForm: {
        text: "",
        negativeSentences: [],
      },
      regexpsForm: {
        text: "",
        negativeRegexps: [],
      },
      methodArr: [],
      closeFlag: false,
    };
  },
  methods: {
    //点击推荐问法
    handlerRecommend() {
      this.recommendFlag = true;
    },

    //添加
    addDomain() {
      if (this.activeName === "first") {
        // 请输入常用问法
        if (this.dynamicValidateForm.text.replace(/\r|\n|\s/g, "") == "") {
          this.$message({
            type: "warning",
            message: "请输入过滤问法",
          });
          return;
        }
        this.dynamicValidateForm.negativeSentences.push({
          intentQuestion: this.dynamicValidateForm.text,
        });
        this.dynamicValidateForm.text = "";
      } else {
        // 请输入常用问法
        if (this.regexpsForm.text.replace(/\r|\n|\s/g, "") == "") {
          this.$message({
            type: "warning",
            message: "请输入过滤正则表达式",
          });
          return;
        }
        this.regexpsForm.negativeRegexps.push({
          intentQuestion: this.regexpsForm.text,
        });
        this.regexpsForm.text = "";
      }
    },
    //点回车
    handlerKeyUp() {
      this.addDomain();
    },
    //移除
    removeDomain(item) {
      if (this.activeName === "first") {
        let index = this.dynamicValidateForm.negativeSentences.indexOf(item);
        if (index != -1) {
          this.dynamicValidateForm.negativeSentences.splice(index, 1);
        }
      } else {
        let index = this.regexpsForm.negativeRegexps.indexOf(item);
        if (index != -1) {
          this.regexpsForm.negativeRegexps.splice(index, 1);
        }
      }
    },
    //保存常用问法
    submitExpand() {
      //常用问法存在重复
      // let map = new Map();
      // let arr = [];

      // for (let item of this.dynamicValidateForm.negativeSentences) {
      //   if (!map.has(item.intentQuestion)) {
      //     map.set(item.intentQuestion, item);
      //   }
      // }
      // arr = [...map.values()];

      // if (arr.length !== this.dynamicValidateForm.negativeSentences.length) {
      //   this.$message({
      //     type: "warning",
      //     message: "拒识话术存在重复",
      //   });
      //   this.closeFlag = false;
      //   this.$emit("saveCommonMethod", {
      //     data: [],
      //     flag: this.closeFlag,
      //   });
      //   return false;
      // }
      // console.log(this.regexpsForm);
      let negativeSentences = [],
        negativeRegexps = [];
      this.closeFlag = true;
      if (this.dynamicValidateForm.negativeSentences.length > 0) {
        this.dynamicValidateForm.negativeSentences.forEach((item) => {
          negativeSentences.push(item.intentQuestion);
        });
      }
      if (this.regexpsForm.negativeRegexps.length > 0) {
        this.regexpsForm.negativeRegexps.forEach((item) => {
          negativeRegexps.push(item.intentQuestion);
        });
      }
      this.dynamicValidateForm.negativeSentences;
      this.$emit("saveCommonMethod", {
        data: {
          negativeSentences: negativeSentences,
          negativeRegexps: negativeRegexps,
        },
        flag: this.closeFlag,
      });
    },
  },
};
</script>

<style lang="scss" scoped>
.itemContainer {
  /deep/ .el-form-item__content {
    padding-right: 30px;
  }
}
.tips {
  margin-left: 10px;
  font-size: 16px;
  cursor: pointer;
}
.tipsTitle {
  border: 1px solid #333;
}
.deleteFlag {
  margin-left: 10px;
  font-size: 16px;
  color: red;
  cursor: pointer;
  position: absolute;
  right: 5px;
  top: 10px;
}
.itemContainer {
  max-height: 350px;
  overflow: auto;
}
</style>
