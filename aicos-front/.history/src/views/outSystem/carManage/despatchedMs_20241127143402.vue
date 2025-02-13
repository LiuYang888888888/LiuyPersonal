<template>
  <basic-container>
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

      <template #shiftj="scope">
        <el-tag v-if="scope.row.shiftj == '草稿'" effect="dark" type="info">草稿</el-tag>
        <el-tag v-if="scope.row.shiftj == '审核中'" type="danger">审核中</el-tag>
        <el-tag v-if="scope.row.shiftj == '审核不通过'" effect="dark" type="danger">审核不通过</el-tag>
        <el-tag v-if="scope.row.shiftj == '审核通过'" effect="dark" type="success">审核通过</el-tag>
      </template>

      
      <template v-slot:menu="scope">
        <el-button type="text" size="small" v-if="permissionList.viewBtn" @click="comFormMagView(scope.row)">查看
        </el-button>
        <el-button type="text" size="small" v-if="scope.row.shiftj == '审核通过' && permissionList.paicheBtn && scope.row.paichezt == '待派车'" @click="comFormMagPaiche(scope.row)">派车
        </el-button>
      </template>
    </avue-crud>
  </basic-container>
</template>

<script>
import { mapGetters } from "vuex";
import {
  getListData,
  getListDataKong,
  submitListData
} from "@/api/outSystem/dispatchedMs";
import {
  getListDataCar,
  viewListData
} from "@/api/outSystem/carInfo";
import {
  getInfo,
} from "@/api/outSystem/agency";

