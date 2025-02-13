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
    
      
      <!-- <template #zhuangt="scope">
        <el-tag v-if="scope.row.zhuangt == '工作中'" effect="dark" type="danger">工作中</el-tag>
        <el-tag v-if="scope.row.zhuangt == '维修中'" effect="dark" type="info">维修中</el-tag>
        <el-tag v-if="scope.row.zhuangt == '空闲中'" effect="dark" type="success">空闲中</el-tag>
      </template> -->

      
      <!-- <template slot-scope="scope" slot="menuLeft">
        <el-button v-if="permissionList.exportExcel" size="small" icon="el-icon-download" type="primary" @click="exportExcel">
          导出
        </el-button>
      </template> -->
        
      <!-- <template v-slot:menu="scope">
        <el-button type="text" size="small" v-if="permissionList.viewBtn" @click="comFormMagView(scope.row)">查看
        </el-button>
        <el-button type="text" size="small" v-if="permissionList.editBtn" @click="comFormMagUpdate(scope.row)">编辑
        </el-button>
        <el-button type="text" size="small" v-if="permissionList.delBtn" @click="comFormMagDel(scope.row)">删除
        </el-button>
      </template> -->
    </avue-crud>

    <el-row :gutter="24">
      <el-col :span="8" v-for="(item, index) in listData" :key="index" style="margin-top: 20px;">
        <el-card :body-style="{ padding: '10px',background:'#f9f9f9'}" shadow="always">
          <div class="cardList">
            <div class="card-img">
              <img :src="'/aicos' + item.cheltp" v-if="item.cheltp"/>
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
              <div class="card-text carditem" v-else>驾驶员：无</div>
              <div class="card-text carditem" v-if="item.lianxfs">联系方式：{{ item.lianxfs }}</div>
              <div class="card-text carditem" v-else>联系方式：无</div>
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
  getListDataCar,
  saveOrUpdateListData,
  delListData,
  viewListData
} from "@/api/outSystem/carInfo";
const baseUrl = process.env.BASE_URL;
export default {
  data () {
    return {
      newImg: `${baseUrl}img/new.png`,
      cheimg: `${baseUrl}img/che.png`,
      dataMagFormTag: false,
      btnLoading: false,
      loading: false,
      page: {
        pageSize: 10,
        currentPage: 1,
        total: 0,
        pageSizes: [10, 20, 30, 40, 50, 100],
      },
      listForm: {
        
      },
      selectionList: [],
      query: {},
      listData: [],
      listOption: {
        columnBtn: false,
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
            type: 'upload',
            label: '车辆图片',
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
            prop: 'cheltp',
            isListDisplay: true,
            search: false,
            data: {
              fromSystemName: 'base'
            },
          },
          {
            type: 'input',
            label: '车牌号',
            span: 16,
            display: true,
            hideLabel: false,
            prop: 'cheph',
            isListDisplay: true,
            search: true,
            required: true,
            rules: [
              {
                required: true,
                message: '车牌号必须填写'
              }
            ],
          },
          {
            type: 'input',
            label: '品牌',
            span: 16,
            display: true,
            hideLabel: false,
            prop: 'pinp',
            isListDisplay: true,
            required: true,
            rules: [
              {
                required: true,
                message: '品牌必须填写'
              }
            ],
            search:true,
          },
          {
            type: 'input',
            label: '型号',
            span: 16,
            display: true,
            hideLabel: false,
            prop: 'xingh',
            isListDisplay: true,
            required: true,
            rules: [
              {
                required: true,
                message: '型号必须填写'
              }
            ],
            search:true,
          },
          {
            type: 'select',
            label: '座位数',
            cascaderItem: [],
            span: 16,
            display: true,
            props: {
              label: 'name',
              value: 'value'
            },
            hideLabel: false,
            prop: 'zuows',
            isListDisplay: true,
            search: true,
            dicQuery: {
              code: 'yongchexinxi'
            },
            dicUrl: '/aicos/api/aicos-system/baseDict/getDictItemListByDictCode',
            dicMethod: 'post',
            required: true,
            rules: [
              {
                required: true,
                message: '座位数必须选择'
              }
            ],
          },
          {
            type: 'select',
            label: '车辆类型',
            cascaderItem: [],
            span: 16,
            display: true,
            props: {
              label: 'name',
              value: 'value'
            },
            hideLabel: false,
            prop: 'chellx',
            isListDisplay: true,
            dicUrl: '/aicos/api/aicos-system/baseDict/getDictItemListByDictCode',
            dicMethod: 'post',
            dicQuery: {
              code: 'cheliangleixing'
            },
            required: true,
            rules: [
              {
                required: true,
                message: '车辆类型必须选择'
              }
            ],
            search:true,
          },
          {
            type: 'input',
            label: '颜色',
            span: 16,
            display: true,
            hideLabel: false,
            prop: 'yans',
            isListDisplay: true,
            required: true,
            rules: [
              {
                required: true,
                message: '颜色必须填写'
              }
            ],
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
              code: 'yongchezt'
            },
            value:'空闲中',
            required: true,
            rules: [
              {
                required: true,
                message: '状态必须选择'
              }
            ],
            disabled:true,
          },
          {
            type: 'input',
            label: '驾驶员',
            span: 16,
            display: false,
            hideLabel: false,
            prop: 'jiasy',
            isListDisplay: true,
          },
          {
            type: 'input',
            label: '联系方式',
            span: 16,
            display: false,
            hideLabel: false,
            prop: 'lianxfs',
            isListDisplay: true,
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
          this.permission[`outsys-carman-add`],
          false
        ),
        viewBtn: this.vaildData(
          this.permission[`outsys-carman-view`],
          false
        ),
        editBtn: this.vaildData(
          this.permission[`outsys-carman-edit`],
          false
        ),
        delBtn: this.vaildData(
          this.permission[`outsys-carman-del`],
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
      getListDataCar(dataParam).then((res) => {
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
      if (row.cheltp.constructor === Array){
        if(row.cheltp.length > 0){
          row.cheltp = row.cheltp[0].value;
        }else{
          row.cheltp = ''
        }
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
      if (row.cheltp.constructor === Array){
        if(row.cheltp.length > 0){
          row.cheltp = row.cheltp[0].value;
        }else{
          row.cheltp = ''
        }
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

.el-input.is-disabled .el-input__inner{
  background: #f7f7f7;
  color: #000;
}
</style>

<style lang="scss" scoped>
/deep/ .avue-crud .el-table{
  display:none !important;
}
/deep/ .avue-crud__pagination{
  display: none !important;
}
.cardList{
  display: flex;
  width: 95%;
  height: 260px;
  border-radius: 15px;
}
.card-img{
  width: 50%;
  height: auto;
  margin: auto;
}
.card-img img{
  width: 100%;
  height: 100%;
  border-radius: 15px;
}
.cardInfo{
  margin-left: 10px;
  margin-top: 5px;
  font-size: 14px;
}
.carditem{
  margin: 5px 0;
}
.cardbottom{
  width: 60%;
  margin: 0 auto;
  display: flex;
  justify-content: space-around;
}
.card-text{
  color: #333;
  font-weight: 600;
}
/deep/ .el-card.is-always-shadow {
  -webkit-box-shadow: 0 2px 12px 0 rgba(0, 0, 0, .3);
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, .3);
  border: 1px solid #000;
}

.right-bottom {
    margin-top: 40px;
    margin-bottom: 20px;
    /deep/ {
      .number {
        border: solid 1px #d7dad3;
        margin: 0 6px;
        border-radius: 4px;
        color: #999;
      }

      .number.active {
        background-color: #af2c30;
        color: #fff;
        border: solid 1px #af2c30;
      }
    }
  }
</style>
