<template>
  <HuilanBasic :left-width="250">
    <template v-slot:left>
      <div
        class="fag-manage-tree"
        :style="
          allWindowTopBodyHeight && { height: allWindowTopBodyHeight + 'px' }
        "
      >
        <basic-container>
          <LeftTree
            ref="tree"
            @getNode="getNode"
            @nodeClick="nodeClick"
            :defaultExpandNodes="curNodeDeepPath"
            :classType="classType"
            :botId="botId"
            @openSetting="openSetting"
            :name="$t('faq.knowledgeClass')"
          />
        </basic-container>
      </div>
    </template>
    <div class="faq-manage-container">
      <div
        :style="
          allWindowTopBodyHeight && { height: allWindowTopBodyHeight + 'px' }
        "
        class="fag-manage-content"
      >
        <div class="faq-table-header">
          <div class="faq-search-header-wrap clearfix">
            <div class="faq-operation-btns">
              <el-button
                type="success"
                class="kw-build-button kw-btn-green"
                size="small"
                v-if="
                  curTreeNodeId != '0' &&
                  curTreeNodeId != 'mine' &&
                  curTreeNodeId != '' &&
                  permissionList.addBtn
                "
                @click="openFaqAddDialog('add')"
                >{{ $t("faq.addKnowledge") }}</el-button
              >
              <el-dropdown
                v-if="
                  permission[`${prefix}faq-startMore`] ||
                  permission[`${prefix}faq-stopMore`] ||
                  permission[`${prefix}faq-deleteMore`] ||
                  permission[`${prefix}faq-export`] ||
                  permission[`${prefix}faq-import`]
                "
                @command="batchOperation"
              >
                <el-button
                  type="primary"
                  class="kw-build-button kw-btn-blue"
                  size="small"
                >
                  {{ $t("aicosCommon.batchOperation")
                  }}<i class="el-icon-arrow-down el-icon--right"></i>
                </el-button>
                <el-dropdown-menu slot="dropdown">
                  <el-dropdown-item
                    command="enable"
                    v-if="permission[`${prefix}faq-startMore`]"
                    >{{ $t("aicosCommon.batchStart") }}</el-dropdown-item
                  >
                  <el-dropdown-item
                    command="stop"
                    v-if="permission[`${prefix}faq-stopMore`]"
                    >{{ $t("aicosCommon.batchPause") }}</el-dropdown-item
                  >
                  <el-dropdown-item
                    command="del"
                    v-if="permission[`${prefix}faq-deleteMore`]"
                    >{{ $t("aicosCommon.batchDeleteBtn") }}</el-dropdown-item
                  >
                  <el-dropdown-item
                    command="export"
                    v-if="
                      permission[`${prefix}faq-export`] &&
                      curTreeNodeId != '0' &&
                      curTreeNodeId != 'mine' &&
                      curTreeNodeId != ''
                    "
                    >{{ $t("aicosCommon.batchExport") }}</el-dropdown-item
                  >
                  <el-dropdown-item
                    command="import"
                    v-if="permission[`${prefix}faq-import`]"
                    >{{ $t("aicosCommon.batchImport") }}</el-dropdown-item
                  >
                  <el-dropdown-item
                    command="sync"
                    v-if="
                      permission[`${prefix}faq-sync`] &&
                      curTreeNodeId != '0' &&
                      curTreeNodeId != 'mine' &&
                      curTreeNodeId != ''
                    "
                    >{{ $t("faq.syncKnowledge") }}</el-dropdown-item
                  >
                </el-dropdown-menu>
              </el-dropdown>
              <!--<el-dropdown>
                <el-button type="primary" class="kw-build-button kw-btn-orange" size="small">
                  导入知识<i class="el-icon-arrow-down el-icon&#45;&#45;right"></i>
                </el-button>
                <el-dropdown-menu slot="dropdown">
                  <el-dropdown-item>导入知识文件</el-dropdown-item>
                  <el-dropdown-item>导入知识压缩包</el-dropdown-item>
                  <el-dropdown-item>智能识别</el-dropdown-item>
                </el-dropdown-menu>
              </el-dropdown>-->
            </div>
            <div class="faq-search-input-wrap clearfix">
              <div class="faq-search-input-row">
                <div class="faq-search-select">
                  <el-select
                    size="small"
                    v-model="queryObj.titleType"
                    :placeholder="$t('pleaseSelect')"
                  >
                    <el-option
                      v-for="item in searchOptions"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value"
                    >
                    </el-option>
                  </el-select>
                </div>
                <div class="faq-search-value">
                  <div class="faq-search-input">
                    <el-input
                      :placeholder="
                        $t('aicosCommon.pleaseInput') + $t('faq.keywords')
                      "
                      size="small"
                      v-model="queryObj.content"
                    ></el-input>
                    <div class="faq-search-buttons">
                      <el-button
                        type="primary"
                        size="small"
                        class="kw-search-btn"
                        @click="searchChange"
                      >
                        <i class="el-icon-search"></i>
                      </el-button>
                      <el-button
                        size="small"
                        class="kw-reset-btn"
                        @click="searchReset"
                      >
                        <i class="aicosicon aicos-icon-clear"></i>
                      </el-button>
                      <el-button
                        size="small"
                        class="kw-reset-btn"
                        @click="expandOrPutUpSearch"
                      >
                        <i class="aicosicon aicos-icon-gaojisousuo"></i>
                      </el-button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <!--维度搜索-->
          <div class="faq-dismension-search-wrap">
            <div
              class="dismension-search-wrap"
              v-show="isExpandOrPutUp == 'expand'"
            >
              <dl
                class="dismension-dl"
                ref="searchDismensionDlRef"
                v-for="firstItem in searchDismensionData"
                :key="firstItem.id"
              >
                <dt :title="firstItem.dname">{{ firstItem.dname }}</dt>
                <dd
                  :class="
                    firstItem.sonList.length > secondDismensionLength
                      ? 'second-dismension-dd-more'
                      : ''
                  "
                >
                  <ul
                    ref="secodDismensionRef"
                    class="second-dismension-ul"
                    :style="{ width: firstItem.width + 'px' }"
                  >
                    <li
                      v-for="(secondItem, secondIndex) in firstItem.sonList"
                      :index="secondIndex"
                      @click="
                        choosedDismensionClick(
                          firstItem,
                          secondItem,
                          secondItem.type
                        )
                      "
                      :key="secondItem.id"
                    >
                      <span
                        :class="[
                          'dismension-name',
                          secondItem.selected ? 'selected-dismension-name' : '',
                        ]"
                        :title="secondItem.dname"
                        >{{ secondItem.dname }}</span
                      >
                      <i
                        class="dismension-more-icon el-icon-arrow-down"
                        @click.stop="
                          showDismensionDialog(firstItem, secondItem, 'second')
                        "
                        v-if="secondItem.isLeaf == 1"
                      ></i>
                    </li>
                  </ul>
                  <span
                    class="dismension-more"
                    @click="showDismensionDialog(firstItem, null, 'more')"
                    :length="firstItem.sonList.length"
                    v-if="firstItem.sonList.length > secondDismensionLength"
                  >
                    <i class="el-icon-more"></i>
                  </span>
                </dd>
              </dl>
              <dl
                class="dismension-dl dismension-more-dl"
                ref="moreSearchConditionRef"
              >
                <dt :style="{ lineHeight: moreSearchTitleHeight + 'px' }">
                  {{ $t("faq.moreFiltering") }}
                </dt>
                <dd class="dismension-more-dd-wrap clearfix">
                  <div class="search-other-item">
                    <el-select
                      size="small"
                      clearable="true"
                      @change="searchStatusChange('status')"
                      @clear="clearSearchChange('status')"
                      v-model="queryObj.status"
                      :placeholder="
                        $t('aicosCommon.pleaseSelect') +
                        $t('faq.knowledgeState')
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
                  </div>
                  <div class="search-other-item">
                    <el-select
                      size="small"
                      clearable="true"
                      @change="searchStatusChange('avaliableStatus')"
                      @clear="clearSearchChange('avaliableStatus')"
                      v-model="queryObj.avaliableStatus"
                      :placeholder="
                        $t('aicosCommon.pleaseSelect') +
                        $t('faq.periodValidity')
                      "
                    >
                      <el-option
                        v-for="item in searchAvaliableStatusOptions"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value"
                      >
                      </el-option>
                    </el-select>
                  </div>
                  <div class="search-other-item">
                    <el-select
                      size="small"
                      clearable="true"
                      @change="searchStatusChange('enable')"
                      @clear="clearSearchChange('enable')"
                      v-model="queryObj.enable"
                      :placeholder="
                        $t('aicosCommon.pleaseSelect') +
                        $t('faq.startStopStatus')
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
                  </div>
                  <div class="search-other-item">
                    <div class="answer-perspective-item">
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
                                $t("faq.answerPerspective")
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

                        <!--<el-button size="mini" type="primary" class="choose-perspect-btn" @click="choosePerspectDialog(answerIndex)">选择视角</el-button>-->
                      </div>
                    </div>
                  </div>
                </dd>
              </dl>
            </div>
            <div class="choose-dismension">
              <ul class="choose-dismen-ul">
                <li v-for="(item, i) in choosedDismensionData" :key="i">
                  <span class="first-text">{{ item.firstName }}</span>
                  <i class="delimiter-text">：</i>
                  <span class="last-text">{{ item.lastName }}</span>
                  <i
                    class="choose-del-icon el-icon-close"
                    @click="delChoosedDis(item)"
                  ></i>
                </li>
              </ul>
            </div>
          </div>
        </div>
        <avue-crud
          :option="faqTableOption"
          :table-loading="loading"
          :data="faqTableData"
          :page.sync="faqTablePage"
          ref="faqTable"
          :permission="permissionList"
          @selection-change="selectionChange"
          @current-change="currentChange"
          @size-change="sizeChange"
          @on-load="onLoad"
        >
          <template slot-scope="{ row }" slot="question">
            <div>
              <i
                class="aicosicon aicos-icon-top"
                style="color: #faa725; font-size: 30px"
                v-if="row.questionOrder == '1'"
              ></i>
              <span style="color: #0079fe">{{ row.question }}</span>
            </div>
          </template>
          <template slot-scope="{ row }" slot="answer">
            <div v-html="row.answer" class="answer-table-contaner"></div>
          </template>
          <template v-slot:menu="scope">
            <HuilanBasicActionTool
              :actions="getRowActions(scope.row)"
              @command="handleCommand($event, scope.row, scope.index)"
              :limt="language == 'en' ? 4 : 5"
            />
          </template>
        </avue-crud>
      </div>
    </div>
    <el-drawer
      :title="
        faqManageType == 'add'
          ? $t('aicosCommon.addBtn')
          : faqManageType == 'edit'
          ? $t('aicosCommon.editBtn')
          : $t('aicosCommon.viewBtn')
      "
      :visible.sync="faqManageDialogVisible"
      append-to-body
      show-close
      @close="(faqManageDialogVisible = false), (faqManageType = 'mangelist')"
      size="50%"
    >
      <template v-if="faqManageType == 'add'">
        <AddFaq
          :nodeDeepPath="curNodeDeepPath"
          :curTreeNode="curSelectedTreeNode"
          :faqType="'add'"
          @addOrEditEmitEvent="addOrEditEmitEvent"
        />
      </template>
      <template v-if="faqManageType == 'edit'">
        <AddFaq
          :nodeDeepPath="curNodeDeepPath"
          :curTreeNode="curSelectedTreeNode"
          :curFaqObj="curVesionRecordRow"
          :faqType="'edit'"
          @addOrEditEmitEvent="addOrEditEmitEvent"
        />
      </template>
      <template v-if="faqManageType == 'view'">
        <AddFaq
          :nodeDeepPath="curNodeDeepPath"
          :curTreeNode="curSelectedTreeNode"
          :curFaqObj="curVesionRecordRow"
          :faqType="'view'"
          @addOrEditEmitEvent="addOrEditEmitEvent"
        />
      </template>
    </el-drawer>
    <el-drawer
      :title="$t('kwIntentionManage.classifySetting')"
      :visible.sync="settingDrawer"
      append-to-body
      show-close
      @close="treeSettingClose"
      size="89%"
    >
      <TreeSetting
        :botId="botId"
        :classType="classType"
        v-if="settingDrawer"
        :treeRootName="$t('faq.generalClass')"
      />
      <template v-slot:footer>
        <el-button size="small" @click="settingDrawer = false">{{
          $t("aicosCommon.cancelBtn")
        }}</el-button>
        <el-button size="small" type="primary" @click="saveExpand">{{
          $t("aicosCommon.saveBtn")
        }}</el-button>
      </template>
    </el-drawer>

    <!--显示搜索维度弹框-->
    <HuilanDialog
      append-to-body
      :visible.sync="isShowDismensionDialog"
      width="600px"
      custom-class="choose-dismension-dialog"
    >
      <ChooseDismension
        v-if="isShowDismensionDialog"
        ref="chooseDismensionRef"
        :type="dismensionDialogType"
        :dismensionData="dismensionDialogData"
      />
      <template v-slot:footer>
        <el-button size="small" @click="isShowDismensionDialog = false">{{
          $t("aicosCommon.cancelBtn")
        }}</el-button>
        <el-button size="small" type="primary" @click="sureSearchDismension">{{
          $t("aicosCommon.saveBtn")
        }}</el-button>
      </template>
    </HuilanDialog>

    <!--搜索视角选择-->
    <HuilanDialog
      :title="$t('faq.chooseAPerspective')"
      append-to-body
      :visible.sync="isShowPerspectDialog"
      width="60%"
      custom-class="choose-perspective-dialog"
    >
      <ChoosePerspect
        v-if="isShowPerspectDialog"
        ref="choosePerspectRef"
        :choosedPerspects="choosedPerspectData"
      />
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

    <!--版本记录-->
    <HuilanDialog
      :title="$t('faq.versionRecord')"
      append-to-body
      trigger="click"
      :visible.sync="vesionRecordIsShow"
    >
      <VersionRecord
        v-if="vesionRecordIsShow"
        v-bind:curAuditRow="curVesionRecordRow"
      />
      <template v-slot:footer>
        <el-button size="small" @click="vesionRecordIsShow = false">{{
          $t("aicosCommon.cancelBtn")
        }}</el-button>
      </template>
    </HuilanDialog>

    <!-- FAQ导入 -->
    <HuilanDialog
      :title="$t('faq.FAQImport')"
      append-to-body
      :visible.sync="importFlag"
      width="600px"
    >
      <Import
        moduleName="FAQ"
        ref="import"
        @successImport="successImport"
        v-if="importFlag"
      />
      <template v-slot:footer>
        <el-button size="small" @click="importFlag = false">{{
          $t("aicosCommon.cancelBtn")
        }}</el-button>
        <el-button
          size="small"
          type="primary"
          @click="handlerSave"
          :disabled="importBtn"
          >{{ $t("aicosCommon.saveBtn") }}</el-button
        >
      </template>
    </HuilanDialog>

    <AuditRecordsWithDrawer
      :recordParams="recordParams"
      ref="auditRecordsRef"
    />
  </HuilanBasic>
