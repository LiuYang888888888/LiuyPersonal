<template>
  <basic-container>
    <avue-crud :option="option" :table-loading="loading" :data="data" :page="page" :permission="permissionList"
      :before-open="beforeOpen" v-model="form" ref="crud" @row-update="rowUpdate" @row-save="rowSave" @row-del="rowDel"
      @search-change="searchChange" @search-reset="searchReset" @selection-change="selectionChange"
      @current-change="currentChange" @size-change="sizeChange" @on-load="onLoad">
      
      <template v-slot:menu="scope">
        <el-button type="text" size="small" v-if="permissionList.hzdetailBtn"
          @click="mingxihzDetail(scope.row)">详情
        </el-button>
      </template>
    </avue-crud>
    <!--各部门明细详情-->
    <HuilanDialog :title="bumenTitle" :fullscreen="true" width="80%" append-to-body :visible.sync="bumenDetail" @close="handleClose">
      <div style="width: 100%;padding:10px">
        <div class="jidumain">
          <div class="chushi">处室：{{ bumen }}</div>
          <div class="jiduclass">{{ jidu }}</div>
        </div>
        <table align="center" width="100%" class="table xunw_table_form" border="1">
          <tr>
            <td>序号</td>
            <td>姓名</td>
            <td>职务</td>
            <td>（{{month1}}）月份考核等次</td>
            <td>（{{month2}}）月份考核等次</td>
            <td>（{{month3}}）月份考核等次</td>
            <td>备注</td>
          </tr>
          <tr v-for="(item,index) in bumenList" :key="index">
            <td>{{index+1}}</td>
            <td>{{item['姓名']}}</td>
            <td>{{item.zhiw}}</td>
            <td>{{item[monthall1]}}</td>
            <td>{{item[monthall2]}}</td>
            <td>{{item[monthall3]}}</td>
            <td>{{item.remark}}</td>
          </tr>
          <tr>
            <td colspan="3">优秀人数合计</td>
            <td>{{ monthnum1 }}人</td>
            <td>{{ monthnum2 }}人</td>
            <td>{{ monthnum3 }}人</td>
            <td></td>
          </tr>
        </table>
      </div>
    </HuilanDialog>
  </basic-container>
</template>

<script>
import { mapGetters } from "vuex";
import {
  getYueLingquDetail,
  kaoheDetailSumDept
} from "@/api/Political/common";
export default {
  data () {
    return {
      bumenTitle:'部门详情',
      bumenDetail:false,
      bumenList:[],
      bumen:'',
      jidu:'',
      month1:1,
      month2:2,
      month3:3,
      monthnum1:0,
      monthnum2:0,
      monthnum3:0,

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
    mingxihzDetail(row){
      this.bumen = row.dept_name
      this.jidu = row.khndjd
      if(row.kaohjd == 1){
        this.month1 = 1
        this.month2 = 2
        this.month3 = 3
        this.monthall1 = row.khnd + '-01'
        this.monthall2 = row.khnd + '-02'
        this.monthall3 = row.khnd + '-03'
      }else if(row.kaohjd == 2){
        this.month1 = 4
        this.month2 = 5
        this.month3 = 6
        this.monthall1 = row.khnd + '-04'
        this.monthall2 = row.khnd + '-05'
        this.monthall3 = row.khnd + '-06'
      }else if(row.kaohjd == 3){
        this.month1 = 7
        this.month2 = 8
        this.month3 = 9
        this.monthall1 = row.khnd + '-07'
        this.monthall2 = row.khnd + '-08'
        this.monthall3 = row.khnd + '-09'
      }else if(row.kaohjd == 4){
        this.month1 = 10
        this.month2 = 11
        this.month3 = 12
        this.monthall1 = row.khnd + '-10'
        this.monthall2 = row.khnd + '-11'
        this.monthall3 = row.khnd + '-12'
      }
      kaoheDetailSumDept({chusdm:row.deptid,guanlzbid:row.id}).then(res =>{
        if(res.data.code == 200){
          this.bumenDetail = true
          this.bumenList = res.data.data
          this.bumenList.forEach((item) => {
            if(item[this.monthall1] == '好'){
              this.monthnum1 += 1
            }
            if(item[this.monthall2] == '好'){
              this.monthnum2 += 1
            }
            if(item[this.monthall3] == '好'){
              this.monthnum3 += 1
            }
          })
        }else{
          this.$message({
            type: "error",
            message: res.msg
          });
        }
      },error => {
        window.console.log(error);
      });
    },
    //关闭部门详情
    handleClose(){
      this.month1 = 0
      this.month2 = 0
      this.month3 = 0
      this.monthall1 = ''
      this.monthall2 = ''
      this.monthall3 = ''
      this.monthnum1 = 0
      this.monthnum2 = 0
      this.monthnum3 = 0
      this.bumen = ''
      this.jidu = ''
      this.bumenDetail = false
      this.bumenList = []
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
<style scoped>
.kqtitle {
  display: flex;
  height: 60px;
  width: 100%;
  line-height: 60px;
  margin: 40px auto;
}

.cstitle {
  height: 60px;
  width: 100%;
  line-height: 60px;
  text-align: center;
  margin: 40px auto 0;
  font-size: 18px;
  font-weight: 600;
}

.csdate {
  width: 100%;
  text-align: center;
  height: 30px;
  line-height: 30px;
  margin: 0 auto 40px;
  font-size: 16px;
}

.kqtxt {
  font-size: 18px;
  width: 100%;
  text-align: center;
}

.listadd {
  width: 60%;
  margin: 0 auto 40px;
  text-align: right;
}

.footer {
  width: 200px;
  margin: 200px auto 0;
  display: flex;
}

.table tr {
  height: 40px;
}

.table tr td {
  line-height: 40px;
  text-align: center;
}

.zhushi {
  width: 100%;
  text-align: center;
  height: 30px;
  line-height: 30px;
  font-size: 14px;
}

.csfooter {
  width: 100%;
  margin: 200px auto 0;
  text-align: center;
}
/deep/ .el-button--primary.is-plain{
  color: #fff;
}
.jidumain{
  display: flex;
  justify-content: space-between;
  margin-bottom: 20px;
  width: 100%;
}
.jidumain .chushi{
  font-size: 18px;
  font-weight: 600;
  margin-left: 20px;
}
.jidumain .jiduclass{
  font-size: 18px;
  font-weight: 600;
  margin-right: 20px;
}
</style>
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
