<template>
  <HuilanBasic class="newCss">
    <div class="menuTitle">通用表单</div>

    <HuilanBasicToolbar style="margin-top: 0">
      <el-button
        v-if="permissionList.addBtn"
        type="primary"
        size="small"
        @click="comFormAdd()"
        >新增</el-button
      >
    </HuilanBasicToolbar>
    <HuilanBasicSearchbar
      :model="searchForm"
      :fields="searchFieldList"
      @reset="searchReset"
      @search="searchChange"
    >
      <template v-slot:appendTool>
        <el-button type="default" @click="configColumn"
          ><i class="el-icon-s-operation"></i
        ></el-button>
      </template>
    </HuilanBasicSearchbar>
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
      <!-- <template slot-scope="scope" slot="menuRight">
        <el-button
          type="primary"
          size="small"
          icon="el-icon-plus"
          v-if="permissionList.addBtn"
          @click.stop="comFormAdd()"
        >新 增
        </el-button>
      </template> -->
      <template v-slot:menu="scope">
        <HuilanBasicActionTool
          :actions="getRowActions(scope.row)"
          @command="handleCommand($event, scope.row, scope.index)"
        />
      </template>
      <!-- <template slot-scope="scope" slot="menu">
        <el-button
          type="text"
          size="small"
          icon="el-icon-view"
          v-if="permissionList.viewBtn"
          @click.stop="comFormView(scope.row, scope.index)"
          >查看
        </el-button>
        <el-button
          type="text"
          size="small"
          icon="el-icon-edit"
          v-if="permissionList.editBtn"
          @click.stop="comFormUpdate(scope.row, scope.index)"
          >编辑
        </el-button>

        <el-button
          type="text"
          size="small"
          icon="el-icon-setting"
          v-if="permissionList.fieldset"
          @click.stop="comFormSetOpen(scope.row, scope.index)"
          >配置
        </el-button>
        <el-button
          type="text"
          size="small"
          icon="el-icon-edit-outline"
          v-if="permissionList.design"
          @click.stop="comFormDesign(scope.row, scope.index)"
          >设计
        </el-button>

        <el-button
          type="text"
          size="small"
          icon="el-icon-position"
          v-if="permissionList.publish"
          :disabled="scope.row.status === '1' || scope.row.status === '3'"
          @click.stop="publishForm(scope.row, scope.index)"
          >发布
        </el-button>
        <el-button
          type="text"
          size="small"
          icon="el-icon-edit-outline"
          :disabled="scope.row.status !== '1'"
          v-if="permissionList.preview"
          @click.stop="comFormPreview(scope.row, scope.index)"
          >使用
        </el-button>
        <el-button
          type="text"
          size="small"
          icon="el-icon-tickets"
          v-if="permissionList.version"
          @click.stop="showVersionList(scope.row, scope.index)"
          >版本
        </el-button>
        <el-button
          type="text"
          size="small"
          icon="el-icon-tickets"
          v-if="permissionList.copyBtn"
          @click.stop="comFormClone(scope.row, scope.index)"
          >复制
        </el-button>
        <el-button
          type="text"
          size="small"
          icon="el-icon-delete"
          v-if="permissionList.delBtn"
          @click.stop="comFormDel(scope.row, scope.index)"
          >删除
        </el-button>
      </template> -->
    </avue-crud>

    <QSGDrawer :title="comFormTitle" size="660px" :visible.sync="comFormTag">
      <avue-form
        :class="comFormClass"
        :option="comFormOption"
        ref="comFormRef"
        v-model="comFormData"
        :key="comFormReload"
      >
        <template slot-scope="scope" slot="isCustomTable">
          <el-checkbox
            v-model="isCustomTable"
            :disabled="isCustomTableDisabled"
            @change="customNameFun(isCustomTable)"
            >自定义数据库表名</el-checkbox
          >
        </template>
      </avue-form>

      <template v-slot:footer>
        <el-button
          size="small"
          icon="el-icon-setting"
          v-if="comFormSubBtnShowGo"
          type="primary"
          @click.stop="comFormSaveSet"
          :loading="btnLoading"
          >保存并配置
        </el-button>
        <el-button
          size="small"
          icon="el-icon-edit-outline"
          v-if="comFormSubBtnShowGo"
          type="primary"
          @click.stop="comFormSaveDesign"
          :loading="btnLoading"
          >保存并设计
        </el-button>
        <el-button
          size="small"
          icon="el-icon-circle-plus-outline"
          v-if="comFormSubBtnShow"
          type="primary"
          @click.stop="comFormSave"
          :loading="btnLoading"
          >保 存
        </el-button>
        <el-button
          size="small"
          icon="el-icon-circle-close"
          @click.stop="comFormClose"
          >取 消
        </el-button>
      </template>
    </QSGDrawer>

    <HuilanDialog
      title="表单设计"
      :fullscreen="true"
      append-to-body
      class="form-design-dialog"
      :visible.sync="designDialogVisible"
    >
      <!-- 只有非自定义数据库表名的有子表单-->
      <avue-form-design
        ref="formDesign"
        v-if="designDialogVisible"
        :options="curFormJson"
        :field-scope="useableFields"
        :uploadBgUrl="uploadBgUrl"
        :getUploadBgHeader="getUploadBgHeader"
        :loadDicData="loadDicData"
        :dictItemUrl="dictItemUrl"
        :type="activeType.type"
        :hiddenDynamic="curForm.isCustomTable === 1"
      />
      <template v-slot:footer>
        <el-button size="small" type="primary" @click="saveFormDesign"
          >确 定</el-button
        >
        <el-button size="small" @click="designDialogVisible = false"
          >取 消</el-button
        >
      </template>
    </HuilanDialog>

    <HuilanDialog
      title="版本"
      append-to-body
      :visible.sync="versionDialogVisible"
    >
      <PublishedFormMgr
        v-if="versionDialogVisible"
        @versionClose="versionClose"
        :code="curForm.code"
      />
      <template v-slot:footer>
        <!--<el-button size="small" type="primary" @click="saveFormDesign">关闭</el-button>-->
        <el-button size="small" @click="versionDialogVisible = false"
          >关闭</el-button
        >
      </template>
    </HuilanDialog>

    <!-- <transition name="comFormSlide">
      <div v-if="comFormSetTag" class="com_form_set" >
        <comFormSet
          :data="comFormSetData"
          @comFormSetCloseFun="comFormSetClose"
        ></comFormSet>
      </div>
    </transition> -->
    <QSGDrawer
      title="配置"
      size="100%"
      :visible.sync="comFormSetTag"
      :withHeader="false"
      :fullscreen="true"
      customClass="com_form_set"
    >
      <comFormSet
        :data="comFormSetData"
        @comFormSetCloseFun="comFormSetClose"
        :key="comFormSetKey"
      ></comFormSet>
    </QSGDrawer>

    <HuilanDialog
      :title="previewTitle"
      :fullscreen="false"
      width="330px"
      append-to-body
      :visible.sync="previewTag"
    >
      <div class="prv_w">
        <div class="prv_img">
          <div class="prv_img_border">
            <span></span>
            <span></span>
            <span></span>
            <span></span>
          </div>
          <img :src="previewUrlImg" />
        </div>
        <div class="prv_btn" v-if="previewShowAdd">
          <span>数据录入</span>
          <el-button
            type="primary"
            size="mini"
            icon="el-icon-link"
            @click="previewGoto('add')"
            >前 往</el-button
          >
          <el-button
            type="primary"
            size="mini"
            icon="el-icon-document-copy"
            @click="previewCopy('add')"
            >复制</el-button
          >
        </div>
        <div class="prv_btn">
          <span>数据管理</span>
          <el-button
            type="primary"
            size="mini"
            icon="el-icon-link"
            @click="previewGoto('mag')"
            >前 往</el-button
          >
          <el-button
            type="primary"
            size="mini"
            icon="el-icon-document-copy"
            @click="previewCopy('mag')"
            >复制</el-button
          >
        </div>
      </div>

      <template v-slot:footer>
        <el-button size="small" @click="previewClose">取 消</el-button>
      </template>
    </HuilanDialog>

    <HuilanDialog
      :title="ckTemplateTitle"
      :fullscreen="false"
      width="960px"
      append-to-body
      :visible.sync="ckTemplateTag"
    >
      <ckTemplate
        v-if="ckTemplateTag"
        :indexDesignForm="designForm"
        :indexColseThis="ckTemplateClose"
        :indexRefresh="refreshChange"
        :indexDesign="designForm"
        :ckTemplateData="ckTemplateData"
      >
      </ckTemplate>
    </HuilanDialog>
  </HuilanBasic>
