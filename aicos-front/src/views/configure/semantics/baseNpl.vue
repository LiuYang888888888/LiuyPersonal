<template>
  <div style="padding: 20px;">
    <HuilanBasicToolbar style="margin-top: 0">
      <el-button
        type="primary"
        size="small"
        @click.stop="plugAdd"
        v-if="permissionList.addBtn"
        >添加能力
      </el-button>
    </HuilanBasicToolbar>
    <HuilanBasicSearchbar
      :model="searchForm"
      :fields="searchFieldList"
      @reset="searchReset"
      @search="searchChange"
    >
      <template v-slot:appendTool>
        <el-button type="default" @click="configColumn"
          ><i class="el-icon-s-operation"></i
        ></el-button>
      </template>
    </HuilanBasicSearchbar>
    <avue-crud
      :option="option"
      :table-loading="loading"
      :data="data"
      :page="page"
      ref="crud"
      v-model="form"
      :before-open="beforeOpen"
      @row-del="rowDel"
      @row-update="rowUpdate"
      @row-save="rowSave"
      @search-change="searchChange"
      @search-reset="searchReset"
      @selection-change="selectionChange"
      @current-change="currentChange"
      @size-change="sizeChange"
      @refresh-change="refreshChange"
      @on-load="treeLoad"
    >
      <template slot-scope="isTrain" slot="isTrain"
        >{{ isTrain.row.isTrain === "1" ? "是" : "否" }}
      </template>
      <!-- <template slot-scope="scope" slot="menu">
        <el-button
          v-if="permissionList.editBtn"
          type="text"
          icon="el-icon-edit-outline"
          size="small"
          @click.stop="rowUpdate(scope.row)"
          >编辑
        </el-button>
        <el-button
          v-if="permissionList.delBtn"
          type="text"
          icon="el-icon-delete"
          size="small"
          @click.stop="rowDel(scope.row)"
          >删除</el-button
        >
        <el-button
          v-if="permissionList.experience"
          type="text"
          icon="el-icon-circle-plus-outline"
          size="small"
          @click.stop="enable(scope.row, scope.index)"
          >体验使用
        </el-button>
      </template> -->
      <template v-slot:menu="scope">
        <HuilanBasicActionTool
          :actions="getRowActions(scope.row)"
          @command="handleCommand($event, scope.row, scope.index)"
        />
      </template>
      <template slot-scope="scope" slot="description">
        <el-tag
          style="margin-right: 4px; margin-bottom: 4px"
          size="small"
          v-for="item of descriptionToSring(scope.row.description)"
          :key="item"
          >{{ item }}</el-tag
        >
      </template>
    </avue-crud>
    <AddForm
      ref="addForm"
      :category1="category1"
      @prePageList="prePageList"
      class="addform"
    ></AddForm>
    <!-- <div v-if="switchPage === '2'">
      <NaturalLanguageProcessing :rowData="rowData"></NaturalLanguageProcessing>
    </div>
    <div v-if="switchPage === '3'">
      <InterfaceDescription :rowData="rowData"></InterfaceDescription>
    </div> -->
  </div>
</template>

<script>
// import {mapGetters} from "vuex";
import {
  aiAbilityListByPage,
  aiAbilitySave,
  // abilityUpdate,
  abilityDelete,
  // getServiceNumberByAbilityId,
} from "@/api/configure/application";
import { getAllCloudvendorList } from "@/api/system/vendor";
import serviceList from "@/config/serviceList";
import AddForm from "../abilityConponent/addForm";
import NaturalLanguageProcessing from "@/views/aiCapacityBase/abilityExperience.vue";
import InterfaceDescription from "@/views/interfaceDescription/index.vue";
import aiInterfaceParama from "@/util/aiInterfaceParama";
// const { system, ai } = serviceList;
const { system } = serviceList;
import { mapGetters } from "vuex";
// import { getRules } from "@/util/regx";
import { baseURL } from "@/api/common";

