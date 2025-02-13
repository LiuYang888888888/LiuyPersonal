<template>
  <div>
    <el-form :model="dynamicValidateForm" ref="dynamicValidateForm" class="demo-dynamic">
      <el-form-item class="item">
        <el-input
          type="text"
          @keyup.native.enter="handlerKeyUp"
          v-model="dynamicValidateForm.text"
          :placeholder="$t('kwIntentionManage.addTips')"
          :style="{ width: '45%' }"
        ></el-input>
        <!-- 添加 -->
        <el-button class="kw-primary-button" @click="addDomain">{{
          $t("kwIntentionManage.addBtnName")
        }}</el-button>
        <!-- 推荐问法 -->
        <!-- <el-button class="kw-primary-button" @click="handlerRecommend">{{
          $t("kwIntentionManage.recommendBtnName")
        }}</el-button> -->
        <i
          class="el-icon-warning-outline tips"
          @mouseenter="handlerEnter"
          @mouseleave="handlerLeave"
        ></i>
      </el-form-item>
      <div
        v-show="tipsFlag"
        class="tipsTitle"
        style="position: absolute; top: 3px; left: 460px"
      >{{ $t('kwIntentionManage.ruleTips') }}
      </div>
      <div class="itemContainer">
        <el-form-item
          v-for="(domain, index) in dynamicValidateForm.domainArr"
          :key="index"
        >
          <el-input v-model="domain.value" :style="{ width: '70%' }"></el-input>
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
        value: item.value,
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

    handlerEnter() {
      this.tipsFlag = true;
    },
    handlerLeave() {
      this.tipsFlag = false;
    },
    //添加
    addDomain() {
      // 请输入常用问法
      debugger;
      if (this.dynamicValidateForm.text.replace(/\r|\n|\s/g, "") == "") {
        this.$message({
          type: "warning",
          message: this.$t("kwIntentionManage.needInputCommandMethod"),
        });
        return;
      }
      this.dynamicValidateForm.domainArr.push({
        value: this.dynamicValidateForm.text,
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
        if (!map.has(item.value)) {
          map.set(item.value, item);
        }
      }
      arr = [...map.values()];

      if (arr.length !== this.dynamicValidateForm.domainArr.length) {
        this.$message({
          type: "warning",
          message: this.$t("kwIntentionManage.hasRepeatCommandMethod"),
        });
        this.closeFlag = false;
        return;
      } else {
        this.closeFlag = true;
      }
      this.$emit("saveCommonMethod", {
        data: this.dynamicValidateForm.domainArr,
        flag: this.closeFlag,
      });
    },
  },
};
</script>

<style lang="scss" scoped>
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
}
.itemContainer {
  max-height: 350px;
  overflow: auto;
}
</style>
