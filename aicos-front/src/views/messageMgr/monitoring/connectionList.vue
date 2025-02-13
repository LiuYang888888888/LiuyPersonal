<template>
  <avue-crud :option="option"
             :search.sync="query"
             :table-loading="loading"
             :data="data"
             ref="crud"
             v-model="form"
             :permission="permissionList"
             :before-open="beforeOpen"
             :page.sync="page"
             @search-change="searchChange"
             @search-reset="searchReset"
             @current-change="currentChange"
             @size-change="sizeChange"
             @refresh-change="refreshChange"
             @on-load="onLoad">
    <!--      <template slot-scope="scope" slot="menu">-->
    <!--        <el-button-->
    <!--          type="text"-->
    <!--          icon="el-icon-edit-outline"-->
    <!--          size="small"-->
    <!--          v-if="permissionList.design"-->
    <!--          @click.stop="designForm(scope.row,scope.index)"-->
    <!--        >表单设计-->
    <!--        </el-button>-->
    <!--        <el-button-->
    <!--          type="text"-->
    <!--          icon="el-icon-position"-->
    <!--          size="small"-->
    <!--          v-if="permissionList.design"-->
    <!--          @click.stop="publishForm(scope.row,scope.index)"-->
    <!--        >发布表单-->
    <!--        </el-button>-->
    <!--      </template>-->
  </avue-crud>
</template>

<script>
import { formateSize } from '@/util/format'
import { getConnections } from '@/api/messageMgr/monitoring'
export default {
  name: 'ConnectionList',
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
        menu: false,
        menuWidth: 380,
        dialogClickModal: false,
        dialogWidth: '30%',
        column: [
          {
            label: "名称",
            prop: "name",
            span: 24,
            formatter(row, column, cellValue/*, index*/) {
              return cellValue.replace(/->.*/, '')
            }
          },
          {
            label: "用户名",
            prop: "user",
            span: 24
          },
          {
            label: "状态",
            prop: "state",
            span: 24
            // display: false,
          },
          {
            label: "SSL / TLS",
            prop: "ssl",
            span: 24
          },
          {
            label: "协议",
            prop: "protocol",
            span: 24
          },
          {
            label: "频道",
            prop: "channels",
            span: 24
          },
          {
            label: "源客户端",
            prop: "recv_oct_details.rate",
            bind: 'recv_oct_details.rate',
            span: 24,
            formatter: this.formatRate
          },
          {
            label: "目标客户端",
            prop: "send_oct_details.rate",
            bind: "send_oct_details.rate",
            span: 24,
            formatter: this.formatRate
          }
        ]
      },
      designDialogVisible: false,
      curForm: {},
      useableFields: [],
      curFormJson: {}
    }
  },
  computed: {
    // ...mapGetters(["permission"]),
    permissionList() {
      return {
        addBtn: false,
        viewBtn: true,
        delBtn: false,
        editBtn: false
      };
    },
  },
  methods: {
    formatRate(row, column, cellValue/*, index*/) {
      const res = formateSize(cellValue)
      return `${res}/s`
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
      getConnections(Object.assign(params, this.query, pageConf)).then(res => {
        const data = res.data.data;
        const json = JSON.parse(data)
        this.loading = false;
        this.data = json.items;
        this.page.total = json.total_count;
      });
    }
  },
  mounted() {
    this.timer = setInterval(()=>{
      this.refreshChange()
    }, 5000)
  },
  beforeDestroy() {
    clearInterval(this.timer)
  }
}
</script>

<style scoped>

</style>
