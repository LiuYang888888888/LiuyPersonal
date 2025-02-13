<template>
  <div>
    <div class="resultDetailHeader">
      <div class="resultDetailTitle">
        <!-- <img class="img" src="./animation/error.png" alt="" /> -->
        <span class="tips">本次扫描共发现{{ waitDealNum }}个待处理项</span>
      </div>
    </div>
    <div class="resultDetailTable">
      <avue-crud
        :data="data"
        :option="option"
        @on-load="onLoad"
      >
        <template slot="menuLeft" slot-scope="{ size }">
          <h3>检测结果</h3>
        </template>
        <template slot-scope="scope" slot="menu">
          <div class="deal">
            <span @click.stop="goToDealList(scope.row, scope.index)">{{
              scope.row.waitDealNumber
            }}</span>
          </div>
        </template>
      </avue-crud>
    </div>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import { checkResult } from "@/api/kwRobot/kwRobotTrain/index";
export default {
  props: {
    dealNum: {
      type: Number,
      default: () => {
        return 0;
      },
    },
  },
  async mounted() {},
  data() {
    return {
      waitDealNum: 0,
      option: {
        // refreshBtn: false,
        tip: false,
        // selection: true,
        menuTitle: "待处理",
        height: 400,
        editBtn: false,
        delBtn: false,
        addBtn: false,
        columnBtn: false, //列显隐按钮
        refreshBtn: false, //刷新按钮
        border: true, //表格是否有边框
        align: "center",
        menuAlign: "center",
        menuWidth: 320,
        // height: 640,
        column: [
          {
            label: "检测范围",
            prop: "detectionScope",
            overHidden: true,
          },
          {
            label: "检测项",
            prop: "detectionItem",
            overHidden: true,
          },
        ],
      },
      data: [],
    };
  },
  computed: {
    ...mapGetters(["permission", "botObj"]),
    // permissionList() {
    //   return {
    //     // tagLibaddBtn: this.treeDeptId !== '0' && this.vaildData(this.permission['system-user-save'], false),
    //     tableBeginCheckBtn: this.vaildData(this.permission['health-check-create'], false),//开始检测
    //     tableToDealBtn: this.vaildData(this.permission['health-check-todeal'], false),//去处理
    //     tableSaveBtn: this.vaildData(this.permission['health-check-save'], false),//保存
    //     tableItemFinishBtn: this.vaildData(this.permission['health-check-itemfinish'], false),//检测项完成
    //     tableIgnoreBtn: this.vaildData(this.permission['health-check-ignore'], false),//忽略
    //     tableFinishBtn: this.vaildData(this.permission['health-check-finish'], false),//检测完成
    //     tableGiveUpBtn: this.vaildData(this.permission['health-check-giveup'], false),//放弃处理
    //     tableCancelBtn: this.vaildData(this.permission['health-check-cancel'], false),//取消检测
    //   };
    // },
    // //区分服务局和其他机构
    // isOtherDept() {
    //   return this.COCOdeptInfo.id == '10001' || this.userInfo.isAdmin == '1'
    // }
  },
  methods: {
    async onLoad() {
      const info = {
        id: this.botObj.id,
      };
      const result = await checkResult(info);
      if (result.data.code == 200) {
        this.data = result.data.data;
        this.data.forEach((item) => {
          this.waitDealNum += item.waitDealNumber;
        });
      }
    },
    goToDealList(row/*, index*/) {
      if (row.detectionItem == "未设置展示字段") {
        this.$emit("toDealTable", row);
      } else {
        this.$emit("toDealList", row);
      }
    },
    // async finishTask() {
    //   await finnish();
    //   this.$emit("completeTask");
    // },
  },
};
</script>

<style lang="scss" scoped>
.resultDetailHeader {
  display: flex;
  justify-content: space-between;
  margin-top: 10px;
  .img {
    width: 24px;
    margin-right: 15px;
  }
  .tips {
    font-size: 24px;
    color: red;
  }
}
.deal {
  color: red;
  cursor: pointer;
}
</style>