</template>

<script>
import { mapGetters } from "vuex";
import LeftTree from "@/components/kwLeftTree/index";
import AddFaq from "./addFaq";
import TreeSetting from "@/components/kwLeftTree/treeSetting";
import Import from "@/components/kwImportComponent/index";
import {
  loadListUrl,
  getSearchDismensionUrl,
  delFaqUrl,
  enableOrStopFaqUrl,
  updateTopStatusUrl,
  publishFaqUrl,
  oneKeySync,
} from "@/api/kwKnowledgeCenter/kwKnowledgeMangement/kwFaqManagement/index";
import TemplateSelect from "../../../messageSourceMgr/templateSelect";
import ChooseDismension from "./chooseDismension";
import ChoosePerspect from "@/components/kwAddInMethod/choosePerspect";
import VersionRecord from "./versionRecord";
import serviceList from "@/config/serviceList";
import { baseURL } from "@/api/common";
import { getStore } from "@/util/store";
import { getTextWidth } from "@/util/util";
import AuditRecordsWithDrawer from "@/views/kwRobotManage/kwAudit/auditRecordsWithDrawer";
import {
  getAuditSetting,
  kmAuditColse,
  kmAuditStart,
} from "@/views/kwRobotManage/kwAudit/kwAuditCommon.js";

