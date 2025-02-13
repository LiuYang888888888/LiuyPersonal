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
  </div>
</template>

<script>
export default {
  props: {
    regularArr: {
      type: Array,
      default() {
        return [];
      },
    },
  },
  mounted() {
    this.copyScreenList = new Array();
    this.regularArr.forEach((item) => {
      let info = {
        intentQuestion: item.intentQuestion,
      };
      this.copyScreenList.push(info);
    });
    this.dynamicValidateForm.domainArr = this.copyScreenList;
  },
  data() {
    return {
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
    handlerEnter() {
      this.tipsFlag = true;
    },
    handlerLeave() {
      this.tipsFlag = false;
    },
    //添加
    addDomain() {
      // 请输入常用问法
      var emptyFlag = "";
      if (this.dynamicValidateForm.text.replace(/\r|\n|\s/g, "") == "") {
        this.$message({
          type: "warning",
          message: this.$t("kwIntentionManage.needInputRegular"),
        });
        return;
      }
      emptyFlag = this.dynamicValidateForm.domainArr.some((item) => {
        return (
          item.intentQuestion == this.dynamicValidateForm.text.replace(/\r|\n|\s/g, "")
        );
      });
      if (emptyFlag) {
        this.$message({
          type: "warning",
          message: this.$t("kwIntentionManage.hasRepeatRegular"),
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
        this.$message({
          type: "warning",
          message: this.$t("kwIntentionManage.hasRepeatRegular"),
        });
        this.closeFlag = false;
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
          message: this.$t("kwIntentionManage.regularIsNoEmpty"),
        });
        return;
      } else {
        this.$emit("saveRegular", {
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
