<template>
  <div class="resultcommon">
    <div class="checkbox">
      <el-checkbox :label="item.id" @change="checkChange"></el-checkbox>
    </div>
    <div style="width: 100%">
      <div class="question">
        <div style="width: calc(100% - 50px)">
          <i
            class="el-icon-connection"
            style="color: #409eff; margin-right: 8px"
          ></i>
          <span>{{ question }}</span>
        </div>
        <div>
          <el-button
            class="el-icon-edit-outline"
            type="text"
            @click="editClick(item)"
          ></el-button>
          <el-button
            class="el-icon-delete"
            type="text"
            style="color: red"
            @click="delClick(item)"
          ></el-button>
        </div>
      </div>
      <div class="answer" v-html="answer">
        <!-- {{ answer }} -->
      </div>
    </div>
  </div>
</template>
<script>
export default {
  props: {
    item: {
      type: Object,
      default: () => {
        return {};
      },
    },
    question: {
      type: String,
      default: "",
    },
    answer: {
      type: String,
      default: "",
    },
  },
  data() {
    return {
      checked: "",
    };
  },
  methods: {
    editClick(item) {
      item.type = "edit";
      this.$emit("handle", item);
    },
    delClick(item) {
      item.type = "del";
      this.$emit("handle", item);
    },
  },
};
</script>
<style lang="scss">
.resultcommon {
  display: flex;
  align-items: center;
  background-color: #f2f6fc;
  padding: 20px;
  .checkbox {
    margin-right: 10px;
  }
  .question {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  .answer {
    font-size: 14px;
    color: #999;
  }
  .el-checkbox__label {
    display: none;
  }
}
</style>
