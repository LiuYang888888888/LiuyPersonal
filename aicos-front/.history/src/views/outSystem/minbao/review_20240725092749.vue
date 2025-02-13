<template>
  <basic-container>
    <el-dialog :title="ptitle" :visible.sync="dialogQuest" :modal="true" :modal-append-to-body="false" width="60%" :lock-scroll="true">
      <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="100px" class="demo-ruleForm">
        <el-form-item v-for="(item,index) in ruleForm" :key="index">
          <div> <span style="color: #f00;" v-if="item.ismust == 1">*</span>  {{ index+1 }}.  {{item.qcontent}} <span style="color: #409eff;" v-if="item.qtype == 'checkbox'">（多选）</span> <span style="color: #409eff;" v-if="item.qtype == 'radio'">（单选）</span></div>
          <div v-if="item.qtype == 'radio'" class="newradio">
            <el-radio-group v-model="item.answers">
              <el-radio :label="item.id" v-for="(item, index) in item.questionOptionVOList" :key="index"> <span style="display: inline-block;margin-left: 10px;">{{item.name}}</span>  <span style="display: inline-block;margin-left: 10px;">{{ item.optionContent }}</span></el-radio>
            </el-radio-group>
          </div>

          <div v-if="item.qtype == 'checkbox'" class="newradio">
            <el-checkbox-group v-model="item.checkList" :key="index">
              <el-checkbox :label="item.id" v-for="(item, index) in item.questionOptionVOList" :key="index"> <span style="display: inline-block;margin-left: 10px;">{{item.name}}</span> <span style="display: inline-block;margin-left: 10px;">{{ item.optionContent }}</span> </el-checkbox>
            </el-checkbox-group>
          </div>

          <div v-if="item.qtype == 'input'">
            <el-input v-model="item.answers" type="textarea" autosize placeholder="请输入内容" style="width:60%"></el-input>
          </div>
        </el-form-item>
      </el-form>
      <div class="operation">
        <el-button size="mini" type="primary" :loading="true" v-if="!pictLoading">提交中</el-button>
        <el-button size="mini" @click="save" type="primary" v-if="pictLoading">提交</el-button>
        <el-button size="mini" @click="cancle" type="info">取消</el-button>
      </div>
    </el-dialog>

  </basic-container>
</template>

