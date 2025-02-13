<template>
  <HuilanBasic>
    <!-- <HuilanBasicToolbar style="margin-top: 0;">
      <el-button
        type="primary"
        size="small"
        @click="handleAdd"
        >新增</el-button
      >
    </HuilanBasicToolbar> -->
    <el-upload :auto-upload="false"
               :show-file-list="false"
               action="action"
               :on-change="handleChange"
               style="margin-bottom: 20px;">
      <el-button type="primary">导入</el-button>
    </el-upload>
    <avue-crud
      :option="option"
      :search.sync="search"
      :table-loading="loading"
      :permission="permissionList"
      :data="data"
      ref="crud"
      v-model="form"
      @cell-click="cellClick"
      @row-del="rowDel"
      @row-update="rowUpdate"
      @row-save="rowSave"
      :before-open="beforeOpen"
      :page.sync="page"
      @selection-change="selectionChange"
      @search-change="searchChange"
      @current-change="currentChange"
      @size-change="sizeChange"
      @refresh-change="refreshChange"
      @on-load="onLoad"
    >
    </avue-crud>

    <HuilanDialog
      :title="dataMagFormTitle"
      :fullscreen="false"
      append-to-body
      :before-close="dataMagFormClose"
      :visible.sync="dataMagFormTag"
      class="dataMagFormClass"
    >
      <div class="showYear" v-if="yearMoney">
        <div class="showYearList" v-for="(item,index) in activities" :key="index">
          <div class="year">{{ item.timestamp}}</div>
          <div class="money">{{ item.content}}</div>
        </div>
      </div>

      <div class="showYear" v-if="yearLirun">
        <div class="showYearList" v-for="(item,index) in activities" :key="index">
          <div class="year">{{ item.timestamp}}</div>
          <div class="money">{{ item.content}}</div>
        </div>
      </div>
       
      <!--科技创新人员能力-->
      <el-table v-if="yearchuang1"
        :data="tableData"
        border
        style="width: 100%">
        <el-table-column
          align="center"
          prop="zlnum"
          label="科技研发人数（人）"
          width="180">
        </el-table-column>
        <el-table-column
          align="center"
          prop="kjnum"
          label="大学以上学历人数（人）"
          width="180">
        </el-table-column>
        <el-table-column
          align="center"
          prop="articlenum"
          label="高级技术职称人数（人）">
        </el-table-column>
        <el-table-column
          align="center"
          prop="countrynum"
          label="高级技工人数（人）">
        </el-table-column>
      </el-table>

      <!--科技创新设备能力-->
      <el-table v-if="yearchuang2"
        :data="tableData"
        border
        style="width: 100%">
        <el-table-column
          align="center"
          prop="zlnum"
          label="设备总数（台/套）"
          width="180">
        </el-table-column>
        <el-table-column
          align="center"
          prop="kjnum"
          label="参与河南省设备仪器向社会开放共享总数（台/套）"
          width="180">
        </el-table-column>
        <el-table-column
          align="center"
          prop="articlenum"
          label="设备价值总额（万元）">
        </el-table-column>
      </el-table>

      <!--科技创新成果能力-->
      <el-table v-if="yearchuang4"
        :data="tableData"
        border
        style="width: 100%">
        <el-table-column
          align="center"
          prop="zlnum"
          label="授权专利数量(项)"
          width="180">
        </el-table-column>
        <el-table-column
          align="center"
          prop="kjnum"
          label="科技专著数量(项)"
          width="180">
        </el-table-column>
        <el-table-column
          align="center"
          prop="articlenum"
          label="科技论文发表数(项)">
        </el-table-column>
        <el-table-column
          align="center"
          prop="countrynum"
          label="国家级科技成果获奖数量(项)">
        </el-table-column>
        <el-table-column
          align="center"
          prop="provicenum"
          label="省部级科技成果获奖数量(项)">
        </el-table-column>
        <el-table-column
          align="center"
          prop="othernum"
          label="其他科技成果获奖数量(项)">
        </el-table-column>
        <el-table-column
          align="center"
          prop="biaozhun"
          label="参与国家标准制定(项)">
        </el-table-column>
        <el-table-column
          align="center"
          prop="hangye"
          label="参与行业标准制定(项)">
        </el-table-column>
      </el-table>

    </HuilanDialog>
  </HuilanBasic>
</template>

<script>
import {
  getList,
  remove,
  update,
  getUserAllInfo,
  enableStatus,
  lockStatus,
  resetPassword,
  getBaseUserByAccount,
} from "@/api/system/user";
import { mapGetters } from "vuex";
import departmentAuthorityTree from "@/components/TreeSelect/departmentAuthorityTree";
import TreeSelect from "@/components/TreeSelect";
import { isNull } from "@/util/qsgCommon.js";
import OptOrgCommon from "@/views/optOrg/OptOrgCommon";

