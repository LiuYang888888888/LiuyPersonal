<template>
  <div>
    <HuilanBasicToolbar style="margin-top: 0">
      <el-button
        size="small"
        type="primary"
        @click="handleAdd"
        v-if="permissionList.addBtn"
        >{{ $t("aicosCommon.addBtn") }}
      </el-button>
    </HuilanBasicToolbar>
    <HuilanBasicSearchbar
      :model="searchForm"
      :fields="searchFieldList"
      @search="searchChange"
      @reset="searchReset"
    >
      <template v-slot:appendTool>
        <el-button type="default" @click="configColumn">
          <i class="el-icon-s-operation"></i>
        </el-button>
      </template>
    </HuilanBasicSearchbar>
    <avue-crud
      :option="option"
      :table-loading="loading"
      :data="data"
      ref="crud"
      v-model="form"
      :page.sync="page"
      :permission="permissionList"
      :before-open="beforeOpen"
      @row-del="rowDel"
      @row-update="rowUpdate"
      @row-save="rowSave"
      @selection-change="selectionChange"
      @current-change="currentChange"
      @size-change="sizeChange"
      @refresh-change="refreshChange"
      @on-load="onLoad"
    >
      <template slot-scope="scope" slot="menu">
        <el-button
          type="text"
          icon="el-icon-setting"
          size="small"
          v-if="permissionList.enableStatus"
          @click.stop="enable(scope.row, scope.index)"
          >{{ scope.row.status === "1" ? "停用" : "启用" }}
        </el-button>
      </template>
    </avue-crud>
  </div>
</template>

<script>
import {
  getList,
  add,
  update,
  remove,
  enableStatus,
} from "@/api/system/messageTemplate";
import { mapGetters } from "vuex";
import { getRules } from "@/util/regx";