<script>
import { mapGetters } from "vuex";
// import {getduetime,getUser,getQuestionDetail,getQuestion,submitQuestion} from "@/api/project_shenpi_config/shenpiconfig";
export default {
  data () {
    return {
      current: 1,
      size: 10,
      total: null,
      startDate: '',
      endDate: '',
      title: '',
      sxList: [],
      styleList: [],
      myList: [],
      ldList: [],
      bmList: [],
      scList: [],
      ztList: [],
      duan: '',
      select: '',
      myselect: '',
      ldselect: '',
      bmselect: '',
      scselect: '',
      ztselect: '',
      banliselect: '0',
      biaoti: '',
      tableData: [],
      multipleSelection: [],
      loading: true,
      dialogFormVisible: false,
      dialogFormVisiblesp: false,
      dialogTableVisible: false,
      tableList: [],
      tableConfig: {
        height: window.innerHeight - 350
      },
      lookView: false,
      wjstatus: 0,
      fbstatus: 0,
      pickerOptions2: {
        disabledDate: time => {
          if (this.endDate) {
            return time.getTime() > new Date(this.endDate).getTime()
          }
        }
      },
      pickerOptions: {
        disabledDate: time => {
          if (this.startDate) {
            return time.getTime() < new Date(this.startDate).getTime() - 8.64e7
          }
        }
      }
    };
  },
  components: {
    Dialogsp
  },
  created () {
    this.getList()
    window.addEventListener('resize', this.getHeight)
  },
  destroyed () {
    window.removeEventListener('resize', this.getHeight)
  },
  mounted () {

  },
  computed: {
    ...mapGetters(["permission"]),
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
    //新增问卷
    handSettingadd () {
      this.dialogFormVisiblesp = true
    },
    //类别选择变化
    bianhua () {
      this.gaibian = true
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
            this.loading = true
            return editStatus(row);
          })
          .then(res => {
            if (res.data.code == 200) {
              this.$message({
                message: res.data.msg,
                type: 'success'
              })
              this.getList()
            } else {
              this.$message({
                message: '操作失败',
                type: 'error'
              })
              this.loading = false
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
            this.loading = true
            return editStatus(row);
          })
          .then(res => {
            if (res.data.code == 200) {
              this.$message({
                message: res.data.msg,
                type: 'success'
              })
              this.getList()
            } else {
              this.$message({
                message: '操作失败',
                type: 'error'
              })
              this.loading = false
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
            this.loading = true
            return editStatus(row);
          })
          .then(res => {
            if (res.data.code == 200) {
              this.$message({
                message: res.data.msg,
                type: 'success'
              })
              this.getList()
            } else {
              this.$message({
                message: '操作失败',
                type: 'error'
              })
              this.loading = false
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
            this.loading = true
            return editStatus(row);
          })
          .then(res => {
            if (res.data.code == 200) {
              this.$message({
                message: res.data.msg,
                type: 'success'
              })
              this.getList()
            } else {
              this.$message({
                message: '操作失败',
                type: 'error'
              })
              this.loading = false
            }
          })
      }

    },
    //列表
    getList () {
      shejiList(this.current, this.size, { pname: this.biaoti }).then(res => {
        this.tableData = res.data.data
        this.total = res.data.data.total
        if (this.tableData.length > 0) {
          for (let i = 0; i < this.tableData.length; i++) {
            if (this.tableData[i].wjstatus == 0) {
              this.tableData[i].wjstatus = '停用'
            } else if (this.tableData[i].wjstatus == 1) {
              this.tableData[i].wjstatus = '启用'
            }

            if (this.tableData[i].fbstatus == 0) {
              this.tableData[i].fbstatus = '未发布'
            } else if (this.tableData[i].fbstatus == 1) {
              this.tableData[i].fbstatus = '已发布'
            }
          }
        }

        setTimeout(() => {
          this.loading = false
        }, 1000);
      })
    },
    //搜索
    handSetting () {
      this.loading = true
      if (this.gaibian) {
        this.current = 1
      }
      shejiList(this.current, this.size, { pname: this.biaoti }).then(res => {
        this.tableData = res.data.data
        this.total = res.data.data.total
        this.gaibian = false
        if (this.tableData.length > 0) {
          for (let i = 0; i < this.tableData.length; i++) {
            if (this.tableData[i].wjstatus == 0) {
              this.tableData[i].wjstatus = '停用'
            } else if (this.tableData[i].wjstatus == 1) {
              this.tableData[i].wjstatus = '启用'
            }

            if (this.tableData[i].fbstatus == 0) {
              this.tableData[i].fbstatus = '未发布'
            } else if (this.tableData[i].fbstatus == 1) {
              this.tableData[i].fbstatus = '已发布'
            }
          }
        }
        setTimeout(() => {
          this.loading = false
        }, 1000);
      })
    },
    handleSizeChange (val) {
      this.size = val
      this.loading = true
      this.getList()
    },
    handleCurrentChange (val) {
      this.current = val
      this.loading = true
      this.getList()
    },
    handleSelectionChange (val) {
      this.multipleSelection = val;
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
    closeck () {
      this.dialogFormVisible = false
    },
    closesp () {
      this.dialogFormVisiblesp = false
    },
    closespcg () {
      this.dialogFormVisiblesp = false
      this.loading = true
      this.getList()
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
            this.getList()
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
};
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

/deep/ .el-select>.el-input {
  width: 120px !important;
}

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
</style>
