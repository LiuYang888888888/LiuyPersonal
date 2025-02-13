<template>
  <basic-container>
    <HuilanBasicToolbar style="margin-top: 0;text-align: left;">
      <!-- <el-button type="primary" size="small" @click="comFormMagAdd">新增</el-button> -->
      <el-button
        type="primary"
        size="small"
        icon="el-icon-upload2"
        @click.stop="comFormMagIn()"
        >导入数据
      </el-button>
    </HuilanBasicToolbar>
    <avue-crud :option="listOption" :table-loading="loading" :data="listData" ref="listRef" v-model="listForm"
      :page.sync="page" :permission="permissionList" :before-open="beforeOpen" :before-close="beforeClose"
      @search-change="searchChange" @search-reset="searchReset" @selection-change="selectionChange"
      @current-change="currentChange" @size-change="sizeChange" @refresh-change="refreshChange" @on-load="onLoad">
      <template v-slot:menu="scope">
        <el-button type="text" size="small" @click="comFormMagView(scope.row)">下载
        </el-button>
      </template>
    </avue-crud>

    <HuilanDialog :title="dataMagFormTitle" :fullscreen="true" append-to-body :before-close="dataMagFormClose"
      :visible.sync="dataMagFormTag" class="dataMagFormClass">
      <div class="dataMagFormBody" v-if="verifyTab == 'VIEW'">
        <div class="CMF_MAIN">
          <div class="CMF_HEAD">
            <span>{{ formName }}</span>
          </div>
          <div class="CMF_BODY">
            <FormPreview id="dataMagFormView" ref="dataMagFormRef" :option="dataMagFormOption" :class="dataMagFormClass"
              :formTemplateFlatJson="dataMagFormFlatJson" :formTemplateOnetomanyFlatJson="formTemplateOnetomanyFlatJson"
              :data.sync="dataFormData" :formDataColumn="formDataColumn" :key="dataMagFormKey" />
          </div>
        </div>
        <div class="dataMagFormFooter">
          <div class="dataMagFormBtns">
            <el-button size="small" icon="el-icon-circle-plus-outline"
              v-if="dataMagFormSubBtnTag && (!formVerify || (formVerify && dataMagFormSubBtnTag))" type="primary"
              @click="dataMagFormSave" :loading="btnLoading">确 定
            </el-button>
            <el-button size="small" icon="el-icon-circle-close" @click="dataMagFormClose">取 消</el-button>
          </div>
        </div>
      </div>
    </HuilanDialog>

    <!--导入-->
    <HuilanDialog
      :title="dataInTitle"
      :fullscreen="false"
      width="660px"
      append-to-body
      :visible.sync="dataInTag"
    >
      <avue-form
        :class="inFormClass"
        :option="inFormOption"
        ref="inFormRef"
        v-model="inFormData"
        :key="inFormKey"
      >
        <template slot-scope="scope" slot="templateFile">
          <el-button
            type="primary"
            size="small"
            icon="el-icon-download"
            @click.stop="templateFileDown"
            >数据模板下载</el-button
          >
        </template>
        <template slot-scope="scope" slot="excelFile">
          <!-- <div>{{scope}}</div> -->
          <HuilanUploader
            class="upload-demo"
            v-model="inFormData.excelFile"
            :data="scope.column.data"
            :action="scope.column.action"
            :accept="scope.column.accept"
            :multiple="scope.column.multiple"
            :limit="scope.column.limit"
            :drag="scope.column.dragFile"
            :on-success="inFormUploadAfter"
            :on-error="inFormUploadError"
            :before-upload="inFormUploadBefore"
          >
            <i class="el-icon-upload"></i>
            <div class="el-upload__text">
              将文件拖到此处，或<em>点击上传</em>
            </div>
            <div class="el-upload__tip" slot="tip">{{ scope.column.tip }}</div>
          </HuilanUploader>
        </template>
      </avue-form>

      <template v-slot:footer>
        <!-- <el-button size="small" icon="el-icon-circle-plus-outline" type="primary" @click="dataInSave">确 定</el-button> -->
        <el-button size="small" icon="el-icon-circle-close" @click="dataInClose"
          >取 消</el-button
        >
      </template>
    </HuilanDialog>
  </basic-container>
