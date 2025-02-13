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

    <el-row :gutter="24">
      <el-col :span="8" v-for="(item, index) in listData" :key="index" style="margin-top: 20px;">
        <el-card :body-style="{ padding: '10px',background:'#fff'}" shadow="always">
          <div class="cardList">
            <div class="card-img">
              <img :src="item.huiystp" v-if="item.huiystp"/>
              <img :src="cheimg" v-else/>
            </div>

            <div class="cardInfo">
              <div class="card-text carditem">会议室名称：{{ item.xingm }}</div>
              <div class="card-text carditem">会议室设备：{{ item.jial }}年</div>
              <div class="card-text carditem">会议室人数：{{ item.lianxdh }}</div>
              <div class="card-text carditem">状态：
                <el-tag v-if="item.zhuangt == '工作中'" effect="dark" type="danger">工作中</el-tag>
                <el-tag v-if="item.zhuangt == '空闲中'" effect="dark" type="success">空闲中</el-tag>
              </div>
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
  getListData,
  saveOrUpdateListData,
  delListData,
  viewListData
} from "@/api/outSystem/meetingManage";
const baseUrl = process.env.BASE_URL;
export default {
  data () {
    var lianxfs = (rule, value, callback) => {
      if (!Number.isInteger(parseInt(value))) {
        callback(new Error('请输入数字'));
      }else{
        callback()
      }
    }
    return {
      newImg: `${baseUrl}img/new.png`,
      cheimg: `${baseUrl}img/huiyi.png`,
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
            type: 'upload',
            label: '会议室图片',
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
            prop: 'huiystp',
            isListDisplay: true,
            search: false,
            data: {
              fromSystemName: 'base'
            }
          },
          {
            type: 'input',
            label: '会议室名称',
            span: 16,
            display: true,
            hideLabel: false,
            prop: 'huiysmc',
            isListDisplay: true,
            search: true,
            searchLabelWidth:120,
            required: true,
            rules: [
              {
                required: true,
                message: '会议室名称必须填写'
              }
            ]
          },
          {
            type: 'input',
            label: '会议室设备',
            span: 16,
            display: true,
            hideLabel: false,
            prop: 'huiyssb',
            isListDisplay: true,
            search:true,
            searchLabelWidth: 100,
          },
          {
            type: 'number',
            label: '会议室人数',
            span: 16,
            display: true,
            prop: 'huiysrs',
            controls: false,
            valueType: 'int',
            rules: [
              {
                validator: lianxfs,
                message: '会议室人数必须为整数',
                trigger: 'blur'
              },
            ],
            search:false,
            searchLabelWidth: 100,
          },
          {
            type: 'input',
            label: '会议室位置',
            span: 16,
            display: true,
            hideLabel: false,
            prop: 'huiyswz',
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
          this.permission[`outsys-meetman-add`],
          false
        ),
        viewBtn: this.vaildData(
          this.permission[`outsys-meetman-view`],
          false
        ),
        editBtn: this.vaildData(
          this.permission[`outsys-meetman-edit`],
          false
        ),
        delBtn: this.vaildData(
          this.permission[`outsys-meetman-del`],
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
      if (row.huiystp.constructor === Array){
        row.huiystp = row.huiystp[0].value;
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
      if (row.huiystp.constructor === Array){
        row.huiystp = row.huiystp[0].value;
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

.cardList{
  display: flex;
  width: 95%;
  height: 160px;
  border-radius: 15px;
}
.card-img{
  width: 30%;
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
  margin-top: 20px;
  font-size: 14px;
}
.carditem{
  margin: 10px 0;
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
  -webkit-box-shadow: 0 2px 12px 0 rgba(0, 0, 0, .1);
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, .1);
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
