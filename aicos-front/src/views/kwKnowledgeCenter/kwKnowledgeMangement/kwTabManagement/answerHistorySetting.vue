<template>
  <div class="kw-tabs-base-container answerSetting">
    <avue-crud
      :option="option"
      :data="data"
      :permission="permissionList"
      ref="crud"
      :page.sync="page"
      :table-loading="loading"
      @on-load="onLoad"
    >
      <template slot="header">
        <div class="kw-header" v-if="type !== 'version'">
          <div class="kw-button-container">
            <!-- <el-button class="el-icon-arrow-left" type="text" @click="close"
              >返回</el-button
            > -->
            <div>
              <el-button
                @click="
                  (addFlag = true), (dialogTitle = $t('aicosCommon.addBtn'))
                "
                class="kw-btn-green"
                style="color: #fff"
                size="small"
                >{{ $t("table.addAnswer") }}</el-button
              >
              <el-button
                @click="handleDelete"
                size="small"
                class="kw-btn-blue"
                >{{ $t("aicosCommon.batchDeleteBtn") }}</el-button
              >
            </div>
          </div>
          <div id="kw-form-container" style="align-items: initial">
            <div class="kw-form-form">
              <el-date-picker
                v-model="searchTime"
                type="daterange"
                size="small"
                value-format="yyyy-MM-dd"
                style="width: 250px !important"
                class="kw-form-type"
                :start-placeholder="$t('table.startDate')"
                :end-placeholder="$t('table.endDate')"
              >
              </el-date-picker>
              <el-select
                clearable="true"
                size="small"
                class="kw-form-type"
                v-model="queryObj.answerStatus"
                :placeholder="
                  $t('aicosCommon.pleaseSelect') + $t('table.answerStatus')
                "
              >
                <el-option
                  v-for="item in searchStatusOptions"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                >
                </el-option>
              </el-select>
              <el-select
                clearable="true"
                size="small"
                class="kw-form-type"
                v-model="queryObj.enabledState"
                :placeholder="
                  $t('aicosCommon.pleaseSelect') + $t('table.startStopStatus')
                "
              >
                <el-option
                  v-for="item in searchEnableOptions"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                >
                </el-option>
              </el-select>
              <div class="answer-perspective-item kw-form-type">
                <div
                  class="perspect-list-container"
                  @click="showPerspectDialog()"
                >
                  <div class="perspect-list-wrap">
                    <ul class="perspect-list-ul">
                      <li
                        class="perspect-tip"
                        v-if="choosedPerspectData.length == 0"
                      >
                        {{
                          $t("aicosCommon.pleaseSelect") +
                          $t("table.answerPerspective")
                        }}
                      </li>
                      <li
                        class="perspect-item"
                        v-if="choosedPerspectData.length > 0"
                      >
                        <span
                          class="perspect-tag-text"
                          :title="
                            curPerspectData.cateName +
                            '：' +
                            curPerspectData.name
                          "
                          >{{ curPerspectData.cateName }}：{{
                            curPerspectData.name
                          }}</span
                        >
                        <i
                          class="perspect-tag-close el-icon-close"
                          @click.stop="deletePersItem(curPerspectData.id)"
                        ></i>
                      </li>
                      <li
                        class="perspect-item"
                        v-if="choosedPerspectData.length > 1"
                      >
                        <span class="perspect-tag-text">{{
                          choosedPerspectData.length - 1
                        }}</span>
                      </li>
                    </ul>
                    <i
                      class="perspect-select-icon el-input__icon el-icon-arrow-down"
                    ></i>
                  </div>
                </div>
              </div>
            </div>
            <div class="kw-form-btn">
              <el-button
                type="primary"
                icon="el-icon-search"
                size="small"
                class="kw-search-btn"
                @click="handlerSearch"
              ></el-button>
              <el-button size="small" class="kw-reset-btn" @click="handlerReset"
                ><i class="aicosicon aicos-icon-clear"></i
              ></el-button>
            </div>
          </div>
        </div>
      </template>
      <!-- 操作栏 -->
      <template slot-scope="scope" slot="menu">
        <el-button type="text" size="small" @click.stop="rowView(scope.row)">
          {{ $t("aicosCommon.viewBtn") }}
        </el-button>
      </template>
    </avue-crud>
    <!-- 新增编辑查看 -->
    <HuilanDialog
      :title="dialogTitle"
      append-to-body
      :visible.sync="addFlag"
      width="55%"
      @close="handlerCancel"
    >
      <Addanswer
        v-if="addFlag"
        ref="addanswer"
        :rowData="rowData"
        :title="dialogTitle"
        :selectData="selectRow"
      />
      <template v-slot:footer>
        <el-button size="small" @click="handlerCancel">{{
          $t("aicosCommon.cancelBtn")
        }}</el-button>
        <!-- <el-button
          size="small"
          type="primary"
          @click="handlerSave(0)"
          v-if="dialogTitle !== $t('aicosCommon.viewBtn')"
          :disabled="disable"
          >{{ $t("aicosCommon.saveBtn") }}</el-button
        > -->
        <!-- <el-button
          size="small"
          type="primary"
          @click="handlerSave(3)"
          v-if="dialogTitle !== $t('aicosCommon.viewBtn') && !isAudit"
          :disabled="disable"
          >{{ $t("table.saveAndPublish") }}</el-button
        > -->
      </template>
    </HuilanDialog>
    <!--搜索视角选择-->
    <HuilanDialog
      :title="$t('table.chooseAPerspective')"
      append-to-body
      :visible.sync="isShowPerspectDialog"
      width="60%"
      custom-class="choose-perspective-dialog"
    >
      <el-tabs v-model="angleActiveName" @tab-click="handleClick">
        <el-tab-pane :label="$t('table.channelPerspective')" name="one">
          <ChooseChannel
            v-if="isShowPerspectDialog"
            ref="chooseChannelRef"
            :choosedPerspects="chooseChannelDatas"
          />
        </el-tab-pane>
        <el-tab-pane :label="$t('table.customPerspective')" name="two">
          <ChoosePerspect
            v-if="isShowPerspectDialog"
            ref="choosePerspectRef"
            :choosedPerspects="choosedPerspectDatas"
          />
        </el-tab-pane>
        <el-tab-pane :label="$t('table.customerPerspective')" name="three">
          <ChooseClient
            v-if="isShowPerspectDialog"
            ref="chooseClientRef"
            :choosedPerspects="chooseClientDatas"
          />
        </el-tab-pane>
        <!-- <el-tab-pane label="客户情绪" name="four">
          <ChooseEmotion
            v-if="isShowPerspectDialog"
            ref="chooseEmotionRef"
            :choosedPerspects="chooseEmotionDatas"
          />
        </el-tab-pane> -->
      </el-tabs>
      <template v-slot:footer>
        <el-button size="small" @click="closeChoosePerspectDialog">{{
          $t("aicosCommon.cancelBtn")
        }}</el-button>
        <el-button
          size="small"
          type="primary"
          @click="saveChoosePerspectDialog"
          >{{ $t("aicosCommon.saveBtn") }}</el-button
        >
      </template>
    </HuilanDialog>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import {
  versionAnswer,
} from "@/api/kwKnowledgeCenter/kwKnowledgeMangement/kwTabManagement/answersetting";
import { getAuditSetting } from "@/views/kwRobotManage/kwAudit/kwAuditCommon";
import ChoosePerspect from "@/components/kwAddInMethod/choosePerspect";
import ChooseChannel from "@/components/kwAddInMethod/chooseChannel";
import ChooseClient from "@/components/kwAddInMethod/chooseClient";
import ChooseEmotion from "@/components/kwAddInMethod/chooseEmotion";
import Addanswer from "./addanswer";
// import { deepClone } from "@/util/util";
export default {
  components: {
    ChoosePerspect,
    Addanswer,
    ChooseChannel,
    ChooseClient,
    ChooseEmotion,
  },
  props: {
    rowData: {
      type: Object,
      default: () => {
        return {};
      },
    },
    nodeDeepPath: {
      type: Array,
      default: () => {
        return [];
      },
    },
    type: {
      type: String,
      default: "",
    },
  },
  inject: ["desktopWindow", "desktop", "isRobotMenu"],
  data() {
    return {
      isAudit: false, // 是否审核
      // 搜索
      queryObj: {
        answerStatus: "",
        enabledState: "",
      },
      isShowPerspectDialog: false, // 选择视角
      angleActiveName: "one", // 视角tab
      choosedPerspectData: [], // 选中的视角的数据
      choosedPerspectDatas: [], // 自定义视角
      chooseChannelDatas: [], // 渠道视角
      chooseClientDatas: [], // 客户视角
      // chooseEmotionDatas: [], // 客户情绪
      curPerspectData: {}, // 当前展示的视角的数据
      searchStatusOptions: [
        {
          label: this.$t("table.published"),
          value: 3,
        },
        // {
        //   label: "审核未发布",
        //   value: 2,
        // },
        // {
        //   label: "审核中",
        //   value: 1,
        // },
        {
          label: this.$t("table.draft"),
          value: 0,
        },
      ],
      searchEnableOptions: [
        {
          label: this.$t("table.enable"),
          value: 1,
        },
        {
          label: this.$t("table.deactivate"),
          value: 0,
        },
      ],
      searchTime: [],
      //
      disable: false,
      dialogTitle: this.$t("aicosCommon.addBtn"),
      idsArr: [],
      cur: {},
      isEdit: false,
      selectRow: {},
      searchContent: "", //搜索内容
      addFlag: false,
      loading: false,
      data: [],
      page: {
        total: 0,
        currentPage: 1,
        pageSize: 10,
      },
      option: {
        tip: false,
        // selection: true,
        // height: 515,
        menuWidth: 300,
        menuAlign: "center",
        addBtn: false,
        editBtn: false,
        viewBtn: false,
        delBtn: false,
        searchBtn: false,
        columnBtn: false,
        refreshBtn: false,
        stripe: true,
        dialogWidth: 550,
        emptyText: this.$t("aicosCommon.notData"),
        column: [
          {
            label: this.$t("table.standardIssues"),
            prop: "tableQaQuestion",
            minWidth: 150,
            overHidden: true,
          },
          {
            label: this.$t("table.answerPerspective"),
            prop: "answerVisualAngle",
            display: false,
            minWidth: 150,
            overHidden: true,
          },
          {
            label: this.$t("table.updateTime"),
            prop: "updateTime",
            minWidth: 120,
            overHidden: true,
          },
          // {
          //   label: this.$t("table.answerStatus"),
          //   prop: "answerStatus",
          //   minWidth: 110,
          //   type: "select",
          //   display: false,
          //   dicData: [
          //     {
          //       label: this.$t("table.published"),
          //       value: 3,
          //     },
          //     {
          //       label: this.$t("table.reviewNotReleased"),
          //       value: 2,
          //     },
          //     {
          //       label: this.$t("table.auditing"),
          //       value: 1,
          //     },
          //     {
          //       label: this.$t("table.draft"),
          //       value: 0,
          //     },
          //   ],
          //   overHidden: true,
          // },
          {
            label: this.$t("table.startStopStatus"),
            prop: "enabledState",
            minWidth: 110,
            type: "select",
            display: false,
            dicData: [
              {
                label: this.$t("table.deactivate"),
                value: 0,
              },
              {
                label: this.$t("table.enable"),
                value: 1,
              },
            ],
            overHidden: true,
          },
        ],
      },
      // 版本记录
      curVesionRecordRow: {},
      vesionRecordIsShow: false,
    };
  },
  computed: {
    prefix() {
      const prefix = this.isRobotMenu ? "robot-" : "";
      return prefix;
    },
    ...mapGetters(["botObj", "permission"]),
  },
  mounted() {
    this.getAuditConfig();
  },
  methods: {
    // 查看
    rowView(row) {
      this.selectRow = row;
      this.dialogTitle = this.$t("aicosCommon.viewBtn");
      this.addFlag = true;
    },
    async onLoad() {
      const info = {
        // tableQaId:
        //   this.type === "version" ? this.rowData.tableqaId : this.rowData.id,
        id: this.rowData.id,
        page: this.page.currentPage,
        size: this.page.pageSize,
        version: this.rowData.version,
      };
      // let a = [];
      // if (this.choosedPerspectData.length > 0) {
      //   this.choosedPerspectData.map((res) => {
      //     a.push(res.id);
      //   });
      //   info.answerVisualAngle = a.join(",");
      // }
      // if (this.searchTime !== null && this.searchTime.length > 0) {
      //   info.start = this.searchTime[0];
      //   info.end = this.searchTime[1];
      // } else {
      //   info.start = "";
      //   info.end = "";
      // }
      this.loading = true;
      const result = await versionAnswer(info);
      if (result.data.code == 200) {
        // console.log(result.data.data);
        const Data = result.data.data;
        // let records = [];
        this.loading = false;
        this.page.total = Data.total;
        Data.records.map(item=>{
          this.data.push(JSON.parse(item.answerContent))
        })
        this.data.map((item) => {
          item.answerVisualAngle = item.angleList.join(" | ");
        });
      }
    },
    // 打开视角弹框
    showPerspectDialog() {
      this.isShowPerspectDialog = true;
      this.angleActiveName = "one";
    },

    // 关闭视角
    closeChoosePerspectDialog() {
      this.isShowPerspectDialog = false;
    },

    // 确定选择的视角
    saveChoosePerspectDialog() {
      let perspects = [],
        channel = [],
        customer = [],
        // emotion = [],
        that = this;

      this.choosedPerspectData = [];
      // 自定义视角
      perspects = this.$refs.choosePerspectRef.savePerspects();
      // 渠道视角
      channel = this.$refs.chooseChannelRef.savePerspects();
      // 客户端视角
      customer = this.$refs.chooseClientRef.savePerspects();
      // 情绪视角
      // emotion = this.$refs.chooseEmotionRef.savePerspects();
      if (channel.length > 0) {
        channel.forEach((item) => {
          that.choosedPerspectData.push(item);
        });
      }
      if (perspects.length > 0) {
        perspects.forEach((item) => {
          that.choosedPerspectData.push(item);
        });
      }
      if (customer.length > 0) {
        customer.forEach((item) => {
          that.choosedPerspectData.push(item);
        });
      }
      // if (emotion.length > 0) {
      //   emotion.forEach((item) => {
      //     that.choosedPerspectData.push(item);
      //   });
      // }
      this.choosedPerspectDatas = perspects;
      this.chooseChannelDatas = channel;
      this.chooseClientDatas = customer;
      // this.chooseEmotionDatas = emotion;
      this.isShowPerspectDialog = false;
      if (this.choosedPerspectData.length > 0) {
        this.curPerspectData = this.choosedPerspectData[0];
      }
      this.onLoad();
    },

    // 删除选中的视角
    deletePersItem(id) {
      this.choosedPerspectData.every((item, index) => {
        if (item.id == id) {
          this.choosedPerspectData.splice(index, 1);
          return false;
        }
        return true;
      });

      if (this.choosedPerspectData.length > 0) {
        this.curPerspectData = this.choosedPerspectData[0];
      }

      this.onLoad();
    },
    //搜索
    handlerSearch() {
      this.onLoad();
    },
    //搜索重置
    handlerReset() {
      this.searchTime = [];
      this.choosedPerspectData = [];
      this.choosedPerspectDatas = [];
      this.chooseChannelDatas = [];
      this.chooseClientDatas = [];
      this.queryObj = { answerStatus: "", enabledState: "" };
      this.onLoad();
    },
    async getAuditConfig() {
      const dataParam = {
        kmType: 4,
        tenantId: this.$store.state.user.currentTenantId,
      };
      this.auditSetting = await getAuditSetting(dataParam);
      this.isAudit = this.auditSetting.approvalProcessStatus;
    },
    // 取消新增
    handlerCancel() {
      this.addFlag = false;
    },
    close() {
      this.$emit("addOrEditEmitEvent", {
        type: "mangelist",
        nodeDeepPath: this.nodeDeepPath,
      });
    },
  },
};
</script>

