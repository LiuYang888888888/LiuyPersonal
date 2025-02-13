<template>
  <div class="huiLanCrud">
    <el-row :gutter="20">
      <el-col :span="18" class="seRolCrud">
        <div class="tempForm">
          <avue-form ref="tempFormRef" :option="deptTreeOption"> </avue-form>
        </div>
        <HuilanBasicSearchbar
          :model="searchForm"
          :fields="searchFieldList"
          @search="searchChange"
          @refresh="refreshChange"
          @reset="searchReset"
          ref="searchFormRef"
        >
          <template v-slot:deptId>
            <div class="huiLanSearchCascader">
              <el-input v-model="deptId" />
            </div>
          </template>
        </HuilanBasicSearchbar>
        <avue-crud
          :option="ListOption"
          :search.sync="query"
          :table-loading="loading"
          :data="listData"
          ref="listRef"
          :page.sync="page"
          @row-click="rowClick"
          @search-change="searchChange"
          @search-reset="searchReset"
          @selection-change="selectionChange"
          @select-all="selectAll"
          @select="selectOne"
          @current-change="currentChange"
          @size-change="sizeChange"
          @refresh-change="refreshChange"
          @on-load="onLoad"
        >
          <template slot-scope="scope" slot="menu">
            <el-button
              type="text"
              icon="el-icon-plus"
              size="small"
              :disabled="hasInRight(scope.row)"
              @click.stop="handleAdd(scope.row, scope.index)"
              >{{ $t("system.dept.select") }}
            </el-button>
          </template>
        </avue-crud>
      </el-col>
      <el-col :span="6">
        <checkedList
          :checkedListData="selectData"
          :props="selectProps"
          @itemRemove="handleRemove"
          @itemRemoveAll="handleRemoveAll"
          :title="$t('system.dept.selectedUsers')"
        />
      </el-col>
    </el-row>

    <!-- <div>{{checkedData.type}}</div> -->
    <!-- <div>{{checkedData.user}}</div> -->
    <!-- <div>{{checkedData.num.user}}</div> -->
  </div>
</template>
<script>
import { getUserList, getDeptTree } from "@/api/optOrg/optOrg";
import { getRules } from "@/util/regx";
import checkedList from "./checkedList";
import { mapGetters } from "vuex";
//import { isNull } from '@/util/qsgCommon.js';

