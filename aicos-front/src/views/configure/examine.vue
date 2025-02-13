<template>
  <basic-container>
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
      <template slot-scope="scope" slot="menu">
        <el-button
          type="text"
          size="small"
          @click.stop="enable(scope.row, scope.index)"
          >服务更新
        </el-button>
        <el-button
          type="text"
          size="small"
          @click.stop="enable(scope.row, scope.index)"
          >服务新建
        </el-button>
        <el-button
          type="text"
          size="small"
          @click.stop="enable(scope.row, scope.index)"
          >驳回请求
        </el-button>
      </template>
    </avue-crud>
  </basic-container>
</template>

<script>
// import {mapGetters} from "vuex";
import {
  aiAbilityListByPage,
  aiAbilitySave,
  abilityUpdate,
  abilityDelete,
} from "@/api/configure/application";
// import { getRules } from "@/util/regx";

export default {
  name: "paramItemList",
  props: {
    // typeId: {
    //   type: String,
    //   default: "",
    // },
  },
  data() {
    return {
      form: {},
      page: {
        pageSize: 10,
        pageSizes: [10, 30, 50, 100, 200],
        currentPage: 1,
        total: 0,
      },
      loading: true,
      data: [],
      option: {
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
        addBtn: false,
        addBtnText: "添加能力",
        menuAlign: "left",
        editBtn: false,
        delBtn: false,
        menuWidth: 220,
        labelWidth: 140,
        searchLabelWidth: 100,
        dialogWidth: 480,
        dialogClickModal: false,
        // expand: true,
        column: [
          {
            label: "能力名称",
            prop: "name",
            search: false,
            searchSpan: 6,
            // search: true,
            span: 24,
            // display: false,
            rules: [
              {
                required: true,
                message: "请输入能力名称",
                trigger: "blur",
              },
            ],
          },
          {
            label: "场景描述",
            prop: "category",
            searchSpan: 6,
            search: false,
            span: 24,
            display: true,
            // hide: true,
            type: "select",
            dicData: [
              {
                label: "语音识别",
                value: "语音识别",
              },
              {
                label: "语音合成",
                value: "语音合成",
              },
              {
                label: "自然语言处理",
                value: "自然语言处理",
              },
            ],
            rules: [
              {
                required: true,
                message: "请选择能力所属分类",
                trigger: "blur",
              },
            ],
          },
          {
            label: "申请时间",
            prop: "code",
            search: false,
            searchSpan: 6,
            align: "center",
            span: 24,
            display: false,
            viewDisplay: true,
          },
          {
            label: "申请人",
            prop: "updateTime",
            align: "center",
            span: 24,
            // hide: true,
            display: false,
            type: "input",
          },
        ],
      },
      typeId: null,
    };
  },
  computed: {
    // ...mapGetters(["permission"]),
    permissionList() {
      return function (key, /*row , index*/) {
        const map = {
          menu: true,
          addBtn: true,
          editBtn: false,
          viewBtn: true,
        };
        // if (key === "delBtn") {
        //   return row.paramType !== "system";
        // }
        console.log(map[key]);
        return map[key];
      };
    },
  },
  created() {
    const arr = [3, 4, 1, 2, 21, 5, 15, 6, 63];
    for (let i = 0; i < arr.length; i++) {
      for(let j = 1;j<arr.length-i-1;j++){
        let comb = arr[j]
        if(comb < arr[j]){
          arr[i] = comb
          arr[j] = arr[i]
        }
      }
    }
    console.log(arr)
  },
  methods: {
    rowSave(row, done, loading) {
      console.log(row);
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
    rowUpdate(row, index, done, loading) {
      row = { ...row };
      console.log(row);
      abilityUpdate(row).then(
        () => {
          this.onLoad(this.page);
          this.$message({
            type: "success",
            message: "操作成功!",
          });
          this.treeLoad();
          done();
        },
        (error) => {
          window.console.log(error);
          loading();
        }
      );
    },
    rowDel(row, index, done) {
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
          done();
        });
      });
    },
    searchReset() {
      this.query = {};
      this.treeLoad(this.page);
    },
    searchChange(params, done) {
      this.query = params;
      this.page.currentPage = 1;
      this.treeLoad(this.page, params);
      done();
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
        ...seach,
      };
      aiAbilityListByPage(params).then((res) => {
        const data = res.data.data;
        this.data = data.records;
        this.page.total = data.total;
        this.loading = false;
        // this.selectionClear();
      });
    },
    doLayout() {
      this.$refs.crud && this.$refs.crud.doLayout();
    },
    // batchDel() {
    //   if (!this.selectionList || this.selectionList.length <= 0) {
    //     this.$message({
    //       type: "error",
    //       message: "请选择要删除的数据!",
    //     });
    //     return;
    //   }
    //   const ids = this.selectionList
    //     .map((v) => {
    //       return v.id;
    //     })
    //     .join();
    //   this.$confirm("确定将选择数据删除?", {
    //     confirmButtonText: "确定",
    //     cancelButtonText: "取消",
    //     type: "warning",
    //   }).then(() => {
    //     removeItem(ids).then((res) => {
    //       this.treeLoad();
    //       this.$message({
    //         type: "success",
    //         message: "操作成功!",
    //       });
    //       done();
    //     });
    //   });
    // },
  },
};
</script>

<style scoped>
</style>
