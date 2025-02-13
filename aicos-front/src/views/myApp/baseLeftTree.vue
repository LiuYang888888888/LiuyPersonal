<template>
  <el-row>
    <avue-tree
      ref="deptTree"
      :option="treeOption.treeOption"
      :data="treeData"
      @node-click="nodeClickCurent"
      node-key="id"
    >
      <template v-slot="{ node, data }">
        <div
          class="custom-tree-node"
          @mouseenter="treeNodeMouseenter(node, data)"
          @mouseleave="treeNodeMouseleave(data)"
        >
          <div :title="node.label">{{ node.label }}</div>
          <div v-if="data && data.active">
            <el-button-group>
              <el-button
                style="padding: 3px"
                v-if="vaildData(permission['system-param-save'], false)"
                type="primary"
                size="mini"
                icon="el-icon-plus"
                title="新增"
                @click="dialogShow(node, 1)"
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
                @click="dialogShow(node, 2)"
              ></el-button>
              <el-button
                style="padding: 3px"
                v-if="
                  data.id !== '0' &&
                  deleIsLeaf &&
                  vaildData(permission['system-param-delete'], false)
                "
                type="primary"
                size="mini"
                icon="el-icon-delete"
                title="删除"
                @click="removeTreeNode(node)"
              >
              </el-button>
            </el-button-group>
          </div>
        </div>
      </template>
    </avue-tree>
    <HuilanDialog
      :title="title"
      append-to-body
      :visible.sync="itemDialogVisible"
      width="500px"
    >
      <el-form
        :model="form"
        ref="numberValidateForm"
        label-width="60px"
        size="mini"
      >
        <el-form-item
          label="名称"
          prop="name"
          :rules="[
            { required: true, message: '请输入名称' },
            {
              min: 1,
              max: 50,
              message: '长度在 1 到 50 个字符',
              trigger: 'blur',
            },
          ]"
        >
          <el-input v-model="form.name" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item style="text-align: right">
          <el-button type="primary" @click="submit('numberValidateForm')"
            >提交</el-button
          >
          <el-button @click="resetForm('numberValidateForm')">重置</el-button>
        </el-form-item>
      </el-form>
    </HuilanDialog>
  </el-row>
</template>
<script>
import { mapGetters } from "vuex";
import {
  applicationGetAiApplicationBusinesstypeListByParentId,
  applicationsaveTreeSave,
  applicationsaveTreeUpdate,
  applicationsaveTreeDelete,
} from "@/api/configure/application";
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

    saveCurent: {
      type: Function,
      default() {},
    },
    rowDelCurent: {
      type: Function,
      default() {},
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
            let parentId = { parentId: node.data.id };
            console.log(node);
            if (!me.flag) {
              me.resolve = resolve;
            }
            if (node.level === 0) {
              resolve([{ name: "全部业务", id: "0", active: false }]);
              return;
            }
            //eslint-disable-next-line
            applicationGetAiApplicationBusinesstypeListByParentId(
              parentId
            ).then((res) => {
              const data = res.data.data;
              me.treeItemId = parentId;
              me.treeItem = node;
              //eslint-disable-next-line
              setTimeout(() => {
                // if (parentId === 0) {
                // let curNodeId = "0";
                // let curNodeData = node.data;
                // if (data.length > 0) {
                //   curNodeId = data[0].id;
                //   curNodeData = data[0];
                // }
                //eslint-disable-next-line
                setTimeout(() => {
                  me.$refs.deptTree.setCurrentKey('0');
                  me.nodeClickCurent({ name: "全部业务", id: "0", active: false });
                }, 1000);
              });
              //eslint-disable-next-line
              setTimeout(() => {
                resolve(
                  data.map((item) => {
                    return {
                      ...item,
                      // leaf: (item.isLeaf = true),
                      active: false,
                    };
                  })
                );
              }, 500);
            });
          },
        },
      };
    },
  },
  data() {
    return {
      deleIsLeaf: false,
      title: "",
      treeData: [],
      rowData: [],
      rowDataNode: [],
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
      form: {
        parentId: null,
        isLeaf: "1",
        ancestors: null,
        name: null,
      },
      flag: 0,
    };
  },
  mounted() {},
  methods: {
    nodeClickCurent(data) {
      this.$emit("businesstypeIdSet", data.id);
    },
    treeNodeMouseenter(node, data) {
      data.active = true;
      if (data.isLeaf === "1") {
        this.deleIsLeaf = true;
      } else {
        this.deleIsLeaf = false;
      }
      // console.log(node)
    },
    treeNodeMouseleave(data) {
      data.active = false;
    },
    dialogShow(data, num) {
      this.itemDialogVisible = true;
      this.rowData = data.data;
      this.rowDataNode = data;
      this.form.parentId = data.data.id;
      if (num === 1) {
        this.title = "新增";
        if (this.$refs["numberValidateForm"]) {
          this.$refs["numberValidateForm"].resetFields();
          this.form.name = null;
        }
      } else {
        this.title = "编辑";
        this.form.name = data.data.name;
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
    closeTreeDirlog(itemDialogVisible) {
      this.itemDialogVisible = itemDialogVisible;
    },
    removeTreeNode(data) {
      const scope = this;
      this.$confirm("确定将选择数据删除?", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      }).then(() => {
        applicationsaveTreeDelete({ id: data.data.id }).then((res) => {
          if (res.data.success) {
            scope.$message({
              type: "success",
              message: "操作成功!",
            });
            data.parent.loaded = false;
            data.parent.expand();
          } else {
            scope.$message({
              type: "error",
              message: res.data.msg,
            });
          }
        });
      });
    },
    handleBack() {
      this.form = {};
      this.itemDialogVisible = false;
    },
    resetForm(formName) {
      this.$refs[formName].resetFields();
    },
    submit(formName) {
      const params = { ...this.form };
      const scope = this;
      this.$refs[formName].validate((valid) => {
        if (valid) {
          if (scope.title === "新增") {
            applicationsaveTreeSave(params).then((res) => {
              const data = res.data;
              if (data.success) {
                scope.$message.success("操作成功");
                // scope.treeOption.treeOption.treeLoad(
                //   scope.rowDataNode,
                //   scope.resolve
                // );
                scope.rowDataNode.loaded = false;
                scope.rowDataNode.expand();
              } else {
                scope.$message.error(data.msg);
              }
            });
          } else {
            let rowVal = { ...scope.rowData, name: scope.form.name };
            applicationsaveTreeUpdate(rowVal).then((res) => {
              const data = res.data;
              if (data.success) {
                scope.$message.success("操作成功");
                // if(scope.rowDataNode.parent.data.id === '0'){
                //   scope.rowDataNode.parent.level = 0
                // }
                // scope.treeOption.treeOption.treeLoad(
                //   scope.rowDataNode.parent,
                //   scope.resolve
                // );
                setTimeout(() => {
                  scope.rowDataNode.parent.loaded = false;
                  scope.rowDataNode.parent.expand();
                });
              } else {
                scope.$message.error(data.msg);
              }
            });
          }
          scope.itemDialogVisible = false;
        }
      });
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
