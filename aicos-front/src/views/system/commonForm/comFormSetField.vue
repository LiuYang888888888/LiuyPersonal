<template>
  <div class="newCss" >
    <div class="menuTitle">表单：{{data.name}}</div>

    <avue-crud :option="listOption"
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
      @row-click="crudRowClick"
      :upload-after="uploadAfter"
      :upload-before="uploadBefore"
      :upload-error="uploadError"
      :upload-delete="uploadDelete"
      :upload-preview="uploadPreview"
      :row-class-name="tableRowClassName"
      >
      <template slot="menuLeft">
        <!-- @row-click="crudRowClick" -->
        <el-button
          size="small"
          type="primary"
          icon="el-icon-plus"
          v-if="customTag"
          @click="addBreakRow()"
          >新 增
        </el-button>

        <!-- <el-button
          size="small"
          type="success"
          icon="el-icon-sort"
          @click="syncField()"
          >同 步
        </el-button> -->

        <el-button
          size="small"
          type="danger"
          icon="el-icon-delete"
          v-if="customTag"
          @click="batchDelete()"
          >批量删除
        </el-button>

        <el-button
          size="small"
          type="primary"
          icon="el-icon-finished"
          v-if="customTag"
          @click="batchRedu()"
          >批量还原
        </el-button>
        
      </template>

      <template slot-scope="{row,index}" slot="menu">
        <el-button
          type="text"
          v-if="!(row.id && !row.enabled) "
          size="small"
          :icon="((row.$cellEdit)?'el-icon-circle-plus-outline':'el-icon-edit')"
          @click.stop="rowCell(row,index)"
          >{{row.$cellEdit?'保 存':'编 辑'}}</el-button>
        <el-button 
          v-if="row.$cellEdit"
          type="text"
          icon="el-icon-circle-close"
          size="small"
          @click.stop="rowCancel(row,index)"
        >取 消</el-button>
        <el-button 
          v-if="(!row.$cellEdit && row.enabled) && customTag "
          type="text"
          icon="el-icon-delete"
          size="small"
          @click.stop="rowCdDel(row,index)"
        >删 除</el-button>

        <el-button 
          v-if="(!row.$cellEdit && !row.enabled) && customTag"
          type="text"
          icon="el-icon-delete"
          size="small"
          @click.stop="rowCdRedu(row,index)"
        >还 原</el-button>

      </template>

    </avue-crud>

    
    <!-- <div>{{data.id}}</div> -->

  </div>
</template>

<script>
// import {mapGetters} from "vuex";
import { getRules } from "@/util/regx";
import {validatenull} from '@/util/validate'
// import iconList from "@/config/iconList";
// import { baseURL } from '@/api/common';
// import serviceList from "@/config/serviceList";

import { 
  getListData,
  addListData,
  updateListData,
  delListData,
  reduListData,
  //viewListData,
  syncData
} from "@/api/system/commonFormSet";

import ChineseHelper from './ChineseHelper.js'

