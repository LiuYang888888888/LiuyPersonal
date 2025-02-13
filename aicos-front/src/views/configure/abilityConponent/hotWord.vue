<template>
  <div>
    <HuilanBasicToolbar style="margin-top: 0">
      <el-button
        type="primary"
        size="small"
        @click.stop="hotAdd"
        style="margin-right: 10px"
      >
        新增
      </el-button>
      <el-dropdown @command="handleClick">
        <el-button type="primary" size="small">
          批量操作<i class="el-icon-arrow-down el-icon--right"></i>
        </el-button>
        <el-dropdown-menu slot="dropdown">
          <el-dropdown-item command="import">批量导入</el-dropdown-item>
          <el-dropdown-item command="export">批量导出</el-dropdown-item>
          <el-dropdown-item command="del">批量删除</el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
    </HuilanBasicToolbar>
    <HuilanBasicSearchbar
      :model="searchForm"
      :fields="searchFieldList"
      @reset="searchReset"
      @search="searchChange"
    >
    </HuilanBasicSearchbar>
    <avue-crud
      class="table-crud"
      :option="option"
      :data="data"
      ref="crud"
      :table-loading="loading"
      @row-del="rowDel"
      @row-update="rowUpdate"
      @row-save="rowSave"
      @on-load="onLoad"
      @select="select"
      @select-all="selectAll"
      @selection-change="selectionChange"
    >
    </avue-crud>
    <div style="text-align: right; margin-top: 20px">
      <el-button size="small" @click="cancel">取消</el-button>
      <el-button type="primary" @click="save" size="small">确认</el-button>
    </div>
    <HuilanDialog
      title="导入热词"
      append-to-body
      :visible.sync="importDialogVisible"
      width="30%"
    >
      <avue-form
        ref="form"
        v-model="importForm"
        :option="importFormOption"
        :upload-after="uploadAfter"
      >
      </avue-form>
      <div style="text-indent: 30px">
        点击<el-button type="text" @click="downClick">下载模板</el-button>
        ，请按照格式填写
      </div>
      <template v-slot:footer>
        <el-button
          size="small"
          type="primary"
          @click="importDialogVisible = false"
          >关 闭</el-button
        >
      </template>
    </HuilanDialog>
  </div>
