<template>
  <div class="">
    <HuilanBasicToolbar>
      <el-button
        type="primary" 
        size="small" 
        @click.stop="batchInvalid(1)"
        v-if="( permissionList.invalidBtn  ) "
        >批量标记无效</el-button>

    </HuilanBasicToolbar>

    <!-- <QSGSearchBar
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
    </QSGSearchBar> -->

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
          v-if="( permissionList.viewBtn  )"
          @click.stop="detailOpenR(scope.row, scope.index)"
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
        
      </template>
    </avue-crud>


  </div>
</template>
<script>
import {mapGetters} from "vuex";
import QSGSearchBar from '@/components/QSGSearchBar/index';

//import { baseURL } from '@/api/common';
//import serviceList from "@/config/serviceList";

/*import { 
  invalidStatisticsList,
} from "@/api/questionnaire/index";
*/
import { /*isNull,*/ initSecond, filterListByKey } from '@/util/qsgCommon.js';

export default {
  name: 'RejectList',
  components: {
    QSGSearchBar,
  },
  computed: {
    ...mapGetters(["userInfo","permission"]),
    permissionList() {
      return {
        invalidBtn: this.vaildData(this.permission[`qusn-sta-invalid`], false),
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
    rejectList: {
      type: Object,
      default() {
        return {};
      }
    },
  },
  data() {
    return {
      qusnOption:{},
      qusnId:'',
      qusnFrontJson:{},

      searchForm:{},
      loading: true,
      page: {
        "pageSize": 5,
        "currentPage": 1,
        "total": 0,
        "pageSizes": [ 5, 10, 20, 30, 40, 50, 100 ]
      },

      listAllData:[],

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
        menuWidth: 180,

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
            
          },
          {
            label: '账号',
            prop: 'account',
            align: 'center',
            width: 120,
          },
          {
            label: '答题时间',
            prop: 'doTime',
            align: 'center',
            formatter:(val/*,value,label*/)=>{
              return initSecond(val.doTime,'cn')
            },
            width: 120,
          },
          {
            label: '状态',
            prop: 'invalidStatus',
            display: false,
            type: 'select',
            dicData: [
              {label:'无效', value: 1},
              {label:'有效', value: 0}
            ],
            align: 'center',
            width: 120,
          },
          {
            label: '参与时间',
            prop: 'createTime',
            display: false,
            align: 'center',
            width: 160,
          },

        ],
      },



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

      this.loading = true;

      const dataParam = {
        ...params,
        ...this.query,
        "current": page.currentPage,
        "size": page.pageSize,
        "questionnaireId": this.qusnId,
      }

      const dataRes = this.getList(dataParam);
      //console.log(dataRes);

      this.page.total = dataRes.total;
      this.page.pageSize = dataRes.size;
      this.page.currentPage = dataRes.current;
      this.listData = dataRes.records;

      this.loading = false;
      //this.selectionClear();
      
    },

    listToPage(){

      let tempArr = [];
      for( let key in this.rejectList){
        let tempList = this.deepClone( this.rejectList[key] );
        tempList = tempList.map((info)=>{
          info.rejectReason = key;
          return info
        })
        tempArr = tempArr.concat(tempList);
      }

      this.listAllData = filterListByKey(tempArr);

      //console.log(this.listAllData)
    },

    getList(dataParam){

      let res = {
        total: this.listAllData.length,
        size: dataParam.size,
        current: dataParam.current,
        records: this.listAllData.slice( ( (dataParam.current-1) * dataParam.size), ( dataParam.current * dataParam.size)),
      };

      return res
    },

    batchInvalid(toStatus){
      if (this.selectionList.length == 0) {
        this.$message({
          type: 'warning',
          message: '请选择需要处理的数据'
        })
      } else {
        const selectIds = this.selectionList.map(item=>item.id);

        this.$confirm('确认将 ' + this.selectionList.length + ' 条数据'+ (toStatus==1?'标记为无效':'恢复为有效') +'样本？', '提示', {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(() => {

          //this.markInvalid(selectIds, toStatus, (toStatus==1?'批量剔除_标记为无效':'批量剔除_恢复为有效'));
          this.$emit('markInvalid',selectIds, toStatus, (toStatus==1?'批量剔除_标记为无效':'批量剔除_恢复为有效')); 
          
          this.selectionList.map(info=>{
            info.invalidStatus = toStatus;
            return info
          })
        });

      }
    },

    invalidRow(row/*,index*/){
      if( row.invalidStatus == 1 ){
        row.invalidStatus = 0;
        this.$emit('markInvalid',[row.id], 0,'剔除恢复'); 
      }else{
        row.invalidStatus = 1;
        //this.markInvalid([row.id], 1,'剔除无效样本'); 
        this.$emit('markInvalid',[row.id], 1,'剔除无效样本'); 
      }
    },


    detailOpenR(row/*,index*/){
      this.$emit('openView',row);
    },
  
  },
  created(){
    this.listToPage();
  },
  mounted () {
    
  },
  watch:{
    'qusnConfig': {
      handler() {
        this.getOverview();
        this.refreshChange();
      },
      deep: true
    },
    'rejectList': {
      handler() {
        this.listToPage();
        this.refreshChange();
      },
      deep: true
    },
  }

}
</script>
<style lang="scss" scoped>

</style>
