<template>
  <div class="qusnList qsgMain">
    <HuilanBasicToolbar>
      <el-button
        type="primary"
        size="small"
        @click.stop="addRow"
        v-if="permissionList.addBtn"
        >新增</el-button>
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
        <el-button type="default" @click="configColumn"><i class="el-icon-s-operation"></i></el-button>
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
          @click.stop="updateRow(scope.row, scope.index)"
          >编辑
        </el-button>
        <el-button
          type="text"
          size="small"
          v-if="permissionList.designBtn"
          @click.stop="designRow(scope.row, scope.index)"
          >设计
        </el-button>

        <el-button
          type="text"
          size="small"
          v-if="( permissionList.publishBtn &&  scope.row.publishStatus == 0  )"
          :disabled="( scope.row.subjectNum < 1 )"
          @click.stop="pubulicRow(scope.row, 1)"
          >发布
        </el-button>
        <el-button
          type="text"
          size="small"
          v-if="( permissionList.publishBtn &&  scope.row.publishStatus == 1  )"

          @click.stop="pubulicRow(scope.row, 0)"
          >撤回
        </el-button>
        <!-- :disabled="( scope.row.isAutoPublic == 1 )" -->
        <el-button
          type="text"
          size="small"
          v-if="( permissionList.useBtn )"
          :disabled="( scope.row.publishStatus == 0 ||  scope.row.subjectNum < 1  )"
          @click.stop="useRow(scope.row, scope.index)"
          >参与
        </el-button>

        <el-dropdown
          class="qsg-more-actions"
          @visible-change="dropdownVisibleChange"
        >
          <span class="qsg-dropdown-link">
            更多<i class="el-icon-arrow-down el-icon--right"></i>
          </span>
          <el-dropdown-menu ref="dropdownRef"  class="qsg-dropdown-btns" slot="dropdown">
            <div class="qsg-dropdown-btns-cum"  v-show="dropdownTag">

              <div class="el-dropdown-menu__item">
                <el-button
                  type="text"
                  size="small"
                  v-if="( permissionList.enableBtn &&  scope.row.status == 0 &&  scope.row.systemCode == 'aisite' )"
                  @click.stop="(e)=>{ dropdownHide();  enableRow(scope.row, 1) }"
                  >启用
                </el-button>
              </div>
              <div class="el-dropdown-menu__item">
                <el-button
                  type="text"
                  size="small"
                  v-if="( permissionList.enableBtn &&  scope.row.status == 1 &&  scope.row.systemCode == 'aisite' )"
                  @click.stop="(e)=>{ dropdownHide(); enableRow(scope.row, 0) }"
                  >停用
                </el-button>
              </div>
              <div class="el-dropdown-menu__item">
                <el-button
                  type="text"
                  size="small"
                  v-if="( permissionList.statisticBtn )"
                  :disabled="( scope.row.subjectNum < 1 || scope.row.submitNum < 1)"
                  @click.native="(e)=>{ dropdownHide(); statisticRow(scope.row, scope.index) }"
                  >分析
                </el-button>
              </div>
              <div class="el-dropdown-menu__item">

                <el-button
                  type="text"
                  size="small"
                  v-if="( permissionList.copyBtn && scope.row.subjectNum > 0)"
                  @click.stop="(e)=>{ dropdownHide(); copyRow(scope.row, scope.index) }"
                  >复制
                </el-button>
              </div>
              <div class="el-dropdown-menu__item">

                <el-button
                  type="text"
                  size="small"
                  v-if="( permissionList.deleteBtn && scope.row.publishStatus == 0 && scope.row.submitNum == 0)"

                  @click.stop="(e)=>{ dropdownHide(); deleteRow(scope.row, scope.index) }"
                  >删除
                </el-button>
              </div>



            </div>
          </el-dropdown-menu>
        </el-dropdown>

      </template>
      <template slot="pitchIn" slot-scope="scope" >
        <div class="pitchIn" v-if="scope.row.publishStatus == 1 && scope.row.subjectNum > 0">
          <span
            class="copyUrl"
            @dblclick="copyPitchInUrl( scope.row )">
            {{ winUrl }}/aicos/#/questionnaire/qusnDataAdd?qusnId={{ scope.row.id }}
          </span>
          <el-button
            class="copyBtn"
            type="text"
            icon="el-icon-copy-document"
            @click.stop="copyPitchInUrl( scope.row )">
          </el-button>
        </div>
        <div v-else>
          --
        </div>
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
            <el-link type="warning" :underline="false" class="link">(0代表不限制)</el-link>
          </el-link>
        </div>
      </template>

      <template slot-scope="scope" slot="questionnaireNameLabel">
        <span>问卷名称</span>
        <el-tooltip effect="dark" content="修改问卷名称，会重置设计界面标题设置。" placement="top-start" v-if="scope.type == 'edit'">
          <i class="el-icon-warning" style="color: #f05050; margin-left: 3px;"></i>
        </el-tooltip>
      </template>

      <template slot-scope="scope" slot="joinUserJsonForm">
        <div>
          <OptOrgCommon
            v-model="listForm.joinUserJson"
            title="选择参与者"
            :tabs="['user','dept']"
            :dataView="OptOrgDataView"
          ></OptOrgCommon>
        </div>
      </template>

    </avue-crud>

    <HuilanDialog title="设计"
      :fullscreen="true"
      width="960px"
      append-to-body
      :visible.sync="qusnDesignTag"
      class="qusnDesign-dialog"
      >
      <avue-questionnaire-design
        ref="qusnDesignRef"
        :key="qusnDesignKey"
        :options="qusnDesignOption"
        @getBankList="getBankList"
        @addtobank="addTobankFromDesign"
        :bankData="bankData"
        >
      </avue-questionnaire-design>

      <template v-slot:footer>
        <el-button
          v-if="( (qusnDesignRow.isAutoPublic == 1 && qusnDesignRow.publishStatus== 0 ) || (qusnDesignRow.isAutoPublic == 0 && qusnDesignRow.publishStatus== 0 ) )"
          icon="el-icon-check"
          size="small" type="primary"
          @click.stop="qusnDesignSave('design')"
          >保存设计
        </el-button>
        <el-button
          v-if="( !(qusnDesignRow.isAutoPublic == 1 && qusnDesignRow.publishStatus== 0 ) )"
          icon="el-icon-check"
          size="small"
          type="primary"
          @click.stop="qusnDesignSave('publish')"
          >立即发布</el-button>
        <el-button icon="el-icon-close" size="small" @click="qusnDesignClose">关闭</el-button>
      </template>
    </HuilanDialog>

  </div>