</template>

<script>
import { mapGetters } from "vuex";
import { getRules } from "@/util/regx";
//import iconList from "@/config/iconList";
import { baseURL, getUploadUrl } from "@/api/common";
//import serviceList from "@/config/serviceList";
import { validatenull } from "@/util/validate";
// import { getObjType } from '@/util/util';
import PublishedFormMgr from "./publishedForm";
import comFormSet from "./comFormSet";
import ckTemplate from "./comFormCkTemplate";

import QSGDrawer from "@/components/QSGDrawer";

import buildSubmitFieldsData from "../form/mixins/buildSubmitFieldsData";

import {
  getListData,
  addListData,
  updateListData,
  delListData,
  viewListData,
  previewListData,
  //getList,
  //add,
  update,
  //remove,
  publish,
  getFormDictUrl,
  createDicRequest,
  getUseableFieldsList,
  getFromTemplateNewest,
  cloneForm,
} from "@/api/system/commonForm";

import ChineseHelper from "./ChineseHelper.js";
import website from "@/config/website";
import { getToken } from "@/util/auth";

export default {
  inject: ["desktopWindow", "desktop"],

  name: "通用表单列表",
  components: {
    PublishedFormMgr,
    comFormSet,
    QSGDrawer,
    ckTemplate,
  },
  mixins: [buildSubmitFieldsData],
  computed: {
    ...mapGetters(["permission"]),
    permissionList() {
      return {
        addBtn: this.vaildData(this.permission[`sys-commonForm-add`], false),
        viewBtn: this.vaildData(this.permission[`sys-commonForm-view`], false),
        delBtn: this.vaildData(this.permission[`sys-commonForm-delete`], false),
        editBtn: this.vaildData(
          this.permission[`sys-commonForm-update`],
          false
        ),
        design: this.vaildData(this.permission[`sys-commonForm-design`], false),
        publish: this.vaildData(
          this.permission[`sys-commonForm-publish`],
          false
        ),
        version: this.vaildData(
          this.permission[`sys-commonForm-version`],
          false
        ),
        preview: this.vaildData(
          this.permission[`sys-commonForm-preview`],
          false
        ),
        fieldset: this.vaildData(
          this.permission[`sys-commonForm-fieldset`],
          false
        ),
        copyBtn: this.vaildData(
          this.permission[`sys-commonForm-copyBtn`],
          false
        ),
      };
    },
  },
  data() {
    return {
      comFormSetKey: 0,

      btnLoading: false,
      loading: true,
      page: {
        pageSize: 10,
        currentPage: 1,
        total: 0,
        pageSizes: [10, 20, 30, 40, 50, 100],
      },

      listForm: {},
      selectionList: [],
      activeType: {
        type: "dynamic",
      },
      query: {},
      listData: [],
      listOption: {
        header: false,
        tip: false,
        calcHeight: 65,
        searchShow: true,
        searchClearable: false,
        index: true,
        selection: true,
        addBtn: false,
        viewBtn: false,
        delBtn: false,
        editBtn: false,
        menuWidth: 230,
        menuAlign: "center",
        menuFixed: "right",
        dialogClickModal: false,
        dialogDirection: "rtl",
        span: 24,
        dialogWidth: "40%",
        dialogType: "drawer",
        dialogCustomClass: "huilan-drawer-form",

        /*searchIndex:2,
        border: true,
        stripe:false,
        searchIcon:true,
        searchMenuSpan:4,
        searchMenuPosition:"left",
        searchSpan:4,
        dialogMenuPosition:"right",
        */

        border: true,
        searchIndex: 1,
        searchIcon: true,
        searchSpan: 4,
        searchMenuSpan: 3,
        searchMenuPosition: "right",
        labelWidth: 110,

        column: [
          {
            label: "ID",
            prop: "id",
            hide: true,
            //disabled: true,
            //display:false,
          },
          {
            label: "表单名称",
            prop: "name",
            span: 24,
            maxlength: 50,
            showWordLimit: true,
            // offset:4,
            // search: true,
            rules: [
              {
                required: true,
                message: "请输入表单名称",
                trigger: "blur",
              },
              ...getRules(["charNumHanUnderline"]),
            ],
          },
          {
            label: "数据库表",
            prop: "code",
            span: 24,
            hide: true,
            //search: true,
            editDisabled: true,
            showWordLimit: true,
            maxlength: 50,
            rules: [
              {
                required: true,
                message: "请输入编码",
                trigger: "blur",
              },
              {
                pattern: /^[A-Za-z0-9_]+$/,
                message: "只允许数字、字母、下划线",
                trigger: "blur",
              },
            ],
          },

          /*{
            label:'使用系统',
            prop: 'systemCode',
            hide:true,
            type: 'select',
            editDisabled: true,
            dicUrl: `${baseURL}api/${serviceList.system}/baseAppstore/product/listAll`,
            dicMethod: 'post',
            dicQuery: {
              type: 0,
              origin: 0,
              current: 1,
              isSupportDynamicForm: 1,
            },
            dicFormatter(data) {
              const list = [
                {name: 'AiCOS', systemCode: 'AiCOS'}
              ]
              list.push(...data.data);
              return list;
            },
            props: {
              label: 'name',
              value: 'systemCode',
              desc: 'description'
            }
          },*/

          {
            label: "自定义数据表",
            prop: "isCustomTable",
            type: "select",
            align: "center",
            hide: true,
            search: false,
            dicData: [
              { label: "否", value: 0 },
              { label: "是", value: 1 },
            ],
          },
          {
            label: "前台提交",
            prop: "verifyType",
            type: "select",
            align: "center",
            // search: true,
            dicData: [
              { label: "不支持", value: 999 },
              { label: "匿名", value: 0 },
              { label: "手机短信", value: 1 },
              //{ label: '邮箱', value: 2, disabled:true },
              { label: "微信", value: 3 },
            ],
          },
          {
            label: "开启审核",
            prop: "isAudit",
            type: "select",
            align: "center",
            // search: true,
            dicData: [
              { label: "不开启", value: 0 },
              { label: "开启", value: 1 },
            ],
          },
          {
            label: "设定模板",
            prop: "isTemplate",
            type: "select",
            align: "center",
            // search: true,
            dicData: [
              { label: "不设定", value: 0 },
              { label: "设定", value: 1 },
            ],
          },
          {
            label: "发布状态",
            prop: "status",
            type: "radio",
            align: "center",
            span: 24,
            // search: true,
            addDisplay: false,
            editDisplay: false,
            dicData: [
              {
                label: "草稿",
                value: "0",
              },
              {
                label: "已发布",
                value: "1",
              },
              {
                label: "初稿",
                value: "3",
              },
            ],
          },
          {
            label: "更新时间",
            prop: "updateTime",
            span: 24,
            align: "center",
            addDisplay: false,
            editDisplay: false,
          },
          {
            label: "描述",
            prop: "remark",
            span: 24,
            type: "textarea",
            align: "right",
            width: 80,
            hide: true,
            maxlength: 100,
            showWordLimit: true,
            rules: getRules(["expectSpecials"]),
          },
        ],
      },
      searchForm: {
        verifyType: "",
        name: "",
        isAudit: "",
        isTemplate: "",
        status: "",
      },
      searchFieldList: [
        {
          prop: "name",
          placeholder: "请输入表单名称",
        },
        {
          prop: "verifyType",
          placeholder: "请选择前台提交",
          type: "select",
          dicData: [
            { label: "不支持", value: 999 },
            { label: "匿名", value: 0 },
            { label: "手机短信", value: 1 },
            //{ label: '邮箱', value: 2, disabled:true },
            { label: "微信", value: 3 },
          ],
        },
        {
          type: "select",
          prop: "isAudit",
          placeholder: "请选择开启审核",
          dicData: [
            { label: "不开启", value: 0 },
            { label: "开启", value: 1 },
          ],
        },
        {
          label: "设定模板",
          prop: "isTemplate",
          type: "select",
          dicData: [
            { label: "不设定", value: 0 },
            { label: "设定", value: 1 },
          ],
        },
        {
          label: "发布状态",
          prop: "status",
          type: "select",
          dicData: [
            {
              label: "草稿",
              value: "0",
            },
            {
              label: "已发布",
              value: "1",
            },
            {
              label: "初稿",
              value: "3",
            },
          ],
        },
      ],
      designDialogVisible: false,
      curForm: {},
      defaultValues: {
        input: [
          {
            label: "创建者",
            value: "${CreaterAccount}",
          },
          {
            label: "创建者姓名",
            value: "${CreaterRealname}",
          },
          {
            label: "创建者部门",
            value: "${CreaterDept}",
          },
          {
            label: "创建者电话",
            value: "${CreaterMobile}",
          },
          {
            label: "处理人",
            value: "${UpdaterAccount}",
          },
          {
            label: "处理人姓名",
            value: "${UpdaterRealname}",
          },
          {
            label: "处理人部门",
            value: "${UpdaterDept}",
          },
          {
            label: "处理人电话",
            value: "${UpdaterMobile}",
          },
          {
            label: "流水号",
            value: "${SerialNumber}",
          },
        ],
        date: [
          {
            label: "创建时间",
            value: "${CreaterDatetime}",
          },
          {
            label: "处理时间",
            value: "${UpdaterDatetime}",
          },
        ],
      },
      useableFields: [],
      curFormJson: {},
      versionDialogVisible: false,
      formType: "dynamic",
      uploadBgUrl: getUploadUrl(),
      dictItemUrl: "",
      loadDicData: null,

      isCustomTable: true,
      isCustomTableDisabled: false,
      comFormTag: false,
      //comFormClass:"avue--view avue--detail",
      comFormClass: "",
      comFormTitle: "表单",
      comFormSubType: "add",
      comFormSubBtnShow: true,
      comFormSubBtnShowGo: true,
      comFormData: {},
      //comFormReload:Math.random(),
      comFormReload: 1,
      comFormOption: {
        submitBtn: false,
        emptyBtn: false,
        menuPosition: "right",
        column: [
          {
            label: "ID",
            prop: "id",
            span: 24,
            display: false,
          },
          {
            label: "表单名称",
            prop: "displayName",
            span: 18,
            maxlength: 50,
            showWordLimit: true,
            rules: [
              {
                required: true,
                message: "请输入表单名称",
                trigger: "blur",
              },
              ...getRules(["charNumHanUnderline"]),
            ],
            change: ({ value /*,column*/ }) => {
              //console.log(value)
              //console.log(column)
              if (this.comFormSubType == "add") {
                this.comFormData.name = ChineseHelper.ConvertPinyin(
                  value,
                  "SF"
                ).toLowerCase();
              }
            },
          },
          {
            label: "",
            prop: "isCustomTable",
            span: 6,
            labelWidth: 0,
            value: 1,
            disabled: false,
          },

          /*{
            label:'使用系统',
            prop: 'systemCode',
            span: 12,
            type: 'select',
            dicUrl: `${baseURL}api/${serviceList.system}/baseAppstore/product/listAll`,
            dicMethod: 'post',
            dicQuery: {
              type: 0,
              origin: 0,
              current: 1,
              isSupportDynamicForm: 1,
            },
            dicFormatter(data) {
              const list = [
                {name: 'AiCOS', systemCode: 'AiCOS'}
              ]
              list.push(...data.data);
              return list;
            },
            value:'AiCOS',
            props: {
              label: 'name',
              value: 'systemCode',
              desc: 'description'
            },
            rules: [
              {
                required: true,
                message: "请选择使用系统",
                trigger: "blur"
              }
            ],
            change: ({row, value}) => {
              if(this.comFormSubType=="add"){

                const nameColumn = this.findObject(this.comFormOption.column, "name");
                this.$set(nameColumn,'prepend','dyf_'+value.toLowerCase()+'_');
              }

            }
          },*/
          {
            label: "数据库表",
            prop: "name",
            span: 24,
            display: true,
            prepend: "dyf_aicos_",
            showWordLimit: true,
            maxlength: 50,
            rules: [
              {
                required: true,
                message: "请输入数据库表",
                trigger: "blur",
              },
              {
                pattern: /^[a-z0-9_]+$/,
                message: "只允许数字、小写字母、下划线",
                trigger: "blur",
              },
            ],
          },
          {
            label: "前台提交",
            prop: "allowAnonymousSubmit",
            span: 24,
            row: true,
            type: "radio",
            dicData: [
              { label: "支持", value: 1 },
              { label: "不支持", value: 0 },
            ],
            value: 0,
            change: ({ value /*, column*/ }) => {
              const submitMethodColumn = this.findObject(
                this.comFormOption.column,
                "submitMethod"
              );
              const verifyTypeColumn = this.findObject(
                this.comFormOption.column,
                "verifyType"
              );
              if (!value) {
                this.$set(submitMethodColumn, "display", false);
                this.$set(verifyTypeColumn, "display", false);
              } else {
                this.$set(submitMethodColumn, "display", true);
              }
            },
          },
          {
            label: "提交方式",
            prop: "submitMethod",
            span: 24,
            row: true,
            display: false,
            type: "radio",
            dicData: [
              { label: "匿名提交", value: 0 },
              { label: "身份验证提交", value: 1 },
            ],
            value: 0,
            change: ({ value /*, column*/ }) => {
              const verifyTypeColumn = this.findObject(
                this.comFormOption.column,
                "verifyType"
              );
              if (!value) {
                this.$set(verifyTypeColumn, "display", false);
              } else {
                if (this.comFormData.verifyType == 0) {
                  this.comFormData.verifyType = 1;
                }
                this.$set(verifyTypeColumn, "display", true);
              }
            },
          },
          {
            label: "身份验证",
            prop: "verifyType",
            span: 24,
            row: true,
            display: false,
            type: "radio",
            dicData: [
              { label: "手机短信", value: 1 },
              { label: "微信", value: 3 },
              { label: "其他(暂缓开通)", value: 2, disabled: true },
            ],
            value: 1,
          },
          /*{
            label: '自定义表单',
            prop: 'isCustom',
            span: 12,
            type: 'radio',
            dicData: [
              {label: '否', value: 0},
              {label: '是', value: 1},
            ],
            value:0,
          },*/
          /*{
            label: '开启审核',
            prop: 'isAudit',
            span: 12,
            row:true,
            type: 'radio',
            display:false,
            dicData: [
              {label: '开启', value: 1},
              {label: '不开启', value: 0},
            ],
            value:0,
            change: ({ value }) => {
              const processDefineIdColumn = this.findObject(this.comFormOption.column, "processDefineId");
              if(!value){
                this.$set(processDefineIdColumn,'display',false);
              }else{
                this.$set(processDefineIdColumn,'display',true);
              }
            },
          },

          {
            label:'工作流',
            prop: 'processDefineId',
            span: 24,
            row:true,
            display:false,
            type: 'select',
            dicUrl: `${baseURL}api/${serviceList.flow}/flow/getCanUseMaxVersionFlow`,
            dicMethod: 'post',
            dicQuery: {},
            dicFormatter(data) {
              const dataRes = data.data.map(item => {
                return { ...item, 'showLabel':item.name+'  ('+item.version+')', }
              })
              return dataRes;
            },
            props: {
              label: 'showLabel',
              value: 'processId',
              //desc: 'description'
            },
            rules: [
              {
                required: true,
                message: "请选择工作流",
                trigger: "blur"
              }
            ]
          },*/
          {
            label: "设定模板",
            prop: "isTemplate",
            span: 24,
            row: true,
            type: "radio",
            dicData: [
              { label: "设定", value: 1 },
              { label: "不设定", value: 0 },
            ],
            value: 0,
          },
          {
            label: "描述",
            prop: "desc",
            span: 24,
            type: "textarea",
            minRows: 5,
            //maxlength: 200,
            showWordLimit: true,
            //rules: getRules(['expectSpecials'])
          },
        ],
      },

      comFormSetTag: false,
      comFormSetData: {},

      previewTitle: "预览",
      previewTag: false,
      previewFormObj: "",
      previewUrlImg: "",
      previewUrlAdd: "",
      previewUrlMag: "",
      previewUrlMagTag: false,
      newestTemplateVersionId: "",
      previewShowAdd: false,

      saveGoTo: {},

      ckTemplateTitle: "选择模板",
      ckTemplateTag: false,
      ckTemplateData: {},
    };
  },

  methods: {
    getRowActions(row) {
      const map = {
        viewBtn: {
          name: "查看",
          command: "comFormView",
        },
        editBtn: {
          name: "编辑",
          command: "comFormUpdate",
        },
        fieldset: {
          name: "配置",
          command: "comFormSetOpen",
        },
        design: {
          name: "设计",
          command: "comFormDesign",
        },
        publish: {
          name: "发布",
          disabled: row.status === "1" || row.status === "3",
          command: "publishForm",
        },
        preview: {
          name: "使用",
          disabled: row.status !== "1",
          command: "comFormPreview",
        },
        version: {
          name: "版本",
          command: "showVersionList",
        },
        copyBtn: {
          name: "复制",
          command: "comFormClone",
        },
        delBtn: {
          name: "删除",
          command: "comFormDel",
        },
      };
      const list = [
        "viewBtn",
        "editBtn",
        "fieldset",
        "design",
        "publish",
        "preview",
        "version",
        "copyBtn",
        "delBtn",
      ];
      const actions = [];

      list.forEach((item) => {
        if (this.permissionList[item]) {
          actions.push(map[item]);
        }
      });
      return actions;
    },
    handleCommand(command, row, index) {
      this[command](row, index);
    },
    htmlDecodeByRegExp(str) {
      let temp = "";
      if (validatenull(str)) return "";
      temp = str.replace(/&amp;/g, "&");
      temp = temp.replace(/&lt;/g, "<");
      temp = temp.replace(/&gt;/g, ">");
      temp = temp.replace(/&nbsp;/g, " ");
      // eslint-disable-next-line
      temp = temp.replace(/&#39;/g, "'");
      // eslint-disable-next-line
      temp = temp.replace(/&quot;/g, '"');
      return temp;
    },
    customNameFun(tag) {
      if (tag) {
        this.findObject(this.comFormOption.column, "name").display = true;
      } else {
        this.findObject(this.comFormOption.column, "name").display = false;
      }
    },
    rowSave(/*row, done, loading*/) {},
    rowUpdate(/*row, index, done, loading*/) {},
    rowDel(/*row*/) {},
    searchReset() {
      this.query = {};
      this.onLoad(this.page);
    },
    configColumn() {
      this.$refs.listRef.$refs.dialogColumn.columnBox = true;
    },
    searchChange() {
      this.query = {
        ...this.searchForm,
      };
      this.page.currentPage = 1;
      this.onLoad(this.page);
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
      }
      done();
    },
    beforeClose(done /*type*/) {
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
    initData(/*type*/) {},
    onLoad(page, params = {}) {
      this.loading = true;
      const dataParam = {
        ...params,
        ...this.activeType,
        ...this.query,
        current: page.currentPage,
        size: page.pageSize,
      };
      if (dataParam.verifyType == 999) {
        dataParam.allowAnonymousSubmit = 0;
        dataParam.verifyType = null;
      } else if (!validatenull(dataParam.verifyType)) {
        dataParam.allowAnonymousSubmit = 1;
      }

      getListData(dataParam).then((res) => {
        const dataRes = res.data.data;
        this.page.total = dataRes.total;
        this.page.pageSize = dataRes.size;
        this.page.currentPage = dataRes.current;
        this.listData = dataRes.records;
        this.listData.map((item) => {
          if (item.allowAnonymousSubmit == 0) {
            item.verifyType = 999;
            //console.log(item.name)
          }
        });

        this.loading = false;
        this.selectionClear();
      });
    },

    async getUseableFields({ systemCode, code }) {
      const params = {
        type: this.formType,
        systemCode,
        code,
      };
      const {
        data: { data },
      } = await getUseableFieldsList(params);

      this.useableFields = data;
    },
    async designForm(row) {
      this.curForm = row;
      if (row.formTemplateJson) {
        this.curFormJson = JSON.parse(row.formTemplateJson);
      } else {
        this.curFormJson = { column: [] };
      }
      await this.getUseableFields(row);

      if (row.systemCode === "AiCOS") {
        this.loadDicData = createDicRequest(
          "/aicos/api/aicos-system/baseDict/listPage"
        );
        this.dictItemUrl =
          "/aicos/api/aicos-system/baseDict/getDictItemListByDictCode";
      } else {
        const params = {
          systemCode: row.systemCode,
          key: "rmethod_dictListPage",
          // key: 'rmethod_dictItemListPage'
        };
        // 获取字典列表的地址
        const {
          data: { data: dicUrl },
        } = await getFormDictUrl(params);

        this.loadDicData = createDicRequest(dicUrl);

        const paramsItem = {
          systemCode: row.systemCode,
          // key: 'rmethod_dictListPage'
          key: "rmethod_dictItemListPage",
        };
        // 获取某一个字典的字典项的地址
        const {
          data: { data: dicItemUrl },
        } = await getFormDictUrl(paramsItem);

        this.dictItemUrl = dicItemUrl;
      }

      this.designDialogVisible = true;
    },
    // buidSubmitData(data) {
    //   let list = data.column
    //   if(data.group) {
    //     list = data.group.reduce((sum, item) => {
    //       return sum.concat(item.column)
    //     }, list)
    //   }
    //   const listClone = this.deepClone(list);
    //   listClone.forEach((item, index)=> {
    //     if(item.type === 'table') {
    //       const items = this.buildTableFieldData(item);
    //       listClone.splice(index, 1, ...items)
    //     }
    //   })
    //   list = listClone.filter(item=>{
    //     // 过滤掉类型为html的元素
    //     return item.type !== 'html'
    //   });
    //   // this.useableFields为空时需要处理prop
    //   if(this.useableFields.length === 0) {
    //     list.forEach(item=> {
    //       item.prop = `${item.dataType}_${item.prop}`
    //     })
    //   }
    //   const fields = list.map(item => {
    //     let type = ''
    //     if(getObjType(item.value) === 'string') {
    //       let match = item.value.match(/\${(\S+)}/)
    //       if(match && match[1]) {
    //         type = match[1]
    //       }
    //     }
    //     // if(item.value == '${currentUser}') {
    //     //   type = 'account'
    //     // }else if(item.value == '${currentUserDept}') {
    //     //   type = 'dept'
    //     // }
    //     // 含有给定默认值的字段，为只读字段
    //     // if(type) {
    //     //   item.readonly = true
    //     // }
    //     const res = {
    //       name: item.prop,
    //       dataType: item.dataType,
    //       // dataType: dataTypeMap[item.type],
    //       type,
    //       displayName: item.label,
    //       // group 中的字段没有search、isListDisplay
    //       isListSearch: !!item.search,
    //       isListDisplay: !!item.isListDisplay,
    //       formType: item.type
    //     }
    //     if(item.columnId) {
    //       res.columnId = item.columnId
    //     }
    //     return res
    //   })
    //   return {
    //     formTemplateFlatJson: JSON.stringify(fields),
    //     formTemplateJson: JSON.stringify({
    //       ...data,
    //       column: list,
    //     })
    //   }
    // },

    async saveFormDesign() {
      const formData = await this.$refs.formDesign.getData();

      const trans = this.buidSubmitData(formData);

      const submitData = {
        ...this.curForm,
        type: "dynamic",
        url: formData.custom,
        ...trans,
      };

      update(submitData).then(
        () => {
          this.$message({
            type: "success",
            message: "操作成功!",
          });
          // 数据回调进行刷新
          this.onLoad(this.page);
          this.designDialogVisible = false;
        },
        (error) => {
          window.console.log(error);
        }
      );
    },
    publishForm(row) {
      this.$confirm("确定发布表单?", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          return publish(row.id);
        })
        .then(() => {
          this.$message({
            type: "success",
            message: "发布成功!",
          });
          // 数据回调进行刷新
          this.onLoad(this.page);
        });
    },

    showVersionList(row) {
      this.curForm = row;
      this.versionDialogVisible = true;
    },
    comFormDesign(row) {
      this.ckTemplateData = {};
      if (row.status == 3) {
        //console.log('可以选模板');
        //console.log(row)
        this.ckTemplateData = row;
        this.ckTemplateTag = true;
      } else {
        this.designForm(row);
      }
      this.saveGoTo = "";
    },
    ckTemplateClose() {
      this.ckTemplateData = {};
      this.ckTemplateTag = false;
    },

    async comFormSaveSet() {
      await this.comFormSave();
      this.saveGoTo = "set";
    },
    async comFormSaveDesign() {
      await this.comFormSave();
      this.saveGoTo = "design";
    },

    async comFormSave() {
      //console.log(this.isCustomTable);
      this.btnLoading = true;

      this.$refs.comFormRef.validate(async (valid /*msg*/) => {
        //console.log(valid)
        if (valid) {
          if (this.isCustomTable) {
            this.comFormData.isCustomTable = 1;
            if (this.comFormSubType == "add") {
              if (this.comFormData.name.includes("dyf_aicos_")) {
                //console.log('包含dyf_aicos_')
              } else {
                this.comFormData.name = "dyf_aicos_" + this.comFormData.name;
              }
            }
          } else {
            this.comFormData.isCustomTable = 0;
            if (this.comFormSubType == "add") {
              this.comFormData.name = "huilan_base_form_data";
            }
          }

          if (this.comFormData.submitMethod == 0) {
            this.comFormData.verifyType = 0;
          }

          if (this.comFormSubType == "add") {
            //this.comFormData.name = 'dyf_'+this.comFormData.systemCode.toLowerCase()+'_'+ this.comFormData.name;

            const dataParam = {
              ...this.comFormData,
            };
            //console.log(dataParam);

            await addListData(dataParam).then(
              (res) => {
                const dataRes = res.data.data;
                this.btnLoading = false;
                this.comFormTag = false;
                this.refreshChange();

                const goToParam = {
                  isCustomTable: dataRes.isCustomTable,
                  ...dataRes.formTemplate,
                };

                if (this.saveGoTo == "set") {
                  this.comFormSetOpen(goToParam);
                }
                if (this.saveGoTo == "design") {
                  this.comFormDesign(goToParam);
                }

                this.$message({
                  type: "success",
                  message: "操作成功!",
                });
              },
              (error) => {
                window.console.log(error);
                this.btnLoading = false;
                this.$refs.comFormRef.allDisabled = false;
              }
            );
          } else if (this.comFormSubType == "update") {
            const dataParam = {
              ...this.comFormData,
            };

            updateListData(dataParam).then(
              () => {
                this.refreshChange();
                this.comFormTag = false;
                this.btnLoading = false;
                this.$message({
                  type: "success",
                  message: "操作成功!",
                });
              },
              (error) => {
                window.console.log(error);
                this.btnLoading = false;
                this.$refs.comFormRef.allDisabled = false;
              }
            );
          }
        } else {
          //console.log('error submit!!');
          this.btnLoading = false;
          return false;
        }
      });
    },
    comFormClose() {
      this.btnLoading = false;
      this.comFormData = {};
      this.comFormSubType = "";
      this.comFormTag = false;
    },
    comFormAdd() {
      this.comFormData = {};
      this.comFormReload++;
      this.comFormTitle = "新增通用表单";
      this.comFormClass = "";
      this.comFormShowItem("add");
      this.comFormSubType = "add";
      this.comFormSubBtnShow = true;
      this.comFormSubBtnShowGo = true;
      this.findObject(this.comFormOption.column, "name").prepend = "dyf_aicos_";
      this.findObject(this.comFormOption.column, "name").display = true;
      this.isCustomTable = true;
      this.findObject(
        this.comFormOption.column,
        "isCustomTable"
      ).display = true;
      this.isCustomTableDisabled = false;
      this.comFormTag = true;
    },
    comFormView(row /*index*/) {
      const dataParam = {
        id: row.id,
      };
      viewListData(dataParam).then(
        (res) => {
          this.comFormData = res.data.data;
          this.comFormData.desc = this.htmlDecodeByRegExp(
            this.comFormData.desc
          );
          this.comFormReload++;
          this.comFormTitle = "查看通用表单";
          this.comFormClass = "avue--view avue--detail";
          this.comFormShowItem("view");

          if (this.comFormData.verifyType != 0) {
            this.comFormData.submitMethod = 1;
            this.findObject(
              this.comFormOption.column,
              "submitMethod"
            ).display = true;
            this.findObject(
              this.comFormOption.column,
              "verifyType"
            ).display = true;
          }

          this.findObject(this.comFormOption.column, "name").display = true;

          this.isCustomTableDisabled = true;
          if (this.comFormData.isCustomTable == 1) {
            this.findObject(
              this.comFormOption.column,
              "isCustomTable"
            ).display = true;
          } else {
            this.findObject(
              this.comFormOption.column,
              "isCustomTable"
            ).display = false;
          }

          this.comFormSubType = "view";
          this.comFormSubBtnShow = false;
          this.comFormSubBtnShowGo = false;
          this.comFormTag = true;
        },
        (error) => {
          window.console.log(error);
        }
      );
    },
    comFormUpdate(row /*index*/) {
      const dataParam = {
        id: row.id,
      };
      viewListData(dataParam).then(
        (res) => {
          this.comFormData = res.data.data;
          this.comFormData.desc = this.htmlDecodeByRegExp(
            this.comFormData.desc
          );
          this.comFormReload++;
          this.comFormTitle = "编辑通用表单";
          this.comFormClass = "";
          this.comFormShowItem("update");

          if (this.comFormData.verifyType != 0) {
            this.comFormData.submitMethod = 1;
            this.findObject(
              this.comFormOption.column,
              "submitMethod"
            ).display = true;
            this.findObject(
              this.comFormOption.column,
              "verifyType"
            ).display = true;
          }

          this.isCustomTable =
            this.comFormData.isCustomTable == 1 ? true : false;
          this.isCustomTableDisabled = true;
          this.findObject(this.comFormOption.column, "name").display = true;

          this.comFormSubType = "update";
          this.comFormSubBtnShow = true;
          this.comFormSubBtnShowGo = false;
          this.comFormTag = true;
        },
        (error) => {
          window.console.log(error);
          this.comFormSubBtnShow = true;
          this.comFormSubBtnShowGo = false;
        }
      );
    },
    comFormDel(row /*index*/) {
      //console.log('删除');

      this.$confirm("确定将选择数据删除?", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          return delListData({
            id: row.id,
          });
        })
        .then(() => {
          this.$message({
            type: "success",
            message: "操作成功!",
          });
          this.refreshChange();
        });
    },
    comFormShowItem(actionType) {
      const formItems = this.comFormOption.column;
      formItems.map((item) => {
        if (actionType == "view") {
          item.disabled = true;

          if (item.prop == "name") {
            item.prepend = null;
          }
        } else {
          item.disabled = false;
          if (actionType == "update" && item.prop == "name") {
            item.disabled = true;
            item.prepend = null;
          }
        }
      });
    },
    comFormSetOpen(row /*index*/) {
      //console.log('配置');
      this.comFormSetData = row;
      this.comFormSetTag = true;
      this.comFormSetKey++;
      this.saveGoTo = "";
    },
    comFormSetClose() {
      //console.log('关闭配置');
      this.comFormSetTag = false;
      this.comFormSetKey++;
      this.refreshChange();
    },
    versionClose() {
      this.versionDialogVisible = false;
    },

    async comFormPreview(row /*,index*/) {
      //console.log('使用');
      await this.comFormPreviewInit(row, true);
      this.previewTag = true;
    },

    async comFormPreviewInit(row, canImg) {
      this.previewFormObj = {};
      this.previewUrlImg = "";
      this.previewUrlAdd = "";
      this.previewUrlMag = "";
      this.previewUrlMagTag = false;
      this.previewShowAdd = false;

      const dataResFun = await getFromTemplateNewest({
        metaObjName: row.code,
      });
      const dataRes = dataResFun.data.data;
      this.newestTemplateVersionId = dataRes.id;
      if (dataRes.isAllowFrontSubmit == 1) {
        this.previewShowAdd = true;
      }

      const defaultAddUrl =
        window.location.origin +
        `${baseURL}` +
        "#/comFormDataAdd?templateId=" +
        this.newestTemplateVersionId +
        "&metObjName=" +
        row.code +
        "&systemCode=" +
        row.systemCode;
      const defaultMagUrl =
        window.location.origin +
        `${baseURL}` +
        "#/system/commonForm/comFormDataMag?templateId=" +
        this.newestTemplateVersionId +
        "&metObjName=" +
        row.code +
        "&systemCode=" +
        row.systemCode;
      //console.log(defaultAddUrl);
      const dataParam = {
        id: this.newestTemplateVersionId,
        imageInlcuded: canImg,
        defaultSubmissionUrl: defaultAddUrl,
      };
      await previewListData(dataParam).then(
        (res) => {
          //console.log(res);
          const dataRes = res.data.data;
          this.previewTitle = row.name;
          this.previewFormObj = row;
          this.previewUrlImg = dataRes.submissionQrImage;
          this.previewUrlAdd = dataRes.submissionUrl;
          if (!validatenull(dataRes.managementUrl)) {
            let zUrl =
              "&templateId=" +
              this.newestTemplateVersionId +
              "&metObjName=" +
              row.code +
              "&systemCode=" +
              row.systemCode;
            let openUrl = dataRes.managementUrl.includes("?")
              ? dataRes.managementUrl + zUrl
              : dataRes.managementUrl + "?" + zUrl;
            this.previewUrlMag = openUrl;
            this.previewUrlMagTag = true;
          } else {
            this.previewUrlMag = defaultMagUrl;
            this.previewUrlMagTag = false;
          }
        },
        (error) => {
          window.console.log(error);
        }
      );
    },

    previewClose() {
      this.previewFormObj = {};
      this.previewUrlImg = "";
      this.previewUrlAdd = "";
      this.previewUrlMag = "";
      this.previewTag = false;
    },
    previewCopy(copyType) {
      let goUrl = "";
      if (copyType == "add") {
        goUrl = this.previewUrlAdd;
      } else if (copyType == "mag") {
        goUrl = this.previewUrlMag;
      }

      this.$Clipboard({
        text: goUrl,
      })
        .then(() => {
          this.$message.success("复制成功");
        })
        .catch(() => {
          this.$message.error("复制失败");
        });
    },
    previewGoto(goToType) {
      //console.log("前往");
      //console.log(goToType);

      if (goToType == "mag") {
        if (this.previewUrlMagTag) {
          window.open(this.previewUrlMag);
        } else {
          if (this.desktop) {
            const formWinParm = {
              menuName: "数据管理 [" + this.previewFormObj.name + "]",
              imageUrl: "iconfont iconicon_principal",
              linkUrl: "/system/commonForm/comFormDataMag",
              query: {
                templateId: this.newestTemplateVersionId,
                metObjName: this.previewFormObj.code,
                systemCode: this.previewFormObj.systemCode,
              },
              height: "100%",
              width: "100%",
            };

            const formWin = {
              visible: true,
              zIndex: this.desktop.winList.length + this.desktop.baseZindex,
              data: formWinParm,
              commonParm: "comFormWin",
            };

            //删除已打开的comFormWin窗口
            if (
              this.desktop.winList.filter(
                (item) => item.commonParm == "comFormWin"
              ).length > 0
            ) {
              this.desktop.winList = this.desktop.winList.filter(
                (item) => item.commonParm != "comFormWin"
              );
            }

            this.desktop.winList.push(formWin);

            this.previewTag = false;
          } else {
            this.$router.push({
              path: "./comFormDataMag",
              query: {
                templateId: this.newestTemplateVersionId,
                metObjName: this.previewFormObj.code,
                systemCode: this.previewFormObj.systemCode,
              },
            });
            this.previewTag = false;
          }
        }

        //this.$emit("versionClose");
      } else if (goToType == "add") {
        window.open(this.previewUrlAdd);
      }
    },
    comFormClone(row) {
      this.loading = true;
      cloneForm({
        srcTemplateId: row.id,
      }).then((res) => {
        this.$message({
          type: "success",
          message:
            "复制成功，新表单名称为 [ " +
            res.data.data.destDisplayName +
            " ] ，请修改操作!",
        });
        this.page.currentPage = 1;
        this.refreshChange();
      });
    },
    getUploadBgHeader() {
      return {
        [website.tokenHeader]: getToken(),
      };
    },
  },
  mounted() {},
};
</script>

