<template>
  <basic-container class="kwpolicy-content">
    <el-collapse v-model="activeNames" class="setting-collapse">
      <el-collapse-item :title="$t('kwRobotManage.textProcessing')" name="1">
        <div class="kwpolicy-table-header">
          <div class="kwpolicy-operation-btns">
            <el-button type="success" class="kw-build-button kw-btn-green" size="small" @click="openRuleAddDialog('add')">
              {{ $t('kwRobotManage.addRules') }}
            </el-button>
            <el-button type="success" class="kw-build-button kw-btn-blue" size="small" @click="delRule()">
              {{ $t('aicosCommon.batchDeleteBtn') }}
            </el-button>
          </div>
        </div>
        <!-- :page.sync="ruleTablePage" -->
        <avue-crud :option="ruleTableOption" :table-loading="loading" :data="phraseNormalizeDic" ref="kwpolicyTable"
          :permission="permissionList" @selection-change="selectionChange" @current-change="currentChange"
          @size-change="sizeChange" @on-load="onLoad">
          <template slot="menuLeft">
            <div class="kwpolicy-container-tip">
              {{ $t('kwRobotManage.normalizeTips') }}
            </div>
          </template>
          <template slot="menuRight">
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
          </template>
          <template slot-scope="scope" slot="menu">
            <el-button type="text" size="small" @click.stop="openEditRule(scope.row, scope.index)">
              {{ $t('aicosCommon.editBtn') }}
            </el-button>
            <el-button type="text" size="small" style="color: #ff0000"
              @click.stop="delRule(scope.row, scope.index, 'only')">
              {{ $t('aicosCommon.delBtn') }}
            </el-button>
          </template>
        </avue-crud>
      </el-collapse-item>
      <el-collapse-item :title="$t('kwRobotManage.intentMatching')" name="2">
        <el-slider class="recall-slider" :min="0" :max="1" :step="0.01" :marks="marks" :format-tooltip="formatTooltip"
          v-model="intentClassifySetting.threshold" />
        <p class="recall-slider-tip">
          <i>●</i>{{ $t('kwRobotManage.unIdentifyTips') }}
        </p>
        <p class="recall-slider-tip">
          <i class="recall-color">●</i>{{ $t('kwRobotManage.identifyTips') }}
        </p>
      </el-collapse-item>
    </el-collapse>

    <div class="kwpolicy-save-btn">
      <el-button size="small" type="primary" @click="savepolicy">{{
        $t("aicosCommon.saveBtn")
      }}</el-button>
    </div>
    <!-- 新增规则 -->
    <HuilanDialog append-to-body :visible.sync="isShowAddRuleDialog" width="600px" trigger="click">
      <AddRule v-if="isShowAddRuleDialog" :ruleType="'add'" :strategyId="strategyId"
        @addOrEditEmitEvent="addOrEditEmitEvent" ref="addEditRule" />
      <template v-slot:footer>
        <el-button size="small" @click="isShowAddRuleDialog = false">{{
          $t("aicosCommon.cancelBtn")
        }}</el-button>
        <el-button size="small" type="primary" @click="saveAddUpdataRule">{{
          $t("aicosCommon.saveBtn")
        }}</el-button>
      </template>
    </HuilanDialog>
    <!-- 编辑规则 -->
    <HuilanDialog append-to-body :visible.sync="isShowEditRuleDialog" width="600px" trigger="click">
      <AddRule v-if="isShowEditRuleDialog" :ruleId="ruleId" :ruleType="'edit'" :strategyId="strategyId"
        :ruleUpdataObj="ruleUpdataObj" @addOrEditEmitEvent="addOrEditEmitEvent" ref="addEditRule" />
      <template v-slot:footer>
        <el-button size="small" @click="isShowEditRuleDialog = false">{{
          $t("aicosCommon.cancelBtn")
        }}</el-button>
        <el-button size="small" type="primary" @click="saveAddUpdataRule">{{
          $t("aicosCommon.saveBtn")
        }}</el-button>
      </template>
    </HuilanDialog>
  </basic-container>
