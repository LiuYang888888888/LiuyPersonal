<template>
  <basic-container>
    <el-tabs v-if="formVerify" v-model="tabType" @tab-click="tabChange">
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
      
      <template slot="menuLeft">
        <!-- <el-button v-if="permissionList.exportExcel" size="small" icon="el-icon-download" type="primary" @click="exportExcel">
          导出
        </el-button> -->
        <el-button type="primary" size="small" icon="el-icon-plus" v-if="permissionList.addBtn" @click="handleAdd">申请</el-button>
      </template>
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
            
            <div style="max-height: 300px;overflow: auto;margin: 20px auto;" v-if="showform">
              <table align="center" width="100%" class="table xunw_table_form" border="1" style="margin-bottom: 40px;">
                <tr>
                  <td>编号</td>
                  <td>物品名称</td>
                  <td>物品规格</td>
                  <!-- <td>物品数量</td> -->
                  <!--<td>单价</td>
                  <td>总价</td>-->
                </tr>
                <tr v-for="(item,index) in wupinList" :key="index">
                  <td>{{index+1}}</td>
                  <td>{{item.wupmc}}</td>
                  <td>{{item.wupgg}}</td>
                  <!-- <td>{{item.shul}}</td> -->
                  <!--<td>{{item.danj}}</td>
                  <td>{{item.zongj}}</td>-->
                </tr>
              </table>
            </div>
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

    <!--申请弹窗-->
    <HuilanDialog :title="appTitle" :fullscreen="false" append-to-body :before-close="appClose"
      :visible.sync="appTag" class="dataMagFormClass">

      <avue-form id="dataMagFormViewAdd" ref="dataMagFormRefAdd" v-model="form" :option="options" v-if="showform">
      </avue-form>

      <div style="width: 30%;margin:auto;text-align: center;" v-if="showSuretble">
        <el-button type="primary" size="small" icon="el-icon-plus" style="margin: 0 auto;" @click="addWupin">添加</el-button>
      </div>

      <div style="max-height: 300px;overflow: auto;margin: 20px auto;" v-if="showSuretble">
        <table align="center" width="100%" class="table xunw_table_form" border="1">
          <tr>
            <td>编号</td>
            <td>物品名称</td>
            <td>物品规格</td>
            <td>维保公司</td>
            <td>维保人</td>
            <td>联系方式</td>
            <td v-if="showSure">操作</td>
          </tr>
          <tr v-for="(item,index) in wupinList" :key="index">
            <td>{{index+1}}</td>
            <td>{{item.wupmc}}</td>
            <td>{{item.wupgg}}</td>
            <td>{{item.weibgs}}</td>
            <td>{{item.weibr}}</td>
            <td>{{item.weibrlxdh}}</td>
            <td style="color: #af2c30;cursor: pointer;" @click="delWupin(item,index)" v-if="showSure">删除</td>
          </tr>
        </table>
      </div>

      <div class="dataMagFormBtns">
        <el-button size="small" icon="el-icon-check"  type="primary"
          @click.stop="saveList" :loading="btnLoading" v-if="showSure">保存
        </el-button>
        <el-button size="small" icon="el-icon-circle-close" @click="appClose">取 消</el-button>
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
  getListDataEx,
  getListDataPro
} from "@/api/outSystem/application";
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
    var lianxfs = (rule, value, callback) => {
      if (!Number.isInteger(parseInt(value))) {
        callback(new Error('请输入数字'));
      }else{
        callback()
      }
    }
    return {
      showSuretble:false,
      tabType: "TODO",
      showShenhe:false,
      dataMagFormTitle: '审核',
      dataMagFormTag: false,
      formVerify: false,
      btnLoading: false,
      metObjName: "dyf_aicos_miscbgypsq",
      systemCode: 'AiCOS',
      formVerifyText: '',
      verifyParamData: {},
      verifyTab: "VIEW",
      userInfo: {},
      rolename: '',

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
        addBtn:false,
        editBtn: false,
        delBtn: false,
        index: true,
        addBtnText: '申请',
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
            type: 'input',
            label: '申请编号',
            span: 16,
            display: true,
            hideLabel: false,
            prop: 'shenqbh',
            isListDisplay: true,
          },
          {
            type: 'input',
            label: '申请处室',
            span: 16,
            display: true,
            hideLabel: false,
            prop: 'shenqcs',
            isListDisplay: true,
            searchSpan:5,
            search:true,
          },
          {
            type: 'input',
            label: '申请人',
            span: 16,
            display: true,
            hideLabel: false,
            prop: 'shenqr',
            isListDisplay: true,
            searchSpan:5,
            search:true,
          },
          {
            type: 'datetime',
            label: '申请时间',
            span: 16,
            display: true,
            hideLabel: false,
            prop: 'create_time',
            isListDisplay: true,
            searchRange: true,
            searchSpan:8,
            search:true,
          },
          {
            type: 'input',
            label: '状态',
            span: 16,
            display: true,
            hideLabel: false,
            prop: 'shiftj',
            isListDisplay: true,
            search:true,
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
            hide:true,
          },
        ],
      },
      
      editId:'',
      appTitle:'申请',
      appTag:false,
      showform:false,
      showSure:true,
      wupinList:[],
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
            type: 'input',
            label: '申请处室',
            span: 16,
            display: true,
            hideLabel: false,
            prop: 'shenqcs',
            isListDisplay: true,
            required: true,
            rules: [
              {
                required: true,
                message: '申请处室必须填写'
              }
            ],
          },
          {
            type: 'input',
            label: '申请人',
            span: 16,
            display: true,
            hideLabel: false,
            prop: 'shenqr',
            isListDisplay: true,
            required: true,
            rules: [
              {
                required: true,
                message: '申请人必须填写'
              }
            ],
          },
          {
            type: 'input',
            label: '类型',
            span: 16,
            display: true,
            hideLabel: false,
            prop: 'leix',
            isListDisplay: true,
            required: true,
            rules: [
              {
                required: true,
                message: '类型必须填写'
              }
            ],
            hide:true,
            disabled:true,
            value:'维修'
          },
          {
            type: 'select',
            label: '物品名称',
            cascaderItem: [],
            span: 16,
            display: true,
            props: {
              label: 'wupmc',
              value: 'wupmc'
            },
            hideLabel: false,
            prop: 'wupmc',
            isListDisplay: true,
            dicData: [],
            required: true,
            rules: [
              {
                required: true,
                message: '物品必须选择'
              }
            ],
            change: ({value}) =>{
              if(value){
                this.form.wupgg = ''
                const params = new URLSearchParams();
                params.append("wupmc", value);
                getListDataPro(params).then(res =>{ 
                  this.options.column[4].dicData = res.data.data;
                })
              }
            }
          },
          {
            type: 'select',
            label: '物品规格',
            cascaderItem: [],
            span: 16,
            display: true,
            props: {
              label: 'wupgg',
              value: 'wupgg'
            },
            hideLabel: false,
            prop: 'wupgg',
            isListDisplay: true,
            dicData: [],
            required: true,
            rules: [
              {
                required: true,
                message: '物品规格必须选择'
              }
            ],
            change: ({value}) =>{
              if(value){
                this.options.column[4].dicData.forEach( e =>{
                  if(e.wupgg == value){
                    if(e.weibr){
                      this.form.weibr = e.weibr
                      this.form.weibgs = e.weibgs
                      this.form.weibrlxdh = e.weibrlxdh
                      this.options.column[5].display = true
                      this.options.column[6].display = true
                      this.options.column[7].display = true
                    }else{
                      this.options.column[5].display = false
                      this.options.column[6].display = false
                      this.options.column[7].display = false
                    }
                  }
                })
              }
            }
          },
          {
            type: 'input',
            label: '维保公司',
            span: 16,
            display: false,
            hideLabel: false,
            prop: 'weibgs',
            isListDisplay: true,
            required: true,
            rules: [
              {
                required: true,
                message: '维保公司必须填写'
              }
            ],
          },
          {
            type: 'input',
            label: '维保人',
            span: 16,
            display: false,
            hideLabel: false,
            prop: 'weibr',
            isListDisplay: true,
            required: true,
            rules: [
              {
                required: true,
                message: '维保人必须填写'
              }
            ],
          },
          {
            type: 'input',
            label: '联系电话',
            span: 16,
            display: false,
            hideLabel: false,
            prop: 'weibrlxdh',
            isListDisplay: true,
            required: true,
            rules: [
              {
                required: true,
                message: '联系电话必须填写'
              },
              {validator: lianxfs, message: '请输入正确的手机号'}
            ],
            pattern: '/^1(3|4|5|6|7|8|9)\\d{9}$/'
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
          this.permission[`outsys-weixiu-toDo`],
          false
        ),
        doneBtn: this.vaildData(
          this.permission[`outsys-weixiu-done`],
          false
        ),
        addBtn: this.vaildData(
          this.permission[`outsys-weixiu-add`],
          false
        ),
        viewBtn: this.vaildData(
          this.permission[`outsys-weixiu-view`],
          false
        ),
        editBtn: this.vaildData(
          this.permission[`outsys-weixiu-edit`],
          false
        ),
        delBtn: this.vaildData(
          this.permission[`outsys-weixiu-del`],
          false
        ),
        tijiaoBtn: this.vaildData(
          this.permission[`outsys-weixiu-tijiao`],
          false
        ),
        shenheBtn: this.vaildData(
          this.permission[`outsys-weixiu-shenhe`],
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
    await this.meet()
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
    async Info () {
      getInfo().then(res => {
        this.userInfo = res.data.data;
        this.form.shenqr = this.userInfo.account
      })
    },
    async roleInfo () {
      const dataResFun = await getDepartment();
      this.rolename = dataResFun.data.data.deptName
      this.form.shenqcs = this.rolename
    },
    async meet(){
      const data = await getListDataEx();
      this.options.column[3].dicData = data.data.data
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
          this.handleAdd()
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
            leix:'3'
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
            leix:'3'
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
            leix:'3'
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
    //申请
    async handleAdd(){
      this.appTag = true
      this.showform = true
      await this.Info()
      await this.roleInfo()
    },
    //添加物品
    addWupin(){
      let obj = {}
      obj = {...this.form}
      this.wupinList.push(obj)
      this.form.wupgg = ''
      this.form.wupmc = ''
      this.form.weibr = ''
      this.form.weibgs = ''
      this.form.weibrlxdh = ''
      this.options.column[5].display = false
      this.options.column[6].display = false
      this.options.column[7].display = false
    },
    //删除物品
    delWupin(item,index){
      this.wupinList.splice(index,1)
    },
    appClose(){
      this.appTag = false
      this.showform = false
      this.wupinList = []
      this.form = {}
    },
    //查看
    async comFormMagView (row) {
      this.showShenhe = false
      if (this.tabType !== 'DONE') {
        if(row.shiftj == "草稿"){
          this.dataMagFormTag = false
          this.appTag = true
          this.showform = true
          this.showAdd = false
          this.showSure = false
          let param = new URLSearchParams()
          param.append("id", row.id)
          viewListData(param).then((res) => {
            this.form.shenqr = res.data.data.shenqr
            this.form.shenqcs = res.data.data.shenqcs
            this.form.wupmc = res.data.data.wupmc
            this.form.wupgg = res.data.data.wupgg
            if(res.data.data.weibr){
              this.options.column[5].display = true
              this.options.column[6].display = true
              this.options.column[7].display = true
              this.form.weibgs = res.data.data.weibgs
              this.form.weibr = res.data.data.weibr
              this.form.weibrlxdh = res.data.data.weibrlxdh
            }else{
              this.options.column[5].display = false
              this.options.column[6].display = false
              this.options.column[7].display = false
            }
          }, error => {
            window.console.log(error);
            this.onLoad(this.page);
          });
        }else{
          this.showform = true
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
        this.showform = true
        this.dataMagFormTag = true;
        this.verifyParamData = {
          taskId: row.aicos_task_id,
          processInstanceId: row.aicos_process_instance_id,
          processDefinitionId: row.aicos_process_definition_id,
          taskDefinitionKey: row.aicos_task_definition_key,
        };
      }
      this.options.column[5].display = false
      this.options.column[6].display = false
      this.options.column[7].display = false
      this.dataMagFormSubType = "view";
      this.dataMagFormTitle = "数据查看";
      this.dataInitId = row.id;
      const params = new URLSearchParams();
      params.append("id", row.id);
      const dataResFun = await viewListData(params);
      const dataRes = dataResFun.data.data;
      this.form.shenqr = dataRes.shenqr
      this.form.shenqcs = dataRes.shenqcs
      this.form.wupmc = dataRes.wupmc
      this.form.wupgg = dataRes.wupgg
      if(dataRes.weibr){
        this.options.column[5].display = true
        this.options.column[6].display = true
        this.options.column[7].display = true
        this.form.weibgs = dataRes.weibgs
        this.form.weibr = dataRes.weibr
        this.form.weibrlxdh = dataRes.weibrlxdh
      }else{
        this.options.column[5].display = false
        this.options.column[6].display = false
        this.options.column[7].display = false
      }
    },
    //新增申请
    saveList(){
      this.btnLoading = true
      const dataParam = {
        shenqr:this.form.shenqr,
        shenqcs:this.form.shenqcs,
        wupmc:this.form.wupmc,
        wupgg:this.form.wupgg,
        weibgs:this.form.weibgs,
        weibr:this.form.weibr,
        weibrlxdh:this.form.weibrlxdh,
        leix:'3',
      };
      if(this.editId){
        dataParam.id = this.editId
      }
      saveOrUpdateListData(dataParam).then(() => {
        this.btnLoading = false
        this.appTag = false
        this.showform = false
        this.wupinList = []
        this.form = {}
        this.onLoad(this.page);
        this.$message({
          type: "success",
          message: "操作成功!"
        });
      }, error => {
        window.console.log(error);
      });
    },
    
    //编辑
    async comFormMagUpdate (row) {
      this.editId = row.id
      this.appTag = true
      this.showform = true
      this.options.column[2].display = true
      this.options.column[3].display = true
      this.options.column[4].display = true
      this.showAdd = true
      this.showSure = true
      let param = new URLSearchParams()
      param.append("id", row.id)
      viewListData(param).then((res) => {
        this.form.shenqr = res.data.data.shenqr
        this.form.shenqcs = res.data.data.shenqcs
        this.form.wupmc = dataRes.wupmc
      this.form.wupgg = dataRes.wupgg
      }, error => {
        window.console.log(error);
        this.onLoad(this.page);
      });
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
      this.options.column[5].display = false
      this.options.column[6].display = false
      this.options.column[7].display = false
      const params = new URLSearchParams();
      params.append("id", row.id);
      const dataResFun = await viewListData(params);
      const dataRes = dataResFun.data.data;
      this.form.shenqr = dataRes.shenqr
      this.form.shenqcs = dataRes.shenqcs
      this.wupinList = dataRes.godDetailApplicationList
    },
    //提交
    comFormTijiao (row) {
      this.$confirm("确认提交?", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          // const params = new URLSearchParams();
          // params.append("formDataId", row.id);
          return submitListData({formDataId:row.id})
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
      this.btnLoading = false
    },
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
.table tr {
  height: 40px;
}

.table tr td {
  line-height: 40px;
  text-align: center;
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
