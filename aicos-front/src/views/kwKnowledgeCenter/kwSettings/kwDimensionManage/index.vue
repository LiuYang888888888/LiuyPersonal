<template>
  <HuilanBasic :left-width="250">
    <template v-slot:left>
      <div class="kw-left-container kw-base-container" :style="{
        height: allWindowTopBodyHeight ? allWindowTopBodyHeight + 'px' : '',
        padding: '0px',
      }">
        <basic-container>
          <avue-tree ref="dimensionTree" :option="treeOption" :data="treeData" @node-click="nodeClick">
            <span class="el-tree-node__label" slot-scope="{ node }">
              <span :title="(node || {}).label">
                {{ (node || {}).label }}
              </span>
            </span>
            <!-- <template slot-scope="scope">
                <div>{{ node }}</div>
              </template> -->
          </avue-tree>
        </basic-container>
      </div>
    </template>
    <div class="">
      <div class="kw-right-container" :style="{
        height: allWindowTopBodyHeight ? allWindowTopBodyHeight + 'px' : '',
        overflowY: 'auto',
        marginLeft: '20px',
      }">
        <div class="kw-header">
          <div class="kw-button-container">
            <el-button class="kw-build-button kw-btn-green" @click="openAddDialog('add')"
              v-if="permission[`${prefix}dimension-add`]">{{ $t("dimensionManage.addButton") }}</el-button>
            <el-button class="kw-danger-button kw-btn-blue" @click="deletePatch"
              v-if="permission[`${prefix}dimension-deleteMore`]">{{ $t("aicosCommon.batchDeleteBtn") }}</el-button>
          </div>
          <div id="kw-form-container">
            <div class="kw-form-form">
              <el-input size="small" :placeholder="$t('dimensionManage.dnameRequiredText')" v-model="query.dname"
                clearable class="kw-form-type">
              </el-input>
            </div>
            <div class="kw-form-btn">
              <el-button type="primary" size="small" icon="el-icon-search" class="kw-search-btn"
                @click="searchChange"></el-button>
              <el-button size="small" class="kw-reset-btn" @click="searchReset"><i
                  class="aicosicon aicos-icon-clear"></i></el-button>
            </div>
          </div>
        </div>
        <avue-crud :option="option" :table-loading="loading" :data="data" :page.sync="page" ref="crud" v-model="form"
          @selection-change="selectionChange" @current-change="currentChange" @size-change="sizeChange" @on-load="onLoad">
          <template slot="isFilter" slot-scope="scope">
            <el-switch v-if="scope.row.pid == '0'" :value="scope.row.isFilter == '1' ? true : false"
              :disabled="isDisabledSwitch" :active-value="true" :inactive-value="false"
              @change="changeFilter($event, scope.row)">
            </el-switch>
            <span v-else>{{
              scope.row.isFilter == "1"
              ? $t("dimensionManage.open")
              : $t("dimensionManage.close")
            }}</span>
          </template>
          <template slot-scope="scope" slot="menu">
            <el-button type="text" size="small" v-if="permission[`${prefix}dimension-edit`]"
              @click.stop="openEditDimension(scope.row, scope.index)">{{ $t("aicosCommon.editBtn") }}
            </el-button>
            <el-button type="text" size="small" v-if="scope.index !== 0 && permission[`${prefix}dimension-up`]"
              @click.stop="moveUp(scope.row, scope.index)">{{ $t("aicosCommon.moveUp") }}
            </el-button>
            <el-button type="text" size="small" v-if="scope.index != data.length - 1 &&
              permission[`${prefix}dimension-down`]
              " @click.stop="moveDown(scope.row, scope.index)">{{ $t("aicosCommon.moveDown") }}
            </el-button>
            <el-button size="small" type="text" v-if="permission[`${prefix}dimension-delete`]"
              @click.stop="deleteDimension(scope.row, scope.index)">{{ $t("aicosCommon.delBtn") }}
            </el-button>
          </template>
        </avue-crud>
      </div>
    </div>

    <!--新增维度-->
    <HuilanDialog :title="$t('dimensionManage.addButton')" append-to-body :visible.sync="addDialogVisible" width="500px">
      <AddDimension v-if="addDialogVisible" ref="addDimensionRef" :type="'add'" />
      <template v-slot:footer>
        <el-button size="small" @click="addDialogVisible = false">{{
          $t("aicosCommon.cancelBtn")
        }}</el-button>
        <el-button size="small" type="primary" @click.stop="saveDimension('add')" :disabled="disable">{{
          $t("aicosCommon.saveBtn") }}</el-button>
      </template>
    </HuilanDialog>

    <!--编辑维度-->
    <HuilanDialog :title="$t('dimensionManage.editTitle')" append-to-body :visible.sync="editDialogVisible" width="500px">
      <AddDimension v-if="editDialogVisible" ref="editDimensionRef" :type="'edit'" :curDimension="curDimension" />
      <template v-slot:footer>
        <el-button size="small" @click="editDialogVisible = false">{{
          $t("aicosCommon.cancelBtn")
        }}</el-button>
        <el-button size="small" type="primary" @click.stop="saveDimension('update')" :disabled="disable">{{
          $t("aicosCommon.saveBtn") }}</el-button>
      </template>
    </HuilanDialog>
  </HuilanBasic>
