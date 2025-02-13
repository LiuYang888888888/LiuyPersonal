<template>
  <basic-container>
    <avue-crud :option="option"
               :table-loading="loading"
               :data="data"
               ref="crud"
               v-model="form"
               :page.sync="page"
               :permission="permissionList"
               :before-open="beforeOpen"
               @row-del="rowDel"
               @search-change="searchChange"
               @search-reset="searchReset"
               @selection-change="selectionChange"
               @current-change="currentChange"
               @size-change="sizeChange"
               @refresh-change="refreshChange"
               @on-load="onLoad">
      <template slot="content" slot-scope="scope">
        <div class="content">
          <span @click="handClick">链接地址【{{scope.row.ext1}}】</span>
        </div>
      </template>
      <template slot="menuLeft">
        <el-button
          type="primary"
          size="small"
          @click.stop="setAllRead"
        >全部设为已读
        </el-button>
      </template>
<!--      <template slot-scope="scope" slot="menu">-->
<!--        <el-button-->
<!--          type="text"-->
<!--          icon="el-icon-setting"-->
<!--          size="small"-->
<!--          v-if="permissionList.enableStatus"-->
<!--          @click.stop="enable(scope.row,scope.index)"-->
<!--        >{{scope.row.status === '1' ? '停用' : '启用'}}-->
<!--        </el-button>-->
<!--      </template>-->
    </avue-crud>
  </basic-container>
</template>

<script>
import { getListPageByMessageParam, remove, getMessageById, setAllStatus } from '@/api/mywork/myMessage'
import {mapGetters} from "vuex";
export default {
  name: 'index',
  props: {
    type: {
      type: String
    }
  },
  data() {
    return {
      
      form: {},
      selectionList: [],
      query: {},
      loading: true,
      page: {
        pageSize: 10,
        currentPage: 1,
        total: 0
      },
      option: {
        // height: 'auto',
        calcHeight: 30,
        tip: false,
        searchShow: true,
        searchMenuSpan: 6,
        border: true,
        index: true,
        // selection: true,
        viewBtn: true,
        delBtn:true,
        menuWidth: 400,
        dialogWidth: 900,
        dialogClickModal: false,
        column: [
          {
            label: "标题",
            prop: "title",
            // width: 180,
            search: true,
            // addDisplay: false,
            // editDisplay: false,
            // editDisabled: true,
            span: 24
          },
          {
            label: "内容",
            prop: "content",
            // width: 180,
            span: 24,
          },
          {
            label: "状态",
            prop: "status",
            width: 80,
            search: true,
            addDisplay: false,
            editDisplay: false,
            type: 'select',
            dicData: [
              {
                label: "未读",
                value: '1'
              },
              {
                label: "已读",
                value: '2'
              }
            ]
          },
          {
            label: "创建时间",
            prop: "createTime",
            width: 150,
            addDisplay: false,
            editDisplay: false,
            type: 'date',
            format: "yyyy-MM-dd HH:mm:ss",
            valueFormat: "yyyy-MM-dd HH:mm:ss",
          }
        ]
      },
      data: []
    };
  },
  computed: {
    ...mapGetters(["permission"]),
    permissionList() {
      return {
        addBtn: false,
        viewBtn: this.vaildData(this.permission['system-messagetemplate-view-role'], false),
        // viewBtn: false,
        // delBtn: this.vaildData(this.permission['system-messagetemplate-delete'], false),
        delBtn: this.vaildData(this.permission['system-messagetemplate-delete-role'], false),
        editBtn: false
      };
    }
  },
  methods: {
    rowDel(row) {
      this.$confirm("确定将选择数据删除?", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          return remove(row.id);
        })
        .then(() => {
          this.onLoad(this.page);
          this.$message({
            type: "success",
            message: "操作成功!"
          });
        });
    },
    async handleClick(item) {
      await getMessageById(item.id)

      item.tag = '已读';
      item.readStatus = 4;
      this.$router.push(item.ext1)
    },
    async beforeOpen(done, type) {
      console.log("done",done)
      console.log("type",type)

      if(type === 'view') {
        const {data: {data}} = await getMessageById(this.form.id)
        this.form = data
        this.refreshChange()
      }
      done();
    },
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
    selectionChange(list) {
      this.selectionList = list;
    },
    selectionClear() {
      this.selectionList = [];
      this.$refs.crud.toggleSelection();
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
      const param = {
        current: page.currentPage,
        size: page.pageSize,
        type: this.type,
        ...params,
        ...this.query
      }
      this.loading = true;
      getListPageByMessageParam(param).then(res => {
        const data = res.data.data;
        this.page.total = data.total;
        this.data = data.records;
        this.loading = false;
        this.selectionClear();
      });
    },
    async setAllRead() {
      const params = {
        status: '2'
      }
      await setAllStatus(params)
      this.$message.success('设置成功')
      this.refreshChange()
    }
  }
}
</script>

<style scoped>

</style>
