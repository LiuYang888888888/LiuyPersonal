/**
 * 定义服务节点
 */

export default {
  shapeType: 'serviceTask',
  getCustomConfig() {
    return {
      stateIcon: false,
      linkPoints: {
        top: true,
        right: true,
        bottom: true,
        left: true
      },
      anchorPoints: [
        [0, 0.5],
        [1, 0.5],
        [0.5, 0],
        [0.5, 1]
      ]
    }
  },
  afterDraw(cfg, group) {
    const allPoints = group.findAll(item => item.get('isAnchorPoint'))
    console.log(allPoints)
    allPoints.forEach((item,index) => {
      item.set('draggable', true)
      item.set('anchorPointIdx', index)
    })
  }
}