export default {
  components: {
    departmentAuthorityTree,
    OptOrgCommon,
    TreeSelect,
  },
  data() {
    return {
      shencha:false,
      form: {},
      isManager: false,
      search: {},
      selectionList: [],
      query: {},
      loading: true,
      page: {
        pageSize: 10,
        currentPage: 1,
        total: 0,
      },
      init: {
        roleTree: [],
        deptTree: [],
      },
      treeDeptId: "0",
      treeDeptName: "部门目录",
      dataMagFormTitle:'',
      dataMagFormTag:false,
      yearMoney:false,
      yearLirun:false,
      yearchuang1:false,
      yearchuang2:false,
      yearchuang3:false,
      yearchuang4:false,
      activities: [{
        content: '23455万',
        timestamp: '2019'
      }, {
        content: '34500万',
        timestamp: '2020'
      }, {
        content: '6000万',
        timestamp: '2021'
      }],
      tableData: [{
        zlnum: 1000,
        kjnum: 2000,
        articlenum: 1518,
        countrynum:300000,
        provicenum:1000,
        othernum:500,
        biaozhun:100,
        hangye:200,
      }],
      option: {
        header: false,
        tip: false,
        searchShow: false,
        border:true,
        align:'center',
        menu:false,
        menuAlign:'center',
        index: true,
        indexLabel:'编号', 
        indexWidth:100,
        selection: false,
        addBtn: false,
        viewBtn: true,
        delBtn: true,
        // editBtn: true,
        searchMenuSpan:4,
        menuWidth: 300,
        column: [
          {
            label: "统一社会信用代码",
            prop: "account",
            width:200,
            row:true,
            labelWidth: 140,
            labelPosition:'left',
          },
          {
            label: "研发投入",
            prop: "account",
            width: 200,
            row:true,
            labelWidth: 80,
            labelPosition:'left',
            type:'textarea',
            minRows:4,
          },
          {
            label: "专利数量",
            prop: "",
            width: 100,
            row:true,
            labelWidth: 80,
            labelPosition:'left',
          },
          {
            label: "年度资产",
            prop: "",
            width:100,
            row:true,
            labelWidth: 80,
            labelPosition:'left',
            formatter: (val ) => {
              val = "详情"
              return val;
            },
          },
          {
            label: "年度利润",
            prop: "",
            width: 100,
            row:true,
            labelWidth: 80,
            labelPosition:'left',
            formatter: (val ) => {
              val = "详情"
              return val;
            },
          },
          {
            label: "奖项",
            prop: "isLock",
            type: "select",
            width: 100,
            row:true,
            labelWidth: 80,
            labelPosition:'left',
          },
          {
            label: "认证",
            prop: "realName",
            width:200,
            row:true,
            labelWidth: 80,
            labelPosition:'left',
          },
          {
            label: "保密等级",
            prop: "realName",
            width:100,
            row:true,
            labelWidth:80,
            labelPosition:'left',
          },
          {
            label: "保密证有效期",
            prop: "realName",
            slot: true,
            width:200,
            row:true,
            labelWidth: 140,
            labelPosition:'left',
          },
          {
            label: "科技创新人员能力",
            prop: "",
            width:200,
            row:true,
            labelWidth: 140,
            labelPosition:'left',
            formatter: (val ) => {
              val = "详情"
              return val;
            },
          },
          {
            label: "科技创新设备能力",
            prop: "",
            width:200,
            row:true,
            labelWidth: 140,
            labelPosition:'left',
            formatter: (val ) => {
              val = "详情"
              return val;
            },
          },
          {
            label: "科技创新投入能力",
            prop: "",
            width:200,
            row:true,
            labelWidth: 140,
            labelPosition:'left',
            formatter: (val ) => {
              val = "详情"
              return val;
            },
          },
          {
            label: "科技创新成果能力",
            prop: "",
            width:200,
            row:true,
            labelWidth: 140,
            labelPosition:'left',
            formatter: (val ) => {
              val = "详情"
              return val;
            },
          },
        ],
        
      },
      data: [],
      treeItemId: "0",
    };
  },
  watch: {},
  computed: {
    ...mapGetters(["permission"]),
    permissionList() {
      return {
        addBtn: this.vaildData(this.permission.projectmanage_add, false),
        viewBtn: this.vaildData(this.permission.projectmanage_view, true),
        delBtn: this.vaildData(this.permission.projectmanage_delete, true),
        editBtn: this.vaildData(this.permission.projectmanage_edit, true)
      };
    },
  },
  mounted() {},
  methods: {
    initData() {
      this.form.deptId = this.treeDeptId;
      this.form.deptName = this.treeDeptName;
    },
    /*导入*/
    handleChange (file, fileLis) {
      this.$Export.xlsx(file.raw)
        .then(data => {
          this.form = data.results;
        })
    },
    /*单元格点击*/
    cellClick(row, column){
      if(column.label == '年度资产'){
        this.dataMagFormTitle = '年度资产'
        this.dataMagFormTag = true
        this.yearMoney = true
      }else if(column.label == '年度利润'){
        this.dataMagFormTitle = '年度利润'
        this.dataMagFormTag = true
        this.yearLirun = true
      }else if(column.label == '科技创新人员能力'){
        this.dataMagFormTitle = '科技创新人员能力'
        this.dataMagFormTag = true
        this.yearchuang1 = true
      }else if(column.label == '科技创新设备能力'){
        this.dataMagFormTitle = '科技创新设备能力'
        this.dataMagFormTag = true
        this.yearchuang2 = true
      }else if(column.label == '科技创新投入能力'){
        this.dataMagFormTitle = '科技创新投入能力'
        this.dataMagFormTag = true
        this.yearchuang3 = true
      }else if(column.label == '科技创新成果能力'){
        this.dataMagFormTitle = '科技创新成果能力'
        this.dataMagFormTag = true
        this.yearchuang4 = true
      }
    },
    /**
     * 
     * 弹窗关闭
     */
    dataMagFormClose() {
      this.dataMagFormTag = false;
      this.yearMoney = false
      this.yearLirun = false
      this.yearchuang1 = false
      this.yearchuang2 = false
      this.yearchuang3 = false
      this.yearchuang4 = false
    },
    rowSave(row, done, loading) {
      row.account = row.account.trim();

      if (!isNull(row.directLeader.user)) {
        row.directLeader = row.directLeader.user[0].account;
      } else {
        row.directLeader = "";
      }
      row.roles = [];
      add(row).then(
        () => {
          // this.initFlag = false;
          this.onLoad(this.page);
          this.$message({
            type: "success",
            message: "操作成功!",
          });
          done();
        },
        (error) => {
          window.console.log(error);
          loading();
        }
      );
    },
    rowUpdate(row, index, done, loading) {
      
      if (!isNull(row.directLeader.user)) {
        row.directLeader = row.directLeader.user[0].account;
      } else {
        row.directLeader = "";
      }

      update(row).then(
        () => {
          // this.initFlag = false;
          this.onLoad(this.page);
          this.$message({
            type: "success",
            message: "操作成功!",
          });
          done();
        },
        (error) => {
          window.console.log(error);
          loading();
        }
      );
    },
    rowDel(row) {
      this.$confirm("确定将选择数据删除?", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          return remove(row.id);
        })
        .then(() => {
          this.onLoad(this.page);
          this.$message({
            type: "success",
            message: "操作成功!",
          });
        });
    },
    
    
    
    searchChange(params, done) {
      this.query = params
      this.page.currentPage = 1;
      this.onLoad(this.page, params);
      done();
    },
    selectionChange(list) {
      this.selectionList = list;
    },
    async beforeOpen(done, type) {
      
      if (["edit", "view"].includes(type)) {
        
      }
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
    onLoad(page, params, treeItemId) {
      if (!treeItemId) {
        treeItemId = this.treeDeptId;
      }
      var obj = {
        ...this.query,
      };
      this.loading = false;
      // getList(this.page.currentPage, this.page.pageSize, obj, treeItemId).then(
      //   (res) => {
      //     const data = res.data.data;
      //     this.page.total = data.total;
      //     this.data = data.records;
      //     this.loading = false;
      //   }
      // );
    },
    handleAdd() {
      this.$refs.crud.rowAdd();
    },
  },
};
</script>

<style lang="scss">
.box {
  height: 800px;
}

.box .el-scrollbar {
  height: 100%;
}

.box .el-scrollbar__wrap {
  overflow: scroll;
}
.showYear{
  display: flex;
  width: 90%;
  overflow: auto;
  margin: 0 auto;
}
.showYearList{
  border: 1px solid #000;
  border-right: none;
  width: 200px;
}
.showYearList:last-child{
  border: 1px solid #000;
}
.year{
  text-align: center;
  height: 50px;
  line-height: 50px;
}
.money{
  border-top: 1px solid #000;
  height: 50px;
  line-height: 50px;
  text-align: center;
}
</style>
