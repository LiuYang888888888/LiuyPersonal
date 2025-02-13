<template>
  <div class="newCss">
    <el-tabs v-if="formVerify" v-model="tabType" @tab-click="tabChange">
      <el-tab-pane name="ALL">
        <span slot="label"><i class="el-icon-s-order"></i> 全部</span>
      </el-tab-pane>
      <el-tab-pane name="TODO" v-if="permissionList.toDoBtn">
        <span slot="label"><i class="el-icon-s-management"></i> 待审核</span>
      </el-tab-pane>
      <el-tab-pane name="DONE" v-if="permissionList.doneBtn">
        <span slot="label"><i class="el-icon-s-claim"></i> 已审核</span>
      </el-tab-pane>
    </el-tabs>

    <div :class="formVerify ? 'menuTitle' : 'menuTitleV'">
      {{ formName }}
      <!----{{magParamsData.templateId}} -->
    </div>
    <!-- <HuilanBasicToolbar style="margin-top: 0">
      <el-button
        v-if="permissionList.addMagBtn"
        type="primary"
        size="small"
        @click="comFormMagAdd"
        >新增</el-button
      >
      <el-button
        type="primary"
        size="small"
        icon="el-icon-upload2"
        v-if="
          permissionList.inMagBtn &&
          ((formVerify && tabType == 'ALL') || !formVerify)
        "
        @click="comFormMagIn"
        >导入数据
      </el-button>

      <el-button
        type="primary"
        size="small"
        icon="el-icon-download"
        v-if="
          permissionList.outMagBtn &&
          ((formVerify && tabType == 'ALL') || !formVerify)
        "
        @click="comFormMagBatchOut"
        >导出全部
      </el-button>

      <el-button
        type="danger"
        size="small"
        icon="el-icon-delete"
        v-if="
          permissionList.deleteMagBtn &&
          ((formVerify && tabType == 'ALL') || !formVerify)
        "
        @click="comFormMagBatchDel"
        >批量删除
      </el-button>
    </HuilanBasicToolbar> -->
    <avue-form
      :class="searchMagFormClass"
      :option="searchMagFormOption"
      ref="searchMagFormRef"
      v-model="searchMagFormData"
      :key="searchMagFormkey"
    >
      <template slot-scope="{ size }" slot="menuForm">
        <div class="search-from-tool">
          <el-button
            type="primary "
            size="small"
            icon="el-icon-search"
            @click.stop="searchMagFormSubmit()"
          >
          </el-button>
          <el-button
            size="small"
            icon="aicosicon aicos-icon-clear"
            @click.stop="searchMagFormReset()"
          >
          </el-button>
          <el-button
            type="text"
            size="small"
            icon="el-icon-arrow-down"
            @click.stop="searchMagFormShowAll()"
            v-if="searchMagFormShowTag"
            >展 开
          </el-button>
          <el-button
            type="text"
            size="small"
            icon="el-icon-arrow-up"
            @click.stop="searchMagFormHideAll()"
            v-if="searchMagFormHideTag"
            >收 缩
          </el-button>
        </div>
      </template>
    </avue-form>

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
      @search-change="searchChange"
      @search-reset="searchReset"
      @selection-change="selectionChange"
      @current-change="currentChange"
      @size-change="sizeChange"
      @refresh-change="refreshChange"
      @on-load="onLoad"
    >
      <template slot-scope="scope" slot="menuRight">
        <el-button
          type="primary"
          size="small"
          icon="el-icon-plus"
          v-if="permissionList.addMagBtn && !permissionList.jiaBtn"
          @click.stop="comFormMagAdd()"
          >新 增
        </el-button>
        <el-button
          type="primary"
          size="small"
          icon="el-icon-plus"
          v-if="permissionList.jiaBtn"
          @click.stop="comFormMagJia()"
          >新 增
        </el-button>
        <el-button
          type="primary"
          size="small"
          icon="el-icon-upload2"
          v-if="
            permissionList.inMagBtn && !permissionList.jiaBtn &&
            ((formVerify && tabType == 'ALL') || !formVerify)
          "
          @click.stop="comFormMagIn()"
          >导入数据
        </el-button>
        <!-- <el-button
          type="primary"
          size="small"
          icon="el-icon-download"
          v-if="permissionList.outMagBtn"
          @click.stop="comFormMagSelectOut()"
          >导出所选
        </el-button> -->
        <el-button
          type="primary"
          size="small"
          icon="el-icon-download"
          v-if="
            permissionList.outMagBtn && !permissionList.jiaBtn &&
            ((formVerify && tabType == 'ALL') || !formVerify)
          "
          @click.stop="comFormMagBatchOut()"
          >导出全部
        </el-button>
        <el-button
          type="danger"
          size="small"
          icon="el-icon-delete"
          v-if="
            permissionList.deleteMagBtn &&
            ((formVerify && tabType == 'ALL') || !formVerify)
          "
          @click.stop="comFormMagBatchDel()"
          >批量删除
        </el-button>
      </template>

      <!-- <template slot-scope="scope" slot="menu">
        <el-button
          type="text"
          size="small"
          icon="el-icon-view"
          v-if="
            permissionList.viewMagBtn &&
            ((formVerify && tabType != 'TODO') || !formVerify)
          "
          @click.stop="comFormMagView(scope.row, scope.index)"
          >查看
        </el-button>
        <el-button
          type="text"
          size="small"
          icon="el-icon-s-check"
          v-if="permissionList.updateMagBtn && formVerify && tabType == 'TODO'"
          @click.stop="comFormMagVerify(scope.row, scope.index)"
          >审核
        </el-button>
        <el-button
          type="text"
          size="small"
          icon="el-icon-edit"
          v-if="permissionList.updateMagBtn && !formVerify"
          @click.stop="comFormMagUpdate(scope.row, scope.index)"
          >编辑
        </el-button>
        <el-button
          type="text"
          size="small"
          icon="el-icon-delete"
          v-if="
            permissionList.deleteMagBtn &&
            ((formVerify && tabType == 'ALL') || !formVerify)
          "
          @click.stop="comFormMagDel(scope.row, scope.index)"
          >删除
        </el-button>
        <el-button
          type="text"
          size="small"
          icon="el-icon-download"
          v-if="permissionList.outMagBtn"
          @click.stop="comFormMagOut(scope.row, scope.index)"
          >导出
        </el-button>
        <el-button
          type="text"
          size="small"
          icon="el-icon-printer"
          v-if="permissionList.printMagBtn"
          @click.stop="comFormMagPrint(scope.row, scope.index)"
          >打印
        </el-button>
      </template> -->
      <template v-slot:menu="scope">
        <HuilanBasicActionTool
          :actions="getRowActions(scope.row)"
          @command="handleCommand($event, scope.row, scope.index)"
        />
      </template>
      <template v-slot:search="scope">
        <!-- v-model="search.字段名" -->
      </template>
    </avue-crud>

    <HuilanDialog
      :title="dataMagFormTitle"
      :fullscreen="true"
      append-to-body
      :before-close="dataMagFormClose"
      :visible.sync="dataMagFormTag"
      class="dataMagFormClass"
    >
      <el-tabs
        v-if="
          formVerify &&
          (tabType == 'TODO' || tabType == 'DONE') &&
          dataMagFormSubType != 'add'
        "
        v-model="verifyTab"
        @tab-click="verifyChange"
      >
        <el-tab-pane name="VIEW">
          <span slot="label"><i class="el-icon-s-operation"></i> 数据详情</span>
        </el-tab-pane>
        <el-tab-pane name="HISTORY" lazy>
          <span slot="label"><i class="el-icon-s-unfold"></i> 流转历史</span>
          <CirculationHistory
            v-if="verifyTab === 'HISTORY'"
            :processInstanceId="verifyParamData.processInstanceId"
          />
        </el-tab-pane>
        <el-tab-pane name="DIAGRAM" lazy>
          <span slot="label"
            ><i class="el-icon-picture-outline"></i> 流程图</span
          >
          <DiagramView
            v-if="verifyTab === 'DIAGRAM'"
            :cur="verifyParamData"
            class="flow-view"
          />
        </el-tab-pane>
      </el-tabs>

      <div class="dataMagFormBody" v-if="verifyTab == 'VIEW'">
        <div class="CMF_MAIN">
          <div class="CMF_HEAD">
            <span>{{ formName }}</span>
          </div>
          <div class="CMF_BODY">
            <FormPreview
              id="dataMagFormView"
              ref="dataMagFormRef"
              :option="dataMagFormOption"
              :class="dataMagFormClass"
              :formTemplateFlatJson="dataMagFormFlatJson"
              :formTemplateOnetomanyFlatJson="formTemplateOnetomanyFlatJson"
              :data.sync="dataFormData"
              :formDataColumn="formDataColumn"
              :key="dataMagFormKey"
            />
          </div>
          <div class="CMF_FOOT"></div>
          <div class="CMF_CUST" id="CMF_CUST">
            <div id="cmfCustDataRef" ref="cmfCustDataRef" v-html="cmfCustData">
              <!-- {{ cmfCustData }} -->
            </div>
          </div>
        </div>

        <div class="dataMagFormFooter">
          <div
            v-if="formVerify && tabType == 'TODO' && dataMagFormSubType != 'add'"
            class="formVerifyClass"
          >
            <el-input
              type="textarea"
              v-model="formVerifyText"
              placeholder="请输入审核意见"
              rows="4"
            />
          </div>
          <div class="dataMagFormBtns">
            <el-button
              size="small"
              icon="el-icon-printer"
              plain
              type="primary"
              @click="dataMagFormPrint"
              >打 印
            </el-button>
            <el-button
              size="small"
              icon="el-icon-check"
              v-if="
                formVerify && tabType == 'TODO' && dataMagFormSubType != 'add'
              "
              type="success"
              @click.stop="dataMagVerifyYes"
              :loading="btnLoading"
              >审核通过
            </el-button>
            <el-button
              size="small"
              icon="el-icon-close"
              v-if="formVerify && tabType == 'TODO' && dataMagFormSubType != 'add'"
              type="warning"
              @click.stop="dataMagVerifyNo"
              :loading="btnLoading"
              >审核不通过
            </el-button>
            <el-button
              size="small"
              icon="el-icon-circle-plus-outline"
              v-if="
                dataMagFormSubBtnTag &&
                (!formVerify || (formVerify && dataMagFormSubBtnTag))
              "
              type="primary"
              @click="dataMagFormSave"
              :loading="btnLoading"
              >确 定
            </el-button>
            <el-button
              size="small"
              icon="el-icon-circle-close"
              @click="dataMagFormClose"
              >取 消
            </el-button>
          </div>
        </div>
      </div>
    </HuilanDialog>

    <HuilanDialog
      :title="dataInTitle"
      :fullscreen="false"
      width="660px"
      append-to-body
      :visible.sync="dataInTag"
    >
      <avue-form
        :class="inFormClass"
        :option="inFormOption"
        ref="inFormRef"
        v-model="inFormData"
        :key="inFormKey"
      >
        <template slot-scope="scope" slot="templateFile">
          <el-button
            type="primary"
            size="small"
            icon="el-icon-download"
            @click.stop="templateFileDown"
            >数据模板下载</el-button
          >
        </template>
        <template slot-scope="scope" slot="excelFile">
          <!-- <div>{{scope}}</div> -->
          <HuilanUploader
            class="upload-demo"
            v-model="inFormData.excelFile"
            :data="scope.column.data"
            :action="scope.column.action"
            :accept="scope.column.accept"
            :multiple="scope.column.multiple"
            :limit="scope.column.limit"
            :drag="scope.column.dragFile"
            :on-success="inFormUploadAfter"
            :on-error="inFormUploadError"
            :before-upload="inFormUploadBefore"
          >
            <i class="el-icon-upload"></i>
            <div class="el-upload__text">
              将文件拖到此处，或<em>点击上传</em>
            </div>
            <div class="el-upload__tip" slot="tip">{{ scope.column.tip }}</div>
          </HuilanUploader>
        </template>
      </avue-form>

      <template v-slot:footer>
        <!-- <el-button size="small" icon="el-icon-circle-plus-outline" type="primary" @click="dataInSave">确 定</el-button> -->
        <el-button size="small" icon="el-icon-circle-close" @click="dataInClose"
          >取 消</el-button
        >
      </template>
    </HuilanDialog>

    <!--考勤表单下发新增-->
    <HuilanDialog
      :title="kaoqinTitle"
      :fullscreen="false"
      width="660px"
      append-to-body
      :visible.sync="kaoqinTag"
    >
      <div class="kqtitle">
        <div class="kqtxt">标题：</div>
        <el-input v-model="kqtitle" placeholder="请输入标题内容"></el-input>
      </div>

      <el-table
        :data="tableData"
        border
        style="width: 100%">
        <el-table-column
          align="center"
          label="处室名称"
          width="180">
          <template slot-scope="{ row }">
            <span v-show="!row.editid">{{ row.chushi }}</span>
            <el-input v-show="row.editid" v-model="row.chushi"></el-input>
          </template>
        </el-table-column>

        <el-table-column
          align="center"
          label="月份"
          width="180">
          <template slot-scope="{ row }">
            <span v-show="!row.editid">{{ row.month }}</span>
            <el-input v-show="row.editid" v-model="row.chushi"></el-input>
          </template>
        </el-table-column>
        <el-table-column
          prop="khnum"
          label="考核人数">
        </el-table-column>
        <el-table-column
          prop="goodnum"
          label="“好”人数">
        </el-table-column>
        <el-table-column
          prop="beizhu"
          label="备注">
        </el-table-column>
      </el-table>

    </HuilanDialog>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import { validatenull } from "@/util/validate";
