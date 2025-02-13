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
      :selectionChange="abilityNameChange"
      :permission="permissionJson"
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
      @cell-mouse-enter="rowClick"
    >
      <template slot-scope="scope" slot="menu">
        <el-button
          v-if="permissionList['ai-service-serveManger-test']"
          type="text"
          icon="el-icon-circle-plus-outline"
          size="small"
          @click.stop="enable(scope.row, scope.index)"
          >测试
        </el-button>
      </template>
    </avue-crud>
  </basic-container>
</template>

<script>
// import {mapGetters} from "vuex";
import {
  serviceListByPage,
  serviceSave,
  serviceUpdate,
  serviceDelete,
  getAllAiAbilityList,
  // getHuilanAiServiceByCategory,
} from "@/api/configure/application";
import serviceList from '@/config/serviceList'
import {baseURL, getDictItemListByDictCodeURL} from '@/api/common';

const { ai } = serviceList
import { mapGetters } from "vuex";
// const { system } = serviceList;
export default {
  name: "paramItemList",
  props: {},
  data() {
    // const scop = this;
    return {
      form: {},
      permissionList: null,
      permissionJson: null,
      page: {
        pageSize: 10,
        pageSizes: [10, 30, 50, 100, 200],
        currentPage: 1,
        total: 0,
      },
      loading: true,
      data: [],
      typeId: null,
      abilityList: [],
      tableRow: {},
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
        viewBtn: true,
        addBtnText: "添加服务",
        menuAlign: "left",
        editBtn: true,
        menuWidth: 260,
        labelWidth: 100,
        searchLabelWidth: 100,
        dialogWidth: 480,
        dialogClickModal: false,
        column: [
          {
            label: "服务名称",
            prop: "name",
            search: true,
            searchSpan: 6,
            // search: true,
            span: 24,
            display: true,
            rules: [
              {
                required: true,
                message: "请输入应用名称",
                trigger: "blur",
              },
            ],
          },
          {
            label: "能力所属分类",
            prop: "abilityCategory",
            span: 24,
            hide: true,
            // addDisplay: false,
            // viewDisplay: false,
            display: false,
            type: "select",
            search: true,
            searchSpan: 6,
            // cascaderItem: ["abilityId"],
            dicUrl: getDictItemListByDictCodeURL,
            dicMethod: "post",
            dicQuery: {
              code: "ability-classification",
            },
            props: {
              label: "name",
              value: "code",
            },
            // change: ({ value }) => {
            //   if (value) {
            //     getHuilanAiServiceByCategory({ category: value }).then(
            //       (res) => {
            //         const data = res.data;
            //         // console.log(scop.option)
            //         const sourceData = scop.option;
            //         const column = scop.findObject(
            //           sourceData.column,
            //           "abilityId"
            //         );
            //         if (data.success) {
            //           column.dicData = [];
            //           if (data.data.length > 0) {
            //             let source = column.dicData.concat(data.data);
            //             column.dicData = source;
            //           } else {
            //             column.dicData = [];
            //           }
            //         } else {
            //           window.console.log(column.dicData);
            //         }
            //       }
            //     );
            //   }
            // },
            // width: 80,
          },
          {
            label: "能力",
            prop: "abilityId",
            searchSpan: 6,
            search: true,
            span: 24,
            display: true,
            hide: true,
            type: "select",
            // cascaderItem: ["category"],
            dicUrl: `${baseURL}api/${ai}/aiAbility/getAllAiAbilityList`,
            dicMethod: "post",
            dicQuery: {
              // category: "category",
            },
            props: {
              label: "name",
              value: "id",
            },
            rules: [
              {
                required: true,
                message: "请选择能力名称",
                trigger: "blur",
              },
            ],
            change: ({ value }) => {
              if (value) {
                this.abilityList;
                if (this.abilityList && this.abilityList.length > 0) {
                  this.abilityList.map((v) => {
                    if (v.id === value) {
                      this.form.docUrl = v.testUrl;
                    }
                  });
                }
              }
            },
          },
          {
            label: "服务标识",
            prop: "code",
            search: true,
            searchSpan: 6,
            align: "center",
            span: 24,
            display: true,
            viewDisplay: true,
            rules: [
              {
                required: true,
                message: "请输入服务标识",
                trigger: "blur",
              },
            ],
          },
          {
            label: "场景",
            prop: "description",
            align: "center",
            span: 24,
            // hide: true,
            type: "input",
            rules: [
              {
                required: true,
                message: "请输入场景描述",
                trigger: "blur",
              },
            ],
          },
          // {
          //   label: "运行线程",
          //   prop: "yxxc",
          //   align: "center",
          //   span: 24,
          //   hide: true,
          //   type: "input",
          //   rules: [
          //     {
          //       required: true,
          //       message: "请输入运行线程",
          //       trigger: "blur",
          //     },
          //   ],
          // },
          {
            label: "请求地址",
            prop: "docUrl",
            align: "center",
            span: 24,
            hide: true,
            type: "input",
            addDisabled: true,
            editDisabled: true,
            rules: [
              {
                required: true,
                message: "请输入请求地址",
                trigger: "blur",
              },
            ],
          },
        ],
      },
    };
  },
  computed: {
    ...mapGetters(["permission"]),
  },
  watch: {},
  created() {
    this.permissionJson = {
      viewBtn: this.permission['ai-service-serveManger-view'],
      editBtn: this.permission['ai-service-serveManger-edit'],
      delBtn: this.permission['ai-service-serveManger-delet'],
      addBtn: this.permission['ai-service-serveManger_newAdd'],
    };
    this.permissionList = this.permission
    getAllAiAbilityList().then(
      (res) => {
        if (res.data.success) {
          this.abilityList = res.data.data;
        } else {
          this.$message({
            type: "error",
            message: res.data.msg,
          });
          // loading();
        }
      },
      (error) => {
        window.console.log(error);
        // loading();
      }
    );
  },
  methods: {
    rowSave(row, done, loading) {
      console.log(row);
      row = { ...row };
      serviceSave(row).then(
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
      serviceUpdate(row).then(
        () => {
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
        serviceDelete({ id: row.id }).then(() => {
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
    beforeOpen(done, type) {
      if (type === "edit") {
        // getAiServiceById({ id: this.tableRow.id }).then((res) => {
        //   if (res.data.success) {
        //     const data = res.data.data;
        //     debugger
        //     this.form.abilityName = data.name;
        //   } else {
        //     window.console.log(res.data.msg);
        //   }
        //   done();
        // });
      }
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
      serviceListByPage(params).then((res) => {
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
    abilityNameChange(row) {
      console.log(row);
    },
    rowClick(row) {
      this.tableRow = row;
    },
  },
};
</script>

<style scoped>
</style>
