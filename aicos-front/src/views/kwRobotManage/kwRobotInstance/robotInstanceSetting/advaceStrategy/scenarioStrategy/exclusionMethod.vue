<template>
  <div>
    <div class="kwpolicy-table-header">
      <div class="kwpolicy-search-header-wrap clearfix">
        <div class="kwpolicy-operation-btns">
          <el-button type="success" class="kw-build-button kw-btn-green" size="small"
            @click="openQuestionAddDialog('add')">
            {{ $t("kwRobotManage.addQuestionMethod") }}
          </el-button>
          <el-button type="success" class="kw-build-button kw-btn-blue" size="small" @click="delQuestion()">
            {{ $t("aicosCommon.batchDeleteBtn") }}
          </el-button>
        </div>
        <div class="kwpolicy-search-input-wrap clearfix">
          <div class="kwpolicy-search-input-row">
            <div class="kwpolicy-search-value">
              <div class="kwpolicy-search-input">
                <el-input :placeholder="$t('kwRobotManage.searchContentTips')" size="small"
                  v-model="queryObj.content"></el-input>
                <div class="kwpolicy-search-buttons">
                  <el-button type="primary" size="small" class="kw-search-btn" @click="searchChange">
                    <i class="el-icon-search"></i>
                  </el-button>
                  <el-button size="small" class="kw-reset-btn" @click="searchReset">
                    <i class="aicosicon aicos-icon-clear"></i>
                  </el-button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <!-- :page.sync="userQuestionTablePage" -->
    <avue-crud :option="userQuestionTableOption" :table-loading="loading" :data="userQuestionTableData"
      ref="kwpolicyTable" :permission="permissionList" @selection-change="selectionChange" @current-change="currentChange"
      @size-change="sizeChange" @on-load="onLoad">
      <template slot-scope="scope" slot="menu">
        <el-button type="text" size="small" @click.stop="openEditQuestion(scope.row, scope.index)">
          {{ $t("aicosCommon.editBtn") }}
        </el-button>
        <el-button type="text" size="small" style="color: #ff0000"
          @click.stop="delQuestion(scope.row, scope.index, 'only')">
          {{ $t("aicosCommon.delBtn") }}
        </el-button>
      </template>
    </avue-crud>
    <!-- 新增问法 -->
    <HuilanDialog append-to-body :visible.sync="isAddQuestioningDialog" width="600px" trigger="click">
      <AddQuestioning v-if="isAddQuestioningDialog" :questionType="questionType" :sceneType="sceneType"
        :questioningType="'add'" :strategyId="strategyId" @addOrEditEmitEvent="addOrEditEmitEvent"
        ref="addEditQuestioning" />
      <template v-slot:footer>
        <el-button size="small" @click="isAddQuestioningDialog = false">{{
          $t("aicosCommon.cancelBtn")
        }}</el-button>
        <el-button size="small" type="primary" @click="saveAddUpdataQuestioning">{{ $t("aicosCommon.saveBtn")
        }}</el-button>
      </template>
    </HuilanDialog>
    <!-- 编辑问法 -->
    <HuilanDialog append-to-body :visible.sync="isEditQuestioningDialog" width="600px" trigger="click">
      <AddQuestioning v-if="isEditQuestioningDialog" :questioningId="questioningId" :questioningType="'edit'"
        :questionType="questionType" :sceneType="sceneType" :strategyId="strategyId" :questioningObj="questioningObj"
        @addOrEditEmitEvent="addOrEditEmitEvent" ref="addEditQuestioning" />
      <template v-slot:footer>
        <el-button size="small" @click="isEditQuestioningDialog = false">{{
          $t("aicosCommon.cancelBtn")
        }}</el-button>
        <el-button size="small" type="primary" @click="saveAddUpdataQuestioning">{{ $t("aicosCommon.saveBtn")
        }}</el-button>
      </template>
    </HuilanDialog>
  </div>
