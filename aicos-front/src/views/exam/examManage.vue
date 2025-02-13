<template>
  <HuilanBasic>
    <HuilanBasicToolbar>
      <el-button
        type="primary"
        size="small"
        @click.stop="addRow"
        v-if="permissionList.addBtn"
        >新增</el-button
      >
    </HuilanBasicToolbar>

    <QSGSearchBar
      :formData="searchForm"
      :fields="listOption"
      @search="searchChange"
      @refresh="refreshChange"
      @reset="searchReset"
      ref="searchFormRef"
    >
      <template v-slot:appendTool>
        <el-button type="default" @click="configColumn"
          ><i class="el-icon-s-operation"></i
        ></el-button>
      </template>
    </QSGSearchBar>

    <avue-crud
      :option="listOption"
      :table-loading="loading"
      :data="listData"
      ref="listRef"
      v-model="listForm"
      :page.sync="page"
      :permission="permissionList"
      :before-open="beforeOpen"
      :before-close="beforeClose"
      @row-del="rowDel"
      @row-update="rowUpdate"
      @row-save="rowSave"
      @search-change="searchChange"
      @search-reset="searchReset"
      @selection-change="selectionChange"
      @current-change="currentChange"
      @size-change="sizeChange"
      @refresh-change="refreshChange"
      @on-load="onLoad"
      @tab-click="crudUpdateTabClick"
      :upload-after="uploadAfter"
      :upload-before="uploadBefore"
      :upload-error="uploadError"
      :upload-delete="uploadDelete"
      :upload-preview="uploadPreview"
    >
      <template slot-scope="scope" slot="menu">
        <el-button
          type="text"
          size="small"
          v-if="permissionList.updateBtn"
          :disabled="
            scope.row.publishStatus !== 0 ||
            new Date(scope.row.endTime).getTime() < new Date().getTime()
          "
          @click.stop="updateRow(scope.row, scope.index)"
          >编辑
        </el-button>
        <el-button
          type="text"
          size="small"
          :disabled="
            scope.row.publishStatus !== 0 ||
            new Date(scope.row.endTime).getTime() < new Date().getTime()
          "
          v-if="permissionList.updateBtn"
          @click.stop="selectExamRow(scope.row)"
          >选择试卷
        </el-button>
        <el-button
          type="text"
          size="small"
          @click.stop="viewRow(scope.row)"
          :disabled="validatenull(scope.row.questionnaireId)"
        >
          预览
        </el-button>
        <el-button
          type="text"
          size="small"
          v-if="
            permissionList.publishBtn &&
            scope.row.publishStatus == 0 &&
            new Date(scope.row.endTime).getTime() > new Date().getTime()
          "
          :disabled="validatenull(scope.row.questionnaireId)"
          @click.stop="pubulicRow(scope.row, 1)"
          >发布
        </el-button>
        <el-button
          type="text"
          size="small"
          :disabled="scope.row.publishStatus == 2"
          v-if="
            permissionList.publishBtn &&
            scope.row.publishStatus == 1 &&
            new Date(scope.row.endTime).getTime() > new Date().getTime()
          "
          @click.stop="pubulicRow(scope.row, 2)"
          >结束
        </el-button>

        <el-dropdown
          class="qsg-more-actions"
          @visible-change="dropdownVisibleChange"
        >
          <span class="qsg-dropdown-link">
            更多<i class="el-icon-arrow-down el-icon--right"></i>
          </span>
          <el-dropdown-menu
            ref="dropdownRef"
            class="qsg-dropdown-btns"
            slot="dropdown"
          >
            <div class="qsg-dropdown-btns-cum" v-show="dropdownTag">
              <!-- <div class="el-dropdown-menu__item">
                <el-button
                  type="text"
                  size="small"
                  v-if="permissionList.statisticBtn"
                  @click.stop="
                    (e) => {
                      copyRow(scope.row, scope.index);
                    }
                  "
                  >复制
                </el-button>
              </div> -->
              <div class="el-dropdown-menu__item">
                <el-button
                  type="text"
                  size="small"
                  v-if="permissionList.statisticBtn"
                  :disabled="
                    scope.row.subjectNum < 1 ||
                    scope.row.submitNum < 1 ||
                    scope.row.publishStatus == 0
                  "
                  @click.stop="
                    (e) => {
                      dropdownHide();
                      statisticRow(scope.row, scope.index);
                    }
                  "
                  >统计分析
                </el-button>
              </div>
              <div class="el-dropdown-menu__item">
                <el-button
                  type="text"
                  size="small"
                  v-if="permissionList.deleteBtn"
                  :disabled="scope.row.publishStatus == 1"
                  @click.stop="
                    (e) => {
                      dropdownHide();
                      deleteRow(scope.row, scope.index);
                    }
                  "
                  >删除
                </el-button>
              </div>
            </div>
          </el-dropdown-menu>
        </el-dropdown>
      </template>
      <template slot="pitchIn" slot-scope="scope">
        <div class="pitchIn" v-if="scope.row.publishStatus !== 0">
          <span class="copyUrl" @dblclick="copyPitchInUrl(scope.row)">
            {{ winUrl }}/aicos/#/exam/examDataAdd?examId={{ scope.row.id }}
          </span>
          <el-button
            class="copyBtn"
            type="text"
            icon="el-icon-copy-document"
            @click.stop="copyPitchInUrl(scope.row)"
          >
          </el-button>
        </div>
        <div v-else>--</div>
      </template>
      <template slot-scope="scope" slot="repeatePeriodForm">
        <div>
          <el-input-number
            v-model="listForm.repeatePeriod"
            :min="0"
            :max="99999"
            class="repeatePeriod"
          ></el-input-number>
          <el-link :underline="false" class="repeatePeriodTips">
            分钟参与一次
            <el-link type="warning" :underline="false" class="link"
              >(0代表不限制)</el-link
            >
          </el-link>
        </div>
      </template>
      <template slot-scope="scope" slot="startEndTimeForm">
        <div style="display: flex">
          <el-date-picker
            v-model="listForm.startEndTime"
            type="datetimerange"
            format="yyyy-MM-dd HH:mm:ss"
            value-format="yyyy-MM-dd HH:mm:ss"
            :default-time="['00:00:00', '23:59:59']"
            range-separator="-"
            start-placeholder="开始时间"
            end-placeholder="结束时间"
            size="small"
            style="margin-right: 10px"
          >
          </el-date-picker>
          <!-- <el-checkbox v-model="listForm.autoPublish" size="small"
            >自动发布</el-checkbox
          > -->
        </div>
      </template>
      <template slot-scope="scope" slot="answerDurationForm">
        <el-radio-group
          v-model="listForm.isAnswerDuration"
          @input="changeAnswerTime"
        >
          <el-radio :label="0">不限制</el-radio>
          <el-radio :label="-1">
            <el-input-number
              v-model="listForm.answerDuration"
              :min="0"
              :max="99999"
              :precision="0"
              :controls="false"
              style="text-align: center"
              class="repeatePeriod"
            ></el-input-number
            >分钟自动交卷
          </el-radio>
        </el-radio-group>
      </template>
      <template slot-scope="scope" slot="minAnswerDurationForm">
        <el-radio-group
          v-model="listForm.isMinAnswerDuration"
          @input="changeMinAnswerTime"
        >
          <el-radio :label="0">不限制</el-radio>
          <el-radio :label="-1">
            <el-input-number
              v-model="listForm.minAnswerDuration"
              :min="0"
              :max="99999"
              :precision="0"
              :controls="false"
              style="text-align: center"
              class="repeatePeriod"
            ></el-input-number
            >分钟才能交卷
          </el-radio>
        </el-radio-group>
      </template>
      <!-- <template slot-scope="scope" slot="limitNumForm">
        <el-radio-group v-model="listForm.isLimitNum" @input="changeLimitNum">
          <el-radio :label="0">不限制</el-radio>
          <el-radio :label="-1"
            >限制
            <el-input-number
              v-model="listForm.limitNum"
              :min="0"
              :max="99999"
              :precision="0"
              :controls="false"
              style="text-align: center"
              class="repeatePeriod"
            ></el-input-number
            >次
          </el-radio>
        </el-radio-group>
      </template> -->
      <!-- <template slot-scope="scope" slot="questionnaireNameLabel">
        <span>考试名称</span>
        <el-tooltip
          effect="dark"
          content="修改考试名称，会重置设计界面标题设置。"
          placement="top-start"
          v-if="scope.type == 'edit'"
        >
          <i
            class="el-icon-warning"
            style="color: #f05050; margin-left: 3px"
          ></i>
        </el-tooltip>
      </template> -->

      <template slot-scope="scope" slot="joinUserJsonForm">
        <div>
          <OptOrgCommon
            v-model="listForm.joinUserJson"
            title="选择参与者"
            :tabs="['user', 'dept']"
            :dataView="OptOrgDataView"
          ></OptOrgCommon>
        </div>
      </template>
    </avue-crud>
    <QSGDrawer
      title="选择试卷"
      size="40%"
      append-to-body
      :visible.sync="selectExamDialog"
    >
      <el-form
        :model="ruleForm"
        size="small"
        :rules="rules"
        ref="ruleForm"
        label-width="100px"
        class="demo-ruleForm"
        v-if="selectExamDialog"
      >
        <el-form-item label="试卷信息：" prop="questionnaireName">
          <el-button
            size="mini"
            icon="el-icon-plus"
            type="primary"
            plain
            @click="examBankClick"
            v-if="validatenull(ruleForm.questionnaireId)"
            >选择试卷</el-button
          >
          <template v-if="!validatenull(ruleForm.questionnaireId)">
            <span>
              <template v-if="ruleForm.questionnaireName.length > 30">
                <el-tooltip
                  class="item"
                  effect="dark"
                  :content="ruleForm.questionnaireName"
                  placement="top"
                >
                  <span
                    >{{ ruleForm.questionnaireName.substring(0, 30) }}...</span
                  >
                </el-tooltip>
              </template>
              <template v-else>
                {{ ruleForm.questionnaireName }}
              </template>
            </span>
            <el-button size="mini" type="primary" plain @click="examBankClick"
              >更改试卷</el-button
            >
          </template>
        </el-form-item>
        <template v-if="!validatenull(ruleForm.questionnaireId)">
          <el-form-item label="总分：">
            <span>{{ ruleForm.totalScore }}</span>
          </el-form-item>
          <el-form-item label="题目数量：">
            <span>{{ ruleForm.subjectNum }}</span>
          </el-form-item>
        </template>
        <el-form-item label="及格分数：" prop="passScore">
          <el-radio-group v-model="ruleForm.isPassScore">
            <el-radio :label="0">不限制</el-radio>
            <el-radio :label="-1">
              <el-input-number
                v-model="ruleForm.passScore"
                :min="0"
                :max="99999"
                :precision="0"
                :controls="false"
                style="text-align: center"
              ></el-input-number
              >分
            </el-radio>
          </el-radio-group>
        </el-form-item>
      </el-form>
      <template v-slot:footer>
        <el-button
          icon="el-icon-check"
          size="small"
          type="primary"
          @click.stop="saveExamSelect('ruleForm')"
          >保存
        </el-button>
        <el-button icon="el-icon-close" size="small" @click="examSelectClose"
          >关闭</el-button
        >
      </template>
    </QSGDrawer>
    <HuilanDialog
      title="选择试卷"
      :fullscreen="false"
      width="960px"
      append-to-body
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      :visible.sync="examBankDialog"
    >
      <el-row :gutter="20" class="topicDialogStyle">
        <el-col :span="8">
          <avue-tree
            class="topicTree"
            ref="treeRef"
            :option="treeOption"
            :data="treeData"
            @node-click="treeNodeClick"
            :filter-node-method="filterNode"
          >
          </avue-tree>
        </el-col>
        <el-col :span="16">
          <div style="display: flex; align-items: center; margin-bottom: 20px">
            <el-input
              size="small"
              v-model="examSearchForm.keyWords"
              placeholder="请输入试卷名称"
              clearable
            ></el-input>
            <el-button
              size="small"
              type="primary"
              icon="el-icon-search"
              @click="examSearchChange"
            ></el-button>
          </div>
          <!-- :page.sync="manualOperationPage" -->
          <avue-crud
            :option="manualOperationOption"
            :data="manualOperationData"
            :table-loading="manualOperationLoading"
            ref="manualOperationTable"
            @selection-change="selectionChange"
            @current-change="currentChange"
            @size-change="sizeChange"
            @on-load="manualOperationOnLoad"
            class="manualOperationStyle"
          >
            <template slot="radio" slot-scope="{ row }">
              <el-radio v-model="selectRow" :label="row">
                <span style="font-size: 0px">1</span>
              </el-radio>
            </template>
          </avue-crud>
        </el-col>
      </el-row>
      <template v-slot:footer>
        <el-button
          icon="el-icon-check"
          size="small"
          type="primary"
          @click.stop="saveExamBankSelect"
          >保存
        </el-button>
        <el-button
          icon="el-icon-close"
          size="small"
          @click="examBankDialog = false"
          >取消</el-button
        >
      </template>
    </HuilanDialog>
  </HuilanBasic>
