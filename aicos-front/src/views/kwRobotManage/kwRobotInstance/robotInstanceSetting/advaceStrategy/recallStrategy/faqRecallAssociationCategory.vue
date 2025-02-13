<template>
  <el-form size="small" label-width="100px">
    <el-form-item :label="$t('kwRobotManage.inheritParent')">
      <el-switch v-model="isExtend" />
    </el-form-item>
    <el-form-item :label="$t('kwRobotManage.knowledgeCatalog')">
      <div class="tree-container">
        <el-tree
          :props="props"
          highlight-current="true"
          :default-expanded-keys="defaultExpand"
          :load="loadNode"
          node-key="id"
          lazy
          check-strictly
          show-checkbox
          check-on-click-node
          :expand-on-click-node="false"
          ref="tree"
          @check-change="handleCheckChange"
        >
          <template v-slot="slotProps">
            <HuilanActionTreeNode
              :data="slotProps"
              actionType="button"
              :actions="getAction(slotProps.data)"
              @command="handleCommand"
            >
            </HuilanActionTreeNode>
          </template>
        </el-tree>
      </div>
      <div class="tree-container">
        <el-tree
          :props="props"
          highlight-current="true"
          :default-expanded-keys="defaultExpand"
          :load="chatLoadNode"
          node-key="id"
          lazy
          check-strictly
          show-checkbox
          check-on-click-node
          :expand-on-click-node="false"
          ref="chatTree"
          @check-change="chatHandleCheckChange"
        >
          <template v-slot="slotProps">
            <HuilanActionTreeNode
              :data="slotProps"
              actionType="button"
              :actions="getAction(slotProps.data)"
              @command="handleCommand"
            >
            </HuilanActionTreeNode>
          </template>
        </el-tree>
      </div>
    </el-form-item>
  </el-form>
