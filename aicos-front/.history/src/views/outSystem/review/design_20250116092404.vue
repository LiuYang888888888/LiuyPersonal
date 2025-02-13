<template>
  <basic-container>
    <!-- <div class="search-list">
      <div class="search-tj search-title">
        <div class="biaoti">问卷名称：</div>
        <el-input v-model="biaoti" placeholder="请输入问卷名称" @input="bianhua"></el-input>
      </div>
    </div>

    <div class="searchdiv">
      <div class="searchBtn">
        <el-button type="primary" class="search-btn" @click.stop="handSetting">搜索</el-button>
      </div>
    </div>

    <div class="searchBtnadd">
      <el-button type="primary" class="search-btn" @click.stop="handSettingadd">新增</el-button>
    </div>

    <div style="height: 100%;">
      <el-table  element-loading-text="拼命加载中" element-loading-spinner="el-icon-loading"
        element-loading-background="rgba(255, 255, 255, 1)" :data="tableData" :height="tableConfig.height"
        empty-text="暂无数据" border highlight-current-row highlight-selection-row @selection-change="handleSelectionChange"
        :header-cell-style="{ background: '#f7f7f7' }" style="width: 100%">
        <el-table-column type="index" label="序号" width="50">
        </el-table-column>
        <el-table-column prop="pname" label="问卷名称" min-width="300">
        </el-table-column>
        <el-table-column prop="descrip" label="问卷说明" width="300">
        </el-table-column>
        <el-table-column prop="createTime" label="创建日期" min-width="150">
        </el-table-column>
        <el-table-column prop="wjstatus" label="问卷状态" width="120">
        </el-table-column>
        <el-table-column prop="fbstatus" label="发布状态" width="100">
        </el-table-column>
        <el-table-column label="操作" width="300">
          <template slot-scope="scope">
            <el-button @click="handleClick(scope.row)" type="text" size="small">查看</el-button>
            <el-button @click="editClick(scope.row)" type="text" size="small">编辑</el-button>
            <el-button @click="handleStart(scope.row)" type="text" size="small"
              v-if="scope.row.wjstatus == '停用'">启用</el-button>
            <el-button @click="handleStart(scope.row)" type="text" size="small" v-else>停用</el-button>
            <el-button @click="handleFb(scope.row)" type="text" size="small"
              v-if="scope.row.fbstatus == '未发布'">发布</el-button>
            <el-button @click="handleFb(scope.row)" type="text" size="small" v-else>停止发布</el-button>
            <el-button @click="handleCopy(scope.row)" type="text" size="small">复制</el-button>
            <el-button @click="handleAll(scope.row)" type="text" size="small">统计</el-button>
          </template>
</el-table-column>
</el-table>
<div class="block">
  <el-pagination background @size-change="handleSizeChange" @current-change="handleCurrentChange"
    :current-page="current" :page-sizes="[5, 10, 20, 50]" :page-size="size"
    layout="total, sizes, prev, pager, next, jumper" :total="total">
  </el-pagination>