// import { getRules } from "@/util/regx";
import { baseURL } from "@/api/common";
import serviceList from "@/config/serviceList";
import { dateFormat } from "@/util/date";
import {
  getFromTemplate,
  getFieldListData,
  getListData,
  delListData,
  viewListData,
  saveOrUpdateListData,
  getFromTemplateNewest,
  outListData,
  //inListData,
  inTemplateFile,
  customFormList,
  getToDoListData,
  getFinishListData,
  flowYes,
  flowNo,
  getNodeEditStatus,
} from "@/api/system/commonFormData";

import FormPreview from "@/components/formPreview";

import DiagramView from "./diagramView";
import CirculationHistory from "./circulationHistory";

import HuilanUploader from "@/components/uploader";

import { findNodeByVal, isNull } from "@/util/qsgCommon";

export default {
  name: "通用表单数据管理",
  inject: ["desktopWindow", "desktop"],
  components: {
    FormPreview,
    DiagramView,
    CirculationHistory,
    HuilanUploader,
  },
  props: {
    magParamsData: {
      type: Object,
      default() {
        return {};
      },
    },
  },
  computed: {
    ...mapGetters(["permission"]),
    permissionList() {
      return {
        addMagBtn: this.vaildData(
          this.permission[`sys-commonForm-dataMag-add`],
          false
        ),
        viewMagBtn: this.vaildData(
          this.permission[`sys-commonForm-dataMag-view`],
          false
        ),
        deleteMagBtn: this.vaildData(
          this.permission[`sys-commonForm-dataMag-delete`],
          false
        ),
        updateMagBtn: this.vaildData(
          this.permission[`sys-commonForm-dataMag-update`],
          false
        ),
        outMagBtn: this.vaildData(
          this.permission[`sys-commonForm-dataMag-out`],
          false
        ),
        printMagBtn: this.vaildData(
          this.permission[`sys-commonForm-dataMag-print`],
          false
        ),
        inMagBtn: this.vaildData(
          this.permission[`sys-commonForm-dataMag-in`],
          false
        ),
        toDoBtn: this.vaildData(
          this.permission[`sys-commonForm-dataMag-toDo`],
          false
        ),
        doneBtn: this.vaildData(
          this.permission[`sys-commonForm-dataMag-done`],
          false
        ),
        detailBtn: this.vaildData(
          this.permission[`sys-commonForm-dataMag-detail`],
          false
        ),
        editMagBtn: this.vaildData(
          this.permission[`sys-commonForm-dataMag-edit`],
          false
        ),
        xiafaBtn: this.vaildData(
          this.permission[`sys-commonForm-dataMag-xiafa`],
          false
        ),
        mingxiBtn: this.vaildData(
          this.permission[`sys-commonForm-dataMag-mingxi`],
          false
        ),
        huizongBtn: this.vaildData(
          this.permission[`sys-commonForm-dataMag-huizong`],
          false
        ),
        jiaBtn: this.vaildData(
          this.permission[`sys-commonForm-dataMag-jia`],
          false
        ),
      };
    },
  },
  data() {
    return {
      kaoqinTitle:'下发通知',
      kaoqinTag:false,
      kqtitle:'',
      formVerify: false,
      tabType: "ALL",
      formVerifyText: "",
      verifyTab: "VIEW",
      verifyParamData: {},
      btnLoading: false,

      templateId: "",
      metObjName: "",
      systemCode: "",
      formName: "通用表单",
      cmfCustData: "",
      isCustomTable: 0,

      loading: false,
      page: {
        pageSize: 10,
        currentPage: 1,
        total: 0,
        pageSizes: [10, 20, 30, 40, 50, 100],
      },
      listForm: {},
      selectionList: [],
      query: {},
      listData: [],
      listOption: {
        tip: false,
        calcHeight: 65,
        searchShow: false,
        searchClearable: false,
        dialogWidth: 800,
        index: true,
        selection: true,
        addBtn: false,
        editBtn: false,
        viewBtn: false,
        delBtn: false,
        menuWidth: 260,
        menuAlign: "center",
        menuFixed: "right",
        dialogClickModal: false,
        saveBtn: false,
        updateBtn: false,
        span: 24,

        border: true,
        searchIndex: 1,
        searchIcon: true,
        searchSpan: 4,
        searchMenuSpan: 3,
        searchMenuPosition: "right",
        //excelBtn:true,

        column: [
          {
            label: "ID",
            prop: "id",
            search: true,
          },
          {
            label: "Name",
            prop: "name",
            search: true,
          },
        ],
      },

      dataMagFormTitle: "通用表单",
      dataMagFormTag: false,
      dataMagFormSubBtnTag: true,
      dataMagFormSubType: "add",

      dataMagFormOption: {
        submitBtn: false,
        emptyBtn: false,
        column: [],
      },
      dataMagFormFlatJson: [],
      formTemplateOnetomanyFlatJson: {},

      dataFormData: {},
      formDataColumn: [],

      formField: {},

      //dataMagFormClass:"avue--view avue--detail",
      dataMagFormClass: "",
      dataMagFormKey: 0,
      dataInitId: null,
      dataInitTemplateId: "",
      tempNewestOption: {},
      tempNewestSearchOption: {},

      searchMagFormOption: {
        //submitText:'搜索',
        submitBtn: false,
        emptyBtn: false,
        menuSpan: 3,
        menuPosition: "right",
        column: [],
      },
      searchMagFormData: {},
      searchMagFormkey: 0,

      searchMagFormClass: "rightSearch",
      searchShowIndex: 0,
      searchMagFormShowTag: true,
      searchMagFormHideTag: false,

      dataInTitle: "导入数据",
      dataInTag: false,
      inFormClass: "",
      inFormKey: 0,
      inFormData: {},
      inFormOption: {
        submitBtn: false,
        emptyBtn: false,
        labelWidth: 120,
        column: [
          {
            label: "下载数据模板",
            prop: "templateFile",
            span: 24,
            formslot: true,
          },
          {
            label: "选择文件",
            prop: "excelFile",
            span: 24,
            formslot: true,
            multiple: false,
            type: "upload",
            dragFile: true,
            data: {
              metaObjName: "",
              systemCode: "",
              templateVersionId: "",
            },
            propsHttp: {
              url: "url",
              name: "name",
              res: "data",
            },
            accept:
              "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel",
            //fileSize: 512,
            limit: 1,
            tip: "只能上传格式为xls、xlsx等EXECL文件",
            action: `${baseURL}api/${serviceList.form}/baseMetaCommon/importExcel`,
            rules: [
              {
                required: true,
                message: "请上传数据文件",
                trigger: "blur",
              },
            ],
          },
        ],
      },

      customAddUrl: "",
      customViewUrl: "",
      customUpdateUrl: "",

      allColumnArr: [],
    };
  },
  methods: {
    getRowActions() {
      let map = {}
      let list = []
      if(this.metObjName == 'dyf_aicos_gongwykhzzbxftz'){
        list = ['editMagBtn','detailBtn']
        map = {
          editMagBtn: {
            name: "编辑",
            command: "comFormMagEdit",
          },
          detailBtn: {
            name: "详情",
            command: "comFormMagDetail",
          },
        };

        if (this.permissionList.xiafaBtn) {
          map.xiafaBtn = {
            name: "下发",
            command: "comFormMagXiafa",
          };
          list.push("xiafaBtn");
        }

        if ((this.formVerify && this.tabType == "ALL") || !this.formVerify) {
          map.deleteMagBtn = {
            name: "删除",
            command: "comFormMagDel",
          };
          if (this.formVerify) {
            list.splice(1, 0, "deleteMagBtn");
          } else {
            list.splice(2, 0, "deleteMagBtn");
          }
        }

        if (this.permissionList.mingxiBtn) {
          map.mingxiBtn = {
            name: "明细下载",
            command: "comFormMagMingxi",
          };
          list.push("mingxiBtn");
        }

        if (this.permissionList.huizongBtn) {
          map.huizongBtn = {
            name: "汇总下载",
            command: "comFormMagHuizong",
          };
          list.push("huizongBtn");
        }
      }else{
        map = {
          outMagBtn: {
            name: "导出",
            command: "comFormMagOut",
          },
          printMagBtn: {
            name: "打印",
            command: "comFormMagPrint",
          },
        };
        list = ["outMagBtn", "printMagBtn"];
        if ((this.formVerify && this.tabType != "TODO") || !this.formVerify) {
          map.viewMagBtn = {
            name: "查看",
            command: "comFormMagView",
          };
          list.unshift("viewMagBtn");
        }
        if (this.formVerify && this.tabType == "TODO") {
          map.updateMagBtn = {
            name: "审核",
            command: "comFormMagVerify",
          };
          list.unshift("updateMagBtn");
        }
        if (!this.formVerify) {
          map.updateMagBtn = {
            name: "编辑",
            command: "comFormMagUpdate",
          };
          list.splice(1, 0, "updateMagBtn");
        }
        if ((this.formVerify && this.tabType == "ALL") || !this.formVerify) {
          map.deleteMagBtn = {
            name: "删除",
            command: "comFormMagDel",
          };
          if (this.formVerify) {
            list.splice(1, 0, "deleteMagBtn");
          } else {
            list.splice(2, 0, "deleteMagBtn");
          }
        }
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
      this[command](row, index);
    },
    tabChange() {
      //console.log(this.tabType);
      this.query = {};
      this.page.currentPage = 1;
      this.onLoad(this.page);
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
    async getActiveForm() {
      this.tabType = "ALL";
      this.formVerifyText = "";
      this.verifyTab = "VIEW";

      //console.log(this.$route)
      if (
        this.magParamsData.templateId &&
        this.magParamsData.metObjName &&
        this.magParamsData.systemCode
      ) {
        //console.log('Data传参');
        this.templateId = this.magParamsData.templateId;
        this.metObjName = this.magParamsData.metObjName;
        this.systemCode = this.magParamsData.systemCode;
      } else {
        //console.log('不是Data传参 尝试query URL传参');
        if (this.desktop) {
          this.templateId = this.desktopWindow.data.query.templateId;
          this.metObjName = this.desktopWindow.data.query.metObjName;
          this.systemCode = this.desktopWindow.data.query.systemCode;
        } else {
          if (
            this.$route.query.templateId &&
            this.$route.query.metObjName &&
            this.$route.query.systemCode
          ) {
            this.templateId = this.$route.query.templateId;
            this.metObjName = this.$route.query.metObjName;
            this.systemCode = this.$route.query.systemCode;
          }
        }
      }

      if (
        validatenull(this.templateId) ||
        validatenull(this.metObjName) ||
        validatenull(this.systemCode)
      ) {
        return false;
      }

      const customParam = {
        metObjName: this.metObjName,
        systemCode: this.systemCode,
      };
      await customFormList(customParam).then((res) => {
        const dataRes = res.data.data;
        //console.log(dataRes);
        dataRes.map((item) => {
          if (item.type == 3) {
            this.customAddUrl = item.value;
          }
          if (item.type == 4) {
            this.customUpdateUrl = item.value;
          }
          if (item.type == 5) {
            this.customViewUrl = item.value;
          }
        });

        //console.log(this.customAddUrl)
        //console.log(this.customUpdateUrl)
        //console.log(this.customViewUrl)
      });
      
      await this.getTemplateNewestVersion(this.metObjName);

      const FieldParam = {
        metaObjName: this.metObjName,
        systemCode: this.systemCode,
        enabled: 1,
        current: 1,
        size: 9999,
      };
      await getFieldListData(FieldParam).then((res) => {
        const fieldRes = res.data.data.records;

        const fieldListColumn = [];
        const fieldSearchColumn = [];
        fieldRes.map((item) => {
          if (item.formIsList) {
            fieldListColumn.push({
              label: item.displayName,
              prop: item.name,
              templateFieldName:
                this.isCustomTable == 0
                  ? item.name
                  : item.type + "_" + item.name,
              //search: (item.formIsQuery==1),
              search: false,
              hide: !item.formIsList,
              order: item.formListOrder,
              width: item.formListWidth,
              dataType: "",
            });
          }

          if (item.formIsQuery) {
            fieldSearchColumn.push({
              label: item.displayName,
              prop: item.name,
              templateFieldName:
                this.isCustomTable == 0
                  ? item.name
                  : item.type + "_" + item.name,
              formQueryCond: item.formQueryCond,
              span: 4,
              type:
                item.formUiComponent == "text" ? "input" : item.formUiComponent,
              //type:((item.formQueryCond=='between')?'array':item.formUiComponent),
              //value:((item.formQueryCond=='between')?[0,1]:null),
              order: item.formQueryOrder,
              display: false,
              rules: [],
              clearable: true,
            });
          }
        });
        const listOptionColumn = [];
        //let listColumnArr = [];

        this.allColumnArr = [];

        let tempColumnArr = [];

        tempColumnArr = tempColumnArr.concat(
          this.dataMagNewestFormOption.column
        );
        if (!validatenull(this.dataMagNewestFormOption.group)) {
          this.dataMagNewestFormOption.group.map((item) => {
            tempColumnArr = tempColumnArr.concat(item.column);
          });
        }

        if (!isNull(tempColumnArr)) {
          tempColumnArr.map((item) => {
            //console.log('item.type',item.type)
            if (item.type == "table") {
              let cellArr = item.data.flat(2);
              if (!isNull(cellArr)) {
                cellArr.map((info) => {
                  if (!isNull(info.children)) {
                    info.children.map((mh) => {
                      this.allColumnArr.push(mh);
                    });
                  }
                });
              }
            } else {
              this.allColumnArr.push(item);
            }
          });
        }

        //listColumnArr = this.allColumnArr;
        //console.log(listColumnArr);

        let searchColumnArr = [];
        searchColumnArr = searchColumnArr.concat(
          this.tempNewestSearchOption.column
        );
        if (!validatenull(this.tempNewestSearchOption.group)) {
          this.tempNewestSearchOption.group.map((item) => {
            searchColumnArr = searchColumnArr.concat(item.column);
          });
        }

        fieldListColumn.map((item) => {
          //console.log(listColumnArr);
          const itemJson = this.initColumnData(
            item,
            this.deepClone(this.allColumnArr)
          );

          if (itemJson.type == "map") {
            itemJson.formatter = (val, value /*,label*/) => {
              // console.log(val,value)
              // console.log( typeof value )
              // console.log( typeof label )

              let valueText = "--";
              if (!validatenull(value)) {
                let valueArr = value.split(",");
                valueText = valueArr[valueArr.length - 1];
              }
              return valueText;
            };
          }

          listOptionColumn.push(itemJson);
        });

        const searchOptionColumn = [];
        const searchOrder = [];
        fieldSearchColumn.map((item) => {
          //console.log(searchColumnArr);
          const itemJson = this.initSearchData(
            item,
            this.deepClone(this.allColumnArr)
          );
          searchOptionColumn.push(itemJson);
          searchOrder.push(itemJson.order);
        });

        //console.log(listOptionColumn);
        //console.log(searchOptionColumn);
        //console.log(searchOrder);
        //let maxIndex = 0;
        let minIndex = 0;
        let tempMaxVal = 0;
        searchOrder.map((key /*,index*/) => {
          if (key > tempMaxVal) {
            //maxIndex  = index ;
            tempMaxVal = key;
          }
        });
        let tempMinVal = tempMaxVal;
        searchOrder.map((key, index) => {
          if (key < tempMinVal) {
            minIndex = index;
            tempMinVal = key;
          }
        });

        if (searchOptionColumn.length > minIndex) {
          this.searchShowIndex = minIndex;
          searchOptionColumn[minIndex].display = true;
          searchOptionColumn[minIndex].offset = 4;
        }

        this.formField = fieldRes;
        this.$refs.listRef.option.column = listOptionColumn;
        this.$refs.searchMagFormRef.option.column = searchOptionColumn;

        //console.log(listOptionColumn)
        //console.log(searchOptionColumn)

        searchOptionColumn.map((item) => {
          if (item.formQueryCond == "between" && item.type == "array") {
            this.searchMagFormData[item.prop] = ["", ""];
          }
        });
      });

      this.refreshChange();
    },
    cutProps(opt) {
      //console.log(opt);
      //将表单字典的label 处理成value 使其做完汉字存储
      opt.column.map((item) => {
        if (!validatenull(item.props)) {
          //console.log(item);
          item.props.value = item.props.label;
        }

        if (item.type == "dynamic") {
          //console.log('顶级的子表单')
          /*if( !isNull(item.children) ){

            if( !isNull(item.children.column) ){
              item.children.column.map((sobj)=>{
                if (!validatenull(sobj.props)) {
                  sobj.props.value = sobj.props.label;
                }
              })
            }

          }
          */
        }

        if (item.type == "table") {
          //console.log('顶级的table');
          for (let k in item.data) {
            for (let m in item.data[k]) {
              if (!isNull(item.data[k][m].children)) {
                item.data[k][m].children.map((sobj) => {
                  if (!validatenull(sobj.props)) {
                    sobj.props.value = sobj.props.label;
                  }
                });
              }
            }
          }
        }
      });

      if (!validatenull(opt.group)) {
        opt.group.map((item) => {
          if (!validatenull(item.column)) {
            item.column.map((tobj) => {
              if (!validatenull(tobj.props)) {
                //console.log(tobj);
                tobj.props.value = tobj.props.label;
              }

              if (tobj.type == "dynamic") {
                //console.log('group里的子表单')
              }

              if (tobj.type == "table") {
                //console.log('group里的table');
                for (let k in tobj.data) {
                  for (let m in tobj.data[k]) {
                    if (!isNull(tobj.data[k][m].children)) {
                      tobj.data[k][m].children.map((sobj) => {
                        if (!validatenull(sobj.props)) {
                          sobj.props.value = sobj.props.label;
                        }
                      });
                    }
                  }
                }
              }
            });
          }
        });
      }

      return opt;
    },
    searchMagFormShowAll() {
      this.$refs.searchMagFormRef.option.column.map((item) => {
        item.display = true;
      });
      this.searchMagFormShowTag = false;
      this.searchMagFormHideTag = true;
    },
    searchMagFormHideAll() {
      this.$refs.searchMagFormRef.option.column.map((item) => {
        item.display = false;
      });
      if (this.searchShowIndex) {
        this.$refs.searchMagFormRef.option.column[
          this.searchShowIndex
        ].display = true;
      }
      this.searchMagFormShowTag = true;
      this.searchMagFormHideTag = false;
    },
    async getTemplateVersion(id) {
      const TemplateParam = {
        id: id ? id : this.templateId,
      };
      await getFromTemplate(TemplateParam).then(
        (res) => {
          const dataRes = res.data.data;
          this.dataMagFormOption = this.cutProps(
            JSON.parse(dataRes.formTemplateJson)
          );
          this.dataMagFormFlatJson = JSON.parse(dataRes.formTemplateFlatJson);
          this.formTemplateOnetomanyFlatJson = JSON.parse(
            dataRes.formTemplateOnetomanyFlatJson
          );
          this.cmfCustData = this.htmlDecodeByRegExp(dataRes.desc);
        },
        (error) => {
          window.console.log(error);
        }
      );
    },

    async getTemplateNewestVersion(thisObjName) {
      const dataResFun = await getFromTemplateNewest({
        metaObjName: thisObjName,
      });
      const dataRes = dataResFun.data.data;
      //console.log(JSON.parse(dataRes.formTemplateJson))
      this.dataMagNewestFormOption = this.cutProps(
        JSON.parse(dataRes.formTemplateJson)
      );
      this.tempNewestSearchOption = this.cutProps(
        JSON.parse(dataRes.formTemplateJson)
      );
      this.cmfCustData = this.htmlDecodeByRegExp(dataRes.desc);
      this.isCustomTable = dataRes.isCustomTable;
      this.formVerify = dataRes.isAudit == 1 ? true : false;
      return this.cutProps(JSON.parse(dataRes.formTemplateJson));
    },

    initColumnData(columnJson, templateJson) {
      /*const jsonTemp = templateJson.filter(
        (ele) => ele.prop == columnJson.templateFieldName
      );*/
      const jsonTemp = findNodeByVal(
        templateJson,
        "prop",
        columnJson.templateFieldName,
        "children"
      );

      //console.log('initColumnData',columnJson.templateFieldName,templateJson,jsonTemp)
      let jsonRes = columnJson;
      if (!isNull(jsonTemp)) {
        jsonRes = Object.assign(jsonTemp, columnJson);
      }
      //console.log(jsonRes);
      return jsonRes;
    },
    initSearchData(columnJson, templateJson) {
      /*const jsonTemp = templateJson.filter(
        (ele) => ele.prop == columnJson.templateFieldName
      );*/
      const jsonTemp = findNodeByVal(
        templateJson,
        "prop",
        columnJson.templateFieldName,
        "children"
      );

      //console.log('initSearchData',columnJson.templateFieldName,templateJson,jsonTemp)
      let jsonRes = columnJson;
      if (!isNull(jsonTemp)) {
        jsonRes = Object.assign(jsonTemp, columnJson);
      }

      if (jsonRes.formQueryCond == "between" && jsonRes.type == "datetime") {
        jsonRes.span = 8;
        jsonRes.type = "datetimerange";
        jsonRes.defaultTime = ["00:00:00", "23:59:59"];
        jsonRes.format = "yyyy-MM-dd HH:mm:ss";
        jsonRes.valueFormat = "yyyy-MM-dd HH:mm:ss";
        jsonRes.startPlaceholder = "开始时间";
        jsonRes.endPlaceholder = "结束时间";
      } else if (
        jsonRes.formQueryCond == "between" &&
        jsonRes.type != "datetime"
      ) {
        jsonRes.span = 8;
        jsonRes.type = "array";
        jsonRes.limit = 2;
      }
      //console.log(jsonRes);
      return jsonRes;
    },

    /*rowSave(row, done, loading) {

    },

    rowUpdate(row, index, done, loading) {

    },

    rowDel(row){
    },*/

    async comFormMagAdd() {
      if (!validatenull(this.customAddUrl)) {
        let zUrl =
          "&metaObjName=" +
          this.metObjName +
          "&templateVersionId=" +
          this.templateId +
          "&systemCode=" +
          this.systemCode;
        let openUrl = this.customAddUrl.includes("?")
          ? this.customAddUrl + zUrl
          : this.customAddUrl + "?" + zUrl;
        window.open(openUrl);
      } else {
        this.verifyTab = "VIEW";
        this.btnLoading = false;

        this.dataMagFormTitle = "数据新增";
        this.dataMagFormClass = "";
        this.dataInitTemplateId = this.templateId;
        this.dataInitId = null;
        await this.getTemplateVersion(this.dataInitTemplateId);
        this.dataMagFormKey++;
        this.comFormMagItem("add");
        this.dataFormData = {};
        this.formDataColumn = [];
        this.dataMagFormSubBtnTag = true;
        this.dataMagFormSubType = "add";
        this.dataMagFormTag = true;
      }
    },

    async comFormMagJia(){
      this.btnLoading = false;
      this.dataMagFormTitle = "数据新增";
      this.dataMagFormClass = "";
      this.dataInitTemplateId = this.templateId;
      this.dataInitId = null;
      this.dataFormData = {};
      this.formDataColumn = [];
      this.kaoqinTag = true
    },
    async comFormMagView(row /*, index*/) {
      if (!validatenull(this.customViewUrl)) {
        let zUrl =
          "&dataId=" +
          row.id +
          "&metaObjName=" +
          this.metObjName +
          "&templateVersionId=" +
          this.template_version_id +
          "&systemCode=" +
          this.systemCode;
        let openUrl = this.customViewUrl.includes("?")
          ? this.customViewUrl + zUrl
          : this.customViewUrl + "?" + zUrl;
        window.open(openUrl);
      } else {
        this.verifyTab = "VIEW";
        this.btnLoading = false;

        if (this.tabType == "DONE") {
          this.verifyParamData = {
            taskId: row.aicos_task_id,
            processInstanceId: row.aicos_process_instance_id,
            processDefinitionId: row.aicos_process_definition_id,
            taskDefinitionKey: row.aicos_task_definition_key,
          };
        }

        this.dataMagFormSubType = "view";
        this.dataMagFormTag = true;

        this.dataMagFormTitle = "数据查看";
        // this.dataMagFormClass = "avue--view avue--detail";
        this.dataInitTemplateId = row.template_version_id;
        this.dataInitId = row.id;
        await this.getTemplateVersion(this.dataInitTemplateId);

        //this.dataMagFormKey++;
        // this.comFormMagItem("view");
        this.dataFormData = await this.comFormMagDataInit(row);
        this.dataMagFormSubBtnTag = false;
        //console.log(this.$refs.dataMagFormRef);
        this.$set(this.dataMagFormOption, "boxType", "view");
        //this.dataMagFormOption.boxType = "view";
      }
    },

    async comFormMagUpdate(row /*, index*/) {
      if (!validatenull(this.customUpdateUrl)) {
        let zUrl =
          "&dataId=" +
          row.id +
          "&metaObjName=" +
          this.metObjName +
          "&templateVersionId=" +
          this.template_version_id +
          "&systemCode=" +
          this.systemCode;
        let openUrl = this.customUpdateUrl.includes("?")
          ? this.customUpdateUrl + zUrl
          : this.customUpdateUrl + "?" + zUrl;
        window.open(openUrl);
      } else {
        this.btnLoading = false;

        this.dataMagFormTitle = "数据编辑";
        this.dataMagFormClass = "";
        this.dataInitTemplateId = row.template_version_id;
        this.dataInitId = row.id;
        await this.getTemplateVersion(this.dataInitTemplateId);
        this.dataMagFormKey++;
        this.comFormMagItem("update");
        this.dataFormData = await this.comFormMagDataInit(row);
        this.dataMagFormSubBtnTag = true;
        this.dataMagFormSubType = "update";
        this.dataMagFormTag = true;
      }
    },

    async comFormMagVerify(row /*, index*/) {
      if (!validatenull(this.customUpdateUrl)) {
        let zUrl =
          "&dataId=" +
          row.id +
          "&metaObjName=" +
          this.metObjName +
          "&templateVersionId=" +
          this.template_version_id +
          "&systemCode=" +
          this.systemCode;
        let openUrl = this.customUpdateUrl.includes("?")
          ? this.customUpdateUrl + zUrl
          : this.customUpdateUrl + "?" + zUrl;
        window.open(openUrl);
      } else {
        this.btnLoading = false;

        this.formVerifyText = "";
        this.verifyTab = "VIEW";
        this.verifyParamData = {
          taskId: row.aicos_task_id,
          processInstanceId: row.aicos_process_instance_id,
          processDefinitionId: row.aicos_process_definition_id,
          taskDefinitionKey: row.aicos_task_definition_key,
        };

        const nodeStaRes = await getNodeEditStatus({
          activityId: row.aicos_current_activity_id,
          formTemplateVersionId:
            this.isCustomTable == 0
              ? row.form_template_version_id
              : row.template_version_id,
        });
        let nodeStaus = nodeStaRes.data.data.formEdit;
        //console.log(nodeStaus)
        //let nodeStaus = 'edit';

        if (nodeStaus == "edit") {
          this.dataMagFormClass = "";
        } else {
          this.dataMagFormClass = "avue--view avue--detail";
        }

        this.dataMagFormTitle = "数据审核";

        this.dataInitTemplateId = row.template_version_id;
        this.dataInitId = row.id;
        await this.getTemplateVersion(this.dataInitTemplateId);
        this.dataMagFormKey++;
        this.comFormMagItem("update");
        this.dataFormData = await this.comFormMagDataInit(row);
        this.dataMagFormSubBtnTag = false;
        this.dataMagFormSubType = "update";
        this.dataMagFormTag = true;
      }
    },

    async comFormMagDataInit(row) {
      this.dataFormData = {};

      const dataResFun = await viewListData({
        id: row.id,
        metObjName: this.metObjName,
        systemCode: this.systemCode,
      });

      const dataRes = dataResFun.data.data;
      this.formDataColumn = dataRes.formDataColumn;
      //console.log(dataRes)
      /*let rowData = "{ ";
      let rowDataFor = 0;
      let rowDataLength = Object.entries(dataRes).length;
      for (let [key, val] of Object.entries(dataRes) ){
        rowDataFor++;
        const fieldType = this.formField.filter(ele => ele.name == key).map(ele => {return ele.type}).join();
        rowData += '"'+(fieldType+key)+'": "'+val+'"';
        if( rowDataFor != rowDataLength) { rowData +=','; }
        console.log(rowData)
      }
      rowData += " }";*/

      return dataRes;
    },
    comFormMagItem(actionType) {
      const formItems = this.dataMagFormOption.column;
      formItems.map((item) => {
        //console.log(item)
        if (actionType == "view") {
          item.disabled = true;
        } else {
          item.disabled = false;
        }
      });
    },

    dataMagFormClose() {
      this.cmfCustData = "";
      //this.verifyParamData = "";
      this.dataMagFormClass = "";
      this.dataInitTemplateId = "";
      this.dataInitId = null;
      this.dataMagFormTag = false;
    },

    comFormMagDel(row) {
      //console.log(row);
      this.$confirm("确定将选择数据删除?", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          const delParm = {
            ids: [row.id],
            metObjName: this.metObjName,
            systemCode: this.systemCode,
          };
          return delListData(delParm);
        })
        .then(() => {
          this.$message({
            type: "success",
            message: "操作成功!",
          });
          this.refreshChange();
        });
    },
    comFormMagBatchDel() {
      if (this.selectionList.length == 0) {
        this.$message({
          type: "warning",
          message: "请选择需要处理的数据",
        });
      } else {
        this.$confirm(
          "确认是否删除 " + this.selectionList.length + " 条数据？",
          "提示",
          {
            confirmButtonText: "确定",
            cancelButtonText: "取消",
            type: "warning",
          }
        )
          .then(() => {
            const delIds = this.selectionList.map((item) => item.id);
            const delParms = {
              ids: delIds,
              metObjName: this.metObjName,
              systemCode: this.systemCode,
            };
            //console.log(delIds);
            return delListData(delParms);
          })
          .then(() => {
            this.$message({
              type: "success",
              message: "操作成功!",
            });

            this.refreshChange();
          });
      }
    },

    searchReset() {
      this.query = {};
      this.onLoad(this.page);
    },
    searchChange(params, done) {
      this.query = params;
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

    initData(/*type*/) {
      /*console.log(type);*/
    },

    onLoad(page /*, params = {}*/) {
      if (this.metObjName && this.templateId && this.systemCode) {
        //console.log(this.query);
        this.loading = true;
        const dataParam = {
          metaObjName: this.metObjName,
          templateVersionId: this.templateId,
          systemCode: this.systemCode,
          reqPage: {
            current: page.currentPage,
            size: page.pageSize,
          },
          searchParam: {
            ...this.query,
          },
        };
        if (this.tabType == "TODO") {
          getToDoListData(dataParam).then((res) => {
            const dataRes = res.data.data;
            this.page.total = dataRes.rspPage.totalItems;
            this.page.pageSize = dataRes.rspPage.size;
            this.page.currentPage = dataRes.rspPage.current;
            this.formName = dataRes.formName;
            this.listData = dataRes.fieldList;
            this.loading = false;
            this.selectionClear();
          });
        } else if (this.tabType == "DONE") {
          getFinishListData(dataParam).then((res) => {
            const dataRes = res.data.data;
            this.page.total = dataRes.rspPage.totalItems;
            this.page.pageSize = dataRes.rspPage.size;
            this.page.currentPage = dataRes.rspPage.current;
            this.formName = dataRes.formName;
            this.listData = dataRes.fieldList;
            this.loading = false;
            this.selectionClear();
          });
        } else {
          getListData(dataParam).then((res) => {
            const dataRes = res.data.data;
            this.page.total = dataRes.rspPage.totalItems;
            this.page.pageSize = dataRes.rspPage.size;
            this.page.currentPage = dataRes.rspPage.current;
            this.formName = dataRes.formName;
            this.listData = dataRes.fieldList;
            this.loading = false;
            this.selectionClear();
          });
        }
      }
    },
    searchMagFormSubmit() {
      //this.searchMagFormkey++;
      let queryRes = {};
      for (let [key, val] of Object.entries(this.searchMagFormData)) {
        if (val instanceof Array) {
          if (val.join("").length > 0) {
            this.$set(queryRes, key, val);
          }
        } else {
          if (!key.startsWith("$") && !validatenull(val)) {
            this.$set(queryRes, key, val);
          }
        }
      }
      //console.log(queryRes);

      this.query = queryRes;
      this.page.currentPage = 1;
      this.onLoad(this.page);
    },
    searchMagFormReset() {
      /*this.searchMagFormkey++;
      //this.searchMagFormData = {};
      this.$refs.searchMagFormRef.option.column.map((item)=>{
        if(item.formQueryCond == 'between' && item.type == 'array'  ){
          console.log(item.prop)
          this.findObject(this.searchMagFormOption.column, item.prop).value = ['1','1'] ;
          //this.searchMagFormData[item.prop] = ['1','1'] ;
        }
      })*/
      this.$refs.searchMagFormRef.resetForm();
      this.query = {};
      this.page.currentPage = 1;
      this.onLoad(this.page);
    },
    async dataMagFormSave(saveByFlow) {
      this.$refs.dataMagFormRef.validate((valid /*msg*/) => {
        if (valid) {
          const dataMagFormDataJson =
            this.$refs.dataMagFormRef.buildSubmitData();
          const dataParam = {
            id: this.dataInitId,
            formTemplateVersionId: this.dataInitTemplateId
              ? this.dataInitTemplateId
              : this.templateId,
            formDataJson: dataMagFormDataJson,
          };
          //console.log(dataParam);
          saveOrUpdateListData(dataParam).then(
            (/*res*/) => {
              if (saveByFlow != "flow") {
                if (this.dataMagFormSubType == "add") {
                  this.tabType = "ALL";
                }
                this.refreshChange();

                this.dataMagFormTag = false;
                this.cmfCustData = "";
                this.$message({
                  type: "success",
                  message: "操作成功!",
                });
              }
            },
            (error) => {
              window.console.log(error);
              this.$refs.dataMagFormRef.$refs.form.allDisabled = false;
              this.cmfCustData = "";
            }
          );
        } else {
          window.console.log("error submit!!");
          //this.cmfCustData = "";
          return false;
        }
      });
    },
    async dataMagVerifyYes() {
      this.$refs.dataMagFormRef.validate((valid /*msg*/) => {
        if (valid) {
          this.btnLoading = true;
          this.dataMagFormSave("flow").then(() => {
            const dataParam = {
              ...this.verifyParamData,
              passStatus: "agree",
              comment: this.formVerifyText,
            };

            flowYes(dataParam).then(
              (/*res*/) => {
                this.btnLoading = false;
                this.refreshChange();
                this.dataMagFormClose();
                this.$message({
                  type: "success",
                  message: "操作成功!",
                });
              },
              (error) => {
                window.console.log(error);
              }
            );
          });
        } else {
          this.btnLoading = false;
        }
      });
    },
    async dataMagVerifyNo() {
      this.$refs.dataMagFormRef.validate((valid /*msg*/) => {
        if (valid) {
          this.btnLoading = true;
          this.dataMagFormSave("flow").then(() => {
            const dataParam = {
              ...this.verifyParamData,
              passStatus: "closeForDisagree",
              comment: this.formVerifyText,
            };
            flowNo(dataParam).then(
              (/*res*/) => {
                this.btnLoading = false;
                this.refreshChange();
                this.dataMagFormClose();
                this.$message({
                  type: "success",
                  message: "操作成功!",
                });
              },
              (error) => {
                window.console.log(error);
              }
            );
          });
        } else {
          this.btnLoading = false;
        }
      });
    },
    async comFormMagPrint(row) {
      //console.log('列表页面打印');
      await this.comFormMagView(row);
      this.$set(this.dataMagFormOption, "boxType", "view");
      //this.dataMagFormOption.boxType ="view";
      const that = this;
      //数据字典的渲染问题，先用延时处理，再找别的方案
      setTimeout(function () {
        that.handleDynamicPrint(that.$refs.dataMagFormRef.$el);
        //that.$Print("#dataMagFormView");
        //that.dataMagFormClose();
        //that.dataMagFormPrint();
        //that.dataMagFormOption.boxType ="view";
        that.$refs.dataMagFormRef.$refs.form.handlePrint();
      }, 500);
    },
    async dataMagFormPrint() {
      //console.log('查看页面打印');
      // this.dataMagFormKey++;
      // this.comFormMagItem("view");
      // this.dataMagFormClass = "avue--view avue--detail";
      // this.$set(this.dataMagFormOption,'boxType',"view");
      // this.dataMagFormOption.boxType ="view";

      const that = this;
      setTimeout(function () {
        //console.log(that.$refs.dataMagFormRef);
        that.handleDynamicPrint(that.$refs.dataMagFormRef.$el);
        that.$refs.dataMagFormRef.$refs.form.handlePrint();

        //that.$Print("#dataMagFormView");
        //that.dataMagFormClose();
      }, 10);
    },
    comFormMagOut(row) {
      const outIds = [row.id];
      this.outMagData(outIds);
    },
    comFormMagSelectOut() {
      if (this.selectionList.length == 0) {
        this.$message({
          type: "warning",
          message: "请选择需要导出的数据",
        });
      } else {
        const outIds = this.selectionList.map((item) => item.id);
        this.outMagData(outIds);
      }
    },
    comFormMagBatchOut() {
      const outIds = [];
      this.outMagData(outIds);
    },
    outMagData(ids) {
      const dataParam = {
        ids: ids,
        metObjName: this.metObjName,
        systemCode: this.systemCode,
        //"templateVersionId": this.templateId,
      };
      //let fileName = this.formName+'_' + dateFormat(new Date(), 'ss_mm_hh_dd_MM_yyyy').toString() + '.xlsx';
      outListData(dataParam).then(
        (res) => {
          const urlRes = `${baseURL}` + res.data.data.substring(1);
          //console.log(urlRes);
          this.downFile(urlRes /*, fileName*/);

          this.refreshChange();
          this.$message({
            type: "success",
            message: "操作成功!",
          });
        },
        (error) => {
          window.console.log(error);
        }
      );
    },
    comFormMagIn() {
      //console.log('导入');

      this.inFormKey++;
      this.findObject(this.inFormOption.column, "excelFile").data.metaObjName =
        this.metObjName;
      this.findObject(this.inFormOption.column, "excelFile").data.systemCode =
        this.systemCode;
      this.findObject(
        this.inFormOption.column,
        "excelFile"
      ).data.templateVersionId = this.templateId;

      this.dataInTag = true;
    },
    dataInSave() {
      this.dataInTag = false;
    },
    dataInClose() {
      this.dataInTag = false;
    },
    inFormUploadAfter(response /*, file, fileList*/) {
      //console.log(response, file, fileList);
      if (response.success) {
        this.$message({
          type: "success",
          message: "操作成功!",
        });
        this.dataInTag = false;
        this.refreshChange();
      } else {
        this.inFormKey++;
        this.$message({
          type: "error",
          message: "数据导入有误，请修正文件！",
        });
      }
    },
    /*inFormUploadBefore(file){
      //console.log(file);
    },*/
    inFormUploadError(/*err, file, fileList*/) {
      //console.log(err, file, fileList);
      this.$message({
        type: "error",
        message: "上传过程中遇到错误！",
      });
    },
    templateFileDown() {
      const dataParam = {
        metObjName: this.metObjName,
        systemCode: this.systemCode,
      };
      let fileName =
        "数据模板_" +
        this.formName +
        "_" +
        dateFormat(new Date(), "hh_mm_ss").toString() +
        ".xlsx";
      inTemplateFile(dataParam).then(
        (res) => {
          //console.log(res.data)
          //const urlRes = `${baseURL}`+res.data.data.substring(1) ;
          this.downFile(res.data, fileName);

          this.$message({
            type: "success",
            message: "操作成功!",
          });
        },
        (error) => {
          window.console.log(error);
        }
      );
    },
    // 处理子表单预览
    handleDynamicPrint(el) {
      const dynamic = el.querySelectorAll(".avue-dynamic");
      for (let i = 0; i < dynamic.length; i++) {
        this.handleOneField(dynamic[i]);
      }
    },
    handleOneField(e) {
      // console.log(e)
      e.parentElement.parentElement.classList.add("dynamic-print-table-field");
      const header = e.querySelector(".el-table__header-wrapper thead");
      const body = e.querySelector(".el-table__body-wrapper tbody");
      const table = document.createElement("table");
      const cloneHeader = header.cloneNode(true);
      const gutter = cloneHeader.querySelector(".gutter");
      gutter.remove();
      const headerTr = cloneHeader.firstElementChild;
      headerTr.firstElementChild.querySelector(".el-button").remove();
      headerTr.lastElementChild.remove();
      table.appendChild(cloneHeader);
      const cloneBody = body.cloneNode(true);
      cloneBody.querySelectorAll("tr").forEach((item) => {
        item.lastElementChild.remove();
      });
      table.appendChild(cloneBody);
      table.className = "dynamic-print-table";
      e.appendChild(table);
      setTimeout(() => {
        table.remove();
      }, 200);
    },
  },
  async mounted() {
    await this.getActiveForm();
  },
  created: function () {
    //this.getActiveForm();
  },
  watch: {
    $route: "getActiveForm",
    "desktopWindow.data": {
      handler(/*newVal*/) {
        this.getActiveForm();
      },
      deep: true,
    },
    magParamsData: {
      handler(/*newVal*/) {
        //console.log(newVal)
        this.getActiveForm();
      },
      deep: true,
    },
  },
};
</script>

<style>
.CMF_MAIN {
  max-width: 1000px;
  margin: 0 auto;
  background-color: #fff;
  border-left: 1px solid #ebeef5;
  border-right: 1px solid #ebeef5;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
}
.CMF_HEAD {
  text-align: center;
  background-color: #409eff;
}
.CMF_HEAD span {
  font-size: 18px;
  line-height: 50px;
  color: #fff;
}
.CMF_BODY {
  padding: 20px 10px 0;
}
.CMF_FOOT {
}
.CMF_CUST {
}

.dataMagFormClass .dataMagFormBody {
  background-color: #f5f5f5;
  padding: 20px 0 0;
}
.dataMagFormClass .dataMagFormFooter {
  background-color: #fff;
  margin-top: 20px;
}
.formVerifyClass {
  padding: 30px 10px 10px;
  max-width: 1000px;
  margin: 0 auto;
}
.dataMagFormBtns {
  text-align: center;
  padding: 30px 10px 60px;
}
@media print {
  .el-popup-parent--hidden {
    overflow: auto;
  }
  .dataMagFormClass {
    position: static;
  }
  .dataMagFormClass .el-dialog {
    height: auto;
  }
}
</style>

<style lang="scss" scoped>
.newCss {
  position: relative;
  height: 100%;
  .search-from-tool {
    margin-right: 0;

    /deep/.el-form-item__content {
      line-height: 1px;
    }

    /deep/.el-button--small {
      padding: 5px;

      i {
        font-size: 20px;
      }
    }
  }
  .menuTitle {
    position: absolute;
    top: 85px;
    left: 40px;
    font-size: 22px;
    font-weight: 500;
    z-index: 2;
  }
  .menuTitleV {
    position: absolute;
    top: 35px;
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

  /deep/.rightSearch .avue-form__group {
    justify-content: flex-end;
  }
  /deep/.rightSearch .avue-form__menu {
    width: 240px;
  }
  /deep/.rightSearch .avue-array {
    display: flex;
    justify-content: space-between;
  }
  /deep/.rightSearch .avue-array:after {
    content: "-";
    display: block;
    width: 30px;
    height: 30px;
    order: 2;
    text-align: center;
  }
  /deep/.rightSearch .avue-array > :first-child {
    order: 1;
  }
  /deep/.rightSearch .avue-array > :last-child {
    order: 3;
  }
  /deep/.rightSearch .avue-array .el-button {
    display: none;
  }

  /deep/.el-table__header-wrapper {
    background-color: #fafafa;
  }
}
.flow-view {
  height: calc(100vh - 175px);
}

.CMF_BODY {
  /deep/ .dynamic-print-table {
    width: 100%;
    border: 1px solid #ebeef5;
    border-collapse: collapse;
    table-layout: fixed;
    display: none;

    td,
    th {
      border: 1px solid #ebeef5;
      height: 49px;

      &:first-child {
        width: 50px;
        text-align: center;
      }
    }
  }

  @media print {
    /deep/.avue-dynamic {
      .avue-crud {
        display: none;
      }

      .dynamic-print-table {
        display: table;
      }
    }
  }
}
.kqtitle{
  display: flex;
  width: 100%;
  height: 60px;
  line-height: 60px;
}
.kqtxt{
  font-size: 18px;
  width: 80px;
}
</style>
