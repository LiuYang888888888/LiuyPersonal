/**
 * 基础交互样式
 */
const config = {
  selectedItem: null,
  // Bind the event and its callback
  getEvents() {
    return {
      'edge:mouseenter': 'onMouseEnter',
      'edge:mouseleave': 'onMouseLeave',
      'edge:click': 'onClick',
      'node:mouseenter': 'onMouseEnter',
      'node:mouseleave': 'onMouseLeave',
      'node:click': 'onClick',
      'canvas:click': 'canvasClick',
    };
  },
  onMouseEnter(event) {
    const { item } = event;
    this.graph.setItemState(item, 'active', true);
  },
  onMouseLeave(event) {
    const { item } = event;
    this.graph.setItemState(item, 'active', false);
  },
  onClick(event) {
    const { item } = event;
    if(item.destroyed) {
      return
    }
    this.clearSelectItem()
    this.selectedItem = item
    this.graph.setItemState(item, 'selected', true);
  },
  clearSelectItem() {
    if(this.selectedItem && !this.selectedItem.destroyed) {
      this.graph.clearItemStates(this.selectedItem);
    }
  },
  canvasClick(/*event*/) {
    // this.graph.getEdges().forEach((edge) => {
    //   this.graph.clearItemStates(edge);
    // });
    this.clearSelectItem()
  }
}
export default {
  name: 'baseInteract',
  config
}
