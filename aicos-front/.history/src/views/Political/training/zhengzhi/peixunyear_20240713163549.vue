<template>
  <basic-container>
    <avue-crud :option="option" :table-loading="loading" :data="data" :page="page" :permission="permissionList"
      :before-open="beforeOpen" v-model="form" ref="crud" @row-update="rowUpdate" @row-save="rowSave" @row-del="rowDel"
      @search-change="searchChange" @search-reset="searchReset" @selection-change="selectionChange"
      @current-change="currentChange" @size-change="sizeChange" @on-load="onLoad">
      <template v-slot:menu="scope">
        <el-button type="text" size="small" v-if="permissionList.yearBtn"
          @click="comFormMagyear(scope.row)">详情
        </el-button>
      </template>
    </avue-crud>

    <HuilanDialog
      :title="yearTitle"
      :fullscreen="false"
      width="80%"
      append-to-body
      :visible.sync="yearShow"
    >
      <el-table
        :data="tableDatacs"
        border
        style="width: 90%;margin: 0 auto;">
        <el-table-column
          align="center"
          label="所属部门"
          width="180">
          <template slot-scope="{ row }">
            <span>{{ row.chushi }}</span>
          </template>
        </el-table-column>

        <el-table-column
          align="center"
          label="人员"
          width="180">
          <template slot-scope="{ row }">
            <span>{{ row.name }}</span>
          </template>
        </el-table-column>

        <el-table-column
          align="center" 
          label="职务"
          width="180">
          <template slot-scope="{ row }">
            <span>{{ row.zhiwu }}</span>
          </template>
        </el-table-column>

        <el-table-column
          align="center" 
          label='培训会议名称'
          width="250">
          <template slot-scope="{ row }">
            <span>{{ row.mingcheng }}</span>
          </template>
        </el-table-column>

        <el-table-column
          align="center" 
          label="培训日期"
          width="180">
          <template slot-scope="{ row }">
            <span>{{ row.date }}</span>
          </template>
        </el-table-column>

        <el-table-column
          align="center" 
          label="培训时长"
          >
          <template slot-scope="{ row }">
            <span>{{ row.num }}</span>
          </template>
        </el-table-column>
      </el-table>

      <div class="footer">
        <el-button plain @click="closecs">关闭</el-button>
      </div>
    </HuilanDialog>

  </basic-container>
</template>

<script>
import { mapGetters } from "vuex";