</div>
</div> -->

    <avue-crud :option="listOption" :table-loading="loading" :data="listData" ref="listRef" v-model="listForm"
      :page.sync="page" :permission="permissionList" :before-open="beforeOpen" :before-close="beforeClose"
      @search-change="searchChange" @search-reset="searchReset" @selection-change="selectionChange"
      @current-change="currentChange" @size-change="sizeChange" @refresh-change="refreshChange" @on-load="onLoad"
      @row-save="rowSave" @row-update="rowUpdate">
      <template slot-scope="scope" slot="menuLeft">
        <el-button v-if="permissionList.addBtn" type="primary" class="search-btn" @click="handSettingadd">
          新增
        </el-button>
      </template>
      <template v-slot:menu="scope">
        <el-button type="text" size="small" v-if="permissionList.viewBtn" @click="handleClick(scope.row)">查看
        </el-button>
        <el-button type="text" size="small" v-if="permissionList.editBtn" @click="editClick(scope.row)">编辑
        </el-button>
        <el-button type="text" size="small" v-if="permissionList.qiyongBtn && scope.row.wjstatus == '启用'" 
        @click="handleStart(scope.row)">停用
        </el-button>
        <el-button type="text" size="small" v-if="permissionList.qiyongBtn && scope.row.wjstatus == '停用'" 
        @click="handleStart(scope.row)">启用
        </el-button>
        <el-button type="text" size="small" v-if="permissionList.fabuBtn && scope.row.fbstatus == '未发布'"
          @click="handleFb(scope.row)">发布
        </el-button>
        <el-button type="text" size="small" v-if="permissionList.fabuBtn && scope.row.fbstatus == '已发布'"
          @click="handleFb(scope.row)">停止发布
        </el-button>
        <el-button type="text" size="small" v-if="permissionList.copyBtn" @click="handleCopy(scope.row)">复制
        </el-button>
        <el-button type="text" size="small" v-if="permissionList.tongjiBtn" @click="handleAll(scope.row)">统计
        </el-button>
      </template>
    </avue-crud>

    <el-dialog title="问卷统计" :visible.sync="dialogTableVisible" :modal="true" :before-close="handleDialogClose"
      width="60%" :lock-scroll="true" :append-to-body="true">
      <el-button type="primary" class="common-button" v-print="'#NbAllPage'">打印</el-button>
      <div id="NbAllPage">
        <div v-for="(item, index) in tableList" :key="index" class="tablelist">
          <div class="tabletitle">{{ item.questionTitle }}</div>
          <el-table :data="item.voList" border :header-cell-style="{ background: '#eef1f6', color: '#606266' }">
            <el-table-column type="index" width="50"></el-table-column>
            <el-table-column property="optionTitle" label="选项">
              <template scope="scope">
                <span v-if="scope.row.optionTitle === '问答题结果'" style="color: #409eff; cursor: pointer;"
                  @click="handleResult(item.questionId)">{{ scope.row.optionTitle }}</span>
                <span v-else>{{ scope.row.optionTitle }}</span>
              </template>
            </el-table-column>
            <el-table-column property="num" label="答题人数" width="200"></el-table-column>
            <el-table-column property="ratio" label="比例" width="200"></el-table-column>
          </el-table>
        </div>
      </div>
    </el-dialog>


    <Dialogsp ref="dialogFormsp" :dialog.sync="dialogFormVisiblesp" :spid="rowspid" @closesp="closesp"
      @closespcg="closespcg" :look="lookView"  v-if="dialogFormVisiblesp"/>

  </basic-container>
</template>

<script>
import Dialogsp from "@/views/outSystem/review/sheji.vue";
import { mapGetters } from "vuex";
import {
  shejiList, editStatus, copyQuestion, getQuestionStatistics, exportQuestion
} from "@/api/outSystem/design";

