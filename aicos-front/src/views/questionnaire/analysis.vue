<template>
  <div class="qusnList qsgMain">
    <div class="anyMain">
        <div class="anyTitle">
          <div class="anyTitleLeft">
            <div class="anyName">问卷名称：<span>{{qusnConfig.questionnaireName}}</span></div>
          </div>
          <div class="anyTitleRight">
            <div class="anyBrowseCount">浏览次数：<span>{{qusnConfig.browseCount || 0}}</span></div>
            <div class="anySubmitNum">投票次数：<span>{{qusnConfig.submitNum || 0}}</span></div>
          </div>
        </div>

        <div
          v-for="(column, index) in qusnFormOption.column"
          :key="'column' + index"
          class="anyColumn"
          >
          <div
            v-if="['checkboxQusn', 'radioQusn', 'selectQusn', 'rateQusn'].includes(column.typeQusn)"
            class="anyHasSelect"
            :class="( tipByTypeQusn(column.typeQusn).class )"
            >

            <div class="anySubject">
              <div class="anySubjectLeft">
                <div class="anySubjectType">
                  <el-button
                    size="mini"
                    type="primary"
                    class="qusnIcon "
                    :class="( tipByTypeQusn(column.typeQusn).icon ) "
                    plain
                    round
                    >
                    {{ tipByTypeQusn(column.typeQusn).text }}
                  </el-button>
                </div>
                <div class="anySubjectLabel">
                  <div class="anySubjectLabelIndex" v-if="qusnFormOption.showLabelIndex">
                    {{ (index-1)+'、' }}
                  </div>
                  <div class="anySubjectLabelVal">
                    <div v-if="column.labelPlus" v-html="column.label"></div>
                    <div v-else>{{column.label}}</div>
                  </div>
                </div>
              </div>
              <div class="anySubjectRight">
                <div class="anySubjectCount" >投票次数：<span>{{ column.subjectCount }}</span></div>
                <div class="anySubjectChart" >
                  <el-button
                    type="text"
                    icon="el-icon-s-data"
                    @click.stop="showChart('bar',column)"
                    >
                  </el-button>
                  <el-button
                    type="text"
                    icon="el-icon-pie-chart"
                    @click.stop="showChart('pie',column)"
                    >
                  </el-button>
                </div>
              </div>
            </div>
            <div
              class="anyChartArea"

              >
              <div class="anyChartAreaInc" :ref="`Chart_${column.prop}`" ></div>
            </div>
            <div class="anyDic" >
              <div class="anyDicInc tableTh">
                <div class="anyDicLeft">
                  <div class="anyDicIndex">
                    序号
                  </div>
                  <div class="anyDicLabel">
                    选项内容
                  </div>
                </div>
                <div class="anyDicRight">
                  <div class="anyDicCount">
                    票数
                  </div>
                  <div class="anyDicProg">
                    比例
                  </div>
                </div>
              </div>
            </div>
            <div
              v-for="(dic, i) in column.dicData"
              :key="'dicData_radio_' + i"
              class="anyDic"
              >
              <div class="anyDicInc">
                <div class="anyDicLeft">
                  <div class="anyDicIndex">
                    {{(i+1)}}
                  </div>
                  <div class="anyDicLabel">
                    <span v-if="column.typeQusn == 'rateQusn'">
                      <!-- {{dic.label}} -->
                      <avue-rate
                        v-model="dic.numVal"
                        disabled
                        :max="column.max"
                        size="mini"
                        class="anyDicLabelRate"
                        ></avue-rate>

                    </span>
                    <span v-else>
                      <div class="anyDicLabelVal">
                        <div v-if="dic.labelPlus" v-html="dic.label"></div>
                        <div v-else>{{dic.label}}</div>
                      </div>
                      <!-- {{dic.label}} -->
                    </span>
                    <el-button
                      v-if="(permissionList.answerBtn && dic.canInput) "
                      type="text"
                      icon="el-icon-s-operation"
                      @click.stop="showAnswerText(column.prop,dic.value)"
                      >查看结果
                    </el-button>
                  </div>
                </div>
                <div class="anyDicRight">
                  <div class="anyDicCount">
                    {{dic.optionCount}}
                  </div>
                  <div class="anyDicProg">
                    <el-progress :text-inside="true" :stroke-width="20" :percentage="dic.percentage"></el-progress>
                  </div>
                </div>

              </div>
            </div>

          </div>
          <div v-else-if="['inputQusn', 'textareaQusn'].includes(column.typeQusn) " class="inputQusnFormItem">
            <div class="anySubject">
              <div class="anySubjectLeft">
                <div class="anySubjectType">
                  <el-button
                    size="mini"
                    type="primary"
                    class="qusnIcon "
                    :class=" ( tipByTypeQusn(column.typeQusn).icon )"
                    plain
                    round
                    >
                    {{  tipByTypeQusn(column.typeQusn).text  }}
                  </el-button>
                </div>
                <div class="anySubjectLabel">
                  <!-- {{ qusnFormOption.showLabelIndex?(index+1)+'、':'' }} {{column.label}} -->
                  <div class="anySubjectLabelIndex" v-if="qusnFormOption.showLabelIndex">
                    {{ (index-1)+'、' }}
                  </div>
                  <div class="anySubjectLabelVal">
                    <div v-if="column.labelPlus" v-html="column.label"></div>
                    <div v-else>{{column.label}}</div>
                  </div>
                </div>
              </div>
              <div class="anySubjectRight">
                <div class="anySubjectCount" >投票次数：<span>{{ column.subjectCount }}</span></div>
                <div class="anySubjectCount" >
                  <el-button
                    v-if="(permissionList.answerBtn)"
                    type="text"
                    icon="el-icon-s-operation"
                    @click.stop="showAnswerText(column.prop,'')"
                    >查看结果
                  </el-button>
                </div>
              </div>

            </div>

          </div>
          <div v-else-if="['htmlQusn'].includes(column.typeQusn) " class="htmlQusnFormItem">
            <div></div>
          </div>
          <div v-else>
            <div class="anySubject">
              <div class="anySubjectLeft">
                <div class="anySubjectType">
                  <el-button
                    size="mini"
                    type="primary"
                    class="qusnIcon qusnIcon-input"
                    plain
                    round
                    >
                    题目
                  </el-button>
                </div>
                <div class="anySubjectLabel">
                  <!-- {{ qusnFormOption.showLabelIndex?(index+1)+'、':'' }} {{column.label}}  -->
                  <div class="anySubjectLabelIndex" v-if="qusnFormOption.showLabelIndex">
                    {{ (index-1)+'、' }}
                  </div>
                  <div class="anySubjectLabelVal">
                    <div v-if="column.labelPlus" v-html="column.label"></div>
                    <div v-else>{{column.label}}</div>
                  </div>
                </div>
              </div>
              <div class="anySubjectRight">
                <div class="anySubjectCount" >投票次数：<span>{{ column.subjectCount }}</span></div>

              </div>

            </div>
          </div>
        </div>

    </div>


    <HuilanDialog :title="answerTitle"
      :fullscreen="false"
      width="960px"
      append-to-body
      :visible.sync="answerTag"
      :destroy-on-close="false"
      >
      <HuilanBasicToolbar>
        <el-button
          type="primary"
          size="small"
          @click.stop="batchHandle('Delete')"
          v-if="permissionList.delBtn"
          >批量删除</el-button>
          <el-button
          type="primary"
          size="small"
          @click.stop="batchHandle('AuditYes') "
          v-if="(permissionList.auditBtn && qusnConfig.isAudit == 1 )"
          >批量审核通过</el-button>
          <el-button
          type="primary"
          size="small"
          @click.stop="batchHandle('AuditNo')"
          v-if="(permissionList.auditBtn && qusnConfig.isAudit == 1 )"
          >批量审核不通过</el-button>
          <el-button
          type="primary"
          size="small"
          @click.stop="batchOut()"
          v-if="permissionList.outBtn"
          >导出全部</el-button>

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
        :key="answerTextKey"
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
            v-if="( permissionList.delBtn )"
            @click.stop="deleteRow(scope.row, scope.index)"
            >删除
          </el-button>
          <el-button
            type="text"
            size="small"
            v-if="( permissionList.auditBtn && (scope.row.auditStatus == 0 || scope.row.auditStatus == 2 ) && qusnConfig.isAudit == 1 )"
            @click.stop="auditRowYes(scope.row, scope.index)"
            >审核通过
          </el-button>
          <el-button
            type="text"
            size="small"
            v-if="( permissionList.auditBtn && (scope.row.auditStatus == 0 || scope.row.auditStatus == 1 ) && qusnConfig.isAudit == 1 )"
            @click.stop="auditRowNo(scope.row, scope.index)"
            >审核不通过
          </el-button>
        </template>

      </avue-crud>
    </HuilanDialog>


  </div>
