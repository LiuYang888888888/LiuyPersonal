<template>
  <basic-container>
    <avue-crud :option="option" :table-loading="loading" :data="data" :page="page" :permission="permissionList"
      :before-open="beforeOpen" v-model="form" ref="crud" @row-update="rowUpdate" @row-save="rowSave" @row-del="rowDel"
      @search-change="searchChange" @search-reset="searchReset" @selection-change="selectionChange"
      @current-change="currentChange" @size-change="sizeChange" @on-load="onLoad">
      
      <template v-slot:menu="scope">
        <el-button type="text" size="small" v-if="permissionList.hzdetailBtn"
          @click="comFormMagDetail(scope.row)">详情
        </el-button>
      </template>
    </avue-crud>
    <!--处室汇总表详情-->
    <HuilanDialog
      :title="hzTitle"
      :fullscreen="false"
      width="80%"
      append-to-body
      :visible.sync="hzDetail"
    > 
      <div class="hzTop">
        <div class="hztitle">处室：{{ hzJob }}</div>
        <div class="jidu">{{ hzJiDu }}</div>
      </div>

      <div style="width: 100%;padding:10px">
        <table align="center" width="100%" class="table xunw_table_form" border="1">
          <tr>
            <th>序号</th>
            <th>姓名</th>
            <th>职务</th>
            <th>（{{jidunum1}}）月份考核等次</th>
            <th>（{{jidunum2}}）月份考核等次</th>
            <th>（{{jidunum3}}）月份考核等次</th>
            <th>备注</th>
          </tr>
          <tr v-for="(item,index) in hzList" :key="index">
            <td>{{index+1}}</td>
            <td>{{item.name}}</td>
            <td>{{item.job}}</td>
            <td>{{item.jidu1}}</td>
            <td>{{item.jidu2}}</td>
            <td>{{item.jidu3}}</td>
            <td>{{item.remark}}</td>
          </tr>
          <tr>
            <td colspan="3">优秀人数合计</td>
            <td>{{ heji1 }}</td>
            <td>{{ heji2 }}</td>
            <td>{{ heji3 }}</td>
          </tr>
        </table>
      </div>
      <div class="csfooter">
        <el-button plain @click="closehzDetail">关闭</el-button>
      </div>
    </HuilanDialog>
  </basic-container>
</template>

<script>
import { mapGetters } from "vuex";
import {
  getYueLingquDetail
} from "@/api/Political/common";
export default {
  data () {
    return {
      hzTitle:'汇总详情',
      hzDetail:false,
      hzList:[{name:'测试1',job:'政治部主任',jidu1:'好',jidu2:'较好',jidu3:'一般',remark:'测试'}],
      hzJiDu:'2024年第一季度',
      hzJob:'政治部',
      heji1:'1人',
      heji2:'1人',
      heji3:'1人',

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
        addBtn:false,
        editBtn:false,
        delBtn:false,
        indexLabel:'序号',
        indexWidth:100,
        index: true,
        viewBtn: false,
        selection: true,
        column: [
          {
            label: "处室名称",
            prop: "dept",
            display: false,
            search: true,
          },
          {
            type: 'year',
            label: '年度',
            span: 24,
            display: false,
            format: 'yyyy',
            valueFormat: 'yyyy',
            hideLabel: false,
            dataType: 'datetime',
            prop: 'datetime_niand',
            isListDisplay: true,
            search: true,
          },
          {
            type: 'select',
            label: '季度',
            dicData: [
              {
                label: '第一季度',
                value: '0'
              },
              {
                label: '第二季度',
                value: '1'
              },
              {
                label: '第三季度',
                value: '2'
              },
              {
                label: '第四季度',
                value: '3'
              }
            ],
            cascaderItem: [],
            span: 24,
            display: false,
            props: {
              label: 'label',
              value: 'value'
            },
            hideLabel: false,
            dataType: 'string',
            prop: 'string_jid',
            isListDisplay: true,
            search: true
          },
        ]
      },
      data: []
    };
  },
  computed: {
    ...mapGetters(["permission"]),
    permissionList () {
      return {
        hzdetailBtn: this.vaildData(
          this.permission[`sys-commonForm-dataMag-hz-detail`],
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
    comFormMagDetail(){
      this.hzDetail = true
    },
    closehzDetail(){
      this.hzDetail = false
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
        getDetail(this.form.id).then(res => {
          this.form = res.data.data;
        });
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
      // this.data = [{dept:'秘书处',datetime_niand:'2024',string_jid:'0'}]
      // // getYueLingquDetail(page.currentPage, page.pageSize, Object.assign(params, this.query)).then(res => {
      // //   const data = res.data.data;
      // //   this.page.total = data.total;
      // //   this.data = data.records;
      // //   this.loading = false;
      // //   this.selectionClear();
      // // });
    }
  }
};
</script>

<style>
.hzTop{
  width: 100%;
  display: flex;
  justify-content: space-between;
}
.hztitle{
  margin-left: 10%;
}
.jidu{
  margin-right: 10%;
}
</style>
