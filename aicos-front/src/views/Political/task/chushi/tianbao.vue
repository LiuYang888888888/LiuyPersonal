<template>
  <basic-container>
    <el-tabs v-if="formVerify && !role" v-model="tabType" @tab-click="tabChange">
      <!-- <el-tab-pane name="ALL" v-if=" role2 == 2 ">
        <span slot="label"><i class="el-icon-s-order"></i> 我的</span>
      </el-tab-pane> -->
      <el-tab-pane name="TODO" v-if="permissionList.toDoBtn">
        <span slot="label"><i class="el-icon-s-management"></i> 待审核</span>
      </el-tab-pane>
      <el-tab-pane name="DONE" v-if="permissionList.doneBtn">
        <span slot="label"><i class="el-icon-s-claim"></i> 已审核</span>
      </el-tab-pane>
    </el-tabs>

    <HuilanBasicToolbar style="margin-top: 0;text-align: left;" v-if="role">
      <el-button type="primary" size="small" v-if="permissionList.addBtn" @click="handleAdd">新增</el-button>
    </HuilanBasicToolbar>

    <avue-crud :option="option" :table-loading="loading" :data="data" :page="page" :permission="permissionList"
      :before-open="beforeOpen" v-model="form" ref="crud" @row-update="rowUpdate" @row-save="rowSave" @row-del="rowDel"
      @search-change="searchChange" @search-reset="searchReset" @selection-change="selectionChange"
      @current-change="currentChange" @size-change="sizeChange" @on-load="onLoad" :upload-preview="uploadPreview">
      <template slot="menuLeft">
        <!-- <el-button type="danger" size="small" icon="el-icon-delete" plain v-if="permission.projectreport_delete"
          @click="handleDelete">删 除
        </el-button> -->
      </template>
      <template v-slot:menu="scope">
        <el-button type="text" size="small" v-if="permissionList.viewBtn && (tabType != 'TODO' || role)"
          @click="comFormMagview(scope.row,scope.index)">查看
        </el-button>
        <el-button type="text" size="small" v-if="permissionList.editBtn && (scope.row.fabzt == '草稿' || scope.row.fabzt == '审核不通过')"
          @click="comFormMagedit(scope.row,scope.index)">编辑
        </el-button>
        <el-button type="text" size="small" v-if="permissionList.shangbaoBtn &&  (scope.row.fabzt == '草稿' || scope.row.fabzt == '审核不通过')"
          @click="comFormMagShangbao(scope.row)">上报
        </el-button>
        <el-button type="text" size="small" v-if="permissionList.delBtn &&  (scope.row.fabzt == '草稿' || scope.row.fabzt == '审核不通过')"
          @click="comFormMagdel(scope.row)">删除
        </el-button>
        <el-button type="text" size="small" v-if="formVerify && tabType == 'TODO' && permissionList.shMagBtn"
          @click="comFormMagVerify(scope.row)">审核
        </el-button>
      </template>
    </avue-crud>

    <!--审核弹窗-->
    <HuilanDialog :title="dataMagFormTitle" :fullscreen="true" append-to-body :before-close="dataMagFormClose"
      :visible.sync="dataMagFormTag" class="dataMagFormClass">
      <el-tabs v-if="formVerify && (tabType == 'TODO' || tabType == 'DONE')" v-model="verifyTab"
        @tab-click="verifyChange">
        <el-tab-pane name="VIEW">
          <span slot="label"><i class="el-icon-s-operation"></i> 数据详情</span>
        </el-tab-pane>
        <el-tab-pane name="HISTORY" lazy>
          <span slot="label"><i class="el-icon-s-unfold"></i> 流转历史</span>
          <CirculationHistory v-if="verifyTab === 'HISTORY'" :processInstanceId="verifyParamData.processInstanceId" />
        </el-tab-pane>
        <el-tab-pane name="DIAGRAM" lazy>
          <span slot="label"><i class="el-icon-picture-outline"></i> 流程图</span>
          <DiagramView v-if="verifyTab === 'DIAGRAM'" :cur="verifyParamData" class="flow-view" />
        </el-tab-pane>
      </el-tabs>

      <div class="dataMagFormBody" v-if="verifyTab == 'VIEW'">
        <div class="CMF_MAIN">
          <div class="CMF_HEAD">
            <span>{{ formName }}</span>
          </div>
          <div class="CMF_BODY">
            <avue-form id="dataMagFormView" ref="dataMagFormRef" v-model="form" :option="option" v-if="showform" :upload-preview="uploadForm">
            </avue-form>
          </div>
        </div>
        <div class="dataMagFormFooter">
          <div v-if="formVerify && !role && tabType == 'TODO'" class="formVerifyClass">
            <el-input type="textarea" v-model="formVerifyText" placeholder="请输入审核意见" rows="4" />
          </div>
          <div class="dataMagFormBtns">
            <el-button size="small" icon="el-icon-check" v-if="formVerify && !role && tabType == 'TODO'" type="success" @click.stop="dataMagVerifyYes" :loading="btnLoading">审核通过
            </el-button>
            <el-button size="small" icon="el-icon-close"
              v-if="formVerify && !role && tabType == 'TODO'" type="warning"
              @click.stop="dataMagVerifyNo" :loading="btnLoading">审核不通过
            </el-button>
            <el-button size="small" icon="el-icon-circle-close" @click="dataMagFormClose">取 消</el-button>
          </div>
        </div>
      </div>
    </HuilanDialog>

  </basic-container>
