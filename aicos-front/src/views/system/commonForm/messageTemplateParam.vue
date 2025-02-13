<template>
  <avue-crud :option="option"
             :search.sync="query"
             :table-loading="loading"
             :data="data"
             ref="crud"
             v-model="form"
             :permission="permissionList"
             @row-del="rowDel"
             @row-update="rowUpdate"
             @row-save="rowSave"
             :before-open="beforeOpen"
             :page.sync="page"
             @search-change="searchChange"
             @search-reset="searchReset"
             @current-change="currentChange"
             @size-change="sizeChange"
             @refresh-change="refreshChange"
             @on-load="onLoad">
<!--    <template slot-scope="scope" slot="menu">-->
<!--      <el-button-->
<!--        type="text"-->
<!--        icon="el-icon-circle-plus-outline"-->
<!--        size="small"-->
<!--        @click.stop="messageTplParams(scope.row,scope.index)"-->
<!--      >消息模板变量-->
<!--      </el-button>-->
<!--    </template>-->
  </avue-crud>
</template>

<script>
import { getListtBaseMessageTemplateParamByFormTemplateVersionId,
  saveParam, updateParam, removeParam/*, enableParam*/ } from '@/api/system/form'
import {mapGetters} from "vuex";
export default {
  name: 'MessageTemplateParam',
  props: {
    tplId: {
      type: String
    },
    fieldList: {
      type: Array,
      default() {
        return []
      }
    }
  },
  data() {
    return {
      form: {},
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
        searchShow: true,
        searchSpan: 8,
        searchMenuSpan: 6,
        border: true,
        index: true,
        // selection: true,
        viewBtn: true,
        menuWidth: 380,
        dialogClickModal: false,
        dialogWidth: '30%',
        column: [
          {
            label: "变量名称",
            prop: "paramName",
            span: 24,
            search: true,
            rules: [{
              required: true,
              message: "请输入表单名称",
              trigger: "blur"
            }]
          },
          // {
          //   label: "表单字段",
          //   prop: "paramCode",
          //   span: 24,
          //   search: true,
          //   rules: [{
          //     required: true,
          //     message: "请输入表单名称",
          //     trigger: "blur"
          //   }]
          // },
          {
            label: "表单字段",
            prop: "paramCode",
            span: 24,
            search: true,
            type:'select',
            dicData: this.fieldList.filter(item=> !item.name.startsWith('column_')),
            props: {
              label: 'displayName',
              value: 'name'
            },
            rules: [{
              required: true,
              message: "请输入表单名称",
              trigger: "blur"
            }]
          }
        ]
      }
    }
  },
  computed: {
    ...mapGetters(["permission"]),
    permissionList() {
      return function(key, row) {
        if(['editBtn', 'delBtn'].includes(key)) {
          if(row.type === '1') {
            return false
          }else {
            return true
          }
        }else {
          return  true
        }
      }
    },
  },
  methods: {
    beforeOpen(done, type) {
      if (["add"].includes(type)) {
        this.form.formTemplateVersionId = this.tplId
        this.form.type = '2'
      }
      done();
    },
    rowSave(row, done, loading) {
      saveParam(row).then(() => {

        this.$message({
          type: "success",
          message: "操作成功!"
        });
        // 数据回调进行刷新
        this.onLoad(this.page)
        done();
      }, error => {
        window.console.log(error);
        loading();
      });
    },
    rowUpdate(row, index, done, loading) {
      updateParam(row).then(() => {
        this.$message({
          type: "success",
          message: "操作成功!"
        });
        // 数据回调进行刷新
        this.onLoad(this.page)
        done();
      }, error => {
        window.console.log(error);
        loading();
      });
    },
    rowDel(row, index, done) {
      this.$confirm("确定将选择数据删除?", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          return removeParam(row.id);
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
        current: page.currentPage,
        size: page.pageSize,
        formTemplateVersionId: this.tplId
      };
      this.loading = true;
      getListtBaseMessageTemplateParamByFormTemplateVersionId(Object.assign(params, this.query, pageConf)).then(res => {
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
