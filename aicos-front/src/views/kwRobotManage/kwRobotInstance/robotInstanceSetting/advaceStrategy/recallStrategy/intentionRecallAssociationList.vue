<template>
  <div>
    <el-container>
      <el-main>
        <HuilanBasicSearchbar
          style="margin-top: 0"
          :model="searchForm"
          :fields="searchFields"
          @search="handleSearch"
          @reset="searchReset"
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
              :disabled="getBtnStatus(scope.row.id) || !validatenull(scope.row.ancestors)"
              @click="handleAdd(scope.row)"
              >{{ $t("kwRobotManage.increase") }}</el-button
            >
          </template>
        </avue-crud>
      </el-main>
      <el-aside width="200px" class="selected-list">
        <h2>{{ $t("kwRobotManage.selectedList") }}</h2>
        <List
          :data="intentList"
          :props="docProps"
          @itemRemove="handleItemRemove"
        />
      </el-aside>
    </el-container>
  </div>
</template>
<script>
import List from "@/components/list";
import { intentList } from "@/api/kwKnowledgeCenter/kwIntention/index";
export default {
  name: "intentionRecallAssociationList",
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
        emptyText: this.$t("aicosCommon.notData"),
        menuWidth:80,
        column: [
          {
            label: this.$t("kwIntentionManage.intentionName"),
            prop: "intentName",
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
        intentName: "",
      },
      searchFields: [
        {
          prop: "intentName",
          placeholder:
            this.$t("aicosCommon.pleaseInput") +
            this.$t("kwIntentionManage.intentionName"),
        },
      ],
      // botId: '',
      // selectedList: [],
      intentList: [...this.selectedList] || [],
      docProps: {
        key: "id",
        label: "intentName",
      },
    };
  },
  computed: {
    topIntentIds() {
      return this.intentList.map((item) => item.id);
    },
  },
  mounted() {
    this.loadData();
  },
  methods: {
    getBtnStatus(id) {
      return this.topIntentIds.includes(id);
    },
    getSelectedInfo() {
      return {
        topIntentIds: this.topIntentIds,
        intentList: this.intentList,
      };
    },
    currentChange() {
      this.loadData();
    },
    sizeChange() {
      this.loadData();
    },
    searchReset(){
      this.searchForm.intentName = '';
      this.loadData()
    },
    async loadData() {
      // const info = {
      //   ...this.searchForm,
      // };
      const info = {
        ...this.searchForm,
        botId: this.$store.getters.botObj.id,
        classifyId: '0',
        current: this.page.currentPage,
        size: this.page.pageSize,
      };
      this.loading = true;
      const { data } = await intentList(info);
      if (data.success) {
        this.loading = false;
        const res = data.data;
        this.data = res.records;
        this.page.total = res.total;
      }
    },
    handleAdd(row) {
      this.intentList.push(row);
    },
    handleItemRemove(item, index) {
      this.intentList.splice(index, 1);
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
