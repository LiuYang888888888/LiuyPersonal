<template>
  <basic-container>
    <!-- <HuilanBasicToolbar style="margin-top: 0;text-align: left;">
      <el-button type="primary" size="small" @click="comFormMagAdd">新增</el-button>
    </HuilanBasicToolbar> -->
    <avue-crud :option="listOption" :table-loading="loading" :data="listData" ref="listRef" v-model="listForm"
      :page.sync="page" :permission="permissionList" :before-open="beforeOpen" :before-close="beforeClose"
      @search-change="searchChange" @search-reset="searchReset" @selection-change="selectionChange"
      @current-change="currentChange" @size-change="sizeChange" @refresh-change="refreshChange" @on-load="onLoad"
      @row-save="rowSave" @row-update="rowUpdate">
      <template slot="denglzh" slot-scope="scope">
        <div class="denglzh">
          <img v-if="scope.row.read_status == 0" :src="newImg" alt="未读消息" style="width: 1.4rem;height: auto;" />
          <span>{{ scope.row.denglzh }}</span>
        </div>
      </template>
      <!-- <template slot-scope="scope" slot="menuLeft">
        <el-button v-if="permissionList.exportExcel" size="small" icon="el-icon-download" type="primary" @click="exportExcel">
          导出
        </el-button>
      </template> -->
      <template v-slot:menu="scope">
        <el-button type="text" size="small" v-if="permissionList.viewBtn" @click="comFormMagView(scope.row)">查看
        </el-button>
        <el-button type="text" size="small" v-if="permissionList.editBtn" @click="comFormMagUpdate(scope.row)">编辑
        </el-button>
        <el-button type="text" size="small" v-if="permissionList.delBtn" @click="comFormMagDel(scope.row)">删除
        </el-button>
      </template>
    </avue-crud>
  </basic-container>
</template>