</template>
<script>
import { mapGetters } from "vuex";
import { deepClone } from "@/util/util";
import AddRule from "./addRule";
export default {
  inject: ["desktopWindow", "desktop"],
  props: {
    fatherData: {
      type: Object,
      default: () => { },
    },
  },
  data () {
    const { intentClassifySetting, phraseNormalizeDic } = deepClone(this.fatherData);
    // console.log("phraseNormalizeDic", phraseNormalizeDic);
    phraseNormalizeDic.forEach((item, index) => {
      item.id = new Date().getTime() + index;
      item.originalCount = item.synonymousPhrases.length;
    });
    return {
      intentClassifySetting,
      activeNames: ["1", "2"],
      allWindowTopBodyHeight: 0, // 窗口内容的高度
      botId: "",
      ruleId: "",
      strategyId: "", //策略id
      isShowAddRuleDialog: false, //新增文件
      isShowEditRuleDialog: false, //编辑文件
      loading: false,
      queryObj: {
        content: "",
      },
      ruleTablePage: {
        pageSize: 10,
        currentPage: 1,
        total: 1,
      },
      phraseNormalizeDic,
      copyTableData: deepClone(phraseNormalizeDic),
      ruleTableOption: {
        height: "400px",
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
        emptyText: this.$t("aicosCommon.notData"),
        column: [
          {
            label: this.$t('kwRobotManage.standardValue'),
            prop: "standardPhrase",
            span: 12,
            minWidth: 280,
            showWordLimit: true,
            overHidden: true,
          },
          {
            label: this.$t('kwRobotManage.originalValue'),
            prop: "originalCount",
            span: 12,
            minWidth: 280,
            showWordLimit: true,
            overHidden: true,
          },
        ],
      },
      selectionList: [],
      vesionRecordIsShow: false,
    };
  },
  mounted () {
    // console.log(this.phraseNormalizeDic);
    if (this.desktopWindow) {
      this.allWindowTopBodyHeight =
        this.desktopWindow.$el.getElementsByClassName(
          "desk-window-inner"
        )[0].offsetHeight;

      this.desktopWindow.$on("resize", this.desktopWindowResize);
    }
  },
  components: {
    AddRule,
  },
  methods: {
    formatTooltip (val) {
      return `${Math.floor(val * 100)}%`;
    },
    // 保存数据时整理数据格式
    savepolicy () {
      let arr = [];
      this.copyTableData.map((item) => {
        let obj = {};
        obj.synonymousPhrases = item.synonymousPhrases;
        obj.standardPhrase = item.standardPhrase;
        arr.push(obj);
      });
      let obj = {
        phraseNormalizeDic: arr,
        intentClassifySetting: this.intentClassifySetting,
      };
      this.$emit("fatherEvent", obj);
    },
    // 窗口改变，动态改变高度
    desktopWindowResize () {
      this.allWindowTopBodyHeight =
        this.desktopWindow.$el.getElementsByClassName(
          "desk-window-inner"
        )[0].offsetHeight;
    },

    // 搜索
    searchChange () {
      // this.onLoad();
      //表格用原表格的数据 即 用于搜索的总数据
      this.phraseNormalizeDic = deepClone(this.copyTableData);
      //获取到查询的值，并使用toLowerCase():把字符串转换成小写，让模糊查询更加清晰
      let _search = this.queryObj.content.toLowerCase();
      let newListData = []; // 用于存放搜索出来数据的新数组
      if (_search) {
        //filter 过滤数组
        this.phraseNormalizeDic.filter((item) => {
          // newListData中 没有查询的内容，就添加到newListData中
          if (item.standardPhrase.toLowerCase().indexOf(_search) !== -1) {
            newListData.push(item);
          }
        });
        this.ruleTablePage.total = newListData.length;
        this.phraseNormalizeDic = newListData;
      }
    },

    // 重置
    searchReset () {
      this.queryObj = {
        content: "",
      };
      this.phraseNormalizeDic = deepClone(this.copyTableData);
    },

    //新增文件
    openRuleAddDialog () {
      this.ruleType = "add";
      this.isShowAddRuleDialog = true;
    },

    // 编辑文件
    openEditRule (row) {
      this.ruleType = "edit";
      this.ruleId = row.id;
      this.ruleUpdataObj = row;
      this.isShowEditRuleDialog = true;
    },

    //保存文件
    saveAddUpdataRule () {
      this.$refs.addEditRule.submit();
    },

    // 子组件的触发保存成功后关闭弹窗
    addOrEditEmitEvent (obj) {
      if (obj.id === "") {
        obj.id = new Date().getTime();
        this.phraseNormalizeDic.push(obj);
      } else {
        this.phraseNormalizeDic.map((item, index) => {
          if (item.id === obj.id) {
            item = { ...item, ...obj };
            this.phraseNormalizeDic.splice(index, 1, item);
          }
        });
      }
      this.ruleTablePage.total = this.phraseNormalizeDic.length;
      this.copyTableData = deepClone(this.phraseNormalizeDic);
      this.isShowAddRuleDialog = false;
      this.isShowEditRuleDialog = false;
    },

    // 删除规则
    delRule (row, index, type) {
      let isOnlyStr = "";
      if (type == "only") {
        isOnlyStr = this.$t('kwRobotManage.should');
      } else {
        if (this.selectionList.length == 0) {
          this.$message({
            type: "warning",
            message: this.$t('kwRobotManage.selectDataTips'),
          });
          return false;
        }
        isOnlyStr = this.$t('kwRobotManage.these');
      }
      this.$confirm(`${this.$t('kwRobotManage.deletionTips')} ${isOnlyStr}${this.$t('kwRobotManage.data')}?`, {
        confirmButtonText: this.$t("aicosCommon.confirmBtn"),
        cancelButtonText: this.$t("aicosCommon.cancelBtn"),
        type: "warning",
      })
        .then(() => {
          if (type == "only") {
            this.phraseNormalizeDic.splice(index, 1);
          } else {
            this.selectionList.forEach((item) => {
              this.phraseNormalizeDic.splice(
                this.phraseNormalizeDic.indexOf(item),
                1
              );
            });
          }
          this.ruleTablePage.total = this.phraseNormalizeDic.length;
          this.copyTableData = deepClone(this.phraseNormalizeDic);
        })
        .then(() => {
          this.$message({
            type: "success",
            message: this.$t("aicosCommon.deleteSuccessTip"),
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
      this.ruleTablePage.currentPage = currentPage;
    },
    sizeChange (pageSize) {
      this.ruleTablePage.pageSize = pageSize;
    },
  },
  computed: {
    // 计算属性
    ...mapGetters(["botObj", "instanceObj"]),
    marks () {
      const val = this.intentClassifySetting.threshold;
      const map = {
        0: "0%",
        [val]: `${Math.floor(val * 100)}%`,
        1: "100%",
      };
      return map;
    },
  },
  created () {
    this.botId = this.botObj.id;
    this.strategyId = this.instanceObj.id;
  },
};
</script>

<style lang="scss" scoped>
.setting-collapse {
  margin-top: 20px;
  margin-left: 20px;
  border-top-color: transparent;

  /deep/.el-collapse-item__wrap {
    border-bottom-color: transparent;
  }

  /deep/.el-collapse-item__header {
    font-size: 16px;
    padding-left: 18px;

    &.is-active {
      border-bottom-color: #ebeef5;
    }
  }

  /deep/.el-collapse-item__content {
    padding-left: 50px;
  }
}

.kwpolicy-content {
  .kwpolicy-table-header {
    padding: 10px 0px;
    display: flex;
    justify-content: flex-end;

    .kwpolicy-operation-btns {
      display: flex;
      align-items: center;
    }
  }

  .kwpolicy-search-input {
    display: flex;
    align-items: baseline;

    .kwpolicy-search-buttons {
      display: flex;

      .kw-search-btn {
        margin-left: 10px;
      }
    }
  }

  .kwpolicy-container-tip {
    font-size: 14px !important;
    color: #666 !important;
  }
}

.recall-slider {
  max-width: 600px;
  margin-bottom: 30px;

  /deep/.el-slider__bar {
    background: #e4e7ed;
  }

  /deep/.el-slider__button {
    border-color: #e4e7ed;
  }

  /deep/.el-slider__runway {
    background-color: rgba(236, 125, 1, 1);
  }
}

.recall-slider-tip {
  position: relative;
  color: #a1a1a1;
  padding-left: 22px;

  i {
    font-size: 30px;
    line-height: 1;
    vertical-align: top;
    position: absolute;
    left: 0;
    top: -5px;
    color: #e4e7ed;

    &.recall-color {
      color: rgba(236, 125, 1, 1);
    }
  }
}

.kwpolicy-save-btn {
  width: 140px;
  margin: auto;
}
</style>
