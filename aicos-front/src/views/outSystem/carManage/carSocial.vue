<template>
  <basic-container>
    <el-tabs v-if="formVerify" v-model="tabType" @tab-click="tabChange">
      <!-- <el-tab-pane name="ALL">
        <span slot="label"><i class="el-icon-s-order"></i> 我的</span>
      </el-tab-pane> -->
      <el-tab-pane name="TODO" v-if="permissionList.toDoBtn">
        <span slot="label"><i class="el-icon-s-management"></i> 待审核</span>
      </el-tab-pane>
      <el-tab-pane name="DONE" v-if="permissionList.doneBtn">
        <span slot="label"><i class="el-icon-s-claim"></i> 已审核</span>
      </el-tab-pane>
    </el-tabs>


    <avue-crud :option="listOption" :table-loading="loading" :data="listData" ref="listRef" v-model="listForm"
      :page.sync="page" :permission="permissionList" :before-open="beforeOpen" :before-close="beforeClose"
      @search-change="searchChange" @search-reset="searchReset" @selection-change="selectionChange"
      @current-change="currentChange" @size-change="sizeChange" @refresh-change="refreshChange" @on-load="onLoad"
      @row-save="rowSave" @row-update="rowUpdate">
      <template slot="denglzh" slot-scope="scope">
        <div class="denglzh">
          <img v-if="scope.row.read_status == 0" :src="newImg" alt="未读消息" style="width: 1.4rem;height: auto;" />
          <span>{{ scope.row.denglzh }}</span>
        </div>
      </template>

      <template #shiftj="scope">
        <el-tag v-if="scope.row.shiftj == '草稿'" effect="dark" type="info">草稿</el-tag>
        <el-tag v-if="scope.row.shiftj == '审核中'" type="danger">审核中</el-tag>
        <el-tag v-if="scope.row.shiftj == '审核不通过'" effect="dark" type="danger">审核不通过</el-tag>
        <el-tag v-if="scope.row.shiftj == '审核通过'" effect="dark" type="success">审核通过</el-tag>
      </template>
      
      <!-- <template slot-scope="scope" slot="menuLeft">
        <el-button v-if="permissionList.exportExcel" size="small" icon="el-icon-download" type="primary" @click="exportExcel">
          导出
        </el-button>
      </template> -->
      <template v-slot:menu="scope">
        <el-button type="text" size="small" v-if="permissionList.viewBtn" @click="comFormMagView(scope.row)">查看
        </el-button>
        <el-button type="text" size="small"
          v-if="(scope.row.shiftj == '草稿' || scope.row.shiftj == '审核不通过') && permissionList.editBtn"
          @click="comFormMagUpdate(scope.row)">编辑
        </el-button>
        <el-button type="text" size="small"
          v-if="(scope.row.shiftj == '草稿' || scope.row.shiftj == '审核不通过') && permissionList.tijiaoBtn"
          @click="comFormTijiao(scope.row)">提交
        </el-button>
        <el-button type="text" size="small" v-if="formVerify && tabType == 'TODO' && permissionList.shenheBtn"
          @click="comFormShenhe(scope.row)">审核
        </el-button>
        <el-button type="text" size="small" v-if="permissionList.huancheBtn && scope.row.paichezt == '已派车'" @click="comFormMagBack(scope.row)">还车
        </el-button>
        <el-button type="text" size="small"
          v-if="(scope.row.shiftj == '草稿' || scope.row.shiftj == '审核不通过') && permissionList.delBtn"
          @click="comFormMagDel(scope.row)">删除
        </el-button>
      </template>
    </avue-crud>

    <!--审核弹窗-->
    <HuilanDialog :title="dataMagFormTitle" :fullscreen="true" append-to-body :before-close="dataMagFormClose"
      :visible.sync="dataMagFormTag" class="dataMagFormClass">
      <el-tabs v-if="formVerify && (tabType == 'TODO' || tabType == 'DONE')" v-model="verifyTab"
        @tab-click="verifyChange">
        <el-tab-pane name="VIEW">
          <span slot="label"><i class="el-icon-s-operation"></i> 数据详情</span>
        </el-tab-pane>
        <el-tab-pane name="HISTORY" lazy>
          <span slot="label"><i class="el-icon-s-unfold"></i> 流转历史</span>
          <CirculationHistory v-if="verifyTab === 'HISTORY'" :processInstanceId="verifyParamData.processInstanceId" />
        </el-tab-pane>
        <el-tab-pane name="DIAGRAM" lazy>
          <span slot="label"><i class="el-icon-picture-outline"></i> 流程图</span>
          <DiagramView v-if="verifyTab === 'DIAGRAM'" :cur="verifyParamData" class="flow-view" />
        </el-tab-pane>
      </el-tabs>

      <div class="dataMagFormBody" v-if="verifyTab == 'VIEW'">
        <div class="CMF_MAIN">
          <div class="CMF_HEAD">
            <span>{{ formName }}</span>
          </div>
          <div class="CMF_BODY">
            <avue-form id="dataMagFormView" ref="dataMagFormRef" v-model="form" :option="options" v-if="showform">
            </avue-form>
          </div>
        </div>
        <div class="dataMagFormFooter" v-if="showShenhe">
          <div v-if="formVerify && tabType == 'TODO'" class="formVerifyClass">
            <el-input type="textarea" v-model="formVerifyText" placeholder="请输入审核意见" rows="4" />
          </div>
          <div class="dataMagFormBtns">
            <el-button size="small" icon="el-icon-check" v-if="formVerify && tabType == 'TODO'" type="success"
              @click.stop="dataMagVerifyYes" :loading="btnLoading">审核通过
            </el-button>
            <el-button size="small" icon="el-icon-close" v-if="formVerify && tabType == 'TODO'" type="warning"
              @click.stop="dataMagVerifyNo" :loading="btnLoading">审核不通过
            </el-button>
            <el-button size="small" icon="el-icon-circle-close" @click="dataMagFormClose">取 消</el-button>
          </div>
        </div>
      </div>
    </HuilanDialog>
  </basic-container>
