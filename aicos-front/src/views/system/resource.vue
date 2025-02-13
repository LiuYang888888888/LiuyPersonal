<template>
  <HuilanBasic :left-width="240">
    <template v-slot:left>
      <div class="box">
        <el-scrollbar>
          <basic-container>
            <avue-tree ref="menuTree" :option="treeOption" :data="treeData" @node-click="nodeClick" />
          </basic-container>
        </el-scrollbar>
      </div>
    </template>
    <HuilanBasicToolbar style="margin-top: 0">
      <el-button v-if="permissionList.addBtn" type="primary" size="small" @click="handleAdd">{{
        $t("aicosCommon.addBtn")
      }}</el-button>
    </HuilanBasicToolbar>
    <HuilanBasicSearchbar :model="searchForm" :fields="searchFieldList" @search="searchChange" @reset="searchReset">
      <template v-slot:appendTool>
        <el-button type="default" @click="configColumn"><i class="el-icon-s-operation"></i></el-button>
      </template>
    </HuilanBasicSearchbar>
    <avue-crud :option="option" :table-loading="loading" :data="data" ref="crud" v-model="form" :page.sync="page"
      :permission="permissionList" :before-open="beforeOpen" :before-close="beforeClose" @row-del="rowDel"
      @row-update="rowUpdate" @row-save="rowSave" @current-change="currentChange" @size-change="sizeChange"
      @refresh-change="refreshChange" @on-load="onLoad">
      <template v-slot:menu="scope">
        <HuilanBasicActionTool :actions="getRowActions(scope.row)"
          @command="handleCommand($event, scope.row, scope.index)" />
      </template>
    </avue-crud>
  </HuilanBasic>
</template>

<script>
import { getList, add, update, remove } from "@/api/system/resource";
import { getLazyList } from "@/api/system/menu";
// import { getDictionary } from "@/api/system/dict";
import { mapGetters } from "vuex";
//import serviceList from '@/config/serviceList'
import { getRules } from "@/util/regx";
// import { getTextWidth } from "@/util/util";
import { getDictItemListByDictCodeURL } from "@/api/common";

//const { system } = serviceList

