<template>
  <div class="addForm">
    <el-row>
      <el-col span="24">
        <avue-crud ref="form" :data="requstData" :option="option" :page="page" @row-save="requstRowSave"
          @row-update="rowUpdate" @row-del="requstRowDel">
        </avue-crud>
      </el-col>
    </el-row>
  </div>
</template>

<script>
// import serviceList from "@/config/serviceList";
// const { system } = serviceList;
export default {
  name: "dynamicTab",
  components: {},
  props: {
    requstData: {
      type: Array,
      default() {
        return []
      },
    },
    addBtn: {
      type: Boolean,
      default: true,
    },
    editBtn: {
      type: Boolean,
      default: true,
    },
    delBtn: {
      type: Boolean,
      default: true,
    },
    column: {
      type: Array,
      default() {
        return []
      },
    },
    title: {
      type: String,
      default: '',
    },
  },
  watch: {},
  data() {
    // const self = this;
    return {
      dynamicValidateForm: {
        key: null,
        type: null,
        value: [""],
        title: null,
        addVisible: false,
        selectType: "string",
        editRow: null,
      },
      requstFlag: {
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
        title: '标签词及其权重',
        tip: false,
        border: true,
        index: false,
        viewBtn: false,
        columnBtn: false,
        dialogClickModal: false,
        dialogWidth: "30%",
        addBtn: false,
        refreshBtn: false,
        searchShow: false,
        editBtn: false,
        delBtn: false,
        menuWidth: 150,
        column: [],
      },
    };
  },
  mounted() {
    if (this.addBtn) {
      this.option.addBtn = this.addBtn;
    }
    if (this.editBtn) {
      this.option.editBtn = this.editBtn;
    }
    if (this.delBtn) {
      this.option.delBtn = this.delBtn;
    }
    // if (this.column) {
    //   this.option.column = this.column;
    // }
    if (this.title) {
      this.option.title = this.title;
    }
  },
  methods: {
    requstRowDel(row, index) { // eslint-disable-line
      const self = this;
      const len = self.requstData.length;
      let arr = [];
      for (let i = 0; i < len; i++) {
        if (index !== i) {
          arr.push(self.requstData[i]);
        }
      }
      self.requstData = arr;
      self.$emit("chilReData", arr);
    },
    requstRowSave(row, done) {
      this.requstData.push(row);
      this.$emit("chilReData", this.requstData);
      done();
    },
    rowUpdate(row, index, done) {
      const arr = [];
      this.requstData.map((v, i) => {
        if (index === i) {
          arr.push(row);
        } else {
          arr.push(v);
        }
      });
      this.requstData = arr;
      this.$emit("chilReData", arr);
      done();
    },
    resetForm(formName) {
      this.$refs[formName].resetFields();
    },
    init(column, requstData) {
      this.option.column = column
      this.requstData = requstData
    }
  },
};
</script>

<style scoped lang="scss">
.addForm {
  /deep/ .avue-crud {
    h2 {
      font-size: 16px;
      font-weight: 500;
    }
  }
}
</style>
