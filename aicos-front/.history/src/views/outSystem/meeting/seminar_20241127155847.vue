<template>
  <basic-container>
    <avue-crud :option="listOption" :table-loading="loading" :data="listData" ref="listRef" v-model="listForm"
      :page.sync="page" :permission="permissionList" :before-open="beforeOpen" :before-close="beforeClose"
      @search-change="searchChange" @search-reset="searchReset" @selection-change="selectionChange"
      @current-change="currentChange" @size-change="sizeChange" @refresh-change="refreshChange" @on-load="onLoad"
      @row-save="rowSave" @row-update="rowUpdate">

      <template slot="menuLeft">
        <el-button v-if="permissionList.addBtn" icon="el-icon-plus" size="small"  type="primary" @click="addRow">申请</el-button>
      </template>
      
      <template slot="denglzh" slot-scope="scope">
        <div class="denglzh">
          <img v-if="scope.row.read_status == 0" :src="newImg" alt="未读消息" style="width: 1.4rem;height: auto;" />
          <span>{{ scope.row.denglzh }}</span>
        </div>
      </template>
     
      <template v-slot:menu="scope">
        <el-button type="text" size="small" v-if="permissionList.viewBtn" @click="comFormMagView(scope.row)">查看
        </el-button>
        <el-button type="text" size="small" v-if="permissionList.editBtn && (scope.row.zhuangt == 1 || scope.row.zhuangt == 3)" @click="comFormMagUpdate(scope.row)">编辑
        </el-button>
        <el-button type="text" size="small" v-if="permissionList.tjBtn && (scope.row.zhuangt == 1 || scope.row.zhuangt == 3)" @click="comFormMagtj(scope.row)">提交
        </el-button>
        <el-button type="text" size="small" v-if="permissionList.tzBtn && scope.row.zhuangt == 4" @click="comFormMagtz(scope.row)">通知
        </el-button>
        <el-button type="text" size="small" v-if="permissionList.delBtn && (scope.row.zhuangt == 1 || scope.row.zhuangt == 3)" @click="comFormMagDel(scope.row)">删除
        </el-button>
      </template>
    </avue-crud>

    <!--新增弹窗-->
    <HuilanDialog :title="dataMagFormTitle" :fullscreen="false" append-to-body :before-close="dataMagFormClose"
      :visible.sync="dataMagFormTag">
      <el-form :rules="rules" ref="form" :model="form" label-width="120px" class="addform">
        <el-row>
          <el-col :span="24">
            <el-form-item label="会议标题：" prop="shenqhysmc">
              <el-input  placeholder="请输入会议标题" :disabled="disableFlag" v-model="form.shenqhysmc"/>
            </el-form-item>
          </el-col>
        
          <el-col :span="24">
            <el-form-item label="会议内容：" prop="huiynr">
              <Editor :value="form.huiynr" :disabled="disableFlag" @input="getContentnr"></Editor>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="会议要求：" prop="huiyyq">
              <Editor :value="form.huiyyq" :disabled="disableFlag" @input="getContentyq"></Editor>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="参会人数：" prop="canhrs">
              <el-input  placeholder="请输入参会人数" :disabled="disableFlag" v-model="form.canhrs"/>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="会议开始时间：" prop="shenqkssj">
              <el-date-picker
                v-model="form.shenqkssj"
                :disabled="disableFlag"
                type="datetime"
                placeholder="选择日期时间"
                value-format="yyyy-MM-dd HH:mm:ss"
                format="yyyy-MM-dd HH:mm:ss"
              />
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="会议结束时间：" prop="shenqjssj">
              <el-date-picker
                v-model="form.shenqjssj"
                :disabled="disableFlag"
                type="datetime"
                placeholder="选择日期时间"
                value-format="yyyy-MM-dd HH:mm:ss"
                format="yyyy-MM-dd HH:mm:ss"
              />
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="申请人：" prop="shenqr">
              <el-input  placeholder="请输入申请人"  v-model="form.shenqr" :disabled="disableFlag"/>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="申请部门：" prop="shenqbm">
              <el-input  placeholder="请输入申请部门" v-model="form.shenqbm" :disabled="disableFlag"/>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item size="large" style="text-align: center;">
              <el-button type="primary" @click="onSubmit" :loading="btnLoading">保存</el-button>
              <el-button @click="dataMagFormClose">取消</el-button>
            </el-form-item> 
          </el-col>
        </el-row>
      </el-form>
    </HuilanDialog>
  </basic-container>
</template>

