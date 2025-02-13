<template>
  <div>
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
      :page.sync="page"
      :permission="permissionList"
      :before-open="beforeOpen"
      @row-save="rowSave"
      @row-update="rowUpdate"
      @row-del="rowDel"
      @current-change="currentChange"
      @size-change="sizeChange"
      @refresh-change="refreshChange"
      @on-load="onLoad"
    >
      <template slot-scope="scope" slot="menu">
        <!-- <el-button
          v-if="permissionList.enableStatus"
          type="text"
          icon="el-icon-setting"
          size="small"
          @click.stop="enable(scope.row, scope.index)"
          >{{ scope.row.status === "0" ? "启用" : "停用" }}
        </el-button> -->
        <!--        <el-button-->
        <!--          type="text"-->
        <!--          icon="el-icon-document"-->
        <!--          size="small"-->
        <!--          @click.stop="onLoad(scope.row,scope.index)"-->
        <!--        >统计-->
        <!--        </el-button>-->
      </template>
      <template v-slot:menu="scope">
        <HuilanBasicActionTool
          :actions="getRowActions(scope.row)"
          @command="handleCommand($event, scope.row, scope.index)"
        />
      </template>
    </avue-crud>
  </div>
</template>

<script>
import { getRules, createUnique } from "@/util/regx";
import { getList, add, update, remove } from "@/api/messageTemplateMgr";
// import serviceList from '@/config/serviceList'
import { mapGetters } from "vuex";
import { getDictItemListByDictCodeURL } from "@/api/common";

// const { system } = serviceList

