<template>
  <HuilanBasic>
    <HuilanBasicToolbar style="margin-top: 0">
      <el-button
        v-if="permissionList.addBtn"
        type="primary"
        size="small"
        @click="handleAdd"
        >新增</el-button
      >
    </HuilanBasicToolbar>
    <HuilanBasicSearchbar
      :model="searchForm"
      :fields="searchFieldList"
      @reset="searchReset"
      @search="searchChange"
    >
      <template v-slot:appendTool>
        <el-button type="default" @click="configColumn"
          ><i class="el-icon-s-operation"></i
        ></el-button>
      </template>
    </HuilanBasicSearchbar>
    <avue-crud
      :option="option"
      :search.sync="query"
      :table-loading="loading"
      :data="data"
      ref="crud"
      v-model="form"
      :permission="permissionList"
      @row-del="rowDel"
      @row-update="rowUpdate"
      @row-save="rowSave"
      :before-open="beforeOpen"
      :page.sync="page"
      @current-change="currentChange"
      @size-change="sizeChange"
      @refresh-change="refreshChange"
      @on-load="onLoad"
    >
      <!--      <template v-slot:menuLeft>-->
      <!--        <el-button @click="changeList">切换表单(当前：{{formType}})</el-button>-->
      <!--      </template>-->
      <template slot-scope="scope" slot="menu">
        <el-button
          type="text"
          icon="el-icon-edit-outline"
          size="small"
          v-if="permissionList.design"
          @click.stop="designForm(scope.row, scope.index)"
          >表单设计
        </el-button>
        <el-button
          type="text"
          icon="el-icon-position"
          size="small"
          v-if="permissionList.publish"
          :disabled="scope.row.status === '1'"
          @click.stop="publishForm(scope.row, scope.index)"
          >发布表单
        </el-button>
        <el-button
          type="text"
          icon="el-icon-tickets"
          size="small"
          v-if="permissionList.version"
          @click.stop="showVersionList(scope.row, scope.index)"
          >版本查看
        </el-button>
        <!--        <el-button-->
        <!--          type="text"-->
        <!--          icon="el-icon-circle-plus-outline"-->
        <!--          size="small"-->
        <!--          v-if="permissionList.enableLock"-->
        <!--          @click.stop="lock(scope.row,scope.index)"-->
        <!--        >{{scope.row.is_lock === '0' ? '锁定' : '解锁'}}-->
        <!--        </el-button>-->
      </template>
      <template v-slot:menu="scope">
        <HuilanBasicActionTool
          :actions="getRowActions(scope.row)"
          @command="handleCommand($event, scope.row, scope.index)"
        />
      </template>
    </avue-crud>
    <HuilanDialog
      title="表单设计"
      :fullscreen="true"
      append-to-body
      class="form-design-dialog"
      :visible.sync="designDialogVisible"
    >
      <avue-form-design
        ref="formDesign"
        v-if="designDialogVisible"
        :options="curFormJson"
        :field-scope="useableFields"
        :default-values="canUseDefaultVal"
        :uploadBgUrl="uploadBgUrl"
        :getUploadBgHeader="getUploadBgHeader"
        :loadDicData="loadDicData"
        :dictItemUrl="dictItemUrl"
        :type="curForm.type"
        hiddenDynamic
      />
      <template v-slot:footer>
        <el-button size="small" type="primary" @click="saveFormDesign"
          >确 定</el-button
        >
        <el-button size="small" @click="designDialogVisible = false"
          >取 消</el-button
        >
      </template>
    </HuilanDialog>

    <HuilanDialog
      title="版本查看"
      append-to-body
      :visible.sync="versionDialogVisible"
    >
      <PublishedFormMgr v-if="versionDialogVisible" :code="curForm.code" />
      <template v-slot:footer>
        <!--        <el-button size="small" type="primary" @click="saveFormDesign">关闭</el-button>-->
        <el-button size="small" @click="versionDialogVisible = false"
          >关闭</el-button
        >
      </template>
    </HuilanDialog>
  </HuilanBasic>
</template>

<script>
import PublishedFormMgr from "./publishedForm";
import { mapGetters } from "vuex";
// import { getObjType } from '@/util/util'
import {
  getList,
  add,
  update,
  remove,
  publish,
  getUseableFieldsList,
  getFormDictUrl,
  createDicRequest,
} from "@/api/system/form";
import { getRules } from "@/util/regx";
import { baseURL, getUploadUrl } from "@/api/common";
import serviceList from "@/config/serviceList";
import buildSubmitFieldsData from "./mixins/buildSubmitFieldsData";

