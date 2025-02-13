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
      :title="jieshouTitle"
      :fullscreen="true"
      :center = "true"
      width="90%"
      append-to-body
      :visible.sync="jieshouShow"
    >
      <div class="tztitle">产业融合发展办：</div>
      <div class="tztop">根据我办公务员平时考核方案，{{jidu}}你处“好”等次人数如下：</div>
      <el-table
        :data="tableData"
        border
        style="width: 60%;margin: 0 auto;">
        <el-table-column
          align="center"
          label="处室名称"
          width="180">
          <template slot-scope="{ row }">
            <span>{{ row.chusmc }}</span>
          </template>
        </el-table-column>

        <el-table-column
          align="center"
          label="月份"
          >
          <template slot-scope="{ row }">
            <span >{{ row.yuef }}</span>
          </template>
        </el-table-column>

        <el-table-column
          align="center" 
          label="考核人数"
         >
          <template slot-scope="{ row }">
            <span >{{ row.kaohrs }}</span>
          </template>
        </el-table-column>

        <el-table-column
          align="center" 
          label='“好”人数'
         >
          <template slot-scope="{ row }">
            <span >{{ row.haors }}</span>
          </template>
        </el-table-column>

        <el-table-column
          v-show="!kqdis"
          align="center"
          width="200"
          label="备注">
          <template slot-scope="{ row }">
            <span >{{ row.beiz }}</span>
          </template>
        </el-table-column>
      </el-table>
      <div class="tzfinal">请与{{jiezhi}}前将个人《公务员平时考核登记表》及处室《公务员平时考核结果汇总表》交至政治部。</div>
      <div class="tzjob">政治部</div>
      <div class="tzdate">{{ nowtime }}</div>

      <div class="footer">
        <el-button plain @click="closekq">关闭</el-button>
      </div>
    </HuilanDialog>
  </basic-container>
</template>

<script>
import { mapGetters } from "vuex";
import {
  getYueLingquDetail,
  getDepartment,
  getJieshouDetail
} from "@/api/Political/common";
export default {
  data () {
    return {
      deptId:'',
      jidu:'',
      jiezhi:'',
      nowtime:'',
      jieshouTitle:'通知',
      jieshouShow:false,
      tableData:[],

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
        selection: false,
        column: [
          {
            label: "处室名称",
            prop: "dept_name",
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
            prop: 'khnd',
            isListDisplay: true,
            search: true,
            hide:true,
          },
          {
            type: 'select',
            label: '季度',
            dicData: [
              {
                label: '第一季度',
                value: '1'
              },
              {
                label: '第二季度',
                value: '2'
              },
              {
                label: '第三季度',
                value: '3'
              },
              {
                label: '第四季度',
                value: '4'
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
            prop: 'kaohjd',
            isListDisplay: true,
            search: true,
            hide:true,
          },
          {
            label: '季度',
            span: 24,
            display: false,
            hideLabel: false,
            prop: 'khndjd',
            isListDisplay: true,
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
    comFormMagDetail(row){
      this.jidu = row.khndjd
      if(row.jiezrq){
        let datearr = row.jiezrq.split('-')
        this.jiezhi = datearr[0]+'年'+datearr[1]+'月'+datearr[2]+'日'
      }
      this.nowtime = this.getCurrentDate()
      getDepartment().then(res =>{
        getJieshouDetail({chusdm:res.data.data.id,guanlzbid:row.id,current:1,size:9999}).then(res =>{
          if(res.data.code == 200){
            this.jieshouShow = true
            this.tableData = res.data.data.records
          }else{
            this.$message({
              type: "error",
              message: res.msg
            });
          }
        })
      })
    },
    closehzDetail(){
      this.hzDetail = false
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
    onLoad (page) {
      this.loading = false;
      const dataParam = {
        current: page.currentPage,
        size: page.pageSize,
        ...this.query,
      };
      getYueLingquDetail(dataParam).then(res => {
        const data = res.data.data;
        this.page.total = data.total;
        this.data = data.records;
        this.loading = false;
        this.selectionClear();
      });
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