<script>
import { mapGetters } from "vuex";
import Editor from "@/views/outSystem/information/editor"
import {
  getListData,
  saveOrUpdateListData,
  delListData,
  viewListData,
  submitListData
} from "@/api/outSystem/seminar";
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
        shenqhysmc:'',
        huiynr:'',
        huiyyq:'',
        canhrs:'',
        shenqkssj:'',
        shenqjssj:'',
        shenqr:'',
        shenqbm:'',
      },
      rules: {
        shenqhysmc: [
          { required: true, message: "请输入会议标题", trigger: "blur" },
        ],
        huiyyq: [
          { required: true, message: "请输入会议内容", trigger: "blur" },
        ],
        huiynr: [
          { required: true, message: "请输入会议要求", trigger: "blur" },
        ],
        canhrs: [
          { required: true, message: "请输入参会人数", trigger: "blur" },
        ],
        shenqkssj: [
          { required: true, message: "请输入会议开始时间", trigger: "blur" },
        ],
        shenqjssj: [
          { required: true, message: "请输入会议结束时间", trigger: "blur" },
        ],
        shenqr: [
          { required: true, message: "请输入申请人", trigger: "blur" },
        ],
        shenqbm: [
          { required: true, message: "请输入申请部门", trigger: "blur" },
        ],
      },
      
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
            type: 'input',
            label: '会议标题',
            span: 16,
            display: true,
            hideLabel: false,
            prop: 'shenqhysmc',
            isListDisplay: true,
            search: true
          },
          {
            type: 'textarea',
            label: '会议内容',
            span: 16,
            display: true,
            hideLabel: false,
            prop: 'huiynr',
            isListDisplay: true,
            search: false
          },
          {
            type: 'textarea',
            label: '会议要求',
            span: 16,
            display: true,
            hideLabel: false,
            prop: 'huiyyq',
            isListDisplay: true,
            search: false
          },
          {
            type: 'input',
            label: '参会人数',
            span: 16,
            display: true,
            hideLabel: false,
            prop: 'canhrs',
            isListDisplay: true,
            search: false
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
            searchRange: true,
            searchSpan:10,
            search:true,
            searchLabelWidth: 100,
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
          this.permission[`outsys-seminar-add`],
          false
        ),
        viewBtn: this.vaildData(
          this.permission[`outsys-seminar-view`],
          false
        ),
        editBtn: this.vaildData(
          this.permission[`outsys-seminar-edit`],
          false
        ),
        tjBtn: this.vaildData(
          this.permission[`outsys-seminar-tijiao`],
          false
        ),
        tzBtn: this.vaildData(
          this.permission[`outsys-seminar-tongzhi`],
          false
        ),
        delBtn: this.vaildData(
          this.permission[`outsys-seminar-del`],
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
    async comFormMagView (row, index) {
      let param = new URLSearchParams()
      param.append("id", row.id)
      viewListData(param).then((res) => {
        this.dataMagFormTag = true
        this.form.shenqhysmc = res.data.data.shenqhysmc
        this.form.huiynr = res.data.data.huiynr
        this.form.huiyyq = res.data.data.huiyyq
        this.form.canhrs = res.data.data.canhrs
        this.form.shenqkssj = res.data.data.shenqkssj
        this.form.shenqjssj = res.data.data.shenqjssj
        this.form.shenqr = res.data.data.shenqr
        this.form.shenqbm = res.data.data.shenqbm
        this.form.id = row.id
      }, error => {
        window.console.log(error);
      });
    },
    //新增
    addRow(){
      this.dataMagFormTag = true
      this.roleInfo()
      this.Info()
    },
    //获取getContent
    getContentnr(data) {
      this.form.huiynr = data;
    },
    getContentyq(data) {
      this.form.huiyyq = data;
    },
    //增加
    onSubmit() {
      this.$refs.form.validate((valid) => {
        if (valid) {
          this.btnLoading = true
          saveOrUpdateListData(this.form).then(() => {
            this.dataMagFormClose()
            this.onLoad(this.page);
            this.$message({
              type: "success",
              message: "操作成功!"
            });
            this.btnLoading = false
          }, error => {
            window.console.log(error);
          });
        }
      })
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
    //编辑
    comFormMagUpdate(row){
      let param = new URLSearchParams()
      param.append("id", row.id)
      viewListData(param).then((res) => {
        this.dataMagFormTag = true
        this.form.shenqhysmc = res.data.data.shenqhysmc
        this.form.huiynr = res.data.data.huiynr
        this.form.huiyyq = res.data.data.huiyyq
        this.form.canhrs = res.data.data.canhrs
        this.form.shenqkssj = res.data.data.shenqkssj
        this.form.shenqjssj = res.data.data.shenqjssj
        this.form.shenqr = res.data.data.shenqr
        this.form.shenqbm = res.data.data.shenqbm
        this.form.id = row.id
      }, error => {
        window.console.log(error);
      });
    },
    //关闭弹窗
    dataMagFormClose () {
      this.dataMagFormTag = false;
      this.$refs['form'].resetFields();
    },
    //提交
    comFormMagtj(row){
      this.$confirm("确认提交?", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          return submitListData({formDataId:row.id})
        })
        .then(() => {
          this.onLoad(this.page);
          this.$message({
            type: "success",
            message: "操作成功!"
          });
        }, error => {
          window.console.log(error);
        })
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