</template>

<script>
import { mapGetters } from "vuex";
import DiagramView from "@/views/system/commonForm/diagramView.vue";
import CirculationHistory from "@/views/system/commonForm/circulationHistory";
import {
  getListData,
  saveOrUpdateListData,
  delListData,
  viewListData,
  auditListData,
  auditNoListData,
  submitListData,
  backListData
} from "@/api/outSystem/carSocial";
import {
  getInfo,
} from "@/api/outSystem/agency";
import {
  getDepartment,
} from "@/api/Political/common";
import {
  getFromTemplateNewest,
  getToDoListData,
  getFinishListData,
  getProcess
} from "@/api/system/commonFormData";
const baseUrl = process.env.BASE_URL;
export default {
  components: {
    DiagramView,
    CirculationHistory,
  },
  data () {
    return {
      showShenhe:false,
      tabType: "TODO",
      dataMagFormTitle: '审核',
      dataMagFormTag: false,
      formVerify: false,
      btnLoading: false,
      metObjName: "dyf_aicos_miscycsq_7968",
      systemCode: 'AiCOS',
      formVerifyText: '',
      verifyParamData: {},
      verifyTab: "VIEW",
      userInfo: {},
      rolename: '',
      showform: false,

      newImg: `${baseUrl}img/new.png`,
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
        height: 'auto',
        align: 'center',
        searchShow: true,
        tip: false,
        border: true,
        editBtn: false,
        delBtn: false,
        index: true,
        addBtnText: '用车申请',
        indexLabel: '序号',
        indexWidth: 60,
        viewBtn: false,
        selection: false,
        labelPosition: 'right',
        labelSuffix: '',
        labelWidth: 120,
        gutter: 0,
        menuPosition: 'center',
        isCustom: false,
        excelBtn: false,
        column: [
          {
            type: 'textarea',
            label: '用车事由',
            span: 16,
            display: true,
            hideLabel: false,
            prop: 'yongcsy',
            isListDisplay: true,
            order: 2,
            required: true,
            rules: [
              {
                required: true,
                message: '用车事由必须填写'
              }
            ],
            width:100,
          },
          {
            type: 'input',
            label: '同行人数',
            span: 16,
            display: true,
            hideLabel: false,
            prop: 'tongxrs',
            isListDisplay: true,
            order: 3,
            required: true,
            rules: [
              {
                required: true,
                message: '同行人数必须填写'
              }
            ],
            width:100,
          },
          {
            type: 'input',
            label: '用车部门',
            span: 16,
            display: true,
            hideLabel: false,
            prop: 'shenqbm',
            isListDisplay: true,
            order: 6,
            required: true,
            rules: [
              {
                required: true,
                message: '用车部门必须填写'
              }
            ],
            width:100,
          },
          {
            type: 'input',
            label: '目的地',
            span: 16,
            display: true,
            hideLabel: false,
            prop: 'mudd',
            isListDisplay: true,
            order: 4,
            required: true,
            rules: [
              {
                required: true,
                message: '目的地必须填写'
              }
            ],
          },
          {
            type: 'input',
            label: '随车负责人',
            span: 16,
            display: true,
            hideLabel: false,
            prop: 'suicfzr',
            isListDisplay: true,
            order: 5,
            required: true,
            rules: [
              {
                required: true,
                message: '随车负责人必须填写'
              }
            ],
            width:120,
          },
          {
            type: 'datetime',
            label: '用车开始时间',
            span: 16,
            display: true,
            format: 'yyyy-MM-dd HH:mm:ss',
            valueFormat: 'yyyy-MM-dd HH:mm:ss',
            hideLabel: false,
            dataType: 'datetime',
            prop: 'yongckssj',
            isListDisplay: true,
            order: 1,
            required: true,
            rules: [
              {
                required: true,
                message: '用车开始时间必须选择'
              }
            ],
            width:120,
          },
          {
            type: 'datetime',
            label: '用车结束时间',
            span: 16,
            display: true,
            format: 'yyyy-MM-dd HH:mm:ss',
            valueFormat: 'yyyy-MM-dd HH:mm:ss',
            hideLabel: false,
            dataType: 'datetime',
            prop: 'yongcjssj',
            isListDisplay: true,
            order: 1,
            required: true,
            rules: [
              {
                required: true,
                message: '用车结束时间必须选择'
              }
            ],
            width:120,
          },
          {
            type: 'input',
            label: '申请人',
            span: 16,
            display: true,
            hideLabel: false,
            prop: 'shenqr',
            isListDisplay: true,
            order: 6,
            search:true,
            required: true,
            rules: [
              {
                required: true,
                message: '申请人必须填写'
              }
            ],
          },
          {
            type: 'datetime',
            label: '申请时间',
            span: 16,
            display: false,
            format: 'yyyy-MM-dd HH:mm:ss',
            valueFormat: 'yyyy-MM-dd HH:mm:ss',
            hideLabel: false,
            dataType: 'datetime',
            prop: 'create_time',
            isListDisplay: true,
            width:100,
          },
          {
            label: "流程状态",
            prop: "shiftj",
            display: false,
            width:120,
          },
          {
            type: 'input',
            label: '车队公司名称',
            span: 16,
            display: false,
            hideLabel: false,
            prop: 'chedgsmc',
            isListDisplay: true,
            searchLabelWidth:140,
            search:true,
            width:120,
          },
          {
            type: 'input',
            label: '驾驶员姓名',
            span: 16,
            display: false,
            hideLabel: false,
            prop: 'jiasyxm',
            isListDisplay: true,
            width:120,
          },
          {
            type: 'input',
            label: '驾驶员联系电话',
            span: 16,
            display: false,
            hideLabel: false,
            prop: 'jiasylxdh',
            isListDisplay: true,
            width:140,
          },
          {
            type: 'input',
            label: '车牌号',
            span: 16,
            display: false,
            hideLabel: false,
            prop: 'cheph',
            isListDisplay: true,
            search:true,
          },
          {
            type: 'input',
            label: '承办人',
            span: 16,
            display: false,
            hideLabel: false,
            prop: 'chengbr',
            isListDisplay: true,
          },
          {
            type: 'select',
            label: '派车状态',
            cascaderItem: [],
            span: 16,
            display: false,
            props: {
              label: 'name',
              value: 'value'
            },
            hideLabel: false,
            prop: 'paichezt',
            isListDisplay: true,
            dicUrl: '/aicos/api/aicos-system/baseDict/getDictItemListByDictCode',
            dicMethod: 'post',
            dicQuery: {
              code: 'paichezt'
            },
            width:100,
          },
          {
            type: 'datetime',
            label: '派车时间',
            span: 16,
            display: false,
            format: 'yyyy-MM-dd HH:mm:ss',
            valueFormat: 'yyyy-MM-dd HH:mm:ss',
            hideLabel: false,
            dataType: 'datetime',
            prop: 'paicsj',
            isListDisplay: true,
            width:100,
          },
          {
            type: 'datetime',
            label: '还车时间',
            span: 16,
            display: false,
            format: 'yyyy-MM-dd HH:mm:ss',
            valueFormat: 'yyyy-MM-dd HH:mm:ss',
            hideLabel: false,
            dataType: 'datetime',
            prop: 'guihsj',
            isListDisplay: true,
            width:100,
          },
          {
            type: 'datetime',
            label: '提交时间',
            span: 16,
            display: false,
            format: 'yyyy-MM-dd HH:mm:ss',
            valueFormat: 'yyyy-MM-dd HH:mm:ss',
            hideLabel: false,
            dataType: 'datetime',
            prop: 'submit_time',
            isListDisplay: true,
            width:100,
            hide:true,
          },
          {
            type: 'datetime',
            label: '审核时间',
            span: 16,
            display: false,
            format: 'yyyy-MM-dd HH:mm:ss',
            valueFormat: 'yyyy-MM-dd HH:mm:ss',
            hideLabel: false,
            dataType: 'datetime',
            prop: 'audit_time',
            isListDisplay: true,
            width:100,
            hide:true,
          },
        ],
      },
      form: {},
      options: {
        submitBtn: false,
        emptyBtn: false,
        height: 'auto',
        align: 'center',
        searchShow: true,
        tip: false,
        border: true,
        editBtn: false,
        delBtn: false,
        index: true,
        addBtnText: '用车申请',
        indexLabel: '序号',
        indexWidth: 100,
        viewBtn: false,
        selection: false,
        labelPosition: 'right',
        labelSuffix: '',
        labelWidth: 120,
        gutter: 0,
        menuPosition: 'center',
        isCustom: false,
        excelBtn: false,
        column: [
          {
            type: 'textarea',
            label: '用车事由',
            span: 16,
            display: true,
            hideLabel: false,
            prop: 'yongcsy',
            isListDisplay: true,
            order: 2,
            readonly: true,
          },
          {
            type: 'input',
            label: '同行人数',
            span: 16,
            display: true,
            hideLabel: false,
            prop: 'tongxrs',
            isListDisplay: true,
            order: 3,
            readonly: true,
          },
          {
            type: 'input',
            label: '用车部门',
            span: 16,
            display: true,
            hideLabel: false,
            prop: 'shenqbm',
            isListDisplay: true,
            order: 6,
            readonly: true,
          },
          {
            type: 'input',
            label: '目的地',
            span: 16,
            display: true,
            hideLabel: false,
            prop: 'mudd',
            isListDisplay: true,
            order: 4,
            readonly: true,
          },
          {
            type: 'input',
            label: '随车负责人',
            span: 16,
            display: true,
            hideLabel: false,
            prop: 'suicfzr',
            isListDisplay: true,
            order: 5,
            readonly: true,
          },
          {
            type: 'datetime',
            label: '用车开始时间',
            span: 16,
            display: true,
            format: 'yyyy-MM-dd HH:mm:ss',
            valueFormat: 'yyyy-MM-dd HH:mm:ss',
            hideLabel: false,
            dataType: 'datetime',
            prop: 'yongckssj',
            isListDisplay: true,
            order: 1,
            readonly: true,
          },
          {
            type: 'datetime',
            label: '用车结束时间',
            span: 16,
            display: true,
            format: 'yyyy-MM-dd HH:mm:ss',
            valueFormat: 'yyyy-MM-dd HH:mm:ss',
            hideLabel: false,
            dataType: 'datetime',
            prop: 'yongcjssj',
            isListDisplay: true,
            order: 1,
            readonly: true,
          },
          {
            type: 'input',
            label: '申请人',
            span: 16,
            display: true,
            hideLabel: false,
            prop: 'shenqr',
            isListDisplay: true,
            order: 6,
            readonly: true,
          },
          {
            type: 'datetime',
            label: '申请时间',
            span: 16,
            display: false,
            format: 'yyyy-MM-dd HH:mm:ss',
            valueFormat: 'yyyy-MM-dd HH:mm:ss',
            hideLabel: false,
            dataType: 'datetime',
            prop: 'shenqsj',
            isListDisplay: true,
          },
          {
            type: 'select',
            label: '派遣车辆',
            cascaderItem: [],
            span: 16,
            display: false,
            props: {
              label: 'label',
              value: 'value'
            },
            hideLabel: false,
            prop: 'cheph',
            isListDisplay: true,
            dicQuery: {},
          },
          {
            type: 'select',
            label: '驾驶员',
            cascaderItem: [],
            span: 16,
            display: false,
            props: {
              label: 'label',
              value: 'value'
            },
            hideLabel: false,
            prop: 'jiasy',
            isListDisplay: true,
            search: true,
            dicQuery: {},
          },
          {
            type: 'input',
            label: '派遣人',
            span: 24,
            display: false,
            hideLabel: false,
            prop: 'paiqr',
            isListDisplay: true,
          },
        ],
      }
    };
  },
  computed: {
    ...mapGetters(["permission"]),
    permissionList () {
      return {
        toDoBtn: this.vaildData(
          this.permission[`outsys-carSocial-toDo`],
          false
        ),
        doneBtn: this.vaildData(
          this.permission[`outsys-carSocial-done`],
          false
        ),
        addBtn: this.vaildData(
          this.permission[`outsys-carSocial-add`],
          false
        ),
        viewBtn: this.vaildData(
          this.permission[`outsys-carSocial-view`],
          false
        ),
        editBtn: this.vaildData(
          this.permission[`outsys-carSocial-edit`],
          false
        ),
        delBtn: this.vaildData(
          this.permission[`outsys-carSocial-del`],
          false
        ),
        tijiaoBtn: this.vaildData(
          this.permission[`outsys-carSocial-tijiao`],
          false
        ),
        shenheBtn: this.vaildData(
          this.permission[`outsys-carSocial-shenhe`],
          false
        ),
        huancheBtn: this.vaildData(
          this.permission[`outsys-carSocial-huanche`],
          false
        ),
      };
    },
    ids () {
      let ids = [];
      this.selectionList.forEach(ele => {
        ids.push(ele.id);
      });
      return ids.join(",");
    }
  },
  async mounted () {
    await this.getActiveForm();
    await this.roleInfo()
  },
  watch: {
    $route: "getActiveForm",
    "desktopWindow.data": {
      handler (/*newVal*/) {
        this.getActiveForm();
      },
      deep: true,
    },
    magParamsData: {
      handler (/*newVal*/) {
        //console.log(newVal)
        this.getActiveForm();
      },
      deep: true,
    },
  },
  methods: {
    async getActiveForm () {
      this.formVerifyText = "";
      this.verifyTab = "VIEW";
      await this.getTemplateNewestVersion(this.metObjName);
    },
    async getTemplateNewestVersion (thisObjName) {
      const dataResFun = await getFromTemplateNewest({
        metaObjName: thisObjName,
      });
      const dataRes = dataResFun.data.data;
      this.templateId = dataRes.id
      this.formVerify = dataRes.isAudit == 1 ? true : false;
    },
    Info () {
      getInfo().then(res => {
        this.userInfo = res.data.data;
        this.listForm.suicfzr = this.userInfo.account
        this.listForm.shenqr = this.userInfo.account
      })
    },
    async roleInfo () {
      const dataResFun = await getDepartment();
      if(dataResFun.data.data){
        this.rolename = dataResFun.data.data.deptName
        this.listForm.shenqbm = this.rolename
      }
    },
    tabChange () {
      this.query = {};
      this.page.currentPage = 1;
      this.onLoad(this.page);
    },
    initData (/*type*/) { },

    refreshChange () {
      this.onLoad(this.page, this.query);
    },
    beforeOpen (done, type) {
      if (["add", "edit", "view"].includes(type)) {
        if (type == 'add') {
          this.Info()
          this.roleInfo()
        }
        this.initData(type);
      }
      done();
    },
    beforeClose (done /*type*/) {
      this.refreshChange();
      done();
    },
    currentChange (currentPage) {
      this.page.currentPage = currentPage;
    },

    sizeChange (pageSize) {
      this.page.pageSize = pageSize;
    },
    searchReset () {
      this.query = {};
      this.onLoad(this.page);
    },
    searchChange (params, done) {
      this.query = params;
      this.page.currentPage = 1;
      this.onLoad(this.page, params);
      done();
    },

    selectionChange (list) {
      this.selectionList = list;
    },

    selectionClear () {
      if(this.$route.query.type){
        if(this.$route.query.type == 'add' && this.permissionList.addBtn){
          this.$refs.listRef.rowAdd()
          delete this.$route.query.type
        }
      }
      this.selectionList = [];
      this.$refs.listRef.toggleSelection();
    },
    onLoad (page /*, params = {}*/) {
      this.loading = true;
      if (this.tabType == "TODO" && this.permissionList.shenheBtn) {
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
        getToDoListData(dataParam).then(res => {
          const dataRes = res.data.data;
          this.page.total = dataRes.rspPage.totalItems;
          this.page.pageSize = dataRes.rspPage.size;
          this.page.currentPage = dataRes.rspPage.current;
          this.listData = dataRes.fieldList;
          this.loading = false;
          this.selectionClear();
        });
      } else if (this.tabType == "DONE" && this.permissionList.shenheBtn) {
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
        getFinishListData(dataParam).then(res => {
          const dataRes = res.data.data;
          this.page.total = dataRes.rspPage.totalItems;
          this.page.pageSize = dataRes.rspPage.size;
          this.page.currentPage = dataRes.rspPage.current;
          this.listData = dataRes.fieldList;
          this.loading = false;
          this.selectionClear();
        });
      } else {
        const dataParam = {
          reqPage: {
            current: page.currentPage,
            size: page.pageSize,
          },
          searchParam: {
            ...this.query,
          },
        };
        getListData(dataParam).then((res) => {
          const dataRes = res.data.data;
          this.page.total = dataRes.rspPage.totalItems;
          this.page.pageSize = dataRes.rspPage.size;
          this.page.currentPage = dataRes.rspPage.current;
          this.listData = dataRes.fieldList;
          this.loading = false;
          this.selectionClear();
        });
      }
    },
    //查看
    async comFormMagView (row, index) {
      this.showShenhe = false
      if (this.tabType !== 'DONE') {
        if(row.shiftj == '草稿'){
          this.dataMagFormTag = false;
          this.$refs.listRef.rowView(row, index);
        }else{
          this.dataMagFormTag = true;
          const paramsid = new URLSearchParams();
          paramsid.append("id", row.id);
          getProcess(paramsid).then(res => {
            this.verifyParamData = {
              processInstanceId: res.data.data.processInstanceId,
              processDefinitionId: res.data.data.processDefinitionId,
            };
          })
        }
      } else {
        this.dataMagFormTag = true;
        this.verifyParamData = {
          taskId: row.aicos_task_id,
          processInstanceId: row.aicos_process_instance_id,
          processDefinitionId: row.aicos_process_definition_id,
          taskDefinitionKey: row.aicos_task_definition_key,
        };
      }
      this.showform = true
      this.dataMagFormSubType = "view";
      this.dataMagFormTitle = "数据查看";
      this.dataInitId = row.id;
      const params = new URLSearchParams();
      params.append("id", row.id);
      const dataResFun = await viewListData(params);
      const dataRes = dataResFun.data.data;
      this.form = dataRes
    },

    rowSave (row, done, loading) {
      if(row.yongckssj > row.yongcjssj){
        this.$message({
          type: "error",
          message: "开始时间不能大于结束时间!"
        });
      }else{
        saveOrUpdateListData(row).then(() => {
          done();
          this.onLoad(this.page);
          this.$message({
            type: "success",
            message: "操作成功!"
          });
        }, error => {
          window.console.log(error);
          loading();
        });
      }
    },

    //编辑
    async comFormMagUpdate (row, index) {
      this.$refs.listRef.rowEdit(row, index);
    },

    rowUpdate (row, index, done, loading) {
      if(row.yongckssj > row.yongcjssj){
        this.$message({
          type: "error",
          message: "开始时间不能大于结束时间!"
        });
      }else{
        saveOrUpdateListData(row).then(() => {
          done();
          this.onLoad(this.page);
          this.$message({
            type: "success",
            message: "操作成功!"
          });
        }, error => {
          window.console.log(error);
          loading();
        });
      }
    },

    //删除
    comFormMagDel (row) {
      this.$confirm("确定将选择数据删除?", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          const params = new URLSearchParams();
          params.append("id", row.id);
          return delListData(params);
        })
        .then(() => {
          this.$message({
            type: "success",
            message: "操作成功!",
          });
          this.refreshChange();
        });
    },
    //审核弹窗
    async comFormShenhe (row) {
      this.showShenhe = true
      this.btnLoading = false;
      this.formVerifyText = "";
      this.verifyTab = "VIEW";
      this.verifyParamData = {
        taskId: row.aicos_task_id,
        processInstanceId: row.aicos_process_instance_id,
        processDefinitionId: row.aicos_process_definition_id,
        taskDefinitionKey: row.aicos_task_definition_key,
      };
      this.dataInitId = row.id;
      this.dataMagFormTag = true;
      this.showform = true

      const params = new URLSearchParams();
      params.append("id", row.id);
      const dataResFun = await viewListData(params);
      const dataRes = dataResFun.data.data;
      this.form = dataRes
    },
    //提交
    comFormTijiao (row) {
      this.$confirm("确认提交?", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          return submitListData({ formDataId: row.id })
        })
        .then(() => {
          this.onLoad(this.page);
          this.$message({
            type: "success",
            message: "操作成功!"
          });
        }, error => {
          window.console.log(error);
        })
    },
    //审核通过
    async dataMagVerifyYes () {
      this.btnLoading = true
      const dataParam = {
        ...this.verifyParamData,
        passStatus: "agree",
        comment: this.formVerifyText,
        formDataId: this.dataInitId
      };
      auditListData(dataParam).then(
        (/*res*/) => {
          this.btnLoading = false;
          this.showform = false
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
    },
    //审核不通过
    async dataMagVerifyNo () {
      this.btnLoading = true;
      const dataParam = {
        ...this.verifyParamData,
        passStatus: "closeForDisagree",
        comment: this.formVerifyText,
        formDataId: this.dataInitId,
      };
      auditNoListData(dataParam).then(
        (/*res*/) => {
          this.btnLoading = false;
          this.showform = false
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
    },
    dataMagFormClose () {
      this.formVerifyText = ''
      this.dataMagFormTag = false;
    },
    //还车
    comFormMagBack(row){
      this.$confirm("确定还车?", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          const params = new URLSearchParams();
          params.append("id", row.id);
          return backListData(params)
        })
        .then(() => {
          this.onLoad(this.page);
          this.$message({
            type: "success",
            message: "操作成功!",
          })
        })
    }
  }
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

.CMF_FOOT {}

.CMF_CUST {}

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

.CMF_FOOT {}

.CMF_CUST {}

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

  /deep/.rightSearch .avue-array> :first-child {
    order: 1;
  }

  /deep/.rightSearch .avue-array> :last-child {
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

.kqtitle {
  display: flex;
  height: 60px;
  width: 500px;
  line-height: 60px;
  margin: 40px auto;
}

.cstitle {
  height: 60px;
  width: 100%;
  line-height: 60px;
  text-align: center;
  margin: 40px auto 0;
  font-size: 18px;
  font-weight: 600;
}

.kqtxt {
  font-size: 18px;
  width: 80px;
}

.listadd {
  width: 60%;
  margin: 0 auto 40px;
  text-align: right;
}

.footer {
  width: 200px;
  margin: 200px auto 0;
  display: flex;
}

.csfooter {
  width: 100%;
  margin: 200px auto 0;
  text-align: center;
}

.csdate {
  width: 100%;
  text-align: center;
  height: 30px;
  line-height: 30px;
  margin: 0 auto 40px;
  font-size: 16px;
}

.table tr {
  height: 40px;
}

.table tr td {
  line-height: 40px;
  text-align: center;
}

.zhushi {
  width: 100%;
  text-align: center;
  height: 30px;
  line-height: 30px;
  font-size: 14px;
}

.hzTop {
  width: 100%;
  display: flex;
  justify-content: space-between;
}

.hztitle {
  margin-left: 10%;
}

.jidu {
  margin-right: 10%;
}

/deep/ .el-input.is-disabled .el-input__inner {
  color: #000 !important;
}
</style>
