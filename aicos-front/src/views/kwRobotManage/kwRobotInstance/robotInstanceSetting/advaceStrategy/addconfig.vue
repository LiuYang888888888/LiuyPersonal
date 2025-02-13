<template>
  <div class="huiLanCrud">
    <el-row :gutter="20">
      <el-col :span="18" class="seRolCrud">
        <HuilanBasicSearchbar :model="searchForm" :fields="searchFieldList" @search="searchChange"
          @refresh="refreshChange" @reset="searchReset" ref="searchFormRef">
          <template v-slot:name>
            <div class="huiLanSearchCascader">
              <el-input v-model="name" />
            </div>
          </template>
        </HuilanBasicSearchbar>
        <avue-crud :option="ListOption" :search.sync="query" :table-loading="loading" :data="listData" ref="listRef"
          :page.sync="page" @row-click="rowClick" @search-change="searchChange" @search-reset="searchReset"
          @selection-change="selectionChange" @select-all="selectAll" @select="selectOne" @current-change="currentChange"
          @size-change="sizeChange" @refresh-change="refreshChange" @on-load="onLoad">
          <template slot-scope="scope" slot="isUse">
            <!-- 启用 -->
            <div v-if="scope.row.isUse == 1">{{ $t("aicosCommon.start") }}</div>
            <!-- 停用 -->
            <div v-if="scope.row.isUse == 0">{{ $t("aicosCommon.pause") }}</div>
          </template>
          <template slot-scope="{ row, index }" slot="menu">
            <el-button type="text" size="small" v-if="row.show" :disabled="hasInRight(row)"
              @click.stop="handleAdd(row, index)">{{$t('kwRobotManage.increase')}}
            </el-button>
          </template>
        </avue-crud>
      </el-col>
      <el-col :span="6">
        <checkedList :checkedListData="selectData" :props="selectProps" @itemRemove="handleRemove"
          @itemRemoveAll="handleRemoveAll" :title="$t('kwRobotManage.sessionModuleTips')" />
      </el-col>
    </el-row>
  </div>
</template>
<script>
import { listData } from "@/api/kwRobot/kwRobotTrain/index";
import checkedList from "./checkedList";

export default {
  name: "optRole",
  components: {
    checkedList,
  },
  props: {
    checkedData: {
      type: Array,
      default () {
        return [];
      },
    },
  },
  data () {
    return {
      selectData: [],
      hasChecked: [],
      selectLength: 0,
      query: {
        name: "",
      },
      loading: true,
      platformLoading: false,
      selectionList: [],
      page: {
        pageSize: 10,
        currentPage: 1,
        total: 0,
        pageSizes: [5, 10, 20, 30, 40, 50, 100],
        pagerCount: 5,
        layout: "total, sizes, prev, pager, next, jumper",
      },
      searchForm: { name: "" },

      ListOption: {
        height: 400,
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
        // index: true,
        // selection: true,
        // selectable: (row) => {
        //   return row.show;
        // },
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
        emptyText: this.$t("aicosCommon.notData"),

        column: [
          {
            label: this.$t("kwCompetence.moduleName"), //模块名称
            prop: "name",
            search: true,
          },
          {
            label: this.$t("kwCompetence.status"), //状态
            prop: "isUse",
          },
        ],
      },
      listData: [],
      selectProps: {
        key: "id",
        label: "name",
      },
    };
  },
  methods: {
    getResData () {
      return this.selectData;
    },

    searchReset () {
      // this.$refs.tempFormRef.resetForm();

      this.query = { name: "" };
      this.onLoad(this.page);
    },
    searchChange (params /*, done*/) {
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
    currentChange (currentPage) {
      this.page.currentPage = currentPage;
    },
    sizeChange (pageSize) {
      this.page.pageSize = pageSize;
    },

    selectionChange (selection) {
      this.selectionList = selection;
    },

    selectionClear () {
      this.selectionList = [];
      //this.$refs.listRef.toggleSelection();
    },

    refreshChange () {
      this.onLoad(this.page, this.query);
    },
    onLoad (page, params = {}) {
      const postData = {
        current: page.currentPage,
        size: page.pageSize,
        ...params,
        modelName: this.query.name,
        botId: this.$store.getters.botObj.id,
      };
      this.loading = true;
      listData(postData).then((res) => {
        const data = res.data.data;
        this.page.total = data.total;
        this.listData = data.records;
        this.loading = false;
        this.listData.forEach((row) => {
          let index = this.selectData.findIndex((e) => e.id == row.id);
          row.show = true;
          if (index > -1) {
            row.show = this.selectData[index].show;
          }
        });
        //this.selectionClear();
      });
    },
    hasInRight (row) {
      let hasIn = false;
      this.selectData.map((item) => {
        if (row.id == item.id) {
          hasIn = true;
        }
      });
      return hasIn;
      //return this.selectData.some( (item) => item.id === row.id );
    },
    rowClick (row /*, column, event*/) {
      if (row.show) {
        if (!this.hasInRight(row)) {
          //console.log('追加进右侧')
          this.$refs.listRef.toggleRowSelection(row, true);
          this.selectData.push(row);
        } else {
          //console.log('从右侧删除')
          this.selectData = this.selectData.filter((item) => {
            if (!(item.id == row.id)) {
              return item;
            }
          });
          this.$refs.listRef.toggleRowSelection(row, false);
        }
      }
    },
    handleAdd (row) {
      this.rowClick(row);
    },
    handleRemove (item, index) {
      this.selectData.splice(index, 1);
      this.$refs.listRef.toggleRowSelection(item, false);
    },
    handleRemoveAll () {
      this.$refs.listRef.toggleSelection();
      this.selectData = [];
    },
    selectOne (selection, row) {
      this.rowClick(row);
    },
    selectPage () {
      this.listData.map((row) => {
        if (!this.hasInRight(row)) {
          this.rowClick(row);
        }
      });
    },

    selectAll (selection) {
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

    initData () {
      //防止数据双向绑定，影响初始化
      const tempArr = [];
      this.checkedData.map((item) => {
        tempArr.push({ ...item });
      });

      this.selectData = tempArr;
    },
  },
  mounted () {
    /*处理新规范表格的搜索*/
    const listColumn = this.ListOption.column;
    const formColumn = listColumn.filter((item) => item.search === true);
    formColumn.map((item) => {
      item.placeholder =
        (item.type == "select" ? this.$t('aicosCommon.pleaseSelect')  : this.$t('aicosCommon.pleaseInput')) + " " + item.label;
    });
    this.searchFieldList = formColumn;

    this.initData();
  },
  created () { },
  watch: {
    listData: {
      /*初始化选中*/
      handler () {
        let tempArr = [];
        this.listData.forEach((item) => {
          this.selectData.forEach((info) => {
            if (info.id == item.id) {
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
    &>.el-form-item:not(.search-from-tool) {
      width: 170px;
    }

    &> :first-child {
      margin-right: 10px;
      width: 170px;
    }
  }
}
</style>
