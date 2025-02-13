<template>
  <basic-container>
    <avue-crud :option="listOption" :table-loading="loading" :data="listData" ref="listRef" v-model="listForm"
      :page.sync="page" :permission="permissionList" :before-open="beforeOpen" :before-close="beforeClose"
      @search-change="searchChange" @search-reset="searchReset" @selection-change="selectionChange"
      @current-change="currentChange" @size-change="sizeChange" @refresh-change="refreshChange" @on-load="onLoad"
      @row-save="rowSave" @row-update="rowUpdate">
      <template slot-scope="scope" slot="menuLeft">
        <el-button v-if="permissionList.exportExcel" size="small" icon="el-icon-download" type="primary"
          @click="exportExcel">
          导出
        </el-button>
        <el-upload v-if="permissionList.uploadBtn" :auto-upload="false" :show-file-list="false" action="action"
          :on-change="handleChange">
          <el-button type="primary" icon="el-icon-upload2">导入</el-button>
        </el-upload>
        <el-button v-if="permissionList.downloadExcel" type="primary" @click="downloadExcel">下载导入模版</el-button>
      </template>
      <template v-slot:menu="scope">
        <el-button type="text" size="small" v-if="permissionList.viewBtn" @click="comFormMagView(scope.row)">查看
        </el-button>
        <el-button type="text" size="small"
          v-if="(scope.row.zhuangt == 1 || scope.row.zhuangt == 3) && permissionList.editBtn"
          @click="comFormMagUpdate(scope.row)">编辑
        </el-button>
        <el-button type="text" size="small"
          v-if="(scope.row.zhuangt == 1 || scope.row.zhuangt == 3) && permissionList.delBtn"
          @click="comFormMagDel(scope.row)">删除
        </el-button>
      </template>
    </avue-crud>
  </basic-container>
</template>