<style lang="scss" scoped>
.newCss {
  position: relative;
  height: 100%;
  .menuTitle {
    position: absolute;
    top: 30px;
    left: 40px;
    font-size: 22px;
    font-weight: 500;
    z-index: 2;
  }
  /deep/.avue-crud__search .avue-form__group {
    justify-content: flex-end;
  }
  /deep/.avue-crud__search .avue-form__menu {
    width: 240px;
  }
  /deep/.el-card__body .avue-crud__menu {
    justify-content: flex-end;
  }

  .com_form_set {
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    min-height: 875px;
    background-color: #fff;
    z-index: 4;
  }

  /deep/.comFormSlide-enter-active,
  /deep/.comFormSlide-leave-active {
    transition: transform 0s;
  }
  /deep/.comFormSlide-enter,
  /deep/.comFormSlide-leave-to {
    transform: translateX(100%);
  }
}

.prv_w {
}
.prv_img {
  position: relative;
  width: 260px;
  height: 220px;
  margin: 0 auto;
}
.prv_img_border {
}

.prv_img_border span {
  position: absolute;
  width: 33px;
  height: 33px;
  border-width: 4px;
  color: #0073eb;
  border-style: solid;
  border-radius: 3px;
}
.prv_img_border span:first-child {
  left: 0;
  top: 0;
  border-right: 0;
  border-bottom: 0;
}
.prv_img_border span:nth-child(2) {
  right: 0;
  top: 0;
  border-left: 0;
  border-bottom: 0;
}
.prv_img_border span:nth-child(3) {
  bottom: 0;
  left: 0;
  border-right: 0;
  border-top: 0;
}
.prv_img_border span:nth-child(4) {
  bottom: 0;
  right: 0;
  border-left: 0;
  border-top: 0;
}

.prv_img img {
  width: 160px;
  height: 160px;
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  object-fit: contain;
  background-color: #f5f5f5;
}

.prv_btn {
  margin-top: 30px;
  padding-left: 20px;
}
.prv_btn > span {
  margin-right: 15px;
}

.form-design-dialog {
  /deep/ .el-dialog__body {
    height: calc(100% - 120px);
    padding: 0;
  }
}
</style>
