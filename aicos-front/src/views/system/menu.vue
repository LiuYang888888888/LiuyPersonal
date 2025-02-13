<template>
  <HuilanBasic :left-width="240">
    <template v-slot:left>
      <div class="box">
        <el-scrollbar>
          <basic-container>
            <avue-tree placeholder="111" ref="menuTree" :option="treeOption" :data="treeData" @node-click="nodeClick" />
          </basic-container>
        </el-scrollbar>
      </div>
    </template>
    <HuilanBasicToolbar style="margin-top: 0">
      <el-button v-if="permissionList.addBtn" type="primary" size="small" @click="handleAdd">{{ $t("aicosCommon.addBtn")
      }}</el-button>
      <el-button type="danger" size="small" v-if="permission.menu_delete" plain @click="handleDelete">{{
        $t("aicosCommon.delBtn") }}
      </el-button>
    </HuilanBasicToolbar>
    <HuilanBasicSearchbar :model="searchForm" :fields="searchFieldList" @search="searchChange" @reset="searchReset">
      <template v-slot:appendTool>
        <el-button type="default" @click="configColumn"><i class="el-icon-s-operation"></i></el-button>
      </template>
    </HuilanBasicSearchbar>
    <avue-crud :option="option" :table-loading="loading" :data="data" ref="crud" v-model="form"
      :permission="permissionList" :before-open="beforeOpen" :before-close="beforeClose" @row-del="rowDel"
      @row-update="rowUpdate" @row-save="rowSave" @selection-change="selectionChange" @current-change="currentChange"
      @size-change="sizeChange" @refresh-change="refreshChange" @on-load="onLoad">

      <template v-slot:menu="scope">
        <HuilanBasicActionTool :actions="getRowActions(scope.row, scope.index)"
          @command="handleCommand($event, scope.row, scope.index)" />
      </template>
      <!-- <template slot="menuLeft">
        <el-button
          type="danger"
          size="small"
          icon="el-icon-delete"
          v-if="permission.menu_delete"
          plain
          @click="handleDelete"
          >删 除
        </el-button>
      </template> -->
      <!-- <template slot-scope="scope" slot="menu">
        <el-button type="text" size="small" v-if="scope.index !== 0 && permissionList.order"
          @click.stop="moveUp(scope.row, scope.index)">{{ $t("aicosCommon.moveUp") }}
        </el-button>
        <el-button type="text" size="small" v-if="scope.index !== data.length - 1 && permissionList.order"
          @click.stop="moveDown(scope.row, scope.index)">{{
            $t("aicosCommon.moveDown") }}
        </el-button>
      </template> -->
      <template slot-scope="{ row }" slot="source">
        <div style="text-align: center">
          <i :class="row.source" />
        </div>
      </template>
    </avue-crud>
  </HuilanBasic>
</template>

<script>
import {
  getLazyList,
  remove,
  update,
  add,
  changeOrder
} from "@/api/system/menu";
import { mapGetters } from "vuex";
import iconList from "@/config/iconList";
//import serviceList from '@/config/serviceList'

