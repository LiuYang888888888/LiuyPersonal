<template>
  <div>
    <el-form
      :model="dynamicValidateForm"
      ref="dynamicValidateForm"
      class="demo-dynamic"
      @submit.native.prevent
    >
      <el-form-item class="item">
        <el-input
          type="text"
          size="small"
          @keyup.enter.native="handlerKeyUp"
          v-model="dynamicValidateForm.text"
          :placeholder="$t('kwIntentionManage.addTips')"
          :style="{ width: '55%' }"
        ></el-input>
        <!-- 添加 -->
        <el-button class="kw-primary-button kw-btn-blue" @click="addDomain">{{
          $t("kwIntentionManage.addBtnName")
        }}</el-button>
        <!-- 推荐问法 -->
        <!-- <el-button class="kw-primary-button" @click="handlerRecommend">{{
          $t("kwIntentionManage.recommendBtnName")
        }}</el-button> -->
        <el-tooltip
          class="item"
          effect="dark"
          :content="$t('kwIntentionManage.ruleTips')"
          placement="top"
        >
          <i class="el-icon-warning-outline tips"></i>
        </el-tooltip>
      </el-form-item>
      <div class="itemContainer">
        <el-form-item
          v-for="(domain, index) in dynamicValidateForm.domainArr"
          :key="index"
        >
          <div class="input-wrap">
            <el-input
              size="small"
              v-model="domain.intentQuestion"
              :style="{ width: '100%' }"
            ></el-input>
          </div>
          <i class="el-icon-delete deleteFlag" @click="removeDomain(domain)"></i>
        </el-form-item>
      </div>
    </el-form>

    <!-- 智能推荐 -->
    <!-- <HuilanDialog
      :title="$t('kwIntentionManage.recommendBtnName')"
      append-to-body
      :visible.sync="recommendFlag"
      width="650px"
    >
      <RecommendMethod />
      <template v-slot:footer>
        <el-button size="small" @click="recommendFlag = false">{{
          $t("aicosCommon.cancelBtn")
        }}</el-button>
        <el-button size="small" type="primary" @click="saveExpand">{{
          $t("aicosCommon.saveBtn")
        }}</el-button>
      </template>
    </HuilanDialog> -->
  </div>
</template>

<script>
// import RecommendMethod from "@/components/kwRecommendMethod/index";
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
    this.copyScreenList = new Array();
    this.domainArr.forEach((item) => {
      let info = {
        intentQuestion: item.intentQuestion,
      };
      this.copyScreenList.push(info);
    });
    this.dynamicValidateForm.domainArr = this.copyScreenList;
  },
  data() {
    return {
      recommendFlag: false,
      copyScreenList: "",
      tipsFlag: false,
      dynamicValidateForm: {
        text: "",
        domainArr: [],
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
      // 请输入常用问法
      // eslint-disable-next-line no-useless-escape
      let emptyFlag = "";
      // reg = /^[A-Za-z0-9\u4E00-\u9FA5\,\.\?\u3002\uff1f\uff0c\s\u3001\uff1b\uff01]+$/;
      if (this.dynamicValidateForm.text.replace(/\r|\n/g, "") == "") {
        this.$message({
          type: "warning",
          message: this.$t("kwIntentionManage.needInputCommandMethod"),
        });
        return;
      }
      // if (!reg.test(this.dynamicValidateForm.text)) {
      //   this.$message({
      //     type: "warning",
      //     message: this.$t("kwIntentionManage.needInputCommandMethodRegx"),
      //   });
      //   return;
      // }
      emptyFlag = this.dynamicValidateForm.domainArr.some((item) => {
        return (
          item.intentQuestion == this.dynamicValidateForm.text.replace(/\r|\n/g, "")
        );
      });
      if (emptyFlag) {
        this.$message({
          type: "warning",
          message: this.$t("kwIntentionManage.hasRepeatCommandMethod"),
        });
        return;
      }
      this.dynamicValidateForm.domainArr.push({
        intentQuestion: this.dynamicValidateForm.text,
      });
      this.dynamicValidateForm.text = "";
    },
    //点回车
    handlerKeyUp() {
      this.addDomain();
    },
    //移除
    removeDomain(item) {
      var index = this.dynamicValidateForm.domainArr.indexOf(item);
      if (index != -1) {
        this.dynamicValidateForm.domainArr.splice(index, 1);
      }
    },
    //保存常用问法
    submitExpand() {
      //常用问法存在重复
      var map = new Map();
      var arr = [];

      for (let item of this.dynamicValidateForm.domainArr) {
        if (!map.has(item.intentQuestion)) {
          map.set(item.intentQuestion, item);
        }
      }
      arr = [...map.values()];

      if (arr.length !== this.dynamicValidateForm.domainArr.length) {
        this.closeFlag = false;
        this.$message({
          type: "warning",
          message: this.$t("kwIntentionManage.hasRepeatCommandMethod"),
        });
        return;
      } else {
        this.closeFlag = true;
      }
      const isEmpty = this.dynamicValidateForm.domainArr.some((item) => {
        return item.intentQuestion == "";
      });
      if (isEmpty) {
        this.$message({
          type: "warning",
          message: this.$t("kwIntentionManage.commandMethodIsNoEmpty"),
        });
        return;
      } else {
        this.$emit("saveCommonMethod", {
          data: this.dynamicValidateForm.domainArr,
          flag: this.closeFlag,
        });
      }
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