export default {
  name: "baseAbility",
  components: {
    AddForm,
    NaturalLanguageProcessing,
    InterfaceDescription,
  },
  props: {
    category1: {
      type: String,
      default: "",
    },
    category2: {
      type: String,
      default: "",
    },
  },
  data() {
    return {
      aiInterfaceParama,
      rowData: {},
      switchPage: "1",
      form: {},
      permissionJson: null,
      dialogVisible: false,
      page: {
        pageSize: 10,
        pageSizes: [10, 30, 50, 100, 200],
        currentPage: 1,
        total: 0,
      },
      loading: true,
      data: [],
      option: {
        header:false,
        height: "auto",
        calcHeight: 95,
        tip: false,
        searchShow: true,
        searchSpan: 8,
        searchMenuSpan: 6,
        // tree: true,
        border: true,
        index: true,
        // selection: true,
        menuBtn: true,
        viewBtn: false,
        menuAlign: "center",
        editBtn: false,
        addBtn: false,
        menuWidth: 170,
        labelWidth: 140,
        searchLabelWidth: 100,
        dialogWidth: 480,
        dialogClickModal: false,
        delBtn: false,
        // expand: true,
        column: [
          {
            label: "厂商来源",
            prop: "cloudvendorId",
            searchSpan: 6,
            // search: true,
            span: 24,
            type: "select",
            dicUrl: `${baseURL}api/${system}/baseCloudvendor/getAllCloudvendorList`,
            dicMethod: "post",
            width: 120,
            dicQuery: {
              // code: "ability-classification",
            },
            props: {
              label: "name",
              value: "id",
            },
          },
          {
            label: "能力名称",
            prop: "name",
            // search: true,
            searchSpan: 6,
            type: "input",
          },
          {
            label: "支持训练",
            prop: "isTrain",
            formsolt: true,
            width: 90,
          },
          {
            label: "能力标识",
            prop: "code",
            search: false,
            searchSpan: 6,
            type: "input",
          },
          {
            label: "更新时间",
            prop: "updateTime",
            width: 160,
          },
          {
            label: "描述",
            prop: "description",
            solt: true,
          },
        ],
      },
      searchForm: {
        cloudvendorId: "",
        name: "",
      },
      searchFieldList: [
        {
          prop: "cloudvendorId",
          placeholder: "请选择厂商来源",
          type: "select",
          dicData: [],
        },
        {
          prop: "name",
          placeholder: "请输入能力名称",
        },
      ],
      typeId: null,
    };
  },
  computed: {
    ...mapGetters(["permission"]),
    permissionList() {
      return {
        addBtn: this.vaildData(this.permission["ai-ability-npl-add"], false),
        viewBtn: false,
        delBtn: this.vaildData(this.permission["ai-ability-npl-del"], false),
        editBtn: this.vaildData(this.permission["ai-ability-npl-edit"], false),
        experience: this.vaildData(
          this.permission["ai-ability-npl-experience"],
          false
        ),
      };
    },
  },
  mounted() {
    getAllCloudvendorList({}).then((res) => {
      if (res.data.success) {
        // console.log(res.data);
        this.searchFieldList[0].dicData = res.data.data;
        this.searchFieldList[0].dicData.map((item) => {
          item.label = item.name;
          item.value = item.id;
        });
      }
    });
    const scope = this;
    setTimeout(() => {
      scope.option.column[0].value = "2";
    }, 1500);
  },
  methods: {
    getRowActions() {
      const map = {
        editBtn: {
          name: "编辑",
          command: "rowUpdate",
        },
        delBtn: {
          name: "删除",
          command: "rowDel",
        },
        experience: {
          name: "体验使用",
          command: "enable",
        },
      };
      const list = ["editBtn", "delBtn", "experience"];
      const actions = [];

      list.forEach((item) => {
        if (this.permissionList[item]) {
          actions.push(map[item]);
        }
      });
      return actions;
    },
    handleCommand(command, row, index) {
      this[command](row, index);
    },
    configColumn() {
      this.$refs.crud.$refs.dialogColumn.columnBox = true;
    },
    rowSave(row, done, loading) {
      row = { ...row };
      aiAbilitySave(row).then(
        (res) => {
          // this.onLoad(this.page);
          if (res.data.success) {
            this.$message({
              type: "success",
              message: "操作成功!",
            });
            this.treeLoad();
            done();
          } else {
            this.$message({
              type: "error",
              message: res.data.msg,
            });
            loading();
          }
        },
        (error) => {
          window.console.log(error);
          loading();
        }
      );
    },
    rowUpdate(row) {
      row = { ...row };
      if (row.jsonValue) {
        this.$refs.addForm.requstData = JSON.parse(row.jsonValue);
      }
      this.$refs.addForm.form = row;
      this.$refs.addForm.title = "编辑能力";
      if (row.description) {
        this.$refs.addForm.dynamicTags = row.description.split(",");
      } else {
        this.$refs.addForm.dynamicTags = [];
      }
      this.$refs.addForm.dialogVisible = true;
    },
    rowDel(row) {
      this.$confirm("确定将选择数据删除?", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      }).then(() => {
        abilityDelete({ id: row.id }).then(() => {
          this.treeLoad();
          this.$message({
            type: "success",
            message: "操作成功!",
          });
        });
      });
    },
    searchReset() {
      this.query = {};
      this.treeLoad(this.page);
    },
    searchChange() {
      this.query = { ...this.searchForm };
      this.page.currentPage = 1;
      this.treeLoad(this.page, this.query);
    },
    selectionChange(list) {
      this.selectionList = list;
    },
    selectionClear() {
      this.selectionList = [];
      this.$refs.crud.toggleSelection();
    },
    beforeOpen(done /*, type*/) {
      this.form.systemparamId = this.parentId;
      done();
    },
    currentChange(currentPage) {
      this.page.currentPage = currentPage;
      this.treeLoad({ ...this.page, currentPage });
    },
    sizeChange(pageSize) {
      this.page.pageSize = pageSize;
      this.treeLoad({ ...this.page, pageSize });
    },
    refreshChange() {
      this.treeLoad(this.page, this.query);
    },
    treeLoad(page, seach) {
      this.loading = true;
      const pageParmas = { ...this.page, ...page };
      const params = {
        current: pageParmas.currentPage,
        size: pageParmas.pageSize,
        category1: this.category1,
        category2: this.category2,
        ...seach,
      };
      aiAbilityListByPage(params).then((res) => {
        if (res.data.success) {
          const data = res.data.data;
          this.data = data.records;
          this.page.total = data.total;
          this.loading = false;
        }
        // this.selectionClear();
      });
    },
    doLayout() {
      this.$refs.crud && this.$refs.crud.doLayout();
    },
    plugAdd() {
      this.$refs.addForm.dialogVisible = true;
      this.$refs.addForm.title = "添加能力";
      this.$refs.addForm.prentResetForm("form");
      // this.$refs.addForm.form = {};
    },
    prePageList() {
      this.treeLoad();
    },
    enable(data) {
      // this.rowData = { headerTitle: "能力管理", ...data };
      // this.switchPage = "2";
      const rowData = { headerTitle: "ability", ...data };
      const switchPage = "2";
      this.$emit("baseNplTabMachine", rowData, switchPage);
    },
    descriptionToSring(str) {
      let arr = [];
      let newStr = [];
      if (str) {
        arr = str.split(",");
        arr.map((v) => {
          newStr.push(v);
        });
      }
      return newStr;
    },
    // invide(key) {
    //   let flag = false;
    //   aiInterfaceParama.params.dataJson.map((v) => {
    //     if (v[key] && key !=='recordingFileAsrCallbackWithAliyunLocal') {
    //       flag = true;
    //     }
    //     if (key === 'recordingFileAsrWithAliyun') {
    //       flag = true;
    //     }
    //   });
    //   return flag;
    // },
  },
};
</script>

<style scoped lang="scss">
// .box .el-scrollbar__wrap {
//   overflow: scroll;
// }
/deep/ .el-table--border {
  max-height: 570px !important;
}

</style>
