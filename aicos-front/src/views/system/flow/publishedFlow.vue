<template>
  <div>
    <avue-crud :option="option"
               :search.sync="query"
               :table-loading="loading"
               :data="data"
               ref="crud"
               v-model="form"
               :permission="permissionList"
               @row-del="rowDel"
               :before-open="beforeOpen"
               :page.sync="page"
               @search-change="searchChange"
               @search-reset="searchReset"
               @current-change="currentChange"
               @size-change="sizeChange"
               @refresh-change="refreshChange"
               @on-load="onLoad">
      <template slot-scope="scope" slot="menu">
<!--        <el-button-->
<!--          type="text"-->
<!--          icon="el-icon-edit-outline"-->
<!--          size="small"-->
<!--          v-if="permissionList.design"-->
<!--          @click.stop="designFlow(scope.row,scope.index)"-->
<!--        >流程设计-->
<!--        </el-button>-->
<!--        <el-button-->
<!--          type="text"-->
<!--          icon="el-icon-circle-plus-outline"-->
<!--          size="small"-->
<!--          v-if="permissionList.enableLock"-->
<!--          @click.stop="lock(scope.row,scope.index)"-->
<!--        >{{scope.row.is_lock === '0' ? '锁定' : '解锁'}}-->
<!--        </el-button>-->
      </template>
    </avue-crud>
  </div>
</template>

<script>
import {mapGetters} from "vuex";
import {getPublishedVersionList, removePublishedFlow} from '@/api/system/flow'

export default {
  name: 'PublishedFlowMgr',
  props: {
    modelKey: {
      type: String,
      default: ''
    }
  },
  data() {
    return{
      form: {
        modelType: 0
      },
      query: {},
      loading: false,
      data: [],
      page: {
        pageSize: 10,
        currentPage: 1,
        total: 0
      },
      option: {
        tip: false,
        searchShow: false,
        searchSpan: 8,
        searchMenuSpan: 6,
        border: true,
        index: true,
        columnBtn: true,
        searchShowBtn: false,
        refreshBtn: true,
        // selection: true,
        viewBtn: true,
        // menuWidth: 300,
        menu: false,
        dialogClickModal: false,
        dialogWidth: '30%',
        column: [
          {
            label: "编码",
            prop: "key",
            search: true
          },
          {
            label: "名称",
            prop: "name",
            search: true
          },
          {
            label: "版本",
            prop: "version"
          },
          {
            label: '关联表单',
            prop: 'formTemplateVersionJson',
            formatter: function(row,value) {
              let text = ''
              if(value) {
                const json = JSON.parse(value)
                text = json.processData.formName
              }
              return text
            }
          }
        ]
      }
    }
  },
  computed: {
    ...mapGetters(["permission"]),
    permissionList() {
      return {
        addBtn: false,
        viewBtn: false,
        // delBtn: this.vaildData(this.permission['system-flow-deployment-delete'], false),
        delBtn: false,
        editBtn: false
      };
    },
  },
  methods: {
    rowDel(row, index, done) {
      this.$confirm("确定将选择数据删除?", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          return removePublishedFlow(row.deploymentId);
        })
        .then(() => {
          this.$message({
            type: "success",
            message: "操作成功!"
          });
          // 数据回调进行刷新
          this.onLoad(this.page)
          done();
        });
    },
    beforeOpen(done/*, type*/) {
      // if (["add"].includes(type)) {
      //   this.form.formJson = ''
      // }
      // if (["edit", "view"].includes(type)) {
      //   // getDept(this.form.id).then(res => {
      //   //   this.form = res.data.data;
      //   // });
      // }
      done();
    },
    searchReset() {
      this.query = {};
      // this.parentId = 0;
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
      const pageConf = {
        modelKey: this.modelKey,
        current: page.currentPage,
        size: page.pageSize
      };
      this.loading = true;
      getPublishedVersionList(Object.assign(params, this.query, pageConf)).then(res => {
        const data = res.data.data;
        this.loading = false;
        this.data = data.records;
        this.page.total = data.total;
      });
    }
  }
}
</script>

<style scoped>

</style>
