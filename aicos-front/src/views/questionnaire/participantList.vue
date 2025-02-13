<template>
  <div class="qusnList qsgMain">
    <HuilanBasicToolbar>
      <el-button
        type="primary" 
        size="small" 
        @click.stop="batchInvalid(1)"
        v-if="( permissionList.invalidBtn  ) "
        >批量标记无效</el-button>
      <el-button
        type="success" 
        size="small" 
        @click.stop="batchInvalid(0)"
        v-if="( permissionList.invalidBtn  ) "
        >批量恢复有效</el-button>
      <el-button
        type="primary" 
        size="small" 
        @click.stop="batchOut(0)"
        v-if="( permissionList.outBtn  ) "
        >导出有效参与信息</el-button>
        <el-button
        type="primary" 
        size="small" 
        @click.stop="batchOut('ALL')"
        v-if="( permissionList.outBtn  ) "
        >导出全部参与信息</el-button>
      <el-button
        type="warning" 
        size="small" 
        @click.stop="rejectConfigShow"
        v-if="( permissionList.pickBtn  ) "
        >剔除无效样本</el-button>
      <el-button
        type="danger" 
        size="small" 
        @click.stop="batchDelete"
        v-if="( permissionList.delBtn  ) "
        >批量删除</el-button>
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
          v-if="( permissionList.outBtn )"
          @click.stop="viewRow(scope.row, scope.index)"
          >参与信息
        </el-button>

        <el-button
          type="text"
          size="small"
          v-if="( permissionList.viewBtn  )"
          @click.stop="detailOpen(scope.row, scope.index)"
          >问卷明细
        </el-button>
        <el-button
          type="text"
          size="small"
          v-if="( permissionList.invalidBtn && (scope.row.invalidStatus == 0) )"
          @click.stop="invalidRow(scope.row, scope.index)"
          >标记无效
        </el-button>
        <el-button
          type="text"
          size="small"
          v-if="( permissionList.invalidBtn && (scope.row.invalidStatus == 1) )"
          class="meunSuccess"
          @click.stop="invalidRow(scope.row, scope.index)"
          >恢复有效
        </el-button>


        <el-button
          type="text"
          size="small"
          v-if="( permissionList.delBtn )"
          @click.stop="deleteRow(scope.row, scope.index)"
          >删除
        </el-button>
        
      </template>
      
      <template slot="doTimeForm" slot-scope="scope">
        <div class="doTimeViewForm">{{ initSecond(scope.row.doTime,'cn') }} </div>
      </template>
    </avue-crud>

    <QSGDrawer :title="invalidTitle"
      :fullscreen="false"
      :size="600"
      append-to-body
      :visible.sync="invalidTag"
      :wrapperClosable="false"
      >
      <avue-form
        :class="invalidClass"
        :option="invalidOption"
        ref="invalidRef"
        v-model="invalidData"
        :key="invalidKey"
        >
        <template slot-scope="scope" slot="tipsText">
          <div>
            <el-link 
              :underline="false"
              type="warning"
              icon="el-icon-warning"
              > 确认将 {{invalidBatchData.ids.length}} 条数据标记为无效样本？
            </el-link>
          </div>
        </template>
      </avue-form>

      <template v-slot:footer>
        <el-button size="small" icon="el-icon-circle-plus-outline" type="primary" @click.stop="invalidSave">确 定</el-button>
        <el-button size="small" icon="el-icon-circle-close" @click.stop="invalidClose">取 消</el-button>
      </template>
    </QSGDrawer>

    <QSGDrawer :title="rejectTitle"
      :fullscreen="false"
      :size="600"
      :visible.sync="rejectTag"
      :wrapperClosable="false"
      >
      <avue-form
        :class="rejectClass"
        :option="rejectOption"
        ref="rejectRef"
        v-model="rejectData"
        :key="rejectKey"
        >
        <template slot-scope="scope" slot="rejectByTime">
          <div class="rejectItem">
            <div class="rejectBy">
              <el-checkbox
                v-model="rejectConfig.rejectByTime"
                >剔除答题时间过短问卷
              </el-checkbox>
            </div>
            <div class="rejectSet rejectByTime" v-if="rejectConfig.rejectByTime">
              <span>答题时间小于</span>
              <el-input-number 
                v-model="rejectByTimeSet.val"
                controls-position="right"
                min="0"
                max="9999"
                ></el-input-number>
              <el-select v-model="rejectByTimeSet.unit">
                <el-option label="秒" value="s"></el-option>
                <el-option label="分" value="m"></el-option>
              </el-select>
            </div>
          </div>
        </template>
        <template slot-scope="scope" slot="rejectBySameOption">
          <div class="rejectItem">
            <div class="rejectBy">
              <el-checkbox
                v-model="rejectConfig.rejectBySameOption"
                >剔除选择类答案相同的问卷（需要至少设置两题）
              </el-checkbox>
            </div>
            <div class="rejectSet rejectBySameOption" v-if="rejectConfig.rejectBySameOption">
              <div 
                class="rejectBySameOptionSet"
                :class="((validateSetRes.rejectBySameOption)?'erro':'')"
              >
                <el-checkbox-group 
                  v-model="rejectBySameOptionSet"
                  :min="2"
                  >
                    <el-checkbox
                      v-for="(item, index) in qusnFrontJson.column"
                      :key="item.prop"
                      :label="item.prop"
                      v-if="['radioQusn','checkboxQusn','selectQusn'].includes(item.typeQusn)"
                      :checked="true"
                      :disabled="false"
                      :indeterminate="false"
                      class="rejectSetli"
                      >
                      <span class="rejectSetSubject">{{(index+1)}}、{{item.label}}</span>
                    </el-checkbox>
                </el-checkbox-group>
                <div v-if="(validateSetRes.rejectBySameOption)" class="el-form-item__error">
                  剔除规则设置异常，需要至少设置两题
                </div>
              </div>
            </div>
          </div>
        </template>
        <template slot-scope="scope" slot="rejectByAnswer">
          <div class="rejectItem">
            <div class="rejectBy">
              <el-checkbox
                v-model="rejectConfig.rejectByAnswer"
                >根据回答内容进行剔除无效样本
              </el-checkbox>
            </div>
            <div class="rejectSet rejectByAnswer" v-if="rejectConfig.rejectByAnswer">

              <div 
                class="rejectByAnswerList"
                v-for="(item, index) in rejectByAnswerSet"
                :key="'rejectByAnswerSet_'+index"
                >
                <div class="answerLeft">
                  <el-form
                    ref="rejectByAnswerRef" 
                    size="small" 
                    :model="item" 
                    label-width="110px" 
                    label-suffix=":"
                    >
                    <el-form-item 
                      label="题目"
                      prop="subjectId"
                      :rules="[
                        { required: true, message: '请选择题目', trigger: 'blur' },
                      ]"
                      >
                      <el-select 
                        v-model="item.subjectId" 
                        placeholder="请选择题目"
                        >
                        <el-option
                          v-for="(info,im) in qusnFrontJson.column"
                          :key="'rejectByAnswerSetSubjectId_'+index+'_'+info.value"
                          :label="labelText(info.label,im,'subject')"
                          :value="info.prop"
                          v-if="(info.typeQusn != 'htmlQusn')"
                          >
                        </el-option>
                      </el-select>
                    </el-form-item>
                    <el-form-item 
                      label="题目答案"
                      prop="subjectOptionText"
                      :rules="[
                        { required: true, message: '请设置剔除规则', trigger: 'blur' },
                      ]"
                      >

                      <div class="subjectOptionGroupW" v-if="showSubjectOption(item.subjectId)">
                        <el-radio-group v-model="item.subjectOptionId" class="subjectOptionGroup">
                          <div
                            v-for="(mobj,m) in qusnFrontJson.column"
                            :key="'ctrlValCb_'+i+'_'+m"
                            >
                            <div
                              v-if="(mobj.prop == item.subjectId)"
                              >
                              <el-radio 
                                v-for="(opn,oi) in mobj.dicData"
                                :key="'ctrlValArr_'+index+'_'+m+'_'+oi"
                                :label="opn.value"
                                class="subjectOption"
                                >
                                <span
                                  class="ctrlValOptionText">
                                  {{ labelText(opn.label,oi,'option') }}
                                  <!-- {{opn.label}} -->
                                </span>
                              </el-radio>
                            </div>
                          </div>
                        </el-radio-group>
                      </div>

                      <el-input 
                        v-model="item.subjectOptionText"
                        v-if="( !showSubjectOption(item.subjectId) ||  showSubjectOptionText(item.subjectId,item.subjectOptionId) )"
                        :clearable="true"
                        ></el-input>
                    </el-form-item>
                  </el-form>
                  

                </div>
                <div class="answerRight">
                  <el-button 
                    size="mini" 
                    circle
                    icon="el-icon-delete" 
                    type="danger" 
                    @click.stop="rejectByAnswerDel(index)"
                    ></el-button>
                </div>
 
              </div>
              <div v-if="(validateSetRes.rejectByAnswer)" class="el-form-item__error">
                剔除规则设置异常，需要至少设置一个题目的剔除规则
              </div>
              <div 
                class="rejectByAnswerList"
                v-if="(rejectByAnswerSet.length > 1)"
                >
                <el-form-item 
                  label="题目之间关系"
                  label-width="110px" 
                  label-suffix=":"
                  >
                  <div>
                    <el-radio v-model="rejectByAnswerRelation" label="and">并且</el-radio>
                    <el-radio v-model="rejectByAnswerRelation" label="or">或者</el-radio>
                  </div>
                  </el-form-item>
              </div>
              <div class="answerAdd">
                <el-button 
                  size="small" 
                  icon="el-icon-circle-plus-outline" 
                  type="primary" 
                  @click.stop="rejectByAnswerAdd()"
                  >增加剔除规则</el-button>
              </div>
              
              
            </div>
          </div>
        </template>
        <template slot-scope="scope" slot="rejectBySameIp">
          <div class="rejectItem">
            <div class="rejectBy">
              <el-checkbox
                v-model="rejectConfig.rejectBySameIp"
                >剔除相同IP重复作答
              </el-checkbox>
            </div>
          </div>
        </template>
        <template slot-scope="scope" slot="rejectBySameDeviceId">
          <div class="rejectItem">
            <div class="rejectBy">
              <el-checkbox
                v-model="rejectConfig.rejectBySameDeviceId"
                >剔除相同设备重复作答
              </el-checkbox>
            </div>
          </div>
        </template>
      </avue-form>

      <template v-slot:footer>
        <el-button size="small" icon="el-icon-circle-plus-outline" type="primary" @click.stop="rejectSave">确 定</el-button>
        <el-button size="small" icon="el-icon-circle-close" @click.stop="rejectClose">取 消</el-button>
      </template>
    </QSGDrawer>

    <HuilanDialog :title="RejectListTitle"
      :fullscreen="false"
      width="960px"
      append-to-body
      :visible.sync="RejectListTag"
      

      >
      <RejectList
        :qusnConfig="qusnOption"
        :rejectList="rejectListData"
        :key="rejectListKey"
        @parentRefresh="refreshChange"
        @openView="detailOpen"
        @markInvalid="markInvalid"
        >
      </RejectList>
    </HuilanDialog>

    <HuilanDialog :title="detailTitle"
      :fullscreen="false"
      width="960px"
      size="960px"
      append-to-body
      :visible.sync="detailTag"
      :key="detailKey"
      :closeOnClickModal="true"
      >
      <QusnView
        ref="qusnFormRef"
        :data="qusnFormData"
        :option="qusnFrontJson"
        :qusnConfig="qusnOption"
        :key="detailKey"
        :showTime="false"
        :viewDetail="true"
        >
      </QusnView>
    </HuilanDialog>

  </div>
