<template>
  <basic-container>
    <avue-crud :option="option"
               :search.sync="query"
               :table-loading="loading"
               :data="data"
               ref="crud"
               v-model="form"
               :permission="permissionList"
               @row-del="rowDel"
               @row-save="rowSave"
               :before-open="beforeOpen"
               :page.sync="page"
               @search-change="searchChange"
               @search-reset="searchReset"
               @current-change="currentChange"
               @size-change="sizeChange"
               @refresh-change="refreshChange"
               @on-load="onLoad">
            <template slot-scope="scope" slot="menu">
              <el-button
                type="text"
                size="small"
                v-if="permissionList.binding"
                @click.stop="binding(scope.row,scope.index)"
              >绑定
              </el-button>
      <!--        <el-button-->
      <!--          type="text"-->
      <!--          icon="el-icon-position"-->
      <!--          size="small"-->
      <!--          v-if="permissionList.design"-->
      <!--          @click.stop="publishForm(scope.row,scope.index)"-->
      <!--        >发布表单-->
      <!--        </el-button>-->
            </template>
    </avue-crud>
    <HuilanDialog
      title="绑定"
      append-to-body
      :visible.sync="bindingDialogVisible"
      width="30%"
    >
      <ExchangeBindingList
        ref="list"
        :item="curForm"
      />
    </HuilanDialog>
  </basic-container>
</template>

<script>
import {mapGetters} from "vuex";
import { getList, save, remove } from '@/api/messageMgr/exchangeMgr'
import ExchangeBindingList from './exchangeBindingList'
import { getRules } from '@/util/regx'

export default {
  name: 'ExchangeMgr',
  components: {
    ExchangeBindingList
  },
  data() {
    return{
      form: {
        // type: 'system'
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
        searchShow: true,
        searchMenuSpan: 4,
        border: true,
        index: true,
        // selection: true,
        viewBtn: true,
        menuWidth: 380,
        dialogClickModal: false,
        dialogWidth: '30%',
        column: [
          {
            label: "名称",
            prop: "name",
            span: 24,
            search: true,
            searchSpan: 5,
            rules: [
              {required: true, message: '请输入转换器名称'},
              ...getRules(['charNumHanUnderline'])
            ],
            formatter: this.nameFormatter
          },
          {
            label: "类型",
            prop: "type",
            span: 24,
            search: true,
            searchSpan: 5,
            type: 'select',
            dicData: [
              {
                label: "direct",
                value: 'direct'
              },
              {
                label: "fanout",
                value: 'fanout'
              },
              {
                label: "headers",
                value: 'headers'
              },
              {
                label: "topic",
                value: 'topic'
              }
            ],
            value: 'direct'
          },
          {
            label: "持久化",
            prop: "durable",
            span: 24,
            hide: true,
            type: 'select',
            dicData: [
              {
                label: "Durable",
                value: true
              },
              {
                label: "Transient",
                value: false
              }
            ],
            value: true
          },
          {
            label: "自动删除",
            prop: "auto_delete",
            span: 24,
            hide: true,
            type: 'switch',
            value: false
          },
          {
            label: "内部使用",
            prop: "internal",
            span: 24,
            hide: true,
            type: 'switch',
            value: false
          },
          {
            label: "扩展参数",
            prop: "arguments",
            span: 24,
            hide: true,
            type: 'dynamic',
            children: {
              column: [
                {
                  label: '参数名',
                  prop: 'key',
                  rules: getRules(['charNumLine'])
                },
                {
                  label: '参数值',
                  prop: 'value',
                  type: 'textarea',
                  minRows: 2,
                  rules: getRules(['charNumHanUnderline'])
                }
              ]
            }
          }
        ]
      },
      bindingDialogVisible: false,
      curForm: {}
    }
  },
  computed: {
    ...mapGetters(["permission"]),
    permissionList() {
      return {
        addBtn: this.vaildData(this.permission['messageMgr-exchange-save'], false),
        viewBtn: this.vaildData(this.permission['messageMgr-exchange-view'], false),
        delBtn: this.vaildData(this.permission['messageMgr-exchange-delete'], false),
        binding: this.vaildData(this.permission['messageMgr-exchange-binding'], false),
        editBtn: false
      };
    },
  },
  methods: {
    nameFormatter(row, column, cellValue/*, index*/) {
      if(cellValue) {
        return cellValue
      }else {
        return '(AMQP default)'
      }
    },
    buildSubmitData(data) {
      const body = {
        vhost: '/',
        name: data.name,
        type: data.type,
        internal: data.internal,
        durable: data.durable,
        auto_delete: data.auto_delete,
        arguments: {}
      }
      if(data.arguments) {
        data.arguments.forEach(item => {
          body.arguments[item.key] = item.value
        })
      }
      return {
        name: data.name,
        body: JSON.stringify(body)
      }
    },
    buildFormData(data) {
      const res = {...data, arguments: []}
      for (const [key, value] of Object.entries(data.arguments)) {
        res['arguments'].push({key: key, value: value})
      }
      return res
    },
    rowSave(row, done, loading) {
      // console.log(row)
      const data = this.buildSubmitData(row)
      save(data).then(() => {
        // 获取新增数据的相关字段
        // const data = res.data.data;
        // row.id = data.id;
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
    // rowUpdate(row, index, done, loading) {
    //   const data = this.buildSubmitData(row)
    //   save(data).then(() => {
    //     this.$message({
    //       type: "success",
    //       message: "操作成功!"
    //     });
    //     // 数据回调进行刷新
    //     this.onLoad(this.page)
    //     done();
    //   }, error => {
    //     window.console.log(error);
    //     loading();
    //   });
    // },
    rowDel(row, index, done) {
      this.$confirm("确定将选择数据删除?", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          return remove(row.name);
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
    beforeOpen(done, type) {
      // if (["add"].includes(type)) {
      //   this.form.formJson = ''
      // }
      if (["view"].includes(type)) {
        this.form = this.buildFormData(this.form)
      }
      // getHuilanBaseMqLog(this.form.id)
      done();
    },
    searchReset() {
      this.query = {};
      // this.parentId = 0;
      this.page.currentPage = 1;
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
        size: page.pageSize
      };
      this.loading = true;
      getList(Object.assign(params, this.query, pageConf)).then(res => {
        const data = res.data.data;
        const json = JSON.parse(data)
        this.loading = false;
        this.data = json.items.filter(item=>!!item.name);
        this.page.total = json.total_count;
      });
    },
    binding(row) {
      this.curForm = row
      this.bindingDialogVisible = true
      const list = this.$refs.list
      if(list) {
        this.$nextTick(()=>{
          list.onLoad()
        })
      }
    }
  }
}
</script>

<style scoped>

</style>