<script>
import { mapGetters } from "vuex";
import {
  getListData,
  saveOrUpdateListData,
  delListData,
  viewListData,
  getListDataMeet,
  getListDataMeetUse
} from "@/api/outSystem/meetingApply";
import {
  getInfo,
} from "@/api/outSystem/agency";
import {
  getDepartment,
} from "@/api/Political/common";
const baseUrl = process.env.BASE_URL;
export default {
  data () {
    return {
      meetList:[],
      userInfo:{},
      rolename:'',
      newImg: `${baseUrl}img/new.png`,
      dataMagFormTag: false,
      btnLoading: false,
      loading: false,
      page: {
        pageSize: 10,
        currentPage: 1,
        total: 0,
        pageSizes: [10, 20, 30, 40, 50, 100],
      },
      listForm: {},
      selectionList: [],
      query: {},
      listData: [],
      listOption: {
        height: 'auto',
        align: 'center',
        searchShow: true,
        tip: false,
        border: true,
        editBtn: false,
        delBtn: false,
        addBtnText:'申请',
        index: true,
        indexLabel: '序号',
        indexWidth: 100,
        viewBtn: false,
        selection: false,
        labelPosition: 'right',
        labelSuffix: '',
        labelWidth: 120,
        gutter: 0,
        menuPosition: 'center',
        isCustom: false,
        excelBtn: false,
        column: [
          {
            type: 'select',
            label: '会议室名称',
            cascaderItem: [],
            span: 16,
            display: true,
            props: {
              label: 'huiysmc',
              value: 'id'
            },
            hideLabel: false,
            prop: 'shenqhysmc',
            isListDisplay: true,
            search: true,
            dicData: [],
            required: true,
            rules: [
              {
                required: true,
                message: '会议室名称必须选择'
              }
            ],
            searchLabelWidth:120,
            change: ({value}) =>{
              this.meetList.forEach(e => {
                if(e.id == value){
                  this.listForm.huiyssb = e.huiyssb;
                  this.listForm.huiysrs = e.huiysrs;
                  this.listForm.huiyswz = e.huiyswz;
                }
              });
            }
          },
          {
            type: 'input',
            label: '会议室设备',
            span: 16,
            display: true,
            hideLabel: false,
            prop: 'huiyssb',
            isListDisplay: true,
            readonly:true,
          },
          {
            type: 'input',
            label: '会议室人数',
            span: 16,
            display: true,
            hideLabel: false,
            prop: 'huiysrs',
            isListDisplay: true,
            readonly:true,
          },
          {
            type: 'input',
            label: '会议室位置',
            span: 16,
            display: true,
            hideLabel: false,
            prop: 'huiyswz',
            isListDisplay: true,
            readonly:true,
          },
          {
            type: 'datetime',
            label: '会议开始时间',
            span: 16,
            display: true,
            format: 'yyyy-MM-dd HH:mm:ss',
            valueFormat: 'yyyy-MM-dd HH:mm:ss',
            hideLabel: false,
            dataType: 'datetime',
            prop: 'shenqkssj',
            isListDisplay: true,
            required: true,
            rules: [
              {
                required: true,
                message: '会议开始时间必须选择'
              }
            ],
            searchLabelWidth: 30,
          },
          {
            type: 'datetime',
            label: '会议结束时间',
            span: 16,
            display: true,
            format: 'yyyy-MM-dd HH:mm:ss',
            valueFormat: 'yyyy-MM-dd HH:mm:ss',
            hideLabel: false,
            dataType: 'datetime',
            prop: 'shenqjssj',
            isListDisplay: true,
            required: true,
            rules: [
              {
                required: true,
                message: '会议结束时间必须选择'
              }
            ],
          },
          {
            type: 'input',
            label: '申请人',
            span: 16,
            display: true,
            hideLabel: false,
            prop: 'shenqr',
            isListDisplay: true,
            required: true,
            rules: [
              {
                required: true,
                message: '申请人必须填写'
              }
            ],
            search:true,
          },
          {
            type: 'input',
            label: '申请部门',
            span: 16,
            display: true,
            hideLabel: false,
            prop: 'shenqbm',
            isListDisplay: true,
            required: true,
            rules: [
              {
                required: true,
                message: '申请部门必须填写'
              }
            ],
            search:true,
          }
        ],
      },
    };
  },
  computed: {
    ...mapGetters(["permission"]),
    permissionList () {
      return {
        addBtn: this.vaildData(
          this.permission[`outsys-meetapply-add`],
          false
        ),
        viewBtn: this.vaildData(
          this.permission[`outsys-meetapply-view`],
          false
        ),
        editBtn: this.vaildData(
          this.permission[`outsys-meetapply-edit`],
          false
        ),
        delBtn: this.vaildData(
          this.permission[`outsys-meetapply-del`],
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
  async mounted () {
    await this.meet()
  },
  methods: {
    async Info () {
      getInfo().then(res => {
        this.userInfo = res.data.data;
        this.listForm.shenqr = this.userInfo.account
      })
    },
    async roleInfo () {
      const dataResFun = await getDepartment();
      if(dataResFun.data.data){
        this.rolename = dataResFun.data.data.deptName
        this.listForm.shenqbm = this.rolename
      }
    },
    async meet(){
      const dataParam = {
        reqPage: {
          current: 1,
          size: 50,
        },
        searchParam: {},
      };
      const data = await getListDataMeet(dataParam);
      this.listOption.column[0].dicData = data.data.data.fieldList
      this.meetList = data.data.data.fieldList
    },
    initData (/*type*/) { },

    refreshChange () {
      this.onLoad(this.page, this.query);
    },
    beforeOpen (done, type) {
      if (["add", "edit", "view"].includes(type)) {
        if (type == 'add') {
          this.roleInfo()
          this.Info()
        }
        this.initData(type);
      }
      done();
    },
    beforeClose (done /*type*/) {
      this.refreshChange();
      done();
    },
    currentChange (currentPage) {
      this.page.currentPage = currentPage;
    },

    sizeChange (pageSize) {
      this.page.pageSize = pageSize;
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
      this.$refs.listRef.toggleSelection();
    },
    onLoad (page /*, params = {}*/) {
      this.loading = true;
      const dataParam = {
        reqPage: {
          current: page.currentPage,
          size: page.pageSize,
        },
        searchParam: {
          ...this.query,
        },
      };
      getListData(dataParam).then((res) => {
        const dataRes = res.data.data;
        this.page.total = dataRes.rspPage.totalItems;
        this.page.pageSize = dataRes.rspPage.size;
        this.page.currentPage = dataRes.rspPage.current;
        this.listData = dataRes.fieldList;
        this.loading = false;
        this.selectionClear();
      });
    },
    //查看
    async comFormMagView (row, index) {
      let param = new URLSearchParams()
      param.append("id", row.id)
      viewListData(param).then((res) => {
        // this.onLoad(this.page);
      }, error => {
        window.console.log(error);
        this.onLoad(this.page);
      });
      this.$refs.listRef.rowView(row, index);
      this.refreshChange();
    },

    //新增
    // async comFormMagAdd () {
    //   this.$refs.listRef.rowAdd();
    // },

    rowSave (row, done, loading) {
      if(row.shenqkssj && row.shenqjssj && row.shenqhysmc){
        getListDataMeetUse(this.listForm).then(res =>{
          if(res.data.data){
            this.$message({
              type: "warning",
              message: "此会议室在"+res.data.data.shenqkssj + '至' + res.data.data.shenqjssj + '已被占用，请重新选择！'
            });
            loading();
          }else{
            if(row.shenqkssj > row.shenqjssj){
              this.$message({
                type: "error",
                message: "开始时间必须小于结束时间!"
              });
            }else{
              saveOrUpdateListData(row).then(() => {
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
            }
          }
        })
      }else{
        this.$message({
          type: "warning",
          message: "请选择会议室和使用时间!"
        });
      }
    },

    //编辑
    async comFormMagUpdate (row, index) {
      this.$refs.listRef.rowEdit(row, index);
    },

    rowUpdate (row, index, done, loading) {
      if(row.shenqkssj && row.shenqjssj && row.shenqhysmc){
        getListDataMeetUse(this.listForm).then(res =>{
          if(res.data.data){
            this.$message({
              type: "warning",
              message: "此会议室在"+res.data.data.shenqkssj + '至' + res.data.data.shenqjssj + '已被占用，请重新选择！'
            });
            loading();
          }else{
            if(row.shenqkssj > row.shenqjssj){
              this.$message({
                type: "error",
                message: "开始时间必须小于结束时间!"
              });
            }else{
              saveOrUpdateListData(row).then(() => {
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
            }
          }
        })
      }else{
        this.$message({
          type: "warning",
          message: "请选择会议室和使用时间!"
        });
      }
    },

    //删除
    comFormMagDel (row) {
      this.$confirm("确定将选择数据删除?", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          const params = new URLSearchParams();
          params.append("id", row.id);
          return delListData(params);
        })
        .then(() => {
          this.$message({
            type: "success",
            message: "操作成功!",
          });
          this.refreshChange();
        });
    },
  }
};
</script>

<style>
.CMF_MAIN {
  max-width: 1000px;
  margin: 0 auto;
  background-color: #fff;
  border-left: 1px solid #ebeef5;
  border-right: 1px solid #ebeef5;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
}

.CMF_HEAD {
  text-align: center;
  background-color: #409eff;
}

.CMF_HEAD span {
  font-size: 18px;
  line-height: 50px;
  color: #fff;
}

.CMF_BODY {
  padding: 20px 10px 0;
}

.CMF_FOOT {}

.CMF_CUST {}

.dataMagFormClass .dataMagFormBody {
  background-color: #f5f5f5;
  padding: 20px 0 0;
}

.dataMagFormClass .dataMagFormFooter {
  background-color: #fff;
  margin-top: 20px;
}

.formVerifyClass {
  padding: 30px 10px 10px;
  max-width: 1000px;
  margin: 0 auto;
}

.dataMagFormBtns {
  text-align: center;
  padding: 30px 10px 60px;
}

@media print {
  .el-popup-parent--hidden {
    overflow: auto;
  }

  .dataMagFormClass {
    position: static;
  }

  .dataMagFormClass .el-dialog {
    height: auto;
  }
}
</style>

<style lang="scss" scoped></style>
