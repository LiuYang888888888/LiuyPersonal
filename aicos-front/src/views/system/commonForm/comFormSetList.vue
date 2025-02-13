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
      :span-method="spanMethod"
      >
      <template slot="menuLeft">
        
        <!-- <el-button
          size="small"
          type="warning"
          icon="el-icon-delete"
          
          @click="batchDelete()"
          >打印模板上传
        </el-button> -->
        
      </template>
      <template slot-scope="{row,index}" slot="menu">
        <el-button
          type="text"
          v-if="!(row.id && !row.enabled) && (!row.isBuiltin)"
          size="small"
          :icon="((row.$cellEdit)?'el-icon-circle-plus-outline':'el-icon-edit')"
          @click.stop="rowCell(row,index)"
          >{{row.$cellEdit?'保 存':'编 辑'}}</el-button>
        <el-button 
          v-if="row.$cellEdit && (!row.isBuiltin)"
          type="text"
          icon="el-icon-circle-close"
          size="small"
          @click.stop="rowCancel(row,index)"
        >取 消</el-button>
      </template>

      <template slot-scope="{row,index}" slot="formListIsSort">
        <div>
          {{ ( (row.formListIsSort)? (row.formListIsDesc?"降序":"升序"):"--")}}
        </div>
      </template>
      <template slot-scope="{row,index}" slot="formListIsSortForm">
        <div class="set_formListIsSort">
          <el-switch
            v-model="row.formListIsSort"
            active-text="是"
            inactive-text="否"
            :active-value="1"
            :inactive-value="0" >
          </el-switch>
          <el-select 
            v-model="row.formListIsDesc"
            v-if="row.formListIsSort"
            size="mini"
            style="width: 80px !important; margin-left: 10px;"
            placeholder="请选择">
            <el-option label="降序" :value="1"></el-option>
            <el-option label="升序" :value="0"></el-option>
          </el-select>
        </div>
      </template>
    </avue-crud>
  </div>
</template>

<script>
// import {mapGetters} from "vuex";
import { getRules } from "@/util/regx";

import { 
  getListData,
  updateListData,
} from "@/api/system/commonFormSet";

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

        column: [
          {
            label: '中文名称',
            prop: 'displayName',
            align:"center",
            width:200,
            search:true,
            //cell: true,
            rules: [
              {
                required: true,
                message: "请输入列表字段名称",
                trigger: "blur"
              },
              ...getRules(['charNumHanUnderline'])
            ]
          },
          {
            label: '英文简称',
            prop: 'name',
            align:"center",
            width:200,
            search:true,
            
          },

          {
            label: '列表显示宽度(px)',
            prop: 'formListWidth',
            align:"center",
            width:220,
            cell: true,
            rules: [
              // {
              //   required: true,
              //   message: "请输入列表显示宽度,单位：px",
              //   trigger: "blur"
              // },
              //...getRules(['size'])
              ...getRules(['onlyNumber'])
              
            ]
          },
          {
            label: '允许导入导出',
            prop: 'formListAllowExport',
            
            cell: true,
            type: 'switch',
            align:"center",
            width:160,
            dicData: [
              {label: '否', value: 0},
              {label: '是', value: 1},
            ],
            value:1,
          },
          {
            label: '做为默认排序',
            prop: 'formListIsSort',
            cell: true,
            type: 'switch',
            align:"center",
            
            dicData: [
              {label: '否', value: 0},
              {label: '是', value: 1},
            ],
            value:1,
          },
          {
            label: '升降序',
            prop: 'formListIsDesc',
            align:"center",
            hide:true,
            cell: true,
            type: 'select',
            dicData: [
              {label: '降序', value: 1},
              {label: '升序', value: 0},
            ],
            value: 1,
            rules: [
              {
                required: true,
                message: "请选择数据类型",
                trigger: "blur"
              },
            ]
          },

          {
            label: '列表排序(越小越靠左)',
            prop: 'formListOrder',
            align:"center",
            cell: true,
            type:'number',
            minRows:1,
            maxRows:9999,
            value:1,
            rules: [
              {
                required: true,
                message: "请输入列表排序",
                trigger: "blur"
              },
              ...getRules(['onlyNumber'])
            ]
          },
        ],
      },

      nowEditRow:{},
      nowEditRowIndex:0,

      flagchange:0,
      nowEditHasChange:false,
      hasBreakRow:false,

      soltIsSort:1,
      soltIsDesc:1,

    }
  },

  methods: {

    async crudRowClick (row, /*event, column*/) {

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
        this.$refs.listRef.rowCellEdit(row,row.$index);
      }
    },

    getRowEdit(){
      this.listData.map(item=>{
        if(item.$cellEdit){
          this.nowEditRow =  item;
          this.nowEditRowIndex = item.$index; 
        }
      })
    },
    async rowCell(row, index) {
      //console.log('点击右侧编辑按钮');

      this.getRowEdit();

      if( this.nowEditRow.$cellEdit){
        //console.log('有在编辑的行');
        await this.$refs.listRef.rowCellUpdate(this.nowEditRow,this.nowEditRowIndex);

      }else{

        this.$refs.listRef.rowCell(row, index);
      }
      
    },
    rowCancel(row, index) {
      this.$refs.listRef.rowCancel(row, index);
      this.nowEditRow = {};
      this.nowEditRowIndex = 0;
    },

    async rowUpdate(row, index, done, loading) {
      //console.log('rowUpdate');
      
      await updateListData(row).then(() => {
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
        formIsList:1,
        enabled:1,
        orderByListOrder:true,
        ...this.activeForm,
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

    /*spanMethod({ row, column, rowIndex, columnIndex }) {

      if (columnIndex === 5) {
        return [1, 2]
      } else if (columnIndex === 6) {
        return [0, 0]
      }
    },*/


  },
  mounted() {
    this.activeForm = {
      metaObjName:this.data.code,
      systemCode:this.data.systemCode,
    }

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

  /deep/.set_formListIsSort { display: flex; align-items: center; justify-content: center;}
  /deep/.el-card__body .el-form .el-table__body td .avue-input-number { max-width:220px;}


}
</style>
