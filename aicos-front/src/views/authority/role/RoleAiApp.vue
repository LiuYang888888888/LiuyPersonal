<template>
  <el-container>
    <el-main>
      <avue-crud :option="option" :search.sync="query" :table-loading="loading" :data="data" ref="crud" :page.sync="page"
        @search-change="searchChange" @search-reset="searchReset" @current-change="currentChange"
        @size-change="sizeChange" @refresh-change="refreshChange" @on-load="onLoad">

        <template slot-scope="scope" slot="menu">
          <el-button type="text" icon="el-icon-plus" size="small" :disabled="handleCanAdd(scope.row)"
            @click.stop="handleAdd(scope.row, scope.index)">{{ $t('aicosCommon.addBtn') }}
          </el-button>
        </template>
      </avue-crud>
    </el-main>
    <el-aside width="200px">
      <el-card shadow="never" header="已选应用" :body-style="{ padding: '5px', height: '460px', overflow: 'auto' }">
        <List :data="value" :props="lisProps" @itemRemove="handleRemove" />
      </el-card>
    </el-aside>
  </el-container>
</template>
<script>
import { applicationListByPage } from '@/api/configure/application'
import List from '@/components/list'

export default {
  components: {
    List
  },
  props: {
    value: {
      type: Array,
      default () {
        return []
      }
    },
    role: {
      type: Object,
      default () {
        return {}
      }
    }
  },
  data () {
    return {
      query: {},
      loading: true,
      platformLoading: false,
      page: {
        pageSize: 10,
        currentPage: 1,
        total: 0,
        pagerCount: 5,
        layout: "->,total, prev, pager, next, jumper",
      },
      option: {
        height: 400,
        calcHeight: 80,
        tip: false,
        searchShow: true,
        searchSpan: 8,
        gutter: 2,
        searchMenuSpan: 8,
        border: false,
        index: false,
        selection: false,
        addBtn: false,
        editBtn: false,
        delBtn: false,
        menuWidth: 90,
        //dialogType: 'drawer',
        dialogClickModal: false,
        dialogWidth: '40%',
        column: [
          {
            label: "应用名称",
            prop: "name",
            search: true,
            display: false
          },
          {
            label: "appKey",
            prop: "appKey",
            display: false,
            width: '270px',
          },
          {
            label: "启用状态",
            prop: "status",
            type: "radio",
            width: '100px',
            dicData: [
              {
                label: "启用",
                value: '1'
              },
              {
                label: "停用",
                value: '0'
              }
            ]
          }
        ]
      },
      data: [],
      // selectedUsers: [],
      lisProps: {
        key: 'id',
        label: 'name'
      }
    }
  },
  methods: {
    searchReset () {
      this.query = {};
      this.onLoad(this.page);
    },
    searchChange (params, done) {
      this.query = params;
      // this.parentId = '';
      this.page.currentPage = 1;
      this.onLoad(this.page, params);
      done();
    },
    currentChange (currentPage) {
      this.page.currentPage = currentPage;
    },
    sizeChange (pageSize) {
      this.page.pageSize = pageSize;
    },
    refreshChange () {
      this.onLoad(this.page, this.query);
    },
    onLoad (page, params = {}) {
      const postData = {
        roleId: this.role.id,
        current: page.currentPage,
        size: page.pageSize,
        ...params,
        ...this.query,
        // realName: this.query.real_name
      }
      // Reflect.deleteProperty(postData, 'real_name')
      this.loading = true;
      applicationListByPage(postData).then(res => {
        const data = res.data.data;
        this.page.total = data.total;
        this.data = data.records;
        this.loading = false;
      });
    },
    handleCanAdd (row) {
      return this.value.some(item => item.id === row.id)
    },
    handleAdd (row/*, index*/) {
      this.value.push(row)
      this.$emit('input', this.value)
    },
    handleRemove (item, index) {
      this.value.splice(index, 1);
      this.$emit('input', this.value)
    }
  }
}
</script>
