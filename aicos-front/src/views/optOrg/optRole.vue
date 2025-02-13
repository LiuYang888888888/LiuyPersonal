<template>
  <div class="huiLanCrud">
    <el-row :gutter="20" >
      <el-col :span="18"  class="seRolCrud">
        <HuilanBasicSearchbar
          :model="searchForm"
          :fields="searchFieldList"
          @search="searchChange"
          @refresh="refreshChange"
        >
        </HuilanBasicSearchbar>
        <avue-crud
          :option="ListOption"
          :search.sync="query"
          :table-loading="loading"
          :data="listData"
          ref="listRef"
          :page.sync="page"
          @row-click="rowClick"
          @search-change="searchChange"
          @search-reset="searchReset"
          @selection-change="selectionChange"
          @select-all="selectAll"
          @select="selectOne"
          @current-change="currentChange"
          @size-change="sizeChange"
          @refresh-change="refreshChange"
          @on-load="onLoad"
        >
          <template slot-scope="scope" slot="menu">
            <el-button
              type="text"
              icon="el-icon-plus"
              size="small"
              :disabled="hasInRight(scope.row)"
              @click.stop="handleAdd(scope.row, scope.index)"
              >选择
            </el-button>
          </template>
        </avue-crud>
      </el-col>
      <el-col :span="6">
        <checkedList
          :checkedListData="selectData"
          :props="selectProps"
          @itemRemove="handleRemove"
          @itemRemoveAll="handleRemoveAll"
          title="已选角色"
        />
      </el-col>
    </el-row>

    <!-- <div>{{checkedData.type}}</div> -->
    <!-- <div>{{selectData}}</div> -->
    <!-- <div>{{checkedData.num.role}}</div> -->
  </div>
</template>
<script>
import { getRolesList } from "@/api/optOrg/optOrg";
import { getRules } from "@/util/regx";
import checkedList from "./checkedList";

