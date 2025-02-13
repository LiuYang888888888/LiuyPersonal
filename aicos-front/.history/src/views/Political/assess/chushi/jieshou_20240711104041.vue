<template>
  <basic-container>
    <avue-crud :option="option" :table-loading="loading" :data="data" :page="page" :permission="permissionList"
      :before-open="beforeOpen" v-model="form" ref="crud" @row-update="rowUpdate" @row-save="rowSave" @row-del="rowDel"
      @search-change="searchChange" @search-reset="searchReset" @selection-change="selectionChange"
      @current-change="currentChange" @size-change="sizeChange" @on-load="onLoad">
      <template v-slot:menu="scope">
        <el-button type="text" size="small" @click="comFormMagDetail(scope.row)">详情
        </el-button>
      </template>
    </avue-crud>
    <!--考勤表单下发新增-->
    <HuilanDialog
      :title="jieshouTitle"
      :fullscreen="false"
      :center = "true"
      width="90%"
      append-to-body
      :visible.sync="jieshouShow"
    >
      <div class="tztitle">产业融合发展办：</div>
      <div class="tztop">根据我办公务员平时考核方案，{{jidu}}你处“好”等次人数如下：</div>
      <el-table
        :data="tableData"
        height="300"
        border
        style="width: 60%;margin: 0 auto;">
        <el-table-column
          align="center"
          label="处室名称"
          width="180">
          <template slot-scope="{ row }">
            <span>{{ row.chushi }}</span>
          </template>
        </el-table-column>

        <el-table-column
          align="center"
          label="月份"
          >
          <template slot-scope="{ row }">
            <span >{{ row.month }}</span>
          </template>
        </el-table-column>

        <el-table-column
          align="center" 
          label="考核人数"
         >
          <template slot-scope="{ row }">
            <span >{{ row.khnum }}</span>
          </template>
        </el-table-column>

        <el-table-column
          align="center" 
          label='“好”人数'
         >
          <template slot-scope="{ row }">
            <span >{{ row.goodnum }}</span>
          </template>
        </el-table-column>

        <el-table-column
          v-show="!kqdis"
          align="center"
          width="200"
          label="备注">
          <template slot-scope="{ row }">
            <span >{{ row.beizhu }}</span>
          </template>
        </el-table-column>
      </el-table>
      <div class="tzfinal">请与2024年4月12日前将个人《公务员平时考核登记表》及处室《公务员平时考核结果汇总表》交至政治部。</div>
      <div class="tzjob">政治部</div>
      <div class="tzdate">2024年4月9日</div>

      <div class="footer">
        <el-button plain @click="closekq">关闭</el-button>
      </div>
    </HuilanDialog>
  </basic-container>
</template>

<script>
import { mapGetters } from "vuex";
import {
  getDepartment,
  getJieshou,
  getJieshouDetail
} from "@/api/Political/common";
export default {
  data () {
    return {
      deptId:'',
      jieshouTitle:'通知',
      jieshouShow:false,
      tableData:[{chushi:'秘书处',month:'1月',khnum:'4',goodnum:'2',beizhu:'测试'}],

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
        indexLabel:'序号',
        indexWidth:100,
        addBtn:false,
        editBtn:false,
        delBtn:false,
        viewBtn: false,
        selection: false,
        column: [
          {
            label: "标题",
            prop: "fabbt",
            display:true,
          },
          {
            label: "发布时间",
            prop: "date",
            display:true,
          },
          {
            label: "发布部门",
            prop: "dept_name",
            display:true,
          },
          {
            label: "发布状态",
            prop: "zt",
            display:true,
          },
          {
            label: "发布人",
            prop: "name",
            display:true,
          },
        ]
      },
      data: []
    };
  },
  mounted(){
    
  },
  computed: {
    ...mapGetters(["permission"]),
    permissionList () {
      return {
        jieshouBtn: this.vaildData(
          this.permission[`sys-commonForm-dataMag-jieshou`],
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
      getJieshouDetail({chusdm:row.deptid,guanlzbid:row.id}).then(res =>{
        if(res.data.code == 200){
          this.jieshouShow = true
          console.log(res.data.data)
        }else{
          this.$message({
            type: "error",
            message: res.msg
          });
        }
      })
    },
    closekq(){
      this.jieshouShow = false
    },
    // rowSave (row, done, loading) {
    //   add(row).then(() => {
    //     done();
    //     this.onLoad(this.page);
    //     this.$message({
    //       type: "success",
    //       message: "操作成功!"
    //     });
    //   }, error => {
    //     window.console.log(error);
    //     loading();
    //   });
    // },
    // rowUpdate (row, index, done, loading) {
    //   update(row).then(() => {
    //     done();
    //     this.onLoad(this.page);
    //     this.$message({
    //       type: "success",
    //       message: "操作成功!"
    //     });
    //   }, error => {
    //     window.console.log(error);
    //     loading();
    //   });
    // },
    // rowDel (row) {
    //   this.$confirm("确定将选择数据删除?", {
    //     confirmButtonText: "确定",
    //     cancelButtonText: "取消",
    //     type: "warning"
    //   })
    //     .then(() => {
    //       return remove(row.id);
    //     })
    //     .then(() => {
    //       this.onLoad(this.page);
    //       this.$message({
    //         type: "success",
    //         message: "操作成功!"
    //       });
    //     });
    // },
    // handleDelete () {
    //   if (this.selectionList.length === 0) {
    //     this.$message.warning("请选择至少一条数据");
    //     return;
    //   }
    //   this.$confirm("确定将选择数据删除?", {
    //     confirmButtonText: "确定",
    //     cancelButtonText: "取消",
    //     type: "warning"
    //   })
    //     .then(() => {
    //       return remove(this.ids);
    //     })
    //     .then(() => {
    //       this.onLoad(this.page);
    //       this.$message({
    //         type: "success",
    //         message: "操作成功!"
    //       });
    //       this.$refs.crud.toggleSelection();
    //     });
    // },
    // beforeOpen (done, type) {
    //   if (["edit", "view"].includes(type)) {
        
    //   }
    //   done();
    // },
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
    async onLoad (page) {
      this.loading = false;
      getDepartment().then(res=>{
        if(res.data.code == 200){
          const dataParam = {
            current: page.currentPage,
            size: page.pageSize,
            deptId:res.data.data.id
          };
          getJieshou(dataParam).then(res => {
            const data = res.data.data;
            this.page.total = data.total;
            this.data = data.records;
            this.loading = false;
            this.selectionClear();
          });
        }
      })
    }
  }
};
</script>

<style>
.tztitle{
  width: 60%;
  margin: 0 auto;
  font-size: 18px;
  font-weight: 600;
}
.tztop{
  width: 60%;
  text-indent: 2em;
  margin: 20px auto;
  font-size: 16px;
}
.tzfinal{
  width: 60%;
  text-indent: 2em;
  margin: 20px auto 40px;
  font-size: 16px;
}
.tzjob{
  width: 60%;
  margin: 20px auto;
  text-align: right;
  font-size: 16px;
  font-weight: 600;
}
.tzdate{
  width: 60%;
  margin: 0 auto 20px;
  text-align: right;
  font-size: 16px;
  font-weight: 600;
}
/deep/ .avue-crud__dialog__header{
  text-align: center;
}
</style>