const baseUrl = process.env.BASE_URL;
export default {
  data () {
    return {
      newImg: `${baseUrl}img/new.png`,
      loading: false,
      page: {
        pageSize: 10,
        currentPage: 1,
        total: 0,
        pageSizes: [10, 20, 30, 40, 50, 100],
      },
      listForm: {},
      selectionList: [],
      carList:[],
      query: {},
      listData: [],
      listOption: {
        updateBtnText:'确定',
        height: 'auto',
        align: 'center',
        searchShow: true,
        tip: false,
        border: true,
        editBtn: false,
        delBtn: false,
        index: true,
        addBtn: false,
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
            type: 'textarea',
            label: '用车事由',
            span: 16,
            display: true,
            hideLabel: false,
            prop: 'yongcsy',
            isListDisplay: true,
            order: 2,
            readonly:true,
            width:100,
          },
          {
            type: 'input',
            label: '同行人数',
            span: 16,
            display: true,
            hideLabel: false,
            prop: 'tongxrs',
            isListDisplay: true,
            order: 3,
            readonly:true,
            width:100,
          },
          {
            type: 'input',
            label: '用车部门',
            span: 16,
            display: true,
            hideLabel: false,
            prop: 'shenqbm',
            isListDisplay: true,
            order: 6,
            readonly:true,
            width:100,
          },
          {
            type: 'input',
            label: '目的地',
            span: 16,
            display: true,
            hideLabel: false,
            prop: 'mudd',
            isListDisplay: true,
            order: 4,
            readonly:true,
          },
          {
            type: 'input',
            label: '随车负责人',
            span: 16,
            display: true,
            hideLabel: false,
            prop: 'suicfzr',
            isListDisplay: true,
            order: 5,
            readonly:true,
            width:120,
          },
          {
            type: 'datetime',
            label: '用车开始时间',
            span: 16,
            display: true,
            format: 'yyyy-MM-dd HH:mm:ss',
            valueFormat: 'yyyy-MM-dd HH:mm:ss',
            hideLabel: false,
            dataType: 'datetime',
            prop: 'yongckssj',
            isListDisplay: true,
            order: 1,
            readonly:true,
            width:120,
          },
          {
            type: 'datetime',
            label: '用车结束时间',
            span: 16,
            display: true,
            format: 'yyyy-MM-dd HH:mm:ss',
            valueFormat: 'yyyy-MM-dd HH:mm:ss',
            hideLabel: false,
            dataType: 'datetime',
            prop: 'yongcjssj',
            isListDisplay: true,
            order: 1,
            readonly:true,
            width:120,
          },
          {
            type: 'input',
            label: '申请人',
            span: 16,
            display: true,
            hideLabel: false,
            prop: 'shenqr',
            isListDisplay: true,
            order: 6,
            readonly:true,
            search:true,
          },
          {
            type: 'datetime',
            label: '申请时间',
            span: 16,
            display: false,
            format: 'yyyy-MM-dd HH:mm:ss',
            valueFormat: 'yyyy-MM-dd HH:mm:ss',
            hideLabel: false,
            dataType: 'datetime',
            prop: 'create_time',
            isListDisplay: true,
            width:100,
          },
          {
            type: 'select',
            label: '派遣车辆',
            cascaderItem: [],
            span: 16,
            display: true,
            props: {
              label: 'cheph',
              value: 'cheph'
            },
            hideLabel: false,
            prop: 'cheph',
            isListDisplay: true,
            dicQuery: {},
            dicData:[],
            search:true,
            width:100,
            change: ({value}) =>{
              if(value){
                this.carList.forEach(e => {
                  if(e.cheph == value){
                    let param = new URLSearchParams()
                    param.append("id", e.id)
                    viewListData(param).then(res =>{ 
                      this.options.column[10].value = res.data.data;
                    })
                  }
                });
              }
            }
          },
          {
            type: 'input',
            label: '驾驶员',
            span: 16,
            display: false,
            hideLabel: false,
            prop: 'jiasy',
            isListDisplay: true,
            search:true,
            readonly:true,
            value:''
          },
          {
            type: 'input',
            label: '派遣人',
            span: 16,
            display: true,
            hideLabel: false,
            prop: 'paiqr',
            isListDisplay: true,
            search:true,
          },
          {
            label: "流程状态",
            prop: "shiftj",
            display: false,
            width:120,
          },
          {
            type: 'select',
            label: '派车状态',
            cascaderItem: [],
            span: 16,
            display: false,
            props: {
              label: 'name',
              value: 'value'
            },
            hideLabel: false,
            prop: 'paichezt',
            isListDisplay: true,
            dicUrl: '/aicos/api/aicos-system/baseDict/getDictItemListByDictCode',
            dicMethod: 'post',
            dicQuery: {
              code: 'paichezt'
            },
            search:true,
            width:100,
          },
          {
            type: 'datetime',
            label: '派车时间',
            span: 16,
            display: false,
            format: 'yyyy-MM-dd HH:mm:ss',
            valueFormat: 'yyyy-MM-dd HH:mm:ss',
            hideLabel: false,
            dataType: 'datetime',
            prop: 'paicsj',
            isListDisplay: true,
            width:100,
          },
          {
            type: 'datetime',
            label: '还车时间',
            span: 16,
            display: false,
            format: 'yyyy-MM-dd HH:mm:ss',
            valueFormat: 'yyyy-MM-dd HH:mm:ss',
            hideLabel: false,
            dataType: 'datetime',
            prop: 'guihsj',
            isListDisplay: true,
            width:100,
          },
          {
            type: 'datetime',
            label: '创建时间',
            span: 16,
            display: false,
            format: 'yyyy-MM-dd HH:mm:ss',
            valueFormat: 'yyyy-MM-dd HH:mm:ss',
            hideLabel: false,
            dataType: 'datetime',
            prop: 'create_time',
            isListDisplay: true,
            width:100,
          },
          {
            type: 'datetime',
            label: '提交时间',
            span: 16,
            display: false,
            format: 'yyyy-MM-dd HH:mm:ss',
            valueFormat: 'yyyy-MM-dd HH:mm:ss',
            hideLabel: false,
            dataType: 'datetime',
            prop: 'submit_time',
            isListDisplay: true,
            width:100,
          },
          {
            type: 'datetime',
            label: '审核时间',
            span: 16,
            display: false,
            format: 'yyyy-MM-dd HH:mm:ss',
            valueFormat: 'yyyy-MM-dd HH:mm:ss',
            hideLabel: false,
            dataType: 'datetime',
            prop: 'audit_time',
            isListDisplay: true,
            width:100,
          },
        ],
      },
    };
  },
  computed: {
    ...mapGetters(["permission"]),
    permissionList () {
      return {
        viewBtn: this.vaildData(
          this.permission[`outsys-dispatchedMs-view`],
          false
        ),
        paicheBtn: this.vaildData(
          this.permission[`outsys-dispatchedMs-paiche`],
          false
        ),
      };
    },
  },
  async mounted () {
    await this.carListMethod()
  },
  methods: {
    Info () {
      getInfo().then(res => {
        this.userInfo = res.data.data;
        this.listForm.paiqr = this.userInfo.account
      })
    },
    async carListMethod(){
      const dataParam = {
        reqPage: {
          current: 1,
          size: 50,
        },
        searchParam: {},
      };
      const data = await getListDataCar(dataParam);
      this.listOption.column[9].dicData = data.data.data.fieldList
      this.carList = data.data.data.fieldList
    },
    
    async getCarList(){
      const dataParam = {
        reqPage: {
          current: 1,
          size: 100,
        },
        searchParam: {},
      };
      const dataResFun = await getListDataKong(dataParam);
      this.listOption.column[9].dicData = dataResFun.data.data.fieldList
    },
    initData (/*type*/) { },

    refreshChange () {
      this.onLoad(this.page, this.query);
    },
    beforeOpen (done, type) {
      if (["add", "edit", "view"].includes(type)) {
        if(type == 'edit'){
          this.Info()
          this.getCarList()
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
    async onLoad (page /*, params = {}*/) {
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
      this.carListMethod()
      this.carDriverMethod()
    },
    //查看
    async comFormMagView (row, index) {
      this.$refs.listRef.rowView(row, index);
    },
    //派车
    async comFormMagPaiche(row, index){
      this.$refs.listRef.rowEdit(row, index);
    },
    rowUpdate (row, index, done, loading) {
      if(row.yongckssj > row.yongcjssj){
        this.$message({
          type: "error",
          message: "开始时间不能大于结束时间!"
        });
      }else{
        submitListData(row).then(() => {
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