//const { system } = serviceList
// import func from "@/util/func";
// import {getMenuTree} from "@/api/system/menu";
import { getRules } from "@/util/regx";
import { getTextWidth } from "@/util/util";
import { getDictItemListByDictCodeURL } from "@/api/common";
export default {
  data () {
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
          value: "id"
        },
        defaultExpandedKeys: ["0"],
        treeLoad: (node, resolve) => {
          if (node.level === 0) {
            resolve([{ menuName: this.$t("system.menu.systemMenu"), id: "0" }]);
            return;
          }
          const parentId = node.data.id;
          getLazyList(parentId).then(res => {
            resolve(
              res.data.data.map(item => {
                return {
                  ...item,
                  leaf: item.isLeaf === "1"
                };
              })
            );
          });
        }
      },
      form: {},
      query: {},
      loading: true,
      selectionList: [],
      parentId: "0",
      path: "",
      level: 0,
      page: {
        pageSize: 10,
        currentPage: 1,
        total: 0
      },
      searchForm: {
        menuName: "",
        code: ""
      },
      searchFieldList: [
        {
          prop: "menuName",
          placeholder:
            this.$t("aicosCommon.pleaseInput") + this.$t("system.menu.menuName")
        },
        {
          prop: "code",
          placeholder:
            this.$t("aicosCommon.pleaseInput") + this.$t("system.menu.menuCode")
        }
      ],
      option: {
        // lazy: true,
        header: false,
        tip: false,
        simplePage: true,
        searchShow: true,
        searchMenuSpan: 6,
        // tree: true,
        addBtn: false,
        border: false,
        index: true,
        selection: true,
        viewBtn: false,
        delBtn: false,
        editBtn: false,

        menuWidth: 300,
        menuAlign: "left",
        dialogClickModal: false,
        dialogWidth: "40%",
        dialogType: "drawer",
        dialogCustomClass: "huilan-drawer-form",
        labelPosition: "left",
        emptyText: this.$t('aicosCommon.notData'),
        column: [
          {
            label: this.$t("system.menu.menuName"),
            prop: "menuName",
            // search: true,
            overHidden: true,
            maxlength: 50,
            minWidth: 90,
            showWordLimit: true,
            rules: [
              {
                required: true,
                message:
                  this.$t("aicosCommon.pleaseInput") +
                  this.$t("system.menu.menuName"),
                trigger: "blur"
              },
              ...getRules(["charNumHanUnderline"])
            ]
          },
          {
            label: this.$t("system.menu.menuCode"),
            prop: "code",
            // search: true,
            editDisabled: true,
            maxlength: 50,
            minWidth: 90,
            overHidden: true,
            showWordLimit: true,
            rules: [
              {
                required: true,
                message:
                  this.$t("aicosCommon.pleaseInput") +
                  this.$t("system.menu.menuCode"),
                trigger: "blur"
              },
              ...getRules(["charNumLine"])
            ]
          },
          {
            label: this.$t("system.menu.routeAddress"),
            prop: "linkUrl",
            maxlength: 100,
            minWidth: 90,
            showWordLimit: true,
            overHidden: true,
            rules: [
              {
                required: true,
                message:
                  this.$t("aicosCommon.pleaseInput") +
                  this.$t("system.menu.routeAddress"),
                trigger: "blur"
              },
              ...getRules(["expectSpecials"])
            ]
          },
          {
            label: this.$t("system.menu.typesOf"),
            prop: "moduleScope",
            type: "select",
            dicUrl: getDictItemListByDictCodeURL,
            dicMethod: "post",
            width: 80,
            align: "center",
            overHidden: true,
            dicQuery: {
              code: "module_scope"
            },
            props: {
              label: "name",
              value: "code"
            },
            rules: [
              {
                required: true,
                message:
                  this.$t("aicosCommon.pleaseSelect") +
                  this.$t("system.menu.typesOf"),
                trigger: "click"
              }
            ],
            value: "common"
          },
          {
            label: this.$t("system.menu.parentMenu"),
            prop: "parentId",
            // type: "tree",
            // dicData: [],
            hide: true,
            overHidden: true,
            display: false
            // addDisabled: false,
            // props: {
            //   label: "title"
            // },
            // rules: [
            //   {
            //     required: false,
            //     message: "请选择上级菜单",
            //     trigger: "click"
            //   }
            // ]
          },
          {
            label: this.$t("system.menu.menuIcon"),
            prop: "imageUrl",
            type: "icon",
            slot: true,
            align: "center",
            iconList: iconList,
            width: 100,
            rules: [
              // {
              //   required: true,
              //   message: "请输入菜单图标",
              //   trigger: "click"
              // }
            ]
          },
          {
            label: this.$t("system.menu.desktopIcon"),
            prop: "desktopIcon",
            hide: true,
            type: "icon",
            width: 100,
            align: "center",
            iconList: iconList
            // rules: [
            //   {
            //     required: true,
            //     message: "请输入菜单图标",
            //     trigger: "click"
            //   }
            // ]
          },
          {
            label: this.$t("system.menu.enableOrNot"),
            prop: "status",
            type: "radio",
            width: 100,
            align: "center",
            dicData: [
              {
                label: this.$t("system.menu.enable"),
                value: "1"
              },
              {
                label: this.$t("system.menu.deactivate"),
                value: "0"
              }
            ],
            value: "1"
          },
          {
            label: this.$t("system.menu.displayOrNot"),
            prop: "displayStatus",
            width: 100,
            align: "center",
            type: "radio",
            dicData: [
              {
                label: this.$t("system.menu.show"),
                value: "1"
              },
              {
                label: this.$t("system.menu.hidden"),
                value: "0"
              }
            ],
            value: "1"
          },
          {
            label: this.$t("system.menu.windowWidth"),
            prop: "width",
            hide: true,
            type: "input",
            rules: [...getRules(["size"])],
            value: "50%"
          },
          {
            label: this.$t("system.menu.windowHeight"),
            prop: "height",
            hide: true,
            type: "input",
            rules: [...getRules(["size"])],
            value: "50%"
          },
          {
            label: this.$t("system.menu.openMode"),
            prop: "desktopType",
            labelTip: this.$t("system.menu.linksTips"),
            width: 120,
            align: "center",
            hide: true,
            type: "radio",
            dicData: [
              {
                label: this.$t("system.menu.in"),
                value: "in"
              },
              {
                label: this.$t("system.menu.out"),
                value: "out"
              }
            ],
            value: "in"
          },
          {
            label: this.$t("system.menu.isSso"),
            labelWidth: 120,
            prop: "isSso",
            labelTip: this.$t("system.menu.linksTips"),
            type: "radio",
            hide: true,
            dicData: [
              {
                label: this.$t("aicosCommon.yes"),
                value: 1
              },
              {
                label: this.$t("aicosCommon.no"),
                value: 0
              }
            ],
            value: 0
          },
          {
            label: this.$t("system.menu.desktopDisplay"),
            prop: "iconStatus",
            labelTip: this.$t("system.menu.firstMenuTips"),
            type: "radio",
            width: 100,
            align: "center",
            dicData: [
              {
                label: this.$t("system.menu.show"),
                value: "1"
              },
              {
                label: this.$t("system.menu.hidden"),
                value: "0"
              }
            ],
            value: "1"
          },
          {
            label: this.$t("system.menu.remoteModule"),
            prop: "moduleRemote",
            hide: true,
            type: "radio",
            dicData: [
              {
                label: this.$t("aicosCommon.yes"),
                value: 1
              },
              {
                label: this.$t("aicosCommon.no"),
                value: 0
              }
            ],
            value: 0,
            control (val) {
              const display = val !== 0;
              return {
                moduleExport: {
                  display
                },
                moduleUrl: {
                  display
                }
              };
            }
          },
          {
            label: this.$t("system.menu.moduleAddress"),
            prop: "moduleUrl",
            span: 24,
            hide: true,
            maxlength: 200,
            showWordLimit: true,
            rules: getRules(["expectSpecials"])
          },
          {
            label: this.$t("system.menu.moduleVariables"),
            prop: "moduleExport",
            hide: true,
            span: 24,
            maxlength: 200,
            showWordLimit: true,
            rules: getRules(["expectSpecials"])
          },
          {
            label: this.$t("system.menu.menuRemark"),
            prop: "remark",
            type: "textarea",
            span: 24,
            minRows: 2,
            maxlength: 200,
            showWordLimit: true,
            rules: getRules(["expectSpecials"]),
            hide: true
          }
        ]
      },
      data: []
    };
  },

  watch: {
    // 'form.category'() {
    //   const category = func.toInt(this.form.category);
    //   this.$refs.crud.option.column.filter(item => {
    //     if (item.prop === "path") {
    //       item.rules[0].required = category === 1;
    //     }
    //     if (item.prop === 'isOpen') {
    //       item.disabled = category === 2;
    //     }
    //   });
    // },
  },
  computed: {
    ...mapGetters(["permission", "language"]),
    permissionList () {
      return {
        addBtn: this.vaildData(this.permission["system-menu-save"], false),
        viewBtn: this.vaildData(this.permission["system-menu-view"], false),
        delBtn: this.vaildData(this.permission["system-menu-delete"], false),
        editBtn: this.vaildData(this.permission["system-menu-update"], false),
        order: this.vaildData(this.permission["system-menu-changeorder"], false),
        moveUp: this.vaildData(this.permission["system-menu-changeorder"], false),
        moveDown: this.vaildData(this.permission["system-menu-changeorder"], false),
        // addBtn: true,
        // viewBtn: true,
        // delBtn: true,
        // editBtn: true
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

    getRowActions (row, index) {
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
        moveUp: {
          name: this.$t("aicosCommon.moveUp"),
          command: "moveUp",
        },
        moveDown: {
          name: this.$t("aicosCommon.moveDown"),
          command: "moveDown",
        },
      };
      const list = [
        "viewBtn",
        "editBtn",
        "delBtn",
        "moveUp",
        "moveDown",
      ];
      const actions = [];
      list.forEach((item) => {
        if (index === 0 && this.permissionList[item]) {
          if (item != 'moveUp') actions.push(map[item])
        } else if (index === this.data.length - 1 && this.permissionList[item]) {
          if (item != 'moveDown') actions.push(map[item]);
        } else if (this.permissionList[item]) {
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
    // 新增
    handleAdd () {

      this.$refs.crud.rowAdd();
    },
    // 列显隐
    configColumn () {
      console.log(this.$refs.crud);
      this.$refs.crud.$refs.dialogColumn.columnBox = true;
    },

    getPath (node) {
      let path = [];
      let curNode = node;
      while (curNode.level > 1) {
        path.push(curNode.key);
        curNode = curNode.parent;
      }
      return path.reverse().join();
    },
    nodeClick (data, node) {
      this.parentId = data.id;
      this.level = node.level;
      this.path = this.getPath(node);
      this.page.currentPage = 1;
      this.onLoad(this.page);
    },
    initData (type) {
      // getMenuTree().then(res => {
      //   const column = this.findObject(this.option.column, "parentId");
      //   column.dicData = res.data.data;
      // });
      this.form.parentId = this.parentId;
      if (type == "add") {
        this.form.moduleLevel = this.level;
        this.form.ancestors = this.path;
      }
    },
    updateTreeNode (type, data) {
      const menuTree = this.$refs.menuTree;
      const curParent = menuTree.getNode(this.parentId);
      if (type === "add") {
        if (curParent.isLeaf) {
          curParent.isLeaf = false;
          curParent.loaded = false;
          if (curParent.expanded) {
            curParent.expand();
          }
        } else {
          if (curParent.loaded) {
            curParent.loaded = false;

            if (curParent.expanded) {
              curParent.expand();
            }
          }
        }
      } else if (type === "update") {
        const curNode = menuTree.getNode(data.id);
        if (curNode) {
          curNode.data = data;
        }
      } else if (type === "del") {
        menuTree.remove(data.id);
      }
    },
    rowSave (row, done, loading) {
      row.isLeaf = "1";
      add(row).then(
        res => {
          // 获取新增数据的相关字段
          const data = res.data.data;
          row.id = data.id;
          this.updateTreeNode("add");
          this.$message({
            type: "success",
            message: this.$t("aicosCommon.successOperate")
          });
          // 数据回调进行刷新
          done(row);
        },
        error => {
          window.console.log(error);
          loading();
        }
      );
    },
    rowUpdate (row, index, done, loading) {
      update(row).then(
        () => {
          this.updateTreeNode("update", row);
          this.$message({
            type: "success",
            message: this.$t("aicosCommon.successOperate")
          });
          // 数据回调进行刷新
          done(row);
        },
        error => {
          window.console.log(error);
          loading();
        }
      );
    },
    rowDel (row, index, done) {
      this.$confirm(this.$t("system.menu.delTips"), {
        confirmButtonText: this.$t("aicosCommon.confirmBtn"),
        cancelButtonText: this.$t("aicosCommon.cancelBtn"),
        type: "warning"
      })
        .then(() => {
          return remove(row.id);
        })
        .then(() => {
          this.$message({
            type: "success",
            message: this.$t("aicosCommon.successOperate")
          });
          this.updateTreeNode("del", row);
          // 数据回调进行刷新
          done(row);
        });
    },
    handleDelete () {
      if (this.selectionList.length === 0) {
        this.$message.warning(this.$t("aicosCommon.chooseDataTip"));
        return;
      }
      this.$confirm(this.$t("aicosCommon.mutiDeleteConfirmTip"), {
        confirmButtonText: this.$t("aicosCommon.confirmBtn"),
        cancelButtonText: this.$t("aicosCommon.cancelBtn"),
        type: "warning"
      })
        .then(() => {
          return remove(this.ids);
        })
        .then(() => {
          // 刷新表格数据并重载
          this.data = [];
          this.$refs.crud.refreshTable();
          this.$refs.crud.toggleSelection();
          // 表格数据重载
          this.onLoad(this.page);
          this.$message({
            type: "success",
            message: this.$t("aicosCommon.successOperate")
          });
        });
    },
    searchReset () {
      this.query = {};
      this.onLoad(this.page);
    },
    searchChange () {
      this.query = {
        ...this.searchForm
      };
      this.page.currentPage = 1;
      this.onLoad(this.page);
    },
    selectionChange (list) {
      this.selectionList = list;
    },
    selectionClear () {
      this.selectionList = [];
      this.$refs.crud.toggleSelection();
    },
    beforeOpen (done, type) {

      this.option.labelPosition = this.language != "zh" ? "top" : "right";

      if (["add", "edit"].includes(type)) {
        this.initData(type);
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
      getLazyList(this.parentId, Object.assign(params, this.query)).then(
        res => {
          this.data = res.data.data;
          if (this.language != 'zh') {
            this.option.column.forEach(item => {
              let width = getTextWidth(item.label).nodeWidth + 100;
              this.$set(item, "width", width)
            })
          }
          this.loading = false;
          this.selectionClear();
        }
      );
    },
    moveUp (row, index) {
      this.changeOrder(row, index, -1);
    },
    moveDown (row, index) {
      this.changeOrder(row, index, 1);
    },
    async changeOrder (row, index, step) {
      const obj = this.data[index + step];
      const { data } = await changeOrder(row.id, obj.id);

      if (data.success) {
        this.$message.success(this.$t("aicosCommon.successOperate"));
        this.onLoad();
      }
    }
  },
  mounted () {
    this.$refs.menuTree.setCurrentKey("0");
    // 收起左侧菜单
    if (!this.$store.getters.isCollapse) {
      this.$store.commit("SET_COLLAPSE");
    }
  }
};
</script>

<style scope lang="scss">
/deep/ .avue-input-icon__list {
  background: red($color: #000000);
}



.avue-input-icon__item>p {
  display: none;
}
</style>