</template>

<script>
import { mapGetters } from "vuex";
import { role } from "@/api/Political/common";
import {
  getList,
  getListSubmit,
  addSubmit,
  removeSubmit,
  updateSubmit,
  tijiaoSubmit,
  sbInfo,
  flowYes,
  flowNo
} from "@/api/Political/taskcom";
import {
  getFromTemplateNewest,
  getToDoListData,
  getFinishListData,
} from "@/api/system/commonFormData";
import FormPreview from "@/components/formPreview";
import DiagramView from "../../../system/commonForm/diagramView.vue";
import CirculationHistory from "../../../system/commonForm/circulationHistory";
export default {
  components: {
    DiagramView,
    CirculationHistory,
    FormPreview
  },
  data () {
    return {
      type:'',
      listinfo:[],

      rolename:'',
      role:false,

      btnLoading:false,
      tabType: "TODO",
      dataMagFormTitle: '审核',
      dataMagFormTag: false,
      formVerify: false,
      verifyParamData: {},
      verifyTab: "VIEW",
      metObjName:'dyf_aicos_gecstbrwlb',
      systemCode: 'AiCOS',
      formVerifyText:'',

      form: {},
      query: {},
      loading: true,
      page: {
        pageSize: 10,
        currentPage: 1,
        total: 0
      },
      selectionList: [],
      option: {
        height: 'auto',
        align: 'center',
        calcHeight: 210,
        searchShow: true,
        searchMenuSpan: 6,
        tip: false,
        border: true,
        index: true,
        indexLabel: '序号',
        indexWidth: 100,
        viewBtn: false,
        addBtn:false,
        delBtn: false,
        editBtn: false,
        selection: false,
        labelPosition: 'left',
        labelSuffix: '：',
        labelWidth: 120,
        gutter: 0,
        submitBtn: true,
        submitText: '提交',
        emptyBtn: true,
        emptyText: '清空',
        menuPosition: 'center',
        column: [
          {
            type: 'select',
            label: '标题',
            dicData: [],
            props: {
              label: 'biaot',
              value: 'id',
            },
            span: 24,
            display: true,
            hideLabel: false,
            prop: 'biaot',
            isListDisplay: true,
          },
          {
            label: '发布部门',
            span: 24,
            display: false,
            prop: 'fabbm',
          },
          {
            label: '发布状态',
            span: 24,
            display: false,
            prop: 'fabzt',
          },
          {
            label: '发布人',
            span: 24,
            display: false,
            prop: 'fabr',
          },
          {
            label: '发布时间',
            span: 24,
            display: false,
            prop: 'fabsj',
          },
          {
            type: 'textarea',
            label: '内容',
            span: 24,
            display: true,
            hideLabel: false,
            prop: 'nar',
            isListDisplay: true,
            hide:true,
          },
          {
            type: 'upload',
            label: '附件',
            span: 24,
            display: true,
            showFileList: true,
            multiple: false,
            limit: 1,
            action: '/aicos/api/aicos-file/miniofile/upload',
            propsHttp: {
              home: '/aicos',
              url: 'newFileName',
              name: 'objectName',
              res: 'data',
              fileName: 'file'
            },
            canvasOption: {},
            hideLabel: false,
            prop: 'fuj',
            isListDisplay: true,
            listType: 'text',
            data: {
              fromSystemName: 'base'
            },
            hide:true,
          }
        ],
      },
      data: []
    };
  },
  created() {
    this.list()
  },
  async mounted () {
    await this.getActiveForm();
    await this.roleInfo()
  },
  watch: {
    $route: "getActiveForm",
    "desktopWindow.data": {
      handler (/*newVal*/) {
        this.getActiveForm();
      },
      deep: true,
    },
    magParamsData: {
      handler (/*newVal*/) {
        //console.log(newVal)
        this.getActiveForm();
      },
      deep: true,
    },
  },
  computed: {
    ...mapGetters(["permission"]),
    permissionList () {
      return {
        toDoBtn: this.vaildData(
          this.permission[`sys-commonForm-dataMag-sb-toDo`],
          false
        ),
        doneBtn: this.vaildData(
          this.permission[`sys-commonForm-dataMag-sb-done`],
          false
        ),
        viewBtn: this.vaildData(
          this.permission[`sys-commonForm-dataMag-sb-view`],
          false
        ),
        delBtn: this.vaildData(
          this.permission[`sys-commonForm-dataMag-sb-del`],
          false
        ),
        addBtn: this.vaildData(
          this.permission[`sys-commonForm-dataMag-sb-add`],
          false
        ),
        editBtn: this.vaildData(
          this.permission[`sys-commonForm-dataMag-sb-edit`],
          false
        ),
        shangbaoBtn: this.vaildData(
          this.permission[`sys-commonForm-dataMag-sb-shangbao`],
          false
        ),
        shMagBtn: this.vaildData(
          this.permission[`sys-commonForm-dataMag-sb-sh`],
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
  methods: {
    async getActiveForm () {
      this.formVerifyText = "";
      this.verifyTab = "VIEW";
      await this.getTemplateNewestVersion(this.metObjName);
    },
    async getTemplateNewestVersion (thisObjName) {
      const dataResFun = await getFromTemplateNewest({
        metaObjName: thisObjName,
      });
      const dataRes = dataResFun.data.data;
      this.templateId = dataRes.id
      this.formVerify = dataRes.isAudit == 1 ? true : false;
    },
    async roleInfo () {
      const dataResFun = await role();
      const rolename = dataResFun.data.data[0].roleName
      this.rolename = rolename
      if (rolename.includes("政治部") || rolename.includes("处长")) {
        this.role = false
      } else {
        this.role = true
        this.onLoad(this.page);
      }
      if (!rolename.includes("处长") && !rolename.includes("政治部")) {
        this.role2 = 1
      }
      if (rolename.includes("处长")) {
        this.role2 = 2
      }
    },
    list(){
      const dataParam = {
        current:1,
        size: 20,
      };
      getList(dataParam).then(res => {
        this.option.column[0].dicData.push(...res.data.data.records)
        this.listinfo = res.data.data.records
      });
    },
    dataMagFormClose () {
      this.form = {}
      this.formVerifyText = ''
      this.cmfCustData = "";
      this.dataMagFormClass = "";
      this.dataInitTemplateId = "";
      this.dataInitId = null;
      this.dataMagFormTag = false;
    },
    uploadPreview(file){
      if(this.type == "view"){
        const http = window.location.protocol + "//"
        const url = window.location.host
        const url2 = http + url + file.url
        window.open(url2,'_self')
      }
    },
    uploadForm(file){
      const http = window.location.protocol + "//"
      const url = window.location.host
      const url2 = http + url + file.url
      window.open(url2,'_self')
    },
    async comFormMagview(row,index){
      if(this.role){
        this.$refs.crud.rowView(row, index);
      }else{
        this.showform = true
        this.verifyParamData = {
          taskId: row.aicos_task_id,
          processInstanceId: row.aicos_process_instance_id,
          processDefinitionId: row.aicos_process_definition_id,
          taskDefinitionKey: row.aicos_task_definition_key,
        };
        this.dataMagFormSubType = "view";
        this.dataMagFormTag = true;
        this.dataMagFormTitle = "数据查看";
        this.dataInitTemplateId = row.template_version_id;
        this.dataInitId = row.id;
        this.option.submitBtn = false
        this.option.emptyBtn = false
        this.option.column[0].disabled = true
        this.option.column[5].disabled = true
        this.option.column[6].disabled = true
        this.form = await this.formData(row);
        this.dataMagFormSubBtnTag = false;
      }
    },

    async formData(row){
      this.form = {}
      const params = new URLSearchParams();
      params.append("id",row.id);
      const dataResFun = await sbInfo(params);
      const dataRes = dataResFun.data.data;
      return dataRes
    },

    async comFormMagVerify (row) {
      this.btnLoading = false;
      this.showform = true
      this.formVerifyText = "";
      this.verifyTab = "VIEW";
      this.verifyParamData = {
        taskId: row.aicos_task_id,
        processInstanceId: row.aicos_process_instance_id,
        processDefinitionId: row.aicos_process_definition_id,
        taskDefinitionKey: row.aicos_task_definition_key,
      };
     
      this.dataInitTemplateId = row.template_version_id;
      this.dataInitId = row.id;
      this.dataMagFormSubBtnTag = false;
      this.option.submitBtn = false
      this.option.emptyBtn = false
      this.option.column[0].disabled = true
      this.option.column[5].disabled = true
      this.option.column[6].disabled = true
      this.form = await this.formData(row);
      this.dataMagFormTag = true;
    },

    comFormMagedit(row,index){
      this.$refs.crud.rowEdit(row, index)
    },
    comFormMagShangbao(row){
      this.$confirm("确定上报?", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(() => {
        return tijiaoSubmit({formDataId:row.id})
      })
        .then(() => {
          this.onLoad(this.page);
          this.$message({
            type: "success",
            message: "操作成功!"
          });
        })
    },
    handleAdd () {
      this.$refs.crud.rowAdd();
    },
    rowSave (row, done, loading) {
      if(row.fuj.length > 0){
        row.fuj = row.fuj[0].value
      }else{
        row.fuj = ''
      }
      row.guanlrwtzid = row.biaot
      addSubmit(row).then(() => {
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
    rowUpdate (row, index, done, loading) {
      if(Array.isArray(row.fuj)){
        row.fuj = row.fuj[0].value
      }
      updateSubmit(row).then(() => {
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
    comFormMagdel (row) {
      this.$confirm("确定将选择数据删除?", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          return removeSubmit(row.id);
        })
        .then(() => {
          this.onLoad(this.page);
          this.$message({
            type: "success",
            message: "操作成功!"
          });
        });
    },

    //审核通过
    async dataMagVerifyYes () {
      this.$refs.dataMagFormRef.validate((valid /*msg*/) => {
        if (valid) {
          this.btnLoading = true;
          const dataParam = {
            ...this.verifyParamData,
            passStatus: "agree",
            comment: this.formVerifyText,
            formDataId:this.dataInitId
          };
          flowYes(dataParam).then(
            (/*res*/) => {
              this.btnLoading = false;
              this.refreshChange();
              this.dataMagFormClose();
              this.showform = false
              this.$message({
                type: "success",
                message: "操作成功!",
              });
            },
            (error) => {
              window.console.log(error);
            }
          );
        } else {
          this.btnLoading = false;
        }
      });
    },
    //审核不通过
    async dataMagVerifyNo () {
      this.$refs.dataMagFormRef.validate((valid /*msg*/) => {
        if (valid) {
          this.btnLoading = true;
          const dataParam = {
            ...this.verifyParamData,
            passStatus: "closeForDisagree",
            comment: this.formVerifyText,
            formDataId:this.dataInitId,
          };
          flowNo(dataParam).then(
            (/*res*/) => {
              this.btnLoading = false;
              this.refreshChange();
              this.dataMagFormClose();
              this.showform = false
              this.$message({
                type: "success",
                message: "操作成功!",
              });
            },
            (error) => {
              window.console.log(error);
            }
          );
        } else {
          this.btnLoading = false;
        }
      });
    },

    // handleDelete () {
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
    //       return remove(this.ids);
    //     })
    //     .then(() => {
    //       this.onLoad(this.page);
    //       this.$message({
    //         type: "success",
    //         message: "操作成功!"
    //       });
    //       this.$refs.crud.toggleSelection();
    //     });
    // },
    async refreshChange () {
      this.onLoad(this.page, this.query);
    },
    beforeOpen (done, type) {
      this.type = type
      this.initData();
      done();
    },
    initData (/*type*/) {},
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
    tabChange () {
      this.query = {};
      this.page.currentPage = 1;
      this.onLoad(this.page);
    },
    async onLoad (page) {
      this.loading = false;
      if(this.role){
        const dataParam = {
          current: page.currentPage,
          size: page.pageSize,
          ...this.query
        };
        getListSubmit(dataParam).then(res => {
          const data = res.data.data;
          this.page.total = data.total;
          this.data = data.records;
          this.loading = false;
          this.selectionClear();
        });
      }else{
        if (this.tabType == "TODO") {
          const dataParam = {
            metaObjName: this.metObjName,
            templateVersionId: this.templateId,
            systemCode: this.systemCode,
            reqPage: {
              current: page.currentPage,
              size: page.pageSize,
            },
            searchParam: {
              ...this.query,
            },
          };
          getToDoListData(dataParam).then(res => {
            const dataRes = res.data.data;
            this.page.total = dataRes.rspPage.totalItems;
            this.page.pageSize = dataRes.rspPage.size;
            this.page.currentPage = dataRes.rspPage.current;
            this.data = dataRes.fieldList;
            this.loading = false;
            this.selectionClear();
          });
        } else if (this.tabType == "DONE") {
          const dataParam = {
            metaObjName: this.metObjName,
            templateVersionId: this.templateId,
            systemCode: this.systemCode,
            reqPage: {
              current: page.currentPage,
              size: page.pageSize,
            },
            searchParam: {
              ...this.query,
            },
          };
          getFinishListData(dataParam).then(res => {
            const dataRes = res.data.data;
            this.page.total = dataRes.rspPage.totalItems;
            this.page.pageSize = dataRes.rspPage.size;
            this.page.currentPage = dataRes.rspPage.current;
            this.data = dataRes.fieldList;
            this.loading = false;
            this.selectionClear();
          });
        } 
      }
    }
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
.newCss {
  position: relative;
  height: 100%;

  .search-from-tool {
    margin-right: 0;

    /deep/.el-form-item__content {
      line-height: 1px;
    }

    /deep/.el-button--small {
      padding: 5px;

      i {
        font-size: 20px;
      }
    }
  }

  .menuTitle {
    position: absolute;
    top: 85px;
    left: 40px;
    font-size: 22px;
    font-weight: 500;
    z-index: 2;
  }

  .menuTitleV {
    position: absolute;
    top: 35px;
    left: 40px;
    font-size: 22px;
    font-weight: 500;
    z-index: 2;
  }

  /deep/.avue-crud__search .avue-form__group {
    justify-content: flex-end;
  }

  /deep/.avue-crud__search .avue-form__menu {
    width: 240px;
  }

  /deep/.el-card__body .avue-crud__menu {
    justify-content: flex-end;
  }

  /deep/.rightSearch .avue-form__group {
    justify-content: flex-end;
  }

  /deep/.rightSearch .avue-form__menu {
    width: 240px;
  }

  /deep/.rightSearch .avue-array {
    display: flex;
    justify-content: space-between;
  }

  /deep/.rightSearch .avue-array:after {
    content: "-";
    display: block;
    width: 30px;
    height: 30px;
    order: 2;
    text-align: center;
  }

  /deep/.rightSearch .avue-array> :first-child {
    order: 1;
  }

  /deep/.rightSearch .avue-array> :last-child {
    order: 3;
  }

  /deep/.rightSearch .avue-array .el-button {
    display: none;
  }

  /deep/.el-table__header-wrapper {
    background-color: #fafafa;
  }
}

.flow-view {
  height: calc(100vh - 175px);
}

.CMF_BODY {
  /deep/ .dynamic-print-table {
    width: 100%;
    border: 1px solid #ebeef5;
    border-collapse: collapse;
    table-layout: fixed;
    display: none;

    td,
    th {
      border: 1px solid #ebeef5;
      height: 49px;

      &:first-child {
        width: 50px;
        text-align: center;
      }
    }
  }

  @media print {
    /deep/.avue-dynamic {
      .avue-crud {
        display: none;
      }

      .dynamic-print-table {
        display: table;
      }
    }
  }
}

.kqtitle {
  display: flex;
  height: 60px;
  width: 500px;
  line-height: 60px;
  margin: 40px auto;
}

.cstitle {
  height: 60px;
  width: 100%;
  line-height: 60px;
  text-align: center;
  margin: 40px auto 0;
  font-size: 18px;
  font-weight: 600;
}

.kqtxt {
  font-size: 18px;
  width: 80px;
}

.listadd {
  width: 60%;
  margin: 0 auto 40px;
  text-align: right;
}

.footer {
  width: 200px;
  margin: 200px auto 0;
  display: flex;
}

.csfooter {
  width: 100%;
  margin: 200px auto 0;
  text-align: center;
}

.csdate {
  width: 100%;
  text-align: center;
  height: 30px;
  line-height: 30px;
  margin: 0 auto 40px;
  font-size: 16px;
}

.table tr {
  height: 40px;
}

.table tr td {
  line-height: 40px;
  text-align: center;
}

.zhushi {
  width: 100%;
  text-align: center;
  height: 30px;
  line-height: 30px;
  font-size: 14px;
}

.hzTop {
  width: 100%;
  display: flex;
  justify-content: space-between;
}

.hztitle {
  margin-left: 10%;
}

.jidu {
  margin-right: 10%;
}

/deep/ .el-input.is-disabled .el-input__inner {
  color: #000 !important;
}
</style>