export default {
  name: "optRole",
  components: {
    checkedList,
  },
  props: {
    checkedData: {
      type: Object,
      default() {
        return {};
      },
    },
  },
  data() {
    return {
      selectData: [],
      firstId: '0',
      deptTreeOption: {
        submitBtn: false,
        emptyBtn: false,
        column: [
          {
            label: "",
            prop: "tempDeptId",
            placeholder:
              this.$t("aicosCommon.pleaseSelect") +
              this.$t("system.dept.department"),
            labelWidth: 0,
            type: "tree",
            lazy: true,
            popperClass: "huiLanSelectTree",
            popperAppendToBody: false,
            defaultExpandedKeys: ["0"],
            props: {
              label: "deptName",
              children: "children",
              value: "id",
            },
            created: true,
            treeLoad: (node, resolve) => {
              if (node.level === 0) {
                resolve([{ deptName: "部门目录", id: "0" }]);
                return;
              }

              const dataParam = {
                parentId: node.data.id,
              };
              getDeptTree(dataParam).then((res) => {
                const dataRes = res.data.data.retList;
                resolve(
                  dataRes.map((item) => {
                    return {
                      ...item,
                      leaf: item.isLeaf === "1",
                    };
                  })
                );
              });
            },
            change: ({ value /*,column*/ }) => {
              //console.log(value);
              this.query.deptId = value;
            },
          },
        ],
      },

      hasChecked: [],
      selectLength: 0,
      query: {
        deptId: 0,
      },
      loading: true,
      platformLoading: false,
      selectionList: [],
      page: {
        pageSize: 5,
        currentPage: 1,
        total: 0,
        pageSizes: [5, 10, 20, 30, 40, 50, 100],
        pagerCount: 5,
        layout: "total, sizes, prev, pager, next, jumper",
      },
      searchForm: {},

      ListOption: {
        height: 300,
        calcHeight: 50,

        tip: false,
        searchShow: true,
        refreshBtn: false,
        columnBtn: false,
        searchShowBtn: false,

        gutter: 2,
        addBtn: false,
        editBtn: false,
        delBtn: false,
        menuWidth: 100,
        index: true,
        selection: false,
        reserveSelection: true,
        dialogClickModal: false,
        searchSpan: 10,
        searchMenuSpan: 8,
        searchMenuPosition: "center",
        border: true,
        stripe: false,
        selectionFixed: false,
        expandFixed: false,
        menuFixed: false,
        indexFixed: false,

        column: [
          {
            label: this.$t("system.dept.deptId"),
            prop: "deptId",
            //search: true,
            hide: true,
            display: true,
            solt: "deptId",
          },
          {
            label: this.$t("system.user.userName"),
            prop: "account",
            search: true,
            span: 24,
            maxlength: 50,
            showWordLimit: true,
            rules: [
              {
                required: true,
                message:
                  this.$t("aicosCommon.pleaseInput") +
                  this.$t("system.user.userName"),
                trigger: "blur",
              },
              ...getRules(["charNumHanUnderline"]),
            ],
          },
          {
            label: this.$t("system.user.realName"),
            prop: "realName",
            search: true,
            span: 24,
            maxlength: 50,
            showWordLimit: true,
            rules: [
              {
                required: true,
                message:
                  this.$t("aicosCommon.pleaseInput") +
                  this.$t("system.user.realName"),
                trigger: "blur",
              },
              ...getRules(["charNumHanUnderline"]),
            ],
          },
        ],
      },
      listData: [],
      selectProps: {
        key: "id",
        label: "realName",
      },
    };
  },
  computed: {
    ...mapGetters(["userInfo"]),
  
  },
  methods: {
    getResData() {
      return this.selectData;
    },

    searchReset() {
      this.$refs.tempFormRef.resetForm();

      this.query = {};
      this.onLoad(this.page);
    },
    searchChange(params /*, done*/) {
      this.query = {
        ...this.query,
        ...params,
        ...this.searchForm,
      };

      // this.parentId = '';
      this.page.currentPage = 1;
      this.onLoad(this.page, params);
      //done();
    },
    currentChange(currentPage) {
      this.page.currentPage = currentPage;
    },
    sizeChange(pageSize) {
      this.page.pageSize = pageSize;
    },

    selectionChange(selection) {
      this.selectionList = selection;
    },

    selectionClear() {
      this.selectionList = [];
      //this.$refs.listRef.toggleSelection();
    },

    refreshChange() {
      this.onLoad(this.page, this.query);
    },
    async getTree() {
      await getDeptTree({ parentId: "0" }).then((res) => {
        this.firstId = res.data.data.retList[0].id;
      });
    },

    async onLoad(page, params = {}) {
      if (this.userInfo.isAdmin != "1") {
        await this.getTree();
      }
      const postData = {
        current: page.currentPage,
        size: page.pageSize,
        ...params,
        ...this.query,
        deptId: this.query.deptId || this.firstId,
      };
      this.loading = true;
      getUserList(postData).then((res) => {
        const data = res.data.data;
        this.page.total = data.total;
        this.listData = data.records;
        this.loading = false;
        //this.selectionClear();
      });
    },
    hasInRight(row) {
      let hasIn = false;
      this.selectData.map((item) => {
        if (row.id == item.id || row.account == item.account) {
          hasIn = true;
        }
      });
      return hasIn;
      //return this.selectData.some( (item) => item.id === row.id );
    },
    rowClick(row /*, column, event*/) {
      if (!this.hasInRight(row)) {
        if (!this.canNumIn(this.selectData.length)) {
          //console.log('不能追加进右侧')
          return false;
        }

        //console.log('追加进右侧')
        this.$refs.listRef.toggleRowSelection(row, true);
        this.selectData.push(row);
      } else {
        if (!this.canNumOut(this.selectData.length)) {
          //console.log('不能从右侧删除')
          return false;
        }

        //console.log('从右侧删除')
        this.selectData = this.selectData.filter((item) => {
          if (!(item.id == row.id || item.account == row.account)) {
            return item;
          }
        });
        this.$refs.listRef.toggleRowSelection(row, false);
      }
    },
    handleAdd(row) {
      this.rowClick(row);
    },
    handleRemove(item, index) {
      this.selectData.splice(index, 1);
    },
    handleRemoveAll() {
      this.$refs.listRef.toggleSelection();
      this.selectData = [];
    },
    selectOne(selection, row) {
      this.rowClick(row);
    },
    selectPage() {
      this.listData.map((row) => {
        if (!this.hasInRight(row)) {
          this.rowClick(row);
        }
      });
    },

    selectAll(selection) {
      if (this.selectLength == selection.length) {
        //console.log('没变化');
      } else {
        if (this.selectLength < selection.length) {
          //console.log('变多,追加进右侧');
          selection.map((item) => {
            if (!this.hasInRight(item)) {
              this.selectData.push(item);
            }
          });
        } else {
          //console.log('变少，从右侧列表删除左侧表格里的数据');
          this.listData.map((row) => {
            this.selectData = this.selectData.filter((item) => {
              if (item.id != row.id) {
                return item;
              }
            });
          });
        }
        this.selectLength = selection.length;
      }
    },
    canNumIn(num) {
      let ckRes = false;
      num++;
      const numMax = this.checkedData.num.user.max;
      if (num > numMax) {
        this.$message.warning("最多可以选择 " + numMax + " 个！");
        ckRes = false;
      } else {
        ckRes = true;
      }
      return ckRes;
    },
    canNumOut(num) {
      let ckRes = false;
      num--;
      const numMin = this.checkedData.num.user.min;
      if (num < numMin) {
        this.$message.warning("最少必须选择 " + numMin + " 个！");
        ckRes = false;
      } else {
        ckRes = true;
      }
      return ckRes;
    },
    moveDeptSel() {
      //console.log(this.$refs);
      const tempRef = this.$refs.tempFormRef.getPropRef("tempDeptId").$el;
      const toRef = this.$refs.searchFormRef.$refs.form.$el;
      //const toRef = this.$refs.searchFormRef.$refs.form.getPropRef('deptId').$el;
      toRef.prepend(tempRef);
    },
    initData() {
      //防止数据双向绑定，影响初始化
      const tempArr = [];
      this.checkedData.user.map((item) => {
        tempArr.push({ ...item });
      });
      this.selectData = tempArr;

      //this.selectData = this.checkedData.user;
    },
  },
  mounted() {
    /*处理新规范表格的搜索*/
    const listColumn = this.ListOption.column;
    const formColumn = listColumn.filter((item) => item.search === true);
    formColumn.map((item) => {
      item.placeholder =
        (item.type == "select"
          ? this.$t("aicosCommon.pleaseSelect")
          : this.$t("aicosCommon.pleaseInput")) + item.label;
    });
    this.searchFieldList = formColumn;

    /*处理下拉树再次下来无数据的问题*/
    this.$refs.tempFormRef.$refs.tempDeptId[0].$refs.temp.created = true;

    this.moveDeptSel();

    this.initData();
  },
  created() {},
  watch: {
    listData: {
      /*初始化选中*/
      handler() {
        let tempArr = [];
        this.listData.forEach((item) => {
          this.selectData.forEach((info) => {
            if (info.id == item.id || info.account == item.account) {
              info = item;
              tempArr.push(item);
            }
          });
        });
        this.$nextTick(() => {
          tempArr.forEach((item) => {
            this.$refs.listRef.toggleRowSelection(item, true);
          });
        });
      },
    },
    checkedData: {
      handler(/*newVal*/) {
        this.initData();
      },
      deep: true,
    },
  },
};
</script>
<style>
.el-tree-node {
  max-width: 560px;
}
</style>
<style lang="scss" scoped>
.huiLanCrud {
  /deep/.avue-crud {
    .avue-crud__search,
    .avue-crud__menu {
      width: 0;
      height: 0;
      overflow: hidden;
      display: none;
    }
  }

  .tempForm {
    width: 0;
    height: 0;
    overflow: hidden;
    display: none;
  }

  /deep/.Huilan-basic-search-form {
    & > .el-form-item:not(.search-from-tool) {
      width: 170px;
    }

    & > :first-child {
      margin-right: 10px;
      width: 170px;
    }
  }
}
</style>