</template>
<script>
// import {
//   getSceneList,
//   delScene,
// } from "@/api/kwRobot/kwRobotInstance/robotInstanceSetting/advaceStrategy/scenarioStrategy";
import { deepClone } from "@/util/util";
import AddQuestioning from "./addQuestioning";
export default {
  //获取父页面传的数据
  props: {
    questionType: {
      type: String,
      default: "1"
    },
    sceneType: {
      type: String,
      default: "1"
    },
    strategyId: {
      type: String
    },
    exclusionData: {
      type: Array,
      default: () => []
    }
  },
  inject: ["desktopWindow", "desktop"],
  data () {
    return {
      allWindowTopBodyHeight: 0, // 窗口内容的高度
      ruleId: "",
      // strategyId: "", //策略id
      kwpolicyUpdataData: {}, //编辑携带数据
      isAddQuestioningDialog: false, //新增文件
      isEditQuestioningDialog: false, //编辑文件
      loading: false,
      queryObj: {
        content: ""
      },
      userQuestionTablePage: {
        pageSize: 10,
        currentPage: 1,
        total: 1
      },
      copyuserQuestionTableData: this.exclusionData,
      userQuestionTableData: this.exclusionData,
      userQuestionTableOption: {
        searchShowBtn: false,
        refreshBtn: false,
        tip: false,
        searchShow: true,
        searchMenuSpan: 6,
        dialogWidth: "60%",
        columnBtn: false,
        border: true,
        index: false,
        addBtn: false,
        selection: true,
        editBtn: false,
        delBtn: false,
        viewBtn: false,
        menuWidth: 200,
        menuAlign: "center",
        dialogClickModal: false,
        labelWidth: 120,
        height: 400,
        emptyText: this.$t("aicosCommon.notData"),
        column: [
          {
            label: this.$t('kwRobotManage.exclusionQuestion') + this.$t('kwRobotManage.contain'),
            prop: "content",
            span: 12,
            minWidth: 280,
            showWordLimit: true,
            overHidden: true
          }
        ]
      },
      selectionList: [],
      vesionRecordIsShow: false
    };
  },
  mounted () {
    if (this.desktopWindow) {
      this.allWindowTopBodyHeight = this.desktopWindow.$el.getElementsByClassName(
        "desk-window-inner"
      )[0].offsetHeight;

      this.desktopWindow.$on("resize", this.desktopWindowResize);
    }
    this.$nextTick(() => {
      this.userQuestionTableData = deepClone(this.exclusionData);
      this.copyuserQuestionTableData = deepClone(this.exclusionData);
    });
  },
  watch: {
    sceneType (newValue /*, oldValue*/) {
      this.sceneType = newValue;
      this.onLoad();
    }
  },
  components: {
    AddQuestioning
  },
  methods: {
    // 窗口改变，动态改变高度
    desktopWindowResize () {
      this.allWindowTopBodyHeight = this.desktopWindow.$el.getElementsByClassName(
        "desk-window-inner"
      )[0].offsetHeight;
    },

    onLoad () {
      // this.loading = true;
      // var obj = {
      //   strategyId: this.strategyId,
      //   questionType: "2",
      //   sceneType: this.sceneType,
      //   current: this.userQuestionTablePage.currentPage,
      //   size: this.userQuestionTablePage.pageSize,
      //   content: this.queryObj.content,
      // };
      // getSceneList(obj).then((resData) => {
      //   resData = resData.data;
      //   if (resData.code == 200) {
      //     this.userQuestionTableData = resData.data.records;
      //     this.userQuestionTablePage.total = resData.data.total;
      //     this.loading = false;
      //   }
      // });
    },

    //搜索
    searchChange () {
      // this.onLoad();
      //表格用原表格的数据 即 用于搜索的总数据
      this.userQuestionTableData = deepClone(this.copyuserQuestionTableData);
      //获取到查询的值，并使用toLowerCase():把字符串转换成小写，让模糊查询更加清晰
      let _search = this.queryObj.content.toLowerCase();
      let newListData = []; // 用于存放搜索出来数据的新数组
      if (_search) {
        //filter 过滤数组
        this.userQuestionTableData.filter(item => {
          // newListData中 没有查询的内容，就添加到newListData中
          if (item.content.toLowerCase().indexOf(_search) !== -1) {
            newListData.push(item);
          }
        });
        // this.ruleTablePage.total = newListData.length;
        this.userQuestionTableData = newListData;
      }
    },

    // 重置
    searchReset () {
      this.queryObj = {
        content: ""
      };
      // this.onLoad();
      this.userQuestionTableData = deepClone(this.copyuserQuestionTableData);
    },

    //新增问法
    openQuestionAddDialog () {
      this.questioningType = "add";
      this.isAddQuestioningDialog = true;
    },

    // 编辑问法
    openEditQuestion (row) {
      this.questioningType = "edit";
      this.questioningId = row.id;
      this.questioningObj = row;
      this.isEditQuestioningDialog = true;
    },

    //保存问法
    saveAddUpdataQuestioning () {
      this.$refs.addEditQuestioning.submit();
    },

    // 子组件的触发保存成功后关闭弹窗
    addOrEditEmitEvent (obj) {
      // this.onLoad();
      // this.isAddQuestioningDialog = flag;
      // this.isEditQuestioningDialog = flag;
      if (obj.id === "") {
        obj.id = new Date().getTime();
        this.userQuestionTableData.push(obj);
      } else {
        this.userQuestionTableData.map((item, index) => {
          if (item.id === obj.id) {
            item = { ...item, ...obj };
            this.userQuestionTableData.splice(index, 1, item);
          }
        });
      }
      this.userQuestionTablePage.total = this.userQuestionTableData.length;
      this.copyuserQuestionTableData = deepClone(this.userQuestionTableData);
      this.isAddQuestioningDialog = false;
      this.isEditQuestioningDialog = false;
    },

    // 删除问法
    delQuestion (row, index, type) {
      // var ids = [];
      let isOnlyStr = "";
      if (type == "only") {
        // ids.push(row.id);
        isOnlyStr = this.$t("kwRobotManage.should");
      } else {
        if (this.selectionList.length == 0) {
          this.$message({
            type: "warning",
            message: this.$t("kwRobotManage.selectQuestionMethod")
          });
          return false;
        }
        // this.selectionList.forEach((item) => {
        //   ids.push(item.id);
        // });
        isOnlyStr = this.$t("kwRobotManage.these");
      }
      // var obj = {
      //   ids: ids,
      //   questionType: this.questionType,
      //   sceneType: this.sceneType,
      //   strategyId: this.strategyId,
      // };
      this.$confirm(`${this.$t("kwRobotManage.deletionTips")}${isOnlyStr} ${this.$t(
        "kwRobotManage.questioningMethod"
      )}`, {
        confirmButtonText: this.$t("aicosCommon.confirmBtn"),
        cancelButtonText: this.$t("aicosCommon.cancelBtn"),
        type: "warning"
      })
        .then(() => {
          // return delScene(obj);
          if (type == "only") {
            this.userQuestionTableData.splice(index, 1);
          } else {
            this.selectionList.forEach(item => {
              this.userQuestionTableData.splice(
                this.userQuestionTableData.indexOf(item),
                1
              );
            });
          }
          this.userQuestionTablePage.total = this.userQuestionTableData.length;
          this.copyuserQuestionTableData = deepClone(
            this.userQuestionTableData
          );
        })
        .then(() => {
          this.$message({
            type: "success",
            message: this.$t("aicosCommon.deleteSuccessTip")
          });
          this.onLoad();
        });
    },

    selectionChange (list) {
      this.selectionList = list;
    },
    selectionClear () {
      this.selectionList = [];
      this.$refs.crud.toggleSelection();
    },
    currentChange (currentPage) {
      this.userQuestionTablePage.currentPage = currentPage;
    },
    sizeChange (pageSize) {
      this.userQuestionTablePage.pageSize = pageSize;
    }
  }
};
</script>

