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
      <template slot="menuLeft">
        <!-- <el-button type="primary"
                   size="small"
                   icon="el-icon-delete"
                   @click="handleDelete">批量删除
        </el-button> -->
      </template>
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
  delListData,
  viewListData,
  getListDataEx,
  getListDataPro,
} from "@/api/outSystem/application";
const baseUrl = process.env.BASE_URL;
export default {
  
  data () {
    var lianxfs = (rule, value, callback) => {
      const regMobile = /^1(3|4|5|6|7|8|9)\d{9}$/
      if (!regMobile.test(value)) {
        callback(new Error('请输入正确的手机号'))
      } else {
        callback()
      }
    }
    return {
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
        addBtn:false,
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
            type: 'select',
            label: '物品名称',
            cascaderItem: [],
            span: 16,
            display: true,
            props: {
              label: 'wupmc',
              value: 'wupmc'
            },
            hideLabel: false,
            prop: 'wupmc',
            isListDisplay: true,
            dicData: [],
            search:true,
            required: true,
            rules: [
              {
                required: true,
                message: '物品必须选择'
              }
            ],
            change: ({value}) =>{
              if(value){
                this.listForm.wupgg = ''
                const params = new URLSearchParams();
                params.append("wupmc", value);
                getListDataPro(params).then(res =>{ 
                  this.listOption.column[1].dicData = res.data.data;
                })
              }
            }
          },
          {
            type: 'select',
            label: '物品规格',
            cascaderItem: [],
            span: 16,
            display: true,
            props: {
              label: 'wupgg',
              value: 'wupgg'
            },
            hideLabel: false,
            prop: 'wupgg',
            isListDisplay: true,
            dicData: [],
            search:false,
            required: true,
            rules: [
              {
                required: true,
                message: '物品规格必须选择'
              }
            ],
            change: ({value}) =>{
              if(value){
                this.listOption.column[1].dicData.forEach( e =>{
                  if(e.wupgg == value){
                    if(e.weibr){
                      this.listForm.weibr = e.weibr
                      this.listForm.weibgs = e.weibgs
                      this.listForm.weibrlxdh = e.weibrlxdh
                      this.listOption.column[2].display = true
                      this.listOption.column[3].display = true
                      this.listOption.column[4].display = true
                    }else{
                      this.listOption.column[2].display = false
                      this.listOption.column[3].display = false
                      this.listOption.column[4].display = false
                    }
                  }
                })
              }
            }
          },
          {
            type: 'input',
            label: '维保公司',
            span: 16,
            display: true,
            hideLabel: false,
            prop: 'weibgs',
            isListDisplay: true,
            required: true,
            rules: [
              {
                required: true,
                message: '维保公司必须填写'
              }
            ],
          },
          {
            type: 'input',
            label: '维保人',
            span: 16,
            display: true,
            hideLabel: false,
            prop: 'weibr',
            isListDisplay: true,
            required: true,
            rules: [
              {
                required: true,
                message: '维保人必须填写'
              }
            ],
          },
          {
            type: 'input',
            label: '联系电话',
            span: 16,
            display: true,
            hideLabel: false,
            prop: 'weibrlxdh',
            isListDisplay: true,
            required: true,
            rules: [
              {
                required: true,
                message: '联系电话必须填写'
              },
              {validator: lianxfs, message: '请输入正确的手机号'}
            ],
            pattern: '/^1(3|4|5|6|7|8|9)\\d{9}$/'
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
          this.permission[`outsys-shouhou-add`],
          false
        ),
        viewBtn: this.vaildData(
          this.permission[`outsys-shouhou-view`],
          false
        ),
        editBtn: this.vaildData(
          this.permission[`outsys-shouhou-edit`],
          false
        ),
        delBtn: this.vaildData(
          this.permission[`outsys-shouhou-del`],
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
  async created () {
    await this.meet()
  },
  methods: {
    async meet(){
      const data = await getListDataEx();
      this.listOption.column[0].dicData = data.data.data
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
      if(this.$route.query.type){
        if(this.$route.query.type == 'add' && this.permissionList.addBtn){
          this.$refs.listRef.rowAdd();
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
        // this.onLoad(this.page);
      }, error => {
        window.console.log(error);
        this.onLoad(this.page);
      });
      this.$refs.listRef.rowView(row, index);
      this.refreshChange();
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
    // handleDelete() {
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
    //       const params = new URLSearchParams();
    //       params.append("ids", this.ids);
    //       return delListData(params);
    //     })
    //     .then(() => {
    //       this.onLoad(this.page);
    //       this.$message({
    //         type: "success",
    //         message: "操作成功!"
    //       });
    //       this.refreshChange();
    //     });
    // },
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