</template>

<script>
import {
  getLazyList,
  saveDimensionUrl,
  deleteDimensionUrl,
  getTableUrl,
  changeOrder,
  isOpenFilterUrl,
} from "@/api/kwKnowledgeCenter/kwSettings/kwDimensionManage/index";
import { mapGetters } from "vuex";
// import serviceList from '@/config/serviceList';
import AddDimension from "./addDimension";

export default {
  inject: ["desktopWindow", "desktop", "isRobotMenu"],
  components: {
    AddDimension,
  },
  data () {
    let allDimensionText = this.$t("dimensionManage.allDimensionText");
    let botId = this.$store.getters.botObj.id;

    return {
      disable: false,
      allWindowTopBodyHeight: 0, //窗口的高度
      addDialogVisible: false,
      editDialogVisible: false,
      isDisabledSwitch: false, // 开关是否禁用
      botId: "", // 机器人id
      curDimension: {}, // 当前维度
      treeData: [],
      treeOption: {
        menu: false,
        addBtn: false,
        filter: false,
        nodeKey: "id",
        lazy: true,
        props: {
          label: "dname",
          children: "children",
          // 设置了value后getNode才能通过key获取节点
          value: "id",
        },
        defaultExpandedKeys: ["0"],
        treeLoad: function (node, resolve) {
          if (node.level === 0) {
            resolve([{ dname: allDimensionText, id: "0" }]);
            return;
          }
          const parentId = node.data.id;
          getLazyList(parentId, botId).then((res) => {
            resolve(
              res.data.data.map((item) => {
                return {
                  ...item,
                  leaf: item.isLeaf === 0,
                };
              })
            );
          });
        },
      },
      form: {},
      query: {
        dname: "",
      },
      loading: true,
      selectionList: [],
      parentId: "0",
      path: "",
      level: 0,
      page: {
        pageSize: 10,
        currentPage: 1,
        total: 0,
      },
      option: {
        searchShowBtn: false,
        refreshBtn: false,
        tip: false,
        searchShow: true,
        searchMenuSpan: 6,
        dialogWidth: "60%",
        columnBtn: false,
        border: false,
        index: false,
        addBtn: false,
        selection: true,
        editBtn: false,
        delBtn: false,
        viewBtn: false,
        menuWidth: 190,
        menuAlign: "center",
        dialogClickModal: false,
        labelWidth: 120,
        emptyBtnText: this.$t('aicosCommon.resetBtn'),
        emptyText: this.$t('aicosCommon.notData'),
        column: [
          {
            label: this.$t("dimensionManage.dnameText"),
            prop: "dname",
            span: 12,
            // search: true,
            width: 280,
            // search:true,
            // maxlength: 50,
            showWordLimit: true,
            overHidden: true,

          },
          {
            label: this.$t("dimensionManage.isFilterDname"),
            prop: "isFilter",
            type: "chekbox",
            span: 12,
          },
          {
            label: this.$t("dimensionManage.remarks"),
            prop: "remarks",
            overHidden: true,
            minWidth: 200,
            span: 12,
          },
        ],
      },
      data: [],
    };
  },
  watch: {},
  computed: {
    prefix () {
      const prefix = this.isRobotMenu ? "robot-" : "";
      return prefix;
    },
    ...mapGetters(["permission"]),
    ids () {
      let ids = [];
      this.selectionList.forEach((ele) => {
        ids.push(ele.id);
      });
      return ids.join(",");
    },
  },
  methods: {
    //动态获取窗口大小
    desktopWindowResize () {
      this.allWindowTopBodyHeight =
        this.desktopWindow.$el.getElementsByClassName(
          "desk-window-inner"
        )[0].offsetHeight;
    },

    updateTreeNode (type, data) {
      const dimensionTree = this.$refs.dimensionTree;
      const curParent = dimensionTree.getNode(this.parentId);
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
        const curNode = dimensionTree.getNode(data.id);
        if (curNode) {
          curNode.data = data;
        }
      } else if (type === "del") {
        dimensionTree.remove(data.id);
      } else if (type == "patchDel") {
        this.selectionList.forEach((node) => {
          dimensionTree.remove(node.id);
        });

        if (curParent.loaded) {
          curParent.loaded = false;

          if (curParent.expanded) {
            curParent.expand();
          }
        }
      } else if (type == "move") {
        if (curParent.loaded) {
          curParent.loaded = false;

          if (curParent.expanded) {
            curParent.expand();
          }
        }
      }
    },
    openAddDialog () {
      this.addDialogVisible = true;
    },
    // 保存维度
    saveDimension (type) {
      let postData = {};
      let me = this;
      this.$refs[
        type == "add" ? "addDimensionRef" : "editDimensionRef"
      ].$refs.addFormRef.validate((valid) => {
        if (valid) {
          let addForm =
            this.$refs[type == "add" ? "addDimensionRef" : "editDimensionRef"]
              .addForm;
          postData = {
            ...addForm,
            pid: this.parentId,
            botId: this.botId,
          };
          this.disable = true;
          saveDimensionUrl(postData)
            .then(() => {
              this.$message({
                type: "success",
                message: this.$t("aicosCommon.saveSuccessTip"),
              });
              if (type == "add") {
                me.addDialogVisible = false;
              } else {
                me.editDialogVisible = false;
              }

              if (type == "add") {
                me.updateTreeNode(type);
              } else {
                me.updateTreeNode(type, addForm);
              }
              this.disable = false;
              me.onLoad(this.page);
            })
            .catch(() => {
              this.disable = false;
            });
        }
      });
    },
    // 打开编辑弹框
    openEditDimension (row) {
      this.curDimension = row;
      this.editDialogVisible = true;
    },
    changeFilter (curVal, row) {
      let isOpen = curVal ? 1 : 0;
      let tipstr = "";
      isOpenFilterUrl(row.id, isOpen).then(() => {
        if (isOpen == 1) {
          tipstr = this.$t("dimensionManage.filterOpenTip");
          row.isFilter = "1";
        } else {
          tipstr = this.$t("dimensionManage.filterCloseTip");
          row.isFilter = "0";
        }
        this.$message({
          type: "success",
          message: tipstr,
        });
      });
    },
    nodeClick (data) {
      this.parentId = data.id;
      this.page.currentPage = 1;
      this.onLoad(this.page);
    },
    deleteDimension (row) {
      this.$confirm(this.$t("dimensionManage.confirmDeleteTip"), {
        confirmButtonText: this.$t("aicosCommon.confirmBtn"),
        cancelButtonText: this.$t("aicosCommon.cancelBtn"),
        type: "warning",
      })
        .then(() => {
          return deleteDimensionUrl(row.id, this.parentId);
        })
        .then(() => {
          this.$message({
            type: "success",
            message: this.$t("aicosCommon.deleteSuccessTip"),
          });
          this.updateTreeNode("del", row);
          this.onLoad(this.page);
        });
    },
    deletePatch () {
      if (this.selectionList.length === 0) {
        this.$message.warning(this.$t("aicosCommon.chooseDataTip"));
        return;
      }
      this.$confirm(this.$t("aicosCommon.mutiDeleteConfirmTip"), {
        confirmButtonText: this.$t("aicosCommon.confirmBtn"),
        cancelButtonText: this.$t("aicosCommon.cancelBtn"),
        type: "warning",
      })
        .then(() => {
          return deleteDimensionUrl(this.ids, this.parentId);
        })
        .then(() => {
          // 刷新表格数据并重载
          this.data = [];
          this.$refs.crud.refreshTable();
          this.$refs.crud.toggleSelection();
          // 表格数据重载
          this.onLoad(this.page);
          // 加载树
          this.updateTreeNode("patchDel");
          this.$message({
            type: "success",
            message: this.$t("aicosCommon.deleteSuccessTip"),
          });
        });
    },
    searchReset () {
      this.query = {
        dname: "",
      };
      this.page.currentPage = 1;
      this.onLoad(this.page);
    },
    searchChange () {
      this.page.currentPage = 1;
      this.onLoad(this.page, this.query);
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
      params = {
        pid: this.parentId,
        current: this.page.currentPage,
        size: this.page.pageSize,
        botId: this.botId,
      };
      getTableUrl(Object.assign(params, this.query)).then((res) => {
        this.data = res.data.data.records;
        this.loading = false;
        this.page.total = res.data.data.total;
        this.selectionClear();
      });
    },
    moveUp (row) {
      this.changeOrder(row, 0);
    },
    moveDown (row) {
      this.changeOrder(row, 1);
    },
    async changeOrder (row, type) {
      const { data } = await changeOrder(row.id, type);

      if (data.success) {
        this.$message.success(this.$t("dimensionManage.moveSuccessTip"));
        this.onLoad();
        this.updateTreeNode("move");
      }
    },
  },
  created () {
    // var query = {};

    // if (this.desktopWindow) {
    //   query = this.desktopWindow.data.query;

    //   // console.log(query.id);
    // }
    this.botId = this.$store.getters.botObj.id; // 机器人id
  },
  mounted () {
    // 收起左侧菜单
    if (!this.$store.getters.isCollapse) {
      this.$store.commit("SET_COLLAPSE");
    }
    this.$refs.dimensionTree.setCurrentKey("0");

    if (this.desktopWindow) {
      //获取窗口的大小
      this.allWindowTopBodyHeight =
        this.desktopWindow.$el.getElementsByClassName(
          "desk-window-inner"
        )[0].offsetHeight;
      //监听窗口变化,重新获取新的窗口大小
      this.desktopWindow.$on("resize", this.desktopWindowResize);
    }
  },
  beforeDestroy () {
    //组件销毁取消监听
    if (this.desktopWindow) {
      this.desktopWindow.$off("resize", this.desktopWindowResize);
    }
  },
};
</script>

<style lang="scss" scoped>
/deep/ .avue-crud__menu {
  display: none;
}
</style>
