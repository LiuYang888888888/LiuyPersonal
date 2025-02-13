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

      <template #zhuangt="scope">
        <el-tag v-if="scope.row.zhuangt == '工作中'" effect="dark" type="danger">工作中</el-tag>
        <el-tag v-if="scope.row.zhuangt == '空闲中'" effect="dark" type="success">空闲中</el-tag>
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

    <el-row :gutter="24">
      <el-col :span="8" v-for="(item, index) in listData" :key="index" style="margin-top: 20px;">
        <el-card :body-style="{ padding: '10px',background:'#fff'}" shadow="always">
          <div class="cardList">
            <div class="card-img">
              <img :src="item.jiasyzp" v-if="item.jiasyzp"/>
              <img :src="cheimg" v-else/>
            </div>

            <div class="cardInfo">
              <div class="card-text carditem">车牌号：{{ item.cheph }}</div>
              <div class="card-text carditem">品牌：{{ item.pinp }}</div>
              <div class="card-text carditem">型号：{{ item.xingh }}</div>
              <div class="card-text carditem">座位数：{{ item.zuows }}座</div>
              <div class="card-text carditem">车辆类型：{{ item.chellx }}</div>
              <div class="card-text carditem">颜色：{{ item.yans }}</div>
              <div class="card-text carditem">状态：
                <el-tag v-if="item.zhuangt == '工作中'" effect="dark" type="danger">工作中</el-tag>
                <el-tag v-if="item.zhuangt == '维修中'" effect="dark" type="info">维修中</el-tag>
                <el-tag v-if="item.zhuangt == '空闲中'" effect="dark" type="success">空闲中</el-tag>
              </div>
              <div class="card-text carditem" v-if="item.jiasy">驾驶员：{{ item.jiasy }}</div>
              <div class="card-text carditem" v-else>驾驶员：暂无</div>
              <div class="card-text carditem" v-if="item.lianxfs">联系方式：{{ item.lianxfs }}</div>
              <div class="card-text carditem" v-else>联系方式：暂无</div>
            </div>
          </div>
          <div class="cardbottom">
            <el-button type="text" class="button" v-if="permissionList.viewBtn" @click="comFormMagView(item)">查看</el-button>
            <el-button type="text" class="button" v-if="permissionList.editBtn" @click="comFormMagUpdate(item)">编辑</el-button>
            <el-button type="text" class="button" v-if="permissionList.delBtn" @click="comFormMagDel(item)">删除</el-button>
          </div>
        </el-card>
      </el-col>
    </el-row>

    <div class="right-bottom">
      <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" align="center"
                      :current-page="page.currentPage" :page-sizes="page.pageSizes" :page-size="page.pageSize" prev-text="上一页"
                      next-text="下一页"
                      layout="total, sizes, prev, pager, next, jumper" :total="page.total">
      </el-pagination>
    </div>
  </basic-container>
</template>

<script>
import { mapGetters } from "vuex";
import {
  getListDriver,
  saveOrUpdateListData,
  delListData,
  viewListData
} from "@/api/outSystem/driver";
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

    var shuzi = (rule, value, callback) => {
      if (!Number.isInteger(parseInt(value))) {
        callback(new Error('请输入数字'));
      }else{
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
            label: '姓名',
            span: 16,
            display: true,
            hideLabel: false,
            prop: 'xingm',
            isListDisplay: true,
            search: true,
            required: true,
            rules: [
              {
                required: true,
                message: '姓名必须填写'
              }
            ],
          },
          {
            type: 'upload',
            label: '驾驶员照片',
            span: 16,
            display: true,
            showFileList: true,
            multiple: false,
            limit: 1,
            action: '/aicos/api/aicos-file/miniofile/upload',
            propsHttp: {
              home: '/aicos',
              url: 'newFileName',
              name: 'oldFileName',
              res: 'data',
              fileName: 'file'
            },
            accept: 'image/png, image/jpeg',
            fileSize: 10000,
            tip: '只能上传jpg/png，且不超过10M',
            canvasOption: {},
            hideLabel: false,
            prop: 'jiasyzp',
            isListDisplay: true,
            search: false,
            data: {
              fromSystemName: 'base'
            }
          },
          {
            type: 'input',
            label: '驾龄',
            span: 16,
            display: true,
            hideLabel: false,
            prop: 'jial',
            isListDisplay: true,
            required: true,
            rules: [
              {
                required: true,
                validator: shuzi,
                message: '驾龄必须为整数',
                trigger: 'blur'
              },
            ],
          },
          {
            type: 'input',
            label: '联系电话',
            span: 16,
            display: true,
            hideLabel: false,
            prop: 'lianxdh',
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
          },
          {
            type: 'select',
            label: '状态',
            cascaderItem: [],
            span: 16,
            display: true,
            props: {
              label: 'name',
              value: 'value'
            },
            hideLabel: false,
            prop: 'zhuangt',
            isListDisplay: true,
            search: true,
            dicUrl: '/aicos/api/aicos-system/baseDict/getDictItemListByDictCode',
            dicMethod: 'post',
            dicQuery: {
              code: 'jiashiyuanzt'
            },
            value:'空闲中',
            required: true,
            rules: [
              {
                required: true,
                message: '状态必须选择',
              },
            ],
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
          this.permission[`outsys-driver-add`],
          false
        ),
        viewBtn: this.vaildData(
          this.permission[`outsys-driver-view`],
          false
        ),
        editBtn: this.vaildData(
          this.permission[`outsys-driver-edit`],
          false
        ),
        delBtn: this.vaildData(
          this.permission[`outsys-driver-del`],
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
  created () {

  },
  methods: {
    handleSizeChange(pageSize) {
      this.page.pageSize = pageSize;
      this.onLoad(this.page);
    },
    handleCurrentChange(currentPage) {
      this.page.currentPage = currentPage;
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
      getListDriver(dataParam).then((res) => {
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
      if (row.jiasyzp.constructor === Array){
        row.jiasyzp = row.jiasyzp[0].value;
      }
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
    },

    //编辑
    async comFormMagUpdate (row, index) {
      this.$refs.listRef.rowEdit(row, index);
    },

    rowUpdate (row, index, done, loading) {
      if (row.jiasyzp.constructor === Array){
        row.jiasyzp = row.jiasyzp[0].value;
      }
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

<style lang="scss" scoped>
/deep/ .avue-crud .el-table{
  display:none !important;
}
/deep/ .avue-crud__pagination{
  display: none !important;
}

</style>