</template>
<script>
// import * as echarts from 'echarts';
import {mapGetters} from "vuex";

import { baseURL } from '@/api/common';
//import serviceList from "@/config/serviceList";

import QSGSearchBar from '@/components/QSGSearchBar/index';

import {
  statisticsItem,
  statisticsSubject,
  getAnswerTextByPage,
  answerTextStatus,
  answerTextDel,
  answerTextOut
} from "@/api/questionnaire/index";

import { percentage, isNull, getHtmlPlainText } from '@/util/qsgCommon.js';

export default {
  name: 'Analysis',
  components: {
    QSGSearchBar
  },
  computed: {
    ...mapGetters(["permission"]),
    permissionList() {
      return {
        answerBtn: this.vaildData(this.permission[`qusn-sta-answerList`], false),
        auditBtn: this.vaildData(this.permission[`qusn-sta-answerAudit`], false),
        delBtn: this.vaildData(this.permission[`qusn-sta-answerDel`], false),
        outBtn: this.vaildData(this.permission[`qusn-sta-answerOut`], false),
      }
    },
  },
  props: {
    qusnConfig: {
      type: Object,
      default() {
        return {};
      }
    },
  },
  data() {
    return {
      analysisRes: {},
      qusnFormOption: {},

      answerTextKey: 0,

      answerTag: false,
      answerTitle: '查看结果',

      page: {
        "pageSize": 10,
        "currentPage": 1,
        "total": 0,
        "pageSizes": [ 10, 20, 30, 40, 50, 100 ]
      },

      searchForm:{},
      loading: true,
      listForm: {},
      selectionList: [],
      query: {
        subjectId: '',
        optionId: '',
        auditStatus: null,
      },
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
        labelWidth: 80,

        column: [
          {
            label: 'ID',
            prop: 'id',
            hide: true,
            disabled: true,
            display:false,
          },
          {
            label: 'IP',
            prop: 'ipAddress',
            width: 120,
            align: 'center',
          },
          {
            label: '审核状态',
            prop: 'auditStatus',
            width: 120,
            hide: false,
            align: 'center',
            type: 'select',
            search: true,
            searchType: 'select',
            dicData: [
              {
                label: '未审核',
                value: 0,
              },
              {
                label: '审核通过',
                value: 1,
              },
              {
                label: '审核不通过',
                value: 2,
              },
            ],
            value: 0,
          },

          {
            label: '填写内容',
            prop: 'answerText',
            search: true,
            //headerAlign: 'center',
            overHidden:true,
          },
          {
            label: '填写时间',
            prop: 'createTime',
            width: 160,
            align: 'center',

          },

        ],
      },

    }
  },
  methods: {
    async getOverview(){

      let temOption = { column:[] };

      if( !isNull(this.qusnConfig.editorFrontJson) ){
        temOption = JSON.parse(this.qusnConfig.editorFrontJson);
      }

      if( this.qusnConfig.isAudit != 1 ){
        const auditStatusColumn = this.findObject(this.listOption.column, "auditStatus");
        this.$set(auditStatusColumn,'hide', true);
      }

      const itemFun =  await statisticsItem({ id: this.qusnConfig.id });
      const itemRes = itemFun.data.data;

      const subjectFun =  await statisticsSubject({ id: this.qusnConfig.id });
      const subjectRes = subjectFun.data.data;

      temOption.column.map((item)=>{

        if(item.typeQusn == 'rateQusn'){
          item.dicData = [];
          for( let key = 1; key <= item.max; key++ ){
            item.dicData.push({
              "label": key+'分',
              "value": item.prop+'_Rm_rateOption_'+key,
              "numVal": key
            })
          }
        }
        item.subjectCount = item.subjectCount || 0;
        subjectRes.map((sub)=>{
          if( sub.subjectId == item.prop ){
            item.subjectCount = sub.subjectCount;
          }
        });

        itemRes.map((info)=>{
          if( info.subjectId == item.prop ){
            item.dicData.map((dic)=>{
              dic.optionCount = dic.optionCount || 0;
              if(dic.value == info.optionId){
                dic.optionCount = info.optionCount;
                dic.percentage = percentage( dic.optionCount , item.subjectCount )
              }
            })
          }
        })
      });

      this.qusnFormOption = this.deepClone( temOption );
      this.analysisRes = this.deepClone( temOption );
      //console.log(this.qusnFormOption);

    },

    showChart(chartType,column) {
      //console.log(this.$refs)
      //console.log(chartType,column)

      let chartBarX = [];
      let chartBarY = [];
      let chartPieData = [];
      column.dicData.map((item,index)=>{

        item.labelText = '';

        if( item.labelPlus ){
          item.labelText = getHtmlPlainText(item.label);
          if( isNull(item.labelText) ){
            item.labelText = "选项_"+(index+1);
          }
        }else{
          item.labelText = item.label;
        }

        chartBarX.push( item.labelText );
        chartBarY.push( item.percentage || 0);
        chartPieData.push({
          value: item.percentage || 0,
          name: item.labelText,
        })

      })

      let chartColor = ['#0045c8', '#91cc75', '#fac858', '#ee6666', '#73c0de', '#3ba272', '#fc8452', '#9a60b4', '#ea7ccc','#5470c6'];
      let chartBarOption = {
        color: chartColor,
        tooltip: {
          trigger: 'item',
          formatter: '{b}:{c}%'
        },
        xAxis: {
          type: 'category',
          data: chartBarX,
          axisLabel: {
            formatter: (value/*, index*/) =>{
              return (value.length>7)? value.substring(0,7)+'...': value;
            },
            interval: 0,
          }
        },
        yAxis: {
          type: 'value',
          max: 100,
        },

        series: [
          {
            data: chartBarY,
            type: 'bar',
            barMaxWidth: 50,
            showBackground: true,
            backgroundStyle: {
              color: '#ebeef5'
            },
            label: {
              show: true,
              formatter:'{c}%'
            }
          }
        ]
      };

      let chartPieOption = {
        color: chartColor,
        tooltip: {
          trigger: 'item',
          formatter: '{b}:{d}%'
        },
        legend: {
          show: false,
        },
        series: [
          {
            type: 'pie',
            radius: '80%',
            data: chartPieData,
            emphasis: {
              itemStyle: {
                shadowBlur: 10,
                shadowOffsetX: 0,
                shadowColor: 'rgba(0, 0, 0, 0.5)'
              }
            },
            label: {
              show: true,
              formatter:(params) =>{
                return  (params.name.length > 7)? params.name.substring(0,7)+'...'+ '('+params.value+'%)': params.name+ '('+params.value+'%)'
              },
              interval: 0,
            }
          }
        ]
      };
      //console.log(chartPieOption);

      const chartRef = this.$refs['Chart_'+column.prop][0];

      const havedClass = chartRef.getAttribute('class');
      //console.log( havedClass );

      if( havedClass.includes(chartType+'_active') ){
        chartRef.setAttribute('class', 'anyChartAreaInc ');
      }else{
        chartRef.setAttribute('class', 'anyChartAreaInc active '+chartType+'_active');
      }

      import('echarts').then((echarts)=>{
        echarts.dispose(chartRef);
        const chartInit = echarts.init(chartRef);
        chartInit.setOption((chartType=='pie')? chartPieOption:chartBarOption);
      })


    },
    showAnswerText(sid,oid){
      this.answerTextKey++;
      this.answerTag = true;
      this.query = {
        subjectId: sid,
        optionId: oid,
        auditStatus: null,
        answerText: '',
      }
      this.searchForm = this.query;

      //this.onLoad(this.page, this.query, sid, oid);
    },
    configColumn() {
      this.$refs.listRef.$refs.dialogColumn.columnBox = true;
    },

    searchReset() {
      this.query = {
        subjectId: this.query.subjectId,
        optionId: this.query.optionId,
        auditStatus: null,
      };
      this.searchForm = this.query;
      this.onLoad(this.page);
    },
    searchChange(params,done) {

      this.query = {
        ...params,
        subjectId: this.query.subjectId,
        optionId: this.query.optionId,
        //auditStatus: this.searchForm.auditStatus,
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
      this.getOverview();
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
        questionnaireId: this.qusnConfig.id,
        // subjectId: sid,
        // optionId: oid,
        // auditStatus: 0,
        current: page.currentPage,
        size: page.pageSize,
      }

      getAnswerTextByPage(dataParam).then(res => {
        const dataRes = res.data.data;
        this.page.total = dataRes.total;
        this.page.pageSize = dataRes.size;
        this.page.currentPage = dataRes.current;
        this.listData = dataRes.records;
        this.loading = false;
        this.selectionClear();
      });
    },

    tipByTypeQusn(typeQusn){
      let res = {
        text: '',
        icon: '',
        class: '',
      }
      switch(typeQusn){
        case 'radioQusn':
          res.text = '单选题';
          res.icon = 'qusnIcon-radio';
          res.class = 'anyHasRadio';
          break;

        case 'checkboxQusn':
          res.text = '多选题';
          res.icon = 'qusnIcon-checkbox';
          res.class = 'anyHasCheckbox';
          break;

        case 'selectQusn':
          res.text = '下拉选择题';
          res.icon = 'qusnIcon-select';
          res.class = 'anyHasSelect';
          break;

        case 'inputQusn':
          res.text = '单行文本';
          res.icon = 'qusnIcon-input';
          res.class = 'anyHasInput';
          break;

        case 'textareaQusn':
          res.text = '多行文本';
          res.icon = 'qusnIcon-textarea';
          res.class = 'anyHasTextarea';
          break;
        case 'rateQusn':
          res.text = '评分';
          res.icon = 'qusnIcon-star';
          res.class = 'anyHasRate';
          break;

        default:
      }

      return res
    },

    deleteRow(row){
      this.$confirm("确定将选择数据删除?", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(() => {
        this.deleteByIds(row.id);
      })
    },


    batchHandle(type){
      if (this.selectionList.length == 0) {
        this.$message({
          type: 'warning',
          message: '请选择需要处理的数据'
        })
      } else {

        this.$confirm('确认是否处理 ' + this.selectionList.length + ' 条数据？', '提示', {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(() => {
          const selectData = this.selectionList.map(item=>item.id);
          const selectIds = selectData.join();

          if( type == 'Delete') {

            this.deleteByIds(selectIds);

          } else if( type == 'AuditYes'){

            this.auditByIds(selectIds,1);

          } else if( type == 'AuditNo'){

            this.auditByIds(selectIds,2);

          }else if( type == 'Out'){

            window.console.log("导出")
          }

        });

      }
    },

    deleteByIds(ids){

      answerTextDel({id:ids}).then((/*res*/)=>{
        this.refreshChange();
        this.$message({
          type: "success",
          message: "操作成功",
        });
      }, error => {
        window.console.log(error);
      })
    },

    auditRowYes(row){
      this.auditByIds(row.id,1);
    },

    auditRowNo(row){
      this.auditByIds(row.id,2);
    },

    auditByIds(ids,toStatus){

      const dataParam = {
        id: ids,
        auditStatus: toStatus,
      }

      answerTextStatus(dataParam).then((/*res*/)=>{
        this.refreshChange();
        this.$message({
          type: "success",
          message: "操作成功",
        });
      }, error => {
        window.console.log(error);
      })

    },

    batchOut(){

      const dataParam = {
        // ...this.query,
        // ...this.$refs.searchFormRef.getData(),
        questionnaireId: this.qusnConfig.id,
        subjectId: this.query.subjectId,
        optionId: this.query.optionId,
      }

      answerTextOut(dataParam).then((res)=>{
        const urlRes = `${baseURL}`+res.data.data.newFileName.substring(1) ;
        this.downFile(urlRes/*, fileName*/);

        this.refreshChange();
        this.$message({
          type: "success",
          message: "操作成功!"
        });
      }, error => {
        window.console.log(error);
      });
    },


  },
  created(){

  },
  watch:{
    'qusnConfig': {
      handler() {
        this.getOverview();
      },
      deep: true
    },
  }

}
</script>

<style lang="scss" scoped>
.anyMain {
  .anyTitle {
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-size: 14px;
    padding: 15px 0;
    border-bottom: 2px solid #e4e7ed;

    .anyTitleLeft {

    }
    .anyTitleRight {
      display: flex;
    }
    .anyName {

      span {
        font-size: 18px;
        font-weight: 500;
      }
    }
    .anyBrowseCount {
      margin-right: 15px;
    }
    .anySubmitNum {

    }
  }

  .anyColumn {
    border-bottom: 1px solid #e4e7ed;
    padding-bottom: 20px;
    .anyHasSelect {

    }
    .anyHasRadio {

    }
    .anyHasCheckbox {

    }
    .anySubject {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      position: relative;
      line-height: 20px;
      padding: 20px 20px 15px;
      background-color: #f4f4f5;
      .anySubjectLeft {
        display: flex;
        width: 100%;
        .anySubjectType {
          margin-right: 12px;
          .el-button {
            font-size: 12px;
            padding: 4px 8px;
          }
        }
        .anySubjectLabel {
          display: flex;
          justify-content: flex-start;
          align-items: center;
          .anySubjectLabelIndex {
            width: 30px;
            flex-shrink: 0;
          }
          .anySubjectLabelVal {
            width: 100%;
            max-width: 900px;
            max-height: 200px;
            overflow: hidden;
          }
        }
      }
      .anySubjectRight {
        display: flex;
        align-items: center;
        flex-shrink: 0;
        margin-left: 20px;
        .anySubjectCount {

          font-size: 14px;
          text-align: right;
          margin-right: 15px;

        }
        .anySubjectChart {

          .el-button {
            padding: 0;
            font-size: 22px;
          }
        }
      }
    }
    .anyChartArea {

      .anyChartAreaInc {
         display: none;
         width: 100%;
         max-width: 640px;
         height: 350px;
         margin: 0 auto;
         &.active {
          display: block;
         }
      }
    }
    .anyDic {
      font-size: 14px;
      line-height: 20px;
      .anyDicInc {
        display: flex;
        justify-content: space-between;
        align-items: flex-start;
        padding: 10px 20px;
        border-bottom: 1px solid #f3f5f8;
        &:hover {
          background-color: #f7f9fb;
        }
        .anyDicLeft {
          display: flex;
          width: 100%;
        }
        .anyDicRight {
          display: flex;
          flex-shrink: 0;
        }
        .anyDicIndex {
          width: 60px;
          text-align: center;
          flex-shrink: 0;
          margin-right:10px;
        }
        .anyDicLabel {
          margin-right: 20px;
          max-width: 900px;
          max-height: 200px;
          overflow: hidden;
          display: flex;
          .anyDicLabelVal {

          }
          .anyDicLabelRate {
            margin-top: 0 !important;
          }
          .el-button {
            padding: 0;
            margin-left: 10px;
          }
        }
        .anyDicCount {
          width: 120px;
          text-align: center;
        }
        .anyDicProg {
          width: 320px;
          text-align: center;
        }
        &.tableTh {
          background-color: #f7f9fb;
          border-top: 1px solid #f3f5f8;
          margin-top: 10px;
          .anyDicLabel {
            width: 100%;
            text-align: center;
          }
        }
      }
    }
  }
}
</style>