import website from "@/config/website";
import { getToken } from "@/util/auth";

const { system } = serviceList;

export default {
  name: "FormMgr",
  components: {
    PublishedFormMgr,
  },
  mixins: [buildSubmitFieldsData],
  data() {
    return {
      form: {
        // type: 'system'
      },
      query: {},
      loading: false,
      data: [],
      page: {
        pageSize: 10,
        currentPage: 1,
        total: 0,
      },
      option: {
        header: false,
        tip: false,
        searchShow: true,
        searchMenuSpan: 6,
        border: true,
        index: true,
        // selection: true,
        viewBtn: false,
        editBtn: false,
        delBtn: false,
        addBtn: false,
        menuWidth: 280,
        dialogClickModal: false,
        dialogWidth: "40%",
        dialogType: "drawer",
        dialogCustomClass: "huilan-drawer-form",
        column: [
          {
            label: "名称",
            prop: "name",
            span: 24,
            maxlength: 50,
            showWordLimit: true,
            // search: true,
            rules: [
              {
                required: true,
                message: "请输入表单名称",
                trigger: "blur",
              },
              ...getRules(["charNumHanUnderline"]),
            ],
          },
          {
            label: "编码",
            prop: "code",
            span: 24,
            // search: true,
            editDisabled: true,
            showWordLimit: true,
            maxlength: 50,
            rules: [
              {
                required: true,
                message: "请输入编码",
                trigger: "blur",
              },
              {
                pattern: /^[a-zA-Z]/,
                message: "首字母必须为字母",
                trigger: "blur",
              },
              ...getRules(["charNum"]),
            ],
          },

          {
            label: "使用系统",
            prop: "systemCode",
            type: "select",
            editDisabled: true,
            dicUrl: `${baseURL}api/${system}/baseAppstore/product/listAll`,
            dicMethod: "post",
            dicQuery: {
              type: 0,
              origin: 0,
              current: 1,
              isSupportSystemForm: 1,
            },
            dicFormatter(data) {
              const list = [{ name: "AiCOS", systemCode: "AiCOS" }];
              list.push(...data.data);
              return list;
            },
            props: {
              label: "name",
              value: "systemCode",
              desc: "description",
            },
            value: "AiCOS",
            rules: [{ required: true, message: "请选择使用系统" }],
          },
          // {
          //   label: "表单类型",
          //   prop: "type",
          //   span: 24,
          //   // display: false,
          //   type: "radio",
          //   dicData: [
          //     {
          //       label: "系统表单",
          //       value: 'system'
          //     },
          //     {
          //       label: "自定义表单",
          //       value: 'custom'
          //     }
          //   ],
          //   value: 'system'
          // },
          // {
          //   label: "表单路径",
          //   prop: "url",
          //   span: 24,
          //   display: false,
          //   rules: [{
          //     required: false,
          //     message: "请输入表单路径",
          //     trigger: "blur"
          //   }]
          // },
          {
            label: "发布状态",
            prop: "status",
            type: "radio",
            span: 24,
            // search: true,
            addDisplay: false,
            editDisplay: false,
            dicData: [
              {
                label: "草稿",
                value: "0",
              },
              {
                label: "已发布",
                value: "1",
              },
            ],
          },
          {
            label: "更新时间",
            prop: "updateTime",
            span: 24,
            addDisplay: false,
            editDisplay: false,
          },
          {
            label: "描述",
            prop: "remark",
            span: 24,
            type: "textarea",
            align: "right",
            width: 80,
            hide: true,
            maxlength: 100,
            showWordLimit: true,
            rules: getRules(["expectSpecials"]),
          },
        ],
      },
      designDialogVisible: false,
      curForm: {},
      defaultValues: {
        input: [
          {
            label: "创建者",
            value: "${CreaterAccount}",
          },
          {
            label: "创建者姓名",
            value: "${CreaterRealname}",
          },
          {
            label: "创建者部门",
            value: "${CreaterDept}",
          },
          {
            label: "创建者电话",
            value: "${CreaterMobile}",
          },
          {
            label: "处理人",
            value: "${UpdaterAccount}",
          },
          {
            label: "处理人姓名",
            value: "${UpdaterRealname}",
          },
          {
            label: "处理人部门",
            value: "${UpdaterDept}",
          },
          {
            label: "处理人电话",
            value: "${UpdaterMobile}",
          },
          {
            label: "流水号",
            value: "${SerialNumber}",
          },
        ],
        date: [
          {
            label: "创建时间",
            value: "${CreaterDatetime}",
          },
          {
            label: "处理时间",
            value: "${UpdaterDatetime}",
          },
        ],
      },
      useableFields: [],
      curFormJson: {},
      versionDialogVisible: false,
      formType: "system",
      uploadBgUrl: getUploadUrl(),
      dictItemUrl: "",
      loadDicData: null,
      searchForm: {
        code: "",
        name: "",
        status: "",
      },
      searchFieldList: [
        {
          prop: "name",
          placeholder: "请输入名称",
        },
        {
          prop: "code",
          placeholder: "请输入编码",
        },
        {
          type: "select",
          prop: "status",
          placeholder: "请选择发布状态",
          dicData: [
            {
              label: "草稿",
              value: "0",
            },
            {
              label: "已发布",
              value: "1",
            },
          ],
        },
      ],
    };
  },
  computed: {
    ...mapGetters(["permission"]),
    permissionList() {
      return {
        addBtn: this.vaildData(
          this.permission["system-formtemplate-save"],
          false
        ),
        viewBtn: this.vaildData(
          this.permission["system-formtemplate-view"],
          false
        ),
        delBtn: this.vaildData(
          this.permission["system-formtemplate-delete"],
          false
        ),
        editBtn: this.vaildData(
          this.permission["system-formtemplate-update"],
          false
        ),
        design: this.vaildData(
          this.permission["system-formtemplate-design"],
          false
        ),
        publish: this.vaildData(
          this.permission["system-formtemplate-publish"],
          false
        ),
        version: this.vaildData(
          this.permission["system-formtemplate-version"],
          false
        ),
      };
    },
    canUseDefaultVal() {
      const map = {
        system: this.defaultValues,
        dynamic: {},
      };
      return map[this.formType];
    },
  },
  // watch: {
  //   'form.type'(newVal) {
  //     const urlCol = this.findObject(this.option.column, 'url')
  //     if(newVal === 'custom') {
  //       urlCol.display = true
  //       urlCol.rules[0].required = true
  //     }else {
  //       urlCol.display = false
  //       urlCol.rules[0].required = false
  //     }
  //   }
  // },
  methods: {
    getRowActions(row) {
      const map = {
        viewBtn: {
          name: "查看",
          command: "rowView",
        },
        delBtn: {
          name: "删除",
          command: "rowDel",
        },
        editBtn: {
          name: "编辑",
          command: "rowEdit",
        },
        design: {
          name: "表单设计",
          command: "designForm",
        },
        publish: {
          name: "发布表单",
          command: "publishForm",
          disabled: row.status === "1",
        },
        version: {
          name: "版本查看",
          command: "showVersionList",
        },
      };
      const list = [
        "viewBtn",
        "editBtn",
        "delBtn",
        "design",
        "publish",
        "version",
      ];
      const actions = [];

      list.forEach((item) => {
        if (this.permissionList[item]) {
          actions.push(map[item]);
        }
      });
      return actions;
    },
    handleCommand(command, row, index) {
      const crud = this.$refs.crud;
      const cruddActions = ["rowView", "rowEdit", "rowDel"];
      if (cruddActions.includes(command)) {
        crud[command](row, index);
      } else {
        this[command](row, index);
      }
    },
    configColumn() {
      this.$refs.crud.$refs.dialogColumn.columnBox = true;
    },
    handleAdd() {
      this.$refs.crud.rowAdd();
    },
    rowSave(row, done, loading) {
      add(row).then(
        () => {
          // 获取新增数据的相关字段
          // const data = res.data.data;
          // row.id = data.id;
          this.$message({
            type: "success",
            message: "操作成功!",
          });
          // 数据回调进行刷新
          this.onLoad(this.page);
          done();
        },
        (error) => {
          window.console.log(error);
          loading();
        }
      );
    },
    rowUpdate(row, index, done, loading) {
      update(row).then(
        () => {
          this.$message({
            type: "success",
            message: "操作成功!",
          });
          // 数据回调进行刷新
          this.onLoad(this.page);
          done();
        },
        (error) => {
          window.console.log(error);
          loading();
        }
      );
    },
    rowDel(row, index, done) {
      this.$confirm("确定将选择数据删除?", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          return remove(row.id);
        })
        .then(() => {
          this.$message({
            type: "success",
            message: "操作成功!",
          });
          // 数据回调进行刷新
          this.onLoad(this.page);
          done();
        });
    },
    beforeOpen(done, type) {
      if (["add"].includes(type)) {
        this.form.type = "system";
        this.form.formJson = "";
      }
      // if (["edit", "view"].includes(type)) {
      //   // getDept(this.form.id).then(res => {
      //   //   this.form = res.data.data;
      //   // });
      // }
      done();
    },
    searchReset() {
      this.query = {};
      // this.parentId = 0;
      this.onLoad(this.page);
    },
    searchChange() {
      this.query = {
        ...this.searchForm,
      };
      this.page.currentPage = 1;
      this.onLoad(this.page);
    },
    currentChange(currentPage) {
      this.page.currentPage = currentPage;
    },
    sizeChange(pageSize) {
      this.page.pageSize = pageSize;
    },
    refreshChange() {
      this.onLoad(this.page, this.query);
    },
    onLoad(page, params = {}) {
      const pageConf = {
        current: page.currentPage,
        size: page.pageSize,
        type: this.formType,
      };
      this.loading = true;
      const queryData = Object.assign(params, this.query, pageConf);
      // 后台为int类型，不能传空字符串
      if (queryData.status === "") {
        Reflect.deleteProperty(queryData, "status");
      }
      getList(queryData).then((res) => {
        const data = res.data.data;
        this.loading = false;
        this.data = data.records;
        this.page.total = data.total;
      });
    },
    async getUseableFields({ systemCode, code }) {
      const params = {
        type: this.formType,
        systemCode,
        code,
      };
      const {
        data: { data },
      } = await getUseableFieldsList(params);

      this.useableFields = data;
    },
    async designForm(row) {
      this.curForm = row;
      if (row.formTemplateJson) {
        this.curFormJson = JSON.parse(row.formTemplateJson);
      } else {
        this.curFormJson = { column: [] };
      }
      await this.getUseableFields(row);
      if (row.systemCode === "AiCOS") {
        this.loadDicData = createDicRequest(
          "/aicos/api/aicos-system/baseDict/listPage"
        );
        this.dictItemUrl =
          "/aicos/api/aicos-system/baseDict/getDictItemListByDictCode";
      } else {
        const params = {
          systemCode: row.systemCode,
          key: "rmethod_dictListPage",
          // key: 'rmethod_dictItemListPage'
        };
        // 获取字典列表的地址
        const {
          data: { data: dicUrl },
        } = await getFormDictUrl(params);

        this.loadDicData = createDicRequest(dicUrl);

        const paramsItem = {
          systemCode: row.systemCode,
          // key: 'rmethod_dictListPage'
          key: "rmethod_dictItemListPage",
        };
        // 获取某一个字典的字典项的地址
        const {
          data: { data: dicItemUrl },
        } = await getFormDictUrl(paramsItem);

        this.dictItemUrl = dicItemUrl;
      }

      this.designDialogVisible = true;
    },

    async saveFormDesign() {
      const formData = await this.$refs.formDesign.getData();

      const trans = this.buidSubmitData(formData);

      // return
      const submitData = {
        ...this.curForm,
        // 表单自定义展示还是使用系统设计的展示方式
        type: formData.isCustom ? "custom" : "system",
        url: formData.custom,
        ...trans,
      };

      update(submitData).then(
        () => {
          this.$message({
            type: "success",
            message: "操作成功!",
          });
          // 数据回调进行刷新
          this.onLoad(this.page);
          this.designDialogVisible = false;
        },
        (error) => {
          window.console.log(error);
        }
      );
    },
    publishForm(row) {
      this.$confirm("确定发布表单?", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          return publish(row.id);
        })
        .then(() => {
          this.$message({
            type: "success",
            message: "发布成功!",
          });
          // 数据回调进行刷新
          this.onLoad(this.page);
        });
    },
    showVersionList(row) {
      this.curForm = row;
      this.versionDialogVisible = true;
    },
    // changeList() {
    //   const map = {
    //     system: 'dynamic',
    //     dynamic: 'system'
    //   }
    //   this.formType = map[this.formType]
    //   this.page.currentPage = 1;
    //   this.onLoad(this.page);
    // },
    getUploadBgHeader() {
      return {
        [website.tokenHeader]: getToken(),
      };
    },
  },
  // mounted() {
  //   this.getUseableFields();
  // }
};
</script>

<style scoped lang="scss">
.form-design-dialog {
  /deep/ .el-dialog__body {
    height: calc(100% - 120px);
    padding: 0;
  }
}
</style>