</template>
<script>
import {mapGetters} from "vuex";
import QSGSearchBar from '@/components/QSGSearchBar/index';
import QSGDrawer from "@/components/QSGDrawer/index";

import { isNull, initDate, initSecond, getHtmlPlainText } from '@/util/qsgCommon.js';

import { getRules } from "@/util/regx";


import RejectList from "./rejectList";

import { baseURL } from '@/api/common';
//import serviceList from "@/config/serviceList";

import QusnView from '@/components/QusnView/index';

import { 
  getStatisticsList,
  invalidStatisticsList,
  rejectStatisticsList,
  delStatisticsList,
  outStatisticsList,
} from "@/api/questionnaire/index";

export default {
  name: 'ParticipantList',
  components: {
    QSGSearchBar,
    QSGDrawer,
    RejectList,
    QusnView,
  },
  computed: {
    ...mapGetters(["userInfo","permission"]),
    permissionList() {
      return {
        invalidBtn: this.vaildData(this.permission[`qusn-sta-invalid`], false),
        pickBtn: this.vaildData(this.permission[`qusn-sta-pickInvalid`], false),
        delBtn: this.vaildData(this.permission[`qusn-sta-delete`], false),
        outBtn: this.vaildData(this.permission[`qusn-sta-out`], false),
        viewBtn: this.vaildData(this.permission[`qusn-sta-view`], false),
      }
    },
  },
  props: {
    qusnConfig: {
      type: Object,
      default() {
        return {
          column:[],
        };
      }
    },
  },
  data() {
    return {
      initSecond: initSecond,

      getHtmlPlainText: getHtmlPlainText,

      qusnOption:{},
      qusnId:'',
      qusnFrontJson:{},

      
      qusnFormData: {},
      qusnFormKey: 0,
      detailKey: 0,

      searchForm:{},
      loading: true,
      page: {
        "pageSize": 10,
        "currentPage": 1,
        "total": 0,
        "pageSizes": [ 10, 20, 30, 40, 50, 100 ]
      },

      listForm: {},
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
        //dialogType: 'drawer',
        dialogClickModal: true,
        dialogWidth: "30%",
        dialogType: 'drawer',
        dialogCustomClass: 'huilan-drawer-form',
        span: 24,
        labelWidth: 90,
        menuWidth: 300,

        column: [
          {
            label: 'ID',
            prop: 'id',
            hide: true,
            disabled: true,
            display: false,
          },
          {
            label: 'IP地址',
            prop: 'ipAddress',
            align: 'center',
            //width: 160,
            search: true,
          },
          {
            label: '账号',
            prop: 'account',
            align: 'center',
            search: true,
            width: 160,
          },
          {
            label: '答题开始',
            prop: 'startTime',
            align: 'center',
            width: 160,
            formatter: (val/*, value*/) => {
              return initDate(val.startTime,'HH:mm:ss');
            },
          },
          {
            label: '答题结束',
            prop: 'endTime',
            align: 'center',
            width: 160,
            formatter: (val/*, value*/) => {
              return initDate(val.endTime,'HH:mm:ss');
            },
          },
          {
            label: '答题用时',
            prop: 'doTime',
            align: 'center',
            formatter:(val/*,value,label*/)=>{
              return initSecond(val.doTime,'cn')
            },
            width: 120,
          },
          {
            label: '样本状态',
            prop: 'invalidStatus',
            align: 'center',
            type: 'select',
            dicData: [
              {label:'无效', value: 1},
              {label:'有效', value: 0}
            ],
            width: 120,
            search: true,
            searchType: 'select',
          },
          {
            label: '参与时间',
            prop: 'createTime',
            //hide: true,
            display: false,
            align: 'center',
            width: 160,
          },

        ],
      },

      invalidRowData: {},
      invalidBatchData: { batch: false , ids: [] ,toStatus: 0 },

      invalidTitle: '标记为无效',
      invalidClass: '',
      invalidTag: false,
      invalidData: {},
      invalidKey: 0,
      invalidOption: {
        submitBtn:false,
        emptyBtn:false,
        labelWidth:120,
        labelPosition: 'right',
        column: [
          {
            label: '',
            //labelWidth:0,
            formslot:true,
            prop: 'tipsText',
            span: 24,
          },
          {
            label: '无效原因',
            prop: 'invalidReason',
            span: 24,
            type:'select',
            dicData:[
              { label: '相同IP重复作答', value: '相同IP重复作答'},
              { label: '作答时间过短', value: '作答时间过短'},
              { label: '开放题乱答', value: '开放题乱答'},
              //{ label: '相同设备重复作答', value: '相同设备重复作答'},
              { label: '其他', value: 'Other'},
            ],
            change:({value/*,column*/}) => {
              const otherColumn = this.findObject(this.invalidOption.column, "invalidReasonOther"); 

              if( value == 'Other'){
                this.$set(otherColumn,'display', true);
              }else{
                this.$set(otherColumn,'display', false);
              }
              
            },
            rules: [
              {
                required: true,
                message: "请选择无效原因",
                trigger: "blur"
              },
            ],
          },
          {
            label: '其他原因',
            prop: 'invalidReasonOther',
            span: 24,
            display: false,
            maxlength: 100,
            showWordLimit: true,
            rules: [
              {
                required: true,
                message: "请输入其他原因",
                trigger: "blur"
              },
              ...getRules(['notEnSpecials'])
            ],
          },
        ]
      },

      rejectConfig: {
        rejectByTime: false,
        rejectBySameOption: false,
        rejectByAnswer: false,
        rejectBySameIp: false,
        rejectBySameDeviceId: false,
      },
      validateSetRes: {
        rejectBySameOption: false,
        rejectByAnswer: false,
      },

      rejectByTimeSet:{
        val: 30,
        unit: 's',
      },
      rejectBySameOptionSet: [],
      rejectByAnswerSet: [],
      rejectByAnswerRelation: 'and',

      rejectTitle: '剔除无效样本设置',
      rejectTag: false,
      rejectClass: 'rejectConfig',
      rejectData: {},
      rejectKey: 0,
      rejectOption: {
        submitBtn:false,
        emptyBtn:false,
        labelSuffix: '',
        labelWidth: 0 ,
        labelPosition: 'right',
        column: [
          { 
            label: '',
            //labelTip: '相同IP重复作答',
            formslot:true,
            prop: 'rejectBySameIp',
            span: 24,
          },
          {
            label: '',
            //labelTip: '相同设备重复作答',
            formslot:true,
            display: false,
            prop: 'rejectBySameDeviceId',
            span: 24,
          },
          { 
            label: '',
            //labelTip: '答题时间',
            formslot:true,
            prop: 'rejectByTime',
            span: 24,
          },
          { 
            label: '',
            //labelTip: '量表题答案相同',
            formslot:true,
            prop: 'rejectBySameOption',
            span: 24,
          },
          { 
            label: '',
            //labelTip: '根据回答内容剔除',
            formslot:true,
            prop: 'rejectByAnswer',
            span: 24,
          },
          
        ]
      },

      RejectListTitle: '剔除无效样本',
      RejectListTag: false,
      rejectListData: {},
      rejectListKey: 0,

      detailTitle: '问卷明细',
      detailTag: false,

    }
  },
  methods: {
    async getOverview(){
      this.qusnOption = this.deepClone( this.qusnConfig );
      this.qusnId = this.qusnOption.id;
      this.qusnFrontJson = JSON.parse( this.qusnOption.editorFrontJson ); 
    },

    configColumn() {
      this.$refs.listRef.$refs.dialogColumn.columnBox = true;
    },
    viewRow(row, index){
      this.$refs.listRef.rowView(row, index);
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
        return  delStatisticsList( {id:row.id} );
      }).then(() => {
        this.$message({
          type: "success",
          message: "操作成功",
        });
        this.refreshChange();
      })
    },

    batchDelete(){
      if (this.selectionList.length == 0) {
        this.$message({
          type: 'warning',
          message: '请选择需要处理的数据'
        })
      } else {

        this.$confirm('确认删除 ' + this.selectionList.length + ' 条数据？', '提示', {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(() => {
          const selectIds = this.selectionList.map(item=>item.id);

          delStatisticsList({id:selectIds.join()}).then((/*res*/)=>{
            this.refreshChange();
            this.$message({
              type: "success",
              message: "操作成功",
            });
          }, error => {
            window.console.log(error);
          })
        });

      }
    },

    /*
    updateStatusRow(row, index){

    },*/
    /*rowSave(row, done, loading) {

    },*/
    /*async rowUpdate(row, index, done, loading) {

      const dataParam = {
        ...row,
      };

      await updateBankList(dataParam).then(() => {
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

    },*/
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

      if( isNull(this.qusnId) ){
        return false
      }
      this.loading = true;
      
      const dataParam = {
        ...params,
        ...this.query,
        "current": page.currentPage,
        "size": page.pageSize,
        "questionnaireId": this.qusnId,
      }

      getStatisticsList(dataParam).then(res => {
        const dataRes = res.data.data;
        this.page.total = dataRes.total;
        this.page.pageSize = dataRes.size;
        this.page.currentPage = dataRes.current;
        this.listData = dataRes.records;

        this.loading = false;
        this.selectionClear();
      });
    },
    batchInvalid(toStatus){

      this.invalidBatchData = { batch: false , ids: [] ,toStatus: 0 };

      if (this.selectionList.length == 0) {
        this.$message({
          type: 'warning',
          message: '请选择需要处理的数据'
        })
      } else {
        const selectIds = this.selectionList.map(item=>item.id);

        if(toStatus == 0){
          this.$confirm('确认将 ' + this.selectionList.length + ' 条数据恢复为有效样本？', '提示', {
            confirmButtonText: "确定",
            cancelButtonText: "取消",
            type: "warning"
          }).then(() => {
            this.markInvalid(selectIds, toStatus,'批量恢复有效');
          });
        }else{
          
          this.invalidTitle= '批量标记为无效';
          this.invalidBatchData = { batch: true , ids: selectIds ,toStatus: toStatus};
          this.invalidKey++;
          this.invalidTag = true;

          this.invalidShowBatchTips(true);
        }
        

      }
    },
    invalidShowBatchTips(canShow){
      
      const tipsTextColumn = this.findObject(this.invalidOption.column, "tipsText");
      this.$set(tipsTextColumn,'display', canShow);
    },

    invalidRow(row/*,index*/){
      
      if( row.invalidStatus == 1 ){
        this.markInvalid([row.id], (row.invalidStatus == 1?0:1),'恢复有效' );
      }else{
        this.invalidShowBatchTips(false);
        this.invalidTitle= '标记为无效';
        this.invalidRowData = row;
        this.invalidKey++;
        this.invalidTag = true;
      }
    },
    invalidClose(){
      this.invalidBatchData = { batch: false , ids: [] ,toStatus: 0};
      this.invalidRowData = {};
      this.invalidKey++;
      this.invalidData = {};
      this.invalidTag = false;
    },
    invalidSave(){
      this.$refs.invalidRef.validate((boolean/*, object*/)=>{
        if(boolean){

          let reason = this.invalidData.invalidReason == 'Other'? this.invalidData.invalidReasonOther :this.invalidData.invalidReason ;
      
          if( this.invalidBatchData.batch ){
            /*批量标记无效*/
            this.markInvalid(this.invalidBatchData.ids, this.invalidBatchData.toStatus , '批量标记_'+reason );
          }else{
            this.markInvalid([this.invalidRowData.id], (this.invalidRowData.invalidStatus == 1?0:1), reason );
          } 
        }
      })


      
    },
    async markInvalid(ids, toStatus, reason){
      await invalidStatisticsList({
        "id": ids.join(),
        "invalidStatus": toStatus,
        "invalidReason": reason || '未备注',
      }).then((/*res*/)=>{
        this.refreshChange();
        this.invalidClose();
        this.$message({
          type: "success",
          message: "操作成功",
        });
      }, error => {
        window.console.log(error);
      })
    },

    rejectConfigShow(){
      this.rejectTag = true;
    },
    rejectClose(){
      this.rejectTag = false;
    },

    rejectSave(){

      if( (this.rejectConfig.rejectBySameOption) && ( this.rejectBySameOptionSet.length < 2 )  ) {
        this.validateSetRes.rejectBySameOption = true;
        return false
      }

      if( (this.rejectConfig.rejectByAnswer) && ( this.rejectByAnswerSet.length < 1 )  ) {
        this.validateSetRes.rejectByAnswer = true;
        return false
      }

      if( this.rejectConfig.rejectByAnswer){
        this.rejectByAnswerSetJsonChange();
        //console.log(this.$refs.rejectByAnswerRef);
        let valiRes = true;
        this.$refs.rejectByAnswerRef.map((item)=>{
          item.validate((boolean/*, object*/)=>{
            //console.log(boolean, object)
            valiRes = valiRes && boolean ;
          })
        })
        if(!valiRes){
          return false
        }
      }
      
      let dataParam = [];
      let invalidType = 0;
      let invalidTypeText = {};

      for( let key in this.rejectConfig ){
        if( this.rejectConfig[key]) {
          if( key == 'rejectByTime' ){

            let timeSet = (this.rejectByTimeSet.unit == 'm'? (parseInt(this.rejectByTimeSet.val) * 60) : parseInt(this.rejectByTimeSet.val)  );
            invalidType = 1 ;
            invalidTypeText = {
              minAnswerTime: timeSet,
            };
          }else if( key == 'rejectBySameOption'){
            invalidType = 2 ;
            invalidTypeText = {
              subjectId: this.rejectBySameOptionSet.join(),
            };

          }else if( key == 'rejectByAnswer'){
            
            invalidType = 3 ;
            invalidTypeText = {
              relation: this.rejectByAnswerRelation,
              rule:this.rejectByAnswerSet,
            };

          }else if( key == 'rejectBySameIp'){
            invalidType = 4 ;
            invalidTypeText = {
              sameIp: true,
            };

          }else if( key == 'rejectBySameDeviceId'){
            invalidType = 5 ;
            invalidTypeText = {
              sameDeviceId: true,
            };

          }
          dataParam.push({
            questionnaireId: this.qusnId,
            invalidType: invalidType ,
            invalidTypeText: JSON.stringify( invalidTypeText ),
          });
        }
      }

      
      if( isNull( dataParam )) {
        this.$message.error("请设置剔除规则");
        return false
      }

      //console.log(dataParam);
     
      rejectStatisticsList(dataParam).then((res)=>{
        const dataRes = res.data.data;
        this.rejectListKey++;
        this.rejectListData = dataRes;

        this.RejectListTag = true;
        this.rejectClose();

      })
    },

    rejectByAnswerAdd(){
      this.rejectByAnswerSet.push({
        subjectId: '',
        subjectOptionId: '',
        subjectOptionText: '',
      })
    },

    rejectByAnswerDel(index){
      this.rejectByAnswerSet.splice(index, 1);
    },

    detailOpen(row/*,index*/){
      this.detailKey++;
      this.qusnFormData = this.deepClone( JSON.parse(row.frontAnswerJson ) );
      this.detailTag = true;
    },
    showSubjectOption(subjectId){
      let res = false;

      const columnData = this.qusnFrontJson.column.filter(item=> item.prop == subjectId );

      if( !isNull(columnData) ){
        if(['radioQusn','checkboxQusn','selectQusn'].includes(columnData[0].typeQusn) ){
          res = true
        }
      }
      
      return res
    },
    showSubjectOptionText(subjectId,optionId){
      let res = false;
      const columnData = this.qusnFrontJson.column.filter(item=> item.prop == subjectId );
      if( !isNull(columnData) ){
        if(['radioQusn','checkboxQusn','selectQusn'].includes(columnData[0].typeQusn) ){
          const dicSel = columnData[0].dicData.filter(info=> info.value == optionId )
          if(!isNull(dicSel)){
            if(dicSel[0].canInput) {
              res = true
            }
          } 
        }
      }
      
      return res
    },

    rejectByAnswerSetJsonChange(){
      if(!isNull(this.rejectByAnswerSet)){
        this.rejectByAnswerSet.map((item)=>{
          if(!isNull(item.subjectId) && !isNull(item.subjectOptionId)){
            const columnData = this.qusnFrontJson.column.filter(info=> info.prop == item.subjectId );
            if( !isNull(columnData) ){
              const dicSel = columnData[0].dicData.filter(mob=> mob.value == item.subjectOptionId )
              if(!isNull(dicSel) ){
                if( !dicSel[0].canInput){
                  item.subjectOptionText = dicSel[0].label;
                }
              }
            } 
          }
          return item
        })
      }
    },

    batchOut(type){

      const dataParam = {
        questionnaireId: this.qusnId,
        invalidStatus: ( type=="ALL"? '': type ),
      };

      outStatisticsList(dataParam).then((res)=>{
        const urlRes = `${baseURL}`+res.data.data.newFileName.substring(1) ;
        this.downFile(urlRes/*, fileName*/);

        this.refreshChange();
        this.$message({
          type: "success",
          message: "操作成功",
        });
      }, error => {
        window.console.log(error);
      })

    },

    labelText(label, index, type){
      let res = '';
      let labelNoHtml = getHtmlPlainText(label)
      if( labelNoHtml.length > 25) {
        res = labelNoHtml.substring(0,25)+'...'
      }else if( labelNoHtml.length < 1){
        res = (type == 'option'?'选项_':'题目_')+(index+1);
      }else {
        res = labelNoHtml
      }
      return res
    },
  
  },
  created(){
    
  },
  mounted () {
    this.refreshChange();
  },
  watch:{
    'qusnConfig': {
      handler() {
        this.getOverview();
        this.refreshChange();
      },
      deep: true
    },
    'rejectConfig.rejectBySameOption': {
      handler(){
        this.rejectBySameOptionSet = [];
      },
      immediate: true
    },
    'rejectConfig.rejectByAnswer': {
      handler(){
        this.rejectByAnswerSet = [];
      },
      immediate: true
    },
    'rejectBySameOptionSet':{
      handler(val){
        if( val.length < 2 )   {
          this.validateSetRes.rejectBySameOption = true;
        }else{
          this.validateSetRes.rejectBySameOption = false;
        }
      },
      immediate: true
    },
    'rejectByAnswerSet':{
      handler(val){
        if( val.length < 1 )   {
          this.validateSetRes.rejectByAnswer = true;
        }else{
          this.validateSetRes.rejectByAnswer = false;
        }
      },
      deep: true
    },
  }

}
</script>
<style lang="scss" scoped>
.rejectConfig{
  .rejectItem {
    .rejectBy {

    }
    .rejectSet {
      padding-top: 15px;
    }
    .rejectByTime {
      display: flex;
      justify-content: flex-start;
      align-items: center;
      &>:nth-child(1) { 
        padding-left: 25px;
        padding-right: 10px;
      }
      &>:nth-child(2) { 
        width: 160px;
      }
      &>:nth-child(3) { 
        max-width: 60px;
      }
    }
    .rejectBySameOption {
      &>div {
        padding: 10px 0;
        margin: 0;
        list-style: none;
        border: 1px solid #e4e7ed;
        &.erro{
          border: 1px solid #f05050;
        }
        .rejectSetli {
          display: flex;
          padding: 10px 0 10px 30px;
          margin: 0;
          list-style: none;
          /deep/.el-checkbox__input {
            margin-top: 2px;
          }
          .el-checkbox__label {
            
            .rejectSetSubject{
              display: -webkit-box;
              -webkit-box-orient: vertical;
              -webkit-line-clamp: 2;
              word-break: break-all;
              max-height: 66px;
              overflow: hidden;
              width: 100%;
              white-space: break-spaces;
            }
            
          }
          
        }
      }
    }

    .rejectByAnswer {
      .rejectByAnswerList {
        display: flex;
        border-bottom: 1px solid #e4e7ed;
        margin-top: 15px;
        .answerLeft {
          width: 100%;
        }
        .answerRight {
          width: 40px;
          flex-shrink: 0;
          margin-left: 10px;
        }
      }
      .answerAdd {
        margin-top: 15px;
        text-align: center;
        margin-bottom: 22px;
      }
    }

  }
}
.subjectOptionGroupW {
  width: 100%;
  .subjectOptionGroup {
    width: 100%;

    .subjectOption {
      display: flex;
      padding: 5px 0;
      margin-right: 0;
      width: 100%;
      .ctrlValOptionText {

      }
    }
  }
}
.doTimeViewForm {
  font-size: 14px; 
  color: #606266;
  padding: 0 12px;
}
</style>
