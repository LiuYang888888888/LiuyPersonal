<template>
  <div>
    <avue-crud
      :option="option"
      :table-loading="loading"
      :data="listData"
      ref="listRef"
      v-model="form"
      :page.sync="page"
      :permission="permissionList"
      @current-change="currentChange"
      @size-change="sizeChange"
      @on-load="onLoad"
    >
      <!-- :page.sync="page" -->
      <template slot-scope="{ row }" slot="menu">
        <el-button type="text" size="small" @click="viewRow(row)">
          查看
        </el-button>
      </template>
      <template slot="index" slot-scope="{ index }">
        <span>{{ index + 1 }}</span>
      </template>
    </avue-crud>
  </div>
</template>
<script>
import { rankByScoreStatistic } from "@/api/exam/examManage";
import { baseURL } from "@/api/common";
export default {
  name: "AicosFrontScoreranking",
  props: {
    examId: {
      type: String,
      default: "",
    },
  },
  data() {
    return {
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
        editBtn: false,
        delBtn: false,
        viewBtn: false,
        addBtn: false,
        menuWidth: 120,
        align: "center",
        menuAlign: "center",
        column: [
          {
            label: "排名",
            prop: "index",
            sortable: true,
          },
          {
            label: "用户名",
            prop: "realName",
          },
          {
            label: "得分",
            prop: "totalScoreObtained",
          },
          {
            label: "用时",
            prop: "doTime",
          },
          {
            label: "开始考试时间",
            prop: "startTime",
          },
          {
            label: "交卷时间",
            prop: "endTime",
          },
          {
            label: "总分",
            prop: "totalScore",
          },
          {
            label: "及格分数",
            prop: "passScore",
          },
        ],
      },
    };
  },

  mounted() {},

  methods: {
    viewRow(row) {
      window.open(
        `${baseURL}#/exam/correctExam?id=` + row.id + "&type=view"
      );
    },

    currentChange(currentPage) {
      this.page.currentPage = currentPage;
    },
    sizeChange(pageSize) {
      this.page.pageSize = pageSize;
    },
    onLoad(page) {
      this.loading = true;

      const dataParam = {
        current: page.currentPage,
        size: page.pageSize,
        examId: this.examId
      };

      rankByScoreStatistic(dataParam).then((res) => {
        const dataRes = res.data.data;
        this.page.total = dataRes.total;
        this.page.pageSize = dataRes.size;
        this.page.currentPage = dataRes.current;
        this.listData = dataRes.records;
        this.listData.map((item) => {
          item.doTime = this.mistiming(this.deepClone(item.doTime));
        });
        this.loading = false;
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
};
</script>
<style lang="scss" scoped></style>
