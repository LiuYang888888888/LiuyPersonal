<template>
  <basic-container>
    <avue-crud :option="listOption" :table-loading="loading" :data="listData" ref="listRef" v-model="listForm"
      :page.sync="page" :permission="permissionList" :before-open="beforeOpen" :before-close="beforeClose"
      @search-change="searchChange" @search-reset="searchReset" @selection-change="selectionChange"
      @current-change="currentChange" @size-change="sizeChange" @refresh-change="refreshChange" @on-load="onLoad"
      @row-save="rowSave" @row-update="rowUpdate">

      <!-- <template slot="menuLeft">
        <el-button v-if="permissionList.addBtn" icon="el-icon-plus" size="small"  type="primary" @click="addRow">申请</el-button>
      </template> -->
      
      <template slot="denglzh" slot-scope="scope">
        <div class="denglzh">
          <img v-if="scope.row.read_status == 0" :src="newImg" alt="未读消息" style="width: 1.4rem;height: auto;" />
          <span>{{ scope.row.denglzh }}</span>
        </div>
      </template>
     
      <template v-slot:menu="scope">
        <el-button type="text" size="small" v-if="permissionList.tzBtn" @click="comFormMagtz(scope.row)">回值详情
        </el-button>
        <el-button type="text" size="small" v-if="permissionList.viewBtn" @click="comFormMagView(scope.row)">查看
        </el-button>
      </template>
    </avue-crud>

    <!--新增弹窗-->
    <HuilanDialog :title="dataMagFormTitle" :fullscreen="false" append-to-body :before-close="dataMagFormClose"
      :visible.sync="dataMagFormTag">
      <el-form :rules="rules" ref="form" :model="form" label-width="120px" class="addform">
        <el-row>
          <el-col :span="24">
            <el-form-item label="会议标题：" prop="huiybt">
              <el-input  placeholder="请输入会议标题" :disabled="disableFlag" v-model="form.huiybt"/>
            </el-form-item>
          </el-col>
        
          <el-col :span="24">
            <el-form-item label="通知内容：" prop="tongznr">
            <el-input
              type="textarea"
              placeholder="请输入通知内容"
              v-model="form.tongznr"
              show-word-limit
              :autosize="{ minRows: 3, maxRows: 6}"
            >
            </el-input>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="参会人员：" prop="tongzry">
              <el-button type="primary" @click="choosePeople">选择</el-button>
            </el-form-item>
            <div style="max-height:200px;overflow: auto;margin: 20px auto;" v-if="lianxdhshow">
              <table align="center" width="60%" class="table xunw_table_form" border="1" style="margin-bottom: 40px;">
                <tr>
                  <td>编号</td>
                  <td>联系电话</td>
                </tr>
                <tr v-for="(item,index) in form.tableList" :key="index">
                  <td>{{index+1}}</td>
                  <td>{{item.lianxdh}}</td>
                </tr>
              </table>
            </div>
          </el-col>
          <el-col :span="24">
            <el-form-item size="large" style="text-align: center;">
              <el-button type="primary" @click="onSubmit">保存</el-button>
              <el-button @click="dataMagFormClose">取消</el-button>
            </el-form-item> 
          </el-col>
        </el-row>
      </el-form>
    </HuilanDialog>

    <!--回值详情-->
    <HuilanDialog :title="huizhiTitle" :fullscreen="false" append-to-body :before-close="huizhiClose"
      :visible.sync="huizhiTag">
      <el-table
      :data="huizhiData"
      style="width: 80%;margin: 0 auto;">
        <el-table-column
          type="index"
          label="序号"
          width="80">
        </el-table-column>
        <el-table-column
          prop="lianxdh"
          label="联系电话"
          width="180">
        </el-table-column>
        <el-table-column
          prop="zt"
          label="状态">
        </el-table-column>
      </el-table>
    </HuilanDialog>
  </basic-container>
</template>

