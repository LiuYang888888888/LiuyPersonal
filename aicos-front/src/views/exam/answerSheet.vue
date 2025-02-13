<template>
  <HuilanBasic>
    <HuilanBasicSearchbar
      :model="searchForm"
      :fields="searchFieldList"
      @reset="searchReset"
      @search="searchChange"
    >
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
        <el-button type="text" size="small" @click="viewExam(row)"
          >查看批阅</el-button
        >
      </template>
    </avue-crud>
  </HuilanBasic>
</template>
<script>
import { baseURL } from "@/api/common";
import { getAnswerSheet } from "@/api/exam/markExamPapers";
import { deepClone } from "@/util/util";
export default {
  name: "AicosFrontAnswerSheet",

  inject: ["desktopWindow", "desktop"],
  props: {
    propParams: {
      type: Object,
      default() {
        return {};
      },
    },
  },
  data() {
    return {
      // search table
      searchFieldList: [
        {
          prop: "keyWords",
          placeholder: "请输入用户名",
        },
        {
          prop: "status",
          placeholder: "阅卷状态",
          type: "select",
          dicData: [
            {
              label: "已阅卷",
              value: 1,
            },
            {
              label: "未阅卷",
              value: 0,
            },
          ],
        },
      ],
      searchForm: {
        status: "",
        keyWords: "",
      },
      //table
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
        viewBtn: false,
        delBtn: false,
        menuWidth: 120,
        align: "center",
        menuAlign: "center",
        column: [
          {
            label: "用户名",
            prop: "realName",
          },
          {
            label: "考试时长",
            prop: "doTime",
          },
          {
            label: "客观分",
            prop: "myTotalScore",
          },
          {
            label: "主观分",
            prop: "reviewTotalScore",
          },
          {
            label: "总分",
            prop: "readScore",
          },
          {
            label: "状态",
            prop: "reviewStatus",
            type: "select",
            dicData: [
              {
                label: "已阅卷",
                value: 1,
              },
              {
                label: "未阅卷",
                value: 0,
              },
            ],
          },
        ],
      },
      examId: "",
    };
  },

  mounted() {
    if (this.propParams.examId) {
      this.examId = this.propParams.examId;
    } else if (this.desktop) {
      this.examId = this.desktopWindow.data.query.examId;
    } else {
      this.examId = this.$route.query.examId;
    }
  },

  methods: {
    viewExam(row) {
      window.open(`${baseURL}#/exam/correctExam?id=` + row.id);
    },
    searchReset() {
      this.searchForm = {};
      this.onLoad(this.page);
    },
    searchChange() {
      this.page.currentPage = 1;
      this.onLoad(this.page);
    },
    currentChange(currentPage) {
      this.page.currentPage = currentPage;
    },
    sizeChange(pageSize) {
      this.page.pageSize = pageSize;
    },
    onLoad(page) {
      if (this.propParams.examId) {
        this.examId = this.propParams.examId;
      } else if (this.desktop) {
        this.examId = this.desktopWindow.data.query.examId;
      } else {
        this.examId = this.$route.query.examId;
      }
      this.loading = false;
      let obj = {
        ...this.searchForm,
        testId: this.examId,
        current: page.currentPage,
        size: page.pageSize,
      };
      getAnswerSheet(obj).then((res) => {
        const dataRes = res.data.data;
        this.page.total = dataRes.total;
        this.page.pageSize = dataRes.size;
        this.page.currentPage = dataRes.current;
        this.listData = dataRes.records;
        this.loading = false;
        this.listData.map((item) => {
          item.doTime = this.mistiming(deepClone(item.doTime));
          item.readScore =
            Number(item.myTotalScore) + Number(item.reviewTotalScore);
        });
      });
    },
    mistiming(timeStamp) {
      const newTime = this.formateTimeStamp(timeStamp);
      const str = newTime.hour + ":" + newTime.min + ":" + newTime.seconds;
      return str;
    },

    formateTimeStamp(timeStamp) {
      let hour, min, seconds;
      hour = parseInt(timeStamp / (60 * 60)); // 计算整数小时数
      let afterHour = timeStamp - hour * 60 * 60; // 取得算出小时数后剩余的秒数
      min = parseInt(afterHour / 60); // 计算整数分
      seconds = parseInt(timeStamp - hour * 60 * 60 - min * 60); // 取得算出分后剩余的秒数

      if (hour < 10) {
        hour = "0" + hour;
      }

      if (min < 10) {
        min = "0" + min;
      }

      if (seconds < 10) {
        seconds = "0" + seconds;
      }

      const restStamp = {
        hour: hour,
        min: min,
        seconds: seconds,
      };
      return restStamp;
    },
  },
  watch:{
    "desktopWindow.data": {
      handler() {
        this.onLoad(this.page)
      },
      deep: true,
    },
  }
};
</script>
<style lang="scss" scoped></style>
