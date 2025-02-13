<template>
    <avue-crud :option="option"
               :search.sync="query"
               :table-loading="loading"
               :data="data"
               ref="crud"
               v-model="form"
               :page.sync="page"
               @selection-change="selectionChange"
               @search-change="searchChange"
               @search-reset="searchReset"
               @current-change="currentChange"
               @size-change="sizeChange"
               @refresh-change="refreshChange"
               @on-load="onLoad">
      <template slot-scope="scope" slot="menu">
<!--        <el-button-->
<!--          v-if="permissionList.enableStatus"-->
<!--          type="text"-->
<!--          icon="el-icon-setting"-->
<!--          size="small"-->
<!--          @click.stop="enable(scope.row,scope.index)"-->
<!--        >{{scope.row.status === '0' ? '启用' : '停用'}}-->
<!--        </el-button>-->
        <!--        <el-button-->
        <!--          type="text"-->
        <!--          icon="el-icon-document"-->
        <!--          size="small"-->
        <!--          @click.stop="onLoad(scope.row,scope.index)"-->
        <!--        >统计-->
        <!--        </el-button>-->
      </template>
    </avue-crud>
</template>

<script>
import { getList } from '@/api/messageChannelMgr'
// import { getDictionary } from '@/api/system/dict'
// import { getRules } from '@/util/regx'
// import {mapGetters} from "vuex";
export default {
  name: 'BaseChannel',
  props: {
    // extCls: {
    //   type: Array,
    //   default() {
    //     return []
    //   }
    // },
    // type: String,
    selectionChange: {
      type: Function,
      default() {
        return ()=>[]
      }
    },
    // permissionList: {
    //   type: Object,
    //   default() {
    //     return {}
    //   }
    // }
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
        searchMenuSpan: 6,
        border: true,
        index: true,
        // labelWidth: this.labelWidth,
        selection: true,
        // 操作按钮
        addBtn: false,
        editBtn: false,
        delBtn: false,
        viewBtn: false,
        menu: false,
        menuWidth: 380,
        dialogClickModal: false,
        dialogWidth: '30%',
        column: [
          // {
          //   label: "通道编码",
          //   prop: "id",
          //   span: 24,
          //   addDisplay: false,
          //   editDetail: true
          // },
          {
            label: "通道名称",
            prop: "name",
            span: 24,
            searchSpan: 16,
            search: true,
          },
          {
            label: "公众号名称",
            prop: "weixinName",
            span: 24,
          },
          {
            label: "状态",
            prop: "status",
            span: 24,
            type: "switch",
            dicData: [
              {
                label: "停用",
                value: '0'
              },
              {
                label: "启用",
                value: '1'
              }
            ],
            value: '1',
          }
        ]
      },
      dynicCols: [],
      type: 'weixin'
    }
  },
  // computed: {
  //   ...mapGetters(["permission"]),
  //   permissionList() {
  //     return {
  //       addBtn: this.vaildData(this.permission[`message-channel-${this.type}-add`], false),
  //       // viewBtn: this.vaildData(this.permission['system-user-view'], false),
  //       delBtn: this.vaildData(this.permission[`message-channel-${this.type}-delete`], false),
  //       editBtn: this.vaildData(this.permission[`message-channel-${this.type}-update`], false),
  //       enableStatus: this.vaildData(this.permission[`message-channel-${this.type}-enableStatus`], false)
  //     };
  //   }
  // },
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
        type: this.type,
        current: page.currentPage,
        size: page.pageSize
      };
      this.loading = true;
      getList(Object.assign(params, this.query, pageConf)).then(res => {
        const data = res.data.data;
        this.loading = false;
        this.data = data.records;
        this.page.total = data.total;
      });
    },
    // extOption() {
    //   const keys = this.extCls.map(item=> item.prop)
    //   // keys.push('ext')
    //   this.dynicCols = keys
    //   const columns = this.option.column
    //   columns.splice(2,0, ...this.extCls)
    // }
  },
  mounted() {
    // this.getConfig()
    // this.extOption()
  }
}
</script>

<style scoped>

</style>
