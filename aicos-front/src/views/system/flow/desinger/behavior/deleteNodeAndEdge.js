/**
 * 点击线上的或图形上的删除按钮，删除节点
 */
const config = {
  // Bind the event and its callback
  getEvents() {
    return {
      'node:click': 'onClick',
      'edge:click': 'onClick',
    };
  },
  /**
     * 处理拖拽事件
     * @param  {Object} event The handler
     */
  onClick(event) {
    const {target, item} = event
    if(target.get('name') === 'rect-state-icon') {
      // item.destroy();
      this.graph.removeItem(item)
    }
  }
}
export default {
  name: 'deleteNodeAndEdge',
  config
}
