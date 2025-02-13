<template>
  <div>
    <avue-tree
      ref="deptTree"
      :option="treeOption.treeOption"
      :data="treeData"
      @node-click="nodeClickCurent"
    />
  </div>
</template>
<script>
import { getCanBeManagerDeptLazyTree } from "@/api/system/dept";
export default {
  name: "DynamicTree",
  props: {
    // getCanBeManagerDeptLazyTree: {
    //   type: Function,
    //   default() {},
    // },
    nodeClick: {
      type: Function,
      default() {},
    },
  },
  computed: {
    treeOption() {
      const me = this;
      return {
        treeOption: {
          menu: false,
          addBtn: false,
          nodeKey: "id",
          lazy: true,
          props: {
            label: "deptName",
            children: "children",
            // 设置了value后getNode才能通过key获取节点
            value: "id",
          },
          defaultExpandedKeys: ["0"],
          treeLoad: function (node, resolve) {
            let parentId = node.data.id;
            if (node.level === 0) {
              resolve([
                { deptName: "部门管理", id: "0", active: false },
              ]);
              return;
            }
            //eslint-disable-next-line
            getCanBeManagerDeptLazyTree(parentId).then((res) => {
              const data = res.data.data.retList || [];
              const root = res.data.data.root || '';
              me.treeItemId = parentId;
              me.treeItem = node;
              //eslint-disable-next-line
              setTimeout(() => {
                if (parentId === "0") {
                  me.root = root;
                  let curNodeId = '0';
                  let curNode = node;
                  let curNodeData = node.data
                  if (data.length > 0) {
                    curNodeId = data[0].id
                    // me.$refs.deptTree.setCurrentKey(data[0].id);
                    curNode = me.$refs.deptTree.getNode(curNodeId)
                    curNodeData = data[0]
                    // me.nodeClickCurent(data[0],curNode);
                  }
                  me.$refs.deptTree.setCurrentKey(curNodeId);
                  me.nodeClickCurent(curNodeData,curNode);
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
    };
  },
  created() {},
  methods: {
    nodeClickCurent(data,node) {
      // if (data.id === '0') {
      //   if (this.root === "false") {
      //     this.$message.error("没有部门权限");
      //     return;
      //   }
      // } else {
      //   if (data.isManager !== "1") {
      //     this.$message.error("没有部门权限");
      //     return;
      //   }
      // }
      this.nodeClick(data,node,this.root);
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
</style>