export default {
  name: 'comFormSetField',
  components: {
  },
  props: {
    data: {
      type: Object,
      default() {
        return {}
      }
    }
  },

  data() {
    return {
      isCustomTable:0,
      customTag:true,
      activeForm:{
      },

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
        tip: false,
        //height:550,
        calcHeight: 65,
        searchShow: true,
        searchIndex:1,
        searchClearable:false,
        
        dialogWidth: 800,
        index: false,
        selection: true,
        
        menuWidth: 150,
        menuAlign: 'center',
        menuFixed:'right',
        dialogClickModal: false,
        span: 24,

        border: true,
        stripe:false,
        searchIcon:true,
        searchSpan:4,
        searchMenuSpan:3,
        searchMenuPosition:"right",
        dialogMenuPosition:"right",

        viewBtn: false,
        addBtn:false,
        editBtn:false,
        delBtn:false,
        addRowBtn:false,
        cellBtn:false,
        cancelBtn:false,
        rowKey:'id',

        column: [
          {
            label: 'id',
            prop: 'id',
            hide:true,
          },
          {
            label: '中文名称',
            prop: 'displayName',
            align:"center",
            width:160,
            search:true,
            cell: true,
            maxlength: 50,
            showWordLimit: true,
            rules: [
              {
                required: true,
                message: "请输入中文名称",
                trigger: "blur"
              },
              ...getRules(['charNumHanUnderline'])
            ],
            change: ({row, value}) => {
              if( (!row.id) && (row.$index == 0 )){
                row.name = ChineseHelper.ConvertPinyin(value,'SF').toLowerCase();
              }
            },
          },
          {
            label: '英文简称',
            prop: 'name',
            align:"center",
            width:160,
            search:true,
            cell: true,
            editDisabled:false,
            maxlength: 50,
            showWordLimit: true,
            rules: [
              {
                required: true,
                message: "请输入英文简称",
                trigger: "blur"
              },
              {
                pattern: /^[a-z][a-z0-9_]{1,31}$/,
                message: "只允许小写字母开头的2-32位小写字母、数字、下划线",
                trigger: "blur"
              }
              
            ]
          },

          {
            label: '数据类型',
            prop: 'type',
            align:"center",
            width:160,
            search:true,
            cell: true,
            type: 'select',
            dicData: [
              {label: '字符串', value: 'string'},
              {label: '整数', value: 'integer'},
              {label: '小数', value: 'float'},
              {label: '日期', value: 'datetime'},
            ],
            value: 'string',

            rules: [
              {
                required: true,
                message: "请选择数据类型",
                trigger: "blur"
              },
            ],
            /*control:(val,form)=>{
              console.log(val);
              if(val == 'integer'){
                return {
                  defaultValue:{value:100}
                }
              }
            },*/
            change: ({row, value}) => {
              this.changeRuleDefaultValue({row, value});
            },
          },
          {
            label: '数据长度',
            prop: 'length',
            align:"center",
            width:120,
            cell: true,
            type:'input',
            value:'',
            rules: [
              /*{
                required: true,
                message: "请输入数据长度",
                trigger: "blur"
              },*/
              ...getRules(['onlyNumber'])
            ]
          },
          {
            label: '默认值',
            prop: 'defaultValue',
            align:"center",
            width:120,
            cell: true,
            rules: [
              /*{
                required: true,
                message: "请输入默认值",
                trigger: "blur"
              },*/
              ...getRules(['charNumHanUnderline'])
            ]
          },
          {
            label: '允许为空',
            prop: 'isNull',
            hide:true,
            cell: true,
            type: 'switch',
            align:"center",
            width:80,
            dicData: [
              {label: '否', value: 0},
              {label: '是', value: 1},
            ],
            value:1,
          },
          /*{
            label: '是否主键',
            prop: 'isPrimary',
            
            cell: true,
            type: 'switch',
            align:"center",
            width:80,
            dicData: [
              {label: '否', value: 0},
              {label: '是', value: 1},
            ],
            value:1,
          },*/
          {
            label: '前台字段',
            prop: 'formIsFront',
            
            cell: true,
            type: 'switch',
            align:"center",
            width:100,
            dicData: [
              {label: '否', value: 0},
              {label: '是', value: 1},
            ],
            value:1,
          },
          {
            label: '列表显示',
            prop: 'formIsList',
            
            cell: true,
            type: 'switch',
            align:"center",
            width:100,
            dicData: [
              {label: '否', value: 0},
              {label: '是', value: 1},
            ],
            value:1,
          },
          {
            label: '查询条件',
            prop: 'formIsQuery',
            
            cell: true,
            type: 'switch',
            align:"center",
            width:100,
            dicData: [
              {label: '否', value: 0},
              {label: '是', value: 1},
            ],
            value:1,
          },
          {
            label: '描述',
            prop: 'desc',
            overHidden:true,
            headerAlign: 'center',
            cell: true,
            type: 'textarea',
            minRows: 1, 
            maxlength: 200,
            showWordLimit: true,
            rules: [
              /*{
                required: true,
                message: "请输入描述",
                trigger: "blur"
              },*/
            ]
          },

          
        ],
      },

      nowEditRow:{},
      nowEditRowIndex:0,

      flagchange:0,
      nowEditHasChange:false,
      nowEditChangeRow:false,
      hasBreakRow:false,
      rowEditOk:false, 

    }
  },

  methods: {

    async crudRowClick (row, /*event, column*/) {

      //console.log('点击行编辑');

      /*if( (row.isBuiltin) && (row.id) ){
        this.$message.error("该字段为默认字段，不可编辑。")
        return false
      }*/

      if( (!row.enabled) && (row.id) ){
        this.$message.error("该字段已停用，请先“还原”，再进行编辑。")
        return false
      }

      this.getRowEdit();

      if( this.nowEditRow.$cellEdit){
        //console.log('有在编辑的行');
        if(row.$index == this.nowEditRow.$index ){
          //console.log('点击了正在编辑的行');
          return false;
        }else{
          await this.$refs.listRef.rowCellUpdate(this.nowEditRow,this.nowEditRowIndex); 
        }
        
      }else{
        this.changeRuleDefaultValue({row:row,value:row.type});

        this.findObject(this.listOption.column, "name").cell = false;
        if(row.isBuiltin ==1){
          this.findObject(this.listOption.column, "formIsFront").cell = false; 
        }else{
          this.findObject(this.listOption.column, "formIsFront").cell = true; 
        }
        this.findObject(this.listOption.column, "type").cell = false; 
        this.$refs.listRef.rowCellEdit(row,row.$index);
      }
      /*点击的某一列*/
      /*if (["name", "type"].includes(event.property)) {
        this.$refs.listRef.rowCell(row, row.$index);
      }*/

    },
    getRowEdit(){

      this.listData.map(item=>{
        //console.log(item.$cellEdit)
        if(item.$cellEdit){
          this.nowEditRow =  item;
          this.nowEditRowIndex = item.$index; 
        }
      })
    },
    changeRuleDefaultValue({row, value}){

      //console.log({row, value})

      const defaultValueColumn = this.findObject(this.listOption.column, "defaultValue");
      const lengthColumn = this.findObject(this.listOption.column, "length");

      row.defaultValue = row.defaultValue;
      if(value == "string") {
        this.$set(lengthColumn,'disabled',false);
        this.$set(lengthColumn,'type','number');
        row['length'] = ((row['length'] == 0 || validatenull(row['length']))?200:row['length']);
        this.$set(defaultValueColumn,'rules',[...getRules(['charNumHanUnderline'])]);
        
      }else if(value == "integer") {
        this.$set(lengthColumn,'disabled',true);
        this.$set(lengthColumn,'type','input');
        row['length'] = null;
        this.$set(defaultValueColumn,'rules',[{
          pattern: /^(0|[1-9][0-9]*)$/,
          message: "只允许整数",
          trigger: "blur"
        }])
      }else if(value == "float") {

        this.$set(lengthColumn,'disabled',true);
        this.$set(lengthColumn,'type','input');
        row['length'] = null;

        this.$set(defaultValueColumn,'rules',[{
          pattern: /^[1-9]\d*\.\d*|0\.\d*[1-9]\d*$/,
          message: "只允许小数",
          trigger: "blur"
        }])
      }else if(value == "datetime") { 
        this.$set(lengthColumn,'disabled',true);
        this.$set(lengthColumn,'type','input');
        row['length'] = null;
        this.$set(defaultValueColumn,'disabled',true);
        
        this.$set(defaultValueColumn,'rules',[/*{
          pattern: /^\d{4}-\d{1,2}-\d{1,2}/,
          message: "只允许日期",
          trigger: "blur"
        }*/])
      }

    },

    async addBreakRow(){
      this.getRowEdit();
      if( this.nowEditRow.$cellEdit){
        //console.log('有在编辑的行');
        await this.$refs.listRef.rowCellUpdate(this.nowEditRow,this.nowEditRowIndex);

      }else{
        this.findObject(this.listOption.column, "name").cell = true;
        this.findObject(this.listOption.column, "type").cell = true; 
        this.findObject(this.listOption.column, "formIsFront").cell = true;

        this.$refs.listRef.rowCellAdd();
        let tempArr = this.listData.splice(this.listData.length-1,1);
        this.listData.unshift(tempArr[0]);
        //console.log(this.listData)
        /*const obj = {
          $cellEdit:true,
          length:200,
          isNull:1,
          isPrimary:1,
          formIsFront:1,
          formIsList:1,
          formIsQuery:1,
          type:'string',
        }
        this.listFirstData = obj;
        this.listData.unshift(obj);*/
        this.hasBreakRow = true;
      }

    },
    async rowCell(row, index) {
      //console.log('点击右侧编辑按钮');

      //this.changeRuleDefaultValue({row:row,value:row.type});

      this.getRowEdit();

      if( this.nowEditRow.$cellEdit){
        //console.log('有在编辑的行');
        await this.$refs.listRef.rowCellUpdate(this.nowEditRow,this.nowEditRowIndex);

      }else{
        
        this.findObject(this.listOption.column, "name").cell = false;
        this.findObject(this.listOption.column, "type").cell = false;
        if(row.isBuiltin ==1){
          this.findObject(this.listOption.column, "formIsFront").cell = false; 
        }else{
          this.findObject(this.listOption.column, "formIsFront").cell = true; 
        }
        this.$refs.listRef.rowCell(row, index);
      }
      
    },
    rowCancel(row, index) {
      this.$refs.listRef.rowCancel(row, index);
      this.nowEditRow = {};
      this.nowEditRowIndex = 0;
    },
    rowCdDel(row, index) {
      this.$refs.listRef.rowDel(row, index);
    },

    async rowSave(row, done, loading) {
      //console.log('rowSave');

      const dataParam = {
        //formListName:row.displayName,
        //formQueryName:row.displayName,
        ...this.activeForm,
        ...row,
      }
      
      await addListData(dataParam).then(() => {
        this.refreshChange();
        this.$message({
          type: "success",
          message: "操作成功!"
        });
        done();
      }, error => {
        window.console.log(error);
        loading();
      });
    },

    async rowUpdate(row, index, done, loading) {
      //console.log('rowUpdate');
      
      await updateListData(row).then(() => {
        //this.refreshChange();
        this.$message({
          type: "success",
          message: "操作成功!"
        });
        done();
      }, error => {
        window.console.log(error);
        loading();
      });
    },

    rowDel(row){
      //console.log('rowDel');
      
      this.$confirm("确定将选择数据删除?", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(() => {
        return  delListData([row.id]);
      }).then(() => {
        this.$message({
          type: "success",
          message: "操作成功!"
        });
        this.refreshChange();
      })

    },

    rowCdRedu(row, /*index*/) {
      //console.log('还原');
      reduListData([row.id]).then(() => {
        this.refreshChange();
        this.$message({
          type: "success",
          message: "操作成功!"
        });
      }, error => {
        window.console.log(error);
      });
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
      
      if (["add", "edit","view"].includes(type)) {
        this.initData(type);
      }
      done();
    },
    beforeClose(done, /*type*/) {
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

    initData(/*type*/){
      //console.log(type);
    },

    onLoad(page, params = {}) {

      this.loading = true;
      const dataParam = {
        metaObjName:this.data.code,
        systemCode:this.data.systemCode,
        //...this.activeForm,
        ...params,
        ...this.query,
        "current": page.currentPage,
        "size": page.pageSize
      }

      getListData(dataParam).then(res => {
        const dataRes = res.data.data;
        this.page.total = dataRes.total;
        this.page.pageSize = dataRes.size;
        this.page.currentPage = dataRes.current;
        this.listData = dataRes.records;
        this.loading = false;
        this.selectionClear();
      });
    },
    batchDelete(){
      if (this.selectionList.length == 0) {
        this.$message({
          type: 'warning',
          message: '请选择需要处理的数据'
        })
      } else {
        
        this.$confirm('确认是否删除 ' + this.selectionList.length + ' 条数据？', '提示', {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(() => {
          const delIds = this.selectionList.map(item=>item.id);
          //console.log(delIds);
          return  delListData(delIds);
        }).then(() => {
          this.$message({
            type: "success",
            message: "操作成功!"
          });

          this.refreshChange();
        })
        
      }
    },
    batchRedu(){
      if (this.selectionList.length == 0) {
        this.$message({
          type: 'warning',
          message: '请选择需要处理的数据'
        })
      } else {
        
        this.$confirm('确认要还原 ' + this.selectionList.length + ' 条数据？', '提示', {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(() => {
          const delIds = this.selectionList.map(item=>item.id);
          //console.log(delIds);
          return  reduListData(delIds);
        }).then(() => {
          this.$message({
            type: "success",
            message: "操作成功!"
          });

          this.refreshChange();
        })
        
      }
    },
    syncField(){
      //console.log("syncData");
      
      const dataParam = {
        ...this.activeForm,
      }
      
      syncData(dataParam).then(() => {
        this.refreshChange();
        this.$message({
          type: "success",
          message: "操作成功!"
        });
        //done();
      }, error => {
        window.console.log(error);
        //loading();
      });
    },
    tableRowClassName ({ row/*, rowIndex */}) {
      if(row.isBuiltin && (row.id)){ return "set_initrow"}
      if(!row.enabled && (row.id)){ return "set_enabledrow"}

        
    }

  },
  mounted() {
    this.activeForm = {
      metaObjName:this.data.code,
      systemCode:this.data.systemCode,
    };
    this.isCustomTable = this.data.isCustomTable;
    if( this.isCustomTable == 0 ){  this.customTag = false; }
    if( this.isCustomTable == 1 ){  this.customTag = true; }

  },
  computed:{

  },
  watch:{

  },
}
</script>

<style lang="scss" scoped>
.newCss {
  position:relative;
  height:100%;
  .menuTitle { position: absolute; top:30px; left:40px; font-size:22px; font-weight:500; z-index:2; display: -webkit-box; word-break: break-all; overflow: hidden; line-height: 30px; -webkit-box-orient: vertical; -webkit-line-clamp: 3; max-width: 400px; }
  /deep/.avue-crud__search .avue-form__group { justify-content: flex-end; }
  /deep/.avue-crud__search .avue-form__menu { width:240px;}
  /deep/.el-card__body .avue-crud__menu  { justify-content: flex-end; }

  .com_form_set { position: absolute; left: 0; top: 0;  width: 100%; height: 100%; min-height:875px;   background-color: #fff; z-index:4;}

  /deep/.comFormSlide-enter-active, /deep/.comFormSlide-leave-active { transition: transform .5s; }
  /deep/.comFormSlide-enter, /deep/.comFormSlide-leave-to { transform: translateX(100%); }

  /deep/.el-card__body .el-form .el-table__body td .el-switch__label { display:none;}
  /deep/.el-card__body .el-form .el-table__body td .avue-input-number { max-width:220px;}

  /deep/.set_enabledrow{  background-color: #F2F6FC !important;  cursor: not-allowed;}
  /deep/.set_enabledrow.hover-row td{ background-color: initial !important; }
  
  /deep/.set_initrow{  background-color: #EBEEF5 !important;  /*cursor: not-allowed;*/}
  /deep/.set_initrow.hover-row td{ background-color: initial !important; }

}
</style>
