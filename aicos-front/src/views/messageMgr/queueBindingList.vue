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
               @refresh-change="refreshChange"
               @on-load="onLoad">
      <template slot-scope="scope" slot="menu">
        <el-button
          type="text"
          size="small"
          @click.stop="unbind(scope.row,scope.index)"
        >解绑
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
  </basic-container>
</template>

<script>
import {mapGetters} from "vuex";
import { getBindingsExchange, bindings, unbindings } from '@/api/messageMgr/queueMgr'

export default {
  name: 'bindingExchangeList',
  props: {
    item: {
      type: Object,
      default() {
        return {}
      }
    }
  },
  data() {
    return{
      form: {
        // type: 'system'
      },
      query: {},
      loading: false,
      data: [],
      // page: {
      //   pageSize: 10,
      //   currentPage: 1,
      //   total: 0
      // },
      option: {
        tip: false,
        searchShow: true,
        searchMenuSpan: 4,
        border: true,
        index: true,
        // selection: true,
        viewBtn: true,
        menuWidth: 80,
        labelWidth: 100,
        dialogClickModal: false,
        dialogWidth: '30%',
        page: false,
        column: [
          {
            label: "转换器名称",
            prop: "source",
            span: 24,
            rules: [
              {required: true, message: '请输入转换器名称'}
            ]
          },
          {
            label: "路由键",
            prop: "routing_key",
            span: 24,
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
                  prop: 'key'
                },
                {
                  label: '参数值',
                  prop: 'value',
                  type: 'textarea',
                  minRows: 2
                }
              ]
            }
          }
        ]
      },
      curForm: {},
      bindingDialogVisible: false,
      destinationType: 'q'
    }
  },
  computed: {
    ...mapGetters(["permission"]),
    permissionList() {
      return {
        addBtn: this.vaildData(this.permission['messageMgr-exchange-save'], false),
        viewBtn: false,
        delBtn: false,
        editBtn: false
      };
    },
  },
  // watch: {
  //   data() {
  //     this.onLoad()
  //   }
  // },
  methods: {
    buildSubmitData(data) {
      const body = {
        destination: this.item.name,
        destination_type: this.destinationType,
        routing_key: data.routing_key,
        vhost: '/',
        source: data.source,
        arguments: {}
      }
      if(data.arguments) {
        data.arguments.forEach(item => {
          body.arguments[item.key] = item.value
        })
      }
      return {
        source: body.source,
        destination: body.destination,
        destinationType: this.destinationType,
        body: JSON.stringify(body)
      }
    },
    rowSave(row, done, loading) {
      // console.log(row)
      const data = this.buildSubmitData(row)
      bindings(data).then(() => {
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
    beforeOpen(done/*, type*/) {
      // if (["add"].includes(type)) {
      //   this.form.formJson = ''
      // }
      // if (["view"].includes(type)) {
      //   this.form = this.buildFormData(this.form)
      // }
      // getHuilanBaseMqLog(this.form.id)
      done();
    },
    refreshChange() {
      this.onLoad();
    },
    onLoad() {
      this.loading = true;

      getBindingsExchange(this.item.name).then(res => {
        const data = res.data.data;
        const json = JSON.parse(data)
        this.loading = false;
        this.data = json.filter(item=>!!item.source);
        // this.page.total = json.total_count;
      });
    },
    unbind(row) {
      this.$confirm("确定将选择数据解绑?", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          const data = {
            source: row.source,
            destination:row.destination,
            destinationType: this.destinationType,
            propertiesKey: row.properties_key,
            body: JSON.stringify(row)
          }
          return unbindings(data);
        })
        .then(() => {
          this.$message({
            type: "success",
            message: "操作成功!"
          });
          // 数据回调进行刷新
          this.onLoad()
        });
    }
  }
}
</script>

<style scoped>

</style>
