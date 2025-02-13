<template>
  <HuilanBasic>
    <avue-crud :option="option" :table-loading="loading" :data="data" :page="page" :permission="permissionList"
      :before-open="beforeOpen" v-model="form" ref="crud" :upload-before="uploadBefore" :upload-after="uploadAfter"
      :upload-delete="uploadDelete" @row-update="rowUpdate" @row-save="rowSave" @row-del="rowDel"
      @search-change="searchChange" @search-reset="searchReset" @selection-change="selectionChange"
      @current-change="currentChange" @size-change="sizeChange" @on-load="onLoad">
    </avue-crud>
  </HuilanBasic>
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
    ...mapGetters(["permission""]),
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
