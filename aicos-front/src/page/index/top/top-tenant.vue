<template>
  <el-dialog
    title="切换租户"
    append-to-body
    :visible.sync="dialogVisible"
    width="720px"
    class="avue-dialog top-tenant huiLanCrud">
    <avue-crud :option="option"
      :table-loading="loading"
      :data="data"
      ref="crud"
      v-model="form"
      @search-change="searchChange"
      @search-reset="searchReset"
      @current-change="currentChange"
      @size-change="sizeChange"
      @refresh-change="refreshChange"
      @on-load="onLoad">

      <template slot-scope="scope" slot="menu">
        <el-button size="small" type="text" @click="handleClick(scope.row,scope.index)">切换</el-button>
      </template>
    </avue-crud>
  </el-dialog>
</template>
<script>
import { getChangeableTenantList } from "@/api/system/tenant";
// import { switchTenant } from '@/api/user'
import {validatenull} from '@/util/validate';

export default {
  data() {
    return {

      tempListData:{},
      resData:{},

      dialogVisible: false,
      loading: true,
      form: {},
      query: {},
      page: {
        pageSize: 10,
        currentPage: 1,
        total: 0
      },
      option: {
        height: 400,
        calcHeight: 30,
        addBtn: false,
        viewBtn: false,
        editBtn: false,
        delBtn:false,
        menuWidth: 90,
        tip: false,
        searchShow: true,
        searchMenuSpan: 8,
        searchSpan: 8,

        border: true,
        index: true,

        selectionFixed:false,
        expandFixed:false,
        menuFixed:false,
        indexFixed:false,


        refreshBtn: false,
        columnBtn: false,
        searchShowBtn:false,

        column: [
          {
            label: "租户ID",
            prop: "tenantId",
            width: 120,
            overHidden: true,
            search: true,
            addDisplay: false,
            editDisplay: false,
            span: 24,
            rules: [{
              required: true,
              message: "请输入租户ID",
              trigger: "blur"
            }]
          },
          {
            label: "租户名称",
            prop: "tenantName",
            search: true,
            // width: 150,
            overHidden: true,
            span: 24,
            rules: [{
              required: true,
              message: "请输入参数名称",
              trigger: "blur"
            }]
          },
          {
            label: "联系人",
            prop: "linkman",
            //search: true,
            width: 120,
            overHidden: true,
            rules: [{
              required: true,
              message: "请输入联系人",
              trigger: "blur"
            }]
          },
          {
            label: "联系电话",
            prop: "contactNumber",
            width: 120,
            overHidden: true,
            //search: true,
            // width: 150,
          },
          // {
          //   label: "过期时间",
          //   prop: "expireTime",
          //   // width: 180,
          //   // slot: true,
          //   addDisplay: false,
          //   editDisplay: false,
          // },
        ]
      },
      data: [],
    }
  },
  methods: {
    show() {
      this.dialogVisible = true
      if(!this.loading) {
        this.refreshChange();
      }
    },
    searchReset() {
      this.query = {};
      //this.onLoad(this.page);
      this.data = this.resData;
    },
    searchChange(params, done) {
      this.query = params;
      /*this.page.currentPage = 1;
      this.onLoad(this.page, params);*/

      this.tempListData = this.resData;

      for (let [key, val] of Object.entries(params) ){
        if( !validatenull(val)){
          this.tempListData = this.tempListData.filter((item)=>{
            if( item[key].includes(val) ){
              return item
            }
          })
        }
      }

      this.data = this.tempListData;

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
      this.loading = true;
      getChangeableTenantList(page.currentPage, page.pageSize, Object.assign(params, this.query)).then(res => {
        const data = res.data.data;
        // this.page.total = data.total;
        this.data = data;
        this.resData = data;
        this.loading = false;
      });
    },
    async handleClick(row) {
      await this.$store.dispatch("switchTenant", {
        tenantId: row.tenantId,
        id: row.id,
        tenantName: row.tenantName
      })

      this.$message.success('切换成功！');
      this.dialogVisible = false;

      this.$router.$avueRouter.formatRoutes(this.$store.state.user.menuAll, true);

      this.$store.commit('SET_CURRENT_TENANT_ID', row.tenantId);
      this.$store.commit('SET_CURRENT_TENANT_ALL', row);

      // debugger
      if(this.$route.path !== this.$store.getters.tagWel.value) {
        this.$router.push({path: this.$store.getters.tagWel.value});
      }else {
        window.location.reload();
      }

      // const newHref = window.location.href.replace(window.location.hash, '#/')
      // window.location.href = newHref;
      // window.location.reload();

    }
  }
}
</script>
<style lang="scss">
.top-tenant {
  .el-dialog__header {
    line-height: 1em;
    font-size: 14px;

    i {
      line-height: 1em;
    }
  }
  .avue-crud {
    line-height: 1em;
  }
}
  .huiLanCrud {
    /deep/.avue-crud {
      /deep/.avue-crud__menu {
        width: 0;
        height: 0;
        overflow: hidden;
        display: none;
      }
    }
  }
</style>