<style lang="scss" scoped>
.kwpolicy-table-header {
  .kwpolicy-search-header-wrap {
    /*position: relative;
      padding-left: 120px;
      padding-right: 315px;*/

    .kwpolicy-search-select {
      position: absolute;
      left: 0;
      top: 0;
      width: 110px;
    }

    .kwpolicy-search-value {
      position: relative;

      .kwpolicy-search-input {
        /*width: 80%;*/
        min-width: 250px;
        display: inline-block;
        padding-right: 90px;
        position: relative;
      }

      .kwpolicy-search-buttons {
        position: absolute;
        right: 0;
        top: 0;

        .kw-search-btn {
          padding: 5px;

          i {
            font-size: 20px;
          }
        }

        .kw-reset-btn {
          padding: 5px;

          i {
            font-size: 20px;
          }
        }
      }
    }

    .kwpolicy-search-input-wrap {
      /*display: flex;
        justify-content: end;
        align-items: center;*/
      margin-top: 20px;

      .kwpolicy-search-input-row {
        float: right;
        position: relative;
        padding-left: 120px;
        padding-bottom: 20px;
      }
    }

    .kwpolicy-operation-btns {
      /* position: absolute;
        right: 0;
        top: 0;*/
      text-align: right;

      .el-dropdown {
        margin-left: 10px;
      }
    }
  }

  .choose-dismension {
    .choose-dismen-ul {
      display: flex;
      margin: 0;
      padding: 0;
      list-style: none;
      flex-flow: row wrap;

      li {
        margin: 0 8px 10px 0;
        border: 1px solid #308dee;
        height: 30px;
        line-height: 30px;
        padding: 0 10px;
        border-radius: 5px;
        font-size: 14px;

        span {
          display: inline-block;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .first-text {
          max-width: 100px;
        }

        .delimiter-text {
          vertical-align: top;
          margin-top: 5px;
          font-style: normal;
        }

        .last-text {
          color: #308dee;
          max-width: 120px;
        }

        .choose-del-icon {
          color: #308dee;
          display: inline-block;
          margin-left: 5px;
          cursor: pointer;
          vertical-align: top;
          margin-top: 8px;
        }
      }
    }
  }
}

/deep/ .avue-crud__menu {
  display: none;
}

.kwpolicy-save-btn {
  width: 140px;
  margin: auto;
}
</style>