</template>
<script>
import '@/styles/qsgCommon.scss';

import {mapGetters} from "vuex";
import { baseURL } from '@/api/common';
import { getRules } from "@/util/regx";

import QSGSearchBar from '@/components/QSGSearchBar/index';
import QusnView from '@/components/QusnView/index';

import { isNull, checkSameVal, getHtmlPlainText, findNodeByVal } from '@/util/qsgCommon.js';
import { dateFormat } from '@/util/date.js';

import { makeApiJsonByDomitem, makeFrontJsonByBackJson } from './qusnPublic.js';


import OptOrgCommon from "@/views/optOrg/OptOrgCommon";

import {
  getQusnList,
  addQusnList,
  updateQusnList,
  delQusnList,
  getBankList,
  publishQusnList,
  enableQusnList,
  copyQusnList,
  addBankList,
} from "@/api/questionnaire/index";

export default {

  inject: ["desktopWindow", "desktop"],

  name: 'QusnList',
  components: {
    QSGSearchBar,
    QusnView,
    OptOrgCommon,
  },
  computed: {
    ...mapGetters(["permission", "userInfo"]),
    permissionList() {
      return {
        addBtn: this.vaildData(this.permission[`qusn-add`], false),
        updateBtn: this.vaildData(this.permission[`qusn-update`], false),
        designBtn: this.vaildData(this.permission[`qusn-design`], false),
        useBtn: this.vaildData(this.permission[`qusn-use`], false),
        statisticBtn: this.vaildData(this.permission[`qusn-statistics`], false),
        deleteBtn: this.vaildData(this.permission[`qusn-delete`], false),
        publishBtn: this.vaildData(this.permission[`qusn-publish`], false),
        copyBtn: this.vaildData(this.permission[`qusn-copy`], false),
        enableBtn: this.vaildData(this.permission[`qusn-enableStatus`], false),

      }
    },
  },
  data() {
    return {
      OptOrgDataView: false,

      winUrl: window.origin,
      dropdownTag: false,

      editTempData: {},

      searchForm:{},
      loading: true,
      page: {
        "pageSize": 10,
        "currentPage": 1,
        "total": 0,
        "pageSizes": [ 10, 20, 30, 40, 50, 100 ]
      },

      listForm: {
        repeatePeriod: 5,
      },
      selectionList: [],
      query: {},
      listData:[],
      listOption: {
        header: false,
        tip: false,
        searchShow: false,
        border: false,
        index: true,
        selection: true,
        viewBtn: false,
        delBtn:false,
        editBtn: false,
        columnBtn: true,

        menuWidth: 300,
        dialogWidth: "40%",
        dialogType: 'drawer',
        dialogClickModal: false,
        dialogCustomClass: 'huilan-drawer-form',

        span: 24,
        labelWidth: 100,
        column: [
          {
            label: 'ID',
            prop: 'id',
            hide: true,
            disabled: true,
            display: false,
          },
          {
            label: '问卷名称',
            prop: 'questionnaireName',
            overHidden: true,
            search: true,
            display: false,
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
            label: '定时发布',
            prop: 'isAutoPublic',
            display: false,
            type: 'radio',
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
            width: 100,
          },

          {
            label: '发布状态',
            prop: 'publishStatus',
            display: false,
            search: true,
            searchType: 'select',
            dicData: [

              {
                label:'未发布',
                value: 0,
              },
              {
                label:'已发布',
                value: 1,
              },
              /*{
                label:'已撤回',
                value: 2,
              },*/
            ],
            align: 'center',
            width: 100,
          },
          {
            label: '开启审核',
            prop: 'isAudit',
            display: false,
            search: true,
            searchType: 'select',
            type: 'radio',
            dicData: [
              {
                label:'开启',
                value: 1,
              },
              {
                label:'不开启',
                value: 0,
              }
            ],
            value: 1,
            align: 'center',
            width: 100,
          },
          {
            label: '限制设置',
            prop: 'limitType',
            type: 'radio',
            hide: true,
            display: false,
            search: false,
            searchType: 'select',
            dicData: [
              {
                label:'无限制',
                value: 0,
              },
              {
                label:'对IP限制',
                value: 1,
              },
              {
                label:'对账号限制',
                value: 2,
              },
            ],
            align: 'center',
            width: 100,
          },

          /*{
            label: 'editorFrontJson',
            prop: 'editorFrontJson',
            hide: true,
            display: false,
          },*/
          {
            label: '参与次数',
            prop: 'submitNum',
            display: false,
            align: 'center',
            width: 100,
          },

          {
            label: '作者',
            prop: 'createrRealName',
            overHidden: true,
            display: false,
            align: 'center',
            width: 120,
          },
          {
            label: '调用地址',
            prop: 'pitchIn',
            display: false,
            overHidden: true,
            align: 'center',
            width: 200,
          },

          {
            label: '创建时间',
            prop: 'createTime',
            display: false,
            align: 'center',
            width: 160,
          },
          {
            label: '使用系统',
            prop: 'systemCode',
            hide: true,
            display: false,
            align: 'center',
            width: 100,
            type: 'radio',
            dicData: [
              {
                label: 'AiCOS',
                value: 'aicos',
              },
              {
                label: 'AiSite',
                value: 'aisite',
              },
            ],
            value: 'aicos',
          },
          {
            label: '从属站点',
            prop: 'siteId',
            hide: true,
            display: false,
            align: 'center',
            width: 100,
          },
          {
            label: '问卷状态',
            prop: 'status',
            hide: true,
            display: false,
            align: 'center',
            width: 100,
            type: 'radio',
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
            value: 1,
          },


        ],

        group: [
          {
            label: '基本信息',
            prop: 'jbxx',
            icon: 'el-icon-edit-outline',
            column: [
              {
                label: 'ID',
                prop: 'id',
                //hide: true,
                //disabled: true,
                display: false,
              },
              {
                label: '问卷名称',
                prop: 'questionnaireName',
                maxlength: 100,
                //editDisabled: true,
                showWordLimit: true,
                rules: [
                  {
                    required: true,
                    message: "请输入问卷名称",
                    trigger: "blur"
                  },
                  ...getRules(['notEnSpecials'])
                ],
              },

              {
                label: '自动上下线',
                prop: 'isAutoPublic',
                type: 'radio',
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
                value: 0,
                change:({value})=>{
                  const startEndTimeColumn = this.findObject(this.listOption.group, "startEndTime");
                  if(value == 1 ){
                    this.$set(startEndTimeColumn,'disabled', false);

                  }else{
                    this.$set(startEndTimeColumn,'disabled', true);
                  }
                },
              },
              {
                label: '上下线时间',
                prop: 'startEndTime',
                type: 'datetimerange',
                format:'yyyy-MM-dd HH:mm:ss',
                valueFormat:'yyyy-MM-dd HH:mm:ss',
                startPlaceholder: '上线时间',
                endPlaceholder: '下线时间',
                //display: false,
                disabled: true,
                rules: [
                  {
                    required: true,
                    message: "请设置上下线时间",
                    trigger: "blur"
                  },
                  {
                    validator: checkSameVal,
                    trigger: 'blur'
                  }
                ],
                value: [ dateFormat(new Date()), dateFormat(new Date('2099-12-31 23:59:59'))],
              },
              {
                label: '上线时间',
                prop: 'startTime',
                display: false,
              },
              {
                label: '下线时间',
                prop: 'endTime',
                display: false,
              },
              {
                label: '验证码',
                prop: 'isCaptcha',
                type: 'radio',
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
                value: 0,
              },
              /*{
                label: '问卷状态',
                prop: 'status',
                //display: false,
                type: 'radio',
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
                value: 1,
              },
*/
              {
                label: '开启审核',
                prop: 'isAudit',
                search: true,
                searchType: 'select',
                type: 'radio',
                dicData: [
                  {
                    label:'开启',
                    value: 1,
                  },
                  {
                    label:'不开启',
                    value: 0,
                  }
                ],
                value: 1,
              },


              {
                label: '跳转设置',
                prop: 'isDirectAfterFinish',
                type: 'radio',
                dicData: [
                  {
                    label:'显示感谢信',
                    value: 0,
                  },
                  {
                    label:'地址跳转',
                    value: 1,
                  },

                ],
                value: 0,
                change:({value})=>{
                  const thankWordColumn = this.findObject(this.listOption.group, "thankWord");
                  const directUrlColumn = this.findObject(this.listOption.group, "directUrlAfterFinish");
                  if(value == 1 ){
                    this.$set(thankWordColumn,'display', false);
                    this.$set(directUrlColumn,'display', true );
                  }else{
                    this.$set(thankWordColumn,'display', true);
                    this.$set(directUrlColumn,'display', false );
                  }
                },
              },
              {
                label: '感谢信',
                prop: 'thankWord',
                display: true,
                value: '您的问卷已经提交，感谢您的参与！',
                maxlength: 200,
                showWordLimit: true,
                rules: [
                  {
                    required: true,
                    message: "请输入感谢信",
                    trigger: "blur"
                  },
                  ...getRules(['notEnSpecials'])
                ],
              },
              {
                label: '跳转地址',
                prop: 'directUrlAfterFinish',
                display: false,
                maxlength: 200,
                showWordLimit: true,
                rules: [
                  {
                    required: true,
                    message: "请输入跳转地址",
                    trigger: "blur"
                  },
                  ...getRules(['isHttpUrl'])
                ],
              },

            ],
          },
          {
            label: '参与者限制规则',
            prop: 'xzgz',
            icon: 'el-icon-edit-outline',
            column: [
              {
                label: '限制设置',
                prop: 'limitType',
                type: 'radio',
                dicData: [
                  {
                    label:'无限制',
                    value: 0,
                  },
                  {
                    label:'对IP限制',
                    value: 1,
                  },
                  {
                    label:'对账号限制',
                    value: 2,
                  },
                ],
                value: 0,
                change:({value})=>{
                  const limitDateTypeColumn = this.findObject(this.listOption.group, "limitDateType");
                  const repeatePeriodColumn = this.findObject(this.listOption.group, "repeatePeriod");
                  const repeateTimeColumn = this.findObject(this.listOption.group, "repeateStartEndTime");
                  const maxVotingNumColumn = this.findObject(this.listOption.group, "maxVotingNum");
                  if(value == 2 ){
                    this.$set(limitDateTypeColumn, 'display', true );
                  }else if(value == 1 ){
                    this.$set(limitDateTypeColumn, 'display', true );
                  }else{
                    this.$set(limitDateTypeColumn, 'display', false );
                    this.$set(repeatePeriodColumn, 'display', false );
                    this.$set(repeateTimeColumn, 'display', false );
                    this.$set(maxVotingNumColumn, 'display', false );
                  }
                },
              },
              {
                label: '限制方式',
                prop: 'limitDateType',
                type: 'radio',
                dicData: [
                  {
                    label:'仅一次',
                    value: 0,
                  },
                  {
                    label:'周期',
                    value: 1,
                  },
                  {
                    label:'时间段',
                    value: 2,
                  },

                ],
                value: 0,
                change:({value})=>{
                  const repeatePeriodColumn = this.findObject(this.listOption.group, "repeatePeriod");
                  const repeateTimeColumn = this.findObject(this.listOption.group, "repeateStartEndTime");
                  const maxVotingNumColumn = this.findObject(this.listOption.group, "maxVotingNum");
                  if(value == 2 ){
                    this.$set(repeatePeriodColumn, 'display', false );
                    this.$set(repeateTimeColumn, 'display', true );
                    this.$set(maxVotingNumColumn, 'display', true );
                  }else if(value == 1 ){
                    this.$set(repeatePeriodColumn, 'display', true );
                    this.$set(repeateTimeColumn, 'display', false );
                    this.$set(maxVotingNumColumn, 'display', false );
                  }else{
                    this.$set(repeatePeriodColumn, 'display', false );
                    this.$set(repeateTimeColumn, 'display', false );
                    this.$set(maxVotingNumColumn, 'display', false );
                  }
                },

              },
              {
                label: '重复周期',
                prop: 'repeatePeriod',
                display: true,
                type: 'number',
                formslot: true,
              },
              {
                label: '时间段设置',
                prop: 'repeateStartEndTime',
                type: 'timerange',
                format:'HH:mm:ss',
                valueFormat:'HH:mm:ss',
                startPlaceholder: '开始时间',
                endPlaceholder: '结束时间',
                value: ['00:00:00', '23:59:59'],
                display: false,
                rules: [
                  {
                    required: true,
                    message: "请设置时间段",
                    trigger: "blur"
                  },
                  {
                    validator: checkSameVal,
                    trigger: 'blur'
                  }
                ],
              },

              {
                label: '开始时间',
                prop: 'repeateStartTime',
                display: false,
              },
              {
                label: '结束时间',
                prop: 'repeateEndTime',
                display: false,
              },
              {
                label: '每天最多提交次数',
                prop: 'maxVotingNum',
                display: false,
                type: 'number',
                controlsPosition: '',
                precision: 0,
                value: 1,
                minRows:1,
                maxRows:99999,
              },

            ],
          },
          {
            label: '扩展设置',
            prop: 'kzsz',
            icon: 'el-icon-edit-outline',
            column: [
              {
                label: '使用系统',
                prop: 'systemCode',
                type: 'radio',
                dicData: [
                  {
                    label: 'AiCOS',
                    value: 'aicos',
                  },
                  {
                    label: 'AiSite',
                    value: 'aisite',
                  },
                ],
                value: 'aicos',
                change:({value})=>{
                  const siteIdColumn = this.findObject(this.listOption.group, "siteId");
                  const qusnTypeColumn = this.findObject(this.listOption.group, "questionnaireType");
                  const joinUserTypeColumn = this.findObject(this.listOption.group, "joinUserType");
                  const joinUserTypeDic = findNodeByVal(joinUserTypeColumn.dicData, "value", 2 );
                  //console.log(joinUserTypeDic)
                  //console.log(this.listForm.joinUserType)
                  const isShowResultColumn = this.findObject(this.listOption.group, "isShowResult");
                  const statusColumn = this.findObject(this.listOption.group, "status");

                  const extendColumn1 = this.findObject(this.listOption.group, "extendColumn1");
                  const extendColumn2 = this.findObject(this.listOption.group, "extendColumn2");
                  const extendColumn3 = this.findObject(this.listOption.group, "extendColumn3");
                  const extendColumn4 = this.findObject(this.listOption.group, "extendColumn4");
                  const extendColumn5 = this.findObject(this.listOption.group, "extendColumn5");


                  if(value == 'aisite' ){
                    // this.$set(siteIdColumn, 'display', true );
                    // this.$set(qusnTypeColumn, 'display', true );
                    //this.$set(joinUserTypeColumn, 'display', true );
                    this.$set(joinUserTypeDic, 'disabled', false );
                    this.$set(isShowResultColumn, 'display', true );
                    this.$set(statusColumn, 'display', true );

                    this.$set(extendColumn1, 'display', true );
                    this.$set(extendColumn2, 'display', true );
                    this.$set(extendColumn3, 'display', true );
                    this.$set(extendColumn4, 'display', true );
                    this.$set(extendColumn5, 'display', true );

                  }else{
                    this.$set(siteIdColumn, 'display', false );
                    this.$set(qusnTypeColumn, 'display', false );

                    //this.$set(joinUserTypeColumn, 'display', false );
                    this.$set(joinUserTypeDic, 'disabled', true );
                    if(this.listForm.joinUserType == 2){

                      this.$set(this.listForm, 'joinUserType', 1 );
                    }

                    this.$set(isShowResultColumn, 'display', false );
                    this.$set(statusColumn, 'display', false );

                    this.$set(extendColumn1, 'display', false );
                    this.$set(extendColumn2, 'display', false );
                    this.$set(extendColumn3, 'display', false );
                    this.$set(extendColumn4, 'display', false );
                    this.$set(extendColumn5, 'display', false );

                  }
                },

              },
              {
                label: '从属站点',
                prop: 'siteId',
                display: false,
                maxlength: 200,
                showWordLimit: true,
                rules: [
                  {
                    required: true,
                    message: "请输入从属站点",
                    trigger: "blur"
                  },
                  ...getRules(['notEnSpecials'])
                ],
              },
              {
                label: '调查类型',
                prop: 'questionnaireType',
                type: 'radio',
                display: false,
                dicData: [
                  {
                    label:'在线调查',
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
                label: '问卷状态',
                prop: 'status',
                type: 'radio',
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
                value: 1,
              },
              {
                label: '参与者设置',
                prop: 'joinUserType',
                display: true,
                type: 'radio',
                dicData: [
                  {
                    label:'匿名',
                    value: 1,
                  },
                  {
                    label:'会员',
                    value: 2,
                    disabled: true,
                  },
                  {
                    label:'所有后台用户',
                    value: 3,
                  },
                  {
                    label:'按部门用户选择',
                    value: 4,
                  },

                ],
                value: 1,
                change:({value})=>{

                  const joinUserJsonColumn = this.findObject(this.listOption.group, "joinUserJson");
                  if(value == 4){
                    this.$set(joinUserJsonColumn, 'display', true );
                  }else{
                    this.$set(joinUserJsonColumn, 'display', false );
                  }
                },
              },
              {
                label: '参与者',
                prop: 'joinUserJson',
                display: false,
                value: "",
              },
              {
                label: '前台是否显示问答题结果',
                prop: 'isShowResult',
                type: 'radio',
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
                value: 1,
              },

              {
                label: '扩展字段1',
                prop: 'extendColumn1',
                display: false,
                maxlength: 200,
                showWordLimit: true,
                rules: [
                  ...getRules(['notEnSpecials'])
                ],
              },
              {
                label: '扩展字段2',
                prop: 'extendColumn2',
                display: false,
                maxlength: 200,
                showWordLimit: true,
                rules: [
                  ...getRules(['notEnSpecials'])
                ],
              },
              {
                label: '扩展字段3',
                prop: 'extendColumn3',
                display: false,
                maxlength: 200,
                showWordLimit: true,
                rules: [
                  ...getRules(['notEnSpecials'])
                ],
              },
              {
                label: '扩展字段4',
                prop: 'extendColumn4',
                display: false,
                maxlength: 200,
                showWordLimit: true,
                rules: [
                  ...getRules(['notEnSpecials'])
                ],
              },
              {
                label: '扩展字段5',
                prop: 'extendColumn5',
                display: false,
                maxlength: 200,
                showWordLimit: true,
                rules: [
                  ...getRules(['notEnSpecials'])
                ],
              },

              {
                label: '备注',
                prop: 'remark',
                type: 'textarea',
                maxlength: 500,
                showWordLimit: true,
                row: 3,
              },
            ],
          }
        ],


      },

      qusnDesignRow: {},
      qusnDesignOption: {},
      qusnDesignTag: false,
      qusnDesignKey: 0,

      bankData: [],
      /*bankPage: {
        "pageSize": 10,
        "currentPage": 1,
        "total": 0,
        "pageSizes": [ 10, 20, 30, 40, 50, 100 ]
      },*/

    }
  },
  methods: {
    domIsNull(data){
      return isNull(data)
    },
    configColumn() {
      this.$refs.listRef.$refs.dialogColumn.columnBox = true;
    },

    addRow(/*row, index*/){
      this.$refs.listRef.rowAdd();
    },
    updateRow(row, index){
      this.$refs.listRef.rowEdit(row, index);
    },
    deleteRow(row/*, index*/){
      this.$confirm("确定将选择数据删除?", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(() => {
        return  delQusnList( {id:row.id} );
      }).then(() => {
        this.$message({
          type: "success",
          message: "操作成功",
        });
        this.refreshChange();
      })
    },

    rowSave(row, done, loading) {

      const defaultFrontJson = {
        "column": [
          {
            "typeQusn": "htmlQusn",
            "onlyOne": true,
            "label": "<p style=' text-align: center; font-size: 22px; font-weight: bold; color: #000;'>"+row.questionnaireName+"</p>",
            "labelPlus": true,
            "span": 24,
            "display": true,
            "dataType": "string",
            "prop": "qusnTitle",
            "showWordLimit": true
          },
          {
            "typeQusn": "htmlQusn",
            "onlyOne": true,
            "label": "<p>问卷描述</p><p style='display: block; border-top: 2px solid #ccc' ></p><p>&nbsp;</p>",
            "labelPlus": true,
            "span": 24,
            "display": true,
            "dataType": "string",
            "prop": "qusnRemark",
            "showWordLimit": true
          },
        ],
        "span": 24,
        "labelPosition": "top",
        "labelSuffix": " ",
        "labelWidth": 120,
        "gutter": 0,
        "detail": false,
        "menuBtn": false,
        "submitBtn": false,
        "submitText": "提交",
        "emptyBtn": false,
        "emptyText": "清空",
        "menuPosition": "center",
        "readonly": false,
        "disabled": false,
        "showLabelIndex": true
      }


      let tempUserArr = row.joinUserJson.user || [];
      let tempUser = [];
      tempUserArr.map((item)=>{
        tempUser.push(item.account);
      })

      // console.log(tempUser.join(','));
      row.accountIds = tempUser.join(',');

      let tempDeptArr = row.joinUserJson.dept || [];
      let tempDept = [];
      tempDeptArr.map((item)=>{
        tempDept.push(item.id);
      })

      // console.log(tempDept.join(','));
      row.deptIds = tempDept.join(',');

      row.deptJson = JSON.stringify( row.joinUserJson );

      row.siteId = '-1';
      row.questionnaireType = 0 ;

      const dataParam = {
        ...row,
        editorFrontJson: JSON.stringify( defaultFrontJson ),

      };
      addQusnList(dataParam).then(() => {
        //this.refreshChange();
        this.$message({
          type: "success",
          message: "操作成功",
        });
        done();
      }, error => {
        window.console.log(error);
        loading();
      });

    },
    async rowUpdate(row, index, done, loading) {

      //console.log( this.editTempData );
      if( row.questionnaireName != this.editTempData.questionnaireName ){
        //console.log('改标题啦');

        const titleColumn = {
          "typeQusn": "htmlQusn",
          "onlyOne": true,
          "label": "<p style=' text-align: center; font-size: 22px; font-weight: bold; color: #000;'>"+row.questionnaireName+"</p>",
          "labelPlus": true,
          "span": 24,
          "display": true,
          "dataType": "string",
          "prop": "qusnTitle",
          "showWordLimit": true
        }

        let tempJson = JSON.parse( row.editorFrontJson );
        //console.log(tempJson);
        tempJson.column = tempJson.column.map((item)=>{
          if(item.prop == 'qusnTitle'){
            item = titleColumn
          }
          return item
        })

        //console.log(tempJson);

        row.editorFrontJson = JSON.stringify(tempJson);

      }

      let tempUserArr = row.joinUserJson.user || [];
      let tempUser = [];
      tempUserArr.map((item)=>{
        tempUser.push(item.account);
      })

      // console.log(tempUser.join(','));
      row.accountIds = tempUser.join(',');

      let tempDeptArr = row.joinUserJson.dept || [];
      let tempDept = [];
      tempDeptArr.map((item)=>{
        tempDept.push(item.id);
      })

      // console.log(tempDept.join(','));
      row.deptIds = tempDept.join(',');


      row.deptJson = JSON.stringify( row.joinUserJson );

      const dataParam = {
        ...row
      };
      await updateQusnList(dataParam).then(() => {
        //this.refreshChange();
        this.$message({
          type: "success",
          message: "操作成功",
        });
        done();
      }, error => {
        window.console.log(error);
        loading();
      });

    },
    searchReset() {
      this.query = {};
      this.searchForm = {};
      this.onLoad(this.page);
    },
    searchChange(params,done) {

      this.query = {
        ...params,
      };
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

      if (["add", "edit","view"].includes(type)) {
        this.initData(type);
        this.editTempData = this.deepClone(this.listForm)
      }
      done();
    },
    beforeClose(done/*, type*/) {
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

    initData(type){
      if( type == "view" || type == "edit" ){
        this.type = type;
      }
    },

    onLoad(page, params = {}) {
      this.loading = true;

      const dataParam = {
        ...params,
        ...this.query,
        //...this.activeType,
        "current": page.currentPage,
        "size": page.pageSize
      }

      getQusnList(dataParam).then(res => {
        const dataRes = res.data.data;
        this.page.total = dataRes.total;
        this.page.pageSize = dataRes.size;
        this.page.currentPage = dataRes.current;
        this.listData = dataRes.records.map((item)=>{
          if(item.isAutoPublic){
            item.startEndTime = [item.startTime,item.endTime];
          }
          if(item.limitDateType == 2){
            item.repeateStartEndTime = [item.repeateStartTime,item.repeateEndTime];
          }
          item.joinUserJson = !isNull(item.deptJson)? JSON.parse( item.deptJson ) : {};

          return item
        });
        this.loading = false;
        this.selectionClear();
      });
    },

    pubulicRow(row,toStatus){

      if( row.subjectNum < 1 ){
        this.$message.error("请使用“设计”功能，为此问卷添加题目。")
        return false
      }

      //const nowTime = dateFormat(Date.now());

      const dataParam = {
        id: row.id,
        publishStatus: toStatus,
        isAutoPublic : 0,
        //startTime: ( (row.isAutoPublic == 1 && toStatus == 1)? nowTime : row.startTime ),
        //endTime: ( (row.isAutoPublic == 1 && toStatus == 0)? nowTime : row.endTime ),
      };
      publishQusnList(dataParam).then(() => {
        this.$message({
          type: "success",
          message: "操作成功",
        });
        this.refreshChange();
      }, error => {
        window.console.log(error);
      });
    },
    enableRow(row,toStatus){
      const dataParam = {
        id: row.id,
        status: toStatus,
      };
      enableQusnList(dataParam).then(() => {
        this.$message({
          type: "success",
          message: "操作成功",
        });
        this.refreshChange();
      }, error => {
        window.console.log(error);
      });
    },

    copyRow(row){
      copyQusnList({id: row.id}).then(() => {
        this.$message({
          type: "success",
          message: "操作成功",
        });
        this.refreshChange();
      }, error => {
        window.console.log(error);
      });
    },

    designRow(row/*,index*/){
      if(row.publishStatus == 1 ){
        this.$confirm("当前的问卷可能正在使用中，修改题目可能会导致正在提交的数据和已经提交的数据发生错误，确定要进入问卷设计界面？", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(() => {
          this.qusnDesignKey++;
          this.qusnDesignRow = row;
          this.qusnDesignOption = row.editorFrontJson;
          this.qusnDesignTag =  true;
        })
      }else{
        this.qusnDesignKey++;
        this.qusnDesignRow = row;
        this.qusnDesignOption = isNull(row.editorFrontJson)?'{column:[]}':row.editorFrontJson ;
        this.qusnDesignTag =  true;
      }
    },

    qusnDesignClose(){
      this.qusnDesignKey++;
      this.qusnDesignRow = {};
      this.qusnDesignOption = {};
      this.qusnDesignTag = false;
    },
    async qusnDesignSave(saveType){

      const designData = await this.$refs.qusnDesignRef.getData();

      const columnNum = designData.column.length;

      if(columnNum < 3){
        this.$message.error("题目设计不能为空。")
        return false
      }

      const newNameColumn = this.findObject(designData.column, "qusnTitle");
      //console.log(newNameColumn);
      let newName = '';
      if( !isNull( newNameColumn ) && newNameColumn != -1  ) {
        newName = getHtmlPlainText( newNameColumn.label ).substring(0,100);
      }

      const dataParam = {
        id: this.qusnDesignRow.id,
        editorFrontJson: JSON.stringify( designData ),
        subjectNum: columnNum,
      };
      if( !isNull(newName)) {
        dataParam.questionnaireName = newName;
      }

      if(saveType == 'publish'){
        dataParam.publishStatus = 1;
      }

      await updateQusnList(dataParam).then(() => {
        this.$message({
          type: "success",
          message: "操作成功",
        });
        this.qusnDesignTag = false;
        this.refreshChange();
      }, error => {
        window.console.log(error);
      });

    },

    openWinDowByRow(row,winUrl,menuPath){
      if (this.desktop) {

        const menuAll = this.$store.state.user.menuAll;

        let menuData = {};

        let winCode = "QusnWin";
        if(winUrl == '/questionnaire/qusnDataAdd' ){
          winCode = "QusnWinDataAdd";
          menuData = findNodeByVal(menuAll,'code','questionnaire-dataAdd','menuList');

        }else if(winUrl == '/questionnaire/statistic'){
          winCode = "QusnWinStatistic";
          menuData = findNodeByVal(menuAll,'code','questionnaire-statistic','menuList');
        }

        //console.log(menuData)


        const formWinParm ={
          ... menuData,
          menuName: '在线调查 【 '+row.questionnaireName+' 】',
          //imageUrl: 'menu-icon-img resource-center',
          //linkUrl: winUrl,
          query:{
            qusnId: row.id,
          },
          height:'100%',
          width:'100%',
        };


        const formWin = {
          visible: true,
          zIndex: this.desktop.winList.length + this.desktop.baseZindex,
          data: formWinParm,
          commonParm: winCode

        }

        //删除已打开的comFormWin窗口
        if( this.desktop.winList.filter((item)=>item.commonParm == winCode).length > 0 ){
          this.desktop.winList = this.desktop.winList.filter((item)=>item.commonParm != winCode)
        }

        this.desktop.winList.push(formWin);

      }else{

        this.$router.push({
          path: menuPath,
          query:{
            qusnId: row.id,
          },
        })

      }
    },

    useRow(row/*,index*/){
      window.open(`${baseURL}#/questionnaire/qusnDataAdd?qusnId=`+row.id);
      //this.openWinDowByRow(row,'/questionnaire/qusnDataAdd','./qusnDataAdd');
    },
    copyPitchInUrl(row){
      let pitchInUrl = window.origin + `${baseURL}#/questionnaire/qusnDataAdd?qusnId=`+row.id;
      this.$Clipboard({
        text: pitchInUrl
      }).then(() => {
        this.$message.success('复制成功')
      }).catch(() => {
        this.$message.error('复制失败')
      });
    },

    statisticRow(row){
      this.openWinDowByRow(row,'/questionnaire/statistic','./statistic');
    },

    getBankList(params){
      this.$refs.qusnDesignRef.tagBankLoading(true);
      const dataParam = {
        ...params,
        //"current": this.bankPage.currentPage,
        //"size": this.bankPage.pageSize
      }
      getBankList(dataParam).then(res => {
        const dataRes = res.data.data;

        const tempRes = dataRes.records.map((item)=>{
          //导入的数据 editorFrontJson 可能为空 需要先转换一下
          if( isNull(item.editorFrontJson) ){
            item.editorFrontJson = makeFrontJsonByBackJson(item.editorBackJson);
          }
          return item
        });
        this.bankData = {
          ...dataRes,
          records: tempRes,
        }

        this.$refs.qusnDesignRef.tagBankLoading(false);
      });
    },

    initFormItemBySystem(){

      const siteIdColumn = this.findObject(this.listOption.group, "siteId");
      const qusnTypeColumn = this.findObject(this.listOption.group, "questionnaireType");
      const joinUserTypeColumn = this.findObject(this.listOption.group, "joinUserType");
      const isShowResultColumn = this.findObject(this.listOption.group, "isShowResult");
      if( baseURL.includes('aicos') ){
        this.$set(siteIdColumn, 'display', true );
        this.$set(qusnTypeColumn, 'display', true );
        this.$set(joinUserTypeColumn, 'display', true );
        this.$set(isShowResultColumn, 'display', true );
      }else{
        this.$set(siteIdColumn, 'display', false );
        this.$set(qusnTypeColumn, 'display', false );
        this.$set(joinUserTypeColumn, 'display', false );
        this.$set(isShowResultColumn, 'display', false );
      }
    },

    addTobankFromDesign(bankType,dataParam){
      //console.log(bankType,dataParam)

      let optionItem = [];
      if(dataParam.dicData){
        dataParam.dicData.map((item)=>{
          optionItem.push( getHtmlPlainText(item.label).substring(0,200) );
        })

      }
      let subjectType = 6;

      switch(dataParam.typeQusn){
        case 'radioQusn':
          subjectType = 1;
          break;
        case 'checkboxQusn':
          subjectType = 2;
          break;
        case 'selectQusn':
          subjectType = 3;
          break;
        case 'inputQusn':
          subjectType = 4;
          break;
        case 'textareaQusn':
          subjectType = 5;
          break;
        case 'htmlQusn':
          subjectType = 6;
          break;
        default:
      }


      let row = {
        bankSubjectName: getHtmlPlainText(dataParam.label).substring(0,100),
        optionItem: optionItem,
        subjectType: subjectType,
      }

      const itemJson = makeApiJsonByDomitem(row);

      const params = {
        ...row,
        optionNum: itemJson.optionNum,
        bankSubjectType: bankType,
        editorFrontJson: JSON.stringify(itemJson.frontJson),
        editorBackJson: JSON.stringify(itemJson.backJson),
      };
      //console.log(params)

      addBankList(params).then(() => {
        this.$message({
          type: "success",
          message: "操作成功",
        });

      }, error => {
        window.console.log(error);

      });

    },

    dropdownVisibleChange(e){
      this.dropdownTag = e;
    },
    dropdownHide(){
      //console.log('this.dropdownHide();');
      this.dropdownTag = false;
    },

  },
  watch:{
    'listForm.startEndTime':{
      handler(val){
        if( !isNull(val) ){
          this.listForm.startTime = val[0];
          this.listForm.endTime = val[1];
        }

      },
      immediate: true,
    },
    'listForm.repeateStartEndTime':{
      handler(val){
        if( !isNull(val) ){
          this.listForm.repeateStartTime = val[0];
          this.listForm.repeateEndTime = val[1];
        }
      },
      immediate: true,
    },


  },

  mounted(){
    //this.initFormItemBySystem();
  },
}
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
  .copyUrl{
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

.qusnDesign-dialog  {
  /deep/.el-dialog {
    position: relative;
  }
  /deep/ .el-dialog__body {
    height: calc(100% - 60px);
    padding: 0;
  }
  /deep/ .el-dialog__footer{
    position: absolute;
    top: 0px;
    right: 10px;
    background-color: #fff;
    padding: 12px 30px 10px;
  }
  /deep/ .el-dialog__footer .el-button {

  }
}

</style>