export default {
  name: 'optRole',
  components: {
    checkedList,
  },
  props: {
    checkedData: {
      type: Object,
      default() {
        return {
        }
      }
    },
  },
  data() {
    return {
      selectData:[],

      hasChecked:[],
      selectLength: 0,
      query: {},
      loading: true,
      platformLoading: false,
      selectionList:[],
      page: {
        pageSize: 5,
        currentPage: 1,
        total: 0,
        pageSizes: [ 5, 10 , 20, 30, 40, 50, 100 ],
        pagerCount:5,
        layout:"total, sizes, prev, pager, next, jumper",
      },
      searchForm:{},

      ListOption: {
        height: 300,
        calcHeight: 50,

        tip: false,
        searchShow: true,
        refreshBtn: false,
        columnBtn: false,
        searchShowBtn:false,

        gutter: 2,
        addBtn: false,
        editBtn: false,
        delBtn: false,
        menuWidth: 100,
        index: true,
        selection: false,
        reserveSelection: true,
        dialogClickModal: false,
        searchSpan:10,
        searchMenuSpan:8,
        searchMenuPosition:"center",
        border: true,
        stripe:false,
        selectionFixed:false,
        expandFixed:false,
        menuFixed:false,
        indexFixed:false,

        column: [
          {
            label: "角色名称",
            prop: "roleName",
            search: true,
            span: 24,
            maxlength: 50,
            showWordLimit: true,
            rules: [
              {
                required: true,
                message: "请输入 角色名称",
                trigger: "blur"
              },
              ...getRules(['charNumHanUnderline']),
            ]
          },
        ],
      },
      listData: [],
      selectProps: {
        key: "id",
        label: "roleName",
      },
    };
  },
  methods: {
    getResData(){
      return this.selectData
    },

    searchReset() {
      this.query = {};
      this.onLoad(this.page);
    },
    searchChange(params/*, done*/) {
      this.query = {
        ...params,
        ...this.searchForm
      };

      // this.parentId = '';
      this.page.currentPage = 1;
      this.onLoad(this.page, params);
      //done();
    },
    currentChange(currentPage) {
      this.page.currentPage = currentPage;
    },
    sizeChange(pageSize) {
      this.page.pageSize = pageSize;
    },

    selectionChange(selection) {
      this.selectionList = selection;
    },

    selectionClear() {
      this.selectionList = [];
      //this.$refs.listRef.toggleSelection();
    },

    refreshChange() {
      this.onLoad(this.page, this.query);
    },
    onLoad(page, params = {}) {
      const postData = {
        current: page.currentPage,
        size: page.pageSize,
        ...params,
        ...this.query,
      };
      this.loading = true;
      getRolesList(postData).then((res) => {
        const data = res.data.data;
        this.page.total = data.total;
        this.listData = data.records;
        this.loading = false;
        //this.selectionClear();
      });
    },
    hasInRight(row) {
      return this.selectData.some( (item) => item.id === row.id );
    },
    rowClick(row/*, column, event*/){

      if( !this.hasInRight(row) ){

        if( !this.canNumIn( this.selectData.length ) ) {
          //console.log('不能追加进右侧')
          return false;
        }

        //console.log('追加进右侧')
        this.$refs.listRef.toggleRowSelection(row,true);
        this.selectData.push(row);
      }else{

        if( !this.canNumOut( this.selectData.length ) ){
          //console.log('不能从右侧删除')
          return false;
        }

        //console.log('从右侧删除')
        this.selectData = this.selectData.filter((item) => {
          if ( item.id != row.id ){
            return item
          }
        });
        this.$refs.listRef.toggleRowSelection(row, false);
      }
    },
    handleAdd(row) {
      this.rowClick(row);
    },
    handleRemove(item, index) {
      this.selectData.splice(index, 1);
    },
    handleRemoveAll(){
      this.$refs.listRef.toggleSelection();
      this.selectData = [];
    },
    selectOne(selection, row){
      this.rowClick(row);
    },
    selectPage(){
      this.listData.map((row)=>{
        if(!this.hasInRight(row)){
          this.rowClick(row);
        }
      })
    },

    selectAll(selection){
      if( this.selectLength == selection.length){
        //console.log('没变化');
      }else{

        if(this.selectLength < selection.length ) {
          //console.log('变多,追加进右侧');
          selection.map((item)=>{
            if(!this.hasInRight(item)){
              this.selectData.push(item);
            }
          })
        }else{
          //console.log('变少，从右侧列表删除左侧表格里的数据');
          this.listData.map((row)=>{
            this.selectData = this.selectData.filter((item) => {
              if ( item.id != row.id ){
                return item
              }
            });
          })

        }
        this.selectLength = selection.length;
      }
    },
    canNumIn(num){
      let ckRes = false;
      num++;
      const numMax = this.checkedData.num.role.max ;
      if( num > numMax ) {
        this.$message.warning("最多可以选择 "+numMax+" 个！");
        ckRes = false;
      } else {
        ckRes =  true;
      }
      return ckRes;
    },
    canNumOut(num){
      let ckRes = false;
      num--;
      const numMin = this.checkedData.num.role.min ;
      if(  num < numMin ){
        this.$message.warning("最少必须选择 "+numMin+" 个！");
        ckRes =  false;
      } else {
        ckRes =  true;
      }
      return ckRes;
    },

    initData(){
      //防止数据双向绑定，影响初始化
      const tempArr = [];
      this.checkedData.role.map((item)=>{
        tempArr.push({...item});
      });
      this.selectData = tempArr;
    },
  },
  mounted(){
    /*处理新规范表格的搜索*/
    const listColumn = this.ListOption.column;
    const formColumn = listColumn.filter(item=> item.search === true);
    formColumn.map((item)=>{
      item.placeholder = ((item.type == 'select')?'请选择':'请输入') +' '+ item.label;
    })
    this.searchFieldList = formColumn;

    this.initData();

  },
  watch: {
    "listData": {
      /*初始化选中*/
      handler() {
        let tempArr = [];
        this.listData.forEach(item => {
          this.selectData.forEach(info => {
            if (info.id == item.id) {
              info = item;
              tempArr.push(item);
            }
          })
        })
        this.$nextTick(() => {
          tempArr.forEach(item => {
            this.$refs.listRef.toggleRowSelection(item, true);
          })
        })
      }
    },
    "checkedData":{
      handler(/*newVal*/) {
        this.initData();
      },
      deep: true
    },
  }
}
</script>
<style lang="scss" scoped>
  .huiLanCrud {
    /deep/.avue-crud {
      .avue-crud__search, .avue-crud__menu {
        width: 0;
        height: 0;
        overflow: hidden;
        display: none;
      }
    }
  }

</style>
