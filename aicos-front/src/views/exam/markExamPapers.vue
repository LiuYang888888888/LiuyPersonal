<template>
  <HuilanBasic>
    <HuilanBasicSearchbar
      :model="searchForm"
      :fields="searchFieldList"
      @reset="searchReset"
      @search="searchChange"
    >
      <!-- <template v-slot:appendTool>
        <el-button type="default" @click="configColumn"
          ><i class="el-icon-s-operation"></i
        ></el-button>
      </template> -->
    </HuilanBasicSearchbar>
    <avue-crud
      :option="option"
      :table-loading="loading"
      :data="listData"
      ref="listRef"
      v-model="form"
      :page.sync="page"
      @current-change="currentChange"
      @size-change="sizeChange"
      @on-load="onLoad"
    >
      <template slot-scope="{ row }" slot="menu">
        <el-button type="text" size="small" @click="readOverClick(row)"
          >批阅试卷
        </el-button>
      </template>
    </avue-crud>
  </HuilanBasic>
</template>
<script>
import { getList } from "@/api/exam/markExamPapers";
import { findNodeByVal } from "@/util/qsgCommon";
export default {
  inject: ["desktopWindow", "desktop"],
  data() {
    return {
      // search table
      searchFieldList: [
        {
          prop: "keyWords",
          placeholder: "请输入考试名称",
        },
      ],
      searchForm: {
        keyWords: "",
      },
      // table
      selectRow: {},
      form: {},
      loading: true,
      listData: [],
      page: {
        pageSize: 10,
        currentPage: 1,
        total: 0,
        pageSizes: [10, 20, 30, 40, 50, 100],
      },
      option: {
        header: false,
        addBtn: false,
        editBtn: false,
        delBtn: false,
        viewBtn: false,
        menuWidth: 120,
        align: "center",
        menuAlign: "center",
        column: [
          {
            label: "考试名称",
            prop: "testName",
          },
          {
            label: "总分数",
            prop: "totalScore",
          },
          {
            label: "已交卷",
            prop: "submitNum",
          },
          {
            label: "未批阅",
            prop: "noReviewNum",
          },
          {
            label: "开始时间",
            prop: "startTime",
          },
          {
            label: "结束时间",
            prop: "endTime",
          },
        ],
      },
    };
  },

  mounted() {},

  methods: {
    readOverClick(row) {
      if (this.desktop) {
        const menuAll = this.$store.state.user.menuAll;

        let menuData = {};

        let winCode = "ExamWinAnswerSheet";
        menuData = findNodeByVal(
          menuAll,
          "code",
          "exam-answerSheet",
          "menuList"
        );
        const formWinParm = {
          ...menuData,
          menuName:  row.testName,
          query: {
            examId: row.testId,
          },
          height: "100%",
          width: "100%",
        };

        const formWin = {
          visible: true,
          zIndex: this.desktop.winList.length + this.desktop.baseZindex,
          data: formWinParm,
          commonParm: winCode,
        };

        //删除已打开的comFormWin窗口
        if (
          this.desktop.winList.filter((item) => item.commonParm == winCode)
            .length > 0
        ) {
          this.desktop.winList = this.desktop.winList.filter(
            (item) => item.commonParm != winCode
          );
        }

        this.desktop.winList.push(formWin);
      } else {
        this.$router.push({
          path: "./answerSheet",
          query: {
            examId: row.testId,
          },
        });
      }
    },
    searchReset() {
      this.searchForm = {};
      this.onLoad(this.page);
    },
    searchChange() {
      this.onLoad(this.page);
    },
    currentChange(currentPage) {
      this.page.currentPage = currentPage;
    },
    sizeChange(pageSize) {
      this.page.pageSize = pageSize;
    },
    onLoad(page) {
      this.loading = true;
      let obj = {
        ...this.searchForm,
        current: page.currentPage,
        size: page.pageSize,
      };
      getList(obj).then((res) => {
        const dataRes = res.data.data;
        this.page.total = dataRes.total;
        this.page.pageSize = dataRes.size;
        this.page.currentPage = dataRes.current;
        this.listData = dataRes.records;
        this.loading = false;
      });
    },
  },
};
</script>
<style lang="scss" scoped></style>
