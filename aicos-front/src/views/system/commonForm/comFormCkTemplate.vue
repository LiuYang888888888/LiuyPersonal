<template>
  <div class="newCss" >
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
      :upload-after="uploadAfter"
      :upload-before="uploadBefore"
      :upload-error="uploadError"
      :upload-delete="uploadDelete"
      :upload-preview="uploadPreview"
      >
      <template slot-scope="scope" slot="menuLeft">
        <el-button
          type="warning"
          size="small"
          icon="el-icon-document-remove"
          
          @click.stop="ckNoUse()"
        >不使用模板
        </el-button>
      </template>
      <template slot-scope="scope" slot="menu">
        <el-button
          v-if="permissionList.cloneTemplateBtn"
          type="text"
          size="small"
          icon="el-icon-document-copy"
          @click.stop="ckUseThis(scope.row,scope.index)"
        >使用此模板
        </el-button>
      </template>

    </avue-crud>
  </div>
</template>

<script>
import {mapGetters} from "vuex";
import { getRules } from "@/util/regx";
import { 
  getObjListData,
  cloneTemplate,
} from "@/api/system/commonForm";
export default {
  name: '选择模板',
  components: {
  },
  computed: {
    ...mapGetters(["permission"]),
    permissionList() {
      return {
        cloneTemplateBtn: this.vaildData(this.permission[`sys-commonForm-cloneTemplate`], false),
      };
    },
  },
  props: {
    ckTemplateData: {
      type: Object,
      default() {
        return {}
      }
    },
    indexDesignForm: {
      type: Function,
      default: null
    },
    indexColseThis: {
      type: Function,
      default: null
    },
    indexRefresh: {
      type: Function,
      default: null
    },
    indexDesign: {
      type: Function,
      default: null
    },
  },
  data() {
    return {
      loading: true,
      page: {
        "pageSize": 5,
        "currentPage": 1,
        "total": 0,
        "pageSizes": [ 5, 10, 20, 30, 40, 50, 100 ]
      },

      listForm: {},
      selectionList: [],
      activeType:{
        isTemplate:1,
        type:'dynamic',

      },
      query: {},
      listData:[],
      listOption: {
        tip: false,
        calcHeight: 65,
        searchShow: true,
        searchClearable:false,
        
        index: true,
        selection: false,
        addBtn:false,
        viewBtn: false,
        delBtn: false,
        editBtn:false,
        menuWidth: 120,
        menuAlign: 'center',
        menuFixed:'right',

        span: 24,
        border: true,
        searchIndex:1,
        searchIcon:true,
        searchSpan:6,
        searchMenuSpan:8,
        searchMenuPosition:"left",

        column: [
          {
            label: 'ID',
            prop: 'id',
            hide: true,
            //disabled: true,
            //display:false,
            
          },
          {
            label: "模板名称",
            prop: "displayName",
            span: 24,
            maxlength: 50,
            showWordLimit: true,
            search: true,
            rules: [{
              required: true,
              message: "请输入模板名称",
              trigger: "blur"
            },
            ...getRules(['charNumHanUnderline'])
            ]
          },
          {
            label: '编辑人',
            prop: 'updateUser',
            maxlength: 50,
            showWordLimit: true,
            search: true,
            rules: [{
              required: true,
              message: "请输入编辑人员",
              trigger: "blur"
            },
            ...getRules(['charNumHanUnderline'])
            ]
          },
          {
            label: '更新时间',
            prop: 'updateTime',
          },
          
        ]
      },

    }
  },
  methods: {
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
      /*console.log(type);*/
    },

    onLoad(page, params = {}) {
      //console.log(this.ckTemplateData)
      this.loading = true;
      const dataParam = {
        ...params,
        ...this.activeType,
        ...this.query,
        isCustomTable:this.ckTemplateData.isCustomTable,
        "page": {
          "current": page.currentPage,
          "size": page.pageSize
        }
      }

      getObjListData(dataParam).then(res => {
        const dataRes = res.data.data;
        this.page.total = dataRes.page.totalItems;
        this.page.pageSize = dataRes.page.size;
        this.page.currentPage = dataRes.page.current;
        this.listData = dataRes.items;
        this.loading = false;
        this.selectionClear();
      });
    },
    ckNoUse(){
      //console.log('不用模板');
      if (this.indexDesignForm &&  this.indexColseThis && this.ckTemplateData) {
        this.indexDesignForm(this.ckTemplateData);
        this.indexColseThis();
        this.indexRefresh();
      }
    },
    ckUseThis(row){
      //console.log('使用模板');
      const dataParam = {
        "destTemplateId":this.ckTemplateData.id,
        "srcTemplateId": row.formTemplateId
      }
      cloneTemplate(dataParam).then((res)=>{
        this.$message({
          type: "success",
          message: "操作成功!"
        });
        if (this.indexColseThis &&  this.indexDesign) {
          this.indexColseThis();
          this.indexDesign(res.data.data);
          this.indexRefresh();
        }
      }, error => {
        window.console.log(error);
        this.indexRefresh();
      })
    },

  },
  mounted() {
  },

}
</script>