export default {
  name: "BaseTemplate",
  props: {
    extCls: {
      type: Array,
      default() {
        return [];
      },
    },
    type: String,
  },
  data() {
    return {
      form: {},
      query: {},
      loading: false,
      data: [],
      page: {
        pageSize: 10,
        currentPage: 1,
        total: 0,
      },
      searchForm: {
        name: "",
      },
      searchFieldList: [
        {
          prop: "name",
          placeholder: "请输入模板名称",
        },
      ],
      option: {
        tip: false,
        header: false,
        searchShow: true,
        searchMenuSpan: 6,
        border: true,
        index: true,
        addBtn: false,
        editBtn: false,
        delBtn: false,
        viewBtn: false,
        menuWidth: 180,
        dialogClickModal: false,
        dialogWidth: "40%",
        dialogType: "drawer",
        dialogCustomClass: "huilan-drawer-form",
        column: [
          {
            label: "模板编码",
            prop: "id",
            span: 24,
            addDisplay: false,
            editDetail: true,
            width: 300,
            overHidden: true,
          },
          {
            label: "模板名称",
            prop: "name",
            span: 24,
            // search: true,
            maxlength: 50,
            showWordLimit: true,
            minWidth: 300,
            overHidden: true,
            rules: [
              {
                required: true,
                message: "请输入模板名称",
                trigger: "blur",
              },
              ...getRules(["expectSpecials"]),
            ],
          },
          // {
          //   label: '标题',
          //   prop: 'title',
          //   span: 24
          // },
          // {
          //   label: '内容',
          //   prop: 'content',
          //   type: 'textarea',
          //   span: 24
          // },
          {
            label: "创建时间",
            prop: "createTime",
            addDisplay: false,
            editDisplay: false,
            width: 200,
          },
          {
            label: "模板类型",
            prop: "type",
            span: 24,
            hide: true,
            // 微信使用
            viewDisplay: false,
            type: "select",
            dicUrl: getDictItemListByDictCodeURL,
            dicMethod: "post",
            dicQuery: {
              code: "msg-tpl-bis-type",
            },
            props: {
              label: "name",
              value: "code",
            },
            // value: '1',
          },
          {
            label: "模板状态",
            prop: "status",
            span: 24,
            type: "switch",
            width: 120,
            dicData: [
              {
                label: "停用",
                value: "0",
              },
              {
                label: "启用",
                value: "1",
              },
            ],
            value: "1",
          },
          {
            label: "附加参数",
            prop: "ext",
            type: "dynamic",
            span: 24,
            hide: true,
            // 微信使用
            viewDisplay: false,
            showColumn: false,
            children: {
              column: [
                {
                  label: "参数名",
                  prop: "key",
                  maxlength: 50,
                  showWordLimit: true,
                  rules: [
                    {
                      required: true,
                      message: "请输入参数名",
                      trigger: "blur",
                    },
                    createUnique(this, "form.ext", "key"),
                    ...getRules(["charNumLineStartWidthChar"]),
                  ],
                },
                {
                  label: "参数值",
                  maxlength: 50,
                  showWordLimit: true,
                  prop: "value",
                  rules: getRules(["expectSpecials"]),
                },
              ],
            },
          },
          {
            label: "备注",
            prop: "remark",
            type: "textarea",
            maxlength: 100,
            showWordLimit: true,
            rules: getRules(["expectSpecials"]),
            span: 24,
            hide: true,
          },
        ],
      },
      dynicCols: [],
    };
  },
  computed: {
    ...mapGetters(["permission"]),
    permissionList() {
      return {
        addBtn: this.vaildData(
          this.permission[`message-template-${this.type}-add`],
          false
        ),
        viewBtn: this.type === "weixin",
        delBtn: this.vaildData(
          this.permission[`message-template-${this.type}-delete`],
          false
        ),
        editBtn: this.vaildData(
          this.permission[`message-template-${this.type}-update`],
          false
        ),
        enableStatus: this.vaildData(
          this.permission[`message-template-${this.type}-enableStatus`],
          false
        ),
      };
    },
    sendTestFormOption() {
      const option = this.testFormOpt;

      return option;
    },
  },
  methods: {
    getRowActions(row) {
      let map = {};
      if (this.type === "weixin") {
        map = {
          viewBtn: {
            name: "查看",
            command: "rowView",
          },
        };
      } else {
        map = {
          editBtn: {
            name: "编辑",
            command: "rowEdit",
          },
          delBtn: {
            name: "删除",
            command: "rowDel",
          },
          enableStatus: {
            name: row.status === "0" ? "启用" : "停用",
            command: "enable",
          },
        };
      }

      const list = ["viewBtn", "editBtn", "delBtn", "enableStatus"];
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
    handleAdd() {
      this.$refs.crud.rowAdd();
    },
    configColumn() {
      this.$refs.crud.$refs.dialogColumn.columnBox = true;
    },
    searchReset() {
      this.query = {};
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
        channelType: this.type,
        current: page.currentPage,
        size: page.pageSize,
      };
      this.loading = true;
      getList(Object.assign(params, this.query, pageConf)).then((res) => {
        const data = res.data.data;
        this.loading = false;
        this.data = data.records;
        this.page.total = data.total;
      });
    },
    beforeOpen(done, type) {
      if (type === "edit") {
        const cfg = JSON.parse(this.form.config);

        const ext = Object.keys(cfg).map((key) => {
          return { key, value: cfg[key] };
        });
        this.form = {
          ...this.form,
          ext,
        };
      }
      done();
    },
    // buidSubmitData({id, name, status, remark, type, ...others}) {
    buidSubmitData({ ext, ...others }) {
      const temp = {};
      // this.dynicCols.forEach(key=> {
      //   temp[key] = others[key]
      // })
      ext.forEach(({ key, value }) => (temp[key] = value));
      const data = {
        // id,
        // name,
        // status,
        // remark,
        // type,
        ...others,
        channelType: this.type,
        config: JSON.stringify(temp),
      };
      return data;
    },
    rowSave(row, done, loading) {
      const data = this.buidSubmitData(row);
      add(data).then(
        () => {
          // this.initFlag = false;
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
      const data = this.buidSubmitData(row);
      update(data).then(
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
    enable(row) {
      const data = { ...row };
      if (data.status === "0") {
        data.status = "1";
      } else {
        data.status = "0";
      }
      update(data).then(
        () => {
          // this.initFlag = false;
          this.onLoad(this.page);
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
    extOption() {
      const keys = this.extCls.map((item) => item.prop);
      const columns = this.option.column;
      const extCol = this.findObject(columns, "ext");
      const arr = ["mail", "shortmessage", "weixin"];
      if (arr.includes(this.type)) {
        extCol.addDisplay = false;
        extCol.editDisplay = false;
      } else {
        extCol.addDisplay = true;
        extCol.editDisplay = true;
        keys.push("ext");
      }
      this.dynicCols = keys;
      columns.splice(2, 0, ...this.extCls);
    },
  },
  created() {
    if (this.type === "weixin") {
      this.searchForm = {
        weixinName: "",
      };
      this.searchFieldList = [
        {
          prop: "weixinName",
          placeholder: "请输入所属公众号",
        },
      ];
    }
    this.extOption();
  },
};
</script>

<style scoped></style>
