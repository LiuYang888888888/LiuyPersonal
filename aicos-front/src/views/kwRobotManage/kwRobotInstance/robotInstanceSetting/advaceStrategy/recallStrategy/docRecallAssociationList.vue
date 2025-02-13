<template>
  <div>
    <el-container>
      <el-main>
        <HuilanBasicSearchbar
          style="margin-top: 0"
          :model="searchForm"
          :fields="searchFields"
          @search="handleSearch"
        />
        <avue-crud
          :option="option"
          :data="data"
          ref="table"
          :page.sync="page"
          :table-loading="loading"
          @current-change="currentChange"
          @size-change="sizeChange"
        >
          <template v-slot:menu="scope">
            <el-button
              size="mini"
              type="text"
              :disabled="getBtnStatus(scope.row.id)"
              @click="handleAdd(scope.row)"
              >{{ $t("kwRobotManage.increase") }}</el-button
            >
          </template>
        </avue-crud>
      </el-main>
      <el-aside width="200px" class="selected-list">
        <h2>{{ $t("kwRobotManage.selectedList") }}</h2>
        <List
          :data="docList"
          :props="docProps"
          @itemRemove="handleItemRemove"
        />
      </el-aside>
    </el-container>
  </div>
</template>
<script>
import List from "@/components/list";
import { listData } from "@/api/kwKnowledgeCenter/kwKnowledgeMangement/documentknowledge/index";
export default {
  name: "docRecallAssociationList",
  components: {
    List,
  },
  props: {
    selectedList: {
      type: Array,
      default: () => [],
    },
  },
  data() {
    return {
      option: {
        header: false,
        height: 500,
        // menu: false,
        // selection: true,
        tip: false,
        addBtn: false,
        delBtn: false,
        editBtn: false,
        menuWidth: 80,
        emptyText: this.$t("aicosCommon.notData"),
        column: [
          {
            label: this.$t("kwRobotManage.fileName"),
            prop: "fileName",
            overHidden: true,
            span: 24,
          },
        ],
      },
      data: [],
      page: {
        total: 0,
        currentPage: 1,
        pageSize: 10,
        pagerCount: 3,
      },
      loading: false,
      searchForm: {
        fileName: "",
      },
      searchFields: [
        {
          prop: "fileName",
          placeholder:
            this.$t("aicosCommon.pleaseInput") +
            this.$t("kwRobotManage.fileName"),
        },
      ],
      // botId: '',
      // selectedList: [],
      docList: [...this.selectedList] || [],
      docProps: {
        key: "id",
        label: "fileName",
      },
    };
  },
  computed: {
    docIds() {
      return this.docList.map((item) => item.id);
    },
  },
  mounted() {
    this.loadData();
  },
  methods: {
    getBtnStatus(id) {
      return this.docIds.includes(id);
    },
    getSelectedInfo() {
      return {
        docIds: this.docIds,
        docList: this.docList,
      };
    },
    currentChange() {
      this.loadData();
    },
    sizeChange() {
      this.loadData();
    },
    async loadData() {
      const info = {
        knowledgeStatus: 1,
        ...this.searchForm,
      };
      this.loading = true;
      const { data } = await listData(
        this.page.currentPage,
        this.page.pageSize,
        info
      );
      if (data.success) {
        this.loading = false;
        const res = data.data;
        this.data = res.records;
        this.page.total = res.total;
      }
    },
    handleAdd(row) {
      this.docList.push(row);
    },
    handleItemRemove(item, index) {
      this.docList.splice(index, 1);
    },
    handleSearch() {
      this.loadData();
    },
  },
};
</script>

<style scoped lang="scss">
.selected-list {
  padding-left: 10px;

  h2 {
    font-size: 16px;
    line-height: 32px;
    margin: 0;
    text-align: center;
    background: #f7f9fb;
  }

  /deep/.basic-list {
    height: 520px;
    overflow-y: auto;
    border: 1px solid #f3f5f8;
  }
}
</style>
