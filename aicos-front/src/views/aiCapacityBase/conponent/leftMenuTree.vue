<template>
  <basic-container>
    <avue-tree class="leftMenuTree" ref="menuTree" :option="treeOption" :data="treeData" @node-click="nodeClick"
      :key="key" />
  </basic-container>
</template>
<script>

import {
  getAllAiAbilityList,
} from "@/api/configure/application";
export default {
  name: "paramItemList",
  components: {
  },
  props: {
    category1: {
      type: String,
      default() {
        return ''
      }
    },
    category2: {
      type: String,
      default() {
        return ''
      }
    },
  },
  data() {
    const self = this
    return {
      treeData: [],
      treeId: '',
      key: 0,
      listId: [],
      headerTitle: '',
      dataList: [],
      preTreeid: '',
      treeLoadPra: {
        node: {},
        resolve: {},
      },
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
          if (node.level === 0) {
            // this.treeLoadPra.node = node
            // this.treeLoadPra.resolve = resolve
            resolve([{ name: "AI能力", id: "0", disabled: true  }]);
            return;
          }
          let arr = []
          getAllAiAbilityList({}).then((res) => {
            self.dataList = res.data.data
            res.data.data.map((item) => {
              // if (self.category1 === item.category1 && self.headerTitle !== 'apply') {
              //   arr.push({
              //     ...item,
              //     leaf: true,
              //   })
              // }
              if (self.headerTitle === 'apply') {
                if (self.listId.includes(item.id)) {
                  arr.push({
                    ...item,
                    leaf: true,
                  })
                }
              } else {
                if (self.category1 === item.category1 && item.category1 === 'voice' && item.category2 === self.category2) {
                  arr.push({
                    ...item,
                    leaf: true,
                  })
                } else {
                  if (self.category1 === item.category1 && item.category1 !== 'voice') {
                    arr.push({
                      ...item,
                      leaf: true,
                    })
                  }
                }
              }
            })
            resolve(arr)
            setTimeout(() => {
              if (self.treeId) {
                self.$refs.menuTree.setCurrentKey(self.treeId)
                const nodeData = self.$refs.menuTree.getCurrentNode(self.treeId)
                self.nodeClick(nodeData)
              } else {
                self.$refs.menuTree.setCurrentKey(res.data.data[0].id)
              }
            }, 500)
          });
        },
      },
    };
  },
  computed: {},
  created() {

  },
  methods: {
    nodeClick(data) {
      if (data.id === '0') {
        this.$message.error('不能选择根节点')
        this.$refs.menuTree.setCurrentKey(this.preTreeid)
        return false
      }
      this.preTreeid = data.id
      this.$emit('nodeTreetab', data)
    },
    setCurrentKey(treeId) {
      this.treeId = treeId
      // this.$refs.menuTree.setCurrentKey(treeId)

    },
    setTreeAplly(listId, headerTitle) {
      this.listId = listId
      this.headerTitle = headerTitle
      // this.treeOption.treeLoad(this.treeLoadPra.node, this.treeLoadPra.resolve)
      this.treeId = listId[0]
      this.key++
      // const arr = []
      // getAllAiAbilityList({}).then((res) => {
      //   res.data.data.map((v) => {
      //     if (listId.includes(v.id)) {
      //       arr.push(v)
      //     }
      //   })
      //   self.treeData = arr
      // })
    }
  },
};
</script>

<style lang="scss" scoped>
// .leftMenuTree {
//   height: 100vh;
//   display: flex;
//   flex-direction: column;
// }
</style>
