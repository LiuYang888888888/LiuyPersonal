<template>
  <el-row :gutter="20" >
    <el-col :span="18"  class="seRolCrud">
      <avue-crud
        :option="option"
        :search.sync="query"
        :table-loading="loading"
        :data="data"
        ref="crud"
        :page.sync="page"
        @search-change="searchChange"
        @search-reset="searchReset"
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
            :disabled="handleCanAdd(scope.row)"
            @click.stop="handleAdd(scope.row, scope.index)"
            >添加
          </el-button>
        </template>
        <template slot="menuLeft">
          <el-button
            type="success"
            size="small"
            icon="el-icon-finished"
            
            @click="selectALl()"
            >此页全选
          </el-button>
        </template>
      </avue-crud>
    </el-col>
    <el-col :span="6">

      <el-card
        shadow="never"
        header="已选角色"
        :body-style="{ padding: '5px', height: '420px', overflow: 'auto' }"
      >
        <div slot="header" class="clearfix">
          <span>已选角色</span>
          <el-button
            v-if="( value.length > 0)"
            style="float: right; padding: 3px; " 
            type="danger"
            icon="el-icon-close"
            circle
            size="mini"
            @click="clearALl()"
          ></el-button>
          
        </div>
        <List :data="value" :props="lisProps" @itemRemove="handleRemove" />
      </el-card>
    
    </el-col>
  </el-row>

</template>
<script>
import { getRolesList } from "@/api/appStore/manage";
import { getRules } from "@/util/regx";
import List from "@/components/list";

export default {
  components: {
    List,
  },
  props: {
    value: {
      type: Array,
      default() {
        return [];
      },
    },
    role: {
      type: Object,
      default() {
        return {};
      },
    },
  },
  data() {
    return {
      query: {},
      loading: true,
      platformLoading: false,
      page: {
        pageSize: 6,
        currentPage: 1,
        total: 0,
        pageSizes: [ 6, 20, 30, 40, 50, 100 ],
        pagerCount:5,
        layout:"total, prev, pager, next, jumper",
      },
      option: {
        //height: 360,
        //calcHeight:40,
        tip: false,
        searchShow: true,
        gutter: 2,
        addBtn: false,
        editBtn: false,
        delBtn: false,
        menuWidth: 100,
        index: true,
        selection: false,
        dialogClickModal: false,
        //refreshBtn:false,
        //columnBtn:false,
        //searchShowBtn:false,
        //menu:false,

        searchSpan:10,
        searchMenuSpan:8,
        searchMenuPosition:"center",
        border: true,
        stripe:false,

        
        /*border: false,
        stripe:true,
        searchSpan: 12,
        searchMenuSpan: 6,
        searchMenuPosition:"right",
        searchLabelWidth:"1px",*/
        


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
                message: "请输入角色名称",
                trigger: "blur"
              },
              ...getRules(['charNumHanUnderline']),
            ]
          },
          
        ],
      },
      data: [],
      // selectedUsers: [],
      lisProps: {
        key: "id",
        label: "roleName",
      },
    };
  },
  methods: {
    searchReset() {
      this.query = {};
      this.onLoad(this.page);
    },
    searchChange(params, done) {
      this.query = params;
      // this.parentId = '';
      this.page.currentPage = 1;
      this.onLoad(this.page, params);
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
        this.data = data.records;
        this.loading = false;
      });
    },
    handleCanAdd(row) {
      return this.value.some((item) => item.id === row.id);
    },
    handleAdd(row /*, index*/) {
      this.value.push(row);
      this.$emit("input", this.value);
    },
    handleRemove(item, index) {
      this.value.splice(index, 1);
      this.$emit("input", this.value);
    },
    selectALl(){
      this.data.map((row)=>{
        if(!this.handleCanAdd(row)){
          this.handleAdd(row);
        }
      })
    },
    clearALl(){
      this.value=[];
      this.$emit("input", []);
    }
    
  },
};
</script>

<style lang="scss" scoped>
.seRolCrud {
  /deep/ .avue-crud__menu { min-height:0; }
}
</style>