export default {
  data () {
    const me = this;
    return {
      treeData: [],
      treeOption: {
        menu: false,
        addBtn: false,
        nodeKey: "id",
        lazy: true,
        props: {
          label: "menuName",
          children: "children",
          // 设置了value后getNode才能通过key获取节点
          value: "id",
        },
        defaultExpandedKeys: ["0"],
        treeLoad: (node, resolve) => {
          if (node.level === 0) {
            resolve([{ menuName: this.$t('system.resource.systemMenu'), id: "0" }]);
          }
          const parentId = node.data.id;
          getLazyList(parentId).then((res) => {
            const data = res.data.data;
            setTimeout(() => {
              if (data.length > 0 && parentId === "0") {
                me.$refs.menuTree.setCurrentKey(data[0].id);
                me.nodeClick(data[0]);
              }
            });
            resolve(
              data.map((item) => {
                return {
                  ...item,
                  leaf: item.isLeaf === "1",
                };
              })
            );
          });
        },
      },
      form: {},
      query: {},
      loading: true,
      parentId: "0",
      page: {
        pageSize: 10,
        currentPage: 1,
        total: 0,
      },
      option: {
        // lazy: true,
        header: false,
        tip: false,
        // simplePage: true,
        searchShow: true,
        searchMenuSpan: 6,
        labelWidth: 100,

        searchLabelWidth: 100,
        addBtn: false,
        // tree: true,
        border: false,
        index: true,
        selection: false,
        viewBtn: false,
        editBtn: false,
        delBtn: false,
        menuWidth: 180,
        dialogClickModal: false,
        dialogWidth: "40%",
        dialogType: "drawer",
        dialogCustomClass: "huilan-drawer-form",
        emptyText: this.$t('aicosCommon.notData'),
        column: [
          {
            label: this.$t("system.resource.code"),
            prop: "code",
            editDisabled: true,
            span: 24,
            maxlength: 50,
            showWordLimit: true,
            overHidden: true,
            rules: [
              {
                required: true,
                message: this.$t("aicosCommon.pleaseInput") + this.$t("system.resource.code"),
                trigger: "blur",
              },
              ...getRules(["charNumLine"]),
            ],
          },
          {
            label: this.$t("system.resource.name"),
            prop: "name",
            // search: true,
            maxlength: 50,
            span: 24,
            searchSpan: 8,
            showWordLimit: true,
            overHidden: true,
            rules: [
              {
                required: true,
                message: this.$t("aicosCommon.pleaseInput") + this.$t("system.resource.name"),
                trigger: "blur",
              },
              ...getRules(["charNumHanUnderline"]),
            ],
          },
          // {
          //   label: "路径",
          //   prop: "action",
          //   rules: [
          //     {
          //       required: true,
          //       message: "请输入路径",
          //       trigger: "blur"
          //     }
          //   ]
          // },
          {
            label: this.$t("system.resource.parentMenu"),
            prop: "menuId",
            hide: true,
            display: false,
            overHidden: true,
          },
          {
            label: this.$t("system.resource.typesOf"),
            prop: "resourceScope",
            span: 24,
            width: 120,
            align: "center",
            type: "select",
            dicUrl: getDictItemListByDictCodeURL,
            dicMethod: "post",
            overHidden: true,
            dicQuery: {
              code: "resource_scope",
            },
            value: "common",
            props: {
              label: "name",
              value: "code",
            },
            rules: [
              {
                required: true,
                message: this.$t("aicosCommon.pleaseSelect") + this.$t("system.resource.typesOf"),
                trigger: "click",
              },
            ],
          },
          {
            label: this.$t("system.resource.status"),
            prop: "status",
            span: 24,
            width: 120,
            align: "center",
            type: "select",
            overHidden: true,
            dicData: [
              { label: this.$t("system.resource.notEnabled"), value: "0" },
              { label: this.$t("system.resource.enable"), value: "1" },
            ],
            value: "1",
          },
          {
            label: this.$t("system.resource.address"),
            prop: "resourceUrl",
            span: 24,
            minRows: 2,
            maxlength: 200,
            showWordLimit: true,
            overHidden: true,
            rules: [
              {
                required: true,
                message: this.$t("aicosCommon.pleaseInput") + this.$t("system.resource.address"),
                trigger: "blur",
              },
              getRules(["expectSpecials"]),
            ],
            hide: true,
          },
          {
            label: this.$t("system.resource.remark"),
            prop: "remark",
            type: "textarea",
            span: 24,
            minRows: 2,
            maxlength: 100,
            overHidden: true,
            showWordLimit: true,
            rules: getRules(["expectSpecials"]),
            hide: true,
          },
        ],
      },
      data: [],
      searchForm: {
        name: "",
      },
      searchFieldList: [
        {
          prop: "name",
          placeholder: this.$t("aicosCommon.pleaseInput") + this.$t('system.resource.name')
        },
      ],
    };
  },
  computed: {
    ...mapGetters(["userInfo", "permission", 'language']),
    permissionList () {
      return {
        addBtn: this.vaildData(this.permission["system-resource-save"], false),
        viewBtn: this.vaildData(this.permission["system-resource-view"], false),
        delBtn: this.vaildData(
          this.permission["system-resource-delete"],
          false
        ),
        editBtn: this.vaildData(
          this.permission["system-resource-update"],
          false
        ),
        // addBtn: true,
        // viewBtn: true,
        // delBtn: true,
        // editBtn: true
      };
    },
  },
  mounted () {
    // 收起左侧菜单
    if (!this.$store.getters.isCollapse) {
      this.$store.commit("SET_COLLAPSE");
    }
  },
  methods: {
    // 新增
    handleAdd () {
      this.$refs.crud.rowAdd();
    },
    // 列显隐
    configColumn () {
      this.$refs.crud.$refs.dialogColumn.columnBox = true;
    },
    getRowActions () {
      const map = {
        viewBtn: {
          name: this.$t("aicosCommon.viewBtn"),
          command: "rowView",
        },
        delBtn: {
          name: this.$t("aicosCommon.delBtn"),
          command: "rowDel",
        },
        editBtn: {
          name: this.$t("aicosCommon.editBtn"),
          command: "rowEdit",
        },
      };
      const list = ["viewBtn", "editBtn", "delBtn"];
      const actions = [];

      list.forEach((item) => {
        if (this.permissionList[item]) {
          actions.push(map[item]);
        }
      });
      return actions;
    },
    handleCommand (command, row, index) {
      const crud = this.$refs.crud;
      const cruddActions = ["rowView", "rowEdit", "rowDel"];
      if (cruddActions.includes(command)) {
        crud[command](row, index);
      } else {
        this[command](row, index);
      }
    },
    nodeClick (data) {
      this.parentId = data.id;
      this.page.currentPage = 1;
      this.onLoad(this.page);
    },
    initData () {
      // getMenuTree().then(res => {
      //   const column = this.findObject(this.option.column, "parentId");
      //   column.dicData = res.data.data;
      // });
      this.form.menuId = this.parentId;
    },
    rowSave (row, done, loading) {
      add(row).then(
        () => {
          // 获取新增数据的相关字段
          // const data = res.data.data;
          // row.id = data.id;
          this.$message({
            type: "success",
            message: this.$t("aicosCommon.successOperate"),
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
    rowUpdate (row, index, done, loading) {
      update(row).then(
        () => {
          this.$message({
            type: "success",
            message: this.$t("aicosCommon.successOperate"),
          });
          // 数据回调进行刷新
          done(row);
        },
        (error) => {
          window.console.log(error);
          loading();
        }
      );
    },
    rowDel (row, index, done) {
      this.$confirm(this.$t("system.resource.delTips"), {
        confirmButtonText: this.$t("aicosCommon.confirmBtn"),
        cancelButtonText: this.$t("aicosCommon.cancelBtn"),
        type: "warning",
      })
        .then(() => {
          return remove(row.id);
        })
        .then(() => {
          this.$message({
            type: "success",
            message: this.$t("aicosCommon.successOperate"),
          });
          // 数据回调进行刷新
          done(row);
        });
    },
    searchReset () {
      this.query = {};
      this.onLoad(this.page);
    },
    searchChange () {
      this.query = {
        ...this.searchForm,
      };
      this.page.currentPage = 1;
      this.onLoad(this.page);
    },
    beforeOpen (done, type) {
      this.option.labelPosition = this.language != 'zh' ? 'top' : 'right'

      if (["add", "edit"].includes(type)) {
        this.initData();
      }
      if (["edit", "view"].includes(type)) {
        // getMenu(this.form.id).then(res => {
        //   this.form = res.data.data;
        // });
      }
      done();
    },
    beforeClose (done) {

      // this.parentId = "";
      // const column = this.findObject(this.option.column, "parentId");
      // column.value = "";
      // column.addDisabled = false;
      done();
    },
    currentChange (currentPage) {
      this.page.currentPage = currentPage;
    },
    sizeChange (pageSize) {
      this.page.pageSize = pageSize;
    },
    refreshChange () {
      this.onLoad(this.page, this.query);
    },
    onLoad (page, params = {}) {
      this.loading = true;
      getList(
        page.currentPage,
        page.pageSize,
        Object.assign(params, this.query, { menuId: this.parentId })
      ).then((res) => {
        const data = res.data.data;
        this.data = data.records;
        // if (this.language != 'zh') {
        //   this.option.column.forEach(item => {
        //     let width = getTextWidth(item.label).nodeWidth + 150;
        //     this.$set(item, "width", width)
        //   })
        // }
        this.page.total = data.total;
        this.loading = false;
      });
    },
  },
};
</script>