</template>

<script>
import { mapGetters } from "vuex";
import { validatenull } from "@/util/validate";
import { baseURL } from "@/api/common";
import serviceList from "@/config/serviceList";
import {
  viewListData,
  getFromTemplateNewest,
  getFromTemplate,
  getListData,
  saveOrUpdateListData,
  delListData
} from "@/api/system/commonFormData";
import FormPreview from "@/components/formPreview";
import { isNull } from "@/util/qsgCommon";
export default {
  components: {
    FormPreview
  },
  data () {
    return {
      dataInTag:false,
      dataInTitle: "导入数据",
      inFormOption: {
        submitBtn: false,
        emptyBtn: false,
        labelWidth: 120,
        column: [
          {
            label: "下载数据模板",
            prop: "templateFile",
            span: 24,
            formslot: true,
          },
          {
            label: "选择文件",
            prop: "excelFile",
            span: 24,
            formslot: true,
            multiple: false,
            type: "upload",
            dragFile: true,
            data: {
              metaObjName: "",
              systemCode: "",
              templateVersionId: "",
            },
            propsHttp: {
              url: "url",
              name: "name",
              res: "data",
            },
            accept:"application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel",
            //fileSize: 512,
            limit: 1,
            tip: "只能上传格式为xls、xlsx等EXECL文件",
            action: `${baseURL}api/${serviceList.form}/baseMetaCommon/importExcel`,
            rules: [
              {
                required: true,
                message: "请上传数据文件",
                trigger: "blur",
              },
            ],
          },
        ],
      },
      verifyTab: "VIEW",
      dataMagFormOption: {
        submitBtn: false,
        emptyBtn: false,
        column: [],
      },
      dataMagFormClass: '',
      dataMagFormFlatJson: [],
      formTemplateOnetomanyFlatJson: {},
      dataFormData: {},
      formDataColumn: [],
      dataMagFormKey: 0,
      dataInitId: null,
      dataInitTemplateId: "",
      dataMagFormSubBtnTag: false,
      dataMagFormSubType: "add",
      btnLoading: false,
      dataMagFormTag: false,
      metObjName: "dyf_aicos_jungsz",
      systemCode: "AiCOS",

      templateId: "",
      formName: "通用表单",
      cmfCustData: "",
      isCustomTable: 0,

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
        menuTitle: '资料下载',
        height: 'auto',
        align: 'center',
        calcHeight: 210,
        searchShow: true,
        tip: false,
        border: true,
        addBtn: false,
        editBtn: false,
        delBtn: false,
        index: true,
        indexLabel: '序号',
        indexWidth: 100,
        viewBtn: false,
        selection: true,
        labelPosition: 'right',
        labelSuffix: '',
        labelWidth: 120,
        gutter: 0,
        menuPosition: 'center',
        isCustom: false,

        column: [
          {
            type: 'input',
            label: '资质名称',
            span: 16,
            display: true,
            hideLabel: false,
            prop: 'zizmc',
            isListDisplay: true,
            search: true
          },
          {
            type: 'textarea',
            label: '内容简介',
            span: 16,
            display: true,
            hideLabel: false,
            prop: 'narjj',
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
        toDoBtn: this.vaildData(
          this.permission[`sys-commonForm-dataMag-toDo`],
          false
        ),
        doneBtn: this.vaildData(
          this.permission[`sys-commonForm-dataMag-done`],
          false
        ),
        addMagBtn: this.vaildData(
          this.permission[`sys-commonForm-dataMag-add`],
          false
        ),
        kqtjBtn: this.vaildData(
          this.permission[`sys-commonForm-dataMag-kqtj`],
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
    await this.getActiveForm();
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
  methods: {
    //导入
    comFormMagIn() {
      this.inFormKey++;
      this.findObject(this.inFormOption.column, "excelFile").data.metaObjName =
        this.metObjName;
      this.findObject(this.inFormOption.column, "excelFile").data.systemCode =
        this.systemCode;
      this.findObject(
        this.inFormOption.column,
        "excelFile"
      ).data.templateVersionId = this.templateId;

      this.dataInTag = true;
    },
    dataInSave() {
      this.dataInTag = false;
    },
    dataInClose() {
      this.dataInTag = false;
    },

    async getActiveForm () {
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
      getListData(dataParam).then((res) => {
        const dataRes = res.data.data;
        this.page.total = dataRes.rspPage.totalItems;
        this.page.pageSize = dataRes.rspPage.size;
        this.page.currentPage = dataRes.rspPage.current;
        this.formName = dataRes.formName;
        this.listData = dataRes.fieldList;
        this.loading = false;
        this.selectionClear();
      });
    },
    //查看
    async comFormMagView (row /*, index*/) {
      this.verifyTab = "VIEW";
      this.btnLoading = false;
      this.dataMagFormSubType = "view";
      this.dataMagFormTag = true;
      this.dataMagFormTitle = "数据查看";
      this.dataInitTemplateId = row.template_version_id;
      this.dataInitId = row.id;
      await this.getTemplateVersion(this.dataInitTemplateId);
      this.dataFormData = await this.comFormMagDataInit(row);
      this.dataMagFormSubBtnTag = false;
      this.$set(this.dataMagFormOption, "boxType", "view");
    },

    //新增
    async comFormMagAdd () {
      this.verifyTab = "VIEW";
      this.btnLoading = false;

      this.dataMagFormTitle = "数据新增";
      this.dataMagFormClass = "";
      this.dataInitTemplateId = this.templateId;
      this.dataInitId = null;
      await this.getTemplateVersion(this.dataInitTemplateId);
      this.dataMagFormKey++;
      this.comFormMagItem("add");
      this.dataFormData = {};
      this.formDataColumn = [];
      this.dataMagFormSubBtnTag = true;
      this.dataMagFormSubType = "add";
      this.dataMagFormTag = true;

    },

    //编辑
    async comFormMagUpdate (row /*, index*/) {
      this.btnLoading = false;
      this.dataMagFormTitle = "数据编辑";
      this.dataMagFormClass = "";
      this.dataInitTemplateId = row.template_version_id;
      this.dataInitId = row.id;
      await this.getTemplateVersion(this.dataInitTemplateId);
      this.dataMagFormKey++;
      this.comFormMagItem("update");
      this.dataFormData = await this.comFormMagDataInit(row);
      this.dataMagFormSubBtnTag = true;
      this.dataMagFormSubType = "update";
      this.dataMagFormTag = true;
    },

    comFormMagItem (actionType) {
      const formItems = this.dataMagFormOption.column;
      formItems.map((item) => {
        //console.log(item)
        if (actionType == "view") {
          item.disabled = true;
        } else {
          item.disabled = false;
        }
      });
    },

    async comFormMagDataInit (row) {
      this.dataFormData = {};

      const dataResFun = await viewListData({
        id: row.id,
        metObjName: this.metObjName,
        systemCode: this.systemCode,
      });

      const dataRes = dataResFun.data.data;
      this.formDataColumn = dataRes.formDataColumn;
      return dataRes;
    },

    async getTemplateVersion (id) {
      const TemplateParam = {
        id: id ? id : this.templateId,
      };
      await getFromTemplate(TemplateParam).then(
        (res) => {
          const dataRes = res.data.data;
          this.dataMagFormOption = this.cutProps(
            JSON.parse(dataRes.formTemplateJson)
          );
          console.log(this.dataMagFormOption)
          this.dataMagFormFlatJson = JSON.parse(dataRes.formTemplateFlatJson);

          this.formTemplateOnetomanyFlatJson = JSON.parse(
            dataRes.formTemplateOnetomanyFlatJson
          );

          this.cmfCustData = this.htmlDecodeByRegExp(dataRes.desc);
        },
        (error) => {
          window.console.log(error);
        }
      );
    },
    cutProps (opt) {
      //console.log(opt);
      //将表单字典的label 处理成value 使其做完汉字存储
      opt.column.map((item) => {
        if (!validatenull(item.props)) {
          //console.log(item);
          item.props.value = item.props.label;
        }

        if (item.type == "dynamic") {
          //console.log('顶级的子表单')
          /*if( !isNull(item.children) ){

            if( !isNull(item.children.column) ){
              item.children.column.map((sobj)=>{
                if (!validatenull(sobj.props)) {
                  sobj.props.value = sobj.props.label;
                }
              })
            }

          }
          */
        }

        if (item.type == "table") {
          //console.log('顶级的table');
          for (let k in item.data) {
            for (let m in item.data[k]) {
              if (!isNull(item.data[k][m].children)) {
                item.data[k][m].children.map((sobj) => {
                  if (!validatenull(sobj.props)) {
                    sobj.props.value = sobj.props.label;
                  }
                });
              }
            }
          }
        }
      });

      if (!validatenull(opt.group)) {
        opt.group.map((item) => {
          if (!validatenull(item.column)) {
            item.column.map((tobj) => {
              if (!validatenull(tobj.props)) {
                //console.log(tobj);
                tobj.props.value = tobj.props.label;
              }

              if (tobj.type == "dynamic") {
                //console.log('group里的子表单')
              }

              if (tobj.type == "table") {
                //console.log('group里的table');
                for (let k in tobj.data) {
                  for (let m in tobj.data[k]) {
                    if (!isNull(tobj.data[k][m].children)) {
                      tobj.data[k][m].children.map((sobj) => {
                        if (!validatenull(sobj.props)) {
                          sobj.props.value = sobj.props.label;
                        }
                      });
                    }
                  }
                }
              }
            });
          }
        });
      }

      return opt;
    },
    htmlDecodeByRegExp (str) {
      let temp = "";
      if (validatenull(str)) return "";
      temp = str.replace(/&amp;/g, "&");
      temp = temp.replace(/&lt;/g, "<");
      temp = temp.replace(/&gt;/g, ">");
      temp = temp.replace(/&nbsp;/g, " ");
      // eslint-disable-next-line
      temp = temp.replace(/&#39;/g, "'");
      // eslint-disable-next-line
      temp = temp.replace(/&quot;/g, '"');
      return temp;
    },
    dataMagFormClose () {
      this.cmfCustData = "";
      this.dataMagFormClass = "";
      this.dataInitTemplateId = "";
      this.dataInitId = null;
      this.dataMagFormTag = false;
    },
    async dataMagFormSave () {
      this.$refs.dataMagFormRef.validate((valid /*msg*/) => {
        if (valid) {
          const dataMagFormDataJson =
            this.$refs.dataMagFormRef.buildSubmitData();
          const dataParam = {
            id: this.dataInitId,
            formTemplateVersionId: this.dataInitTemplateId
              ? this.dataInitTemplateId
              : this.templateId,
            formDataJson: dataMagFormDataJson,
          };

          saveOrUpdateListData(dataParam).then(
            (/*res*/) => {
              this.refreshChange();
              this.dataMagFormTag = false;
              this.cmfCustData = "";
              this.$message({
                type: "success",
                message: "操作成功!",
              });
            },
            (error) => {
              window.console.log(error);
              this.$refs.dataMagFormRef.$refs.form.allDisabled = false;
              this.cmfCustData = "";
            }
          );
        } else {
          window.console.log("error submit!!");
          //this.cmfCustData = "";
          return false;
        }
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
          const delParm = {
            ids: [row.id],
            metObjName: this.metObjName,
            systemCode: this.systemCode,
          };
          return delListData(delParm);
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