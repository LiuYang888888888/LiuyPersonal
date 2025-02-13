<template>
  <el-row>
    <avue-tree
      ref="deptTree"
      :option="treeOption.treeOption"
      :data="treeData"
      @node-click="nodeClickCurent"
    >
      <template v-slot="{ node, data }">
        <div
          class="custom-tree-node"
          @mouseenter="treeNodeMouseenter(data,node)"
          @mouseleave="treeNodeMouseleave(data)"
        >
          <div :title="node.label">{{ node.label }}</div>
          <div v-if="data && data.active">
            <el-button-group>
              <el-button
                style="padding: 3px"
                v-if="
                  data.id === '0' &&
                  vaildData(permission['system-param-save'], false)
                "
                type="primary"
                size="mini"
                icon="el-icon-plus"
                title="新增"
                @click="dialogShow(data, 1)"
              ></el-button>
              <el-button
                style="padding: 3px"
                v-if="
                  data.id !== '0' &&
                  vaildData(permission['system-param-update'], false)
                "
                type="primary"
                size="mini"
                icon="el-icon-edit"
                title="编辑"
                @click="dialogShow(data, 2)"
              ></el-button>
              <el-button
                style="padding: 3px"
                v-if="
                  data.id !== '0' &&
                  vaildData(permission['system-param-delete'], false)
                "
                type="primary"
                size="mini"
                icon="el-icon-delete"
                title="删除"
                @click="removeTreeNode(data)"
              ></el-button>
            </el-button-group>
          </div>
        </div>
      </template>
    </avue-tree>
    <HuilanDialog
      :title="`[${dictName}]参数项管理`"
      append-to-body
      :visible.sync="itemDialogVisible"
      width="500px"
      @opened="handleDicItemDialogOpened"
      class="dialog"
    >
      <avue-form
        v-if="itemDialogVisible"
        :option="formOption"
        ref="itemForm"
        v-model="form"
        @submit="save"
      >
        <template slot="menuForm" class="menuForm">
          <el-button icon="el-icon-circle-close" @click="handleBack()"
            >返 回</el-button
          >
        </template>
      </avue-form>
    </HuilanDialog>
  </el-row>
</template>
<script>
import { mapGetters } from "vuex";
export default {
  name: "DynamicTree",
  props: {
    nodeClick: {
      type: Function,
      default() {},
    },
    getSysParamList: {
      type: Function,
      default() {},
    },
    formOption: {
      type: Function,
      default() {},
    },
    saveCurent: {
      type: Function,
      default() {},
    },
    rowDelCurent: {
      type: Function,
      default() {},
    },
    parentformOption: {
      type: Object,
    },
    dictName: {
      type: String,
      default: "",
    },
  },
  computed: {
    ...mapGetters(["permission", "userInfo"]),
    treeOption() {
      const me = this;
      return {
        treeOption: {
          menu: false,
          addBtn: false,
          nodeKey: "id",
          lazy: true,
          props: {
            label: "name",
            children: "children",
            // 设置了value后getNode才能通过key获取节点
            value: "id",
          },
          defaultExpandedKeys: ["0"],
          treeLoad: function (node, resolve) {
            let parentId = node.data.id;
            console.log(node);
            if (!me.flag) {
              me.resolve = resolve;
            }
            if (node.level === 0) {
              resolve([{ name: "参数分类", id: "0", active: false }]);
              return;
            }
            //eslint-disable-next-line
            me.getSysParamList(parentId).then((res) => {
              const data = res.data.data;
              me.treeItemId = parentId;
              me.treeItem = node;
              //eslint-disable-next-line
              setTimeout(() => {
                // if (parentId === 0) {
                let curNodeId = '0';
                // let curNode = node;
                let curNodeData = node.data
                if (data.length > 0) {
                  curNodeId = data[0].id
                  curNodeData = data[0]
                }
                me.$refs.deptTree.setCurrentKey(curNodeId);
                me.nodeClickCurent(curNodeData);
                // }
              });
              resolve(
                data.map((item) => {
                  return {
                    ...item,
                    leaf: (item.isLeaf = true),
                    active: false,
                  };
                })
              );
            });
          },
        },
      };
    },
  },
  data() {
    return {
      treeData: [],
      page: {
        pageSize: 10,
        currentPage: 1,
        total: 0,
      },
      node: null,
      resolve: null,
      root: "true",
      treeItemId: null,
      treeItem: null,
      itemDialogVisible: false,
      // formOption: {},
      form: {},
      flag:0,
    };
  },
  created() {
    this.formOption = this.parentformOption;
  },
  methods: {
    nodeClickCurent(data) {
      this.nodeClick(data);
      // 修改人员时使用
      // const deptId = this.findObject(this.option.group, "deptId");
      // if (data.ancestors && data.ancestors !== "") {
      //   deptId.defaultExpandedKeys = data.ancestors.split(",");
      // }
    },
    updateTreeNode(type, data) {
      const deptTree = this.$refs.deptTree;
      const curParent = deptTree.getNode(this.treeItemId);
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
        const curNode = deptTree.getNode(data.id);
        if (curNode) {
          curNode.data = data;
        }
      } else if (type === "del") {
        deptTree.remove(data.id);
      }
    },
    //eslint-disable-next-line
    treeNodeMouseenter(data,node) { 
      data.active = true;
    },
    treeNodeMouseleave(data) {
      data.active = false;
    },
    dialogShow(data, num) {
      this.itemDialogVisible = true;
      this.flag = num;
      //1新增；2编辑
      if (num === 2) {
        this.editItem = data;
        this.form = data;
        this.formOption.column.map((v) => {
          if (v.prop === "code") {
            v.disabled = true;
          }
        });
      } else {
        this.form = {};
        // this.$refs.itemForm.clearVal();
        this.formOption.column.map((v) => {
          if (v.prop === "code") {
            v.disabled = false;
          }
        });
      }
    },
    save(parent, data, done, loading) {
      const form = {
        ...this.form,
      };
      // 1为新增，2为编辑
      const parmas = {
        form,
        flag: this.flag,
        leftTree: this.$refs.deptTree,
        itemDialogVisible: this.itemDialogVisible,
        resolve: this.resolve,
      };
      this.saveCurent(parent, data, done, loading, parmas);
    },
    closeTreeDirlog(itemDialogVisible){
      this.itemDialogVisible = itemDialogVisible
    },
    removeTreeNode(data,done){
      this.rowDelCurent(data,done,this.resolve)
    },
    handleBack() {
      this.form = {};
      this.itemDialogVisible = false;
    },
  },
};
</script>
<style lang="scss">
.tree-select {
  width: 100%;
}
.tree-scrollbar-wrapper {
  max-height: 50vh;
}
.tree-select-popover {
  .el-tree-node {
    .selected {
      color: #409eff;
      font-weight: 700;
    }
  }
}
.popover-reference {
  line-height: normal;
}
.custom-tree-node {
  flex: 1;
  display: flex;
  width: 0;
  > div:first-child {
    flex: 1;
    font-size: 14px;
    overflow: hidden;
    text-overflow: ellipsis;
  }
}
.dialog {
  /deep/ {
    .el-form-item__content {
      text-align: right;
    }
    .el-dialog__body {
      padding-bottom: 0;
    }
  }
}
</style>