<script>
import { mapGetters } from "vuex";
import Editor from "@/views/outSystem/information/editor"
import {
  getListData,
  viewListData,
} from "@/api/outSystem/notice";
import {
  getInfo,
} from "@/api/outSystem/agency";
import {
  getDepartment,
} from "@/api/Political/common";
const baseUrl = process.env.BASE_URL;
export default {
  components: {
    Editor,
  },
  data () {
    return {
      dataMagFormTitle:'新增',
      dataMagFormTag:false,
      disableFlag:false,
      form: {
        huiybt:'',
        tongznr:'',
        tableList:[]
      },
      rules: {
        huiybt: [
          { required: true, message: "请选择会议标题", trigger: "blur" },
        ],
        tongznr: [
          { required: true, message: "请输入通知内容", trigger: "blur" },
        ],
        tongzry: [
          { required: true, message: "请选择通知人员", trigger: "blur" },
        ],
      },
      lianxdhshow:true,

      huizhiTitle:'回值详情',
      huizhiTag:false,
      huizhiData:[],

      userInfo:{},
      rolename:'',
      newImg: `${baseUrl}img/new.png`,
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
        addBtn:false,
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
            label: '会议标题',
            cascaderItem: [],
            span: 16,
            display: true,
            props: {
              label: 'huiybt',
              value: 'id'
            },
            hideLabel: false,
            prop: 'huiybt',
            isListDisplay: true,
            search: true,
            dicData: [],
            required: true,
            rules: [
              {
                required: true,
                message: '会议标题必须选择'
              }
            ],
            searchLabelWidth:120,
          },
          {
            type: 'textarea',
            label: '通知内容',
            span: 16,
            display: true,
            hideLabel: false,
            prop: 'tongznr',
            isListDisplay: true,
            search: false
          },
          {
            type: 'textarea',
            label: '通知人员',
            span: 16,
            display: false,
            hideLabel: false,
            prop: 'meetingPerson',
            isListDisplay: true,
            search: false,
            hide:true
          },
        ],
      },
    };
  },
  computed: {
    ...mapGetters(["permission"]),
    permissionList () {
      return {
        addBtn: this.vaildData(
          this.permission[`outsys-notice-add`],
          false
        ),
        viewBtn: this.vaildData(
          this.permission[`outsys-notice-view`],
          false
        ),
        editBtn: this.vaildData(
          this.permission[`outsys-notice-edit`],
          false
        ),
        tjBtn: this.vaildData(
          this.permission[`outsys-notice-tijiao`],
          false
        ),
        tzBtn: this.vaildData(
          this.permission[`outsys-notice-tongzhi`],
          false
        ),
        delBtn: this.vaildData(
          this.permission[`outsys-notice-del`],
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
    
  },
  methods: {
    async Info () {
      getInfo().then(res => {
        this.userInfo = res.data.data;
        this.form.shenqr = this.userInfo.account
      })
    },
    async roleInfo () {
      const dataResFun = await getDepartment();
      if(dataResFun.data.data){
        this.rolename = dataResFun.data.data.deptName
        this.form.shenqbm = this.rolename
      }
    },
    //回值详情
    comFormMagtz(){

    },
    initData (/*type*/) { },

    refreshChange () {
      this.onLoad(this.page, this.query);
    },
    beforeOpen (done, type) {
      if (["add", "edit", "view"].includes(type)) {
        // if (type == 'add') {
        //   this.roleInfo()
        //   this.Info()
        // }
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
      if(this.$route.query.type){
        if(this.$route.query.type == 'add' && this.permissionList.addBtn){
          this.$refs.listRef.rowAdd()
          delete this.$route.query.type
        }
      }
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
    async comFormMagView (row) {
      
    },
    //新增
    addRow(){
      this.dataMagFormTag = true
      this.roleInfo()
      this.Info()
    },
    onSubmit() {
      this.$refs.form.validate((valid) => {
        if (valid) {
          console.log(this.form);
        }
      })
    },
    //关闭弹窗
    dataMagFormClose () {
      this.dataMagFormTag = false;
      this.$refs['form'].resetFields();
    },
    //关闭回值详情
    huizhiClose(){
      this.huizhiTag = false
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
</style>

<style lang="scss" scoped>

/deep/ .addform .el-input{
  width:60% !important;
}
</style>