export default {
  data () {
    return {
      yearShow:false,
      yearTitle:'详情',
      tableDatacs:[{chushi:'秘书处',name:'张三',zhiwu:'秘书长',mingcheng:'测试会议',date:'2024-05-10',num:'10'}],

      form: {},
      query: {},
      loading: true,
      page: {
        pageSize: 10,
        currentPage: 1,
        total: 0
      },
      selectionList: [],
      option: {
        height: 'auto',
        align: 'center',
        calcHeight: 210,
        searchShow: true,
        searchMenuSpan: 6,
        tip: false,
        border: true,
        index: true,
        indexLabel: '序号',
        indexWidth: 100,
        viewBtn: false,
        addBtn: false,
        delBtn: false,
        editBtn: false,
        selection: true,
        labelPosition: 'left',
        labelSuffix: '：',
        labelWidth: 120,
        gutter: 0,
        menu: true,
        submitBtn: true,
        submitText: '提交',
        emptyBtn: true,
        emptyText: '清空',
        menuPosition: 'center',
        column: [
          {
            type: 'year',
            label: '年度',
            span: 24,
            display: false,
            format: 'yyyy',
            valueFormat: 'yyyy',
            hideLabel: false,
            dataType: 'datetime',
            prop: 'niand',
            isListDisplay: true,
            search: true,
            searchLabelWidth: 60,
            searchSpan: 4,
          },
          {
            type: 'select',
            label: '所属部门',
            dicData: [],
            cascaderItem: [],
            span: 24,
            display: true,
            props: {
              label: 'name',
              value: 'name'
            },
            hideLabel: false,
            prop: 'dept_name',
            isListDisplay: true,
            search: true,
            searchLabelWidth: 100,
            searchSpan: 6,
          },
          {
            type: 'input',
            label: '人员',
            span: 24,
            display: false,
            hideLabel: false,
            prop: 'peixryxm',
            isListDisplay: true,
          },
          {
            type: 'input',
            label: '姓名',
            span: 8,
            display: true,
            hideLabel: false,
            prop: 'xingm',
            isListDisplay: true,
            search: true,
            searchLabelWidth: 60,
            searchSpan: 4,
            hide:true,
          },
          {
            type: 'select',
            label: '职务',
            span: 12,
            display: true,
            hideLabel: false,
            prop: 'zhiw',
            isListDisplay: true,
          },
          {
            type: 'date',
            label: '培训日期',
            span: 24,
            display: true,
            format: 'yyyy-MM-dd',
            valueFormat: 'yyyy-MM-dd',
            hideLabel: false,
            dataType: 'datetime',
            prop: 'peixrq',
            isListDisplay: true,
            search: true,
            searchRange: true,
            searchLabelWidth: 120,
            searchSpan: 8,
            hide:true
          },
          {
            type: 'input',
            label: '培训时长大于',
            span: 8,
            display: true,
            hideLabel: false,
            prop: 'dayu',
            isListDisplay: true,
            search: true,
            searchLabelWidth: 120,
            searchSpan: 6,
            hide:true,
          },
          {
            label: '培训时长小于',
            span: 8,
            display: true,
            hideLabel: false,
            prop: 'xiaoyu',
            isListDisplay: true,
            search: true,
            searchLabelWidth: 120,
            searchSpan: 6,
            hide:true,
          },
          {
            type: 'input',
            label: '累计培训时长',
            span: 24,
            display: false,
            hideLabel: false,
            prop: 'string_xingm',
            isListDisplay: true,
          },
        ],
      },
      data: []
    };
  },
  computed: {
    ...mapGetters(["permission"]),
    permissionList () {
      return {
        yearBtn: this.vaildData(
          this.permission[`sys-commonForm-dataMag-peixunyear`],
          false
        ),
      };
    },
    ids () {
      let ids = [];
      this.selectionList.forEach(ele => {
        ids.push(ele.id);
      });
      return ids.join(",");
    }
  },
  methods: {
    comFormMagyear () {
      this.yearShow = true
    },
    closecs(){
      this.yearShow = false
    },
    rowSave (row, done, loading) {
      add(row).then(() => {
        done();
        this.onLoad(this.page);
        this.$message({
          type: "success",
          message: "操作成功!"
        });
      }, error => {
        window.console.log(error);
        loading();
      });
    },
    rowUpdate (row, index, done, loading) {
      update(row).then(() => {
        done();
        this.onLoad(this.page);
        this.$message({
          type: "success",
          message: "操作成功!"
        });
      }, error => {
        window.console.log(error);
        loading();
      });
    },
    rowDel (row) {
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
    handleDelete () {
      if (this.selectionList.length === 0) {
        this.$message.warning("请选择至少一条数据");
        return;
      }
      this.$confirm("确定将选择数据删除?", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          return remove(this.ids);
        })
        .then(() => {
          this.onLoad(this.page);
          this.$message({
            type: "success",
            message: "操作成功!"
          });
          this.$refs.crud.toggleSelection();
        });
    },
    beforeOpen (done, type) {
      if (["edit", "view"].includes(type)) {
        // getDetail(this.form.id).then(res => {
        //   this.form = res.data.data;
        // });
      }
      done();
    },
    searchReset () {
      this.query = {};
      this.onLoad(this.page);
    },
    searchChange (params, done) {
      this.query = params;
      this.page.currentPage = 1;
      this.onLoad(this.page, params);
      done();
    },
    selectionChange (list) {
      this.selectionList = list;
    },
    selectionClear () {
      this.selectionList = [];
      this.$refs.crud.toggleSelection();
    },
    currentChange (currentPage) {
      this.page.currentPage = currentPage;
    },
    sizeChange (pageSize) {
      this.page.pageSize = pageSize;
    },
    onLoad (page, params = {}) {
      this.loading = false;
      this.data = [{ string_biaot: '测试标题', bumen: '测试部门', name: '测试人', time: '2024-05-10', string_nar: '测试内容' }]
      // getList(page.currentPage, page.pageSize, Object.assign(params, this.query)).then(res => {
      //   const data = res.data.data;
      //   this.page.total = data.total;
      //   this.data = data.records;
      //   this.loading = false;
      //   this.selectionClear();
      // });
    }
  }
};
</script>

<style></style>