export default {
  name: "MessageTpListl",
  props: {
    type: {
      type: String,
    },
  },
  data() {
    return {
      // 搜索
      searchForm: {
        name: "",
        status: "",
      },
      searchFieldList: [
        {
          prop: "name",
          placeholder: "请输入模版名称",
        },
        {
          prop: "status",
          type: "select",
          dicData: [
            {
              label: "启用",
              value: "1",
            },
            {
              label: "停用",
              value: "0",
            },
          ],
          placeholder: "请选择状态",
        },
      ],
      // 表格
      form: {},
      selectionList: [],
      query: {},
      loading: true,
      page: {
        pageSize: 10,
        currentPage: 1,
        total: 0,
      },
      option: {
        // height: 'auto',
        // calcHeight: 30,
        header: false,
        tip: false,
        searchShow: true,
        searchMenuSpan: 6,
        searchSpan: 8,
        border: true,
        index: true,
        // selection: true,
        viewBtn: true,
        menuWidth: 300,
        dialogClickModal: false,
        dialogWidth: "40%",
        dialogType: "drawer",
        labelPosition: "left",
        dialogCustomClass: "huilan-drawer-form",
        column: [
          {
            label: "模版名称",
            prop: "name",
            minWidth: 180,
            // search: true,
            overHidden: true,
            // addDisplay: false,
            // editDisplay: false,
            // editDisabled: true,
            span: 24,
            rules: [
              {
                required: true,
                message: "请输入模板名称",
                trigger: "blur",
              },
              ...getRules(["charNumHanUnderline"]),
            ],
            formatter: (val, value, label) => {
              if (this.validatenull(value)) {
                return "--";
              }
              return label;
            },
          },
          {
            label: "模版标题",
            prop: "title",
            minWidth: 180,
            overHidden: true,
            // search: true,
            // addDisplay: false,
            // editDisplay: false,
            // editDisabled: true,
            span: 24,
            placeholder:
              "可使用变量实现不同人不同文案，格式：【】为变量名称，如【用户名】",
            rules: [
              {
                required: true,
                message: "请输入模版标题",
                trigger: "blur",
              },
              ...getRules(["expectSpecials"]),
            ],
            formatter: (val, value, label) => {
              if (this.validatenull(value)) {
                return "--";
              }
              return label;
            },
          },
          {
            label: "内容",
            prop: "content",
            placeholder:
              "模板可使用变量实现不同人不同文案，格式：【】为变量名称，如【用户名】",
            // width: 180,
            span: 24,
            minRows: 3,
            type: "textarea",
            rules: [
              {
                required: true,
                message: "请输入模板内容",
                trigger: "blur",
              },
              ...getRules(["expectSpecials"]),
            ],
          },
          {
            label: "创建时间",
            prop: "createTime",
            width: 150,
            //search: true,
            addDisplay: false,
            editDisplay: false,
            type: "date",
            format: "yyyy-MM-dd",
            valueFormat: "yyyy-MM-dd",
          },
          {
            label: "模板状态",
            prop: "status",
            width: 120,
            // search: true,
            addDisplay: false,
            editDisplay: false,
            type: "select",
            dicData: [
              {
                label: "启用",
                value: "1",
              },
              {
                label: "停用",
                value: "0",
              },
            ],
            value: "1",
          },
          {
            label: "备注",
            prop: "remark",
            span: 24,
            minRows: 2,
            type: "textarea",
            rules: getRules(["expectSpecials"]),
            hide: true,
          },
        ],
      },
      data: [],
    };
  },
  computed: {
    ...mapGetters(["permission"]),
    permissionList() {
      return {
        addBtn: this.vaildData(
          this.permission["system-messagetemplate-save"],
          false
        ),
        viewBtn: this.vaildData(
          this.permission["system-messagetemplate-view"],
          false
        ),
        delBtn: this.vaildData(
          this.permission["system-messagetemplate-delete"],
          false
        ),
        editBtn: this.vaildData(
          this.permission["system-messagetemplate-update"],
          false
        ),
        enableStatus: this.vaildData(
          this.permission["system-messagetemplate-enable"],
          false
        ),
        // addBtn: true,
        // viewBtn: true,
        // delBtn: true,
        // editBtn: true
      };
    },
  },
  methods: {
    // 新增
    handleAdd() {
      this.$refs.crud.rowAdd();
    },
    // 列显隐
    configColumn() {
      this.$refs.crud.$refs.dialogColumn.columnBox = true;
    },
    rowSave(row, done, loading) {
      add({ ...row, type: this.type }).then(
        () => {
          this.onLoad(this.page);
          this.$message({
            type: "success",
            message: "操作成功!",
          });
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
          this.onLoad(this.page);
          this.$message({
            type: "success",
            message: "操作成功!",
          });
          done();
        },
        (error) => {
          window.console.log(error);
          loading();
        }
      );
    },
    rowDel(row) {
      this.$confirm("确定将选择数据删除?", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          return remove(row.id);
        })
        .then(() => {
          this.onLoad(this.page);
          this.$message({
            type: "success",
            message: "操作成功!",
          });
        });
    },
    beforeOpen(done /*, type*/) {
      // if (["view"].includes(type)) {
      //   getDetail(this.form.id).then(res => {
      //     const data = res.data.data;
      //     if (!(data.accountNumber > 0)) {
      //       data.accountNumber = "不限制";
      //     }
      //     if (!data.expireTime) {
      //       data.expireTime = "不限制";
      //     }
      //     this.form = data;
      //   });
      // }
      // if(type === 'edit') {
      //   const opt = this.findObject(this.option.column, 'tenantId');
      //   opt.disabled = true;
      // }
      done();
    },
    searchReset() {
      this.onLoad(this.page);
    },
    searchChange() {
      this.onLoad(this.page);
    },
    selectionChange(list) {
      this.selectionList = list;
    },
    selectionClear() {
      this.selectionList = [];
      this.$refs.crud.toggleSelection();
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
    onLoad(page) {
      const param = {
        current: page.currentPage,
        size: page.pageSize,
        type: this.type,
        ...this.searchForm,
      };
      this.loading = true;
      getList(param).then((res) => {
        const data = res.data.data;
        this.page.total = data.total;
        this.data = data.records;
        this.loading = false;
        this.selectionClear();
      });
    },
    async enable(row) {
      const params = {
        id: row.id,
        status: row.status === "1" ? "0" : "1",
      };
      const { data } = await enableStatus(params);

      if (data.success) {
        this.$message.success("操作成功！");
        this.onLoad(this.page);
      }
    },
    contentColumnShow(type) {
      const contentColumn = this.findObject(this.option.column, "content");
      if (["shortmessage", "qyWeixin"].includes(type)) {
        this.$set(contentColumn, "hide", true);
        this.$set(contentColumn, "display", false);
      } else {
        this.$set(contentColumn, "hide", true);
        this.$set(contentColumn, "display", true);
      }
    },
  },
  mounted() {
    this.contentColumnShow(this.type);
  },
};
</script>

<style scoped></style>
