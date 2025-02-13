export default {
  methods: {
    addTreeNode(data) {
      const leftTree = this.$refs.leftTree
      leftTree.node = this.deepClone(data)
      leftTree.rowAdd(data)
    },
    editTreeNode(data) {
      console.log(data)
      const leftTree = this.$refs.leftTree
      leftTree.node = this.deepClone(data)
      leftTree.rowEdit()
    },
    removeTreeNode(data) {
      const leftTree = this.$refs.leftTree
      leftTree.node = this.deepClone(data)
      this.$confirm('确定将选择数据删除?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        leftTree.rowRemove()
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        });          
      });
    }
  }
}