<style lang="scss" scoped>
/deep/ .avue-crud__menu {
  display: none;
}

.answerSetting {
  .kw-button-container {
    display: flex;
    align-items: center;
    justify-content: flex-end;
  }

  .kw-form-form {
    display: flex;
    margin-right: 10px;
  }

  .perspect-list-container {
    position: relative;
    width: 210px;
  }

  .perspect-list-wrap {
    background-color: #fff;
    background-image: none;
    border-radius: 4px;
    border: 1px solid #dcdfe6;
    box-sizing: border-box;
    color: #606266;
    /* height: 32px;*/
    padding-right: 20px;
    position: relative;

    .perspect-list-ul {
      padding: 0;
      margin: 0;
      list-style: none;
      line-height: 30px;
      text-align: left;
      min-height: 3px;

      .perspect-item {
        display: inline-block;
        vertical-align: top;
        background-color: #f4f4f5;
        color: #909399;
        margin: 3px 0 2px 6px;
        max-width: 100%;
        align-items: center;
        height: 24px;
        padding: 0 8px;
        line-height: 22px;
        border: 1px solid #e9e9eb;
        border-radius: 4px;
        white-space: nowrap;
        font-size: 12px;

        .perspect-tag-text {
          overflow: hidden;
          text-overflow: ellipsis;
          color: #909399;
          line-height: 22px;
          font-size: 12px;
          white-space: nowrap;
          max-width: 100px;
          display: inline-block;
          vertical-align: middle;
        }

        .perspect-tag-close {
          color: #909399;
          background-color: #c0c4cc;
          border-radius: 50%;
          text-align: center;
          position: relative;
          cursor: pointer;
          font-size: 12px;
          height: 16px;
          width: 16px;
          line-height: 16px;
          vertical-align: middle;
          top: -1px;
          right: -5px;
          transform: scale(0.8);
        }
      }

      .perspect-tip {
        color: #c0c4cc;
        font-size: 14px;
        padding-left: 15px;
        text-wrap: nowrap;
        overflow: hidden;
      }
    }

    .perspect-select-icon {
      position: absolute;
      right: 0;
      top: -4px;
    }
  }
}
</style>