</template>
<script>
import { treeList } from "@/api/kwKnowledgeCenter/kwClassifySetting/index";
import { deepClone } from "@/util/util";
export default {
  name: "faqRecallAssociationCategory",
  props: {
    extend: {
      type: Boolean,
      default: false,
    },
    selectedIds: {
      type: Array,
      default: () => [],
    },
    ids: {
      type: String,
      default: "",
    },
  },
  data() {
    return {
      isExtend: this.extend,
      props: {
        label: "dname",
        children: "children",
        // 设置了value后getNode才能通过key获取节点
        // value: "id",
        isLeaf: "leaf",
      },
      defaultExpand: ["0"],
      botId: this.$store.getters.botObj.id,
      itemIds: { faqCategoryIds: [], chatCategoryIds: [] },
    };
  },
  watch: {
    isExtend(newVal) {
      if (newVal) {
        this.applyExtendChecked();
      } else {
        // 更新disabled状态
        this.applyExtendUnChecked();
      }
    },
  },
  mounted() {
    if (!this.validatenull(this.ids)) {
      this.itemIds = JSON.parse(deepClone(this.ids));
    }
  },
  methods: {
    // initSelectIds() {
    //   // const tree = this.$refs.tree;
    //   // const selectedIds = this.selectedIds;
    // },
    applyExtendChecked() {
      const tree = this.$refs.tree;
      const checkedKeys = tree.getCheckedKeys();

      checkedKeys.forEach((key) => {
        const node = tree.getNode(key);
        if (!node.isLeaf) {
          this.handeSelectAllChildren(node);
        }
      });
      // 闲聊知识
      const chatTree = this.$refs.chatTree;
      const chatCheckedKeys = chatTree.getCheckedKeys();
      chatCheckedKeys.forEach((key) => {
        const node = chatTree.getNode(key);
        if (!node.isLeaf) {
          this.handeSelectAllChildren(node);
        }
      });
    },
    applyExtendUnChecked() {
      const tree = this.$refs.tree;
      const checkedDates = tree.getCheckedNodes();
      checkedDates.forEach((data) => {
        data.disabled = false;
        const node = tree.getNode(data);
        if (!node.isLeaf) {
          this.handleUnselectAllChildren(node);
        }
      });

      // 闲聊知识
      const chatTree = this.$refs.chatTree;
      const chatCheckedDates = chatTree.getCheckedNodes();
      chatCheckedDates.forEach((data) => {
        data.disabled = false;
        const node = chatTree.getNode(data);
        if (!node.isLeaf) {
          this.handleUnselectAllChildren(node);
        }
      });
    },
    getCheckedIds() {
      const oldSelectedIds = [...this.itemIds.faqCategoryIds],
        oldChatSelectedIds = [...this.itemIds.chatCategoryIds];
      const tree = this.$refs.tree,
        chatTree = this.$refs.chatTree;
      const nodes = tree.getCheckedNodes(),
        chatNodes = chatTree.getCheckedNodes();

      let filteredNodes = nodes,
        chatFilteredNodes = chatNodes;
      if (this.isExtend) {
        filteredNodes = nodes.filter((node) => {
          let flag = !node.disabled;
          // if(flag && node.key === '0') {
          //   flag = false;
          // }
          return flag;
        });
        chatFilteredNodes = chatNodes.filter((node) => {
          let flag = !node.disabled;
          // if(flag && node.key === '0') {
          //   flag = false;
          // }
          return flag;
        });
      }

      const checkedIds = filteredNodes.map((node) => node.id);
      const chatCheckedIds = chatFilteredNodes.map((node) => node.id);
      // 由于是异步加载有些节点可能没加载过来,在提交的时候需要加回去
      const unLoadIds = oldSelectedIds.filter((id) => {
        let flag = true;
        const node = tree.getNode(id);
        if (node) {
          flag = false;
        }
        return flag;
      });
      const chatUnLoadIds = oldChatSelectedIds.filter((id) => {
        let flag = true;
        const node = chatTree.getNode(id);
        if (node) {
          flag = false;
        }
        return flag;
      });
      const res = [
        ...checkedIds,
        ...chatCheckedIds,
        ...unLoadIds,
        ...chatUnLoadIds,
      ];
      if (!res.includes("-1")) {
        if (res.includes("0") && this.isExtend) {
          res.push("-1");
        }
      } else {
        if (this.isExtend) {
          if (!res.includes("0")) {
            res.splice(res.indexOf("-1"), 1);
          }
        } else {
          res.splice(res.indexOf("-1"), 1);
        }
      }
      return {
        categoryIds: res,
        faqRecallData: JSON.stringify({
          faqCategoryIds: checkedIds,
          chatCategoryIds: chatCheckedIds,
        }),
      };
    },
    getSelectedInfo() {
      let data = this.getCheckedIds();
      let obj = {
        lookupCategoryDescendants: this.isExtend,
        categoryIds: data.categoryIds,
        faqRecallData: data.faqRecallData,
      };
      return obj;
    },
    getAction(data) {
      const actions = [];
      if (this.isExtend) {
        return actions;
      }
      if (data.leaf) {
        return actions;
      }

      actions.push(
        {
          name: this.$t("kwRobotManage.all"),
          command: "selectAllChildren",
        },
        {
          name: this.$t("kwRobotManage.deselectAll"),
          command: "unselectAllChildren",
        }
      );
      return actions;
    },
    handleCommand(command, data) {
      this[command](data);
    },
    selectAllChildren({ /*data, */ node }) {
      this.handeSelectAllChildren(node);
    },
    async handeSelectAllChildren(node) {
      let childNodes = node.childNodes;
      if (node.shouldLoadData() && !node.loading) {
        await new Promise((resolve) => {
          node.loadData(() => {
            setTimeout(() => {
              resolve();
            }, 1000);
          });
        });
        childNodes = node.childNodes;
      }
      // if(node.shouldLoadData()) {
      //   node.loadData(data=>{
      //     console.log(data)
      //     data.forEach(item=>{
      //       item.disabled = true;
      //     })
      //   },{checked: true});
      // }else {
      node.setChecked(true);
      node.childNodes.forEach((child) => {
        if (this.isExtend) {
          child.data.disabled = true;
        }
        child.setChecked(true);
        if (!child.isLeaf) {
          this.handeSelectAllChildren(child);
        }
      });
      // }
    },
    unselectAllChildren({ node }) {
      this.handleUnselectAllChildren(node);
    },
    handleUnselectAllChildren(node) {
      // node.setChecked(false);
      node.childNodes.forEach((child) => {
        child.data.disabled = false;
        child.setChecked(false);
        if (!child.isLeaf) {
          this.handleUnselectAllChildren(child);
        }
      });
    },
    async loadNode(node, resolve) {
      if (node.level === 0) {
        resolve([
          { id: "0", dname: this.$t("kwRobotManage.FAQKnowledgeClass") },
        ]);
        // 初始化选中状态
        if (this.selectedIds.includes("0")) {
          const root = node.childNodes[0];
          root.setChecked(true);
        }
        return;
      }
      const parentId = node.data.id;
      const info = {
        ancestors: parentId,
        botId: this.botId,
        classType: "faq",
        // 是否需要返回我的收藏节点
        mine: false,
      };
      const { data } = await treeList(info);
      if (data.success) {
        const children = data.data.map((item) => {
          return {
            ...item,
            leaf: item.isLeaf !== 0,
            disabled: false,
          };
        });
        resolve(children);

        // debugger
        // 初始化选中状态
        node.childNodes.forEach((child) => {
          if (this.isExtend && node.checked) {
            child.data.disabled = true;
            child.setChecked(true);
          } else {
            if (this.itemIds.faqCategoryIds.includes(child.key)) {
              child.setChecked(true);
              // this.handleCheckChange(child.data, true);
            }
          }
        });
      }
    },
    async chatLoadNode(node, resolve) {
      if (node.level === 0) {
        resolve([
          { id: "0", dname: this.$t("kwRobotManage.chattingKnowledgeClass") },
        ]);
        // 初始化选中状态
        if (this.selectedIds.includes("0")) {
          const root = node.childNodes[0];
          root.setChecked(true);
        }
        return;
      }
      const parentId = node.data.id;
      const info = {
        ancestors: parentId,
        botId: this.botId,
        classType: "gossip",
        // 是否需要返回我的收藏节点
        mine: false,
      };
      const { data } = await treeList(info);
      if (data.success) {
        const children = data.data.map((item) => {
          return {
            ...item,
            leaf: item.isLeaf !== 0,
            disabled: false,
          };
        });
        resolve(children);

        // debugger
        // 初始化选中状态
        node.childNodes.forEach((child) => {
          if (this.isExtend && node.checked) {
            child.data.disabled = true;
            child.setChecked(true);
          } else {
            if (this.itemIds.chatCategoryIds.includes(child.key)) {
              child.setChecked(true);
              // this.handleCheckChange(child.data, true);
            }
          }
        });
      }
    },
    handleCheckChange(data, checked) {
      if (!this.isExtend) {
        return;
      }
      const tree = this.$refs.tree;
      const node = tree.getNode(data.id);
      if (node.isLeaf) {
        return;
      }
      if (checked) {
        this.handeSelectAllChildren(node);
      } else {
        this.handleUnselectAllChildren(node);
      }
    },
    chatHandleCheckChange(data, checked) {
      if (!this.isExtend) {
        return;
      }
      const tree = this.$refs.chatTree;
      const node = tree.getNode(data.id);
      if (node.isLeaf) {
        return;
      }
      if (checked) {
        this.handeSelectAllChildren(node);
      } else {
        this.handleUnselectAllChildren(node);
      }
    },
  },
};
</script>

<style scoped lang="scss">
.tree-container {
  height: 300px;
  overflow: auto;
}
</style>