</template>
<script>
import "@/styles/qsgCommon.scss";

import { mapGetters } from "vuex";
import { baseURL } from "@/api/common";
import { getRules } from "@/util/regx";

import QSGSearchBar from "@/components/QSGSearchBar/index";
import QSGDrawer from "@/components/QSGDrawer/index";
// import ExamView from '@/components/ExamView/index';

import {
  isNull,
  checkSameVal,
  getHtmlPlainText,
  findNodeByVal,
} from "@/util/qsgCommon";
import { dateFormat } from "@/util/date.js";

// import { makeApiJsonByDomitem, makeFrontJsonByBackJson } from "./examPublic";

import OptOrgCommon from "@/views/optOrg/OptOrgCommon";

import {
  getExamList,
  addExamList,
  updateExamList,
  delExamList,
  publishExamList,
  listBoundPage
} from "@/api/exam/examManage";
import { getTreeData } from "@/api/exam/exam/tree";
// import { getList } from "@/api/exam/exam/table";

export default {
  inject: ["desktopWindow", "desktop"],

  name: "ExamList",
  components: {
    QSGSearchBar,
    // ExamView,
    QSGDrawer,
    OptOrgCommon,
  },
  computed: {
    ...mapGetters(["permission", "userInfo"]),
    permissionList() {
      return {
        addBtn: this.vaildData(this.permission[`exam-examManage-save`], false),
        updateBtn: this.vaildData(
          this.permission[`exam-examManage-update`],
          false
        ),
        // designBtn: this.vaildData(this.permission[`exam-design`], false),
        // useBtn: this.vaildData(this.permission[`exam-use`], false),
        statisticBtn: true,
        deleteBtn: this.vaildData(
          this.permission[`exam-examManage-delete`],
          false
        ),
        publishBtn: this.vaildData(
          this.permission[`exam-examManage-publish`],
          false
        ),
        // copyBtn: this.vaildData(this.permission[`exam-copy`], false),
        // enableBtn: this.vaildData(this.permission[`exam-enableStatus`], false),
      };
    },
  },
  data() {
    return {
      // 选择试卷
      selectExamDialog: false,
      examRow: {},
      ruleForm: {
        questionnaireId: "",
        questionnaireName: "",
        passScore: 0,
        totalScore: 0,
        subjectNum: 0,
        isPassScore: 0,
        editorFrontJson: "",
      },
      rules: {
        questionnaireName: [
          { required: true, message: "请选择试卷", trigger: "blur" },
        ],
        passScore: [
          { required: true, message: "请设置及格分数", trigger: "change" },
        ],
      },
      selectRow: {},
      examBankDialog: false,
      filterText: "",
      treeData: [
        {
          name: "试卷分类",
          id: "0",
          active: false,
          children: [],
        },
      ],
      treeCurrentNode: {
        name: "试题分类",
        id: "0",
        active: false,
        children: [],
      },
      treeOption: {
        menu: false,
        addBtn: false,
        nodeKey: "id",
        props: {
          label: "name",
          children: "children",
          // 设置了value后getNode才能通过key获取节点
          value: "id",
        },
        defaultExpandedKeys: ["0"],
      },
      treeProps: {
        label: "name",
        value: "id",
        children: "children",
      },
      selectionList: [],
      // manualOperationPage: {
      //   pageSize: 10,
      //   currentPage: 1,
      //   total: 1,
      // },
      examSearchForm: {
        keyWords: "",
      },
      manualOperationLoading: false,
      manualOperationOption: {
        menu: false,
        addBtn: false,
        columnBtn: false,
        refreshBtn: false,
        header: false,
        selection: false,
        reserveSelection: true,
        tip: true,
        height: "300",
        column: [
          {
            label: "",
            prop: "radio",
            width: 50,
            hide: false,
          },
          {
            label: "试卷名称",
            prop: "name",
            overHidden: true,
            wdth: 90,
          },
          {
            label: "随机试卷",
            prop: "ifSubjectRandomType",
            type: "radio",
            dicData: [
              {
                label: "关闭",
                value: 0,
              },
              {
                label: "开启",
                value: 1,
              },
            ],
          },
          {
            label: "题目数量",
            prop: "subjectNum",
          },
          {
            label: "总分",
            prop: "totalScore",
          },
        ],
      },
      manualOperationData: [],
      //
      OptOrgDataView: false,

      winUrl: window.origin,
      dropdownTag: false,

      editTempData: {},

      searchForm: {},
      loading: true,
      page: {
        pageSize: 10,
        currentPage: 1,
        total: 0,
        pageSizes: [10, 20, 30, 40, 50, 100],
      },

      listForm: {
        repeatePeriod: 5,
        // autoPublish: false,
        limitNum: 0,
        isAnswerDuration: 0,
        answerDuration: 0,
        minAnswerDuration: 0,
        isMinAnswerDuration: 0,
        isLimitNum: 0,
      },
      query: {},
      listData: [],
      listOption: {
        header: false,
        tip: false,
        searchShow: false,
        border: false,
        index: true,
        // selection: true,
        viewBtn: false,
        delBtn: false,
        editBtn: false,
        columnBtn: true,

        menuWidth: 300,
        dialogWidth: "40%",
        dialogType: "drawer",
        dialogClickModal: false,
        dialogCustomClass: "huilan-drawer-form",

        span: 24,
        labelWidth: 110,
        column: [
          {
            label: "ID",
            prop: "id",
            hide: true,
            disabled: true,
            display: false,
          },
          {
            label: "考试名称",
            prop: "testName",
            overHidden: true,
            search: true,
            display: false,
            formatter: (val, value, label) => {
              if (this.validatenull(value)) {
                return "--";
              }
              return label;
            },
          },
          {
            label: "试卷名称",
            prop: "questionnaireName",
            display: false,
            overHidden: true,
            formatter: (val, value, label) => {
              if (this.validatenull(value)) {
                return "--";
              }
              return label;
            },
          },
          {
            label: "考试链接",
            prop: "pitchIn",
            display: false,
            overHidden: true,
            align: "center",
            width: 300,
          },
          /*{
            label: '问卷状态',
            prop: 'status',
            //hide: true,
            display: false,
            type: 'radio',
            search: false,
            searchType: 'select',
            dicData: [
              {
                label:'启用',
                value: 1,
              },
              {
                label:'停用',
                value: 0,
              }
            ],
            align: 'center',
            width: 160,
          },*/
          {
            label: "定时发布",
            prop: "isAutoPublic",
            display: false,
            hide: true,
            type: "radio",
            dicData: [
              {
                label: "启用",
                value: 1,
              },
              {
                label: "停用",
                value: 0,
              },
            ],
            align: "center",
            width: 100,
          },

          {
            label: "考试状态",
            prop: "publishStatus",
            display: false,
            search: true,
            searchType: "select",
            dicData: [
              {
                label: "未发布",
                value: 0,
              },
              {
                label: "已发布",
                value: 1,
              },
              {
                label: "已结束",
                value: 2,
              },
            ],
            align: "center",
            width: 100,
          },
          // {
          //   label: "开启审核",
          //   prop: "isAudit",
          //   display: false,
          //   search: true,
          //   hide:true,
          //   searchType: "select",
          //   type: "radio",
          //   dicData: [
          //     {
          //       label: "开启",
          //       value: 1,
          //     },
          //     {
          //       label: "不开启",
          //       value: 0,
          //     },
          //   ],
          //   value: 1,
          //   align: "center",
          //   width: 100,
          // },
          // {
          //   label: "限制设置",
          //   prop: "limitType",
          //   type: "radio",
          //   hide: true,
          //   display: false,
          //   search: false,
          //   searchType: "select",
          //   dicData: [
          //     {
          //       label: "无限制",
          //       value: 0,
          //     },
          //     {
          //       label: "对IP限制",
          //       value: 1,
          //     },
          //     {
          //       label: "对账号限制",
          //       value: 2,
          //     },
          //   ],
          //   align: "center",
          //   width: 100,
          // },

          // {
          //   label: 'editorFrontJson',
          //   prop: 'editorFrontJson',
          //   hide: true,
          //   display: false,
          // },
          // {
          //   label: "参与次数",
          //   prop: "submitNum",
          //   display: false,
          //   hide:true,
          //   align: "center",
          //   width: 100,
          // },

          // {
          //   label: "作者",
          //   prop: "createrRealName",
          //   overHidden: true,
          //   display: false,
          //   hide:true,
          //   align: "center",
          //   width: 120,
          // },

          {
            label: "开始时间",
            prop: "startTime",
            display: false,
            align: "center",
            width: 200,
          },
          // {
          //   label: "使用系统",
          //   prop: "systemCode",
          //   hide: true,
          //   display: false,
          //   align: "center",
          //   width: 100,
          //   type: "radio",
          //   dicData: [
          //     {
          //       label: "AiCOS",
          //       value: "aicos",
          //     },
          //     {
          //       label: "AiSite",
          //       value: "aisite",
          //     },
          //   ],
          //   value: "aicos",
          // },
          // {
          //   label: "从属站点",
          //   prop: "siteId",
          //   hide: true,
          //   display: false,
          //   align: "center",
          //   width: 100,
          // },
          // {
          //   label: "问卷状态",
          //   prop: "status",
          //   hide: true,
          //   display: false,
          //   align: "center",
          //   width: 100,
          //   type: "radio",
          //   dicData: [
          //     {
          //       label: "启用",
          //       value: 1,
          //     },
          //     {
          //       label: "停用",
          //       value: 0,
          //     },
          //   ],
          //   value: 1,
          // },
          {
            label: "结束时间",
            prop: "endTime",
            display: false,
            align: "center",
            width: 200,
          },
        ],

        group: [
          {
            label: "基本信息",
            prop: "jbxx",
            icon: "el-icon-edit-outline",
            column: [
              {
                label: "ID",
                prop: "id",
                //hide: true,
                //disabled: true,
                display: false,
              },
              {
                label: "考试名称",
                prop: "testName",
                maxlength: 100,
                //editDisabled: true,
                showWordLimit: true,
                rules: [
                  {
                    required: true,
                    message: "请输入考试名称",
                    trigger: "blur",
                  },
                  ...getRules(["notEnSpecials"]),
                ],
              },
              {
                label: "选择试卷",
                prop: "questionnaireId",
                display: false,
              },
              {
                label: "试卷名称",
                prop: "questionnaireName",
                display: false,
              },

              // {
              //   label: "自动上下线",
              //   prop: "isAutoPublic",
              //   type: "radio",
              //   dicData: [
              //     {
              //       label: "启用",
              //       value: 1,
              //     },
              //     {
              //       label: "停用",
              //       value: 0,
              //     },
              //   ],
              //   value: 0,
              //   change: ({ value }) => {
              //     const startEndTimeColumn = this.findObject(
              //       this.listOption.group,
              //       "startEndTime"
              //     );
              //     if (value == 1) {
              //       this.$set(startEndTimeColumn, "disabled", false);
              //     } else {
              //       this.$set(startEndTimeColumn, "disabled", true);
              //     }
              //   },
              // },
              {
                label: "考试时间",
                prop: "startEndTime",
                type: "datetimerange",
                format: "yyyy-MM-dd HH:mm:ss",
                valueFormat: "yyyy-MM-dd HH:mm:ss",
                startPlaceholder: "上线时间",
                endPlaceholder: "下线时间",
                rules: [
                  {
                    required: true,
                    message: "请设置上下线时间",
                    trigger: "blur",
                  },
                  {
                    validator: checkSameVal,
                    trigger: "blur",
                  },
                ],
                value: [
                  dateFormat(new Date()),
                  dateFormat(new Date("2099-12-31 23:59:59")),
                ],
              },
              {
                label: "上线时间",
                prop: "startTime",
                display: false,
              },
              {
                label: "下线时间",
                prop: "endTime",
                display: false,
              },
              {
                label: "总答题时长",
                prop: "answerDuration",
                value: 0,
                type: "radio",
                dicData: [
                  {
                    label: "不限制",
                    value: 0,
                  },
                  {
                    label: "限制",
                    value: 60,
                  },
                ],
                rules: [
                  {
                    required: true,
                    message: "请设置总答题时长",
                    trigger: "blur",
                  },
                ],
              },
              {
                label: "最短答题时长",
                prop: "minAnswerDuration",
                value: 0,
                type: "radio",
                dicData: [
                  {
                    label: "不限制",
                    value: 0,
                  },
                  {
                    label: "限制",
                    value: 30,
                  },
                ],
                rules: [
                  {
                    required: true,
                    message: "请设置最短答题时长",
                    trigger: "blur",
                  },
                ],
              },
              {
                label: "限考次数",
                prop: "limitNum",
                value: 1,
                type: "radio",
                dicData: [
                  {
                    label: "不限制",
                    value: 0,
                  },
                  {
                    label: "限制1次",
                    value: 1,
                  },
                ],
                rules: [
                  {
                    required: true,
                    message: "请设置限考次数",
                    trigger: "blur",
                  },
                ],
              },
              // {
              //   label: "验证码",
              //   prop: "isCaptcha",
              //   type: "radio",
              //   dicData: [
              //     {
              //       label: "启用",
              //       value: 1,
              //     },
              //     {
              //       label: "停用",
              //       value: 0,
              //     },
              //   ],
              //   value: 0,
              // },
              // {
              //   label: '问卷状态',
              //   prop: 'status',
              //   //display: false,
              //   type: 'radio',
              //   dicData: [
              //     {
              //       label:'启用',
              //       value: 1,
              //     },
              //     {
              //       label:'停用',
              //       value: 0,
              //     }
              //   ],
              //   value: 1,
              // },
              // {
              //   label: "开启审核",
              //   prop: "isAudit",
              //   search: true,
              //   searchType: "select",
              //   type: "radio",
              //   dicData: [
              //     {
              //       label: "开启",
              //       value: 1,
              //     },
              //     {
              //       label: "不开启",
              //       value: 0,
              //     },
              //   ],
              //   value: 1,
              // },

              {
                label: "考试结果展示",
                prop: "isDirectAfterFinish",
                type: "radio",
                dicData: [
                  {
                    label: "显示感谢文字",
                    value: 0,
                  },
                  // {
                  //   label: "显示试卷明细",
                  //   value: 2,
                  // },
                  {
                    label: "地址跳转",
                    value: 1,
                  },
                ],
                value: 0,
                change: ({ value }) => {
                  const thankWordColumn = this.findObject(
                    this.listOption.group,
                    "thankWord"
                  );
                  const directUrlColumn = this.findObject(
                    this.listOption.group,
                    "directUrlAfterFinish"
                  );
                  if (value == 1) {
                    this.$set(thankWordColumn, "display", false);
                    this.$set(directUrlColumn, "display", true);
                  } else if (value === 2) {
                    this.$set(thankWordColumn, "display", false);
                    this.$set(directUrlColumn, "display", false);
                  } else {
                    this.$set(thankWordColumn, "display", true);
                    this.$set(directUrlColumn, "display", false);
                  }
                },
              },
              {
                label: "感谢文字",
                prop: "thankWord",
                display: true,
                value: "您的问卷已经提交，感谢您的参与！",
                maxlength: 200,
                showWordLimit: true,
                rules: [
                  {
                    required: true,
                    message: "请输入感谢文字",
                    trigger: "blur",
                  },
                  ...getRules(["notEnSpecials"]),
                ],
              },
              {
                label: "跳转地址",
                prop: "directUrlAfterFinish",
                display: false,
                maxlength: 200,
                showWordLimit: true,
                rules: [
                  {
                    required: true,
                    message: "请输入跳转地址",
                    trigger: "blur",
                  },
                  ...getRules(["isHttpUrl"]),
                ],
              },
            ],
          },
          // {
          //   label: "参与者限制规则",
          //   prop: "xzgz",
          //   icon: "el-icon-edit-outline",
          //   column: [
          //     {
          //       label: "限制设置",
          //       prop: "limitType",
          //       type: "radio",
          //       dicData: [
          //         {
          //           label: "无限制",
          //           value: 0,
          //         },
          //         {
          //           label: "对IP限制",
          //           value: 1,
          //         },
          //         {
          //           label: "对账号限制",
          //           value: 2,
          //         },
          //       ],
          //       value: 0,
          //       change: ({ value }) => {
          //         const limitDateTypeColumn = this.findObject(
          //           this.listOption.group,
          //           "limitDateType"
          //         );
          //         const repeatePeriodColumn = this.findObject(
          //           this.listOption.group,
          //           "repeatePeriod"
          //         );
          //         const repeateTimeColumn = this.findObject(
          //           this.listOption.group,
          //           "repeateStartEndTime"
          //         );
          //         const maxVotingNumColumn = this.findObject(
          //           this.listOption.group,
          //           "maxVotingNum"
          //         );
          //         if (value == 2) {
          //           this.$set(limitDateTypeColumn, "display", true);
          //         } else if (value == 1) {
          //           this.$set(limitDateTypeColumn, "display", true);
          //         } else {
          //           this.$set(limitDateTypeColumn, "display", false);
          //           this.$set(repeatePeriodColumn, "display", false);
          //           this.$set(repeateTimeColumn, "display", false);
          //           this.$set(maxVotingNumColumn, "display", false);
          //         }
          //       },
          //     },
          //     {
          //       label: "限制方式",
          //       prop: "limitDateType",
          //       type: "radio",
          //       dicData: [
          //         {
          //           label: "仅一次",
          //           value: 0,
          //         },
          //         {
          //           label: "周期",
          //           value: 1,
          //         },
          //         {
          //           label: "时间段",
          //           value: 2,
          //         },
          //       ],
          //       value: 0,
          //       change: ({ value }) => {
          //         const repeatePeriodColumn = this.findObject(
          //           this.listOption.group,
          //           "repeatePeriod"
          //         );
          //         const repeateTimeColumn = this.findObject(
          //           this.listOption.group,
          //           "repeateStartEndTime"
          //         );
          //         const maxVotingNumColumn = this.findObject(
          //           this.listOption.group,
          //           "maxVotingNum"
          //         );
          //         if (value == 2) {
          //           this.$set(repeatePeriodColumn, "display", false);
          //           this.$set(repeateTimeColumn, "display", true);
          //           this.$set(maxVotingNumColumn, "display", true);
          //         } else if (value == 1) {
          //           this.$set(repeatePeriodColumn, "display", true);
          //           this.$set(repeateTimeColumn, "display", false);
          //           this.$set(maxVotingNumColumn, "display", false);
          //         } else {
          //           this.$set(repeatePeriodColumn, "display", false);
          //           this.$set(repeateTimeColumn, "display", false);
          //           this.$set(maxVotingNumColumn, "display", false);
          //         }
          //       },
          //     },
          //     {
          //       label: "重复周期",
          //       prop: "repeatePeriod",
          //       display: true,
          //       type: "number",
          //       formslot: true,
          //     },
          //     {
          //       label: "时间段设置",
          //       prop: "repeateStartEndTime",
          //       type: "timerange",
          //       format: "HH:mm:ss",
          //       valueFormat: "HH:mm:ss",
          //       startPlaceholder: "开始时间",
          //       endPlaceholder: "结束时间",
          //       value: ["00:00:00", "23:59:59"],
          //       display: false,
          //       rules: [
          //         {
          //           required: true,
          //           message: "请设置时间段",
          //           trigger: "blur",
          //         },
          //         {
          //           validator: checkSameVal,
          //           trigger: "blur",
          //         },
          //       ],
          //     },

          //     {
          //       label: "开始时间",
          //       prop: "repeateStartTime",
          //       display: false,
          //     },
          //     {
          //       label: "结束时间",
          //       prop: "repeateEndTime",
          //       display: false,
          //     },
          //     {
          //       label: "每天最多提交次数",
          //       prop: "maxVotingNum",
          //       display: false,
          //       type: "number",
          //       controlsPosition: "",
          //       precision: 0,
          //       value: 1,
          //       minRows: 1,
          //       maxRows: 99999,
          //     },
          //   ],
          // },
          {
            label: "扩展设置",
            prop: "kzsz",
            icon: "el-icon-edit-outline",
            column: [
              {
                label: "使用系统",
                prop: "systemCode",
                type: "radio",
                dicData: [
                  {
                    label: "AiCOS",
                    value: "aicos",
                  },
                  // {
                  //   label: "AiSite",
                  //   value: "aisite",
                  // },
                ],
                value: "aicos",
                // change: ({ value }) => {
                //   const siteIdColumn = this.findObject(
                //     this.listOption.group,
                //     "siteId"
                //   );
                //   const examTypeColumn = this.findObject(
                //     this.listOption.group,
                //     "questionnaireType"
                //   );
                //   const joinUserTypeColumn = this.findObject(
                //     this.listOption.group,
                //     "joinUserType"
                //   );
                //   const joinUserTypeDic = findNodeByVal(
                //     joinUserTypeColumn.dicData,
                //     "value",
                //     2
                //   );
                //   //console.log(joinUserTypeDic)
                //   //console.log(this.listForm.joinUserType)
                //   const isShowResultColumn = this.findObject(
                //     this.listOption.group,
                //     "isShowResult"
                //   );
                //   const statusColumn = this.findObject(
                //     this.listOption.group,
                //     "status"
                //   );

                //   const extendColumn1 = this.findObject(
                //     this.listOption.group,
                //     "extendColumn1"
                //   );
                //   const extendColumn2 = this.findObject(
                //     this.listOption.group,
                //     "extendColumn2"
                //   );
                //   const extendColumn3 = this.findObject(
                //     this.listOption.group,
                //     "extendColumn3"
                //   );
                //   const extendColumn4 = this.findObject(
                //     this.listOption.group,
                //     "extendColumn4"
                //   );
                //   const extendColumn5 = this.findObject(
                //     this.listOption.group,
                //     "extendColumn5"
                //   );

                //   if (value == "aisite") {
                //     // this.$set(siteIdColumn, 'display', true );
                //     // this.$set(examTypeColumn, 'display', true );
                //     //this.$set(joinUserTypeColumn, 'display', true );
                //     this.$set(joinUserTypeDic, "disabled", false);
                //     this.$set(isShowResultColumn, "display", true);
                //     this.$set(statusColumn, "display", true);

                //     this.$set(extendColumn1, "display", true);
                //     this.$set(extendColumn2, "display", true);
                //     this.$set(extendColumn3, "display", true);
                //     this.$set(extendColumn4, "display", true);
                //     this.$set(extendColumn5, "display", true);
                //   } else {
                //     this.$set(siteIdColumn, "display", false);
                //     this.$set(examTypeColumn, "display", false);

                //     //this.$set(joinUserTypeColumn, 'display', false );
                //     this.$set(joinUserTypeDic, "disabled", true);
                //     if (this.listForm.joinUserType == 2) {
                //       this.$set(this.listForm, "joinUserType", 1);
                //     }

                //     this.$set(isShowResultColumn, "display", false);
                //     this.$set(statusColumn, "display", false);

                //     this.$set(extendColumn1, "display", false);
                //     this.$set(extendColumn2, "display", false);
                //     this.$set(extendColumn3, "display", false);
                //     this.$set(extendColumn4, "display", false);
                //     this.$set(extendColumn5, "display", false);
                //   }
                // },
              },
              {
                label: "从属站点",
                prop: "siteId",
                display: false,
                maxlength: 200,
                showWordLimit: true,
                rules: [
                  {
                    required: true,
                    message: "请输入从属站点",
                    trigger: "blur",
                  },
                  ...getRules(["notEnSpecials"]),
                ],
              },
              {
                label: "调查类型",
                prop: "questionnaireType",
                type: "radio",
                display: false,
                dicData: [
                  {
                    label: "在线调查",
                    value: 0,
                  },
                  /*{
                    label:'民意征集',
                    value: 1,
                  },*/
                ],
                value: 0,
              },
              {
                label: "问卷状态",
                prop: "status",
                type: "radio",
                display: false,
                dicData: [
                  {
                    label: "启用",
                    value: 1,
                  },
                  {
                    label: "停用",
                    value: 0,
                  },
                ],
                value: 1,
              },
              {
                label: "参与者设置",
                prop: "joinUserType",
                display: true,
                type: "radio",
                dicData: [
                  // {
                  //   label: "匿名",
                  //   value: 1,
                  // },
                  // {
                  //   label: "会员",
                  //   value: 2,
                  //   disabled: true,
                  // },
                  {
                    label: "所有后台用户",
                    value: 3,
                  },
                  {
                    label: "按用户部门选择",
                    value: 4,
                  },
                ],
                value: 3,
                change: ({ value }) => {
                  const joinUserJsonColumn = this.findObject(
                    this.listOption.group,
                    "joinUserJson"
                  );
                  if (value == 4) {
                    this.$set(joinUserJsonColumn, "display", true);
                  } else {
                    this.$set(joinUserJsonColumn, "display", false);
                  }
                },
              },
              {
                label: "参与者",
                prop: "joinUserJson",
                display: false,
                value: "",
              },
              {
                label: "前台是否显示问答题结果",
                prop: "isShowResult",
                display: false,
                type: "radio",
                dicData: [
                  {
                    label: "启用",
                    value: 1,
                  },
                  {
                    label: "停用",
                    value: 0,
                  },
                ],
                value: 1,
              },

              // {
              //   label: "扩展字段1",
              //   prop: "extendColumn1",
              //   display: false,
              //   maxlength: 200,
              //   showWordLimit: true,
              //   rules: [...getRules(["notEnSpecials"])],
              // },
              // {
              //   label: "扩展字段2",
              //   prop: "extendColumn2",
              //   display: false,
              //   maxlength: 200,
              //   showWordLimit: true,
              //   rules: [...getRules(["notEnSpecials"])],
              // },
              // {
              //   label: "扩展字段3",
              //   prop: "extendColumn3",
              //   display: false,
              //   maxlength: 200,
              //   showWordLimit: true,
              //   rules: [...getRules(["notEnSpecials"])],
              // },
              // {
              //   label: "扩展字段4",
              //   prop: "extendColumn4",
              //   display: false,
              //   maxlength: 200,
              //   showWordLimit: true,
              //   rules: [...getRules(["notEnSpecials"])],
              // },
              // {
              //   label: "扩展字段5",
              //   prop: "extendColumn5",
              //   display: false,
              //   maxlength: 200,
              //   showWordLimit: true,
              //   rules: [...getRules(["notEnSpecials"])],
              // },

              {
                label: "备注",
                prop: "remark",
                type: "textarea",
                maxlength: 500,
                showWordLimit: true,
                row: 3,
              },
            ],
          },
        ],
      },

      examDesignRow: {},
      examDesignOption: {},
      examDesignTag: false,
      examDesignKey: 0,

      bankData: [],
      /*bankPage: {
        "pageSize": 10,
        "currentPage": 1,
        "total": 0,
        "pageSizes": [ 10, 20, 30, 40, 50, 100 ]
      },*/
    };
  },
  methods: {
    examSearchChange() {
      this.manualOperationOnLoad();
    },
    selectExamRow(row) {
      this.examRow = row;
      this.ruleForm = {
        passScore: row.passScore,
        isPassScore: row.passScore > 0 ? -1 : 0,
        questionnaireId: row.questionnaireId,
        questionnaireName: row.questionnaireName,
        totalScore: row.totalScore,
        subjectNum: row.subjectNum,
      };
      this.selectExamDialog = true;
    },
    saveExamSelect(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.ruleForm.passScore =
            this.ruleForm.isPassScore === 0 ? 0 : this.ruleForm.passScore;
          let form = {
            ...this.examRow,
            ...this.ruleForm,
          };
          if (this.ruleForm.passScore > this.ruleForm.totalScore) {
            this.$message.error('及格分数不能大于总分数');
            return false
          }
          updateExamList(form).then(
            () => {
              this.refreshChange();
              this.$message({
                type: "success",
                message: "操作成功",
              });
              this.selectExamDialog = false;
            },
            (error) => {
              window.console.log(error);
            }
          );
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    examBankClick() {
      this.examSearchForm = {};
      this.selectRow = {};
      this.examBankDialog = true;
      getTreeData().then((res) => {
        const dataRes = res.data.data;
        this.treeData[0].children = dataRes || [];
        this.treeNodeCurrent();
        // this.treeKey++;
      });
      this.manualOperationOnLoad();
    },
    treeNodeCurrent() {
      if (!isNull(this.treeCurrentNode)) {
        const ancestors = this.treeCurrentNode.ancestors || "0";
        this.treeOption.defaultExpandedKeys = ancestors.split(",");
        this.$nextTick(() => {
          this.$refs.treeRef.setCurrentKey(this.treeCurrentNode.id);
        });
      }
    },
    treeNodeClick(data) {
      this.treeCurrentNode = { ...data };
      this.manualOperationOnLoad();
    },
    manualOperationOnLoad() {
      this.manualOperationLoading = true;

      const dataParam = {
        ...this.examSearchForm,
        current: 1,
        size: 10000,
        categoryId: this.validatenull(this.treeCurrentNode.id)
          ? "0"
          : this.treeCurrentNode.id,
      };

      listBoundPage(dataParam).then((res) => {
        const dataRes = res.data.data;
        // this.page.total = dataRes.total;
        // this.page.pageSize = dataRes.size;
        // this.page.currentPage = dataRes.current;
        this.manualOperationData = dataRes.records;
        this.manualOperationLoading = false;
        // this.selectionClear();
      });
    },
    saveExamBankSelect() {
      this.ruleForm.questionnaireId = this.selectRow.id;
      this.ruleForm.questionnaireName = this.selectRow.name;
      this.ruleForm.totalScore = this.selectRow.totalScore;
      this.ruleForm.subjectNum = this.selectRow.subjectNum;
      this.ruleForm.editorFrontJson = this.selectRow.editorFrontJson;
      this.ruleForm.ifOptionRandomType = this.selectRow.optionsOutOfOrder
        ? 1
        : 0;
      this.ruleForm.ifSubjectRandomType = this.selectRow.topicOutOfOrder
        ? 1
        : 0;
      this.ruleForm.randomQuestionnaire = this.selectRow.examRandomStatus;
      this.examBankDialog = false;
    },
    examSelectClose() {
      this.ruleForm = {
        questionnaireId: "",
        questionnaireName: "",
        passScore: 0,
        totalScore: 0,
        subjectNum: 0,
        // editorFrontJson: "",
      };
      this.selectExamDialog = false;
    },
    domIsNull(data) {
      return isNull(data);
    },
    configColumn() {
      this.$refs.listRef.$refs.dialogColumn.columnBox = true;
    },
    changeAnswerTime(val) {
      if (val === -1) {
        this.listForm.answerDuration = 0;
      }
    },
    changeMinAnswerTime(val) {
      if (val === -1) {
        this.listForm.minAnswerDuration = 0;
      }
    },
    changeLimitNum(val) {
      if (val === -1) {
        this.listForm.limitNum = 0;
      }
    },
    addRow(/*row, index*/) {
      this.$refs.listRef.rowAdd();
    },
    updateRow(row, index) {
      this.$refs.listRef.rowEdit(row, index);
    },
    deleteRow(row /*, index*/) {
      this.$confirm("确定将选择数据删除?", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          return delExamList({ id: row.id });
        })
        .then(() => {
          this.$message({
            type: "success",
            message: "操作成功",
          });
          this.refreshChange();
        });
    },

    rowSave(row, done, loading) {
      // console.log(row);
      if (row.answerDuration !== 0 && row.minAnswerDuration !== 0) {
        if (row.answerDuration < row.minAnswerDuration) {
          this.$message.error("最短答题时长不得大于答题时长！");
          loading();
          return false;
        }
      }
      let tempUserArr = row.joinUserJson.user || [];
      let tempUser = [];
      tempUserArr.map((item) => {
        tempUser.push(item.account);
      });

      row.accountIds = tempUser.join(",");

      let tempDeptArr = row.joinUserJson.dept || [];
      let tempDept = [];
      tempDeptArr.map((item) => {
        tempDept.push(item.id);
      });

      row.deptIds = tempDept.join(",");

      row.deptJson = JSON.stringify(row.joinUserJson);

      row.siteId = "-1";
      row.questionnaireType = 0;
      row.answerDuration = row.isAnswerDuration === 0 ? 0 : row.answerDuration;
      row.minAnswerDuration =
        row.isMinAnswerDuration === 0 ? 0 : row.minAnswerDuration;
      // row.limitNum = row.isLimitNum === 0 ? 0 : row.limitNum;
      const dataParam = {
        ...row,
        // editorFrontJson: JSON.stringify(defaultFrontJson),
      };
      addExamList(dataParam).then(
        () => {
          //this.refreshChange();
          this.$message({
            type: "success",
            message: "操作成功",
          });
          done();
        },
        (error) => {
          window.console.log(error);
          loading();
        }
      );
    },
    async rowUpdate(row, index, done, loading) {
      if (row.answerDuration !== 0 && row.minAnswerDuration !== 0) {
        if (row.answerDuration < row.minAnswerDuration) {
          this.$message.error("最短答题时长不得大于答题时长！");
          loading();
          return false;
        }
      }
      let tempUserArr = row.joinUserJson.user || [];
      let tempUser = [];
      tempUserArr.map((item) => {
        tempUser.push(item.account);
      });

      row.accountIds = tempUser.join(",");

      let tempDeptArr = row.joinUserJson.dept || [];
      let tempDept = [];
      tempDeptArr.map((item) => {
        tempDept.push(item.id);
      });

      row.deptIds = tempDept.join(",");

      row.deptJson = JSON.stringify(row.joinUserJson);
      row.answerDuration = row.isAnswerDuration === 0 ? 0 : row.answerDuration;
      row.minAnswerDuration =
        row.isMinAnswerDuration === 0 ? 0 : row.minAnswerDuration;
      // row.limitNum = row.isLimitNum === 0 ? 0 : row.limitNum;

      const dataParam = {
        ...row,
      };
      // console.log(dataParam);
      await updateExamList(dataParam).then(
        () => {
          //this.refreshChange();
          this.$message({
            type: "success",
            message: "操作成功",
          });
          done();
        },
        (error) => {
          window.console.log(error);
          loading();
        }
      );
    },
    searchReset() {
      this.query = {};
      this.searchForm = {};
      this.onLoad(this.page);
    },
    searchChange(params, done) {
      this.query = {
        ...params,
      };
      this.query.keyWords = params.testName;
      this.searchForm = this.query;
      this.page.currentPage = 1;
      this.onLoad(this.page, params);
      done();
    },

    selectionChange(list) {
      this.selectionList = list;
    },

    selectionClear() {
      this.selectionList = [];
      this.$refs.listRef.toggleSelection();
    },

    beforeOpen(done, type) {
      if (["add", "edit", "view"].includes(type)) {
        this.initData(type);
        if (type === "add") {
          this.listForm.isAnswerDuration = 0;
          this.listForm.isLimitNum = 0;
          this.listForm.isMinAnswerDuration = 0;
          this.listForm.answerDuration = 0;
          this.listForm.limitNum = 1;
          this.listForm.minAnswerDuration = 0;
        }
        this.editTempData = this.deepClone(this.listForm);
      }
      done();
    },
    beforeClose(done /*, type*/) {
      this.refreshChange();
      done();
    },

    currentChange(currentPage) {
      this.page.currentPage = currentPage;
    },

    sizeChange(pageSize) {
      this.page.pageSize = pageSize;
    },

    refreshChange() {
      this.onLoad(this.page, this.query);
    },

    initData(type) {
      if (type == "view" || type == "edit") {
        this.type = type;
      }
    },

    onLoad(page, params = {}) {
      this.loading = true;

      const dataParam = {
        ...params,
        ...this.query,
        //...this.activeType,
        current: page.currentPage,
        size: page.pageSize,
      };

      getExamList(dataParam).then((res) => {
        const dataRes = res.data.data;
        this.page.total = dataRes.total;
        this.page.pageSize = dataRes.size;
        this.page.currentPage = dataRes.current;
        this.listData = dataRes.records.map((item) => {
          item.startEndTime = [item.startTime, item.endTime];
          item.isAnswerDuration = item.answerDuration > 0 ? -1 : 0;
          item.isMinAnswerDuration = item.minAnswerDuration > 0 ? -1 : 0;
          // item.isLimitNum = item.limitNum > 0 ? -1 : 0;
          if (item.limitDateType == 2) {
            item.repeateStartEndTime = [
              item.repeateStartTime,
              item.repeateEndTime,
            ];
          }
          item.joinUserJson = !isNull(item.deptJson)
            ? JSON.parse(item.deptJson)
            : {};

          return item;
        });
        this.loading = false;
        this.selectionClear();
      });
    },

    pubulicRow(row, toStatus) {
      if (this.validatenull(row.questionnaireId)) {
        this.$message.error("请选择试卷");
        return false;
      }
      //const nowTime = dateFormat(Date.now());

      const dataParam = {
        id: row.id,
        publishStatus: toStatus,
        // autoPublish: false,
        //startTime: ( (row.isAutoPublic == 1 && toStatus == 1)? nowTime : row.startTime ),
        //endTime: ( (row.isAutoPublic == 1 && toStatus == 0)? nowTime : row.endTime ),
      };
      publishExamList(dataParam).then(
        () => {
          this.$message({
            type: "success",
            message: "操作成功",
          });
          this.refreshChange();
        },
        (error) => {
          window.console.log(error);
        }
      );
    },
    // enableRow(row, toStatus) {
    //   const dataParam = {
    //     id: row.id,
    //     status: toStatus,
    //   };
    //   enableExamList(dataParam).then(
    //     () => {
    //       this.$message({
    //         type: "success",
    //         message: "操作成功",
    //       });
    //       this.refreshChange();
    //     },
    //     (error) => {
    //       window.console.log(error);
    //     }
    //   );
    // },

    copyRow(row) {
      row.id = "";
      row.testName = row.testName + "_复制";
      addExamList(row).then(
        () => {
          this.$message({
            type: "success",
            message: "操作成功",
          });
          this.onLoad(this.page, this.query);
        },
        (error) => {
          window.console.log(error);
        }
      );
    },

    designRow(row /*,index*/) {
      if (row.publishStatus == 1) {
        this.$confirm(
          "当前的问卷可能正在使用中，修改题目可能会导致正在提交的数据和已经提交的数据发生错误，确定要进入问卷设计界面？",
          {
            confirmButtonText: "确定",
            cancelButtonText: "取消",
            type: "warning",
          }
        ).then(() => {
          this.examDesignKey++;
          this.examDesignRow = row;
          this.examDesignOption = row.editorFrontJson;
          this.examDesignTag = true;
        });
      } else {
        this.examDesignKey++;
        this.examDesignRow = row;
        this.examDesignOption = isNull(row.editorFrontJson)
          ? "{column:[]}"
          : row.editorFrontJson;
        this.examDesignTag = true;
      }
    },

    examDesignClose() {
      this.examDesignKey++;
      this.examDesignRow = {};
      this.examDesignOption = {};
      this.examDesignTag = false;
    },
    async examDesignSave(saveType) {
      const designData = await this.$refs.examDesignRef.getData();

      const columnNum = designData.column.length;

      if (columnNum < 3) {
        this.$message.error("题目设计不能为空。");
        return false;
      }

      const newNameColumn = this.findObject(designData.column, "examTitle");
      //console.log(newNameColumn);
      let newName = "";
      if (!isNull(newNameColumn) && newNameColumn != -1) {
        newName = getHtmlPlainText(newNameColumn.label).substring(0, 100);
      }

      const dataParam = {
        id: this.examDesignRow.id,
        editorFrontJson: JSON.stringify(designData),
        subjectNum: columnNum,
      };
      if (!isNull(newName)) {
        dataParam.questionnaireName = newName;
      }

      if (saveType == "publish") {
        dataParam.publishStatus = 1;
      }

      await updateExamList(dataParam).then(
        () => {
          this.$message({
            type: "success",
            message: "操作成功",
          });
          this.examDesignTag = false;
          this.refreshChange();
        },
        (error) => {
          window.console.log(error);
        }
      );
    },

    openWinDowByRow(row, winUrl, menuPath) {
      if (this.desktop) {
        const menuAll = this.$store.state.user.menuAll;

        let menuData = {};

        let winCode = "ExamWin";
        if (winUrl == "/exam/examDataAdd") {
          winCode = "ExamWinDataAdd";
          menuData = findNodeByVal(
            menuAll,
            "code",
            "exam-examDataAdd",
            "menuList"
          );
        } else if (winUrl == "/exam/statistic") {
          winCode = "ExamWinStatistic";
          menuData = findNodeByVal(
            menuAll,
            "code",
            "exam-statistic",
            "menuList"
          );
        }

        //console.log(menuData)

        const formWinParm = {
          ...menuData,
          menuName: "考试名称 【 " + row.testName + " 】",
          //imageUrl: 'menu-icon-img resource-center',
          //linkUrl: winUrl,
          query: {
            examId: row.id,
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
          path: menuPath,
          query: {
            examId: row.id,
          },
        });
      }
    },
    viewRow(row /*,index*/) {
      window.open(
        `${baseURL}#/exam/examDataAdd?examId=` + row.id + `&type=view`
      );
    },

    copyPitchInUrl(row) {
      let pitchInUrl =
        window.origin + `${baseURL}#/exam/examDataAdd?examId=` + row.id;
      this.$Clipboard({
        text: pitchInUrl,
      })
        .then(() => {
          this.$message.success("复制成功");
        })
        .catch(() => {
          this.$message.error("复制失败");
        });
    },

    statisticRow(row) {
      this.openWinDowByRow(row, "/exam/statistic", "./statistic");
    },

    // getBankList(params) {
    //   this.$refs.examDesignRef.tagBankLoading(true);
    //   const dataParam = {
    //     ...params,
    //     //"current": this.bankPage.currentPage,
    //     //"size": this.bankPage.pageSize
    //   };
    //   getBankList(dataParam).then((res) => {
    //     const dataRes = res.data.data;

    //     const tempRes = dataRes.records.map((item) => {
    //       //导入的数据 editorFrontJson 可能为空 需要先转换一下
    //       if (isNull(item.editorFrontJson)) {
    //         item.editorFrontJson = makeFrontJsonByBackJson(item.editorBackJson);
    //       }
    //       return item;
    //     });
    //     this.bankData = {
    //       ...dataRes,
    //       records: tempRes,
    //     };

    //     this.$refs.examDesignRef.tagBankLoading(false);
    //   });
    // },

    initFormItemBySystem() {
      const siteIdColumn = this.findObject(this.listOption.group, "siteId");
      const examTypeColumn = this.findObject(
        this.listOption.group,
        "questionnaireType"
      );
      const joinUserTypeColumn = this.findObject(
        this.listOption.group,
        "joinUserType"
      );
      const isShowResultColumn = this.findObject(
        this.listOption.group,
        "isShowResult"
      );
      if (baseURL.includes("aicos")) {
        this.$set(siteIdColumn, "display", true);
        this.$set(examTypeColumn, "display", true);
        this.$set(joinUserTypeColumn, "display", true);
        this.$set(isShowResultColumn, "display", true);
      } else {
        this.$set(siteIdColumn, "display", false);
        this.$set(examTypeColumn, "display", false);
        this.$set(joinUserTypeColumn, "display", false);
        this.$set(isShowResultColumn, "display", false);
      }
    },

    // addTobankFromDesign(bankType, dataParam) {
    //   //console.log(bankType,dataParam)

    //   let optionItem = [];
    //   if (dataParam.dicData) {
    //     dataParam.dicData.map((item) => {
    //       optionItem.push(getHtmlPlainText(item.label).substring(0, 200));
    //     });
    //   }
    //   let subjectType = 6;

    //   switch (dataParam.typeExam) {
    //     case "radioExam":
    //       subjectType = 1;
    //       break;
    //     case "checkboxExam":
    //       subjectType = 2;
    //       break;
    //     case "selectExam":
    //       subjectType = 3;
    //       break;
    //     case "inputExam":
    //       subjectType = 4;
    //       break;
    //     case "textareaExam":
    //       subjectType = 5;
    //       break;
    //     case "htmlExam":
    //       subjectType = 6;
    //       break;
    //     default:
    //   }

    //   let row = {
    //     bankSubjectName: getHtmlPlainText(dataParam.label).substring(0, 100),
    //     optionItem: optionItem,
    //     subjectType: subjectType,
    //   };

    //   const itemJson = makeApiJsonByDomitem(row);

    //   const params = {
    //     ...row,
    //     optionNum: itemJson.optionNum,
    //     bankSubjectType: bankType,
    //     editorFrontJson: JSON.stringify(itemJson.frontJson),
    //     editorBackJson: JSON.stringify(itemJson.backJson),
    //   };
    //   //console.log(params)

    //   addBankList(params).then(
    //     () => {
    //       this.$message({
    //         type: "success",
    //         message: "操作成功",
    //       });
    //     },
    //     (error) => {
    //       window.console.log(error);
    //     }
    //   );
    // },

    dropdownVisibleChange(e) {
      this.dropdownTag = e;
    },
    dropdownHide() {
      //console.log('this.dropdownHide();');
      this.dropdownTag = false;
    },
  },
  watch: {
    "listForm.startEndTime": {
      handler(val) {
        if (!isNull(val)) {
          this.listForm.startTime = val[0];
          this.listForm.endTime = val[1];
        }
      },
      immediate: true,
    },
    "listForm.repeateStartEndTime": {
      handler(val) {
        if (!isNull(val)) {
          this.listForm.repeateStartTime = val[0];
          this.listForm.repeateEndTime = val[1];
        }
      },
      immediate: true,
    },
  },

  mounted() {
    //this.initFormItemBySystem();
  },
};
</script>
<style lang="scss" scoped>
.repeatePeriod {
  width: 150px;
}
.repeatePeriodTips {
  margin-left: 10px;
  .link {
    margin-left: 10px;
  }
}

.pitchIn {
  display: flex;
  align-items: center;
  justify-self: start;
  width: 100%;
  .copyUrl {
    display: inline-block;
    width: 100%;
    overflow: hidden;
    text-overflow: ellipsis;
    cursor: pointer;
  }
  .copyBtn {
    width: 16px;
    margin-left: 8px;
    flex-shrink: 0;
  }
}
</style>

<style scoped lang="scss">
.examDesign-dialog {
  /deep/.el-dialog {
    position: relative;
  }
  /deep/ .el-dialog__body {
    height: calc(100% - 60px);
    padding: 0;
  }
  /deep/ .el-dialog__footer {
    position: absolute;
    top: 0px;
    right: 10px;
    background-color: #fff;
    padding: 12px 30px 10px;
  }
  // /deep/ .el-dialog__footer .el-button {
  // }
}
</style>
