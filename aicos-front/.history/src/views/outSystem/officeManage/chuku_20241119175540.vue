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

      <template #shifck="scope">
        <el-tag v-if="scope.row.shifck == 0 " effect="dark" type="info">未出库</el-tag>
        <el-tag v-if="scope.row.shifck == 1" effect="dark" type="success">已出库</el-tag>
      </template>
      
      <template slot="menuLeft">
        <!-- <el-button v-if="permissionList.exportExcel" size="small" icon="el-icon-download" type="primary" @click="exportExcel">
          导出
        </el-button> -->
        <el-button type="primary" size="small" icon="el-icon-plus" v-if="permissionList.addBtn" @click="handleAdd">申请</el-button>
        <el-button size="small" type="primary" @click="print">打印</el-button>
      </template>
      <template v-slot:menu="scope">
        <el-button type="text" size="small" v-if="permissionList.viewBtn" @click="comFormMagView(scope.row)">查看
        </el-button>
        <el-button type="text" size="small"
          v-if="permissionList.chukuBtn && scope.row.shifck == 0"
          @click="comFormMagOut(scope.row)">出库
        </el-button>
      </template>
    </avue-crud>

    <!--详情弹窗-->
    <HuilanDialog :title="appTitle" :fullscreen="false" append-to-body :before-close="appClose"
      :visible.sync="appTag" class="dataMagFormClass">
      
      <avue-form id="dataMagFormViewAdd" ref="dataMagFormRefAdd" v-model="form" :option="options" v-if="showform">
      </avue-form>
      <div style="max-height: 300px;overflow: auto;margin: 20px auto;">
        <table align="center" width="100%" class="table xunw_table_form" border="1">
          <tr>
            <td>编号</td>
            <td>物品名称</td>
            <td>物品规格</td>
            <td>物品数量</td>
            <td>单价</td>
            <td>总价</td>
          </tr>
          <tr v-for="(item,index) in wupinList" :key="index">
            <td>{{index+1}}</td>
            <td>{{item.wupmc}}</td>
            <td>{{item.wupgg}}</td>
            <td>{{item.shul}}</td>
            <td>{{item.danj}}</td>
            <td>{{item.zongj}}</td>
          </tr>
        </table>
      </div>

      <div class="dataMagFormBtns">
        <el-button size="small" icon="el-icon-circle-close" @click="appClose">取 消</el-button>
      </div>
    </HuilanDialog>


  </basic-container>
</template>

<script>
import { mapGetters } from "vuex";
import {
  getListData,
  viewListData,
  chukuListData
} from "@/api/outSystem/chuku";
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
      btnLoading: false,
      userInfo: {},
      rolename: '',

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
      query: {},
      listData: [],
      listOption: {
        height: 'auto',
        align: 'center',
        searchShow: true,
        tip: false,
        border: true,
        addBtn:false,
        editBtn: false,
        delBtn: false,
        printBtn:false,
        index: true,
        addBtnText: '申请',
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
            type: 'input',
            label: '申请编号',
            span: 16,
            display: true,
            hideLabel: false,
            prop: 'shenqbh',
            isListDisplay: true,
          },
          {
            type: 'input',
            label: '申请处室',
            span: 16,
            display: true,
            hideLabel: false,
            prop: 'shenqcs',
            isListDisplay: true,
            search:true,
          },
          {
            type: 'input',
            label: '申请人',
            span: 16,
            display: true,
            hideLabel: false,
            prop: 'shenqr',
            isListDisplay: true,
            search:true,
          },
          {
            type: 'input',
            label: '申请时间',
            span: 16,
            display: true,
            hideLabel: false,
            prop: 'create_time',
            isListDisplay: true,
          },
          {
            type: 'datetime',
            label: '出库时间',
            span: 16,
            display: true,
            format: 'yyyy-MM-dd HH:mm:ss',
            valueFormat: 'yyyy-MM-dd HH:mm:ss',
            hideLabel: false,
            dataType: 'datetime',
            prop: 'chuksj',
            isListDisplay: true,
          },
          {
            type: 'select',
            label: '状态',
            cascaderItem: [],
            span: 16,
            display: true,
            hideLabel: false,
            props: {
              label: 'name',
              value: 'value'
            },
            dicUrl: '/aicos/api/aicos-system/baseDict/getDictItemListByDictCode',
            dicMethod: 'post',
            dicQuery: {
              code: 'mscchuku'
            },
            prop: 'shifck',
            isListDisplay: true,
            search:true,
          }
        ],
      },
      
      editId:'',
      appTitle:'详情',
      appTag:false,
      showform:false,
      showSure:true,
      wupinList:[],
      form: {},
      options: {
        submitBtn: false,
        emptyBtn: false,
        height: 'auto',
        align: 'center',
        searchShow: true,
        tip: false,
        border: true,
        editBtn: false,
        delBtn: false,
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
            type: 'input',
            label: '申请处室',
            span: 16,
            display: true,
            hideLabel: false,
            prop: 'shenqcs',
            isListDisplay: true,
          },
          {
            type: 'input',
            label: '申请人',
            span: 16,
            display: true,
            hideLabel: false,
            prop: 'shenqr',
            isListDisplay: true,
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
          this.permission[`outsys-chuku-view`],
          false
        ),
        chukuBtn:this.vaildData(
          this.permission[`outsys-chuku-out`],
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
    await this.roleInfo()
    await this.Info()
    this.$refs.listRef.style.display = "none";
    this.$nextTick(() => {
      this.$refs.listRef.style.display = "block";
    });
  },
  methods: {
    print(){
      
    },
    async Info () {
      getInfo().then(res => {
        this.userInfo = res.data.data;
      })
    },
    async roleInfo () {
      const dataResFun = await getDepartment();
      this.rolename = dataResFun.data.data.deptName
    },
    tabChange () {
      this.query = {};
      this.page.currentPage = 1;
      this.onLoad(this.page);
    },
    initData (/*type*/) { },

    refreshChange () {
      this.onLoad(this.page, this.query);
    },
    beforeOpen (done, type) {
      if (["add", "edit", "view"].includes(type)) {
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
    appClose(){
      this.appTag = false
      this.showform = false
      this.wupinList = []
    },
    //查看
    async comFormMagView (row) {
      this.appTag = true
      this.showform = true
      this.showAdd = false
      this.showSure = false
      let param = new URLSearchParams()
      param.append("id", row.id)
      viewListData(param).then((res) => {
        this.form.shenqr = res.data.data.shenqr
        this.form.shenqcs = res.data.data.shenqcs
        this.wupinList = res.data.data.godDetailApplicationList
      }, error => {
        window.console.log(error);
        this.onLoad(this.page);
      });
      
    },
    //出库
    comFormMagOut(row){
      this.$confirm("确定出库?", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          let param = new URLSearchParams()
          param.append("id", row.id)
          return chukuListData(param);
        })
        .then(() => {
          this.$message({
            type: "success",
            message: "操作成功!",
          });
          this.refreshChange();
        });
    }
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
.table tr {
  height: 40px;
}

.table tr td {
  line-height: 40px;
  text-align: center;
}
</style>

<style lang="scss" scoped></style>
