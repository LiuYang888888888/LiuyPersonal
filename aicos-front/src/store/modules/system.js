import {
  setStore,
} from '@/util/store'

const system = {
  state: {
    // 流程设计器中的节点属性是否打开
    dialogVisible: true,
  },
  mutations: {
    SET_DIALOGVISIBLE: (state, dialogVisible) => {
      state.dialogVisible = dialogVisible
      setStore({
        name: 'dialogVisible',
        content: state.dialogVisible
      })
    },
  },
}
export default system