</template>
<script>
import { mapGetters } from "vuex";
import { deepClone } from "@/util/util";
import { getHotWordList, saveHotWord } from "@/api/configure/application";
import serviceList from "@/config/serviceList";
import { setStore, getStore, removeStore } from "@/util/store";
import { baseURL } from "@/api/common";
const { ai } = serviceList;
export default {
  name: "hotWord",

  data() {
    return {
      // 导入
      importDialogVisible: false,
      importForm: {},
      importFormOption: {
        menuBtn: false,
        dialogWidth: "30%",
        column: [
          {
            label: "上传文件",
            prop: "file",
            type: "upload",
            loadText: "附件上传中，请稍等",
            span: 24,
            accept: ".xlsx,.xls",
            propsHttp: {
              url: "url",
              name: "name",
              res: "data",
            },
            action: `${baseURL}api/${ai}/aiAbility/importExcel`,
          },
        ],
      },
      //
      loading: false,
      data: [],
      copyData: [],
      selectionList: [],
      option: {
        tip: false,
        selection: true,
        header: true,
        excelBtn: true,
        // height: "auto",
        height: 600,
        addBtn: false,
        editBtn: true,
        viewBtn: false,
        delBtn: true,
        searchBtn: false,
        columnBtn: false,
        refreshBtn: false,
        dialogWidth: "600",
        // dialogType: "drawer",
        // dialogCustomClass: "huilan-drawer-form",
        column: [
          {
            label: "热词名称",
            prop: "name",
            span: 24,
            maxlength: 50,
            showWordLimit: true,
            overHidden: true,
            rules: [
              { required: true, message: "请输入热词名称", trigger: "blur" },
            ],
          },
          {
            label: "读音标注",
            prop: "value",
            type: "textarea",
            span: 24,
            width: 200,
            maxlength: 500,
            showWordLimit: true,
            overHidden: true,
            tip: "1、拼音词间请使用“空格”隔开  2、多组拼音间请使用“,”隔开",
            formatter: (val, value, label) => {
              if (this.validatenull(value)) {
                return "--";
              }
              return label;
            },
          },
        ],
      },
      searchForm: {
        name: "",
        value: "",
      },
      searchFieldList: [
        {
          prop: "name",
          placeholder: "请输入热词名称",
        },
        {
          prop: "value",
          placeholder: "请输入读音标注",
        },
      ],
    };
  },
  computed: {
    ...mapGetters(["userInfo"]),
  },
  mounted() {
    if (getStore({ name: "hotWord" })) {
      this.data = this.copyData = getStore({ name: "hotWord" });
    } else {
      getHotWordList({ appId: this.$store.state.user.currentTenantId }).then((res) => {
        let data = res.data.data.hotWordDict;
        if (data == null) {
          this.data = this.copyData = [];
        } else {
          data.forEach((item, index) => {
            item.id = new Date().getTime() + index;
          });
          this.data = this.copyData = data;
        }
      });
    }
  },

  methods: {
    // 导入模板下载
    downClick() {
      window.open(`${baseURL}api/${ai}/aiAbility/excel/download`);
    },
    // 导入上传后的回调
    uploadAfter(res, done) {
      this.data = res.hotWordDict;
      this.importDialogVisible = false;
      done();
    },
    hotAdd() {
      this.$refs.crud.rowAdd();
    },
    rowSave(row, done, loading) {
      row.id = new Date().getTime();
      let index = this.data.findIndex((item) => item.name === row.name);
      if (index > -1) {
        this.$message.error("热词名称已存在");
        loading();
        return;
      }
      this.data.unshift(row);
      this.copyData = deepClone(this.data);
      done();
    },
    rowUpdate(row, index, done, loading) {
      let a = this.data.filter(
        (item) => item.name === row.name && item.id !== row.id
      );
      if (a.length > 0) {
        this.$message.error("热词名称已存在");
        loading();
        return;
      }
      this.$set(this.data, index, row);
      this.copyData.forEach((item) => {
        if (item.id === row.id) {
          item.name = row.name;
          item.value = row.value;
        }
      });
      done();
    },
    rowDel(row, index, done) {
      this.$confirm("确定将选择数据删除?", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      }).then(() => {
        // console.log('1',this.copyData);
        this.copyData = this.copyData.filter((item) => {
          return item.id !== row.id;
        });
        done();
        // console.log('2',this.copyData);
      });
    },
    searchChange() {
      this.data = this.copyData.filter((item) => {
        return (
          item.name.indexOf(this.searchForm.name) > -1 &&
          item.value.indexOf(this.searchForm.value) > -1
        );
      });
    },
    searchReset() {
      this.searchForm = { name: "", value: "" };
      this.data = deepClone(this.copyData);
    },
    selectionChange(list) {
      this.selectionList = list;
    },
    handleClick(command) {
      if (command === "import") {
        this.importDialogVisible = true;
        this.importForm = {};
      }
      if (command === "export") {
        this.$refs.crud.rowExcel();
      }
      if (command === "del") {
        if (this.selectionList.length === 0) {
          this.$message.error("请选择要删除的数据");
          return;
        }
        this.$confirm("确定将选择数据删除?", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        }).then(() => {
          const data = deepClone(this.data);
          this.selectionList.forEach((item) => {
            let index = data.findIndex((i) => i.id === item.id);
            data.splice(index, 1);
          });
          this.data = deepClone(data);
          this.copyData = deepClone(data);
          this.selectionList = [];
        });
      }
    },
    save() {
      saveHotWord({
        hotWordDict: this.copyData,
        appId: this.$store.state.user.currentTenantId,
      }).then((res) => {
        if (res.data.code === 200) {
          this.$message.success("保存成功");
          this.$emit("cancel");
          removeStore({ name: "hotWord" });
        }
      });
    },
    local() {
      setStore({ name: "hotWord", content: this.copyData });
    },
    cancel() {
      this.$emit("cancel");
      removeStore({ name: "hotWord" });
    },
  },
};
</script>
<style lang="scss" scoped>
.table-crud {
  /deep/ .avue-crud__menu {
    display: none;
  }
}
</style>