<script>
import { baseURL } from "@/api/common";
import { dateFormat } from "@/util/date";
import { mapGetters } from "vuex";
import {
  getListData,
  saveOrUpdateListData,
  deleteListData,
  importTemplateFile,
  importExcel,
  exportExcel

} from "@/api/outSystem/superVision";
export default {
  data () {
    return {
      // 上传数据
      fileList: [],

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
        stripe: true,
        height: 'auto',
        align: 'center',
        searchShow: true,
        tip: false,
        excelBtn: false,
        border: false,
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
        menuAlign: 'center',
        menuPosition: 'center',
        isCustom: false,
        column: [
          {
            type: 'input',
            label: '国防专利号',
            span: 16,
            display: true,
            hideLabel: false,
            prop: 'guofzlh',
            isListDisplay: true,
          },
          {
            type: 'select',
            label: '密级标识',
            cascaderItem: [],
            span: 16,
            display: true,
            props: {
              label: 'name',
              value: 'name'
            },
            hideLabel: false,
            prop: 'mijbs',
            isListDisplay: true,
            dicUrl: '/aicos/api/aicos-system/baseDict/getDictItemListByDictCode',
            dicMethod: 'post',
            dicQuery: {
              code: 'mj'
            }
          },
          {
            type: 'input',
            label: '发明名称',
            span: 16,
            display: true,
            hideLabel: false,
            prop: 'fammc',
            isListDisplay: true,
          },
          {
            type: 'input',
            label: '发明人',
            span: 16,
            display: true,
            hideLabel: false,
            prop: 'famr',
            isListDisplay: true,
          },
          {
            type: 'date',
            label: '申请日期',
            span: 16,
            display: true,
            format: 'yyyy-MM-dd',
            valueFormat: 'yyyy-MM-dd',
            hideLabel: false,
            dataType: 'datetime',
            prop: 'shenqrq',
            isListDisplay: true,
          },
          {
            type: 'date',
            label: '授权公告日期',
            span: 16,
            display: true,
            format: 'yyyy-MM-dd',
            valueFormat: 'yyyy-MM-dd',
            hideLabel: false,
            dataType: 'datetime',
            prop: 'shouqggrq',
            isListDisplay: true,
          },
          {
            type: 'textarea',
            label: '摘要',
            span: 16,
            display: true,
            hideLabel: false,
            prop: 'zhaiy',
            isListDisplay: true,
          },
          {
            type: 'input',
            label: '权利要求书',
            span: 16,
            display: true,
            hideLabel: false,
            prop: 'quanlyqs',
            isListDisplay: true,
          },
          {
            type: 'select',
            label: '技术领域',
            cascaderItem: [],
            span: 16,
            display: true,
            props: {
              label: 'name',
              value: 'name'
            },
            hideLabel: false,
            prop: 'jisly',
            isListDisplay: true,
            dicUrl: '/aicos/api/aicos-system/baseDict/getDictItemListByDictCode',
            dicMethod: 'post',
            dicQuery: {
              code: 'jscpyyly'
            }
          },
          {
            type: 'select',
            label: '政府机构',
            cascaderItem: [],
            span: 16,
            display: true,
            props: {
              label: 'name',
              value: 'name'
            },
            hideLabel: false,
            prop: 'zhengfjg',
            isListDisplay: true,
            dicUrl: '/aicos/api/aicos-system/baseDict/getDictItemListByDictCode',
            dicMethod: 'post',
            dicQuery: {
              code: 'danweixz'
            }
          },
          {
            type: 'input',
            label: '保密期限',
            span: 16,
            display: true,
            hideLabel: false,
            prop: 'baomqx',
            isListDisplay: true,
          },
          {
            type: 'input',
            label: '法律状态',
            span: 16,
            display: true,
            hideLabel: false,
            prop: 'falzt',
            isListDisplay: true,
          },
          {
            type: 'input',
            label: '使用许可信息',
            span: 16,
            display: true,
            hideLabel: false,
            prop: 'shiyxkxx',
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
          this.permission[`outsys-national-add`],
          false
        ),
        viewBtn: this.vaildData(
          this.permission[`outsys-national-view`],
          false
        ),
        editBtn: this.vaildData(
          this.permission[`outsys-national-edit`],
          false
        ),
        delBtn: this.vaildData(
          this.permission[`outsys-national-del`],
          false
        ),
        //导入
        uploadBtn: this.vaildData(
          this.permission[`outsys-national-armyUploadBtn`],
          false
        ),
        // 模版下载
        downloadExcel: this.vaildData(
          this.permission["outsys-national-download"],
          false
        ),
        // 导出
        exportExcel: this.vaildData(
          this.permission["sys-share-export"],
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
  watch: {

  },
  methods: {
    // 导出
    exportExcel () {
      const data = {}
      exportExcel(data).then((res) => {
        const urlRes = `${baseURL}` + res.data.data.substring(1);
        //console.log(urlRes);
        this.downFile(urlRes /*, fileName*/);
        this.refreshChange();
        this.$message({
          type: "success",
          message: "操作成功!",
        });
      }),
      (error) => {
        window.console.log(error);
      }
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
    // 下载模板
    downloadExcel () {
      const dataParam = {};
      let fileName =
        "数据模板_" +
        dateFormat(new Date(), "hh_mm_ss").toString() +
        ".xlsx";
      importTemplateFile(dataParam).then(
        (res) => {
          // console.log("获取模版",res.data.data.substring(1))
          const urlRes = `${baseURL}` + res.data.data.substring(1);
          this.downFile(urlRes, fileName);

          this.$message({
            type: "success",
            message: "操作成功!",
          });
        },
        (error) => {
          window.console.log(error);
        }
      );
    },
    Info () {
      // getInfo().then(res => {
      //   const info = res.data.data
      //   this.listForm.fabz = info.realName
      //   this.listForm.lianxr = info.contacts
      //   this.listForm.lianxdh = info.mobile
      // })
    },
    initData (/*type*/) { },
    refreshChange () {
      this.onLoad(this.page, this.query);
    },
    beforeOpen (done, type) {
      if (["add", "edit", "view"].includes(type)) {
        if (type == 'edit' || type == 'view') {
          this.listForm.xingzqy = this.listForm.xingzqy.split("/")
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
        metaObjName: this.metaObjName,
        systemCode: this.systemCode,
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
        this.listData.forEach(e => {
          e.xingzqy = e.xingzqy.replace(/,/g, "/")
        })
        this.loading = false;
        this.selectionClear();
      });
    },

    //查看
    async comFormMagView (row, index) {
      this.$refs.listRef.rowView(row, index);
    },

    //新增
    rowSave (row, done, loading) {
      if (row.xingzqy.length > 0) {
        row.xingzqy = row.xingzqy.join("/")
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
      if (Array.isArray(row.xingzqy)) {
        row.xingzqy = row.xingzqy.join("/")
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
          return deleteListData(params);
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
.el-button--primary {
  background-color: #af2c30 !important;
  border-color: #af2c30 !important;
}

.el-button--primary:focus,
.el-button--primary:hover {
  background-color: #af2c30 !important;
  border-color: #af2c30 !important;
}

.el-button--text {
  color: #af2c30 !important;
}

.avue-crud .el-table--small th {
  background-color: #af2c30 !important;
  color: #fff !important;
  border: none;
}

.el-pagination.is-background .el-pager li:not(.disabled).active {
  background-color: #af2c30;
  border: 1px solid #af2c30;
}

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