export default {
  data () {
    let that = this
    return {
      dialogFormVisiblesp: false,
      dialogTableVisible: false,

      tableList: [],

      lookView: false,
      wjstatus: 0,
      fbstatus: 0,

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
        excelBtn:false,
        column: [
          {
            type: 'input',
            label: '问卷名称',
            span: 16,
            display: false,
            hideLabel: false,
            prop: 'pname',
            isListDisplay: true,
            search: true,
          },
          {
            type: 'input',
            label: '问卷说明',
            span: 16,
            display: false,
            hideLabel: false,
            prop: 'descrip',
            isListDisplay: true,
          },
          {
            type: 'input',
            label: '创建日期',
            span: 16,
            display: false,
            hideLabel: false,
            prop: 'createTime',
            isListDisplay: true,
          },
          {
            type: 'input',
            label: '问卷状态',
            span: 16,
            display: false,
            hideLabel: false,
            isListDisplay: true,
            prop: 'wjstatus',
          },
          // {
          //   type: 'input',
          //   label: '发布状态',
          //   span: 16,
          //   display: false,
          //   hideLabel: false,
          //   prop: 'fbstatus',
          //   isListDisplay: true,
          //   search:true
          // },
          {
            type: 'select',
            label: '发布状态',
            cascaderItem: [],
            span: 16,
            display: false,
            props: {
              label: 'name',
              value: 'value'
            },
            hideLabel: false,
            dataType: '',
            prop: 'fbstatus',
            isListDisplay: true,
            search: true,
            dicUrl: '/aicos/api/aicos-system/baseDict/getDictItemListByDictCode',
            dicMethod: 'post',
            dicQuery: {
              code: 'wenjfbstatus'
            }
          },
        ],
      },

      printObject: {
        id: 'NbAllPage',
        popTitle: '统计结果', // 打印配置页上方的标题
        extraHead: '打印', // 最上方的头部文字，附加在head标签上的额外标签，使用逗号分割
        preview: true, // 是否启动预览模式，默认是false
        previewTitle: '统计结果', // 打印预览的标题
        previewPrintBtnLabel: '预览结束，开始打印', // 打印预览的标题下方的按钮文本，点击可进入打印
        zIndex: 20002, // 预览窗口的z-index，默认是20002，最好比默认值更高
        previewBeforeOpenCallback () {
          console.log('正在加载预览窗口！');
          console.log(that.msg, this)
        }, // 预览窗口打开之前的callback
        previewOpenCallback () {
          console.log('已经加载完预览窗口，预览打开了！')
        }, // 预览窗口打开时的callback
        beforeOpenCallback () {
          console.log('开始打印之前！')
        }, // 开始打印之前的callback
        openCallback () {
          console.log('执行打印了！')
        }, // 调用打印时的callback
        closeCallback () {
          console.log('关闭了打印工具！')
        }, // 关闭打印的callback(无法区分确认or取消)
        clickMounted () {
          console.log('点击v-print绑定的按钮了！')
        },
      }
    };
  },
  components: {
    Dialogsp
  },
  created () {
    window.addEventListener('resize', this.getHeight)
  },
  destroyed () {
    window.removeEventListener('resize', this.getHeight)
  },
  mounted () {

  },
  computed: {
    ...mapGetters(["permission"]),
    permissionList () {
      return {
        addBtn: this.vaildData(
          this.permission[`outsys-design-add`],
          false
        ),
        viewBtn: this.vaildData(
          this.permission[`outsys-design-view`],
          false
        ),
        editBtn: this.vaildData(
          this.permission[`outsys-design-edit`],
          false
        ),
        delBtn: this.vaildData(
          this.permission[`outsys-design-del`],
          false
        ),
        qiyongBtn: this.vaildData(
          this.permission[`outsys-design-qiyong`],
          false
        ),
        fabuBtn: this.vaildData(
          this.permission[`outsys-design-fabu`],
          false
        ),
        copyBtn: this.vaildData(
          this.permission["outsys-design-copy"],
          false
        ),
        tongjiBtn: this.vaildData(
          this.permission["outsys-design-tongji"],
          false
        ),
      };
    },
  },
  methods: {
    GMTToStr (time) {
      let date = new Date(time)
      let Str = date.getFullYear() + '-' +
        (date.getMonth() + 1) + '-' +
        date.getDate()
      return Str
    },
    getHeight () {
      this.tableConfig.height = window.innerHeight - 350
    },
    //问卷状态
    handleStart (row) {
      if (row.wjstatus == '启用' || row.wjstatus == 1) {
        if (row.fbstatus == '已发布' || row.fbstatus == 1) {
          this.$message({
            message: '有正在发布的问卷！',
            type: 'warning'
          })
          return false
        } else {
          this.wjstatus = 0
        }
      } else {
        this.wjstatus = 1
      }

      if (row.fbstatus == '未发布' || row.fbstatus == 0) {
        this.fbstatus = 0
      } else {
        this.fbstatus = 1
      }
      if (this.wjstatus == 1) {
        this.$confirm("确定启用问卷?", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        })
          .then(() => {
            row.fbstatus = this.fbstatus
            row.wjstatus = this.wjstatus
            return editStatus(row);
          })
          .then(res => {
            if (res.data.code == 200) {
              this.$message({
                message: res.data.msg,
                type: 'success'
              })
              this.onLoad(this.page, this.query);
            } else {
              this.$message({
                message: '操作失败',
                type: 'error'
              })
            }
          })
      } else {
        this.$confirm("确定停用问卷?", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        })
          .then(() => {
            row.fbstatus = this.fbstatus
            row.wjstatus = this.wjstatus
            return editStatus(row);
          })
          .then(res => {
            if (res.data.code == 200) {
              this.$message({
                message: res.data.msg,
                type: 'success'
              })
              this.onLoad(this.page, this.query);
            } else {
              this.$message({
                message: '操作失败',
                type: 'error'
              })
            }
          })
      }
    },
    //发布状态
    handleFb (row) {
      if (row.fbstatus == '未发布' || row.fbstatus == 0) {
        if (row.wjstatus == '停用' || row.wjstatus == 0) {
          this.$message({
            message: '问卷未启用！',
            type: 'warning'
          })
          return false
        } else {
          this.fbstatus = 1
        }
      } else {
        this.fbstatus = 0
      }
      if (row.wjstatus == '停用' || row.wjstatus == 0) {
        this.wjstatus = 0
      } else {
        this.wjstatus = 1
      }
      if (this.fbstatus == 1) {
        this.$confirm("确定发布问卷?", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        })
          .then(() => {
            row.wjstatus = this.wjstatus
            row.fbstatus = this.fbstatus
            return editStatus(row);
          })
          .then(res => {
            if (res.data.code == 200) {
              this.$message({
                message: res.data.msg,
                type: 'success'
              })
              this.onLoad(this.page, this.query);
            } else {
              this.$message({
                message: '操作失败',
                type: 'error'
              })
          
            }
          })
      } else {
        this.$confirm("确定停止发布问卷?", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        })
          .then(() => {
            row.wjstatus = this.wjstatus
            row.fbstatus = this.fbstatus
            return editStatus(row);
          })
          .then(res => {
            if (res.data.code == 200) {
              this.$message({
                message: res.data.msg,
                type: 'success'
              })
              this.onLoad(this.page, this.query);
            } else {
              this.$message({
                message: '操作失败',
                type: 'error'
              })
            }
          })
      }
    },

    initData (/*type*/) { },

    refreshChange () {
      this.onLoad(this.page, this.query);
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
      this.onLoad(this.page);
      done();
    },

    selectionChange (list) {
      this.selectionList = list;
    },

    selectionClear () {
      this.selectionList = [];
      this.$refs.listRef.toggleSelection();
    },

    //列表
    onLoad (page) {
      this.loading = true;
      shejiList(page.currentPage, page.pageSize, { ...this.query }).then(res => {
        console.log(res)
        this.page.total = res.data.total
        this.page.pageSize = res.data.data.size;
        this.page.currentPage = res.data.data.current;
        this.listData = res.data.data.records
        if (this.listData.length > 0) {
          for (let i = 0; i < this.listData.length; i++) {
            if (this.listData[i].wjstatus == 0) {
              this.listData[i].wjstatus = '停用'
            } else if (this.listData[i].wjstatus == 1) {
              this.listData[i].wjstatus = '启用'
            }

            if (this.listData[i].fbstatus == 0) {
              this.listData[i].fbstatus = '未发布'
            } else if (this.listData[i].fbstatus == 1) {
              this.listData[i].fbstatus = '已发布'
            }
          }
        }
        setTimeout(() => {
          this.loading = false;
          this.selectionClear();
        }, 1000);
      })
    },
    //新增问卷
    handSettingadd () {
      this.dialogFormVisiblesp = true
      this.$nextTick(() => {
        this.$refs.dialogFormsp.clear()
      })
    },

    //查看
    handleClick (row) {
      this.dialogFormVisiblesp = true
      this.rowspid = row.id
      this.lookView = true
      this.$nextTick(() => {
        this.$refs.dialogFormsp.getRouterValue()
      })
    },
    closesp () {
      this.dialogFormVisiblesp = false
    },
    closespcg () {
      this.dialogFormVisiblesp = false
      this.onLoad(this.page, this.query);
    },
    //编辑
    editClick (row) {
      if (row.fbstatus == 1 || row.fbstatus == '已发布') {
        this.$message({
          message: '已发布问卷不能编辑!',
          type: 'warning'
        });
        return
      }
      this.dialogFormVisiblesp = true
      this.rowspid = row.id
      this.lookView = false
      this.$nextTick(() => {
        this.$refs.dialogFormsp.getRouterValue()
      })
    },
    //复制
    handleCopy (row) {
      this.$confirm("确定复制该问卷?", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          this.loading = true
          return copyQuestion(row.id)
        })
        .then(res => {
          if (res.data.code == 200) {
            this.$message({
              message: '复制成功',
              type: 'success'
            })
            this.onLoad(this.page, this.query);
          } else {
            this.loading = false
            this.$message({
              message: '操作失败',
              type: 'error'
            })
          }
        })
    },
    //统计
    handleAll (row) {
      getQuestionStatistics(row.id).then(res => {
        this.dialogTableVisible = true
        this.tableList = res.data.data
      })
    },
    //统计函数
    download (blob, name) {
      const link = document.createElement('a'); //创建一个a标签
      const url = URL.createObjectURL(blob); //将blob文件对象通过URL.createObjectURL()方法转为为url
      link.href = url; //为a标签设置href属性，并赋值为url
      link.download = name; //定义下载的文件名，文件名要包含后缀哟！如'导出EXCEL.xlsx'
      document.body.appendChild(link); //把a标签放在body上
      link.click(); //出发a标签点击下载
      document.body.removeChild(link); //在body中移除这个a标签
      URL.revokeObjectURL(url); //释放blob对象
    },
    //问答题结果查看
    handleResult (row) {
      exportQuestion(row).then(res => {
        this.download(res.data, '问答结果.xlsx')
      })
    }
  }
}
</script>