const { knowledge } = serviceList;
export default {
  inject: ["desktopWindow", "desktop", "isRobotMenu"],
  data() {
    return {
      recordParams: {},
      auditSetting: {}, // 审核设置
      isAudit: false, // 是否审核

      faqManageDialogVisible: false,
      importBtn: false,
      importFlag: false,
      dimensionIdList: [],
      angleList: [],
      allWindowTopBodyHeight: 0, // 窗口内容的高度
      botId: "", // 机器人id
      faqManageType: "mangelist",
      classType: "faq", // 树的类型
      node: "", // 分类树的节点
      resolve: "", // 分类树的resolve
      curSelectedTreeNode: {}, // 当前点击的树的节点
      curTreeNodeId: "", // 当前节点的id
      settingDrawer: false,
      moreSearchTitleHeight: 0, // 更多搜索高度
      searchDismensionData: [], // 搜索维度的数据
      secondDismensionLength: 10, // 二级搜索维度的长度
      choosedDismensionData: [], // 选中的维度
      isShowPerspectDialog: false, // 选择视角
      choosedPerspectData: [], // 选中的视角的数据
      curPerspectData: {}, // 当前展示的视角的数据
      isExpandOrPutUp: "putup",
      isFirstExpandFlag: true, // 是否第一次展开
      searchOptions: [
        {
          label: this.$t("faq.standardIssues"),
          value: "1",
        },
        {
          label: this.$t("faq.answer"),
          value: "2",
        },
        {
          label: this.$t("faq.similarProblems"),
          value: "3",
        },
      ],
      searchStatusOptions: [
        {
          label: this.$t("faq.published"),
          value: "1",
        },
        {
          label: this.$t("faq.draft"),
          value: "0",
        },
      ],
      searchEnableOptions: [
        {
          label: this.$t("faq.enable"),
          value: "1",
        },
        {
          label: this.$t("faq.deactivate"),
          value: "0",
        },
      ],
      searchAvaliableStatusOptions: [
        {
          label: this.$t("faq.longTerm"),
          value: "0",
        },
        {
          label: this.$t("faq.inEffect"),
          value: "1",
        },
        {
          label: this.$t("faq.expired"),
          value: "2",
        },
      ],
      loading: false,
      isShowDismensionDialog: false, // 打开维度弹框
      dismensionDialogType: "second", // 维度弹框类型
      dismensionDialogData: [], // 维度弹框数据
      queryObj: {
        titleType: "1",
        content: "",
        status: "", // 知识状态
        enable: "", // 启用停用
        avaliableStatus: "", // 有效期
        angleId: "", // 答案视角
      },
      faqTablePage: {
        pageSize: 10,
        currentPage: 1,
        total: 1,
      },
      faqTableData: [
        {
          question: "问题一",
          answer: "问题一答案",
        },
      ],
      faqTableOption: {
        searchShowBtn: false,
        refreshBtn: false,
        tip: false,
        searchShow: true,
        searchMenuSpan: 6,
        dialogWidth: "60%",
        columnBtn: false,
        border: false,
        index: false,
        addBtn: false,
        selection: true,
        editBtn: false,
        delBtn: false,
        viewBtn: false,
        menuWidth: 300,
        menuAlign: "center",
        dialogClickModal: false,
        labelWidth: 120,
        emptyText: this.$t("aicosCommon.notData"),
        column: [
          {
            label: this.$t("faq.question"),
            prop: "question",
            span: 12,
            minWidth: 200,
            showWordLimit: true,
            overHidden: true,
          },
          {
            label: this.$t("faq.answer"),
            prop: "answer",
            span: 12,
            minWidth: 300,
            showWordLimit: true,
            overHidden: true,
          },
          {
            label: this.$t("faq.version"),
            prop: "versionNum",
            hide: true,
          },
          {
            label: this.$t("faq.knowledgeState"),
            prop: "status",
            span: 12,
            minWidth: 100,
            showWordLimit: true,
            overHidden: true,
            align: "center",
            dicData: [
              {
                label: this.$t("faq.draft"),
                value: 0,
              },
              {
                label: this.$t("faq.published"),
                value: 1,
              },
            ],
          },
          {
            label: this.$t("faq.auditStatus"),
            prop: "auditStatus",
            span: 12,
            minWidth: 100,
            showWordLimit: true,
            overHidden: true,
            align: "center",
            hide: true,
            dicData: [
              {
                label: this.$t("faq.auditing"),
                value: "auditing",
              },
              {
                label: this.$t("faq.reject"),
                value: "reject",
              },
              {
                label: this.$t("faq.disagree"),
                value: "disagree",
              },
              {
                label: this.$t("faq.finish"),
                value: "finish",
              },
              {
                label: this.$t("faq.withdraw"),
                value: "withdraw",
              },
              // {
              //   label: "通过",
              //   value: "agree",
              // },
            ],
            formatter: (val, value, label) => {
              if (this.validatenull(value)) {
                return "--";
              }
              return label;
            },
          },
          {
            label: this.$t("faq.startStopStatus"),
            prop: "enable",
            minWidth: 100,
            showWordLimit: true,
            overHidden: true,
            align: "center",
            dicData: [
              {
                label: this.$t("faq.deactivate"),
                value: 0,
              },
              {
                label: this.$t("faq.enable"),
                value: 1,
              },
            ],
          },
          {
            label: this.$t("faq.createTime"),
            prop: "createDate",
            minWidth: 100,
            showWordLimit: true,
            overHidden: true,
            align: "center",
            formatter: (val, value, label) => {
              if (this.validatenull(value)) {
                return "--";
              }
              return label;
            },
          },
        ],
      },
      selectionList: [],
      vesionRecordIsShow: false,
      curVesionRecordRow: {}, // 当前的faq
      curNodeDeepPath: ["0"], // 当前点击节点的路径
    };
  },
  components: {
    TemplateSelect,
    AddFaq,
    LeftTree,
    TreeSetting,
    ChooseDismension,
    ChoosePerspect,
    VersionRecord,
    Import,
    AuditRecordsWithDrawer,
  },
  computed: {
    prefix() {
      const prefix = this.isRobotMenu ? "robot-" : "";
      return prefix;
    },
    // 计算属性
    ...mapGetters(["botObj", "permission", "language"]),
    permissionList() {
      return {
        addBtn: this.vaildData(this.permission[`${this.prefix}faq-add`], false),
        viewBtn: this.vaildData(
          this.permission[`${this.prefix}faq-view`],
          false
        ),
        delBtn: this.vaildData(
          this.permission[`${this.prefix}faq-delete`],
          false
        ),
        editBtn: this.vaildData(
          this.permission[`${this.prefix}faq-edit`],
          false
        ),
        versionsBtn: this.vaildData(
          this.permission[`${this.prefix}faq-colophon`],
          false
        ),
        publishBtn: this.vaildData(
          this.permission[`${this.prefix}faq-publish`],
          false
        ),
        stopBtn: this.vaildData(
          this.permission[`${this.prefix}faq-stop`],
          false
        ),
        startBtn: this.vaildData(
          this.permission[`${this.prefix}faq-start`],
          false
        ),
        stickBtn: this.vaildData(
          this.permission[`${this.prefix}faq-stick`],
          false
        ),
        cancelstickBtn: this.vaildData(
          this.permission[`${this.prefix}faq-cancelstick`],
          false
        ),
        viewRecodeBtn: true,
        closeAuditBtn: true,
      };
    },
  },
  methods: {
    async getAuditConfig() {
      const dataParam = {
        kmType: 1,
        tenantId: this.$store.state.user.currentTenantId,
      };
      this.auditSetting = await getAuditSetting(dataParam);
      this.isAudit = this.auditSetting.approvalProcessStatus;
      let auditStatus = this.findObject(
        this.faqTableOption.column,
        "auditStatus"
      );
      if (this.isAudit) {
        auditStatus.hide = false;
      } else {
        auditStatus.hide = true;
      }
    },

    getRowActions(row) {
      const map = {
        viewBtn: {
          name: this.$t("aicosCommon.viewBtn"),
          command: "viewFaq",
        },
        // editBtn: {
        //   name: "编辑",
        //   command: "openEditFaq",
        // },
        // delBtn: {
        //   name: "删除",
        //   command: "delFaq",
        // },
        // versionsBtn: {
        //   name: "版本记录",
        //   command: "openVersionRecordDialog",
        // },
      };
      const list = ["viewBtn" /* "editBtn", "delBtn", */ /* "versionsBtn" */];

      if (
        row.auditStatus !== "auditing"
        // || 1 ==1
      ) {
        map.editBtn = {
          name: this.$t("aicosCommon.editBtn"),
          command: "openEditFaq",
        };
        list.push("editBtn");
      }

      if (
        row.auditStatus !== "auditing"
        // || 1 ==1
      ) {
        map.delBtn = {
          name: this.$t("aicosCommon.delBtn"),
          command: "delFaq",
        };
        list.push("delBtn");
      }
      if (row.auditStatus == "auditing" && this.isAudit) {
        map.closeAuditBtn = {
          name: this.$t("faq.withdraw"),
          command: "closeAudit",
        };
        list.push("closeAuditBtn");
      }
      // if(row.auditStatus == "disagree" || row.auditStatus == "reject"){
      //   map.closeAuditBtn = {
      //     name: "审核",
      //     command: "closeAudit",
      //   };
      //   list.push("closeAuditBtn");
      // }

      if (
        row.status == 0 &&
        this.validatenull(row.auditStatus)
        // &&!this.isAudit
        // || 1 ==1
      ) {
        map.publishBtn = {
          name: this.$t("faq.release"),
          command: "publishFaq",
        };
        list.push("publishBtn");
      }
      if (row.enable == "1") {
        map.stopBtn = {
          name: this.$t("faq.deactivate"),
          command: "enableOrStop",
        };
        list.push("stopBtn");
      }
      if (row.enable == "0") {
        map.startBtn = {
          name: this.$t("faq.enable"),
          command: "enableOrStop",
        };
        list.push("startBtn");
      }
      if (row.questionOrder == "0") {
        map.stickBtn = {
          name: this.$t("faq.topping"),
          command: "updateTopStatus",
        };
        list.push("stickBtn");
      }
      if (row.questionOrder == "1") {
        map.cancelstickBtn = {
          name: this.$t("faq.cancelTopping"),
          command: "updateTopStatus",
        };
        list.push("cancelstickBtn");
      }

      if (
        this.isAudit
        // row.auditStatus == "auditing" ||
        // row.auditStatus == "disagree" ||
        // row.auditStatus == "finish" ||
        // row.auditStatus == "reject"
        // || 1 ==1
      ) {
        map.viewRecodeBtn = {
          name: this.$t("faq.auditRecords"),
          command: "viewAuditRecords",
        };
        list.push("viewRecodeBtn");
      }

      if (
        // row.auditStatus !== "auditing"
        row.versionNum >= 0
        // || 1 ==1
      ) {
        map.versionsBtn = {
          name: this.$t("faq.versionRecord"),
          command: "openVersionRecordDialog",
        };
        list.push("versionsBtn");
      }

      const actions = [];

      list.forEach((item) => {
        if (this.permissionList[item]) {
          actions.push(map[item]);
        }
      });
      return actions;
    },
    handleCommand(command, row, index) {
      if (command === "enableOrStop") {
        this.enableOrStop(row, row.enable == "0" ? "1" : "0", "only");
      } else if (command === "updateTopStatus") {
        this.updateTopStatus(row, row.questionOrder == "0" ? "1" : "0");
      } else if (command === "delFaq") {
        this.delFaq(row, index, "only");
      } else {
        this[command](row, index);
      }
    },
    // 窗口改变，动态改变高度
    desktopWindowResize() {
      this.allWindowTopBodyHeight =
        this.desktopWindow.$el.getElementsByClassName(
          "desk-window-inner"
        )[0].offsetHeight;
    },

    // 打开维度弹框
    showDismensionDialog(first, second, type) {
      this.isShowDismensionDialog = true;
      this.dismensionDialogType = type;

      if (type == "more") {
        this.dismensionDialogData = [
          {
            id: first.id,
            dname: first.dname,
            orderNum: 0,
          },
        ];
      } else {
        this.dismensionDialogData = [
          {
            id: first.id,
            dname: first.dname,
            orderNum: 0,
          },
          {
            id: second.id,
            dname: second.dname,
            orderNum: 1,
          },
        ];
      }
    },

    // 确定选中的维度
    sureSearchDismension() {
      let dialogDismensionData = this.$refs.chooseDismensionRef.dismensionData;
      let firstDis = null;
      let lastDis = null;

      if (dialogDismensionData.length == 1) {
        this.$message({
          message: this.$t("faq.secondaryTips"),
          type: "warning",
        });
        return false;
      }

      firstDis = dialogDismensionData[0];
      lastDis = dialogDismensionData[dialogDismensionData.length - 1];

      this.choosedDismensionClick(firstDis, lastDis, "only");

      this.isShowDismensionDialog = false;
    },

    // 更新维度是否选中的状态
    updateDismensionSelectedStatus(first, second, type, isSelected) {
      let firstIds = [];
      if (isSelected == "selected") {
        // 选中
        if (type == "all") {
          this.searchDismensionData.every((searchItem) => {
            if (first.id == searchItem.id) {
              searchItem.sonList.forEach((item) => {
                if (item.type == "all") {
                  item.selected = true;
                } else {
                  item.selected = false;
                }
              });

              return false;
            }

            return true;
          });
        } else {
          this.searchDismensionData.every((searchItem) => {
            if (first.id == searchItem.id) {
              searchItem.sonList.forEach((item) => {
                if (item.type == "all") {
                  item.selected = false;
                } else {
                  if (item.id == second.id) {
                    item.selected = true;
                  }
                }
              });

              return false;
            }

            return true;
          });
        }
      } else {
        // 删除，取消选中

        // 判断删除后，是否还存在当前一级下面的二级数据，不存在的话，选中全部
        this.choosedDismensionData.forEach((item) => {
          if (first.firstId == item.firstId) {
            firstIds.push(item.lastId);
          }
        });

        if (first.type == "only") {
          this.searchDismensionData.every((searchItem) => {
            if (first.firstId == searchItem.id) {
              searchItem.sonList.forEach((item) => {
                if (first.lastId == item.id) {
                  item.selected = false;
                }

                if (firstIds.length == 0 && item.type == "all") {
                  item.selected = true;
                }
              });

              return false;
            }

            return true;
          });
        }
      }
    },

    // 选中维度
    choosedDismensionClick(first, second, type) {
      // let isChoosedAllFlag = false;  // 是否选中的是全部
      let isChoosedFlag = false;

      if (type == "all") {
        this.choosedDismensionData = this.choosedDismensionData.filter(
          (item) => {
            if (item.firstId != first.id) {
              return item;
            }
          }
        );
      } else {
        this.choosedDismensionData = this.choosedDismensionData.filter(
          (item) => {
            if (item.lastId != first.id + "-all") {
              return item;
            }
          }
        );
      }

      /*this.choosedDismensionData.every((item) => {
        if (type == 'all') {
          if (item.lastId == first.id + '-all') {
            isChoosedAllFlag = true;
            return false;
          }
          return true;
        }
      });*/

      this.choosedDismensionData.every((item) => {
        if (type == "all") {
          if (item.lastId == first.id + "-all") {
            isChoosedFlag = true;
            return false;
          }

          return true;
        } else {
          if (item.lastId == second.id) {
            isChoosedFlag = true;
            return false;
          }

          return true;
        }
      });

      if (!isChoosedFlag) {
        // 新增
        if (type == "all") {
          /* this.choosedDismensionData.push({
            firstName: first.dname,
            firstId: first.id,
            lastName: '全部',
            lastId: first.id + '-all',
            type: 'all'
          })*/
        } else {
          this.choosedDismensionData.push({
            firstName: first.dname,
            firstId: first.id,
            lastName: second.dname,
            lastId: second.id,
            type: "only",
          });
        }

        this.updateDismensionSelectedStatus(first, second, type, "selected");

        this.onLoad();
      }
    },

    // 清除维度选择
    delChoosedDis(curItem) {
      this.choosedDismensionData.every((item, index) => {
        if (curItem.type == "all") {
          if (curItem.firstId == item.firstId) {
            this.choosedDismensionData.splice(index, 1);
            return false;
          }

          return true;
        } else {
          if (curItem.lastId == item.lastId) {
            this.choosedDismensionData.splice(index, 1);
            return false;
          }

          return true;
        }
      });

      this.updateDismensionSelectedStatus(curItem, null, curItem.type, "del");

      this.onLoad();
    },

    // 打开视角弹框
    showPerspectDialog() {
      this.isShowPerspectDialog = true;
    },

    // 关闭视角
    closeChoosePerspectDialog() {
      this.isShowPerspectDialog = false;
    },

    // 确定选择的视角
    saveChoosePerspectDialog() {
      let that = this;
      let perspects = [];

      perspects = this.$refs.choosePerspectRef.savePerspects();

      that.choosedPerspectData = [];

      perspects.forEach((item) => {
        that.choosedPerspectData.push(item);
      });

      if (that.choosedPerspectData.length > 0) {
        that.curPerspectData = that.choosedPerspectData[0];
      }

      this.isShowPerspectDialog = false;

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

    // 子组件的触发
    addOrEditEmitEvent(params) {
      this.curNodeDeepPath = [];
      params.nodeDeepPath.forEach((item) => {
        this.curNodeDeepPath.push(item);
      });
      this.faqManageType = params.type;
      this.faqManageDialogVisible = false;
      if (params.type == "mangelist") {
        this.onLoad();
      }
    },
    openFaqAddDialog() {
      this.faqManageDialogVisible = true;
      this.faqManageType = "add";
    },

    // 获取维度
    getSearchDismensionData() {
      getSearchDismensionUrl(this.botId).then((resData) => {
        let resTrueData = resData.data;

        if (resTrueData.code == 200) {
          resTrueData.data.forEach((item) => {
            //item.width = 100;
            if (item.sonList.length > 0) {
              item.sonList = [
                {
                  id: "all",
                  dname: this.$t("faq.all"),
                  selected: true,
                  type: "all",
                },
                ...item.sonList,
              ];
              item.sonList = item.sonList.map((secondItem) => {
                return {
                  selected: false,
                  type: "only",
                  ...secondItem,
                };
              });
            } else {
              item.sonList = [
                {
                  id: "all",
                  dname: this.$t("faq.all"),
                  selected: true,
                  type: "all",
                },
              ];
            }
          });
          this.searchDismensionData = resTrueData.data;
        }
      });
    },

    // 知识状态发生变化
    searchStatusChange() {
      this.onLoad();
    },

    // 清除状态值
    clearSearchChange() {
      this.onLoad();
    },

    // 找到所有的父级节点id
    getCurNodeParentIds(curNode) {
      let that = this;
      let prevNode = {};

      if (curNode && curNode.data.id == "0") {
        //that.curNodeDeepPath.push(curNode.parent.data.id);
        return false;
      }

      if (curNode && curNode.parent && curNode.parent.data) {
        prevNode = curNode.parent;
        that.curNodeDeepPath.push(prevNode.data.id);

        that.getCurNodeParentIds(prevNode);
      }
    },

    //获取树的node和resolve
    getNode(data) {
      this.node = data.node;
      this.resolve = data.resolve;
    },
    //左侧树节点点击,右侧区域响应
    nodeClick(nodeId) {
      let tree = this.$refs.tree.$refs.tree;
      let curNode = tree.getNode(nodeId);

      this.curNodeDeepPath = []; // 清空path

      // 查找当前节点的所有父级
      this.$nextTick(() => {
        this.getCurNodeParentIds(curNode);
        this.curNodeDeepPath.reverse().push(nodeId);

        this.curSelectedTreeNode = curNode;
        this.curTreeNodeId = curNode.data.id;

        this.onLoad();
      });
    },
    // 打开树的设置
    openSetting() {
      this.settingDrawer = true;
    },

    // 关闭通用分类的设置弹框
    treeSettingClose() {
      this.$refs.tree.clearNode();
      this.$refs.tree.loadNode(this.node, this.resolve);
    },

    // 搜索
    searchChange() {
      this.faqTablePage.currentPage = 1
      this.onLoad();
    },

    // 重置
    searchReset() {
      this.choosedDismensionData = [];
      this.queryObj = {
        titleType: "1",
        content: "",
        status: "", // 知识状态
        enable: "", // 启用停用
        avaliableStatus: "", // 有效期
        angleId: "", // 答案视角
      };
      this.choosedPerspectData = [];
      this.searchDismensionData.forEach((item) => {
        item.sonList.forEach((sonItem) => {
          if (sonItem.type == "all") {
            sonItem.selected = true;
          } else {
            sonItem.selected = false;
          }
        });
      });
      this.onLoad();
    },

    // 收起搜索
    expandOrPutUpSearch() {
      if (this.isExpandOrPutUp == "putup") {
        if (this.searchDismensionData.length > 0) {
          this.$refs.searchDismensionDlRef.forEach((ele) => {
            ele.setAttribute("style", "display: block");
          });
        }
        this.isExpandOrPutUp = "expand";

        if (this.isFirstExpandFlag) {
          this.$nextTick(() => {
            let secodDismensionRefs = this.$refs.secodDismensionRef;
            secodDismensionRefs &&
              secodDismensionRefs.forEach((item, index) => {
                let ulWidth = item.offsetWidth;
                let length = item.children.length;
                let allWith = 0;

                for (let i = 0; i < length; i++) {
                  let elem = window.getComputedStyle(item.children[i]);
                  let liWidth =
                    parseInt(elem.width) + parseInt(elem.marginRight);

                  allWith += liWidth;
                  if (allWith > ulWidth) {
                    allWith = allWith - liWidth;
                    break;
                  }
                }

                this.$set(this.searchDismensionData[index], "width", allWith);
              });

            this.moreSearchTitleHeight =
              this.$refs.moreSearchConditionRef.offsetHeight;
          });

          this.isFirstExpandFlag = false;
        }
      } else {
        if (this.searchDismensionData.length > 0) {
          this.$refs.searchDismensionDlRef.forEach((ele) => {
            ele.setAttribute("style", "display: none");
          });
        }
        this.isExpandOrPutUp = "putup";
      }
    },

    // 查看知识
    viewFaq(row) {
      this.faqManageDialogVisible = true;
      this.curVesionRecordRow = row;

      this.faqManageType = "view";
    },

    // 编辑知识
    openEditFaq(row) {
      this.faqManageDialogVisible = true;
      this.curVesionRecordRow = row;

      this.faqManageType = "edit";
    },

    // 删除知识
    delFaq(row, index, type) {
      let ids = [];
      let isOnlyStr = "";
      if (type == "only") {
        ids.push(row.id);
        isOnlyStr = this.$t("faq.should");
      } else {
        if (this.selectionList.length == 0) {
          this.$message({
            type: "warning",
            message: this.$t("faq.selectKnowledgeTips"),
          });
          return false;
        }

        if (this.selectionList.length > 0 && this.isAudit ) {
          // console.log(this.isAudit);
          // console.log('this.selectionList', this.selectionList);

          let canDel = true;
          this.selectionList.forEach((item) => {
            if( item.auditStatus == "auditing") {
              canDel = canDel &&  false
            }
          });

          // console.log('canDel', canDel);
          if( !canDel ){
            this.$message({
              type: "warning",
              message: this.$t("faq.selectKnowledgeHasAudit"),
            });
            return false;
          }
        }


        this.selectionList.forEach((item) => {
          ids.push(item.id);
        });
        isOnlyStr = this.$t("faq.these");
      }
      this.$confirm(
        `${this.$t("faq.deletionTips")} ${isOnlyStr} ${this.$t(
          "faq.knowledge"
        )}？`,
        {
          confirmButtonText: this.$t("aicosCommon.confirmBtn"),
          cancelButtonText: this.$t("aicosCommon.cancelBtn"),
          type: "warning",
        }
      )
        .then(() => {
          return delFaqUrl(ids.join(","));
        })
        .then(() => {
          this.$message({
            type: "success",
            message: this.$t("aicosCommon.deleteSuccessTip"),
          });
          this.onLoad();
        });
    },

    // 停用启用
    enableOrStop(row, type, isBatch) {
      let ids = [];
      let str = "";
      let isOnlyStr = "";
      if (isBatch == "only") {
        ids.push(row.id);
        isOnlyStr = this.$t("faq.should");
      } else {
        if (this.selectionList.length == 0) {
          this.$message({
            type: "warning",
            message: this.$t("faq.selectKnowledgeTips"),
          });
          return false;
        }
        this.selectionList.forEach((item) => {
          ids.push(item.id);
        });
        isOnlyStr = this.$t("faq.these");
      }

      if (type == "1") {
        str = this.$t("faq.enable");
      } else {
        str = this.$t("faq.deactivate");
      }

      this.$confirm(
        `${this.$t("faq.sureTips")} ${str} ${isOnlyStr} ${this.$t(
          "faq.knowledge"
        )}？`,
        {
          confirmButtonText: this.$t("aicosCommon.confirmBtn"),
          cancelButtonText: this.$t("aicosCommon.cancelBtn"),
          type: "warning",
        }
      )
        .then(() => {
          return enableOrStopFaqUrl(ids.join(","), type);
        })
        .then(() => {
          this.$message({
            type: "success",
            message: `${isOnlyStr}${this.$t("faq.knowledge")}${str}${this.$t(
              "faq.success"
            )}!`,
          });
          this.onLoad();
        });
    },

    // 批量操作
    batchOperation(command) {
      if (command == "del") {
        this.delFaq(null, 0, "batch");
      } else if (command === "enable") {
        this.enableOrStop(null, "1", "batch");
      } else if (command === "stop") {
        this.enableOrStop(null, "0", "batch");
      } else if (command === "export") {
        let form = document.createElement("form");
        form.setAttribute("style", "display:none");
        form.setAttribute("method", "get");
        //机器人id
        let botInput = document.createElement("input");
        botInput.setAttribute("type", "hidden");
        botInput.setAttribute("name", "botId");
        botInput.setAttribute("value", this.botId);
        form.append(botInput);
        //左侧分类树id cateId
        let cateInput = document.createElement("input");
        cateInput.setAttribute("type", "hidden");
        cateInput.setAttribute("name", "cateid");
        cateInput.setAttribute(
          "value",
          this.curTreeNodeId ? this.curTreeNodeId : "0"
        );
        form.append(cateInput);
        //答案视角信息 angleId
        let angleInput = document.createElement("input");
        angleInput.setAttribute("type", "hidden");
        angleInput.setAttribute("name", "angleId");
        angleInput.setAttribute("value", this.angleList.join(","));
        form.append(angleInput);
        //有效期 avaliableStatus
        let avaliableStatusInput = document.createElement("input");
        avaliableStatusInput.setAttribute("type", "hidden");
        avaliableStatusInput.setAttribute("name", "avaliableStatus");
        avaliableStatusInput.setAttribute(
          "value",
          this.queryObj.avaliableStatus
        );
        form.append(avaliableStatusInput);
        //输入框的内容 contentInput
        let contentInput = document.createElement("input");
        contentInput.setAttribute("type", "hidden");
        contentInput.setAttribute("name", "content");
        contentInput.setAttribute("value", this.queryObj.content);
        form.append(contentInput);
        //搜索类型 titleType
        let titleTypeInput = document.createElement("input");
        titleTypeInput.setAttribute("type", "hidden");
        titleTypeInput.setAttribute("name", "titleType");
        titleTypeInput.setAttribute("value", this.queryObj.titleType);
        form.append(titleTypeInput);
        //维度信息 dimensionId
        let dimensionIdInput = document.createElement("input");
        dimensionIdInput.setAttribute("type", "hidden");
        dimensionIdInput.setAttribute("name", "dimensionId");
        dimensionIdInput.setAttribute("value", this.dimensionIdList.join(","));
        form.append(dimensionIdInput);
        //状态 status
        let statusInput = document.createElement("input");
        statusInput.setAttribute("type", "hidden");
        statusInput.setAttribute("name", "dimensionId");
        statusInput.setAttribute("value", this.queryObj.status);
        form.append(statusInput);
        //启用,停用 enable
        let enableInput = document.createElement("input");
        enableInput.setAttribute("type", "hidden");
        enableInput.setAttribute("name", "enable");
        enableInput.setAttribute("value", this.queryObj.enable);
        form.append(enableInput);
        // 分页参数
        let sizeInput = document.createElement("input");
        sizeInput.setAttribute("type", "hidden");
        sizeInput.setAttribute("name", "size");
        sizeInput.setAttribute("value", this.faqTablePage.pageSize);
        form.append(sizeInput);
        let currentInput = document.createElement("input");
        currentInput.setAttribute("type", "hidden");
        currentInput.setAttribute("name", "current");
        currentInput.setAttribute("value", this.faqTablePage.currentPage);
        form.append(currentInput);
        form.setAttribute(
          "action",
          `${baseURL}api/${knowledge}/faqQuestion/export`
        );
        // form.setAttribute("target", "_blank");
        form.setAttribute("target", "_self");
        let body = document.createElement("body");
        body.setAttribute("style", "display:none");
        document.body.appendChild(form);
        form.submit();
        form.remove();
      } else if (command === "import") {
        this.importFlag = true;
      } else if (command === "sync") {
        oneKeySync(this.curTreeNodeId).then((res) => {
          if (res.data.code == 200) {
            this.$message.success(this.$t("faq.syncSuccessfulTips"));
            this.onLoad();
          }
        });
      }
    },
    //导入保存
    handlerSave() {
      this.importBtn = true;
      this.$refs.import.saveImport();
    },
    successImport(type) {
      this.importBtn = false;
      if (type) {
        this.importFlag = false;
        this.onLoad();
        this.$refs.tree.clearNode();
        this.$refs.tree.loadNode(this.node, this.resolve);
      }
    },
    // 置顶
    updateTopStatus(row, type) {
      // updateTopStatusUrl
      updateTopStatusUrl(row.id, type).then((resData) => {
        resData = resData.data;
        if (resData.code == 200) {
          this.onLoad();
        }
      });
    },

    // 发布
    async publishFaq(row) {
      let status = "1";
      if (this.isAudit) {
        await kmAuditStart(row, 1, this.auditSetting.processDefineId);
        this.onLoad();
      } else {
        publishFaqUrl(row.id, status).then((resData) => {
          resData = resData.data;
          if (resData.code == 200) {
            this.$message({
              type: "success",
              message: this.$t("faq.releasedKnowledgeTips"),
            });
            this.onLoad();
          }
        });
      }
    },

    // 版本记录
    openVersionRecordDialog(row) {
      this.curVesionRecordRow = row;
      this.vesionRecordIsShow = true;
    },

    selectionChange(list) {
      this.selectionList = list;
    },
    selectionClear() {
      this.selectionList = [];
      this.$refs.crud.toggleSelection();
    },
    currentChange(currentPage) {
      this.faqTablePage.currentPage = currentPage;
    },
    sizeChange(pageSize) {
      this.faqTablePage.pageSize = pageSize;
    },

    onLoad() {
      let dimensionId = [];
      let angleId = [];
      let info = {};

      this.choosedDismensionData.forEach((item) => {
        if (item.type == "only") {
          dimensionId.push(item.lastId);
        }
      });
      this.dimensionIdList = dimensionId;
      // 视角
      this.choosedPerspectData.forEach((item) => {
        angleId.push(item.id);
      });
      this.angleList = angleId;
      info = {
        ...this.queryObj,
        botId: this.botObj.id,
        dimensionId: dimensionId.join(","),
        angleId: angleId.join(","),
        cateid: this.curTreeNodeId ? this.curTreeNodeId : "0",
        current: this.faqTablePage.currentPage,
        size: this.faqTablePage.pageSize,
      };

      this.loading = true;
      loadListUrl(info).then((resData) => {
        resData = resData.data;
        if (resData.code == 200) {
          if (this.language != "zh") {
            this.faqTableOption.column.forEach((item) => {
              let width = getTextWidth(item.label).nodeWidth + 80;
              this.$set(item, "width", width);
            });
          }
          this.faqTableData = resData.data.records;
          // this.tableDataHandle(this.data, "children");
          this.faqTablePage.total = resData.data.total;
          this.loading = false;
        }
      });
    },

    viewAuditRecords(row) {
      this.recordParams = {
        kmDataId: row.id,
        kmVersion: row.versionNum,
        kmType: 1,
      };

      this.$refs.auditRecordsRef.auditRecordsOpen();
    },

    async closeAudit(row) {
      const dataParam = {
        kmDataId: row.id,
        kmType: 1,
        kmVersion: row.versionNum,
      };
      await kmAuditColse(dataParam)
        .then(async (res) => {
          console.log(res);
          this.onLoad();
        })
        .catch((error) => {
          window.console.error(error);
        });
    },
  },
  created() {
    this.botId = this.botObj.id; // 机器人id
  },
  mounted() {
    this.getAuditConfig();

    // 获取机器人id
    //let query = {};
    // 收起左侧菜单
    if (!this.$store.getters.isCollapse) {
      this.$store.commit("SET_COLLAPSE");
    }
    if (this.desktopWindow) {
      // query = this.desktopWindow.data.query;

      this.allWindowTopBodyHeight =
        this.desktopWindow.$el.getElementsByClassName(
          "desk-window-inner"
        )[0].offsetHeight;

      this.desktopWindow.$on("resize", this.desktopWindowResize);
    }
    // 获取维度
    this.getSearchDismensionData();
    // 获取路由参数
    let content = getStore({ name: "robotStudy" });
    console.log(content);
    // if(content.type === 'faq'){
    // }
  },
  beforeDestroy() {
    if (this.desktopWindow) {
      this.desktopWindow.$off("resize", this.desktopWindowResize);
    }
  },
  destroyed() {},
};
</script>

<style lang="scss" scoped>
.faq-manage-container {
  position: relative;
  // padding-left: 250px;

  .fag-manage-tree {
    position: absolute;
    left: 0;
    width: 250px;
    background-color: #fff;
    margin: 0 -7px;
  }

  .fag-manage-content {
    background-color: #fff;
    // margin-left: 25px;
    padding: 10px 0;
    overflow-y: auto;
  }
}

/deep/ .choose-perspective-dialog {
  .el-dialog__body {
    padding: 0px 0px 0 20px;
  }
}

/deep/ .avue-crud__menu {
  display: none;
}

/deep/ .choose-dismension-dialog {
  border-radius: 10px;

  .el-dialog__header {
    display: none;
  }

  .el-dialog__body {
    padding: 0px 0px 10px;
  }
}

/deep/ .el-table__row {
  p {
    margin: 0;
    padding: 0;
  }

  .answer-table-contaner {
    height: 32px;
    overflow: hidden;

    p {
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      width: 100%;

      img {
        width: 20px !important;
        height: 20px !important;
      }
    }
  }
}

.faq-table-header {
  .faq-search-header-wrap {
    /*position: relative;
      padding-left: 120px;
      padding-right: 315px;*/

    .faq-search-select {
      position: absolute;
      left: 0;
      top: 0;
      width: 110px;
    }

    .faq-search-value {
      position: relative;

      .faq-search-input {
        /*width: 80%;*/
        min-width: 250px;
        display: inline-block;
        padding-right: 126px;
        position: relative;
      }

      .faq-search-buttons {
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

    .faq-search-input-wrap {
      /*display: flex;
        justify-content: end;
        align-items: center;*/
      margin-top: 20px;

      .faq-search-input-row {
        float: right;
        position: relative;
        padding-left: 120px;
      }
    }

    .faq-operation-btns {
      /* position: absolute;
        right: 0;
        top: 0;*/
      text-align: right;

      .el-dropdown {
        margin-left: 10px;
      }
    }
  }

  .faq-dismension-search-wrap {
    margin-top: 20px;
    margin-bottom: 20px;
    border-bottom: 2px solid #f3f5f8;

    .dismension-search-wrap {
      margin-bottom: 20px;
      border-bottom: 1px solid #f3f5f8;

      .dismension-dl {
        padding-left: 160px;
        list-style: none;
        border-top: 1px solid #f3f5f8;
        height: 47px;
        position: relative;
        margin: 0;
        display: none;

        dt {
          position: absolute;
          left: 0;
          top: 0;
          width: 160px;
          background-color: #f7f9fb;
          line-height: 47px;
          color: #070b2d;
          text-align: center;
          padding: 0 10px;
          font-size: 14px;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        dd {
          margin: 0 40px;
          padding: 0;

          .second-dismension-ul {
            display: flex;
            padding: 0;
            margin: 0;
            list-style: none;
            height: 47px;
            overflow: hidden;

            li {
              padding-right: 18px;
              position: relative;
              margin: 0;
              line-height: 47px;
              max-width: 160px;
              margin-right: 20px;

              .dismension-more-icon {
                position: absolute;
                right: 0;
                top: 0;
                height: 47px;
                line-height: 47px;
                cursor: pointer;
              }

              .dismension-name {
                font-size: 14px;
                color: #565863;
                display: block;
                white-space: nowrap;
                text-overflow: ellipsis;
                overflow: hidden;
                cursor: pointer;
              }

              .selected-dismension-name {
                color: #0045c8;
              }
            }
          }

          .dismension-more {
            display: none;
          }
        }

        @media screen and (max-width: 1306px) {
          dd {
            margin: 0 20px;
          }
        }

        .dismension-more-dd-wrap {
          margin-top: 7px;
        }

        .second-dismension-dd-more {
          padding-right: 30px;
          position: relative;

          .dismension-more {
            display: block;
            position: absolute;
            right: 0;
            top: 0;
            line-height: 47px;
            padding-right: 0;
            width: inherit;
            cursor: pointer;
          }
        }
      }

      .dismension-more-dl {
        height: inherit;
        display: block;
      }

      .search-other-item {
        width: 180px;
        margin-right: 10px;
        float: left;
        margin-bottom: 6px;
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
    /* line-height: 32px;*/
    min-height: 30px;

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
      font-size: 13px;
      padding-left: 15px;
      padding-top: 7px;
      overflow: hidden;
      width: 100%;
      white-space: nowrap;
      text-overflow: ellipsis;
    }
  }

  .perspect-select-icon {
    position: absolute;
    right: 0;
    top: -4px;
  }
}
</style>
