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
      <template slot-scope="scope" slot="menuLeft">
        <!-- <el-button v-if="permissionList.exportExcel" size="small" icon="el-icon-download" type="primary" @click="exportExcel">
          导出
        </el-button> -->
        <el-upload v-if="permissionList.uploadBtn" :auto-upload="false" :show-file-list="false"
          :on-change="handleChange" style="display: inline-block;">
          <el-button size="small" icon="el-icon-upload2" type="primary">导入</el-button>
        </el-upload>
        <el-button v-if="permissionList.downloadExcel" size="small" icon="el-icon-download" type="primary"
                    @click="downloadExcel">
          下载模版
        </el-button>
      </template>
      <!-- <template v-slot:menu="scope">
        <el-button type="text" size="small" v-if="permissionList.viewBtn" @click="comFormMagView(scope.row)">查看
        </el-button>
        <el-button type="text" size="small" v-if="permissionList.editBtn" @click="comFormMagUpdate(scope.row)">编辑
        </el-button>
        <el-button type="text" size="small" v-if="permissionList.delBtn" @click="comFormMagDel(scope.row)">删除
        </el-button>
      </template> -->
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
  importExcel
} from "@/api/outSystem/inventory";
const baseUrl = process.env.BASE_URL;
export default {
  data () {
    return {
      // 上传数据
      fileList: [],

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
        menu: false,
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
            type: 'input',
            label: '物品名称',
            span: 16,
            display: true,
            hideLabel: false,
            prop: 'wupmc',
            isListDisplay: true,
            search: true
          },
          {
            type: 'input',
            label: '物品规格',
            span: 16,
            display: true,
            hideLabel: false,
            prop: 'wupgg',
            isListDisplay: true,
            search: true
          },
          {
            type: 'number',
            label: '库存可用数量',
            controls: true,
            valueType: 'int',
            span: 16,
            display: true,
            hideLabel: false,
            step: 1,
            controlsPosition: 'right',
            prop: 'kuckysl',
            isListDisplay: true,
          },
          {
            type: 'input',
            label: '维保公司',
            span: 16,
            display: true,
            hideLabel: false,
            prop: 'weibgs',
            isListDisplay: true,
            search: false
          },
          {
            type: 'input',
            label: '物品规格',
            span: 16,
            display: true,
            hideLabel: false,
            prop: 'wupgg',
            isListDisplay: true,
            search: true
          },
          {
            type: 'input',
            label: '物品规格',
            span: 16,
            display: true,
            hideLabel: false,
            prop: 'wupgg',
            isListDisplay: true,
            search: true
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
          this.permission[`outsys-inven-add`],
          false
        ),
        viewBtn: this.vaildData(
          this.permission[`outsys-inven-view`],
          false
        ),
        editBtn: this.vaildData(
          this.permission[`outsys-inven-edit`],
          false
        ),
        delBtn: this.vaildData(
          this.permission[`outsys-inven-del`],
          false
        ),
        uploadBtn: this.vaildData(
          this.permission[`outsys-inven-upload`],
          false
        ),
        downloadExcel:this.vaildData(
          this.permission[`outsys-inven-download`],
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
    // 下载模板
    downloadExcel() {
      let a = document.createElement("a");
      a.href = `${baseUrl}template/入库单模板.xls`;
      a.download = "入库单模板.xls";
      a.style.display = "none";
      document.body.appendChild(a);
      a.click();
      a.remove();
    },
    // 验证表格格式
    beforeAvatarUpload (file) {
      // 通过split方法和fileArr方法获取到文件的后缀名
      let fileArr = file.name.split('.')
      let suffix = fileArr[fileArr.length - 1]
      if (!/(xls|xlsx)/i.test(suffix)) {
        this.$message({
          message: "文件格式错误！",
          type: 'error'
        })
        return false
      }
      // if (file.size > 2 * 1024 * 1024) {
      //   this.$message('文件过大，请上传小于2MB的文件〜')
      //   return false
      // }
      return true
    },
    // 导入
    handleChange (file, fileLis) {
      //判断是否符合beforeAvatarUpload方法中的条件
      if (this.beforeAvatarUpload(file)) {
        this.fileList.name = file.name
        this.fileList.url = ''
        var formdata = new FormData()
        formdata.append('file', file.raw)
        importExcel(formdata).then((res) => {
          if (res.status === 200) {
            this.$message({
              message: "上传成功！",
              type: 'success'
            })
            this.onLoad(this.page);
          } else {
            this.$message({
              message: res.msg,
              type: 'error'
            })
          }
        }).catch((res) => {
          this.$message({
            message: res.msg,
            type: 'success'
          })
          this.onLoad(this.page);
        })
      }
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

<style lang="scss" scoped></style>
