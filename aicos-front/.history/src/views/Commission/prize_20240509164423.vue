<template>
  <basic-container>
    <avue-crud :option="option" :table-loading="loading" :data="data" :page="page" :permission="permissionList"
      :before-open="beforeOpen" v-model="form" ref="crud" :upload-before="uploadBefore" :upload-after="uploadAfter"
      :upload-delete="uploadDelete" @row-update="rowUpdate" @row-save="rowSave" @row-del="rowDel"
      @search-change="searchChange" @search-reset="searchReset" @selection-change="selectionChange"
      @current-change="currentChange" @size-change="sizeChange" @on-load="onLoad">
      <template slot="menuLeft">
        <el-button type="primary" size="small" v-if="permission.projectmanage_zt" plain icon="el-icon-refresh"
          @click="handleBuild">设定项目状态
        </el-button>
      </template>
      <template slot-scope="scope" slot="menu">
        

        <el-button type="text" size="small" v-if="permission.projectmanage_start" plain class="none-border"
          icon="el-icon-check" @click.stop="handleDetail(scope.row)">
          <span v-if="scope.row.projectEnable == '启用'">停用</span>
          <span v-if="scope.row.projectEnable == '停用'">启用</span>
        </el-button>

        <el-button type="text" size="small" v-if="permission.projectmanage_manage" plain class="none-border"
          icon="el-icon-setting" @click.stop="handSetting(scope.row)">配置项管理
        </el-button>

        <el-button type="text" size="small" v-if="permission.projectmanage_manageview" plain class="none-border"
          icon="el-icon-view" @click.stop="handSettingview(scope.row)">查看配置项
        </el-button>

        <el-button type="text" size="small" v-if="permission.projectmanage_approval && scope.row.projectStatus < 2"
          plain class="none-border" icon="el-icon-circle-check" @click="approvalBtn(scope.row)">审核
        </el-button>

        <el-button type="text" size="small" v-if="permission.projectmanage_defeat && scope.row.projectStatus < 2" plain
          class="none-border" icon="el-icon-circle-close" @click="defeatBtn(scope.row)">驳回
        </el-button>

        <el-button type="text" size="small" v-if="permission.projectmanage_approvallist" plain class="none-border"
          icon="el-icon-tickets" @click="approvalList(scope.row)">审阅记录
        </el-button>

        <el-button type="text" size="small" v-if="permission.project_supplement" plain class="none-border"
          icon="el-icon-folder-add" @click="supplement(scope.row)">项目补录
        </el-button>
      </template>
    </avue-crud>
    <el-dialog title="批量设定项目状态" :visible.sync="dialogVisible" :append-to-body="true" width="30%"
      :before-close="handleClose">
      <div class="project-zt">
        <div class="project-zt-title">项目状态：</div>
        <el-select v-model="dictKey" clearable placeholder="请选择">
          <el-option v-for="item in options" :key="item.dictKey" :label="item.dictValue" :value="item.dictKey">
          </el-option>
        </el-select>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="ztsure">确 定</el-button>
      </span>
    </el-dialog>
    <el-dialog title="审核意见" :visible.sync="dialogFormVisible" :append-to-body="true">
      <el-input type="textarea" :rows="4" placeholder="请输入审核意见" v-model="textarea">
      </el-input>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="approvalsure">确 定</el-button>
      </div>
    </el-dialog>

    <el-dialog title="审阅记录" :visible.sync="dialogTableList" :append-to-body="true" :center="true">
      <el-table :data="gridData">
        <el-table-column property="approvalTime" label="审阅日期" width="150"></el-table-column>
        <el-table-column property="passdtxt" label="审阅结果" width="200"></el-table-column>
        <el-table-column property="auditContent" label="审阅意见"></el-table-column>
      </el-table>
    </el-dialog>

    <el-dialog title="项目补录" :visible.sync="dialogSummplent" :append-to-body="true" :center="true" width="90%">
      <div class="summplentAdd" @click="addSup">+</div>
      <div class="sup_content">
        <el-row type="flex" class="row-bg" v-for="(item, index) of summplentList" :key="index">
          <el-col :span="6">
            <div class="sup_main">
              <div class="date">年份:</div>
              <el-date-picker v-model="item.year" type="year" format="yyyy" value-format="yyyy"
                :picker-options="endDatePicker" placeholder="选择年份">
              </el-date-picker>
            </div>
          </el-col>
          <el-col :span="6">
            <div class="sup_main">
              <div class="date">月份:</div>
              <el-date-picker v-model="item.month" type="month" format="M" value-format="M"
                :picker-options="endDatePicker" placeholder="选择月份">
              </el-date-picker>
            </div>
          </el-col>
          <el-col :span="6">
            <div class="sup_main">
              <div class="title">固定投资:</div><el-input v-model="item.fixedInvestment" placeholder="请输入内容"></el-input>
              <div class="final">万元</div>
            </div>
          </el-col>
          <el-col :span="6">
            <div class="sup_main">
              <div class="title">流动投资:</div><el-input v-model="item.currentInvestment" placeholder="请输入内容"></el-input>
              <div class="final">万元</div>
            </div>
          </el-col>
        </el-row>
      </div>
      <div class="sup_btn">
        <el-button type="primary" plain @click="savesup">保存</el-button>
      </div>
    </el-dialog>
  </basic-container>