<style scoped>
.search-list {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  margin-bottom: 20px;
}

.search-tj {
  margin-top: 20px;
  margin-left: 20px;
}

.title-int {
  width: 200px;
}

.searchdiv {
  width: 100%;
}

.searchBtn {
  display: flex;
  width: 200px;
  margin: 20px auto;
}

.cell {
  text-align: center;
}

.block {
  width: 80%;
  margin: 40px auto 20px;
}

.el-date-editor.el-input,
.el-date-editor.el-input__inner {
  width: 150px !important;
}

/* /deep/ .el-select>.el-input {
  width: 120px !important;
} */

.search-title {
  display: flex;
  width: 400px;
}

.biaoti {
  width: 100px;
  line-height: 40px;
  text-align: right;
}

.searchBtnadd {
  display: flex;
  width: 200px;
  margin: 20px 0px 20px 20px;
}

.tablelist {
  margin-top: 40px;
  width: 100%;
  max-height: 500px;
  overflow: hidden;
  overflow-y: auto;
}

.tabletitle {
  width: 100%;
  font-size: 18px;
  margin-bottom: 20px;
  font-weight: 600;
}

#NbAllPage{
  width: 900px;
  zoom: 1;
  margin: 0 auto;
}

/*去除页眉页脚*/
@page{
    size:  auto;   /* auto is the initial value */
    margin: 3mm;  /* this affects the margin in the printer settings */
  }
 
  html{
    background-color: #FFFFFF;
    margin: 0;  /* this affects the margin on the html before sending to printer */
  }
 
  body{
    border: solid 1px blue ;
    margin: 10mm 15mm 10mm 15mm; /* margin you want for the content */
  }
  /*去除页眉页脚*/
</style>
