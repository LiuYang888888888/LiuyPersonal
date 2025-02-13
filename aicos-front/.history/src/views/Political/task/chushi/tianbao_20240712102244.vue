<template>
  <basic-container>
    <el-tabs v-if="formVerify" v-model="tabType" @tab-click="tabChange">
      <el-tab-pane name="ALL">
        <span slot="label"><i class="el-icon-s-order"></i> 我的</span>
      </el-tab-pane>
      <el-tab-pane name="TODO" v-if="permissionList.toDoBtn">
        <span slot="label"><i class="el-icon-s-management"></i> 待审核</span>
      </el-tab-pane>
      <el-tab-pane name="DONE" v-if="permissionList.doneBtn">
        <span slot="label"><i class="el-icon-s-claim"></i> 已审核</span>
      </el-tab-pane>
    </el-tabs>

    <HuilanBasicToolbar style="margin-top: 0;text-align: left;" v-if="tabType == 'ALL'">
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
        <el-button type="text" size="small" v-if="permissionList.viewBtn"
          @click="comFormMagview(scope.row,scope.index)">查看
        </el-button>
        <el-button type="text" size="small" v-if="permissionList.editBtn"
          @click="comFormMagedit(scope.row,scope.index)">编辑
        </el-button>
        <el-button type="text" size="small" v-if="permissionList.shangbaoBtn"
          @click="comFormMagShangbao(scope.row)">上报
        </el-button>
        <el-button type="text" size="small" v-if="permissionList.delBtn"
          @click="comFormMagdel(scope.row)">删除
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
            <avue-form id="dataMagFormView" ref="dataMagFormRef" v-model="form5" :option="option5" v-if="showform">
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
import {
  getList,
  getListSubmit,
  addSubmit,
  removeSubmit,
  updateSubmit,
  tijiaoSubmit,
} from "@/api/Political/taskcom";
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

      tabType: "ALL",
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
  computed: {
    ...mapGetters(["permission"]),
    permissionList () {
      return {
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
    list(){
      const dataParam = {
        current:1,
        size: 20,
      };
      getList(dataParam).then(res => {
        this.option.column[0].dicData.push(...res.data.data.records)
      });
    },
    uploadPreview(file){
      if(this.type == "view"){
        const http = window.location.protocol + "//"
        const url = window.location.host
        const url2 = http + url + file.url
        window.open(url2,'_self')
      }
    },
    comFormMagview(row,index){
      this.$refs.crud.rowView(row, index)
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

    beforeOpen (done, type) {
      this.type = type
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
    tabChange () {
      this.query = {};
      this.page.currentPage = 1;
      this.onLoad(this.page);
    },
    onLoad (page) {
      this.loading = false;
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
    }
  }
};
</script>

<style></style>