</template>

<script>
import { mapGetters } from "vuex";

export default {
  data () {
    return {
      dialogVisible: false,
      options: [],
      dictKey: '',
      form: {},
      endDatePicker: this.handelFixDate(),
      fixValue: null,
      supid: '',
      fixedInvestment: '',
      currentInvestment: '',
      dialogFormVisible: false,
      dialogTableList: false,
      dialogSummplent: false,
      gridData: [],
      subindex: 1,
      summplentList: [],
      supdate: '',
      textarea: '',
      nowrow: {},
      query: {},
      loading: true,
      page: {
        pageSize: 10,
        currentPage: 1,
        total: 0
      },
      selectionList: [],
      option: {
        indexLabel: '序号',
        align: 'center',
        menuAlign: 'center',
        height: 'auto',
        searchMenuSpan: 6,
        searchShow: true,
        tip: false,
        border: true,
        index: true,
        selection: true,
        menuWidth: 160,
        column: [
          {
            label: '项目名称',
            prop: 'projectName',
            search: true,
            labelWidth: 120,
            row: true,
          }, {
            label: '项目单位',
            prop: 'affiliatedUnit',
            search: true,
            labelWidth: 120,
            row: true,
          }, {
            label: '项目类型',
            prop: 'projectType',
            search: true,
            labelWidth: 120,
            row: true,
            type: "select",
            dicUrl: "/api/projecttypeconfig/list",
            props: {
              label: "projectType",
              value: "id",
              res: "data.records"
            },
          },
          {
            label: '项目类别',
            prop: 'itemType',
            type: "select",
            search: true,
            labelWidth: 120,
            row: true,
            dicUrl: "/api/blade-system/dict/dictionary?code=itemType",
            props: {
              label: "dictValue",
              value: "dictKey"
            },
          },
          {
            label: '项目状态',
            prop: 'itemStatus',
            type: "select",
            search: true,
            labelWidth: 120,
            row: true,
            dicUrl: "/api/blade-system/dict/dictionary?code=itemStatus",
            props: {
              label: "dictValue",
              value: "dictKey"
            },
          },
          {
            label: '项目金额',
            prop: 'projectAmount',
            labelWidth: 120,
            row: true,
            hide: true,
            append: '万元'
          }, {
            label: '资金来源',
            prop: 'sourceFunds',
            labelWidth: 120,
            row: true,
            hide: true,
            type: "checkbox",
            dicUrl: "/api/blade-system/dict/dictionary?code=source_funds",
            props: {
              label: "dictValue",
              value: "dictValue"
            },
            span: 24,
          }, {
            label: '项目负责人',
            prop: 'userName',
            labelWidth: 120,
            row: true,
          }, {
            label: '联系方式',
            prop: 'userPhone',
            labelWidth: 120,
            row: true,
          }, {
            label: '经办人',
            prop: 'agentName',
            labelWidth: 120,
            row: true,
          }, {
            label: '经办人联系方式',
            prop: 'agentPhone',
            labelWidth: 120,
            row: true,
          },
          // {
          //   label:'项目阶段',
          //   prop:'projectStages',
          //   labelWidth:120,
          //   type:"checkbox",
          //   all:true,
          //   span:24,
          //   dicUrl: "/api/stageconfig/list?category={{key}}",
          //   props: {    
          //     label: 'stageType',
          //     value: 'id',
          //     res:"data.records"
          //   },
          //   hide:true,
          // },
          {
            label: '项目介绍',
            prop: 'projectIntroduction',
            labelWidth: 120,
            span: 20,
            type: "textarea",
            hide: true,
          },
          // {
          //   label:'审阅单位',
          //   prop:'approval',
          //   labelWidth:120,
          //   row:true,
          //   type:"select",
          //   hide:true,
          //   dicData:approval
          // },
          {
            label: '状态',
            prop: 'projectStatus',
            labelWidth: 120,
            display: false,
            dicUrl: "/api/blade-system/dict/dictionary?code=project_status",
            props: {
              label: "dictValue",
              value: "dictKey"
            },
            value: '1'
          },
          {
            label: '状态',
            prop: 'projectEnable',
            labelWidth: 120,
            display: false,
            value: '启用',
            hide: true,
          }, {
            label: '创建日期',
            prop: 'createTime',
            type: "date",
            format: "yyyy-MM-dd",
            valueFormat: "yyyy-MM-dd",
            labelWidth: 120,
            display: false,
            rules: [{
              required: true,
              message: "请输入立项日期",
              trigger: "click"
            }]
          }, {
            label: "项目资料",
            prop: 'projectImg',
            type: 'upload',
            listType: 'picture-img',
            hide: true,
            span: 24,
            labelWidth: 120,
            propsHttp: {
              res: 'data',
              name: 'name',
              url: 'name'
            },
            action: '/api/projectmanage/uploadImg',
          }
        ],
      },
      data: []
    };
  },
  computed: {
    ...mapGetters(["permission", "userInfo"]),
    permissionList () {
      return {
        addBtn: this.vaildData(this.permission.projectmanage_add, false),
        viewBtn: this.vaildData(this.permission.projectmanage_view, false),
        delBtn: this.vaildData(this.permission.projectmanage_delete, false),
        editBtn: this.vaildData(this.permission.projectmanage_edit, false)
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
  methods: {
    //批量设定项目装填
    handleBuild () {
      if (this.selectionList.length === 0) {
        this.$message.warning("请选择至少一条数据");
        return;
      } else {
        this.dialogVisible = true
        zt().then(res => {
          this.options = res.data.data
        })
      }
    },
    ztsure () {
      for (let i in this.selectionList) {
        this.selectionList[i].itemStatus = this.dictKey
      }
      console.log(this.selectionList)
    },
    handelFixDate () {
      return {
        disabledDate (time) {
          let t = new Date().getDate();
          // 如果想包含本月本月 - 8.64e7 * t 就不需要了，
          // 如果想之前的不能选择把 > 换成 <
          return time.getTime() > Date.now() - 8.64e7 * t;
        },
      };
    },
    //审阅记录
    approvalList (item) {
      approvalList(1, 999, { projectId: item.id }).then(res => {
        for (let i in res.data.data.records) {
          if (res.data.data.records[i].passd == 1) {
            //res.data.data.records[i].passdtxt == '已审核'
            this.$set(res.data.data.records[i], 'passdtxt', '已审核')
          } else {
            this.$set(res.data.data.records[i], 'passdtxt', '已驳回')
            //res.data.data.records[i].passdtxt == '已驳回'
          }
        }
        this.gridData = res.data.data.records
        console.log(this.gridData)
      })
      this.dialogTableList = true
    },
    //审核
    approvalBtn (item) {
      item.passd = '1'
      item.projectId = item.id
      item.id = ''
      if (item.projectStages.length > 0) {
        item.projectStages = item.projectStages.join(',')
      } else {
        item.projectStages = ''
      }
      if (item.sourceFunds.length > 0) {
        item.sourceFunds = item.sourceFunds.join(',')
      } else {
        item.sourceFunds = ''
      }
      approvaladd(item).then(() => {
        this.onLoad(this.page);
        this.$message({
          type: "success",
          message: "审核通过!"
        });
      });
    },
    //驳回
    defeatBtn (item) {
      approvalDetail(item.id).then((res) => {
        if (res.data.data.auditContent) {
          this.textarea = res.data.data.auditContent
        } else {
          this.textarea = ''
        }
      });
      this.dialogFormVisible = true
      this.nowrow = item
    },
    //项目补录
    supplement (item) {
      listsup(1, 999, { projectId: item.id }).then(res => {
        if (res.data.data.records.length > 0) {
          this.summplentList = res.data.data.records
        } else {
          this.summplentList = [{ projectId: item.id, year: item.year, month: item.month, fixedInvestment: item.fixedInvestment, currentInvestment: item.currentInvestment }]
        }
      })
      this.supid = item.id
      this.dialogSummplent = true
    },
    //增加补录
    addSup () {
      if (this.summplentList.length > 0) {
        let len = this.summplentList.length - 1
        if (this.summplentList[len].year && this.summplentList[len].month && this.summplentList[len].fixedInvestment && this.summplentList[len].currentInvestment) {
          let obj = { projectId: this.supid, year: '', month: '', fixedInvestment: '', currentInvestment: '' }
          this.summplentList.push(obj)
        } else {
          this.$message({
            message: '请完整填写上一条信息！',
            type: 'warning'
          });
        }
      } else {
        this.$message({
          message: '请完整填写上一条信息！',
          type: 'warning'
        });
      }
    },
    savesup () {
      savesup(this.summplentList).then(() => {
        this.$message({
          type: "success",
          message: "保存成功!"
        });
        this.dialogSummplent = false
      });
    },
    approvalsure () {
      let item = this.nowrow
      item.passd = '2'
      item.projectId = item.id
      item.id = ''
      item.auditContent = this.textarea
      if (item.projectStages.length > 0) {
        item.projectStages = item.projectStages.join(',')
      } else {
        item.projectStages = ''
      }
      if (item.sourceFunds.length > 0) {
        item.sourceFunds = item.sourceFunds.join(',')
      } else {
        item.sourceFunds = ''
      }
      approvaladd(item).then(() => {
        this.onLoad(this.page);
        this.$message({
          type: "success",
          message: "项目驳回!"
        });
        this.dialogFormVisible = false
      });
    },
    //上传图片前
    uploadBefore (file, done) {
      //column.data.projectname = this.form.projectName
      done()
    },
    //图片上传后
    uploadAfter (res, done) {
      done()
    },
    //图片删除前
    uploadDelete (file) {
      return new Promise((resolve, reject) => {
        deleteimg(file).then(res => {
          resolve(res)
        }).catch(rej => {
          reject(rej)
        })
      })
    },
    handleDetail (item) {
      if (item.projectEnable == "启用") {
        this.$confirm("确定停用该项目?", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(() => {
          item.projectEnable = "停用"
          getStageList(1, 999, { category: item.projectType }).then(res => {
            let data = res.data.data.records
            let stagearr = []
            data.map(val => {
              stagearr.push(val.id)
            })
            if (stagearr.length > 0) {
              item.projectStages = stagearr.join(",");
            } else {
              item.projectStages = ''
            }
            item.sourceFunds = item.sourceFunds.join(",");
            return update(item);
          })
        })
          .then(() => {
            //this.onLoad(this.page);
            this.$message({
              type: "success",
              message: "操作成功!"
            });
          });
      } else {
        this.$confirm("确定启用该项目?", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(() => {
          item.projectEnable = "启用"
          getStageList(1, 999, { category: item.projectType }).then(res => {
            let data = res.data.data.records
            let stagearr = []
            data.map(val => {
              stagearr.push(val.id)
            })
            if (stagearr.length > 0) {
              item.projectStages = stagearr.join(",");
            } else {
              item.projectStages = ''
            }
            item.sourceFunds = item.sourceFunds.join(",");
            return update(item);
          })
        })
          .then(() => {
            //this.onLoad(this.page);
            this.$message({
              type: "success",
              message: "操作成功!"
            });
          });
      }
    },
    //配置项管理
    handSetting (item) {
      this.$router.push({ path: "/project_manage/myStage", query: { id: item.id } });
    },
    //查看配置项
    handSettingview (item) {
      this.$router.push({ path: "/project_manage/myStageView", query: { id: item.id } });
    },
    rowSave (row, done, loading) {
      getStageList(1, 999, { category: row.projectType }).then(res => {
        let data = res.data.data.records
        let stagearr = []
        data.map(val => {
          stagearr.push(val.id)
        })
        if (stagearr.length > 0) {
          row.projectStages = stagearr.join(",");
        } else {
          row.projectStages = ''
        }
        if (row.sourceFunds.length > 0) {
          row.sourceFunds = row.sourceFunds.join(",")
        } else {
          row.sourceFunds = ''
        }
        add(row).then(() => {
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
      })
    },
    rowUpdate (row, index, done, loading) {
      getStageList(1, 999, { category: row.projectType }).then(res => {
        let data = res.data.data.records
        let stagearr = []
        data.map(val => {
          stagearr.push(val.id)
        })
        if (stagearr.length > 0) {
          row.projectStages = stagearr.join(",");
        } else {
          row.projectStages = ''
        }
        if (typeof (row.sourceFunds) == 'object') {
          if (row.sourceFunds.length > 0) {
            row.sourceFunds = row.sourceFunds.join(",")
          } else {
            row.sourceFunds = ''
          }
        }

        update(row).then(() => {
          done();
          window.console.log(this.page);
          this.onLoad(this.page);
          this.$message({
            type: "success",
            message: "操作成功!"
          });
        }, error => {
          window.console.log(error);
          loading();
        });
      })
    },
    rowDel (row) {
      this.$confirm("确定将选择数据删除?", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          return remove(row.id);
        })
        .then(() => {
          this.onLoad(this.page);
          this.$message({
            type: "success",
            message: "操作成功!"
          });
        });
    },
    handleDelete () {
      if (this.selectionList.length === 0) {
        this.$message.warning("请选择至少一条数据");
        return;
      }
      this.$confirm("确定将选择数据删除?", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          return remove(this.ids);
        })
        .then(() => {
          this.onLoad(this.page);
          this.$message({
            type: "success",
            message: "操作成功!"
          });
          this.$refs.crud.toggleSelection();
        });
    },
    beforeOpen (done, type) {
      if (["edit", "view"].includes(type)) {
        getDetail(this.form.id).then(res => {
          this.form = res.data.data;
        });
      } else if (["add"].includes(type)) {
        setTimeout(() => {
          this.form.affiliatedUnit = this.userInfo.deptment
        }, 0);
      }
      done();
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
      this.$refs.crud.toggleSelection();
    },
    currentChange (currentPage) {
      this.page.currentPage = currentPage;
    },
    sizeChange (pageSize) {
      this.page.pageSize = pageSize;
    },
    onLoad (page, params = {}) {
      this.loading = true;
      // getList(page.currentPage, page.pageSize, Object.assign(params, this.query)).then(res => {
      //   const data = res.data.data;
      //   this.page.total = data.total;
      //   for (let i in data.records) {
      //     if (data.records[i].projectStages) {
      //       data.records[i].projectStages = data.records[i].projectStages.split(",")
      //     }
      //     if (data.records[i].sourceFunds) {
      //       data.records[i].sourceFunds = data.records[i].sourceFunds.split(",")
      //     }
      //   }
      //   this.data = data.records;
      //   this.loading = false;
      //   this.selectionClear();
      // });
    }
  }
};
</script>
<style scoped>
/deep/.el-table .cell {
  text-align: center;
}

.sup_content {
  max-height: 400px;
  overflow: auto;
}

.summplentAdd {
  width: 100px;
  font-size: 32px;
  color: #409EFF;
  text-align: center;
  padding-right: 20px;
  padding-bottom: 20px;
  cursor: pointer;
  margin-left: calc(100% - 100px);
}

.sup_main {
  display: flex;
}

.date {
  height: 40px;
  line-height: 40px;
  width: 60px;
  font-size: 14px;
  text-align: center;
}

.title {
  height: 40px;
  line-height: 40px;
  width: 140px;
  font-size: 14px;
  text-align: center;
}

.final {
  height: 40px;
  line-height: 40px;
  width: 60px;
  padding: 0 10px;
  font-size: 14px;
}

.sup_btn {
  text-align: center;
}

.project-zt {
  display: flex;
}

.project-zt-title {
  line-height: 40px;
}
</style>
<style>
.avue-upload__icon {
  line-height: 178px;
}
</style>
